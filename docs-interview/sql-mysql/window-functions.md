---
title: Window Functions
description: ROW_NUMBER, RANK, and OVER() — analytics without collapsing rows.
sidebar_position: 8
---

# Window Functions

## 1. What is a window function, and how does it differ from a regular aggregate function?

### 📖 Introduction

Aggregate functions, covered in full in the Functions chapter, collapse many rows into one — window functions solve a genuinely different, extremely common problem: computing an aggregate-like value while still keeping every individual row in the result.

### 🪟 What a Window Function Is

A window function computes a value across a set of related rows — its "window" — without collapsing those rows down into a single output row the way `GROUP BY`, covered in the Filtering, Sorting & Grouping chapter, does. Every original row stays present in the result, each one now annotated with its own computed window-function value.

### ⚖️ The Core Distinction From Aggregate Functions

`SUM()` combined with `GROUP BY`, covered in the Functions chapter, produces one row per group. `SUM()` used as a window function instead produces one row per original row, each annotated with a sum computed across its own related window — genuinely different output shapes for a conceptually similar calculation.

### 🖼️ A Concrete Illustration

```sql
SELECT name, department, salary,
  SUM(salary) OVER (PARTITION BY department) AS department_total
FROM employees;
```

Every single employee row remains in the result, but each one now also shows their department's total salary — `SUM()` computed as a window function, rather than collapsing everyone in a department into one single summary row.

### 💎 Good to Know: A Window Function Answers "What's This Row's Relationship to Its Group," Not "What's the Group's Summary Alone"

The genuinely important mental model, distinguishing this from `GROUP BY` covered in the Filtering, Sorting & Grouping chapter: a window function lets each individual row be annotated with group-level context, rather than being replaced by a single row representing that group.

### ❓ Follow-up Interview Questions

1. Why does a window function preserve every original row, unlike an aggregate function combined with GROUP BY?
2. In the concrete example, why does every employee in the same department show the same `department_total` value?
3. Why might you want individual row-level detail alongside a group-level summary in the same result set?
4. Could the same query be written using a self-join and GROUP BY instead of a window function? What would that look like?
5. How does this "annotate rows without collapsing them" concept differ fundamentally from what GROUP BY does?

---

## 2. What does the OVER() clause do, and what can it contain (PARTITION BY, ORDER BY)?

### 📖 Introduction

`OVER()` is the syntax that actually turns an ordinary function into a window function, covered in the previous question — understanding exactly what it configures is the key to using any window function correctly.

### 🪟 What OVER() Does

`OVER()` defines the "window" — the set of related rows — that a window function operates across for each individual row. Without `OVER()`, a function like `SUM()` behaves as an ordinary aggregate function, covered in the Functions chapter; adding `OVER()` transforms it into a window function instead.

### 🗂️ PARTITION BY: Defining the Groups

`PARTITION BY department` divides rows into separate partitions, each one treated independently — the window function resets and recalculates separately for each partition, conceptually similar to `GROUP BY`, covered in the Filtering, Sorting & Grouping chapter, but without collapsing rows.

### 🔀 ORDER BY: Defining Order Within Each Partition

`ORDER BY hire_date` within `OVER()` determines the order rows are considered in within each partition — genuinely essential for functions like `ROW_NUMBER()` or running totals, covered in more depth later in this chapter, where the order rows are processed in directly affects the result.

### 🖼️ A Concrete Illustration

```sql
SELECT name, department, hire_date,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY hire_date) AS seniority_rank
FROM employees;
```

Within each department (the partition), employees are numbered in order of their hire date — the earliest-hired employee in each department gets `1`, independently per department.

### 💎 Good to Know: PARTITION BY Is to Window Functions What GROUP BY Is to Aggregate Functions, Minus the Collapsing

Tying directly back to the previous question, `PARTITION BY` is the mechanism that gives a window function its "grouped" behavior — the genuinely important difference from `GROUP BY` is that rows within each partition stay individually visible in the output.

### ❓ Follow-up Interview Questions

1. Why does adding `OVER()` to a function like `SUM()` change its behavior from an aggregate to a window function?
2. What does `PARTITION BY` do differently from `GROUP BY`, given both seem to "group" rows?
3. Why does `ORDER BY` inside `OVER()` matter specifically for a function like `ROW_NUMBER()`?
4. In the seniority-rank example, why does numbering restart at `1` for each different department?
5. Could `OVER()` be used with no `PARTITION BY` at all? What would that mean for the window?

