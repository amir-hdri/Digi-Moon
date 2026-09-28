'use client';

import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { toPersianDigits } from '@/lib/persian';

export interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from = 0,
  to,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    damping: 35,
    stiffness: 100,
    duration: duration * 1000,
  });
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      // No animation — jump straight to the final formatted value so the
      // stat is never stuck at zero for reduced-motion users.
      if (ref.current) {
        const final =
          decimals > 0 ? to.toFixed(decimals) : to.toLocaleString('fa-IR');
        ref.current.textContent = `${prefix}${toPersianDigits(final)}${suffix}`;
      }
      return;
    }
    motionValue.set(to);
  }, [isInView, motionValue, to, reduceMotion, prefix, suffix, decimals]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        const formattedNumber = decimals > 0 
          ? latest.toFixed(decimals) 
          : Math.round(latest).toLocaleString('fa-IR');
        ref.current.textContent = `${prefix}${toPersianDigits(formattedNumber)}${suffix}`;
      }
    });

    return () => unsubscribe();
  }, [springValue, prefix, suffix, decimals]);

  return (
    <span
      ref={ref}
      className={`inline-block tabular-nums ${className}`}
    >
      {prefix}
      {toPersianDigits(from.toLocaleString('fa-IR'))}
      {suffix}
    </span>
  );
};
