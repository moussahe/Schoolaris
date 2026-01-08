"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Clock,
  Shield,
  Sparkles,
  Award,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Tuteur IA 24/7",
    description:
      "Un assistant intelligent qui guide sans donner les réponses. Disponible jour et nuit pour accompagner l'apprentissage.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
  {
    icon: TrendingUp,
    title: "85% pour les profs",
    description:
      "Les enseignants gardent 85% de chaque vente. Parce que leur travail mérite une juste rémunération.",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: Clock,
    title: "Un achat, à vie",
    description:
      "Pas d'abonnement. Un seul paiement pour un accès illimité. Pour toujours, sans surprise.",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Shield,
    title: "Qualité garantie",
    description:
      "Tous les cours sont créés par des professeurs certifiés de l'Éducation Nationale française.",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
  {
    icon: Sparkles,
    title: "Apprentissage adaptatif",
    description:
      "L'IA analyse les progrès et adapte le parcours de chaque élève pour maximiser sa réussite.",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500/10",
    iconColor: "text-pink-500",
  },
  {
    icon: Award,
    title: "Gamification motivante",
    description:
      "Points XP, badges et classements pour transformer l'apprentissage en aventure passionnante.",
    color: "from-amber-500 to-yellow-600",
    bgColor: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-xl">
        {/* Gradient overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
        />

        {/* Icon */}
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} transition-transform duration-300 group-hover:scale-110`}
        >
          <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
        </div>

        {/* Content */}
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>

        {/* Decorative corner */}
        <div
          className={`absolute -right-10 -top-10 h-20 w-20 rounded-full bg-gradient-to-br ${feature.color} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
        />
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-muted/30 py-20 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-secondary-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles className="h-4 w-4" />
            Pourquoi Schoolaris ?
          </motion.div>

          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Une plateforme pensée pour{" "}
            <span className="bg-gradient-to-r from-primary to-secondary-500 bg-clip-text text-transparent">
              la réussite
            </span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Découvrez ce qui fait de Schoolaris la référence du soutien scolaire
            en France.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
