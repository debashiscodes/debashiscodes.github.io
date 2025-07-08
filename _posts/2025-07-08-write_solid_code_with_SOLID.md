---
layout: post
title:  "Write Solid Code With SOLID"
date:   2025-07-08 11:28:41 +0530
categories: Ruby
---
Let's explain the **SOLID principles** using the **characters and situations** from the beloved village drama *Panchayat* on `PrimeVideo`!

## 🎭 Meet the Characters:

- **Abhishek Tripathi** – Engineering graduate, reluctant Gram Sachiv
- **Pradhan Ji (Manju Devi)** – The official head, but prefers chill life
- **Brij Bhushan Dubey (Pradhan-Pati)** – The unofficial decision-maker
- **Vikas** – Loyal and energetic assistant
- **Prahlad Pandey** – Deputy Pradhan and friend with a funny bone
- **Banrakas** – The forever-complaining opposition

## 🧠 Now, Let’s Learn SOLID with Them!

### 1. **S — Single Responsibility Principle (SRP)**

> **Every character should stick to their job!**

#### ❌ Wrong Example:

If **Vikas** starts handling all of Abhishek’s office work, leading meetings, fixing the water tank, and dealing with Banrakas...

Abhishek will say:
*"Toh fir main kya karun yahan?!"*

#### ✅ Right Way:

- Abhishek = Administration
- Vikas = Ground support
- Manju Devi = Signature authority
- Brij Bhushan = Guidance (unofficial 😅)
- Prahlad = Local issues & support

🎯 One person = One responsibility

### 2. **O — Open/Closed Principle (OCP)**

> **Add new systems without breaking the old ones**

Let’s say the village introduces a **solar panel project**.

For years, villagers used the **old electricity grid** for power.
It worked, but **bills were high** and **outages were frequent**.

The **Panchayat introduces a solar panel system** to supplement the power.

---

But here’s the smart part:
They **don’t remove or modify the old electric wiring** — they simply **add the solar system** on top of the existing setup.

---

Now:

- 🌞 **Daytime** = Solar powers homes
- ⚡ **Nighttime or cloudy** = Old grid takes over


✅ System is **open for extension**, but **closed for modification**

### 3. **L — Liskov Substitution Principle (LSP)**

> **Replace one role without breaking the system**

If **Abhishek** goes for training and **Ganesh Ji** temporarily fills in as Sachiv, the system should still run smoothly:

- Vikas still coordinates
- Villagers still come for help
- Pradhan Ji still signs (reluctantly 😄)

But if Ganesh Ji refuses to use a computer?

Brij Bhushan will say:
*"Yeh toh bilkul bhi kaam ka nahi hai!"*

🎯 Substitutes must fulfill the same expectations.

### 4. **I — Interface Segregation Principle (ISP)**

> **Don’t give every task to one person**

Imagine if **Manju Devi** is forced to:

- Write letters
- Handle construction
- Negotiate with MLAs
- Do interviews
- Sign documents

She’ll say:
*"Humse yeh sab na ho payega!"*

✅ Give her **only the role she’s meant for** — approvals and signatures.

🎯 Avoid bloated responsibilities.

### 5. **D — Dependency Inversion Principle (DIP)**

> **Depend on contracts, not specific people**

Suppose the village development depends **only** on Abhishek...

If he quits, the system collapses.

✅ Instead: The system should work with **any trained Sachiv**, because the **roles and rules are clear**, not person-specific.

🎯 Depend on **abstract behavior**, not a specific person.


## 🎉 Final Recap – Panchayat Style

| Principle | Panchayat Style Explanation                                       |
|-----------|-------------------------------------------------------------------|
| SRP       | Each person does their own job (Sachiv ≠ Vikas ≠ Pradhan)        |
| OCP       | Add new projects without changing the old structure              |
| LSP       | Replace Abhishek with Ganesh Ji, and the show still works        |
| ISP       | Don’t overload Manju Devi with all tasks                         |
| DIP       | Village depends on the Sachiv *role*, not Abhishek personally    |

