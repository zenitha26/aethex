"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import CartSummary from "../../components/CartSummary";
import ShopifyCheckoutButton from "../../components/ShopifyCheckoutButton";

export default function CheckoutPage() {
  const { cart } = useCartStore();

  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden py-16 px-4 md:px-8">
      {/* Background blobs */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-silver/60 hover:text-white transition-colors uppercase tracking-widest font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
          <span className="text-sm font-bold tracking-widest font-display text-white">
            AETHEX<span className="text-white/40">STORE</span>
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8 font-display text-center">
          Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="luxury-glass rounded-3xl p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-5 w-5 text-silver/40" />
            </div>
            <h2 className="text-lg font-bold mb-2">Your shopping bag is empty</h2>
            <p className="text-silver/60 text-xs font-light mb-6">
              Add some luxury custom items to your bag before checking out.
            </p>
            <Link href="/" className="apple-btn text-xs py-3 px-6">
              Return to Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="luxury-glass rounded-3xl p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold tracking-tight border-b border-white/5 pb-4">Order Summary</h2>
              
              <CartSummary />
              
              {/* Custom Import Policy Warning */}
              <div className="bg-[#ff9f0a]/5 border border-[#ff9f0a]/20 rounded-xl p-4 text-xs text-[#ff9f0a]/90 leading-relaxed font-medium">
                <p className="mb-2"><strong className="text-[#ff9f0a]">Important Notice regarding Custom Imports:</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Due to the custom nature of these imported luxury goods, all sales are final.</li>
                  <li>No refunds or returns are accepted once the order has been processed.</li>
                  <li>Delivery typically takes between 10-14 business days.</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-white/5">
                <ShopifyCheckoutButton />
              </div>

              <p className="text-[10px] text-silver/40 text-center leading-relaxed flex items-center justify-center gap-1.5 mt-6">
                <ShieldCheck className="h-3.5 w-3.5 text-white/30" /> Secure encrypted checkout powered by Shopify.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
