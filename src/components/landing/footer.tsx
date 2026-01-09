"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";

const linkSections = [
  {
    title: "Etudiants",
    links: [
      { href: "/courses", label: "Tous les cours" },
      { href: "/courses?category=matiere", label: "Par matiere" },
      { href: "/courses?category=niveau", label: "Par niveau" },
      { href: "/courses?free=true", label: "Cours gratuits" },
    ],
  },
  {
    title: "Enseignants",
    links: [
      { href: "/register/teacher", label: "Devenir createur" },
      { href: "/how-it-works", label: "Comment ca marche" },
      { href: "/resources", label: "Ressources" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { href: "/about", label: "A propos" },
      { href: "/careers", label: "Carrieres" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Centre d'aide" },
      { href: "/faq", label: "FAQ" },
      { href: "/conditions", label: "CGU" },
      { href: "/confidentialite", label: "Confidentialite" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#0B2A4C] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          {/* Logo & Tagline */}
          <div className="space-y-8 xl:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-white"
            >
              <GraduationCap size={32} className="text-[#E8A336]" />
              <span className="font-serif">Schoolaris</span>
            </Link>
            <p className="text-sm text-white/70">
              Ouvrir les portes du savoir, partout et pour tous.
            </p>
          </div>

          {/* Link Columns */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
            <div className="col-span-2 md:grid md:grid-cols-2 md:gap-8">
              {linkSections.slice(0, 2).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {section.title}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="text-sm leading-6 text-white/70 transition-colors duration-200 hover:text-white"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="col-span-2 md:grid md:grid-cols-2 md:gap-8">
              {linkSections.slice(2, 4).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {section.title}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="text-sm leading-6 text-white/70 transition-colors duration-200 hover:text-white"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 sm:mt-20 sm:flex-row lg:mt-24">
          <p className="text-sm leading-5 text-white/70">
            &copy; {new Date().getFullYear()} Schoolaris, Inc. Tous droits
            reserves.
          </p>
          <div className="flex space-x-6">
            <button className="text-sm font-semibold leading-6 text-white/70 transition-colors duration-200 hover:text-white">
              Francais (FR)
            </button>
            <button className="text-sm font-semibold leading-6 text-white/70 transition-colors duration-200 hover:text-white">
              € EUR
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
