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
  BarChart3,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Publication gratuite et illimitée",
  "Outils de création puissants",
  "Analytics détaillés",
  "Paiements instantanés via Stripe",
];

export function TeacherCtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gray-900 py-20 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-secondary-500/10 blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary">
              Pour les enseignants
            </div>

            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Gardez{" "}
              <span className="bg-gradient-to-r from-primary to-secondary-500 bg-clip-text text-transparent">
                85%
              </span>{" "}
              de vos ventes
            </h2>

            <p className="mb-8 text-lg text-gray-400">
              Créez vos cours, fixez vos prix, touchez 85% de chaque vente. Nous
              nous occupons de la technique, vous vous concentrez sur
              l&apos;enseignement.
            </p>

            <ul className="mb-8 space-y-3">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                  }
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {benefit}
                </motion.li>
              ))}
            </ul>

            <Button
              size="lg"
              className="bg-primary shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
              asChild
            >
              <Link href="/register/teacher">
                Devenir créateur
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Right column - Stats card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              {/* Header */}
              <div className="mb-6">
                <p className="text-sm text-gray-400">Revenus ce mois</p>
                <div className="flex items-baseline gap-2">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.5 }
                    }
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-4xl font-bold text-white"
                  >
                    2 450
                  </motion.span>
                  <span className="text-lg text-gray-400">EUR</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                  +23% vs mois dernier
                </div>
              </div>

              {/* Stats grid */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/5 p-4 text-center">
                  <Wallet className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="text-xl font-bold text-white">47</p>
                  <p className="text-xs text-gray-400">Ventes</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4 text-center">
                  <Users className="mx-auto mb-2 h-5 w-5 text-secondary-500" />
                  <p className="text-xl font-bold text-white">234</p>
                  <p className="text-xs text-gray-400">Élèves</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4 text-center">
                  <BarChart3 className="mx-auto mb-2 h-5 w-5 text-accent-500" />
                  <p className="text-xl font-bold text-white">8</p>
                  <p className="text-xs text-gray-400">Cours</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Note moyenne</span>
                  <span className="flex items-center gap-1 font-medium text-white">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    4.9
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Commission plateforme</span>
                  <span className="font-medium text-white">15%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Vos gains</span>
                  <span className="font-bold text-primary">85%</span>
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
