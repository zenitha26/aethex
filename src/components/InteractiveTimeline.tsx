"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { GitCommit, Calendar, Cpu, Layers, Terminal } from "lucide-react";

interface TimelineNode {
  version: string;
  date: string;
  title: string;
  desc: string;
  icon: any;
  changes: string[];
}

export default function InteractiveTimeline() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<number>(0);

  const timelineData: TimelineNode[] = [
    {
      version: "v1.0.0",
      date: "October 2025",
      title: "Concept Silhouette",
      desc: "First sneaker prototypes. 3D-printed foam midsoles and hand-stitched mesh uppers.",
      icon: <Cpu className="h-5 w-5" />,
      changes: [
        "3D-printed organic tread geometry",
        "Hand-stitched tech-mesh uppers",
        "Configured ergonomic heel counters",
      ],
    },
    {
      version: "v2.0.0",
      date: "January 2026",
      title: "Cushioning Calibration",
      desc: "Introduced multi-density nitrogen-infused midsole foams and composite stabilizing plates.",
      icon: <Layers className="h-5 w-5" />,
      changes: [
        "Nitrogen-infused dynamic cushioning inserts",
        "Carbon fiber stabilizer plate layout",
        "Outsole multi-surface high-traction rubber",
      ],
    },
    {
      version: "v3.2.0",
      date: "April 2026",
      title: "The Customizer Lab",
      desc: "Launched our real-time interactive custom lab with virtual colorway mapping.",
      icon: <Terminal className="h-5 w-5" />,
      changes: [
        "Built WebGL-like realtime canvas previewer",
        "Dynamic custom material texturing options",
        "Direct cart integration with custom build hashes",
      ],
    },
    {
      version: "v4.0.0",
      date: "June 2026",
      title: "AETHEX Launch",
      desc: "Redesigned with immersive 3D scroll drops, custom pagination, and luxury digital assets.",
      icon: <GitCommit className="h-5 w-5" />,
      changes: [
        "Implemented scroll velocity liquid layout warps",
        "Session-seeded generative wireframe backgrounds",
        "Real-time simulated user peer cursor flows",
      ],
    },
  ];

  return (
    <div className="w-full py-16 bg-white/[0.01] border-t border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[10px] text-silver/40 uppercase tracking-widest font-extrabold border border-white/5 px-3.5 py-1 rounded-full">
            Version Control Timeline
          </span>
          <h3 className="text-white text-2xl md:text-3xl font-bold font-display mt-3">
            DRAG TO EXPLORE AETHEX ENGINEERING
          </h3>
          <p className="text-silver/50 text-xs mt-1.5 font-light">
            Tap nodes to trace the firmware commits and chassis revision logs.
          </p>
        </div>

        {/* Timeline Track */}
        <div ref={constraintsRef} className="w-full relative min-h-[140px] overflow-hidden mb-12 cursor-grab active:cursor-grabbing">
          <motion.div
            drag="x"
            dragConstraints={{ left: -450, right: 0 }}
            className="flex items-center gap-16 py-8 px-4 w-[1100px] relative"
          >
            {/* Center line */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-white/5 via-white/20 to-white/5 -translate-y-1/2" />

            {timelineData.map((node, index) => (
              <div key={node.version} className="relative flex flex-col items-center w-60 text-center">
                {/* Node Dot button */}
                <button
                  onClick={() => setSelectedNode(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border relative z-10 transition-all duration-500 ${
                    selectedNode === index
                      ? "bg-white text-black border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                      : "bg-[#050505] text-silver/50 border-white/10 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {node.icon}
                </button>

                {/* Node details */}
                <div className="mt-4">
                  <span className="text-[10px] font-mono text-white/40 font-bold block">{node.version}</span>
                  <h4 className="text-white text-sm font-bold mt-0.5">{node.title}</h4>
                  <span className="text-[9px] text-silver/40 flex items-center justify-center gap-1 mt-1 font-medium">
                    <Calendar className="h-3 w-3" /> {node.date}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Change Logs display card */}
        <motion.div
          key={selectedNode}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto p-6 md:p-8 rounded-3xl luxury-glass border border-white/10 bg-white/[0.01]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
            <div>
              <span className="text-[10px] text-[#d4af37] font-mono font-extrabold uppercase tracking-wider">
                Release Spec &bull; {timelineData[selectedNode].version}
              </span>
              <h4 className="text-white text-xl font-bold font-display mt-0.5">
                {timelineData[selectedNode].title}
              </h4>
            </div>
            <span className="text-xs text-silver/40 px-3 py-1 bg-white/5 border border-white/10 rounded-full font-medium self-start md:self-auto">
              {timelineData[selectedNode].date}
            </span>
          </div>

          <p className="text-silver/60 text-xs md:text-sm font-light leading-relaxed mb-6">
            {timelineData[selectedNode].desc}
          </p>

          <div className="space-y-2">
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-extrabold block">Commit Logs</span>
            {timelineData[selectedNode].changes.map((change, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-silver/50 leading-relaxed font-mono">
                <span className="text-white/40 mt-0.5">&gt;</span>
                <span>{change}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
