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
  Sparkles,
  ArrowRight,
} from "lucide-react";

const subjects = [
  {
    name: "Mathématiques",
    icon: Calculator,
    count: 156,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    href: "/courses?subject=mathematiques",
  },
  {
    name: "Français",
    icon: BookOpen,
    count: 124,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-500/10",
    href: "/courses?subject=francais",
  },
  {
    name: "Anglais",
    icon: Globe,
    count: 98,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500/10",
    href: "/courses?subject=anglais",
  },
  {
    name: "Sciences",
    icon: Microscope,
    count: 87,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    href: "/courses?subject=sciences",
  },
  {
    name: "Histoire-Géo",
    icon: Globe,
    count: 76,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-500/10",
    href: "/courses?subject=histoire-geo",
  },
  {
    name: "Physique-Chimie",
    icon: FlaskConical,
    count: 65,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
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
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 20, scale: 0.95 }
      }
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={subject.href} className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-border hover:shadow-lg">
          {/* Gradient background on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
          />

          <div className="relative flex items-center gap-4">
            {/* Icon */}
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl ${subject.bgColor} transition-transform duration-300 group-hover:scale-110`}
            >
              <subject.icon
                className={`h-7 w-7 bg-gradient-to-br ${subject.color} bg-clip-text text-transparent`}
                style={{
                  color: subject.color.includes("blue")
                    ? "#3b82f6"
                    : subject.color.includes("purple")
                      ? "#8b5cf6"
                      : subject.color.includes("pink")
                        ? "#ec4899"
                        : subject.color.includes("emerald")
                          ? "#10b981"
                          : subject.color.includes("orange")
                            ? "#f97316"
                            : "#06b6d4",
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                {subject.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {subject.count} cours
              </p>
            </div>

            {/* Arrow */}
            <ArrowRight className="h-5 w-5 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function SubjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-background py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Explorez par matière
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Trouvez le cours parfait
            </h2>
          </div>

          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
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
