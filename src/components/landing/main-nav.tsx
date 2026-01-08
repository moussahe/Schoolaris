"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  Calculator,
  BookOpen,
  Globe,
  Microscope,
  FlaskConical,
  Search,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const subjects = [
  {
    name: "Mathématiques",
    href: "/courses?subject=mathematiques",
    icon: Calculator,
    color: "text-violet-600 bg-violet-100",
  },
  {
    name: "Français",
    href: "/courses?subject=francais",
    icon: BookOpen,
    color: "text-rose-600 bg-rose-100",
  },
  {
    name: "Anglais",
    href: "/courses?subject=anglais",
    icon: Globe,
    color: "text-teal-600 bg-teal-100",
  },
  {
    name: "Sciences",
    href: "/courses?subject=sciences",
    icon: Microscope,
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    name: "Histoire-Géo",
    href: "/courses?subject=histoire-geo",
    icon: History,
    color: "text-amber-600 bg-amber-100",
  },
  {
    name: "Physique-Chimie",
    href: "/courses?subject=physique-chimie",
    icon: FlaskConical,
    color: "text-blue-600 bg-blue-100",
  },
];

const levels = [
  {
    name: "Primaire",
    description: "CP, CE1, CE2, CM1, CM2",
    href: "/courses?level=primaire",
    emoji: "🎨",
  },
  {
    name: "Collège",
    description: "6ème, 5ème, 4ème, 3ème",
    href: "/courses?level=college",
    emoji: "📚",
  },
  {
    name: "Lycée",
    description: "2nde, 1ère, Terminale",
    href: "/courses?level=lycee",
    emoji: "🎓",
  },
];

interface DropdownProps {
  trigger: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function Dropdown({ trigger, children, isOpen, onToggle }: DropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        {trigger}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-2 min-w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MainNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-lg"
          : "bg-white",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-200"
          >
            <GraduationCap className="h-5 w-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold text-slate-900">Schoolaris</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/courses"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Tous les cours
          </Link>

          <Dropdown
            trigger="Matières"
            isOpen={openDropdown === "subjects"}
            onToggle={() => handleDropdownToggle("subjects")}
          >
            <div className="grid grid-cols-2 gap-1">
              {subjects.map((subject) => (
                <Link
                  key={subject.name}
                  href={subject.href}
                  onClick={() => setOpenDropdown(null)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      subject.color,
                    )}
                  >
                    <subject.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {subject.name}
                  </span>
                </Link>
              ))}
            </div>
          </Dropdown>

          <Dropdown
            trigger="Niveaux"
            isOpen={openDropdown === "levels"}
            onToggle={() => handleDropdownToggle("levels")}
          >
            <div className="space-y-1">
              {levels.map((level) => (
                <Link
                  key={level.name}
                  href={level.href}
                  onClick={() => setOpenDropdown(null)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50"
                >
                  <span className="text-2xl">{level.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {level.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {level.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Dropdown>

          <Link
            href="/register/teacher"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Enseigner
          </Link>
        </nav>

        {/* Search + Auth */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Search button */}
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100">
            <Search className="h-4 w-4" />
            <span>Rechercher...</span>
            <kbd className="ml-2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-400">
              ⌘K
            </kbd>
          </button>

          <Button
            variant="ghost"
            className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            asChild
          >
            <Link href="/login">Connexion</Link>
          </Button>

          <Button
            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-semibold shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300"
            asChild
          >
            <Link href="/register">S&apos;inscrire gratuitement</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden"
          >
            <div className="space-y-4 px-4 py-6">
              <Link
                href="/courses"
                className="block text-lg font-semibold text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tous les cours
              </Link>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-400">
                  Matières
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((subject) => (
                    <Link
                      key={subject.name}
                      href={subject.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700"
                    >
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-lg",
                          subject.color,
                        )}
                      >
                        <subject.icon className="h-3.5 w-3.5" />
                      </div>
                      {subject.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-400">
                  Niveaux
                </p>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <Link
                      key={level.name}
                      href={level.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                    >
                      <span className="text-xl">{level.emoji}</span>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {level.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {level.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/register/teacher"
                className="block text-lg font-semibold text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Enseigner
              </Link>

              <div className="space-y-3 border-t border-slate-200 pt-4">
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-slate-200"
                  asChild
                >
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-semibold"
                  asChild
                >
                  <Link href="/register">S&apos;inscrire gratuitement</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
