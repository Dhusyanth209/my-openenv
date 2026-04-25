"use client";

import { motion } from "framer-motion";

const EXPERTS = [
  {
    name: "Dr. Elena Vance",
    role: "Systemic Risk Analyst · Forensic AI Lab",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    quote:
      "The agent's decision to bypass the Identity Server in Step 288 wasn't an error — it was a strategic prioritization after detecting a schema drift that rendered the primary auth-keys obsolete. Genuinely intelligent.",
    accent: "#818cf8",
  },
  {
    name: "Marcus Thorne",
    role: "Enterprise Auditor · CFO Advisory Board",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    quote:
      "Navigating the Market Shock in Step 302 by reallocating R&D budget into hiring-retention proves high-fidelity long-horizon planning. It mirrored real-world IT firm defense mechanisms precisely.",
    accent: "#c084fc",
  },
];

const FOOTER_LINKS = [
  { label: "HuggingFace", href: "https://huggingface.co/Dhusyanth03" },
  { label: "GitHub", href: "#" },
  { label: "Benchmarks", href: "#metrics" },
  { label: "OpenEnv Docs", href: "#" },
];

export function SmeFooter() {
  return (
    <footer className="relative border-t border-white/5 overflow-hidden" style={{ background: "#020204" }}>
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(129,140,248,0.08) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto px-6 relative z-10">

        {/* ── SME Testimonials ── */}
        <div className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-600 mb-4">
              Frame 5 · Simulated Expert Validation
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter gradient-text mb-4">
              Subject Matter Insights
            </h2>
            <p className="text-zinc-500 max-w-md mx-auto text-sm">
              Validated by simulated domain experts across financial forensics and agentic observability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {EXPERTS.map((expert, i) => (
              <motion.div
                key={expert.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group p-8 rounded-3xl glass relative overflow-hidden cursor-default transition-all"
                style={{ border: `1px solid ${expert.accent}15` }}
              >
                {/* Corner glow on hover */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: `radial-gradient(circle at 100% 0%, ${expert.accent}18 0%, transparent 70%)` }}
                />

                {/* Quote mark */}
                <div className="text-6xl font-serif leading-none mb-4 opacity-20" style={{ color: expert.accent }}>&ldquo;</div>

                <blockquote className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                  {expert.quote}
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity"
                      style={{ background: expert.accent }}
                    />
                    <img
                      src={expert.avatar}
                      alt={expert.name}
                      className="w-12 h-12 rounded-full relative z-10"
                      style={{ border: `2px solid ${expert.accent}40`, background: "#1a1a2e" }}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{expert.name}</div>
                    <div className="text-[11px] font-mono mt-0.5" style={{ color: expert.accent }}>
                      {expert.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Grand Finale CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-16 border-t border-white/5 text-center"
        >
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-600 mb-6">
            Cerebral Valley Grand Finale 2026
          </p>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tighter gradient-text mb-6">
            Built to Win.
          </h3>
          <p className="text-zinc-500 max-w-md mx-auto text-sm mb-10">
            MetaAuditor Adversity — an OpenEnv enterprise simulation featuring
            dynamic schema drift, Meta Llama-3, and immutable governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a
              whileHover={{ scale: 1.04 }}
              href="https://huggingface.co/Dhusyanth03"
              target="_blank"
              className="px-7 py-3 rounded-full text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              View on HuggingFace →
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.04 }}
              href="#"
              className="px-7 py-3 rounded-full text-sm font-semibold text-zinc-300 glass"
            >
              GitHub Repository
            </motion.a>
          </div>
        </motion.div>

        {/* ── Footer bar ── */}
        <div className="py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 font-extrabold text-base">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              M
            </div>
            <span className="gradient-text-primary">MetaAuditor</span>
            <span className="text-zinc-700 font-normal text-sm">Adversity</span>
          </div>

          <div className="flex gap-7">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                className="text-[11px] font-semibold text-zinc-600 hover:text-zinc-300 transition-colors uppercase tracking-widest"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="text-[10px] font-mono text-zinc-700">
            © 2026 METAAUDITOR · CEREBRAL VALLEY
          </div>
        </div>
      </div>
    </footer>
  );
}
