"use client";

import { useEffect } from "react";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCartStore } from "../store/useCartStore";
import { Product } from "../types/product";
import { Heart, X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { audioEngine } from "../lib/audio";

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setWishlistOpen, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addToCart, setCartOpen } = useCartStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isWishlistOpen) setWishlistOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWishlistOpen, setWishlistOpen]);

  const handleAddToCart = (product: Product) => {
    try { audioEngine.playAcquire(); } catch {}
    addToCart(product, 1);
  };

  const handleMoveAllToCart = () => {
    try { audioEngine.playAcquire(); } catch {}
    wishlist.forEach(p => addToCart(p, 1));
    setWishlistOpen(false);
    setCartOpen(true);
  };

  const drawerVariants: Variants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0, 
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } 
    },
    exit: { x: "100%", transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setWishlistOpen(false)}
            className="fixed inset-0 bg-black/40 z-[100]"
          />

          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            className="fixed right-0 top-0 bottom-0 w-full max-w-[440px] bg-white border-l border-gray-200 z-[101] shadow-2xl flex flex-col justify-between font-sans text-[#111111]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-[#F9F9F9]">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-black fill-black" />
                <h2 className="text-[#111111] text-sm font-mono tracking-[0.2em] uppercase font-bold">
                  WISHLIST <span className="text-gray-500">({wishlist.length})</span>
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                {wishlist.length > 0 && (
                  <button
                    onClick={clearWishlist}
                    className="text-[10px] font-mono text-gray-500 hover:text-black uppercase transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button 
                  onClick={() => setWishlistOpen(false)} 
                  className="text-gray-500 hover:text-black p-1 transition-colors"
                  aria-label="Close wishlist"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto px-6 py-4 flex flex-col divide-y divide-gray-100 bg-white">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-4 text-gray-400">
                    <Heart className="w-5 h-5" />
                  </div>
                  <p className="text-[#111111] text-xs font-mono uppercase tracking-wider mb-2 font-bold">
                    Your Wishlist Is Empty
                  </p>
                  <p className="text-gray-500 text-xs font-light max-w-xs mb-6">
                    Tap the heart icon on any product card to save items for later.
                  </p>
                  <button
                    onClick={() => setWishlistOpen(false)}
                    className="border border-gray-300 text-[#111111] px-6 py-2.5 text-xs font-mono uppercase tracking-widest hover:border-black transition-colors shadow-xs"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-16 bg-[#F9F9F9] border border-gray-200 shrink-0 relative overflow-hidden">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-cover p-1"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[#111111] text-xs font-mono uppercase truncate font-semibold">
                          {item.title}
                        </h4>
                        <div className="text-black text-xs font-mono font-bold mt-1">
                          Rs. {item.price.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500">
                          In Stock • Fast Dispatch
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-black text-white hover:bg-neutral-800 p-2 text-xs font-mono uppercase transition-colors shadow-xs"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-gray-400 hover:text-black p-2 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {wishlist.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-[#F9F9F9]">
                <button
                  onClick={handleMoveAllToCart}
                  className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3.5 text-xs font-mono font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>MOVE ALL TO CART</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
