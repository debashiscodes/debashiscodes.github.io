---
layout: post
title:  "The Elixir Pipe Operator (or: How to read code like English)"
date:   2025-02-09 11:28:41 +0530
categories: Elixir
---

You know the feeling. You're reading some code that looks like this:

```elixir
result = String.upcase(String.trim(String.replace(user_input, " ", "_")))
```

Your brain has to work backwards: "Take user input, replace spaces with underscores, trim it, then uppercase it." It's like reading a sentence written in reverse.

Then someone shows you the pipe operator, and suddenly code reads like English:

```elixir
result = user_input
         |> String.replace(" ", "_")
         |> String.trim()
         |> String.upcase()
```

"Take user input, THEN replace spaces, THEN trim, THEN uppercase." Your brain can finally read left to right, top to bottom.

### **1.** Think like  assembly line

Imagine you're working in a factory that makes custom t-shirts:

#### The old way (nested functions)
```
final_shirt = package(iron(print(cut(fabric))))
```

To understand what happens, you have to read from the inside out:
1. Take fabric
2. Cut it (nested deepest)
3. Print on it
4. Iron it
5. Package it (outermost function)

It's like describing the assembly line backwards: "We package what we ironed from what we printed on what we cut from fabric."

#### The pipe way (assembly line)
```
final_shirt = fabric
              |> cut()
              |> print()
              |> iron()
              |> package()
```

Now it reads exactly like the assembly line works:
1. Start with fabric
2. THEN cut it
3. THEN print on it
4. THEN iron it
5. THEN package it

### **2.** Processing a blog post

Let's say you're building a blog and need to process user input for a post title:

#### The nested nightmare
```elixir
def process_title(raw_title) do
  String.downcase(
    String.replace(
      String.trim(raw_title),
      ~r/[^a-zA-Z0-9\s]/,
      ""
    )
  )
end
```

**What this does:** Take the raw title, trim whitespace, remove special characters, then lowercase it.

**How your brain reads it:** "Lowercase the result of replacing in the result of trimming..." 🤯

#### The pipe paradise
```elixir
def process_title(raw_title) do
  raw_title
  |> String.trim()
  |> String.replace(~r/[^a-zA-Z0-9\s]/, "")
  |> String.downcase()
end
```

**How your brain reads it:** "Take the raw title, THEN trim it, THEN remove special characters, THEN lowercase it." ✨

### **3.** How the pipe actually works (the magic revealed)

The pipe operator `|>` takes whatever is on the left and passes it as the **first argument** to the function on the right:

```elixir
# These are exactly the same:
"hello" |> String.upcase()
String.upcase("hello")

# The pipe just moves the first argument to the left
"hello world" |> String.split(" ")
String.split("hello world", " ")
```

### **4.** A complete real-world example: User registration

Let's build a user registration system step by step:

#### Without pipes (the headache way)
```elixir
def register_user(email, password) do
  case validate_password(
    normalize_email(
      String.trim(
        String.downcase(email)
      )
    ),
    encrypt_password(password)
  ) do
    {:ok, user_data} -> create_user(user_data)
    {:error, reason} -> {:error, reason}
  end
end
```

**Brain explosion level:** Maximum 🤯

#### With pipes (the readable way)
```elixir
def register_user(email, password) do
  with normalized_email <- email |> String.downcase() |> String.trim(),
       valid_email <- normalize_email(normalized_email),
       encrypted_password <- encrypt_password(password),
       {:ok, user_data} <- validate_password(valid_email, encrypted_password) do
    create_user(user_data)
  else
    {:error, reason} -> {:error, reason}
  end
end

# Or even simpler:
def register_user(email, password) do
  email
  |> String.downcase()
  |> String.trim()
  |> normalize_email()
  |> validate_with_password(encrypt_password(password))
  |> create_user_if_valid()
end
```

### **5.** When pipes make the biggest difference

