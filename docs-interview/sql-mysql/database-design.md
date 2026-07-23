---
title: Database Design
description: Normalization, schema design, and modeling real-world data.
sidebar_position: 2
---

# Database Design

## 1. What is normalization, and why is it important?

### 📖 Introduction

Normalization is the discipline that keeps a relational database's tables genuinely relational, rather than degrading into a single, sprawling spreadsheet — a foundational design skill this entire chapter builds on.

### 📐 What Normalization Is

Normalization is the process of organizing a database's tables and columns to minimize data redundancy and avoid certain data-integrity problems — splitting data into multiple related tables, connected through keys, covered in the Keys & Relationships chapter later in this guide, rather than repeating the same information across many rows.

### 🎯 Why It Matters

Without normalization, the same piece of information — a customer's address, a product's price — might be duplicated across many rows, meaning an update has to correctly find and change every single duplicate, or risk the data becoming inconsistent, with different rows disagreeing about what should be the same fact.

### 🖼️ A Concrete Illustration

Storing a customer's name and email directly inside every single order row, rather than in a separate `customers` table referenced by a foreign key, means updating that customer's email requires updating every single one of their past orders — normalization instead stores the customer's details once, in one place, referenced from every order.

### 📊 A Formalized Process: Normal Forms

Normalization is typically described as a series of progressively stricter rules, called normal forms, covered in more depth in the next question, each addressing a specific category of redundancy or anomaly.

### 💎 Good to Know: Normalization Is About Correctness First, Performance Second

The primary motivation for normalization is data integrity and avoiding update anomalies, not performance — normalized data is often, but not always, also efficient to query, and the trade-off between the two is covered in more depth later in this chapter.

### ❓ Follow-up Interview Questions

1. Why does duplicating a customer's details across every order row risk data inconsistency?
2. What is an "update anomaly," and how does normalization address it?
3. Why is normalization primarily motivated by data integrity rather than performance?
4. What would a completely unnormalized database, storing everything in one giant table, actually look like?
5. How does normalization relate to the keys and relationships covered later in this guide?

---

## 2. What are the first three normal forms (1NF, 2NF, 3NF)?

### 📖 Introduction

The normal forms are cumulative and progressive — each one builds on, and requires, the previous one already being satisfied, addressing a specific, distinct category of redundancy.

### 1️⃣ First Normal Form (1NF)

Requires that every column hold a single, atomic value — no repeating groups or comma-separated lists stuffed into one column — and that each row be uniquely identifiable, typically through a primary key, covered in the Keys & Relationships chapter later in this guide. A `phone_numbers` column storing `"555-1234, 555-5678"` as one string violates 1NF; it should instead be split into a separate table with one phone number per row.

### 2️⃣ Second Normal Form (2NF)

Requires 1NF already being satisfied, plus every non-key column depending on the entire primary key, not just part of it — relevant specifically when a table has a composite primary key, covered in the Keys & Relationships chapter. If a table keyed on `(order_id, product_id)` also stores `product_name`, which only actually depends on `product_id` alone, that's a 2NF violation — `product_name` belongs in a separate `products` table instead.

### 3️⃣ Third Normal Form (3NF)

Requires 2NF already being satisfied, plus no non-key column depending on another non-key column — only on the primary key directly. If an `orders` table stores both `customer_id` and `customer_email`, where `customer_email` really depends on `customer_id` rather than directly on the order itself, that's a 3NF violation — `customer_email` belongs in the `customers` table instead.

### 💎 Good to Know: Each Normal Form Targets a Specific Kind of Dependency Problem

1NF eliminates repeating groups, 2NF eliminates partial dependencies on part of a composite key, and 3NF eliminates transitive dependencies between non-key columns — recognizing each one's specific, distinct target, rather than treating them as one vague, undifferentiated rule, is exactly what a strong answer demonstrates.

### ❓ Follow-up Interview Questions

1. Why does storing a comma-separated list of phone numbers in one column violate 1NF specifically?
2. Why is 2NF only relevant when a table has a composite primary key?
3. In the orders-and-customer-email example, why does that column belong in a separate `customers` table under 3NF?
4. What's the practical difference between a partial dependency (2NF) and a transitive dependency (3NF)?
5. Why must a table satisfy 2NF before it can meaningfully be evaluated for 3NF?

---

