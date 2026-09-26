/**
 * Dijimoon Typed API Client
 * Reverse-engineered from https://dijimoon.ir Next.js production bundle
 * Base API URL: https://api.dijimoon.ir
 * Location: src/lib/api.ts
 */

import { Product, Category, GridQueryParams, PaginatedResult, AuthResponse } from '@/types';

export const API_BASE_URL = 'https://api.dijimoon.ir';
export const CDN_DOWNLOAD_URL = `${API_BASE_URL}/Api/Files/Download`;

export function getFileUrl(fileId?: string): string {
  if (!fileId) return '/logo.png';
  if (fileId.startsWith('http')) return fileId;
  return `${CDN_DOWNLOAD_URL}/${fileId}`;
}

export class DijimoonApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchJson<T>(endpoint: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await fetch(url, {
      ...init,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`Dijimoon API error: ${res.status} ${res.statusText} at ${endpoint}`);
    }

    return res.json() as Promise<T>;
  }

  // --- Products ---
  async getProduct(id: string | number): Promise<Product> {
    return this.fetchJson<Product>(`/Product/${id}`);
  }

  async getSpecialProducts(): Promise<Product[]> {
    return this.fetchJson<Product[]>('/Product/SpecialProducts');
  }

  async getProductsByCategory(categoryId?: string | number): Promise<Product[]> {
    const ep = categoryId ? `/Product/GetList/${categoryId}` : '/Product/GetList';
    return this.fetchJson<Product[]>(ep);
  }

  async getProductGrid(params: GridQueryParams = {}): Promise<PaginatedResult<Product>> {
    return this.fetchJson<PaginatedResult<Product>>('/Product/GetGrid', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getMainPageCategoryProducts(): Promise<Array<{ category: Category; products: Product[] }>> {
    return this.fetchJson<Array<{ category: Category; products: Product[] }>>('/Product/ProductGetMainPageGetCategory');
  }

  // --- Categories ---
  async getCategories(parentId?: string | number): Promise<Category[]> {
    const ep = parentId ? `/Category/GetList/${parentId}` : '/Category/GetList';
    return this.fetchJson<Category[]>(ep);
  }

  async getMainPageCategories(): Promise<Category[]> {
    return this.fetchJson<Category[]>('/Category/GetMainPage');
  }

  // --- Search ---
  async searchMainPage(query: string): Promise<Product[]> {
    return this.fetchJson<Product[]>(`/Search/SearchMainPage/${encodeURIComponent(query)}`);
  }

  async searchCategory(query: string, categoryId: string | number): Promise<Product[]> {
    return this.fetchJson<Product[]>(`/Search/SearchCategory/${encodeURIComponent(query)}?categoryId=${categoryId}`);
  }

  // --- Festival & Campaign Service (Discovered from live bundle) ---
  async getFestival(): Promise<unknown> {
    return this.fetchJson<unknown>('/Festival/GetFestival');
  }

  async getFestivalProducts(): Promise<Product[]> {
    return this.fetchJson<Product[]>('/Product/ProductGetFestival');
  }

  // --- Authentication & SSO Service (Discovered from live AuthService) ---
  async requestTotp(phoneNumber: string): Promise<{ success: boolean; message?: string }> {
    return this.fetchJson<{ success: boolean; message?: string }>('/SSO/RequestTotp', {
      method: 'POST',
      body: JSON.stringify({ PhoneNumber: phoneNumber }),
    });
  }

  async reSendTotp(phoneNumber: string): Promise<{ success: boolean; message?: string }> {
    return this.fetchJson<{ success: boolean; message?: string }>('/SSO/ReSendTotp', {
      method: 'POST',
      body: JSON.stringify({ PhoneNumber: phoneNumber }),
    });
  }

  async verifyTotp(phoneNumber: string, code: string): Promise<AuthResponse> {
    return this.fetchJson<AuthResponse>('/SSO/VerifyTotp', {
      method: 'POST',
      body: JSON.stringify({ PhoneNumber: phoneNumber, Code: code }),
    });
  }
}

export const api = new DijimoonApiClient();
