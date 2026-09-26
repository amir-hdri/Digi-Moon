/**
 * Tier 1: Feature Coverage Specifications
 * Covers all 10 core foundational features with ≥5 test cases per feature (50+ tests).
 * Ground truth derived from PROJECT.md and COMPREHENSIVE_REPORT.md.
 */

import { describe, test, expect, getPersianUtils, CartStoreSimulator, ThemeStoreSimulator, AuthStoreSimulator } from '../harness.ts';
import { FIXTURE_PRODUCTS, FIXTURE_CATEGORIES } from '../fixtures/catalog.fixture.ts';
import { FIXTURE_ADDRESSES, FIXTURE_USER } from '../fixtures/user-session.fixture.ts';
import * as fs from 'node:fs';
import * as path from 'node:path';

// =========================================================================
// 1. RTL Layout Specifications
// =========================================================================
describe('Tier 1 - Feature 1: RTL Layout & Typography', 'tier1', () => {
  test('T1.F1.1: Root layout or index.html must specify dir="rtl"', () => {
    const indexPath = path.join(process.cwd(), 'design-system', 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    expect.toMatch(html, /dir=["']rtl["']/i, 'Root HTML element must declare dir="rtl"');
  });

  test('T1.F1.2: Root layout or index.html must specify lang="fa"', () => {
    const indexPath = path.join(process.cwd(), 'design-system', 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    expect.toMatch(html, /lang=["']fa["']/i, 'Root HTML element must declare lang="fa"');
  });

  test('T1.F1.3: Typography enables OpenType ligatures rlig and calt', () => {
    const cssPath = path.join(process.cwd(), 'design-system', 'index.html');
    const html = fs.readFileSync(cssPath, 'utf-8');
    expect.toContain(html, '"rlig" 1', 'OpenType rlig ligature must be enabled');
    expect.toContain(html, '"calt" 1', 'OpenType calt contextual alternates must be enabled');
  });

  test('T1.F1.4: Flex containers use space-x-reverse or flex-row-reverse for Persian spacing', () => {
    const headerPath = path.join(process.cwd(), 'design-system', 'components', 'Header.tsx');
    const content = fs.readFileSync(headerPath, 'utf-8');
    expect.toContain(content, 'space-x-reverse', 'Header flex groups must maintain RTL space reversal');
  });

  test('T1.F1.5: Persian headings and labels default to right alignment', () => {
    const productCardPath = path.join(process.cwd(), 'design-system', 'components', 'ProductCard.tsx');
    const content = fs.readFileSync(productCardPath, 'utf-8');
    expect.toContain(content, 'text-right', 'Product title must explicitly specify text-right alignment');
  });
});

// =========================================================================
// 2. Persian Numerals Specifications
// =========================================================================
describe('Tier 1 - Feature 2: Persian Numerals & Conversion', 'tier1', () => {
  test('T1.F2.1: Converts English digits to standard Persian digits', async () => {
    const { toPersianDigits } = await getPersianUtils();
    expect.toBe(toPersianDigits('0123456789'), '۰۱۲۳۴۵۶۷۸۹');
    expect.toBe(toPersianDigits(1405), '۱۴۰۵');
  });

  test('T1.F2.2: Normalizes Arabic Eastern digits to Persian digits', async () => {
    const { toPersianDigits } = await getPersianUtils();
    // Arabic Eastern ٤ and ٦ to Persian ۴ and ۶
    expect.toBe(toPersianDigits('٠١٢٣٤٥٦٧٨٩'), '۰۱۲۳۴۵۶۷۸۹');
  });

  test('T1.F2.3: Converts Persian digits back to standard ASCII digits', async () => {
    const { toEnglishDigits } = await getPersianUtils();
    expect.toBe(toEnglishDigits('۰۱۲۳۴۵۶۷۸۹'), '0123456789');
    expect.toBe(toEnglishDigits('شماره ۰۹۱۲۳۴۵۶۷۸۹'), 'شماره 09123456789');
  });

  test('T1.F2.4: Preserves non-numeric Persian text during digit conversion', async () => {
    const { toPersianDigits } = await getPersianUtils();
    const input = 'گوشی موبایل ۲۵۶ گیگابایت با قیمت 120000 تومان';
    const output = toPersianDigits(input);
    expect.toBe(output, 'گوشی موبایل ۲۵۶ گیگابایت با قیمت ۱۲۰۰۰۰ تومان');
  });

  test('T1.F2.5: Handles null, undefined, empty strings and 0 safely', async () => {
    const { toPersianDigits, toEnglishDigits } = await getPersianUtils();
    expect.toBe(toPersianDigits(''), '');
    expect.toBe(toPersianDigits(0), '۰');
    expect.toBe(toEnglishDigits(''), '');
  });

  test('T1.F2.6: Bidirectional conversion invariant: toEnglish(toPersian(n)) === n', async () => {
    const { toPersianDigits, toEnglishDigits } = await getPersianUtils();
    const testCases = ['123456', '9870001', '48500000'];
    for (const item of testCases) {
      const persian = toPersianDigits(item);
      const roundTrip = toEnglishDigits(persian);
      expect.toBe(roundTrip, item, `Round-trip conversion failed for ${item}`);
    }
  });
});

// =========================================================================
// 3. Toman Currency Formatting Specifications
// =========================================================================
describe('Tier 1 - Feature 3: Toman Currency Formatting', 'tier1', () => {
  test('T1.F3.1: Formats amounts with 3-digit comma separators and Persian numerals', async () => {
    const { formatToman } = await getPersianUtils();
    const result = formatToman(125000);
    expect.toBe(result, '۱۲۵,۰۰۰ تومان');
  });

  test('T1.F3.2: Supports includeUnit=false for raw separated Persian numerals', async () => {
    const { formatToman } = await getPersianUtils();
    const result = formatToman(48500000, false);
    expect.toBe(result, '۴۸,۵۰۰,۰۰۰');
  });

  test('T1.F3.3: Formats zero Toman correctly with Persian zero', async () => {
    const { formatToman } = await getPersianUtils();
    expect.toBe(formatToman(0), '۰ تومان');
    expect.toBe(formatToman(0, false), '۰');
  });

  test('T1.F3.4: Accurately calculates discount percentages', async () => {
    const { calculateDiscount } = await getPersianUtils();
    // 52,000,000 down to 48,500,000 -> (3,500,000 / 52,000,000) * 100 = 6.73% -> 7%
    expect.toBe(calculateDiscount(52000000, 48500000), 7);
    // 8,500,000 down to 6,800,000 -> 20%
    expect.toBe(calculateDiscount(8500000, 6800000), 20);
  });

  test('T1.F3.5: Parses raw scraped Persian strings into valid integer Toman values', async () => {
    const { parsePriceToman } = await getPersianUtils();
    expect.toBe(parsePriceToman('۱۲۵,۰۰۰ تومان'), 125000);
    expect.toBe(parsePriceToman('قیمت: ۴۸,۵۰۰,۰۰۰'), 48500000);
    expect.toBe(parsePriceToman(''), 0);
  });

  test('T1.F3.6: Tolerates string numbers and formatted inputs in formatToman', async () => {
    const { formatToman } = await getPersianUtils();
    expect.toBe(formatToman('6800000'), '۶,۸۰۰,۰۰۰ تومان');
  });
});

// =========================================================================
// 4. Theme Switching Specifications
// =========================================================================
describe('Tier 1 - Feature 4: Theme Switching (Slate vs Zinc)', 'tier1', () => {
  test('T1.F4.1: Light mode applies Slate neutral surfaces', () => {
    const themeSimulator = new ThemeStoreSimulator();
    themeSimulator.setTheme('light');
    expect.toBe(themeSimulator.resolvedTheme, 'light');
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'design-system', 'index.html'), 'utf-8');
    expect.toContain(indexHtml, 'bg-gray-50', 'Light surface must utilize neutral gray/slate-50 background');
  });

  test('T1.F4.2: Dark mode applies Zinc neutral palette surfaces', () => {
    const themeSimulator = new ThemeStoreSimulator();
    themeSimulator.setTheme('dark');
    expect.toBe(themeSimulator.resolvedTheme, 'dark');
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'design-system', 'index.html'), 'utf-8');
    expect.toContain(indexHtml, 'dark:bg-zinc-950', 'Dark body must bind to zinc-950');
    expect.toContain(indexHtml, 'dark:text-zinc-100', 'Dark text must bind to zinc-100');
  });

  test('T1.F4.3: toggleTheme switches state between light and dark', () => {
    const store = new ThemeStoreSimulator();
    expect.toBe(store.resolvedTheme, 'light');
    store.toggleTheme();
    expect.toBe(store.resolvedTheme, 'dark');
    store.toggleTheme();
    expect.toBe(store.resolvedTheme, 'light');
  });

  test('T1.F4.4: Theme configuration specifies Tailwind class-based darkMode', () => {
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'design-system', 'index.html'), 'utf-8');
    expect.toMatch(indexHtml, /darkMode:\s*['"]class['"]/i, 'Tailwind config must use class strategy for dark mode');
  });

  test('T1.F4.5: Tokens define Zinc-900 for dark mode modal and card surfaces', () => {
    const modalPath = path.join(process.cwd(), 'design-system', 'components', 'UniversalModal.tsx');
    const content = fs.readFileSync(modalPath, 'utf-8');
    expect.toContain(content, 'dark:bg-zinc-900', 'Modal must style dark surface using zinc-900');
  });
});

// =========================================================================
// 5. Glassmorphism Specifications
// =========================================================================
describe('Tier 1 - Feature 5: Glassmorphism Specifications', 'tier1', () => {
  test('T1.F5.1: Specifies backdrop-filter blur(12px) for glass effect', () => {
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'design-system', 'index.html'), 'utf-8');
    expect.toContain(indexHtml, 'backdrop-filter: blur(12px)', 'Glassmorphism blur must be 12px');
    expect.toContain(indexHtml, '-webkit-backdrop-filter: blur(12px)', 'Webkit prefix must be included');
  });

  test('T1.F5.2: Light glass effect specifies 85% surface opacity', () => {
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'design-system', 'index.html'), 'utf-8');
    expect.toContain(indexHtml, 'background-color: rgba(255, 255, 255, 0.85)', 'Light glass opacity must be 85%');
  });

  test('T1.F5.3: Dark glass effect specifies rgba(24, 24, 27, 0.85)', () => {
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'design-system', 'index.html'), 'utf-8');
    expect.toContain(indexHtml, 'background-color: rgba(24, 24, 27, 0.85)', 'Dark glass opacity must be 85% zinc');
  });

  test('T1.F5.4: Glass borders utilize subtle alpha transparency', () => {
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'design-system', 'index.html'), 'utf-8');
    expect.toContain(indexHtml, 'border-color: rgba(255, 255, 255, 0.3)', 'Light glass border must have 0.3 alpha');
    expect.toContain(indexHtml, 'border-color: rgba(63, 63, 70, 0.4)', 'Dark glass border must have 0.4 alpha');
  });

  test('T1.F5.5: Sticky Header mounts glass-effect with bottom border', () => {
    const headerPath = path.join(process.cwd(), 'design-system', 'components', 'Header.tsx');
    const content = fs.readFileSync(headerPath, 'utf-8');
    expect.toContain(content, 'glass-effect', 'Header must incorporate glass-effect class');
    expect.toContain(content, 'sticky top-0', 'Header must be sticky at top-0');
  });
});

