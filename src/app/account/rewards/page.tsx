"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Loader2,
  TrendingUp,
  CreditCard,
  Gift
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { 
  calculatePointsForAmount, 
  getTierProgress, 
  LOYALTY_TIERS, 
  REWARD_VOUCHERS,
  RewardVoucher
} from "@/lib/loyalty/rewards";
import { audioEngine } from "@/lib/audio";

export const runtime = 'edge';

interface OrderSummary {
  id: string;
  total: number;
  created_at: string;
  order_status: string;
}

export default function LoyaltyRewardsPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(185000);
  const [points, setPoints] = useState(1850);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);

  useEffect(() => {
    async function loadLoyaltyData() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 1. Fetch user orders
          const { data: userOrders } = await supabase
            .from("orders")
            .select("id, total, created_at, order_status")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (userOrders && userOrders.length > 0) {
            setOrders(userOrders);
            const spent = userOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
            setTotalSpent(spent);
            setPoints(calculatePointsForAmount(spent));
          } else {
            // Check local fallback
            try {
              const cached = JSON.parse(localStorage.getItem("aethex_local_orders") || "[]");
              if (cached.length > 0) {
                setOrders(cached);
                const spent = cached.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
                setTotalSpent(spent);
                setPoints(calculatePointsForAmount(spent));
              }
            } catch {}
          }
        }
      } catch (err) {
        console.warn("Loyalty data loading notice:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLoyaltyData();
  }, []);

  const progress = getTierProgress(points);

  const copyVoucher = (voucher: RewardVoucher) => {
    navigator.clipboard.writeText(voucher.code);
    setCopiedVoucher(voucher.id);
    try {
      audioEngine.playSelect();
    } catch {}
    setTimeout(() => setCopiedVoucher(null), 2500);
  };

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-10 font-sans selection:bg-white selection:text-black">
      
      {/* Page Header */}
      <div className="space-y-2 border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-white/40">
          <Award className="w-3.5 h-3.5 text-white/60" />
          <span>COLLECTOR TELEMETRY // BESPOKE PRIVILEGES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-light font-mono uppercase tracking-tight text-white">
          Loyalty & Rewards
        </h1>
        <p className="text-xs font-mono text-white/50 max-w-2xl leading-relaxed">
          Points are automatically credited on verified hardware acquisitions at a rate of 1 Point per Rs. 100. Redeem points for immediate checkout deductions.
        </p>
      </div>

      {/* Hero Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Points & Tier Pill */}
        <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0B0B0B] border border-white/10 space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Available Telemetry Credit
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-full border border-white/10 text-white/80">
                1 Point = Rs. 1.00
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-6xl font-mono font-bold tracking-tight text-white">
                {points.toLocaleString()}
              </span>
              <span className="text-sm font-mono text-white/40 uppercase tracking-widest">
                POINTS
              </span>
            </div>

            <p className="text-xs font-mono text-white/60">
              Equivalent to <strong className="text-white">{formatLKR(points)}</strong> checkout credit.
            </p>
          </div>

          {/* Tier Status Badge */}
          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                Current Status
              </span>
              <span className="text-base font-mono font-bold uppercase tracking-wider text-white">
                {progress.currentTier.name} Collector Tier
              </span>
            </div>

            <span className="text-xs font-mono text-white/80 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              {progress.currentTier.name === "Initiate" ? "1.0x Rate" : progress.currentTier.name === "Sentinel" ? "1.25x Multiplier" : "1.5x Multiplier"}
            </span>
          </div>
        </div>

        {/* Right: Circular / Progress Arc Meter */}
        <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#0B0B0B] border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Circular Meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="#FFFFFF"
                strokeWidth="6"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * progress.percentage) / 100}
                strokeLinecap="round"
                fill="transparent"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * progress.percentage) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-mono font-bold text-white">
                {progress.percentage}%
              </span>
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">
                Tier Progress
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold uppercase text-white">
              {progress.nextTier ? `Progress to ${progress.nextTier.name}` : "Highest Tier Reached"}
            </span>
            <p className="text-[11px] font-mono text-white/40">
              {progress.nextTier
                ? `${progress.pointsToNext.toLocaleString()} points needed to advance`
                : "You have unlocked maximum bespoke privileges."}
            </p>
          </div>
        </div>

      </div>

      {/* Redeemable Rewards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-white">
            Available Reward Vouchers
          </h2>
          <span className="text-[10px] font-mono text-white/40">
            Apply code at Checkout
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REWARD_VOUCHERS.map((voucher) => {
            const isAffordable = points >= voucher.pointsCost;

            return (
              <div
                key={voucher.id}
                className="p-5 rounded-2xl bg-[#0B0B0B] border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">
                      {voucher.pointsCost} Points
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {formatLKR(voucher.discountLKR)}
                    </span>
                  </div>
                  <h3 className="text-sm font-mono font-bold uppercase text-white">
                    {voucher.title}
                  </h3>
                  <p className="text-[11px] font-mono text-white/50 leading-relaxed">
                    {voucher.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <button
                    onClick={() => copyVoucher(voucher)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-white"
                  >
                    {copiedVoucher === voucher.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Code Copied: {voucher.code}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Voucher ({voucher.code})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier Benefits Matrix */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-white">
          Tier Privileges Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {LOYALTY_TIERS.map((tier) => {
            const isCurrent = progress.currentTier.name === tier.name;

            return (
              <div
                key={tier.name}
                className={`p-6 rounded-2xl border transition-all ${
                  isCurrent
                    ? "bg-[#111111] border-white/30 shadow-lg"
                    : "bg-[#0B0B0B] border-white/10"
                } space-y-4`}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-white tracking-wide">
                      {tier.name}
                    </h3>
                    <span className="text-[10px] text-white/40 uppercase">
                      {tier.maxPoints ? `${tier.minPoints} - ${tier.maxPoints} PTS` : `${tier.minPoints}+ PTS`}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="text-[9px] uppercase tracking-widest bg-white text-black font-bold px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 text-[11px] text-white/60">
                  {tier.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-white/40 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points Ledger Activity */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-white">
          Points Activity Ledger
        </h2>

        {orders.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0B0B0B] border border-white/10 text-center space-y-3">
            <Clock className="w-6 h-6 text-white/30 mx-auto" />
            <p className="text-xs font-mono text-white/50">
              No points transactions recorded yet. Complete your first bespoke order to begin accumulating rewards.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition"
            >
              <span>Explore Hardware</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5 rounded-2xl bg-[#0B0B0B] border border-white/10 overflow-hidden font-mono text-xs">
            {orders.map((order) => {
              const earned = calculatePointsForAmount(Number(order.total || 0));

              return (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold uppercase">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-white/40">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/50 block">
                      Amount: {formatLKR(Number(order.total || 0))}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-white block">
                      +{earned} PTS
                    </span>
                    <span className="text-[10px] text-white/40 uppercase">
                      Credited
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
