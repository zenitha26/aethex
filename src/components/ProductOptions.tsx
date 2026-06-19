"use client";

import { useState, useMemo } from "react";
import AddToCartButton from "./AddToCartButton";
import WhatsAppBuyNow from "./WhatsAppBuyNow";
import { Product } from "../types/product";
import { Minus, Plus } from "lucide-react";

export default function ProductOptions({ product, onColorChange }: { product: Product, onColorChange?: (color: string) => void }) {
  const [quantity, setQuantity] = useState(1);
  const isEP10 = product.title.toLowerCase().includes("ep10");

  const colors = useMemo(() => {
    let extractedColors: { name: string, hex: string, id?: string }[] = [];
    
    if (product.variants && product.variants.length > 0) {
      extractedColors = product.variants.map(v => ({
        name: v.color || "Black",
        hex: v.color?.toLowerCase() === "white" ? "#F3F4F6" : 
             v.color?.toLowerCase() === "blue" ? "#93C5FD" : "#111111",
        id: v.id
      }));
    } else {
      extractedColors = [
        { name: "Black", hex: "#111111" },
        { name: "White", hex: "#F3F4F6" },
        { name: "Blue", hex: "#93C5FD" }
      ];
    }
    
    // De-duplicate colors
    const uniqueColors = [];
    const seen = new Set();
    for (const c of extractedColors) {
      if (!seen.has(c.name)) {
        seen.add(c.name);
        uniqueColors.push(c);
      }
    }
    return uniqueColors;
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "Black");

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    if (onColorChange) {
      onColorChange(colorName);
    }
  };

  const selectedVariantId = product.variants?.find(v => v.color === selectedColor)?.id || product.variant_id;

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      {isEP10 && colors.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-white/80">Color: {selectedColor}</label>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorSelect(color.name)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color.name ? "border-white bg-white/10 scale-110" : "border-white/10 opacity-80 hover:opacity-100"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white/80">Quantity</label>
        <div className="flex items-center gap-4 border border-white/10 rounded-full w-max p-1 bg-white/[0.02]">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-white font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(99, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-6">
        <AddToCartButton 
          product={product} 
          quantity={quantity} 
          color={isEP10 ? selectedColor : undefined}
          variantId={selectedVariantId}
        />
        <WhatsAppBuyNow 
          product={product} 
          quantity={quantity} 
          color={isEP10 ? selectedColor : undefined} 
        />
      </div>
    </div>
  );
}