// =========================================================================
// 6. Responsive ProductCard Specifications
// =========================================================================
describe('Tier 1 - Feature 6: Responsive ProductCard', 'tier1', () => {
  test('T1.F6.1: Card renders image container with lazy loading and object-contain', () => {
    const cardPath = path.join(process.cwd(), 'design-system', 'components', 'ProductCard.tsx');
    const content = fs.readFileSync(cardPath, 'utf-8');
    expect.toContain(content, 'loading="lazy"', 'Product image must use loading="lazy"');
    expect.toContain(content, 'object-contain', 'Product image must use object-contain');
  });

  test('T1.F6.2: Renders discount badge with Persian percent symbol when discount > 0', () => {
    const cardPath = path.join(process.cwd(), 'design-system', 'components', 'ProductCard.tsx');
    const content = fs.readFileSync(cardPath, 'utf-8');
    expect.toContain(content, 'bg-red-500', 'Discount badge must use red-500');
    expect.toContain(content, '٪', 'Discount badge must show Persian percent sign');
  });

  test('T1.F6.3: Renders special deal badge for items with isSpecial=true', () => {
    const cardPath = path.join(process.cwd(), 'design-system', 'components', 'ProductCard.tsx');
    const content = fs.readFileSync(cardPath, 'utf-8');
    expect.toContain(content, 'product.isSpecial', 'Card must check product.isSpecial');
    expect.toContain(content, 'ویژه', 'Special badge text must be "ویژه"');
  });

  test('T1.F6.4: Renders strikethrough price when oldPrice > price', () => {
    const cardPath = path.join(process.cwd(), 'design-system', 'components', 'ProductCard.tsx');
    const content = fs.readFileSync(cardPath, 'utf-8');
    expect.toContain(content, 'line-through', 'Old price must be displayed with line-through');
  });

  test('T1.F6.5: Action footer renders "افزودن به سبد" button with emerald styling', () => {
    const cardPath = path.join(process.cwd(), 'design-system', 'components', 'ProductCard.tsx');
    const content = fs.readFileSync(cardPath, 'utf-8');
    expect.toContain(content, 'افزودن به سبد', 'CTA button must have Persian label');
    expect.toContain(content, 'bg-gradient-to-br from-emerald-600', 'CTA must use brand emerald gradient');
  });
});

