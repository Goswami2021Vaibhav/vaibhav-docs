---
title: SQL Queries (CRUD)
description: SELECT, INSERT, UPDATE, DELETE — the core query operations.
sidebar_position: 3
---

# SQL Queries (CRUD)

## 1. What is the SELECT statement, and how do you use it to retrieve data?

### 📖 Introduction

`SELECT` is the DQL statement, covered in the Introduction & Fundamentals chapter's discussion of SQL's sublanguages, that every other question in this chapter and much of this guide ultimately builds toward — the one statement that reads data without ever modifying it.

### 🔍 The Basic Form

`SELECT column1, column2 FROM table_name` retrieves the specified columns from every row in the given table — the most fundamental way to read data out of a relational database, covered in the Introduction & Fundamentals chapter's discussion of tables, rows, and columns.

### 🧩 Building Up a Full Query

A `SELECT` statement can be extended with a `WHERE` clause to filter which rows are returned, covered in full in the Filtering, Sorting & Grouping chapter later in this guide, an `ORDER BY` to control result order, also covered in that chapter, and joined with other tables, covered in full in the Joins chapter.

### 🖼️ A Concrete Illustration

```sql
SELECT name, email FROM customers WHERE country = 'USA' ORDER BY name;
```

Retrieves just the `name` and `email` columns, only for customers in the USA, sorted alphabetically by name — a single, declarative statement describing exactly what result is wanted.

### 💎 Good to Know: `SELECT` Is Declarative — It Describes the Result, Not the Retrieval Steps

Tying back to SQL's declarative nature covered in the Introduction & Fundamentals chapter, `SELECT` describes what data should come back, not the specific steps for finding it — the database engine's own query optimizer decides how to actually execute it, covered in more depth in the Query Performance & Optimization chapter later in this guide.

### ❓ Follow-up Interview Questions

1. Why is `SELECT` classified as DQL rather than DML, tying back to the Introduction & Fundamentals chapter?
2. What's the minimum information a `SELECT` statement needs to retrieve any data at all?
3. In the concrete example, what would change about the result if the `ORDER BY` clause were removed?
4. Why is `SELECT` described as declarative rather than procedural?
5. How does `SELECT` relate to the `WHERE`, `ORDER BY`, and `JOIN` clauses covered in later chapters?

---

## 2. What is the difference between `SELECT *` and selecting specific columns?

### 📖 Introduction

`SELECT *` looks like a harmless shortcut, but it carries real, concrete costs that selecting exact columns avoids entirely.

### ⭐ What `SELECT *` Does

Retrieves every single column defined on the queried table (or tables, if joined), without needing to name any of them explicitly — convenient for quick, ad hoc exploration of a table's contents.

### 🎯 What Selecting Specific Columns Does

`SELECT name, email FROM customers` retrieves only the named columns, explicitly stating exactly what data the query actually needs.

### ⚠️ Why This Difference Genuinely Matters

`SELECT *` transfers more data than necessary whenever a table has columns the calling code doesn't actually use, wasting network and processing overhead, covered in more depth in the Query Performance & Optimization chapter later in this guide. It also silently breaks if the table's structure changes — a column added or reordered later can shift what a piece of application code receives, without that code ever being told anything changed. It can also prevent the query optimizer from using a covering index, covered in the Indexing chapter later in this guide, that would otherwise satisfy the query without ever touching the full table.

### 🖼️ A Concrete Illustration

A route handler needing only a customer's `name` and `email` but querying `SELECT * FROM customers` also receives that customer's address, signup date, and every other column — wasted transfer, and a query that's more fragile to future schema changes than one naming exactly what it needs.

### 💎 Good to Know: `SELECT *` Is Reasonable for Ad Hoc Exploration, Not for Production Application Code

The practical rule of thumb is that `SELECT *` is fine for a quick, one-off exploratory query run manually, but production application code should always name its exact columns explicitly, for both performance and resilience to schema changes.

### ❓ Follow-up Interview Questions

1. Why does `SELECT *` risk silently breaking application code when a table's structure changes later?
2. How can `SELECT *` prevent the query optimizer from using a covering index, covered in the Indexing chapter?
3. Why is the extra data transferred by `SELECT *` a genuine performance cost, not just a style preference?
4. When would `SELECT *` still be a reasonable, acceptable choice?
5. How would you refactor an existing codebase that used `SELECT *` extensively in its production queries?

