"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarInitial: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Mon fils a gagne 4 points en maths grace a Schoolaris",
    name: "Sophie Martin",
    role: "Maman de Lucas (3eme)",
    avatarInitial: "SM",
  },
  {
    quote:
      "Je garde 85% de mes ventes, c'est bien plus que les autres plateformes",
    name: "Marie Dupont",
    role: "Professeure de Maths",
    avatarInitial: "MD",
  },
  {
    quote: "Les cours sont clairs et le tuteur IA m'aide beaucoup",
    name: "Emma Petit",
    role: "Terminale S",
    avatarInitial: "EP",
  },
];

function TestimonialCard({ quote, name, role, avatarInitial }: Testimonial) {
  return (
    <motion.div
      className="relative flex flex-col items-start space-y-4 rounded-xl bg-white p-6 shadow-[0px_4px_15px_rgba(0,0,0,0.05)]"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Quote Icon */}
      <div className="absolute right-4 top-4 text-[#E8A336]">
        <Quote size={24} />
      </div>

      {/* Star Rating */}
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} className="fill-[#E8A336] text-[#E8A336]" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-lg font-medium text-[#1A1A1A]">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B2A4C] text-sm font-bold text-white">
          {avatarInitial}
        </div>
        <div>
          <p className="font-semibold text-[#1A1A1A]">{name}</p>
          <p className="text-sm text-[#6B7280]">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-[#F4F5F7] py-16">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        {/* Section Header */}
        <h2 className="mb-4 font-serif text-4xl font-extrabold text-[#0B2A4C]">
          Ce que nos utilisateurs disent
        </h2>
        <p className="mb-12 text-xl text-[#6B7280]">
          Des parents, des professeurs et des eleves temoignent de notre impact.
        </p>

        {/* Testimonial Cards */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-12 sm:space-y-0">
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                className="fill-[#E8A336] text-[#E8A336]"
              />
            ))}
            <span className="text-xl font-bold text-[#1A1A1A]">4.9/5</span>
          </div>
          <p className="text-xl text-[#1A1A1A]">
            <span className="font-bold text-[#0B2A4C]">2000+</span> avis
          </p>
          <p className="text-xl text-[#1A1A1A]">
            <span className="font-bold text-[#0B2A4C]">95%</span> recommandent
          </p>
        </div>
      </div>
    </section>
  );
}
