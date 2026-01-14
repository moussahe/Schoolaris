import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const trackSchema = z.object({
  code: z.string().min(1),
});

// POST /api/referral/track - Track referral link click
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = trackSchema.parse(body);

    // Find the referral by code
    const referral = await prisma.referral.findUnique({
      where: { referrerCode: code.toUpperCase() },
    });

    if (!referral) {
      return NextResponse.json(
        { error: "Code de parrainage invalide" },
        { status: 404 },
      );
    }

    // Check if expired
    if (referral.expiresAt && referral.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Ce code de parrainage a expire" },
        { status: 410 },
      );
    }

    // Increment click count
    await prisma.referral.update({
      where: { id: referral.id },
      data: {
        clickCount: { increment: 1 },
        lastClickAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      referrerReward: referral.referrerReward,
      referredReward: referral.referredReward,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Code invalide" }, { status: 400 });
    }

    console.error("Referral track error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET /api/referral/track?code=XXX - Validate a referral code
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Code requis" }, { status: 400 });
    }

    const referral = await prisma.referral.findUnique({
      where: { referrerCode: code.toUpperCase() },
      select: {
        referrerCode: true,
        referrerReward: true,
        referredReward: true,
        expiresAt: true,
        referrer: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!referral) {
      return NextResponse.json(
        { valid: false, error: "Code de parrainage invalide" },
        { status: 404 },
      );
    }

    if (referral.expiresAt && referral.expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, error: "Ce code de parrainage a expire" },
        { status: 410 },
      );
    }

    return NextResponse.json({
      valid: true,
      code: referral.referrerCode,
      referrerName: referral.referrer.name?.split(" ")[0] || "Un ami",
      discount: referral.referredReward,
    });
  } catch (error) {
    console.error("Referral validate error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
