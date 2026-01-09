"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

const footerLinks = {
  students: {
    title: "Étudiants",
    links: [
      { label: "Tous les cours", href: "/courses" },
      { label: "Par matière", href: "/courses" },
      { label: "Par niveau", href: "/courses" },
      { label: "Cours gratuits", href: "/courses?price=free" },
      { label: "Aide aux devoirs", href: "/ai-tutor" },
    ],
  },
  teachers: {
    title: "Enseignants",
    links: [
      { label: "Devenir créateur", href: "/register/teacher" },
      { label: "Comment ça marche", href: "/teachers" },
      { label: "Centre de ressources", href: "/resources" },
      { label: "Communauté", href: "/community" },
      { label: "Success stories", href: "/stories" },
    ],
  },
  company: {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "/about" },
      { label: "Carrières", href: "/careers" },
      { label: "Presse", href: "/press" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Centre d'aide", href: "/help" },
      { label: "FAQ", href: "/faq" },
      { label: "Conditions d'utilisation", href: "/terms" },
      { label: "Politique de confidentialité", href: "/privacy" },
      { label: "Accessibilité", href: "/accessibility" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-[#DDDDDD] bg-[#F7F7F7]">
      <div className="mx-auto max-w-[1760px] px-6 py-12 lg:px-10 lg:py-16">
        {/* Main footer content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF385C]">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#222222]">
                Schoolaris
              </span>
            </Link>
            <p className="mb-6 text-sm text-[#717171]">
              La plateforme qui connecte les meilleurs enseignants avec les
              élèves qui veulent réussir.
            </p>
            {/* App store badges placeholder */}
            <div className="flex gap-3">
              <div className="flex h-10 items-center justify-center rounded-lg bg-[#222222] px-4">
                <span className="text-xs font-medium text-white">
                  App Store
                </span>
              </div>
              <div className="flex h-10 items-center justify-center rounded-lg bg-[#222222] px-4">
                <span className="text-xs font-medium text-white">
                  Google Play
                </span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-semibold text-[#222222]">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#717171] transition-colors hover:text-[#222222]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#DDDDDD] pt-8 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#717171]">
            <span>© 2024 Schoolaris</span>
            <span>·</span>
            <Link href="/terms" className="hover:text-[#222222]">
              CGU
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-[#222222]">
              Confidentialité
            </Link>
            <span>·</span>
            <Link href="/cookies" className="hover:text-[#222222]">
              Cookies
            </Link>
          </div>

          {/* Language & Currency */}
          <div className="flex items-center gap-4 text-sm">
            <button className="flex items-center gap-2 text-[#222222] hover:underline">
              <span>🇫🇷</span>
              <span>Français</span>
            </button>
            <button className="text-[#222222] hover:underline">EUR (€)</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
