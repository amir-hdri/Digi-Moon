/**
 * Authoritative Catalog Fixtures for Dijimoon Storefront Testing
 * Derived from reverse-engineered catalog data and COMPREHENSIVE_REPORT.md
 */

export interface ProductFixture {
  id: string | number;
  title: string;
  slug: string;
  price: number; // in Toman
  oldPrice?: number; // original price before discount
  discountPercent?: number;
  imageUrl: string;
  categoryTitle: string;
  categoryId: string | number;
  rating: number;
  inStock: boolean;
  stockCount: number;
  isSpecial?: boolean;
  specs?: Record<string, string>;
}

export interface CategoryFixture {
  id: string | number;
  title: string;
  slug: string;
  icon?: string;
  productCount: number;
}

export const FIXTURE_CATEGORIES: CategoryFixture[] = [
  { id: 1, title: 'کالای دیجیتال', slug: 'digital', icon: 'smartphone', productCount: 45 },
  { id: 2, title: 'لوازم جانبی', slug: 'accessories', icon: 'headphones', productCount: 120 },
  { id: 3, title: 'ساعت هوشمند', slug: 'smartwatch', icon: 'watch', productCount: 28 },
  { id: 4, title: 'صوتی و تصویری', slug: 'audio-video', icon: 'speaker', productCount: 35 },
];

export const FIXTURE_PRODUCTS: ProductFixture[] = [
  {
    id: 101,
    title: 'گوشی موبایل مدل پرو ۲۵۶ گیگابایت',
    slug: 'mobile-pro-256gb',
    price: 48500000,
    oldPrice: 52000000,
    discountPercent: 7,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    categoryTitle: 'کالای دیجیتال',
    categoryId: 1,
    rating: 4.8,
    inStock: true,
    stockCount: 15,
    isSpecial: true,
    specs: {
      'حافظه داخلی': '۲۵۶ گیگابایت',
      'رم': '۸ گیگابایت',
      'رزولوشن دوربین': '۴۸ مگاپیکسل',
    },
  },
  {
    id: 102,
    title: 'هدفون بی‌سیم نویز کنسلینگ پریمیوم',
    slug: 'wireless-headphones-anc',
    price: 6800000,
    oldPrice: 8500000,
    discountPercent: 20,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    categoryTitle: 'لوازم جانبی',
    categoryId: 2,
    rating: 4.6,
    inStock: true,
    stockCount: 8,
    isSpecial: false,
    specs: {
      'نوع اتصال': 'بلوتوث ۵.۳',
      'عمر باتری': '۳۰ ساعت',
      'قابلیت ANC': 'دارد',
    },
  },
  {
    id: 103,
    title: 'ساعت هوشمند با سنسور اکسیژن و ضربان قلب',
    slug: 'smartwatch-health-sensor',
    price: 3450000,
    oldPrice: 3450000,
    discountPercent: 0,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    categoryTitle: 'ساعت هوشمند',
    categoryId: 3,
    rating: 4.3,
    inStock: true,
    stockCount: 22,
    isSpecial: false,
    specs: {
      'صفحه نمایش': 'AMOLED',
      'ضد آب': 'تا ۵۰ متر',
    },
  },
  {
    id: 104,
    title: 'اسپیکر قابل حمل بلوتوثی ضد آب',
    slug: 'portable-bluetooth-speaker',
    price: 2100000,
    oldPrice: 2800000,
    discountPercent: 25,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500',
    categoryTitle: 'صوتی و تصویری',
    categoryId: 4,
    rating: 4.5,
    inStock: false,
    stockCount: 0,
    isSpecial: true,
    specs: {
      'توان خروجی': '۲۰ وات',
      'استاندارد مقاومت': 'IPX7',
    },
  },
  {
    id: 105,
    title: 'پاوربانک ۲۰۰۰۰ میلی‌آمپر فست شارژ',
    slug: 'powerbank-20000mah-fast',
    price: 1450000,
    oldPrice: 1600000,
    discountPercent: 9,
    imageUrl: 'https://images.unsplash.com/photo-1609592807904-4c5eb4c3db47?w=500',
    categoryTitle: 'لوازم جانبی',
    categoryId: 2,
    rating: 4.7,
    inStock: true,
    stockCount: 30,
    isSpecial: false,
    specs: {
      'ظرفیت': '۲۰۰۰۰ میلی‌آمپر ساعت',
      'توان خروجی': '۲۲.۵ وات',
    },
  },
];

export const FIXTURE_FESTIVAL_DEALS: ProductFixture[] = [
  {
    id: 201,
    title: 'جشنواره شگفت‌انگیز: تبلت ۱۱ اینچی با قلم هوشمند',
    slug: 'festival-tablet-11-inch',
    price: 24900000,
    oldPrice: 32000000,
    discountPercent: 22,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    categoryTitle: 'کالای دیجیتال',
    categoryId: 1,
    rating: 4.9,
    inStock: true,
    stockCount: 5,
    isSpecial: true,
  },
];
