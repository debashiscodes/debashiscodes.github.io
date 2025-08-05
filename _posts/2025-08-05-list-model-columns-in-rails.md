---
layout: post
title:  "Rails Trick: List All Columns in One Line"
date:   2025-07-29 11:28:41 +0530
categories: Rails
---

Need to see all columns of a model?
Stop guessing. Just run this one line. 👇

### ✅ The One-Liner

```ruby
Product.column_names
````

➡️ Returns an array of all column names as strings:

```ruby
["id", "name", "price", "created_at", "updated_at"]
```

Perfect for introspection, debugging, or dynamic UI.

### 🔍 Why It’s Useful

* Dynamically build forms or tables
* Quickly check schema without `rails db`
* Use in admin dashboards, seed scripts, or logs

### ⚡ Pro Tip

Want to exclude Rails metadata fields?

```ruby
Product.column_names - ["id", "created_at", "updated_at"]
```

Clean and ready for custom display.

### 🧾 TL;DR

| Task                       | Shortcut                         |
| -------------------------- | -------------------------------- |
| Get model’s columns        | `Model.column_names`             |
| Exclude default timestamps | `- ["created_at", "updated_at"]` |
