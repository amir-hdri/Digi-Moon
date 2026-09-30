# Test Infrastructure Specification: Dijimoon Storefront

> **Authoritative Specification Document**  
> **Status**: Ready / Production Grade  
> **Engine**: Node.js 20+ Native Test Suite & TypeScript Execution  
> **Target**: Next.js 15 App Router, Tailwind CSS v4, Persian Typography, Zustand 5, UniversalModal  

---

## 1. Executive Summary & Philosophy

The Dijimoon Test Infrastructure provides a deterministic, requirement-driven, opaque-box testing framework. It evaluates the application against the contracts and requirements defined in `PROJECT.md` and `COMPREHENSIVE_REPORT.md` without tight coupling to volatile private implementation details.

### Core Testing Pillars:
1. **Opaque-Box Requirement Verification**: Tests assert against public interface contracts, mathematical invariants, DOM class structures, ARIA accessibility semantics, and design tokens.
2. **Zero External Dependency Flakiness**: The core runner executes cleanly using native Node.js runtime features (`node:assert`, `node:fs`, `node:path`), preventing network timeouts, VPN geo-blocking, or headless browser memory leaks from halting CI.
3. **Four-Tiered Defense Architecture**: Structured from granular feature checks to complex real-world end-to-end user journeys.
4. **Deterministic Oracle Baselines**: Every expected value is derived directly from reverse-engineered production artifacts (`design-system/tokens.json`, `design-system/tailwind-theme.css`, `design-system/lib/persian.ts`, `design-system/components/`).

---

## 2. Directory Layout & Test Organization

```
/Users/amirheidari/GitHub/Digi-Moon/
├── TEST_INFRA.md                          # This architecture specification
├── TEST_READY.md                          # Readiness publication & runner commands
├── tests/
│   ├── runner.js                          # Unified executable test runner (CLI reporter)
│   ├── fixtures/                          # Authoritative fixture data & mock payloads
│   │   ├── catalog.fixture.ts
│   │   └── user-session.fixture.ts
│   └── e2e/
│       ├── tier1_feature_coverage.spec.ts # Tier 1: Feature Coverage (≥50 tests)
│       ├── tier2_boundary_corner.spec.ts  # Tier 2: Boundary & Corner Cases (≥30 tests)
│       ├── tier3_pairwise_combinations.spec.ts # Tier 3: Pairwise Interactions (≥12 tests)
│       ├── tier4_real_world_scenarios.spec.ts  # Tier 4: Real-World User Flows (≥5 tests)
│       ├── tier5_shared_foundations.spec.ts    # Tier 5: Real-module coverage, wired into runner.js (10 tests)
│       └── tier5_store_stability.spec.ts       # Tier 5 (standalone, not wired into runner.js)
```

---

## 3. The 4-Tier Test Architecture

### Tier 1: Feature Coverage (Unit & Component Specifications)
Assures that each of the 10 core foundational features functions according to its contract:
- **RTL Layout**: `dir="rtl"`, `lang="fa"`, right-aligned text flow, flex direction row-reverse / space-x-reverse, OpenType ligatures `font-feature-settings: "rlig" 1, "calt" 1`.
- **Persian Numerals**: English/Arabic to Persian (`toPersianDigits`), Persian to ASCII (`toEnglishDigits`), bidirectional integrity, null/empty safety.
- **Toman Currency Formatting**: 3-digit comma grouping, Persian numerals in formatted string, optional `تومان` suffix, zero-Toman representation.
- **Theme Switching**: Dual-palette token adherence (Slate-50..900 in Light mode vs Zinc-100..950 in Dark mode), class strategy `.dark`, anti-FOUC script.
- **Glassmorphism**: `backdrop-filter: blur(12px)`, background opacity 85% (`rgba(255,255,255,0.85)` / `rgba(24,24,27,0.85)`), border transparency.
- **Responsive Cards**: `ProductCard` structure, image aspect ratio, discount badge placement, price/unit cluster, add-to-cart action.
- **Skeleton Loader**: Zero Cumulative Layout Shift (CLS = 0) with dimensionally identical placeholder layout and `animate-pulse`.
- **Cart State**: Zustand store operations (`addItem`, `removeItem`, `updateQuantity`, `clearCart`, `getSubtotal`, `getTotalDiscount`, `getPayableTotal`).
- **OTP Validation**: 11-digit Iranian mobile regex `^09\d{9}$`, 120s timer initialization, 5-digit OTP verification, error messaging.
- **Address Selection**: Address list rendering, default address marker, select address update, active address persistence.

*Target Count: ≥ 50 tests (≥ 5 per feature).*

---

