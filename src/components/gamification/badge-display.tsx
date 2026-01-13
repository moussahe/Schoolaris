"use client";

import { cn } from "@/lib/utils";
import {
  Award,
  BookOpen,
  Flame,
  Star,
  Trophy,
  Sparkles,
  Users,
} from "lucide-react";

type BadgeCategory = "PROGRESS" | "STREAK" | "QUIZ" | "ACHIEVEMENT" | "SOCIAL";

interface Badge {
  code: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  category: BadgeCategory;
  earnedAt: Date;
}

interface BadgeDisplayProps {
  badges: Badge[];
  className?: string;
  maxVisible?: number;
  compact?: boolean;
}

const categoryIcons: Record<BadgeCategory, typeof Award> = {
  PROGRESS: BookOpen,
  STREAK: Flame,
  QUIZ: Star,
  ACHIEVEMENT: Trophy,
  SOCIAL: Users,
};

const categoryColors: Record<BadgeCategory, string> = {
  PROGRESS: "from-emerald-400 to-green-500",
  STREAK: "from-orange-400 to-red-500",
  QUIZ: "from-blue-400 to-indigo-500",
  ACHIEVEMENT: "from-amber-400 to-yellow-500",
  SOCIAL: "from-pink-400 to-rose-500",
};

const categoryBg: Record<BadgeCategory, string> = {
  PROGRESS: "bg-emerald-100 text-emerald-600",
  STREAK: "bg-orange-100 text-orange-600",
  QUIZ: "bg-blue-100 text-blue-600",
  ACHIEVEMENT: "bg-amber-100 text-amber-600",
  SOCIAL: "bg-pink-100 text-pink-600",
};

export function BadgeDisplay({
  badges,
  className,
  maxVisible = 5,
  compact = false,
}: BadgeDisplayProps) {
  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = badges.length - maxVisible;

  if (badges.length === 0) {
    return (
      <div className={cn("rounded-xl bg-white p-4 shadow-sm", className)}>
        <div className="flex flex-col items-center justify-center py-4 text-gray-400">
          <Award className="h-8 w-8 mb-2" />
          <span className="text-sm">Aucun badge</span>
          <span className="text-xs mt-1">
            Continue pour debloquer des badges !
          </span>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {visibleBadges.map((badge) => {
          const Icon = categoryIcons[badge.category];
          return (
            <div
              key={badge.code}
              title={`${badge.name}: ${badge.description}`}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full cursor-help",
                categoryBg[badge.category],
              )}
            >
              <Icon className="h-3 w-3" />
            </div>
          );
        })}
        {remainingCount > 0 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl bg-white p-4 shadow-sm", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <Sparkles className="h-4 w-4 text-violet-500" />
          Badges ({badges.length})
        </h3>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {visibleBadges.map((badge) => {
          const Icon = categoryIcons[badge.category];
          return (
            <div
              key={badge.code}
              title={`${badge.name}: ${badge.description} - Obtenu le ${new Date(badge.earnedAt).toLocaleDateString("fr-FR")}`}
              className="flex flex-col items-center gap-1 cursor-help"
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-md",
                  categoryColors[badge.category],
                )}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="max-w-full truncate text-xs font-medium text-gray-600">
                {badge.name}
              </span>
            </div>
          );
        })}
        {remainingCount > 0 && (
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <span className="text-sm font-semibold text-gray-600">
                +{remainingCount}
              </span>
            </div>
            <span className="text-xs text-gray-400">Autres</span>
          </div>
        )}
      </div>
    </div>
  );
}
