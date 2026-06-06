"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, CheckCircle2, Package, Truck, Compass, Copy, Check, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

const formatLKR = (amount: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryId = searchParams.get("order_id") || "";

  const [orderIdInput, setOrderIdInput] = useState(queryId);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [tracking, setTracking] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Search for the order
  const handleSearch = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    setTracking(null);

    // Update query params in URL
    router.replace(`/track-order?order_id=${idToSearch}`);

    try {
      if (!supabase) {
        throw new Error("Database configuration error. Supabase client is offline.");
      }

      // Query order info
      const { data: orderData, error: orderErr } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            price,
            title,
            customization
          )
        `)
        .eq("id", idToSearch)
        .maybeSingle();

      if (orderErr) throw orderErr;
      if (!orderData) {
        setError("We couldn't find an order matching that ID. Please check the reference and try again.");
        return;
      }

      setOrder(orderData);

      // Query tracking update info if any
      const { data: trackingData } = await supabase
        .from("tracking_updates")
        .select("*")
        .eq("order_id", idToSearch)
        .maybeSingle();

      if (trackingData) {
        setTracking(trackingData);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to retrieve order tracking logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      handleSearch(queryId);
    }
  }, [queryId]);

  const triggerCopy = () => {
    navigator.clipboard.writeText(queryId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "delivered":
        return 3;
      case "shipped":
        return 2;
      case "processing":
        return 1;
      case "cancelled":
        return -1;
      default:
        return 0; // pending
    }
  };

  const stepIndex = order ? getStepIndex(order.order_status) : 0;
  const isCancelled = order?.order_status === "cancelled";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12">
      {/* Search Input Card */}
      <div className="luxury-glass p-6 md:p-8 rounded-3xl space-y-4">
        <div>
          <h2 className="text-lg font-bold font-display text-white">Track Order</h2>
          <p className="text-silver/50 text-xs font-light">Input your AETHEX order ID hash to check live fulfillment status.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(orderIdInput);
          }}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              required
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="apple-btn py-3.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" /> Searching...
              </>
            ) : (
              <span>Check Status</span>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-2xl text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Tracking Render Section */}
      {order && (
        <div className="space-y-8 animate-fade-in">
          {/* Order Header Snapshot */}
          <div className="luxury-glass p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10">
            <div className="space-y-1">
              <span className="text-[10px] text-silver/40 uppercase font-bold tracking-wider">Order Reference</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono text-sm md:text-base font-bold">{order.id}</span>
                <button onClick={triggerCopy} className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition">
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-1">
              <span className="text-[10px] text-silver/40 uppercase font-bold tracking-wider">Placement Date</span>
              <span className="text-white text-xs font-semibold">
                {new Date(order.created_at).toLocaleDateString("en-LK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Timeline Visual Status Indicator */}
          <div className="luxury-glass p-8 rounded-3xl space-y-8 border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/5 pb-3">Fulfillment Progress</h3>
            
            {isCancelled ? (
              <div className="py-4 text-center text-red-400 flex flex-col items-center gap-2">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <span className="text-sm font-bold">This order has been cancelled</span>
                <p className="text-xs text-silver/50 max-w-xs font-light leading-relaxed">
                  If you have queries, please contact our support desk on WhatsApp.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 relative items-center justify-items-center">
                {/* Horizontal line backing */}
                <div className="absolute left-[12.5%] right-[12.5%] top-[18px] h-[2px] bg-white/5 z-0" />
                
                {/* Dynamic highlight horizontal line */}
                {stepIndex > 0 && (
                  <div
                    className="absolute left-[12.5%] h-[2px] bg-white z-0 transition-all duration-1000"
                    style={{
                      width: `${(stepIndex / 3) * 75}%`,
                    }}
                  />
                )}

                {/* Steps mapping */}
                {[
                  { name: "Logged", icon: CheckCircle2 },
                  { name: "Processing", icon: Compass },
                  { name: "Shipped", icon: Truck },
                  { name: "Delivered", icon: Package },
                ].map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx <= stepIndex;
                  return (
                    <div key={step.name} className="flex flex-col items-center gap-2.5 relative z-10">
                      <div
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-500 ${
                          isActive
                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                            : "bg-[#0a0a0a] text-white/30 border-white/5"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold transition-colors ${
                          isActive ? "text-white" : "text-silver/30"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shipment Details & Courier */}
          {tracking && (
            <div className="luxury-glass p-6 rounded-3xl space-y-4 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/5 pb-3">Shipment Tracking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-silver/40 block text-[9px] uppercase font-bold mb-1">Carrier Courier</span>
                  <span className="text-white text-sm font-semibold">{tracking.courier}</span>
                </div>
                <div>
                  <span className="text-silver/40 block text-[9px] uppercase font-bold mb-1">Tracking Number</span>
                  <span className="text-white text-sm font-mono font-bold select-all">{tracking.tracking_number}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Details list */}
          <div className="luxury-glass p-6 rounded-3xl space-y-4 border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider border-b border-white/5 pb-3">Items Ordered</h3>
            <div className="space-y-4">
              {order.order_items?.map((item: any, idx: number) => {
                const customizationText = item.customization
                  ? `Switches: ${item.customization.switches}, Caps: ${item.customization.keycaps}, Frame: ${item.customization.caseStyle}`
                  : null;

                return (
                  <div key={idx} className="flex justify-between items-start text-xs border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <div className="space-y-1">
                      <h4 className="text-white font-medium">{item.title}</h4>
                      {customizationText && (
                        <span className="text-[10px] text-silver/40 font-light block">{customizationText}</span>
                      )}
                      <span className="text-[10px] text-silver/50 block font-light">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-white font-semibold font-mono">{formatLKR(item.price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-baseline">
              <span className="text-silver/40 text-[10px] uppercase font-bold">Total Cost</span>
              <span className="text-white font-display text-lg font-bold">{formatLKR(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] text-silver/40 uppercase tracking-widest font-semibold">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Track Order</span>
          </div>

          <Suspense fallback={
            <div className="text-center py-20 text-silver/40 text-sm">
              Loading tracking panel...
            </div>
          }>
            <TrackOrderContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}

// Simple fallback icon in case AlertCircle is not available (which is)
function AlertCircle(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
