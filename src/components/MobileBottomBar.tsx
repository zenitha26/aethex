"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { 
  Home, 
  Layers, 
  Heart, 
  ShoppingBag, 
  MessageSquare,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { audioEngine } from "../lib/audio";
import { SITE_CONTACT } from "../constants";

interface MobileBottomBarProps {
  onOpenCategories?: () => void;
}

export default function MobileBottomBar({ onOpenCategories }: MobileBottomBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, setCartOpen } = useCartStore();
  const { wishlist, setWishlistOpen } = useWishlistStore();

  // Hide on checkout, admin, or login pages to avoid redundant navigation
  if (pathname?.startsWith("/checkout") || pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleHome = () => {
    try { audioEngine.playSelect(); } catch {}
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleCategories = () => {
    try { audioEngine.playSelect(); } catch {}
    if (onOpenCategories) {
      onOpenCategories();
    } else {
      router.push("/#products-grid");
    }
  };

  const handleWishlist = () => {
    try { audioEngine.playSelect(); } catch {}
    setWishlistOpen(true);
  };

  const handleCart = () => {
    try { audioEngine.playSelect(); } catch {}
    setCartOpen(true);
  };

  const handleDirectCheckout = () => {
    try { audioEngine.playAcquire(); } catch {}
    router.push("/checkout");
  };

  const handleContact = () => {
    try { audioEngine.playSelect(); } catch {}
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}`, "_blank");
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/85 backdrop-blur-xl border-t border-white/10 px-3 pt-2 pb-safe font-mono shadow-2xl transition-all duration-300">
      
      {/* Dynamic Mobile Sticky Checkout Bar when Cart has items */}
      {totalCartCount > 0 && (
        <div className="mb-2 p-2 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 shadow-inner">
          <div className="pl-2 flex flex-col">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">
              {totalCartCount} {totalCartCount === 1 ? "Item" : "Items"} in Bag
            </span>
            <span className="text-xs font-bold text-white tracking-wider">
              LKR {subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCart}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition"
              title="View Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDirectCheckout}
              className="py-2.5 px-5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 active:scale-95 transition flex items-center gap-1.5 shadow-lg"
            >
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Navigation Icons */}
      <div className="flex items-center justify-around text-[10px] py-1 text-white/50">
        {/* Home */}
        <button
          onClick={handleHome}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            pathname === "/" ? "text-white font-bold" : "hover:text-white"
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* Categories / Catalog */}
        <button
          onClick={handleCategories}
          className="flex flex-col items-center gap-1 py-1 px-3 hover:text-white transition-colors"
        >
          <Layers className="w-4 h-4" />
          <span>Catalog</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="flex flex-col items-center gap-1 py-1 px-3 hover:text-white transition-colors relative"
        >
          <div className="relative">
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-white text-black font-bold text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">
                {wishlist.length}
              </span>
            )}
          </div>
          <span>Saved</span>
        </button>

        {/* Cart */}
        <button
          onClick={handleCart}
          className="flex flex-col items-center gap-1 py-1 px-3 hover:text-white transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-white text-black font-bold text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">
                {totalCartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        {/* Support */}
        <button
          onClick={handleContact}
          className="flex flex-col items-center gap-1 py-1 px-3 hover:text-white transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Support</span>
        </button>
      </div>
    </div>
  );
}
