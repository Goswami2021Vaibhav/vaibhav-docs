---
title: Database Scenarios
description: Real database incidents and how to reason through them.
sidebar_position: 2
---

# Database Scenarios

## 1. Database CPU usage suddenly spikes to 100% and stays there — walk through how you'd figure out what's actually driving it.

### 📖 Introduction

A pegged CPU is a symptom, not a diagnosis — the whole point of this scenario is finding what's actually consuming it.

### 🔍 Where to Look First

Your database's built-in tooling for currently running queries — most databases can show you exactly what's executing right now, including how long each query has been running. A single expensive query, an unindexed scan over a large table for example, running repeatedly, is a far more common cause of a sustained spike than genuine, gradual traffic growth.

### 🧭 Narrowing It Down

Check whether the spike lines up with a recent deploy that introduced a new or changed query, a scheduled job like a report or backup running at an unexpected time, or a genuine, organic increase in traffic. Sorting currently running or recently completed queries by execution time or frequency usually surfaces the actual culprit quickly.

### 💎 Good to Know: A Single Bad Query Is a More Common Cause Than "Too Much Traffic"

It's tempting to jump straight to "we need to scale the database," but a genuinely large fraction of real CPU spikes trace back to one specific expensive query, often introduced recently — worth ruling out before reaching for the more expensive, slower fix of scaling infrastructure, covered generally in the Scalability guide's Database Scalability chapter.

---

## 2. A query that used to run in milliseconds is now taking seconds, and nothing in the query itself has changed — what would you investigate?

### 📖 Introduction

If the query is genuinely unchanged, the explanation has to be something around the query, not in it.

### 🔍 What Could Have Changed Instead

The data itself — the table has simply grown large enough that a query relying on a full or partial scan now has meaningfully more rows to get through than it used to. The query plan the database is choosing — databases periodically re-evaluate the most efficient way to execute a given query based on current data statistics, and can switch to a worse plan even for an unchanged query if those statistics are stale or the data's shape has shifted. Contention — other queries or transactions competing for the same rows or resources at the same time, whereas before there was little competition.

### 🧭 How to Confirm

Look at the query's actual execution plan now versus what it likely was before — most databases have an "explain" command for exactly this — to see whether it's still using the index you'd expect, or whether it's fallen back to a slower scan.

### 💎 Good to Know: "Nothing Changed" Usually Means "Nothing Changed in the Code"

The data, the volume, and the database's internal query-planning decisions are all genuinely capable of changing without a single line of query code changing — this is a useful reminder that "the query" and "the query's actual performance" are not the same fixed thing over time.

---

## 3. You discover a table is missing an index that would obviously help a slow, frequently run query — what would you check before just adding it in production?

### 📖 Introduction

Adding an index sounds like an unambiguous win, but it isn't free, which is exactly what this question is testing.

### ⚠️ What to Check First

The size of the table — creating an index on a very large, actively written-to table can itself be a slow, resource-intensive operation, and depending on the database, may lock the table or degrade write performance while it builds. Whether the database supports building the index without blocking normal reads and writes, a feature many databases offer specifically for this situation, and whether that's actually being used. The tradeoff an index always carries — it speeds up reads on the indexed column, but adds overhead to every future write to that table, since the index itself has to be updated too.

### 🧭 How to Roll It Out Safely

Build the index during a lower-traffic window if a blocking build is unavoidable, or use the non-blocking build option if the database supports one, and monitor write performance afterward to confirm the added index isn't meaningfully hurting write-heavy paths that use the same table.

### 💎 Good to Know: An Index Is a Read/Write Tradeoff, Not a Free Win

This is the same underlying tradeoff covered generally in the Performance Optimization guide's database chapter — indexes make specific reads faster at a real, ongoing cost to writes, which is exactly why "just add an index" isn't always the automatically correct answer for every slow query.

---

## 4. A migration that adds a new column to a large, actively used table needs to run in production — how would you approach this without causing an outage?

