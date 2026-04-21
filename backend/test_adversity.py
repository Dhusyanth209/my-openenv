from server.env.logic import ITFirmState

def test_enterprise_level3_adversity():
    print("=== MetaAuditor Level 3 Adversity Test ===")
    state = ITFirmState()
    
    # 1. Initial State & Feedback
    print(f"\n[Quarter 1] Initial State")
    print(f"Expert Feedback: {state.last_sme_feedback}")
    print(f"Schema Version: {state.drifter.version}")

    # 2. Simulate 3 Quarters to trigger Schema Drift
    print("\n--- Moving to Quarter 3 (Triggering Drift) ---")
    for q in range(3):
        # Authenticate as Auditor for every turn
        state.authenticate("auditor_user", "auditor_password")
        action = {
            "pay_hike": 3,
            "automation_investment": 5,
            "token": state.active_auth_token
        }
        state.apply_action(action)
    
    obs = state.get_observation()
    print(f"[Quarter {state.quarter}] Adversity Log: {obs['adversity_log']}")
    print(f"Expert Feedback: {obs['expert_feedback']}")
    print(f"Schema Version: {state.drifter.version}")
    
    # Verify Schema key change in SAP
    print("\n[Audit] Inspecting SAP Schema Drift...")
    sap_sync = obs['app_sync']['finance']
    print(f"SAP Data Keys: {list(sap_sync.keys())}")
    
    if any(key in ["billed_amount_global", "ledger_entry_count", "cash_position_units"] for key in sap_sync.keys()):
        print("SUCCESS: Schema Drift detected in SAP data.")
    else:
        print("INFO: No SAP drift this cycle (Randomized).")

    # 3. Market Shock Test (Quarter 4)
    if state.quarter >= 4:
        print("\n[Market] Verifying Competitor Shock...")
        logs = state.ledger.get_logs()
        shocks = [l for l in logs if l['role'] == "Market"]
        if shocks:
            print(f"SUCCESS: Market Shock Logged: {shocks[0]['details']}")

if __name__ == "__main__":
    test_enterprise_level3_adversity()
