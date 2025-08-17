---
layout: post
title:  "Single vs Double Quotes in Ruby: When to Use What?"
date:   2025-04-17 11:28:41 +0530
categories: Ruby
---
Strings in Ruby can be written using either `single quotes`('this is a string') or `double quotes`("this is also a string") — but they don't work exactly the same.

In this post, we'll break it down so you know when to use which and why it matters.

## Rule of Thumb
* `Use double quotes` (") when:

  * You need interpolation or escape sequences like \n, \t, etc.

* `Use single quotes` (') when:

  * You just want a plain, literal string and no special processing is needed.

## Example

* Interpolation

```ruby
name = "Ruby"

puts "Hello, #{name}!"  # => Hello, Ruby!
puts 'Hello, #{name}!'  # => Hello, #{name}!
```

* Escape Sequences

```ruby
puts "Line1\nLine2"  # => Line1
                     #    Line2

puts 'Line1\nLine2'  # => Line1\nLine2
```

* Performance

Double-quoted strings are `slightly slower` than single-quoted strings because they require `extra parsing`.

## Benchmark Example
Let’s benchmark both using Ruby’s `Benchmark` module:

```ruby
require 'benchmark'

n = 1_000_000

Benchmark.bm(15) do |x|
  x.report("Double quotes:") { n.times { "Hello world" } }
  x.report("Single quotes:") { n.times { 'Hello world' } }
end
```

#### Output (may vary by machine):
```ruby
                    user     system      total        real
Double quotes:     0.085000   0.000000   0.085000 (  0.084956)
Single quotes:     0.080000   0.000000   0.080000 (  0.080123)
```
Single quotes can be a tiny bit faster since Ruby skips checking for interpolation or special characters.

The difference is usually less than 5%—so while it’s good to know, it rarely affects everyday coding.
