---
title: Pack Your Bag Before the Hike
chapter: 01
---
Every few months, someone on my team asks me how to "get good at LeetCode in Ruby." My answer is always the same: you can't learn to drive stick shift and navigate a mountain road on the same afternoon. If you're still wondering whether a method returns its last line, or why your hash suddenly returns `nil`, every algorithm will feel twice as hard as it really is.

So before we touch a single sorting algorithm, let's make sure your backpack has the right gear. This chapter is a checklist. Skim the parts you know cold, and slow down on anything that makes you squint.

---

## 1. Ruby Fluency: The Non-Negotiables

### Variables and how Ruby names things

Ruby doesn't make you choose between declaration keywords. You just assign, and the *name* tells Ruby what kind of variable it is:

```ruby
count       = 0          # local variable
@balance    = 100        # instance variable (lives on an object)
$debug      = false      # global (avoid in real code)
MAX_RETRIES = 3          # constant (Ruby warns if you reassign it)
```

In interviews you'll live almost entirely in local variables and constants. Know the others exist so they don't surprise you. Class variables (`@@name`) exist too, but they only work inside a class, and most Rubyists steer clear of them.

### The core data types

| Type | Example | Interview relevance |
|---|---|---|
| `Integer` | `42`, `10**30` | Arbitrary precision, so no overflow bugs |
| `Float` | `3.14`, `Float::INFINITY` | `INFINITY` is your go-to "min so far" seed |
| `String` | `"racecar"` | Mutable by default; palindromes and anagrams live here |
| `Symbol` | `:visited` | Lightweight, immutable labels, great as hash keys |
| `true` / `false` / `nil` | | Only `false` and `nil` are falsy. `0` and `""` are **truthy** |
| `Array` | `[3, 1, 2]` | Your stack, your queue, your everything |
| `Hash` | `{ a: 1 }` | Your O(1) lookup table |
| `Range` | `(1..10)` | Clean loops and slices |
| `Set` | `Set[1, 2]` | Fast membership checks |

That truthiness rule trips up people coming from other languages constantly. In Ruby, `if 0` runs the branch.

### Operators worth knowing by heart

```ruby
7 / 2        # => 3      integer division
7.0 / 2      # => 3.5
-7 / 2       # => -4     rounds toward negative infinity, not zero!
-7 % 3       # => 2      result takes the sign of the divisor
2 ** 10      # => 1024

5 <=> 3      # => 1      the "spaceship"; powers every sort
1 == 1.0     # => true
1.eql?(1.0)  # => false  stricter: type must match too

user&.name   # safe navigation: returns nil instead of crashing
```

When I'm interviewing candidates, the negative-division behavior is one of my favorite quiet tests. Binary search midpoints and digit-extraction problems both depend on it.

### Control flow

```ruby
if score >= 90
  "A"
elsif score >= 80
  "B"
else
  "C"
end

return [] if nums.empty?          # modifier form: reads like English
puts "odd" unless n.even?

grade = case score
        when 90..    then "A"
        when 80...90 then "B"
        else "C"
        end

label = n.positive? ? "pos" : "non-pos"
```

Notice that `if` and `case` are *expressions*. They return values, so you can assign them directly.

### Loops: the Ruby way and the interview way

Rubyists rarely write index-based loops in day-to-day code. Interviews are different, because two-pointer and sliding-window problems genuinely need indices. You should be comfortable in both worlds:

```ruby
nums.each { |n| puts n }                  # idiomatic iteration
nums.each_with_index { |n, i| ... }       # when you need the index
5.times { |i| ... }                       # 0 through 4
1.upto(5) { |i| ... }                     # 1 through 5
(0...nums.length).step(2) { |i| ... }     # every other index

left, right = 0, nums.length - 1
while left < right                        # classic two-pointer shape
  left += 1
  right -= 1
end

until queue.empty?                        # "while not"
  node = queue.shift
end

loop do                                   # run-at-least-once loop
  input = gets.to_i
  break if input.positive?
end
```

