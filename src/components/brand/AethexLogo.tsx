"use client";

import Image from "next/image";
import Link from "next/link";
import { audioEngine } from "../../lib/audio";

interface AethexLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  isLink?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function AethexLogo({
  size = "md",
  showWordmark = true,
  isLink = true,
  className = "",
  onClick,
}: AethexLogoProps) {
  // Dimensions for the 1:1 official metallic apex emblem
  const sizeMap = {
    sm: { dimension: 22, textClass: "text-sm tracking-[0.2em]" },
    md: { dimension: 28, textClass: "text-lg tracking-[0.25em]" },
    lg: { dimension: 36, textClass: "text-xl tracking-[0.25em]" },
    xl: { dimension: 48, textClass: "text-2xl tracking-[0.3em]" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const handleClick = () => {
    try {
      audioEngine.playSelect();
    } catch {}
    if (onClick) onClick();
  };

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Official Metallic Apex Emblem */}
      <div 
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: currentSize.dimension, height: currentSize.dimension }}
      >
        <Image
          src="/images/aethex-logo.png"
          alt="AETHEX Official Brand Emblem"
          width={currentSize.dimension}
          height={currentSize.dimension}
          priority
          className="object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.08)]"
        />
      </div>

      {/* Editorial Wordmark Pairing */}
      {showWordmark && (
        <div className="flex items-center gap-1.5">
          <span className={`font-mono font-bold uppercase text-white transition-opacity duration-200 group-hover:opacity-85 ${currentSize.textClass}`}>
            AETHEX
          </span>
          <span className="w-1 h-1 rounded-full bg-white animate-pulse hidden sm:inline-block" />
        </div>
      )}
    </div>
  );

  if (isLink) {
    return (
      <Link 
        href="/" 
        onClick={handleClick}
        aria-label="AETHEX Home"
        className="inline-flex items-center focus:outline-none focus:ring-1 focus:ring-white/20 rounded-sm"
      >
        {content}
      </Link>
    );
  }

  return content;
}
