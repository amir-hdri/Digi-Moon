'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/home/Section';
import { CategoryIcon } from '@/components/navigation/category-icons';
import { toPersianDigits } from '@/lib/persian';
import { countProductsForNode, topLevelCategories, type CategoryNode } from '@/lib/catalog';

function CategoryCard({
  node,
  count,
  isSelected,
  onToggle,
  index,
}: {
  node: CategoryNode;
  count: number;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4, ease: 'easeOut' }}
      className="min-w-0"
    >
      {/*
        The tile does two jobs: tapping the *icon* toggles the inline filter, tapping the
        *rest* navigates to the full category page. That is more discoverable than making
        the whole tile a filter that never leads anywhere, and the two targets are
        separately labelled for screen readers.
      */}
      <div
        className={`group relative rounded-2xl border transition-colors duration-200 min-h-[132px] sm:min-h-[150px] flex flex-col items-center justify-between gap-2 p-2.5 sm:p-3.5 ${
          isSelected
            ? 'bg-emerald-500/15 dark:bg-emerald-950/60 border-emerald-500 shadow-lg ring-2 ring-emerald-500/30'
            : 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200/80 dark:border-zinc-800 hover:border-emerald-400/60 dark:hover:border-emerald-500/40 hover:shadow-md'
        }`}
      >
        {node.badge ? (
          <span className="text-[9px] sm:text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold leading-none border border-emerald-500/20">
            {node.badge}
          </span>
        ) : (
          <span className="h-3.5 sm:h-4" />
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-pressed={isSelected}
          aria-label={`فیلتر ${node.title} در همین صفحه`}
          className={`min-w-[44px] min-h-[44px] w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            isSelected
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105'
              : 'bg-slate-100/90 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 group-hover:scale-105'
          }`}
        >
          <CategoryIcon iconName={node.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <Link
          href={`/category/${node.slug}`}
          className="w-full flex-1 flex flex-col justify-end items-center gap-0.5 min-h-[44px] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 leading-tight text-center line-clamp-2">
            {node.title}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
            {toPersianDigits(count)} کالا
          </span>
        </Link>
      </div>
    </motion.div>
  );
}

export function CategoryGrid({
  selectedCategory,
  onSelect,
}: {
  selectedCategory: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <Section labelledBy="categories-heading" className="space-y-3.5">
      <SectionHeading
        id="categories-heading"
        icon={<Zap className="w-4 h-4" />}
        title="دسته‌بندی‌های سوپرمارکت مون مارکت"
        subtitle="برای دیدن همهٔ کالاهای یک دسته، روی نام آن بزنید"
        action={
          selectedCategory ? (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="min-h-[44px] px-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
            >
              نمایش همه کالاها
            </button>
          ) : null
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
        {topLevelCategories.map((node, index) => (
          <CategoryCard
            key={node.id}
            node={node}
            index={index}
            count={countProductsForNode(node)}
            isSelected={selectedCategory === node.id}
            onToggle={() => onSelect(selectedCategory === node.id ? null : node.id)}
          />
        ))}
      </div>
    </Section>
  );
}
