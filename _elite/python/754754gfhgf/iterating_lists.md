---
title: Iterating Lists
chapter: 7
---
Iterating means visiting every item in a list, one at a time. You will write a loop in almost every program.

## The for loop

You could print each item by hand, one line per item. It works, but you repeat yourself, and it breaks when the list changes. Use a `for` loop.

```python
animals = ["dog", "cat", "wolf", "cow"]
for animal in animals:
    print(f"This is a {animal}")
# This is a dog
# This is a cat
# This is a wolf
# This is a cow
```

`animal` is the loop variable. On each round, Python puts the next item from `animals` into it, then runs the indented block. Same rules as `if`: a `:` at the end of the line, and an indented body.

## if inside a loop

Filter while you loop.

```python
emails = ["asha@acme.com", "ravi@gmail.com", "meena@acme.com"]
for email in emails:
    if email.endswith("@acme.com"):
        print(email)
# asha@acme.com
# meena@acme.com
```

## continue: skip this item

`continue` jumps straight to the next item. Use it to ignore things you do not care about, like blank lines in a file.

```python
lines = ["name,age", "", "Asha,29", "", "Ravi,31"]
for line in lines:
    if not line:
        continue
    print(line)
# name,age
# Asha,29
# Ravi,31
```

## break: stop the loop

`break` leaves the loop right away. Use it when you found what you were looking for, or when something is wrong and there is no point going on.

```python
orders = [120, 340, 0, 95]
for amount in orders:
    if amount == 0:
        print("Bad order found, stopping")
        break
    print("Processing", amount)
# Processing 120
# Processing 340
# Bad order found, stopping
```

The `95` is never reached.

**In production:** `break` is how you stop a search early. No reason to scan the whole list after you found the user.

```python
users = ["asha", "ravi", "meena"]
for user in users:
    if user == "ravi":
        print("Found ravi")
        break
```

## range: loop over numbers

`range(n)` gives the numbers from `0` up to, but not including, `n`. Use it when you need to repeat something a fixed number of times, like a retry.

```python
for attempt in range(1, 4):
    print(f"Attempt {attempt}")
# Attempt 1
# Attempt 2
# Attempt 3
```

`range(start, stop, step)` takes up to three values.

```python
print(list(range(0, 10, 2)))    # [0, 2, 4, 6, 8]
```

## Loop with the position

Sometimes you need the position as well as the item. The beginner way is `range(len(...))`.

```python
names = ["Asha", "Ravi", "Meena"]
for i in range(len(names)):
    print(i, names[i])
# 0 Asha
# 1 Ravi
# 2 Meena
```

**In production:** use `enumerate`. It gives you the position and the item together, and there is no `names[i]` to get wrong.

```python
for i, name in enumerate(names, start=1):
    print(i, name)
# 1 Asha
# 2 Ravi
# 3 Meena
```

`start=1` begins counting at 1, which is what people expect on a numbered list.

## zip: two lists together

`zip` pairs the items of two lists, side by side.

```python
countries = ["India", "France", "Japan"]
capitals = ["New Delhi", "Paris", "Tokyo"]
for country, capital in zip(countries, capitals):
    print(f"{capital} is the capital of {country}")
# New Delhi is the capital of India
# Paris is the capital of France
# Tokyo is the capital of Japan
```

`zip` stops at the shorter list, and it does that silently.

```python
print(list(zip([1, 2, 3], ["a", "b"])))    # [(1, 'a'), (2, 'b')]    the 3 vanished
```

**In production:** if the two lists must be the same length, say so. `strict=True` raises an error when they are not.

```python
zip([1, 2, 3], ["a", "b"], strict=True)
# ValueError: zip() argument 2 is shorter than argument 1
```

## Nested lists

A list inside a list needs a loop inside a loop. The outer loop picks each inner list. The inner loop picks each value.

```python
teams = [["Asha", "Ravi"], ["Tom", "Sara"]]
for team in teams:
    for member in team:
        print(member)
# Asha
# Ravi
# Tom
# Sara
```

## One trap: do not change a list while looping over it

Remove items from a list you are looping over, and the loop skips items.

```python
nums = [2, 4, 6, 8]
for n in nums:
    nums.remove(n)
print(nums)                 # [4, 8]    we wanted []
```

The list shrinks under the loop, so the loop loses its place. Build a new list instead.

```python
nums = [1, 2, 3, 4, 5, 6]
odds = []
for n in nums:
    if n % 2 == 1:
        odds.append(n)
print(odds)                 # [1, 3, 5]
```