## 3. What is denormalization, and when would you deliberately use it?

### 📖 Introduction

Denormalization is normalization's deliberate, controlled reversal — reintroducing some redundancy on purpose, in exchange for a specific, genuine benefit.

### 🔄 What Denormalization Is

Denormalization intentionally introduces redundant data, or combines tables that would otherwise be separated under normalization, covered earlier in this chapter, typically to improve read performance by reducing the number of joins, covered in the Joins chapter later in this guide, a query needs to perform.

### 🎯 When It's Worth the Trade-off

Read-heavy workloads where a specific, frequently run query's join cost has become a genuine, measured performance bottleneck, covered in more depth in the Query Performance & Optimization chapter later in this guide, and where the data being duplicated changes infrequently enough that the risk of inconsistency, covered earlier in this chapter, is manageable.

### 🖼️ A Concrete Illustration

Storing a denormalized `total_items` count directly on an `orders` row, precomputed and updated whenever an order's items change, avoids recomputing that count by joining and counting an `order_items` table on every single read — a deliberate trade-off, accepting a small amount of redundancy and update complexity in exchange for meaningfully faster reads.

### ⚠️ The Genuine Cost

Denormalized data needs to be kept in sync — updated consistently everywhere it's duplicated — reintroducing exactly the update-anomaly risk that normalization, covered earlier in this chapter, exists specifically to prevent, unless done carefully and deliberately.

### 💎 Good to Know: Denormalization Is a Deliberate Trade-off, Not a Sign of Poor Design

Recognizing denormalization as a conscious, measured performance optimization applied to specific, identified bottlenecks — not a shortcut taken out of laziness or a failure to properly normalize in the first place — is the key framing this question is testing for.

### ❓ Follow-up Interview Questions

1. Why does denormalization typically improve read performance specifically?
2. What risk does denormalization reintroduce that normalization was originally designed to prevent?
3. In the `total_items` example, what has to happen whenever an order's items actually change?
4. Why should denormalization be applied to specific, measured bottlenecks rather than broadly and preemptively?
5. How would you decide whether a specific table is a good candidate for denormalization?

---

## 4. What is an Entity-Relationship (ER) diagram, and how is it used in database design?

### 📖 Introduction

Before a single `CREATE TABLE` statement is written, a database's design is usually worked out visually — an ER diagram is the standard tool for doing exactly that.

### 🗺️ What an ER Diagram Is

A visual representation of a database's entities (things that will become tables, like `customers` or `orders`), their attributes (which will become columns), and the relationships between them (which will become foreign keys, covered in the Keys & Relationships chapter later in this guide) — typically drawn before any actual SQL is written.

### 🔗 What It Actually Shows

Entities are usually drawn as boxes, attributes as a list within or beside each box, and relationships as connecting lines, often annotated with cardinality — one-to-one, one-to-many, or many-to-many, all covered in full in the Keys & Relationships chapter — describing exactly how two entities relate to each other.

### 🎯 Why It's Used Before Writing Actual SQL

An ER diagram lets a team reason about, and agree on, a database's overall structure and relationships visually, catching design problems — a missing relationship, an entity that should really be split into two — before they're expensive to fix in an already-built, populated database.

### 🖼️ A Concrete Illustration

An ER diagram for a blog application might show `users` and `posts` as two boxes, connected by a one-to-many relationship line, indicating one user can have many posts — directly informing that `posts` will need a `user_id` foreign key column once translated into actual SQL.

### 💎 Good to Know: An ER Diagram Is a Planning Tool, Translated Into SQL Afterward

The genuinely important point is that an ER diagram is a design-phase artifact — it precedes and directly informs the actual SQL schema, covered throughout this chapter, rather than being generated from an already-existing database as pure documentation.

### ❓ Follow-up Interview Questions

1. Why is it valuable to design a database visually before writing any actual SQL?
2. What does cardinality on a relationship line in an ER diagram actually communicate?
3. In the blog example, how does the one-to-many relationship directly translate into an actual schema decision?
4. What kind of design mistake might an ER diagram help catch before a database is actually built?
5. Could an ER diagram be created after a database already exists? What purpose would that serve, versus creating one beforehand?

---

## 5. What is the difference between a logical schema and a physical schema?

### 📖 Introduction

Database design happens in two genuinely distinct stages — deciding what the data conceptually looks like, and then deciding exactly how that gets implemented in a specific database system.

