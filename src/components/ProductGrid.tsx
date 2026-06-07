"use client";

import { useState } from "react";
import { useCartStore, Product } from "../store/useCartStore";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { staggerContainer } from "../lib/animations";

interface ProductGridProps {
  initialProducts?: Product[];
}

export default function ProductGrid({ initialProducts = [] }: ProductGridProps) {
  const { searchQuery, selectedCategory, setSelectedCategory } = useCartStore();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const categories = ["All", "in-house", "aliexpress"];

  // Filter items
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.source === selectedCategory.toLowerCase();
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full py-16" id="products">


      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-[#0a0a0a] rounded-3xl border border-neutral-800">
          <div className="w-16 h-16 mb-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.02)]">
            <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Curated Catalog Unavailable</h3>
          <p className="text-neutral-400 max-w-md text-sm leading-relaxed">
            We are currently synchronizing our inventory with our global design partners. Please check back shortly for our updated collection of premium workspace peripherals.
          </p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
