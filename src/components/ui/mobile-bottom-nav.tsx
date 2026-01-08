"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MobileBottomNavProps {
  items: NavItem[];
  className?: string;
}

export function MobileBottomNav({ items, className }: MobileBottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string, items: NavItem[]) => {
    const baseRoute = items[0]?.href.split("/")[1];
    if (href === `/${baseRoute}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80 lg:hidden",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-around px-2 pb-safe">
        {items.map((item) => {
          const active = isActive(item.href, items);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  active && "scale-110",
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
