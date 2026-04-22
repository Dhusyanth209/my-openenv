# MetaAuditor Architectural Protocol: `execute_step`

The `POST /step` function is the core of the **MetaAuditor Adversity** environment. It represents a single **Fiscal Quarter** in the IT firm's lifecycle. Below is the step-by-step breakdown of what happens when you click "Execute Step".

## 1. Authentication Check (Identity Layer)
Before any logic runs, the system validates your **JWT Token**. 
- It ensures you have the `Auditor` role.
- If no token is provided, the environment remains in a "Read-Only" state where actions are ignored.

## 2. Investigative Reconciliation (Audit Phase)
If you provide an `audit_action` (Leak ID and Reconciliation Key), the system:
1.  Queries the **HR App** data (Ghost Payroll/Employee records).
2.  Queries the **Finance App** ledger (Accounts Payable).
3.  Matches the `reconciliation_key`.
4.  **Result**: If they match, the "Phantom Leak" is plugged, and capital is recovered into the R&D budget.

## 3. Strategic Adjustment (Ops Phase)
The system applies your strategic inputs:
- **Pay Hike**: Influences the the probability of `Competitor Poaching` (Attrition).
- **Automation Index**: Increases the `Efficiency Gain` multi-quarter multiplier.
- **Bidding Strategy**: Impacts revenue growth but carries different risk weights.

## 4. The Adversity Simulation (Stochastic Phase)
This is where the "Adversity" happens. The world logic triggers events that test the agent's adaptability:
- **Schema Drift**: One of the multi-app APIs changes its field names (e.g., `payroll_total` becomes `labor_cost_sum`).
- **Market Shocks**: Competitors enter the space, causing sudden spikes in employee churn.

## 5. Indicator Recalculation
The environment recalculates the **Operating Profit Margin (OPM)**:
`Margin = (Revenue - (Labor + Admin + R&D + Remaining Leaks)) / Revenue`

## 6. Immutable Logging (Ledger Phase)
Finally, every action and outcome is recorded in the **Audit Ledger**, which is visible in the "Agent Reasoning Trace" on your dashboard.

---

> [!TIP]
> This deterministic yet stochastic pattern allows our **Meta Llama-3 Agent** to "learn" how to adapt to unexpected data changes (Schema Drift) while maintaining a strict focus on the $25M recovery mission.
