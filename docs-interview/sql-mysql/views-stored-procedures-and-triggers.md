---
title: Views, Stored Procedures & Triggers
description: Reusable query logic that lives inside the database.
sidebar_position: 14
---

# Views, Stored Procedures & Triggers

## 1. What is a view, and what problem does it solve?

### 📖 Introduction

A complex query — several joins, covered in full in the Joins chapter, a handful of computed columns using functions, covered in the Functions chapter — is genuinely tedious to retype every single time it's needed; a view exists specifically to save and name that query once.

### 👁️ What a View Is

A view is a saved, named `SELECT` query, covered throughout the SQL Queries (CRUD) chapter, that can be queried again later exactly as if it were an ordinary table — the view itself stores no data of its own; it re-runs its underlying query fresh every single time it's referenced.

### 🖼️ A Concrete Illustration

```sql
CREATE VIEW active_customer_orders AS
SELECT customers.name, orders.id, orders.total
FROM customers
JOIN orders ON customers.id = orders.customer_id
WHERE customers.status = 'active';
```

```sql
SELECT * FROM active_customer_orders WHERE total > 500;
```

The complex join and filter logic is defined once, and every later query against `active_customer_orders` reuses it, without needing to repeat the underlying `JOIN` and `WHERE` conditions each time.

### 🎯 What Problem This Solves

Views centralize and simplify access to genuinely complex or frequently repeated query logic — instead of every application, or every developer, independently reconstructing the same join and filter conditions, they query one clearly named view instead.

### 💎 Good to Know: A View Is a Saved Query, Not a Saved Result

The single most important detail to internalize here, expanded on in more depth in the next question: a view holds no data of its own at all — it's purely a stored query definition, re-executed fresh against the underlying tables every time it's referenced.

### ❓ Follow-up Interview Questions

1. Why does querying a view re-run its underlying query fresh, rather than returning some previously stored result?
2. In the concrete example, what does the view actually save a developer from having to repeat?
3. Why might a team create a view specifically to centralize a frequently repeated join?
4. What would happen to a view's results if the underlying `customers` or `orders` table's data changed?
5. How is a view conceptually similar to a CTE, covered in the Subqueries & CTEs chapter, in terms of what it actually stores?

---

## 2. What is the difference between a view and a physical table?

### 📖 Introduction

A view, covered in the previous question, can be queried exactly like a table — but the resemblance stops well short of how each one actually stores, or doesn't store, data.

### 🗄️ A Physical Table

A physical table, covered throughout this guide, actually stores its own data on disk — inserting a row genuinely persists that data, and it remains there until explicitly modified or deleted.

### 👁️ A View

A view, covered in the previous question, stores no data of its own at all — only the query definition. Every time it's queried, the database re-executes that underlying query against the actual physical tables it references, producing a fresh result each time.

### 🎯 Why This Distinction Matters Practically

Since a view always reflects the current, live state of its underlying tables, covered in the previous question, it never becomes stale the way a manually saved, one-time query result would — but it also means a view provides no independent performance benefit on its own; a slow underlying query remains exactly as slow when wrapped in a view.

### 🖼️ A Concrete Illustration

Inserting a new order into the `orders` table immediately shows up the next time `active_customer_orders`, covered in the previous question, is queried — there's no separate, stale copy of data to update, since the view never actually held a copy in the first place.

### 💎 Good to Know: A View Never Goes Stale, but It's Also Never Faster Than Its Own Underlying Query

The genuinely important trade-off to hold together: a view's "always current" property is a direct consequence of storing no data at all — which is exactly why it can't independently speed up a genuinely slow underlying query, tying back to the performance concerns covered throughout the Query Performance & Optimization chapter.

### ❓ Follow-up Interview Questions

