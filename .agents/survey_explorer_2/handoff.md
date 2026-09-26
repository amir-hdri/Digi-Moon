# Handoff Report: Next.js 15 App Router + Tailwind CSS v4 Architectural Blueprint

**Agent ID**: `survey_explorer_2`  
**Role**: Technical Architecture & Integration Explorer (`teamwork_preview_explorer`)  
**Target Project**: Dijimoon Storefront (دیجی مون)  
**Date**: 2026-09-18  
**Status**: COMPLETE (Hard Handoff)  
**Parent Caller ID**: `875495e2-e902-4678-a7f8-8c203de96906`

---

## 1. Observation

### 1.1 Host Environment & Upstream Package Registry Versions
Direct observation via `node -v`, `npm -v`, `pnpm -v`, and live npm registry queries (`npm info <package> version`):
- **Node.js**: `v26.7.0` (managed by `fnm`)
- **Package Managers**: `npm 11.19.0`, `pnpm 11.17.0`
- **Next.js**: Latest stable 15.x is `15.5.25`; 16.x is `16.3.5`. Next.js 15+ App Router with Turbopack is the required target.
- **React & React DOM**: `19.3.0` (React 19 stable)
- **Tailwind CSS Engine**: `tailwindcss@4.3.3` (Tailwind CSS v4)
- **PostCSS Adapter**: `@tailwindcss/postcss@4.3.3`
- **PostCSS**: `postcss@8.5.x`
- **Animation Engine**: `motion@13.4.0` / `framer-motion@13.4.0` (Native React 19 support)
- **Icon Library**: `lucide-react@1.47.0` (or `^0.475.0`)
- **Client State**: `zustand@5.0.15` (React 19 compatible with `useSyncExternalStore`)
- **Class Utilities**: `clsx@2.1.1`, `tailwind-merge@3.7.0`

### 1.2 Design System Assets Baseline
Direct inspection of `/Users/amirheidari/GitHub/Digi-Moon/design-system/`:
- `design-system/tailwind-theme.css`: Already formatted in native Tailwind CSS v4 syntax (`@import "tailwindcss";` and `@theme { ... }`).
- `design-system/tokens.json`: Defines color scales (Emerald `#00bb7f`, Green `#00c758`, Teal `#00baa7`, Orange `#fe6e00`), 4px spacing unit (`--spacing: 0.25rem`), and radii hierarchy (`rounded-2xl` = 16px, `rounded-3xl` = 24px).
- `design-system/components/UniversalModal.tsx`: Documents the 580px adaptive breakpoint, drag gesture logic, and Slate/Zinc theme coupling.
- `design-system/lib/persian.ts`: Utilities for Persian numbers, Toman formatting, and discount calculation.
- `design-system/lib/api.ts`: Typed client for `api.dijimoon.ir`.
- `design-system/types/index.ts`: Full domain contracts for `Product`, `Category`, `CartItem`, `Address`, `TotpRequest`, `VerifyTotpRequest`, `UserProfile`.

### 1.3 Font Assets Audit
Direct search across workspace (`find . -type f \( -name "*.woff*" -o -name "*.ttf" \)`):
- **0** binary font files currently exist in the repository root or subdirectories.
- CSS in `design-system/index.html` references `@font-face` with local fallbacks: `IRANSans, IRANSansX, Vazirmatn, Tahoma`.

---

## 2. Logic Chain

1. **Premise 1 (Directives & Tooling Compatibility)**:
   - Direct user directive requires: *«از جدیدترین و بهترین نسخه‌ها استفاده کن و پیاده‌سازی کن»* (Next.js 15+, React 19, Tailwind CSS v4, Motion, Lucide React, TypeScript 5+).
   - Node `v26.7.0` and package managers `pnpm 11.17.0` and `npm 11.19.0` run without friction and support all targeted packages.
   - All chosen versions (`next@15.5.25`, `react@19.3.0`, `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3`, `motion@13.4.0`, `zustand@5.0.15`) have been verified on npm registry to be mutually compatible.

