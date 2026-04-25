"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  DollarSign, 
  ClipboardList, 
  ShieldAlert, 
  Ban, 
  ArrowRight, 
  TrendingUp, 
  Activity, 
  Zap,
  Search,
  Brain,
  Layers,
  Database
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  CartesianGrid
} from "recharts";

// --- Section [5] GLOBAL KPI HEADER ---
export function KpiHeader() {
  const kpis = [
    { label: "Total Leakage Detected", value: "₹18.4M", color: "#f43f5e" },
    { label: "Total Recovered", value: "₹12.2M", color: "#34d399" },
    { label: "Margin Improvement", value: "+4.8%", color: "#818cf8" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-4 px-6 mb-8 glass rounded-2xl border border-white/10">
      {kpis.map((kpi, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">
            {kpi.label}
          </span>
          <span className="text-2xl font-black tracking-tighter" style={{ color: kpi.color }}>
            {kpi.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// --- Section [1] ENVIRONMENT PANEL ---
export function EnvironmentPanel() {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
          <Layers size={18} />
        </div>
        <h3 className="text-xl font-bold tracking-tight">🧩 Environment</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
            <Database size={12} /> State
          </h4>
          <ul className="space-y-3">
            {[
              { icon: Users, text: "HR Data", sub: "Employee & Payroll records" },
              { icon: DollarSign, text: "Finance Data", sub: "Invoices & Ledger" },
              { icon: ClipboardList, text: "Operations Logs", sub: "POD & Logistics" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-zinc-400">
                  <item.icon size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-200">{item.text}</span>
                  <span className="text-[10px] text-zinc-500">{item.sub}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
            <Zap size={12} /> Actions
          </h4>
          <ul className="space-y-3">
            {[
              { icon: Ban, text: "Block Payment", color: "#f43f5e" },
              { icon: ShieldAlert, text: "Flag Anomaly", color: "#fbbf24" },
              { icon: TrendingUp, text: "Reallocate Budget", color: "#38bdf8" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center" style={{ color: item.color }}>
                  <item.icon size={14} />
                </div>
                <span className="text-sm font-semibold text-zinc-200">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-4">System Flow</h4>
        <div className="flex items-center justify-between px-4 py-3 glass rounded-xl">
          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] font-bold text-zinc-600 uppercase">State</div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
          </div>
          <ArrowRight size={14} className="text-zinc-700" />
          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] font-bold text-zinc-600 uppercase">Action</div>
            <div className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <ArrowRight size={14} className="text-zinc-700" />
          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] font-bold text-zinc-600 uppercase">Reward</div>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Section [2] TRAINING PANEL ---
const MOCK_TRAINING_DATA = Array.from({ length: 12 }, (_, i) => ({
  iteration: i,
  reward: -20 + i * 4 + Math.random() * 5,
  loss: 40 / (i + 1) + Math.random() * 2,
}));

export function TrainingPanel() {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
          <Activity size={18} />
        </div>
        <h3 className="text-xl font-bold tracking-tight">📊 Training</h3>
      </div>

      <div className="flex-1 min-h-[180px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reward Curve</span>
          <span className="text-[10px] font-mono text-emerald-400">Final Reward: Positive</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_TRAINING_DATA}>
            <defs>
              <linearGradient id="colorReward" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis dataKey="iteration" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ background: '#000', border: '1px solid #ffffff10', fontSize: '10px' }}
              labelStyle={{ color: '#52525b' }}
            />
            <Area type="monotone" dataKey="reward" stroke="#818cf8" fillOpacity={1} fill="url(#colorReward)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] font-mono text-rose-400">Initial Reward: Negative</span>
          <span className="text-[9px] font-mono text-zinc-600">Iterations →</span>
        </div>
      </div>

      <div className="p-4 rounded-xl glass border border-white/5 bg-white/[0.01]">
        <p className="text-xs text-zinc-400 italic">
          &ldquo;Agent improves over training iterations, adapting its world model to corporate environments.&rdquo;
        </p>
      </div>
    </div>
  );
}

// --- Section [3] IMPROVEMENT PANEL ---
export function ImprovementPanel() {
  return (
    <div className="flex flex-col h-full space-y-6 items-center justify-center">
      <div className="w-full flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
          <TrendingUp size={18} />
        </div>
        <h3 className="text-xl font-bold tracking-tight">📈 Learning Improvement</h3>
      </div>

      <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Baseline Agent */}
        <div className="p-5 rounded-2xl glass border border-rose-500/10 bg-rose-500/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Search size={40} className="text-rose-500" />
          </div>
          <h4 className="text-sm font-black text-rose-400 mb-4 uppercase tracking-tighter">Baseline Agent</h4>
          <ul className="space-y-2">
            {[
              "Missed anomalies",
              "No recovery logic",
              "Negative reward",
            ].map((text, i) => (
              <li key={i} className="text-[11px] text-zinc-500 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-rose-500/40" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <ArrowRight size={24} className="text-zinc-700 animate-pulse" />

        {/* Trained Agent */}
        <div className="p-5 rounded-2xl glass border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Brain size={40} className="text-emerald-500" />
          </div>
          <h4 className="text-sm font-black text-emerald-400 mb-4 uppercase tracking-tighter">Trained Agent</h4>
          <ul className="space-y-2">
            {[
              "Detects ghost payroll",
              "Recovers capital",
              "Positive reward",
            ].map((text, i) => (
              <li key={i} className="text-[11px] text-emerald-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Section [4] LIVE DEMO PANEL ---
export function LiveDemoPanel() {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <Zap size={18} />
          </div>
          <h3 className="text-xl font-bold tracking-tight">🚀 Live Agent Demo</h3>
        </div>
        <button className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/20">
          Start Forensic Run
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { title: "Leak Evidence", text: "HR vs Finance mismatch detected in EMP-782", color: "text-rose-500", bg: "border-rose-500/10" },
          { title: "AI Decision", text: "Block payment & flag for human review", color: "text-amber-500", bg: "border-amber-500/10" },
          { title: "Schema Drift", text: "revenue → financial_yield mapping active", color: "text-blue-500", bg: "border-blue-500/10" },
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-xl glass border ${item.bg}`}>
            <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${item.color} mb-2`}>
              {item.title}
            </div>
            <p className="text-[10px] font-mono text-zinc-400 leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}

      </div>

      <div className="mt-auto grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl glass border border-emerald-500/20 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Recovered Amount</span>
          <span className="text-2xl font-black text-emerald-400">₹4.2M</span>
        </div>
        <div className="p-5 rounded-2xl glass border border-indigo-500/20 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Margin Impact</span>
          <span className="text-2xl font-black text-indigo-400">+1.2%</span>
        </div>
      </div>
    </div>
  );
}
