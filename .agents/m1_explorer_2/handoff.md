# Handoff Report: Milestone 1 Typography, RTL Layout, and Theme Styling Architecture

**Author**: `m1_explorer_2` (teamwork_preview_explorer)  
**Parent Caller**: `875495e2-e902-4678-a7f8-8c203de96906` (`parent`)  
**Target Project**: Dijimoon Storefront (دیجی مون)  
**Date**: 2026-09-18  
**Handoff Type**: Hard Handoff (Investigation & Specification Complete)  
**Artifacts Produced**:
- `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_2/proposed_layout.tsx`
- `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_2/proposed_globals.css`
- `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_2/proposed_page.tsx`
- `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_2/proposed_postcss.config.mjs`
- `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_2/proposed_layout_localfont.tsx`

---

## 1. Observation

### 1.1 Directives & Architectural Baseline
1. **Direct User Directive (`.agents/ORIGINAL_REQUEST.md:64-74`)**:
   - *«از جدیدترین و بهترین نسخه‌ها استفاده کن و پیاده‌سازی کن»*
   - Next.js 15+ (App Router & Turbopack)
   - React 19 & React DOM 19
   - Tailwind CSS v4 (`@tailwindcss/postcss`)
   - Motion
   - Persian fonts (`IRANSans` + `Vazirmatn`)
   - Dual-palette system: **Slate** (light mode) vs **Zinc** (dark mode)

2. **Project Specification (`PROJECT.md:4-10, 51-60`)**:
   - Architecture requires: Next.js 15+ App Router, Tailwind CSS v4 CSS-first `@theme`, `@custom-variant dark` and `@custom-variant rtl`, Persian native `dir="rtl"` and `lang="fa"`, OpenType ligatures `font-feature-settings: "rlig" 1, "calt" 1`, Slate/Zinc theme engine with inline anti-FOUC script.
   - Code layout places root styling in `src/app/layout.tsx` and `src/app/globals.css`, with smoke test in `src/app/page.tsx`.

3. **Design Tokens & Extracted CSS Baseline (`design-system/tailwind-theme.css`, `design-system/tokens.json`)**:
   - Primary Brand Emerald: `#00bb7f` (`--color-emerald-500`)
   - Secondary Brand Green: `#00c758` (`--color-green-500`) and Teal: `#00baa7` (`--color-teal-500`)
   - Attention Badge Accent: High-visibility Orange `#fe6e00` (`--color-orange-500`) with `@keyframes floating`
   - Deal & Festival Badges: Amber `#f99c00` and Red `#fb2c36`
   - Neutral Palettes: Slate (`slate-50` through `slate-900`) for light surfaces; Zinc (`zinc-100` through `zinc-950`) for dark surfaces
   - Glassmorphism: `backdrop-filter: blur(12px)` with 85% opacity (`rgba(255, 255, 255, 0.85)` / `rgba(24, 24, 27, 0.85)`) and subtle borders
   - Spacing: 4px base quantization (`--spacing: 0.25rem;`)
   - Radii hierarchy: `--radius-2xl: 1rem` (16px, cards/buttons), `--radius-3xl: 1.5rem` (24px, category banners/drawers), `--radius-full: 9999px` (badges).

4. **Workspace Font Assets Inspection**:
   - Running `find . -type f \( -name "*.woff*" -o -name "*.ttf" \)` across `/Users/amirheidari/GitHub/Digi-Moon` returns **0** results.
   - No binary font files are committed in the git repository.
   - Network constraint in user memory: *"The user uses a VPN and the target site only accepts Iranian IP addresses."* Downloading Google Fonts at build time via `next/font/google` can fail or hang during `next build` if VPN or international routing is blocked or unstable.

---

## 2. Logic Chain

