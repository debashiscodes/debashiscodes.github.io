---
title: Data Types
chapter: 1
---
Every value in Python has a type, and the type decides what you can do with it. Start with these five: `int`, `float`, `bool`, `str` and `None`.

## Integers

Whole numbers: `1`, `2`, `300`. The type is `int`. There is no fixed size limit, only your memory.

You can calculate with them directly. `print` shows the result on screen. We cover functions later.

```python
print(1200 + 350)   # 1550   salary + bonus
print(1200 - 350)   # 850    salary - rent
print(25 * 4)       # 100    price x quantity
print(100 / 4)      # 25.0   split a bill four ways
```

`/` always returns a float, even when the answer is whole.

## Floats

Numbers with a decimal point: `5.333`. The type is `float`. Every operation that works on an `int` works here too.

```python
print(5.5 + 2.25)   # 7.75   subtotal + tip
print(10.0 - 2.5)   # 7.5    balance - fee
print(3 * 2.5)      # 7.5    int and float mix fine
print(10 / 4.0)     # 2.5
```

Floats are approximate, because they are stored in binary.

```python
print(0.1 + 0.2)    # 0.30000000000000004
```

**In production:** never use `float` for money. Use `Decimal`, or store whole cents as an `int`.

## Booleans

`True` or `False`. The type is `bool`. You mostly get them from comparisons.

```python
print(18 >= 18)                  # True   age check
```

`True` and `False` are just `1` and `0` underneath. That is useful for counting.

```python
print(sum([True, False, True]))  # 2      how many tests passed
```

## Strings

Text inside single `'` or double `"` quotes. The type is `str`. Letters, digits, symbols, anything on the keyboard.

`+` joins two strings.

```python
print("order-" + "1042")         # order-1042
```

Escape characters format the output. `\n` starts a new line and `\t` adds a tab.

```python
print("line one\nline two")      # two lines
print("id\tname")                # id    name
```

**In production:** past two pieces, use an f-string. It is easier to read.

```python
print(f"order-{1000 + 42}")      # order-1042
```

## The type() function

`type()` tells you what something is. Everything in Python is an object, and every object has a type.

```python
print(type("42"))                # <class 'str'>   form input is always text
```

**In production:** to check a type, use `isinstance`, not `type(x) == ...`.

```python
print(isinstance(42, int))       # True
```

## None

`None` means "no value". It is what you get when something was never set, or was not found.

```python
print({"name": "Asha"}.get("email"))           # None   the key is missing
```

Check for it with `is`, not `==`.

```python
print({"name": "Asha"}.get("email") is None)   # True
```