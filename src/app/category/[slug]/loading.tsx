import React from 'react';

export default function CategoryLoading() {
  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-8 animate-pulse">
      {/* Category Header */}
      <div className="h-16 rounded-2xl bg-slate-200/80 dark:bg-zinc-800/80" />

      {/* Category Banner Skeleton */}
      <div className="h-44 rounded-3xl bg-slate-200/70 dark:bg-zinc-800/70" />

      {/* Subcategory Pills */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-28 rounded-xl bg-slate-200/60 dark:bg-zinc-800/60 shrink-0" />
        ))}
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-80 rounded-3xl bg-slate-200/60 dark:bg-zinc-800/60" />
        ))}
      </div>
    </div>
  );
}
