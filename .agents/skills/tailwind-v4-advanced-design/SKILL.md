---
name: tailwind-v4-advanced-design
description: >-
  Use when building, refactoring, or optimizing UI components and design systems
  with Tailwind CSS v4 in Next.js 15 (React 19) projects. Trigger when configuring
  CSS-first design tokens with @theme, implementing advanced visual effects
  (glassmorphism, glow, neon, custom masks, reflections, 3D transforms), setting up
  container queries, crafting fluid typography with clamp(), engineering class-based
  or system-preference dark mode, building RTL-first Persian layouts with Vazirmatn,
  or integrating Framer Motion / Motion micro-interactions with accessible motion-safe tokens.
---

# Advanced Tailwind CSS v4 Techniques & Design System Creation

A complete, production-grade guide for building modern, scalable design systems and high-fidelity user interfaces using **Tailwind CSS v4**, **Next.js 15 App Router**, **React 19**, and **Framer Motion / Motion**, optimized specifically for Persian (RTL) web applications.

---

## 1. Tailwind CSS v4 Specifics & Architecture

Tailwind CSS v4 is a ground-up rewrite powered by Lightning CSS. The configuration model has moved completely from JavaScript (`tailwind.config.js`) to pure CSS.

### 1.1 New Import Syntax & CSS-First Configuration

Replace all legacy `@tailwind base; @tailwind components; @tailwind utilities;` directives with a single import statement:

```css
/* app/globals.css */
@import "tailwindcss";
```

There is **no `tailwind.config.js` or `tailwind.config.ts`**. All theme overrides, plugin replacements, variants, and custom utilities are defined directly within your stylesheet.

```
Legacy (v3)                     Tailwind v4 (CSS-First)
─────────────────────────────── ──────────────────────────────────────────────────────────
tailwind.config.js              → @theme { --color-*: ...; --font-*: ...; }
plugin(({ addUtilities }))     → @utility util-name { ... }
plugin(({ addVariant }))       → @custom-variant variant-name (&:where(...))
@tailwind base/comp/util        → @import "tailwindcss";
@tailwindcss/container-queries  → Built-in natively (@container, @sm, @md)
```

### 1.2 The `@theme` Directive & Design Token Definition

The `@theme` directive registers design tokens directly into Tailwind's engine. Every token defined in `@theme` becomes a utility class (e.g. `--color-brand-500` generates `bg-brand-500`, `text-brand-500`, `border-brand-500`, etc.).

```css
@theme {
  /* Fonts */
  --font-sans: "Vazirmatn", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Base Spacing Unit (4px Grid Quantization) */
  --spacing: 0.25rem;

  /* Border Radii */
  --radius-xs: 0.25rem;   /* 4px */
  --radius-sm: 0.375rem;  /* 6px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-3xl: 2rem;     /* 32px */
  --radius-full: 9999px;

  /* Elevation Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-glow-emerald: 0 0 25px -4px rgba(0, 187, 127, 0.45);
  --shadow-glow-amber: 0 0 25px -4px rgba(249, 156, 0, 0.45);

  /* Animation Presets */
  --animate-floating: floating 2.5s ease-in-out infinite;
  --animate-pulse-glow: pulse-glow 2s ease-in-out infinite;
  --animate-shimmer: shimmer 2s linear infinite;
  --animate-spin-slow: spin 14s linear infinite;
}
```

> [!IMPORTANT]
> To extend default Tailwind tokens without overwriting them, define new variable names. If you use `--color-*: initial;`, you purge default colors. Defining explicit variables like `--color-emerald-500: #00bb7f;` overrides or extends that specific value.

### 1.3 Custom Variants with `@custom-variant`

In Tailwind v4, register custom selectors, data-state attributes, or RTL/Dark hooks with `@custom-variant`:

```css
/* Class-based Dark Mode */
@custom-variant dark (&:where(.dark, .dark *));

/* RTL and LTR Selectors */
@custom-variant rtl (&:where([dir="rtl"], [dir="rtl"] *));
@custom-variant ltr (&:where([dir="ltr"], [dir="ltr"] *));

/* State Variants (Radix UI / Headless UI / Base UI) */
@custom-variant state-open (&:where([data-state="open"]));
@custom-variant state-closed (&:where([data-state="closed"]));
@custom-variant state-active (&:where([data-state="active"]));
```

