"use client";

import { useRef } from "react";
import { BookOpenCheck, GraduationCap, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    icon: BookOpenCheck,
    title: "Choisissez votre cours",
    description:
      "Parcourez notre catalogue et trouvez le cours parfait pour vos besoins.",
  },
  {
    icon: Users,
    title: "Apprenez a votre rythme",
    description:
      "Progressez selon votre emploi du temps avec nos tuteurs experts.",
  },
  {
    icon: GraduationCap,
    title: "Reussissez vos examens",
    description:
      "Atteignez vos objectifs academiques et excellez dans vos examens.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="bg-[#FDFDFD] py-24 sm:py-32">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-serif text-4xl font-bold text-[#0B2A4C] sm:text-5xl"
          >
            Comment ca marche?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-[#6B7280]"
          >
            Trois etapes simples pour transformer votre avenir academique.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div
            className="absolute left-1/2 top-1/2 hidden h-1 w-2/3 -translate-x-1/2 -translate-y-1/2 border-t-2 border-dashed border-gray-300 lg:block"
            aria-hidden="true"
          />

          <motion.div
            className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-12"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative z-10 flex flex-col items-center text-center"
                variants={itemVariants}
              >
                {/* Icon Circle */}
                <div className="relative mb-8">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0px_4px_15px_rgba(0,0,0,0.05)]">
                    <step.icon
                      className="h-14 w-14 text-[#0B2A4C]"
                      strokeWidth={1.5}
                    />
                  </div>
                  {/* Number Badge */}
                  <span className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8A336] text-lg font-bold text-white">
                    0{index + 1}
                  </span>
                </div>

                {/* Text */}
                <h3 className="mb-4 text-2xl font-semibold leading-tight text-[#0B2A4C]">
                  {step.title}
                </h3>
                <p className="min-h-[60px] max-w-sm text-lg leading-relaxed text-[#1A1A1A]/80">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
