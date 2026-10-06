---
layout: post
title:  "Ruby’s 4 Shades of Equality – Learn to Compare Like a Pro"
date:   2025-04-13 11:27:41 +0530
categories: ruby
private: true
---
Ever wondered why ==, ===, eql?, and equal? all exist in Ruby?
They look similar but behave very differently — and using the wrong one could cause subtle bugs.

### 🔸 == Value Equality

Compares what’s inside. If values look the same, it returns true.
```ruby
5 == 5         # true
[1, 2] == [1, 2]  # true
```
Use when comparing data, strings, numbers, arrays, etc.

### 🔸 === Case Equality

Used in case statements. Matches based on type or pattern.
```ruby
String === "Hello"  # true
(1..10) === 5       # true
```
Use when writing clean, readable case blocks.

### 🔸 eql? Value + Type Equality

Stricter than ==. Checks both value and data type.
```ruby
5 == 5.0        # true
5.eql?(5.0)     # false
```
Use inside Hashes for precise key matching.

### 🔸 equal? Object Identity
Checks if two variables point to the same object in memory.
```ruby
a = "hello"
b = "hello"
a.equal?(b)    # false

c = a
a.equal?(c)    # true
```
Use when identity matters (rarely needed in daily Rails code).

### ⚡ TL;DR

| Method      | What It Checks             | Common Use            |
|-------------|----------------------------|------------------------|
| `==`        | Same value                 | Most comparisons       |
| `===`       | Pattern / type match       | `case` statements      |
| `eql?`      | Same value & type          | Hash keys              |
| `equal?`    | Same object (memory ID)    | Rare, object identity  |
