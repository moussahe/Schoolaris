// Weak Areas API - Get weak areas for a child
// GET /api/children/[childId]/weak-areas

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ childId: string }> },
) {
  try {
    // 1. Auth
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { childId } = await params;

    // 2. Verify child belongs to parent
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId: session.user.id,
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Enfant non trouve" }, { status: 404 });
    }

    // 3. Fetch weak areas for this child
    const weakAreas = await prisma.weakArea.findMany({
      where: {
        childId,
      },
      orderBy: [
        { isResolved: "asc" }, // Active first
        { errorCount: "desc" }, // Most errors first
        { lastErrorAt: "desc" }, // Most recent first
      ],
    });

    // 4. Return weak areas
    return NextResponse.json({
      success: true,
      weakAreas: weakAreas.map((wa) => ({
        id: wa.id,
        topic: wa.topic,
        subject: wa.subject,
        gradeLevel: wa.gradeLevel,
        category: wa.category,
        errorCount: wa.errorCount,
        attemptCount: wa.attemptCount,
        lastErrorAt: wa.lastErrorAt.toISOString(),
        isResolved: wa.isResolved,
        resolvedAt: wa.resolvedAt?.toISOString() || null,
      })),
      stats: {
        total: weakAreas.length,
        active: weakAreas.filter((wa) => !wa.isResolved).length,
        resolved: weakAreas.filter((wa) => wa.isResolved).length,
      },
    });
  } catch (error) {
    console.error("Weak areas fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
