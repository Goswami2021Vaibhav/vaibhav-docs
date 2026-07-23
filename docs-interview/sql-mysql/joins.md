---
title: Joins
description: INNER, LEFT, RIGHT, and FULL joins, and when to use each.
sidebar_position: 5
---

# Joins

## 1. What is a JOIN, and why is it needed in a relational database?

### 📖 Introduction

Normalization, covered in full in the Database Design chapter, deliberately splits related data across multiple tables — `JOIN` is the mechanism that puts that same related data back together at query time.

### 🔗 What a JOIN Does

A `JOIN` combines rows from two or more tables based on a related column between them, typically a foreign key referencing another table's primary key, both covered in full in the Keys & Relationships chapter later in this guide — producing a single result set that draws from multiple tables at once.

### 🎯 Why It's Needed

Since normalization splits a customer's details from their orders into two separate tables, covered throughout the Database Design chapter, retrieving "this order, along with the customer's name" genuinely requires combining data from both tables — exactly what `JOIN` exists to do.

### 🖼️ A Concrete Illustration

```sql
SELECT orders.id, customers.name
FROM orders
JOIN customers ON orders.customer_id = customers.id;
```

Combines each order with its corresponding customer's name, matched via the `customer_id` foreign key referencing `customers.id`.

### 💎 Good to Know: JOIN Is Normalization's Necessary Counterpart, Not a Separate, Unrelated Feature

The genuinely important framing is that `JOIN` and normalization are two halves of the same overall design — normalization keeps data non-redundant by splitting it apart, and `JOIN` is precisely what lets that same split data be recombined whenever a query actually needs the full picture.

### ❓ Follow-up Interview Questions

1. Why does normalization, covered in the Database Design chapter, make JOINs necessary in the first place?
2. What role does a foreign key play in determining how two tables get joined together?
3. In the concrete example, what would happen if `orders.customer_id` didn't match any row in `customers`?
4. Why is JOIN described as normalization's "necessary counterpart" rather than an unrelated, separate feature?
5. What would querying data without any JOIN support look like, given a fully normalized schema?

---

## 2. What is an INNER JOIN, and how does it differ from an OUTER JOIN?

### 📖 Introduction

This is the foundational distinction every other join type covered in this chapter builds on — whether unmatched rows get included in the result or excluded entirely.

### 🎯 INNER JOIN

Returns only the rows where a match exists in both joined tables — any row from either table with no corresponding match on the other side is excluded from the result entirely.

### 🌐 OUTER JOIN

Returns matched rows, but also includes unmatched rows from at least one side of the join, filling in `NULL`, covered in the Filtering, Sorting & Grouping chapter's discussion of NULL behavior, for the columns that have no match — covered in full, with its three specific variants (LEFT, RIGHT, FULL), later in this chapter.

### 🖼️ A Concrete Illustration

```sql
SELECT customers.name, orders.id
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id;
```

Returns only customers who have placed at least one order — a customer with zero orders simply doesn't appear in the result at all, since `INNER JOIN` excludes unmatched rows.

### 💎 Good to Know: INNER Is the Default JOIN Type When Just "JOIN" Is Written

Writing `JOIN` without specifying `INNER` or `OUTER` defaults to an `INNER JOIN` in MySQL — worth knowing explicitly, since the plain word "JOIN" alone doesn't unambiguously communicate which behavior is intended without this default in mind.

### ❓ Follow-up Interview Questions

1. Why does a customer with zero orders not appear at all in the INNER JOIN example?
2. What does an OUTER JOIN do differently with unmatched rows compared to an INNER JOIN?
3. Why does plain `JOIN`, with no qualifier, default to `INNER JOIN` specifically?
4. What gets filled in for the missing side's columns when an OUTER JOIN includes an unmatched row?
5. How would you decide whether a specific query genuinely needs an INNER JOIN or an OUTER JOIN?

---

## 3. What is a LEFT JOIN, and when would you use it?

### 📖 Introduction

`LEFT JOIN` is the most commonly used of the three OUTER JOIN variants, covered in the previous question — worth understanding precisely, since "left" specifically refers to which table's unmatched rows get preserved.

### ⬅️ What LEFT JOIN Does

Returns every row from the left (first-listed) table, along with any matching rows from the right table — if a left-table row has no match on the right, the result still includes that left-table row, with `NULL` filling in every column that would have come from the right table.

### 🖼️ A Concrete Illustration

```sql
SELECT customers.name, orders.id
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;
```

Returns every customer, including ones who have never placed an order — for those customers, `orders.id` simply appears as `NULL`, rather than that customer being excluded from the result the way an `INNER JOIN`, covered in the previous question, would exclude them.

