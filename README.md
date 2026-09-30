# MoonMarket — مون مارکت

Persian (RTL) FMCG storefront built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, **Framer Motion**, and **Zustand 5**. Bilingual UI copy is Persian-first with full RTL layout, Vazirmatn typography, and Slate (light) / Zinc (dark) dual-palette theming.

## Quick start

```bash
npm install
npm run dev      # development server (Turbopack)
npm run build    # production build
npm start        # serve production build
```

## Quality gates

```bash
npm test         # 5-tier suite (110 tests, tiers 1-5)
npm run lint
npm run type-check
npm run verify   # type-check + lint + test + build
```

See `TEST_INFRA.md` (test architecture) and `TEST_READY.md` (latest verification status).

## Project structure

- `src/app/` — routes: home, category, product, cart, search, profile, messages, notifications, branches, support; plus API Route Handlers under `src/app/api/` (branches, messages, newsletter, notifications, orders, threads)
- `src/app/vazirmatn.css` — self-hosted Vazirmatn `@font-face` set (arabic + latin subsets × 6 weights, byte-identical files vendored from `@fontsource/vazirmatn`); `layout.tsx` preloads the LCP-critical arabic 400/700/900
- `src/components/` — layout, catalog, home sections, navigation, notifications, messages, profile, auth/address modals, UI primitives
- `src/stores/` — Zustand stores: auth, cart, theme, toast, messages, notifications, orders (persisted, post-mount rehydration via `StoreHydration`)
- `src/lib/` — Persian utilities (`persian.ts`, incl. `timeAgoFa`), engagement DAL with validation (`engagement.ts`), typed API client (`api.ts`), inline SVG packshots (`product-images.ts`)
- `src/data/` — FMCG mock catalog (`mock-data.ts`), engagement seeds (`engagement.ts`)
- `src/hooks/` — `useDealCountdown` (wall-clock aligned), `useFocusTrap`, `usePauseAnimationsOffscreen` (pauses off-screen CSS/WAAPI animations via IntersectionObserver + `getAnimations({ subtree: true })`)
- `tests/` — 5-tier opaque E2E suite + fixtures + harness (see `TEST_INFRA.md`)
- `design-system/` — reverse-engineered reference assets (source material, not the live implementation)
- `PROJECT.md` — architecture, milestones, interface contracts, code layout
- `COMPREHENSIVE_REPORT.md` — original reverse-engineering report (Persian)

## Key behaviors

- Checkout places a real order through `POST /api/orders` (validated server-side) and persists it in `useOrderStore`; a notification is pushed to the notification center.
- Support messaging (`/messages`) uses optimistic send with rollback plus an automated support acknowledgment.
- Unknown product ids render the 404 page; empty categories render the empty state (no silent fallbacks).
- Animations respect `prefers-reduced-motion` globally (`MotionProvider`).

## Performance

- `usePauseAnimationsOffscreen` pauses the home hero / festival ambient loops off-screen (measured on prod: 11 running → 1 when scrolled away, resumed on return).
- Splash exits early once critical fonts + window load are ready (2 s brand minimum, 3.6 s cap) instead of a fixed 3.6 s.
- Search commits the debounced `?q=` URL inside `useTransition` with a pending dim on the results grid.
- `next.config.ts` sets `experimental.optimizePackageImports` (lucide-react, framer-motion, motion, zustand, clsx, tailwind-merge) to shorten hydration long tasks.
- Vazirmatn is self-hosted (`public/fonts/vazirmatn`, `npm audit` clean via a `postcss: $postcss` override unifying Next's pinned 8.4.31 to 8.5.28).

## Deployment notes

- No production secrets are required; the app runs on mock data with an optional live API (`api.dijimoon.ir`) fallback.
- Production: `https://digi-moon.vercel.app` (Vercel project `digi-moon`, scope `amir-hdri-projects`). Deploy flow is CLI-driven: `vercel deploy -y --no-wait --scope amir-hdri-projects` → wait for `● Ready` → `vercel promote <preview-url> --scope amir-hdri-projects -y`.
- Note: Vercel Security Checkpoint intermittently challenges automated traffic (Lighthouse/Playwright), returning 403s on `?_rsc=` requests and skewing single lab runs (observed CLS 0.87 vs baseline 0.04). Human traffic is unaffected; treat isolated lab outliers accordingly.
- Legacy note: `tests/m1_challenger_verification.mjs` targets the original electronics dataset and is not a release gate (see `TEST_READY.md` §6).
