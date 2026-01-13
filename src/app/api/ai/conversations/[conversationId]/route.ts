import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const conversationIdSchema = z.string().cuid("ID de conversation invalide");

// GET - Recuperer une conversation avec ses messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { conversationId } = await params;
    const parsed = conversationIdSchema.safeParse(conversationId);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "ID de conversation invalide" },
        { status: 400 },
      );
    }

    // Recuperer la conversation avec verification d'acces
    const conversation = await prisma.aIConversation.findFirst({
      where: {
        id: conversationId,
        child: {
          parentId: session.user.id,
        },
      },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            gradeLevel: true,
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            role: true,
            content: true,
            tokensUsed: true,
            createdAt: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation non trouvee" },
        { status: 404 },
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("[Conversation GET Error]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation de la conversation" },
      { status: 500 },
    );
  }
}

// DELETE - Supprimer une conversation
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { conversationId } = await params;
    const parsed = conversationIdSchema.safeParse(conversationId);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "ID de conversation invalide" },
        { status: 400 },
      );
    }

    // Verifier que la conversation appartient a l'utilisateur
    const conversation = await prisma.aIConversation.findFirst({
      where: {
        id: conversationId,
        child: {
          parentId: session.user.id,
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation non trouvee" },
        { status: 404 },
      );
    }

    // Supprimer (cascade supprime les messages)
    await prisma.aIConversation.delete({
      where: { id: conversationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Conversation DELETE Error]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la conversation" },
      { status: 500 },
    );
  }
}
