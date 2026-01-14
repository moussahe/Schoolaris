import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import {
  generateCourseStructure,
  type CourseGenerationRequest,
} from "@/lib/ai-course-builder";
import { z } from "zod";

const requestSchema = z.object({
  topic: z.string().min(3, "Le sujet doit contenir au moins 3 caracteres"),
  subject: z.string(),
  gradeLevel: z.string(),
  targetDuration: z.number().optional(),
  additionalInstructions: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return NextResponse.json(
        { error: "Acces reserve aux enseignants" },
        { status: 403 },
      );
    }

    // Rate limiting (5 course generations per hour)
    const rateLimit = await checkRateLimit(session.user.id, "COURSE_BUILDER");
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Limite atteinte. Vous pouvez generer 5 cours par heure.",
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: rateLimitHeaders(rateLimit),
        },
      );
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Requete invalide", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const request: CourseGenerationRequest = parsed.data;
    const structure = await generateCourseStructure(request);

    return NextResponse.json(structure);
  } catch (error) {
    console.error("[AI Course Builder Error]", error);
    return NextResponse.json(
      { error: "Erreur lors de la generation du cours" },
      { status: 500 },
    );
  }
}
