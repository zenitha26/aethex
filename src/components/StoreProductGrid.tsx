"use client";

import { useState, useMemo } from "react";
import { Product } from "../types/product";
import { CATEGORIES } from "../lib/mockData";
import { useCartStore } from "../store/useCartStore";
import EnhancedProductCard from "./EnhancedProductCard";
import { RotateCcw, Search } from "lucide-react";
import { audioEngine } from "../lib/audio";

interface StoreProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  activeFilterTab?: string;
}

export default function StoreProductGrid({ 
  products, 
  onQuickView 
}: StoreProductGridProps) {
  const { searchQuery, selectedCategory, setSelectedCategory, setSearchQuery } = useCartStore();
  const [activeTab, setActiveTab] = useState<"all" | "deals" | "fast-moving">("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  const filterTabs = [
    { id: "all", label: "All Products" },
    { id: "deals", label: "Top Deals" },
    { id: "fast-moving", label: "Fast-Moving Products" },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "All" && selectedCategory !== "All Products") {
      list = list.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by tab
    if (activeTab === "deals") {
      list = list.filter(p => p.isTopDeal);
    } else if (activeTab === "fast-moving") {
      list = list.filter(p => p.isFastMoving);
    }

    // Sort
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [products, searchQuery, selectedCategory, activeTab, sortBy]);

  const handleTabChange = (tabId: "all" | "deals" | "fast-moving") => {
    try { audioEngine.playSelect(); } catch {}
    setActiveTab(tabId);
  };

  const handleCategorySelect = (catName: string) => {
    try { audioEngine.playSelect(); } catch {}
    setSelectedCategory(catName);
  };

  const handleResetFilters = () => {
    try { audioEngine.playClick(); } catch {}
    setSelectedCategory("All");
    setSearchQuery("");
    setActiveTab("all");
    setSortBy("featured");
  };

  return (
    <section id="products-grid" className="py-16 px-6 sm:px-10 lg:px-12 bg-[#050505] font-sans text-white border-b border-white/10">
      <div className="max-w-[1500px] mx-auto space-y-8">
        
        {/* Section Header & Main Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase block font-semibold">
              OUR CATALOG // FAST DISPATCH
            </span>
            <h2 className="text-3xl sm:text-4xl font-mono uppercase text-white font-light">
              Our Products
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 border border-white/10 p-1 bg-[#0B0B0B] font-mono text-xs shadow-xs">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`px-4 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-black font-bold shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar font-mono text-xs">
          <button
            onClick={() => handleCategorySelect("All")}
            className={`px-3 py-1.5 border whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === "All" || selectedCategory === "All Products"
                ? "bg-white text-black border-white font-bold"
                : "bg-[#0B0B0B] text-white/70 border-white/10 hover:border-white/40 hover:text-white"
            }`}
          >
            All Departments
          </button>
          {CATEGORIES.filter(c => c.name !== "All Products").map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`px-3 py-1.5 border whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-black border-white font-bold"
                    : "bg-[#0B0B0B] text-white/70 border-white/10 hover:border-white/40 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Control Strip: Active Filter Badge, Results Count & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-y border-white/10 text-xs font-mono text-white/60">
          <div className="flex items-center gap-3">
            <span>
              Showing <span className="text-white font-bold">{filteredProducts.length}</span> of {products.length} Products
            </span>
            {(selectedCategory !== "All" && selectedCategory !== "All Products" || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-white hover:text-white/80 uppercase text-[10px] ml-2 border border-white/10 bg-white/5 px-2 py-0.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0B0B0B] border border-white/10 text-white text-xs font-mono py-1.5 px-3 outline-none cursor-pointer"
            >
              <option value="featured">Featured / Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Customer Ratings</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-[#0B0B0B] border border-white/10 p-8">
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center mx-auto text-white/40">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-mono uppercase text-white font-bold">
              No matching products found
            </h3>
            <p className="text-xs font-mono text-white/60 max-w-sm mx-auto">
              We couldn't find any products matching your current query or category filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-white text-black px-6 py-2.5 text-xs font-mono uppercase font-bold tracking-wider hover:bg-white/90 transition-colors shadow-sm cursor-pointer"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <EnhancedProductCard 
                key={product.id} 
                product={product} 
                onQuickView={onQuickView} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
