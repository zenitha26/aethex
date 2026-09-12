"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Tag } from "lucide-react";
import { audioEngine } from "../lib/audio";

interface DealsBannerProps {
  onShopDeals: () => void;
}

export default function DealsBanner({ onShopDeals }: DealsBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  const handleClick = () => {
    try { audioEngine.playSelect(); } catch {}
    onShopDeals();
  };

  return (
    <section className="py-12 px-6 sm:px-10 lg:px-12 bg-white border-b border-gray-200 font-sans text-[#111111]">
      <div className="max-w-[1500px] mx-auto bg-[#F9F9F9] border border-gray-200 p-8 sm:p-12 relative overflow-hidden shadow-xs">
        {/* Subtle geometric pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000000 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Offer Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 shadow-xs">
                LIMITED DROP
              </span>
              <span className="text-[10px] font-mono text-gray-500 tracking-wider uppercase font-semibold">
                // FLASH SALE PROMOTION
              </span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-mono uppercase text-[#111111] font-light leading-tight">
              Top Deals Of The Week. <br />
              <span className="text-black font-bold">Up to 25% Off.</span>
            </h3>

            <p className="text-xs sm:text-sm font-mono text-gray-600 max-w-xl font-light leading-relaxed">
              Curated precision hardware and accessories at exclusive introductory rates. Includes islandwide door-to-door delivery with inspection before payment.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 bg-white text-xs font-mono shadow-xs">
                <Tag className="w-3.5 h-3.5 text-black" />
                <span className="text-gray-500">USE CODE:</span>
                <span className="text-[#111111] font-bold tracking-wider">AETHEX10</span>
              </div>
              <div className="text-[11px] font-mono text-gray-600">
                Extra 10% off at checkout or WhatsApp confirmation
              </div>
            </div>
          </div>

          {/* Right Column: Countdown Clock & CTA (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col sm:items-end justify-center space-y-6">
            <div className="space-y-2 sm:text-right">
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block font-semibold">
                OFFER TERMINATES IN
              </span>
              <div className="flex items-center gap-2 sm:justify-end font-mono">
                <div className="bg-white border border-gray-300 p-3 sm:p-4 text-center min-w-[64px] shadow-xs">
                  <span className="text-2xl sm:text-3xl font-bold text-[#111111] block">
                    {format(timeLeft.hours)}
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider block mt-1">
                    HRS
                  </span>
                </div>
                <span className="text-[#111111] font-bold text-xl">:</span>
                <div className="bg-white border border-gray-300 p-3 sm:p-4 text-center min-w-[64px] shadow-xs">
                  <span className="text-2xl sm:text-3xl font-bold text-[#111111] block">
                    {format(timeLeft.minutes)}
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider block mt-1">
                    MINS
                  </span>
                </div>
                <span className="text-[#111111] font-bold text-xl">:</span>
                <div className="bg-white border border-gray-300 p-3 sm:p-4 text-center min-w-[64px] shadow-xs">
                  <span className="text-2xl sm:text-3xl font-bold text-[#111111] block">
                    {format(timeLeft.seconds)}
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider block mt-1">
                    SECS
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleClick}
              className="bg-black text-white hover:bg-neutral-800 px-8 py-3.5 text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md w-full sm:w-auto"
            >
              <span>EXPLORE TOP DEALS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
