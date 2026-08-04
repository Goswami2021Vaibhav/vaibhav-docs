---
title: REST API Principles
description: Resources, statelessness, and the constraints that define REST.
sidebar_position: 2
---

# REST API Principles

## 1. What does "REST" actually stand for, and what are its core architectural constraints?

### 📖 Introduction

This chapter turns the previous chapter's abstract "good API" principles into REST's actual, named architectural rules.

### 📜 What It Stands For

REpresentational State Transfer — coined by Roy Fielding in his 2000 doctoral dissertation.

### 🏗️ The Core Constraints

Client-server separation, covered later in this chapter. Statelessness, covered next. Cacheability. Uniform interface. Layered system. And an optional sixth, code-on-demand, rarely relevant in practice. The first five are the ones that matter for a typical API.

### 💎 Good to Know: REST Is a Style, Not a Protocol With a Formal Spec to Validate Against

REST is an architectural style — a set of constraints that, when followed, produce beneficial properties like scalability, simplicity, and evolvability. This is exactly why "RESTful" is more of a spectrum than a binary, a theme this chapter returns to directly later on.

---

## 2. Why does statelessness matter so much in REST, and how does it enable horizontal scaling?

### 📖 Introduction

The Scalability guide covers this in depth from the scaling side — this is the same principle from REST's own architectural angle.

### 🔄 Why It Matters in REST

Each request from client to server must contain all the information needed to understand and process that request — the server doesn't rely on any stored context from previous requests.

### 📈 How It Enables Scaling

Directly the statelessness prerequisite from the Scalability guide's Application Scalability chapter — since no server instance holds onto client-specific state between requests, any instance can handle any request, letting a system scale out horizontally without needing session affinity or sticky routing.

### 💎 Good to Know: One Idea, Two Names

REST didn't invent this concept — it just names it as one of its foundational constraints. Worth recognizing this as the same idea showing up under two different framings: REST's architectural constraint, and a horizontal-scaling prerequisite.

---

## 3. What does "resource-based" thinking mean, and how does it differ from RPC-style design?

### 📖 Introduction

This distinction is the root of the chapter's closing production scenario, and it's worth being precise about the difference upfront.

### 📦 Resource-Based

The API is organized around nouns — things like users, orders, products — and a small, fixed set of standard operations, GET/POST/PUT/DELETE, is applied consistently to each resource.

### 🔧 RPC-Style (Remote Procedure Call)

The API is organized around verbs or actions — `/createUser`, `/getUserOrders`, `/cancelOrder`. Each endpoint is essentially a named function being called remotely.

### 💎 Good to Know: This Distinction Is What Makes the Closing Scenario Recognizable

An endpoint named `/getUserOrders` is a textbook RPC-style design smuggled into what's supposed to be a resource-based API — recognizing *why* that's a mismatch, not just that it "looks weird," is exactly what this chapter's closing question tests.

---

## 4. What is the "uniform interface" constraint, and why does it matter?

### 📖 Introduction

This is really the constraint most people mean when they informally describe an API as "RESTful."

### 🔌 What It Is

Every resource is interacted with through the same, standardized mechanism — the same set of HTTP methods, the same way of identifying a resource via a URL, the same way of representing it, typically JSON — regardless of which specific resource you're working with.

### 🎯 Why It Matters

A consumer who's learned how to interact with one resource — GET to read, POST to create, DELETE to remove — can apply that exact same knowledge to any other resource in the API without relearning anything. Directly the predictability payoff from the previous chapter, now given its architectural justification.

### 💎 Good to Know: This Is the Core of What People Mean by "RESTful" in Practice

A resource-oriented API using a small, standard set of HTTP methods consistently is, in large part, what uniform interface actually requires.

---

## 5. What does client-server separation mean, and why does it matter even within a single team?

### 📖 Introduction

This is a specific case of a much broader software-engineering principle, just named explicitly as an architectural requirement rather than left as general advice.

### 🔀 What It Means

The client, UI and consumer logic, and server, data and business logic, are independently developable and replaceable. The client doesn't need to know how the server stores or processes data, and the server doesn't need to know how the client renders or uses the response, as long as the agreed interface, the contract from the previous chapter, is honored.

### 🏢 Why It Matters Even Within One Team

