---
title: Filtering, Sorting & Grouping
description: WHERE, ORDER BY, GROUP BY, and HAVING.
sidebar_position: 4
---

# Filtering, Sorting & Grouping

## 1. What is the WHERE clause, and how is it used to filter query results?

### 📖 Introduction

`SELECT`, covered throughout the SQL Queries (CRUD) chapter, retrieves data — but retrieving only the rows that actually matter is what `WHERE` is for.

### 🔍 What WHERE Does

`WHERE` filters which rows a query returns, evaluated against a condition for each row in the table — only rows where the condition evaluates to true are included in the result.

### 🖼️ A Concrete Illustration

```sql
SELECT * FROM customers WHERE country = 'USA';
```

Returns only customer rows where the `country` column equals `'USA'`, excluding every other row entirely.

### 🔀 WHERE Applies to UPDATE and DELETE Too

`WHERE` isn't exclusive to `SELECT` — it's the exact same filtering mechanism that determines which rows an `UPDATE` or `DELETE`, both covered in the SQL Queries (CRUD) chapter, actually affects, which is precisely why omitting it on those two statements is so dangerous, covered in that chapter's capstone question.

### 💎 Good to Know: WHERE Filters Individual Rows, Before Any Grouping Happens

The genuinely important distinction, expanded on in more depth later in this chapter, is that `WHERE` filters individual rows based on their own column values — it operates before any grouping, covered later in this chapter, and can't reference an aggregate function's result, which is exactly the gap `HAVING` fills instead.

### ❓ Follow-up Interview Questions

1. Why does `WHERE` apply to `UPDATE` and `DELETE` in exactly the same way it applies to `SELECT`?
2. What would `SELECT * FROM customers WHERE country = 'USA'` return if no customers were from the USA?
3. Why does `WHERE` operate on individual rows rather than on already-grouped data?
4. How does this question connect to the capstone question in the SQL Queries (CRUD) chapter about omitting WHERE?
5. What's the difference between filtering rows with `WHERE` and simply not selecting certain columns?

---

## 2. What are the common comparison and logical operators used in WHERE clauses?

### 📖 Introduction

`WHERE`'s condition, covered in the previous question, is built from a small, standard set of operators — worth knowing precisely, since combining them correctly is what makes complex filtering actually work.

### ⚖️ Comparison Operators

`=`, `!=` (or `<>`), `>`, `<`, `>=`, `<=` — comparing a column's value against a specific value or another column, evaluating to true or false for each row.

### 🔗 Logical Operators

`AND` requires every combined condition to be true; `OR` requires at least one to be true; `NOT` inverts a condition's result entirely.

### 🖼️ A Concrete Illustration

```sql
SELECT * FROM customers WHERE country = 'USA' AND (status = 'active' OR status = 'pending');
```

Returns only USA customers whose status is either active or pending — the parentheses here are genuinely important, since `AND` and `OR` combine according to standard operator precedence, and without them, this condition would evaluate differently than intended.

### ⚠️ Why Precedence and Parentheses Matter

`AND` binds more tightly than `OR` by default, meaning `WHERE a OR b AND c` is evaluated as `WHERE a OR (b AND c)`, not `WHERE (a OR b) AND c` — a genuinely common source of subtle bugs when combining conditions without explicit parentheses to make the intended grouping unambiguous.

### 💎 Good to Know: Always Use Explicit Parentheses When Mixing AND and OR

The practical habit that avoids this entire class of bug is simply always parenthesizing explicitly whenever `AND` and `OR` are combined in the same condition, rather than relying on remembering default precedence rules correctly every time.

### ❓ Follow-up Interview Questions

1. Why does `WHERE a OR b AND c` not necessarily mean the same thing as `WHERE (a OR b) AND c`?
2. What's the difference between `!=` and `<>` in MySQL?
3. Why does `NOT` invert a condition's result rather than combining it with another condition?
4. In the concrete example, what would the query return differently if the parentheses were removed?
5. Why is explicitly parenthesizing mixed AND/OR conditions considered good practice, rather than relying on default precedence?

---

## 3. What is the difference between WHERE and HAVING?

### 📖 Introduction

These two both filter query results, but they operate at genuinely different stages of a query's execution, and confusing them is one of the most common SQL mistakes.

### 🔍 WHERE: Filters Rows Before Grouping

