import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BadgeCategory } from "@prisma/client";
import { BadgesClient } from "./badges-client";
import { Skeleton } from "@/components/ui/skeleton";

interface BadgeWithProgress {
  id: string;
  code: string;
  name: string;
  description: string;
  category: BadgeCategory;
  xpReward: number;
  requirement: Record<string, number> | null;
  isSecret: boolean;
  earned: boolean;
  earnedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

async function getBadgesData(childId: string): Promise<{
  badges: BadgeWithProgress[];
  stats: {
    lessonsCompleted: number;
    coursesCompleted: number;
    quizzesPassed: number;
    perfectQuizzes: number;
    currentStreak: number;
    longestStreak: number;
    level: number;
    xp: number;
  };
}> {
  const [
    allBadges,
    earnedBadges,
    child,
    lessonsCompleted,
    quizzesPassed,
    perfectQuizzes,
  ] = await Promise.all([
    // Get all badges from database
    prisma.badge.findMany({
      orderBy: [{ category: "asc" }, { xpReward: "asc" }],
    }),
    // Get earned badges for this child
    prisma.childBadge.findMany({
      where: { childId },
      select: { badgeId: true, earnedAt: true },
    }),
    // Get child stats
    prisma.child.findUnique({
      where: { id: childId },
      select: {
        xp: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
      },
    }),
    // Count completed lessons
    prisma.progress.count({
      where: { childId, isCompleted: true },
    }),
    // Count passed quizzes (score >= 70)
    prisma.progress.count({
      where: { childId, quizScore: { gte: 70 } },
    }),
    // Count perfect quizzes (score = 100)
    prisma.progress.count({
      where: { childId, quizScore: 100 },
    }),
  ]);

  // Count completed courses (simplified - courses where at least 80% lessons done)
  const coursesCompleted = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(DISTINCT c.id) as count
    FROM "Course" c
    JOIN "Chapter" ch ON ch."courseId" = c.id
    JOIN "Lesson" l ON l."chapterId" = ch.id
    WHERE l."isPublished" = true
    AND c."isPublished" = true
    AND (
      SELECT COUNT(*) FROM "Progress" p
      JOIN "Lesson" l2 ON p."lessonId" = l2.id
      JOIN "Chapter" ch2 ON l2."chapterId" = ch2.id
      WHERE ch2."courseId" = c.id AND p."childId" = ${childId} AND p."isCompleted" = true
    ) >= (
      SELECT COUNT(*) * 0.8 FROM "Lesson" l3
      JOIN "Chapter" ch3 ON l3."chapterId" = ch3.id
      WHERE ch3."courseId" = c.id AND l3."isPublished" = true
    )
  `.then((r) => Number(r[0]?.count || 0));

  const earnedBadgeMap = new Map(
    earnedBadges.map((eb) => [eb.badgeId, eb.earnedAt]),
  );

  const stats = {
    lessonsCompleted,
    coursesCompleted,
    quizzesPassed,
    perfectQuizzes,
    currentStreak: child?.currentStreak ?? 0,
    longestStreak: child?.longestStreak ?? 0,
    level: child?.level ?? 1,
    xp: child?.xp ?? 0,
  };

  // Map badges with progress
  const badgesWithProgress: BadgeWithProgress[] = allBadges
    .filter((badge) => !badge.isSecret || earnedBadgeMap.has(badge.id))
    .map((badge) => {
      const earned = earnedBadgeMap.has(badge.id);
      const earnedAt = earnedBadgeMap.get(badge.id);
      const req = badge.requirement as Record<string, number> | null;

      let progress: number | undefined;
      let maxProgress: number | undefined;

      // Calculate progress for unearned badges
      if (!earned && req) {
        if (req.lessonsCompleted) {
          progress = Math.min(stats.lessonsCompleted, req.lessonsCompleted);
          maxProgress = req.lessonsCompleted;
        } else if (req.coursesCompleted) {
          progress = Math.min(stats.coursesCompleted, req.coursesCompleted);
          maxProgress = req.coursesCompleted;
        } else if (req.streak) {
          progress = Math.min(stats.longestStreak, req.streak);
          maxProgress = req.streak;
        } else if (req.quizzesPassed) {
          progress = Math.min(stats.quizzesPassed, req.quizzesPassed);
          maxProgress = req.quizzesPassed;
        } else if (req.perfectQuizzes) {
          progress = Math.min(stats.perfectQuizzes, req.perfectQuizzes);
          maxProgress = req.perfectQuizzes;
        } else if (req.level) {
          progress = Math.min(stats.level, req.level);
          maxProgress = req.level;
        } else if (req.xp) {
          progress = Math.min(stats.xp, req.xp);
          maxProgress = req.xp;
        }
      }

      return {
        id: badge.id,
        code: badge.code,
        name: badge.name,
        description: badge.description,
        category: badge.category,
        xpReward: badge.xpReward,
        requirement: req,
        isSecret: badge.isSecret,
        earned,
        earnedAt: earnedAt ?? undefined,
        progress,
        maxProgress,
      };
    });

  return { badges: badgesWithProgress, stats };
}

async function BadgesContent() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get child ID for this student user
  const child = await prisma.child.findFirst({
    where: { parentId: session.user.id },
    select: { id: true },
  });

  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500">
          Aucun profil eleve trouve. Contactez un administrateur.
        </p>
      </div>
    );
  }

  const { badges, stats } = await getBadgesData(child.id);

  return <BadgesClient badges={badges} stats={stats} />;
}

function BadgesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-64" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function BadgesPage() {
  return (
    <Suspense fallback={<BadgesSkeleton />}>
      <BadgesContent />
    </Suspense>
  );
}