---

## 3. What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?

### 📖 Introduction

These three all assign a sequential position to rows within a window, covered in the previous question — but they differ specifically in how they handle rows that tie on the `ORDER BY` value.

### 1️⃣ ROW_NUMBER()

Assigns a strictly sequential, unique number to every row within its partition, regardless of ties — even if two rows have the exact same value in the `ORDER BY` column, they still receive different, consecutive numbers.

### 🥇 RANK()

Assigns the same rank to tied rows, but then skips the next rank number(s) accordingly — if two rows tie for rank 1, the next row receives rank 3, not 2, leaving a gap reflecting the two rows that shared rank 1.

### 🏅 DENSE_RANK()

Also assigns the same rank to tied rows, but never skips any subsequent rank number — if two rows tie for rank 1, the next row receives rank 2, with no gap left behind at all.

### 🖼️ A Concrete Illustration

Given salaries `[100, 100, 90, 80]`: `ROW_NUMBER()` gives `1, 2, 3, 4`; `RANK()` gives `1, 1, 3, 4` (skipping 2); `DENSE_RANK()` gives `1, 1, 2, 3` (no gap at all).

### 💎 Good to Know: The Choice Comes Down to Exactly How Ties Should Be Handled

The clean way to remember all three: `ROW_NUMBER()` never ties, `RANK()` ties and leaves a gap, `DENSE_RANK()` ties without a gap — picking the right one depends entirely on whether a specific reporting requirement actually needs those gaps to reflect tied positions, or not.

### ❓ Follow-up Interview Questions

1. Why does `ROW_NUMBER()` never produce ties, even when two rows share the exact same ordering value?
2. In the salary example, why does `RANK()` skip directly from 1 to 3 rather than continuing to 2?
3. Why doesn't `DENSE_RANK()` leave the same gap that `RANK()` does?
4. When would a reporting requirement specifically need `RANK()`'s gap-leaving behavior rather than `DENSE_RANK()`'s?
5. Why would `ROW_NUMBER()` be the wrong choice for a query specifically trying to represent a "true," tie-aware ranking?

---

## 4. What is the difference between GROUP BY and PARTITION BY?

### 📖 Introduction

This distinction was touched on briefly in this chapter's introduction to `OVER()` — worth stating explicitly and precisely, since it's one of the most common points of confusion when first learning window functions.

### 🗂️ GROUP BY: Collapses Rows Into One Per Group

`GROUP BY`, covered in full in the Filtering, Sorting & Grouping chapter, reduces many rows sharing the same grouping value down into a single output row per group — the individual rows that made up that group are no longer separately visible in the result at all.

### 🪟 PARTITION BY: Divides Rows Into Groups Without Collapsing Them

`PARTITION BY`, covered earlier in this chapter, divides rows into the exact same kind of logical groups, but every individual row remains present in the output, each one simply annotated with a value computed across its own partition.

### 🖼️ A Direct, Side-by-Side Comparison

```sql
-- GROUP BY: one row per department
SELECT department, SUM(salary) AS total FROM employees GROUP BY department;

-- PARTITION BY: one row per employee, each annotated with their department's total
SELECT name, department, SUM(salary) OVER (PARTITION BY department) AS total FROM employees;
```

The first query returns exactly one row per department. The second returns one row per employee — every single one — each showing the same `total` value shared by everyone else in their department.

### 🎯 Why You'd Choose One Over the Other

`GROUP BY` is the right tool when only the summary itself is needed — a report showing total salary per department. `PARTITION BY` is the right tool when both individual row detail and group-level context are needed together in the same result — showing each employee's own salary alongside their department's total.

### 💎 Good to Know: This Distinction Is the Single Most Important Thing to Internalize From This Entire Chapter

Recognizing "collapses rows" (GROUP BY) versus "annotates rows without collapsing them" (PARTITION BY) as the core, defining difference is exactly the foundation every other question in this chapter builds on.

### ❓ Follow-up Interview Questions

1. Why does the GROUP BY query in the comparison return far fewer rows than the PARTITION BY version?
2. When would a report genuinely need PARTITION BY's row-preserving behavior rather than GROUP BY's collapsing behavior?
3. Could a single query use both GROUP BY and a window function with PARTITION BY at the same time?
4. Why is this distinction described as the single most important thing to internalize from this chapter?
5. How would you explain the difference between these two to someone who already understands GROUP BY well?

