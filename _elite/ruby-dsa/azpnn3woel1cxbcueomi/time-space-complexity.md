---
title: Time and Space Complexity
chapter: 05
---

If you remember only one chapter from this book when you walk into an interview, make it this one.

Here's why. Almost every DSA interview ends with the same question: *"What's the time and space complexity of your solution?"* I've seen candidates write beautiful, working Ruby and then stumble on that question, and the interview quietly slips from "strong hire" to "maybe." I've also seen candidates write a slightly clunky solution, analyze it crisply, explain how to improve it, and walk away with an offer.

The good news: you don't need a math degree. You need a handful of patterns, a few rules of thumb, and some practice reading code with a "how does this grow?" lens. That's exactly what this chapter gives you.

---

## Part 1: What Complexity Actually Measures

**Time complexity** describes how an algorithm's running time *grows* as its input grows. Not how many milliseconds it takes on your laptop, but how the work scales when the input goes from 10 items to 10 million.

**Space complexity** describes the same thing for memory: how much *extra* memory your algorithm needs as the input grows.

### The first example every engineer should know

Let's add up the numbers from 1 to `n`. The obvious way is a loop:

```ruby
def sum_to(n)
  total = 0
  (1..n).each { |i| total += i }
  total
end
```

Double `n`, and you double the work. That's **O(n)**.

Now the clever way, using the formula young Gauss supposedly figured out in grade school:

```ruby
def sum_to(n)
  n * (n + 1) / 2
end
```

One multiplication, one addition, one division, whether `n` is 10 or 10 billion. That's **O(1)**.

| Approach | Time | How it grows |
|---|---|---|
| Loop | O(n) | Work increases in step with `n` |
| Formula | O(1) | Work stays the same no matter what |

> **Ruby insider tip:** `(1..n).sum` looks like it loops, but for integer ranges Ruby is smart enough to use the formula internally, so it's actually O(1). This is a great example of why you should know what your built-in methods are doing under the hood. We'll come back to that idea, because it's where a lot of interview mistakes hide.

---

## Part 2: Big O in Plain English

**Big O describes an upper bound on how fast the work grows.** In interviews, it's almost always used to talk about the worst case: "In the worst possible input, how bad does it get?"

Why the worst case? Because production doesn't care about your best day. If a search *usually* finds its target in the first slot but occasionally scans a million records, the occasional scan is what pages the on-call engineer at 3 a.m.

Big O deliberately ignores small details so we can compare algorithms by their *shape*:

- **Constants don't matter.** O(2n) and O(n + 500) are both just **O(n)**.
- **Only the biggest term matters.** O(n² + n + 10) is just **O(n²)**. When `n` is a million, the `n²` part is so large that everything else is a rounding error.

### The complexity ladder

Memorize this order. From fastest to slowest:

| Notation | Name | Typical example in Ruby |
|---|---|---|
| O(1) | Constant | `arr[5]`, `hash[:key]`, `set.include?(x)` |
| O(log n) | Logarithmic | Binary search, `arr.bsearch` |
| O(n) | Linear | `arr.each`, `arr.include?`, `arr.sum` |
| O(n log n) | Linearithmic | `arr.sort`, merge sort |
| O(n²) | Quadratic | Comparing every pair with nested loops |
| O(n³) | Cubic | Three nested loops over the input |
| O(2ⁿ) | Exponential | Generating every subset; naive recursive Fibonacci |
| O(n!) | Factorial | Generating every permutation |

### Feel the difference

Numbers make this real. Here's roughly how many steps each class takes:

| n | log n | n log n | n² | 2ⁿ |
|---|---|---|---|---|
| 10 | ~3 | ~33 | 100 | 1,024 |
| 100 | ~7 | ~664 | 10,000 | more than atoms in a galaxy |
| 1,000 | ~10 | ~10,000 | 1,000,000 | forget it |
| 1,000,000 | ~20 | ~20,000,000 | 1,000,000,000,000 | forget it |

Look at that last row. An O(n log n) algorithm on a million items is a routine afternoon for a computer. An O(n²) algorithm on the same input is a trillion steps. That gap is why this chapter exists.

---

## Part 3: The Common Classes, One at a Time

### O(1) — Constant time

The work doesn't depend on the input size at all.