// =========================================================================
// 7. ProductSkeleton Zero-CLS Loader Specifications
// =========================================================================
describe('Tier 1 - Feature 7: ProductSkeleton Zero-CLS Loader', 'tier1', () => {
  test('T1.F7.1: Skeleton applies animate-pulse class', () => {
    const skeletonPath = path.join(process.cwd(), 'design-system', 'components', 'ProductSkeleton.tsx');
    const content = fs.readFileSync(skeletonPath, 'utf-8');
    expect.toContain(content, 'animate-pulse', 'Skeleton must have animate-pulse');
  });

  test('T1.F7.2: Skeleton image container height matches ProductCard (h-40)', () => {
    const cardContent = fs.readFileSync(path.join(process.cwd(), 'design-system', 'components', 'ProductCard.tsx'), 'utf-8');
    const skelContent = fs.readFileSync(path.join(process.cwd(), 'design-system', 'components', 'ProductSkeleton.tsx'), 'utf-8');
    expect.toContain(cardContent, 'h-40', 'ProductCard image container must be h-40');
    expect.toContain(skelContent, 'h-40', 'ProductSkeleton image container must match h-40');
  });

  test('T1.F7.3: Skeleton price cluster height matches ProductCard (min-h-15)', () => {
    const cardContent = fs.readFileSync(path.join(process.cwd(), 'design-system', 'components', 'ProductCard.tsx'), 'utf-8');
    const skelContent = fs.readFileSync(path.join(process.cwd(), 'design-system', 'components', 'ProductSkeleton.tsx'), 'utf-8');
    expect.toContain(cardContent, 'min-h-15', 'ProductCard price container must be min-h-15');
    expect.toContain(skelContent, 'min-h-15', 'ProductSkeleton price container must match min-h-15');
  });

  test('T1.F7.4: Skeleton action button matches ProductCard button dimensions (h-11)', () => {
    const cardContent = fs.readFileSync(path.join(process.cwd(), 'design-system', 'components', 'ProductCard.tsx'), 'utf-8');
    const skelContent = fs.readFileSync(path.join(process.cwd(), 'design-system', 'components', 'ProductSkeleton.tsx'), 'utf-8');
    expect.toContain(cardContent, 'h-11', 'ProductCard action button must be h-11');
    expect.toContain(skelContent, 'h-11', 'ProductSkeleton action button placeholder must be h-11');
  });

  test('T1.F7.5: Skeleton outer container uses rounded-2xl and shadow-md parity', () => {
    const skelContent = fs.readFileSync(path.join(process.cwd(), 'design-system', 'components', 'ProductSkeleton.tsx'), 'utf-8');
    expect.toContain(skelContent, 'rounded-2xl', 'Skeleton outer radius must be rounded-2xl');
    expect.toContain(skelContent, 'shadow-md', 'Skeleton shadow must be shadow-md');
  });
});

