# Handoff Report: Milestone 1 Core Setup & Foundation (Package & Config Strategy)

**Author**: `m1_explorer_1` (teamwork_preview_explorer)  
**Parent Caller**: `875495e2-e902-4678-a7f8-8c203de96906` (`parent`)  
**Target Project**: Dijimoon Storefront (دیجی مون)  
**Milestone**: M1 (Core Setup & Foundation)  
**Date**: 2026-09-18  
**Status**: COMPLETE (Hard Handoff)  
**Artifacts Produced in Working Directory**:
- `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_1/proposed_package.json`
- `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_1/proposed_tsconfig.json`
- `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_1/proposed_next.config.ts`
- `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_1/proposed_postcss.config.mjs`
- `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_1/proposed_eslint.config.mjs`

---

## 1. Observation

### 1.1 Directives & Requirements Baseline
- **Direct User Directive (`.agents/ORIGINAL_REQUEST.md:64-74`)**:
  > «از جدیدترین و بهترین نسخه‌ها استفاده کن و پیاده‌سازی کن»
  > - Next.js 15+ (App Router & Turbopack)
  > - React 19 & React DOM 19
  > - Tailwind CSS v4 (`@tailwindcss/postcss`)
  > - Framer Motion / Motion (جدیدترین نسخه با فیزیک فنری و ژست‌های لمسی)
  > - Lucide React (جدیدترین پکیج آیکون‌ها)
  > - TypeScript 5+ و ESLint 9+
  > - رعایت اصول پیشرفته Vercel (RSC، Suspense، View Transitions) و Modern Web Guidance.

- **Project Blueprint (`PROJECT.md:4-10, 51-60`)**:
  - Requires App Router root layout, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, and domain stores/types.
  - Path alias required: `@/*` pointing to `./src/*`.
  - Image remote patterns must allow `api.dijimoon.ir`.

### 1.2 Host Environment & Upstream npm Registry Versions
Direct query verification via `run_command` against the npm registry:
- **Node.js**: `v26.7.0` (managed by `fnm`)
- **Package Manager**: `npm 11.19.0` (also `pnpm 11.17.0`)
- **Next.js**: Latest stable 15.x release is `15.5.25` (`next@^15.5.25`)
- **React & React DOM**: `19.3.0` (`react@^19.3.0`, `react-dom@^19.3.0`)
- **Tailwind CSS v4**: `4.3.3` (`tailwindcss@^4.3.3`)
- **PostCSS Adapter**: `@tailwindcss/postcss@4.3.3` (`@tailwindcss/postcss@^4.3.3`)
- **PostCSS Engine**: `postcss@8.5.3` (`postcss@^8.5.3`)
- **Animation Engine**: `motion@13.4.0` and `framer-motion@13.4.0` (React 19 support confirmed via peerDependencies: `{ react: '^18.0.0 || ^19.0.0', 'react-dom': '^18.0.0 || ^19.0.0' }`)
- **Icon Library**: `lucide-react@1.47.0` (React 19 support confirmed via peerDependencies: `{ react: '^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0' }`)
- **TypeScript**: `5.9.3` (`typescript@^5.9.3`)
- **Client State**: `zustand@5.0.15` (`zustand@^5.0.15`, React 19 compatible)
- **Persian Typography**: `@fontsource/vazirmatn@5.3.0` (Offline-safe local font bundle)
- **Class Utilities**: `clsx@2.1.1`, `tailwind-merge@3.0.0`
- **Linting Suite**: `eslint@9.20.0`, `eslint-config-next@15.5.25`, `@eslint/eslintrc@3.3.7`

### 1.3 Repository File State
Direct inspection of `/Users/amirheidari/GitHub/Digi-Moon`:
- `package.json`: Missing (needs creation)
- `tsconfig.json`: Missing (needs creation)
- `next.config.ts`: Missing (needs creation)
- `postcss.config.mjs`: Missing (needs creation)
- `design-system/`: Contains tokens, components, and Tailwind v4 stylesheet (`design-system/tailwind-theme.css`)
- No binary `.woff` or `.ttf` font files exist in the repository root.

---

## 2. Logic Chain

1. **Premise 1 (Adherence to Latest Compatible Stack Directives)**:
   - The user mandated: *«از جدیدترین و بهترین نسخه‌ها استفاده کن و پیاده‌سازی کن»*.
   - Node `v26.7.0` and `npm 11.19.0` run without friction on macOS.
   - Registry inspection confirmed that `next@^15.5.25`, `react@^19.3.0`, `tailwindcss@^4.3.3`, `@tailwindcss/postcss@^4.3.3`, `motion@^13.4.0`, `lucide-react@^1.47.0`, and `typescript@^5.9.3` represent the state-of-the-art production versions.
   - Both `motion` and `framer-motion` are provided in `dependencies` because existing design system components and future modules may import from either package. Both packages resolve to v13.4.0 with zero peer dependency conflicts on React 19.

2. **Premise 2 (Turbopack & TypeScript App Router Configuration)**:
   - Next.js 15 native bundler Turbopack reads `compilerOptions.paths` directly from `tsconfig.json`.
   - By declaring `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }`, all imports across components, stores, lib, data, and types resolve cleanly.
   - Next.js App Router requires `"moduleResolution": "bundler"`, `"jsx": "preserve"`, and the Next.js TypeScript plugin `[{ "name": "next" }]`.

