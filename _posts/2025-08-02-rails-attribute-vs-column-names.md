---
layout: post
title:  "attribute_names vs column_names in Rails – What's the Difference?"
date:   2025-08-02 11:28:41 +0530
categories: Rails
---

They look similar… but they’re *not* the same!
Let’s break it down 👇

### 🧪 Both return arrays of strings:

```ruby
Product.attribute_names
Product.column_names
```

But the **results can differ** depending on what's defined in your model.

### 🔍 The Key Differences

| Feature              | `.attribute_names` | `.column_names` |
|----------------------|--------------------|------------------|
| DB columns           | ✅ Yes             | ✅ Yes           |
| Virtual attributes   | ✅ Yes             | ❌ No            |
| Serialized fields    | ✅ Yes             | ❌ No            |
| Schema-only fields   | ❌ No              | ✅ Yes           |

### 🎯 When to Use

- Use **`.attribute_names`** when:
  - You’ve got virtual fields (like `attr_accessor`)
  - You’re prepping data for APIs or JSON

- Use **`.column_names`** when:
  - You only care about DB columns
  - You're generating migrations or schema tools

### 🔥 Example

```ruby
class Product < ApplicationRecord
  attr_accessor :discounted_price
end

Product.attribute_names.include?("discounted_price") # => true
Product.column_names.include?("discounted_price")    # => false
```

### ⚡ TL;DR

- `.attribute_names` = full model context
- `.column_names` = just DB schema
