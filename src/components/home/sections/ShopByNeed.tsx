'use client';

import Link from 'next/link';
import { Coffee, PartyPopper, SprayCan, Sparkles, CupSoda, Beef } from 'lucide-react';
import { Section, SectionHeading } from '@/components/home/Section';
import { ShoppingBasket } from 'lucide-react';

const NEEDS = [
  { icon: Coffee, label: 'صبحانه', href: '/category/dairy' },
  { icon: PartyPopper, label: 'مهمانی', href: '/category/nuts-snacks' },
  { icon: SprayCan, label: 'نظافت', href: '/category/cleaning' },
  { icon: Sparkles, label: 'مراقبت شخصی', href: '/category/beauty-hygiene' },
  { icon: CupSoda, label: 'نوشیدنی', href: '/category/beverages' },
  { icon: Beef, label: 'پروتئینی', href: '/category/protein' },
] as const;

/** Shop by need — occasion-based navigation instead of dry category names. */
export function ShopByNeed() {
  return (
    <Section labelledBy="shop-by-need-heading" className="space-y-3.5">
      <SectionHeading
        id="shop-by-need-heading"
        icon={<ShoppingBasket className="w-4 h-4" />}
        title="خرید بر اساس نیاز"
        subtitle="برای هر موقعیت، یک مسیر آماده"
      />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
        {NEEDS.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center justify-center gap-1.5 min-h-[88px] p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 hover:border-emerald-400/60 dark:hover:border-emerald-500/40 hover:shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            </span>
            <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-200">{label}</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
