"use client";

import { motion } from "framer-motion";
import { CourseCard } from "./course-card";

interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  price: number;
  gradeLevel: string;
  subject: string;
  totalStudents: number;
  totalLessons: number;
  totalDuration: number;
  averageRating: number;
  reviewCount: number;
  author: {
    name: string | null;
    image?: string | null;
  };
}

interface AnimatedCourseGridProps {
  courses: Course[];
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export function AnimatedCourseGrid({
  courses,
  className = "",
}: AnimatedCourseGridProps) {
  return (
    <motion.div
      className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {courses.map((course) => (
        <motion.div key={course.id} variants={itemVariants}>
          <CourseCard course={course} />
        </motion.div>
      ))}
    </motion.div>
  );
}
