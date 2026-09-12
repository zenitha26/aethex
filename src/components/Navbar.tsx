"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Heart, 
  Scale, 
  ShoppingBag, 
  Menu, 
  X, 
  Layers, 
  ArrowRight,
  Phone,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { audioEngine } from "../lib/audio";
import { SITE_CONTACT } from "../constants";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCompareStore } from "../store/useCompareStore";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import GoogleLoginButton from "./auth/GoogleLoginButton";

interface NavbarProps {
  onOpenCategories?: () => void;
  onOpenOrder?: () => void;
}

export default function Navbar({ onOpenCategories, onOpenOrder }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(null);

  const supabase = createClient();

  const { cart, setCartOpen, setSearchQuery } = useCartStore();
  const { wishlist, setWishlistOpen } = useWishlistStore();
  const { compareList, setCompareOpen } = useCompareStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      audioEngine.playClick();
    } catch {}
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try { audioEngine.playSelect(); } catch {}
    setSearchQuery(localSearch);
    setMobileSearchOpen(false);
    const el = document.getElementById("products-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    setSearchQuery(val);
  };

  const handleNavClick = (sectionId: string) => {
    try { audioEngine.playSelect(); } catch {}
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        isScrolled 
          ? "bg-white/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] py-2.5 sm:py-3" 
          : "bg-white/60 backdrop-blur-lg py-3.5 sm:py-4"
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Left: Brand Logo & Desktop Nav Links */}
        <div className="flex items-center gap-6 xl:gap-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[#111111] p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link
              href="/"
              onClick={() => { try { audioEngine.playSelect(); } catch {} }}
              className="flex items-center gap-2 group"
            >
              <span className="text-[#111111] text-xl font-bold tracking-[0.25em] uppercase font-mono group-hover:opacity-80 transition-opacity">
                AETHEX
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-black" />
            </Link>
          </div>

          {/* Clean Integrated Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-gray-600 tracking-wide">
            {onOpenCategories && (
              <button
                onClick={() => onOpenCategories()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-100/90 hover:bg-black hover:text-white text-gray-900 transition-all duration-200 cursor-pointer font-semibold shadow-xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Departments</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick("deals-section")}
              className="hover:text-black transition-colors flex items-center gap-1 font-semibold text-[#111111]"
            >
              <span>Top Deals</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </button>

            <button
              onClick={() => handleNavClick("products-grid")}
              className="hover:text-black transition-colors"
            >
              Catalog
            </button>

            <button
              onClick={() => handleNavClick("hardware-spotlight")}
              className="hover:text-black transition-colors"
            >
              A711 Mount
            </button>

            <Link href="/about-us" className="hover:text-black transition-colors">
              About
            </Link>
          </nav>
        </div>

        {/* Center: Minimalist Apple-Style Search Capsule */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md items-center bg-gray-100/90 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10 rounded-full px-4 py-2 transition-all"
        >
          <Search className="w-4 h-4 text-gray-400 shrink-0 mr-2.5" />
          <input
            type="text"
            placeholder="Search catalog, hardware, audio..."
            value={localSearch}
            onChange={handleSearchChange}
            className="flex-1 bg-transparent text-xs text-[#111111] placeholder:text-gray-400 outline-none font-normal"
          />
          {localSearch && (
            <button 
              type="button" 
              onClick={() => { setLocalSearch(""); setSearchQuery(""); }} 
              className="text-gray-400 hover:text-black text-xs px-1"
            >
              ✕
            </button>
          )}
        </form>

        {/* Right: Actions (Mobile search toggle, Wishlist, Compare, Cart, WhatsApp CTA) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden text-[#111111] p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Pill */}
          <button
            onClick={() => { try { audioEngine.playSelect(); } catch {}; setWishlistOpen(true); }}
            className="hidden sm:flex items-center gap-1.5 text-gray-700 hover:text-black p-2 hover:bg-gray-100 rounded-full transition-all relative"
            title="View Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Compare Pill */}
          <button
            onClick={() => { try { audioEngine.playSelect(); } catch {}; setCompareOpen(true); }}
            className="hidden sm:flex items-center gap-1.5 text-gray-700 hover:text-black p-2 hover:bg-gray-100 rounded-full transition-all relative"
            title="View Compare"
            aria-label="Compare Products"
          >
            <Scale className="w-4 h-4" />
            {compareList.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Mini Cart Capsule */}
          <button
            onClick={() => { try { audioEngine.playSelect(); } catch {}; setCartOpen(true); }}
            className="flex items-center gap-2.5 bg-gray-100 hover:bg-gray-200/80 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer shadow-xs"
            aria-label="Shopping Cart"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#111111]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-black text-white font-bold text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline-block font-semibold text-[#111111] text-[11px]">
              Rs. {subtotal.toLocaleString()}
            </span>
          </button>

          {/* User Auth Section: Account Avatar or Google Login Button */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/account"
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-xs font-semibold text-[#111111] transition-all shadow-xs"
                title={user.email}
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold">
                    {(user.email || "U").charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="max-w-[80px] truncate">
                  {user.user_metadata?.full_name?.split(" ")[0] || "Account"}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-[11px] text-gray-500 hover:text-black hover:underline cursor-pointer"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center">
              <GoogleLoginButton
                compact
                text="Sign In"
                className="!bg-black !text-white !border-black hover:!bg-neutral-800 shadow-xs text-xs"
              />
            </div>
          )}

          {/* Primary Action Button (Smooth Framer Motion Rounded-Full) */}
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => {
              try { audioEngine.playAcquire(); } catch {}
              if (onOpenOrder) {
                onOpenOrder();
              } else {
                window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=Hello%20AETHEX,%20I'd%20like%20to%20place%20an%20order.`, "_blank");
              }
            }}
            className="hidden xl:flex bg-black text-white hover:bg-neutral-800 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase items-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ORDER (COD)</span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-4 pt-2 pb-3 overflow-hidden"
          >
            <form 
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-gray-100 rounded-full px-4 py-2"
            >
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search products, automotive..."
                value={localSearch}
                onChange={handleSearchChange}
                autoFocus
                className="flex-1 bg-transparent text-xs text-[#111111] outline-none"
              />
              <button
                type="submit"
                className="text-xs font-semibold text-black px-2"
              >
                Go
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 p-6 space-y-5 text-sm"
          >
            {/* Mobile Authentication State */}
            {user ? (
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 min-w-0"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {(user.email || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-black truncate">
                      {user.user_metadata?.full_name || "My Account"}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
                  </div>
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                  className="text-xs font-semibold text-gray-500 hover:text-black px-2.5 py-1 rounded-md hover:bg-gray-200 transition-colors shrink-0 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <GoogleLoginButton
                  className="w-full justify-center !bg-black !text-white !border-black hover:!bg-neutral-800 shadow-sm py-2.5"
                  text="Sign in with Google"
                />
              </div>
            )}

            {onOpenCategories && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenCategories(); }}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl text-black font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4" />
                  <span>Browse All Departments</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            )}

            <div className="flex flex-col space-y-3 pt-1 text-gray-700 font-medium">
              <button
                onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-left hover:text-black py-1"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("deals-section")}
                className="text-left hover:text-black py-1 font-semibold text-black flex items-center justify-between"
              >
                <span>Top Deals (Flash Sale)</span>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">HOT</span>
              </button>
              <button
                onClick={() => handleNavClick("products-grid")}
                className="text-left hover:text-black py-1"
              >
                Shop Catalog
              </button>
              <button
                onClick={() => handleNavClick("hardware-spotlight")}
                className="text-left hover:text-black py-1"
              >
                ASPOR A711 Mount
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setCompareOpen(true); }}
                className="text-left hover:text-black py-1 flex items-center justify-between"
              >
                <span>Compare Products</span>
                <span className="text-xs text-gray-400">({compareList.length})</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setWishlistOpen(true); }}
                className="text-left hover:text-black py-1 flex items-center justify-between"
              >
                <span>Wishlist</span>
                <span className="text-xs text-gray-400">({wishlist.length})</span>
              </button>
              <Link
                href="/about-us"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-black py-1"
              >
                About AETHEX
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-black py-1"
              >
                Contact & Showroom
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5 text-black font-semibold">
                <Phone className="w-3.5 h-3.5" />
                <a href={`tel:${SITE_CONTACT.HOTLINE.replace(/\s+/g, '')}`}>{SITE_CONTACT.HOTLINE}</a>
              </div>
              <span>Islandwide COD Delivery</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
