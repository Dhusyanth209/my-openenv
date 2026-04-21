from server.env.logic import ITFirmState

def test_enterprise_security_rbac():
    print("=== MetaAuditor Security & RBAC Test ===")
    state = ITFirmState()
    
    # 1. Unauthorized Access
    print("\n[Test 1] Attempting multi-app query without Token...")
    obs = state.get_observation()
    print(f"App Sync Status: {obs['app_sync']['status']}")
    
    # 2. CEO Login: Access HR but not Audit
    print("\n[Test 2] Authenticating as 'ceo_user'...")
    success, token = state.authenticate("ceo_user", "ceo_password")
    obs = state.get_observation()
    print(f"Role: {obs['role']} | App Sync: {obs['app_sync']['status']}")
    
    print("Attempting Forensic Audit as CEO...")
    success, msg = state.audit_reconcile("LEAK-101", "EMP-999", token)
    print(f"Result: {success} - {msg}")

    # 3. Auditor Login: Access Everything
    print("\n[Test 3] Authenticating as 'auditor_user'...")
    success, token = state.authenticate("auditor_user", "auditor_password")
    obs = state.get_observation()
    print(f"Role: {obs['role']} | App Sync: {obs['app_sync']['status']}")
    
    print("Attempting Forensic Audit as Auditor...")
    success, msg = state.audit_reconcile("LEAK-101", "EMP-999", token)
    print(f"Result: {success} - {msg}")

    # 4. Ledger Integrity
    print("\n[Test 4] Verifying Immutable Audit Ledger...")
    logs = state.ledger.get_logs()
    print(f"Total Logs: {len(logs)}")
    for log in logs[-3:]:
        print(f" - [{log['status']}] {log['role']} -> {log['action']}: {log['details']}")

if __name__ == "__main__":
    test_enterprise_security_rbac()
