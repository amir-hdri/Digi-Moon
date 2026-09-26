'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  ShoppingCart,
  Sparkles,
  CheckCircle2,
  Tag,
  Search,
  ArrowLeft,
  Heart,
  Plus,
  ShieldCheck,
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
