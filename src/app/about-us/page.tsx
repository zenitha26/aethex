"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CategoryDrawer from "../../components/CategoryDrawer";
import CartDrawer from "../../components/CartDrawer";
import CartToast from "../../components/CartToast";
import WishlistDrawer from "../../components/WishlistDrawer";
import MobileBottomBar from "../../components/MobileBottomBar";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { audioEngine } from "../../lib/audio";
import AethexLogo from "../../components/brand/AethexLogo";
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Car, 
  Sparkles,
  Layers,
  Cpu,
  Compass,
  Sliders,
  Landmark
} from "lucide-react";
import { SITE_CONTACT } from "../../constants";

export default function AboutPage() {
  const [selectedVehicle, setSelectedVehicle] = useState("Honda Vezel / HR-V");
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  const playHover = () => { try { audioEngine.playClick(); } catch {} };
  const playSelect = () => { try { audioEngine.playSelect(); } catch {} };

  const vehicles = [
    { 
      name: "Honda Vezel / HR-V", 
      cupSize: "72mm Center Console Well", 
      status: "100% Verified Fit", 
      note: "Positions smartphone directly beneath the lower climate fascia with zero HVAC louver obstruction." 
    },
    { 
      name: "Toyota Premio / Allion", 
      cupSize: "75mm Dual Console Well", 
      status: "100% Verified Fit", 
      note: "Triple expanding lugs lock into cup chamber while retaining clearance for secondary beverage well." 
    },
    { 
      name: "Toyota Aqua / Prius / Axio", 
      cupSize: "68mm–74mm Console Well", 
      status: "100% Verified Fit", 
      note: "Dual articulating aluminum arm elevates phone 280mm into natural eye level above low center tunnel." 
    },
    { 
      name: "Suzuki Swift / RS / Sport", 
      cupSize: "70mm Console Well", 
      status: "100% Verified Fit", 
      note: "Zero vibration anchor maintains unwavering horizon line even under high-G urban cornering." 
    },
    { 
      name: "Suzuki Wagon R / Spacia", 
      cupSize: "66mm–72mm Console Well", 
      status: "100% Verified Fit", 
      note: "Elevated dual-joint reach matches high-rake windshield sightlines without glass suction failures." 
    },
    { 
      name: "Nissan Leaf / X-Trail / e-Power", 
      cupSize: "74mm Console Well", 
      status: "100% Verified Fit", 
      note: "Keeps drive selector joystick and electronic parking brake 100% accessible." 
    },
    { 
      name: "European (BMW, Benz, Audi)", 
      cupSize: "68mm–80mm Console Well", 
      status: "100% Verified Fit", 
      note: "High-friction silicone contact pads safeguard high-gloss piano black cockpit trim from abrasions." 
    },
    { 
      name: "SUVs & Utility (Hilux, D-Max)", 
      cupSize: "78mm–86mm Deep Well", 
      status: "100% Verified Fit", 
      note: "280mm elevation arc climbs out of extra-deep industrial console wells effortlessly." 
    },
  ];

  const currentVehicleData = vehicles.find((v) => v.name === selectedVehicle) || vehicles[0];

  const pillars = [
    {
      num: "01",
      title: "Mechanical Retention",
      desc: "Windshield suction cups degrade in 35°C tropical heat. AC vent clips snap brittle plastic louvers. We build strictly around expandable mechanical cup-well anchors with high-tensile internal worm gears.",
      icon: Sliders
    },
    {
      num: "02",
      title: "Zero Line-of-Sight Blockage",
      desc: "Windshield clutter violates driver sightlines and creates dangerous blind spots. AETHEX hardware keeps glass 100% clear by cantilevering your display upward from the center tunnel to steering level.",
      icon: Compass
    },
    {
      num: "03",
      title: "Aerospace-Grade Materials",
      desc: "Crafted using reinforced polycarbonate, structural zinc alloys, and Grade 5 titanium fasteners. Built to withstand tropical humidity, road vibration, and extreme temperature cycling without fatigue.",
      icon: Layers
    },
    {
      num: "04",
      title: "Direct Bank Wire Settlement",
      desc: "Streamlined manual bank transfer verification paired with express insured courier dispatch. Direct human order confirmation on WhatsApp with zero third-party payment gateway friction.",
      icon: Landmark
    }
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-white selection:text-black relative overflow-x-hidden">
      <Navbar onOpenCategories={() => setIsCategoryDrawerOpen(true)} />

      {/* Global Modals & Drawers */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        onSelectCategory={() => {}}
        selectedCategory="All"
      />
      <CartDrawer />
      <CartToast />
      <WishlistDrawer />

      <main className="pt-32 md:pt-44 pb-28 px-6 sm:px-10 lg:px-16">
        <div className="max-w-[1500px] mx-auto space-y-32 md:space-y-44">
          
          {/* ========================================================= */}
          {/* 1. EDITORIAL MANIFESTO HEADER                             */}
          {/* ========================================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 max-w-5xl border-b border-white/10 pb-20"
          >
            <div className="flex flex-wrap items-center gap-4">
              <AethexLogo size="lg" showWordmark={false} isLink={false} />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-[0.3em] text-white/70 uppercase font-semibold">
                  01 // ARCHITECTURAL MANIFESTO
                </span>
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase font-semibold">
                  AETHEX AUTOMOTIVE & HARDWARE LABS
                </span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-[-0.03em] leading-[0.96] uppercase text-white font-mono">
              PRECISION HARDWARE<br />
              <span className="text-white/40">FOR THE COCKPIT.</span>
            </h1>

            <p className="text-sm md:text-base font-light text-white/60 tracking-wider max-w-3xl leading-relaxed">
              We design and curate uncompromising vehicle cockpit mounts, lossless acoustic drivers, and commercial-grade power stations. Engineered on mechanical retention, unshakeable road stability, and driver-centric ergonomics.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/10">
              <div>
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white block">0.02mm</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Machining Tolerance</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white block">65–95mm</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Bore Expansion</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white block">24–48h</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Express Islandwide</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white block">100%</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Physical Inspection</span>
              </div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* 2. THE GENESIS & FIELD ENGINEERING                        */}
          {/* ========================================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
          >
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block font-semibold">
                02 // THE GENESIS & FIELD STUDY
              </span>
              
              <h2 className="text-3xl md:text-5xl font-light tracking-tight uppercase text-white leading-tight font-mono">
                WHY WE FOUNDED<br />
                <span className="text-white/50">AETHEX STORE</span>
              </h2>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                Sri Lankan drivers endure demanding road conditions: intense tropical cabin temperatures exceeding 38°C that melt silicone suction pads off windshields, combined with rugged mountain ascents from Kadugannawa to Nuwara Eliya that violently dislodge conventional friction clamps.
              </p>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                AC vent louvers were never designed to hold 240-gram smartphones without fracturing thin interior plastics. We eliminated adhesives and suction cups entirely, grounding our engineering on the strongest structural anchor inside any vehicle: your center console cup well.
              </p>

              <div className="pt-4 flex items-center gap-6">
                <Link
                  href="/product/aspor-a711"
                  onMouseEnter={playHover}
                  onClick={playSelect}
                  className="bg-white text-black hover:bg-white/90 px-8 py-4 text-xs font-mono font-bold tracking-[0.16em] uppercase flex items-center gap-3 rounded-full transition-all cursor-pointer shadow-2xl"
                >
                  <span>ACQUIRE ASPOR A711</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/product/aethex-magdrive"
                  onMouseEnter={playHover}
                  onClick={playSelect}
                  className="text-xs font-mono uppercase tracking-widest font-semibold text-white/70 hover:text-white border-b border-white/20 pb-1 hover:border-white transition-all"
                >
                  MAGDRIVE QI2 PRO &rarr;
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-[4/3] w-full bg-[#0B0B0B] border border-white/10 rounded-3xl overflow-hidden group shadow-2xl">
              <Image
                src="/images/a711/cockpit_matte.jpg"
                alt="AETHEX Automotive Cockpit View"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-white bg-[#0B0B0B]/80 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl font-semibold shadow-xl">
                <span>IN-SITU TELEMETRY STUDY</span>
                <span className="text-white/50">SRI LANKA FIELD BENCHMARK</span>
              </div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* 3. THE 4 ARCHITECTURAL PILLARS                            */}
          {/* ========================================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/10 pt-24 space-y-14"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase block font-semibold">
                03 // CORE PHILOSOPHY
              </span>
              <h3 className="text-3xl md:text-5xl font-light tracking-tight uppercase text-white font-mono">
                THE FOUR HARDWARE PILLARS
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <div 
                    key={p.num}
                    className="p-8 bg-[#0B0B0B] border border-white/10 rounded-3xl space-y-5 hover:border-white/30 hover:bg-[#111111] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between font-mono text-xs text-white/40">
                        <span className="font-bold">{p.num}</span>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-base font-semibold uppercase tracking-wider text-white">
                        {p.title}
                      </h4>
                      <p className="text-xs text-white/60 leading-relaxed font-light">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* 4. INTERACTIVE VEHICLE COMPATIBILITY GUIDE               */}
          {/* ========================================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/10 pt-24 space-y-12"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase block font-semibold">
                  04 // VEHICLE INTEGRATION INDEX
                </span>
                <h3 className="text-3xl md:text-5xl font-light tracking-tight uppercase text-white font-mono">
                  VERIFIED VEHICLE FITMENT
                </h3>
              </div>
              <p className="text-xs font-mono text-white/50 uppercase tracking-wider max-w-sm">
                Select your chassis to verify precision console cup-well retention and sightline ergonomics.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Selector List */}
              <div className="lg:col-span-5 space-y-2">
                {vehicles.map((v) => {
                  const isSelected = selectedVehicle === v.name;
                  return (
                    <button
                      key={v.name}
                      onClick={() => {
                        playSelect();
                        setSelectedVehicle(v.name);
                      }}
                      onMouseEnter={playHover}
                      className={`w-full p-4 text-left border rounded-2xl transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-white border-white text-black shadow-xl"
                          : "bg-[#0B0B0B] border-white/10 text-white/70 hover:border-white/30 hover:text-white hover:bg-[#111111]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Car className={`w-4 h-4 ${isSelected ? "text-black" : "text-white/50"}`} />
                        <span className="text-xs font-mono tracking-wider uppercase font-semibold">
                          {v.name}
                        </span>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? "text-black translate-x-1" : "text-white/20"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right Detail Card */}
              <div className="lg:col-span-7 bg-[#0B0B0B] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase font-semibold">
                      VERIFIED PLATFORM
                    </span>
                    <span className="text-[10px] font-mono text-white bg-white/10 border border-white/20 px-3.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      {currentVehicleData.status}
                    </span>
                  </div>

                  <h4 className="text-2xl md:text-3xl font-light uppercase tracking-wider text-white font-mono">
                    {currentVehicleData.name}
                  </h4>

                  <p className="text-xs sm:text-sm text-white/70 font-mono leading-relaxed font-light">
                    {currentVehicleData.note}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 border-t border-b border-white/10 py-6 text-xs font-mono">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold mb-1">CONSOLE SPEC</span>
                    <span className="text-white font-bold text-sm sm:text-base">{currentVehicleData.cupSize}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold mb-1">BASE COMPATIBILITY</span>
                    <span className="text-white font-bold text-sm sm:text-base">65mm – 95mm Adjustable</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="text-[11px] font-mono text-white/60">
                    ACQUISITION PRICE: <span className="text-white font-bold text-base ml-1">RS. 2,990 LKR</span>
                  </div>

                  <Link
                    href="/product/aspor-a711"
                    onClick={playSelect}
                    className="bg-white text-black py-3.5 px-8 rounded-full text-xs font-mono uppercase tracking-widest font-bold hover:bg-white/90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                  >
                    <span>ACQUIRE FOR {currentVehicleData.name.split(" ")[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* 5. LOGISTICS & DIRECT WIRE ASSURANCE                     */}
          {/* ========================================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/10 pt-24 space-y-12"
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-2 font-semibold">
                05 // LOGISTICS & ASSURANCE
              </span>
              <h3 className="text-3xl md:text-5xl font-light tracking-tight uppercase text-white font-mono">
                THE 4 DRIVER GUARANTEES
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "24–48h Dispatch",
                  desc: "Orders verified via Direct Bank Transfer or COD are packed in insured packaging and handed to express dispatch within 24 hours.",
                  icon: Truck,
                  tag: "SPEED"
                },
                {
                  title: "Direct Bank Transfer",
                  desc: "Frictionless direct bank wire settlement with instant AI OCR slip verification and automated order reconciliation.",
                  icon: Landmark,
                  tag: "SETTLEMENT"
                },
                {
                  title: "7-Day Replacement",
                  desc: "Comprehensive 7-day inspection guarantee. If your unit experiences mechanical fault, we issue an immediate replacement unit.",
                  icon: ShieldCheck,
                  tag: "WARRANTY"
                },
                {
                  title: "Direct WhatsApp Line",
                  desc: "Real human hardware engineering support on +94 78 234 9954 for live vehicle fitment advice and dispatch tracking.",
                  icon: Sparkles,
                  tag: "SUPPORT"
                }
              ].map((g) => {
                const Icon = g.icon;
                return (
                  <div key={g.title} className="bg-[#0B0B0B] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-white/30 transition-all">
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block font-semibold">
                      {g.tag}
                    </span>
                    <h4 className="text-base font-semibold uppercase tracking-wider text-white">
                      {g.title}
                    </h4>
                    <p className="text-xs text-white/60 leading-relaxed font-light">
                      {g.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* 6. BOTTOM CALL TO ACTION                                 */}
          {/* ========================================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border border-white/10 p-10 md:p-16 rounded-3xl bg-[#0B0B0B] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase block font-semibold">
                AETHEX / CURATED 10-PIECE DROP
              </span>
              <h4 className="text-2xl md:text-4xl font-light uppercase tracking-tight text-white font-mono">
                UPGRADE YOUR HARDWARE ECOSYSTEM
              </h4>
              <p className="text-xs font-mono text-white/50">
                Direct Bank Transfer & Cash On Delivery • Shipping Across All 25 Districts
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <Link
                href="/product/aspor-a711"
                className="w-full sm:w-auto bg-white text-black py-4 px-9 rounded-full text-xs uppercase tracking-[0.2em] font-mono font-bold hover:bg-white/90 transition-all text-center cursor-pointer shadow-xl"
              >
                ACQUIRE DROP 01
              </Link>

              <Link
                href="/#products-grid"
                className="w-full sm:w-auto bg-transparent border border-white/20 text-white py-4 px-8 rounded-full text-xs uppercase tracking-[0.2em] font-mono font-semibold hover:border-white transition-all text-center"
              >
                EXPLORE 10-PIECE CATALOG
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      <MobileBottomBar onOpenCategories={() => setIsCategoryDrawerOpen(true)} />
      <Footer />
    </div>
  );
}