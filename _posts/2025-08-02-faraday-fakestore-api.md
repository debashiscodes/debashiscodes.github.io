---
layout: post
title:  "Making API Requests with Faraday in Ruby"
date:   2025-08-02 11:28:41 +0530
categories: Ruby
private: true
---

If you're tired of `Net::HTTP`, give **Faraday** a try 👇

### What is Faraday?

A flexible HTTP client with middleware support, retries, logging, and more.
Perfect for serious API clients. 💪

### GET Products from Fake Store API

```ruby
require 'faraday'
require 'json'

conn = Faraday.new(url: 'https://fakestoreapi.com')
res = conn.get('/products')

products = JSON.parse(res.body)
puts products.first["title"]
```

You just made a real API call, parsed JSON, and printed a product title.

### Why Use Faraday?

| Feature        | Faraday        |
|----------------|----------------|
| Easy setup     | ✅ Yes         |
| JSON parsing   | ✅ Easy w/ `json` |
| Middleware     | ✅ Built-in     |
| Reusability    | ✅ Connections |

### ⚙️ Bonus: Add Middleware

```ruby
Faraday.new(url: 'https://fakestoreapi.com') do |f|
  f.response :logger     # Log requests
  f.adapter Faraday.default_adapter
end
```

🧠 Logging, retries, timeouts — Faraday handles it all.

### ⚡ TL;DR

- Faraday = clean + powerful HTTP client
- Use it for APIs that need more than just GETs
- Add middleware like a pro
