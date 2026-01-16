---
layout: post
title:  "Difference Between 'Gemfile' and 'Gemfile.lock'"
date:   2025-08-05 11:28:41 +0530
categories: Ruby
private: true
---

Think Shopping List as Gemfile and Receipt as Gemfile.lock
- **`Gemfile`** → Shopping list: *“I need milk, bread, and coffee”*
- **`Gemfile.lock`** → Receipt: *“2% milk, Farm Fresh Dairy, batch #12345, bought on March 15th at $3.99”*

👉 List = *what you want*.

👉 Receipt = *exactly what you got*.

### Basic Understanding
**Gemfile** → Declares what gems your app needs:

```ruby
gem 'rails', '~> 7.0'
gem 'pg', '>= 0.18'
gem 'redis'
```

**Gemfile.lock** → Auto-generated snapshot of **exact versions + dependencies** actually installed.

### How They Work Together

When you run `bundle install`:

1. Bundler reads `Gemfile`.
2. Finds matching versions.
3. Installs them.
4. Writes exact versions to `Gemfile.lock`.

### Advanced Details

#### Version Constraints in `Gemfile`

```ruby
gem 'rails', '~> 7.0.4'     # >= 7.0.4, < 7.1.0
gem 'pg', '>= 0.18'         # At least version 0.18
gem 'redis'                 # Any version
gem 'bootsnap', require: false
```

#### Inside `Gemfile.lock`

```
GEM
  remote: https://rubygems.org/
  specs:
    actioncable (7.0.4.2)
      actionpack (= 7.0.4.2)
      activesupport (= 7.0.4.2)
```

### Both Matter

* **Consistency** → Same gems for all devs.
* **Reliability** → Matches production exactly.
* **Security** → Prevents silent, risky updates.

### What Happens During `bundle install`

1. Parse `Gemfile` → build dependency graph.
2. Pick versions (conflict resolution).
3. Check/update `Gemfile.lock`.
4. Install gems.
5. Update lockfile with exact versions + dependencies.

### Best Practices

* Always **commit `Gemfile.lock`** to git.
* Use **`bundle install`** daily (respects lockfile).
* Use **`bundle update`** only when upgrading gems.

### ⚡ TL;DR

* **Gemfile** → What you want.
* **Gemfile.lock** → What you actually got.
* Together → **Consistency + Reliability in Rails apps**.
