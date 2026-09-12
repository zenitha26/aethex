"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/useCartStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { audioEngine } from "../../lib/audio";

const USD_TO_LKR = 300;

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  const [useLKR, setUseLKR] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formatPrice = (usdAmt: number) => {
    if (useLKR) {
      return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(usdAmt * USD_TO_LKR);
    }
    return `$ ${usdAmt} USD`;
  };

  const handleAcquire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !address || !city || !zip) return;

    audioEngine.playAcquire();
    const randomOrderId = "AETHEX-" + Math.floor(100000 + Math.random() * 900000);
    
    // Simulate short delay for premium feel
    setTimeout(() => {
      clearCart();
      router.push(`/success?order_id=${randomOrderId}`);
    }, 800);
  };

  const playHover = () => audioEngine.playClick();
  const playSelect = () => audioEngine.playSelect();

  return (
    <main className="min-h-screen bg-white text-[#111111] py-20 px-8 lg:px-16 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-16 border-b border-gray-200 pb-6">
          <Link
            href="/"
            onClick={playSelect}
            onMouseEnter={playHover}
            className="text-[10px] text-gray-500 hover:text-black transition-colors uppercase tracking-[0.25em] font-mono font-semibold"
          >
            ← Back to Store
          </Link>
          <span className="text-base font-light tracking-[0.3em] text-[#111111] font-bold">
            AETHEX
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-light tracking-[0.12em] uppercase mb-12 leading-none text-[#111111]">
          SECURE CHECKOUT
        </h1>

        {cart.length === 0 ? (
          <div className="border border-gray-200 p-16 text-center max-w-md mx-auto bg-[#F9F9F9] shadow-sm">
            <p className="text-gray-600 text-xs font-light uppercase tracking-wider mb-8 font-semibold">
              Your active catalog selection is empty.
            </p>
            <Link 
              href="/products" 
              onClick={playSelect}
              onMouseEnter={playHover}
              className="inline-block bg-black text-white px-8 py-3.5 text-xs font-mono font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-sm"
            >
              BROWSE PRODUCTS
            </Link>
          </div>
        ) : (
          <form onSubmit={handleAcquire} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative">
            
            {/* Left: Summary Panel */}
            <div className="lg:col-span-6 p-8 md:p-10 bg-[#F9F9F9] border border-gray-200 relative z-10 space-y-8 shadow-sm">
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold font-mono block mb-4">
                01 / ORDER SUMMARY
              </span>

              {/* Loop through cart items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-white border border-gray-200 relative flex items-center justify-center p-2 shadow-xs">
                        {item.image && (
                          <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-[#111111] text-sm font-semibold uppercase tracking-wider">{item.title}</h4>
                        <p className="text-gray-500 text-[10px] mt-1 font-mono">{item.color || "AVAILABLE"}</p>
                        <p className="text-gray-500 text-[10px] mt-0.5 font-mono">QTY: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-[#111111] font-mono text-xs font-bold tracking-wider">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="pt-4 space-y-4">
                <div className="flex justify-between items-end border-t border-gray-200 pt-4">
                  <span className="text-gray-600 uppercase tracking-widest text-[10px] font-bold">TOTAL AMOUNT</span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[#111111] font-mono text-xl font-bold tracking-widest">{formatPrice(subtotal)}</span>
                    
                    {/* Currency selector toggle */}
                    <div className="flex items-center gap-2 text-[9px] font-mono tracking-widest text-gray-500 uppercase mt-1">
                      <button 
                        type="button"
                        onClick={() => { playSelect(); startTransition(() => setUseLKR(false)); }}
                        className={`hover:text-black transition-colors ${!useLKR ? "text-black font-bold" : ""}`}
                      >
                        USD
                      </button>
                      <span>|</span>
                      <button 
                        type="button"
                        onClick={() => { playSelect(); startTransition(() => setUseLKR(true)); }}
                        className={`hover:text-black transition-colors ${useLKR ? "text-black font-bold" : ""}`}
                      >
                        LKR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Checkout Inputs */}
            <div className="lg:col-span-6 p-8 md:p-10 bg-white border border-gray-200 relative z-10 space-y-8 shadow-sm">
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold font-mono block">
                02 / DELIVERY & PAYMENT
              </span>

              {/* Email Section */}
              <div className="space-y-2">
                <label className="text-[9px] font-mono tracking-widest text-gray-600 uppercase block font-semibold">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-300 p-3 text-xs font-mono tracking-wider outline-none focus:border-black transition-colors text-[#111111]"
                />
              </div>

              {/* Shipping Section */}
              <div className="space-y-4">
                <span className="text-[9px] font-mono tracking-widest text-gray-600 uppercase block font-semibold">
                  SHIPPING ADDRESS
                </span>
                
                <input
                  type="text"
                  required
                  placeholder="Street Address, Apartment or Suite"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-gray-300 p-3 text-xs font-mono tracking-wider outline-none focus:border-black transition-colors text-[#111111]"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-gray-300 p-3 text-xs font-mono tracking-wider outline-none focus:border-black transition-colors text-[#111111]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Postal Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full bg-white border border-gray-300 p-3 text-xs font-mono tracking-wider outline-none focus:border-black transition-colors text-[#111111]"
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-4">
                <span className="text-[9px] font-mono tracking-widest text-gray-600 uppercase block font-semibold">
                  PAYMENT CARD OR COD
                </span>

                <input
                  type="text"
                  required
                  placeholder="Card Number (or type COD for Cash on Delivery)"
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                  className="w-full bg-white border border-gray-300 p-3 text-xs font-mono tracking-wider outline-none focus:border-black transition-colors text-[#111111]"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-white border border-gray-300 p-3 text-xs font-mono tracking-wider outline-none focus:border-black transition-colors text-[#111111]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full bg-white border border-gray-300 p-3 text-xs font-mono tracking-wider outline-none focus:border-black transition-colors text-[#111111]"
                  />
                </div>
              </div>

              {/* Complete Action */}
              <div className="pt-4">
                <button
                  type="submit"
                  onMouseEnter={playHover}
                  className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-4 px-8 text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center cursor-pointer shadow-sm"
                >
                  COMPLETE ORDER (COD / CARD)
                </button>
              </div>

            </div>

          </form>
        )}
      </div>
    </main>
  );
}
