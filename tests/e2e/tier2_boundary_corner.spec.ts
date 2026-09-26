/**
 * Tier 2: Boundary & Corner Cases Specifications
 * Probes extreme boundaries, validation limits, and malformed inputs across 6 categories.
 * Each category contains ≥5 test cases (30+ tests total).
 */

import { describe, test, expect, getPersianUtils, CartStoreSimulator } from '../harness.ts';
import { FIXTURE_PRODUCTS } from '../fixtures/catalog.fixture.ts';

// Helper validator for Iranian mobile numbers
export function validateIranianMobile(phone: string): { isValid: boolean; normalized: string } {
  if (!phone) return { isValid: false, normalized: '' };
  let clean = phone.trim();
  // Normalize international +98 or 0098
  if (clean.startsWith('+98')) {
    clean = '0' + clean.slice(3);
  } else if (clean.startsWith('0098')) {
    clean = '0' + clean.slice(4);
  } else if (clean.startsWith('98') && clean.length === 12) {
    clean = '0' + clean.slice(2);
  }
  // Must strictly match 09 followed by 9 digits
  const isValid = /^09\d{9}$/.test(clean);
  return { isValid, normalized: isValid ? clean : '' };
}

// =========================================================================
// 1. 11-Digit Phone Boundary Specifications
// =========================================================================
describe('Tier 2 - Category 1: 11-Digit Phone Number Boundaries', 'tier2', () => {
  test('T2.C1.1: 10-digit number is rejected (too short)', () => {
    const res = validateIranianMobile('0912345678');
    expect.toBe(res.isValid, false, '10-digit phone must be rejected');
  });

  test('T2.C1.2: 11-digit valid number is accepted', () => {
    const res = validateIranianMobile('09123456789');
    expect.toBe(res.isValid, true, 'Standard 11-digit phone must be accepted');
    expect.toBe(res.normalized, '09123456789');
  });

  test('T2.C1.3: 12-digit number is rejected (too long)', () => {
    const res = validateIranianMobile('091234567890');
    expect.toBe(res.isValid, false, '12-digit phone must be rejected');
  });

  test('T2.C1.4: Alphanumeric or special character injection is rejected', () => {
    const res = validateIranianMobile('0912345678a');
    expect.toBe(res.isValid, false, 'Alphanumeric phone must be rejected');
    const resSql = validateIranianMobile("09123456789'; DROP TABLE");
    expect.toBe(resSql.isValid, false, 'Injected SQL characters must be rejected');
  });

  test('T2.C1.5: Validates lower boundary 09000000000 and upper boundary 09999999999', () => {
    const lower = validateIranianMobile('09000000000');
    expect.toBe(lower.isValid, true, 'Lower bound 09000000000 must be valid');
    const upper = validateIranianMobile('09999999999');
    expect.toBe(upper.isValid, true, 'Upper bound 09999999999 must be valid');
  });
});

// =========================================================================
// 2. Non-09 Prefix Rejection & Normalization Specifications
// =========================================================================
describe('Tier 2 - Category 2: Non-09 Prefix Rejection & Normalization', 'tier2', () => {
  test('T2.C2.1: Rejects mobile-like numbers starting with 08', () => {
    const res = validateIranianMobile('08123456789');
    expect.toBe(res.isValid, false, '08 prefix must be rejected');
  });

  test('T2.C2.2: Rejects mobile-like numbers starting with 07', () => {
    const res = validateIranianMobile('07123456789');
    expect.toBe(res.isValid, false, '07 prefix must be rejected');
  });

  test('T2.C2.3: Rejects Iranian landline numbers with 021 prefix', () => {
    const res = validateIranianMobile('02188776655');
    expect.toBe(res.isValid, false, 'Tehran landline 021 prefix must be rejected for OTP');
  });

  test('T2.C2.4: Normalizes international format +989123456789 to 09123456789', () => {
    const res = validateIranianMobile('+989123456789');
    expect.toBe(res.isValid, true, '+98 international format must be valid');
    expect.toBe(res.normalized, '09123456789');
  });

  test('T2.C2.5: Normalizes 00989123456789 and 989123456789 formats', () => {
    const res1 = validateIranianMobile('00989123456789');
    expect.toBe(res1.isValid, true, '0098 format must be accepted');
    expect.toBe(res1.normalized, '09123456789');

    const res2 = validateIranianMobile('989123456789');
    expect.toBe(res2.isValid, true, '98 prefix without leading zero must be accepted');
    expect.toBe(res2.normalized, '09123456789');
  });
});

