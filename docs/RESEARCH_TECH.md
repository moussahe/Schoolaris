# Research Tech - Tendances LMS/EdTech 2025

> Recherche effectuee le 8 janvier 2026 pour Schoolaris - Plateforme EdTech francaise

---

## Table des matieres

1. [Next.js 15/16](#1-nextjs-1516)
2. [UI Libraries 2024-2025](#2-ui-libraries-2024-2025)
3. [Animations](#3-animations)
4. [AI Features pour EdTech](#4-ai-features-pour-edtech)
5. [Video Streaming](#5-video-streaming)
6. [Performance](#6-performance)

---

## 1. Next.js 15/16

### Server Components Patterns

**Principe fondamental** : Utiliser les Server Components par defaut, ne passer en Client Components que si necessaire (interactivite).

#### Pattern de Composition (Children Slot)

```tsx
// modal-wrapper.tsx (Client)
"use client";
import { useState } from "react";

export function ModalWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Ouvrir</button>
      {isOpen && (
        <div className="modal">
          {children} {/* Server Component rendu cote serveur */}
        </div>
      )}
    </>
  );
}

// page.tsx (Server)
import { ModalWrapper } from "./modal-wrapper";
import { CourseDetails } from "./course-details"; // Server Component

export default function Page() {
  return (
    <ModalWrapper>
      <CourseDetails courseId="123" /> {/* Fetch data on server */}
    </ModalWrapper>
  );
}
```

#### Server Actions pour les Mutations

```tsx
// actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function enrollStudent(formData: FormData) {
  const courseId = formData.get("courseId") as string;
  const studentId = formData.get("studentId") as string;

  await prisma.enrollment.create({
    data: { courseId, studentId },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
```

### Streaming & Suspense

**Deux approches principales** :

#### 1. Streaming au niveau de la page (`loading.tsx`)

```tsx
// app/courses/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}
```

#### 2. Streaming au niveau des composants (`<Suspense>`)

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import { CourseProgress } from "@/components/course-progress";
import { RecentActivity } from "@/components/recent-activity";
import { Recommendations } from "@/components/recommendations";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Charge independamment - premier termine, premier affiche */}
      <Suspense fallback={<ProgressSkeleton />}>
        <CourseProgress />
      </Suspense>

      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />
      </Suspense>
    </div>
  );
}
```

### App Router Best Practices

```
src/app/
├── (auth)/                    # Route group - pas d'impact URL
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx             # Layout partage
│   ├── cours/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── loading.tsx
│   └── progression/page.tsx
├── (marketing)/
│   ├── page.tsx               # Homepage
│   └── pricing/page.tsx
├── api/
│   └── webhooks/
│       └── stripe/route.ts
├── layout.tsx                 # Root layout
└── error.tsx                  # Error boundary global
```

**Sources** :

- [Next.js Server Components Guide](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js Streaming Handbook](https://www.freecodecamp.org/news/the-nextjs-15-streaming-handbook/)
- [Next.js Best Practices 2025](https://www.raftlabs.com/blog/building-with-next-js-best-practices-and-benefits-for-performance-first-teams/)

---

## 2. UI Libraries 2024-2025

### shadcn/ui - Nouveautes 2025

#### Mise a jour vers Tailwind v4 + OKLCH

```tsx
// Configuration moderne shadcn/ui
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york", // Nouveau style par defaut
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  }
}
```

#### Calendar Component (React DayPicker v9)

```tsx
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export function CourseDatePicker() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <Calendar
      mode="range"
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
      showOutsideDays
      classNames={{
        day_selected: "bg-primary text-primary-foreground",
        day_range_middle: "bg-accent",
      }}
    />
  );
}
```

#### Nouveaux Composants 2025

```tsx
// Breadcrumb
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function CourseNavigation() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/cours">Cours</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Mathematiques CM2</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Input OTP
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function VerificationCode() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
```

### Tailwind CSS v4 - Nouveautes

#### Configuration CSS-First

```css
/* globals.css - Plus besoin de tailwind.config.js */
@import "tailwindcss";

