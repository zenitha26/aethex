"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sliders, Truck, Compass, MessageSquare } from "lucide-react";
import { BentoGrid } from "./BentoGrid";
import { SITE_CONTACT } from "@/constants";

export default function HomeSystemBento() {
  return (
    <section className="py-24 px-6 sm:px-10 lg:px-12 bg-[#050505] border-b border-white/10 font-sans text-white">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase block font-semibold">
              ENGINEERING & FIT
            </span>
            <h2 className="text-3xl sm:text-5xl font-mono uppercase text-white font-light tracking-tight">
              The Aethex Standard
            </h2>
          </div>
          <p className="text-white/60 text-xs sm:text-sm font-light max-w-md leading-relaxed font-sans">
            Practical car accessories designed to keep your windshield clear, stay secure on bumpy roads, and fit your car.
          </p>
        </div>

        {/* The Bento Composition */}
        <BentoGrid>
          
          {/* 1. LARGE FEATURE BLOCK (ASPOR A711) — 8 Cols */}
          <div className="col-span-1 md:col-span-2 lg:col-span-8 bg-[#0B0B0B] border border-white/10 hover:border-white/25 p-8 sm:p-12 relative flex flex-col justify-between overflow-hidden group shadow-2xl">
            <div className="space-y-4 max-w-lg z-10">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 font-semibold">
                  01 // FEATURED PRODUCT
                </span>
                <span className="bg-white text-black text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
                  FITS 65–95MM
                </span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-mono font-light uppercase tracking-tight text-white leading-tight">
                ASPOR A711<br />
                <span className="text-white/40">360° CONSOLE MOUNT</span>
              </h3>

              <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                Adjustable dual-axis mount designed for your center console cup holder. 180° arm elevation brings phone navigation to comfortable eye level without blocking your windshield view.
              </p>

              <div className="pt-4">
                <Link
                  href="/products/aspor-a711"
                  className="inline-flex items-center gap-3 bg-white text-black hover:bg-white/90 px-8 py-4 text-xs font-mono font-bold tracking-[0.18em] uppercase transition-colors shadow-xl"
                >
                  <span>VIEW A711 MOUNT</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Link>
              </div>
            </div>

            {/* Hardware Illustration Background */}
            <div className="absolute right-0 bottom-0 top-0 w-full lg:w-1/2 opacity-40 lg:opacity-85 pointer-events-none transition-transform duration-700 group-hover:scale-105">
              <Image
                src="/images/a711/studio_hardware.jpg"
                alt="ASPOR A711 Hardware Mechanism"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-contain object-right-bottom p-4"
              />
            </div>
          </div>

          {/* 2. MECHANICAL TENSION BLOCK — 4 Cols */}
          <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-[#0B0B0B] border border-white/10 hover:border-white/25 p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="w-10 h-10 border border-white/15 flex items-center justify-center text-white">
                <Sliders className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 block font-semibold">
                02 // SECURE FIT
              </span>
              <h4 className="text-xl font-mono uppercase text-white font-medium">
                No Suction Cups. No Glue.
              </h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Windshield suction mounts fall off in tropical heat. AC vent clips can damage brittle air vents. AETHEX cup mounts lock in place with mechanical expansion and soft silicone grips.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>EXPANSION RANGE</span>
              <span className="text-white font-bold">65MM – 95MM</span>
            </div>
          </div>

          {/* 3. FITMENT CALIPER BLOCK — 4 Cols */}
          <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-[#0B0B0B] border border-white/10 hover:border-white/25 p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="w-10 h-10 border border-white/15 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 block font-semibold">
                03 // FITMENT CHECK
              </span>
              <h4 className="text-xl font-mono uppercase text-white font-medium">
                Fits Your Car
              </h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Tested with popular Sri Lankan vehicles including Vezel, Aqua, Premio, Swift, Wagon R, Raize, and more.
              </p>
            </div>

            <a
              href="#fitment-caliper"
              className="text-xs font-mono tracking-widest uppercase text-white hover:text-white/80 flex items-center gap-2 pt-4 border-t border-white/10"
            >
              <span>CHECK FITMENT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 4. ISLANDWIDE DISPATCH BLOCK — 4 Cols */}
          <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-[#0B0B0B] border border-white/10 hover:border-white/25 p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="w-10 h-10 border border-white/15 flex items-center justify-center text-white">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 block font-semibold">
                04 // DELIVERY
              </span>
              <h4 className="text-xl font-mono uppercase text-white font-medium">
                Islandwide Courier
              </h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Delivering across all 25 districts in Sri Lanka. 24–48 hours in Colombo and Western Province, 2–3 days outstation. Cash on Delivery and Bank Transfer supported.
              </p>
            </div>

            <Link
              href="/shipping"
              className="text-xs font-mono tracking-widest uppercase text-white hover:text-white/80 flex items-center gap-2 pt-4 border-t border-white/10"
            >
              <span>SHIPPING DETAILS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 5. DIRECT WHATSAPP SUPPORT BLOCK — 4 Cols */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-[#0B0B0B] border border-white/10 hover:border-white/25 p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="w-10 h-10 border border-white/15 flex items-center justify-center text-white">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 block font-semibold">
                05 // SUPPORT
              </span>
              <h4 className="text-xl font-mono uppercase text-white font-medium">
                Fast WhatsApp Support
              </h4>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Unsure if the mount will fit your car cup holder or phone case? Message our team directly on WhatsApp for quick help.
              </p>
            </div>

            <a
              href={`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello AETHEX, I have a question about product fitment.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/[0.04] border border-white/20 hover:border-white text-white py-3 text-xs font-mono tracking-widest uppercase transition-colors"
            >
              <span>CHAT ON WHATSAPP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </BentoGrid>

      </div>
    </section>
  );
}
