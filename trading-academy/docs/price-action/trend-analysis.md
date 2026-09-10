---
title: Trend Analysis and Trendlines
description: Identify and trade with the trend using trendline analysis
author: Admin
category: Price Action
tags:
  - trends
  - trendlines
  - technical-analysis
  - price-action
published: true
date: 2026-02-20
---

# Trend Analysis and Trendlines

"The trend is your friend" — this timeless trading wisdom reminds us that trading with the trend increases your probability of success.

## Types of Trends

### Uptrend

A series of **higher highs** and **higher lows**.

```
        ╱╲
       ╱  ╲    ╱╲
      ╱    ╲  ╱  ╲    ╱╲
     ╱      ╲╱    ╲  ╱  ╲
    ╱              ╲╱    ╲
```

### Downtrend

A series of **lower highs** and **lower lows**.

```
    ╲
     ╲    ╱╲
      ╲  ╱  ╲
       ╲╱    ╲    ╱╲
              ╲  ╱  ╲
               ╲╱    ╲
```

### Sideways (Range)

Price moves between support and resistance with no clear direction.

## Drawing Trendlines

### Rules for Valid Trendlines

1. Must connect at least **2 points** (3+ is stronger)
2. For uptrends: connect the **lows**
3. For downtrends: connect the **highs**
4. The line should not cut through price action

### Trendline Touches

| Touches | Reliability |
|---------|-------------|
| 2 | Weak |
| 3 | Moderate |
| 4+ | Strong |

## Trend Continuation Patterns

### Flags and Pennants

Short-term consolidation within a trend:

- **Bull Flag**: After an up move, slight downward consolidation
- **Bear Flag**: After a down move, slight upward consolidation

### Triangles

- **Ascending Triangle**: Bullish continuation
- **Descending Triangle**: Bearish continuation
- **Symmetrical Triangle**: Can break either way

## Trading with Trends

```python
def identify_trend(highs, lows):
    higher_highs = all(highs[i] > highs[i-1] for i in range(1, len(highs)))
    higher_lows = all(lows[i] > lows[i-1] for i in range(1, len(lows)))
    
    if higher_highs and higher_lows:
        return "UPTREND"
    elif not higher_highs and not higher_lows:
        return "DOWNTREND"
    else:
        return "RANGING"
```

## Trend Trading Strategy

1. **Identify** the trend on a higher timeframe
2. **Wait** for a pullback to a trendline or support
3. **Enter** when you see a rejection pattern
4. **Place stop** below the previous swing low
5. **Target** the next resistance level

## Key Points

- Always trade in the direction of the major trend
- Use higher timeframes for trend identification
- Trendlines become stronger with more touches
- A broken trendline signals a potential trend change

> "Don't fight the tape." — Jesse Livermore
