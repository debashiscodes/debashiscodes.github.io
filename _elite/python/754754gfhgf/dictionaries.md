---
title: Dictionaries
chapter: 9
---
A dictionary stores key-value pairs. You look things up by name, not by position. Every API response, config file and database row you meet in real code is a dictionary.

## Create one

Curly brackets, `key: value`, separated by commas.

```python
user = {"name": "Asha", "email": "asha@x.com", "plan": "pro"}
```

You can also call `dict()`, but the brackets are what everyone writes.

```python
print(dict(name="Asha", plan="pro"))    # {'name': 'Asha', 'plan': 'pro'}
```

Items stay in the order you put them in.

**Keys must be values that cannot change:** strings, numbers or tuples. A list cannot be a key.

```python
{[1, 2]: "x"}       # TypeError: unhashable type: 'list'
```

## Read a value

Put the key in square brackets.

```python
print(user["name"])             # Asha
```

If the key does not exist, you get an error.

```python
user["phone"]                   # KeyError: 'phone'
```

`.get()` returns `None` instead of crashing. Give it a second value and it returns that when the key is missing.

```python
print(user.get("phone"))            # None
print(user.get("plan", "free"))     # pro        the key exists, so its value wins
print(user.get("phone", "not set")) # not set
```

**In production:** use `[]` when the key must be there. A crash tells you something is wrong. Use `.get()` when the key is truly optional. Do not put `.get()` everywhere. It hides bugs.

## Check for a key

`in` checks the keys, not the values.

```python
print("email" in user)          # True
print("phone" in user)          # False
```

## Add and change

Assign to a key. If the key is new, it is added. If it exists, its value is replaced.

```python
user["phone"] = "98000"         # added
user["plan"] = "team"           # replaced
```

## Remove

`del` removes a key.

```python
del user["phone"]
```

`.pop()` removes it and gives the value back. Pass a second value to avoid a `KeyError` on a missing key.

```python
plan = user.pop("plan")
print(plan)                     # team
print(user.pop("zzz", None))    # None        no crash
```

## Loop

`.items()` gives each key and value together.

```python
user = {"name": "Asha", "email": "asha@x.com", "plan": "pro"}
for key, value in user.items():
    print(key, value)
# name Asha
# email asha@x.com
# plan pro
```

`.keys()` and `.values()` give just one side.

```python
print(list(user.keys()))        # ['name', 'email', 'plan']
print(list(user.values()))      # ['Asha', 'asha@x.com', 'pro']
```

**In production:** do not add or remove keys while looping over a dictionary.

```python
d = {"a": 1, "b": 2}
for k in d:
    del d[k]                    # RuntimeError: dictionary changed size during iteration
```

## Merge

`.update()` copies the second dictionary into the first. Same keys: the second one wins.

```python
defaults = {"theme": "dark", "lang": "en"}
overrides = {"lang": "hi", "beta": True}
defaults.update(overrides)
print(defaults)                 # {'theme': 'dark', 'lang': 'hi', 'beta': True}
```

To keep both originals, use `|` (Python 3.9 and newer). It builds a new dictionary.

```python
merged = defaults | overrides
```

This is how settings work: defaults first, then the user's overrides on top.

## Nested dictionaries

Values can be anything, including lists and other dictionaries. JSON from an API looks exactly like this.

```python
order = {"id": 1042, "customer": {"name": "Asha"}, "items": ["Eggs", "Bread"]}
print(order["customer"]["name"])                    # Asha
print(order.get("customer", {}).get("city"))        # None      safe, even if "customer" is missing
```

## Counting

The most common use in real code: count how often something appears.

```python
counts = {}
for word in ["spam", "ham", "spam", "eggs", "spam"]:
    counts[word] = counts.get(word, 0) + 1
print(counts)                   # {'spam': 3, 'ham': 1, 'eggs': 1}
```

`counts.get(word, 0)` means "the current count, or 0 if this is the first time".

## Lookup is fast

Finding a key takes the same time whether the dictionary has ten items or ten million. Interview problems use this all the time. This one finds two numbers that add up to 9.

```python
seen = {}
for i, n in enumerate([2, 7, 11, 15]):
    if 9 - n in seen:
        print(seen[9 - n], i)   # 0 1
    seen[n] = i
```

For each number, it asks the dictionary "have I already seen the partner?". One pass, no inner loop.