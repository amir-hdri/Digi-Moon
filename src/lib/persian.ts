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
  return input
    .toString()
    .replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[+digit])
    .replace(/[٠-٩]/g, (digit) => PERSIAN_DIGITS[ARABIC_DIGITS.indexOf(digit)]);
}

// Single-pass digit map: one lookup per character instead of 20 `new RegExp()` allocations.
// `formatToman` calls this for every price on screen, so the old loop showed up on scroll.
const ENGLISH_FROM_PERSIAN: Record<string, string> = PERSIAN_DIGITS.reduce<Record<string, string>>(
  (acc, digit, index) => {
    acc[digit] = String(index);
    return acc;
  },
  {}
);
const ENGLISH_FROM_ARABIC: Record<string, string> = ARABIC_DIGITS.reduce<Record<string, string>>(
  (acc, digit, index) => {
    acc[digit] = String(index);
    return acc;
  },
  {}
);

/**
 * Converts Persian (۰-۹) and Arabic (٠-٩) digits to standard ASCII English digits (0-9).
 * Essential for normalizing phone numbers and OTP codes before validation and API calls.
 */
export function toEnglishDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  return input
    .toString()
    .replace(/[۰-۹٠-٩]/g, (digit) => ENGLISH_FROM_PERSIAN[digit] ?? ENGLISH_FROM_ARABIC[digit] ?? digit);
}

/**
 * Folds the Persian/Arabic letter variants Iranian keyboards actually produce into one
 * canonical form so search matches regardless of which layout the shopper typed on.
 *
 * - `ي` (U+064A Arabic yeh)  → `ی` (U+06CC Persian yeh)
 * - `ك` (U+0643 Arabic kaf)  → `ک` (U+06A9 Persian keheh)
 * - `ۀ`/`ة`                 → `ه`
 * - Arabic/Persian digits    → ASCII
 * - ZWNJ (U+200C)            → space, so "می‌شود" matches "می شود"
 * - `أإآ`/`ؤ`                → bare alef/hamza forms
 */
export function normalizePersian(input: string | null | undefined): string {
  if (!input) return '';
  return toEnglishDigits(input)
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ۀةۃ]/g, 'ه')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ی')
    .replace(/‌/g, ' ')
    .replace(/[ً-ْـ]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
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
  if (
    originalPrice === null ||
    originalPrice === undefined ||
    originalPrice <= 0 ||
    currentPrice === null ||
    currentPrice === undefined ||
    currentPrice < 0 ||
    originalPrice <= currentPrice
  ) {
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

export function timeAgoFa(dateInput: string | number | Date): string {
  const time = new Date(dateInput).getTime();
  if (Number.isNaN(time)) return '';
  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (seconds < 60) return 'لحظاتی پیش';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${toPersianDigits(minutes)} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${toPersianDigits(days)} روز پیش`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${toPersianDigits(months)} ماه پیش`;
  return `${toPersianDigits(Math.floor(months / 12))} سال پیش`;
}

/**
 * Jalali (Solar Hijri) calendar conversion — no dependency, proleptic Gregorian algorithms.
 * Used for order numbers and order-history dates so the UI never shows a Latin year.
 */
const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

function div(a: number, b: number): number {
  return Math.trunc(a / b);
}

/** Converts a Gregorian `Date` to its Jalali `{ year, month, day }` parts. */
export function toJalali(date: Date = new Date()): { year: number; month: number; day: number } {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) +
    gd +
    gDaysInMonth.slice(0, gm - 1).reduce((a, b) => a + b, 0);

  const jy = -1595 + 33 * div(days, 12053);
  days %= 12053;
  const year = jy + 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    const extraYears = div(days - 1, 365);
    days = (days - 1) % 365;
    return { year: year + extraYears, month: div(days, 31) + 1, day: (days % 31) + 1 };
  }
  return { year, month: div(days, 31) + 1, day: (days % 31) + 1 };
}

/** `۱۴۰۵/۰۶/۳۱` */
export function formatJalaliDate(date: Date = new Date()): string {
  const { year, month, day } = toJalali(date);
  return toPersianDigits(`${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`);
}

/** `۳۱ شهریور ۱۴۰۵` */
export function formatJalaliLong(date: Date = new Date()): string {
  const { year, month, day } = toJalali(date);
  return `${toPersianDigits(day)} ${JALALI_MONTHS[month - 1]} ${toPersianDigits(year)}`;
}

/** `MM-1405-4821` — brand-scoped, Jalali-year order reference. */
export function buildOrderNumber(date: Date = new Date()): string {
  const { year } = toJalali(date);
  return `MM-${year}-${String(1000 + Math.floor(Math.random() * 9000))}`;
}

/** `TRK-98234120` */
export function buildTrackingCode(): string {
  return `TRK-${Math.floor(10000000 + Math.random() * 89999999)}`;
}

/**
 * Normalizes any Iranian mobile spelling to bare `09xxxxxxxxx`.
 * Accepts Persian/Arabic digits, spaces, dashes, a leading `+98`, and a leading `0` on `98…`.
 * Returns an empty string when the result is not a valid 11-digit Iranian mobile number.
 *
 * Example: `normalizeIranianMobile('+۹۸ ۹۱۲ ۳۴۵ ۶۷۸۹')` → `09123456789`
 */
export function normalizeIranianMobile(input: string | null | undefined): string {
  if (!input) return '';
  let digits = toEnglishDigits(input).replace(/\D/g, '');
  if (digits.startsWith('+98')) digits = `0${digits.slice(3)}`;
  else if (digits.startsWith('98') && digits.length === 12) digits = `0${digits.slice(2)}`;
  else if (digits.startsWith('0098')) digits = `0${digits.slice(4)}`;
  return /^09\d{9}$/.test(digits) ? digits : '';
}

/** `true` when the string is a valid 11-digit Iranian mobile number in any digit script. */
export function isValidIranianMobile(input: string | null | undefined): boolean {
  return normalizeIranianMobile(input) !== '';
}
