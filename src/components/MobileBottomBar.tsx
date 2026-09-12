"use client";

import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { 
  Home, 
  Layers, 
  Heart, 
  ShoppingBag, 
  MessageSquare 
} from "lucide-react";
import { audioEngine } from "../lib/audio";
import { SITE_CONTACT } from "../constants";

interface MobileBottomBarProps {
  onOpenCategories: () => void;
}

export default function MobileBottomBar({ onOpenCategories }: MobileBottomBarProps) {
  const { cart, setCartOpen } = useCartStore();
  const { wishlist, setWishlistOpen } = useWishlistStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleHome = () => {
    try { audioEngine.playSelect(); } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategories = () => {
    try { audioEngine.playSelect(); } catch {}
    onOpenCategories();
  };

  const handleWishlist = () => {
    try { audioEngine.playSelect(); } catch {}
    setWishlistOpen(true);
  };

  const handleCart = () => {
    try { audioEngine.playSelect(); } catch {}
    setCartOpen(true);
  };

  const handleContact = () => {
    try { audioEngine.playSelect(); } catch {}
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}`, "_blank");
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-around font-mono text-[10px] shadow-lg">
      {/* Home */}
      <button
        onClick={handleHome}
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-black py-1 px-3 transition-colors"
      >
        <Home className="w-4 h-4 text-[#111111]" />
        <span>Home</span>
      </button>

      {/* Categories */}
      <button
        onClick={handleCategories}
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-black py-1 px-3 transition-colors"
      >
        <Layers className="w-4 h-4 text-[#111111]" />
        <span>Depts</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-black py-1 px-3 transition-colors relative"
      >
        <div className="relative">
          <Heart className="w-4 h-4 text-[#111111]" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-black text-white font-bold text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">
              {wishlist.length}
            </span>
          )}
        </div>
        <span>Saved</span>
      </button>

      {/* Cart */}
      <button
        onClick={handleCart}
        className="flex flex-col items-center gap-1 text-[#111111] py-1 px-3 transition-colors relative"
      >
        <div className="relative">
          <ShoppingBag className="w-4 h-4 text-[#111111]" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-black text-white font-bold text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">
              {totalCartCount}
            </span>
          )}
        </div>
        <span className="font-bold">Cart</span>
      </button>

      {/* WhatsApp / Help */}
      <button
        onClick={handleContact}
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-black py-1 px-3 transition-colors"
      >
        <MessageSquare className="w-4 h-4 text-[#111111]" />
        <span>Support</span>
      </button>
    </div>
  );
}
