"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, User, Building, IdCard, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [step, setStep] = useState(1); // 1: Login, 2: Formalities
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("openenv2026");
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [empId, setEmpId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("meta_token", data.token);
        setStep(2); // Move to formalities
      } else {
        setError("Invalid credentials. Use admin/openenv2026");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, department: dept, employee_id: empId }),
      });
      router.push("/dashboard");
    } catch (err) {
      router.push("/dashboard"); // Fallback
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans">
      <div className="ambient-bg" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-8 rounded-3xl relative z-10 border border-white/10"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
                  <ShieldCheck className="text-amber-500" size={32} />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white mb-2 uppercase">Auditor Sanction</h1>
                <p className="text-zinc-500 text-sm text-center">Initialize secure session to access theITFirm-X forensics ledger.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                      placeholder="Username"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Key Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                      placeholder="Secure Key"
                    />
                  </div>
                </div>

                {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

                <button 
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-sm tracking-wide text-white mt-4 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                >
                  {loading ? "Authenticating..." : "Establish Connection"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="formalities"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
                  <IdCard className="text-indigo-400" size={32} />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white mb-2 uppercase">Official Credentials</h1>
                <p className="text-zinc-500 text-sm text-center">Complete the auditor profile for official reconciliation reports.</p>
              </div>

              <form onSubmit={handleFinalize} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Department</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                      <input 
                        type="text" 
                        required
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none"
                        placeholder="e.g. Finance"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Auditor ID</label>
                    <input 
                      type="text" 
                      required
                      value={empId}
                      onChange={(e) => setEmpId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none"
                      placeholder="AUD-XXXX"
                    />
                  </div>
                </div>

                <button 
                  className="w-full py-4 rounded-xl font-bold text-sm tracking-wide text-white mt-4 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  Confirm & Enter Dashboard
                  <ArrowRight size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
