
class Environment:
    """Base class for all OpenEnv environments."""
    def reset(self):
        """Resets the environment to an initial state."""
        raise NotImplementedError

    def step(self, action):
        """Executes one timestep within the environment."""
        raise NotImplementedError

    def get_state(self):
        """Returns the current internal state of the environment."""
        raise NotImplementedError

class MCPEnvironment(Environment):
    """
    Multi-Capability Provider Environment.
    Enables agents to interact with multiple enterprise applications.
    """
    def __init__(self):
        super().__init__()
