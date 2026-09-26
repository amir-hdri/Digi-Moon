---
name: web-performance-optimization
description: >-
  Use when analyzing, profiling, or optimizing web performance, Core Web Vitals
  (LCP, INP, CLS, TTFB), Next.js 15 App Router architecture, bundle size, asset delivery,
  streaming SSR, React 19 concurrent features, or runtime rendering efficiency.
  Trigger on mentions of: Core Web Vitals, LCP, INP, CLS, TTFB, bundle analyzer,
  image optimization, Persian font subsetting, code splitting, lazy loading,
  virtualization, PPR, ISR, hydration lag, or slow page load.
---

# Web Performance Optimization & Core Web Vitals Runbook

## Overview

A production-grade performance runbook for modern web applications built on **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Motion / Framer Motion 13**, specifically optimized for high-performance e-commerce platforms (such as Digi-Moon / Moon Market) operating in challenging network conditions (RTL typography, domestic edge networks, mobile 4G/LTE, and high-latency VPN environments).

---

## 1. Core Web Vitals: Targets & Diagnostic Triage

### 1.1 Vital Metrics Targets (75th Percentile)

| Metric | Target | Needs Improvement | Poor | Primary Impact Area |
|---|---|---|---|---|
| **LCP** (Largest Contentful Paint) | **≤ 2.5 s** | 2.5 s – 4.0 s | > 4.0 s | Perceived load speed (hero image / banner / title) |
| **INP** (Interaction to Next Paint) | **≤ 200 ms** | 200 ms – 500 ms | > 500 ms | UI responsiveness on tap, click, or keypress |
| **CLS** (Cumulative Layout Shift) | **≤ 0.1** | 0.1 – 0.25 | > 0.25 | Visual stability during render and hydration |
| **TTFB** (Time to First Byte) | **≤ 800 ms** | 800 ms – 1.8 s | > 1.8 s | Server latency, database queries, edge caching |

```
Diagnostic Decision Flow:
Slow Page Load Identified
├── TTFB > 800ms? 
│   ├── YES → Fix server data waterfalls, DB indexes, implement Edge / ISR / Stale-While-Revalidate caching.
│   └── NO  → Check LCP.
├── LCP > 2.5s?
│   ├── Is LCP an Image? → Add priority, sizes, modern format (AVIF/WebP), preload header.
│   ├── Is LCP Text?     → Subset Persian font, eliminate render-blocking CSS/JS, use font-display: swap.
│   └── NO  → Check Layout & Interaction.
├── CLS > 0.1?
│   ├── Image/Banner shifting? → Set explicit width/height or aspect-ratio (aspect-video / aspect-[4/3]).
│   ├── Font swap shifting?   → Match fallback font metrics (size-adjust, ascent-override).
│   └── Dynamic content?      → Reserve skeleton container height prior to data fetch.
└── INP > 200ms?
    ├── Long task in handler?  → Split using scheduler.yield() or React 19 useTransition.
    ├── Massive re-renders?    → Isolate state to leaf components, memoize callbacks, virtualize long lists.
    └── Heavy hydration lag?   → Convert client components to React Server Components (RSC).
```

### 1.2 Measuring Core Web Vitals in Next.js 15

Create a dedicated client component or hook to stream real user metrics (RUM) to your analytics endpoint:

```tsx
// src/components/analytics/web-vitals.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Only report production metrics
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Web Vital] ${metric.name}:`, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      });
      return;
    }

    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      page: window.location.pathname,
    });

    // Use sendBeacon for guaranteed delivery without blocking unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    } else {
      fetch('/api/analytics/vitals', { body, method: 'POST', keepalive: true });
    }
  });

  return null;
}
```

---

## 2. Deep-Dive Optimization: Core Web Vitals

### 2.1 Largest Contentful Paint (LCP) Optimization

LCP consists of four sub-phases:
1. **Time to First Byte (TTFB)** (target: ~40% of total LCP budget)
2. **Resource Load Delay** (target: < 10% of total LCP budget)
3. **Resource Load Duration** (target: ~40% of total LCP budget)
4. **Element Render Delay** (target: < 10% of total LCP budget)

#### Strategy A: Eliminate Resource Load Delay for Hero Media
The LCP resource must be discovered **immediately** in the initial HTML response. Never load hero images via client-side `useEffect`, dynamic imports, or lazy loaders.

```tsx
// src/components/home/hero-banner.tsx
import Image from 'next/image';

