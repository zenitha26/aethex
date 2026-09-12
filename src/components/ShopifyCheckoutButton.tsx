"use client";

import React from "react";
import { useCartStore } from "../store/useCartStore";
import { ArrowRight, Loader2 } from "lucide-react";

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
    <div className="w-full space-y-4">
      {error && (
        <div className="p-4 border border-white/10 text-xs text-white bg-black uppercase tracking-wider font-mono">
          {error}
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={cart.length === 0 || isRedirecting}
        className={`w-full flex items-center justify-center gap-3 px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
          cart.length === 0 || isRedirecting
            ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
            : "bg-white text-black hover:bg-[#ECECEC]"
        }`}
      >
        {isRedirecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-black" />
            <span>Redirecting...</span>
          </>
        ) : (
          <>
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4 text-black group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </div>
  );
}
