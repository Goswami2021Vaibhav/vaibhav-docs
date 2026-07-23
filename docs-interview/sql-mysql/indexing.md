---
title: Indexing
description: How indexes speed up queries, and when they don't.
sidebar_position: 11
---

# Indexing

## 1. What is an index, and how does it speed up query performance?

### 📖 Introduction

Every `WHERE` clause, covered in the Filtering, Sorting & Grouping chapter, and every `JOIN` condition, covered in full in the Joins chapter, ultimately has to locate specific rows — an index is what lets the database do that without checking every single row one by one.

### 📇 What an Index Is

An index is a separate, ordered data structure the database maintains alongside a table, letting it quickly locate rows matching a specific column's value — conceptually similar to a book's index, letting a reader jump directly to a relevant page rather than reading the entire book front to back to find a topic.

### 🐌 Without an Index: A Full Table Scan

Without an index on a queried column, the database has to check every single row in the table one by one to find matches — a full table scan, covered in more depth in the Query Performance & Optimization chapter later in this guide — genuinely fine on a small table, but progressively, dramatically slower as a table grows.

### ⚡ With an Index: Direct Lookup

With an appropriate index in place, the database can jump nearly directly to matching rows, using the index's own ordered structure, covered in more depth in the next question, rather than checking every row — the performance difference grows dramatically as table size increases.

### 🖼️ A Concrete Illustration

```sql
CREATE INDEX idx_customers_email ON customers(email);
```

A subsequent `WHERE email = 'alex@example.com'` query can use this index to locate the matching row directly, rather than scanning every row in a potentially enormous `customers` table.

### 💎 Good to Know: An Index Trades Some Write Cost and Storage for Dramatically Faster Reads

The genuinely important framing, expanded on in more depth later in this chapter, is that an index isn't a pure, unconditional win — it's a deliberate trade-off, covered in more depth later in this chapter, between faster reads and some added cost elsewhere.

### ❓ Follow-up Interview Questions

1. Why does a full table scan become dramatically slower as a table grows, while an indexed lookup doesn't scale the same way?
2. How is an index conceptually similar to a book's index?
3. What would happen to query performance on a `WHERE` clause filtering an unindexed column on a table with 10 million rows?
4. Why is an index described as a trade-off rather than a pure, unconditional performance win?
5. How does an index relate to the JOIN conditions covered throughout the Joins chapter?

---

## 2. What is the underlying data structure most commonly used for an index (B-tree)?

### 📖 Introduction

An index, covered in the previous question, doesn't work by magic — it's built on a specific, well-understood data structure genuinely designed for fast lookups, range queries, and ordered traversal all at once.

### 🌳 What a B-Tree Is

A B-tree (balanced tree) is a self-balancing tree data structure where each node can hold multiple sorted values and multiple children, keeping the overall tree shallow, wide, and consistently balanced — even as data is inserted or deleted, the tree automatically rebalances itself, keeping lookup time predictable rather than degrading over time.

### 🔍 Why B-Trees Suit Database Indexes Specifically

A B-tree's sorted structure supports not just exact-match lookups (`WHERE email = '...'`) but also range queries (`WHERE signup_date BETWEEN ...`, covered in the Filtering, Sorting & Grouping chapter) and ordered traversal (supporting `ORDER BY`, also covered in that chapter) — all efficiently, using the same underlying structure.

### 🖼️ A Concrete Illustration

Searching a B-tree index for a specific value involves comparing against a small number of values at each level of the tree, moving down toward the correct leaf — for a table with a million rows, a balanced B-tree might only need to examine roughly 20 values to find an exact match, rather than up to a million in a full table scan, covered in the previous question.

### 💎 Good to Know: A B-Tree's Balance Is What Keeps Lookup Time Predictable Regardless of How the Tree Grows

The genuinely important detail is that a B-tree's self-balancing property guarantees lookup time grows only logarithmically with the number of rows — meaning even a dramatically larger table only modestly increases how many comparisons a lookup actually needs.

### ❓ Follow-up Interview Questions

1. Why does a B-tree's self-balancing property matter for keeping lookup time predictable?
2. Why does a B-tree's sorted structure make it suitable for range queries, not just exact-match lookups?
3. Roughly how many comparisons would a balanced B-tree need for a million-row table, compared to a full table scan?
4. Why does an index's underlying structure need to support ORDER BY efficiently too, not just WHERE conditions?
5. What would happen to an index's performance characteristics if its underlying structure weren't self-balancing?

---

## 3. What is the difference between a clustered index and a non-clustered (secondary) index?

### 📖 Introduction