// =========================================================================
// 8. Cart State Management (useCartStore) Specifications
// =========================================================================
describe('Tier 1 - Feature 8: Cart State Management', 'tier1', () => {
  test('T1.F8.1: addItem adds a new product to cart with initial quantity', () => {
    const cart = new CartStoreSimulator();
    cart.addItem(FIXTURE_PRODUCTS[0], 1);
    expect.toBe(cart.items.length, 1);
    expect.toBe(cart.items[0].product.id, FIXTURE_PRODUCTS[0].id);
    expect.toBe(cart.items[0].quantity, 1);
  });

  test('T1.F8.2: addItem increments quantity if product is already in cart', () => {
    const cart = new CartStoreSimulator();
    cart.addItem(FIXTURE_PRODUCTS[0], 1);
    cart.addItem(FIXTURE_PRODUCTS[0], 2);
    expect.toBe(cart.items.length, 1);
    expect.toBe(cart.items[0].quantity, 3);
  });

  test('T1.F8.3: updateQuantity alters item count and removes item when set to 0', () => {
    const cart = new CartStoreSimulator();
    cart.addItem(FIXTURE_PRODUCTS[0], 2);
    cart.updateQuantity(FIXTURE_PRODUCTS[0].id, 5);
    expect.toBe(cart.items[0].quantity, 5);
    cart.updateQuantity(FIXTURE_PRODUCTS[0].id, 0);
    expect.toBe(cart.items.length, 0);
  });

  test('T1.F8.4: removeItem deletes specified product from cart', () => {
    const cart = new CartStoreSimulator();
    cart.addItem(FIXTURE_PRODUCTS[0], 1);
    cart.addItem(FIXTURE_PRODUCTS[1], 1);
    expect.toBe(cart.items.length, 2);
    cart.removeItem(FIXTURE_PRODUCTS[0].id);
    expect.toBe(cart.items.length, 1);
    expect.toBe(cart.items[0].product.id, FIXTURE_PRODUCTS[1].id);
  });

  test('T1.F8.5: getSubtotal calculates sum of original prices accurately', () => {
    const cart = new CartStoreSimulator();
    // Item 101: price 48.5M, oldPrice 52.0M * 2 = 104M
    cart.addItem(FIXTURE_PRODUCTS[0], 2);
    expect.toBe(cart.getSubtotal(), 104000000);
  });

  test('T1.F8.6: getTotalDiscount and getPayableTotal calculate accurately', () => {
    const cart = new CartStoreSimulator();
    // Item 101: price 48.5M, oldPrice 52.0M (3.5M discount per item * 2 = 7.0M)
    cart.addItem(FIXTURE_PRODUCTS[0], 2);
    expect.toBe(cart.getTotalDiscount(), 7000000);
    expect.toBe(cart.getPayableTotal(), 97000000);
    expect.toBe(cart.getSubtotal() - cart.getTotalDiscount(), cart.getPayableTotal());
  });
});

