---
title: Keys & Relationships
description: Primary/foreign keys, and one-to-one, one-to-many, many-to-many relationships.
sidebar_position: 10
---

# Keys & Relationships

## 1. What is a primary key, and why does every table typically need one?

### 📖 Introduction

The Constraints chapter already covered exactly how a `PRIMARY KEY` is enforced — uniqueness plus non-null. This chapter looks at the same concept from a different angle: why that unique identifier is the foundation every relationship between tables actually depends on.

### 🔑 What a Primary Key Represents

A primary key is the column (or combination of columns) that uniquely identifies a specific row within a table — not just a constraint the database enforces, but the actual, stable "handle" every other table uses to refer back to that specific row.

### 🔗 Why Relationships Depend on It

A relationship between two tables, covered throughout the rest of this chapter, works by one table storing another table's primary key value as a reference — this only works reliably because the primary key is guaranteed unique and stable, exactly the guarantee covered in the Constraints chapter.

### 🖼️ A Concrete Illustration

An `orders` table storing `customer_id` only meaningfully identifies "which customer" because `customers.id` is guaranteed to uniquely, reliably identify exactly one customer — without that guarantee, `customer_id` could be ambiguous, referring to more than one possible row.

### 💎 Good to Know: This Chapter's Angle Is "Keys as the Mechanism for Relationships," Not "Keys as a Constraint"

The Constraints chapter covered what a primary key enforces; this chapter is about what that enforcement actually enables — every relationship type covered later in this chapter (one-to-one, one-to-many, many-to-many) is built directly on this same foundational idea of a reliable, unique row identifier.

### ❓ Follow-up Interview Questions

1. Why would a relationship between two tables become unreliable without a guaranteed-unique primary key on one side?
2. In the orders example, what would go wrong if `customers.id` weren't actually guaranteed unique?
3. How does this chapter's framing of primary keys differ from the Constraints chapter's framing of the same concept?
4. Could a table function without any primary key at all? What would be lost?
5. Why is a primary key described as a "stable handle" rather than just an arbitrary column?

---

## 2. What is a composite key, and when would you use one?

### 📖 Introduction

Not every table's natural identity fits neatly into a single column — a composite key is what lets a primary key, covered in the previous question, span more than one column at once.

### 🔗 What a Composite Key Is

A composite key is a primary key made up of two or more columns together, where the *combination* of those columns' values is what's guaranteed unique — no single one of those columns needs to be unique on its own.

### 🖼️ A Concrete Illustration

