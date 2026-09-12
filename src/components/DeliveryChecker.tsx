"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { audioEngine } from "../lib/audio";

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
    <section className="py-12 px-6 sm:px-10 lg:px-12 bg-[#F9F9F9] border-b border-gray-200">
      <div className="max-w-[1500px] mx-auto bg-white border border-gray-200 p-6 sm:p-10 space-y-6 font-sans text-[#111111] shadow-xs">
        
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase font-semibold">
          <Truck className="w-3.5 h-3.5 text-black" />
          <span>DELIVERY TIMEFRAME CHECKER</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* District Selector (6 Cols) */}
          <div className="md:col-span-6 space-y-2">
            <label className="text-[10px] font-mono uppercase text-gray-500 tracking-wider block font-semibold">
              WHERE ARE WE SHIPPING?
            </label>
            <select
              value={district}
              onChange={(e) => {
                audioEngine.playDetent();
                setDistrict(e.target.value);
              }}
              className="w-full bg-[#F9F9F9] border border-gray-300 text-[#111111] p-3.5 text-xs font-mono outline-none focus:border-black cursor-pointer shadow-xs"
            >
              {Object.keys(DISTRICT_DATA).map((d) => (
                <option key={d} value={d} className="bg-white text-black">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Expected Delivery Readout (6 Cols) */}
          <div className="md:col-span-6 bg-[#F9F9F9] p-4 sm:p-5 border border-gray-200 space-y-1 shadow-xs">
            <div className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-semibold">
              EXPECTED DOORSTEP ARRIVAL
            </div>
            <div className="text-xl sm:text-2xl font-mono text-black font-bold tracking-wider">
              {current.time}
            </div>
            <div className="text-[10px] font-mono text-gray-600">
              Standard Courier: {current.fee}
            </div>
          </div>

        </div>

        {/* 3 Authentic Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-200 text-xs font-mono text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-black font-bold">✓</span>
            <span>CASH ON DELIVERY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-black font-bold">✓</span>
            <span>ISLANDWIDE DOORSTEP DISPATCH</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-black font-bold">✓</span>
            <span>INSPECTION BEFORE PAYMENT</span>
          </div>
        </div>

      </div>
    </section>
  );
}
