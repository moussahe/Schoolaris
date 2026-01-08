import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for search params
const searchSchema = z.object({
  q: z.string().min(1).max(100),
  type: z.enum(["all", "courses", "teachers"]).optional().default("all"),
  subject: z.string().optional(),
  level: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  free: z.coerce.boolean().optional(),
  limit: z.coerce.number().min(1).max(50).optional().default(20),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse and validate search parameters
    const params = searchSchema.parse({
      q: searchParams.get("q") || "",
      type: searchParams.get("type") || "all",
      subject: searchParams.get("subject"),
      level: searchParams.get("level"),
      priceMin: searchParams.get("priceMin"),
      priceMax: searchParams.get("priceMax"),
      free: searchParams.get("free"),
      limit: searchParams.get("limit"),
    });

    const { q, type, subject, level, priceMin, priceMax, free, limit } = params;

    // Build search results
    const results: Array<{
      id: string;
      title: string;
      type: "course" | "teacher" | "subject";
      description?: string;
      image?: string;
      subject?: string;
      level?: string;
      price?: number;
      isFree?: boolean;
      rating?: number;
      studentCount?: number;
      slug?: string;
    }> = [];

    // Search courses
    if (type === "all" || type === "courses") {
      const courseWhere = {
        isPublished: true,
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { subtitle: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } },
        ],
        ...(subject && { subject: subject as never }),
        ...(level && { gradeLevel: level as never }),
        ...(free && { price: 0 }),
        ...(priceMin !== undefined &&
          priceMax !== undefined && {
            price: { gte: priceMin * 100, lte: priceMax * 100 },
          }),
      };

      const courses = await prisma.course.findMany({
        where: courseWhere,
        select: {
          id: true,
          title: true,
          subtitle: true,
          slug: true,
          imageUrl: true,
          subject: true,
          gradeLevel: true,
          price: true,
          averageRating: true,
          totalStudents: true,
          author: {
            select: {
              name: true,
              teacherProfile: {
                select: {
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: [{ totalStudents: "desc" }, { averageRating: "desc" }],
        take: limit,
      });

      for (const course of courses) {
        results.push({
          id: course.id,
          title: course.title,
          type: "course",
          description: course.subtitle || undefined,
          image: course.imageUrl || undefined,
          subject: course.subject,
          level: formatLevel(course.gradeLevel),
          price: course.price / 100,
          isFree: course.price === 0,
          rating: course.averageRating,
          studentCount: course.totalStudents,
          slug: course.slug,
        });
      }
    }

    // Search teachers
    if (type === "all" || type === "teachers") {
      const teachers = await prisma.teacherProfile.findMany({
        where: {
          isVerified: true,
          OR: [
            { user: { name: { contains: q, mode: "insensitive" as const } } },
            { headline: { contains: q, mode: "insensitive" as const } },
            { bio: { contains: q, mode: "insensitive" as const } },
          ],
        },
        select: {
          id: true,
          slug: true,
          headline: true,
          avatarUrl: true,
          averageRating: true,
          totalStudents: true,
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ totalStudents: "desc" }, { averageRating: "desc" }],
        take: Math.min(limit, 5), // Limit teacher results
      });

      for (const teacher of teachers) {
        results.push({
          id: teacher.id,
          title: teacher.user.name || "Enseignant",
          type: "teacher",
          description: teacher.headline || undefined,
          image: teacher.avatarUrl || undefined,
          rating: teacher.averageRating,
          studentCount: teacher.totalStudents,
          slug: teacher.slug,
        });
      }
    }

    // Return results
    return NextResponse.json({
      results,
      total: results.length,
      query: q,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Parametres de recherche invalides",
          details: error.flatten(),
        },
        { status: 400 },
      );
    }

    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche" },
      { status: 500 },
    );
  }
}

// Helper to format grade level for display
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

// POST endpoint for advanced search with filters
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      query = "",
      subjects = [],
      levels = [],
      priceRange = { min: 0, max: 500 },
      sortBy = "relevance",
      page = 1,
      limit = 20,
    } = body;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      isPublished: true,
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" as const } },
          { subtitle: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
        ],
      }),
      ...(subjects.length > 0 && { subject: { in: subjects } }),
      ...(levels.length > 0 && { gradeLevel: { in: levels } }),
      ...(priceRange && {
        price: {
          gte: priceRange.min * 100,
          lte: priceRange.max * 100,
        },
      }),
    };

    // Build orderBy clause
    type OrderByField =
      | "enrollmentCount"
      | "averageRating"
      | "price"
      | "createdAt";
    type OrderByDirection = "desc" | "asc";

    const orderByMap: Record<
      string,
      { [key in OrderByField]?: OrderByDirection }
    > = {
      relevance: { enrollmentCount: "desc" } as { enrollmentCount: "desc" },
      popular: { enrollmentCount: "desc" } as { enrollmentCount: "desc" },
      rating: { averageRating: "desc" } as { averageRating: "desc" },
      newest: { createdAt: "desc" } as { createdAt: "desc" },
      price_asc: { price: "asc" } as { price: "asc" },
      price_desc: { price: "desc" } as { price: "desc" },
    };

    const orderBy = orderByMap[sortBy] || orderByMap.relevance;

    // Execute query
    const [courses, total] = await prisma.$transaction([
      prisma.course.findMany({
        where,
        select: {
          id: true,
          title: true,
          subtitle: true,
          slug: true,
          imageUrl: true,
          subject: true,
          gradeLevel: true,
          price: true,
          averageRating: true,
          totalStudents: true,
          totalDuration: true,
          totalLessons: true,
          author: {
            select: {
              name: true,
              image: true,
              teacherProfile: {
                select: {
                  slug: true,
                  isVerified: true,
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.course.count({ where }),
    ]);

    // Format results
    const results = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.subtitle,
      slug: course.slug,
      image: course.imageUrl,
      subject: course.subject,
      level: course.gradeLevel,
      levelDisplay: formatLevel(course.gradeLevel),
      price: course.price / 100,
      isFree: course.price === 0,
      rating: course.averageRating,
      studentCount: course.totalStudents,
      duration: course.totalDuration,
      lessonCount: course.totalLessons,
      author: {
        name: course.author.name,
        image: course.author.image,
        slug: course.author.teacherProfile?.slug,
        isVerified: course.author.teacherProfile?.isVerified,
      },
    }));

    return NextResponse.json({
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + courses.length < total,
      },
      filters: {
        query,
        subjects,
        levels,
        priceRange,
        sortBy,
      },
    });
  } catch (error) {
    console.error("Advanced search error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche avancee" },
      { status: 500 },
    );
  }
}
