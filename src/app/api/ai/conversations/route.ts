import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema pour créer une conversation
const createConversationSchema = z.object({
  childId: z.string().cuid("ID d'enfant invalide"),
  courseId: z.string().cuid("ID de cours invalide").optional(),
  lessonId: z.string().cuid("ID de lecon invalide").optional(),
  title: z.string().max(100).optional(),
});

// Schema pour lister les conversations
const listConversationsSchema = z.object({
  childId: z.string().cuid("ID d'enfant invalide"),
  courseId: z.string().cuid("ID de cours invalide").optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  cursor: z.string().cuid("Curseur invalide").optional(),
});

// GET - Lister les conversations d'un enfant
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = listConversationsSchema.safeParse({
      childId: searchParams.get("childId"),
      courseId: searchParams.get("courseId"),
      limit: searchParams.get("limit") ?? 20,
      cursor: searchParams.get("cursor"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parametres invalides", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { childId, courseId, limit, cursor } = parsed.data;

    // Verifier que l'enfant appartient au parent
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId: session.user.id,
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: "Enfant non trouve ou non autorise" },
        { status: 404 },
      );
    }

    // Recuperer les conversations
    const conversations = await prisma.aIConversation.findMany({
      where: {
        childId,
        ...(courseId && { courseId }),
      },
      orderBy: { updatedAt: "desc" },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: {
            content: true,
            role: true,
            createdAt: true,
          },
        },
        _count: {
          select: { messages: true },
        },
      },
    });

    // Pagination
    let nextCursor: string | undefined;
    if (conversations.length > limit) {
      const nextItem = conversations.pop();
      nextCursor = nextItem?.id;
    }

    return NextResponse.json({
      conversations: conversations.map((c) => ({
        id: c.id,
        title: c.title || "Nouvelle conversation",
        courseId: c.courseId,
        lessonId: c.lessonId,
        messageCount: c._count.messages,
        lastMessage: c.messages[0] || null,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      nextCursor,
    });
  } catch (error) {
    console.error("[Conversations GET Error]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des conversations" },
      { status: 500 },
    );
  }
}

// POST - Creer une nouvelle conversation
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createConversationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Donnees invalides", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { childId, courseId, lessonId, title } = parsed.data;

    // Verifier que l'enfant appartient au parent
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId: session.user.id,
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: "Enfant non trouve ou non autorise" },
        { status: 404 },
      );
    }

    // Creer la conversation
    const conversation = await prisma.aIConversation.create({
      data: {
        childId,
        courseId,
        lessonId,
        title,
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("[Conversations POST Error]", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la conversation" },
      { status: 500 },
    );
  }
}
