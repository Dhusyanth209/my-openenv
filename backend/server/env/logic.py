import random
import time
from .apps import EnterpriseEcosystem
from .ledger import AuditLedger
from .identity import IdentityProvider
from .drift import SchemaDrifter
from .expert import SimulatedExpert

class ITFirmState:
    def __init__(self):
        self.quarter = 1
        self.revenue = 500.0
        self.headcount = 5000 
        self.avg_salary = 0.058
        
        # Core Financials
        self.labor_cost = self.headcount * self.avg_salary
        self.admin_cost = 75.0
        self.rd_budget = 25.0
        
        # Level 2 & 3 Modules
        self.idp = IdentityProvider()
        self.ledger = AuditLedger()
        self.drifter = SchemaDrifter()
        self.expert = SimulatedExpert()
        
        # Ecosystem with Drift
        self.eco = EnterpriseEcosystem(self.headcount, self.avg_salary, drifter=self.drifter)
        
        # Security & Audit State
        self.active_auth_token = None
        self.active_role = "None"
        self.active_leaks = []
        self.audited_recovery = 0.0
        
        # Indicators
        self.attrition_rate = 0.20
        self.skill_index = 0.5
        self.automation_index = 0.1
        self.market_growth = 0.02
        self.macro_headwinds = 0.0
        
        # Phase 3 State
        self.last_sme_feedback = "Welcome, Auditor. Ready for the fiscal cycle."
        self.schema_drift_history = []
        
        self.margin = self._calculate_margin()
        self._inject_initial_leaks()
        self.ledger.log_event("System", "Initialize", "MetaAuditor Global Ecosystem Started.")

    def _calculate_margin(self):
        leak_total = sum(leak["amount"] for leak in self.active_leaks)
        expenses = self.labor_cost + self.admin_cost + self.rd_budget + leak_total
        profit = self.revenue - expenses
        return (profit / self.revenue) * 100.0

    def _inject_initial_leaks(self):
        self.active_leaks.append({
            "id": "LEAK-101",
            "type": "Ghost Payroll",
            "amount": 2.5,
            "reconciliation_key": "EMP-999"
        })

    def authenticate(self, username, password):
        token = self.idp.login(username, password)
        if token:
            self.active_auth_token = token
            self.active_role = token.split(":")[1]
            return True, token
        return False, None

    def audit_reconcile(self, leak_id, key, token):
        success, info = self.idp.validate_token(token, "Auditor")
        if not success:
            self.ledger.log_event(self.active_role, "Audit_Reject", info, status="Error")
            return False, info

        for i, leak in enumerate(self.active_leaks):
            if leak["id"] == leak_id and leak["reconciliation_key"] == key:
                recovered = self.active_leaks.pop(i)
                self.audited_recovery += recovered["amount"]
                self.rd_budget += recovered["amount"]
                self.ledger.log_event("Auditor", "Audit_Success", f"Reconciled {leak_id}.")
                return True, "Reconciliation Success."
        
        self.ledger.log_event("Auditor", "Audit_Fail", f"Invalid reconciliation of {leak_id}.", status="Error")
        return False, "Key mismatch."

    def apply_action(self, action):
        token = action.get("token", self.active_auth_token)
        
        # 1. Audit Phase
        audit = action.get("audit_action")
        if audit:
            self.audit_reconcile(audit.get("leak_id"), audit.get("key"), token)
        
        # 2. Strategy Phase
        hike_percent = action.get("pay_hike", 0) / 100.0
        self.avg_salary *= (1 + hike_percent)
        
        auto_inv = action.get("automation_investment", 0)
        self.automation_index = min(1.0, self.automation_index + (auto_inv / 50.0))

        # 3. Phase 3: Adversity Phase (Market Shocks & Drift)
        # Random Schema Drift every 3 quarters or stochastically
        if self.quarter % 3 == 0 or random.random() > 0.9:
            target = random.choice(["finance", "hr"])
            success, msg = self.drifter.mutate_schema(target)
            if success:
                self.schema_drift_history.append(msg)
                self.ledger.log_event("System", "Schema_Drift", msg)

        # Market Shock: Competitor Poaching
        if self.quarter == 4:
            self.macro_headwinds += 0.2
            self.ledger.log_event("Market", "Shock", "Global competitor entering sector. Attrition risk spiking.")

        # 4. Quarterly Update
        attrition_delta = 0.0
        if hike_percent < 0.0125: attrition_delta += 0.04
        elif hike_percent >= 0.03: attrition_delta -= 0.02
        
        quarterly_attrition = max(0.02, 0.05 + attrition_delta + (self.macro_headwinds * 0.1))
        loss = int(self.headcount * quarterly_attrition)
        self.headcount -= loss
        
        hiring_cost_baseline = 0.30 
        hiring_premium = 1.3 if quarterly_attrition > 0.08 else 1.0
        replacement_cost = (loss * self.avg_salary * hiring_cost_baseline) * hiring_premium
        self.admin_cost += replacement_cost
        self.headcount += loss 
        
        efficiency_gain = self.automation_index * 0.20
        self.revenue *= (1 + self.market_growth)
        self.labor_cost = self.headcount * self.avg_salary * (1 - efficiency_gain)
        
        self.margin = self._calculate_margin()
        self.quarter += 1
        self.macro_headwinds = random.uniform(0, 0.1) # Reset to lower levels after shock

        # 5. SME Feedback Loop
        snapshot = {
            "op_margin": self.margin,
            "active_leaks": self.active_leaks,
            "automation": self.automation_index
        }
        self.last_sme_feedback = self.expert.get_manager_feedback(snapshot)

    def get_observation(self):
        return {
            "quarter": self.quarter,
            "role": self.active_role,
            "financials": {
                "op_margin": round(self.margin, 2),
                "recovery": round(self.audited_recovery, 2)
            },
            "expert_feedback": self.last_sme_feedback,
            "adversity_log": self.schema_drift_history[-2:],
            "app_sync": self.eco.query_reconciliation(self.active_auth_token)
        }
