import React from "react";
import Link from "next/link";
import Navbar from "../Navbar";
import Footer from "../Footer";
import SupportCTA from "./SupportCTA";

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  category?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  subtitle,
  category = "POLICIES & TERMS",
  lastUpdated = "September 2026",
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="bg-white text-[#111111] min-h-screen font-sans selection:bg-black selection:text-white relative">
      <Navbar />

      <main className="pt-32 pb-24 px-6 sm:px-10 lg:px-12 max-w-[1200px] mx-auto space-y-12">
        
        {/* Breadcrumb & Metadata Header */}
        <div className="space-y-4 border-b border-gray-200 pb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase font-semibold">
            <Link href="/" className="hover:text-black transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span>{category}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-[#111111] leading-tight">
            {title}
          </h1>

          <p className="text-gray-600 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          <div className="text-[10px] font-mono text-gray-400 tracking-wider uppercase pt-2">
            LAST UPDATED: {lastUpdated} • AETHEX STORE (COLOMBO, SRI LANKA)
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-10 text-xs sm:text-sm font-light text-gray-600 leading-relaxed">
            {children}
          </div>

          {/* Sticky Sidebar Support Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <SupportCTA />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