3. **Premise 3 (Next.js 15 Config Architecture)**:
   - Next.js 15 natively supports TypeScript configuration via `next.config.ts`.
   - Remote patterns must allow loading product images and banners from `api.dijimoon.ir`. Specifying `{ protocol: 'https', hostname: 'api.dijimoon.ir', pathname: '/**' }` covers all image paths including `/Api/Files/Download/*`.
   - In Next.js 15, Turbopack options are configured under the top-level `turbopack` key.
   - Native View Transitions are activated via `experimental: { viewTransition: true }` in accordance with Vercel expert recommendations and user directive (`ORIGINAL_REQUEST.md:73`).

4. **Premise 4 (Tailwind CSS v4 PostCSS Integration)**:
   - Tailwind CSS v4 moves away from JavaScript configuration (`tailwind.config.js`).
   - PostCSS only needs the single dedicated plugin `@tailwindcss/postcss: {}` in `postcss.config.mjs`.
   - The CSS engine reads `@import "tailwindcss";`, `@custom-variant dark`, and `@theme` definitions directly from `src/app/globals.css`.

5. **Premise 5 (Deterministic Offline Font & Network Resilience)**:
   - Network constraints: The user operates behind a VPN, and domestic Iranian endpoints may split-tunnel or timeout on remote CDN queries.
   - Including `@fontsource/vazirmatn@^5.3.0` ensures the font files reside locally in `node_modules/@fontsource/vazirmatn`, eliminating any remote Google Fonts network call during `next build`.

---

## 3. Caveats

1. **ESLint 9 Flat Config Compatibility**: Next.js 15 supports ESLint 9 using flat config (`eslint.config.mjs`). We include `@eslint/eslintrc@^3.3.7` so that `FlatCompat` allows `next/core-web-vitals` and `next/typescript` to run cleanly without deprecation errors.
2. **Turbopack Dev Flag**: In Next.js 15, Turbopack is invoked in development via `next dev --turbopack`. While Turbopack is extremely fast, production build is handled by `next build`.
3. **Clean Hydration**: React 19 strictly warns against hydration mismatches. UI components reading persisted `localStorage` states (e.g. cart badge count, dark mode class) must use anti-FOUC inline scripts and mounted gates.
4. **Read-Only Explorer Scope**: In accordance with the Teamwork Explorer archetype, all configurations have been written to proposed files in `.agents/m1_explorer_1/`. The worker will copy or write them into the project root.

---

## 4. Conclusion & Concrete Worker Blueprint

### 4.1 Exact `package.json` Specification
*Saved at `.agents/m1_explorer_1/proposed_package.json`:*

```json
{
  "name": "dijimoon",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@fontsource/vazirmatn": "^5.3.0",
    "clsx": "^2.1.1",
    "framer-motion": "^13.4.0",
    "lucide-react": "^1.47.0",
    "motion": "^13.4.0",
    "next": "^15.5.25",
    "react": "^19.3.0",
    "react-dom": "^19.3.0",
    "tailwind-merge": "^3.0.0",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.7",
    "@tailwindcss/postcss": "^4.3.3",
    "@types/node": "^22.13.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.20.0",
    "eslint-config-next": "^15.5.25",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.3.3",
    "typescript": "^5.9.3"
  }
}
```

### 4.2 Exact `tsconfig.json` Configuration
*Saved at `.agents/m1_explorer_1/proposed_tsconfig.json`:*

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### 4.3 Exact `next.config.ts` Configuration
*Saved at `.agents/m1_explorer_1/proposed_next.config.ts`:*

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dijimoon.ir',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    // Turbopack builds automatically honor tsconfig.json compilerOptions.paths
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
```

### 4.4 Exact `postcss.config.mjs` Configuration
*Saved at `.agents/m1_explorer_1/proposed_postcss.config.mjs`:*

```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

### 4.5 Supporting `eslint.config.mjs` (ESLint 9 Flat Config)
*Saved at `.agents/m1_explorer_1/proposed_eslint.config.mjs`:*

```javascript
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
```

---

## 5. Verification Method

The worker and sentinel can independently verify the installation and configuration via the following sequence:

### Step 1: Write Configuration Files to Root
```bash
cp .agents/m1_explorer_1/proposed_package.json package.json
cp .agents/m1_explorer_1/proposed_tsconfig.json tsconfig.json
cp .agents/m1_explorer_1/proposed_next.config.ts next.config.ts
cp .agents/m1_explorer_1/proposed_postcss.config.mjs postcss.config.mjs
cp .agents/m1_explorer_1/proposed_eslint.config.mjs eslint.config.mjs
```

### Step 2: Install Dependencies via npm
```bash
npm install
```
*Expected Result*: Clean installation completed with exit code 0. Zero unmet peer dependency warnings for React 19, Next 15, or Tailwind v4.

### Step 3: Verify Peer Dependency Consistency
```bash
npm ls --depth=0
```
*Expected Result*: All 10 dependencies and 9 devDependencies resolved cleanly.

### Step 4: Verify TypeScript Path Resolution
```bash
npm run type-check
```
*Expected Result*: TypeScript compiler validates without syntax or config errors.

### Step 5: Verify Tailwind CSS v4 Compilation
```bash
npx @tailwindcss/cli -i src/app/globals.css -o /tmp/tailwind-check.css
```
*Expected Result*: Generates compiled CSS bundle verifying `@tailwindcss/postcss` and Tailwind v4 engine operation.

### Step 6: Verify Next.js Turbopack Dev Server Startup
```bash
npm run dev -- --help
```
*Expected Result*: Turbopack CLI flags display without deprecation warnings.
