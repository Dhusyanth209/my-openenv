import random
from .identity import IdentityProvider

class UnauthorizedException(Exception):
    pass

class EnterpriseApp:
    def __init__(self, required_role="Any"):
        self.idp = IdentityProvider()
        self.required_role = required_role

    def _validate(self, token):
        success, info = self.idp.validate_token(token, self.required_role)
        if not success:
            raise UnauthorizedException(info)
        return info

class WorkdaySim(EnterpriseApp):
    def __init__(self, headcount, avg_salary):
        super().__init__(required_role="Any")
        self.employees = []
        for i in range(headcount):
            self.employees.append({
                "id": f"EMP-{1000+i}",
                "name": f"Employee {i}",
                "status": "Active",
                "salary": avg_salary
            })

    def get_roster(self, token):
        self._validate(token)
        return self.employees

class SAPSim(EnterpriseApp):
    def __init__(self):
        super().__init__(required_role="Auditor")
        self.invoices = []
        self.bank_transactions = []

    def log_invoice(self, token, project_id, amount, vendor_id):
        self._validate(token)
        self.invoices.append({
            "id": f"INV-{random.randint(10000, 99999)}",
            "project_id": project_id,
            "amount": amount,
            "vendor": vendor_id,
            "status": "Approved"
        })

    def get_financial_summary(self, token):
        self._validate(token)
        return {
            "total_invoiced": sum(inv["amount"] for inv in self.invoices),
            "invoice_count": len(self.invoices),
            "bank_balance": 125.0
        }

class OpsPortalSim(EnterpriseApp):
    def __init__(self):
        super().__init__(required_role="Any")
        self.pod_records = []

    def log_delivery(self, token, project_id, pod_id):
        self._validate(token)
        self.pod_records.append({"id": pod_id, "project_id": project_id})

    def get_ops_summary(self, token):
        self._validate(token)
        return {"pods_delivered": len(self.pod_records)}

class EnterpriseEcosystem:
    def __init__(self, initial_headcount, avg_salary, drifter=None):
        self.hr = WorkdaySim(initial_headcount, avg_salary)
        self.finance = SAPSim()
        self.ops = OpsPortalSim()
        self.drifter = drifter # Schema Drifter Integration

    def query_reconciliation(self, token):
        try:
            hr_raw = self.hr.get_roster(token)[:5]
            fin_raw = self.finance.get_financial_summary(token)
            ops_raw = self.ops.get_ops_summary(token)
            
            # Apply Schema Drift if drifter is present
            if self.drifter:
                hr_data = self.drifter.transform_data("hr", hr_raw)
                fin_data = self.drifter.transform_data("finance", fin_raw)
                ops_data = ops_raw # Ops remains stable for now
            else:
                hr_data, fin_data, ops_data = hr_raw, fin_raw, ops_raw

            return {
                "hr": hr_data,
                "finance": fin_data,
                "ops": ops_data,
                "status": "200 OK",
                "schema_version": self.drifter.version if self.drifter else 1
            }
        except UnauthorizedException as e:
            return {
                "status": str(e), 
                "hr": [], 
                "finance": {}, 
                "ops": {}, 
                "schema_version": self.drifter.version if self.drifter else 1
            }
