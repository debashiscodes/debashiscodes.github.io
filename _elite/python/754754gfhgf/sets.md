---
title: Sets
chapter: 8
---
A set is a collection with no duplicates and no order. You use it for two things: removing duplicates, and asking "is this in there?" very fast.

## Create a set

`set()` takes a list and keeps each value once.

```python
emails = ["asha@x.com", "ravi@x.com", "asha@x.com", "meena@x.com", "ravi@x.com"]
unique = set(emails)
print(len(emails), len(unique))     # 5 3
```

You can also write one with curly brackets.

```python
roles = {"admin", "editor", "viewer"}
```

One trap: empty curly brackets make a dict, not a set. For an empty set, call `set()`.

```python
print(type({}), type(set()))        # <class 'dict'> <class 'set'>
```

## No order

A set does not remember the order you put things in, so you cannot ask for the first item. When you need the items in order, use `sorted()`. It returns a new sorted list.

```python
print(sorted({"pear", "apple", "mango"}))    # ['apple', 'mango', 'pear']
```

## Add and remove

`add` puts a value in. If it is already there, nothing happens.

```python
tags = {"python", "ai"}
tags.add("rag")
tags.add("ai")                      # already there, ignored
print(sorted(tags))                 # ['ai', 'python', 'rag']
```

`remove` takes a value out, but crashes if it is missing.

```python
tags.remove("rag")
tags.remove("zzz")                  # KeyError: 'zzz'
```

**In production:** use `discard` when the value may not be there. It does the same job without the crash.

```python
tags.discard("zzz")                 # no error
```

## Fast lookup

This is the real reason sets exist. Checking `x in a_list` reads the whole list. Checking `x in a_set` takes about the same time no matter how big the set is.

```python
blocked = {"spam@x.com", "bot@x.com"}
print("bot@x.com" in blocked)       # True
```

**In production:** if you check membership many times, or the data is big, turn the list into a set first. On a list of 100,000 items, a set lookup is thousands of times faster.

## Compare two sets

Two people and their skills.

```python
asha = {"python", "sql", "docker"}
ravi = {"python", "aws", "docker", "go"}
```

**Common to both:** `intersection`.

```python
print(sorted(asha.intersection(ravi)))      # ['docker', 'python']
```

**In the first, not in the second:** `difference`. Order matters.

```python
print(sorted(asha.difference(ravi)))        # ['sql']
print(sorted(ravi.difference(asha)))        # ['aws', 'go']
```

**Everything from both:** `union`. It returns a new set.

```python
print(sorted(asha.union(ravi)))             # ['aws', 'docker', 'go', 'python', 'sql']
```

**In one but not both:** `symmetric_difference`.

```python
print(sorted(asha.symmetric_difference(ravi)))   # ['aws', 'go', 'sql']
```

Each has a short operator form: `&` for intersection, `-` for difference, `|` for union and `^` for symmetric difference.

```python
print(sorted(asha & ravi))                  # ['docker', 'python']
```

## union vs update

`union` returns a new set and leaves both originals alone. `update` changes the first set in place.

```python
a = {1, 2}
b = {2, 3}
print(sorted(a.union(b)), sorted(a))        # [1, 2, 3] [1, 2]
a.update(b)
print(sorted(a))                            # [1, 2, 3]
```

## Subsets

`issubset` asks: is every item of the first set inside the second? It returns `True` or `False`. It is how you check that someone has all the permissions they need.

```python
needed = {"read", "write"}
granted = {"read", "write", "delete"}
print(needed.issubset(granted))             # True
print(granted.issubset(needed))             # False
```

The short form is `<=`.

```python
print(needed <= granted)                    # True
```

## What can go in a set

Only values that cannot change: numbers, strings, tuples. A list cannot go in.

```python
{[1, 2]}                            # TypeError: unhashable type: 'list'
```

Use a tuple instead. It is also how you store pairs, like coordinates.

```python
print({(1, 2), (3, 4)} == {(3, 4), (1, 2)})    # True
```

**In production:** a set loses the order. To remove duplicates and keep the order, use `dict.fromkeys`.

```python
print(list(dict.fromkeys(emails)))
# ['asha@x.com', 'ravi@x.com', 'meena@x.com']
```