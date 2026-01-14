import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateReportSchema = z.object({
  action: z.enum(["review", "resolve", "dismiss", "escalate"]),
  resolution: z.string().optional(),
  contentAction: z.enum(["hide", "delete", "suspend"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorise" }, { status: 401 });
    }

    const { reportId } = await params;
    const body = await req.json();
    const { action, resolution, contentAction } =
      updateReportSchema.parse(body);

    // Get report
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json(
        { message: "Signalement non trouve" },
        { status: 404 },
      );
    }

    // Determine new status
    const statusMap = {
      review: "UNDER_REVIEW" as const,
      resolve: "RESOLVED" as const,
      dismiss: "DISMISSED" as const,
      escalate: "ESCALATED" as const,
    };

    const newStatus = statusMap[action];

    // Update report
    const updatedReport = await prisma.$transaction(async (tx) => {
      const updated = await tx.report.update({
        where: { id: reportId },
        data: {
          status: newStatus,
          assignedTo: session.user.id,
          ...(action === "review" && { reviewedAt: new Date() }),
          ...(action === "resolve" && {
            resolvedAt: new Date(),
            resolution: resolution || null,
          }),
          ...(action === "dismiss" && {
            resolvedAt: new Date(),
            resolution: resolution || "Signalement rejete",
          }),
          ...(action === "escalate" && {
            priority: "HIGH",
            adminNotes: resolution || null,
          }),
        },
      });

      // Handle content action if specified
      if (contentAction && action === "resolve") {
        switch (contentAction) {
          case "hide":
            // Mark content as hidden based on target type
            if (report.targetType === "FORUM_REPLY") {
              await tx.forumReply.update({
                where: { id: report.targetId },
                data: { isHidden: true },
              });
            }
            break;
          case "delete":
            // Delete content based on target type
            if (report.targetType === "REVIEW") {
              await tx.review.delete({
                where: { id: report.targetId },
              });
            } else if (report.targetType === "FORUM_REPLY") {
              await tx.forumReply.delete({
                where: { id: report.targetId },
              });
            } else if (report.targetType === "FORUM_TOPIC") {
              await tx.forumTopic.delete({
                where: { id: report.targetId },
              });
            }
            break;
          case "suspend":
            // Suspend user (would need a suspended field on User model)
            // For now, just log the action
            console.log(`User ${report.targetId} should be suspended`);
            break;
        }
      }

      return updated;
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Donnees invalides", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Report update error:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorise" }, { status: 401 });
    }

    const { reportId } = await params;

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        assignedAdmin: {
          select: { id: true, name: true },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { message: "Signalement non trouve" },
        { status: 404 },
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Report fetch error:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
