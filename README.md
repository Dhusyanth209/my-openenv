<div align="center">
  <img src="https://huggingface.co/datasets/huggingface/brand-assets/resolve/main/hf-logo.png" width="80" alt="Hugging Face Logo" />
  <h1>MetaAuditor Enterprise 🕵️‍♂️💸</h1>
  <p><strong>OpenEnv Hackathon Submission (April 2026)</strong></p>
  <p>An autonomous, RL-trained forensic reconciler engineered to detect phantom margin leaks across disjointed corporate systems.</p>
</div>

---

## 🚀 1. The Core Vision: Verifiable Forensic RL
**MetaAuditor Enterprise** is not just an instruct model stuffed with context; it is a specialized `Meta-Llama-3-8B-Instruct` agent trained via Reinforcement Learning (RL) inside a live OpenEnv environment. 

Our explicit goal was to build a narrow, highly verifiable task: **Cross-System Corporate Reconciliation.**

The agent must act step-by-step, querying separate databases (HR and Finance), reconciling the data streams natively, detecting explicit logic anomalies (e.g., "Ghost Payroll" — an employee marked 'Resigned' in HR but 'Active' in Payroll), and executing verified capital recovery. 

By defining success mathematically (Total Capital Recovered), we achieved an objective, highly gamified RL training loop capable of recursive capability improvement without hallucination.

---

## 🧩 2. Environment Architecture (OpenEnv First)
Following OpenEnv best practices, we treated our environment as a **first-class artifact**, completely decoupling the world dynamics from the training loop. We define the environment mathematically:

* **State (Observation Space):** Interlocking JSON streams representing live HR Lifecycle updates and Finance Ledger logs.
* **Actions (Decision Space):** `[QUERY_DB]`, `[FLAG_ANOMALY]`, `[RECOVER_FUNDS]`, `[RESOURCE_ALLOCATE]`.
* **Standardized Interface:** Fully compliant with the `env.reset()` ➔ `env.step(action)` ➔ `obs, reward` pipeline exposed via FastAPI.

We deployed the skeleton of this environment early to [Hugging Face Spaces] to ensure shared truth for the team *before* running compute.

---

## 🛡️ 3. Multi-Signal Reward Design & Anti-Hacking
A single reward signal is an invitation for an LLM to reward-hack. To ensure our agent wasn't blindly exploiting bugs or cheating the environment loop, we implemented **Process-Aware independent verification**:

1. **Outcome Reward:** Absolute Capital Recovered (`+1.0` per successful verified leak map).
2. **Format Compliance Check:** Strictly enforcing rigid JSON schemas; penalizing hallucinations.
3. **API Rate Check:** Penalizing loops / timeouts to discourage infinite looping via `[QUERY_DB]`.
4. **Anti-Hack Execution:** Using locked-down execution contexts so the model cannot read hidden global state or cache previous responses to mimic speed.

---

## ⚡ 4. The Engineering Stack
We leaned into performance, knowing that rollout generation dominates RL training:
* **TRL (GRPO):** Used for algorithmic step optimization and verifier-based trajectory logging.
* **Unsloth:** Used to slash memory requirements and massively accelerate generation sampling during rollouts.
* **OpenEnv:** Standardizing the client-server interaction to ensure our TRL scripts didn't need custom boilerplate to talk to our forensic endpoints.
* **Next.js 16 (Turbopack):** Delivering a high-fidelity glassmorphism command console directly on top of the Space.

---

## 📈 5. Evidence of Learning
We highly encourage judges to refer to the **📊 Agent Training Performance** tab deployed directly onto our Web UI. 
You will see explicit, visual proof of adaptation:
* **Baseline Llama-3:** Blindly processes records; achieves `₹0.0` recovery.
* **Trained Agent:** Adaptively cross-references fields even when the structure mutates (Schema Drift mapping), halts unauthorized outflows dynamically, and secures `₹4.2M` natively.

---

## 💻 6. Quickstart Demo

Our live interface exposes the exact API boundaries the RL training uses. 
1. Navigate to the Hugging Face Space.
2. Observe the initial `Total Leakage (₹12M)`.
3. Hit `Execute POST /step`.
4. Watch the agent evaluate identical streams, map the anomaly, and output formal JSON reasoning while mathematically saving margins.

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/meta-auditor-enterprise.git
cd meta-auditor-enterprise/frontend

# Install dependencies and spin up Next.js interface
npm install
npm run dev
```

---

*This project was built over 48 hours for the OpenEnv Hackathon with a strict adherence to robust reward shaping, zero-trust training environments, and enterprise-grade UI presentation.*
