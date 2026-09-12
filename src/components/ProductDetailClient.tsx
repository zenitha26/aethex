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
  ArrowLeft 
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
import { audioEngine } from "../lib/audio";
import { SITE_CONTACT } from "../constants";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCartStore();
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
• Payment: Cash on Delivery (COD)

Please confirm my order and dispatch.`);
    window.open(`https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="bg-[#F9F9F9] text-[#111111] min-h-screen font-sans selection:bg-black selection:text-white">
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
      <div className="border-b border-gray-200 bg-white py-3 px-6 sm:px-10 lg:px-12 text-xs font-mono">
        <div className="max-w-[1500px] mx-auto flex items-center gap-2 text-gray-500">
          <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Store Home</span>
          </Link>
          <span>/</span>
          <span>{product.category || "Hardware"}</span>
          <span>/</span>
          <span className="text-black font-bold truncate max-w-xs sm:max-w-md">{product.title}</span>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <section className="py-12 sm:py-16 px-6 sm:px-10 lg:px-12 border-b border-gray-200 bg-white">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square w-full bg-[#F9F9F9] border border-gray-200 overflow-hidden shadow-lg">
              <Image
                src={activeImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover p-4"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 shadow-xs">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 bg-[#F9F9F9] border shrink-0 transition-all ${
                      activeImage === img ? "border-black shadow-xs" : "border-gray-200 opacity-60 hover:opacity-100"
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
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase block font-semibold">
                {product.category || "TECH & HARDWARE"}
              </span>
              <h1 className="text-2xl sm:text-4xl font-mono uppercase text-[#111111] font-medium leading-tight">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Rating & In-Stock */}
            <div className="flex items-center gap-3 text-xs font-mono text-gray-700">
              <span className="font-bold text-black">★ {product.rating || "4.8"}</span>
              <span className="text-gray-500">({product.reviewCount || "64"} verified buyer reviews)</span>
              <span className="text-gray-300">•</span>
              <span className="text-black font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-black" /> In Stock
              </span>
            </div>

            {/* Pricing Section */}
            <div className="space-y-2 border-y border-gray-200 py-5 font-mono">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-black">
                  Rs. {product.price.toLocaleString()} LKR
                </span>
                {product.original_price && (
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.original_price.toLocaleString()} LKR
                  </span>
                )}
                {discountPercent && (
                  <span className="border border-gray-300 text-black text-[11px] font-bold px-2 py-0.5 bg-gray-50 shadow-xs">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-600">
                Or 3 interest-free installments of <span className="text-black font-bold">Rs. {Math.round(product.price / 3).toLocaleString()}</span> with Koko / Mintpay
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 font-mono text-xs">
                <span className="text-[10px] uppercase text-gray-500 tracking-wider block font-semibold">
                  SELECT COLOR / FINISH:
                </span>
                <div className="flex gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v.id);
                        if (v.image_url) setActiveImage(v.image_url);
                      }}
                      className={`px-4 py-2 border uppercase tracking-wider transition-all shadow-xs ${
                        selectedVariant === v.id
                          ? "bg-black text-white border-black font-bold shadow-xs"
                          : "bg-white text-black border-gray-300 hover:border-black"
                      }`}
                    >
                      {v.title || v.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 px-3 py-3 bg-[#F9F9F9] font-mono text-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-600 hover:text-black px-2"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-black w-8 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-gray-600 hover:text-black px-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart (Solid Black) */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white hover:bg-neutral-800 py-3.5 text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`border p-3.5 transition-colors shadow-xs ${
                    isFavorited
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-600 hover:border-black hover:text-black bg-white"
                  }`}
                  title={isFavorited ? "In Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-white" : ""}`} />
                </button>

                {/* Compare */}
                <button
                  onClick={() => toggleCompare(product)}
                  className={`border p-3.5 transition-colors shadow-xs ${
                    isCompared
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-600 hover:border-black hover:text-black bg-white"
                  }`}
                  title={isCompared ? "In Compare" : "Add to Compare"}
                >
                  <Scale className="w-4 h-4" />
                </button>
              </div>

              {/* Order via WhatsApp */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-white border border-gray-300 hover:border-black text-[#111111] py-3.5 text-xs font-mono font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>ORDER VIA WHATSAPP (CASH ON DELIVERY)</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 font-mono text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-black" />
                <div>
                  <div className="text-black uppercase font-bold text-[10px]">Islandwide Dispatch</div>
                  <div className="text-[10px]">1–3 Business Days</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-black" />
                <div>
                  <div className="text-black uppercase font-bold text-[10px]">Warranty Included</div>
                  <div className="text-[10px]">Official Replacement</div>
                </div>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs font-mono text-gray-600 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>
        </div>
      </section>

      {/* Technical Specifications Section */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="py-16 px-6 sm:px-10 lg:px-12 border-b border-gray-200 bg-[#F9F9F9] font-sans">
          <div className="max-w-[1500px] mx-auto space-y-8">
            <div className="space-y-1 border-b border-gray-200 pb-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase block font-semibold">
                TECHNICAL DATA
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono uppercase text-[#111111] font-light">
                Specifications & Engineering
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {Object.entries(product.specs).map(([label, value]) => (
                <div 
                  key={label} 
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 shadow-xs"
                >
                  <span className="text-gray-500 uppercase tracking-wider">{label}</span>
                  <span className="text-black font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key Features Bullet Section */}
      {product.features && product.features.length > 0 && (
        <section className="py-16 px-6 sm:px-10 lg:px-12 border-b border-gray-200 bg-white font-sans">
          <div className="max-w-[1500px] mx-auto space-y-8">
            <div className="space-y-1 border-b border-gray-200 pb-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase block font-semibold">
                SYSTEM HIGHLIGHTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono uppercase text-[#111111] font-light">
                Key Features
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
              {product.features.map((feat, i) => (
                <div key={i} className="p-6 bg-[#F9F9F9] border border-gray-200 space-y-2 shadow-xs">
                  <div className="text-[10px] text-gray-500 tracking-widest uppercase font-semibold">FEATURE 0{i + 1}</div>
                  <h3 className="text-sm text-black font-bold uppercase">{feat.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-light">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <CustomerReviews />

      {/* Footer */}
      <Footer />
    </div>
  );
}
