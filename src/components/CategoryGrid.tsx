"use client";

import { CATEGORIES } from "../lib/mockData";
import { 
  Smartphone, 
  Laptop, 
  Tv, 
  Home, 
  Utensils, 
  Wrench, 
  Cpu, 
  Shield, 
  ArrowRight 
} from "lucide-react";
import { audioEngine } from "../lib/audio";

interface CategoryGridProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory: string;
}

export default function CategoryGrid({ onSelectCategory, selectedCategory }: CategoryGridProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case "Mobile & Tablets":
        return <Smartphone className="w-5 h-5" />;
      case "Computers & Accessories":
        return <Laptop className="w-5 h-5" />;
      case "TV & Entertainment":
        return <Tv className="w-5 h-5" />;
      case "Home Appliances":
        return <Home className="w-5 h-5" />;
      case "Kitchen Appliances":
        return <Utensils className="w-5 h-5" />;
      case "Power Tools & Generators":
        return <Wrench className="w-5 h-5" />;
      case "Cable & Connectivity":
        return <Cpu className="w-5 h-5" />;
      case "Automotive Hardware":
        return <Shield className="w-5 h-5" />;
      default:
        return <Laptop className="w-5 h-5" />;
    }
  };

  const handleCategoryClick = (catName: string) => {
    try { audioEngine.playSelect(); } catch {}
    onSelectCategory(catName);
    const el = document.getElementById("products-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 px-6 sm:px-10 lg:px-12 bg-[#050505] border-b border-white/10 font-sans text-white">
      <div className="max-w-[1500px] mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase block font-semibold">
              CURATED DEPARTMENTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-mono uppercase text-white font-light">
              Perfect For Every Space
            </h2>
          </div>
          <p className="text-xs font-mono text-white/60 max-w-sm sm:text-right">
            Explore automotive hardware, lossless acoustics, and precision engineering.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CATEGORIES.filter(c => c.name !== "All Products").map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`p-6 flex flex-col items-start justify-between min-h-[140px] border transition-all text-left group cursor-pointer ${
                  isSelected
                    ? "bg-white text-black border-white shadow-xl"
                    : "bg-[#0B0B0B] text-white border-white/10 hover:border-white/30 hover:bg-[#111111]"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-2.5 border ${isSelected ? "border-black/20 bg-black/10 text-black" : "border-white/10 bg-white/5 text-white group-hover:border-white/30"}`}>
                    {getIcon(cat.name)}
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isSelected ? "text-black" : "text-white/40 group-hover:text-white"}`} />
                </div>

                <div className="space-y-0.5 pt-4">
                  <h3 className="text-xs sm:text-sm font-mono uppercase font-bold tracking-wider leading-snug">
                    {cat.name}
                  </h3>
                  <span className={`text-[10px] font-mono ${isSelected ? "text-black/70" : "text-white/50"}`}>
                    {cat.count} {cat.count === 1 ? "Product" : "Products"} Available
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
