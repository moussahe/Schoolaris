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

// Types pour le streaming
interface StreamEvent {
  type: "init" | "text" | "done" | "error";
  userMessageId?: string;
  userMessageCreatedAt?: string;
  text?: string;
  assistantMessageId?: string;
  assistantMessageCreatedAt?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  error?: string;
}

interface StreamCallbacks {
  onStart?: (userMessageId: string) => void;
  onText?: (text: string, fullText: string) => void;
  onComplete?: (
    assistantMessageId: string,
    usage: { inputTokens: number; outputTokens: number },
  ) => void;
  onError?: (error: string) => void;
}

interface ChatContext {
  level: string;
  subject: string;
  courseTitle?: string;
  lessonTitle?: string;
  lessonContent?: string;
}

// Hook pour le streaming SSE
export function useStreamingMessage() {
  const queryClient = useQueryClient();

  const streamMessage = async (
    conversationId: string,
    content: string,
    context: ChatContext,
    callbacks?: StreamCallbacks,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(
        `/api/ai/conversations/${conversationId}/messages/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, context }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.error || "Erreur d'envoi";
        callbacks?.onError?.(errorMessage);
        return { success: false, error: errorMessage };
      }

      const reader = res.body?.getReader();
      if (!reader) {
        callbacks?.onError?.("Stream non disponible");
        return { success: false, error: "Stream non disponible" };
      }

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event: StreamEvent = JSON.parse(line.slice(6));

              switch (event.type) {
                case "init":
                  if (event.userMessageId) {
                    callbacks?.onStart?.(event.userMessageId);
                  }
                  break;

                case "text":
                  if (event.text) {
                    fullText += event.text;
                    callbacks?.onText?.(event.text, fullText);
                  }
                  break;

                case "done":
                  if (event.assistantMessageId && event.usage) {
                    callbacks?.onComplete?.(
                      event.assistantMessageId,
                      event.usage,
                    );
                  }
                  // Invalider les queries pour refresh
                  queryClient.invalidateQueries({
                    queryKey: ["conversation-messages", conversationId],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["conversations"],
                  });
                  break;

                case "error":
                  callbacks?.onError?.(event.error || "Erreur inconnue");
                  return { success: false, error: event.error };
              }
            } catch {
              // Ignorer les erreurs de parsing JSON pour les lignes incompletes
            }
          }
        }
      }

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur de connexion";
      callbacks?.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return { streamMessage };
}
