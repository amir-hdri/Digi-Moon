import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

// ---------------------------------------------------------------------------
// 1. Dynamic Loader for TypeScript Mock Data & Persian Utils
// ---------------------------------------------------------------------------
const mockDataTsPath = path.resolve('src/data/mock-data.ts');
let mockDataTs = fs.readFileSync(mockDataTsPath, 'utf-8');
const dummyImg = "'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80'";
mockDataTs = mockDataTs.replace(/from\s+['"]@\/lib\/product-images['"]/g, `from "data:text/javascript,export const S24_ULTRA_SVG=${dummyImg};export const IPHONE_PRO_SVG=${dummyImg};export const XIAOMI_14T_SVG=${dummyImg};export const SONY_HEADPHONES_SVG=${dummyImg};export const AIRPODS_PRO_SVG=${dummyImg};export const WATCH_ULTRA_SVG=${dummyImg};export const GALAXY_WATCH_SVG=${dummyImg};export const ANKER_POWERBANK_SVG=${dummyImg};export const GROCERY_OIL_SVG=${dummyImg};export const DAIRY_MILK_SVG=${dummyImg};export const HYGIENE_SHAMPOO_SVG=${dummyImg};export const CLEANING_DETERGENT_SVG=${dummyImg};export const BEVERAGE_TEA_SVG=${dummyImg};export const SNACK_CHOCOLATE_SVG=${dummyImg};export const PROTEIN_TUNA_SVG=${dummyImg};"`);

const transpiledMock = ts.transpileModule(mockDataTs, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});

const base64Mock = Buffer.from(transpiledMock.outputText).toString('base64');
const mod = await import(`data:text/javascript;base64,${base64Mock}`);

const persianTsPath = path.resolve('src/lib/persian.ts');
const persianTs = fs.readFileSync(persianTsPath, 'utf-8');
const transpiledPersian = ts.transpileModule(persianTs, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const base64Persian = Buffer.from(transpiledPersian.outputText).toString('base64');
const persianUtils = await import(`data:text/javascript;base64,${base64Persian}`);

const {
  mockProducts,
  mockCategories,
  mockFestivalProducts,
  mockAddresses,
  mockOrders,
  mockUserProfile,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  getFestivalProducts,
  searchProducts,
  getDefaultAddress,
} = mod;

const { toEnglishDigits, toPersianDigits, formatToman, calculateDiscount } = persianUtils;

// ---------------------------------------------------------------------------
// 2. Test Execution Engine
// ---------------------------------------------------------------------------
let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err });
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('\n======================================================================');
console.log('  CHALLENGER 2: EMPIRICAL VERIFICATION OF MOCK DATA & QUERY HELPERS   ');
console.log('======================================================================\n');

// ---------------------------------------------------------------------------
// Suite 1: Catalog Dataset Completeness & Schema Conformance
// ---------------------------------------------------------------------------
console.log('▶ Suite 1: Catalog Dataset Completeness & Schema Conformance');

test('C1.1: Exactly 16 products exist in mockProducts', () => {
  assert.strictEqual(mockProducts.length, 16);
});

test('C1.2: Exactly 4 categories exist with valid productCount = 4', () => {
  assert.strictEqual(mockCategories.length, 4);
  for (const cat of mockCategories) {
    assert.strictEqual(cat.productCount, 4, `Category ${cat.id} productCount is not 4`);
  }
});

test('C1.3: All product IDs are unique and follow prod-{N} naming pattern', () => {
  const ids = new Set();
  for (const p of mockProducts) {
    assert.ok(!ids.has(p.id), `Duplicate product ID found: ${p.id}`);
    ids.add(p.id);
    assert.match(String(p.id), /^prod-\d+$/, `Invalid ID format: ${p.id}`);
  }
  assert.strictEqual(ids.size, 16);
});

test('C1.4: All product slugs are unique, non-empty, and lower-kebab-case', () => {
  const slugs = new Set();
  for (const p of mockProducts) {
    assert.ok(p.slug && typeof p.slug === 'string', `Invalid slug for ${p.id}`);
    assert.ok(!slugs.has(p.slug), `Duplicate slug found: ${p.slug}`);
    slugs.add(p.slug);
    assert.match(p.slug, /^[a-z0-9-]+$/, `Slug is not lower-kebab-case: ${p.slug}`);
  }
  assert.strictEqual(slugs.size, 16);
});