### Tier 2: Boundary & Corner Cases
Probes extreme edges, malicious or malformed inputs, and edge invariants:
- **11-Digit Phone Boundaries**: 10 digits (rejected), 11 digits (accepted), 12 digits (rejected), alphanumeric input stripped/rejected, boundary prefixes.
- **Non-09 Prefixes**: 08, 07, landline 021, international `+989` and `00989` normalization and validation.
- **OTP Timer Lifecycles**: 120s initial countdown, tick decrement, resend button disabled while active, resend button enabled at 0s, reset to 120s upon resend.
- **Empty Cart States**: Empty array initialization, subtotal 0, payable total 0, decrementing quantity to 0 removes item, clearCart reset.
- **Zero & Edge Discounts**: 0% discount suppresses badge, sale price == original price yields 0%, 100% free items, sale price > original price handles safely, rounding logic.
- **Persian ZWNJ Slugification**: Zero-Width Non-Joiner (`\u200c` / نیم‌فاصله) replaced with hyphen, multiple consecutive hyphens collapsed, leading/trailing hyphens stripped, empty strings.

*Target Count: ≥ 30 tests (≥ 5 per category).*

---

### Tier 3: Cross-Feature Combinations (Pairwise Interactions)
Verifies emergent behavior when independent subsystems interact:
- **Dark Mode + UniversalModal**: Zinc dark theme applied to modal surface, backdrop opacity, text contrast.
- **Dark Mode + Glassmorphic Header**: Header background shifts to `rgba(24,24,27,0.85)` while maintaining 12px blur.
- **Cart Addition + Floating Badge**: Adding cart item increments count and triggers `@keyframes floating` micro-interaction.
- **OTP Login + User Profile**: Successful authentication populates `UserProfile` and activates `ProfileHero`.
- **Address Selection + Checkout Summary**: Active delivery address ID binds to the order review state.
- **Search Query + Product Card Grid**: Dynamic filtering updates product cards while preserving Toman formatting and discount badges.
- **Festival Rail + Cart Totals**: Adding special festival items applies deals correctly to cart calculations.
- **UniversalModal 580px Adaptive Breakpoint**: Viewport width `< 580px` renders bottom sheet drawer with drag handle; `>= 580px` renders centered dialog.

*Target Count: ≥ 12 tests.*

---

### Tier 4: Real-World Application Scenarios (End-to-End User Flows)
Exercises multi-step user scenarios simulating real browser workflows:
1. **Flow 1: Complete Storefront Purchase Journey**:
   Browse homepage -> search for product -> open product view -> inspect specifications -> add to cart -> check floating navbar badge -> view cart -> verify Toman totals -> trigger checkout.
2. **Flow 2: Visitor Authentication & Address Onboarding**:
   Open profile as guest -> trigger LoginModal -> submit 0912xxxxxxx -> receive OTP -> verify code -> view authenticated profile -> add delivery address.
3. **Flow 3: Theme Toggle & Session Continuity**:
   Toggle dark mode -> add items to cart -> navigate between views -> verify theme (Zinc) and cart state persistence across page transitions.
4. **Flow 4: Persian Search, Filter, Sort & Zero-CLS Transition**:
   Search with Persian characters and ZWNJ -> filter by category -> sort by cheapest/popular -> render product cards -> verify skeleton placeholder sizing prevents layout shifts.
5. **Flow 5: API Failover & Iranian Geo-Restriction Resiliency**:
   Simulate timeout to `api.dijimoon.ir` -> client seamlessly falls back to structured mock data (`src/data/mock-data.ts`) -> no unhandled exceptions or blank screens.

*Target Count: ≥ 5 comprehensive flows.*

---

## 4. Execution Model & CLI Commands

The test runner is designed for zero-config, immediate execution across local dev and CI/CD pipelines.

### Primary Invocation Command:
```bash
node tests/runner.js
```

### Granular Tier Invocations:
```bash
# Run only Tier 1 (Feature Coverage)
node tests/runner.js tier1

# Run only Tier 2 (Boundary & Corner Cases)
node tests/runner.js tier2

# Run only Tier 3 (Pairwise Interactions)
node tests/runner.js tier3

# Run only Tier 4 (Real-World Application Scenarios)
node tests/runner.js tier4
```

### Exit Codes:
- `0`: All tests passed successfully.
- `1`: One or more tests failed.

---

## 5. Maintenance & Extensibility

When adding new features in subsequent milestones:
1. Append new feature assertions into `tests/e2e/tier1_feature_coverage.spec.ts`.
2. Add boundary inputs (null, extreme sizes, malformed strings) into `tests/e2e/tier2_boundary_corner.spec.ts`.
3. Model any cross-component interaction in `tests/e2e/tier3_pairwise_combinations.spec.ts`.
4. Ensure `node tests/runner.js` passes with 0 failures before publishing test status.
5. New store contracts (messages, notifications, orders) should get simulator coverage in `tests/harness.ts` following the existing `CartStoreSimulator` pattern.
6. `tests/e2e/tier5_store_stability.spec.ts` is currently standalone; wire it into `tests/runner.js` before citing tier-5 coverage in release notes.
