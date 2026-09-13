"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function EditorialLoader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    const hasLoaded = sessionStorage.getItem("aethex_intro_loaded");
    if (hasLoaded) {
      return;
    }

    setIsVisible(true);

    // Fade out cleanly as soon as the client is initialized (under 400ms)
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("aethex_intro_loaded", "true");
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("aethex_intro_loaded", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          onClick={dismiss}
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 bg-[#050505] z-[99999] flex items-center justify-center p-8 select-none cursor-pointer"
        >
          {/* Centered Official AETHEX Logo Only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center"
          >
            <Image
              src="/images/aethex-logo.png"
              alt="AETHEX"
              width={112}
              height={112}
              priority
              className="object-contain drop-shadow-[0_2px_16px_rgba(255,255,255,0.12)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