A junction table resolving a many-to-many relationship, covered in more depth later in this chapter, between students and courses — `enrollments(student_id, course_id)` — might use both columns together as a composite primary key: a specific student can enroll in a specific course only once, but the same `student_id` naturally appears across many different rows (one per course they're enrolled in), and the same `course_id` naturally appears across many different rows too.

```sql
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  PRIMARY KEY (student_id, course_id)
);
```

### 🎯 When a Composite Key Genuinely Fits

Whenever a row's real, natural uniqueness only emerges from a specific combination of values, rather than any single column alone — most commonly in junction tables, covered in more depth later in this chapter, resolving a many-to-many relationship.

### 💎 Good to Know: A Composite Key Enforces Uniqueness on the Combination, Not on Any Individual Column

The genuinely important distinction is that neither `student_id` nor `course_id` alone is unique in the `enrollments` table — only their combination is, which is exactly what a composite primary key, rather than two separate single-column keys, correctly expresses.

### ❓ Follow-up Interview Questions

1. Why doesn't either individual column in a composite key need to be unique on its own?
2. In the enrollments example, why does the combination of `student_id` and `course_id` need to be unique rather than either column alone?
3. Why are composite keys especially common in junction tables specifically?
4. Could an `AUTO_INCREMENT` surrogate key, covered in more depth in the next question, be used instead of a composite key here? What would that trade off?
5. How would you decide whether a specific table's uniqueness genuinely requires a composite key?

---

## 3. What is a foreign key, and how does it establish a relationship between two tables?

### 📖 Introduction

The Constraints chapter already covered exactly what a `FOREIGN KEY` enforces — referential integrity. This chapter's angle is different: how a foreign key is actually the mechanism that expresses a relationship's specific shape.

### 🔗 A Foreign Key as a Relationship, Not Just a Rule

A foreign key column stores a value matching another table's primary key, covered earlier in this chapter — but beyond simply preventing invalid references, covered in the Constraints chapter, this is precisely how one table's rows become connected to another table's rows in the first place.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

`orders.customer_id` doesn't just have to reference a real customer — it's the actual expression of "this order belongs to this customer," the relationship itself, covered in more depth for each specific relationship shape later in this chapter.

### 🎯 Where the Foreign Key Lives Determines the Relationship's Shape

Which table holds the foreign key, and whether that foreign key column is also unique, covered earlier in this chapter, or allowed to repeat, is exactly what determines whether a relationship is one-to-one, one-to-many, or many-to-many — each covered in its own dedicated question later in this chapter.

### 💎 Good to Know: This Chapter Treats the Foreign Key as "the Relationship Itself," Not Just "a Validity Check"

The genuinely important shift in framing from the Constraints chapter: there, a foreign key was about preventing bad data; here, it's about recognizing the foreign key as the literal mechanism through which a relationship between two tables actually exists at all.

### ❓ Follow-up Interview Questions

1. Why is a foreign key described here as "the relationship itself" rather than just a validity check?
2. In the orders example, what relationship does `customer_id` actually express, beyond just referencing a valid customer?
3. How does where a foreign key lives (which table holds it) affect the shape of the relationship it expresses?
4. Why does this chapter's framing of foreign keys differ from the Constraints chapter's framing of the same mechanism?
5. Could two tables have a genuine relationship between them without any foreign key at all? What would be lost?

---

## 4. What is the difference between a natural key and a surrogate key?

### 📖 Introduction

A primary key, covered earlier in this chapter, needs a value to actually be — and there are two genuinely different philosophies for choosing what that value should be.

### 🌍 Natural Key

A natural key uses a value that already has real-world, business meaning — an email address, a national ID number, a product's SKU — as the primary key itself, rather than introducing an artificial value with no meaning outside the database.

### 🔢 Surrogate Key

A surrogate key is an artificial, database-generated identifier — most commonly an `AUTO_INCREMENT` integer, covered in the SQL Queries (CRUD) chapter's discussion of auto-incrementing primary keys — with no real-world meaning at all, existing purely to uniquely identify a row.

### ⚖️ The Trade-off

A natural key avoids needing an extra column, and its value is immediately meaningful when looking at the data directly — but real-world values can change (an email gets updated) or turn out, surprisingly, to not be as unique as originally assumed. A surrogate key never needs to change, regardless of what happens to any real-world business data, at the cost of one additional, otherwise-meaningless column.

### 🖼️ A Concrete Illustration

Using a customer's `email` as a natural primary key seems reasonable, until that customer needs to change their email — every other table's foreign key referencing that email, covered earlier in this chapter, would then also need to be updated everywhere it was referenced. A surrogate `id` column sidesteps this problem entirely, since the customer's email can change freely without ever touching the actual relationships built on their `id`.

### 💎 Good to Know: Surrogate Keys Are the Overwhelmingly Common Default in Modern Schema Design, Specifically Because Real-World Values Change

The genuinely important, practical takeaway is that surrogate keys have become the standard default specifically because they avoid the cascading-update problem natural keys create the moment a real-world value legitimately needs to change.

### ❓ Follow-up Interview Questions

1. Why does using a customer's email as a natural primary key create a problem if that email ever needs to change?
2. What's the genuine benefit of a natural key over a surrogate key, if any?
3. Why have surrogate keys become the standard default in modern schema design?
4. Could a table have both a surrogate primary key and a natural key enforced separately as UNIQUE? What would that look like?
5. What real-world value might seem like a safe natural key but later turn out to not be as unique as assumed?

---

## 5. What is a one-to-one relationship, and how is it modeled in a schema?

### 📖 Introduction

This is the first of the three relationship shapes covered in this chapter, and the least common of the three in practice — worth understanding both how it's modeled and why it's used relatively sparingly.

### 1️⃣ What a One-to-One Relationship Is

Exactly one row in one table corresponds to exactly one row in another table, and vice versa — a `user` and their `user_profile`, where each user has exactly one profile, and each profile belongs to exactly one user.

### 🔗 How It's Modeled

A foreign key, covered earlier in this chapter, on one of the two tables, additionally marked `UNIQUE`, covered in the Constraints chapter — the `UNIQUE` constraint is what actually distinguishes a one-to-one relationship from a one-to-many, covered in the next question, at the schema level.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE user_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

`user_id` being `UNIQUE` guarantees each user can have at most one corresponding profile row — without that `UNIQUE` constraint, this would instead describe a one-to-many relationship, covered in the next question, letting one user have many profiles.

### 🎯 Why One-to-One Relationships Are Used Relatively Sparingly

Since a one-to-one relationship's two tables could often just as easily be combined into a single table with additional columns, covered in the Database Design chapter's discussion of the table-versus-column decision, a genuine, deliberate reason — like separating rarely accessed, optional data, or applying different access permissions to sensitive fields — is usually needed to justify keeping them separate at all.

### 💎 Good to Know: The UNIQUE Constraint Is What Distinguishes a One-to-One Relationship From a One-to-Many at the Schema Level

The single most important detail to internalize here is that a plain foreign key alone describes a one-to-many relationship, covered in the next question — it's specifically the addition of `UNIQUE` that narrows it down to one-to-one.

### ❓ Follow-up Interview Questions

1. Why does the `UNIQUE` constraint on the foreign key specifically create a one-to-one relationship rather than a one-to-many one?
2. In the user-profile example, what would happen if the `UNIQUE` constraint were removed?
3. Why might a team choose to keep a one-to-one relationship as two separate tables rather than merging them into one?
4. What's a genuine, practical reason to separate optional or sensitive data into its own one-to-one related table?
5. How does this relationship type connect back to the table-versus-column decision covered in the Database Design chapter?

---

## 6. What is a one-to-many relationship, and how is it modeled in a schema?

### 📖 Introduction

This is genuinely the most common relationship shape in any real-world schema — nearly every example used throughout this entire guide, like customers and their orders, has actually been a one-to-many relationship.

### 🔗 What a One-to-Many Relationship Is

One row in the "one" table can relate to many rows in the "many" table, but each row in the "many" table relates back to only one row in the "one" table — one customer can have many orders, but each order belongs to exactly one customer.

### 🖼️ How It's Modeled

A plain foreign key, covered earlier in this chapter, on the "many" side, referencing the "one" side's primary key — without any additional `UNIQUE` constraint, covered in the previous question, which is exactly what would narrow it down to a one-to-one relationship instead.

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

`customer_id` can repeat across many different `orders` rows — every repetition represents another order belonging to that same customer.

### 🎯 Why This Is the Default, Most Common Relationship Shape

Most real-world relationships are naturally one-to-many — a blog author and their posts, a category and its products — which is exactly why this relationship shape, and the plain foreign key that models it, appears far more often in practice than either one-to-one or many-to-many, covered in the next question.

### 💎 Good to Know: A Plain Foreign Key, With No Additional Uniqueness Constraint, Is the Signature of a One-to-Many Relationship

The clean way to distinguish all three relationship types by their schema alone: a plain foreign key is one-to-many; a foreign key with `UNIQUE` added is one-to-one, covered in the previous question; and a junction table, covered in the next question, is many-to-many.

### ❓ Follow-up Interview Questions

1. Why does a plain foreign key, without any additional uniqueness constraint, naturally model a one-to-many relationship?
2. In the orders example, why can `customer_id` legitimately repeat across many different rows?
3. Why is one-to-many considered the most common relationship shape in real-world schemas?
4. How would you recognize, just by looking at a table's foreign key definition, whether a relationship is one-to-many or one-to-one?
5. What would need to change in the orders example to turn this one-to-many relationship into a one-to-one relationship instead?

---

## 7. What is a many-to-many relationship, and why does it require a junction/bridge table?

### 📖 Introduction

This is the third and final relationship shape covered in this chapter — and the one genuinely different enough from the previous two that it can't be modeled with a simple foreign key alone.

### 🔗 What a Many-to-Many Relationship Is

Many rows in one table can relate to many rows in another table, in both directions at once — a student can enroll in many courses, and a course can have many students enrolled in it.

### ⚠️ Why a Plain Foreign Key Can't Model This

A single foreign key column, covered earlier in this chapter, can only hold one value — it can express "this row belongs to that one row," but it can't express "this row relates to many rows on the other side," which is exactly what a many-to-many relationship genuinely needs on both sides simultaneously.

### 🌉 The Junction (Bridge) Table Solution

A separate table sits between the two related tables, with a foreign key referencing each one — every row in this junction table represents one specific pairing between one specific student and one specific course.

### 🖼️ A Concrete Illustration

```sql
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

Exactly the composite-key example covered earlier in this chapter — `enrollments` resolves the many-to-many relationship between `students` and `courses` into two separate one-to-many relationships instead, one from `students` to `enrollments`, and one from `courses` to `enrollments`.

### 💎 Good to Know: A Many-to-Many Relationship Is Really Just Two One-to-Many Relationships, Connected Through a Junction Table

The genuinely important insight tying this back to the previous question: a many-to-many relationship isn't a fundamentally new mechanism — it's decomposed into two ordinary one-to-many relationships, each modeled with a plain foreign key, both meeting at a shared junction table.

### ❓ Follow-up Interview Questions

1. Why can't a single foreign key column express a many-to-many relationship on its own?
2. In the enrollments example, why does the junction table need a foreign key referencing each of the two related tables?
3. Why is a many-to-many relationship described as "really two one-to-many relationships" rather than a fundamentally different mechanism?
4. Why does the junction table's composite primary key, covered earlier in this chapter, prevent the same student from enrolling in the same course twice?
5. What additional columns might a real-world junction table like `enrollments` reasonably need beyond just the two foreign keys?

---

## 8. What is referential integrity, and how do keys help enforce it?

### 📖 Introduction

Every relationship type covered in this chapter — one-to-one, one-to-many, many-to-many — depends on one underlying guarantee holding true: that a reference always points to something that genuinely exists.

### 🔗 What Referential Integrity Means

Referential integrity is the guarantee that a foreign key value, covered earlier in this chapter, always corresponds to an existing row in the table it references — no order can ever reference a customer that doesn't exist, no enrollment can ever reference a course that's been deleted without that being handled explicitly.

### 🛡️ How Keys Enforce This

The `FOREIGN KEY` constraint, covered in full from an enforcement perspective in the Constraints chapter, is precisely the mechanism guaranteeing referential integrity — rejecting any insert or update that would create a dangling, invalid reference, and controlling exactly what happens to dependent rows via the `ON DELETE`/`ON UPDATE` actions also covered in that chapter.

### 🖼️ A Concrete Illustration

Without referential integrity, deleting a customer while orders still reference them would leave those orders pointing at a `customer_id` that no longer corresponds to any real customer at all — a genuinely broken, inconsistent state that `RESTRICT`, `CASCADE`, or `SET NULL`, all covered in the Constraints chapter, exist specifically to prevent.

### 💎 Good to Know: This Question Ties the Constraints Chapter's Enforcement Mechanics to This Chapter's Relationship-Modeling Focus

The genuinely important synthesis here: referential integrity is the actual guarantee every relationship in this chapter depends on, and the foreign key constraint mechanics covered in the Constraints chapter are simply how that guarantee gets enforced in practice.

### ❓ Follow-up Interview Questions

1. Why would deleting a referenced customer without any referential-integrity protection leave the database in a broken state?
2. How does the FOREIGN KEY constraint, covered in the Constraints chapter, actually enforce referential integrity?
3. Why does every relationship type covered in this chapter depend on referential integrity holding true?
4. How do the `ON DELETE`/`ON UPDATE` referential actions, covered in the Constraints chapter, relate to maintaining referential integrity?
5. What would a query joining two tables, covered in the Joins chapter, look like if referential integrity had been silently violated somewhere in the data?

---

## 9. What is the difference between a candidate key and a primary key?

### 📖 Introduction

A table can genuinely have more than one column (or combination of columns) capable of uniquely identifying a row — understanding the relationship between all of those candidates and the one actually chosen closes out this chapter's coverage of key types.

### 🗳️ What a Candidate Key Is

A candidate key is any column, or combination of columns, that *could* serve as the table's primary key — it satisfies the same uniqueness and non-null requirements covered in the Constraints chapter's discussion of `PRIMARY KEY`, but simply hasn't necessarily been chosen as the actual, official one.

### 👑 What a Primary Key Is, in This Context

The primary key is whichever one candidate key is actually selected, from among potentially several, to be the table's official, designated unique identifier — covered throughout this chapter as the foundation every relationship is built on.

### 🖼️ A Concrete Illustration

A `customers` table might have both `id` (a surrogate key, covered earlier in this chapter) and `email` (a natural key, also covered earlier in this chapter) each independently capable of uniquely identifying a row — both are candidate keys, but only `id` gets designated the actual primary key, while `email` remains enforced separately as `UNIQUE`, covered in the Constraints chapter.

### 🎯 Why This Distinction Is Genuinely Useful

Recognizing that a table can have multiple candidate keys, and that choosing which one becomes the primary key is a deliberate design decision, covered in this chapter's natural-versus-surrogate discussion, rather than there being only ever one possible unique identifier for a given table.

### 💎 Good to Know: Every Primary Key Is a Candidate Key, but Not Every Candidate Key Becomes the Primary Key

The clean, precise relationship between these two terms: "candidate key" describes every column or combination that *could* serve as the identifier; "primary key" describes the one that actually *was* chosen — every primary key is necessarily a candidate key, but the reverse isn't true.

### ❓ Follow-up Interview Questions

1. Why can a single table have more than one candidate key at the same time?
2. In the customers example, why does `email` remain a candidate key even though `id` was chosen as the actual primary key?
3. Why is every primary key necessarily a candidate key, but not the other way around?
4. How does this question connect to the natural-versus-surrogate key decision covered earlier in this chapter?
5. How would you identify all of the candidate keys in an existing, unfamiliar table?

---

## 10. How would you design the schema for a many-to-many relationship, like students and courses?

### 📖 Introduction

This capstone question for the chapter combines nearly every concept covered so far — primary keys, foreign keys, composite keys, and junction tables — into one complete, hands-on schema design exercise.

### 🧩 Step 1: Define the Two Core Entities

`students` and `courses`, each with its own surrogate primary key, covered earlier in this chapter — `id INT PRIMARY KEY AUTO_INCREMENT` on each, following the surrogate-key default covered earlier in this chapter.

### 🌉 Step 2: Introduce the Junction Table

Since a student can enroll in many courses and a course can have many students, covered earlier in this chapter, a plain foreign key on either table alone can't express this — an `enrollments` junction table, covered earlier in this chapter, is required.

### 🔑 Step 3: Define the Junction Table's Keys

```sql
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

A composite primary key, covered earlier in this chapter, on `(student_id, course_id)` prevents the same student from enrolling in the same course twice, while the two separate foreign keys enforce referential integrity, covered earlier in this chapter, against both `students` and `courses`.

### 📐 Step 4: Add Any Relationship-Specific Data

`enrolled_at`, with a `DEFAULT`, covered in the Constraints chapter, of the current timestamp — genuine data that belongs to the relationship itself (when did this specific enrollment happen), rather than to either `students` or `courses` individually.

### 💎 Good to Know: This Capstone Exercise Is Every Key and Relationship Concept From This Chapter, Assembled Into One Complete Schema

The genuine skill this capstone question tests isn't any single new concept — it's methodically combining surrogate keys, junction tables, composite keys, and foreign keys, all covered across this chapter, into one coherent, correctly designed schema.

### ❓ Follow-up Interview Questions

1. Why can't this many-to-many relationship be modeled with a plain foreign key on either `students` or `courses` alone?
2. Why does the composite primary key on `enrollments` specifically prevent duplicate enrollments?
3. Why does `enrolled_at` belong on the `enrollments` table rather than on `students` or `courses`?
4. If asked to design this schema from scratch in an interview, what's the right order to walk through these design steps?
5. How would this schema need to change if a student could enroll in the same course multiple times across different semesters?

---