### 🎯 A Common, Genuinely Practical Use Case

Finding rows in the left table that have no corresponding match at all — `WHERE orders.id IS NULL` after the `LEFT JOIN` above specifically identifies customers who have never placed a single order, a query pattern that would be impossible to express with an `INNER JOIN` alone.

### 💎 Good to Know: LEFT JOIN Preserves "Everything on the Left, Matched or Not"

The clean mental model: `LEFT JOIN` guarantees every row from the left table appears in the result at least once, regardless of whether a match exists — exactly the property that makes it the right tool for finding unmatched left-side rows.

### ❓ Follow-up Interview Questions

1. Why does a customer with no orders still appear in the LEFT JOIN result, unlike with an INNER JOIN?
2. What gets filled in for `orders.id` when a customer has no matching order row?
3. How does `WHERE orders.id IS NULL` after a LEFT JOIN find customers who've never ordered anything?
4. Why couldn't this same "find unmatched rows" query be written using an INNER JOIN instead?
5. Why does the term "left" specifically refer to the first-listed table in the JOIN?

---

## 4. What is a RIGHT JOIN, and how does it differ from a LEFT JOIN?

### 📖 Introduction

`RIGHT JOIN` is the mirror image of `LEFT JOIN`, covered in the previous question — same underlying idea, just preserving the other table's unmatched rows instead.

### ➡️ What RIGHT JOIN Does

Returns every row from the right (second-listed) table, along with any matching rows from the left table — if a right-table row has no match on the left, the result still includes it, with `NULL` filling in every column that would have come from the left table.

### 🖼️ A Concrete Illustration

```sql
SELECT customers.name, orders.id
FROM customers
RIGHT JOIN orders ON customers.id = orders.customer_id;
```

