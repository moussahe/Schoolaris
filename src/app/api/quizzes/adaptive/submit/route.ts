// Adaptive Quiz Submission API
// POST /api/quizzes/adaptive/submit

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  generateQuizFeedback,
  extractWeakAreas,
  type QuizFeedbackContext,
} from "@/lib/ai-quiz";
import { awardXP, XP_REWARDS, checkAndAwardBadges } from "@/lib/gamification";

const submitSchema = z.object({
  lessonId: z.string().cuid(),
  childId: z.string().cuid(),
  score: z.number().min(0).max(100),
  correctCount: z.number().min(0),
  totalQuestions: z.number().min(1),
  timeSpent: z.number().min(0),
  questions: z.array(
    z.object({
      question: z.string(),
      selectedAnswer: z.string(),
      correctAnswer: z.string(),
      isCorrect: z.boolean(),
    }),
  ),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    // 2. Validation
    const body = await req.json();
    const validated = submitSchema.parse(body);

    // 3. Verify child belongs to parent
    const child = await prisma.child.findFirst({
      where: {
        id: validated.childId,
        parentId: session.user.id,
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Enfant non trouve" }, { status: 404 });
    }

    // 4. Get lesson info for feedback context
    const lesson = await prisma.lesson.findUnique({
      where: { id: validated.lessonId },
      include: {
        chapter: {
          include: {
            course: {
              select: {
                subject: true,
                gradeLevel: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lecon non trouvee" }, { status: 404 });
    }

    // 5. Calculate XP based on performance
    let xpEarned = 0;
    const isPerfect = validated.score === 100;
    const passed = validated.score >= 70;

    if (isPerfect) {
      xpEarned = XP_REWARDS.QUIZ_PERFECT;
    } else if (passed) {
      xpEarned = XP_REWARDS.QUIZ_PASS;
    } else {
      xpEarned = XP_REWARDS.QUIZ_COMPLETE;
    }

    // 6. Update progress
    await prisma.progress.upsert({
      where: {
        childId_lessonId: {
          childId: validated.childId,
          lessonId: validated.lessonId,
        },
      },
      create: {
        childId: validated.childId,
        lessonId: validated.lessonId,
        quizScore: validated.score,
        isCompleted: passed,
        timeSpent: validated.timeSpent,
      },
      update: {
        quizScore: validated.score,
        isCompleted: passed,
        timeSpent: {
          increment: validated.timeSpent,
        },
        lastAccessedAt: new Date(),
      },
    });

    // 7. Award XP
    await awardXP(validated.childId, xpEarned);

    // 8. Check for new badges
    await checkAndAwardBadges(validated.childId);

    // 9. Generate AI feedback
    const wrongAnswers = validated.questions
      .filter((q) => !q.isCorrect)
      .map((q) => ({
        question: q.question,
        selectedAnswer: q.selectedAnswer,
        correctAnswer: q.correctAnswer,
      }));

    const feedbackContext: QuizFeedbackContext = {
      childName: child.firstName,
      gradeLevel: lesson.chapter.course.gradeLevel,
      subject: lesson.chapter.course.subject,
      lessonTitle: lesson.title,
      score: validated.score,
      totalPoints: validated.totalQuestions,
      correctCount: validated.correctCount,
      totalQuestions: validated.totalQuestions,
      wrongAnswers,
    };

    let feedback;
    try {
      feedback = await generateQuizFeedback(feedbackContext);
    } catch (error) {
      console.error("Failed to generate AI feedback:", error);
      // Continue without AI feedback
    }

    // 10. Extract and save weak areas from wrong answers
    if (wrongAnswers.length > 0) {
      try {
        const extractedWeakAreas = await extractWeakAreas(
          wrongAnswers,
          lesson.chapter.course.subject,
          lesson.title,
        );

        // Upsert weak areas - increment error count if exists, create if not
        for (const weakArea of extractedWeakAreas) {
          await prisma.weakArea.upsert({
            where: {
              childId_subject_topic: {
                childId: validated.childId,
                subject: lesson.chapter.course.subject,
                topic: weakArea.topic,
              },
            },
            create: {
              childId: validated.childId,
              subject: lesson.chapter.course.subject,
              topic: weakArea.topic,
              gradeLevel: lesson.chapter.course.gradeLevel,
              category: weakArea.category,
              errorCount: 1,
              attemptCount: 1,
            },
            update: {
              errorCount: { increment: 1 },
              attemptCount: { increment: 1 },
              lastErrorAt: new Date(),
              category: weakArea.category,
            },
          });
        }
      } catch (weakAreaError) {
        // Log but don't fail the request
        console.error("Failed to save weak areas:", weakAreaError);
      }
    }

    // 11. Mark weak areas as resolved if correct (mastery detection)
    if (validated.score >= 90) {
      // High performance suggests mastery - resolve related weak areas
      await prisma.weakArea.updateMany({
        where: {
          childId: validated.childId,
          subject: lesson.chapter.course.subject,
          isResolved: false,
          // Only resolve if they've attempted this topic multiple times successfully
          attemptCount: { gte: 3 },
          errorCount: { lte: 2 }, // Low error rate
        },
        data: {
          isResolved: true,
          resolvedAt: new Date(),
        },
      });
    }

    // 12. Create alert for parent if score is low
    if (validated.score < 50) {
      await prisma.alert.create({
        data: {
          parentId: session.user.id,
          childId: validated.childId,
          type: "LOW_QUIZ_SCORE",
          priority: "MEDIUM",
          title: `Score faible au quiz`,
          message: `${child.firstName} a obtenu ${validated.score}% au quiz de la lecon "${lesson.title}". Un peu de revision pourrait aider!`,
          metadata: {
            lessonId: validated.lessonId,
            lessonTitle: lesson.title,
            score: validated.score,
            courseTitle: lesson.chapter.course.title,
          },
          actionUrl: `/parent/courses/${lesson.chapter.course.title}/lessons/${validated.lessonId}`,
        },
      });
    }

    // 13. Return result
    return NextResponse.json({
      success: true,
      score: validated.score,
      passed,
      isPerfect,
      xpEarned,
      feedback,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation echouee", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Adaptive quiz submit error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
