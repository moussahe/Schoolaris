"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Publication gratuite",
  "Outils de creation intuitifs",
  "Analytics detaillees",
  "Paiements rapides et securises",
  "Support dedie",
];

export function TeacherCta() {
  return (
    <section className="mx-4 my-16 max-w-6xl rounded-xl bg-[#0B2A4C] p-8 text-white md:mx-auto md:p-12 lg:p-16">
      <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
        {/* Left Section - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center lg:w-1/2 lg:text-left"
        >
          <h2 className="font-serif text-4xl font-extrabold leading-tight md:text-5xl">
            Gardez <span className="text-[#E8A336]">85%</span> de vos ventes
          </h2>
          <p className="text-lg opacity-90 md:text-xl">
            Maximisez vos revenus en partageant votre expertise. Notre
            plateforme vous offre une flexibilite totale et une remuneration
            competitive.
          </p>

          {/* Benefits List */}
          <ul className="mt-6 space-y-3 text-lg md:text-xl">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center justify-center gap-3 lg:justify-start"
              >
                <CheckCircle className="h-6 w-6 text-[#E8A336]" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8"
          >
            <Link
              href="/register/teacher"
              className="inline-block rounded-lg bg-[#E8A336] px-8 py-4 text-lg font-bold text-[#0B2A4C] transition-colors duration-300 hover:bg-yellow-400"
            >
              Devenir enseignant
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Section - Stats Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center p-6 lg:w-1/2"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center text-[#0B2A4C] shadow-2xl">
            <p className="text-sm font-semibold uppercase text-[#6B7280]">
              Revenus moyens par mois
            </p>
            <p className="mt-2 text-6xl font-extrabold text-[#E8A336]">2450€</p>
            <p className="mt-4 text-lg font-medium">
              en partageant vos cours avec{" "}
              <span className="font-bold">Schoolaris</span>.
            </p>
            <p className="mt-2 text-sm text-[#6B7280]">
              Base sur les donnees de nos enseignants performants.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
