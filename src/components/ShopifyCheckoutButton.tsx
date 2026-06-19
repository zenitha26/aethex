"use client";

import React from "react";
import { useCartStore } from "../store/useCartStore";
import { CartItem } from "../types/cart";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function ShopifyCheckoutButton() {
  const { cart } = useCartStore();
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsRedirecting(true);
    setError(null);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create Shopify checkout.");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned from Shopify.");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {error && (
        <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-400">
          {error}
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={cart.length === 0 || isRedirecting}
        className={`relative w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-full font-semibold text-sm transition-all duration-500 overflow-hidden group ${
          cart.length === 0 || isRedirecting
            ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
            : "bg-white text-black hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
        }`}
      >
        <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        
        {isRedirecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-black" />
            <span>Redirecting to Checkout...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 fill-current text-black group-hover:scale-110 transition-transform duration-300" />
            <span className="tracking-wide">Checkout Securley</span>
          </>
        )}
      </button>
    </div>
  );
}