Not every index works the same way — a clustered index and a secondary index differ in a genuinely fundamental way: whether the index *is* the table's actual physical storage, or a separate structure pointing back to it.

### 🗄️ Clustered Index

A clustered index determines the actual physical order data is stored on disk — the table's rows themselves are physically organized according to this index. In MySQL's InnoDB storage engine, covered in the Introduction & Fundamentals chapter, the primary key, covered in the Keys & Relationships chapter, is automatically used as the clustered index — a table can only have one, since data can only be physically ordered one way at a time.

### 📇 Secondary (Non-Clustered) Index

A secondary index is a separate structure, pointing back to the actual row's location (via the clustered index's key) rather than storing the row's actual data directly itself — a table can have many secondary indexes, each on different columns.

### 🖼️ A Concrete Illustration

In an InnoDB `customers` table with `id` as the primary key, the clustered index physically stores rows ordered by `id`. An additional `CREATE INDEX idx_email ON customers(email)`, covered in the previous question, creates a secondary index — looking up by `email` first finds the matching entry in this secondary structure, then follows its pointer back to the actual row via the clustered index.

### 🎯 Why This Extra Lookup Step Matters

A secondary index lookup involves an additional step compared to a clustered index lookup — first finding the value in the secondary index, then following it back to the actual row — which is exactly why a clustered index (querying directly by primary key) tends to be marginally faster than a secondary index lookup for the same table.

### 💎 Good to Know: A Table Can Have Only One Clustered Index but Many Secondary Indexes

The single most important structural fact here: since a clustered index physically determines row storage order, there can only be one per table — every other index on that same table is necessarily a secondary index, pointing back to that one clustered structure.

### ❓ Follow-up Interview Questions

1. Why can a table have only one clustered index but potentially many secondary indexes?
2. What extra step does a secondary index lookup require that a clustered index lookup doesn't?
3. Why does InnoDB automatically use the primary key as the clustered index?
4. What would querying by `email` actually involve, step by step, given the secondary index example above?
5. Why does physically ordering a table's data only work for one column (or key) at a time?

---

## 4. What is a composite (multi-column) index, and how does column order affect its usefulness?

### 📖 Introduction

An index, covered earlier in this chapter, doesn't have to cover just one column — a composite index spans several, but exactly which columns lead matters enormously for whether it actually gets used.

### 🗂️ What a Composite Index Is

A composite index is a single B-tree, covered earlier in this chapter, built across multiple columns together, sorted first by the first column, then by the second column within each group of matching first-column values, and so on.

### 🖼️ A Concrete Illustration

```sql
CREATE INDEX idx_customers_country_city ON customers(country, city);
```

Sorts entries first by `country`, then by `city` within each country — genuinely similar to how a phone book sorts by last name first, then first name within each last name group.

### 🎯 Why Column Order Determines Usefulness

This composite index efficiently supports `WHERE country = 'USA'` alone, and `WHERE country = 'USA' AND city = 'NYC'` together, since both queries can use the index's leading `country` ordering — but it can't efficiently support `WHERE city = 'NYC'` alone, since `city` isn't the leading column, and the index's sort order doesn't group cities together independent of country.

### 🔤 The "Leftmost Prefix" Rule

A composite index can be used by a query filtering on its leading column alone, or its leading columns together in order, but not by a query skipping the leading column entirely and filtering only on a later one — a genuinely important, commonly tested rule.

### 💎 Good to Know: Column Order in a Composite Index Should Match the Most Common, Leading Filter Condition Across Real Queries

The genuinely practical takeaway is that a composite index's column order should be chosen deliberately based on how the application actually queries the table — putting the most commonly filtered-alone column first, since that's what the leftmost-prefix rule ultimately depends on.

### ❓ Follow-up Interview Questions

1. Why can `idx_customers_country_city` efficiently support a query filtering on `country` alone but not one filtering on `city` alone?
2. What is the "leftmost prefix" rule, and why does it determine which queries a composite index can actually help?
3. In the phone-book analogy, why does sorting by last name then first name fail to help you find someone by first name alone?
4. How would you decide which column should lead a composite index, given a table queried in several different ways?
5. Would `idx_customers_country_city` help a query filtering only on `city` if a separate, single-column index on `city` also existed?

---

## 5. What is a unique index, and how does it differ from a regular index?

### 📖 Introduction

An index, covered throughout this chapter, primarily exists to speed up lookups — a unique index does that too, but also simultaneously enforces a data-integrity rule, tying directly back to the `UNIQUE` constraint covered in the Constraints chapter.

### 🔒 What a Unique Index Enforces

