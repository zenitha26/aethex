"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../types/product";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { 
  ShoppingBag, 
  Heart, 
  Eye, 
  ThumbsUp 
} from "lucide-react";

interface EnhancedProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function EnhancedProductCard({ product, onQuickView }: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFavorited = isInWishlist(product.id);

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
        <Link href={`/products/${product.id}`} className="block w-full h-full">
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

        {/* Minimal Category Spec Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-white text-black text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 shadow-md">
            {product.badge}
          </div>
        )}

        {/* Top Right Floating Action Icons (Wishlist) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all border cursor-pointer ${
                isFavorited 
                  ? "bg-white text-black border-white" 
                  : "bg-black/70 text-white border-white/10 hover:bg-white hover:text-black hover:border-white"
              }`}
              title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
              aria-label="Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-black" : ""}`} />
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
      <div className="p-5 flex flex-col flex-grow justify-between space-y-3 bg-[#0B0B0B]">
        <div className="space-y-2">
          {/* Category */}
          <div className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">
            {product.category || "CAR ACCESSORIES"}
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-white text-sm font-medium hover:text-white/80 line-clamp-2 leading-snug font-sans">
              {product.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed font-light">
            {product.subtitle || product.description}
          </p>
        </div>

        {/* Price & Settlement */}
        <div className="space-y-1.5 pt-3 border-t border-white/10 font-mono">
          <div className="flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              Rs. {product.price.toLocaleString()} LKR
            </span>
            <span className="text-[10px] uppercase text-emerald-400 font-semibold tracking-wider">
              {product.inStock ? "IN STOCK" : "PRE-ORDER"}
            </span>
          </div>

          <div className="text-[10px] text-white/40 truncate">
            Cash on Delivery &bull; Bank Transfer &bull; Islandwide Delivery
          </div>
        </div>

        {/* Primary Action Button (Add to Cart) */}
        <div className="pt-2">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-black hover:bg-white/90 py-3 text-xs font-mono font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-black" />
            <span>ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
}