```ruby
def first_item(arr)
  arr[0]                        # direct jump to a slot, no searching
end

def sum_to(n)
  n * (n + 1) / 2               # three operations, always
end

prices = { "latte" => 4.5 }
prices["latte"]                 # hash lookup: O(1) on average
```

Whether the array holds 8 items or 8 million, reading `arr[0]` takes the same single step. If you drew a graph of input size vs. time, you'd get a flat line.

### O(n) — Linear time

The work grows in direct proportion to the input. You touch each element a fixed number of times.

```ruby
def linear_search(arr, target)
  arr.each_with_index do |value, index|
    return index if value == target
  end
  nil
end
```

In the worst case (the target is last, or missing), you check every element. An 8-item array needs up to 8 checks; an 8-million-item array needs up to 8 million.

Linear time is often the best you can hope for. If the answer depends on every element (like finding the maximum of an unsorted list), you *have* to look at each one at least once.

### O(log n) — Logarithmic time

This is the "cut the problem in half every step" pattern. Watch what happens when we keep halving 16:

```ruby
n     = 16
steps = 0
i     = n

while i > 1
  print i, " "
  i /= 2
  steps += 1
end

puts
puts steps
# Output:
# 16 8 4 2
# 4
```

Four steps for 16 items. Here's the math behind it, minus the intimidation:

- After 1 step, you have n / 2 left.
- After 2 steps, you have n / 4, which is n / 2².
- After k steps, you have n / 2ᵏ.
- You stop when there's 1 item left: n / 2ᵏ = 1, which means **n = 2ᵏ**.
- Ask "2 to what power gives n?" That's the definition of a logarithm: **k = log₂ n**.

So any loop that halves (or doubles) its way through the input runs in O(log n). That's why binary search can find one item among a billion in about 30 steps.

> **Interview shorthand:** In Big O, we drop the base and just write log n. Changing the base only multiplies the result by a constant, and constants don't matter.

### O(n log n) — Linearithmic time

This shows up when you split the input in half repeatedly (the log n part) and do linear work at each level of splitting (the n part). Merge sort is the textbook example:

```ruby
def merge_sort(arr)
  return arr if arr.length <= 1

  mid = arr.length / 2
  merge(merge_sort(arr[0...mid]), merge_sort(arr[mid..]))
end

def merge(left, right)
  result = []
  i = j = 0

  while i < left.length && j < right.length
    if left[i] <= right[j]
      result << left[i]
      i += 1
    else
      result << right[j]
      j += 1
    end
  end

  result.concat(left[i..]).concat(right[j..])
end

merge_sort([38, 27, 43, 3, 9, 82, 10])
# => [3, 9, 10, 27, 38, 43, 82]
```

Picture it as a tree. The array gets halved about log n times, so there are about log n levels. At every level, merging touches all n elements once. Multiply: **n × log n**.

This is the practical speed limit for comparison-based sorting, and it's what Ruby's own `sort` delivers. When an interviewer asks you to sort, assume O(n log n) and say so.

### O(n²) — Quadratic time

The classic sign: a loop inside a loop, both running over the input.

```ruby
def print_all_pairs(arr)
  arr.each do |a|
    arr.each do |b|
      puts "#{a} #{b}"
    end
  end
end

print_all_pairs([1, 2, 3])
# 1 1
# 1 2
# 1 3
# 2 1
# 2 2
# 2 3
# 3 1
# 3 2
# 3 3
```

Three items produce nine lines. The outer loop runs n times, and *for each* of those, the inner loop runs n times: n × n = n².

Quadratic code is fine for small inputs and quietly catastrophic for large ones. Doubling the input quadruples the work. Ten times the input means a hundred times the work.

> **Note:** You'll sometimes see the inner loop start at `i + 1` to avoid duplicate pairs. That cuts the work roughly in half, to n(n − 1)/2, but half of n² is still **O(n²)**. Constants don't change the class.

### O(2ⁿ) — Exponential time

Usually comes from recursion where each call spawns two (or more) calls:

```ruby
def fib(n)
  return n if n < 2
  fib(n - 1) + fib(n - 2)
end
```

Each call branches into two more, so the call tree roughly doubles at every level. `fib(40)` makes hundreds of millions of calls. Add one tiny line of memoization and it collapses to O(n):

