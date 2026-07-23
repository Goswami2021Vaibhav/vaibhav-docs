---
title: Transactions
description: ACID properties, COMMIT/ROLLBACK, and isolation levels.
sidebar_position: 13
---

# Transactions

## 1. What is a transaction in a database, and why is it needed?

### 📖 Introduction

Transactions already received a general, application-integration-focused treatment in the Node.js guide's Database Integration chapter — this chapter goes deeper into the same concept from SQL and MySQL's own native perspective.

### 📦 What a Transaction Is

A transaction is a group of one or more SQL statements, covered throughout the SQL Queries (CRUD) chapter, treated as a single, indivisible unit of work — either every statement in the group succeeds and is permanently applied, or if any one fails, the entire group is undone as if none of it had ever happened.

### 🏦 Why It's Needed

Some operations genuinely require multiple separate statements to succeed or fail together — transferring money between two accounts requires both deducting from one and adding to the other, covered in the Node.js guide's Database Integration chapter's exact same illustration. Without a transaction wrapping both statements, a crash between the two would leave the database in a genuinely inconsistent state — money deducted from one account but never added to the other.

### 🖼️ A Concrete Illustration

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

Both `UPDATE` statements either both succeed together, or, if anything goes wrong before `COMMIT`, both can be undone together via `ROLLBACK`, covered in more depth in the next question — the database never ends up with only one of the two updates applied.

### 💎 Good to Know: This Chapter's Focus Is the MySQL-Specific Mechanics Behind the Concept Already Introduced in the Node.js Guide

The genuinely new value in this chapter, beyond the Node.js guide's own application-level coverage, is the specific SQL syntax and MySQL-native behavior — isolation levels, locking, deadlocks — all covered in more depth throughout the rest of this chapter.

### ❓ Follow-up Interview Questions

1. Why would a crash between the two UPDATE statements in the bank-transfer example leave the database inconsistent without a transaction?
2. What does it mean for a transaction to be "indivisible"?
3. Why is a single, standalone statement often already atomic on its own, without needing an explicit transaction?
4. How does this chapter's coverage relate to the transaction coverage already provided in the Node.js guide's Database Integration chapter?
5. What would happen to the bank-transfer example if the second UPDATE statement failed after the first one had already succeeded, with no transaction wrapping both?

---

## 2. What are the ACID properties, and what does each one guarantee?

### 📖 Introduction

ACID was introduced and illustrated with the same bank-transfer example in the Node.js guide's Database Integration chapter — this question restates each property specifically in terms of the SQL mechanics covered throughout this chapter.

### 🔒 Atomicity

The "all or nothing" guarantee covered in the previous question — a transaction's statements either all succeed together, committed via `COMMIT`, or all fail together, undone via `ROLLBACK`, both covered in more depth in the next question.

### ✅ Consistency

A transaction takes the database from one valid state to another valid state, never violating a defined constraint, covered throughout the Constraints chapter — even if a transaction fails partway through, atomicity's rollback guarantee ensures the database never ends up in a state that would violate a `NOT NULL`, `FOREIGN KEY`, or `CHECK` constraint.

### 🔐 Isolation

Concurrently running transactions don't see each other's uncommitted, in-progress changes — covered in full depth, including its specific configurable levels, later in this chapter.

### 💾 Durability

Once a transaction is successfully committed, its changes are permanent and survive even a subsequent crash — typically guaranteed by writing changes to durable, non-volatile storage before confirming the commit as successful.

### 🖼️ A Concrete Illustration

Revisiting the bank-transfer example from the previous question: atomicity guarantees both updates happen or neither does; consistency guarantees account balances never violate a `CHECK (balance >= 0)` constraint, covered in the Constraints chapter; isolation guarantees a concurrently running query never sees the money deducted from one account before it's been added to the other; durability guarantees that once `COMMIT` succeeds, the transfer survives even if the server crashes immediately afterward.

