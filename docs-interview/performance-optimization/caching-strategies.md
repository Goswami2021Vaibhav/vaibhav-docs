---
title: Caching Strategies
description: Where to cache, what to cache, and cache invalidation.
sidebar_position: 5
---

# Caching Strategies

## 1. Why does caching improve performance, and what's the fundamental tradeoff every strategy has to make?

### 📖 Introduction

The Backend Performance Optimization chapter ended with the decision of *whether* a given endpoint deserves a cache — this chapter goes deep on *how* to actually do it well.

### ⚡ Why Caching Helps

Caching stores the result of an expensive operation — a slow query, a slow computation, a network fetch — so a subsequent request for the same thing can be served from fast, cheap storage instead of redoing that expensive work. It trades the cost of computing something once against the benefit of serving it many times cheaply.

### ⚖️ The Fundamental Tradeoff: Freshness vs. Speed

A cache is, by definition, a copy of data that can become out of date the moment the underlying source changes. Every caching decision is really a decision about how stale you're willing to let data be, in exchange for how much faster or cheaper you want responses to be. There's no way to have a cache that's both instantly fast and always perfectly, immediately consistent with the source of truth.

### 💎 Good to Know: "Just Add a Cache" Is Never a Purely Technical Decision

This is exactly why the caching-candidate decision from the previous chapter matters so much — every caching choice is also a business decision about how much staleness is genuinely acceptable for that specific piece of data, not just a technical implementation detail.

---

## 2. What are the different levels a request can be cached at, and why might the same data be cached at more than one?

### 📖 Introduction

Caching isn't one single layer — a typical request can be intercepted and served from a cache at several different points along its journey.

### 🗂️ The Levels

**Browser cache** — data cached on the user's own device, closest to them, with zero network round trip at all on a hit. **CDN cache** — cached at a server geographically close to the user, covered in depth in the Network Performance Optimization chapter. **Application cache** — Redis or an in-memory store, sitting between the app server and the database, avoiding a database round trip entirely. **The database's own internal cache** — many databases cache frequently accessed data or query plans internally too.

### 🧩 Why the Same Data Might Live at Multiple Levels

Each level trades off "closeness to the user" against "control and freshness" differently. A browser cache is fastest but hardest to invalidate remotely — you can't force a user's browser to drop it instantly. An application-level Redis cache is slower but gives you full, immediate control over invalidating it. Using several layers together means a request only has to travel as far as the first layer holding a valid, fresh copy, maximizing the chance of a fast hit while still keeping some layer that *can* be invalidated quickly when data actually changes.

### 💎 Good to Know: This Is Defense in Depth's Performance Counterpart

Multiple complementary layers, each covering what the others might miss — the same structural idea as defense in depth from the Web Security guide's first chapter, just applied to speed instead of security.

---

## 3. Why is cache invalidation famously considered one of the hardest problems in computer science?

### 📖 Introduction

Phil Karlton's well-known line — "there are only two hard things in computer science: cache invalidation and naming things" — is worth understanding rather than just quoting.

### 🤔 Why It's Actually Hard

A cache, once populated, has no inherent knowledge of when the underlying source data changes. Unless something explicitly tells it "this specific piece of data is now stale," it will happily keep serving the old, now-wrong value indefinitely, or until a TTL, covered next, eventually expires it. The real difficulty is reliably and comprehensively identifying every place a piece of data might be cached, and every event that should trigger invalidating it — without missing some, leaving stale data lingering, or over-invalidating everything defensively, destroying the performance benefit caching was supposed to provide in the first place.

### 💎 Good to Know: This Tension Is the Crux of the Problem, Not a Technical Limitation

The balance between invalidating too narrowly and too broadly, covered in more depth later in this chapter, is really what makes this hard. It isn't a limitation of any particular tool — it's a genuinely difficult tradeoff to get exactly right in any sufficiently interconnected system.

---

## 4. What is the cache-aside pattern, and how does it handle a cache miss?

### 📖 Introduction

This is the most common caching pattern in typical web applications, and a good default to reach for first.

### 🔄 What It Is

Also called lazy loading — the application code itself is responsible for checking the cache first, and only going to the actual data source, a database or a slow API, on a miss, populating the cache with the result afterward for next time.