Usage in JSX:
```tsx
<div className="bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 rtl:text-right ltr:text-left">
  <button className="state-open:bg-emerald-500 state-closed:bg-slate-200">
    وضعیت منو
  </button>
</div>
```

### 1.4 Custom Utilities with `@utility`

The `@utility` directive creates atomic, responsive, variant-aware utility classes without writing manual media query variations:

```css
@utility tab-4 {
  tab-size: 4;
}

@utility text-stroke-thin {
  -webkit-text-stroke: 1px currentColor;
}

@utility mask-radial-fade {
  mask-image: radial-gradient(circle at center, black 60%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at center, black 60%, transparent 100%);
}

@utility mask-linear-fade-b {
  mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
}

@utility hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

Usage:
```tsx
<div className="mask-linear-fade-b hide-scrollbar overflow-x-auto">
  {/* Content gracefully faded at the bottom and without scrollbars */}
</div>
```

### 1.5 Built-in Container Queries

No external plugin is needed in v4. Mark any element as a container query context using `@container` and style descendants with `@xs:`, `@sm:`, `@md:`, `@lg:`, `@xl:`, or arbitrary thresholds `@min-[...]`:

```tsx
<section className="@container">
  <div className="flex flex-col @sm:flex-row @sm:items-center @lg:grid @lg:grid-cols-4 gap-4">
    <div className="w-full @min-[400px]:w-auto font-bold text-sm @md:text-base">
      کارت سازگار با عرض کانتینر
    </div>
  </div>
</section>
```

### 1.6 Native 3D Transforms

Tailwind v4 features first-class 3D transform utilities:

```tsx
<div className="perspective-1000">
  <div className="transform-3d transition-transform duration-500 hover:rotate-y-180 hover:rotate-x-12">
    <div className="backface-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl">
      روی کارت ۳ بعدی
    </div>
    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-emerald-600 text-white p-6 shadow-xl flex items-center justify-center">
      پشت کارت ۳ بعدی
    </div>
  </div>
</div>
```

---

## 2. Design System Architecture

A bulletproof design system separates **primitive tokens** (raw hex values and units) from **semantic tokens** (roles like background, foreground, surface, border, and accent).

```
┌─────────────────────────────────────────────────────────────┐
│                 Primitive Tokens (@theme)                   │
│   --color-emerald-500, --color-zinc-900, --radius-2xl       │
└──────────────────────────────┬──────────────────────────────┘
                               │ maps to
┌──────────────────────────────▼──────────────────────────────┐
│             Semantic Tokens (:root & .dark layer)           │
│   --background, --foreground, --card, --border, --accent    │
└──────────────────────────────┬──────────────────────────────┘
                               │ consumed by
┌──────────────────────────────▼──────────────────────────────┐
│              Components & Utility Classes                   │
│   bg-[var(--card)] text-[var(--foreground)] border-...      │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Semantic Color System

In `@layer base`, map semantic CSS variables to light and dark modes:

