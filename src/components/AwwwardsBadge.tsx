"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, CheckCircle2, Star } from "lucide-react";

export default function AwwwardsBadge() {
  const [scrollRot, setScrollRot] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollRot(window.scrollY / 3);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Rotator Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-24 md:bottom-6 z-[9980] w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center cursor-pointer border border-white/10 bg-black/80 hover:border-white/30 group"
      >
        {/* Rotating Circular Text SVG */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-75 ease-out"
          style={{ transform: `rotate(${scrollRot}deg)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              id="circlePath"
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="none"
            />
            <text className="fill-white/60 font-bold text-[8.2px] tracking-[3.5px] uppercase font-sans">
              <textPath href="#circlePath">
                AETHEX STORE • AWWWARDS NOMINEE •
              </textPath>
            </text>
          </svg>
        </div>

        {/* Center Ribbon Icon */}
        <div className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-350">
          <span className="text-black font-extrabold text-[12px] md:text-[13px] tracking-tight">W.</span>
        </div>
      </motion.div>

      {/* Awwwards Metric Scorecard Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="relative w-full max-w-md p-8 border border-white/10 bg-[#0B0B0B] flex flex-col gap-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 border border-white/10 hover:border-white/20 bg-white/5 text-white transition-all"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              {/* Title & Badge */}
              <div className="flex items-center gap-4">
                <div className="p-3 border border-white/10 text-white bg-black">
                  <Award size={24} />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-extrabold font-mono">Awwwards Evaluation</span>
                  <h3 className="text-white text-xl font-bold tracking-tight uppercase mt-1">NOMINEE SCORECARD</h3>
                </div>
              </div>

              <p className="text-[#9A9A9A] text-xs font-light leading-relaxed">
                Evaluating structural excellence, reactive interface animations, and developer engineering metrics for the AETHEX Store project.
              </p>

              {/* Categories (Strictly Monochrome) */}
              <div className="space-y-4">
                <MetricBar title="Design Aesthetics" score={9.3} />
                <MetricBar title="Usability & Access" score={9.1} />
                <MetricBar title="Creative Engineering" score={9.5} />
                <MetricBar title="Content Refinement" score={9.0} />
              </div>

              {/* Overall Total */}
              <div className="p-4 border border-white/10 bg-black flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] block font-bold font-mono">Overall Verdict</span>
                  <span className="text-white text-2xl font-extrabold tracking-tight">9.23 / 10</span>
                </div>
                <div className="flex gap-1 text-white">
                  <Star size={14} fill="white" />
                  <Star size={14} fill="white" />
                  <Star size={14} fill="white" />
                  <Star size={14} fill="white" />
                  <Star size={14} fill="white" />
                </div>
              </div>

              {/* CTA Vote Button */}
              <button
                disabled={voted}
                onClick={() => setVoted(true)}
                className={`w-full py-4 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 ${
                  voted
                    ? "bg-white/10 text-white/60 border border-white/20"
                    : "bg-white text-black hover:bg-[#ECECEC]"
                }`}
              >
                {voted ? (
                  <>
                    <CheckCircle2 size={16} /> Vote Cast Successfully
                  </>
                ) : (
                  "Vote For Aethex Store"
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

interface MetricBarProps {
  title: string;
  score: number;
}

function MetricBar({ title, score }: MetricBarProps) {
  const percentage = score * 10;
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-2">
        <span className="text-[#9A9A9A] uppercase tracking-wider text-[10px]">{title}</span>
        <span className="text-white font-mono">{score.toFixed(1)}</span>
      </div>
      <div className="w-full h-1 bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-white"
        />
      </div>
    </div>
  );
}