### 💎 Good to Know: This Chapter Grounds the Same Four Properties in Concrete, MySQL-Specific Syntax and Behavior

The genuinely new depth beyond the Node.js guide's coverage is that this chapter connects each ACID property directly to the actual SQL statements (`START TRANSACTION`, `COMMIT`, `ROLLBACK`) and MySQL-specific mechanics (isolation levels, locking) that actually implement it.

### ❓ Follow-up Interview Questions

1. Why does atomicity's rollback guarantee directly support consistency, even when a transaction fails partway through?
2. In the bank-transfer example, what would a violation of isolation actually look like to a concurrently running query?
3. Why does durability specifically require writing changes to non-volatile storage before confirming a commit?
4. How does this chapter's treatment of ACID differ from the Node.js guide's Database Integration chapter's treatment of the same four properties?
5. Which of the four ACID properties would be violated if a successfully committed transaction's changes were lost after a server crash?

---

## 3. What are COMMIT and ROLLBACK, and how do they relate to a transaction's lifecycle?

### 📖 Introduction

Every transaction covered so far in this chapter has ended in one of exactly two ways — `COMMIT` or `ROLLBACK` — the two statements that actually conclude a transaction's lifecycle.

### ✅ COMMIT

`COMMIT` permanently applies every statement executed since the transaction began, satisfying the durability guarantee covered in the previous question — once committed, the changes are final and visible to every other concurrent connection.

### ↩️ ROLLBACK

`ROLLBACK` undoes every statement executed since the transaction began, as if none of them had ever happened — the database returns to exactly the state it was in before the transaction started.

### 🖼️ A Concrete Illustration

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;

-- Application code checks: did the account have sufficient balance?
-- If not:
ROLLBACK;
-- If so:
COMMIT;
```

The application can inspect the result of an intermediate statement before deciding whether the entire transaction should actually be committed or rolled back entirely.

### ⚙️ Autocommit Mode

By default, MySQL runs in autocommit mode, where every individual statement is automatically treated as its own complete transaction, committed immediately — `START TRANSACTION` explicitly disables this default behavior for the statements that follow, until an explicit `COMMIT` or `ROLLBACK` is reached.

### 💎 Good to Know: Every Transaction Ends in Exactly One of These Two Ways, Never Left Open Indefinitely

The genuinely important operational detail is that a transaction should never be left open indefinitely — an application bug leaving a transaction neither committed nor rolled back can hold locks, covered in more depth later in this chapter, open far longer than intended, blocking other concurrent transactions.

### ❓ Follow-up Interview Questions

1. Why does `COMMIT` satisfy the durability guarantee specifically, rather than one of the other ACID properties?
2. What does autocommit mode mean for a single statement run outside of an explicit `START TRANSACTION` block?
3. In the concrete example, why might application code choose to `ROLLBACK` rather than `COMMIT` after the first UPDATE runs?
4. What could go wrong if a transaction were accidentally left open, neither committed nor rolled back, for an extended period?
5. Why does `START TRANSACTION` need to explicitly disable MySQL's default autocommit behavior?

---

## 4. What is a savepoint, and how is it used within a transaction?

### 📖 Introduction

`ROLLBACK`, covered in the previous question, normally undoes an entire transaction — a savepoint lets a transaction instead roll back to just an intermediate point, without discarding everything.

### 📍 What a Savepoint Is

A savepoint marks a specific point within an ongoing transaction that a later `ROLLBACK` can return to, undoing only the statements executed after that savepoint, while preserving everything committed before it within that same transaction.

### 🖼️ A Concrete Illustration

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT after_deduction;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- If something goes wrong specifically with the second update:
ROLLBACK TO after_deduction;
-- The first UPDATE is still in effect; only the second one was undone

COMMIT;
```

### 🎯 Why This Is Useful

A single large transaction with several distinct logical steps can recover from a failure in a later step without needing to redo every earlier step from scratch — genuinely useful for a complex, multi-step transaction where only one specific part might reasonably need retrying.

