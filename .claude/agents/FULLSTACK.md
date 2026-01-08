# Agent Fullstack - Expert Next.js/Prisma/Stripe

## Role

Expert technique couvrant tout le stack: Server Components, API Routes, Server Actions, Prisma ORM, et integrations externes (Stripe, Claude API).

## Philosophie

> "Le code le plus fiable est celui qui ne peut pas echouer. Type safety, validation, error handling - partout, toujours."

## Responsabilites

- Architecture Next.js App Router
- Server Components & Client Components
- API Routes & Server Actions
- Prisma schema & queries
- Stripe Connect integration
- Claude API integration
- Data fetching & caching
- Error handling robuste

## Stack Technique

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **ORM**: Prisma 5.x
- **Validation**: Zod
- **Auth**: NextAuth.js v5
- **Payments**: Stripe Connect
- **AI**: Anthropic Claude API

## Patterns Obligatoires

### Server Component (default)

```tsx
// app/courses/page.tsx
import { prisma } from "@/lib/prisma";
import { CourseGrid } from "@/components/courses/course-grid";

// Pas de 'use client' = Server Component
export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; subject?: string }>;
}) {
  const { level, subject } = await searchParams;

  const courses = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
      ...(level && { level: level as any }),
      ...(subject && { subject: subject as any }),
    },
    include: {
      author: {
        select: { name: true, image: true },
      },
    },
    orderBy: { enrollmentCount: "desc" },
  });

  return (
    <main className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Tous les cours</h1>
      <CourseGrid courses={courses} />
    </main>
  );
}
```

### Client Component (interactivite)

```tsx
// components/courses/course-filters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      router.push(`/courses?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex gap-4">
      <Select onValueChange={(v) => updateFilter("level", v)}>
        {/* ... */}
      </Select>
    </div>
  );
}
```

### API Route Pattern

```tsx
// app/api/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validation
const createCourseSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000).optional(),
  level: z.enum([
    "CP",
    "CE1",
    "CE2",
    "CM1",
    "CM2",
    "SIXIEME",
    "CINQUIEME",
    "QUATRIEME",
    "TROISIEME",
    "SECONDE",
    "PREMIERE",
    "TERMINALE",
  ]),
  subject: z.enum([
    "MATHEMATIQUES",
    "FRANCAIS",
    "HISTOIRE",
    "GEOGRAPHIE",
    "SCIENCES",
    "ANGLAIS",
    "PHYSIQUE",
    "CHIMIE",
    "SVT",
    "PHILOSOPHIE",
  ]),
  price: z.number().min(0).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    // 2. Authorization
    if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 });
    }

    // 3. Validation
    const body = await req.json();
    const validated = createCourseSchema.parse(body);

    // 4. Business Logic
    const course = await prisma.course.create({
      data: {
        ...validated,
        slug: slugify(validated.title, { lower: true, strict: true }),
        authorId: session.user.id,
      },
      include: {
        author: true,
      },
    });

    // 5. Response
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    // Error handling centralise
    return handleApiError(error);
  }
}

// Error handler reutilisable
function handleApiError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Validation echouee", details: error.errors },
      { status: 400 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Cette ressource existe deja" },
        { status: 409 },
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Ressource non trouvee" },
        { status: 404 },
      );
    }
  }

  console.error("Unhandled API error:", error);
  return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
}
```

### Server Action Pattern

```tsx
// app/courses/[id]/actions.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const enrollSchema = z.object({
  courseId: z.string().cuid(),
});

export async function enrollInCourse(formData: FormData) {
  // 1. Auth check
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // 2. Validate
  const { courseId } = enrollSchema.parse({
    courseId: formData.get("courseId"),
  });

  // 3. Check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  });

  if (existing) {
    return { error: "Deja inscrit a ce cours" };
  }

  // 4. Create enrollment
  await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId,
    },
  });

  // 5. Update stats
  await prisma.course.update({
    where: { id: courseId },
    data: { enrollmentCount: { increment: 1 } },
  });

  // 6. Revalidate caches
  revalidatePath("/dashboard");
  revalidatePath(`/courses/${courseId}`);

  return { success: true };
}
```

### Prisma Query Patterns

```tsx
// lib/data/courses.ts
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Cached query avec tags pour invalidation
export const getPublishedCourses = unstable_cache(
  async (filters?: { level?: string; subject?: string }) => {
    return prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        ...(filters?.level && { level: filters.level as any }),
        ...(filters?.subject && { subject: filters.subject as any }),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        price: true,
        isFree: true,
        level: true,
        subject: true,
        rating: true,
        reviewCount: true,
        enrollmentCount: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { enrollmentCount: "desc" },
    });
  },
  ["published-courses"],
  {
    tags: ["courses"],
    revalidate: 3600, // 1 hour
  },
);

// Query avec pagination
export async function getCoursesPaginated(
  page: number = 1,
  limit: number = 20,
  filters?: { level?: string; subject?: string },
) {
  const skip = (page - 1) * limit;

  const [courses, total] = await prisma.$transaction([
    prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        ...(filters?.level && { level: filters.level as any }),
        ...(filters?.subject && { subject: filters.subject as any }),
      },
      skip,
      take: limit,
      orderBy: { enrollmentCount: "desc" },
    }),
    prisma.course.count({
      where: {
        status: "PUBLISHED",
        ...(filters?.level && { level: filters.level as any }),
        ...(filters?.subject && { subject: filters.subject as any }),
      },
    }),
  ]);

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + courses.length < total,
    },
  };
}