1. **Step 1: Offline Font Strategy Selection**:
   - Supported by Observation 1.4: Because no binary `.woff2` files are committed and remote Google Fonts downloads during build can fail under VPN split-routing, `@fontsource/vazirmatn` (npm package) is the optimal, deterministic strategy. Once installed via npm/pnpm, all font files are stored locally in `node_modules` and require zero external network requests during `next build` or runtime.
   - For environments where `IRANSans` is available locally on the client OS or placed in `src/assets/fonts/`, the font stack in `@theme` declares:
     `--font-sans: "IRANSans", "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, Tahoma, sans-serif;`
   - OpenType ligatures `font-feature-settings: "rlig" 1, "calt" 1;` are enabled globally on `body` to guarantee cursive Persian script shaping and proper zero-width non-joiner (نیم‌فاصله) rendering.

2. **Step 2: Root Layout RTL & Anti-FOUC Theme Detection**:
   - Supported by Observations 1.1 & 1.2: To prevent Flash Of Unstyled Content (FOUC), theme preference must be resolved before the browser paints `<body>`.
   - An inline, synchronous `<script>` inside `<head>` reads `localStorage.getItem('dijimoon_theme')` and evaluates `window.matchMedia('(prefers-color-scheme: dark)').matches`. If dark, it adds `.dark` to `document.documentElement`; otherwise, it removes it.
   - Because this script modifies the `<html>` attributes before React mounts, `suppressHydrationWarning` must be added to `<html lang="fa" dir="rtl" suppressHydrationWarning>` to prevent React 19 hydration mismatch warnings in the console.

3. **Step 3: Tailwind CSS v4 CSS-First Architecture**:
   - Supported by Observations 1.1 & 1.3: In Tailwind CSS v4, JavaScript configuration files (`tailwind.config.js`) and `@tailwind` directives are replaced by CSS-first configuration:
     - `@import "tailwindcss";`
     - `@custom-variant dark (&:where(.dark, .dark *));` allows class-based `.dark` toggling.
     - `@custom-variant rtl (&:where([dir="rtl"], [dir="rtl"] *));` enables direction-specific styling.
     - `@theme` block defines custom color tokens, font families, radii, 4px spacing, and animation tokens.
   - PostCSS only requires `@tailwindcss/postcss`:
     ```javascript
     export default { plugins: { '@tailwindcss/postcss': {} } };
     ```

4. **Step 4: Dual-Palette (Slate vs Zinc) Surface Mapping**:
   - Supported by Observations 1.1 & 1.3:
     - In Light Mode (`:root`), semantic tokens `--background`, `--foreground`, `--border`, and `--muted` map directly to the **Slate** palette (`slate-50` background, `slate-800` foreground, `slate-200` border, `slate-100` card dividers).
     - In Dark Mode (`.dark`), semantic tokens map directly to the **Zinc** palette (`zinc-950` background, `zinc-100` foreground, `zinc-800` border, `zinc-900` card surfaces).
     - This guarantees balanced contrast ratios and eliminates harsh glare or muddy tones during mode switching.

5. **Step 5: Viewport & Metadata Separation in Next.js 15**:
   - Next.js 15 App Router strictly enforces exporting `viewport` separately from `metadata`. Putting `viewportFit`, `themeColor`, or `initialScale` inside `metadata` causes deprecation warnings. We provide clean, independent typed exports for both.

---

## 3. Caveats

1. **Font Package Installation**: The worker must include `@fontsource/vazirmatn` in `package.json` (or `pnpm add @fontsource/vazirmatn`). If the worker prefers `next/font/local`, they must place `.woff2` files in `src/assets/fonts/` (we have provided `proposed_layout_localfont.tsx` as an alternative).
2. **React 19 Hydration Boundary**: Any UI component displaying theme-dependent icons (e.g. `Sun` vs `Moon`) or persisted cart counts should wait until `mounted === true` (or use `useSyncExternalStore`) before rendering client-only state to prevent SSR/client mismatch.
3. **Safe Area Insets on iOS**: When building fixed glassmorphic headers or sticky bottom elements, mobile browsers with notches require `viewportFit: 'cover'` and `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`.