---

## 5. What are LAG() and LEAD(), and what problems do they solve?

### 📖 Introduction

Comparing a row to another row elsewhere in the same result set — the previous row, or the next one — is genuinely awkward without window functions; `LAG()` and `LEAD()` exist specifically to make that comparison straightforward.

### ⬅️ LAG(): Accessing a Previous Row's Value

`LAG(column, n)` returns the value of `column` from `n` rows before the current row, within its window, covered earlier in this chapter — commonly used to compare a row against whatever came immediately before it.

### ➡️ LEAD(): Accessing a Following Row's Value

`LEAD(column, n)` does the mirror opposite, returning the value from `n` rows after the current row.

### 🖼️ A Concrete Illustration

```sql
SELECT order_date, total,
  LAG(total) OVER (ORDER BY order_date) AS previous_order_total,
  total - LAG(total) OVER (ORDER BY order_date) AS change_from_previous
FROM orders;
```

For every order, this shows the previous order's total alongside it, and computes the difference between them — a genuinely common analytical need that would otherwise require a self-join, covered in the Joins chapter, against a manually offset version of the same table.

### 🎯 Why This Would Be Painful Without LAG/LEAD

Without these functions, comparing a row to its neighbor requires a self-join matched on some computed "previous row" condition — genuinely awkward to express and reason about, compared to `LAG()`'s direct, built-in way of referencing a neighboring row.

### 💎 Good to Know: LAG/LEAD Solve "Compare This Row to a Neighboring Row" Directly, Without a Self-Join

The genuinely important insight is that `LAG()` and `LEAD()` replace what would otherwise require an awkward self-join, covered in the Joins chapter, with a single, direct, purpose-built function call.

### ❓ Follow-up Interview Questions

1. Why does `LAG()` need an `ORDER BY` inside its `OVER()` clause to produce a meaningful result?
2. What does the `n` argument to `LAG(column, n)` actually control?
3. In the concrete example, what would `LEAD()` be used for instead of `LAG()`?
4. Why would comparing a row to its previous row be awkward to express with a self-join instead?
5. Could `LAG()` and `LEAD()` be combined with `PARTITION BY`? What would that let you do?

---

## 6. What is a running total, and how would you calculate one using window functions?

### 📖 Introduction

A running total is one of the most common real-world reporting needs — and window functions, covered throughout this chapter, are the natural, purpose-built tool for computing one directly in SQL.

### ➕ What a Running Total Is

A running total (or cumulative sum) shows, for each row, the sum of that row's value plus every prior row's value, in some defined order — genuinely different from an ordinary `SUM()`, covered in the Functions chapter, which would collapse everything into one single final total instead.

### 🪟 Computing One With a Window Function

```sql
SELECT order_date, total,
  SUM(total) OVER (ORDER BY order_date) AS running_total
FROM orders;
```

`SUM()` used as a window function, covered earlier in this chapter, with an `ORDER BY` but no `PARTITION BY`, computes a cumulative sum — each row's `running_total` reflects that row's own value plus every row before it in date order.

### 🗂️ A Running Total Per Group

```sql
SELECT customer_id, order_date, total,
  SUM(total) OVER (PARTITION BY customer_id ORDER BY order_date) AS running_total
FROM orders;
```

Adding `PARTITION BY customer_id`, covered earlier in this chapter, resets the running total independently for each customer, rather than accumulating across the entire table.

### 💎 Good to Know: A Running Total Is Exactly What ORDER BY Inside OVER() Was Designed For

The genuinely important insight is that `ORDER BY` inside `OVER()`, covered earlier in this chapter, is precisely what makes a running total possible — without it, `SUM() OVER ()` would simply compute one single grand total repeated on every row, rather than a genuinely cumulative, row-by-row total.

### ❓ Follow-up Interview Questions

1. Why does a running total require `ORDER BY` inside the `OVER()` clause specifically?
2. What would `SUM(total) OVER ()`, with no `ORDER BY` at all, compute instead of a running total?
3. Why does adding `PARTITION BY customer_id` reset the running total per customer?
4. How does a running total differ conceptually from an ordinary `SUM()` combined with `GROUP BY`?
5. How would you compute a running total that resets at the start of each calendar month?

---

## 7. What is the difference between a window function and a subquery for solving the same analytical problem?

### 📖 Introduction