interface HeroBannerProps {
  imageUrl: string;
  mobileImageUrl?: string;
  alt: string;
  title: string;
}

export function HeroBanner({ imageUrl, alt, title }: HeroBannerProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-zinc-800 aspect-[21/9] sm:aspect-[2.8/1]">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority // 1. Emits <link rel="preload"> in <head>
        fetchPriority="high" // 2. High network priority in Chromium
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px" // 3. Accurate viewport budgeting
        quality={85}
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 md:p-10">
        <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">
          {title}
        </h1>
      </div>
    </section>
  );
}
```

#### Strategy B: Early Preconnect to Image & API Domains
Add preconnect links for third-party media or backend API hosts directly in `src/app/layout.tsx`:

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Preconnect to critical image CDN and API servers */}
        <link rel="preconnect" href="https://api.dijimoon.ir" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.dijimoon.ir" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### 2.2 Interaction to Next Paint (INP) Optimization

INP measures the latency of all user interactions (clicks, taps, typing) and reports the worst interaction duration. Tasks exceeding **50 ms** are flagged as "Long Tasks" that block the main thread.

#### Strategy A: Non-blocking UI Updates with React 19 `useTransition`
When an interaction triggers both an immediate visual response (like updating a search input) and an expensive state calculation (like filtering 2,000 product cards), separate them using `useTransition`:

```tsx
// src/components/catalog/search-filter.tsx
'use client';

import { useState, useTransition, useDeferredValue } from 'react';
import type { Product } from '@/types/product';

interface SearchFilterProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export function SearchFilter({ products, onSelect }: SearchFilterProps) {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextQuery = e.target.value;
    
    // 1. URGENT: Update input value immediately (Zero INP delay)
    setQuery(nextQuery);

    // 2. NON-URGENT: Run heavy filtering in a concurrent transition
    startTransition(() => {
      const lower = nextQuery.toLowerCase();
      const results = products.filter(
        (p) => p.name.toLowerCase().includes(lower) || p.sku.includes(lower)
      );
      setFilteredProducts(results);
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={handleSearchChange}
          placeholder="جستجوی کالای مورد نظر..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        {isPending && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 animate-pulse">
            در حال جستجو...
          </div>
        )}
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
        {filteredProducts.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p)}
            className="p-3 text-right rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-500"
          >
            <div className="font-semibold text-sm">{p.name}</div>
            <div className="text-emerald-600 dark:text-emerald-400 text-xs mt-1">{p.price.toLocaleString('fa-IR')} تومان</div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### Strategy B: Breaking Long Tasks with `scheduler.yield()`
When executing heavy non-React computations (e.g., parsing large JSON payloads, client-side cryptographic signatures, bulk Excel exports), yield back to the main thread:

```ts
// src/lib/performance/yield-to-main.ts
export async function yieldToMain(): Promise<void> {
  // Use experimental scheduler.yield if available in Chromium
  if ('scheduler' in window && 'yield' in (window as any).scheduler) {
    return (window as any).scheduler.yield();
  }
  // Fallback to MessageChannel or setTimeout macrotask
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => resolve();
    channel.port2.postMessage(null);
  });
}

// Chunking long iteration to avoid main thread freeze
export async function processInChunks<T, R>(
  items: T[],
  processItem: (item: T) => R,
  chunkSize = 100
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i++) {
    results.push(processItem(items[i]));
    if (i % chunkSize === 0) {
      await yieldToMain(); // Yield control so browser can paint & handle user inputs
    }
  }
  return results;
}
```

---

### 2.3 Cumulative Layout Shift (CLS) Prevention

CLS occurs when visible elements change their position from one rendered frame to the next. Common culprits: images without dimensions, late-injected banners, web fonts swapping metrics, and dynamic ad slots.

