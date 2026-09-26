import React from 'react';

export default function HomeLoading() {
  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-16 rounded-2xl bg-slate-200/80 dark:bg-zinc-800/80" />

      {/* SearchBar Skeleton */}
      <div className="h-12 rounded-2xl bg-slate-200/60 dark:bg-zinc-800/60 max-w-2xl mx-auto" />

      {/* Hero Banner Skeleton */}
      <div className="h-96 rounded-3xl bg-slate-200/70 dark:bg-zinc-800/70" />

      {/* Categories Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 rounded-lg bg-slate-200/80 dark:bg-zinc-800/80" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-200/60 dark:bg-zinc-800/60" />
          ))}
        </div>
      </div>

      {/* Festival Section Skeleton */}
      <div className="h-80 rounded-3xl bg-slate-200/70 dark:bg-zinc-800/70" />

      {/* Product Catalog Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-40 rounded-lg bg-slate-200/80 dark:bg-zinc-800/80" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 rounded-3xl bg-slate-200/60 dark:bg-zinc-800/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
