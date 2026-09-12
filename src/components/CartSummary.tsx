"use client";

import React from "react";
import { useCartStore } from "../store/useCartStore";
import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";

export default function CartSummary() {
  const { cart, updateQuantity, removeFromCart } = useCartStore();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center bg-black border border-white/10">
        <p className="text-[#9A9A9A] text-sm font-light">Your shopping bag is empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="divide-y divide-white/10 space-y-4 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
        {cart.map((item, index) => {
          const uniqueId = item.id;
          return (
            <div
              key={uniqueId}
              className={`flex gap-6 pt-4 ${index === 0 ? "pt-0" : ""}`}
              id={`checkout-summary-item-${uniqueId}`}
            >
              {/* Product Thumbnail */}
              <div className="w-16 h-20 bg-black border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill className="object-cover grayscale" />
                ) : (
                  <div className="w-8 h-8 bg-white/5" />
                )}
              </div>

              {/* Product Info & Quantity Controls */}
              <div className="flex-grow flex flex-col justify-between py-1">
                <div>
                  <h4 className="text-white text-sm font-bold uppercase tracking-tight leading-tight line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-[#9A9A9A] mt-1 font-semibold uppercase tracking-wider">
                    {item.color || "Standard Edition"}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity adjustments */}
                  <div className="flex items-center bg-white/5 border border-white/10 py-1 px-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(uniqueId, -1)}
                      className="text-[#9A9A9A] hover:text-white transition-colors"
                      id={`summary-qty-dec-${uniqueId}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-white text-xs font-bold w-6 text-center font-mono">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(uniqueId, 1)}
                      className="text-[#9A9A9A] hover:text-white transition-colors"
                      id={`summary-qty-inc-${uniqueId}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="text-white text-xs font-bold font-mono tracking-widest">
                    {formatLKR(item.price * item.quantity)}
                  </span>
                </div>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFromCart(uniqueId)}
                className="self-start text-[#6B6B6B] hover:text-white p-1 transition-colors mt-0.5"
                id={`summary-remove-btn-${uniqueId}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Subtotal Display */}
      <div className="border-t border-white/10 pt-6 space-y-4">
        {/* Discount Code Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Discount Code"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-xs text-white placeholder-[#6B6B6B] focus:outline-none focus:border-white/30 transition-colors uppercase tracking-wider font-mono"
          />
          <button className="px-6 py-2.5 bg-white text-black hover:bg-[#ECECEC] text-[10px] font-bold uppercase tracking-widest transition-colors">
            Apply
          </button>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#9A9A9A] uppercase tracking-wider font-bold">Subtotal</span>
            <span className="text-white font-mono">{formatLKR(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#9A9A9A] uppercase tracking-wider font-bold">Shipping</span>
            <span className="text-white uppercase tracking-wider font-mono font-bold">Free</span>
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between items-center">
            <span className="text-white text-xs uppercase tracking-widest font-extrabold">Total Estimate</span>
            <span className="text-white text-base font-bold font-mono tracking-widest">{formatLKR(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
