"use client";

import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Play,
  Sparkles,
} from "lucide-react";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";

const navItems = [
  { name: "Accueil", href: "/parent", icon: LayoutDashboard },
  { name: "Enfants", href: "/parent/children", icon: Users },
  { name: "IA", href: "/parent/conversations", icon: Sparkles },
  { name: "Apprendre", href: "/student", icon: Play },
  { name: "Achats", href: "/parent/purchases", icon: ShoppingBag },
];

export function ParentBottomNav() {
  return <MobileBottomNav items={navItems} />;
}
