export const runtime = 'edge';

import { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ContactCard from "../../components/legal/ContactCard";
import Link from "next/link";
import MobileBottomBar from "../../components/MobileBottomBar";

export const metadata: Metadata = {
  title: "Contact Concierge & Customer Support | AETHEX STORE",
  description: "Get in touch with AETHEX STORE in Colombo, Sri Lanka. Direct WhatsApp assistance (+94 78 234 9954), order tracking, vehicle fitment consultation, and courier dispatch support.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-white selection:text-black relative">
      <Navbar />

      <main className="pt-32 pb-24 px-6 sm:px-10 lg:px-12 max-w-[1200px] mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase font-semibold">
            <Link href="/" className="hover:text-white transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span>CUSTOMER SUPPORT & CONCIERGE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-white leading-tight font-mono">
            Contact AETHEX Concierge
          </h1>

          <p className="text-white/60 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            Need vehicle fitment verification, assistance with your bank transfer slip, or real-time courier tracking updates?
            Our Colombo technical desk is active daily to assist you.
          </p>

          <div className="text-[10px] font-mono text-white/40 tracking-wider uppercase pt-2">
            RESPONSE WINDOW: 1–2 HOURS • OPERATING HOURS: 9:00 AM – 8:00 PM (DAILY LK TIME)
          </div>
        </div>

        {/* Contact Desk Component */}
        <ContactCard />
      </main>

      <MobileBottomBar />
      <Footer />
    </div>
  );
}
