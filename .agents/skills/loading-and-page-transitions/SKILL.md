---
name: loading-and-page-transitions
description: >-
  Use when designing, implementing, or optimizing loading states, skeleton screens,
  page transitions, splash screens, or streaming UI in Next.js 15 App Router,
  React 19, Tailwind CSS v4, and Framer Motion / Motion. Trigger on mentions of:
  skeleton screen, shimmer effect, loading spinner, splash screen, page transition,
  route transition, AnimatePresence, View Transitions API, useTransition, useDeferredValue,
  useOptimistic, streaming SSR, loading.tsx, Suspense boundary, blurDataURL, or
  infinite scroll loading.
---

# Loading States, Skeleton Screens & Page Transitions

A production runbook for crafting responsive, fluid, and accessible loading experiences in **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Framer Motion / Motion v13**, tailored for modern e-commerce and web applications with full RTL (Persian/Vazirmatn) support.

---

## Architecture & Core Principles

1. **Zero Cumulative Layout Shift (CLS):** Skeleton placeholders must match the exact dimensions, aspect ratio, margins, and border radii of the target rendered content.
2. **Instant Navigation (Shell First):** Static layouts and navbars should render synchronously; only data-dependent subtrees should suspend and stream via React 19 Suspense boundaries.
3. **Bi-directional Motion (RTL Awareness):** Shimmer gradients, horizontal slide transitions, and progress bars must respect reading direction (`dir="rtl"` in Persian: shimmers travel right-to-left or left-to-right consistently, slide transitions enter from the correct semantic side).
4. **Non-Blocking UI:** Heavy data fetches or filter updates must use React 19 `useTransition` or `useDeferredValue` to keep the user interface responsive to interactions.
5. **Radical Accessibility (a11y):** Screen readers must be notified of busy states via `aria-busy="true"` and `aria-live="polite"` without causing noisy repetitive announcements. Motion must strictly adhere to `prefers-reduced-motion`.

---

## Architectural Decision Matrix

| Loading Scenario | Recommended Technique | Primary Advantage | Typical Latency |
|---|---|---|---|
| Initial Route Navigation | `loading.tsx` + Streaming SSR | Instant shell, zero client JS execution required for skeleton | > 300ms |
| Micro Component Data Fetch | Local `<Suspense fallback={<Skeleton />}>` | Localized loading without blocking siblings | 100ms - 2s |
| Search Filter / Debounce | React 19 `useDeferredValue` + opacity drop | Keep current UI responsive while calculating | 50ms - 300ms |
| Form Mutation / Cart Action | React 19 `useOptimistic` + `useTransition` | Immediate UI feedback, zero perceived latency | 0ms perceived |
| Page-to-Page Navigation | Framer Motion / View Transitions API | Fluid spatial continuity, eliminates jarring white flashes | 200ms - 400ms |
| Product Grid to Detail | Shared Element Transition (`layoutId`) | High perceived polish, visual anchor connection | 300ms - 500ms |
| Heavy Images / Media | `placeholder="blur"` + `blurDataURL` (SVG base64) | Prevents image snap-in and reflow | Network dependent |

---

## 1. Skeleton Screens & Shimmer Effects

### 1.1 Shimmer Gradient Setup in Tailwind CSS v4

Tailwind CSS v4 uses standard CSS `@theme` and `@keyframes` directives. In RTL layouts (Persian), shimmering looks most natural moving in the direction of reading or as a uniform sweeping highlight.

Add the following to `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --animate-shimmer: shimmer 2s infinite linear;

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @keyframes shimmer-rtl {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
}

/* RTL-aware Shimmer Utility */
[dir="rtl"] .animate-shimmer-dir {
  animation: shimmer-rtl 2s infinite linear;
}
[dir="ltr"] .animate-shimmer-dir {
  animation: shimmer 2s infinite linear;
}
```

### 1.2 Reusable Atomic Skeleton Component

A flexible, accessible primitive supporting pulse, shimmer, custom radii, and screen-reader status:

