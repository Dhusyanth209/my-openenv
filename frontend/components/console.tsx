"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Code2, ChevronDown, Cpu, Wifi, WifiOff, Brain, Zap, Copy, Check } from "lucide-react";

const THOUGHT_TRACES = [
  "Analyzing multi-app sync discrepancy between HR and Finance data...",
  "Detected ghost payroll anomaly in EMP-7821. Confidence: 98.4%",
  "Cross-referencing OpsPortal POD delivery against invoice count...",
  "Schema drift detected: 'revenue' → 'financial_yield'. Adapting world-model...",
  "Submitting audit_action with reconciliation key. RBAC: AUTHORIZED",
  "Capital recovered: +₹4.2M. Reallocating to automation_investment.",
];

const SAMPLE_BODY = `{
  "pay_hike": 3,
  "reskill_budget": 5.0,
  "automation_investment": 15.0,
  "bidding_strategy": "balanced",
  "cost_cut_admin": 0,
  "audit_action": {
    "leak_id": "LEAK-842",
    "key": "EMP-7821"
  }
}`;

export function EnvironmentConsole() {
  const [expanded, setExpanded] = useState<string | null>("POST /step");
  const [isExecuting, setIsExecuting] = useState(false);
  const [thoughtIdx, setThoughtIdx] = useState(0);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [backendState, setBackendState] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const thoughtRef = useRef<HTMLDivElement>(null);

  // Poll backend
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch("http://localhost:7860/state");
        if (res.ok) setBackendState((await res.json()).state);
      } catch (_) {}
    };
    fetchState();
    const t = setInterval(fetchState, 5000);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll thought log
  useEffect(() => {
    if (thoughtRef.current)
      thoughtRef.current.scrollTop = thoughtRef.current.scrollHeight;
  }, [thoughts]);

  const handleExecute = async () => {
    setIsExecuting(true);
    setThoughts([]);

    // stream thoughts one by one
    for (let i = 0; i < THOUGHT_TRACES.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setThoughts((prev) => [...prev, THOUGHT_TRACES[i]]);
    }

    try {
      await fetch("http://localhost:7860/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pay_hike: 3, reskill_budget: 5, automation_investment: 15,
          bidding_strategy: "balanced", cost_cut_admin: 0,
          audit_action: { leak_id: "LEAK-842", key: "EMP-7821" }
        }),
      });
    } catch (_) {}

    setTimeout(() => setIsExecuting(false), 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_BODY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endpoints = [
    { path: "POST /step", method: "POST", color: "#818cf8", desc: "Execute one transition in the enterprise environment. The agent reads HR, Finance & Ops state and returns an optimized action.", active: true },
    { path: "GET /state", method: "GET", color: "#38bdf8", desc: "Fetch the complete multi-app synchronization state including financials, schema drift log, and SME feedback.", active: false },
    { path: "POST /agent/step", method: "POST", color: "#c084fc", desc: "Autonomous loop — the fine-tuned Llama-3 agent reads state and executes without human input.", active: false },
    { path: "POST /login", method: "POST", color: "#34d399", desc: "Authenticate with JWT and receive a role-scoped token (Auditor, Manager, Viewer).", active: false },
  ];

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-600 mb-4">
            Frame 3 · OpenAPI Execution Terminal
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter gradient-text mb-4">
            Environment Command Console
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Zero-shot tool orchestration powered by{" "}
            <span className="text-zinc-300 font-semibold">Meta Llama-3</span>. Watch the
            agent reason in real time.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <Cpu size={12} />
              <span>MetaAuditor-Enterprise v3.0</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold font-mono border transition-all
              ${backendState ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"}`}>
              {backendState ? <Wifi size={11} /> : <WifiOff size={11} />}
              {backendState ? "LIVE · SYNCHRONIZED" : "SANDBOX MODE"}
            </div>
          </div>

          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#080a0b" }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[11px] font-mono text-zinc-500 ml-3">
                openapi_v3.0 — {backendState ? "127.0.0.1:7860" : "local_sandbox"}
              </span>
            </div>

            {/* Two-col layout: endpoints + live thought log */}
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Endpoints list */}
              <div className="lg:col-span-3 p-5 space-y-2 border-r border-white/5">
                {endpoints.map((ep) => (
                  <div key={ep.path} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                    <button
                      onClick={() => setExpanded(expanded === ep.path ? null : ep.path)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-black"
                          style={{ color: ep.color, background: `${ep.color}18` }}
                        >
                          {ep.method}
                        </span>
                        <span className="font-mono text-sm font-semibold text-zinc-200">{ep.path}</span>
                      </div>
                      <ChevronDown
                        size={15}
                        className="text-zinc-600 transition-transform"
                        style={{ transform: expanded === ep.path ? "rotate(180deg)" : "rotate(0)" }}
                      />
                    </button>

                    <AnimatePresence>
                      {expanded === ep.path && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                          style={{ background: "#050607" }}
                        >
                          <div className="p-5 space-y-4">
                            <p className="text-zinc-500 text-sm">{ep.desc}</p>

                            {ep.active && (
                              <>
                                {/* Request body preview */}
                                <div className="relative">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Request Body</span>
                                    <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors">
                                      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                                      {copied ? "Copied" : "Copy"}
                                    </button>
                                  </div>
                                  <pre className="text-[11px] font-mono text-zinc-400 p-3 rounded-lg overflow-x-auto" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    {SAMPLE_BODY}
                                  </pre>
                                </div>

                                {/* Execute button */}
                                <motion.button
                                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px 5px rgba(129,140,248,0.3)" }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={handleExecute}
                                  disabled={isExecuting}
                                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                                >
                                  {isExecuting
                                    ? <><Zap size={14} className="animate-bounce" />Executing…</>
                                    : <><Play size={14} fill="white" />Execute Step</>}
                                </motion.button>
                              </>
                            )}

                            {!ep.active && (
                              <div className="flex items-center gap-2 text-[11px] text-zinc-600 font-mono">
                                <Code2 size={12} />
                                <span>Expand the POST /step endpoint to execute a live step</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Live Agent Thought Log */}
              <div className="lg:col-span-2 p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={14} style={{ color: "#c084fc" }} />
                  <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-500">
                    Agent Reasoning Trace
                  </span>
                  {isExecuting && (
                    <span className="ml-auto flex items-center gap-1 text-[10px] font-mono text-purple-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>

                <div
                  ref={thoughtRef}
                  className="flex-1 overflow-y-auto space-y-2 min-h-[300px] max-h-[380px]"
                  style={{ scrollBehavior: "smooth" }}
                >
                  {thoughts.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-700 text-xs font-mono text-center gap-3">
                      <Brain size={28} className="opacity-20" />
                      Hit &quot;Execute Step&quot; to watch <br /> the Llama-3 agent think live
                    </div>
                  )}
                  <AnimatePresence>
                    {thoughts.map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg text-[11px] font-mono text-zinc-400 leading-relaxed"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.04)",
                          borderLeft: `2px solid ${i === thoughts.length - 1 ? "#c084fc" : "#ffffff10"}`,
                        }}
                      >
                        <span className="text-zinc-600 mr-2">{String(i + 1).padStart(2, "0")}.</span>
                        {t}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Step counter */}
                {backendState && (
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                    {[
                      { label: "OPM", value: `${backendState.financials?.op_margin ?? "—"}%`, color: "#818cf8" },
                      { label: "Quarter", value: `Q${backendState.quarter ?? 1}`, color: "#c084fc" },
                    ].map((stat) => (
                      <div key={stat.label} className="p-3 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{stat.label}</div>
                        <div className="font-mono font-black text-lg mt-1" style={{ color: stat.color }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
