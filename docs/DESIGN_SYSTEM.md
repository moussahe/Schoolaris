# SCHOOLARIS - Design System

> Design system moderne inspire de Linear, Stripe, Vercel et Duolingo

---

## Table des Matieres

1. [Couleurs](#1-couleurs)
2. [Typographie](#2-typographie)
3. [Spacing & Layout](#3-spacing--layout)
4. [Composants](#4-composants)
5. [Animations](#5-animations)
6. [Iconographie](#6-iconographie)
7. [Patterns UX](#7-patterns-ux)

---

## 1. Couleurs

### Palette Principale

Basee sur les recommandations de la recherche - combinant confiance (bleu), succes (vert) et energie (orange).

```css
/* globals.css - Tailwind v4 avec OKLCH */
@theme {
  /* Primary - Bleu educatif (confiance, serieux) */
  --color-primary-50: oklch(0.97 0.01 250);
  --color-primary-100: oklch(0.93 0.03 250);
  --color-primary-200: oklch(0.87 0.06 250);
  --color-primary-300: oklch(0.78 0.1 250);
  --color-primary-400: oklch(0.67 0.15 250);
  --color-primary-500: oklch(0.55 0.2 250); /* #3B82F6 */
  --color-primary-600: oklch(0.48 0.22 250); /* #2563EB */
  --color-primary-700: oklch(0.42 0.2 250);
  --color-primary-800: oklch(0.36 0.17 250);
  --color-primary-900: oklch(0.3 0.14 250);

  /* Secondary - Vert succes (progression, reussite) */
  --color-secondary-50: oklch(0.97 0.02 160);
  --color-secondary-100: oklch(0.93 0.05 160);
  --color-secondary-200: oklch(0.87 0.1 160);
  --color-secondary-300: oklch(0.78 0.14 160);
  --color-secondary-400: oklch(0.7 0.17 160);
  --color-secondary-500: oklch(0.6 0.17 160); /* #10B981 */
  --color-secondary-600: oklch(0.52 0.15 160);
  --color-secondary-700: oklch(0.45 0.13 160);
  --color-secondary-800: oklch(0.38 0.11 160);
  --color-secondary-900: oklch(0.32 0.09 160);

  /* Accent - Orange energie (action, urgence) */
  --color-accent-50: oklch(0.97 0.02 50);
  --color-accent-100: oklch(0.93 0.05 50);
  --color-accent-200: oklch(0.87 0.1 50);
  --color-accent-300: oklch(0.78 0.15 50);
  --color-accent-400: oklch(0.7 0.18 50);
  --color-accent-500: oklch(0.65 0.2 50); /* #F97316 */
  --color-accent-600: oklch(0.58 0.2 50);
  --color-accent-700: oklch(0.5 0.18 50);

  /* Neutrals - Gris modernes */
  --color-gray-50: oklch(0.98 0 0); /* #FAFAFA */
  --color-gray-100: oklch(0.96 0 0); /* #F4F4F5 */
  --color-gray-200: oklch(0.92 0 0); /* #E4E4E7 */
  --color-gray-300: oklch(0.85 0 0); /* #D4D4D8 */
  --color-gray-400: oklch(0.7 0 0); /* #A1A1AA */
  --color-gray-500: oklch(0.55 0 0); /* #71717A */
  --color-gray-600: oklch(0.45 0 0); /* #52525B */
  --color-gray-700: oklch(0.35 0 0); /* #3F3F46 */
  --color-gray-800: oklch(0.25 0 0); /* #27272A */
  --color-gray-900: oklch(0.15 0 0); /* #18181B */
  --color-gray-950: oklch(0.1 0 0); /* #09090B */
}
```

### Couleurs Semantiques

```css
@theme {
  /* Etats */
  --color-success: var(--color-secondary-500);
  --color-success-light: var(--color-secondary-100);
  --color-warning: oklch(0.8 0.18 85); /* #EAB308 */
  --color-warning-light: oklch(0.95 0.05 85);
  --color-error: oklch(0.6 0.22 25); /* #EF4444 */
  --color-error-light: oklch(0.95 0.05 25);
  --color-info: var(--color-primary-500);
  --color-info-light: var(--color-primary-100);

  /* Gamification */
  --color-xp: oklch(0.75 0.2 85); /* Or/Jaune pour XP */
  --color-streak: oklch(0.65 0.25 30); /* Orange feu pour streak */
  --color-badge-bronze: oklch(0.55 0.1 50);
  --color-badge-silver: oklch(0.7 0.02 250);
  --color-badge-gold: oklch(0.75 0.15 85);
  --color-badge-platinum: oklch(0.85 0.05 280);

  /* Matieres (couleurs par sujet) */
  --color-math: oklch(0.55 0.2 250); /* Bleu */
  --color-french: oklch(0.6 0.17 160); /* Vert */
  --color-history: oklch(0.55 0.15 50); /* Orange */
  --color-science: oklch(0.6 0.2 280); /* Violet */
  --color-english: oklch(0.6 0.15 25); /* Rouge */
  --color-geography: oklch(0.55 0.12 180); /* Teal */
}
```

### Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--color-gray-950);
    --color-foreground: var(--color-gray-50);
    --color-card: var(--color-gray-900);
    --color-card-foreground: var(--color-gray-100);
    --color-border: var(--color-gray-800);
    --color-muted: var(--color-gray-800);
    --color-muted-foreground: var(--color-gray-400);
  }
}
```

---

## 2. Typographie

### Font Stack

```css
@theme {
  /* Headings - Inter (moderne, lisible, gratuit) */
  --font-family-display:
    "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Body - System fonts pour performance */
  --font-family-body:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Mono - Pour code et chiffres */
  --font-family-mono:
    "JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace;
}
```

### Echelle Typographique

```css
@theme {
  /* Tailles (modular scale 1.25) */
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem; /* 36px */
  --text-5xl: 3rem; /* 48px */
  --text-6xl: 3.75rem; /* 60px */
  --text-7xl: 4.5rem; /* 72px */

  /* Line heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Letter spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;

  /* Font weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### Classes Typographiques

```tsx
// Usage dans les composants
const typographyClasses = {
  // Headings
  h1: "text-5xl md:text-6xl font-bold tracking-tight leading-tight",
  h2: "text-4xl md:text-5xl font-bold tracking-tight leading-tight",
  h3: "text-3xl md:text-4xl font-semibold tracking-tight leading-snug",
  h4: "text-2xl md:text-3xl font-semibold leading-snug",
  h5: "text-xl md:text-2xl font-semibold leading-snug",
  h6: "text-lg md:text-xl font-semibold leading-normal",

  // Body
  "body-lg": "text-lg leading-relaxed",
  body: "text-base leading-relaxed",
  "body-sm": "text-sm leading-normal",

  // Special
  lead: "text-xl md:text-2xl text-muted-foreground leading-relaxed",
  small: "text-xs leading-normal",
  label: "text-sm font-medium leading-none",
  caption: "text-xs text-muted-foreground",
};
```

---

## 3. Spacing & Layout

### Spacing Scale

```css
@theme {
  /* Base: 4px */
  --spacing-0: 0;
  --spacing-0.5: 0.125rem; /* 2px */
  --spacing-1: 0.25rem; /* 4px */
  --spacing-1.5: 0.375rem; /* 6px */
  --spacing-2: 0.5rem; /* 8px */
  --spacing-2.5: 0.625rem; /* 10px */
  --spacing-3: 0.75rem; /* 12px */
  --spacing-3.5: 0.875rem; /* 14px */
  --spacing-4: 1rem; /* 16px */
  --spacing-5: 1.25rem; /* 20px */
  --spacing-6: 1.5rem; /* 24px */
  --spacing-7: 1.75rem; /* 28px */
  --spacing-8: 2rem; /* 32px */
  --spacing-9: 2.25rem; /* 36px */
  --spacing-10: 2.5rem; /* 40px */
  --spacing-12: 3rem; /* 48px */
  --spacing-14: 3.5rem; /* 56px */
  --spacing-16: 4rem; /* 64px */
  --spacing-20: 5rem; /* 80px */
  --spacing-24: 6rem; /* 96px */
  --spacing-32: 8rem; /* 128px */
}
```

### Breakpoints

```css
@theme {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Container

```tsx
// Container responsive
<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
  {children}
</div>

// Grid system
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Border Radius

```css
@theme {
  --radius-none: 0;
  --radius-sm: 0.25rem; /* 4px */
  --radius-md: 0.375rem; /* 6px */
  --radius-lg: 0.5rem; /* 8px */
  --radius-xl: 0.75rem; /* 12px */
  --radius-2xl: 1rem; /* 16px */
  --radius-3xl: 1.5rem; /* 24px */
  --radius-full: 9999px;
}
```

### Shadows

```css
@theme {
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg:
    0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl:
    0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  /* Colored shadows for cards */
  --shadow-primary: 0 10px 40px -10px rgb(59 130 246 / 0.3);
  --shadow-success: 0 10px 40px -10px rgb(16 185 129 / 0.3);
  --shadow-accent: 0 10px 40px -10px rgb(249 115 22 / 0.3);
}
```

---

## 4. Composants

### Boutons

```tsx
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Actions principales
        primary:
          "bg-primary-500 text-white hover:bg-primary-600 active:scale-[0.98] shadow-md hover:shadow-lg focus-visible:ring-primary-500",

        // Secondary - Actions secondaires
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-[0.98] focus-visible:ring-gray-500",

        // Ghost - Actions tertiaires
        ghost:
          "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500",

        // Outline - Alternatives
        outline:
          "border-2 border-gray-200 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500",

        // Success - Confirmations
        success:
          "bg-secondary-500 text-white hover:bg-secondary-600 active:scale-[0.98] shadow-md focus-visible:ring-secondary-500",

        // Danger - Actions destructives
        danger:
          "bg-error text-white hover:bg-red-600 active:scale-[0.98] focus-visible:ring-error",

        // Premium - Upgrade/Special
        premium:
          "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-accent active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        xl: "h-16 px-10 text-xl",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
```

### Course Card

```tsx
// components/course-card.tsx
interface CourseCardProps {
  course: Course;
  variant?: "default" | "compact" | "featured";
}

export function CourseCard({ course, variant = "default" }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border",
        "shadow-sm hover:shadow-xl transition-shadow duration-300",
        variant === "featured" && "md:col-span-2 md:row-span-2",
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Overlay badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="subject" subject={course.subject}>
            {course.subject}
          </Badge>
          <Badge variant="level">{course.level}</Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge variant="duration">
            <Clock className="h-3 w-3" />
            {course.duration}
          </Badge>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="rounded-full bg-white/90 p-4 shadow-lg">
            <Play className="h-8 w-8 text-primary-500 fill-current" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary-500 transition-colors">
          {course.title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar src={course.author.avatar} size="xs" />
          <span>{course.author.name}</span>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{course.rating}</span>
            <span className="text-muted-foreground">
              ({course.reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{course.studentCount} eleves</span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          {course.isFree ? (
            <Badge variant="success" size="lg">
              Gratuit
            </Badge>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{course.price} EUR</span>
              {course.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {course.originalPrice} EUR
                </span>
              )}
            </div>
          )}

          <Button variant="primary" size="sm">
            Voir le cours
          </Button>
        </div>
      </div>

      {/* Bestseller ribbon */}
      {course.isBestseller && (
        <div className="absolute -right-8 top-6 rotate-45 bg-accent-500 px-10 py-1 text-xs font-bold text-white shadow-md">
          Bestseller
        </div>
      )}
    </motion.div>
  );
}
```

### Progress Components

```tsx
// components/ui/progress-bar.tsx
interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "default" | "success" | "xp" | "streak";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-gray-200",
          size === "sm" && "h-2",
          size === "md" && "h-3",
          size === "lg" && "h-4",
        )}
      >
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            variant === "default" && "bg-primary-500",
            variant === "success" && "bg-secondary-500",
            variant === "xp" && "bg-gradient-to-r from-amber-400 to-amber-500",
            variant === "streak" &&
              "bg-gradient-to-r from-orange-400 to-red-500",
          )}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>
            {value} / {max}
          </span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}

// XP Badge
export function XPBadge({ xp }: { xp: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-amber-700">
      <Sparkles className="h-4 w-4" />
      <span className="font-bold">{xp.toLocaleString()}</span>
      <span className="text-xs">XP</span>
    </div>
  );
}

// Streak Badge
export function StreakBadge({ days }: { days: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-orange-700">
      <Flame className="h-4 w-4 fill-current" />
      <span className="font-bold">{days}</span>
      <span className="text-xs">jours</span>
    </div>
  );
}
```

### Input Fields

```tsx
// components/ui/input.tsx
const inputVariants = cva(
  "flex w-full rounded-xl border bg-background px-4 py-3 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-primary-500",
        error: "border-error focus-visible:ring-error",
        success: "border-secondary-500 focus-visible:ring-secondary-500",
      },
      size: {
        sm: "h-10 px-3 text-sm",
        md: "h-12 px-4 text-base",
        lg: "h-14 px-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);
```

---

## 5. Animations

### Transitions Standards

```css
@theme {
  /* Durations */
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;

  /* Easings */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Framer Motion Variants

```tsx
// lib/animations.ts
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Celebrations
export const confetti = {
  initial: { scale: 0, rotate: 0 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Spring configs
export const springConfig = {
  default: { type: "spring", stiffness: 300, damping: 30 },
  bouncy: { type: "spring", stiffness: 400, damping: 20 },
  stiff: { type: "spring", stiffness: 500, damping: 40 },
  gentle: { type: "spring", stiffness: 200, damping: 25 },
};
```

### CSS Animations

```css
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgb(59 130 246 / 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgb(59 130 246 / 0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
.animate-shake {
  animation: shake 0.5s ease-in-out;
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
```

---

## 6. Iconographie

### Icon Library: Lucide React

```tsx
// Installation: pnpm add lucide-react

// Usage standard
import { Home, BookOpen, Play, Star, Check, X } from "lucide-react";

// Tailles standards
const iconSizes = {
  xs: "h-3 w-3", // 12px
  sm: "h-4 w-4", // 16px
  md: "h-5 w-5", // 20px
  lg: "h-6 w-6", // 24px
  xl: "h-8 w-8", // 32px
  "2xl": "h-10 w-10", // 40px
};
```

### Icons par Contexte

```tsx
// Navigation
import {
  Home,
  BookOpen,
  GraduationCap,
  User,
  Settings,
  LogOut,
} from "lucide-react";

// Cours
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Maximize,
} from "lucide-react";

// Progression
import { Trophy, Flame, Star, Target, TrendingUp, Award } from "lucide-react";

// Actions
import { Plus, Minus, Edit, Trash, Download, Share, Heart } from "lucide-react";

// Etats
import { Check, X, AlertCircle, Info, HelpCircle, Loader2 } from "lucide-react";
```

---

## 7. Patterns UX

### Hero Section

```tsx
export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary-200/30 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-secondary-200/30 blur-3xl" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="new" className="mb-4">
              Nouveau: Tuteur IA 24/7
            </Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              La reussite scolaire,{" "}
              <span className="text-primary-500">simplifiee.</span>
            </h1>

            <p className="mt-6 text-xl text-muted-foreground max-w-lg">
              Des cours de qualite du CP a la Terminale. Un achat unique, un
              acces a vie.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="xl" className="shadow-primary">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl">
                <Play className="mr-2 h-5 w-5" />
                Voir la demo
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center gap-4">
              <AvatarGroup users={recentUsers} />
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Rejoignez <strong>10,000+</strong> familles
                </p>
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Floating cards animation */}
            <div className="relative">
              <Image
                src="/hero-dashboard.png"
                alt="Dashboard Schoolaris"
                width={800}
                height={600}
                className="rounded-2xl shadow-2xl"
                priority
              />

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6"
              >
                <XPBadge xp={1250} />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-4 -left-4"
              >
                <StreakBadge days={12} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

### Onboarding Flow

```tsx
export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const steps = [
    { id: "role", title: "Qui etes-vous?", component: RoleSelection },
    { id: "level", title: "Quel niveau?", component: LevelSelection },
    { id: "subjects", title: "Quelles matieres?", component: SubjectSelection },
    { id: "goals", title: "Vos objectifs?", component: GoalsSelection },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      <div className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Etape {step + 1} sur {steps.length}
            </span>
            <Button variant="ghost" size="sm">
              Passer
            </Button>
          </div>
          <ProgressBar value={((step + 1) / steps.length) * 100} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-24 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="container max-w-2xl"
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              {steps[step].title}
            </h2>
            {React.createElement(steps[step].component, {
              onNext: () => setStep((s) => s + 1),
              onBack: () => setStep((s) => s - 1),
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-background border-t">
        <div className="container py-4 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button onClick={() => setStep((s) => s + 1)}>
            {step === steps.length - 1 ? "Terminer" : "Continuer"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## Implementation Notes

### Fichiers a Creer

1. `src/styles/globals.css` - Variables CSS et theme
2. `src/components/ui/` - Composants shadcn customises
3. `src/lib/animations.ts` - Variants Framer Motion
4. `src/lib/cn.ts` - Utility pour class merging

### Dependencies

```bash
pnpm add class-variance-authority clsx tailwind-merge
pnpm add framer-motion lucide-react
pnpm add @radix-ui/react-avatar @radix-ui/react-progress
```

---

_Design System Schoolaris v1.0_
_Cree le 08 Janvier 2026_
