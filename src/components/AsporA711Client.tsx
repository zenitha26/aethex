"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RotateCcw, 
  MoveDiagonal, 
  ShieldCheck, 
  Smartphone, 
  ChevronDown, 
  Check, 
  Truck, 
  Shield, 
  MessageSquare,
  ArrowRight,
  Compass,
  Sliders,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Layers
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FastOrderModal from "./FastOrderModal";
import BundleOffers from "./BundleOffers";
import DeliveryChecker from "./DeliveryChecker";
import { audioEngine } from "../lib/audio";
import { Product } from "../types/product";
import { SITE_CONTACT } from "../constants";

interface AsporA711ClientProps {
  product?: Product;
}

export default function AsporA711Client({ product }: AsporA711ClientProps) {
  const images = [
    { 
      src: "/images/a711/studio_hardware.jpg", 
      label: "Articulating Architecture",
      caption: "Full Hardware Assembly • Dual Aluminum Tension Joints",
      badge: "STUDIO HARDWARE",
      defaultFit: "contain" as const
    },
    { 
      src: "/images/a711/cockpit_matte.jpg", 
      label: "Cockpit Center Console",
      caption: "Active GPS Navigation in Carbon Fiber Interior",
      badge: "IN-SITU INTEGRATION",
      defaultFit: "cover" as const
    },
    { 
      src: "/images/a711/macro_arm.jpg", 
      label: "Precision Ball Joint",
      caption: "360° Rotational Head & High-Tension Articulating Arm",
      badge: "PIVOT CALIBRATION",
      defaultFit: "contain" as const
    },
    { 
      src: "/images/a711/macro_base.jpg", 
      label: "Expanding Console Anchor",
      caption: "65mm–95mm Expanding Base with Anti-Vibration Lugs",
      badge: "BASE MECHANICS",
      defaultFit: "contain" as const
    },
    { 
      src: "/images/a711/landscape_drive.jpg", 
      label: "Highway Twilight Horizon",
      caption: "Landscape Route View with Zero Sightline Obstruction",
      badge: "HORIZON VIEW",
      defaultFit: "cover" as const
    },
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewFit, setViewFit] = useState<"fit" | "fill">("fit");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [testedPhone, setTestedPhone] = useState<string>("iPhone 16 / 15 / 14 Pro Max");
  const [rotationAngle, setRotationAngle] = useState<0 | 90>(0);

  const price = product?.price || 2990;
  const originalPrice = product?.original_price || 3990;

  const playHover = () => audioEngine.playClick();
  const playSelect = () => audioEngine.playSelect();

  const handlePrevImage = () => {
    playSelect();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    playSelect();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleOpenOrder = () => {
    audioEngine.playAcquire();
    const text = encodeURIComponent(`Hello AETHEX Automotive, I would like to order:

• Product: ASPOR A711 360° Car Phone Holder
• Quantity: 1
• Price: Rs. ${price.toLocaleString()} LKR + Islandwide Delivery
• Payment: Cash on Delivery

Please confirm my order and dispatch.`);
    window.location.href = `https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${text}`;
  };

  const faqs = [
    {
      q: "Can I rotate the phone?",
      a: "Yes. The mount features a high-tension 360° stainless steel ball head that allows instant single-handed rotation between vertical portrait navigation and wide cinematic landscape orientation with zero sag."
    },
    {
      q: "Can I charge while mounted?",
      a: "Yes. The engineered lower bracket features an open cable pass-through port accommodating all USB-C, Lightning, and fast-charging braided cables."
    },
    {
      q: "Is it suitable for daily driving?",
      a: "Yes. Engineered with an expandable mechanical base that locks firmly into standard vehicle cup wells (65mm–95mm). Anti-vibration silicone dampeners absorb aggressive braking, cornering, and rough road conditions."
    },
    {
      q: "How does islandwide delivery work?",
      a: "We ship islandwide within 2 to 4 business days across all 25 districts of Sri Lanka. Cash on delivery is standard, allowing you to inspect the sealed packaging upon arrival before payment."
    },
    {
      q: "What is the warranty and return policy?",
      a: "Every unit comes with the AETHEX 7-Day Inspection Replacement Guarantee. If you encounter any mechanical defect, we replace your unit immediately free of charge."
    }
  ];

  const devicePresets = [
    { name: "iPhone 16 / 15 / 14 Pro Max", size: "6.9\" Screen", status: "100% Compatible (With Case)" },
    { name: "Samsung Galaxy S24 / S23 Ultra", size: "6.8\" Screen", status: "100% Compatible (With Armor Case)" },
    { name: "Google Pixel 9 / 8 Pro", size: "6.7\" Screen", status: "100% Compatible (With Case)" },
    { name: "Xiaomi / Redmi / POCO Flagships", size: "6.67\" Screen", status: "100% Compatible" },
    { name: "OnePlus 12 / Open / 11", size: "6.82\" Screen", status: "100% Compatible" },
    { name: "Compact Devices (iPhone Mini / SE)", size: "4.7\" - 5.4\"", status: "100% Compatible (Spring Grip)" },
  ];

  const howItWorks = [
    {
      num: "01",
      title: "Place",
      desc: "Seat the expansion base inside your vehicle's center console cup holder."
    },
    {
      num: "02",
      title: "Adjust",
      desc: "Rotate the tension ring to expand the base lugs, locking the unit firmly vibration-free."
    },
    {
      num: "03",
      title: "Mount",
      desc: "Set the dual-pivot articulating arm to your exact eye level and clamp your smartphone into the spring grips."
    },
    {
      num: "04",
      title: "Rotate",
      desc: "Smoothly pivot 360° to switch between portrait navigation and landscape highway recording."
    }
  ];

  const currentImage = images[activeImageIndex];
  const isContainMode = viewFit === "fit" && currentImage.defaultFit === "contain";

  return (
    <div className="bg-white text-[#111111] min-h-screen font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main className="pt-28 md:pt-36 pb-24">
        {/* Breadcrumb Header */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-8">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase font-semibold">
              <Link href="/" className="hover:text-black transition-colors">AETHEX</Link>
              <span>/</span>
              <span className="text-gray-400">HARDWARE</span>
              <span>/</span>
              <span className="text-[#111111]">ASPOR A711</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[9px] font-mono tracking-[0.2em] text-gray-500 uppercase font-semibold">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
              <span>COLOMBO HUB // LIVE DISPATCH</span>
            </div>
          </div>
        </div>

        {/* HERO PRODUCT SECTION */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* LEFT: Master Product Gallery */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Viewport Container */}
              <div className="relative aspect-[4/3] md:aspect-[16/12] w-full bg-[#F9F9F9] border border-gray-200 overflow-hidden group shadow-sm">
                
                {/* Viewfinder Technical Corner Tick Marks */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-gray-400 z-20 pointer-events-none" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-gray-400 z-20 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-gray-400 z-20 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-gray-400 z-20 pointer-events-none" />

                {/* Main Product Image with Smooth Transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeImageIndex}-${viewFit}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <Image
                      src={currentImage.src}
                      alt={currentImage.label}
                      fill
                      priority
                      className={`transition-all duration-700 ${
                        isContainMode
                          ? "object-contain p-6 sm:p-10 md:p-12 drop-shadow-md"
                          : "object-cover group-hover:scale-[1.02]"
                      }`}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Museum Corner Badges & Index */}
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md border border-gray-200 px-3 py-1.5 text-[9px] font-mono tracking-[0.25em] text-[#111111] uppercase flex items-center gap-2 font-semibold shadow-xs">
                  <span className="w-1.5 h-1.5 bg-black rounded-full inline-block animate-pulse" />
                  <span>VIEW 0{activeImageIndex + 1} / 05 // {currentImage.badge}</span>
                </div>

                {/* Top-Right Control Cluster: Fit Mode Toggle */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playSelect();
                      setViewFit(viewFit === "fit" ? "fill" : "fit");
                    }}
                    className="bg-white/90 hover:bg-black hover:text-white backdrop-blur-md border border-gray-200 text-[9px] font-mono tracking-widest text-gray-700 px-3 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    title={viewFit === "fit" ? "Switch to Zoom / Bleed View" : "Switch to Fitted Silhouette View"}
                  >
                    {viewFit === "fit" ? (
                      <>
                        <Maximize2 className="w-3 h-3" />
                        <span>EXPAND</span>
                      </>
                    ) : (
                      <>
                        <Minimize2 className="w-3 h-3" />
                        <span>FIT SILHOUETTE</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Prev / Next Navigation Arrows */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 hover:bg-black hover:text-white backdrop-blur-md border border-gray-200 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm text-black"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 hover:bg-black hover:text-white backdrop-blur-md border border-gray-200 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm text-black"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Modern Lower Telemetry Bar */}
                <div className="absolute bottom-3 left-3 right-3 z-20 bg-white/90 backdrop-blur-md border border-gray-200 px-4 py-2 flex items-center justify-between text-[9px] font-mono tracking-[0.2em] text-[#111111] uppercase pointer-events-none font-semibold shadow-xs">
                  <span className="truncate pr-2">{currentImage.caption}</span>
                  <span className="text-gray-500 shrink-0">SPEC: 711-MK1</span>
                </div>
              </div>

              {/* Gallery Thumbnails List */}
              <div className="grid grid-cols-5 gap-2.5">
                {images.map((img, idx) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => {
                      playSelect();
                      setActiveImageIndex(idx);
                    }}
                    onMouseEnter={playHover}
                    className={`relative aspect-[4/3] bg-white border transition-all overflow-hidden p-1 group cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-black ring-1 ring-black/20"
                        : "border-gray-200 hover:border-black/50"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img.src}
                        alt={img.label}
                        fill
                        className={`transition-transform duration-500 group-hover:scale-105 ${
                          img.defaultFit === "contain" ? "object-contain p-1" : "object-cover"
                        }`}
                      />
                    </div>
                    <span className="absolute top-1 left-1.5 text-[8px] font-mono text-gray-400 group-hover:text-black">
                      0{idx + 1}
                    </span>
                    {activeImageIndex === idx && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                    )}
                  </button>
                ))}
              </div>

              {/* Re-engineered Orientation Dynamics Deck */}
              <div className="bg-white border border-gray-200 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-black" />
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#111111] font-bold">
                      ORIENTATION DYNAMICS // 360° PIVOT
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-gray-500 font-semibold">
                      ACTIVE AXIS:
                    </span>
                    <span className="text-xs font-mono font-bold text-black bg-gray-100 px-2 py-0.5 border border-gray-300">
                      {rotationAngle === 0 ? "000° PORTRAIT" : "090° LANDSCAPE"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playSelect();
                      setRotationAngle(0);
                      setActiveImageIndex(1); // In-cabin portrait
                    }}
                    className={`p-3.5 border text-left transition-all cursor-pointer ${
                      rotationAngle === 0
                        ? "border-black bg-black text-white shadow-sm"
                        : "border-gray-200 bg-[#F9F9F9] text-gray-700 hover:border-black hover:text-black"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                        0° PORTRAIT MODE
                      </span>
                      <span className="text-[9px] font-mono opacity-80">000°</span>
                    </div>
                    <span className={`text-[10px] block leading-tight ${rotationAngle === 0 ? "text-gray-300" : "text-gray-600"}`}>
                      Ideal for Google Maps, Waze turn-by-turn navigation & road visibility.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSelect();
                      setRotationAngle(90);
                      setActiveImageIndex(4); // Highway landscape view
                    }}
                    className={`p-3.5 border text-left transition-all cursor-pointer ${
                      rotationAngle === 90
                        ? "border-black bg-black text-white shadow-sm"
                        : "border-gray-200 bg-[#F9F9F9] text-gray-700 hover:border-black hover:text-black"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                        90° LANDSCAPE MODE
                      </span>
                      <span className="text-[9px] font-mono opacity-80">090°</span>
                    </div>
                    <span className={`text-[10px] block leading-tight ${rotationAngle === 90 ? "text-gray-300" : "text-gray-600"}`}>
                      Cinematic wide highway radar, multimedia & zero windshield obstruction.
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Product Editorial Buy Box */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3 border-b border-gray-200 pb-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-[0.3em] text-gray-600 uppercase bg-gray-100 border border-gray-200 px-2.5 py-1 font-semibold">
                    AETHEX AUTOMOTIVE // DROP 01
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-gray-600 uppercase flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-black inline-block animate-pulse" />
                    IN STOCK • DISPATCH READY
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-light tracking-[0.08em] uppercase text-[#111111] leading-tight">
                  ASPOR A711
                </h1>
                <p className="text-xs md:text-sm font-mono text-gray-500 tracking-widest uppercase font-semibold">
                  360° HIGH-TENSION CAR CONSOLE MOUNT
                </p>
              </div>

              {/* Pricing Block */}
              <div className="space-y-3 border-b border-gray-200 pb-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl md:text-5xl font-mono tracking-tight text-[#111111] font-medium">
                    Rs. {price.toLocaleString()}
                  </span>
                  <span className="text-lg font-mono text-gray-400 line-through">
                    Rs. {originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-white bg-black px-2.5 py-1 uppercase tracking-widest font-bold">
                    SAVE 25%
                  </span>
                </div>
                <p className="text-xs font-mono text-gray-600 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-black" />
                  <span>Islandwide Doorstep Delivery • Cash on Delivery (COD)</span>
                </p>
              </div>

              {/* Primary Call to Action */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleOpenOrder}
                  onMouseEnter={playHover}
                  className="w-full bg-black text-white py-4 px-8 text-xs uppercase tracking-[0.25em] font-mono font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-md cursor-pointer active:scale-[0.99]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ORDER VIA WHATSAPP (RS. 2,990) →</span>
                </button>

                <div className="grid grid-cols-3 gap-2 pt-1 text-[9px] font-mono text-gray-600">
                  <div className="flex flex-col items-center justify-center text-center bg-[#F9F9F9] border border-gray-200 p-2.5 shadow-xs">
                    <Check className="w-3.5 h-3.5 text-black mb-1" />
                    <span>Cash on Delivery</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center bg-[#F9F9F9] border border-gray-200 p-2.5 shadow-xs">
                    <Truck className="w-3.5 h-3.5 text-black mb-1" />
                    <span>24–48h Dispatch</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center bg-[#F9F9F9] border border-gray-200 p-2.5 shadow-xs">
                    <Shield className="w-3.5 h-3.5 text-black mb-1" />
                    <span>7-Day Replacement</span>
                  </div>
                </div>
              </div>

              {/* 4 Key Pillars Matrix */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase block font-semibold">
                  CORE HARDWARE SPECIFICATIONS
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white border border-gray-200 p-3.5 space-y-1 hover:border-black shadow-xs transition-colors">
                    <div className="flex items-center gap-2 text-[#111111]">
                      <RotateCcw className="w-3.5 h-3.5 text-black" />
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold">360° PIVOT</span>
                    </div>
                    <p className="text-[10px] text-gray-600 leading-tight">High-tension ball socket</p>
                  </div>

                  <div className="bg-white border border-gray-200 p-3.5 space-y-1 hover:border-black shadow-xs transition-colors">
                    <div className="flex items-center gap-2 text-[#111111]">
                      <MoveDiagonal className="w-3.5 h-3.5 text-black" />
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold">180° ARM</span>
                    </div>
                    <p className="text-[10px] text-gray-600 leading-tight">280mm eye-level elevation</p>
                  </div>

                  <div className="bg-white border border-gray-200 p-3.5 space-y-1 hover:border-black shadow-xs transition-colors">
                    <div className="flex items-center gap-2 text-[#111111]">
                      <ShieldCheck className="w-3.5 h-3.5 text-black" />
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold">65–95MM BASE</span>
                    </div>
                    <p className="text-[10px] text-gray-600 leading-tight">Expanding console anchor</p>
                  </div>

                  <div className="bg-white border border-gray-200 p-3.5 space-y-1 hover:border-black shadow-xs transition-colors">
                    <div className="flex items-center gap-2 text-[#111111]">
                      <Smartphone className="w-3.5 h-3.5 text-black" />
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold">4.0–7.0" CLAMP</span>
                    </div>
                    <p className="text-[10px] text-gray-600 leading-tight">Anti-scratch rubber grips</p>
                  </div>
                </div>
              </div>

              {/* Interactive Device Compatibility Checker */}
              <div className="bg-white border border-gray-200 p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#111111] font-bold flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5" />
                    CHECK DEVICE FIT
                  </span>
                  <span className="text-[9px] font-mono text-black bg-gray-100 px-2 py-0.5 border border-gray-300 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-black" /> 100% VERIFIED FIT
                  </span>
                </div>

                <div className="space-y-2">
                  <select
                    value={testedPhone}
                    onChange={(e) => {
                      playSelect();
                      setTestedPhone(e.target.value);
                    }}
                    className="w-full bg-white border border-gray-300 px-3.5 py-2.5 text-xs text-[#111111] outline-none font-mono focus:border-black transition-colors cursor-pointer"
                  >
                    {devicePresets.map((dev) => (
                      <option key={dev.name} value={dev.name} className="bg-white text-black">
                        {dev.name} ({dev.size})
                      </option>
                    ))}
                  </select>

                  <div className="text-[10px] font-mono text-gray-600 bg-[#F9F9F9] p-3 border border-gray-200 flex items-center justify-between">
                    <span>CLEARANCE VERIFICATION:</span>
                    <span className="text-[#111111] font-bold">
                      {devicePresets.find((d) => d.name === testedPhone)?.status}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* EDITORIAL MANIFESTO SECTION */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 my-28 md:my-36">
          <div className="border-t border-b border-gray-200 py-16 md:py-24 text-center space-y-8 relative overflow-hidden">
            <span className="text-[10px] font-mono tracking-[0.35em] text-gray-500 uppercase block font-semibold">
              AETHEX ARCHITECTURE / 01
            </span>
            
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] uppercase text-[#111111] max-w-4xl mx-auto leading-tight">
              YOUR PHONE.<br />
              YOUR VIEW.<br />
              YOUR DRIVE.
            </h2>

            <p className="text-xs md:text-sm font-light text-gray-600 max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
              Eliminate dashboard suction failures and blocked air vents. The ASPOR A711 transforms your center console into an ergonomic, rock-solid navigation command center.
            </p>

            {/* Editorial Lifestyle Image Showcase */}
            <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] bg-[#F9F9F9] border border-gray-200 overflow-hidden mt-12 shadow-sm">
              <Image
                src="/images/a711/landscape_drive.jpg"
                alt="Aethex Automotive ASPOR A711 on highway drive"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-left">
                <span className="text-[10px] font-mono tracking-[0.3em] text-white/80 uppercase block font-semibold">
                  HORIZON SIGHTLINE STUDY
                </span>
                <span className="text-sm font-light tracking-widest uppercase text-white">
                  ZERO VENT BLOCKAGE • NATURAL EYE ALIGNMENT
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-28 md:mb-36" id="how-it-works">
          <div className="space-y-12">
            <div className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase block mb-2 font-semibold">
                  DEPLOYMENT PROTOCOL
                </span>
                <h3 className="text-3xl md:text-5xl font-light tracking-[0.12em] uppercase text-[#111111]">
                  HOW IT WORKS
                </h3>
              </div>
              <p className="text-xs font-mono text-gray-600 uppercase tracking-wider max-w-xs">
                Tool-free 30-second installation in any standard vehicle cup holder.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {howItWorks.map((step) => (
                <div
                  key={step.num}
                  className="bg-white border border-gray-200 p-6 md:p-8 space-y-4 hover:border-black shadow-xs transition-colors"
                >
                  <span className="text-2xl md:text-3xl font-mono text-gray-300 font-light block">
                    {step.num}
                  </span>
                  <h4 className="text-base font-light tracking-[0.15em] uppercase text-[#111111]">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PACKAGE INCLUSIONS & TECHNICAL MATRIX */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-28 md:mb-36">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: What's In The Box */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-2 border-b border-gray-200 pb-6">
                <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase block font-semibold">
                  DELIVERY MANIFEST
                </span>
                <h3 className="text-2xl md:text-4xl font-light tracking-[0.1em] uppercase text-[#111111]">
                  PACKAGE INCLUSIONS
                </h3>
                <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">
                  Every ASPOR A711 box arrives factory-sealed with all hardware accessories.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { num: "01", name: "Expandable Cup Mount Base Assembly", detail: "Dial-actuated 65mm–95mm mechanical expansion base with silicone friction dampeners." },
                  { num: "02", name: "Dual-Pivot Articulating Extension Arm", detail: "180° variable elevation arm with high-torque hex tension joints." },
                  { num: "03", name: "360° Ball Swivel Smartphone Grip", detail: "Push-to-release spring clamp fitting 4.0\"–7.0\" devices with bottom cable channel." },
                  { num: "04", name: "AETHEX Authenticity & Guarantee Card", detail: "7-Day immediate inspection replacement warranty valid across Sri Lanka." }
                ].map((item) => (
                  <div key={item.num} className="p-4 bg-white border border-gray-200 flex items-start gap-4 shadow-xs">
                    <span className="text-xs font-mono text-gray-400 block font-bold">{item.num}</span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">{item.name}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Technical Specification Matrix */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-2 border-b border-gray-200 pb-6">
                <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase block font-semibold">
                  HARDWARE DATA
                </span>
                <h3 className="text-2xl md:text-4xl font-light tracking-[0.1em] uppercase text-[#111111]">
                  TECHNICAL SPECS
                </h3>
                <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">
                  Engineered tolerances for automotive endurance and vibration isolation.
                </p>
              </div>

              <div className="border border-gray-200 bg-white divide-y divide-gray-100 text-xs font-mono shadow-xs">
                {[
                  { label: "PRODUCT MODEL", value: "ASPOR A711" },
                  { label: "CATEGORY", value: "AETHEX Automotive Drop 01" },
                  { label: "CUP WELL RANGE", value: "65mm – 95mm (Universal Car Well)" },
                  { label: "PHONE CLAMP SPAN", value: "55mm – 92mm (4.0\" to 7.0\" Screens)" },
                  { label: "ELEVATION REACH", value: "Up to 280mm Variable Height" },
                  { label: "ROTATIONAL AXIS", value: "360° Sphere Ball + 180° Pitch" },
                  { label: "CHASSIS MATERIAL", value: "Reinforced Polycarbonate + Alloy Screws" },
                  { label: "CONTACT SURFACES", value: "High-Friction Anti-Scratch Silicone" },
                  { label: "CABLE ACCESS", value: "Open Base Cutout (Fast Charge Ready)" },
                  { label: "WARRANTY", value: "7-Day Free Replacement Guarantee" },
                ].map((row) => (
                  <div key={row.label} className="p-3.5 flex items-center justify-between gap-4">
                    <span className="text-gray-500 tracking-wider uppercase text-[10px] font-semibold">{row.label}</span>
                    <span className="text-[#111111] text-right text-[11px] font-bold">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MULTI-UNIT BUNDLE & SAVE SAVINGS */}
        <BundleOffers />

        {/* SRI LANKA DISTRICT DELIVERY TIMEFRAME CHECKER */}
        <DeliveryChecker />

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="max-w-[1000px] mx-auto px-6 md:px-12 mb-28 md:mb-36" id="faq">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase block font-semibold">
                FREQUENT INQUIRIES
              </span>
              <h3 className="text-2xl md:text-4xl font-light tracking-[0.15em] uppercase text-[#111111]">
                FAQ
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gray-200 bg-white transition-colors shadow-xs"
                  >
                    <button
                      onClick={() => {
                        playSelect();
                        setOpenFaq(isOpen ? null : idx);
                      }}
                      onMouseEnter={playHover}
                      className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 text-xs md:text-sm uppercase tracking-wider font-semibold text-[#111111] cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                          isOpen ? "rotate-180 text-black" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 md:px-6 pb-6 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 font-mono">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM ORDER CALLOUT STRIP */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="bg-[#F9F9F9] border border-gray-200 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-sm">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase block font-semibold">
                AETHEX / AUTOMOTIVE SPEC
              </span>
              <h4 className="text-2xl md:text-3xl font-light tracking-[0.1em] uppercase text-[#111111]">
                ASPOR A711 CAR MOUNT
              </h4>
              <p className="text-base font-mono text-[#111111] font-bold">
                Rs. {price.toLocaleString()} + DELIVERY · ISLANDWIDE
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <button
                onClick={handleOpenOrder}
                onMouseEnter={playHover}
                className="w-full sm:w-auto bg-black text-white py-4 px-10 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-neutral-800 transition-all rounded-[1px] cursor-pointer shadow-sm"
              >
                ORDER VIA WHATSAPP
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* STICKY BOTTOM MOBILE ORDER BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-gray-200 px-4 py-3 flex items-center justify-between backdrop-blur-md shadow-xl">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 block font-semibold">
            ASPOR A711
          </span>
          <span className="text-sm font-mono font-bold text-[#111111]">
            Rs. {price.toLocaleString()}
          </span>
        </div>
        <button
          onClick={handleOpenOrder}
          className="bg-black text-white py-2.5 px-6 text-[11px] uppercase tracking-[0.2em] font-semibold rounded-[1px] cursor-pointer shadow-sm hover:bg-neutral-800"
        >
          ORDER VIA WHATSAPP
        </button>
      </div>

      {/* FAST ORDER MODAL */}
      <FastOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        productTitle="ASPOR A711 360° Car Phone Holder"
        unitPrice={price}
        productImage="/images/a711/cockpit_matte.jpg"
      />

      <Footer />
    </div>
  );
}
