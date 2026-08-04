---
title: System Design Scenarios
description: Open-ended system design questions, framed as real production asks.
sidebar_position: 12
---

# System Design Scenarios

## 1. Design a URL shortener that needs to handle a high volume of redirects with very low latency — walk through your key design decisions.

### 📖 Introduction

This closing chapter shifts from diagnosing existing systems to designing new ones — but it draws on the exact same body of knowledge built up across this entire subject and the guides it cross-references.

### 🔑 Key Design Decisions

Generating a short, unique identifier for each long URL — a common approach encodes an auto-incrementing ID or a hash into a short string of characters. Storing the mapping between short identifier and original URL in a data store optimized for extremely fast lookups by that identifier, since a redirect is fundamentally a simple key-based lookup performed at very high volume. Caching, from the Caching & Redis Scenarios chapter of this guide, in front of that store, since a relatively small number of shortened URLs are typically responsible for a disproportionate share of actual traffic, making this an ideal caching candidate.

### 🎯 Why Low Latency Is Achievable Here

The read path, resolving a short code to its original URL, is simple and highly cacheable, which is exactly the profile that scales well — directly applying the caching and read-scaling principles covered generally in the Scalability guide's database chapter.

### 💎 Good to Know: A URL Shortener Is a Deceptively Good Vehicle for Demonstrating Read-Heavy Scaling Knowledge

Despite sounding simple, this is a genuinely common interview question specifically because it cleanly tests caching, data-store choice, and read/write asymmetry all at once, without requiring an overly elaborate problem statement to get there.

---

## 2. Design a notification system that needs to deliver a message to a user across email, push, and in-app channels, with retries if a channel fails — what are the key components?

### 📖 Introduction

This design question is fundamentally about decoupling "something happened" from "actually deliver it through every channel," and handling failure in each channel independently.

### 🔧 Key Components

A queue that a notification request is placed onto rather than being delivered synchronously and immediately inline — directly related to the background-job and queue reasoning from the API & Backend Scenarios chapter of this guide. Separate workers or handlers per channel, email, push, in-app, each responsible for actually delivering through their specific channel and independently retrying on failure, so one channel's provider being temporarily down doesn't block or delay the others.

### 🔁 Handling Retries Correctly

Each channel-specific delivery attempt should be idempotent, from this chapter's later payment-processing question, so a retry after a partial or ambiguous failure doesn't risk delivering the same notification twice to the same user through the same channel.

### 💎 Good to Know: This Design Mirrors the Third-Party-Dependency Isolation Pattern From Earlier in This Subject

Isolating each channel so one failing, slow third-party provider doesn't block the others is the same underlying principle as the circuit-breaker and dependency-isolation reasoning from the API & Backend Scenarios chapter — a notification system is essentially several independent third-party integrations bundled behind one shared trigger.

---

## 3. Design a rate limiter that needs to work correctly across multiple application server instances, not just a single one — walk through your approach.

### 📖 Introduction

This is a direct, practical instance of the stateless-versus-stateful tension that's recurred throughout this entire subject, now applied specifically to rate limiting.

### ⚠️ Why a Single-Instance Approach Fails Here

Counting requests using an in-memory counter local to one specific application instance only limits requests that happen to land on that one instance — with multiple instances behind a load balancer, a client's requests are spread across all of them, meaning each instance's local count only ever sees a fraction of that client's true total request rate.

### 🔧 The Fix

Use a shared, centralized store, commonly Redis, that every instance reads from and writes to when checking and incrementing a client's request count, so the limit is enforced against the client's true total rate across all instances combined, not just whatever fraction happened to land on any one specific instance.

### 💎 Good to Know: This Is the Exact Same Shared-State Requirement as the Multi-Server Real-Time Scenario From Earlier

This mirrors the exact reasoning from the Real-Time & Socket.io Scenarios chapter's multi-server question — any piece of state that needs to be correct across multiple independent instances requires a shared, external store that all of them can consistently read from and write to, rather than something local and instance-specific.

---

## 4. Design the backend for a "like" button on a post that could receive millions of clicks in a short burst — what are the main risks, and how would you address them?

### 📖 Introduction