```js
async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await User.findById(id); // cache miss: fetch from the real source
  await redis.set(`user:${id}`, JSON.stringify(user), "EX", 300);
  return user;
}
```

### 💎 Good to Know: This Pattern Only Caches What's Actually Requested

This is by far the most common approach specifically because it's simple, and because the cache only ever gets populated with data that's actually been requested — rather than eagerly caching everything upfront, some of which might never actually be needed at all. A natural fit for the caching-candidate criteria from the previous chapter.

---

## 5. What is write-through caching, and how does it differ from write-behind?

### 📖 Introduction

Both patterns handle writes differently, and the choice between them is a real, deliberate consistency-versus-speed tradeoff.

### ✍️ Write-Through

Every write goes to both the cache and the underlying data store synchronously, as part of the same operation, before the write is considered complete. The cache and the source of truth stay perfectly in sync, at the cost of every write now paying the latency of updating two things instead of one.

### ⏳ Write-Behind (Write-Back)

A write goes to the cache immediately, fast and low latency, and the update to the underlying data store happens asynchronously, sometime after, in the background. Faster writes, but this introduces a real window where the cache and the actual source of truth are temporarily out of sync — and a genuine risk of losing that pending write entirely if the cache crashes before it's been persisted to the durable store.

### 💎 Good to Know: Write-Behind Trades Durability for Speed — Choose Accordingly

Write-behind is appropriate for data where losing a very recent update occasionally is an acceptable risk — a view counter, an analytics event. It's a poor fit for anything where losing data would be a genuine problem, like a financial transaction or an order — a concrete instance of the business-risk tradeoff theme running throughout this guide.

---

## 6. What is a TTL, and how do you decide on a reasonable value?

### 📖 Introduction

A TTL is often the first, and simplest, tool reached for when adding a cache — but choosing the right value requires understanding what it actually protects against.

### ⏱️ What It Is

Time To Live — a configured duration after which a cached entry is automatically considered expired and either removed or refreshed on next access, rather than being cached forever with no automatic expiration.

### ⚖️ How to Decide on a Value

Balance how often the underlying data actually changes against how costly or risky it is to serve slightly stale data for that specific piece of information. Data that changes rarely and where staleness is low-risk — a list of country names, a rarely updated config value — can have a long TTL, measured in hours or even days. Data that changes often, or where staleness has real consequences — current inventory levels, pricing — needs a much shorter TTL, or shouldn't rely on a blind TTL at all, relying instead on explicit invalidation, covered later in this chapter, when the underlying data actually changes.

```js
await redis.set("product:catalog", data, "EX", 3600); // stale after 1 hour, at most
```

### 💎 Good to Know: A TTL Is a Safety Net, Not the Primary Invalidation Mechanism

Relying on TTL alone, rather than combining it with explicit invalidation, means accepting that data could be wrong for up to the entire TTL duration after any update — fine for some data, genuinely problematic for other data, exactly the decision this question describes.

---

## 7. What is stale-while-revalidate, and how does it serve a fast response while refreshing in the background?

### 📖 Introduction

This is a genuinely elegant refinement on a plain TTL, and it directly sets up the cache stampede problem covered next.

### 🔄 What It Is

A caching strategy, and an actual HTTP `Cache-Control` directive, that serves the currently cached, possibly slightly stale, response immediately, while simultaneously kicking off a background refresh of the cache. The current request gets a fast response using what's already available; the next request, after the background refresh completes, gets the freshly updated data.

```
Cache-Control: max-age=60, stale-while-revalidate=300
```

### ✅ Why This Is Often a Good Default

It avoids the worst outcome of a naive TTL approach — a request arriving right as a TTL expires having to wait for a full, slow refresh before getting any response at all, directly related to the cache stampede problem covered next. No single request ever has to wait for the refresh; it always gets an immediate response, just possibly one generation behind the absolute latest.

### 💎 Good to Know: This Optimizes Where the Freshness Cost Lands, Rather Than Eliminating It

Rather than trying to eliminate the freshness-versus-speed tradeoff from the first question of this chapter, stale-while-revalidate optimizes *where* the cost lands — a background refresh nobody has to wait for, instead of making any individual user's request pay for it directly.

---

## 8. What is a cache stampede, and how does it happen?

### 📖 Introduction

