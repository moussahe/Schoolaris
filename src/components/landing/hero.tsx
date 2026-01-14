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
  Sparkles,
  Trophy,
  Users,
  Star,
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
      {/* Background Shapes - Modern Gradient Blobs */}
      <motion.div
        className="absolute left-0 top-0 h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeIn" }}
      >
        {/* Primary Gold Blob */}
        <motion.div
          className="absolute left-[-10%] top-[-15%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#E8A336]/20 to-[#E8A336]/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        {/* Secondary Blue Blob */}
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] h-[700px] w-[700px] rounded-full bg-gradient-to-tl from-[#0B2A4C]/15 to-[#0B2A4C]/5 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        {/* Accent Purple Blob */}
        <motion.div
          className="absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
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

      {/* Parcours Flexibles - Plus a gauche */}
      <motion.div
        className="absolute bottom-32 left-8 hidden lg:block"
        animate={{
          y: [0, -12, 0],
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

      {/* NEW: Stats Badge - Bottom Right */}
      <motion.div
        className="absolute bottom-40 right-16 hidden lg:block"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        <div className="flex items-center gap-3 rounded-full border border-emerald-200 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <Trophy className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-600">98%</p>
            <p className="text-xs text-gray-500">Satisfaction</p>
          </div>
        </div>
      </motion.div>

      {/* NEW: AI Badge - Top Right */}
      <motion.div
        className="absolute right-32 top-40 hidden xl:block"
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2 text-white shadow-lg">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold">IA Integree</span>
        </div>
      </motion.div>

      {/* NEW: Students Count - Left Middle */}
      <motion.div
        className="absolute left-12 top-1/2 hidden xl:block"
        animate={{
          x: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 1.2,
        }}
      >
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white"
              >
                {["L", "E", "M"][i]}
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">+50k</p>
            <p className="text-xs text-gray-500">Eleves actifs</p>
          </div>
        </div>
      </motion.div>

      {/* NEW: Rating Badge - Bottom Left */}
      <motion.div
        className="absolute bottom-16 left-1/3 hidden lg:block"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700">4.9/5</span>
        </div>
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
              href="/demo"
              className="inline-flex transform items-center justify-center rounded-full bg-[#E8A336] px-8 py-3.5 text-base font-bold text-[#0B2A4C] shadow-lg transition-all hover:scale-105 hover:bg-[#D4922E]"
            >
              Essayer Gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex transform items-center justify-center rounded-full border-2 border-[#0B2A4C] bg-white px-8 py-3 text-base font-semibold text-[#0B2A4C] transition-all hover:scale-105 hover:bg-[#0B2A4C]/5"
            >
              Explorer les cours
            </Link>
          </motion.div>

          {/* Free Trial Badge */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-sm text-[#1A1A1A]/60"
          >
            Testez l&apos;assistant IA gratuitement, sans inscription
          </motion.p>

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
