# Handoff Report: Repository Survey & Codebase Inventory

**Agent ID**: `survey_explorer_1`  
**Role**: Codebase & Repo Survey Explorer (`teamwork_preview_explorer`)  
**Target Project**: Dijimoon Next.js 15 Storefront  
**Date**: 2026-09-18  
**Status**: COMPLETE  

---

## 1. Observation

### 1.1 Repository Root Files & Directories
Direct observation via `ls -la /Users/amirheidari/GitHub/Digi-Moon`:
```
drwxr-xr-x   5 amirheidari  staff    160 Sep 18 01:40 .
drwxr-xr-x@ 24 amirheidari  staff    768 Sep 17 11:35 ..
drwxr-xr-x@  9 amirheidari  staff    288 Sep 18 02:03 .agents
-rw-r--r--@  1 amirheidari  staff  26076 Sep 18 01:40 COMPREHENSIVE_REPORT.md
drwxr-xr-x@ 12 amirheidari  staff    384 Sep 17 13:33 design-system
```

- **Root files present**:
  - `COMPREHENSIVE_REPORT.md`: 26,076 bytes. Full reverse-engineering report of `https://dijimoon.ir`.
  - `design-system/`: Directory containing tokens, components, Tailwind v4 theme, API client, and HTML demo.
  - `.agents/`: Directory containing agent metadata, instructions, and skills.
- **Root files absent**:
  - No `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, or `bun.lockb`.
  - No `tsconfig.json`.
  - No `next.config.js`, `next.config.mjs`, or `next.config.ts`.
  - No `postcss.config.js` or `postcss.config.mjs`.
  - No `src/` or `app/` directory.
  - No `public/` directory (no favicon, images, or static assets).
  - No `.gitignore`.
  - No `.env` or `.env.local`.
  - No `.git/` folder (command `git status` returned code 128: `fatal: not a git repository (or any of the parent directories): .git`).

### 1.2 Host Environment & Tooling
Direct observation via command execution:
```bash
$ node -v
v26.7.0

$ npm -v
11.19.0

$ which pnpm && pnpm -v
/Users/amirheidari/.local/state/fnm_multishells/11787_1789632852203/bin/pnpm
11.17.0

$ which yarn && yarn -v
/Users/amirheidari/.local/state/fnm_multishells/11787_1789632852203/bin/yarn
1.22.22

$ which bun
bun not found

