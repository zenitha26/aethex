"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Pause, RotateCcw, ArrowRight } from "lucide-react";
import { audioEngine } from "../lib/audio";

interface InstallationDemoPlayerProps {
  onOpenOrder?: () => void;
}

export default function InstallationDemoPlayer({ onOpenOrder }: InstallationDemoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      num: "01",
      label: "SEAT",
      title: "01 — Seat in Cup Well",
      desc: "Place the expansion base into your vehicle's center console cup-holder. Sits securely without tools or adhesives.",
      image: "/images/a711/hero.jpg",
      time: "0:00 – 0:08",
    },
    {
      num: "02",
      label: "LOCK",
      title: "02 — Lock Mechanical Dial",
      desc: "Turn the knurled dial clockwise. Three high-friction silicone pads expand outward to lock firmly against the cup well walls.",
      image: "/images/a711/isolated.jpg",
      time: "0:08 – 0:17",
    },
    {
      num: "03",
      label: "CALIBRATE",
      title: "03 — Calibrate Eye Line",
      desc: "Articulate the 180° dual-pivot arm to lift your phone to steering wheel eye level, keeping windshield sightlines clear.",
      image: "/images/a711/studio_hardware.jpg",
      time: "0:17 – 0:26",
    },
    {
      num: "04",
      label: "DRIVE",
      title: "04 — Drive & Rotate",
      desc: "Single-handedly rotate 360° between vertical GPS navigation and wide radar mode while maintaining complete highway stability.",
      image: "/images/a711/landscape_drive.jpg",
      time: "0:26 – 0:35",
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((s) => (s + 1) % steps.length);
          return 0;
        }
        return prev + 2.5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const handleSelectStep = (idx: number) => {
    audioEngine.playDetent();
    setActiveStep(idx);
    setProgress(0);
  };

  return (
    <div className="bg-[#0B0B0B] border border-white/10 p-6 sm:p-10 lg:p-12 space-y-8 font-sans shadow-2xl text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="text-[10px] font-mono tracking-[0.25em] text-white/50 uppercase font-semibold">
            FIELD TEST / 001
          </div>
          <h3 className="text-2xl sm:text-4xl font-light uppercase text-white tracking-tight font-mono">
            Road Test & Installation.
          </h3>
          <p className="text-white/60 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
            From unboxing to a rock-solid cockpit navigation station in under 30 seconds.
          </p>
        </div>

        {/* Play / Pause Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              audioEngine.playClick();
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-2 border border-white/10 hover:border-white px-4 py-2 text-[10px] font-mono tracking-widest uppercase text-white cursor-pointer bg-white/5 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>PLAY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Showcase: Image & Step Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Authentic Photography (7 Cols) */}
        <div className="lg:col-span-7 relative aspect-[16/10] bg-[#080808] border border-white/10 overflow-hidden shadow-2xl">
          <Image
            src={steps[activeStep].image}
            alt={steps[activeStep].title}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-center transition-all duration-500"
          />

          <div className="absolute top-4 left-4 bg-black/90 border border-white/20 px-3 py-1 text-[9px] font-mono tracking-widest text-white uppercase font-semibold backdrop-blur-md">
            PHASE {steps[activeStep].num} // {steps[activeStep].label}
          </div>

          <div className="absolute bottom-4 right-4 bg-black/90 border border-white/20 px-3 py-1 text-[9px] font-mono tracking-widest text-white/70 font-semibold backdrop-blur-md">
            {steps[activeStep].time}
          </div>
        </div>

        {/* Right: Step Timeline & Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Timeline Buttons */}
          <div className="space-y-2">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => handleSelectStep(idx)}
                  className={`w-full text-left p-4 border transition-all cursor-pointer ${
                    isActive
                      ? "bg-white/10 border-white text-white shadow-md"
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold tracking-wider">{step.num} — {step.label}</span>
                    <span className="text-[10px] text-white/50">{step.time}</span>
                  </div>

                  {isActive && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-white/70 font-light leading-relaxed">
                        {step.desc}
                      </p>
                      {/* Step Progress Line */}
                      <div className="w-full h-0.5 bg-white/10 overflow-hidden mt-2">
                        <div
                          className="h-full bg-white transition-all duration-150"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                audioEngine.playAcquire();
                if (onOpenOrder) onOpenOrder();
              }}
              className="w-full bg-white text-black hover:bg-white/90 transition-all py-3.5 text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xl"
            >
              <span>ORDER ASPOR A711 (RS. 2,990)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
