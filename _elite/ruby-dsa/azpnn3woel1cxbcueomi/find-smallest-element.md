---
title: Find the Smallest Element in an Array
chapter: 08
---

At first glance, this chapter looks like a mirror image of the last one: flip `>` to `<` and you're done. In code, that's mostly true. But interviewers know that too, which is why "find the minimum" is rarely the end of the question. It's the warm-up before something sneakier, like *"now find the minimum in a sorted array that's been rotated"* or *"now do it with fewer comparisons."*

So we'll solve the core problem quickly and cleanly, then spend real time on the follow-ups that turn this easy question into a strong signal.

---

## The Problem

Given an array of integers, return the smallest value in it.

```
Input:  [3, 5, 7, 2, 8, -1, 4, 10, 12]
Output: -1
```

### Questions to ask before coding

- **What should an empty array return?** Ruby's convention, and the built-in `min`, return `nil`.
- **Are negative numbers allowed?** (Yes, and it shapes how we start.)
- **Is the array sorted, or sorted and then rotated?** If it's fully sorted, the answer is just `nums.first`, in O(1). If it's rotated, there's a clever O(log n) trick (covered at the end of this chapter).
- **Can it contain `nil` or mixed types?** If so, we'll need to filter before comparing.

---

## Approach 1: Single Pass, Tracking the Smallest So Far

### The idea in plain English

You're scrolling through flight prices for a weekend trip. You don't memorize every price; you just keep the cheapest one in your head. Each time you see a lower fare, it replaces the one you were holding. When you reach the bottom of the page, the price in your head is the cheapest flight.

### The plan, step by step

1. If the array is empty, return `nil`, since there's nothing to compare.
2. Take the **first element** as our `smallest` so far.
3. Walk through the rest of the array, starting from the **second element**.
4. Compare each element with `smallest`.
5. If the element is **smaller**, it becomes the new `smallest`.
6. After the last element, return `smallest`.

### The code

```ruby
# Time: O(n)   Space: O(1)
def find_smallest(nums)
  return nil if nums.empty?

  smallest = nums[0]

  (1...nums.length).each do |i|
    smallest = nums[i] if nums[i] < smallest
  end

  smallest
end

find_smallest([3, 5, 7, 2, 8, -1, 4, 10, 12])   # => -1
```

### Dry run

Input: `[3, 5, 7, 2, 8, -1, 4, 10, 12]`

| Step | Current element | Compared with `smallest` | Smaller? | `smallest` after |
|---|---|---|---|---|
| Start | 3 | | | **3** |
| 1 | 5 | 5 vs 3 | No | 3 |
| 2 | 7 | 7 vs 3 | No | 3 |
| 3 | 2 | 2 vs 3 | Yes | **2** |
| 4 | 8 | 8 vs 2 | No | 2 |
| 5 | -1 | -1 vs 2 | Yes | **-1** |
| 6 | 4 | 4 vs -1 | No | -1 |
| 7 | 10 | 10 vs -1 | No | -1 |
| 8 | 12 | 12 vs -1 | No | -1 |

Final answer: **-1**.

### Complexity

- **Time: O(n).** Each element is visited once. Any element we skipped could have been the smallest, so we can't do better on an unsorted array.
- **Space: O(1).** Just one extra variable.

### The mirror-image bug: starting at 0

In the last chapter, starting the "largest" at `0` broke on all-negative arrays. Here's the flip side:

```ruby
# BUGGY: assumes the answer is at most 0
def find_smallest_buggy(nums)
  smallest = 0
  nums.each { |n| smallest = n if n < smallest }
  smallest
end

find_smallest_buggy([4, 9, 6])   # => 0    wrong! 0 isn't in the array
```

A close cousin is starting with a "big enough" number like `999_999`. It works right up until someone passes in `[1_000_000, 2_000_000]`. There's no magic number that's big enough for every input.

**Two safe options:**

- Start with the first element (as in Approach 1). It's always a real value from the array.
- Start with `Float::INFINITY`, which is larger than every number. Just remember to handle the empty case separately, or you'll return `Infinity` for `[]`.

