---
layout: post
title:  "Ruby Array.new Gotcha – Why All Elements Change!"
date:   2025-08-03 11:28:41 +0530
categories: Ruby
---

Ruby can *trick you* if you’re not careful with `Array.new`.
Here’s the trap 👇

### ❌ DANGER: Same Object Reference

```ruby
arr = Array.new(3, "hi")
arr[0].upcase!
# => "HI"
arr
# => ["HI", "HI", "HI"] # All changed!
```

**Why?**
All elements point to the *same* `"hi"` string in memory.
Change one → all change.

### ✅ SAFE: Use Block Form

```ruby
arr = Array.new(3) { "hi" }
arr[0].upcase!
# => "HI"
arr
# => ["HI", "hi", "hi"] # Only first changeds
```

**Why?**
The block runs for each index, creating a *new object* each time.

### ⚡ TL;DR
- `Array.new(size, obj)` → repeats the *same object*.
- `Array.new(size) { ... }` → creates *fresh objects*.
- Use block form to avoid unexpected mutations.
