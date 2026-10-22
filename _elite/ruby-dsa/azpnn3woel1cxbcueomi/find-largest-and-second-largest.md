---
title: Find the Largest and Second-Largest Elements
chapter: 09
---
Finding the largest element is a one-variable problem. Add "second largest" and suddenly you're juggling two variables that depend on each other, plus duplicates, plus arrays too short to *have* a second largest. That small jump in complexity is exactly why interviewers like this question: it's simple enough to finish in ten minutes, but full of edge cases that reveal how carefully you think.

In this chapter we'll solve it three ways, look closely at the bugs that trip people up, and then stretch the idea to "top k."

---

## The Problem

Given an array of integers, return both the largest and the second-largest values.

```
Input:  [10, 20, 4, 45, 99]
Output: [99, 45]
```

We'll return a two-element array: `[largest, second_largest]`. When a value doesn't exist, we'll use `nil` in its place.

### Questions to ask before coding

This is a problem where clarifying questions genuinely change the answer:

- **Does "second largest" mean the second largest *distinct* value?** For `[9, 9, 3]`, is the answer `9` or `3`? Most interviewers mean **distinct**, so the answer would be `3`. We'll solve that version first and cover the other one in the follow-ups.
- **What if every value is the same, like `[5, 5, 5]`?** With the distinct interpretation, there's no second largest, so we'll return `nil` for it.
- **What if the array has only one element, or none?** We'll return `[1, nil]` and `[nil, nil]`.
- **Can values be negative?** Yes, which rules out starting either variable at `0`.

---

## Approach 1: Two Passes

### The idea in plain English

Think of a talent show with two prizes. On the first walk through the contestants, you only care about finding the winner. Once you know who won, you walk through again, ignore the winner entirely, and pick the best of everyone else. That person is the runner-up.

### The plan, step by step

1. If the array is empty, return `[nil, nil]`.
2. **First pass:** find the largest value, exactly as in Chapter 6.
3. Start `second` as `nil`, meaning "haven't found one yet."
4. **Second pass:** walk through the array again.
   1. If the element equals the largest, skip it.
   2. Otherwise, if `second` is still `nil` or the element is bigger than `second`, make it the new `second`.
5. Return `[largest, second]`.

### The code

```ruby
# Time: O(n)   Space: O(1)
def largest_two_passes(nums)
  return [nil, nil] if nums.empty?

  # Pass 1: find the largest
  largest = nums[0]
  nums.each { |n| largest = n if n > largest }

  # Pass 2: find the best value that isn't the largest
  second = nil
  nums.each do |n|
    next if n == largest
    second = n if second.nil? || n > second
  end

  [largest, second]
end

largest_two_passes([10, 20, 4, 45, 99])   # => [99, 45]
largest_two_passes([5, 5, 5, 5])          # => [5, nil]
```

Using `nil` as the "not found yet" marker is cleaner than starting at `-Float::INFINITY`. There's no sentinel value to accidentally leak into the result.

### Dry run

Input: `[10, 20, 4, 45, 99]`

**Pass 1: find the largest**

| Element | Compared with `largest` | `largest` after |
|---|---|---|
| 10 | (start) | **10** |
| 20 | 20 > 10 | **20** |
| 4 | 4 > 20? No | 20 |
| 45 | 45 > 20 | **45** |
| 99 | 99 > 45 | **99** |

**Pass 2: find the best value that isn't 99**

| Element | Equal to 99? | Compared with `second` | `second` after |
|---|---|---|---|
| 10 | No | `second` is nil | **10** |
| 20 | No | 20 > 10 | **20** |
| 4 | No | 4 > 20? No | 20 |
| 45 | No | 45 > 20 | **45** |
| 99 | Yes, skip | | 45 |

Result: **`[99, 45]`**

### Complexity

- **Time: O(n).** Two passes is 2n steps, and constants drop out, so it's still linear.
- **Space: O(1).** Two variables.

---

## Approach 2: One Pass (The One to Know)

### The idea in plain English

Now picture a podium with just two spots: gold and silver. Contestants walk up one at a time.

