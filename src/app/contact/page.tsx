export const runtime = 'edge';

import { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ContactCard from "../../components/legal/ContactCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Support | AETHEX STORE",
  description: "Get in touch with AETHEX STORE in Colombo, Sri Lanka. Contact us via WhatsApp (+94 78 234 9954) or email for order support, vehicle fitment advice, and dispatch inquiries.",
};

export default function ContactPage() {
  return (
    <div className="bg-white text-[#111111] min-h-screen font-sans selection:bg-black selection:text-white relative">
      <Navbar />

      <main className="pt-32 pb-24 px-6 sm:px-10 lg:px-12 max-w-[1200px] mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-gray-200 pb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase font-semibold">
            <Link href="/" className="hover:text-black transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span>CUSTOMER SUPPORT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-[#111111] leading-tight">
            Contact AETHEX
          </h1>

          <p className="text-gray-600 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            Need help choosing the right fit for your vehicle, checking an order status, or arranging an exchange? 
            Our Colombo support desk is here to assist you.
          </p>
        </div>

        {/* Contact Desk Component */}
        <ContactCard />
      </main>

      <Footer />
    </div>
  );
}
