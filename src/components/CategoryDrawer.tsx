"use client";

import { useEffect } from "react";
import { CATEGORIES } from "../lib/mockData";
import { useCartStore } from "../store/useCartStore";
import { 
  X, 
  Smartphone, 
  Laptop, 
  Tv, 
  Home, 
  Utensils, 
  Wrench, 
  Cpu, 
  Shield, 
  ArrowRight,
  Layers
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { audioEngine } from "../lib/audio";

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (catName: string) => void;
  selectedCategory: string;
}

export default function CategoryDrawer({
  isOpen,
  onClose,
  onSelectCategory,
  selectedCategory
}: CategoryDrawerProps) {
  const { setSelectedCategory } = useCartStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const getIcon = (name: string) => {
    switch (name) {
      case "Mobile & Tablets":
        return <Smartphone className="w-4 h-4" />;
      case "Computers & Accessories":
        return <Laptop className="w-4 h-4" />;
      case "TV & Entertainment":
        return <Tv className="w-4 h-4" />;
      case "Home Appliances":
        return <Home className="w-4 h-4" />;
      case "Kitchen Appliances":
        return <Utensils className="w-4 h-4" />;
      case "Power Tools & Generators":
        return <Wrench className="w-4 h-4" />;
      case "Cable & Connectivity":
        return <Cpu className="w-4 h-4" />;
      case "Automotive Hardware":
        return <Shield className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const handleCategoryClick = (catName: string) => {
    try { audioEngine.playSelect(); } catch {}
    setSelectedCategory(catName);
    onSelectCategory(catName);
    onClose();

    // Smooth scroll to products section
    const el = document.getElementById("products-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const drawerVariants: Variants = {
    hidden: { x: "-100%" },
    visible: { 
      x: 0, 
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } 
    },
    exit: { x: "-100%", transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100]"
          />

          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            className="fixed left-0 top-0 bottom-0 w-full max-w-[380px] bg-white border-r border-gray-200 z-[101] shadow-2xl flex flex-col justify-between font-sans text-[#111111]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-[#F9F9F9]">
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-[#111111]" />
                <h2 className="text-[#111111] text-sm font-mono tracking-[0.2em] uppercase font-bold">
                  ALL DEPARTMENTS
                </h2>
              </div>
              
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-black p-1 transition-colors"
                aria-label="Close categories"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto px-4 py-4 flex flex-col gap-1.5 bg-white">
              <button
                onClick={() => handleCategoryClick("All")}
                className={`flex items-center justify-between p-3.5 border transition-all text-xs font-mono uppercase text-left cursor-pointer ${
                  selectedCategory === "All" || selectedCategory === "All Products"
                    ? "bg-black text-white border-black font-bold shadow-xs"
                    : "bg-white text-[#111111] border-gray-200 hover:border-black hover:bg-gray-50 shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4" />
                  <span>All Products</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {CATEGORIES.filter(c => c.name !== "All Products").map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`flex items-center justify-between p-3.5 border transition-all text-xs font-mono uppercase text-left cursor-pointer ${
                      isSelected
                        ? "bg-black text-white border-black font-bold shadow-xs"
                        : "bg-white text-[#111111] border-gray-200 hover:border-black hover:bg-gray-50 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(cat.name)}
                      <span>{cat.name}</span>
                    </div>
                    <span className={`text-[10px] font-mono ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                      ({cat.count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-[#F9F9F9] space-y-1 text-[11px] font-mono text-gray-600">
              <div className="text-[#111111] font-bold uppercase tracking-wider">
                Islandwide Sri Lanka Delivery
              </div>
              <div className="text-[10px] leading-relaxed">
                Dispatching daily via prompt courier network. Cash on delivery accepted across all 25 districts.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
