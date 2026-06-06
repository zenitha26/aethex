"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to tracking service
    console.error("ErrorBoundary captured error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full luxury-glass rounded-3xl p-8 border border-white/10 space-y-6">
        <div className="w-12 h-12 bg-red-950/40 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-bold font-display tracking-tight">Unexpected Error</h1>
          <p className="text-silver/50 text-xs font-light max-w-xs mx-auto leading-relaxed">
            The workspace peripheral rendering pipeline encountered an exception. Try refreshing the module canvas.
          </p>
        </div>

        <button
          onClick={reset}
          className="apple-btn text-xs py-3 w-full justify-center"
        >
          <RotateCcw className="h-3.5 w-3.5 text-black" /> Reset Component Canvas
        </button>
      </div>
    </main>
  );
}
