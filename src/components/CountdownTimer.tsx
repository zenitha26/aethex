"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function CountdownTimer() {
  // Hardcoded for demonstration: 2 hours from mount
  const [timeLeft, setTimeLeft] = useState(7200);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-[#ff3b30] bg-[#ff3b30]/10 px-4 py-2 rounded-xl border border-[#ff3b30]/20 w-fit">
      <Clock className="w-4 h-4 animate-pulse" />
      <span>Flash Sale Ends In: {formatTime(timeLeft)}</span>
    </div>
  );
}
