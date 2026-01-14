"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Flame,
  Target,
  BookOpen,
  Award,
  Clock,
  Zap,
  Crown,
  Medal,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  requirement: string;
  earned: boolean;
  earnedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

const allBadges: Badge[] = [
  {
    id: "first-lesson",
    name: "Premier Pas",
    description: "Terminer ta premiere lecon",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    requirement: "1 lecon terminee",
    earned: true,
    earnedAt: new Date("2024-01-15"),
  },
  {
    id: "streak-3",
    name: "En Feu",
    description: "Maintenir une serie de 3 jours",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    requirement: "3 jours consecutifs",
    earned: true,
    earnedAt: new Date("2024-01-18"),
  },
  {
    id: "streak-7",
    name: "Studieux",
    description: "Maintenir une serie de 7 jours",
    icon: Flame,
    color: "text-red-500",
    bgColor: "bg-red-100",
    requirement: "7 jours consecutifs",
    earned: false,
    progress: 5,
    maxProgress: 7,
  },
  {
    id: "quiz-master",
    name: "Maitre Quiz",
    description: "Obtenir 100% a un quiz",
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-100",
    requirement: "Score parfait",
    earned: true,
    earnedAt: new Date("2024-01-20"),
  },
  {
    id: "course-complete",
    name: "Diplomate",
    description: "Terminer un cours complet",
    icon: Award,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    requirement: "1 cours termine",
    earned: false,
    progress: 8,
    maxProgress: 12,
  },
  {
    id: "early-bird",
    name: "Matinal",
    description: "Etudier avant 8h du matin",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    requirement: "Session avant 8h",
    earned: false,
  },
  {
    id: "speed-learner",
    name: "Eclair",
    description: "Terminer 5 lecons en une journee",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    requirement: "5 lecons/jour",
    earned: false,
    progress: 2,
    maxProgress: 5,
  },
  {
    id: "champion",
    name: "Champion",
    description: "Atteindre le top 10 du classement",
    icon: Crown,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100",
    requirement: "Top 10 classement",
    earned: false,
  },
  {
    id: "xp-1000",
    name: "Millionnaire",
    description: "Accumuler 1000 XP",
    icon: Star,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100",
    requirement: "1000 XP",
    earned: true,
    earnedAt: new Date("2024-01-22"),
  },
  {
    id: "streak-30",
    name: "Legendaire",
    description: "Maintenir une serie de 30 jours",
    icon: Medal,
    color: "text-rose-500",
    bgColor: "bg-rose-100",
    requirement: "30 jours consecutifs",
    earned: false,
    progress: 5,
    maxProgress: 30,
  },
];

function BadgeCard({ badge, index }: { badge: Badge; index: number }) {
  const Icon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "relative rounded-2xl border p-6 transition-all",
        badge.earned
          ? "border-gray-200 bg-white hover:shadow-lg"
          : "border-gray-100 bg-gray-50",
      )}
    >
      {/* Lock overlay for unearned badges */}
      {!badge.earned && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-50/80 backdrop-blur-[1px]">
          <Lock className="h-8 w-8 text-gray-300" />
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Badge Icon */}
        <div
          className={cn(
            "mb-4 flex h-16 w-16 items-center justify-center rounded-full",
            badge.earned ? badge.bgColor : "bg-gray-100",
          )}
        >
          <Icon
            className={cn(
              "h-8 w-8",
              badge.earned ? badge.color : "text-gray-300",
            )}
          />
        </div>

        {/* Badge Name */}
        <h3
          className={cn(
            "text-lg font-bold",
            badge.earned ? "text-gray-900" : "text-gray-400",
          )}
        >
          {badge.name}
        </h3>

        {/* Description */}
        <p
          className={cn(
            "mt-1 text-sm",
            badge.earned ? "text-gray-600" : "text-gray-400",
          )}
        >
          {badge.description}
        </p>

        {/* Progress bar for unearned badges with progress */}
        {!badge.earned && badge.progress !== undefined && badge.maxProgress && (
          <div className="mt-4 w-full">
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${(badge.progress / badge.maxProgress) * 100}%`,
                }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {badge.progress}/{badge.maxProgress}
            </p>
          </div>
        )}

        {/* Earned date */}
        {badge.earned && badge.earnedAt && (
          <p className="mt-3 text-xs text-emerald-600">
            Obtenu le{" "}
            {badge.earnedAt.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function BadgesPage() {
  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all");

  const earnedCount = allBadges.filter((b) => b.earned).length;
  const filteredBadges = allBadges.filter((badge) => {
    if (filter === "earned") return badge.earned;
    if (filter === "locked") return !badge.earned;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Badges</h1>
          <p className="mt-1 text-gray-500">
            {earnedCount}/{allBadges.length} badges obtenus
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 rounded-xl bg-gray-100 p-1">
          {[
            { id: "all", label: "Tous" },
            { id: "earned", label: "Obtenus" },
            { id: "locked", label: "A debloquer" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer",
                filter === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <Trophy className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Progression des badges</h2>
            <p className="text-white/80">
              Continue comme ca ! Plus que {allBadges.length - earnedCount}{" "}
              badges a debloquer.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-3 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(earnedCount / allBadges.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-white"
            />
          </div>
          <p className="mt-2 text-sm text-white/80">
            {Math.round((earnedCount / allBadges.length) * 100)}% complete
          </p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBadges.map((badge, index) => (
          <BadgeCard key={badge.id} badge={badge} index={index} />
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className="rounded-2xl bg-gray-50 p-12 text-center">
          <Trophy className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">
            {filter === "earned"
              ? "Tu n'as pas encore de badges. Continue d'apprendre !"
              : "Tous les badges sont deja debloques. Bravo !"}
          </p>
        </div>
      )}
    </div>
  );
}