```css
@layer base {
  :root {
    /* Semantic Surfaces (Slate Baseline for Light Mode) */
    --background: #f8fafc;        /* slate-50 */
    --foreground: #1d293d;        /* slate-800 */
    --card: #ffffff;
    --card-foreground: #1d293d;   /* slate-800 */
    --card-border: #e2e8f0;       /* slate-200 */
    --popover: #ffffff;
    --popover-foreground: #1d293d;

    /* Semantic Primary & Accents */
    --primary: #00bb7f;           /* emerald-500 */
    --primary-hover: #009767;     /* emerald-600 */
    --primary-foreground: #ffffff;
    --secondary: #00baa7;         /* teal-500 */
    --secondary-foreground: #ffffff;
    --accent: #ecfdf5;            /* emerald-50 */
    --accent-foreground: #007956; /* emerald-700 */

    /* Neutrals & Muted */
    --muted: #f1f5f9;             /* slate-100 */
    --muted-foreground: #62748e;  /* slate-500 */
    --border: #e2e8f0;            /* slate-200 */
    --ring: #00d294;              /* emerald-400 */

    /* Functional States */
    --destructive: #fb2c36;       /* red-500 */
    --destructive-foreground: #ffffff;
    --warning: #f99c00;           /* amber-500 */
    --warning-foreground: #ffffff;
    --success: #00c758;           /* green-500 */
    --success-foreground: #ffffff;
  }

  .dark {
    /* Semantic Surfaces (Zinc Baseline for Dark Mode) */
    --background: #09090b;        /* zinc-950 */
    --foreground: #f4f4f5;        /* zinc-100 */
    --card: #18181b;              /* zinc-900 */
    --card-foreground: #f4f4f5;   /* zinc-100 */
    --card-border: #27272a;       /* zinc-800 */
    --popover: #18181b;
    --popover-foreground: #f4f4f5;

    /* Semantic Primary & Accents in Dark */
    --primary: #00bb7f;           /* emerald-500 */
    --primary-hover: #00d294;     /* emerald-400 */
    --primary-foreground: #ffffff;
    --secondary: #00baa7;
    --secondary-foreground: #ffffff;
    --accent: #005f46;            /* emerald-800 */
    --accent-foreground: #a4f4cf; /* emerald-200 */

    /* Neutrals & Muted in Dark */
    --muted: #27272a;             /* zinc-800 */
    --muted-foreground: #a1a1aa;  /* zinc-400 */
    --border: #27272a;            /* zinc-800 */
    --ring: #00bb7f;              /* emerald-500 */

    /* Functional States */
    --destructive: #e40014;
    --destructive-foreground: #ffffff;
    --warning: #dd7400;
    --warning-foreground: #ffffff;
    --success: #00a544;
    --success-foreground: #ffffff;
  }
}
```

### 2.2 Fluid Typography Scale using `clamp()`

For responsive headlines without excessive breakpoint prefixes (`text-xl md:text-2xl lg:text-4xl`), declare fluid sizes directly in `@theme`:

```css
@theme {
  /* Fluid Body and Heading Tokens: clamp(min, preferred, max) */
  --text-fluid-xs: clamp(0.7rem, 0.65rem + 0.25vw, 0.8rem);
  --text-fluid-sm: clamp(0.8rem, 0.75rem + 0.3vw, 0.925rem);
  --text-fluid-base: clamp(0.925rem, 0.875rem + 0.35vw, 1.05rem);
  --text-fluid-lg: clamp(1.05rem, 0.95rem + 0.5vw, 1.25rem);
  --text-fluid-xl: clamp(1.2rem, 1.05rem + 0.75vw, 1.5rem);
  --text-fluid-2xl: clamp(1.4rem, 1.15rem + 1.1vw, 1.875rem);
  --text-fluid-3xl: clamp(1.75rem, 1.35rem + 1.8vw, 2.35rem);
  --text-fluid-4xl: clamp(2.1rem, 1.6rem + 2.4vw, 3.25rem);
  --text-fluid-hero: clamp(2.5rem, 1.8rem + 3.5vw, 4.5rem);
}
```

Usage in component:
```tsx
<h1 className="text-[length:var(--text-fluid-hero)] font-black leading-tight text-slate-900 dark:text-zinc-50">
  سوپرمارکت آنلاین مون مارکت
</h1>
<p className="text-[length:var(--text-fluid-base)] text-slate-600 dark:text-zinc-400 mt-2">
  تحویل سریع تمامی کالاهای اساسی و بهداشتی در سراسر کشور
</p>
```

### 2.3 Spacing Scale: 4px/8px Baseline Quantization

Set the core spacing unit in `@theme` to `0.25rem` (4px). Every spacing utility multiplier snaps to this base:

| Utility Class | Multiplier | Computed Size (Pixels) | Primary Semantic Use Case |
|---|---|---|---|
| `p-1` / `gap-1` | 1 | 4px | Micro padding, indicator dots |
| `p-2` / `gap-2` | 2 | 8px | Button inline icon gaps, badge padding |
| `p-3` / `gap-3` | 3 | 12px | Compact form input padding, sub-lists |
| `p-4` / `gap-4` | 4 | 16px | Standard card interior padding |
| `p-6` / `gap-6` | 6 | 24px | Section gaps, modal padding |
| `p-8` / `gap-8` | 8 | 32px | Hero padding, desktop container margins |
| `p-12` / `gap-12` | 12 | 48px | Primary grid gutters |
| `p-16` / `gap-16` | 16 | 64px | Page section vertical spacing |

