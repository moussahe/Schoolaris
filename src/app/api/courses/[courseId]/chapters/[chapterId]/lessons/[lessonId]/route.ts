import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  handleApiError,
  unauthorized,
  forbidden,
  notFound,
} from "@/lib/api-error";
import { updateLessonSchema } from "@/lib/validations/course";

type RouteParams = {
  params: Promise<{ courseId: string; chapterId: string; lessonId: string }>;
};

// Helper to check access
async function checkLessonAccess(
  courseId: string,
  chapterId: string,
  lessonId: string,
  userId?: string,
  role?: string,
) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { authorId: true, isPublished: true },
  });

  if (!course) {
    return { error: "course_not_found" };
  }

  const chapter = await prisma.chapter.findFirst({
    where: { id: chapterId, courseId },
    select: { id: true, isPublished: true },
  });

  if (!chapter) {
    return { error: "chapter_not_found" };
  }

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, chapterId },
  });

  if (!lesson) {
    return { error: "lesson_not_found" };
  }

  const isOwner = userId === course.authorId;
  const isAdmin = role === "ADMIN";

  return { course, chapter, lesson, isOwner, isAdmin };
}

// GET /api/courses/[courseId]/chapters/[chapterId]/lessons/[lessonId]
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { courseId, chapterId, lessonId } = await params;
    const session = await auth();

    const check = await checkLessonAccess(
      courseId,
      chapterId,
      lessonId,
      session?.user?.id,
      session?.user?.role,
    );

    if (check.error === "course_not_found") {
      return notFound("Cours non trouve");
    }
    if (check.error === "chapter_not_found") {
      return notFound("Chapitre non trouve");
    }
    if (check.error === "lesson_not_found") {
      return notFound("Lecon non trouvee");
    }

    const { lesson, isOwner, isAdmin } = check;

    // Check if user can access the content
    if (!isOwner && !isAdmin) {
      // Check if free preview
      if (lesson!.isFreePreview) {
        return NextResponse.json(lesson);
      }

      // Check if user has purchased the course
      if (!session?.user) {
        // Return lesson metadata without content
        return NextResponse.json({
          id: lesson!.id,
          title: lesson!.title,
          description: lesson!.description,
          contentType: lesson!.contentType,
          duration: lesson!.duration,
          isFreePreview: lesson!.isFreePreview,
          requiresPurchase: true,
        });
      }

      const purchase = await prisma.purchase.findFirst({
        where: {
          courseId,
          userId: session.user.id,
          status: "COMPLETED",
        },
      });

      if (!purchase) {
        return NextResponse.json({
          id: lesson!.id,
          title: lesson!.title,
          description: lesson!.description,
          contentType: lesson!.contentType,
          duration: lesson!.duration,
          isFreePreview: lesson!.isFreePreview,
          requiresPurchase: true,
        });
      }
    }

    // Full access - include content, quiz info, resources
    const fullLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        quizzes: {
          include: {
            questions: {
              orderBy: { position: "asc" },
            },
          },
        },
        resources: true,
      },
    });

    return NextResponse.json(fullLesson);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/courses/[courseId]/chapters/[chapterId]/lessons/[lessonId]
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { courseId, chapterId, lessonId } = await params;
    const session = await auth();

    if (!session?.user) {
      return unauthorized();
    }

    const check = await checkLessonAccess(
      courseId,
      chapterId,
      lessonId,
      session.user.id,
      session.user.role,
    );

    if (check.error === "course_not_found") {
      return notFound("Cours non trouve");
    }
    if (check.error === "chapter_not_found") {
      return notFound("Chapitre non trouve");
    }
    if (check.error === "lesson_not_found") {
      return notFound("Lecon non trouvee");
    }

    if (!check.isOwner && !check.isAdmin) {
      return forbidden("Vous ne pouvez pas modifier cette lecon");
    }

    const body = await req.json();
    const validated = updateLessonSchema.parse(body);

    // Track duration change for course stats
    const oldDuration = check.lesson!.duration || 0;
    const newDuration = validated.duration ?? oldDuration;
    const durationDiff = newDuration - oldDuration;

    // Extract quiz fields from validated data to handle separately
    const { quizQuestions, quizPassingScore, ...lessonData } = validated;

    // Use transaction for lesson + quiz updates
    const updatedLesson = await prisma.$transaction(async (tx) => {
      const lesson = await tx.lesson.update({
        where: { id: lessonId },
        data: lessonData,
      });

      // Handle quiz updates if content type is QUIZ
      if (
        lessonData.contentType === "QUIZ" &&
        quizQuestions &&
        quizQuestions.length > 0
      ) {
        // Find existing quiz
        const existingQuiz = await tx.quiz.findFirst({
          where: { lessonId },
        });

        if (existingQuiz) {
          // Update existing quiz
          await tx.quiz.update({
            where: { id: existingQuiz.id },
            data: {
              title: lessonData.title || check.lesson!.title,
              description: lessonData.description,
              passingScore: quizPassingScore ?? 70,
            },
          });

          // Delete old questions and create new ones
          await tx.question.deleteMany({
            where: { quizId: existingQuiz.id },
          });

          await tx.question.createMany({
            data: quizQuestions.map((q, index) => ({
              quizId: existingQuiz.id,
              question: q.question,
              options: q.options,
              explanation: q.explanation,
              position: index,
            })),
          });
        } else {
          // Create new quiz
          const quiz = await tx.quiz.create({
            data: {
              title: lessonData.title || check.lesson!.title,
              description: lessonData.description,
              lessonId,
              passingScore: quizPassingScore ?? 70,
            },
          });

          await tx.question.createMany({
            data: quizQuestions.map((q, index) => ({
              quizId: quiz.id,
              question: q.question,
              options: q.options,
              explanation: q.explanation,
              position: index,
            })),
          });
        }
      }

      // Update course duration if changed
      if (durationDiff !== 0) {
        await tx.course.update({
          where: { id: courseId },
          data: {
            totalDuration: { increment: durationDiff },
          },
        });
      }

      return lesson;
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/courses/[courseId]/chapters/[chapterId]/lessons/[lessonId]
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { courseId, chapterId, lessonId } = await params;
    const session = await auth();

    if (!session?.user) {
      return unauthorized();
    }

    const check = await checkLessonAccess(
      courseId,
      chapterId,
      lessonId,
      session.user.id,
      session.user.role,
    );

    if (check.error === "course_not_found") {
      return notFound("Cours non trouve");
    }
    if (check.error === "chapter_not_found") {
      return notFound("Chapitre non trouve");
    }
    if (check.error === "lesson_not_found") {
      return notFound("Lecon non trouvee");
    }

    if (!check.isOwner && !check.isAdmin) {
      return forbidden("Vous ne pouvez pas supprimer cette lecon");
    }

    const lessonDuration = check.lesson!.duration || 0;

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    // Update course stats
    await prisma.course.update({
      where: { id: courseId },
      data: {
        totalLessons: { decrement: 1 },
        totalDuration: { decrement: lessonDuration },
      },
    });

    return NextResponse.json({ message: "Lecon supprimee avec succes" });
  } catch (error) {
    return handleApiError(error);
  }
}
