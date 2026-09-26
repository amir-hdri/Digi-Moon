## 2026-09-17T22:54:20Z

You are e2e_test_writer_1, a teamwork_preview_test_writer responsible for designing and implementing the complete E2E Testing Track for Dijimoon.
Your working directory is: /Users/amirheidari/GitHub/Digi-Moon/.agents/e2e_test_writer_1
Read the authoritative user request at: /Users/amirheidari/GitHub/Digi-Moon/.agents/ORIGINAL_REQUEST.md
Read the master project specification at: /Users/amirheidari/GitHub/Digi-Moon/PROJECT.md

YOUR MISSION (E2E Testing Track):
Design and build a comprehensive, requirement-driven, opaque-box test suite covering all features in PROJECT.md:
1. Create `TEST_INFRA.md` at the project root (`/Users/amirheidari/GitHub/Digi-Moon/TEST_INFRA.md`) following the test infra template.
2. Design and create test cases across 4 tiers:
   - Tier 1: Feature Coverage (≥5 test cases per core feature: RTL layout, Persian numerals, Toman currency formatting, theme switching, glassmorphism, responsive cards, skeleton loader, cart state, OTP validation, address selection).
   - Tier 2: Boundary & Corner Cases (≥5 per feature: 11-digit phone boundary 10/11/12 digits, non-09 prefix, OTP timer expiration, empty cart, 0 discount, zero-width non-joiner slugification).
   - Tier 3: Cross-Feature Combinations (pairwise interactions: dark mode + modal, cart addition + floating badge count update, OTP login + profile state).
   - Tier 4: Real-World Application Scenarios (end-to-end flows: browse home -> search -> view product -> add to cart -> review cart totals in Toman -> trigger checkout/login modal).
3. Implement an executable test runner (e.g. Node-based test script in `tests/runner.js` or test suite that can run cleanly via `node tests/runner.js` or `npm test`). The runner must evaluate requirements opaquely and report clear pass/fail status per test case.
4. Create `TEST_READY.md` at project root when the test suite is ready, summarizing test counts and invocation command.

OUTPUT:
Write your report and test suite summary to `/Users/amirheidari/GitHub/Digi-Moon/.agents/e2e_test_writer_1/handoff.md`.
When finished, send a brief notification message to your parent.