`WHERE`, covered earlier in this chapter, filters individual rows based on their own column values, before any `GROUP BY`, covered later in this chapter, ever happens — it can't reference an aggregate function's result, like `SUM()` or `COUNT()`, covered in full in the Functions chapter later in this guide, because those aggregates haven't been computed yet at the point `WHERE` is evaluated.

### 🔢 HAVING: Filters Groups After Grouping

`HAVING` filters entire groups, after `GROUP BY` has already collapsed rows into those groups and computed any aggregate functions — it can reference an aggregate's result directly, since that aggregate has already been calculated by the time `HAVING` runs.

### 🖼️ A Concrete Illustration

```sql
SELECT country, COUNT(*) AS customer_count
FROM customers
WHERE status = 'active'
GROUP BY country
HAVING COUNT(*) > 100;
```

`WHERE status = 'active'` filters individual customer rows first; `GROUP BY country` then groups the remaining active customers by country; `HAVING COUNT(*) > 100` then filters those groups down to only countries with more than 100 active customers.

### 💎 Good to Know: The Rule of Thumb Is "Filter Rows With WHERE, Filter Groups With HAVING"

Recognizing that `WHERE` operates before grouping and `HAVING` operates after is exactly what determines which one is valid for a given condition — trying to reference `COUNT(*)` inside a `WHERE` clause is a genuinely common error precisely because the aggregate doesn't exist yet at that stage.

### ❓ Follow-up Interview Questions

1. Why can't `WHERE` reference an aggregate function's result like `COUNT(*)`?
2. In the concrete example, what would change if the `WHERE status = 'active'` condition were moved into `HAVING` instead?
3. Why does `HAVING` need `GROUP BY` to have already run before it can evaluate its condition?
4. Could a query use both `WHERE` and `HAVING` together? What would each one be responsible for?
5. What's a practical rule of thumb for deciding whether a given filtering condition belongs in `WHERE` or `HAVING`?

---

## 4. What is the ORDER BY clause, and how do you sort in ascending versus descending order?

### 📖 Introduction

A query's result set has no guaranteed order at all unless explicitly requested — `ORDER BY` is what actually controls the sequence rows come back in.

### 🔀 What ORDER BY Does

`ORDER BY` sorts a query's result set by one or more specified columns, applied after `WHERE`, covered earlier in this chapter, has already filtered which rows are included.

### ⬆️⬇️ Ascending and Descending

`ORDER BY name ASC` sorts alphabetically from A to Z (the default if no direction is specified at all); `ORDER BY signup_date DESC` sorts from most recent to oldest.

### 🔢 Sorting by Multiple Columns

`ORDER BY country ASC, name ASC` sorts primarily by `country`, and only uses `name` to break ties between rows that share the same `country` value — each additional column acts as a tiebreaker for the one before it.

### 🖼️ A Concrete Illustration

```sql
SELECT * FROM customers ORDER BY country ASC, signup_date DESC;
```

Groups customers by country alphabetically, and within each country, lists the most recently signed-up customers first.

### 💎 Good to Know: Without ORDER BY, a Query's Row Order Is Not Guaranteed

A genuinely important detail is that without an explicit `ORDER BY`, a database makes no promise about what order rows come back in — even if a query happens to consistently return rows in a particular order during testing, that behavior isn't guaranteed and can change, particularly once `LIMIT`, covered in the SQL Queries (CRUD) chapter, is involved, covered in more depth in that chapter's pagination discussion.

### ❓ Follow-up Interview Questions

1. Why does `ORDER BY` need to run after `WHERE` has already filtered the rows?
2. In a multi-column `ORDER BY`, what does the second column actually control?
3. Why can't you rely on a query's row order being consistent without an explicit `ORDER BY`?
4. Why does `ORDER BY` matter specifically when combined with `LIMIT`, covered in the SQL Queries (CRUD) chapter?
5. What would `ORDER BY country ASC, signup_date DESC` return differently if the two columns were swapped?

---

## 5. What is the GROUP BY clause, and how does it work with aggregate functions?

### 📖 Introduction

`GROUP BY` is what transforms a query from "list every matching row" into "summarize matching rows by category" — the mechanism behind nearly every aggregate report a database produces.

### 🗂️ What GROUP BY Does

`GROUP BY` collapses multiple rows sharing the same value in a specified column into a single summary row per unique value, letting an aggregate function, covered in full in the Functions chapter later in this guide, compute one result per group rather than per individual row.

