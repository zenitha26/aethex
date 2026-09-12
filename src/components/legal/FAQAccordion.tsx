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
    audioEngine.playDetent();
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3 font-sans">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="border border-gray-200 bg-white transition-colors shadow-xs"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
              aria-expanded={isOpen}
            >
              <div className="space-y-1">
                {item.tag && (
                  <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase block font-semibold">
                    {item.tag}
                  </span>
                )}
                <span className="text-sm sm:text-base font-mono uppercase text-[#111111] font-semibold tracking-wide">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 mt-1 flex-shrink-0 ${
                  isOpen ? "rotate-180 text-black" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm font-light text-gray-600 leading-relaxed border-t border-gray-100">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
