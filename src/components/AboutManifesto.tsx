"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Compass, Sliders, Layers } from "lucide-react";
import { audioEngine } from "../lib/audio";

export default function AboutManifesto() {
  const handleHover = () => {
    try { audioEngine.playClick(); } catch {}
  };

  const handleSelect = () => {
    try { audioEngine.playSelect(); } catch {}
  };

  return (
    <section 
      id="about-manifesto" 
      className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 border-t border-white/10 bg-[#050505] text-white relative overflow-hidden font-sans"
    >
      {/* Ambient optical flare */}
      <div 
        className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none -z-0"
      />

      <div className="max-w-[1550px] mx-auto space-y-20 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/10 pb-10">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.35em] text-white/40 uppercase block font-semibold">
              ABOUT AETHEX // ENGINEERING MANIFESTO
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light uppercase tracking-tight text-white font-mono leading-[1.05]">
              Built For The Road.<br />
              <span className="text-white/40">Engineered For Longevity.</span>
            </h2>
          </div>

          <div className="max-w-md space-y-4">
            <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed">
              We design and curate essential hardware that refuses to compromise on physical retention, acoustic fidelity, or electrical safety.
            </p>
            <Link
              href="/about-us"
              onMouseEnter={handleHover}
              onClick={handleSelect}
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-white hover:text-white/70 border-b border-white/20 pb-1 hover:border-white transition-all"
            >
              <span>Read Full Brand Manifesto</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2-Column Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Hardware Frame (7 Cols) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative aspect-[16/10] bg-[#0B0B0B] border border-white/10 overflow-hidden shadow-2xl group"
          >
            <Image
              src="/images/a711/cockpit_matte.jpg"
              alt="AETHEX Cockpit Integration"
              fill
              sizes="(max-width: 1024px) 100vw, 850px"
              className="object-cover p-2 transition-transform duration-1000 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-white bg-[#0B0B0B]/90 backdrop-blur-xl border border-white/10 px-5 py-3">
              <span>PROTOTYPE // AETH-MNT-A711</span>
              <span className="text-white/50">COCKPIT MECHANICAL ANCHOR</span>
            </div>
          </motion.div>

          {/* Right Column: 3 Pillars with Space Grotesk Metrics (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 bg-[#0B0B0B] border border-white/10 space-y-2 hover:border-white/30 transition-all"
            >
              <div className="flex items-center justify-between text-xs font-mono text-white/40">
                <span className="tracking-widest">PILLAR 01</span>
                <Sliders className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold uppercase text-white tracking-wide">
                Mechanical Expansion Fit
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Zero adhesives. Zero suction cup failures in 35°C tropical heat. Knurled dials expand high-friction silicone pads (65mm–95mm) into your vehicle cup well.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-[#0B0B0B] border border-white/10 space-y-2 hover:border-white/30 transition-all"
            >
              <div className="flex items-center justify-between text-xs font-mono text-white/40">
                <span className="tracking-widest">PILLAR 02</span>
                <Compass className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold uppercase text-white tracking-wide">
                Clear Windshield Sightlines
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Keeping windshields 100% unobstructed. Dual tension joints lift displays up to 280mm into driver eye level without blocking road vision or safety radars.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 bg-[#0B0B0B] border border-white/10 space-y-2 hover:border-white/30 transition-all"
            >
              <div className="flex items-center justify-between text-xs font-mono text-white/40">
                <span className="tracking-widest">PILLAR 03</span>
                <Layers className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold uppercase text-white tracking-wide">
                Grade 5 Aerospace Integrity
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Reinforced polycarbonate, titanium drivers, and high-conductivity copper busbars built to outlast vibration and thermal cycling.
              </p>
            </motion.div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 text-center border-t border-white/10 font-mono">
              <div className="p-3 bg-white/[0.02] border border-white/5">
                <span className="text-xl font-bold text-white block">0.02mm</span>
                <span className="text-[9px] uppercase tracking-wider text-white/40">Tolerance</span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5">
                <span className="text-xl font-bold text-white block">10 Items</span>
                <span className="text-[9px] uppercase tracking-wider text-white/40">Curated Drop</span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5">
                <span className="text-xl font-bold text-white block">100%</span>
                <span className="text-[9px] uppercase tracking-wider text-white/40">Inspection</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
