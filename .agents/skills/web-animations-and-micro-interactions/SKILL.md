---
name: web-animations-and-micro-interactions
description: >-
  Use when designing, implementing, or optimizing animations and micro-interactions
  in Next.js 15+, React 19, Tailwind CSS v4, and Framer Motion / Motion.
  Trigger on mentions of: animations, micro-interactions, Framer Motion, Motion,
  transitions, hover effects, page transitions, layoutId, shared layout, scroll animations,
  useScroll, gestures, drag-to-dismiss, spring physics, CSS view transitions,
  @starting-style, scroll-driven animations, RTL animations, Persian/Farsi slide directions,
  interactive cards, button feedback, skeleton shimmer, or animation performance audits.
---

# Web Animations & Micro-Interactions (Next.js 15, React 19, Tailwind CSS v4 & Framer Motion)

## Overview

High-performance web animation is the difference between a functional interface and an unforgettable digital experience. In modern web engineering, animations must be **tactile, purposeful, compositor-driven, and accessible**.

This skill provides comprehensive patterns, architectural guidelines, and battle-tested TypeScript components for:
- **Framer Motion / Motion library** in Next.js 15 App Router & React 19.
- **Modern CSS-native animations** (`@starting-style`, `transition-behavior: allow-discrete`, scroll-driven animations).
- **Tactile micro-interactions** that give users immediate, satisfying feedback.
- **RTL-aware (Right-to-Left) animations** engineered specifically for Persian / Farsi interfaces.
- **60/120fps performance engineering**, avoiding layout thrashing, and respecting user accessibility settings.

---

## Animation Decision Matrix

Choose the simplest technology that achieves the design goal without unnecessary JS overhead:

```
What is the nature of the animation?
├── Pure entry/exit on native DOM/Dialog without complex orchestration?
│   └── Modern CSS (@starting-style + transition-behavior: allow-discrete)
├── Scroll-progress indicator or reveal-on-scroll with no React state?
│   ├── CSS-only scroll-driven animation (animation-timeline: view() / scroll())
│   └── Complex dynamic transform or React hooks needed → Framer Motion useScroll
├── Shared element transition between routes or list items?
│   └── Framer Motion layoutId / LayoutGroup
├── Interactive micro-interaction (tactile button, spring toggle, 3D tilt)?
│   └── Framer Motion (whileTap, whileHover, useMotionValue, useSpring)
├── Gesture-driven UI (swipe-to-delete, drag sheet, pull-to-refresh)?
│   └── Framer Motion drag gestures (drag="x" | "y", dragElastic)
└── Complex layout reflows (reordering lists, filter transitions)?
    └── Framer Motion layout prop + AnimatePresence
```

| Use Case | Recommended Engine | Rationale |
|---|---|---|
| Native Modals / Popovers | CSS `@starting-style` | Zero JS footprint, native browser lifecycle |
| Button Tap / Hover Feedback | Framer Motion `whileTap` / `whileHover` | Instant spring physics, no stale CSS state |
| Shared Active Tab Indicator | Framer Motion `layoutId` | Hardware-accelerated FLIP calculation |
| RTL Drawer / Sheet Dismiss | Framer Motion `drag` + `AnimatePresence` | Inertia snapping, velocity-based dismissal |
| Parallax Tilt Card | `useMotionValue` + `useTransform` | Updates without triggering React re-renders |
| Long List Item Stagger | Framer Motion `variants` + `staggerChildren` | Declarative, coordinated sequencing |
| Scroll Reading Progress Bar | Framer Motion `useScroll` + `useSpring` | Fluid smooth spring lag, zero layout jank |
| Content Skeleton Placeholder | CSS `@keyframes shimmer` (Tailwind v4) | Pure GPU compositor loop, lightweight |

---

## Pillar 1: Framer Motion & Motion Library Architecture

### React 19 & Next.js 15 Setup

Modern Framer Motion (`framer-motion` v11+ and `motion` v12+) fully supports React 19. Always place `'use client'` at the top of components utilizing motion hooks or elements.

```tsx
'use client';

// In modern Motion / Framer Motion:
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
// Or if using the unified "motion" package:
// import { motion, AnimatePresence } from 'motion/react';
```

### Spring Physics Fundamentals

Never use linear or arbitrary bezier easing for physical UI objects (buttons, drawers, badges). Use **damped harmonic oscillator springs**:

$$\text{Force} = -k \cdot x - c \cdot v$$

