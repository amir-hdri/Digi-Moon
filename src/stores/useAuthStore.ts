import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { UserProfile, Address } from '@/types';
import { mockUserProfile, mockAddresses } from '@/data/mock-data';

export interface AuthStoreState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  /** The address book, kept outside `user` so it still works while signed out. */
  addresses: Address[];
  activeAddress: Address | null;
  login: (phoneNumber: string, userDetails?: Partial<UserProfile>) => void;
  logout: () => void;
  setActiveAddress: (address: Address) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string | number) => void;
  toggleFavorite: (productId: string | number) => void;
  isFavorite: (productId: string | number) => boolean;
}

type AuthPersisted = Pick<AuthStoreState, 'isAuthenticated' | 'user' | 'addresses' | 'activeAddress'>;

/** Inert storage for SSR, where `window.localStorage` does not exist. */
const ssrStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const clientStorage = <T>() =>
  createJSONStorage<T>(() => (typeof window !== 'undefined' ? window.localStorage : ssrStorage));

/**
 * Session starts **signed out**. It used to default to `isAuthenticated: true` with a
 * pre-filled mock profile, which made the entire OTP login flow unreachable dead code
 * from the header's perspective. The demo still lands on a populated account after one
 * tap of «دریافت کد تایید» + `12345`.
 */
export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      addresses: mockAddresses,
      activeAddress: mockAddresses.find((a) => a.isDefault) ?? mockAddresses[0] ?? null,

      login: (phoneNumber, userDetails) => {
        const { user, addresses } = get();
        const updatedUser: UserProfile = {
          ...(user ?? mockUserProfile),
          ...userDetails,
          phoneNumber,
          addresses,
          favoriteProductIds: user?.favoriteProductIds ?? mockUserProfile.favoriteProductIds ?? [],
        };
        set({ isAuthenticated: true, user: updatedUser });
      },

      logout: () => {
        // Cart and orders intentionally survive sign-out; the address selection does not,
        // otherwise the checkout summary would keep showing a signed-out shopper's address.
        set({ isAuthenticated: false, user: null, activeAddress: null });
      },

      setActiveAddress: (address) => set({ activeAddress: address }),

      addAddress: (address) => {
        set((state) => {
          // New address goes first, and demotes the previous default.
          const addresses = [address, ...state.addresses.map((a) => ({ ...a, isDefault: false }))];
          return {
            addresses,
            user: state.user ? { ...state.user, addresses } : null,
            activeAddress: address.isDefault || state.activeAddress === null ? address : state.activeAddress,
          };
        });
      },

      removeAddress: (addressId) => {
        set((state) => {
          const addresses = state.addresses.filter((a) => String(a.id) !== String(addressId));
          const activeAddress =
            state.activeAddress && String(state.activeAddress.id) === String(addressId)
              ? addresses[0] ?? null
              : state.activeAddress;
          return { addresses, activeAddress, user: state.user ? { ...state.user, addresses } : null };
        });
      },

      toggleFavorite: (productId) => {
        set((state) => {
          const current = state.user?.favoriteProductIds ?? [];
          const exists = current.some((id) => String(id) === String(productId));
          const next = exists
            ? current.filter((id) => String(id) !== String(productId))
            : [...current, productId];
          return { user: state.user ? { ...state.user, favoriteProductIds: next } : { ...mockUserProfile, favoriteProductIds: next } };
        });
      },

      isFavorite: (productId) =>
        (get().user?.favoriteProductIds ?? []).some((id) => String(id) === String(productId)),
    }),
    {
      name: 'dijimoon_auth',
      version: 2,
      storage: clientStorage<AuthPersisted>(),
      // Rehydrated explicitly in an effect (see `StoreHydration`) so the server HTML and
      // the first client render agree — reading localStorage during render caused
      // hydration mismatches on the cart badge and the profile link.
      skipHydration: true,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        addresses: state.addresses,
        activeAddress: state.activeAddress,
      }),
    }
  )
);
