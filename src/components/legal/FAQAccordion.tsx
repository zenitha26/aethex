"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { audioEngine } from "../../lib/audio";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
  tag?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    try { audioEngine.playClick(); } catch {}
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3 font-sans">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="border border-white/10 bg-[#0B0B0B] transition-all hover:border-white/20 shadow-xl"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
              aria-expanded={isOpen}
            >
              <div className="space-y-1">
                {item.tag && (
                  <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block font-semibold">
                    {item.tag}
                  </span>
                )}
                <span className="text-sm sm:text-base font-mono uppercase text-white font-medium tracking-wide">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-white/40 transition-transform duration-300 mt-1 flex-shrink-0 ${
                  isOpen ? "rotate-180 text-white" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 text-xs sm:text-sm font-light text-white/70 leading-relaxed border-t border-white/5">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
