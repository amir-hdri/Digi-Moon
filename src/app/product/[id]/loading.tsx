import React from 'react';

export default function ProductLoading() {
  return (
    <div className="min-h-screen pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-8 animate-pulse">
      {/* Top Header skeleton */}
      <div className="h-16 rounded-2xl bg-slate-200/80 dark:bg-zinc-800/80" />

      {/* Main Product Showcase Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Product Image Stage */}
        <div className="md:col-span-6 h-96 rounded-3xl bg-slate-200/70 dark:bg-zinc-800/70" />

        {/* Product Details & Purchase Controls */}
        <div className="md:col-span-6 space-y-5">
          <div className="h-8 w-3/4 rounded-xl bg-slate-200/80 dark:bg-zinc-800/80" />
          <div className="h-5 w-1/3 rounded-lg bg-slate-200/60 dark:bg-zinc-800/60" />
          <div className="h-24 rounded-2xl bg-slate-200/50 dark:bg-zinc-800/50" />
          <div className="h-14 rounded-2xl bg-slate-200/80 dark:bg-zinc-800/80" />
        </div>
      </div>
    </div>
  );
}
