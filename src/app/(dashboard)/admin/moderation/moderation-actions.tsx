"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ModerationStatus } from "@prisma/client";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ModerationActionsProps {
  moderationId: string;
  courseId: string; // Used for potential future preview feature
  courseSlug: string;
  currentStatus: ModerationStatus;
}

// courseId will be used for detailed course preview modal

export function ModerationActions({
  moderationId,
  courseId: _courseId,
  courseSlug,
  currentStatus,
}: ModerationActionsProps) {
  void _courseId; // Reserved for future preview functionality
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | "changes" | null>(
    null,
  );
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/moderation/${moderationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          feedback: feedback.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Une erreur est survenue");
      }

      toast.success(
        action === "approve"
          ? "Cours approuve avec succes"
          : action === "reject"
            ? "Cours rejete"
            : "Demande de modifications envoyee",
      );
      setIsOpen(false);
      setAction(null);
      setFeedback("");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (selectedAction: "approve" | "reject" | "changes") => {
    setAction(selectedAction);
    setIsOpen(true);
  };

  const getDialogConfig = () => {
    switch (action) {
      case "approve":
        return {
          title: "Approuver le cours",
          description:
            "Le cours sera publie et visible par tous les utilisateurs. Vous pouvez ajouter un commentaire optionnel.",
          buttonLabel: "Approuver",
          buttonClass: "bg-emerald-600 hover:bg-emerald-700",
          icon: CheckCircle,
        };
      case "reject":
        return {
          title: "Rejeter le cours",
          description:
            "Le cours ne sera pas publie. Veuillez expliquer la raison du rejet a l'enseignant.",
          buttonLabel: "Rejeter",
          buttonClass: "bg-red-600 hover:bg-red-700",
          icon: XCircle,
        };
      case "changes":
        return {
          title: "Demander des modifications",
          description:
            "L'enseignant recevra votre feedback et pourra modifier son cours. Decrivez les changements necessaires.",
          buttonLabel: "Envoyer",
          buttonClass: "bg-orange-600 hover:bg-orange-700",
          icon: AlertTriangle,
        };
      default:
        return {
          title: "",
          description: "",
          buttonLabel: "",
          buttonClass: "",
          icon: CheckCircle,
        };
    }
  };

  const config = getDialogConfig();
  const DialogIcon = config.icon;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-lg p-2 hover:bg-muted transition-colors">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <a
              href={`/courses/${courseSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Voir le cours
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {currentStatus !== "APPROVED" && (
            <DropdownMenuItem
              onClick={() => openDialog("approve")}
              className="text-emerald-600 focus:text-emerald-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver
            </DropdownMenuItem>
          )}
          {currentStatus !== "CHANGES_REQUESTED" && (
            <DropdownMenuItem
              onClick={() => openDialog("changes")}
              className="text-orange-600 focus:text-orange-600"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Demander modifications
            </DropdownMenuItem>
          )}
          {currentStatus !== "REJECTED" && (
            <DropdownMenuItem
              onClick={() => openDialog("reject")}
              className="text-red-600 focus:text-red-600"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DialogIcon className="h-5 w-5" />
              {config.title}
            </DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">
                {action === "reject"
                  ? "Raison du rejet *"
                  : action === "changes"
                    ? "Modifications demandees *"
                    : "Commentaire (optionnel)"}
              </Label>
              <Textarea
                id="feedback"
                placeholder={
                  action === "reject"
                    ? "Expliquez pourquoi le cours est rejete..."
                    : action === "changes"
                      ? "Decrivez les modifications necessaires..."
                      : "Ajoutez un commentaire..."
                }
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleAction}
              disabled={
                isLoading ||
                ((action === "reject" || action === "changes") &&
                  !feedback.trim())
              }
              className={config.buttonClass}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {config.buttonLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
