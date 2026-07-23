---
title: Subqueries & CTEs
description: Nested queries, correlated subqueries, and Common Table Expressions.
sidebar_position: 6
---

# Subqueries & CTEs

## 1. What is a subquery, and where can it be used within a SQL statement?

### 📖 Introduction

A subquery lets one query's result feed directly into another, rather than requiring a separate, manually run step in between — a genuinely flexible tool that shows up in several different positions within a larger statement.

### 🪆 What a Subquery Is

A subquery (or nested query) is a `SELECT` statement, covered in the SQL Queries (CRUD) chapter, written inside another SQL statement, enclosed in parentheses, and evaluated first so its result can be used by the outer, enclosing query.

### 📍 Where Subqueries Can Appear

- **In the WHERE clause** — filtering rows based on a value or set of values produced by another query, covered in more depth in a later question in this chapter.
- **In the FROM clause** — treating a subquery's result as if it were its own temporary table, joined or filtered like any other.
- **In the SELECT list** — computing a single value per outer row, based on a related subquery.

### 🖼️ A Concrete Illustration

```sql
SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE total > 500);
```

The inner subquery, `SELECT customer_id FROM orders WHERE total > 500`, runs first, producing a list of customer IDs; the outer query then uses that list to filter `customers`.

### 💎 Good to Know: A Subquery Is Just an Ordinary SELECT, Used in an Unusual Position

The genuinely important insight is that a subquery isn't a separate SQL feature with its own distinct syntax — it's an ordinary `SELECT` statement, covered throughout the SQL Queries (CRUD) chapter, simply nested inside a larger query, wherever a value or result set is needed.

### ❓ Follow-up Interview Questions

1. Why does the inner subquery in the concrete example need to run before the outer query can be evaluated?
2. What's the difference between using a subquery in the WHERE clause versus in the FROM clause?
3. Why is a subquery described as "just an ordinary SELECT" rather than a distinct SQL feature?
4. Could a subquery itself contain another subquery nested within it? What would that look like?
5. When would using a subquery in the SELECT list, rather than WHERE or FROM, be the right choice?

---

## 2. What is the difference between a correlated and a non-correlated subquery?

### 📖 Introduction

This distinction determines whether a subquery, covered in the previous question, runs just once or potentially once per every single row of the outer query — a genuinely significant difference in both behavior and performance.

### 🔓 Non-Correlated Subquery

A subquery that can be evaluated entirely independently of the outer query — it doesn't reference any column from the outer query at all, and could be run on its own, standalone, producing the same result regardless of the outer query surrounding it.

### 🔗 Correlated Subquery

A subquery that references a column from the outer query, meaning it can't be evaluated independently — it must be re-evaluated once for every single row the outer query considers, since its result genuinely depends on that specific outer row's own values.

### 🖼️ A Concrete Comparison

```sql
-- Non-correlated: the subquery runs once, independent of any outer row
SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE total > 500);

-- Correlated: the subquery references the outer query's own customers.id
SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

The second example's subquery references `c.id` from the outer query, covered in more depth in the EXISTS-versus-IN question later in this chapter — it genuinely can't run without knowing which specific outer customer row is currently being evaluated.

### ⚠️ The Performance Implication

A correlated subquery being re-evaluated once per outer row can become a genuine performance concern on a large table, covered in more depth in a later question in this chapter, unlike a non-correlated subquery, which runs exactly once regardless of how many outer rows exist.

### 💎 Good to Know: "Correlated" Specifically Means "References the Outer Query's Own Row"

The clean, precise test for this distinction: does the subquery reference any column belonging to the outer query? If yes, it's correlated, and conceptually runs once per outer row; if no, it's non-correlated, and runs just once overall.

### ❓ Follow-up Interview Questions

1. Why can a non-correlated subquery be run independently, on its own, while a correlated one cannot?
2. In the correlated example, what specifically makes it dependent on the outer query's current row?
3. Why does a correlated subquery risk becoming a performance concern on a large table?
4. What's the simplest test for determining whether a given subquery is correlated or non-correlated?
5. Could a correlated subquery be rewritten as a JOIN instead? What would that look like?

---

## 3. What is the difference between a subquery and a JOIN, and when would you prefer one over the other?

### 📖 Introduction

Subqueries, covered earlier in this chapter, and JOINs, covered in full in the Joins chapter, frequently solve overlapping problems — worth understanding both when they're interchangeable and when one is genuinely the better choice.

### 🔀 Where They Overlap

Many queries expressible with a subquery can also be rewritten using a `JOIN`, and vice versa — finding customers who've placed an order can be written as a subquery using `IN` or `EXISTS`, covered in more depth in a later question in this chapter, or as an `INNER JOIN` against `orders`, covered in full in the Joins chapter.

### 🖼️ A Concrete Comparison

```sql
-- Subquery version
SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders);

