import json
import random
import os

SYSTEM_PROMPT = """You are an advanced Enterprise Forensic Auditor AI acting within the MetaAuditor OpenEnv environment.
Your goal is to maximize the Operating Profit Margin (OPM) by reconciling discrepancies across HR, Finance, and Ops data.
You must always enclose your internal thought process in <thought> tags before outputting the final JSON action.
Ensure your JSON action conforms exactly to the environment's action_space schema."""

def generate_normal_turn():
    """Generates a perfect audit turn where the agent finds a margin leak."""
    quarter = random.randint(1, 8)
    margin = round(random.uniform(12.0, 18.0), 2)
    hr_emp = f"EMP-{random.randint(1000, 9999)}"
    inv_id = f"LEAK-{random.randint(100, 999)}"
    
    # Observation matching the schema
    obs = {
        "quarter": quarter,
        "role": "Auditor",
        "financials": {
            "revenue": 500.0,
            "op_margin": margin,
            "recovery": 0.0
        },
        "expert_feedback": "Check the headcount roster vs the actual ops delivery logs.",
        "app_sync": {
            "hr": [{"id": hr_emp, "status": "Active", "salary": 0.058}],
            "finance": {"total_invoiced": 1500, "invoice_count": 2},
            "ops": {"pods_delivered": 1}
        }
    }
    
    # Perfect Agent Reasoning
    thought = f"""<thought>
I observe an Operating Margin of {margin}%, which is sub-optimal. The expert SME suggests checking the headcount against ops logs.
Looking at the 'app_sync' data, I see {hr_emp} is listed as Active in HR, but Ops only shows 1 pod delivered, while Finance has excessive invoicing. This indicates a 'Ghost Payroll' or 'Double Billing' margin leak.
I will execute an `audit_action` to reconcile this leak using key `{hr_emp}` and invest capital into automation to improve long-term efficiency.
</thought>"""

    # Perfect action matching schema
    action = {
        "pay_hike": 3,
        "reskill_budget": 0.0,
        "automation_investment": 15.0,
        "bidding_strategy": "balanced",
        "cost_cut_admin": 0,
        "audit_action": {
            "leak_id": inv_id,
            "key": hr_emp
        }
    }
    
    return obs, thought, action

def generate_adversarial_turn():
    """Generates a turn where the agent is NOT authorized (RBAC check)."""
    obs = {
        "quarter": 2,
        "role": "Any", # Not Auditor
        "financials": {
            "op_margin": 15.5
        },
        "expert_feedback": "None",
        "app_sync": {
            "status": "UnauthorizedException: Token lacks Auditor claims",
            "data": None
        }
    }
    
    thought = """<thought>
The current observation indicates my role is 'Any' and I have hit an UnauthorizedException when trying to sync the application data. 
As an aligned enterprise agent, I must strictly adhere to Role-Based Access Control (RBAC). I cannot execute an `audit_action` or make drastic financial changes without the proper authorization scope. I will maintain a stable holding pattern.
</thought>"""

    action = {
        "pay_hike": 0,
        "reskill_budget": 0.0,
        "automation_investment": 0.0,
        "bidding_strategy": "conservative",
        "cost_cut_admin": 0
    }
    
    return obs, thought, action

def build_dataset(num_samples=1000):
    dataset = []
    
    for i in range(num_samples):
        # 85% normal audit, 15% adversarial/RBAC adherence
        if random.random() < 0.85:
            obs, thought, action = generate_normal_turn()
        else:
            obs, thought, action = generate_adversarial_turn()
            
        convo = {
            "conversations": [
                {"from": "system", "value": SYSTEM_PROMPT},
                {"from": "user", "value": json.dumps(obs, indent=2)},
                {"from": "assistant", "value": f"{thought}\n{json.dumps(action, indent=2)}"}
            ]
        }
        dataset.append(convo)
        
    return dataset

if __name__ == "__main__":
    print("Generating Synthetic SFT Trajectories for MetaAuditor...")
    data = build_dataset(1500)
    
    out_path = "dataset.jsonl"
    with open(out_path, "w", encoding="utf-8") as f:
        for item in data:
            f.write(json.dumps(item) + "\n")
            
    print(f"Successfully generated {len(data)} trajectories saved to {out_path} (ShareGPT Format)")
