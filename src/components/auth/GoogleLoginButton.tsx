"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface GoogleLoginButtonProps {
  className?: string;
  redirectTo?: string;
  text?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  compact?: boolean;
}

export function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function GoogleLoginButton({
  className = "",
  redirectTo,
  text = "Sign in with Google",
  onSuccess,
  onError,
  compact = false,
}: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Environment Variable Preflight Diagnostics
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        const missing = [];
        if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
        if (!supabaseKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
        const envErr = new Error(`Configuration Error: Missing required environment variable(s): ${missing.join(", ")}`);
        (envErr as unknown as Record<string, unknown>).code = "MISSING_ENV_VARS";
        throw envErr;
      }

      // 2. Formulate canonical redirect destination
      const origin = typeof window !== "undefined" ? window.location.origin : "https://www.aethexstore.com";
      let destination = `${origin}/auth/callback`;
      if (redirectTo) {
        if (redirectTo.startsWith("/")) {
          destination = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
        } else {
          destination = redirectTo;
        }
      }

      // 3. Check for in-app browser restrictions (Google blocks webviews)
      const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
      const isWebview = /FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|MicroMessenger/i.test(ua);
      if (isWebview) {
        setErrorMessage("Google sign-in is restricted inside in-app browsers. Please tap the menu button (•••) and select 'Open in Safari' or 'Open in Chrome'.");
        setLoading(false);
        return;
      }

      // 4. Initiate OAuth with Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: destination,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        throw error;
      }

      // 5. Force unconditional browser redirect for mobile browsers
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      setLoading(false);
      const authErr = err as { message?: string; code?: string; status?: string; name?: string; stack?: string };
      const friendlyMessage = authErr?.message || "Google sign-in could not be initiated on this device.";
      setErrorMessage(friendlyMessage);

      // 6. Forceful Terminal/Console Logging with exact raw message, code, and stack trace
      console.error("\n========================================================");
      console.error("🔴 [GOOGLE AUTH CLIENT ERROR] signInWithOAuth failed:");
      console.error("• Raw Error:", err);
      console.error("• Error Code / Status:", authErr?.code || authErr?.status || authErr?.name || "OAUTH_INIT_ERROR");
      console.error("• Error Message:", authErr?.message || String(err));
      console.error("• Stack Trace:", authErr?.stack || new Error().stack);
      console.error("========================================================\n");

      if (onError) {
        onError(err instanceof Error ? err : new Error(friendlyMessage));
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 text-white font-medium transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${
          compact ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-xs sm:text-sm"
        } ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white/70 shrink-0" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <GoogleIcon className="w-4 h-4 shrink-0" />
            <span>{text}</span>
          </>
        )}
      </button>

      {/* Surface UI Error Feedback */}
      {errorMessage && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span className="flex-1 leading-tight">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-400/60 hover:text-red-300 p-0.5 shrink-0"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

