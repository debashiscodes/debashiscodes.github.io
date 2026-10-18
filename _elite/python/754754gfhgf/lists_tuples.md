---
title: Lists and Tuples
chapter: 6
---
A list holds many values in one variable, in order. A tuple is the same thing, locked. Lists are what you reach for most, and most coding-interview problems are list problems.

## Lists

### Create one

Square brackets, values separated by commas.

```python
grocery_list = ["Eggs", "Apples", "Tomatoes", "Bread"]
print(grocery_list)         # ['Eggs', 'Apples', 'Tomatoes', 'Bread']
```

One variable instead of four. A list can mix types, such as a name, an age and a weight.

```python
person = ["Asha", 29, 61.5, "India"]
```

**In production:** keep one kind of thing in a list: all orders, or all emails. For a record with different fields, use a dict or a tuple.

### Read items

Positions start at `0`. A negative position counts from the end. A slice `[start:stop]` stops just before `stop`.

```python
print(grocery_list[0])      # Eggs
print(grocery_list[-1])     # Bread         the last item
print(grocery_list[1:3])    # ['Apples', 'Tomatoes']
print(grocery_list[10])     # IndexError: list index out of range
```

Slices are how you paginate.

```python
orders = list(range(1, 101))
print(orders[20:30])        # [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
```

### Add items

```python
cart = ["Eggs"]
cart.append("Apples")           # add to the end
cart.insert(0, "Milk")          # add at a position
cart.extend(["Bread", "Rice"])  # add many at once
print(cart)                     # ['Milk', 'Eggs', 'Apples', 'Bread', 'Rice']
```

### Remove items

`remove` deletes the first match. `pop` removes by position and gives the item back. With no position, it takes the last one.

```python
cart.remove("Eggs")
last = cart.pop()
print(last, cart)               # Rice ['Milk', 'Apples', 'Bread']
```

`remove` crashes when the item is missing.

```python
["a"].remove("z")               # ValueError: list.remove(x): x not in list
```

**In production:** check first.

```python
if "Bread" in cart:
    cart.remove("Bread")
```

### Search and count

```python
cart = ["Milk", "Apples", "Bread"]
print("Bread" in cart)               # True
print(cart.index("Apples"))          # 1      position of the first match
print(["a", "b", "a"].count("a"))    # 2
print(len(cart))                     # 3
```

### Sort and reverse

`sorted()` gives a new sorted list and leaves the original alone. `.sort()` changes the list itself and returns nothing.

```python
scores = [72, 95, 88, 61]
print(sorted(scores))                    # [61, 72, 88, 95]
print(sorted(scores, reverse=True)[:3])  # [95, 88, 72]    top three
print(min(scores), max(scores), sum(scores))   # 61 95 316
```

```python
scores.sort()                            # [61, 72, 88, 95]
scores.reverse()                         # [95, 88, 72, 61]
```

### Copy a list

`b = a` does not copy. It gives the same list a second name.

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)                    # [1, 2, 3, 4]    a changed too
c = a.copy()                # a real copy
```

**In production:** this is the classic bug. If a function gets a list and changes it, the caller's list changes too. Copy first when you need to keep the original.

### Stack and queue

A list is a good stack: last in, first out. It is how an undo button works.

```python
history = []
history.append("open file")
history.append("edit")
print(history.pop())        # edit
```

A list is a bad queue. `pop(0)` shifts every other item. For a queue, use `deque`.

```python
from collections import deque
queue = deque(["job1", "job2"])
print(queue.popleft())      # job1
```

### Nested lists

A list can hold lists. Read with two positions: row, then column.

```python
teams = [["Asha", "Ravi", "Meena"], ["Tom", "Sara", "Ali"], ["Nia", "Omar", "Li"]]
print(teams[1][0])          # Tom
```

Building a grid is a famous trap.

```python
grid = [[0] * 3 for _ in range(3)]   # right: three separate rows
bad = [[0] * 3] * 3                  # wrong: the same row, three times
bad[0][0] = 1
print(bad)                           # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]
```

Ignore the `for` part for now. It builds three separate rows.

### What is cheap and what is slow

| Operation | Cost |
| --- | --- |
| `items[i]`, `len(items)` | O(1), instant |
| `append(x)`, `pop()` | O(1), instant |
| `insert(0, x)`, `pop(0)`, `remove(x)` | O(n), scans or shifts the list |
| `x in items`, `index(x)`, `count(x)` | O(n), scans the list |
| `sort()`, `sorted()` | O(n log n) |

**In production:** `x in items` checks every item. On a big list inside a loop, that is a slow program. Use a set for lookups, covered later.

## Tuples

### Create and read

Round brackets. You read them exactly like a list.

```python
planets = ("Mercury", "Venus", "Earth")
print(planets[0])           # Mercury
```

A tuple cannot change. There is no `append`, no `remove`, no `sort`.

```python
planets.append("Mars")      # AttributeError: 'tuple' object has no attribute 'append'
```

A one-item tuple needs a trailing comma. The comma makes the tuple, not the brackets.

```python
print(type((42)), type((42,)))    # <class 'int'> <class 'tuple'>
```

### Unpack

Split a tuple into variables in one line. Functions use this to return several values.

```python
lat, lng = (12.97, 77.59)
hours, minutes = divmod(130, 60)
print(hours, minutes)       # 2 10
```

The same trick swaps two variables.

```python
a, b = 1, 2
a, b = b, a                 # a is 2, b is 1
```

### The methods you get

A tuple has only two: `count` and `index`. The rest you already know works too.

```python
t = ("a", "b", "a")
print(t.count("a"))         # 2
print(t.index("b"))         # 1
print(len(t), "b" in t)     # 3 True
print(sorted(t))            # ['a', 'a', 'b']   sorted() returns a list
print(list(t), tuple([1, 2]))    # ['a', 'b', 'a'] (1, 2)
```

### When to use a tuple

- **A fixed record:** a coordinate, an RGB color, a database row.
- **A constant:** values nobody should change by accident.
- **A dict key:** tuples can be keys, lists cannot.

```python
ALLOWED_ROLES = ("admin", "editor")
print("editor" in ALLOWED_ROLES)                 # True
print({(12.97, 77.59): "Bengaluru"})             # {(12.97, 77.59): 'Bengaluru'}
```

**In production:** if the data should not change, make it a tuple. The language then enforces it for you.