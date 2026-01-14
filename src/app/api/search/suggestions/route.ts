import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fast suggestions endpoint for autocomplete
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Run queries in parallel for speed
    const [courses, subjects, teachers] = await Promise.all([
      // Course title matches (top 5)
      prisma.course.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { subtitle: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          subject: true,
          gradeLevel: true,
          imageUrl: true,
          price: true,
        },
        orderBy: { totalStudents: "desc" },
        take: 5,
      }),
      // Get popular subjects (we'll filter client-side by query match)
      prisma.course.groupBy({
        by: ["subject"],
        where: { isPublished: true },
        _count: { subject: true },
        orderBy: { _count: { subject: "desc" } },
        take: 12,
      }),
      // Teacher name matches
      prisma.teacherProfile.findMany({
        where: {
          isVerified: true,
          user: { name: { contains: query, mode: "insensitive" } },
        },
        select: {
          slug: true,
          user: { select: { name: true, image: true } },
        },
        take: 3,
      }),
    ]);

    // Format suggestions
    const suggestions = [
      // Courses
      ...courses.map((c) => ({
        type: "course" as const,
        id: c.id,
        title: c.title,
        slug: c.slug,
        image: c.imageUrl,
        meta: `${formatSubject(c.subject)} - ${formatLevel(c.gradeLevel)}`,
        price: c.price === 0 ? "Gratuit" : `${(c.price / 100).toFixed(0)} EUR`,
      })),
      // Subjects (filtered by query match on formatted name)
      ...subjects
        .filter((s) => {
          const formatted = formatSubject(s.subject).toLowerCase();
          return formatted.includes(query.toLowerCase());
        })
        .slice(0, 3)
        .map((s) => ({
          type: "subject" as const,
          id: s.subject,
          title: formatSubject(s.subject),
          slug: null,
          image: null,
          meta: "Voir tous les cours",
          price: null,
        })),
      // Teachers
      ...teachers.map((t) => ({
        type: "teacher" as const,
        id: t.slug,
        title: t.user.name || "Enseignant",
        slug: t.slug,
        image: t.user.image,
        meta: "Profil enseignant",
        price: null,
      })),
    ];

    return NextResponse.json({
      suggestions,
      query,
    });
  } catch (error) {
    console.error("Suggestions error:", error);
    return NextResponse.json({ suggestions: [], query: "" });
  }
}

function formatSubject(subject: string): string {
  const subjectMap: Record<string, string> = {
    MATHEMATIQUES: "Mathematiques",
    FRANCAIS: "Francais",
    HISTOIRE_GEO: "Histoire-Geo",
    SCIENCES: "Sciences",
    ANGLAIS: "Anglais",
    PHYSIQUE_CHIMIE: "Physique-Chimie",
    SVT: "SVT",
    PHILOSOPHIE: "Philosophie",
    ESPAGNOL: "Espagnol",
    ALLEMAND: "Allemand",
    SES: "SES",
    NSI: "NSI",
  };
  return subjectMap[subject] || subject;
}

function formatLevel(level: string): string {
  const levelMap: Record<string, string> = {
    CP: "CP",
    CE1: "CE1",
    CE2: "CE2",
    CM1: "CM1",
    CM2: "CM2",
    SIXIEME: "6eme",
    CINQUIEME: "5eme",
    QUATRIEME: "4eme",
    TROISIEME: "3eme",
    SECONDE: "2nde",
    PREMIERE: "1ere",
    TERMINALE: "Term.",
  };
  return levelMap[level] || level;
}