Even if the same team builds both sides, this separation still lets the frontend and backend evolve, deploy, and scale independently, echoing the Scalability guide's application-layer scaling discussion. A tightly entangled frontend and backend makes it genuinely hard to change one without touching the other.

### 💎 Good to Know: This Is Separation of Concerns, Named as an Architectural Requirement

REST just makes this explicit rather than leaving it as a best practice teams might or might not follow.

---

## 6. Why does REST treat cacheability as an architectural constraint rather than just an optimization detail?

### 📖 Introduction

The Performance Optimization guide covers the mechanics of caching in depth — this question is about why REST bakes the *concept* into its architecture in the first place.

### 🏗️ Why It's Architectural, Not an Afterthought

REST requires that every response explicitly indicate whether it's cacheable, and for how long, as part of the response itself. This isn't bolted on for speed later — it's built into the uniform interface so that any intermediary, a browser, a CDN, or the layered system covered next, can correctly decide whether to cache a response without needing special, out-of-band knowledge about that specific endpoint.

### 💎 Good to Know: This Is the Architectural "Why" Behind the Performance Optimization Guide's Caching Chapter

`Cache-Control` headers and `ETag`s, covered in depth in the Performance Optimization guide, are the practical implementation of REST's cacheability constraint. This question explains why that constraint exists architecturally; that guide covers how to actually implement it.

---

## 7. What is a "layered system" in REST, and how does it let intermediaries sit transparently between client and server?

### 📖 Introduction

This is the constraint that makes an entire category of infrastructure, covered throughout the Scalability guide, possible to add without modifying the API itself.

### 🧱 What It Is

A client doesn't need to know, or be able to tell, whether it's talking directly to the origin server or through one or more intermediaries — a load balancer, a CDN, an API gateway, covered in the Scalability guide's Load Balancing and Microservices chapters. Each layer only needs to understand the layer immediately adjacent to it.

### 🔍 How It Lets Intermediaries Sit Transparently

Because the interface is uniform and self-descriptive, covered earlier in this chapter, a proxy or gateway can inspect and act on a request or response — caching it, load balancing it, rate limiting it — without needing any special integration beyond standard HTTP.

### 💎 Good to Know: This Is What Makes the Scalability Guide's Infrastructure Layer Possible at All

A genuinely stateful, non-uniform API would make inserting CDNs, load balancers, and gateways transparently in front of it dramatically harder — layered system is the specific constraint that removes that obstacle.

---

## 8. What is HATEOAS, and why is it one of REST's least practically adopted constraints?

### 📖 Introduction

This is a genuinely honest, common admission in the industry, worth understanding rather than glossing over.

### 🔗 What It Is

Hypermedia As The Engine Of Application State — the idea that an API response should include links to related or next-possible actions, an order response including a link to "cancel this order" if it's currently cancelable, letting a client navigate the API dynamically by following links, the way a human browses a website, rather than needing to hardcode every possible URL structure in advance.

### 🎓 Why It's Theoretically Important

It's what makes an API genuinely self-descriptive and discoverable — a client theoretically never needs out-of-band documentation about URL structures, since the API itself tells you what's possible next at each step.

### 📉 Why It's Least Practically Adopted

It adds real complexity, designing and maintaining a consistent link structure, for a benefit most real-world API clients don't actually need. Most clients are purpose-built for a specific API anyway — a mobile app built specifically against your API already knows its structure through documentation or generated types, rather than needing to discover it dynamically at runtime.

### 💎 Good to Know: Most "RESTful" APIs Don't Actually Implement This

This is exactly why the "truly RESTful versus REST-ish" distinction, covered next, exists as a real, meaningful spectrum rather than a purely academic one.

---

## 9. What's the difference between a "safe" HTTP method and an "idempotent" one?

### 📖 Introduction

This distinction directly determines which methods are safe to automatically retry without risking unintended side effects.

### 🛡️ Safe

A method that doesn't change server state at all — calling it any number of times has no side effects: `GET`, `HEAD`, `OPTIONS`.

### 🔁 Idempotent

A method where calling it multiple times with the same input produces the same end state as calling it once — repeated calls don't cause additional, cumulative changes. `GET`, `PUT`, `DELETE`, and `HEAD` are idempotent; `POST` typically is not.

