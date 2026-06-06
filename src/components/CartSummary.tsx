"use client";

import React from "react";
import { useCartStore, CartItem } from "../store/useCartStore";
import { Plus, Minus, Trash2 } from "lucide-react";

export default function CartSummary() {
  const { cart, updateQuantity, removeFromCart } = useCartStore();

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getItemUniqueId = (item: CartItem) => {
    if (!item.customization) return item.product.id;
    return `${item.product.id}-${item.customization.switches}-${item.customization.keycaps}-${item.customization.caseStyle}`;
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-3xl luxury-glass">
        <p className="text-silver/50 text-sm font-light">Your shopping bag is empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-white text-lg font-bold font-display tracking-tight border-b border-white/5 pb-3">
        Order Summary
      </h3>

      <div className="divide-y divide-white/5 space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {cart.map((item, index) => {
          const uniqueId = getItemUniqueId(item);
          return (
            <div
              key={uniqueId}
              className={`flex gap-4 pt-4 ${index === 0 ? "pt-0" : ""}`}
              id={`checkout-summary-item-${uniqueId}`}
            >
              {/* Product Thumbnail */}
              <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.product.id === "9912002" ? (
                  <svg width="32" height="32" viewBox="0 0 240 160" fill="none">
                    <rect x="80" y="25" width="80" height="110" rx="40" fill="#121212" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 240 160" fill="none">
                    <rect x="15" y="40" width="210" height="90" rx="12" fill="#121212" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                  </svg>
                )}
              </div>

              {/* Product Info & Quantity Controls */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-white text-sm font-semibold leading-tight line-clamp-1">
                    {item.product.title}
                  </h4>
                  {item.customization ? (
                    <p className="text-[10px] text-silver/50 mt-0.5">
                      {item.customization.switches} | {item.customization.keycaps} | {item.customization.caseStyle}
                    </p>
                  ) : (
                    <p className="text-[10px] text-silver/40 mt-0.5 uppercase tracking-wider">
                      {item.product.source || "AETHEX"}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  {/* Quantity adjustments */}
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-full py-1 px-2.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(uniqueId, -1)}
                      className="text-silver hover:text-white p-0.5 transition-colors"
                      id={`summary-qty-dec-${uniqueId}`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-white text-xs font-bold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(uniqueId, 1)}
                      className="text-silver hover:text-white p-0.5 transition-colors"
                      id={`summary-qty-inc-${uniqueId}`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="text-white text-sm font-bold font-display">
                    {formatLKR(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFromCart(uniqueId)}
                className="self-start text-silver/40 hover:text-red-400 p-1 transition-colors mt-0.5"
                id={`summary-remove-btn-${uniqueId}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Subtotal Display */}
      <div className="border-t border-white/5 pt-4 space-y-2.5">
        <div className="flex justify-between items-center text-sm">
          <span className="text-silver/60 font-light">Subtotal</span>
          <span className="text-white font-medium">{formatLKR(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-silver/60 font-light">Shipping</span>
          <span className="text-white font-medium text-xs uppercase tracking-wider text-green-400">Free</span>
        </div>
        <div className="border-t border-white/5 pt-3 flex justify-between items-center">
          <span className="text-silver/90 text-sm font-semibold">Total</span>
          <span className="text-white text-lg font-bold font-display">{formatLKR(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
