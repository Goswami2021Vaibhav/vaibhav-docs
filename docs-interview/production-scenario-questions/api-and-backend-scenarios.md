---
title: API & Backend Scenarios
description: Open-ended "what would you do" questions about backend systems in production.
sidebar_position: 1
---

# API & Backend Scenarios

## 1. An API endpoint that normally responds in under 200ms suddenly starts taking 5+ seconds for a subset of requests, but not all of them — how would you start narrowing down the cause?

### 📖 Introduction

The most important detail in this scenario is "a subset, not all" — that single fact rules out an entire category of causes before you even open a dashboard.

### 🔍 What "Subset, Not All" Tells You

If every request were slow, you'd suspect something global — the database itself down, the whole server overloaded. Since only some requests are affected, the cause is likely tied to something that varies between requests: a specific input, a specific user, a specific code path, or a specific downstream dependency that only some requests happen to touch.

### 🧭 How to Narrow It Down

Pull the slow requests specifically and look for what they have in common — the same query parameter, the same user, the same payload size, the same shard, the same endpoint code path. Check whether the slow requests correlate with a specific downstream call, a database query with a missing index for one particular filter value, or a third-party API call, covered later in this chapter, that only fires under certain conditions. Look at whether the slowness is new or has always existed for this exact subset and was simply never surfaced before, versus something that started at a specific point in time.

### 💎 Good to Know: Averages Hide This Exact Kind of Problem

This scenario is a direct, practical instance of why p50, average latency, and p99, tail latency, tell genuinely different stories — covered in the Performance Optimization guide. A dashboard showing "average latency: 250ms" can look completely healthy while a real subset of users has a genuinely broken experience.

---

## 2. A client team reports that your API "randomly" returns 500 errors a few times a day with no obvious pattern — what would you check first, and what would you ask the client team for?

### 📖 Introduction

"Random" almost never means genuinely random — it usually means "a pattern that hasn't been found yet."

### 🔍 What to Check First

Your own error logs and tracking for the exact timestamps of these 500s — what the actual underlying exception was, not just that a 500 occurred. Whether the failures cluster around any particular time of day, which might point to a scheduled job, a traffic pattern, or a resource limit being hit periodically rather than randomly.

### 🗣️ What to Ask the Client Team For

The exact request that failed — the specific payload, headers, and timestamp — not just "it happened around 2pm." A genuinely useful bug report needs enough detail to find the matching log entry on your side; "sometimes it fails" without correlated specifics is nearly undebuggable from your side alone.

### 💎 Good to Know: Correlating Client and Server Logs Requires a Shared Identifier

This is exactly the kind of scenario a request/trace ID, generated per request and included in both the client's error and your server's logs, is designed to solve — without one, matching "the client saw a failure around 2pm" to "the specific log line for that specific request" is often genuinely impossible at any real scale.

---

## 3. Your API's error rate spikes immediately after a deploy, but the code change looks unrelated to the failing endpoint — how would you investigate?

### 📖 Introduction

"Unrelated" is a claim worth being suspicious of — deploys touch more than just the lines that were intentionally changed.

### 🔍 What Actually Changed

A deploy isn't just the code diff you meant to ship — it can include a changed dependency version, a changed environment variable, a changed configuration file, or a database migration that ran alongside it. Check the full deploy, not just the pull request's diff, for anything that touched shared infrastructure the failing endpoint also happens to depend on.

### 🧭 Investigation Approach

Roll back, or feature-flag off, the deploy first if the error rate is genuinely impacting users — restoring stability comes before fully understanding root cause, a prioritization covered generally in the Debugging & Production Issues chapter of this guide. Once stable, compare the exact dependency versions, configuration, and any shared code paths between the working and failing deploy to find the actual connection.

### 💎 Good to Know: "Unrelated" Code Often Shares a Dependency You Didn't Think About

A shared library, a shared database connection pool, or a shared middleware that both the intentionally changed code and the failing endpoint pass through is a genuinely common source of this exact "looks unrelated but broke together" pattern.

---

## 4. A background job that processes queued API requests is falling behind, and the queue keeps growing — walk through how you'd diagnose whether this is a throughput problem or a stuck-job problem.

### 📖 Introduction

These two causes look identical from the outside — a growing queue — but need genuinely different fixes.

### 🐢 Throughput Problem

Jobs are being processed, just not fast enough to keep up with the rate new items are being added — the queue's processed-per-minute rate is positive but consistently lower than its enqueued-per-minute rate.

### 🛑 Stuck-Job Problem

One or more specific jobs are stuck — hung on a downstream call, retrying indefinitely, or deadlocked — and are blocking the workers from moving on to the next items at all, or the workers themselves have crashed and aren't processing anything.

### 🔍 How to Tell Them Apart

Check whether jobs are actively completing at all, even slowly, versus whether the completion rate has dropped to zero. Look at how long the currently in-progress job or jobs have actually been running — a job running for far longer than a typical job's duration points strongly toward stuck, not merely slow.

### 💎 Good to Know: The Fix Genuinely Differs

