"use client";

import React from "react";
import { MessageSquare, Mail, Clock, MapPin, ArrowRight } from "lucide-react";
import { audioEngine } from "../../lib/audio";
import { SITE_CONTACT } from "../../constants";

export default function SupportCTA() {
  const handleWhatsApp = () => {
    audioEngine.playAcquire();
    const text = encodeURIComponent(
      "Hello AETHEX Support, I have a question regarding an order / product policy."
    );
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <aside aria-label="Customer Support" className="bg-white border border-gray-200 p-6 space-y-6 font-sans shadow-sm">
      <div className="space-y-1 border-b border-gray-200 pb-4">
        <div className="text-[9px] font-mono tracking-[0.25em] text-gray-500 uppercase font-semibold">
          CUSTOMER ASSISTANCE
        </div>
        <h3 className="text-base font-mono uppercase text-[#111111] font-bold">
          Have Questions?
        </h3>
        <p className="text-xs text-gray-600 font-light leading-relaxed">
          Our Colombo customer service team is available directly via WhatsApp or email.
        </p>
      </div>

      <div className="space-y-3 text-xs font-mono text-gray-600">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-4 h-4 text-black flex-shrink-0" />
          <div>
            <span className="text-[#111111] font-semibold block">WhatsApp Direct:</span>
            <span className="text-[11px] text-gray-600">+94 78 234 9954</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-black flex-shrink-0" />
          <div>
            <span className="text-[#111111] font-semibold block">Email:</span>
            <span className="text-[11px] text-gray-600">support@aethexstore.com</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-black flex-shrink-0" />
          <div>
            <span className="text-[#111111] font-semibold block">Hours:</span>
            <span className="text-[11px] text-gray-600">9:00 AM – 8:00 PM Daily (LK)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-black flex-shrink-0" />
          <div>
            <span className="text-[#111111] font-semibold block">Location:</span>
            <span className="text-[11px] text-gray-600">Colombo, Sri Lanka</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleWhatsApp}
        className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3 text-xs font-mono font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm"
      >
        <span>CHAT ON WHATSAPP</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
