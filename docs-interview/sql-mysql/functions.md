---
title: Functions
description: Aggregate and built-in SQL functions.
sidebar_position: 7
---

# Functions

## 1. What are aggregate functions, and what are the most commonly used ones (COUNT, SUM, AVG, MIN, MAX)?

### 📖 Introduction

Aggregate functions have already appeared throughout this guide — in `GROUP BY` examples in the Filtering, Sorting & Grouping chapter, and in subqueries in the previous chapter — this chapter finally gives them their own dedicated, focused treatment.

### 🔢 What an Aggregate Function Is

An aggregate function computes a single summary value from a set of multiple rows — collapsing many individual values down into one result, most commonly used alongside `GROUP BY`, covered in full in the Filtering, Sorting & Grouping chapter.

### 📊 The Common Aggregate Functions

- **COUNT** — counts rows, covered in more depth in the next question.
- **SUM** — adds up a numeric column's values across the group.
- **AVG** — computes the arithmetic mean of a numeric column across the group.
- **MIN** / **MAX** — find the smallest or largest value in a column across the group.

### 🖼️ A Concrete Illustration

```sql
SELECT country, COUNT(*) AS customer_count, AVG(total_spent) AS avg_spent
FROM customers
GROUP BY country;
```

Computes, per country, both how many customers exist and their average total spend — two different aggregate functions applied to the exact same grouped data in one single query.

### 💎 Good to Know: Aggregate Functions Collapse Many Rows Into One Value Per Group

The genuinely important mental model, tying back to the Filtering, Sorting & Grouping chapter's discussion of `GROUP BY`, is that an aggregate function's whole purpose is turning "many rows" into "one summary value" — without `GROUP BY`, an aggregate simply treats the entire table as one single group.

### ❓ Follow-up Interview Questions

1. Why does an aggregate function need multiple rows to operate on, unlike an ordinary column value?
2. What happens to an aggregate function like `AVG()` if no `GROUP BY` clause is present at all?
3. In the concrete example, why can two different aggregate functions be applied to the same grouped data in one query?
4. Why is `GROUP BY`, covered in the Filtering, Sorting & Grouping chapter, so closely associated with aggregate functions?
5. What would `MIN()` and `MAX()` return if applied to a column containing text rather than numbers?

---

## 2. What is the difference between `COUNT(*)` and `COUNT(column_name)`?

### 📖 Introduction

These two look nearly identical but behave differently in one genuinely important way — how each one treats `NULL` values, covered in the Filtering, Sorting & Grouping chapter's discussion of NULL behavior.

### 🔢 COUNT(*): Counts Rows, Regardless of NULLs

`COUNT(*)` counts every row in the group, full stop — it doesn't look at any specific column's value at all, so a row with every column set to `NULL` still gets counted.

### 🔢 COUNT(column_name): Counts Only Non-NULL Values in That Column

`COUNT(email)` counts only the rows where `email` is not `NULL` — a row with a `NULL` email is simply skipped, not counted at all, even though that same row would be counted by `COUNT(*)`.

### 🖼️ A Concrete Illustration

```sql
SELECT COUNT(*) AS total_customers, COUNT(email) AS customers_with_email
FROM customers;
```

If 100 customers exist but only 95 have an email on file, `COUNT(*)` returns 100 while `COUNT(email)` returns 95 — the difference reveals exactly how many rows have a missing email.

### 💎 Good to Know: This Difference Is a Genuinely Useful Way to Detect Missing Data

Recognizing that `COUNT(*)` versus `COUNT(column_name)` can reveal exactly how much data is missing in a specific column, by simply comparing the two counts, is a genuinely practical technique for data-quality checks.

### ❓ Follow-up Interview Questions

1. Why does `COUNT(*)` count a row even if every column in that row is `NULL`?
2. Why does `COUNT(email)` skip rows where `email` is `NULL`?
3. In the concrete example, what does the difference between the two counts actually reveal?
4. Would `COUNT(id)` and `COUNT(*)` typically return the same result, assuming `id` is a primary key? Why or why not?
5. How could this COUNT difference be used as a practical data-quality check on a real table?

---

## 3. What are scalar functions, and how do they differ from aggregate functions?

### 📖 Introduction

Aggregate functions, covered in the previous two questions, operate across many rows at once — scalar functions instead operate on just one row, one value, at a time.

