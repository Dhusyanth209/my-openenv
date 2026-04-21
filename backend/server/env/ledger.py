import time
import hashlib
import json

class AuditLedger:
    """Immutable Enterprise Audit Ledger with State Hashing"""
    def __init__(self):
        self.logs = []
        self.cumulative_hash = "GENESIS-BLOCK"

    def log_event(self, role, action_type, details, status="Success"):
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%S")
        
        # Create log entry
        entry = {
            "timestamp": timestamp,
            "role": role,
            "action": action_type,
            "details": details,
            "status": status,
            "prev_hash": self.cumulative_hash
        }
        
        # Calculate new cumulative hash (Integrity Proof)
        entry_str = json.dumps(entry, sort_keys=True)
        self.cumulative_hash = hashlib.sha256(f"{entry_str}".encode()).hexdigest()
        
        self.logs.append(entry)
        return self.cumulative_hash

    def get_logs(self):
        return self.logs
