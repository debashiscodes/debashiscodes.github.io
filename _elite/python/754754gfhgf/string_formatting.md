---
title: String Formatting
chapter: 5
---
Real programs turn data into text all day: order messages, invoice numbers, log lines. This chapter is how you do that cleanly.

## Numbers and strings do not mix

Python will not join a string and a number with `+`.

```python
order_id = 1042
print("Order #" + order_id)
# TypeError: can only concatenate str (not "int") to str
```

Convert the number first with `str()`.

```python
print("Order #" + str(order_id))    # Order #1042
```

It works, but it gets ugly fast. There are better tools.

## format()

`.format()` fills each `{}` in the string with the values you give it, in order.

```python
print("Hello, {}! Your order #{} has shipped.".format("Asha", 1042))
# Hello, Asha! Your order #1042 has shipped.
```

You can name the slots, so the order stops mattering.

```python
print("Hello, {name}! Order #{order_id} has shipped.".format(name="Asha", order_id=1042))
# Hello, Asha! Order #1042 has shipped.
```

**In production:** use `.format()` only when the template lives somewhere else, like a config file or a database row. Otherwise use an f-string.

## f-strings

Put an `f` before the quote and write variables straight into the text. This is the modern way, and the one you should reach for first.

```python
name = "Asha"
order_id = 1042
print(f"Hello, {name}! Order #{order_id} has shipped.")
# Hello, Asha! Order #1042 has shipped.
```

No `str()`, no positions, nothing to line up.

## Calculations inside f-strings

Anything Python can evaluate works inside the braces: math, method calls, anything.

```python
price = 499
qty = 3
print(f"Total: {price * qty}")           # Total: 1497
```

```python
name = "tom"
print(f"Welcome, {name.capitalize()}!")   # Welcome, Tom!
```

`capitalize()` makes the first letter a capital, so `tom` becomes `Tom`.

For quick debugging, add `=` after the name. It prints the name and the value.

```python
print(f"{price=}")                        # price=499
```

## Format numbers

After the value, add `:` and a format code.

**Pad with zeros.** `04d` means: an integer (`d`), at least 4 wide (`4`), filled with zeros (`0`). It is how you print `0900` hours or an invoice number.

```python
print(f"{900:04d} hours")                 # 0900 hours
print(f"INV-{42:05d}")                    # INV-00042
```

**Money.** `,` adds thousands separators, and `.2f` gives exactly two decimals.

```python
total = 1497.5
print(f"Total: ${total:,.2f}")            # Total: $1,497.50
```

**In production:** never build a SQL query or a shell command with an f-string. User input goes straight into it.

```python
user_id = "1 OR 1=1"
print(f"SELECT * FROM users WHERE id = {user_id}")
# SELECT * FROM users WHERE id = 1 OR 1=1
```

That query returns every user. Use your database library's query parameters instead.