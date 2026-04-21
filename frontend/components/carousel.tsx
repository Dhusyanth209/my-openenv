"use client";

import { motion } from "framer-motion";

const BRANDS = [
  { name: "Meta", emoji: "🔵", subtitle: "Grand Finale Partner" },
  { name: "PyTorch", emoji: "🔥", subtitle: "Training Backend" },
  { name: "Scaler", emoji: "⚡", subtitle: "AI Partner" },
  { name: "HuggingFace", emoji: "🤗", subtitle: "Model Hub" },
  { name: "OpenEnv", emoji: "🌐", subtitle: "Environment Standard" },
  { name: "Llama 3", emoji: "🦙", subtitle: "Meta Foundation Model" },
  { name: "Unsloth", emoji: "🦥", subtitle: "Fast Fine-Tuning" },
  { name: "Cerebral Valley", emoji: "🧠", subtitle: "Hackathon Host" },
];

// Duplicate for seamless loop
const TRACK = [...BRANDS, ...BRANDS];

export function AgentCarousel() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-10"
      >
        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-600">
          Powered by the world&apos;s best AI infrastructure
        </p>
      </motion.div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #000 0%, transparent 100%)" }} />
      <div className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #000 0%, transparent 100%)" }} />

      {/* Scrolling track */}
      <div className="flex overflow-hidden">
        <div className="marquee-track flex gap-4 shrink-0">
          {TRACK.map((brand, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, borderColor: "rgba(129,140,248,0.4)" }}
              className="flex-shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-xl glass cursor-default transition-all"
              style={{ minWidth: "200px" }}
            >
              <span className="text-2xl">{brand.emoji}</span>
              <div>
                <div className="font-bold text-sm text-white">{brand.name}</div>
                <div className="text-[11px] text-zinc-500">{brand.subtitle}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
