---
title: Database Scalability
description: Read replicas, sharding, and scaling data layers.
sidebar_position: 3
---

# Database Scalability

## 1. Why is scaling the database typically the hardest part of scaling a web application?

### 📖 Introduction

This chapter picks up directly from the previous one's closing scenario — the database as the shared bottleneck that application-layer scaling alone can't fix.

### 🧩 Why It's Fundamentally Harder

Unlike application servers, which are stateless and can be freely added or removed as identical copies, a database holds the actual, authoritative state of the system. You can't just spin up an identical new database instance and have it "just work" the way you can with a stateless app server — every instance needs to hold the same, consistent data, and every write needs to somehow end up reflected everywhere that data is read from. Coordinating that consistency across multiple database instances is a fundamentally harder problem than horizontally scaling stateless compute.

### 💎 Good to Know: This Is Why This Entire Chapter Exists

Several techniques covered here — sharding, CQRS — deliberately trade off some consistency or simplicity specifically to make scaling possible. There's rarely a free way to scale a database the way there sometimes is for stateless application servers.

---

## 2. What's the difference between scaling a database vertically and scaling it horizontally?

### 📖 Introduction

The same vertical-versus-horizontal distinction from the first chapter of this guide applies here too, but the ceiling and the tradeoffs look different for a database specifically.

### ⬆️ Vertical

A bigger machine — more CPU, RAM, faster disk — for the same single database instance. Simple, requires no application code changes, but hits the same hard ceiling covered in the first chapter, and remains a single point of failure.

### ➡️ Horizontal

Distributing data and load across multiple database instances — replicas for reads, covered next, or shards for both reads and writes, covered later in this chapter. A genuinely more scalable ceiling, but it introduces real complexity: which instance has which data, and how they stay in sync.

### 💎 Good to Know: Teams Push Vertical Database Scaling Further Than Vertical Application Scaling

Because horizontal database scaling is so much harder than horizontal application scaling, teams typically push vertical database scaling much further before reaching for horizontal techniques, compared to how quickly they'd reach for horizontal scaling on the stateless application layer.

---

## 3. What is a read replica, and why does adding more of them scale reads but not writes?

### 📖 Introduction

The Performance Optimization guide covered read replicas briefly from a load-reduction angle — this is the scaling-specific framing.

### 🔁 What It Is

An additional database instance continuously synced, through replication, from a primary instance, capable of serving read queries.

### ✍️ Why Only Reads

A write has to be applied to the primary first, to maintain a single authoritative source of truth, and then propagated to replicas afterward. Adding more replicas doesn't change how many writes the primary itself can accept — it just adds more capacity for reading data *after* it's been written. The primary's write capacity remains a separate, unchanged ceiling regardless of how many replicas exist.

```js
// Reads go to the replica pool, writes always go to the primary
const user = await readReplica.findUser(id);
await primaryDb.updateUser(id, changes);
```

### 💎 Good to Know: This Is Exactly Why Write Scaling Is the Harder Problem

Read scaling via replicas is a relatively well-solved, common pattern. Write scaling requires a fundamentally different technique, sharding, covered later in this chapter, since you can't just add more "write replicas" the same simple way.

---

## 4. Why is scaling writes fundamentally harder than scaling reads?

### 📖 Introduction

This is the underlying reason behind the asymmetry in the previous question — worth understanding directly.

### 🔀 Why the Asymmetry Exists

Reads can be served by any replica that has a reasonably up-to-date copy of the data — multiple copies serving reads simultaneously causes no conflict, since nobody's changing anything. Writes, by contrast, need to be coordinated so the data stays consistent. If two different instances could both accept writes to the same data independently, you'd need some way to reconcile conflicts if they both tried to change the same record differently — a genuinely hard distributed-systems problem, covered in more depth in this guide's Distributed Systems chapter.

### 💎 Good to Know: This Is Why Most Systems Have Exactly One Write Path Per Piece of Data

Whether that's a single primary database, or in a sharded system, one primary per shard. Genuinely allowing multiple simultaneous writers to the same data, multi-primary replication, is possible but adds significant complexity specifically to handle the conflict-resolution problem this question describes.

---

