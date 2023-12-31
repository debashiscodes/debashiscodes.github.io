---
title: How to Count the Number of Elements in an Array in Ruby?
date: 2023-12-30
tags:
  - code
  - ruby
---

## Problem:

You want to find the number of elements in an Array in Ruby.

## Example:

```ruby
contacts = [9439274937, 8888888888, 9999999999, 1111111111, 2222222222]
```

We want to find how many elements are present in the above array contacts.
Elements present in the array contacts is 5.

## Solution:

We can get the total count of the number of elements in a Ruby array by using the Array#length, Array#count or Array#size method. Any of the three methods will give you the length of an array.

```ruby
puts contacts.length #=> 5
puts contacts.size #=> 5
puts contacts.count #=> 5
```
