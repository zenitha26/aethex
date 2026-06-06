"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import CartSummary from "../../components/CartSummary";
import WhatsAppCheckoutButton from "../../components/WhatsAppCheckoutButton";

export default function CheckoutPage() {
  const { cart } = useCartStore();

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"whatsapp" | "payhere">("whatsapp");
  const [payhereLoading, setPayhereLoading] = useState(false);
  const [payhereError, setPayhereError] = useState<string | null>(null);

  const isFormValid = name.trim() !== "" && phone.trim() !== "" && address.trim() !== "" && (paymentMethod === "whatsapp" || email.trim() !== "");

  const handlePayHereCheckout = async () => {
    if (!isFormValid) return;
    setPayhereLoading(true);
    setPayhereError(null);

    try {
      // 🔐 Server-side order verification and database entry
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({
          cart: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          customer: { name, phone, address }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order creation failed on backend.");
      }

      // Simulate routing to PayHere Sandbox checkout page with the verified database parameters
      const payhereUrl = "https://sandbox.payhere.lk/pay/checkout";
      const form = document.createElement("form");
      form.method = "POST";
      form.action = payhereUrl;

      // Mock PayHere sandbox payloads
      const params: Record<string, string> = {
        merchant_id: "1211149", // Sandbox Merchant ID
        return_url: `${window.location.origin}/success?order_id=${data.orderId}`,
        cancel_url: `${window.location.origin}/checkout`,
        notify_url: "https://aethex.store/api/payhere-webhook",
        order_id: data.orderId,
        items: cart.map(i => i.product.title).join(", "),
        currency: "LKR",
        amount: data.total.toString(),
        first_name: name.split(" ")[0],
        last_name: name.split(" ")[1] || "Customer",
        email: email || "customer@aethex.store",
        phone: phone,
        address: address,
        city: "Colombo",
        country: "Sri Lanka"
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
      setPayhereError(err.message || "Could not connect to payment gateway.");
      setPayhereLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden py-16 px-4 md:px-8">
      {/* Background blobs */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-silver/60 hover:text-white transition-colors uppercase tracking-widest font-semibold"
            id="checkout-back-link"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
          <span className="text-sm font-bold tracking-widest font-display text-white">
            AETHEX<span className="text-white/40">STORE</span>
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8 font-display">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Customer Details Form */}
            <div className="lg:col-span-7 luxury-glass rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold font-display tracking-tight mb-1">
                  Customer Details
                </h2>
                <p className="text-silver/50 text-xs font-light">
                  Provide your delivery information and select your preferred checkout method.
                </p>
              </div>

              {payhereError && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-400">
                  {payhereError}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors"
                      id="checkout-name-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                      WhatsApp Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+94 77 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors"
                      id="checkout-phone-input"
                    />
                  </div>
                </div>

                {paymentMethod === "payhere" && (
                  <div>
                    <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                      Email Address (Required for PayHere)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors"
                      id="checkout-email-input"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                    Delivery Address
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="No. 45, Galle Road, Colombo 03, Sri Lanka"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                    id="checkout-address-input"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                    Order Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Custom keycaps request, switches preferences, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors"
                    id="checkout-notes-input"
                  />
                </div>

                {/* Checkout Methods Selector */}
                <div className="pt-4 border-t border-white/5">
                  <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-3 font-bold">
                    Select Checkout Route
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("whatsapp")}
                      className={`p-4 rounded-xl border text-center transition-all duration-300 text-xs font-semibold uppercase tracking-wider ${
                        paymentMethod === "whatsapp"
                          ? "bg-white text-black border-white font-bold"
                          : "bg-white/5 text-silver/60 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      WhatsApp (COD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("payhere")}
                      className={`p-4 rounded-xl border text-center transition-all duration-300 text-xs font-semibold uppercase tracking-wider ${
                        paymentMethod === "payhere"
                          ? "bg-white text-black border-white font-bold"
                          : "bg-white/5 text-silver/60 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      PayHere Gateway
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="luxury-glass rounded-3xl p-6 md:p-8 space-y-6">
                <CartSummary />

                {paymentMethod === "whatsapp" ? (
                  <WhatsAppCheckoutButton
                    customerName={name}
                    customerPhone={phone}
                    customerAddress={address}
                    customerNotes={notes}
                    disabled={!isFormValid}
                  />
                ) : (
                  <button
                    onClick={handlePayHereCheckout}
                    disabled={!isFormValid || payhereLoading}
                    className={`w-full py-4 rounded-full font-bold text-sm transition-all duration-300 ${
                      !isFormValid || payhereLoading
                        ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                        : "bg-white text-black hover:bg-white/90 shadow-lg active:scale-95"
                    }`}
                  >
                    {payhereLoading ? "Connecting to PayHere..." : "Initiate PayHere Payment"}
                  </button>
                )}

                <p className="text-[10px] text-silver/40 text-center leading-relaxed flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-white/30" /> Secure dropshipping gateway. Prices verified on AETHEX backend.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
