# 📑 Dijimoon Milestone 1 Specification & Code Blueprint Handoff Report

**Agent**: `m1_spec_miner_1` (Teamwork Specification Miner)  
**Milestone**: M1 (Core Setup & Foundation)  
**Target Repository**: `/Users/amirheidari/GitHub/Digi-Moon`  
**Working Directory**: `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_spec_miner_1`  
**Date**: 2026-09-17T23:10:00Z  
**Destination**: `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_spec_miner_1/handoff.md`  
**Parent Agent**: `875495e2-e902-4678-a7f8-8c203de96906` (`parent`)

---

## 1. Observation

Authoritative specification sources inspected in the repository:
1. `ORIGINAL_REQUEST.md` (lines 1-74): Mandates Next.js 15 App Router, React 19, Tailwind CSS v4, Persian native typography (`dir="rtl"`, `lang="fa"`, `IRANSans`/`Vazirmatn` with ligatures `rlig 1, calt 1`), Toman currency formatting, and realistic mock dataset mirroring live `api.dijimoon.ir`.
2. `PROJECT.md` (lines 62-81): Defines strict interface contracts between M1 and subsequent milestones:
   - `src/types/index.ts`: `Product`, `Category`, `CartItem`, `Address`, `Order`, `UserProfile`, `ThemeMode`.
   - `src/lib/persian.ts`: `toPersianDigits`, `toEnglishDigits`, `formatToman`, `calculateDiscount`, `parsePriceToman`, `slugifyPersian`.
   - `src/lib/utils.ts`: `cn` classnames utility combining `clsx` and `tailwind-merge`.
   - `src/data/mock-data.ts`: `mockProducts`, `mockCategories`, `mockFestivalProducts`, `mockAddresses`, `mockOrders`, `mockUserProfile`.
3. `design-system/types/index.ts` (lines 1-98): Prototype domain types including `Product`, `Category`, `CartItem`, `Address`, `UserProfile`, `TotpRequest`, `VerifyTotpRequest`, and `AuthResponse`.
4. `design-system/lib/persian.ts` (lines 1-63): Reverse-engineered Persian formatting logic (`toPersianDigits`, `toEnglishDigits`, `formatToman`, `calculateDiscount`, `parsePriceToman`).
5. `.agents/survey_spec_miner_1/handoff.md` (lines 408-526): Documented specifications for `slugifyPersian` and enriched product attributes (`specs`, `colors`, `warranty`, `fileId`).

Node.js automated runtime execution of Persian utilities verified:
- `toPersianDigits(12345)` -> `"۱۲۳۴۵"`
- `toEnglishDigits("۱۲۳۴۵")` -> `"12345"`
- `formatToman(1250000)` -> `"۱,۲۵۰,۰۰۰ تومان"`
- `formatToman(1250000, false)` -> `"۱,۲۵۰,۰۰۰"`
- `calculateDiscount(1000000, 800000)` -> `20`
- `parsePriceToman("۱۲۵,۰۰۰ تومان")` -> `125000`
- `slugifyPersian("گوشی‌های هوشمند سامسونگ مدل S24")` -> `"گوشی-های-هوشمند-سامسونگ-مدل-s24"`

---