```tsx
// src/components/ui/Skeleton.tsx
import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "pulse" | "shimmer" | "none";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  className?: string;
  isBusy?: boolean;
  label?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "shimmer",
  rounded = "xl",
  className,
  isBusy = true,
  label = "در حال بارگذاری اطلاعات...",
  children,
  ...props
}) => {
  const radiusClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      role="status"
      aria-busy={isBusy}
      aria-label={label}
      className={twMerge(
        "relative overflow-hidden bg-slate-200/80 dark:bg-slate-800/80 select-none pointer-events-none",
        radiusClasses,
        variant === "pulse" && "animate-pulse motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      {variant === "shimmer" && (
        <div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer-dir motion-reduce:hidden"
          aria-hidden="true"
        />
      )}
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
};
```

### 1.3 Content-Aware Product Card & Grid Skeleton

Prevent layout shifts by matching exact grid dimensions, paddings, image aspects, badges, titles, and button heights:

```tsx
// src/components/skeletons/ProductCardSkeleton.tsx
import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      className="flex flex-col w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 shadow-xs overflow-hidden"
      aria-hidden="true"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-square w-full mb-3">
        <Skeleton variant="shimmer" rounded="xl" className="w-full h-full" />
        {/* Floating Badges */}
        <div className="absolute top-2 inset-x-2 flex justify-between items-center pointer-events-none">
          <Skeleton variant="pulse" rounded="md" className="h-5 w-10 bg-slate-300 dark:bg-slate-700" />
          <Skeleton variant="pulse" rounded="md" className="h-5 w-12 bg-slate-300 dark:bg-slate-700" />
        </div>
      </div>

      {/* Product Title Lines (Persian dual line height) */}
      <div className="space-y-2 mb-3">
        <Skeleton variant="shimmer" rounded="md" className="h-4 w-full" />
        <Skeleton variant="shimmer" rounded="md" className="h-4 w-3/4" />
      </div>

      {/* Meta/Rating Line */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="pulse" rounded="md" className="h-3 w-16" />
        <Skeleton variant="pulse" rounded="md" className="h-3 w-12" />
      </div>

      {/* Price & Action Section */}
      <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="space-y-1">
          <Skeleton variant="shimmer" rounded="md" className="h-3 w-14" />
          <Skeleton variant="shimmer" rounded="md" className="h-5 w-24" />
        </div>
        <Skeleton variant="shimmer" rounded="xl" className="h-9 w-9 shrink-0" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 w-full"
      role="status"
      aria-label="در حال بارگذاری لیست محصولات..."
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};
```

### 1.4 Next.js 15 `loading.tsx` with Instant Suspense Shell

In Next.js App Router, `loading.tsx` automatically wraps the parallel `page.tsx` within a React Suspense boundary. Use this to render the static page header immediately while streaming dynamic items:

```tsx
// src/app/category/[slug]/loading.tsx
import React from "react";
import { ProductGridSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-4 px-4 max-w-7xl mx-auto" dir="rtl">
      {/* Category Header Skeleton */}
      <div className="mb-6 space-y-3">
        <Skeleton rounded="lg" className="h-4 w-32" />
        <Skeleton rounded="xl" className="h-8 w-64" />
        <Skeleton rounded="lg" className="h-4 w-96 max-w-full" />
      </div>

      {/* Filter Badges Horizontal Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} rounded="full" className="h-9 w-24 shrink-0" />
        ))}
      </div>

      {/* Product Grid Skeleton */}
      <ProductGridSkeleton count={8} />
    </main>
  );
}
```

---

## 2. Page Load & Splash Screens

### 2.1 Full-Screen Brand Splash Screen with Framer Motion

For PWAs, mobile views, or initial app boots, display an engaging brand reveal with SVG drawing and scale-fade transitions:

