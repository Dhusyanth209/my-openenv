import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
import os

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

# --- Endpoints ---
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
    Intelligent Chatbot logic: uses the current environment observation
    to provide a context-aware answer from the 'Auditor Brain'.
    """
    obs = env.get_state()
    query = req.query.lower()
    
    # Simple logic mapping (can be expanded to an LLM call)
    if "opm" in query or "margin" in query:
        response = f"Currently, our Operating Profit Margin is at {obs['financials']['op_margin']}%. We are aiming for >18% to reach our stabilization goal."
    elif "recovery" in query or "money" in query or "leak" in query:
        response = f"We have recovered ${obs['financials']['recovery']}M so far. There are still leaks in the APAC payroll that need your reconciliation."
    elif "motive" in query or "why" in query:
        response = "The objective is forensic stabilization. We are cross-referencing HR, Finance, and Ops to stop $25M in margin leakage."
    else:
        # Fallback to the SME expert logic
        response = obs['expert_feedback']
        
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

# --- Dashboard UI (Premium Dashboard) ---
# Serve the static files from the Next.js export
if os.path.exists("./static"):
    app.mount("/", StaticFiles(directory="./static", html=True), name="static")

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    if os.path.exists(f"./static/{full_path}"):
        return FileResponse(f"./static/{full_path}")
    return FileResponse("./static/index.html")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
