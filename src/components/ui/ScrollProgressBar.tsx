'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 inset-x-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 origin-right z-[60] pointer-events-none"
      />
      {/* Glow beneath */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 inset-x-0 h-[3px] blur-sm bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 origin-right z-[59] pointer-events-none opacity-60"
      />
    </>
  );
};
