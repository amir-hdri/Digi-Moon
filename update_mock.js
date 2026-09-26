const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/mock-data.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// We will completely rewrite the file.
const newContent = `/**
 * MoonMarket Storefront — Realistic FMCG Dataset
 */
import { Product, Category, Address, Order, UserProfile } from '@/types';
import {
  GROCERY_OIL_SVG,
  DAIRY_MILK_SVG,
  HYGIENE_SHAMPOO_SVG,
  CLEANING_DETERGENT_SVG,
  BEVERAGE_TEA_SVG,
  SNACK_CHOCOLATE_SVG,
  PROTEIN_TUNA_SVG,
} from '@/lib/product-images';

export const mockCategories: Category[] = [
  {
    id: 'groceries',
    title: 'مواد غذایی',
    slug: 'groceries',
    icon: 'ShoppingBag',
    productCount: 4,
  },
  {
    id: 'nuts-snacks',
    title: 'خشکبار و تنقلات',
    slug: 'nuts-snacks',
    icon: 'Cookie',
    productCount: 4,
  },
  {
    id: 'beauty-hygiene',
    title: 'آرایشی و بهداشتی',
    slug: 'beauty-hygiene',
    icon: 'Sparkles',
    productCount: 4,
  },
  {
    id: 'cleaning',
    title: 'مواد شوینده',
    slug: 'cleaning',
    icon: 'Droplets',
    productCount: 4,
  },
];

export interface MoonMarketSubcategory {
  id: string;
  title: string;
  slug: string;
  items?: string[];
}

export interface MoonMarketCategory {
  id: string;
  title: string;
  slug: string;
  icon: string;
  color: string;
  badge?: string;
  productCount: number;
  children: MoonMarketSubcategory[];
}

export const moonMarketCategories: MoonMarketCategory[] = [
  {
    id: 'groceries',
    title: 'مواد غذایی و خواربار',
    slug: 'groceries',
    icon: 'ShoppingBag',
    color: 'from-amber-500 to-yellow-600',
    badge: 'پرمصرف‌ترین',
    productCount: 128,
    children: [
      { id: 'rice', title: 'برنج و غلات', slug: 'rice' },
      { id: 'oil', title: 'روغن‌های خوراکی', slug: 'oil' },
    ],
  },
  {
    id: 'nuts-snacks',
    title: 'خشکبار و تنقلات',
    slug: 'nuts-snacks',
    icon: 'Cookie',
    color: 'from-violet-500 to-purple-600',
    badge: 'محبوب‌ترین',
    productCount: 110,
    children: [
      { id: 'nuts', title: 'آجیل و خشکبار', slug: 'nuts' },
      { id: 'chocolates', title: 'شکلات و تنقلات', slug: 'chocolates' },
    ],
  },
  {
    id: 'beauty-hygiene',
    title: 'آرایشی و بهداشتی',
    slug: 'beauty-hygiene',
    icon: 'Sparkles',
    color: 'from-pink-500 to-rose-600',
    badge: 'تضمین سلامت',
    productCount: 142,
    children: [
      { id: 'hair', title: 'مراقبت از مو', slug: 'hair' },
      { id: 'skin', title: 'مراقبت از پوست', slug: 'skin' },
    ],
  },
  {
    id: 'cleaning',
    title: 'مواد شوینده',
    slug: 'cleaning',
    icon: 'Droplets',
    color: 'from-teal-500 to-emerald-600',
    badge: 'پاک‌کنندگی',
    productCount: 84,
    children: [
      { id: 'laundry', title: 'شستشوی لباس', slug: 'laundry' },
      { id: 'dishes', title: 'شستشوی ظروف', slug: 'dishes' },
    ],
  },
];

export const mockProducts: Product[] = [
  // 1-4: Groceries
  {
    id: 'prod-1',
    title: 'روغن زیتون فرابکر اویلا ۱ لیتر',
    slug: 'oila-olive-oil',
    price: 385000,
    oldPrice: 440000,
    discountPercent: 12,
    imageUrl: GROCERY_OIL_SVG,
    categoryTitle: 'مواد غذایی',
    categoryId: 'groceries',
    rating: 4.8,
    inStock: true,
    stockCount: 45,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'روغن زیتون فرابکر طبیعی',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-2',
    title: 'برنج طارم هاشمی درجه یک ۵ کیلوگرم',
    slug: 'tarom-rice-5kg',
    price: 680000,
    oldPrice: 750000,
    discountPercent: 9,
    imageUrl: GROCERY_OIL_SVG,
    categoryTitle: 'مواد غذایی',
    categoryId: 'groceries',
    rating: 4.9,
    inStock: true,
    stockCount: 28,
    isSpecial: false,
    campaignBadge: 'پرفروش',
    description: 'برنج خالص دستچین شمال',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-3',
    title: 'رب گوجه‌فرنگی غلیظ روژین ۸۰۰ گرم',
    slug: 'rojin-tomato-paste',
    price: 72000,
    oldPrice: 82000,
    discountPercent: 12,
    imageUrl: GROCERY_OIL_SVG,
    categoryTitle: 'مواد غذایی',
    categoryId: 'groceries',
    rating: 4.8,
    inStock: true,
    stockCount: 70,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'رب گوجه فرنگی با بریکس بالا',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-4',
    title: 'کنسرو تن‌ماهی در روغن زیتون شیلانه',
    slug: 'shilaneh-tuna',
    price: 105000,
    oldPrice: 120000,
    discountPercent: 12,
    imageUrl: PROTEIN_TUNA_SVG,
    categoryTitle: 'مواد غذایی',
    categoryId: 'groceries',
    rating: 4.8,
    inStock: true,
    stockCount: 50,
    isSpecial: false,
    description: 'فیله ماهی در روغن زیتون',
    warranty: 'اصالت کالا',
  },
  
  // 5-8: Nuts & Snacks
  {
    id: 'prod-5',
    title: 'پسته اکبری زعفرانی اعلا ۵۰۰ گرم',
    slug: 'pistachio-akbari-500g',
    price: 750000,
    oldPrice: 820000,
    discountPercent: 8,
    imageUrl: SNACK_CHOCOLATE_SVG,
    categoryTitle: 'خشکبار و تنقلات',
    categoryId: 'nuts-snacks',
    rating: 4.9,
    inStock: true,
    stockCount: 15,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'پسته درجه یک رفسنجان',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-6',
    title: 'مغز گردو سفید تویسرکان ۵۰۰ گرم',
    slug: 'walnut-white-500g',
    price: 450000,
    oldPrice: 490000,
    discountPercent: 8,
    imageUrl: SNACK_CHOCOLATE_SVG,
    categoryTitle: 'خشکبار و تنقلات',
    categoryId: 'nuts-snacks',
    rating: 4.8,
    inStock: true,
    stockCount: 20,
    isSpecial: false,
    description: 'مغز گردو امسالی پرچرب',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-7',
    title: 'شکلات تلخ دست‌ساز ۷۸ درصد فرمند ۱۰۰ گرم',
    slug: 'farmand-dark-chocolate',
    price: 58000,
    oldPrice: 68000,
    discountPercent: 15,
    imageUrl: SNACK_CHOCOLATE_SVG,
    categoryTitle: 'خشکبار و تنقلات',
    categoryId: 'nuts-snacks',
    rating: 4.7,
    inStock: true,
    stockCount: 65,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'شکلات تلخ ارگانیک',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-8',
    title: 'قهوه فوری کلاسیک نسکافه ۲۰۰ گرم',
    slug: 'nescafe-classic',
    price: 295000,
    oldPrice: 340000,
    discountPercent: 13,
    imageUrl: BEVERAGE_TEA_SVG,
    categoryTitle: 'خشکبار و تنقلات',
    categoryId: 'nuts-snacks',
    rating: 4.8,
    inStock: true,
    stockCount: 30,
    isSpecial: false,
    description: 'قهوه فوری روبوستا',
    warranty: 'اصالت کالا',
  },

  // 9-12: Beauty & Hygiene
  {
    id: 'prod-9',
    title: 'شامپو تقویت‌کننده ضدریزش لدورا ۳۰۰ میلی‌لیتر',
    slug: 'ledora-shampoo',
    price: 185000,
    oldPrice: 220000,
    discountPercent: 16,
    imageUrl: HYGIENE_SHAMPOO_SVG,
    categoryTitle: 'آرایشی و بهداشتی',
    categoryId: 'beauty-hygiene',
    rating: 4.8,
    inStock: true,
    stockCount: 35,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'شامپو ضدریزش با عصاره گیاهی',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-10',
    title: 'کرم مرطوب‌کننده و آبرسان نیوآ ۲۰۰ میلی‌لیتر',
    slug: 'nivea-soft-cream',
    price: 145000,
    oldPrice: 170000,
    discountPercent: 15,
    imageUrl: HYGIENE_SHAMPOO_SVG,
    categoryTitle: 'آرایشی و بهداشتی',
    categoryId: 'beauty-hygiene',
    rating: 4.9,
    inStock: true,
    stockCount: 40,
    isSpecial: false,
    description: 'کرم آبرسان دست و صورت',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-11',
    title: 'خمیردندان سفیدکننده میسویک ۱۰۰ میلی‌لیتر',
    slug: 'misswake-whitening',
    price: 95000,
    oldPrice: 110000,
    discountPercent: 13,
    imageUrl: HYGIENE_SHAMPOO_SVG,
    categoryTitle: 'آرایشی و بهداشتی',
    categoryId: 'beauty-hygiene',
    rating: 4.6,
    inStock: true,
    stockCount: 60,
    isSpecial: true,
    campaignBadge: 'تخفیف ویژه',
    description: 'خمیردندان سفید کننده فوری',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-12',
    title: 'میسلار واتر پاک‌کننده آرایش لافارر',
    slug: 'lafarrerr-micellar-water',
    price: 165000,
    oldPrice: 195000,
    discountPercent: 15,
    imageUrl: HYGIENE_SHAMPOO_SVG,
    categoryTitle: 'آرایشی و بهداشتی',
    categoryId: 'beauty-hygiene',
    rating: 4.7,
    inStock: true,
    stockCount: 45,
    isSpecial: false,
    description: 'پاک کننده ملایم پوست',
    warranty: 'اصالت کالا',
  },

  // 13-16: Cleaning
  {
    id: 'prod-13',
    title: 'مایع ظرفشویی پریل با رایحه لیمو ۱ لیتر',
    slug: 'pril-lemon-dishwashing',
    price: 62000,
    oldPrice: 72000,
    discountPercent: 14,
    imageUrl: CLEANING_DETERGENT_SVG,
    categoryTitle: 'مواد شوینده',
    categoryId: 'cleaning',
    rating: 4.8,
    inStock: true,
    stockCount: 80,
    isSpecial: true,
    campaignBadge: 'شگفت‌انگیز',
    description: 'مایع ظرفشویی ضدچربی قوی',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-14',
    title: 'پودر ماشین لباسشویی پرسیل ۱ کیلوگرم',
    slug: 'persil-active-powder',
    price: 78000,
    oldPrice: 90000,
    discountPercent: 13,
    imageUrl: CLEANING_DETERGENT_SVG,
    categoryTitle: 'مواد شوینده',
    categoryId: 'cleaning',
    rating: 4.7,
    inStock: true,
    stockCount: 55,
    isSpecial: false,
    description: 'پودر آنزیم‌دار پرسیل',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-15',
    title: 'مایع چندمنظوره سطوح اکتیو ۷۰۰ گرم',
    slug: 'active-multipurpose-cleaner',
    price: 45000,
    oldPrice: 52000,
    discountPercent: 13,
    imageUrl: CLEANING_DETERGENT_SVG,
    categoryTitle: 'مواد شوینده',
    categoryId: 'cleaning',
    rating: 4.6,
    inStock: true,
    stockCount: 90,
    isSpecial: true,
    campaignBadge: 'پیشنهاد روز',
    description: 'پاک‌کننده قدرتمند سطوح',
    warranty: 'اصالت کالا',
  },
  {
    id: 'prod-16',
    title: 'شیشه‌پاک‌کن رافونه ۵۰۰ میلی‌لیتر',
    slug: 'rafoneh-glass-cleaner',
    price: 32000,
    oldPrice: 38000,
    discountPercent: 15,
    imageUrl: CLEANING_DETERGENT_SVG,
    categoryTitle: 'مواد شوینده',
    categoryId: 'cleaning',
    rating: 4.8,
    inStock: true,
    stockCount: 120,
    isSpecial: false,
    description: 'شیشه پاک کن ضد بخار',
    warranty: 'اصالت کالا',
  },
];

export const allStoreProducts: Product[] = [...mockProducts];
export const mockFestivalProducts: Product[] = mockProducts.filter((p) => p.isSpecial);

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    title: 'منزل (سعادت‌آباد)',
    province: 'تهران',
    city: 'تهران',
    fullAddress: 'تهران، سعادت‌آباد، میدان کاج، پلاک ۱۲',
    postalCode: '۱۹۹۸۶۱۴۳۵۲',
    receiverName: 'امیر حیدری',
    receiverPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    isDefault: true,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'DM-1405-9821',
    createdAt: '۱۴۰۵/۰۲/۱۵',
    status: 'delivered',
    items: [
      { product: mockProducts[0], quantity: 1, selectedColor: 'معمولی', selectedWarranty: 'اصالت کالا' },
    ],
    shippingAddress: mockAddresses[0],
    totalAmount: 385000,
    discountAmount: 55000,
    finalAmount: 330000,
    paymentMethod: 'online',
    trackingCode: 'TRK-98234120',
  }
];

export const mockUserProfile: UserProfile = {
  id: 'usr-901',
  phoneNumber: '09123456789',
  firstName: 'امیر',
  lastName: 'حیدری',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  walletBalance: 2500000,
  favoriteProductIds: ['prod-1', 'prod-5'],
  addresses: mockAddresses,
};

export function getProductById(id: string | number): Product | undefined {
  return allStoreProducts.find((p) => String(p.id) === String(id));
}
export function getProductBySlug(slug: string): Product | undefined {
  return allStoreProducts.find((p) => p.slug === slug);
}
export function getProductsByCategory(categoryIdOrSlug: string | number): Product[] {
  return allStoreProducts.filter(
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
export function searchAllStoreProducts(query: string, categoryId?: string | number): Product[] {
  return searchProducts(query, categoryId);
}
export function getDefaultAddress(): Address | undefined {
  return mockAddresses.find((a) => a.isDefault) || mockAddresses[0];
}
`

fs.writeFileSync(filePath, newContent);
console.log('mock-data.ts updated successfully with 16 FMCG items.');