### 🧠 Logical Schema

Describes a database's structure at a conceptual level — entities, attributes, and relationships, covered in the previous question's discussion of ER diagrams — independent of any specific database product's own particular syntax or storage details.

### ⚙️ Physical Schema

The actual, concrete implementation of that logical design in a specific database system — the literal `CREATE TABLE` statements, specific MySQL data types, indexes, covered in the Indexing chapter later in this guide, and storage engine choices, covered in the Introduction & Fundamentals chapter's discussion of InnoDB versus MyISAM.

### 🔀 Why This Distinction Matters

The same logical schema — the same entities and relationships — could be implemented as slightly different physical schemas across MySQL, PostgreSQL, or another database system, tying back to the SQL-as-standard-versus-MySQL-as-implementation distinction covered in the Introduction & Fundamentals chapter. The logical design stays conceptually stable; the physical implementation adapts to whatever specific system is actually being used.

### 🖼️ A Concrete Illustration

A logical schema might simply say "a user has a name and a signup date." The physical schema translates that into MySQL-specific decisions — `VARCHAR(255)` for the name, `DATETIME` for the signup date, which columns get indexed — decisions genuinely specific to MySQL as the implementation.

### 💎 Good to Know: Logical Design Answers "What," Physical Design Answers "How, Specifically, in This System"

Keeping this distinction clear — logical schema as the conceptual "what," physical schema as the concrete "how, in this specific database system" — is a genuinely useful mental model for approaching schema design methodically, rather than jumping straight to writing `CREATE TABLE` statements.

### ❓ Follow-up Interview Questions

1. Why can the same logical schema result in slightly different physical schemas across different database systems?
2. What kind of decision belongs to physical schema design that wouldn't appear in a logical schema at all?
3. How does this distinction relate to the SQL-standard-versus-MySQL-implementation distinction covered in the Introduction & Fundamentals chapter?
4. Why might it be useful to finalize a logical schema before making any physical schema decisions?
5. What would it look like to migrate an existing physical schema from MySQL to PostgreSQL, in terms of what would and wouldn't need to change?

---

## 6. How do you decide what should be its own table versus a column in an existing table?

### 📖 Introduction

This is one of the most common, genuinely practical decisions in real-world schema design — and it comes down to a handful of concrete signals rather than a single hard-and-fast rule.

### 🔁 Signal 1: Does the Value Repeat Across Many Rows?

If the same value would need to be duplicated across many rows of another table — a customer's address appearing on every one of their orders — that's a strong signal it belongs in its own table, referenced through a foreign key, covered in the Keys & Relationships chapter later in this guide, exactly the normalization principle covered earlier in this chapter.

### 🔢 Signal 2: Does It Represent Multiple Values Per Row?

If a single row would otherwise need to store multiple values for the same concept — several phone numbers for one customer — that's a 1NF violation, covered earlier in this chapter, and a strong signal those values belong in their own related table instead.

### 🎯 Signal 3: Does It Have Its Own Independent Identity and Attributes?

If a concept has enough of its own attributes and its own independent lifecycle — a `product` genuinely exists independently of any specific order that references it — it belongs as its own entity and table, rather than being flattened into columns on whatever table references it.

### 🖼️ A Concrete Illustration

A `shipping_address` that's identical across many of a customer's orders belongs in its own `addresses` table, referenced by a foreign key — but a single, order-specific `notes` field that only ever applies to that one particular order, with no independent identity of its own, reasonably stays as a column directly on the `orders` table.

### 💎 Good to Know: This Decision Is Really Just Normalization's Principles, Applied Practically, One Table at a Time

None of these three signals are new ideas — they're the exact same normalization principles covered earlier in this chapter, applied as a concrete, practical checklist for the recurring real-world question of where a specific piece of data actually belongs.

### ❓ Follow-up Interview Questions

1. Why does a value repeating across many rows suggest it belongs in its own table?
2. Why does a column needing to hold multiple values for one row indicate a 1NF violation?
3. In the shipping-address-versus-notes example, what specifically makes one belong in its own table and the other not?
4. Why is having "independent identity and attributes" a meaningful signal for whether something should be its own entity?
5. How does this checklist relate to the normalization principles already covered earlier in this chapter?

---

## 7. What are the trade-offs between normalization and query performance?

