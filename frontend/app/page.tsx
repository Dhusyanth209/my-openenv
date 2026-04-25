"use client";

import { useState } from "react";
import { Hero } from "@/components/hero";
import { AgentCarousel } from "@/components/carousel";
import { AuditDashboard } from "@/components/dashboard";
import { SmeFooter } from "@/components/sme";

import { DocsModal } from "@/components/docs-modal";

export default function Home() {
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  return (
    <main className="relative font-sans selection:bg-primary/30 selection:text-white">
      {/* Ambient gradient background fixed behind everything */}
      <div className="ambient-bg" />

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(24px)" }}>
        <div className="container mx-auto flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 font-extrabold text-lg tracking-tighter">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>M</div>
            <span className="gradient-text-primary">MetaAuditor</span>
            <span className="text-zinc-600 font-normal text-sm tracking-normal">Adversity</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex gap-8 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
            <button onClick={() => setIsDocsOpen(true)} className="hover:text-white transition-colors">Docs</button>
            <a href="https://huggingface.co/Dhusyanth03" target="_blank" className="hover:text-white transition-colors">HuggingFace</a>
            <a href="#metrics" className="hover:text-white transition-colors">Benchmarks</a>
          </div>

          {/* Actions */}
          <div className="flex gap-3 items-center">
            <button className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">GitHub</button>
            <button
              onClick={() => setIsDocsOpen(true)}
              className="text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              Judges&apos; Guide
            </button>
          </div>
        </div>
      </nav>

      {/* Frame 1: Hero */}
      <Hero onOpenDocs={() => setIsDocsOpen(true)} />

      {/* Frame 2: Brand Carousel */}
      <AgentCarousel />

      {/* Divider */}
      <div className="h-px mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ maxWidth: "800px" }} />

      {/* NEW: Structured Explanation System (Dashboard) */}
      <AuditDashboard />

      {/* Frame 5: SME Footer */}
      <SmeFooter />


      {/* Documentation Modal */}
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </main>
  );
}