### 💎 Good to Know: A Savepoint Doesn't End the Transaction — It's a Rollback Target Within One Still-Open Transaction

The genuinely important distinction from `ROLLBACK` alone, covered in the previous question, is that rolling back to a savepoint doesn't conclude the transaction the way a full `ROLLBACK` or `COMMIT` does — the transaction remains open afterward, able to continue, retry the failed step, and eventually still reach its own `COMMIT` or full `ROLLBACK`.

### ❓ Follow-up Interview Questions

1. Why does rolling back to a savepoint preserve statements that ran before that savepoint was set?
2. In the concrete example, what state would the transaction be in immediately after `ROLLBACK TO after_deduction`?
3. Why might a complex, multi-step transaction benefit from using savepoints rather than one single rollback point?
4. Does rolling back to a savepoint end the transaction? Why or why not?
5. How does a savepoint relate to the atomicity property covered earlier in this chapter?

---

## 5. What are database isolation levels, and what problem does each level address?

### 📖 Introduction

Isolation, one of the four ACID properties covered earlier in this chapter, isn't actually all-or-nothing — it's configurable, in degrees, and each level trades off consistency guarantees against concurrency performance differently.

### 🔐 Why Isolation Is Configurable at All

Perfect isolation — where concurrent transactions behave as if run one at a time, with zero interference — is possible, but genuinely expensive in terms of concurrency and performance. Isolation levels let a team choose a deliberate trade-off between strict consistency and concurrent throughput, rather than always paying the maximum possible cost.

### 📊 The Four Standard Isolation Levels

- **READ UNCOMMITTED** — the weakest level, allowing a transaction to see another transaction's uncommitted changes at all, covered in more depth in the next question's discussion of dirty reads.
- **READ COMMITTED** — a transaction only ever sees changes that have already been committed by other transactions, but two reads of the same row within the same transaction could still see different results if another transaction commits a change in between.
- **REPEATABLE READ** — guarantees that if a transaction reads the same row twice, it sees the same value both times, covered in more depth in the next question — MySQL's own default level, covered in more depth in a later question in this chapter.
- **SERIALIZABLE** — the strictest level, making concurrent transactions behave essentially as if they ran one at a time, sequentially, at the greatest cost to concurrency.

### 🎯 Why Each Level Exists

Each successive level closes off one more specific category of concurrency-related inconsistency, covered in full in the next question, at the cost of more restrictive locking and reduced concurrent throughput — moving from `READ UNCOMMITTED` toward `SERIALIZABLE` trades performance for stronger consistency guarantees.

### 💎 Good to Know: Isolation Levels Are a Deliberate, Configurable Trade-off, Not a Fixed Property of "Isolation" Itself

The genuinely important framing is that isolation, unlike atomicity or durability, both covered earlier in this chapter, isn't a single fixed guarantee — it's a spectrum a team can deliberately choose a point on, based on how much consistency a specific application genuinely needs versus how much concurrency it needs to sustain.

### ❓ Follow-up Interview Questions

1. Why is perfect isolation described as expensive, rather than simply the obviously correct default?
2. What's the practical difference between READ COMMITTED and REPEATABLE READ?
3. Why does SERIALIZABLE provide the strongest guarantee but the weakest concurrency?
4. Why are isolation levels described as a spectrum rather than a fixed, single property?
5. How would you decide which isolation level a specific application genuinely needs?

---

## 6. What is a dirty read, a non-repeatable read, and a phantom read?

### 📖 Introduction

These three are the specific, named categories of inconsistency that isolation levels, covered in the previous question, exist specifically to prevent — worth understanding precisely what each one actually looks like.

### 🔴 Dirty Read

Reading another transaction's uncommitted changes — if that other transaction later rolls back, covered earlier in this chapter, the first transaction has read data that, in a sense, never actually existed. Only possible under `READ UNCOMMITTED`, covered in the previous question.

### 🟡 Non-Repeatable Read

