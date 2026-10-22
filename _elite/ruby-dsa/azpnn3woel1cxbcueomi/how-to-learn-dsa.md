---
title: Why DSA Matters
chapter: 04
---

I've watched a lot of smart engineers bounce off DSA. Not because they lacked talent, but because they approached it like cramming for an exam: binge twenty videos, skim a few solutions, feel productive, and forget everything by Friday.

DSA doesn't stick that way. It sticks the same way learning a new codebase sticks: by poking at it, breaking it, fixing it, and coming back to it again a week later. This chapter is the playbook I wish someone had handed me when I started.

---

## Build From the Ground Up

You wouldn't deploy a microservice architecture before you'd built a single working Rails app. DSA works the same way. Each topic leans on the ones beneath it, so skipping ahead just means you'll be confused twice.

Here's the order I recommend, and the order this book follows:

| Stage | Focus | Why it comes here |
|---|---|---|
| 1 | Big-O, arrays, strings | Everything else is measured and built on these |
| 2 | Hashes and sets | The single most useful tool in interviews |
| 3 | Searching and sorting | Teaches you to think in steps and trade-offs |
| 4 | Linked lists, stacks, queues | Your first "build it yourself" structures |
| 5 | Recursion | The gateway to trees, graphs, and backtracking |
| 6 | Trees and heaps | Hierarchical data and priority problems |
| 7 | Graphs | Networks, paths, and dependencies |
| 8 | Dynamic programming | Combines almost everything before it |

If a later chapter ever feels like a wall, the fix is almost always to go back one stage and shore up the foundation.

---

## Reps Beat Reading

Reading about DSA feels like progress. It isn't, at least not on its own. You learn this material through your fingertips.

### Where to practice

These platforms all let you submit solutions in Ruby:

- **LeetCode**: the interview-prep standard; its problem lists mirror what big tech companies actually ask.
- **HackerRank**: great structured tracks, and some companies use it for take-home screens.
- **CodeSignal**: worth knowing because several companies use it for timed assessments.
- **Exercism**: has a dedicated Ruby track with human mentors who review your code for idiomatic style. Fantastic for leveling up your Ruby itself.

Start with easy problems, and stay there longer than your ego wants to. When you can solve most easies in fifteen minutes without hints, move up to mediums. Mediums are where most real interviews live.

### Practice like a professional

Don't just type into a browser editor and hit submit. Keep your own repo of solutions, each with its own tests. It's exactly how you'd work on a real codebase, and it gives you a library to review before interviews.

Here's the template I use for every problem:

```ruby
# problems/best_time_to_buy_stock.rb
require "minitest/autorun"

# Track the cheapest price seen so far, and the best profit
# we could make by selling today.
# Time: O(n)   Space: O(1)
def max_profit(prices)
  lowest = Float::INFINITY
  best   = 0

  prices.each do |price|
    lowest = price if price < lowest
    best   = [best, price - lowest].max
  end

  best
end

class MaxProfitTest < Minitest::Test
  def test_typical_case
    assert_equal 5, max_profit([7, 1, 5, 3, 6, 4])
  end

  def test_prices_only_fall
    assert_equal 0, max_profit([7, 6, 4, 3, 1])
  end

  def test_empty_input
    assert_equal 0, max_profit([])
  end
end
```

Run it with `ruby problems/best_time_to_buy_stock.rb`. Notice that the comment at the top records the idea and the complexity, not just the code. Six weeks from now, that one line will remind you how you cracked it.

### Space your reps out

Solving a problem once proves you understood it *that day*. To make it permanent, revisit it: three days later, then a week later, then a month later. If you can re-solve it from a blank file without peeking, it's yours.

---

## Treat Every Problem Like a Puzzle

Stop thinking of DSA as a list of rules to memorize. Think of each problem as a puzzle with several valid solutions, some more elegant than others. Your job is to find a working one, then hunt for a better one.

Take a classic: *are two words anagrams of each other?*

**Attempt 1: sort and compare.** Simple, readable, and correct.

```ruby
def anagram?(a, b)
  a.chars.sort == b.chars.sort
end
# Time: O(n log n), because of the sorting
```

**Attempt 2: count the letters.** Same answer, but we've dropped the sort.

```ruby
def anagram?(a, b)
  a.chars.tally == b.chars.tally
end
# Time: O(n)
```

**Attempt 3: show the interviewer you understand what `tally` is doing.**

```ruby
def anagram?(a, b)
  return false unless a.length == b.length

  counts = Array.new(26, 0)              # one slot per lowercase letter
  a.each_char { |c| counts[c.ord - 97] += 1 }
  b.each_char { |c| counts[c.ord - 97] -= 1 }

  counts.all?(&:zero?)
end
# Time: O(n)   Space: O(1), since the array never grows past 26
```

Three answers, three different trade-offs. That curiosity, the instinct to ask "is there a better way?" after you've already got a working answer, is the most valuable habit you can build. It's also exactly what interviewers are hoping to see.

### My five-step loop for every problem

1. **Restate it** in your own words, including the edge cases (empty input, one item, duplicates, negatives).
2. **Solve it by hand** on two or three tiny examples before touching the keyboard.
3. **Write the brute force** first. A slow, correct answer beats a fast, broken one.
4. **Find the bottleneck** and ask which data structure would remove it.
5. **Test it**, then state the time and space complexity out loud.

---

## Get Comfortable Being Stuck

Here's something nobody tells beginners: getting stuck isn't a sign you're bad at this. It's the actual moment learning happens. Every senior engineer you admire has stared at a problem for an hour and gotten nowhere.

### A healthy way to handle a hard problem

Give yourself a real attempt, roughly 30 to 45 minutes. If you're still stuck, read a *hint*, not the full solution, and try again. If you finally read the solution, close it, wait an hour, and then write it yourself from scratch. Reading code you understand is very different from writing code you understand.

### Learn from Ruby's classic traps

Many "I can't figure out why this is wrong" moments come down to a handful of Ruby gotchas. Here's one that has fooled almost every Rubyist at least once:

```ruby
grid = Array.new(3, [])     # looks like three empty rows...
grid[0] << "X"
grid                         # => [["X"], ["X"], ["X"]]   all three changed!
```

All three slots point to the *same* array object. The fix is to pass a block, so Ruby builds a fresh array for each row:

```ruby
grid = Array.new(3) { [] }
grid[0] << "X"
grid                         # => [["X"], [], []]
```

A couple of other repeat offenders: mixing up `1..5` (includes 5) and `1...5` (excludes 5), and modifying an array while you're iterating over it.

When you're truly lost, drop `binding.irb` into your code. Execution pauses right there and opens an interactive console, so you can inspect every variable at that exact moment.

### Keep a mistake journal

After every problem you struggle with, write two lines in a file: what tripped you up, and what you'll check for next time. For example:

> **Two Sum II** — Forgot the array was already sorted, so I used a hash when two pointers would have done it in O(1) space. *Next time: always ask "is the input sorted?"*

After a month, that file becomes the most personalized interview-prep guide you'll ever own.

---

## The Takeaway

Build in order. Practice in a real Ruby environment with real tests. Treat problems as puzzles worth solving more than once. And when you get stuck, which you will, treat it as progress rather than failure.

Stick to that approach, and DSA stops feeling like a mountain and starts feeling like a game you're getting steadily better at. Let's start playing.