This is a case where a caching layer, meant purely to help performance, can actually become the source of a serious production incident under specific conditions.

### 🐘 What It Is

When a popular, heavily requested cache key expires, and a large number of concurrent requests for that same key arrive at, or immediately after, that exact moment. Since the cache is now empty for that key, every one of those concurrent requests independently sees a cache miss and simultaneously tries to regenerate the same expensive result at the same time — hitting the underlying database or service with a sudden, massive, multiplied spike of duplicate, redundant work, right at the moment it's least able to handle it.

### ⚠️ Why It's Specifically Dangerous

This can genuinely take down or badly overload a database that would have been perfectly fine handling one regeneration request, since it's now handling potentially hundreds of simultaneous, completely redundant ones for data that's identical across all of them.

### 🛡️ Mitigations

A lock or mutex so only one request actually regenerates the value while others wait briefly for that result, rather than each independently attempting it. Staggering or jittering TTLs slightly, so many keys don't all expire at the exact same instant. The stale-while-revalidate pattern from the previous question, which sidesteps this entirely, since a request never actually waits on an empty cache to begin with.

### 💎 Good to Know: Caching Has Its Own Failure Modes, Not Just Benefits

This is a great, concrete illustration that caching isn't a pure, risk-free win — it introduces its own specific failure modes worth understanding and designing around, not just a straightforward performance improvement with no downside.

---

## 9. How would you design a cache key for data that depends on multiple parameters?

### 📖 Introduction

Getting a cache key wrong is one of the more common, and more dangerous, mistakes in this entire chapter — worth being precise about.

### 🔑 The Principle

A cache key needs to uniquely encode every parameter that affects what the correct response actually is. If two different logical requests — a different user, a different filter, a different page — could produce different correct results, they need different cache keys, or one request will incorrectly be served the wrong cached result meant for an entirely different combination of parameters.

```js
const cacheKey = `user:${userId}:orders:status=${status}:page=${page}`;
```

### 💎 Good to Know: Two Real, Opposite Failure Modes

A key that's too **narrow**, missing a parameter that actually matters, causes users to see the wrong data meant for someone or something else — a genuine correctness bug, not just a minor inefficiency. A key that's too **wide**, including something that doesn't actually affect the result, like a timestamp or a random session token, means the cache essentially never hits at all, since every request generates a technically unique key even when the underlying data would have been identical — zero actual caching benefit, while still paying the overhead of maintaining a cache.

---

## 10. What are the `Cache-Control` header's key directives, and how do `max-age`, `no-cache`, and `no-store` differ?

### 📖 Introduction

`no-cache` is one of the most commonly misunderstood terms in this whole chapter, given how its name reads compared to what it actually does.

### 📜 The Key Directives

**`max-age`** — how many seconds a response can be considered fresh and reused without even checking back with the server at all. **`no-cache`** — a genuinely misleading name; it does *not* mean "don't cache this." It means the response can be cached, but must be revalidated with the server, through the conditional request covered next, before each use, rather than being reused blindly. **`no-store`** — the actually strict directive: don't cache this at all, anywhere, don't even write it to any cache or storage in the first place. Appropriate for genuinely sensitive, always-must-be-fresh responses.

```
Cache-Control: private, no-store              # never cache at all
Cache-Control: public, max-age=3600           # reusable for 1 hour without checking back
Cache-Control: no-cache                       # must revalidate before every reuse
```

### 💎 Good to Know: The `no-cache` Naming Confusion Is Genuinely Common

Many developers assume `no-cache` means "never cache this" — it actually means "always double-check before reusing it," a meaningfully weaker guarantee than `no-store`. Worth double-checking which one an application actually needs rather than guessing from the name alone.

---

## 11. What is an `ETag`, and how does conditional requesting avoid re-downloading unchanged content?

### 📖 Introduction

This is a genuinely elegant middle ground between "always re-download everything" and "trust a cached copy blindly without checking."

### 🏷️ What an ETag Is

A unique identifier, often a hash, representing the current version or state of a specific resource, sent by the server in a response header.

### 🔄 The Conditional Requesting Flow

On a subsequent request for the same resource, the browser sends the previously received ETag back in an `If-None-Match` header. The server compares it against the resource's current actual ETag. If they match, nothing has changed since last time, and the server responds with a lightweight `304 Not Modified` status and no body at all, letting the browser reuse its existing cached copy. If they don't match, the resource genuinely changed, and the server sends the full new response body along with a new ETag.

