import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  handleApiError,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
} from "@/lib/api-error";
import { z } from "zod";

type RouteParams = {
  params: Promise<{ courseId: string }>;
};

const publishSchema = z.object({
  isPublished: z.boolean(),
});

// POST /api/courses/[courseId]/publish - Publish or unpublish a course
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { courseId } = await params;
    const session = await auth();

    if (!session?.user) {
      return unauthorized();
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return notFound("Cours non trouve");
    }

    if (course.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return forbidden("Vous ne pouvez pas modifier ce cours");
    }

    const body = await req.json();
    const { isPublished } = publishSchema.parse(body);

    // If publishing, validate the course has minimum requirements
    if (isPublished && !course.isPublished) {
      const errors: string[] = [];

      // Check title
      if (!course.title || course.title.length < 5) {
        errors.push("Le titre doit contenir au moins 5 caracteres");
      }

      // Check description
      if (!course.description || course.description.length < 20) {
        errors.push("La description doit contenir au moins 20 caracteres");
      }

      // Check chapters
      if (course.chapters.length === 0) {
        errors.push("Le cours doit contenir au moins un chapitre");
      }

      // Check lessons
      const totalLessons = course.chapters.reduce(
        (acc, c) => acc + c.lessons.length,
        0,
      );
      if (totalLessons === 0) {
        errors.push("Le cours doit contenir au moins une lecon");
      }

      if (errors.length > 0) {
        return badRequest(errors.join(". "));
      }
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      isPublished: updatedCourse.isPublished,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
