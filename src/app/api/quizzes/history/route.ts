import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  childId: z.string().cuid(),
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
});

export async function GET(req: NextRequest) {
  try {
    // 1. Auth
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    // 2. Parse query params
    const { searchParams } = new URL(req.url);
    const validated = querySchema.parse({
      childId: searchParams.get("childId"),
      limit: searchParams.get("limit") ?? 20,
      page: searchParams.get("page") ?? 1,
    });

    // 3. Verify the child belongs to the parent
    const child = await prisma.child.findFirst({
      where: {
        id: validated.childId,
        parentId: session.user.id,
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Enfant non trouve" }, { status: 404 });
    }

    // 4. Get quiz attempts with pagination
    const skip = (validated.page - 1) * validated.limit;

    const [attempts, total] = await prisma.$transaction([
      prisma.quizAttempt.findMany({
        where: { childId: validated.childId },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              passingScore: true,
            },
          },
          lesson: {
            select: {
              id: true,
              title: true,
              chapter: {
                select: {
                  title: true,
                  course: {
                    select: {
                      id: true,
                      title: true,
                      subject: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { completedAt: "desc" },
        skip,
        take: validated.limit,
      }),
      prisma.quizAttempt.count({
        where: { childId: validated.childId },
      }),
    ]);

    // 5. Calculate stats
    const allAttempts = await prisma.quizAttempt.findMany({
      where: { childId: validated.childId },
      select: {
        percentage: true,
        passed: true,
      },
    });

    const stats = {
      totalAttempts: allAttempts.length,
      passedAttempts: allAttempts.filter((a) => a.passed).length,
      averageScore:
        allAttempts.length > 0
          ? Math.round(
              allAttempts.reduce((sum, a) => sum + a.percentage, 0) /
                allAttempts.length,
            )
          : 0,
      passRate:
        allAttempts.length > 0
          ? Math.round(
              (allAttempts.filter((a) => a.passed).length /
                allAttempts.length) *
                100,
            )
          : 0,
    };

    // 6. Return response
    return NextResponse.json({
      attempts: attempts.map((attempt) => ({
        id: attempt.id,
        quizId: attempt.quizId,
        quizTitle: attempt.quiz.title,
        lessonId: attempt.lessonId,
        lessonTitle: attempt.lesson.title,
        chapterTitle: attempt.lesson.chapter.title,
        courseId: attempt.lesson.chapter.course.id,
        courseTitle: attempt.lesson.chapter.course.title,
        subject: attempt.lesson.chapter.course.subject,
        score: attempt.score,
        totalPoints: attempt.totalPoints,
        percentage: attempt.percentage,
        passed: attempt.passed,
        correctCount: attempt.correctCount,
        totalQuestions: attempt.totalQuestions,
        timeSpent: attempt.timeSpent,
        completedAt: attempt.completedAt,
        aiFeedback: attempt.aiFeedback,
      })),
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total,
        totalPages: Math.ceil(total / validated.limit),
      },
      stats,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation echouee", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Quiz history error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
