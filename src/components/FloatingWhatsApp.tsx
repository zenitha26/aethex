"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling down slightly or after a delay
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      }
    };
    
    // Also show after 3 seconds regardless of scroll
    const timer = setTimeout(() => setIsVisible(true), 3000);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <Link
      href="https://wa.me/message/YOUR_WHATSAPP_NUMBER" // Replace with actual number later when user answers
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-4 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full shadow-lg shadow-[#25D366]/20 transition-all hover:-translate-y-1 hover:scale-110 flex items-center justify-center group"
    >
      <MessageCircle className="w-6 h-6" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-[#121212] text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none font-medium">
        Chat with us
      </span>
      
      {/* Pulse animation ring */}
      <span className="absolute w-full h-full rounded-full border-2 border-[#25D366] animate-ping opacity-20 pointer-events-none"></span>
    </Link>
  );
}