### 🔹 What a Scalar Function Is

A scalar function takes one input value and returns exactly one output value, computed independently for each individual row — unlike an aggregate function, covered earlier in this chapter, it never needs to look at any other row to produce its result.

### ⚖️ The Core Distinction

An aggregate function, like `SUM()`, collapses multiple rows into one value. A scalar function, like `UPPER()`, transforms one row's value into another value, with the same number of rows coming out as went in — no collapsing at all.

### 🖼️ A Concrete Illustration

```sql
SELECT name, UPPER(name) AS name_upper FROM customers;
```

`UPPER(name)` is computed independently for every single row — a hundred input rows produce a hundred output rows, each with its own uppercased name, unlike an aggregate function which would collapse those hundred rows into far fewer.

### 🎯 Common Categories of Scalar Functions

String functions, date/time functions, and mathematical functions, each covered in more depth later in this chapter, are all scalar — each one transforms a single input value into a single output value, row by row.

### 💎 Good to Know: The Row-Count Test Cleanly Distinguishes Scalar From Aggregate Functions

A clean, practical test: does a function reduce the number of rows in the result? If yes, it's aggregate; if the same number of rows comes out as went in, it's scalar — exactly the distinction demonstrated in the concrete example above.

### ❓ Follow-up Interview Questions

1. Why does a scalar function never need to look at any row other than the one it's currently processing?
2. In the concrete example, why does the query still return one row per customer rather than fewer?
3. What's the "row-count test" for distinguishing a scalar function from an aggregate function?
4. Could a query use both scalar and aggregate functions together in the same SELECT list? What would that look like?
5. Why are string, date/time, and mathematical functions all classified as scalar rather than aggregate?

---

## 4. What are commonly used string functions in MySQL (CONCAT, SUBSTRING, TRIM, etc.)?

### 📖 Introduction

String functions are scalar functions, covered in the previous question, specifically operating on text — genuinely common for cleaning up or reshaping text data directly inside a query.

### 🔤 The Common String Functions

- **CONCAT(a, b, ...)** — joins multiple strings (or columns) together into one — `CONCAT(first_name, ' ', last_name)` combines two columns with a space between them.
- **SUBSTRING(str, start, length)** — extracts a portion of a string starting at a given position, for a given length.
- **TRIM(str)** — removes leading and trailing whitespace from a string, genuinely useful for cleaning up user-submitted data with accidental extra spaces.
- **LENGTH(str)** — returns a string's length in bytes (or `CHAR_LENGTH()` for its length in characters, which can differ for multi-byte characters).
- **LOWER(str)** / **UPPER(str)** — convert a string to entirely lowercase or entirely uppercase, covered in this chapter's earlier scalar-function example.
- **REPLACE(str, from, to)** — replaces every occurrence of a substring within a string with a different substring.

### 🖼️ A Concrete Illustration

```sql
SELECT CONCAT(TRIM(first_name), ' ', TRIM(last_name)) AS full_name
FROM customers;
```

Combines a customer's first and last name into one column, trimming any accidental extra whitespace from each individually before joining them together.

### 💎 Good to Know: String Functions Are Genuinely Useful for Cleaning and Reshaping Data Directly at the Query Level

Recognizing that string functions let a query itself clean, combine, or reshape text data — rather than requiring that cleanup to happen only in application code after the data is already retrieved — is a genuinely practical, everyday use of this category of function.

### ❓ Follow-up Interview Questions

1. Why would `CONCAT()` be used instead of manually combining columns in application code after retrieval?
2. What's the difference between `LENGTH()` and `CHAR_LENGTH()`, and why might they return different results?
3. Why does `TRIM()` matter specifically for cleaning up user-submitted text data?
4. In the concrete example, why is `TRIM()` applied to each name individually rather than to the final combined result?
5. When would it make more sense to clean or reshape a string in application code rather than directly in a query?

---

## 5. What are commonly used date/time functions in MySQL?

### 📖 Introduction

Date and time values are genuinely common in nearly every real-world schema — MySQL provides a dedicated set of scalar functions, covered earlier in this chapter, specifically for working with them.

### 📅 The Common Date/Time Functions

