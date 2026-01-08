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
    color: "bg-violet-500",
    bgLight: "bg-violet-50",
  },
  {
    content:
      "Enfin une plateforme qui respecte le travail des enseignants. 85% de commission, c'est juste.",
    author: "Marie D.",
    role: "Professeure de français",
    rating: 5,
    highlight: "85%",
    color: "bg-teal-500",
    bgLight: "bg-teal-50",
  },
  {
    content:
      "L'IA m'aide à comprendre sans me donner les réponses. C'est comme avoir un prof particulier 24h/24.",
    author: "Emma P.",
    role: "Élève de Terminale",
    rating: 5,
    highlight: "24/7",
    color: "bg-orange-500",
    bgLight: "bg-orange-50",
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
      <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 transition-all duration-300 hover:shadow-xl">
        {/* Quote icon */}
        <Quote className="absolute right-4 top-4 h-8 w-8 text-slate-100" />

        {/* Highlight badge */}
        <div
          className={`mb-4 inline-flex items-center rounded-full ${testimonial.bgLight} px-3 py-1.5 text-sm font-bold ${testimonial.color.replace("bg-", "text-")}`}
        >
          {testimonial.highlight}
        </div>

        {/* Stars */}
        <div className="mb-4 flex gap-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Content */}
        <p className="mb-6 text-base leading-relaxed text-slate-700">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${testimonial.color} text-lg font-bold text-white shadow-lg`}
          >
            {testimonial.author.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{testimonial.author}</p>
            <p className="text-sm text-slate-500">{testimonial.role}</p>
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
    <section ref={ref} className="relative bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Ils nous font{" "}
            <span className="bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">
              confiance
            </span>
          </h2>
          <p className="text-lg text-slate-600">
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
