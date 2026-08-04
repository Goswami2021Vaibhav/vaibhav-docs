---
title: Caching Strategies
description: Using caching as a scalability lever, not just a speed one.
sidebar_position: 4
---

# Caching Strategies

## 1. How does caching function as a scalability technique, not just a speed optimization?

### 📖 Introduction

The Performance Optimization guide has its own, much deeper Caching Strategies chapter covering patterns, invalidation, and TTL mechanics. This chapter is deliberately narrower — it's about caching specifically as a load-reduction lever that changes how much the rest of this guide's techniques are even needed.

### 🛡️ What It Protects Downstream Systems From

Every cache hit is a request that never reaches the database or backend service at all. The downstream system, the database covered in the previous chapter, or any other slow or limited-capacity dependency, experiences dramatically less load than the raw number of incoming requests would otherwise suggest. Caching effectively reduces the *effective* traffic volume the rest of the system has to be scaled to handle.

### 💎 Good to Know: Same Technique, Different Framing

The Performance Optimization guide frames caching as "makes responses faster." This guide frames it as "makes the system need less capacity in the first place." Both are true of the exact same technique simultaneously, and real systems benefit from holding both framings in mind at once.

---

## 2. Why might adding a cache let you delay a genuinely expensive database scaling effort by months or longer?

### 📖 Introduction

This is the direct, practical payoff of the previous question's load-reduction framing.

### 📉 How It Works

If a cache absorbs, say, 90% of read traffic that would otherwise hit the database, the database only ever sees roughly 10% of total real traffic. Its actual capacity requirement becomes a fraction of what it would otherwise need to be — potentially keeping it comfortably within its current headroom, covered in the previous chapter's vertical-scaling discussion, for far longer than raw traffic growth alone would suggest.

### 💎 Good to Know: This Delays the Work, It Doesn't Eliminate the Eventual Need for It

This is a genuinely legitimate, common strategy, not a trick to feel uneasy about. But it's worth being honest that it's buying time, not solving the underlying capacity question permanently — the risk of forgetting that distinction is covered from two different angles later in this chapter and in the previous one.

---

## 3. What's the difference between a local, in-process cache and a distributed cache?

### 📖 Introduction

This distinction determines whether a cache actually helps once an application is genuinely running as many instances.

### 💻 Local (In-Process)

Cache data stored directly in the application process's own memory. The fastest possible access, with no network hop at all, but visible only to that one specific instance.

### 🌐 Distributed

A separate, shared cache service, like Redis, that every application instance connects to over the network. Slightly slower than local, since there's a network round trip, but the same cached data is visible and shared across every instance.

### 💎 Good to Know: This Is the Same Local-vs-Shared Distinction From the Statelessness Chapter

The previous chapter's discussion of session data made exactly this same distinction. The same underlying architectural principle — external, shared state for anything that needs to be consistent across instances — resurfaces here, just applied to cached data instead.

---

## 4. Why can a local, per-instance cache become a scaling problem of its own once you have many instances?

### 📖 Introduction

This directly resolves the tradeoff raised in the previous question.

### ⚠️ Why It Happens

With a local cache, each of your N application instances maintains its own, completely separate copy of cached data. The same piece of data might get fetched from the database, or expensively computed, independently, N separate times — once per instance — rather than once. As you scale out the application layer, covered in the previous chapter, this redundant, duplicated database load actually grows proportionally with the number of instances, partially undermining the very load-reduction benefit caching is supposed to provide.

### 🔀 An Additional Issue

Local caches also go stale independently and inconsistently across instances — instance A's cached view of a piece of data can differ from instance B's, depending on when each happened to last fetch or refresh it, causing the same "different users see different answers depending on which instance handled their request" inconsistency problem the previous chapter already warned about for state generally.

### 💎 Good to Know: This Is Exactly Why a Distributed Cache Becomes Necessary at Scale

Local caching works fine for a single instance, or a small, fixed number of them, but doesn't scale proportionally the more instances you add — covered concretely in the next question.

---

## 5. What is a distributed cache cluster, and how does it scale beyond what a single cache instance can hold?

### 📖 Introduction

This is the fix for the problem the previous question described.

### 🗄️ What It Is