---

## 4. Conclusion: Exact Implementation Files

The worker can directly copy the code below into the corresponding files in the project.

### 4.1 `src/app/layout.tsx`
*Saved at `.agents/m1_explorer_2/proposed_layout.tsx`:*

```tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

// Resilient Persian font loading via @fontsource/vazirmatn
// Provides complete offline & VPN immunity with zero external Google Fonts network calls during build
import '@fontsource/vazirmatn/300.css';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/vazirmatn/800.css';
import '@fontsource/vazirmatn/900.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'دیجی مون | فروشگاه تخصصی کالای دیجیتال',
    template: '%s | دیجی مون',
  },
  description: 'خرید جدیدترین کالاهای دیجیتال، موبایل، لپ‌تاپ و گجت‌های هوشمند با بهترین قیمت و ضمانت اصالت',
  keywords: ['دیجی مون', 'فروشگاه اینترنتی', 'کالای دیجیتال', 'موبایل', 'لپ‌تاپ', 'خرید آنلاین', 'dijimoon'],
  authors: [{ name: 'تیم دیجی مون', url: 'https://dijimoon.ir' }],
  creator: 'Dijimoon',
  publisher: 'Dijimoon',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'دیجی مون | فروشگاه تخصصی کالای دیجیتال',
    description: 'خرید جدیدترین کالاهای دیجیتال با تضمین اصالت و ارسال سریع',
    url: 'https://dijimoon.ir',
    siteName: 'دیجی مون',
    locale: 'fa_IR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
    >
      <head>
        {/* 
          Inline Anti-FOUC Theme Detection Script:
          Executes synchronously before DOM paint to detect saved theme or OS preference,
          preventing white/dark flash during initial page load.
          Slate neutral palette activates in Light mode; Zinc neutral palette activates in Dark mode.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('dijimoon_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
```

---

### 4.2 `src/app/globals.css`
*Saved at `.agents/m1_explorer_2/proposed_globals.css`:*

