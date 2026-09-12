"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "../../store/useCartStore";
import { Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { audioEngine } from "../../lib/audio";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "N/A";
  const { clearCart } = useCartStore();

  // Clear cart upon loading success
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const playHover = () => audioEngine.playClick();
  const playSelect = () => audioEngine.playSelect();

  return (
    <div className="w-full max-w-md p-10 bg-[#F9F9F9] border border-gray-200 text-center relative z-10 space-y-8 shadow-sm">
      {/* Success Tick */}
      <div className="mx-auto w-12 h-12 bg-black flex items-center justify-center shadow-sm">
        <Check className="h-5 w-5 text-white" />
      </div>

      <div className="space-y-3">
        <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block font-semibold">
          ORDER VERIFIED
        </span>
        <h1 className="text-[#111111] text-2xl font-light tracking-widest uppercase">
          ORDER CONFIRMED
        </h1>
        <p className="text-gray-600 text-xs font-light leading-relaxed max-w-xs mx-auto">
          Your order has been recorded in our dispatch system. We will contact you via WhatsApp with delivery updates.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="text-left space-y-4 p-5 bg-white border border-gray-200 shadow-xs">
        <div className="flex justify-between border-b border-gray-200 pb-3 text-xs">
          <span className="text-[9px] text-gray-500 uppercase tracking-wider font-mono font-semibold">
            ORDER REFERENCE
          </span>
          <span className="text-[#111111] font-mono select-all tracking-wider font-bold">
            {orderId}
          </span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-[9px] text-gray-500 uppercase tracking-wider font-mono font-semibold">
            DISPATCH STATUS
          </span>
          <span className="text-emerald-700 font-mono uppercase tracking-widest flex items-center gap-1.5 font-bold">
            QUEUED FOR DISPATCH
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <Link href="/" onClick={playSelect} onMouseEnter={playHover} className="block">
          <button className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3.5 px-6 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center cursor-pointer shadow-sm">
            Back to Catalog
          </button>
        </Link>
        <span className="text-[9px] text-gray-500 flex items-center justify-center gap-1.5 font-mono uppercase font-semibold">
          <ShieldCheck className="h-3.5 w-3.5 text-black" /> CASH ON DELIVERY • ISLANDWIDE DISPATCH
        </span>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] flex items-center justify-center p-8 relative overflow-hidden font-sans">
      <Suspense fallback={
        <div className="text-gray-500 text-xs font-mono uppercase tracking-widest animate-pulse">Loading order status...</div>
      }>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
