'use client';

import { Layers, X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/home/Section';
import { toPersianDigits } from '@/lib/persian';
import { getBrandFacets, type BrandFacet } from '@/lib/catalog';

/**
 * Brand quick-filter chips.
 *
 * The previous list was seven hardcoded objects whose filter was
 * `product.title.toLowerCase().includes(brandId)` — a Latin key matched against a Persian
 * title, so six of the seven chips returned an empty grid, and the seventh
 * (`{ id: 'lahijan' }`) had no `name` field and rendered an empty button.
 *
 * The facets are now derived from the catalog itself (`getBrandFacets()`), so every chip
 * is guaranteed to match at least `count` products and the count is shown on the chip.
 */
export function BrandChips({
  selectedBrand,
  onSelect,
}: {
  selectedBrand: string | null;
  onSelect: (brand: string | null) => void;
}) {
  const reduceMotion = useReducedMotion();
  const brands: BrandFacet[] = getBrandFacets();

  if (brands.length === 0) return null;

  return (
    <Section labelledBy="brands-heading" className="space-y-3">
      <SectionHeading
        id="brands-heading"
        icon={<Layers className="w-4 h-4" />}
        title="برندهای معتبر مواد غذایی و بهداشتی"
        subtitle={`${toPersianDigits(brands.length)} برند فعال در کاتالوگ`}
        action={
          selectedBrand ? (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              حذف فیلتر برند
            </button>
          ) : null
        }
      />
      <div
        role="group"
        aria-label="فیلتر برند"
        className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
      >
        {brands.map((brand) => {
          const isActive = selectedBrand === brand.id;
          return (
            <motion.button
              key={brand.id}
              type="button"
              aria-pressed={isActive}
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              whileTap={reduceMotion ? undefined : { scale: 0.95 }}
              onClick={() => onSelect(isActive ? null : brand.id)}
              className={`px-4 py-2 min-h-[44px] rounded-xl text-xs font-bold transition-colors shrink-0 border ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25'
                  : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-800 hover:border-emerald-300'
              }`}
            >
              {brand.label}
              <span
                className={`ms-1.5 text-[10px] font-medium ${
                  isActive ? 'text-emerald-100' : 'text-slate-400 dark:text-zinc-500'
                }`}
              >
                {toPersianDigits(brand.count)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </Section>
  );
}