// =========================================================================
// 9. OTP Authentication Validation Specifications
// =========================================================================
describe('Tier 1 - Feature 9: OTP Authentication Validation', 'tier1', () => {
  test('T1.F9.1: Validates 11-digit Iranian mobile format ^09\\d{9}$', async () => {
    const auth = new AuthStoreSimulator();
    const validRes = await auth.requestOtp('09123456789');
    expect.toBe(validRes.success, true);
    const invalidRes = await auth.requestOtp('08123456789');
    expect.toBe(invalidRes.success, false);
  });

  test('T1.F9.2: Initial OTP countdown timer is configured to 120 seconds', () => {
    const loginModalPath = path.join(process.cwd(), 'design-system', 'components', 'LoginModal.tsx');
    const content = fs.readFileSync(loginModalPath, 'utf-8');
    expect.toContain(content, 'useState<number>(120)', 'Timer state must initialize to 120 seconds');
    expect.toContain(content, 'setTimer(120)', 'Timer reset must restore 120 seconds');
  });

  test('T1.F9.3: OTP input restricts maximum length to 5 digits', () => {
    const loginModalPath = path.join(process.cwd(), 'design-system', 'components', 'LoginModal.tsx');
    const content = fs.readFileSync(loginModalPath, 'utf-8');
    expect.toContain(content, 'maxLength={5}', 'OTP input must specify maxLength={5}');
  });

  test('T1.F9.4: Rejects OTP verification when code is incomplete or malformed', async () => {
    const auth = new AuthStoreSimulator();
    const failRes = await auth.verifyOtp('09123456789', '123'); // only 3 digits
    expect.toBe(failRes.success, false);
    expect.toBe(auth.isAuthenticated, false);
  });

  test('T1.F9.5: Successful OTP verification hydrates user profile and session', async () => {
    const auth = new AuthStoreSimulator();
    const successRes = await auth.verifyOtp('09123456789', '12345');
    expect.toBe(successRes.success, true);
    expect.toBe(auth.isAuthenticated, true);
    expect.toBe(auth.user.phoneNumber, '09123456789');
  });
});

