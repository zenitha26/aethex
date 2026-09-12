"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Check, ShieldCheck, Truck, ExternalLink, RotateCw, Sparkles, Layers } from "lucide-react";
import { audioEngine } from "../lib/audio";
import Navbar from "./Navbar";
import CategoryDrawer from "./CategoryDrawer";
import WishlistDrawer from "./WishlistDrawer";
import CompareModal from "./CompareModal";
import QuickViewModal from "./QuickViewModal";
import CartDrawer from "./CartDrawer";
import CartToast from "./CartToast";
import MobileBottomBar from "./MobileBottomBar";
import StoreHero from "./StoreHero";
import ValueProps from "./ValueProps";
import CategoryGrid from "./CategoryGrid";
import DealsBanner from "./DealsBanner";
import StoreProductGrid from "./StoreProductGrid";
import ConsoleCaliper from "./ConsoleCaliper";
import InstallationDemoPlayer from "./InstallationDemoPlayer";
import BundleOffers from "./BundleOffers";
import DeliveryChecker from "./DeliveryChecker";
import CustomerReviews from "./CustomerReviews";
import FastOrderModal from "./FastOrderModal";
import Footer from "./Footer";
import { Product } from "../types/product";
import { SITE_CONTACT } from "../constants";
import { useCartStore } from "../store/useCartStore";

interface HomeClientProps {
  initialProducts: Product[];
}

