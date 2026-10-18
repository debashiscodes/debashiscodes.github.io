---
title: Variables
chapter: 3
---
A variable is a name stuck on a value, like a label on a box. You use the name, and Python finds the value.

## Create one

Use `=` to give a value a name. The name on the left, the value on the right.

```python
shirts = 5
print(shirts)       # 5
```

`shirts` is just a name we picked. `shirt_count` or `num_of_shirts` would work the same.

## Change it

Use it in an expression, and store the result back under the same name.

```python
shirts = 5
shirts += 3         # restock: shirts is now 8
shirts -= 2         # two sold: shirts is now 6
print(shirts)       # 6
```

`shirts += 3` is the short form of `shirts = shirts + 3`. The same pattern works for `-=`, `*=` and `/=`.

## Any type fits

A variable can hold any type: `str`, `int`, `float`, `bool`.

```python
name = "Asha"           # str
age = 29                # int
balance = 1042.50       # float
is_active = True        # bool
```

You can replace the value at any time.

```python
status = "pending"
status = "paid"
print(status)           # paid
```

To see what a variable holds right now, use `type()`.

```python
print(type(balance))    # <class 'float'>
```

**In production:** a variable should hold one kind of thing for its whole life. If `status` is a string, do not make it a number later. The next reader will not expect it.

## Naming rules

Python enforces three rules. Break one and the program will not run.

**1. Only letters, digits and `_`.** A dash, a space or any other symbol is a syntax error.

```python
user_name = "asha"      # ok
user-name = "asha"      # SyntaxError
```

**2. Do not start with a digit.**

```python
second_place = "Ravi"   # ok
2nd_place = "Ravi"      # SyntaxError
```

**3. Names are case sensitive.** `animals` and `Animals` are two different variables.

```python
animals = 3
Animals = 5
print(animals, Animals)     # 3 5
```

It is legal, but never do it. Two names that differ only by case will cause a bug.

One more hard rule: you cannot use a Python keyword as a name, such as `class`, `for` or `if`.

## Naming convention

This one is not enforced. It is what every Python codebase follows (PEP 8).

**Use snake_case.** All lowercase, words joined by underscores.

```python
number_of_seasons = 4
list_of_animals = ["cat", "dog"]
```

**Name it for what it holds.** `retry_count`, not `n`. `user_email`, not `s`.

**Constants are UPPER_CASE.** If a value should never change, say so with the name.

```python
MAX_RETRIES = 3
```

**Never name a variable after a built-in** such as `list`, `str`, `type` or `id`. It silently replaces the built-in.

```python
type = "premium"
type(5)                     # TypeError: 'str' object is not callable
```