1. Why does a view never become stale the way a manually saved query result would?
2. Why doesn't wrapping a slow query in a view make it any faster?
3. In the concrete example, why does a newly inserted order immediately appear in the view's results?
4. What would need to be true for a view to actually provide some performance benefit rather than none at all?
5. How does this distinction connect to the CTE concept covered in the Subqueries & CTEs chapter?

---

## 3. Can you update data through a view, and what are the limitations of doing so?

### 📖 Introduction

Since a view is just a saved query, covered earlier in this chapter, rather than its own actual storage, updating "through" a view genuinely means updating the underlying table it draws from — and that only works under specific, limited conditions.

### ✅ When a View Is Updatable

A view can be updated if MySQL can unambiguously translate that update back onto exactly one row of exactly one underlying table — generally true for a simple view built from a single table with no aggregate functions, covered in the Functions chapter, no `GROUP BY`, covered in the Filtering, Sorting & Grouping chapter, and no `DISTINCT`, covered in the SQL Queries (CRUD) chapter.

### ⚠️ When a View Is Not Updatable

A view joining multiple tables, covered in full in the Joins chapter, using an aggregate function, or including a subquery, covered in the Subqueries & CTEs chapter, generally can't be updated directly — MySQL has no unambiguous way to know which specific underlying row, or rows across which tables, a given update should actually apply to.

### 🖼️ A Concrete Illustration

```sql
CREATE VIEW active_customers AS
SELECT * FROM customers WHERE status = 'active';

UPDATE active_customers SET name = 'Alex Johnson' WHERE id = 1;
```

This works, since `active_customers` draws from a single table with no aggregation — the update translates unambiguously back onto `customers` itself. The earlier `active_customer_orders` view, joining two tables, covered earlier in this chapter, could not be updated this same way.

### 💎 Good to Know: Updatability Depends Entirely on Whether the Update Can Be Unambiguously Traced Back to One Underlying Row

The genuinely important insight is that this isn't an arbitrary restriction — it's a direct consequence of a view being a saved query rather than actual storage, covered earlier in this chapter: MySQL can only apply an update through a view when doing so maps unambiguously back onto real, underlying table rows.

### ❓ Follow-up Interview Questions

1. Why can a simple, single-table view generally be updated, while a multi-table joined view generally can't?
2. In the concrete example, why does updating `active_customers` unambiguously translate back onto the `customers` table?
3. Why would an aggregate function or `GROUP BY` in a view's definition make it non-updatable?
4. Why is this restriction described as a direct consequence of what a view actually is, rather than an arbitrary limitation?
5. What would happen if you attempted to UPDATE through the earlier `active_customer_orders` view, which joins two tables?

---

## 4. What is a stored procedure, and why would you use one?

### 📖 Introduction

A view, covered earlier in this chapter, saves a single `SELECT` query — a stored procedure goes considerably further, saving an entire, potentially multi-statement, procedural sequence of logic inside the database itself.

### ⚙️ What a Stored Procedure Is

A stored procedure is a named, reusable block of procedural SQL code — potentially several statements, conditional logic, loops — stored and executed directly by the database, invoked with `CALL procedure_name(...)` rather than reissuing the same sequence of statements from application code every single time.

### 🖼️ A Concrete Illustration

```sql
DELIMITER //
CREATE PROCEDURE transfer_funds(IN from_id INT, IN to_id INT, IN amount DECIMAL(10,2))
BEGIN
  START TRANSACTION;
  UPDATE accounts SET balance = balance - amount WHERE id = from_id;
  UPDATE accounts SET balance = balance + amount WHERE id = to_id;
  COMMIT;
END //
DELIMITER ;

CALL transfer_funds(1, 2, 100);
```

Encapsulating the entire bank-transfer transaction, covered in the Transactions chapter's capstone question, as a single, reusable, named procedure — any application connecting to this database can now execute the exact same, correctly implemented transfer logic with one single call.

### 🎯 Why You'd Use One

Centralizing logic that needs to be executed consistently, potentially by several different applications or scripts connecting to the same database, and reducing network round-trips for a sequence of related statements that would otherwise each need to be sent individually from application code.