```tsx
// src/components/splash/BrandSplashScreen.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BrandSplashScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const BrandSplashScreen: React.FC<BrandSplashScreenProps> = ({
  onFinish,
  minDurationMs = 1800,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs, onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-radial from-slate-900 via-slate-950 to-black text-white selection:bg-emerald-500"
          dir="rtl"
        >
          {/* Logo SVG with animated stroke and scale */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00bb7f" />
                  <stop offset="100%" stopColor="#00d294" />
                </linearGradient>
              </defs>

              {/* Animated Crescent / Moon Contour */}
              <motion.path
                d="M 50 10 A 40 40 0 1 0 90 50 A 30 30 0 1 1 50 10 Z"
                stroke="url(#brandGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />

              {/* Glowing Center Core */}
              <motion.circle
                cx="50"
                cy="50"
                r="10"
                fill="#00bb7f"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              />
            </svg>
          </div>

          {/* Persian Brand Name Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <h1 className="text-2xl font-bold tracking-tight font-vazir text-emerald-400">
              دیجی‌مون
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              سامانه هوشمند خرید و فروش کالا
            </p>
          </motion.div>

          {/* Indeterminate Bottom Line Progress */}
          <div className="absolute bottom-12 w-36 h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

### 2.2 High-Performance Loading Spinners & Circular Progress Rings

Provide both CSS-only and SVG circular ring indicators:

```tsx
// src/components/ui/LoadingSpinner.tsx
import React from "react";
import { clsx } from "clsx";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
}

