import React from "react";

interface PolicySectionProps {
  index?: string;
  title: string;
  children: React.ReactNode;
}

export default function PolicySection({ index, title, children }: PolicySectionProps) {
  return (
    <section className="space-y-3 pt-6 border-t border-white/5 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-2">
        {index && (
          <span className="text-xs font-mono text-white/50 tracking-widest">{index}</span>
        )}
        <h2 className="text-base sm:text-lg font-mono text-white uppercase tracking-wider">
          {title}
        </h2>
      </div>
      <div className="space-y-3 text-xs sm:text-sm font-light text-[#9A9A9A] leading-relaxed">
        {children}
      </div>
    </section>
  );
}
