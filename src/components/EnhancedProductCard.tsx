"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../types/product";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCompareStore } from "../store/useCompareStore";
import { 
  ShoppingBag, 
  Heart, 
  Eye, 
  Scale, 
  ThumbsUp 
} from "lucide-react";
import { audioEngine } from "../lib/audio";

interface EnhancedProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function EnhancedProductCard({ product, onQuickView }: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleCompare, isInCompare } = useCompareStore();

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try { audioEngine.playAcquire(); } catch {}
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try { audioEngine.playSelect(); } catch {}
    toggleWishlist(product);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try { audioEngine.playSelect(); } catch {}
    toggleCompare(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try { audioEngine.playClick(); } catch {}
    if (onQuickView) onQuickView(product);
  };

  return (
    <div 
      className="group relative bg-[#0B0B0B] border border-white/10 hover:border-white/30 rounded-2xl sm:rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden font-sans text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full bg-[#080808] overflow-hidden">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
        </Link>

        {/* Floating Tag Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-white text-black text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md">
            {product.badge}
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-3 right-3 bg-white/10 text-white border border-white/20 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-md">
            -{discountPercent}%
          </div>
        )}

        {/* Top Right Floating Action Icons (Wishlist & Compare) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all border ${
                isFavorited 
                  ? "bg-white text-black border-white" 
                  : "bg-black/70 text-white border-white/10 hover:bg-white hover:text-black hover:border-white"
              }`}
              title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
              aria-label="Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-black" : ""}`} />
            </button>

            <button
              onClick={handleToggleCompare}
              className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all border ${
                isCompared 
                  ? "bg-white text-black border-white" 
                  : "bg-black/70 text-white border-white/10 hover:bg-white hover:text-black hover:border-white"
              }`}
              title={isCompared ? "Remove from Compare" : "Compare Product"}
              aria-label="Compare"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick View trigger on hover */}
        <button
          onClick={handleQuickView}
          className="hidden md:flex absolute bottom-3 left-3 right-3 bg-white text-black hover:bg-white/90 text-[10px] font-mono font-bold uppercase tracking-widest py-2.5 rounded-full items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-10 shadow-xl"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3 bg-[#0B0B0B]">
        <div className="space-y-1.5">
          {/* Category */}
          <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
            {product.category || "TECH & HARDWARE"}
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="text-white text-xs sm:text-sm font-semibold hover:text-white/80 line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/60 pt-0.5">
            <ThumbsUp className="w-3 h-3 text-white" />
            <span className="text-white font-bold">{product.reviewCount || 48}</span>
            <span className="text-white/40">verified</span>
          </div>
        </div>

        {/* Price & Installment */}
        <div className="space-y-1 pt-2 border-t border-white/10">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-white font-mono">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="text-xs text-white/40 line-through font-mono">
                Rs. {product.original_price.toLocaleString()}
              </span>
            )}
          </div>

          {/* 3X Installment breakdown */}
          <div className="text-[10px] font-mono text-white/50 truncate">
            or 3 × <span className="text-white font-bold">Rs. {Math.round(product.price / 3).toLocaleString()}</span> with Koko
          </div>
        </div>

        {/* Primary Action Button (Solid White Rounded-Full Pill CTA) */}
        <div className="pt-2">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-black hover:bg-white/90 py-2.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
}
