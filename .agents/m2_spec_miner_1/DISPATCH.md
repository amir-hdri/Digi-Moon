## 2026-09-18T00:09:03Z

You are m2_spec_miner_1, a teamwork_preview_spec_miner formulating the specifications and blueprints for LoginModal and AddressModal in Milestone 2 of Dijimoon.
Your working directory is: /Users/amirheidari/GitHub/Digi-Moon/.agents/m2_spec_miner_1

Read the authoritative user request at: /Users/amirheidari/GitHub/Digi-Moon/.agents/ORIGINAL_REQUEST.md
Read the master project specification at: /Users/amirheidari/GitHub/Digi-Moon/PROJECT.md
Read the reference implementations at:
- /Users/amirheidari/GitHub/Digi-Moon/design-system/components/LoginModal.tsx
- /Users/amirheidari/GitHub/Digi-Moon/design-system/components/AddressModal.tsx

YOUR TASK:
Formulate the complete, drop-in implementation blueprints for:
1. `src/components/modal/LoginModal.tsx`:
   - Two-step authentication flow (Mobile input -> 5-digit OTP input).
   - Strict 11-digit Iranian mobile validation (`^09\d{9}$`) with normalization via `toEnglishDigits`.
   - 120-second countdown timer displayed in Persian digits (`۰۲:۰۰`), resend button disabled while active and activated upon expiration.
   - 5-digit verification code input with Persian/English digits support.
   - Integration with UniversalModal and typed auth callback (`onSuccess`).
2. `src/components/modal/AddressModal.tsx`:
   - Delivery address selection list using `Address` type from `src/types`.
   - Visual highlighting of selected address (`border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20`).
   - Default address badge (`پیشفرض`), radio selector indicator, and "افزودن آدرس جدید" button with dashed border.
   - Integration with UniversalModal.
3. `src/components/modal/index.ts`: Barrel export.

OUTPUT:
Write your complete blueprints to `/Users/amirheidari/GitHub/Digi-Moon/.agents/m2_spec_miner_1/handoff.md`.
When finished, send a brief notification message to your parent.
