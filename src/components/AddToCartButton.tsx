"use client";

import { useCartStore, Product } from "../store/useCartStore";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCartStore();

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full md:w-auto px-12 py-4 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition active:scale-95 duration-300"
    >
      Add to Cart
    </button>
  );
}
