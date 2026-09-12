"use client";

import Navbar from "../../components/Navbar";
import KeyboardBuilder from "../../components/KeyboardBuilder";
import CartDrawer from "../../components/CartDrawer";
import Link from "next/link";

import Footer from "../../components/Footer";

export default function CustomLabPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-[#111111] pt-24 pb-12 relative overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-8 mb-4">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <span className="text-black">Custom Lab</span>
          </div>
        </div>

        <KeyboardBuilder />
      </main>

      <CartDrawer />
      <Footer />
    </>
  );
}
