"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Mathématiques", href: "/courses?subject=mathematiques" },
  { name: "Français", href: "/courses?subject=francais" },
  { name: "Anglais", href: "/courses?subject=anglais" },
  { name: "Sciences", href: "/courses?subject=sciences" },
  { name: "Histoire-Géo", href: "/courses?subject=histoire-geo" },
  { name: "Physique-Chimie", href: "/courses?subject=physique-chimie" },
];

const levels = [
  { name: "Primaire", href: "/courses?level=primaire" },
  { name: "Collège", href: "/courses?level=college" },
  { name: "Lycée", href: "/courses?level=lycee" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-white shadow-sm" : "bg-white",
      )}
    >
      {/* Top bar */}
      <div className="border-b border-[#DDDDDD]">
        <div className="mx-auto flex h-[72px] max-w-[1760px] items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF385C]">
              <span className="text-lg font-bold text-white">S</span>
            </div>
            <span className="text-xl font-semibold text-[#222222]">
              Schoolaris
            </span>
          </Link>

          {/* Search bar - Airbnb style */}
          <div className="hidden flex-1 justify-center lg:flex">
            <button className="flex items-center gap-4 rounded-full border border-[#DDDDDD] bg-white px-4 py-2 shadow-sm transition-shadow hover:shadow-md">
              <span className="border-r border-[#DDDDDD] pr-4 text-sm font-medium text-[#222222]">
                Cours
              </span>
              <span className="border-r border-[#DDDDDD] pr-4 text-sm text-[#717171]">
                Niveau
              </span>
              <span className="text-sm text-[#717171]">Matière</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF385C]">
                <Search className="h-4 w-4 text-white" />
              </div>
            </button>
          </div>

          {/* Right nav */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/register/teacher"
              className="rounded-full px-4 py-2 text-sm font-medium text-[#222222] transition-colors hover:bg-[#F7F7F7]"
            >
              Devenir enseignant
            </Link>
            <button className="rounded-full p-2 transition-colors hover:bg-[#F7F7F7]">
              <Globe className="h-5 w-5 text-[#222222]" />
            </button>
            <Button
              variant="outline"
              className="rounded-full border-[#222222] text-[#222222] hover:bg-[#F7F7F7]"
              asChild
            >
              <Link href="/login">Connexion</Link>
            </Button>
            <Button
              className="rounded-full bg-[#FF385C] text-white hover:bg-[#E31C5F]"
              asChild
            >
              <Link href="/register">S&apos;inscrire</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F7F7F7] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Categories bar */}
      <div className="hidden border-b border-[#DDDDDD] lg:block">
        <div className="mx-auto max-w-[1760px] px-6 lg:px-10">
          <nav className="flex items-center gap-8 py-3">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-1 text-sm text-[#222222] transition-colors hover:text-[#FF385C]"
            >
              Catégories
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  showCategories && "rotate-180",
                )}
              />
            </button>
            {levels.map((level) => (
              <Link
                key={level.name}
                href={level.href}
                className="text-sm text-[#717171] transition-colors hover:text-[#222222]"
              >
                {level.name}
              </Link>
            ))}
            <Link
              href="/courses"
              className="text-sm text-[#717171] transition-colors hover:text-[#222222]"
            >
              Tous les cours
            </Link>
          </nav>
        </div>
      </div>

      {/* Categories dropdown */}
      <AnimatePresence>
        {showCategories && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full border-b border-[#DDDDDD] bg-white shadow-lg"
          >
            <div className="mx-auto max-w-[1760px] px-6 py-8 lg:px-10">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={() => setShowCategories(false)}
                    className="rounded-xl p-4 text-center transition-colors hover:bg-[#F7F7F7]"
                  >
                    <p className="font-medium text-[#222222]">
                      {category.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-[#DDDDDD] bg-white lg:hidden"
          >
            <div className="space-y-4 p-6">
              {/* Mobile search */}
              <div className="flex items-center gap-3 rounded-full border border-[#DDDDDD] p-3">
                <Search className="h-5 w-5 text-[#717171]" />
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  className="flex-1 text-sm outline-none placeholder:text-[#717171]"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
                  Niveaux
                </p>
                {levels.map((level) => (
                  <Link
                    key={level.name}
                    href={level.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg p-3 text-[#222222] hover:bg-[#F7F7F7]"
                  >
                    {level.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
                  Matières
                </p>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg p-3 text-[#222222] hover:bg-[#F7F7F7]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-3 border-t border-[#DDDDDD] pt-4">
                <Link
                  href="/register/teacher"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center font-medium text-[#222222]"
                >
                  Devenir enseignant
                </Link>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-[#222222]"
                  asChild
                >
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button
                  className="w-full rounded-full bg-[#FF385C] hover:bg-[#E31C5F]"
                  asChild
                >
                  <Link href="/register">S&apos;inscrire</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