---

## 3. How do you insert data into a table using INSERT?

### 📖 Introduction

`INSERT` is the DML statement, covered in the Introduction & Fundamentals chapter, responsible for adding brand-new rows into a table — the "Create" in CRUD.

### ✍️ The Basic Form

```sql
INSERT INTO customers (name, email) VALUES ('Alex Smith', 'alex@example.com');
```

Explicitly naming the target columns and providing a matching value for each, in the same order — adding exactly one new row to the `customers` table.

### 🔢 Columns Not Explicitly Provided

Any column not named in the `INSERT` statement receives its default value, covered in the Constraints chapter's discussion of the `DEFAULT` constraint, or `NULL` if no default is defined and the column allows nulls — or the statement fails outright if that column is both required (`NOT NULL`, covered in the Constraints chapter) and has no default.

### 🔑 Auto-Incrementing Primary Keys

A primary key column, covered in the Keys & Relationships chapter later in this guide, is commonly configured with `AUTO_INCREMENT` in MySQL, meaning it's deliberately omitted from the `INSERT` statement entirely, and the database itself assigns the next sequential value automatically.

### 💎 Good to Know: Always Name Columns Explicitly in an INSERT Statement

Just like `SELECT *`, covered in the previous question, omitting the column list — `INSERT INTO customers VALUES (...)` — relies entirely on the table's current column order, which is fragile and breaks silently if that order ever changes; explicitly naming columns avoids this exact same class of risk.

### ❓ Follow-up Interview Questions

1. What happens to a column that isn't explicitly named in an INSERT statement?
2. Why is an auto-incrementing primary key column typically omitted from an INSERT statement entirely?
3. Why is omitting the column list in an INSERT statement risky, similar to the `SELECT *` concern covered in the previous question?
4. What would happen if you tried to insert a row while omitting a column that's both `NOT NULL` and has no default value?
5. How does INSERT relate to the DML classification covered in the Introduction & Fundamentals chapter?

---

## 4. How do you update existing data using UPDATE, and why is a WHERE clause critical?

### 📖 Introduction

`UPDATE` is the DML statement, covered in the Introduction & Fundamentals chapter, responsible for modifying existing rows — the "Update" in CRUD, and one of the two statements in this chapter genuinely dangerous to run carelessly.

### ✏️ The Basic Form

```sql
UPDATE customers SET email = 'new@example.com' WHERE id = 42;
```

Sets the `email` column to a new value, but only for the row (or rows) matching the `WHERE` clause's condition — here, the single customer with `id = 42`.

### ⚠️ Why the WHERE Clause Is Critical

Without a `WHERE` clause, `UPDATE customers SET email = 'new@example.com'` applies that same change to every single row in the entire table, covered in more depth in the next question — since `UPDATE` has no built-in confirmation step, this happens immediately and irreversibly unless wrapped in a transaction, covered in full in the Transactions chapter later in this guide.

### 🔢 Updating Multiple Columns at Once

```sql
UPDATE customers SET email = 'new@example.com', name = 'Alex Johnson' WHERE id = 42;
```

Multiple columns can be set in a single `UPDATE` statement, separated by commas, all applied atomically to whichever rows match the `WHERE` clause.

### 💎 Good to Know: Always Verify the WHERE Clause's Match With a SELECT First

A genuinely useful habit before running any `UPDATE` (or `DELETE`, covered in the next question) against production data is first running the exact same `WHERE` condition as a `SELECT`, confirming it matches only the intended rows before committing to the actual modification.

### ❓ Follow-up Interview Questions

1. Why does an `UPDATE` statement without a `WHERE` clause affect every single row in the table?
2. Why can multiple columns be updated safely in one single `UPDATE` statement?
3. What habit would help catch a dangerously broad `WHERE` clause before it actually modifies data?
4. How does wrapping an `UPDATE` in a transaction, covered in the Transactions chapter, provide a safety net here?
5. How does `UPDATE` relate to the DML classification covered in the Introduction & Fundamentals chapter?

---

## 5. How do you delete data using DELETE, and what's the difference between DELETE and TRUNCATE?

### 📖 Introduction

`DELETE` is the DML statement, covered in the Introduction & Fundamentals chapter, responsible for removing rows — the "Delete" in CRUD, and, alongside `UPDATE`, the other statement genuinely dangerous without a `WHERE` clause.

