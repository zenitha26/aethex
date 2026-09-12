"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Crosshair, ChevronRight } from "lucide-react";
import { audioEngine } from "../lib/audio";

export interface ProductHotspotItem {
  id: string;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  title: string;
  subtitle?: string;
  description: string;
  metric?: string;
}

interface ProductHotspotsProps {
  hotspots?: ProductHotspotItem[];
  className?: string;
}

const DEFAULT_HOTSPOTS: ProductHotspotItem[] = [
  {
    id: "ball-head",
    x: 50,
    y: 28,
    title: "Dual 360° Friction Ball Joint",
    subtitle: "Aviation-Grade 6063 Aluminum",
    description: "CNC micro-milled ball socket engineered for continuous 360° azimuth orientation. Holds ultra-tight clamping pressure under high-G braking.",
    metric: "40kg Clamping Torque"
  },
  {
    id: "arm-joint",
    x: 42,
    y: 54,
    title: "180° Telescopic Elevation Link",
    subtitle: "Stepless Tension Axis",
    description: "Multi-point articulated linkage allows vertical positioning from 110mm to 280mm without obstructing HVAC vents or dash telemetry.",
    metric: "±0.02mm Tolerance"
  },
  {
    id: "base-clamp",
    x: 52,
    y: 82,
    title: "Expanding Tri-Lug Cup Mount",
    subtitle: "Silicone Dampened Expansion",
    description: "Knurled rotary bezel expands 3 rubberized radial wedges from 65mm to 95mm for solid vibration-free anchoring in center console recesses.",
    metric: "65mm–95mm Dynamic Bore"
  }
];

export default function ProductHotspots({
  hotspots = DEFAULT_HOTSPOTS,
  className = "",
}: ProductHotspotsProps) {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  const handleSelect = (id: string) => {
    try { audioEngine.playSelect(); } catch {}
    setActiveHotspotId(activeHotspotId === id ? null : id);
    setShowGuide(false);
  };

  const activeHotspot = hotspots.find((h) => h.id === activeHotspotId);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Visual Guide Pill */}
      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute top-4 left-4 z-20 pointer-events-auto bg-[#0B0B0B]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/60 shadow-lg"
        >
          <Crosshair className="w-3 h-3 text-white/80 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Interactive Virtual Hotspots</span>
        </motion.div>
      )}

      {/* Hotspots Pin Overlay */}
      {hotspots.map((spot, index) => {
        const isActive = activeHotspotId === spot.id;

        return (
          <div
            key={spot.id}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20"
          >
            {/* Outer Looping Radar Rings */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 2.2, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4,
                }}
                className="absolute w-8 h-8 rounded-full border border-white/40 pointer-events-none"
              />

              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.9, 0.2, 0.9],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4 + 0.3,
                }}
                className="absolute w-6 h-6 rounded-full bg-white/10 pointer-events-none"
              />

              {/* Center Target Trigger Button */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleSelect(spot.id)}
                aria-label={`Inspect ${spot.title}`}
                className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isActive
                    ? "bg-white text-black scale-110 ring-4 ring-white/20"
                    : "bg-[#0B0B0B]/90 border border-white/40 text-white hover:border-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
              </motion.button>
            </div>
          </div>
        );
      })}

      {/* Sensory Detail Popover Modal Card */}
      <AnimatePresence>
        {activeHotspot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-80 z-30 pointer-events-auto"
          >
            <div className="bg-[#0B0B0B]/95 backdrop-blur-2xl border border-white/15 p-5 rounded-2xl shadow-2xl space-y-3 font-sans text-white relative">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block font-bold">
                    SPECIFICATION BREAKDOWN
                  </span>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    {activeHotspot.title}
                  </h4>
                  {activeHotspot.subtitle && (
                    <p className="text-[10px] font-mono text-white/50">{activeHotspot.subtitle}</p>
                  )}
                </div>

                <button
                  onClick={() => setActiveHotspotId(null)}
                  className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
                  aria-label="Close hotspot detail"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tactile Sensory Description */}
              <p className="text-[11px] font-mono text-white/70 leading-relaxed">
                {activeHotspot.description}
              </p>

              {/* Metric Tag */}
              {activeHotspot.metric && (
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                    BENCHMARK
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white border border-white/15">
                    {activeHotspot.metric}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
