import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Shield, Cpu, Layers } from "lucide-react";
import Navbar from "@/components/Navbar";
import VipDroplist from "@/components/droplist/VipDroplist";

export const metadata = {
  title: "Priority Access Droplist | AETHEX STORE",
  description: "Secure privileged early access to limited serialized hardware batches from the AETHEX design atelier.",
};

export default function DroplistPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-white selection:text-black">
      <Navbar />

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
            AETHEX CURATION REPOSITORY
          </span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 text-center max-w-3xl mx-auto pt-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.25em] uppercase bg-white/[0.03] border border-white/10 text-white/70">
            <Sparkles className="w-3 h-3 text-white" />
            LIMITED SERIALIZED HARDWARE DROPS
          </span>
          <h1 className="text-3xl sm:text-5xl font-light font-mono uppercase tracking-tight text-white">
            Exclusive Allotment Droplist
          </h1>
          <p className="text-xs sm:text-sm font-mono text-white/60 leading-relaxed max-w-xl mx-auto">
            AETHEX hardware runs in finite production cycles. We never mass-produce. Join the confidential droplist to secure priority allocation keys before public unveiling.
          </p>
        </div>

        {/* Main VIP Droplist Glassmorphism Component */}
        <VipDroplist />

        {/* Archive Roadmap */}
        <div className="space-y-6 pt-12 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-white/60">
              PRODUCTION ARCHIVE // SCHEDULE
            </span>
            <span className="text-[10px] font-mono text-white/40">
              COLOMBO WORKSHOP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-white/10 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-white/40">Archive 01</span>
                <span className="text-[10px] font-mono text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded">Allotment Closed</span>
              </div>
              <h3 className="text-base font-mono uppercase tracking-wide text-white">
                Zero-1 Monolith
              </h3>
              <p className="text-xs text-white/50 font-mono leading-relaxed">
                65% CNC anodized 6063 aerospace aluminum with tuned gasket isolation. 50 units deployed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111111] border border-white/20 space-y-4 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-white/60">Archive 02</span>
                <span className="text-[10px] font-mono text-white uppercase bg-white/20 px-2 py-0.5 rounded font-bold">Upcoming Drop</span>
              </div>
              <h3 className="text-base font-mono uppercase tracking-wide text-white">
                Cockpit Expansion
              </h3>
              <p className="text-xs text-white/70 font-mono leading-relaxed">
                Grade 5 titanium rotary encasing with high-torque detent bearings and wireless low-latency MCU.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-white/10 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-white/40">Archive 03</span>
                <span className="text-[10px] font-mono text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded">In Engineering</span>
              </div>
              <h3 className="text-base font-mono uppercase tracking-wide text-white">
                Cyberdesk Mat (Kevlar)
              </h3>
              <p className="text-xs text-white/50 font-mono leading-relaxed">
                Ballistic weave textile with micro-textured silicone base for high-precision optical tracking.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
