"use client";

import React, { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";

interface CheckoutFormProps {
  onBack: () => void;
  totalAmount: number;
}

export default function CheckoutForm({ onBack, totalAmount }: CheckoutFormProps) {
  const { cart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handlePayHereSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Post to our secure payhere-init Supabase Edge Function
      // Note: In local development, replace URL with your project domain or local Deno serve port
      const edgeFunctionUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/payhere-init`
          : "http://localhost:54321/functions/v1/payhere-init"; // local fallback

      const response = await fetch(edgeFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Send anonymous key if configured
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}`
        },
        body: JSON.stringify({
          customer_name: name,
          email,
          phone,
          address,
          cart
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to initialize payment hash.");
      }

      const paymentData = await response.json();

      // Create a hidden form programmatically to post parameters to PayHere Sandbox
      const payhereUrl = "https://sandbox.payhere.lk/pay/checkout";
      const form = document.createElement("form");
      form.method = "POST";
      form.action = payhereUrl;

      // Define PayHere payload attributes
      const params: Record<string, string> = {
        merchant_id: paymentData.merchant_id,
        return_url: `${window.location.origin}/success?order_id=${paymentData.order_id}`,
        cancel_url: `${window.location.origin}/`,
        notify_url: "https://your-app-domain.supabase.co/functions/v1/payhere-webhook", // Replace with actual live webhook url
        order_id: paymentData.order_id,
        items: cart.map(i => i.product.title).join(", "),
        currency: paymentData.currency,
        amount: paymentData.amount,
        hash: paymentData.hash,
        
        first_name: paymentData.customer.first_name,
        last_name: paymentData.customer.last_name,
        email: paymentData.customer.email,
        phone: paymentData.customer.phone,
        address: paymentData.customer.address,
        city: paymentData.customer.city,
        country: paymentData.customer.country
      };

      for (const [key, value] of Object.entries(params)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while connecting to the checkout gateway.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-white">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs text-silver/60 hover:text-white mb-6 transition-colors"
        id="back-to-cart-btn"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Bag
      </button>

      <form onSubmit={handlePayHereSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1 font-bold">
            Customer Name
          </label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors"
            id="checkout-name-input"
          />
        </div>

        <div>
          <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1 font-bold">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors"
            id="checkout-email-input"
          />
        </div>

        <div>
          <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1 font-bold">
            Phone Number
          </label>
          <input
            type="tel"
            required
            placeholder="+94 77 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors"
            id="checkout-phone-input"
          />
        </div>

        <div>
          <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1 font-bold">
            Delivery Address
          </label>
          <textarea
            required
            rows={3}
            placeholder="No. 45, Galle Road, Colombo 03, Sri Lanka"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
            id="checkout-address-input"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="apple-btn w-full justify-center text-sm py-3 mt-2"
            id="checkout-pay-btn"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#050505]" /> Securing Gateway Connection...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 text-[#050505]" /> Pay via PayHere (LKR)
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