### 🖼️ A Concrete Illustration

```sql
SELECT country, COUNT(*) AS customer_count
FROM customers
GROUP BY country;
```

Rather than one row per customer, this returns one row per distinct `country`, with `COUNT(*)` computing how many customers fall into each of those groups.

### 🎯 The Rule: Every Non-Aggregated Selected Column Must Appear in GROUP BY

Any column named in the `SELECT` list that isn't wrapped in an aggregate function must also appear in the `GROUP BY` clause — otherwise the database wouldn't know which of potentially many different values, across the rows being collapsed into that group, it should actually display.

### 🖼️ Why the Rule Exists, Concretely

`SELECT country, name, COUNT(*) FROM customers GROUP BY country` would be invalid, since `name` isn't aggregated and isn't in `GROUP BY` — with many customers per country, there's no single, unambiguous `name` value to show for each collapsed group.

### 💎 Good to Know: GROUP BY Answers "Summarize By What Category," Aggregate Functions Answer "Summarize How"

The clean mental model is that `GROUP BY` decides the categories rows get collapsed into, while the aggregate functions in the `SELECT` list decide what summary calculation gets computed for each of those categories — two genuinely distinct, complementary decisions.

### ❓ Follow-up Interview Questions

1. Why must every non-aggregated column in the SELECT list also appear in GROUP BY?
2. In the invalid example, why is there no single, unambiguous `name` value for the database to display per group?
3. How does GROUP BY change what a query's result set actually represents, compared to a plain SELECT?
4. Why does GROUP BY need to run before HAVING can filter the resulting groups, covered earlier in this chapter?
5. How would you use GROUP BY to find the average order value per customer?

---

## 6. Why can't you filter on an aggregate function using WHERE?

### 📖 Introduction

This question makes explicit the exact mechanical reason behind the WHERE-versus-HAVING distinction covered earlier in this chapter — worth understanding precisely rather than just memorizing as a rule.

### ⏱️ The Order of Operations Is the Root Cause

A SQL query's clauses don't execute in the order they're written — `WHERE` is evaluated before `GROUP BY`, covered in more depth in the next question's discussion of clause execution order, meaning at the point `WHERE` runs, no grouping has happened yet and no aggregate values, like `COUNT()` or `SUM()`, covered in the Functions chapter later in this guide, have been computed at all.

### 🚫 A Concrete Invalid Example

```sql
SELECT country, COUNT(*) FROM customers WHERE COUNT(*) > 100 GROUP BY country;
```

This fails, since `COUNT(*)` doesn't exist yet as a value at the point `WHERE` is evaluated — there's nothing for `WHERE` to actually compare `100` against.

### ✅ HAVING Exists Specifically to Fill This Gap

```sql
SELECT country, COUNT(*) FROM customers GROUP BY country HAVING COUNT(*) > 100;
```

Works correctly, since `HAVING` runs after `GROUP BY` has already computed `COUNT(*)` for each group, covered earlier in this chapter — there's now an actual value for `HAVING`'s condition to compare against.

### 💎 Good to Know: This Isn't an Arbitrary Restriction — It's a Direct Consequence of Execution Order

The genuinely important insight is that this isn't some arbitrary SQL rule to memorize — it's a direct, logical consequence of the actual order clauses execute in, covered in more depth in the next question, which is exactly why understanding that execution order makes rules like this one obvious rather than mysterious.

### ❓ Follow-up Interview Questions

1. Why doesn't `COUNT(*)` exist yet as a computed value at the point `WHERE` is evaluated?
2. Why does `HAVING` succeed at the exact same comparison that `WHERE` fails at?
3. Why is this restriction better understood as a consequence of execution order rather than an arbitrary rule?
4. What would you need to change about a query using `WHERE COUNT(*) > 100` to make it valid?
5. How does this question directly connect to the WHERE-versus-HAVING distinction covered earlier in this chapter?

---

## 7. What is the difference between IN, BETWEEN, and LIKE operators?

### 📖 Introduction

Beyond the basic comparison operators covered earlier in this chapter, these three offer more expressive ways to filter rows against a set of values, a range, or a text pattern.

### 📋 IN: Matching Against a Set of Values

`WHERE country IN ('USA', 'Canada', 'UK')` matches any row whose `country` equals any one of the listed values — functionally equivalent to chaining several `OR` conditions together, covered earlier in this chapter, but considerably more compact and readable.