export const CssSpinner: React.FC<SpinnerProps> = ({
  size = "md",
  className,
  label = "در حال بارگذاری",
}) => {
  const sizeMap = {
    xs: "w-3.5 h-3.5 border-2",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-[2.5px]",
    lg: "w-8 h-8 border-3",
    xl: "w-12 h-12 border-4",
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={clsx(
        "inline-block rounded-full border-slate-200 dark:border-slate-800 border-t-emerald-500 dark:border-t-emerald-400 animate-spin motion-reduce:animate-none",
        sizeMap[size],
        className
      )}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};

interface CircularProgressRingProps {
  value?: number; // 0 to 100 (if omitted, indeterminate)
  size?: number;  // Diameter in px
  strokeWidth?: number;
  className?: string;
  label?: string;
}

export const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  value,
  size = 48,
  strokeWidth = 4,
  className = "text-emerald-500",
  label = "پیشرفت بارگذاری",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const isDeterminate = typeof value === "number";
  const strokeDashoffset = isDeterminate
    ? circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference
    : undefined;

  return (
    <div
      role="progressbar"
      aria-valuenow={isDeterminate ? value : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={clsx("-rotate-90", !isDeterminate && "animate-spin motion-reduce:animate-none")}
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-200 dark:text-slate-800"
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={clsx(
            className,
            "transition-[stroke-dashoffset] duration-300 ease-out",
            !isDeterminate && "stroke-dashoffset-[75] [stroke-dasharray:90_150]"
          )}
        />
      </svg>
      {isDeterminate && (
        <span className="absolute text-[10px] font-bold font-vazir text-slate-700 dark:text-slate-200">
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
};
```

---

## 3. Page Transitions & Route Navigation

### 3.1 Next.js 15 App Router Transitions with `AnimatePresence`

In Next.js App Router (`layout.tsx`), the router unmounts the old page synchronously upon route transition. To enable exit animations, wrap children in a component that keys by pathname and manages exit states:

```tsx
// src/components/transitions/PageTransitionProvider.tsx
"use client";

import React, { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProviderProps extends PropsWithChildren {
  direction?: "rtl" | "ltr";
}

export const PageTransitionProvider: React.FC<PageTransitionProviderProps> = ({
  children,
  direction = "rtl",
}) => {
  const pathname = usePathname();

  // RTL-aware horizontal slide offset
  const xOffset = direction === "rtl" ? -16 : 16;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: xOffset }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -xOffset }}
        transition={{
          duration: 0.22,
          ease: [0.25, 1, 0.5, 1], // Cubic bezier smooth ease
        }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

Integrate in `src/app/layout.tsx`:

```tsx
import { PageTransitionProvider } from "@/components/transitions/PageTransitionProvider";
import { TopRouteProgress } from "@/components/transitions/TopRouteProgress";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-vazir antialiased min-h-screen flex flex-col">
        <TopRouteProgress />
        <PageTransitionProvider direction="rtl">
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  );
}
```

### 3.2 Top Loading Bar (NProgress-style) for App Router Navigation

Show a slender, branded progress bar at the top of the viewport during route transitions:

```tsx
// src/components/transitions/TopRouteProgress.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const TopRouteProgress: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // Complete progress on route arrival
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  // Intercept Next.js Link clicks to start top bar immediately
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target || !target.href) return;

      const url = new URL(target.href);
      const isInternal = url.origin === window.location.origin;
      const isSamePage = url.pathname === window.location.pathname && url.search === window.location.search;
      const targetAttr = target.getAttribute("target");

      if (isInternal && !isSamePage && targetAttr !== "_blank" && !e.ctrlKey && !e.metaKey) {
        setIsNavigating(true);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-50 pointer-events-none h-1 overflow-hidden" dir="rtl">
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            key="progress-bar"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{
              scaleX: [0, 0.4, 0.7, 0.85],
              transition: { duration: 2.5, ease: "easeOut" },
            }}
            exit={{
              scaleX: 1,
              opacity: 0,
              transition: { duration: 0.25, ease: "easeIn" },
            }}
            className="h-full w-full bg-gradient-to-l from-emerald-400 via-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(0,187,127,0.6)]"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
```

### 3.3 Shared Element Route Transitions with Framer Motion `layoutId`

Connect a card from a catalog grid smoothly into the hero image on the product detail page:

```tsx
// src/components/product/ProductCardWithTransition.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

export const ProductCardWithTransition: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  imageUrl,
}) => {
  return (
    <Link href={`/product/${id}`} className="group block focus:outline-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
        {/* Shared Image Frame */}
        <motion.div
          layoutId={`product-image-${id}`}
          className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800"
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </motion.div>

        {/* Shared Title */}
        <motion.h3
          layoutId={`product-title-${id}`}
          className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2.5 line-clamp-2"
        >
          {title}
        </motion.h3>

        {/* Price */}
        <div className="mt-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
          {price.toLocaleString("fa-IR")} تومان
        </div>
      </div>
    </Link>
  );
};
```

And in the Target Detail Component (`src/app/product/[id]/page.tsx`):

```tsx
// src/app/product/[id]/ProductDetailHero.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const ProductDetailHero: React.FC<{
  id: string;
  title: string;
  imageUrl: string;
}> = ({ id, title, imageUrl }) => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        layoutId={`product-image-${id}`}
        className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800"
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover"
        />
      </motion.div>

      <motion.h1
        layoutId={`product-title-${id}`}
        className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-4"
      >
        {title}
      </motion.h1>
    </div>
  );
};
```

### 3.4 Modern View Transitions API (`document.startViewTransition`)

For browsers supporting the View Transitions API, wrap router navigations with zero layout thrashing:

```tsx
// src/lib/navigation/viewTransition.ts
export function navigateWithViewTransition(routerPush: () => void) {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    // @ts-expect-error View Transitions API native type
    document.startViewTransition(() => {
      routerPush();
    });
  } else {
    routerPush();
  }
}
```

Add cross-fade rules in `globals.css`:

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.25s;
  animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

::view-transition-old(root) {
  animation-name: fade-out;
}

::view-transition-new(root) {
  animation-name: fade-in;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

---

## 4. Content Loading Patterns & Optimistic UI

### 4.1 Next.js Image Blur-Up with Base64 Shimmer Generator

Prevent flash of unstyled image content (FOUC) and layout jumps by generating dynamic shimmer placeholders for `next/image`:

```tsx
// src/lib/image/shimmerPlaceholder.ts

/**
 * Creates a base64 encoded SVG shimmer placeholder for Next.js Image component
 */
export function getShimmerBlurDataURL(w: number = 700, h: number = 700): string {
  const shimmerSvg = `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#e2e8f0" offset="20%" />
          <stop stop-color="#cbd5e1" offset="50%" />
          <stop stop-color="#e2e8f0" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f1f5f9" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(shimmerSvg)}`;
}
```

Usage in components:

```tsx
import Image from "next/image";
import { getShimmerBlurDataURL } from "@/lib/image/shimmerPlaceholder";

export function OptimizedProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, 400px"
        placeholder="blur"
        blurDataURL={getShimmerBlurDataURL(400, 400)}
        className="object-cover transition-opacity duration-300"
      />
    </div>
  );
}
```

### 4.2 React 19 `useOptimistic` for Instant Cart Updates

In React 19, `useOptimistic` lets you render optimistic states immediately while an asynchronous Server Action completes in the background, rolling back automatically on error:

```tsx
// src/components/cart/AddToCartOptimisticButton.tsx
"use client";

import React, { useOptimistic, useTransition } from "react";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { addToCartAction } from "@/app/actions/cart";

interface AddToCartProps {
  productId: string;
  initialInCart: boolean;
}

export const AddToCartOptimisticButton: React.FC<AddToCartProps> = ({
  productId,
  initialInCart,
}) => {
  const [isPending, startTransition] = useTransition();

  // Optimistic UI state
  const [optimisticInCart, setOptimisticInCart] = useOptimistic(
    initialInCart,
    (_currentState, updateValue: boolean) => updateValue
  );

  const handleToggle = async () => {
    startTransition(async () => {
      // 1. Immediately apply optimistic response
      const nextState = !optimisticInCart;
      setOptimisticInCart(nextState);

      try {
        // 2. Perform backend action
        await addToCartAction(productId, nextState);
      } catch (err) {
        // If server action fails, React 19 automatically rolls back to actual server state
        console.error("Cart update failed:", err);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
        optimisticInCart
          ? "bg-emerald-600 text-white shadow-emerald-500/25 shadow-md"
          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200"
      }`}
      aria-live="polite"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : optimisticInCart ? (
        <Check className="w-4 h-4" />
      ) : (
        <ShoppingBag className="w-4 h-4" />
      )}

      <span>{optimisticInCart ? "در سبد خرید" : "افزودن به سبد"}</span>
    </button>
  );
};
```

### 4.3 Infinite Scroll with IntersectionObserver & Retry States

Production infinite scroller with automatic viewport intersection trigger, skeleton indicators, and failure retry button:

```tsx
// src/components/feed/InfiniteProductFeed.tsx
"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { RefreshCw, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
}

interface InfiniteFeedProps {
  initialItems: Product[];
  fetchMoreAction: (page: number) => Promise<Product[]>;
}

export const InfiniteProductFeed: React.FC<InfiniteFeedProps> = ({
  initialItems,
  fetchMoreAction,
}) => {
  const [items, setItems] = useState<Product[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = () => {
    if (isPending || !hasMore) return;
    setHasError(false);

    startTransition(async () => {
      try {
        const nextItems = await fetchMoreAction(page + 1);
        if (!nextItems || nextItems.length === 0) {
          setHasMore(false);
        } else {
          setItems((prev) => [...prev, ...nextItems]);
          setPage((p) => p + 1);
        }
      } catch (err) {
        console.error("Infinite scroll fetch error:", err);
        setHasError(true);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isPending && !hasError) {
          loadMore();
        }
      },
      { rootMargin: "250px" } // Pre-load 250px before user hits bottom
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, isPending, hasError, page]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
          >
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.title}</h4>
            <p className="text-emerald-600 text-xs font-semibold mt-1">
              {item.price.toLocaleString("fa-IR")} تومان
            </p>
          </div>
        ))}
      </div>

      {/* Sentinel & Loading Indicators */}
      <div ref={sentinelRef} className="w-full py-6 flex flex-col items-center justify-center">
        {isPending && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {hasError && (
          <div className="flex flex-col items-center gap-2 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-700 dark:text-rose-400 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>خطا در دریافت اطلاعات بیشتر</span>
            </div>
            <button
              onClick={loadMore}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تلاش مجدد</span>
            </button>
          </div>
        )}

        {!hasMore && (
          <p className="text-xs text-slate-400 py-4 font-medium">
            به پایان لیست محصولات رسیدید
          </p>
        )}
      </div>
    </div>
  );
};
```

---

## 5. Advanced React 19 Loading UX & Next.js 15 Streaming

### 5.1 `useDeferredValue` for Instant Filtering with Stale Visual Cue

Keep search inputs 100% responsive without lagging the keyboard, while indicating to the user that results are updating:

```tsx
// src/components/search/ProductSearchFilter.tsx
"use client";

import React, { useState, useDeferredValue } from "react";
import { Search, Loader2 } from "lucide-react";

interface ProductSearchFilterProps {
  products: Array<{ id: string; name: string; category: string }>;
}

export const ProductSearchFilter: React.FC<ProductSearchFilterProps> = ({ products }) => {
  const [query, setQuery] = useState("");
  // Defer the expensive filtered calculations
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(deferredQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-xl mx-auto space-y-4" dir="rtl">
      {/* Search Input */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی محصول، برند یا دسته..."
          className="w-full h-12 pr-11 pl-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
        <Search className="absolute right-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
        {isStale && (
          <Loader2 className="absolute left-3.5 w-4 h-4 text-emerald-500 animate-spin" />
        )}
      </div>

      {/* Results Container with Stale Opacity Feedback */}
      <div
        className={`transition-opacity duration-150 ${
          isStale ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
        aria-busy={isStale}
      >
        <p className="text-xs text-slate-500 mb-2">
          {filtered.length.toLocaleString("fa-IR")} نتیجه یافت شد
        </p>

        <ul className="space-y-2">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center"
            >
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {item.name}
              </span>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                {item.category}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
```

### 5.2 Next.js 15 Streaming SSR with Async Server Components & Suspense Holes

Leverage React 19 streaming architecture: render the page layout immediately, and stream asynchronous database queries independently into granular slots:

```tsx
// src/app/dashboard/page.tsx
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

// Async Server Component 1 (Fast data)
async function UserProfileHeader() {
  // Simulate database call (100ms)
  await new Promise((res) => setTimeout(res, 100));
  return (
    <div className="p-4 bg-emerald-500 text-white rounded-2xl">
      <h2 className="text-lg font-bold">سلام، علی عزیز</h2>
      <p className="text-xs opacity-90">به پنل کاربری دیجی‌مون خوش آمدید</p>
    </div>
  );
}

// Async Server Component 2 (Slow dynamic data)
async function RecommendedProductsSection() {
  // Simulate external recommendation engine query (900ms)
  await new Promise((res) => setTimeout(res, 900));
  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
      <h3 className="font-bold text-sm mb-3">پیشنهادهای شگفت‌انگیز برای شما</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">گوشی هوشمند X</div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">ساعت هوشمند Pro</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" dir="rtl">
      {/* Fast slot */}
      <Suspense fallback={<Skeleton rounded="2xl" className="h-20 w-full" />}>
        <UserProfileHeader />
      </Suspense>

      {/* Slow slot streams independently without holding the page */}
      <Suspense
        fallback={
          <div className="space-y-3">
            <Skeleton rounded="xl" className="h-6 w-48" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton rounded="xl" className="h-24 w-full" />
              <Skeleton rounded="xl" className="h-24 w-full" />
            </div>
          </div>
        }
      >
        <RecommendedProductsSection />
      </Suspense>
    </div>
  );
}
```

### 5.3 Partial Prerendering (PPR) Pattern in Next.js 15

Next.js 15 supports Partial Prerendering, combining a static prerendered HTML shell with dynamic holes streamed on demand:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable PPR for granular static + dynamic streaming
    ppr: "incremental",
  },
};

export default nextConfig;
```

In your page:

```tsx
// src/app/product/[slug]/page.tsx
import { Suspense } from "react";
import { ProductGallerySkeleton } from "@/components/skeletons/ProductGallerySkeleton";

// Mark this route for Partial Prerendering
export const experimental_ppr = true;

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main className="max-w-6xl mx-auto p-4" dir="rtl">
      {/* Static Shell: rendered at build time */}
      <nav className="text-xs text-slate-500 mb-4">
        خانه / دسته‌بندی / {slug}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dynamic Hole: streamed when user requests */}
        <Suspense fallback={<ProductGallerySkeleton />}>
          <DynamicProductGallery slug={slug} />
        </Suspense>

        {/* Dynamic Pricing Hole */}
        <Suspense fallback={<div className="h-40 bg-slate-100 animate-pulse rounded-2xl" />}>
          <DynamicLivePricingSection slug={slug} />
        </Suspense>
      </div>
    </main>
  );
}
```

---

## 6. Accessibility (a11y) & Motion Safety

### 6.1 Screen Reader Announcements & ARIA Rules

1. **`aria-busy="true"`**: Place on the container currently undergoing asynchronous fetching or mutation.
2. **`aria-live="polite"`**: Use for regions that stream in new content (e.g. search suggestions, cart total). Never use `assertive` unless there is a critical transaction failure.
3. **`role="status"`**: For spinner badges and skeleton blocks.
4. **Visually Hidden Labels (`sr-only`)**: Always accompany spinners and shimmer boxes with descriptive localized text (e.g., `<span className="sr-only">در حال بارگذاری لیست سفارش‌ها...</span>`).

### 6.2 Accessible Loading Wrapper Component

```tsx
// src/components/ui/AccessibleLoadingRegion.tsx
"use client";

import React, { PropsWithChildren } from "react";
import { useReducedMotion } from "framer-motion";

interface AccessibleLoadingRegionProps extends PropsWithChildren {
  isLoading: boolean;
  loadingMessage?: string;
  className?: string;
}

export const AccessibleLoadingRegion: React.FC<AccessibleLoadingRegionProps> = ({
  children,
  isLoading,
  loadingMessage = "در حال بارگذاری داده‌های جدید...",
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-busy={isLoading}
      aria-live="polite"
      className={`relative ${shouldReduceMotion ? "motion-reduce" : ""} ${className}`}
    >
      {/* Live Region Announcement for Screen Readers */}
      <div className="sr-only" role="status">
        {isLoading ? loadingMessage : ""}
      </div>

      {children}
    </div>
  );
};
```

### 6.3 Motion-Reduced Tailwind & Framer Motion Patterns

Users with vestibular disorders configure `prefers-reduced-motion: reduce`. Always enforce:

- **Tailwind Classes:** Use `motion-reduce:animate-none` on all `.animate-pulse`, `.animate-spin`, and custom shimmers.
- **Framer Motion:** Use `useReducedMotion()` to substitute displacement animations (`x`, `y`, `scale`) with simple, instantaneous opacity fades:

```tsx
import { motion, useReducedMotion } from "framer-motion";

export const SafeAnimatedCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : 0.35,
      }}
    >
      {children}
    </motion.div>
  );
};
```

---

## 7. Performance Checklists & Anti-Patterns

### Anti-Patterns to Avoid

- ❌ **Do not use arbitrary height skeletons** that collapse or expand when real data arrives. Match exact typography `line-height` (`h-4`, `h-5`, `h-6`) and aspect ratios (`aspect-square`, `aspect-video`).
- ❌ **Do not render spinners for every list item.** Use a single batch skeleton or a unified bottom spinner.
- ❌ **Do not block the navigation thread** with heavy synchronous calculations; always wrap with React 19 `startTransition`.
- ❌ **Do not animate layout properties that trigger reflow** (`width`, `height`, `margin`, `top`). Always animate GPU-accelerated compositing properties (`transform`, `opacity`, `scale`).
- ❌ **Do not neglect RTL inversion for slide transitions:** In RTL Persian, next pages slide in from the left or enter with negative horizontal offsets relative to Western LTR designs.