### 💎 Good to Know: A Stored Procedure Is Genuinely Procedural, Not Just a Saved Query Like a View

The genuinely important distinction from a view, covered earlier in this chapter: a stored procedure isn't just a saved `SELECT` — it can contain multiple statements, conditional branches, and loops, genuinely procedural logic that a view's single-query definition can't express.

### ❓ Follow-up Interview Questions

1. Why does a stored procedure reduce network round-trips compared to sending several individual statements from application code?
2. In the transfer_funds example, what genuine benefit does encapsulating this logic as a procedure provide over each application implementing the transfer itself?
3. Why is a stored procedure described as "genuinely procedural" in a way a view isn't?
4. What kind of logic would specifically require a stored procedure's conditional branches or loops, rather than a plain SQL statement?
5. Why might centralizing this logic in the database matter specifically when multiple different applications connect to the same database?

---

## 5. What is the difference between a stored procedure and a function in MySQL?

### 📖 Introduction

MySQL's user-defined functions were introduced briefly in the Functions chapter — this question draws the precise line between those and the stored procedures covered in the previous question.

### 📞 Stored Procedure

Invoked with `CALL`, covered in the previous question, a stored procedure doesn't have to return a value at all, and can have multiple input and output parameters — it's fundamentally about *performing an action*, potentially several, rather than computing and returning a single result.

### 🔢 Function (UDF)

Covered in the Functions chapter's discussion of user-defined functions — a function must return exactly one value, and, critically, can be used directly within an ordinary SQL statement, exactly like any built-in scalar function, covered in the Functions chapter — `SELECT name, calculate_loyalty_tier(id) FROM customers`, callable inline, unlike a stored procedure.

### 🖼️ A Concrete Illustration

`transfer_funds`, covered in the previous question, makes sense as a stored procedure — it performs multiple actions and returns nothing meaningful. A function computing a customer's loyalty tier makes sense as a function specifically because its result needs to be usable directly inside a `SELECT` list, the way `calculate_loyalty_tier(id)` was used in the Functions chapter's own example.

### 💎 Good to Know: The Deciding Factor Is "Does This Perform an Action, or Compute and Return One Value Usable Inline"

The clean, practical test for choosing between the two: if the goal is executing a sequence of actions (inserts, updates, conditional logic), reach for a stored procedure; if the goal is computing a single value usable directly inside another query, reach for a function instead.

### ❓ Follow-up Interview Questions

1. Why can a function be used directly inside a `SELECT` list while a stored procedure can't?
2. Why does `transfer_funds` make more sense as a stored procedure than as a function?
3. Why does a function need to return exactly one value, while a stored procedure doesn't need to return anything at all?
4. What's the practical test for deciding between a stored procedure and a function for a specific piece of logic?
5. How does this distinction connect to the user-defined function coverage in the Functions chapter?

---

## 6. What is a trigger, and what are the common events that can fire one (BEFORE/AFTER INSERT/UPDATE/DELETE)?

### 📖 Introduction

A stored procedure, covered earlier in this chapter, runs when explicitly called — a trigger instead runs automatically, in response to a specific data-modifying event happening on a specific table.

### ⚡ What a Trigger Is

A trigger is a named block of procedural code, similar in structure to a stored procedure, covered earlier in this chapter, that the database automatically executes whenever a specified event — an `INSERT`, `UPDATE`, or `DELETE`, all covered in the SQL Queries (CRUD) chapter — occurs on a specific table, without any application code needing to explicitly invoke it.

### 🕐 BEFORE vs. AFTER

`BEFORE` triggers run before the triggering statement actually modifies the table — commonly used to validate or adjust data before it's stored. `AFTER` triggers run once the triggering statement has already completed — commonly used to record an audit log or update a related, derived value elsewhere.

### 🖼️ A Concrete Illustration

