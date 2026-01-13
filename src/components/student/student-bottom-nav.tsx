"use client";

import { LayoutDashboard, BookOpen, Trophy, MessageSquare } from "lucide-react";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";

const navItems = [
  { name: "Accueil", href: "/student", icon: LayoutDashboard },
  { name: "Cours", href: "/student/courses", icon: BookOpen },
  { name: "Badges", href: "/student/badges", icon: Trophy },
  { name: "Assistant", href: "/student/ai-tutor", icon: MessageSquare },
];

export function StudentBottomNav() {
  return <MobileBottomNav items={navItems} />;
}
