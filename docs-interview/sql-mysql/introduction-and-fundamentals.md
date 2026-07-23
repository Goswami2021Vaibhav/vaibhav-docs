---
title: Introduction & Fundamentals
description: What relational databases are, and where SQL fits in.
sidebar_position: 1
---

# Introduction & Fundamentals

## 1. What is a relational database, and how does it differ from other database models?

### 📖 Introduction

Every question in this entire guide builds on one foundational idea — data organized into tables with strictly defined relationships between them — so it's worth starting with exactly what that means and why it's just one of several ways to model data.

### 🗂️ What a Relational Database Is

A relational database stores data in tables — structured grids of rows and columns, covered in more depth in the next question — with a fixed, predefined schema per table, and explicit relationships between tables enforced through keys, covered in more depth later in this guide. Data is queried and manipulated using SQL, a declarative query language purpose-built for exactly this model.

### 🆚 How It Differs From Other Database Models

A document database, like MongoDB, stores flexible, JSON-like documents without a rigid predefined schema, letting each document's shape vary. A key-value store, like Redis, is optimized for extremely fast lookups by a single key, with no query language for relationships at all. A graph database models data as nodes and edges, optimized specifically for traversing deeply interconnected relationships. A relational database's defining trait, by contrast, is its rigid schema and its first-class support for relationships between structured, tabular data.

### 🖼️ A Concrete Illustration

An e-commerce application's `orders`, `customers`, and `products` genuinely relate to each other — an order belongs to a customer and references specific products — and a relational database lets these relationships be explicitly modeled and enforced through foreign keys, covered in more depth later in this guide, rather than duplicating customer and product details inside every single order record.

### 💎 Good to Know: "Relational" Refers to the Relationships Between Tables, Not Just the Tables Themselves

A common point of confusion is assuming "relational" describes the tables themselves — it actually refers to the explicit, enforced relationships between separate tables, which is the genuinely distinguishing feature of this entire database model, covered in depth throughout the rest of this guide.

### ❓ Follow-up Interview Questions

1. Why does a relational database require a fixed, predefined schema per table, unlike a document database?
2. What does "relational" actually refer to in the term "relational database"?
3. Why is a graph database better suited to deeply interconnected data than a relational database?
4. What would happen to data consistency if an e-commerce application duplicated customer details inside every order instead of using a relational structure?
5. How would you decide whether a given application's data is genuinely a good fit for a relational model?

---

## 2. What is SQL, and what are its main sublanguages (DDL, DML, DQL, DCL, TCL)?

### 📖 Introduction

SQL isn't one undifferentiated block of syntax — it's organized into distinct sublanguages, each responsible for a genuinely different kind of operation against a database.

### 📜 What SQL Is

SQL (Structured Query Language) is the standard, declarative language used to define, query, and manipulate data in a relational database, covered in the previous question. "Declarative" means a query describes what result is wanted, not the step-by-step procedure for producing it — the database engine itself figures out how to actually execute it.

### 🗃️ DDL — Data Definition Language

Statements that define or modify a database's structure itself — `CREATE`, `ALTER`, `DROP` — affecting tables, schemas, and constraints rather than the data stored inside them.

### ✍️ DML — Data Manipulation Language

Statements that manipulate the actual data stored within tables — `INSERT`, `UPDATE`, `DELETE` — covered in full in the SQL Queries (CRUD) chapter later in this guide.

### 🔍 DQL — Data Query Language

Just `SELECT`, retrieving data without modifying it — sometimes grouped under DML in casual usage, but conceptually distinct since it never changes stored data.

### 🔐 DCL — Data Control Language

Statements that control access and permissions — `GRANT`, `REVOKE` — covered in full in the Security & Privileges chapter later in this guide.

### 🔄 TCL — Transaction Control Language

Statements that manage transactions — `COMMIT`, `ROLLBACK`, `SAVEPOINT` — covered in full in the Transactions chapter later in this guide.

### 💎 Good to Know: This Grouping Reveals SQL's Own Internal Structure, Not Just a Trivia List

Recognizing these five categories isn't just memorizing a classification — it reveals that SQL cleanly separates defining structure (DDL), manipulating data (DML), reading data (DQL), controlling access (DCL), and managing transactional consistency (TCL) as genuinely distinct concerns, each covered in its own dedicated chapter later in this guide.

