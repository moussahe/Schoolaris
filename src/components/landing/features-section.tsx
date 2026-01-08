"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, TrendingUp, Clock, Shield, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Tuteur IA 24/7",
    description:
      "Un assistant intelligent qui guide sans donner les réponses. Disponible jour et nuit.",
    color: "bg-violet-100 text-violet-600",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    title: "85% pour les profs",
    description:
      "Les enseignants gardent 85% de chaque vente. Parce qu'ils le méritent.",
    color: "bg-teal-100 text-teal-600",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "Accès à vie",
    description:
      "Pas d'abonnement. Un seul paiement pour un accès illimité. Pour toujours.",
    color: "bg-orange-100 text-orange-500",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Shield,
    title: "Profs certifiés",
    description:
      "Tous les cours sont créés par des professeurs de l'Éducation Nationale.",
    color: "bg-emerald-100 text-emerald-600",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Sparkles,
    title: "Apprentissage adaptatif",
    description:
      "L'IA analyse les progrès et adapte le parcours de chaque élève.",
    color: "bg-rose-100 text-rose-600",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Gamification",
    description:
      "Points XP, badges et classements pour un apprentissage motivant.",
    color: "bg-amber-100 text-amber-600",
    gradient: "from-amber-500 to-yellow-500",
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
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 transition-all duration-300 hover:border-slate-300 hover:shadow-xl">
        {/* Gradient accent on hover */}
        <div
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        />

        {/* Icon */}
        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color}`}
        >
          <feature.icon className="h-7 w-7" />
        </div>

        {/* Content */}
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            <Sparkles className="h-4 w-4" />
            Pourquoi Schoolaris ?
          </span>

          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Une plateforme qui{" "}
            <span className="bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
              révolutionne
            </span>{" "}
            l&apos;éducation
          </h2>

          <p className="text-lg text-slate-600">
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
