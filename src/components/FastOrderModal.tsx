"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { audioEngine } from "../lib/audio";
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
      return { total: 2990, deliveryText: "+ Delivery (Rs. 350)", freeDelivery: false };
    }
    if (quantity === 2) {
      return { total: 5490, deliveryText: "FREE DELIVERY (Duo Pack Savings)", freeDelivery: true };
    }
    return { total: 7990 + (quantity - 3) * 2600, deliveryText: "FREE DELIVERY (Family/Fleet Savings)", freeDelivery: true };
  };

  const pricing = getPricing();

  const handleQuantityChange = (delta: number) => {
    audioEngine.playDetent();
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

    audioEngine.playAcquire();

    const selectedCar = vehicle === "Other Vehicle" && customVehicle.trim() ? customVehicle.trim() : vehicle;

    // Clean, courteous WhatsApp message format matching Section 16
    const message = `Hi AETHEX,

I'd like to order:
ASPOR A711
Quantity: ${quantity}
Vehicle: ${selectedCar}
Name: ${name.trim()}
District: ${district}

Total: Rs. ${pricing.total.toLocaleString()} LKR ${pricing.freeDelivery ? "(Free Delivery)" : "(+ Delivery)"}
Payment: Cash on Delivery

Please confirm availability and delivery.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 text-[#111111] font-sans relative shadow-2xl"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <div className="text-[9px] font-mono tracking-[0.25em] text-gray-500 uppercase font-semibold">
                DIRECT WHATSAPP DISPATCH
              </div>
              <h2 className="text-xl sm:text-2xl font-light tracking-wide uppercase text-[#111111] mt-1">
                Order ASPOR A711
              </h2>
            </div>
            <button
              onClick={() => {
                audioEngine.playClick();
                onClose();
              }}
              className="text-gray-400 hover:text-black p-1 transition-colors cursor-pointer"
              aria-label="Close order modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {error && (
              <div className="text-red-700 bg-red-50 border border-red-200 p-2.5 text-[11px]">
                {error}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-gray-500 tracking-wider block font-semibold">
                QUANTITY
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 border border-gray-300 hover:border-black flex items-center justify-center text-base font-bold bg-white text-black transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="w-12 text-center text-base font-mono text-[#111111] font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 border border-gray-300 hover:border-black flex items-center justify-center text-base font-bold bg-white text-black transition-colors cursor-pointer"
                >
                  +
                </button>
                <span className="text-[10px] text-gray-600 pl-2">
                  {quantity === 2 ? "Duo Pack (Free Delivery)" : quantity >= 3 ? "Fleet Pack (Free Delivery)" : "Single Unit"}
                </span>
              </div>
            </div>

            {/* Vehicle Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-gray-500 tracking-wider block font-semibold">
                YOUR VEHICLE (FOR FITMENT VERIFICATION)
              </label>
              <select
                value={vehicle}
                onChange={(e) => {
                  audioEngine.playDetent();
                  setVehicle(e.target.value);
                }}
                className="w-full bg-white border border-gray-300 text-[#111111] p-3 text-xs outline-none focus:border-black cursor-pointer"
              >
                {POPULAR_VEHICLES.map((v) => (
                  <option key={v} value={v} className="bg-white text-black">
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
                  className="w-full bg-white border border-gray-300 text-[#111111] p-3 text-xs outline-none focus:border-black mt-2"
                />
              )}
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-gray-500 tracking-wider block font-semibold">
                CUSTOMER NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Kasun Perera"
                value={name}
                onChange={(e) => {
                  setError("");
                  setName(e.target.value);
                }}
                className="w-full bg-white border border-gray-300 text-[#111111] p-3 text-xs outline-none focus:border-black"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-gray-500 tracking-wider block font-semibold">
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
                className="w-full bg-white border border-gray-300 text-[#111111] p-3 text-xs outline-none focus:border-black"
              />
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-gray-500 tracking-wider block font-semibold">
                DELIVERY DISTRICT
              </label>
              <select
                value={district}
                onChange={(e) => {
                  audioEngine.playDetent();
                  setDistrict(e.target.value);
                }}
                className="w-full bg-white border border-gray-300 text-[#111111] p-3 text-xs outline-none focus:border-black cursor-pointer"
              >
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d} value={d} className="bg-white text-black">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Summary */}
            <div className="border-t border-gray-200 pt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">TOTAL:</span>
                <span className="text-[#111111] font-bold text-sm">
                  Rs. {pricing.total.toLocaleString()} LKR
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>DELIVERY:</span>
                <span className={pricing.freeDelivery ? "text-emerald-700 font-medium" : "text-gray-700"}>
                  {pricing.deliveryText}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3.5 rounded-full text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer mt-4 shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>CONTINUE TO WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[9px] text-gray-500 pt-1">
              <ShieldCheck className="w-3 h-3 text-black" />
              <span>CASH ON DELIVERY • PRE-PAYMENT UNBOXING INSPECTION</span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