---

## Approach 2: Ruby's Built-in `min`

### The idea in plain English

Ruby already has this exact loop built in, written in fast C inside the interpreter. One method call does the whole walk for you.

### The plan, step by step

1. Call `min` on the array.
2. Ruby scans every element internally, keeping the smallest.
3. For an empty array, it returns `nil`.

### The code

```ruby
# Time: O(n)   Space: O(1)
def find_smallest(nums)
  nums.min
end

find_smallest([3, 5, 7, 2, 8, -1, 4, 10, 12])   # => -1
find_smallest([])                                # => nil
```

### The `min` family

```ruby
nums = [3, 5, 7, 2, 8, -1, 4, 10, 12]

nums.min                   # => -1
nums.min(3)                # => [-1, 2, 3]      three smallest, no full sort
nums.minmax                # => [-1, 12]

prices = { "flight_a" => 320, "flight_b" => 210, "flight_c" => 275 }
prices.min_by { |_name, price| price }   # => ["flight_b", 210]

words = %w[elephant ox giraffe]
words.min_by(&:length)     # => "ox"
```

### Ruby gotcha: `nil` in the array

```ruby
[4, nil, 2].min            # ArgumentError: comparison of NilClass with Integer failed
[4, nil, 2].compact.min    # => 2
```

`min` can't compare `nil` with a number. If your data might contain missing values, call `compact` first and mention why. (`compact` builds a new array, so it adds O(n) extra space.)

### Complexity

- **Time: O(n).** The built-in still has to look at every element.
- **Space: O(1).**

---

## Approach 3: Divide and Conquer (Recursive)

*Optional: for readers comfortable with recursion. It's not more efficient, but it's great recursion practice.*

### The idea in plain English

Think of a golf tournament run as a knockout bracket, where the **lowest** score wins each match. Players are paired off, each pair produces one winner (the lower score), and the winners are paired off again, round after round, until one champion remains. That champion has the lowest score of everyone.

Divide and conquer works the same way, just in reverse: we split the array in half, then in half again, until each "bracket" holds one player. Then we combine the winners back up the tree.

### The plan, step by step

1. If the array is empty, return `nil`.
2. Work on a section of the array between a `low` index and a `high` index.
3. **Base case:** if the section has one element (`low == high`), that element is the smallest. Return it.
4. Find the middle index.
5. Recursively find the smallest in the **left half** (`low` to `mid`).
6. Recursively find the smallest in the **right half** (`mid + 1` to `high`).
7. Return the smaller of the two results.

### The code

```ruby
# Time: O(n)   Space: O(log n) for the recursion stack
def find_smallest(nums)
  return nil if nums.empty?
  smallest_between(nums, 0, nums.length - 1)
end

def smallest_between(nums, low, high)
  return nums[low] if low == high

  mid         = (low + high) / 2
  left_best   = smallest_between(nums, low, mid)
  right_best  = smallest_between(nums, mid + 1, high)

  left_best < right_best ? left_best : right_best
end

find_smallest([3, 5, 7, 2, 8, -1, 4, 10, 12])   # => -1
```

As in the previous chapter, we pass indices rather than slicing (`nums[low..mid]`), so no sub-arrays get copied.

### The bracket

```
[3, 5, 7, 2, 8, -1, 4, 10, 12]
├── [3, 5, 7, 2, 8]              → 2
│   ├── [3, 5, 7]                → 3
│   │   ├── [3, 5]               → 3
│   │   └── [7]                  → 7
│   └── [2, 8]                   → 2
└── [-1, 4, 10, 12]              → -1
    ├── [-1, 4]                  → -1
    └── [10, 12]                 → 10
```

### Complexity

- **Time: O(n).** Exactly n − 1 comparisons in total, just like the single pass.
- **Space: O(log n).** The recursion goes about log n levels deep.

---

## The Approach to Avoid: Sorting

```ruby
nums.sort.first   # correct answer, wrong idea
```

