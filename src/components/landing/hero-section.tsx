"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Floating geometric shape component
function FloatingShape({
  className,
  delay = 0,
  duration = 20,
}: {
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full mix-blend-screen ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Animated stat card with glassmorphism
function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      {/* Gradient glow on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
      />

      <div className="relative flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <motion.p
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {value}
          </motion.p>
          <p className="text-sm text-slate-400">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-[#0D122B] pt-20"
    >
      {/* Aurora Background Effect */}
      <div className="pointer-events-none absolute inset-0">
        {/* Main aurora gradients */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-1/4 top-0 h-[600px] w-[800px] rounded-full bg-[#E6007A]/20 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-1/4 top-1/4 h-[500px] w-[700px] rounded-full bg-[#00F2EA]/20 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-[400px] w-[600px] rounded-full bg-[#D4FF00]/15 blur-[120px]"
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      <FloatingShape
        className="left-[10%] top-[20%] h-4 w-4 bg-[#00F2EA]/60"
        delay={0}
        duration={15}
      />
      <FloatingShape
        className="right-[15%] top-[15%] h-6 w-6 bg-[#E6007A]/60"
        delay={2}
        duration={18}
      />
      <FloatingShape
        className="left-[20%] bottom-[30%] h-3 w-3 bg-[#D4FF00]/60"
        delay={4}
        duration={20}
      />
      <FloatingShape
        className="right-[10%] bottom-[20%] h-5 w-5 bg-[#00F2EA]/60"
        delay={1}
        duration={16}
      />
      <FloatingShape
        className="left-[40%] top-[10%] h-2 w-2 bg-[#E6007A]/60"
        delay={3}
        duration={22}
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-[#D4FF00]" />
            </motion.div>
            <span className="text-sm font-medium text-white">
              Les profs gardent{" "}
              <span className="bg-gradient-to-r from-[#E6007A] to-[#00F2EA] bg-clip-text font-bold text-transparent">
                85%
              </span>{" "}
              des ventes
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 max-w-4xl text-center text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          L&apos;excellence scolaire,{" "}
          <span className="bg-gradient-to-r from-[#E6007A] via-[#00F2EA] to-[#D4FF00] bg-clip-text text-transparent">
            illuminée.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-10 max-w-2xl text-center text-lg text-slate-300 sm:text-xl"
        >
          Des cours exceptionnels du CP à la Terminale, créés par des
          enseignants passionnés. Offrez à votre enfant le meilleur de
          l&apos;éducation française.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-[#E6007A] to-[#00F2EA] px-8 text-lg font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#E6007A]/25"
            asChild
          >
            <Link href="/courses">
              Découvrir les cours
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="group border-white/20 bg-white/5 px-8 text-lg font-semibold text-white backdrop-blur-xl hover:border-white/40 hover:bg-white/10"
            asChild
          >
            <Link href="/register/teacher">
              <GraduationCap className="mr-2 h-5 w-5" />
              Devenir professeur
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <StatCard
            icon={Users}
            value="10K+"
            label="Familles heureuses"
            color="from-[#00F2EA] to-[#00F2EA]/50"
            delay={1}
          />
          <StatCard
            icon={BookOpen}
            value="500+"
            label="Cours disponibles"
            color="from-[#E6007A] to-[#E6007A]/50"
            delay={1.2}
          />
          <StatCard
            icon={GraduationCap}
            value="200+"
            label="Profs certifiés"
            color="from-[#D4FF00] to-[#D4FF00]/50"
            delay={1.4}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-slate-500">Scroll</span>
            <div className="h-10 w-6 rounded-full border-2 border-white/20 p-1">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-white/50"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
