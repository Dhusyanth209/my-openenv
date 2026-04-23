"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid,
} from "recharts";
import { Activity, Layers, TrendingUp, Shield, DollarSign, AlertTriangle } from "lucide-react";

const SEED_DATA = Array.from({ length: 8 }, (_, i) => ({
  step: i,
  reward: 10 + i * 0.8 + Math.random() * 2,
}));

const MOCK_DRIFT_LOGS = [
  { type: "SCHEMA_UPDATE", msg: "Field rename: revenue → financial_yield (Q2)", color: "#38bdf8" },
  { type: "MARKET_SHOCK", msg: "Competitor poaching event triggered (+12% attrition risk)", color: "#f43f5e" },
  { type: "SCHEMA_UPDATE", msg: "New field introduced: quarterly_efficiency_ratio", color: "#38bdf8" },
  { type: "SME_HINT", msg: "Prioritize headcount reconciliation over automation this quarter", color: "#c084fc" },
  { type: "MARKET_SHOCK", msg: "Global IT spending contraction detected (−8% revenue baseline)", color: "#f43f5e" },
];

const STAT_TIMELINE = [
  { label: "Q1 Baseline", note: "Environment initialized", status: "done" },
  { label: "Q2 Schema Drift", note: "Agent adapted world model", status: "done" },
  { label: "Q3 Market Shock", note: "Recursive skill amplification", status: "active" },
  { label: "Q4 Projection", note: "Awaiting agent inference…", status: "pending" },
];

