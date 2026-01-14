import { Suspense } from "react";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getDueCards,
  getSpacedRepetitionStats,
  getUpcomingReviews,
  createCardsForWeakAreas,
} from "@/lib/spaced-repetition";
import { Skeleton } from "@/components/ui/skeleton";
import { RevisionDashboard } from "@/components/student/revision-dashboard";

async function getRevisionData(childId: string) {
  // First, sync any new weak areas to create cards
  await createCardsForWeakAreas(childId);

  const [child, dueCards, stats, schedule] = await Promise.all([
    prisma.child.findUnique({
      where: { id: childId },
      select: {
        id: true,
        firstName: true,
        gradeLevel: true,
      },
    }),
    getDueCards(childId, 10),
    getSpacedRepetitionStats(childId),
    getUpcomingReviews(childId, 7),
  ]);

  return { child, dueCards, stats, schedule };
}

function RevisionSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-64" />
      <div className="grid gap-4 md:grid-cols-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

async function RevisionContent({ childId }: { childId: string }) {
  const data = await getRevisionData(childId);

  if (!data.child) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500">Erreur de chargement des donnees.</p>
      </div>
    );
  }

  return (
    <RevisionDashboard
      childId={data.child.id}
      childName={data.child.firstName}
      gradeLevel={data.child.gradeLevel}
      dueCards={data.dueCards}
      stats={data.stats}
      schedule={data.schedule}
    />
  );
}

export default async function RevisionPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Get selected child from cookie
  const cookieStore = await cookies();
  const selectedChildId = cookieStore.get("selectedChildId")?.value;

  // Get first child if no selection
  let childId = selectedChildId;
  if (!childId) {
    const firstChild = await prisma.child.findFirst({
      where: { parentId: session.user.id },
      select: { id: true },
    });
    childId = firstChild?.id;
  }

  if (!childId) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500">Aucun enfant trouve.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<RevisionSkeleton />}>
      <RevisionContent childId={childId} />
    </Suspense>
  );
}
