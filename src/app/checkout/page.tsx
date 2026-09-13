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
  Banknote,
  AlertCircle, 
  Check, 
  Loader2,
  X,
  User,
  ArrowRight,
  Lock
} from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { createClient } from "../../lib/supabase/client";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import AethexLogo from "@/components/brand/AethexLogo";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  const supabase = createClient();

  const [authChecking, setAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Colombo");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "cod">("bank_transfer");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Check Supabase session and pre-fill details
  useEffect(() => {
    async function checkAuthAndPrefill() {
      setAuthChecking(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
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
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Error checking checkout auth:", err);
      } finally {
        setAuthChecking(false);
      }
    }

    checkAuthAndPrefill();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    });

    return () => subscription.unsubscribe();
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

    // Strict authentication verification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast("Sign in is required to place an order. Please continue with Google.");
      return;
    }

    // Strict validation
    if (!fullName.trim()) {
      showToast("Please enter your full name for delivery.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      showToast("Please provide a valid phone or WhatsApp number.");
      return;
    }
    if (!address.trim()) {
      showToast("Please enter your delivery street address.");
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
      const lineItems = cart.map((item) => ({
        id: item.id,
        product_name: item.title,
        price: item.price,
        quantity: item.quantity,
        color: item.color || null,
        image: item.image || null,
      }));

      const isCod = paymentMethod === "cod";

      // Insert directly into Supabase orders table with authenticated user ID
      const { data: insertedOrder, error: insertError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: fullName.trim(),
          customer_email: user.email || email.trim() || null,
          customer_phone: phone.trim(),
          customer_address: address.trim(),
          city: city.trim(),
          postal_code: zip.trim() || null,
          subtotal: subtotal,
          total: subtotal,
          payment_method: paymentMethod,
          payment_status: isCod ? "pending_delivery" : "pending_payment",
          order_status: "processing",
          status: "processing",
          notes: notes.trim() || null,
          line_items: lineItems,
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message || "Failed to create order in database.");
      }

      const createdOrderId = insertedOrder.id;

      // Clear local cart
      clearCart();

      // Redirect to order status page
      router.push(`/account/orders/${createdOrderId}`);
    } catch (err: any) {
      console.error("Order processing error:", err);
      showToast(err?.message || "Failed to submit order. Please try again.");
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
              <span>Back to Store</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/40">
            <Lock className="w-3.5 h-3.5 text-white/60" />
            <span>Secure Checkout</span>
          </div>
        </div>

        {/* Global Toast Notification */}
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

        {/* Loading authentication check */}
        {authChecking ? (
          <div className="py-24 text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-white/50" />
            <p className="text-xs font-mono uppercase tracking-widest text-white/40">
              Verifying account status...
            </p>
          </div>
        ) : !currentUser ? (
          /* =========================================================================
             STRICT AUTHENTICATION GATE (NO GUEST CHECKOUT)
             ========================================================================= */
          <div className="max-w-xl mx-auto py-8">
            <div className="bg-[#0B0B0B] border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-2xl">
              
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Lock className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 block font-semibold">
                  ACCOUNT REQUIRED
                </span>
                <h1 className="text-2xl sm:text-4xl font-light uppercase tracking-tight text-white font-mono">
                  Sign In to Checkout
                </h1>
                <p className="text-white/60 text-xs sm:text-sm font-mono leading-relaxed max-w-md mx-auto">
                  Sign in with Google to continue to checkout and securely manage your orders. Your cart will be saved automatically.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <GoogleLoginButton
                  redirectTo="/checkout"
                  text="Continue with Google"
                  className="w-full justify-center !bg-white !text-black hover:!bg-white/90 py-3.5 text-xs sm:text-sm font-mono font-bold rounded-full shadow-lg"
                />

                <Link
                  href="/"
                  className="block text-center text-xs font-mono uppercase tracking-wider text-white/40 hover:text-white transition-colors pt-2"
                >
                  Return to Shopping
                </Link>
              </div>

              {/* Cart Preview summary under gate */}
              {cart.length > 0 && (
                <div className="pt-6 border-t border-white/5 text-left space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>Items in Cart: {cart.reduce((s, i) => s + i.quantity, 0)}</span>
                    <span className="text-white font-semibold">Rs. {subtotal.toLocaleString()} LKR</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-16 text-center max-w-lg mx-auto backdrop-blur-xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-mono uppercase text-white font-semibold">Your Cart is Empty</h3>
              <p className="text-white/50 text-xs leading-relaxed font-mono">
                Add products to your cart before proceeding to checkout.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block bg-white text-black hover:bg-white/90 px-8 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-lg"
            >
              Shop Accessories
            </Link>
          </div>
        ) : (
          /* =========================================================================
             AUTHENTICATED CHECKOUT FORM
             ========================================================================= */
          <div className="space-y-8">
            
            {/* Header Title with Authenticated User Indicator */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 block font-semibold">
                  FINAL STEP
                </span>
                <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-white font-mono">
                  Checkout
                </h1>
                <p className="text-white/60 text-xs sm:text-sm font-mono max-w-2xl leading-relaxed">
                  Enter your delivery details and choose your payment method below.
                </p>
              </div>

              {/* Signed-in identity badge */}
              <div className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 flex items-center gap-2.5 text-xs font-mono text-white/70">
                <User className="w-3.5 h-3.5 text-white/50 shrink-0" />
                <span className="truncate max-w-[200px]">{currentUser?.email}</span>
                <span className="text-emerald-400 text-[10px] uppercase font-bold">• Verified</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* LEFT: Customer Shipping Details & Payment Selector (7 Cols) */}
              <div className="lg:col-span-7 space-y-8">

                {/* 01. Delivery Details Card */}
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-white/70" />
                      <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-white">
                        01. Delivery Details
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                      Free Islandwide Delivery
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 transition-all text-xs sm:text-sm font-mono outline-none"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/60 block">
                        Phone / WhatsApp Number *
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
                        Email Address (For Order Updates)
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
                        Delivery Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="House or Apartment number, Street name, Area"
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
                        placeholder="e.g. Colombo, Kandy, Galle"
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
                        Delivery Instructions or Vehicle Model (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Please call before delivery. Car model: Honda Vezel."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 transition-all text-xs sm:text-sm outline-none resize-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 02. Payment Method */}
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                    <Landmark className="w-4 h-4 text-white/70" />
                    <h2 className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-white">
                      02. Payment Method
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Bank Transfer Option */}
                    <div
                      onClick={() => setPaymentMethod("bank_transfer")}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        paymentMethod === "bank_transfer"
                          ? "bg-white/10 border-white text-white"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20 text-white/70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider">
                          <Landmark className="w-4 h-4 text-white" />
                          <span>Bank Transfer</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === "bank_transfer" ? "border-white bg-white" : "border-white/30"
                        }`}>
                          {paymentMethod === "bank_transfer" && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed font-light">
                        Direct bank deposit or online transfer. You can upload your payment slip after placing the order.
                      </p>
                    </div>

                    {/* Cash on Delivery Option */}
                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        paymentMethod === "cod"
                          ? "bg-white/10 border-white text-white"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20 text-white/70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider">
                          <Banknote className="w-4 h-4 text-white" />
                          <span>Cash on Delivery</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === "cod" ? "border-white bg-white" : "border-white/30"
                        }`}>
                          {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed font-light">
                        Pay in cash directly to the courier when your order arrives at your address.
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              {/* RIGHT: Order Summary (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-white/70 block pb-3 border-b border-white/5">
                    Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
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
                              Qty: {item.quantity} {item.color ? `• ${item.color}` : ""}
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
                      <span>Delivery</span>
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-white/10">
                      <span>Total</span>
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
                        <span>Placing Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order</span>
                        <ArrowRight className="w-3.5 h-3.5 text-black" />
                      </>
                    )}
                  </button>

                  {/* Trust Guarantee */}
                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/40 pt-2 text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-white/60 shrink-0" />
                    <span>Islandwide Delivery • 7-Day Replacement Guarantee</span>
                  </div>
                </div>

              </div>

              {/* Mobile Sticky Bottom Floating Action for Checkout */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 p-4 flex items-center justify-between gap-4 shadow-2xl">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Total</span>
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
          </div>
        )}

      </div>
    </main>
  );
}