### 📏 BETWEEN: Matching Within an Inclusive Range

`WHERE signup_date BETWEEN '2024-01-01' AND '2024-12-31'` matches any row whose value falls within the given range, inclusive of both endpoints — equivalent to `signup_date >= '2024-01-01' AND signup_date <= '2024-12-31'`.

### 🔤 LIKE: Matching a Text Pattern

`WHERE name LIKE 'A%'` matches any row whose `name` starts with `A`, using `%` as a wildcard matching any sequence of characters, and `_` as a wildcard matching exactly one character.

### 🖼️ A Concrete Illustration

```sql
SELECT * FROM customers
WHERE country IN ('USA', 'Canada')
  AND signup_date BETWEEN '2024-01-01' AND '2024-06-30'
  AND name LIKE 'J%';
```

Combines all three: customers from USA or Canada, who signed up in the first half of 2024, whose name starts with "J."

### ⚠️ A Performance Consideration Worth Knowing

A `LIKE` pattern starting with a leading wildcard, like `'%Smith'`, generally can't take advantage of a standard index, covered in full in the Indexing chapter later in this guide, the way `'Smith%'` can, since the database can't jump directly to a starting point when the match could begin anywhere in the string.

### 💎 Good to Know: Each of These Three Is Really Syntactic Sugar Over More Verbose Standard Comparisons

Recognizing `IN` as sugar over chained `OR`s, and `BETWEEN` as sugar over a pair of `>=`/`<=` comparisons, connects these three back to the basic comparison and logical operators covered earlier in this chapter, rather than treating them as entirely separate, unrelated mechanisms.

### ❓ Follow-up Interview Questions

1. Why is `IN` considered more readable than an equivalent chain of `OR` conditions?
2. Why is `BETWEEN` inclusive of both of its endpoint values?
3. What's the difference between the `%` and `_` wildcards in a `LIKE` pattern?
4. Why does a `LIKE` pattern with a leading wildcard, like `'%Smith'`, struggle to use a standard index?
5. How does thinking of `IN` and `BETWEEN` as "sugar" over basic comparisons help you reason about how they actually behave?

---

## 8. How do NULL values behave in comparisons and filtering?

### 📖 Introduction

`NULL` behaves unlike any ordinary value in SQL, and its comparison rules trip up even experienced developers — worth understanding precisely rather than assuming it behaves like an ordinary value or like `0`.

### ❓ NULL Means "Unknown," Not "Empty" or "Zero"

`NULL` represents the complete absence of a value — genuinely unknown or not applicable — which is why it can't be compared using ordinary equality at all; comparing anything to an unknown value produces another unknown, not true or false.

### ⚠️ Why `= NULL` Never Matches

`WHERE email = NULL` never matches any row, even one where `email` is genuinely `NULL` — the comparison itself evaluates to unknown, not true, so no row is ever returned by this condition, a genuinely common source of confusing bugs.

### ✅ The Correct Way to Check for NULL

`WHERE email IS NULL` and `WHERE email IS NOT NULL` are the correct, dedicated operators for testing whether a column's value is or isn't `NULL` — ordinary comparison operators like `=` and `!=` simply don't work for this purpose at all.

### 🔗 How NULL Affects AND/OR

`NULL` propagates through logical operators too — `true AND NULL` evaluates to `NULL` (unknown), while `true OR NULL` evaluates to `true`, since one genuinely true condition is already enough to make the overall `OR` true regardless of the other operand's unknown status.

### 💎 Good to Know: NULL Requires Dedicated Operators Because Ordinary Comparison Logic Doesn't Apply to "Unknown"

The single most important habit here is reflexively reaching for `IS NULL`/`IS NOT NULL` whenever `NULL` might be involved, rather than ordinary `=`/`!=` — a mistake that silently returns wrong (usually empty) results rather than throwing any kind of error.

### ❓ Follow-up Interview Questions

1. Why does `WHERE email = NULL` never match any row, even one where `email` is actually `NULL`?
2. What are the correct operators for checking whether a column's value is or isn't `NULL`?
3. Why does `true AND NULL` evaluate to `NULL` rather than `false`?
4. Why does `true OR NULL` evaluate to `true`, unlike `true AND NULL`?
5. Why is this kind of NULL-comparison mistake particularly dangerous, given it fails silently rather than throwing an error?

