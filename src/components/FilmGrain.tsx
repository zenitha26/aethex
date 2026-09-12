"use client";

import { useEffect, useState } from "react";

export default function FilmGrain() {
  const [noiseUrl, setNoiseUrl] = useState<string>("");

  useEffect(() => {
    // Generate a 128x128 pixel pattern of noise
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.createImageData(128, 128);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Create subtle monochrome noise
      const val = Math.floor(Math.random() * 25); // Range [0, 24] for ultra-subtle grain
      data[i] = val;     // R
      data[i + 1] = val; // G
      data[i + 2] = val; // B
      data[i + 3] = 16;  // A (very translucent, 16/255 = ~6% opacity)
    }

    ctx.putImageData(imgData, 0, 0);
    setNoiseUrl(canvas.toDataURL());
  }, []);

  if (!noiseUrl) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        backgroundImage: `url(${noiseUrl})`,
        backgroundRepeat: "repeat",
        animation: "grainShift 0.8s steps(4) infinite",
        opacity: 0.35, // Gives 2% visual opacity
      }}
    />
  );
}
