"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Publication gratuite et illimitée",
  "Outils de création puissants",
  "Analytics détaillés en temps réel",
  "Paiements instantanés via Stripe",
  "Support dédié aux créateurs",
];

const stats = [
  { icon: DollarSign, value: "2 450 €", label: "Revenu moyen/mois" },
  { icon: Users, value: "234", label: "Élèves par prof" },
  { icon: TrendingUp, value: "+23%", label: "Croissance mensuelle" },
];

export function TeacherCta() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-[1760px] px-6 lg:px-10">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#222222] to-[#3D3D3D]">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="p-8 lg:p-12"
            >
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <span className="text-sm font-medium text-white">
                  Pour les enseignants
                </span>
              </div>

              {/* Headline */}
              <h2 className="mb-6 text-3xl font-bold text-white lg:text-4xl">
                Gardez <span className="text-[#FF385C]">85%</span> de vos ventes
              </h2>

              {/* Description */}
              <p className="mb-8 text-lg text-white/80">
                Créez vos cours, fixez vos prix, touchez 85% de chaque vente.
                Nous nous occupons de la technique, vous vous concentrez sur
                l&apos;enseignement.
              </p>

              {/* Benefits */}
              <ul className="mb-8 space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3 text-white"
                  >
                    <CheckCircle className="h-5 w-5 text-[#FF385C]" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                size="lg"
                className="group rounded-full bg-[#FF385C] px-8 font-semibold text-white hover:bg-[#E31C5F]"
                asChild
              >
                <Link href="/register/teacher">
                  Devenir créateur
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            {/* Right - Stats card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden p-8 lg:block lg:p-12"
            >
              <div className="rounded-2xl bg-white p-8 shadow-2xl">
                {/* Header */}
                <div className="mb-6 border-b border-[#DDDDDD] pb-6">
                  <p className="text-sm text-[#717171]">
                    Vos revenus potentiels
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#222222]">
                      2 450
                    </span>
                    <span className="text-xl text-[#717171]">€/mois</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#008A05]">
                    <TrendingUp className="h-4 w-4" />
                    +23% ce mois
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between rounded-xl bg-[#F7F7F7] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF385C]/10">
                          <stat.icon className="h-5 w-5 text-[#FF385C]" />
                        </div>
                        <span className="text-[#717171]">{stat.label}</span>
                      </div>
                      <span className="font-bold text-[#222222]">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Commission breakdown */}
                <div className="mt-6 rounded-xl bg-[#F7F7F7] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#717171]">Vos gains</span>
                    <span className="text-xl font-bold text-[#008A05]">
                      85%
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-[#717171]">
                      Commission plateforme
                    </span>
                    <span className="text-sm text-[#717171]">15%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