A single like click is trivial on its own — the actual design challenge here is entirely about handling extreme concurrency on one shared piece of data.

### ⚠️ The Main Risk

Millions of near-simultaneous requests all attempting to increment the same single counter, for the same popular post, at once — directly writing every single one of these as an immediate, synchronous update straight to a database creates massive contention on that one specific row, exactly the kind of bottleneck covered generally in the Database Scenarios chapter of this guide.

### 🔧 How to Address It

Buffer likes through a fast, in-memory layer or queue first, rather than writing each one synchronously and individually straight to the primary database, then periodically flush an aggregated batch update to the actual persistent count, smoothing out the burst instead of hitting the database with the full, instantaneous peak. Ensure a given user's like is only counted once even under retries or duplicate requests — an idempotency concern, from this chapter's closing payment-processing question, applied here to prevent one user's click from being double-counted.

### 💎 Good to Know: This Is a Small-Scale, Concrete Instance of the Burst-Tolerance Design From the Scalability Scenarios Chapter

Buffering and smoothing out a sudden burst rather than requiring the underlying store to handle its full instantaneous peak is the exact same idea as the burst-tolerance design question from the Scalability Scenarios chapter of this guide — just applied here to one very specific, concrete feature.

---

## 5. Design a system for processing and storing file uploads that need to be virus-scanned before being made available to other users — walk through the flow.

### 📖 Introduction

The core design principle here is that an uploaded file must not be trusted or exposed until it's actually been verified.

### 🔧 The Flow

Accept the upload and store it in a location that isn't yet publicly or generally accessible to other users — an unverified, quarantined state. Queue the file for scanning asynchronously, from the queue-based processing pattern covered throughout this subject, rather than making the uploader wait synchronously for a scan that could take a meaningful amount of time. Once the scan completes and the file is confirmed clean, move or mark it as available, only now making it actually reachable by other users; if the scan finds a problem, the file is rejected and never made available at all.

### 🎯 What This Design Deliberately Prevents

A malicious file being briefly, or entirely, accessible to others before scanning genuinely completes — the "quarantine until verified" ordering is the entire point of this design, directly related to the file-upload validation reasoning covered in the File Upload & Storage Scenarios chapter of this guide.

### 💎 Good to Know: "Uploaded" and "Available to Others" Should Never Be the Same Moment for Unverified Content

This is the structural fix underlying the earlier File Upload & Storage Scenarios chapter's misleading-file-extension question — rather than only validating a file's content type, this design goes a step further and ensures nothing is exposed at all until it's actually been fully verified safe.

---

## 6. Design an audit-logging system that needs to reliably capture every significant action in the application without slowing down the actions themselves.

### 📖 Introduction

The tension in this question is explicit in its own wording — reliable and complete, but without adding latency to the action being logged.

### 🔧 How to Design for This

Write the audit log entry asynchronously, off the critical path of the action itself — the action completes and returns to the user without waiting for the audit log write to actually finish, directly avoiding adding that write's latency to the user-facing action. Use a durable queue between the action and the actual audit log write, so that even if the logging step temporarily fails or the system briefly restarts, the entry isn't silently lost, only delayed.

### 🎯 The "Reliably Capture Every Action" Requirement

Given that "reliably capture every action" is explicitly required, the asynchronous write can't simply be "fire and forget" with no durability guarantee at all — the queue itself needs to be persistent enough that a crash between the action happening and the log actually being written doesn't just quietly drop that entry.

### 💎 Good to Know: This Is the Same Async-Off-the-Critical-Path Principle as This Chapter's Notification System Design

Moving genuinely necessary but non-blocking work off the main request path, while still ensuring it reliably happens, is the same underlying idea as the notification system design earlier in this chapter — the difference here is that audit logging additionally can't tolerate ever being silently skipped, which is what specifically demands the added durability.

---

## 7. Design a feature that shows a user "who's currently online" among their contacts, updating in near real time — what are the key design decisions and their tradeoffs?

### 📖 Introduction

This closing real-time design question draws directly on the Real-Time & Socket.io Scenarios chapter of this guide.

### 🔧 Key Design Decisions

