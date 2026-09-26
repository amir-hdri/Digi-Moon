'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * One primitive for every home-page section.
 *
 * The previous `HomeClient` repeated this exact `motion.section` prop block eight times
 * (~40 lines of duplication) with three different `margin` values for the same purpose.
 * Extracting it also gives every section identical entrance behaviour and a single place
 * to add a real `<h2>` + `aria-labelledby` wiring.
 */
export function Section({
  children,
  className = '',
  id,
  labelledBy,
  as: Tag = 'section',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
  as?: 'section' | 'div' | 'aside';
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      role={Tag === 'section' && labelledBy ? 'region' : undefined}
      aria-labelledby={labelledBy}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Consistent heading block: icon chip + title + supporting line. */
export function SectionHeading({
  icon,
  title,
  subtitle,
  accent = 'emerald',
  action,
  id,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accent?: 'emerald' | 'amber';
  action?: React.ReactNode;
  /** Wired to the `<h2>` so `Section labelledBy` can point at the real heading. */
  id?: string;
}) {
  const chip =
    accent === 'amber'
      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-xl ${chip} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <h2
            id={id}
            className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-zinc-100"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}
