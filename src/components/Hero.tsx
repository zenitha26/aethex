"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShoppingBag, Sparkles } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[160px] rounded-full" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 text-center px-6 max-w-4xl">

        {/* SMALL BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs tracking-widest backdrop-blur-xl"
        >
          <Sparkles className="h-3 w-3" />
          PREMIUM DROPSHIPPING EXPERIENCE
        </motion.div>

        {/* MAIN TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 text-4xl md:text-6xl font-light text-white leading-tight tracking-wide"
        >
          Discover Premium Products
          <br />
          with <span className="text-white font-semibold">AETHEX Store</span>
        </motion.h1>

        {/* SUB TEXT */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
        >
          Luxury curated dropshipping products delivered to Sri Lanka with
          Apple-level design experience, fast checkout, and trusted suppliers.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >

          {/* SHOP BUTTON */}
          <button
            onClick={() => router.push("/products")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition font-medium"
          >
            <ShoppingBag className="h-4 w-4" />
            Shop Now
          </button>

          {/* WHATSAPP BUTTON */}
          <a
            href="https://wa.me/94771234567?text=Hi%20AETHEX%20Store%2C%20I%20want%20to%20know%20more"
            target="_blank"
            className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition"
          >
            Order via WhatsApp
          </a>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-14 grid grid-cols-3 gap-6 text-center"
        >
          <div>
            <p className="text-white text-xl font-semibold">10K+</p>
            <p className="text-white/40 text-xs">Products</p>
          </div>

          <div>
            <p className="text-white text-xl font-semibold">24/7</p>
            <p className="text-white/40 text-xs">Support</p>
          </div>

          <div>
            <p className="text-white text-xl font-semibold">Fast</p>
            <p className="text-white/40 text-xs">Delivery</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}