```ruby
def fib(n, memo = {})
  return n if n < 2
  memo[n] ||= fib(n - 1, memo) + fib(n - 2, memo)
end
```

That transformation is the heart of dynamic programming, which we'll cover later in the book.

### O(n!) — Factorial time

Generating every possible ordering of the input:

```ruby
[1, 2, 3].permutation.to_a
# => [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
```

Three items give 6 orderings. Ten items give 3,628,800. Twenty items give more orderings than there have been seconds since the universe began. Only use this when the input is tiny and the problem truly demands every arrangement.

---

## Part 4: Big O, Big Θ, and Big Ω (Just What You Need)

You'll occasionally hear these in interviews, especially at companies with a more academic bent. Here's the whole story in one table:

| Symbol | Name | Meaning | Analogy |
|---|---|---|---|
| **O** | Big O | Upper bound: grows *no faster than* this | "The commute takes at most an hour." |
| **Ω** | Big Omega | Lower bound: grows *no slower than* this | "The commute takes at least 20 minutes." |
| **Θ** | Big Theta | Tight bound: grows *exactly like* this, up to constants | "The commute is about 40 minutes, give or take." |

For the curious, the formal definition of Θ says that T(n) = Θ(f(n)) if there are positive constants c₁, c₂, and a threshold n₀ such that, for every n ≥ n₀:

**c₁ · f(n) ≤ T(n) ≤ c₂ · f(n)**

In plain English: past some point, your algorithm's running time is sandwiched between two scaled copies of the same curve. It can't escape above or below it.

### How this shows up in practice

Take `print_all_pairs`. It *always* does exactly n² prints, no matter what's in the array. So it's O(n²), Ω(n²), and therefore Θ(n²). The bound is tight.

Now take `linear_search`. On a lucky input, the target is first and it finishes in one step. On an unlucky input, it scans everything. So its running time ranges from constant to linear, and the honest summary is: **best case O(1), worst case O(n)**.

### What to actually say in an interview

When engineers casually say "this is O(n)," they almost always mean the tight bound for the worst case. That's the industry convention, and it's what your interviewer expects. You only need to bring up Θ or Ω if they ask, or if best and worst cases differ in a way that matters for the problem.

A strong answer sounds like: *"Worst case is O(n) when the target isn't present. Best case is O(1) if it's at the front, but I'd plan around the worst case."*

---

## Part 5: How to Calculate Complexity — The Recipe

Here's the step-by-step process I use, and the one I teach every engineer I mentor:

1. **Name your inputs.** What is n? The array length? The string length? Is there a second input, like m for a second array?
2. **Find the loops,** including the hidden ones inside built-in methods (more on this shortly).
3. **Ask how many times each loop runs**, in terms of n.
4. **Combine:** nested pieces multiply, sequential pieces add.
5. **Simplify:** drop constants, keep only the dominant term.
6. **Repeat for memory:** what extra space did you allocate, including the recursion stack?

### Rule 1: Sequential steps add, then the biggest one wins

```ruby
def analyze(nums)
  nums.each { |n| puts n }                 # O(n)

  nums.each do |a|                          # O(n²)
    nums.each { |b| puts a + b }
  end

  nums.each { |n| puts n * 2 }             # O(n)
end
```

Total: O(n + n² + n) = O(n² + 2n), which simplifies to **O(n²)**. The slowest phase dominates.

### Rule 2: Nested loops multiply

One loop inside another, both over n, gives n × n = **O(n²)**. Three levels gives **O(n³)**.

### Rule 3: Drop the constants

All of these are **O(n)**:

```ruby
(1..3 * n).each { }          # 3n iterations
(1..n + 5).each { }          # n + 5 iterations
(1..n).step(2) { }           # n / 2 iterations
```

Big O cares about the *shape* of growth, not the exact count.

### Rule 4: Different inputs get different letters

This is one of the most common interview slip-ups.

```ruby
def match_users_to_products(users, products)
  users.each do |user|
    products.each do |product|
      # compare user and product
    end
  end
end
```

This is **O(n × m)**, not O(n²). If there are 1,000 users and only 5 products, calling it n² badly overstates the cost. Use a separate variable for every independent input.

Likewise, two separate (non-nested) loops over two different arrays are **O(n + m)**.

