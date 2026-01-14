import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface CourseRecommendation {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  imageUrl: string | null;
  subject: string;
  gradeLevel: string;
  price: number;
  averageRating: number;
  totalStudents: number;
  authorName: string | null;
  matchReason: string;
  matchScore: number; // 0-100, higher = better match
  weakAreasAddressed: string[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ childId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { childId } = await params;

    // Verify the parent owns this child
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId: session.user.id,
      },
      include: {
        purchases: {
          where: { status: "COMPLETED" },
          select: { courseId: true },
        },
        weakAreas: {
          where: { isResolved: false },
          orderBy: { errorCount: "desc" },
          take: 10,
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Enfant non trouve" }, { status: 404 });
    }

    // Get already purchased course IDs
    const purchasedCourseIds = child.purchases.map((p) => p.courseId);

    // Get unique subjects from weak areas
    const weakAreaSubjects = [
      ...new Set(child.weakAreas.map((wa) => wa.subject)),
    ];
    const weakAreaTopics = child.weakAreas.map((wa) => wa.topic.toLowerCase());

    // Find courses that match:
    // 1. Same grade level as child
    // 2. Same subjects as weak areas
    // 3. Not already purchased
    const matchingCourses = await prisma.course.findMany({
      where: {
        isPublished: true,
        gradeLevel: child.gradeLevel,
        id: { notIn: purchasedCourseIds },
        ...(weakAreaSubjects.length > 0 && {
          subject: { in: weakAreaSubjects },
        }),
      },
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: [{ averageRating: "desc" }, { totalStudents: "desc" }],
      take: 20, // Fetch more to allow filtering
    });

    // Score and rank courses based on relevance to weak areas
    const recommendations: CourseRecommendation[] = matchingCourses.map(
      (course) => {
        let matchScore = 50; // Base score
        const weakAreasAddressed: string[] = [];
        const reasons: string[] = [];

        // Check if course subject matches a weak area subject
        const matchingWeakAreas = child.weakAreas.filter(
          (wa) => wa.subject === course.subject,
        );

        if (matchingWeakAreas.length > 0) {
          matchScore += 20;
          matchingWeakAreas.forEach((wa) => {
            weakAreasAddressed.push(wa.topic);
          });
          reasons.push(
            `Cible ${matchingWeakAreas.length} point${matchingWeakAreas.length > 1 ? "s" : ""} faible${matchingWeakAreas.length > 1 ? "s" : ""}`,
          );
        }

        // Check if course title/description mentions weak area topics
        const courseTitle = course.title.toLowerCase();
        const courseDescription = (course.description || "").toLowerCase();
        const courseSubtitle = (course.subtitle || "").toLowerCase();

        for (const topic of weakAreaTopics) {
          if (
            courseTitle.includes(topic) ||
            courseDescription.includes(topic) ||
            courseSubtitle.includes(topic)
          ) {
            matchScore += 10;
            if (!weakAreasAddressed.includes(topic)) {
              weakAreasAddressed.push(topic);
            }
          }
        }

        // Boost score for highly rated courses
        if (course.averageRating >= 4.5) {
          matchScore += 10;
          reasons.push("Tres bien note");
        } else if (course.averageRating >= 4.0) {
          matchScore += 5;
        }

        // Boost for popular courses
        if (course.totalStudents >= 100) {
          matchScore += 5;
          reasons.push("Populaire");
        }

        // Cap score at 100
        matchScore = Math.min(100, matchScore);

        // Generate match reason
        let matchReason = "";
        if (weakAreasAddressed.length > 0) {
          matchReason = `Aide sur: ${weakAreasAddressed.slice(0, 2).join(", ")}`;
          if (weakAreasAddressed.length > 2) {
            matchReason += ` (+${weakAreasAddressed.length - 2})`;
          }
        } else if (reasons.length > 0) {
          matchReason = reasons.join(" • ");
        } else {
          matchReason = `Adapte au niveau ${formatGradeLevel(child.gradeLevel)}`;
        }

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          subtitle: course.subtitle,
          imageUrl: course.imageUrl,
          subject: course.subject,
          gradeLevel: course.gradeLevel,
          price: course.price,
          averageRating: course.averageRating,
          totalStudents: course.totalStudents,
          authorName: course.author.name,
          matchReason,
          matchScore,
          weakAreasAddressed,
        };
      },
    );

    // Sort by match score (highest first) and take top 6
    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    const topRecommendations = recommendations.slice(0, 6);

    // If we have few recommendations for weak areas, also suggest based on grade level
    if (topRecommendations.length < 3) {
      const additionalCourses = await prisma.course.findMany({
        where: {
          isPublished: true,
          gradeLevel: child.gradeLevel,
          id: {
            notIn: [
              ...purchasedCourseIds,
              ...topRecommendations.map((r) => r.id),
            ],
          },
        },
        include: {
          author: { select: { name: true } },
        },
        orderBy: [{ averageRating: "desc" }, { totalStudents: "desc" }],
        take: 6 - topRecommendations.length,
      });

      for (const course of additionalCourses) {
        topRecommendations.push({
          id: course.id,
          title: course.title,
          slug: course.slug,
          subtitle: course.subtitle,
          imageUrl: course.imageUrl,
          subject: course.subject,
          gradeLevel: course.gradeLevel,
          price: course.price,
          averageRating: course.averageRating,
          totalStudents: course.totalStudents,
          authorName: course.author.name,
          matchReason: `Populaire en ${formatGradeLevel(child.gradeLevel)}`,
          matchScore: 40,
          weakAreasAddressed: [],
        });
      }
    }

    return NextResponse.json({
      childId,
      childName: child.firstName,
      gradeLevel: child.gradeLevel,
      weakAreasCount: child.weakAreas.length,
      recommendations: topRecommendations,
    });
  } catch (error) {
    console.error("[Recommendations API Error]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function formatGradeLevel(level: string): string {
  const levels: Record<string, string> = {
    CP: "CP",
    CE1: "CE1",
    CE2: "CE2",
    CM1: "CM1",
    CM2: "CM2",
    SIXIEME: "6eme",
    CINQUIEME: "5eme",
    QUATRIEME: "4eme",
    TROISIEME: "3eme",
    SECONDE: "Seconde",
    PREMIERE: "Premiere",
    TERMINALE: "Terminale",
  };
  return levels[level] || level;
}