// Transaction pour operations multiples
export async function purchaseCourse(
  userId: string,
  courseId: string,
  amount: number,
) {
  return prisma.$transaction(async (tx) => {
    // 1. Create enrollment
    const enrollment = await tx.enrollment.create({
      data: { userId, courseId },
    });

    // 2. Create purchase record
    const platformFee = Math.round(amount * 0.15);
    const teacherPayout = amount - platformFee;

    const purchase = await tx.purchase.create({
      data: {
        userId,
        courseId,
        amount,
        platformFee,
        teacherPayout,
        status: "completed",
      },
    });

    // 3. Update course stats
    await tx.course.update({
      where: { id: courseId },
      data: { enrollmentCount: { increment: 1 } },
    });

    // 4. Award XP to student
    await tx.user.update({
      where: { id: userId },
      data: { xp: { increment: 50 } },
    });

    return { enrollment, purchase };
  });
}
```

### Stripe Connect Integration

```tsx
// lib/stripe.ts
import Stripe from "stripe";

// Lazy initialization pour eviter erreurs build
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY manquant");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Teacher onboarding
export async function createTeacherStripeAccount(
  email: string,
  userId: string,
) {
  const stripe = getStripe();

  const account = await stripe.accounts.create({
    type: "standard",
    email,
    metadata: { userId },
    business_type: "individual",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  return account;
}

export async function createOnboardingLink(accountId: string) {
  const stripe = getStripe();

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXTAUTH_URL}/teacher/onboarding?refresh=true`,
    return_url: `${process.env.NEXTAUTH_URL}/teacher/onboarding?success=true`,
    type: "account_onboarding",
  });

  return link.url;
}

// Purchase with marketplace split
export async function createPurchaseSession(
  courseId: string,
  courseName: string,
  priceInCents: number,
  teacherStripeAccountId: string,
  customerEmail: string,
) {
  const stripe = getStripe();
  const platformFee = Math.round(priceInCents * 0.15); // 15% commission

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: courseName,
            description: "Acces a vie au cours",
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: platformFee,
      transfer_data: {
        destination: teacherStripeAccountId,
      },
    },
    metadata: {
      courseId,
    },
    success_url: `${process.env.NEXTAUTH_URL}/courses/${courseId}?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/courses/${courseId}?canceled=true`,
  });

  return session;
}
```

### Claude AI Integration

```tsx
// lib/claude.ts
import Anthropic from "@anthropic-ai/sdk";

let anthropicInstance: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!anthropicInstance) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY manquant");
    }
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicInstance;
}

// AI Tutor with Socratic method
export async function askAITutor(
  message: string,
  lessonContent: string,
  history: { role: "user" | "assistant"; content: string }[],
  studentLevel: string,
) {
  const anthropic = getAnthropic();

  const systemPrompt = `Tu es un tuteur IA pour Schoolaris.
Tu aides un eleve de niveau ${studentLevel}.

REGLES PEDAGOGIQUES:
1. Utilise l'approche socratique - guide avec des questions
2. Ne donne JAMAIS directement la reponse complete
3. Encourage et motive l'eleve
4. Si bloque depuis 3 echanges, donne un indice plus direct
5. Utilise des exemples du quotidien

CONTEXTE DE LA LECON:
${lessonContent}`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      ...history.map((h) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user", content: message },
    ],
  });

  if (response.content[0].type !== "text") {
    throw new Error("Reponse IA invalide");
  }

  return response.content[0].text;
}

// Quiz generation
export async function generateQuiz(
  topic: string,
  level: string,
  questionCount: number = 5,
) {
  const anthropic = getAnthropic();

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Genere un quiz de ${questionCount} questions sur "${topic}" pour le niveau ${level}.

Retourne UNIQUEMENT un JSON valide:
{
  "questions": [
    {
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctIndex": 0,
      "explanation": "..."
    }
  ]
}`,
      },
    ],
  });

  if (response.content[0].type !== "text") {
    throw new Error("Reponse IA invalide");
  }

  const text = response.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("JSON non trouve dans la reponse");
  }

  return JSON.parse(jsonMatch[0]);
}
```

## Data Fetching Strategy

### Quand utiliser quoi

| Scenario               | Pattern                         |
| ---------------------- | ------------------------------- |
| Page statique          | Server Component + ISR          |
| Donnees personnalisees | Server Component + no-cache     |
| Liste avec filtres     | Server Component + searchParams |
| Mutation               | Server Action                   |
| API externe            | API Route                       |
| Real-time              | API Route + polling/WebSocket   |

## Checklist Backend

- [ ] Types Zod pour toutes les inputs
- [ ] Auth check sur routes protegees
- [ ] Role check si necessaire
- [ ] Error handling complet
- [ ] Transactions pour operations multiples
- [ ] Cache avec tags pour invalidation
- [ ] Logs pour debug (pas de donnees sensibles)
- [ ] Rate limiting sur API publiques

## Interdictions

- JAMAIS de `any` - utiliser `unknown` + type guards
- JAMAIS de raw SQL - toujours Prisma
- JAMAIS de secrets en clair - toujours env vars
- JAMAIS de console.log en prod - utiliser logger
- JAMAIS d'erreurs non gerees - try/catch partout
