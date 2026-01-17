# KURSUS - Architecture Technique

> Architecture moderne, scalable et performante pour une plateforme EdTech

---

## Table des Matieres

1. [Vue d'ensemble](#1-vue-densemble)
2. [Stack Technique](#2-stack-technique)
3. [Architecture Applicative](#3-architecture-applicative)
4. [Base de Donnees](#4-base-de-donnees)
5. [Authentification](#5-authentification)
6. [Paiements](#6-paiements)
7. [IA & Machine Learning](#7-ia--machine-learning)
8. [Performance](#8-performance)
9. [Securite](#9-securite)
10. [Infrastructure](#10-infrastructure)

---

## 1. Vue d'ensemble

### Architecture High-Level

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  [Web App]     [PWA Mobile]     [Future: Native Apps]                   │
│     ↓              ↓                    ↓                               │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           EDGE LAYER                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  [Vercel Edge]                                                          │
│    - CDN Global                                                         │
│    - Edge Functions (middleware, rate limiting)                         │
│    - Image Optimization                                                 │
│    - ISR/SSG Cache                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  [Next.js 16 App Router]                                                │
│    - Server Components (data fetching)                                  │
│    - Client Components (interactivity)                                  │
│    - API Routes (REST endpoints)                                        │
│    - Server Actions (mutations)                                         │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Auth Module  │  │ Courses Module│  │ Payment Module│                 │
│  │ (NextAuth)   │  │ (CRUD + IA)  │  │ (Stripe)     │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │   PostgreSQL    │  │    Supabase     │  │    Redis        │         │
│  │   (Prisma ORM)  │  │    Storage      │  │    (Cache)      │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  [Stripe Connect]  [Anthropic Claude]  [Resend]  [Cloudflare Stream]   │
│   (Payments)        (AI Tutoring)      (Emails)   (Video CDN)          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Stack Technique

### Core Stack

| Layer             | Technology       | Version | Justification                       |
| ----------------- | ---------------- | ------- | ----------------------------------- |
| **Framework**     | Next.js          | 16.x    | App Router, Server Components, Edge |
| **Language**      | TypeScript       | 5.x     | Type safety, DX                     |
| **Styling**       | Tailwind CSS     | 4.x     | Utility-first, performance          |
| **UI Components** | shadcn/ui        | Latest  | Accessible, customizable            |
| **Animation**     | Framer Motion    | 11.x    | Declarative, performant             |
| **ORM**           | Prisma           | 5.x     | Type-safe, migrations               |
| **Database**      | PostgreSQL       | 15.x    | Reliability, features               |
| **Auth**          | NextAuth.js      | 5.x     | Flexible, secure                    |
| **Payments**      | Stripe Connect   | Latest  | Marketplace ready                   |
| **AI**            | Anthropic Claude | 3.5     | Education-optimized                 |

### State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SERVER STATE (React Query / TanStack Query)                    │
│  ├─ Courses data                                                │
│  ├─ User profiles                                               │
│  ├─ Progress data                                               │
│  └─ Search results                                              │
│                                                                  │
│  CLIENT STATE (Zustand)                                         │
│  ├─ UI state (modals, sidebars)                                │
│  ├─ Video player state                                          │
│  ├─ Cart/Checkout state                                         │
│  └─ Preferences (theme, locale)                                 │
│                                                                  │
│  FORM STATE (React Hook Form + Zod)                             │
│  ├─ Validation schemas                                          │
│  └─ Form submissions                                            │
│                                                                  │
│  URL STATE (nuqs)                                               │
│  ├─ Filters                                                     │
│  ├─ Search queries                                              │
│  └─ Pagination                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Dependencies Principales

```json
{
  "dependencies": {
    "next": "16.x",
    "react": "19.x",
    "typescript": "5.x",
    "@tanstack/react-query": "5.x",
    "zustand": "5.x",
    "react-hook-form": "7.x",
    "zod": "3.x",
    "@prisma/client": "5.x",
    "next-auth": "5.x",
    "stripe": "latest",
    "@anthropic-ai/sdk": "latest",
    "framer-motion": "11.x",
    "lucide-react": "latest"
  }
}
```

---

## 3. Architecture Applicative

### Structure des Dossiers

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── teacher/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (marketing)/              # Public marketing pages
│   │   ├── page.tsx              # Homepage
│   │   ├── pricing/
│   │   ├── about/
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/              # Protected dashboard
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── courses/
│   │   │   ├── page.tsx          # Browse courses
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Course detail
│   │   │       └── learn/
│   │   │           └── page.tsx  # Learning interface
│   │   ├── progress/
│   │   ├── settings/
│   │   └── layout.tsx
│   │
│   ├── (teacher)/                # Teacher portal
│   │   ├── teacher/
│   │   │   ├── page.tsx          # Teacher dashboard
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx      # My courses
│   │   │   │   ├── new/
│   │   │   │   └── [id]/edit/
│   │   │   ├── analytics/
│   │   │   └── earnings/
│   │   └── layout.tsx
│   │
│   ├── (parent)/                 # Parent portal
│   │   ├── parent/
│   │   │   ├── page.tsx
│   │   │   ├── children/
│   │   │   └── reports/
│   │   └── layout.tsx
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/
│   │   ├── courses/
│   │   ├── ai/
│   │   │   ├── tutor/
│   │   │   └── quiz/
│   │   ├── stripe/
│   │   │   ├── connect/
│   │   │   └── webhooks/
│   │   └── upload/
│   │
│   ├── layout.tsx                # Root layout
│   ├── error.tsx                 # Error boundary
│   ├── not-found.tsx
│   └── loading.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── navigation.tsx
│   │
│   ├── courses/                  # Course feature
│   │   ├── course-card.tsx
│   │   ├── course-grid.tsx
│   │   ├── course-player.tsx
│   │   └── course-progress.tsx
│   │
│   ├── ai/                       # AI feature
│   │   ├── ai-tutor.tsx
│   │   ├── quiz-generator.tsx
│   │   └── chat-interface.tsx
│   │
│   ├── gamification/             # Gamification feature
│   │   ├── xp-badge.tsx
│   │   ├── streak-counter.tsx
│   │   ├── achievement-card.tsx
│   │   └── leaderboard.tsx
│   │
│   └── forms/                    # Form components
│       ├── login-form.tsx
│       ├── register-form.tsx
│       └── course-form.tsx
│
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # NextAuth config
│   ├── stripe.ts                 # Stripe client
│   ├── claude.ts                 # Claude AI client
│   ├── utils.ts                  # Utilities (cn, etc.)
│   └── validations/              # Zod schemas
│       ├── auth.ts
│       ├── course.ts
│       └── user.ts
│
├── hooks/                        # Custom React hooks
│   ├── use-courses.ts
│   ├── use-progress.ts
│   ├── use-ai-tutor.ts
│   └── use-media-query.ts
│
├── stores/                       # Zustand stores
│   ├── ui-store.ts
│   ├── player-store.ts
│   └── cart-store.ts
│
├── types/                        # TypeScript types
│   ├── course.ts
│   ├── user.ts
│   └── api.ts
│
└── styles/
    └── globals.css               # Global styles + Tailwind
```

### Server Components vs Client Components

```tsx
// RULE: Server Components by default
// Only use 'use client' when needed

// Server Component (default) - Data fetching
// app/courses/page.tsx
import { prisma } from "@/lib/prisma";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: { author: true },
  });

  return (
    <div>
      <h1>Tous les cours</h1>
      <CourseGrid courses={courses} />
    </div>
  );
}

// Client Component - Interactivity needed
// components/courses/course-card.tsx
("use client");

import { motion } from "framer-motion";
import { useState } from "react";

export function CourseCard({ course }: { course: Course }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* ... */}
    </motion.div>
  );
}
```

### Server Actions Pattern

```tsx
// app/courses/actions.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const enrollSchema = z.object({
  courseId: z.string().cuid(),
});

export async function enrollInCourse(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Non autorise");
  }

  const { courseId } = enrollSchema.parse({
    courseId: formData.get("courseId"),
  });

  await prisma.enrollment.create({
    data: {
      courseId,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/courses/${courseId}`);

  return { success: true };
}
```

---

## 4. Base de Donnees

### Schema Prisma Complet

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============= ENUMS =============

enum UserRole {
  STUDENT
  PARENT
  TEACHER
  ADMIN
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum SchoolLevel {
  CP
  CE1
  CE2
  CM1
  CM2
  SIXIEME
  CINQUIEME
  QUATRIEME
  TROISIEME
  SECONDE
  PREMIERE
  TERMINALE
}

enum Subject {
  MATHEMATIQUES
  FRANCAIS
  HISTOIRE
  GEOGRAPHIE
  SCIENCES
  PHYSIQUE
  CHIMIE
  SVT
  ANGLAIS
  ESPAGNOL
  ALLEMAND
  PHILOSOPHIE
}

// ============= USER & AUTH =============

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          UserRole  @default(STUDENT)
  bio           String?

  // Stripe Connect (for teachers)
  stripeAccountId   String?
  stripeOnboarded   Boolean @default(false)

  // Gamification
  xp            Int       @default(0)
  level         Int       @default(1)
  streak        Int       @default(0)
  lastActiveAt  DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]

  // Teacher relations
  courses       Course[]          @relation("CourseAuthor")

  // Student relations
  enrollments   Enrollment[]
  progress      LessonProgress[]
  quizAttempts  QuizAttempt[]
  achievements  UserAchievement[]

  // Parent relations
  children      Child[]

  @@index([email])
  @@index([role])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// ============= PARENT/CHILD =============

model Child {
  id          String      @id @default(cuid())
  firstName   String
  lastName    String?
  birthDate   DateTime?
  grade       SchoolLevel
  avatar      String?

  parentId    String
  parent      User        @relation(fields: [parentId], references: [id], onDelete: Cascade)

  // Child's learning data
  enrollments Enrollment[]
  progress    LessonProgress[]

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([parentId])
}

// ============= COURSES =============

model Course {
  id              String        @id @default(cuid())
  title           String
  slug            String        @unique
  description     String?       @db.Text
  shortDescription String?
  thumbnail       String?
  previewVideoUrl String?

  price           Decimal       @default(0) @db.Decimal(10, 2)
  isFree          Boolean       @default(false)

  level           SchoolLevel
  subject         Subject
  status          CourseStatus  @default(DRAFT)

  // SEO
  metaTitle       String?
  metaDescription String?

  // Stats (denormalized for performance)
  enrollmentCount Int           @default(0)
  rating          Decimal       @default(0) @db.Decimal(2, 1)
  reviewCount     Int           @default(0)

  authorId        String
  author          User          @relation("CourseAuthor", fields: [authorId], references: [id])

  chapters        Chapter[]
  enrollments     Enrollment[]
  reviews         Review[]
  purchases       Purchase[]

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  publishedAt     DateTime?

  @@index([authorId])
  @@index([slug])
  @@index([level, subject])
  @@index([status])
}

model Chapter {
  id          String    @id @default(cuid())
  title       String
  description String?
  order       Int
  isFree      Boolean   @default(false)

  courseId    String
  course      Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)

  lessons     Lesson[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([courseId])
  @@index([order])
}

model Lesson {
  id          String    @id @default(cuid())
  title       String
  content     String?   @db.Text
  videoUrl    String?
  duration    Int?      // in seconds
  order       Int

  chapterId   String
  chapter     Chapter   @relation(fields: [chapterId], references: [id], onDelete: Cascade)

  progress    LessonProgress[]
  quiz        Quiz?

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([chapterId])
  @@index([order])
}

// ============= PROGRESS & LEARNING =============

model Enrollment {
  id          String    @id @default(cuid())

  userId      String?
  user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)

  childId     String?
  child       Child?    @relation(fields: [childId], references: [id], onDelete: Cascade)

  courseId    String
  course      Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)

  progress    Int       @default(0) // Percentage
  completedAt DateTime?

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([userId, courseId])
  @@unique([childId, courseId])
  @@index([userId])
  @@index([childId])
  @@index([courseId])
}

model LessonProgress {
  id              String    @id @default(cuid())

  userId          String?
  user            User?     @relation(fields: [userId], references: [id], onDelete: Cascade)

  childId         String?
  child           Child?    @relation(fields: [childId], references: [id], onDelete: Cascade)

  lessonId        String
  lesson          Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  watchedSeconds  Int       @default(0)
  percentComplete Int       @default(0)
  completed       Boolean   @default(false)
  completedAt     DateTime?
  lastWatchedAt   DateTime?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([userId, lessonId])
  @@unique([childId, lessonId])
  @@index([userId])
  @@index([childId])
  @@index([lessonId])
}

// ============= QUIZZES =============

model Quiz {
  id        String    @id @default(cuid())
  title     String

  lessonId  String    @unique
  lesson    Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  questions QuizQuestion[]
  attempts  QuizAttempt[]

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model QuizQuestion {
  id          String    @id @default(cuid())
  question    String    @db.Text
  options     Json      // ["Option A", "Option B", ...]
  correctIndex Int
  explanation String?   @db.Text
  points      Int       @default(1)
  order       Int

  quizId      String
  quiz        Quiz      @relation(fields: [quizId], references: [id], onDelete: Cascade)

  @@index([quizId])
}

model QuizAttempt {
  id        String    @id @default(cuid())

  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  quizId    String
  quiz      Quiz      @relation(fields: [quizId], references: [id], onDelete: Cascade)

  answers   Json      // { questionId: selectedIndex }
  score     Int
  maxScore  Int
  xpEarned  Int       @default(0)

  createdAt DateTime  @default(now())

  @@index([userId])
  @@index([quizId])
}

// ============= REVIEWS =============

model Review {
  id        String    @id @default(cuid())
  rating    Int       // 1-5
  comment   String?   @db.Text

  userId    String
  courseId  String
  course    Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([userId, courseId])
  @@index([courseId])
}

// ============= PAYMENTS =============

model Purchase {
  id                  String    @id @default(cuid())

  userId              String
  courseId            String
  course              Course    @relation(fields: [courseId], references: [id])

  // Amounts in cents
  amount              Int
  platformFee         Int       // 15% commission
  teacherPayout       Int       // 85% to teacher

  stripePaymentIntentId String? @unique
  stripeTransferId    String?

  status              String    @default("pending") // pending, completed, refunded

  createdAt           DateTime  @default(now())

  @@index([userId])
  @@index([courseId])
  @@index([status])
}

// ============= GAMIFICATION =============

model Achievement {
  id          String    @id @default(cuid())
  name        String
  description String
  icon        String
  xpReward    Int       @default(0)

  // Criteria
  type        String    // "streak", "courses_completed", "quizzes_aced", etc.
  threshold   Int       // e.g., 7 for "7-day streak"

  users       UserAchievement[]

  @@unique([type, threshold])
}

model UserAchievement {
  id            String      @id @default(cuid())

  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  achievementId String
  achievement   Achievement @relation(fields: [achievementId], references: [id])

  unlockedAt    DateTime    @default(now())

  @@unique([userId, achievementId])
  @@index([userId])
}

// ============= AI CONVERSATIONS =============

model TutorConversation {
  id                String    @id @default(cuid())
  userId            String
  lessonId          String
  userMessage       String    @db.Text
  assistantResponse String    @db.Text

  createdAt         DateTime  @default(now())

  @@index([userId])
  @@index([lessonId])
}
```

---

## 5. Authentification

### NextAuth.js v5 Configuration

```tsx
// lib/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
    newUser: "/onboarding",
  },
});
```

### Role-Based Access Control

```tsx
// lib/auth-guards.ts
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.user.role as UserRole)) {
    redirect("/unauthorized");
  }

  return session;
}

