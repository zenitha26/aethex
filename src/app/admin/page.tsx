"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Lock, User, Loader2 } from "lucide-react";
import Turnstile from "../../components/Turnstile";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all credential fields.");
      return;
    }
    if (!turnstileToken) {
      setError("Please verify that you are not a robot.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, turnstileToken }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Login success, redirect to dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during login.");
      setLoading(false);
      // Reset Turnstile token on failure
      setTurnstileToken("");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Back link */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-silver/60 hover:text-white transition-colors uppercase tracking-widest font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
        </div>

        {/* Brand */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-widest font-display text-white">
            AETHEX<span className="text-white/40">SYSTEMS</span>
          </h1>
          <p className="text-silver/50 text-xs uppercase tracking-widest">
            Security Gateway
          </p>
        </div>

        {/* Form Container */}
        <div className="luxury-glass p-8 rounded-3xl space-y-6">
          <h2 className="text-lg font-bold font-display tracking-tight text-white border-b border-white/5 pb-4">
            Authorized Access Only
          </h2>

          {error && (
            <div className="p-3.5 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Enter administrator username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] text-silver/50 uppercase tracking-wider mb-1.5 font-bold">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-silver/20 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            {/* Turnstile Widget */}
            <div className="flex justify-center py-2">
              <Turnstile onVerify={(token) => setTurnstileToken(token)} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !turnstileToken}
              className={`relative w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
                loading || !turnstileToken
                  ? "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
                  : "bg-white text-black hover:bg-[#e5e5ea] active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Access Console</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
