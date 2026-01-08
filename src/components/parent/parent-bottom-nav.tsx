"use client";

import { LayoutDashboard, Users, ShoppingBag, BookOpen } from "lucide-react";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";

const navItems = [
  { name: "Accueil", href: "/parent", icon: LayoutDashboard },
  { name: "Enfants", href: "/parent/children", icon: Users },
  { name: "Cours", href: "/courses", icon: BookOpen },
  { name: "Achats", href: "/parent/purchases", icon: ShoppingBag },
];

export function ParentBottomNav() {
  return <MobileBottomNav items={navItems} />;
}