Several problems solvable with a window function, covered throughout this chapter, could also technically be solved with a correlated subquery, covered in the Subqueries & CTEs chapter — worth understanding why window functions are usually the better tool.

### 🐌 The Correlated Subquery Approach

```sql
SELECT name, department, salary,
  (SELECT SUM(salary) FROM employees e2 WHERE e2.department = e1.department) AS department_total
FROM employees e1;
```

A correlated subquery, covered in full in the Subqueries & CTEs chapter, re-executes once per outer row, tying directly back to that chapter's discussion of correlated-subquery performance pitfalls — genuinely expensive on a large table.

### ⚡ The Window Function Approach

```sql
SELECT name, department, salary,
  SUM(salary) OVER (PARTITION BY department) AS department_total
FROM employees;
```

Computes the exact same result in a single pass over the data, without repeatedly re-executing a subquery per row — the database can compute every partition's sum once, then annotate each row accordingly.

### 🎯 Why This Difference Matters at Scale

The performance gap between these two approaches, covered in more depth in the Query Performance & Optimization chapter later in this guide, grows directly with table size — the correlated subquery version gets progressively slower as row count increases, while the window function version scales considerably better.

### 💎 Good to Know: Window Functions Are Frequently the Modern, More Efficient Replacement for This Exact Class of Correlated Subquery

The genuinely important, practical takeaway is that many correlated subqueries computing a per-group aggregate value alongside individual row detail, covered in the Subqueries & CTEs chapter, can be rewritten as an equivalent, considerably more efficient window function.

### ❓ Follow-up Interview Questions

1. Why does the correlated subquery version need to re-execute once per outer row?
2. Why can the window function version compute the same result in a single pass instead?
3. How does this performance gap connect to the correlated-subquery pitfalls covered in the Subqueries & CTEs chapter?
4. Why does this performance difference become more pronounced as a table's row count grows?
5. How would you identify an existing correlated subquery in a codebase that's actually a good candidate for this kind of window-function rewrite?

---

## 8. How would you find the top N rows per group using a window function?

### 📖 Introduction

"Top N per group" is one of the most common real-world analytical questions — and one that's genuinely difficult to express cleanly without a window function.

### 🥇 The Approach: Rank Within Each Group, Then Filter

Using `ROW_NUMBER()` (or `RANK()`, depending on whether ties should share a position, both covered earlier in this chapter) partitioned by the group, ordered by whatever determines "top," and then filtering down to just the top-ranked rows.

### 🖼️ A Concrete Illustration

```sql
WITH ranked_employees AS (
  SELECT name, department, salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT name, department, salary FROM ranked_employees WHERE rn <= 3;
```

Combining a window function with a CTE, covered in full in the Subqueries & CTEs chapter, since a window function's result, unlike a regular column, can't be filtered directly in the same query's `WHERE` clause — the ranking has to be computed first, in a CTE, before it can be filtered afterward.

### ⚠️ Why the Ranking Can't Be Filtered Directly in WHERE

Tying back to the clause execution order covered in the Filtering, Sorting & Grouping chapter, `WHERE` is evaluated before window functions are computed — attempting `WHERE rn <= 3` directly in the same query the window function is defined in fails, since `rn` doesn't exist yet at that stage, exactly the same kind of ordering issue that explains why `WHERE` can't reference an aggregate either.

### 💎 Good to Know: This Pattern — Rank in a CTE, Then Filter — Is the Standard, Idiomatic Way to Solve "Top N Per Group"

Recognizing this exact two-step pattern — compute the ranking first, wrapped in a CTE, then filter on that ranking afterward — as the standard, idiomatic solution to this genuinely common problem is a widely useful, practical skill.

### ❓ Follow-up Interview Questions

1. Why does finding the top 3 salaries per department specifically need a window function rather than a simple ORDER BY and LIMIT?
2. Why can't the window function's ranking be filtered directly in the same query's WHERE clause?
3. How does this limitation connect to the clause execution order covered in the Filtering, Sorting & Grouping chapter?
4. Why does wrapping the ranked query in a CTE solve this specific problem?
5. How would this query change if ties for the 3rd-highest salary should all be included, rather than picking an arbitrary one?

---

## 9. What are the performance considerations of using window functions on large datasets?

### 📖 Introduction

Window functions are considerably more efficient than the correlated-subquery alternative covered earlier in this chapter, but they're not entirely free — worth understanding their own genuine cost.

