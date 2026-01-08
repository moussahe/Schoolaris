"use client";

import { motion } from "framer-motion";
import { Sparkles, Star, Zap, Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface XPBadgeProps {
  xp: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
}

export function XPBadge({
  xp,
  showLabel = true,
  size = "md",
  animate = true,
  className,
}: XPBadgeProps) {
  const sizeClasses = {
    sm: "h-6 px-2 text-xs gap-1",
    md: "h-8 px-3 text-sm gap-1.5",
    lg: "h-10 px-4 text-base gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const content = (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-bold",
        "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md",
        sizeClasses[size],
        className,
      )}
    >
      <Sparkles className={iconSizes[size]} />
      <span>{xp.toLocaleString("fr-FR")}</span>
      {showLabel && <span className="font-medium opacity-80">XP</span>}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

interface StreakBadgeProps {
  days: number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
}

export function StreakBadge({
  days,
  size = "md",
  animate = true,
  className,
}: StreakBadgeProps) {
  const sizeClasses = {
    sm: "h-6 px-2 text-xs gap-1",
    md: "h-8 px-3 text-sm gap-1.5",
    lg: "h-10 px-4 text-base gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const content = (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-bold",
        "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md",
        sizeClasses[size],
        className,
      )}
    >
      <Zap className={cn(iconSizes[size], "fill-current")} />
      <span>{days}</span>
      <span className="font-medium opacity-80">jours</span>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

type BadgeLevel = "bronze" | "silver" | "gold" | "platinum";

interface AchievementBadgeProps {
  name: string;
  level: BadgeLevel;
  icon?: "star" | "trophy" | "medal" | "award";
  description?: string;
  unlocked?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const levelStyles: Record<
  BadgeLevel,
  { bg: string; border: string; icon: string }
> = {
  bronze: {
    bg: "bg-gradient-to-br from-amber-600 to-amber-800",
    border: "ring-amber-400/50",
    icon: "text-amber-200",
  },
  silver: {
    bg: "bg-gradient-to-br from-slate-300 to-slate-500",
    border: "ring-slate-300/50",
    icon: "text-slate-100",
  },
  gold: {
    bg: "bg-gradient-to-br from-yellow-400 to-amber-500",
    border: "ring-yellow-300/50",
    icon: "text-yellow-100",
  },
  platinum: {
    bg: "bg-gradient-to-br from-cyan-300 to-blue-500",
    border: "ring-cyan-200/50",
    icon: "text-cyan-100",
  },
};

const icons = {
  star: Star,
  trophy: Trophy,
  medal: Medal,
  award: Award,
};

export function AchievementBadge({
  name,
  level,
  icon = "star",
  description,
  unlocked = true,
  size = "md",
  className,
}: AchievementBadgeProps) {
  const IconComponent = icons[icon];
  const styles = levelStyles[level];

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn("flex flex-col items-center gap-2", className)}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full ring-4 shadow-lg",
          sizeClasses[size],
          unlocked ? styles.bg : "bg-muted",
          unlocked ? styles.border : "ring-muted-foreground/20",
          !unlocked && "opacity-50 grayscale",
        )}
      >
        <IconComponent
          className={cn(
            iconSizes[size],
            unlocked ? styles.icon : "text-muted-foreground",
            icon === "star" && unlocked && "fill-current",
          )}
        />
      </div>
      <div className="text-center">
        <p
          className={cn(
            "text-sm font-medium",
            unlocked ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {name}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </motion.div>
  );
}

interface LevelProgressProps {
  currentXP: number;
  level: number;
  xpForNextLevel: number;
  className?: string;
}

export function LevelProgress({
  currentXP,
  level,
  xpForNextLevel,
  className,
}: LevelProgressProps) {
  const progress = Math.min((currentXP / xpForNextLevel) * 100, 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
            {level}
          </div>
          <span className="font-medium text-foreground">Niveau {level}</span>
        </div>
        <span className="text-muted-foreground">
          {currentXP.toLocaleString("fr-FR")} /{" "}
          {xpForNextLevel.toLocaleString("fr-FR")} XP
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
        />
      </div>
    </div>
  );
}