Returns every order, including any that somehow reference a `customer_id` with no matching row in `customers` (which shouldn't normally happen if a foreign key constraint, covered in the Constraints chapter later in this guide, is properly enforced) — in that scenario, `customers.name` would appear as `NULL`.

### 🔄 Why RIGHT JOIN Is Used Less Often in Practice

Since `RIGHT JOIN customers` is functionally identical to swapping the table order and using `LEFT JOIN` instead — `FROM orders LEFT JOIN customers` — most developers default to always writing `LEFT JOIN` and simply reordering the tables as needed, rather than switching between `LEFT` and `RIGHT` depending on which table needs its unmatched rows preserved.

### 💎 Good to Know: RIGHT JOIN Is Rarely Necessary, Precisely Because LEFT JOIN Plus Reordering Achieves the Exact Same Result

Recognizing that any `RIGHT JOIN` can be rewritten as an equivalent `LEFT JOIN` with the table order swapped is why many teams adopt a convention of just using `LEFT JOIN` consistently, rather than mixing both directions across a codebase.

### ❓ Follow-up Interview Questions

1. Why is `RIGHT JOIN` described as the mirror image of `LEFT JOIN`?
2. In the concrete example, under what circumstance would `customers.name` appear as `NULL`?
3. Why can any `RIGHT JOIN` be rewritten as an equivalent `LEFT JOIN` by swapping the table order?
4. Why might a team adopt a convention of always using `LEFT JOIN` rather than mixing `LEFT` and `RIGHT`?
5. What relationship, covered in the Constraints chapter, would normally prevent an order from referencing a non-existent customer?

---

## 5. What is a FULL OUTER JOIN, and how is it emulated in MySQL, which lacks native support for it?

### 📖 Introduction

`FULL OUTER JOIN` is the one join type in this chapter MySQL genuinely doesn't support directly — worth knowing both what it conceptually does and the standard workaround.

### 🌐 What FULL OUTER JOIN Conceptually Does

Returns every row from both tables — matched rows combined normally, plus unmatched rows from the left table (with `NULL` on the right side) and unmatched rows from the right table (with `NULL` on the left side) — effectively combining what `LEFT JOIN` and `RIGHT JOIN`, both covered earlier in this chapter, each do individually into one single result.

### ⚠️ Why MySQL Doesn't Support It Natively

MySQL doesn't provide `FULL OUTER JOIN` as direct syntax, unlike PostgreSQL or SQL Server, tying back to the SQL-standard-versus-implementation-specific differences covered in the Introduction & Fundamentals chapter.

### 🛠️ Emulating It With UNION

```sql
SELECT customers.name, orders.id FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id
UNION
SELECT customers.name, orders.id FROM customers
RIGHT JOIN orders ON customers.id = orders.customer_id;
```

Combining a `LEFT JOIN` and a `RIGHT JOIN` with `UNION` (which automatically removes duplicate rows, unlike `UNION ALL`) reproduces the same overall result a native `FULL OUTER JOIN` would produce.

### 💎 Good to Know: This Is a Direct, Practical Example of MySQL-Specific SQL Differing From the Broader Standard

This emulation is a genuinely concrete instance of the general principle covered in the Introduction & Fundamentals chapter — SQL written for MySQL sometimes needs a different approach than the same logical query would need on another database system that supports the standard syntax directly.

### ❓ Follow-up Interview Questions

1. Why does a FULL OUTER JOIN effectively combine what LEFT JOIN and RIGHT JOIN each do separately?
2. Why does the UNION-based emulation use `UNION` rather than `UNION ALL`?
3. Why doesn't MySQL support `FULL OUTER JOIN` as direct syntax, unlike PostgreSQL?
4. How does this emulation connect to the SQL-versus-MySQL distinction covered in the Introduction & Fundamentals chapter?
5. What would happen if `UNION ALL` were used instead of `UNION` in this emulation?

---

## 6. What is a CROSS JOIN, and when would you use one?

### 📖 Introduction

Every join covered so far in this chapter matches rows based on a related column — `CROSS JOIN` is the one join type that deliberately doesn't.

### ✖️ What CROSS JOIN Does

Produces the Cartesian product of two tables — every single row from the first table paired with every single row from the second table, with no matching condition at all. A table with 10 rows cross-joined with a table with 5 rows produces 50 result rows.

### 🎯 When It's Genuinely Useful

Generating every possible combination of two independent sets — every size paired with every color for a product catalog, or every day of a date range paired with every store location for a reporting query needing a complete grid of combinations, even ones with no actual underlying data yet.

### 🖼️ A Concrete Illustration

```sql
SELECT sizes.name, colors.name
FROM sizes
CROSS JOIN colors;
```

If `sizes` has 3 rows and `colors` has 4 rows, this produces all 12 possible size-and-color combinations — genuinely useful for generating a complete product-variant matrix.

### ⚠️ The Genuine Risk

Accidentally omitting a join condition on what was meant to be a regular `JOIN`, covered earlier in this chapter, effectively produces an unintended `CROSS JOIN` — a serious, common mistake that can silently multiply a result set to an enormous, unexpected size on large tables.

### 💎 Good to Know: An Accidental CROSS JOIN Is One of the Most Common Real-World SQL Mistakes

Recognizing that a missing or incorrect `ON` condition on an intended regular join effectively degrades into a `CROSS JOIN` — producing a vastly, silently inflated result set rather than an error — is a genuinely important debugging instinct to have.

### ❓ Follow-up Interview Questions

1. Why does a CROSS JOIN between a 10-row table and a 5-row table produce exactly 50 rows?
2. What's a genuine, practical use case for deliberately using a CROSS JOIN?
3. Why does an accidentally omitted join condition effectively turn a regular JOIN into a CROSS JOIN?
4. Why might an accidental CROSS JOIN go unnoticed on a small table but cause serious problems on a large one?
5. How would you detect that a query was unintentionally producing a Cartesian product?

---

## 7. What is a self-join, and what's a real-world use case for it?

### 📖 Introduction

Every join covered so far in this chapter has combined two genuinely different tables — a self-join is what happens when a table needs to be joined against itself.

### 🔄 What a Self-Join Is

A self-join is an ordinary `JOIN`, covered throughout this chapter, where a table is joined to itself, typically to compare rows within that same table against each other — made possible in SQL by giving the table two different aliases, so each reference can be distinguished.

### 🖼️ A Concrete Illustration: An Employee-Manager Hierarchy

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
```

Here, `employees` is joined to itself — once aliased as `e` representing the employee, and once as `m` representing that same employee's manager, who is also just another row in the very same `employees` table.

### 🎯 Why This Is a Genuinely Common Real-World Pattern

Any hierarchical relationship stored within a single table — employees reporting to other employees, categories nested within other categories — needs a self-join specifically because the "related" row being looked up lives in that exact same table, rather than in some separate, dedicated table.

### 💎 Good to Know: A Self-Join Is Mechanically Identical to Any Other Join — Only the Table Being Referenced Twice Is Different

The genuinely important insight is that a self-join introduces no new join mechanism at all — it's the exact same `JOIN` syntax covered throughout this chapter, applied to a case where both sides of the relationship happen to live in the same table, distinguished only through aliasing.

### ❓ Follow-up Interview Questions

1. Why does a self-join require aliasing the same table under two different names?
2. In the employee-manager example, why does `m.id` represent a manager rather than a completely separate entity?
3. Why does a hierarchical relationship, like categories nested within categories, typically require a self-join?
4. Is a self-join mechanically different from a regular join between two different tables? Why or why not?
5. How would you extend the employee-manager example to find employees who share the same manager?

---

## 8. What is the difference between an implicit join (comma syntax) and explicit JOIN syntax?

### 📖 Introduction

SQL actually supports two different ways to write a join — one considerably older and more error-prone than the other, worth understanding both to recognize legacy code and explain why the modern syntax is preferred.

### 🗓️ Implicit Join (Comma Syntax)

```sql
SELECT customers.name, orders.id
FROM customers, orders
WHERE customers.id = orders.customer_id;
```

Lists multiple tables separated by commas in the `FROM` clause, with the actual join condition placed entirely inside `WHERE`, covered in the Filtering, Sorting & Grouping chapter — an older style predating the more explicit `JOIN` keyword.

### ✍️ Explicit JOIN Syntax

```sql
SELECT customers.name, orders.id
FROM customers
JOIN orders ON customers.id = orders.customer_id;
```

Uses the dedicated `JOIN` keyword with its own `ON` clause specifically for the join condition, keeping it visually and conceptually separate from any additional filtering conditions in `WHERE`.

### ⚠️ Why Explicit Syntax Is Strongly Preferred

The comma syntax makes it dangerously easy to accidentally omit the join condition from `WHERE` entirely, silently producing an unintended `CROSS JOIN`, covered earlier in this chapter — the explicit `JOIN ... ON` syntax makes the join condition mandatory and visually distinct, considerably harder to accidentally omit or lose track of, especially once several tables and several filtering conditions are involved in the same query.

### 💎 Good to Know: Explicit JOIN Syntax Isn't Just Stylistic — It Genuinely Prevents a Common Class of Mistake

Recognizing that this preference is a genuine safety improvement, not merely a matter of style, connects directly back to the accidental-CROSS-JOIN risk covered earlier in this chapter — explicit syntax structurally makes that mistake harder to make in the first place.

### ❓ Follow-up Interview Questions

1. Why does the comma-syntax implicit join make it easier to accidentally produce a CROSS JOIN?
2. What's the practical difference between where a join condition lives in implicit versus explicit join syntax?
3. Why does explicit JOIN syntax become especially valuable once a query involves several tables and several filtering conditions?
4. Why is preferring explicit JOIN syntax described as a safety improvement rather than just a stylistic preference?
5. If you encountered implicit comma-syntax joins in a legacy codebase, how would you go about rewriting them safely?

---

## 9. How do you join more than two tables in a single query?

### 📖 Introduction

Every example covered so far in this chapter has joined exactly two tables — real-world queries frequently need to combine three, four, or more, and the underlying mechanism extends naturally.

### 🔗 Chaining Multiple JOIN Clauses

Each additional table gets its own `JOIN ... ON` clause, chained one after another — there's no fundamentally different syntax for joining many tables versus just two, it's simply the same pattern repeated.

### 🖼️ A Concrete Illustration

```sql
SELECT customers.name, orders.id, order_items.quantity, products.name AS product_name
FROM orders
JOIN customers ON orders.customer_id = customers.id
JOIN order_items ON order_items.order_id = orders.id
JOIN products ON order_items.product_id = products.id;
```

Combines four tables — `orders`, `customers`, `order_items`, and `products` — tying directly back to the many-to-many relationship resolved through a junction table, covered in the Keys & Relationships chapter later in this guide, between orders and products.

### 🎯 Each JOIN's Condition Is Evaluated in Sequence

Conceptually, the database processes these joins as a sequence — first combining `orders` with `customers`, then joining the result of that with `order_items`, then with `products` — though the actual query optimizer, covered in more depth in the Query Performance & Optimization chapter later in this guide, may choose a different, more efficient physical execution order while still producing the exact same logical result.

### 💎 Good to Know: Joining Many Tables Is the Same Mechanism as Joining Two, Just Repeated

The genuinely reassuring insight here is that there's no additional conceptual complexity in joining four tables instead of two — it's the exact same `JOIN ... ON` pattern, covered throughout this chapter, simply chained as many times as needed.

### ❓ Follow-up Interview Questions

1. Why doesn't joining four tables require a fundamentally different syntax than joining two?
2. In the concrete example, why does `order_items` need to be joined before `products` can be joined meaningfully?
3. How does this four-table join relate to the many-to-many relationship pattern covered in the Keys & Relationships chapter?
4. Why might the database's actual execution order differ from the order the JOIN clauses are written in?
5. What would happen to the result if one of the JOIN conditions in a multi-table query were written incorrectly?

---

## 10. What happens to unmatched rows in a LEFT JOIN versus an INNER JOIN?

### 📖 Introduction

This question directly consolidates the core distinction running throughout this entire chapter — worth stating side by side, explicitly, one final time.

### ❌ INNER JOIN: Unmatched Rows Are Excluded Entirely

Covered earlier in this chapter — any row from either table with no corresponding match on the other side simply doesn't appear in the result set at all, as if it never existed for the purposes of this particular query.

### ✅ LEFT JOIN: Unmatched Left-Table Rows Are Preserved, With NULLs

Covered earlier in this chapter — every row from the left table appears in the result regardless of whether a match exists, with `NULL`, covered in the Filtering, Sorting & Grouping chapter's discussion of NULL behavior, filling in for any column that would have come from the unmatched right table.

### 🖼️ A Direct, Side-by-Side Comparison

Given a `customers` table with 100 rows, where 80 have placed at least one order: an `INNER JOIN` against `orders` returns rows only for those 80 customers (potentially more than 80 rows, if some placed multiple orders) — the other 20 simply vanish from the result. A `LEFT JOIN` against the same tables returns all 100 customers, with the 20 who've never ordered showing `NULL` for every order-related column.

### 🎯 Why This Distinction Is the Single Most Important Thing to Internalize From This Chapter

Every other join type covered in this chapter — RIGHT, FULL, self-joins — is a variation or special case built on this exact same fundamental question: does an unmatched row get excluded, or preserved with `NULL`s?

### 💎 Good to Know: This Single Question — Excluded or Preserved? — Is the Root Distinction Behind Every Join Type in This Chapter

Recognizing that this one distinction is genuinely the foundation every other join concept in this chapter builds on is exactly the kind of synthesis that demonstrates real understanding, rather than memorized, disconnected facts about each join type individually.

### ❓ Follow-up Interview Questions

1. In the 100-customer example, why might an INNER JOIN return more than 80 rows even though only 80 customers match?
2. Why does a LEFT JOIN guarantee all 100 customers appear, regardless of their order history?
3. How does this same excluded-versus-preserved distinction extend to explain RIGHT JOIN and FULL OUTER JOIN, both covered earlier in this chapter?
4. Why is this specific distinction described as the "root" of every other join concept in this chapter?
5. How would you quickly determine, by looking at a result set, whether a query used an INNER JOIN or a LEFT JOIN?

---

## 11. How would you decide which type of join to use for a specific query requirement?

### 📖 Introduction

This capstone question for the chapter turns every individual join type covered so far into a single, practical decision framework.

### 🎯 Step 1: Do You Need Only Matched Rows, or Every Row From One Side Too?

If the query should only return rows genuinely present in both tables, an `INNER JOIN`, covered earlier in this chapter, is correct. If every row from one specific table needs to appear regardless of whether a match exists — like finding customers with no orders, covered earlier in this chapter — a `LEFT` (or equivalently reordered `RIGHT`) `JOIN` is needed instead.

### 🎯 Step 2: Do You Need Every Row From Both Sides At Once?

If unmatched rows from both tables genuinely need to be preserved simultaneously, a `FULL OUTER JOIN`, covered earlier in this chapter, including its MySQL-specific `UNION`-based emulation, is the right tool.

### 🎯 Step 3: Are You Comparing Rows Within the Same Table?

A hierarchical or self-referencing relationship, covered in this chapter's self-join question, needs a self-join rather than a join between two different tables.

### 🎯 Step 4: Do You Genuinely Need Every Combination of Two Independent Sets?

A deliberate Cartesian product — generating every possible combination, covered in this chapter's CROSS JOIN question — is the rare, specific case where a `CROSS JOIN` is actually the right tool, rather than an accidental mistake.

### 💎 Good to Know: This Decision Framework Is Simply Every Individual Join Type From This Chapter, Organized Into One Practical Checklist

This capstone question doesn't introduce any new join type — it takes every individual concept covered across this chapter and organizes it into the actual decision-making process a developer walks through when facing a genuinely new query requirement.

### ❓ Follow-up Interview Questions

1. Why does the first question in this framework — matched-only versus one-side-preserved — determine the most fundamental join choice?
2. When would a query genuinely need a FULL OUTER JOIN rather than just a LEFT JOIN?
3. Why does a hierarchical relationship point specifically toward a self-join rather than any of the other join types?
4. Why is a CROSS JOIN the rare, deliberate exception in this framework rather than a common default choice?
5. Walking through this framework, how would you decide which join type is needed to find products that have never been ordered?

---