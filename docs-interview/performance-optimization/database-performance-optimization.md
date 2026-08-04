---
title: Database Performance Optimization
description: Slow queries, indexing, and query plan analysis.
sidebar_position: 4
---

# Database Performance Optimization

## 1. What is a database index, and why does it speed up reads at the cost of slower writes?

### 📖 Introduction

Indexing is the single most impactful lever covered in this chapter, and nearly every other question here connects back to it in some way.

### 📇 What It Is

A separate, auxiliary data structure, commonly a B-tree, that the database maintains alongside a table or collection, letting it look up records matching a specific value without scanning every single one — a "full collection scan." Similar to an index at the back of a book letting you jump straight to a page instead of reading the whole thing to find a topic.

```js
db.users.createIndex({ email: 1 });
```

### ✍️ Why Writes Get Slower

Every time a record is inserted, updated, or deleted, the database must also update every index that covers the changed fields, to keep them accurate. More indexes means more of this bookkeeping on every write — which is exactly why indexing is a deliberate tradeoff, faster targeted reads at the cost of some write overhead, not a "the more the better" decision.

### 💎 Good to Know: This Is Big-O From the First Chapter, in Concrete Form

An index turns a lookup that would otherwise be O(n) — scan everything — into something closer to O(log n) — a tree traversal. That's exactly why the difference is invisible on a tiny test dataset and dramatic on a large production one, the same theme introduced with Big-O in the very first chapter of this guide.

---

## 2. How would you use `EXPLAIN` to figure out why a specific query is slow?

### 📖 Introduction

This is arguably the single most important diagnostic tool in this entire chapter — nearly every other topic here is something `EXPLAIN` will directly reveal.

### 🔍 What It Shows

The database's actual execution plan for a specific query: whether it used an index at all, and which one, how many records it had to actually *examine* versus how many it ultimately *returned*, and the relative cost of each stage if the query involves multiple steps, like a join or a sort.

### 🚩 How to Use It to Diagnose Slowness

A large gap between records examined and records returned — scanning a million rows to return ten — is a strong signal that an index is missing, or not being used, for that query's filter condition. A full collection scan (`COLLSCAN` in MongoDB, or an equivalent "full scan" indicator in a SQL engine's plan) is usually the single clearest red flag in the output.

```js
db.orders.find({ customerId: "abc123" }).explain("executionStats");
// look for: totalDocsExamined vs. nReturned, and whether an index was used at all
```

### 💎 Good to Know: This Should Be the Default First Step for Almost Any Slow-Query Investigation

Missing indexes, N+1 patterns, and unindexed foreign keys — all covered later in this chapter — are each something `EXPLAIN` directly surfaces, which is exactly why it's worth reaching for before guessing at a fix.

---

## 3. What is the N+1 query problem, and how does it typically sneak in through an ORM's lazy-loading behavior?

### 📖 Introduction

The Backend Performance Optimization chapter covers this same problem at the API level — this is where it most commonly actually originates, inside the ORM or ODM layer itself.

### 🔁 What It Is

Fetching a list of parent records, then having the ORM automatically fire off a separate query for each parent's related data the moment the code accesses that relation — rather than fetching everything needed in one combined query upfront.

### 🕵️ How It Sneaks In Through Lazy Loading

An ORM's lazy-loading default means related data isn't fetched until the code actually touches that property. This is convenient, and often completely invisible in code review — looping over a list and accessing `post.author.name` *looks* like a harmless property access, not an obviously triggered new database query, but under lazy loading it silently fires one per iteration.

```js
// N+1: fires a separate lookup for every post's author
const posts = await Post.find();
for (const post of posts) {
  console.log(post.author.name); // triggers a query, N times
}

// Fixed: related data fetched upfront, in one combined query
const posts = await Post.find().populate("author");
```

### 💎 Good to Know: The Same Problem as the API-Level N+1, Just One Layer Down

This is the exact same underlying problem as the API/service-level N+1 covered in the Backend Performance Optimization chapter, just occurring inside the ORM/ODM layer specifically. The fix — eager-load or batch upfront — is conceptually identical in both places.

---

## 4. Why is fetching every field of a document or row generally discouraged, even on a small dataset?

### 📖 Introduction

This habit costs almost nothing to notice on a small table, which is exactly why it's worth building deliberately rather than only after it starts hurting.

