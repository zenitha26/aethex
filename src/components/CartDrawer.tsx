"use client";

import { useCartStore } from "../store/useCartStore";
import { X, Plus, Minus, Trash2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart } =
    useCartStore();

  const router = useRouter();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getItemUniqueId = (item: any) => {
    if (!item.customization) return item.product.id;
    return `${item.product.id}-${item.customization.switches}-${item.customization.keycaps}-${item.customization.caseStyle}`;
  };

  const handleCheckout = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0d0d0d] border-l border-white/10 z-50 shadow-2xl flex flex-col justify-between"
          >
            {/* HEADER */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-white text-lg font-bold">
                Shopping Bag ({cart.length})
              </h2>

              <button
                onClick={() => setCartOpen(false)}
                className="p-2 text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-grow overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-white/5 rounded-full mb-4">
                    <ShieldCheck className="h-8 w-8 text-white/40" />
                  </div>
                  <p className="text-white/60 text-sm mb-6">
                    Your cart is empty
                  </p>

                  <button
                    onClick={() => setCartOpen(false)}
                    className="px-4 py-2 border border-white/20 rounded-xl text-white"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {cart.map((item) => {
                    const id = getItemUniqueId(item);

                    return (
                      <div
                        key={id}
                        className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl"
                      >
                        {/* IMAGE */}
                        <div className="w-16 h-16 bg-black/40 rounded-xl flex items-center justify-center">
                          <div className="w-10 h-10 bg-white/10 rounded-lg" />
                        </div>

                        {/* INFO */}
                        <div className="flex-grow">
                          <h4 className="text-white text-sm font-semibold">
                            {item.product.title}
                          </h4>

                          <p className="text-xs text-white/40 mt-1">
                            LKR {item.product.price}
                          </p>

                          {/* QTY */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-full">
                              <button
                                onClick={() => updateQuantity(id, -1)}
                              >
                                <Minus className="h-3 w-3 text-white" />
                              </button>

                              <span className="text-white text-xs w-6 text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => updateQuantity(id, 1)}
                              >
                                <Plus className="h-3 w-3 text-white" />
                              </button>
                            </div>

                            <span className="text-white font-bold text-sm">
                              {formatLKR(
                                item.product.price * item.quantity
                              )}
                            </span>
                          </div>
                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={() => removeFromCart(id)}
                          className="text-white/40 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FOOTER */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10">
                <div className="flex justify-between mb-4">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white font-bold">
                    {formatLKR(subtotal)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-white text-black py-3 rounded-xl font-medium"
                >
                  Proceed to Checkout
                </button>

                <p className="text-[10px] text-white/40 text-center mt-3">
                  Secure checkout • AETHEX Store
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}