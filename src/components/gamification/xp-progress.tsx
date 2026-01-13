"use client";

import { cn } from "@/lib/utils";
import { Star, Zap } from "lucide-react";

interface XPProgressProps {
  xp: number;
  level: number;
  progress: number;
  current: number;
  needed: number;
  className?: string;
  compact?: boolean;
}

export function XPProgress({
  xp,
  level,
  progress,
  current,
  needed,
  className,
  compact = false,
}: XPProgressProps) {
  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span className="text-xs font-semibold text-amber-700">
            Niv. {level}
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-violet-100 px-2 py-1">
          <Zap className="h-3.5 w-3.5 text-violet-500" />
          <span className="text-xs font-semibold text-violet-700">
            {xp.toLocaleString()} XP
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl bg-white p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-bold text-white shadow-lg">
            {level}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Niveau {level}</p>
            <p className="text-xs text-gray-500">
              {xp.toLocaleString()} XP au total
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-violet-600">
            {current.toLocaleString()} / {needed.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">XP pour niveau {level + 1}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>{progress}%</span>
          <span>{needed - current} XP restants</span>
        </div>
      </div>
    </div>
  );
}
