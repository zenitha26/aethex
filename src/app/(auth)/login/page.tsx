"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import GoogleLoginButton from "../../../components/auth/GoogleLoginButton";
import AethexLogo from "../../../components/brand/AethexLogo";

function AuthForm() {
  const [view, setView] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const redirectTarget = searchParams.get("redirect") || "/account";

  useEffect(() => {
    const errorMsg = searchParams.get("error_description") || searchParams.get("error");
    if (errorMsg) {
      setError(decodeURIComponent(errorMsg));
    }
  }, [searchParams]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

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
        setSuccess("Account created. Please check your email to verify your address.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push(redirectTarget);
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-white selection:text-black">
      <div className="w-full max-w-md relative z-10 space-y-8">
        
        {/* Brand & Back Link */}
        <div className="flex items-center justify-between">
          <AethexLogo size="md" showWordmark={true} isLink={true} />
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#0B0B0B] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase block font-semibold">
              ACCOUNT ACCESS
            </span>
            <h1 className="text-2xl sm:text-3xl font-light font-mono uppercase text-white tracking-tight">
              {view === "register" ? "Create Account" : "Sign In"}
            </h1>
            <p className="text-white/60 text-xs font-mono leading-relaxed">
              {redirectTarget === "/checkout" 
                ? "Sign in to continue to checkout and manage your orders."
                : "Sign in to continue."}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-red-400/60 hover:text-red-200 p-0.5 shrink-0"
              >
                ✕
              </button>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs font-mono flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{success}</div>
            </div>
          )}

          {/* PRIMARY: One-click Google Login */}
          <div className="space-y-3">
            <GoogleLoginButton
              redirectTo={redirectTarget}
              text={view === "register" ? "Create Account with Google" : "Continue with Google"}
              className="w-full justify-center !bg-white !text-black hover:!bg-white/90 py-3.5 font-mono text-xs font-bold uppercase tracking-wider rounded-full shadow-lg"
              onError={(err) => setError(err.message)}
            />
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-white/40 text-[10px] uppercase font-mono tracking-widest">Or with email</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="space-y-3 font-mono">
            {view === "register" && (
              <div className="space-y-1">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 text-xs outline-none focus:border-white/40 transition-colors"
                />
              </div>
            )}
            <div className="space-y-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 text-xs outline-none focus:border-white/40 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 text-xs outline-none focus:border-white/40 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? "Please wait..." : view === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Switch between Sign In / Sign Up */}
          <div className="pt-2 text-center text-xs font-mono">
            <span className="text-white/40">
              {view === "login" ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => { setView(view === "login" ? "register" : "login"); setError(null); }}
              className="text-white font-bold hover:underline cursor-pointer ml-1"
            >
              {view === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] font-mono text-white/30 tracking-wider">
          AETHEX STORE &bull; SECURE LOGIN
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-xs text-white/50">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
