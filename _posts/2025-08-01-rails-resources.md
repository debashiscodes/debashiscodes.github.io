---
layout: post
title:  "Rails Magic: `resources :products` – What Does It Really Do"
date:   2025-08-01 11:28:41 +0530
categories: Rails
---

Write one line… get **8 routes** for free? 😮
That’s the *Rails way*. Let’s break it down 👇

### What this does:

```ruby
resources :products
```

Creates **all RESTful routes** for `Product` – instantly!

### What routes you get:

| HTTP Verb | Path             | Controller#Action | Purpose               |
|-----------|------------------|-------------------|------------------------|
| GET       | `/products`      | `index`           | List all products      |
| GET       | `/products/new`  | `new`             | Form to add new        |
| POST      | `/products`      | `create`          | Save new product       |
| GET       | `/products/:id`  | `show`            | View one product       |
| GET       | `/products/:id/edit` | `edit`        | Form to edit           |
| PUT       | `/products/:id`  | `update`          | Save edits             |
| PATCH     | `/products/:id`  | `update`          | Save edits             |
| DELETE    | `/products/:id`  | `destroy`         | Delete product         |

### Why it's awesome

- Follows **REST conventions**
- Keeps code **clean & predictable**
- Works with Rails helpers like:

```erb
<%= link_to 'Edit', edit_product_path(product) %>
```

### ⚡ TL;DR

- `resources :products` = 8 routes in 1 line
- Follows RESTful architecture
- Auto-connects routes to your controller methods
- Rails does the heavy lifting – you write less, build more
