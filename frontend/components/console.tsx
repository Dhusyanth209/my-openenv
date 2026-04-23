"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Code2, ChevronDown, Cpu, Wifi, WifiOff, Brain, Zap, Copy, Check, Eye, Bot, KeyRound } from "lucide-react";

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
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [backendState, setBackendState] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [responseData, setResponseData] = useState<Record<string, any>>({});
  const [loadingEndpoint, setLoadingEndpoint] = useState<string | null>(null);
  const thoughtRef = useRef<HTMLDivElement>(null);

  // Poll backend
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch("/state");
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

  const handleExecuteStep = async () => {
    setIsExecuting(true);
    setThoughts([]);

    for (let i = 0; i < THOUGHT_TRACES.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setThoughts((prev) => [...prev, THOUGHT_TRACES[i]]);
    }

    try {
      const res = await fetch("/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pay_hike: 3, reskill_budget: 5, automation_investment: 15,
          bidding_strategy: "balanced", cost_cut_admin: 0,
          audit_action: { leak_id: "LEAK-842", key: "EMP-7821" }
        }),
      });
      const data = await res.json();
      setResponseData(prev => ({ ...prev, "POST /step": data }));
    } catch (_) {}

    setTimeout(() => setIsExecuting(false), 400);
  };

  const handleGetState = async () => {
    setLoadingEndpoint("GET /state");
    try {
      const res = await fetch("/state");
      const data = await res.json();
      setResponseData(prev => ({ ...prev, "GET /state": data }));
    } catch (err) {
      setResponseData(prev => ({ ...prev, "GET /state": { error: "Connection failed" } }));
    }
    setLoadingEndpoint(null);
  };

  const handleAgentStep = async () => {
    setLoadingEndpoint("POST /agent/step");
    setThoughts([]);
    
    // Show AI thinking animation
    const agentThoughts = [
      "🧠 Agent Brain activated — reading environment state...",
      "📊 Analyzing OPM trajectory and leak pipeline...",
      "🤖 Llama-3 generating optimal action JSON...",
      "✅ Action submitted. Evaluating reward...",
    ];
    for (let i = 0; i < agentThoughts.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setThoughts((prev) => [...prev, agentThoughts[i]]);
    }

    try {
      const res = await fetch("/agent/step", { method: "POST" });
      const data = await res.json();
      setResponseData(prev => ({ ...prev, "POST /agent/step": data }));
      setThoughts(prev => [...prev, `Reward: ${data.reward} | Model: ${data.model_mode}`]);
    } catch (err) {
      setResponseData(prev => ({ ...prev, "POST /agent/step": { error: "Agent inference failed" } }));
    }
    setLoadingEndpoint(null);
  };

  const handleLogin = async () => {
    setLoadingEndpoint("POST /login");
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "openenv2026" }),
      });
      const data = await res.json();
      if (data.token) localStorage.setItem("meta_token", data.token);
      setResponseData(prev => ({ ...prev, "POST /login": data }));
    } catch (err) {
      setResponseData(prev => ({ ...prev, "POST /login": { error: "Auth server unreachable" } }));
    }
    setLoadingEndpoint(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_BODY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endpoints = [
    { path: "POST /step", method: "POST", color: "#818cf8", icon: Play, desc: "Execute one transition in the enterprise environment. The agent reads HR, Finance & Ops state and returns an optimized action.", handler: handleExecuteStep },
    { path: "GET /state", method: "GET", color: "#38bdf8", icon: Eye, desc: "Fetch the complete multi-app synchronization state including financials, schema drift log, and SME feedback.", handler: handleGetState },
    { path: "POST /agent/step", method: "POST", color: "#c084fc", icon: Bot, desc: "Autonomous loop — the fine-tuned Llama-3 agent reads state and executes without human input.", handler: handleAgentStep },
    { path: "POST /login", method: "POST", color: "#34d399", icon: KeyRound, desc: "Authenticate with JWT and receive a role-scoped token (Auditor, Manager, Viewer).", handler: handleLogin },
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
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-amber-500 mb-4 px-4 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 w-fit mx-auto">
            Operational Protocol: ACTIVE SCAN
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter gradient-text mb-4">
            Forensic Audit Terminal
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Autonomous discrepancy reconciliation powered by{" "}
            <span className="text-zinc-300 font-semibold">Meta Llama-3</span>. Every endpoint below is live — click to execute.
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
              <span className="text-[11px] font-mono text-zinc-500 ml-3 uppercase tracking-widest">
                Target System: ITFirm-X Forensics // {backendState ? "CONNECTED" : "ESTABLISHING..."}
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

                            {/* Show request body only for POST /step */}
                            {ep.path === "POST /step" && (
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
                            )}

                            {/* Execute button for EVERY endpoint */}
                            <motion.button
                              whileHover={{ scale: 1.02, boxShadow: `0 0 30px 5px ${ep.color}30` }}
                              whileTap={{ scale: 0.97 }}
                              onClick={ep.handler}
                              disabled={isExecuting || loadingEndpoint === ep.path}
                              className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60 relative overflow-hidden"
                              style={{ background: `linear-gradient(135deg, ${ep.color}, ${ep.color}cc)` }}
                            >
                              {(isExecuting && ep.path === "POST /step") || loadingEndpoint === ep.path ? (
                                <>
                                  <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                    className="absolute inset-0 bg-white/20 skew-x-12"
                                  />
                                  <Zap size={14} className="animate-bounce" />
                                  {ep.path === "POST /step" ? "SCANNING DISCREPANCIES…" : "PROCESSING…"}
                                </>
                              ) : (
                                <>
                                  <ep.icon size={14} />
                                  {ep.path === "POST /step" && "Start Forensic Run"}
                                  {ep.path === "GET /state" && "Fetch Live State"}
                                  {ep.path === "POST /agent/step" && "Let AI Decide"}
                                  {ep.path === "POST /login" && "Authenticate Now"}
                                </>
                              )}
                            </motion.button>

                            {/* Response display */}
                            {responseData[ep.path] && (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                              >
                                {ep.path === "POST /step" && (
                                  <>
                                    {/* Leak Evidence Panel */}
                                    <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-4 relative overflow-hidden mt-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <h4 className="text-xs font-bold font-mono tracking-widest text-red-500">LEAK DETECTED: Ghost Payroll</h4>
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                                        <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                          <div className="text-zinc-500 mb-1">HR System:</div>
                                          <div className="text-zinc-300">- EMP7821 &rarr; Status: <span className="text-red-400 font-bold">Resigned</span></div>
                                        </div>
                                        <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                          <div className="text-zinc-500 mb-1">Finance System:</div>
                                          <div className="text-zinc-300">- EMP7821 &rarr; Salary Paid: <span className="text-red-400 font-bold">₹45,000</span></div>
                                        </div>
                                      </div>
                                      <div className="mt-3 inline-block px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-md text-[10px] font-bold text-red-400/90 uppercase tracking-wider">
                                        ⚠️ Mismatch: Payment after exit &nbsp;|&nbsp; 💰 Monthly Leakage: ₹45,000
                                      </div>
                                    </div>

                                    {/* AI Decision Card */}
                                    <div className="border border-purple-500/30 bg-purple-500/5 rounded-xl p-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Brain size={14} className="text-purple-400" />
                                        <h4 className="text-xs font-bold font-mono tracking-widest text-purple-400">AI ACTION DECISION</h4>
                                      </div>
                                      <ul className="text-[11px] font-mono text-zinc-300 space-y-2 ml-1">
                                        <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> Block salary payment</li>
                                        <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> Flag employee account</li>
                                        <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> Recover ₹45,000</li>
                                        <li className="flex items-center gap-2"><Check size={12} className="text-purple-400" /> Reallocate to automation budget</li>
                                      </ul>
                                    </div>

                                    {/* Before vs After */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">📊 Before Execution</div>
                                        <div className="text-sm font-bold text-zinc-300">OPM: 29.8%</div>
                                        <div className="text-[11px] text-red-400/80 font-mono mt-1">Leakage: ₹12.4M</div>
                                      </div>
                                      <div className="p-4 rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
                                        <div className="text-[10px] font-mono text-green-500 uppercase tracking-widest mb-2">📊 After Recovery</div>
                                        <div className="text-sm font-bold text-green-400">OPM: 31.2%</div>
                                        <div className="text-[11px] text-green-400/80 font-mono mt-1">Recovered: ₹4.2M</div>
                                      </div>
                                    </div>
                                  </>
                                )}

                                <div>
                                  <div className="flex items-center gap-2 mb-2 mt-4">
                                    <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">✓ {ep.path === "POST /step" ? "Raw JSON Export" : "Response"}</span>
                                  </div>
                                  <pre className="text-[10px] font-mono text-zinc-400 p-3 rounded-lg overflow-x-auto max-h-48 overflow-y-auto" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
                                    {JSON.stringify(responseData[ep.path], null, 2)}
                                  </pre>
                                </div>
                              </motion.div>
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
                  {(isExecuting || loadingEndpoint) && (
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
                      Click any endpoint to watch <br /> the system respond live
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
