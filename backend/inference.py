"""
inference.py — MetaAuditor Adversity · OpenEnv Submission Entry Point

This file is the **official OpenEnv evaluator entry point** for the MetaAuditor
Adversity environment. It follows the exact structured output format required:
  [START] task=<task_name>
  [STEP]  step=<n> reward=<score>
  [END]   task=<task_name> score=<final_score> steps=<total_steps>

Agent Strategy (in priority order):
  1. Fine-tuned Meta Llama-3-8B-Instruct (LoRA from HuggingFace)
  2. Meta Llama-3 via HuggingFace Inference API (cloud fallback)
  3. Rule-based heuristic agent (always available, no GPU required)

Author: Dhusyanth03
HuggingFace: https://huggingface.co/Dhusyanth03/meta-auditor-agent-lora
OpenEnv: https://huggingface.co/spaces/Dhusyanth03/meta-auditor-enterprise
"""

import json
import os
import re
import sys
import warnings
import httpx

warnings.filterwarnings("ignore")

# ─── Environment ───────────────────────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(__file__))
from server.env.environment import ITMarginEnv

# ─── Config ────────────────────────────────────────────────────────────────────
HF_MODEL_REPO   = os.getenv("AGENT_MODEL_REPO", "Dhusyanth03/meta-auditor-agent-lora")
HF_API_TOKEN    = os.getenv("HF_TOKEN", "")
API_BASE_URL    = os.getenv("API_BASE_URL", "http://localhost:7860")
MAX_STEPS       = int(os.getenv("MAX_STEPS", "8"))   # max quarters per episode

SYSTEM_PROMPT = (
    "You are an advanced Enterprise Forensic Auditor AI operating inside the "
    "MetaAuditor OpenEnv environment. Your goal is to maximize Operating Profit "
    "Margin (OPM) by reconciling HR, Finance, and Ops discrepancies. "
    "Enclose your reasoning in <thought> tags, then output ONLY valid JSON."
)

# ─── Heuristic Fallback ────────────────────────────────────────────────────────
def heuristic_action(obs: dict) -> dict:
    """Rule-based agent. Always works — no AI required."""
    action = {
        "pay_hike": 3,
        "reskill_budget": 5.0,
        "automation_investment": 15.0,
        "bidding_strategy": "balanced",
        "cost_cut_admin": 0,
    }
    try:
        fin = obs.get("financials", {})
        margin = fin.get("op_margin_pct", fin.get("op_margin", 15.0))
        pipeline = obs.get("audit_pipeline", [])

        if margin < 13.0:                      # critical — cut costs hard
            action["automation_investment"] = 30.0
            action["cost_cut_admin"] = 1
            action["bidding_strategy"] = "conservative"

        elif margin > 18.0:                    # comfortable — invest in growth
            action["automation_investment"] = 10.0
            action["reskill_budget"] = 12.0
            action["bidding_strategy"] = "aggressive"

        if pipeline:                           # always close the top leak
            top = pipeline[0]
            action["audit_action"] = {
                "leak_id": top.get("leak_id", "UNKNOWN"),
                "key":     top.get("discrepancy_key", ""),
            }
    except Exception:
        pass
    return action


# ─── HuggingFace Inference API Fallback ───────────────────────────────────────
def hf_api_action(obs: dict) -> dict | None:
    """
    Calls the HuggingFace Serverless Inference API for Llama-3 when no GPU is
    available locally. Falls back to heuristic if the call fails.
    """
    if not HF_API_TOKEN:
        return None

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": json.dumps(obs, indent=2)},
    ]
    try:
        res = httpx.post(
            f"https://api-inference.huggingface.co/models/{HF_MODEL_REPO}/v1/chat/completions",
            headers={"Authorization": f"Bearer {HF_API_TOKEN}"},
            json={"messages": messages, "max_tokens": 512, "temperature": 0.2},
            timeout=30.0,
        )
        res.raise_for_status()
        raw = res.json()["choices"][0]["message"]["content"]
        return _parse_llm_output(raw)
    except Exception:
        return None


# ─── Local Unsloth / PEFT Model ───────────────────────────────────────────────
_local_model  = None
_local_tokenizer = None

def _load_local_model():
    global _local_model, _local_tokenizer
    if _local_model is not None:
        return True
    try:
        from unsloth import FastLanguageModel
        _local_model, _local_tokenizer = FastLanguageModel.from_pretrained(
            model_name=HF_MODEL_REPO,
            max_seq_length=2048,
            load_in_4bit=True,
        )
        FastLanguageModel.for_inference(_local_model)
        return True
    except Exception:
        return False


