import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  createCardsForWeakAreas,
  getDueCards,
  getDueCardsCount,
  getSpacedRepetitionStats,
  getUpcomingReviews,
} from "@/lib/spaced-repetition";

// GET - Get spaced repetition data for a child
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const childId = searchParams.get("childId");
    const action = searchParams.get("action") || "due-cards";

    if (!childId) {
      return NextResponse.json(
        { error: "childId est requis" },
        { status: 400 },
      );
    }

    // Verify parent owns this child
    const child = await prisma.child.findFirst({
      where: { id: childId, parentId: session.user.id },
    });

    if (!child) {
      return NextResponse.json({ error: "Enfant non trouve" }, { status: 404 });
    }

    switch (action) {
      case "due-cards": {
        const limit = parseInt(searchParams.get("limit") || "10");
        const cards = await getDueCards(childId, limit);
        const count = await getDueCardsCount(childId);
        return NextResponse.json({ cards, totalDue: count });
      }

      case "stats": {
        const stats = await getSpacedRepetitionStats(childId);
        return NextResponse.json(stats);
      }

      case "schedule": {
        const days = parseInt(searchParams.get("days") || "7");
        const schedule = await getUpcomingReviews(childId, days);
        return NextResponse.json({ schedule });
      }

      case "count": {
        const count = await getDueCardsCount(childId);
        return NextResponse.json({ count });
      }

      default:
        return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }
  } catch (error) {
    console.error("Spaced repetition GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - Initialize cards or perform actions
const postSchema = z.object({
  childId: z.string().cuid(),
  action: z.enum(["initialize-cards", "sync-weak-areas"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await req.json();
    const { childId, action } = postSchema.parse(body);

    // Verify parent owns this child
    const child = await prisma.child.findFirst({
      where: { id: childId, parentId: session.user.id },
    });

    if (!child) {
      return NextResponse.json({ error: "Enfant non trouve" }, { status: 404 });
    }

    switch (action) {
      case "initialize-cards":
      case "sync-weak-areas": {
        const cardsCreated = await createCardsForWeakAreas(childId);
        return NextResponse.json({
          success: true,
          cardsCreated,
          message: `${cardsCreated} nouvelles cartes creees`,
        });
      }

      default:
        return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation echouee", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Spaced repetition POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
