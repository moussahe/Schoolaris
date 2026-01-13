"use client";

import { cn } from "@/lib/utils";
import { Flame, Trophy } from "lucide-react";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
  compact?: boolean;
}

export function StreakCounter({
  currentStreak,
  longestStreak,
  className,
  compact = false,
}: StreakCounterProps) {
  const isOnFire = currentStreak >= 3;

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-1 rounded-full px-2 py-1",
          isOnFire ? "bg-orange-100" : "bg-gray-100",
          className,
        )}
      >
        <Flame
          className={cn(
            "h-3.5 w-3.5",
            isOnFire ? "fill-orange-500 text-orange-500" : "text-gray-400",
          )}
        />
        <span
          className={cn(
            "text-xs font-semibold",
            isOnFire ? "text-orange-700" : "text-gray-500",
          )}
        >
          {currentStreak} jour{currentStreak > 1 ? "s" : ""}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl bg-white p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              isOnFire
                ? "bg-gradient-to-br from-orange-400 to-red-500"
                : "bg-gray-100",
            )}
          >
            <Flame
              className={cn(
                "h-6 w-6",
                isOnFire ? "fill-white text-white" : "text-gray-400",
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Serie en cours</p>
            <p
              className={cn(
                "text-2xl font-bold",
                isOnFire ? "text-orange-500" : "text-gray-400",
              )}
            >
              {currentStreak} jour{currentStreak > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <div className="text-right">
            <p className="text-xs text-gray-500">Record</p>
            <p className="text-sm font-semibold text-amber-600">
              {longestStreak} jours
            </p>
          </div>
        </div>
      </div>
      {currentStreak > 0 && (
        <div className="mt-4">
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full",
                  i < currentStreak % 7
                    ? "bg-gradient-to-r from-orange-400 to-red-500"
                    : "bg-gray-100",
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">
            {7 - (currentStreak % 7)} jour
            {7 - (currentStreak % 7) > 1 ? "s" : ""} avant le prochain badge
            serie
          </p>
        </div>
      )}
    </div>
  );
}
