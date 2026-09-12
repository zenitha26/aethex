import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../types/product";
import { audioEngine } from "../lib/audio";

interface CompareState {
  compareList: Product[];
  isCompareOpen: boolean;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  setCompareOpen: (open: boolean) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareList: [],
      isCompareOpen: false,

      addToCompare: (product: Product) => {
        try {
          audioEngine.playSelect();
        } catch {}
        set((state) => {
          if (state.compareList.some((p) => p.id === product.id)) return state;
          if (state.compareList.length >= 4) {
            // Keep max 4 items for comparative alignment
            return { compareList: [...state.compareList.slice(1), product] };
          }
          return { compareList: [...state.compareList, product] };
        });
      },

      removeFromCompare: (productId: string) => {
        try {
          audioEngine.playSelect();
        } catch {}
        set((state) => ({
          compareList: state.compareList.filter((p) => p.id !== productId),
        }));
      },

      toggleCompare: (product: Product) => {
        try {
          audioEngine.playSelect();
        } catch {}
        const exists = get().compareList.some((p) => p.id === product.id);
        if (exists) {
          set((state) => ({
            compareList: state.compareList.filter((p) => p.id !== product.id),
          }));
        } else {
          set((state) => {
            if (state.compareList.length >= 4) {
              return { compareList: [...state.compareList.slice(1), product] };
            }
            return { compareList: [...state.compareList, product] };
          });
        }
      },

      isInCompare: (productId: string) => {
        return get().compareList.some((p) => p.id === productId);
      },

      setCompareOpen: (open: boolean) => set({ isCompareOpen: open }),
      clearCompare: () => set({ compareList: [] }),
    }),
    {
      name: "aethex-compare-storage",
    }
  )
);
