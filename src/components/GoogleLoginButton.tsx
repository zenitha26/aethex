"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { createClient } from "../lib/supabase/client";

export interface GoogleLoginButtonProps {
  mode?: "continue" | "signin" | "signup";
  variant?: "white" | "dark" | "pill" | "outline";
  size?: "sm" | "md" | "lg";
  monochrome?: boolean;
  redirectTo?: string;
  className?: string;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
}

export function GoogleIcon({ className = "w-5 h-5", monochrome = false }: { className?: string; monochrome?: boolean }) {
  if (monochrome) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    );
  }

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
  mode = "continue",
  variant = "white",
  size = "md",
  monochrome = false,
  redirectTo,
  className = "",
  disabled = false,
  onSuccess,
  onError,
  children,
}: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClient();

  const handleLogin = async () => {
    if (loading || disabled) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Preflight check for Supabase environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        const missing = [];
        if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
        if (!supabaseKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
        const envErr = new Error(`Configuration Error: Missing required environment variable(s): ${missing.join(", ")}`);
        (envErr as any).code = "MISSING_ENV_VARS";
        throw envErr;
      }

      // 2. Formulate destination callback URL
      const origin = typeof window !== "undefined" ? window.location.origin : "https://www.aethexstore.com";
      let destination = `${origin}/auth/callback`;
      if (redirectTo) {
        if (redirectTo.startsWith("/")) {
          destination = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
        } else {
          destination = redirectTo;
        }
      }

      // 3. Initiate Google OAuth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: destination,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw error;
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setLoading(false);
      const friendlyMessage = err?.message || "Google Authentication failed";
      setErrorMessage(friendlyMessage);

      // 4. Forceful Terminal / Console Logging with exact raw message, code, and stack trace
      console.error("\n========================================================");
      console.error("🔴 [GOOGLE AUTH SIGN-IN ERROR] signInWithOAuth failed:");
      console.error("• Raw Error:", err);
      console.error("• Error Code / Status:", err?.code || err?.status || err?.name || "OAUTH_INIT_ERROR");
      console.error("• Error Message:", err?.message || String(err));
      console.error("• Stack Trace:", err?.stack || new Error().stack);
      console.error("========================================================\n");

      if (onError) {
        onError(err instanceof Error ? err : new Error(friendlyMessage));
      }
    }
  };

  const labels = {
    continue: "Continue with Google",
    signin: "Sign in with Google",
    signup: "Sign up with Google",
  };

  const buttonText = children || labels[mode];

  // Variant classes
  const variantStyles = {
    white: "bg-white text-[#111111] border border-gray-300 hover:border-black shadow-xs rounded-2xl",
    dark: "bg-[#0B0B0B] text-white border border-white/10 hover:border-white/30 shadow-xs rounded-2xl",
    pill: "bg-white text-[#111111] border border-gray-300 hover:border-black shadow-xs rounded-full",
    outline: "bg-transparent text-[#111111] border border-gray-300 hover:border-black rounded-2xl",
  };

  // Size classes
  const sizeStyles = {
    sm: "py-2.5 px-4 text-xs gap-2.5",
    md: "py-3.5 px-5 text-sm gap-3",
    lg: "py-4 px-6 text-base gap-3.5",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <motion.button
        type="button"
        whileHover={!disabled && !loading ? { scale: 1.01, y: -1 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.99 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={handleLogin}
        disabled={disabled || loading}
        className={`w-full flex items-center justify-center font-medium font-sans transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      >
        {loading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin text-gray-500`} />
        ) : (
          <GoogleIcon className={`${iconSizes[size]} shrink-0`} monochrome={monochrome} />
        )}
        <span className="truncate">{loading ? "Connecting to Google..." : buttonText}</span>
      </motion.button>

      {/* Surface UI Error Feedback */}
      {errorMessage && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
          <span className="flex-1 leading-tight">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-800 p-0.5 shrink-0"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
