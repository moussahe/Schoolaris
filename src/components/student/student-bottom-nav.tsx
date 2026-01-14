"use client";

import { LayoutDashboard, BookOpen, Brain, Users } from "lucide-react";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";

const navItems = [
  { name: "Accueil", href: "/student", icon: LayoutDashboard },
  { name: "Cours", href: "/student/courses", icon: BookOpen },
  { name: "Revision", href: "/student/revision", icon: Brain },
  { name: "Parent", href: "/parent", icon: Users },
];

export function StudentBottomNav() {
  return <MobileBottomNav items={navItems} />;
}