That last `loop do ... break` pattern is how Ruby developers write a "do-while." Ruby technically supports `begin ... end while cond`, but most Rubyists avoid it, so I'd steer clear in an interview.

---

## 2. Methods, Blocks, and Closures

### Defining methods

```ruby
def greet(name, greeting: "Hello", punctuation: "!")
  "#{greeting}, #{name}#{punctuation}"   # last expression is returned
end

greet("Ada")                     # => "Hello, Ada!"
greet("Ada", greeting: "Hey")    # => "Hey, Ada!"
```

Implicit return is elegant, but in tricky algorithm code, an explicit early `return` often makes your intent clearer to the interviewer. Use both freely.

### Blocks, procs, and lambdas

Blocks are the heart of Ruby. Lambdas are blocks you can store in a variable and pass around:

```ruby
square = ->(x) { x * x }    # the "stabby lambda"
square.call(4)              # => 16
square.(4)                  # => 16, same thing
square[4]                   # => 16, also the same

[1, 2, 3].map(&square)      # => [1, 4, 9]
```

You'll use lambdas for custom comparators and memoized helpers.

### Scope: the gate that `def` slams shut

This is the single biggest scope surprise for newcomers:

```ruby
limit = 10

def check(n)
  n > limit      # NameError! `def` can't see outer local variables
end
```

A `def` starts a brand-new scope. Blocks and lambdas, on the other hand, *can* see the variables around them. That's what makes them closures:

```ruby
def make_counter
  count = 0
  -> { count += 1 }    # the lambda captures `count` and keeps it alive
end

counter = make_counter
counter.call   # => 1
counter.call   # => 2
```

In interviews, this matters most for recursive DFS helpers. If your helper needs access to a shared `visited` set or a running `result`, either pass it in as an argument, use a lambda, or wrap everything in a class with instance variables.

### Run-it-right-now code

Sometimes you want to compute something once, in its own little sealed-off scope. Ruby lets you call a lambda the moment you create it:

```ruby
config = -> {
  base = 100
  { limit: base * 2, timeout: base / 10 }
}.call
```

You won't need this often, but it's handy for setting up isolated test data.

---

## 3. Arrays and Hashes: Your Daily Drivers

### Arrays

```ruby
nums = [5, 3, 8, 1]

nums[0]          # => 5
nums[-1]         # => 1     negative indices count from the end
nums[1..2]       # => [3, 8]
nums.push(9)     # add to end (O(1))
nums.pop         # remove from end (O(1))
nums.unshift(0)  # add to front (amortized O(1) in MRI)
nums.shift       # remove from front (O(1) in MRI)
nums.insert(2, 7)  # add in the middle (O(n), everything after it shifts)
```

### The enumerable toolkit

These are the methods I expect any senior Ruby candidate to reach for without thinking:

```ruby
nums = [1, 2, 3, 4, 5, 6]

nums.map    { |n| n * 2 }           # => [2, 4, 6, 8, 10, 12]
nums.select { |n| n.even? }         # => [2, 4, 6]
nums.reject { |n| n.even? }         # => [1, 3, 5]
nums.reduce(0) { |sum, n| sum + n } # => 21
nums.sum                            # => 21, the shortcut
nums.find   { |n| n > 3 }           # => 4
nums.any?(&:even?)                  # => true
nums.partition(&:odd?)              # => [[1, 3, 5], [2, 4, 6]]
nums.each_slice(2).to_a             # => [[1, 2], [3, 4], [5, 6]]
nums.each_cons(3).to_a              # sliding windows of size 3

%w[a b a c a].tally                 # => {"a"=>3, "b"=>1, "c"=>1}
```

Learn `tally` and `each_cons`. They turn whole categories of interview problems into one-liners, and knowing when *not* to use the one-liner (because the interviewer wants to see the manual version) is a senior-level signal.

### Hashes