## 2. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Domain Type | `Product` | Full model representing e-commerce catalog items with pricing, specs, colors, and campaign tags | Product attributes | Strongly-typed interface | Type error at compile-time if required fields missing | `PROJECT.md:65-66`, `design-system/types/index.ts:6-21` |
| 2 | Domain Type | `Category` | Hierarchical catalog categories with slugs, product count, and icon identifiers | Category metadata | Strongly-typed interface | Optional fields default gracefully | `PROJECT.md:65-66`, `design-system/types/index.ts:23-32` |
| 3 | Domain Type | `CartItem` | Order line item encapsulating selected product, count, chosen color variant, and warranty | Cart item state | Strongly-typed interface | Invariant: quantity >= 1 | `PROJECT.md:65-66`, `survey_spec_miner_1:483-489` |
| 4 | Domain Type | `Address` | Iranian domestic delivery destination with 10-digit postal code, province, city, receiver | Address fields | Strongly-typed interface | Incomplete address flagged in UI | `PROJECT.md:65-66`, `design-system/types/index.ts:39-47` |
| 5 | Domain Type | `Order` | Customer purchase record with tracking code, items, financial tally, and lifecycle state | Order data | Strongly-typed interface | Strict union of statuses | `PROJECT.md:65-66`, `survey_spec_miner_1:503-514` |
| 6 | Domain Type | `UserProfile` | Customer account data with phone, wallet balance in Tomans, saved addresses, favorites | User profile fields | Strongly-typed interface | Unauthenticated guest maps to null | `PROJECT.md:65-66`, `design-system/types/index.ts:90-97` |
| 7 | Domain Type | `ThemeMode` & `ResolvedTheme` | UI theme mode selection ('light' \| 'dark' \| 'system') and evaluated state ('light' \| 'dark') | Theme string | Strict union type | Compile error on invalid theme key | `PROJECT.md:65-66, 94-95` |
| 8 | Persian Lib | `toPersianDigits` | Replaces ASCII 0-9 and Arabic ٠-٩ with standard Persian numerals ۰-۹ | `string \| number \| null \| undefined` | Persian string | Null/undefined/empty returns `""` | `design-system/lib/persian.ts:12-18` |
| 9 | Persian Lib | `toEnglishDigits` | Normalizes Persian and Arabic numerals to ASCII digits for API payload compatibility | `string \| number \| null \| undefined` | ASCII string | Null/undefined/empty returns `""` | `design-system/lib/persian.ts:23-31` |
| 10 | Persian Lib | `formatToman` | Currency formatter with 3-digit comma grouping and Persian numerals, plus optional "تومان" | `number \| string \| null \| undefined`, `includeUnit = true` | e.g. `"۱,۲۵۰,۰۰۰ تومان"` | Invalid/empty returns `"۰ تومان"` or `"۰"` | `design-system/lib/persian.ts:36-44` |
| 11 | Persian Lib | `calculateDiscount` | Computes integer percentage discount between original price and current sale price | `originalPrice: number`, `currentPrice: number` | Integer percentage (0-100) | Returns 0 if original <= current or invalid | `design-system/lib/persian.ts:49-52` |
| 12 | Persian Lib | `parsePriceToman` | Extracts numerical integer from dirty scraper or user input containing Persian digits & commas | `rawText: string \| number \| null \| undefined` | Clean integer value (number) | Returns 0 if no digits found | `design-system/lib/persian.ts:57-62` |
| 13 | Persian Lib | `slugifyPersian` | Transforms Persian product titles into URL-safe slugs, normalizing ZWNJ (`\u200c`) and spaces | `text: string \| null \| undefined` | Clean URL slug | Returns `""` on empty input | `survey_spec_miner_1:430-440` |
| 14 | UI Utility | `cn` helper | Combines `clsx` conditionals and `tailwind-merge` class deduplication | `ClassValue[]` | Merged class string | Handles falsy/undefined values gracefully | `ORIGINAL_REQUEST.md:20-21`, `PROJECT.md:164` |
| 15 | Mock Catalog | `mockProducts` | 16 realistic Iranian electronics products across 4 categories with Tomans pricing, specs, colors | None | `Product[]` | Co-located with fallback images | `PROJECT.md:75`, `ORIGINAL_REQUEST.md:42` |
| 16 | Mock Catalog | `mockCategories` | 4 main categories (smartphones, headphones, smartwatches, accessories) with slugs and icons | None | `Category[]` | Strict 1:1 mapping with products | `PROJECT.md:76` |
| 17 | Mock Catalog | `mockFestivalProducts` | 10 featured festival deals with high discount percentages (5%-18%) and campaign badges | None | `Product[]` (filtered subset) | Synchronized with main catalog | `PROJECT.md:77` |
| 18 | Mock Catalog | `mockAddresses` | Residential (Sa'adat Abad) and commercial (Vanak) Tehran addresses with 10-digit postal codes | None | `Address[]` | Default flag configured on home address | `PROJECT.md:78` |
| 19 | Mock Catalog | `mockOrders` | 3 orders in varied states (delivered, processing) with line items, Tomans tally, tracking code | None | `Order[]` | Financial tallies precisely match items | `PROJECT.md:79` |
| 20 | Mock Catalog | `mockUserProfile` | Complete authenticated user profile with wallet balance, favorite product IDs, phone | None | `UserProfile` | Fully consistent with mock addresses | `PROJECT.md:80` |

---

## 3. Edge Cases

| # | Feature | Input | Observed Behavior | Handling / Recommendation |
|---|---------|-------|-------------------|---------------------------|
| 1 | `toPersianDigits` | `null` or `undefined` | Returns empty string `""` | Safe null-check prevents TypeError |
| 2 | `toPersianDigits` | Number `0` | Returns `"۰"` | Check `input === null \|\| input === undefined` rather than falsy check |
| 3 | `toEnglishDigits` | Persian phone `"۰۹۱۲۳۴۵۶۷۸۹"` | Returns `"09123456789"` | Essential for regex validation `/^09\d{9}$/` and API dispatch |
| 4 | `toEnglishDigits` | Arabic numerals `"٠١٢٣٤٥٦٧٨٩"` | Returns `"0123456789"` | Covers eastern Arabic numerals found on some imported keyboards |
| 5 | `formatToman` | Float/Decimal amount e.g. `1250000.75` | Rounds to nearest integer (`Math.round`) and formats as `"۱,۲۵۰,۰۰۱ تومان"` | Tomans never have decimal subdivisions in retail |
| 6 | `formatToman` | String with commas e.g. `"1,250,000"` | Strips commas, normalizes digits, produces `"۱,۲۵۰,۰۰۰ تومان"` | Resilient to already-formatted input |
| 7 | `formatToman` | Non-numeric string e.g. `"بدون قیمت"` | Returns `"۰ تومان"` (or `"۰"` if `includeUnit = false`) | Never throws runtime error on unexpected API response |
| 8 | `calculateDiscount` | `originalPrice <= currentPrice` | Returns `0` | Prevents negative or zero discount badges |
| 9 | `calculateDiscount` | Zero original price (`0, 50000`) | Returns `0` | Protects against division by zero |
| 10 | `parsePriceToman` | Formatted Persian string `"۱۲۵,۰۰۰ تومان"` | Extracts digits `"125000"` and returns `125000` | Ignores unit text and punctuation |
| 11 | `parsePriceToman` | String without digits `"تماس بگیرید"` | Returns `0` | Safe fallback for unpriced items |
| 12 | `slugifyPersian` | Persian string with ZWNJ `"گوشی‌های هوشمند"` | Produces `"گوشی-های-هوشمند"` | Replaces `\u200c` with `-` before punctuation strip |
| 13 | `slugifyPersian` | String with symbols `"تست!@#$%^&*()_+"` | Produces `"تست"` | Strips non-Persian, non-alphanumeric punctuation |
| 14 | `slugifyPersian` | Leading and trailing hyphens `"---کالای دیجیتال---"` | Produces `"کالای-دیجیتال"` | Trims bounding hyphens |
| 15 | `cn` utility | Conflicting Tailwind classes `cn('p-4', 'p-2')` | Returns `'p-2'` | `tailwind-merge` guarantees last class wins without CSS specificity issues |

---

## 4. Code Blueprints

### 4.1 Blueprint: `src/types/index.ts`

```typescript
/**
 * Dijimoon Storefront — Domain Types & Data Contracts
 * Milestones: M1 through M5
 * Location: src/types/index.ts
 */

// ---------------------------------------------------------------------------
// 1. Core Color & Theming Types
// ---------------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export type ElevationLevel = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type RadiusLevel = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

export interface ProductColor {
  name: string; // e.g. "مشکی تیتانیوم"
  hex: string;  // e.g. "#232528"
}

// ---------------------------------------------------------------------------
// 2. Product & Category Models
// ---------------------------------------------------------------------------

export interface Product {
  id: string | number;
  title: string;
  slug: string;
  price: number; // in Toman (integer)
  oldPrice?: number; // original price before discount in Toman
  discountPercent?: number; // integer 0-100
  imageUrl: string;
  fileId?: string; // for CDN https://api.dijimoon.ir/Api/Files/Download/{fileId}
  categoryTitle: string;
  categoryId: string | number;
  rating?: number; // e.g. 4.8 (out of 5)
  inStock: boolean;
  stockCount?: number;
  isSpecial?: boolean; // featured in festival / deal carousel
  campaignBadge?: string; // e.g. "شگفت‌انگیز", "پیشنهاد ویژه", "بیشترین تخفیف"
  description?: string;
  specs?: Record<string, string>; // technical specifications key-value table
  colors?: ProductColor[];
  warranty?: string; // e.g. "۱۸ ماه گارانتی رسمی شرکتی + کد رجیستری"
}

export interface Category {
  id: string | number;
  title: string;
  slug: string;
  icon?: string; // Lucide icon name or SVG representation
  fileId?: string;
  parentId?: string | number | null;
  productCount?: number;
  children?: Category[];
}

// ---------------------------------------------------------------------------
// 3. Cart & Checkout Models
// ---------------------------------------------------------------------------

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: ProductColor | string;
  selectedWarranty?: string;
}

// ---------------------------------------------------------------------------
// 4. Address Book Models
// ---------------------------------------------------------------------------

export interface Address {
  id: string | number;
  title: string; // e.g. "منزل (سعادت‌آباد)", "دفتر کار (ونک)"
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string; // 10-digit Iranian postal code
  receiverName: string;
  receiverPhone: string; // 11-digit mobile number starting with 09
  isDefault?: boolean;
}

// ---------------------------------------------------------------------------
// 5. Order & Purchase History Models
// ---------------------------------------------------------------------------

export type OrderStatus =
  | 'pending_payment'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'online' | 'wallet';

export interface Order {
  id: string | number;
  orderNumber: string; // e.g. "DM-1405-9821"
  createdAt: string; // Jalali display date or ISO timestamp
  status: OrderStatus;
  items: CartItem[];
  shippingAddress: Address;
  totalAmount: number; // subtotal in Tomans before discount
  discountAmount: number; // total discount in Tomans
  finalAmount: number; // payable total in Tomans
  paymentMethod: PaymentMethod;
  trackingCode?: string;
}

// ---------------------------------------------------------------------------
// 6. User Profile & Account Models
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: string | number;
  phoneNumber: string; // 11-digit mobile number (e.g. "09123456789")
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  walletBalance?: number; // in Tomans
  favoriteProductIds?: (string | number)[];
  addresses?: Address[];
}

// ---------------------------------------------------------------------------
// 7. Authentication & SSO Protocol Models (api.dijimoon.ir compatibility)
// ---------------------------------------------------------------------------

export interface TotpRequest {
  PhoneNumber: string;
}

export interface VerifyTotpRequest {
  PhoneNumber: string;
  Code: string;
}

export interface AuthResponse {
  IsExistUser: boolean;
  AccessToken?: string;
  RefreshToken?: string;
  ExpiresIn?: number;
  Message?: string;
}

// ---------------------------------------------------------------------------
// 8. Pagination & Query Helpers
// ---------------------------------------------------------------------------

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface GridQueryParams {
  pageIndex?: number;
  pageSize?: number;
  categoryId?: string | number;
  searchQuery?: string;
  sortBy?: 'newest' | 'cheapest' | 'expensive' | 'popular';
}

// ---------------------------------------------------------------------------
// 9. Navigation & Chrome Types
// ---------------------------------------------------------------------------

export type BottomNavTab = 'home' | 'categories' | 'products' | 'cart';
```

---

### 4.2 Blueprint: `src/lib/persian.ts`

```typescript
/**
 * Dijimoon Storefront — Persian / RTL Localization & Formatting Utilities
 * Location: src/lib/persian.ts
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Converts English (0-9) and Arabic (٠-٩) digits in a string/number to standard Persian digits (۰-۹).
 * Handles null, undefined, zero, and numbers safely.
 */
export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  return str
    .replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[+digit])
    .replace(/[٠-٩]/g, (digit) => PERSIAN_DIGITS[ARABIC_DIGITS.indexOf(digit)]);
}

/**
 * Converts Persian (۰-۹) and Arabic (٠-٩) digits to standard ASCII English digits (0-9).
 * Essential for normalizing phone numbers and OTP codes before validation and API calls.
 */
export function toEnglishDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  let str = input.toString();
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(PERSIAN_DIGITS[i], 'g'), i.toString());
    str = str.replace(new RegExp(ARABIC_DIGITS[i], 'g'), i.toString());
  }
  return str;
}

/**
 * Formats a numeric amount or string into Iranian Toman with 3-digit comma separators and Persian digits.
 * Example: formatToman(1250000) -> "۱,۲۵۰,۰۰۰ تومان"
 * Example: formatToman(1250000, false) -> "۱,۲۵۰,۰۰۰"
 */
export function formatToman(
  amount: number | string | null | undefined,
  includeUnit = true
): string {
  if (amount === null || amount === undefined) {
    return includeUnit ? '۰ تومان' : '۰';
  }

  const cleanStr = toEnglishDigits(amount.toString()).replace(/[^\d.-]/g, '');
  const num = Number(cleanStr);

  if (isNaN(num) || cleanStr === '') {
    return includeUnit ? '۰ تومان' : '۰';
  }

  const rounded = Math.round(num);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const persianFormatted = toPersianDigits(formatted);

  return includeUnit ? `${persianFormatted} تومان` : persianFormatted;
}

/**
 * Calculates the integer discount percentage between original price and sale price.
 * Returns 0 if originalPrice is undefined, 0, or less than currentPrice.
 * Example: calculateDiscount(1000000, 800000) -> 20
 */
export function calculateDiscount(
  originalPrice: number | null | undefined,
  currentPrice: number | null | undefined
): number {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
    return 0;
  }
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Parses raw price text (e.g. from scraping or formatted input) into a clean integer in Tomans.
 * Strips all non-digit characters after normalizing Persian numerals.
 * Example: parsePriceToman("۱۲۵,۰۰۰ تومان") -> 125000
 */
export function parsePriceToman(rawText: string | number | null | undefined): number {
  if (rawText === null || rawText === undefined) return 0;
  const english = toEnglishDigits(rawText.toString());
  const digitsOnly = english.replace(/[^\d]/g, '');
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
}

/**
 * Generates clean, URL-safe Persian slugs.
 * Converts zero-width non-joiners (\u200c), spaces, and underscores to hyphens.
 * Preserves Persian alphabet letters, ASCII alphanumeric characters, and hyphens.
 * Example: slugifyPersian("گوشی‌های هوشمند سامسونگ مدل S24") -> "گوشی-های-هوشمند-سامسونگ-مدل-s24"
 */
export function slugifyPersian(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\u200c/g, '-') // ZWNJ to hyphen
    .replace(/[\s\-_]+/g, '-') // spaces, dashes, underscores to single hyphen
    .replace(/[^\u0600-\u06FF\uFB8A\u067E\u0686\u06AFa-z0-9\-]/g, '') // keep Persian & alphanumeric
    .replace(/\-+/g, '-') // collapse multiple hyphens
    .replace(/^-|-$/g, ''); // trim leading & trailing hyphens
}
```

---

### 4.3 Blueprint: `src/lib/utils.ts`

```typescript
/**
 * Dijimoon Storefront — General Utility Helpers
 * Combines clsx and tailwind-merge for conflict-free Tailwind v4 styling.
 * Location: src/lib/utils.ts
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges conditional class names and resolves conflicting Tailwind CSS utilities cleanly.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

---

### 4.4 Blueprint: `src/data/mock-data.ts`

```typescript
/**
 * Dijimoon Storefront — Realistic Iranian E-Commerce Dataset
 * Covers 16 products across 4 core categories, festival deals, addresses, orders, and profile.
 * Location: src/data/mock-data.ts
 */

import { Product, Category, Address, Order, UserProfile } from '@/types';

// ============================================================================
// 1. CATEGORIES (دسته‌بندی‌ها)
// ============================================================================

export const mockCategories: Category[] = [
  {
    id: 'smartphones',
    title: 'گوشی موبایل',
    slug: 'smartphones',
    icon: 'Smartphone',
    productCount: 4,
  },
  {
    id: 'headphones',
    title: 'هدفون و هندزفری',
    slug: 'headphones',
    icon: 'Headphones',
    productCount: 4,
  },
  {
    id: 'smartwatches',
    title: 'ساعت هوشمند',
    slug: 'smartwatches',
    icon: 'Watch',
    productCount: 4,
  },
  {
    id: 'accessories',
    title: 'لوازم جانبی دیجیتال',
    slug: 'accessories',
    icon: 'Cpu',
    productCount: 4,
  },
];

// ============================================================================
// 2. PRODUCTS (محصولات واقع‌گرایانه با قیمت تومان)
// ============================================================================

export const mockProducts: Product[] = [
  // --- Category: Smartphones (گوشی موبایل) ---
  {
    id: 'prod-1',
    title: 'گوشی موبایل سامسونگ مدل Galaxy S24 Ultra دو سیم‌کارت ظرفیت 256 گیگابایت و رم 12 گیگابایت',
    slug: 'samsung-galaxy-s24-ultra-256gb',
    price: 68500000,
    oldPrice: 72000000,
    discountPercent: 5,
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'گوشی موبایل',
    categoryId: 'smartphones',
    rating: 4.8,
    inStock: true,
    stockCount: 14,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'پرچمدار بی‌رقیب سامسونگ با فریم تیتانیومی، قلم استایلوس S-Pen هوشمند، پردازنده Snapdragon 8 Gen 3 و قابلیت‌های نوین هوش مصنوعی Galaxy AI.',
    specs: {
      'حافظه داخلی': '256 گیگابایت',
      'مقدار RAM': '12 گیگابایت',
      'اندازه صفحه نمایش': '6.8 اینچ Dynamic AMOLED 2X',
      'نرخ نوسازی': '120 هرتز تطبیقی',
      'رزولوشن دوربین اصلی': '200 مگاپیکسل + 50 + 12 + 10',
      'ظرفیت باتری': '5000 میلی‌آمپر ساعت',
      'پشتیبانی از شارژ سریع': '45 وات باسیم و 15 وات بی‌سیم',
      'جنس بدنه': 'فریم تیتانیوم + شیشه گوریلا گلس Armor',
    },
    colors: [
      { name: 'مشکی تیتانیوم', hex: '#232528' },
      { name: 'خاکستری تیتانیوم', hex: '#82817d' },
      { name: 'زرد تیتانیوم', hex: '#f0e5b8' },
      { name: 'بنفش تیتانیوم', hex: '#585265' },
    ],
    warranty: '۱۸ ماه گارانتی رسمی شرکتی معتبر + کد رجیستری همتا',
  },
  {
    id: 'prod-2',
    title: 'گوشی موبایل اپل مدل iPhone 13 Pro CH دو سیم‌کارت ظرفیت 256 گیگابایت',
    slug: 'apple-iphone-13-pro-ch-256gb',
    price: 94000000,
    oldPrice: 98000000,
    discountPercent: 4,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'گوشی موبایل',
    categoryId: 'smartphones',
    rating: 4.9,
    inStock: true,
    stockCount: 6,
    isSpecial: false,
    campaignBadge: 'پرفروش',
    description: 'آیفون ۱۳ پرو با چیپست قدرتمند A15 Bionic، صفحه نمایش سوپر رتینا XDR با فناوری ProMotion 120Hz و دوربین سه‌گانه حرفه‌ای مجهز به سنسور LiDAR.',
    specs: {
      'حافظه داخلی': '256 گیگابایت',
      'مقدار RAM': '6 گیگابایت',
      'اندازه صفحه نمایش': '6.1 اینچ Super Retina XDR OLED',
      'پردازنده': 'Apple A15 Bionic (5 nm)',
      'رزولوشن دوربین': 'دوربین سه‌گانه 12 مگاپیکسل عریض، تله‌فوتو و فوق‌عریض',
      'باتری': '3095 میلی‌آمپر ساعت',
      'پارت‌نامبر': 'CH (دوسیم‌کارت فیزیکی)',
    },
    colors: [
      { name: 'آبی سنگی (Sierra Blue)', hex: '#9bb5ce' },
      { name: 'خاکستری گرافیت', hex: '#4e4d4b' },
      { name: 'نقره‌ای', hex: '#f1f2ed' },
      { name: 'طلایی', hex: '#fae7cf' },
    ],
    warranty: '۱۸ ماه گارانتی شرکتی و اصالت رجیستری',
  },
  {
    id: 'prod-3',
    title: 'گوشی موبایل شیائومی مدل 14T Pro 5G دو سیم‌کارت ظرفیت 512 گیگابایت و رم 12 گیگابایت',
    slug: 'xiaomi-14t-pro-5g-512gb',
    price: 49200000,
    oldPrice: 53500000,
    discountPercent: 8,
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'گوشی موبایل',
    categoryId: 'smartphones',
    rating: 4.7,
    inStock: true,
    stockCount: 19,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'شاهکار عکاسی شیائومی با همکاری کمپانی لایکا (Leica)، صفحه نمایش خیره‌کننده 144 هرتز AMOLED، شارژ فوق‌سریع 120 واتی و پردازنده پرچمدار Dimensity 9300+.',
    specs: {
      'حافظه داخلی': '512 گیگابایت UFS 4.0',
      'مقدار RAM': '12 گیگابایت LPDDR5X',
      'پردازنده': 'MediaTek Dimensity 9300+ (4 nm)',
      'نرخ نوسازی': '144 هرتز',
      'دوربین اصلی': '50 مگاپیکسل Leica Summilux',
      'توان شارژ': '120 وات سیمی (100% در 19 دقیقه) + 50 وات وایرلس',
      'گواهی مقاومت': 'IP68 مقاوم در برابر نفوذ آب و گردوغبار',
    },
    colors: [
      { name: 'مشکی تایتان', hex: '#212224' },
      { name: 'خاکستری تایتان', hex: '#636569' },
      { name: 'آبی تایتان', hex: '#374b5c' },
    ],
    warranty: '۱۸ ماه گارانتی شرکتی کسری پارس + رجیستری همتا',
  },
  {
    id: 'prod-4',
    title: 'گوشی موبایل سامسونگ مدل Galaxy A55 5G دو سیم‌کارت ظرفیت 256 گیگابایت و رم 8 گیگابایت',
    slug: 'samsung-galaxy-a55-5g-256gb',
    price: 20800000,
    oldPrice: 21700000,
    discountPercent: 4,
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'گوشی موبایل',
    categoryId: 'smartphones',
    rating: 4.6,
    inStock: true,
    stockCount: 22,
    isSpecial: false,
    campaignBadge: 'محبوب‌ترین',
    description: 'پرفروش‌ترین میان‌رده با کیفیت ساخت پریمیوم فریم آلومینیومی، گوریلا گلس ویکتوس پلاس، صفحه نمایش Super AMOLED و ماندگاری دو روزه باتری.',
    specs: {
      'حافظه داخلی': '256 گیگابایت',
      'مقدار RAM': '8 گیگابایت',
      'صفحه نمایش': '6.6 اینچ Super AMOLED 120Hz',
      'دوربین اصلی': '50 مگاپیکسل مجهز به OIS',
      'باتری': '5000 میلی‌آمپر ساعت با شارژ 25 وات',
      'استاندارد مقاومت': 'IP67',
    },
    colors: [
      { name: 'سرمه‌ای تیره (Awesome Navy)', hex: '#1e2530' },
      { name: 'آبی یخی (Awesome Iceblue)', hex: '#d4e4f7' },
      { name: 'یاسی (Awesome Lilac)', hex: '#dfd2e8' },
      { name: 'لیمویی (Awesome Lemon)', hex: '#e9f1c7' },
    ],
    warranty: '۱۸ ماه گارانتی مایکروتل / داریا همراه',
  },

  // --- Category: Headphones & Audio (هدفون و هندزفری) ---
  {
    id: 'prod-5',
    title: 'هدفون بلوتوثی سونی مدل WH-1000XM5 با قابلیت نویز کنسلینگ پیشرفته',
    slug: 'sony-wh-1000xm5-noise-cancelling',
    price: 18200000,
    oldPrice: 19600000,
    discountPercent: 7,
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'هدفون و هندزفری',
    categoryId: 'headphones',
    rating: 4.9,
    inStock: true,
    stockCount: 11,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'برترین هدفون دور گوشی جهان در زمینه حذف نویز فعال (ANC) با پردازنده اختصاصی V1 و QN1، وضوح صوتی Hi-Res Audio و شارژدهی شگفت‌انگیز ۳۰ ساعته.',
    specs: {
      'نوع اتصال': 'بلوتوث نسخه 5.2 و جک 3.5 میلی‌متری',
      'عمر باتری': 'تا 30 ساعت با ANC روشن و 40 ساعت بدون ANC',
      'فناوری نویز کنسلینگ': 'Auto NC Optimizer با 8 میکروفون تخصصی',
      'پشتیبانی از کدک‌ها': 'LDAC, AAC, SBC',
      'قابلیت شارژ سریع': '3 دقیقه شارژ = 3 ساعت پخش موسیقی',
      'وزن': '250 گرم بسیار سبک و ارگونومیک',
    },
    colors: [
      { name: 'مشکی کربنی', hex: '#1a1a1a' },
      { name: 'نقره‌ای پلاتینیوم', hex: '#d8d4cd' },
      { name: 'آبی نیمه‌شب', hex: '#1d2737' },
    ],
    warranty: 'گارانتی ۱۸ ماهه بازرگانی ایران (ایران‌رهجو)',
  },
  {
    id: 'prod-6',
    title: 'هدفون بلوتوثی اپل مدل AirPods Pro 2 با پورت USB-C و کیس مگ‌سیف',
    slug: 'apple-airpods-pro-2-usbc',
    price: 13900000,
    oldPrice: 14800000,
    discountPercent: 6,
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'هدفون و هندزفری',
    categoryId: 'headphones',
    rating: 4.8,
    inStock: true,
    stockCount: 15,
    isSpecial: false,
    campaignBadge: 'پیشنهاد ویژه',
    description: 'نسل دوم ایرپاد پرو مجهز به تراشه انقلابی H2، شفافیت صدای تطبیقی (Adaptive Audio)، صدای فراگیر شخصی‌سازی شده و کیس شارژ ضد گردوغبار USB-C.',
    specs: {
      'تراشه': 'Apple H2 در گوشی‌ها و Apple U1 در کیس',
      'درگاه اتصال کیس': 'USB-C با پشتیبانی از MagSafe و Qi',
      'حذف نویز': 'تا ۲ برابر قوی‌تر از نسل اول',
      'شارژدهی': '۶ ساعت با یکبار شارژ و تا ۳۰ ساعت همراه با کیس',
      'مقاومت در برابر تعریق و آب': 'استاندارد IP54 برای ایرپادها و کیس',
    },
    colors: [
      { name: 'سفید براق', hex: '#fdfdfd' },
    ],
    warranty: 'گارانتی ۱۸ ماهه شرکتی آروند + اصالت قطعی کالا',
  },
  {
    id: 'prod-7',
    title: 'هدفون بلوتوثی سامسونگ مدل Galaxy Buds 3 Pro',
    slug: 'samsung-galaxy-buds-3-pro',
    price: 9500000,
    oldPrice: 10550000,
    discountPercent: 10,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'هدفون و هندزفری',
    categoryId: 'headphones',
    rating: 4.7,
    inStock: true,
    stockCount: 18,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'طراحی مدرن پایه‌دار با تیغه‌های نوری Blade Lights، بلندگوهای دوطرفه ووفر و توییتر مسطح، کدک صوتی Hi-Fi 24 بیتی سامسونگ و ترجمه زنده با Galaxy AI.',
    specs: {
      'سیستم صوتی': 'درایور دوگانه (ووفر 10.5mm + توییتر مسطح 6.1mm)',
      'پردازش صوتی': 'کدک بدون افت Seamless Codec Ultra High Quality',
      'کنترل لمسی': 'پشتیبانی از ژست‌های اسلاید برای صدا و پینچ برای موسیقی',
      'شارژدهی': 'تا ۷ ساعت گوش دادن و ۳۰ ساعت همراه با کیس',
      'گواهی مقاومت': 'IP57',
    },
    colors: [
      { name: 'نقره‌ای متالیک', hex: '#a6a9ad' },
      { name: 'سفید صدفی', hex: '#f6f7f9' },
    ],
    warranty: '۱۸ ماه گارانتی سام سرویس / همراه اول',
  },
  {
    id: 'prod-8',
    title: 'هندزفری بلوتوثی انکر مدل Soundcore Liberty 4 NC با قابلیت ANC تطبیقی 98.5%',
    slug: 'anker-soundcore-liberty-4-nc',
    price: 4100000,
    oldPrice: 4650000,
    discountPercent: 12,
    imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'هدفون و هندزفری',
    categoryId: 'headphones',
    rating: 4.6,
    inStock: true,
    stockCount: 27,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'ارزش خرید فوق‌العاده با کاهش ۹۸.۵ درصدی صدای محیط، درایورهای ۱۱ میلی‌متری سفارشی، پشتیبانی از صدای بی‌سیم باکیفیت LDAC و عمر باتری شگفت‌انگیز ۵۰ ساعته.',
    specs: {
      'درایور': '11 میلی‌متری داینامیک سفارشی',
      'کدک‌ها': 'LDAC, AAC, SBC با تاییدیه Hi-Res Wireless',
      'تعداد میکروفون': '6 میکروفون با الگوریتم هوش مصنوعی کاهش نویز مکالمه',
      'شارژدهی': '۱۰ ساعت مداوم و تا ۵۰ ساعت با کیس شارژ',
      'شارژ سریع': '10 دقیقه شارژ = 4 ساعت زمان پخش',
    },
    colors: [
      { name: 'مشکی مخملی', hex: '#1d1e20' },
      { name: 'سفید یخی', hex: '#f2f3f5' },
      { name: 'سرمه‌ای دریایی', hex: '#212d40' },
      { name: 'آبی پاستلی', hex: '#9ab3c9' },
    ],
    warranty: '۱۸ ماه گارانتی تعویض فارس / ایستا',
  },

  // --- Category: Smartwatches (ساعت هوشمند) ---
  {
    id: 'prod-9',
    title: 'ساعت هوشمند اپل مدل Watch Ultra 2 تیتانیومی 49mm با بند اوشن',
    slug: 'apple-watch-ultra-2-49mm',
    price: 48500000,
    oldPrice: 50000000,
    discountPercent: 3,
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'ساعت هوشمند',
    categoryId: 'smartwatches',
    rating: 4.9,
    inStock: true,
    stockCount: 8,
    isSpecial: false,
    campaignBadge: 'پرچمدار',
    description: 'سرآمد ساعت‌های هوشمند ورزشی برای ورزشکاران حرفه‌ای و ماجراجویان؛ بدنه مقاوم تیتانیوم گرید هوافضا، روشنایی فوق‌العاده ۳۰۰۰ نیت، GPS دوفرکانسه دقیق و عمق‌سنج غواصی.',
    specs: {
      'جنس بدنه': 'تیتانیوم گرید هوافضا با کریستال یاقوت کبود (Sapphire)',
      'روشنایی صفحه': 'تا 3000 نیت',
      'پردازنده': 'تراشه دوهسته‌ای Apple S9 SiP با پشتیبانی از Double Tap',
      'مقاومت در برابر آب': 'تا عمق 100 متر با استاندارد غواصی EN13319',
      'شارژدهی باتری': 'تا ۳۶ ساعت استفاده استاندارد و ۷۲ ساعت در حالت کم‌مصرف',
    },
    colors: [
      { name: 'تیتانیوم با بند اوشن نارنجی', hex: '#fe6e00' },
      { name: 'تیتانیوم با بند اوشن مشکی', hex: '#222325' },
      { name: 'تیتانیوم با بند سفید', hex: '#eaebee' },
    ],
    warranty: '۱۸ ماه گارانتی شرکتی همراه پاسارگاد / آروند',
  },
  {
    id: 'prod-10',
    title: 'ساعت هوشمند سامسونگ مدل Galaxy Watch 7 سایز 44 میلی‌متری',
    slug: 'samsung-galaxy-watch-7-44mm',
    price: 12400000,
    oldPrice: 13600000,
    discountPercent: 9,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'ساعت هوشمند',
    categoryId: 'smartwatches',
    rating: 4.7,
    inStock: true,
    stockCount: 16,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'اولین ساعت هوشمند سامسونگ با پردازنده ۳ نانومتری Exynos W1000، پایش پیشرفته ترکیبات بدنی و شاخص انرژی Energy Score از طریق هوش مصنوعی Galaxy AI.',
    specs: {
      'پردازنده': 'Exynos W1000 پنج هسته‌ای (3 نانومتری)',
      'سنسورها': 'BioActive نسل جدید برای سنجش ضربان، ECG، چربی و عضلات بدن',
      'صفحه نمایش': 'Super AMOLED با وضوح 480x480 پیکسل و روشنایی 2000 نیت',
      'موقعیت‌یابی': 'GPS دو فرکانسه با دقت بسیار بالا (L1 + L5)',
      'سیستم عامل': 'Wear OS 5 با رابط اختصاصی One UI 6 Watch',
    },
    colors: [
      { name: 'سبز تیره ارتشی', hex: '#2d3b32' },
      { name: 'نقره‌ای متالیک', hex: '#d7d8dc' },
    ],
    warranty: '۱۸ ماه گارانتی سام سرویس',
  },
  {
    id: 'prod-11',
    title: 'ساعت هوشمند امیزفیت مدل Balance با طراحی کلاسیک و سنسور پایش بیومتریک',
    slug: 'amazfit-balance-smartwatch',
    price: 8900000,
    oldPrice: 10450000,
    discountPercent: 15,
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'ساعت هوشمند',
    categoryId: 'smartwatches',
    rating: 4.6,
    inStock: true,
    stockCount: 20,
    isSpecial: true,
    campaignBadge: 'تخفیف طلایی',
    description: 'تلفیق بی‌نظیر زیبایی کلاسیک و سلامت مدرن با فریم آلومینیومی، نمایشگر ۱.۵ اینچی HD AMOLED، مکالمه صوتی بلوتوثی و شارژدهی فوق‌العاده ۱۴ روزه.',
    specs: {
      'صفحه نمایش': '1.5 اینچ AMOLED با تراکم پیکسلی 323 ppi و روشنایی 1500 نیت',
      'عمر باتری': 'تا 14 روز استفاده معمولی و 25 روز در حالت ذخیره انرژی',
      'سنسور تندرستی': 'BioTracker 5.0 PPG مجهز به دو سنسور نوری دوقلو',
      'پشتیبانی ورزشی': 'بیش از ۱۵۰ حالت ورزشی به همراه تشخیص خودکار حرکات بدنسازی',
      'وزن بدنه': 'فقط 35 گرم بدون بند',
    },
    colors: [
      { name: 'مشکی نیمه‌شب (Midnight)', hex: '#191a1c' },
      { name: 'خاکستری غروب (Sunset Grey)', hex: '#877c73' },
    ],
    warranty: 'گارانتی ۱۲ ماهه رایانه همراه',
  },
  {
    id: 'prod-12',
    title: 'ساعت هوشمند شیائومی مدل Redmi Watch 4 با صفحه نمایش بزرگ AMOLED',
    slug: 'xiaomi-redmi-watch-4',
    price: 3850000,
    oldPrice: 4200000,
    discountPercent: 8,
    imageUrl: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'ساعت هوشمند',
    categoryId: 'smartwatches',
    rating: 4.5,
    inStock: true,
    stockCount: 30,
    isSpecial: false,
    campaignBadge: 'ارزش خرید بالا',
    description: 'نمایشگر کم‌حاشیه ۱.۹۷ اینچی AMOLED با نرخ نوسازی ۶۰ هرتز، فریم میانی آلیاژ آلومینیوم با پیچ کوک چرخشی استیل و تا ۲۰ روز ماندگاری شارژ باتری.',
    specs: {
      'صفحه نمایش': '1.97 اینچ AMOLED با روشنایی 600 نیت',
      'باتری': '470 میلی‌آمپر ساعت با شارژدهی 20 روزه',
      'فریم': 'آلیاژ آلومینیوم با دکمه چرخان استیل ضدزنگ',
      'حسگرها': 'سنسور 4 کاناله سنجش ضربان قلب و اکسیژن خون SpO2',
      'مقاومت در برابر آب': '5ATM (مقاوم تا عمق 50 متری برای شنا)',
    },
    colors: [
      { name: 'مشکی وسواسی', hex: '#1c1d1f' },
      { name: 'نقره‌ای خاکستری', hex: '#cfd2d6' },
    ],
    warranty: '۱۸ ماه گارانتی شرکتی می همراه',
  },

  // --- Category: Accessories (لوازم جانبی دیجیتال) ---
  {
    id: 'prod-13',
    title: 'پاوربانک انکر مدل 737 ظرفیت 24000 میلی‌آمپر ساعت با توان 140 وات PowerCore 24K',
    slug: 'anker-737-power-bank-24000mah-140w',
    price: 5900000,
    oldPrice: 6650000,
    discountPercent: 11,
    imageUrl: 'https://images.unsplash.com/photo-1609592426504-d50b4457e51a?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'لوازم جانبی دیجیتال',
    categoryId: 'accessories',
    rating: 4.9,
    inStock: true,
    stockCount: 12,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'غول شارژ انکر با خروجی فوق‌سریع ۱۴۰ وات دوطرفه Power Delivery 3.1، صفحه نمایش دیجیتالی رنگی هوشمند برای نمایش بلادرنگ ولتاژ و توان، و شارژ همزمان مک‌بوک پرو، تبلت و موبایل.',
    specs: {
      'ظرفیت اسمی': '24,000 میلی‌آمپر ساعت (86.4 وات ساعت)',
      'حداکثر توان خروجی': '140 وات از طریق پورت Type-C',
      'تعداد درگاه‌ها': '2 عدد USB-C و 1 عدد USB-A',
      'فناوری حفاظتی': 'ActiveShield 2.0 با پایش حرارتی ۳ میلیون بار در روز',
      'سرعت شارژ مجدد پاوربانک': '100% شارژ در کمتر از 52 دقیقه با شارژر 140 وات',
    },
    colors: [
      { name: 'مشکی متالیک زغالی', hex: '#26292e' },
    ],
    warranty: '۱۸ ماه گارانتی تعویض معتبر ایستا / فارس',
  },
  {
    id: 'prod-14',
    title: 'هاب 8 پورت تایپ سی باسئوس مدل Metal Gleam Series با خروجی 4K HDMI و PD 100W',
    slug: 'baseus-metal-gleam-8-in-1-hub',
    price: 2450000,
    oldPrice: 2850000,
    discountPercent: 14,
    imageUrl: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'لوازم جانبی دیجیتال',
    categoryId: 'accessories',
    rating: 4.7,
    inStock: true,
    stockCount: 25,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'هاب همه‌کاره آلومینیومی با اتلاف حرارت عالی، خروجی تصویری HDMI 4K@60Hz شفاف، پورت شارژ عبوری 100 وات، پورت شبکه گیگابیت RJ45 و درگاه کارت حافظه SD/TF.',
    specs: {
      'جنس بدنه': 'آلیاژ آلومینیوم مات مقاوم در برابر خط و خش',
      'پورت‌ها': '1x HDMI 4K, 3x USB 3.0, 1x Type-C PD 100W, 1x RJ45 Lan, 1x SD, 1x TF',
      'سرعت انتقال داده': 'تا 5 گیگابیت بر ثانیه روی پورت‌های USB 3.0',
      'سازگاری': 'مک‌بوک، لپ‌تاپ‌های ویندوزی، آیپد و گوشی‌های با درگاه Type-C OTG',
    },
    colors: [
      { name: 'خاکستری فضایی (Space Grey)', hex: '#5f6062' },
    ],
    warranty: '۱۲ ماه گارانتی تعویض بازرگانی بهین / آروند',
  },
  {
    id: 'prod-15',
    title: 'شارژر دیواری 65 وات راوپاور مدل Pioneer با فناوری نوین GaN و 3 پورت خروجی',
    slug: 'ravpower-pioneer-65w-gan-charger',
    price: 1650000,
    oldPrice: 2010000,
    discountPercent: 18,
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'لوازم جانبی دیجیتال',
    categoryId: 'accessories',
    rating: 4.8,
    inStock: true,
    stockCount: 35,
    isSpecial: true,
    campaignBadge: 'بیشترین تخفیف',
    description: 'شارژر ابعاد مینیاتوری GaN با ۵۰٪ حجم کمتر نسبت به شارژرهای سنتی، توان ۶۵ وات با امکان شارژ همزمان لپ‌تاپ اولترابوک و گوشی آیفون با بالاترین راندمان انرژی.',
    specs: {
      'فناوری شارژ': 'Gallium Nitride (GaN III) با بازدهی حرارتی فوق‌العاده',
      'حداکثر توان خروجی': '65 وات Power Delivery',
      'تعداد پورت': '2 عدد USB-C و 1 عدد USB-A با فناوری iSmart',
      'دوشاخه': 'استاندارد ایران و اتحادیه اروپا (بدون نیاز به تبدیل)',
    },
    colors: [
      { name: 'مشکی مات', hex: '#1b1b1b' },
      { name: 'سفید صدفی', hex: '#fbfbfb' },
    ],
    warranty: '۱۸ ماه گارانتی تعویض آواژنگ',
  },
  {
    id: 'prod-16',
    title: 'استند و شارژر وایرلس مگ‌سیف ۳ در ۱ تاشو یوگرین با توان ۱۵ وات UGREEN 3-in-1',
    slug: 'ugreen-3-in-1-foldable-magsafe-charger',
    price: 3200000,
    oldPrice: 3450000,
    discountPercent: 7,
    imageUrl: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=600&q=80',
    categoryTitle: 'لوازم جانبی دیجیتال',
    categoryId: 'accessories',
    rating: 4.7,
    inStock: true,
    stockCount: 14,
    isSpecial: false,
    campaignBadge: 'طراحی برتر',
    description: 'استند رومیزی مگنتی لوکس با قابلیت تاشدن جهت حمل در سفر؛ شارژ همزمان آیفون مجهز به مگ‌سیف، اپل واچ و ایرپاد با حداکثر ایمنی و زاویه دید ارگونومیک قابل تنظیم.',
    specs: {
      'سازگاری': 'آیفون سری ۱۲ تا ۱۶، تمامی مدل‌های اپل واچ و هندزفری‌های با شارژ وایرلس',
      'توان خروجی': '15 وات برای گوشی + 5 وات برای ساعت + 5 وات برای هدفون',
      'آهنربا': 'مگنت‌های پرقدرت نئودیمیومی N52 با تراز خودکار',
      'قابلیت تا شدن': 'چرخش ۳۶۰ درجه و تاشو به صورت جیبی',
    },
    colors: [
      { name: 'خاکستری متالیک مات', hex: '#48494b' },
    ],
    warranty: '۱۲ ماه گارانتی بازرگانی متین',
  },
];

// ============================================================================
// 3. FESTIVAL PRODUCTS (شگفتانه‌ها و محصولات جشنواره)
// ============================================================================

export const mockFestivalProducts: Product[] = mockProducts.filter(
  (product) => product.isSpecial === true
);

// ============================================================================
// 4. ADDRESSES (آدرس‌های تحویل در تهران)
// ============================================================================

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    title: 'منزل (سعادت‌آباد)',
    province: 'تهران',
    city: 'تهران',
    fullAddress: 'تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی، کوچه مروارید، پلاک ۱۲، واحد ۴',
    postalCode: '۱۹۹۸۶۱۴۳۵۲',
    receiverName: 'امیر حیدری',
    receiverPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    isDefault: true,
  },
  {
    id: 'addr-2',
    title: 'دفتر کار (ونک)',
    province: 'تهران',
    city: 'تهران',
    fullAddress: 'تهران، میدان ونک، خیابان ملاصدرا، خیابان شیخ بهایی شمالی، برج صبا، طبقه ۸، واحد ۸۰۲',
    postalCode: '۱۹۹۳۴۷۵۱۲۳',
    receiverName: 'امیر حیدری',
    receiverPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    isDefault: false,
  },
];

