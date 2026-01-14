import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const publishSchema = z.object({
  isPublished: z.boolean(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { courseId } = await params;
    const body = await req.json();
    const { isPublished } = publishSchema.parse(body);

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Cours non trouve" }, { status: 404 });
    }

    // Update publish status
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Donnees invalides", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Admin publish course error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
