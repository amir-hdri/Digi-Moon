/**
 * MoonMarket Storefront — Inline SVG Product Visuals
 *
 * Category packshots, encoded as `data:` URIs so they need no network round-trip and
 * survive the CDN/IP filtering that the real dijimoon.ir backend sits behind.
 *
 * The eight consumer-electronics packshots this file used to carry were reachable only
 * from `getProductSvg()`, which nothing imported. They were `encodeURIComponent`-ed on
 * every page load and shipped in the client bundle for no reason, so they were removed
 * (31 KB → 11 KB of source).
 *
 * Location: src/lib/product-images.ts
 */

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim().replace(/\s+/g, ' '))}`;
}

/**
 * Fallback for products with no artwork. The components previously pointed at
 * `/images/placeholder.png`, a path that does not exist in `public/` — every such card
 * rendered a broken-image glyph.
 */
export const PRODUCT_PLACEHOLDER = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" rx="48" fill="#f1f5f9"/>
  <g stroke="#cbd5e1" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="110" y="130" width="180" height="150" rx="18"/>
    <path d="M110 245l45-52 38 42 32-30 65 66"/>
  </g>
  <circle cx="252" cy="168" r="16" fill="#cbd5e1"/>
  <text x="200" y="322" font-size="26" font-weight="700" fill="#94a3b8" text-anchor="middle" font-family="sans-serif">بدون تصویر</text>
</svg>
`);

// 1. Groceries & Cooking Oil Packshot (روغن و کالای اساسی)
export const GROCERY_OIL_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="oil-bottle" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="oil-cap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <filter id="shadow-oil" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>
  <ellipse cx="200" cy="365" rx="80" ry="12" fill="#000" opacity="0.15" filter="blur(6px)"/>
  <!-- Bottle Body -->
  <rect x="145" y="110" width="110" height="235" rx="20" fill="url(#oil-bottle)" filter="url(#shadow-oil)"/>
  <rect x="175" y="65" width="50" height="50" rx="6" fill="url(#oil-bottle)"/>
  <!-- Cap -->
  <rect x="170" y="45" width="60" height="25" rx="5" fill="url(#oil-cap)"/>
  <!-- Label -->
  <rect x="150" y="160" width="100" height="130" rx="8" fill="#ffffff" opacity="0.95"/>
  <circle cx="200" cy="205" r="22" fill="#10b981" opacity="0.2"/>
  <path d="M200 190 C190 205 190 215 200 225 C210 215 210 205 200 190 Z" fill="#059669"/>
  <text x="200" y="250" font-size="14" font-weight="900" fill="#1e293b" text-anchor="middle" font-family="sans-serif">روغن زیتون</text>
  <text x="200" y="270" font-size="10" font-weight="bold" fill="#059669" text-anchor="middle" font-family="sans-serif">فرابکر خالص</text>
</svg>
`);

// 10. Dairy Milk Packshot (شیر و لبنیات تازه)
export const DAIRY_MILK_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="milk-carton" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="milk-accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="365" rx="75" ry="12" fill="#000" opacity="0.15" filter="blur(6px)"/>
  <!-- Gable Top Carton -->
  <polygon points="150,110 200,60 250,110" fill="url(#milk-accent)"/>
  <rect x="145" y="110" width="110" height="235" rx="8" fill="url(#milk-carton)"/>
  <rect x="145" y="220" width="110" height="125" rx="4" fill="url(#milk-accent)"/>
  <!-- Label Graphics -->
  <circle cx="200" cy="165" r="28" fill="#e0f2fe"/>
  <text x="200" y="172" font-size="16" font-weight="900" fill="#0369a1" text-anchor="middle" font-family="sans-serif">شیر تازه</text>
  <text x="200" y="260" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">کم‌چرب ۱.۵٪</text>
  <text x="200" y="285" font-size="11" fill="#bae6fd" text-anchor="middle" font-family="sans-serif">۱ لیتر خالص</text>
</svg>
`);

// 11. Hygiene & Shampoo Packshot (آرایشی و بهداشتی)
export const HYGIENE_SHAMPOO_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="shampoo-bottle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899"/>
      <stop offset="50%" stop-color="#db2777"/>
      <stop offset="100%" stop-color="#be185d"/>
    </linearGradient>
    <linearGradient id="pump-head" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="365" rx="70" ry="12" fill="#000" opacity="0.15" filter="blur(6px)"/>
  <!-- Bottle -->
  <rect x="150" y="115" width="100" height="230" rx="24" fill="url(#shampoo-bottle)"/>
  <!-- Pump Dispenser -->
  <rect x="192" y="75" width="16" height="40" rx="3" fill="url(#pump-head)"/>
  <rect x="175" y="60" width="55" height="18" rx="5" fill="url(#pump-head)"/>
  <rect x="160" y="65" width="20" height="8" rx="2" fill="url(#pump-head)"/>
  <!-- Label -->
  <rect x="160" y="170" width="80" height="120" rx="12" fill="#ffffff" opacity="0.95"/>
  <circle cx="200" cy="205" r="18" fill="#fce7f3"/>
  <path d="M200 195 L203 203 L211 204 L205 210 L207 218 L200 213 L193 218 L195 210 L189 204 L197 203 Z" fill="#db2777"/>
  <text x="200" y="242" font-size="12" font-weight="900" fill="#831843" text-anchor="middle" font-family="sans-serif">شامپو تخصصی</text>
  <text x="200" y="260" font-size="9" font-weight="bold" fill="#db2777" text-anchor="middle" font-family="sans-serif">تقویت‌کننده و نرم‌کننده</text>
