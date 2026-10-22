---
title: Find the Largest Element in an Array
chapter: 07
---

This is usually the very first problem anyone solves with an array, and it's tempting to skip it. Don't. I've watched experienced engineers fumble it in interviews: they start their "max so far" at `0` and break on negative numbers, or forget empty input, or reach for `sort.last` and quietly turn an O(n) problem into O(n log n).

Easy problems are where interviewers check your fundamentals. Nail this one cleanly and you've set the tone for the rest of the session.

---

## The Problem

Given an array of integers, return the largest value in it.

```
Input:  [3, 5, 7, 2, 8, -1, 4, 10, 12]
Output: 12
```

### Questions to ask before coding

Asking these out loud is a quick win in any interview:

- **What if the array is empty?** In Ruby, returning `nil` is the natural choice, and it's what the built-in `max` does. Confirm that's acceptable.
- **Can there be negative numbers?** (Yes, and it matters a lot for how you start.)
- **Can values repeat?** (Doesn't change the answer here, but it matters for follow-ups like "return the index.")
- **Is the array sorted?** If so, the answer is just the last element in O(1).

---

## Approach 1: Single Pass, Tracking the Best So Far

This is the approach the interviewer is looking for.

### The idea in plain English

Imagine walking down a line of people, holding a card with the tallest height you've seen so far. Every time you meet someone taller, you swap in their height. When you reach the end of the line, your card shows the tallest person.

### The plan, step by step

1. If the array is empty, return `nil`, since there's no largest element.
2. Pick up the **first element** and call it `largest`. That's our best guess so far.
3. Walk through the rest of the array, starting from the **second element**.
4. For each element, compare it with `largest`.
5. If the element is **bigger**, it becomes the new `largest`.
6. When the walk is over, return `largest`.

### The code

```ruby
# Time: O(n)   Space: O(1)
def find_largest(nums)
  return nil if nums.empty?

  largest = nums[0]

  (1...nums.length).each do |i|
    largest = nums[i] if nums[i] > largest
  end

  largest
end

find_largest([3, 5, 7, 2, 8, -1, 4, 10, 12])   # => 12
```

If you prefer a more idiomatic loop, `nums.each { |n| largest = n if n > largest }` works too. It compares the first element against itself once, which is harmless.

### Dry run

Input: `[3, 5, 7, 2, 8, -1, 4, 10, 12]`

| Step | Current element | Compared with `largest` | Bigger? | `largest` after |
|---|---|---|---|---|
| Start | 3 | | | **3** |
| 1 | 5 | 5 vs 3 | Yes | **5** |
| 2 | 7 | 7 vs 5 | Yes | **7** |
| 3 | 2 | 2 vs 7 | No | 7 |
| 4 | 8 | 8 vs 7 | Yes | **8** |
| 5 | -1 | -1 vs 8 | No | 8 |
| 6 | 4 | 4 vs 8 | No | 8 |
| 7 | 10 | 10 vs 8 | Yes | **10** |
| 8 | 12 | 12 vs 10 | Yes | **12** |

Final answer: **12**.

### Complexity

- **Time: O(n).** Every element is looked at exactly once. You can't do better, because any element you skip could have been the largest.
- **Space: O(1).** We only store one extra value, no matter how big the array is.

### Why we start with the first element, not 0

This is the most common bug in this problem:

```ruby
# BUGGY: assumes the answer is at least 0
def find_largest_buggy(nums)
  largest = 0
  nums.each { |n| largest = n if n > largest }
  largest
end

find_largest_buggy([-3, -5, -7, -2])   # => 0    wrong! 0 isn't even in the array
```

Starting with the first element guarantees our starting guess is a real value from the array. The other safe option is to start at `-Float::INFINITY`, which is smaller than any number, though you then need to handle the empty case separately so you don't return `-Infinity`.

---

## Approach 2: Ruby's Built-in `max`

### The idea in plain English

Ruby already ships a method that does exactly Approach 1 for you, written in fast C code inside the interpreter.

### The plan, step by step

1. Call `max` on the array.
2. Ruby walks through every element internally, keeping track of the largest.
3. If the array is empty, `max` returns `nil`.

### The code

```ruby
# Time: O(n)   Space: O(1)
def find_largest(nums)
  nums.max
end

find_largest([3, 5, 7, 2, 8, -1, 4, 10, 12])   # => 12
find_largest([])                                # => nil
```

### Related built-ins worth knowing

```ruby
nums = [3, 5, 7, 2, 8, -1, 4, 10, 12]

nums.max                  # => 12                 largest
nums.min                  # => -1                 smallest
nums.minmax               # => [-1, 12]           both, in one pass
nums.max(3)               # => [12, 10, 8]        top 3, without sorting everything
nums.reduce { |a, b| a > b ? a : b }   # => 12    the same logic, spelled out

words = %w[ruby rails sinatra hanami]
words.max_by(&:length)    # => "sinatra"          largest by a custom rule
```

### Complexity

- **Time: O(n).** `max` still has to look at every element; it's just doing it for you.
- **Space: O(1).**

### When to use it in an interview

If the whole problem is "find the max," write Approach 1 to show you understand the logic, then mention `nums.max` as the production-ready version. If finding the max is just *one step* in a bigger problem, use `max` directly and say "that's O(n)."

> **Ruby note:** `max` needs elements that can be compared with each other. `[1, 2.5, 3].max` works fine, but `[1, "two", 3].max` raises an `ArgumentError`, because Ruby won't guess whether a number is bigger than a string.

---

## Approach 3: Divide and Conquer (Recursive)

*Optional: read this once you're comfortable with recursion. It's not faster, but it's a perfect miniature of an idea you'll use later in merge sort and binary search.*

### The idea in plain English

Imagine you're a manager asked to find the tallest person in a large office. Instead of measuring everyone yourself, you split the office in half and ask two assistants to each find the tallest person in their half. They split their halves again and delegate further, until someone is left with a single person, who is obviously the tallest of one. The answers flow back up, and at each step, the taller of two answers wins.

### The plan, step by step

1. If the array is empty, return `nil`.
2. Look at a section of the array marked by a `low` index and a `high` index.
3. **Base case:** if the section has just one element (`low == high`), return that element.
4. Otherwise, find the middle index.
5. Recursively find the largest in the **left half** (`low` to `mid`).
6. Recursively find the largest in the **right half** (`mid + 1` to `high`).
7. Return whichever of those two answers is bigger.

### The code

```ruby
# Time: O(n)   Space: O(log n) for the recursion stack
def find_largest(nums)
  return nil if nums.empty?
  largest_between(nums, 0, nums.length - 1)
end

def largest_between(nums, low, high)
  return nums[low] if low == high              # one element: it's the largest

  mid        = (low + high) / 2
  left_best  = largest_between(nums, low, mid)
  right_best = largest_between(nums, mid + 1, high)

  left_best > right_best ? left_best : right_best
end

find_largest([3, 5, 7, 2, 8, -1, 4, 10, 12])   # => 12
```

Notice we pass `low` and `high` indices instead of slicing the array with `nums[low..mid]`. Slicing would create a new sub-array at every call, adding hidden time and memory. Passing indices is the habit that keeps recursive array code efficient.

### How the splitting looks

```
[3, 5, 7, 2, 8, -1, 4, 10, 12]
├── [3, 5, 7, 2, 8]              → 8
│   ├── [3, 5, 7]                → 7
│   │   ├── [3, 5]               → 5
│   │   └── [7]                  → 7
│   └── [2, 8]                   → 8
└── [-1, 4, 10, 12]              → 12
    ├── [-1, 4]                  → 4
    └── [10, 12]                 → 12
```

### Complexity

- **Time: O(n).** Every element ends up as a single-element base case once, and each merge step is a single comparison. Total comparisons: n − 1, the same as Approach 1.
- **Space: O(log n).** The array is halved at each level, so the recursion goes about log n calls deep. Each waiting call takes a frame on the stack.

This approach uses more memory than Approach 1 and gains nothing in speed. Its value is educational: it teaches the "split, solve, combine" pattern you'll need for harder problems.

---

## The Approach to Avoid: Sorting

```ruby
def find_largest(nums)
  nums.sort.last     # works, but...
end
```

It gives the right answer, but sorting is **O(n log n)** time and builds a whole new array, using **O(n)** extra space. You'd be organizing the entire array just to read one value. In an interview, this is a red flag unless you're explicitly asked to explain why it's a poor choice.

And never use `sort!` here: it would rearrange the caller's array as a side effect, which is a nasty surprise for whoever passed it in.

---

## Comparing the Approaches

| Approach | Time | Space | When to use |
|---|---|---|---|
| Single pass | O(n) | O(1) | The answer interviewers want to see you write |
| `nums.max` | O(n) | O(1) | Production code, or as one step in a bigger solution |
| Divide and conquer | O(n) | O(log n) | To demonstrate recursion; not more efficient |
| Sort then take last | O(n log n) | O(n) | Avoid |

---

## Testing All Three

Here's a test file you can run with `ruby find_largest_test.rb`. It checks each approach against the same cases, including the tricky ones.

```ruby
require "minitest/autorun"

def largest_single_pass(nums)
  return nil if nums.empty?
  largest = nums[0]
  (1...nums.length).each { |i| largest = nums[i] if nums[i] > largest }
  largest
end

def largest_builtin(nums)
  nums.max
end

def largest_divide_and_conquer(nums)
  return nil if nums.empty?
  largest_between(nums, 0, nums.length - 1)
end

def largest_between(nums, low, high)
  return nums[low] if low == high
  mid = (low + high) / 2
  left_best  = largest_between(nums, low, mid)
  right_best = largest_between(nums, mid + 1, high)
  left_best > right_best ? left_best : right_best
end

class FindLargestTest < Minitest::Test
  CASES = {
    [3, 5, 7, 2, 8, -1, 4, 10, 12] => 12,   # example from the problem
    [1, 2, 3, 4, 5]                => 5,    # largest at the end
    [5, 4, 3, 2, 1]                => 5,    # largest at the start
    [-3, -5, -7, -2, -8, -1, -4]   => -1,   # all negative (catches the "start at 0" bug)
    [100]                          => 100,  # single element
    [7, 7, 7]                      => 7,    # all duplicates
    []                             => nil   # empty array
  }.freeze

  %i[largest_single_pass largest_builtin largest_divide_and_conquer].each do |approach|
    define_method("test_#{approach}") do
      CASES.each do |input, expected|
        result = send(approach, input)
        if expected.nil?
          assert_nil result, "#{approach} failed for #{input.inspect}"
        else
          assert_equal expected, result, "#{approach} failed for #{input.inspect}"
        end
      end
    end
  end
end
```

| Input | Expected | What it checks |
|---|---|---|
| `[1, 2, 3, 4, 5]` | `5` | Largest is the last element |
| `[5, 4, 3, 2, 1]` | `5` | Largest is the first element |
| `[-3, -5, -7, -2, -8, -1, -4]` | `-1` | All negatives |
| `[100]` | `100` | Single element |
| `[7, 7, 7]` | `7` | All values equal |
| `[]` | `nil` | Empty array |

---

## Follow-Up Questions Interviewers Love

Once you've solved the basic version, expect one of these. Each is a small twist on the same "track the best so far" idea.

### "Return the index of the largest element instead."

**Plan:**
1. If the array is empty, return `nil`.
2. Remember the **index** of the best element so far, starting at index 0.
3. Walk through the rest. If an element is bigger than the one at the best index, update the best index.
4. Return the best index.

```ruby
# Time: O(n)   Space: O(1)
def index_of_largest(nums)
  return nil if nums.empty?

  best = 0
  (1...nums.length).each do |i|
    best = i if nums[i] > nums[best]
  end
  best
end

index_of_largest([4, 9, 2, 9])   # => 1   first occurrence, because we use > not >=
```

Using `>` keeps the **first** occurrence when there are ties; `>=` would keep the **last**. Mention that choice out loud. It's exactly the kind of detail interviewers listen for.

### "Find both the largest and the smallest."

```ruby
nums.minmax   # => [smallest, largest] in a single pass
```

Or track two variables in one loop. Either way it's O(n), not two separate O(n) passes (though even that would still be O(n) overall).

### "Find the largest value in a 2D grid."

**Plan:**
1. Find the largest value in each row.
2. Return the largest of those row results.

```ruby
grid = [[3, 8, 1],
        [9, 2, 7],
        [4, 6, 5]]

grid.map(&:max).max   # => 9
```

Time is **O(rows × cols)**, since every cell is checked once. (`grid.flatten.max` also works, but it builds a full copy of the grid first.)

### "Find the k largest elements."

```ruby
[3, 5, 7, 2, 8, -1, 4, 10, 12].max(3)   # => [12, 10, 8]
```

For a follow-up on doing this efficiently with a very large or streaming input, the answer is a **min-heap** of size k, which we'll build in the heaps chapter.

### "Find the second-largest element."

We solved this one in a single pass in the arrays chapter: track the two best values as you go.

---

## The Takeaway

The single-pass approach is the one to know by heart: start with a real element (never `0`), walk the array once, keep the best you've seen. It's O(n) time and O(1) space, and nothing beats it, because every element has to be checked at least once.

Know `max`, `minmax`, `max(k)`, and `max_by` for when finding the max is just one step in a larger solution. Use divide and conquer to practice recursion, not to win on performance. And skip sorting; it's doing far more work than the question needs.