@theme {
  --color-primary-50: oklch(0.97 0.01 250);
  --color-primary-100: oklch(0.93 0.03 250);
  --color-primary-500: oklch(0.55 0.2 250);
  --color-primary-600: oklch(0.48 0.22 250);

  --font-family-display: "Cal Sans", system-ui, sans-serif;
  --font-family-body: "Inter", system-ui, sans-serif;

  --animate-fade-in: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Nouvelles Fonctionnalites

```tsx
// Container Queries natif
<div className="@container">
  <div className="@lg:grid-cols-2 @xl:grid-cols-3 grid gap-4">
    {courses.map(course => (
      <CourseCard key={course.id} course={course} />
    ))}
  </div>
</div>

// Valeurs dynamiques sans crochets (Tailwind v4)
<div className="h-100 w-200 grid-cols-15">
  {/* h-[100px] -> h-100, grid-cols-[15] -> grid-cols-15 */}
</div>

// Text shadows (v4.1)
<h1 className="text-shadow-lg text-shadow-black/25">
  Bienvenue sur Schoolaris
</h1>

// Proprietes logiques pour RTL
<div className="ms-4 me-8 ps-2 pe-4">
  {/* margin-inline-start, margin-inline-end */}
</div>
```

**Sources** :

- [shadcn/ui Changelog](https://ui.shadcn.com/docs/changelog)
- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- [shadcn/ui Ecosystem 2025](https://www.devkit.best/blog/mdx/shadcn-ui-ecosystem-complete-guide-2025)

---

## 3. Animations

### Framer Motion (Motion) - Patterns 2025

> Note: Framer Motion a ete renomme "Motion" en 2025

#### Installation

```bash
pnpm add motion
```

#### Animations de Base

```tsx
"use client";
import { motion } from "motion/react";

export function CourseCard({ course }: { course: Course }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="rounded-xl bg-card p-6 shadow-lg"
    >
      <h3>{course.title}</h3>
      <p>{course.description}</p>
    </motion.div>
  );
}
```

#### Variants pour Orchestration

```tsx
"use client";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function CourseList({ courses }: { courses: Course[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4"
    >
      {courses.map((course) => (
        <motion.div key={course.id} variants={itemVariants}>
          <CourseCard course={course} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

#### AnimatePresence pour les Sorties

```tsx
"use client";
import { motion, AnimatePresence } from "motion/react";

export function NotificationList({ notifications }: Props) {
  return (
    <AnimatePresence mode="popLayout">
      {notifications.map((notif) => (
        <motion.div
          key={notif.id}
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, x: 100 }}
          transition={{ type: "spring" }}
        >
          <Notification {...notif} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

#### Scroll Animations

```tsx
"use client";
import { motion, useScroll, useTransform } from "motion/react";

export function HeroSection() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="sticky top-0 h-screen flex items-center justify-center"
    >
      <h1 className="text-6xl font-bold">Apprenez avec Schoolaris</h1>
    </motion.div>
  );
}
```

### View Transitions API (Next.js)

#### Configuration

```js
// next.config.ts
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
```

#### Utilisation avec `next-view-transitions`

```bash
pnpm add next-view-transitions
```

```tsx
// app/layout.tsx
import { ViewTransitions } from "next-view-transitions";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="fr">
        <body>{children}</body>
      </html>
    </ViewTransitions>
  );
}

// components/course-card.tsx
import { Link } from "next-view-transitions";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/cours/${course.id}`}>
      <div className="course-card">
        <img
          src={course.thumbnail}
          alt={course.title}
          style={{ viewTransitionName: `course-image-${course.id}` }}
        />
        <h3 style={{ viewTransitionName: `course-title-${course.id}` }}>
          {course.title}
        </h3>
      </div>
    </Link>
  );
}
```

### GSAP avec React

> Note: GSAP est maintenant gratuit grace au sponsoring de Webflow!

```bash
pnpm add gsap @gsap/react
```

```tsx
"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LessonTimeline({ lessons }: { lessons: Lesson[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".lesson-item");

      items.forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          x: index % 2 === 0 ? -100 : 100,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      {lessons.map((lesson) => (
        <div key={lesson.id} className="lesson-item">
          {/* ... */}
        </div>
      ))}
    </div>
  );
}
```

### Lottie Animations

```bash
pnpm add lottie-react
```

```tsx
"use client";
import Lottie from "lottie-react";
import completionAnimation from "@/animations/completion.json";

export function LessonComplete() {
  return (
    <div className="flex flex-col items-center">
      <Lottie
        animationData={completionAnimation}
        loop={false}
        style={{ width: 200, height: 200 }}
        onComplete={() => console.log("Animation terminee")}
      />
      <h2>Felicitations!</h2>
    </div>
  );
}
```

**Sources** :

- [Motion Documentation](https://www.framer.com/motion/)
- [Framer Motion + Tailwind 2025](https://dev.to/manukumar07/framer-motion-tailwind-the-2025-animation-stack-1801)
- [View Transitions API Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition)
- [GSAP React](https://gsap.com/resources/React/)

---

## 4. AI Features pour EdTech

### Claude for Education (Anthropic)

Anthropic propose **Claude for Education** specifiquement pour les etablissements d'enseignement avec :

- **Learning Mode** : Approche socratique - guide avec des questions au lieu de donner les reponses directement
- **Integration Canvas LMS** : Connection native avec Canvas LTI
- **200K context window** : Analyse de documents academiques complexes
- **Confidentialite** : Conversations privees par defaut, exclues de l'entrainement IA

#### Integration Claude API

```tsx
// lib/claude.ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateQuiz(
  lessonContent: string,
  difficulty: "easy" | "medium" | "hard",
) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    system: `Tu es un assistant pedagogique pour une plateforme educative francaise.
Tu generes des quiz adaptes au niveau scolaire francais (CP-Terminale).
Difficulte demandee: ${difficulty}`,
    messages: [
      {
        role: "user",
        content: `Genere un quiz de 5 questions basees sur ce contenu de lecon:

${lessonContent}

Format de reponse JSON:
{
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "..."
    }
  ]
}`,
      },
    ],
  });

  return JSON.parse(
    response.content[0].type === "text" ? response.content[0].text : "",
  );
}
```

### AI Tutoring Assistant

```tsx
// app/api/tutor/route.ts
import { anthropic } from "@/lib/claude";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Non autorise" }, { status: 401 });
  }

  const { message, lessonId, conversationHistory } = await req.json();

  // Recuperer le contexte de la lecon
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: true } } },
  });

  const systemPrompt = `Tu es un tuteur IA pour Schoolaris, une plateforme educative francaise.
Tu aides un eleve sur la lecon "${lesson?.title}" du cours "${lesson?.chapter.course.title}".

Regles pedagogiques:
1. Utilise l'approche socratique - guide avec des questions
2. Ne donne jamais directement la reponse complete
3. Encourage et motive l'eleve
4. Adapte ton langage au niveau scolaire
5. Propose des exemples concrets du quotidien
6. Si l'eleve est bloque depuis 3 echanges, donne un indice plus direct

Contenu de la lecon:
${lesson?.content}`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [...conversationHistory, { role: "user", content: message }],
  });

  // Sauvegarder l'echange
  await prisma.tutorConversation.create({
    data: {
      userId: session.user.id,
      lessonId,
      userMessage: message,
      assistantResponse:
        response.content[0].type === "text" ? response.content[0].text : "",
    },
  });

  return Response.json({
    response:
      response.content[0].type === "text" ? response.content[0].text : "",
  });
}
```

### Personalized Learning Paths

```tsx
// lib/ai/learning-path.ts
import { anthropic } from "@/lib/claude";
import { prisma } from "@/lib/prisma";