A unique index guarantees that no two rows can have the same value in the indexed column (or combination of columns, for a composite unique index, covered in the previous question) — attempting to insert a duplicate value fails, exactly the same enforcement behavior covered in the Constraints chapter's discussion of the `UNIQUE` constraint.

### 🔗 The Relationship to the UNIQUE Constraint

In MySQL, defining a `UNIQUE` constraint on a column, covered in the Constraints chapter, automatically creates a unique index behind the scenes — the constraint and the index aren't two separate things happening independently; the constraint's enforcement genuinely depends on this same underlying indexed structure to check for duplicates efficiently.

### 🖼️ A Concrete Illustration

```sql
CREATE UNIQUE INDEX idx_customers_email ON customers(email);
```

Functionally equivalent to adding a `UNIQUE` constraint directly on the `email` column — both prevent duplicate emails, and both create the same underlying unique index to enforce it.

### 🎯 Why a Regular Index Doesn't Provide This Same Guarantee

A regular (non-unique) index, covered throughout this chapter, speeds up lookups on a column but places no restriction on that column's values at all — duplicate values are perfectly allowed, since the index's only job in that case is performance, not data integrity.

### 💎 Good to Know: A Unique Index Combines Performance and Data Integrity Into One Single Structure

The genuinely important insight tying this back to the Constraints chapter is that a `UNIQUE` constraint isn't enforced through some separate mechanism — it's enforced precisely because the database maintains a unique index behind it, checking for duplicates using the exact same fast lookup structure covered throughout this chapter.

### ❓ Follow-up Interview Questions

1. Why does a `UNIQUE` constraint, covered in the Constraints chapter, rely on an index to enforce itself efficiently?
2. What's the practical difference between a regular index and a unique index on the same column?
3. Why does a unique index need to check for existing duplicate values before allowing a new insert?
4. Could a composite unique index, covered in the previous question, allow a value to repeat in one column as long as another column's value differs? Explain.
5. Why is it accurate to say a unique index combines performance and data integrity into a single structure?

---

## 6. What are the trade-offs of adding an index (read speed versus write cost and storage)?

### 📖 Introduction

Every index covered so far in this chapter has been framed around its clear read-performance benefit — this question is about the genuine cost side of that same trade-off.

### ⚡ The Benefit: Faster Reads

Covered throughout this chapter — a well-chosen index can turn a slow full table scan into a fast, direct lookup.

### ✍️ The Cost: Slower Writes

Every `INSERT`, `UPDATE`, or `DELETE`, all covered in the SQL Queries (CRUD) chapter, that touches an indexed column also has to update every index covering that column, in addition to the actual row data itself — more indexes on a table means more work for every single write operation, since each one needs to be kept in sync.

### 💾 The Cost: Additional Storage

Each index is itself a genuine data structure, covered earlier in this chapter's discussion of B-trees, requiring its own additional disk space — a table with several indexes can have those indexes collectively consume a meaningful fraction of the table's total storage footprint.

### 🖼️ A Concrete Illustration

A `customers` table with five separate indexes means every single `INSERT` has to update the table's own row data, plus all five index structures — genuinely more write overhead than a table with no indexes at all, even though reads against those five indexed columns become dramatically faster.

### 🎯 Why This Trade-off Means Indexes Should Be Added Deliberately, Not Everywhere

Indexing every column "just in case" trades away write performance and storage for read speed that might never actually be needed on rarely queried columns — covered in more depth in the Query Performance & Optimization chapter later in this guide's discussion of deciding which columns genuinely deserve an index.

### 💎 Good to Know: Indexes Are a Genuine Trade-off, Not a Pure, Unconditional Performance Win

The single most important synthesis from this question, tying back to this chapter's opening question: indexes trade write speed and storage for read speed — deliberately choosing which columns actually deserve that trade-off, covered in more depth later in this chapter, is a genuine schema-design skill.

### ❓ Follow-up Interview Questions

1. Why does an INSERT on a heavily indexed table cost more than the same INSERT on a table with no indexes at all?
2. Why does each individual index consume its own additional storage, separate from the table's actual row data?
3. In the five-index example, what specifically has to happen on every single write to that table?
4. Why shouldn't every column in a table automatically get its own index?
5. How would you decide whether a specific column's read benefit from indexing outweighs its write and storage cost?

---

## 7. When does an index NOT get used by the query optimizer, even if one exists?

### 📖 Introduction

Simply having an index, covered throughout this chapter, doesn't guarantee the database will actually use it — the query optimizer, covered in more depth in the Query Performance & Optimization chapter later in this guide, decides that independently, based on several specific conditions.

