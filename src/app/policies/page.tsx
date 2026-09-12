export const runtime = 'edge';

import { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, FileText, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Policies & Legal Center | AETHEX STORE",
  description: "Official policies, shipping rules, return guarantees, and terms for AETHEX STORE in Sri Lanka.",
};

const POLICY_LINKS = [
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    desc: "How we collect, use, and protect your customer and order data for courier fulfillment.",
    icon: FileText,
  },
  {
    title: "Terms & Conditions",
    href: "/terms",
    desc: "Operating terms, order acceptance, pricing in LKR, Cash on Delivery, and driver safety responsibilities.",
    icon: FileText,
  },
  {
    title: "Shipping & Delivery",
    href: "/shipping",
    desc: "Islandwide delivery to all 25 districts, estimated 24–48h / 2–3 day windows, and flat-rate charges.",
    icon: Truck,
  },
  {
    title: "Returns & Refunds",
    href: "/returns",
    desc: "Our 7-day replacement guarantee for damaged or defective items and simple WhatsApp exchange process.",
    icon: RotateCcw,
  },
  {
    title: "Warranty Policy",
    href: "/warranty",
    desc: "Coverage details for manufacturing defects on the ASPOR A711 and hardware accessories.",
    icon: ShieldCheck,
  },
  {
    title: "Frequently Asked Questions",
    href: "/faq",
    desc: "Common questions regarding vehicle fitment (65–95mm), phone compatibility, and COD payments.",
    icon: HelpCircle,
  },
];

export default function PoliciesIndexPage() {
  return (
    <div className="bg-white text-[#111111] min-h-screen font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24 px-6 sm:px-10 lg:px-12 max-w-[1200px] mx-auto space-y-12">
        <div className="space-y-4 border-b border-gray-200 pb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase font-semibold">
            <Link href="/" className="hover:text-black transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span>LEGAL & POLICIES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-[#111111] leading-tight">
            Policies & Operations
          </h1>

          <p className="text-gray-600 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            Transparent, straightforward documentation outlining our delivery logistics, 7-day replacement warranty, customer privacy, and terms of service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POLICY_LINKS.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-[#F9F9F9] border border-gray-200 hover:border-black p-6 space-y-4 transition-all group block cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-4 h-4 text-black group-hover:text-black transition-colors" />
                    <h2 className="text-base font-mono uppercase text-[#111111] tracking-wide font-semibold">
                      {item.title}
                    </h2>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
