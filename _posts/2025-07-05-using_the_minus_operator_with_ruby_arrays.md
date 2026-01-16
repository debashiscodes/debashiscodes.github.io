---
layout: post
title:  "Using the - Operator with Ruby Arrays"
date:   2025-07-05 11:28:41 +0530
categories: Ruby
private: true
---

Working with arrays in Ruby? Sometimes you need to remove certain items from one array based on another — like filtering out unwanted data. Ruby makes this super simple with the - operator.

In Ruby, you can use the - operator with arrays to subtract one array from another, i.e., remove elements from the first array that also exist in the second.

```ruby
array1 - array2
```
**This returns a new array with all items from array1 excluding any elements that also appear in array2.**

```ruby
a = [1, 2, 3, 4, 5]
b = [2, 4]

result = a - b
puts result
# => [1, 3, 5]
```

## What it does
It removes all matching elements based on value (not position).

Only the first array is affected.

It uses Array#uniq internally, so the result is always unique (no duplicates remain after subtraction).

```ruby
[1, 2, 2, 3] - [2]
# => [1, 3] # both 2's are removed
```

## Common Use Cases

**1. Remove blocked users:**
```ruby
all_users - blocked_users
```

**2. Exclude already selected items:**
```ruby
available_items - selected_items
```
The - operator is a clean and powerful way to subtract one array from another in Ruby. It helps you write less code while keeping your data tidy. Try using it in your next project to simplify array filtering and cleanup.
