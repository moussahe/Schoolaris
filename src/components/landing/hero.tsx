"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Star, Users, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: BookOpen, value: "500+", label: "Cours" },
  { icon: Users, value: "10 000+", label: "Étudiants" },
  { icon: Award, value: "200+", label: "Profs certifiés" },
];

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative bg-white pt-[140px]">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-[#FF385C]/5 to-transparent" />
        <div className="absolute -left-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#A435F0]/5 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1760px] px-6 pb-20 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#FFF8F6] px-4 py-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[#FFB400] text-[#FFB400]"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-[#222222]">
                4.9/5 basé sur 2 000+ avis
              </span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-[40px] font-extrabold leading-tight tracking-tight text-[#222222] lg:text-[56px]">
              Apprends avec les{" "}
              <span className="text-[#FF385C]">meilleurs profs</span> de France
            </h1>

            {/* Subheadline */}
            <p className="mb-8 max-w-lg text-lg text-[#717171]">
              Des cours créés par des enseignants passionnés, du CP à la
              Terminale. Un tuteur IA disponible 24h/24 pour t&apos;accompagner.
            </p>

            {/* Search bar - Udemy style */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#717171]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Que veux-tu apprendre ?"
                  className="w-full rounded-xl border-2 border-[#222222] py-4 pl-12 pr-32 text-base text-[#222222] outline-none transition-all placeholder:text-[#717171] focus:border-[#FF385C]"
                />
                <Button
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#FF385C] px-6 font-semibold hover:bg-[#E31C5F]"
                  asChild
                >
                  <Link href={`/courses?q=${searchQuery}`}>Rechercher</Link>
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-[#717171]">Populaires :</span>
                {["Maths Terminale", "Bac Français", "Physique", "Anglais"].map(
                  (term) => (
                    <Link
                      key={term}
                      href={`/courses?q=${term}`}
                      className="text-sm font-medium text-[#A435F0] hover:underline"
                    >
                      {term}
                    </Link>
                  ),
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full bg-[#FF385C] px-8 text-base font-semibold hover:bg-[#E31C5F]"
                asChild
              >
                <Link href="/courses">Explorer les cours</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-[#222222] px-8 text-base font-semibold text-[#222222] hover:bg-[#F7F7F7]"
                asChild
              >
                <Link href="/register/teacher">Enseigner sur Schoolaris</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right - Featured image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main image container - Airbnb style */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF385C] to-[#A435F0]">
              {/* Placeholder for hero image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="mb-4 text-6xl">📚</div>
                  <p className="text-xl font-semibold">
                    L&apos;apprentissage réinventé
                  </p>
                </div>
              </div>

              {/* Floating card - Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -left-4 bottom-8 rounded-2xl bg-white p-4 shadow-xl lg:-left-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#008A05]/10">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#222222]">85%</p>
                    <p className="text-sm text-[#717171]">pour les profs</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating card - Rating */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute -right-4 top-8 rounded-2xl bg-white p-4 shadow-xl lg:-right-8"
              >
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-[#FFB400] text-[#FFB400]"
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-[#222222]">4.9</span>
                </div>
                <p className="mt-1 text-sm text-[#717171]">2 000+ avis</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-8 border-t border-[#DDDDDD] pt-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F7F7]">
                <stat.icon className="h-6 w-6 text-[#FF385C]" />
              </div>
              <p className="text-2xl font-bold text-[#222222] lg:text-3xl">
                {stat.value}
              </p>
              <p className="text-sm text-[#717171]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
