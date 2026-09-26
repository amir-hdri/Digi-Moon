'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MoonMarketLogo } from '@/components/ui/MoonMarketLogo';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-radial-emerald">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        role="main"
        aria-label="صفحه ۴۰۴ – یافت نشد"
        className="max-w-md w-full p-8 rounded-3xl liquid-glass border border-emerald-500/30 shadow-2xl space-y-6"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <MoonMarketLogo size="lg" glow={true} />
        </div>

        {/* 404 Visual badge */}
        <div className="space-y-2">
          <span className="text-6xl font-black gradient-text tracking-tighter block font-mono">
            ۴۰۴
          </span>
          <h1 className="text-xl font-black text-slate-800 dark:text-zinc-100">
            صفحه مورد نظر پیدا نشد!
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            آدرسی که وارد کرده‌اید اشتباه است یا این کالا/صفحه از فروشگاه مون مارکت حذف شده است.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>بازگشت به صفحه اصلی</span>
          </Link>
          <Link
            href="/cart"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 font-bold text-xs border border-slate-200/80 dark:border-zinc-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
            <span>سبد خرید</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
