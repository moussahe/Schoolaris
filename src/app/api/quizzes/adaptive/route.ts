// Adaptive Quiz API - Generates personalized questions with AI
// POST /api/quizzes/adaptive

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  generateAdaptiveQuestions,
  type Difficulty,
  type QuizGenerationContext,
} from "@/lib/ai-quiz";

const requestSchema = z.object({
  lessonId: z.string().cuid(),
  childId: z.string().cuid(),
  currentDifficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  questionCount: z.number().min(1).max(10).default(3),
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
    const validated = requestSchema.parse(body);

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

    // 4. Get lesson with course info
    const lesson = await prisma.lesson.findUnique({
      where: { id: validated.lessonId },
      include: {
        chapter: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                subject: true,
                gradeLevel: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lecon non trouvee" }, { status: 404 });
    }

    // 5. Get previous performance for this child in this subject
    const previousProgress = await prisma.progress.findMany({
      where: {
        childId: validated.childId,
        lesson: {
          chapter: {
            course: {
              subject: lesson.chapter.course.subject,
            },
          },
        },
        quizScore: { not: null },
      },
      select: {
        quizScore: true,
      },
      take: 10,
      orderBy: { updatedAt: "desc" },
    });

    // Calculate average performance
    const scores = previousProgress
      .map((p) => p.quizScore)
      .filter((s): s is number => s !== null);
    const averageScore =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 50;

    // 6. Fetch weak areas for this child and subject
    const weakAreas = await prisma.weakArea.findMany({
      where: {
        childId: validated.childId,
        subject: lesson.chapter.course.subject,
        isResolved: false,
      },
      orderBy: [{ errorCount: "desc" }, { lastErrorAt: "desc" }],
      take: 5, // Get top 5 weak areas
    });

    const weakAreaTopics = weakAreas.map((wa) => wa.topic);

    // 7. Build context for AI
    const context: QuizGenerationContext = {
      subject: lesson.chapter.course.subject,
      gradeLevel: lesson.chapter.course.gradeLevel,
      lessonTitle: lesson.title,
      lessonContent: lesson.content || lesson.description || "",
      currentDifficulty: validated.currentDifficulty as Difficulty,
      previousPerformance:
        scores.length > 0 || weakAreaTopics.length > 0
          ? {
              correctRate: averageScore / 100,
              weakAreas: weakAreaTopics,
            }
          : undefined,
    };

    // 8. Generate questions with AI
    const questions = await generateAdaptiveQuestions(context);

    // 9. Return questions
    return NextResponse.json({
      success: true,
      questions: questions.slice(0, validated.questionCount),
      difficulty: validated.currentDifficulty,
      context: {
        subject: lesson.chapter.course.subject,
        lessonTitle: lesson.title,
        gradeLevel: lesson.chapter.course.gradeLevel,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation echouee", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Adaptive quiz error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