// Usage in pages
// app/(teacher)/teacher/page.tsx
export default async function TeacherDashboard() {
  const session = await requireRole(["TEACHER", "ADMIN"]);
  // ...
}
```

---

## 6. Paiements

### Stripe Connect Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE CONNECT FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. TEACHER ONBOARDING                                          │
│     Teacher clicks "Devenir createur"                           │
│          ↓                                                      │
│     Create Stripe Connect account (Standard)                    │
│          ↓                                                      │
│     Redirect to Stripe onboarding                               │
│          ↓                                                      │
│     Stripe webhook: account.updated                             │
│          ↓                                                      │
│     Mark teacher as stripeOnboarded: true                       │
│                                                                 │
│  2. COURSE PURCHASE                                             │
│     Student clicks "Acheter" (100 EUR)                          │
│          ↓                                                      │
│     Create PaymentIntent with transfer_data                     │
│          ↓                                                      │
│     Student pays via Stripe Checkout                            │
│          ↓                                                      │
│     Webhook: payment_intent.succeeded                           │
│          ↓                                                      │
│     Create Purchase record                                      │
│     Platform: 15 EUR | Teacher: 85 EUR                          │
│          ↓                                                      │
│     Auto-transfer to teacher's Stripe account                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```tsx
// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Create teacher Connect account
export async function createConnectAccount(userId: string, email: string) {
  const account = await stripe.accounts.create({
    type: "standard",
    email,
    metadata: { userId },
  });

  return account;
}