</svg>
`);

// 12. Cleaning & Detergent Packshot (مواد شوینده)
export const CLEANING_DETERGENT_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="detergent-body" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="50%" stop-color="#14b8a6"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="365" rx="75" ry="12" fill="#000" opacity="0.15" filter="blur(6px)"/>
  <!-- Handle Bottle Shape -->
  <path d="M160 110 L220 110 C245 110 260 135 255 170 L250 330 C250 345 235 350 200 350 C165 350 150 345 150 330 L145 170 C140 135 150 110 160 110 Z" fill="url(#detergent-body)"/>
  <!-- Cap -->
  <rect x="175" y="65" width="50" height="45" rx="8" fill="#f43f5e"/>
  <!-- Label -->
  <rect x="160" y="180" width="80" height="110" rx="10" fill="#ffffff"/>
  <text x="200" y="225" font-size="13" font-weight="900" fill="#0f766e" text-anchor="middle" font-family="sans-serif">مایع ظرفشویی</text>
  <text x="200" y="248" font-size="10" font-weight="bold" fill="#f43f5e" text-anchor="middle" font-family="sans-serif">با رایحه لیمو</text>
  <text x="200" y="270" font-size="9" fill="#64748b" text-anchor="middle" font-family="sans-serif">چربی‌زدایی عمیق</text>
</svg>
`);

// 13. Beverages & Tea Packshot (چای و نوشیدنی)
export const BEVERAGE_TEA_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tea-box" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b45309"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="365" rx="85" ry="12" fill="#000" opacity="0.15" filter="blur(6px)"/>
  <!-- Tea Box -->
  <rect x="135" y="110" width="130" height="235" rx="12" fill="url(#tea-box)"/>
  <!-- Gold Border Trim -->
  <rect x="145" y="125" width="110" height="205" rx="8" fill="none" stroke="#fef3c7" stroke-width="2"/>
  <!-- Emblem -->
  <circle cx="200" cy="180" r="28" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>
  <path d="M200 165 C190 178 190 188 200 195 C210 188 210 178 200 165 Z" fill="#fbbf24"/>
  <text x="200" y="235" font-size="15" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="sans-serif">چای ممتاز لاهیجان</text>
  <text x="200" y="260" font-size="11" font-weight="bold" fill="#fef3c7" text-anchor="middle" font-family="sans-serif">صد درصد ارگانیک</text>
  <text x="200" y="285" font-size="10" fill="#fde68a" text-anchor="middle" font-family="sans-serif">وزن ۵۰۰ گرم</text>
</svg>
`);

// 14. Snacks & Chocolate Packshot (تنقلات و شیرینی)
export const SNACK_CHOCOLATE_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="choc-wrap" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="50%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#3f1a08"/>
    </linearGradient>
    <linearGradient id="foil" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#fde68a"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="365" rx="85" ry="12" fill="#000" opacity="0.15" filter="blur(6px)"/>
  <!-- Outer Wrapper -->
  <rect x="135" y="110" width="130" height="235" rx="10" fill="url(#choc-wrap)"/>
  <!-- Foil Corner Ribbon -->
  <polygon points="135,110 185,110 135,160" fill="url(#foil)"/>
  <!-- Center Seal -->
  <rect x="145" y="175" width="110" height="105" rx="8" fill="#1c0b03" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="200" y="215" font-size="14" font-weight="900" fill="#fde68a" text-anchor="middle" font-family="sans-serif">شکلات تلخ ۷۸٪</text>
  <text x="200" y="240" font-size="11" font-weight="bold" fill="#fef3c7" text-anchor="middle" font-family="sans-serif">دست‌ساز لوکس</text>
</svg>
`);

// 15. Protein & Tuna Packshot (پروتئینی و کنسرو)
export const PROTEIN_TUNA_SVG = svgToDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="can-metal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#cbd5e1"/>
      <stop offset="50%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>
    <linearGradient id="tuna-label" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#1e40af"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="365" rx="90" ry="14" fill="#000" opacity="0.15" filter="blur(6px)"/>
  <!-- Can Body -->
  <rect x="130" y="140" width="140" height="180" rx="16" fill="url(#can-metal)"/>
  <ellipse cx="200" cy="140" rx="70" ry="24" fill="url(#can-metal)" stroke="#94a3b8" stroke-width="2"/>
  <ellipse cx="200" cy="320" rx="70" ry="24" fill="url(#can-metal)"/>
  <!-- Label Band -->
  <rect x="130" y="180" width="140" height="110" fill="url(#tuna-label)"/>
  <text x="200" y="225" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="sans-serif">کنسرو تن‌ماهی</text>
  <text x="200" y="250" font-size="11" font-weight="bold" fill="#fde047" text-anchor="middle" font-family="sans-serif">در روغن زیتون</text>
  <text x="200" y="270" font-size="9" fill="#93c5fd" text-anchor="middle" font-family="sans-serif">فیله خالص ۱۸۰ گرم</text>
</svg>
`);
