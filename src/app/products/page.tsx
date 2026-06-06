"use client";

import Navbar from "../../components/Navbar";
import ProductGrid from "../../components/ProductGrid";
import CartDrawer from "../../components/CartDrawer";
import Link from "next/link";

export default function ProductsCatalogPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] text-silver/40 uppercase tracking-widest font-semibold mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Catalog</span>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display mb-4">
              THE <span className="silver-gradient-text">SYSTEMS</span>
            </h1>
            <p className="text-silver/60 text-sm md:text-base max-w-lg font-light leading-relaxed">
              Curated precision gear, mechanical keyboards, custom audio setups, and desk modules built for elite workspaces.
            </p>
          </div>

          {/* Product list grid */}
          <ProductGrid />
        </div>
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