#### Strategy A: Strict Aspect Ratio Containers
Always reserve space for images, video players, and banners using CSS `aspect-ratio` or Tailwind CSS classes:

```tsx
// Using Tailwind CSS v4 aspect ratios:
// Good: aspect-square, aspect-video, aspect-[4/3], aspect-[16/9]
<div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800">
  <Image
    src={product.imageUrl}
    alt={product.title}
    fill
    sizes="(max-width: 768px) 50vw, 300px"
    className="object-cover"
  />
</div>
```

#### Strategy B: Dynamic Notification & Banner Placeholders
Never insert top floating banners without reserving their height in the layout flow:

```tsx
// src/components/layout/announcement-bar.tsx
'use client';

import { useState } from 'react';

export function AnnouncementBar({ message }: { message: string }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    // Height explicitly pinned to avoid shifting the navigation underneath
    <div className="h-10 w-full bg-emerald-600 text-white flex items-center justify-between px-4 text-xs font-medium">
      <span className="truncate">{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-emerald-700 rounded transition-colors"
        aria-label="بستن اعلان"
      >
        ✕
      </button>
    </div>
  );
}
```

#### Strategy C: Zero-CLS Persian Font Loading
When loading Persian fonts like **Vazirmatn**, mismatched fallback glyph sizes cause jarring layout shifts. Configure font fallback metrics or use `next/font/local` with pre-calculated font metrics:

```ts
// src/lib/fonts.ts
import localFont from 'next/font/local';

export const vazirmatn = localFont({
  src: [
    {
      path: '../../public/fonts/vazirmatn/Vazirmatn-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/vazirmatn/Vazirmatn-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/vazirmatn/Vazirmatn-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/vazirmatn/Vazirmatn-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-vazirmatn',
  display: 'swap', // Shows system font immediately, swaps when ready
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: 'Arial', // Next.js calculates size-adjust & ascent-override to eliminate shift!
});
```

---

### 2.4 Time to First Byte (TTFB) Optimization

In Iran, international transit routes often suffer from high ping and jitter. Optimizing TTFB is vital for responsive application feel.

#### Strategy A: Parallel Data Fetching with `Promise.all`
Never chain independent server queries sequentially. Run them concurrently in your React Server Components:

```tsx
// src/app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getProductDetails, getProductReviews, getRelatedProducts } from '@/services/product-service';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // FAST: Fetch all independent data in parallel
  const [product, reviews, related] = await Promise.all([
    getProductDetails(id),
    getProductReviews(id),
    getRelatedProducts(id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductHeader product={product} />
      <ProductTabs reviews={reviews} related={related} />
    </main>
  );
}
```

#### Strategy B: Caching Dynamic Server Queries with `unstable_cache`
Cache high-traffic dynamic database or REST queries using Next.js caching:

```ts
// src/services/product-service.ts
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db';

export const getCachedFeaturedProducts = unstable_cache(
  async (categorySlug: string) => {
    return await db.product.findMany({
      where: { category: { slug: categorySlug }, isFeatured: true },
      take: 12,
      select: { id: true, name: true, price: true, slug: true, imageUrl: true },
    });
  },
  ['featured-products'], // Cache key prefix
  {
    revalidate: 300, // 5 minutes TTL
    tags: ['products', 'featured'], // Targeted on-demand invalidation
  }
);
```

---

## 3. Next.js 15 & React 19 Core Optimizations

### 3.1 Next.js Image Configuration (`next.config.ts`)

Configure modern formats (AVIF first, fallback WebP), strict device sizes, and optimal cache lifetimes:

```ts
// next.config.ts
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  reactStrictMode: true,
  images: {
    // 1. AVIF is 20-30% smaller than WebP at identical visual fidelity
    formats: ['image/avif', 'image/webp'],
    // 2. Exact breakpoint matches for responsive layouts
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dijimoon.ir', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
  experimental: {
    // Enable View Transitions for instant SPA tab transitions
    viewTransition: true,
  },
};

export default nextConfig;
```

