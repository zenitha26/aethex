export const runtime = 'edge';

import Link from "next/link";
import { ArrowRight, Mail, SendHorizonal, Truck, ShieldCheck, RotateCcw, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // මේක අනිවාර්යයි
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/products";
import { SITE_CONTACT } from "@/constants";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AETHEX Store | Premium E-Commerce",
  description: "Discover precision-crafted mechanical systems, acoustic modules, and refined workspace peripherals.",
  openGraph: {
    title: "AETHEX Store | Premium E-Commerce",
    description: "Discover precision-crafted mechanical systems, acoustic modules, and refined workspace peripherals.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AETHEX Store | Premium E-Commerce",
    description: "Discover precision-crafted mechanical systems, acoustic modules, and refined workspace peripherals.",
  }
};

export default async function Home() {
  let products = await getProducts();
  // Ensure exactly 2 products are shown as requested
  products = products.slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AETHEX Store",
            "url": "https://aethexstore.com"
          })
        }}
      />
      {/* Background blobs */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-[#050505] to-[#050505]" id="home">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-6 relative z-10">
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-extrabold border border-white/5 bg-white/[0.02] px-3.5 py-1 rounded-full">
            Engineered for the Modern Workspace
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter whitespace-nowrap">
            AETHEX <span className="font-light">STORE</span>
          </h1>
          <p className="text-silver/60 text-base md:text-xl max-w-2xl font-light leading-relaxed">
            Discover precision-crafted mechanical systems, acoustic modules, and refined workspace peripherals. Designed for those who demand excellence.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
            <Button asChild className="apple-btn text-sm py-6 px-8 font-semibold" id="hero-explore-btn">
              <Link href="/products">Explore Catalog <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="outline" className="apple-btn-outline text-sm py-6 px-8 font-medium">
              <Link href="/products">New Arrivals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Badges section */}
      <section className="py-20 border-t border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureItem icon={<Truck />} title="Complimentary Shipping" desc="Seamless, fast delivery to any location in Sri Lanka." />
          <FeatureItem icon={<ShieldCheck />} title="AETHEX Protection" desc="Comprehensive coverage and hassle-free replacement support." />
          <FeatureItem icon={<RotateCcw />} title="Verified Authenticity" desc="Directly sourced with rigorous quality assurance." />
        </div>
      </section>

      {/* Featured Products Collection */}
      <section className="max-w-7xl mx-auto px-6 py-20" id="products-catalog-section">
        <div className="flex justify-between items-baseline mb-12">
          <div>
            <span className="text-[10px] text-silver/40 uppercase tracking-widest font-bold">Featured Catalog</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white mt-1">CURATED CATALOG</h2>
          </div>
          <Link href="/products" className="text-xs text-silver/60 hover:text-white transition-colors flex items-center gap-1.5 font-semibold uppercase tracking-wider">
            All Products <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ProductGrid initialProducts={products} />
      </section>



      {/* WhatsApp CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="luxury-glass p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-white/[0.01] to-transparent">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-white text-2xl md:text-3xl font-bold font-display">Personalized Setup Consultations</h2>
            <p className="text-silver/50 text-xs md:text-sm font-light max-w-md">
              Need expert assistance designing your desk aesthetics or selecting precise hardware switches? Speak directly with our design curators.
            </p>
          </div>
          <a href={SITE_CONTACT.WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-6 py-4 bg-white text-black hover:bg-[#e5e5ea] rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300">
            <MessageSquare className="h-4 w-4" /> Consult on WhatsApp
          </a>
        </div>
      </section>

      <CartDrawer />
      <Footer />
    </>
  );
}

// Helpers
function FeatureItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-neutral-400">{icon}</div>
      <div>
        <h4 className="text-white text-sm font-semibold">{title}</h4>
        <p className="text-silver/40 text-xs">{desc}</p>
      </div>
    </div>
  );
}