Reading the same row twice within the same transaction and getting two different results, because another transaction committed a change to that row in between the two reads. Possible under `READ COMMITTED`, but prevented by `REPEATABLE READ`, both covered in the previous question.

### 🟢 Phantom Read

Re-running the same query with a `WHERE` condition, covered in the Filtering, Sorting & Grouping chapter, twice within the same transaction and getting a different *set* of rows, because another transaction inserted or deleted a row matching that condition in between — subtly different from a non-repeatable read, which is about an existing row's value changing, rather than the overall set of matching rows changing.

### 🖼️ A Concrete Illustration

A transaction querying `SELECT COUNT(*) FROM orders WHERE status = 'pending'` twice, getting `10` the first time and `11` the second time because another transaction committed a new pending order in between, is a phantom read — the individual rows already counted didn't change, but a new one appeared.

### 💎 Good to Know: Each Isolation Level Corresponds to Preventing One Additional Category of These Three Anomalies

The genuinely important connective insight, tying directly back to the previous question: each successive isolation level exists specifically to close off one more of these three categories — `READ UNCOMMITTED` allows all three, `READ COMMITTED` prevents dirty reads, `REPEATABLE READ` additionally prevents non-repeatable reads, and `SERIALIZABLE` additionally prevents phantom reads too.

### ❓ Follow-up Interview Questions

1. Why does a dirty read only matter if the transaction that made the uncommitted change later rolls back?
2. What's the precise difference between a non-repeatable read and a phantom read?
3. In the concrete example, why is the changing COUNT(*) result specifically a phantom read rather than a non-repeatable read?
4. Why does each successive isolation level, moving from READ UNCOMMITTED toward SERIALIZABLE, close off one additional anomaly?
5. Which of these three anomalies would REPEATABLE READ still permit, and why?

---

## 7. What is the default isolation level in MySQL's InnoDB engine, and what does it guarantee?

### 📖 Introduction

Of the four isolation levels covered earlier in this chapter, MySQL's InnoDB storage engine, covered in the Introduction & Fundamentals chapter, specifically defaults to one — worth knowing precisely, since it's genuinely surprising to many people learning SQL for the first time.

### 🔁 REPEATABLE READ Is the Default

Unlike some other database systems that default to `READ COMMITTED`, InnoDB's default isolation level is `REPEATABLE READ`, covered earlier in this chapter — guaranteeing that reading the same row twice within the same transaction always returns the same value, even if another transaction commits a change to it in between.

### 🛡️ What It Guarantees, and What It Doesn't

`REPEATABLE READ` prevents both dirty reads and non-repeatable reads, both covered in the previous question. Notably, InnoDB's specific implementation of `REPEATABLE READ` also prevents most phantom reads, covered in the previous question, in practice — going further than the SQL standard's own baseline definition of this isolation level technically requires, though `SERIALIZABLE`, covered earlier in this chapter, remains the only level with an absolute guarantee against every phantom read scenario.

### 🖼️ A Concrete Illustration

```sql
SELECT @@transaction_isolation;
```

Returns `REPEATABLE-READ` on a default MySQL installation — confirming this is genuinely the active default, not something that needs to be explicitly configured to get this specific behavior.

### 💎 Good to Know: MySQL's Default Is Notably Stricter Than Some Other Popular Database Systems' Own Defaults

The genuinely useful, practical detail worth remembering specifically for MySQL: its `REPEATABLE READ` default is stricter than PostgreSQL's own default of `READ COMMITTED`, covered in the Introduction & Fundamentals chapter's MySQL-versus-PostgreSQL comparison — worth knowing explicitly when moving between the two systems.

### ❓ Follow-up Interview Questions

1. Why is MySQL's default isolation level considered stricter than some other popular database systems' defaults?
2. What does REPEATABLE READ guarantee that READ COMMITTED, covered in the previous question, doesn't?
3. Why does InnoDB's specific implementation of REPEATABLE READ go further than the SQL standard's baseline definition requires?
4. How would you check which isolation level is actually active on a given MySQL connection?
5. Why might this default difference between MySQL and PostgreSQL matter when migrating an application between the two?

