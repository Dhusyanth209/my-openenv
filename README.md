---
title: MetaAuditor Adversity
emoji: 🦅
colorFrom: indigo
colorTo: purple
sdk: docker
pinned: true
license: mit
short_description: OpenEnv Grand Finale - Enterprise AI Forensic Auditor powered by Meta Llama-3
---

# 🦅 MetaAuditor Adversity // OpenEnv Grand Finale

A high-fidelity **OpenEnv** enterprise simulation where a fine-tuned **Meta Llama-3-8B** agent reconciles margin leaks across HR, Finance & Ops in real time.

## Quickstart
The environment runs on port `7860`. Use the OpenAPI docs at `/docs` to execute steps.

```bash
POST /step     # Execute one agent step
GET  /state    # Read full enterprise state  
POST /reset    # Restart the simulation
POST /agent/step  # Let Llama-3 decide autonomously
```

## Architecture
- **Environment**: FastAPI + Python (schema drift, SME feedback, RBAC)
- **Agent Brain**: Meta Llama-3-8B-Instruct fine-tuned with Unsloth
- **Frontend**: Next.js dashboard with live reward curves

## Training
Fine-tuned on 1,500 synthetic expert trajectories using Unsloth on Google Colab.
Model weights: `Dhusyanth03/meta-auditor-agent-lora`
