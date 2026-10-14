---
title: Numbers
chapter: 1
---
Python has whole numbers (`int`) and decimal numbers (`float`). The usual operators work on both.

## Arithmetic

```python
a = 7
b = 2

print(a + b)    # 9
print(a - b)    # 5
print(a * b)    # 14
print(a / b)    # 3.5
print(a // b)   # 3
print(a % b)    # 1
print(a ** b)   # 49
```

`/` always gives a float, `//` divides and rounds down, `%` gives the remainder and `**` is the power.

## Floats are approximate

```python
print(0.1 + 0.2)             # 0.30000000000000004
print(round(0.1 + 0.2, 2))   # 0.3
```

Decimal numbers are stored in binary, so some of them can only be stored approximately. Use `round` when you print.