- **NOW()** — returns the current date and time.
- **CURDATE()** — returns just the current date, without a time component.
- **DATE_ADD(date, INTERVAL n unit)** / **DATE_SUB(...)** — add or subtract a specified interval (days, months, years) from a date.
- **DATEDIFF(date1, date2)** — returns the number of days between two dates.
- **DATE_FORMAT(date, format)** — formats a date/time value into a specific, custom string representation.
- **YEAR(date)** / **MONTH(date)** / **DAY(date)** — extract a specific component from a date value.

### 🖼️ A Concrete Illustration

```sql
SELECT name, DATEDIFF(NOW(), signup_date) AS days_since_signup
FROM customers
WHERE signup_date >= DATE_SUB(NOW(), INTERVAL 30 DAY);
```

Finds customers who signed up within the last 30 days, and computes exactly how many days ago each of them signed up — combining several date functions in one practical, realistic query.

### 💎 Good to Know: Prefer Database-Level Date Functions Over Pulling Raw Dates Into Application Code for Comparison

Performing date arithmetic and comparisons directly in the query, rather than retrieving raw date values and computing differences in application code afterward, keeps that logic close to the data and lets the database's own optimizer, covered in more depth in the Query Performance & Optimization chapter later in this guide, potentially use an index on the date column more effectively.

### ❓ Follow-up Interview Questions

1. What's the difference between `NOW()` and `CURDATE()`?
2. How does `DATE_SUB(NOW(), INTERVAL 30 DAY)` in the concrete example determine the 30-day cutoff?
3. Why might performing date comparisons directly in SQL be preferable to doing so in application code?
4. What would `DATEDIFF()` return if the two dates given to it were in the opposite order?
5. Why does `DATE_FORMAT()` exist as a separate function rather than dates always being returned in one single fixed format?

---

## 6. What is the difference between COALESCE and IFNULL?

### 📖 Introduction

Both of these handle `NULL` values, covered in the Filtering, Sorting & Grouping chapter, by substituting a fallback value — but one is MySQL-specific, and the other is part of the broader SQL standard.

### 🔀 IFNULL: MySQL-Specific, Exactly Two Arguments

`IFNULL(expression, fallback)` returns `expression` if it isn't `NULL`, and `fallback` otherwise — a MySQL-specific function, tying back to the SQL-versus-MySQL implementation differences covered in the Introduction & Fundamentals chapter, accepting exactly two arguments.

### 🔀 COALESCE: Standard SQL, Any Number of Arguments

`COALESCE(expr1, expr2, expr3, ...)` returns the first non-`NULL` value among any number of given expressions, evaluated left to right — part of the standard SQL specification, so it works identically across MySQL, PostgreSQL, and other database systems.

### 🖼️ A Concrete Illustration

```sql
SELECT COALESCE(preferred_name, first_name, 'Guest') AS display_name
FROM customers;
```

Returns `preferred_name` if it's set; otherwise falls back to `first_name`; otherwise falls back to the literal string `'Guest'` — a three-way fallback chain that `IFNULL`, limited to exactly two arguments, couldn't express in a single function call.

### 💎 Good to Know: Prefer COALESCE for Portability and Multi-Value Fallback Chains

Since `COALESCE` is standard SQL and supports any number of fallback values, it's generally the more flexible, portable choice — `IFNULL` remains useful specifically for a simple, two-value MySQL-specific case, but doesn't scale to a longer fallback chain the way `COALESCE` does.

### ❓ Follow-up Interview Questions

1. Why is `IFNULL` limited to exactly two arguments while `COALESCE` isn't limited at all?
2. In the concrete three-way fallback example, why couldn't `IFNULL` express the same logic in one single call?
3. Why does `COALESCE`'s status as standard SQL matter for portability across database systems?
4. How does this question connect to the SQL-versus-MySQL implementation distinction covered in the Introduction & Fundamentals chapter?
5. When might `IFNULL` still be a perfectly reasonable choice over `COALESCE`?

---

## 7. What is a CASE expression, and how is it used within a query?

### 📖 Introduction

`CASE` brings conditional, if/else-style logic directly into a SQL query — genuinely useful anywhere a value needs to depend on a condition, rather than being fixed.

### 🔀 The Basic Form

```sql
SELECT name,
  CASE
    WHEN total_spent > 1000 THEN 'VIP'
    WHEN total_spent > 100 THEN 'Regular'
    ELSE 'New'
  END AS customer_tier
FROM customers;
```

