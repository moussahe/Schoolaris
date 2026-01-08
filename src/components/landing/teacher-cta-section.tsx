"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp,
  Wallet,
  Users,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Publication gratuite et illimitée",
  "Outils de création puissants",
  "Analytics détaillés en temps réel",
  "Paiements instantanés via Stripe",
];

export function TeacherCtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-teal-50 py-24"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-48 w-48 rounded-full bg-teal-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
              Pour les enseignants
            </span>

            <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
              Gardez{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                85%
              </span>{" "}
              de vos ventes
            </h2>

            <p className="mb-8 text-lg text-slate-600">
              Créez vos cours, fixez vos prix, touchez 85% de chaque vente. Nous
              nous occupons de la technique, vous vous concentrez sur
              l&apos;enseignement.
            </p>

            <ul className="mb-8 space-y-3">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <CheckCircle2 className="h-5 w-5 text-teal-500" />
                  {benefit}
                </motion.li>
              ))}
            </ul>

            <Button
              size="lg"
              className="group rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-8 text-lg font-bold shadow-xl shadow-teal-200 hover:shadow-2xl hover:shadow-teal-300"
              asChild
            >
              <Link href="/register/teacher">
                Devenir créateur
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Right column - Stats card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/50">
              {/* Header */}
              <div className="mb-8">
                <p className="text-sm font-medium text-slate-500">
                  Revenus ce mois
                </p>
                <div className="flex items-baseline gap-2">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-5xl font-bold text-slate-900"
                  >
                    2 450
                  </motion.span>
                  <span className="text-xl font-medium text-slate-400">
                    EUR
                  </span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  <TrendingUp className="h-4 w-4" />
                  +23% vs mois dernier
                </div>
              </div>

              {/* Stats grid */}
              <div className="mb-8 grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-violet-50 p-4 text-center">
                  <Wallet className="mx-auto mb-2 h-6 w-6 text-violet-600" />
                  <p className="text-2xl font-bold text-slate-900">47</p>
                  <p className="text-xs font-medium text-slate-500">Ventes</p>
                </div>
                <div className="rounded-2xl bg-rose-50 p-4 text-center">
                  <Users className="mx-auto mb-2 h-6 w-6 text-rose-600" />
                  <p className="text-2xl font-bold text-slate-900">234</p>
                  <p className="text-xs font-medium text-slate-500">Élèves</p>
                </div>
                <div className="rounded-2xl bg-teal-50 p-4 text-center">
                  <BarChart3 className="mx-auto mb-2 h-6 w-6 text-teal-600" />
                  <p className="text-2xl font-bold text-slate-900">8</p>
                  <p className="text-xs font-medium text-slate-500">Cours</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Note moyenne</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-900">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    4.9
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Commission plateforme</span>
                  <span className="font-semibold text-slate-900">15%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Vos gains</span>
                  <span className="font-bold text-teal-600">85%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
