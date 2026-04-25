"use client";

import { motion } from "framer-motion";
import { 
  KpiHeader, 
  EnvironmentPanel, 
  TrainingPanel, 
  ImprovementPanel, 
  LiveDemoPanel 
} from "./panels";

export function AuditDashboard() {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Section Header for Judges */}
        <div className="text-center mb-12">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold tracking-[0.3em] uppercase text-indigo-400 mb-3"
          >
            OpenEnv Grand Finale · Technical Validation
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight gradient-text mb-4"
          >
            MetaAuditor Performance Dashboard
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 max-w-2xl mx-auto text-sm"
          >
            A comprehensive overview of the environment architecture, agent training dynamics, 
            performance improvements, and live forensic execution.
          </motion.p>
        </div>

        {/* Global KPI Strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <KpiHeader />
        </motion.div>

        {/* 2x2 Grid for Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* [1] Environment Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 rounded-3xl glass relative overflow-hidden"
          >
            <EnvironmentPanel />
          </motion.div>

          {/* [2] Training Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-8 rounded-3xl glass relative overflow-hidden"
          >
            <TrainingPanel />
          </motion.div>

          {/* [3] Improvement Panel (Full width on smaller screens, 1st col on large) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-8 rounded-3xl glass relative overflow-hidden lg:col-span-1"
          >
            <ImprovementPanel />
          </motion.div>

          {/* [4] Live Demo Panel (Main interactive) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-8 rounded-3xl glass relative overflow-hidden border border-indigo-500/20 bg-indigo-500/[0.02]"
          >
            <LiveDemoPanel />
          </motion.div>

        </div>

        {/* Closing Insight */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Status: Optimized for Enterprise Forensics
          </div>
        </motion.div>

      </div>
    </section>
  );
}
