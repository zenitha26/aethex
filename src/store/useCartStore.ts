import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  original_price?: number | null;
  image_url?: string;
  source?: string;
  external_id?: string;
  product_url?: string;
  stock?: number;
  variant_id?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: {
    switches: string;
    keycaps: string;
    caseStyle: string;
  };
}

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  addToCart: (product: Product, customization?: CartItem["customization"]) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  setCartOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      searchQuery: "",
      selectedCategory: "All",

      addToCart: (product, customization) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex((item) => {
            const matchesId = item.product.id === product.id;
            if (!customization && !item.customization) return matchesId;
            if (customization && item.customization) {
              return (
                matchesId &&
                item.customization.switches === customization.switches &&
                item.customization.keycaps === customization.keycaps &&
                item.customization.caseStyle === customization.caseStyle
              );
            }
            return false;
          });

          let newCart = [...state.cart];

          if (existingItemIndex > -1) {
            newCart[existingItemIndex] = {
              ...newCart[existingItemIndex],
              quantity: newCart[existingItemIndex].quantity + 1,
            };
          } else {
            newCart.push({ product, quantity: 1, customization });
          }

          return { cart: newCart, isCartOpen: true };
        }),

      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => {
            const uniqueId = item.customization
              ? `${item.product.id}-${item.customization.switches}-${item.customization.keycaps}-${item.customization.caseStyle}`
              : item.product.id;
            return uniqueId !== itemId;
          }),
        })),

      updateQuantity: (itemId, delta) =>
        set((state) => {
          const newCart = state.cart
            .map((item) => {
              const uniqueId = item.customization
                ? `${item.product.id}-${item.customization.switches}-${item.customization.keycaps}-${item.customization.caseStyle}`
                : item.product.id;

              if (uniqueId === itemId) {
                return { ...item, quantity: item.quantity + delta };
              }
              return item;
            })
            .filter((item) => item.quantity > 0);

          return { cart: newCart };
        }),

      setCartOpen: (open) => set({ isCartOpen: open }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "aethex-cart-storage", // local storage key
    }
  )
);
