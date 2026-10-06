---
layout: post
title:  "Write Solid Code With SOLID"
date:   2025-07-02 11:28:41 +0530
categories: Ruby
private: true
---
Let's explain the `SOLID` principles using the characters and situations from the beloved village Indian drama *Panchayat* on `PrimeVideo`!

## Meet the Characters

- `Abhishek Tripathi` – Engineering graduate, reluctant Gram Sachiv
- `Pradhan Ji (Manju Devi)` – The official head, but prefers chill life
- `Brij Bhushan Dubey (Pradhan-Pati)` – The unofficial decision-maker
- `Vikas` – Loyal and energetic assistant
- `Prahlad Pandey` – Deputy Pradhan and friend with a funny bone
- `Banrakas` – The forever-complaining opposition

## Let’s Learn SOLID with Them

### **1. S — Single Responsibility Principle (SRP)**
> *Every character should stick to their job!*

#### ❌ Wrong Example:
If **Vikas** starts handling all of Abhishek’s office work, leading meetings, fixing the water tank, and dealing with Banrakas...

#### ✅ Right Way:
- **Abhishek** = Administration
- **Vikas** = Ground support
- **Manju Devi** = Signature authority
- **Brij Bhushan** = Guidance (unofficial 😅)
- **Prahlad** = Local issues & support

*One person = One responsibility*

### **2. O — Open/Closed Principle (OCP)**
> *Add new systems without breaking the old ones*

Let’s say the village introduces a **solar panel project**.

Previously, they used the **old electricity grid**. It worked, but:
- Bills were high
- Outages were frequent

Now, the **Panchayat introduces solar panels** to supplement the system.

#### Smart Move:
They **don’t remove or modify** the old grid — just **add the solar system** on top.

**Now:**
- 🌞 **Daytime** = Solar powers homes
- ⚡ **Night/cloudy** = Old grid takes over

*System is open for extension, but closed for modification*

### **3. L — Liskov Substitution Principle (LSP)**
> *Replace one role without breaking the system*

If **Abhishek** goes for training and **Ganesh Ji** fills in temporarily:

- Vikas still coordinates
- Villagers still come
- Pradhan Ji still signs (reluctantly 😄)

But if Ganesh Ji refuses to use a computer?

*Substitutes must fulfill the same expectations*

### **4. I — Interface Segregation Principle (ISP)**
> *Don’t give every task to one person*

Imagine if **Manju Devi** is forced to:
- Write letters
- Handle construction
- Negotiate with MLAs
- Do interviews
- Sign documents

✅ *Give her only the role she’s meant for — approvals and signatures*

*Avoid bloated responsibilities*

### **5. D — Dependency Inversion Principle (DIP)**
> *Depend on contracts, not specific people*

Suppose development depends **only** on Abhishek...

If he quits, the system collapses.

Instead: Ensure **any trained Sachiv** can step in — because the **system is based on roles and clear rules**, not specific people.

*Depend on abstract behavior, not individual presence*

## 🎉 Final Recap – Panchayat Style

| **Principle** | **Panchayat Style Explanation**                                 |
|---------------|------------------------------------------------------------------|
| **SRP**       | Each person does their own job (Sachiv ≠ Vikas ≠ Pradhan)       |
| **OCP**       | Add new projects without changing the old structure             |
| **LSP**       | Replace Abhishek with Ganesh Ji, and the show still works       |
| **ISP**       | Don’t overload Manju Devi with all tasks                        |
| **DIP**       | Village depends on the Sachiv *role*, not Abhishek personally   |