export default function HomeClient({ initialProducts }: HomeClientProps) {
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("Honda Vezel / HR-V");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { selectedCategory, setSelectedCategory } = useCartStore();

  useEffect(() => {
    const handleGlobalOrder = (e: Event) => {
      e.preventDefault();
      setIsOrderModalOpen(true);
    };
    window.addEventListener("aethex:open-order", handleGlobalOrder);
    return () => window.removeEventListener("aethex:open-order", handleGlobalOrder);
  }, []);

  // Mechanical 3-Phase Showcase state
  const [activeMechPhase, setActiveMechPhase] = useState(0);

  const mechPhases = [
    {
      id: "rotation",
      tag: "FEATURE 01",
      title: "360° Full Ball Rotation",
      desc: "Instant one-handed rotation between vertical portrait GPS navigation and 90° wide highway radar mode.",
      image: "/images/a711/landscape_drive.jpg",
      spec: "360° Axis"
    },
    {
      id: "arm",
      tag: "FEATURE 02",
      title: "180° Adjustable Elevation Arm",
      desc: "Dual aluminum tension joints lift your phone up to 280mm, positioning controls in your natural field of view.",
      image: "/images/a711/studio_hardware.jpg",
      spec: "180° Reach"
    },
    {
      id: "base",
      tag: "FEATURE 03",
      title: "Secure Expanding Cup-Holder Fit",
      desc: "Knurled tension ring expands 3 silicone-dampened lugs (65mm–95mm) to lock firmly into your center console.",
      image: "/images/a711/macro_base.jpg",
      spec: "65–95mm Bore"
    }
  ];

  const handleOpenOrder = (vehicle?: string, quantity?: number) => {
    if (vehicle) setSelectedVehicle(vehicle);
    if (quantity) setSelectedQuantity(quantity);
    setIsOrderModalOpen(true);
  };

  const handleScrollToGrid = () => {
    const el = document.getElementById("products-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    handleScrollToGrid();
  };

  return (
    <div className="bg-[#F9F9F9] text-[#111111] min-h-screen font-sans selection:bg-black selection:text-white relative overflow-x-hidden">
      
      {/* 01 — FLOATING UNIFIED NAVIGATION HEADER */}
      <Navbar 
        onOpenCategories={() => setIsCategoryDrawerOpen(true)}
        onOpenOrder={() => handleOpenOrder()}
      />

      {/* MODALS & DRAWERS */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
      />
      <WishlistDrawer />
      <CompareModal />
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <CartDrawer />
      <CartToast />
      <MobileBottomBar
        onOpenCategories={() => setIsCategoryDrawerOpen(true)}
      />

      {/* 02 — HERO CAROUSEL / EDITORIAL SHOWCASE */}
      <StoreHero 
        onOpenOrder={() => handleOpenOrder()}
        onExploreProducts={handleScrollToGrid}
      />

      {/* 03 — TRUST & VALUE PROPOSITION BAR */}
      <ValueProps />

      {/* 04 — "PERFECT FOR EVERY SPACE" CURATED DEPARTMENTS (matching thi.lk) */}
      <CategoryGrid 
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
      />

      {/* 05 — FLASH DEALS / TOP DEALS COUNTDOWN BANNER (matching thi.lk) */}
      <div id="deals-section">
        <DealsBanner onShopDeals={handleScrollToGrid} />
      </div>

      {/* 06 — MULTI-TAB PRODUCT CATALOG (All Products, Top Deals, Fast Moving) */}
      <StoreProductGrid
        products={initialProducts}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* ========================================================================= */}
      {/* 07 — HARDWARE SPOTLIGHT: ASPOR A711 360° ARTICULATING MOUNT */}
      {/* ========================================================================= */}
      <section id="hardware-spotlight" className="py-24 px-6 sm:px-10 lg:px-12 border-t border-gray-200 bg-white text-[#111111]">
        <div className="max-w-[1500px] mx-auto space-y-16">
          
          <div className="space-y-2 border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase block font-semibold">
                FLAGSHIP SPOTLIGHT // AUTOMOTIVE GEAR
              </span>
              <h2 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-[#111111] mt-1 font-mono">
                ASPOR A711 Console Mount
              </h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono font-bold text-black block">Rs. 2,990 LKR</span>
              <span className="text-xs font-mono text-gray-600">Islandwide Cash on Delivery</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Phase Selector (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase font-semibold">
                MECHANICAL SPECIFICATIONS
              </div>

              <div className="space-y-3">
                {mechPhases.map((phase, index) => {
                  const isActive = activeMechPhase === index;
                  return (
                    <div
                      key={phase.id}
                      onClick={() => {
                        audioEngine.playSelect();
                        setActiveMechPhase(index);
                      }}
                      className={`p-6 border transition-all cursor-pointer shadow-xs ${
                        isActive
                          ? "bg-black border-black text-white shadow-md"
                          : "bg-[#F9F9F9] border-gray-200 text-gray-700 hover:border-black hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs mb-2">
                        <span className={`tracking-widest ${isActive ? "text-gray-300" : "text-gray-500"}`}>{phase.tag}</span>
                        <span className={`font-bold ${isActive ? "text-white" : "text-black"}`}>{phase.spec}</span>
                      </div>
                      <h3 className={`text-base font-medium uppercase mb-1 ${isActive ? "text-white" : "text-[#111111]"}`}>
                        {phase.title}
                      </h3>
                      <p className={`text-xs font-mono leading-relaxed font-light ${isActive ? "text-gray-300" : "text-gray-600"}`}>
                        {phase.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleOpenOrder("Universal", 1)}
                  className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-4 text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>ORDER ASPOR A711 (RS. 2,990)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Interactive Hardware Visual (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#F9F9F9] border border-gray-200 overflow-hidden shadow-lg">
                <Image
                  src={mechPhases[activeMechPhase].image}
                  alt={mechPhases[activeMechPhase].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover p-4 transition-all duration-700"
                />

                <div className="absolute top-4 right-4 bg-black text-white border border-black px-3 py-1.5 font-mono text-[10px] shadow-xs">
                  SPEC: {mechPhases[activeMechPhase].spec}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 08 — CENTER CONSOLE CALIPER TOOL */}
      <ConsoleCaliper />

      {/* 09 — 60-SECOND INSTALLATION DEMO */}
      <InstallationDemoPlayer />

      {/* 10 — BUNDLE VALUE OFFERS */}
      <BundleOffers onSelectBundle={(qty: number) => handleOpenOrder(undefined, qty)} />


      {/* 11 — ISLANDWIDE COURIER DELIVERY CHECKER */}
      <DeliveryChecker />

      {/* 12 — VERIFIED CUSTOMER REVIEWS & SOCIAL PROOF */}
      <CustomerReviews />

      {/* 13 — COMPREHENSIVE FOOTER */}
      <Footer />

      {/* 14 — FAST DIRECT ORDER MODAL */}
      <FastOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialVehicle={selectedVehicle}
        initialQuantity={selectedQuantity}
      />

    </div>
  );
}
