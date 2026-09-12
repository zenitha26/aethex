import { Product } from './product';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  color?: string;
  variantId?: string;
}

export interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  isToastOpen: boolean;
  lastAddedItem: CartItem | null;
  searchQuery: string;
  selectedCategory: string;
  addToCart: (product: Product, quantity?: number, color?: string, variantId?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  setCartOpen: (open: boolean) => void;
  setToastOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  clearCart: () => void;
}