$ fnm list
* v26.3.1 default
* system
```
- Node.js is `v26.7.0` (managed by `fnm`).
- `pnpm` (11.17.0) and `npm` (11.19.0) are fully available and operational.

### 1.3 Font Assets
Direct observation via `find . -type f \( -name "*.woff*" -o -name "*.ttf" -o -name "*.otf" \)`:
- Total matching font files found: **0**.
- There are no binary font files (`.woff`, `.woff2`, `.ttf`, `.otf`) in `public/fonts`, `design-system/fonts`, or elsewhere in the repo.
- Font references in existing code:
  - `design-system/index.html` (lines 43-53):
    ```css
    @font-face {
      font-family: 'IRANSans';
      src: local('IRANSans'), local('IRANSansX'), local('Vazirmatn'), local('Tahoma');
    }
    body {
      font-family: 'IRANSans', 'Vazirmatn', -apple-system, BlinkMacSystemFont, Tahoma, sans-serif;
      font-feature-settings: "rlig" 1, "calt" 1;
      -webkit-font-smoothing: antialiased;
      direction: rtl;
    }
    ```
  - `design-system/tailwind-theme.css` (lines 11, 211-214):
    ```css
    --font-sans: "IRANSans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    ...
    font-family: var(--font-sans);
    font-feature-settings: "rlig" 1, "calt" 1;
    -webkit-font-smoothing: antialiased;
    ```
  - `design-system/tokens.json` (lines 402-411): Defines primary font family token as `IRANSans` with system fallbacks.

### 1.4 Existing Source Assets in `design-system/`
Direct observation of all 20 items in `design-system/`:
1. `design-system/DESIGN_SYSTEM.md` (34,297 bytes): Comprehensive specification of tokens, colors, breakpoints, and component contracts.
2. `design-system/README.md` (4,181 bytes): Quick-start integration guide.
3. `design-system/tokens.json` (16,902 bytes, 722 lines): W3C DTCG-compliant design tokens.
4. `design-system/tailwind-theme.css` (8,442 bytes, 281 lines): Pure Tailwind CSS v4 `@theme` configuration with custom utilities (`glass-effect`, `gradient-text`, `floating` animation keyframes, `safe-area-bottom`).
5. `design-system/tailwind.config.js` (2,735 bytes): Tailwind CSS v3 fallback configuration.
6. `design-system/index.html` (34,578 bytes, 600 lines): Standalone interactive browser preview demonstrating live catalog, profile view, OTP login modal, address bottom sheet, and dark/light mode toggle.
7. `design-system/index.ts` (113 bytes): Barrel re-exporting types, lib, and components.
8. `design-system/types/index.ts` (2,098 bytes): TypeScript interfaces:
   - `Product`, `Category`, `CartItem`, `Address`, `GridQueryParams`, `PaginatedResult<T>`
   - `ThemeMode`, `ElevationLevel`, `RadiusLevel`
   - `TotpRequest`, `VerifyTotpRequest`, `AuthResponse`, `UserProfile`
9. `design-system/lib/persian.ts` (2,296 bytes): Utility functions:
   - `toPersianDigits(input)`
   - `toEnglishDigits(input)`
   - `formatToman(amount, includeUnit)`
   - `calculateDiscount(originalPrice, currentPrice)`
   - `parsePriceToman(rawText)`
10. `design-system/lib/api.ts` (4,040 bytes): Typed client `DijimoonApiClient` with methods for:
    - Products: `getProduct`, `getSpecialProducts`, `getProductsByCategory`, `getProductGrid`, `getMainPageCategoryProducts`, `getFestivalProducts`
    - Categories: `getCategories`, `getMainPageCategories`
    - Search: `searchMainPage`, `searchCategory`
    - SSO / OTP: `requestTotp`, `reSendTotp`, `verifyTotp`
    - CDN URLs: `getFileUrl(fileId)` resolving to `https://api.dijimoon.ir/Api/Files/Download/{fileId}`
11. `design-system/components/` (10 React TSX components):
    - `Header.tsx`: Glassmorphism sticky header with brand title gradient, address indicator, and cart button.
    - `SearchBar.tsx`: Glassmorphism search input with focus ring.
    - `ProductCard.tsx`: Responsive product card with discount badge, image, price in Toman, and add-to-cart button.
    - `ProductSkeleton.tsx`: Zero-CLS layout placeholder loader matching `ProductCard`.
    - `BottomNavbar.tsx`: Fixed bottom navigation bar with 4 tabs (Home, Categories, Cart, Profile).
    - `CategoryHeader.tsx`: Header for category pages with return button and gradient title.
    - `AddressModal.tsx`: Delivery address selection drawer/sheet.
    - `UniversalModal.tsx`: 580px adaptive dialog (bottom sheet with drag handle on `< 580px`, centered modal on `>= 580px`).
    - `LoginModal.tsx`: Mobile number (11 digits) input + OTP code verification flow.
    - `ProfileHero.tsx`: User profile header with brand gradient and fast-access cards.
    - `index.ts`: Barrel export for all 10 components.

