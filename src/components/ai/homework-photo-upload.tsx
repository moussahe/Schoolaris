"use client";

import { useState, useRef, useCallback } from "react";
import {
  Camera,
  Upload,
  X,
  Loader2,
  ImageIcon,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface HomeworkPhotoUploadProps {
  onPhotoAnalyzed: (response: string) => void;
  context: {
    level: string;
    subject: string;
    courseTitle?: string;
    lessonTitle?: string;
  };
  disabled?: boolean;
  className?: string;
}

const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function HomeworkPhotoUpload({
  onPhotoAnalyzed,
  context,
  disabled,
  className,
}: HomeworkPhotoUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{
    base64: string;
    type: string;
  } | null>(null);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setPreview(null);
    setImageData(null);
    setQuestion("");
    setError(null);
    setIsLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    setIsOpen(false);
  }, [resetState]);

  const processFile = useCallback((file: File) => {
    setError(null);

    // Validate file type
    if (!SUPPORTED_TYPES.includes(file.type)) {
      setError("Format non supporte. Utilisez JPG, PNG, GIF ou WebP.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("Fichier trop volumineux. Maximum 5 Mo.");
      return;
    }

    // Create preview and base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);

      // Extract base64 data (remove data URL prefix)
      const base64 = result.split(",")[1];
      setImageData({
        base64,
        type: file.type,
      });
    };
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier.");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
      // Reset input to allow selecting same file again
      e.target.value = "";
    },
    [processFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  const handleSubmit = async () => {
    if (!imageData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/homework-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageData.base64,
          imageType: imageData.type,
          question: question.trim() || undefined,
          context,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      onPhotoAnalyzed(data.message);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className={cn(
          "h-11 w-11 flex-shrink-0 transition-all",
          "hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600",
          className,
        )}
        title="Envoyer une photo de devoir"
      >
        <Camera className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-amber-500" />
              Photo de devoir
            </DialogTitle>
            <DialogDescription>
              Prends une photo de ton exercice et l&apos;assistant t&apos;aidera
              a comprendre (sans donner les reponses !).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Preview or upload zone */}
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Apercu du devoir"
                  className="max-h-64 w-full rounded-lg border object-contain"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={resetState}
                  className="absolute right-2 top-2 h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-8 transition-colors hover:border-amber-300 hover:bg-amber-50 dark:border-gray-700 dark:bg-gray-900"
              >
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  Glisse une photo ici ou utilise les boutons ci-dessous
                </p>
                <div className="mt-4 flex gap-2">
                  {/* Camera button (mobile) */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Appareil photo
                  </Button>
                  {/* Gallery button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Galerie
                  </Button>
                </div>
              </div>
            )}

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Question input (optional) */}
            {preview && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ta question (optionnel)
                </label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ex: Je ne comprends pas comment faire la question 3..."
                  className="min-h-[80px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">
                  {question.length}/500 caracteres
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {preview && (
              <Button
                type="button"
                variant="outline"
                onClick={resetState}
                disabled={isLoading}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Changer de photo
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!imageData || isLoading}
              className="gap-2 bg-amber-600 hover:bg-amber-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  Envoyer la photo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