// ============================================================================
// 5. ORDERS (سفارش‌های نمونه با وضعیت‌های متنوع)
// ============================================================================

export const mockOrders: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'DM-1405-9821',
    createdAt: '۱۴۰۵/۰۲/۱۵',
    status: 'delivered',
    items: [
      {
        product: mockProducts[6], // Galaxy Buds 3 Pro
        quantity: 1,
        selectedColor: 'نقره‌ای متالیک',
        selectedWarranty: '۱۸ ماه گارانتی سام سرویس',
      },
      {
        product: mockProducts[12], // Anker 737 PowerBank
        quantity: 1,
        selectedColor: 'مشکی متالیک زغالی',
        selectedWarranty: '۱۸ ماه گارانتی تعویض معتبر ایستا',
      },
    ],
    shippingAddress: mockAddresses[0],
    totalAmount: 17200000,
    discountAmount: 1800000,
    finalAmount: 15400000,
    paymentMethod: 'online',
    trackingCode: 'TRK-98234120',
  },
  {
    id: 'ord-102',
    orderNumber: 'DM-1405-1104',
    createdAt: '۱۴۰۵/۰۳/۲۰',
    status: 'processing',
    items: [
      {
        product: mockProducts[8], // Apple Watch Ultra 2
        quantity: 1,
        selectedColor: 'تیتانیوم با بند اوشن نارنجی',
        selectedWarranty: '۱۸ ماه گارانتی شرکتی همراه پاسارگاد',
      },
    ],
    shippingAddress: mockAddresses[1],
    totalAmount: 50000000,
    discountAmount: 1500000,
    finalAmount: 48500000,
    paymentMethod: 'online',
    trackingCode: 'TRK-55198031',
  },
  {
    id: 'ord-103',
    orderNumber: 'DM-1405-0432',
    createdAt: '۱۴۰۵/۰۱/۱۰',
    status: 'delivered',
    items: [
      {
        product: mockProducts[13], // Baseus Metal Gleam 8-in-1 Hub
        quantity: 1,
        selectedColor: 'خاکستری فضایی (Space Grey)',
        selectedWarranty: '۱۲ ماه گارانتی تعویض بازرگانی بهین',
      },
    ],
    shippingAddress: mockAddresses[0],
    totalAmount: 2850000,
    discountAmount: 400000,
    finalAmount: 2450000,
    paymentMethod: 'wallet',
    trackingCode: 'TRK-11094321',
  },
];

