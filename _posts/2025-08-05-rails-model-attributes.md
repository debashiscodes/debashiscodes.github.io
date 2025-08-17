---
layout: post
title:  "The Easiest Way to Peek Inside Any Rails Model"
date:   2025-08-05 11:28:41 +0530
categories: Rails
---

Want to peek inside your model instance?
This one method shows *everything*.

### ✅ The One-Liner

```ruby
product.attributes
````

➡️ Returns a full hash of all model fields and their values:

```ruby
{
  "id"=>1,
  "name"=>"Shoes",
  "price"=>99.0,
  "created_at"=>...,
  "updated_at"=>...
}
```

### 🔍 Why It’s Useful

* Quickly inspect an object’s data
* Serialize easily to JSON or logs
* Great for debugging and dynamic APIs

### ⚡ Pro Tip

Exclude sensitive fields like this:

```ruby
product.attributes.except("created_at", "updated_at")
```

Or convert to JSON for APIs:

```ruby
product.attributes.to_json
```

### ⚡ TL;DR

| Task                    | Shortcut                     |
| ----------------------- | ---------------------------- |
| See all fields in model | `product.attributes`         |
| Exclude some fields     | `.except("created_at", ...)` |
| Convert to JSON         | `.to_json`                   |


