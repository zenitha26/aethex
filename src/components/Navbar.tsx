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
  MessageSquare,
  Volume2,
  VolumeX
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
  const [isMuted, setIsMuted] = useState(false);

  const supabase = createClient();

  const { cart, setCartOpen, setSearchQuery } = useCartStore();
  const { wishlist, setWishlistOpen } = useWishlistStore();
  const { compareList, setCompareOpen } = useCompareStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    setIsMuted(audioEngine.getMuted());
    const unsubscribe = audioEngine.subscribe((muted) => setIsMuted(muted));
    return () => unsubscribe();
  }, []);

  const handleToggleAudio = () => {
    const nextState = audioEngine.toggleMute();
    setIsMuted(nextState);
    if (!nextState) {
      try { audioEngine.playClick(); } catch {}
    }
  };

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        isScrolled 
          ? "bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 py-2.5 sm:py-3 shadow-2xl" 
          : "bg-[#050505]/60 backdrop-blur-lg border-b border-white/5 py-3.5 sm:py-4"
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Left: Brand Logo & Desktop Nav Links */}
        <div className="flex items-center gap-6 xl:gap-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white/70 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link
              href="/"
              onClick={() => { try { audioEngine.playSelect(); } catch {} }}
              className="flex items-center gap-2 group"
            >
              <span className="text-white text-xl font-bold tracking-[0.25em] uppercase font-mono group-hover:opacity-80 transition-opacity">
                AETHEX
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </Link>
          </div>

          {/* Clean Integrated Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono text-white/60 tracking-wider">
            {onOpenCategories && (
              <button
                onClick={() => onOpenCategories()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white text-white/80 hover:text-black transition-all duration-200 cursor-pointer font-semibold border border-white/10"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Departments</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick("deals-section")}
              className="hover:text-white transition-colors flex items-center gap-1.5 text-white/80"
            >
              <span>Top Deals</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </button>

            <button
              onClick={() => handleNavClick("products-grid")}
              className="hover:text-white transition-colors"
            >
              Catalog
            </button>

            <button
              onClick={() => handleNavClick("hardware-spotlight")}
              className="hover:text-white transition-colors"
            >
              A711 Mount
            </button>

            <Link href="/droplist" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>Droplist</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </Link>

            <Link href="/track-order" className="hover:text-white transition-colors">
              Tracking
            </Link>

            <Link href="/about-us" className="hover:text-white transition-colors">
              About
            </Link>

            <Link href="/contact" className="hover:text-white transition-colors">
              Support
            </Link>
          </nav>
        </div>

        {/* Center: Minimalist Apple-Style Search Capsule */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md items-center bg-white/[0.03] hover:bg-white/[0.06] focus-within:bg-white/[0.08] border border-white/10 rounded-full px-4 py-2 transition-all"
        >
          <Search className="w-4 h-4 text-white/40 shrink-0 mr-2.5" />
          <input
            type="text"
            placeholder="Search precision hardware, cockpit ergonomics..."
            value={localSearch}
            onChange={handleSearchChange}
            className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 outline-none font-mono font-normal"
          />
          {localSearch && (
            <button 
              type="button" 
              onClick={() => { setLocalSearch(""); setSearchQuery(""); }} 
              className="text-white/40 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          )}
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-mono">
          
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Audio Feedback Mute Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center justify-center p-2 rounded-full transition-all border cursor-pointer ${
              isMuted 
                ? "text-white/40 border-transparent hover:text-white/70 hover:bg-white/5" 
                : "text-white border-white/10 bg-white/[0.04] hover:bg-white/10 shadow-xs"
            }`}
            title={isMuted ? "Unmute Interface Audio" : "Mute Interface Audio"}
            aria-label={isMuted ? "Unmute Interface Audio" : "Mute Interface Audio"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/40" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Wishlist Pill */}
          <button
            onClick={() => { try { audioEngine.playSelect(); } catch {}; setWishlistOpen(true); }}
            className="hidden sm:flex items-center gap-1.5 text-white/70 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all relative border border-transparent hover:border-white/10"
            title="View Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Compare Pill */}
          <button
            onClick={() => { try { audioEngine.playSelect(); } catch {}; setCompareOpen(true); }}
            className="hidden sm:flex items-center gap-1.5 text-white/70 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all relative border border-transparent hover:border-white/10"
            title="View Compare"
            aria-label="Compare Products"
          >
            <Scale className="w-4 h-4" />
            {compareList.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Mini Cart Capsule */}
          <button
            onClick={() => { try { audioEngine.playSelect(); } catch {}; setCartOpen(true); }}
            className="flex items-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer shadow-sm text-white"
            aria-label="Shopping Cart"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-white text-black font-bold text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline-block font-semibold text-white text-[11px] font-mono">
              Rs. {subtotal.toLocaleString()}
            </span>
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/account"
                className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all shadow-sm"
                title={user.email}
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[9px] font-bold">
                    {(user.email || "U").charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="max-w-[80px] truncate font-mono">
                  {user.user_metadata?.full_name?.split(" ")[0] || "Account"}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-[11px] text-white/40 hover:text-white hover:underline cursor-pointer font-mono"
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
                className="!bg-white/[0.05] !text-white !border-white/10 hover:!bg-white/[0.1] shadow-xs text-xs"
              />
            </div>
          )}

          {/* Primary Action Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
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
            className="hidden xl:flex bg-white text-black hover:bg-white/90 px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase items-center gap-2 shadow-lg cursor-pointer transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-black" />
            <span>DIRECT ORDER</span>
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
            className="md:hidden px-4 pt-2 pb-3 overflow-hidden bg-[#050505] border-t border-white/5"
          >
            <form 
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white/[0.04] border border-white/10 rounded-full px-4 py-2"
            >
              <Search className="w-4 h-4 text-white/40 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search catalog, hardware..."
                value={localSearch}
                onChange={handleSearchChange}
                autoFocus
                className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 outline-none font-mono"
              />
              <button
                type="submit"
                className="text-xs font-mono font-semibold text-white px-2"
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
            className="lg:hidden bg-[#0B0B0B]/95 backdrop-blur-2xl border-t border-white/10 p-6 space-y-5 text-sm font-mono text-white"
          >
            {/* Mobile Authentication State */}
            {user ? (
              <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-2xl border border-white/10">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 min-w-0"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold shrink-0">
                      {(user.email || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {user.user_metadata?.full_name || "My Account"}
                    </div>
                    <div className="text-[10px] text-white/40 truncate">{user.email}</div>
                  </div>
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                  className="text-xs font-semibold text-white/50 hover:text-white px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <GoogleLoginButton
                  className="w-full justify-center !bg-white !text-black hover:!bg-white/90 shadow-lg py-2.5 font-bold rounded-full"
                  text="Sign in with Google"
                />
              </div>
            )}

            {onOpenCategories && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenCategories(); }}
                className="w-full flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-white" />
                  <span>Browse All Departments</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40" />
              </button>
            )}

            <div className="flex flex-col space-y-3 pt-1 text-white/70 font-medium">
              <button
                onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-left hover:text-white py-1"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("deals-section")}
                className="text-left hover:text-white py-1 font-semibold text-white flex items-center justify-between"
              >
                <span>Top Deals (Drop 01)</span>
                <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-bold">HOT</span>
              </button>
              <button
                onClick={() => handleNavClick("products-grid")}
                className="text-left hover:text-white py-1"
              >
                Shop Catalog
              </button>
              <button
                onClick={() => handleNavClick("hardware-spotlight")}
                className="text-left hover:text-white py-1"
              >
                ASPOR A711 Mount
              </button>
              <Link
                href="/droplist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left hover:text-white py-1 flex items-center justify-between"
              >
                <span>Priority Droplist</span>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/10 font-mono">VIP</span>
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); setCompareOpen(true); }}
                className="text-left hover:text-white py-1 flex items-center justify-between"
              >
                <span>Compare Products</span>
                <span className="text-xs text-white/40">({compareList.length})</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setWishlistOpen(true); }}
                className="text-left hover:text-white py-1 flex items-center justify-between"
              >
                <span>Wishlist</span>
                <span className="text-xs text-white/40">({wishlist.length})</span>
              </button>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1 flex items-center justify-between"
              >
                <span>Track Order Telemetry</span>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/10 font-mono">TRACK</span>
              </Link>
              <Link
                href="/about-us"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                About AETHEX
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                Customer Support & Concierge
              </Link>
              <Link
                href="/policies"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1 text-white/50 text-xs"
              >
                Policies & Legal Directory
              </Link>
            </div>

            {/* Mobile Audio Mute Toggle */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/60">Interface Audio Feedback</span>
              <button
                onClick={handleToggleAudio}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/10 text-xs font-mono text-white hover:border-white transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white/50" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                <span>{isMuted ? "SOUND OFF" : "SOUND ON"}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Phone className="w-3.5 h-3.5" />
                <a href={`tel:${SITE_CONTACT.HOTLINE.replace(/\s+/g, '')}`}>{SITE_CONTACT.HOTLINE}</a>
              </div>
              <span>Islandwide Delivery</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
