"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Star, Users, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const courses = [
  {
    id: 1,
    title: "Mathématiques Terminale - Préparation Bac",
    teacher: "Marie Dupont",
    teacherTitle: "Agrégée de mathématiques",
    rating: 4.9,
    reviews: 342,
    students: 1250,
    duration: "24h",
    price: 49,
    originalPrice: 79,
    image: "/courses/math.jpg",
    category: "Mathématiques",
    categoryColor: "#FF385C",
    level: "Terminale",
    bestseller: true,
  },
  {
    id: 2,
    title: "Français Bac - Dissertation et Commentaire",
    teacher: "Jean Martin",
    teacherTitle: "Professeur certifié",
    rating: 4.8,
    reviews: 215,
    students: 890,
    duration: "18h",
    price: 39,
    originalPrice: 59,
    image: "/courses/french.jpg",
    category: "Français",
    categoryColor: "#A435F0",
    level: "Terminale",
    bestseller: false,
  },
  {
    id: 3,
    title: "Physique-Chimie Première - Les Fondamentaux",
    teacher: "Sophie Bernard",
    teacherTitle: "Docteure en physique",
    rating: 4.7,
    reviews: 189,
    students: 720,
    duration: "20h",
    price: 0,
    originalPrice: 0,
    image: "/courses/physics.jpg",
    category: "Physique-Chimie",
    categoryColor: "#1E88E5",
    level: "Première",
    bestseller: false,
  },
  {
    id: 4,
    title: "Anglais B2 - Préparation aux certifications",
    teacher: "Emma Wilson",
    teacherTitle: "Native speaker, CELTA",
    rating: 4.9,
    reviews: 456,
    students: 2100,
    duration: "30h",
    price: 59,
    originalPrice: 99,
    image: "/courses/english.jpg",
    category: "Anglais",
    categoryColor: "#00A699",
    level: "Lycée",
    bestseller: true,
  },
];

function CourseCard({
  course,
  index,
}: {
  course: (typeof courses)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/courses/${course.id}`} className="group block">
        <div className="overflow-hidden rounded-2xl border border-[#DDDDDD] bg-white transition-all duration-300 hover:shadow-xl">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#F7F7F7] to-[#EBEBEB]">
            {/* Placeholder gradient */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(135deg, ${course.categoryColor}, transparent)`,
              }}
            />
            {/* Category badge */}
            <div
              className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: course.categoryColor }}
            >
              {course.category}
            </div>
            {/* Bestseller badge */}
            {course.bestseller && (
              <div className="absolute left-3 top-12 rounded-full bg-[#ECEB98] px-3 py-1 text-xs font-semibold text-[#3D3C0A]">
                Bestseller
              </div>
            )}
            {/* Level */}
            <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#222222] backdrop-blur">
              {course.level}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title */}
            <h3 className="mb-2 line-clamp-2 font-semibold text-[#222222] transition-colors group-hover:text-[#FF385C]">
              {course.title}
            </h3>

            {/* Teacher */}
            <p className="mb-3 text-sm text-[#717171]">
              {course.teacher} • {course.teacherTitle}
            </p>

            {/* Rating */}
            <div className="mb-3 flex items-center gap-2">
              <span className="font-bold text-[#B4690E]">{course.rating}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i <= Math.floor(course.rating)
                        ? "fill-[#E59819] text-[#E59819]"
                        : "fill-[#D1D7DC] text-[#D1D7DC]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#717171]">
                ({course.reviews} avis)
              </span>
            </div>

            {/* Meta */}
            <div className="mb-4 flex items-center gap-4 text-sm text-[#717171]">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {course.students.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.duration}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              {course.price === 0 ? (
                <span className="rounded bg-[#008A05]/10 px-2 py-1 text-sm font-bold text-[#008A05]">
                  Gratuit
                </span>
              ) : (
                <>
                  <span className="text-lg font-bold text-[#222222]">
                    {course.price} €
                  </span>
                  {course.originalPrice > course.price && (
                    <span className="text-sm text-[#717171] line-through">
                      {course.originalPrice} €
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedCourses() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="bg-[#F7F7F7] py-20">
      <div className="mx-auto max-w-[1760px] px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <h2 className="mb-3 text-[32px] font-bold text-[#222222]">
              Cours populaires
            </h2>
            <p className="text-lg text-[#717171]">
              Les cours les mieux notés par nos étudiants
            </p>
          </div>
          <Button
            variant="outline"
            className="hidden rounded-full border-[#222222] px-6 font-semibold text-[#222222] hover:bg-[#222222] hover:text-white md:flex"
            asChild
          >
            <Link href="/courses">
              Voir tous les cours
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Courses grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center md:hidden">
          <Button
            variant="outline"
            className="rounded-full border-[#222222] px-6 font-semibold text-[#222222]"
            asChild
          >
            <Link href="/courses">
              Voir tous les cours
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
