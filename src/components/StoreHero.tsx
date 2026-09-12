"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, ShoppingBag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { audioEngine } from "../lib/audio";
import { useCartStore } from "../store/useCartStore";
import { mockProducts } from "../lib/mockData";

interface StoreHeroProps {
  onOpenOrder?: () => void;
  onExploreProducts: () => void;
}

export default function StoreHero({ onOpenOrder, onExploreProducts }: StoreHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCartStore();

  const slides = [
    {
      id: "aspor-a711",
      tag: "FLAGSHIP AUTOMOTIVE DROP",
      title: "Upgrade Your Drive.",
      subtitle: "ASPOR A711 — 360° Expanding Console Mount",
      desc: "Engineered for rock-solid stability in vehicle cup-holders. Features 180° articulating elevation and 360° fluid ball rotation for rapid one-handed phone mounting.",
      price: 2990,
      originalPrice: 3990,
      image: "/images/a711/cockpit_matte.jpg",
      productId: "aspor-a711",
      badge: "BEST SELLER"
    },
    {
      id: "aethex-ep10",
      tag: "LOSSLESS ACOUSTICS",
      title: "Hi-Fi Without Compromise.",
      subtitle: "AETHEX EP10 — Hybrid 42dB ANC Earbuds",
      desc: "Immerse yourself in studio-master clarity with LDAC lossless audio codec streaming, 11mm graphene acoustic drivers, and 36 hours total wireless battery reserve.",
      price: 5490,
      originalPrice: 7490,
      image: "/images/ep10/overview-1.jpg",
      productId: "aethex-ep10",
      badge: "HI-RES AUDIO"
    },
    {
      id: "ldnio-power",
      tag: "HEAVY-DUTY POWER STATION",
      title: "Power For Every Space.",
      subtitle: "LDNIO 2500W Smart Power Station & Cord",
      desc: "Industrial surge-protected multi-plug power center with USB-C PD 30W rapid charging and 5-meter pure copper cable reach. Built with 850°C flame-retardant shell.",
      price: 3450,
      originalPrice: 4200,
      image: "/images/ep10/overview-9.jpg",
      productId: "ldnio-2500w-power-strip",
      badge: "COMMERCIAL GRADE"
    }
  ];

  // Auto advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  const handlePrev = () => {
    try { audioEngine.playClick(); } catch {}
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    try { audioEngine.playClick(); } catch {}
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const handleQuickAdd = () => {
    try { audioEngine.playAcquire(); } catch {}
    const p = mockProducts.find(item => item.id === slide.productId);
    if (p) {
      addToCart(p, 1);
    }
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-between pt-8 sm:pt-12 pb-14 px-6 sm:px-10 lg:px-16 bg-[#FAFAFA] overflow-hidden font-sans text-[#111111]">
      {/* Background Soft Glow Radial Ambient Accent */}
      <div 
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gray-100/80 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
      />

      <div className="max-w-[1550px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center my-auto relative z-10">
        
        {/* Left Column: Bold Apple-Style Editorial Content (7 Cols) */}
        <div className="lg:col-span-7 space-y-7">
          
          {/* Eyebrow Pill Badges */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest bg-gray-200/70 text-gray-800">
              <Sparkles className="w-3 h-3 text-black" />
              <span>{slide.tag}</span>
            </span>
            <span className="bg-black text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              {slide.badge}
            </span>
          </div>

          {/* Monumental Headline with Tight Modern Tracking */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[5.5rem] font-bold tracking-[-0.04em] uppercase leading-[0.92] text-[#111111]">
            {slide.title}
          </h1>

          {/* Subtitle & Pricing Section */}
          <div className="space-y-2.5 border-l-2 border-black pl-5">
            <div className="text-base sm:text-lg font-medium tracking-tight text-gray-800">
              {slide.subtitle}
            </div>
            
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-black font-sans tracking-tight">
                Rs. {slide.price.toLocaleString()} LKR
              </span>
              <span className="text-sm text-gray-400 line-through">
                Rs. {slide.originalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Save Rs. {(slide.originalPrice - slide.price).toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-gray-500 font-sans">
              Or 3 interest-free payments of <span className="text-black font-semibold">Rs. {Math.round(slide.price / 3).toLocaleString()}</span> with Koko
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed max-w-xl">
            {slide.desc}
          </p>

          {/* Action CTAs: Rounded-Full Capsule Buttons with Framer Motion Micro-Animations */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={handleQuickAdd}
              className="rounded-full bg-black text-white hover:bg-neutral-800 px-8 sm:px-9 py-4 text-xs font-mono font-bold tracking-[0.16em] uppercase flex items-center gap-3 shadow-lg shadow-black/15 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO CART &bull; RS. {slide.price.toLocaleString()}</span>
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                href={`/product/${slide.productId}`}
                className="rounded-full bg-white border border-gray-300 hover:border-black text-black px-7 py-4 text-xs font-mono font-semibold tracking-[0.16em] uppercase flex items-center gap-2.5 shadow-xs hover:shadow-sm transition-all"
              >
                <span>VIEW DETAILS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Quick Value Indicators */}
          <div className="pt-6 flex flex-wrap items-center gap-8 text-xs text-gray-600 border-t border-gray-200/70">
            <div className="flex items-center gap-2 text-[#111111] font-medium">
              <Truck className="w-4 h-4 text-black" />
              <span>Islandwide COD Delivery (1-3 Days)</span>
            </div>
            <div className="flex items-center gap-2 text-[#111111] font-medium">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Official Warranty & Inspection Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Column: Modern Apple-Style Soft Floating Image (5 Cols) */}
        <div className="lg:col-span-5 relative flex flex-col items-center">
          
          {/* Soft Floating Card with Large Border Radius & Diffuse Shadow */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-square w-full max-w-[500px] lg:max-w-[540px] rounded-[2.5rem] bg-gradient-to-b from-white via-white to-gray-50/90 p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100/80 flex items-center justify-center overflow-hidden group"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 540px"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-xl"
                />
              </motion.div>
            </AnimatePresence>

            {/* Subtle Floating Badge */}
            <div className="absolute top-5 left-5 bg-black text-white text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm pointer-events-none">
              {slide.badge}
            </div>
          </motion.div>

          {/* Slider Capsule Controls (Dots & Navigation) */}
          <div className="flex items-center justify-between w-full max-w-[500px] lg:max-w-[540px] mt-6 px-2">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => { try { audioEngine.playClick(); } catch {}; setCurrentSlide(idx); }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx 
                      ? "w-8 bg-black" 
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Rounded Arrow Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-black text-black flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-black text-black flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