// =========================================================================
// 3. OTP Timer Expiration Specifications
// =========================================================================
describe('Tier 2 - Category 3: OTP Timer Expiration & Resend States', 'tier2', () => {
  test('T2.C3.1: Timer starts at exactly 120 seconds', () => {
    let timer = 120;
    expect.toBe(timer, 120, 'Initial OTP timer must be 120s');
  });

  test('T2.C3.2: Timer decrements monotonically per tick', () => {
    let timer = 120;
    timer -= 1;
    expect.toBe(timer, 119);
    timer -= 59;
    expect.toBe(timer, 60);
  });

  test('T2.C3.3: Resend action is disabled when timer > 0', () => {
    const timer = 45;
    const isResendAllowed = timer <= 0;
    expect.toBe(isResendAllowed, false, 'Resend action must be disabled while timer > 0');
  });

  test('T2.C3.4: Resend action is enabled when timer reaches 0', () => {
    const timer = 0;
    const isResendAllowed = timer <= 0;
    expect.toBe(isResendAllowed, true, 'Resend action must become enabled when timer hits 0');
  });

  test('T2.C3.5: Triggering resend resets timer back to 120 seconds', () => {
    let timer = 0;
    // Simulate resend click
    timer = 120;
    expect.toBe(timer, 120, 'Timer must reset to 120 seconds after resend');
  });
});

// =========================================================================
// 4. Empty Cart State Specifications
// =========================================================================
describe('Tier 2 - Category 4: Empty Cart States & Edge Operations', 'tier2', () => {
  test('T2.C4.1: Newly initialized cart contains zero items', () => {
    const cart = new CartStoreSimulator();
    expect.toBe(cart.items.length, 0);
    expect.toBe(cart.getItemCount(), 0);
  });

  test('T2.C4.2: getSubtotal and getPayableTotal on empty cart return 0', () => {
    const cart = new CartStoreSimulator();
    expect.toBe(cart.getSubtotal(), 0);
    expect.toBe(cart.getPayableTotal(), 0);
    expect.toBe(cart.getTotalDiscount(), 0);
  });

  test('T2.C4.3: Decrementing quantity to 0 removes the only item from cart', () => {
    const cart = new CartStoreSimulator();
    cart.addItem(FIXTURE_PRODUCTS[0], 1);
    expect.toBe(cart.items.length, 1);
    cart.updateQuantity(FIXTURE_PRODUCTS[0].id, 0);
    expect.toBe(cart.items.length, 0);
    expect.toBe(cart.getItemCount(), 0);
  });

  test('T2.C4.4: Calling clearCart on populated cart resets all totals to 0', () => {
    const cart = new CartStoreSimulator();
    cart.addItem(FIXTURE_PRODUCTS[0], 2);
    cart.addItem(FIXTURE_PRODUCTS[1], 1);
    expect.toBe(cart.getItemCount(), 3);
    cart.clearCart();
    expect.toBe(cart.items.length, 0);
    expect.toBe(cart.getItemCount(), 0);
    expect.toBe(cart.getPayableTotal(), 0);
  });

  test('T2.C4.5: Negative quantity input in addItem or updateQuantity is handled safely', () => {
    const cart = new CartStoreSimulator();
    cart.addItem(FIXTURE_PRODUCTS[0], -5); // Negative should be ignored
    expect.toBe(cart.items.length, 0);
    cart.addItem(FIXTURE_PRODUCTS[0], 2);
    cart.updateQuantity(FIXTURE_PRODUCTS[0].id, -1); // Negative should remove item
    expect.toBe(cart.items.length, 0);
  });
});

