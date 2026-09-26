/**
 * Persian / RTL Formatting & Normalization Utilities
 * Handles Persian digits, Toman formatting, and Jalali date support.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Converts English or Arabic digits in a string/number to standard Persian digits.
 */
export function toPersianDigits(input: string | number): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  return str
    .replace(/[0-9]/g, (w) => PERSIAN_DIGITS[+w])
    .replace(/[٠-٩]/g, (w) => PERSIAN_DIGITS[ARABIC_DIGITS.indexOf(w)]);
}

/**
 * Converts Persian and Arabic digits to standard ASCII English digits.
 */
export function toEnglishDigits(input: string): string {
  if (!input) return '';
  let str = input;
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(PERSIAN_DIGITS[i], 'g'), i.toString());
    str = str.replace(new RegExp(ARABIC_DIGITS[i], 'g'), i.toString());
  }
  return str;
}

/**
 * Formats a number as Iranian Toman with thousand separators (e.g. ۱۲۵,۰۰۰ تومان).
 */
export function formatToman(amount: number | string, includeUnit = true): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return includeUnit ? `۰ تومان` : `۰`;
  }
  const cleanNum = Math.round(Number(toEnglishDigits(amount.toString())));
  const formatted = cleanNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const persianFormatted = toPersianDigits(formatted);
  return includeUnit ? `${persianFormatted} تومان` : persianFormatted;
}

/**
 * Calculates discount percentage between original price and sale price.
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Parses raw text from scraping into a valid numeric Toman value.
 */
export function parsePriceToman(rawText: string): number {
  if (!rawText) return 0;
  const english = toEnglishDigits(rawText);
  const digitsOnly = english.replace(/[^\d]/g, '');
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
}