```css
@import "tailwindcss";

/* ==========================================================================
   DIJIMOON DESIGN SYSTEM - TAILWIND CSS v4 THEME & UTILITIES
   Framework: Next.js 15 App Router (Turbopack + React 19)
   Styling: Tailwind CSS v4 (@tailwindcss/postcss)
   Architecture: CSS-First Design Tokens, RTL-First, Dual-Palette (Slate/Zinc)
   ========================================================================== */

/* Define Class-Based Dark Mode Variant for Manual & OS Preference Switching */
@custom-variant dark (&:where(.dark, .dark *));

/* Define RTL Variant for Bi-directional Layout Control */
@custom-variant rtl (&:where([dir="rtl"], [dir="rtl"] *));

@theme {
  /* --- Typography --- */
  --font-sans: "IRANSans", "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, Tahoma, sans-serif;
  --font-iransans: "IRANSans", sans-serif;
  --font-vazir: "Vazirmatn", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* --- Spacing System (4px Base Quantization) --- */
  --spacing: 0.25rem;

  /* --- Radii Hierarchy --- */
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px (Image containers, back buttons) */
  --radius-2xl: 1rem;      /* 16px (Product Cards, Buttons, SearchBar, Modals) */
  --radius-3xl: 1.5rem;    /* 24px (Category Cards, Hero Banners, Drawer Top) */
  --radius-4xl: 2rem;      /* 32px (Large modal wrappers) */
  --radius-full: 9999px;   /* Pills, Floating Badges, Circle buttons */

  /* --- Brand Core Emerald Palette (Primary Action & Identity) --- */
  --color-emerald-50: #ecfdf5;
  --color-emerald-100: #d0fae5;
  --color-emerald-200: #a4f4cf;
  --color-emerald-300: #5ee9b5;
  --color-emerald-400: #00d294;
  --color-emerald-500: #00bb7f;  /* Primary Brand Master Token */
  --color-emerald-600: #009767;  /* Primary Action CTA */
  --color-emerald-700: #007956;  /* Button Hover State */
  --color-emerald-800: #005f46;

  /* --- Secondary Brand Green & Teal (Logo & Typography Gradients) --- */
  --color-green-50: #f0fdf4;
  --color-green-100: #dcfce7;
  --color-green-200: #b9f8cf;
  --color-green-300: #7bf1a8;
  --color-green-400: #05df72;
  --color-green-500: #00c758;  /* Logo Gradient Start & Active Checkmarks */
  --color-green-600: #00a544;
  --color-green-700: #008138;
  --color-green-800: #016630;

  --color-teal-300: #46ecd5;
  --color-teal-500: #00baa7;   /* Logo Gradient End & Text Gradient End */
  --color-teal-600: #009588;

  /* --- Attention & Badge Accents --- */
  --color-orange-400: #ff8b1a;
  --color-orange-500: #fe6e00;  /* Floating Cart Notification Badge */
  --color-orange-600: #f05100;

  --color-amber-500: #f99c00;   /* Festival Deal Badge */
  --color-amber-600: #dd7400;
  --color-amber-700: #b75000;

  --color-red-500: #fb2c36;     /* Discount Pill Badge & Errors */
  --color-red-600: #e40014;

  /* --- Neutral Grayscale 1: Slate (Light Mode Surfaces) --- */
  --color-slate-50: #f8fafc;    /* Light Page Background */
  --color-slate-100: #f1f5f9;   /* Card Dividers & Borders */
  --color-slate-200: #e2e8f0;   /* Active Borders & Drag Handle */
  --color-slate-300: #cad5e2;
  --color-slate-400: #90a1b9;
  --color-slate-500: #62748e;   /* Secondary Text / Subtitles */
  --color-slate-600: #45556c;
  --color-slate-700: #314158;   /* Body Text */
  --color-slate-800: #1d293d;   /* Headings & Dark Titles */
  --color-slate-900: #0f172b;   /* Deep Primary Text */

  /* --- Neutral Grayscale 2: Zinc (Dark Mode Surfaces) --- */
  --color-zinc-100: #f4f4f5;    /* Dark Mode Primary Headings */
  --color-zinc-200: #e4e4e7;
  --color-zinc-300: #d4d4d8;    /* Dark Mode Body Text */
  --color-zinc-400: #a1a1aa;    /* Dark Mode Subtitles & Placeholders */
  --color-zinc-500: #71717a;
  --color-zinc-600: #52525b;
  --color-zinc-700: #3f3f46;    /* Dark Mode Active Dividers & Drag Handle */
  --color-zinc-800: #27272a;    /* Dark Mode Card Borders & Inputs */
  --color-zinc-900: #18181b;    /* Dark Mode Card Surface & Modal Body */
  --color-zinc-950: #09090b;    /* Dark Mode Root Page Background */

  /* --- Shadows & Elevations --- */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* --- Animation Tokens --- */
  --animate-floating: floating 2s ease-in-out infinite;
}

/* ==========================================================================
   KEYFRAME DEFINITIONS
   ========================================================================== */

@keyframes floating {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* ==========================================================================
   BASE & RTL CONFIGURATION
   ========================================================================== */

@layer base {
  :root {
    /* Slate Neutral Surface Baseline (Light Mode) */
    --background: #f8fafc;       /* slate-50 */
    --foreground: #1d293d;       /* slate-800 */
    --card: #ffffff;
    --card-foreground: #1d293d;  /* slate-800 */
    --border: #e2e8f0;           /* slate-200 */
    --muted: #f1f5f9;            /* slate-100 */
    --muted-foreground: #62748e; /* slate-500 */
    --accent: #ecfdf5;           /* emerald-50 */
    --accent-foreground: #007956;/* emerald-700 */
    --ring: #00d294;             /* emerald-400 */
  }

  .dark {
    /* Zinc Neutral Surface Baseline (Dark Mode) */
    --background: #09090b;       /* zinc-950 */
    --foreground: #f4f4f5;       /* zinc-100 */
    --card: #18181b;             /* zinc-900 */
    --card-foreground: #f4f4f5;  /* zinc-100 */
    --border: #27272a;           /* zinc-800 */
    --muted: #27272a;            /* zinc-800 */
    --muted-foreground: #a1a1aa; /* zinc-400 */
    --accent: #005f46;           /* emerald-800 */
    --accent-foreground: #a4f4cf;/* emerald-200 */
    --ring: #00bb7f;             /* emerald-500 */
  }

  html {
    direction: rtl;
    text-align: right;
    scroll-behavior: smooth;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    font-feature-settings: "rlig" 1, "calt" 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }
}

/* ==========================================================================
   CUSTOM UTILITY CLASSES
   ========================================================================== */

@layer utilities {
  /* Glassmorphism Frosted Effect (12px Blur, Subtle Border) */
  .glass-effect {
    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.35);
  }

  .dark .glass-effect {
    background-color: rgba(24, 24, 27, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(63, 63, 70, 0.40);
  }

  /* Persian Gradient Brand Heading Text */
  .gradient-text {
    background-image: linear-gradient(to right, #009767, #00baa7);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
  }

  /* Floating Micro-animation for Attention Badges */
  .floating {
    animation: floating 2s ease-in-out infinite;
  }

  /* Interactive Card Elevation Helpers */
  .product-card {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .product-card:hover {
    transform: translateY(-2px);
  }

  .category-card {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .category-card:hover {
    transform: translateY(-2px);
  }
}
```

