"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export default function StockStatus() {
  const [stock, setStock] = useState(12);

  useEffect(() => {
    // Simulate stock going down occasionally to create urgency
    const timer = setInterval(() => {
      setStock((prev) => (prev > 3 ? prev - 1 : prev));
    }, 45000); // every 45s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-[#ff9f0a] bg-[#ff9f0a]/10 px-4 py-2 rounded-xl border border-[#ff9f0a]/20 w-fit">
      <AlertTriangle className="w-4 h-4 animate-pulse" />
      <span>Hurry! Only {stock} items left in stock.</span>
    </div>
  );
}
