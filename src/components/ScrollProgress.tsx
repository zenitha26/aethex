"use client";

import { useEffect, useState, startTransition } from "react";
import { audioEngine } from "../lib/audio";

export default function ScrollProgress() {
  const [activeChapter, setActiveChapter] = useState(1);
  const [availableChapters, setAvailableChapters] = useState<number[]>([]);

  useEffect(() => {
    const detectChapters = () => {
      const chapters: number[] = [];
      for (let i = 1; i <= 7; i++) {
        const el = document.getElementById(`chapter-0${i}`);
        if (el) {
          chapters.push(i);
        }
      }
      startTransition(() => {
        setAvailableChapters(chapters);
      });
    };

    detectChapters();

    const observer = new MutationObserver(detectChapters);
    observer.observe(document.body, { childList: true, subtree: true });

    const handleScroll = () => {
      let currentActive = 1;
      for (const ch of availableChapters) {
        const el = document.getElementById(`chapter-0${ch}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            currentActive = ch;
          }
        }
      }
      setActiveChapter(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [availableChapters]);

  if (availableChapters.length <= 1) return null;

  const handleChapterClick = (ch: number) => {
    audioEngine.playSelect();
    window.dispatchEvent(
      new CustomEvent("scroll-to-element", { detail: `#chapter-0${ch}` })
    );
  };

  return (
    <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-1 font-mono text-[10px] tracking-widest text-[#6B6B6B] select-none">
      {availableChapters.map((ch, idx) => (
        <div key={ch} className="flex flex-col items-center">
          <button
            onClick={() => handleChapterClick(ch)}
            className={`transition-colors duration-300 py-1 hover:text-[#6D001A] ${
              activeChapter === ch ? "text-[#6D001A] font-extrabold" : ""
            }`}
          >
            {`0${ch}`}
          </button>
          {idx < availableChapters.length - 1 && (
            <div className={`w-[1px] h-8 my-1 transition-colors duration-300 ${
              activeChapter === ch || activeChapter === ch + 1 ? "bg-[#6D001A]" : "bg-white/10"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}
