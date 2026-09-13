"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  Heart, 
  Scale, 
  ShieldCheck, 
  Truck, 
  Check, 
  MessageSquare, 
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Product } from "../types/product";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCompareStore } from "../store/useCompareStore";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import CartToast from "./CartToast";
import WishlistDrawer from "./WishlistDrawer";
import CompareModal from "./CompareModal";
import CategoryDrawer from "./CategoryDrawer";
import CustomerReviews from "./CustomerReviews";
import ProductHotspots from "./ProductHotspots";
import MobileBottomBar from "./MobileBottomBar";
import { audioEngine } from "../lib/audio";
import { SITE_CONTACT } from "../constants";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart, setCartOpen } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleCompare, isInCompare } = useCompareStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : "default"
  );
  const [activeImage, setActiveImage] = useState<string>(
    product.image_url || "/placeholder-product.jpg"
  );
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image_url || ""];
  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = () => {
    try { audioEngine.playAcquire(); } catch {}
    const variantObj = product.variants?.find(v => v.id === selectedVariant);
    addToCart(product, quantity, variantObj?.color, selectedVariant);
    setCartOpen(true);
  };

  const handleWhatsAppOrder = () => {
    try { audioEngine.playAcquire(); } catch {}
    const total = product.price * quantity;
    const variantObj = product.variants?.find(v => v.id === selectedVariant);
    const text = encodeURIComponent(`Hello AETHEX Store, I would like to order:

• Product: ${product.title}
• Variant: ${variantObj?.color || "Standard"}
• Quantity: ${quantity}
• Total Price: Rs. ${total.toLocaleString()} LKR + Islandwide Delivery
• Payment: Bank Transfer / COD

Please confirm my order and dispatch.`);
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-white selection:text-black">
      {/* Floating Unified Navigation */}
      <Navbar onOpenCategories={() => setIsCategoryDrawerOpen(true)} />

      {/* Drawers and Modals */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        onSelectCategory={() => {}}
        selectedCategory="All"
      />
      <CartDrawer />
      <CartToast />
      <WishlistDrawer />
      <CompareModal />

      {/* Breadcrumbs */}
      <div className="border-b border-white/5 bg-[#050505] py-4 px-6 sm:px-10 lg:px-12 text-xs font-mono">
        <div className="max-w-[1500px] mx-auto flex items-center gap-2 text-white/40">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Store Home</span>
          </Link>
          <span>/</span>
          <span>{product.category || "Hardware"}</span>
          <span>/</span>
          <span className="text-white font-bold truncate max-w-xs sm:max-w-md">{product.title}</span>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <section className="py-12 sm:py-20 px-6 sm:px-10 lg:px-12 border-b border-white/10 bg-[#050505]">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Gallery & Interactive Sensory Hotspots (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square w-full bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl group">
              <Image
                src={activeImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover p-4 transition-transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Interactive Virtual Hotspots Overlay */}
              <ProductHotspots />

              {product.badge && (
                <div className="absolute top-4 left-4 z-10 bg-white text-black text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-2xl bg-white/[0.02] border shrink-0 transition-all overflow-hidden ${
                      activeImage === img ? "border-white scale-105 shadow-md" : "border-white/10 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover p-1.5"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Technical Info & Purchase Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase block font-semibold">
                {product.category || "ENGINEERED COCKPIT HARDWARE"}
              </span>
              <h1 className="text-2xl sm:text-4xl font-mono uppercase text-white font-medium leading-tight tracking-tight">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-xs font-mono text-white/60 leading-relaxed">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Engineering Status & Inventory */}
            <div className="flex items-center gap-3 text-xs font-mono text-white/70">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Direct Islandwide Dispatch
              </span>
              <span className="text-white/20">&bull;</span>
              <span className="text-white/50">Colombo Ready</span>
            </div>

            {/* Pricing Section */}
            <div className="space-y-2 border-y border-white/10 py-6 font-mono">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Rs. {product.price.toLocaleString()} LKR
                </span>
                {product.original_price && (
                  <span className="text-sm text-white/40 line-through">
                    Rs. {product.original_price.toLocaleString()} LKR
                  </span>
                )}
              </div>
              <div className="text-xs text-white/50">
                Rs. 350 Flat Courier Delivery &bull; Cash on Delivery & Direct Bank Transfer Available
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 font-mono text-xs">
                <span className="text-[10px] uppercase text-white/40 tracking-wider block font-semibold">
                  SELECT FINISH / HARDWARE SPEC:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v.id);
                        if (v.image_url) setActiveImage(v.image_url);
                      }}
                      className={`px-5 py-2.5 rounded-full border uppercase tracking-wider text-xs font-mono transition-all ${
                        selectedVariant === v.id
                          ? "bg-white text-black border-white font-bold shadow-lg"
                          : "bg-white/[0.03] text-white/70 border-white/10 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {v.title || v.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-white/10 rounded-full px-4 py-3 bg-white/[0.03] font-mono text-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-white/60 hover:text-white px-2"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-white w-8 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-white/60 hover:text-white px-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart (Solid White) */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white text-black hover:bg-white/90 py-4 px-6 rounded-full text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xl active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4 text-black" />
                  <span>ADD TO CART</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`border border-white/10 p-4 rounded-full transition-all ${
                    isFavorited
                      ? "border-white bg-white text-black"
                      : "text-white/60 hover:border-white hover:text-white bg-white/[0.03]"
                  }`}
                  title={isFavorited ? "In Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-black text-black" : ""}`} />
                </button>

                {/* Compare */}
                <button
                  onClick={() => toggleCompare(product)}
                  className={`border border-white/10 p-4 rounded-full transition-all ${
                    isCompared
                      ? "border-white bg-white text-black"
                      : "text-white/60 hover:border-white hover:text-white bg-white/[0.03]"
                  }`}
                  title={isCompared ? "In Compare" : "Add to Compare"}
                >
                  <Scale className="w-4 h-4" />
                </button>
              </div>

              {/* Direct WhatsApp Ordering Alternative */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-white/[0.03] border border-white/10 hover:border-white/30 text-white py-3.5 rounded-full text-xs font-mono font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>ORDER VIA WHATSAPP (INSTANT CONCIERGE)</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 font-mono text-xs text-white/60">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                <Truck className="w-4 h-4 text-white" />
                <div>
                  <div className="text-white uppercase font-bold text-[10px]">Islandwide Delivery</div>
                  <div className="text-[10px] text-white/40">24–48h Dispatch</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                <ShieldCheck className="w-4 h-4 text-white" />
                <div>
                  <div className="text-white uppercase font-bold text-[10px]">Official Guarantee</div>
                  <div className="text-[10px] text-white/40">7-Day Replacement</div>
                </div>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs font-mono text-white/60 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>
        </div>
      </section>

      {/* Technical Specifications Section */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="py-20 px-6 sm:px-10 lg:px-12 border-b border-white/10 bg-[#050505] font-sans">
          <div className="max-w-[1500px] mx-auto space-y-8">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase block font-semibold">
                TECHNICAL DATA
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono uppercase text-white font-light">
                Specifications & Engineering
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {Object.entries(product.specs).map(([label, value]) => (
                <div 
                  key={label} 
                  className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-xl"
                >
                  <span className="text-white/50 uppercase tracking-wider">{label}</span>
                  <span className="text-white font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key Features Bullet Section */}
      {product.features && product.features.length > 0 && (
        <section className="py-20 px-6 sm:px-10 lg:px-12 border-b border-white/10 bg-[#050505] font-sans">
          <div className="max-w-[1500px] mx-auto space-y-8">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase block font-semibold">
                SYSTEM HIGHLIGHTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono uppercase text-white font-light">
                Key Features
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
              {product.features.map((feat, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/10 rounded-3xl space-y-3 backdrop-blur-xl">
                  <div className="text-[10px] text-white/40 tracking-widest uppercase font-semibold">FEATURE 0{i + 1}</div>
                  <h3 className="text-sm text-white font-bold uppercase">{feat.title}</h3>
                  <p className="text-white/60 leading-relaxed font-light">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <CustomerReviews />

      {/* Mobile Sticky Bottom Bar */}
      <MobileBottomBar onOpenCategories={() => setIsCategoryDrawerOpen(true)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