Multiple cache nodes, like a Redis Cluster, working together as one logical cache, with data automatically partitioned across the nodes in the cluster — directly the sharding concept from the previous chapter, applied here to a cache instead of a primary database.

### 📈 How It Scales Beyond a Single Instance

A single cache instance has a hard ceiling on both memory capacity, how much data it can hold, and throughput, how many operations per second it can handle. A cluster distributes both the data and the operational load across multiple nodes, letting the overall cache layer's capacity grow by adding more nodes — the same horizontal-scaling principle from the first chapter of this guide, applied to the cache layer specifically.

### 💎 Good to Know: Sharding Isn't a Database-Specific Technique

This is genuinely the same sharding concept from the previous chapter, just applied to a cache rather than a primary database — worth recognizing that "sharding" is a general distributed-systems pattern, partitioning data across multiple nodes by some key, that shows up repeatedly across different layers of a scaled system.

---

## 6. What happens to overall system capacity if the cache layer itself becomes overwhelmed or unavailable?

### 📖 Introduction

The answer here depends entirely on a decision that's easy to overlook until it's tested the hard way.

### ⚠️ What Happens

If the cache becomes overwhelmed by request volume, or goes down entirely, every request that would have been a cache hit now misses and falls through to the underlying database or service instead. The full, raw traffic volume the cache was supposed to be absorbing suddenly hits the downstream system all at once.

### 🔀 Graceful Degradation vs. Hard Failure

Whether the system degrades gracefully — slower responses, since requests now take the slower, non-cached path — or fails hard, a total outage, depends entirely on whether the downstream system actually has enough spare capacity to absorb that sudden, full load. If it doesn't, a cache failure cascades into a full system outage rather than just degraded performance — exactly the scenario this chapter closes with.

### 💎 Good to Know: This Is a Direct, Measurable Reflection of How the Rest of the System Was Sized

Whether a cache outage is a minor inconvenience or a full site-down event tells you exactly how much the rest of the system was actually sized and tested to handle without the cache's help.

---

## 7. What is cache warming, and why does it matter before a known, large traffic event?

### 📖 Introduction

This is the caching-specific instance of a "prepare ahead of time" principle that shows up repeatedly across this guide.

### 🔥 What It Is

Proactively populating a cache with likely-to-be-needed data before real traffic actually arrives and demands it, rather than letting the cache fill up organically through normal cache-miss-then-populate behavior as real requests happen to come in.

### 📅 Why It Matters Before a Known Event

Directly the proactive-scaling concept from the previous chapter, applied to caching specifically. If a massive, known traffic spike is anticipated — a marketing campaign, the closing scenario of the Performance Optimization guide — and the cache starts completely empty, the very first wave of that spike would all be cache misses simultaneously, hitting the database with full, un-cached load right when it can least afford it, echoing the stampede risk covered later in this chapter. Warming the cache in advance means that initial wave of traffic already finds a populated, ready cache instead.

### 💎 Good to Know: This Is One Recurring Principle, Showing Up in Multiple Places

Anticipate known future load, don't just react to it — the same idea behind the previous chapter's proactive scaling and the Performance Optimization guide's closing chapter, just applied here to the cache specifically.

---

## 8. How does a CDN act as a scaling layer, not just a latency-reduction one?

### 📖 Introduction

The Network Performance Optimization chapter covered a CDN's latency benefit — this is the load-absorption angle specifically.

### 🌍 How It Works

A CDN doesn't just make content faster to deliver. By serving cached static assets, and sometimes even cacheable dynamic content, directly from its own edge infrastructure, those requests never reach your origin servers at all. A genuinely large share of a typical website's total request volume — images, JS/CSS bundles, often even entire cacheable API responses — can be absorbed entirely by the CDN, meaning your origin infrastructure only needs to be scaled for the remaining, genuinely dynamic traffic.

### 💎 Good to Know: One of the Highest-Leverage Techniques in This Entire Guide

This is a specific, concrete instance of the general principle from the first question of this chapter — caching reduces the effective load the rest of the system needs to handle — but at a massive scale, since a CDN's edge capacity is typically far larger than any single origin infrastructure could cost-effectively match.

---

## 9. What's the risk of relying so heavily on caching that your database is never load-tested at its real, uncached capacity?

### 📖 Introduction

The previous chapter raised this risk from the database-scaling angle — here it's the focused topic in its own right.

