---
title: Conditionals
chapter: 4
---
A conditional runs some code only when something is true. It is how a program makes a decision.

## if

`if` takes a condition. If it evaluates to `True`, the indented block runs. If not, Python skips it.

```python
signal = "green"
if signal == "green":
    print("Go ahead")      # Go ahead
```

Two things must be right: the `:` at the end of the `if` line, and the indent (four spaces) on the line below. The indent is how Python knows what belongs inside.

Change `signal` to `"red"` and nothing prints.

## if not

`not` flips the result. The block runs when the condition is `False`.

```python
is_banned = False
if not is_banned:
    print("Welcome")       # Welcome
```

You will use this most for empty values. An empty list, an empty string, `0` and `None` all count as false.

```python
orders = []
if not orders:
    print("No orders yet") # No orders yet
```

## if / else

`else` is the plan B. It runs when the `if` condition is false.

```python
age = 17
if age >= 18:
    print("Allowed")
else:
    print("Not allowed")   # Not allowed
```

## elif

For more than two outcomes, add `elif` (short for "else if"). Python checks the conditions from the top and runs the first one that matches. Then it stops.

```python
code = 404
if code == 200:
    print("OK")
elif code == 404:
    print("Not found")     # Not found
elif code == 500:
    print("Server error")
else:
    print("Unknown")
```

If nothing matches, `else` runs. The order matters, so put the most specific check first.

## Combine conditions

Use `and` when both must be true, and `or` when one is enough.

```python
sky = "cloudy"
weather = "humid"
if sky == "cloudy" and weather == "humid":
    print("It will rain")    # It will rain
```

```python
role = "editor"
if role == "admin" or role == "editor":
    print("Can publish")     # Can publish
```

**In production:** when you compare one value against many, use `in`. It is shorter and it scales.

```python
if role in ("admin", "editor"):
    print("Can publish")     # Can publish
```

## One-line if / else

For a simple choice between two values, write it on a single line.

```python
age = 20
label = "adult" if age >= 18 else "minor"
print(label)                 # adult
```

Read it as: value if condition else other value.

**In production:** use this for simple choices only. If you need `elif`, or if the line gets long, write the full `if` block.