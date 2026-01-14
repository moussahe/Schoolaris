import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/validations/password";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  email: z.string().email("Email invalide"),
  password: passwordSchema,
  role: z.enum(["PARENT", "TEACHER"]),
  referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe deja" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12);

    // Handle referral code if provided
    let referral = null;
    if (validated.referralCode) {
      referral = await prisma.referral.findUnique({
        where: { referrerCode: validated.referralCode.toUpperCase() },
      });

      // Validate referral
      if (referral) {
        // Check if expired
        if (referral.expiresAt && referral.expiresAt < new Date()) {
          referral = null;
        }
        // Check if already used (by this email or has a referred user)
        if (referral?.referredId) {
          referral = null;
        }
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Process referral if valid
    let referralBonus = 0;
    if (referral) {
      // Update referral with referred user
      await prisma.referral.update({
        where: { id: referral.id },
        data: {
          referredId: user.id,
          referredEmail: validated.email,
          status: "SIGNED_UP",
          signedUpAt: new Date(),
        },
      });

      // Give signup bonus to new user
      if (referral.referredReward > 0) {
        await prisma.referralCredit.create({
          data: {
            userId: user.id,
            amount: referral.referredReward,
            source: "signup_bonus",
            referralId: referral.id,
            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          },
        });
        referralBonus = referral.referredReward;
      }
    }

    // Return with onboarding flag for parents
    return NextResponse.json(
      {
        ...user,
        needsOnboarding: validated.role === "PARENT",
        referralBonus,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Donnees invalides", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation du compte" },
      { status: 500 },
    );
  }
}
