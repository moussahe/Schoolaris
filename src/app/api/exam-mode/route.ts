// API Route: Exam Mode - Generate and Start Exam Session
// POST /api/exam-mode - Start a new exam session

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateExamQuestions } from "@/lib/ai-exam-mode";
import type {
  ExamType,
  ExamSubject,
  ExamGenerationContext,
} from "@/types/exam";
import { EXAM_CONFIGS } from "@/types/exam";

const startExamSchema = z.object({
  childId: z.string().cuid(),
  examType: z.enum(["BREVET", "BAC", "CUSTOM"]),
  subject: z.enum([
    "MATHEMATIQUES",
    "FRANCAIS",
    "HISTOIRE_GEO",
    "SCIENCES",
    "ANGLAIS",
    "PHYSIQUE_CHIMIE",
    "SVT",
    "PHILOSOPHIE",
  ]),
  difficulty: z.enum(["standard", "challenging"]).default("standard"),
  questionCount: z.number().min(5).max(20).optional(),
  duration: z.number().min(15).max(180).optional(), // in minutes
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
    const validated = startExamSchema.parse(body);

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

    // 4. Validate exam type for grade level
    const examConfig = EXAM_CONFIGS[validated.examType as ExamType];
    if (
      validated.examType !== "CUSTOM" &&
      !examConfig.gradeLevels.includes(child.gradeLevel)
    ) {
      return NextResponse.json(
        {
          error: `Le ${examConfig.label} n'est pas disponible pour le niveau ${child.gradeLevel}`,
        },
        { status: 400 },
      );
    }

    // 5. Get previous performance for personalization
    const recentProgress = await prisma.progress.findMany({
      where: {
        childId: validated.childId,
        quizScore: { not: null },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
      include: {
        lesson: {
          include: {
            chapter: {
              include: { course: true },
            },
          },
        },
      },
    });

    // Filter by subject
    const subjectProgress = recentProgress.filter(
      (p) => p.lesson.chapter.course.subject === validated.subject,
    );

    let previousPerformance: ExamGenerationContext["previousPerformance"];
    if (subjectProgress.length > 0) {
      const scores = subjectProgress
        .map((p) => p.quizScore)
        .filter((s): s is number => s !== null);
      const averageScore =
        scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;

      // Identify weak topics (scores < 70%)
      const weakTopics = subjectProgress
        .filter((p) => p.quizScore !== null && p.quizScore < 70)
        .map((p) => p.lesson.chapter.title)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 3);

      // Identify strong topics (scores >= 80%)
      const strongTopics = subjectProgress
        .filter((p) => p.quizScore !== null && p.quizScore >= 80)
        .map((p) => p.lesson.chapter.title)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 3);

      previousPerformance = { averageScore, weakTopics, strongTopics };
    }

    // 6. Generate exam questions
    const context: ExamGenerationContext = {
      examType: validated.examType as ExamType,
      subject: validated.subject as ExamSubject,
      gradeLevel: child.gradeLevel,
      questionCount: validated.questionCount || examConfig.defaultQuestionCount,
      difficulty: validated.difficulty,
      previousPerformance,
    };

    const questions = await generateExamQuestions(context);

    // 7. Calculate duration
    const duration = validated.duration || examConfig.defaultDuration;
    const now = new Date();
    const endsAt = new Date(now.getTime() + duration * 60 * 1000);

    // 8. Create exam session response
    const examSession = {
      id: `exam_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      childId: validated.childId,
      examType: validated.examType,
      subject: validated.subject,
      gradeLevel: child.gradeLevel,
      questions,
      duration,
      startedAt: now.toISOString(),
      endsAt: endsAt.toISOString(),
      status: "in_progress" as const,
    };

    return NextResponse.json(examSession, { status: 201 });
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
