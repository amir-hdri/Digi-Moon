'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Flame, Play, Truck, ShieldCheck, RotateCcw, CreditCard } from 'lucide-react';
import { DigiMoonAnimatedLogo } from '@/components/ui/DigiMoonAnimatedLogo';
import {
  GROCERY_OIL_SVG,
  DAIRY_MILK_SVG,
  HYGIENE_SHAMPOO_SVG,
  BEVERAGE_TEA_SVG,
} from '@/lib/product-images';

const VALUE_PROPS = [
  { icon: Truck, label: 'ارسال اکسپرس ۴۵ دقیقه' },
  { icon: ShieldCheck, label: 'تضمین ۱۰۰٪ سلامت کالا' },
  { icon: RotateCcw, label: '۷ روز ضمانت بازگشت' },
  { icon: CreditCard, label: 'پرداخت در محل و آنلاین' },
];

const ORBITERS = [
  { src: GROCERY_OIL_SVG, alt: 'روغن زیتون فرابکر', label: 'روغن فرابکر', pos: 'top-0 start-0', dur: 4, rise: -12, delay: 0 },
  { src: DAIRY_MILK_SVG, alt: 'شیر تازه پاستوریزه', label: 'شیر تازه کاله', pos: 'top-0 end-0', dur: 4.5, rise: 10, delay: 0.5 },
  { src: HYGIENE_SHAMPOO_SVG, alt: 'شامپو و بهداشتی', label: 'آرایشی و بهداشتی', pos: 'bottom-0 start-0', dur: 3.8, rise: 8, delay: 1 },
  { src: BEVERAGE_TEA_SVG, alt: 'چای ممتاز لاهیجان', label: 'چای ممتاز لاهیجان', pos: 'bottom-0 end-0', dur: 4.2, rise: -10, delay: 1.5 },
] as const;

export function HomeHero({ onWatchPromo }: { onWatchPromo: () => void }) {
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

          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs list-none p-0 m-0">
            {VALUE_PROPS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 transition-colors"
              >
                <Icon className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="font-semibold text-[11px] text-slate-200">{label}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <motion.a
              href="#festival-deals"
              whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              className="px-6 min-h-[44px] inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Flame className="w-4 h-4 text-slate-950 fill-slate-950" aria-hidden="true" />
              <span>مشاهده شگفتانه‌ها</span>
            </motion.a>

            <motion.button
              type="button"
              onClick={onWatchPromo}
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              className="px-4 min-h-[44px] inline-flex items-center rounded-xl bg-white/10 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-bold hover:bg-white/20 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" aria-hidden="true" />
              <span>انیمیشن رسمی مون مارکت</span>
            </motion.button>
          </div>
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
              <div className="mt-2 text-center">
                <span className="text-[11px] font-bold text-emerald-300 block">لوگوی رسمی مون مارکت</span>
                <span className="text-[9px] text-slate-400">سوپرمارکت زنجیره‌ای با ارسال فوری</span>
              </div>
            </motion.div>

            {ORBITERS.map((o) => (
              <motion.div
                key={o.label}
                animate={reduceMotion ? undefined : { y: [0, o.rise, 0] }}
                transition={{ ...loop(o.dur), delay: o.delay }}
                className={`absolute ${o.pos} w-24 sm:w-28 h-24 sm:h-28 rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/20 shadow-xl flex flex-col items-center justify-center z-10`}
              >
                <Image
                  src={o.src}
                  alt={o.alt}
                  width={56}
                  height={56}
                  unoptimized
                  className="object-contain drop-shadow-md"
                />
                <span className="text-[9px] font-bold text-white mt-1 text-center leading-tight">
                  {o.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
