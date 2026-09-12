"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useCartStore } from "../store/useCartStore";
import { CartItem } from "../types/cart";
import { Plus, Minus, Trash2, X, ShoppingBag, MessageSquare, ArrowRight, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { audioEngine } from "../lib/audio";
import { SITE_CONTACT } from "../constants";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

const CartItemRow = memo(({ 
  item, 
  onUpdate, 
  onRemove, 
}: { 
  item: CartItem; 
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) => {
  const playHover = () => {
    try { audioEngine.playClick(); } catch {}
  };
  const playSelect = () => {
    try { audioEngine.playSelect(); } catch {}
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="flex gap-4 py-4 border-b border-gray-100 relative group bg-white"
    >
      <div className="w-20 h-20 bg-[#F9F9F9] flex items-center justify-center relative overflow-hidden shrink-0 border border-gray-200">
        {item.image ? (
          <Image 
            src={item.image} 
            alt={item.title} 
            fill 
            sizes="80px"
            className="object-cover p-1.5" 
          />
        ) : (
          <div className="w-8 h-8 bg-gray-100" />
        )}
      </div>

      <div className="flex-grow flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2 pr-6">
            <h4 className="text-[#111111] text-xs font-mono uppercase tracking-wider line-clamp-2 leading-snug font-semibold">
              {item.title}
            </h4>
          </div>
          {item.color && (
            <p className="text-gray-500 text-[10px] font-mono tracking-wider mt-0.5">
              Variant: {item.color}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-300 px-2 py-0.5 font-mono text-xs bg-[#F9F9F9]">
            <button 
              onClick={() => { playSelect(); onUpdate(item.id, -1); }} 
              onMouseEnter={playHover}
              aria-label="Decrease" 
              className="text-gray-600 hover:text-black p-1 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-[#111111] w-6 text-center font-bold text-xs">{item.quantity}</span>
            <button 
              onClick={() => { playSelect(); onUpdate(item.id, 1); }} 
              onMouseEnter={playHover}
              aria-label="Increase" 
              className="text-gray-600 hover:text-black p-1 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <span className="text-black font-mono text-xs font-bold">
            Rs. {(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>

      <button 
        onClick={() => { playSelect(); onRemove(item.id); }} 
        onMouseEnter={playHover}
        className="absolute top-4 right-0 text-gray-400 hover:text-black transition-colors"
        title="Remove"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
});
CartItemRow.displayName = "CartItemRow";

export default function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart } = useCartStore();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) setCartOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setCartOpen]);

  const subtotal = cart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);

  const handleUpdate = useCallback((id: string, qty: number) => updateQuantity(id, qty), [updateQuantity]);
  const handleRemove = useCallback((id: string) => removeFromCart(id), [removeFromCart]);

  const handleWhatsAppCheckout = useCallback(() => {
    try { audioEngine.playAcquire(); } catch {}
    setCartOpen(false);
    const itemsList = cart.map(item => `• ${item.title} (${item.quantity}x) - Rs. ${(item.price * item.quantity).toLocaleString()}`).join('\n');
    const text = encodeURIComponent(`Hello AETHEX Store, I would like to place an order:\n\n${itemsList || "• ASPOR A711 360° Console Mount (1x)"}\n\nSubtotal: Rs. ${subtotal.toLocaleString()} LKR + Islandwide Delivery\nPayment: Cash on Delivery (COD)\n\nPlease confirm availability and dispatch.`);
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${text}`, "_blank");
  }, [cart, subtotal, setCartOpen]);

  const handleDirectCheckout = useCallback(() => {
    try { audioEngine.playSelect(); } catch {}
    setCartOpen(false);
    router.push("/checkout");
  }, [router, setCartOpen]);

  const drawerVariants: Variants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0, 
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } 
    },
    exit: { x: "100%", transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
  };

  const playHover = () => {
    try { audioEngine.playClick(); } catch {}
  };
  const playSelect = () => {
    try { audioEngine.playSelect(); } catch {}
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-[100]"
          />

          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            className="fixed right-0 top-0 bottom-0 w-full max-w-[440px] bg-white border-l border-gray-200 z-[101] shadow-2xl flex flex-col justify-between font-sans text-[#111111]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-[#F9F9F9]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-black" />
                <h2 className="text-[#111111] text-sm font-mono tracking-[0.2em] uppercase font-bold">
                  CART <span className="text-gray-500">({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                </h2>
              </div>
              
              <button 
                onClick={() => { playSelect(); setCartOpen(false); }} 
                onMouseEnter={playHover}
                className="text-gray-500 hover:text-black p-1 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Item List */}
            <div className="flex-grow overflow-y-auto px-6 py-4 flex flex-col divide-y divide-gray-100 bg-white">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-4 text-gray-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <p className="text-[#111111] text-xs font-mono uppercase tracking-wider mb-2 font-bold">
                    Your Cart Is Empty
                  </p>
                  <p className="text-gray-500 text-xs font-light max-w-xs mb-6">
                    Browse our catalog and add items to your cart.
                  </p>
                  <button
                    onClick={() => { playSelect(); setCartOpen(false); }}
                    onMouseEnter={playHover}
                    className="border border-gray-300 text-[#111111] px-6 py-2.5 text-xs font-mono uppercase tracking-widest hover:border-black transition-colors shadow-xs"
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item: CartItem) => (
                    <CartItemRow 
                      key={item.id} 
                      item={item} 
                      onUpdate={handleUpdate} 
                      onRemove={handleRemove} 
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer / Subtotal & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-[#F9F9F9] space-y-4">
                <div className="space-y-1.5 pb-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-600 uppercase tracking-wider font-medium">Subtotal:</span>
                    <span className="text-black text-lg font-bold">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>Shipping:</span>
                    <span>Calculated at checkout (Islandwide)</span>
                  </div>
                  <div className="text-[10px] font-mono text-gray-600 pt-1">
                    Or 3 interest-free payments of <span className="text-black font-bold">Rs. {Math.round(subtotal / 3).toLocaleString()}</span> with Koko
                  </div>
                </div>

                {/* User Authentication Status or Google Login Trigger */}
                {user ? (
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
                    <Link
                      href="/account"
                      onClick={() => setCartOpen(false)}
                      className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
                    >
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Avatar"
                          className="w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0"
                        />
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {(user.email || "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-black truncate">
                          {user.user_metadata?.full_name || "My Account"}
                        </div>
                        <div className="text-[9px] text-gray-500 truncate">{user.email}</div>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="text-[11px] font-medium text-gray-500 hover:text-black underline cursor-pointer shrink-0 ml-2"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-600 font-medium">Quick Sign In</span>
                      <span className="text-[10px] text-gray-400">Save address & orders</span>
                    </div>
                    <GoogleLoginButton
                      className="w-full justify-center !bg-black !text-white !border-black hover:!bg-neutral-800 shadow-xs py-2 text-xs"
                      text="Sign in with Google"
                    />
                  </div>
                )}

                <div className="space-y-2.5">
                  <button
                    onClick={handleDirectCheckout}
                    onMouseEnter={playHover}
                    className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3.5 text-xs font-mono font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>CHECKOUT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleWhatsAppCheckout}
                    onMouseEnter={playHover}
                    className="w-full bg-white border border-gray-300 text-[#111111] hover:border-black transition-all py-3 text-xs font-mono font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>ORDER VIA WHATSAPP (COD)</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}