---
layout: post
title:  "PUT vs PATCH in Rails – What’s the REAL Difference?"
date:   2025-08-02 11:28:41 +0530
categories: Rails
private: true
---

They both update records…
But *not* the same way 👇

### 🚨 Quick Breakdown

- **PUT** = *Full* update
- **PATCH** = *Partial* update

### 🧠 In Rails terms…

| Action              | Request Type | Behavior                              |
|--------------------|--------------|----------------------------------------|
| `update (full)`    | `PUT`        | Replaces the **entire** record        |
| `update (partial)` | `PATCH`      | Changes only **specific** attributes  |

### 🔧 Example

```http
PUT /products/1
{
  "name": "New Name",
  "price": 99,
  "category": "Books"
}
# All attributes must be sent!

PATCH /products/1
{
  "price": 99
}
# Just updates one field 🧼
```

### 🧪 What Rails Does

- Both hit the `update` method in your controller:

```ruby
def update
  if @product.update(product_params)
    redirect_to @product
  else
    render :edit
  end
end
```

- But the **HTTP verb** tells the intent:
  - `PUT` = Replace all
  - `PATCH` = Update parts

### 🎯 When to Use

- Use `PUT` if you want to **overwrite the whole object**
- Use `PATCH` for **lightweight updates**

### ⚡ TL;DR

- **PUT**: Full update – replaces the whole record ✅
- **PATCH**: Partial update – tweaks only what you send ✂️
- Both go through the same controller method in Rails (`update`)
- Pick the right verb for the right job 💪

