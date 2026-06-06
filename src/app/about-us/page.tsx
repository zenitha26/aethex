"use client";

import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import Link from "next/link";
import { Compass, Shield, Cpu, RotateCcw } from "lucide-react";

export default function AboutUsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] text-silver/40 uppercase tracking-widest font-semibold mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">About Us</span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display mb-4">
              THE <span className="silver-gradient-text">AETHEX</span> STORY
            </h1>
            <p className="text-silver/60 text-base md:text-lg max-w-2xl font-light leading-relaxed">
              We engineer state-of-the-art workspace components for individuals who refuse to compromise on design, acoustics, or precision.
            </p>
          </div>

          {/* Story Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 text-sm text-silver/70 font-light leading-relaxed">
              <p>
                Founded on the principles of modernist industrial design, AETHEX represents the intersection of luxury craftsmanship and computing peripherals. Every custom setup, keyboard plate, and sound-absorbing desk module we curate is calculated to deliver absolute aesthetic harmony.
              </p>
              <p>
                Our vision is simple: to create workspace objects that look, feel, and sound like precision-milled physical sculpture. By bridging international dropshipping supply chains with manual verification and dedicated customer service, we deliver elite products to your doorstep without high markup stress.
              </p>
            </div>

            {/* Core Values Card */}
            <div className="luxury-glass p-6 md:p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold font-display tracking-tight border-b border-white/5 pb-3">
                Core Pillars
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold">Technical Precision</h4>
                    <p className="text-silver/40 text-xs font-light mt-0.5">Optimized case materials, custom switch profiles, and zero-compromise stabilizers.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold">Minimal Design</h4>
                    <p className="text-silver/40 text-xs font-light mt-0.5">Apple-inspired aesthetics, subtle matte finishes, and clean geometric profiles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
