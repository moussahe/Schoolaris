"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Twitter,
  Github,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const footerLinks = {
  platform: {
    title: "Plateforme",
    links: [
      { href: "/courses", label: "Tous les cours" },
      { href: "/courses?free=true", label: "Cours gratuits" },
      { href: "/subjects", label: "Par matiere" },
      { href: "/levels", label: "Par niveau" },
      { href: "/teachers", label: "Nos enseignants" },
    ],
  },
  teachers: {
    title: "Enseignants",
    links: [
      { href: "/register/teacher", label: "Devenir createur" },
      { href: "/teacher/resources", label: "Centre de ressources" },
      { href: "/teacher/success", label: "Histoires de succes" },
      { href: "/teacher/faq", label: "FAQ Enseignants" },
    ],
  },
  company: {
    title: "Entreprise",
    links: [
      { href: "/about", label: "A propos" },
      { href: "/careers", label: "Carrieres" },
      { href: "/press", label: "Presse" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { href: "/conditions", label: "Conditions d'utilisation" },
      { href: "/confidentialite", label: "Politique de confidentialite" },
      { href: "/cookies", label: "Gestion des cookies" },
      { href: "/accessibility", label: "Accessibilite" },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#0B2A4C]">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-white">
                Restez informe des nouveautes
              </h3>
              <p className="mt-1 text-sm text-white/70">
                Recevez nos meilleurs cours et conseils chaque semaine.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[#E8A336] focus:outline-none focus:ring-1 focus:ring-[#E8A336]"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="rounded-lg bg-[#E8A336] px-6 py-3 text-sm font-semibold text-[#0B2A4C] transition-colors hover:bg-[#D4922E]"
              >
                S&apos;inscrire
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-[#E8A336]" />
              <span className="font-serif text-2xl font-bold text-white">
                Schoolaris
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              La plateforme qui connecte les meilleurs enseignants avec les
              eleves qui veulent reussir. De la primaire au lycee.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 text-[#E8A336]" />
                contact@schoolaris.fr
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 text-[#E8A336]" />
                01 23 45 67 89
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 text-[#E8A336]" />
                Paris, France
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-[#E8A336]/20 hover:text-[#E8A336]"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-[#E8A336]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Download & Payment */}
        <div className="mt-12 flex flex-col items-center justify-between gap-8 border-t border-white/10 pt-8 lg:flex-row">
          {/* App Badges */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <span className="text-sm text-white/70">
              Bientot disponible sur
            </span>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                Play Store
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <span className="text-sm text-white/70">Paiements securises</span>
            <div className="flex gap-2">
              {["Visa", "Mastercard", "Stripe", "PayPal"].map((method) => (
                <div
                  key={method}
                  className="flex h-8 items-center justify-center rounded bg-white/10 px-3 text-xs font-medium text-white/80"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Schoolaris. Tous droits reserves.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-sm text-white/60 hover:text-white">
              Francais (FR)
            </button>
            <button className="text-sm text-white/60 hover:text-white">
              € EUR
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
