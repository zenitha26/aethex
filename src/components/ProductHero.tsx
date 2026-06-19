"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "../types/product";
import StockStatus from "./StockStatus";
import ProductOptions from "./ProductOptions";
import LiveSync from "./LiveSync";
import CountdownTimer from "./CountdownTimer";
import { ShieldCheck, Truck } from "lucide-react";

export default function ProductHero({ product }: { product: Product }) {
  const isEP10 = product.title.toLowerCase().includes("ep10");
  const [selectedColor, setSelectedColor] = useState("Black");

  // Determine which image to show based on selected color
  const getImageUrl = () => {
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find(v => v.color === selectedColor);
      if (variant && variant.image_url) {
        return variant.image_url;
      }
    }
    return product.image_url || "/placeholder-product.jpg";
  };

  return (
    <div className="grid md:grid-cols-2 gap-16 items-start">
      {/* Left: Image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5">
        <img
          key={selectedColor}
          src={getImageUrl()}
          alt={`${product.title} ${selectedColor}`}
          className="w-full h-full object-cover transition-opacity duration-700 animate-in fade-in"
        />
      </div>

      {/* Right: Info */}
      <div className="space-y-6">
        <h1 className="text-5xl font-bold tracking-tight text-white font-display">{product.title}</h1>
        <p className="text-xl text-white/60 leading-relaxed font-light line-clamp-2">{product.description || "Designed with premium precision and high quality engineering."}</p>
        <div className="text-3xl font-bold text-white font-display">LKR {product.price.toLocaleString()}</div>
        
        <div className="pt-2">
          <StockStatus />
        </div>
        
        <div className="pt-6">
          <ProductOptions product={product} onColorChange={setSelectedColor} />
        </div>
        
        <LiveSync />
        
        <div className="pt-2">
          <CountdownTimer />
        </div>

        {/* Trust Badges */}
        <div className="pt-6 border-t border-white/10 mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm text-white/60">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span>Secure Encrypted Checkout</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <Truck className="w-5 h-5 text-blue-400" />
            <span>Free Insured Shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
}
