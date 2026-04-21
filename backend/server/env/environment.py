from .logic import ITFirmState

class ITMarginEnv:
    def __init__(self):
        self.state = ITFirmState()
        self.max_quarters = 8 # Slightly shorter but deeper horizon for enterprise

    def reset(self):
        self.state = ITFirmState()
        return self.state.get_observation()

    def step(self, action):
        """
        Integrated Step: Audit + Strategy
        """
        prev_margin = self.state.margin
        prev_leaks = len(self.state.active_leaks)
        
        # Apply logic
        self.state.apply_action(action)
        
        obs = self.state.get_observation()
        
        # Integrated Reward:
        # 1. Audit Reward: Point for each leak found
        leaks_found = prev_leaks - len(self.state.active_leaks)
        audit_reward = leaks_found * 5.0
        
        # 2. OPM Reward: Weighted based on margin health
        opm_reward = (self.state.margin - 18.0) / 2.0 
        
        total_reward = audit_reward + opm_reward
        
        if self.state.margin < prev_margin and leaks_found == 0:
            total_reward -= 1.0 # Penalty for margin decay without investigative effort
            
        done = self.state.quarter > self.max_quarters or self.state.margin < 0
        
        # Bonus for "Clean Audit" + "High OPM" at end of fiscal year
        if done and len(self.state.active_leaks) == 0 and self.state.margin > 20:
            total_reward += 20.0
            
        return obs, round(total_reward, 2), done, {}

    def get_state(self):
        return self.state.get_observation()