Sorting costs **O(n log n)** time and **O(n)** extra space to answer a question that needs one O(n) pass. And `sort!` would also rearrange the caller's array, which is a side effect nobody asked for.

---

## Comparing the Approaches

| Approach | Time | Space | When to use |
|---|---|---|---|
| Single pass | O(n) | O(1) | What you write when asked to solve it from scratch |
| `nums.min` | O(n) | O(1) | Production code, or as a step inside a larger solution |
| Divide and conquer | O(n) | O(log n) | Recursion practice; no performance gain |
| Sort then take first | O(n log n) | O(n) | Avoid |

---

## Testing All Three

Save as `find_smallest_test.rb` and run with `ruby find_smallest_test.rb`:

```ruby
require "minitest/autorun"

def smallest_single_pass(nums)
  return nil if nums.empty?
  smallest = nums[0]
  (1...nums.length).each { |i| smallest = nums[i] if nums[i] < smallest }
  smallest
end

def smallest_builtin(nums)
  nums.min
end

def smallest_divide_and_conquer(nums)
  return nil if nums.empty?
  smallest_between(nums, 0, nums.length - 1)
end

def smallest_between(nums, low, high)
  return nums[low] if low == high
  mid = (low + high) / 2
  left_best  = smallest_between(nums, low, mid)
  right_best = smallest_between(nums, mid + 1, high)
  left_best < right_best ? left_best : right_best
end

class FindSmallestTest < Minitest::Test
  CASES = {
    [3, 5, 7, 2, 8, -1, 4, 10, 12] => -1,   # example from the problem
    [1, 2, 3, 4, 5]                => 1,    # smallest at the start
    [5, 4, 3, 2, 1]                => 1,    # smallest at the end
    [-3, -5, -7, -2, -8, -1, -4]   => -8,   # all negative
    [4, 9, 6]                      => 4,    # all positive (catches the "start at 0" bug)
    [100]                          => 100,  # single element
    []                             => nil   # empty array
  }.freeze

  %i[smallest_single_pass smallest_builtin smallest_divide_and_conquer].each do |approach|
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
| `[1, 2, 3, 4, 5]` | `1` | Smallest is first |
| `[5, 4, 3, 2, 1]` | `1` | Smallest is last |
| `[-3, -5, -7, -2, -8, -1, -4]` | `-8` | All negatives |
| `[4, 9, 6]` | `4` | All positives (the "start at 0" trap) |
| `[100]` | `100` | Single element |
| `[]` | `nil` | Empty array |

---

## Follow-Up Questions Interviewers Love

### 1. "The array was sorted, then rotated. Find the minimum in better than O(n)."

This is a genuine interview classic. An array like `[0, 1, 2, 4, 5, 6, 7]` gets rotated into `[4, 5, 6, 7, 0, 1, 2]`. The minimum sits right at the "drop," where the values fall off a cliff.

**The idea in plain English:** The array is made of two sorted runs. If you look at the middle element and compare it with the last element, you can tell which side of the cliff you're on, and throw away half the array, just like binary search.

**The plan, step by step:**

1. If the array is empty, return `nil`.
2. Set `low` to the first index and `high` to the last index.
3. While `low` is less than `high`:
   1. Find the middle index.
   2. If the middle value is **greater** than the value at `high`, the drop must be to the right of the middle. Move `low` to `mid + 1`.
   3. Otherwise, the minimum is at the middle or to its left. Move `high` to `mid`.
4. When `low` and `high` meet, they point at the minimum. Return it.

```ruby
# Time: O(log n)   Space: O(1)   (assumes no duplicate values)
def find_min_rotated(nums)
  return nil if nums.empty?

  low, high = 0, nums.length - 1

  while low < high
    mid = (low + high) / 2

    if nums[mid] > nums[high]
      low = mid + 1      # the drop is in the right half
    else
      high = mid         # mid could be the minimum, so keep it
    end
  end

  nums[low]
end