### 🗑️ The Basic Form

```sql
DELETE FROM customers WHERE id = 42;
```

Removes only the row (or rows) matching the `WHERE` clause — exactly the same "verify with `SELECT` first" habit covered in the previous question applies here too, given the exact same risk of an omitted `WHERE` clause affecting the entire table.

### 🧹 TRUNCATE, By Contrast

`TRUNCATE TABLE customers` removes every single row from a table in one operation, with no `WHERE` clause option at all — it's specifically designed to empty an entire table, not selectively remove rows.

### ⚖️ The Practical Differences

`DELETE` is a row-by-row operation, logged individually, and can be rolled back within a transaction, covered in full in the Transactions chapter later in this guide. `TRUNCATE` is typically implemented as a much faster, lower-level operation that deallocates the table's data pages entirely rather than removing rows one at a time, and in MySQL specifically, it isn't transactional in the same way — it can't be rolled back once executed. `TRUNCATE` also resets any `AUTO_INCREMENT` counter, covered in the previous question's discussion of auto-incrementing primary keys, back to its starting value, while `DELETE` does not.

### 💎 Good to Know: TRUNCATE Is "Empty the Whole Table, Fast," Not "Delete Some Rows"

The genuinely important distinction is that `TRUNCATE` isn't a faster version of `DELETE` for the same job — it's a fundamentally different operation meant specifically for emptying an entire table quickly, with none of `DELETE`'s row-level selectivity or transactional safety.

### ❓ Follow-up Interview Questions

1. Why is verifying a `DELETE`'s `WHERE` clause with a `SELECT` first just as important as it is for `UPDATE`?
2. Why can't `TRUNCATE` selectively remove only some rows the way `DELETE` can?
3. Why is `TRUNCATE` typically much faster than a `DELETE` affecting the same number of rows?
4. Why does `TRUNCATE` reset an `AUTO_INCREMENT` counter while `DELETE` doesn't?
5. In what scenario would `TRUNCATE`'s lack of rollback support be a genuine risk?

---

## 6. What is the difference between DELETE, TRUNCATE, and DROP?

### 📖 Introduction

These three all remove data in some sense, but they operate at three genuinely different levels — rows, an entire table's contents, and the table's structure itself.

### 🗑️ DELETE

Removes specific rows, selectively, based on a `WHERE` clause, covered in the previous question — the table itself, its structure, and any unmatched rows remain entirely untouched.

### 🧹 TRUNCATE

Removes every row from a table, covered in the previous question, but the table's structure — its columns, constraints, covered in the Constraints chapter later in this guide, and indexes, covered in the Indexing chapter — remains fully intact and ready for new data to be inserted.

### 💥 DROP

`DROP TABLE customers` removes the table's structure entirely — every row, every column definition, every constraint and index associated with it — the table itself ceases to exist, and would need to be recreated with `CREATE TABLE` from scratch, covered in the Introduction & Fundamentals chapter's discussion of DDL, to be used again.

### 🖼️ A Concrete Comparison

`DELETE FROM customers WHERE id = 42` removes one customer. `TRUNCATE TABLE customers` empties every customer but keeps the `customers` table ready for new data. `DROP TABLE customers` removes the `customers` table itself — there's no table left to insert new data into at all, until it's recreated.

### 💎 Good to Know: These Three Represent Increasing Scope — Row, Table Contents, Table Structure

The clean way to keep these straight: `DELETE` operates at the row level, `TRUNCATE` at the level of a table's entire contents while preserving structure, and `DROP` at the level of the structure itself — three genuinely different scopes, not three interchangeable ways to remove data.

### ❓ Follow-up Interview Questions

1. Why does a table's structure remain fully intact after a `TRUNCATE`, but not after a `DROP`?
2. What would you need to do to use a table again after running `DROP TABLE` on it?
3. Why is `DELETE` the only one of these three that supports selectively removing just some rows?
4. Which of these three is classified as DDL rather than DML, tying back to the Introduction & Fundamentals chapter, and why?
5. How would you decide which of these three is the correct choice for a specific real-world cleanup task?

---

## 7. What is the purpose of the DISTINCT keyword?

### 📖 Introduction

A `SELECT` query, covered earlier in this chapter, can easily return duplicate rows when it only selects a subset of a table's columns — `DISTINCT` exists specifically to collapse those duplicates.

