"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Menu,
  Bell,
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  BookOpen,
  Flag,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

interface AdminHeaderProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "A";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 lg:px-8">
      {/* Mobile menu */}
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="flex h-16 items-center gap-2 border-b px-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <SheetTitle className="text-xl font-bold">Admin</SheetTitle>
            </SheetHeader>
            <nav className="space-y-1 p-4">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-red-50 text-red-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? "text-red-500" : "text-gray-400",
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-4 space-y-2">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <BookOpen className="h-5 w-5 text-gray-400" />
                Retour au site
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-5 w-5 text-gray-400" />
                Deconnexion
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-red-500">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold">Admin</span>
        </Link>
      </div>

      {/* Desktop: Admin badge */}
      <div className="hidden items-center gap-2 lg:flex">
        <Badge variant="destructive" className="gap-1">
          <ShieldCheck className="h-3 w-3" />
          Administration
        </Badge>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name ?? "Admin"}
                />
                <AvatarFallback className="bg-red-100 text-red-700">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:block">
                {user.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <Badge variant="destructive" className="mt-1 text-xs">
                Administrateur
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Parametres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/">
                <BookOpen className="mr-2 h-4 w-4" />
                Retour au site
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Deconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
