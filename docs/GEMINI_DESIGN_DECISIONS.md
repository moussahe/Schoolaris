# Kursus Design System by Gemini

## Phase 1: Creative Vision

### 1. The Core Emotion: "Clarte et Confiance" (Clarity and Confidence)

When a user lands on Kursus, they should feel an immediate sense of calm and clarity. The journey of education can be overwhelming. Our design will be a breath of fresh air. It tells them: "You are in the right place. It will be easy to find what you need. You can trust the quality here." This feeling of **confidence**--in themselves and in our platform--is the goal.

### 2. The Unique Identity: The Curated Educational Atelier

Unlike the sprawling, impersonal "supermarkets" of courses, Kursus is an **Atelier**. It's a curated workshop where passionate experts (our teachers) meet dedicated learners. We don't just sell courses; we facilitate connections. Our uniqueness comes from this curation and the human element.

**Our Visual Personality:**

- **Chaleureux (Warm):** Welcoming and human. We use soft textures, authentic imagery, and a warm color palette to build trust.
- **Elegant (Elegant):** Clean, spacious, and sophisticated. We respect our users' intelligence with a refined aesthetic.
- **Stimulant (Engaging):** Purposeful and clear. The design encourages discovery and action without being loud or distracting.

---

## 3. The Visual System

### Color Palette

The palette is inspired by a classic Parisian apartment: deep, intelligent blues, warm wooden floors, and a splash of artistic color.

| Name                         | Hex       | Usage                                     |
| ---------------------------- | --------- | ----------------------------------------- |
| **Primary (Le Bleu Minuit)** | `#0B2A4C` | Headlines, primary buttons, core branding |
| **Secondary (L'Ocre Dore)**  | `#E8A336` | Key CTAs, highlights, accents             |
| **Accent - Sage Green**      | `#A2B8A6` | Success, confirmation, positive states    |
| **Accent - Soft Coral**      | `#F2A490` | Notifications, gentle attention           |
| **Background (Chalk White)** | `#FDFDFD` | Main background                           |
| **Surface (Pearl Gray)**     | `#F4F5F7` | Cards, sidebars, sections                 |
| **Text (Deep Black)**        | `#1A1A1A` | Body text                                 |
| **Borders (Slate Gray)**     | `#6B7280` | Borders, icons                            |

### Typography

| Element  | Font        | Weight | Size |
| -------- | ----------- | ------ | ---- |
| H1       | Lora        | 700    | 48px |
| H2       | Lora        | 700    | 36px |
| H3       | Lora        | 600    | 24px |
| Body     | Nunito Sans | 400    | 16px |
| Small/UI | Nunito Sans | 400    | 14px |
| Buttons  | Nunito Sans | 700    | 16px |

### Spacing Philosophy: "Let it Breathe"

8px grid system. All spacing multiples of 8 (16px, 24px, 32px, 48px).

### Corner Radius Strategy: "Subtle Softness"

| Element                  | Radius |
| ------------------------ | ------ |
| Cards & Large Containers | 12px   |
| Buttons                  | 8px    |
| Inputs & Tags            | 6px    |

### Shadow Style: "Soft Depth"

```css
/* Standard Card Shadow */
box-shadow:
  0px 4px 15px rgba(0, 0, 0, 0.05),
  0px 1px 3px rgba(0, 0, 0, 0.06);

/* Hover/Active Shadow */
box-shadow:
  0px 8px 25px rgba(0, 0, 0, 0.08),
  0px 2px 6px rgba(0, 0, 0, 0.08);
transform: translateY(-2px);
```

### Animation Principles: "Purposeful & Fluid"

- **Timing:** `cubic-bezier(0.4, 0, 0.2, 1)` over 200-300ms
- **Properties:** Animate `transform` and `opacity` for performance
- **Application:** Gentle fades, smooth hover transitions, subtle micro-interactions

### Imagery Direction: "Authentic Connections"

**No generic stock photos.**

- **Style:** Warm, natural light. Candid, not staged.
- **Teachers:** Passionate, approachable, in their element
- **Learners:** Moments of focus or discovery
- **Environments:** Clean, inspiring learning spaces
- **Illustrations:** Simple, elegant line-art with accent colors

---

## Component Designs

(To be filled as Gemini provides component-specific designs)
