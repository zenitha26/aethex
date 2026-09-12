"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { audioEngine } from "../../lib/audio";
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  RotateCcw, 
  MoveDiagonal, 
  Shield, 
  Car, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { SITE_CONTACT } from "../../constants";

export default function AboutPage() {
  const [selectedVehicle, setSelectedVehicle] = useState("Honda Vezel");
  const playHover = () => audioEngine.playClick();
  const playSelect = () => audioEngine.playSelect();

  const vehicles = [
    { name: "Honda Vezel / HR-V", cupSize: "72mm Center Console Well", status: "100% Verified Fit", note: "Positions phone right beneath climate panel with zero louver blockage." },
    { name: "Toyota Premio / Allion", cupSize: "75mm Dual Console Well", status: "100% Verified Fit", note: "Solid expansion lock with room for second beverage container." },
    { name: "Toyota Aqua / Prius / Axio", cupSize: "68mm–74mm Console Well", status: "100% Verified Fit", note: "Articulating arm reaches natural eye level over low center tunnel." },
    { name: "Suzuki Swift / RS / Sport", cupSize: "70mm Console Well", status: "100% Verified Fit", note: "Vibration-free anchor even under aggressive city cornering." },
    { name: "Suzuki Wagon R / Spacia", cupSize: "66mm–72mm Console Well", status: "100% Verified Fit", note: "Elevates smartphone for high windshield seating visibility." },
    { name: "Nissan Leaf / X-Trail / e-Power", cupSize: "74mm Console Well", status: "100% Verified Fit", note: "Leaves electronic gear selector and parking brake 100% clear." },
    { name: "European (BMW, Benz, Audi)", cupSize: "68mm–80mm Console Well", status: "100% Verified Fit", note: "Rubberized lugs protect ambient cockpit piano black finish." },
    { name: "SUVs & Pickups (Hilux, D-Max)", cupSize: "78mm–86mm Deep Well", status: "100% Verified Fit", note: "280mm elevation reach climbs out of deep utility cup pockets." },
  ];

  const currentVehicleData = vehicles.find((v) => v.name === selectedVehicle) || vehicles[0];

  return (
    <div className="bg-white text-[#111111] min-h-screen font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main className="pt-32 md:pt-40 pb-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto space-y-28 md:space-y-36">
          
          {/* ========================================================= */}
          {/* 1. EDITORIAL MANIFESTO HEADER                             */}
          {/* ========================================================= */}
          <div className="space-y-6 max-w-4xl border-b border-gray-200 pb-16">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-gray-600 uppercase bg-gray-100 border border-gray-200 px-3 py-1 rounded-full font-semibold">
                01 // ARCHITECTURAL MANIFESTO
              </span>
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-semibold">
                AETHEX AUTOMOTIVE LABS
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.06em] leading-[1.05] uppercase text-[#111111]">
              PRECISION HARDWARE<br />FOR THE MODERN COCKPIT.
            </h1>

            <p className="text-xs md:text-sm font-light text-gray-600 uppercase tracking-widest max-w-2xl leading-relaxed">
              We design and curate essential vehicle accessories built on mechanical retention, unshakeable stability, and driver-centric ergonomics.
            </p>
          </div>

          {/* ========================================================= */}
          {/* 2. THE GENESIS & PROBLEM SOLVED                          */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block font-semibold">
                02 // THE GENESIS
              </span>
              
              <h2 className="text-3xl md:text-5xl font-light tracking-[0.08em] uppercase text-[#111111] leading-tight">
                WHY WE BUILT<br />AETHEX AUTOMOTIVE
              </h2>

              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light">
                Sri Lankan drivers face unique challenges: tropical sun temperatures exceeding 35°C that melt windshield suction cups, and rough, winding terrain from Kadugannawa to Nuwara Eliya that shakes ordinary mounts loose.
              </p>

              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light">
                Vent clips were never designed to support modern 240g+ smartphones without snapping delicate horizontal louvers. We engineered our catalog around an unshakeable mechanical anchor: your vehicle&apos;s center console cup well.
              </p>

              <div className="pt-2">
                <Link
                  href="/products/aspor-a711"
                  onMouseEnter={playHover}
                  onClick={playSelect}
                  className="text-xs font-mono uppercase tracking-widest font-bold text-black underline underline-offset-4 hover:text-neutral-700"
                >
                  EXPLORE DROP 01: ASPOR A711 &rarr;
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-[4/3] w-full bg-[#F9F9F9] border border-gray-200 rounded-3xl overflow-hidden group shadow-sm">
              <Image
                src="/images/a711/cockpit_matte.jpg"
                alt="AETHEX Automotive Cockpit View"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[9px] font-mono tracking-[0.2em] text-[#111111] bg-white/90 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold shadow-xs">
                <span>IN-SITU INTEGRATION STUDY</span>
                <span className="text-gray-500">SRI LANKA FIELD TEST</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. INTERACTIVE VEHICLE COMPATIBILITY GUIDE               */}
          {/* ========================================================= */}
          <div className="border-t border-gray-200 pt-20 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase block font-semibold">
                  03 // VEHICLE INTEGRATION INDEX
                </span>
                <h3 className="text-3xl md:text-5xl font-light tracking-[0.08em] uppercase text-[#111111]">
                  SRI LANKA COMPATIBILITY GUIDE
                </h3>
              </div>
              <p className="text-xs font-mono text-gray-600 uppercase tracking-wider max-w-xs">
                Select your vehicle to verify precision cup-well anchor fit.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Selector List */}
              <div className="lg:col-span-5 space-y-2">
                {vehicles.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => {
                      playSelect();
                      setSelectedVehicle(v.name);
                    }}
                    onMouseEnter={playHover}
                    className={`w-full p-4 text-left border rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      selectedVehicle === v.name
                        ? "bg-black border-black text-white shadow-sm"
                        : "bg-[#F9F9F9] border-gray-200 text-gray-700 hover:border-black hover:text-black"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Car className={`w-4 h-4 ${selectedVehicle === v.name ? "text-white" : "text-gray-500"}`} />
                      <span className="text-xs font-mono tracking-wider uppercase font-semibold">
                        {v.name}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        selectedVehicle === v.name ? "text-white translate-x-1" : "text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Right Detail Card */}
              <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-8 md:p-12 space-y-8 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase font-semibold">
                      VERIFIED PLATFORM
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {currentVehicleData.status}
                    </span>
                  </div>

                  <h4 className="text-2xl md:text-3xl font-light uppercase tracking-wider text-[#111111]">
                    {currentVehicleData.name}
                  </h4>

                  <p className="text-xs text-gray-600 font-mono leading-relaxed">
                    {currentVehicleData.note}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-200 py-6 text-xs font-mono">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">CONSOLE SPEC</span>
                    <span className="text-[#111111] font-bold">{currentVehicleData.cupSize}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">BASE COMPATIBILITY</span>
                    <span className="text-[#111111] font-bold">65mm – 95mm Adjustable</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[10px] font-mono text-gray-500 uppercase font-semibold">
                    PRICE: <span className="text-[#111111] font-bold">RS. 2,990 LKR</span>
                  </div>

                  <a
                    href={`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello AETHEX, I drive a ${currentVehicleData.name} and want to order the ASPOR A711 car phone holder (Rs. 2,990).`)}`}
                    className="bg-black text-white py-3 px-6 rounded-full text-xs font-mono uppercase tracking-widest font-bold hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                  >
                    <span>ORDER FOR {currentVehicleData.name.split(" ")[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. THE 4 AETHEX GUARANTEES                                */}
          {/* ========================================================= */}
          <div className="border-t border-gray-200 pt-20 space-y-12">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block mb-2 font-semibold">
                04 // LOGISTICS & ASSURANCE
              </span>
              <h3 className="text-3xl md:text-5xl font-light tracking-[0.1em] uppercase text-[#111111]">
                THE 4 DRIVER GUARANTEES
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "24–48h Dispatch",
                  desc: "Orders verified via WhatsApp are handed to islandwide courier partners within 24 hours.",
                  icon: Truck,
                  tag: "SPEED"
                },
                {
                  title: "Cash On Delivery",
                  desc: "Inspect the factory-sealed packaging upon arrival at your doorstep before paying.",
                  icon: ShieldCheck,
                  tag: "SECURITY"
                },
                {
                  title: "7-Day Replacement",
                  desc: "Instant defect replacement guarantee if your unit sustains mechanical faults.",
                  icon: Shield,
                  tag: "WARRANTY"
                },
                {
                  title: "Direct WhatsApp",
                  desc: "Real human automotive customer service on +94 78 234 9954 for tracking and support.",
                  icon: Sparkles,
                  tag: "SUPPORT"
                }
              ].map((g) => {
                const Icon = g.icon;
                return (
                  <div key={g.title} className="bg-[#F9F9F9] border border-gray-200 p-8 rounded-2xl space-y-4 hover:border-black shadow-xs transition-all">
                    <div className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center shadow-xs">
                      <Icon className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase block font-semibold">
                      {g.tag}
                    </span>
                    <h4 className="text-base font-semibold uppercase tracking-wider text-[#111111]">
                      {g.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-light">
                      {g.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. HARDWARE BLUEPRINT ROADMAP                             */}
          {/* ========================================================= */}
          <div className="border-t border-gray-200 pt-20 space-y-12">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block mb-2 font-semibold">
                05 // FUTURE BLUEPRINT
              </span>
              <h3 className="text-3xl md:text-5xl font-light tracking-[0.1em] uppercase text-[#111111]">
                HARDWARE ROADMAP
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-black p-8 rounded-2xl space-y-4 relative shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-white bg-black px-2.5 py-0.5 rounded-full font-bold uppercase">
                    ACTIVE DROP 01
                  </span>
                  <span className="text-xs font-mono text-[#111111] font-bold">RS. 2,990</span>
                </div>
                <h4 className="text-xl font-semibold uppercase tracking-wider text-[#111111]">ASPOR A711</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  360° Ball Swivel + 180° Articulating Arm + 65–95mm Expandable Base. In stock and shipping islandwide.
                </p>
                <div className="pt-2">
                  <Link href="/products/aspor-a711" className="text-xs font-mono uppercase tracking-widest font-bold text-black underline underline-offset-4 hover:text-neutral-700">
                    VIEW SPECIFICATIONS &rarr;
                  </Link>
                </div>
              </div>

              <div className="bg-[#F9F9F9] border border-gray-200 p-8 rounded-2xl space-y-4 shadow-xs">
                <span className="text-[9px] font-mono text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full uppercase font-semibold">
                  DROP 02 // Q4 2026
                </span>
                <h4 className="text-xl font-semibold uppercase tracking-wider text-[#111111]">MAG-COCKPIT PRO</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  Qi2 15W Magnetic Wireless Charging Cup-Well Mount with active thermoelectric cooling chamber.
                </p>
                <span className="text-[9px] font-mono text-gray-500 uppercase block font-semibold">IN PROTOTYPE TESTING</span>
              </div>

              <div className="bg-[#F9F9F9] border border-gray-200 p-8 rounded-2xl space-y-4 shadow-xs">
                <span className="text-[9px] font-mono text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full uppercase font-semibold">
                  DROP 03 // Q1 2027
                </span>
                <h4 className="text-xl font-semibold uppercase tracking-wider text-[#111111]">AERO-CLIP 01</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  CNC-machined anodized aircraft aluminum low-profile magnetic vent grip for compact dashboards.
                </p>
                <span className="text-[9px] font-mono text-gray-500 uppercase block font-semibold">CONCEPT BLUEPRINT</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 6. BOTTOM CALL TO ACTION                                 */}
          {/* ========================================================= */}
          <div className="border-t border-gray-200 pt-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-[#F9F9F9] p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm">
            <div className="space-y-2">
              <span className="text-[9px] font-mono tracking-[0.3em] text-gray-500 uppercase block font-semibold">
                AETHEX / AUTOMOTIVE SPEC 711
              </span>
              <h4 className="text-2xl md:text-4xl font-light uppercase tracking-wider text-[#111111]">
                UPGRADE YOUR DRIVE TODAY
              </h4>
              <p className="text-xs font-mono text-gray-600">
                Now shipping across all 25 districts of Sri Lanka • Cash on Delivery Available
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <a
                href={`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello AETHEX Automotive, I would like to order the ASPOR A711 360° Car Phone Holder (Rs. 2,990).")}`}
                className="w-full sm:w-auto bg-black text-white py-4 px-9 rounded-full text-xs uppercase tracking-[0.25em] font-bold hover:bg-neutral-800 transition-all text-center cursor-pointer shadow-sm"
              >
                ORDER VIA WHATSAPP
              </a>

              <Link
                href="/products/aspor-a711"
                className="w-full sm:w-auto bg-white border border-gray-300 text-black py-4 px-8 rounded-full text-xs uppercase tracking-[0.25em] font-bold hover:border-black transition-all text-center shadow-xs"
              >
                VIEW PRODUCT DETAILS
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}