- `stiffness` ($k$): Resistance to stretching. Higher = faster, snappier reaction (e.g., 300–500).
- `damping` ($c$): Friction opposing movement. Lower = more bouncy oscillation; higher = critically damped, smooth stop (e.g., 20–35).
- `mass` ($m$): Weight of the object. Higher = more inertia and overshoot (default: 1).

#### Standard Production Spring Presets

```typescript
export const SPRING_PRESETS = {
  // Snappy: For micro-interactions, buttons, small badges, toggles
  snappy: { type: 'spring', stiffness: 450, damping: 30, mass: 0.8 },
  
  // Gentle / Natural: For dialogs, modal popups, cards
  gentle: { type: 'spring', stiffness: 280, damping: 26, mass: 1 },
  
  // Bouncy: For celebratory alerts, attention indicators, heart icons
  bouncy: { type: 'spring', stiffness: 400, damping: 14, mass: 0.9 },
  
  // Fluid / Smooth: For bottom sheets, navigation drawers, full-page panels
  fluid: { type: 'spring', stiffness: 200, damping: 24, mass: 1.1 },
} as const;
```

### Motion Props Lifecycle & Orchestration

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};
```

---

## Pillar 2: RTL-Aware Motion Architecture (Persian / Farsi)

Persian web design requires strict adherence to right-to-left layout and cultural reading ergonomics. Directional animations that feel natural in English will feel backwards in Persian if not mirrored.

### 1. The X-Axis Polarity Rule in RTL

- In LTR (English), positive $X$ moves **right** (forward), negative $X$ moves **left** (backward).
- In RTL (Persian):
  - Reading flow starts on the **right** edge ($X = \text{max}$).
  - Forward progression (next page, advance step) moves **towards the left** ($-X$).
  - Backward progression (previous page, return) moves **towards the right** ($+X$).

```typescript
// Helper hook for RTL-aware horizontal translations
export function useRtlTranslate() {
  const isRtl = typeof document !== 'undefined' 
    ? document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('lang') === 'fa'
    : true; // Default true for Digi-Moon

  return {
    isRtl,
    // Slide in from reading origin (Right in Persian, Left in English)
    slideInOrigin: isRtl ? { x: '100%' } : { x: '-100%' },
    // Slide in from opposite edge (Left in Persian, Right in English)
    slideInOpposite: isRtl ? { x: '-100%' } : { x: '100%' },
    // Direction multiplier for pixel offsets
    rtlMultiplier: isRtl ? -1 : 1,
  };
}
```

### 2. RTL Drawer Anchoring & Swipe Gestures

- **Category / Primary Menu Drawer**: Typically opens from the **right side** in RTL (docked at `right: 0`). Slide initial value: `initial={{ x: '100%' }}` and `animate={{ x: 0 }}`.
- **Cart / Secondary Panel Drawer**: Can open from the **left side** in RTL (docked at `left: 0`). Slide initial value: `initial={{ x: '-100%' }}` and `animate={{ x: 0 }}`.
- **Swipe-to-Dismiss / Swipe Actions**:
  - In Persian e-commerce, dragging a cart item **leftward** (`-X`) reveals the Delete action (natural swipe out).
  - Drag constraints must enforce `dragConstraints={{ left: -100, right: 0 }}` for RTL delete gestures.

---

## Pillar 3: Modern CSS-Native Animations (Tailwind CSS v4)

Tailwind CSS v4 introduces CSS-first configuration and first-class support for cutting-edge browser standards.

### 1. `@starting-style` and `transition-behavior: allow-discrete`

Previously, animating elements from `display: none` to `display: block` required JavaScript timeouts or `AnimatePresence`. Modern CSS solves this natively:

```css
/* In globals.css (Tailwind CSS v4) */
@utility dialog-popover-transition {
  transition: 
    opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    overlay 0.25s allow-discrete,
    display 0.25s allow-discrete;
  opacity: 1;
  transform: scale(1) translateY(0);
}

