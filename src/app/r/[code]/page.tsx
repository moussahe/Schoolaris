import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

interface ReferralPageProps {
  params: Promise<{ code: string }>;
}

export default async function ReferralPage({ params }: ReferralPageProps) {
  const { code } = await params;
  const upperCode = code.toUpperCase();

  // Validate the referral code exists
  const referral = await prisma.referral.findUnique({
    where: { referrerCode: upperCode },
    select: {
      id: true,
      referrerCode: true,
      expiresAt: true,
      referredReward: true,
      referrer: {
        select: { name: true },
      },
    },
  });

  // If code is invalid, redirect to register without code
  if (!referral) {
    redirect("/register?error=invalid_referral");
  }

  // Check if expired
  if (referral.expiresAt && referral.expiresAt < new Date()) {
    redirect("/register?error=expired_referral");
  }

  // Track the click
  await prisma.referral.update({
    where: { id: referral.id },
    data: {
      clickCount: { increment: 1 },
      lastClickAt: new Date(),
    },
  });

  // Store referral code in cookie for registration
  const cookieStore = await cookies();
  cookieStore.set("referral_code", upperCode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  // Redirect to register page with referral info
  const referrerName = referral.referrer.name?.split(" ")[0] || "Un ami";
  const discount = (referral.referredReward / 100).toFixed(0);

  redirect(
    `/register?ref=${upperCode}&discount=${discount}&from=${encodeURIComponent(referrerName)}`,
  );
}
