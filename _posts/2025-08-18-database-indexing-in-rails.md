---
layout: post
title:  "Database Indexing in Rails (or: Why your queries are slow and what to do about it)"
date:   2025-08-18 11:28:41 +0530
categories: Rails
private: true
---

That moment when your app suddenly feels like molasses...

So there's this Rails app that worked great in development. 100 users, lightning fast. Then it hits production with 10,000 users and suddenly every page takes 5+ seconds to load. Database CPU is pegged at 100%. Users are complaining.

The culprit? A simple `User.where(email: params[:email])` query that worked fine with 50 test users but becomes a nightmare when scanning through 100,000 records one by one.

That's when someone mentions "indexing" and suddenly everything clicks.

### **1.** What database indexing actually is (library book analogy)

Imagine you're in a huge library looking for a book about "Ruby programming." Without an index (catalog system), you'd have to check every single book on every shelf. That could take hours.

With an index, you look up "Ruby programming" in the catalog, and it tells you exactly which shelf and section to check. Boom - book found in 30 seconds.

Database indexes work the same way. Instead of scanning every row in a table, the database uses the index to jump straight to the relevant records.

### **2.** The PostgreSQL index types that actually matter

#### `B-Tree Index (the workhorse)`
This is the default and handles 95% of your needs:

```ruby
# Rails migration
add_index :users, :email
add_index :posts, :user_id
```
**What it's good for:** Equality searches, range queries, sorting
**Example queries it speeds up:**
- `User.where(email: 'john@example.com')`
- `Post.where(user_id: 123)`
- `Order.where(created_at: 1.week.ago..Time.current)`

#### `Partial Index (the selective one)`
Only indexes rows that meet certain conditions:

```ruby
# Only index active users
add_index :users, :email, where: "active = true"

# Only index published posts
add_index :posts, :created_at, where: "status = 'published'"
```

**Why it's clever:** Smaller index, faster queries for common cases
**When to use:** When you mostly query a subset of records

#### `Unique Index (the enforcer)`
Prevents duplicate values and speeds up lookups:

```ruby
# Automatically creates unique index
add_index :users, :email, unique: true

# Composite unique index
add_index :user_profiles, [:user_id, :profile_type], unique: true
```

**Bonus:** Rails validates uniqueness at the application level, but unique indexes enforce it at the database level too.

#### `GIN Index (the full-text search hero)`
Perfect for JSON columns and full-text search:

```ruby
# For JSONB columns
add_index :products, :metadata, using: 'gin'

# For full-text search
add_index :articles, :title, using: 'gin', opclass: :gin_trgm_ops
```

**Use case:** When you're searching inside JSON data or doing complex text searches

### **3.** How to add indexes in Rails (the right way)

#### Basic single column index
```ruby
class AddIndexToUsersEmail < ActiveRecord::Migration[7.0]
  def change
    add_index :users, :email
  end
end
```

#### Composite index (order matters!)
```ruby
# For queries like: Post.where(user_id: 123, status: 'published')
add_index :posts, [:user_id, :status]

# NOT the same as:
add_index :posts, [:status, :user_id]  # Different order!
```

#### Concurrent index creation (for large tables)
```ruby
class AddIndexConcurrently < ActiveRecord::Migration[7.0]
  disable_ddl_transaction!

  def change
    add_index :large_table, :some_column, algorithm: :concurrently
  end
end
```

**Why concurrent:** Doesn't lock the table during creation (crucial for production)

### **4.** How to know when you need an index

#### The obvious signs
- Queries taking more than 200ms consistently
- High database CPU usage
- Users complaining about slow pages
- Your monitoring showing database as the bottleneck

#### The detective work
```ruby
# Enable query logging in development
# config/environments/development.rb
config.log_level = :debug

# Look for queries like this in your logs:
# User Load (2000.0ms) SELECT "users".* FROM "users" WHERE "users"."email" = $1
```

#### Use EXPLAIN (your best friend)
```sql
-- In Rails console
User.where(email: 'test@example.com').explain

-- Raw SQL
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

**What to look for:**
- "Seq Scan" = bad (scanning entire table)
- "Index Scan" = good (using an index)
- High "cost" numbers = probably need an index

#### The gem that does the detective work
```ruby
# Gemfile
gem 'bullet', group: :development

