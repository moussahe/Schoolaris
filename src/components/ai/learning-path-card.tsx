"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Target,
  BookOpen,
  Clock,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FocusArea {
  subject: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

interface SuggestedLesson {
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  reason: string;
}

interface LearningPathRecommendation {
  summary: string;
  focusAreas: FocusArea[];
  weeklyGoals: string[];
  suggestedLessons: SuggestedLesson[];
  motivationalMessage: string;
  estimatedTimePerDay: number;
}

interface LearningPathCardProps {
  childId: string;
  courseId?: string;
  className?: string;
}

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

const priorityLabels = {
  high: "Prioritaire",
  medium: "Important",
  low: "A revoir",
};

export function LearningPathCard({
  childId,
  courseId,
  className,
}: LearningPathCardProps) {
  const [recommendation, setRecommendation] =
    useState<LearningPathRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLearningPath = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/ai/learning-path/${childId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur de chargement");
      }

      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningPath();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 p-6 shadow-sm",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-xl bg-violet-100">
            <Sparkles className="h-5 w-5 text-violet-500" />
          </div>
          <div className="flex-1">
            <div className="h-5 w-48 animate-pulse rounded bg-violet-100" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-violet-100" />
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-violet-600">
          Generation du parcours personnalise...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("rounded-2xl bg-gray-50 p-6 shadow-sm", className)}>
        <div className="flex items-center gap-3 text-gray-500">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={fetchLearningPath}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reessayer
        </Button>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 p-6 shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Parcours IA Personnalise
            </h3>
            <p className="text-xs text-gray-500">
              Recommandations basees sur les performances
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchLearningPath}
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      {/* Summary */}
      <p className="mt-4 text-sm text-gray-700">{recommendation.summary}</p>

      {/* Estimated time */}
      <div className="mt-4 flex items-center gap-2 text-sm text-violet-600">
        <Clock className="h-4 w-4" />
        <span>
          Temps recommande: {recommendation.estimatedTimePerDay} min/jour
        </span>
      </div>

      {/* Focus Areas */}
      {recommendation.focusAreas.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900">
            <Target className="h-4 w-4 text-violet-500" />
            Axes de travail
          </h4>
          <div className="space-y-2">
            {recommendation.focusAreas.slice(0, 3).map((area, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg border p-3",
                  priorityColors[area.priority],
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {formatSubject(area.subject)}
                  </span>
                  <span className="text-xs">
                    {priorityLabels[area.priority]}
                  </span>
                </div>
                <p className="mt-1 text-xs opacity-80">{area.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Goals */}
      {recommendation.weeklyGoals.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900">
            <TrendingUp className="h-4 w-4 text-violet-500" />
            Objectifs de la semaine
          </h4>
          <ul className="space-y-2">
            {recommendation.weeklyGoals.map((goal, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-500" />
                {goal}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested Lessons */}
      {recommendation.suggestedLessons.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900">
            <BookOpen className="h-4 w-4 text-violet-500" />
            Lecons suggerees
          </h4>
          <div className="space-y-2">
            {recommendation.suggestedLessons.slice(0, 4).map((lesson) => (
              <Link
                key={lesson.lessonId}
                href={`/parent/courses/${courseId || "unknown"}/lessons/${lesson.lessonId}?childId=${childId}`}
                className="flex items-center justify-between rounded-lg bg-white/60 p-3 transition-colors hover:bg-white"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {lesson.lessonTitle}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {lesson.courseTitle}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="mt-6 rounded-xl bg-violet-100/50 p-4">
        <p className="text-center text-sm italic text-violet-700">
          &ldquo;{recommendation.motivationalMessage}&rdquo;
        </p>
      </div>
    </div>
  );
}

function formatSubject(subject: string): string {
  const subjects: Record<string, string> = {
    MATHEMATIQUES: "Mathematiques",
    FRANCAIS: "Francais",
    HISTOIRE: "Histoire",
    GEOGRAPHIE: "Geographie",
    SCIENCES: "Sciences",
    ANGLAIS: "Anglais",
    PHYSIQUE: "Physique",
    CHIMIE: "Chimie",
    SVT: "SVT",
    PHILOSOPHIE: "Philosophie",
  };
  return subjects[subject] || subject;
}