---

### 4.3 `src/app/page.tsx` (Interactive Smoke Test)
*Saved at `.agents/m1_explorer_2/proposed_page.tsx`:*

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  ShoppingCart,
  Sparkles,
  CheckCircle2,
  Tag,
  Heart,
  Plus,
  Zap,
} from 'lucide-react';

export default function SmokeTestPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(3);

  // Synchronize with active DOM class on mount
  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dijimoon_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dijimoon_theme', 'light');
    }
  };

  return (
    <main className="min-h-screen pb-24 transition-colors duration-300">
      {/* 1. Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-40 w-full glass-effect shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Gradient Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-black text-xl">
              D
            </div>
            <div>
              <h1 className="text-xl font-black gradient-text tracking-tight">
                دیجی‌مون
              </h1>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium block -mt-1">
                تست دودمانه زیرساخت فرانت‌اند (M1)
              </span>
            </div>
          </div>

          {/* Action Tools: Cart + Theme Switcher */}
          <div className="flex items-center gap-3">
            {/* Cart Button with Floating Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCartCount((prev) => prev + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                title="افزودن به سبد برای تست بج شناور"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md shadow-orange-500/40 floating select-none">
                  {cartCount.toLocaleString('fa-IR')}
                </span>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3.5 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer text-sm font-semibold"
            >
              {mounted && theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">تم روشن (Slate)</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="hidden sm:inline">تم تاریک (Zinc)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* 2. Hero Banner: Glassmorphism over Gradient Test */}
        <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-xl shadow-emerald-500/10">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>آماده‌سازی میلتسون ۱ با جدیدترین نسخه‌ها</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              اعتبارسنجی چیدمان RTL، فونت فارسی و پالت‌های Slate / Zinc
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base leading-relaxed">
              این صفحه به عنوان اسموک‌تست جامع، اجرای درست توکن‌های Tailwind v4، بارگذاری فونت‌های فارسی (Vazirmatn و IRANSans)، افکت شیشه‌ای با بلور ۱۲px و میکرواینیمیشن‌های شناور را بررسی می‌کند.
            </p>
          </div>

          {/* Frosted Glass Demo Overlay */}
          <div className="mt-6 p-4 rounded-2xl glass-effect text-slate-800 dark:text-zinc-100 max-w-lg shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                تست افکت Glassmorphism (بلور ۱۲px و شفافیت ۸۵٪)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                فعال
              </span>
            </div>
          </div>
        </section>

        {/* 3. System Health & Feature Verification Matrix */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              RTL
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-zinc-100">جهت بومی راست‌به‌چپ</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              چینش کامل بر مبنای <code className="text-emerald-600 dark:text-emerald-400">dir=&quot;rtl&quot;</code> و زبان فارسی <code className="text-emerald-600 dark:text-emerald-400">lang=&quot;fa&quot;</code>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              Aa
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-zinc-100">فونت و لیگچر فارسی</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              لیگچرهای اتصال باز <code className="text-teal-600 dark:text-teal-400">rlig 1, calt 1</code> با پشتیبانی کامل از کاراکترهای نیم‌فاصله
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              🎨
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-zinc-100">پالت‌های دوگانه تم</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              سطوح <span className="font-bold text-slate-700 dark:text-slate-300">Slate</span> در تم لایت و سطوح <span className="font-bold text-zinc-700 dark:text-zinc-300">Zinc</span> در تم دارک با اسکریپت ضد FOUC
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-zinc-100">Tailwind CSS v4</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              معماری مدرن CSS-First، تعریف <code className="text-orange-600 dark:text-orange-400">@theme</code> و کوانتایز ۴px گرید
            </p>
          </div>
        </section>

        {/* 4. Brand Colors Swatch Grid */}
        <section className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            <span>پالت رنگ‌های سازمانی و توکن‌های طراحی (Tokens Palette)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-emerald-500 text-white text-center shadow-sm">
              <span className="block text-xs font-bold">زمردی برند</span>
              <span className="text-[10px] opacity-80 font-mono">#00bb7f</span>
            </div>
            <div className="p-3 rounded-xl bg-green-500 text-white text-center shadow-sm">
              <span className="block text-xs font-bold">سبز اکشن</span>
              <span className="text-[10px] opacity-80 font-mono">#00c758</span>
            </div>
            <div className="p-3 rounded-xl bg-teal-500 text-white text-center shadow-sm">
              <span className="block text-xs font-bold">فیروزه‌ای گرادیان</span>
              <span className="text-[10px] opacity-80 font-mono">#00baa7</span>
            </div>
            <div className="p-3 rounded-xl bg-orange-500 text-white text-center shadow-sm">
              <span className="block text-xs font-bold">نارنجی بج شناور</span>
              <span className="text-[10px] opacity-80 font-mono">#fe6e00</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500 text-white text-center shadow-sm">
              <span className="block text-xs font-bold">کهربایی جشنواره</span>
              <span className="text-[10px] opacity-80 font-mono">#f99c00</span>
            </div>
            <div className="p-3 rounded-xl bg-red-500 text-white text-center shadow-sm">
              <span className="block text-xs font-bold">قرمز تخفیف</span>
              <span className="text-[10px] opacity-80 font-mono">#fb2c36</span>
            </div>
          </div>
        </section>

        {/* 5. Interactive Product Card Smoke Test */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-500" />
              <span>پیش‌نمایش کارت محصول طبق توکن‌های رسمی (ProductCard Smoke Test)</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              شعاع انحنا: <code className="text-emerald-600 font-mono">rounded-2xl (16px)</code>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {/* Sample Product Card */}
            <div className="product-card group relative bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                {/* Badges Container */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold select-none">
                    ٪۱۵
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-[11px] font-bold select-none">
                    ویژه جشنواره
                  </span>
                </div>

                {/* Product Image Slot */}
                <div className="relative w-full h-44 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden mb-3">
                  <div className="text-slate-400 dark:text-zinc-500 text-xs font-medium text-center p-4">
                    تصویر محصول دیجیتال
                    <br />
                    <span className="text-[10px] opacity-75">ابعاد ثابت بدون پرش (CLS = ۰)</span>
                  </div>
                  <button
                    type="button"
                    aria-label="افزودن به علاقه‌مندی‌ها"
                    className="absolute top-2 start-2 p-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-slate-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Title */}
                <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100 line-clamp-2 leading-relaxed mb-2">
                  هدفون بلوتوثی نویزکنسلینگ سونی مدل WH-1000XM5 با گارانتی ۱۸ ماهه
                </h4>
              </div>

              {/* Price & Add Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through block">
                    {(۲۱۷۵۰۰۰۰).toLocaleString('fa-IR')}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-slate-900 dark:text-zinc-50">
                      {(۱۸۵۰۰۰۰۰).toLocaleString('fa-IR')}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                      تومان
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCartCount((prev) => prev + 1)}
                  className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  title="افزودن به سبد"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Typography & Ligatures Stress-Test */}
        <section className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">
            تست خوانایی، کاراکترهای نیم‌فاصله و ارقام فارسی
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-zinc-300 leading-loose">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                تست نیم‌فاصله (ZWNJ) و لیگچرها:
              </span>
              فروشگاه اینترنتی دیجی‌مون با هدف ارائه بی‌واسطه‌ی کالاهای شگفت‌انگیز، سیستم‌های هوشمند، گوشی‌های موبایل و لپ‌تاپ‌های گیمینگ با ارسال فوق‌سریع راه‌اندازی شده است.
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                تست ارقام فارسی و فرمت تومان:
              </span>
              تعداد کالاهای موجود در انبار مرکزی: ۱۲٬۴۸۵ قلم کالا
              <br />
              ارزش کل سفارش‌های پردازش‌شده: ۱٬۴۵۰٬۰۰۰٬۰۰۰ تومان
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
```

---

### 4.4 Supporting Configurations

#### A. PostCSS Adapter (`postcss.config.mjs`)
*Saved at `.agents/m1_explorer_2/proposed_postcss.config.mjs`:*
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

#### B. Required Dependencies for `package.json`
```json
{
  "dependencies": {
    "next": "^15.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@fontsource/vazirmatn": "^5.1.0",
    "lucide-react": "^0.475.0",
    "motion": "^12.4.0",
    "zustand": "^5.0.3",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "@types/node": "^22.13.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.5.1"
  }
}
```

---

## 5. Verification Method

To independently verify the implementation after the worker creates the files:

1. **Package Installation Verification**:
   ```bash
   npm install
   # or
   pnpm install
   ```
   *Expected*: Zero package peer dependency conflicts; `@fontsource/vazirmatn` and `@tailwindcss/postcss` resolve cleanly.

2. **TypeScript & Build Verification**:
   ```bash
   npm run build
   # or
   npx next build
   ```
   *Expected*: Exit code 0, 0 type errors, static pages compiled successfully.

3. **Development Server & Turbopack Smoke Test**:
   ```bash
   npm run dev -- --turbopack
   ```
   *Expected*: Server boots at `http://localhost:3000`.

4. **Visual & Behavioral Invalidation Checks**:
   - **RTL & Lang**: Inspect DOM elements. `document.documentElement.dir === "rtl"` and `document.documentElement.lang === "fa"`.
   - **Anti-FOUC**: Hard refresh the page with dark mode selected in `localStorage` (`localStorage.setItem('dijimoon_theme', 'dark')`). The page must render dark immediately with zero white flicker.
   - **Glassmorphism**: Verify `.glass-effect` has `backdrop-filter: blur(12px)` and elements beneath blur smoothly.
   - **Floating Animation**: Verify the cart badge has `.floating` class and oscillates vertically between `0px` and `-4px`.
   - **Theme Switching**: Click "تم تاریک (Zinc)" / "تم روشن (Slate)". Background switches between `#f8fafc` (Slate-50) and `#09090b` (Zinc-950).
