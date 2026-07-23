---
title: Constraints
description: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, and CHECK.
sidebar_position: 9
---

# Constraints

## 1. What is a constraint in SQL, and why are constraints important for data integrity?

### 📖 Introduction

Application-level validation, common in any backend codebase, can always be bypassed by a direct database connection or a bug in that same application code — constraints exist specifically as the database's own, independent enforcement layer.

### 🛡️ What a Constraint Is

A constraint is a rule enforced directly by the database itself on a table's data — rejecting any `INSERT` or `UPDATE`, both covered in the SQL Queries (CRUD) chapter, that would violate it, regardless of what application code attempted the operation.

### 🎯 Why Constraints Matter, Specifically Because of Where They Live

Since a constraint is enforced by the database itself, it protects data integrity even against a buggy application, a direct manual query, or a completely different application entirely connecting to the same database — application-level validation alone offers no such guarantee, since it only protects data that actually passes through that specific application's own code path.

### 🖼️ A Concrete Illustration

An application's own signup form might validate that an email is properly formatted before ever sending an `INSERT`, but a `NOT NULL` constraint, covered later in this chapter, on the `email` column itself guarantees that no row can ever be stored without one — even if a completely different script, written by someone else entirely, inserts data directly, bypassing the original application's validation logic entirely.

### 💎 Good to Know: Constraints Are the Database's Own Last Line of Defense, Independent of Any Specific Application

The genuinely important framing is that constraints don't replace application-level validation — they're a complementary, independent safety net that holds regardless of which application, script, or person is actually writing to the database.

### ❓ Follow-up Interview Questions

1. Why can't application-level validation alone guarantee data integrity across an entire database?
2. In the email example, what specifically would a `NOT NULL` constraint catch that the signup form's own validation might miss?
3. Why are constraints described as a "last line of defense" rather than a replacement for application validation?
4. What would happen if two completely different applications wrote to the same database, and only one of them validated its input?
5. How does this chapter's coverage relate to the validation-versus-database-integrity distinction covered in the Node.js guide's Database Integration chapter?

---

## 2. What is a PRIMARY KEY constraint, and what properties must it satisfy?

### 📖 Introduction

Nearly every table in this guide's examples has had an `id` column — a primary key is precisely what makes that column meaningful as a unique identifier, enforced as a constraint.

### 🔑 What a PRIMARY KEY Constraint Enforces

