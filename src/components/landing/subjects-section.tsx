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
    color: "bg-violet-500",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
    href: "/courses?subject=mathematiques",
  },
  {
    name: "Français",
    icon: BookOpen,
    count: 124,
    color: "bg-rose-500",
    bgLight: "bg-rose-50",
    textColor: "text-rose-600",
    href: "/courses?subject=francais",
  },
  {
    name: "Anglais",
    icon: Globe,
    count: 98,
    color: "bg-teal-500",
    bgLight: "bg-teal-50",
    textColor: "text-teal-600",
    href: "/courses?subject=anglais",
  },
  {
    name: "Sciences",
    icon: Microscope,
    count: 87,
    color: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
    href: "/courses?subject=sciences",
  },
  {
    name: "Histoire-Géo",
    icon: History,
    count: 76,
    color: "bg-amber-500",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
    href: "/courses?subject=histoire-geo",
  },
  {
    name: "Physique-Chimie",
    icon: FlaskConical,
    count: 65,
    color: "bg-blue-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
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
          whileHover={{ y: -6, scale: 1.02 }}
          className={`relative overflow-hidden rounded-2xl border border-slate-200 ${subject.bgLight} p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg`}
        >
          <div className="relative flex items-center gap-4">
            {/* Icon */}
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl ${subject.color} shadow-lg`}
            >
              <subject.icon className="h-7 w-7 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{subject.name}</h3>
              <p className={`text-sm font-medium ${subject.textColor}`}>
                {subject.count} cours
              </p>
            </div>

            {/* Arrow */}
            <ArrowRight className="h-5 w-5 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-600" />
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
    <section ref={ref} className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row"
        >
          <div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Explore par{" "}
              <span className="bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
                matière
              </span>
            </h2>
            <p className="mt-2 text-slate-600">
              Trouvez le cours parfait dans votre discipline.
            </p>
          </div>

          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-violet-100 hover:text-violet-700"
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
