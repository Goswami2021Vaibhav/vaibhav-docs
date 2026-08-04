---
title: Caching & Redis Scenarios
description: When caching helps, when it lies to you, and how to debug it.
sidebar_position: 3
---

# Caching & Redis Scenarios

## 1. Users report seeing outdated data on a page that should reflect a change they just made — how would you determine whether caching is actually the cause?

### 📖 Introduction

"It's probably the cache" is a common first guess, but it's worth actually confirming before chasing it.

### 🔍 How to Confirm

Check whether bypassing the cache entirely, querying the underlying source of truth directly, returns the correct, updated data. If it does, the data itself is correct and current, and the problem is genuinely somewhere in how or when the cache gets refreshed — narrowing it specifically to a missing or delayed invalidation, covered later in this chapter, rather than a deeper data problem.

### 🧭 If It's Not the Cache

If the underlying source of truth itself also shows outdated data, the actual cause is somewhere earlier in the write path entirely — the write not being fully committed, a replication lag issue from the Database Scenarios chapter of this guide, or the update simply not being applied the way it was assumed to be.

### 💎 Good to Know: Confirming the Layer Before Fixing It Saves Real Debugging Time

Jumping straight to "clear the cache" without confirming the cache is genuinely the cause risks fixing the symptom, temporarily, while leaving the real underlying problem untouched and ready to resurface.

---

## 2. Your Redis cache goes down entirely — walk through what actually happens to your application in that moment, and whether it should be catastrophic or just degraded.

### 📖 Introduction

The honest answer to "what happens" depends entirely on how the application was built to use the cache in the first place.

### 🎯 What Should Happen

A well-designed cache is a performance optimization sitting in front of a genuine source of truth, not the source of truth itself — when it's unavailable, the application should fall back to reading directly from that underlying source, meaning things simply get slower, not broken. This is the difference between caching as an optional accelerator versus caching as a load-bearing dependency the application can't actually function without.

### ⚠️ What Actually Happens If It Wasn't Designed This Way

If application code assumes the cache is always available, with no fallback path coded for a cache miss caused by an outage rather than a normal expiration, a cache going down can cause outright errors instead of just slower responses — and if the underlying database was never sized to handle the full, un-cached traffic load, the sudden loss of caching can also overwhelm it, turning a cache outage into a full outage.

### 💎 Good to Know: This Is the Real Test of Whether Caching Was Actually Implemented as a Safety Net or a Crutch

A cache outage is one of the clearest real-world tests of whether a system treats caching as an optimization it can gracefully live without, versus a dependency it's silently become unable to function without — worth deliberately testing before an actual outage forces the answer on you.

---

## 3. A specific cache key is being requested extremely frequently and just expired at the same moment as thousands of other requests — what's this failure mode called, and how would you prevent it?

### 📖 Introduction

This is a specific, well-known failure mode with an equally well-known set of fixes.

### 🐘 What It's Called

A cache stampede, sometimes called a thundering herd — when a popular cache key expires, every one of the many concurrent requests that would normally have been served instantly from cache instead simultaneously misses, and all of them hit the underlying data source at once, often overwhelming it.

### 🔧 How to Prevent It

Have only one request actually recompute and refill the cache when a key expires, while the other concurrent requests either wait briefly for that refill to complete or are served slightly stale data in the meantime, rather than every single one independently hitting the underlying source. Stagger expiration times slightly, adding a small amount of randomness (jitter) to a TTL, from later in this chapter, so that many keys with similar popularity don't all expire at the exact same instant in the first place. Proactively refresh a genuinely hot key before it actually expires, rather than waiting for it to expire and letting a wave of requests trigger the refill reactively.

### 💎 Good to Know: This Is Exactly Why the Later Cache-Warming Question in This Chapter Matters

The later question in this chapter about warming a cache before a scheduled traffic event is directly related — deliberately populating cache ahead of demand is one of the most reliable ways to avoid ever hitting this exact stampede scenario in the first place.

---

## 4. Cache hit rate on a key metric dashboard suddenly drops from 95% to near 0% — what would you check first?

### 📖 Introduction

A drop this sudden and this large points toward something structural breaking, not a gradual shift in usage patterns.

### 🔍 What to Check First

Whether the cache itself is actually reachable at all — a connectivity issue to the cache server would show up exactly like this, every request effectively missing because it can't even reach the cache to check. Whether a recent deploy changed how cache keys are generated — if key construction changed even slightly, every new request generates a key that's never actually been cached before, producing a wave of misses that looks identical to the cache being empty or down.

### 🧭 Narrowing Further

Check the cache directly for whether it actually holds any keys at all right now, versus whether it holds keys but none of them are the ones the application is currently requesting — the first points toward the cache having been flushed or restarted, the second points more specifically toward the key-generation-mismatch cause described above.

