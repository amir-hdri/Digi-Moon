'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RotateCcw, Home, AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-radial-red">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        role="main"
        aria-label="صفحه خطا"
        className="max-w-md w-full p-8 rounded-3xl liquid-glass border border-red-500/30 shadow-2xl space-y-6"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-slate-800 dark:text-zinc-100">
            خطایی در بارگذاری رخ داده است!
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            متأسفانه در ارتباط با سرور یا پردازش اطلاعات مشکلی پیش آمده است. لطفاً مجدداً تلاش کنید.
          </p>
          {error.digest && (
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-600 block mt-1">
              کد پیگیری: {error.digest}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>تلاش مجدد</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 font-bold text-xs border border-slate-200/80 dark:border-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>صفحه اصلی</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
