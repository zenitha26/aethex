"use client";

import { ShieldCheck, Truck, CreditCard, Clock } from "lucide-react";

export default function ValueProps() {
  const props = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      title: "100% GENUINE HARDWARE",
      desc: "Brand warranty & 7-day inspection replacement guarantee."
    },
    {
      icon: <Truck className="w-5 h-5 text-white" />,
      title: "ISLANDWIDE EXPRESS DELIVERY",
      desc: "Direct delivery to all 25 districts within 24–72 hours."
    },
    {
      icon: <CreditCard className="w-5 h-5 text-white" />,
      title: "DIRECT BANK TRANSFER & COD",
      desc: "Instant direct bank settlement or cash upon handover."
    },
    {
      icon: <Clock className="w-5 h-5 text-white" />,
      title: "LIVE ORDER TELEMETRY",
      desc: "Live order status lookup via phone number or order reference."
    }
  ];

  return (
    <section className="bg-[#050505] py-10 px-6 sm:px-10 lg:px-12 border-b border-white/10">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {props.map((p, i) => (
          <div 
            key={i} 
            className="flex items-start gap-4 p-5 bg-[#0B0B0B] border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shrink-0">
              {p.icon}
            </div>
            <div className="space-y-1">
              <h4 className="text-white text-xs font-mono font-semibold tracking-wide uppercase">
                {p.title}
              </h4>
              <p className="text-white/60 text-xs leading-relaxed">
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