### 💎 Good to Know: A Hit-Rate Collapse Is Also an Instant, Unplanned Cache-Miss Traffic Spike

A hit rate crashing to near zero doesn't just mean slower responses — it means the full weight of that previously cache-absorbed traffic just hit the underlying data source all at once, which is exactly the same underlying risk the cache-stampede question earlier in this chapter describes, just triggered by a different cause.

---

## 5. You suspect a caching bug is serving one user's data to a different user — how would you investigate this urgently, and why is this specific failure mode more serious than most caching bugs?

### 📖 Introduction

Most caching bugs cost you correctness or performance — this one costs you trust and potentially real, sensitive data exposure.

### 🚨 Why It's More Serious

Serving stale data is usually a correctness annoyance, but serving one specific user's private data to a completely different user is a genuine data-privacy and security incident, not just a bug — the kind of issue covered generally in the Web Security guide's Data Security chapter, now showing up through a caching mechanism specifically.

### 🔍 How to Investigate Urgently

Check whether cache keys genuinely include the user's identity as part of the key itself, for any data that's meant to be user-specific — a shared or insufficiently scoped cache key across different users' requests is the most common root cause of exactly this failure mode. Given the severity, prioritize an immediate mitigation, disabling caching for the affected data entirely if needed, over a fully understood root cause, while the investigation continues in parallel.

### 💎 Good to Know: Treat This as a Security Incident, Not Just a Bug

Given the potential for real user data exposure, this scenario should trigger the same kind of incident response — assessing who was actually affected and for how long — covered generally in the Web Security guide's Logging, Monitoring & Incident Response chapter, not just a routine bug-fix process.

---

## 6. Your team disagrees on what TTL to set for a specific cached resource — walk through how you'd reason about the right value given the resource's actual characteristics.

### 📖 Introduction

There's no universal correct TTL — the right answer genuinely depends on the specific resource being cached.

### 🎯 What to Reason About

How often the underlying data actually changes — data that rarely changes can tolerate a long TTL with little real risk of serving stale results, while frequently changing data needs a much shorter one. How costly staleness actually is for this specific resource — a slightly outdated list of blog post titles is a very different risk than a slightly outdated account balance. How expensive the resource is to recompute or refetch — a genuinely expensive computation justifies a longer TTL to actually get the benefit of caching it at all, since a very short TTL on an expensive resource barely reduces the underlying load.

### 🔧 A Practical Approach

Rather than picking one TTL for everything, set it per resource type based on these three factors, and pair a longer TTL with an explicit invalidation, from the later question in this chapter, on write, so the cache doesn't have to rely purely on time passing to eventually become accurate again.

### 💎 Good to Know: TTL and Explicit Invalidation Are Complementary, Not Alternatives

A long TTL alone risks staying stale for too long if nothing else refreshes it; explicit invalidation alone, with no TTL as a backstop, risks a bug in the invalidation logic leaving stale data cached forever. Using both together is generally the safer, more resilient pattern.

---

## 7. Memory usage on your Redis instance keeps climbing and eventually triggers evictions of keys you didn't expect to lose — what would you investigate?

### 📖 Introduction

Unexpected evictions are Redis telling you it ran out of room and had to make a decision about what to discard — the question is why it ran out of room in the first place.

### 🔍 What to Investigate

Whether keys are being set without a TTL at all, meaning they never expire on their own and simply accumulate indefinitely until memory pressure forces evictions. Whether a specific type of key is growing unexpectedly large or numerous — a per-user cache key that was expected to stay small but is actually storing a large, unbounded amount of data per user, for example. What eviction policy Redis is actually configured to use, since different policies decide what to discard under memory pressure in genuinely different ways, and the configured policy might be evicting keys your application actually still needed.

### 🎯 Fixing It

Add appropriate TTLs to any keys that were missing one, address the specific source of unexpectedly large or numerous keys, and confirm the eviction policy actually matches what the application expects to happen under memory pressure, rather than assuming a sensible default was already correctly configured.

### 💎 Good to Know: An Eviction Policy Mismatch Can Silently Break Assumptions Elsewhere in the Application

If application code assumes a specific key, once set, will remain available until it naturally expires, but the actual eviction policy can remove it early under memory pressure instead, that mismatch can cause confusing, hard-to-reproduce bugs that only show up once the instance is under genuine memory pressure — worth explicitly confirming the configured policy actually matches what the code assumes.

---

## 8. A cache invalidation was supposed to fire on a specific write path but clearly isn't — how would you track down where the invalidation is actually missing?

### 📖 Introduction

This is a specific, common instance of the stale-data problem from the first question of this chapter, with a known cause to hunt for.

