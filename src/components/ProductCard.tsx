"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCartStore, Product } from "../store/useCartStore";

interface ProductCardProps {
  product: Product;
}

const renderProductGraphic = (id: string) => {
  // Return vector-styled SVGs for high-end dropshipping product representations
  switch (id) {
    case "p1":
    case "9912001":
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 160" fill="none" className="opacity-90">
          <rect x="15" y="40" width="210" height="90" rx="12" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <rect x="25" y="50" width="190" height="70" rx="8" fill="#050505" />
          <rect x="35" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.15)" />
          <rect x="55" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="75" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="95" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="115" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="135" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="155" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="175" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="195" y="60" width="10" height="14" rx="2" fill="rgba(255,255,255,0.3)" />
          {/* Row 2 */}
          <rect x="35" y="80" width="20" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="60" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="80" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="100" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="120" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="140" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="160" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="180" y="80" width="25" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          {/* Row 3 space */}
          <rect x="85" y="100" width="70" height="14" rx="4" fill="rgba(255,255,255,0.15)" />
        </svg>
      );
    case "p2":
    case "9912002":
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 160" fill="none" className="opacity-90">
          <rect x="80" y="25" width="80" height="110" rx="40" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <line x1="120" y1="25" x2="120" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <rect x="115" y="45" width="10" height="20" rx="5" fill="#ffffff" />
          <circle cx="120" cy="100" r="4" fill="rgba(255,255,255,0.2)" />
        </svg>
      );
    case "p3":
    case "ali8839401":
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 160" fill="none" className="opacity-90">
          <rect x="30" y="70" width="180" height="10" rx="3" fill="rgba(255,255,255,0.2)" />
          <rect x="25" y="65" width="190" height="6" rx="2" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <path d="M45 80 L38 115 L52 115 Z" fill="rgba(255,255,255,0.1)" />
          <path d="M195 80 L188 115 L202 115 Z" fill="rgba(255,255,255,0.1)" />
        </svg>
      );
    case "p4":
    case "ali8839402":
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 160" fill="none" className="opacity-90">
          <path d="M70 85C70 45 92 35 120 35C148 35 170 45 170 85" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeLinecap="round" />
          <rect x="54" y="65" width="22" height="45" rx="8" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <rect x="164" y="65" width="22" height="45" rx="8" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        </svg>
      );
    case "p5":
    case "ali8839403":
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 160" fill="none" className="opacity-90">
          <rect x="20" y="35" width="200" height="90" rx="10" fill="#0d0d0d" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
          <rect x="23" y="38" width="194" height="84" rx="8" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <path d="M40 100 Q80 60 120 90 T200 50" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" fill="none" />
        </svg>
      );
    case "p6":
    case "ali8839404":
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 160" fill="none" className="opacity-90">
          <rect x="40" y="115" width="40" height="8" rx="2" fill="rgba(255,255,255,0.1)" />
          <rect x="57" y="70" width="8" height="45" fill="rgba(255,255,255,0.15)" />
          <path d="M60 75 L120 60" stroke="rgba(255,255,255,0.2)" strokeWidth="5" strokeLinecap="round" />
          <path d="M120 60 L170 85" stroke="rgba(255,255,255,0.2)" strokeWidth="5" strokeLinecap="round" />
          <rect x="170" y="55" width="55" height="50" rx="4" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </svg>
      );
    default:
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 160" fill="none" className="opacity-90">
          <rect x="40" y="30" width="160" height="100" rx="12" fill="#121212" />
        </svg>
      );
  }
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();

  const formattedPrice = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0
  }).format(product.price);

  const formattedOriginalPrice = product.original_price
    ? new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 0
      }).format(product.original_price)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between p-5 luxury-glass rounded-3xl luxury-glass-hover overflow-hidden"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-video mb-6 w-full rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center overflow-hidden">
        {product.original_price && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-white text-[#050505] text-[10px] font-extrabold uppercase rounded-full tracking-wider">
            Sale
          </span>
        )}
        <div className="w-full h-full p-6 transition-transform duration-700 ease-out group-hover:scale-110">
          {renderProductGraphic(product.id)}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="text-white text-lg font-bold font-display group-hover:text-silver transition-colors duration-300">
            {product.title}
          </h3>
          <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded">
            {product.source}
          </span>
        </div>
        <p className="text-silver/60 text-xs mb-6 font-light leading-relaxed line-clamp-2">
          {product.description || "Designed with premium precision and high quality engineering."}
        </p>
      </div>

      {/* Product Footer */}
      <div className="flex justify-between items-center mt-auto">
        <div className="flex flex-col">
          {formattedOriginalPrice && (
            <span className="text-xs text-silver/40 line-through font-light mb-0.5">
              {formattedOriginalPrice}
            </span>
          )}
          <span className="text-white text-base font-bold font-display tracking-tight">
            {formattedPrice}
          </span>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="p-3 bg-white text-[#050505] hover:bg-[#e5e5ea] rounded-full transition-all duration-300 transform active:scale-95"
          aria-label={`Add ${product.title} to cart`}
          id={`add-to-cart-${product.id}`}
        >
          <Plus className="h-4 w-4 stroke-[3]" />
        </button>
      </div>
    </motion.div>
  );
}
