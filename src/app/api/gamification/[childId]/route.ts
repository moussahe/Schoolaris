import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGamificationStats } from "@/lib/gamification";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ childId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { childId } = await params;

    // Verify the user has access to this child
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId: session.user.id,
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Enfant non trouve" }, { status: 404 });
    }

    const stats = await getGamificationStats(childId);

    if (!stats) {
      return NextResponse.json(
        { error: "Stats non trouvees" },
        { status: 404 },
      );
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[Gamification API Error]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
