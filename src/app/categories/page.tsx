import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { CategoryHeader, BottomNavbar } from '@/components';
import { CategoryIcon } from '@/components/navigation/category-icons';
import { countProductsForNode, topLevelCategories } from '@/lib/catalog';
import { toPersianDigits } from '@/lib/persian';

export const metadata = {
  title: 'دسته‌بندی کالاها',
  description:
    'فهرست کامل دسته‌بندی‌های سوپرمارکت مون مارکت؛ از مواد غذایی و لبنیات تا بهداشت و شوینده، همراه با زیر‌دسته‌های هر بخش.',
};

/**
 * Directory of every top-level category and its subcategories.
 *
 * The bottom nav's «دسته‌ها» tab used to deep-link straight to one arbitrary
 * category (`/category/groceries`), which read as "the button does nothing
 * useful". This page gives that tab a real destination: one card per category,
 * with the subcategory chips underneath, all server-rendered for SEO.
 */
export default function CategoriesPage() {
  return (
    <main className="min-h-screen pb-24 md:pb-12 transition-colors duration-300">
      <CategoryHeader title="دسته‌بندی کالاها" backHref="/" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          همهٔ دسته‌های مون مارکت را اینجا ببینید؛ روی هر دسته بزنید تا کالاهایش را بخرید، یا
          مستقیم سراغ زیر‌دسته مورد نظرتان بروید.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topLevelCategories.map((node) => {
            const count = countProductsForNode(node);
            return (
              <section
                key={node.id}
                className="rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800 p-4 space-y-3 shadow-sm"
              >
                <Link
                  href={`/category/${node.slug}`}
                  className="flex items-center gap-3 min-h-[44px] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <span
                    className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  >
                    <CategoryIcon iconName={node.icon} className="w-6 h-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="font-black text-sm text-slate-800 dark:text-zinc-100 truncate">
                        {node.title}
                      </span>
                      {node.badge ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold leading-none border border-emerald-500/20 shrink-0">
                          {node.badge}
                        </span>
                      ) : null}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      {toPersianDigits(count)} کالا
                    </span>
                  </span>
                  <ChevronLeft className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" aria-hidden="true" />
                </Link>

                <div className="flex flex-wrap gap-2">
                  {(node.children ?? []).map((child) => (
                    <Link
                      key={child.id}
                      href={`/category/${child.slug}`}
                      className="px-3.5 py-2 min-h-[44px] inline-flex items-center rounded-xl bg-slate-50 dark:bg-zinc-800/70 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <BottomNavbar activeTab="categories" />
    </main>
  );
}
