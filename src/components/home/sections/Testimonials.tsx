'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Star, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { Section, SectionHeading } from '@/components/home/Section';
import { toPersianDigits } from '@/lib/persian';

interface Testimonial {
  name: string;
  initials: string;
  quote: string;
  area: string;
  when: string;
  /** Tailwind tone for the avatar chip. */
  tone: 'emerald' | 'teal' | 'rose';
}

const TONES = {
  emerald: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  teal: 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30',
  rose: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
} as const;

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'سارا محمدی',
    initials: 'س.م',
    quote:
      'سفارش خواربار و شوینده‌هام کمتر از ۴۰ دقیقه به دستم رسید. بسته‌بندی کاملاً تمیز و تاریخ انقضای لبنیات‌ها کاملاً جدید بود.',
    area: 'تحویل فوری در سعادت‌آباد',
    when: '۲ روز پیش',
    tone: 'emerald',
  },
  {
    name: 'علی رضایی',
    initials: 'ع.ر',
    quote:
      'تخفیف‌های شگفت‌انگیزش واقعیه، روغن زیتون و چای لاهیجان رو با ۳۰٪ تخفیف خریدم. پیک هم بسیار محترم بود.',
    area: 'تحویل فوری در تهرانپارس',
    when: 'دیروز',
    tone: 'teal',
  },
  {
    name: 'مریم کریمی',
    initials: 'م.ک',
    quote:
      'بخش آرایشی و بهداشتی عالیه، اصالت کالاها تضمین شده است و شامپوهای تخصصی نیوآ رو به‌راحتی پیدا کردم.',
    area: 'تحویل فوری در پونک',
    when: 'امروز',
    tone: 'rose',
  },
];

const TOTAL_REVIEWS = 12000;

export function Testimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <Section labelledBy="testimonials-heading" className="space-y-4">
      <SectionHeading
        icon={<Star className="w-4 h-4 fill-amber-500 text-amber-500" />}
        accent="amber"
        id="testimonials-heading"
        title="تجربه خریداران مون مارکت"
        subtitle="دیدگاه‌های ثبت‌شده و تایید‌شده مشتریان واقعی"
        action={
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>بیش از {toPersianDigits(TOTAL_REVIEWS.toLocaleString('en-US'))} نظر ثبت‌شده</span>
          </div>
        }
      />
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 list-none p-0 m-0">
        {TESTIMONIALS.map((t) => (
          <motion.li
            key={t.name}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="p-5 rounded-3xl liquid-glass border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between gap-4 hover:border-emerald-400/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center border shrink-0 ${TONES[t.tone]}`}
                    aria-hidden
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 block truncate">
                      {t.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" aria-hidden="true" /> خریدار تایید‌شده
                    </span>
                  </div>
                </div>
                <div
                  className="flex items-center gap-0.5 text-amber-400 shrink-0"
                  role="img"
                  aria-label="امتیاز ۵ از ۵"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <blockquote className="flex gap-2 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed m-0">
                <MessageSquareQuote
                  className="w-5 h-5 mt-0.5 shrink-0 text-emerald-600/30 dark:text-emerald-400/30"
                  aria-hidden="true"
                />
                <p className="m-0">{t.quote}</p>
              </blockquote>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500">
              <span>{t.area}</span>
              <span>{t.when}</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
