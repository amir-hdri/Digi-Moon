# Project: Dijimoon Next.js 15 E-Commerce Storefront

## Architecture
- **Framework**: Next.js 15+ (App Router with Turbopack & React 19)
- **Styling**: Tailwind CSS v4 (@tailwindcss/postcss) with CSS-first `@theme` and `@custom-variant dark/rtl`
- **Typography & Localization**: Persian native (`dir="rtl"`, `lang="fa"`) using self-hosted Vazirmatn woff2 (arabic + latin subsets × weights 400–900 vendored in `public/fonts/vazirmatn`, `font-display: swap`, arabic 400/700/900 preloaded via `<link rel="preload">` in `layout.tsx`; migrated from `@fontsource/vazirmatn` in M7 for stable preloadable URLs) and `IRANSans` fallbacks with OpenType ligatures (`rlig 1, calt 1`)
- **Theme**: Dual-palette system — Slate palette for Light Mode vs Zinc palette for Dark Mode, with inline anti-FOUC script
- **Adaptive Dialogs**: UniversalModal system at 580px breakpoint (mobile `<580px` drag-to-dismiss bottom sheet with spring physics; desktop `>=580px` centered dialog)
- **State Management**: Zustand 5 with localStorage persistence (`useCartStore`, `useThemeStore`, `useAuthStore`, `useToastStore`, `useMessageStore`, `useNotificationStore`, `useOrderStore`; persisted stores rehydrate post-mount via `StoreHydration` to avoid SSR mismatches)
- **Data Layer**: Robust mock data service (`src/data/mock-data.ts`, `src/data/engagement.ts`) with typed API client (`src/lib/api.ts`) designed for seamless failover when live `api.dijimoon.ir` is unreachable over VPN
- **Backend (Route Handlers)**: Next.js App Router API routes under `src/app/api/` (`notifications`, `notifications/read`, `threads`, `messages`, `orders`, `newsletter`, `branches`) backed by the engagement DAL (`src/lib/engagement.ts`) with input validation and Persian error messages
- **Rendering**: Server Components by default; category page is a Server Component; client boundaries pushed to interactive leaves; `next/image` with `sizes`/`priority` (catalog images lazy by default); `MotionConfig reducedMotion="user"` globally; off-screen ambient loops paused via `usePauseAnimationsOffscreen`; splash exits early on critical-fonts readiness; search URL commits in `useTransition`; `experimental.optimizePackageImports` trims barrel parse cost

## Feature Inventory
Every feature identified during the Survey phase is enumerated here and assigned to a specific milestone.

