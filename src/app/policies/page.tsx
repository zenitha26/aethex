export const runtime = 'edge';

import { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MobileBottomBar from "../../components/MobileBottomBar";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, FileText, HelpCircle, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Policies & Legal Operations Center | AETHEX STORE",
  description: "Official policies, shipping rules, return guarantees, privacy guidelines, and terms of service for AETHEX STORE in Sri Lanka.",
};

const POLICY_LINKS = [
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    desc: "Complete disclosure on Supabase authentication, AI bank slip OCR processing, local browser storage, and courier data transmission.",
    icon: Lock,
  },
  {
    title: "Terms & Conditions",
    href: "/terms",
    desc: "Commercial sales rules, pricing in LKR, Cash on Delivery terms, bank slip verification, and critical driver safety notices.",
    icon: FileText,
  },
  {
    title: "Shipping & Delivery",
    href: "/shipping",
    desc: "Islandwide logistics covering all 25 districts, dispatch windows, flat Rs. 350 rate, and free multi-unit bundle shipping.",
    icon: Truck,
  },
  {
    title: "Returns & Refunds",
    href: "/returns",
    desc: "Our universal 7-day doorstep replacement guarantee, 1-to-1 courier exchange process, and direct bank refund terms.",
    icon: RotateCcw,
  },
  {
    title: "Warranty Policy",
    href: "/warranty",
    desc: "Category coverage tiers (AETHEX 1-year, LDNIO power, Titanium EDC lifetime handle guarantee, ASPOR 7-day replacement).",
    icon: ShieldCheck,
  },
  {
    title: "Frequently Asked Questions",
    href: "/faq",
    desc: "Answers regarding vehicle console fitment (65–95mm), smartphone sizes, order telemetry tracking, and COD payments.",
    icon: HelpCircle,
  },
];

export default function PoliciesIndexPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-white selection:text-black relative">
      <Navbar />

      <main className="pt-32 pb-24 px-6 sm:px-10 lg:px-12 max-w-[1200px] mx-auto space-y-12">
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase font-semibold">
            <Link href="/" className="hover:text-white transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span>LEGAL & POLICIES DIRECTORY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-white leading-tight font-mono">
            Policies & Operations Hub
          </h1>

          <p className="text-white/60 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            Transparent, straightforward documentation outlining our delivery logistics, 7-day replacement warranty, data privacy, and commercial terms across Sri Lanka.
          </p>

          <div className="text-[10px] font-mono text-white/40 tracking-wider uppercase pt-2">
            GOVERNING STATUTES: DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA • REVISED SEPTEMBER 2026
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POLICY_LINKS.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-[#0B0B0B] border border-white/10 hover:border-white/40 p-6 space-y-4 transition-all group block cursor-pointer shadow-xl hover:bg-[#111111]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    <h2 className="text-base font-mono uppercase text-white tracking-wide font-medium">
                      {item.title}
                    </h2>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-xs text-white/60 font-light leading-relaxed">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </main>

      <MobileBottomBar />
      <Footer />
    </div>
  );
}
