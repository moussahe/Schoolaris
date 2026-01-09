"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Calculator,
  BookOpen,
  Globe,
  Microscope,
  FlaskConical,
  Landmark,
  Palette,
  Music,
} from "lucide-react";

const categories = [
  {
    name: "Mathématiques",
    icon: Calculator,
    count: 156,
    color: "#FF385C",
    bg: "#FFF8F6",
    href: "/courses?subject=mathematiques",
  },
  {
    name: "Français",
    icon: BookOpen,
    count: 124,
    color: "#A435F0",
    bg: "#F8F5FF",
    href: "/courses?subject=francais",
  },
  {
    name: "Anglais",
    icon: Globe,
    count: 98,
    color: "#00A699",
    bg: "#E6FAF8",
    href: "/courses?subject=anglais",
  },
  {
    name: "Sciences",
    icon: Microscope,
    count: 87,
    color: "#008A05",
    bg: "#E8F8E8",
    href: "/courses?subject=sciences",
  },
  {
    name: "Histoire-Géo",
    icon: Landmark,
    count: 76,
    color: "#D93900",
    bg: "#FFF2ED",
    href: "/courses?subject=histoire-geo",
  },
  {
    name: "Physique-Chimie",
    icon: FlaskConical,
    count: 65,
    color: "#1E88E5",
    bg: "#E3F2FD",
    href: "/courses?subject=physique-chimie",
  },
  {
    name: "Arts",
    icon: Palette,
    count: 42,
    color: "#E91E63",
    bg: "#FCE4EC",
    href: "/courses?subject=arts",
  },
  {
    name: "Musique",
    icon: Music,
    count: 38,
    color: "#7B1FA2",
    bg: "#F3E5F5",
    href: "/courses?subject=musique",
  },
];

export function Categories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-[1760px] px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="mb-3 text-[32px] font-bold text-[#222222]">
            Explore par matière
          </h2>
          <p className="text-lg text-[#717171]">
            Trouve le cours parfait pour réussir tes examens
          </p>
        </motion.div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link href={category.href} className="group block">
                <div
                  className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: category.bg }}
                >
                  <div
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: category.color }}
                  >
                    <category.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-1 font-semibold text-[#222222]">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[#717171]">
                    {category.count} cours
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* See all link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 font-semibold text-[#222222] underline underline-offset-4 transition-colors hover:text-[#FF385C]"
          >
            Voir toutes les matières
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
