"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Search,
  Trash2,
  User,
  Clock,
  ChevronRight,
  Sparkles,
  Plus,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { AIChat } from "@/components/ai/ai-chat";

interface Child {
  id: string;
  firstName: string;
  lastName?: string;
  gradeLevel: string;
  conversationCount: number;
}

interface Conversation {
  id: string;
  title: string;
  childId: string;
  childName: string;
  childGrade: string;
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

interface ConversationsClientProps {
  childrenData: Child[];
  initialConversations: Conversation[];
}

const gradeLabels: Record<string, string> = {
  CP: "CP",
  CE1: "CE1",
  CE2: "CE2",
  CM1: "CM1",
  CM2: "CM2",
  SIXIEME: "6e",
  CINQUIEME: "5e",
  QUATRIEME: "4e",
  TROISIEME: "3e",
  SECONDE: "2nde",
  PREMIERE: "1ere",
  TERMINALE: "Term",
};

export function ConversationsClient({
  childrenData,
  initialConversations,
}: ConversationsClientProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChildId, setSelectedChildId] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [selectedChildForChat, setSelectedChildForChat] =
    useState<Child | null>(null);

  // Filtrer les conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.childName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChild =
      selectedChildId === "all" || conv.childId === selectedChildId;
    return matchesSearch && matchesChild;
  });

  // Supprimer une conversation
  const handleDelete = async () => {
    if (!conversationToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/ai/conversations/${conversationToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setConversations((prev) =>
          prev.filter((c) => c.id !== conversationToDelete),
        );
        if (selectedConversation?.id === conversationToDelete) {
          setSelectedConversation(null);
        }
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  // Ouvrir une conversation
  const openConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
  };

  // Demarrer une nouvelle conversation
  const startNewChat = (child: Child) => {
    setSelectedChildForChat(child);
    setNewChatOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-violet-500" />
            Assistant IA
          </h1>
          <p className="text-muted-foreground">
            Historique des conversations avec l&apos;assistant pedagogique
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-2">
          {childrenData.slice(0, 3).map((child) => (
            <Badge
              key={child.id}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => startNewChat(child)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {child.firstName}
            </Badge>
          ))}
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tous les enfants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les enfants</SelectItem>
                {childrenData.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.firstName} ({child.conversationCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grille principale */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Liste des conversations */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations ({filteredConversations.length})
            </CardTitle>
            <CardDescription>
              Cliquez sur une conversation pour la consulter
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">
                    Aucune conversation trouvee
                  </p>
                  {childrenData.length > 0 && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => startNewChat(childrenData[0])}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle conversation
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={cn(
                        "flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                        selectedConversation?.id === conv.id && "bg-muted",
                      )}
                      onClick={() => openConversation(conv)}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                          <User className="h-5 w-5 text-violet-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{conv.title}</p>
                            <Badge
                              variant="outline"
                              className="text-xs shrink-0"
                            >
                              {gradeLabels[conv.childGrade] || conv.childGrade}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{conv.childName}</span>
                            <span>•</span>
                            <span>{conv.messageCount} messages</span>
                          </div>
                          {conv.lastMessage && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {conv.lastMessage.content.substring(0, 60)}...
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(conv.updatedAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConversationToDelete(conv.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Zone de chat */}
        <div className="lg:col-span-1">
          {selectedConversation ? (
            <AIChat
              context={{
                level:
                  gradeLabels[selectedConversation.childGrade] ||
                  selectedConversation.childGrade,
                subject: "General",
              }}
              childId={selectedConversation.childId}
              conversationId={selectedConversation.id}
              onClose={() => setSelectedConversation(null)}
            />
          ) : (
            <Card className="flex h-[500px] flex-col items-center justify-center">
              <div className="text-center p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Assistant IA</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  Selectionnez une conversation a gauche ou demarrez une
                  nouvelle discussion avec l&apos;assistant pedagogique.
                </p>
                {childrenData.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {childrenData.map((child) => (
                      <Button
                        key={child.id}
                        variant="outline"
                        size="sm"
                        onClick={() => startNewChat(child)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Chat avec {child.firstName}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la conversation ?</DialogTitle>
            <DialogDescription>
              Cette action est irreversible. Tous les messages de cette
              conversation seront definitivement supprimes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour nouvelle conversation */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              Nouvelle conversation avec {selectedChildForChat?.firstName}
            </DialogTitle>
          </DialogHeader>
          {selectedChildForChat && (
            <AIChat
              context={{
                level:
                  gradeLabels[selectedChildForChat.gradeLevel] ||
                  selectedChildForChat.gradeLevel,
                subject: "General",
              }}
              childId={selectedChildForChat.id}
              onClose={() => {
                setNewChatOpen(false);
                setSelectedChildForChat(null);
                router.refresh();
              }}
              onConversationCreated={() => {
                router.refresh();
              }}
              className="h-[400px]"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
