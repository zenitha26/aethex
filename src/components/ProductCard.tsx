"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "../store/useCartStore";

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  },
  hover: {
    y: -10,
    boxShadow: "0 20px 40px -15px rgba(255, 255, 255, 0.05), 0 0 50px -10px rgba(255, 255, 255, 0.02)",
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }
  }
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.external_id || product.id}`} className="block">
      <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_20px_80px_rgba(255,255,255,0.06)]">
        {/* Aspect Ratio Container */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#0a0a0a]">
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-red-500/20">
              -20%
            </span>
          </div>
          <Image
            fill
            src={product.image_url || "/placeholder-product.jpg"}
            alt={product.title}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-3">
          <h3 className="text-white font-semibold tracking-tight line-clamp-1">
            {product.title}
          </h3>
          <p className="text-sm text-white/60 line-clamp-2">
            {product.description || "Designed with premium precision and high quality engineering."}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-white text-lg font-bold">
              LKR {product.price.toLocaleString()}
            </span>
            <span className="text-white/40 line-through text-sm">
              LKR {Math.round(product.price * 1.25).toLocaleString()}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
