---
title: Arrays — The Workhorse of Every Interview
chapter: 06
---

If DSA interviews had a home team, it would be arrays. By my rough count, somewhere around a third of the questions you'll see are "here's an array, do something clever with it." Strings are basically arrays of characters. Matrices are arrays of arrays. Stacks, queues, heaps, and hash tables are all built on top of arrays under the hood.

So this chapter is a big one. We'll cover how Ruby arrays actually work, how to work with one- and two-dimensional arrays, the cost of every core operation, and, maybe most importantly, which methods to reach for in an interview and which ones will quietly sink you.

---

## Part 1: What an Array Really Is

An array is an **ordered collection of values stored under a single name**, where each value lives at a numbered position called an **index**.

Without arrays, tracking five scores would mean five separate variables. With an array, it's one:

```ruby
scores = [88, 92, 79, 95, 84]

scores[0]        # => 88
scores[3]        # => 95
scores.length    # => 5
```

### Ways to create arrays in Ruby

```ruby
empty   = []
fruits  = ["mango", "kiwi", "papaya", "guava"]
words   = %w[mango kiwi papaya guava]        # same thing, less typing
symbols = %i[draft review published]         # array of symbols
digits  = (1..5).to_a                         # => [1, 2, 3, 4, 5]
zeros   = Array.new(4, 0)                     # => [0, 0, 0, 0]
squares = Array.new(5) { |i| i * i }          # => [0, 1, 4, 9, 16]
```

`Array.new(size) { |i| ... }` is the one to remember for interviews. It's how you build DP tables, visited markers, and grids safely (you'll see why "safely" matters in Part 4).

---

## Part 2: Why Indexing Starts at Zero

Here's the question that shows up in "explain it like I'm a junior" rounds: *why is the first element at index 0 and not 1?*

The answer lives in memory. When an array is created, its slots sit side by side in one continuous block of memory. The computer remembers just one thing: the address where the block starts, called the **base address**. An index isn't really a "position"; it's an **offset** from that starting point.

If the base address is `1000` and each slot takes `8` bytes:

| Index | Address calculation | Address |
|---|---|---|
| 0 | 1000 + 0 × 8 | 1000 |
| 1 | 1000 + 1 × 8 | 1008 |
| 2 | 1000 + 2 × 8 | 1016 |
| 3 | 1000 + 3 × 8 | 1024 |

The first element is zero slots away from the start, so its index is 0. And because finding any element is just one multiplication and one addition, **reading `arr[i]` is O(1)** whether the array has 4 items or 4 million. That single fact is the superpower of arrays.

### "But Ruby arrays can hold anything. How does that work?"

Great question, and a nice one to answer in an interview. A Ruby array can mix types freely:

```ruby
mixed = [42, "hello", :status, nil, [1, 2], { id: 7 }]
```

The trick is that each slot doesn't hold the object itself. It holds a fixed-size **reference** to the object (small values like integers are packed straight into that reference). Since every slot is the same size, the offset math still works, and indexing is still O(1).

### Ruby's friendly extras: negative indices

```ruby
fruits = %w[mango kiwi papaya guava]

fruits[-1]       # => "guava"    last element
fruits[-2]       # => "papaya"   second to last
fruits.first     # => "mango"
fruits.last      # => "guava"
fruits[10]       # => nil        no error!
fruits.fetch(10) # => IndexError raised
```

Notice that reading past the end returns `nil` instead of crashing. That's convenient, but it can hide bugs. When an out-of-bounds read would mean a logic error, use `fetch`.

---

## Part 3: Static Arrays vs. Ruby's Dynamic Arrays

In lower-level languages, the classic array is **static**: you declare its size up front, it holds one type of value, and it can never grow. Need more room? You allocate a bigger block yourself and copy everything over.

Ruby arrays are **dynamic**. They grow and shrink as needed, hold any mix of types, and come with a huge library of built-in methods:

| | Static array (low-level languages) | Ruby `Array` |
|---|---|---|
| Size | Fixed at creation | Grows and shrinks automatically |
| Element types | All the same type | Any mix of types |
| Built-in methods | None; you write your own loops | Hundreds: `map`, `select`, `sort`, `tally`, ... |
| Index access | O(1) | O(1) |

### How a dynamic array grows (a favorite interview follow-up)

If memory is a fixed block, how can Ruby keep appending forever? It cheats, cleverly. Behind the scenes, the array reserves extra **capacity**. When it runs out, it allocates a bigger block (typically about double the size), copies everything over, and carries on.