### ❓ Follow-up Interview Questions

1. Why is SQL described as a declarative language rather than a procedural one?
2. Why is `SELECT` sometimes classified separately from other DML statements?
3. What category would a statement like `ALTER TABLE ... ADD COLUMN` fall under, and why?
4. Why does separating DCL from DML matter for database security specifically?
5. How does this five-way categorization map onto the chapters covered throughout the rest of this guide?

---

## 3. What is a table, a row, and a column in a relational database?

### 📖 Introduction

These three terms are the basic vocabulary every other concept in this guide builds on — worth being precise about before moving into anything more advanced.

### 🗂️ Table

A table is a named, structured collection of related data, organized into rows and columns — conceptually similar to a single sheet in a spreadsheet, but with a strictly enforced structure, covered in more depth in the Database Design chapter later in this guide.

### ➡️ Row

A row (also called a record or a tuple) represents one single, complete entry in a table — one specific customer, one specific order — with a value for each of the table's defined columns.

### ⬇️ Column

A column (also called a field or an attribute) represents one specific piece of information tracked for every row in the table — a `name` column, an `email` column — with a fixed data type applied consistently to every row's value in that column.

### 🖼️ A Concrete Illustration

A `customers` table might have columns `id`, `name`, and `email`; a single row like `(1, 'Alex Smith', 'alex@example.com')` represents one specific customer, with each value corresponding to one of the table's three defined columns.

### 💎 Good to Know: Every Row in a Table Shares the Exact Same Column Structure

The genuinely important structural detail is that every row in a given table shares the exact same set of columns and data types — this rigid consistency is precisely what distinguishes a relational table from a document database's more flexible, per-document structure, covered in the previous question's comparison.

### ❓ Follow-up Interview Questions

1. Why must every row in a table share the exact same column structure?
2. What's the difference between a column's name and its data type?
3. How does a table's rigid row structure compare to a document database's more flexible structure, covered in the previous question?
4. Why might one specific piece of information, like a middle name, be left as a nullable column rather than a required one?
5. How would you describe the relationship between a table, a row, and a column to someone completely new to databases?

---

## 4. What is a schema in the context of a database?

### 📖 Introduction

"Schema" is a genuinely overloaded term in database conversation — it can refer to the structure of a single table or to an entire database's organization, and being precise about which one is meant matters.

### 📐 Schema as Structure

At the table level, a schema is the definition of that table's structure — its columns, each column's data type, and any constraints, covered in more depth in the Constraints chapter later in this guide, applied to it. This structure is fixed and enforced by the database for every row in that table.

### 🗄️ Schema as a Namespace