## 5. What is database sharding, and how does it differ from adding read replicas?

### 📖 Introduction

Sharding is the technique that actually solves the write-scaling problem the previous two questions raised.

### 🔪 What It Is

Splitting the data itself across multiple independent database instances, called shards, where each shard holds a subset of the total data — users A through M on shard 1, users N through Z on shard 2, for instance. Unlike a read replica, which holds a full copy of *all* the data just for reading, each shard holds only *part* of the data, but accepts both reads and writes for its own portion.

### ✍️ How This Scales Writes

Since different shards handle different data, write load gets spread across multiple independent database instances rather than all funneling through one primary — genuinely increasing total write capacity as more shards are added, which read replicas fundamentally cannot do.

### 💎 Good to Know: Sharding Is a Much More Invasive Change Than Adding Replicas

It typically requires application-level awareness of which shard holds a given piece of data, covered in the next question. This is exactly why most teams add read replicas first, since it's simpler and addresses the more common read-heavy bottleneck, and only reach for sharding once write volume genuinely becomes the limiting factor.

---

## 6. How would you choose a shard key, and what makes it good or bad?

### 📖 Introduction

This is one of the highest-stakes decisions in a sharded system, precisely because it's so hard to change later.

### 🔑 What It Is

The specific field, or combination of fields, used to determine which shard a given piece of data belongs to — sharding by `userId`, `customerId`, or a geographic region, for instance.

### ✅ What Makes a Good Choice

A key that distributes data and load roughly evenly across all shards, avoiding the hot-shard problem covered next, and ideally, a key that most queries already naturally filter by — so a typical query can go directly to the right shard, rather than checking every shard to find the answer, a costly pattern called a "scatter-gather" query.

### ❌ What Makes a Poor Choice

A key with uneven distribution, or one that doesn't align with how data is actually queried, forcing expensive cross-shard queries or joins for common operations.

### 💎 Good to Know: This Deserves More Upfront Analysis Than Most Other Architectural Decisions

Because changing a shard key later, covered in the resharding question ahead, is so difficult, this decision deserves significantly more analysis of actual query patterns and data distribution than most other choices covered in this guide.

---

## 7. What is a "hot shard," and how does a poorly chosen shard key create one?

### 📖 Introduction

This is the concrete failure mode a bad shard key produces, and it's often invisible until real production traffic reveals it.

### 🔥 What It Is

A specific shard that receives a disproportionate amount of traffic or data compared to other shards, because the shard key doesn't distribute things evenly.

### 🎯 A Realistic Example

Sharding by geographic region when the actual user base is heavily concentrated in one region. That region's shard gets hammered with far more traffic than shards for less-populated regions, effectively negating the benefit of sharding for that specific, overloaded shard — even though the system technically "has multiple shards."

### 💎 Good to Know: This Often Only Shows Up Once Real Traffic Arrives

A shard key that looks reasonable in theory, or even in testing with synthetic, evenly distributed data, can turn out to be badly skewed once real, organic usage patterns emerge — directly echoing the Performance Optimization guide's "fast locally, slow in production" data-distribution theme.

---

## 8. Why is resharding an already-sharded, already-in-production database such a risky operation?

### 📖 Introduction

This is exactly why the shard-key decision earlier in this chapter carries so much weight — the cost of getting it wrong shows up here.

### ⚠️ Why It's Hard

Resharding means changing how data is distributed across shards — adding more shards, or fixing a hot-shard problem. This requires physically moving existing data from its current shard to a new one, for a potentially enormous volume of already-live production data, all while the system continues to receive real reads and writes for that same data during the migration.

### 💥 The Risk

Getting this wrong can mean data appears to be missing, queries looking in the old shard location after data has already moved, duplicate writes, or a period of degraded consistency or availability during the migration window. This is widely considered one of the riskiest, most operationally complex procedures in database administration.

### 💎 Good to Know: This Is Exactly Why Choosing a Shard Key Carefully Upfront Matters So Much

The cost of getting it wrong isn't just a slightly suboptimal choice — it's potentially a genuinely dangerous, high-stakes migration later to fix it. The same "retrofitting is harder than designing for it" theme from earlier in this guide and the Web Security guide, now at its most costly in this specific context.

