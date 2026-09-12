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
    <section className="py-12 px-6 sm:px-10 lg:px-12 bg-[#050505] border-b border-white/10 font-sans text-white">
      <div className="max-w-[1500px] mx-auto bg-[#0B0B0B] border border-white/10 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        {/* Subtle geometric pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Offer Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-white text-black text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 shadow-sm">
                LIMITED DROP
              </span>
              <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase font-semibold">
                // FLASH SALE PROMOTION
              </span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-mono uppercase text-white font-light leading-tight">
              Top Deals Of The Week. <br />
              <span className="text-white font-bold">Up to 25% Off.</span>
            </h3>

            <p className="text-xs sm:text-sm font-mono text-white/60 max-w-xl font-light leading-relaxed">
              Curated precision hardware and accessories at exclusive introductory rates. Includes islandwide insured delivery with verification prior to dispatch.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 bg-white/5 text-xs font-mono shadow-xs">
                <Tag className="w-3.5 h-3.5 text-white" />
                <span className="text-white/50">USE CODE:</span>
                <span className="text-white font-bold tracking-wider">AETHEX10</span>
              </div>
              <div className="text-[11px] font-mono text-white/60">
                Extra 10% off at direct bank checkout or WhatsApp confirmation
              </div>
            </div>
          </div>

          {/* Right Column: Countdown Clock & CTA (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col sm:items-end justify-center space-y-6">
            <div className="space-y-2 sm:text-right">
              <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase block font-semibold">
                OFFER TERMINATES IN
              </span>
              <div className="flex items-center gap-2 sm:justify-end font-mono">
                <div className="bg-white/5 border border-white/10 p-3 sm:p-4 text-center min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-bold text-white block">
                    {format(timeLeft.hours)}
                  </span>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider block mt-1">
                    HRS
                  </span>
                </div>
                <span className="text-white/60 font-bold text-xl">:</span>
                <div className="bg-white/5 border border-white/10 p-3 sm:p-4 text-center min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-bold text-white block">
                    {format(timeLeft.minutes)}
                  </span>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider block mt-1">
                    MINS
                  </span>
                </div>
                <span className="text-white/60 font-bold text-xl">:</span>
                <div className="bg-white/5 border border-white/10 p-3 sm:p-4 text-center min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-bold text-white block">
                    {format(timeLeft.seconds)}
                  </span>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider block mt-1">
                    SECS
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleClick}
              className="bg-white text-black hover:bg-white/90 px-8 py-3.5 text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl w-full sm:w-auto"
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