### Rule 5: Halving or doubling means log

If the loop variable is divided or multiplied by a constant each step (`i /= 2`, `i *= 2`), you're looking at **O(log n)**. If that halving loop sits inside a regular loop over n, you get **O(n log n)**.

### Rule 6: Recursion = (number of calls) × (work per call)

```ruby
def countdown(n)
  return if n <= 1
  countdown(n - 1)
end
```

One call per level, n levels, O(1) work each: **O(n)**.

```ruby
def branch(n)
  return if n <= 1
  branch(n - 1)
  branch(n - 1)
end
```

Two calls per level, n levels deep. The call tree doubles each level: **O(2ⁿ)**.

A handy shortcut for recursion: **O(branches ^ depth)**. One branch with depth n is O(n). Two branches with depth n is O(2ⁿ). Two branches with depth log n (as in merge sort, where the input halves) gives a tree with n leaves, and with O(n) work per level that's O(n log n).

### Rule 7: Built-in methods are not free

This is where Ruby developers get caught most often. Ruby is so expressive that a single, innocent-looking method call can hide an entire loop.

```ruby
def remove_duplicates(nums)
  result = []
  nums.each do |n|
    result << n unless result.include?(n)    # include? is a hidden loop!
  end
  result
end
```

It looks like one loop. But `include?` scans `result` every time, so this is really **O(n²)**. Swap in a `Set` and it drops to **O(n)**:

```ruby
require "set"

def remove_duplicates(nums)
  seen = Set.new
  nums.select { |n| seen.add?(n) }    # add? returns nil if already present
end
```

Or just use `nums.uniq`, which is hash-based and also O(n).

Another classic trap is building strings in a loop:

```ruby
result = ""
words.each { |w| result += w }    # += builds a brand-new string every time: O(n²) overall
words.each { |w| result << w }    # << appends in place: O(n) overall
```

---

## Part 6: Space Complexity

Interviewers ask about memory almost as often as time, and it's easy to forget. The question is: **how much extra memory does your algorithm need as the input grows?**

By convention, we usually measure *auxiliary* space: the memory you allocate beyond the input itself. Say so in the interview if there's any doubt: *"O(1) extra space, not counting the input."*

### What counts toward space

- **New collections you build:** arrays, hashes, sets, strings.
- **Copies:** `map`, `select`, `reverse`, `sort`, `dup`, `+`, and slicing like `arr[1..]` all create new objects.
- **The recursion stack:** every recursive call that hasn't returned yet holds a frame in memory.

### Example: same job, different space

```ruby
# O(n) extra space: builds a whole new reversed array
def reversed(arr)
  arr.reverse
end

# O(1) extra space: swaps in place with two pointers
def reverse_in_place!(arr)
  left, right = 0, arr.length - 1

  while left < right
    arr[left], arr[right] = arr[right], arr[left]
    left  += 1
    right -= 1
  end

  arr
end
```

Both are O(n) time. Only one is O(1) space. Interviewers love asking for the in-place version as a follow-up.

### Recursion uses space, even with no variables

```ruby
def sum_list(arr, i = 0)
  return 0 if i == arr.length
  arr[i] + sum_list(arr, i + 1)
end
```

No arrays are created, but the recursion goes n levels deep before unwinding, so the call stack holds n frames: **O(n) space**. An iterative version would be O(1).

This matters in Ruby specifically, because the call stack is limited. Recursing tens of thousands of levels deep can raise a `SystemStackError`. If the depth could be huge, mention it and offer an iterative alternative.

### Watch out for slicing in recursion

```ruby
def binary_search(arr, target)
  return false if arr.empty?
  mid = arr.length / 2
  return true if arr[mid] == target

  if arr[mid] < target
    binary_search(arr[(mid + 1)..], target)   # creates a new sub-array
  else
    binary_search(arr[0...mid], target)
  end
end
```

Conceptually, every slice is a new array. The safe interview answer is to treat slicing as costing O(k) for a slice of length k, which turns this "binary search" into something slower and hungrier than it looks. (Ruby's interpreter has some internal tricks that can make slices cheaper, but don't rely on that in an interview.) The clean fix is to pass `low` and `high` indices instead of slicing, which keeps it at O(log n) time and O(1) extra space if written as a loop.