| Method | Safe | Idempotent |
|---|---|---|
| GET | ✅ | ✅ |
| PUT | ❌ (changes state) | ✅ (repeats produce the same end state) |
| DELETE | ❌ | ✅ (already-deleted stays deleted) |
| POST | ❌ | ❌ (each call typically creates a new resource) |

### 💎 Good to Know: Every Safe Method Is Idempotent, but Not Every Idempotent Method Is Safe

Doing nothing repeatedly is still doing nothing, so safety implies idempotency. PUT and DELETE genuinely change state, just not cumulatively — worth keeping the two properties distinct rather than treating them as synonyms.

---

## 10. Why is GET considered both safe and idempotent, and what happens when a GET endpoint has side effects?

### 📖 Introduction

This is a real, documented historical class of bug, not just a theoretical concern.

### ✅ Why GET Is Both

Reading data shouldn't change anything, making it safe. Reading the same thing twice should return the same result with no additional consequence, making it idempotent.

### ⚠️ Real Problems When GET Has Side Effects

Browsers, CDNs, proxies, and prefetching tools, like the `prefetch` resource hint covered in the Performance Optimization guide, all assume GET is safe, and may call it speculatively, repeatedly, or without the user's explicit intent — a browser prefetching a link the user hasn't even clicked yet. If a GET endpoint actually deletes a record or sends an email as a side effect, these assumptions cause genuinely destructive, unintended actions to happen completely invisibly.

### 💎 Good to Know: "Delete via GET Link" Has Caused Real, Accidental Data Loss

This is a well-documented failure pattern — a web crawler or browser prefetcher followed a plain `<a href="/delete/123">` link exactly as GET's safety contract assumes it's allowed to, with no warning to anyone, and real data got deleted as a result.

---

## 11. What's the actual semantic difference between PUT and PATCH?

### 📖 Introduction

Getting this wrong is a very common, real-world mistake that doesn't crash anything — it just quietly confuses clients.

### 🔄 PUT

Replaces the entire resource with what's provided in the request body. Any field not included in the request is treated, in a fully faithful implementation, as if it should be removed or reset, since the client is providing the complete new representation.

### ✏️ PATCH

Applies a partial update — only the fields actually included in the request body get changed; everything else on the resource stays exactly as it was.

```js
// PUT: the client is providing the FULL new state — omitted fields imply removal
PUT /users/42 { "name": "Alex", "email": "alex@example.com" }

// PATCH: only the included field changes, everything else is untouched
PATCH /users/42 { "email": "alex@newdomain.com" }
```

### 💎 Good to Know: A Common Mistake Is Implementing PUT With PATCH's Semantics

Calling an endpoint PUT while actually only applying a partial update works in the sense that it doesn't crash — but it's technically incorrect, and can genuinely confuse a client that, correctly per the HTTP spec, assumes PUT means "this is the complete new state" and omits fields they intend to clear, only to find those fields were silently left untouched instead.

---

## 12. Why is POST neither safe nor idempotent, and what does that mean for retries?

### 📖 Introduction

This is exactly the gap the idempotency-key pattern, covered in the Request & Response Design chapter of this guide, was built to close.

### ⚠️ Why Not Safe or Idempotent

POST typically creates a new resource — calling it twice with an identical payload typically creates two separate resources, not one, unlike PUT, which would just overwrite the same resource identically both times.

### 🔁 What This Means for Retries

A client that retries a failed or timed-out POST request, exactly the uncertain-outcome scenario covered in the Scalability guide's Distributed Systems chapter, risks creating a duplicate resource if the original request actually did succeed server-side before the response was lost.

### 💎 Good to Know: This Is Exactly Why the Idempotency-Key Pattern Exists

It's a deliberate, application-level workaround for POST's lack of built-in idempotency, letting a client safely retry something that's structurally not idempotent by HTTP's own rules — covered in more depth in this guide's Request & Response Design chapter.

---

## 13. What does it mean for an API to be "truly RESTful" versus merely "REST-ish," and does the distinction matter?

### 📖 Introduction

This resolves the tension raised by HATEOAS's low real-world adoption, covered earlier in this chapter.

### 📏 The Spectrum

