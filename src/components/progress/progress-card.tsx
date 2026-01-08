"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, BookOpen, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressCardProps {
  course: {
    id: string;
    title: string;
    imageUrl?: string;
    totalLessons: number;
    completedLessons: number;
    lastAccessedAt?: Date;
  };
  className?: string;
}

export function CourseProgressCard({
  course,
  className,
}: CourseProgressCardProps) {
  const progress = Math.round(
    (course.completedLessons / course.totalLessons) * 100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={className}
    >
      <Card className="overflow-hidden">
        <div className="flex">
          {/* Thumbnail */}
          <div className="relative h-32 w-32 flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10">
            {course.imageUrl ? (
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <BookOpen className="h-10 w-10 text-primary/40" />
              </div>
            )}
            <div className="absolute bottom-2 left-2">
              <div className="rounded-full bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                {progress}%
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <h3 className="line-clamp-1 font-semibold text-foreground">
                {course.title}
              </h3>
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {course.completedLessons}/{course.totalLessons} lecons
                </span>
                {course.lastAccessedAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatRelativeTime(course.lastAccessedAt)}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

interface WeeklyGoalCardProps {
  goal: number;
  current: number;
  unit?: string;
  className?: string;
}

export function WeeklyGoalCard({
  goal,
  current,
  unit = "lecons",
  className,
}: WeeklyGoalCardProps) {
  const progress = Math.min((current / goal) * 100, 100);
  const isComplete = current >= goal;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target
            className={cn(
              "h-5 w-5",
              isComplete ? "text-green-500" : "text-primary",
            )}
          />
          Objectif hebdomadaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold text-foreground">
                {current}
              </span>
              <span className="text-muted-foreground">
                /{goal} {unit}
              </span>
            </div>
            {isComplete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-sm font-medium text-green-500"
              >
                <CheckCircle2 className="h-4 w-4" />
                Complete !
              </motion.div>
            )}
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                isComplete
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-primary to-primary/80",
              )}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            {[...Array(7)].map((_, i) => {
              const dayFilled = i < Math.ceil((current / goal) * 7);
              return (
                <div
                  key={i}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    dayFilled
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {dayFilled ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "A l'instant";
  if (minutes < 60) return `Il y a ${minutes}min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