### ⚠️ The Risk

A system that "performs fine" under normal, cached operation might have a database that was never actually verified to handle the full, raw traffic volume without the cache's help. The team genuinely doesn't know their real uncached capacity limit until something forces them to find out, exactly the cache-failure scenario from earlier in this chapter — precisely the worst possible time to discover it.

### 🛠️ The Fix

Deliberately load-test with the cache disabled or bypassed, as its own distinct test scenario, covered in the Performance Optimization guide's final chapter, to genuinely know the downstream system's real standalone capacity — treating this as a known, planned data point rather than an unknown risk.

### 💎 Good to Know: This Is the Same Underlying Risk Showing Up From Multiple Angles

The previous chapter's database-scaling framing, this chapter's caching-specific framing, and the production consequence covered in the closing scenario of this chapter are all genuinely one lesson, not three separate ones.

---

## 10. What happens to your backend's load if a popular cache entry expires during a traffic spike?

### 📖 Introduction

The Performance Optimization guide covered the cache stampede mechanics in depth — this is the scaling-consequence framing specifically.

### 💥 What Happens

If a popular, heavily relied-upon cache entry expires during a period of genuinely high traffic, rather than normal, average traffic, the resulting stampede is proportionally much worse. Instead of a handful of concurrent requests all missing simultaneously and hitting the database at once, you could have hundreds or thousands doing so simultaneously, given the elevated traffic volume already in progress.

### 💎 Good to Know: Stampede Protections Matter Most Exactly When It's Hardest to Notice They're Missing

This is exactly why the stampede mitigations covered in the Performance Optimization guide — locking, stale-while-revalidate, jittered TTLs — matter more, not less, specifically during the high-traffic events this chapter has been discussing. A protection that seemed unnecessary at normal traffic levels can become genuinely critical exactly at the moment your system is under the most load, which is precisely the worst timing for it to be missing.

---

## 11. How does caching change the calculation for how much database read capacity you actually need to provision?

### 📖 Introduction

This closes the loop between this chapter's load-reduction framing and the previous chapter's actual capacity-planning decisions.

### 🧮 How It Changes the Math

Without caching, the database needs to be provisioned to handle something close to the full raw read traffic volume directly. With an effective cache absorbing a significant share of reads, the database only needs to be sized for the remaining, genuinely uncached portion — which can be a small fraction of total traffic for a system with a good cache hit rate.

### 💎 Good to Know: This Capacity Math Has an Implicit Dependency Worth Making Explicit

The database's provisioned capacity now implicitly depends on the cache continuing to perform as expected — exactly why testing uncached capacity, and understanding what happens if the cache fails, both covered earlier in this chapter, matter so much. The capacity math only holds true as long as the cache's assumed hit rate actually holds true in production.

---

## 12. In production, a cache outage causes a total site outage rather than just slower responses — what does that reveal about how the system was architected?

### 📖 Introduction

This closes the chapter with the concrete incident version of the risk covered throughout it.

### 🔍 What It Reveals

If a cache outage causes a total site outage rather than just slower responses, that's direct evidence the downstream system, typically the database, was never actually provisioned or verified to handle real traffic without the cache's help — exactly the risk covered earlier in this chapter, now manifested as a real incident. The system was, in effect, silently dependent on the cache never failing, without that dependency ever being explicitly acknowledged, tested, or planned for.

### 🚨 Immediate Response

The cache outage itself needs fixing, an infrastructure-specific concern covered in the Load Balancing & Traffic Management chapter, but the deeper, more important finding is the downstream capacity gap it just exposed — exactly the kind of thing that should have been caught by deliberate uncached load testing, before a real cache outage was the thing that discovered it.

### 🔧 Process Fix

After restoring service, treat this as a prompt to actually run the uncached-capacity test deliberately, rather than waiting for the next cache outage to reveal it again, and consider architectural changes — circuit breakers, graceful degradation, covered in the High Availability & Fault Tolerance chapter — so a future cache outage results in degraded performance rather than a complete outage.

### 💎 Good to Know: The Central Tension of This Entire Chapter

Caching is a genuinely powerful, legitimate scaling technique — but only when the team is honest about what it's actually masking, rather than treating the cache's continued success as a guarantee instead of an assumption worth explicitly testing.
