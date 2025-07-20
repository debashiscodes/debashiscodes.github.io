---
layout: post
title:  "each in Ruby: Not Just a Loop, It’s a Language Powerhouse"
date:   2025-07-18 11:28:41 +0530
categories: Ruby
---

In Ruby, each is one of the first things every developer learns — and it quickly becomes one of the most used tools in their toolkit.
At first, it seems like a basic way to loop through arrays or hashes.
But there's more to it: under the hood, each is a clever and powerful feature that Ruby uses to make iteration flexible and elegant.

## How It Works (Custom Implementation)

To really understand how each works, let’s take a look at how we might build our own version of it. We'll add a method called my_each to the Array class that behaves just like the real each.

```ruby
class Array
  def my_each
    i = 0
    while i < self.length
      yield(self[i])  # This sends the current item to the block
      i += 1
    end
  end
end

[1, 3, 7, 56].my_each { |number| puts "The number is #{number}" }
```
Here, yield is the magic that hands control to the block — just like Ruby does internally.
It processes each item one by one and lets the block decide what to do with it.

## Conclusion
As you can see, each is more than just a looping tool — it’s how Ruby hands over control to blocks and powers other features like map, select, and more.
By building your own version, you get a peek into how iteration really works in Ruby.
So the next time you use each, remember — you're working with one of Ruby's most important features!
