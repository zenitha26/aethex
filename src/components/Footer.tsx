"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, Check } from "lucide-react";
import { audioEngine } from "../lib/audio";
import { SITE_CONTACT } from "../constants";
import { useCartStore } from "../store/useCartStore";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { setSelectedCategory } = useCartStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try { audioEngine.playAcquire(); } catch {}
    setSubscribed(true);
  };

  const handleCategoryClick = (catName: string) => {
    try { audioEngine.playSelect(); } catch {}
    setSelectedCategory(catName);
    const el = document.getElementById("products-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const departmentLinks = [
    { name: "Mobile & Tablets", filter: "Mobile & Tablets" },
    { name: "Computers & Accessories", filter: "Computers & Accessories" },
    { name: "TV & Entertainment", filter: "TV & Entertainment" },
    { name: "Home Appliances", filter: "Home Appliances" },
    { name: "Automotive Hardware", filter: "Automotive Hardware" },
  ];

  const supportLinks = [
    { name: "Track Order", href: "/track-order" },
    { name: "Warranty Claim", href: "/warranty" },
    { name: "Shipping Rates", href: "/policies" },
    { name: "Help & FAQ", href: "/faq" },
    { name: "Contact Desk", href: "/contact" },
  ];

  const policyLinks = [
    { name: "Privacy Policy", href: "/policies" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Refund & Returns", href: "/policies" },
  ];

  return (
    <footer className="relative bg-[#050505] text-gray-300 pt-24 pb-8 overflow-hidden border-t border-white/5 font-sans">
      {/* Subtle Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Newsletter / Droplist Section (Glassmorphism Card) */}
        <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl mb-20 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white/[0.03] transition-colors duration-500">
          <div className="max-w-xl">
            <h3 className="text-white text-sm font-semibold tracking-[0.2em] mb-2 font-mono">
              AETHEX PRIORITY ACCESS
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              JOIN THE PRODUCT DROPLIST.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Receive notifications for newly arrived electronics, restocks, and private promotional codes before general release.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex-shrink-0">
            {subscribed ? (
              <div className="flex items-center gap-2.5 bg-white/10 border border-white/20 px-6 py-3.5 rounded-full text-white text-sm font-medium">
                <Check className="w-4 h-4 text-white" />
                <span>You're on the priority droplist!</span>
              </div>
            ) : (
              <form 
                onSubmit={handleSubscribe} 
                className="flex items-center gap-2 bg-black/50 p-1.5 rounded-full border border-white/10 focus-within:border-white/30 transition-colors"
              >
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address..." 
                  className="bg-transparent border-none text-white px-4 py-2 w-full md:w-64 focus:outline-none text-sm placeholder:text-gray-600"
                />
                <button 
                  type="submit" 
                  className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                >
                  SUBSCRIBE <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h1 className="text-2xl font-bold text-white tracking-widest mb-6 font-mono">
              AETHEX
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Sri Lanka's destination for industrial-grade consumer electronics, smart gadgets, power stations, and precision automotive hardware.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <a 
                href={`tel:${SITE_CONTACT.HOTLINE.replace(/\s+/g, '')}`} 
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{SITE_CONTACT.HOTLINE}</span>
              </a>
              <a 
                href={`mailto:${SITE_CONTACT.EMAIL}`} 
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{SITE_CONTACT.EMAIL}</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Links - Departments */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.15em] uppercase mb-6 font-mono">
              Departments
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {departmentLinks.map((item) => (
                <li key={item.name}>
                  <button 
                    onClick={() => handleCategoryClick(item.filter)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Support */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.15em] uppercase mb-6 font-mono">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {supportLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Policies */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.15em] uppercase mb-6 font-mono">
              Policies
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {policyLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar (Payments & Copyright) */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-500 uppercase tracking-widest mr-2 font-mono">
              Accepted:
            </span>
            {['Cash on Delivery', 'Bank Transfer', 'Koko 3X', 'Mintpay'].map((method) => (
              <span key={method} className="px-3 py-1 rounded-md border border-white/10 bg-white/5 text-xs text-gray-300 font-mono">
                {method}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-6 text-xs text-gray-500 font-mono">
            <p>© {new Date().getFullYear()} AETHEX STORE. ALL RIGHTS RESERVED.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}