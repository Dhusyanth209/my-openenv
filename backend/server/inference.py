"""
inference.py — MetaAuditor Agent Brain
Loads the fine-tuned Meta Llama-3 LoRA model from HuggingFace and uses it
to autonomously generate optimal actions given an environment observation.

Usage:
  from server.inference import AgentBrain
  brain = AgentBrain()
  action = brain.decide(observation_dict)
"""

import os
import json
import re
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)

# ── HuggingFace model repo for the fine-tuned LoRA weights ──────────────────
HF_MODEL_REPO = os.environ.get(
    "AGENT_MODEL_REPO", "Dhusyanth03/meta-auditor-agent-lora"
)

# ── Fallback default action (used when model is unavailable) ─────────────────
DEFAULT_ACTION = {
    "pay_hike": 3,
    "reskill_budget": 5.0,
    "automation_investment": 15.0,
    "bidding_strategy": "balanced",
    "cost_cut_admin": 0,
    "audit_action": None,
}

# ── System prompt the model was trained with ─────────────────────────────────
SYSTEM_PROMPT = """You are an advanced Enterprise Forensic Auditor AI acting within the MetaAuditor OpenEnv environment.
Your goal is to maximize the Operating Profit Margin (OPM) by reconciling discrepancies across HR, Finance, and Ops data.
You must always enclose your internal thought process in <thought> tags before outputting the final JSON action.
Ensure your JSON action conforms exactly to the environment's action_space schema."""


class AgentBrain:
    """
    Wraps the fine-tuned Llama-3 model and exposes a single `decide(obs)` method.
    Falls back to a heuristic if the model weights are not available,
    so the environment stays functional even without GPU access.
    """

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self._loaded = False
        self._load_model()

    # ── Model Loading ────────────────────────────────────────────────────────
    def _load_model(self):
        """
        Attempts to load the Unsloth-optimized Llama-3 model + LoRA adapters.
        Gracefully degrades to heuristic mode if torch / GPU is unavailable.
        """
        try:
            from unsloth import FastLanguageModel

            logger.info(f"Loading agent model from: {HF_MODEL_REPO}")
            self.model, self.tokenizer = FastLanguageModel.from_pretrained(
                model_name=HF_MODEL_REPO,
                max_seq_length=2048,
                dtype=None,           # auto-detect
                load_in_4bit=True,    # memory-efficient inference
            )
            FastLanguageModel.for_inference(self.model)  # enable 2x speed
            self._loaded = True
            logger.info("Agent model loaded successfully.")

        except ImportError:
            logger.warning(
                "Unsloth not installed — falling back to heuristic mode."
            )
        except Exception as e:
            logger.warning(
                f"Could not load model ({e}) — falling back to heuristic mode."
            )

    # ── Inference ────────────────────────────────────────────────────────────
    def decide(self, observation: dict) -> dict:
        """
        Given an environment observation dict, return the next action dict.
        """
        if self._loaded:
            return self._llm_decide(observation)
        return self._heuristic_decide(observation)

    def _llm_decide(self, observation: dict) -> dict:
        """Run the fine-tuned Llama-3 model to generate an action."""
        import torch

        messages = [
            {"from": "system", "value": SYSTEM_PROMPT},
            {"from": "user",   "value": json.dumps(observation, indent=2)},
        ]

        prompt = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
        )

        inputs = self.tokenizer(prompt, return_tensors="pt").to("cuda")

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=512,
                temperature=0.2,      # low temp = deterministic
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
            )

        response = self.tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[-1]:],
            skip_special_tokens=True,
        )

        return self._parse_action(response)

    def _parse_action(self, raw_output: str) -> dict:
        """
        Extract the JSON action block from the model's raw output.
        The model is trained to follow the pattern:
          <thought>...</thought>
          { ... }
        """
        # Strip <thought>...</thought> block
        clean = re.sub(r"<thought>.*?</thought>", "", raw_output, flags=re.DOTALL).strip()

        # Find the first JSON object
        match = re.search(r"\{.*\}", clean, re.DOTALL)
        if match:
            try:
                action = json.loads(match.group())
                # Validate required keys exist
                for key in ["pay_hike", "automation_investment", "bidding_strategy"]:
                    if key not in action:
                        raise ValueError(f"Missing key: {key}")
                # Clamp numeric fields to schema bounds
                action["pay_hike"] = int(max(0, min(10, action.get("pay_hike", 3))))
                action["reskill_budget"] = float(max(0, min(20, action.get("reskill_budget", 5))))
                action["automation_investment"] = float(max(0, min(50, action.get("automation_investment", 15))))
                return action
            except (json.JSONDecodeError, ValueError) as e:
                logger.warning(f"Failed to parse LLM action ({e}). Using heuristic.")

        return self._heuristic_decide({})

    # ── Heuristic Fallback ───────────────────────────────────────────────────
    def _heuristic_decide(self, observation: dict) -> dict:
        """
        Rule-based fallback agent. Reads the observation and applies
        explicit governance logic — useful for demos without GPU.
        """
        action = DEFAULT_ACTION.copy()
        try:
            financials = observation.get("financials", {})
            margin = financials.get("op_margin_pct", financials.get("op_margin", 15.0))
            pipeline = observation.get("audit_pipeline", [])

            # If margin is critically low, cut costs aggressively
            if margin < 13.0:
                action["automation_investment"] = 25.0
                action["cost_cut_admin"] = 1
                action["bidding_strategy"] = "conservative"

            # If there are open audit leaks, close the first one
            if pipeline:
                top_leak = pipeline[0]
                action["audit_action"] = {
                    "leak_id": top_leak.get("leak_id", "UNKNOWN"),
                    "key":     top_leak.get("discrepancy_key", ""),
                }
        except Exception as e:
            logger.warning(f"Heuristic fallback error: {e}")

        return action


# ── Module-level singleton (cached) ─────────────────────────────────────────
@lru_cache(maxsize=1)
def get_brain() -> AgentBrain:
    """Returns a singleton AgentBrain instance (loads model once)."""
    return AgentBrain()
