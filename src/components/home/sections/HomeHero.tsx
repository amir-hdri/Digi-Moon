'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { DigiMoonAnimatedLogo } from '@/components/ui/DigiMoonAnimatedLogo';

export function HomeHero() {
  const reduceMotion = useReducedMotion();
  const loop = (duration: number) =>
    reduceMotion
      ? {}
      : { repeat: Infinity, duration, ease: 'easeInOut' as const };

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1120] via-slate-900 to-[#06281e] text-white p-6 sm:p-10 lg:p-12 shadow-2xl shadow-emerald-500/10 border border-emerald-500/30"
    >
      <motion.div
        animate={reduceMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={loop(6)}
        aria-hidden="true"
        className="absolute -top-24 -start-24 w-80 h-80 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={reduceMotion ? undefined : { scale: [1.1, 1, 1.1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ ...loop(7), delay: 1 }}
        aria-hidden="true"
        className="absolute -bottom-24 -end-24 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-7 space-y-5 text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 backdrop-blur-md text-xs font-bold text-emerald-300 border border-emerald-500/30 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>فروشگاه‌های زنجیره‌ای مون مارکت؛ هویت رسمی</span>
          </div>

          <h1
            id="hero-title"
            className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight text-white drop-shadow-sm text-balance"
          >
            سوپرمارکت زنجیره‌ای مون مارکت
            <span className="block text-emerald-300">مایحتاج روزمره و بهداشتی</span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl font-normal">
            عرضه مستقیم باکیفیت‌ترین کالاهای اساسی و خواربار، لبنیات تازه روز، محصولات تخصصی
            آرایشی و بهداشتی و شوینده‌های معتبر با تضمین ۱۰۰٪ اصالت، تخفیف‌های شگفت‌انگیز و
            ارسال اکسپرس درب منزل.
          </p>
        </div>

        <div className="lg:col-span-5 relative flex items-center justify-center overflow-visible">
          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            <motion.div
              animate={reduceMotion ? undefined : { scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={loop(4)}
              aria-hidden="true"
              className="absolute inset-4 rounded-full bg-emerald-500/20 blur-3xl"
            />

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={loop(4)}
              className="relative z-20 p-5 rounded-3xl bg-gradient-to-br from-white/15 via-white/5 to-white/10 backdrop-blur-xl border border-white/25 shadow-2xl flex flex-col items-center justify-center"
            >
              <DigiMoonAnimatedLogo size="xl" shine="loop" float={false} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
