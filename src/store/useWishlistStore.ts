import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../types/product";

interface WishlistState {
  wishlist: Product[];
  isWishlistOpen: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  setWishlistOpen: (open: boolean) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      isWishlistOpen: false,

      addToWishlist: (product: Product) => {
        set((state) => {
          if (state.wishlist.some((p) => p.id === product.id)) return state;
          return { wishlist: [...state.wishlist, product] };
        });
      },

      removeFromWishlist: (productId: string) => {
        set((state) => ({
          wishlist: state.wishlist.filter((p) => p.id !== productId),
        }));
      },

      toggleWishlist: (product: Product) => {
        const exists = get().wishlist.some((p) => p.id === product.id);
        if (exists) {
          set((state) => ({
            wishlist: state.wishlist.filter((p) => p.id !== product.id),
          }));
        } else {
          set((state) => ({
            wishlist: [...state.wishlist, product],
          }));
        }
      },

      isInWishlist: (productId: string) => {
        return get().wishlist.some((p) => p.id === productId);
      },

      setWishlistOpen: (open: boolean) => set({ isWishlistOpen: open }),
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "aethex-wishlist-storage",
    }
  )
);
