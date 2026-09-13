"use client";

import { useState, useEffect } from "react";
import { Product } from "../types/product";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { 
  X, 
  ShoppingBag, 
  Heart, 
  Check, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus,
  ExternalLink 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { audioEngine } from "../lib/audio";
import { SITE_CONTACT } from "../constants";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (product) {
      setActiveImage(product.image_url || "");
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image_url || ""];
  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = () => {
    try { audioEngine.playAcquire(); } catch {}
    addToCart(product, quantity);
    onClose();
  };

  const handleWhatsAppOrder = () => {
    try { audioEngine.playAcquire(); } catch {}
    const total = product.price * quantity;
    const text = encodeURIComponent(
      `Hello AETHEX Store, I would like to order via Direct Bank Transfer / COD:\n\n• Product: ${product.title}\n• Quantity: ${quantity}\n• Total: Rs. ${total.toLocaleString()} LKR + Islandwide Delivery\n\nPlease confirm availability and dispatch.`
    );
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[102] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          className="relative w-full max-w-4xl bg-[#0B0B0B] border border-white/10 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col text-white"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-[#050505]">
            <span className="text-[10px] font-mono tracking-[0.25em] text-white/50 uppercase font-semibold">
              QUICK VIEW // {product.category || "TECH HARDWARE"}
            </span>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white p-1 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8 overflow-y-auto">
            {/* Left Column: Gallery (6 Cols) */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative aspect-square w-full bg-[#050505] border border-white/10 overflow-hidden shadow-xs flex items-center justify-center">
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full bg-[#111111]" />
                )}
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-white text-black text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 bg-[#050505] border shrink-0 transition-colors cursor-pointer ${
                        activeImage === img ? "border-white" : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details & Actions (6 Cols) */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">
                  {product.category}
                </div>
                <h3 className="text-xl sm:text-2xl font-mono uppercase text-white font-medium">
                  {product.title}
                </h3>
                {product.subtitle && (
                  <p className="text-xs text-white/60 font-mono mt-1">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                <span className="text-white font-bold">★ {product.rating || "4.8"}</span>
                <span className="text-white/50">({product.reviewCount || "64"} reviews)</span>
                <span className="text-white/20">•</span>
                <span className="text-white font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-white" /> In Stock
                </span>
              </div>

              {/* Pricing */}
              <div className="space-y-1.5 border-y border-white/10 py-4 font-mono">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-white">
                    Rs. {product.price.toLocaleString()} LKR
                  </span>
                  {product.original_price && (
                    <span className="text-xs text-white/40 line-through">
                      Rs. {product.original_price.toLocaleString()}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="border border-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 bg-white/5">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-white/50">
                  Or 3 interest-free installments of <span className="text-white font-bold">Rs. {Math.round(product.price / 3).toLocaleString()}</span> with Koko / Mintpay
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-white/70 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Quantity & CTA buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-white/15 px-3 py-2 bg-[#050505] font-mono text-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-white/60 hover:text-white px-1 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-white w-8 text-center font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-white/60 hover:text-white px-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart Button (Solid White) */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-white text-black hover:bg-white/90 py-3 text-xs font-mono font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </button>

                  {/* Wishlist toggle */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`border p-3 transition-colors cursor-pointer ${
                      isFavorited
                        ? "border-white bg-white text-black"
                        : "border-white/15 text-white/60 hover:border-white hover:text-white bg-[#050505]"
                    }`}
                    title={isFavorited ? "In Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? "fill-black" : ""}`} />
                  </button>
                </div>

                {/* WhatsApp Instant COD Order */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full border border-white/15 hover:border-white text-white bg-[#050505] py-2.5 text-xs font-mono font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>ORDER VIA WHATSAPP (INSTANT ASSIST)</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 grid grid-cols-2 gap-3 text-[10px] font-mono text-white/60 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-white" />
                  <span>Islandwide Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>Official Warranty</span>
                </div>
              </div>

              {/* View Full Product Page */}
              <div className="pt-2 text-right">
                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/60 hover:text-white underline underline-offset-4 uppercase tracking-wider transition-colors"
                >
                  <span>View Full Technical Specifications</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
