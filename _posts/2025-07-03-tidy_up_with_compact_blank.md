---
layout: post
title:  "Tidy Up with compact_blank"
date:   2025-07-03 11:28:41 +0530
categories: Ruby
private: true
---
Introduced in Rails 6.1, `compact_blank` is an Rails ActiveSupport method that removes all blank values (like nil, empty strings, or whitespace) from Arrays, Hashes, and other Enumerable objects.

## Where does it come from?
It’s not part of plain Ruby — it comes from Rails’ ActiveSupport::CoreExtensions. Rails extends core Ruby classes to add handy utility methods like this.

You need to ensure ActiveSupport is loaded — in a Rails app, it always is.

```ruby
["Bhubaneswar", nil, "Pune", " ", "Hyderabad", "", "Berlin"].compact
# => ["Bhubaneswar", "Pune", "Berlin", " ", "", "Hyderabad"]

["Bhubaneswar", nil, "Pune", " ", "Hyderabad", "", "Berlin"].compact_blank
# => ["Bhubaneswar", "Pune", "Berlin", "Hyderabad"]

{name: "Debashis", address: nil, age: ""}.compact_blank
# => {name: "Debashis"}
```
## When should you use compact_blank?
**Use Case 1: Cleaning up form input data**

When users submit forms with optional fields, some values might be blank strings or whitespace.

```ruby
params[:tags] = ["ruby", "", "rails", "  ", nil]

# Before saving to DB or processing
clean_tags = params[:tags].compact_blank
# => ["ruby", "rails"]
```

**Use Case 2: API payload sanitization**

When working with JSON or external APIs:

```ruby
data = {
  name: "Debashis",
  bio: "",
  email: nil,
  location: " "
}

data.compact_blank
# => { name: "Debashis" }
```
**Use Case 3: Chaining for elegant one-liners**
```ruby
user_input.split(",").map(&:strip).compact_blank
```
This is cleaner than manually rejecting blank strings or checking for .nil?.

Rails adds compact_blank to Arrays, Hashes, ActiveSupport::HashWithIndifferentAccess, and any Enumerable that includes ActiveSupport extensions.

Whether you're tidying up arrays, hashes, or any enumerable in Rails, reach for compact_blank and let Rails do the heavy lifting.
