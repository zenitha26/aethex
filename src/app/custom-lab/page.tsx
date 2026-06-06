"use client";

import Navbar from "../../components/Navbar";
import KeyboardBuilder from "../../components/KeyboardBuilder";
import CartDrawer from "../../components/CartDrawer";
import Link from "next/link";

export default function CustomLabPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white pt-24 pb-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-2 text-[10px] text-silver/40 uppercase tracking-widest font-semibold mt-8 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Custom Lab</span>
          </div>
        </div>

        <KeyboardBuilder />
      </main>

      <CartDrawer />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white text-lg font-bold tracking-widest font-display">
            AETHEX<span className="text-white/40">STORE</span>
          </div>
          <p className="text-silver/40 text-xs font-light">
            &copy; {new Date().getFullYear()} AETHEX Store. All rights reserved. Handcrafted dropshipping platform.
          </p>
          <div className="flex gap-6 text-xs text-silver/40">
            <Link href="/policies" className="hover:text-white transition-colors">Policies</Link>
            <Link href="/about-us" className="hover:text-white transition-colors">About Us</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