### 🔍 How to Track It Down

Identify every code path that can actually write to the underlying data, not just the one you assumed was the only path — a common root cause is a second, less obvious write path, an admin tool, a background job, a different service, that updates the same data but was never wired up to also invalidate the cache. Confirm the invalidation call is actually being reached and executed for the specific write path in question, rather than assuming it runs just because it exists somewhere in the codebase — a conditional branch or an early return can easily skip past it.

### 🎯 The Fix

Once the specific missing path is found, wire up the same invalidation logic to it. It's also worth considering whether invalidation logic scattered across multiple, separate write paths is itself the underlying structural problem — centralizing writes through a single path that always handles invalidation consistently removes the chance of this happening again for a future new write path.

### 💎 Good to Know: Scattered Invalidation Logic Is a Recurring Source of This Exact Bug

Any time cache invalidation logic is duplicated across multiple places instead of centralized in one, it's structurally easy for a new write path to be added later without anyone remembering to also add the matching invalidation — worth treating as a design smell, not just a one-off bug to patch.

---

## 9. Your application layers an in-memory cache on top of a Redis cache, and the two are now showing inconsistent data — how would you reason through this design, and how would you debug the inconsistency?

### 📖 Introduction

A two-layer cache adds real speed but also adds a second place things can go stale independently.

### 🧠 Reasoning Through the Design

An in-memory cache, local to a single application instance, is faster than even Redis, since it avoids a network call entirely — but with multiple application instances each running their own separate in-memory cache, there's no single shared place invalidation can happen once; every single instance's local cache needs to be told about the change individually.

### 🔍 Debugging the Inconsistency

Confirm whether invalidation is actually reaching every application instance's local cache, or only updating the shared Redis layer — a very common root cause, since invalidating a distributed, shared cache like Redis is straightforward, but invalidating many independent, per-instance in-memory caches requires an explicit mechanism, like a pub/sub message telling every instance to also clear its own local copy.

### 💎 Good to Know: Every Added Cache Layer Is Also an Added Place Invalidation Has to Reach

This is the practical cost of a multi-layer caching design — each layer is a genuine performance win, but also one more place that has to be correctly told about every single write, and missing even one layer produces exactly this kind of inconsistency.

---

## 10. After adding caching to a previously slow endpoint, latency for cache misses got noticeably worse than before caching existed at all — what could explain this?

### 📖 Introduction

This is a genuinely counterintuitive result worth being able to explain, since it initially sounds impossible.

### 🔍 What Could Explain It

The endpoint now does strictly more work on a cache miss than it used to do at all — checking the cache first, which takes some time, and only then falling through to the exact same original, slow logic as before, plus a write into the cache afterward. On a cache miss specifically, none of the caching benefit is realized yet, but all of the caching overhead, the failed lookup and the subsequent write, is still fully paid. If the added cache lookup itself is unusually slow, a distant or overloaded cache server for example, that overhead can be genuinely significant relative to a fast endpoint's own original logic.

### 🎯 Why This Matters

This doesn't mean caching was a bad idea — it means cache miss latency specifically needs to be evaluated on its own, separately from the overall average, which is dominated by the many fast cache hits, from the p50-versus-p99 discussion in the API & Backend Scenarios chapter of this guide.

### 💎 Good to Know: A Fast Average Can Still Hide a Genuinely Worse Worst Case

A caching layer that dramatically improves the average while making the miss case measurably worse is a real, common tradeoff — worth explicitly deciding whether that worse miss-case latency is actually acceptable given how rarely it's now hit, rather than assuming a better average automatically means every case improved.

---

## 11. Your team needs to warm a cache before a scheduled high-traffic event, like a product launch, to avoid a stampede of cold-cache requests the moment traffic arrives — how would you approach this?

### 📖 Introduction

This closes the chapter by tying directly back to the cache-stampede scenario from earlier — proactive prevention instead of reactive mitigation.

### 🔧 How to Approach Cache Warming

Identify exactly which data is actually likely to be requested heavily during the event, and proactively populate the cache with it ahead of time, rather than letting the first wave of real traffic be the thing that triggers those cache misses. Do this warming gradually, at a controlled pace, rather than as one single burst, since a warming process that itself hits the underlying data source too aggressively can cause the exact same kind of load spike it's trying to prevent. Verify the cache is genuinely populated as expected before the event actually starts, rather than assuming the warming process succeeded.

### 💎 Good to Know: Warming Doesn't Remove the Need for Stampede Protection During the Event Itself

Even a well-warmed cache will eventually have some keys expire during a long enough event — the stampede-prevention techniques from earlier in this chapter, single-flight refills and jittered TTLs, are still worth having in place as an ongoing safety net, not just relied on as a one-time setup step before the event begins.