Evaluates each `WHEN` condition in order for every row, returning the result of the first one that's true, or the `ELSE` value if none match — computed independently per row, exactly the scalar-function behavior covered earlier in this chapter.

### 🎯 Where CASE Can Be Used

Inside the `SELECT` list, to compute a derived column, as shown above; inside `ORDER BY`, to define a custom, non-alphabetical sort order; inside `WHERE`, to express more complex conditional filtering than a simple comparison alone could.

### 🖼️ A Concrete Illustration Inside GROUP BY

```sql
SELECT
  CASE WHEN total_spent > 1000 THEN 'VIP' ELSE 'Regular' END AS tier,
  COUNT(*) AS customer_count
FROM customers
GROUP BY tier;
```

Combining `CASE` with `GROUP BY`, covered in full in the Filtering, Sorting & Grouping chapter, and an aggregate function, covered earlier in this chapter, to bucket and count customers by a computed category rather than an existing column.

### 💎 Good to Know: CASE Brings Conditional Branching Into a Declarative Query Language

The genuinely important insight is that `CASE` is what lets SQL, otherwise a purely declarative language covered in the Introduction & Fundamentals chapter, express conditional, branching logic directly within a single query, rather than needing that branching to happen in application code after the data is retrieved.

### ❓ Follow-up Interview Questions

1. Why does `CASE` evaluate its `WHEN` conditions in order, stopping at the first true one?
2. What happens if no `WHEN` condition matches and there's no `ELSE` clause at all?
3. In the GROUP BY example, why does the computed `tier` value need to be repeated rather than referenced by its alias in the GROUP BY clause in standard SQL (though MySQL specifically does allow the alias)?
4. Why is CASE described as bringing "conditional branching" into an otherwise declarative language?
5. How would you use CASE to compute a custom, non-alphabetical sort order in an ORDER BY clause?

---

## 8. How do aggregate functions handle NULL values?

### 📖 Introduction

`NULL`'s special comparison behavior, covered in the Filtering, Sorting & Grouping chapter, extends into how aggregate functions, covered earlier in this chapter, treat it too — worth knowing precisely, since it affects the accuracy of a computed result.

### 🚫 Most Aggregate Functions Simply Ignore NULLs

`SUM()`, `AVG()`, `MIN()`, and `MAX()` all skip `NULL` values entirely when computing their result — a `NULL` value contributes nothing to a `SUM()`, and isn't considered when computing an `AVG()`, `MIN()`, or `MAX()`, as if that particular row's value for that column simply wasn't there at all.

### 🔢 COUNT(column_name) Also Ignores NULLs, Exactly as Covered Earlier

Tying directly back to this chapter's earlier `COUNT(*)`-versus-`COUNT(column_name)` question — `COUNT(column_name)` specifically excludes `NULL` values, which is exactly the mechanism behind that distinction.

### ⚠️ Why This Matters for AVG() Specifically

`AVG()` computing its result only from non-`NULL` values means the denominator it divides by is the count of non-`NULL` rows, not the total row count — a genuinely important detail, since it means `AVG()` isn't simply "sum divided by total rows" whenever any `NULL`s are present in the column.

### 🖼️ A Concrete Illustration

A `ratings` column with values `[5, NULL, 3, 4]` — `AVG(ratings)` computes `(5 + 3 + 4) / 3 = 4`, not `(5 + 0 + 3 + 4) / 4`, since the `NULL` is excluded from both the sum and the count entirely, rather than being treated as zero.

### 💎 Good to Know: NULL Is Excluded Entirely From Aggregate Calculations, Never Treated as Zero

The single most important detail to internalize here is that `NULL` is excluded from an aggregate calculation entirely — it's never silently treated as zero, which is exactly the kind of subtle miscalculation that would occur if this distinction were misunderstood.

### ❓ Follow-up Interview Questions

1. Why does `SUM()` treat a `NULL` value as if it weren't there at all, rather than as zero?
2. In the ratings example, why does `AVG()` divide by 3 rather than 4?
3. How does this question connect to the `COUNT(*)`-versus-`COUNT(column_name)` distinction covered earlier in this chapter?
4. What would happen if a column contained only `NULL` values and `AVG()` were applied to it?
5. Why is it genuinely important to know that NULL is excluded rather than treated as zero, when interpreting an aggregate result?

---

## 9. What is the difference between a built-in function and a user-defined function?

### 📖 Introduction

