"use client";

import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import KeyboardBuilder from "../components/KeyboardBuilder";
import CartDrawer from "../components/CartDrawer";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, MessageSquare, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Background blobs */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-40 pb-24 overflow-hidden" id="home">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-left relative z-10">
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-extrabold border border-white/5 bg-white/[0.02] px-3.5 py-1 rounded-full self-start">
              Premium Dropshipping Platform
            </span>
            <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              AETHEX <br />
              <span className="silver-gradient-text">SYSTEMS</span>
            </h1>
            <p className="text-silver/60 text-base md:text-lg max-w-lg font-light leading-relaxed">
              Apple-inspired custom mechanical setups, high-precision peripherals, and acoustic workspace modules. Engineered to perfection.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link
                href="/products"
                className="apple-btn text-xs py-3.5 px-6 font-semibold"
                id="hero-explore-btn"
              >
                Explore Catalog <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/custom-lab"
                className="apple-btn-outline text-xs py-3.5 px-6 font-medium"
              >
                Enter Custom Lab
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            {/* Visual Vector element representing the master piece */}
            <div className="w-full max-w-md aspect-square rounded-3xl bg-white/[0.01] border border-white/5 p-8 flex items-center justify-center relative luxury-glass">
              <div className="absolute inset-0 bg-radial-gradient from-white/[0.03] to-transparent rounded-3xl pointer-events-none" />
              
              <svg width="220" height="220" viewBox="0 0 240 240" fill="none" className="z-10 opacity-70">
                <circle cx="120" cy="120" r="90" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                <circle cx="120" cy="120" r="70" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="5 5" />
                
                {/* Vector representing metal hardware custom dial */}
                <circle cx="120" cy="120" r="45" fill="#121212" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <path d="M120 75 L120 95" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <circle cx="120" cy="120" r="6" fill="#ffffff" />
                
                {/* Ambient dots */}
                <circle cx="60" cy="80" r="3" fill="#ffffff" />
                <circle cx="180" cy="160" r="2" fill="rgba(255,255,255,0.5)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Badges section */}
      <section className="py-12 border-t border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-white">
              <Truck className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Free Islandwide Shipping</h4>
              <p className="text-silver/40 text-xs">100% Free Shipping to any location in Sri Lanka</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-white">
              <ShieldCheck className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">The AETHEX Guarantee</h4>
              <p className="text-silver/40 text-xs">Full replacement support without returning items</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-white">
              <RotateCcw className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Verified Fulfillment</h4>
              <p className="text-silver/40 text-xs">Supplier dispatch queue verified on backend API</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Collection */}
      <section className="max-w-7xl mx-auto px-6 py-12" id="products-catalog-section">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <span className="text-[10px] text-silver/40 uppercase tracking-widest font-bold">Featured Catalog</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white mt-1">CURATED SYSTEMS</h2>
          </div>
          <Link href="/products" className="text-xs text-silver/60 hover:text-white transition-colors flex items-center gap-1.5 font-semibold uppercase tracking-wider">
            All Products <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ProductGrid />
      </section>

      {/* Categories Preview Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="mb-12">
          <span className="text-[10px] text-silver/40 uppercase tracking-widest font-bold">Workspace Divisions</span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mt-1">EXPLORE CATEGORIES</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="luxury-glass p-8 rounded-3xl relative overflow-hidden group min-h-[260px] flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div>
              <span className="text-[9px] text-white/30 border border-white/10 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">Division 01</span>
              <h3 className="text-white text-2xl font-bold font-display mt-3">MECHANICAL LAB</h3>
              <p className="text-silver/50 text-xs mt-2 max-w-xs font-light">Custom configured switches, double-shot keycaps, and heavy anodized frames.</p>
            </div>
            <Link href="/products" className="mt-8 text-xs text-white group-hover:underline flex items-center gap-1.5 font-semibold">
              Explore Products <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="luxury-glass p-8 rounded-3xl relative overflow-hidden group min-h-[260px] flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div>
              <span className="text-[9px] text-white/30 border border-white/10 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">Division 02</span>
              <h3 className="text-white text-2xl font-bold font-display mt-3">CUSTOM LAB</h3>
              <p className="text-silver/50 text-xs mt-2 max-w-xs font-light">Assembles and visualizes your centerpiece setups in real-time.</p>
            </div>
            <Link href="/custom-lab" className="mt-8 text-xs text-white group-hover:underline flex items-center gap-1.5 font-semibold">
              Launch Custom Lab <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="luxury-glass p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-white/[0.01] to-transparent">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-white text-2xl md:text-3xl font-bold font-display">Bespoke Consultations</h2>
            <p className="text-silver/50 text-xs md:text-sm font-light max-w-md">
              Need assistance designing your desk acoustics or selecting hardware switches? Talk directly to our design curators on WhatsApp.
            </p>
          </div>
          <a
            href="https://wa.me/94771234567?text=Hello%20AETHEX%20Store%20%F0%9F%91%8B%20I%20would%20like%20to%20get%20a%20bespoke%20setup%20consultation."
            target="_blank"
            className="flex items-center gap-2.5 px-6 py-4 bg-white text-black hover:bg-[#e5e5ea] rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 flex-shrink-0"
          >
            <MessageSquare className="h-4 w-4" /> Consult on WhatsApp
          </a>
        </div>
      </section>

      {/* Cart Drawer */}
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
