"use client";

import { cn } from "@/lib/utils";

interface SkipLinkProps {
  href?: string;
  className?: string;
}

export function SkipLink({ href = "#main-content", className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only",
        "fixed left-4 top-4 z-[100]",
        "rounded-md bg-primary px-4 py-2",
        "text-sm font-medium text-primary-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "transition-transform duration-200",
        "focus:translate-y-0 -translate-y-full",
        className,
      )}
    >
      Aller au contenu principal
    </a>
  );
}
