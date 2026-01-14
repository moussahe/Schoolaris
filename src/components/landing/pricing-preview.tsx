"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles, ArrowRight, Star } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

interface PricingOptionProps {
  name: string;
  price: string;
  priceDetail: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string;
}

function PricingOption({
  name,
  price,
  priceDetail,
  description,
  features,
  cta,
  href,
  highlighted = false,
  badge,
}: PricingOptionProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
        highlighted
          ? "border-emerald-200 bg-white shadow-md"
          : "border-gray-100 bg-white shadow-sm hover:shadow-md"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-4 py-1 text-xs font-bold text-white">
            <Star className="h-3 w-3" />
            {badge}
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        <span className="ml-2 text-sm text-gray-500">{priceDetail}</span>
      </div>

      <ul className="mb-6 flex-1 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
          highlighted
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "border border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {cta}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </motion.div>
  );
}

export function PricingPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600">
              <Sparkles className="h-4 w-4" />
              Tarifs transparents
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Des formules adaptees a vos besoins
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Commencez gratuitement, evoluez selon vos besoins. Pas
              d&apos;engagement, pas de surprise.
            </p>
          </motion.div>

          {/* Pricing Options */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            <PricingOption
              name="Gratuit"
              price="0€"
              priceDetail="pour toujours"
              description="Parfait pour decouvrir la plateforme"
              features={[
                "Acces aux cours gratuits",
                "Assistant IA (limite)",
                "Suivi de progression",
                "1 enfant par compte",
              ]}
              cta="Commencer"
              href="/register"
            />

            <PricingOption
              name="A la carte"
              price="29-49€"
              priceDetail="par cours"
              description="Achetez les cours dont vous avez besoin"
              features={[
                "Acces a vie au cours",
                "Quiz et exercices inclus",
                "Assistant IA illimite",
                "Certificat de completion",
                "70% reversés au prof",
              ]}
              cta="Explorer les cours"
              href="/courses"
              highlighted
              badge="POPULAIRE"
            />

            <PricingOption
              name="Pass Famille"
              price="19,99€"
              priceDetail="/ mois"
              description="Acces illimite pour toute la famille"
              features={[
                "Tous les cours inclus",
                "Jusqu'à 3 enfants",
                "IA illimitée",
                "Rapports hebdo parents",
                "Support prioritaire",
              ]}
              cta="Bientot disponible"
              href="/register"
            />
          </div>

          {/* Trust badge */}
          <motion.div variants={itemVariants} className="mt-10">
            <p className="text-sm text-gray-500">
              Paiement securise par{" "}
              <span className="font-semibold">Stripe</span>
              {" . "}
              Satisfait ou rembourse sous 14 jours
              {" . "}
              Sans engagement
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