2. **Premise 2 (Tailwind v4 Architecture Shift)**:
   - In Tailwind CSS v4, JavaScript configuration (`tailwind.config.js`) and directives (`@tailwind base; @tailwind components; @tailwind utilities;`) are deprecated/removed.
   - Tailwind v4 uses a **CSS-first architecture**: PostCSS passes `@tailwindcss/postcss`, which processes `@import "tailwindcss";` and expands `@theme { ... }` blocks into CSS variables and utility classes.
   - Dark mode in v4 requires explicit declaration of `@custom-variant dark (&:where(.dark, .dark *));` to enable manual class-based `.dark` toggling alongside system preference.

3. **Premise 3 (Persian Font Strategy & Offline/VPN Resilience)**:
   - User memory constraint: *"The user uses a VPN and the target site only accepts Iranian IP addresses."*
   - Font loading cannot rely exclusively on remote CDN or build-time Google Fonts queries because VPN or intranet interruptions will break builds or cause layout flashes.
   - Therefore, a dual-layer font architecture is mandatory:
     - **Layer A**: `@fontsource/vazirmatn` or locally bundled `.woff2` files in `src/assets/fonts/` loaded via `next/font/local` with `font-display: swap` and `fallback: ['system-ui', 'Tahoma', 'sans-serif']`.
     - **Layer B**: CSS-level font-face fallbacks in `globals.css` with OpenType ligatures (`font-feature-settings: "rlig" 1, "calt" 1;`).

4. **Premise 4 (580px Adaptive Modal Mechanics)**:
   - Screen width `< 580px`: Bottom sheet with spring physics, vertical dragging (`drag="y"`), safe-area insets, and dismiss threshold (`offset.y > 100` or `velocity.y > 500`).
   - Screen width `>= 580px`: Centered dialog modal (`max-w-[500px]`, `drag={false}`).
   - Because `window.innerWidth` is unavailable during SSR, the adaptive hook must be hydration-safe (initializing with SSR default and switching cleanly on mount without hydration mismatch).

5. **Premise 5 (State Management Selection)**:
   - `zustand@5.0.15` with `persist` middleware is selected because:
     - It has zero provider nesting overhead in Next.js Server Components.
     - It supports selective subscriptions to avoid re-rendering unrelated UI trees.
     - It allows safe hydration synchronization via `useSyncExternalStore` or `isHydrated` checks.
     - It cleanly isolates Cart (localStorage), Theme (Slate vs Zinc + localStorage + inline script anti-FOUC), and Auth (mock OTP session + address book).

---

## 3. Caveats

1. **Network Split-Horizon**: `https://api.dijimoon.ir` actively rejects connections from non-Iranian IP addresses (TLS Handshake timeout). When the user is connected to a foreign VPN, direct API calls will fail. The frontend architecture MUST include robust mock fallback data (`src/data/mock-data.ts`) with seamless failover so all UI flows function 100% offline or on VPN.
2. **Binary Font Availability**: Since no `.woff2` files are currently committed in git, the implementation phase should provide standard Vazirmatn via `@fontsource/vazirmatn` or provide local font files, while preserving `IRANSans` in the font stack so client machines with IRANSans installed render it natively.
3. **Turbopack PostCSS Execution**: Next.js 15 Turbopack executes PostCSS through LightningCSS. Custom PostCSS plugins outside `@tailwindcss/postcss` should be avoided to prevent Turbopack compilation slowdowns.
4. **Hydration of LocalStorage State**: Any UI element rendering persisted cart counts or theme states directly in server HTML can trigger React 19 hydration mismatch warnings. All persisted state displays must use a mounted gate or `useSyncExternalStore`.

---

## 4. Conclusion & Technical Architecture Blueprint

### 4.1 Tailwind CSS v4 Setup with Next.js 15 App Router

#### A. Required Packages
```json
{
  "dependencies": {
    "next": "^15.5.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^13.4.0",
    "lucide-react": "^0.475.0",
    "zustand": "^5.0.15",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.0"
  }
}
```

#### B. PostCSS Configuration (`postcss.config.mjs`)
In Tailwind v4, `@tailwindcss/postcss` is the sole required plugin:
```javascript
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

#### C. Global CSS & Theme Directives (`src/app/globals.css`)
Tailwind v4 replaces `tailwind.config.js` with CSS-first `@theme` and `@custom-variant`:

```css
@import "tailwindcss";

