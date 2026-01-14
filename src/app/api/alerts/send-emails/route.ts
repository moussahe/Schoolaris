import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { getAlertEmailTemplate } from "@/lib/email/templates/alerts";
import type { Prisma } from "@prisma/client";

// Secret key to protect cron endpoint
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * POST /api/alerts/send-emails
 * Send email notifications for unsent alerts (INACTIVITY, LOW_QUIZ_SCORE, MILESTONE)
 * This should be triggered by a cron job every 6 hours
 */
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret (for security when called by external cron service)
    const authHeader = req.headers.get("authorization");
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get alerts that haven't been emailed yet
    // Only process INACTIVITY, LOW_QUIZ_SCORE, and MILESTONE alerts
    const alertsToSend = await prisma.alert.findMany({
      where: {
        emailSent: false,
        isDismissed: false,
        type: {
          in: ["INACTIVITY", "LOW_QUIZ_SCORE", "MILESTONE"],
        },
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        child: {
          select: {
            id: true,
            firstName: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 100, // Process in batches to avoid timeout
    });

    console.log(`[AlertEmails] Found ${alertsToSend.length} alerts to send`);

    const results: {
      success: number;
      failed: number;
      skipped: number;
      errors: string[];
    } = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    for (const alert of alertsToSend) {
      const { parent, child } = alert;

      // Skip if parent has no email
      if (!parent.email) {
        results.skipped++;
        await prisma.alert.update({
          where: { id: alert.id },
          data: { emailSent: true }, // Mark as "sent" to avoid retry
        });
        continue;
      }

      // Get the appropriate email template
      const metadata = (alert.metadata as Prisma.JsonObject) || {};
      const emailContent = getAlertEmailTemplate(
        alert.type,
        { ...metadata, actionUrl: alert.actionUrl },
        parent.name || "Cher parent",
        child?.firstName || "votre enfant",
        baseUrl,
      );

      if (!emailContent) {
        results.skipped++;
        continue;
      }

      try {
        await sendEmail({
          to: parent.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        // Mark as sent
        await prisma.alert.update({
          where: { id: alert.id },
          data: {
            emailSent: true,
          },
        });

        results.success++;
        console.log(
          `[AlertEmails] Sent ${alert.type} alert for ${child?.firstName || "child"} to ${parent.email}`,
        );
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Failed to send ${alert.type} for ${child?.firstName || "child"}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        console.error(`[AlertEmails] Failed to send ${alert.type}:`, error);
      }
    }

    return NextResponse.json({
      message: "Alert emails processing complete",
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AlertEmails] Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
