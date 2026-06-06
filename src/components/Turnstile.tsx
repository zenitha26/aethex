"use client";

import { useEffect, useRef } from "react";

interface TurnstileProps {
  onVerify: (token: string) => void;
}

export default function Turnstile({ onVerify }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject Turnstile script if not present
    if (!document.getElementById("cloudflare-turnstile-script")) {
      const script = document.createElement("script");
      script.id = "cloudflare-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const checkAndRender = () => {
      if (typeof window !== "undefined" && (window as any).turnstile && containerRef.current) {
        try {
          (window as any).turnstile.render(containerRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
            theme: "dark",
            callback: (token: string) => {
              onVerify(token);
            },
          });
        } catch (e) {
          // If already rendered or container not ready
        }
      } else {
        setTimeout(checkAndRender, 100);
      }
    };

    checkAndRender();

    return () => {
      if (containerRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(containerRef.current);
        } catch (e) {}
      }
    };
  }, [onVerify]);

  return <div ref={containerRef} className="my-4 flex justify-center" />;
}