@starting-style {
  .dialog-popover-transition[open] {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
}
```

### 2. Native CSS Scroll-Driven Animations

Modern Chromium and Safari 18+ support native CSS scroll timelines without JavaScript execution:

```css
@keyframes header-elevate {
  to {
    background-color: rgba(255, 255, 255, 0.85);
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(12px);
  }
}

.scroll-header {
  animation: header-elevate linear both;
  animation-timeline: scroll(root);
  animation-range: 0px 80px;
}
```

### 3. Tailwind CSS v4 Theme Animation Configuration

```css
/* In globals.css */
@theme {
  --animate-shimmer: shimmer 2s infinite linear;
  --animate-pulse-subtle: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-float: floating 3s ease-in-out infinite;

  @keyframes shimmer {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }

  @keyframes pulse-subtle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(0.98); }
  }

  @keyframes floating {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
}
```

---

## Pillar 4: Performance & Compositor Best Practices

### The Compositor Rule
Only animate properties handled exclusively by the GPU compositor thread:
- ✅ **`transform`**: `translate3d`, `scale`, `rotate`
- ✅ **`opacity`**
- ❌ **NEVER animate**: `width`, `height`, `top`, `left`, `margin`, `padding`, `border-width`. These force CPU **Layout (Reflow)** and **Paint (Rasterization)** on every frame!

### When and How to Animate Size: The FLIP Technique
To animate size changes (e.g. expanding accordion or card), use Framer Motion's `layout` prop. Framer Motion internally executes the FLIP (First, Last, Invert, Play) technique:
1. Calculates initial bounding rect (`First`).
2. Applies layout change and calculates new rect (`Last`).
3. Translates and scales back to match initial look (`Invert`).
4. Animates `transform: translate(...) scale(...)` back to 1 (`Play`).
Result: Silky 60/120fps with zero layout thrashing!

### Layer Promotion & `will-change` Discipline
- Use `will-change: transform` only on active animations, not permanently on 50+ list items.
- Remove `will-change` on idle elements to prevent GPU VRAM exhaustion on mobile devices.
- In Framer Motion, `transform: translateZ(0)` is automatically applied during active tweens.

### Respecting `prefers-reduced-motion`

Always provide a smooth, instantaneous fallback for users who experience vestibular motion disorders:

```tsx
import { useReducedMotion } from 'framer-motion';

