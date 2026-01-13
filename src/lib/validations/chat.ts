import { z } from "zod";

// Chat message schemas
export const sendMessageSchema = z.object({
  childId: z.string().cuid("ID d'enfant invalide"),
  conversationId: z.string().cuid("ID de conversation invalide").optional(),
  message: z
    .string()
    .min(1, "Le message ne peut pas etre vide")
    .max(2000, "Le message ne peut pas depasser 2000 caracteres"),
  // Context for AI
  courseId: z.string().cuid("ID de cours invalide").optional(),
  lessonId: z.string().cuid("ID de lecon invalide").optional(),
});

export const getConversationsSchema = z.object({
  childId: z.string().cuid("ID d'enfant invalide"),
  courseId: z.string().cuid("ID de cours invalide").optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  cursor: z.string().cuid("Curseur invalide").optional(),
});

export const getMessagesSchema = z.object({
  conversationId: z.string().cuid("ID de conversation invalide"),
  limit: z.coerce.number().min(1).max(100).default(50),
  cursor: z.string().cuid("Curseur invalide").optional(),
});

// Types
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetConversationsInput = z.infer<typeof getConversationsSchema>;
export type GetMessagesInput = z.infer<typeof getMessagesSchema>;
