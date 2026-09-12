"use client";

import { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { Check, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { audioEngine } from "../lib/audio";

export default function CartToast() {
  const { isToastOpen, setToastOpen, lastAddedItem, setCartOpen } = useCartStore();

  useEffect(() => {
    if (isToastOpen) {
      const timer = setTimeout(() => {
        setToastOpen(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isToastOpen, setToastOpen]);

  const handleViewCart = () => {
    try { audioEngine.playSelect(); } catch {}
    setToastOpen(false);
    setCartOpen(true);
  };

  return (
    <AnimatePresence>
      {isToastOpen && lastAddedItem && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-[9999] max-w-md w-[calc(100%-2rem)] bg-[#111111] text-white border border-neutral-800 p-4 shadow-2xl font-sans"
        >
          <div className="flex items-center gap-3">
            {/* Checkmark Icon */}
            <div className="w-8 h-8 border border-white/30 bg-black flex items-center justify-center shrink-0 text-white">
              <Check className="w-4 h-4" />
            </div>

            {/* Thumbnail */}
            {lastAddedItem.image && (
              <div className="relative w-10 h-10 bg-neutral-900 border border-white/10 shrink-0 overflow-hidden">
                <Image
                  src={lastAddedItem.image}
                  alt={lastAddedItem.title}
                  fill
                  sizes="40px"
                  className="object-cover p-1"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                Added to cart
              </div>
              <div className="text-white text-xs font-mono font-bold truncate">
                {lastAddedItem.title}
              </div>
              <div className="text-[11px] font-mono text-gray-300">
                Rs. {lastAddedItem.price.toLocaleString()} LKR
              </div>
            </div>

            {/* View Cart Button */}
            <button
              onClick={handleViewCart}
              className="bg-white text-black hover:bg-gray-200 px-3.5 py-2 text-[11px] font-mono font-bold uppercase tracking-wider shrink-0 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setToastOpen(false)}
              className="text-gray-400 hover:text-white p-1 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
