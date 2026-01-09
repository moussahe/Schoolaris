"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content:
      "Mon fils a gagné 4 points de moyenne en maths grâce à Schoolaris. Les cours sont clairs, structurés, et le tuteur IA est vraiment impressionnant. Il répond à toutes ses questions !",
    author: "Sophie Martin",
    role: "Maman de Lucas, 3ème",
    avatar: "S",
    rating: 5,
    date: "Décembre 2024",
    highlight: "+4 points de moyenne",
  },
  {
    id: 2,
    content:
      "Enfin une plateforme qui respecte le travail des enseignants ! Je garde 85% de mes ventes, les outils sont intuitifs, et je touche des élèves dans toute la France. Un vrai game-changer.",
    author: "Marie Dupont",
    role: "Professeure de français, Paris",
    avatar: "M",
    rating: 5,
    date: "Novembre 2024",
    highlight: "85% des revenus",
  },
  {
    id: 3,
    content:
      "L'IA m'aide à comprendre sans me donner les réponses directement. C'est comme avoir un prof particulier disponible 24h/24. J'ai eu 18 au bac de philo !",
    author: "Emma Petit",
    role: "Étudiante, Terminale",
    avatar: "E",
    rating: 5,
    date: "Octobre 2024",
    highlight: "18/20 au bac",
  },
];

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-[#F7F7F7] py-20">
      <div className="mx-auto max-w-[1760px] px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-[32px] font-bold text-[#222222]">
            Ce qu&apos;ils disent de nous
          </h2>
          <p className="text-lg text-[#717171]">
            Plus de 10 000 familles nous font confiance
          </p>
        </motion.div>

        {/* Testimonials grid - Airbnb style */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              <div className="h-full rounded-3xl bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                {/* Quote icon */}
                <Quote className="mb-4 h-8 w-8 text-[#FF385C]/20" />

                {/* Highlight badge */}
                <div className="mb-4 inline-block rounded-full bg-[#FF385C]/10 px-3 py-1 text-sm font-semibold text-[#FF385C]">
                  {testimonial.highlight}
                </div>

                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[#222222] text-[#222222]"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="mb-6 text-[#222222]">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#222222] text-lg font-semibold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#222222]">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-[#717171]">{testimonial.role}</p>
                  </div>
                </div>

                {/* Date */}
                <p className="mt-4 text-sm text-[#717171]">
                  {testimonial.date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          <div>
            <p className="text-3xl font-bold text-[#222222]">4.9/5</p>
            <p className="text-sm text-[#717171]">Note moyenne</p>
          </div>
          <div className="h-12 w-px bg-[#DDDDDD]" />
          <div>
            <p className="text-3xl font-bold text-[#222222]">2 000+</p>
            <p className="text-sm text-[#717171]">Avis vérifiés</p>
          </div>
          <div className="h-12 w-px bg-[#DDDDDD]" />
          <div>
            <p className="text-3xl font-bold text-[#222222]">95%</p>
            <p className="text-sm text-[#717171]">Recommandent</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
