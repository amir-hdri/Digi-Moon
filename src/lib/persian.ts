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

/** Truncated modulo that always returns a non-negative result, unlike `%`. */
function mod(a: number, b: number): number {
  return a - b * Math.floor(a / b);
}

/**
 * Converts a Gregorian `Date` to its Jalali (Solar Hijri) `{ year, month, day }`.
 *
 * Calendar arithmetic ported from jalaali-js (break-table leap cycles over
 * Julian Day Numbers; see Borkowski's analysis and the Fourmilab calendar
 * reference cited there). `tests/e2e/tier5_shared_foundations.spec.ts`
 * cross-checks this against `Intl.DateTimeFormat('en-US-u-ca-persian')` over a
 * 20-year window, plus month-length and Nowruz-boundary checks.
 */
export function toJalali(date: Date = new Date()): { year: number; month: number; day: number } {
  const jdn = gregorianToJd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const converted = jdToJalali(jdn);
  return { year: converted.jy, month: converted.jm, day: converted.jd };
}

/**
 * Julian Day Number for a Gregorian date (jalaali-js `g2d`).
 * Verified: `gregorianToJd(2024, 3, 20) === 2460390`.
 */
function gregorianToJd(y: number, m: number, d: number): number {
  let days =
    div((y + div(m - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(m + 9, 12) + 2, 5) +
    d -
    34840408;
  days = days - div(div(y + 100100 + div(m - 8, 6), 100) * 3, 4) + 752;
  return days;
}

/** Gregorian date for a Julian Day Number (jalaali-js `d2g`). */
function gregorianFromJd(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(tmod(j, 1461), 4) * 5 + 308;
  const gd = div(tmod(i, 153), 5) + 1;
  const gm = tmod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

/**
 * Truncating remainder with jalaali-js `mod` semantics. Unlike the floor-based
 * `mod` above it can return negative values (e.g. `tmod(-1, 4) === -1`), which
 * the leap calculation below depends on — do not "simplify" these together.
 */
function tmod(a: number, b: number): number {
  return a - Math.trunc(a / b) * b;
}

/** Start years of the 33-year leap-cycle rules (jalaali-js `breaks`). */
const JALALI_BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
  2192, 2262, 2324, 2394, 2456, 3178,
];

/**
 * Leap status and Gregorian March day of Farvardin 1st for a Jalali year
 * (jalaali-js `jalCal`). `leap` is years since the last leap year (0–4).
 */
function jalCal(jy: number): { leap: number; gy: number; march: number } {
  const bl = JALALI_BREAKS.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = JALALI_BREAKS[0];
  let jm = 0;
  let jump = 0;
  if (jy < jp || jy >= JALALI_BREAKS[bl - 1]) throw new Error(`Invalid Jalaali year ${jy}`);
  // Find the limiting years for the Jalaali year jy.
  for (let i = 1; i < bl; i += 1) {
    jm = JALALI_BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(tmod(jump, 33), 4);
    jp = jm;
  }
  const n = jy - jp;
  // Leap years from AD 621 to the beginning of the current Jalaali year.
  leapJ = leapJ + div(n, 33) * 8 + div(tmod(n, 33) + 3, 4);
  if (tmod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  // Same in the Gregorian calendar, then the March day of Farvardin 1st.
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  // Years since the last leap year.
  let nn = n;
  if (jump - n < 6) nn = n - jump + div(jump + 4, 33) * 33;
  let leap = tmod(tmod(nn + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

/** Jalali date for a Julian Day Number (jalaali-js `d2j`). */
function jdToJalali(jdn: number): { jy: number; jm: number; jd: number } {
  const gy = gregorianFromJd(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = gregorianToJd(gy, 3, r.march);
  // Days passed since 1 Farvardin.
  let k = jdn - jdn1f;
  let jm: number;
  let jd: number;
  if (k >= 0) {
    if (k <= 185) {
      // The first 6 months.
      jm = 1 + div(k, 31);
      jd = tmod(k, 31) + 1;
      return { jy, jm, jd };
    }
    // The remaining months.
    k -= 186;
  } else {
    // Previous Jalaali year.
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + div(k, 30);
  jd = tmod(k, 30) + 1;
  return { jy, jm, jd };
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
  // `\D` stripping already removed the `+`, so there is no `+98` case to test here.
  let digits = toEnglishDigits(input).replace(/\D/g, '');
  if (digits.startsWith('0098')) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith('98') && digits.length === 12) digits = `0${digits.slice(2)}`;
  return /^09\d{9}$/.test(digits) ? digits : '';
}

/** `true` when the string is a valid 11-digit Iranian mobile number in any digit script. */
export function isValidIranianMobile(input: string | null | undefined): boolean {
  return normalizeIranianMobile(input) !== '';
}
