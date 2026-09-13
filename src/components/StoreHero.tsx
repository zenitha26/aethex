"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import { useCartStore } from "../store/useCartStore";
import { mockProducts } from "../lib/mockData";

interface StoreHeroProps {
  onOpenOrder?: () => void;
  onExploreProducts: () => void;
}

export default function StoreHero({ onExploreProducts }: StoreHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart, setCartOpen } = useCartStore();
  const heroRef = useRef<HTMLElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);

  // Scroll parallax using Framer Motion
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const yImage = useTransform(smoothProgress, [0, 1], [0, 100]);
  const scaleImage = useTransform(smoothProgress, [0, 1], [1, 1.05]);
  const opacityContent = useTransform(smoothProgress, [0, 0.8], [1, 0.3]);
  const yContent = useTransform(smoothProgress, [0, 1], [0, 40]);

  useEffect(() => {
    if (!imageFrameRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(imageFrameRef.current, {
        y: -8,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, heroRef);

    return () => ctx.revert();
  }, [currentSlide]);

  const slides = [
    {
      id: "aspor-a711",
      tag: "01 // PHONE MOUNTS",
      title: "CAR ACCESSORIES, MADE BETTER.",
      subtitle: "ASPOR A711 — 360° Console Mount",
      desc: "Secure phone mount for your car cup holder. Features 180° arm adjustment and 360° rotation for easy one-handed phone mounting.",
      price: 2990,
      originalPrice: 3990,
      image: "/images/a711/cockpit_matte.jpg",
      productId: "aspor-a711",
      badge: "BEST SELLER",
      spec: "FITS 65–95MM CUP HOLDERS",
      rotation: "360° ROTATION"
    },
    {
      id: "aethex-magdrive",
      tag: "02 // WIRELESS CHARGERS",
      title: "FAST WIRELESS CHARGING.",
      subtitle: "AETHEX MagDrive Pro — 15W Cooling Mount",
      desc: "Fast 15W wireless charger with built-in cooling to keep your phone running cool and charged on everyday drives.",
      price: 6890,
      originalPrice: 8500,
      image: "/images/products/magdrive-mount.jpg",
      productId: "aethex-magdrive",
      badge: "QI2 CERTIFIED",
      spec: "15W ACTIVE COOLING",
      rotation: "STRONG MAGNETIC HOLD"
    },
    {
      id: "aethex-ep10",
      tag: "03 // WIRELESS AUDIO",
      title: "CLEAR, BALANCED AUDIO.",
      subtitle: "AETHEX EP10 — Noise Cancelling Earbuds",
      desc: "High-resolution audio with active noise cancellation, rich bass, and up to 36 hours of total listening time.",
      price: 5490,
      originalPrice: 7490,
      image: "/images/ep10/overview-1.jpg",
      productId: "aethex-ep10",
      badge: "HIGH RES AUDIO",
      spec: "HYBRID NOISE CANCELLING",
      rotation: "36H BATTERY LIFE"
    },
    {
      id: "ldnio-power",
      tag: "04 // POWER & CHARGING",
      title: "HEAVY-DUTY POWER.",
      subtitle: "LDNIO SC3412 — 2500W Power Strip",
      desc: "Reliable power strip with fast 38W USB-C PD ports, surge protection, and durable fire-resistant casing.",
      price: 3450,
      originalPrice: 4200,
      image: "/images/products/power-station.jpg",
      productId: "ldnio-2500w-power-strip",
      badge: "2500W HEAVY DUTY",
      spec: "38W USB-C FAST CHARGING",
      rotation: "SURGE PROTECTED"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleQuickAdd = () => {
    const p = mockProducts.find((item) => item.id === slide.productId);
    if (p) {
      addToCart(p, 1);
      setCartOpen(true);
    }
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-between pt-10 sm:pt-16 pb-14 px-6 sm:px-10 lg:px-16 bg-[#050505] overflow-hidden font-sans text-white border-b border-white/10"
    >
      <div 
        className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none -z-0"
      />

      <div className="max-w-[1550px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center my-auto relative z-10">
        
        {/* Left Column (7 Cols) */}
        <motion.div 
          style={{ y: yContent, opacity: opacityContent }}
          className="lg:col-span-7 space-y-8"
        >
          {/* Slide Tag */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-none text-[10px] font-mono font-semibold uppercase tracking-[0.25em] bg-white/[0.04] border border-white/10 text-white/80">
              <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse" />
              <span>{slide.tag}</span>
            </span>
            <span className="bg-white text-black text-[9px] font-mono font-bold px-2.5 py-1 rounded-none uppercase tracking-wider">
              {slide.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[5.2rem] font-light tracking-[-0.04em] uppercase leading-[0.92] text-white font-mono">
            {slide.title}
          </h1>

          {/* Subtitle & Pricing */}
          <div className="space-y-3 border-l-2 border-white/20 pl-6">
            <div className="text-base sm:text-lg font-medium tracking-tight text-white/90">
              {slide.subtitle}
            </div>
            
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-tight">
                Rs. {slide.price.toLocaleString()} LKR
              </span>
              <span className="text-sm text-white/40 line-through font-mono">
                Rs. {slide.originalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 bg-white/10 text-white border border-white/15">
                SAVE RS. {(slide.originalPrice - slide.price).toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-white/50 font-mono tracking-wider uppercase">
              Cash on Delivery &bull; Direct Bank Transfer &bull; Free Delivery
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed max-w-xl">
            {slide.desc}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleQuickAdd}
              className="bg-white text-black hover:bg-white/90 px-9 sm:px-10 py-4 text-xs font-mono font-bold tracking-[0.18em] uppercase flex items-center gap-3 shadow-2xl cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span>ADD TO CART &bull; RS. {slide.price.toLocaleString()}</span>
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/products/${slide.productId}`}
                className="bg-transparent border border-white/20 hover:border-white text-white px-8 py-4 text-xs font-mono font-semibold tracking-[0.18em] uppercase flex items-center gap-2.5 transition-all"
              >
                <span>VIEW PRODUCT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-white/60 border-t border-white/10 font-mono">
            <div className="flex items-center gap-2.5 text-white/80">
              <Truck className="w-4 h-4 text-white" />
              <span>ISLANDWIDE DELIVERY (24–48 HOURS)</span>
            </div>
            <div className="flex items-center gap-2.5 text-white/80">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>7-DAY REPLACEMENT GUARANTEE</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Image Showcase (5 Cols) */}
        <div className="lg:col-span-5 relative flex flex-col items-center">
          
          <motion.div 
            ref={imageFrameRef}
            style={{ y: yImage, scale: scaleImage }}
            className="relative aspect-square w-full max-w-[500px] lg:max-w-[540px] bg-[#0B0B0B] p-8 sm:p-12 shadow-2xl border border-white/10 flex items-center justify-center overflow-hidden group"
          >
            {/* Viewfinder Tick Marks */}
            <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-white/30 z-20 pointer-events-none" />
            <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-white/30 z-20 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-white/30 z-20 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/30 z-20 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.92, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.04, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 540px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute top-5 left-5 bg-white text-black text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-1 pointer-events-none">
              {slide.badge}
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-[#050505]/80 backdrop-blur-md border border-white/10 px-4 py-2 flex items-center justify-between text-[9px] font-mono tracking-widest text-white/70 uppercase pointer-events-none">
              <span className="truncate">{slide.spec}</span>
              <span className="text-white font-bold shrink-0">{slide.rotation}</span>
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full max-w-[500px] lg:max-w-[540px] mt-6 px-2">
            <div className="flex items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 transition-all duration-300 cursor-pointer ${
                    currentSlide === idx 
                      ? "w-8 bg-white" 
                      : "w-3 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                className="w-10 h-10 bg-[#0B0B0B] border border-white/15 hover:border-white text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-10 h-10 bg-[#0B0B0B] border border-white/15 hover:border-white text-white flex items-center justify-center transition-colors cursor-pointer"
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
