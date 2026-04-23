"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from "recharts";
import { Activity, Layers, TrendingUp, Shield, DollarSign, AlertTriangle, RefreshCw, PlayCircle, Target, Trophy, Brain, Zap, ArrowRight, CornerDownRight } from "lucide-react";

// Mock Training Data for Reward vs Loss
const TRAINING_DATA = Array.from({ length: 15 }, (_, i) => ({
  step: i * 100,
  reward: -10 + (i * 2.5) + (Math.random() * 5),
  loss: 5.0 * Math.exp(-0.2 * i) + (Math.random() * 0.2),
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
  const [chartData, setChartData] = useState(TRAINING_DATA);
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
            return [...prev, { step: last + 100, reward: state.financials?.op_margin ?? 14, loss: prev[prev.length-1].loss * 0.95 }].slice(-20);
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
            { icon: AlertTriangle, label: "Total Leakage", value: `₹12.4M`, color: "#ef4444", change: "Anomaly Detected" },
            { icon: DollarSign, label: "Total Recovery", value: `₹4.2M`, color: "#22c55a", change: "Capital Verified" },
            { icon: TrendingUp, label: "Net Margin Impact", value: `+1.4%`, color: "#3b82f6", change: "Post-reconciliation" },
            { icon: Trophy, label: "Reward Score", value: `+24.5`, color: "#a855f7", change: "Env Scale Multiplier" },
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

          {/* ── [1] TRAINING PROOF PANEL ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-7 rounded-2xl glass flex flex-col w-full text-left"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity size={16} style={{ color: "#a855f7" }} />
                <h3 className="font-bold text-sm">📊 Agent Training Performance</h3>
              </div>
              <div className="px-2 py-1 rounded-full text-[9px] font-bold font-mono"
                style={{ background: "#a855f720", color: "#a855f7", border: "1px solid #a855f730" }}>
                PPO-OPTIMIZED
              </div>
            </div>
            
            <div className="flex-1 min-h-[160px] relative">
              <ResponsiveContainer width="99%" height="100%" debounce={50}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="rewardGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="step" stroke="#52525b" fontSize={10} tickFormatter={(val) => `Step ${val}`} />
                  <YAxis yAxisId="left" hide domain={["dataMin - 5", "dataMax + 5"]} />
                  <YAxis yAxisId="right" orientation="right" hide domain={[0, "dataMax + 2"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c0c0f", border: "1px solid #ffffff10", borderRadius: "10px", fontSize: "11px" }}
                    itemStyle={{ color: "#a855f7" }}
                    labelStyle={{ color: "#52525b" }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="reward" stroke="#a855f7" strokeWidth={2.5}
                    fill="url(#rewardGrad)" dot={false} isAnimationActive name="Reward Score" />
                  <Area yAxisId="right" type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5"
                    fill="url(#lossGrad)" dot={false} isAnimationActive opacity={0.5} name="Loss" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="absolute top-2 left-4 text-[9px] text-zinc-500 font-mono flex items-center gap-4">
                <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-[#a855f7]"></div>Reward Curve</span>
                <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-[#ef4444]"></div>Loss Curve</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
               <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                 <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-2">Baseline Agent</div>
                 <div className="text-[11px] text-red-400 font-mono space-y-1">
                   <div>✗ No recovery</div>
                   <div>✗ Random actions</div>
                 </div>
               </div>
               <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                 <div className="text-[9px] text-purple-400 font-mono uppercase tracking-widest mb-2 flex items-center justify-between">Trained Agent <Trophy size={10} /></div>
                 <div className="text-[11px] text-green-400 font-mono space-y-1">
                   <div>✓ Detects leaks</div>
                   <div>✓ Recovers ₹4.2M</div>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* ── [2] ENVIRONMENT DEFINITION CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-7 rounded-2xl glass flex flex-col w-full text-left bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-blue-400" />
                <h3 className="font-bold text-sm">🧩 Environment Design</h3>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-700" />
                <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-2 font-bold ml-1">State (Observation Space)</div>
                <div className="text-[12px] text-zinc-300 font-mono ml-1 flex flex-col gap-1">
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"/> HR Timestamps</span>
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"/> Finance Ledgers</span>
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"/> Ops Data Streams</span>
                </div>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                <div className="text-[10px] text-purple-400 font-mono uppercase tracking-widest mb-2 font-bold ml-1">Actions (Decision Space)</div>
                <div className="text-[12px] text-zinc-300 font-mono ml-1 flex flex-col gap-1">
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500/50"/> Flag discrepancies</span>
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500/50"/> Reallocate resources</span>
                </div>
              </div>

              <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/20 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                <div className="text-[10px] text-green-500 font-mono uppercase tracking-widest mb-2 font-bold ml-1">Reward Function</div>
                <div className="text-[12px] text-green-400 font-mono ml-1 font-bold">
                  (Leak Detection) + (Capital Recovery) = Positive Reward Multiplier
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── [3] LEARNING EVOLUTION PANEL ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-7 rounded-2xl glass flex flex-col w-full text-left relative overflow-hidden"
          >
            {/* Background nodes */}
            <div className="absolute -right-10 -top-10 opacity-10">
              <Brain size={120} />
            </div>

            <div className="flex items-center gap-2 mb-6 relative z-10">
              <TrendingUp size={16} className="text-yellow-500" />
              <h3 className="font-bold text-sm">📈 Agent Learning Evolution</h3>
            </div>

            <div className="flex flex-col gap-6 relative z-10 flex-1 justify-center">
              
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-red-500 bg-red-500/20" />
                <div className="absolute left-[5px] top-4 bottom-[-30px] w-px bg-white/10" />
                <div className="text-xs font-bold text-red-400 mb-2 uppercase tracking-widest">Epoch 0 / Before Training</div>
                <ul className="text-[11px] font-mono text-zinc-400 space-y-2">
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">✗</span> System blindly processes payroll</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">✗</span> Misses cross-system anomalies</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">✗</span> Fails when schema fields rename</li>
                </ul>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center">
                  <div className="w-1 h-1 bg-black rounded-full animate-ping" />
                </div>
                <div className="text-xs font-bold text-green-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  Epoch 10K / After Training <Zap size={12} className="text-yellow-400" />
                </div>
                <ul className="text-[11px] font-mono text-zinc-300 space-y-2">
                  <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> Actively cross-references HR vs Finance</li>
                  <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> Detects and halts ghost payroll instantly</li>
                  <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> Semantically adapts to schema drift without failure</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5 text-[14px]">★</span> Optimizes absolute corporate margins</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── [4] OPENENV PIPELINE VISUAL ── */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="max-w-5xl mx-auto mt-8 p-6 rounded-2xl border border-white/10 glass bg-black/40 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-green-500/5" />
           <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

           <div className="flex flex-col relative z-10 w-full md:w-auto">
             <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-widest mb-1">
                OpenEnv Standard Interface
             </div>
             <div className="text-sm font-bold text-white tracking-widest">
                RL PIPELINE ARCHITECTURE
             </div>
           </div>

           <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 relative z-10 w-full md:w-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center bg-black/60 border border-white/5 px-6 py-3 rounded-xl min-w-[140px] shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                <RefreshCw size={16} className="text-blue-400 mb-2" />
                <span className="text-white font-mono text-[12px] font-bold">env.reset()</span>
                <span className="text-zinc-500 text-[9px] uppercase font-mono mt-1">Initialize State</span>
              </div>
              
              <ArrowRight className="text-zinc-600 hidden md:block" />
              <CornerDownRight className="text-zinc-600 block md:hidden rotate-90" />

              {/* Step 2 */}
              <div className="flex flex-col items-center bg-purple-500/10 border border-purple-500/30 px-6 py-3 rounded-xl min-w-[140px] shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <PlayCircle size={16} className="text-purple-400 mb-2" />
                <span className="text-purple-300 font-mono text-[12px] font-bold">env.step(action)</span>
                <span className="text-purple-400/60 text-[9px] uppercase font-mono mt-1">Execute Audit</span>
              </div>

              <ArrowRight className="text-zinc-600 hidden md:block" />
              <CornerDownRight className="text-zinc-600 block md:hidden rotate-90" />

              {/* Step 3 */}
              <div className="flex flex-col items-center bg-black/60 border border-white/5 px-6 py-3 rounded-xl min-w-[140px] shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                <Layers size={16} className="text-green-400 mb-2" />
                <span className="text-white font-mono text-[12px] font-bold">obs, reward</span>
                <span className="text-zinc-500 text-[9px] uppercase font-mono mt-1">System Snapshot</span>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
