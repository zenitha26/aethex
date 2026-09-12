import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartState } from "../types/cart";
import { audioEngine } from "../lib/audio";

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      isToastOpen: false,
      lastAddedItem: null,
      searchQuery: "",
      selectedCategory: "All",

      addToCart: (product, quantity = 1, color?: string, variantId?: string) => {
        try {
          audioEngine.playAcquire();
        } catch {}

        set((state) => {
          const qty = Math.max(1, quantity);
          const newItemId = `${product.id}-${color || 'standard'}`;
          const existingItemIndex = state.cart.findIndex((item) => item.id === newItemId);
          let newCart = [...state.cart];

          const addedItem: CartItem = {
            id: newItemId,
            title: product.title,
            price: product.price,
            image: product.image_url,
            quantity: qty,
            color: color || undefined,
            variantId: variantId || product.variant_id,
          };

          if (existingItemIndex > -1) {
            newCart[existingItemIndex] = {
              ...newCart[existingItemIndex],
              quantity: newCart[existingItemIndex].quantity + qty,
            };
          } else {
            newCart.push(addedItem);
          }

          return { 
            cart: newCart, 
            isToastOpen: true, 
            lastAddedItem: addedItem 
          };
        });
      },

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
      setToastOpen: (open) => set({ isToastOpen: open }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "aethex-cart-storage-v3",
    }
  )
);