#### Responsive Sizes Formula
Always supply the correct `sizes` attribute. Do not rely on `100vw`:
- **Full Width Hero:** `sizes="100vw"`
- **2-Column Grid (Desktop) / 1-Column (Mobile):** `sizes="(max-width: 768px) 100vw, 50vw"`
- **4-Column Product Grid:** `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"`
- **Avatar / Small Icon:** `sizes="48px"` (Specify fixed pixel budget)

---

### 3.2 Script Loading Strategies (`next/script`)

Third-party tracking scripts (Google Tag Manager, Raychat, Yandex Metrika) can severely degrade TBT (Total Blocking Time) and INP if loaded prematurely.

```tsx
// src/components/analytics/third-party-scripts.tsx
import Script from 'next/script';

export function ThirdPartyScripts() {
  return (
    <>
      {/* 1. Critical Analytics: Execute after hydration without delaying paint */}
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXX');
          `,
        }}
      />

      {/* 2. Customer Support Chat (Raychat / Crisp): Load strictly during browser idle */}
      <Script
        id="live-chat"
        strategy="lazyOnload"
        src="https://widget.raychat.io/scripts/js/YOUR-TOKEN"
      />
    </>
  );
}
```

| Strategy | When It Runs | Best Used For |
|---|---|---|
| `beforeInteractive` | In initial HTML before hydration | Polyfills, security headers, anti-tamper |
| `afterInteractive` | Immediately after hydration | Google Analytics, core trackers |
| `lazyOnload` | During browser idle time (`requestIdleCallback`) | Support chat widgets, social embeds, feedback forms |
| `worker` | In web worker via Partytown | Heavy marketing tags, tracking pixels |

---

### 3.3 Dynamic Code Splitting with `next/dynamic`

Heavy interactive components (modals, sheet drawers, map pickers, rich text editors) must be loaded dynamically on demand:

```tsx
// src/components/checkout/delivery-location-picker.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Heavy map component (Leaflet / Neshan) loaded only when user clicks "انتخاب آدرس"
const InteractiveMapModal = dynamic(
  () => import('@/components/map/interactive-map-modal').then((mod) => mod.InteractiveMapModal),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="w-full max-w-xl h-96 bg-white dark:bg-zinc-900 rounded-2xl flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500">در حال بارگذاری نقشه...</span>
        </div>
      </div>
    ),
    ssr: false, // Prevents window is undefined and keeps server bundle lean
  }
);

export function DeliveryLocationPicker() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"
      >
        انتخاب موقعیت مکانی روی نقشه
      </button>

      {isOpen && <InteractiveMapModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}
```

---

### 3.4 Partial Prerendering (PPR) & React 19 Streaming Suspense

Next.js 15 PPR allows serving a **static shell** instantly from the edge CDN, while streaming personalized or dynamic segments in parallel inside React `<Suspense>` boundaries.

```tsx
// src/app/page.tsx
import { Suspense } from 'react';
import { HeroBanner } from '@/components/home/hero-banner';
import { CategoryGrid } from '@/components/home/category-grid';
import { PersonalizedRecommendations } from '@/components/home/personalized-recommendations';
import { RecommendationsSkeleton } from '@/components/home/recommendations-skeleton';