### 1.5 Missing Application Structure vs Required Target
The application code layer is currently completely unbuilt. Missing components are:
1. `package.json` with scripts (`dev`, `build`, `start`, `lint`) and latest dependencies.
2. `tsconfig.json` configured for Next.js App Router and path aliases (`@/*`).
3. `next.config.ts` configured for Turbopack, image optimization for `api.dijimoon.ir`, and React 19.
4. `postcss.config.mjs` configured with `@tailwindcss/postcss`.
5. `app/globals.css` integrating Tailwind v4 `@import "tailwindcss";` and `./design-system/tailwind-theme.css`.
6. `app/layout.tsx` providing `html[dir="rtl"][lang="fa"]`, Persian font loading, ThemeProvider (Slate/Zinc), and Modal/Toast providers.
7. `app/page.tsx` (Storefront Home: Glass header, Hero/Festival banner, Category shortcuts, Special Products rail, Product grid, Bottom navbar).
8. `app/category/[slug]/page.tsx` or `app/category/page.tsx` (Catalog grid, sort & category filters).
9. `app/product/[id]/page.tsx` (Product details, gallery, specs, sticky purchase CTA).
10. `app/cart/page.tsx` (Cart management, pricing summary, checkout flow preview).
11. `app/profile/page.tsx` (Profile panel, order history, addresses, favorites).
12. Client state stores (Zustand or React Context) for:
    - `cartStore`: items, add, remove, update quantity, compute total Toman.
    - `authStore`: isAuthenticated, user, tokens, loginModalOpen.
    - `themeStore`: 'light' (Slate) vs 'dark' (Zinc) with localStorage persistence.
    - `addressStore`: addresses, selectedAddressId, addressModalOpen.
13. Static public assets (`public/logo.png`, `public/favicon.ico`).

---

## 2. Logic Chain

1. **Premise 1 (Repository Baseline)**:
   - Direct inspection of the root directory confirms that only `.agents/`, `COMPREHENSIVE_REPORT.md`, and `design-system/` exist. There are no project manifests (`package.json`) or source trees (`app/`, `src/`).
   - Therefore, the project must be initialized from scratch in the repository root (`/Users/amirheidari/GitHub/Digi-Moon`) without overwriting or moving `design-system/`.

2. **Premise 2 (Stack Directives & Host Tooling)**:
   - Direct user directive requires:
     - Next.js 15+ (App Router & Turbopack)
     - React 19 & React DOM 19
     - Tailwind CSS v4 (@tailwindcss/postcss)
     - Framer Motion / Motion
     - Lucide React
     - TypeScript 5+
   - Host inspection confirms Node.js `v26.7.0` and package managers `pnpm` (v11.17.0) and `npm` (v11.19.0) are available.
   - Node 26.7.0 is fully compatible with Next.js 15, React 19, and Tailwind v4. Either `pnpm` or `npm` can be used.

3. **Premise 3 (Design System Readiness)**:
   - Inspection of `design-system/` confirms that all foundational UI building blocks (10 React components, DTCG tokens, Tailwind v4 `@theme` CSS, typed API client, and Persian formatting utilities) are already present and high quality.
   - These components are currently written in pure React + TypeScript with standard HTML/CSS classes matching `tailwind-theme.css`.
   - They can be directly imported or wired into the Next.js 15 `app/` routes.

4. **Premise 4 (Font Strategy & Network Resilience)**:
   - User memory states: *"The user uses a VPN and the target site only accepts Iranian IP addresses."*
   - Font audit confirms 0 binary font files in the repository.
   - If `next/font/google` is used to load `Vazirmatn`, it fetches from Google Fonts during `next build`. If executed behind an Iranian domestic network restriction or offline, that fetch can fail or timeout.
   - Therefore, the safest, zero-failure font strategy is:
     1. Use `@fontsource/vazirmatn` or bundled local `.woff2` font files in `public/fonts/` loaded via `next/font/local`.
     2. Maintain the CSS fallback stack defined in `design-system/index.html`: `IRANSans, Vazirmatn, system-ui, -apple-system, BlinkMacSystemFont, Tahoma, sans-serif`.

5. **Premise 5 (Required Dependencies Manifest)**:
   - Based on Directives and existing code imports, the exact package set needed is:
     - **Dependencies**:
       - `next@^15.2.0` (or `latest`)
       - `react@^19.0.0`
       - `react-dom@^19.0.0`
       - `framer-motion@^12.0.0` (or `motion@latest`)
       - `lucide-react@^0.475.0`
       - `zustand@^5.0.0` (for cart, theme, and auth state)
       - `clsx@^2.1.1` & `tailwind-merge@^3.0.0`
       - `@fontsource/vazirmatn@^5.0.0` (for offline-safe Persian font)
     - **DevDependencies**:
       - `typescript@^5.7.0`
       - `@types/node@^22.0.0`
       - `@types/react@^19.0.0`
       - `@types/react-dom@^19.0.0`
       - `tailwindcss@^4.0.0`
       - `@tailwindcss/postcss@^4.0.0`
       - `postcss@^8.4.0`
       - `eslint@^9.0.0`
       - `eslint-config-next@^15.0.0`