#### Data transformation pipelines
```elixir
# Processing a CSV file
def process_sales_data(csv_content) do
  csv_content
  |> String.split("\n")           # Split into lines
  |> Enum.drop(1)                 # Remove header row
  |> Enum.map(&String.split(&1, ","))  # Split each line by commas
  |> Enum.map(&parse_sale_row/1)  # Convert to structured data
  |> Enum.filter(&valid_sale?/1)  # Keep only valid sales
  |> Enum.map(&calculate_profit/1) # Add profit calculations
  |> Enum.sort_by(& &1.profit, :desc) # Sort by profit
end
```

Try reading that without pipes - your head will spin.

#### API response processing
```elixir
def get_user_summary(user_id) do
  user_id
  |> fetch_user_from_api()
  |> extract_user_data()
  |> add_recent_activity()
  |> format_for_display()
  |> cache_result()
end
```

Each step is clear and obvious.

### **6.** The beautiful thing about debugging

With pipes, debugging becomes trivial. Just add `IO.inspect()` anywhere in the pipeline:

```elixir
def process_title(raw_title) do
  raw_title
  |> String.trim()
  |> IO.inspect(label: "after trim")  # Debug point
  |> String.replace(~r/[^a-zA-Z0-9\s]/, "")
  |> IO.inspect(label: "after cleanup")  # Another debug point
  |> String.downcase()
end
```

You can see exactly what the data looks like at each step of the pipeline.

### **7.** Common beginner mistakes

#### Trying to pipe everything
```elixir
# Don't do this - some things don't need pipes
user_id |> Integer.to_string()  # Overkill for simple operations

# Just do this:
Integer.to_string(user_id)
```

#### Forgetting the first argument rule

```elixir
# This WON'T work - trying to pipe into wrong argument position:
"hello"
|> String.replace("l", "_")  # This works - "hello" becomes first arg
|> String.split(2)           # ERROR - trying to split by number instead of pattern

# This WILL work:
"hello"
|> String.replace("l", "_")  # "he__o"
|> String.split("_")         # ["he", "", "o"] - split by the underscore
```

### **8.** Advanced pipe tricks

#### Using anonymous functions in pipes
```elixir
user_data
|> Map.put(:created_at, DateTime.utc_now())
|> Map.update(:email, "", &String.downcase/1)
|> (&{:ok, &1}).()  # Wrap in {:ok, data} tuple
```

#### Pipe into case statements
```elixir
user_input
|> String.trim()
|> String.downcase()
|> case do
  ""        -> {:error, "Empty input"}
  "quit"    -> {:ok, :quit}
  "exit"    -> {:ok, :quit}
  valid_cmd -> {:ok, valid_cmd}
end
```

### **9.** The mental model shift

Before pipes, you think: "I need to call function A on the result of function B on the result of function C."

After pipes, you think: "I have some data, and I want to put it through this series of transformations."

It's the difference between thinking about function calls and thinking about data flow.

### **10.** Real-world impact on code reviews

#### Before pipes:
```elixir
# Reviewer: "Wait, let me trace through this..."
# *counts parentheses, works backwards*
# "Oh, I see what this does after 30 seconds"
```

#### After pipes:
```elixir
# Reviewer: "Get user, validate, save, send email. Got it."
# *understands immediately*
```

Code reviews become faster because intent is crystal clear.

### **11.** Why other languages are jealous

Languages like JavaScript are adding pipe operators because Elixir developers keep showing off readable code:

```javascript
// JavaScript trying to copy Elixir
const result = data
  |> transform
  |> validate
  |> save;
```

But Elixir had it first, and it's baked into the language's DNA.

### ⚡ TL;DR

The pipe operator isn't just syntax sugar - it's a completely different way of thinking about code. Instead of nesting function calls, you create data transformation pipelines.

Your code becomes:
- **More readable** - flows like English sentences
- **Easier to debug** - inspect data at any point
- **Simpler to modify** - add/remove steps without restructuring
- **Self-documenting** - the pipeline shows the process

Once you start thinking in pipes, you'll wonder how you ever lived without them. And you'll find yourself getting annoyed when other languages make you write nested function calls.

*P.S. - The Elixir developers who write the most maintainable code are usually the ones who embrace pipes early. It changes how you think about data transformation from day one.*
