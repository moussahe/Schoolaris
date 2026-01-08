"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    content:
      "Mon fils a gagné 4 points de moyenne en maths grâce à Schoolaris. Le tuteur IA est incroyable, il explique sans jamais donner les réponses directement.",
    author: "Sophie L.",
    role: "Maman de Lucas, 3ème",
    rating: 5,
    avatar: "S",
    highlight: "+4 pts",
  },
  {
    content:
      "Enfin une plateforme qui respecte le travail des enseignants. 85% de commission, c'est juste et motivant. J'ai déjà publié 12 cours.",
    author: "Marie D.",
    role: "Professeure de français",
    rating: 5,
    avatar: "M",
    highlight: "85%",
  },
  {
    content:
      "L'IA m'aide à comprendre sans me donner les réponses. C'est comme avoir un prof particulier disponible 24h/24. Je recommande à tous mes amis !",
    author: "Emma P.",
    role: "Élève de Terminale",
    rating: 5,
    avatar: "E",
    highlight: "24/7",
  },
  {
    content:
      "Le suivi de progression est excellent. Je peux voir exactement où en sont mes deux enfants et quels chapitres ils doivent revoir.",
    author: "Thomas B.",
    role: "Papa de 2 enfants",
    rating: 5,
    avatar: "T",
    highlight: "Suivi",
  },
  {
    content:
      "La gamification a transformé l'attitude de ma fille envers les devoirs. Elle veut gagner des XP et des badges. L'apprentissage est devenu un jeu !",
    author: "Claire M.",
    role: "Maman d'Anaïs, CM2",
    rating: 5,
    avatar: "C",
    highlight: "XP",
  },
  {
    content:
      "En tant que prof de maths, je touche 850€/mois en revenus passifs avec mes 8 cours. La plateforme gère tout : paiements, support, technique.",
    author: "Jean-Pierre R.",
    role: "Professeur de mathématiques",
    rating: 5,
    avatar: "J",
    highlight: "850€/mois",
  },
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
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
      <div className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
        {/* Quote icon */}
        <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />

        {/* Highlight badge */}
        <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
          {testimonial.highlight}
        </div>

        {/* Stars */}
        <div className="mb-4 flex gap-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Content */}
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary-500 text-sm font-bold text-white">
            {testimonial.avatar}
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {testimonial.author}
            </p>
            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>

        {/* Hover gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-primary to-primary/90 py-20 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ils nous font confiance
          </h2>
          <p className="text-lg text-white/80">
            Plus de 10 000 familles utilisent Schoolaris au quotidien.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
