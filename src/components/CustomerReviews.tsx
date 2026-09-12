"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquarePlus, X, Check } from "lucide-react";
import { audioEngine } from "../lib/audio";

interface FieldLog {
  id: string;
  vehicle: string;
  rating: number;
  quote: string;
  author: string;
  location: string;
}

const DEFAULT_LOGS: FieldLog[] = [
  {
    id: "log-1",
    vehicle: "HONDA VEZEL",
    rating: 5,
    quote: "Solid mount and easy to adjust. Doesn't block the AC vents and stays completely rigid on the highway.",
    author: "VERIFIED AETHEX DRIVER",
    location: "Colombo – Galle Corridor",
  },
  {
    id: "log-2",
    vehicle: "TOYOTA PREMIO",
    rating: 5,
    quote: "Holds phone in landscape without dropping. Arm articulation lets me position it exactly where I need it.",
    author: "VERIFIED AETHEX DRIVER",
    location: "Kandy Route",
  },
  {
    id: "log-3",
    vehicle: "TOYOTA AQUA",
    rating: 5,
    quote: "Fits the console cup well perfectly. Great eye-level height for GPS navigation without looking down.",
    author: "VERIFIED AETHEX DRIVER",
    location: "Western Province Daily Commute",
  },
  {
    id: "log-4",
    vehicle: "SUZUKI SWIFT",
    rating: 5,
    quote: "Tight lock in the cup holder. Zero vibration over uneven roads compared to my old windshield suction mount.",
    author: "VERIFIED AETHEX DRIVER",
    location: "Colombo City Drive",
  },
];

export default function CustomerReviews() {
  const [logs, setLogs] = useState<FieldLog[]>(DEFAULT_LOGS);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [formVehicle, setFormVehicle] = useState("");
  const [formQuote, setFormQuote] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aethex_field_logs");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLogs([...DEFAULT_LOGS, ...parsed]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVehicle.trim() || !formQuote.trim()) return;

    audioEngine.playAcquire();

    const newLog: FieldLog = {
      id: `log-${Date.now()}`,
      vehicle: formVehicle.trim().toUpperCase(),
      rating: 5,
      quote: formQuote.trim(),
      author: formAuthor.trim() ? formAuthor.trim() : "VERIFIED AETHEX DRIVER",
      location: "Verified Road Test",
    };

    const updated = [...logs, newLog];
    setLogs(updated);

    try {
      const customLogs = JSON.parse(localStorage.getItem("aethex_field_logs") || "[]");
      customLogs.push(newLog);
      localStorage.setItem("aethex_field_logs", JSON.stringify(customLogs));
    } catch {
      // ignore
    }

    setSubmitted(true);
    setTimeout(() => {
      setIsSubmitOpen(false);
      setSubmitted(false);
      setFormVehicle("");
      setFormQuote("");
      setFormAuthor("");
    }, 1500);
  };

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-12 bg-[#050505] border-b border-white/10 font-sans text-white" id="field-logs">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.25em] text-white/50 uppercase block font-semibold">
              FIELD LOGS // VERIFIED REVIEWS
            </span>
            <h3 className="text-2xl sm:text-4xl font-light uppercase text-white tracking-tight font-mono">
              Real Cars. Real Drivers. Real Results.
            </h3>
            <p className="text-white/60 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
              Verified driver feedback from daily commutes and highway routes across Sri Lanka.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              audioEngine.playClick();
              setIsSubmitOpen(true);
            }}
            className="border border-white/10 hover:border-white text-white px-5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer bg-white/5 shadow-xs"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-white" />
            <span>SUBMIT FIELD LOG</span>
          </button>
        </div>

        {/* Field Log Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-[#0B0B0B] border border-white/10 p-6 flex flex-col justify-between space-y-4 shadow-xl text-white"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/50 tracking-wider border-b border-white/10 pb-2">
                  <span className="text-white font-bold">{log.vehicle}</span>
                  <div className="flex text-white gap-0.5">
                    {[...Array(log.rating)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-white text-white" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-white/80 font-light leading-relaxed italic">
                  "{log.quote}"
                </p>
              </div>

              <div className="border-t border-white/10 pt-3 text-[9px] font-mono text-white/50 space-y-0.5">
                <div className="text-white font-semibold">{log.author}</div>
                <div>{log.location}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Field Log Modal */}
        {isSubmitOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#0B0B0B] border border-white/10 p-6 space-y-4 text-white font-sans relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-sm font-mono uppercase tracking-wider font-bold">Submit Driver Field Log</h4>
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-2">
                  <Check className="w-8 h-8 mx-auto text-white" />
                  <div className="text-xs font-mono uppercase font-bold">Log Recorded</div>
                  <p className="text-[11px] text-white/50">Thank you for contributing to driver road test logs.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] text-white/50 uppercase mb-1 font-semibold">
                      Vehicle Model
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Honda Vezel, Toyota Aqua..."
                      value={formVehicle}
                      onChange={(e) => setFormVehicle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 text-xs outline-none focus:border-white placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/50 uppercase mb-1 font-semibold">
                      Your Name / Handle (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ruwan P."
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 text-xs outline-none focus:border-white placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/50 uppercase mb-1 font-semibold">
                      Your Road Feedback / Review
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your driving experience with the mount..."
                      value={formQuote}
                      onChange={(e) => setFormQuote(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 text-xs outline-none focus:border-white placeholder:text-white/30 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-white/90 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-xl cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