def local_model_action(obs: dict) -> dict | None:
    if not _load_local_model():
        return None
    try:
        import torch
        msgs = [
            {"from": "system", "value": SYSTEM_PROMPT},
            {"from": "user",   "value": json.dumps(obs, indent=2)},
        ]
        prompt = _local_tokenizer.apply_chat_template(
            msgs, tokenize=False, add_generation_prompt=True
        )
        inputs = _local_tokenizer(prompt, return_tensors="pt").to("cuda")
        with torch.no_grad():
            out = _local_model.generate(
                **inputs,
                max_new_tokens=512,
                temperature=0.2,
                do_sample=True,
                pad_token_id=_local_tokenizer.eos_token_id,
            )
        text = _local_tokenizer.decode(
            out[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True
        )
        return _parse_llm_output(text)
    except Exception:
        return None


# ─── Output Parser ─────────────────────────────────────────────────────────────
def _parse_llm_output(raw: str) -> dict | None:
    """Strip <thought> tags, extract and validate the JSON action block."""
    clean = re.sub(r"<thought>.*?</thought>", "", raw, flags=re.DOTALL).strip()
    match = re.search(r"\{.*\}", clean, re.DOTALL)
    if not match:
        return None
    try:
        action = json.loads(match.group())
        # Validate required keys
        for k in ["pay_hike", "bidding_strategy", "automation_investment"]:
            if k not in action:
                return None
        # Clamp to openenv.yaml schema bounds
        action["pay_hike"]              = int(max(0, min(10,  action.get("pay_hike", 3))))
        action["reskill_budget"]        = float(max(0, min(20, action.get("reskill_budget", 5))))
        action["automation_investment"] = float(max(0, min(50, action.get("automation_investment", 15))))
        return action
    except (json.JSONDecodeError, ValueError):
        return None


# ─── Agent Decision (Priority Waterfall) ──────────────────────────────────────
def decide(obs: dict) -> dict:
    """Try models in order; always return a valid action."""
    return (
        local_model_action(obs)   # 1. Local Llama-3 LoRA (fastest, offline)
        or hf_api_action(obs)     # 2. HF Inference API  (cloud, no GPU)
        or heuristic_action(obs)  # 3. Heuristic         (always works)
    )


# ─── HTTP Client (connects to the running FastAPI server) ─────────────────────
class MetaAuditorClient:
    def __init__(self, url: str = API_BASE_URL):
        self.url = url.rstrip("/")
        self._client = httpx.Client(timeout=30.0)

    def reset(self) -> dict:
        r = self._client.post(f"{self.url}/reset")
        r.raise_for_status()
        return r.json()["observation"]

    def step(self, action: dict):
        r = self._client.post(
            f"{self.url}/step",
            json=action,
            headers={"Content-Type": "application/json"},
        )
        r.raise_for_status()
        d = r.json()
        return d["observation"], d["reward"], d["done"], d["info"]

    def state(self) -> dict:
        r = self._client.get(f"{self.url}/state")
        r.raise_for_status()
        return r.json()["state"]

    def close(self):
        self._client.close()


# ─── OpenEnv Main Entry Point ─────────────────────────────────────────────────
if __name__ == "__main__":
    print("--- MetaAuditor Adversity · OpenEnv Inference Session ---", flush=True)

    # Determine mode: HTTP client if API_BASE_URL is set, else direct env
    use_http = os.getenv("API_BASE_URL") and os.getenv("API_BASE_URL") != "http://localhost:7860"

    if use_http:
        client = MetaAuditorClient()
        obs = client.reset()
        task_name = "meta_auditor_enterprise_live"

        print(f"[START] task={task_name}", flush=True)

        total_reward = 0.0
        steps = 0
        done = False

        while not done and steps < MAX_STEPS:
            action = decide(obs)
            obs, reward, done, _ = client.step(action)
            total_reward += reward
            steps += 1
            print(f"[STEP] step={steps} reward={reward:.4f}", flush=True)

        print(f"[END] task={task_name} score={total_reward:.4f} steps={steps}", flush=True)
        client.close()

    else:
        # Direct environment mode (no running server required)
        difficulties = ["easy", "medium", "hard"]
        quarters_per_difficulty = [3, 5, 8]

        for difficulty, max_q in zip(difficulties, quarters_per_difficulty):
            env = ITMarginEnv()
            env.max_quarters = max_q
            obs = env.reset()
            task_name = f"meta_auditor_{difficulty}"

            print(f"[START] task={task_name}", flush=True)

            total_reward = 0.0
            steps = 0
            done = False

            while not done and steps < max_q:
                action = decide(obs)
                obs, reward, done, _ = env.step(action)
                total_reward += reward
                steps += 1
                print(f"[STEP] step={steps} reward={reward:.4f}", flush=True)

            print(f"[END] task={task_name} score={total_reward:.4f} steps={steps}", flush=True)

    print("--- Session Complete ---", flush=True)
