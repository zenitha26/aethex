"use client";

import { useEffect, useState, startTransition } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  // Real user cursor coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config for smooth follow
  const springConfig = { damping: 35, stiffness: 350, mass: 0.35 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Dynamic hover bindings for custom cursor attributes
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const closestInteractive = target.closest("a, button, [role='button'], input, select, textarea");
      const cursorTarget = target.closest("[data-cursor]") as HTMLElement;

      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor") || "";
        startTransition(() => {
          setCursorText(text.toUpperCase());
          setIsHovered(true);
        });
      } else if (closestInteractive) {
        startTransition(() => {
          setCursorText("");
          setIsHovered(true);
        });
      } else {
        startTransition(() => {
          setCursorText("");
          setIsHovered(false);
        });
      }
    };

    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // Disable completely on mobile touch screens
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(isTouch);
  }, []);

  if (isTouchDevice || !isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {/* Outer hairline circle */}
      <motion.div
        animate={{
          scale: isHovered ? 1.5 : 1,
          width: cursorText ? 80 : 36,
          height: cursorText ? 80 : 36,
          borderColor: isHovered ? "#6D001A" : "rgba(255, 255, 255, 0.2)",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.15 }}
        className="rounded-full border flex items-center justify-center relative overflow-hidden"
      >
        {/* Dynamic Text Indicator */}
        {cursorText && (
          <span className="text-white font-mono text-[9px] tracking-widest uppercase font-bold text-center">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Tiny center dot (only on default state) */}
      {!isHovered && (
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      )}
    </motion.div>
  );
}
