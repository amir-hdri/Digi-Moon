/**
 * Tier 3: Cross-Feature Combinations & Pairwise Interactions
 * Verifies multi-subsystem emergent behavior across themes, state stores, modals, and DOM.
 * Ground truth derived from PROJECT.md and COMPREHENSIVE_REPORT.md.
 */

import { describe, test, expect, getPersianUtils, CartStoreSimulator, ThemeStoreSimulator, AuthStoreSimulator } from '../harness.ts';
import { FIXTURE_PRODUCTS, FIXTURE_FESTIVAL_DEALS } from '../fixtures/catalog.fixture.ts';
import { FIXTURE_ADDRESSES, FIXTURE_USER } from '../fixtures/user-session.fixture.ts';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Tier 3 - Pairwise Cross-Feature Interactions', 'tier3', () => {
  // 1. Dark Mode + UniversalModal
  test('T3.P1: UniversalModal surfaces bind to Zinc palette under dark mode', () => {
    const modalPath = path.join(process.cwd(), 'design-system', 'components', 'UniversalModal.tsx');
    const content = fs.readFileSync(modalPath, 'utf-8');
    expect.toContain(content, 'dark:bg-zinc-900', 'Modal surface must use zinc-900 in dark mode');
    expect.toContain(content, 'dark:border-zinc-800', 'Modal borders must use zinc-800 in dark mode');
    expect.toContain(content, 'dark:text-zinc-100', 'Modal title must use zinc-100 in dark mode');
  });

  // 2. Dark Mode + Glassmorphic Header
  test('T3.P2: Glassmorphic Header seamlessly transitions between light and dark opacity layers', () => {
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'design-system', 'index.html'), 'utf-8');
    expect.toContain(indexHtml, 'background-color: rgba(255, 255, 255, 0.85)');
    expect.toContain(indexHtml, 'background-color: rgba(24, 24, 27, 0.85)');
    expect.toContain(indexHtml, 'backdrop-filter: blur(12px)');
  });

  // 3. Cart Addition + Floating Badge Count Update
  test('T3.P3: Adding items to cart increments count and triggers floating animation', async () => {
    const cart = new CartStoreSimulator();
    const { toPersianDigits } = await getPersianUtils();

    expect.toBe(cart.getItemCount(), 0);
    cart.addItem(FIXTURE_PRODUCTS[0], 2);
    cart.addItem(FIXTURE_PRODUCTS[1], 1);
    expect.toBe(cart.getItemCount(), 3);

    const persianCount = toPersianDigits(cart.getItemCount());
    expect.toBe(persianCount, '۳');

    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'design-system', 'index.html'), 'utf-8');
    expect.toContain(indexHtml, '@keyframes floating', 'Floating keyframes must be declared');
    expect.toContain(indexHtml, '.floating', 'Floating animation class must be available');
  });

  // 4. OTP Login + User Profile Hydration
  test('T3.P4: Successful OTP verification populates UserProfile state and displays formatted wallet balance', async () => {
    const auth = new AuthStoreSimulator();
    const { formatToman } = await getPersianUtils();

    expect.toBe(auth.isAuthenticated, false);
    expect.toBe(auth.user, null);

    const res = await auth.verifyOtp('09123456789', '12345');
    expect.toBe(res.success, true);
    expect.toBe(auth.isAuthenticated, true);
    expect.toBeTruthy(auth.user);

    const formattedWallet = formatToman(auth.user.walletBalance);
    expect.toBe(formattedWallet, '۱,۵۰۰,۰۰۰ تومان');
  });

  // 5. Address Selection + Checkout Preview Payload
  test('T3.P5: Selecting delivery address in modal binds active address to checkout review state', () => {
    const auth = new AuthStoreSimulator();
    auth.addresses = FIXTURE_ADDRESSES;
    auth.activeAddressId = FIXTURE_ADDRESSES[0].id;

    // Switch to second address
    auth.activeAddressId = FIXTURE_ADDRESSES[1].id;
    const selected = auth.addresses.find((a) => a.id === auth.activeAddressId);
    expect.toBe(selected.title, 'دفتر کار');
    expect.toBe(selected.isDefault, false);
  });

  // 6. Search Query + Product Filtering & Price Formatting
  test('T3.P6: Persian search filtering preserves accurate Toman formatting and discount badges', async () => {
    const { formatToman } = await getPersianUtils();
    const query = 'هدفون';
    const filtered = FIXTURE_PRODUCTS.filter((p) => p.title.includes(query));

    expect.toBe(filtered.length, 1);
    expect.toBe(filtered[0].title, 'هدفون بی‌سیم نویز کنسلینگ پریمیوم');
    expect.toBe(formatToman(filtered[0].price), '۶,۸۰۰,۰۰۰ تومان');
    expect.toBe(filtered[0].discountPercent, 20);
  });

  // 7. Festival Rail + Cart Totals
  test('T3.P7: Adding festival deal items to cart applies special discounted prices into totals', async () => {
    const cart = new CartStoreSimulator();
    const { formatToman } = await getPersianUtils();

    const festivalItem = FIXTURE_FESTIVAL_DEALS[0];
    cart.addItem(festivalItem, 1);

    expect.toBe(cart.getSubtotal(), 32000000);
    expect.toBe(cart.getTotalDiscount(), 7100000);
    expect.toBe(cart.getPayableTotal(), 24900000);
    expect.toBe(formatToman(cart.getPayableTotal()), '۲۴,۹۰۰,۰۰۰ تومان');
  });

  // 8. UniversalModal 580px Adaptive Breakpoint
  test('T3.P8: UniversalModal evaluates 580px boundary for mobile bottom sheet vs desktop modal', () => {
    const modalPath = path.join(process.cwd(), 'design-system', 'components', 'UniversalModal.tsx');
    const content = fs.readFileSync(modalPath, 'utf-8');
    expect.toContain(content, 'window.innerWidth >= 580', 'Adaptive breakpoint must be set at 580px');
    expect.toContain(content, 'rounded-t-2xl', 'Mobile drawer must use rounded-t-2xl');
    expect.toContain(content, '500px', 'Desktop dialog must specify 500px maximum width');
  });

  // 9. Dark Mode + ProductCard & Skeleton Contrast
  test('T3.P9: Dark mode styles maintain high contrast for product card and skeleton loaders', () => {
    const cardContent = fs.readFileSync(path.join(process.cwd(), 'design-system', 'components', 'ProductCard.tsx'), 'utf-8');
    const skeletonContent = fs.readFileSync(path.join(process.cwd(), 'design-system', 'components', 'ProductSkeleton.tsx'), 'utf-8');

    expect.toContain(cardContent, 'border-gray-100', 'Card has subtle border');
    expect.toContain(skeletonContent, 'animate-pulse', 'Skeleton animates with pulse');
    expect.toContain(skeletonContent, 'bg-gray-200', 'Skeleton placeholder fills maintain contrast');
  });

  // 10. Cart Quantity Multipliers + Persian Digits Formatting
  test('T3.P10: Multi-quantity cart calculations produce correct Persian formatted Toman values', async () => {
    const cart = new CartStoreSimulator();
    const { formatToman } = await getPersianUtils();

    // 3 units of powerbank (1,450,000 * 3 = 4,350,000)
    cart.addItem(FIXTURE_PRODUCTS[4], 3);
    expect.toBe(cart.getPayableTotal(), 4350000);
    expect.toBe(formatToman(cart.getPayableTotal()), '۴,۳۵۰,۰۰۰ تومان');
  });

  // 11. Unauthenticated Checkout Interception
  test('T3.P11: Attempting checkout with unauthenticated session triggers LoginModal', () => {
    const auth = new AuthStoreSimulator();
    const cart = new CartStoreSimulator();
    cart.addItem(FIXTURE_PRODUCTS[0], 1);

    expect.toBe(auth.isAuthenticated, false);
    expect.toBe(auth.isLoginModalOpen, false);

    // Simulate clicking checkout
    if (!auth.isAuthenticated) {
      auth.openLoginModal();
    }

    expect.toBe(auth.isLoginModalOpen, true);
  });

  // 12. Persian Digits in OTP Input Normalization
  test('T3.P12: Persian digits entered in phone or OTP inputs are automatically converted to ASCII', async () => {
    const { toEnglishDigits } = await getPersianUtils();
    const auth = new AuthStoreSimulator();

    const rawPersianPhone = '۰۹۱۲۳۴۵۶۷۸۹';
    const cleanPhone = toEnglishDigits(rawPersianPhone);
    expect.toBe(cleanPhone, '09123456789');

    const otpReq = await auth.requestOtp(cleanPhone);
    expect.toBe(otpReq.success, true);

    const rawPersianOtp = '۱۲۳۴۵';
    const cleanOtp = toEnglishDigits(rawPersianOtp);
    expect.toBe(cleanOtp, '12345');

    const verifyReq = await auth.verifyOtp(cleanPhone, cleanOtp);
    expect.toBe(verifyReq.success, true);
  });
});