### 🔁 What DISTINCT Does

`SELECT DISTINCT country FROM customers` returns each unique value of `country` exactly once, regardless of how many rows in the underlying table happen to share that same value.

### 🎯 Why Duplicates Arise in the First Place

A table might have a thousand customers, but only a handful of distinct countries among them — selecting just the `country` column without `DISTINCT` returns that same value repeated once per matching customer row, since `SELECT`, covered earlier in this chapter, otherwise returns exactly one output row per matching input row.

### 🖼️ A Concrete Illustration

```sql
SELECT DISTINCT country FROM customers;
```

Returns `USA`, `Canada`, `UK` — each listed exactly once — rather than each value repeated once per customer from that country.

### ⚠️ DISTINCT Across Multiple Columns

`SELECT DISTINCT country, city FROM customers` treats the entire combination of `country` and `city` together as the thing being deduplicated — two rows are only considered duplicates if both columns match, not just one.

### 💎 Good to Know: DISTINCT Operates on the Entire Selected Row, Not Column by Column Independently

A genuinely important nuance is that `DISTINCT` deduplicates based on the combination of every column actually selected — adding another column to the `SELECT` list can reintroduce rows that looked identical before, simply because that additional column now makes them genuinely distinct.

### ❓ Follow-up Interview Questions

1. Why does selecting just one column from a large table often produce many duplicate values without `DISTINCT`?
2. How does `DISTINCT` behave differently when applied to multiple selected columns at once, rather than just one?
3. What would happen if an additional column were added to a query already using `DISTINCT`?
4. Why does `DISTINCT` operate on the combination of selected columns, rather than deduplicating each column independently?
5. Would `DISTINCT` ever be necessary on a query already selecting a table's primary key? Why or why not?

---

## 8. What is the LIMIT clause used for, and how does it relate to pagination?

### 📖 Introduction

Without `LIMIT`, a `SELECT` query, covered earlier in this chapter, returns every single matching row at once — genuinely impractical once a table grows large, which is exactly the gap `LIMIT` fills.

### 🔢 What LIMIT Does

`SELECT * FROM customers LIMIT 10` returns only the first 10 matching rows, rather than the entire result set — typically combined with `ORDER BY`, covered in full in the Filtering, Sorting & Grouping chapter later in this guide, to make "first 10" mean something consistent and predictable across repeated queries.

### 📄 LIMIT With OFFSET, for Pagination

`SELECT * FROM customers ORDER BY id LIMIT 10 OFFSET 20` skips the first 20 matching rows and returns the next 10 — the standard mechanism for offset-based pagination, returning one "page" of results at a time rather than the entire collection at once.

### ⚠️ Why OFFSET Gets Slower for Large Values

The database still has to internally scan and skip past every one of the offset rows before it can start returning the requested page — meaning `LIMIT 10 OFFSET 100000` genuinely does more work than `LIMIT 10 OFFSET 10`, even though both return the same number of rows, covered in more depth in the Query Performance & Optimization chapter later in this guide.

### 🖼️ A Concrete Illustration

A `customers` table with a million rows, paginated 20 per page: page 1 is `LIMIT 20 OFFSET 0`, page 2 is `LIMIT 20 OFFSET 20`, and so on — each subsequent page's `OFFSET` grows, and so does the amount of work the database has to do to reach it.

### 💎 Good to Know: LIMIT/OFFSET Is Simple but Genuinely Degrades at Scale

Recognizing that offset-based pagination is simple to implement but gets progressively slower for deep pagination is exactly the trade-off worth naming here — an alternative, cursor-based approach avoiding this exact cost is covered in more depth in the Query Performance & Optimization chapter later in this guide.

### ❓ Follow-up Interview Questions

1. Why does a query typically combine `LIMIT` with `ORDER BY` rather than using `LIMIT` alone?
2. Why does `LIMIT 10 OFFSET 100000` do more work than `LIMIT 10 OFFSET 10`, despite both returning 10 rows?
3. How does `LIMIT`/`OFFSET` together implement standard, page-based pagination?
4. Why does offset-based pagination's performance genuinely degrade for very deep pages?
5. How does this question connect to the more advanced pagination trade-offs covered in the Query Performance & Optimization chapter?

---

## 9. How do you insert multiple rows in a single INSERT statement?