export default function HomePage() {
  return (
    <div className="space-y-8 container mx-auto px-4 py-6">
      {/* 1. STATIC SHELL: Instant paint from CDN cache (Zero TTFB delay) */}
      <HeroBanner
        imageUrl="/banners/spring-festival.webp"
        alt="جشنواره تخفیف‌های بهاره مون مارکت"
        title="تخفیف‌های ویژه سوپرمارکت تا ۵۰٪"
      />

      <CategoryGrid />

      {/* 2. DYNAMIC STREAMING HOLE: Streamed asynchronously without delaying initial LCP */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <PersonalizedRecommendations />
      </Suspense>
    </div>
  );
}
```

---

### 3.5 React 19 Optimistic Mutations (`useOptimistic`)

Do not make the user wait for network roundtrips when performing routine mutations like adding an item to the shopping cart:

```tsx
// src/components/cart/add-to-cart-button.tsx
'use client';

import { useOptimistic, useTransition } from 'react';
import { addToCartAction } from '@/actions/cart';
import type { CartItem } from '@/types/cart';

interface AddToCartButtonProps {
  productId: string;
  initialQuantity: number;
}

export function AddToCartButton({ productId, initialQuantity }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  // Optimistic UI updates state instantly before the server action returns
  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic(
    initialQuantity,
    (current, update: number) => current + update
  );

  const handleIncrement = () => {
    startTransition(async () => {
      // 1. Instant feedback to user
      setOptimisticQuantity(1);
      // 2. Execute server action in background
      await addToCartAction(productId, 1);
    });
  };

  return (
    <button
      onClick={handleIncrement}
      disabled={isPending}
      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all active:scale-[0.98] disabled:opacity-80"
    >
      افزودن به سبد ({optimisticQuantity})
    </button>
  );
}
```

---

## 4. Bundle Optimization & Tree Shaking

### 4.1 Analyzing Bundle with `@next/bundle-analyzer`

Add the analyzer package to identify overweight vendor dependencies:

```bash
npm install -D @next/bundle-analyzer
```

Update `next.config.ts`:

```ts
// next.config.ts
import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  // Tree-shake specific barrel exports automatically in Next.js 15
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'motion',
      'zustand',
      'clsx',
    ],
  },
};

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default analyzer(nextConfig);
```

Add an execution script in `package.json`:
```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

### 4.2 Eliminating Barrel File Performance Pitfalls

Barrel files (`index.ts` exporting hundreds of icons or utilities) force webpack/turbopack to parse thousands of unused modules, bloating memory and initial bundle evaluation time.

```ts
// ❌ ANTI-PATTERN: Can pull in 1,400+ SVGs into chunk compilation
import { ShoppingCart, Search, User, Heart } from 'lucide-react';

// ✅ BEST PRACTICE: If optimizePackageImports is configured, the above is safe.
// Otherwise, import from subpath or specific icons:
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
```

---

## 5. Persian Typography & Asset Optimization

### 5.1 Unicode Subsetting for Persian & Arabic Characters

Full Arabic/Persian/Latin/Cyrillic font files are ~250KB–500KB. By subsetting to only the characters used in Persian web applications (Persian, Arabic, Latin numerals, standard punctuation), the WOFF2 font size drops to **under 35KB**.

Standard Unicode Ranges for Persian (Farsi) websites:
```css
/* Persian & Standard Arabic character range */
unicode-range: 
  U+0600-06FF,   /* Arabic basic */
  U+0750-077F,   /* Arabic Supplement */
  U+FB50-FDFF,   /* Arabic Presentation Forms-A (Persian letters: گ, چ, پ, ژ) */
  U+FE70-FEFF,   /* Arabic Presentation Forms-B */
  U+0020-007E,   /* Basic Latin (Numbers, English, Punctuation) */
  U+06F0-06F9;   /* Persian digits (۰, ۱, ۲, ۳, ۴, ۵, ۶, ۷, ۸, ۹) */
```

### 5.2 Responsive WebP/AVIF Image Generation Pipeline

Ensure backend image pipelines (or Next.js Image Optimization) strip unnecessary EXIF metadata and deliver images in modern formats:

```ts
// Example: Validating optimal image loader parameters
export function getOptimizedImageUrl(src: string, width: number, quality = 80): string {
  if (src.startsWith('https://images.unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('auto', 'format'); // Delivers AVIF or WebP automatically
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }
  return src;
}
```

---

## 6. Network, Caching & Edge Optimization

### 6.1 HTTP Cache-Control Configuration

Serve static hashed bundles (`/_next/static/*`) with immutable caching headers, and dynamic assets with `stale-while-revalidate`:

```ts
// next.config.ts (Custom Headers)
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Immutable cache for all fingerprinted Next.js static assets
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Public fonts
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API responses: Cache at edge for 60s, serve stale for up to 24 hours
        source: '/api/catalog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};
```

### 6.2 Resource Priority Hints

Use `fetchPriority="high"` and `<link rel="preload">` judiciously:
- **Do preload:** The single hero LCP image on the initial landing page.
- **Do preload:** The primary Persian font file (`Vazirmatn.woff2`).
- **DO NOT preload:** Secondary carousel slides, footer images, or below-the-fold scripts.

