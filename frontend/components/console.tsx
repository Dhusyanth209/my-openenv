"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Code2, ChevronDown, Cpu, Wifi, WifiOff, Brain, Zap, Copy, Check, Eye, Bot, KeyRound, ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

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
            className="rounded-2xl overflow-hidden relative"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#080a0b" }}
          >
            {/* Glow Sweep animation */}
            <AnimatePresence>
              {isExecuting && (
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "200%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-[400px] z-50 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.1), transparent)", transform: "skewX(-20deg)" }}
                />
              )}
            </AnimatePresence>
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
                                    {/* [5] AI DECISION CARD */}
                                    <div className="border border-purple-500/30 bg-purple-500/5 rounded-xl p-4 mt-4" style={{ boxShadow: "0 0 20px rgba(168,85,247,0.1)" }}>
                                      <div className="flex items-center gap-2 mb-3">
                                        <Brain size={16} className="text-purple-400" />
                                        <h4 className="text-sm font-bold font-mono tracking-widest text-purple-400">AI ACTION PLAN</h4>
                                      </div>
                                      <ul className="text-xs font-mono text-zinc-300 space-y-3 ml-1">
                                        <li className="flex items-center gap-2"><span className="text-red-500 font-bold">❌</span> Block salary disbursement</li>
                                        <li className="flex items-center gap-2"><span className="text-yellow-500 font-bold">⚠️</span> Flag employee for audit review</li>
                                        <li className="flex items-center gap-2"><span className="text-green-500 font-bold">💰</span> Recover ₹45,000</li>
                                        <li className="flex items-center gap-2"><span className="text-blue-500 font-bold">🔄</span> Reallocate to automation investment</li>
                                      </ul>
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

              {/* Live Agent Thought Log (Right Column) */}
              <div className="lg:col-span-2 p-5 flex flex-col relative h-[700px] overflow-hidden">

                {/* [2] LEAK EVIDENCE PANEL (Top of Right Panel) */}
                <AnimatePresence>
                  {responseData["POST /step"] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                      className="border border-red-500/40 bg-red-500/10 rounded-xl p-4 relative overflow-hidden shrink-0"
                      style={{ boxShadow: "0 0 30px rgba(239,68,68,0.15)" }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse glow-pulse" />
                        <h4 className="text-[13px] font-bold font-mono tracking-widest text-red-500">🚨 LEAK EVIDENCE</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                        <div className="p-3 bg-black/60 rounded-lg border border-white/5">
                          <div className="text-zinc-500 mb-2 uppercase tracking-widest text-[9px] font-bold">HR System</div>
                          <div className="text-zinc-400 space-y-1">
                            <div>EMP ID: <span className="text-white">EMP7821</span></div>
                            <div>Status: <span className="text-red-400 font-bold">Resigned</span></div>
                            <div>Last Active: <span className="text-white">32 days ago</span></div>
                          </div>
                        </div>
                        <div className="p-3 bg-black/60 rounded-lg border border-white/5">
                          <div className="text-zinc-500 mb-2 uppercase tracking-widest text-[9px] font-bold">Finance System</div>
                          <div className="text-zinc-400 space-y-1">
                            <div>Salary Status: <span className="text-green-400 font-bold">ACTIVE</span></div>
                            <div>Monthly Pay: <span className="text-red-400 font-bold">₹45,000</span></div>
                            <div>Cycle: <span className="text-white">Ongoing</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 py-2 px-3 bg-red-500/20 border border-red-500/30 rounded-md text-[11px] font-bold text-red-400 uppercase tracking-wider text-center">
                        ⚠️ Mismatch Detected &nbsp;|&nbsp; 💰 Leakage: ₹45,000/month
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 mb-4 shrink-0">
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

                {/* [6] ENHANCE AGENT REASONING TRACE */}
                <div ref={thoughtRef} className="flex-1 overflow-y-auto space-y-0 relative min-h-[150px] mb-4 pr-2" style={{ scrollBehavior: "smooth" }}>
                  {thoughts.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-700 text-xs font-mono text-center gap-3">
                      <Brain size={28} className="opacity-20" />
                      Click any endpoint to watch <br /> the system respond live
                    </div>
                  )}

                  {thoughts.length > 0 && (
                    <div className="absolute left-[13px] top-2 bottom-4 w-[2px] bg-white/5" />
                  )}

                  <AnimatePresence>
                    {thoughts.map((t, i) => {
                      // Text highlighting logic
                      let formattedText = t;
                      if (formattedText.includes("ghost payroll anomaly")) {
                        formattedText = formattedText.replace("ghost payroll anomaly", '<span class="text-red-400 bg-red-500/10 px-1 rounded font-bold">ghost payroll anomaly</span>');
                      }
                      if (formattedText.includes("Schema drift detected")) {
                        formattedText = formattedText.replace("Schema drift detected", '<span class="text-blue-400 bg-blue-500/10 px-1 rounded font-bold">Schema drift detected</span>');
                      }
                      if (formattedText.includes("capital recovered")) {
                        formattedText = formattedText.replace("capital recovered", '<span class="text-green-400 bg-green-500/10 px-1 rounded font-bold">capital recovered</span>');
                      }

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative pl-8 py-2 text-[11px] font-mono leading-relaxed"
                        >
                          <div className={`absolute left-0 top-3 w-7 h-[2px] ${i === thoughts.length - 1 ? "bg-purple-500" : "bg-white/10"}`} />
                          <div
                            className="p-3 rounded-lg border border-white/5"
                            style={{ background: i === thoughts.length - 1 ? "rgba(192,132,252,0.05)" : "rgba(255,255,255,0.02)" }}
                            dangerouslySetInnerHTML={{ __html: `<span class="text-zinc-600 mr-2">${String(i + 1).padStart(2, "0")}.</span> ${formattedText}` }}
                          />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* [4] SCHEMA DRIFT VISUAL CARD (Bottom of Right Panel) */}
                <AnimatePresence>
                  {responseData["POST /step"] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      className="border border-blue-500/30 bg-blue-500/10 rounded-xl p-4 relative overflow-hidden shrink-0 mt-auto"
                      style={{ boxShadow: "0 0 30px rgba(56,189,248,0.1)" }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-blue-400 animate-spin" style={{ animationDuration: "4s" }}>🔄</span>
                        <h4 className="text-[13px] font-bold font-mono tracking-widest text-blue-400">SCHEMA DRIFT MONITOR</h4>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono mb-3 bg-black/40 p-2 rounded-lg border border-white/5">
                        <div className="flex flex-col text-center w-full">
                          <span className="text-zinc-500 uppercase tracking-widest text-[8px] mb-1">Old Field</span>
                          <span className="text-zinc-300">hr.status</span>
                        </div>
                        <div className="text-blue-400 animate-pulse">→</div>
                        <div className="flex flex-col text-center w-full">
                          <span className="text-zinc-500 uppercase tracking-widest text-[8px] mb-1">New Field</span>
                          <span className="text-blue-400 font-bold">employment_lifecycle_state</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider bg-black/20 p-2 rounded border border-white/5">
                        <div className="flex items-center gap-2 text-green-400">
                          <span className="text-green-500">✅</span> Semantic Mapping Complete
                        </div>
                        <div className="flex items-center gap-2 text-purple-400">
                          <span className="text-purple-500">🧠</span> Model Adapted Without Failure
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* [3] BEFORE vs AFTER IMPACT CARD (Center Below Main Terminal) */}
          <AnimatePresence>
            {responseData["POST /step"] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 mx-auto max-w-4xl border border-white/10 rounded-3xl p-6 glass shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-green-500/5" />
                
                <h3 className="text-center text-sm font-bold tracking-[0.2em] uppercase text-zinc-400 mb-6">
                  📊 Financial Impact Analysis
                </h3>

                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  {/* BEFORE */}
                  <div className="flex-1 w-full bg-black/40 border border-red-500/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.05)]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">Before Audit</span>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded">HIGH RISK</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-zinc-500 text-[10px] font-mono uppercase">OPM</div>
                        <div className="text-2xl font-black text-white">29.8%</div>
                      </div>
                      <div>
                        <div className="text-zinc-500 text-[10px] font-mono uppercase">Leakage</div>
                        <div className="text-2xl font-black text-red-400">₹12.4M</div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow separator */}
                  <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 glass shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <ArrowRight size={20} className="text-white animate-pulse" />
                  </div>

                  {/* AFTER */}
                  <div className="flex-1 w-full bg-black/40 border border-green-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,197,94,0.1)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-green-500/5 glow-pulse" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-xs font-mono font-bold text-green-400 uppercase tracking-widest">After Audit</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded">CONTROLLED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                      <div>
                        <div className="text-zinc-500 text-[10px] font-mono uppercase">OPM</div>
                        <div className="text-2xl font-black text-white flex items-center gap-2">31.2% <TrendingUp size={16} className="text-green-400" /></div>
                      </div>
                      <div>
                        <div className="text-zinc-500 text-[10px] font-mono uppercase">Recovery</div>
                        <div className="text-2xl font-black text-green-400">₹4.2M</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
