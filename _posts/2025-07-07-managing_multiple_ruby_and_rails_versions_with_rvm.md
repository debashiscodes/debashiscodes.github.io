---
layout: post
title:  "Managing Multiple Ruby and Rails Versions with RVM"
date:   2025-07-07 11:28:41 +0530
categories: Ruby
private: true
---

## How to Use Multiple Ruby and Rails Versions with RVM

As a Ruby or Ruby on Rails developer, you often find yourself juggling projects that rely on different versions of Ruby or Rails. Luckily, [RVM (Ruby Version Manager)](https://rvm.io/) makes this task painless. In this post, I'll walk you through setting up and managing multiple Ruby and Rails versions using RVM.

## 🧰 What is RVM?

[RVM](https://rvm.io/) is a command-line tool that allows you to easily install, manage, and switch between multiple Ruby environments. This is especially useful when working on legacy apps or testing across versions.

## Installing RVM (If Not Already Installed)
First, install RVM with the latest stable Ruby:

```bash
\curl -sSL https://get.rvm.io | bash -s stable --ruby
```
Reload your shell

```bash
source ~/.rvm/scripts/rvm
```
Verify installation:

```bash
rvm -v
```
## Installing Multiple Ruby Versions
You can install any Ruby version using the rvm install command:

```bash
rvm install 3.4.2
```
List all installed Ruby versions:

```bash
rvm list
```
Switch to a specific version:

```bash
rvm use 3.4.2
```
Set a default Ruby version:

```bash
rvm use 3.4.2 --default
```

## Creating and Using Gemsets
Each Ruby version can have isolated gemsets (great for separating project dependencies):

Create a gemset:

```bash
rvm use 3.4.2
rvm gemset create version_8
```
Use the gemset:

```bash
rvm use 3.4.2@version_8
```
Create and use in one line:

```bash
rvm use 3.4.2@version_8 --create
```
List gemsets:

```bash
rvm gemset list
```
## Installing Rails in a Specific Ruby + Gemset
After switching to the desired Ruby + gemset:

```bash
gem install rails -v 8.0.2
```
Verify Rails:

```bash
rails -v
```
You can now create or run projects using that specific Rails version.

## Making It Project-Specific with `.ruby-version` and `.ruby-gemset`
To ensure your project always uses the correct Ruby and gemset:

Create these two files in your project root:

```bash
echo "3.4.2" > .ruby-version
echo "version_8" > .ruby-gemset
```
Now, every time you cd into the project directory, RVM will automatically switch to the correct environment.

## Switching Between Projects
Just `cd` into your project folder. RVM reads the `.ruby-version` and `.ruby-gemset` files and loads the environment automatically. It’s that easy.

## Cleaning Up
Uninstall Ruby versions:

```bash
rvm uninstall 3.4.2
```

Delete gemsets:

```bash
rvm gemset delete version_8
```

## Conclusion
Using different Ruby and Rails versions is easy with RVM. Just set it up once, and switch between projects without any mess.
