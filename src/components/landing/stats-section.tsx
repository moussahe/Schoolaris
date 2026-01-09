"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Users, GraduationCap, ThumbsUp } from "lucide-react";

const stats = [
  {
    value: "1,200+",
    label: "Cours d'exception",
    icon: BookOpen,
    description: "Crees par des experts",
  },
  {
    value: "300+",
    label: "Enseignants passionnes",
    icon: Users,
    description: "Verifies et certifies",
  },
  {
    value: "50,000+",
    label: "Eleves accompagnes",
    icon: GraduationCap,
    description: "Dans toute la France",
  },
  {
    value: "98%",
    label: "Satisfaction",
    icon: ThumbsUp,
    description: "Recommandent Schoolaris",
  },
];

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="w-full bg-[#0B2A4C] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#E8A336]">
            Notre Impact
          </h2>
          <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Des chiffres qui parlent d&apos;eux-memes
          </p>
        </motion.div>

        {/* Stats Grid - Full Width */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8A336]/10 transition-colors group-hover:bg-[#E8A336]/20">
                <stat.icon className="h-8 w-8 text-[#E8A336]" />
              </div>

              {/* Value */}
              <motion.span
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{
                  type: "spring" as const,
                  stiffness: 100,
                  delay: index * 0.1 + 0.2,
                }}
                className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl"
              >
                {stat.value}
              </motion.span>

              {/* Label */}
              <span className="mt-2 text-lg font-semibold text-white/90">
                {stat.label}
              </span>

              {/* Description */}
              <span className="mt-1 text-sm text-white/60">
                {stat.description}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8"
        >
          <div className="flex items-center gap-2 text-sm text-white/70">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            Paiements securises
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            Donnees protegees RGPD
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            Support 7j/7
          </div>
        </motion.div>
      </div>
    </section>
  );
}
