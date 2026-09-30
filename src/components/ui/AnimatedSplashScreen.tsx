'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { DigiMoonAnimatedLogo } from './DigiMoonAnimatedLogo';
import { ArrowLeft } from 'lucide-react';

export interface AnimatedSplashScreenProps {
  onComplete?: () => void;
  durationMs?: number;
}

/** Deterministic starfield so SSR/CSR renders match (no Math.random hydration drift). */
const STARS = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 1.5 + ((i * 17) % 10) / 5,
  delay: (i * 0.41) % 2.6,
  duration: 1.9 + ((i * 29) % 16) / 10,
  emerald: i % 4 === 0,
}));

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Minimum brand moment: the splash never exits before this, even on instant
 * loads, so the mark reveal is never cut off mid-draw.
 */
const MIN_SPLASH_MS = 2000;

/**
 * Landing intro: the Digi-Moon mark alone, large, over a deep emerald night sky —
 * it sketches itself in stroke by stroke, fills with brand color, then picks up its
 * orbit ring, gloss sweep and sparkles. Exits with a scale + blur dissolve.
 */
export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onComplete,
  durationMs = 3600,
}) => {
  const reduce = useReducedMotion();
  const [isFinished, setIsFinished] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setIsFinished(true);
      onCompleteRef.current?.();
    };
    // Hard cap (previous behaviour): never hold the splash past durationMs.
    const maxTimer = setTimeout(finish, durationMs);
    // Soft gate: once the page is ready (fonts + window load) AND the brand
    // mark has had its minimum moment, dismiss early so the LCP content is
    // revealed instead of idling behind the overlay. On slow networks
    // `document.fonts.ready` resolves late and the max timer wins, which is
    // behaviourally identical to before.
    const minTimer = setTimeout(
      () => {
        const fontsReady =
          typeof document !== 'undefined' && typeof document.fonts !== 'undefined'
            ? document.fonts.ready.catch(() => undefined)
            : Promise.resolve();
        const loaded =
          document.readyState === 'complete'
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                window.addEventListener('load', () => resolve(), { once: true });
              });
        void Promise.all([fontsReady, loaded]).then(finish);
      },
      Math.min(MIN_SPLASH_MS, durationMs)
    );

    return () => {
      done = true;
      clearTimeout(maxTimer);
      clearTimeout(minTimer);
    };
  }, [durationMs]);

  const handleSkip = () => {
    setIsFinished(true);
    onCompleteRef.current?.();
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="moon-market-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.06,
            // NOTE: no `filter: blur()` here — animating a full-viewport filter
            // forces a per-frame raster of the whole subtree and drops frames
            // on mobile right as the shop is revealed. Opacity + scale composite.
            transition: { duration: 0.65, ease: EASE_OUT_EXPO },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, #064e3b 0%, #022c22 45%, #030d12 100%)',
          }}
          aria-label="انیمیشن معرفی مون مارکت"
        >
          {/* Ambient aurora halos */}
          <motion.div
            animate={reduce ? undefined : { scale: [1, 1.22, 1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="absolute -top-32 -right-32 w-[42rem] h-[42rem] bg-gradient-to-br from-emerald-400/30 via-teal-400/12 to-transparent rounded-full blur-[96px] pointer-events-none"
            aria-hidden
          />
          <motion.div
            animate={reduce ? undefined : { scale: [1.18, 1, 1.18], opacity: [0.2, 0.42, 0.2] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.6 }}
            className="absolute -bottom-32 -left-32 w-[42rem] h-[42rem] bg-gradient-to-tr from-rose-500/22 via-red-500/10 to-transparent rounded-full blur-[96px] pointer-events-none"
            aria-hidden
          />
          <motion.div
            animate={reduce ? undefined : { opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute inset-0 m-auto w-[30rem] h-[30rem] bg-gradient-to-r from-emerald-400/18 via-teal-300/12 to-emerald-500/12 rounded-full blur-[72px] pointer-events-none"
            aria-hidden
          />

          {/* Night-sky starfield */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {STARS.map((star, i) => (
              <motion.span
                key={i}
                className={`absolute block rounded-full ${star.emerald ? 'bg-emerald-300' : 'bg-white'}`}
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  width: star.size,
                  height: star.size,
                  marginLeft: -star.size / 2,
                  marginTop: -star.size / 2,
                }}
                initial={{ opacity: 0 }}
                animate={reduce ? { opacity: 0.35 } : { opacity: [0.08, 0.85, 0.08] }}
                transition={
                  reduce
                    ? { duration: 0.3 }
                    : { duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }
                }
              />
            ))}
          </div>

          {/* Grid lines overlay */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
            aria-hidden
          />

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            onClick={handleSkip}
            className="absolute top-5 end-5 z-20 text-xs text-white/80 hover:text-white px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/18 border border-white/20 transition-colors cursor-pointer flex items-center gap-1.5 backdrop-blur-md shadow-sm"
          >
            <span>ورود به فروشگاه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </motion.button>

          {/* The mark alone — stroke-draws itself, then fills with brand color */}
          <div className="relative z-10 flex items-center justify-center">
            <DigiMoonAnimatedLogo
              size="hero"
              draw
              shine="once"
              showOrbit
              showSparkles
              className="origin-center scale-105 sm:scale-125 lg:scale-150"
            />
          </div>

          <span className="sr-only" role="status">
            در حال آماده‌سازی فروشگاه مون مارکت
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSplashScreen;