```sql
CREATE TRIGGER before_order_insert
BEFORE INSERT ON orders
FOR EACH ROW
SET NEW.created_at = NOW();
```

Automatically stamps every new order with the current timestamp, without any application code needing to explicitly set that field on every single `INSERT`.

### 🎯 Common Use Cases

Automatically maintaining an audit trail of changes, keeping a denormalized summary value, covered in the Database Design chapter's discussion of denormalization, in sync whenever underlying data changes, or enforcing a business rule too complex for a `CHECK` constraint, covered in the Constraints chapter, to express directly.

### 💎 Good to Know: A Trigger Runs Automatically, Without Any Application Code Ever Explicitly Invoking It

The genuinely important distinction from both views and stored procedures, both covered earlier in this chapter: a trigger isn't something application code calls — it fires automatically, invisibly, whenever its specified event occurs, which is exactly the trade-off covered in more depth in the next question.

### ❓ Follow-up Interview Questions

1. Why does a BEFORE trigger make sense for validating or adjusting data, while an AFTER trigger makes sense for logging or derived updates?
2. In the concrete example, why doesn't application code need to explicitly set `created_at` on every INSERT?
3. Why might a trigger be used to enforce a business rule that a CHECK constraint, covered in the Constraints chapter, couldn't express?
4. How does a trigger's automatic invocation differ from how a stored procedure, covered earlier in this chapter, actually gets executed?
5. What kind of audit or logging use case would specifically benefit from an AFTER trigger?

---

## 7. What are the advantages and disadvantages of using stored procedures and triggers?

### 📖 Introduction

Both stored procedures and triggers, covered throughout this chapter, place logic directly inside the database itself — genuinely useful in some ways, but with real, concrete costs worth naming explicitly.

### ✅ The Advantages

- **Centralized, consistent logic** — covered earlier in this chapter, any application connecting to the database benefits from the exact same, correctly implemented behavior.
- **Reduced network round-trips** — covered in this chapter's stored-procedure question, a multi-statement operation executes entirely within the database in one call.
- **Automatic enforcement** — a trigger, covered earlier in this chapter, runs regardless of which application performed the triggering action, closing a gap application-level logic alone couldn't guarantee, similar in spirit to the independence of database constraints covered in the Constraints chapter.

### ⚠️ The Disadvantages

- **Hidden logic, harder to discover** — a trigger firing automatically, covered earlier in this chapter, isn't visible in application code at all; a developer reading the application's own codebase might have no idea a trigger even exists, let alone what it does.
- **Harder to version-control and test** — stored procedures and triggers typically live inside the database itself, rather than in the same source-controlled codebase as the rest of an application, making them easy to overlook during code review or miss when writing automated tests.
- **Database-specific syntax** — this exact syntax is MySQL-specific, tying back to the SQL-versus-implementation differences covered in the Introduction & Fundamentals chapter, adding a genuine migration cost if a team ever needs to switch database systems.
- **Harder to scale horizontally** — logic executing inside the database itself adds load directly to the database server, rather than to a horizontally scalable application layer, tying back to the Node.js guide's Worker Threads & Cluster chapter's discussion of scaling application instances.

### 💎 Good to Know: These Trade-offs Mirror the Constraints-Versus-Application-Validation Trade-off Covered Earlier in This Guide

The genuinely important connective insight is that this exact trade-off — enforcement guaranteed at the database level, at the cost of visibility and portability — mirrors the same constraints-versus-application-validation trade-off covered in the Constraints chapter, just applied here to procedural logic instead of declarative rules.

### ❓ Follow-up Interview Questions

1. Why does a trigger's automatic behavior make it genuinely harder to discover than equivalent application-level logic?
2. Why are stored procedures and triggers typically harder to version-control than application code?
3. Why does database-specific syntax add a genuine migration cost, tying back to the Introduction & Fundamentals chapter?
4. Why does logic executing inside the database itself scale differently than logic in a horizontally scalable application layer?
5. How does this trade-off mirror the constraints-versus-application-validation trade-off covered in the Constraints chapter?