// Create onboarding link
export async function createOnboardingLink(accountId: string) {
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXTAUTH_URL}/teacher/onboarding?refresh=true`,
    return_url: `${process.env.NEXTAUTH_URL}/teacher/onboarding?success=true`,
    type: "account_onboarding",
  });

  return link.url;
}

// Create payment with marketplace split
export async function createCoursePayment(
  courseId: string,
  priceInCents: number,
  teacherStripeAccountId: string,
  studentEmail: string,
) {
  const platformFee = Math.round(priceInCents * 0.15); // 15% commission

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: studentEmail,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Achat de cours",
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

---

## 7. IA & Machine Learning

### Claude Integration Architecture

```tsx
// lib/claude.ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// System prompts par contexte
const SYSTEM_PROMPTS = {
  tutor: `Tu es un tuteur IA pour Kursus, une plateforme educative francaise.
Tu aides les eleves du CP a la Terminale.

Regles pedagogiques:
1. Utilise l'approche socratique - guide avec des questions
2. Ne donne JAMAIS directement la reponse complete
3. Encourage et motive l'eleve
4. Adapte ton langage au niveau scolaire
5. Propose des exemples concrets du quotidien
6. Si l'eleve est bloque depuis 3 echanges, donne un indice plus direct
7. Felicite les progres, meme petits`,

  quizGenerator: `Tu es un generateur de quiz pour une plateforme educative francaise.
Tu crees des questions adaptees au programme scolaire francais.

Regles:
1. Questions claires et sans ambiguite
2. 4 options de reponse (A, B, C, D)
3. Une seule reponse correcte
4. Explication pedagogique pour chaque reponse
5. Niveau de difficulte adapte au niveau scolaire`,

  exerciseGenerator: `Tu es un generateur d'exercices pour Kursus.
Tu crees des exercices varies et engageants.

Types d'exercices:
- QCM (questions a choix multiples)
- Texte a trous
- Association (matching)
- Questions ouvertes

Chaque exercice doit avoir:
- Un enonce clair
- La reponse correcte
- Une explication
- Un indice optionnel`,
};