A `PRIMARY KEY` constraint designates one column (or combination of columns) as the table's unique row identifier, enforcing two properties simultaneously: every value in that column must be unique across the entire table, and no value in that column can ever be `NULL`.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255)
);
```

Attempting to insert a row with an `id` that already exists, or attempting to insert a row with `id` left as `NULL`, both fail immediately — the constraint rejects either violation before the row is ever stored.

### 🎯 Why the Uniqueness-Plus-Not-Null Combination Matters

A primary key's entire purpose is unambiguously identifying one specific row — if duplicate values were allowed, or if `NULL` were allowed, a given value could no longer reliably point to exactly one row, undermining foreign keys, covered in the next question, that reference it from other tables.

### 💎 Good to Know: Every Table Should Have Exactly One Primary Key

A table can only have one `PRIMARY KEY` constraint (though that key can span multiple columns as a composite key, covered in more depth in the Keys & Relationships chapter later in this guide), and nearly every table genuinely should have one — it's the foundation that foreign key relationships, and reliable row identification generally, are built on.

### ❓ Follow-up Interview Questions

1. Why does a primary key need to enforce both uniqueness and non-null simultaneously?
2. What would go wrong if a primary key column allowed duplicate values?
3. Why does a primary key's reliability matter specifically for foreign keys referencing it, covered in the next question?
4. Can a table have more than one PRIMARY KEY constraint? Why or why not?
5. What would you check first if an INSERT unexpectedly failed with a primary key violation error?

---

## 3. What is a FOREIGN KEY constraint, and what does it enforce?

### 📖 Introduction

A foreign key is the specific enforcement mechanism that makes a relationship between two tables, covered throughout the Joins chapter, actually reliable — rather than merely an informal convention two tables happen to follow.

### 🔗 What a FOREIGN KEY Constraint Enforces

A `FOREIGN KEY` constraint on one table's column requires every value in that column to match an existing value in another table's referenced column — typically that other table's primary key, covered in the previous question. It enforces referential integrity: a reference can never point at something that doesn't actually exist.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

Attempting to insert an order with a `customer_id` that doesn't exist in the `customers` table fails immediately — the database itself refuses to store a reference to a nonexistent customer, without any application code needing to check this manually first.

### 🎯 What Happens on the Referenced Side

A foreign key also affects what can happen to the referenced row — attempting to delete a customer who still has existing orders referencing them, by default, fails too, unless a specific referential action, covered in more depth later in this chapter, has been configured to handle that scenario differently.

### 💎 Good to Know: A Foreign Key Enforces the Relationship in Both Directions, Not Just on Insert

The genuinely important detail is that a foreign key doesn't just validate data going in — it also protects against orphaning existing data by restricting deletions or updates to the referenced side, covered in much more depth later in this chapter's discussion of `ON DELETE`/`ON UPDATE` actions.

### ❓ Follow-up Interview Questions

1. Why does a foreign key constraint reject an order referencing a nonexistent customer?
2. What does "referential integrity" mean, concretely, in the context of a foreign key?
3. Why might deleting a customer who still has existing orders fail by default under a foreign key constraint?
4. How does a foreign key constraint relate to the JOIN operations covered throughout the Joins chapter?
5. What would a database look like if foreign keys were never enforced at all, despite the schema conceptually having these relationships?

---

## 4. What is a UNIQUE constraint, and how does it differ from a PRIMARY KEY?

### 📖 Introduction

Both `UNIQUE` and `PRIMARY KEY`, covered earlier in this chapter, prevent duplicate values in a column — but they differ in two genuinely important ways worth being precise about.

### 🔒 What a UNIQUE Constraint Enforces

A `UNIQUE` constraint requires every value in a column (or combination of columns) to be distinct across the table — no two rows can share the same value — but, unlike a primary key, `NULL` is still allowed, and typically multiple `NULL`s are permitted, since `NULL` isn't considered equal to any other value at all, tying back to the NULL comparison behavior covered in the Filtering, Sorting & Grouping chapter.

### 🔑 The Two Key Differences From PRIMARY KEY

A table can only have one `PRIMARY KEY`, covered earlier in this chapter, but can have several different `UNIQUE` constraints on several different columns. And a `PRIMARY KEY` column can never be `NULL`, while a `UNIQUE` column can be, as long as it isn't duplicated.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE
);
```

`id` uniquely identifies the row itself, while `email` needs to be unique across all customers, but isn't necessarily what every other table would use to actually reference a specific customer.

### 💎 Good to Know: PRIMARY KEY Identifies the Row; UNIQUE Just Prevents Duplicate Values in a Column

The clean distinction worth internalizing: a `PRIMARY KEY` is about identity — this is how the row itself is referenced — while a `UNIQUE` constraint is purely about preventing duplicate values in some other, secondary column that doesn't necessarily serve as the row's identifier.

### ❓ Follow-up Interview Questions

1. Why can a `UNIQUE` column allow multiple `NULL` values while a `PRIMARY KEY` column can't allow any?
2. Why can a table have several `UNIQUE` constraints but only one `PRIMARY KEY`?
3. In the customers example, why might `email` be a good candidate for `UNIQUE` rather than being the primary key itself?
4. Why does NULL not being considered equal to another NULL matter specifically for how UNIQUE behaves?
5. When would a column genuinely need both PRIMARY KEY-like uniqueness and the ability to be NULL? How would you actually model that?

---

## 5. What is a NOT NULL constraint, and why would you enforce it on a column?

### 📖 Introduction

Every column is nullable by default unless explicitly told otherwise — `NOT NULL` is the constraint that closes off that default and requires a genuine value.

### 🚫 What NOT NULL Enforces

A `NOT NULL` constraint requires every row to have an actual, non-`NULL` value in that column — any `INSERT` or `UPDATE`, both covered in the SQL Queries (CRUD) chapter, attempting to leave it as `NULL` fails outright.