Here's a simplified version built from scratch, which is a great exercise to have in your back pocket:

```ruby
class DynamicArray
  def initialize
    @capacity = 1
    @size     = 0
    @store    = Array.new(@capacity)   # pretend this is a fixed-size block
  end

  def push(value)
    resize(@capacity * 2) if @size == @capacity
    @store[@size] = value
    @size += 1
    self
  end

  def [](index)
    unless index.between?(0, @size - 1)
      raise IndexError, "index #{index} out of bounds"
    end
    @store[index]
  end

  def size = @size

  private

  def resize(new_capacity)
    new_store = Array.new(new_capacity)
    @size.times { |i| new_store[i] = @store[i] }   # the expensive copy
    @store    = new_store
    @capacity = new_capacity
  end
end

list = DynamicArray.new
10.times { |i| list.push(i * 10) }
list[7]      # => 70
list.size    # => 10
```

**So is `push` O(1) or O(n)?** Most pushes are O(1). Occasionally one triggers a copy, which is O(n). But because the capacity doubles each time, those copies get rarer and rarer. Across n pushes, the total copying adds up to less than 2n, so the *average* cost per push is constant. That's what **amortized O(1)** means, and saying that phrase correctly in an interview earns real credit.

---

## Part 4: One-Dimensional and Two-Dimensional Arrays

### One-dimensional arrays

A plain list of values, accessed with a single index. This is what we've been using so far.

**Why they're great:** dead simple, O(1) access by index, and fast to scan from start to finish because the elements sit next to each other in memory (computers are very good at reading memory in order).

**Where they show up in DSA:**

- Storing lists of things: scores, prices, timestamps, user IDs.
- Searching and sorting: linear search, binary search, every sorting algorithm.
- Dynamic programming: a 1D table where `dp[i]` stores the answer for the first i items.

```ruby
# A 1D DP table: ways to climb n stairs taking 1 or 2 steps at a time
def climb_stairs(n)
  return 1 if n <= 1
  ways = Array.new(n + 1, 0)
  ways[0] = ways[1] = 1
  (2..n).each { |i| ways[i] = ways[i - 1] + ways[i - 2] }
  ways[n]
end

climb_stairs(5)   # => 8
```

### Two-dimensional arrays (matrices and grids)

An array whose elements are themselves arrays, giving you rows and columns. You reach a cell with two indices: `grid[row][col]`.

```ruby
grid = Array.new(3) { Array.new(4, 0) }   # 3 rows, 4 columns, all zeros
grid[1][2] = 7

grid
# => [[0, 0, 0, 0],
#     [0, 0, 7, 0],
#     [0, 0, 0, 0]]

rows = grid.length       # => 3
cols = grid[0].length    # => 4
```

> **The number one 2D bug in Ruby:** `Array.new(3, Array.new(4, 0))` looks identical but creates **one** row shared three times. Change `grid[0][0]` and every row changes. Always use the block form, `Array.new(3) { Array.new(4, 0) }`, so each row is its own array.

**Where grids show up in DSA:**

- Grid problems: mazes, islands, flood fill, shortest path on a board, game boards like tic-tac-toe or Sudoku.
- Dynamic programming: 2D tables for problems like longest common subsequence, edit distance, and knapsack.
- Graphs: an **adjacency matrix**, where `matrix[a][b] = 1` means there's an edge from node a to node b.
- Images: a picture is literally a grid of pixel values.

### Walking a grid

```ruby
grid.each_with_index do |row, r|
  row.each_with_index do |value, c|
    puts "(#{r}, #{c}) = #{value}"
  end
end
```

Visiting every cell is **O(rows × cols)**. Say it that way in interviews, not O(n²), unless the grid is guaranteed to be square.

### Moving to neighbors safely

Almost every grid problem asks you to look up, down, left, and right. Here's the pattern I use every time:

```ruby
DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]].freeze   # up, down, left, right

def neighbors(grid, r, c)
  DIRECTIONS.filter_map do |dr, dc|
    nr, nc = r + dr, c + dc
    [nr, nc] if nr.between?(0, grid.length - 1) && nc.between?(0, grid[0].length - 1)
  end
end

neighbors(grid, 0, 0)   # => [[1, 0], [0, 1]]
```

