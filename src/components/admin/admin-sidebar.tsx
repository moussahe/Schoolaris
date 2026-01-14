"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  Flag,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Cours",
    href: "/admin/courses",
    icon: GraduationCap,
  },
  {
    name: "Moderation",
    href: "/admin/moderation",
    icon: ShieldCheck,
  },
  {
    name: "Signalements",
    href: "/admin/reports",
    icon: Flag,
  },
  {
    name: "Analytiques",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Parametres",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card",
        className,
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-foreground">Admin</span>
      </div>

      {/* Warning Banner */}
      <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <span>Panneau d&apos;administration</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-red-500" : "text-muted-foreground",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Back to main site */}
      <div className="border-t p-4 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          Retour au site
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-5 w-5 text-muted-foreground" />
          Deconnexion
        </Button>
      </div>
    </aside>
  );
}
