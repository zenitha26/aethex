"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, Preload } from '@react-three/drei';
import ShoeModel from './ShoeModel';
import Magnetic from './Magnetic';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Animate the main stacked heading
      headingRefs.current.forEach((el, index) => {
        if (!el) return;
        const chars = el.querySelectorAll('.char');
        tl.fromTo(
          chars,
          { y: 120, opacity: 0, rotateX: -30 },
          { 
            y: 0, 
            opacity: 1, 
            rotateX: 0, 
            stagger: 0.03, 
            duration: 1.4, 
            ease: "power4.out" 
          },
          index * 0.15 
        );
      });

      // Fade in the subtitle and button
      tl.fromTo(
        '.hero-fade-up',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: "power3.out" },
        "-=0.8"
      );

      // Fade in the left pagination
      tl.fromTo(
        '.pagination-item',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power3.out" },
        "-=1.2"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Multi-layer Parallax System
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
    const y = (clientY / window.innerHeight - 0.5) * 2; // -1 to 1

    // Move UI layers at different speeds (negative/positive values create depth)
    gsap.to('.parallax-deep', { x: x * 20, y: y * 20, duration: 1.5, ease: 'power2.out' });
    gsap.to('.parallax-mid', { x: x * -10, y: y * -10, duration: 1.5, ease: 'power2.out' });
    gsap.to('.parallax-close', { x: x * -25, y: y * -25, duration: 1.5, ease: 'power2.out' });
  };

  const titleLines = ["VOID", "RUNNER", "01"];

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen bg-[#050505] text-[#FFFFFF] overflow-hidden"
    >
      {/* 3D Cinematic Experience (Full Background) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <Canvas 
          shadows
          camera={{ position: [0, 0, 7], fov: 35 }}
          gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
          dpr={[1, 2]}
        >
          {/* Subtle HDRI for base reflections without overpowering the PBR lights */}
          <Environment preset="city" environmentIntensity={0.2} />
          
          <Float 
            speed={1.2} 
            rotationIntensity={0.2} 
            floatIntensity={0.3}
            floatingRange={[-0.1, 0.1]}
          >
            {/* Shift the shoe slightly to the right to balance the heavy typography on the left */}
            <group position={[1.5, 0, 0]}>
              <ShoeModel />
            </group>
          </Float>

          <Preload all />
        </Canvas>
      </div>

      {/* Main UI Overlay - Pointer events none on wrapper to allow Canvas interaction */}
      <div className="absolute inset-0 z-10 w-full h-full pointer-events-none flex pt-32 pb-16 px-6 md:px-12 lg:px-20">
        
        {/* Left Pagination Bar */}
        <div className="hidden md:flex flex-col justify-center items-center mr-16 lg:mr-24 gap-4 h-full parallax-mid pointer-events-auto">
          {["01", "02", "03", "04", "05", "06"].map((num, i) => (
            <div 
              key={num} 
              className={`pagination-item text-xs font-mono tracking-widest cursor-pointer transition-colors duration-500 flex flex-col items-center gap-2 ${
                i === 0 ? "text-white" : "text-[#6B6B6B] hover:text-[#9A9A9A]"
              }`}
            >
              {i === 0 && <span className="w-[1px] h-4 bg-white mb-1" />}
              {num}
            </div>
          ))}
        </div>

        {/* Content Column */}
        <div className="flex flex-col justify-center h-full max-w-xl pointer-events-none">
          
          <p className="hero-fade-up parallax-deep text-[#9A9A9A] tracking-widest text-xs uppercase mb-6 font-mono font-medium">
            CHAPTER 01
          </p>

          <h1 className="flex flex-col gap-2 mb-10 parallax-close pointer-events-none">
            {titleLines.map((line, lineIndex) => (
              <div 
                key={line} 
                className="overflow-hidden"
                ref={(el) => { headingRefs.current[lineIndex] = el; }}
              >
                <div 
                  className="text-6xl md:text-8xl lg:text-[8.5rem] leading-[0.85] tracking-tight font-light drop-shadow-2xl"
                  style={{ fontFamily: 'Neue Montreal, sans-serif' }}
                >
                  {line.split('').map((char, i) => (
                    <span key={i} className="char inline-block">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </h1>

          <div className="hero-fade-up parallax-mid flex flex-col gap-8 pointer-events-auto">
            <p className="text-[#9A9A9A] text-sm md:text-base leading-relaxed uppercase tracking-wider font-medium max-w-sm drop-shadow-md" style={{ fontFamily: 'Inter, sans-serif' }}>
              Built for the unknown.<br/>
              Designed to disrupt.
            </p>

            <div>
              <Magnetic>
                <button className="group flex items-center gap-4 text-xs font-mono tracking-widest uppercase text-white hover:text-[#ECECEC] transition-colors pb-1 border-b border-white/20 hover:border-white">
                  EXPLORE DROP
                  <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                </button>
              </Magnetic>
            </div>
          </div>
          
        </div>
      </div>

    </section>
  );
}