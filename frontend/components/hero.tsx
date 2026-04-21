"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, LineChart, Terminal, ArrowRight, BookOpen } from "lucide-react";

const MORPHS = [
  {
    id: "governance",
    icon: ShieldCheck,
    label: "Theory of Mind",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.5)",
    phrase: ["Discover", "Emergent Strategic", "Behavior"],
  },
  {
    id: "reward",
    icon: LineChart,
    label: "Reward Scaling",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.5)",
    phrase: ["Discover", "Long-Horizon", "Planning"],
  },
  {
    id: "api",
    icon: Terminal,
    label: "World Modeling",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.5)",
    phrase: ["Discover", "Recursive Skill", "Amplification"],
  },
];

export function Hero({ onOpenDocs }: { onOpenDocs: () => void }) {
  const [index, setIndex] = useState(0);
  const current = MORPHS[index];
  const Icon = current.icon;

  useEffect(() => {
    const t = setInterval(() => setIndex((p) => (p + 1) % MORPHS.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-6 overflow-hidden">

      {/* ── Pill Badge ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 text-xs font-semibold tracking-widest uppercase text-zinc-400"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        OpenEnv Grand Finale · Live Environment
      </motion.div>

      {/* ── Morphing Icon Core ── */}
      <motion.div
        className="relative mb-14 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute rounded-full"
          animate={{
            width: ["180px", "220px", "180px"],
            height: ["180px", "220px", "180px"],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: `radial-gradient(circle, ${current.glow} 0%, transparent 70%)` }}
        />

        {/* Glass hexagon container */}
        <div
          className="relative z-10 w-40 h-40 flex items-center justify-center rounded-3xl glass"
          style={{
            boxShadow: `0 0 60px 15px ${current.glow}`,
            border: `1px solid ${current.color}30`,
            transition: "box-shadow 0.8s ease, border-color 0.8s ease",
          }}
        >
          {/* Inner shimmer */}
          <div
            className="absolute inset-0 rounded-3xl opacity-10"
            style={{ background: `linear-gradient(135deg, ${current.color}60 0%, transparent 60%)` }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ y: 24, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -24, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <Icon size={70} style={{ color: current.color }} strokeWidth={1.5} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${current.id}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="absolute -bottom-8 text-[11px] font-bold tracking-[0.2em] uppercase"
            style={{ color: current.color }}
          >
            {current.label}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── Headline ── */}
      <div className="text-center max-w-5xl mt-4">
        <AnimatePresence mode="wait">
          <motion.h1
            key={`headline-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.05]"
          >
            <span className="gradient-text">{current.phrase[0]} </span>
            <span className="gradient-text-primary">{current.phrase[1]} </span>
            <span className="gradient-text">{current.phrase[2]}</span>
          </motion.h1>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          A high-fidelity OpenEnv enterprise simulation where a fine-tuned{" "}
          <span className="text-zinc-200 font-semibold">Meta Llama-3</span> agent
          reconciles margin leaks across HR, Finance & Ops in real time.
        </motion.p>
      </div>

      {/* ── CTA Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 mt-12"
      >
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 40px 8px rgba(129,140,248,0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.scrollTo({ top: 900, behavior: "smooth" })}
          className="group flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm tracking-wide text-white"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
        >
          Launch Environment
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenDocs}
          className="flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm tracking-wide text-zinc-300 glass hover:text-white transition-colors"
        >
          <BookOpen size={16} />
          View Training Script
        </motion.button>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-zinc-600 text-xs tracking-widest uppercase"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent"
        />
        Scroll
      </motion.div>
    </section>
  );
}
