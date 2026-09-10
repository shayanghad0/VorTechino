---
title: Risk Management Fundamentals
description: Learn how to protect your capital and manage risk effectively
author: Admin
category: Risk Management
tags:
  - risk-management
  - position-sizing
  - stop-loss
  - capital-preservation
published: true
date: 2026-02-15
---

# Risk Management Fundamentals

Risk management is the **most important** skill in trading. You can have the best strategy in the world, but without proper risk management, you will blow up your account.

## The 1% Rule

Never risk more than **1-2% of your total account** on a single trade.

### Example

| Account Size | Max Risk (1%) | Max Risk (2%) |
|-------------|---------------|---------------|
| $1,000 | $10 | $20 |
| $10,000 | $100 | $200 |
| $100,000 | $1,000 | $2,000 |

## Position Sizing Formula

```
Position Size = (Account × Risk%) / (Entry - Stop Loss)
```

### Practical Example

```python
def calculate_position_size(account, risk_percent, entry, stop_loss):
    risk_amount = account * (risk_percent / 100)
    risk_per_unit = abs(entry - stop_loss)
    position_size = risk_amount / risk_per_unit
    return position_size

# Example
account = 10000
risk = 1  # 1%
entry = 1.0850
stop_loss = 1.0820

size = calculate_position_size(account, risk, entry, stop_loss)
print(f"Position size: {size:.0f} units")
```

## Stop Loss Strategies

### Fixed Stop Loss

Set a stop loss at a fixed distance from entry.

### Technical Stop Loss

Place stop loss below/above key support/resistance.

### Volatility-Based Stop

Use ATR (Average True Range) to set dynamic stops:

```
Stop Loss = Entry - (ATR × 1.5)
```

## Risk-Reward Ratio

Always aim for a minimum **1:2 risk-reward ratio**.

| Risk | Reward | R:R | Need to win |
|------|--------|-----|-------------|
| $100 | $200 | 1:2 | 34% to be profitable |
| $100 | $300 | 1:3 | 26% to be profitable |
| $100 | $100 | 1:1 | 51% to be profitable |

## Maximum Drawdown Rules

- **Daily loss limit**: Stop trading after losing 3-5% in a day
- **Weekly loss limit**: Reduce size after losing 6-10% in a week
- **Monthly review**: Analyze your performance monthly

## Common Mistakes

1. **No stop loss**: "It'll come back" is a dangerous mindset
2. **Moving stop loss**: Always keep your original stop
3. **Revenge trading**: Bigger sizes after losses
4. **Overleveraging**: Using too much margin

> "Risk comes from not knowing what you're doing." — Warren Buffett

## Key Takeaways

- Always use a stop loss
- Risk only 1-2% per trade
- Aim for 1:2 or better risk-reward
- Never revenge trade
- Track and review your risk metrics