Every function covered so far in this chapter — `COUNT()`, `CONCAT()`, `COALESCE()` — ships with MySQL itself; a user-defined function is one an application team writes and adds to the database themselves.

### 📦 Built-In Functions

Functions provided directly by MySQL itself, covered throughout this chapter — always available in every database, requiring no setup, and generally well-optimized by the database engine.

### ✍️ User-Defined Functions (UDFs)

Custom functions written and registered by a database's own users, defined using `CREATE FUNCTION`, encapsulating reusable, custom logic specific to a particular application — closely related to stored procedures, covered in full in the Views, Stored Procedures & Triggers chapter later in this guide, but designed specifically to return a single computed value usable directly within a larger SQL expression, the same way any scalar function, covered earlier in this chapter, would be.

### 🖼️ A Concrete Illustration

A business might define a UDF like `calculate_loyalty_tier(customer_id)`, encapsulating a specific, custom scoring formula — usable in a query as `SELECT name, calculate_loyalty_tier(id) FROM customers`, exactly as if it were a built-in scalar function.

### ⚖️ The Trade-off

A UDF centralizes custom logic in one place, reusable across many different queries, but can be genuinely harder to optimize than a built-in function, and adds a piece of logic living inside the database itself rather than in application code — a trade-off covered in more depth in the Views, Stored Procedures & Triggers chapter's discussion of where business logic should actually live.

### 💎 Good to Know: A UDF Extends MySQL With Custom Logic, Usable Exactly Like Any Built-In Scalar Function

The genuinely important framing is that a UDF isn't a fundamentally different kind of thing from a built-in function — once defined, it's called and used in a query exactly the same way, the only difference being who wrote it and where its logic actually lives.

### ❓ Follow-up Interview Questions

1. Why are built-in functions generally better optimized than a typical user-defined function?
2. In the `calculate_loyalty_tier` example, why is the UDF usable exactly like a built-in scalar function once defined?
3. How does a UDF relate to stored procedures, covered in more depth in the Views, Stored Procedures & Triggers chapter?
4. What's the genuine trade-off of putting custom business logic inside a UDF rather than in application code?
5. When would defining a UDF be worth the added complexity compared to just writing that same logic in application code?

---

## 10. How would you use functions to clean or transform data directly within a query?

### 📖 Introduction

This capstone question for the chapter combines nearly every function category covered so far — aggregate, string, date/time, COALESCE, and CASE — into one practical, real-world data-cleaning scenario.

### 🧹 A Realistic Combined Example

```sql
SELECT
  TRIM(UPPER(country)) AS country_clean,
  COALESCE(preferred_name, first_name, 'Unknown') AS display_name,
  CASE WHEN total_spent > 1000 THEN 'VIP' ELSE 'Regular' END AS tier,
  COUNT(*) AS customer_count,
  AVG(DATEDIFF(NOW(), signup_date)) AS avg_days_since_signup
FROM customers
GROUP BY country_clean, tier;
```

This single query combines a string function (`TRIM`/`UPPER`) to normalize inconsistent country name casing, `COALESCE` to handle missing display names, `CASE` to compute a derived category, and two aggregate functions (`COUNT`, `AVG`) working alongside a date function (`DATEDIFF`) — every category covered across this chapter, working together in one realistic report.

### 🎯 Why Doing This in SQL, Rather Than in Application Code, Is Often Preferable

Cleaning and transforming data directly within the query means the database only ever sends back already-clean, already-shaped data — reducing what has to travel over the network and avoiding repeating the same cleanup logic across every single application that might query this same data.

### 💎 Good to Know: This Capstone Question Is Every Function Category From This Chapter, Working Together in One Realistic Query

Recognizing that a real-world reporting query genuinely combines several different function categories at once — rather than using just one function type in isolation — is exactly the kind of practical synthesis this capstone question is testing for.

### ❓ Follow-up Interview Questions

1. Why does normalizing country name casing directly in SQL avoid a whole class of downstream data-quality bugs?
2. Why might cleaning and transforming data in the query itself be preferable to doing so in application code?
3. In the combined example, why does `GROUP BY` need to reference the computed `country_clean` and `tier` values?
4. How does this capstone query demonstrate that aggregate and scalar functions can be combined within the same SELECT list?
5. If you were reviewing this query for a teammate, what would you check to confirm each function is being used correctly?

---