### 🗂️ Sorting Cost From PARTITION BY and ORDER BY

Computing a window function typically requires the database to sort or organize rows within each partition, covered earlier in this chapter — on a genuinely large table, this sorting step itself has a real, measurable cost, tying back to the sorting concerns covered in the Query Performance & Optimization chapter later in this guide.

### 📇 Indexes Can Help, but Don't Always Apply Directly

An index, covered in full in the Indexing chapter later in this guide, on the columns used in `PARTITION BY` and `ORDER BY` can help the database avoid a separate, explicit sort step — but a window function's specific computation still has genuine per-partition overhead beyond whatever indexing accomplishes.

### 🔁 Multiple Window Functions in One Query

Using several different window functions with genuinely different `PARTITION BY`/`ORDER BY` configurations within the same query means the database may need to perform several separate sorting operations — one per distinct window definition — rather than reusing a single sort across all of them.

### 🖼️ A Concrete Illustration

A query computing both `SUM() OVER (PARTITION BY department)` and `ROW_NUMBER() OVER (PARTITION BY department ORDER BY hire_date)` in the same statement can potentially reuse the same partitioning work for both, since they share the same `PARTITION BY`, unlike two window functions with entirely different partition columns.

### 💎 Good to Know: Window Functions Are a Genuine Performance Improvement Over Correlated Subqueries, Not a Free Operation

The important nuance to hold alongside the previous question's performance comparison: window functions are meaningfully more efficient than the correlated-subquery alternative, but that doesn't make them cost-free — they still carry real, measurable sorting and per-partition computation overhead worth being aware of at genuine scale.

### ❓ Follow-up Interview Questions

1. Why does computing a window function typically require sorting rows within each partition?
2. How can an index on the PARTITION BY and ORDER BY columns help reduce a window function's cost?
3. Why might using several window functions with different partition definitions in one query cost more than using just one?
4. Why is it important to recognize that window functions aren't cost-free, given how favorably they compared to correlated subqueries earlier in this chapter?
5. How would you investigate whether a specific window function is a genuine performance bottleneck in a slow query?

---

## 10. When would you choose a window function over a self-join to solve the same problem?

### 📖 Introduction

This capstone question for the chapter ties window functions back to the self-join pattern covered in the Joins chapter — both can solve certain "compare a row to related rows" problems, but window functions are usually the cleaner, more efficient choice.

### 🔄 What a Self-Join Version Looks Like

Finding each employee's department average salary via a self-join means joining `employees` to an aggregated version of itself, grouped by department, covered in the Joins and Functions chapters — genuinely workable, but requiring an extra layer of aggregation and join logic.

### 🪟 What the Window Function Version Looks Like

```sql
SELECT name, department, salary,
  AVG(salary) OVER (PARTITION BY department) AS department_avg
FROM employees;
```

Accomplishes the exact same result in a single, flat query — no join, no separate aggregation step, no self-join aliasing, covered in the Joins chapter's self-join question.

### 🎯 When a Window Function Is Clearly the Better Choice

Whenever the problem is fundamentally "annotate each row with something computed across its own group," covered throughout this chapter — a window function expresses this more directly, more readably, and typically more efficiently than the equivalent self-join-plus-aggregation approach.

### 🎯 When a Self-Join Might Still Be Necessary

A self-join remains necessary for genuinely different-shaped comparisons a window function can't express directly — like matching each row against a completely different, non-adjacent related row based on a business condition beyond simple row order, rather than a straightforward partition-and-order relationship.

### 💎 Good to Know: This Capstone Question Ties the Entire Chapter Back to a Concept From an Earlier Chapter

Recognizing that window functions, covered throughout this chapter, are frequently the more direct, efficient replacement for a self-join, covered in the Joins chapter, specifically for "compare this row to its group" problems is exactly the kind of cross-chapter synthesis a strong final answer for this chapter demonstrates.

### ❓ Follow-up Interview Questions

1. Why does the self-join version of the department-average problem require an extra aggregation step that the window function version doesn't?
2. What kind of problem would still require a self-join rather than a window function?
3. Why is a window function generally considered more readable than the equivalent self-join-plus-aggregation approach?
4. How does this comparison connect window functions back to the self-join concept covered in the Joins chapter?
5. If asked in an interview to justify choosing a window function over a self-join for a specific problem, how would you explain that choice?

---