import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  constructWebhookEvent,
  calculatePlatformFee,
  calculateTeacherRevenue,
  stripe,
} from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import {
  purchaseConfirmationEmail,
  purchaseConfirmationText,
} from "@/lib/email/templates/purchase-confirmation";
import type Stripe from "stripe";

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = constructWebhookEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { courseId, buyerId, childId } = session.metadata || {};

  if (!courseId || !buyerId) {
    console.error("Missing metadata in checkout session:", session.id);
    return;
  }

  // Get course for pricing info
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      author: {
        include: {
          teacherProfile: true,
        },
      },
    },
  });

  if (!course) {
    console.error("Course not found for purchase:", courseId);
    return;
  }

  const amount = course.price;
  const platformFee = calculatePlatformFee(amount);
  const teacherRevenue = calculateTeacherRevenue(amount);

  // Get payment intent for transfer info
  let stripePaymentIntentId: string | undefined;
  let stripeTransferId: string | undefined;

  if (session.payment_intent) {
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent.id;
    stripePaymentIntentId = paymentIntentId;

    // Get transfer ID from payment intent
    try {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.transfer_data?.destination) {
        // The transfer is automatically created by Stripe Connect
        stripeTransferId = paymentIntent.latest_charge as string | undefined;
      }
    } catch (err) {
      console.error("Error retrieving payment intent:", err);
    }
  }

  // Create or update purchase record
  await prisma.purchase.upsert({
    where: {
      userId_courseId: {
        userId: buyerId,
        courseId,
      },
    },
    create: {
      userId: buyerId,
      courseId,
      childId: childId || null,
      amount,
      platformFee,
      teacherRevenue,
      stripePaymentIntentId,
      stripeTransferId,
      status: "COMPLETED",
    },
    update: {
      childId: childId || null,
      amount,
      platformFee,
      teacherRevenue,
      stripePaymentIntentId,
      stripeTransferId,
      status: "COMPLETED",
    },
  });

  // Update course total students
  await prisma.course.update({
    where: { id: courseId },
    data: {
      totalStudents: {
        increment: 1,
      },
    },
  });

  // Update teacher profile stats
  if (course.author.teacherProfile) {
    await prisma.teacherProfile.update({
      where: { id: course.author.teacherProfile.id },
      data: {
        totalStudents: {
          increment: 1,
        },
        totalRevenue: {
          increment: teacherRevenue,
        },
      },
    });
  }

  // Process referral rewards
  await processReferralReward(buyerId, courseId);

  // Send confirmation email
  await sendPurchaseConfirmationEmail({
    buyerId,
    courseId,
    childId,
    courseName: course.title,
    teacherName: course.author.name || "Professeur",
    price: amount,
  });

  console.log(`Purchase completed: Course ${courseId} by user ${buyerId}`);
}

/**
 * Send purchase confirmation email
 */
async function sendPurchaseConfirmationEmail(data: {
  buyerId: string;
  courseId: string;
  childId?: string;
  courseName: string;
  teacherName: string;
  price: number;
}) {
  try {
    // Get buyer info
    const buyer = await prisma.user.findUnique({
      where: { id: data.buyerId },
      select: { name: true, email: true },
    });

    if (!buyer?.email) {
      console.error("[Email] No email found for buyer:", data.buyerId);
      return;
    }

    // Get child name if applicable
    let childName: string | undefined;
    if (data.childId) {
      const child = await prisma.child.findUnique({
        where: { id: data.childId },
        select: { firstName: true },
      });
      childName = child?.firstName;
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const courseUrl = childName
      ? `${baseUrl}/parent/courses/${data.courseId}`
      : `${baseUrl}/dashboard/courses`;

    await sendEmail({
      to: buyer.email,
      subject: `Confirmation d'achat - ${data.courseName}`,
      html: purchaseConfirmationEmail({
        parentName: buyer.name || "Cher client",
        courseName: data.courseName,
        teacherName: data.teacherName,
        price: data.price,
        childName,
        courseUrl,
      }),
      text: purchaseConfirmationText({
        parentName: buyer.name || "Cher client",
        courseName: data.courseName,
        teacherName: data.teacherName,
        price: data.price,
        childName,
        courseUrl,
      }),
    });

    console.log(`[Email] Purchase confirmation sent to ${buyer.email}`);
  } catch (error) {
    console.error("[Email] Failed to send purchase confirmation:", error);
  }
}

/**
 * Process referral reward when user makes their first purchase
 */
async function processReferralReward(buyerId: string, courseId: string) {
  try {
    // Check if buyer has a referral (was referred by someone)
    const referral = await prisma.referral.findFirst({
      where: {
        referredId: buyerId,
        status: "SIGNED_UP", // Only process if not already converted
      },
    });

    if (!referral) {
      return; // User was not referred or already converted
    }

    // Check if this is their first purchase
    const purchaseCount = await prisma.purchase.count({
      where: {
        userId: buyerId,
        status: "COMPLETED",
      },
    });

    // Only reward on first purchase
    if (purchaseCount > 1) {
      return;
    }

    // Update referral status
    await prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: "CONVERTED",
        convertedAt: new Date(),
        purchaseId: courseId,
        courseId: courseId,
      },
    });

    // Give reward to referrer
    if (referral.referrerReward > 0) {
      await prisma.referralCredit.create({
        data: {
          userId: referral.referrerId,
          amount: referral.referrerReward,
          source: "referral_reward",
          referralId: referral.id,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      });

      // Mark referral as rewarded
      await prisma.referral.update({
        where: { id: referral.id },
        data: {
          status: "REWARDED",
          rewardedAt: new Date(),
          referrerPaid: true,
        },
      });

      console.log(
        `Referral reward: ${referral.referrerReward} credits given to user ${referral.referrerId}`,
      );
    }
  } catch (error) {
    console.error("Error processing referral reward:", error);
  }
}

/**
 * Handle account.updated event for Connect accounts
 */
async function handleAccountUpdated(account: Stripe.Account) {
  const { teacherId } = account.metadata || {};

  // If no teacherId in metadata, try to find by account ID
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      OR: [{ stripeAccountId: account.id }, { userId: teacherId }],
    },
  });

  if (!teacherProfile) {
    console.log("No teacher profile found for account:", account.id);
    return;
  }

  const isOnboarded = account.details_submitted && account.charges_enabled;

  // Update teacher profile status
  await prisma.teacherProfile.update({
    where: { id: teacherProfile.id },
    data: {
      stripeOnboarded: isOnboarded,
    },
  });

  console.log(
    `Teacher ${teacherProfile.userId} Stripe status updated: onboarded=${isOnboarded}`,
  );
}
