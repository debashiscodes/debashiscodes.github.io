---
layout: post
title:  "Rails Performance Tip: Check Record Existence Efficiently"
date:   2025-11-22 11:28:41 +0530
categories: Rails
private: true
---

There are different ways to check whether a record exists in a database in Rails. Methods like present?, any?, empty?, and exists? can be used to check if a record is present in the database.

Generally, these methods return true if the record exists and false if it doesn’t. However, they differ in how they load and check the record.

## Schema
![exists](/assets/schema.png)

## .present?
![present?](/assets/present.png)

The .present? method in the above ActiveRecord query first loads the data into memory, creates ActiveRecord objects, and then checks whether the result is empty or not. If it’s not empty, it returns true; otherwise, it returns false.

This approach takes more time because it loads records into memory. For large datasets, it can be slower.
## .any?
![Alt text for the image](/assets/any.png)

## .empty?
![Alt text for the image](/assets/empty.png)

## .exists?
![Alt text for the image](/assets/exists.png)

The above three methods are faster than .present? because they use a SELECT 1 with LIMIT 1 approach.