> **A Ruby-specific trap:** without that bounds check, `grid[r - 1]` when `r` is 0 becomes `grid[-1]`, which silently returns the *last* row instead of failing. Your code "works" and gives wrong answers. In other languages that's a crash you'd notice immediately; in Ruby it's a sneaky bug. Always check bounds explicitly.

### Handy matrix one-liners

```ruby
matrix = [[1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]]

matrix.transpose                 # => [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
matrix.transpose.map(&:reverse)  # rotate 90° clockwise
                                 # => [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
matrix.flatten                   # => [1, 2, 3, 4, 5, 6, 7, 8, 9]
matrix.map(&:sum)                # row sums    => [6, 15, 24]
matrix.transpose.map(&:sum)      # column sums => [12, 15, 18]
(0...3).map { |i| matrix[i][i] } # diagonal    => [1, 5, 9]
```

Interviewers sometimes ask you to rotate a matrix *in place* without `transpose`. Know the one-liner, but be ready to do the manual version too.

---

## Part 5: Core Operations and What They Cost

Every array operation boils down to four families: **insert**, **delete**, **search**, and **traverse**. The cost depends almost entirely on *where* in the array you're working.

The mental model: **the end of an array is cheap; the front and middle are expensive**, because everything after the change point has to shift over.

### Insertion

```ruby
nums = [10, 20, 30]

nums.push(40)        # add to end        => [10, 20, 30, 40]
nums << 50           # same as push      => [10, 20, 30, 40, 50]
nums.unshift(5)      # add to front      => [5, 10, 20, 30, 40, 50]
nums.insert(2, 15)   # add at index 2    => [5, 10, 15, 20, 30, 40, 50]
```

### Deletion

```ruby
nums = [5, 10, 15, 20, 30, 40, 50]

nums.pop             # remove from end    => returns 50
nums.shift           # remove from front  => returns 5
nums.delete_at(1)    # remove at index 1  => returns 15
nums.delete(30)      # remove by value    => returns 30 (removes ALL 30s!)
nums                 # => [10, 20, 40]
```

### Searching

```ruby
nums = [4, 8, 15, 16, 23, 42]

nums.include?(15)              # => true
nums.index(16)                 # => 3
nums.index(99)                 # => nil  (not -1!)
nums.find { |n| n > 10 }       # => 15   first match
nums.any? { |n| n > 40 }       # => true
nums.bsearch { |n| n >= 16 }   # => 16   only on sorted arrays
```

### Traversal

```ruby
nums.each { |n| puts n }                       # visit each
nums.each_with_index { |n, i| puts "#{i}: #{n}" }
doubled = nums.map { |n| n * 2 }               # new array
evens   = nums.select(&:even?)                 # new filtered array
total   = nums.sum

# Index-based loop, for when you need control over the index
i = 0
while i < nums.length
  puts nums[i]
  i += 1
end
```

### The complexity table

| Operation | Methods | Time | Extra space |
|---|---|---|---|
| Read / write by index | `arr[i]`, `arr[i] = x` | O(1) | O(1) |
| Add to end | `push`, `<<` | O(1) amortized | O(1) |
| Remove from end | `pop` | O(1) | O(1) |
| Add to front | `unshift` | O(n) | O(1) |
| Remove from front | `shift` | Treat as O(n)* | O(1) |
| Insert in middle | `insert(i, x)` | O(n) | O(1) |
| Delete in middle | `delete_at(i)` | O(n) | O(1) |
| Delete by value | `delete(x)` | O(n) | O(1) |
| Search unsorted | `include?`, `index`, `find` | O(n) | O(1) |
| Search sorted | `bsearch` | O(log n) | O(1) |
| Traverse | `each`, `each_with_index`, `while` | O(n) | O(1) |
| Transform | `map`, `select`, `reject` | O(n) | O(n) |
| Sort | `sort`, `sort_by` | O(n log n) | O(n) |