At a broader level, a schema (sometimes called a database, depending on the specific database system's own terminology) is a named collection of related tables, views, and other database objects, grouped together — MySQL specifically treats "schema" and "database" as interchangeable terms.

### 🖼️ A Concrete Illustration

A `blog` schema might contain `users`, `posts`, and `comments` tables, each with its own column-level schema defining that specific table's structure — the word "schema" applies at both the level of the entire `blog` database and at the level of each individual table within it.

### 💎 Good to Know: MySQL Specifically Uses "Schema" and "Database" Interchangeably

Unlike some other database systems, where "schema" is a distinct namespace within a single database, MySQL treats the two terms as synonyms — `CREATE SCHEMA` and `CREATE DATABASE` in MySQL do the exact same thing, which is worth knowing explicitly to avoid confusion with other systems' terminology.

### ❓ Follow-up Interview Questions

1. Why does "schema" mean something different depending on whether you're discussing one table or an entire database?
2. Why does MySQL treat "schema" and "database" as interchangeable terms?
3. What's a concrete example of a constraint that would be part of a table's own schema?
4. How would you explain the difference between a table's schema and a database's overall schema to a beginner?
5. Why might this terminology cause confusion for someone coming from a database system where "schema" means something more specific?

---

## 5. What is the difference between a database and a database management system (DBMS)?

### 📖 Introduction

These two terms get used almost interchangeably in casual conversation, but they refer to genuinely different things — one is the data itself, the other is the software managing it.

### 🗄️ What a Database Is

A database is the actual, organized collection of data itself — the tables, rows, and columns, covered earlier in this chapter, that make up a specific application's stored information.

### ⚙️ What a DBMS Is

A Database Management System is the software that creates, manages, and provides access to one or more databases — handling storage, query execution, concurrency, security, and backups. MySQL itself is a DBMS; the actual data it stores and manages is the database.

### 🖼️ A Concrete Illustration

Saying "our MySQL database" is technically loose phrasing — MySQL is the DBMS, and the specific collection of tables and data it's managing for a given application is the actual database. In everyday conversation this distinction rarely matters, but it's worth being precise about in an interview setting.

### 🧩 Why the DBMS Layer Matters

The DBMS is responsible for translating a declarative SQL query, covered earlier in this chapter, into an actual, efficient execution plan — deciding whether to use an index, covered in the Indexing chapter later in this guide, and how to join multiple tables together — entirely transparent to whoever wrote the query.

### 💎 Good to Know: The DBMS Is the Software Layer; the Database Is the Data It Manages

Recognizing this distinction precisely — DBMS as the managing software, database as the managed data — is a small but genuinely useful bit of precision that separates a careful answer from a loose, casual one.

### ❓ Follow-up Interview Questions

1. Why is "our MySQL database" technically imprecise phrasing?
2. What are some of the core responsibilities a DBMS handles beyond just storing data?
3. Why does the DBMS, rather than the person writing a query, decide how a query actually gets executed?
4. Can a single DBMS manage more than one database at once? What would that look like in MySQL?
5. Why does this distinction matter more in a technical interview than in everyday conversation?

---

## 6. What is MySQL, and how does it relate to SQL as a language?

### 📖 Introduction

MySQL and SQL are two different kinds of things entirely — one is a specific piece of software, the other is a language that software (and many others) implements.

### 🐬 What MySQL Is

MySQL is a specific, widely used open-source relational database management system, covered in the previous question's DBMS distinction — one of several DBMS products (alongside PostgreSQL, Oracle Database, SQL Server) that all implement SQL as their query language.

### 🔗 How MySQL Relates to SQL

SQL, covered earlier in this chapter, is a standardized language specification; MySQL is one specific implementation of a database engine that understands and executes SQL. Just as multiple browsers all implement the same HTML/CSS/JavaScript web standards with their own particular quirks, multiple DBMS products all implement SQL with their own particular extensions and behavioral differences.

### 🎯 Why This Distinction Matters Practically

SQL written for MySQL isn't always identical to SQL written for PostgreSQL or SQL Server — each DBMS has its own specific extensions, functions, and quirks beyond the shared, standardized core, covered throughout this guide with MySQL's own specific behavior called out where it genuinely differs from the SQL standard or from other systems.

### 🖼️ A Concrete Illustration

MySQL's `LIMIT` clause, covered in the SQL Queries (CRUD) chapter later in this guide, isn't part of the core SQL standard at all — PostgreSQL supports the same syntax, but SQL Server instead uses `TOP` for a similar purpose, a genuine, concrete example of how "SQL" varies meaningfully in practice across different database systems.

### 💎 Good to Know: "SQL" and "MySQL" Are a Language-and-Implementation Pair, Not Two Names for the Same Thing

The genuinely important distinction is recognizing SQL as a language standard and MySQL as one specific, popular implementation of a database engine that speaks it, with its own particular extensions — exactly the distinction this entire guide's title reflects.

### ❓ Follow-up Interview Questions

1. Why is MySQL described as "one implementation" of SQL rather than SQL itself?
2. What's a concrete example of MySQL syntax that isn't part of the standardized SQL specification?
3. Why might SQL written for MySQL need adjustment before running correctly on SQL Server?
4. How is the relationship between SQL and MySQL similar to the relationship between web standards and different browsers?
5. Why does this guide's title, "SQL & MySQL," reflect a language-and-implementation pair rather than a single subject?

---

## 7. What are the different storage engines in MySQL (InnoDB vs. MyISAM), and how do they differ?

### 📖 Introduction

MySQL is genuinely unusual among major database systems in that a single database can mix tables using entirely different underlying storage engines — each engine handling how data is actually stored, indexed, and locked on disk.

### 🏗️ What a Storage Engine Is

A storage engine is the underlying component responsible for actually storing, retrieving, and indexing a table's data on disk — MySQL's own SQL layer sits above this and stays largely the same regardless of which engine a given table happens to use underneath.

### 🔒 InnoDB

The default storage engine in modern MySQL, supporting transactions, covered in full in the Transactions chapter later in this guide, foreign key constraints, covered in the Constraints chapter, and row-level locking, allowing multiple transactions to modify different rows of the same table concurrently without blocking each other.

### 📄 MyISAM

An older storage engine that doesn't support transactions or foreign keys at all, and uses table-level locking instead of row-level locking — meaning a single write to any row locks the entire table for the duration, blocking every other concurrent write. It's historically been slightly faster for read-heavy, write-rarely workloads, at the cost of these genuine limitations.

### ⚖️ Why This Choice Genuinely Matters

Since InnoDB is the only one of the two that supports transactions and foreign keys, it's the correct default choice for essentially any application needing data integrity guarantees — which is exactly why it became MySQL's own default engine, and why MyISAM is now largely considered legacy.

### 💎 Good to Know: This Choice Is Effectively Already Made for Modern Applications

Recognizing that InnoDB should be the default, near-automatic choice for virtually any modern application — given its transaction and foreign key support — while still understanding MyISAM's specific trade-offs and history, is exactly the kind of grounded, practical knowledge this question is testing for.

### ❓ Follow-up Interview Questions

1. Why can a single MySQL database contain tables using two entirely different storage engines?
2. Why does InnoDB's row-level locking allow for better concurrency than MyISAM's table-level locking?
3. Why does the lack of foreign key support make MyISAM a poor fit for most modern applications?
4. Why is InnoDB now MySQL's default storage engine rather than MyISAM?
5. Under what narrow circumstances might MyISAM's characteristics still be considered acceptable today?

---

## 8. What is the difference between SQL and NoSQL databases?

### 📖 Introduction

This exact comparison already received full treatment from a Node.js application-integration perspective in the Node.js guide's Database Integration chapter — this question revisits it here specifically from the database's own internal design perspective.

### 🗄️ SQL (Relational) Databases

Covered throughout this chapter — data organized into structured tables with a fixed, predefined schema, and relationships enforced through keys, queried using SQL. Strong consistency guarantees and well-suited for data with a stable, well-understood relational structure.

### 📄 NoSQL Databases

A broader category covering several different data models — document-based, like MongoDB, storing flexible, schema-less JSON-like documents; key-value, like Redis; graph-based; and others, generally trading some of SQL's strong consistency guarantees for schema flexibility and, for certain access patterns, easier horizontal scaling.

### 🎯 The Genuine Decision Criteria

Whether the data's relationships and structure are stable and well-understood upfront (favoring SQL) versus whether the data's shape varies significantly or evolves frequently (favoring NoSQL); whether strong transactional consistency, covered in the Transactions chapter later in this guide, is critical (favoring SQL) versus whether massive horizontal read scaling for a specific access pattern is the dominant concern (favoring certain NoSQL models).

### 🖼️ A Concrete Illustration

A banking application's accounts and transactions, with strict consistency needs and well-defined relationships, is a strong fit for a SQL database like MySQL. A product catalog with wildly varying attributes per category is a reasonable fit for a document-based NoSQL database instead.

### 💎 Good to Know: This Is a Data-Modeling Decision, Not a "Which Is Better" Question

The SQL-versus-NoSQL choice is genuinely about data modeling and consistency requirements, not about one being universally superior — exactly the same framing already established in the Node.js guide's Database Integration chapter, now viewed from the SQL side of that same comparison.

### ❓ Follow-up Interview Questions

1. Why does a banking application's data specifically favor a SQL database's strong consistency guarantees?
2. What does it mean for NoSQL to trade consistency for schema flexibility, concretely?
3. Why might a large real-world system reasonably use both a SQL and a NoSQL database for different parts of its data?
4. How does this comparison connect to the same SQL-versus-NoSQL coverage in the Node.js guide's Database Integration chapter?
5. What's a genuine, concrete example of data that would be a poor fit for a rigid, predefined SQL schema?

---

## 9. What are the advantages and limitations of relational databases?

### 📖 Introduction

Every architectural choice covered so far in this chapter comes with genuine trade-offs — worth naming both sides explicitly rather than treating relational databases as an unconditional default.

### ✅ The Core Advantages

- **Strong consistency and data integrity** — enforced through constraints, covered in the Constraints chapter later in this guide, and ACID-compliant transactions, covered in the Transactions chapter.
- **A powerful, standardized query language** — SQL, covered earlier in this chapter, lets complex relationships and aggregations be expressed declaratively, without hand-writing procedural traversal logic.
- **Mature tooling and a well-understood model** — decades of production usage, extensive documentation, and broadly transferable skills across nearly every relational database product.
- **Reduced data redundancy** — through normalization, covered in full in the Database Design chapter later in this guide.

### ⚠️ The Core Limitations

- **Rigid schema** — every schema change, covered in the Database Design chapter, requires an explicit migration, which can be disruptive on a large, actively used table.
- **Horizontal scaling is genuinely harder** — a relational database's strong consistency guarantees and relational joins, covered in the Joins chapter later in this guide, make distributing data across many machines more architecturally complex than for some NoSQL models, covered in the previous question, that are specifically designed around that trade-off.
- **Not always the natural fit for deeply hierarchical or highly variable data** — a document database's flexible schema, covered in the previous question, can be a more natural match for that specific shape of data.

### 💎 Good to Know: These Advantages and Limitations Are Two Sides of the Exact Same Design Choices

Every limitation listed here traces directly back to the exact same design choices that produce the advantages — a rigid schema enables strong integrity guarantees but costs migration flexibility; strong consistency guarantees cost horizontal scaling ease. Recognizing this connection, rather than treating them as an unrelated list, is the stronger way to frame this answer.

### ❓ Follow-up Interview Questions

1. Why does a rigid schema simultaneously provide an advantage and a limitation?
2. Why is horizontal scaling generally harder for a relational database than for certain NoSQL models?
3. How does normalization, covered in the Database Design chapter, directly reduce data redundancy?
4. What kind of data would make a document database's flexible schema a genuinely better fit than a relational one?
5. Why should these advantages and limitations be understood as directly connected, rather than as two separate, unrelated lists?

---

## 10. When would you choose MySQL over another relational database like PostgreSQL?

### 📖 Introduction

Since both are mature, widely used, open-source relational databases implementing the same core SQL standard, covered earlier in this chapter, the decision between them usually comes down to specific, practical factors rather than either being objectively superior.

### 🐬 When MySQL Tends to Fit Well

Read-heavy web applications, especially those historically built around the traditional LAMP/MEAN-adjacent stack, where MySQL's ecosystem, hosting support, and tooling are especially mature and broadly available. Teams already deeply familiar with MySQL's specific tooling and operational characteristics.

### 🐘 When PostgreSQL Tends to Fit Well

Applications needing more advanced data types (native JSON with rich querying, arrays, custom types) or more sophisticated features (advanced indexing strategies beyond what's covered in the Indexing chapter later in this guide, more powerful window function and CTE support, covered in the Window Functions and Subqueries & CTEs chapters). Applications with genuinely complex query and data-integrity requirements that benefit from PostgreSQL's historically stricter standards compliance.

### 🖼️ A Concrete Illustration

A straightforward content-management or e-commerce backend, prioritizing broad hosting availability and a simple, well-understood operational model, is a reasonable fit for MySQL. An application relying heavily on complex JSON querying or advanced full-text search directly inside the database is often a better fit for PostgreSQL's more feature-rich implementation.

### 💎 Good to Know: This Is Rarely a Decisive, High-Stakes Choice for a Typical Application

For the overwhelming majority of applications, both databases are genuinely capable, and the choice often comes down to team familiarity, hosting ecosystem, and specific feature needs, rather than one being a clearly, decisively better general-purpose choice than the other.

### ❓ Follow-up Interview Questions

1. Why might a team's existing familiarity with one database reasonably outweigh a feature-level comparison?
2. What kind of application would specifically benefit from PostgreSQL's more advanced JSON querying support?
3. Why is this choice described as rarely decisive for a typical application, rather than a critical, high-stakes decision?
4. How does this comparison relate to the broader SQL-versus-NoSQL comparison covered earlier in this chapter?
5. What questions would you ask a team to help them decide between MySQL and PostgreSQL for a new project?

---