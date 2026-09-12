"use client";

import React, { useState } from "react";
import { MessageSquare, Mail, MapPin, Clock, ArrowRight, Check } from "lucide-react";
import { audioEngine } from "../../lib/audio";
import { SITE_CONTACT } from "../../constants";

export default function ContactCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWhatsApp = () => {
    audioEngine.playAcquire();
    const text = encodeURIComponent(
      "Hello AETHEX Store, I am inquiring about product support / order assistance."
    );
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    audioEngine.playAcquire();
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
      <div className="lg:col-span-5 bg-white border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-1 border-b border-gray-200 pb-4">
          <div className="text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase font-semibold">
            COMMUNICATION DESK
          </div>
          <h2 className="text-xl font-mono uppercase text-[#111111] font-semibold">
            Direct Channels
          </h2>
          <p className="text-xs text-gray-600 font-light leading-relaxed">
            For fastest response regarding existing orders, fitment verification, or dispatch status.
          </p>
        </div>

        <div className="space-y-4 text-xs font-mono text-gray-600">
          <div className="space-y-1">
            <span className="text-[#111111] font-semibold block uppercase">WHATSAPP (RECOMMENDED):</span>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="text-[#111111] hover:underline text-sm font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-black" />
              <span>+94 78 234 9954</span>
            </button>
            <span className="text-[10px] text-gray-500 block">Instant messaging & dispatch updates</span>
          </div>

          <div className="space-y-1 pt-2 border-t border-gray-100">
            <span className="text-[#111111] font-semibold block uppercase">EMAIL:</span>
            <a
              href="mailto:support@aethexstore.com"
              className="text-[#111111] hover:underline text-xs"
            >
              support@aethexstore.com
            </a>
          </div>

          <div className="space-y-1 pt-2 border-t border-gray-100">
            <span className="text-[#111111] font-semibold block uppercase">SUPPORT HOURS:</span>
            <div className="text-gray-800 font-medium">9:00 AM – 8:00 PM (Daily)</div>
            <div className="text-[10px] text-gray-500">Sri Lanka Time (UTC+5:30)</div>
          </div>

          <div className="space-y-1 pt-2 border-t border-gray-100">
            <span className="text-[#111111] font-semibold block uppercase">LOCATION:</span>
            <div className="text-gray-800 font-medium">Colombo, Sri Lanka</div>
            <div className="text-[10px] text-gray-500">06°55'38"N, 79°51'40"E</div>
          </div>
        </div>
      </div>

      {/* Message Form (7 Cols) */}
      <div className="lg:col-span-7 bg-white border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-1 border-b border-gray-200 pb-4">
          <div className="text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase font-semibold">
            SEND INQUIRY
          </div>
          <h2 className="text-xl font-mono uppercase text-[#111111] font-semibold">
            Customer Message Desk
          </h2>
          <p className="text-xs text-gray-600 font-light leading-relaxed">
            Submit your query below. Our team will review and respond directly to your WhatsApp or email.
          </p>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3 bg-[#F9F9F9] border border-gray-200 p-6">
            <div className="w-10 h-10 border border-black flex items-center justify-center mx-auto text-black">
              <Check className="w-5 h-5" />
            </div>
            <div className="text-sm font-mono uppercase text-[#111111] font-semibold">
              Inquiry Dispatched
            </div>
            <p className="text-xs text-gray-600 max-w-xs mx-auto">
              Connecting you with our support desk on WhatsApp.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[10px] uppercase text-gray-600 font-semibold block mb-1.5">
                YOUR NAME
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sanjeewa Mendis"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-gray-300 text-[#111111] p-3 text-xs outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-gray-600 font-semibold block mb-1.5">
                EMAIL ADDRESS (OPTIONAL)
              </label>
              <input
                type="email"
                placeholder="e.g. sanjeewa@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 text-[#111111] p-3 text-xs outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-gray-600 font-semibold block mb-1.5">
                MESSAGE / VEHICLE FITMENT QUESTION
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your inquiry, order status question, or vehicle fitment details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-gray-300 text-[#111111] p-3 text-xs outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3.5 text-xs font-mono font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>SEND TO SUPPORT VIA WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
