'use client';

import React, { useId } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { DIGIMOON_LOGO_LAYERS, DIGIMOON_LOGO_VIEWBOX } from '@/lib/digimoon-logo-paths';

export type LogoShine = 'once' | 'loop' | 'none';

export interface DigiMoonAnimatedLogoProps {
  /** Visual size of the logo mark itself. The orbit/sparkle frame scales around it. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  /** Start with the logo being stroke-drawn layer by layer, then fill in. */
  draw?: boolean;
  /** Gradient orbit ring + travelling moon dot around the mark. */
  showOrbit?: boolean;
  /** Twinkling 4-point stars in the outer band. */
  showSparkles?: boolean;
  /** Gloss sweep across the logo silhouette: once on entrance, looping, or off. */
  shine?: LogoShine;
  /** Gentle idle float (disable when the parent card already floats). */
  float?: boolean;
  /** Accessible name — keep localized. */
  label?: string;
  className?: string;
}

const LOGO_SIZES = { sm: 40, md: 64, lg: 96, xl: 144, hero: 256 } as const;
/** Wrapper must be wider than the mark so the orbit ring never clips it. */
const FRAME_SCALE = 1.42;

const SPARKS = [
  { top: 11, left: 17, size: 11, delay: 1.2, dur: 2.2, emerald: false },
  { top: 17, left: 81, size: 9, delay: 1.7, dur: 1.9, emerald: true },
  { top: 79, left: 14, size: 8, delay: 2.1, dur: 2.5, emerald: true },
  { top: 85, left: 77, size: 10, delay: 2.5, dur: 2.1, emerald: false },
  { top: 52, left: 7, size: 7, delay: 2.9, dur: 2.7, emerald: false },
] as const;

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_DRAW: [number, number, number, number] = [0.45, 0, 0.25, 1];

/** Phase offsets (seconds). With `draw`, everything waits for the sketch to land. */
const TIMELINE = {
  draw: { img: 1.4, strokeFade: 1.55, ring: 1.6, shineOnce: 2.1, shineLoop: 3.0, spark: 1.0, float: 2.4 },
  instant: { img: 0, strokeFade: 0, ring: 0.25, shineOnce: 1.0, shineLoop: 1.6, spark: 0, float: 1.4 },
} as const;

/**
 * Digi-Moon logo reveal:
 * 1. **Draw** — the six brand-color vector layers sketch themselves in as glowing
 *    outlines (stroke-dashoffset), canopy first, then مون, then مارکت.
 * 2. **Fill** — the full-color mark crossfades over the sketch as it fades out.
 * 3. **Live** — orbiting moon dot, tilted comet ring, gloss sweep clipped to the
 *    logo silhouette (CSS alpha-mask) and twinkling sparkles.
 *
 * Degrades to a static mark under `prefers-reduced-motion` or `draw={false}`.
 */