\* Ruby's interpreter has an internal optimization that often makes `shift` fast in practice, but the textbook answer is O(n), and that's what interviewers expect. If you need a queue in a performance-sensitive loop, say so and reach for a proper queue structure (we'll build one later in the book).

---

## Part 6: Methods to Reach For in Interviews

These methods make solutions shorter, clearer, and often faster. Know each one and its cost.

| Method | What it does | Example |
|---|---|---|
| `each_with_index` | Value and index together | `nums.each_with_index { \|n, i\| ... }` |
| `each_cons(k)` | Every window of k neighbors | `[1,2,3,4].each_cons(2).to_a # => [[1,2],[2,3],[3,4]]` |
| `each_slice(k)` | Non-overlapping chunks | `[1,2,3,4,5].each_slice(2).to_a # => [[1,2],[3,4],[5]]` |
| `each_with_object` | Build a hash or array as you go | `words.each_with_object(Hash.new(0)) { \|w, h\| h[w] += 1 }` |
| `tally` | Frequency count | `%w[a b a].tally # => {"a"=>2, "b"=>1}` |
| `group_by` | Bucket by a key | `words.group_by(&:length)` |
| `partition` | Split in two by a condition | `nums.partition(&:even?)` |
| `zip` | Pair up two arrays | `[1,2].zip([:a,:b]) # => [[1,:a],[2,:b]]` |
| `sum`, `minmax` | Totals and extremes in one pass | `[3,1,4].minmax # => [1, 4]` |
| `max_by`, `min_by` | Extreme by a custom rule | `words.max_by(&:length)` |
| `max(k)`, `min(k)` | Top k without a full sort | `scores.max(3)` |
| `sort_by` | Sort by a computed key | `people.sort_by { \|p\| [-p.age, p.name] }` |
| `filter_map` | Select and transform in one pass | `nums.filter_map { \|n\| n * 2 if n.odd? }` |
| `bsearch` | Binary search on sorted data | `sorted.bsearch { \|x\| x >= target }` |
| `rotate` | Shift elements circularly | `[1,2,3,4].rotate(1) # => [2,3,4,1]` |
| `Array.new(n) { }` | Safe initialization | `Array.new(3) { [] }` |
| `fetch` | Index read that fails loudly | `arr.fetch(i)` |

---

## Part 7: Methods and Habits to Avoid

These are the traps I see Ruby candidates fall into again and again. Each one either produces wrong answers or silently wrecks your complexity.

### 1. `Array.new(n, [])` or `Array.new(n, {})`

```ruby
buckets = Array.new(3, [])
buckets[0] << "x"
buckets   # => [["x"], ["x"], ["x"]]    one array, shared three times
```

**Use instead:** `Array.new(3) { [] }`

### 2. `include?` or `index` inside a loop

```ruby
nums.each { |n| result << n unless result.include?(n) }   # O(n²)
```

**Use instead:** a `Set` or a `Hash` for lookups (O(1) each), or just `uniq`.

### 3. `arr = arr + [x]` inside a loop

```ruby
result = []
nums.each { |n| result = result + [n * 2] }   # copies the whole array every time: O(n²)
```

**Use instead:** `result << n * 2`, or better, `nums.map { |n| n * 2 }`.

### 4. Changing an array's length while iterating over it

```ruby
nums = [2, 4, 6, 7]
nums.each_with_index { |n, i| nums.delete_at(i) if n.even? }
nums   # => [4, 7]    4 was skipped!
```

Deleting shifts every later element left, so the loop jumps over the next one.

**Use instead:** `nums.reject!(&:even?)` or `nums.delete_if(&:even?)`, or build a new array with `reject`.

### 5. Chaining bang methods

Many bang methods return `nil` when they make no changes:

```ruby
[3, 1, 2].uniq!          # => nil (no duplicates, so nothing changed)
[3, 1, 2].uniq!.sort     # NoMethodError: undefined method `sort' for nil
```

The same applies to `compact!`, `flatten!`, `reject!`, and `select!`.

**Use instead:** the non-bang versions when chaining (`uniq.sort`), or call bang methods on their own line.

### 6. Expecting `delete` to remove one item

```ruby
nums = [1, 2, 2, 3]
nums.delete(2)
nums   # => [1, 3]    both 2s are gone
```

**Use instead:** to remove just the first match, `i = nums.index(2); nums.delete_at(i) if i`.

### 7. Expecting `-1` when something isn't found

`index`, `find`, and `bsearch` return `nil`, not `-1`. If a problem asks you to return `-1`, convert explicitly: `nums.index(target) || -1`.

### 8. Assuming `dup` copies a grid

```ruby
copy = grid.dup
copy[0][0] = 99    # also changes grid[0][0]!
```

`dup` is shallow: you get a new outer array pointing at the same rows.

**Use instead:** `grid.map(&:dup)` for a 2D copy.

### 9. Using a `for` loop

```ruby
for n in nums
  # works, but `n` leaks out of the loop into the surrounding scope
end
```

Idiomatic Ruby uses `each`. In an interview, `for` signals "I'm translating from another language." Use `each`, `times`, `upto`, or `while` when you need manual control.

### 10. `sort` when you only need the top few

```ruby
scores.sort.reverse.first(3)   # sorts everything: O(n log n)
scores.max(3)                  # cleaner, and avoids sorting the whole array
```

### 11. `inject(:+)` for totals

`sum` is clearer, faster, and more accurate for floating-point numbers. Save `inject`/`reduce` for when you genuinely need a custom accumulator.

### 12. `count` when you mean `length`

`length` and `size` are O(1). `count` with a block scans the whole array. Use `count` only when you're actually counting matches: `nums.count(&:even?)`.

---

## Part 8: A Word on Built-ins in Interviews

Ruby's built-in methods are a genuine advantage, but use them wisely:

- **If the built-in *is* the problem, don't use it.** If you're asked to "reverse an array," calling `reverse` misses the point. Write the two-pointer version.
- **If the built-in is a step along the way, use it and name its cost.** "I'll sort first with `sort`, which is O(n log n), then do a single pass."
- **When in doubt, ask.** "Is it okay if I use `tally` here, or would you like to see the counting done manually?" Interviewers appreciate the question, and it shows you know what the method does underneath.

---

## Part 9: Warm-Up Problems

These four come up constantly, either directly or as building blocks of harder questions.

### 1. Move all zeros to the end, keeping the order of everything else (in place)

```ruby
# Time: O(n)   Space: O(1)
def move_zeroes!(nums)
  write = 0

  nums.each_index do |read|
    next if nums[read].zero?
    nums[write] = nums[read]
    write += 1
  end

  (write...nums.length).each { |i| nums[i] = 0 }
  nums
end

move_zeroes!([0, 1, 0, 3, 12])   # => [1, 3, 12, 0, 0]
```

The **read/write pointer** idea is one of the most reusable tricks in array problems. (Writing values while iterating is safe here because the array's length never changes.)

### 2. Rotate an array to the right by k steps (in place)

```ruby
# Time: O(n)   Space: O(1)
def rotate_right!(nums, k)
  n = nums.length
  return nums if n.zero?

  k %= n                         # rotating by n is the same as not rotating
  reverse_range!(nums, 0, n - 1) # reverse everything
  reverse_range!(nums, 0, k - 1) # reverse the first k
  reverse_range!(nums, k, n - 1) # reverse the rest
  nums
end

def reverse_range!(nums, left, right)
  while left < right
    nums[left], nums[right] = nums[right], nums[left]
    left  += 1
    right -= 1
  end
end

rotate_right!([1, 2, 3, 4, 5, 6, 7], 3)   # => [5, 6, 7, 1, 2, 3, 4]
```

The Ruby shortcut is `nums.rotate(-k)`. Mention it, but the triple-reverse trick is what the interviewer wants to see.

### 3. Find the second-largest distinct value in one pass

```ruby
# Time: O(n)   Space: O(1)
def second_largest(nums)
  first = second = -Float::INFINITY

  nums.each do |n|
    if n > first
      second = first
      first  = n
    elsif n > second && n < first
      second = n
    end
  end

  second == -Float::INFINITY ? nil : second
end

second_largest([3, 5, 5, 2])   # => 3
second_largest([7, 7])         # => nil
```

Sorting would work too, but at O(n log n). Doing it in one pass shows you're thinking about cost.

### 4. Answer many "sum of a range" questions quickly (prefix sums)

```ruby
nums   = [3, 1, 4, 1, 5, 9]
prefix = nums.each_with_object([0]) { |n, acc| acc << acc.last + n }
# prefix => [0, 3, 4, 8, 9, 14, 23]

# Sum of nums[left..right] in O(1)
def range_sum(prefix, left, right)
  prefix[right + 1] - prefix[left]
end

range_sum(prefix, 1, 3)   # => 1 + 4 + 1 = 6
```

Build once in O(n), then answer every range question in O(1). Prefix sums will come back again and again throughout this book.

---

## The Takeaway

Arrays are fast at the end and slow at the front. Reading by index is O(1) because of simple offset math. Ruby's dynamic arrays grow by doubling, which makes `push` amortized O(1). Grids are just arrays of arrays, and they deserve careful bounds checks in Ruby because negative indices won't warn you.

Most importantly: learn the handful of methods that make array problems elegant, and learn the dozen habits that silently turn O(n) into O(n²). Master both lists, and you'll walk into any array question with confidence.