---

## 7. Runtime Performance & React 19 Concurrency

### 7.1 Virtualization for Massive Product Catalogs

When displaying thousands of items in search feeds or order histories, rendering all DOM nodes destroys memory and causes severe INP delay. Use `@tanstack/react-virtual`:

```tsx
// src/components/catalog/virtualized-product-grid.tsx
'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/catalog/product-card';

interface VirtualizedProductGridProps {
  products: Product[];
}

export function VirtualizedProductGrid({ products }: VirtualizedProductGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Approximate 3 items per row on mobile, 4 on desktop
  const itemsPerRow = 3;
  const rowCount = Math.ceil(products.length / itemsPerRow);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 360, // Estimated height of a single product card row in px
    overscan: 2, // Pre-render 2 rows above and below viewport
  });

  return (
    <div
      ref={parentRef}
      className="h-[750px] overflow-y-auto w-full rounded-2xl border border-slate-200 dark:border-zinc-800 p-4"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * itemsPerRow;
          const rowProducts = products.slice(startIndex, startIndex + itemsPerRow);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="grid grid-cols-3 gap-4"
            >
              {rowProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

### 7.2 Off-Screen Rendering with `content-visibility: auto`

For long e-commerce pages with multiple vertical sections (e.g., "Special Offers", "Brand Carousel", "Customer Reviews", "FAQ Accordion"), use the CSS `content-visibility` property to skip rendering offscreen DOM:

```css
/* src/app/globals.css */
.content-auto {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* Reserves estimated vertical height to prevent scrollbar jumping */
}
```

Apply this class to non-critical below-the-fold sections:
```tsx
<section className="content-auto my-12">
  <CustomerReviewsSection />
</section>
```

---

### 7.3 High-Performance Motion & Animation Rules

Framer Motion and Motion 13 can trigger severe main-thread lag if animating non-GPU properties.

#### Rule 1: Only Animate `transform` and `opacity`
- ❌ **Avoid:** Animating `height`, `width`, `top`, `left`, `margin`, `padding` (causes layout recalculation & repaint).
- ✅ **Use:** `transform: translateY()`, `scale()`, and `opacity` (handled directly by compositor thread).

```tsx
// ✅ GPU-Accelerated Accordion / Drawer Animation
import { motion, AnimatePresence } from 'framer-motion';

export function QuickViewDrawer({ isOpen, onClose, children }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl p-6 z-50 will-change-transform"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

#### Rule 2: Prefer Tailwind CSS Transitions for Simple Hover Effects
Avoid wrapping hundreds of catalog cards in heavy Framer Motion components just for a scale effect. Use pure Tailwind CSS:

```tsx
// Zero JS overhead hover scale
<div className="transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg will-change-transform">
  <ProductCard />
</div>
```

---

## 8. Performance Audit & Verification Checklist

Before releasing any new feature or route to production, verify against this checklist:

| Check | Tool / Verification | Pass Criteria |
|---|---|---|
| **LCP** | Chrome DevTools Performance Panel / Lighthouse | ≤ 2.5s on simulated Slow 4G |
| **INP** | Chrome DevTools `Interaction` lane | ≤ 200ms on all clicks, filters, modals |
| **CLS** | Lighthouse / Layout Shift GIF Generator | ≤ 0.1 on initial load and scrolling |
| **TTFB** | Network Tab (Timing breakdown) | ≤ 800ms to first HTML byte |
| **LCP Image Preload** | Page Source (`curl -s <url> \| grep preload`) | `<link rel="preload" as="image" ...>` present |
| **Font Delivery** | Network Tab (Filter: `font`) | Fonts loaded via WOFF2, size < 40KB per weight |
| **Bundle Splitting** | `npm run analyze` | Initial JS chunk < 100KB gzipped |
| **Hydration Check** | Console tab | Zero React Hydration Mismatch warnings |
| **Image Formats** | Network Tab (Type: `image`) | Delivered as `image/avif` or `image/webp` |
| **Tree Shaking** | Bundle Treemap | Zero unneeded full libraries (e.g., entire `lodash` or `lucide-react`) |
