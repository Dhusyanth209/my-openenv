"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/hero";
import { AgentCarousel } from "@/components/carousel";
import { EnvironmentConsole } from "@/components/console";
import { MetricsGrid } from "@/components/metrics";
import { SmeFooter } from "@/components/sme";
import { DocsModal } from "@/components/docs-modal";
import Chatbot from "@/components/chatbot";
import { User, LogOut, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [userName, setUserName] = useState("Auditor");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("meta_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user profile from hardened backend
    fetch("/state")
      .then(res => res.json())
      .then(data => {
        if (data.user) setUserName(data.user.name);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("meta_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Initializing Secure Session...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative font-sans selection:bg-primary/30 selection:text-white">
      {/* Ambient gradient background fixed behind everything */}
      <div className="ambient-bg" />

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(24px)" }}>
        <div className="container mx-auto flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 font-extrabold text-lg tracking-tighter">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>M</div>
            <span className="gradient-text-primary">MetaAuditor</span>
            <span className="text-amber-500/50 font-normal text-[10px] tracking-widest uppercase ml-1">Console</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex gap-8 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
            <button onClick={() => setIsDocsOpen(true)} className="hover:text-white transition-colors">Docs</button>
            <a href="/protocol" className="hover:text-amber-500 transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Protocol Inspector
            </a>
            <a href="https://huggingface.co/Dhusyanth03" target="_blank" className="hover:text-white transition-colors">HuggingFace</a>
            <a href="#metrics" className="hover:text-white transition-colors">Benchmarks</a>
          </div>

          {/* Actions */}
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
              <User size={12} className="text-amber-500" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">{userName}</span>
            </div>
            <button
               onClick={handleLogout}
               className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-red-400 transition-colors"
               title="Secure Logout"
            >
              <LogOut size={16} />
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

      {/* Frame 3: Console */}
      <EnvironmentConsole />

      {/* Frame 4: Metrics */}
      <div id="metrics">
        <MetricsGrid />
      </div>

      {/* Frame 5: SME Footer */}
      <SmeFooter />

      {/* Documentation Modal */}
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      {/* Floating Copilot */}
      <Chatbot />
    </main>
  );
}