interface LearningPathInput {
  studentId: string;
  subjectId: string;
  currentLevel: string;
  targetLevel: string;
  quizResults: QuizResult[];
  timeAvailable: number; // heures par semaine
}

export async function generateLearningPath(input: LearningPathInput) {
  // Analyser les forces/faiblesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const result of input.quizResults) {
    if (result.score >= 80) {
      strengths.push(result.topic);
    } else if (result.score < 50) {
      weaknesses.push(result.topic);
    }
  }

  const availableCourses = await prisma.course.findMany({
    where: { subjectId: input.subjectId },
    include: { chapters: { include: { lessons: true } } },
  });

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    system: `Tu es un expert en pedagogie qui cree des parcours d'apprentissage personnalises.`,
    messages: [
      {
        role: "user",
        content: `Cree un parcours d'apprentissage personnalise:

Eleve:
- Niveau actuel: ${input.currentLevel}
- Objectif: ${input.targetLevel}
- Temps disponible: ${input.timeAvailable}h/semaine
- Points forts: ${strengths.join(", ")}
- Points a ameliorer: ${weaknesses.join(", ")}

Cours disponibles:
${JSON.stringify(availableCourses, null, 2)}

Genere un parcours JSON avec:
- Ordre des lecons recommande
- Duree estimee par etape
- Exercices de renforcement pour les faiblesses
- Jalons et objectifs intermediaires`,
      },
    ],
  });

  return JSON.parse(
    response.content[0].type === "text" ? response.content[0].text : "",
  );
}
```

### Auto-generation d'Exercices

```tsx
// lib/ai/exercise-generator.ts
export async function generateExercises(
  topic: string,
  level: SchoolLevel,
  count: number,
  types: ("qcm" | "fill-blank" | "matching" | "open")[],
) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Genere ${count} exercices sur "${topic}" pour le niveau ${level}.

