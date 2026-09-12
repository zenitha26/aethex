"use client";

import React from "react";
import { MessageSquare, Mail, Clock, MapPin, ArrowRight } from "lucide-react";
import { audioEngine } from "../../lib/audio";
import { SITE_CONTACT } from "../../constants";

export default function SupportCTA() {
  const handleWhatsApp = () => {
    try {
      audioEngine.playAcquire();
    } catch {}
    const text = encodeURIComponent(
      "Hello AETHEX Support, I have a question regarding an order / product policy."
    );
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <aside aria-label="Customer Support" className="bg-[#0B0B0B] border border-white/10 p-6 rounded-2xl space-y-6 font-sans shadow-xl">
      <div className="space-y-1 border-b border-white/10 pb-4">
        <div className="text-[9px] font-mono tracking-[0.25em] text-white/40 uppercase font-semibold">
          CONCIERGE & ASSISTANCE
        </div>
        <h3 className="text-base font-sans uppercase text-white font-bold tracking-tight">
          Have Inquiries?
        </h3>
        <p className="text-xs text-white/50 font-light leading-relaxed">
          Our Colombo customer concierge team is available directly via WhatsApp or email.
        </p>
      </div>

      <div className="space-y-3.5 text-xs font-mono text-white/60">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-4 h-4 text-white/80 shrink-0" />
          <div>
            <span className="text-white font-medium block">WhatsApp Concierge:</span>
            <span className="text-[11px] text-white/50">+94 78 234 9954</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-white/80 shrink-0" />
          <div>
            <span className="text-white font-medium block">Inquiries Email:</span>
            <span className="text-[11px] text-white/50">support@aethexstore.com</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-white/80 shrink-0" />
          <div>
            <span className="text-white font-medium block">Operating Hours:</span>
            <span className="text-[11px] text-white/50">9:00 AM – 8:00 PM Daily (LK)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-white/80 shrink-0" />
          <div>
            <span className="text-white font-medium block">Location:</span>
            <span className="text-[11px] text-white/50">Colombo, Sri Lanka</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleWhatsApp}
        className="w-full bg-white text-black hover:bg-white/90 transition-all py-3 px-4 rounded-xl text-xs font-mono font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
      >
        <span>CHAT ON WHATSAPP</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
