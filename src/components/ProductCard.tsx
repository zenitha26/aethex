"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "../types/product";

const ProductCard = memo(({ product }: { product: Product }) => {
  return (
    <Link href={`/product/${encodeURIComponent(product.external_id || product.id)}`} className="block h-full w-full group">
      <article 
        className="relative h-full flex flex-col bg-[#111111] border border-white/10 overflow-hidden"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#050505] w-full border-b border-white/10">
          <Image
            fill
            src={product.image_url || "/placeholder-product.jpg"}
            alt={product.title}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-all duration-700 ease-[0.19,1,0.22,1] grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100"
            style={{ transform: "translateZ(0)", willChange: "transform, filter, opacity" }} 
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          />
        </div>
        
        <div className="p-8 flex flex-col justify-between bg-[#111111] transition-colors duration-500 min-h-[140px] group-hover:bg-[#ECECEC]">
          <div>
            <h3 className="text-[#FFFFFF] group-hover:text-[#050505] font-bold uppercase tracking-tight text-xl transition-colors">{product.title}</h3>
            <p className="text-[#9A9A9A] group-hover:text-[#6B6B6B] font-sans mt-2 line-clamp-1 transition-colors">
              {product.description || "Uncompromising standard."}
            </p>
          </div>
          <div className="flex justify-between items-end mt-4">
            <span className="text-[#9A9A9A] group-hover:text-[#6B6B6B] text-xs font-bold tracking-widest uppercase transition-colors">Select Option</span>
            <span className="text-[#FFFFFF] group-hover:text-[#050505] font-mono text-sm tracking-widest transition-colors">LKR {product.price.toLocaleString()}</span>
          </div>
        </div>
      </article>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
