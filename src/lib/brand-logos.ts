export interface BrandLogo {
  /** Stable unique id (file basename without extension). */
  id: string;
  /** Persian display name used for alt text / dev tooltips. */
  label: string;
  /** Path under `public/` — official mark of an Iranian brand. */
  src: string;
}

/**
 * Official Iranian brand marks rendered behind the home hero (see
 * HomeHero's BrandRain). Files live in `public/brands/` — sourced from each
 * brand owner's website or Wikimedia (Commons / fa.wikipedia), trimmed and
 * downscaled to ≤320px by `scripts/prepare-brand-logos.mjs`.
 * Order is interleaved (dairy / grocery / beverage / snack) so the round-robin
 * column split never piles one category into one column.
 */
export const BRAND_LOGOS: BrandLogo[] = [
  { id: 'kalleh', label: 'کاله', src: '/brands/kalleh.png' },
  { id: 'minoo', label: 'مینو', src: '/brands/minoo.svg' },
  { id: 'sahar', label: 'سحر', src: '/brands/sahar.svg' },
  { id: 'golstan', label: 'گلستان', src: '/brands/golstan.png' },
  { id: 'pegah', label: 'پگاه', src: '/brands/pegah.png' },
  { id: 'mazmaz', label: 'مزمز', src: '/brands/mazmaz.png' },
  { id: 'farmand', label: 'فرمند', src: '/brands/farmand.jpg' },
  { id: 'shirin-asal', label: 'شیرین عسل', src: '/brands/shirin-asal.svg' },
  { id: 'kooshyar', label: 'کوشیر', src: '/brands/kooshyar.png' },
  { id: 'zamzam', label: 'زمزم', src: '/brands/zamzam.png' },
  { id: 'sunich', label: 'سن‌ایچ', src: '/brands/sunich.png' },
  { id: 'solico', label: 'سولیکو', src: '/brands/solico.jpg' },
];

/** `true` for raster marks — SVGs must bypass the Next.js image optimizer. */
export function isRasterBrandLogo(src: string): boolean {
  return !src.toLowerCase().endsWith('.svg');
}
