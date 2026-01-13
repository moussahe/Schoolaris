import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types
export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  tokensUsed?: number | null;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  title: string | null;
  childId: string;
  courseId: string | null;
  lessonId: string | null;
  messageCount: number;
  lastMessage: {
    content: string;
    role: string;
    createdAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface ChatContext {
  level: string;
  subject: string;
  courseTitle?: string;
  lessonTitle?: string;
}

interface SendMessageParams {
  conversationId: string;
  content: string;
  context: ChatContext;
}

// Hook simple pour le chat sans persistence
export function useAIChat() {
  const sendMutation = useMutation({
    mutationFn: async ({
      messages,
      context,
    }: {
      messages: Array<{ role: string; content: string }>;
      context: ChatContext;
    }) => {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, context }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur d'envoi");
      }

      return res.json();
    },
  });

  return {
    sendMessage: sendMutation.mutateAsync,
    isLoading: sendMutation.isPending,
    error: sendMutation.error,
  };
}

// Hook pour lister les conversations d'un enfant
export function useConversations(
  childId: string | undefined,
  courseId?: string,
) {
  return useQuery({
    queryKey: ["conversations", childId, courseId],
    queryFn: async () => {
      if (!childId) return { conversations: [], nextCursor: undefined };

      const params = new URLSearchParams({ childId });
      if (courseId) params.append("courseId", courseId);

      const res = await fetch(`/api/ai/conversations?${params}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de chargement");
      }

      return res.json() as Promise<{
        conversations: AIConversation[];
        nextCursor?: string;
      }>;
    },
    enabled: !!childId,
  });
}

// Hook pour recuperer les messages d'une conversation
export function useConversationMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return { messages: [] };

      const res = await fetch(`/api/ai/conversations/${conversationId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de chargement");
      }

      const data = await res.json();
      return {
        ...data,
        messages:
          data.messages?.map(
            (m: {
              id: string;
              role: string;
              content: string;
              tokensUsed?: number;
              createdAt: string;
            }) => ({
              id: m.id,
              role: m.role.toLowerCase(),
              content: m.content,
              tokensUsed: m.tokensUsed,
              createdAt: m.createdAt,
            }),
          ) || [],
      };
    },
    enabled: !!conversationId,
  });
}

// Hook pour envoyer un message avec persistence
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      context,
    }: SendMessageParams) => {
      const res = await fetch(
        `/api/ai/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, context }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur d'envoi");
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalider les queries pour refresh
      queryClient.invalidateQueries({
        queryKey: ["conversation-messages", variables.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
}

// Hook pour supprimer une conversation
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const res = await fetch(`/api/ai/conversations/${conversationId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de suppression");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
