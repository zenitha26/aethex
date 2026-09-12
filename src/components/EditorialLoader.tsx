"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditorialLoader() {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show loader once per browser session
    const hasLoaded = sessionStorage.getItem("aethex_intro_loaded");
    if (hasLoaded) {
      return;
    }

    setIsVisible(true);

    // Fast, crisp cinematic step animation (under 600ms total)
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= 8) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem("aethex_intro_loaded", "true");
          }, 200);
          return 8;
        }
        return prev + 1;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("aethex_intro_loaded", "true");
  };

  const getProgressBar = (currentStep: number) => {
    const filled = "■".repeat(currentStep);
    const empty = "□".repeat(8 - currentStep);
    return `${filled}${empty}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          onClick={dismiss}
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%", 
            opacity: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 bg-white text-[#111111] z-[99999] flex flex-col justify-between p-8 md:p-16 select-none cursor-pointer border-b border-gray-200"
        >
          {/* Top Row: System Logs */}
          <div className="flex justify-between items-start text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold">
            <span>AETHEX / AUTOMOTIVE OS v1.0</span>
            <span className="text-gray-700">[ TAP ANYWHERE TO SKIP ]</span>
          </div>

          {/* Center Brand */}
          <div className="flex flex-col items-center justify-center text-center">
            <motion.h1 
              initial={{ letterSpacing: "0.4em", opacity: 0 }}
              animate={{ letterSpacing: "0.2em", opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-7xl font-light text-[#111111] tracking-widest leading-none mb-4"
            >
              AETHEX
            </motion.h1>
            
            <div className="space-y-2 mt-4">
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block font-semibold">
                INITIALIZING STOREFRONT DYNAMICS
              </span>
              <span className="text-sm font-mono tracking-widest text-[#111111] block">
                {getProgressBar(step)}
              </span>
            </div>
          </div>

          {/* Bottom Row: Context Metadata */}
          <div className="flex flex-col md:flex-row justify-between items-center text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold gap-2">
            <span>© 2026 AETHEX CO. SRI LANKA.</span>
            <span>[ WWW.AETHEXSTORE.COM ]</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