---

## 8. What is a deadlock, and how does a database typically handle one?

### 📖 Introduction

Two transactions, each holding a resource the other one needs, can genuinely get stuck waiting on each other forever — a deadlock is exactly this scenario, and databases have to handle it deliberately rather than simply letting it happen.

### 🔒 What a Deadlock Is

Transaction A holds a lock on row 1 and is waiting to acquire a lock on row 2; simultaneously, Transaction B holds a lock on row 2 and is waiting to acquire a lock on row 1 — neither transaction can ever proceed, since each is waiting on a resource the other is holding and won't release until it, in turn, gets what it's waiting for.

### 🖼️ A Concrete Illustration

```sql
-- Transaction A
UPDATE accounts SET balance = balance - 100 WHERE id = 1; -- Locks row 1
UPDATE accounts SET balance = balance + 100 WHERE id = 2; -- Waits for row 2

-- Transaction B, running concurrently
UPDATE accounts SET balance = balance - 50 WHERE id = 2;  -- Locks row 2
UPDATE accounts SET balance = balance + 50 WHERE id = 1;  -- Waits for row 1
```

If both transactions' first statements run before either reaches its second, each is now waiting on a row the other holds — a genuine deadlock.

### 🔍 How MySQL Detects and Handles It

InnoDB, covered in the Introduction & Fundamentals chapter, automatically detects this exact circular-waiting condition and resolves it by choosing one transaction as the "victim" — automatically rolling it back, covered earlier in this chapter, and returning a deadlock error to that transaction's application code, letting the other transaction proceed normally.

### 🛠️ How Application Code Should Respond

Since a deadlock isn't necessarily a bug in the application's own logic, but a genuine, occasionally expected consequence of concurrent access, application code should specifically catch this deadlock error and retry the affected transaction, typically after a brief delay, rather than treating it as a permanent, unrecoverable failure.

### 💎 Good to Know: A Deadlock Is Expected, Recoverable Behavior Under Concurrency, Not a Sign of a Broken Transaction

The genuinely important framing is that a deadlock, while it sounds alarming, is a normal, anticipated possibility under sufficient concurrent access — the correct response is catching and retrying it, not treating its occurrence as evidence of a fundamentally broken transaction design.

### ❓ Follow-up Interview Questions

1. Why can't either transaction in the concrete example ever proceed once both have executed their first statement?
2. How does InnoDB actually detect that a deadlock has occurred?
3. Why does InnoDB choose one transaction as a "victim" rather than resolving a deadlock some other way?
4. Why should application code specifically catch and retry a deadlock error rather than treating it as permanent?
5. What could an application do, at the query-ordering level, to reduce the likelihood of this specific deadlock scenario occurring in the first place?

---

## 9. What is the difference between optimistic and pessimistic locking?

### 📖 Introduction

Both of these are strategies for handling concurrent access to the same row — they differ fundamentally in whether a conflict is prevented upfront or merely detected after the fact.

### 🔒 Pessimistic Locking

Acquires an actual lock on a row the moment it's read, specifically to prevent any other transaction from modifying it until the current transaction finishes — `SELECT ... FOR UPDATE` explicitly locks the selected rows, blocking any other transaction attempting to modify them until the current one commits or rolls back, covered earlier in this chapter.

### 🎲 Optimistic Locking

Doesn't acquire any lock upfront at all — instead, it assumes conflicts are rare, and checks, at the moment of actually writing a change, whether the row has been modified since it was originally read, typically using a `version` column incremented on every update. If the version has changed, the update is rejected, and the application knows a conflict genuinely occurred.

### 🖼️ A Concrete Illustration of Optimistic Locking

```sql
UPDATE products SET price = 29.99, version = version + 1 WHERE id = 1 AND version = 5;
```