A throughput problem is usually solved by adding more workers or optimizing the per-job work itself — a scaling response covered generally in the Scalability guide. A stuck-job problem needs a timeout and retry/dead-letter strategy so one bad job can never block the whole queue indefinitely — adding more workers to a stuck-job problem often does nothing at all.

---

## 5. An internal service-to-service API call starts timing out intermittently, but only during your traffic's daily peak hours — what would you investigate?

### 📖 Introduction

"Only during peak hours" is the scenario telling you this is a capacity problem, not a correctness problem.

### 🔍 What to Investigate

Whether the downstream service being called is itself under resource pressure during peak hours — CPU, memory, database connections, or its own downstream dependencies being saturated at exactly the times traffic is highest. Whether the network path between the two services, or a shared piece of infrastructure like a load balancer or connection pool, has a capacity limit that's only actually being reached during peak load.

### 🎯 Why "Intermittent and Peak-Correlated" Is a Specific Signal

A failure that happens consistently, all the time, points toward something broken. A failure that only shows up under peak load points toward something that's merely undersized for the load it's occasionally asked to handle — the previous chapter's networking guide and the Scalability guide both cover this same underlying pattern from different angles.

### 💎 Good to Know: Timeouts Under Load Are Often a Symptom, Not the Root Cause

The timeout itself is rarely the actual root cause — it's usually a symptom of the downstream service being too slow to respond within the timeout window because it's genuinely overloaded. Fixing the timeout value alone, without addressing the underlying capacity issue, usually just delays the same problem.

---

## 6. A third-party API your backend depends on starts responding slowly — how would you prevent that slowness from cascading into your own API becoming unresponsive?

### 📖 Introduction

This scenario is about containing a failure's blast radius rather than fixing the third party, which you don't control.

### 🛡️ The Core Risk

If your backend makes a synchronous call to the slow third party and simply waits, every request that touches that code path holds onto a server thread or connection for the full duration of the slow call — enough concurrent slow requests can exhaust your own server's available capacity, taking down endpoints that have nothing to do with the third party at all.

### 🔧 How to Prevent the Cascade

Set an aggressive timeout on the third-party call itself, so a slow call fails fast rather than holding resources indefinitely. Use a circuit breaker pattern — after enough consecutive failures or timeouts, stop even attempting calls to the third party for a cooldown period, failing fast instead, so your own service doesn't keep tying up resources on a dependency that's currently unhealthy.

### 💎 Good to Know: This Is the Same Underlying Problem as a Noisy Downstream Dependency

This is the same fundamental risk covered in the Scalability guide's fault-tolerance discussion — one slow or failing dependency shouldn't be able to take down everything else that depends on your service, and the fix is the same isolation principle in both cases.

---

## 7. You discover a specific API endpoint has no rate limiting and is being hit far more than expected — how would you confirm whether this is a legitimate traffic pattern or abuse, and what would you do about it?

### 📖 Introduction

The response should genuinely differ depending on which of these it actually is, so confirming which one you're dealing with comes first.

### 🔍 How to Tell the Difference

Look at the pattern of the requests — a legitimate traffic increase usually comes from many different users or IPs, follows a plausible usage pattern, and often correlates with something explainable, a marketing push or a new feature. Abuse typically comes from a small number of sources, follows a suspiciously mechanical, repetitive pattern, or targets an endpoint in a way that doesn't match how a real user would actually use the product.

### 🎯 What to Do

If it's legitimate, and simply outgrowing the current capacity, this becomes a scaling conversation, covered generally in the Scalability guide, not a security response. If it looks like abuse, add rate limiting, and consider whether the endpoint needs authentication or additional verification it currently lacks — covered generally in the Web Security guide's API Security chapter.

### 💎 Good to Know: The Absence of Rate Limiting Is Itself Worth Flagging Regardless of the Cause

Finding an unprotected endpoint receiving significant unexpected traffic is worth treating as a gap either way — even legitimate, well-intentioned traffic without any rate limiting in place can eventually degrade the service for everyone else, so the fix is usually worth doing regardless of which cause turns out to be true.

---

## 8. Your API returns correct data to Postman but the frontend team reports it's receiving stale or wrong data intermittently — what layers would you check?

### 📖 Introduction

"Works in Postman, broken from the frontend" is one of the most common real debugging scenarios a backend developer runs into, and it's rarely actually the API itself.

### 🔍 Layers to Check

Whether the frontend is reading from a cache, either its own or an intermediate one like a CDN or browser cache, that hasn't picked up the latest response — covered generally in the Caching & Redis Scenarios chapter of this guide. Whether the frontend is calling a different endpoint, environment, or set of parameters than what's actually being tested manually in Postman — a surprisingly common source of this exact mismatch. Whether there's a race condition on the frontend, where an older, slower request's response arrives and overwrites a newer one's already-rendered data, covered further in the Frontend & React Scenarios chapter of this guide.

### 💎 Good to Know: "Works in Postman" Only Proves the API Works for That One Specific Request