### 🎯 Why You'd Enforce It

Any column that's genuinely required for a row to make sense at all — a customer's `email`, an order's `total` — should be `NOT NULL`, guaranteeing the database itself never stores an incomplete, meaningless row, rather than relying on every single piece of application code that writes to this table to remember to check this manually.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL
);
```

Attempting `INSERT INTO customers (id) VALUES (1)`, omitting `email` entirely, tying back to the SQL Queries (CRUD) chapter's discussion of what happens to columns not explicitly provided in an INSERT, fails immediately, since `email` has no default and can't be `NULL`.

### 💎 Good to Know: NOT NULL Should Be the Default Assumption, With Nullable Columns as the Deliberate Exception

A genuinely good schema-design habit is starting from `NOT NULL` as the default for any column expected to always have a value, and only explicitly allowing `NULL` for columns that are genuinely, deliberately optional — rather than the other way around.

### ❓ Follow-up Interview Questions

1. Why does a column default to allowing `NULL` unless a `NOT NULL` constraint is explicitly added?
2. In the concrete example, why does the INSERT statement fail rather than simply inserting `NULL` for `email`?
3. Why is relying on application code alone to prevent `NULL` values in a required column less reliable than a database-level constraint?
4. Why might it be a better habit to default to `NOT NULL` and treat nullable columns as the deliberate exception?
5. What kind of column would genuinely need to allow `NULL`, and why?

---

## 6. What is a CHECK constraint, and what kind of business rules can it enforce?

### 📖 Introduction

`NOT NULL` and `UNIQUE`, both covered earlier in this chapter, enforce fairly generic rules — a `CHECK` constraint goes further, letting a table enforce a genuinely custom, business-specific condition.

### ✅ What a CHECK Constraint Enforces

A `CHECK` constraint requires every row to satisfy a specified boolean expression — any `INSERT` or `UPDATE` that would violate it fails, exactly like any other constraint covered in this chapter, but the actual condition being checked can be any expression referencing that row's own column values.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  quantity INT CHECK (quantity > 0),
  unit_price DECIMAL(10,2) CHECK (unit_price >= 0)
);
```

Guarantees `quantity` is always a positive number and `unit_price` is never negative — business rules genuinely specific to this application's domain, not generic structural rules like `NOT NULL` or `UNIQUE`.

### 🎯 CHECK Constraints Spanning Multiple Columns

A `CHECK` constraint can reference more than one column in the same row at once — `CHECK (discount_price <= regular_price)` enforces a relationship between two columns directly at the database level.

### 💎 Good to Know: CHECK Constraints Encode Business Rules Directly Into the Schema Itself

The genuinely important framing is that `CHECK` constraints let domain-specific business logic — not just generic structural rules — be enforced directly by the database, tying back to this chapter's opening question about constraints as an independent layer of protection beyond application-level validation.

### ❓ Follow-up Interview Questions

1. Why is a CHECK constraint described as more flexible than NOT NULL or UNIQUE?
2. In the order_items example, what specifically would happen if an INSERT attempted a negative `quantity`?
3. Why might a CHECK constraint reference more than one column in the same row?
4. How does a CHECK constraint relate to this chapter's opening point about constraints being an independent enforcement layer?
5. What's a genuine business rule from a real-world application that would be a good candidate for a CHECK constraint?

---

## 7. What is a DEFAULT constraint?

### 📖 Introduction

Tying back to the SQL Queries (CRUD) chapter's discussion of what happens to a column omitted from an `INSERT` — `DEFAULT` is exactly what determines that fallback value.

### 🔧 What DEFAULT Does

A `DEFAULT` constraint specifies the value a column should take automatically if an `INSERT`, covered in the SQL Queries (CRUD) chapter, doesn't explicitly provide one — rather than falling back to `NULL`, or failing outright if the column is also `NOT NULL`, covered earlier in this chapter, with no default defined.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

An `INSERT` that doesn't mention `status` or `created_at` at all automatically gets `'pending'` and the current timestamp, respectively, rather than needing every single `INSERT` statement across the entire codebase to explicitly repeat these same common values.