### 📖 Introduction

The risk here is the same shape as the previous question's indexing risk — a schema change on a large table can itself become the incident.

### ⚠️ Why This Is Risky

Depending on the database and the exact nature of the change, adding a column can require rewriting the entire table or holding a lock that blocks reads or writes for the duration — on a large, actively used table, that duration alone can be long enough to cause a real, user-facing outage.

### 🧭 How to Approach It Safely

Check whether the specific database and change actually require a full table rewrite, since some databases can add a column, especially one with no default value or a nullable one, as a fast, metadata-only change, while others can't. If a slower operation is unavoidable, run it during the lowest-traffic window available, and consider whether the database offers an online/non-blocking schema-change mechanism. For genuinely large or risky changes, a common, safer pattern is to add the new column first, backfill its data gradually in small batches rather than all at once, and only enforce any constraints on it, like "not null," once the backfill is confirmed complete.

### 💎 Good to Know: This Same Concern Applies to the Later Backfill Scenario in This Chapter

The "add first, backfill gradually, enforce constraints last" pattern described here is the same general approach the later large-data-backfill question in this chapter expands on — both are about spreading out a risky, large-scale database change over time instead of doing it all in one risky operation.

---

## 5. Two different services are writing to the same table and occasionally overwriting each other's updates — how would you diagnose and fix this?

### 📖 Introduction

This is a race condition at the data layer, and the fix depends on understanding exactly what "overwriting" means in this specific case.

### 🔍 Diagnosing It

Confirm the actual sequence of events — two writes happening close enough together in time that the second one overwrites the first one's change, with the first update effectively lost. This typically requires looking at both services' logs around the same timestamps to reconstruct which write happened first and what each one was actually trying to set.

### 🔧 How to Fix It

If both services are meant to update different pieces of the same row, the real fix is usually updating only the specific fields each service owns, rather than reading the whole row, changing one field, and writing the whole row back — that read-modify-write pattern is exactly what causes one service's write to silently clobber the other's more targeted change. If genuine conflicting writes to the same field from two sources are expected, consider optimistic concurrency control — a version number or timestamp on the row that a write must match, causing it to fail and retry rather than silently overwrite if the row changed since it was last read.

### 💎 Good to Know: This Is a Small-Scale Instance of a Distributed-Systems Problem

Two independent services writing to shared state is the same underlying category of problem covered more generally, at a larger scale, in the Scalability guide's distributed systems chapter — the tools that solve it, versioning, targeted updates instead of whole-row overwrites, are smaller-scale versions of the same ideas.

---

## 6. Your application starts throwing "too many connections" errors against the database during a traffic spike — what's actually happening, and how would you address it?

### 📖 Introduction

This error is the database explicitly telling you it has a hard limit that's just been reached — worth understanding exactly what that limit is.

### 🔍 What's Actually Happening

Every database has a maximum number of simultaneous connections it can hold open at once. During a traffic spike, if your application is opening a new connection per request, or has a connection pool sized too small for the increased concurrent load, or has connections leaking, opened but never properly released, the total number of open connections can hit that hard ceiling, and the database starts outright rejecting any further connection attempts.

### 🔧 How to Address It

Check whether your application is using a properly sized connection pool at all, reusing existing connections rather than opening a fresh one per request — a pool is almost always the correct pattern, and its absence is a common root cause of this exact error. If a pool is already in place, check whether connections are being properly released after use, since a leak will exhaust even a well-sized pool over time. If the pool and release logic are both genuinely correct and the traffic level itself is the real driver, consider whether the database's connection limit itself needs to be raised, or whether a connection pooler sitting in front of the database would let more application instances share a smaller number of actual database connections.

### 💎 Good to Know: More Application Servers Can Make This Worse, Not Better

Scaling out your application layer by adding more server instances, a natural first instinct during a traffic spike, covered generally in the Scalability guide, can actually make a connection-limit problem worse if each new instance brings its own connection pool — the total connection count across all instances combined is what actually matters against the database's fixed limit.

