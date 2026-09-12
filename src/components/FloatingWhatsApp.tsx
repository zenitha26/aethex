"use client";

import { useState, useEffect } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { audioEngine } from "../lib/audio";
import { SITE_CONTACT } from "../constants";

interface FloatingWhatsAppProps {
  onOpenOrder?: () => void;
}

export default function FloatingWhatsApp({ onOpenOrder }: FloatingWhatsAppProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // Show after scrolling past hero (200px)
      setIsVisible(scrollY > 200);

      // Hide when near final CTA / footer
      const closeToBottom = docHeight - (scrollY + windowHeight) < 400;
      setIsNearBottom(closeToBottom);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    audioEngine.playAcquire();
    if (onOpenOrder) {
      onOpenOrder();
      return;
    }
    const event = new CustomEvent("aethex:open-order", { cancelable: true });
    const notHandled = window.dispatchEvent(event);
    if (!notHandled) {
      return;
    }
    const text = encodeURIComponent(
      "Hi AETHEX, I'd like to order the ASPOR A711 360° Console Mount (Rs. 2,990 + Delivery). Please confirm availability."
    );
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  if (!isVisible || isNearBottom) return null;

  return (
    <>
      {/* MOBILE MANDATORY STICKY ORDER BAR (Section 15) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 border-t border-gray-200 px-5 py-3.5 flex items-center justify-between shadow-xl pb-[max(0.85rem,env(safe-area-inset-bottom))] font-sans backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xs font-mono font-bold text-[#111111] tracking-wider">
            ASPOR A711
          </span>
          <span className="text-[10px] font-mono text-gray-600">
            Rs. 2,990 + Delivery
          </span>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="bg-black text-white px-5 py-2.5 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 cursor-pointer active:scale-95 transition-all shadow-sm hover:bg-neutral-800"
        >
          <span>ORDER NOW</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* DESKTOP SUBTLE FLOATING ORDER CONTROL */}
      <aside aria-label="Quick Order" className="fixed bottom-6 right-6 z-40 hidden md:flex items-center font-sans">
        <button
          type="button"
          onClick={handleClick}
          className="bg-white text-[#111111] border border-gray-300 hover:border-black px-4 py-2.5 flex items-center gap-3 transition-all cursor-pointer shadow-xl hover:scale-105"
        >
          <div className="w-2 h-2 bg-black rounded-none inline-block animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-semibold">
              ASPOR A711
            </span>
            <span className="text-xs font-mono font-bold text-[#111111] tracking-wider">
              ORDER [RS. 2,990]
            </span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-black ml-1" />
        </button>
      </aside>
    </>
  );
}