Types d'exercices demandes: ${types.join(", ")}

Format JSON:
{
  "exercises": [
    {
      "type": "qcm|fill-blank|matching|open",
      "question": "...",
      "options": [...], // pour QCM
      "pairs": [...], // pour matching
      "blanks": [...], // pour fill-blank
      "answer": "...",
      "points": 1-5,
      "hint": "...",
      "explanation": "..."
    }
  ]
}`,
      },
    ],
  });

  return JSON.parse(
    response.content[0].type === "text" ? response.content[0].text : "",
  );
}
```

**Sources** :

- [Anthropic Claude for Education](https://www.anthropic.com/news/introducing-claude-for-education)
- [Advancing Claude for Education](https://www.anthropic.com/news/advancing-claude-for-education)
- [DeepTutor AI](https://github.com/HKUDS/DeepTutor)
- [AI Quiz Generation LMS 2025](https://www.paradisosolutions.com/blog/ai-quiz-generators-revolutionizing-assessments-in-lms/)

---

## 5. Video Streaming

### HLS vs DASH - Choix pour Schoolaris

| Critere         | HLS              | DASH         |
| --------------- | ---------------- | ------------ |
| Support Apple   | Natif            | Non supporte |
| Support Android | Oui              | Natif        |
| Latence         | Standard (6-30s) | Basse (2-6s) |
| Segments        | 6-10s            | 2-4s         |
| Recommandation  | Cours VOD        | Live events  |

**Recommandation pour Schoolaris** : HLS pour les cours pre-enregistres, DASH pour les sessions live.

### Video.js avec React

```bash
pnpm add video.js @types/video.js
```

```tsx
// components/video-player.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import type Player from "video.js/dist/types/player";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
  initialTime?: number;
}

export function VideoPlayer({
  src,
  poster,
  onProgress,
  onComplete,
  initialTime = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered", "vjs-16-9");
    videoRef.current.appendChild(videoElement);

    const player = videojs(videoElement, {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      poster,
      sources: [
        {
          src,
          type: src.includes(".m3u8") ? "application/x-mpegURL" : "video/mp4",
        },
      ],
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      controlBar: {
        children: [
          "playToggle",
          "volumePanel",
          "currentTimeDisplay",
          "timeDivider",
          "durationDisplay",
          "progressControl",
          "playbackRateMenuButton",
          "qualitySelector",
          "fullscreenToggle",
        ],
      },
    });

    player.ready(() => {
      setIsReady(true);
      if (initialTime > 0) {
        player.currentTime(initialTime);
      }
    });

    // Track progress every 10 seconds
    let lastReportedTime = 0;
    player.on("timeupdate", () => {
      const currentTime = player.currentTime() || 0;
      const duration = player.duration() || 0;

      if (currentTime - lastReportedTime >= 10) {
        lastReportedTime = currentTime;
        onProgress?.(currentTime, duration);
      }
    });

    player.on("ended", () => {
      onComplete?.();
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}
```

### Plyr Alternative (Plus leger)

```bash
pnpm add plyr-react
```

```tsx
"use client";

import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { usePlyr } from "plyr-react";

export function LessonPlayer({ src, onProgress }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  const { source, options } = useMemo(
    () => ({
      source: {
        type: "video" as const,
        sources: [{ src, type: "video/mp4" }],
      },
      options: {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "captions",
          "settings",
          "fullscreen",
        ],
        settings: ["captions", "quality", "speed"],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
      },
    }),
    [src],
  );

  return <Plyr ref={ref} source={source} options={options} />;
}
```

### DRM Protection

Pour proteger les videos des cours :

```tsx
// lib/video/drm.ts
import { generateSignedUrl } from "@/lib/cloudflare-stream";

interface VideoAccessParams {
  videoId: string;
  userId: string;
  expiresIn?: number; // minutes
}

export async function getSecureVideoUrl({
  videoId,
  userId,
  expiresIn = 60,
}: VideoAccessParams): Promise<string> {
  // Verifier que l'utilisateur a acces
  const hasAccess = await checkUserAccess(userId, videoId);
  if (!hasAccess) {
    throw new Error("Acces non autorise");
  }

  // Generer URL signee avec expiration
  const signedUrl = await generateSignedUrl(videoId, {
    exp: Math.floor(Date.now() / 1000) + expiresIn * 60,
    sub: userId, // Pour tracking
    restrictions: {
      ip: [], // Restriction IP optionnelle
      accessRules: [{ country: ["FR", "BE", "CH", "CA"], action: "allow" }],
    },
  });

  return signedUrl;
}
```

### Progress Tracking

```tsx
// lib/video/progress.ts
import { prisma } from "@/lib/prisma";

export async function saveVideoProgress(
  userId: string,
  lessonId: string,
  currentTime: number,
  duration: number,
) {
  const percentComplete = Math.round((currentTime / duration) * 100);

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    update: {
      watchedSeconds: currentTime,
      percentComplete,
      lastWatchedAt: new Date(),
      completed: percentComplete >= 90,
    },
    create: {
      userId,
      lessonId,
      watchedSeconds: currentTime,
      percentComplete,
      completed: false,
    },
  });
}

// Resume from last position
export async function getLastPosition(userId: string, lessonId: string) {
  const progress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: { userId, lessonId },
    },
  });

  return progress?.watchedSeconds || 0;
}
```

**Sources** :

- [HLS vs DASH Comparison](https://www.mux.com/articles/hls-vs-dash-what-s-the-difference-between-the-video-streaming-protocols)
- [Video.js React Guide](https://videojs.org/guides/react/)
- [Best React Video Libraries 2025](https://blog.croct.com/post/best-react-video-libraries)
- [DRM Video Hosting 2025](https://www.gumlet.com/learn/best-drm-video-hosting-platforms/)

---

## 6. Performance

### Image Optimization avec AVIF

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.schoolaris.fr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/**",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
  },
};

export default nextConfig;
```

```tsx
// components/course-thumbnail.tsx
import Image from "next/image";

interface CourseThumbnailProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function CourseThumbnail({
  src,
  alt,
  priority = false,
}: CourseThumbnailProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        className="object-cover transition-transform hover:scale-105"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMH/8QAIBAAAgICAgIDAAAAAAAAAAAAAQIDBAARBRIhQQYxcf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAPwC+T5uPhq9KKKzYZprVWOzIsa9QvZAxBPrQI+8YwP/2Q=="
      />
    </div>
  );
}
```

### Edge Functions (Vercel)

```tsx
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Geolocation-based content
  const country = request.geo?.country || "FR";
  response.headers.set("x-user-country", country);

  // Rate limiting header for API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("X-RateLimit-Limit", "100");
  }

  return response;
}
```

```tsx
// app/api/recommendations/route.ts
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");

  // Logic legere pour recommandations rapides
  const recommendations = await getQuickRecommendations(userId);

  return Response.json(recommendations, {
    headers: {
      "Cache-Control": "private, max-age=60",
    },
  });
}
```

### ISR et Cache Strategies

```tsx
// app/cours/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Revalider toutes les heures
export const revalidate = 3600;

// Pre-generer les cours populaires
export async function generateStaticParams() {
  const popularCourses = await prisma.course.findMany({
    where: { enrollmentCount: { gte: 100 } },
    select: { id: true },
    take: 50,
  });

  return popularCourses.map((course) => ({
    id: course.id,
  }));
}

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      chapters: {
        include: { lessons: true },
        orderBy: { order: "asc" },
      },
      author: true,
    },
  });

  if (!course) notFound();

  return <CourseContent course={course} />;
}
```

#### On-Demand Revalidation

```tsx
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { secret, path, tag } = await request.json();

  // Verifier le secret
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag);
    return Response.json({ revalidated: true, tag });
  }

  if (path) {
    revalidatePath(path);
    return Response.json({ revalidated: true, path });
  }

  return Response.json({ error: "Path or tag required" }, { status: 400 });
}

// Usage dans admin ou webhook CMS
// POST /api/revalidate { "secret": "...", "path": "/cours/abc123" }
// POST /api/revalidate { "secret": "...", "tag": "courses" }
```

#### Data Caching avec Tags

```tsx
// lib/data/courses.ts
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getCourses = unstable_cache(
  async (subjectId?: string) => {
    return prisma.course.findMany({
      where: subjectId ? { subjectId } : undefined,
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
  },
  ["courses"],
  {
    tags: ["courses"],
    revalidate: 3600, // 1 heure
  },
);

export const getCourseById = unstable_cache(
  async (id: string) => {
    return prisma.course.findUnique({
      where: { id },
      include: {
        chapters: { include: { lessons: true } },
        author: true,
      },
    });
  },
  ["course-detail"],
  {
    tags: ["courses", "course-detail"],
    revalidate: 3600,
  },
);
```

### Core Web Vitals Targets

| Metrique | Target  | Strategie                             |
| -------- | ------- | ------------------------------------- |
| LCP      | < 2.5s  | Image priority, preload fonts, ISR    |
| FID/INP  | < 200ms | Code splitting, defer non-critical JS |
| CLS      | < 0.1   | Size attributes, font-display: swap   |
| TTFB     | < 800ms | Edge functions, CDN, ISR              |

```tsx
// components/performance-image.tsx
import Image from "next/image";

// Pour les images above-the-fold
export function HeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      priority // Preload
      fetchPriority="high"
      sizes="100vw"
      quality={85}
    />
  );
}
```

**Sources** :

- [Next.js Image Optimization](https://www.debugbear.com/blog/nextjs-image-optimization)
- [Vercel Edge Functions 2025](https://vercel.com/docs/functions/runtimes/edge)
- [ISR Guide Next.js](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [Advanced Caching Strategies 2025](https://medium.com/@itsamanyadav/advanced-caching-strategies-in-next-js-2025-edition-6805939cf163)

---

## Recommandations pour Schoolaris

### Stack Recommandee

1. **Framework**: Next.js 15 avec App Router
2. **UI**: shadcn/ui + Tailwind CSS v4
3. **Animations**: Framer Motion (Motion) pour les micro-interactions
4. **Video**: Video.js avec HLS pour les cours, progress tracking custom
5. **AI**: Claude API (Anthropic) pour le tutoring et la generation de quiz
6. **Performance**: ISR + Edge Functions + AVIF images

### Quick Wins a Implementer

1. [ ] Configurer AVIF dans next.config.ts
2. [ ] Ajouter Suspense boundaries sur le dashboard
3. [ ] Implementer le progress tracking video
4. [ ] Creer un composant AI Tutor avec Claude
5. [ ] Mettre en place ISR pour les pages de cours

### Ressources Additionnelles

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Motion Examples](https://motion.dev/examples)
- [Anthropic Claude Docs](https://docs.anthropic.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