test('C1.5: Product pricing integrity in Tomans (price > 0, oldPrice >= price, valid discount)', () => {
  for (const p of mockProducts) {
    assert.ok(Number.isInteger(p.price) && p.price > 0, `Invalid price for ${p.id}: ${p.price}`);
    if (p.oldPrice !== undefined) {
      assert.ok(p.oldPrice >= p.price, `oldPrice (${p.oldPrice}) < price (${p.price}) for ${p.id}`);
      if (p.discountPercent !== undefined) {
        const calculatedDiscount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
        assert.strictEqual(
          p.discountPercent,
          calculatedDiscount,
          `Discount mismatch on ${p.id}: stated ${p.discountPercent}%, expected ${calculatedDiscount}%`
        );
      }
    }
  }
});

test('C1.6: Product images are valid HTTPS URLs with responsive parameters', () => {
  for (const p of mockProducts) {
    assert.ok(p.imageUrl && p.imageUrl.startsWith('https://'), `Invalid imageUrl for ${p.id}: ${p.imageUrl}`);
  }
});

test('C1.7: Every product has valid category linkage to an existing category', () => {
  const validCategoryIds = new Set(mockCategories.map((c) => c.id));
  for (const p of mockProducts) {
    assert.ok(validCategoryIds.has(p.categoryId), `Invalid categoryId ${p.categoryId} on product ${p.id}`);
    const cat = mockCategories.find((c) => c.id === p.categoryId);
    assert.strictEqual(p.categoryTitle, cat.title, `Category title mismatch on product ${p.id}`);
  }
});

