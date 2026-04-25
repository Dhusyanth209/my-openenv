import random

class SchemaDrifter:
    """Manages evolution of API schemas to test agent adaptability"""
    def __init__(self):
        self.active_mutations = {} # System -> {original_field: new_field}
        self.version = 1

    def mutate_schema(self, system_target):
        """Randomly evolves a schema field"""
        mutations = {
            "finance": [
                ("total_invoiced", "billed_amount_global"),
                ("invoice_count", "ledger_entry_count"),
                ("bank_balance", "cash_position_units")
            ],
            "hr": [
                ("salary", "comp_base_annual"),
                ("status", "employment_lifecycle_state")
            ]
        }
        
        if system_target in mutations:
            orig, new = random.choice(mutations[system_target])
            if system_target not in self.active_mutations:
                self.active_mutations[system_target] = {}
            
            self.active_mutations[system_target][orig] = new
            self.version += 1
            return True, f"Schema Drift Detected: {system_target}.{orig} -> {new}"
        return False, "No mutation applied."

    def transform_data(self, system_name, data):
        """Applies active mutations to raw data"""
        if system_name not in self.active_mutations:
            return data
        
        mutated_data = data.copy()
        for orig, new in self.active_mutations[system_name].items():
            if orig in mutated_data:
                mutated_data[new] = mutated_data.pop(orig)
            
            # Handle list of dicts (e.g. HR roster)
            if isinstance(data, list):
                new_list = []
                for item in data:
                    new_item = item.copy()
                    if orig in new_item:
                        new_item[new] = new_item.pop(orig)
                    new_list.append(new_item)
                return new_list
                
        return mutated_data
