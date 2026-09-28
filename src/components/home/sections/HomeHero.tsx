'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { DigiMoonAnimatedLogo } from '@/components/ui/DigiMoonAnimatedLogo';
import { BRAND_LOGOS, isRasterBrandLogo, type BrandLogo } from '@/lib/brand-logos';

/**
 * Liquid-glass chip: milky, slightly frosted pane with a specular top sheen
 * and a hairline rim. Semi-transparent so the marks sit *in* the background
 * instead of punching white holes through it, while the white tint keeps both
 * dark wordmarks and light marks readable on the dark hero.
 *
 * Deliberately NO backdrop-blur here: these tiles move every frame, and
 * blurring the live backdrop of ~70 tiles janks on mobile GPUs. The milky
 * white tint + sheens carry the frosted-glass read for free (composite only).
 *
 * Every tile carries its own bottom margin (no container gap/padding) so one
 * loop copy is exactly N × (tile + gap) tall — the −50% → 0% drift then lands
 * on a pixel-identical frame and the loop has zero jump.
 */
function BrandTile({ logo }: { logo: BrandLogo }) {
  return (
    <div className="relative mb-3 sm:mb-4 h-14 w-full shrink-0 overflow-hidden rounded-2xl bg-white/60 shadow-[0_14px_30px_-16px_rgba(0,0,0,0.85)] ring-1 ring-white/60 sm:h-16">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white/25 to-transparent"
      />
      <Image
        src={logo.src}
        alt=""
        fill
        sizes="112px"
        unoptimized={!isRasterBrandLogo(logo.src)}
        className="relative z-10 object-contain p-2.5 sm:p-3"
        draggable={false}
      />
    </div>
  );
}

/**
 * Official Iranian brand marks falling top-to-bottom behind the hero — the
 * "shelves" the Moon logo stands in front of. Four columns loop seamlessly
 * (duplicated list, −50% → 0 drift) at different speeds, masked at the
 * top/bottom and faded out under the copy on the right. Decorative only:
 * hidden from assistive tech and static under reduced motion.
 */
function BrandRain() {
  const reduceMotion = useReducedMotion();
  const COLUMN_COUNT = 4;
  /** One copy of a column must be taller than the hero or the loop shows a gap. */
  const MIN_TILES_PER_COLUMN = 8;
  const durations = [34, 44, 38, 30];

  const columns = Array.from({ length: COLUMN_COUNT }, (_, col) => {
    const own = BRAND_LOGOS.filter((_, i) => i % COLUMN_COUNT === col);
    const items: BrandLogo[] = [];
    /* Mirror each repeat so short columns read as a pattern, not an A-B-A-B loop. */
    while (items.length < MIN_TILES_PER_COLUMN) {
      items.push(...own);
      if (items.length < MIN_TILES_PER_COLUMN) items.push(...[...own].reverse());
    }
    return items;
  });

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
    >
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            maskImage: 'linear-gradient(to left, transparent 2%, rgba(0,0,0,0.3) 32%, black 70%)',
            WebkitMaskImage:
              'linear-gradient(to left, transparent 2%, rgba(0,0,0,0.3) 32%, black 70%)',
          }}
        >
          <div dir="ltr" className="flex h-full items-stretch justify-between gap-3 px-1 sm:px-5 lg:px-8">
            {columns.map((logos, col) => (
              <div key={col} className="relative w-16 overflow-hidden sm:w-24 lg:w-28">
                <motion.div
                  initial={reduceMotion ? false : { y: '-50%' }}
                  animate={reduceMotion ? undefined : { y: '0%' }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: durations[col], repeat: Infinity, ease: 'linear' }
                  }
                  className="flex flex-col will-change-transform"
                >
                  {[...logos, ...logos].map((logo, i) => (
                    <BrandTile key={`${logo.id}-${i}`} logo={logo} />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legibility scrims: strongest where the copy sits (right in RTL, top on mobile) */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#0a1120]/92 via-[#0a1120]/45 to-[#0a1120]/10" />
      <div className="absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-[#0a1120]/70 to-transparent" />
    </div>
  );
}

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
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1120] via-slate-900 to-[#06281e] text-white p-5 sm:p-10 lg:p-12 shadow-2xl shadow-emerald-500/10 border border-emerald-500/30 min-h-[380px] sm:min-h-[460px] flex"
    >
      <BrandRain />
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-8 items-center relative z-10 w-full">
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 backdrop-blur-md text-xs font-bold text-emerald-300 border border-emerald-500/30 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>فروشگاه‌های زنجیره‌ای مون مارکت؛ هویت رسمی</span>
          </div>

          <h1
            id="hero-title"
            className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight text-white drop-shadow-sm text-balance"
          >
            سوپرمارکت زنجیره‌ای مون مارکت
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl font-normal [text-shadow:0_1px_8px_rgba(6,12,24,0.9)]">
            عرضه مستقیم باکیفیت‌ترین کالاهای اساسی و خواربار، لبنیات تازه روز، محصولات تخصصی
            آرایشی و بهداشتی و شوینده‌های معتبر با تضمین ۱۰۰٪ اصالت، تخفیف‌های شگفت‌انگیز و
            ارسال اکسپرس درب منزل.
          </p>
        </div>

        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Dark disc so the falling marks never compete with the hero logo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute w-[220px] h-[220px] sm:w-[360px] sm:h-[360px] rounded-full bg-[radial-gradient(circle,rgba(4,14,12,0.88)_0%,rgba(4,14,12,0.55)_48%,transparent_72%)]"
          />
          <div className="relative h-[168px] w-full sm:h-[320px] md:h-[380px] lg:h-[420px]">
            <motion.div
              animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.18, 0.32, 0.18] }}
              transition={loop(4)}
              aria-hidden="true"
              className="absolute inset-6 rounded-full bg-emerald-500/25 blur-3xl"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="scale-[0.44] sm:scale-[0.78] md:scale-[0.94] lg:scale-100">
                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                  transition={loop(5)}
                >
                  <DigiMoonAnimatedLogo size="hero" draw shine="loop" float={false} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
