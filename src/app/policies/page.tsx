"use client";

import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import Link from "next/link";
import { Truck, RotateCcw, Scale, ShieldCheck } from "lucide-react";

export default function PoliciesPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] text-silver/40 uppercase tracking-widest font-semibold mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Policies</span>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display mb-4">
              STORE <span className="silver-gradient-text">POLICIES</span>
            </h1>
            <p className="text-silver/60 text-sm md:text-base max-w-lg font-light leading-relaxed">
              Read our international shipping details, return procedures, and legal terms of service.
            </p>
          </div>

          {/* Shipping Policy */}
          <section className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Truck className="h-5 w-5 text-white/85" />
              <h2 className="text-lg md:text-xl font-bold font-display tracking-tight text-white">
                Shipping Policy
              </h2>
            </div>
            <div className="space-y-4 text-sm font-light text-silver/70 leading-relaxed">
              <div>
                <h3 className="text-white text-sm font-semibold mb-1">Complimentary Islandwide Shipping</h3>
                <p>At AETHEX, we believe in delivering a seamless premium experience. That is why we offer 100% Free Shipping to any location within Sri Lanka.</p>
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold mb-1">Delivery Timeframe</h3>
                <p>To ensure you receive the highest quality products at the best possible value, our curated items are dispatched directly from our international partner warehouses. Please allow 12 to 15 business days for your order to arrive securely at your doorstep.</p>
                <p className="mt-2 text-xs text-silver/40 italic">Once your order is processed, you will be notified, and we guarantee the premium quality is well worth the wait.</p>
              </div>
            </div>
          </section>

          {/* Refund & Replacement Policy */}
          <section className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <RotateCcw className="h-5 w-5 text-white/85" />
              <h2 className="text-lg md:text-xl font-bold font-display tracking-tight text-white">
                Refund & Replacement Policy
              </h2>
            </div>
            <div className="space-y-4 text-sm font-light text-silver/70 leading-relaxed">
              <div>
                <h3 className="text-white text-sm font-semibold mb-1">The AETHEX Guarantee (No Returns Needed)</h3>
                <p>We stand behind the quality of our products. If something goes wrong, we make it right—without the hassle of returning the item to the post office.</p>
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold mb-1">Damages and Issues</h3>
                <ul className="list-disc list-inside space-y-1.5 mt-2">
                  <li><strong className="text-white">Unboxing Video:</strong> Customers must record a clear continuous unboxing video when opening packages for protection.</li>
                  <li><strong className="text-white">Reporting Issue:</strong> Customers must contact us via WhatsApp within 48 hours of delivery and provide unboxing video proof.</li>
                  <li><strong className="text-white">Resolution:</strong> Once verified, we will issue a Full Refund to the customer's bank account OR dispatch a Free Replacement to their address.</li>
                  <li><strong className="text-white">No Return Required:</strong> Customers do NOT need to return damaged items.</li>
                </ul>
              </div>
              <p className="text-xs text-silver/40 pt-2 border-t border-white/5">Note: This policy covers only manufacturing defects and shipping damages. It does NOT cover accidental damage, misuse, or normal wear and tear.</p>
            </div>
          </section>

          {/* Terms of Service & Privacy Policy */}
          <section className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Scale className="h-5 w-5 text-white/85" />
              <h2 className="text-lg md:text-xl font-bold font-display tracking-tight text-white">
                Terms of Service & Privacy Policy
              </h2>
            </div>
            <div className="space-y-4 text-sm font-light text-silver/70 leading-relaxed">
              <p>
                By placing an order via our WhatsApp or PayHere channels, you consent to our data collection practices necessary to process and dispatch shipments. We securely process details for logistics fulfillment under compliance standards.
              </p>
              <p>
                <strong>WhatsApp Consent:</strong> You consent to receive transactional notifications, order statuses, and support answers directly on the phone number associated with your order.
              </p>
              <p>
                <strong>Compliance:</strong> All operations comply with current Sri Lankan eCommerce legislation. Price updates, dropshipping logs, and digital transactions are verified server-side to prevent malicious manipulation.
              </p>
            </div>
          </section>
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