# Finds missing indexes automatically
# Shows notifications when queries would benefit from indexes
```

### **5.** When to remove indexes (yes, this is a thing)

#### Indexes you probably don't need
```ruby
# Remove unused indexes
remove_index :table_name, :rarely_queried_column

# Remove redundant indexes
# If you have these two:
add_index :posts, :user_id
add_index :posts, [:user_id, :created_at]
# The first one is redundant (composite index covers it)
```

#### Signs an index should go
- Table has tons of writes but few reads
- Index is never used (check with database stats)
- Too many indexes on one table (slowing down writes)

#### Finding unused indexes
```sql
-- PostgreSQL query to find unused indexes
SELECT
  schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

### **6.** The Rails developer's indexing checklist

#### Always index these
```ruby
# Foreign keys (Rails doesn't do this automatically!)
add_index :posts, :user_id
add_index :comments, :post_id

# Fields you use in WHERE clauses
add_index :users, :email
add_index :posts, :status

# Fields you ORDER BY frequently
add_index :posts, :created_at
```

#### Think twice about indexing these
```ruby
# Boolean columns (usually not worth it)
add_index :users, :active  # Probably skip this

# Columns that change frequently
add_index :posts, :view_count  # Gets updated constantly

# Very short tables
add_index :settings, :key  # If you only have 10 settings
```

### **7.** The performance impact (real numbers)

#### Query speed improvements
- **No index:** 5000ms for 100k records
- **With index:** 5ms for the same query
- **Improvement:** 1000x faster (seriously)

#### Write performance impact
- **Each index:** ~10-30% slower INSERTs/UPDATEs
- **10 indexes on a table:** INSERTs can be 3x slower
- **Sweet spot:** 3-5 indexes per table max

### **8.** Common indexing mistakes Rails developers make

#### The "index everything" approach
```ruby
# DON'T do this
add_index :users, :first_name
add_index :users, :last_name
add_index :users, :phone
add_index :users, :address
add_index :users, :city
# ... 15 more indexes
```

More indexes ≠ faster app. Each index has a cost.

#### Wrong composite index order
```ruby
# If you mostly query: Post.where(user_id: 123)
# Sometimes query: Post.where(user_id: 123, status: 'published')

# RIGHT:
add_index :posts, [:user_id, :status]

# WRONG:
add_index :posts, [:status, :user_id]
```

**Rule:** Most selective column first, or most commonly queried column first.

#### Forgetting about concurrent creation
```ruby
# DON'T do this on a production table with millions of rows
add_index :huge_table, :some_column

# DO this instead
add_index :huge_table, :some_column, algorithm: :concurrently
```

### **9.** The indexing strategy that actually works

#### Start with the basics
1. **Index all foreign keys** (Rails doesn't do this automatically)
2. **Index fields in your WHERE clauses**
3. **Index fields you ORDER BY**
4. **Stop there** until you have performance problems

#### Measure before optimizing
```ruby
# Use tools like:
# - New Relic or DataDog for production monitoring
# - Bullet gem for development
# - Database slow query logs
# - EXPLAIN ANALYZE for specific queries
```

#### Optimize iteratively
1. Find the slowest queries
2. Add indexes to speed them up
3. Monitor the impact
4. Repeat

### **10.** The pros and cons reality check

#### Pros (why you need them)
- **Massive query speedups** (1000x faster is common)
- **Better user experience** (pages load fast)
- **Lower database CPU** (less work scanning tables)
- **Happier users and developers**

#### Cons (the hidden costs)
- **Slower writes** (every INSERT/UPDATE must update indexes)
- **Storage overhead** (indexes take disk space)
- **Maintenance complexity** (more stuff to think about)
- **Diminishing returns** (10th index helps way less than 1st)

### ⚡ TL;DR

Most Rails apps are under-indexed rather than over-indexed. Start by indexing foreign keys and commonly queried fields. Use tools to find slow queries, then add indexes strategically.

Don't guess - measure. Don't optimize prematurely, but don't ignore obvious wins either.

**Golden rule:** If you're querying it in a WHERE clause or ORDER BY, and it's not already indexed, you probably need an index.

*P.S. - The Rails apps with the best performance are usually the ones with 3-5 well-chosen indexes per table, not the ones with 20 indexes per table. Quality over quantity wins every time.*
