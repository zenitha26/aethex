"use client";

import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Truck,
  LockKeyhole,
} from "lucide-react";
import { SITE_CONTACT } from "../constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#050505]">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-[95rem] mx-auto px-8 md:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-white text-3xl font-bold tracking-[0.25em] mb-4">
              AETHEX
              <span className="text-white/40">STORE</span>
            </div>

            <p className="mt-4 text-xs text-silver/40 font-light leading-relaxed max-w-sm">
              Premium setups and custom keyboards. Streamlined WhatsApp ordering.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-col gap-3 mt-8">
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Truck size={16} />
                <span>Islandwide Delivery Available</span>
              </div>

              <div className="flex items-center gap-3 text-white/60 text-sm">
                <ShieldCheck size={16} />
                <span>Verified Product Suppliers</span>
              </div>

              <div className="flex items-center gap-3 text-white/60 text-sm">
                <MapPin size={16} />
                <span>Sri Lanka Focused Store</span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={SITE_CONTACT.WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-5 py-3 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition-all duration-300"
            >
              <MessageCircle size={16} />
              Order via WhatsApp
            </a>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.25em] uppercase mb-6">
              Shop
            </h4>

            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Best Sellers
                </Link>
              </li>

              <li>
                <Link
                  href="/custom-lab"
                  className="hover:text-white transition-colors"
                >
                  Custom Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.25em] uppercase mb-6">
              Support
            </h4>

            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/policies"
                  className="hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/policies"
                  className="hover:text-white transition-colors"
                >
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="mt-16 rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-white text-xl font-bold">
              Need help choosing a product?
            </h3>

            <p className="text-white/50 text-sm mt-2">
              Chat directly with our team and get personalized recommendations.
            </p>
          </div>

          <a
            href={SITE_CONTACT.WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-all duration-300"
          >
            Chat Now
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {currentYear} AETHEX Store. All Rights Reserved.
          </p>



          <div className="flex flex-wrap gap-6 text-xs text-white/30">
            <Link
              href="/policies#privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              href="/policies#terms"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>

            <Link
              href="/about-us"
              className="hover:text-white transition-colors"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}