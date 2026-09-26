'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const suggestions = ['روغن زیتون', 'شیر کاله', 'شامپو نیوآ', 'چای لاهیجان'];

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md hidden md:block">
      <div
        className={`relative flex items-center transition-all duration-300 ${
          isFocused ? 'ring-2 ring-emerald-500/30' : ''
        } rounded-2xl`}
      >
        {/* Search icon */}
        <button
          type="submit"
          className={`absolute start-3.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${
            isFocused ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
          }`}
          aria-label="جستجو"
        >
          <motion.div
            animate={isFocused ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Search className="w-4 h-4" />
          </motion.div>
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="جستجو در کالاهای مون مارکت..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-full bg-slate-100/90 dark:bg-zinc-800/90 border border-slate-200/80 dark:border-zinc-700/80 focus:border-emerald-500/70 dark:focus:border-emerald-600/70 rounded-2xl py-2.5 ps-10 pe-9 text-xs sm:text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none transition-all backdrop-blur-sm"
        />

        <AnimatePresence>
          {query && (
            <motion.button
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-0.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              aria-label="پاک کردن متن"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Quick suggestions on focus */}
      <AnimatePresence>
        {isFocused && !query && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 inset-x-0 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl shadow-xl shadow-slate-900/[0.08] dark:shadow-black/40 p-3 z-50"
          >
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">جستجوهای پیشنهادی</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setQuery(s); inputRef.current?.focus(); }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs text-slate-700 dark:text-zinc-300 font-medium hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default SearchBar;