---

## Part 7: Ruby Built-in Cost Cheat Sheet

Print this out. Seriously. These are the costs to assume in an interview.

### Array

| Operation | Cost | Notes |
|---|---|---|
| `arr[i]`, `arr[i] = x` | O(1) | Direct index access |
| `push` / `<<` / `pop` | O(1) amortized | Working at the end is cheap |
| `unshift`, `insert(0, x)` | Treat as O(n) | Textbook model: everything shifts over |
| `shift` | Treat as O(n) | Ruby optimizes this internally, but say "use a proper queue" when it matters |
| `include?`, `index`, `find`, `count` | O(n) | Linear scan |
| `delete(x)`, `delete_at(i)` | O(n) | Elements after it shift |
| `min`, `max`, `sum` | O(n) | One pass |
| `sort`, `sort_by` | O(n log n) | Comparison sort |
| `uniq`, `tally`, `group_by`, `to_set` | O(n) | Hash-based |
| `map`, `select`, `reject`, `reverse`, `dup` | O(n) time, O(n) space | All build new arrays |
| `arr + other` | O(n + m) | New combined array |
| `arr[a..b]` (slice) | Treat as O(k) | k = slice length |
| `bsearch` | O(log n) | Array must already be sorted |
| `combination(k)` / `permutation` | O(C(n, k)) / O(n!) | Generates every option |

### Hash and Set

| Operation | Cost | Notes |
|---|---|---|
| `hash[k]`, `hash[k] = v`, `key?`, `delete` | O(1) average | The whole point of a hash |
| `set.include?`, `add`, `add?`, `delete` | O(1) average | Built on a hash |
| `keys`, `values`, `each`, `to_a` | O(n) | Visits every entry |
| `hash.sort_by` | O(n log n) | Returns an array of pairs |

### String

| Operation | Cost | Notes |
|---|---|---|
| `str[i]` | O(1) for simple ASCII strings | Multibyte characters can make it O(n) |
| `str << other` | O(k), k = length appended | Modifies in place |
| `str + other`, `str += other` | O(n + k) | Creates a new string |
| `reverse`, `chars`, `split`, `include?` | O(n) | Linear pass |
| `str == other` | O(n) | Compares character by character |

### Range

| Operation | Cost | Notes |
|---|---|---|
| `(1..n).sum` | O(1) | Uses the formula for integer ranges |
| `(1..n).include?(x)` | O(1) | Compares against the endpoints |
| `(1..n).each`, `to_a` | O(n) | Actually visits every number |

---

## Part 8: Read the Constraints, Guess the Algorithm

Here's a trick that feels like cheating. On coding platforms and in many interviews, the problem tells you the maximum input size. That number quietly tells you how fast your solution needs to be.

| Max input size (n) | Complexity that will likely pass | What that usually means |
|---|---|---|
| n ≤ 10 | O(n!) | Try every permutation |
| n ≤ 20 | O(2ⁿ) | Try every subset, backtracking |
| n ≤ 500 | O(n³) | Triple loops, some DP |
| n ≤ 5,000 | O(n²) | Nested loops are fine |
| n ≤ 1,000,000 | O(n log n) or O(n) | Sorting, hashing, two pointers, sliding window |
| Bigger than that | O(log n) or O(1) | Binary search, math formulas |

> **Ruby-specific caution:** Ruby is an interpreted language and does less raw work per second than compiled languages like C++ or Java. The table above is a good guide, but if you're near the top of a range in Ruby (say, an O(n²) solution with n = 5,000), favor the faster approach when one exists.

Quick reality check: with n = 100,000, an O(n²) algorithm needs around **10 billion** operations, which is far too slow. An O(n log n) algorithm needs about **1.7 million**, which finishes almost instantly.

---

## Part 9: The Rules of Thumb (Your Cheat Card)

If you only have five minutes before an interview, read this list:

