import random

class SimulatedExpert:
    """Simulated Subject Matter Expert (SME) who provides domain-specific hints"""
    def __init__(self):
        self.feedback_history = []

    def get_manager_feedback(self, state_snapshot):
        """Generates feedback based on firm state"""
        opm = state_snapshot.get("op_margin", 0)
        leaks = state_snapshot.get("active_leaks", [])
        automation = state_snapshot.get("automation", 0)
        
        feedbacks = []
        
        # 1. Financial Guidance
        if opm < 15:
            feedbacks.append("The Board is concerned about the OPM trough. Focus on immediate forensic recovery.")
        elif opm > 25:
            feedbacks.append("Strong margins. This is the optimal time to scale automation investments.")

        # 2. Forensic Hints
        if leaks:
            leak_types = [l['type'] for l in leaks]
            if "Ghost Payroll" in leak_types:
                feedbacks.append("I'm seeing discrepancies in the APAC headcount sync. Audit the HR roster against the Ops log.")
            if "Double Invoicing" in leak_types:
                feedbacks.append("Vendor payments seem inflated this quarter. Review the SAP approved invoice list.")

        # 3. Automation Guidance
        if automation < 0.2:
            feedbacks.append("Our digital transformation is lagging. We need more cycle-time reduction.")

        if not feedbacks:
            feedbacks.append("Firm performance is within standard deviation. Monitor for upcoming macro headwinds.")

        # Apply Ambiguity (Snorkel AI Theme: handling experts with changing preferences/styles)
        base_feedback = random.choice(feedbacks)
        if random.random() > 0.7:
            # Obfuscate the hint
            base_feedback = f"Internal memo: {base_feedback.lower().replace('audit', 'investigate').replace('leak', 'variance')}."

        self.feedback_history.append(base_feedback)
        return base_feedback
