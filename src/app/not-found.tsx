"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, HelpCircle, ArrowRight, Search, AlertCircle } from "lucide-react";

export default function NotFound() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white p-6 relative overflow-hidden font-sans selection:bg-white selection:text-black">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none -z-0" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl p-8 sm:p-12 border border-white/10 bg-[#0B0B0B] relative z-10 text-center flex flex-col gap-8 shadow-2xl"
      >
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/30 pointer-events-none" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/30 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/30 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/30 pointer-events-none" />

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-white/10 text-[9px] font-mono tracking-[0.3em] uppercase text-white/60">
            <AlertCircle className="w-3 h-3 text-white" />
            <span>404 ERROR</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-light font-mono tracking-tight uppercase text-white leading-none">
            Page Not Found
          </h1>

          <p className="text-white/60 text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed">
            We couldn't find the page you're looking for. It may have been moved or the link might be incorrect.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search car accessories, mounts, chargers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-28 py-3 bg-[#050505] border border-white/15 text-xs text-white placeholder-white/40 outline-none focus:border-white transition-all font-mono"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-4 py-2 bg-white text-black font-mono font-bold text-[10px] uppercase tracking-widest hover:bg-white/90 transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Directory Links */}
        <div className="grid grid-cols-1 gap-3 text-left font-mono text-xs">
          <Link
            href="/"
            className="p-4 border border-white/10 bg-[#050505] hover:border-white flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <Compass className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
              <span className="text-white font-medium uppercase tracking-wider">Return to Home</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-white/40 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/products"
            className="p-4 border border-white/10 bg-[#050505] hover:border-white flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <Compass className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
              <span className="text-white font-medium uppercase tracking-wider">Browse All Products</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-white/40 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/contact"
            className="p-4 border border-white/10 bg-[#050505] hover:border-white flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
              <span className="text-white font-medium uppercase tracking-wider">Customer Support</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-white/40 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="pt-2 border-t border-white/10 text-[9px] font-mono tracking-[0.2em] text-white/40 uppercase">
          AETHEX STORE
        </div>
      </motion.div>
    </main>
  );
}
