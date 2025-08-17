---
layout: post
title:  "Meet the Parameters, Beat the Confusion"
date:   2025-07-04 11:28:41 +0530
categories: Ruby
---
When you define a method in Ruby, you usually need to pass in some data — like a name, a number, or even a list or hash. That’s where parameters and arguments come into play.

## Parameter vs Argument — What’s the Difference?

**Parameter:** The placeholder in a method definition

```ruby
def greet(name) # ← name is a parameter
  puts "Hello, #{name}!"
end
```
**Argument:** The actual value you pass when calling the method

```ruby
greet("Ruby") # ← "Ruby" is the argument
```
➡️ Think of it like this: parameters are the **blanks**; arguments are what **fill them**.

## Types of Parameters in Ruby
**1. Positional Parameters**

These are passed in order:
```ruby
def add(a, b)
  a + b
end

add(2, 3) # → 5
```

**2. Keyword Parameters (Named Parameters)**

These make code more readable:
```ruby
def register(name:, city:)
  "#{name} from #{city}"
end

register(name: "Deb", city: "Berlin")
```
Use this when you want to clarify what each value means.

**3. Optional Parameters**

Skip providing an argument if you want the default:

```ruby
def hello(greeting = "Hi", name = "there")
  "#{greeting}, #{name}"
end

hello               # → "Hi, there"
hello("Hello")      # → "Hello, there"
hello("Hey", "Bob") # → "Hey, Bob"
```

**4. *args — Catch All Extra Positional Arguments**
```ruby
def sum(*numbers)
  numbers.sum
end

sum(1, 2, 3, 4) # → 10
```

Use when you're not sure how many values will be passed.

**5. **kwargs — Catch All Extra Keyword Arguments**
```ruby
def user_info(**details)
  details.each { |k, v| puts "#{k}: #{v}" }
end

user_info(name: "Deb", mobile: 9439274937)
```

Use when you want flexible keyword input (great for configs, settings, etc.)

**6. Default Parameters Can’t Come After *args**

```ruby
def greet(*args, name = "Guest") # ❌ SyntaxError
end
```
Default parameters must come before splats (*args) or in a clearly defined order:
```ruby
def greet(name = "Guest", *args)
end
```

## Mix Them!
```ruby
def order(item, quantity = 1, **options)
  puts "Ordering #{quantity} x #{item}"
  puts "Options: #{options}"
end

order("coffee", sugar: true, size: "large")
```
Understanding Ruby parameters helps you write cleaner and more flexible code without overthinking. Whether you're building a simple greeting method or a powerful configuration system, choosing the right type of parameter makes your life easier. Keep experimenting, and soon these will feel like second nature!
