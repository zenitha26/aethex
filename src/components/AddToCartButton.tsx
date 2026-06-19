"use client";

import { useCartStore } from "../store/useCartStore";
import { Product } from "../types/product";

export default function AddToCartButton({ 
  product, 
  quantity = 1,
  color,
  variantId
}: { 
  product: Product;
  quantity?: number;
  color?: string;
  variantId?: string;
}) {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart(product, quantity, color, variantId);
    
    // Custom Toast Notification Implementation
    const toast = document.createElement("div");
    toast.className = "fixed bottom-6 right-6 bg-white text-black px-6 py-4 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-5 font-medium";
    toast.innerHTML = `Added ${quantity} × ${product.title} ${color ? `(${color})` : ''} to cart`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add("fade-out", "slide-out-to-bottom-5");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full md:w-auto px-12 py-4 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition active:scale-95 duration-300"
    >
      Add to Cart
    </button>
  );
}