-- JOIN version
SELECT DISTINCT customers.name FROM customers
JOIN orders ON customers.id = orders.customer_id;
```

Both return the same logical result — customers who've placed at least one order — via two genuinely different approaches.

### ⚖️ When Each Tends to Read More Naturally

A subquery often reads more naturally when the question is fundamentally "does a matching row exist" or "is this value in this set," without needing any actual columns from the other table in the final result. A `JOIN` reads more naturally, and is usually necessary, when columns from both tables genuinely need to appear together in the output.

### 🎯 The Performance Consideration

Modern query optimizers, covered in more depth in the Query Performance & Optimization chapter later in this guide, often produce very similar, or even identical, execution plans for logically equivalent subquery and JOIN versions of the same question — meaning the choice is frequently more about readability than a guaranteed performance difference, though a poorly written correlated subquery, covered in the previous question, can still genuinely underperform an equivalent JOIN.

### 💎 Good to Know: The Decisive Factor Is Usually "Do I Need Columns From Both Tables in the Output"

The practical rule of thumb: if the final result needs actual columns from both tables, reach for a `JOIN`; if the question is purely about existence or membership without needing the other table's columns in the output, a subquery is often the more natural, readable choice.

### ❓ Follow-up Interview Questions

1. Why do the subquery and JOIN versions in the concrete example return the same logical result?
2. Why does a JOIN become necessary once columns from both tables need to appear in the final output?
3. Why might modern query optimizers produce very similar execution plans for logically equivalent subquery and JOIN queries?
4. When could a poorly written correlated subquery genuinely underperform an equivalent JOIN?
5. How would you decide, for a brand-new query, whether a subquery or a JOIN is the more natural choice?

---

## 4. What is a Common Table Expression (CTE), and how do you define one using WITH?

### 📖 Introduction

A CTE is, in one sense, just a subquery, covered earlier in this chapter, with a name and a cleaner, more readable syntax — but that naming turns out to unlock genuinely useful capabilities of its own.

### 📝 What a CTE Is

A Common Table Expression defines a temporary, named result set at the start of a query, using the `WITH` keyword, that can then be referenced by name later in that same query — as if it were its own temporary table, existing only for the duration of that one statement.

### 🖼️ A Concrete Illustration

```sql
WITH high_value_orders AS (
  SELECT customer_id, total FROM orders WHERE total > 500
)
SELECT customers.name, high_value_orders.total
FROM customers
JOIN high_value_orders ON customers.id = high_value_orders.customer_id;
```

`high_value_orders` is defined once, named clearly, and then referenced in the main query exactly like an ordinary table would be, covered in full in the Joins chapter's JOIN syntax.

### 🎯 Multiple CTEs in One Query

A single `WITH` clause can define several CTEs, separated by commas, and later CTEs can even reference earlier ones defined in that same `WITH` clause — building up a genuinely readable, step-by-step query out of clearly named, sequential pieces.

### 💎 Good to Know: A CTE Is Essentially a Named, Reusable Subquery, Scoped to One Statement

The clean mental model connecting this back to the previous questions in this chapter: a CTE is conceptually similar to a subquery in the FROM clause, covered earlier in this chapter, but named upfront and readable top-to-bottom, rather than nested and read inside-out.

### ❓ Follow-up Interview Questions

1. Why does a CTE need to be referenced by name later in the same query, unlike an ordinary subquery?
2. In the concrete example, how does referencing `high_value_orders` compare to joining an ordinary table?
3. Why can a query define multiple CTEs in a single WITH clause?
4. How is a CTE conceptually similar to a subquery in the FROM clause, covered earlier in this chapter?
5. Does a CTE persist beyond the single statement that defines it? Why or why not?

---

## 5. Why would you use a CTE instead of a subquery?

### 📖 Introduction

Since a CTE and an equivalent subquery, both covered earlier in this chapter, can often produce the exact same logical result, the decision between them usually comes down to readability and structure rather than raw capability.

### 📖 Readability, Especially With Multiple Nested Steps

A deeply nested subquery, with several levels of parentheses nested inside each other, has to be read from the inside out — genuinely difficult to follow past a couple of levels. A CTE, or a chain of several CTEs, covered in the previous question, lets each logical step be named and read top-to-bottom, in the actual order a person would naturally think through the problem.

### 🔁 Reusability Within the Same Query

A CTE, once defined, can be referenced multiple times within the same query — a subquery, by contrast, would need to be duplicated entirely if the same intermediate result were needed in more than one place.

### 🌳 Enabling Recursive Queries

A CTE can be recursive, covered in more depth in the next question — a capability a plain subquery simply doesn't have at all.

### 🖼️ A Concrete Illustration

A query needing to first filter orders, then aggregate them by customer, then join that aggregated result against another table is far more readable expressed as two named, sequential CTEs than as a subquery nested inside another subquery nested inside a JOIN.

### 💎 Good to Know: The Choice Is Almost Always About Readability and Structure, Not About One Being More Powerful Than the Other

For the majority of non-recursive cases, a CTE and an equivalent subquery are logically interchangeable — the real reason to reach for a CTE is that it makes a complex query's logic dramatically easier to read, follow, and maintain.

### ❓ Follow-up Interview Questions

1. Why does a deeply nested subquery become genuinely difficult to read past a couple of levels?
2. Why would a subquery need to be duplicated if the same intermediate result were needed twice in one query?
3. What capability does a CTE have that a plain subquery doesn't, covered in more depth in the next question?
4. Why is the choice between a CTE and a subquery usually about readability rather than raw capability?
5. How would you refactor a deeply nested subquery into a series of readable CTEs?

---

## 6. What is a recursive CTE, and what problem does it solve?

### 📖 Introduction

Every CTE covered so far in this chapter has been a single, non-repeating definition — a recursive CTE is genuinely different, referencing itself to build up a result iteratively.

### 🌳 What a Recursive CTE Is

A recursive CTE is a CTE, covered earlier in this chapter, that references itself within its own definition, repeatedly building on its own previous result until some stopping condition is reached — specifically designed for traversing hierarchical or graph-like data.

### 🖼️ A Concrete Illustration: Traversing an Employee Hierarchy

```sql
WITH RECURSIVE org_chart AS (
  SELECT id, name, manager_id, 1 AS level
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, org_chart.level + 1
  FROM employees e
  JOIN org_chart ON e.manager_id = org_chart.id
)
SELECT * FROM org_chart;
```

The first part (before `UNION ALL`) is the "anchor" — top-level employees with no manager. The second part references `org_chart` itself, finding each next level of employees reporting to someone already found, repeating until no further matches exist.

### 🎯 The Problem It Solves

Tying back to the self-join question covered in the Joins chapter, a single self-join finds only one level of a hierarchy — a recursive CTE finds every level, of arbitrary, unknown depth, without needing to know upfront exactly how many levels deep the hierarchy actually goes.

### 💎 Good to Know: A Recursive CTE Is Genuinely the Only Standard SQL Tool for Traversing Arbitrary-Depth Hierarchies

The genuinely important insight is that a recursive CTE fills a gap that no ordinary join or subquery, both covered earlier in this chapter, can fill on its own — traversing a hierarchy of unknown, arbitrary depth requires this specific, self-referencing mechanism.

### ❓ Follow-up Interview Questions

1. What is the "anchor" part of a recursive CTE, and what role does it play?
2. Why does a recursive CTE need a stopping condition to avoid running indefinitely?
3. Why does a single self-join, covered in the Joins chapter, only find one level of a hierarchy, unlike a recursive CTE?
4. In the org-chart example, what does the `level` column actually track across each recursive iteration?
5. What real-world data structures, beyond an employee hierarchy, would also benefit from a recursive CTE?

---

## 7. What is the difference between EXISTS and IN when used with subqueries?

### 📖 Introduction

Both `EXISTS` and `IN` can express "does a matching row exist in this subquery," covered earlier in this chapter's introduction to subqueries — but they check for that in genuinely different ways.

### 🔍 IN: Checks Membership in a List of Values

`WHERE customer_id IN (SELECT customer_id FROM orders)` checks whether the outer row's value appears anywhere in the list of values the subquery produces — conceptually, the subquery's entire result is computed first, as a non-correlated subquery, covered earlier in this chapter, and then each outer row is checked against that list.

### ✅ EXISTS: Checks Whether Any Matching Row Exists At All

`WHERE EXISTS (SELECT 1 FROM orders WHERE orders.customer_id = customers.id)` checks only whether the subquery returns at least one row at all — it's typically written as a correlated subquery, covered earlier in this chapter, and the database can stop searching the instant it finds a single match, without needing to enumerate every possible match.

### ⚖️ The Practical Difference

`EXISTS` tends to perform better specifically when the subquery could return a very large number of rows, since it only needs to confirm "at least one exists" rather than actually building out a complete, potentially huge list of values, the way `IN` does. `IN` tends to read a bit more naturally for a small, simple set of literal values.

### ⚠️ A NULL-Related Gotcha With NOT IN

`NOT IN` behaves unexpectedly if the subquery's result set contains even a single `NULL`, covered in the Filtering, Sorting & Grouping chapter's discussion of NULL comparisons — the entire `NOT IN` condition can end up matching no rows at all, a genuinely common, confusing bug. `NOT EXISTS` doesn't share this specific problem.

### 💎 Good to Know: EXISTS Checks "Does Any Match Exist," IN Checks "Is This Value In This List"

The clean way to keep these distinct: `EXISTS` asks a yes-or-no question about a subquery's existence, and can short-circuit on the first match; `IN` builds a list and checks membership in it — a subtly different question, especially once `NOT` and `NULL` are involved.

### ❓ Follow-up Interview Questions

1. Why can `EXISTS` stop searching as soon as it finds one matching row, while `IN` conceptually can't?
2. Why does `EXISTS` tend to perform better when the subquery could return a very large result set?
3. Why does `NOT IN` behave unexpectedly if the subquery's result contains a `NULL`?
4. Why doesn't `NOT EXISTS` share the same NULL-related problem as `NOT IN`?
5. How would you decide, for a specific query, whether to use `EXISTS` or `IN`?

---

## 8. Can a subquery return multiple rows or columns, and how does that affect where it can be used?

### 📖 Introduction

Not every subquery, covered earlier in this chapter, can be used in every position — how many rows and columns it returns directly determines where it's actually valid.

### 1️⃣ Scalar Subquery: Exactly One Row, One Column

A subquery returning a single value can be used anywhere a single value is expected — in the `SELECT` list, or compared directly with `=` in a `WHERE` clause.

### 📋 Multi-Row Subquery: Multiple Rows, One Column

A subquery returning several rows, but just one column, can be used with `IN`, `EXISTS`, or `ANY`/`ALL`, covered earlier in this chapter's discussion of `IN` — but not with a plain `=` comparison, which expects exactly one value.

### 🗂️ Multi-Column Subquery: Multiple Columns

A subquery returning multiple columns can only be used in specific positions that expect a row-shaped result — most commonly in the `FROM` clause, covered earlier in this chapter, treated as its own temporary table, or compared against a matching multi-column tuple.

### 🖼️ A Concrete Illustration of a Common Mistake

```sql
SELECT name FROM customers
WHERE id = (SELECT customer_id FROM orders WHERE total > 500);
```

This fails at runtime if the subquery returns more than one row, since `=` expects exactly one value — this exact scenario needs `IN` instead, covered earlier in this chapter, which is specifically designed to handle a multi-row result.

### 💎 Good to Know: The Number of Rows and Columns a Subquery Returns Directly Determines Which Operators Are Even Valid

Recognizing that `=` requires a scalar subquery, while `IN`/`EXISTS` accommodate a multi-row result, is exactly the practical knowledge that prevents the common runtime error of using the wrong operator for a subquery's actual shape.

### ❓ Follow-up Interview Questions

1. Why does a plain `=` comparison fail if the subquery on its right side returns more than one row?
2. What's the difference between a subquery being multi-row and being multi-column?
3. In the concrete mistake example, what specific change would fix the query?
4. Why can a multi-column subquery be used in the FROM clause but not directly with a plain `=` comparison?
5. How would you determine, before running a query, whether a given subquery is scalar, multi-row, or multi-column?

---

## 9. What are common performance pitfalls with correlated subqueries?

### 📖 Introduction

Correlated subqueries, covered earlier in this chapter, are genuinely useful, but their defining trait — re-evaluation per outer row — is exactly what makes them a common source of real-world performance problems.

### 🐌 Re-Execution Per Outer Row

Since a correlated subquery references the outer query's current row, covered earlier in this chapter, it conceptually runs once for every single row the outer query considers — on a table with a million rows, that's potentially a million separate subquery executions, each one adding up.

### 🖼️ A Concrete Illustration of the Problem

```sql
SELECT name, (SELECT COUNT(*) FROM orders WHERE orders.customer_id = customers.id) AS order_count
FROM customers;
```

For every single customer row, this re-runs the inner `COUNT(*)` subquery separately — genuinely expensive at scale, compared to an equivalent `JOIN` combined with `GROUP BY`, both covered in full in the Joins and Filtering, Sorting & Grouping chapters, which computes the same result in one single pass over the data.

### 🛠️ The Common Fix: Rewrite as a JOIN or a Window Function

The equivalent, typically much faster version:

```sql
SELECT customers.name, COUNT(orders.id) AS order_count
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id
GROUP BY customers.id;
```

Computing the same per-customer order count in a single pass, rather than one separate subquery execution per customer — or, depending on the specific need, a window function, covered in full in the Window Functions chapter later in this guide, could achieve something similar.

### 💎 Good to Know: A Correlated Subquery Repeating Expensive Work Per Row Is the Single Most Common Real-World Performance Trap in This Chapter

Recognizing this specific pattern — a correlated subquery doing meaningful work, run once per outer row — and knowing that it very often has an equivalent, single-pass `JOIN` or window-function rewrite is a genuinely practical, senior-level skill.

### ❓ Follow-up Interview Questions

1. Why does a correlated subquery's per-row re-execution become a genuine problem specifically as a table grows large?
2. In the concrete example, why does the JOIN-based rewrite avoid the repeated subquery execution?
3. Why might a window function, covered in the Window Functions chapter, be an alternative to this same correlated subquery?
4. How would you identify, just by reading a query, whether a subquery is likely to cause this specific performance problem?
5. Why doesn't a non-correlated subquery, covered earlier in this chapter, suffer from this same per-row re-execution issue?

---

## 10. How would you rewrite a deeply nested subquery using CTEs for readability?

### 📖 Introduction

This capstone question for the chapter combines the readability motivation covered earlier in this chapter with a concrete, hands-on rewriting exercise.

### 🪆 The Starting Point: A Deeply Nested Subquery

```sql
SELECT name FROM customers WHERE id IN (
  SELECT customer_id FROM orders WHERE id IN (
    SELECT order_id FROM order_items WHERE product_id = 42
  )
);
```

Genuinely correct, but has to be read from the innermost parentheses outward — three levels deep, each one obscuring the overall logic until it's fully unwound.

### 🔧 Rewriting It as a Chain of CTEs

```sql
WITH relevant_orders AS (
  SELECT order_id FROM order_items WHERE product_id = 42
),
relevant_customers AS (
  SELECT customer_id FROM orders WHERE id IN (SELECT order_id FROM relevant_orders)
)
SELECT name FROM customers WHERE id IN (SELECT customer_id FROM relevant_customers);
```

Each named CTE, covered earlier in this chapter, represents one clear, sequential step — "orders containing product 42," then "customers who placed those orders" — read top-to-bottom in the same order a person would naturally reason through the problem.

### 🎯 Why This Rewrite Is Worth Doing

Beyond readability alone, each named CTE step becomes independently testable and debuggable on its own — running `SELECT * FROM relevant_orders` in isolation immediately confirms whether that specific step is producing the expected result, something considerably harder to do with a deeply nested subquery.

### 💎 Good to Know: This Capstone Exercise Combines Every CTE Concept Covered Earlier in This Chapter Into One Practical Skill

This rewriting exercise doesn't introduce anything new — it's the CTE syntax, the readability motivation, and the "named, sequential steps" mental model, all covered earlier in this chapter, applied together as one genuinely practical, hands-on refactoring skill.

### ❓ Follow-up Interview Questions

1. Why does the original nested subquery need to be read from the innermost parentheses outward?
2. How does naming each step as its own CTE make the query's logic easier to follow top-to-bottom?
3. Why does splitting a query into named CTEs make each individual step easier to test and debug?
4. Would this rewritten, CTE-based query necessarily perform differently than the original nested version? Why or why not?
5. How would you decide, for a specific deeply nested subquery, how many CTE steps to split it into?

---