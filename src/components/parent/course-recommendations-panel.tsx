"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Star,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CourseRecommendation {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  imageUrl: string | null;
  subject: string;
  gradeLevel: string;
  price: number;
  averageRating: number;
  totalStudents: number;
  authorName: string | null;
  matchReason: string;
  matchScore: number;
  weakAreasAddressed: string[];
}

interface RecommendationsData {
  childId: string;
  childName: string;
  gradeLevel: string;
  weakAreasCount: number;
  recommendations: CourseRecommendation[];
}

interface CourseRecommendationsPanelProps {
  childId: string;
  childName: string;
  className?: string;
}

const subjectLabels: Record<string, string> = {
  MATHEMATIQUES: "Maths",
  FRANCAIS: "Francais",
  HISTOIRE_GEO: "Histoire-Geo",
  SCIENCES: "Sciences",
  ANGLAIS: "Anglais",
  PHYSIQUE_CHIMIE: "Physique-Chimie",
  SVT: "SVT",
  PHILOSOPHIE: "Philo",
  ESPAGNOL: "Espagnol",
  ALLEMAND: "Allemand",
  SES: "SES",
  NSI: "NSI",
};

const subjectColors: Record<string, string> = {
  MATHEMATIQUES: "bg-blue-100 text-blue-700",
  FRANCAIS: "bg-purple-100 text-purple-700",
  HISTOIRE_GEO: "bg-amber-100 text-amber-700",
  SCIENCES: "bg-emerald-100 text-emerald-700",
  ANGLAIS: "bg-red-100 text-red-700",
  PHYSIQUE_CHIMIE: "bg-cyan-100 text-cyan-700",
  SVT: "bg-green-100 text-green-700",
  PHILOSOPHIE: "bg-indigo-100 text-indigo-700",
  ESPAGNOL: "bg-orange-100 text-orange-700",
  ALLEMAND: "bg-gray-100 text-gray-700",
  SES: "bg-pink-100 text-pink-700",
  NSI: "bg-slate-100 text-slate-700",
};

function formatPrice(priceInCents: number): string {
  const euros = priceInCents / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(euros);
}

function CourseCard({ course }: { course: CourseRecommendation }) {
  const hasWeakAreasMatch = course.weakAreasAddressed.length > 0;

  return (
    <div className="group relative rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-emerald-200 hover:shadow-md">
      {/* Match indicator for high scores */}
      {course.matchScore >= 70 && (
        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
          <Target className="h-3 w-3" />
        </div>
      )}

      <div className="flex gap-3">
        {/* Course image */}
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600">
              <span className="text-xl font-bold text-white">
                {course.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Course info */}
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600">
                {course.title}
              </h4>
              {course.subtitle && (
                <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                  {course.subtitle}
                </p>
              )}
            </div>
            <span
              className={cn(
                "flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                subjectColors[course.subject] || "bg-gray-100 text-gray-700",
              )}
            >
              {subjectLabels[course.subject] || course.subject}
            </span>
          </div>

          {/* Match reason */}
          {hasWeakAreasMatch ? (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
              <Target className="h-3 w-3" />
              <span className="line-clamp-1">{course.matchReason}</span>
            </div>
          ) : (
            <p className="mt-1.5 text-xs text-gray-500">{course.matchReason}</p>
          )}

          {/* Stats and price row */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {course.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {course.averageRating.toFixed(1)}
                </span>
              )}
              {course.totalStudents > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {course.totalStudents}
                </span>
              )}
            </div>
            <span className="text-sm font-bold text-emerald-600">
              {formatPrice(course.price)}
            </span>
          </div>
        </div>
      </div>

      {/* CTA overlay on hover */}
      <Link
        href={`/courses/${course.slug}`}
        className="absolute inset-0 rounded-xl"
      >
        <span className="sr-only">Voir le cours {course.title}</span>
      </Link>
    </div>
  );
}

export function CourseRecommendationsPanel({
  childId,
  childName,
  className,
}: CourseRecommendationsPanelProps) {
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/parent/recommendations/${childId}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erreur de chargement");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const hasRecommendations = data && data.recommendations.length > 0;
  const highMatchCount =
    data?.recommendations.filter((r) => r.matchScore >= 70).length || 0;

  return (
    <div className={cn("rounded-2xl bg-white shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Cours Recommandes pour {childName}
            </h3>
            <p className="text-xs text-gray-500">
              {hasRecommendations
                ? `${data.recommendations.length} cours suggeres${highMatchCount > 0 ? ` (${highMatchCount} ciblent les points faibles)` : ""}`
                : "Chargement..."}
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        <Button
          onClick={fetchRecommendations}
          disabled={isLoading}
          size="sm"
          variant="ghost"
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Error state */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Loading state */}
          {isLoading && !data && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-300" />
              <p className="mt-4 text-sm text-gray-500">
                Analyse des cours en cours...
              </p>
            </div>
          )}

          {/* Empty state */}
          {data && data.recommendations.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm font-medium text-gray-600">
                Pas de nouvelles recommandations
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {childName} a acces a tous les cours disponibles pour son niveau
              </p>
              <Button
                asChild
                className="mt-4 bg-emerald-500 hover:bg-emerald-600"
              >
                <Link href="/courses">Voir tous les cours</Link>
              </Button>
            </div>
          )}

          {/* Recommendations grid */}
          {hasRecommendations && (
            <div className="space-y-4">
              {/* Targeted courses callout */}
              {highMatchCount > 0 && data.weakAreasCount > 0 && (
                <div className="rounded-lg bg-emerald-50 p-3">
                  <div className="flex items-start gap-2">
                    <Target className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">
                        {highMatchCount} cours ciblent les {data.weakAreasCount}{" "}
                        points faibles detectes
                      </p>
                      <p className="mt-0.5 text-xs text-emerald-600">
                        Ces cours aideront {childName} a progresser sur ses
                        difficultes
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Course cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {data.recommendations.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {/* Footer CTA */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600">
                  Personnalise selon le niveau et les besoins de {childName}
                </p>
                <Link
                  href="/courses"
                  className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Voir plus <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
