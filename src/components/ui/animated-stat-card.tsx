"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedStatCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (value < 1) {
      return latest.toFixed(1);
    }
    return Math.round(latest).toLocaleString("fr-FR");
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, value]);

  return (
    <span className="tabular-nums">
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function AnimatedStatCard({
  title,
  value,
  suffix = "",
  prefix = "",
  icon,
  description,
  trend,
  className,
  delay = 0,
}: AnimatedStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay,
      }}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-shadow hover:shadow-md",
          className,
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {icon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2, type: "spring" }}
                className="rounded-lg bg-primary/10 p-2 text-primary"
              >
                {icon}
              </motion.div>
            )}
          </div>

          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">
              <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            </h3>

            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}

            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.3 }}
                className="mt-2 flex items-center gap-1"
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.isPositive ? "text-green-600" : "text-red-600",
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs mois dernier
                </span>
              </motion.div>
            )}
          </div>

          {/* Decorative gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ delay: delay + 0.4 }}
            className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
