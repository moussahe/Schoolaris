"use client";

import { LayoutDashboard, BookOpen, Brain, MessageSquare } from "lucide-react";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";

const navItems = [
  { name: "Accueil", href: "/student", icon: LayoutDashboard },
  { name: "Cours", href: "/student/courses", icon: BookOpen },
  { name: "Revision", href: "/student/revision", icon: Brain },
  { name: "Assistant", href: "/student/ai-tutor", icon: MessageSquare },
];

export function StudentBottomNav() {
  return <MobileBottomNav items={navItems} />;
}
