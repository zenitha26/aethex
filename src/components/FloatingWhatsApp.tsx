"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
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

  const supportMessage = encodeURIComponent(
    "Hello AETHEX, I have a question about your car accessories or my order."
  );
  const whatsappUrl = `https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER || "94782349954"}?text=${supportMessage}`;

  return (
    <aside 
      aria-label="WhatsApp Support" 
      className="fixed bottom-22 right-4 z-40 sm:bottom-8 sm:right-8 flex items-center gap-3 font-sans"
    >
      {/* Tooltip Label on Hover */}
      <div 
        className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B0B0B]/90 backdrop-blur-md border border-white/10 text-white/80 text-[11px] font-mono tracking-wider transition-all duration-300 pointer-events-none shadow-xl ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span>WHATSAPP SUPPORT</span>
      </div>

      {/* Circular Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#0B0B0B] border border-white/15 hover:border-white text-white flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 group relative cursor-pointer"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white transition-colors duration-200" />
      </a>
    </aside>
  );
}