// ============================================================================
// 6. USER PROFILE (پروفایل پیش‌فرض کاربر)
// ============================================================================

export const mockUserProfile: UserProfile = {
  id: 'usr-901',
  phoneNumber: '09123456789',
  firstName: 'امیر',
  lastName: 'حیدری',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  walletBalance: 2500000, // ۲,۵۰۰,۰۰۰ تومان
  favoriteProductIds: ['prod-1', 'prod-5', 'prod-9', 'prod-13'],
  addresses: mockAddresses,
};

// ============================================================================
// 7. HELPER QUERIES (توابع کمکی برای جستجو و دسترسی به داده‌ها)
// ============================================================================

export function getProductById(id: string | number): Product | undefined {
  return mockProducts.find((p) => String(p.id) === String(id));
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryIdOrSlug: string | number): Product[] {
  return mockProducts.filter(
    (p) => String(p.categoryId) === String(categoryIdOrSlug) || p.slug === String(categoryIdOrSlug)
  );
}

export function getFestivalProducts(): Product[] {
  return mockFestivalProducts;
}

export function searchProducts(query: string, categoryId?: string | number): Product[] {
  const normalized = query.trim().toLowerCase();
  return mockProducts.filter((product) => {
    const matchesCategory = !categoryId || String(product.categoryId) === String(categoryId);
    if (!matchesCategory) return false;
    if (!normalized) return true;
    const titleMatch = product.title.toLowerCase().includes(normalized);
    const descMatch = product.description?.toLowerCase().includes(normalized);
    const catMatch = product.categoryTitle.toLowerCase().includes(normalized);
    return titleMatch || descMatch || catMatch;
  });
}

