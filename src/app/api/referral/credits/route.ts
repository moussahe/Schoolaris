import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/referral/credits - Get user's referral credits
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    // Get all credits
    const credits = await prisma.referralCredit.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Calculate available balance
    const availableCredits = credits
      .filter((c) => !c.usedAt && (!c.expiresAt || c.expiresAt > new Date()))
      .reduce((sum, c) => sum + c.amount, 0);

    // Calculate used total
    const usedCredits = credits
      .filter((c) => c.usedAt)
      .reduce((sum, c) => sum + c.amount, 0);

    // Calculate expired total
    const expiredCredits = credits
      .filter((c) => !c.usedAt && c.expiresAt && c.expiresAt <= new Date())
      .reduce((sum, c) => sum + c.amount, 0);

    return NextResponse.json({
      balance: {
        available: availableCredits,
        used: usedCredits,
        expired: expiredCredits,
        total: availableCredits + usedCredits + expiredCredits,
      },
      credits: credits.map((c) => ({
        id: c.id,
        amount: c.amount,
        source: c.source,
        usedAt: c.usedAt,
        expiresAt: c.expiresAt,
        createdAt: c.createdAt,
        status: c.usedAt
          ? "used"
          : c.expiresAt && c.expiresAt <= new Date()
            ? "expired"
            : "available",
      })),
    });
  } catch (error) {
    console.error("Credits GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
