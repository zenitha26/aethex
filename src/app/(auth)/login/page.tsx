"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Lock, User, KeyRound } from "lucide-react";
import GoogleLoginButton from "../../../components/GoogleLoginButton";

export default function AuthPage() {
  const [view, setView] = useState<"login" | "register" | "otp">("login");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (view === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) setError(error.message);
      else {
        setError("Registration successful! Please check your email to verify your account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else {
        router.push("/account");
        router.refresh();
      }
    }
    setLoading(false);
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (view === "otp") {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "sms",
      });
      if (error) setError(error.message);
      else {
        router.push("/account");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      if (error) setError(error.message);
      else {
        setView("otp");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 text-sm transition-colors font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="bg-[#F9F9F9] border border-gray-200 rounded-3xl p-8 shadow-sm">
          <h1 className="text-3xl font-display font-bold text-[#111111] mb-2">
            {view === "register" ? "Create Account" : view === "otp" ? "Verify Phone" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            {view === "register" ? "Join AETHEX to manage your orders." : view === "otp" ? `Enter the 6-digit code sent to ${phone}` : "Sign in to your AETHEX account."}
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Social Auth */}
          {view !== "otp" && (
            <>
              <GoogleLoginButton
                mode={view === "register" ? "signup" : "signin"}
                variant="white"
                onError={(err) => setError(err.message)}
              />

              <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Or with {method}</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
            </>
          )}

          {/* Forms */}
          {method === "email" && view !== "otp" ? (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {view === "register" && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-12 pr-4 text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-12 pr-4 text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-12 pr-4 text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 rounded-2xl font-semibold transition-colors disabled:opacity-50 mt-2 shadow-sm cursor-pointer"
              >
                {loading ? "Processing..." : view === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneAuth} className="space-y-4">
              {view === "otp" ? (
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-Digit OTP"
                    className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-12 pr-4 text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors tracking-widest font-mono"
                  />
                </div>
              ) : (
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number (e.g. +94781234567)"
                    className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-12 pr-4 text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors font-mono"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 rounded-2xl font-semibold transition-colors disabled:opacity-50 mt-2 shadow-sm cursor-pointer"
              >
                {loading ? "Processing..." : view === "otp" ? "Verify Code" : "Send SMS Code"}
              </button>
            </form>
          )}

          {/* Toggles */}
          {view !== "otp" && (
            <div className="mt-8 space-y-4 text-center">
              <button
                onClick={() => setMethod(method === "email" ? "phone" : "email")}
                className="text-gray-600 hover:text-black text-sm transition-colors cursor-pointer"
              >
                Use {method === "email" ? "Phone Number" : "Email"} instead
              </button>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-gray-500">
                  {view === "login" ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button
                  onClick={() => setView(view === "login" ? "register" : "login")}
                  className="text-black font-semibold hover:underline cursor-pointer"
                >
                  {view === "login" ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
