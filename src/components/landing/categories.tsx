"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookText,
  BrainCircuit,
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
  Languages,
  Leaf,
  type LucideIcon,
} from "lucide-react";

interface Subject {
  name: string;
  slug: string;
  Icon: LucideIcon;
  courseCount: number;
  color: string;
  gridSpan?: number;
}

const subjects: Subject[] = [
  {
    name: "Mathematiques",
    slug: "mathematiques",
    Icon: Calculator,
    courseCount: 42,
    color: "#3B82F6",
    gridSpan: 2,
  },
  {
    name: "Francais",
    slug: "francais",
    Icon: BookText,
    courseCount: 35,
    color: "#EF4444",
  },
  {
    name: "Anglais",
    slug: "anglais",
    Icon: Globe,
    courseCount: 28,
    color: "#22C55E",
  },
  {
    name: "Histoire-Geo",
    slug: "histoire-geographie",
    Icon: Landmark,
    courseCount: 22,
    color: "#A16207",
  },
  {
    name: "SVT",
    slug: "svt",
    Icon: Leaf,
    courseCount: 18,
    color: "#14B8A6",
    gridSpan: 2,
  },
  {
    name: "Physique-Chimie",
    slug: "physique-chimie",
    Icon: FlaskConical,
    courseCount: 25,
    color: "#8B5CF6",
  },
  {
    name: "Philosophie",
    slug: "philosophie",
    Icon: BrainCircuit,
    courseCount: 15,
    color: "#6366F1",
    gridSpan: 2,
  },
  {
    name: "Langues",
    slug: "langues",
    Icon: Languages,
    courseCount: 31,
    color: "#F97316",
    gridSpan: 2,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

function SubjectCard({ subject }: { subject: Subject }) {
  const { name, Icon, courseCount, color, gridSpan = 1, slug } = subject;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -8,
        boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="flex flex-col justify-between rounded-xl bg-white p-6 transition-shadow duration-300"
      style={{
        boxShadow: "0px 4px 15px rgba(0,0,0,0.05)",
        gridColumn: `span ${gridSpan} / span ${gridSpan}`,
      }}
    >
      <Link href={`/courses?category=${slug}`} className="group">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
        <h3 className="mb-1 text-lg font-semibold text-[#1A1A1A] group-hover:text-[#0B2A4C]">
          {name}
        </h3>
        <p className="text-sm text-[#6B7280]">
          {courseCount} cours disponibles
        </p>
      </Link>
    </motion.div>
  );
}

export function Categories() {
  return (
    <section className="bg-[#F4F5F7] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#E8A336]">
            Explorez par Matiere
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B2A4C] sm:text-4xl">
            Trouvez le tuteur parfait pour chaque sujet
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#6B7280]">
            Des mathematiques a la philosophie, nous couvrons toutes les
            matieres pour assurer la reussite de votre enfant.
          </p>
        </div>

        {/* Subjects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {subjects.map((subject) => (
            <SubjectCard key={subject.slug} subject={subject} />
          ))}
        </motion.div>

        {/* "See All" Link */}
        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="group inline-flex items-center text-base font-semibold text-[#0B2A4C] hover:text-[#E8A336]"
          >
            Voir toutes les matieres
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
