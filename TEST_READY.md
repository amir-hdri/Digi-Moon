# Test Suite Readiness Publication: Dijimoon E-Commerce Storefront

> **Publication Status**: `TEST_READY`
> **Date**: 2026-09-26 (re-verified; originally published 2026-09-18T02:46:00+03:30)
> **Author**: `e2e_test_writer_1` (teamwork_preview_test_writer)
> **Test Harness**: Standalone Node.js 20+ Native ESM / TypeScript Runner
> **Pass Rate**: 100% (100 / 100 tests passing, tiers 1-4 via `npm test`)  

---

## 1. Invocation Command

To execute the complete 4-tier opaque requirement test suite:

```bash
node tests/runner.js
```

### Granular Tier Invocations:
```bash
node tests/runner.js tier1   # Tier 1: Feature Coverage (53 tests)
node tests/runner.js tier2   # Tier 2: Boundary & Corner Cases (30 tests)
node tests/runner.js tier3   # Tier 3: Pairwise Combinations (12 tests)
node tests/runner.js tier4   # Tier 4: Real-World Scenarios (5 tests)
```

---

## 2. Test Suite Breakdown & Verification Metrics

| Tier | Category / Scope | Test Cases | Passed | Failed | Pass Rate | Duration |
|:-----|:-----------------|:-----------|:-------|:-------|:----------|:---------|
| **Tier 1** | **Feature Coverage** (RTL, Persian numerals, Toman, theme, glassmorphism, cards, skeleton, cart, OTP, address) | 53 | 53 | 0 | 100% | ~5 ms |
| **Tier 2** | **Boundary & Corner Cases** (10/11/12 phone boundaries, non-09 prefixes, OTP timer, empty cart, 0 discount, ZWNJ slug) | 30 | 30 | 0 | 100% | ~6 ms |
| **Tier 3** | **Cross-Feature Combinations** (Dark mode + modal, cart + floating badge, OTP + profile, search + cards, festival + cart, 580px adaptive) | 12 | 12 | 0 | 100% | ~5 ms |
| **Tier 4** | **Real-World Scenarios** (Browse-to-checkout flow, visitor auth & address setup, session theme continuity, search & sort, failover resiliency) | 5 | 5 | 0 | 100% | ~4 ms |
| **TOTAL** | **Full Storefront Specification Coverage** | **100** | **100** | **0** | **100%** | **~20 ms** |

---

## 3. Test Artifacts Index

All test code and fixtures are organized in strict compliance with the code layout defined in `PROJECT.md`:

1. **Test Infrastructure Specification**:
   - `TEST_INFRA.md` — Complete architectural document, testing pillars, execution model, and oracle baseline derivations.
2. **Unified Runner**:
   - `tests/runner.js` — Executable runner with terminal ANSI formatting, tier headers, assertions reporter, and process exit codes (0 for pass, 1 for fail).
3. **Execution Harness & Store Simulators**:
   - `tests/harness.ts` — Opaque assertion engine (`expect`), dynamic module loader, and Zustand 5 state contract validators (`CartStoreSimulator`, `ThemeStoreSimulator`, `AuthStoreSimulator`).
4. **Authoritative Fixtures**:
   - `tests/fixtures/catalog.fixture.ts` — Domain product, category, and festival fixture dataset.
   - `tests/fixtures/user-session.fixture.ts` — User profile, delivery address, and phone number validation datasets.
5. **Specification Suites**:
   - `tests/e2e/tier1_feature_coverage.spec.ts` (53 tests)
   - `tests/e2e/tier2_boundary_corner.spec.ts` (30 tests)
   - `tests/e2e/tier3_pairwise_combinations.spec.ts` (12 tests)
   - `tests/e2e/tier4_real_world_scenarios.spec.ts` (5 tests)

---

## 4. Oracle Ground Truth & Expected Output Derivation

All expected values in this test suite are strictly grounded in:
1. `PROJECT.md` interface contracts and feature specifications.
2. `COMPREHENSIVE_REPORT.md` reverse-engineering data (Iranian national network VPN challenge, REST API contracts, 580px dialog breakpoint).
3. `design-system/tokens.json` & `design-system/tailwind-theme.css` (Emerald, Green, Teal, Orange, Slate, Zinc palettes, `backdrop-filter: blur(12px)`, `@keyframes floating`).
4. `design-system/lib/persian.ts` & `design-system/components/` (OpenType ligatures, `formatToman`, `toPersianDigits`, `toEnglishDigits`, zero-CLS skeleton layout).

---

## 5. Milestone 5 (M5) Verification Handshake

This test suite is published and ready for Phase 1 execution of **Milestone 5 (Final E2E Test Pass & Hardening)**. Implementing agents can continuously verify milestone outputs against this suite at any time using `node tests/runner.js` (or `npm test` / `npm run verify` for the full typecheck + lint + test + build chain).

## 6. Notes (2026-09-26 re-verification)

- `tests/e2e/tier5_store_stability.spec.ts` exists but is **not** wired into `tests/runner.js`; the 100/100 figure covers tiers 1-4 only.
- `tests/m1_challenger_verification.mjs` is a legacy M1 data oracle: it passes 17/28 checks against the current FMCG dataset. The remaining failures are stale expectations from the original electronics catalog (e.g. `smartphones` categories, 10 festival items, 2 addresses, 3 orders, 4 favorites) plus FMCG products lacking the old `specs`/`colors` richness — not regressions in the current app. Do not treat it as a release gate without updating its oracles.
