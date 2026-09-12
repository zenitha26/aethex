"use client";

import Link from "next/link";
import { Compass, HelpCircle, ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#111111] p-6 relative overflow-hidden font-sans">
      {/* Main Content Card */}
      <div className="w-full max-w-lg p-10 rounded-2xl border border-gray-200 bg-[#F9F9F9] shadow-sm relative z-10 text-center flex flex-col gap-8">
        
        {/* Header Tags */}
        <div className="space-y-3">
          <span className="text-[10px] text-black font-mono tracking-[0.25em] font-bold uppercase bg-gray-200 border border-gray-300 px-4 py-1.5 rounded-full inline-block">
            Status Code: 404
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-[#111111] uppercase mt-4">
            PAGE NOT FOUND
          </h1>
          <p className="text-gray-600 text-xs font-light max-w-sm mx-auto leading-relaxed mt-2">
            The requested product or page does not exist or has been moved from our active catalog.
          </p>
        </div>

        {/* Custom Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search catalog products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-32 py-3 bg-white border border-gray-300 rounded-full text-xs text-[#111111] placeholder-gray-400 outline-none focus:border-black transition-all font-mono"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-4 py-2 rounded-full bg-black text-white font-bold text-[10px] uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Directory Navigation Links */}
        <div className="grid grid-cols-1 gap-3 text-left font-mono text-xs">
          <Link
            href="/"
            className="p-4 rounded-xl border border-gray-200 bg-white hover:border-black flex items-center justify-between group transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              <Compass className="h-4 w-4 text-black" />
              <span className="text-[#111111] font-semibold">Return to Storefront</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/contact"
            className="p-4 rounded-xl border border-gray-200 bg-white hover:border-black flex items-center justify-between group transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="h-4 w-4 text-black" />
              <span className="text-[#111111] font-semibold">Contact Customer Support</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Logo Branding */}
        <div className="text-[10px] tracking-[0.2em] font-mono text-gray-400 uppercase mt-4">
          &copy; AETHEX Store &bull; Sri Lanka
        </div>
      </div>
    </div>
  );
}