---

## 9. What is the logical order of execution of SQL clauses (FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY)?

### 📖 Introduction

This question makes explicit the underlying mechanism that already explained several earlier questions in this chapter — why `WHERE` can't reference an aggregate, why `HAVING` can — by naming the actual logical execution order directly.

### 🔢 The Logical Execution Order

1. **FROM** — determines the source table(s), including any joins, covered in full in the Joins chapter later in this guide.
2. **WHERE** — filters individual rows, covered earlier in this chapter, before any grouping happens.
3. **GROUP BY** — collapses the remaining rows into groups, covered earlier in this chapter, computing any aggregate functions.
4. **HAVING** — filters those already-computed groups, covered earlier in this chapter.
5. **SELECT** — determines which columns (or computed expressions) actually appear in the output.
6. **ORDER BY** — sorts the final result set, covered earlier in this chapter.

### ✍️ Why Written Order Differs From Logical Execution Order

SQL is written with `SELECT` first, syntactically, even though it's logically one of the last clauses actually evaluated — a genuinely common source of confusion, since the order a query reads in doesn't match the order it's actually processed in.

### 🖼️ Why This Explains Earlier Questions in This Chapter

This exact ordering is precisely why `WHERE` can't reference `COUNT(*)`, covered earlier in this chapter — `WHERE` (step 2) runs before `GROUP BY` (step 3) ever computes it — and why `HAVING` (step 4) can reference it, since it runs afterward.

### 💎 Good to Know: Knowing This Order Makes Several Otherwise-Confusing SQL Rules Immediately Obvious

Recognizing this logical execution order as the single underlying mechanism explaining multiple rules covered throughout this chapter — rather than memorizing each rule as an independent, disconnected fact — is exactly the kind of deeper understanding that separates a strong SQL answer from a merely memorized one.

### ❓ Follow-up Interview Questions

1. Why is `SELECT` written first syntactically but evaluated near the end logically?
2. Why does `FROM` need to run before `WHERE` can filter anything?
3. How does this execution order directly explain why `WHERE` can't reference an aggregate function?
4. Why does `ORDER BY` run last, after even `SELECT` has determined the output columns?
5. How does understanding this order help you reason about a new, unfamiliar SQL rule you haven't seen before?

---

## 10. How would you write a query to find duplicate rows in a table?

### 📖 Introduction

This capstone question for the chapter combines nearly every concept covered so far — `GROUP BY`, aggregate functions, and `HAVING` — into one genuinely common, practical real-world task.

### 🎯 The Core Idea

Duplicate rows share the same value (or combination of values) in the column(s) being checked — `GROUP BY` those columns, covered earlier in this chapter, then use `HAVING COUNT(*) > 1`, covered earlier in this chapter, to filter down to only the groups that appear more than once.

### 🖼️ A Concrete Illustration

```sql
SELECT email, COUNT(*) AS occurrences
FROM customers
GROUP BY email
HAVING COUNT(*) > 1;
```

Groups customers by `email`, then filters to only the email values appearing more than once — exactly identifying duplicate email addresses across the table.

### 🔍 Checking for Duplicates Across Multiple Columns

```sql
SELECT first_name, last_name, COUNT(*) AS occurrences
FROM customers
GROUP BY first_name, last_name
HAVING COUNT(*) > 1;
```

Grouping by multiple columns together, exactly the multi-column `DISTINCT` behavior covered in the SQL Queries (CRUD) chapter, treats the entire combination as what's being checked for duplication.

### 💎 Good to Know: This Is Every Individual Concept From This Chapter, Combined Into One Practical Query

This capstone question doesn't introduce anything new — it's `GROUP BY`, aggregate functions, and `HAVING`, all covered earlier in this chapter, combined into one genuinely common, real-world diagnostic query a developer would actually write.

### ❓ Follow-up Interview Questions

1. Why does grouping by the column being checked, then filtering with `HAVING COUNT(*) > 1`, correctly identify duplicates?
2. Why couldn't this same duplicate check be written using `WHERE COUNT(*) > 1` instead of `HAVING`?
3. How would this query change to check for duplicates based on a combination of two columns rather than just one?
4. Why does this query return the duplicate value itself alongside the count, rather than just the count?
5. How does this capstone question tie together GROUP BY, aggregate functions, and HAVING, all covered earlier in this chapter?

---