### 2.4 Border Radius Hierarchy

```
┌────────────────────────────────────────────────────────────┐
│ --radius-full (9999px) : Pills, avatars, floating counters │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ --radius-3xl (24px)  : Hero banners, category cards    │ │
│ │ ┌────────────────────────────────────────────────────┐ │ │
│ │ │ --radius-2xl (16px): Core product cards, modals    │ │ │
│ │ │ ┌────────────────────────────────────────────────┐ │ │ │
│ │ │ │ --radius-lg (12px): Image slots, input fields  │ │ │ │
│ │ │ │ ┌────────────────────────────────────────────┐ │ │ │ │
│ │ │ │ │ --radius-md (8px): Inner badges, buttons   │ │ │ │ │
│ │ │ │ └────────────────────────────────────────────┘ │ │ │ │
│ │ │ └────────────────────────────────────────────────┘ │ │ │
│ │ └────────────────────────────────────────────────────┘ │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### 2.5 Semantic Z-Index Management

Declare explicit z-index scale tiers in `@theme` to prevent arbitrary numbers like `z-[99999]`:

```css
@theme {
  --z-base: 0;
  --z-card-hover: 10;
  --z-sticky-nav: 40;
  --z-bottom-bar: 50;
  --z-backdrop: 80;
  --z-drawer: 90;
  --z-modal: 100;
  --z-popover: 110;
  --z-toast: 120;
  --z-tooltip: 130;
}
```

---

## 3. Advanced Visual Effects with Tailwind v4

### 3.1 Persian & Brand Gradient Typography

Persian letterforms require clean anti-aliasing and inline clipping to prevent clipping descenders or accents:

```tsx
export function BrandGradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent font-black tracking-normal pb-1">
      {children}
    </span>
  );
}
```

### 3.2 Liquid Glassmorphism & Frosted Glass Surfaces

A realistic glass effect requires 4 layers:
1. Semi-transparent background
2. Backdrop blur & saturation boost
3. Specular inner border highlight (`inset 0 1px 1px 0 rgba(255,255,255,0.8)`)
4. Soft ambient drop shadow

```css
@layer utilities {
  .liquid-glass {
    background-color: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(14px) saturate(180%);
    -webkit-backdrop-filter: blur(14px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 
      inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.9),
      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04),
      0 12px 32px -4px rgba(0, 151, 103, 0.08);
  }

  .dark .liquid-glass {
    background-color: rgba(24, 24, 27, 0.82);
    backdrop-filter: blur(14px) saturate(180%);
    -webkit-backdrop-filter: blur(14px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 
      inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.16),
      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.5),
      0 14px 40px -4px rgba(0, 0, 0, 0.6);
  }
}
```

Usage in Tailwind classes:
```tsx
<div className="liquid-glass rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl">
  <h3 className="font-bold text-slate-800 dark:text-zinc-100">پنل شیشه‌ای تعاملی</h3>
</div>
```

Or purely with utility classes:
```tsx
<div className="backdrop-blur-xl backdrop-saturate-180 bg-white/80 dark:bg-zinc-900/80 border border-white/60 dark:border-white/10 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.8),0_10px_30px_-5px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_12px_36px_-6px_rgba(0,0,0,0.55)] rounded-3xl p-6">
  {/* Modern Pure Utility Glass */}
</div>
```

### 3.3 Dynamic Ambient Glow Effects

Create multi-layered glow around cards or action buttons:

```tsx
<button className="relative group p-0.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,187,127,0.6)]">
  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-300 -z-10" />
  <div className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 font-bold">
    خرید آنی با تخفیف
  </div>
</button>
```

### 3.4 Neon Border & Cyber Text Effects

```css
@utility neon-border-emerald {
  border-color: #00bb7f;
  box-shadow: 0 0 10px rgba(0, 187, 127, 0.4), inset 0 0 10px rgba(0, 187, 127, 0.2);
}

@utility neon-text-emerald {
  color: #5ee9b5;
  text-shadow: 0 0 8px rgba(0, 187, 127, 0.8), 0 0 20px rgba(0, 187, 127, 0.4);
}
```

Usage in component:
```tsx
<div className="neon-border-emerald rounded-2xl p-4 bg-zinc-950 text-center">
  <span className="neon-text-emerald text-lg font-black">
    تخفیف شگفت‌انگیز نیمه‌شب
  </span>
