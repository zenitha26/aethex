"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  Layers, 
  ArrowRight,
  Phone,
  User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONTACT } from "../constants";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import GoogleLoginButton from "./auth/GoogleLoginButton";
import AethexLogo from "./brand/AethexLogo";

interface NavbarProps {
  onOpenCategories?: () => void;
  onOpenOrder?: () => void;
}

export default function Navbar({ onOpenCategories }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(null);

  const supabase = createClient();
  const { cart, setCartOpen, setSearchQuery } = useCartStore();
  const { wishlist, setWishlistOpen } = useWishlistStore();

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
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

            <AethexLogo size="md" showWordmark={true} isLink={true} />
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-mono tracking-[0.16em] uppercase">
            <Link
              href="/products"
              className="text-white/70 hover:text-white transition-colors relative py-1 hover:underline underline-offset-8"
            >
              Products
            </Link>

            <Link
              href="/about-us"
              className="text-white/70 hover:text-white transition-colors relative py-1 hover:underline underline-offset-8"
            >
              About
            </Link>

            <Link
              href="/track-order"
              className="text-white/70 hover:text-white transition-colors relative py-1 hover:underline underline-offset-8"
            >
              Track Order
            </Link>

            <Link
              href="/contact"
              className="text-white/70 hover:text-white transition-colors relative py-1 hover:underline underline-offset-8"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Center: Search Capsule */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md items-center bg-white/[0.03] hover:bg-white/[0.06] focus-within:bg-white/[0.08] border border-white/10 rounded-full px-4 py-2 transition-all"
        >
          <Search className="w-4 h-4 text-white/40 shrink-0 mr-2.5" />
          <input
            type="text"
            placeholder="Search car accessories, mounts, chargers..."
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

          {/* Wishlist Button */}
          <button
            onClick={() => setWishlistOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-white/70 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all relative border border-transparent hover:border-white/10 cursor-pointer"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer shadow-xs text-white"
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
                className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all shadow-xs"
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
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-mono font-medium transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-white/70" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
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
                placeholder="Search car accessories, mounts, chargers..."
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
                className="w-full flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-white" />
                  <span>Browse Categories</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40" />
              </button>
            )}

            <div className="flex flex-col space-y-3 pt-1 text-white/70 font-medium">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left hover:text-white py-1"
              >
                Products
              </Link>
              <Link
                href="/about-us"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left hover:text-white py-1"
              >
                About
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1 flex items-center justify-between"
              >
                <span>Track Order</span>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/10 font-mono">TRACK</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                Contact
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); setWishlistOpen(true); }}
                className="text-left hover:text-white py-1 flex items-center justify-between cursor-pointer"
              >
                <span>Wishlist</span>
                <span className="text-xs text-white/40">({wishlist.length})</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setCartOpen(true); }}
                className="text-left hover:text-white py-1 flex items-center justify-between cursor-pointer"
              >
                <span>Cart</span>
                <span className="text-xs text-white/40">({totalCartCount})</span>
              </button>
              {user && (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-white py-1 text-white"
                >
                  Account
                </Link>
              )}
              <Link
                href="/policies"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1 text-white/50 text-xs"
              >
                Policies & Legal
              </Link>
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
