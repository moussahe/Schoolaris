import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generatePredictions,
  type HistoricalMetrics,
} from "@/lib/ai-predictions";
import { z, ZodError } from "zod";

const predictionsSchema = z.object({
  childId: z.string().cuid(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { childId } = predictionsSchema.parse(searchParams);

    // Verify parent owns child
    const child = await prisma.child.findFirst({
      where: { id: childId, parentId: session.user.id },
      include: {
        purchases: {
          where: { status: "COMPLETED" },
          include: {
            course: { select: { id: true, title: true, subject: true } },
          },
        },
        progress: {
          orderBy: { updatedAt: "desc" },
          include: {
            lesson: {
              include: {
                chapter: {
                  include: {
                    course: { select: { title: true, subject: true } },
                  },
                },
              },
            },
          },
        },
        conversations: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        exerciseAttempts: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        quizAttempts: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Enfant non trouve" }, { status: 404 });
    }

    // Build historical metrics
    const now = new Date();
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    // Calculate weekly data for last 4 weeks
    const weeklyData: HistoricalMetrics["weeklyData"] = [];

    for (let week = 0; week < 4; week++) {
      const weekStart = new Date(
        now.getTime() - (week + 1) * 7 * 24 * 60 * 60 * 1000,
      );
      const weekEnd = new Date(now.getTime() - week * 7 * 24 * 60 * 60 * 1000);

      const weekProgress = child.progress.filter((p) => {
        const date = new Date(p.updatedAt);
        return date >= weekStart && date < weekEnd;
      });

      const completedLessons = weekProgress.filter((p) => p.isCompleted).length;
      const timeSpent = weekProgress.reduce((sum, p) => sum + p.timeSpent, 0);
      const quizScores = weekProgress
        .filter((p) => p.quizScore !== null)
        .map((p) => p.quizScore as number);
      const avgQuizScore =
        quizScores.length > 0
          ? Math.round(
              quizScores.reduce((a, b) => a + b, 0) / quizScores.length,
            )
          : null;

      // Calculate active days
      const uniqueDays = new Set(
        weekProgress.map(
          (p) => new Date(p.updatedAt).toISOString().split("T")[0],
        ),
      ).size;

      weeklyData.push({
        weekNumber: 4 - week,
        lessonsCompleted: completedLessons,
        timeSpentMinutes: Math.round(timeSpent / 60),
        avgQuizScore,
        activeDays: uniqueDays,
      });
    }

    // Reverse to have chronological order
    weeklyData.reverse();

    // Calculate subject performance
    const subjectMap = new Map<string, number[]>();
    const recentProgress = child.progress.filter(
      (p) => new Date(p.updatedAt) >= fourWeeksAgo && p.quizScore !== null,
    );

    recentProgress.forEach((p) => {
      const subject = p.lesson.chapter.course.subject;
      const scores = subjectMap.get(subject) || [];
      scores.push(p.quizScore as number);
      subjectMap.set(subject, scores);
    });

    const subjectPerformance: HistoricalMetrics["subjectPerformance"] =
      Array.from(subjectMap.entries()).map(([subject, scores]) => {
        const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
        const secondHalf = scores.slice(Math.ceil(scores.length / 2));

        const avgFirst =
          firstHalf.length > 0
            ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
            : 0;
        const avgSecond =
          secondHalf.length > 0
            ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
            : avgFirst;

        let trend: "improving" | "stable" | "declining" = "stable";
        if (avgSecond - avgFirst > 5) trend = "improving";
        else if (avgFirst - avgSecond > 5) trend = "declining";

        return {
          subject,
          recentScores: scores.slice(-5),
          trend,
        };
      });

    // Calculate current status
    const daysSinceLastActivity =
      child.progress.length > 0
        ? Math.floor(
            (now.getTime() - new Date(child.progress[0].updatedAt).getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : 999;

    const allQuizScores = child.progress
      .filter((p) => p.quizScore !== null)
      .map((p) => p.quizScore as number);
    const avgQuizScoreAllTime =
      allQuizScores.length > 0
        ? Math.round(
            allQuizScores.reduce((a, b) => a + b, 0) / allQuizScores.length,
          )
        : null;

    // Count completed courses
    const completedCourses = new Set<string>();
    const inProgressCourses = new Set<string>();

    for (const purchase of child.purchases) {
      const courseId = purchase.courseId;
      const totalLessons = await prisma.lesson.count({
        where: {
          chapter: { courseId, isPublished: true },
          isPublished: true,
        },
      });
      const completedLessons = child.progress.filter(
        (p) =>
          p.isCompleted &&
          p.lesson.chapter.course.title === purchase.course.title,
      ).length;

      if (totalLessons > 0 && completedLessons >= totalLessons) {
        completedCourses.add(courseId);
      } else if (completedLessons > 0) {
        inProgressCourses.add(courseId);
      }
    }

    // Calculate average session duration
    const sessionTimes = child.progress
      .filter((p) => p.timeSpent > 0)
      .map((p) => p.timeSpent);
    const avgSessionDuration =
      sessionTimes.length > 0
        ? Math.round(
            sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length / 60,
          )
        : 0;

    const metrics: HistoricalMetrics = {
      childName: child.firstName,
      gradeLevel: child.gradeLevel,
      weeklyData,
      subjectPerformance,
      currentStatus: {
        daysSinceLastActivity,
        currentStreak: child.currentStreak,
        totalLessonsCompleted: child.progress.filter((p) => p.isCompleted)
          .length,
        avgQuizScoreAllTime,
        coursesInProgress: inProgressCourses.size,
        coursesCompleted: completedCourses.size,
      },
      engagement: {
        aiConversationsThisMonth: child.conversations.length,
        exercisesAttemptedThisMonth: child.exerciseAttempts.length,
        quizzesTakenThisMonth: child.quizAttempts.length,
        avgSessionDuration,
      },
    };

    // Generate AI predictions
    const predictions = await generatePredictions(metrics);

    return NextResponse.json({
      childId: child.id,
      childName: child.firstName,
      generatedAt: new Date().toISOString(),
      metrics,
      predictions,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Parametres invalides", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Predictions error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