</div>
```

### 3.5 Repeating Background Patterns (Dot Grid & Diagonal Scanlines)

Inline SVG background patterns without external assets:

```css
@utility bg-grid-dots {
  background-image: radial-gradient(rgba(100, 116, 139, 0.2) 1px, transparent 1px);
  background-size: 20px 20px;
}

@utility bg-grid-lines {
  background-image: linear-gradient(to right, rgba(100, 116, 139, 0.08) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(100, 116, 139, 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
}
```

```tsx
<div className="relative w-full py-16 bg-slate-50 dark:bg-zinc-950 bg-grid-lines">
  <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-50 dark:from-zinc-950 dark:via-transparent dark:to-zinc-950 pointer-events-none" />
  <div className="relative max-w-7xl mx-auto px-4">
    {/* Grid pattern with smooth gradient vignette fade */}
  </div>
</div>
```

### 3.6 Custom Masking with `mask-image`

Create fade-out gradients for carousels and hero image blends:

```tsx
<div className="relative w-full overflow-hidden">
  {/* Horizontal Carousel with faded sides for infinite illusion */}
  <div className="flex gap-4 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4">
    {/* Product items */}
  </div>
</div>
```

### 3.7 Tactile Neumorphism (Soft UI Surfaces)

Modern neumorphism utilizes subtle dual shadows (one light highlight, one dark shadow):

```css
@utility neumorphic-inset {
  background: #f1f5f9;
  box-shadow: inset 4px 4px 8px #cbd5e1, inset -4px -4px 8px #ffffff;
}

@utility neumorphic-convex {
  background: #f1f5f9;
  box-shadow: 6px 6px 12px #d1d5db, -6px -6px 12px #ffffff;
}

.dark @utility neumorphic-inset {
  background: #18181b;
  box-shadow: inset 4px 4px 8px #09090b, inset -4px -4px 8px #27272a;
}
```

### 3.8 Specular Card Reflection & Animated Sheen Sweep

Add light sheen reflection across interactive product cards:

```tsx
export function SpecularCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 shadow-md hover:shadow-xl transition-all duration-300">
      {/* Specular Top Half Fade */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 dark:from-white/5 to-transparent pointer-events-none z-10" />

      {/* Animated Light Sheen Sweep on Hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent pointer-events-none z-20 skew-x-12" />

      <div className="relative z-30">
        {children}
      </div>
    </div>
  );
}
```

---

## 4. Responsive and Adaptive Design

### 4.1 Fluid Layout Calculations with `min()`, `max()`, `clamp()`

Combine CSS math functions with Tailwind arbitrary properties:

```tsx
{/* Dynamic container width that adapts with padding guardrails */}
<div className="w-[min(100%-2rem,78rem)] mx-auto px-4">
  {/* Card with dynamic height clamped between 280px and 420px */}
  <div className="h-[clamp(17.5rem,14rem+10vw,26.25rem)] rounded-3xl bg-white dark:bg-zinc-900">
    ...
  </div>
</div>
```

### 4.2 Breakpoints & Custom Responsive Queries

Tailwind v4 standard breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Declare custom breakpoints in `@theme` if needed:

```css
@theme {
  --breakpoint-xs: 30rem;    /* 480px (Mobile Large) */
  --breakpoint-3xl: 120rem;  /* 1920px (Ultra-wide) */
}
```

### 4.3 Container Queries in Practice

A component that renders a vertical card when placed in a sidebar, but expands into a horizontal row when placed in a main grid:

```tsx
export function AdaptiveProductSnippet({ product }: { product: any }) {
  return (
    <div className="@container w-full">
      <div className="flex flex-col @[380px]:flex-row @[380px]:items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
        <div className="w-full @[380px]:w-28 h-28 shrink-0 bg-slate-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain p-2" />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <h4 className="text-sm @[380px]:text-base font-bold text-slate-800 dark:text-zinc-100 line-clamp-2">
            {product.title}
          </h4>
          <div className="flex items-center justify-between mt-3">
            <span className="text-emerald-600 dark:text-emerald-400 font-black text-base">
              {product.price.toLocaleString('fa-IR')} تومان
            </span>
            <button className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors">
              خرید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4.4 RTL Logical Properties: Absolute Ban on Physical Left/Right

In RTL layouts (Persian, Arabic, Hebrew), **never** use physical directions (`left`, `right`, `pl`, `pr`, `ml`, `mr`, `border-l`, `border-r`, `rounded-l`, `rounded-r`). 

Always use CSS **logical properties**:

| Physical Utility (FORBIDDEN IN RTL) | Logical Replacement (MANDATORY) | CSS Property Produced |
|---|---|---|
| `pl-4` / `pr-4` | `ps-4` / `pe-4` | `padding-inline-start` / `padding-inline-end` |
| `ml-auto` / `mr-auto` | `ms-auto` / `me-auto` | `margin-inline-start` / `margin-inline-end` |
| `left-2` / `right-2` | `start-2` / `end-2` | `inset-inline-start` / `inset-inline-end` |
| `text-left` / `text-right` | `text-start` / `text-end` | `text-align: start` / `text-align: end` |
| `border-l` / `border-r` | `border-s` / `border-e` | `border-inline-start` / `border-inline-end` |
| `rounded-l-2xl` | `rounded-s-2xl` | `border-start-start-radius`, `border-end-start-radius` |
| `rounded-r-2xl` | `rounded-e-2xl` | `border-start-end-radius`, `border-end-end-radius` |

Example of clean logical styling:
```tsx
<div className="flex items-center gap-3 ps-4 pe-6 py-3 border-s-4 border-emerald-500 rounded-e-2xl bg-white dark:bg-zinc-900 shadow-sm">
  <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
    <CheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
  </div>
  <p className="text-sm font-medium text-slate-700 dark:text-zinc-200">
    سفارش شما با موفقیت در انبار ثبت و پردازش شد.
  </p>
  <button className="ms-auto text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
    بستن
  </button>
</div>
```

### 4.5 Print Stylesheet Architecture

Optimize receipts, invoices, and cart summaries for printing:

```tsx
<div className="print:text-black print:bg-white print:p-0 print:shadow-none print:border-none">
  {/* Hide non-printable UI elements */}
  <header className="print:hidden">...</header>
  <nav className="print:hidden">...</nav>

  {/* Invoice Table formatted for A4 */}
  <div className="p-8 bg-white border border-slate-200 rounded-2xl print:rounded-none print:border-b">
    <h2 className="text-xl font-bold mb-4 print:text-lg">فاکتور سفارش دیجی‌مون</h2>
    <table className="w-full text-start text-sm print:text-xs">
      <thead>
        <tr className="border-b border-slate-300">
          <th className="py-2 text-start">کالا</th>
          <th className="py-2 text-center">تعداد</th>
          <th className="py-2 text-end">قیمت نهایی</th>
        </tr>
      </thead>
      <tbody>
        {/* Table Rows */}
      </tbody>
    </table>
  </div>
</div>
```

---

## 5. Dark Mode System Architecture

### 5.1 Dual-Palette Strategy (Slate Light vs Zinc Dark)

Avoid using pure `#000000` for cards and modals in dark mode. True black flattens visual depth and eliminates shadow elevations.

- **Light Mode Neutral**: Slate (`#f8fafc` background, `#ffffff` cards, `#e2e8f0` borders)
- **Dark Mode Neutral**: Zinc / Neutral Dark (`#09090b` background, `#18181b` surface cards, `#27272a` borders)

```
Light Mode Surface Stack:
Level 0 (Canvas) : slate-50  (#f8fafc)
Level 1 (Card)   : white     (#ffffff)
Level 2 (Popover): white     (#ffffff) + shadow-lg

Dark Mode Surface Stack:
Level 0 (Canvas) : zinc-950  (#09090b)
Level 1 (Card)   : zinc-900  (#18181b) + border-zinc-800
Level 2 (Popover): zinc-800  (#27272a) + shadow-2xl
```

### 5.2 Anti-FOUC Inline Detection Script

In Next.js 15 App Router, execute a synchronous script in `<head>` inside `src/app/layout.tsx` to prevent theme flash:

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('theme_preference');
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
```

### 5.3 Theme Toggle Hook & Zustand Store

```typescript
// src/stores/useThemeStore.ts
import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  setTheme: (theme) => {
    localStorage.setItem('theme_preference', theme);
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const isDark = document.documentElement.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },
}));

function applyTheme(theme: Theme) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
```

---

## 6. Animation Utilities & Motion Tokens

### 6.1 Custom Keyframes & `@theme` Animation Binding

Define keyframes in your CSS file and bind them as tokens inside `@theme`:

```css
@keyframes floating {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.03);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@theme {
  --animate-floating: floating 2.5s ease-in-out infinite;
  --animate-pulse-glow: pulse-glow 2s ease-in-out infinite;
  --animate-shimmer: shimmer 2s linear infinite;
  --animate-spin-reverse: spin-reverse 18s linear infinite;
  --animate-spin-slow: spin 12s linear infinite;
}
```

### 6.2 Spring Physics Presets

Declare standard transition curves in `@theme`:

```css
@theme {
  --ease-spring-snappy: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring-bouncy: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Usage:
```tsx
<div className="transition-transform duration-300 ease-[var(--ease-spring-snappy)] hover:scale-105">
  دکمه با فیزیک جهش نرم
</div>
```

### 6.3 Accessibility: `motion-safe` and `motion-reduce`

Always respect user preferences for vestibular safety (WCAG 2.2.2):

```tsx
<div className="motion-safe:animate-floating motion-reduce:transform-none">
  {/* Floating banner element */}
</div>

<button className="transition-transform duration-200 motion-reduce:transition-none hover:scale-105 motion-reduce:hover:scale-100">
  کلیک کنید
</button>
```

---

## 7. Utility Patterns for Persian & RTL Sites

### 7.1 Vazirmatn Font Setup via `@fontsource` (Offline-First)

Never use Google Fonts CDNs (`fonts.googleapis.com`) in Iranian web production due to sanction IP blocking and domestic network latency. Use `@fontsource/vazirmatn`:

```bash
npm install @fontsource/vazirmatn
```

Import weights in `src/app/layout.tsx`:
```typescript
import '@fontsource/vazirmatn/300.css';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/vazirmatn/800.css';
import '@fontsource/vazirmatn/900.css';
```

In `@theme`, configure the font family and enforce Persian typography rules:

```css
@theme {
  --font-sans: "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

@layer base {
  body {
    font-family: var(--font-sans);
    /* Enable Persian stylistic alternates and ligatures */
    font-feature-settings: "rlig" 1, "calt" 1, "ss01" 1;
    letter-spacing: 0 !important;
    line-height: 1.7;
  }

  /* Persian headings need zero letter-spacing and appropriate line-height */
  h1, h2, h3, h4, h5, h6 {
    letter-spacing: 0 !important;
    line-height: 1.45;
  }
}
```

### 7.2 Persian Digits, Tabular Numbers & Currency Helpers

Persian digits look cleaner and maintain exact visual alignment in price tables when `tnum` (tabular numbers) is enabled:

```css
@utility font-persian-nums {
  font-feature-settings: "ss01" 1, "tnum" 1;
}
```

TypeScript helper for Persian formatting:
```typescript
// src/lib/persian.ts
export function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (digit) => persianDigits[Number(digit)]);
}

export function formatToman(amount: number, withUnit = true): string {
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  return withUnit ? `${formatted} تومان` : formatted;
}
```

### 7.3 Directional Spacing Pitfalls & Quick Reference

```
LTR Thinking                  RTL Reality
────────────────────────────  ────────────────────────────
left = start, right = end     right = start, left = end
pl-4 (padding-left)           ps-4 (padding-inline-start = right in RTL)
pr-4 (padding-right)          pe-4 (padding-inline-end = left in RTL)
space-x-4                     gap-4 or use flex with gap
translate-x-4 (moves right)   In RTL, +x is rightwards (physically).
                              Prefer logical layout or motion primitives!
```

---

## 8. Complete Production Component: Liquid Glass Product Card

Here is a full Next.js 15 / React 19 / Framer Motion component illustrating all principles (Tailwind v4 tokens, logical properties, glassmorphism, spring physics, container queries, and RTL Persian typography):

```tsx
// src/components/catalog/AdvancedProductCard.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Check, Star } from 'lucide-react';
import { formatToman, toPersianDigits } from '@/lib/persian';

export interface ProductItem {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  discountPercent?: number;
  rating?: number;
  reviewsCount?: number;
  isSpecial?: boolean;
}

export function AdvancedProductCard({
  product,
  onAddToCart,
}: {
  product: ProductItem;
  onAddToCart?: (p: ProductItem) => void;
}) {
  const [isAdded, setIsAdded] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const discount =
    product.discountPercent ||
    (product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    onAddToCart?.(product);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      className="@container group relative flex flex-col rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 backdrop-blur-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden w-full select-none"
    >
      {/* Specular Inner Highlight */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/40 dark:from-white/5 to-transparent pointer-events-none rounded-t-3xl z-10" />

      {/* Product Image Stage */}
      <div className="relative h-44 @[280px]:h-52 w-full p-4 flex items-center justify-center bg-gradient-to-b from-slate-50/70 to-slate-100/40 dark:from-zinc-800/30 dark:to-zinc-800/60 rounded-2xl overflow-hidden m-2 mb-0">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Top Badges (Logical start & end positioning) */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-20">
          {discount > 0 ? (
            <span className="rounded-xl bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm font-persian-nums">
              ٪{toPersianDigits(discount)}
            </span>
          ) : (
            <span />
          )}

          {product.isSpecial && (
            <span className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              ویژه
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsFav(!isFav);
          }}
          whileTap={{ scale: 0.8 }}
          aria-label="افزودن به علاقه‌مندی"
          className="absolute bottom-2.5 start-2.5 z-20 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-slate-400 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 shadow-sm transition-colors cursor-pointer"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
        </motion.button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {product.rating && (
            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mb-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{toPersianDigits(product.rating)}</span>
              {product.reviewsCount && (
                <span className="text-slate-400 dark:text-zinc-500 font-normal">
                  ({toPersianDigits(product.reviewsCount)})
                </span>
              )}
            </div>
          )}

          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 line-clamp-2 leading-relaxed text-start group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price Section */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-end justify-between">
          <div className="flex flex-col items-start">
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-slate-400 dark:text-zinc-500 line-through font-persian-nums">
                {formatToman(product.oldPrice, false)}
              </span>
            )}
            <div className="flex items-baseline gap-1 text-emerald-600 dark:text-emerald-400 font-black text-lg">
              <span className="font-persian-nums">{formatToman(product.price, false)}</span>
              <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">تومان</span>
            </div>
          </div>

          {/* Add To Cart CTA Button */}
          <motion.button
            type="button"
            onClick={handleAdd}
            whileTap={{ scale: 0.92 }}
            className={`h-10 px-4 rounded-xl text-white text-xs font-bold shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              isAdded
                ? 'bg-green-600 shadow-green-600/30'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 hover:shadow-emerald-600/40'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>ثبت شد</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden @[240px]:inline">خرید</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
```

---

## 9. Best Practices, Pitfalls & Troubleshooting Checklist

| Scenario / Problem | Mistake | Correct Tailwind v4 Pattern |
|---|---|---|
| **Theme Setup** | Creating `tailwind.config.js` | Define `@theme { ... }` directly in `globals.css` |
| **Import Syntax** | `@tailwind base; @tailwind comp;` | `@import "tailwindcss";` |
| **Direction / RTL** | Using `pl-4`, `mr-2`, `left-0` | Use logical `ps-4`, `me-2`, `start-0` |
| **Persian Fonts** | Relying on Google Fonts CDN | Install `@fontsource/vazirmatn` for offline-first immunity |
| **Persian Lettering** | Applying `tracking-wide` or `tracking-tight` | Enforce `letter-spacing: 0 !important;` (Arabic script connects letters) |
| **Dark Mode Flash** | Using `useEffect` inside React state | Inline synchronous anti-FOUC script in `src/app/layout.tsx` `<head>` |
| **Container Queries** | Installing `@tailwindcss/container-queries` | Use native `@container`, `@sm:`, `@md:`, `@min-[320px]:` |
| **Color Roles** | Hardcoding `#10b981` across JSX | Define semantic `--primary`, `--background`, `--card` tokens |
| **Glassmorphism** | Simple `bg-white/20 backdrop-blur` | Add `saturate-180`, `border-white/50`, and specular `inset 0 1px ...` shadow |
| **Vestibular A11y** | Unconditional infinite animations | Wrap with `motion-safe:animate-*` and `motion-reduce:transition-none` |