### 🔧 Applying a Function to the Indexed Column

`WHERE YEAR(signup_date) = 2024` prevents the index on `signup_date` from being used efficiently, since the database would need to compute `YEAR()` for every single row to check the condition, rather than being able to look up the raw, unmodified `signup_date` value directly in the index's own sorted structure.

### 🔤 A Leading Wildcard in LIKE

Tying back to the Filtering, Sorting & Grouping chapter's discussion of `LIKE` — a pattern like `'%Smith'` can't use a standard index efficiently, since the index is sorted by the string's beginning, and a leading wildcard means the match could start anywhere.

### 🔀 Implicit Type Conversion

Comparing an indexed numeric column against a string value, or vice versa, can force MySQL to convert every single row's value before comparing, again preventing efficient use of the index's sorted structure.

### 📉 Low Selectivity

Covered in more depth in the next question — if an indexed column has very few distinct values relative to the table's total size, the optimizer may reasonably decide a full table scan, covered earlier in this chapter, is actually faster than using the index at all.

### 🖼️ A Concrete Illustration

An index on `signup_date` genuinely helps `WHERE signup_date = '2024-01-01'`, but does nothing for `WHERE YEAR(signup_date) = 2024` — rewriting the second query as `WHERE signup_date >= '2024-01-01' AND signup_date < '2025-01-01'` restores the index's usefulness, since it no longer needs to apply a function to the column before comparing.

### 💎 Good to Know: The Common Thread Is "Can the Optimizer Compare the Raw, Indexed Value Directly"

The genuinely important pattern connecting every scenario in this question: an index helps only when the database can compare a query's condition directly against the raw, stored, indexed value — any transformation, conversion, or leading wildcard breaks that direct comparison and defeats the index's usefulness.

### ❓ Follow-up Interview Questions

1. Why does wrapping an indexed column in a function like `YEAR()` prevent the index from being used efficiently?
2. How would you rewrite `WHERE YEAR(signup_date) = 2024` to actually take advantage of an index on `signup_date`?
3. Why does implicit type conversion between an indexed column and a comparison value defeat the index's usefulness?
4. What's the common thread connecting every scenario covered in this question?
5. How would you go about discovering that a query wasn't actually using an index you expected it to use?

---

## 8. What is index selectivity, and why does it matter?

### 📖 Introduction

Not every indexed column is equally useful, even with a properly designed index, covered throughout this chapter — selectivity is exactly what determines how much benefit an index actually provides for a given column.

### 🎯 What Selectivity Means

Selectivity measures how many distinct values a column has relative to the table's total row count — a column where nearly every row has a different value is highly selective; a column where most rows share just a handful of values is poorly selective.

### 📊 Why Low Selectivity Undermines an Index

An index on a poorly selective column — like a `status` column with only three possible values (`active`, `pending`, `inactive`) spread across a million rows — doesn't narrow things down very much; a lookup matching `status = 'active'` might still return hundreds of thousands of rows, meaning the database gains little over simply scanning the table directly, covered earlier in this chapter.

### 📈 Why High Selectivity Makes an Index Genuinely Valuable

An index on `email`, where nearly every value is unique, narrows a lookup down to essentially one single row — exactly the scenario where an index provides its most dramatic, genuine performance benefit.

### 🖼️ A Concrete Illustration

Indexing `email` (highly selective, nearly one distinct value per row) is a strong candidate for an index. Indexing `status` (poorly selective, just three distinct values) is a much weaker candidate — the query optimizer, covered in the previous question, might even choose to ignore that index entirely and perform a full table scan instead, correctly judging it faster for such a low-selectivity column.

### 💎 Good to Know: Selectivity Is Often a Better Predictor of an Index's Real-World Value Than Simply "Is This Column Frequently Queried"

The genuinely important, practical insight is that a frequently queried column isn't automatically a good indexing candidate — its selectivity matters just as much, since indexing a poorly selective column can waste the write and storage cost covered earlier in this chapter for very little actual read benefit.

### ❓ Follow-up Interview Questions

1. Why does an index on a column with only three possible values provide little real benefit on a million-row table?
2. Why is `email` described as highly selective while `status` is described as poorly selective?
3. Why might the query optimizer choose to ignore an existing index entirely for a low-selectivity column?
4. Why isn't "frequently queried" alone a sufficient reason to index a given column?
5. How would you measure a column's actual selectivity before deciding whether to index it?

---

## 9. What is a covering index?

### 📖 Introduction

A secondary index, covered earlier in this chapter, normally requires an extra step — finding a match, then following it back to the actual row — a covering index is the special case where that extra step becomes entirely unnecessary.