If another transaction already updated this row and incremented its version past 5, this statement affects zero rows — the application checks this and knows to retry, having detected the conflict only at write time, rather than having prevented it upfront.

### ⚖️ The Trade-off

Pessimistic locking prevents conflicts outright, but reduces concurrency, since other transactions genuinely have to wait — closely tied to the deadlock risk covered in the previous question. Optimistic locking allows greater concurrency, since no one's blocked waiting, but requires the application to explicitly detect and handle conflicts when they do occur, rather than the database preventing them from ever arising in the first place.

### 💎 Good to Know: The Choice Comes Down to How Often Conflicts Actually Happen in Practice

The genuinely practical decision factor: pessimistic locking suits a scenario where conflicts are frequent and correctness matters more than raw concurrency; optimistic locking suits a scenario where conflicts are rare, letting the vast majority of transactions proceed without ever waiting on a lock at all.

### ❓ Follow-up Interview Questions

1. Why does pessimistic locking reduce concurrency compared to optimistic locking?
2. In the optimistic locking example, how does the application know a conflict actually occurred?
3. Why does optimistic locking risk more wasted work than pessimistic locking, in the case a conflict does occur?
4. How does pessimistic locking's trade-off relate to the deadlock risk covered in the previous question?
5. How would you decide, for a specific real-world feature, between optimistic and pessimistic locking?

---

## 10. How would you implement a bank-transfer operation safely using a transaction?

### 📖 Introduction

This capstone question for the chapter combines nearly every concept covered across this chapter — atomicity, consistency, isolation, locking, and deadlock avoidance — into one complete, practical implementation.

### 🏦 Step 1: Wrap Both Updates in a Transaction

```sql
START TRANSACTION;
```

Ensuring atomicity, covered earlier in this chapter — both the deduction and the addition either both succeed or both fail together.

### 🔒 Step 2: Lock Both Rows in a Consistent Order

```sql
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
SELECT balance FROM accounts WHERE id = 2 FOR UPDATE;
```

Using pessimistic locking, covered in the previous question, and always locking accounts in a consistent order (say, by ascending `id`) specifically to avoid the exact deadlock scenario covered earlier in this chapter, where two concurrent transfers between the same two accounts could otherwise lock rows in opposite orders.

### ✅ Step 3: Verify Sufficient Balance

Checking the retrieved balance is actually sufficient before proceeding — if not, `ROLLBACK`, covered earlier in this chapter, immediately, rather than applying a deduction that would violate a `CHECK (balance >= 0)` constraint, covered in the Constraints chapter.

### ✍️ Step 4: Apply Both Updates

```sql
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

Committing only once both updates have genuinely succeeded, satisfying durability, covered earlier in this chapter.

### 🛡️ Step 5: Handle a Deadlock by Retrying

Since a deadlock, covered earlier in this chapter, remains a genuine possibility even with consistent lock ordering under sufficient concurrency, application code should catch a deadlock error and retry the entire transaction from the start.

### 💎 Good to Know: This Capstone Question Is Every ACID Property and Locking Concept From This Chapter, Assembled Into One Real Implementation

The genuine skill this capstone question tests isn't any single new concept — it's combining atomicity, consistency, isolation, pessimistic locking, deadlock avoidance, and retry logic, all covered throughout this chapter, into one coherent, production-ready implementation.

### ❓ Follow-up Interview Questions

1. Why does locking both accounts in a consistent order specifically help avoid a deadlock between two concurrent transfers?
2. Why should the balance check happen before the UPDATE statements, rather than relying solely on a CHECK constraint to catch an insufficient balance?
3. Why does this implementation use `SELECT ... FOR UPDATE` rather than relying on optimistic locking, covered in the previous question?
4. What would happen if this transaction were never wrapped in a `START TRANSACTION`/`COMMIT` pair at all?
5. If asked to implement this from scratch in an interview, what's the correct order to walk through these steps?

---