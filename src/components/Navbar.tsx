"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { ShoppingBag, Search, Compass, Layers } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { cart, setCartOpen, searchQuery, setSearchQuery } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 bg-[#050505]/80 backdrop-blur-md border-b border-white/5"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-white text-xl font-bold tracking-widest font-display cursor-pointer flex items-center gap-2"
        >
          AETHEX<span className="text-white/40">STORE</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-silver/80 font-medium">
          <Link
            href="/"
            className="hover:text-white transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/products"
            className="hover:text-white transition-colors"
          >
            Catalog
          </Link>
          <Link
            href="/custom-lab"
            className="hover:text-white transition-colors"
          >
            Custom Lab
          </Link>
          <Link
            href="/about-us"
            className="hover:text-white transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {/* Search box */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-silver/40" />
            <input
              type="text"
              placeholder="Search store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder-silver/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all w-48 focus:w-60"
            />
          </div>

          {/* Cart Bag */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Open Cart"
            id="open-cart-navbar"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-white text-[#050505] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
