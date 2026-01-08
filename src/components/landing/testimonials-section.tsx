"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    content:
      "Mon fils a gagné 4 points de moyenne en maths grâce à Schoolaris. Le tuteur IA est incroyable !",
    author: "Sophie L.",
    role: "Maman de Lucas, 3ème",
    rating: 5,
    highlight: "+4 pts",
    color: "#00F2EA",
  },
  {
    content:
      "Enfin une plateforme qui respecte le travail des enseignants. 85% de commission, c'est juste.",
    author: "Marie D.",
    role: "Professeure de français",
    rating: 5,
    highlight: "85%",
    color: "#E6007A",
  },
  {
    content:
      "L'IA m'aide à comprendre sans me donner les réponses. C'est comme avoir un prof particulier 24h/24.",
    author: "Emma P.",
    role: "Élève de Terminale",
    rating: 5,
    highlight: "24/7",
    color: "#D4FF00",
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
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group relative"
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        {/* Quote icon */}
        <Quote className="absolute right-4 top-4 h-8 w-8 text-white/5" />

        {/* Highlight badge */}
        <div
          className="mb-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-bold"
          style={{
            background: `${testimonial.color}20`,
            color: testimonial.color,
          }}
        >
          {testimonial.highlight}
        </div>

        {/* Stars */}
        <div className="mb-4 flex gap-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Content */}
        <p className="mb-6 text-sm leading-relaxed text-slate-300">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${testimonial.color}, ${testimonial.color}80)`,
            }}
          >
            {testimonial.author.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-white">{testimonial.author}</p>
            <p className="text-xs text-slate-400">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0D122B] py-24">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[#E6007A]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[#00F2EA]/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ils nous font{" "}
            <span className="bg-gradient-to-r from-[#E6007A] to-[#D4FF00] bg-clip-text text-transparent">
              confiance
            </span>
          </h2>
          <p className="text-lg text-slate-400">
            Plus de 10 000 familles utilisent Schoolaris au quotidien.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid gap-6 md:grid-cols-3">
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
