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
    <main className="min-h-screen bg-white text-[#111111] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#F9F9F9] rounded-2xl p-8 border border-gray-200 space-y-6 shadow-sm">
        <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-bold font-display tracking-tight text-[#111111]">Unexpected Error</h1>
          <p className="text-gray-600 text-xs font-light max-w-xs mx-auto leading-relaxed">
            The page encountered an unexpected issue while rendering. Try reloading the module.
          </p>
        </div>

        <button
          onClick={reset}
          className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3.5 px-6 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <RotateCcw className="h-3.5 w-3.5 text-white" /> Reload Page
        </button>
      </div>
    </main>
  );
}