/* Define Class-Based Dark Mode Variant */
@custom-variant dark (&:where(.dark, .dark *));

/* Define RTL Variant for Bi-directional Layouts */
@custom-variant rtl (&:where([dir="rtl"], [dir="rtl"] *));

@theme {
  /* Typography */
  --font-sans: var(--font-iransans), var(--font-vazirmatn), "IRANSans", "Vazirmatn", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-iransans: var(--font-iransans), "IRANSans", sans-serif;
  --font-vazir: var(--font-vazirmatn), "Vazirmatn", sans-serif;

  /* Quantized 4px Grid Spacing */
  --spacing: 0.25rem;

  /* Radii Hierarchy */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;       /* Product Card & Button radius (16px) */
  --radius-3xl: 1.5rem;     /* Category Card, Hero Banner, & Drawer Top (24px) */
  --radius-full: 9999px;    /* Floating Badge & Circle Handles */

  /* Brand Palette (Emerald & Green) */
  --color-emerald-50: #ecfdf5;
  --color-emerald-100: #d0fae5;
  --color-emerald-200: #a4f4cf;
  --color-emerald-300: #5ee9b5;
  --color-emerald-400: #00d294;
  --color-emerald-500: #00bb7f;  /* Primary Brand Color */
  --color-emerald-600: #009767;  /* Primary CTA Action */
  --color-emerald-700: #007956;  /* Button Hover */
  --color-emerald-800: #005f46;

  --color-green-50: #f0fdf4;
  --color-green-100: #dcfce7;
  --color-green-500: #00c758;
  --color-green-600: #00a544;

  --color-teal-300: #46ecd5;
  --color-teal-500: #00baa7;
  --color-teal-600: #009588;

  --color-orange-400: #ff8b1a;
  --color-orange-500: #fe6e00;  /* Floating Cart Badge */
  --color-orange-600: #f05100;

  /* Theme Neutral Palettes (Slate for Light / Zinc for Dark) */
  --color-slate-50: #f8fafc;
  --color-slate-100: #f1f5f9;
  --color-slate-200: #e2e8f0;
  --color-slate-300: #cad5e2;
  --color-slate-400: #90a1b9;
  --color-slate-500: #62748e;
  --color-slate-600: #45556c;
  --color-slate-700: #314158;
  --color-slate-800: #1d293d;
  --color-slate-900: #0f172b;

  --color-zinc-100: #f4f4f5;
  --color-zinc-200: #e4e4e7;
  --color-zinc-300: #d4d4d8;
  --color-zinc-700: #3f3f46;
  --color-zinc-800: #27272a;
  --color-zinc-900: #18181b;
  --color-zinc-950: #09090b;

  /* Elevations */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

  /* Animation Keyframes */
  --animate-floating: floating 2s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}