export const DigiMoonAnimatedLogo: React.FC<DigiMoonAnimatedLogoProps> = ({
  size = 'lg',
  draw = true,
  showOrbit = true,
  showSparkles = true,
  shine = 'once',
  float = false,
  label = 'لوگوی مون مارکت',
  className = '',
}) => {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[:]/g, '');
  const dim = LOGO_SIZES[size];
  const frame = Math.round(dim * FRAME_SCALE);
  const showDraw = draw && !reduce;
  const t = showDraw ? TIMELINE.draw : TIMELINE.instant;
  /** Constant ~2.5px on-screen stroke regardless of logo size. */
  const strokeW = Math.round(1700 / dim);

  const shineTransition = shine === 'loop'
    ? { duration: 1.4, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut' as const, delay: t.shineLoop }
    : { duration: 1.3, ease: 'easeInOut' as const, delay: t.shineOnce };

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative inline-flex shrink-0 items-center justify-center select-none ${className}`}
      style={{ width: frame, height: frame }}
    >
      {/* Ambient brand halo */}
      <motion.div
        aria-hidden
        className="absolute inset-[16%] rounded-full bg-emerald-500/25 blur-2xl"
        initial={{ opacity: 0 }}
        animate={reduce ? { opacity: 0.4 } : { opacity: [0.25, 0.6, 0.25], scale: [1, 1.08, 1] }}
        transition={reduce ? { duration: 0.4 } : { duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />

      {/* Orbit system */}
      {showOrbit && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/* Ring A — gradient circle with a moon dot orbiting it */}
          <motion.div
            className="absolute inset-0"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
          >
            <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id={`ring-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d294" stopOpacity="0.95" />
                  <stop offset="45%" stopColor="#46ecd5" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00d294" stopOpacity="0.06" />
                </linearGradient>
                <radialGradient id={`dot-${uid}`}>
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="#00d294" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#00d294" stopOpacity="0" />
                </radialGradient>
              </defs>
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={`url(#ring-${uid})`}
                strokeWidth="1.6"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.3, delay: t.ring, ease: EASE_OUT_EXPO }}
              />
              {/* Orbiting moon */}
              <circle cx="100" cy="10" r="9" fill={`url(#dot-${uid})`} />
              <circle cx="100" cy="10" r="2.6" fill="#ffffff" />
            </svg>
          </motion.div>

          {/* Ring B — tilted ellipse with a travelling comet segment */}
          <motion.div
            className="absolute inset-0"
            initial={showDraw ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: t.ring + 0.1, duration: 0.5 }}
          >
            <div className="absolute inset-0" style={{ transform: 'rotate(-24deg)' }}>
              <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
                {/* Faint track */}
                <ellipse
                  cx="100"
                  cy="100"
                  rx="90"
                  ry="44"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeOpacity="0.3"
                  strokeWidth="1.3"
                />
                {/* Travelling comet (CSS-driven, disabled by prefers-reduced-motion) */}
                <ellipse
                  cx="100"
                  cy="100"
                  rx="90"
                  ry="44"
                  fill="none"
                  stroke="#5eead4"
                  strokeOpacity="0.9"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="0.16 0.84"
                  className="animate-comet-orbit"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      )}

      {/* Logo mark + gloss sweep */}
      <motion.div
        className="relative z-10"
        animate={float && !reduce ? { y: [0, -7, 0] } : undefined}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: t.float }}
      >
        <div className="relative" style={{ width: dim, height: dim }}>
          {/* Full-color mark — held back until the stroke draw hands off */}
          <motion.div
            className="absolute inset-0 z-10"
            initial={showDraw ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: t.img, duration: 0.5, ease: 'easeOut' }}
          >
            <Image
              src="/logo-moonmarket.svg"
              alt=""
              width={dim}
              height={dim}
              unoptimized
              priority={size === 'hero'}
              className="h-full w-full object-contain"
              draggable={false}
            />
          </motion.div>

          {/* Stroke-draw sketch of the six brand-color layers */}
          {showDraw && (
            <motion.svg
              viewBox={DIGIMOON_LOGO_VIEWBOX}
              className="absolute inset-0 z-30 h-full w-full"
              fill="none"
              aria-hidden
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: t.strokeFade, duration: 0.4 }}
            >
              {DIGIMOON_LOGO_LAYERS.map((layer, i) => (
                <motion.path
                  key={`${layer.fill}-${i}`}
                  d={layer.d}
                  stroke={layer.fill}
                  strokeWidth={strokeW}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.12 + i * 0.1, duration: 0.95, ease: EASE_DRAW }}
                />
              ))}
            </motion.svg>
          )}

          {/* Gloss sweep, masked to the logo silhouette */}
          {shine !== 'none' && !reduce && (
            <div
              aria-hidden
              className="absolute inset-0 z-20 overflow-hidden"
              style={{
                WebkitMaskImage: 'url(/logo-moonmarket.svg)',
                maskImage: 'url(/logo-moonmarket.svg)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            >
              <motion.div
                className="absolute inset-y-[-12%] left-0 w-[55%]"
                style={{
                  background:
                    'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.12) 35%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.12) 65%, transparent 100%)',
                }}
                initial={{ x: '230%' }}
                animate={{ x: '-270%' }}
                transition={shineTransition}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Sparkles */}
      {showSparkles && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {SPARKS.map((s, i) => (
            <motion.span
              key={i}
              className={`absolute block ${s.emerald ? 'text-emerald-300' : 'text-white'}`}
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: s.size,
                height: s.size,
                marginLeft: -s.size / 2,
                marginTop: -s.size / 2,
              }}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={
                reduce
                  ? { opacity: 0.75, scale: 1 }
                  : { opacity: [0, 1, 0], scale: [0.2, 1, 0.2], rotate: [0, 90, 180] }
              }
              transition={
                reduce
                  ? { duration: 0.3 }
                  : {
                      duration: s.dur,
                      delay: s.delay + t.spark,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            >
              <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
                <path d="M12 0c.9 6.2 4.9 10.2 12 12-7.1 1.8-11.1 5.8-12 12-.9-6.2-4.9-10.2-12-12C7.1 10.2 11.1 6.2 12 0Z" />
              </svg>
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DigiMoonAnimatedLogo;
