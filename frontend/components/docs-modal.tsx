"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Target, Award, Terminal } from "lucide-react";

export function DocsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-[#0c0d0e] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white/[0.03] p-8 border-b md:border-b-0 md:border-r border-white/5">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-4 h-4 bg-primary rounded-full" />
                  <span className="font-bold text-xs uppercase tracking-[0.2em]">Judges' Guide</span>
                </div>
                <nav className="space-y-4">
                  {[
                    { icon: BookOpen, label: "Environment" },
                    { icon: Target, label: "Objectives" },
                    { icon: Award, label: "Bonus Prizes" },
                    { icon: Terminal, label: "API Spec" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors cursor-pointer group">
                      <item.icon size={16} className="group-hover:text-primary transition-colors" />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>
                  ))}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
               <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
                 <X size={24} />
               </button>
               
               <div className="max-w-xl">
                 <h2 className="text-4xl font-bold mb-6">MetaAuditor: The Adversarial Frontier</h2>
                 <p className="text-zinc-400 leading-relaxed mb-8">
                   MetaAuditor-Enterprise is a high-fidelity simulator built for **OpenEnv**. It models an Indian IT Firm 
                   recovering from profit margin erosion through agentic forensic auditing and automated reinvestment.
                 </p>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                   <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <h3 className="text-sm font-bold text-primary mb-2 uppercase tracking-widest">Storytelling (30%)</h3>
                     <p className="text-xs text-zinc-500">A transition from manual forensic reconciliation to AI-driven margin defense.</p>
                   </div>
                   <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <h3 className="text-sm font-bold text-accent mb-2 uppercase tracking-widest">Innovation (40%)</h3>
                     <p className="text-xs text-zinc-500">Live multi-app synchronization (SAP + Workday) with real-time Schema Drift.</p>
                   </div>
                 </div>

                 <h3 className="text-xl font-bold mb-4">How to Pitch (2-Min Guide)</h3>
                 <ul className="space-y-4 mb-12">
                   {[
                     "Highlight the **Identity Provider (IDP)** layer ensuring secure RBAC.",
                     "Trigger a **POST /step** and point to the Agent Reasoning Trace.",
                     "Show the **Reward Curve** spiking after a successful forensic audit.",
                     "Explain how **Schema Drift** prevents the agent from being a 'script-follower'."
                   ].map((text, i) => (
                     <li key={i} className="flex gap-4 text-sm text-zinc-400">
                       <span className="text-primary font-bold">{i+1}.</span>
                       {text}
                     </li>
                   ))}
                 </ul>

                 <div className="p-8 bg-primary/10 border border-primary/20 rounded-3xl">
                    <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">Pro-Tip for Impression</p>
                    <p className="text-sm text-zinc-300 italic italic">"Observe the scrolling log—that's the agent adapting to a Market Shock in real-time."</p>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
