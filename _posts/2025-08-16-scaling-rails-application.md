---
layout: post
title:  "Scaling Rails: The Playbook for High-Traffic Apps"
date:   2025-08-16 11:28:41 +0530
categories: Rails
---

Imagine You’re Running a Restaurant

### 📈⬆️🖥️ Vertical Scaling = Making Your Chef Faster

Imagine you have one super-talented chef in the restaurant. When you get more customers:

**Vertical Scaling** means making that one chef work faster:
- Better knives (**faster CPU**)
- More burners on the stove (**more memory**)
- Assistant to prep ingredients (**more threads**)
- Bigger workspace (**bigger server**)

**Limits:** Even the world's best chef can only cook so many meals per hour. There's a physical limit.

### 📊↔️🖥️🖥️🖥️ Horizontal Scaling = Hiring More Chefs

**Horizontal Scaling** means hiring more chefs:
- Chef #1 → tables 1–10
- Chef #2 → tables 11–20
- Chef #3 → tables 21–30

**Benefits:** Theoretically unlimited — hire more chefs!
**Challenges:** You need a head waiter (**load balancer**) to direct customers.

## 👥 Scaling Stages

### 🍽️ 0–1,000 Users: Single Chef Restaurant

**What you have:** One server running both Nginx and Puma

```ruby
# config/puma.rb - Your "single chef"
workers 1
threads 5, 5
```

**When to upgrade:** When CPU hits 80%+ consistently.

### 💪 1,000–5,000 Users: Super Chef (Vertical Scaling)

**What you do:** Make your single chef more powerful.

```ruby
# config/puma.rb
workers 4
threads 5, 10
preload_app!
```

**Impact:**

* Before: `1 × 5 = 5` concurrent users
* After: `4 × 10 = 40` concurrent users

### 🏢 5,000–20,000 Users: Multiple Chef Locations (Horizontal Scaling)

**What you do:** Open multiple restaurant locations.

```yaml
# docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"

  app1:
    build: .
    environment:
      - PUMA_WORKERS=4

  app2:
    build: .
    environment:
      - PUMA_WORKERS=4

  app3:
    build: .
    environment:
      - PUMA_WORKERS=4
```

**Impact:**

* Before: `40 concurrent users` (1 server)
* After: `120 concurrent users` (3 servers)

### 🌍 20,000+ Users: Restaurant Chain (Advanced Horizontal)

**What you do:** Build a restaurant empire.

```nginx
# nginx.conf
upstream restaurants {
    least_conn;
    server app1:3000 weight=3;
    server app2:3000 weight=2;
    server app3:3000 weight=2;
    server app4:3000 weight=3;
    server app5:3000 weight=2;
}
```

## 🌳 The Decision Tree

```
Are you at capacity?
├─ No → Monitor & optimize
├─ Yes → Is your server maxed out?
   ├─ No → VERTICAL (more workers, threads, RAM, CPU)
   └─ Yes → HORIZONTAL (add servers + load balancer)
```

## 📊 Real Numbers: What Each User Count Means

### 👥 1,000 Users

* Concurrent: \~50–100
* RPS: \~10–20
* Setup: \$20/month server
* Puma: 2 workers × 5 threads

### 👥 5,000 Users

* Concurrent: \~250–500
* RPS: \~50–100
* Setup: \$80/month server
* Puma: 4 workers × 8 threads

### 👥 20,000 Users

* Concurrent: \~1,000–2,000
* RPS: \~200–400
* Setup: 3 servers + load balancer (\~\$300/month)
* Puma: 4 workers × 8 threads per server

### 👥 100,000 Users

* Concurrent: \~5,000–10,000
* RPS: \~1,000–2,000
* Setup: 10+ servers + auto-scaling + CDN
* Extras: DB replicas, Redis cluster, monitoring

## 💰 Cost Reality

### Vertical Scaling

* 1,000 users → \$20/mo
* 5,000 users → \$80/mo
* 10,000 users → \$200/mo
* 15,000 users → Impossible!

### Horizontal Scaling

* 10,000 users → \$150/mo (3 servers)
* 20,000 users → \$300/mo (6 servers)
* 100,000 users → \$1,500/mo (30 servers)
* ∞ users → Just add more servers

## 🏆 The Golden Rules

1. **Start Vertical** — simpler to manage one big server.
2. **Go Horizontal When You Hit the Wall** — multiply servers.
3. **Monitor Before You Scale** — don’t guess, measure.
4. **Database = Real Bottleneck** — optimize DB, cache, and CDN first.

## ⚡ TL;DR

* 🧑‍🍳 One chef = vertical scaling
* 👨‍🍳👩‍🍳 Many chefs = horizontal scaling
* 💡 Optimize first, scale when needed
* 📊 Most Rails apps run fine with vertical scaling up to 20k users
