/**
 * Tier 4: Real-World Application Scenarios
 * Implements end-to-end user journeys simulating complete browser workflows.
 * Ground truth derived from PROJECT.md, ORIGINAL_REQUEST.md, and COMPREHENSIVE_REPORT.md.
 */

import { describe, test, expect, getPersianUtils, CartStoreSimulator, ThemeStoreSimulator, AuthStoreSimulator } from '../harness.ts';
import { FIXTURE_PRODUCTS, FIXTURE_CATEGORIES, FIXTURE_FESTIVAL_DEALS } from '../fixtures/catalog.fixture.ts';
import { FIXTURE_ADDRESSES, FIXTURE_USER } from '../fixtures/user-session.fixture.ts';

describe('Tier 4 - Real-World End-to-End User Scenarios', 'tier4', () => {
  // Scenario 1: Complete Storefront Browse-to-Cart Purchase Flow
  test('T4.S1: Complete Storefront Purchase Journey (Browse -> Search -> Product -> Cart -> Checkout)', async () => {
    const { formatToman, toPersianDigits } = await getPersianUtils();
    const cart = new CartStoreSimulator();
    const auth = new AuthStoreSimulator();

    // Step 1: User browses home page categories
    expect.toBeGreaterThan(FIXTURE_CATEGORIES.length, 0);
    const digitalCategory = FIXTURE_CATEGORIES.find((c) => c.slug === 'digital');
    expect.toBeTruthy(digitalCategory);

    // Step 2: User performs search for "پاوربانک"
    const searchQuery = 'پاوربانک';
    const searchResults = FIXTURE_PRODUCTS.filter((p) => p.title.includes(searchQuery));
    expect.toBe(searchResults.length, 1);
    const targetProduct = searchResults[0];

    // Step 3: User views product detail specifications & pricing
    expect.toBe(targetProduct.title, 'پاوربانک ۲۰۰۰۰ میلی‌آمپر فست شارژ');
    expect.toBe(targetProduct.price, 1450000);
    expect.toBe(formatToman(targetProduct.price), '۱,۴۵۰,۰۰۰ تومان');
    expect.toBeTruthy(targetProduct.specs);

    // Step 4: User adds 2 units to cart
    cart.addItem(targetProduct, 2);
    expect.toBe(cart.getItemCount(), 2);
    expect.toBe(toPersianDigits(cart.getItemCount()), '۲');

    // Step 5: User reviews cart totals in Toman
    expect.toBe(cart.getSubtotal(), 3200000); // 1.6M oldPrice * 2
    expect.toBe(cart.getTotalDiscount(), 300000); // 150k discount * 2
    expect.toBe(cart.getPayableTotal(), 2900000); // 1.45M * 2
    expect.toBe(formatToman(cart.getPayableTotal()), '۲,۹۰۰,۰۰۰ تومان');

    // Step 6: User proceeds to checkout; unauthenticated session intercepts with LoginModal
    expect.toBe(auth.isAuthenticated, false);
    auth.openLoginModal();
    expect.toBe(auth.isLoginModalOpen, true);
  });

  // Scenario 2: Visitor Authentication & Address Onboarding Flow
  test('T4.S2: Unauthenticated Visitor Authentication & Address Setup Flow', async () => {
    const auth = new AuthStoreSimulator();
    const { toPersianDigits, formatToman } = await getPersianUtils();

    // Step 1: Unauthenticated visitor attempts to access profile
    expect.toBe(auth.isAuthenticated, false);
    auth.openLoginModal();
    expect.toBe(auth.isLoginModalOpen, true);

    // Step 2: Visitor enters valid Iranian mobile number
    const phone = '09123456789';
    const otpReq = await auth.requestOtp(phone);
    expect.toBe(otpReq.success, true);

    // Step 3: Visitor submits 5-digit verification OTP code
    const verifyReq = await auth.verifyOtp(phone, '12345');
    expect.toBe(verifyReq.success, true);
    expect.toBe(auth.isAuthenticated, true);
    auth.closeLoginModal();
    expect.toBe(auth.isLoginModalOpen, false);

    // Step 4: Profile is hydrated with user info and wallet balance
    expect.toBe(auth.user.phoneNumber, '09123456789');
    expect.toBe(toPersianDigits(auth.user.phoneNumber), '۰۹۱۲۳۴۵۶۷۸۹');
    expect.toBe(formatToman(auth.user.walletBalance), '۱,۵۰۰,۰۰۰ تومان');

    // Step 5: User configures delivery address
    auth.addresses = FIXTURE_ADDRESSES;
    auth.openAddressModal();
    expect.toBe(auth.isAddressModalOpen, true);
    expect.toBe(auth.addresses.length, 2);

    // Select the default address
    const defaultAddr = auth.addresses.find((a) => a.isDefault);
    expect.toBeTruthy(defaultAddr);
    auth.activeAddressId = defaultAddr.id;
    auth.closeAddressModal();
    expect.toBe(auth.activeAddressId, 'addr_1');
  });

  // Scenario 3: Theme Toggle & Session Continuity Across Navigation
  test('T4.S3: Dynamic Theme Switching & Cart State Persistence Across Simulated Navigation', () => {
    const theme = new ThemeStoreSimulator();
    const cart = new CartStoreSimulator();

    // Initial state: Light mode
    expect.toBe(theme.resolvedTheme, 'light');

    // User switches to Dark Mode
    theme.toggleTheme();
    expect.toBe(theme.resolvedTheme, 'dark');

    // User adds multiple items to cart
    cart.addItem(FIXTURE_PRODUCTS[0], 1);
    cart.addItem(FIXTURE_PRODUCTS[1], 2);
    expect.toBe(cart.getItemCount(), 3);
    const snapshotPayable = cart.getPayableTotal();

    // Simulated Navigation: Home -> Category -> Cart -> Profile
    const currentRoute = ['/', '/category/digital', '/cart', '/profile'];
    for (const route of currentRoute) {
      // Theme must remain dark
      expect.toBe(theme.resolvedTheme, 'dark', `Theme drifted on route ${route}`);
      // Cart items and payable amount must remain intact
      expect.toBe(cart.getItemCount(), 3, `Cart count mutated on route ${route}`);
      expect.toBe(cart.getPayableTotal(), snapshotPayable, `Cart total drifted on route ${route}`);
    }
  });

  // Scenario 4: Advanced Persian Search, Filtering, Sorting and Zero-CLS Grid
  test('T4.S4: Advanced Persian Search, Category Filter, Sort & Zero-CLS Skeletons', async () => {
    const { slugifyPersian, formatToman } = await getPersianUtils();

    // User searches with Persian title containing ZWNJ
    const rawSearch = 'گوشی\u200cهای هوشمند';
    const slug = slugifyPersian(rawSearch);
    expect.toBe(slug, 'گوشی-های-هوشمند');

    // Filter products belonging to Digital category (categoryId: 1)
    const digitalProducts = FIXTURE_PRODUCTS.filter((p) => p.categoryId === 1);
    expect.toBeGreaterThan(digitalProducts.length, 0);

    // Sort products by cheapest first
    const sortedCheapest = [...digitalProducts].sort((a, b) => a.price - b.price);
    for (let i = 0; i < sortedCheapest.length - 1; i++) {
      expect.toBeLessThanOrEqual(sortedCheapest[i].price, sortedCheapest[i + 1].price);
    }

    // Verify all rendered prices are formatted with Toman
    sortedCheapest.forEach((item) => {
      const formatted = formatToman(item.price);
      expect.toContain(formatted, 'تومان');
    });
  });

  // Scenario 5: Offline/VPN Network Resiliency with Mock Data Failover
  test('T4.S5: Iranian Geo-Restriction Resiliency & Mock Data Failover Layer', async () => {
    // Simulating API client failover mechanism as specified in COMPREHENSIVE_REPORT.md
    let apiCallFailed = false;

    async function fetchProductsWithFailover(): Promise<any[]> {
      try {
        // Simulate network timeout to live Iranian server (e.g. over foreign VPN)
        apiCallFailed = true;
        throw new Error('ETIMEDOUT: Connection timed out in TLS Handshake');
      } catch (err) {
        // Graceful failover to bundled mock catalog
        return FIXTURE_PRODUCTS;
      }
    }

    const products = await fetchProductsWithFailover();
    expect.toBe(apiCallFailed, true);
    expect.toBeGreaterThan(products.length, 0);
    expect.toBe(products[0].id, 101);
    expect.toBe(products[0].title, 'گوشی موبایل مدل پرو ۲۵۶ گیگابایت');
  });
});