### 📖 Introduction

Normalization and raw read performance genuinely pull in different directions — understanding exactly why is what makes the denormalization trade-off, covered earlier in this chapter, actually make sense.

### 📐 The Normalization Side

A fully normalized schema, covered earlier in this chapter, minimizes redundancy and keeps data consistent by splitting related information across multiple tables — but retrieving a complete, assembled picture of that data then requires joining, covered in full in the Joins chapter later in this guide, several of those tables back together at query time.

### ⚡ The Performance Side

Every join adds computational cost, covered in more depth in the Query Performance & Optimization chapter later in this guide — a query joining five normalized tables together is inherently more work for the database than reading from one single, wider, denormalized table already containing all the same information directly.

### ⚖️ Why Both Sides Are Legitimate Concerns

Normalization optimizes for write consistency and minimal redundancy; denormalization, covered earlier in this chapter, optimizes for read speed by trading away some of that consistency and redundancy. Neither is universally correct — the right balance depends on a specific application's actual read-versus-write patterns.

### 🖼️ A Concrete Illustration

An analytics dashboard querying millions of rows for aggregate reporting might deliberately denormalize certain data to avoid repeatedly joining large tables on every single request, while the core transactional tables backing the actual application logic stay fully normalized, since consistency there matters more than raw read speed.

### 💎 Good to Know: This Trade-off Is Exactly Why Real Systems Often Mix Both Approaches

Recognizing that a single application can, and often should, apply different levels of normalization to different parts of its schema — fully normalized transactional tables alongside deliberately denormalized reporting tables — is a genuinely senior-level way to frame this trade-off.

### ❓ Follow-up Interview Questions

1. Why does a fully normalized schema require more joins to assemble a complete picture of related data?
2. Why might an analytics or reporting workload specifically favor some denormalization?
3. Why should core transactional tables generally stay more normalized than reporting tables?
4. How does this trade-off directly connect to the denormalization coverage earlier in this chapter?
5. How would you decide, for a specific application, how much normalization is actually appropriate?

---

## 8. How would you design a database schema for a real-world application, like an e-commerce system?

### 📖 Introduction

This capstone-style question is where every concept covered so far in this chapter — normalization, ER diagrams, the table-versus-column decision — gets applied together to one concrete, realistic scenario.

### 🧩 Step 1: Identify the Core Entities

Following the ER-diagram process covered earlier in this chapter: `customers`, `products`, `orders`, and `order_items` emerge as the core entities — each with enough independent identity and attributes, covered earlier in this chapter, to warrant its own table.

### 🔗 Step 2: Determine the Relationships Between Them

A customer places many orders (one-to-many); an order contains many products, and a product can appear in many orders (many-to-many, requiring a junction table, covered in full in the Keys & Relationships chapter later in this guide) — which is exactly why `order_items` exists as a separate table, resolving that many-to-many relationship between `orders` and `products`.

### 📐 Step 3: Apply Normalization

