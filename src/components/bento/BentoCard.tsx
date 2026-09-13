"use client";

import React from "react";
import { motion } from "framer-motion";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: "col-span-1" | "col-span-2" | "col-span-3" | "col-span-4" | "col-span-5" | "col-span-6" | "col-span-7" | "col-span-8" | "col-span-9" | "col-span-12";
  rowSpan?: "row-span-1" | "row-span-2";
  onClick?: () => void;
}

export function BentoCard({
  children,
  className = "",
  colSpan = "col-span-6",
  rowSpan = "row-span-1",
  onClick,
}: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`relative bg-[#0B0B0B] border border-white/10 hover:border-white/25 transition-colors p-6 sm:p-8 flex flex-col justify-between overflow-hidden group shadow-xl ${colSpan} ${rowSpan} ${className}`}
    >
      {/* Subtle corner mechanical viewfinders */}
      <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-white/20 pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-white/20 pointer-events-none" />
      <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-white/20 pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-white/20 pointer-events-none" />

      {children}
    </motion.div>
  );
}