### ⚠️ Why It's Discouraged

Fetching unnecessary fields wastes bandwidth between the database and application server, wastes memory holding data that's never used, and, specifically for a large field like a big text blob or an inline binary attachment, can make an otherwise fast query notably slower for no benefit at all. None of this is visible on a small test table with a handful of narrow columns — which is exactly why the habit matters *more* as data grows, not less.

```js
// Fetches every field, including ones this code never uses
const user = await User.findById(id);

// Fetches only what's actually needed
const user = await User.findById(id).select("name email");
```

### 💎 Good to Know: This Sets Up Whether a Covering Index Is Even Possible

This connects directly to the covering index concept covered later in this chapter — requesting only the fields actually needed is sometimes exactly what makes it *possible* for a query to be satisfied entirely from an index, without ever touching the full document at all.

---

## 5. Why does deep pagination get progressively slower, and what's a more efficient alternative?

### 📖 Introduction

Pagination looks like a solved problem until a user reaches page 500 — this is exactly where the standard approach quietly starts to break down.

### 🐌 Why Offset-Based Pagination Slows Down

`OFFSET 100000 LIMIT 20`, or MongoDB's `.skip(100000)`, still requires the database to walk through and discard the first 100,000 matching records before it can even start returning the next 20. The deeper the page, the more wasted work spent scanning past records that will never actually be returned to the client.

### 🎯 The Cursor-Based Alternative

Instead of an offset number, use the last item's own unique, sortable value from the previous page — its ID, or a timestamp — as the starting point for the next query.

```js
// Offset-based: gets slower the deeper you paginate
db.posts.find().sort({ _id: 1 }).skip(100000).limit(20);

// Cursor-based: jumps directly to the right spot using an index
db.posts.find({ _id: { $gt: lastSeenId } }).sort({ _id: 1 }).limit(20);
```

This lets the database jump directly to the right starting point using an index, without ever scanning and discarding everything before it.

### 💎 Good to Know: Cursor-Based Pagination Has Its Own Real Tradeoff

It doesn't easily support jumping to an arbitrary page number — "go to page 47" specifically — only "next" or "previous" relative to a known position. A reasonable tradeoff for most infinite-scroll-style interfaces, less suited to a traditional numbered pagination UI.

---

## 6. What is denormalization, or embedding data in a document database, and what tradeoff does it involve?

### 📖 Introduction

This is one of the more deliberate, consequential schema decisions a team makes, and it's worth understanding both sides of the tradeoff clearly.

### 🔗 What It Solves

Normalized, or referenced, data — keeping related data in separate collections or tables linked by an ID — requires a join or a separate lookup to reassemble related information at read time. Denormalizing, by duplicating some data directly where it's needed, or embedding related data directly inside a parent document in MongoDB, lets a read fetch everything it needs in one single operation, with no join or lookup at all.

### ⚖️ The Cost

Duplicated data has to be kept in sync everywhere it's duplicated whenever the underlying value changes. An author's name embedded inside ten thousand of their posts means updating their name requires updating, or accepting staleness in, all ten thousand copies — a genuine, deliberate consistency-versus-read-speed tradeoff, not a free win.

### 💎 Good to Know: A Practical Rule of Thumb for When to Embed

Data that's read together frequently and changes rarely is a good embedding candidate. Data that changes frequently, is large or unbounded in size, or is accessed independently of its "parent" just as often as together with it, is usually better left as a separate, referenced collection.

---

## 7. What is a compound index, and why does field order matter?

### 📖 Introduction

Having "an index" on the right fields isn't automatically enough — the order those fields are declared in changes what the index can actually do.

### 📚 What It Is

A single index built across multiple fields together, rather than one separate index per individual field.

### 🔢 Why Field Order Matters

A compound index is really one combined, sorted structure, ordered first by the first field, then by the second field within each value of the first, and so on. It can efficiently support a query filtering on just the first field, or the first and second together — but generally can't efficiently support a query that filters only on the second field while skipping the first. Similar to a phone book sorted by last name then first name: efficient for searching by last name, useless for searching by first name alone.

```js
db.orders.createIndex({ customerId: 1, createdAt: -1 });
// Helps: queries filtering on customerId, or customerId + sorting by createdAt
// Doesn't help: a query filtering only on createdAt
```