---

## 9. What is replication lag, and how can it cause a scaled read-replica setup to serve inconsistent data?

### 📖 Introduction

The Performance Optimization guide's database chapter touched on this briefly — here's the scaling-consequence angle specifically.

### ⏳ What It Is

The small but real delay between a write landing on the primary and that same change actually becoming visible on a replica.

### ⚠️ How It Causes Inconsistency at Scale

With many replicas serving read traffic, the entire point of read replicas, a user's request could get routed to a replica that hasn't yet received a recent write — seeing stale, outdated data, even though the write technically already succeeded moments earlier on the primary.

### 💎 Good to Know: This Is a Concrete, Everyday Example of Eventual Consistency

This guide's Distributed Systems chapter covers eventual consistency more formally, but read-replica lag is genuinely one of the most common, everyday ways a working engineer actually encounters it in practice — even before learning the more formal distributed-systems vocabulary for it.

---

## 10. How would you handle a "read your own write" scenario in a system that routes reads to replicas?

### 📖 Introduction

This is a specific, common, user-facing consequence of the replication lag covered in the previous question — and a great illustration that read replicas aren't a completely free win.

### 😕 The Scenario

A user submits a change, updates their profile, say, and is immediately redirected to a page that reads that same data back. If that read gets routed to a replica that hasn't caught up yet, the user sees their own change appear to have failed or reverted — a confusing, broken-feeling experience even though nothing actually went wrong.

### 🛠️ Solutions

Route reads immediately following a write from the same user or session back to the primary specifically, at least for a short window, rather than the replica pool. Or track a "read your own write" token or timestamp, and have the replica wait until it's caught up to at least that point before answering — some managed database services offer this as a built-in read-consistency option.

### 💎 Good to Know: This Shows Why "Just Add Read Replicas" Isn't Completely Free

This introduces a real user-experience edge case that has to be deliberately handled, not just an abstract consistency concern that only matters in theory.

---

## 11. What is CQRS, and how can separating reads from writes help a system scale?

### 📖 Introduction

This is a more significant architectural commitment than read replicas alone, but it solves a related problem more thoroughly.

### 🔀 What It Is

Command Query Responsibility Segregation — architecturally separating the model and path used for writes, commands, from the model and path used for reads, queries, rather than using the same data model and database for both.

### 📈 How It Helps Scaling

The read side and write side can be scaled, optimized, and even stored completely independently of each other. The read model can be shaped or denormalized, covered in the Performance Optimization guide's database chapter, specifically for fast querying, even using an entirely different database technology, covered in the next question's polyglot persistence discussion — while the write model stays focused on correctly validating and persisting changes, without needing to compromise its structure to also serve read-query performance.

### 💎 Good to Know: A Real Commitment, Not a Default Choice for Every Application

The read model now needs to be kept in sync with the write model, adding its own consistency-lag considerations similar to the read-your-own-write question earlier in this chapter. CQRS is appropriate for systems with genuinely different, demanding read-versus-write scaling needs, not a default reached for regardless of whether that mismatch actually exists.

---

## 12. What is polyglot persistence, and why might a large-scale system use more than one type of database?

### 📖 Introduction

Forcing every kind of data into one database technology is a common default that a large-scale system often deliberately moves away from.

### 🗃️ What It Is

Using more than one type of database or data store within the same overall system, each chosen for what it's specifically good at, rather than forcing every kind of data into one single technology.

### 🎯 A Realistic Example

A relational database for transactional, structured data like orders and payments. A document or NoSQL store for flexible, high-volume data like activity logs or product catalogs. A search-specialized engine for full-text search. Redis for caching and session data, covered in the Web Security guide. Each chosen because it's genuinely better suited to that specific access pattern than a one-size-fits-all choice would be.

### 💎 Good to Know: This Pairs Naturally With CQRS

A common real-world pairing is using the read-optimized side of a CQRS split with a different database technology than the write side — precisely because the read and write access patterns genuinely benefit from different underlying technology, not just different scaling treatment.

---

## 13. How does connection pool sizing become a scalability bottleneck once you have many horizontally scaled application instances?

### 📖 Introduction

