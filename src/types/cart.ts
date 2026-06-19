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
  searchQuery: string;
  selectedCategory: string;
  addToCart: (product: Product, quantity?: number, color?: string, variantId?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  setCartOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  clearCart: () => void;
}
