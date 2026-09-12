"use client";

import { useEffect, useRef } from "react";

export default function GenerativeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get or set a session seed
    let seedStr = "";
    if (typeof window !== "undefined") {
      let stored = sessionStorage.getItem("aethex_seed");
      if (!stored) {
        stored = Math.random().toString(36).substring(2, 11);
        sessionStorage.setItem("aethex_seed", stored);
      }
      seedStr = stored;
    }

    // Helper to generate seed-based random numbers
    const xgRandom = (seed: string) => {
      let h = 0;
      for (let i = 0; i < seed.length; i++) {
        h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
      }
      return () => {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return ((h ^= h >>> 16) >>> 0) / 4294967296;
      };
    };

    const rand = xgRandom(seedStr);

    // Pre-calculate geometric components
    const linesCount = Math.floor(10 + rand() * 10);
    const circlesCount = Math.floor(5 + rand() * 8);
    const nodes: { x: number; y: number; r: number }[] = [];
    const traces: { x1: number; y1: number; x2: number; y2: number }[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawPattern();
    };

    const drawPattern = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw subtle layout background coordinates
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 80;

      // Vertical lines
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw technical blueprint markings
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.font = "8px monospace";
      ctx.fillText(`SEED: ${seedStr.toUpperCase()}`, 20, 30);
      ctx.fillText(`GRID_COORDS: [${w} x ${h}]`, 20, 42);

      // Generate nodes if empty
      if (nodes.length === 0) {
        for (let i = 0; i < circlesCount; i++) {
          nodes.push({
            x: rand() * w,
            y: rand() * h,
            r: 3 + rand() * 12,
          });
        }
        for (let i = 0; i < linesCount; i++) {
          const x1 = rand() * w;
          const y1 = rand() * h;
          // Direct PCB-style trace routing (horizontal/vertical, then diagonal)
          const isHorizontal = rand() > 0.5;
          const length = 100 + rand() * 250;
          const x2 = isHorizontal ? x1 + length : x1;
          const y2 = isHorizontal ? y1 : y1 + length;
          traces.push({ x1, y1, x2, y2 });
        }
      }

      // Draw circuit board nodes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        // Technical crosshairs
        ctx.beginPath();
        ctx.moveTo(node.x - node.r - 5, node.y);
        ctx.lineTo(node.x + node.r + 5, node.y);
        ctx.moveTo(node.x, node.y - node.r - 5);
        ctx.lineTo(node.x, node.y + node.r + 5);
        ctx.stroke();
      });

      // Draw traces
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      traces.forEach((trace) => {
        ctx.beginPath();
        ctx.moveTo(trace.x1, trace.y1);
        ctx.lineTo(trace.x2, trace.y2);
        ctx.stroke();

        // Trace terminal node dots
        ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
        ctx.beginPath();
        ctx.arc(trace.x1, trace.y1, 2, 0, Math.PI * 2);
        ctx.arc(trace.x2, trace.y2, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial trigger

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}