```
Request:  If-None-Match: "a3f8c9"
Response: 304 Not Modified   (or 200 with a fresh body and a new ETag, if changed)
```

### 💎 Good to Know: This Combines Freshness Assurance With Real Bandwidth Savings

This lets the client avoid re-downloading unchanged content entirely, while still guaranteeing it's told immediately, via a cheap, small round trip, the moment something actually did change — the best of both a long cache duration and always-fresh data.

---

## 12. How does a CDN cache static assets, and what's the tradeoff between cache duration and updating content quickly?

### 📖 Introduction

This tension sets up the cache-busting technique covered in the next question, which resolves it almost entirely.

### 🌍 How a CDN Caches

The first request for a given asset from a specific geographic region is served from the origin server, a cache miss at that CDN edge, and then stored at that nearby edge location. Every subsequent request from users near that same region is served directly from the nearby edge, without ever reaching the origin server at all — reducing both latency and load on the origin.

### ⚖️ The Tradeoff

A **long cache duration** minimizes origin load and maximizes speed, but makes updating content slower to actually reach users, since a long-cached asset won't be re-fetched from origin until its cache duration genuinely expires — potentially serving outdated content for that entire window. A **short cache duration** propagates updates to users faster, but the origin server has to handle more traffic, since more frequent cache misses at the edge require a fresh fetch from origin, losing some of the CDN's core benefit.

### 💎 Good to Know: This Exact Tension Is What Cache Busting Is Designed to Resolve

The next question covers a technique that gets both a very long cache duration and the ability to update content instantly, simultaneously, rather than forcing a choice between the two.

---

## 13. What is cache busting, and how do content-hashed filenames make a very long cache duration safe?

### 📖 Introduction

This directly resolves the tension from the previous question, and it's one of the more elegant, widely used patterns in frontend performance.

### #️⃣ What It Is

Instead of naming a built asset file something static like `app.js`, the build process generates a filename that includes a hash of the file's actual content — `app.a3f8c9.js`. The filename itself changes automatically the moment the file's content changes, and stays exactly the same if the content is unchanged.

### 🔓 How This Resolves the Tradeoff

Since a content-hashed file's name never changes unless its content does, it's completely safe to set an extremely long cache duration — `max-age` measured in years — on that specific file. A genuinely updated version of the file simply has a different filename entirely, one the browser or CDN has never seen before, and will fetch fresh regardless of any cache duration on the old, now-abandoned filename. The HTML page referencing these assets, which changes far more often, gets a much shorter cache duration, or none at all, and is what actually points to the current correct hashed filename at any given time.

```html
<script src="/static/app.a3f8c9.js"></script>
<!-- Cache-Control: max-age=31536000, immutable -->
```

### 💎 Good to Know: This Turns the Tradeoff Into "Have Both," Not "Choose One"

This pattern — long-lived, aggressively cached immutable assets referenced by a short-lived, always-fresh "pointer" document — works specifically because it makes the cache key itself, the filename, carry the freshness information, instead of relying on time-based expiration alone.

---

## 14. What data is a poor candidate for caching, even if it's frequently requested?

### 📖 Introduction

This closes the loop with the caching-candidate decision from the previous chapter, now specifically covering the cases where it goes wrong.

### 🙅 Highly Personalized Data

A response that's different for every single user — a genuinely personalized recommendation feed, an account-specific dashboard with near-real-time figures — has essentially no reuse value across different requests. Caching it doesn't help anyone else, and can even be actively dangerous if done carelessly, covered in the wrong-layer-caching question later in this chapter.

### ⏱️ Rapidly Changing Data

Data that's stale within seconds of being cached — real-time stock prices, a live sports score — provides little genuine benefit from caching, since by the time it's served from cache it may already be meaningfully wrong. The acceptable staleness window is so narrow that caching barely helps while still carrying real risk of serving incorrect data.

### 💎 Good to Know: The Common Thread Is a Mismatch Between Request Frequency and Change Frequency

Caching only pays off when a result can genuinely be reused across multiple requests before it goes stale. Neither of these categories offers much of that reuse window at all, regardless of how frequently they're individually requested.

