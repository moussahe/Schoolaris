"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  Search,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
    },
  },
};

function TrustIndicator({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-[#E8A336]">{value}</p>
      <p className="mt-1 text-sm tracking-wide text-[#0B2A4C]/80">{label}</p>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white/80 p-4 shadow-lg backdrop-blur-md">
      <div className="rounded-full bg-[#E8A336]/10 p-3">{icon}</div>
      <div>
        <h3 className="text-sm font-bold text-[#0B2A4C]">{title}</h3>
        <p className="text-xs text-[#1A1A1A]/70">{description}</p>
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-[#FDFDFD] py-20 pt-32 md:py-32 md:pt-40"
    >
      {/* Background Shapes */}
      <motion.div
        className="absolute left-0 top-0 h-full w-full opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5, ease: "easeIn" }}
      >
        <div className="absolute left-[-15%] top-[-20%] h-[500px] w-[500px] rounded-full bg-[#E8A336]/10 blur-3xl filter" />
        <div className="absolute bottom-[-25%] right-[-15%] h-[600px] w-[600px] rounded-full bg-[#0B2A4C]/10 blur-3xl filter" />
      </motion.div>

      {/* Floating Benefit Cards */}
      <motion.div
        className="absolute left-20 top-32 hidden lg:block"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <BenefitCard
          icon={<BookOpenCheck className="h-6 w-6 text-[#E8A336]" />}
          title="Pedagogie Active"
          description="Apprentissage par projet"
        />
      </motion.div>

      <motion.div
        className="absolute right-24 top-1/2 hidden -translate-y-1/2 lg:block"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <BenefitCard
          icon={<ShieldCheck className="h-6 w-6 text-[#E8A336]" />}
          title="Qualite Garantie"
          description="Enseignants verifies"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-24 left-1/4 hidden lg:block"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <BenefitCard
          icon={<GraduationCap className="h-6 w-6 text-[#E8A336]" />}
          title="Parcours Flexibles"
          description="Rythme personnalise"
        />
      </motion.div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl font-bold tracking-tight text-[#0B2A4C] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            L&apos;atelier de la reussite scolaire.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg text-[#1A1A1A]/80 md:text-xl"
          >
            Des parcours d&apos;apprentissage sur-mesure, crees par des
            professeurs d&apos;exception. Pour retrouver clarte et confiance.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={itemVariants}
            className="mx-auto mt-10 max-w-xl"
          >
            <form className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-[#6B7280]" />
              <input
                type="search"
                placeholder="Rechercher un cours, une matiere, un professeur..."
                className="w-full rounded-full border border-gray-200 bg-white py-4 pl-12 pr-36 text-base shadow-sm transition-all duration-300 focus:border-[#E8A336] focus:ring-2 focus:ring-[#E8A336]/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#0B2A4C] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B2A4C]/90"
              >
                Rechercher
              </button>
            </form>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/courses"
              className="inline-flex transform items-center justify-center rounded-full bg-[#E8A336] px-8 py-3 text-base font-bold text-[#0B2A4C] shadow-lg transition-all hover:scale-105 hover:bg-[#D4922E]"
            >
              Explorer les cours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/register/teacher"
              className="inline-flex transform items-center justify-center rounded-full border-2 border-[#0B2A4C]/20 bg-transparent px-8 py-3 text-base font-semibold text-[#0B2A4C] transition-all hover:scale-105 hover:bg-[#0B2A4C]/5"
            >
              Devenir enseignant
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
              <TrustIndicator value="1,200+" label="Cours d'exception" />
              <TrustIndicator value="300+" label="Enseignants passionnes" />
              <TrustIndicator value="15,000+" label="Eleves epanouis" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