### 🎯 Why This Matters in Practice

Defining sensible defaults directly on the table means every piece of code inserting into it automatically gets consistent, correct fallback behavior — rather than relying on every single application, or every single developer, to remember to explicitly set the same common value every time.

### 💎 Good to Know: DEFAULT and NOT NULL Work Together to Avoid Ever Needing a Fallback Value at Query Time

The genuinely useful combination worth remembering is `NOT NULL DEFAULT ...` together — guaranteeing a column is always populated, either explicitly by whatever inserted the row, or automatically via the default, with no path that ever leaves it `NULL`.

### ❓ Follow-up Interview Questions

1. Why does a `DEFAULT` value only apply when a column is omitted from an `INSERT`, rather than always?
2. In the orders example, what would happen if an `INSERT` explicitly provided `NULL` for `status`, rather than omitting it?
3. Why is defining a default directly on the table more reliable than expecting every application to set the same value manually?
4. Why is combining `NOT NULL` with `DEFAULT` a genuinely useful pattern?
5. What's a column, beyond status and created_at, that would commonly benefit from a DEFAULT value?

---

## 8. What happens when you try to insert a row that violates a constraint?

### 📖 Introduction

Every constraint covered in this chapter shares the same fundamental enforcement behavior — worth stating explicitly, since understanding this is what makes constraints actually useful as a genuine safety mechanism.

### 🚫 The Statement Fails Immediately

Attempting an `INSERT` or `UPDATE`, both covered in the SQL Queries (CRUD) chapter, that would violate any constraint — `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL`, or `CHECK`, all covered throughout this chapter — causes the database to reject that statement entirely, returning an error rather than silently ignoring the problem or partially applying the change.

### 🔢 What Happens With a Multi-Row INSERT

Tying back to the SQL Queries (CRUD) chapter's discussion of inserting multiple rows in one statement — if even a single row within a multi-row `INSERT` violates a constraint, the entire statement fails, and none of the rows from that statement are inserted, not just the offending one.

### 🔄 How Transactions Interact With This

Within an open transaction, covered in full in the Transactions chapter later in this guide, a constraint violation causes that specific statement to fail, but the surrounding transaction itself isn't automatically rolled back unless the application explicitly handles the error and issues a `ROLLBACK` — worth knowing precisely, since assuming otherwise can lead to a transaction left in an unexpected, inconsistent state.

### 🖼️ A Concrete Illustration

```sql
INSERT INTO customers (id, email) VALUES (1, 'existing@example.com');
-- Fails with a duplicate-key error if id 1 or that email already exists
```

The application receives an error response and must handle it explicitly — the database never silently drops or ignores the conflicting row.

### 💎 Good to Know: A Constraint Violation Is an Explicit, Catchable Error — Never a Silent Failure

The single most important detail tying this chapter together: every constraint, regardless of type, fails loudly and explicitly rather than silently — application code needs to genuinely handle this error case, rather than assuming an `INSERT` or `UPDATE` always succeeds.

### ❓ Follow-up Interview Questions

1. Why does the database reject an entire statement rather than partially applying it when a constraint is violated?
2. In a multi-row INSERT, why does one row's constraint violation cause every row in that same statement to fail?
3. Why doesn't a constraint violation automatically roll back an entire surrounding transaction on its own?
4. Why is it important that application code explicitly handle a constraint violation error, rather than assuming success?
5. How would you test that a specific constraint is actually being enforced correctly on a table?

---

## 9. What are the ON DELETE and ON UPDATE referential actions (CASCADE, SET NULL, RESTRICT) for foreign keys?

### 📖 Introduction

A foreign key, covered earlier in this chapter, by default simply blocks a deletion or update that would leave a reference dangling — `ON DELETE` and `ON UPDATE` let a table instead specify exactly what should happen automatically in that scenario.

### 🚫 RESTRICT (the Default Behavior)

Blocks the deletion or update of a referenced row entirely if any other row still references it — exactly the default foreign key behavior covered earlier in this chapter, made explicit and named.

### 🔗 CASCADE