---

## 15. How would you invalidate a cache entry when the underlying data changes, without invalidating far more than necessary?

### 📖 Introduction

This is the concrete, practical answer to why cache invalidation is genuinely hard, from earlier in this chapter.

### 🎯 The Approach

Rather than invalidating an entire broad cache, or waiting for a TTL to naturally expire, invalidate specifically the cache key or keys actually affected by a given data change. Updating a specific user's profile should invalidate only that user's cached profile data, not the entire users cache or every other user's unrelated cached data.

### 🔧 How to Keep It Precise

Designing cache keys with the actual data dependency in mind from the start, covered earlier in this chapter, makes this tractable — if updating record X should invalidate exactly the cache entries that depend on X, that invalidation can be targeted precisely. For data with multiple dependent cached views — a product appearing in a product-detail cache, a category-listing cache, and a search-results cache all at once — you either need to invalidate all of those related keys explicitly when the product changes, or rely on a shorter TTL for the harder-to-precisely-invalidate views as an acceptable compromise.

### 💎 Good to Know: This Is the Too-Narrow-vs-Too-Broad Tension, Made Concrete

Invalidating too little — missing the category-listing cache when a product's price changes — leaves stale data lingering somewhere unexpected. Invalidating too much — clearing the entire cache on every small update — defeats caching's whole purpose. Getting this balance right is the genuinely hard, ongoing part of cache design, not a one-time setup decision.

---

## 16. What's the risk of caching at the wrong layer, such as caching a fully rendered page that includes user-specific data?

### 📖 Introduction

This is where a performance mistake stops being merely inefficient and becomes a genuine security incident.

### ⚠️ The Risk

Caching something at a layer shared across multiple different users — a CDN or reverse-proxy cache, shared across all visitors — when the actual content being cached contains data specific to one particular user, like a fully rendered HTML page that happens to include a logged-in user's name or account balance baked directly into the markup.

### 💥 What Goes Wrong

The next visitor, an entirely different user, who happens to request that same cached page from the same shared cache, could be served the first user's personal, cached data directly. This isn't merely a performance inefficiency — it's a genuine, serious privacy and security bug, precisely the kind of realistic vulnerability that would belong in the Web Security guide's own vulnerability chapter, and a clear example of how a performance optimization gone wrong can become an actual security incident.

### 💎 Good to Know: The Fix Is Either Not Caching It There, or Fixing the Cache Key

Either avoid caching pages containing personalized content at a shared layer at all — rendering that specific part dynamically, or fetching it separately client-side after a cached, generic shell loads — or ensure the cache key itself properly incorporates something user-specific, directly the cache-key-design point from earlier in this chapter, so different users genuinely get different cache entries rather than colliding on the exact same shared one.

---

## 17. In production, users occasionally see stale or incorrect data after an update — how would you diagnose it?

### 📖 Introduction

This closes the chapter with a debugging scenario that has a genuinely distinctive signature worth recognizing quickly.

### ✅ First, Confirm It's Actually a Caching Issue

Reproduce the report and check whether the same data looks correct when fetched through a path that bypasses caching entirely — a direct database query, or a request with cache-busting headers. If the underlying source data is already correct, but what's being served to users isn't, that strongly confirms a caching problem specifically, rather than a data or application-logic bug elsewhere.

### 🔍 Narrowing Down Which Layer

Check each layer independently, from closest-to-user backward. The user's own browser cache would only affect that specific reporting user, and typically resolves for them with a hard refresh. A CDN edge cache would affect all users in a specific geographic region consistently. An application-level Redis or in-memory cache would affect all users regardless of location, consistently.

### 🕵️ Root Cause Once Located

Was the update's corresponding invalidation, from earlier in this chapter, simply missing entirely for this specific data path? Was the cache key subtly wrong in a way that caused a stale key to keep being read while a fresh one was written under a slightly different key? Or is a TTL simply set longer than the team actually realized or intended?

### 💎 Good to Know: This Bug Class Has a Distinctive, Recognizable Signature

"The underlying data is correct, but what users see isn't" is close to a definitional description of a caching problem specifically, as opposed to a genuine data-integrity or application-logic bug. Recognizing that signature quickly is what lets you skip straight to checking cache layers instead of chasing the wrong kind of bug entirely.
