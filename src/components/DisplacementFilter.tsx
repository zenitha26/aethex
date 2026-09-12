"use client";

import { useEffect, useRef } from "react";

export default function DisplacementFilter() {
  const mapRef = useRef<SVGFEDisplacementMapElement>(null);
  const scrollPos = useRef(0);
  const velocity = useRef(0);
  const targetScale = useRef(0);
  const currentScale = useRef(0);

  useEffect(() => {
    scrollPos.current = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const diff = currentScroll - scrollPos.current;
      velocity.current = diff;
      scrollPos.current = currentScroll;

      // Calculate target distortion scale based on speed
      // Max displacement capped at 40px to prevent visual breakage
      targetScale.current = Math.min(Math.abs(diff) * 0.45, 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    let animId: number;
    const updateFilter = () => {
      // Smoothly return scale to 0 (decay factor of 0.85)
      targetScale.current *= 0.85;
      if (Math.abs(targetScale.current) < 0.1) {
        targetScale.current = 0;
      }

      // Interpolate current scale towards target scale
      currentScale.current += (targetScale.current - currentScale.current) * 0.15;

      if (mapRef.current) {
        // Set scale dynamically
        mapRef.current.setAttribute("scale", currentScale.current.toFixed(2));
      }

      animId = requestAnimationFrame(updateFilter);
    };

    animId = requestAnimationFrame(updateFilter);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        <filter id="liquid-distortion">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.05"
            numOctaves="1"
            result="noise"
          />
          <feDisplacementMap
            ref={mapRef}
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