Automatically applies the same deletion or update to every referencing row too — `ON DELETE CASCADE` on `orders.customer_id` means deleting a customer automatically deletes every one of their orders as well, rather than blocking the deletion.

### ⭕ SET NULL

Automatically sets the referencing column to `NULL` instead of deleting or blocking anything — requires that referencing column to actually allow `NULL`, meaning it can't also have a `NOT NULL` constraint, covered earlier in this chapter, at the same time.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
```

Deleting a customer automatically, immediately deletes every one of their associated orders too, rather than the deletion being blocked, or the orders being left with a now-invalid `customer_id`.

### 🎯 How to Decide Between Them

`RESTRICT` fits when a referenced row genuinely shouldn't be deletable while dependents exist, forcing a deliberate decision about those dependents first. `CASCADE` fits when dependent rows genuinely have no independent meaning once their parent is gone — an order's line items, for instance. `SET NULL` fits when the reference is genuinely optional and losing it shouldn't destroy the referencing row itself.

### 💎 Good to Know: This Choice Encodes a Genuine Business Decision About What "Deleting the Parent" Should Actually Mean

Recognizing that choosing between `RESTRICT`, `CASCADE`, and `SET NULL` isn't a technical formality but an actual business decision — what should happen to dependent data when its parent disappears — is exactly the kind of practical judgment this question is testing for.

### ❓ Follow-up Interview Questions

1. Why is `RESTRICT` the default behavior for a foreign key without any explicit `ON DELETE` action specified?
2. In the CASCADE example, why does deleting a customer also delete their orders rather than the deletion simply being blocked?
3. Why does `SET NULL` require the referencing column to allow `NULL` in the first place?
4. How would you decide between CASCADE and SET NULL for a specific real-world relationship?
5. What real-world scenario would make RESTRICT clearly the correct, deliberate choice over CASCADE?

---

## 10. How do database constraints relate to, but differ from, application-level validation?

### 📖 Introduction

This capstone question for the chapter ties every individual constraint type covered so far back to the opening question's framing — constraints as an independent, database-level enforcement layer, distinct from whatever an application does on its own.

### 🛡️ What Database Constraints Guarantee

Every constraint covered in this chapter — `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL`, `CHECK`, and the referential actions covered in the previous question — is enforced by the database itself, regardless of which application, script, or person is writing to it, exactly the independence covered in this chapter's opening question.

### 💻 What Application-Level Validation Adds

Application-level validation, covered in full from an Express-specific perspective in the Express.js guide's Validation & Sanitization chapter, can express richer, more contextual business rules — checking a value against an external API, applying complex conditional logic spanning multiple unrelated tables — that a database constraint alone typically can't express as cleanly.

### ⚖️ Why Both Genuinely Matter Together

Application-level validation gives a user immediate, friendly feedback before a request ever reaches the database — a good user experience — while database constraints guarantee that no invalid data can ever end up stored, regardless of whether some request, somehow, slipped past that application-level check.

### 🖼️ A Concrete Illustration

An application might validate that a submitted email looks properly formatted before ever sending an `INSERT`, giving the user immediate feedback — but the database's own `NOT NULL` and `UNIQUE` constraints, both covered earlier in this chapter, on that same `email` column guarantee data integrity regardless of whether that specific validation check was ever actually run.

### 💎 Good to Know: Defense-in-Depth Applies to Data Integrity Just as It Does to Security

The genuinely important synthesis, tying this chapter's entire theme together: application-level validation and database constraints are complementary defense-in-depth layers, exactly the same layered-defense principle covered in the Express.js guide's Security chapter, just applied here specifically to data integrity rather than security threats.

### ❓ Follow-up Interview Questions

1. Why can database constraints guarantee integrity even against a completely different, unrelated application writing to the same database?
2. What kind of validation rule is genuinely easier to express in application code than as a database constraint?
3. Why does application-level validation improve user experience in a way that a database constraint alone can't?
4. How does this defense-in-depth framing connect to the same principle covered in the Express.js guide's Security chapter?
5. If you found a database column with neither a constraint nor application-level validation protecting it, how would you decide which one — or both — to add?

---