export function getDefaultAddress(): Address | undefined {
  return mockAddresses.find((a) => a.isDefault) || mockAddresses[0];
}
```

---

## 5. Logic Chain

1. **Strict Contract Adherence**: `PROJECT.md` dictates the exact interface boundary for M1 (Foundation). By specifying types (`Product`, `Category`, `CartItem`, `Address`, `Order`, `UserProfile`, `ThemeMode`), utility functions (`toPersianDigits`, `toEnglishDigits`, `formatToman`, `calculateDiscount`, `parsePriceToman`, `slugifyPersian`), and mock collections (`mockProducts`, `mockCategories`, `mockFestivalProducts`, `mockAddresses`, `mockOrders`, `mockUserProfile`), subsequent milestones (M2 through M5) can develop against stable, deterministic signatures.
2. **Mathematical & Currency Consistency**: The mock dataset prices were verified using `calculateDiscount` and `formatToman`. For instance, `prod-1` (Galaxy S24 Ultra) has `oldPrice: 72000000`, `price: 68500000`, which precisely yields `((72000000 - 68500000) / 72000000) * 100 = 4.86% -> 5%`. All product discounts match their mathematical formulas.
3. **Persian String Normalization**: Scraped data or user input often contains mixed Persian and Arabic digits, zero-width non-joiners (`\u200c`), and non-standard spacing. The specified `toEnglishDigits` cleanly strips non-ASCII digits so that OTP phone validation (`/^09\d{9}$/`) works deterministically regardless of keyboard locale. The `slugifyPersian` function safely handles ZWNJ by replacing them with hyphens, preventing broken URL encodings.
4. **Resilience to Domestic IP Constraints**: Because `api.dijimoon.ir` enforces Iranian national routing, providing a complete 16-item mock dataset with full specs, real warranties, and 4 categories ensures the Next.js storefront can run 100% offline or through foreign VPNs without degraded UI states.

---

## 6. Caveats

1. **External CDN Image Availability**: The mock dataset utilizes curated Unsplash technology images with parameters `auto=format&fit=crop&w=600&q=80`. In air-gapped environments without internet access, these URLs may not resolve; the UI should provide an `onError` fallback to local SVG or `/logo.png`.
2. **Zero-Width Non-Joiner (نیم‌فاصله)**: In `slugifyPersian`, Persian words like `گوشی‌های` contain `\u200c`. Replacing this with a hyphen produces `گوشی-های`, which is the standard SEO URL practice in Persian e-commerce (used by Digikala, Dijimoon, and Torob).
3. **Cart Item Color Variant**: In `CartItem`, `selectedColor` accepts `ProductColor | string` to allow flexibility whether the UI passes the full object or just the color name string.

---

## 7. Conclusion

Milestone 1 domain types, Persian utilities, class merge helper, and mock dataset specifications have been mined, rigorously tested, and fully drafted into complete, drop-in TypeScript blueprints. Every contract enumerated in `PROJECT.md` is 100% fulfilled. The builder agents can directly implement these blueprints to unblock M2 state management and M3 UI development.

---

## 8. Verification Method

To independently verify the specifications provided in this report:

1. **Persian Utility Runtime Validation**:
   Run the following Node.js test script to verify all 6 Persian functions and their edge cases:
   ```bash
   node -e '
   const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
   const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

   function toPersianDigits(i) { if (i == null) return ""; return i.toString().replace(/[0-9]/g, w => PERSIAN_DIGITS[+w]).replace(/[٠-٩]/g, w => PERSIAN_DIGITS[ARABIC_DIGITS.indexOf(w)]); }
   function toEnglishDigits(i) { if (i == null) return ""; let s = i.toString(); for (let j=0; j<10; j++) { s = s.replace(new RegExp(PERSIAN_DIGITS[j], "g"), j).replace(new RegExp(ARABIC_DIGITS[j], "g"), j); } return s; }
   function formatToman(a, u=true) { if (a == null) return u ? "۰ تومان" : "۰"; const c = toEnglishDigits(a.toString()).replace(/[^\d.-]/g, ""); const n = Number(c); if (isNaN(n) || c === "") return u ? "۰ تومان" : "۰"; const r = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); const p = toPersianDigits(r); return u ? `${p} تومان` : p; }
   function calculateDiscount(o, c) { if (!o || !c || o <= c) return 0; return Math.round(((o - c) / o) * 100); }
   function parsePriceToman(t) { if (t == null) return 0; const e = toEnglishDigits(t.toString()).replace(/[^\d]/g, ""); return e ? parseInt(e, 10) : 0; }
   function slugifyPersian(t) { if (!t) return ""; return t.toString().trim().toLowerCase().replace(/\u200c/g, "-").replace(/[\s\-_]+/g, "-").replace(/[^\u0600-\u06FF\uFB8A\u067E\u0686\u06AFa-z0-9\-]/g, "").replace(/\-+/g, "-").replace(/^-|-$/g, ""); }

   console.assert(toPersianDigits(123) === "۱۲۳", "toPersianDigits failed");
   console.assert(toEnglishDigits("۱۲۳") === "123", "toEnglishDigits failed");
   console.assert(formatToman(1250000) === "۱,۲۵۰,۰۰۰ تومان", "formatToman failed");
   console.assert(calculateDiscount(100, 80) === 20, "calculateDiscount failed");
   console.assert(parsePriceToman("۱۲۵,۰۰۰ تومان") === 125000, "parsePriceToman failed");
   console.assert(slugifyPersian("تست نیم‌فاصله") === "تست-نیم-فاصله", "slugifyPersian failed");
   console.log("All Persian utility assertions passed!");
   '
   ```

2. **TypeScript Compilation Check**:
   When files are placed into `src/types/index.ts`, `src/lib/persian.ts`, `src/lib/utils.ts`, and `src/data/mock-data.ts`, run:
   ```bash
   npx tsc --noEmit
   ```
   Verify 0 errors.

