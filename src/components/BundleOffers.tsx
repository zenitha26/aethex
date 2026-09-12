"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { audioEngine } from "../lib/audio";

interface BundleOffersProps {
  onSelectBundle?: (quantity: number) => void;
}

export default function BundleOffers({ onSelectBundle }: BundleOffersProps) {
  const [activeTier, setActiveTier] = useState<number>(2); // Default to Duo (Recommended)

  const handleSelect = (qty: number) => {
    audioEngine.playSelect();
    setActiveTier(qty);
    if (onSelectBundle) {
      onSelectBundle(qty);
    }
  };

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-12 bg-white border-b border-gray-200 font-sans text-[#111111]" id="bundles">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Section Heading */}
        <div className="space-y-2 border-b border-gray-200 pb-6">
          <span className="text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase block font-semibold">
            HARDWARE CONFIGURATIONS // BUNDLE SAVINGS
          </span>
          <h3 className="text-2xl sm:text-4xl font-light uppercase text-[#111111] tracking-tight font-mono">
            Select Your Configuration.
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
            Outfit one daily driver, equip two family cars with free delivery, or configure a multi-car fleet.
          </p>
        </div>

        {/* 3 Hardware Configuration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* SINGLE */}
          <div className="bg-[#F9F9F9] border border-gray-200 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
            <div className="space-y-4">
              <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-semibold">
                SINGLE UNIT
              </div>
              <div>
                <div className="text-base font-medium text-black uppercase">ASPOR A711 × 1</div>
                <div className="text-3xl font-mono text-black font-bold mt-2">Rs. 2,990</div>
                <div className="text-[11px] font-mono text-gray-500 mt-0.5">+ Standard Delivery</div>
              </div>
              <p className="text-xs text-gray-600 font-light leading-relaxed pt-2 border-t border-gray-200">
                Standard configuration for a single vehicle daily navigation station.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSelect(1)}
              className="w-full bg-white border border-gray-300 hover:border-black text-black transition-all py-3.5 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>SELECT SINGLE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* DUO — COMMERCIALLY RECOMMENDED */}
          <div className="bg-white border-2 border-black p-6 sm:p-8 flex flex-col justify-between space-y-6 relative shadow-lg">
            <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-[9px] font-mono font-bold tracking-widest shadow-xs">
              BEST VALUE // RECOMMENDED
            </div>

            <div className="space-y-4">
              <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-semibold">
                DUO PACK
              </div>
              <div>
                <div className="text-base font-medium text-black uppercase">ASPOR A711 × 2 UNITS</div>
                <div className="text-3xl font-mono text-black font-bold mt-2">Rs. 5,980</div>
                <div className="text-[11px] font-mono text-black font-bold mt-0.5">
                  ★ FREE ISLANDWIDE DELIVERY INCLUDED
                </div>
              </div>
              <p className="text-xs text-gray-600 font-light leading-relaxed pt-2 border-t border-gray-200">
                Equip both your primary vehicle and family vehicle. Courier delivery fee waived completely.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSelect(2)}
              className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3.5 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>ORDER DUO (FREE DELIVERY)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TRIO / FLEET */}
          <div className="bg-[#F9F9F9] border border-gray-200 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
            <div className="space-y-4">
              <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-semibold">
                TRIO / FLEET
              </div>
              <div>
                <div className="text-base font-medium text-black uppercase">ASPOR A711 × 3 UNITS</div>
                <div className="text-3xl font-mono text-black font-bold mt-2">Rs. 8,490</div>
                <div className="text-[11px] font-mono text-black font-bold mt-0.5">
                  ★ FREE DELIVERY + RS. 480 BUNDLE DISCOUNT
                </div>
              </div>
              <p className="text-xs text-gray-600 font-light leading-relaxed pt-2 border-t border-gray-200">
                Ideal for family car fleets, commercial delivery drivers, or corporate outfitting.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSelect(3)}
              className="w-full bg-white border border-gray-300 hover:border-black text-black transition-all py-3.5 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>ORDER TRIO BUNDLE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
