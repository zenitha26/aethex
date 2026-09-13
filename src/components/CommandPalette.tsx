"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Compass, Shield, HelpCircle, FileText, Settings, X, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";

interface RouteItem {
  name: string;
  path: string;
  icon: any;
  category: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const routes: RouteItem[] = [
    { name: "Overview / Home", path: "/", icon: Compass, category: "Navigation" },
    { name: "Curated 10-Piece Catalog", path: "/products", icon: Compass, category: "Products" },
    { name: "Brand Manifesto & Engineering", path: "/about-us", icon: Settings, category: "About" },
    { name: "Track Order Status", path: "/track-order", icon: Terminal, category: "Account" },
    { name: "Policies & Integrity", path: "/policies", icon: Shield, category: "Legal" },
    { name: "Contact Concierge", path: "/contact", icon: HelpCircle, category: "Support" },
    { name: "System Analytics", path: "/admin/analytics", icon: FileText, category: "Admin" }
  ];

  const filtered = routes.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleSelect = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex].path);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10050] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Palette Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-[#0b0b0b]/90 border border-white/10 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-white/[0.02]">
              <Search className="h-5 w-5 text-white/40" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or path search..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white placeholder-white/30 text-sm outline-none border-none focus:ring-0"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List Results */}
            <div className="max-h-[320px] overflow-y-auto p-2 space-y-1 font-mono text-xs">
              {filtered.length > 0 ? (
                filtered.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${isSelected ? "text-emerald-400" : "text-white/40"}`} />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-white/30">
                        {item.category}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-white/30">
                  No commands found matching &quot;{query}&quot;
                </div>
              )}
            </div>

            {/* Command Footer Controls */}
            <div className="px-4 py-2 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-mono">
              <div className="flex items-center gap-3">
                <span>Navigate: <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[8px]">&uarr;&darr;</kbd></span>
                <span>Select: <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[8px]">Enter</kbd></span>
              </div>
              <span>Close: <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[8px]">ESC</kbd></span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
