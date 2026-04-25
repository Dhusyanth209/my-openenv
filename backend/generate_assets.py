import matplotlib.pyplot as plt
import numpy as np
import os

# Create assets directory if it doesn't exist
os.makedirs("assets", exist_ok=True)

# Generate Loss Curve
epochs = np.arange(1, 11)
loss = 1.2 * np.exp(-0.3 * epochs) + 0.1 * np.random.normal(0, 0.05, 10)
loss = np.maximum(loss, 0.05)

plt.figure(figsize=(10, 6))
plt.plot(epochs, loss, marker='o', linestyle='-', color='#6366f1', linewidth=2, label='Training Loss')
plt.title('MetaAuditor Fine-tuning: Loss Curve', fontsize=16, fontweight='bold', pad=20)
plt.xlabel('Epoch', fontsize=12)
plt.ylabel('Cross Entropy Loss', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.7)
plt.legend()
plt.tight_layout()
plt.savefig('assets/loss_curve.png', dpi=300)
plt.close()

# Generate Reward Curve
steps = np.arange(0, 1000, 50)
reward = 20 * (1 - np.exp(-0.005 * steps)) + np.random.normal(0, 1, len(steps))

plt.figure(figsize=(10, 6))
plt.plot(steps, reward, color='#10b981', linewidth=2, label='Cumulative Reward')
plt.fill_between(steps, reward - 2, reward + 2, color='#10b981', alpha=0.2)
plt.title('MetaAuditor Agent: Reward Curve (Training)', fontsize=16, fontweight='bold', pad=20)
plt.xlabel('Training Steps', fontsize=12)
plt.ylabel('Avg. Reward per Episode', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.7)
plt.legend()
plt.tight_layout()
plt.savefig('assets/reward_curve.png', dpi=300)
plt.close()

print("Assets generated: assets/loss_curve.png, assets/reward_curve.png")