- If a newcomer beats the current gold medalist, the old gold holder steps down to silver, and the newcomer takes gold.
- If the newcomer doesn't beat gold, but does beat silver (and isn't tied with gold), they take silver.
- Otherwise, they walk off without a medal.

After everyone has had a turn, the podium shows the answer.

### The plan, step by step

1. Start with `largest` and `second` both as `nil` (an empty podium).
2. Walk through each element:
   1. If `largest` is `nil` or the element is **bigger than** `largest`:
      the old `largest` slides down to become `second`, and the element becomes the new `largest`.
   2. Otherwise, if the element is **smaller than** `largest` (so it isn't a tie with gold) **and** it's bigger than `second` (or `second` is still `nil`):
      the element becomes the new `second`.
   3. Otherwise, do nothing.
3. Return `[largest, second]`.

### The code

```ruby
# Time: O(n)   Space: O(1)
def largest_and_second(nums)
  largest = second = nil

  nums.each do |n|
    if largest.nil? || n > largest
      second  = largest      # old gold steps down to silver
      largest = n            # newcomer takes gold
    elsif n < largest && (second.nil? || n > second)
      second = n             # newcomer takes silver
    end
  end

  [largest, second]
end

largest_and_second([10, 20, 4, 45, 99])   # => [99, 45]
largest_and_second([5, 5, 5, 5])          # => [5, nil]
largest_and_second([-1, -2, -3, -4])      # => [-1, -2]
largest_and_second([1])                   # => [1, nil]
largest_and_second([])                    # => [nil, nil]
```

Notice there's no special `return` for an empty array. If the loop never runs, both variables stay `nil`, which is exactly the right answer.

### Dry run

Input: `[10, 20, 4, 45, 99]`

| Element | What happens | `largest` | `second` |
|---|---|---|---|
| 10 | Podium is empty, so 10 takes gold | **10** | nil |
| 20 | 20 > 10: 10 steps down, 20 takes gold | **20** | **10** |
| 4 | Not > 20, not > 10: no medal | 20 | 10 |
| 45 | 45 > 20: 20 steps down, 45 takes gold | **45** | **20** |
| 99 | 99 > 45: 45 steps down, 99 takes gold | **99** | **45** |

Result: **`[99, 45]`**

### A dry run with a twist

The tricky case is a value that should become silver *without* gold changing. Input: `[2, 10, 10, 3]`

| Element | What happens | `largest` | `second` |
|---|---|---|---|
| 2 | Empty podium: gold | **2** | nil |
| 10 | 10 > 2: 2 steps down | **10** | **2** |
| 10 | Tie with gold: no medal | 10 | 2 |
| 3 | Not > 10, but < 10 and > 2: silver | 10 | **3** |

Result: **`[10, 3]`**. That second `10` is exactly what the `n < largest` check exists for.

### Complexity

- **Time: O(n).** One pass.
- **Space: O(1).** Two variables.

### "But both approaches are O(n). Why does one pass matter?"

This is a great point to raise yourself, because it shows you understand Big O instead of just reciting it.

Going from two passes to one doesn't change the complexity class. The real advantage is that **a single-pass algorithm works when you can only see the data once**. Think of reading a huge log file line by line, consuming a stream of events, or iterating a lazy enumerator:

```ruby
# The one-pass method only calls `each`, so it accepts a lazy stream too.
# The file is read line by line and never fully loaded into memory.
response_times = File.foreach("latency.log").lazy.map(&:to_i)
largest_and_second(response_times)   # => e.g. [1840, 1622]
```

If the data is a stream rather than an array sitting in memory, a second pass might be impossible or very expensive. The one-pass version handles both cases.

---

## Approach 3: Ruby Built-ins

### The idea in plain English

Remove the duplicates, then ask Ruby for the top two values.

### The plan, step by step

1. Use `uniq` to drop repeated values, so ties can't fill both spots.
2. Use `max(2)` to get the two biggest remaining values, biggest first.
3. Destructure into two variables. If only one value exists, the second becomes `nil` automatically.

### The code

```ruby
# Time: O(n)   Space: O(n), because uniq builds a new array
def largest_and_second_builtin(nums)
  largest, second = nums.uniq.max(2)
  [largest, second]
end

largest_and_second_builtin([10, 20, 4, 45, 99])   # => [99, 45]
largest_and_second_builtin([5, 5, 5, 5])          # => [5, nil]
largest_and_second_builtin([])                    # => [nil, nil]
```

Clean, readable, and perfectly fine in production. But it uses O(n) extra memory for the de-duplicated copy, so in an interview, write Approach 2 and mention this as the idiomatic alternative.

> **What not to do:** `nums.sort.uniq.last(2).reverse` also works, but sorting makes it O(n log n) to answer a question that only needs O(n).

---

## Bugs That Catch Almost Everyone

Each of these looks reasonable at first glance. Each one produces a wrong answer.

### Bug 1: Starting both variables at the first element

```ruby
def buggy_same_start(nums)
  largest = second = nums[0]
  nums.each do |n|
    if n > largest
      second  = largest
      largest = n
    elsif n > second && n < largest
      second = n
    end
  end
  [largest, second]
end

buggy_same_start([10, 5])   # => [10, 10]   wrong! should be [10, 5]
```

`second` starts at 10 and nothing smaller can ever replace it. Starting `second` as `nil` (or `-Float::INFINITY`) fixes it.

### Bug 2: Only updating `second` when `largest` changes

```ruby
def buggy_missing_branch(nums)
  largest = second = nil
  nums.each do |n|
    if largest.nil? || n > largest
      second  = largest
      largest = n
    end
  end
  [largest, second]
end

buggy_missing_branch([10, 5, 8])   # => [10, nil]   wrong! should be [10, 8]
```

Values that are smaller than the largest but bigger than the current second never get a chance. You need the `elsif` branch.

### Bug 3: Forgetting to exclude ties with the largest

```ruby
def buggy_ties(nums)
  largest = second = nil
  nums.each do |n|
    if largest.nil? || n > largest
      second  = largest
      largest = n
    elsif second.nil? || n > second      # missing: n < largest
      second = n
    end
  end
  [largest, second]
end

buggy_ties([10, 10, 3])   # => [10, 10]   wrong for the distinct version; should be [10, 3]
```

### Bug 4: Starting at 0

```ruby
largest = second = 0   # breaks on [-1, -2, -3]: returns [0, 0]
```

The same lesson as the last two chapters: never invent a starting value that might not be in the array.

---

## Comparing the Approaches

| Approach | Time | Space | Notes |
|---|---|---|---|
| Two passes | O(n) | O(1) | Easy to reason about; needs to read the data twice |
| One pass | O(n) | O(1) | The interview answer; also works on streams |
| `uniq.max(2)` | O(n) | O(n) | Most readable; uses extra memory |
| Sort, then take last two | O(n log n) | O(n) | Avoid |

---

## Testing

Save as `largest_two_test.rb` and run with `ruby largest_two_test.rb`:

```ruby
require "minitest/autorun"

def largest_two_passes(nums)
  return [nil, nil] if nums.empty?
  largest = nums[0]
  nums.each { |n| largest = n if n > largest }
  second = nil
  nums.each do |n|
    next if n == largest
    second = n if second.nil? || n > second
  end
  [largest, second]
end

def largest_and_second(nums)
  largest = second = nil
  nums.each do |n|
    if largest.nil? || n > largest
      second  = largest
      largest = n
    elsif n < largest && (second.nil? || n > second)
      second = n
    end
  end
  [largest, second]
end

def largest_and_second_builtin(nums)
  largest, second = nums.uniq.max(2)
  [largest, second]
end

class LargestTwoTest < Minitest::Test
  CASES = {
    [10, 20, 4, 45, 99] => [99, 45],    # example from the problem
    [5, 5, 5, 5]        => [5, nil],    # all the same: no distinct second
    [-1, -2, -3, -4]    => [-1, -2],    # all negative
    [1]                 => [1, nil],    # single element
    []                  => [nil, nil],  # empty
    [10, 5]             => [10, 5],     # catches "start both at nums[0]"
    [10, 5, 8]          => [10, 8],     # catches the missing elsif branch
    [10, 10, 3]         => [10, 3],     # catches the tie bug
    [2, 10, 10, 3]      => [10, 3]      # second updated after gold is settled
  }.freeze

  %i[largest_two_passes largest_and_second largest_and_second_builtin].each do |approach|
    define_method("test_#{approach}") do
      CASES.each do |input, expected|
        assert_equal expected, send(approach, input),
                     "#{approach} failed for #{input.inspect}"
      end
    end
  end
end
```

| Input | Expected | What it checks |
|---|---|---|
| `[10, 20, 4, 45, 99]` | `[99, 45]` | The basic example |
| `[5, 5, 5, 5]` | `[5, nil]` | No distinct second value |
| `[-1, -2, -3, -4]` | `[-1, -2]` | Negative numbers |
| `[1]` | `[1, nil]` | Too short for a second |
| `[]` | `[nil, nil]` | Empty input |
| `[10, 5]` | `[10, 5]` | Bug 1 |
| `[10, 5, 8]` | `[10, 8]` | Bug 2 |
| `[10, 10, 3]` | `[10, 3]` | Bug 3 |

---

## Follow-Up Questions Interviewers Love

### 1. "What if duplicates count? For `[9, 9, 3]`, return `[9, 9]`."

Now the second spot can be taken by a tie with gold.

**Plan:** Same as Approach 2, but drop the `n < largest` check, so a value equal to `largest` is allowed to take silver.

```ruby
# Time: O(n)   Space: O(1)
def top_two_with_duplicates(nums)
  largest = second = nil

  nums.each do |n|
    if largest.nil? || n > largest
      second  = largest
      largest = n
    elsif second.nil? || n > second
      second = n
    end
  end

  [largest, second]
end

top_two_with_duplicates([9, 9, 3])   # => [9, 9]
```

The built-in equivalent is simply `nums.max(2)`, without the `uniq`. The fact that one tiny condition flips the meaning of the problem is why that first clarifying question matters so much.

### 2. "Find the second *smallest* instead."

Flip every comparison. Same structure, same edge cases.

```ruby
def smallest_and_second(nums)
  smallest = second = nil

  nums.each do |n|
    if smallest.nil? || n < smallest
      second   = smallest
      smallest = n
    elsif n > smallest && (second.nil? || n < second)
      second = n
    end
  end

  [smallest, second]
end

smallest_and_second([10, 20, 4, 45, 99])   # => [4, 10]
```

### 3. "Now find the top k distinct values."

Juggling `largest`, `second`, `third`, and so on with separate variables gets messy fast. Instead, keep a small sorted list of the best k values seen so far.

**The idea in plain English:** Keep a short leaderboard with k slots, best on top. Each newcomer finds where they'd rank. If they'd land on the board, slot them in and bump whoever falls off the bottom.

**The plan, step by step:**

1. Start with an empty leaderboard, `top`, kept in descending order.
2. For each element:
   1. If it's already on the leaderboard, skip it (we want distinct values).
   2. Find the first position where the element beats the current entry. If it beats nobody, its position is the end of the list.
   3. If that position is beyond the k slots, skip it; it didn't make the cut.
   4. Otherwise, insert it at that position.
   5. If the leaderboard now has more than k entries, drop the last one.
3. Return the leaderboard.

```ruby
# Time: O(n × k)   Space: O(k)
def top_k_distinct(nums, k)
  top = []

  nums.each do |n|
    next if top.include?(n)

    position = top.index { |t| n > t } || top.length
    next if position >= k

    top.insert(position, n)
    top.pop if top.length > k
  end

  top
end

top_k_distinct([10, 20, 4, 45, 99], 3)   # => [99, 45, 20]
top_k_distinct([5, 5, 5], 2)             # => [5]
```

For small k, this is efficient and easy to explain. When k gets large (say, the top 10,000 out of millions), the leaderboard operations get expensive, and the right tool becomes a **min-heap**. We'll build one in the heaps chapter. For now, `nums.uniq.max(k)` is the one-line Ruby answer.

---

## The Takeaway

The one-pass "podium" approach is the one to know: when a newcomer beats gold, gold steps down to silver; when a newcomer beats only silver (and isn't tied with gold), they take silver. Start both spots empty with `nil`, never at the first element or at `0`.

Before writing a single line, ask whether "second largest" means distinct. That one question decides a key condition in your code, and asking it shows the interviewer exactly the kind of care they're hoping to see.