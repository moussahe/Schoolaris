"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/courses", label: "Cours" },
  { href: "/subjects", label: "Matières" },
  { href: "/levels", label: "Niveaux" },
  { href: "/teachers", label: "Enseignants" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#FDFDFD]/95 shadow-[0px_4px_15px_rgba(0,0,0,0.05)] backdrop-blur-sm"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Schoolaris Home"
            >
              <GraduationCap className="h-8 w-8 text-[#E8A336]" />
              <span className="font-serif text-2xl font-bold text-[#0B2A4C]">
                Schoolaris
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 lg:flex">
              {!isSearchOpen &&
                navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group relative text-base font-medium text-[#1A1A1A]"
                  >
                    {link.label}
                    <span className="absolute bottom-[-4px] left-0 h-0.5 w-full origin-center scale-x-0 bg-[#E8A336] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </Link>
                ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hidden sm:block"
                    >
                      <input
                        type="text"
                        placeholder="Rechercher un cours..."
                        className="w-48 rounded-full border border-[#6B7280] px-4 py-2 text-sm focus:border-[#E8A336] focus:outline-none focus:ring-2 focus:ring-[#E8A336]/20"
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={toggleSearch}
                  aria-label="Toggle Search"
                  className="p-2 text-[#1A1A1A] transition-colors hover:text-[#E8A336]"
                >
                  {isSearchOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Auth Buttons - Desktop */}
              <div className="hidden items-center gap-3 lg:flex">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/login"
                    className="rounded-lg border-2 border-[#0B2A4C] px-5 py-2 text-sm font-semibold text-[#0B2A4C] transition-colors hover:bg-[#0B2A4C] hover:text-white"
                  >
                    Connexion
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/register"
                    className="rounded-lg bg-[#E8A336] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#D4922E]"
                  >
                    S&apos;inscrire
                  </Link>
                </motion.div>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button onClick={toggleMenu} aria-label="Open menu">
                  <Menu className="h-7 w-7 text-[#1A1A1A]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 bg-[#FDFDFD] lg:hidden"
          >
            <div className="flex h-full flex-col">
              {/* Mobile Header */}
              <div className="flex items-center justify-between border-b border-[#F4F5F7] p-4">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={toggleMenu}
                >
                  <GraduationCap className="h-8 w-8 text-[#E8A336]" />
                  <span className="font-serif text-2xl font-bold text-[#0B2A4C]">
                    Schoolaris
                  </span>
                </Link>
                <button onClick={toggleMenu} aria-label="Close menu">
                  <X className="h-7 w-7 text-[#1A1A1A]" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex flex-grow flex-col items-center justify-center gap-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={toggleMenu}
                      className="text-2xl font-medium text-[#1A1A1A] transition-colors hover:text-[#E8A336]"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-4 border-t border-[#F4F5F7] p-6">
                <Link
                  href="/login"
                  onClick={toggleMenu}
                  className="w-full rounded-lg border-2 border-[#0B2A4C] px-6 py-3 text-center text-lg font-semibold text-[#0B2A4C] transition-colors hover:bg-[#0B2A4C] hover:text-white"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={toggleMenu}
                  className="w-full rounded-lg bg-[#E8A336] px-6 py-3 text-center text-lg font-semibold text-white transition-colors hover:bg-[#D4922E]"
                >
                  S&apos;inscrire
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