---

## 7. A read replica used for reporting queries starts showing data that's minutes behind the primary — how would you explain this to a confused stakeholder, and what would you check?

### 📖 Introduction

This scenario has two parts — explaining an inherent, expected characteristic of replication, and confirming the actual delay isn't itself abnormal.

### 🗣️ How to Explain It

A read replica works by continuously receiving and applying a stream of changes from the primary database, and there's always some small, genuinely inherent delay between a write landing on the primary and that same write being fully applied on the replica — this is called replication lag, and some amount of it is a completely normal, expected characteristic of how replication actually works, not a bug.

### 🔍 What to Check If Minutes of Lag Is Unusual

Whether the replica itself is under unusually heavy load, from the reporting queries it's meant to serve competing for the same resources needed to keep applying incoming changes. Whether there was a burst of unusually heavy write activity on the primary that the replica is still working through. Whether the network connection between primary and replica has any current issues slowing the stream of changes down.

### 💎 Good to Know: A Replica Is Fundamentally Not Meant for Data That Must Be Instantly Current

This connects directly to the Scalability guide's database scaling chapter — a read replica trades some data freshness for read capacity, and using it for a use case that genuinely requires up-to-the-second accuracy is a design mismatch, not a replication bug, however small the lag actually is.

---

## 8. You discover a critical piece of data was silently corrupted by a bug that ran for several days before being caught — how would you approach assessing the damage and recovering?

### 📖 Introduction

The genuinely hard part of this scenario is that the corruption has been happening quietly for days, mixed in with legitimate, correct data the whole time.

### 🔍 Assessing the Damage

Find exactly when the bug was introduced, usually from deploy history, to establish the precise window during which corrupted writes could have occurred. Determine what specifically the bug did incorrectly — which fields, which records, and under what conditions — so you can write a targeted query to identify exactly which existing records were actually affected, rather than guessing.

### 🔧 Recovering

If backups exist from before the bug was introduced, from the later backup-restore question in this chapter, they may let you recover the correct original values for affected records specifically, without needing to restore the entire database. If no clean backup exists, or the affected records also had legitimate changes since, you may need to reconstruct correct values from other sources — logs, related records, or an audit trail if one exists.

### 💎 Good to Know: This Is Exactly Why an Audit Trail or Change History Is Worth Having on Critical Data

A record of what a value used to be and when it changed turns this kind of incident from "unrecoverable guessing" into "look up what it should be" — worth genuinely weighing for any data where a silent, delayed-discovery corruption bug would be this costly to recover from.

---

## 9. A database backup restore is tested for the first time during an actual emergency and fails — what should have been done differently, and how would you handle the failure in the moment?

### 📖 Introduction

This scenario exists specifically to test a widely known but frequently ignored principle.

### ⚠️ What Should Have Been Done Differently

Backups should be periodically, actually restored as a test, not just assumed to work because the backup job itself reports success — a backup that completes without error but was never actually tested for successful restoration is not a verified backup, it's an untested assumption.

### 🔧 Handling It in the Moment

Immediately check whether an older backup, even if less recent, restores successfully — recovering from a slightly older, working backup is still meaningfully better than recovering from nothing. In parallel, investigate why the intended backup specifically failed to restore, since understanding that failure might reveal whether the underlying data itself, not just this one backup, has a genuine problem.

### 💎 Good to Know: "We Have Backups" and "We Have a Tested, Working Restore Process" Are Different Claims

This scenario is the practical consequence of treating those two claims as the same thing when they genuinely aren't — a backup strategy is only as good as its last actually-verified restore, and this incident-response chapter's broader lesson about verifying assumptions before an emergency, not during one, applies directly here too.

---

## 10. A long-running analytical query is locking rows that a customer-facing transactional query also needs — how would you diagnose this, and what are your options for fixing it?

