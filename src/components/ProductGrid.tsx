"use client";

import { useMemo, useTransition } from "react";
import { useCartStore } from "../store/useCartStore";
import { Product } from "../types/product";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { audioEngine } from "../lib/audio";

interface ProductGridProps {
  initialProducts?: Product[];
}

export default function ProductGrid({ initialProducts = [] }: ProductGridProps) {
  const { searchQuery } = useCartStore();
  const [isPending, startTransition] = useTransition();

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      return product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  }, [initialProducts, searchQuery]);

  const playHover = () => audioEngine.playClick();
  const playSelect = () => audioEngine.playSelect();

  return (
    <div className="w-full py-24 bg-[#050505]" id="products">
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center border-y border-white/10 bg-[#0B0B0B]">
          <h3 className="text-2xl font-light uppercase tracking-[0.2em] text-[#FFFFFF] mb-4">Archive Empty</h3>
          <p className="text-[#9A9A9A] text-xs uppercase tracking-widest leading-relaxed max-w-sm">
            No footprints matches this parameter log. Realign search target.
          </p>
        </div>
      ) : (
        <div className="space-y-32 max-w-[1600px] mx-auto px-8 lg:px-16">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  key={product.id}
                  style={{ willChange: "transform, opacity" }}
                  className="w-full border-t border-white/10 pt-16"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
                    
                    {/* Visual Frame */}
                    <div 
                      className={`lg:col-span-7 relative aspect-[4/3] w-full overflow-hidden bg-[#0B0B0B] border border-white/10 flex items-center justify-center p-8 group ${
                        !isEven ? "lg:order-2" : ""
                      }`}
                      data-cursor="view"
                    >
                      <Link 
                        href={`/product/${encodeURIComponent(product.id)}`}
                        onClick={playSelect}
                        onMouseEnter={playHover}
                        className="relative w-full h-full max-w-lg aspect-square flex items-center justify-center"
                      >
                        <Image
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          src={product.image_url || "/images/a711/cockpit_matte.jpg"}
                          alt={product.title}
                          className="object-cover p-2 grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                      </Link>
                    </div>

                    {/* Editorial Detail Column */}
                    <div className={`lg:col-span-5 space-y-8 ${!isEven ? "lg:order-1" : ""}`}>
                      <div className="space-y-4">
                        <span className="text-[10px] font-mono tracking-widest text-[#6B6B6B] uppercase block">
                          HARDWARE SPEC {idx + 1}
                        </span>
                        <h3 className="text-3xl md:text-5xl font-light tracking-[0.15em] uppercase leading-none text-[#FFFFFF]">
                          {product.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs font-mono text-[#9A9A9A] tracking-widest">
                          <span className="text-[#FFFFFF] font-bold">
                            {product.currency === "LKR" ? `Rs. ${product.price.toLocaleString()} LKR` : `$ ${product.price} USD`}
                          </span>
                          <span>/</span>
                          <span>{(product.stock ?? 0) > 0 ? "IN STOCK" : "ARCHIVED"}</span>
                        </div>
                      </div>

                      <p className="text-[#9A9A9A] text-sm font-light leading-relaxed max-w-md">
                        {product.description || "Precision automotive hardware. Engineered with expandable 65–95mm base and 360-degree rotation."}
                      </p>

                      <div className="pt-4">
                        <Link 
                          href={`/product/${encodeURIComponent(product.id)}`}
                          onClick={playSelect}
                          onMouseEnter={playHover}
                          className="editorial-link"
                        >
                          Enter Drop
                        </Link>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
