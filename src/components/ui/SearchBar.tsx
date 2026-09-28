'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, History, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { filterCatalog } from '@/lib/catalog';
import { formatToman } from '@/lib/persian';

const RECENT_KEY = 'mm_recent_searches';
const MAX_RECENT = 6;
const DEBOUNCE_MS = 200;

const POPULAR = ['روغن زیتون', 'شیر کاله', 'شامپو نیوآ', 'چای لاهیجان'];

function readRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string').slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const uid = useId();
  const listId = `search-suggest-${uid}`;
  const open = isFocused && (query.trim().length > 0 || recent.length > 0);

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(query.trim());
      setActiveIndex(-1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  const isTyping = query.trim() !== debounced;

  const results = useMemo(() => {
    if (!debounced) return [];
    return filterCatalog({ query: debounced }).slice(0, 5);
  }, [debounced]);

  const persistRecent = (term: string) => {
    const t = term.trim();
    if (!t) return;
    setRecent((prev) => {
      const next = [t, ...prev.filter((x) => x !== t)].slice(0, MAX_RECENT);
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // private mode — recents just won't persist
      }
      return next;
    });
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      window.localStorage.removeItem(RECENT_KEY);
    } catch {
      // ignore
    }
  };

  const submitTerm = (term: string) => {
    const t = term.trim();
    if (!t) return;
    persistRecent(t);
    setIsFocused(false);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(t)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      const p = results[activeIndex];
      persistRecent(p.title);
      setIsFocused(false);
      router.push(`/product/${p.slug}`);
      return;
    }
    submitTerm(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && results.length > 0) {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp' && results.length > 0) {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const showEmpty = debounced.length > 0 && !isTyping && results.length === 0;

  return (
    <form onSubmit={handleSearch} role="search" className="relative w-full max-w-md">
      <label htmlFor={`site-search-${uid}`} className="sr-only">جستجو در کالاهای مون مارکت</label>
      <div
        className={`relative flex items-center transition-colors duration-300 ${
          isFocused ? 'ring-2 ring-emerald-500/30' : ''
        } rounded-2xl`}
      >
        <button
          type="submit"
          className="absolute start-1.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            isFocused ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
          }"
          aria-label="جستجو"
        >
          <motion.div
            animate={isFocused ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Search className="w-4 h-4" aria-hidden="true" />
          </motion.div>
        </button>

        <input
          ref={inputRef}
          id={`site-search-${uid}`}
          name="q"
          type="search"
          autoComplete="off"
          inputMode="search"
          spellCheck={false}
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `search-opt-${uid}-${activeIndex}` : undefined}
          placeholder="جستجو در کالاهای مون مارکت…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-full bg-slate-100/90 dark:bg-zinc-800/90 border border-slate-200/80 dark:border-zinc-700/80 focus:border-emerald-500/70 dark:focus:border-emerald-600/70 rounded-2xl py-3 ps-12 pe-12 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none transition-colors backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-emerald-500/30"
        />

        <AnimatePresence>
          {query && (
            <motion.button
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              onClick={() => { setQuery(''); setDebounced(''); inputRef.current?.focus(); }}
              className="absolute end-1.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-zinc-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="پاک کردن متن جستجو"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            id={listId}
            role="listbox"
            aria-label="پیشنهادهای جستجو"
            className="absolute top-full mt-2 inset-x-0 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl shadow-xl shadow-slate-900/[0.08] dark:shadow-black/40 p-3 z-50 max-h-[60vh] overflow-y-auto"
          >
            {query.trim().length === 0 ? (
              <>
                {recent.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between px-1 mb-1.5">
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                        <History className="w-3.5 h-3.5" aria-hidden="true" />
                        جستجوهای اخیر
                      </span>
                      <button
                        type="button"
                        onClick={clearRecent}
                        className="min-h-[44px] px-2 flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-lg"
                        aria-label="پاک کردن جستجوهای اخیر"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        پاک کردن
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recent.map((s) => (
                        <button
                          key={s}
                          type="button"
                          role="option"
                          aria-selected="false"
                          onClick={() => submitTerm(s)}
                          className="px-3 min-h-[44px] rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs text-slate-700 dark:text-zinc-300 font-medium hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">جستجوهای پرتکرار</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="option"
                      aria-selected="false"
                      onClick={() => submitTerm(s)}
                      className="px-3 min-h-[44px] rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs text-slate-700 dark:text-zinc-300 font-medium hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            ) : isTyping ? (
              <p role="status" className="flex items-center gap-2 px-2 py-3 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                در حال جستجو…
              </p>
            ) : showEmpty ? (
              <div className="px-2 py-4 text-center">
                <p role="status" className="text-xs text-slate-500 dark:text-zinc-400">
                  کالایی برای «{debounced}» پیدا نشد.
                </p>
                <button
                  type="button"
                  onClick={() => submitTerm(debounced)}
                  className="mt-2 min-h-[44px] px-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
                >
                  جستجوی کامل در فروشگاه
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="px-2 pb-1 text-[11px] font-semibold text-slate-500 dark:text-zinc-400">محصولات پیشنهادی</p>
                {results.map((p, i) => (
                  <button
                    key={p.id}
                    id={`search-opt-${uid}-${i}`}
                    type="button"
                    role="option"
                    aria-selected={i === activeIndex}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => {
                      persistRecent(p.title);
                      setIsFocused(false);
                      router.push(`/product/${p.slug}`);
                    }}
                    className={`w-full min-h-[44px] flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-right transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      i === activeIndex ? 'bg-emerald-500/10' : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 truncate">{p.title}</span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0">
                      {formatToman(p.price, false)}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => submitTerm(query)}
                  className="w-full min-h-[44px] px-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
                >
                  نمایش همه نتایج «{debounced}»
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default SearchBar;
