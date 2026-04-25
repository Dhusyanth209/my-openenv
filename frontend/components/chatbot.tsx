"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, ChevronRight, ShieldAlert, Cpu, BarChart3 } from "lucide-react";

const MISSION_MESSAGES = [
  {
    role: "assistant",
    content: "Greetings, Auditor. I am your Forensic SME Copilot. We are monitoring the IT Enterprise systems for margin erosion.",
  },
  {
    role: "assistant",
    content: "Our motive is clear: Recover $25M in hidden leaks across HR, Finance, and Ops before the fiscal year ends.",
  },
  {
    role: "assistant",
    content: "The 'Operational Console' below is your link to the live environment. Initialize the target to begin auditing.",
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(MISSION_MESSAGES);
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState("");

  const handleSend = async (queryOverride?: string) => {
    const query = queryOverride || input;
    if (!query.trim()) return;

    const userMsg = { role: "user", content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Apologies, I've lost connection to the forensic ledger. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  // Simulate an initial greeting after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) { /* show a notification badge maybe? */ }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-96 rounded-2xl border border-white/10 bg-slate-900/40 p-1 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 p-4 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 p-[2px]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900">
                      <Cpu className="h-5 w-5 text-amber-400" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">SME Copilot</h3>
                  <p className="text-[10px] text-emerald-400">FORENSIC GOVERNANCE ACTIVE</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="h-96 space-y-4 overflow-y-auto p-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "border border-white/5 bg-white/5 text-slate-300"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((j) => (
                        <motion.div
                          key={j}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: j * 0.2 }}
                          className="h-1 w-1 rounded-full bg-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer / Quick Actions */}
            <div className="border-t border-white/5 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {[
                  { label: "Mission Motive", query: "What is the motive for this audit?", icon: ShieldAlert },
                  { label: "Audit Stats", query: "How is our OPM and recovery looking?", icon: BarChart3 }
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(action.query)}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] text-slate-300 hover:bg-white/10"
                  >
                    <action.icon className="h-3 w-3" />
                    {action.label}
                  </button>
                ))}
              </div>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your Copilot..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-xs text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={isThinking}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-amber-500/10 p-2 text-amber-500 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 shadow-xl shadow-indigo-500/20"
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white" />}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-slate-900 border-2 border-slate-900"
          >
            1
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}
