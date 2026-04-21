import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
import os

from server.env.environment import ITMarginEnv
from server.inference import get_brain

from fastapi.middleware.cors import CORSMiddleware

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
    return {"state": env.get_state()}

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

# --- Dashboard UI ---
@app.get("/", response_class=HTMLResponse)
def dashboard():
    state = env.get_state()
    logs = env.state.ledger.get_logs()
    
    # Format Ledger (Reversed)
    ledger_html = "".join([f'<div class="log-entry">[{l["timestamp"]}] <span style="color:var(--accent)">{l["role"]}</span>: {l["action"]} - {l["details"]}</div>' for l in reversed(logs[-8:])])

    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MetaAuditor // Level 3 Command</title>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
            :root {{
                --primary: #f59e0b;
                --accent: #3b82f6;
                --danger: #ef4444;
                --bg: #0f172a;
                --card: #1e293b;
                --text: #f8fafc;
            }}
            * {{ box-sizing: border-box; margin: 0; padding: 0; }}
            body {{
                background: var(--bg);
                color: var(--text);
                font-family: 'Outfit', sans-serif;
                display: grid; grid-template-columns: 350px 1fr 350px; gap: 20px; padding: 20px; height: 100vh; overflow: hidden;
            }}
            
            .col {{ display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }}
            .panel {{ background: var(--card); border-radius: 16px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); }}
            h2 {{ font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text); opacity: 0.6; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }}

            /* SME Chat Bubble */
            .sme-box {{ background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--primary); padding: 15px; border-radius: 8px; font-style: italic; font-size: 0.9rem; line-height: 1.4; color: var(--primary); }}
            
            /* Schema Drift Indicator */
            .drift-badge {{ background: #000; padding: 10px; border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--accent); }}
            .v-tag {{ font-family: monospace; font-weight: 700; color: var(--accent); font-size: 1.2rem; }}

            /* App Sync View */
            .app-data {{ font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin-top: 10px; color: #94a3b8; overflow: hidden; }}

            /* Controls */
            .btn {{ background: var(--primary); color: white; border: none; padding: 12px; border-radius: 8px; width: 100%; font-weight: 700; cursor: pointer; transition: 0.2s; }}
            .btn:hover {{ filter: brightness(1.1); transform: translateY(-2px); }}

            .terminal {{ background: #000; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; padding: 15px; border-radius: 12px; height: 300px; overflow-y: auto; }}
            .log-entry {{ margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px; }}
        </style>
    </head>
    <body>
        <div class="col">
            <div class="panel">
                <h2>Advisor Feedback</h2>
                <div style="font-size: 0.7rem; color: var(--text); opacity: 0.5; margin-bottom: 10px;">SUBJECT MATTER EXPERT (SME)</div>
                <div class="sme-box">"{state['expert_feedback']}"</div>
            </div>

            <div class="panel">
                <h2>Protocol Access</h2>
                <div style="font-size: 0.75rem; color: var(--accent); margin-bottom: 10px;">SESSION ROLE: {state['role']}</div>
                <div id="login-form">
                    <input type="text" id="user" placeholder="User" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05); padding:8px; margin-bottom:8px; color:white; border-radius:6px;">
                    <input type="password" id="pass" placeholder="Pass" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05); padding:8px; margin-bottom:8px; color:white; border-radius:6px;">
                    <button class="btn" onclick="doLogin()">Authenticate</button>
                </div>
            </div>

            <div class="panel" style="flex:1">
                <h2>Execution Queue</h2>
                <div style="margin-bottom:15px;">
                    <label style="font-size:0.7rem; display:block">Pay Hike (%)</label>
                    <input type="number" id="hike" value="3" style="width:100%; padding:8px; border-radius:6px; background:#000; color:white; border:1px solid rgba(255,255,255,0.05);">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="font-size:0.7rem; display:block">Automation ($M)</label>
                    <input type="number" id="auto" value="5" style="width:100%; padding:8px; border-radius:6px; background:#000; color:white; border:1px solid rgba(255,255,255,0.05);">
                </div>
                <button class="btn" style="background:#10b981" onclick="doStep()">Commit Quaterly Turn</button>
            </div>
        </div>

        <div class="col" style="grid-column: 2">
            <header style="display:flex; justify-content:space-between; align-items:center;">
                <h1 style="font-size:1.5rem; letter-spacing:4px; font-weight:800; color:var(--primary)">METAAUDITOR // L3</h1>
                <div class="drift-badge">API VERSION <span class="v-tag">V{state['app_sync']['schema_version']}</span></div>
            </header>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="panel" style="border-top: 4px solid #10b981">
                    <h2>Operational Margin</h2>
                    <div style="font-size:2.5rem; font-weight:800; font-family:'JetBrains Mono'">{state['financials']['op_margin']}%</div>
                    <div style="font-size:0.7rem; color:#10b981">STABLE / OPTIMIZED</div>
                </div>
                <div class="panel" style="border-top: 4px solid var(--accent)">
                    <h2>Recovered Leakage</h2>
                    <div style="font-size:2.5rem; font-weight:800; font-family:'JetBrains Mono'; color:var(--accent)">${state['financials']['recovery']}M</div>
                    <div style="font-size:0.7rem; color:var(--accent)">AUDIT RECOVERY TARGET: $25M</div>
                </div>
            </div>

            <div class="panel" style="flex:1">
                <h2>Multi-App Data Stream // Real-time Cross-Sync</h2>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div>
                        <div style="font-size:0.7rem; color:var(--accent)">SYSTEM: SAP FINANCE</div>
                        <div class="app-data">
                            {str(state['app_sync']['finance'])[:200]}...
                        </div>
                    </div>
                    <div>
                        <div style="font-size:0.7rem; color:var(--accent)">SYSTEM: WORKDAY HR</div>
                        <div class="app-data">
                            {str(state['app_sync']['hr'])[:200]}...
                        </div>
                    </div>
                </div>
                <div style="margin-top:20px;">
                    <div style="font-size:0.7rem; color:var(--danger)">ADVERSITY LOG</div>
                    <div style="font-family:monospace; font-size:0.8rem; margin-top:5px; padding:10px; background:rgba(239, 68, 68, 0.05); color:var(--danger); border-radius:8px;">
                        {state['adversity_log'][0] if state['adversity_log'] else "NO MARKET SHOCKS REGISTERED"}
                    </div>
                </div>
            </div>
        </div>

        <div class="col">
            <div class="panel" style="flex:1; display:flex; flex-direction:column;">
                <h2>Immutable Audit Ledger</h2>
                <div class="terminal">
                    {ledger_html if ledger_html else "SYSTEM IDLE..."}
                </div>
            </div>
        </div>

        <script>
            let currentToken = localStorage.getItem('meta_token');

            async function doLogin() {{
                const res = await fetch('/login', {{
                    method: 'POST',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify({{ 
                        username: document.getElementById('user').value,
                        password: document.getElementById('pass').value
                    }})
                }});
                if (res.ok) {{
                    const data = await res.json();
                    localStorage.setItem('meta_token', data.token);
                    location.reload();
                }} else alert("Access Denied");
            }}

            async function doStep() {{
                const action = {{
                    pay_hike: parseInt(document.getElementById('hike').value),
                    reskill_budget: 0,
                    automation_investment: parseFloat(document.getElementById('auto').value),
                    bidding_strategy: 'balanced',
                    cost_cut_admin: 0,
                    token: currentToken
                }};
                await fetch('/step', {{
                    method: 'POST',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify(action)
                }});
                location.reload();
            }}
        </script>
    </body>
    </html>
    """
    return html

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