1. **One loop over n → O(n).** Two nested loops over n → O(n²).
2. **Steps in sequence add; nested steps multiply.** Keep only the biggest term.
3. **Drop constants.** O(3n + 10) is O(n). Half of n² is still O(n²).
4. **Different inputs, different letters.** Two arrays means O(n + m) or O(n × m), never n².
5. **Halving or doubling → log n.** Halving inside a loop over n → O(n log n).
6. **Sorting costs O(n log n).** If you call `sort`, your solution can't be faster than that (unless the sort is on something tiny).
7. **Hash and Set lookups are O(1).** Array `include?` is O(n). This one swap fixes half of all slow interview solutions.
8. **Built-ins hide loops.** `include?`, `index`, `delete`, `count`, `sum`, `uniq`, `sort`, slicing, and `+=` on strings all cost something.
9. **Recursion: branches ^ depth.** And recursion depth is also your stack space.
10. **Space = new collections + copies + recursion depth.** In-place swaps are O(1).
11. **Plan for the worst case,** but mention the best case if it's interesting.
12. **When unsure, count for a tiny input.** Try n = 4 and n = 8. Did the work double (linear), quadruple (quadratic), or grow by one step (logarithmic)?

---

## Part 10: Saying It Out Loud

Knowing the answer isn't enough; you have to deliver it clearly. Here's a template that works for almost any problem:

> *"Let n be the length of the array. I make one pass over it, and inside the loop I only do hash lookups and inserts, which are O(1) on average. So time is O(n). For space, the hash can hold up to n entries in the worst case, so that's O(n) extra space."*

And when you know a better solution exists but haven't coded it yet:

> *"This brute-force version is O(n²) because of the nested loops. I think we can get it to O(n) by storing what we've seen in a hash, trading O(n) extra space for a much faster runtime. Want me to code that up?"*

That second line, naming a trade-off and offering an improvement, is one of the clearest senior-engineer signals you can send.

---

## Practice: Analyze These

Try each one before peeking at the answer.

**1.**
```ruby
def has_pair_with_sum?(nums, target)
  nums.each_with_index do |a, i|
    ((i + 1)...nums.length).each do |j|
      return true if a + nums[j] == target
    end
  end
  false
end
```

<details>
<summary>Answer</summary>

Time **O(n²)**: nested loops over the same array (roughly n²/2 comparisons, constants dropped). Space **O(1)**: just a few variables.
</details>

**2.**
```ruby
def count_halvings(n)
  steps = 0
  while n > 1
    n /= 2
    steps += 1
  end
  steps
end
```

<details>
<summary>Answer</summary>

Time **O(log n)**: n is halved each step. Space **O(1)**.
</details>

**3.**
```ruby
def top_three(scores)
  scores.sort.reverse.first(3)
end
```

<details>
<summary>Answer</summary>

Time **O(n log n)**: the sort dominates; `reverse` adds O(n), which is smaller. Space **O(n)**: `sort` and `reverse` each build a new array. Bonus point for mentioning `scores.max(3)`, which avoids sorting everything.
</details>

**4.**
```ruby
def common_items(list_a, list_b)
  list_a.select { |item| list_b.include?(item) }
end
```

<details>
<summary>Answer</summary>

Time **O(n × m)**: for each of the n items in `list_a`, `include?` scans all m items in `list_b`. Space **O(n)** in the worst case for the result. The fix: convert `list_b` to a `Set` first, giving O(n + m), or just use `list_a & list_b`.
</details>

**5.**
```ruby
def all_subsets(items)
  return [[]] if items.empty?
  rest = all_subsets(items[1..])
  rest + rest.map { |subset| [items[0]] + subset }
end
```

<details>
<summary>Answer</summary>

Time **O(n × 2ⁿ)**: there are 2ⁿ subsets, and building each one can take up to O(n) work. Space **O(n × 2ⁿ)** to store them all. This is exactly why the constraints table says n ≤ 20 for subset problems.
</details>

**6.**
```ruby
def word_lengths(sentence)
  sentence.split.map(&:length).tally
end
```

<details>
<summary>Answer</summary>

Time **O(n)** where n is the length of the sentence: `split`, `map`, and `tally` are each a single linear pass, and passes in sequence add. Space **O(n)** for the array of words.
</details>

---

## The Takeaway

Complexity analysis isn't about math; it's about *noticing*. Notice the loops, including the hidden ones in Ruby's built-ins. Notice whether they're nested or sequential. Notice when the input gets halved. Notice what you're copying and how deep you're recursing.

Do that consistently, say it out loud clearly, and the dreaded "what's the complexity?" question becomes the easiest points you'll score in the interview.