A manual Postman test proves the endpoint is correct for one specific request made at one specific moment, with no caching layer, no race conditions, and no real user browser environment involved — it's a genuinely useful first check, but it doesn't rule out anything that depends on how the frontend actually calls the API in real, ongoing usage.

---

## 9. A batch endpoint that processes 1,000 items at once starts occasionally returning a partial success with no clear indication of which items failed — how would you redesign this, and how would you debug the existing behavior in the meantime?

### 📖 Introduction

This scenario has two separate parts — fixing the current incident, and fixing the design so this class of problem doesn't keep happening.

### 🔍 Debugging the Current Behavior

Since the response doesn't say which items failed, the immediate fallback is your logs — searching for errors logged during the specific batch's processing window, hopefully tagged with enough identifying detail, an item ID or batch ID, to reconstruct which specific items actually failed after the fact.

### 🔧 The Redesign

A well-designed batch endpoint should return a per-item result — which items succeeded, which failed, and why each failure happened — rather than one aggregate success or failure for the whole batch. This also naturally supports safe retries, since the caller can retry only the specific items that actually failed instead of resubmitting the entire batch and risking duplicate processing of the items that already succeeded.

### 💎 Good to Know: This Is an Idempotency Problem as Much as a Response-Design Problem

A batch endpoint that isn't safely retryable per item risks duplicate side effects on retry — the same underlying idempotency concern covered in this guide's closing System Design Scenarios chapter around payment processing, just showing up here in a different, everyday form.

---

## 10. Your API's p50 latency looks fine on your dashboards, but users are reporting the app "feels slow" — what would you check that a p50-only view might be hiding?

### 📖 Introduction

This scenario connects directly back to the first question of this chapter — the same underlying blind spot, from a different angle.

### 🔍 What p50 Hides

By definition, p50 is the midpoint — half of all requests are faster, and half are slower, potentially much slower. A p50 that looks perfectly healthy can coexist with a genuinely bad p95 or p99, meaning a meaningful fraction of real users are having a slow experience the average or median entirely hides.

### 🎯 What to Check Instead

Look at p95 and p99 latency specifically, not just the median — covered generally in the Performance Optimization guide. Also consider whether "feels slow" is actually about latency at all, versus something like layout shift, a spinner that lingers, or a perceived-performance issue that isn't really about raw response time in the first place.

### 💎 Good to Know: A Small Percentage of Slow Requests Still Means a Lot of Real Users

At real scale, even a p99 that looks like a rounding error, 1% of requests, represents a genuinely large number of actual affected users — this is exactly why relying on a single central-tendency number like an average or median is a common trap in production monitoring.

---

## 11. A backend service starts crashing and restarting every few hours under normal load — how would you approach finding the root cause without being able to reproduce it locally?

### 📖 Introduction

"Every few hours under normal load, but not reproducible locally" is a strong hint the cause is something that accumulates over time, not something triggered by a single specific request.

### 🔍 What "Accumulates Over Time" Suggests

A memory leak that eventually exhausts available memory, a resource, like a database connection or file handle, that isn't being properly released and eventually runs out, or an unbounded, growing in-memory structure like a cache or queue with no eviction. All of these share the same signature — fine at first, gradually worse, eventually fatal — which matches "every few hours" far better than a single bad request would.

### 🧭 Investigation Without Local Reproduction

Since it can't be reproduced locally, lean on what production itself can tell you — memory and resource usage graphs over the hours leading up to each crash, looking for a steady climb rather than a sudden spike, and the exact error or crash reason logged at the moment of each restart, which often directly names the exhausted resource.

### 💎 Good to Know: A Restart Loop Can Mask the Underlying Problem's Severity

An automatic restart, while it keeps the service technically available, is quietly hiding a genuine, unresolved problem behind a fresh, momentarily healthy-looking process each time — treating the restarts themselves as acceptable rather than investigating why they keep happening is a common trap.

---

## 12. You need to deprecate a widely used API endpoint that several client teams still depend on — walk through how you'd approach this without breaking anyone in production.

### 📖 Introduction

This closes the chapter with a scenario about managing change deliberately, rather than the reactive incident-response flavor of most of this chapter's other questions.

### 🧭 Approach

Identify who's actually still calling the endpoint, and how often, before doing anything else — this is directly what usage-based deprecation planning, covered generally in the API Design guide's Versioning chapter, is for. Communicate the deprecation with a clear timeline well in advance, giving every dependent team genuine time to migrate rather than discovering it's gone. Provide the replacement endpoint or approach clearly, and ideally support both the old and new versions simultaneously for a transition period. Track actual usage of the deprecated endpoint over time to confirm it's genuinely dropping before finally removing it, rather than assuming everyone migrated just because the deadline passed.

### 💎 Good to Know: A Deprecation Without a Removal Plan Never Actually Finishes

It's common for a deprecated endpoint to linger indefinitely because nobody ever confirmed it was actually safe to remove — treating "monitor usage until it reaches zero, then remove" as an explicit, tracked final step, not just a hopeful assumption, is what actually closes the loop.
