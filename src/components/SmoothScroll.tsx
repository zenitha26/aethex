"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      // Allow 100% native smooth scrolling on mobile touch screens to eliminate touch lag
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Global scroll hook for page navigation triggers
    const handleScrollTo = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const selector = customEvent.detail;
      if (selector) {
        lenis.scrollTo(selector, { offset: 0, duration: 1.2 });
      }
    };

    window.addEventListener("scroll-to-element", handleScrollTo);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener("scroll-to-element", handleScrollTo);
    };
  }, []);

  return <>{children}</>;
}