Track online status using an active real-time connection, from the Networking guide's Web Communication chapter — a user is considered online for as long as their connection remains open, and offline once it closes or is detected as dead via a heartbeat, from earlier in this guide's Real-Time & Socket.io Scenarios chapter. When a user's status changes, push that update specifically to their contacts who are also currently online and actively viewing something that would display it, rather than to every user in the system regardless of relevance.

### ⚖️ The Tradeoff

Genuinely instant, connection-based online status is more resource-intensive to maintain at scale, from the connection-holding cost discussion in the Web Communication chapter, than a simpler, periodic "last seen" approach that only updates status occasionally rather than the instant a connection actually opens or closes — worth deciding deliberately whether truly instant status is worth that added cost for this specific feature, or whether a slightly delayed, cheaper approximation is genuinely good enough.

### 💎 Good to Know: "Near Real Time" Is Itself a Deliberate Scope Decision, Not Just a Technical Detail

The word "near" in this question's own framing is doing real work — deciding how close to instant a feature genuinely needs to be, rather than defaulting to the most real-time possible implementation, is itself part of the actual design decision, echoing the "match the tool to the actual requirement" theme from the Networking guide's Web Communication chapter.

---

## 8. You're asked to design a system knowing it will need to support 100x its current scale within two years — how does designing with that constraint in mind change your approach today, versus designing only for current needs?

### 📖 Introduction

This question closes the loop on the entire Scalability Scenarios chapter of this guide, now asked from the design side instead of the diagnostic side.

### 🔧 How This Changes the Approach

Avoid choices that are cheap now but genuinely hard to change later — a data store or architecture that would require a full rewrite to scale, rather than one that can grow incrementally, becomes a much more expensive mistake with a known 100x target ahead than it would be for a system with no particular growth expectation. Design the pieces most likely to become bottlenecks, the database and any genuinely stateful components, from the Scalability guide, with a real scaling path in mind from the start, even if that specific scaling work isn't actually done yet.

### 🎯 What Doesn't Need to Change

Not everything needs to be over-engineered for 100x scale on day one — components genuinely far from the eventual bottleneck can still be built simply for current needs, since prematurely scaling every single piece wastes effort on parts that were never actually going to be the limiting factor.

### 💎 Good to Know: This Is About Avoiding Expensive Dead Ends, Not Building Everything at 100x Scale Immediately

The actual skill this question is testing is distinguishing between decisions that are genuinely expensive to reverse later, worth getting right now, and decisions that are cheap to change later, safe to leave simple for now — not defaulting to over-engineering everything just because a large future number was mentioned.

---

## 9. Design an idempotent payment processing endpoint that must never charge a customer twice, even if the client retries the same request multiple times due to a network timeout.

### 📖 Introduction

This closes the entire subject with its highest-stakes example of a theme that's recurred constantly throughout it — idempotency, referenced from the API & Backend Scenarios, File Upload & Storage, and Frontend & React Scenarios chapters, now front and center in the one context where getting it wrong costs real money.

### ⚠️ Why This Is Genuinely Hard

A network timeout is fundamentally ambiguous from the client's perspective — the client genuinely can't tell whether the original request failed before the charge happened, or whether the charge actually succeeded and only the response confirming it back to the client was lost in transit. A naive retry, without any additional safeguard, risks a second, genuinely duplicate charge in exactly this ambiguous case.

### 🔧 The Design

Require the client to include a unique identifier, an idempotency key, generated once per genuine payment attempt and reused on any retry of that exact same attempt. The server checks whether it's already processed a request with that specific key before — if it has, it returns the original, already-known result without charging again at all; if it hasn't, it processes the payment normally and records the key and result together as a single atomic operation, so a concurrent or retried request checking the same key can't slip through in the gap between checking and recording.

### 💎 Good to Know: This Closing Question Is a Concrete Payoff for a Concept That's Been Building Across This Entire Subject

Every earlier idempotency reference throughout this subject, the batch-endpoint redesign, the multi-part upload resume, the duplicate form submission, was building toward this exact same underlying pattern — a unique identifier per genuine attempt, checked and recorded atomically before acting, is the general solution, and payment processing is simply the context where the cost of getting it wrong is the most immediate and concrete.
