"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  BookOpen,
  Users,
  GraduationCap,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  {
    icon: BookOpen,
    value: "500+",
    label: "Cours disponibles",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: Users,
    value: "10K+",
    label: "Étudiants actifs",
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: GraduationCap,
    value: "200+",
    label: "Profs certifiés",
    color: "bg-orange-100 text-orange-500",
  },
];

const popularSearches = [
  "Maths Terminale",
  "Bac Français",
  "Physique-Chimie",
  "Anglais B2",
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-white to-white pt-24">
      {/* Decorative blobs - SOFT and LIGHT */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-violet-200/60 to-purple-200/40 blur-3xl" />
        <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-gradient-to-br from-teal-200/50 to-cyan-200/30 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-48 w-48 rounded-full bg-gradient-to-br from-orange-200/40 to-yellow-200/30 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-32">
        <div className="text-center">
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-5 py-2.5 text-sm font-semibold text-violet-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Plateforme #1 en France
              <span className="ml-1 inline-flex items-center gap-0.5 text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                4.9
              </span>
            </span>
          </motion.div>

          {/* Main headline - FRIENDLY & BOLD */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Apprends à ton rythme,
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-teal-500 bg-clip-text text-transparent">
              réussis tes examens !
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
          >
            Des cours créés par des profs passionnés, du CP à la Terminale.
            <br className="hidden sm:block" />
            Un tuteur IA disponible 24h/24 pour t&apos;accompagner.
          </motion.p>

          {/* Search bar - PROMINENT like Udemy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un cours, une matière, un niveau..."
                className="w-full rounded-2xl border-2 border-slate-200 bg-white py-5 pl-14 pr-36 text-lg text-slate-900 shadow-xl shadow-slate-200/50 transition-all placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100"
              />
              <Button
                size="lg"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 text-base font-semibold shadow-lg hover:from-violet-700 hover:to-purple-700"
              >
                Rechercher
              </Button>
            </div>

            {/* Popular searches */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-slate-500">Populaires :</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-violet-50 hover:text-violet-700 hover:ring-violet-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="group w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-6 text-lg font-bold shadow-xl shadow-violet-200 transition-all hover:shadow-2xl hover:shadow-violet-300 sm:w-auto"
              asChild
            >
              <Link href="/courses">
                Explorer les cours
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-8 py-6 text-lg font-bold text-slate-700 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 sm:w-auto"
              asChild
            >
              <Link href="/register/teacher">
                <GraduationCap className="mr-2 h-5 w-5 text-teal-600" />
                Devenir enseignant
              </Link>
            </Button>
          </motion.div>

          {/* Stats cards - LIGHT & COLORFUL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-3"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-100 ring-1 ring-slate-100 transition-shadow hover:shadow-xl"
              >
                <div
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
