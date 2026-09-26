'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonMarketLogo } from './MoonMarketLogo';
import { ArrowLeft, Sparkles } from 'lucide-react';

export interface AnimatedSplashScreenProps {
  onComplete?: () => void;
  durationMs?: number;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onComplete,
  durationMs = 2800,
}) => {
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const totalSteps = 50;
    const stepMs = durationMs / totalSteps;
    let step = 0;
    const progressTimer = setInterval(() => {
      step++;
      setProgress(Math.min((step / totalSteps) * 100, 100));
      if (step >= totalSteps) clearInterval(progressTimer);
    }, stepMs);

    const endTimer = setTimeout(() => {
      setIsFinished(true);
      onCompleteRef.current?.();
    }, durationMs);

    return () => {
      clearTimeout(endTimer);
      clearInterval(progressTimer);
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
            filter: 'blur(18px)',
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, #064e3b 0%, #022c22 45%, #030d12 100%)',
          }}
        >
          {/* Ambient halos */}
          <motion.div
            animate={{ scale: [1, 1.22, 1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="absolute -top-32 -right-32 w-[42rem] h-[42rem] bg-gradient-to-br from-emerald-400/30 via-teal-400/12 to-transparent rounded-full blur-[130px] pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1.18, 1, 1.18], opacity: [0.2, 0.42, 0.2] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.6 }}
            className="absolute -bottom-32 -left-32 w-[42rem] h-[42rem] bg-gradient-to-tr from-rose-500/22 via-red-500/10 to-transparent rounded-full blur-[130px] pointer-events-none"
          />

          {/* Center radiance */}
          <motion.div
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute inset-0 m-auto w-[30rem] h-[30rem] bg-gradient-to-r from-emerald-400/18 via-teal-300/12 to-emerald-500/12 rounded-full blur-[100px] pointer-events-none"
          />

          {/* Grid lines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            onClick={handleSkip}
            className="absolute top-5 end-5 z-20 text-xs text-white/80 hover:text-white px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/18 border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md shadow-sm"
          >
            <span>ورود به فروشگاه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </motion.button>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-7">
            {/* Logo with glow ring */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -9, 0] }}
              transition={{
                scale: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.55 },
                y: { repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.8 },
              }}
              className="relative flex items-center justify-center"
            >
              {/* Outer glow ring */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="absolute inset-0 m-auto rounded-full bg-emerald-500/30 blur-xl"
                style={{ width: '110%', height: '110%' }}
              />
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/30">
                <MoonMarketLogo
                  size="2xl"
                  isAnimated={true}
                  glow={true}
                />
              </div>
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
              className="text-center space-y-1.5"
            >
              <div className="flex items-center justify-center gap-2.5 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  مون مارکت
                </h1>
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm text-emerald-300/85 font-semibold tracking-wide">
                سوپرمارکت زنجیره‌ای | ارسال فوری
              </p>
              <p className="text-xs text-white/45 font-medium">
                مایحتاج روزمره، لبنیات، آرایشی‌بهداشتی
              </p>
            </motion.div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.6, 1], opacity: [0.35, 1, 0.35] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.18, ease: 'easeInOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="w-32 h-0.5 rounded-full bg-white/15 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="absolute bottom-8 left-0 right-0 flex justify-center"
          >
            <p className="text-[11px] text-white/30 font-medium">
              تجربه خریدی بی‌نظیر، هر روز، هر ساعت
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSplashScreen;
