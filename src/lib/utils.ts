import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date range for display (e.g., "12 jan. - 18 jan.")
 */
export function formatWeekRange(weekStart: Date, weekEnd: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  };
  const startStr = weekStart.toLocaleDateString("fr-FR", options);
  const endStr = weekEnd.toLocaleDateString("fr-FR", options);
  return `${startStr} - ${endStr}`;
}