export function MetricsGrid() {
  const [chartData, setChartData] = useState(SEED_DATA);
  const [driftLogs, setDriftLogs] = useState(MOCK_DRIFT_LOGS);
  const [backendState, setBackendState] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [visibleStats, setVisibleStats] = useState({ margin: 14.2, recovery: 3.8, steps: 24 });
  const driftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/state");
        if (res.ok) {
          const { state } = await res.json();
          setBackendState(state);
          setChartData((prev) => {
            const last = prev[prev.length - 1].step;
            return [...prev, { step: last + 1, reward: state.financials?.op_margin ?? 14 }].slice(-20);
          });
          if (state.financials) {
            setVisibleStats({
              margin: state.financials.op_margin ?? 14.2,
              recovery: state.financials.recovery ?? 3.8,
              steps: (state.quarter ?? 1) * 3,
            });
          }
          if (state.adversity_log?.length) {
            setDriftLogs(
              state.adversity_log.map((msg: string) => ({
                type: msg.includes("Schema") ? "SCHEMA_UPDATE" : "MARKET_SHOCK",
                msg,
                color: msg.includes("Schema") ? "#38bdf8" : "#f43f5e",
              }))
            );
          }
        }
      } catch (_) {}
    };
    const t = setInterval(fetchMetrics, 3000);
    fetchMetrics();
    return () => clearInterval(t);
  }, []);

  // Auto-scroll drift log
  useEffect(() => {
    if (driftRef.current) driftRef.current.scrollTop = driftRef.current.scrollHeight;
  }, [driftLogs]);

  if (!isClient) return <div className="h-screen bg-black" />;

  const currentReward = chartData[chartData.length - 1]?.reward ?? 0;
  const firstReward = chartData[0]?.reward ?? 0;
  const rewardDelta = ((currentReward - firstReward) / firstReward * 100).toFixed(1);

  return (
    <section className="py-28 border-t border-white/5 relative">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-600 mb-4">
            Intelligence Stream 04 // Dynamic Assessment
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter gradient-text mb-4">
            Forensic Impact Analysis
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Real-time projection of recovered capital and margin stabilization. 
            Auditing towards the $25M Enterprise Recovery Target.
          </p>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-5xl mx-auto">
          {[
            { icon: TrendingUp, label: "Operating Margin", value: `${visibleStats.margin.toFixed(1)}%`, color: "#818cf8", change: `+${rewardDelta}%` },
            { icon: DollarSign, label: "Audit Recovery", value: `₹${visibleStats.recovery.toFixed(1)}M`, color: "#fbbf24", change: "Verified Leakage" },
            { icon: Activity, label: "Agent Steps", value: visibleStats.steps, color: "#c084fc", change: "Non-Stop" },
            { icon: Shield, label: "RBAC Status", value: "AUTHORIZED", color: "#38bdf8", change: "Token: Auditor" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl glass group relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="flex items-center gap-2 mb-3">
                <kpi.icon size={14} style={{ color: kpi.color }} />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{kpi.label}</span>
              </div>
              <div className="font-black text-2xl tracking-tight" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className="text-[10px] text-zinc-600 font-mono mt-1">{kpi.change}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Target Horizon Overlay ── */}
        <div className="max-w-5xl mx-auto mb-10 p-1 rounded-full bg-slate-900 border border-white/5 relative overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (visibleStats.recovery / 25) * 100)}%` }}
            className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 relative"
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-between px-6 text-[9px] font-bold tracking-widest text-white/40 uppercase">
             <span>Recovery Progress</span>
             <span>Goal: ₹25M Target</span>
          </div>
        </div>

        {/* Main 3-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">

          {/* ── Reward Curve ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-7 rounded-2xl glass flex flex-col"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Activity size={16} style={{ color: "#818cf8" }} />
                  <h3 className="font-bold text-sm">Recursive Improvement</h3>
                </div>
                <p className="text-[11px] text-zinc-600 mt-1 font-mono">Reward ↑ {rewardDelta}% over session</p>
              </div>
              <div className="px-2 py-1 rounded-full text-[9px] font-bold font-mono"
                style={{ background: "#818cf820", color: "#818cf8", border: "1px solid #818cf830" }}>
                LIVE
              </div>
            </div>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="99%" height="100%" debounce={50}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="rewardGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="step" hide />
                  <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c0c0f", border: "1px solid #ffffff10", borderRadius: "10px", fontSize: "11px" }}
                    itemStyle={{ color: "#818cf8" }}
                    labelStyle={{ color: "#52525b" }}
                  />
                  <Area type="monotone" dataKey="reward" stroke="#818cf8" strokeWidth={2.5}
                    fill="url(#rewardGrad)" dot={false} isAnimationActive />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-zinc-600 mt-3 font-mono uppercase tracking-widest">
              {backendState ? "MODE: LIVE_REWARD_SCALE" : "MODE: SEEDED_BASELINE"}
            </p>
          </motion.div>

          {/* ── Schema Drift Monitor ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-7 rounded-2xl glass flex flex-col"
          >
            <div className="flex items-center gap-2 mb-5">
              <Layers size={16} style={{ color: "#38bdf8" }} />
              <div>
                <h3 className="font-bold text-sm">Schema Drift Monitor</h3>
                <p className="text-[11px] text-zinc-600 mt-0.5 font-mono">{driftLogs.length} events detected</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              {/* Highlight Card for Innovation Visual */}
              <div className="mb-4 p-4 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent relative overflow-hidden shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="animate-spin text-blue-400" style={{ animationDuration: "3s" }}>🔄</span>
                  <h4 className="text-xs font-bold font-mono tracking-widest text-blue-400">SCHEMA DRIFT EVENT</h4>
                </div>
                <div className="grid grid-cols-1 gap-2 text-[11px] font-mono mb-3">
                  <div className="flex items-center justify-between p-2 bg-black/40 rounded border border-white/5">
                    <span className="text-zinc-500">OLD FIELD:</span>
                    <span className="text-zinc-300">hr.status</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-black/40 rounded border border-blue-500/20">
                    <span className="text-zinc-500">NEW FIELD:</span>
                    <span className="text-blue-400 font-bold">employment_lifecycle_state</span>
                  </div>
                </div>
                <div className="space-y-1 text-[10px] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1 text-green-400">
                    <span className="text-green-500">✅</span> Auto-mapped successfully
                  </div>
                  <div className="flex items-center gap-1 text-purple-400">
                    <span className="text-purple-500">🧠</span> No system failure
                  </div>
                </div>
              </div>

              {/* Scrollable Logs */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1" ref={driftRef}>
                {driftLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 rounded-lg"
                    style={{
                      background: `${log.color}08`,
                      border: `1px solid ${log.color}20`,
                      borderLeft: `2px solid ${log.color}`,
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle size={9} style={{ color: log.color }} />
                      <span className="text-[9px] font-mono font-bold" style={{ color: log.color }}>
                        [{log.type}]
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono leading-relaxed">{log.msg}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Long-Horizon Timeline ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-7 rounded-2xl glass"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={16} style={{ color: "#c084fc" }} />
              <div>
                <h3 className="font-bold text-sm">Long-Horizon Execution</h3>
                <p className="text-[11px] text-zinc-600 mt-0.5 font-mono">Multi-quarter planning view</p>
              </div>
            </div>

            <div className="relative pl-7 space-y-6">
              {/* Vertical line */}
              <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent" />

              {STAT_TIMELINE.map((item, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div
                    className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 flex items-center justify-center
                      ${item.status === "done" ? "bg-purple-500 border-purple-500" : ""}
                      ${item.status === "active" ? "bg-purple-400 border-purple-400 animate-pulse" : ""}
                      ${item.status === "pending" ? "bg-transparent border-zinc-700" : ""}`}
                  />

                  <div>
                    <div className={`text-xs font-bold ${item.status === "active" ? "text-purple-300" : item.status === "done" ? "text-zinc-300" : "text-zinc-600"}`}>
                      {item.label}
                    </div>
                    <div className={`text-[11px] font-mono mt-0.5 ${item.status === "pending" ? "text-zinc-700" : "text-zinc-500"}`}>
                      {item.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {backendState && (
              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest mb-2">Live Backend State</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div><span className="text-zinc-600">Expert:</span> <span className="text-zinc-400">{backendState.expert_feedback?.slice(0, 20)}…</span></div>
                  <div><span className="text-zinc-600">Drift:</span> <span className="text-zinc-400">{backendState.schema_drift ? "ACTIVE" : "STABLE"}</span></div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