| # | Feature | Description | Milestone | Source |
|---|---|---|---|---|
| 1 | Brand Core Emerald Color Palette | #00bb7f primary brand color tokens (50-800) | M1 | survey_spec_miner_1 |
| 2 | Secondary Brand Green & Teal Palettes | Green-500 (#00c758) and Teal-500 (#00baa7) for accents & gradients | M1 | survey_spec_miner_1 |
| 3 | Floating Cart Badge Accent | High-visibility Orange (#fe6e00) with `@keyframes floating` | M1 | survey_spec_miner_1 |
| 4 | Deal & Festival Color Badges | Amber (#f99c00) and Red (#fb2c36) for badges and alerts | M1 | survey_spec_miner_1 |
| 5 | Slate Neutral Palette (Light Mode) | Slate-50 through Slate-900 for light theme surfaces | M1 | survey_spec_miner_1 |
| 6 | Zinc Neutral Palette (Dark Mode) | Zinc-100 through Zinc-950 for dark theme surfaces | M1 | survey_spec_miner_1 |
| 7 | Glassmorphism Specifications | `backdrop-filter: blur(12px)` with 85% opacity and subtle borders | M1 | survey_spec_miner_1 |
| 8 | Floating Animation Keyframes | 2s periodic vertical translation (0px -> -4px -> 0px) | M1 | survey_spec_miner_1 |
| 9 | Persian Typography & RTL Ligatures | OpenType ligatures `rlig 1, calt 1`, `dir="rtl"`, `lang="fa"` | M1 | survey_spec_miner_1 |
| 10 | 4px Grid Spacing System | Spacing quantized to 0.25rem (4px) multiples | M1 | survey_spec_miner_1 |
| 11 | Domain Types & Schemas | Product, Category, CartItem, Address, Order, UserProfile | M1 | survey_spec_miner_1 |
| 12 | Persian Formatting Utilities | toPersianDigits, toEnglishDigits, formatToman, calculateDiscount, parsePriceToman, slugifyPersian | M1 | survey_spec_miner_1 |
| 13 | Mock Data & API Failover Layer | Realistic Persian catalog mock dataset with failover for `api.dijimoon.ir` | M1 | survey_spec_miner_1 |
| 14 | Root Next.js 15 & Tailwind v4 Config | App Router root layout, globals.css, postcss.config.mjs, tsconfig.json | M1 | survey_explorer_2 |
| 15 | UniversalModal Adaptive Dialog | 580px breakpoint: mobile bottom sheet with drag-to-dismiss vs desktop centered modal | M2 | survey_spec_miner_1 |
| 16 | LoginModal (SSO / OTP Flow) | 11-digit Iranian mobile regex `^09\d{9}$`, 120s timer, 5-digit OTP verification | M2 | survey_spec_miner_1 |
| 17 | AddressModal Drawer | Delivery address management, default badge, and selection | M2 | survey_spec_miner_1 |
| 18 | Cart State Store (Zustand 5) | Cart items, add/remove/quantity, subtotal, discount, total in Tomans | M2 | survey_explorer_2 |
| 19 | Theme State Store (Zustand 5) | Slate (light) vs Zinc (dark) toggle, system sync, anti-FOUC | M2 | survey_explorer_2 |
| 20 | Auth State Store (Zustand 5) | OTP login state, user session, address book, active address | M2 | survey_explorer_2 |
| 21 | Sticky Glassmorphic Header | Header with gradient logo, gradient brand title, cart button with badge | M3 | survey_spec_miner_1 |
| 22 | SearchBar Component | Glassmorphism search input with magnifying glass and emerald focus ring | M3 | survey_spec_miner_1 |
| 23 | ProductCard Component | Product card with discount badge, special badge, Toman price, add CTA | M3 | survey_spec_miner_1 |
| 24 | ProductSkeleton Loader | Zero CLS skeleton loader identical in dimensions to ProductCard | M3 | survey_spec_miner_1 |
| 25 | BottomNavbar Component | Fixed bottom navigation (4 tabs) with floating cart badge | M3 | survey_spec_miner_1 |
| 26 | CategoryHeader Component | Sub-page sticky top header with back navigation and gradient title | M3 | survey_spec_miner_1 |
| 27 | Storefront Home Page View | Hero banner, category showcase, festival rail, product grid | M3 | survey_spec_miner_1 |
| 28 | Category Catalog Page View | Category-filtered product grid with sorting and category header | M3 | survey_spec_miner_1 |
| 29 | Product Detail Page View | Product gallery, specifications table, color/warranty picker, sticky purchase CTA | M4 | survey_spec_miner_1 |
| 30 | Cart Page & Checkout Summary | Cart item list, quantity controls, discount computation, checkout preview | M4 | survey_spec_miner_1 |
| 31 | Profile Page & ProfileHero | User hero card, order history, address manager, favorites | M4 | survey_spec_miner_1 |
| 32 | End-to-End E2E Test Suite | 4-tier requirement-driven opaque test suite (Tiers 1-4) | E2E | survey_spec_miner_1 |
| 33 | Adversarial Coverage Hardening | Tier 5 white-box challenger test generation & bug fixes | M5 | orchestrator |

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M1 | Core Setup & Foundation | Next.js 15 + React 19 + Tailwind v4 root setup, globals.css, Persian typography (self-hosted Vazirmatn woff2 + IRANSans; originally `@fontsource/vazirmatn`, migrated in M7), Slate/Zinc theme engine, domain types, Persian utilities, and mock data failover layer. | none | DONE |
| M2 | UniversalModal, Auth & State Stores | UniversalModal 580px adaptive system (drag-to-dismiss bottom sheet on mobile, centered dialog on desktop), LoginModal (11-digit phone OTP + 120s timer), AddressModal (store-backed list + inline add-address form), Zustand stores (Cart, Theme, Auth, Toast). | M1 | DONE |
| M3 | Catalog, Home Page & Navigation | Sticky glassmorphic Header (theme toggle, notification center, messages link, cart badge), SearchBar, ProductCard (`next/image`, favorites wired to auth store), ProductSkeleton (zero CLS), BottomNavbar, Home page with section islands (`HomeHero`, `CategoryGrid`, `FestivalDeals` with real-clock countdown, `CatalogSection`, `TrustStats`, `Testimonials`), Category Server Component (`app/category/[slug]/page.tsx` + `CategoryView`). | M1, M2 | DONE |
| M4 | Product Detail, Cart & Profile | Product Detail view (`app/product/[id]/page.tsx`, real `notFound()` for unknown ids, favorite wired), Cart page (real order placement via `POST /api/orders`, persisted `useOrderStore`), Profile view (orders incl. placed orders, favorites from store, addresses, messages tab), ProfileHero, checkout summary. | M2, M3 | DONE |
| M5 | Final E2E Test Pass & Hardening | Phase 1: 100% pass of E2E test suite (Tiers 1-4). Production build verification (`npm run build`). Tier 5 shared-foundations spec (`tests/e2e/tier5_shared_foundations.spec.ts`, real-module coverage incl. `toJalali` cross-check) wired into `tests/runner.js` → 110/110 total. `tier5_store_stability.spec.ts` exists but is still standalone. | M1, M2, M3, M4, TEST_READY | DONE |
| M6 | Engagement Full-Stack | Notification center (Header bell + `/notifications` page + `useNotificationStore`), support messaging (`/messages` page + `MessagePanel` + `useMessageStore` with optimistic send), branches (`/branches`), support center (`/support`), newsletter API + footer form, API routes for notifications/threads/messages/orders/newsletter/branches. | M4, M5 | DONE |
| E2E | E2E Testing Track | Requirement-driven opaque-box test suite covering Tiers 1-4 for all 32 features. Publishes `TEST_READY.md`. | none (runs in parallel with M1-M4) | DONE |
| M7 | Mobile Performance & Hardening | `/categories` page, SearchBar on `/search` with debounced `?q=`, BottomNavbar destinations, RTL drawer/profile spacing, catalog enrichment (28 products, Jalali dates); perf: `usePauseAnimationsOffscreen`, splash exit without fullscreen blur + ready-aware early exit, `transition-all` removal, search `useTransition`, `optimizePackageImports`, self-hosted fonts + preloads, `postcss` override (`npm audit` 0 vulns). Verified on production (mobile 390px, 4× CPU throttling, Lighthouse mobile). | M3, M4, M6 | DONE |

## Interface Contracts

### M1 ↔ M2 / M3 / M4 (Foundation & Types)
- `src/types/index.ts`:
  - `Product`, `Category`, `CartItem`, `Address`, `Order`, `UserProfile`, `ThemeMode`
- `src/lib/persian.ts`:
  - `toPersianDigits(input: string | number): string`
  - `toEnglishDigits(input: string): string`
  - `formatToman(amount: number | string, includeUnit?: boolean): string`
  - `calculateDiscount(originalPrice: number, currentPrice: number): number`
  - `parsePriceToman(rawText: string): number`
  - `slugifyPersian(text: string): string`
- `src/data/mock-data.ts`:
  - `mockProducts: Product[]`
  - `mockCategories: Category[]`
  - `mockFestivalProducts: Product[]`
  - `mockAddresses: Address[]`
  - `mockOrders: Order[]`
  - `mockUserProfile: UserProfile`

### M2 ↔ M3 / M4 (State & Modals)
- `useCartStore`:
  - `items: CartItem[]`
  - `addItem(product: Product, quantity?: number): void`
  - `removeItem(productId: string | number): void`
  - `updateQuantity(productId: string | number, quantity: number): void`
  - `clearCart(): void`
  - `getItemCount(): number`
  - `getSubtotal(): number`
  - `getTotalDiscount(): number`
  - `getPayableTotal(): number`
- `useThemeStore`:
  - `theme: 'light' | 'dark' | 'system'`
  - `resolvedTheme: 'light' | 'dark'`
  - `setTheme(theme: 'light' | 'dark' | 'system'): void`
  - `toggleTheme(): void`
- `useAuthStore`:
  - `isAuthenticated: boolean`
  - `user: UserProfile | null`
  - `activeAddress: Address | null`
  - `login(phoneNumber: string, userDetails?: Partial<UserProfile>): void`
  - `logout(): void`
  - `setActiveAddress(address: Address): void`
  - `addAddress(address: Address): void`
  - `toggleFavorite(productId: string | number): void`
- `useToastStore`:
  - `toasts: ToastItem[]`
  - `show(toast: Omit<ToastItem, 'id'>): string`
  - `dismiss(id: string): void`
  - `clear(): void`
- `useMessageStore`:
  - `threads: MessageThread[]`
  - `activeThreadId: string | null`
  - `fetchThreads(): Promise<void>`
  - `openThread(threadId: string): Promise<void>`
  - `newThread(title?: string): void`
  - `sendMessage(threadId: string, text: string): Promise<boolean>` (optimistic, rollback on failure)
- `useNotificationStore`:
  - `items: AppNotification[]`
  - `unreadCount: number`
  - `fetch(filter?: NotificationFilter): Promise<void>`
  - `markRead(id: string): Promise<void>`
  - `markAllRead(): Promise<void>`
  - `pushLocal(notification): void`
- `useOrderStore`:
  - `orders: Order[]`
  - `placeOrder({ items, addressId, paymentMethod }): Promise<Order>` (via `POST /api/orders`)
- `UniversalModal`:
  - `<UniversalModal show={boolean} onClose={() => void} title?: string description?: string fullScreen?: boolean>{children}</UniversalModal>`
- API routes (`src/app/api/`):
  - `GET /api/notifications?type=&unreadOnly=&limit=` → `{ items, unreadCount }`
  - `POST /api/notifications/read` `{ ids } | { all: true }` → `{ ok, marked }`
  - `GET /api/threads` → `{ threads }`
  - `GET /api/messages?threadId=` → `{ thread }`; `POST /api/messages` `{ threadId, body }` → `{ thread, message, autoReply }`
  - `POST /api/orders` `{ items, addressId, paymentMethod }` → `{ order }` (201)
  - `POST /api/newsletter` `{ phone }` → `{ ok, phone, message }` (201)
  - `GET /api/branches` → `{ branches }`
- Hooks (`src/hooks/`):
  - `useDealCountdown(): { hours, minutes, seconds, isUrgent, expired }` (12h rolling window, wall-clock aligned)
  - `useFocusTrap()` for modal focus management

## Code Layout
```
/Users/amirheidari/GitHub/Digi-Moon/
├── package.json                    (scripts: dev, build, start, lint, type-check, test, verify)
├── tsconfig.json
├── next.config.ts                  (viewTransition + optimizePackageImports experiments; images.remotePatterns for api.dijimoon.ir / unsplash)
├── postcss.config.mjs
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   ├── logo-moonmarket.svg/.png/.jpg
│   ├── fonts/vazirmatn/             (12 self-hosted woff2: arabic + latin × 400–900, vendored from @fontsource)
│   ├── official-logo.jpg
│   ├── daily-market-official-logo.png
│   └── manifest.json
├── src/
│   ├── app/
│   │   ├── layout.tsx                (RTL, self-hosted Vazirmatn + font preloads, anti-FOUC, MotionProvider, StoreHydration)
│   │   ├── vazirmatn.css             (12 @font-face blocks, font-display: swap, exact @fontsource unicode-ranges)
│   │   ├── globals.css
│   │   ├── template.tsx              (route transitions, reduced-motion aware)
│   │   ├── loading.tsx / error.tsx / not-found.tsx
│   │   ├── page.tsx                  (Home page)
│   │   ├── api/
│   │   │   ├── branches/route.ts     (GET)
│   │   │   ├── messages/route.ts     (GET thread, POST message)
│   │   │   ├── newsletter/route.ts   (POST subscribe)
│   │   │   ├── notifications/route.ts        (GET list)
│   │   │   ├── notifications/read/route.ts   (POST mark read)
│   │   │   ├── orders/route.ts       (POST place order)
│   │   │   └── threads/route.ts      (GET list)
│   │   ├── branches/page.tsx         (store branches)
│   │   ├── cart/page.tsx             (cart + real checkout via /api/orders)
│   │   ├── category/[slug]/page.tsx  (Server Component + CategoryView)
│   │   ├── messages/page.tsx         (support messaging)
│   │   ├── notifications/page.tsx    (notification center page)
│   │   ├── product/[id]/page.tsx     (product detail, notFound on unknown id)
│   │   ├── profile/page.tsx          (orders, favorites, addresses, messages tabs)
│   │   ├── search/page.tsx
│   │   ├── support/page.tsx          (FAQ, returns, terms, privacy, guides)
│   │   ├── robots.ts / sitemap.ts
│   ├── components/
│   │   ├── address/AddressModal.tsx  (store-backed + inline add-address form)
│   │   ├── auth/LoginModal.tsx
│   │   ├── catalog/
│   │   │   ├── CategoryView.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductSkeleton.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── home/
│   │   │   ├── HomeClient.tsx
│   │   │   ├── Section.tsx
│   │   │   └── sections/             (HomeHero, CategoryGrid, FestivalDeals, CatalogSection, BrandChips, TrustStats, Testimonials)
│   │   ├── layout/
│   │   │   ├── Header.tsx            (theme toggle, NotificationCenter, messages link, cart badge)
│   │   │   ├── CategoryHeader.tsx
│   │   │   ├── BottomNavbar.tsx
│   │   │   └── Footer.tsx            (real links, working newsletter form)
│   │   ├── messages/MessagePanel.tsx (threads + optimistic composer)
│   │   ├── navigation/
│   │   │   ├── CategoryDrawer.tsx
│   │   │   ├── CategorySubnav.tsx
│   │   │   ├── MegaMenu.tsx
│   │   │   └── category-icons.tsx
│   │   ├── notifications/NotificationCenter.tsx (header bell + panel)
│   │   ├── profile/ProfileHero.tsx
│   │   └── ui/
│   │       ├── AnimatedCounter.tsx
│   │       ├── AnimatedSplashScreen.tsx
│   │       ├── DailyMarketLogo.tsx
│   │       ├── MoonMarketLogo.tsx
│   │       ├── MotionProvider.tsx
│   │       ├── ScrollProgressBar.tsx
│   │       ├── SearchBar.tsx
│   │       ├── StoreHydration.tsx
│   │       ├── Toast.tsx
│   │       └── UniversalModal.tsx
│   ├── stores/
│   │   ├── useAuthStore.ts
│   │   ├── useCartStore.ts
│   │   ├── useMessageStore.ts
│   │   ├── useNotificationStore.ts
│   │   ├── useOrderStore.ts
│   │   ├── useThemeStore.ts
│   │   └── useToastStore.ts
│   ├── hooks/
│   │   ├── useDealCountdown.ts
│   │   ├── useFocusTrap.ts
│   │   └── usePauseAnimationsOffscreen.ts  (IntersectionObserver + getAnimations subtree pause)
│   ├── lib/
│   │   ├── persian.ts                (+ timeAgoFa)
│   │   ├── api.ts
│   │   ├── engagement.ts             (notifications/threads/orders/newsletter DAL + validation)
│   │   ├── product-images.ts         (inline SVG packshots + PRODUCT_PLACEHOLDER)
│   │   └── utils.ts
│   ├── data/
│   │   ├── mock-data.ts              (FMCG catalog, addresses, orders, profile)
│   │   └── engagement.ts             (notifications, threads, branches, support content)
│   └── types/
│       └── index.ts                  (+ NotificationType, AppNotification, ChatMessage, MessageThread, Branch)
├── tests/
│   ├── e2e/
│   │   ├── tier1_feature_coverage.spec.ts
│   │   ├── tier2_boundary_corner.spec.ts
│   │   ├── tier3_pairwise_combinations.spec.ts
│   │   ├── tier4_real_world_scenarios.spec.ts
│   │   ├── tier5_shared_foundations.spec.ts  (wired: real-module coverage, toJalali 20-year cross-check)
│   │   └── tier5_store_stability.spec.ts   (standalone, not wired into runner.js)
│   ├── fixtures/                         (catalog.fixture.ts, user-session.fixture.ts)
│   ├── harness.ts
│   ├── m1_challenger_verification.mjs     (legacy M1 data oracle; partially stale vs FMCG dataset)
│   └── runner.js                         (tiers 1-5, 110 tests)
├── design-system/                      (Reference design system assets)
└── COMPREHENSIVE_REPORT.md             (Reference reverse engineering report)
```
