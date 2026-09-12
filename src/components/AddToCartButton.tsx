"use client";

import { useState, useCallback } from "react";
import { useCartStore } from "../store/useCartStore";
import { Product } from "../types/product";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

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
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleAddToCart = useCallback(async () => {
    if (status !== "idle") return;
    setStatus("loading");

    await new Promise(resolve => setTimeout(resolve, 600));
    
    addToCart(product, quantity, color, variantId);
    setStatus("success");
    
    const toast = document.createElement("div");
    toast.className = "fixed bottom-6 right-6 bg-neutral-900 text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5 font-medium text-sm";
    toast.innerHTML = `Added ${quantity} × ${product.title} ${color ? `(${color})` : ''} to cart`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add("fade-out", "slide-out-to-bottom-5");
      setTimeout(() => toast.remove(), 300);
    }, 3000);

    setTimeout(() => setStatus("idle"), 2000);
  }, [addToCart, product, quantity, color, variantId, status]);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleAddToCart}
      className="relative w-full md:w-auto px-10 py-3.5 bg-neutral-900 text-white rounded-full font-medium overflow-hidden flex items-center justify-center min-w-[180px] shadow-sm"
      style={{ willChange: "transform" }}
    >
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.span key="idle" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
            Add to Cart
          </motion.span>
        )}
        {status === "loading" && (
          <motion.div key="loading" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Loader2 className="w-5 h-5 animate-spin" />
          </motion.div>
        )}
        {status === "success" && (
          <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
            <Check className="w-5 h-5" /> Added
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