### 📖 Introduction

This scenario is a direct collision between two genuinely different workloads sharing the same database.

### 🔍 Diagnosing It

Confirm the actual lock contention using the database's tooling for currently running queries and their locks, from the first question in this chapter — identifying the specific long-running analytical query and exactly which rows or tables it's holding locks on that the customer-facing query is now waiting behind.

### 🔧 Options for Fixing It

Move analytical and reporting workloads off the primary database entirely, onto a read replica, from the earlier question in this chapter, so heavy analytical queries can no longer contend with transactional traffic at all. If a replica isn't available or practical yet, check whether the database offers a way to run the analytical query with a weaker isolation level or in a way that avoids holding blocking locks for its full duration. Break a genuinely large analytical query into smaller batches, reducing how long any single lock is actually held at once.

### 💎 Good to Know: This Is the Real-World Reason Read Replicas for Reporting Exist in the First Place

This exact contention scenario is the practical motivation behind routing reporting and analytical workloads to a dedicated read replica, covered generally in the Scalability guide's database scaling chapter — separating the two workloads isn't just about read capacity, it's specifically about preventing this kind of lock contention from ever happening between them.

---

## 11. Your team wants to run a large data backfill against a production table with zero downtime — walk through how you'd design that backfill safely.

### 📖 Introduction

The core idea in this scenario is the same one introduced in the earlier migration question in this chapter, applied specifically to moving or transforming a large volume of existing data.

### ⚠️ Why a Naive Backfill Is Risky

Updating millions of rows in a single operation can hold locks for an extended period, generate a large burst of database load, and risk timing out or failing partway through, leaving the data in an inconsistent, half-migrated state with no clear resume point.

### 🔧 How to Do It Safely

Process the backfill in small batches rather than as one massive operation, with a brief pause between batches to avoid sustained heavy load on a database that's also serving live production traffic at the same time. Make each batch idempotent and track progress, so the backfill can be safely paused and resumed, or safely re-run from a known point, rather than starting over from scratch if it's interrupted. Run it during lower-traffic windows if the data and traffic patterns allow, and monitor database load throughout, ready to slow down or pause if it's genuinely impacting live traffic.

### 💎 Good to Know: This Uses the Same "Batch, Don't Bulk" Principle as the Earlier Migration Question

Both this backfill scenario and the earlier large-table migration question in this chapter rely on the same underlying idea — spreading a large, risky change out over many small, safe, resumable steps rather than attempting it as one large, all-or-nothing operation against a live production system.

---

## 12. A table's row count has grown far beyond what was originally planned for, and query performance is degrading across the board — what options would you weigh?

### 📖 Introduction

This closes the chapter with a genuinely open-ended, tradeoff-heavy question rather than a single clear fix.

### 🔧 Options to Weigh

Indexing — confirming the table's most common query patterns are actually well-served by existing indexes, from the earlier indexing question in this chapter, since a table that was small enough for a full scan to be fast can degrade badly once it's no longer small. Archiving or removing old, rarely accessed data if the use case allows it, shrinking the table's effective working size. Partitioning the table, splitting it into smaller physical segments based on some logical boundary, like date ranges, so most queries only ever need to touch a relevant, much smaller subset. Sharding, splitting the data across entirely separate databases, a more involved, larger architectural change covered generally in the Scalability guide's database scaling chapter.

### 🎯 How to Actually Decide

Weigh how much runway each option buys against how much effort and risk it takes to implement — indexing and archiving are usually the cheapest, fastest first moves, while partitioning and sharding are more powerful but genuinely more involved changes worth reaching for once the simpler options are already exhausted.

### 💎 Good to Know: This Is a Direct, Practical Application of the Scalability Guide's Database Chapter

This entire question is essentially "apply the Scalability guide's database scaling options to one specific, concrete table" — a good answer here demonstrates being able to actually reason through those tradeoffs for a real, specific situation, not just recite the list of options in the abstract.
