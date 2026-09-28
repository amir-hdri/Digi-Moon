'use client';

import { Truck, ShieldCheck, Sprout, CreditCard } from 'lucide-react';

const BENEFITS = [
  { icon: Truck, label: 'ارسال سریع' },
  { icon: ShieldCheck, label: 'تضمین اصالت' },
  { icon: Sprout, label: 'تضمین تازگی' },
  { icon: CreditCard, label: 'پرداخت امن' },
] as const;

/**
 * Trust strip right after the hero — one compact row, horizontal scroll on
 * mobile. Replaces the value-prop grid that used to crowd the hero box.
 */
export function BenefitsStrip() {
  return (
    <section aria-label="مزیت‌های خرید از مون مارکت">
      <div className="flex md:grid md:grid-cols-4 gap-2 overflow-x-auto no-scrollbar snap-x py-1">
        {BENEFITS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-2 px-4 min-h-[44px] rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-200 shrink-0 snap-start min-w-[150px] md:min-w-0"
          >
            <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
