"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  BookOpen,
  GraduationCap,
  Play,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ParentSidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navigation = [
  { name: "Tableau de bord", href: "/parent", icon: LayoutDashboard },
  { name: "Mes Enfants", href: "/parent/children", icon: Users },
  { name: "Conversations IA", href: "/parent/conversations", icon: Sparkles },
  { name: "Cours Achetes", href: "/parent/purchases", icon: ShoppingBag },
  { name: "Parametres", href: "/parent/settings", icon: Settings },
];

export function ParentSidebar({ user }: ParentSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/parent") {
      return pathname === "/parent";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r bg-card lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold text-foreground">Schoolaris</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Learning Space - Access child interface */}
      <div className="border-t px-4 py-4">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Espace Apprentissage
        </p>
        <Link
          href="/student"
          className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:from-violet-600 hover:to-purple-700"
        >
          <Play className="h-5 w-5" />
          Acceder aux cours
          <Sparkles className="ml-auto h-4 w-4 opacity-70" />
        </Link>
        <Link
          href="/courses"
          className="mt-2 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <BookOpen className="h-5 w-5" />
          Acheter des cours
        </Link>
      </div>

      {/* User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "User"}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
