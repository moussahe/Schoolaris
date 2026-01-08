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
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const subjects = [
  {
    name: "Mathématiques",
    href: "/courses?subject=mathematiques",
    icon: Calculator,
    color: "text-[#00F2EA]",
  },
  {
    name: "Français",
    href: "/courses?subject=francais",
    icon: BookOpen,
    color: "text-[#E6007A]",
  },
  {
    name: "Anglais",
    href: "/courses?subject=anglais",
    icon: Globe,
    color: "text-[#D4FF00]",
  },
  {
    name: "Sciences",
    href: "/courses?subject=sciences",
    icon: Microscope,
    color: "text-[#00F2EA]",
  },
  {
    name: "Histoire-Géo",
    href: "/courses?subject=histoire-geo",
    icon: Globe,
    color: "text-[#E6007A]",
  },
  {
    name: "Physique-Chimie",
    href: "/courses?subject=physique-chimie",
    icon: FlaskConical,
    color: "text-[#D4FF00]",
  },
];

const levels = [
  {
    name: "Primaire",
    description: "CP, CE1, CE2, CM1, CM2",
    href: "/courses?level=primaire",
  },
  {
    name: "Collège",
    description: "6ème, 5ème, 4ème, 3ème",
    href: "/courses?level=college",
  },
  {
    name: "Lycée",
    description: "2nde, 1ère, Terminale",
    href: "/courses?level=lycee",
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
        className="flex items-center gap-1 text-sm font-medium text-slate-300 transition-colors hover:text-white"
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
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full z-50 mt-2 min-w-[240px] overflow-hidden rounded-xl border border-white/10 bg-[#0D122B]/95 p-2 shadow-2xl backdrop-blur-xl"
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
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
          ? "border-b border-white/10 bg-[#0D122B]/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E6007A] to-[#00F2EA]"
          >
            <GraduationCap className="h-5 w-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold text-white">Schoolaris</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/courses"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Cours
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
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <subject.icon className={cn("h-4 w-4", subject.color)} />
                  <span>{subject.name}</span>
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
                  className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
                >
                  <p className="text-sm font-medium text-white">{level.name}</p>
                  <p className="text-xs text-slate-400">{level.description}</p>
                </Link>
              ))}
            </div>
          </Dropdown>

          <Link
            href="/teachers"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Professeurs
          </Link>
        </nav>

        {/* Search + Auth */}
        <div className="hidden items-center gap-4 lg:flex">
          {/* Search hint */}
          <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-white/20 hover:bg-white/10">
            <Search className="h-4 w-4" />
            <span>Rechercher...</span>
            <div className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-xs">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </button>

          <Button
            variant="ghost"
            className="text-slate-300 hover:bg-white/5 hover:text-white"
            asChild
          >
            <Link href="/login">Connexion</Link>
          </Button>

          <Button
            className="bg-gradient-to-r from-[#E6007A] to-[#00F2EA] text-white hover:shadow-lg hover:shadow-[#E6007A]/20"
            asChild
          >
            <Link href="/register">S&apos;inscrire</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 lg:hidden"
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
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10 bg-[#0D122B] lg:hidden"
          >
            <div className="space-y-4 px-4 py-6">
              <Link
                href="/courses"
                className="block text-lg font-medium text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cours
              </Link>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-400">
                  Matières
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((subject) => (
                    <Link
                      key={subject.name}
                      href={subject.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300"
                    >
                      <subject.icon className={cn("h-4 w-4", subject.color)} />
                      {subject.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-400">
                  Niveaux
                </p>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <Link
                      key={level.name}
                      href={level.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <p className="font-medium text-white">{level.name}</p>
                      <p className="text-xs text-slate-400">
                        {level.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/teachers"
                className="block text-lg font-medium text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Professeurs
              </Link>

              <div className="space-y-2 pt-4">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-[#E6007A] to-[#00F2EA]"
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
