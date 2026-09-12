"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const SAMPLES = [
  "John from Colombo just bought this.",
  "Sarah from Kandy just added this to cart.",
  "A user from Galle just bought this.",
  "2 people are currently viewing this item.",
  "12 items sold in the last 24 hours.",
];

export default function LiveSync() {
  const [message, setMessage] = useState(SAMPLES[3]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Simulate real-time data sync for social proof
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        const randomMsg = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
        setMessage(randomMsg);
        setVisible(true);
      }, 500); // 500ms fade out before showing new message
    }, 8000); // Change message every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`transition-opacity duration-500 flex items-center gap-2 text-xs text-[#a1a1a6] mt-4 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <Sparkles className="w-3.5 h-3.5 text-white/40" />
      <span>{message}</span>
    </div>
  );
}
