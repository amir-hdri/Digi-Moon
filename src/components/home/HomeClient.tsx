'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNavbar } from '@/components/layout/BottomNavbar';
import { SearchBar } from '@/components/catalog/SearchBar';
import { LoginModal } from '@/components/auth/LoginModal';
import { AddressModal } from '@/components/address/AddressModal';
import { AnimatedSplashScreen } from '@/components/ui/AnimatedSplashScreen';
import { HomeHero } from '@/components/home/sections/HomeHero';
import { BenefitsStrip } from '@/components/home/sections/BenefitsStrip';
import { BrandChips } from '@/components/home/sections/BrandChips';
import { CategoryGrid } from '@/components/home/sections/CategoryGrid';
import { ShopByNeed } from '@/components/home/sections/ShopByNeed';
import { FestivalDeals } from '@/components/home/sections/FestivalDeals';
import { CatalogSection } from '@/components/home/sections/CatalogSection';
import { TrustStats } from '@/components/home/sections/TrustStats';
import { Testimonials } from '@/components/home/sections/Testimonials';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { filterCatalog, type SortKey } from '@/lib/catalog';
import type { Address, Product } from '@/types';

const SPLASH_KEY = 'mm_splash_shown';

export function HomeClient({ footer }: { footer: React.ReactNode }) {
  // ---- Filter state -------------------------------------------------------
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('popular');

  // ---- Modal state --------------------------------------------------------
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  // ---- Splash -------------------------------------------------------------
  const [showSplash, setShowSplash] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SPLASH_KEY) !== null;
      if (!seen) window.sessionStorage.setItem(SPLASH_KEY, 'true');
    } catch {
      // sessionStorage blocked (private mode / strict cookie settings). Skipping the
      // splash is better than replaying a 3.6 s animation on every navigation.
      seen = true;
    }
    setShowSplash(!seen);
  }, []);

  const addItem = useCartStore((state) => state.addItem);
  const setActiveAddress = useAuthStore((state) => state.setActiveAddress);

  const handleAddToCart = useCallback((product: Product) => addItem(product, 1), [addItem]);

  const products = useMemo(
    () => filterCatalog({ query, categoryId, brand, sort }),
    [query, categoryId, brand, sort]
  );

  const clearAll = useCallback(() => {
    setQuery('');
    setCategoryId(null);
    setBrand(null);
  }, []);

  // A header/drawer category pick should also drive the inline grid highlight.
  const handleSelectCategory = useCallback((id: string | null) => {
    setCategoryId(id);
  }, []);

  return (
    <main className="min-h-screen pb-24 md:pb-12 transition-colors duration-300">
      {showSplash ? (
        <AnimatedSplashScreen onComplete={() => setShowSplash(false)} durationMs={3600} />
      ) : null}

      <a href="#catalog" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:z-50 px-4 py-2 min-h-[44px] inline-flex items-center rounded-xl bg-emerald-600 text-white text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
        رفتن به لیست کالاها
      </a>

      <Header
        onAddressClick={() => setIsAddressOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-10">
        {/* Inline catalog filter — desktop only; mobile uses the header search row */}
        <div className="hidden md:block">
          <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />
        </div>

        <HomeHero />

        <BenefitsStrip />

        <BrandChips selectedBrand={brand} onSelect={setBrand} />

        <CategoryGrid selectedCategory={categoryId} onSelect={setCategoryId} />

        <ShopByNeed />

        <FestivalDeals onAddToCart={handleAddToCart} />

        <div id="catalog" tabIndex={-1} className="scroll-mt-24 focus-visible:outline-none">
          <CatalogSection
            products={products}
            query={query}
            categoryId={categoryId}
            brand={brand}
            sort={sort}
            onSort={setSort}
            onClearAll={clearAll}
            onClearBrand={() => setBrand(null)}
            onClearCategory={() => setCategoryId(null)}
            onAddToCart={handleAddToCart}
          />
        </div>

        <TrustStats />

        <Testimonials />
      </div>

      {footer}

      <BottomNavbar activeTab="home" />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => setIsLoginOpen(false)}
      />

      <AddressModal
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        onSelectAddress={(addr: Address) => {
          setActiveAddress(addr);
          setIsAddressOpen(false);
        }}
      />
    </main>
  );
}

export default HomeClient;
