'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

/**
 * Trust figures. These are marketing claims for a demo storefront, so the numbers live
 * in one typed array rather than being inlined three times — previously a copy edit meant
 * touching three separate JSX blocks.
 */
const STATS = [
  { to: 50000, prefix: '+', suffix: ' نفر', label: 'خریدار وفادار و رضایتمند سوپرمارکت' },
  { to: 99.8, decimals: 1, suffix: '٪', label: 'تضمین اصالت، انقضا و سلامت کالا' },
  { to: 2500, prefix: '+', suffix: ' سفارش', label: 'سفارش تحویل فوری در روز' },
] as const;

export function TrustStats() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      aria-label="آمار اعتماد مشتریان"
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 sm:p-8 rounded-3xl liquid-glass border border-emerald-500/25 text-center shadow-lg"
    >
      {STATS.map((stat, index) => (
        <div
          key={stat.label}
          className={`space-y-1 ${
            index === 1
              ? 'border-y sm:border-y-0 sm:border-x border-slate-200 dark:border-zinc-800 py-4 sm:py-0'
              : ''
          }`}
        >
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            <AnimatedCounter
              to={stat.to}
              {...('prefix' in stat ? { prefix: stat.prefix } : {})}
              {...('decimals' in stat ? { decimals: stat.decimals } : {})}
              {...('suffix' in stat ? { suffix: stat.suffix } : {})}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-400 font-medium">{stat.label}</p>
        </div>
      ))}
    </motion.section>
  );
}
