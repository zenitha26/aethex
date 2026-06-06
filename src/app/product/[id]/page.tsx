"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Minus, ShoppingBag, MessageSquare, ShieldCheck, CheckCircle } from "lucide-react";
import Navbar from "../../../components/Navbar";
import CartDrawer from "../../../components/CartDrawer";
import { useCartStore } from "../../../store/useCartStore";
import { supabase } from "../../../lib/supabase";
import { defaultProducts, Product } from "../../../lib/products";

// Render vector graphics based on product ID
const renderDetailsGraphic = (id: string) => {
  switch (id) {
    case "9912001":
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full max-w-sm h-auto mx-auto opacity-90">
          <rect x="15" y="40" width="210" height="90" rx="12" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <rect x="25" y="50" width="190" height="70" rx="8" fill="#050505" />
          <rect x="35" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.15)" />
          <rect x="55" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="75" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="95" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="115" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="135" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="155" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="175" y="60" width="16" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="195" y="60" width="10" height="14" rx="2" fill="rgba(255,255,255,0.3)" />
          <rect x="35" y="80" width="20" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="60" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="80" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="100" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="120" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="140" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="160" y="80" width="16" height="14" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="180" y="80" width="25" height="14" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="85" y="100" width="70" height="14" rx="4" fill="rgba(255,255,255,0.15)" />
        </svg>
      );
    case "9912002":
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full max-w-xs h-auto mx-auto opacity-90">
          <rect x="80" y="25" width="80" height="110" rx="40" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <line x1="120" y1="25" x2="120" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <rect x="115" y="45" width="10" height="20" rx="5" fill="#ffffff" />
          <circle cx="120" cy="100" r="4" fill="rgba(255,255,255,0.2)" />
        </svg>
      );
    case "ali8839401":
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full max-w-sm h-auto mx-auto opacity-90">
          <rect x="30" y="70" width="180" height="10" rx="3" fill="rgba(255,255,255,0.2)" />
          <rect x="25" y="65" width="190" height="6" rx="2" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <path d="M45 80 L38 115 L52 115 Z" fill="rgba(255,255,255,0.1)" />
          <path d="M195 80 L188 115 L202 115 Z" fill="rgba(255,255,255,0.1)" />
        </svg>
      );
    case "ali8839402":
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full max-w-sm h-auto mx-auto opacity-90">
          <path d="M70 85C70 45 92 35 120 35C148 35 170 45 170 85" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeLinecap="round" />
          <rect x="54" y="65" width="22" height="45" rx="8" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <rect x="164" y="65" width="22" height="45" rx="8" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        </svg>
      );
    case "ali8839403":
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full max-w-sm h-auto mx-auto opacity-90">
          <rect x="20" y="35" width="200" height="90" rx="10" fill="#0d0d0d" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
          <rect x="23" y="38" width="194" height="84" rx="8" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <path d="M40 100 Q80 60 120 90 T200 50" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" fill="none" />
        </svg>
      );
    case "ali8839404":
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full max-w-sm h-auto mx-auto opacity-90">
          <rect x="40" y="115" width="40" height="8" rx="2" fill="rgba(255,255,255,0.1)" />
          <rect x="57" y="70" width="8" height="45" fill="rgba(255,255,255,0.15)" />
          <path d="M60 75 L120 60" stroke="rgba(255,255,255,0.2)" strokeWidth="5" strokeLinecap="round" />
          <path d="M120 60 L170 85" stroke="rgba(255,255,255,0.2)" strokeWidth="5" strokeLinecap="round" />
          <rect x="170" y="55" width="55" height="50" rx="4" fill="#121212" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full max-w-sm h-auto mx-auto opacity-90">
          <rect x="40" y="30" width="160" height="100" rx="12" fill="#121212" />
        </svg>
      );
  }
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart, setCartOpen } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("94771234567");
  
  // Customization choices
  const [selectedSwitches, setSelectedSwitches] = useState("Linear Red Switches");
  const [selectedKeycaps, setSelectedKeycaps] = useState("Double-Shot PBT Stealth");
  const [selectedCase, setSelectedCase] = useState("Space Gray Anodized Aluminium");

  // Reviews states
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (supabase) {
          // Fetch settings whatsapp_number
          const { data: settingData } = await supabase
            .from("settings")
            .select("value")
            .eq("key", "whatsapp_number")
            .maybeSingle();
          if (settingData?.value) {
            setWhatsappNumber(settingData.value.replace(/[^0-9]/g, ""));
          }

          // Fetch approved reviews
          const { data: revs } = await supabase
            .from("reviews")
            .select("*")
            .eq("product_id", id)
            .eq("is_approved", true)
            .order("created_at", { ascending: false });
          setReviews(revs || []);
        }
      } catch (err) {
        console.warn("Could not query dynamic settings in details page:", err);
      }

      try {
        if (!supabase) {
          const defaultProd = defaultProducts.find((p) => p.id === id);
          setProduct(defaultProd || null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          const defaultProd = defaultProducts.find((p) => p.id === id);
          setProduct(defaultProd || null);
        } else {
          setProduct(data);
        }
      } catch (err) {
        const defaultProd = defaultProducts.find((p) => p.id === id);
        setProduct(defaultProd || null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-silver/40 text-sm">
        Opening catalog page details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
        <Link href="/products" className="apple-btn text-xs">Return to Catalog</Link>
      </div>
    );
  }

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleAddToBag = () => {
    // Pass customization if it's a customizable component
    const customization = product.id === "9912001" ? {
      switches: selectedSwitches,
      keycaps: selectedKeycaps,
      caseStyle: selectedCase
    } : undefined;

    addToCart(product, customization);
    setCartOpen(true);
  };

  const handleWhatsAppDirectBuy = () => {
    const customText = product.id === "9912001" 
      ? ` (${selectedSwitches}, ${selectedKeycaps}, ${selectedCase})` 
      : "";
    const message = `Hello AETHEX Store 👋
 
I am interested in buying this item directly:
- ${product.title}${customText} x1
 
Price: ${formatLKR(product.price)}
 
Please confirm the delivery details and manual confirmation process.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      if (supabase) {
        const { error: revErr } = await supabase
          .from("reviews")
          .insert({
            product_id: id,
            customer_name: reviewName,
            rating: reviewRating,
            comment: reviewComment,
            is_approved: false // Requires admin moderation
          });
        if (revErr) throw revErr;
        setReviewSuccess(true);
        setReviewName("");
        setReviewComment("");
      }
    } catch (err) {
      console.error("Failed to insert review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const relatedProducts = defaultProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background ambient light */}
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Back button */}
          <Link
            href="/products"
            className="flex items-center gap-2 text-xs text-silver/60 hover:text-white transition-colors mb-8 uppercase tracking-widest font-semibold"
            id="details-back-link"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Gallery Frame */}
            <div className="lg:col-span-7 luxury-glass rounded-3xl p-8 flex items-center justify-center bg-white/[0.01] border border-white/5 relative">
              <div className="absolute inset-0 bg-radial-gradient from-white/[0.02] to-transparent pointer-events-none rounded-3xl" />
              <div className="w-full aspect-square max-w-sm flex items-center justify-center p-6">
                {renderDetailsGraphic(product.id)}
              </div>
            </div>

            {/* Config & Buy Board */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-extrabold border border-white/5 bg-white/[0.02] px-3 py-1 rounded-full">
                  {product.source} COLLECTION
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-4 font-display">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-2xl font-bold font-display text-white">
                    {formatLKR(product.price)}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-silver/40 line-through font-light">
                      {formatLKR(product.original_price)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-silver/60 text-sm font-light leading-relaxed">
                {product.description || "Individually engineered using precision premium components. Designed to bring maximum responsiveness and architectural elegance to your workspace setup."}
              </p>

              {/* Custom Keyboard Customization Options */}
              {product.id === "9912001" && (
                <div className="space-y-4 p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-silver/70">
                    Custom Options
                  </h3>

                  {/* Switches */}
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5 font-bold">
                      Switches
                    </label>
                    <select
                      value={selectedSwitches}
                      onChange={(e) => setSelectedSwitches(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30 transition-colors"
                    >
                      <option value="Linear Red Switches">Linear Red (Silent, Fast)</option>
                      <option value="Tactile Brown Switches">Tactile Brown (Gentle bump)</option>
                      <option value="Clicky Blue Switches">Clicky Blue (Tactile, Loud)</option>
                    </select>
                  </div>

                  {/* Keycaps */}
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5 font-bold">
                      Keycaps Style
                    </label>
                    <select
                      value={selectedKeycaps}
                      onChange={(e) => setSelectedKeycaps(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30 transition-colors"
                    >
                      <option value="Double-Shot PBT Stealth">Double-Shot PBT Stealth</option>
                      <option value="Dye-Sub Retro Grey">Dye-Sub Retro Grey</option>
                      <option value="Clear Polycarbonate Glow">Clear Polycarbonate Glow</option>
                    </select>
                  </div>

                  {/* Case */}
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5 font-bold">
                      Case Material
                    </label>
                    <select
                      value={selectedCase}
                      onChange={(e) => setSelectedCase(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white/30 transition-colors"
                    >
                      <option value="Space Gray Anodized Aluminium">Space Gray Anodized Aluminium</option>
                      <option value="Frosted Polycarbonate Frame">Frosted Polycarbonate Frame</option>
                      <option value="Solid Brass Base (Heavy)">Solid Brass Base (Heavy)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <button
                  onClick={handleAddToBag}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-white text-black hover:bg-[#e5e5ea] rounded-full font-bold text-sm transition-all duration-300 transform active:scale-95 shadow-lg"
                  id="add-to-bag-details-btn"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to Bag
                </button>

                <button
                  onClick={handleWhatsAppDirectBuy}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-bold text-sm text-white transition-all duration-300 transform active:scale-95"
                  id="whatsapp-direct-details-btn"
                >
                  <MessageSquare className="h-4 w-4 text-green-400" /> WhatsApp Direct Buy
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 text-[10px] text-silver/50 uppercase tracking-widest font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" /> Free Sri Lanka Shipping
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-400" /> Quality Guarantee
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-20 border-t border-white/5 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Reviews List (Left Cols 7) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-bold font-display text-white">Customer Experiences ({reviews.length})</h3>
              
              {reviews.length === 0 ? (
                <p className="text-silver/40 text-xs font-light py-4">No verified reviews for this accessory item yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-white text-xs font-bold font-display">{r.customer_name}</span>
                        <span className="text-yellow-400 font-bold text-[10px]">{r.rating} ★</span>
                      </div>
                      <p className="text-silver/60 text-xs font-light leading-relaxed">{r.comment}</p>
                      <span className="text-[9px] text-silver/30 font-mono block">
                        {new Date(r.created_at).toLocaleDateString("en-LK")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review Form (Right Cols 5) */}
            <div className="lg:col-span-5 luxury-glass p-6 rounded-3xl space-y-4 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/5 pb-2.5">Submit Review</h3>
              
              {reviewSuccess ? (
                <div className="p-4 bg-green-950/20 border border-green-500/10 rounded-xl text-center space-y-2">
                  <CheckCircle className="h-6 w-6 text-green-400 mx-auto" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Review Submitted</h4>
                  <p className="text-[10px] text-silver/50 font-light leading-relaxed">
                    Thank you. We have logged your feedback. Your review will publish pending moderator approval.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[9px] text-silver/50 uppercase tracking-widest mb-1.5 font-bold">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-silver/50 uppercase tracking-widest mb-1.5 font-bold">Rating Score</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20"
                    >
                      <option value={5}>5 Stars (Excellent)</option>
                      <option value={4}>4 Stars (Very Good)</option>
                      <option value={3}>3 Stars (Good)</option>
                      <option value={2}>2 Stars (Fair)</option>
                      <option value={1}>1 Star (Poor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-silver/50 uppercase tracking-widest mb-1.5 font-bold">Feedback Comments</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write your product experience details..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white resize-none focus:outline-none focus:border-white/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="apple-btn w-full py-2.5 text-[10px] uppercase font-bold tracking-widest"
                  >
                    {submittingReview ? "Submitting..." : "Send Feedback"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Related Products Catalog Section */}
          <div className="mt-24 border-t border-white/5 pt-16">
            <h2 className="text-2xl font-bold tracking-tight mb-8 font-display">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  className="luxury-glass rounded-3xl p-5 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-video bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-center p-4 mb-4">
                    <div className="w-24 h-24 flex items-center justify-center">
                      {renderDetailsGraphic(relProduct.id)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold">{relProduct.title}</h4>
                    <p className="text-xs text-silver/50 mt-1 line-clamp-1">{relProduct.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-white text-sm font-bold">{formatLKR(relProduct.price)}</span>
                    <Link
                      href={`/product/${relProduct.id}`}
                      className="text-xs text-white hover:underline uppercase tracking-wider font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <CartDrawer />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white text-lg font-bold tracking-widest font-display">
            AETHEX<span className="text-white/40">STORE</span>
          </div>
          <p className="text-silver/40 text-xs font-light">
            &copy; {new Date().getFullYear()} AETHEX Store. All rights reserved. Handcrafted dropshipping platform.
          </p>
          <div className="flex gap-6 text-xs text-silver/40">
            <Link href="/policies" className="hover:text-white transition-colors">Policies</Link>
            <Link href="/about-us" className="hover:text-white transition-colors">About Us</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
