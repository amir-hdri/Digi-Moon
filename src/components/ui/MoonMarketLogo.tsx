'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface MoonMarketLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  isAnimated?: boolean;
  glow?: boolean;
  /** Preload when the mark is above the fold (e.g. the header logo). */
  priority?: boolean;
}

const sizeMap = {
  xs:   { width: 32,  height: 32 },
  sm:   { width: 40,  height: 40 },
  md:   { width: 64,  height: 64 },
  lg:   { width: 96,  height: 96 },
  xl:   { width: 144, height: 144 },
  '2xl':{ width: 208, height: 208 },
  hero: { width: 256, height: 256 },
};

export const MoonMarketLogo: React.FC<MoonMarketLogoProps> = ({
  size = 'md',
  className = '',
  isAnimated = false,
  glow = false,
  priority = false,
}) => {
  const dims = sizeMap[size];

  const glowClass = glow
    ? 'drop-shadow-[0_0_18px_rgba(22,163,74,0.55)] drop-shadow-[0_0_32px_rgba(220,38,38,0.35)]'
    : '';

  const Wrapper = isAnimated ? motion.div : 'div';
  const animationProps = isAnimated
    ? {
        initial: { opacity: 0, scale: 0.82 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.65, ease: 'easeOut' as const },
      }
    : {};

  return (
    <Wrapper
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${glowClass} ${className}`}
      {...animationProps}
    >
      <Image
        src="/logo-moonmarket.svg"
        alt="لوگوی مون مارکت"
        width={dims.width}
        height={dims.height}
        unoptimized
        priority={priority}
        className="object-contain"
        draggable={false}
        /* Preflight forces `height:auto`; pin both axes so the intrinsic SVG
           ratio cannot stretch the box (and trip next/image's aspect warning). */
        style={{ width: dims.width, height: dims.height }}
      />
    </Wrapper>
  );
};

export default MoonMarketLogo;
