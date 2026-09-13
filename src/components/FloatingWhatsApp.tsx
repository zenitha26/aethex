"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { audioEngine } from "@/lib/audio";
import { SITE_CONTACT } from "@/constants";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Automatically hide on /checkout and /admin/** routes
  if (
    !pathname ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    try {
      audioEngine.playAcquire();
    } catch {}
  };

  const supportMessage = encodeURIComponent(
    "Hello AETHEX Concierge, I have an inquiry regarding your hardware catalog or order support."
  );
  const whatsappUrl = `https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER || "94782349954"}?text=${supportMessage}`;

  return (
    <aside 
      aria-label="Direct Concierge Support" 
      className="fixed bottom-22 right-4 z-40 sm:bottom-8 sm:right-8 flex items-center gap-3 font-sans"
    >
      {/* Sleek Tooltip Label on Hover */}
      <div 
        className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B0B0B]/90 backdrop-blur-md border border-white/10 text-white/80 text-[11px] font-mono tracking-wider transition-all duration-300 pointer-events-none shadow-xl ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span>AETHEX CONCIERGE</span>
      </div>

      {/* Sleek Glassmorphic Circular Button with Glowing Hover State */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/[0.05] hover:bg-white/[0.12] backdrop-blur-xl border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all duration-300 shadow-2xl hover:shadow-[0_0_25px_rgba(255,255,255,0.18)] hover:scale-105 active:scale-95 group relative cursor-pointer"
        title="Chat with AETHEX Concierge on WhatsApp"
        aria-label="WhatsApp Concierge"
      >
        {/* Subtle radial sheen glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Minimal WhatsApp Icon in Quiet Luxury Monochrome */}
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white transition-colors duration-200" />
      </a>
    </aside>
  );
}
