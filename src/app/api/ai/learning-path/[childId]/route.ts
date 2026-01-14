import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { generateLearningPath } from "@/lib/ai-learning-path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ childId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    // Rate limiting (10 learning path generations per hour)
    const rateLimit = await checkRateLimit(session.user.id, "LEARNING_PATH");
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Limite atteinte. Vous pouvez generer 10 parcours par heure.",
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: rateLimitHeaders(rateLimit),
        },
      );
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

    const recommendation = await generateLearningPath(childId);

    if (!recommendation) {
      return NextResponse.json(
        { error: "Impossible de generer le parcours" },
        { status: 500 },
      );
    }

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error("[Learning Path API Error]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