### 📖 Introduction

Running a separate `INSERT`, covered earlier in this chapter, for every single new row is correct but genuinely wasteful when many rows need to be added at once — MySQL supports a more efficient, batched form instead.

### 📦 The Multi-Row INSERT Syntax

```sql
INSERT INTO customers (name, email) VALUES
  ('Alex Smith', 'alex@example.com'),
  ('Jordan Lee', 'jordan@example.com'),
  ('Sam Patel', 'sam@example.com');
```

A single `INSERT` statement, with multiple comma-separated value sets, adds all three rows to the `customers` table in one single operation.

### 🎯 Why This Is Preferable to Many Individual INSERT Statements

Each individual `INSERT` statement carries its own round-trip and processing overhead — batching many rows into a single statement significantly reduces that overhead when inserting a genuinely large number of rows at once, a concern covered in more depth in the Query Performance & Optimization chapter later in this guide.

### 🔄 How This Interacts With Transactions

A multi-row `INSERT` is atomic as a single statement — if one row's values violate a constraint, covered in the Constraints chapter later in this guide, the entire statement fails and no rows from it are inserted, rather than partially succeeding on the rows before the failing one.

### 💎 Good to Know: Batched Inserts Are a Genuine Performance Technique, Not Just Convenient Syntax

Recognizing multi-row `INSERT` as a real, measurable performance optimization for bulk data loading — not merely a syntactic convenience — is the practical insight this question is testing for.

### ❓ Follow-up Interview Questions

1. Why does batching many rows into one INSERT statement reduce overhead compared to many individual statements?
2. What happens to the entire multi-row INSERT if just one of its value sets violates a constraint?
3. Why is a multi-row INSERT considered atomic as a single statement?
4. When would running individual INSERT statements still be a reasonable choice over batching them?
5. How does this batching technique relate to the performance concerns covered in the Query Performance & Optimization chapter?

---

## 10. What happens if you run an UPDATE or DELETE without a WHERE clause?

### 📖 Introduction

This capstone question for the chapter directly confronts the single most dangerous mistake covered across this entire chapter — worth spelling out precisely, since it's a genuinely common, genuinely costly real-world error.

### ⚠️ What Actually Happens

An `UPDATE customers SET email = 'placeholder@example.com'` with no `WHERE` clause applies that exact change to every single row in the `customers` table — not just one customer, but all of them, immediately. `DELETE FROM customers` with no `WHERE` clause removes every single row from the table, functionally equivalent to `TRUNCATE`, covered earlier in this chapter, except still logged row-by-row and still rollback-able within an open transaction.

### 🔒 Why Nothing Stops This by Default

Neither `UPDATE` nor `DELETE` requires a `WHERE` clause at all — omitting one isn't a syntax error, it's a perfectly valid statement that simply means "apply to every row," which is exactly what makes forgetting a `WHERE` clause so easy to do and so damaging when it happens.

### 🛡️ How to Prevent This in Practice

- **Always verify with a `SELECT` first** — covered earlier in this chapter, running the exact same `WHERE` condition as a `SELECT` before committing to the actual `UPDATE` or `DELETE`.
- **Wrap the operation in a transaction** — covered in full in the Transactions chapter later in this guide, allowing a mistake to be rolled back before it's committed, rather than being immediately permanent.
- **Use MySQL's "safe update mode"** — a client-side setting that refuses to run an `UPDATE` or `DELETE` without a `WHERE` clause referencing a key column, specifically as a safety net against exactly this mistake.

### 💎 Good to Know: This Capstone Question Ties Together Every Individual Safety Habit Covered Across This Chapter

Every individual technique covered in this chapter — explicit column naming, verifying with `SELECT` first, understanding `TRUNCATE`'s scope — ultimately serves this one same underlying goal: never letting a statement affect more rows than genuinely intended.

### ❓ Follow-up Interview Questions

1. Why is running an UPDATE or DELETE without a WHERE clause valid SQL rather than a syntax error?
2. Why is a DELETE without a WHERE clause functionally similar to TRUNCATE, but not identical to it?
3. How does wrapping an UPDATE or DELETE in a transaction provide a genuine safety net against this mistake?
4. What does MySQL's "safe update mode" actually protect against?
5. How do the individual safety habits covered throughout this chapter all connect back to this one same underlying risk?

---