Roy Fielding's original definition requires all of REST's constraints, including HATEOAS. Very few real-world APIs that call themselves "RESTful" actually implement hypermedia controls — most implement resource-based URLs, standard HTTP methods, and JSON payloads, but skip HATEOAS entirely. This is sometimes described using the Richardson Maturity Model, a framework describing degrees of REST adherence, from plain RPC-over-HTTP up through full hypermedia.

### 🤔 Does It Matter in Practice?

Mostly not, for the specific missing piece — most real clients don't need HATEOAS's dynamic discoverability, as covered earlier in this chapter. But the *other* constraints — statelessness, resource orientation, proper HTTP method usage — genuinely do matter and are worth following, even if strict REST purism isn't the practical goal.

### 💎 Good to Know: "RESTful" Is Used Loosely in Real Engineering Conversations

It usually means "resource-oriented, uses HTTP methods properly, mostly stateless." Worth knowing the strict academic definition so you're not caught off guard if asked directly, but also worth recognizing that insisting on academic purism in a real production context is rarely the practically useful stance.

---

## 14. What's the difference between REST and RPC-style APIs, and when is an RPC-style endpoint actually the better choice?

### 📖 Introduction

This is the practical, "when would you actually reach for this" follow-up to the resource-versus-action distinction from earlier in this chapter.

### 🔧 When RPC-Style Fits Better, Even Within a RESTful API

Genuine actions that don't map cleanly onto CRUD on a resource. "Cancel this order" isn't really "PUT the order with a canceled field" — it's a distinct action with its own side effects and validation rules. A well-designed hybrid approach often models this as a sub-resource action, `POST /orders/:id/cancel`, which is still resource-oriented in spirit, a POST to a specific, nested resource, while genuinely representing an action rather than a plain CRUD operation.

### 💎 Good to Know: This Connects Directly to the Next Chapter's "Actions That Don't Fit CRUD" Question

Recognizing when a pure, rigid resource model is being forced awkwardly onto a genuine action is a real, practical design skill — the "verb as a sub-resource" pattern is the standard, pragmatic compromise most real APIs actually use, covered in more depth in this guide's API Resource Design chapter.

---

## 15. How would you explain REST's core ideas to someone who's only built ad-hoc, inconsistent endpoints?

### 📖 Introduction

The most effective way to teach REST isn't to present it as an abstract rulebook to memorize.

### 🎯 A Useful Approach

Start from the pain they've probably already experienced — inconsistent endpoint naming, unpredictable behavior, having to read source code to understand a new endpoint, echoing the opening chapter of this guide. Then introduce REST's constraints as the answer to that specific pain, one at a time, rather than as an abstract, academic list: "resources instead of actions" fixes naming chaos; "standard HTTP methods" fixes unpredictable behavior; "statelessness" fixes weird session-dependent bugs.

### 💎 Good to Know: This Framing Works for Real Mentoring, Not Just Interview Answers

Introducing a principle as the solution to a concrete pain point someone has already felt sticks far better than presenting it as an abstract rule to follow "because REST says so."

---

## 16. In production, an endpoint was designed as `POST /getUserOrders` instead of `GET /users/:id/orders` — what does that reveal, and how would you fix it?

### 📖 Introduction

This closes the chapter by connecting REST's abstract principles directly to a real, concrete, fixable mistake.

### 🔍 What It Reveals

This is a textbook RPC-style endpoint smuggled into what's presumably meant to be a resource-oriented API. It violates uniform interface, using POST for what's conceptually a read operation. It breaks the safe/idempotent expectations of a read, meaning a consumer, tooling, or a cache can't safely assume this is a harmless, cacheable GET. And it signals the API likely grew without a consistent design principle actually being applied, very possibly the same root cause behind the previous chapter's closing scenario.

### 🛠️ How to Fix It Without Breaking Clients

Introduce the correct, resource-oriented endpoint, `GET /users/:id/orders`, alongside the existing one, rather than removing the old one outright. Mark the old endpoint as deprecated, using the deprecation-policy concept covered in this guide's API Versioning chapter. Give existing consumers a clear migration path and timeline, and only remove the old endpoint once usage has genuinely dropped to zero or the deprecation window has passed.

### 💎 Good to Know: Fixing a Design Mistake in a Live API Is Never Just "Rename the Endpoint"

It requires applying the previous chapter's backward-compatibility discipline and this guide's later deprecation process, even for what looks like an obviously "correct" fix.
