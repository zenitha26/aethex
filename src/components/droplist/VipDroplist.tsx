"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Copy, 
  Check, 
  Lock, 
  Key, 
  CheckCircle2, 
  Loader2,
  BellRing
} from "lucide-react";
import { subscribeToDroplistAction } from "@/app/actions/droplist";
import { audioEngine } from "@/lib/audio";

interface VipDroplistProps {
  dropName?: string;
  targetDate?: Date;
  className?: string;
}

export default function VipDroplist({
  dropName = "DROP 02: COCKPIT EXPANSION // TITANIUM EDITION",
  targetDate,
  className = "",
}: VipDroplistProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 12, seconds: 40 });

  // Countdown clock simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      audioEngine.playAcquire();
    } catch {}

    try {
      const result = await subscribeToDroplistAction({ email, phone });
      if (result.success && result.inviteCode) {
        setInviteCode(result.inviteCode);
        try {
          audioEngine.playSuccess();
        } catch {}
      } else {
        setError(result.error || "Failed to register for Priority Access.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    try {
      audioEngine.playSelect();
    } catch {}
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 sm:p-10 lg:p-12 text-white ${className}`}>
      {/* Background ambient architectural texture */}
      <div className="absolute inset-0 bg-radial from-white/[0.03] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* Top Badges & Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">
              PRIORITY ACCESS DROPLIST // ARCHIVE 02
            </span>
          </div>

          {/* Live countdown pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-white/60" />
            <span className="text-xs font-mono tracking-widest text-white/90">
              {String(timeLeft.hours).padStart(2, "0")}:
              {String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[9px] font-mono text-white/40 uppercase">Until Allotment</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight uppercase font-mono text-white">
            {dropName}
          </h2>
          <p className="text-xs sm:text-sm text-white/60 font-mono leading-relaxed max-w-2xl">
            A limited batch of 50 serialized titanium mechanical modules. Members on the Priority Droplist receive 24-hour advance booking before public allocation.
          </p>
        </div>

        {/* Subscription or Secret Pass Revealed State */}
        <AnimatePresence mode="wait">
          {!inviteCode ? (
            <motion.form
              key="droplist-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-7">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter confidential email address..."
                    className="w-full px-5 py-4 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-white/30 text-xs font-mono focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div className="sm:col-span-5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-full py-4 px-6 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Securing Entry...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-3.5 h-3.5" />
                        <span>Request Priority Pass</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs font-mono text-red-400 mt-2">
                  {error}
                </p>
              )}

              <p className="text-[10px] font-mono text-white/40">
                * Zero marketing spam. Encrypted registry. One invite key generated per verified account.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="pass-revealed"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-6 sm:p-8 rounded-2xl bg-[#0B0B0B] border border-white/20 space-y-6 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                      Status: Confirmed Priority Tier
                    </span>
                    <h3 className="text-sm font-mono font-bold uppercase text-white">
                      Your VIP Allocation Key
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-white/60 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                    Active Reservation
                  </span>
                </div>
              </div>

              {/* Serialized Key Display */}
              <div className="p-4 rounded-xl bg-black/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1">
                    Pass Serial
                  </span>
                  <span className="text-xl sm:text-2xl font-mono font-bold tracking-[0.2em] text-white">
                    {inviteCode}
                  </span>
                </div>

                <button
                  onClick={copyCode}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Key</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Key</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs font-mono text-white/60 leading-relaxed">
                An alert will be dispatched to <strong className="text-white">{email}</strong> 24 hours prior to public release. Present your serial key during checkout to unlock the allocation.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Member Privileges Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1.5">
            <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-white mb-2">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              24H Advance Window
            </h4>
            <p className="text-white/40 text-[11px] leading-relaxed">
              Order before public store drop. Guaranteed allocation without queue competition.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1.5">
            <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-white mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Serialized Titanium Badge
            </h4>
            <p className="text-white/40 text-[11px] leading-relaxed">
              Exclusive laser-etched serial plate with your collector number and production batch stamp.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-1.5">
            <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-white mb-2">
              <BellRing className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Concierge Direct Line
            </h4>
            <p className="text-white/40 text-[11px] leading-relaxed">
              Direct WhatsApp liaison with our lead hardware technician for custom requests.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
