"use client";

import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { Product } from "../types/product";
import { motion } from "framer-motion";
import { Sliders, Cpu, Palette } from "lucide-react";

export default function KeyboardBuilder() {
  const { addToCart } = useCartStore();
  const [switchType, setSwitchType] = useState("Silent Linear");
  const [keycapColor, setKeycapColor] = useState("Space Gray");
  const [caseStyle, setCaseStyle] = useState("Frosted Glass");

  // Options
  const switches = [
    { name: "Silent Linear", desc: "Smooth & Quiet", price: 0, color: "#a1a1a6" },
    { name: "Tactile Horizon", desc: "Balanced Tactile", price: 3000, color: "#ffffff" },
    { name: "Clicky Classic", desc: "Crisp Auditory", price: 4500, color: "#d4af37" },
  ];

  const keycaps = [
    { name: "Space Gray", desc: "Matte Anodized Gray", price: 0, color: "#3a3a3c" },
    { name: "Silver White", desc: "Clean Brushed Silver", price: 5000, color: "#eaeaea" },
    { name: "Champagne Gold", desc: "Premium Gold Accent", price: 7500, color: "#d4af37" },
  ];

  const cases = [
    { name: "Frosted Glass", desc: "Translucent Acrylic", price: 0, color: "rgba(255,255,255,0.06)" },
    { name: "Anodized Slate", desc: "Heavy Anodized Frame", price: 12000, color: "#1c1c1e" },
    { name: "Brushed Brass", desc: "Solid Weighted Brass", price: 18000, color: "#b3922e" },
  ];

  const basePrice = 45000;
  const switchPrice = switches.find((s) => s.name === switchType)?.price || 0;
  const keycapPrice = keycaps.find((k) => k.name === keycapColor)?.price || 0;
  const casePrice = cases.find((c) => c.name === caseStyle)?.price || 0;
  const totalPrice = basePrice + switchPrice + keycapPrice + casePrice;

  const getCaseStyles = () => {
    switch (caseStyle) {
      case "Anodized Slate":
        return { bg: "#1c1c1e", border: "rgba(255,255,255,0.12)" };
      case "Brushed Brass":
        return { bg: "#b3922e", border: "#d4af37" };
      case "Frosted Glass":
      default:
        return { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)" };
    }
  };

  const getKeycapColors = () => {
    switch (keycapColor) {
      case "Silver White":
        return { alpha: "#eaeaea", modifier: "#a1a1a6" };
      case "Champagne Gold":
        return { alpha: "#d4af37", modifier: "#8e6d15" };
      case "Space Gray":
      default:
        return { alpha: "#3a3a3c", modifier: "#1c1c1e" };
    }
  };

  const handleAddCustomToCart = () => {
    const customProduct: Product = {
      id: "custom-keyboard",
      title: "Aethex Custom Keyboard",
      description: `Custom configured mechanical board with ${switchType} switches, ${keycapColor} caps, and ${caseStyle} frame.`,
      price: totalPrice,
      source: "customizer",
      stock: 1
    };

    const colorString = `Switches: ${switchType}, Keycaps: ${keycapColor}, Case: ${caseStyle}`;
    addToCart(customProduct, 1, colorString);
  };

  const frame = getCaseStyles();
  const caps = getKeycapColors();

  return (
    <section className="py-24 border-t border-white/5 relative overflow-hidden" id="customizer">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs text-silver/60 uppercase tracking-widest font-bold border border-white/10 px-3 py-1 rounded-full">
            Laboratory
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-bold font-display mt-4 mb-2">
            Configure Your Centerpiece
          </h2>
          <p className="text-silver/60 text-sm max-w-xl mx-auto font-light leading-relaxed">
            Real-time anodization preview and tactile response selection. Custom assembled by hand.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Canvas (Cols 7) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 luxury-glass rounded-3xl min-h-[380px] relative">
            {/* Keyboard preview */}
            <motion.div
              animate={{
                backgroundColor: frame.bg,
                borderColor: frame.border,
              }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-[480px] aspect-[10/3.8] rounded-2xl p-4 border flex flex-col justify-between shadow-2xl relative z-10"
              style={{ borderWidth: "2px" }}
            >
              {/* Row 1 */}
              <div className="flex gap-1 flex-1 mb-1">
                <div style={{ backgroundColor: caps.modifier }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.alpha }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.alpha }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.alpha }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.alpha }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.alpha }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.modifier }} className="flex-[1.5] rounded-[4px] transition-colors duration-500" />
              </div>

              {/* Row 2 */}
              <div className="flex gap-1 flex-1 mb-1">
                <div style={{ backgroundColor: caps.modifier }} className="flex-[1.3] rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.alpha }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.alpha }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.alpha }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.alpha }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.alpha }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.modifier }} className="flex-[1.3] rounded-[4px] transition-colors duration-500" />
              </div>

              {/* Row 3 Spacebar */}
              <div className="flex gap-1 flex-1">
                <div style={{ backgroundColor: caps.modifier }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.modifier }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.alpha }} className="flex-[4] rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.modifier }} className="flex-1 rounded-[4px] transition-colors duration-500" />
                <div style={{ backgroundColor: caps.modifier }} className="flex-1 rounded-[4px] transition-colors duration-500" />
              </div>
            </motion.div>

            <span className="text-[10px] text-silver/30 uppercase tracking-widest mt-6 font-bold">
              Real-time Rendering &bull; {caseStyle} + {keycapColor}
            </span>
          </div>

          {/* Form Options (Cols 5) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Switches */}
            <div>
              <span className="text-silver/40 text-[10px] uppercase font-bold tracking-wider mb-3 block flex items-center gap-1.5">
                <Cpu className="h-3 w-3" /> 1. Select Switch Type
              </span>
              <div className="grid grid-cols-3 gap-2">
                {switches.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setSwitchType(item.name)}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                      switchType === item.name
                        ? "bg-white text-black border-white"
                        : "bg-white/[0.01] text-silver/60 border-white/5 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="block text-xs font-semibold">{item.name.split(" ")[0]}</span>
                    <span className="block text-[9px] opacity-60 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Keycaps */}
            <div>
              <span className="text-silver/40 text-[10px] uppercase font-bold tracking-wider mb-3 block flex items-center gap-1.5">
                <Palette className="h-3 w-3" /> 2. Select Keycaps
              </span>
              <div className="grid grid-cols-3 gap-2">
                {keycaps.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setKeycapColor(item.name)}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                      keycapColor === item.name
                        ? "bg-white text-black border-white"
                        : "bg-white/[0.01] text-silver/60 border-white/5 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="block text-xs font-semibold">{item.name.split(" ")[0]}</span>
                    <span className="block text-[9px] opacity-60 mt-0.5">+{item.price / 1000}k LKR</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Case */}
            <div>
              <span className="text-silver/40 text-[10px] uppercase font-bold tracking-wider mb-3 block flex items-center gap-1.5">
                <Sliders className="h-3 w-3" /> 3. Select Case Material
              </span>
              <div className="grid grid-cols-3 gap-2">
                {cases.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setCaseStyle(item.name)}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                      caseStyle === item.name
                        ? "bg-white text-black border-white"
                        : "bg-white/[0.01] text-silver/60 border-white/5 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="block text-xs font-semibold">{item.name.split(" ")[0]}</span>
                    <span className="block text-[9px] opacity-60 mt-0.5">+{item.price / 1000}k LKR</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total price and submit */}
            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-silver/40 uppercase tracking-widest block font-bold">Estimated Cost</span>
                <span className="text-white font-display text-xl font-bold tracking-tight">
                  {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(totalPrice)}
                </span>
              </div>
              <button
                onClick={handleAddCustomToCart}
                className="apple-btn text-xs"
                id="add-custom-build-btn"
              >
                Add Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
