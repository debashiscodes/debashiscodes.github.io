---
layout: post
title:  "Ruby's Measuring Tape: length vs size vs count"
date:   2025-06-25 11:27:41 +0530
categories: Ruby
---
In Ruby, you’ll come across three ways to check how many things you have: `length`, `size`, and `count`. They might seem the same, but each one has its own special use.

## ✅ length
* Used with: Array, String, Hash
* Returns: Number of elements or characters
* No block allowed

```ruby
[1, 2, 3].length        # => 3
"hello".length          # => 5
{ a: 1, b: 2 }.length   # => 2
```
## ✅ size
* Used with: Array, String, Hash, etc.
* Returns: Same as length and is an alias for `length`
* No block allowed

```ruby
[1, 2, 3].size          # => 3
"world".size            # => 5
{ x: 10 }.size          # => 1
```
## ✅ count
* Used with: Array, Enumerable

* Returns:
  * Total number of elements (if no block or arg)
  * Number of elements matching a condition or argument

```ruby
[1, 2, 3].count         # => 3           (no block: same as size)
[1, 2, 3, 2].count(2)   # => 2           (counts value 2)
[1, 2, 3, 4].count { |n| n.even? }  # => 2 (counts even numbers)
```
Now you know when to use each one.
* Use `length` or `size` when you just need the number of elements.
* Use `count` when you want to count conditionally.