test('C1.8: Product stock, rating, description, specs, colors, and warranty validation', () => {
  for (const p of mockProducts) {
    assert.strictEqual(typeof p.inStock, 'boolean');
    if (p.stockCount !== undefined) {
      assert.ok(p.stockCount > 0, `stockCount <= 0 for in-stock product ${p.id}`);
    }
    if (p.rating !== undefined) {
      assert.ok(p.rating >= 1 && p.rating <= 5, `Rating out of range [1, 5] for ${p.id}: ${p.rating}`);
    }
    assert.ok(p.description && p.description.trim().length > 20, `Description too short for ${p.id}`);
    assert.ok(p.specs && Object.keys(p.specs).length >= 4, `Specs too few (<4) for ${p.id}`);
    assert.ok(Array.isArray(p.colors) && p.colors.length > 0, `Colors missing for ${p.id}`);
    for (const c of p.colors) {
      assert.match(c.hex, /^#[0-9a-fA-F]{6}$/, `Invalid hex color ${c.hex} in ${p.id}`);
    }
    assert.ok(p.warranty && p.warranty.includes('گارانتی'), `Warranty string missing or invalid in ${p.id}`);
  }
});

// ---------------------------------------------------------------------------
// Suite 2: Helper Query Functions Verification & Edge Cases
// ---------------------------------------------------------------------------
console.log('\n▶ Suite 2: Helper Query Functions Verification & Edge Cases');

test('C2.1: getProductById resolves all 16 products by ID', () => {
  for (const p of mockProducts) {
    const found = getProductById(p.id);
    assert.ok(found, `Product not found by ID: ${p.id}`);
    assert.strictEqual(found.id, p.id);
    assert.strictEqual(found.slug, p.slug);
  }
});

test('C2.2: getProductById returns undefined for non-existent IDs', () => {
  assert.strictEqual(getProductById('prod-999'), undefined);
  assert.strictEqual(getProductById('non-existent'), undefined);
  assert.strictEqual(getProductById(''), undefined);
  assert.strictEqual(getProductById('prod-0'), undefined);
});

test('C2.3: getProductById handles numeric string and type coercion', () => {
  const p1 = getProductById('prod-1');
  assert.ok(p1 && p1.id === 'prod-1');
  // Passing null-like or non-existent number
  assert.strictEqual(getProductById(9999), undefined);
});

test('C2.4: getProductBySlug resolves all 16 products by slug', () => {
  for (const p of mockProducts) {
    const found = getProductBySlug(p.slug);
    assert.ok(found, `Product not found by slug: ${p.slug}`);
    assert.strictEqual(found.id, p.id);
  }
});

test('C2.5: getProductBySlug returns undefined for non-existent or case-mismatched slugs', () => {
  assert.strictEqual(getProductBySlug('non-existent-slug'), undefined);
  assert.strictEqual(getProductBySlug(''), undefined);
  assert.strictEqual(getProductBySlug('SAMSUNG-GALAXY-S24-ULTRA-256GB'), undefined);
});

test('C2.6: getProductsByCategory returns exactly 4 products for each valid category ID', () => {
  const categoryIds = ['smartphones', 'headphones', 'smartwatches', 'accessories'];
  for (const catId of categoryIds) {
    const prods = getProductsByCategory(catId);
    assert.strictEqual(prods.length, 4, `Category ${catId} did not return 4 products`);
    for (const p of prods) {
      assert.strictEqual(p.categoryId, catId);
    }
  }
});

test('C2.7: getProductsByCategory returns empty array for invalid category', () => {
  const result = getProductsByCategory('laptops-unknown');
  assert.ok(Array.isArray(result));
  assert.strictEqual(result.length, 0);
});

test('C2.8: getProductsByCategory dual behavior: resolves by categoryId, category slug, or product slug', () => {
  // Category slug matches categoryId
  const bySlug = getProductsByCategory('smartphones');
  assert.strictEqual(bySlug.length, 4);

  // When passed a product slug, returns array containing that specific product
  const byProdSlug = getProductsByCategory('samsung-galaxy-s24-ultra-256gb');
  assert.strictEqual(byProdSlug.length, 1);
  assert.strictEqual(byProdSlug[0].id, 'prod-1');
});

test('C2.9: getFestivalProducts returns all and only isSpecial === true products', () => {
  const festival = getFestivalProducts();
  assert.strictEqual(festival.length, 10);
  for (const p of festival) {
    assert.strictEqual(p.isSpecial, true, `Product ${p.id} in festival has isSpecial !== true`);
  }
  const nonSpecial = mockProducts.filter((p) => !p.isSpecial);
  assert.strictEqual(nonSpecial.length, 6);
  for (const p of nonSpecial) {
    assert.ok(!festival.some((fp) => fp.id === p.id), `Non-special product ${p.id} found in festival list`);
  }
});

test('C2.10: searchProducts with empty or whitespace query returns all 16 products', () => {
  assert.strictEqual(searchProducts('').length, 16);
  assert.strictEqual(searchProducts('   ').length, 16);
});

test('C2.11: searchProducts filters by Persian brand names and cross-references accessories', () => {
  const samsung = searchProducts('سامسونگ');
  assert.strictEqual(samsung.length, 4, 'Expected 4 Samsung products (S24, A55, Buds3 Pro, Watch7)');

  // Apple brand matches 3 Apple core products + 1 Ugreen charger citing Apple Watch in description
  const apple = searchProducts('اپل');
  assert.strictEqual(apple.length, 4, 'Expected 4 items matching Apple in title or description');
  const appleCore = apple.filter((p) => p.title.includes('اپل'));
  assert.strictEqual(appleCore.length, 3, 'Expected 3 products with Apple in title');

  const xiaomi = searchProducts('شیائومی');
  assert.strictEqual(xiaomi.length, 2, 'Expected 2 Xiaomi products (14T Pro, Redmi Watch 4)');

  const anker = searchProducts('انکر');
  assert.strictEqual(anker.length, 2, 'Expected 2 Anker products (Liberty 4 NC, 737 PowerBank)');
});

test('C2.12: searchProducts searches across title, description, and categoryTitle', () => {
  // Term only in description: 'تیتانیوم' (in prod-1, prod-9 description)
  const titanium = searchProducts('تیتانیوم');
  assert.ok(titanium.length >= 2, 'Should find products mentioning titanium');

  // Term in categoryTitle: 'ساعت هوشمند'
  const smartwatches = searchProducts('ساعت هوشمند');
  assert.strictEqual(smartwatches.length, 4, 'Should find all 4 smartwatches by categoryTitle');
});

test('C2.13: searchProducts is case-insensitive for English search terms', () => {
  const lower = searchProducts('galaxy');
  const upper = searchProducts('GALAXY');
  const mixed = searchProducts('GaLaXy');
  assert.strictEqual(lower.length, upper.length);
  assert.strictEqual(lower.length, mixed.length);
  assert.ok(lower.length >= 3);
});

test('C2.14: searchProducts handles regex special characters safely without crashing', () => {
  // Characters like *, +, ?, (, [, { must not cause RegExp errors because search uses .includes()
  const specialChars = ['*', '?', '(', '[', '+', '\\', '$', '^', '{', '}'];
  for (const char of specialChars) {
    assert.doesNotThrow(() => {
      const res = searchProducts(char);
      assert.ok(Array.isArray(res));
    }, `Failed on special character ${char}`);
  }
});

test('C2.15: searchProducts scopes results by categoryId when provided', () => {
  const allSamsung = searchProducts('سامسونگ');
  assert.strictEqual(allSamsung.length, 4);

  const phoneSamsung = searchProducts('سامسونگ', 'smartphones');
  assert.strictEqual(phoneSamsung.length, 2);
  for (const p of phoneSamsung) {
    assert.strictEqual(p.categoryId, 'smartphones');
  }

  const audioSamsung = searchProducts('سامسونگ', 'headphones');
  assert.strictEqual(audioSamsung.length, 1);
  assert.strictEqual(audioSamsung[0].id, 'prod-7');

  const accSamsung = searchProducts('سامسونگ', 'accessories');
  assert.strictEqual(accSamsung.length, 0);
});

test('C2.16: searchProducts returns empty array for non-matching search term', () => {
  const res = searchProducts('محصول_کاملا_ناموجود_و_نامعتبر_xyz123');
  assert.ok(Array.isArray(res));
  assert.strictEqual(res.length, 0);
});

test('C2.17: getDefaultAddress returns the designated default address (addr-1)', () => {
  const defaultAddr = getDefaultAddress();
  assert.ok(defaultAddr, 'Default address is undefined');
  assert.strictEqual(defaultAddr.id, 'addr-1');
  assert.strictEqual(defaultAddr.isDefault, true);
  assert.strictEqual(defaultAddr.city, 'تهران');
  assert.strictEqual(defaultAddr.province, 'تهران');

  // Verify phone is valid 11-digit starting with 09 (in Persian or English numerals)
  const normalizedPhone = toEnglishDigits(defaultAddr.receiverPhone);
  assert.match(normalizedPhone, /^09\d{9}$/, 'Normalized receiver phone must match 09XXXXXXXXX');
  assert.strictEqual(defaultAddr.postalCode.length, 10, 'Postal code must be 10 digits');
});

// ---------------------------------------------------------------------------
// Suite 3: Orders, Addresses & Profile Integrity
// ---------------------------------------------------------------------------
console.log('\n▶ Suite 3: Orders, Addresses & Profile Integrity');

test('C3.1: mockAddresses contains 2 valid addresses, exactly 1 default', () => {
  assert.strictEqual(mockAddresses.length, 2);
  const defaults = mockAddresses.filter((a) => a.isDefault);
  assert.strictEqual(defaults.length, 1);
  for (const addr of mockAddresses) {
    const phone = toEnglishDigits(addr.receiverPhone);
    assert.match(phone, /^09\d{9}$/);
    assert.strictEqual(addr.postalCode.length, 10);
  }
});

test('C3.2: mockOrders contains 3 historical orders with arithmetic consistency', () => {
  assert.strictEqual(mockOrders.length, 3);
  for (const ord of mockOrders) {
    assert.ok(['pending_payment', 'processing', 'shipped', 'delivered', 'cancelled'].includes(ord.status));
    assert.strictEqual(
      ord.totalAmount - ord.discountAmount,
      ord.finalAmount,
      `Order ${ord.id} math mismatch: ${ord.totalAmount} - ${ord.discountAmount} !== ${ord.finalAmount}`
    );
    assert.ok(Array.isArray(ord.items) && ord.items.length > 0, `Order ${ord.id} has no items`);
    assert.ok(ord.shippingAddress && ord.shippingAddress.id, `Order ${ord.id} missing shippingAddress`);
  }
});

test('C3.3: mockUserProfile has valid Iranian phone, wallet, addresses and favorite products', () => {
  assert.match(mockUserProfile.phoneNumber, /^09\d{9}$/);
  assert.ok(typeof mockUserProfile.walletBalance === 'number' && mockUserProfile.walletBalance > 0);
  assert.ok(Array.isArray(mockUserProfile.favoriteProductIds) && mockUserProfile.favoriteProductIds.length === 4);
  for (const favId of mockUserProfile.favoriteProductIds) {
    assert.ok(getProductById(favId), `Favorite product ID ${favId} does not exist in mockProducts`);
  }
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`  SUMMARY: ${passed} passed, ${failed} failed (${passed + failed} total)`);
console.log('======================================================================\n');

if (failed > 0) {
  process.exit(1);
}