find_min_rotated([4, 5, 6, 7, 0, 1, 2])   # => 0
find_min_rotated([3, 1, 2])               # => 1
find_min_rotated([1, 2, 3, 4])            # => 1   not rotated at all
```

Notice `high = mid`, not `mid - 1`. The middle element itself might be the answer, so we can't throw it away. Off-by-one choices like this are exactly what interviewers watch for.

### 2. "Return the index of the smallest element. If there's a tie, return the *last* one."

**Plan:**
1. If empty, return `nil`.
2. Track the best **index**, starting at 0.
3. For each later index, if its value is **less than or equal to** the value at the best index, update the best index. (Using `<=` lets later ties win.)
4. Return the best index.

```ruby
# Time: O(n)   Space: O(1)
def last_index_of_smallest(nums)
  return nil if nums.empty?

  best = 0
  (1...nums.length).each do |i|
    best = i if nums[i] <= nums[best]
  end
  best
end

last_index_of_smallest([3, 1, 4, 1, 5])   # => 3
```

Swap `<=` for `<` and you get the *first* occurrence instead (index 1). Being deliberate about that one character is a small but real senior-engineer signal.

### 3. "Find both the smallest and largest using fewer comparisons."

The obvious way checks each element against both the current min and the current max: about **2n** comparisons. There's a neat trick that gets it down to about **1.5n**.

**The idea in plain English:** Take elements two at a time. Compare the pair with each other first. Then only the smaller one needs to challenge the current minimum, and only the bigger one needs to challenge the current maximum. That's three comparisons per pair instead of four.

**The plan, step by step:**

1. If the array is empty, return `nil`.
2. If the length is odd, start both `lowest` and `highest` at the first element, and begin pairing from index 1.
3. If the length is even, compare the first two elements to set `lowest` and `highest`, and begin pairing from index 2.
4. For each remaining pair:
   1. Compare the two elements to find the smaller and the bigger.
   2. Compare the smaller with `lowest`; update if needed.
   3. Compare the bigger with `highest`; update if needed.
5. Return `[lowest, highest]`.

```ruby
# Time: O(n), about 1.5n comparisons   Space: O(1)
def min_and_max(nums)
  return nil if nums.empty?

  if nums.length.odd?
    lowest = highest = nums[0]
    start = 1
  else
    lowest, highest = nums[0] < nums[1] ? [nums[0], nums[1]] : [nums[1], nums[0]]
    start = 2
  end

  (start...nums.length).step(2) do |i|
    a, b = nums[i], nums[i + 1]
    small, big = a < b ? [a, b] : [b, a]

    lowest  = small if small < lowest
    highest = big   if big > highest
  end

  [lowest, highest]
end

min_and_max([3, 5, 7, 2, 8, -1, 4, 10, 12])   # => [-1, 12]
```

It's still O(n), since 1.5n and 2n are the same complexity class. But if an interviewer asks you to minimize *comparisons*, this is the answer they're after. In everyday Ruby, `nums.minmax` is what you'd ship.

### 4. "For each position, what's the smallest value seen so far?"

This "running minimum" is the secret ingredient in the famous best-time-to-buy-and-sell-stock problem.

**Plan:**
1. Keep a variable holding the smallest value seen so far.
2. Walk the array; at each step, update that variable and record it.

```ruby
# Time: O(n)   Space: O(n) for the output
def running_min(nums)
  smallest = Float::INFINITY
  nums.map { |n| smallest = [smallest, n].min }
end

running_min([5, 3, 8, 1, 4])   # => [5, 3, 3, 1, 1]
```

Notice how the answer at each position is the cheapest "buy price" available up to that day. Keep this pattern in mind; it's coming back.

---

## The Takeaway

The core solution is a single pass that starts with a real element (never `0` or a "big enough" magic number), keeps the smallest seen so far, and runs in O(n) time with O(1) space. Ruby's `min`, `min(k)`, `min_by`, and `minmax` cover the same ground in one call.

The real interview value lives in the follow-ups. Know the rotated-array binary search cold, be deliberate about `<` versus `<=` for ties, and keep the running-minimum pattern handy. That's how an "easy" question becomes a chance to stand out.