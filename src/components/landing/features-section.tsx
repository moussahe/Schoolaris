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
    gradient: "from-[#E6007A] to-[#E6007A]/50",
  },
  {
    icon: TrendingUp,
    title: "85% pour les profs",
    description:
      "Les enseignants gardent 85% de chaque vente. Parce qu'ils le méritent.",
    gradient: "from-[#00F2EA] to-[#00F2EA]/50",
  },
  {
    icon: Clock,
    title: "Accès à vie",
    description:
      "Pas d'abonnement. Un seul paiement pour un accès illimité. Pour toujours.",
    gradient: "from-[#D4FF00] to-[#D4FF00]/50",
  },
  {
    icon: Shield,
    title: "Profs certifiés",
    description:
      "Tous les cours sont créés par des professeurs de l'Éducation Nationale.",
    gradient: "from-[#E6007A] to-[#00F2EA]",
  },
  {
    icon: Sparkles,
    title: "Apprentissage adaptatif",
    description:
      "L'IA analyse les progrès et adapte le parcours de chaque élève.",
    gradient: "from-[#00F2EA] to-[#D4FF00]",
  },
  {
    icon: Zap,
    title: "Gamification",
    description:
      "Points XP, badges et classements pour un apprentissage motivant.",
    gradient: "from-[#D4FF00] to-[#E6007A]",
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
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative"
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
        {/* Gradient glow on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
        />

        {/* Icon */}
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}
        >
          <feature.icon className="h-6 w-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="mb-2 text-lg font-semibold text-white">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-400">
          {feature.description}
        </p>

        {/* Corner glow */}
        <div
          className={`absolute -right-10 -top-10 h-20 w-20 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30`}
        />
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0D122B] py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/4 h-[400px] w-[400px] rounded-full bg-[#E6007A]/10 blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 h-[400px] w-[400px] rounded-full bg-[#00F2EA]/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-[#D4FF00]" />
            Pourquoi Schoolaris ?
          </div>

          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Une plateforme qui{" "}
            <span className="bg-gradient-to-r from-[#E6007A] to-[#00F2EA] bg-clip-text text-transparent">
              révolutionne
            </span>{" "}
            l&apos;éducation
          </h2>

          <p className="text-lg text-slate-400">
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