---

## 8. How do stored procedures and triggers affect application architecture and maintainability?

### 📖 Introduction

Beyond the individual advantages and disadvantages covered in the previous question, it's worth considering how stored procedures and triggers specifically shape an application's overall architecture over time.

### 🏗️ Logic Split Across Two Genuinely Different Places

Once stored procedures or triggers, both covered throughout this chapter, are introduced, an application's actual business logic no longer lives entirely in one place — some of it lives in application code, and some lives inside the database itself, requiring anyone maintaining the system to understand and check both locations.

### 🔍 A Genuine Maintainability Cost: Discoverability

A developer debugging unexpected behavior might reasonably search only the application's own codebase, entirely missing a trigger, covered earlier in this chapter, silently modifying data as a side effect of an ordinary `INSERT` — tying directly back to the "hidden logic" disadvantage covered in the previous question.

### 🎯 When This Trade-off Is Still Worth Making

Logic that genuinely needs database-level guarantees — regardless of which application or script ever writes to the table — reasonably justifies this cost. Logic that's purely about a specific application's own business rules is usually better kept in that application's own codebase instead, where it stays visible, testable, and version-controlled alongside everything else.

### 🖼️ A Concrete Illustration

An audit trigger logging every change to a sensitive table, regardless of which of several different internal tools might write to it, is a reasonable use of database-level logic. A trigger implementing a specific business rule that only one single application actually needs is better implemented in that application's own code instead, tying back to the Node.js guide's Database Integration chapter's discussion of the Repository/Service Layer pattern.

### 💎 Good to Know: The Real Architectural Question Is "Does This Logic Need to Be Database-Level, or Just Convenient to Put There"

The genuinely important synthesis closing out this chapter: stored procedures and triggers are architecturally justified specifically when logic needs a guarantee independent of any one application — not merely because putting logic in the database happens to be convenient in the moment.

### ❓ Follow-up Interview Questions

1. Why does splitting business logic between application code and the database genuinely complicate long-term maintainability?
2. In the audit-trigger example, why does affecting several different internal tools specifically justify database-level logic?
3. Why is a single application's specific business rule usually better kept in that application's own code rather than a trigger?
4. How does this question's guidance connect to the Repository/Service Layer pattern covered in the Node.js guide's Database Integration chapter?
5. How would you decide, for a new piece of logic, whether it genuinely belongs in a trigger or in application code?

---

## 9. What is a materialized view, and how does MySQL's lack of native support affect design choices?

### 📖 Introduction

An ordinary view, covered earlier in this chapter, never becomes stale specifically because it stores no data — a materialized view makes the opposite trade, and MySQL's lack of direct support for it is worth understanding precisely.

### 💾 What a Materialized View Is

A materialized view is like an ordinary view, covered earlier in this chapter, except its result is actually computed once and physically stored, rather than being re-executed fresh on every single query — subsequent queries read the stored, precomputed result directly, considerably faster than re-running the full underlying query every time, at the cost of that stored result potentially becoming stale until it's explicitly refreshed.

### ⚠️ Why MySQL Doesn't Support This Directly

MySQL has no native `CREATE MATERIALIZED VIEW` syntax, unlike PostgreSQL or Oracle — tying back to the SQL-standard-versus-implementation differences covered in the Introduction & Fundamentals chapter, this is a genuine, MySQL-specific gap developers need to work around deliberately.

### 🛠️ Common Workarounds in MySQL

