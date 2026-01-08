"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  cours: [
    { name: "Tous les cours", href: "/courses" },
    { name: "Primaire", href: "/courses?level=primaire" },
    { name: "Collège", href: "/courses?level=college" },
    { name: "Lycée", href: "/courses?level=lycee" },
  ],
  matieres: [
    { name: "Mathématiques", href: "/courses?subject=mathematiques" },
    { name: "Français", href: "/courses?subject=francais" },
    { name: "Anglais", href: "/courses?subject=anglais" },
    { name: "Sciences", href: "/courses?subject=sciences" },
  ],
  enseignants: [
    { name: "Devenir créateur", href: "/register/teacher" },
    { name: "Guide professeur", href: "/teacher/guide" },
    { name: "Tarification", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
  ],
  entreprise: [
    { name: "À propos", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Carrières", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "CGU", href: "/conditions" },
    { name: "Confidentialité", href: "/confidentialite" },
    { name: "Cookies", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/schoolaris" },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com/company/schoolaris",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/schoolaris",
  },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@schoolaris" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Main footer content */}
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary"
              >
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span className="text-xl font-bold text-white">Schoolaris</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              La marketplace de cours scolaires. Créés par des profs, propulsés
              par l&apos;IA. Du CP à la Terminale.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-white">
                Restez informé
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Cours</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.cours.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Matières</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.matieres.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Enseignants
            </h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.enseignants.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Légal</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Schoolaris. Tous droits réservés.
          </p>
          <p className="text-gray-500">
            Fait avec ❤️ en France pour l&apos;éducation
          </p>
        </div>
      </div>
    </footer>
  );
}