export function useAccessibleMotion() {
  const shouldReduceMotion = useReducedMotion();

  return {
    shouldReduceMotion,
    // When reduced motion is requested, instantly set target state without movement
    springOrInstant: shouldReduceMotion 
      ? { duration: 0 } 
      : { type: 'spring', stiffness: 350, damping: 25 },
    fadeOnly: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
    },
  };
}
```

---

## Pillar 5: Practical Production Components (13 Complete Examples)

Below are 13 production-ready, fully typed TypeScript & React 19 components optimized for Digi-Moon's emerald design system, Tailwind CSS v4, and RTL layout.

---

### 1. `TactileButton.tsx` (Tactile Spring Feedback & Loading Morph)

Provides instant scale-down tap response, subtle hover elevation, liquid sheen highlight, and morphing spinner transition.

```tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-bold select-none overflow-hidden cursor-pointer rounded-2xl transition-colors focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs gap-1.5',
    md: 'h-11 px-5 text-sm gap-2',
    lg: 'h-13 px-6 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/30',
    secondary:
      'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200/80 dark:border-zinc-700',
    ghost:
      'bg-transparent text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60',
    danger:
      'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-md shadow-rose-500/20',
  };

  return (
    <motion.button
      whileHover={disabled || isLoading ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.96, y: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...(props as any)}
    >
      {/* Specular Liquid Sheen Overlay */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.span
            key="spinner"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>در حال پردازش...</span>
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            {icon && <span className="shrink-0">{icon}</span>}
            <span>{children}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
```

---

### 2. `RtlNavPillTabs.tsx` (Shared `layoutId` Active Indicator in RTL)

Demonstrates smooth sliding indicator between navigation items without re-mounting or jumpy positioning, fully compatible with RTL text flow.

```tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface RtlNavPillTabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  onTabChange?: (tabId: string) => void;
}

export const RtlNavPillTabs: React.FC<RtlNavPillTabsProps> = ({
  tabs,
  defaultTabId,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id);

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onTabChange?.(id);
  };

  return (
    <div
      dir="rtl"
      className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 gap-1 select-none"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSelect(tab.id)}
            className="relative px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors duration-200 outline-hidden z-10"
          >
            {/* Active Pill Spring Indicator */}
            {isActive && (
              <motion.div
                layoutId="activePillIndicator"
                className="absolute inset-0 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-slate-200/60 dark:border-zinc-700 z-[-1]"
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}

            <span
              className={`relative z-10 transition-colors duration-200 flex items-center gap-1.5 ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
```

---

### 3. `SpringSwitch.tsx` (Tactile Toggle Switch with Icon & Spring Physics)

```tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface SpringSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const SpringSwitch: React.FC<SpringSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <label
      dir="rtl"
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-emerald-500 ${
          checked
            ? 'bg-emerald-500 shadow-inner shadow-emerald-700/20'
            : 'bg-slate-300 dark:bg-zinc-700'
        }`}
      >
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 550,
            damping: 32,
          }}
          className={`w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center ${
            checked ? 'mr-auto ml-0' : 'ml-auto mr-0'
          }`}
        >
          <motion.div
            key={checked ? 'check' : 'x'}
            initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {checked ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
            )}
          </motion.div>
        </motion.div>
      </div>

      {label && (
        <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
          {label}
        </span>
      )}
    </label>
  );
};
```

---

### 4. `TiltGlowCard.tsx` (3D Interactive Parallax & Dynamic Radial Glow)

Uses direct `useMotionValue` and `useTransform` to achieve 120fps 3D card tilt and pointer-following liquid glow without causing React component re-renders.

```tsx
'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface TiltGlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const TiltGlowCard: React.FC<TiltGlowCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(0, 187, 127, 0.18)',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse coordinates normalized from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Pixel coordinates for radial background glow
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  // Smooth out tilt rotations with springs
  const springConfig = { stiffness: 350, damping: 25 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Set pixel positions for radial glow
    glowX.set(clientX);
    glowY.set(clientY);

    // Set normalized positions (-0.5 to 0.5) for 3D rotation
    mouseX.set(clientX / rect.width - 0.5);
    mouseY.set(clientY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="inline-block w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 shadow-lg transition-shadow hover:shadow-2xl hover:shadow-emerald-500/10 ${className}`}
      >
        {/* Pointer-Following Radial Glow Highlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(400px circle at ${x}px ${y}px, ${glowColor}, transparent 70%)`
            ),
          }}
        />

        {/* Inner Content with 3D Depth Elevation */}
        <div style={{ transform: 'translateZ(24px)' }} className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
```

---

### 5. `RtlDrawer.tsx` (RTL Sliding Sheet with Drag-to-Dismiss & Backdrop Blur)

Opens from the right side in RTL layout, responds to drag gestures, and handles escape key and scroll locking.

```tsx
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';

interface RtlDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export const RtlDrawer: React.FC<RtlDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'w-[360px]',
}) => {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Drag gesture to dismiss (drag towards right edge in RTL: +X)
  const handleDragEnd = (_: any, info: PanInfo) => {
    // If dragged more than 100px right or swiped fast towards right (> 500px/s)
    if (info.offset.x > 100 || info.velocity.x > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div dir="rtl" className="fixed inset-0 z-50 flex justify-start">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Content Panel Docked Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.05, right: 0.7 }}
            onDragEnd={handleDragEnd}
            className={`relative ${width} max-w-[90vw] h-full bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col z-10 select-none`}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
```

---

### 6. `SwipeableCartItem.tsx` (Swipe-to-Delete Gesture in RTL)

Supports dragging leftward (`-X`) to expose a red delete action trigger, with spring resistance and clean unmount animation.

```tsx
'use client';

import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface SwipeableCartItemProps {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  onDelete: (id: string) => void;
}

export const SwipeableCartItem: React.FC<SwipeableCartItemProps> = ({
  id,
  title,
  price,
  imageUrl,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDragEnd = (_: any, info: PanInfo) => {
    // In RTL, dragging leftward is negative X
    if (info.offset.x < -90) {
      setIsDeleting(true);
      setTimeout(() => onDelete(id), 200);
    }
  };

  return (
    <motion.div
      layout
      dir="rtl"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0, overflow: 'hidden' }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="relative overflow-hidden rounded-2xl mb-3"
    >
      {/* Background Trash Action Revealed under Drag */}
      <div className="absolute inset-0 bg-rose-500 rounded-2xl flex items-center justify-start pl-6 z-0">
        <div className="flex items-center gap-1.5 text-white font-bold text-xs">
          <Trash2 className="w-4 h-4 animate-bounce" />
          <span>حذف از سبد</span>
        </div>
      </div>

      {/* Foreground Swipeable Card Surface */}
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -110, right: 0 }}
        dragElastic={{ left: 0.4, right: 0.05 }}
        onDragEnd={handleDragEnd}
        animate={isDeleting ? { x: -350, opacity: 0 } : { x: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        className="relative z-10 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-3.5 flex items-center gap-3.5 rounded-2xl shadow-xs"
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-14 h-14 rounded-xl object-contain bg-slate-50 dark:bg-zinc-800 p-1"
        />

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate">
            {title}
          </h4>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {price}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
```

---

### 7. `PersianCartBadge.tsx` (Bouncy Cart Counter with Persian Numerals)

Pops and bounces whenever the item count increments or decrements, displaying authentic Persian digits.

```tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Persian digit converter helper
function toPersianNumber(num: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

interface PersianCartBadgeProps {
  count: number;
}

export const PersianCartBadge: React.FC<PersianCartBadgeProps> = ({ count }) => {
  if (count <= 0) return null;

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={count}
        initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.4, rotate: 20, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 20,
          mass: 0.8,
        }}
        className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md shadow-emerald-500/40 border border-white dark:border-zinc-900 pointer-events-none select-none"
      >
        {toPersianNumber(count > 99 ? '+۹۹' : count)}
      </motion.span>
    </AnimatePresence>
  );
};
```

---

### 8. `PersianAccordion.tsx` (Staggered Children & Layout Expansion)

Smoothly animates height without hardcoded pixel limits using Framer Motion's FLIP engine.

```tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface PersianAccordionProps {
  items: AccordionItem[];
}

export const PersianAccordion: React.FC<PersianAccordionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div dir="rtl" className="space-y-3 w-full max-w-2xl mx-auto">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <motion.div
            key={item.id}
            layout
            className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 overflow-hidden shadow-xs"
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full p-4 flex items-center justify-between text-right cursor-pointer select-none outline-hidden"
            >
              <span className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                {item.title}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              >
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-xs leading-relaxed text-slate-600 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800/80 mt-2">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
```

---

### 9. `ScrollReadingBar.tsx` (Scroll-Driven Header Progress Indicator)

Tracks page scroll depth and renders a fluid, spring-damped progress bar at the top of the viewport.

```tsx
'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollReadingBar: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Smooth out raw scroll jumps with a fluid spring
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none">
      {/* Set origin to right in RTL so progress grows from right to left */}
      <motion.div
        style={{ scaleX }}
        className="h-full bg-gradient-to-l from-emerald-400 to-emerald-600 origin-right shadow-[0_0_8px_rgba(0,187,127,0.6)]"
      />
    </div>
  );
};
```

---

### 10. `FloatingLabelInput.tsx` (Floating Label, Glow Ring & Clear Button)

Micro-interaction form control with animated Persian floating label and smooth clear button entrance.

```tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';

interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div dir="rtl" className="relative w-full">
      <div
        className={`relative h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border transition-all duration-200 flex items-center px-4 ${
          isFocused
            ? 'border-emerald-500 ring-3 ring-emerald-500/15 bg-white dark:bg-zinc-900 shadow-sm'
            : 'border-slate-200/80 dark:border-zinc-700/80'
        }`}
      >
        <Search
          className={`w-5 h-5 ml-2.5 transition-colors ${
            isFocused ? 'text-emerald-500' : 'text-slate-400'
          }`}
        />

        <div className="relative flex-1 h-full flex items-center">
          {/* Animated Floating Label */}
          <motion.label
            animate={{
              y: isFloating ? -12 : 0,
              fontSize: isFloating ? '10px' : '13px',
              color: isFocused ? '#00bb7f' : '#94a3b8',
            }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="absolute right-0 font-medium pointer-events-none select-none origin-top-right"
          >
            {label}
          </motion.label>

          <input
            type={type}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full pt-4 bg-transparent outline-hidden text-xs font-semibold text-slate-800 dark:text-zinc-100 placeholder-transparent"
          />
        </div>

        {/* Clear Button Micro-interaction */}
        <AnimatePresence>
          {hasValue && (
            <motion.button
              type="button"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => onChange('')}
              className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
```

---

### 11. `PersianDigitCounter.tsx` (Animated Number Count-Up with Toman Currency)

Transitions numerals smoothly on updates with digit rolling animation, formatted in Persian.

```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

function toPersianDigits(num: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    .replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

interface PersianDigitCounterProps {
  value: number;
  currency?: string;
}

export const PersianDigitCounter: React.FC<PersianDigitCounterProps> = ({
  value,
  currency = 'تومان',
}) => {
  const spring = useSpring(0, { stiffness: 90, damping: 20 });
  const [displayValue, setDisplayValue] = useState(toPersianDigits(0));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(toPersianDigits(Math.round(latest)));
    });
    return () => unsubscribe();
  }, [spring]);

  return (
    <div dir="rtl" className="inline-flex items-baseline gap-1.5 select-none">
      <motion.span
        key={value}
        initial={{ y: -6, opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="text-lg font-black tracking-tight text-slate-900 dark:text-zinc-100"
      >
        {displayValue}
      </motion.span>
      {currency && (
        <span className="text-xs font-medium text-slate-400 dark:text-zinc-500">
          {currency}
        </span>
      )}
    </div>
  );
};
```

---

### 12. `TailwindV4Shimmer.tsx` (Tailwind CSS v4 Hardware-Accelerated Shimmer)

Pure CSS compositor skeleton with liquid glass sheen for catalog cards.

```tsx
import React from 'react';

export const TailwindV4Shimmer: React.FC = () => {
  return (
    <div
      dir="rtl"
      className="w-full rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 p-4 space-y-3.5 overflow-hidden"
    >
      {/* Product Image Box Skeleton with Shimmer Sheen */}
      <div className="relative aspect-square w-full rounded-2xl bg-slate-100 dark:bg-zinc-800 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite_linear] bg-gradient-to-r from-transparent via-white/40 dark:via-zinc-700/40 to-transparent" />
      </div>

      {/* Category Pill Skeleton */}
      <div className="relative h-4 w-20 rounded-md bg-slate-100 dark:bg-zinc-800 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite_linear] bg-gradient-to-r from-transparent via-white/40 dark:via-zinc-700/40 to-transparent" />
      </div>

      {/* Title Skeleton */}
      <div className="relative h-5 w-3/4 rounded-lg bg-slate-100 dark:bg-zinc-800 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite_linear] bg-gradient-to-r from-transparent via-white/40 dark:via-zinc-700/40 to-transparent" />
      </div>

      {/* Price & Add Button Row */}
      <div className="flex items-center justify-between pt-2">
        <div className="relative h-6 w-24 rounded-lg bg-slate-100 dark:bg-zinc-800 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite_linear] bg-gradient-to-r from-transparent via-white/40 dark:via-zinc-700/40 to-transparent" />
        </div>
        <div className="relative h-9 w-9 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite_linear] bg-gradient-to-r from-transparent via-white/40 dark:via-zinc-700/40 to-transparent" />
        </div>
      </div>
    </div>
  );
};
```

---

### 13. `CssStartingStyleModal.tsx` (CSS-Native Entry & Exit with `@starting-style`)

Demonstrates modern standard CSS entry and exit transitions for HTML dialogs without needing external animation libraries.

```tsx
'use client';

import React, { useRef } from 'react';
import { X } from 'lucide-react';

interface NativeDialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const NativeDialogModal: React.FC<NativeDialogModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      dir="rtl"
      className="m-auto rounded-3xl p-0 bg-transparent backdrop:bg-black/40 backdrop:backdrop-blur-xs transition-all duration-300 open:opacity-100 open:scale-100 opacity-0 scale-95 [transition-behavior:allow-discrete] starting:open:opacity-0 starting:open:scale-95 outline-hidden"
    >
      <div className="w-[90vw] max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-4 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
          {children}
        </div>
      </div>
    </dialog>
  );
};
```

---

## Anti-Patterns & Troubleshooting Checklist

| Anti-Pattern | Why It Breaks | Fix |
|---|---|---|
| Animating `width` / `height` directly in `animate={{ width: 200 }}` | Triggers browser reflow / layout thrashing on every frame (15fps lag) | Use `layout` prop with FLIP or animate `scaleX` / `scaleY` |
| Missing `key` prop on direct children of `AnimatePresence` | Framer Motion cannot track which element is unmounting; exit animations fail | Always provide a unique `key` (e.g. `key={item.id}`) |
| Hardcoding `x: 300` in RTL layouts | Element slides from wrong direction; breaks Persian spatial metaphor | Use direction-aware offsets (`isRtl ? -300 : 300` or `100%`) |
| Wrapping non-interactive SVG icons in heavy motion divs | Unnecessary DOM wrapper creation and layer allocation | Animate the `<motion.svg>` or `<motion.path>` directly |
| Infinite unconstrained drag gestures | Elements get lost offscreen | Always specify `dragConstraints` and `dragElastic` |
| Ignoring `prefers-reduced-motion` | Causes nausea and disorientation for sensitive users | Wrap spring transitions in `useReducedMotion()` checks |
| Placing Framer Motion hooks in Server Components | Next.js build error: hooks cannot run in RSC | Add `'use client'` at the top of the component file |
