import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { Product, CartItem, ProductColor } from '@/types';
import { getProductById } from '@/data/mock-data';

/**
 * A cart line is identified by product + colour variant, not by product alone.
 * `addItem` has always keyed on colour, but `updateQuantity`/`removeItem` only looked at
 * `product.id` — so two colour variants of one product collapsed into each other and
 * removing one deleted both. `lineId` is the shared identity both sides now use.
 */
export function cartLineId(
  productId: string | number,
  selectedColor?: ProductColor | string
): string {
  const color =
    typeof selectedColor === 'string'
      ? selectedColor
      : selectedColor
        ? `${selectedColor.name}:${selectedColor.hex}`
        : '';
  return `${String(productId)}::${color}`;
}

export interface CartStoreState {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    selectedColor?: ProductColor | string,
    selectedWarranty?: string
  ) => void;
  removeItem: (productId: string | number, selectedColor?: ProductColor | string) => void;
  updateQuantity: (
    productId: string | number,
    quantity: number,
    selectedColor?: ProductColor | string
  ) => void;
  clearCart: () => void;
  /** Quantity of one specific line (defaults to the product's first line). */
  getQuantityOf: (productId: string | number, selectedColor?: ProductColor | string) => number;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotalDiscount: () => number;
  getPayableTotal: () => number;
  /** True when any line exceeds the available stock. */
  hasStockConflict: () => boolean;
}

/**
 * Product images are large inline `data:` URIs, so persisting whole `Product` objects
 * burned through the ~5 MB localStorage quota within a handful of adds. We persist a
 * compact snapshot (identity + money only) and rehydrate the full product from the catalog.
 */
interface PersistedCartItem {
  productId: string;
  quantity: number;
  selectedColor?: ProductColor | string;
  selectedWarranty?: string;
  /** Retained so the cart can render if the product later leaves the catalog. */
  snapshot: Pick<
    Product,
    'id' | 'title' | 'slug' | 'price' | 'oldPrice' | 'imageUrl' | 'categoryTitle' | 'categoryId' | 'inStock' | 'stockCount'
  >;
}

interface CartPersistedState {
  items: PersistedCartItem[];
}

/** Inert storage for SSR, where `window.localStorage` does not exist. */
const ssrStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const clientStorage = <T>() =>
  createJSONStorage<T>(() => (typeof window !== 'undefined' ? window.localStorage : ssrStorage));

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, selectedColor, selectedWarranty) => {
        if (!product || quantity <= 0) return;
        const lineId = cartLineId(product.id, selectedColor);
        set((state) => {
          const index = state.items.findIndex((item) => cartLineId(item.product.id, item.selectedColor) === lineId);
          if (index > -1) {
            const items = [...state.items];
            const max = product.stockCount ?? Number.POSITIVE_INFINITY;
            items[index] = {
              ...items[index],
              quantity: Math.min(max, items[index].quantity + quantity),
            };
            return { items };
          }
          return {
            items: [...state.items, { product, quantity, selectedColor, selectedWarranty }],
          };
        });
      },

      /**
       * Removing without a colour drops every variant of the product (the cart page's
       * per-row delete). Pass `selectedColor` to target a single variant.
       */
      removeItem: (productId, selectedColor) => {
        const lineId =
          selectedColor === undefined ? null : cartLineId(productId, selectedColor);
        set((state) => ({
          items: lineId
            ? state.items.filter(
                (item) => cartLineId(item.product.id, item.selectedColor) !== lineId
              )
            : state.items.filter((item) => String(item.product.id) !== String(productId)),
        }));
      },

      updateQuantity: (productId, quantity, selectedColor) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedColor);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            const matches =
              selectedColor === undefined
                ? String(item.product.id) === String(productId)
                : cartLineId(item.product.id, item.selectedColor) ===
                  cartLineId(productId, selectedColor);
            if (!matches) return item;
            const max = item.product.stockCount ?? Number.POSITIVE_INFINITY;
            return { ...item, quantity: Math.min(max, quantity) };
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getQuantityOf: (productId, selectedColor) => {
        const lineId =
          selectedColor === undefined
            ? null
            : cartLineId(productId, selectedColor);
        const line =
          get().items.find((item) =>
            lineId
              ? cartLineId(item.product.id, item.selectedColor) === lineId
              : String(item.product.id) === String(productId)
          ) ?? null;
        return line?.quantity ?? 0;
      },

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      /** List price before discount — the invoice's "مبلغ کالاها" line. */
      getSubtotal: () =>
        get().items.reduce(
          (sum, item) => sum + (item.product.oldPrice ?? item.product.price) * item.quantity,
          0
        ),

      getTotalDiscount: () =>
        get().items.reduce(
          (sum, item) =>
            item.product.oldPrice && item.product.oldPrice > item.product.price
              ? sum + (item.product.oldPrice - item.product.price) * item.quantity
              : sum,
          0
        ),

      getPayableTotal: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

      hasStockConflict: () =>
        get().items.some(
          (item) =>
            !item.product.inStock ||
            (item.product.stockCount !== undefined && item.quantity > item.product.stockCount)
        ),
    }),
    {
      name: 'dijimoon_cart',
      version: 2,
      storage: clientStorage<CartPersistedState>(),
      // Every other persisted store sets this — without it the cart rehydrates
      // synchronously on creation, so the first client render (badge counts,
      // cart page) disagrees with SSR and React throws hydration error #418.
      // StoreHydration rehydrates all stores once, after mount.
      skipHydration: true,
      partialize: (state) => ({
        items: state.items.map((item) => ({
          productId: String(item.product.id),
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedWarranty: item.selectedWarranty,
          snapshot: {
            id: item.product.id,
            title: item.product.title,
            slug: item.product.slug,
            price: item.product.price,
            oldPrice: item.product.oldPrice,
            imageUrl: '',
            categoryTitle: item.product.categoryTitle,
            categoryId: item.product.categoryId,
            inStock: item.product.inStock,
            stockCount: item.product.stockCount,
          },
        })),
      }),
      merge: (persisted, current) => {
        const saved = (persisted as CartPersistedState | undefined)?.items ?? [];
        if (saved.length === 0) return current;
        return {
          ...current,
          items: saved.map((entry) => {
            // Prefer the live catalog record so prices/images never go stale in storage.
            const live = getProductById(entry.productId);
            return {
              product: (live ?? entry.snapshot) as Product,
              quantity: entry.quantity,
              selectedColor: entry.selectedColor,
              selectedWarranty: entry.selectedWarranty,
            };
          }),
        };
      },
    }
  )
);

/**
 * Store-level selectors (they take the whole state, not the items array) so components
 * can subscribe directly: `useCartStore(selectCartCount)`. Both return primitives, so a
 * cart write only re-renders the components whose number actually moved.
 */
export function selectCartCount(state: CartStoreState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectCartPayableTotal(state: CartStoreState): number {
  return state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

/** `true` when at least one line is over the available stock. */
export function selectHasStockConflict(state: CartStoreState): boolean {
  return state.items.some(
    (item) =>
      !item.product.inStock ||
      (item.product.stockCount !== undefined && item.quantity > item.product.stockCount)
  );
}
