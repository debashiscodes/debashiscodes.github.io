---
title: Operators
chapter: 2
---
An operator takes values and gives back a new value. You already used `+`, `-`, `*` and `/`. Here are the rest you need every day.

## Arithmetic operators

### Modulo `%`

Gives the remainder of a division.

```python
print(17 % 5)         # 2      17 items in boxes of 5 leaves 2 loose
print(10 % 2 == 0)    # True   the classic even-number check
```

### Exponent `**`

Raises a number to a power. `5 ** 3` means 5 x 5 x 5.

```python
print(5 ** 3)         # 125
print(2 ** 10)        # 1024   bytes in a kilobyte
```

### Floor division `//`

Divides, then rounds **down** to the whole number. It works on floats too, but the result stays a float.

```python
print(5 // 2)         # 2      5 / 2 is 2.5, the .5 is dropped
print(130 // 60)      # 2      whole hours in 130 minutes
print(7.5 // 2)       # 3.0
```

Down means toward negative infinity, not toward zero.

```python
print(-5 // 2)        # -3
```

## Comparison operators

Every comparison gives back a `bool`: `True` or `False`.

### Equal and not equal

`==` asks "are these the same value?". `!=` asks the opposite. One `=` assigns, two `==` compare.

```python
print("admin" == "admin")       # True    role check
print("paid" != "pending")      # True    status check
print(1 == 1.0)                 # True    an int and a float can be equal
```

**In production:** never compare floats with `==`.

```python
print(0.1 + 0.2 == 0.3)         # False
```

Use `math.isclose` for that.

### Greater and less than

`>` and `<` compare the left side to the right side. Add `=` to include equal values.

```python
print(72 > 50)        # True    score against the passing mark
print(3 > 5)          # False
print(5 < 3)          # False
print(3 < 5)          # True
print(18 >= 18)       # True    age limit
print(99 <= 100)      # True    within the cap
```

### Chaining

Put several comparisons in a row to check a range.

```python
print(0 <= 85 <= 100)     # True    a valid percentage
print(0 <= 185 <= 100)    # False
```

`0 <= 85 <= 100` is the same as `0 <= 85 and 85 <= 100`, and it is easier to read.

## Operator precedence

When an expression has several operators, Python does not read left to right. It follows a fixed order.

| Operators | Priority |
| --- | --- |
| `()` | 1 (highest) |
| `**` | 2 |
| `*`, `/`, `//`, `%` | 3 |
| `+`, `-` | 4 |
| `==`, `!=`, `>`, `<`, `>=`, `<=` | 5 (lowest) |

Multiplication and division go before addition and subtraction.

```python
print(3 + 4 / 2)          # 5.0    4 / 2 first, then 3 + 2.0
print(2 + 3 * 4)          # 14     3 * 4 first, then 2 + 12
```

Parentheses go first. They override the order.

```python
print((3 + 4) / 2)        # 3.5    3 + 4 first, then 7 / 2
```

Arithmetic runs before comparisons, so you do not need brackets here.

```python
print(1 + 1 == 2)         # True
```

One trap: `**` binds tighter than a minus sign in front of it.

```python
print(-2 ** 2)            # -4     it is -(2 ** 2)
```

**In production:** when the order is not obvious, add parentheses. They cost nothing, and the next reader will not have to remember the table.

```python
print(100 + 100 * 0.1)    # 110.0  price + 10% tax
```