// API Route: Exam Mode - Submit and Evaluate Exam
// POST /api/exam-mode/submit - Submit exam answers and get results

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { evaluateExamAnswer, generateExamAnalysis } from "@/lib/ai-exam-mode";
import {
  calculateGrade,
  calculateExamXP,
  type ExamQuestion,
  type ExamSubject,
  type QuestionResult,
} from "@/types/exam";
import { checkAndAwardBadges, awardXP } from "@/lib/gamification";

// Zod schema for ExamQuestion - matching TypeScript ExamQuestion type
const examQuestionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean(),
});

const examQuestionSolutionSchema = z.object({
  correctAnswer: z.union([z.string(), z.number(), z.array(z.string())]),
  explanation: z.string(),
  keyPoints: z.array(z.string()),
  commonMistakes: z.array(z.string()).optional(),
});

const examQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["mcq", "short_answer", "problem_solving", "essay"]),
  question: z.string(),
  points: z.number(),
  timeEstimate: z.number(),
  options: z.array(examQuestionOptionSchema).optional(),
  steps: z.array(z.string()).optional(),
  solution: examQuestionSolutionSchema,
});

const submitExamSchema = z.object({
  sessionId: z.string(),
  childId: z.string().cuid(),
  examType: z.string(),
  subject: z.string(),
  gradeLevel: z.string(),
  questions: z.array(examQuestionSchema),
  answers: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.array(z.string())]),
  ),
  timeSpent: z.number(), // in seconds
});

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    // 2. Validation
    const body = await req.json();
    const validated = submitExamSchema.parse(body);

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

    // 4. Evaluate each answer
    const questions = validated.questions as ExamQuestion[];
    const questionResults: QuestionResult[] = [];
    let totalScore = 0;
    let maxScore = 0;

    for (const question of questions) {
      const userAnswer = validated.answers[question.id];
      maxScore += question.points;

      if (
        userAnswer === undefined ||
        userAnswer === null ||
        userAnswer === ""
      ) {
        // Unanswered question
        questionResults.push({
          questionId: question.id,
          isCorrect: false,
          score: 0,
          maxPoints: question.points,
          userAnswer: "",
          feedback: "Question non repondue",
          explanation: question.solution.explanation,
        });
        continue;
      }

      const evaluation = evaluateExamAnswer(question, userAnswer);
      totalScore += evaluation.score;

      questionResults.push({
        questionId: question.id,
        isCorrect: evaluation.isCorrect,
        partialCredit: evaluation.partialCredit,
        score: evaluation.score,
        maxPoints: question.points,
        userAnswer,
        feedback: evaluation.isCorrect
          ? "Correct!"
          : evaluation.partialCredit
            ? `Partiellement correct (${Math.round(evaluation.partialCredit * 100)}%)`
            : "Incorrect",
        explanation: question.solution.explanation,
      });
    }

    // 5. Calculate percentage and grade
    const percentage =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const grade = calculateGrade(percentage);

    // 6. Generate AI analysis
    const aiAnalysis = await generateExamAnalysis(questionResults, {
      examType: validated.examType,
      subject: validated.subject as ExamSubject,
      gradeLevel: validated.gradeLevel,
      totalScore,
      maxScore,
      percentage,
    });

    // 7. Calculate and award XP
    const correctCount = questionResults.filter((r) => r.isCorrect).length;
    const xpEarned = calculateExamXP(percentage, correctCount);

    await awardXP(validated.childId, xpEarned, "EXAM_COMPLETED");

    // 8. Check for badges
    await checkAndAwardBadges(validated.childId);

    // 9. Create result
    const result = {
      sessionId: validated.sessionId,
      childId: validated.childId,
      examType: validated.examType,
      subject: validated.subject,
      totalScore,
      maxScore,
      percentage,
      grade,
      timeSpent: validated.timeSpent,
      questionResults,
      aiAnalysis,
      xpEarned,
      completedAt: new Date().toISOString(),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation echouee", details: error.issues },
        { status: 400 },
      );
    }
    console.error("API Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
