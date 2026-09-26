/**
 * Dijimoon Design System & Domain Types
 * Extracted from https://dijimoon.ir & https://api.dijimoon.ir
 */

export interface Product {
  id: string | number;
  title: string;
  slug?: string;
  price: number; // in Toman
  oldPrice?: number; // original price before discount in Toman
  discountPercent?: number;
  imageUrl?: string;
  fileId?: string; // for https://api.dijimoon.ir/Api/Files/Download/{fileId}
  categoryTitle?: string;
  categoryId?: string | number;
  rating?: number;
  inStock: boolean;
  stockCount?: number;
  isSpecial?: boolean;
}

export interface Category {
  id: string | number;
  title: string;
  slug?: string;
  icon?: string;
  fileId?: string;
  parentId?: string | number | null;
  productCount?: number;
  children?: Category[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string | number;
  title: string;
  fullAddress: string;
  postalCode?: string;
  receiverName?: string;
  receiverPhone?: string;
  isDefault?: boolean;
}

export interface GridQueryParams {
  pageIndex?: number;
  pageSize?: number;
  categoryId?: string | number;
  searchQuery?: string;
  sortBy?: 'newest' | 'cheapest' | 'expensive' | 'popular';
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export type ThemeMode = 'light' | 'dark';

export type ElevationLevel = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type RadiusLevel = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';

// --- Authentication & SSO Types (Discovered from live AuthService) ---

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

export interface UserProfile {
  id: string | number;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  walletBalance?: number;
}