// AI Tutor
export async function askTutor(
  message: string,
  lessonContext: string,
  history: { role: "user" | "assistant"; content: string }[],
  studentLevel: string,
) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: `${SYSTEM_PROMPTS.tutor}

Contexte de la lecon:
${lessonContext}

Niveau de l'eleve: ${studentLevel}`,
    messages: [...history, { role: "user", content: message }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

// Quiz Generator
export async function generateQuiz(
  topic: string,
  level: string,
  questionCount: number = 5,
) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    system: SYSTEM_PROMPTS.quizGenerator,
    messages: [
      {
        role: "user",
        content: `Genere un quiz de ${questionCount} questions sur le sujet "${topic}" pour le niveau ${level}.

Format JSON attendu:
{
  "questions": [
    {
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctIndex": 0,
      "explanation": "...",
      "difficulty": "facile|moyen|difficile"
    }
  ]
}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : { questions: [] };
}
```

---

## 8. Performance

### Caching Strategy

```tsx
// Data Caching avec unstable_cache
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// Cache courses list for 1 hour
export const getCourses = unstable_cache(
  async (level?: string, subject?: string) => {
    return prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        ...(level && { level: level as any }),
        ...(subject && { subject: subject as any }),
      },
      include: {
        author: { select: { name: true, image: true } },
      },
      orderBy: { enrollmentCount: "desc" },
    });
  },
  ["courses-list"],
  {
    tags: ["courses"],
    revalidate: 3600, // 1 hour
  },
);

// Cache single course for 30 min
export const getCourseBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.course.findUnique({
      where: { slug },
      include: {
        author: true,
        chapters: {
          include: { lessons: true },
          orderBy: { order: "asc" },
        },
      },
    });
  },
  ["course-detail"],
  {
    tags: ["courses", "course-detail"],
    revalidate: 1800, // 30 min
  },
);
```

### Image Optimization

```tsx
// next.config.ts
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};
```

### Core Web Vitals Targets

| Metric   | Target  | Strategy                            |
| -------- | ------- | ----------------------------------- |
| **LCP**  | < 2.5s  | ISR, Image priority, Font preload   |
| **INP**  | < 200ms | Code splitting, Defer JS            |
| **CLS**  | < 0.1   | Size attributes, font-display: swap |
| **TTFB** | < 800ms | Edge functions, ISR                 |

---

## 9. Securite

### Security Headers

```tsx
// next.config.ts
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self';
      connect-src 'self' https://api.stripe.com https://api.anthropic.com;
      frame-src https://js.stripe.com;
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
```

### Rate Limiting

```tsx
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 req/min
  analytics: true,
});

export async function middleware(request: NextRequest) {
  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.ip ?? "127.0.0.1";
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
```

---

## 10. Infrastructure

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL (Production)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │ Edge        │     │ Serverless  │     │ Static      │       │
│  │ Functions   │     │ Functions   │     │ Assets      │       │
│  │ (middleware)│     │ (API routes)│     │ (ISR/SSG)   │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                 │
│  Global CDN - 30+ Edge locations                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA SERVICES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐                   │
│  │   Supabase      │     │   Upstash       │                   │
│  │   PostgreSQL    │     │   Redis         │                   │
│  │   + Storage     │     │   (Cache)       │                   │
│  └─────────────────┘     └─────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="https://kursus.fr"
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Storage (Supabase)
SUPABASE_URL="..."
SUPABASE_ANON_KEY="..."
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test --coverage
      - run: pnpm build
```

---

_Architecture Document v1.0_
_Kursus - Janvier 2026_
