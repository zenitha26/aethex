"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  CheckCircle2, 
  Package, 
  Truck, 
  Compass, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle, 
  ArrowRight,
  Phone,
  Hash,
  ExternalLink,
  ShieldCheck,
  Clock
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { createClient } from "../../lib/supabase/client";

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
  const queryParam = searchParams.get("order_id") || searchParams.get("phone") || "";
  const supabase = createClient();

  const [searchInput, setSearchInput] = useState(queryParam);
  const [searchType, setSearchType] = useState<"auto" | "id" | "phone">("auto");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [tracking, setTracking] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Select a specific order from multiple matches or single match
  const selectOrder = async (selectedOrder: any) => {
    setOrder(selectedOrder);
    setOrdersList([]);
    router.replace(`/track-order?order_id=${encodeURIComponent(selectedOrder.id)}`);

    // Fetch tracking telemetry if available
    try {
      const trackingRes = await fetch(`/api/tracking?order_id=${encodeURIComponent(selectedOrder.id)}`);
      if (trackingRes.ok) {
        const trackingData = await trackingRes.json();
        setTracking(trackingData);
      }
    } catch {}
  };

  // Search for order(s) by Order ID or Phone Number
  const handleSearch = async (termToSearch: string) => {
    const raw = termToSearch.trim();
    if (!raw) return;

    setLoading(true);
    setError(null);
    setOrder(null);
    setOrdersList([]);
    setTracking(null);

    const cleanDigits = raw.replace(/\D/g, "");
    const isLikelyPhone = cleanDigits.length >= 9 && !raw.includes("-");

    try {
      let matchedOrders: any[] = [];

      // 1. Try querying by Order ID directly (if not strictly a phone format)
      if (!isLikelyPhone) {
        try {
          const { data, error: sbErr } = await supabase
            .from("orders")
            .select("*")
            .eq("id", raw)
            .maybeSingle();

          if (!sbErr && data) {
            matchedOrders = [data];
          }
        } catch {}
      }

      // 2. Query by phone number if empty or if phone format detected
      if (matchedOrders.length === 0) {
        try {
          const phoneSearchParam = cleanDigits.length >= 9 ? cleanDigits.slice(-9) : raw;
          const { data, error: phoneErr } = await supabase
            .from("orders")
            .select("*")
            .or(`customer_phone.eq.${raw},customer_phone.ilike.%${phoneSearchParam}%`)
            .order("created_at", { ascending: false });

          if (!phoneErr && data && data.length > 0) {
            matchedOrders = data;
          }
        } catch {}
      }

      // 3. Fallback: Search local orders in localStorage (for guests or offline orders)
      if (matchedOrders.length === 0 && typeof window !== "undefined") {
        try {
          const localOrders = JSON.parse(localStorage.getItem("aethex_local_orders") || "[]");
          const found = localOrders.filter((o: any) => {
            if (o.id && o.id.toLowerCase() === raw.toLowerCase()) return true;
            if (o.customer_phone) {
              const oDigits = o.customer_phone.replace(/\D/g, "");
              if (cleanDigits && oDigits.includes(cleanDigits.slice(-9))) return true;
            }
            return false;
          });
          if (found.length > 0) {
            matchedOrders = found;
          }
        } catch {}
      }

      if (matchedOrders.length === 0) {
        setError("No order records found matching this Reference ID or Phone Number. Please check your details or contact concierge support.");
        return;
      }

      if (matchedOrders.length === 1) {
        selectOrder(matchedOrders[0]);
      } else {
        // Multiple orders located for this phone number
        setOrdersList(matchedOrders);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to retrieve order records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      handleSearch(queryParam);
    }
  }, [queryParam]);

  const triggerCopy = (idToCopy: string) => {
    navigator.clipboard.writeText(idToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStepIndex = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return 3;
      case "shipped":
        return 2;
      case "processing":
      case "paid":
        return 1;
      case "cancelled":
        return -1;
      default:
        return 0; // pending_payment
    }
  };

  const stepIndex = order ? getStepIndex(order.order_status || order.status) : 0;
  const isCancelled = (order?.order_status || order?.status) === "cancelled";

  // Parse items safely whether stored as json `line_items` or relational `order_items`
  const items = order?.line_items || order?.order_items || [];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      
      {/* Search Console Container */}
      <div className="bg-[#0B0B0B] border border-white/10 p-6 md:p-10 relative overflow-hidden shadow-2xl space-y-6">
        {/* Viewfinder corner tick marks */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/30 pointer-events-none" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/30 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/30 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/30 pointer-events-none" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-white/10 text-[9px] font-mono tracking-[0.25em] uppercase text-white/60">
            <Compass className="w-3 h-3 text-white" />
            <span>AETHEX COURIER DISPATCH TELEMETRY</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-light font-mono text-white tracking-tight uppercase">
            Track Order Status
          </h2>
          <p className="text-white/60 text-xs font-light leading-relaxed">
            Enter your <strong>Order Reference ID</strong> or your <strong>Customer Phone Number</strong> (e.g. 077 123 4567) to inspect live dispatch milestones.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchInput);
          }}
          className="flex flex-col sm:flex-row gap-3 pt-2"
        >
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              required
              placeholder="Order ID (UUID) or Phone Number (07X...)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 bg-[#050505] border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black hover:bg-white/90 transition-all py-3.5 px-8 font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                <span>Locating...</span>
              </>
            ) : (
              <span>Locate Dispatch</span>
            )}
          </button>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 text-xs text-red-200 font-mono flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Multiple Orders Selector (if searching by phone) */}
      {ordersList.length > 0 && (
        <div className="bg-[#0B0B0B] border border-white/10 p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-white">
              Multiple Orders Found ({ordersList.length})
            </h3>
            <span className="text-[10px] font-mono text-white/40">Select an order to view live details</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {ordersList.map((ord) => (
              <div 
                key={ord.id}
                onClick={() => selectOrder(ord)}
                className="p-4 bg-[#050505] border border-white/10 hover:border-white transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white group-hover:underline">
                      REF: {ord.id.slice(0, 16)}...
                    </span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 border border-white/20 text-white/80 bg-white/[0.04]">
                      {ord.order_status || ord.status || "PENDING"}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-white/40">
                    {new Date(ord.created_at).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" })} • {ord.city || "Sri Lanka"}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm font-mono font-bold text-white">
                    {formatLKR(ord.total)}
                  </span>
                  <div className="p-2 bg-white text-black font-mono text-xs uppercase font-bold flex items-center gap-1 group-hover:bg-white/90">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Order Telemetry Record */}
      {order && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Order Header Snapshot */}
          <div className="bg-[#0B0B0B] border border-white/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-white/40 uppercase font-bold tracking-[0.25em] block">
                ORDER REFERENCE HASH
              </span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono text-sm md:text-base font-bold">{order.id}</span>
                <button 
                  onClick={() => triggerCopy(order.id)} 
                  className="p-1 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
                  title="Copy Order Hash"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-1 font-mono">
              <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.25em]">
                DISPATCH PLACEMENT DATE
              </span>
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
          <div className="bg-[#0B0B0B] border border-white/10 p-6 md:p-10 space-y-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                Fulfillment Milestones
              </h3>
              <div className="text-[10px] font-mono text-white/50 uppercase">
                STATUS: <span className="text-white font-bold">{order.order_status || order.status || "PENDING PAYMENT"}</span>
              </div>
            </div>
            
            {isCancelled ? (
              <div className="py-6 text-center text-red-400 flex flex-col items-center gap-2 font-mono">
                <AlertCircle className="h-8 w-8 text-red-400" />
                <span className="text-sm font-bold uppercase">This order has been cancelled</span>
                <p className="text-xs text-white/60 max-w-xs font-light leading-relaxed">
                  For support or re-orders, contact our concierge on WhatsApp.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 relative items-center justify-items-center py-2 font-mono">
                {/* Horizontal line backing */}
                <div className="absolute left-[12.5%] right-[12.5%] top-[18px] h-[1px] bg-white/15 z-0" />
                
                {/* Dynamic highlight horizontal line */}
                {stepIndex > 0 && (
                  <div
                    className="absolute left-[12.5%] h-[1px] bg-white z-0 transition-all duration-1000"
                    style={{
                      width: `${(stepIndex / 3) * 75}%`,
                    }}
                  />
                )}

                {/* Steps mapping */}
                {[
                  { name: "Order Logged", icon: CheckCircle2 },
                  { name: "Verification", icon: Clock },
                  { name: "In Transit", icon: Truck },
                  { name: "Delivered", icon: Package },
                ].map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx <= stepIndex;
                  return (
                    <div key={step.name} className="flex flex-col items-center gap-2.5 relative z-10">
                      <div
                        className={`w-9 h-9 border flex items-center justify-center transition-all duration-500 ${
                          isActive
                            ? "bg-white text-black border-white shadow-md"
                            : "bg-[#050505] text-white/30 border-white/20"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className={`text-[9px] uppercase tracking-wider font-semibold transition-colors text-center ${
                          isActive ? "text-white" : "text-white/30"
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

          {/* Courier & Tracking Details */}
          {tracking && (
            <div className="bg-[#0B0B0B] border border-white/10 p-6 md:p-8 space-y-6 shadow-2xl font-mono">
              <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-3 text-white">
                Logistics & Carrier Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="text-white/40 block text-[9px] uppercase tracking-wider font-bold mb-1">Carrier Courier</span>
                  <span className="text-white text-sm font-semibold">{tracking.masked_courier || tracking.courier || "Aethex Insured Dispatch"}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[9px] uppercase tracking-wider font-bold mb-1">Waybill Tracking Number</span>
                  <span className="text-white text-sm font-mono font-bold select-all">{tracking.tracking_number}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Details list */}
          <div className="bg-[#0B0B0B] border border-white/10 p-6 md:p-8 space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                Hardware Manifest
              </h3>
              <Link 
                href={`/account/orders/${order.id}`}
                className="inline-flex items-center gap-1.5 text-[10px] text-white/60 hover:text-white underline uppercase tracking-wider transition-colors"
              >
                <span>Upload / View Bank Slip</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-4 pt-1">
              {items.length > 0 ? (
                items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start text-xs border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <div className="space-y-1">
                      <h4 className="text-white font-medium">{item.product_name || item.title || "Curated Hardware Piece"}</h4>
                      {item.color && (
                        <span className="text-[10px] text-white/50 font-light block">Color / Finish: {item.color}</span>
                      )}
                      <span className="text-[10px] text-white/40 block font-light">Quantity: {item.quantity}</span>
                    </div>
                    <span className="text-white font-semibold font-mono">{formatLKR((item.price || 0) * (item.quantity || 1))}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-white/40 py-2">Standard 10-piece catalog acquisition package.</div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Total Valuation</span>
              <span className="text-white font-mono text-lg font-bold">{formatLKR(order.total)}</span>
            </div>
          </div>

          {/* Delivery Coordinates */}
          <div className="bg-[#0B0B0B] border border-white/10 p-6 md:p-8 space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-2 text-white">
              Recipient & Delivery Coordinates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-white/70">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-0.5">Recipient</span>
                <span className="text-white font-medium">{order.customer_name}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-0.5">Contact Contact</span>
                <span className="text-white font-medium">{order.customer_phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-0.5">Shipping Destination</span>
                <span className="text-white font-medium">{order.customer_address}{order.city ? `, ${order.city}` : ""}</span>
              </div>
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

      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-4 sm:px-6 md:px-12 relative overflow-hidden font-sans selection:bg-white selection:text-black">
        {/* Ambient optical flare */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none -z-0" 
        />

        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <Link href="/" className="hover:text-white transition-colors">AETHEX</Link>
            <span>/</span>
            <span className="text-white">TELEMETRY TRACKING</span>
          </div>

          <Suspense fallback={
            <div className="text-center py-20 text-white/40 font-mono text-xs">
              Loading tracking telemetry...
            </div>
          }>
            <TrackOrderContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}
