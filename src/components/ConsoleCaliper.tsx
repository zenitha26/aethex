"use client";

import { useState, useId } from "react";
import { Check, Sliders, ArrowRight } from "lucide-react";
import { audioEngine } from "../lib/audio";
import { SITE_CONTACT } from "../constants";

interface ConsoleCaliperProps {
  onSelectVehicle?: (vehicle: string) => void;
}

interface VehiclePreset {
  name: string;
  diameter: number;
  depth: string;
}

const VEHICLE_PRESETS: VehiclePreset[] = [
  { name: "Honda Vezel / HR-V", diameter: 72, depth: "Deep (85mm)" },
  { name: "Toyota Premio / Allion", diameter: 75, depth: "Standard (75mm)" },
  { name: "Toyota Aqua / Prius", diameter: 70, depth: "Standard (70mm)" },
  { name: "Suzuki Swift / RS", diameter: 68, depth: "Compact (65mm)" },
  { name: "Suzuki Wagon R", diameter: 67, depth: "Compact (62mm)" },
  { name: "Toyota Hilux / D-Max", diameter: 82, depth: "Extra Deep (95mm)" },
  { name: "Nissan Leaf", diameter: 74, depth: "Standard (72mm)" },
];

export default function ConsoleCaliper({ onSelectVehicle }: ConsoleCaliperProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("Honda Vezel / HR-V");
  const [diameter, setDiameter] = useState<number>(72);
  const sliderId = useId();

  const handleSelectPreset = (preset: VehiclePreset) => {
    audioEngine.playSelect();
    setSelectedVehicle(preset.name);
    setDiameter(preset.diameter);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setDiameter(val);
    audioEngine.playDetent();
  };

  const handleOrder = () => {
    audioEngine.playAcquire();
    if (onSelectVehicle) {
      onSelectVehicle(selectedVehicle);
    } else {
      const text = encodeURIComponent(
        `Hi AETHEX, I verified fitment for my ${selectedVehicle} (${diameter}mm). I'd like to order the ASPOR A711 360° Console Mount (Rs. 2,990 + Delivery).`
      );
      window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${text}`, "_blank");
    }
  };

  // SVG representation calculations
  const isCompatible = diameter >= 64 && diameter <= 96;

  return (
    <div className="bg-white border border-gray-200 p-6 sm:p-10 lg:p-12 space-y-8 font-sans shadow-sm">
      
      {/* Customer Question First */}
      <div className="space-y-2 border-b border-gray-200 pb-6">
        <span className="text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase block font-semibold">
          FITMENT VERIFICATION
        </span>
        <h3 className="text-2xl sm:text-4xl font-light uppercase text-[#111111] tracking-tight">
          Will it fit my car?
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
          The ASPOR A711 expands from 65mm to 95mm to fit standard vehicle cup holders. 
          Select your vehicle model below to confirm compatibility.
        </p>
      </div>

      {/* Main Fitment Experience Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Vehicle Selector & Slider (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Vehicle Presets */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase text-gray-500 tracking-wider block font-semibold">
              WHAT DO YOU DRIVE?
            </label>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_PRESETS.map((p) => {
                const isSelected = selectedVehicle === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`px-3 py-2 text-left border text-[11px] font-mono transition-all cursor-pointer ${
                      isSelected
                        ? "bg-black text-white border-black font-semibold shadow-xs"
                        : "bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black"
                    }`}
                  >
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Console Diameter Slider */}
          <div className="space-y-3 bg-[#F9F9F9] p-5 border border-gray-200">
            <div className="flex justify-between items-center text-xs font-mono">
              <label htmlFor={sliderId} className="text-gray-600 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-gray-500" />
                <span>CONSOLE DIAMETER</span>
              </label>
              <span className="text-[#111111] font-bold text-sm">{diameter.toFixed(0)} MM</span>
            </div>

            <input
              id={sliderId}
              type="range"
              min="62"
              max="95"
              step="1"
              value={diameter}
              onChange={handleSliderChange}
              className="w-full accent-black bg-gray-200 h-1.5 rounded-none cursor-pointer focus:outline-none"
              aria-label="Console diameter slider"
            />

            <div className="flex justify-between text-[9px] font-mono text-gray-400">
              <span>62 MM</span>
              <span>75 MM (TYPICAL)</span>
              <span>95 MM</span>
            </div>
          </div>

          {/* Estimated Fit Verdict Box */}
          <div className="bg-[#F9F9F9] border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#111111] font-mono text-xs font-semibold uppercase tracking-wider">
                <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <span>ESTIMATED FIT: {isCompatible ? "100% COMPATIBLE" : "CHECK MEASUREMENT"}</span>
              </div>
              <p className="text-[11px] text-gray-600 font-light">
                {selectedVehicle} console well ({diameter}mm) is fully supported by the A711 expanding silicone lugs.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOrder}
              className="bg-black text-white hover:bg-neutral-800 transition-all px-7 py-3.5 rounded-full text-xs font-mono font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-md hover:scale-[1.03] active:scale-[0.97]"
            >
              <span>ORDER A711</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right Column: Clean Vector Representation (5 Cols) */}
        <div className="lg:col-span-5 border border-gray-200 bg-[#F9F9F9] p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-semibold">
            CUP-WELL CONTACT PREVIEW
          </div>

          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Outer Cup Wall */}
              <circle
                cx="100"
                cy="100"
                r={Math.min(90, 45 + ((diameter - 62) / 33) * 40)}
                fill="none"
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="2"
                strokeDasharray="4,2"
                className="transition-all duration-200"
              />

              {/* 3 Expanding Silicone Tension Lugs */}
              {[90, 210, 330].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const r = Math.min(88, 43 + ((diameter - 62) / 33) * 40);
                const x = 100 + r * Math.cos(rad);
                const y = 100 + r * Math.sin(rad);
                return (
                  <g key={i}>
                    <line
                      x1="100"
                      y1="100"
                      x2={x}
                      y2={y}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth="2"
                    />
                    <circle cx={x} cy={y} r="8" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
                  </g>
                );
              })}

              {/* Center Core */}
              <circle cx="100" cy="100" r="28" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="4" fill="#111111" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-mono text-[#111111] font-bold">{diameter} MM</span>
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">BORE WIDTH</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-gray-600 tracking-wider uppercase">
            3 High-Tension Silicone Friction Grips
          </div>
        </div>

      </div>

    </div>
  );
}
