import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import {
  weeklyReportEmail,
  weeklyReportText,
} from "@/lib/email/templates/weekly-report";

// Secret key to protect cron endpoint
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * POST /api/reports/weekly/send-emails
 * Send weekly report emails to parents
 * This should be triggered by a cron job every Sunday evening
 */
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret (for security when called by external cron service)
    const authHeader = req.headers.get("authorization");
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current week bounds (Monday to Sunday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Find all reports for this week that haven't been sent yet
    const reportsToSend = await prisma.weeklyReport.findMany({
      where: {
        weekStart: {
          gte: weekStart,
          lte: weekEnd,
        },
        emailSent: false,
      },
      include: {
        child: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    console.log(`[WeeklyEmails] Found ${reportsToSend.length} reports to send`);

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

    for (const report of reportsToSend) {
      const { child } = report;
      const parent = child.parent;

      // Skip if parent has no email
      if (!parent.email) {
        results.skipped++;
        continue;
      }

      // Format week range
      const weekRange = `${formatDate(report.weekStart)} au ${formatDate(report.weekEnd)}`;

      // Parse JSON fields
      const strengths = (report.strengths as string[] | null) || [];
      const areasToImprove = (report.areasToImprove as string[] | null) || [];
      const recommendations = (report.recommendations as string[] | null) || [];

      try {
        await sendEmail({
          to: parent.email,
          subject: `Rapport hebdomadaire de ${child.firstName} - ${formatDate(report.weekStart)}`,
          html: weeklyReportEmail({
            parentName: parent.name || "Cher parent",
            childName: child.firstName,
            weekRange,
            stats: {
              lessonsCompleted: report.lessonsCompleted,
              quizzesCompleted: report.quizzesCompleted,
              averageScore: report.averageQuizScore || 0,
              timeSpentMinutes: report.totalTimeSpent,
              xpEarned: report.xpEarned,
            },
            highlights: strengths,
            areasToImprove,
            recommendations,
            dashboardUrl: `${baseUrl}/parent/children/${child.id}`,
          }),
          text: weeklyReportText({
            parentName: parent.name || "Cher parent",
            childName: child.firstName,
            weekRange,
            stats: {
              lessonsCompleted: report.lessonsCompleted,
              quizzesCompleted: report.quizzesCompleted,
              averageScore: report.averageQuizScore || 0,
              timeSpentMinutes: report.totalTimeSpent,
              xpEarned: report.xpEarned,
            },
            highlights: strengths,
            areasToImprove,
            recommendations,
            dashboardUrl: `${baseUrl}/parent/children/${child.id}`,
          }),
        });

        // Mark as sent
        await prisma.weeklyReport.update({
          where: { id: report.id },
          data: {
            emailSent: true,
            sentAt: new Date(),
          },
        });

        results.success++;
        console.log(
          `[WeeklyEmails] Sent report for ${child.firstName} to ${parent.email}`,
        );
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Failed to send for ${child.firstName}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        console.error(
          `[WeeklyEmails] Failed to send for ${child.firstName}:`,
          error,
        );
      }
    }

    return NextResponse.json({
      message: "Weekly emails processing complete",
      results,
    });
  } catch (error) {
    console.error("[WeeklyEmails] Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}