- **A regular table, populated and refreshed on a schedule** — using a stored procedure, covered earlier in this chapter, that repopulates it periodically, perhaps triggered by a scheduled job.
- **A regular table kept in sync via triggers** — a trigger, covered earlier in this chapter, on the underlying source table that updates the "materialized" table whenever the source data changes, rather than on a fixed schedule.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE customer_order_summary (
  customer_id INT PRIMARY KEY,
  total_orders INT,
  total_spent DECIMAL(10,2)
);
-- Populated periodically by a scheduled stored procedure, rather than computed live on every query
```

An ordinary table, standing in for a materialized view, explicitly populated by application-controlled logic, rather than any built-in MySQL feature.

### 💎 Good to Know: MySQL's Gap Here Directly Connects to the Denormalization Trade-off Covered in the Database Design Chapter

The genuinely important synthesis is that a manually maintained "materialized view" table in MySQL is, in effect, a deliberate application of denormalization, covered in full in the Database Design chapter — trading data freshness for read performance, just implemented through triggers or a stored procedure rather than through schema-level redundancy alone.

### ❓ Follow-up Interview Questions

1. Why does a materialized view's stored result become potentially stale, unlike an ordinary view?
2. Why doesn't MySQL support materialized views with dedicated, native syntax?
3. What's the trade-off between the scheduled-refresh workaround and the trigger-based workaround?
4. How does this workaround connect to the denormalization trade-off covered in the Database Design chapter?
5. How would you decide, for a specific slow, frequently run report, whether it's worth implementing this materialized-view workaround?

---

## 10. When would you choose to put logic in a stored procedure/trigger versus in application code?

### 📖 Introduction

This capstone question for the chapter combines every advantage, disadvantage, and architectural consideration covered so far into one practical, real-world decision framework.

### 🎯 Favor a Stored Procedure or Trigger When...

- **The logic needs a guarantee independent of any one application** — covered in this chapter's discussion of application architecture, like an audit trail that must capture every change regardless of which of several tools writes to the table.
- **Reducing network round-trips genuinely matters** — covered in this chapter's stored-procedure question, for a tightly coupled sequence of statements that always needs to execute together, atomically.
- **The logic is a data-integrity rule too complex for a CHECK constraint** — covered in the Constraints chapter, but still fundamentally about data correctness rather than business behavior.

### 🎯 Favor Application Code When...

- **The logic is specific business behavior for one application**, covered in this chapter's discussion of application architecture — better kept visible, testable, and version-controlled alongside the rest of that application's own code, tying back to the Repository/Service Layer pattern covered in the Node.js guide's Database Integration chapter.
- **The logic needs to call an external service or API** — a stored procedure or trigger, both covered throughout this chapter, can't reach outside the database itself.
- **Discoverability and team-wide visibility matter more than database-level guarantees** — covered in this chapter's disadvantages discussion, avoiding the "hidden logic" cost when a database-level guarantee genuinely isn't necessary.

### 🖼️ A Concrete Illustration

Enforcing that every deleted user's associated data is also cleaned up, regardless of which internal admin tool performed the deletion, might reasonably justify a trigger with `ON DELETE CASCADE`, covered in the Constraints chapter, or an explicit deletion trigger. Calculating a specific application's own loyalty-points formula, likely to change as business requirements evolve, belongs in that application's own code instead.

### 💎 Good to Know: This Capstone Framework Is Every Trade-off From This Chapter, Organized Into One Practical Decision Process

This capstone question doesn't introduce anything new — it takes the advantages, disadvantages, and architectural considerations covered throughout this chapter and organizes them into the actual decision-making process a developer walks through when deciding where a specific piece of logic genuinely belongs.

### ❓ Follow-up Interview Questions

1. Why does needing a guarantee independent of any one application specifically favor a database-level solution?
2. Why does logic needing to call an external API rule out a stored procedure or trigger entirely?
3. In the loyalty-points example, why does that logic belong in application code rather than a stored procedure?
4. How does this framework's guidance connect to the Repository/Service Layer pattern covered in the Node.js guide's Database Integration chapter?
5. Walking through this framework, how would you decide where enforcing a maximum order quantity per customer per day belongs?

---