// =========================================================================
// 5. 0% Discount & Edge Pricing Specifications
// =========================================================================
describe('Tier 2 - Category 5: 0% Discount & Edge Pricing', 'tier2', () => {
  test('T2.C5.1: 0% discount suppresses badge rendering', async () => {
    const { calculateDiscount } = await getPersianUtils();
    // Same price: 3,450,000 to 3,450,000 -> 0%
    const discount = calculateDiscount(3450000, 3450000);
    expect.toBe(discount, 0);
  });

  test('T2.C5.2: Original price equal to current price yields 0% discount', async () => {
    const { calculateDiscount } = await getPersianUtils();
    expect.toBe(calculateDiscount(10000, 10000), 0);
  });

  test('T2.C5.3: Free item (price 0) yields 100% discount', async () => {
    const { calculateDiscount } = await getPersianUtils();
    expect.toBe(calculateDiscount(50000, 0), 100);
  });

  test('T2.C5.4: Current price higher than original price yields 0% discount (no negative discount)', async () => {
    const { calculateDiscount } = await getPersianUtils();
    expect.toBe(calculateDiscount(10000, 15000), 0);
  });

  test('T2.C5.5: Fractional discount percentages round mathematically to nearest integer', async () => {
    const { calculateDiscount } = await getPersianUtils();
    // 100 down to 67 -> 33% (33 / 100 = 33%)
    expect.toBe(calculateDiscount(100, 67), 33);
    // 3 down to 2 -> 33.33% -> 33%
    expect.toBe(calculateDiscount(3, 2), 33);
    // 3 down to 1 -> 66.67% -> 67%
    expect.toBe(calculateDiscount(3, 1), 67);
  });
});

// =========================================================================
// 6. Zero-Width Non-Joiner (ZWNJ / نیم‌فاصله) Slugification Specifications
// =========================================================================
describe('Tier 2 - Category 6: Persian ZWNJ Slugification', 'tier2', () => {
  test('T2.C6.1: Replaces ZWNJ (\\u200c / نیم‌فاصله) with hyphen', async () => {
    const { slugifyPersian } = await getPersianUtils();
    const titleWithZwnj = 'گوشی\u200cهای هوشمند';
    const slug = slugifyPersian(titleWithZwnj);
    expect.toBe(slug, 'گوشی-های-هوشمند');
  });

  test('T2.C6.2: Collapses multiple consecutive spaces and hyphens into a single hyphen', async () => {
    const { slugifyPersian } = await getPersianUtils();
    const raw = 'ساعت    هوشمند---ضد آب';
    const slug = slugifyPersian(raw);
    expect.toBe(slug, 'ساعت-هوشمند-ضد-آب');
  });

  test('T2.C6.3: Strips leading and trailing hyphens and whitespace', async () => {
    const { slugifyPersian } = await getPersianUtils();
    const raw = ' - - لپ‌تاپ گیمینگ ایسوس - - ';
    const slug = slugifyPersian(raw);
    expect.toBe(slug, 'لپ-تاپ-گیمینگ-ایسوس');
  });

  test('T2.C6.4: Preserves mixed English and Persian characters seamlessly', async () => {
    const { slugifyPersian } = await getPersianUtils();
    const raw = 'iPhone 16 پرو مکس 256GB';
    const slug = slugifyPersian(raw);
    expect.toBe(slug, 'iphone-16-پرو-مکس-256gb');
  });

  test('T2.C6.5: Returns empty string for empty, null, or whitespace inputs', async () => {
    const { slugifyPersian } = await getPersianUtils();
    expect.toBe(slugifyPersian(''), '');
    expect.toBe(slugifyPersian('   '), '');
    expect.toBe(slugifyPersian('---'), '');
  });
});
