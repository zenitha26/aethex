import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartState } from "../types/cart";

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      searchQuery: "",
      selectedCategory: "All",

      addToCart: (product, quantity = 1, color?: string, variantId?: string) =>
        set((state) => {
          const newItemId = `${product.id}-${color || 'none'}`;

          const existingItemIndex = state.cart.findIndex((item) => item.id === newItemId);

          let newCart = [...state.cart];

          if (existingItemIndex > -1) {
            newCart[existingItemIndex] = {
              ...newCart[existingItemIndex],
              quantity: newCart[existingItemIndex].quantity + quantity,
            };
          } else {
            newCart.push({
              id: newItemId,
              title: product.title,
              price: product.price,
              image: product.image_url,
              quantity: Math.max(1, quantity),
              color,
              variantId: variantId || product.variant_id,
            });
          }

          return { cart: newCart, isCartOpen: true };
        }),

      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        })),

      updateQuantity: (itemId, delta) =>
        set((state) => {
          const newCart = state.cart
            .map((item) => {
              if (item.id === itemId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
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
      name: "aethex-cart-storage-v2", // changed key to v2 to avoid conflicts with old schema
    }
  )
);
