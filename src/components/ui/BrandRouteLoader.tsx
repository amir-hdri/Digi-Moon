'use client';

import React from 'react';
import { DigiMoonAnimatedLogo } from './DigiMoonAnimatedLogo';

export interface BrandRouteLoaderProps {
  /**
   * `inline` — compact strip for the top of a skeleton page.
   * `hero` — large centered block (e.g. occupying the hero slot while the page streams).
   */
  variant?: 'inline' | 'hero';
  /** Localized busy message announced to assistive tech. */
  label?: string;
  className?: string;
}

/**
 * Branded route-loading indicator: the Digi-Moon mark alone, large — it sketches
 * itself in stroke by stroke, then fills with brand color. The label is announced
 * politely to assistive tech but never rendered visibly.
 * Static-friendly — `prefers-reduced-motion` collapses all loops via the
 * global CSS safety net and `useReducedMotion` inside the logo.
 */
export const BrandRouteLoader: React.FC<BrandRouteLoaderProps> = ({
  variant = 'inline',
  label = 'در حال بارگذاری…',
  className = '',
}) => {
  const isHero = variant === 'hero';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex items-center justify-center ${className}`}
    >
      <span className="sr-only">{label}</span>

      <DigiMoonAnimatedLogo
        size={isHero ? 'hero' : 'lg'}
        draw
        shine="none"
        showSparkles={false}
        showOrbit
        float={false}
        label={label}
        className={isHero ? '' : 'scale-90'}
      />
    </div>
  );
};

export default BrandRouteLoader;