### 💎 Good to Know: `EXPLAIN` Is What Reveals Whether the Order Actually Matches Real Queries

This is a common, easy-to-get-wrong detail — the index existing isn't enough if its field order doesn't match how the fields are actually queried together. `EXPLAIN`, from earlier in this chapter, is exactly the tool that reveals whether a compound index is genuinely being used effectively for a specific query shape.

---

## 8. What's the performance risk of running many small individual queries in a loop instead of one batched query?

### 📖 Introduction

This is a close cousin of the N+1 problem covered earlier in this chapter — same underlying cost, different, often more innocent-looking origin.

### ⚠️ The Risk

Running N separate insert, update, or lookup queries inside a loop, one at a time, instead of a single batched operation covering all N records at once. Each individual query incurs its own round-trip latency and its own separate parsing and execution overhead on the database side — the total cost scales roughly linearly with N, dominated by per-query overhead rather than the actual work being done.

```js
// One round trip per item — overhead multiplied by N
for (const item of items) {
  await Order.create(item);
}

// One round trip total
await Order.insertMany(items);
```

### 💎 Good to Know: This Is N+1's Close Cousin, Without Even the Excuse of Related Data

This is the same "count your round trips" instinct behind the N+1 problem earlier in this chapter — it's often just a habit carried over from writing simple, one-item-at-a-time code, without stopping to consider the batch case that was actually available all along.

---

## 9. What is a slow query log, and how would you use it to find the worst-performing queries in production?

### 📖 Introduction

Rather than guessing which query is causing trouble, or waiting for a specific complaint, this tool surfaces the worst offenders directly from real traffic.

### 📋 What It Is

A database feature that records queries exceeding a configured duration threshold — or, in MongoDB's case, the built-in database profiler — specifically so the worst-performing queries in a production system can be found and reviewed.

### 🔍 How to Use It

Enable it with a reasonable threshold, such as logging anything over 100ms, let it run against real production traffic for a representative period, then review the results for queries appearing most frequently and taking the most cumulative time. A query that's individually only "somewhat" slow but runs thousands of times a day can be a bigger overall problem than a rare query that's very slow but runs once a week.

### 💎 Good to Know: This Is What Turns "The Database Feels Slow" Into an Actionable List

This connects directly to the p95/p99 discussion in the first chapter, and to the monitoring practices covered in this guide's final chapter — it's exactly the kind of data that turns a vague complaint into a specific, prioritized list of queries to actually fix, the "measure, don't guess" theme running throughout this whole guide.

---

## 10. What is a read replica, and how does it reduce load on the primary database?

### 📖 Introduction

For a typical web application where reads vastly outnumber writes, this is one of the more common ways to scale database capacity without changing any application logic.

### 🔁 What It Is

One or more additional database instances that continuously stay in sync with the primary database through replication, capable of serving read queries, while all writes still go exclusively to the primary.

### 📉 How It Reduces Load

Routing read-heavy traffic to one or more replicas frees up the primary database's resources specifically for handling writes, and whatever reads genuinely need to see the absolute latest data — spreading overall read load across multiple machines instead of concentrating everything on one.

### 💎 Good to Know: Replication Lag Is a Real Consistency Tradeoff

Replication isn't instantaneous — there's a small, real delay between a write landing on the primary and that change becoming visible on a replica. A read immediately following a write, routed to a replica, can occasionally return stale data for a brief window. This has to be consciously accounted for — routing a "read your own write" scenario specifically back to the primary, for instance — rather than assumed away.

---

## 11. What is connection pool exhaustion, and what symptoms would you see in production?

### 📖 Introduction

This is a database-adjacent problem that can look, at first glance, exactly like a slow database — worth knowing how to tell the two apart.

### 🏊 What It Is

Every connection pool, covered in the Backend Performance Optimization chapter, has a maximum configured size. If the application tries to acquire more simultaneous connections than that maximum allows — a spike in concurrent traffic, or requests holding onto their connection far longer than normal, due to a slow query somewhere else — new requests needing a connection have to wait for one to free up, or fail outright once a configured timeout is hit.

### 🚨 Symptoms in Production