Following the table-versus-column signals covered earlier in this chapter: a customer's shipping address, if reused across multiple orders, gets its own `addresses` table; a product's price at the time of purchase gets stored directly on `order_items` (since it needs to reflect the price when that specific order was placed, not the product's current, possibly-since-changed price).

### 🔑 Step 4: Define Keys and Constraints

Each table gets a primary key, covered in the Keys & Relationships chapter, and foreign keys connect `orders` to `customers`, and `order_items` to both `orders` and `products`, with constraints, covered in the Constraints chapter, like `NOT NULL` on required fields and a `CHECK` ensuring quantity is positive.

### 💎 Good to Know: Real Schema Design Is Every Principle From This Chapter, Applied in Sequence

The genuine skill this capstone question tests isn't any single new concept — it's methodically walking through entity identification, relationship modeling, normalization, and constraint definition, in that order, exactly the sequence covered across this entire chapter.

### ❓ Follow-up Interview Questions

1. Why does the many-to-many relationship between orders and products specifically require a junction table like `order_items`?
2. Why should a product's price be stored on the `order_items` row itself, rather than always looked up fresh from the `products` table?
3. What would happen to historical order data if product prices were never captured at the time of purchase?
4. Why does a shipping address reused across multiple orders belong in its own table rather than duplicated on each order?
5. If asked to design this schema from scratch in an interview, what's the right order to walk through these design steps?

---

## 9. What is data redundancy, and how does normalization address it?

### 📖 Introduction

Data redundancy is the specific, concrete problem normalization, covered throughout this chapter, exists to solve — worth naming precisely rather than treating as a vague, general concern.

### 🔁 What Data Redundancy Is

Data redundancy is the same piece of information being stored in more than one place within a database — a customer's email appearing on every one of their order rows, rather than once in a `customers` table.

### ⚠️ Why Redundancy Is a Genuine Problem, Not Just Wasted Space

Beyond the extra storage space it consumes, redundancy creates a real risk of inconsistency — if that customer's email needs to change, every single duplicated copy has to be updated correctly, and missing even one leaves the database internally disagreeing about what the customer's actual, current email is.

### 🛠️ How Normalization Directly Addresses It

By splitting data into properly related tables, covered throughout this chapter, and referencing shared information through foreign keys, covered in the Keys & Relationships chapter later in this guide, rather than duplicating it, each fact is stored exactly once — updating a customer's email means updating exactly one row, in exactly one place.

### 🖼️ A Concrete Illustration

Before normalization: a `customer_email` column duplicated across a hundred order rows for the same customer. After normalization: `orders` stores only a `customer_id`, and the email lives once, in the `customers` table, referenced by every order that needs it, but never duplicated.

### 💎 Good to Know: Redundancy's Real Cost Is Inconsistency Risk, Not Just Storage Space

The genuinely important framing is that redundancy's most serious cost isn't the wasted disk space — it's the real risk of a database's data becoming internally inconsistent, which is precisely the problem normalization is designed to eliminate at its root.

### ❓ Follow-up Interview Questions

1. Why is inconsistency risk a more serious concern than wasted storage space when it comes to redundancy?
2. In the customer-email example, what could go wrong if only 99 of 100 duplicated rows got updated correctly?
3. How does storing a foreign key reference, rather than duplicating the actual data, directly eliminate this specific risk?
4. Why is data redundancy described as the specific problem normalization exists to solve, rather than a vague, general concern?
5. Could a database have zero redundancy and still be poorly designed? What would that look like?

---

## 10. What are common mistakes made during database schema design?

### 📖 Introduction

Beyond the individual principles already covered throughout this chapter, it's worth naming the specific, recurring mistakes that actually show up in real-world schema design.

### ⚠️ Common Mistakes

- **Under-normalizing** — duplicating data that should live in its own table, covered earlier in this chapter, leading directly to the update-anomaly risk covered in this chapter's discussion of redundancy.
- **Over-normalizing without a genuine reason** — splitting data into so many small tables that even simple, common queries require excessive joins, covered in the Joins chapter later in this guide, without any actual, measured performance or integrity benefit justifying it.
- **Missing or incorrect keys and constraints** — failing to define proper primary and foreign keys, covered in the Keys & Relationships chapter, or appropriate constraints, covered in the Constraints chapter, leaving the database itself unable to enforce data integrity that then has to be manually, unreliably maintained by application code instead.
- **Using the wrong data type for a column** — storing a date as a plain string instead of a proper `DATE` or `DATETIME` type, losing the ability to reliably sort, filter, or validate it at the database level.
- **Not planning for how the schema will actually be queried** — designing purely around how data is conceptually structured, covered in this chapter's discussion of ER diagrams, without considering the specific access patterns the application will genuinely need, only discovering painful joins or missing indexes, covered in the Indexing chapter later in this guide, after the fact.

### 💎 Good to Know: Nearly Every Mistake Here Is a Failure to Apply a Principle Already Covered in This Chapter

Recognizing each specific real-world symptom and mapping it back to the underlying principle it violates — insufficient normalization, unnecessary over-normalization, missing integrity enforcement, ignoring query patterns — is exactly the practical, diagnostic skill this question is testing for.

### ❓ Follow-up Interview Questions

1. Why does under-normalizing create the same update-anomaly risk covered earlier in this chapter?
2. Why might over-normalizing without a genuine reason actually hurt a schema rather than help it?
3. Why does relying on application code alone to enforce data integrity, instead of proper keys and constraints, become unreliable at scale?
4. What real problems arise from storing a date as a plain string instead of a proper date type?
5. Why does ignoring an application's actual query patterns during schema design tend to surface as a problem only later?

---