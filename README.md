---
title: MetaAuditor Enterprise
emoji: 🦅
colorFrom: indigo
colorTo: purple
sdk: docker
pinned: true
license: mit
short_description: Enterprise AI Forensic Auditor powered by Llama-3
---

# 🦅 MetaAuditor Enterprise // OpenEnv Grand Finale

A high-fidelity **OpenEnv** enterprise simulation where a fine-tuned **Meta Llama-3-8B** agent reconciles margin leaks across HR, Finance & Ops in real time.

## ✨ Winning Dashboard
This Space features a premium **Next.js & Framer Motion** dashboard integrated directly with the FastAPI backend.

- **Hero Section**: Adaptive governance visualizer.
- **Console**: Live agent reasoning traces (Llama-3 thought logs).
- **Performance**: Real-time reward curves and OPM scaling.
- **Forensics**: Immutable audit ledger and SME feedback loops.

## 🚀 Quickstart
The environment serves the dashboard at the root URL. API endpoints are available at:

```bash
POST /step     # Execute one agent step
GET  /state    # Read full enterprise state  
POST /reset    # Restart the simulation
POST /agent/step  # Let Llama-3 decide autonomously
```

## 🏗️ Architecture
- **Backend**: FastAPI + Python (schema drift, SME feedback, RBAC).
- **Frontend**: Next.js 16 (Turbopack) with ambient dark-mode aesthetics.
- **Agent**: Meta Llama-3-8B-Instruct (Unsloth fine-tuned).

## 🛠️ Installation & Submission
This repository is configured for both **HuggingFace Spaces** and the **OpenEnv evaluator**.

1.  **Inference**: `python inference.py` (Outputs structured `[START]/[STEP]/[END]` logs).
2.  **Training**: See `backend/train_meta_auditor_unsloth.ipynb` for the fine-tuning pipeline.
3.  **Deployment**: Multi-stage Docker build for seamless hosting.

**Author**: [Dhusyanth03](https://huggingface.co/Dhusyanth03)
