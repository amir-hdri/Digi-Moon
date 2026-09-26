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
  brand?: string; // latin brand key used by the quick-filter chips, e.g. "kalleh"
  brandLabel?: string; // display name, e.g. "کاله"
  price: number; // in Toman (integer)
  oldPrice?: number; // original price before discount in Toman
  discountPercent?: number; // integer 0-100
  imageUrl: string;
  fileId?: string; // for CDN https://api.dijimoon.ir/Api/Files/Download/{fileId}
  categoryTitle: string;
  categoryId: string | number;
  subCategoryId?: string | number;
  subCategoryTitle?: string;
  subCategorySlug?: string;
  unit?: string; // e.g. "۱ لیتر", "۵۰۰ گرم"
  rating?: number; // e.g. 4.8 (out of 5)
  reviewsCount?: number; // e.g. 142
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

export type NotificationType = 'order' | 'offer' | 'support' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export type MessageAuthor = 'user' | 'support' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface ChatMessage {
  id: string;
  threadId: string;
  author: MessageAuthor;
  body: string;
  createdAt: string;
  status: MessageStatus;
}

export interface MessageThread {
  id: string;
  title: string;
  subject: string;
  status: 'open' | 'closed';
  unreadCount: number;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
}
