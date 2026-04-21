from server.env.logic import ITFirmState

def test_long_horizon_margin_decay():
    print("Initializing IT Firm State...")
    state = ITFirmState()
    print(f"Start: Quarter {state.quarter}, OPM: {state.margin:.2f}%")
    
    # Simulate 8 quarters of "Low Pay Hike" strategy (bad strategy)
    for q in range(1, 9):
        action = {
            "pay_hike": 1, # Very low hike (below market inflation)
            "reskill_budget": 0,
            "automation_investment": 0,
            "bidding_strategy": "balanced",
            "cost_cut_admin": 0
        }
        state.apply_action(action)
        obs = state.get_observation()
        print(f"Q{obs['quarter']-1}: OPM: {obs['op_margin_pct']}% | Attrition Risk: {obs['macro_headwinds']*100:.1f}% | Headcount: {obs['headcount']}")

    print("\n--- Strategy Pivot: Invest in Automation & Pay Hikes ---")
    for q in range(9, 13):
        action = {
            "pay_hike": 5, # High hike to retain talent
            "reskill_budget": 2.0, # Invest in skills
            "automation_investment": 2.0, # Invest in efficiency
            "bidding_strategy": "aggressive",
            "cost_cut_admin": 5
        }
        state.apply_action(action)
        obs = state.get_observation()
        print(f"Q{obs['quarter']-1}: OPM: {obs['op_margin_pct']}% | Automation: {obs['automation_index']:.2f}")

if __name__ == "__main__":
    test_long_horizon_margin_decay()
