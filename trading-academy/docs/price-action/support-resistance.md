---
title: Support and Resistance Levels
description: Learn how to identify and trade key price levels
author: Admin
category: Price Action
tags:
  - support
  - resistance
  - key-levels
  - price-action
published: true
date: 2026-02-01
---

# Support and Resistance Levels

Support and resistance are the most fundamental concepts in technical analysis. They represent price levels where supply and demand meet.

## What is Support?

Support is a price level where **buying pressure** is strong enough to prevent the price from falling further. It acts as a "floor" for the price.

## What is Resistance?

Resistance is a price level where **selling pressure** is strong enough to prevent the price from rising further. It acts as a "ceiling" for the price.

## How to Identify Key Levels

### Method 1: Swing Points

Look for areas where the price has **bounced** multiple times:

```
Resistance:  ═══════════════  (Multiple touches)
                    ╱╲
                   ╱  ╲
                  ╱    ╲
                 ╱      ╲
Support:     ═══════════════  (Multiple touches)
```

### Method 2: Round Numbers

Psychological levels like 1.0000, 1.5000, 2.0000 often act as support/resistance.

### Method 3: Moving Averages

Dynamic support/resistance using moving averages:

```python
def find_dynamic_sr(prices, period=20):
    sma = sum(prices[-period:]) / period
    return sma
```

## Trading Strategy

1. **Identify** key levels on higher timeframes
2. **Wait** for price to reach the level
3. **Look for** confirmation (candlestick patterns, volume)
4. **Enter** with proper risk management

## Rules of Thumb

- The more times a level is tested, the **weaker** it becomes
- Broken support becomes **resistance** (and vice versa)
- Higher timeframe levels are **more significant**
- Always use a **stop loss** in case the level breaks

> "Support and resistance are not exact lines, but rather zones where price is likely to react."
