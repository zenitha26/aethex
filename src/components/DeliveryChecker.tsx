"use client";

import { useState } from "react";
import { Truck } from "lucide-react";

const DISTRICT_DATA: Record<string, { time: string; fee: string }> = {
  Colombo: { time: "24–48 HOURS", fee: "Rs. 350 (Free on 2+ Units)" },
  Gampaha: { time: "24–48 HOURS", fee: "Rs. 350 (Free on 2+ Units)" },
  Kalutara: { time: "24–48 HOURS", fee: "Rs. 350 (Free on 2+ Units)" },
  Kandy: { time: "2–3 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
  Galle: { time: "2–3 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
  Matara: { time: "2–3 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
  Kurunegala: { time: "2–3 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
  Ratnapura: { time: "2–3 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
  Kegalle: { time: "2–3 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
  Anuradhapura: { time: "3–4 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
  Jaffna: { time: "3–4 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
  Badulla: { time: "2–3 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
  Trincomalee: { time: "3–4 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
  Batticaloa: { time: "3–4 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
  Hambantota: { time: "2–3 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" },
};

export default function DeliveryChecker() {
  const [district, setDistrict] = useState("Colombo");

  const current = DISTRICT_DATA[district] || { time: "2–3 BUSINESS DAYS", fee: "Rs. 350 (Free on 2+ Units)" };

  return (
    <section className="py-12 px-6 sm:px-10 lg:px-12 bg-[#050505] border-b border-white/10 text-white">
      <div className="max-w-[1500px] mx-auto bg-[#0B0B0B] border border-white/10 p-6 sm:p-10 space-y-6 font-sans text-white shadow-2xl">
        
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-white/50 uppercase font-semibold">
          <Truck className="w-3.5 h-3.5 text-white" />
          <span>DELIVERY TIMEFRAME CHECKER</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* District Selector (6 Cols) */}
          <div className="md:col-span-6 space-y-2">
            <label className="text-[10px] font-mono uppercase text-white/50 tracking-wider block font-semibold">
              WHERE ARE WE SHIPPING?
            </label>
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
              }}
              className="w-full bg-white/5 border border-white/10 text-white p-3.5 text-xs font-mono outline-none focus:border-white cursor-pointer"
            >
              {Object.keys(DISTRICT_DATA).map((d) => (
                <option key={d} value={d} className="bg-[#0B0B0B] text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Expected Delivery Readout (6 Cols) */}
          <div className="md:col-span-6 bg-[#111111] p-4 sm:p-5 border border-white/10 space-y-1">
            <div className="text-[9px] font-mono tracking-widest text-white/50 uppercase font-semibold">
              EXPECTED DOORSTEP ARRIVAL
            </div>
            <div className="text-xl sm:text-2xl font-mono text-white font-bold tracking-wider">
              {current.time}
            </div>
            <div className="text-[10px] font-mono text-white/60">
              Insured Courier: {current.fee}
            </div>
          </div>

        </div>

        {/* 3 Authentic Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs font-mono text-white/70">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">✓</span>
            <span>DIRECT BANK CLEARANCE & COD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">✓</span>
            <span>ISLANDWIDE DOORSTEP DISPATCH</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">✓</span>
            <span>INSPECTION BEFORE ACCEPTANCE</span>
          </div>
        </div>

      </div>
    </section>
  );
}
