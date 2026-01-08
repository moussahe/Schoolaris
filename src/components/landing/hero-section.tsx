"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView, type Easing } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  GraduationCap,
  Star,
  Users,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const easeOut: Easing = [0.4, 0, 0.2, 1];

interface StatItemProps {
  icon: React.ElementType;
  value: string;
  label: string;
  delay?: number;
}

function StatItem({ icon: Icon, value, label, delay = 0 }: StatItemProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-3"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </motion.div>
  );
}

function ProductVisual() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.9, y: 20 }
      }
      transition={{ duration: 0.6, ease: easeOut }}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Decorative shapes */}
      <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-xl" />
      <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-gradient-to-br from-secondary-500/20 to-secondary-500/5 blur-xl" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
        className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BookOpenText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Les fractions - CM2
              </h3>
              <p className="text-xs text-muted-foreground">Par Marie Dupont</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">4.9</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="border-b border-border/50 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-semibold text-primary">67%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary-500"
              initial={{ width: 0 }}
              animate={{ width: "67%" }}
              transition={{ duration: 1.5, delay: 0.5, ease: easeOut }}
            />
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-secondary-500/10 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-500/20 text-secondary-600 dark:text-secondary-400">
                <span className="text-sm font-bold">✓</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                1. Addition de fractions
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-3 ring-2 ring-primary/30">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <span className="text-sm font-bold text-primary">
                2. Multiplication
              </span>
            </div>
          </div>

          {/* AI Tutor box */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.5, delay: 0.4, ease: easeOut }}
            className="relative flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/10 to-accent-500/5 p-3 text-center"
          >
            <motion.div
              className="absolute inset-0 rounded-xl bg-accent-500/20"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <GraduationCap className="relative h-8 w-8 text-accent-500" />
            <p className="relative mt-1 text-xs font-bold text-accent-600">
              Tuteur IA
            </p>
            <p className="relative mt-0.5 text-[10px] text-muted-foreground">
              24/7
            </p>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 border-t border-border/50 p-4">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">24</p>
            <p className="text-xs text-muted-foreground">Leçons</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Quiz</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">4h</p>
            <p className="text-xs text-muted-foreground">Contenu</p>
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute -bottom-3 -left-4 flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-lg ring-1 ring-border/50"
      >
        <Sparkles className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-bold text-foreground">+250 XP</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -right-4 -top-3 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 shadow-lg"
      >
        <span className="text-sm font-bold text-primary-foreground">85%</span>
      </motion.div>
    </motion.div>
  );
}

function BackgroundShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary-500/5" />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute right-1/4 top-1/2 h-80 w-80 rounded-full bg-secondary-500/10 blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 25, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent-500/10 blur-2xl"
      />

      {/* Decorative circles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
          className="absolute rounded-full border border-border/30"
          style={{
            top: `${15 + i * 15}%`,
            left: `${10 + i * 12}%`,
            width: `${20 + i * 8}px`,
            height: `${20 + i * 8}px`,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
    </div>
  );
}

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-background py-16 md:py-24 lg:py-32"
    >
      <BackgroundShapes />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          {/* Left column - Text content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm font-semibold text-accent-600"
                >
                  Nouveau
                </motion.span>
                <span className="text-sm text-foreground">
                  Tuteur IA intégré
                </span>
                <Sparkles className="h-4 w-4 text-accent-500" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              La réussite scolaire,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary-500 bg-clip-text text-transparent">
                réinventée.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3, ease: easeOut }}
              className="mt-6 max-w-xl text-lg text-muted-foreground lg:text-xl"
            >
              Des cours de qualité du CP à la Terminale, créés par des
              enseignants certifiés. Propulsés par l&apos;IA pour un
              apprentissage personnalisé.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4, ease: easeOut }}
              className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
            >
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
                asChild
              >
                <Link href="/courses">
                  Découvrir les cours
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group w-full sm:w-auto"
                asChild
              >
                <Link href="/register/teacher">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Devenir professeur
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.5, ease: easeOut }}
              className="mt-12 grid w-full grid-cols-2 gap-6 sm:grid-cols-4 lg:mt-16"
            >
              <StatItem icon={Users} value="10K+" label="Familles" delay={0} />
              <StatItem
                icon={BookOpenText}
                value="500+"
                label="Cours"
                delay={0.1}
              />
              <StatItem
                icon={GraduationCap}
                value="200+"
                label="Profs"
                delay={0.2}
              />
              <StatItem
                icon={Star}
                value="4.9/5"
                label="Note moyenne"
                delay={0.3}
              />
            </motion.div>
          </div>

          {/* Right column - Product visual */}
          <div className="relative hidden lg:block">
            <ProductVisual />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
