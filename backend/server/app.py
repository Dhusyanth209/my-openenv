import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
import os
import json

from .env.environment import ITMarginEnv
from .inference import get_brain

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# --- App Setup ---
app = FastAPI(
    title="MetaAuditor Adversity // Adaptive Governance Console",
    description="Level 3 environment with Schema Drift, SME Feedback, and Market Shocks.",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

env = ITMarginEnv()

# --- Request Models ---
class LoginRequest(BaseModel):
    username: str
    password: str

class AuditAction(BaseModel):
    leak_id: str
    key: str

class ActionRequest(BaseModel):
    pay_hike: int
    reskill_budget: float
    automation_investment: float
    bidding_strategy: str
    cost_cut_admin: int
    token: Optional[str] = None
    audit_action: Optional[AuditAction] = None

class ChatRequest(BaseModel):
    query: str
    token: Optional[str] = None

class UserUpdateRequest(BaseModel):
    name: str
    department: str
    employee_id: str

# --- Persistence (Simulated) ---
USER_PROFILE = {
    "name": "Guest Auditor",
    "department": "Forensics",
    "employee_id": "AUD-000"
}

# --- API Endpoints (MUST be registered BEFORE static mount) ---
@app.post("/login")
def login(req: LoginRequest):
    success, token = env.state.authenticate(req.username, req.password)
    if success:
        return {"token": token, "role": env.state.active_role}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/reset")
def reset():
    obs = env.reset()
    return {"observation": obs}

@app.post("/step")
def step(action: ActionRequest):
    obs, reward, done, info = env.step(action.dict())
    return {"observation": obs, "reward": reward, "done": done, "info": info}

@app.get("/state")
def state():
    return {
        "state": env.get_state(),
        "user": USER_PROFILE
    }

@app.post("/user/update")
def update_user(req: UserUpdateRequest):
    global USER_PROFILE
    USER_PROFILE = req.dict()
    return {"status": "success", "user": USER_PROFILE}

@app.post("/chat")
def chat(req: ChatRequest):
    """
    Intelligent Chatbot: reads the live environment observation
    and provides a context-aware forensic briefing.
    """
    obs = env.get_state()
    query = req.query.lower()
    fin = obs.get("financials", {})
    opm = fin.get("op_margin", 0)
    recovery = fin.get("recovery", 0)
    quarter = obs.get("quarter", 1)
    drift = obs.get("adversity_log", [])
    expert = obs.get("expert_feedback", "")

    # --- Broad keyword matching for natural conversation ---
    if any(w in query for w in ["opm", "margin", "profit"]):
        response = (
            f"📊 Our Operating Profit Margin is currently at **{opm}%**. "
            f"The board requires >18% for stabilization. "
            f"{'We are above target — strong position.' if opm > 18 else 'We are below target — forensic recovery is critical.'}"
        )
    elif any(w in query for w in ["recover", "money", "leak", "capital", "how much"]):
        response = (
            f"💰 We have recovered **₹{recovery}M** so far out of the ₹25M target. "
            f"That is {round(recovery/25*100, 1)}% of our goal. "
            f"Active leaks in the APAC payroll still need reconciliation."
        )
    elif any(w in query for w in ["motive", "why", "purpose", "objective", "goal", "what is this"]):
        response = (
            "🎯 **Mission Objective**: An internal audit has revealed up to ₹25M in margin "
            "leakage across HR, Finance, and Operations. This system cross-references data "
            "from all three departments to identify Ghost Payroll entries, Double Invoicing, "
            "and Schema Drift anomalies. The AI agent automates the reconciliation process."
        )
    elif any(w in query for w in ["step", "execute", "what happens", "how does", "how it work", "what does the button"]):
        response = (
            "⚙️ **How Execute Step Works**:\n"
            "1. **Authenticate** — verifies your Auditor JWT token\n"
            "2. **Reconcile** — cross-references HR payroll keys vs Finance ledger to find ghost employees\n"
            "3. **Strategize** — applies your Pay Hike / Automation / Bidding decisions\n"
            "4. **Adversity** — the environment randomly mutates API schemas and triggers market shocks\n"
            "5. **Evaluate** — recalculates OPM and rewards the agent for each leak found"
        )
    elif any(w in query for w in ["quarter", "time", "when", "fiscal"]):
        response = f"📅 We are currently in **Quarter {quarter}** of the fiscal cycle. The audit runs for 8 quarters (2 fiscal years)."
    elif any(w in query for w in ["drift", "schema", "api change", "mutation"]):
        if drift:
            response = f"🔀 **Schema Drift Events Detected**:\n" + "\n".join(f"• {d}" for d in drift)
        else:
            response = "🔀 No schema drift events have been recorded yet. They typically appear after Q2."
    elif any(w in query for w in ["agent", "llama", "ai", "model", "brain"]):
        response = (
            "🧠 The Meta Llama-3 agent uses a priority waterfall:\n"
            "1. **Local LoRA model** (fine-tuned, fastest)\n"
            "2. **HuggingFace Inference API** (cloud fallback)\n"
            "3. **Heuristic rules** (always available, no GPU needed)\n"
            "It reads the full environment state and outputs a JSON action."
        )
    elif any(w in query for w in ["hello", "hi", "hey"]):
        response = f"👋 Hello, {USER_PROFILE['name']}! I'm your Forensic SME Copilot. Ask me about the audit status, how steps work, or our recovery progress."
    elif any(w in query for w in ["help", "what can you"]):
        response = (
            "I can help with:\n"
            "• **Audit Stats** — ask about OPM, recovery, or quarter\n"
            "• **How It Works** — ask about execute step, the agent, or schema drift\n"
            "• **Mission Briefing** — ask about the motive or objective\n"
            "• **Expert Advice** — I'll relay the SME feedback from the simulation"
        )
    elif any(w in query for w in ["expert", "sme", "advice", "suggest", "recommend"]):
        response = f"🧑‍💼 **SME Feedback**: {expert}"
    else:
        # Fallback: combine expert feedback with a helpful nudge
        response = (
            f"🧑‍💼 **SME says**: {expert}\n\n"
            f"💡 Try asking me about: OPM, recovery progress, how steps work, or the mission objective."
        )

    return {"response": response}

@app.post("/agent/step")
def agent_step():
    """
    Autonomous agent loop: reads the current environment state,
    passes it to the fine-tuned Llama-3 brain, and executes the
    returned action — no human input required.
    """
    brain = get_brain()
    current_state = env.get_state()
    action = brain.decide(current_state)
    obs, reward, done, info = env.step(action)
    return {
        "agent_action": action,
        "observation": obs,
        "reward": reward,
        "done": done,
        "info": info,
        "model_mode": "llm" if brain._loaded else "heuristic",
    }

# --- Static File Serving (MUST be LAST to avoid intercepting API routes) ---
# Only serve files that actually exist; for everything else, serve index.html
# so that Next.js client-side routing works.
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    static_dir = "./static"
    if not os.path.exists(static_dir):
        return HTMLResponse("<h1>Frontend not built yet</h1>", status_code=503)
    
    file_path = os.path.join(static_dir, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Try with .html extension for Next.js exported routes
    html_path = os.path.join(static_dir, full_path + ".html")
    if os.path.isfile(html_path):
        return FileResponse(html_path)
    
    # Check for directory index
    index_path = os.path.join(static_dir, full_path, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path)
    
    # Fallback to root index.html for client-side routing
    root_index = os.path.join(static_dir, "index.html")
    if os.path.isfile(root_index):
        return FileResponse(root_index)
    
    return HTMLResponse("<h1>Not found</h1>", status_code=404)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
