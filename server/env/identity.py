import hashlib
import time

class IdentityProvider:
    """Simulated Enterprise Identity Provider (IdP)"""
    def __init__(self):
        self.secret = "meta-scaler-top-secret"
        self.users = {
            "auditor_user": {"password": "auditor_password", "role": "Auditor"},
            "ceo_user": {"password": "ceo_password", "role": "CEO"}
        }

    def login(self, username, password):
        if username in self.users and self.users[username]["password"] == password:
            role = self.users[username]["role"]
            # Create a simple hash-based JWT simulation
            token_payload = f"{username}:{role}:{int(time.time()) + 3600}"
            token = hashlib.sha256(f"{token_payload}:{self.secret}".encode()).hexdigest()
            return f"{token_payload}:{token}"
        return None

    @staticmethod
    def validate_token(token, required_role):
        if not token:
            return False, "401 Unauthorized: No token provided."
        
        try:
            parts = token.split(":")
            if len(parts) != 4:
                return False, "403 Forbidden: Invalid token format."
            
            username, role, expiry, signature = parts
            
            # Simple role check
            if required_role == "Any" or role == required_role:
                return True, role
            return False, f"403 Forbidden: Role '{role}' does not have '{required_role}' permissions."
        except Exception:
            return False, "403 Forbidden: Token corrupted."
