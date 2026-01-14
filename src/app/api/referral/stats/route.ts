import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/referral/stats - Get detailed referral statistics
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    // Get all referrals made by user
    const referrals = await prisma.referral.findMany({
      where: {
        referrerId: session.user.id,
        referredId: { not: null }, // Only count actual referrals
      },
      select: {
        id: true,
        status: true,
        referrerReward: true,
        referredReward: true,
        signedUpAt: true,
        convertedAt: true,
        rewardedAt: true,
        clickCount: true,
        createdAt: true,
        referred: {
          select: {
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Get referral codes (unused templates)
    const referralCodes = await prisma.referral.findMany({
      where: {
        referrerId: session.user.id,
        referredId: null,
      },
      select: {
        referrerCode: true,
        clickCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Aggregate stats
    const stats = {
      totalReferrals: referrals.length,
      byStatus: {
        pending: referrals.filter((r) => r.status === "PENDING").length,
        signedUp: referrals.filter((r) => r.status === "SIGNED_UP").length,
        converted: referrals.filter((r) => r.status === "CONVERTED").length,
        rewarded: referrals.filter((r) => r.status === "REWARDED").length,
      },
      totalClicks: referralCodes.reduce((sum, r) => sum + r.clickCount, 0),
      totalEarnings: referrals
        .filter((r) => r.status === "REWARDED")
        .reduce((sum, r) => sum + r.referrerReward, 0),
      conversionRate:
        referrals.length > 0
          ? Math.round(
              (referrals.filter((r) =>
                ["CONVERTED", "REWARDED"].includes(r.status),
              ).length /
                referrals.length) *
                100,
            )
          : 0,
    };

    // Get credits balance
    const credits = await prisma.referralCredit.aggregate({
      where: {
        userId: session.user.id,
        usedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      _sum: { amount: true },
    });

    // Mask email for privacy
    const referralsWithMaskedEmail = referrals.map((r) => ({
      ...r,
      referred: r.referred
        ? {
            ...r.referred,
            email: r.referred.email
              ? `${r.referred.email.slice(0, 2)}***@***${r.referred.email.slice(-4)}`
              : null,
          }
        : null,
    }));

    return NextResponse.json({
      stats,
      availableCredits: credits._sum.amount || 0,
      referrals: referralsWithMaskedEmail,
      codes: referralCodes,
    });
  } catch (error) {
    console.error("Referral stats error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
