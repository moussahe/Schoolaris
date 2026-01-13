"use client";

import { Bell, Search, Flame, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface StudentHeaderProps {
  child: {
    id: string;
    firstName: string;
    lastName?: string | null;
    avatarUrl?: string | null;
    xp: number;
    level: number;
    currentStreak: number;
  };
  onSwitchAccount?: () => void;
}

export function StudentHeader({ child, onSwitchAccount }: StudentHeaderProps) {
  return (
    <header className="sticky top-0 z-40 hidden h-16 items-center justify-between border-b bg-card px-8 lg:flex">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher une lecon..."
          className="pl-10 rounded-xl bg-muted focus:bg-background"
        />
      </div>

      {/* Gamification Stats (Desktop) */}
      <div className="flex items-center gap-3">
        {/* Streak */}
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1.5">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-semibold text-orange-700">
            {child.currentStreak} jours
          </span>
        </div>

        {/* Level */}
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 px-3 py-1.5">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span className="text-sm font-semibold text-amber-700">
            Niveau {child.level}
          </span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-1.5">
          <Zap className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-semibold text-violet-700">
            {child.xp.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-xl">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-xl"
            >
              <Avatar className="h-8 w-8 ring-2 ring-violet-200">
                <AvatarImage
                  src={child.avatarUrl ?? undefined}
                  alt={child.firstName}
                />
                <AvatarFallback className="bg-violet-100 text-violet-600 font-semibold">
                  {child.firstName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">
                {child.firstName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon espace</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/student">Tableau de bord</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/student/courses">Mes cours</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/student/badges">Mes badges</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/student/ai-tutor">Assistant IA</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onSwitchAccount && (
              <DropdownMenuItem onClick={onSwitchAccount}>
                Changer de compte
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/parent" className="text-muted-foreground">
                Retour espace parent
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
