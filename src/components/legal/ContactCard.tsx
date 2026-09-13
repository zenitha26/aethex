"use client";

import React, { useState } from "react";
import { MessageSquare, Mail, MapPin, Clock, ArrowRight, Check, Send, Sparkles } from "lucide-react";
import { audioEngine } from "../../lib/audio";
import { SITE_CONTACT } from "../../constants";

export default function ContactCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWhatsApp = () => {
    try { audioEngine.playAcquire(); } catch {}
    const text = encodeURIComponent(
      "Hello AETHEX Store, I am inquiring about product support / order assistance."
    );
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try { audioEngine.playAcquire(); } catch {}
    setSubmitted(true);

    // Form submission opens WhatsApp with the formatted inquiry
    const payload = `Hi AETHEX Support,

Name: ${name.trim()}
Email: ${email.trim() || "Not provided"}

Inquiry:
${message.trim()}`;

    const encoded = encodeURIComponent(payload);
    setTimeout(() => {
      window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
      
      {/* Contact Channels (5 Cols) */}
      <div className="lg:col-span-5 bg-[#0B0B0B] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="space-y-1.5 border-b border-white/10 pb-5">
          <div className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase font-semibold">
            TELEMETRY DESK // DIRECT CHANNELS
          </div>
          <h2 className="text-xl font-mono uppercase text-white font-semibold">
            Direct Concierge
          </h2>
          <p className="text-xs text-white/60 font-light leading-relaxed">
            For fastest resolution regarding existing orders, fitment verification, or dispatch status in Sri Lanka.
          </p>
        </div>

        <div className="space-y-5 text-xs font-mono text-white/70">
          <div className="space-y-1.5">
            <span className="text-white/40 text-[10px] tracking-widest font-semibold block uppercase">WHATSAPP (RECOMMENDED):</span>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="text-white hover:text-white/80 text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>{SITE_CONTACT.WHATSAPP_FORMATTED}</span>
            </button>
            <span className="text-[10px] text-white/40 block">Instant messaging, slip verification & courier updates</span>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-white/10">
            <span className="text-white/40 text-[10px] tracking-widest font-semibold block uppercase">EMAIL SUPPORT:</span>
            <a
              href={`mailto:${SITE_CONTACT.EMAIL}`}
              className="text-white hover:underline text-xs block font-mono"
            >
              {SITE_CONTACT.EMAIL}
            </a>
            <span className="text-[10px] text-white/40 block">Response window: 1–2 hours during support hours</span>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-white/10">
            <span className="text-white/40 text-[10px] tracking-widest font-semibold block uppercase">OPERATING HOURS:</span>
            <div className="text-white font-medium">{SITE_CONTACT.HOURS}</div>
            <div className="text-[10px] text-white/40">Sri Lanka Standard Time (UTC+5:30)</div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-white/10">
            <span className="text-white/40 text-[10px] tracking-widest font-semibold block uppercase">FULFILLMENT HUB:</span>
            <div className="text-white font-medium">{SITE_CONTACT.LOCATION}</div>
            <div className="text-[10px] text-white/40">Islandwide Courier Dispatch across all 25 Districts</div>
          </div>
        </div>
      </div>

      {/* Message Form (7 Cols) */}
      <div className="lg:col-span-7 bg-[#0B0B0B] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="space-y-1.5 border-b border-white/10 pb-5">
          <div className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase font-semibold">
            INQUIRY DISPATCH // DIRECT TO SUPPORT
          </div>
          <h2 className="text-xl font-mono uppercase text-white font-semibold">
            Customer Dispatch Desk
          </h2>
          <p className="text-xs text-white/60 font-light leading-relaxed">
            Submit your vehicle details, order reference, or technical question. Our Colombo support engineers will respond immediately.
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4 bg-white/[0.02] border border-white/10 p-6">
            <div className="w-12 h-12 border border-white flex items-center justify-center mx-auto text-white">
              <Check className="w-6 h-6" />
            </div>
            <div className="text-sm font-mono uppercase text-white font-semibold">
              Inquiry Formulated
            </div>
            <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
              Redirecting you to our official WhatsApp support channel (+94 78 234 9954) with your formatted inquiry...
            </p>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="mt-4 px-6 py-2.5 bg-white text-black text-xs font-mono font-bold tracking-widest uppercase hover:bg-white/90 transition-all cursor-pointer"
            >
              OPEN WHATSAPP NOW
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[10px] uppercase text-white/60 font-semibold block mb-1.5 tracking-wider">
                YOUR NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sanjeewa Mendis"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 text-white p-3 text-xs outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-white/60 font-semibold block mb-1.5 tracking-wider">
                EMAIL ADDRESS (OPTIONAL)
              </label>
              <input
                type="email"
                placeholder="e.g. sanjeewa@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 text-white p-3 text-xs outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-white/60 font-semibold block mb-1.5 tracking-wider">
                MESSAGE / VEHICLE FITMENT QUESTION / ORDER ID *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your inquiry, order status question, or vehicle fitment details (e.g. Honda Vezel cup holder size)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 text-white p-3 text-xs outline-none focus:border-white transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/90 transition-all py-3.5 text-xs font-mono font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xl"
            >
              <span>DISPATCH INQUIRY VIA WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
