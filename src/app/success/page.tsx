"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "../../store/useCartStore";
import { CheckCircle2, ShieldCheck, Truck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "N/A";
  const method = searchParams.get("method") || "";
  const { clearCart } = useCartStore();

  const [trackingInfo, setTrackingInfo] = useState<{
    tracking_number: string;
    courier: string;
    status: string;
  } | null>(null);

  // Clear cart upon loading success
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Query database tracking info (only if not WhatsApp order)
  useEffect(() => {
    async function fetchTracking() {
      if (orderId === "N/A" || method === "whatsapp" || !supabase) return;
      
      const { data, error } = await supabase
        .from("tracking_updates")
        .select("*")
        .eq("order_id", orderId)
        .single();

      if (!error && data) {
        setTrackingInfo(data);
      }
    }
    fetchTracking();
  }, [orderId, method]);

  const isWhatsApp = method === "whatsapp";

  return (
    <div className="w-full max-w-lg luxury-glass p-8 rounded-3xl text-center border border-white/10 relative z-10">
      {/* Success Icon */}
      <div className="mx-auto w-16 h-16 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="h-8 w-8 text-white" />
      </div>

      <h1 className="text-white text-3xl font-bold font-display tracking-tight mb-2">
        {isWhatsApp ? "Order Submitted" : "Fulfillment Initiated"}
      </h1>
      <p className="text-silver/60 text-sm font-light mb-8">
        {isWhatsApp
          ? "Your order request has been forwarded to our team on WhatsApp. We will confirm your order manually."
          : "Your payment has been verified. The dropshipping fulfillment queue is executing."}
      </p>

      {/* Order Info Card */}
      <div className="text-left space-y-4 mb-8 p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
        <div className="flex justify-between border-b border-white/5 pb-3">
          <span className="text-[10px] text-silver/40 uppercase font-bold tracking-wider">
            Order Reference
          </span>
          <span className="text-white text-xs font-mono select-all">
            {orderId}
          </span>
        </div>

        <div className="flex justify-between border-b border-white/5 pb-3">
          <span className="text-[10px] text-silver/40 uppercase font-bold tracking-wider">
            Confirmation Status
          </span>
          <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            {isWhatsApp ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" /> Pending WhatsApp Confirmation
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
              </>
            )}
          </span>
        </div>

        {!isWhatsApp && (
          trackingInfo ? (
            <>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-[10px] text-silver/40 uppercase font-bold tracking-wider">
                  Courier Carrier
                </span>
                <span className="text-white text-xs font-medium">
                  {trackingInfo.courier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-silver/40 uppercase font-bold tracking-wider">
                  Tracking Code
                </span>
                <span className="text-white text-xs font-mono select-all text-white/90">
                  {trackingInfo.tracking_number}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-[10px] text-silver/30 leading-normal flex items-center justify-center gap-1.5">
                <Truck className="h-3.5 w-3.5" /> Live tracking number will populate once the fulfillment cron runs.
              </p>
            </div>
          )
        )}

        {isWhatsApp && (
          <div className="text-center py-2 border-t border-white/5 mt-3 pt-3">
            <p className="text-[10px] text-silver/40 leading-relaxed">
              👋 Make sure you sent the pre-filled message on WhatsApp. Our admin will check it and process fulfillment via DSers / AliExpress.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/">
          <button className="apple-btn w-full justify-center text-sm py-3">
            Back to Catalog <ChevronRight className="h-4 w-4 text-[#050505]" />
          </button>
        </Link>
        <span className="text-[10px] text-silver/40 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" /> Secure COD/WhatsApp Checkout System
        </span>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[120px] pointer-events-none" />

      <Suspense fallback={
        <div className="text-silver/40 text-sm">Loading fulfillment status...</div>
      }>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
