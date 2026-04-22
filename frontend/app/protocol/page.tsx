"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShieldAlert, Cpu, Eye, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PROTOCOL_STEPS = [
  {
    id: "Step 1",
    title: "Initial Scan & Threat Modeling",
    icon: Eye,
    description: "The AI agent reads state data cross-referenced from HR, Finance, and Operations APIs to build a probabilistic threat model of active margin leaks.",
    detail: `{ "scan_target": "ITFirm-X", "endpoints_active": 3, "drift_level": "Moderate" }`,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  },
  {
    id: "Step 2",
    title: "Forensic Reconciliation",
    icon: ShieldAlert,
    description: "Validates `audit_action` anomalies such as Ghost Payroll or Double Invoices. Triggers RBAC simulated checks and cross-references keys.",
    detail: `def reconcile(leak_id, key):\n  return ledger.validate(key) and rbac.authorized()`,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20"
  },
  {
    id: "Step 3",
    title: "Capital Reinvestment Strategy",
    icon: Cpu,
    description: "Recovered capital is piped into future-proofing modules: Automation Investment, Reskill Budget, and Pay Hikes to secure base OPM limits.",
    detail: `{ "automation_investment": "+15.0%", "reskill_budget": "+5.0%" }`,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20"
  },
  {
    id: "Step 4",
    title: "Stochastic Adversity Check",
    icon: Zap,
    description: "The environment dynamically mutates. Schema Drift modifies target endpoints. Market Shocks hit random departments, forcing adaptation in the next step.",
    detail: `[SCHEMA MUTATION] /api/payroll/salary -> /api/v2/compensation`,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20"
  }
];

export default function ProtocolInspector() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main className="min-h-screen bg-[#050505] font-sans selection:bg-amber-500/30 selection:text-white p-8 relative overflow-hidden">
      <div className="ambient-bg" />
      
      {/* Top Bar */}
      <nav className="relative z-10 flex items-center justify-between max-w-5xl mx-auto mb-16">
        <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Return to Console</span>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5">
          <CheckCircle2 size={14} className="text-amber-500" />
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">LOGIC TRACE ACTIVE</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Info */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-6">
            Protocol <span style={{ color: "#f59e0b" }}>Inspector</span>
          </h1>
          <p className="text-zinc-400 leading-relaxed mb-10 text-sm">
            Below is the full inference pipeline of the MetaAuditor "Execute Step" functionality. 
            This breaks down exactly what happens when the Llama-3 agent issues a decision.
          </p>

          <div className="space-y-6">
            {PROTOCOL_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <motion.div
                  key={idx}
                  onHoverStart={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl border transition-all cursor-crosshair ${
                    isActive ? "bg-white/5 border-white/20" : "bg-transparent border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${step.bg} ${step.border}`}>
                      <step.icon size={18} className={step.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${step.color}`}>{step.id}</span>
                        <h3 className="text-white font-bold">{step.title}</h3>
                      </div>
                      <p className="text-zinc-500 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="relative h-[600px] flex flex-col justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-amber-500/5 rounded-3xl blur-3xl opacity-50" />
          
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="relative bg-[#080a0b] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Terminal Window Chrome */}
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              <span className="ml-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                logic.trace // {PROTOCOL_STEPS[activeStep].id}
              </span>
            </div>

            <pre className="font-mono text-sm leading-8" style={{ color: "#a1a1aa" }}>
              <code>
                {PROTOCOL_STEPS[activeStep].detail.split('\n').map((line, i) => (
                  <div key={i} className="flex gap-4 group">
                    <span className="text-zinc-700 select-none group-hover:text-zinc-500">{i + 1}</span>
                    <span className={PROTOCOL_STEPS[activeStep].color}>{line}</span>
                  </div>
                ))}
              </code>
            </pre>
            
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs text-zinc-600 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Memory footprint: Active | Processing ms: {Math.floor(Math.random() * 40) + 12}ms
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
