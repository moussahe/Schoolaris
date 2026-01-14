import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  generateReviewQuestion,
  evaluateAnswer,
  recordReview,
} from "@/lib/spaced-repetition";

// GET - Get a review question for a card
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get("cardId");

    if (!cardId) {
      return NextResponse.json({ error: "cardId est requis" }, { status: 400 });
    }

    // Get card with weak area and child info
    const card = await prisma.spacedRepetitionCard.findUnique({
      where: { id: cardId },
      include: {
        weakArea: true,
        child: {
          select: { parentId: true, gradeLevel: true },
        },
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Carte non trouvee" }, { status: 404 });
    }

    // Verify parent owns this child
    if (card.child.parentId !== session.user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    // Use cached question if recent (less than 1 hour old)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (card.cachedQuestion && card.cachedAt && card.cachedAt > oneHourAgo) {
      const cached = card.cachedQuestion as {
        question: string;
        expectedAnswer: string;
      };
      return NextResponse.json({
        cardId: card.id,
        question: cached.question,
        expectedAnswer: cached.expectedAnswer,
        weakArea: {
          topic: card.weakArea.topic,
          subject: card.weakArea.subject,
          category: card.weakArea.category,
        },
        stats: {
          repetitions: card.repetitions,
          easeFactor: card.easeFactor,
          interval: card.interval,
          totalReviews: card.totalReviews,
          successRate:
            card.totalReviews > 0
              ? Math.round((card.successfulReviews / card.totalReviews) * 100)
              : 0,
        },
      });
    }

    // Generate new question
    const { question, expectedAnswer } = await generateReviewQuestion(
      card.weakArea,
      card.child.gradeLevel,
    );

    // Cache the question
    await prisma.spacedRepetitionCard.update({
      where: { id: cardId },
      data: {
        cachedQuestion: { question, expectedAnswer },
        cachedAt: new Date(),
      },
    });

    return NextResponse.json({
      cardId: card.id,
      question,
      expectedAnswer,
      weakArea: {
        topic: card.weakArea.topic,
        subject: card.weakArea.subject,
        category: card.weakArea.category,
      },
      stats: {
        repetitions: card.repetitions,
        easeFactor: card.easeFactor,
        interval: card.interval,
        totalReviews: card.totalReviews,
        successRate:
          card.totalReviews > 0
            ? Math.round((card.successfulReviews / card.totalReviews) * 100)
            : 0,
      },
    });
  } catch (error) {
    console.error("Review GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - Submit a review answer
const submitSchema = z.object({
  cardId: z.string().cuid(),
  childId: z.string().cuid(),
  question: z.string(),
  expectedAnswer: z.string(),
  childAnswer: z.string(),
  timeSpent: z.number().min(0).default(0),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await req.json();
    const {
      cardId,
      childId,
      question,
      expectedAnswer,
      childAnswer,
      timeSpent,
    } = submitSchema.parse(body);

    // Get card and verify ownership
    const card = await prisma.spacedRepetitionCard.findUnique({
      where: { id: cardId },
      include: {
        weakArea: true,
        child: {
          select: { parentId: true, gradeLevel: true },
        },
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Carte non trouvee" }, { status: 404 });
    }

    if (card.child.parentId !== session.user.id || card.childId !== childId) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    // Evaluate the answer
    const evaluation = await evaluateAnswer(
      question,
      expectedAnswer,
      childAnswer,
      card.weakArea,
      card.child.gradeLevel,
    );

    // Record the review and update scheduling
    const result = await recordReview(
      cardId,
      childId,
      question,
      expectedAnswer,
      childAnswer,
      evaluation.quality,
      evaluation.feedback,
      timeSpent,
    );

    return NextResponse.json({
      success: true,
      evaluation: {
        quality: evaluation.quality,
        isCorrect: evaluation.isCorrect,
        feedback: evaluation.feedback,
      },
      scheduling: {
        newInterval: result.newInterval,
        nextReviewAt: result.nextReviewAt,
        isMastered: result.isMastered,
      },
      encouragement: getEncouragement(evaluation.quality, result.isMastered),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation echouee", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Review POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function getEncouragement(quality: number, isMastered: boolean): string {
  if (isMastered) {
    return "Bravo ! Tu as maitrise ce concept ! Il est retire de tes revisions.";
  }

  if (quality >= 4) {
    return "Excellent ! Tu progresses tres bien sur ce sujet.";
  }

  if (quality >= 3) {
    return "Bien joue ! Continue comme ca et tu vas bientot maitriser ce concept.";
  }

  if (quality >= 2) {
    return "Pas mal ! Revois ce concept et tu feras mieux la prochaine fois.";
  }

  return "Ce concept est difficile. Ne te decourage pas, la repetition est la cle !";
}
