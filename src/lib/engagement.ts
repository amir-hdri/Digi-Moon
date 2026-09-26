import { mockNotifications, mockThreads, mockBranches } from '@/data/engagement';
import { getProductById, mockAddresses } from '@/data/mock-data';
import type {
  AppNotification,
  Branch,
  CartItem,
  ChatMessage,
  MessageThread,
  NotificationType,
  Order,
} from '@/types';

export interface NotificationFilter {
  type?: NotificationType | 'all';
  unreadOnly?: boolean;
  limit?: number;
}

export function listNotifications(filter: NotificationFilter = {}): {
  items: AppNotification[];
  unreadCount: number;
} {
  const { type = 'all', unreadOnly = false, limit = 50 } = filter;
  const unreadCount = mockNotifications.filter((n) => !n.read).length;
  const items = mockNotifications
    .filter((n) => (type === 'all' ? true : n.type === type))
    .filter((n) => (unreadOnly ? !n.read : true))
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, Math.max(1, Math.min(limit, 100)));
  return { items, unreadCount };
}

export function validateMarkRead(body: unknown): { ids: string[] | 'all' } | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'بدنه درخواست نامعتبر است.' };
  const { ids, all } = body as { ids?: unknown; all?: unknown };
  if (all === true) return { ids: 'all' };
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 100) {
    return { error: 'فهرست شناسه‌ها نامعتبر است.' };
  }
  if (!ids.every((id) => typeof id === 'string' && id.length > 0 && id.length <= 64)) {
    return { error: 'شناسه اعلان نامعتبر است.' };
  }
  return { ids: ids as string[] };
}

export function listThreads(): MessageThread[] {
  return mockThreads
    .slice()
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function getThread(threadId: string): MessageThread | undefined {
  return mockThreads.find((t) => t.id === threadId);
}

export function validateMessage(body: unknown): { threadId: string; text: string } | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'بدنه درخواست نامعتبر است.' };
  const { threadId, body: text } = body as { threadId?: unknown; body?: unknown };
  if (typeof threadId !== 'string' || threadId.length === 0 || threadId.length > 64) {
    return { error: 'شناسه گفتگو نامعتبر است.' };
  }
  if (typeof text !== 'string' || text.trim().length === 0) {
    return { error: 'متن پیام نمی‌تواند خالی باشد.' };
  }
  if (text.trim().length > 1000) {
    return { error: 'متن پیام حداکثر ۱۰۰۰ نویسه مجاز است.' };
  }
  return { threadId, text: text.trim() };
}

export function buildMessage(threadId: string, text: string): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    threadId,
    author: 'user',
    body: text,
    createdAt: new Date().toISOString(),
    status: 'sent',
  };
}

export interface OrderRequestItem {
  productId: string | number;
  quantity: number;
}

export function validateOrder(body: unknown): {
  items: OrderRequestItem[];
  addressId: string | number;
  paymentMethod: 'online' | 'wallet';
} | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'بدنه درخواست نامعتبر است.' };
  const { items, addressId, paymentMethod } = body as {
    items?: unknown;
    addressId?: unknown;
    paymentMethod?: unknown;
  };
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return { error: 'سبد خرید خالی یا نامعتبر است.' };
  }
  for (const item of items) {
    if (!item || typeof item !== 'object') return { error: 'قلم سبد نامعتبر است.' };
    const { productId, quantity } = item as { productId?: unknown; quantity?: unknown };
    if (
      (typeof productId !== 'string' && typeof productId !== 'number') ||
      typeof quantity !== 'number' ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      return { error: 'قلم سبد نامعتبر است.' };
    }
    if (!getProductById(productId)) {
      return { error: `کالای ${String(productId)} یافت نشد.` };
    }
  }
  const address = mockAddresses.find((a) => String(a.id) === String(addressId));
  if (!address) return { error: 'آدرس تحویل نامعتبر است.' };
  if (paymentMethod !== 'online' && paymentMethod !== 'wallet') {
    return { error: 'روش پرداخت نامعتبر است.' };
  }
  return { items: items as OrderRequestItem[], addressId: address.id, paymentMethod };
}

export function buildOrder(
  items: OrderRequestItem[],
  addressId: string | number,
  paymentMethod: 'online' | 'wallet'
): Order {
  const address = mockAddresses.find((a) => String(a.id) === String(addressId))!;
  const cartItems: CartItem[] = items.map((item) => ({
    product: getProductById(item.productId)!,
    quantity: item.quantity,
  }));
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.product.oldPrice ?? item.product.price) * item.quantity,
    0
  );
  const finalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const now = new Date();
  const orderNumber = `MM-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    id: `ord-${Date.now()}`,
    orderNumber,
    createdAt: now.toISOString(),
    status: 'processing',
    items: cartItems,
    shippingAddress: address,
    totalAmount,
    discountAmount: totalAmount - finalAmount,
    finalAmount,
    paymentMethod,
    trackingCode: `TRK-${Math.floor(10000000 + Math.random() * 89999999)}`,
  };
}

export function listBranches(): Branch[] {
  return mockBranches;
}

const IRANIAN_MOBILE = /^09\d{9}$/;

export function validateNewsletter(body: unknown): { phone: string } | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'بدنه درخواست نامعتبر است.' };
  const { phone } = body as { phone?: unknown };
  if (typeof phone !== 'string') return { error: 'شماره موبایل نامعتبر است.' };
  const normalized = phone.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/\s|-/g, '');
  if (!IRANIAN_MOBILE.test(normalized)) {
    return { error: 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.' };
  }
  return { phone: normalized };
}