Request latency climbing not because the actual database queries got slower, but because requests are stuck waiting in a queue just to get a connection to run their query in the first place. Timeout errors specifically mentioning connection acquisition, distinct from a query timeout. The problem often gets worse under exactly the traffic conditions — spikes — when performance matters most.

### 💎 Good to Know: This Can Masquerade as "The Database Is Slow" When It Isn't

The actual root cause here is upstream of the database entirely — a pool sized too small for real traffic, or a slow query elsewhere holding connections open longer than it should. A good reminder to check pool metrics specifically, not just raw query performance, when diagnosing database-adjacent slowness.

---

## 12. How can an ORM's default behavior quietly hurt performance without the code looking wrong?

### 📖 Introduction

An ORM's whole appeal is hiding the underlying query mechanics — which is exactly what makes its performance cost so easy to miss just from reading the code.

### 📦 Eager-Loading Everything by Default

Some ORMs default to fetching all related data on every query unless explicitly told not to. Convenient for avoiding the N+1 problem covered earlier in this chapter in the common case, but it can mean a simple "get this one record" call silently pulls in a large amount of related data the current code path never actually needed — real, invisible overhead behind what looks like a trivial query.

### ⚙️ Inefficient Generated Queries

An ORM's query-builder abstraction can generate a technically correct but genuinely inefficient underlying query — an unnecessary subquery, a suboptimal join order, fetching more than needed to satisfy a filter chain — that isn't obvious just from reading the clean, high-level ORM code that produced it.

### 💎 Good to Know: This Is Exactly Why `EXPLAIN` Matters Even When You Never Write Raw Queries

The ORM code you actually wrote can look perfectly clean and reasonable while still generating something genuinely inefficient underneath. Trusting the abstraction completely, without ever checking what it actually generates via `EXPLAIN`, is a real, common source of silent performance problems.

---

## 13. What is a covering index, and how does it let a query avoid touching the underlying documents?

### 📖 Introduction

This is the natural next step once you're already selecting only the fields a query actually needs.

### 📇 What It Is

An index that includes all the fields a specific query actually needs — not just the fields being filtered on, but every field being returned in the result. This means the database can answer the entire query using only the index itself, without ever needing to fetch the full underlying document or row.

```js
db.users.createIndex({ email: 1, name: 1 });
// A query filtering by email and returning only name is fully covered —
// never touches the full document at all
db.users.find({ email: "a@example.com" }, { name: 1, _id: 0 });
```

### ⚡ Why This Matters for Performance

Reading from an index, already a compact, sorted structure, is faster than reading the index and then doing an additional lookup into the full document to retrieve the remaining requested fields. A covering index eliminates that second lookup step entirely.

### 💎 Good to Know: Requesting Extra Fields Can Silently Defeat a Covering Index

This connects directly to the earlier question in this chapter about avoiding unnecessary fields — requesting even one field the index doesn't include forces the database to fall back to the slower "index lookup plus full document fetch" path, even when a seemingly relevant index already exists.

---

## 14. Why does an unindexed foreign key or reference field commonly cause slow lookups as a collection grows?

### 📖 Introduction

This is a genuinely easy, common oversight, precisely because it's easy to assume the database handles this automatically.

### ⚠️ Why It Happens

A foreign key or reference field is, by definition, going to be used constantly to look up related records — finding all orders for a specific customer, all comments on a specific post. Without an index on that field, every one of these lookups requires scanning the entire related collection to find matching rows, an increasingly expensive operation as that collection grows, even though the field's whole purpose makes it one of the most heavily queried fields in the entire schema.

### 🎯 A Realistic Example

A `comments` collection with a `postId` field but no index on it. Fetching "all comments for this post," an extremely common, core operation, forces a full scan of the entire comments collection every single time, regardless of how many comments actually exist for any specific post.

### 💎 Good to Know: Primary Keys Are Usually Auto-Indexed — Foreign Keys Usually Aren't

Many databases automatically index a primary key by default, but do not automatically index foreign key or reference fields on the "many" side of a relationship. It's easy to assume "the database handles indexing the important stuff automatically" — in practice, foreign keys specifically often need to be indexed manually and deliberately.

---

## 15. What's the performance impact of filtering or aggregating data in application code instead of letting the database do it?

### 📖 Introduction

This is a common pattern among developers more comfortable writing application code than database-specific query syntax — and it has a real, growing cost.

