"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Landmark, 
  AlertCircle, 
  Check, 
  Loader2,
  X,
  User,
  Zap,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { audioEngine } from "../../lib/audio";
import { createClient } from "../../lib/supabase/client";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import AethexLogo from "@/components/brand/AethexLogo";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [checkoutMode, setCheckoutMode] = useState<"guest" | "member">("guest");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Colombo");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Pre-fill user details if signed in
  useEffect(() => {
    async function checkAuthAndPrefill() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
          setCheckoutMode("member");
          if (user.email) setEmail(user.email);
          if (user.phone) setPhone(user.phone);
          if (user.user_metadata?.full_name) setFullName(user.user_metadata.full_name);

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (profile) {
            if (profile.full_name && !fullName) setFullName(profile.full_name);
            if (profile.phone && !phone) setPhone(profile.phone);
            if (profile.address && !address) setAddress(profile.address);
          }
        } else {
          setCheckoutMode("guest");
        }
      } catch (err) {
        console.error("Error prefilling checkout user:", err);
      }
    }

    checkAuthAndPrefill();
  }, [supabase]);

  const showToast = (text: string, type: "error" | "success" = "error") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Strict client validation
    if (!fullName.trim()) {
      showToast("Please enter your full name for courier delivery.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      showToast("Please provide a valid phone or WhatsApp number.");
      return;
    }
    if (!address.trim()) {
      showToast("Please enter your street delivery address.");
      return;
    }
    if (!city.trim()) {
      showToast("Please specify your delivery city or district.");
      return;
    }
    if (cart.length === 0) {
      showToast("Your cart is empty. Add products before checking out.");
      return;
    }

    setLoading(true);
    try {
      audioEngine.playAcquire();
    } catch {}

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Formulate order payload
      const lineItems = cart.map((item) => ({
        id: item.id,
        product_name: item.title,
        price: item.price,
        quantity: item.quantity,
        color: item.color || null,
        image: item.image || null,
      }));

      // Generate a fallback UUID if offline/mock
      const localId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `order-${Date.now()}`;
      let createdOrderId = localId;

      // Insert into Supabase `orders` table (Guest user_id is null)
      const { data: insertedOrder, error: insertError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          customer_name: fullName.trim(),
          customer_email: email.trim() || null,
          customer_phone: phone.trim(),
          customer_address: address.trim(),
          city: city.trim(),
          postal_code: zip.trim() || null,
          subtotal: subtotal,
          total: subtotal,
          payment_method: "bank_transfer",
          payment_status: "pending_payment",
          order_status: "pending_payment",
          status: "pending_payment",
          notes: notes.trim() || null,
          line_items: lineItems,
        })
        .select()
        .maybeSingle();

      if (insertError) {
        console.warn("Supabase orders insert warning (falling back to cached order store):", insertError);
        const fallbackOrder = {
          id: createdOrderId,
          user_id: user?.id || null,
          customer_name: fullName.trim(),
          customer_email: email.trim() || null,
          customer_phone: phone.trim(),
          customer_address: address.trim(),
          city: city.trim(),
          postal_code: zip.trim() || null,
          subtotal: subtotal,
          total: subtotal,
          payment_method: "bank_transfer",
          payment_status: "pending_payment",
          order_status: "pending_payment",
          status: "pending_payment",
          notes: notes.trim() || null,
          line_items: lineItems,
          created_at: new Date().toISOString(),
        };

        try {
          const existingLocal = JSON.parse(localStorage.getItem("aethex_local_orders") || "[]");
          existingLocal.unshift(fallbackOrder);
          localStorage.setItem("aethex_local_orders", JSON.stringify(existingLocal));
        } catch {}
      } else if (insertedOrder?.id) {
        createdOrderId = insertedOrder.id;
      }

      // Clear local cart
      clearCart();

      // Immediately redirect to the specific order page to upload the bank transfer slip
      router.push(`/account/orders/${createdOrderId}`);
    } catch (err: any) {
      console.error("Order processing error:", err);
      showToast(err?.message || "Failed to submit order. Please check connection.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-32 px-4 sm:px-6 lg:px-12 font-sans selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-6">
            <AethexLogo size="sm" showWordmark={true} isLink={true} />
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Catalog</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/40">
            <span>RAPID DISPATCH MANIFEST</span>
          </div>
        </div>

        {/* Global Glassmorphic Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-3">
            <div
              className={`p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-start gap-3 ${
                toastMessage.type === "error"
                  ? "bg-red-950/80 border-red-500/30 text-red-200"
                  : "bg-emerald-950/80 border-emerald-500/30 text-emerald-200"
              }`}
            >
              {toastMessage.type === "error" ? (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs font-mono leading-relaxed">
                {toastMessage.text}
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-white/40 hover:text-white p-0.5 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header Title with Guest Checkout Pill */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 block font-semibold">
                ONE-PAGE EXPEDITION
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-white/10 text-white border border-white/10 flex items-center gap-1">
                <Zap className="w-3 h-3 text-white" />
                Zero Friction Checkout
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-white font-mono">
              Frictionless Checkout
            </h1>
            <p className="text-white/60 text-xs sm:text-sm font-mono max-w-2xl leading-relaxed">
              Complete your acquisition in seconds. No mandatory account passwords required.
            </p>
          </div>

          {/* Guest vs Member Mode Badge */}
          <div className="p-1 rounded-full bg-white/[0.03] border border-white/10 flex items-center text-xs font-mono">
            <button
              type="button"
              onClick={() => setCheckoutMode("guest")}
              className={`px-4 py-1.5 rounded-full uppercase tracking-wider transition ${
                checkoutMode === "guest"
                  ? "bg-white text-black font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Guest Checkout
            </button>
            <button
              type="button"
              onClick={() => setCheckoutMode("member")}
              className={`px-4 py-1.5 rounded-full uppercase tracking-wider transition ${
                checkoutMode === "member"
                  ? "bg-white text-black font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Member Account
            </button>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-16 text-center max-w-lg mx-auto backdrop-blur-xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-mono uppercase text-white font-semibold">Your Bag is Empty</h3>
              <p className="text-white/50 text-xs leading-relaxed font-mono">
                Select precision hardware components before proceeding to checkout.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block bg-white text-black hover:bg-white/90 px-8 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-lg"
            >
              Explore Catalog
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT: Customer Shipping Details & Payment Selector (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Optional Quick Google Member Sign-in Card */}
              {checkoutMode === "member" && !currentUser && (
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                        Synchronize Member Profile
                      </h4>
                      <p className="text-[10px] font-mono text-white/50">
                        Sign in to automatically restore your saved shipping telemetry.
                      </p>
                    </div>
                  </div>
                  <GoogleLoginButton
                    className="w-full justify-center !bg-white !text-black hover:!bg-white/90 py-3 text-xs font-mono font-bold rounded-full"
                    text="Fast Sign In with Google"
                  />
                </div>
              )}

              {/* 01. Shipping Destination Card */}
              <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-white/70" />
                    <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-white">
                      01. Delivery Telemetry
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                    Complimentary Express
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun Fernando"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 transition-all text-xs sm:text-sm font-mono outline-none"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                      WhatsApp Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 077 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 transition-all text-xs sm:text-sm outline-none font-mono"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                      Email Address (Instant Receipt)
                    </label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 transition-all text-xs sm:text-sm font-mono outline-none"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                      Destination Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="House/Apt No, Street Name, Town / Landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 transition-all text-xs sm:text-sm font-mono outline-none"
                    />
                  </div>

                  {/* City / District */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Colombo 03, Kandy, Galle"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 transition-all text-xs sm:text-sm font-mono outline-none"
                    />
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 00300"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 transition-all text-xs sm:text-sm outline-none font-mono"
                    />
                  </div>

                  {/* Delivery Notes */}
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                      Special Handling / Vehicle Model (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Leave package with reception. Compatible with Honda Vezel."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 transition-all text-xs sm:text-sm outline-none resize-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 02. Payment Gateway: Manual Bank Transfer */}
              <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                  <Landmark className="w-4 h-4 text-white/70" />
                  <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-white">
                    02. Payment Settlement: Direct Bank Transfer
                  </h2>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Official Settlement:</span>
                    <span className="text-white font-bold uppercase tracking-wider">Direct Bank Transfer</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-light">
                    Zero credit card surcharges. After submitting your order, you will immediately be provided with our direct bank account details and official reference to upload your payment transfer slip.
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT: Order Summary (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28">
                <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-white/70 block pb-3 border-b border-white/5">
                  Order Manifest ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
                </span>

                {/* Items List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 relative shrink-0 overflow-hidden">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover p-1" />
                          ) : (
                            <div className="w-full h-full bg-white/5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-mono font-semibold text-white truncate">{item.title}</h4>
                          <p className="text-[10px] font-mono text-white/50">
                            QTY: {item.quantity} {item.color ? `• ${item.color}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-white shrink-0">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-white/5 font-mono text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Express Dispatch</span>
                    <span className="text-emerald-400 font-semibold">FREE COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-white/10">
                    <span>Total Amount</span>
                    <span className="text-xl text-white font-mono">Rs. {subtotal.toLocaleString()} LKR</span>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black hover:bg-white/90 py-4 px-6 rounded-full text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Transmitting Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Order & Upload Slip</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </>
                  )}
                </button>

                {/* Trust Guarantee */}
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/40 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-white/60" />
                  <span>24H EXPRESS DISPATCH • 7-DAY REPLACEMENT GUARANTEE</span>
                </div>
              </div>

            </div>

            {/* Mobile Sticky Bottom Floating Action for Checkout */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-t border-white/10 p-4 flex items-center justify-between gap-4 shadow-2xl">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-white/40 uppercase">Total Payable</span>
                <span className="text-sm font-mono font-bold text-white">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <>
                    <span>Place Order</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </main>
  );
}
