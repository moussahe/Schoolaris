import { useState, useCallback } from "react";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

interface Conversation {
  id: string;
  title: string | null;
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

interface ConversationWithMessages {
  id: string;
  title: string | null;
  courseId: string | null;
  lessonId: string | null;
  child: {
    id: string;
    firstName: string;
    gradeLevel: string;
  };
  messages: Message[];
}

interface ChatContext {
  level: string;
  subject: string;
  courseTitle?: string;
  lessonTitle?: string;
}

interface UseAIConversationsReturn {
  conversations: Conversation[];
  currentConversation: ConversationWithMessages | null;
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  fetchConversations: (childId: string, courseId?: string) => Promise<void>;
  createConversation: (
    childId: string,
    courseId?: string,
    lessonId?: string,
  ) => Promise<string | null>;
  loadConversation: (conversationId: string) => Promise<void>;
  sendMessage: (
    conversationId: string,
    content: string,
    context: ChatContext,
  ) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  clearError: () => void;
}

export function useAIConversations(): UseAIConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<ConversationWithMessages | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchConversations = useCallback(
    async (childId: string, courseId?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ childId });
        if (courseId) params.append("courseId", courseId);

        const res = await fetch(`/api/ai/conversations?${params}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erreur de chargement");
        }

        setConversations(data.conversations);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const createConversation = useCallback(
    async (
      childId: string,
      courseId?: string,
      lessonId?: string,
    ): Promise<string | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/ai/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childId, courseId, lessonId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erreur de creation");
        }

        setCurrentConversation({
          ...data,
          child: { id: childId, firstName: "", gradeLevel: "" },
          messages: [],
        });
        setMessages([]);

        return data.id;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de creation");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const loadConversation = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai/conversations/${conversationId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Conversation non trouvee");
      }

      setCurrentConversation(data);
      setMessages(
        data.messages.map(
          (m: {
            id: string;
            role: string;
            content: string;
            createdAt: string;
          }) => ({
            id: m.id,
            role: m.role.toLowerCase(),
            content: m.content,
            createdAt: m.createdAt,
          }),
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (conversationId: string, content: string, context: ChatContext) => {
      setIsSending(true);
      setError(null);

      // Optimistic update
      const userMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const res = await fetch(
          `/api/ai/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, context }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          // Rollback optimistic update
          setMessages((prev) => prev.slice(0, -1));
          throw new Error(data.error || "Erreur d'envoi");
        }

        // Update with real IDs
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            id: data.userMessage.id,
            role: "user",
            content: data.userMessage.content,
            createdAt: data.userMessage.createdAt,
          },
          {
            id: data.assistantMessage.id,
            role: "assistant",
            content: data.assistantMessage.content,
            createdAt: data.assistantMessage.createdAt,
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur d'envoi");
      } finally {
        setIsSending(false);
      }
    },
    [],
  );

  const deleteConversation = useCallback(
    async (conversationId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/ai/conversations/${conversationId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erreur de suppression");
        }

        setConversations((prev) => prev.filter((c) => c.id !== conversationId));
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
          setMessages([]);
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de suppression");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversation?.id],
  );

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    isSending,
    error,
    fetchConversations,
    createConversation,
    loadConversation,
    sendMessage,
    deleteConversation,
    clearError,
  };
}