```ruby
ages = { "alice" => 30, "bob" => 25 }
ages["carol"] = 35
ages.fetch("dave", 0)              # => 0, safe default
ages.key?("bob")                   # => true

counts = Hash.new(0)               # every missing key starts at 0
"banana".each_char { |c| counts[c] += 1 }

graph = Hash.new { |h, k| h[k] = [] }   # auto-creates empty arrays
graph[1] << 2
graph[1] << 3
```

That last pattern is how I build adjacency lists for every graph problem. Commit it to memory.

### Nested data

```ruby
company = {
  name: "Acme",
  teams: [
    { name: "Platform", members: ["Ana", "Raj"] },
    { name: "Growth",   members: ["Li"] }
  ]
}

company[:teams][0][:members][1]           # => "Raj"
company.dig(:teams, 0, :members, 1)       # => "Raj", and nil-safe
```

---

## 4. Problem-Solving Instincts

Syntax gets you in the door. What actually gets you hired is how you *think*.

**Break the problem into pieces.** Before typing, say out loud: "First I'll count the characters, then I'll compare the counts." Interviewers are grading your process, not just your output.

**Know the classic strategies.** Divide and conquer, recursion, two pointers, sliding windows, and hashing will carry you through the majority of problems. Here's recursion in its simplest form:

```ruby
def factorial(n)
  return 1 if n <= 1     # base case: always write this first
  n * factorial(n - 1)   # recursive case: shrink the problem
end

factorial(5)   # => 120
```

Ruby's call stack isn't infinitely deep. Recurse too far (roughly 10,000 levels, depending on your setup) and you'll hit a `SystemStackError`. For very deep trees or graphs, be ready to switch to an iterative version with an explicit stack.

---

## 5. Your Workbench

### Editor

Any modern editor works. I use VS Code with the official **Ruby LSP** extension, which gives you autocomplete, go-to-definition, and inline errors. RubyMine is excellent too if you prefer a full IDE.

### Installing Ruby

Don't use the Ruby that ships with your operating system. Install a version manager such as `rbenv`, `asdf`, or `mise`, then install a recent Ruby (3.3 or newer is a safe bet for everything in this book):

```bash
ruby -v               # confirm your version
ruby solution.rb      # run a file
irb                   # interactive Ruby: your scratchpad
```

I keep an `irb` session open the entire time I'm practicing. When you're not sure whether `each_cons` returns what you think it does, ask `irb`, not Google.

---

## 6. A Little Math Goes a Long Way

You don't need a math degree. You need comfort with arithmetic, especially integer division and modulo, plus a nodding acquaintance with discrete math:

```ruby
require "set"   # loaded automatically on Ruby 3.2+

a = Set[1, 2, 3, 4]
b = Set[3, 4, 5]

a | b        # union        => #<Set: {1, 2, 3, 4, 5}>
a & b        # intersection => #<Set: {3, 4}>
a - b        # difference   => #<Set: {1, 2}>

n = 1234
n % 10       # => 4               last digit
n / 10       # => 123             drop the last digit
n.digits     # => [4, 3, 2, 1]    Ruby does it for you
```

Sets, logic, and functions show up everywhere in DSA, often wearing a disguise. "Find common elements" is set intersection. "Has this node been seen?" is set membership.

---

## Warm-Up Check: Are You Ready?

Read this snippet and predict the output *before* running it:

```ruby
words = %w[ruby rails ruby rack rails ruby]

freq    = words.tally
leader  = freq.max_by { |_word, count| count }
singles = freq.select { |_word, count| count == 1 }.keys

p leader
p singles
p freq.sort_by { |word, count| [-count, word] }.first(2)
```

If you said `["ruby", 3]`, then `["rack"]`, then `[["ruby", 3], ["rails", 2]]`, you're ready. Turn the page.

If anything surprised you, spend an evening in `irb` playing with `tally`, `max_by`, and `sort_by`. That small investment will pay off on almost every chapter that follows.