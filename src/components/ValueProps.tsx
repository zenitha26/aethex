"use client";

import { ShieldCheck, Truck, CreditCard, Clock } from "lucide-react";

export default function ValueProps() {
  const props = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-black" />,
      title: "100% GENUINE HARDWARE",
      desc: "Brand warranty & 7-day inspection replacement guarantee."
    },
    {
      icon: <Truck className="w-5 h-5 text-black" />,
      title: "ISLANDWIDE EXPRESS DELIVERY",
      desc: "Direct delivery to all 25 districts within 24–72 hours."
    },
    {
      icon: <CreditCard className="w-5 h-5 text-black" />,
      title: "CASH ON DELIVERY + CARDS",
      desc: "Pay securely at your doorstep or via bank transfer."
    },
    {
      icon: <Clock className="w-5 h-5 text-black" />,
      title: "3X 0% INTEREST INSTALLMENTS",
      desc: "Split payments seamlessly with Koko & Mintpay."
    }
  ];

  return (
    <section className="bg-white py-10 px-6 sm:px-10 lg:px-12">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {props.map((p, i) => (
          <div 
            key={i} 
            className="flex items-start gap-4 p-5 bg-[#FAFAFA] border border-gray-200/80 rounded-2xl hover:border-black/30 hover:shadow-md transition-all duration-300"
          >
            <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shrink-0 shadow-xs">
              {p.icon}
            </div>
            <div className="space-y-1">
              <h4 className="text-[#111111] text-xs font-semibold tracking-wide uppercase">
                {p.title}
              </h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
