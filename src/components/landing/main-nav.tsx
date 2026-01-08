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
  Sparkles,
  FlaskConical,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const subjects = [
  {
    name: "Mathématiques",
    href: "/courses?subject=mathematiques",
    icon: Calculator,
  },
  { name: "Français", href: "/courses?subject=francais", icon: BookOpen },
  { name: "Anglais", href: "/courses?subject=anglais", icon: Globe },
  { name: "Sciences", href: "/courses?subject=sciences", icon: Microscope },
  { name: "Histoire-Géo", href: "/courses?subject=histoire-geo", icon: Globe },
  {
    name: "Physique-Chimie",
    href: "/courses?subject=physique-chimie",
    icon: FlaskConical,
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
        className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
            className="absolute left-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-border bg-card p-2 shadow-xl"
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
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border/50 bg-background/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary"
          >
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="text-xl font-bold text-foreground">Schoolaris</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/courses"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <subject.icon className="h-4 w-4 text-primary" />
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
                  className="block rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                >
                  <p className="text-sm font-medium">{level.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {level.description}
                  </p>
                </Link>
              ))}
            </div>
          </Dropdown>

          <Link
            href="/teachers"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Users className="h-4 w-4" />
            Professeurs
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
          <Button
            className="bg-primary shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            asChild
          >
            <Link href="/register">
              <Sparkles className="mr-2 h-4 w-4" />
              S&apos;inscrire
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted md:hidden"
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
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="space-y-4 px-4 py-6">
              <Link
                href="/courses"
                className="block text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cours
              </Link>

              <div>
                <p className="mb-2 text-sm font-semibold text-muted-foreground">
                  Matières
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((subject) => (
                    <Link
                      key={subject.name}
                      href={subject.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
                    >
                      <subject.icon className="h-4 w-4 text-primary" />
                      {subject.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-muted-foreground">
                  Niveaux
                </p>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <Link
                      key={level.name}
                      href={level.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg bg-muted/50 px-3 py-2"
                    >
                      <p className="font-medium">{level.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {level.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/teachers"
                className="block text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Professeurs
              </Link>

              <div className="space-y-2 pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/register">
                    <Sparkles className="mr-2 h-4 w-4" />
                    S&apos;inscrire gratuitement
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