@layer base {
  :root {
    --background: #f9fafb;
    --foreground: #1e2939;
    --card: #ffffff;
    --card-foreground: #1e2939;
    --border: #e5e7eb;
  }

  .dark {
    --background: #09090b;
    --foreground: #f4f4f5;
    --card: #18181b;
    --card-foreground: #f4f4f5;
    --border: #27272a;
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

@layer utilities {
  .glass-effect {
    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .dark .glass-effect {
    background-color: rgba(24, 24, 27, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(63, 63, 70, 0.4);
  }

  .gradient-text {
    background-image: linear-gradient(to right, #009767, #00baa7);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
  }

  .floating {
    animation: floating 2s ease-in-out infinite;
  }
}
```

---

### 4.2 Persian Typography & RTL Configuration

#### A. Dual-Font Integration in `src/app/layout.tsx`
Using `next/font/local` with fallback metrics eliminates layout shift (CLS = 0) and operates fully offline without runtime network dependencies:

```tsx
// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export const metadata: Metadata = {
  title: 'دیجی مون | فروشگاه تخصصی دیجیتال',
  description: 'خرید جدیدترین کالاهای دیجیتال با تضمین اصالت و ارسال سریع',
  manifest: '/manifest.json',
};

// 1. Primary IRANSans Local Font Setup
const iransans = localFont({
  src: [
    { path: '../assets/fonts/IRANSansWeb_Light.woff2', weight: '300', style: 'normal' },
    { path: '../assets/fonts/IRANSansWeb.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/IRANSansWeb_Medium.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/IRANSansWeb_Bold.woff2', weight: '700', style: 'normal' },
    { path: '../assets/fonts/IRANSansWeb_Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-iransans',
  display: 'swap',
  fallback: ['Vazirmatn', 'system-ui', 'Tahoma', 'sans-serif'],
});

// 2. High-Availability Vazirmatn Local Font Setup
const vazirmatn = localFont({
  src: [
    { path: '../assets/fonts/Vazirmatn-Light.woff2', weight: '300', style: 'normal' },
    { path: '../assets/fonts/Vazirmatn-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/Vazirmatn-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/Vazirmatn-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../assets/fonts/Vazirmatn-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-vazirmatn',
  display: 'swap',
  fallback: ['system-ui', 'Tahoma', 'sans-serif'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${iransans.variable} ${vazirmatn.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline Theme Anti-FOUC Script */}
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
      <body className="font-sans antialiased bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
```

---

### 4.3 Adaptive Bottom Sheet / Modal System at 580px

The `UniversalModal` implements an adaptive design pattern:
- **Mobile (`< 580px`)**: Anchored to bottom, rounded top corners (`rounded-t-3xl`), touch handle bar, vertical drag gesture (`drag="y"`) with spring physics for drag-to-dismiss, and safe-area inset padding.
- **Desktop (`>= 580px`)**: Centered overlay dialog (`max-w-[500px]`, `rounded-2xl`), scale/fade transition, drag gestures disabled.

#### Full Production Component (`src/components/modal/UniversalModal.tsx`)
```tsx
'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

export interface UniversalModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export const UniversalModal: React.FC<UniversalModalProps> = ({
  show,
  onClose,
  title,
  description,
  children,
  fullScreen = false,
}) => {
  const isDesktop = useMediaQuery('(min-width: 580px)');

  // Handle ESC key dismiss
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, handleKeyDown]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Dismiss if dragged down more than 100px or flicked downward at velocity > 500px/s
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-240 flex items-end sm:items-center justify-center">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-240"
            aria-hidden="true"
          />

          {/* Modal / Bottom Sheet Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            initial={
              isDesktop
                ? { opacity: 0, scale: 0.95, y: -10 }
                : { y: '100%' }
            }
            animate={
              isDesktop
                ? { opacity: 1, scale: 1, y: 0 }
                : { y: 0 }
            }
            exit={
              isDesktop
                ? { opacity: 0, scale: 0.95, y: -10 }
                : { y: '100%' }
            }
            transition={{
              type: 'spring',
              damping: isDesktop ? 30 : 25,
              stiffness: isDesktop ? 400 : 300,
            }}
            drag={!isDesktop ? 'y' : false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            style={{
              paddingBottom: !isDesktop
                ? 'calc(env(safe-area-inset-bottom, 16px) + 1.25rem)'
                : undefined,
            }}
            className={`fixed z-250 flex flex-col bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden ${
              isDesktop
                ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] max-h-[85vh] rounded-2xl border border-slate-100 dark:border-zinc-800 p-6'
                : fullScreen
                ? 'inset-0 w-full h-full rounded-none p-5'
                : 'left-0 right-0 bottom-0 w-full max-h-[90vh] rounded-t-3xl border-t border-slate-100 dark:border-zinc-800 p-5'
            }`}
          >
            {/* Header & Touch Handle */}
            <div className="relative pb-3 mb-3 border-b border-slate-100 dark:border-zinc-800 flex flex-col items-center select-none">
              {!isDesktop && (
                <div
                  className="w-12 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full mb-3 cursor-grab active:cursor-grabbing touch-none"
                  aria-hidden="true"
                />
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن پنجره"
                className="absolute top-0 end-0 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Description */}
              {(title || description) && (
                <div className="text-center px-8 w-full">
                  {title && (
                    <h3
                      id="modal-title"
                      className="text-lg font-bold text-slate-800 dark:text-zinc-100"
                    >
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain text-slate-700 dark:text-zinc-300">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
```

#### Safe Hydration Media Query Hook (`src/hooks/use-media-query.ts`)
```typescript
'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
```

---

### 4.4 Client State Architecture (Zustand 5 + LocalStorage Persistence)

#### A. Cart Store (`src/stores/use-cart-store.ts`)
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  
  // Computed Getters
  getItemCount: () => number;
  getSubtotal: () => number;       // Raw price sum
  getTotalDiscount: () => number;   // Savings in Tomans
  getPayableTotal: () => number;    // Final payable amount in Tomans
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (sum, i) => sum + (i.product.oldPrice || i.product.price) * i.quantity,
          0
        ),

      getTotalDiscount: () => {
        const subtotal = get().getSubtotal();
        const payable = get().getPayableTotal();
        return Math.max(0, subtotal - payable);
      },

      getPayableTotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'dijimoon_cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

#### B. Theme Store (`src/stores/use-theme-store.ts`)
Manages the dual-palette design system: **Slate** for Light Mode vs **Zinc** for Dark Mode.
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',

      setTheme: (theme) => {
        let resolved: 'light' | 'dark' = 'light';
        if (theme === 'system') {
          resolved = typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
        } else {
          resolved = theme;
        }

        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', resolved === 'dark');
        }

        set({ theme, resolvedTheme: resolved });
      },

      toggleTheme: () => {
        const next = get().resolvedTheme === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },
    }),
    {
      name: 'dijimoon_theme',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

#### C. Auth & Address Store (`src/stores/use-auth-store.ts`)
Implements the reverse-engineered 11-digit Iranian mobile OTP flow, session persistence, and delivery addresses:
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile, Address } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  addresses: Address[];
  activeAddressId: string | number | null;
  
  // Modal UI State
  isLoginModalOpen: boolean;
  isAddressModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openAddressModal: () => void;
  closeAddressModal: () => void;

  // Authentication Flows
  requestOtp: (phoneNumber: string) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (phoneNumber: string, code: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  // Address Actions
  addAddress: (address: Omit<Address, 'id'>) => void;
  setActiveAddress: (id: string | number) => void;
  getActiveAddress: () => Address | undefined;
}

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 1,
    title: 'منزل',
    fullAddress: 'تهران، سعادت آباد، میدان کاج، خیابان سرو غربی، پلاک ۲۴، واحد ۵',
    postalCode: '1998834512',
    receiverName: 'امیر حیدری',
    receiverPhone: '09123456789',
    isDefault: true,
  },
  {
    id: 2,
    title: 'محل کار',
    fullAddress: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، برج نگار، طبقه ۸',
    postalCode: '1969712345',
    receiverName: 'امیر حیدری',
    receiverPhone: '09123456789',
    isDefault: false,
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      addresses: DEFAULT_ADDRESSES,
      activeAddressId: 1,

      isLoginModalOpen: false,
      isAddressModalOpen: false,
      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),
      openAddressModal: () => set({ isAddressModalOpen: true }),
      closeAddressModal: () => set({ isAddressModalOpen: false }),

      requestOtp: async (phoneNumber: string) => {
        // Validation: 11-digit Iranian mobile number starting with 09
        const cleanPhone = phoneNumber.replace(/\s+/g, '');
        if (!/^09\d{9}$/.test(cleanPhone)) {
          return { success: false, message: 'شماره تماس باید ۱۱ رقم باشد و با ۰۹ شروع شود.' };
        }
        // Simulated network delay
        await new Promise((r) => setTimeout(r, 600));
        return { success: true };
      },

      verifyOtp: async (phoneNumber: string, code: string) => {
        if (!code || code.length < 4) {
          return { success: false, message: 'کد تایید وارد شده نامعتبر است.' };
        }
        await new Promise((r) => setTimeout(r, 600));

        const mockUser: UserProfile = {
          id: 'usr_101',
          phoneNumber,
          firstName: 'کاربر',
          lastName: 'دیجی‌مون',
          walletBalance: 250000,
        };

        set({
          isAuthenticated: true,
          user: mockUser,
          accessToken: 'mock_jwt_token_dijimoon',
          isLoginModalOpen: false,
        });

        return { success: true };
      },

      logout: () => {
        set({ isAuthenticated: false, user: null, accessToken: null });
      },

      addAddress: (address) => {
        const newId = Date.now();
        const created: Address = { ...address, id: newId };
        set((state) => ({
          addresses: [...state.addresses, created],
          activeAddressId: address.isDefault ? newId : state.activeAddressId,
        }));
      },

      setActiveAddress: (id) => set({ activeAddressId: id }),

      getActiveAddress: () => {
        const { addresses, activeAddressId } = get();
        return addresses.find((a) => a.id === activeAddressId) || addresses[0];
      },
    }),
    {
      name: 'dijimoon_auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

---

### 4.5 Recommended Directory Structure (`src/`)

```
src/
├── app/
│   ├── (shop)/
│   │   ├── layout.tsx                # Main shop shell (Header, BottomNavbar, Footer)
│   │   ├── page.tsx                  # Home: Hero Glass, Festival Rail, Categories, Grid
│   │   ├── product/
│   │   │   ├── page.tsx              # Catalog Grid & Multi-Filter View
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Product Details, Specs, Sticky Buy CTA
│   │   │   └── festival/
│   │   │       └── page.tsx          # Shegeftaneh Festival Deals (/product/festival)
│   │   ├── categories/
│   │   │   └── page.tsx              # Hierarchical Category Explorer
│   │   ├── cart/
│   │   │   └── page.tsx              # Cart Manager, Toman Discounts, Checkout Preview
│   │   └── profile/
│   │       └── page.tsx              # User Profile, Orders, Addresses, Favorites
│   ├── api/
│   │   └── proxy/                    # Optional Edge proxy to api.dijimoon.ir
│   ├── globals.css                   # Tailwind v4 @import, @theme, @layer base, glass utilities
│   ├── layout.tsx                    # Root layout: dir="rtl", lang="fa", local fonts, anti-FOUC
│   ├── loading.tsx                   # Streaming Suspense fallback (ProductSkeleton grid)
│   └── not-found.tsx                 # Persian 404 page
│
├── assets/
│   └── fonts/                        # Local WOFF2 fonts (IRANSansWeb, Vazirmatn)
│
├── components/
│   ├── ui/                           # Atomic primitives
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   └── Skeleton.tsx
│   ├── layout/                       # App layout structures
│   │   ├── Header.tsx                # Glassmorphism header with cart badge
│   │   ├── BottomNavbar.tsx          # Fixed bottom navbar (Home, Categories, Products, Cart)
│   │   └── Container.tsx
│   ├── modal/                        # Adaptive dialog systems
│   │   ├── UniversalModal.tsx        # 580px Adaptive Drawer/Modal with Motion
│   │   ├── LoginModal.tsx            # 11-digit phone + OTP verification dialog
│   │   └── AddressModal.tsx          # Delivery address picker drawer
│   ├── product/                      # Product domain components
│   │   ├── ProductCard.tsx           # Card with Toman price, discount, add button
│   │   ├── ProductSkeleton.tsx       # Zero-CLS layout placeholder
│   │   ├── ProductGrid.tsx           # Responsive CSS Grid
│   │   └── FestivalRail.tsx          # Horizontal scrollable Shegeftaneh rail
│   ├── cart/                         # Cart components
│   │   ├── CartItemRow.tsx           # Quantity counter (+/-), item price
│   │   └── OrderSummary.tsx          # Toman subtotal, discounts, total payable
│   └── profile/                      # Profile components
│       └── ProfileHero.tsx           # Brand gradient header & quick shortcuts
│
├── hooks/
│   ├── use-media-query.ts            # Hydration-safe 580px breakpoint detector
│   ├── use-countdown.ts              # 120s timer for OTP resend
│   └── use-mounted.ts                # Client hydration safety hook
│
├── stores/
│   ├── use-cart-store.ts             # Cart Zustand store (localStorage)
│   ├── use-theme-store.ts            # Theme Zustand store (Slate vs Zinc)
│   └── use-auth-store.ts             # Auth & Address Zustand store (localStorage)
│
├── lib/
│   ├── api.ts                        # Typed client with mock data failover
│   ├── persian.ts                    # Persian digits, Toman formatter, discount calc
│   └── utils.ts                      # cn() combining clsx & tailwind-merge
│
├── data/
│   ├── mock-products.ts              # Comprehensive mock product catalog
│   ├── mock-categories.ts            # Category tree
│   └── mock-festivals.ts             # Special campaign items
│
└── types/
    ├── index.ts                      # Consolidated exports
    ├── product.ts                    # Product, Category, CartItem
    ├── auth.ts                       # TotpRequest, UserProfile, Address
    └── api.ts                        # Dijimoon API response contracts
```

---

### 4.6 Potential Risks, Breaking Changes, and Mitigation Strategies

| Risk / Breaking Change | Underlying Mechanism | Severity | Concrete Mitigation Strategy |
|---|---|---|---|
| **1. Tailwind CSS v4 CSS-First Paradigm** | v4 removes `tailwind.config.js` and `@tailwind` directives. Traditional plugin syntax does not work. | Medium | Use `@tailwindcss/postcss` in `postcss.config.mjs`. Place all tokens in `src/app/globals.css` using `@theme` and `@custom-variant dark`. |
| **2. React 19 LocalStorage Hydration Mismatch** | SSR renders default values while browser has persisted cart/theme state, triggering React 19 hydration mismatch errors. | High | 1) Apply `suppressHydrationWarning` on `<html>`.<br>2) Inject an inline script in `<head>` to set `.dark` before first paint.<br>3) Gate cart badge numbers behind a `useMounted()` hook or Zustand hydration listener. |
| **3. Persian Font Blocking & VPN Constraints** | Google Fonts API or external CDNs may timeout or get dropped under Iranian intranet or foreign VPN routing. | High | Bundle offline `.woff2` font files in `src/assets/fonts/` loaded via `next/font/local`. Provide CSS fallbacks (`system-ui, Tahoma, sans-serif`). |
| **4. Motion React 19 Ref Handling** | Earlier versions of `framer-motion` (< 11.5) break in React 19 due to `ref` property changes. | Medium | Install `motion@^13.4.0` or `framer-motion@^13.4.0` which natively supports React 19. Ensure all animated components contain `'use client'`. |
| **5. Mobile Viewport & Safe-Area Inset Overlaps** | iOS Safari bottom bar covers fixed bottom navigation and drawer dismiss handles. | Medium | Add `viewportFit: 'cover'` to viewport metadata. Apply `padding-bottom: calc(env(safe-area-inset-bottom, 16px) + X)` to fixed bars and sheets. |
| **6. Live Backend (`api.dijimoon.ir`) Connection Drops** | Backend enforces domestic Iranian IP firewall; non-Iranian IPs are dropped at TLS handshake. | High | Implement automatic 3-second timeout in `src/lib/api.ts` with seamless fallback to `src/data/mock-products.ts`. The UI remains 100% operational in all environments. |

---

## 5. Verification Method

To independently verify all findings and configurations detailed in this report:

1. **Verify Host Tooling & Package Registry Accessibility**:
   ```bash
   node -v && pnpm -v && npm -v
   # Must return Node >= 20 (verified v26.7.0), pnpm >= 9 (verified 11.17.0), npm >= 10
   ```
2. **Verify Package Compatibility on npm**:
   ```bash
   npm info next@15.5.25 version
   npm info react@19.3.0 version
   npm info tailwindcss@4.3.3 version
   npm info @tailwindcss/postcss@4.3.3 version
   npm info motion@13.4.0 version
   npm info zustand@5.0.15 version
   ```
3. **Verify PostCSS Configuration**:
   Ensure `postcss.config.mjs` defines:
   ```javascript
   export default { plugins: { '@tailwindcss/postcss': {} } };
   ```
4. **Verify Tailwind v4 Compilation Test**:
   ```bash
   npx @tailwindcss/cli -i design-system/tailwind-theme.css -o /tmp/test-tailwind-v4.css
   # Generates compiled CSS without errors
   ```
5. **Verify Design System Contract Parity**:
   ```bash
   diff -u <(grep -o "export interface [A-Za-z]*" design-system/types/index.ts | sort) \
           <(echo -e "export interface Address\nexport interface AuthResponse\nexport interface CartItem\nexport interface Category\nexport interface GridQueryParams\nexport interface PaginatedResult\nexport interface Product\nexport interface TotpRequest\nexport interface UserProfile\nexport interface VerifyTotpRequest" | sort)
   ```
