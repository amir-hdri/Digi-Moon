'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface DailyMarketLogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  isAnimated?: boolean;
  glow?: boolean;
  theme?: 'auto' | 'light' | 'dark';
}

const sizeMap = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
  '2xl': 'w-44 h-44',
  hero: 'w-52 h-52 sm:w-64 sm:h-64',
};

export const DailyMarketLogo: React.FC<DailyMarketLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  isAnimated = false,
  glow = false,
  theme = 'auto',
}) => {
  // SVG Stroke Draw Animation variants
  const strokeAnim = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: custom * 0.18, duration: 1.1 },
        opacity: { delay: custom * 0.18, duration: 0.2 },
      },
    }),
  };

  const fillAnim = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.7, duration: 0.5 },
    },
  };

  const textAnim = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 1.0, duration: 0.4 },
    },
  };

  const glowStyles = glow
    ? 'drop-shadow-[0_0_18px_rgba(0,168,89,0.5)] drop-shadow-[0_0_28px_rgba(225,29,72,0.4)]'
    : '';

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className} ${glowStyles}`}
      dir="rtl"
    >
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeMap[size]} overflow-visible transition-transform duration-300`}
      >
        <defs>
          {/* Green Gradients for Canopy */}
          <linearGradient id="canopyGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c853" />
            <stop offset="45%" stopColor="#00a651" />
            <stop offset="100%" stopColor="#00833a" />
          </linearGradient>

          {/* Mint Panels */}
          <linearGradient id="mintPanelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c7f9cc" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#80ed99" stopOpacity="0.7" />
          </linearGradient>

          {/* Red Ribbon Gradient */}
          <linearGradient id="redRibbonGrad" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ff2a55" />
            <stop offset="50%" stopColor="#e50914" />
            <stop offset="100%" stopColor="#b7000c" />
          </linearGradient>

          {/* Holographic light sweep */}
          <linearGradient id="holoShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Subtle Ambient Filter */}
          <filter id="canopyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* ====================================================================
            1. CANOPY / AWNING (سایبان سبز فروشگاهی دیلی مارکت)
            ==================================================================== */}
        <g id="canopy-group" filter="url(#canopyGlow)">
          {/* Mint Panel Fills */}
          {isAnimated ? (
            <motion.g variants={fillAnim} initial="hidden" animate="visible">
              {/* Left Panel */}
              <polygon points="68,36 102,36 92,62 50,62" fill="url(#mintPanelGrad)" />
              {/* Center Panel */}
              <polygon points="102,36 138,36 148,62 92,62" fill="url(#mintPanelGrad)" />
              {/* Right Panel */}
              <polygon points="138,36 172,36 190,62 148,62" fill="url(#mintPanelGrad)" />
              {/* Left Panel White Reflective Streak */}
              <polygon points="72,38 88,38 72,60 56,60" fill="white" fillOpacity="0.55" />
            </motion.g>
          ) : (
            <g>
              <polygon points="68,36 102,36 92,62 50,62" fill="url(#mintPanelGrad)" />
              <polygon points="102,36 138,36 148,62 92,62" fill="url(#mintPanelGrad)" />
              <polygon points="138,36 172,36 190,62 148,62" fill="url(#mintPanelGrad)" />
              <polygon points="72,38 88,38 72,60 56,60" fill="white" fillOpacity="0.55" />
            </g>
          )}

          {/* Outer Roof Sloping Border */}
          {isAnimated ? (
            <motion.path
              d="M 68 36 H 172 L 190 62 H 50 Z"
              stroke="url(#canopyGreenGrad)"
              strokeWidth="8"
              strokeLinejoin="round"
              strokeLinecap="round"
              variants={strokeAnim}
              custom={0}
              initial="hidden"
              animate="visible"
            />
          ) : (
            <path
              d="M 68 36 H 172 L 190 62 H 50 Z"
              stroke="url(#canopyGreenGrad)"
              strokeWidth="8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Roof Vertical Slat Dividers */}
          {isAnimated ? (
            <>
              <motion.line
                x1="102"
                y1="36"
                x2="92"
                y2="62"
                stroke="url(#canopyGreenGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                variants={strokeAnim}
                custom={0.8}
                initial="hidden"
                animate="visible"
              />
              <motion.line
                x1="138"
                y1="36"
                x2="148"
                y2="62"
                stroke="url(#canopyGreenGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                variants={strokeAnim}
                custom={0.8}
                initial="hidden"
                animate="visible"
              />
            </>
          ) : (
            <>
              <line x1="102" y1="36" x2="92" y2="62" stroke="url(#canopyGreenGrad)" strokeWidth="7" strokeLinecap="round" />
              <line x1="138" y1="36" x2="148" y2="62" stroke="url(#canopyGreenGrad)" strokeWidth="7" strokeLinecap="round" />
            </>
          )}

          {/* Scalloped Valance Arches (۳ قوس موج‌دار لبه سایبان) */}
          {isAnimated ? (
            <>
              {/* Left Arch with notch opening */}
              <motion.path
                d="M 50 64 C 48 88, 70 94, 76 94 M 76 94 C 84 94, 94 88, 94 64"
                stroke="url(#canopyGreenGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                variants={strokeAnim}
                custom={1.4}
                initial="hidden"
                animate="visible"
              />
              {/* Center Arch */}
              <motion.path
                d="M 94 64 C 94 96, 146 96, 146 64"
                stroke="url(#canopyGreenGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                variants={strokeAnim}
                custom={1.8}
                initial="hidden"
                animate="visible"
              />
              {/* Right Arch with notch opening */}
              <motion.path
                d="M 146 64 C 146 88, 156 94, 164 94 M 164 94 C 170 94, 192 88, 190 64"
                stroke="url(#canopyGreenGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                variants={strokeAnim}
                custom={2.2}
                initial="hidden"
                animate="visible"
              />
            </>
          ) : (
            <>
              <path d="M 50 64 C 48 88, 70 94, 76 94 M 76 94 C 84 94, 94 64" stroke="url(#canopyGreenGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 94 64 C 94 96, 146 96, 146 64" stroke="url(#canopyGreenGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 146 64 C 146 88, 156 94, 164 94 M 164 94 C 170 94, 192 88, 190 64" stroke="url(#canopyGreenGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>

        {/* ====================================================================
            2. RED WORDMARK "دیلی" (نشان‌نوشته سرخ خطی ممتد)
            ==================================================================== */}
        <g id="red-wordmark">
          {isAnimated ? (
            <motion.path
              d="M 182 136 
                 C 196 136, 196 156, 182 156 
                 C 168 156, 168 136, 182 136
                 C 152 136, 144 158, 132 158
                 C 120 158, 116 138, 100 138
                 C 84 138, 80 160, 66 160
                 C 54 160, 46 150, 46 134
                 C 46 118, 56 114, 66 114
                 C 76 114, 82 122, 82 134
                 C 82 148, 76 156, 66 156"
              stroke="url(#redRibbonGrad)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              variants={strokeAnim}
              custom={2.8}
              initial="hidden"
              animate="visible"
            />
          ) : (
            <path
              d="M 182 136 
                 C 196 136, 196 156, 182 156 
                 C 168 156, 168 136, 182 136
                 C 152 136, 144 158, 132 158
                 C 120 158, 116 138, 100 138
                 C 84 138, 80 160, 66 160
                 C 54 160, 46 150, 46 134
                 C 46 118, 56 114, 66 114
                 C 76 114, 82 122, 82 134
                 C 82 148, 76 156, 66 156"
              stroke="url(#redRibbonGrad)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}

          {/* Highlight Sheen on Red Ribbon */}
          {isAnimated ? (
            <motion.path
              d="M 182 138 C 190 138, 190 154, 182 154"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
              variants={fillAnim}
              initial="hidden"
              animate="visible"
            />
          ) : (
            <path
              d="M 182 138 C 190 138, 190 154, 182 154"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
            />
          )}
        </g>

        {/* ====================================================================
            3. SUBTITLE "مارکت" (تایپوگرافی مدرن خاکستری)
            ==================================================================== */}
        {variant !== 'icon' && (
          <g id="market-text">
            {isAnimated ? (
              <motion.text
                x="120"
                y="204"
                textAnchor="middle"
                fill={theme === 'dark' ? '#94a3b8' : '#718096'}
                fontSize="27"
                fontWeight="800"
                fontFamily="Vazirmatn, sans-serif"
                letterSpacing="3"
                variants={textAnim}
                initial="hidden"
                animate="visible"
                className="select-none"
              >
                مـــــارکـــــت
              </motion.text>
            ) : (
              <text
                x="120"
                y="204"
                textAnchor="middle"
                fill={theme === 'dark' ? '#94a3b8' : '#718096'}
                fontSize="27"
                fontWeight="800"
                fontFamily="Vazirmatn, sans-serif"
                letterSpacing="3"
                className="select-none"
              >
                مـــــارکـــــت
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};

export default DailyMarketLogo;