### ⚠️ The Risk

Fetching a large amount of raw data from the database and then filtering, sorting, or aggregating it in application code afterward, instead of letting the database do that work as part of the query. This transfers far more data over the network than actually needed, and does the computational work in a general-purpose application runtime instead of a database engine specifically optimized and indexed for exactly this kind of operation.

### 🎯 A Realistic Example

Fetching every order for a customer and summing the total in a JavaScript loop, instead of using a database-level aggregation that computes the same total without ever transferring the individual order documents to the application at all.

```js
// Transfers every order, then sums in application code
const orders = await Order.find({ customerId });
const total = orders.reduce((sum, o) => sum + o.amount, 0);

// The database computes and returns just the total
const [{ total }] = await Order.aggregate([
  { $match: { customerId } },
  { $group: { _id: null, total: { $sum: "$amount" } } },
]);
```

### 💎 Good to Know: This Gap Looks Fine in Development and Becomes Real in Production

Reaching for a familiar loop in JavaScript feels more natural than learning aggregation pipeline syntax — but the performance cost of doing it "the comfortable way" grows directly with data size, exactly the kind of gap that's invisible in development and becomes a genuine problem once production data volume arrives.

---

## 16. How would you decide whether a slow query needs a new index, a rewritten query, or a schema change?

### 📖 Introduction

Each of these fixes solves a different underlying cause, and applying the wrong one wastes effort without actually fixing the problem.

### 📇 A New Index

Appropriate when `EXPLAIN` shows a full scan, or a high examined-versus-returned ratio, for a query filtering or sorting on fields that aren't currently indexed, or aren't covered by an existing compound index in the right order. The query's logic itself is fine — the database just has no efficient path to the data yet.

### ✏️ A Rewritten Query

Appropriate when the query is doing something genuinely wasteful regardless of indexing — fetching far more fields than actually needed, filtering in application code that the database could do more efficiently itself, or structured in a way that defeats an index that would otherwise help, like wrapping an indexed field in a function call inside a filter condition.

### 🏗️ A Schema Change

Appropriate when the fundamental data model itself is the actual bottleneck — a relationship requiring constant, expensive lookups might genuinely be better served by embedding, covered earlier in this chapter, or a field queried constantly in a way its current type doesn't support efficiently needs a more fundamental restructuring, not just a new index or a cleverer query.

### 💎 Good to Know: `EXPLAIN` Is Again the Tool That Tells You Which Category Applies

A full scan on an unindexed field points toward "add an index." A scan that's technically using an index but still examining far more than it returns often points toward "the query or schema itself needs rethinking," not just another index layered on top.

---

## 17. In production, a query that's fast locally with test data becomes extremely slow in production — what would you investigate first?

### 📖 Introduction

This closes the chapter with one of the most common, and most instructive, real-world gaps in database performance.

### 📈 Why This Gap Happens

By far the most common cause is simply data volume. A local database with a few hundred rows makes even a badly indexed query feel instant, since a full scan of a few hundred records is trivially fast regardless. The same query against a production database with millions of rows exposes the missing index or inefficient pattern that was always there, just invisible at small scale — directly the Big-O point from the first chapter: the difference between O(n) and O(log n) is meaningless at a few hundred records and dramatic at a few million.

### 🕵️ Other Possible Causes

Production data distribution differing from test data in a way that matters — test data evenly distributed while production has a few "hot," disproportionately large records or users that make a specific query path far more expensive for them specifically. Production under real concurrent load, competing for the same connection pool and actual CPU/disk resources, in a way a solo local test never experiences. A compound index existing, but the production query pattern not actually matching its field order the way the local test query happened to.

### 🔍 Investigation

Run `EXPLAIN` against the actual production query, with actual production-scale data, not locally against a small dataset. Check the slow query log to confirm this specific query is a consistent, repeat offender rather than a one-off. Compare production data volume and distribution against whatever local testing was actually using.

### 💎 Good to Know: "Fast on My Machine" Is Close to Meaningless for Database Performance Specifically

Unlike some other kinds of bugs, data volume is often the single biggest hidden variable separating a fine local experience from a genuinely broken production one — and it's very rarely something local development naturally replicates without deliberate effort, like seeding a realistically sized test dataset or testing directly against a production-scale replica.
