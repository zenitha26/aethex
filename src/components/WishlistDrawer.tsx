"use client";

import { useEffect } from "react";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCartStore } from "../store/useCartStore";
import { Product } from "../types/product";
import { Heart, X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setWishlistOpen(false)}
            className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
          />

          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            className="fixed right-0 top-0 bottom-0 w-full max-w-[440px] bg-[#0B0B0B] border-l border-white/10 z-[101] shadow-2xl flex flex-col justify-between font-sans text-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#050505]">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-white fill-white" />
                <h2 className="text-white text-sm font-mono tracking-[0.2em] uppercase font-bold">
                  WISHLIST <span className="text-white/40">({wishlist.length})</span>
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                {wishlist.length > 0 && (
                  <button
                    onClick={clearWishlist}
                    className="text-[10px] font-mono text-white/40 hover:text-white uppercase transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button 
                  onClick={() => setWishlistOpen(false)} 
                  className="text-white/50 hover:text-white p-1 transition-colors cursor-pointer"
                  aria-label="Close wishlist"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto px-6 py-4 flex flex-col divide-y divide-white/10 bg-[#0B0B0B]">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center mb-4 text-white/40">
                    <Heart className="w-4 h-4" />
                  </div>
                  <p className="text-white text-xs font-mono uppercase tracking-[0.2em] mb-2 font-semibold">
                    YOUR SAVED HARDWARE
                  </p>
                  <p className="text-white/40 text-xs font-mono max-w-xs mb-6 font-light">
                    Hardware items you save during inspection will appear here.
                  </p>
                  <button
                    onClick={() => setWishlistOpen(false)}
                    className="border border-white/20 hover:border-white text-white px-6 py-2.5 text-xs font-mono uppercase tracking-[0.16em] transition-colors cursor-pointer"
                  >
                    EXPLORE HARDWARE
                  </button>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <Link
                        href={`/products/${item.id}`}
                        onClick={() => setWishlistOpen(false)}
                        className="w-16 h-16 bg-[#050505] border border-white/10 shrink-0 relative overflow-hidden flex items-center justify-center hover:border-white transition-colors"
                      >
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#111111]" />
                        )}
                      </Link>
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.id}`}
                          onClick={() => setWishlistOpen(false)}
                          className="hover:underline"
                        >
                          <h4 className="text-white text-xs font-mono uppercase truncate font-semibold">
                            {item.title}
                          </h4>
                        </Link>
                        <div className="text-white text-xs font-mono font-bold mt-1">
                          Rs. {item.price.toLocaleString()} LKR
                        </div>
                        <div className="text-[10px] font-mono text-white/40">
                          In Stock • Fast Dispatch
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-white text-black hover:bg-white/90 p-2 text-xs font-mono uppercase transition-colors cursor-pointer"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-white/40 hover:text-white p-2 transition-colors cursor-pointer"
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
              <div className="p-6 border-t border-white/10 bg-[#050505]">
                <button
                  onClick={handleMoveAllToCart}
                  className="w-full bg-white text-black hover:bg-white/90 transition-all py-3.5 text-xs font-mono font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
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
