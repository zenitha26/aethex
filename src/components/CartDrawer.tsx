"use client";

import { useState, useEffect, useCallback, memo, useOptimistic, useTransition } from "react";
import { useCartStore } from "../store/useCartStore";
import { CartItem } from "../types/cart";
import { Plus, Minus, Trash2, X, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { updateCartQuantityAction, removeCartItemAction } from "@/app/actions/cart";

type CartOptimisticAction =
  | { type: "UPDATE"; id: string; delta: number }
  | { type: "REMOVE"; id: string };

const CartItemRow = memo(({ 
  item, 
  onUpdate, 
  onRemove, 
}: { 
  item: CartItem; 
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) => {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 py-4 border-b border-white/5 relative group bg-transparent"
    >
      <div className="w-20 h-20 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0">
        {item.image ? (
          <Image 
            src={item.image} 
            alt={item.title} 
            fill 
            sizes="80px"
            className="object-cover p-1.5 transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center font-mono text-[9px] text-white/30">
            ITEM
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2 pr-6">
            <h4 className="text-white text-xs font-mono uppercase tracking-wider line-clamp-2 leading-snug font-semibold">
              {item.title}
            </h4>
          </div>
          {item.color && (
            <p className="text-white/40 text-[10px] font-mono tracking-wider mt-0.5">
              Color: {item.color}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-white/10 rounded-lg px-2 py-0.5 font-mono text-xs bg-white/[0.03]">
            <button 
              onClick={() => onUpdate(item.id, -1)} 
              aria-label="Decrease quantity" 
              className="text-white/60 hover:text-white p-1 transition-colors cursor-pointer"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-white w-6 text-center font-bold text-xs">{item.quantity}</span>
            <button 
              onClick={() => onUpdate(item.id, 1)} 
              aria-label="Increase quantity" 
              className="text-white/60 hover:text-white p-1 transition-colors cursor-pointer"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <span className="text-white font-mono text-xs font-bold">
            Rs. {(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>

      <button 
        onClick={() => onRemove(item.id)} 
        className="absolute top-4 right-0 text-white/30 hover:text-white transition-colors p-1 cursor-pointer"
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
  const [, startTransition] = useTransition();
  const supabase = createClient();

  const [optimisticCart, setOptimisticCart] = useOptimistic(
    cart,
    (currentCart: CartItem[], action: CartOptimisticAction) => {
      switch (action.type) {
        case "UPDATE":
          return currentCart
            .map((item) =>
              item.id === action.id
                ? { ...item, quantity: Math.max(1, item.quantity + action.delta) }
                : item
            )
            .filter((item) => item.quantity > 0);
        case "REMOVE":
          return currentCart.filter((item) => item.id !== action.id);
        default:
          return currentCart;
      }
    }
  );

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

  const subtotal = optimisticCart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);

  const handleUpdate = useCallback(
    (id: string, delta: number) => {
      startTransition(async () => {
        setOptimisticCart({ type: "UPDATE", id, delta });

        try {
          await updateCartQuantityAction(id, delta);
        } catch (err) {
          console.warn("Cart update server action notice:", err);
        }

        updateQuantity(id, delta);
      });
    },
    [updateQuantity, setOptimisticCart]
  );

  const handleRemove = useCallback(
    (id: string) => {
      startTransition(async () => {
        setOptimisticCart({ type: "REMOVE", id });

        try {
          await removeCartItemAction(id);
        } catch (err) {
          console.warn("Cart remove server action notice:", err);
        }

        removeFromCart(id);
      });
    },
    [removeFromCart, setOptimisticCart]
  );

  const handleDirectCheckout = useCallback(() => {
    setCartOpen(false);
    router.push("/checkout");
  }, [router, setCartOpen]);

  const drawerVariants: Variants = {
    hidden: { x: "100%", opacity: 0.8 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } 
    },
    exit: { 
      x: "100%", 
      opacity: 0.8, 
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100]"
          />

          {/* Cart Drawer Panel */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label="Shopping Cart Drawer"
            className="fixed right-0 top-0 bottom-0 w-full max-w-[440px] bg-[#0B0B0B] border-l border-white/10 z-[101] shadow-2xl flex flex-col justify-between font-sans text-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <h2 className="text-white text-xs font-mono tracking-[0.2em] uppercase font-bold">
                    YOUR CART <span className="text-white/40">({optimisticCart.reduce((s, i) => s + i.quantity, 0)})</span>
                  </h2>
                  <p className="text-[10px] font-mono text-white/40">Fast Delivery Across Sri Lanka</p>
                </div>
              </div>
              
              <button 
                onClick={() => setCartOpen(false)} 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Delivery banner */}
            <div className="px-6 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center gap-2 text-[11px] font-mono text-white/70">
              <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Free delivery across Sri Lanka on all orders</span>
            </div>

            {/* Item List */}
            <div className="flex-grow overflow-y-auto px-6 py-4 flex flex-col divide-y divide-white/5 custom-scrollbar">
              {optimisticCart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-24 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/30">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white text-xs font-mono uppercase tracking-widest font-bold">
                      Your Cart is Empty
                    </p>
                    <p className="text-white/40 text-xs font-mono max-w-xs">
                      Browse our collection of car accessories to get started.
                    </p>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-2 px-6 py-3 rounded-full border border-white/20 text-white text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xs cursor-pointer"
                  >
                    Shop Products
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {optimisticCart.map((item: CartItem) => (
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

            {/* Footer / Subtotal & Checkout Trigger */}
            {optimisticCart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#070707] space-y-4">
                <div className="space-y-1.5 pb-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white/50 uppercase tracking-widest font-medium">Subtotal</span>
                    <span className="text-white text-lg font-bold">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                    <span>Delivery</span>
                    <span className="text-emerald-400">FREE</span>
                  </div>
                </div>

                {/* User Status */}
                {user ? (
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10">
                    <Link
                      href="/account"
                      onClick={() => setCartOpen(false)}
                      className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
                    >
                      <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[9px] font-bold shrink-0 font-mono">
                        {(user.email || "U").charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 font-mono">
                        <div className="text-[10px] font-semibold text-white truncate">
                          {user.user_metadata?.full_name || user.email}
                        </div>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="text-[10px] font-mono text-white/40 hover:text-white underline ml-2 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-[10px] font-mono text-white/60 flex items-center justify-between">
                    <span>Account required at checkout</span>
                    <span className="text-white font-medium">Google Sign-in</span>
                  </div>
                )}

                {/* Primary Checkout Action */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleDirectCheckout}
                    className="w-full bg-white text-black hover:bg-white/90 transition-all py-4 rounded-full text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-2xl active:scale-[0.99] cursor-pointer"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                  
                  <p className="text-center text-[9px] font-mono text-white/40 tracking-widest uppercase">
                    Cash on Delivery &bull; Direct Bank Transfer &bull; 7-Day Replacement
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}