### 📇 What a Covering Index Is

A covering index is an index that contains every single column a specific query actually needs, directly within the index structure itself — meaning the database can answer the entire query using only the index, without ever needing to look up the actual row via the clustered index, covered earlier in this chapter.

### 🖼️ A Concrete Illustration

```sql
CREATE INDEX idx_customers_email_name ON customers(email, name);

SELECT name FROM customers WHERE email = 'alex@example.com';
```

Since the index itself already contains both `email` (used for filtering) and `name` (used in the `SELECT` list), the database never needs to follow a pointer back to the actual row at all — the index alone fully answers this specific query.

### 🎯 Why This Matters, Tying Back to SELECT *

This is exactly the connection flagged in the SQL Queries (CRUD) chapter's discussion of `SELECT *` potentially preventing a covering index — `SELECT * FROM customers WHERE email = '...'` needs every column, forcing the database to look up the full row regardless of any index, while `SELECT name FROM customers WHERE email = '...'`, needing only the two indexed columns, can be fully covered.

### 💎 Good to Know: A Covering Index Is a Genuine Performance Optimization Specifically Because It Eliminates the Secondary-Index Lookup Step

The genuinely important insight, tying back to this chapter's earlier clustered-versus-secondary-index question, is that a covering index specifically eliminates the extra "follow the pointer back to the row" step that an ordinary secondary index lookup normally requires.

### ❓ Follow-up Interview Questions

1. Why does a covering index eliminate the extra lookup step an ordinary secondary index normally requires?
2. In the concrete example, what would happen to the covering-index benefit if the query selected an additional, non-indexed column?
3. How does this question directly connect to the SELECT * concern raised in the SQL Queries (CRUD) chapter?
4. Why might a covering index need to include columns beyond just the ones used for filtering?
5. What's the trade-off of adding more columns to an index specifically to make it a covering index for a particular query?

---

## 10. How would you decide which columns in a table should be indexed?

### 📖 Introduction

This capstone question for the chapter combines every principle covered so far — selectivity, write cost, query patterns, and covering indexes — into one practical, real-world decision-making process.

### 🔍 Step 1: Identify Columns Actually Used in WHERE, JOIN, and ORDER BY

Start with columns genuinely appearing in frequent `WHERE` conditions, covered in the Filtering, Sorting & Grouping chapter, `JOIN` conditions, covered in full in the Joins chapter, or `ORDER BY` clauses — an index on a column that's never actually queried provides no benefit at all, only the write and storage cost covered earlier in this chapter.

### 📊 Step 2: Check Selectivity

Covered earlier in this chapter — favor indexing genuinely selective columns, and be skeptical of indexing low-selectivity columns like a `status` field with only a handful of possible values.

### ⚖️ Step 3: Weigh Read Frequency Against Write Frequency

A table that's read constantly but rarely written to can afford more indexes, covered earlier in this chapter's discussion of the read-versus-write trade-off — a table under heavy, constant write load needs to be more conservative about how many indexes it carries.

### 🗂️ Step 4: Consider Composite and Covering Indexes for Common Query Patterns

If a specific, frequent query filters on two columns together, covered earlier in this chapter's discussion of composite indexes and the leftmost-prefix rule, a well-ordered composite index serves that pattern better than two separate single-column indexes — and including the `SELECT` list's columns can turn it into a covering index, covered in the previous question, eliminating the row-lookup step entirely.

### 📈 Step 5: Measure, Don't Guess

Using `EXPLAIN`, covered in full in the Query Performance & Optimization chapter later in this guide, to confirm whether a candidate index is actually being used, and whether it genuinely improves a specific query's performance, rather than adding indexes speculatively based on assumption alone.

### 💎 Good to Know: This Decision Process Is Every Individual Concept From This Chapter, Organized Into One Practical Checklist

This capstone question doesn't introduce anything new — it takes selectivity, the read/write trade-off, composite indexes, and covering indexes, all covered throughout this chapter, and organizes them into the actual, practical decision-making process a developer walks through when deciding where indexes genuinely belong.

### ❓ Follow-up Interview Questions

1. Why does indexing a column that's never actually queried provide no benefit at all?
2. Why does a heavily written-to table need to be more conservative about how many indexes it carries?
3. How would a composite index serve a query filtering on two columns together better than two separate single-column indexes?
4. Why is "measure with EXPLAIN" the right final step, rather than adding indexes based on assumption alone?
5. Walking through this checklist, how would you decide whether a `last_login` column on a `users` table deserves an index?

---