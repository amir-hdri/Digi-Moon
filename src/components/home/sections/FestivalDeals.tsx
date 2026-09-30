'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Flame, Clock } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useDealCountdown } from '@/hooks/useDealCountdown';
import { usePauseAnimationsOffscreen } from '@/hooks/usePauseAnimationsOffscreen';
import { mockFestivalProducts } from '@/data/mock-data';
import { toPersianDigits } from '@/lib/persian';
import type { Product } from '@/types';

function pad(value: number): string {
  return toPersianDigits(String(value).padStart(2, '0'));
}

function TimerCell({ value, label, urgent }: { value: string; label: string; urgent: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span
        suppressHydrationWarning
        className={`min-w-[2.25rem] text-center text-base font-black tabular-nums rounded-lg px-1 py-0.5 ${
          urgent ? 'bg-rose-500/30 text-rose-100' : 'bg-white/15 text-white'
        }`}
      >
        {value}
      </span>
      <span className="text-[9px] text-emerald-100/80 mt-0.5">{label}</span>
    </div>
  );
}

export function FestivalDeals({ onAddToCart }: { onAddToCart: (product: Product) => void }) {
  const reduceMotion = useReducedMotion();
  const { hours, minutes, seconds, isUrgent, expired } = useDealCountdown();
  const sectionRef = useRef<HTMLElement>(null);
  // Stop the glow blobs + flame wobble while this section is off-screen.
  usePauseAnimationsOffscreen(sectionRef);

  return (
    <motion.section
      ref={sectionRef}
      id="festival-deals"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      aria-labelledby="festival-heading"
      className="rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-emerald-600/95 via-teal-600/90 to-emerald-700/90 backdrop-blur-md border border-white/30 text-white shadow-2xl shadow-emerald-600/20 relative overflow-hidden"
    >
      <motion.div
        animate={reduceMotion ? undefined : { scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={reduceMotion ? {} : { repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        aria-hidden="true"
        className="absolute -top-16 -start-16 w-56 h-56 bg-emerald-400/30 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={reduceMotion ? undefined : { scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
        transition={
          reduceMotion ? {} : { repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.5 }
        }
        aria-hidden="true"
        className="absolute -bottom-16 -end-16 w-56 h-56 bg-teal-400/30 rounded-full blur-3xl pointer-events-none"
      />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3.5">
          <motion.div
            animate={reduceMotion ? undefined : { rotate: [0, -6, 6, 0] }}
            transition={reduceMotion ? {} : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            aria-hidden="true"
            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md shrink-0"
          >
            <Flame className="w-6 h-6 text-amber-300 fill-amber-300" aria-hidden="true" />
          </motion.div>
          <div>
            <h2 id="festival-heading" className="text-lg sm:text-xl font-black text-white text-balance">
              پیشنهادهای شگفت‌انگیز مون مارکت
            </h2>
            <span className="text-xs text-emerald-100 font-medium">
              {mockFestivalProducts.length > 0
                ? `تخفیف‌های زمان‌دار و موجودی محدود • ${toPersianDigits(mockFestivalProducts.length)} کالا`
                : 'در حال حاضر پیشنهاد ویژه‌ای فعال نیست'}
            </span>
          </div>
        </div>

        {/*
          Countdown markup is now split into labelled cells instead of one opaque
          `۰۸:۴۵:۳۰` string, and the source of truth is a real clock (see useDealCountdown)
          rather than a counter that jumped back to 12:00:00 on expiry.
        */}
        <div
          role="timer"
          aria-live="off"
          aria-label={`زمان باقی‌مانده تا پایان پیشنهاد: ${toPersianDigits(hours)} ساعت و ${toPersianDigits(minutes)} دقیقه و ${toPersianDigits(seconds)} ثانیه`}
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl backdrop-blur-md border text-xs font-bold shadow-md ${
            isUrgent
              ? 'bg-rose-500/25 border-rose-300/40'
              : 'bg-black/35 border-white/25'
          }`}
        >
          <Clock className={`w-4 h-4 shrink-0 ${isUrgent ? 'text-rose-200' : 'text-amber-300'}`} aria-hidden="true" />
          {expired ? (
            <span className="text-rose-100">به‌زودی تمدید می‌شود</span>
          ) : (
            <div className="flex items-center gap-1.5" dir="ltr">
              <TimerCell value={pad(hours)} label="ساعت" urgent={isUrgent} />
              <span className="text-white/60 -mt-3">:</span>
              <TimerCell value={pad(minutes)} label="دقیقه" urgent={isUrgent} />
              <span className="text-white/60 -mt-3">:</span>
              <TimerCell value={pad(seconds)} label="ثانیه" urgent={isUrgent} />
            </div>
          )}
        </div>
      </div>

      {mockFestivalProducts.length > 0 ? (
        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto sm:overflow-x-visible pb-3 sm:pb-0 no-scrollbar snap-x snap-mandatory relative z-10" role="list" aria-label="پیشنهادهای شگفت‌انگیز" tabIndex={0}>
          {mockFestivalProducts.map((product) => (
            <div key={product.id} role="listitem" className="w-[170px] xs:w-[180px] sm:w-auto shrink-0 snap-start min-w-0">
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      ) : (
        <p className="relative z-10 text-sm text-emerald-50/90">
          به‌زودی پیشنهادهای شگفت‌انگیز جدید منتشر می‌شود.
        </p>
      )}
    </motion.section>
  );
}
