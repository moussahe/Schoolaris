"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Calculator,
  BookOpen,
  Globe,
  Microscope,
  FlaskConical,
  History,
  ArrowRight,
} from "lucide-react";

const subjects = [
  {
    name: "Mathématiques",
    icon: Calculator,
    count: 156,
    color: "#00F2EA",
    href: "/courses?subject=mathematiques",
  },
  {
    name: "Français",
    icon: BookOpen,
    count: 124,
    color: "#E6007A",
    href: "/courses?subject=francais",
  },
  {
    name: "Anglais",
    icon: Globe,
    count: 98,
    color: "#D4FF00",
    href: "/courses?subject=anglais",
  },
  {
    name: "Sciences",
    icon: Microscope,
    count: 87,
    color: "#00F2EA",
    href: "/courses?subject=sciences",
  },
  {
    name: "Histoire-Géo",
    icon: History,
    count: 76,
    color: "#E6007A",
    href: "/courses?subject=histoire-geo",
  },
  {
    name: "Physique-Chimie",
    icon: FlaskConical,
    count: 65,
    color: "#D4FF00",
    href: "/courses?subject=physique-chimie",
  },
];

function SubjectCard({
  subject,
  index,
}: {
  subject: (typeof subjects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={subject.href} className="group block">
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20"
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10"
            style={{
              background: `linear-gradient(135deg, ${subject.color}, transparent)`,
            }}
          />

          <div className="relative flex items-center gap-4">
            {/* Icon */}
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${subject.color}, ${subject.color}80)`,
              }}
            >
              <subject.icon className="h-7 w-7 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-semibold text-white transition-colors">
                {subject.name}
              </h3>
              <p className="text-sm text-slate-400">{subject.count} cours</p>
            </div>

            {/* Arrow */}
            <ArrowRight className="h-5 w-5 text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function SubjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0a0e1f] py-24">
      {/* Subtle gradient line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row"
        >
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Explorez par{" "}
              <span className="bg-gradient-to-r from-[#00F2EA] to-[#D4FF00] bg-clip-text text-transparent">
                matière
              </span>
            </h2>
            <p className="mt-2 text-slate-400">
              Trouvez le cours parfait dans votre discipline.
            </p>
          </div>

          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#00F2EA] transition-colors hover:text-white"
          >
            Voir tous les cours
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Subjects grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject, index) => (
            <SubjectCard key={subject.name} subject={subject} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
