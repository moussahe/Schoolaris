import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  handleApiError,
  unauthorized,
  forbidden,
  notFound,
} from "@/lib/api-error";

type RouteParams = {
  params: Promise<{ childId: string }>;
};

const SUBJECT_LABELS: Record<string, string> = {
  MATHEMATIQUES: "Mathematiques",
  FRANCAIS: "Francais",
  HISTOIRE_GEO: "Histoire-Geo",
  SCIENCES: "Sciences",
  ANGLAIS: "Anglais",
  PHYSIQUE_CHIMIE: "Physique-Chimie",
  SVT: "SVT",
  PHILOSOPHIE: "Philosophie",
  ESPAGNOL: "Espagnol",
  ALLEMAND: "Allemand",
  SES: "SES",
  NSI: "NSI",
  GENERAL: "Questions generales",
};

// GET /api/children/[childId]/ai-tutor-stats - Get AI tutor usage statistics
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { childId } = await params;
    const session = await auth();

    if (!session?.user) {
      return unauthorized();
    }

    // Check ownership
    const child = await prisma.child.findUnique({
      where: { id: childId },
      select: { id: true, parentId: true },
    });

    if (!child) {
      return notFound("Enfant non trouve");
    }

    if (child.parentId !== session.user.id && session.user.role !== "ADMIN") {
      return forbidden("Vous ne pouvez pas voir ces statistiques");
    }

    // Get all conversations for this child
    const conversations = await prisma.aIConversation.findMany({
      where: { childId },
      include: {
        messages: {
          select: {
            id: true,
            role: true,
            createdAt: true,
            contextCourseId: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Calculate stats
    const totalConversations = conversations.length;

    // Count USER messages only (questions asked by child)
    const allUserMessages = conversations.flatMap((conv) =>
      conv.messages.filter((m) => m.role === "USER"),
    );
    const totalQuestions = allUserMessages.length;

    // Questions this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const questionsThisWeek = allUserMessages.filter(
      (m) => m.createdAt >= oneWeekAgo,
    ).length;

    // Average questions per session
    const avgQuestionsPerSession =
      totalConversations > 0 ? totalQuestions / totalConversations : 0;

    // Last activity
    const lastMessage = allUserMessages[0];
    const lastActivity = lastMessage?.createdAt?.toISOString() || null;

    // Subject breakdown - get course subjects for conversations
    const conversationsWithCourses = await prisma.aIConversation.findMany({
      where: { childId },
      include: {
        messages: {
          where: { role: "USER" },
          select: { id: true },
        },
      },
    });

    // Get course IDs from conversations
    const courseIds = [
      ...new Set(
        conversationsWithCourses
          .map((c) => c.courseId)
          .filter((id): id is string => id !== null),
      ),
    ];

    // Fetch course details for subjects
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, subject: true, title: true },
    });

    const courseSubjectMap = new Map(courses.map((c) => [c.id, c.subject]));
    const courseTitleMap = new Map(courses.map((c) => [c.id, c.title]));

    // Count questions by subject
    const subjectCounts: Record<string, number> = {};
    for (const conv of conversationsWithCourses) {
      const subject = conv.courseId
        ? courseSubjectMap.get(conv.courseId) || "GENERAL"
        : "GENERAL";
      const questionCount = conv.messages.length;
      subjectCounts[subject] = (subjectCounts[subject] || 0) + questionCount;
    }

    // Format subject breakdown
    const subjectBreakdown = Object.entries(subjectCounts)
      .map(([subject, count]) => ({
        subject,
        label: SUBJECT_LABELS[subject] || subject,
        count,
        percentage:
          totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Recent topics (last 5 conversations)
    const recentConversations = await prisma.aIConversation.findMany({
      where: { childId },
      include: {
        _count: { select: { messages: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { createdAt: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    // Fetch lesson titles for recent conversations
    const lessonIds = recentConversations
      .map((c) => c.lessonId)
      .filter((id): id is string => id !== null);

    const lessons = await prisma.lesson.findMany({
      where: { id: { in: lessonIds } },
      select: { id: true, title: true },
    });

    const lessonTitleMap = new Map(lessons.map((l) => [l.id, l.title]));

    const recentTopics = recentConversations.map((conv) => ({
      id: conv.id,
      title: conv.title,
      courseTitle: conv.courseId
        ? courseTitleMap.get(conv.courseId) || null
        : null,
      lessonTitle: conv.lessonId
        ? lessonTitleMap.get(conv.lessonId) || null
        : null,
      messageCount: conv._count.messages,
      lastMessageAt:
        conv.messages[0]?.createdAt?.toISOString() ||
        conv.updatedAt.toISOString(),
    }));

    // Weekly trend (last 4 weeks)
    const weeklyTrend: Array<{ week: string; questions: number }> = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const weekQuestions = allUserMessages.filter(
        (m) => m.createdAt >= weekStart && m.createdAt < weekEnd,
      ).length;

      // Format week label
      const weekLabel =
        i === 0
          ? "Cette sem."
          : i === 1
            ? "Sem. -1"
            : i === 2
              ? "Sem. -2"
              : "Sem. -3";

      weeklyTrend.push({
        week: weekLabel,
        questions: weekQuestions,
      });
    }

    return NextResponse.json({
      totalConversations,
      totalQuestions,
      questionsThisWeek,
      avgQuestionsPerSession,
      lastActivity,
      subjectBreakdown,
      recentTopics,
      weeklyTrend,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
