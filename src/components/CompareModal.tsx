"use client";

import { useEffect } from "react";
import { useCompareStore } from "../store/useCompareStore";
import { useCartStore } from "../store/useCartStore";
import { Product } from "../types/product";
import { Scale, X, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { audioEngine } from "../lib/audio";

export default function CompareModal() {
  const { compareList, isCompareOpen, setCompareOpen, removeFromCompare, clearCompare } = useCompareStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCompareOpen) setCompareOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCompareOpen, setCompareOpen]);

  const handleAddToCart = (product: Product) => {
    try { audioEngine.playAcquire(); } catch {}
    addToCart(product, 1);
  };

  // Collect all unique spec keys across all compared products
  const allSpecKeys = Array.from(
    new Set(
      compareList.flatMap((p) => (p.specs ? Object.keys(p.specs) : []))
    )
  );

  return (
    <AnimatePresence>
      {isCompareOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCompareOpen(false)}
            className="fixed inset-0 bg-black/50 z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            className="fixed inset-4 sm:inset-10 lg:inset-16 bg-white border border-gray-200 z-[101] shadow-2xl flex flex-col justify-between overflow-hidden font-sans text-[#111111]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-[#F9F9F9]">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-black" />
                <h2 className="text-[#111111] text-sm font-mono tracking-[0.2em] uppercase font-bold">
                  PRODUCT SPECIFICATION COMPARISON ({compareList.length}/4)
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                {compareList.length > 0 && (
                  <button
                    onClick={clearCompare}
                    className="text-[10px] font-mono text-gray-500 hover:text-black uppercase transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button 
                  onClick={() => setCompareOpen(false)} 
                  className="text-gray-500 hover:text-black p-1 transition-colors"
                  aria-label="Close comparison"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Comparison Matrix */}
            <div className="flex-grow overflow-auto p-6 bg-white">
              {compareList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-4 text-gray-400">
                    <Scale className="w-5 h-5" />
                  </div>
                  <p className="text-[#111111] text-xs font-mono uppercase tracking-wider mb-2 font-bold">
                    No Items In Comparison
                  </p>
                  <p className="text-gray-500 text-xs font-light max-w-xs mb-6">
                    Click the comparison icon on any product to compare specs side-by-side.
                  </p>
                  <button
                    onClick={() => setCompareOpen(false)}
                    className="border border-gray-300 text-[#111111] px-6 py-2.5 text-xs font-mono uppercase tracking-widest hover:border-black transition-colors shadow-xs"
                  >
                    Back to Shop
                  </button>
                </div>
              ) : (
                <div className="min-w-[600px] divide-y divide-gray-200 font-mono text-xs">
                  {/* Top Card Row */}
                  <div className="grid grid-cols-5 gap-4 pb-6 items-end">
                    <div className="text-[10px] uppercase text-gray-500 font-semibold">
                      Product Overview
                    </div>
                    {compareList.map((product) => (
                      <div key={product.id} className="space-y-3 bg-[#F9F9F9] border border-gray-200 p-4 relative shadow-xs">
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-black"
                          title="Remove item"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="relative w-full aspect-square bg-white border border-gray-200 overflow-hidden shadow-xs">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.title}
                              fill
                              sizes="120px"
                              className="object-cover p-2"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>

                        <div>
                          <div className="text-[10px] text-gray-500 uppercase truncate">{product.category}</div>
                          <h4 className="text-[#111111] font-bold uppercase truncate mt-0.5">{product.title}</h4>
                          <div className="text-black text-sm font-bold mt-1">
                            Rs. {product.price.toLocaleString()}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-black text-white hover:bg-neutral-800 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Row */}
                  <div className="grid grid-cols-5 gap-4 py-4 items-center">
                    <div className="text-[10px] uppercase text-gray-500">Price (LKR)</div>
                    {compareList.map((p) => (
                      <div key={p.id} className="text-[#111111] font-bold">
                        Rs. {p.price.toLocaleString()}
                        {p.original_price && (
                          <span className="text-gray-400 text-[10px] line-through ml-2">
                            Rs. {p.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Payment Options Row */}
                  <div className="grid grid-cols-5 gap-4 py-4 items-center">
                    <div className="text-[10px] uppercase text-gray-500">Payment</div>
                    {compareList.map((p) => (
                      <div key={p.id} className="text-gray-400 text-[11px]">
                        COD / Bank Transfer
                      </div>
                    ))}
                  </div>

                  {/* Ratings Row */}
                  <div className="grid grid-cols-5 gap-4 py-4 items-center">
                    <div className="text-[10px] uppercase text-gray-500">Rating</div>
                    {compareList.map((p) => (
                      <div key={p.id} className="text-[#111111] flex items-center gap-1">
                        <span>★ {p.rating || "4.8"}</span>
                        <span className="text-gray-500 text-[10px]">({p.reviewCount || "48"})</span>
                      </div>
                    ))}
                  </div>

                  {/* Stock Availability */}
                  <div className="grid grid-cols-5 gap-4 py-4 items-center">
                    <div className="text-[10px] uppercase text-gray-500">Availability</div>
                    {compareList.map((p) => (
                      <div key={p.id} className="text-[#111111] flex items-center gap-1">
                        <Check className="w-3 h-3 text-black" />
                        <span>In Stock (Dispatched in 24h)</span>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Specs Rows */}
                  {allSpecKeys.map((key) => (
                    <div key={key} className="grid grid-cols-5 gap-4 py-3 items-center">
                      <div className="text-[10px] uppercase text-gray-500">{key}</div>
                      {compareList.map((p) => (
                        <div key={p.id} className="text-gray-800 text-xs font-medium">
                          {p.specs && p.specs[key] ? p.specs[key] : "—"}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-[#F9F9F9] flex justify-between items-center text-[10px] font-mono text-gray-600">
              <span>Need fitment or tech assistance? WhatsApp +94 78 234 9954</span>
              <button
                onClick={() => setCompareOpen(false)}
                className="text-black font-bold hover:underline uppercase"
              >
                Close Window
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
