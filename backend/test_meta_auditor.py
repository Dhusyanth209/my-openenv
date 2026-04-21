from server.env.logic import ITFirmState

def test_enterprise_audit_loop():
    print("=== MetaAuditor Enterprise Audit Test ===")
    state = ITFirmState()
    
    # 1. Start State
    print(f"Initial OPM: {state.margin:.2f}%")
    print(f"Active Leaks: {len(state.active_leaks)}")
    for leak in state.active_leaks:
        print(f" - {leak['id']}: {leak['type']} (${leak['amount']}M)")

    # 2. Perform Audit Action
    print("\n--- Performing Forensic Reconciliation (LEAK-101) ---")
    action_1 = {
        "pay_hike": 3,
        "reskill_budget": 0,
        "automation_investment": 0,
        "bidding_strategy": "balanced",
        "audit_action": {
            "leak_id": "LEAK-101",
            "key": "EMP-999" # Ghost Payroll Key
        }
    }
    state.apply_action(action_1)
    
    print(f"Recovery Total: ${state.audited_recovery}M")
    print(f"Active Leaks: {len(state.active_leaks)}")
    print(f"New OPM: {state.margin:.2f}% (Recovery + Market Drift)")

    # 3. Automation Reinvestment
    print("\n--- Reinvesting Recovered Capital into Automation ---")
    action_2 = {
        "pay_hike": 3,
        "reskill_budget": 0,
        "automation_investment": state.audited_recovery, # Reinvested
        "bidding_strategy": "balanced",
        "audit_action": None
    }
    state.apply_action(action_2)
    print(f"Automation Level: {state.automation_index*100:.1f}%")
    print(f"Final OPM: {state.margin:.2f}%")

if __name__ == "__main__":
    test_enterprise_audit_loop()