This connects directly to the connection pooling discussions in the Performance Optimization guide, but here specifically it's the multiplied, at-scale version of the problem.

### ⚠️ The Problem

Each application instance typically maintains its own connection pool to the database. As you horizontally scale the application layer, covered in the previous chapter, to say 20 instances, each with a pool of 20 connections, that's potentially 400 total simultaneous connections hitting the database — which can easily exceed the database's own configured connection limit, even if each individual instance's pool size seems perfectly reasonable in isolation.

### 💎 Good to Know: This Gotcha Only Appears Once the Application Layer Has Already Scaled Out

A pool size that was perfectly fine with 3 application instances can silently become a problem once that number grows to 20 — exactly why connection pool sizing needs to be reconsidered as part of any application-layer scaling decision, not configured once and forgotten.

---

## 14. Why can adding a cache in front of a database mask a scalability problem rather than actually solve it?

### 📖 Introduction

This is a real risk worth understanding before leaning too heavily on caching as the answer to database scaling.

### 🎭 The Risk

A cache, covered in the next chapter, sitting in front of the database can absorb enough read traffic that the database's own underlying scalability limits never get genuinely tested or exposed. The system appears to "scale fine" simply because most requests never actually reach the database at all.

### 💥 Why This Is Risky

The moment the cache misses at scale — a cache outage, a cache stampede covered in the Performance Optimization guide's caching chapter, or simply more unique data than the cache can hold — the full, un-mitigated load hits the database all at once, and its actual, never-before-tested capacity limit gets discovered in the worst possible way: during a real production incident, rather than a planned capacity-planning exercise.

### 💎 Good to Know: Load Testing Should Specifically Include a Cache-Bypassed Scenario

Confirming the database's own standalone capacity is understood and adequate, rather than just assuming "we're fine" based on observed performance that's secretly dependent on the cache never failing.

---

## 15. What's the tradeoff between a managed database service and manually managing sharding and replication yourself?

### 📖 Introduction

This is a genuine, deliberate build-versus-buy decision, and it's worth weighing honestly rather than defaulting to either extreme.

### ☁️ Managed Service

A cloud provider's managed database offering, which can automatically provision read replicas, handle failover, and in some cases even automate sharding, trades direct control and potentially some cost efficiency for a genuinely significant reduction in operational burden. The team doesn't need deep, specialized expertise in manually configuring and monitoring replication and sharding themselves.

### 🛠️ Self-Managed

Full control over exactly how scaling is configured — potentially more cost-efficient at genuinely large scale, or necessary for highly specific requirements a managed service doesn't support — but requires the team to genuinely understand and correctly implement everything covered in this chapter themselves, including high-risk operations like resharding.

### 💎 Good to Know: The Riskiest Operations Are Exactly What You Want a Specialist Handling

For the vast majority of teams, a managed service's automatic scaling capabilities are worth the tradeoff, specifically because resharding and similar high-risk operations are exactly the kind of thing you want a provider with deep, specialized operational experience handling, rather than a team's first attempt at it happening directly against production data.

---

## 16. In production, your application servers scale out fine under load, but the database becomes the bottleneck — walk through your options.

### 📖 Introduction

This closes the chapter with the practical decision point everything above has been building toward.

### 📋 Options, Roughly in Order of Increasing Complexity and Risk

First, confirm it's genuinely a database capacity issue and not a missing or inefficient query — a missing index might look like a "scaling" problem but is actually a much cheaper fix, covered in the Performance Optimization guide's database chapter. Then, vertical scaling of the database itself, the simplest option if there's still headroom. Then, add read replicas if the workload is genuinely read-heavy, the most common real-world pattern. Then, add a caching layer, with the earlier caveat in this chapter about still understanding true database capacity underneath it. And only once these are genuinely exhausted, consider sharding specifically for a write-bound bottleneck, given its significant complexity and risk covered throughout this chapter.

### 💎 Good to Know: Database Scaling Is a Progression, Not a Single Decision

Jumping straight to sharding, the most complex, hardest-to-reverse option, without first exhausting the simpler, lower-risk options earlier in this list is a common, avoidable mistake — directly echoing the first chapter's "identify the actual bottleneck, and match the response to it" theme one more time.
