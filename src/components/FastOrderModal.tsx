"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ShieldCheck } from "lucide-react";
import { SITE_CONTACT } from "../constants";

interface FastOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicle?: string;
  initialQuantity?: number;
  productTitle?: string;
  unitPrice?: number;
  productImage?: string;
}

const SRI_LANKA_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

const POPULAR_VEHICLES = [
  "Honda Vezel / HR-V",
  "Toyota Premio / Allion",
  "Toyota Aqua / Prius",
  "Suzuki Swift / RS",
  "Suzuki Wagon R",
  "Toyota Hilux / D-Max",
  "Nissan Leaf",
  "Other Vehicle",
];

export default function FastOrderModal({
  isOpen,
  onClose,
  initialVehicle = "Honda Vezel / HR-V",
  initialQuantity = 1,
  productTitle = "ASPOR A711 360° Console Mount",
  unitPrice = 2990,
}: FastOrderModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [customVehicle, setCustomVehicle] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("Colombo");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialVehicle) setVehicle(initialVehicle);
  }, [initialVehicle]);

  useEffect(() => {
    if (initialQuantity) setQuantity(initialQuantity);
  }, [initialQuantity]);

  if (!isOpen) return null;

  // Pricing calculation
  const getPricing = () => {
    if (quantity === 1) {
      return { total: unitPrice, deliveryText: "+ Delivery (Rs. 350)", freeDelivery: false };
    }
    if (quantity === 2) {
      return { total: unitPrice * 2 - 490, deliveryText: "Free Delivery (Duo Pack)", freeDelivery: true };
    }
    return { total: unitPrice * quantity - 980, deliveryText: "Free Delivery (Multi-Pack)", freeDelivery: true };
  };

  const pricing = getPricing();

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setError("Please enter a valid phone or WhatsApp number.");
      return;
    }

    const selectedCar = vehicle === "Other Vehicle" && customVehicle.trim() ? customVehicle.trim() : vehicle;

    const message = `Hi AETHEX Store,

I'd like to order:
${productTitle}
Quantity: ${quantity}
Car Model: ${selectedCar}
Name: ${name.trim()}
District: ${district}

Total: Rs. ${pricing.total.toLocaleString()} LKR ${pricing.freeDelivery ? "(Free Delivery)" : "(+ Delivery)"}
Payment: Cash on Delivery / Direct Bank Transfer

Please confirm availability and delivery.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-[#0B0B0B] border border-white/10 p-6 sm:p-8 space-y-6 text-white font-sans relative shadow-2xl"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="text-[9px] font-mono tracking-[0.25em] text-white/50 uppercase font-semibold">
                QUICK ORDER
              </div>
              <h2 className="text-xl sm:text-2xl font-light tracking-wide uppercase text-white font-mono mt-1">
                Order via WhatsApp
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white p-1 transition-colors cursor-pointer"
              aria-label="Close order modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {error && (
              <div className="text-red-400 bg-red-950/40 border border-red-800/60 p-2.5 text-[11px]">
                {error}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-white/50 tracking-wider block font-semibold">
                QUANTITY
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 border border-white/20 hover:border-white flex items-center justify-center text-base font-bold bg-[#050505] text-white transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="w-12 text-center text-base font-mono text-white font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 border border-white/20 hover:border-white flex items-center justify-center text-base font-bold bg-[#050505] text-white transition-colors cursor-pointer"
                >
                  +
                </button>
                <span className="text-[10px] text-white/50 pl-2">
                  {quantity === 2 ? "Duo Pack (Free Delivery)" : quantity >= 3 ? "Multi-Pack (Free Delivery)" : "Single Unit"}
                </span>
              </div>
            </div>

            {/* Vehicle Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-white/50 tracking-wider block font-semibold">
                YOUR CAR MODEL (FOR FITMENT CHECK)
              </label>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full bg-[#050505] border border-white/15 text-white p-3 text-xs outline-none focus:border-white cursor-pointer"
              >
                {POPULAR_VEHICLES.map((v) => (
                  <option key={v} value={v} className="bg-[#050505] text-white">
                    {v}
                  </option>
                ))}
              </select>

              {vehicle === "Other Vehicle" && (
                <input
                  type="text"
                  placeholder="Enter your vehicle make & model"
                  value={customVehicle}
                  onChange={(e) => setCustomVehicle(e.target.value)}
                  className="w-full bg-[#050505] border border-white/15 text-white p-3 text-xs outline-none focus:border-white mt-2"
                />
              )}
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-white/50 tracking-wider block font-semibold">
                YOUR NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Kasun Perera"
                value={name}
                onChange={(e) => {
                  setError("");
                  setName(e.target.value);
                }}
                className="w-full bg-[#050505] border border-white/15 text-white p-3 text-xs outline-none focus:border-white"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-white/50 tracking-wider block font-semibold">
                PHONE / WHATSAPP NUMBER
              </label>
              <input
                type="tel"
                placeholder="e.g. 077 123 4567"
                value={phone}
                onChange={(e) => {
                  setError("");
                  setPhone(e.target.value);
                }}
                className="w-full bg-[#050505] border border-white/15 text-white p-3 text-xs outline-none focus:border-white"
              />
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-white/50 tracking-wider block font-semibold">
                DELIVERY DISTRICT
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#050505] border border-white/15 text-white p-3 text-xs outline-none focus:border-white cursor-pointer"
              >
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d} value={d} className="bg-[#050505] text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Summary */}
            <div className="border-t border-white/10 pt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">TOTAL:</span>
                <span className="text-white font-bold text-sm">
                  Rs. {pricing.total.toLocaleString()} LKR
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-white/50">
                <span>DELIVERY:</span>
                <span className={pricing.freeDelivery ? "text-emerald-400 font-medium" : "text-white/70"}>
                  {pricing.deliveryText}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/90 transition-all py-3.5 text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer mt-4 shadow-lg"
            >
              <span>Order via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[9px] text-white/40 pt-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-white/60" />
              <span>Cash on Delivery & Bank Transfer • 7-Day Replacement</span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