---

## 3. Caveats

1. **Git Repository Uninitialized**: The directory `/Users/amirheidari/GitHub/Digi-Moon` is not yet a git repository (`git status` exits with code 128). If git operations or git hooks are attempted, `git init` will be required first.
2. **Network Constraints (VPN vs Iranian IP)**: Live API calls to `https://api.dijimoon.ir` drop connections if accessed from a non-Iranian IP (as documented in `COMPREHENSIVE_REPORT.md` Section 2). The application must feature mock data fallbacks in the client/server layer so that the app runs smoothly with full interactive fidelity regardless of VPN status.
3. **Image CDN Referencing**: Existing components reference `/logo.png` and `api.dijimoon.ir/Api/Files/Download/{fileId}`. A placeholder SVG/PNG logo must be added to `public/logo.png` to avoid broken images, and `next.config.ts` must allow `api.dijimoon.ir` in `images.remotePatterns`.
4. **Tailwind v4 Setup**: Tailwind CSS v4 does not use `tailwind.config.js` by default; it uses CSS-first configuration via `@import "tailwindcss";` and `@theme` blocks. The existing `design-system/tailwind-theme.css` is already written in Tailwind v4 format, so `postcss.config.mjs` must load `@tailwindcss/postcss`.

---

## 4. Conclusion

The repository is currently an uninitialized workspace with a mature, comprehensive design system (`design-system/`) and reverse-engineering specification (`COMPREHENSIVE_REPORT.md`), but **zero Next.js 15 project files, configuration, or dependencies installed**.

All required tools are present on the host (Node v26.7.0, pnpm 11.17.0, npm 11.19.0). The path forward is clear:
1. Initialize the root Next.js 15 project with `package.json`, `tsconfig.json`, `next.config.ts`, and `postcss.config.mjs` matching the user's stack directive (Next.js 15+, React 19, Tailwind CSS v4, Motion, Lucide React, TypeScript 5+).
2. Wire `design-system/tailwind-theme.css` into `app/globals.css`.
3. Provide robust Persian typography via `@fontsource/vazirmatn` and local font fallbacks.
4. Implement App Router pages (`app/page.tsx`, `app/product/[id]/page.tsx`, `app/category/[slug]/page.tsx`, `app/cart/page.tsx`, `app/profile/page.tsx`) by assembling the existing `design-system/components/` with Zustand state management.
5. Provide resilient mock data fallbacks for all `api.dijimoon.ir` endpoints.

---

## 5. Verification Method

To independently verify the observations and inventory recorded in this report:

1. **Verify Root Directory Inventory**:
   ```bash
   ls -la /Users/amirheidari/GitHub/Digi-Moon
   # Expected: Only .agents, COMPREHENSIVE_REPORT.md, and design-system exist.
   ```
2. **Verify Lack of Node/Package Manifest**:
   ```bash
   test -f /Users/amirheidari/GitHub/Digi-Moon/package.json && echo "Found" || echo "Missing"
   # Expected: Missing
   ```
3. **Verify Node & Package Manager Versions**:
   ```bash
   node -v && pnpm -v && npm -v
   # Expected: v26.7.0, 11.17.0, 11.19.0
   ```
4. **Verify Absence of Binary Font Files**:
   ```bash
   find /Users/amirheidari/GitHub/Digi-Moon -type f \( -name "*.woff*" -o -name "*.ttf" -o -name "*.otf" \)
   # Expected: Empty output (0 files)
   ```
5. **Verify Design System Files**:
   ```bash
   ls -la /Users/amirheidari/GitHub/Digi-Moon/design-system/components/
   # Expected: 10 .tsx component files and index.ts
   ```