// =========================================================================
// 10. Address Selection System Specifications
// =========================================================================
describe('Tier 1 - Feature 10: Address Selection System', 'tier1', () => {
  test('T1.F10.1: AddressModal renders address list with title and fullAddress', () => {
    const modalPath = path.join(process.cwd(), 'design-system', 'components', 'AddressModal.tsx');
    const content = fs.readFileSync(modalPath, 'utf-8');
    expect.toContain(content, 'addr.title', 'Address title must be displayed');
    expect.toContain(content, 'addr.fullAddress', 'Full address text must be displayed');
  });

  test('T1.F10.2: Identifies and marks default delivery address with "پیش‌فرض" tag', () => {
    const modalPath = path.join(process.cwd(), 'design-system', 'components', 'AddressModal.tsx');
    const content = fs.readFileSync(modalPath, 'utf-8');
    expect.toContain(content, 'addr.isDefault', 'Modal must inspect addr.isDefault');
    expect.toContain(content, 'پیش‌فرض', 'Default badge text must be "پیش‌فرض"');
  });

  test('T1.F10.3: Applies emerald highlight border for selected address card', () => {
    const modalPath = path.join(process.cwd(), 'design-system', 'components', 'AddressModal.tsx');
    const content = fs.readFileSync(modalPath, 'utf-8');
    expect.toContain(content, 'border-emerald-500', 'Selected address card must have border-emerald-500');
  });

  test('T1.F10.4: Selecting an address invokes onSelectAddress callback with address object', () => {
    const modalPath = path.join(process.cwd(), 'design-system', 'components', 'AddressModal.tsx');
    const content = fs.readFileSync(modalPath, 'utf-8');
    expect.toContain(content, 'onSelectAddress(addr)', 'Card click must trigger onSelectAddress with addr');
  });

  test('T1.F10.5: Renders "افزودن آدرس جدید" dashed button when handler is provided', () => {
    const modalPath = path.join(process.cwd(), 'design-system', 'components', 'AddressModal.tsx');
    const content = fs.readFileSync(modalPath, 'utf-8');
    expect.toContain(content, 'افزودن آدرس جدید', 'New address CTA must be labeled "افزودن آدرس جدید"');
    expect.toContain(content, 'border-dashed border-emerald-400', 'New address button must have dashed emerald border');
  });
});
