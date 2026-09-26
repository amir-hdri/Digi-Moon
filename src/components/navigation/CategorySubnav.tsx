'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { MegaMenu } from './MegaMenu';
import {
  Menu,
  ChevronDown,
  Flame,
  ShoppingBag,
  Sparkles,
  Store,
  Zap,
  Coffee,
  Droplets,
} from 'lucide-react';

export interface CategorySubnavProps {
  onOpenDrawer?: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const CategorySubnav: React.FC<CategorySubnavProps> = ({
  onOpenDrawer,
  onSelectCategory,
}) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsMegaMenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      timeoutRef.current = setTimeout(() => {
        setIsMegaMenuOpen(false);
      }, 250);
    }
  };

  return (
    <div className="relative w-full border-t border-slate-200/70 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-10 sm:h-12 flex items-center justify-between gap-2 sm:gap-3 text-xs relative">
        {/* Right Section: Category Trigger (Fixed, NEVER in overflow) + Quick Links (Scrollable) */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
          {/* Main Category Trigger Button - Free from overflow clipping */}
          <div
            className="relative shrink-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 768 && onOpenDrawer) {
                  onOpenDrawer();
                } else {
                  setIsMegaMenuOpen((prev) => !prev);
                }
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-black transition-all cursor-pointer select-none text-[11px] sm:text-sm ${
                isMegaMenuOpen
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/25'
              }`}
              aria-expanded={isMegaMenuOpen}
              aria-haspopup="true"
            >
              <Menu className="w-4 h-4" />
              <span>دسته‌بندی کالاها</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isMegaMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Desktop Mega Menu Dropdown */}
            <div className="hidden md:block">
              <MegaMenu
                isOpen={isMegaMenuOpen}
                onClose={() => setIsMegaMenuOpen(false)}
                onSelectCategory={(id) => {
                  onSelectCategory?.(id);
                  setIsMegaMenuOpen(false);
                }}
              />
            </div>
          </div>

          <span className="w-px h-5 bg-slate-200 dark:bg-zinc-800 shrink-0 hidden sm:block" />

          {/* Quick Department Links - Scrollable horizontally without clipping MegaMenu */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1 flex-1 min-w-0">
            <Link
              href="/#festival-deals"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 font-bold transition-colors whitespace-nowrap group text-xs shrink-0"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
              <span>شگفتانه‌ها و تخفیف‌ها</span>
            </Link>

            <Link
              href="/category/groceries"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-colors whitespace-nowrap text-xs shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
              <span>کالاهای اساسی</span>
            </Link>

            <Link
              href="/category/dairy"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 font-bold transition-colors whitespace-nowrap text-xs shrink-0"
            >
              <Coffee className="w-3.5 h-3.5 text-sky-500" />
              <span>لبنیات تازه</span>
            </Link>

            <Link
              href="/category/beauty-hygiene"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 font-bold transition-colors whitespace-nowrap text-xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>آرایشی و بهداشتی</span>
              <span className="text-[8px] px-1 py-0.5 rounded bg-pink-500/15 text-pink-600 dark:text-pink-400 font-bold leading-none">
                ویژه
              </span>
            </Link>

            <Link
              href="/category/cleaning"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400 font-bold transition-colors whitespace-nowrap text-xs shrink-0"
            >
              <Droplets className="w-3.5 h-3.5 text-teal-500" />
              <span>شوینده و نظافت</span>
            </Link>

            <Link
              href="/branches"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors whitespace-nowrap text-xs shrink-0"
            >
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <span>شعبات مون مارکت</span>
            </Link>
          </div>
        </div>

        {/* Left Section: Express Delivery Badge */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 text-xs text-slate-600 dark:text-zinc-400 font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="font-bold">ارسال اکسپرس سوپرمارکت تا ۴۵ دقیقه</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySubnav;
