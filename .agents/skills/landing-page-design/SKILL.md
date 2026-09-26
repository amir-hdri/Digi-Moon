---
name: landing-page-design
description: >-
  Use when designing, architecting, building, optimizing, or auditing high-converting,
  visually stunning landing pages in Next.js 15+ (App Router), React 19, Tailwind CSS v4,
  and Framer Motion / Motion. Trigger on requests involving landing page layouts, hero
  sections, bento grids, pricing tables, social proof, scroll-driven storytelling,
  Persian/Farsi RTL design, conversion rate optimization (CRO), glassmorphism, or SEO.
---

# Professional Landing Page Design & Development (Next.js 15 + React 19 + Tailwind v4)

A production-grade guide and reference manual for crafting ultra-high-performance, high-converting, visually breathtaking landing pages. Tailored specifically for modern Next.js 15 App Router applications with Tailwind CSS v4, Motion (Framer Motion 13+), and full Persian (Farsi) RTL-first architecture.

---

## Table of Contents
1. [Architectural Principles & Above-the-Fold Strategy](#1-architectural-principles--above-the-fold-strategy)
2. [Landing Page Hero Archetypes](#2-landing-page-hero-archetypes)
3. [Section-Based Layout Patterns & Narrative Flow](#3-section-based-layout-patterns--narrative-flow)
4. [Visual Design Patterns & Tailwind CSS v4 Tokens](#4-visual-design-patterns--tailwind-css-v4-tokens)
5. [Scroll-Driven Storytelling & Motion Animations](#5-scroll-driven-storytelling--motion-animations)
6. [Responsive Architecture & Mobile-First Optimization](#6-responsive-architecture--mobile-first-optimization)
7. [SEO, Structured Data & Core Web Vitals](#7-seo-structured-data--core-web-vitals)
8. [Persian / Farsi RTL Conversion Rate Optimization (CRO)](#8-persian--farsi-rtl-conversion-rate-optimization-cro)
9. [Complete Production Landing Page Template](#9-complete-production-landing-page-template)
10. [Pre-Launch Quality & Audit Checklist](#10-pre-launch-quality--audit-checklist)

---

## 1. Architectural Principles & Above-the-Fold Strategy

### 1.1 The Above-the-Fold Anatomy
Visitors make their initial subconscious judgement in **50 milliseconds**. The above-the-fold canvas (the initial 100vh) must answer 3 questions instantly:
1. **What is it?** (Clarity beats cleverness)
2. **What value does it bring to me?** (Benefit-driven subheadline)
3. **What is my immediate next action?** (Zero-friction Primary CTA)

```
+-------------------------------------------------------------------------+
| [Navbar: Logo (Right)]   [Nav Links (Center)]   [Secondary CTA (Left)]   |
+-------------------------------------------------------------------------+
|                                                                         |
|  [Announcement Badge: "نسخه جدید منتشر شد ✨"]                           |
|                                                                         |
|  [H1: Bold Headline with Gradient Accent Text]                          |
|  [Subhead: 2-line high-contrast value proposition]                       |
|                                                                         |
|  [Primary CTA Button]   [Secondary Ghost/Video CTA]                     |
|  [Micro-copy: "بدون نیاز به کارت اعتباری • ۱۴ روز تست رایگان"]            |
|                                                                         |
|  [Social Proof Strip: Avatars + 4.9/5 Rating + "مورد اعتماد ۱۰,۰۰۰+ تیم"]|
|                                                                         |
|  [Hero Visual: High-Performance Glass Mockup / Interactive Demo]         |
+-------------------------------------------------------------------------+
```

### 1.2 Performance & Rendering Architecture (Next.js 15 + React 19)
- **Default to React Server Components (RSC)**: Keep the page root, structural wrappers, copy, and SEO markup as server components to guarantee instant Time-to-First-Byte (TTFB) and zero client JS overhead for static sections.
- **Isolate Client Components to "Leaf Islands"**: Only interactive widgets (e.g., pricing frequency toggle, mobile navigation drawer, interactive bento cards, FAQ accordions, animated counters) should declare `'use client'`.
- **Hero Image Priority**: Always set `priority={true}` and specify explicit `sizes` on the main hero graphic to prevent Largest Contentful Paint (LCP) delays.
- **Zero CLS Guarantee**: Never render dynamically sizing elements without reserved container heights (`aspect-video`, `min-h-[...]`, or placeholder skeletons).

---

## 2. Landing Page Hero Archetypes

### Pattern A: Split Hero (Classic SaaS & Tech Product)
Text on the right (in RTL), visual product preview on the left. Highly responsive, collapses gracefully on mobile.

```tsx
// src/components/landing/SplitHero.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ShieldCheck, Star } from 'lucide-react';

export function SplitHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-32">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 right-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-20 -z-10 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Content Column (RTL: Starts on Right) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:col-span-7 lg:text-start"
          >
            {/* Announcement Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span>معرفی نسل جدید هوش مصنوعی دیجی‌مون</span>
            </div>

            {/* Main H1 Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-normal text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              مدیریت هوشمند دارایی‌ها،{' '}
              <span className="bg-gradient-to-l from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                سریع‌تر و دقیق‌تر
              </span>{' '}
              از همیشه
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-zinc-300">
              پلتفرم یکپارچه تحلیل داده و نظارت خودکار، با رابط کاربری روان و بهینه‌سازی اختصاصی برای کسب‌وکارهای مدرن ایرانی.
            </p>

            {/* CTA Action Cluster */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-600/40 active:scale-[0.98] sm:w-auto"
              >
                <span>شروع رایگان آزمایشی</span>
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              </Link>
              
              <Link
                href="#demo"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-7 py-4 text-base font-semibold text-slate-700 backdrop-blur-md transition-all duration-200 hover:border-slate-300 hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:w-auto"
              >
                مشاهده دمو تصویری
              </Link>
            </div>

            {/* Trust Signals & Social Proof Strip */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-slate-200/60 pt-6 lg:justify-start dark:border-zinc-800/60">
              <div className="flex -space-x-2 space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-zinc-950 bg-slate-200 dark:bg-zinc-800 overflow-hidden"
                  >
                    <Image
                      src={`/avatars/user-${i}.webp`}
                      alt="کاربر"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-bold text-slate-800 dark:text-zinc-100 ms-1">۴.۹/۵</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  مورد اعتماد بیش از <span className="font-semibold text-slate-700 dark:text-zinc-200">۵,۰۰۰+</span> کسب‌وکار فعال
                </p>
              </div>
            </div>
          </motion.div>

          {/* Visual Showcase Column (Left side in RTL) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:col-span-5"
          >
            {/* Glowing Backdrop Border */}
            <div className="relative rounded-3xl p-2 bg-gradient-to-b from-white/40 to-white/10 dark:from-white/10 dark:to-transparent shadow-2xl backdrop-blur-xl border border-white/30 dark:border-white/10">
              <div className="overflow-hidden rounded-2xl bg-slate-900 aspect-[4/3] relative">
                <Image
                  src="/dashboard-preview.webp"
                  alt="نمای داشبورد تحلیل داده"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>

              {/* Floating Floating Micro-Widget */}
              <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-md dark:border-zinc-700/60 dark:bg-zinc-900/90">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">امنیت تضمین‌شده</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-zinc-100">رمزنگاری سرتاسری ۲۵۶ بیتی</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

---

### Pattern B: Full-Width Ambient Gradient Hero
Ideal for high-impact brand launches, AI tools, developer products, and luxury tech.

```tsx
// src/components/landing/AmbientGradientHero.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

export function AmbientGradientHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 pt-24 pb-16">
      {/* Dynamic Ambient Gradient Canvas */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-gradient-to-tr from-emerald-600/20 via-teal-500/20 to-indigo-600/20 blur-[130px]" />
        {/* Subtle CSS Grid Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-6"
        >
          <span>تکنولوژی نوین مقیاس‌پذیر در ایران</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-black tracking-normal text-slate-900 sm:text-6xl lg:text-7xl leading-[1.25] dark:text-white"
        >
          تجربه آینده وب با سیستم هوشمند{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
            دیجی‌مون
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-slate-600 dark:text-zinc-300 leading-relaxed"
        >
          قدرت خودکارسازی فرایندها، معماری داده بلادرنگ و امنیت پایدار در یک چارچوب مدرن، آماده برای رشد تصاعدی کسب‌وکار شما.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/get-started"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>شروع بدون تعهد</span>
            <ChevronLeft className="h-4 w-4" />
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-slate-300 dark:border-zinc-700 bg-transparent px-8 py-4 text-base font-medium text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors"
          >
            درخواست مشاوره اختصاصی
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

---

## 3. Section-Based Layout Patterns & Narrative Flow

High-converting landing pages follow an intentional psychological progression:
```
Hook (Hero)
  └──> Validation (Client Logos / Marquee)
        └──> Core Value (Bento Feature Showcase)
              └──> Deep Dive (Alternating Alternating Zig-Zag Rows)
                    └──> Social Proof (Testimonials & Live Metric Counters)
                          └──> Pricing Matrix (Tiered Comparison)
                                └──> Risk Reversal (FAQ Accordion + Guarantees)
                                      └──> Final Conversion Hook (Bottom CTA Bar)
                                            └──> Comprehensive RTL Footer
```

---

### 3.1 Logo Marquee (Infinite RTL Scroll)
Builds immediate credibility above the fold. Supports infinite smooth scroll that pauses on hover.

```tsx
// src/components/landing/LogoMarquee.tsx
'use client';

import React from 'react';

const PARTNERS = [
  { name: 'دیجی‌کالا', id: '1' },
  { name: 'اسنپ', id: '2' },
  { name: 'کافه‌بازار', id: '3' },
  { name: 'آپارات', id: '4' },
  { name: 'تپسی', id: '5' },
  { name: 'دیوار', id: '6' },
];

export function LogoMarquee() {
  return (
    <section className="border-y border-slate-200/60 bg-slate-50/50 py-10 dark:border-zinc-800/60 dark:bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          مورد اعتماد پیشروترین سازمان‌ها و برندهای دیجیتال کشور
        </p>
      </div>

      <div className="relative mt-6 flex overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
        <div className="flex animate-[marquee_30s_linear_infinite] gap-12 pe-12 hover:[animation-play-state:paused]">
          {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <div
              key={`${partner.id}-${idx}`}
              className="flex h-12 min-w-[140px] items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-slate-500 shadow-sm border border-slate-200/50 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700/50"
            >
              {partner.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### 3.2 Bento Grid Feature Showcase
The Bento Grid organizes diverse features into an eye-pleasing, modern asymmetrical layout.

```tsx
// src/components/landing/BentoGrid.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, BarChart3, CloudLightning, Cpu, Globe } from 'lucide-react';

const FEATURES = [
  {
    title: 'پردازش بلادرنگ رویدادها',
    desc: 'موتور محاسباتی داخلی با زمان پاسخ کمتر از ۵ میلی‌ثانیه برای سنگین‌ترین بارهای پردازشی.',
    icon: Zap,
    colSpan: 'lg:col-span-8',
    bgBadge: 'رویداد محور',
  },
  {
    title: 'امنیت در سطح استانداردهای بانکی',
    desc: 'احراز هویت چند عاملی، لاگ‌های تغییرناپذیر و حفاظت در برابر نفوذ.',
    icon: ShieldCheck,
    colSpan: 'lg:col-span-4',
    bgBadge: 'انطباق ۹۹.۹٪',
  },
  {
    title: 'داشبوردهای هوشمند و بصری',
    desc: 'تحلیل دقیق متریک‌های عملیاتی با خروجی‌های خودکار و هشدارهای اختصاصی تلگرام و پیامک.',
    icon: BarChart3,
    colSpan: 'lg:col-span-4',
    bgBadge: 'گزارش‌گیری زنده',
  },
  {
    title: 'زیرساخت ابری پایدار و توزیع‌شده',
    desc: 'توزیع بار چندمنطقه‌ای داخل ایران با آپتایم ۹۹.۹۹٪ واقعی و بدون قطعی در شرایط بحرانی اینترنت.',
    icon: Globe,
    colSpan: 'lg:col-span-8',
    bgBadge: 'شبکه توزیع محتوا',
  },
];

export function BentoGrid() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            امکانات بی‌نظیر
          </h2>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
            هرآنچه برای رشد انفجاری نیاز دارید
          </p>
          <p className="mt-4 text-base text-slate-600 dark:text-zinc-400">
            ابزارهایی طراحی شده با تمرکز بر سرعت، قابلیت اتکا و تجربه کاربری بی‌نقص برای کاربران فارسی‌زبان.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-emerald-500/30 ${feature.colSpan}`}
              >
                {/* Decorative Subtle Corner Glow */}
                <div className="pointer-events-none absolute -top-16 -end-16 h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-300 group-hover:scale-150 group-hover:bg-emerald-500/20" />

                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {feature.bgBadge}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

---

### 3.3 Interactive Pricing Tables (Monthly / Annual Billing Toggle)
Highlights the primary recommendation, handles Persian currency numbers, and provides reassurance points.

```tsx
// src/components/landing/PricingSection.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

const TIERS = [
  {
    id: 'starter',
    name: 'شروع',
    description: 'مناسب برای پروژه‌های شخصی و تیم‌های نوپا.',
    priceMonthly: 490000,
    priceAnnual: 390000, // Per month billed annually
    isPopular: false,
    features: [
      'تا ۵ کاربر فعال همزمان',
      'گزارش‌گیری ماهانه خودکار',
      'پشتیبانی استاندارد از طریق تیکت',
      '۱ گیگابایت فضای ابری ذخیره‌سازی',
    ],
    ctaText: 'شروع پلن پایه',
  },
  {
    id: 'pro',
    name: 'حرفه‌ای (پیشنهادی)',
    description: 'بهترین انتخاب برای استارتاپ‌ها و کسب‌وکارهای در حال توسعه.',
    priceMonthly: 1290000,
    priceAnnual: 990000,
    isPopular: true,
    features: [
      'کاربران نامحدود',
      'تحلیل هوش مصنوعی بلادرنگ',
      'پشتیبانی اختصاصی ۲۴ ساعته تلفنی',
      '۲۰ گیگابایت فضای ابری پرسرعت',
      'دامنه اختصاصی و برندینگ سفارشی',
      'اتصال مستقیم به درگاه پرداخت شتاب',
    ],
    ctaText: 'شروع نسخه حرفه‌ای',
  },
  {
    id: 'enterprise',
    name: 'سازمانی',
    description: 'زیرساخت اختصاصی و پشتیبانی ۲۴/۷ برای سازمان‌های بزرگ.',
    priceMonthly: null, // Custom quote
    priceAnnual: null,
    isPopular: false,
    features: [
      'توافق‌نامه سطح خدمات (SLA) ۹۹.۹۹٪',
      'استقرار روی سرورهای اختصاصی مشتری',
      'مدیر حساب اختصاصی',
      'حسابرسی امنیتی و قرارداد رسمی شرکتی',
    ],
    ctaText: 'تماس با واحد فروش',
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const formatPrice = (num: number | null) => {
    if (num === null) return 'تماس بگیرید';
    return new Intl.NumberFormat('fa-IR').format(num) + ' تومان';
  };

  return (
    <section id="pricing" className="relative py-24 sm:py-32 bg-slate-50/50 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            قیمت‌گذاری شفاف و منصفانه
          </h2>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
            پلنی متناسب با اندازه کسب‌وکار شما
          </p>

          {/* Billing Frequency Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                !annual
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              پرداخت ماهانه
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                annual
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <span>پرداخت سالانه</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-white">
                ۲۰٪ تخفیف
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                tier.isPopular
                  ? 'border-2 border-emerald-500 bg-white shadow-2xl scale-105 z-10 dark:bg-zinc-900'
                  : 'border border-slate-200 bg-white/70 shadow-sm hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900/50'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 start-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    محبوب‌ترین انتخاب
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">{tier.description}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">
                    {formatPrice(annual ? tier.priceAnnual : tier.priceMonthly)}
                  </span>
                  {tier.priceMonthly && (
                    <span className="text-xs text-slate-500 dark:text-zinc-400">/ ماهانه</span>
                  )}
                </div>

                <div className="my-8 h-px bg-slate-200 dark:bg-zinc-800" />

                <ul className="space-y-4 text-sm">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-slate-700 dark:text-zinc-300">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href={tier.id === 'enterprise' ? '/contact' : '/register'}
                  className={`w-full inline-flex items-center justify-center rounded-2xl py-3.5 text-center text-sm font-bold transition-all ${
                    tier.isPopular
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {tier.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### 3.4 FAQ Accordion (with Native Accessible Disclosure)
Improves long-tail SEO, resolves lingering user hesitations, and supplies data for Google FAQ schema.

```tsx
// src/components/landing/FAQSection.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'آیا برای شروع دوره آزمایشی نیازی به وارد کردن اطلاعات کارت بانکی است؟',
    a: 'خیر، شما می‌توانید به مدت ۱۴ روز به صورت کاملاً رایگان و بدون نیاز به ورود هرگونه اطلاعات پرداختی یا شماره کارت، از تمامی امکانات نسخه حرفه‌ای استفاده نمایید.',
  },
  {
    q: 'آیا سرورها و اطلاعات در داخل ایران میزبانی می‌شوند؟',
    a: 'بله، تمامی سرورها و پایگاه‌های داده در مراکز داده استاندارد داخل کشور مستقر بوده و سرعت دسترسی کاربران حتی در شرایط اختلال اینترنت بین‌الملل بدون افت کیفیت حفظ می‌شود.',
  },
  {
    q: 'نحوه پشتیبانی و زمان پاسخگویی به چه صورت است؟',
    a: 'پشتیبانی از طریق تیکت، تماس تلفنی مستقیم و گفتگوی آنلاین ارائه می‌شود. میانگین زمان پاسخگویی در ساعات کاری کمتر از ۱۵ دقیقه است.',
  },
  {
    q: 'آیا امکان ارتقا یا لغو اشتراک در هر زمان وجود دارد؟',
    a: 'بله، شما می‌توانید در هر زمان از طریق پنل مدیریت، پلن اشتراک خود را ارتقا دهید یا در صورت انصراف، وجه باقی‌مانده دوره طبق ضوابط به حساب شما بازگردانده می‌شود.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            پاسخ به ابهامات
          </h2>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
            سوالات متداول
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-6 text-start text-base font-bold text-slate-900 dark:text-white focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 dark:text-zinc-400 ${
                      isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 text-sm leading-relaxed text-slate-600 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800/80 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

---

## 4. Visual Design Patterns & Tailwind CSS v4 Tokens

Tailwind CSS v4 introduces the pure CSS `@theme` directive, removing `tailwind.config.js` in favor of declarative native CSS variables.

### 4.1 Liquid Glass & Glassmorphism Tokens
For a modern high-end feel, standard flat cards are replaced with translucent frosted surfaces equipped with subtle specular inner highlights.

```css
/* In src/app/globals.css */
@layer utilities {
  /* Liquid Glass - High-refraction card surface */
  .liquid-glass {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.55) 100%);
    backdrop-filter: blur(12px) saturate(190%);
    -webkit-backdrop-filter: blur(12px) saturate(190%);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 
      inset 0 1px 2px 0 rgba(255, 255, 255, 0.8),
      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04),
      0 12px 32px -4px rgba(0, 151, 103, 0.08);
  }

  .dark .liquid-glass {
    background: linear-gradient(135deg, rgba(24, 24, 27, 0.82) 0%, rgba(15, 23, 42, 0.6) 100%);
    backdrop-filter: blur(12px) saturate(190%);
    -webkit-backdrop-filter: blur(12px) saturate(190%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.5),
      0 14px 40px -4px rgba(0, 0, 0, 0.6);
  }
}
```

### 4.2 Gradient Meshes & Blurs
Create organic background depth using blurred gradient spheres without heavy image assets:

```tsx
export function AmbientBackgroundMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Orb 1: Primary Emerald */}
      <div className="absolute -top-32 right-10 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[120px]" />
      {/* Orb 2: Electric Cyan / Teal */}
      <div className="absolute top-96 -left-32 h-[450px] w-[450px] rounded-full bg-teal-400/15 blur-[100px]" />
      {/* Orb 3: Subtle Violet Accent */}
      <div className="absolute top-1/2 right-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[140px]" />
    </div>
  );
}
```

### 4.3 High-Precision Background Grid Patterns
```css
/* Minimalist Dot Grid */
.bg-dot-pattern {
  background-image: radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 24px 24px;
}
.dark .bg-dot-pattern {
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

/* Subtle Linear Blueprint Grid */
.bg-grid-pattern {
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
}
.dark .bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}
```

---

## 5. Scroll-Driven Storytelling & Motion Animations

Scroll animations should enhance comprehension, never obstruct or slow down reading.

### 5.1 Animated Numeric Metric Counter on Scroll (Persian Numbers)
When the user scrolls to the statistics section, numbers count up smoothly from 0 to their target value, rendered in authentic Persian numerals (`fa-IR`).

```tsx
// src/components/landing/StatCounter.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export function StatCounter({ value, suffix = '', label }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    damping: 30,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, motionVal, value]);

  useEffect(() => {
    return springVal.on('change', (latest) => {
      if (ref.current) {
        const rounded = Math.floor(latest);
        ref.current.textContent = new Intl.NumberFormat('fa-IR').format(rounded);
      }
    });
  }, [springVal]);

  return (
    <div className="text-center">
      <div className="flex items-center justify-center text-4xl font-black tracking-normal text-slate-900 sm:text-5xl dark:text-white">
        <span ref={ref}>۰</span>
        {suffix && <span className="ms-1 text-emerald-600 dark:text-emerald-400">{suffix}</span>}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}
```

### 5.2 Scroll-Linked Progress Reading Bar
Renders a 2px high-tech indicator pinned to the very top of the browser.

```tsx
// src/components/landing/ScrollProgressBar.tsx
'use client';

import React from 'react';
import { motion, useScroll } from 'framer-motion';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: 'right' }} // RTL: Origin on right
      className="fixed top-0 start-0 end-0 z-50 h-[3px] bg-gradient-to-l from-emerald-500 via-teal-400 to-cyan-400"
    />
  );
}
```

---

## 6. Responsive Architecture & Mobile-First Optimization

### 6.1 Container Queries with Tailwind v4
Use `@container` queries so cards adapt intelligently based on their immediate container width, not just the global window width.

```tsx
// Component adjusts its internal layout whether placed in a narrow 4-col sidebar or full 12-col bento
export function ResponsiveFeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="@container rounded-2xl border border-slate-200 p-6 dark:border-zinc-800">
      <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">{title}</h4>
          <p className="text-sm text-slate-500 dark:text-zinc-400">{desc}</p>
        </div>
        <button className="w-full @sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          جزئیات
        </button>
      </div>
    </div>
  );
}
```

### 6.2 Sticky Mobile Bottom CTA Bar
On mobile devices (`< 640px`), the primary CTA is pinned to the bottom of the screen within the thumb zone for maximum conversion convenience.

```tsx
// src/components/landing/MobileStickyCTA.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal sticky bar once user scrolls past 400px (hero section)
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 start-0 end-0 z-40 p-3 sm:hidden bg-white/90 backdrop-blur-lg border-t border-slate-200 dark:bg-zinc-900/90 dark:border-zinc-800 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">آزمایش ۱۴ روزه رایگان</p>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400">بدون نیاز به کارت بانکی</p>
        </div>
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
        >
          <span>ثبت‌نام سریع</span>
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
```

---

## 7. SEO, Structured Data & Core Web Vitals

### 7.1 Next.js 15 App Router Metadata Configuration
In `src/app/page.tsx` or `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'دیجی‌مون | پلتفرم یکپارچه هوش مصنوعی و مدیریت دارایی‌ها',
  description:
    'سریع‌ترین و امن‌ترین پلتفرم مدیریت هوشمند دارایی‌ها در ایران. مجهز به هوش مصنوعی تحلیلی، گزارش‌گیری زنده و پشتیبانی ۲۴/۷.',
  alternates: {
    canonical: 'https://dijimoon.ir',
  },
  openGraph: {
    title: 'دیجی‌مون | پلتفرم یکپارچه هوش مصنوعی و مدیریت دارایی‌ها',
    description: 'تجربه سرعت و دقت فوق‌العاده در پردازش داده‌ها و اتوماسیون سازمانی.',
    url: 'https://dijimoon.ir',
    siteName: 'دیجی‌مون',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: 'https://dijimoon.ir/og-landing.jpg',
        width: 1200,
        height: 630,
        alt: 'پیش‌نمایش سامانه دیجی‌مون',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دیجی‌مون | پلتفرم مدیریت هوشمند داده و دارایی',
    description: 'زیرساخت ابری پایدار و امن با بهینه‌سازی اختصاصی در ایران.',
    images: ['https://dijimoon.ir/og-landing.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### 7.2 Structured Data (Schema.org JSON-LD)
Inject structured data for Organization and FAQ into the `<head>` or via `<script type="application/ld+json">`:

```tsx
export function LandingStructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://dijimoon.ir/#organization',
        name: 'دیجی‌مون',
        url: 'https://dijimoon.ir',
        logo: 'https://dijimoon.ir/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+98-21-91000000',
          contactType: 'customer support',
          areaServed: 'IR',
          availableLanguage: 'Persian',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'دیجی‌مون',
        operatingSystem: 'Web, Cloud',
        applicationCategory: 'BusinessApplication',
        offers: {
          '@type': 'Offer',
          price: '390000',
          priceCurrency: 'IRR',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '1250',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## 8. Persian / Farsi RTL Conversion Rate Optimization (CRO)

### 8.1 RTL Visual Hierarchy & Scanning Patterns
In Left-to-Right languages, users follow a Z-pattern or F-pattern starting at the **Top-Left**. In Persian/Arabic RTL:
- The eye enters at the **Top-Right**!
- **Logo goes at the top-right**, not top-left.
- **Top action buttons (Login / Primary CTA) go at the top-left**.
- The main **H1 headline must be right-aligned** (`text-start` or `text-right`) on desktop.
- The hero visual/mockup anchors the **left side** of the split screen.

### 8.2 RTL Logical Properties vs Physical Directional Classes
Always use logical spacing properties to prevent layout breakages:
| DO NOT USE (Physical) | ALWAYS USE (RTL Logical) | Why |
|---|---|---|
| `pl-4`, `pr-4` | `ps-4`, `pe-4` | `padding-inline-start` / `end` respects direction automatically |
| `ml-auto`, `mr-4` | `ms-auto`, `me-4` | `margin-inline-start` / `end` works cleanly in RTL |
| `text-left`, `text-right` | `text-start`, `text-end` | Proper directional alignment |
| `left-0`, `right-0` | `start-0`, `end-0` | Absolute positioning aligned with flow |
| `border-l-2` | `border-s-2` | Border inline start |

### 8.3 Icon Directionality Rules
- **Flip / Mirror**: Directional flow icons such as `ArrowLeft`, `ChevronLeft` (in RTL, advancing forward means moving left!), back buttons, step sequences.
- **Do NOT Flip**: Universal physical objects such as search magnifying glasses, clock/time, telephone, checkmarks, play/pause video controls, locks.

### 8.4 Persian Typography Strict Rules
```css
/* In globals.css */
body, button, input, h1, h2, h3, h4, p, span {
  font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, sans-serif;
  /* CRITICAL: Letter spacing in Persian breaks glyph connections! */
  letter-spacing: 0 !important;
  /* Extra vertical headroom for Persian ascenders and descenders */
  line-height: 1.7;
}
```

---

## 9. Complete Production Landing Page Template

A clean, unified, copy-paste ready reference composing all patterns into a unified page in Next.js 15:

```tsx
// src/app/page.tsx
import React from 'react';
import { SplitHero } from '@/components/landing/SplitHero';
import { LogoMarquee } from '@/components/landing/LogoMarquee';
import { BentoGrid } from '@/components/landing/BentoGrid';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { StatCounter } from '@/components/landing/StatCounter';
import { MobileStickyCTA } from '@/components/landing/MobileStickyCTA';
import { ScrollProgressBar } from '@/components/landing/ScrollProgressBar';
import { LandingStructuredData } from '@/components/landing/LandingStructuredData';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Shield, HeartHandshake } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
      <LandingStructuredData />
      <ScrollProgressBar />

      {/* 1. Sticky Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo (RTL: Top Right) */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl shadow-md shadow-emerald-500/30">
              د
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              دیجی‌مون
            </span>
          </Link>

          {/* Nav Links (Desktop Center) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-zinc-300">
            <a href="#features" className="hover:text-emerald-600 transition-colors">امکانات</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">قیمت‌گذاری</a>
            <a href="#testimonials" className="hover:text-emerald-600 transition-colors">نظرات مشتریان</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">سوالات متداول</a>
          </nav>

          {/* Action Button (RTL: Top Left) */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white"
            >
              ورود به حساب
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 transition-all"
            >
              <span>آزمایش رایگان</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <SplitHero />

      {/* 3. Partner & Client Marquee */}
      <LogoMarquee />

      {/* 4. Live Statistics Bar */}
      <section className="py-16 border-b border-slate-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <StatCounter value={99} suffix="٪" label="پایداری و در دسترس بودن سرورها" />
            <StatCounter value={10000} suffix="+" label="تراکنش موفق روزانه" />
            <StatCounter value={5000} suffix="+" label="سازمان و کسب‌وکار فعال" />
            <StatCounter value={15} suffix="دقیقه" label="میانگین زمان پاسخگویی پشتیبانی" />
          </div>
        </div>
      </section>

      {/* 5. Bento Grid Feature Showcase */}
      <BentoGrid />

      {/* 6. Pricing Section */}
      <PricingSection />

      {/* 7. FAQ Section */}
      <FAQSection />

      {/* 8. Final Conversion CTA Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-emerald-600 to-teal-700 text-white text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-black sm:text-5xl">
            آماده‌اید سرعت و بازدهی کسب‌وکارتان را متحول کنید؟
          </h2>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto">
            در کمتر از ۲ دقیقه ثبت‌نام کنید و ۱۴ روز بدون پرداخت هزینه از تمام پتانسیل سامانه بهره‌مند شوید.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-emerald-800 shadow-xl hover:bg-emerald-50 active:scale-95 transition-all"
            >
              <span>شروع رایگان هم‌اکنون</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Comprehensive RTL Footer */}
      <footer className="border-t border-slate-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
            {/* Brand column (2 cols) */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-xl">
                  د
                </div>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  دیجی‌مون
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                سامانه هوشمند و یکپارچه تحلیل داده و نظارت خودکار، توسعه داده شده بر پایه پیشرفته‌ترین استانداردهای نرم‌افزاری جهان و زیرساخت ابری پایدار داخل کشور.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">محصول</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-zinc-400">
                <li><a href="#features" className="hover:text-emerald-600">امکانات اختصاصی</a></li>
                <li><a href="#pricing" className="hover:text-emerald-600">تعرفه‌ها و پلن‌ها</a></li>
                <li><a href="/roadmap" className="hover:text-emerald-600">نقشه راه توسعه</a></li>
                <li><a href="/updates" className="hover:text-emerald-600">آخرین بروزرسانی‌ها</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">پشتیبانی و مستندات</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-zinc-400">
                <li><a href="/docs" className="hover:text-emerald-600">مستندات فنی و API</a></li>
                <li><a href="/status" className="hover:text-emerald-600">وضعیت پایداری سرورها</a></li>
                <li><a href="#faq" className="hover:text-emerald-600">راهنمای کاربران</a></li>
                <li><a href="/contact" className="hover:text-emerald-600">تماس با پشتیبانی</a></li>
              </ul>
            </div>

            {/* Iranian Trust Signals */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">نمادهای اعتماد الکترونیکی</h4>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center text-xs text-slate-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  اینماد الکترونیکی
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center text-xs text-slate-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  ساماندهی
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row dark:border-zinc-900 text-xs text-slate-500 dark:text-zinc-400">
            <p>© ۱۴۰۳ تمامی حقوق مادی و معنوی متعلق به سامانه دیجی‌مون می‌باشد.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-emerald-600">حریم خصوصی</Link>
              <Link href="/terms" className="hover:text-emerald-600">شرایط و قوانین استفاده</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA for Viewports < 640px */}
      <MobileStickyCTA />
    </main>
  );
}
```

---

## 10. Pre-Launch Quality & Audit Checklist

Before releasing any landing page to production, verify every item against this checklist:

### 1. Performance & Core Web Vitals
- [ ] **LCP < 2.5s**: Hero images flagged with `priority={true}` and appropriate `sizes`.
- [ ] **CLS < 0.1**: All images and mockups declare aspect ratio or dimensions. No flash of unstyled fonts.
- [ ] **INP < 200ms**: No blocking main-thread computations. Heavy libraries isolated to dynamic imports (`next/dynamic`).
- [ ] **Bundle Size**: Only interactive widgets use `'use client'`. Zero unused SVG or icon bundle leakage.

### 2. RTL & Persian Typography Validation
- [ ] **Zero Letter-Spacing**: `letter-spacing: 0 !important;` verified across headings and body text.
- [ ] **Persian Numerals**: Numbers in pricing, statistics, and counters formatted via `Intl.NumberFormat('fa-IR')`.
- [ ] **Logical Spacing**: `ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-` used instead of left/right.
- [ ] **Directional Icons**: Chevrons and arrow icons point in the expected RTL reading direction (`ArrowLeft` for next/forward).

### 3. Conversion & Usability
- [ ] **Single Primary Action**: One dominant primary CTA color; secondary actions use ghost or outline styling.
- [ ] **Mobile Sticky CTA**: Accessible for thumb-navigation on mobile screens.
- [ ] **Trust Elements Above-the-Fold**: Customer count, rating, and risk-reversal microcopy visible without scrolling.
- [ ] **A11y**: Color contrast ratios exceed WCAG AA standards (minimum 4.5:1 for body copy).
