"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("AETHEX ErrorBoundary captured error:", error);
  }, [error]);

  const handleReset = () => {
    reset();
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 text-center font-sans selection:bg-white selection:text-black relative overflow-hidden">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none -z-0" 
      />

      <div className="max-w-md w-full bg-[#0B0B0B] p-8 sm:p-10 border border-white/10 space-y-8 relative z-10 shadow-2xl">
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/30 pointer-events-none" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/30 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/30 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/30 pointer-events-none" />

        {/* Header Badge */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-white/10 text-[9px] font-mono tracking-[0.25em] uppercase text-white/60">
            <AlertCircle className="w-3.5 h-3.5 text-white" />
            <span>ERROR</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-light font-mono tracking-tight text-white uppercase leading-none">
            Something Went Wrong
          </h1>

          <p className="text-white/60 text-xs font-light max-w-xs mx-auto leading-relaxed">
            We couldn't load this page. Please try again or return to our home page.
          </p>

          {error?.digest && (
            <div className="text-[10px] font-mono text-white/30 bg-black/40 border border-white/5 py-1.5 px-3 truncate">
              ID: {error.digest}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-3 font-mono text-xs">
          <button
            onClick={handleReset}
            className="w-full bg-white text-black hover:bg-white/90 transition-all py-3.5 px-6 font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw className="h-3.5 w-3.5 text-black" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full border border-white/15 hover:border-white text-white/80 hover:text-white transition-all py-3 px-6 uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Home className="h-3.5 w-3.5 text-white/70" />
            <span>Return Home</span>
          </Link>
        </div>

        <div className="pt-2 border-t border-white/10 text-[9px] font-mono tracking-[0.2em] text-white/40 uppercase">
          AETHEX STORE
        </div>
      </div>
    </main>
  );
}
