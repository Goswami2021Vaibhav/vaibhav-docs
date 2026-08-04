---
title: Microservices & Service-Oriented Architecture
description: When to split a monolith, service boundaries, and the cost of going distributed.
sidebar_position: 9
---

# Microservices & Service-Oriented Architecture

## 1. What is a monolith, and what genuine advantages does it have over microservices?

### 📖 Introduction

This final chapter is where nearly every concept from the rest of this guide gets applied at once, in the architecture decision that most concretely embodies "how much distribution do we actually need."

### 🏛️ What a Monolith Is

A single, unified application and codebase containing all the functionality of the system, typically talking to one shared database.

### ✅ Genuine Advantages Easy to Overlook

Simpler to develop locally — one codebase to run, no need to spin up multiple services to test a feature. Simpler to deploy — one deployable artifact, none of the operational complexity covered later in this chapter. No network overhead between components — a function call within the same process is dramatically cheaper and more reliable than a network call, directly the distributed-systems fallacies covered in the previous chapter. And genuine transactional consistency for free — the saga-pattern complexity covered later in this chapter simply doesn't exist when everything shares one database transaction.

### 💎 Good to Know: These Advantages Get Underweighted Because Microservices Are the Trendy Default

Worth explicitly naming them here, since the rest of this chapter, and this entire guide's emphasis on premature scaling from its first chapter, exists precisely to counterbalance that default assumption with an honest accounting of what's actually being traded away.

---

## 2. What problem are microservices actually meant to solve, and what signs indicate a monolith has genuinely outgrown itself?

### 📖 Introduction

Size alone isn't the signal that matters here — the real signs are more specific than "the codebase feels big."

### 🎯 What They're Meant to Solve

Letting different parts of a system be developed, deployed, and scaled independently. A team can deploy their service without coordinating a release with every other team. A specific, high-traffic part of the system, per the bottleneck-identification principle from the first chapter of this guide, can be scaled independently without scaling the entire application. Different parts can use different technology, echoing the polyglot persistence discussion in the Database Scalability chapter, now applied to entire services.

### 🚩 Genuine Signs of Outgrowing a Monolith

Deploying one small change requires coordinating and testing the entire application because everything is too interconnected. Different teams are genuinely blocked or stepping on each other working in the same codebase. One specific part of the system has genuinely different scaling needs than the rest but can't be scaled independently because it's bundled with everything else.

### 💎 Good to Know: "It Feels Big" Is Not a Genuine Signal on Its Own

Size alone isn't the problem microservices solve — the advantages from the previous question still apply to a large but well-organized monolith. The real signs are specifically about deployment coupling, team coordination friction, and differential scaling needs, not raw line count or file count.

---

## 3. What's the risk of adopting microservices too early?

### 📖 Introduction

This is the premature-scaling theme from the first chapter of this guide, at its most costly and consequential.

### ⚠️ The Risk

Taking on all of microservices' genuine operational complexity — network overhead, distributed transactions, deployment and observability complexity, all covered later in this chapter — before the team or product has actually reached the point where a monolith's genuine limitations, covered in the previous question, are actually being hit. Paying the full cost upfront for benefits that don't yet apply.

### 💎 Good to Know: This Complexity Is Genuinely Harder to Walk Back Than Most Premature Decisions

Architectural complexity taken on too early is harder to undo than almost any other premature decision covered anywhere in this guide, since it involves splitting apart data ownership, rebuilding inter-component communication, and restructuring how teams and deployments work — a decision worth making deliberately, based on the genuine signals from the previous question, not fashion.

---

## 4. How would you determine where to draw service boundaries when splitting a monolith apart?

### 📖 Introduction

This is genuinely one of the hardest, most consequential decisions in this entire chapter.

### 🗺️ The Approach

Draw boundaries around genuine business or domain capabilities — order management, user authentication, payment processing — rather than technical layers, like "a database service" or "a business-logic service." Each service should own a cohesive, complete piece of business functionality, including its own data, covered later in this chapter, rather than being an arbitrary technical slice that still needs constant coordination with other services to accomplish anything meaningful on its own.

### 💎 Good to Know: Getting This Wrong Produces Either Chattiness or Coupling

This directly echoes the shard-key-choice difficulty from the Database Scalability chapter, at an even larger architectural scale. Getting boundaries wrong means either services that are too fine-grained, requiring constant, chatty inter-service communication for every simple operation, or too coarse, services that are still tightly coupled — the distributed monolith trap covered next.

---

## 5. What is a "distributed monolith"?

### 📖 Introduction

This is the practical, common consequence of getting the service-boundary decision from the previous question wrong.

### 🧩 What It Is

A system that's been technically split into multiple separate services, but where those services are still so tightly coupled — shared databases, covered later in this chapter, or synchronous call chains requiring multiple services to be deployed and updated together for a single change — that they can't actually be developed, deployed, or scaled independently, the defining benefit of microservices, despite all the operational overhead of being physically separate services.

### 💥 Why It's the Worst of Both Worlds

None of the monolith's simplicity from the first question of this chapter — no local, single-codebase development, and genuine network overhead and distributed-systems complexity now genuinely in play — while also none of the genuine independence benefits from the second question — still can't deploy one service without coordinating with others, still can't scale independently since they're bottlenecked by a shared resource.

### 💎 Good to Know: This Usually Results From Splitting Along the Wrong Lines

A distributed monolith is usually the result of splitting a system along technical layers rather than business capabilities, as covered in the previous question, rather than a deliberate, coherent architectural choice — worth recognizing this as a genuine, common failure mode, not a rare edge case.

---

## 6. What's the difference between synchronous and asynchronous communication between services, and when would you choose each?

### 📖 Introduction

Most real microservices systems use both, chosen per interaction rather than exclusively one or the other.

### ↔️ Synchronous (REST/gRPC)

The calling service sends a request and waits for a response before continuing. Simple to reason about, a direct, immediate answer, but introduces the exact chain-of-failure risk covered in the circuit breaker discussion in the High Availability & Fault Tolerance chapter — if the called service is down or slow, the caller is directly, immediately affected. Appropriate when the caller genuinely needs an immediate answer to continue, like checking inventory before confirming an order.

### 📬 Asynchronous (Message-Queue-Based)

The calling service publishes an event or message and moves on without waiting — directly the entire subject of the Asynchronous Processing chapter. More resilient to a downstream service being temporarily down, but introduces eventual-consistency considerations, covered in the Distributed Systems chapter, since the other service processes the work at its own pace, not immediately.

### 💎 Good to Know: This Is the Same Sync-vs-Async Decision From the Asynchronous Processing Chapter, at the Inter-Service Level

A genuinely immediate, blocking need calls for sync. Something that can happen "eventually," like sending a welcome email after signup via fan-out, is a natural fit for async — the same underlying decision, just now framed specifically between services rather than within one.

---

## 7. What is an API gateway, and what responsibilities does it typically centralize?

### 📖 Introduction

The Load Balancing chapter briefly mentioned Layer 7 routing decisions — this is the full, dedicated coverage of the pattern that builds on that.

### 🚪 What It Is

A single, centralized entry point that sits in front of all of a system's microservices, receiving every external client request and routing it to the appropriate internal service, or services, behind it.

### 📋 Responsibilities It Centralizes

**Routing** — directly the Layer 7 concept from the Load Balancing chapter, applied at the service-boundary level rather than just instance level. **Authentication and authorization** — verifying a request's identity and permissions once, at the gateway, rather than every individual service needing to reimplement the same logic, covered in depth in the Web Security guide's Authentication & Authorization chapter. **Rate limiting** — covered from the infrastructure-layer angle in the Load Balancing chapter and the API-security angle in the Web Security guide.

### 💎 Good to Know: This Avoids Duplicated, Potentially Inconsistent Logic Across Services

Without a gateway, every individual service would need to independently implement auth and rate limiting — duplicated logic, and a genuine risk of inconsistent implementation across services, echoing the Web Security guide's "don't reinvent this yourself" caution, now per-service instead of per-project. Centralizing it at the gateway means these concerns are handled consistently, once, for every request, regardless of which internal service ultimately handles it.

---

## 8. What is service discovery, and why does it become necessary with multiple instances of multiple services?

### 📖 Introduction

This solves, for internal traffic, essentially the same problem a load balancer solves for external traffic.

### 🔍 What It Is

A mechanism that lets a service dynamically find the current network location of another service's actual running instances, rather than relying on a hardcoded, static address.

### 🎯 Why It Becomes Necessary

Once you have multiple instances of multiple services, applying the horizontal scaling from Chapter 2 to every individual microservice independently, instances are constantly being added or removed — auto-scaling, deployments, failover covered in the Load Balancing chapter. A hardcoded address would go stale almost immediately. Service discovery maintains an up-to-date, dynamic registry of which instances of which services are currently healthy and reachable, letting a calling service always find a current, valid target.

### 💎 Good to Know: This Is the Same Concept as Load Balancing, Applied Internally

This is genuinely the same underlying problem the Load Balancing chapter's load balancer solves for external, client-facing traffic — service discovery is essentially the same concept applied to internal, service-to-service traffic. Many real systems actually use a load balancer, or a similar mechanism, for both purposes simultaneously, just with different registries for external clients versus internal service-to-service calls.

---

## 9. Why does a distributed transaction across multiple services need a fundamentally different approach than a local database transaction?

### 📖 Introduction

The Distributed Systems chapter already introduced why this is hard in general — this restates it specifically in the microservices context, as the direct setup for the saga pattern covered next.

### ⚠️ Why It's Fundamentally Different

A local database transaction relies on the database's own internal atomicity guarantee. But the principle covered in this chapter, that each service owns its own database, means an operation spanning multiple services — placing an order: reserve inventory in the inventory service, charge payment in the payment service, create a shipment in the shipping service — can't rely on one shared database's transaction mechanism at all. Each step is a separate operation against a separate service and database, and there's no single, built-in way to guarantee all three either all succeed or all roll back together, atomically, across that network boundary.

### 💎 Good to Know: Per-Service Data Ownership Directly Creates the Need for the Saga Pattern

The "each service owns its own database" principle, genuinely valuable for independence, directly creates the need for the saga pattern, covered next, as its necessary counterpart. You can't have both genuine per-service data ownership and simple, built-in ACID transactions spanning multiple services — the saga pattern is the standard answer to that specific tradeoff.

---

## 10. What is the saga pattern, and how does it maintain consistency without a single distributed transaction?

### 📖 Introduction

This directly resolves the problem raised in the previous question.

### 🔄 What It Is

A sequence of local transactions, one per service involved, where each local transaction publishes an event triggering the next step in the sequence. If any step in the sequence fails, the saga executes a series of compensating actions, essentially "undo" operations, for every step that already succeeded, rather than relying on a single, atomic rollback across all services at once.

### 🎯 A Realistic Example

The order-placement saga from the previous question: if payment charging fails after inventory was already reserved, the saga triggers a compensating action — "release the reserved inventory back to available stock" — rather than a true database-level rollback, since the inventory reservation happened in a completely separate service and database that the payment service's failure has no direct technical connection to.

### 💎 Good to Know: Compensating Actions Are Not the Same Thing as a True Rollback

They're a separate, deliberately designed operation that reverses the business effect of the original step, meaning every step in a saga needs its own, carefully designed compensating action thought through in advance — genuinely more application-level design work than relying on a database's built-in rollback, directly the cost of the tradeoff described in the previous question.

---

## 11. Why should each microservice own its own data and database?

### 📖 Introduction

This is one of the most important, and most tempting-to-shortcut, disciplines in microservices architecture.

### ⚠️ Why Shared Databases Are a Problem

If multiple services directly share access to the same database tables, a change made by one service's code — a schema migration, a change in how a field is used — can silently break another service that also reads or writes that same table, without that other service's team even being aware a change happened. This directly recreates the distributed-monolith coupling covered earlier in this chapter: services that are technically separate deployables but are still tightly, invisibly coupled through shared data.

### 🛠️ The Fix

Each service owns its own, private database or schema that no other service accesses directly. Any other service that needs data owned by a different service must ask for it through that service's own, explicit, versioned API, covered later in this chapter, never by reaching directly into its database.

### 💎 Good to Know: Data Ownership and Service Boundaries Are the Same Decision, Viewed From Two Angles

It's tempting to shortcut this — "just let this other service read that one table directly, it's simpler" — but doing so is precisely how a distributed monolith actually happens in practice.

---

## 12. What happens to data consistency guarantees once each service owns its own database independently?

### 📖 Introduction

This is the direct consequence of the previous question's principle, and it's exactly where the Distributed Systems chapter's abstract concepts become everyday reality.

### ⚠️ What Happens

Since each service's database is now genuinely independent, you lose the single database's built-in, immediate consistency guarantee across service boundaries. Data that conceptually relates to the same business entity — an order's status, which might be reflected in both the order service and a reporting service kept in sync via events — can be momentarily inconsistent between services, following the same eventual-consistency pattern covered formally in the Distributed Systems chapter.

### 💎 Good to Know: This Is Exactly Why the Distributed Systems Chapter Is a Direct Prerequisite Here

A team adopting microservices without internalizing the CAP theorem and eventual consistency will be genuinely surprised and confused by the consistency behavior their own architecture now produces — this is precisely where those abstract distributed-systems concepts become concrete, everyday engineering reality.

---

## 13. What are the observability challenges specific to microservices, and how does distributed tracing address them?

### 📖 Introduction

Debugging a single process and debugging six coordinated processes are genuinely different skills, requiring genuinely different tooling.

### 🕵️ The Challenge

In a monolith, a single request's entire execution path lives within one process, visible in one set of logs or one profiler session, covered in the Performance Optimization guide. In microservices, a single user-facing request might trigger calls across six different services, each with its own separate logs — exactly the closing scenario of this chapter. Understanding where time was actually spent, or where an error actually originated, requires manually correlating logs across several completely separate systems, a genuinely painful, slow process without dedicated tooling.

### 🧵 How Distributed Tracing Addresses It

A unique trace ID is generated at the start of a request and propagated through every subsequent service call that request triggers. A tracing tool then stitches together every service's contribution to that same trace ID into one unified, visual timeline, showing exactly how long each service or step took and where the request actually went, end to end — directly analogous to the APM discussion in the Performance Optimization guide, but specifically solving the cross-service correlation problem microservices introduce.

### 💎 Good to Know: This Is Non-Optional Infrastructure, Not a Nice-to-Have

Without distributed tracing, diagnosing which of six services is actually slow becomes genuinely difficult, manual, error-prone work that scales poorly as the number of services grows.

---

## 14. How do you handle versioning and backward compatibility when one service changes its API?

### 📖 Introduction

Changing a function's signature in a monolith and updating every caller happens atomically, in the same commit — across services, this becomes a genuine, ongoing coordination problem instead.

### ⚠️ The Problem

Service A's team wants to change their API — rename a field, change a response shape — but service B, and possibly C and D, already depend on the current shape, and can't just be updated in perfect lockstep with A, since they're separately deployed, potentially by different teams on different schedules.

### 🛠️ Approaches

Versioned APIs, `/v1/`, `/v2/`, directly echoing the API versioning discussion from the Web Security guide's API Security chapter, now applied internally between services, letting old and new versions coexist during a transition period. Additive-only changes where possible — adding a new field rather than removing or renaming an existing one, so old consumers simply ignore the field they don't know about, rather than breaking. A genuine deprecation period, echoing the Web Security guide's warning that a version without an enforced sunset date effectively means "permanently vulnerable" — here, "permanently maintaining old, unmaintained internal API versions indefinitely."

### 💎 Good to Know: This Is a Recurring Operational Cost a Monolith Simply Doesn't Face

Within a monolith, this coordination happens atomically, in the same deploy. Across services, it's a genuine, ongoing process requiring deliberate planning, not just a code change.

---

## 15. What is Conway's Law, and how does it explain team structure mirroring microservices architecture?

### 📖 Introduction

This is a genuinely useful lens for understanding why an organization's microservices boundaries so often end up matching its org chart.

### 📜 What It Is

The observation, originally from computer scientist Melvin Conway, that organizations design systems that mirror their own communication structure — a system's architecture tends to reflect how the teams building it are actually organized, whether or not that's the deliberate, intended outcome.

### 🏢 Why It Explains Microservices/Team Alignment

If a company has separate teams for "orders," "payments," and "shipping," those teams will naturally tend to build separate, corresponding services for each area — directly the business-capability boundary principle covered earlier in this chapter — mostly because cross-team coordination is genuinely harder than within-team coordination, so each team naturally gravitates toward owning a self-contained piece it can work on without constantly coordinating with everyone else.

### 💎 Good to Know: This Insight Is Sometimes Applied Deliberately, in Reverse

The "inverse Conway maneuver" is where an organization deliberately restructures its teams first, around the desired service boundaries, specifically to make the architecture that naturally emerges from those teams' communication patterns match the intended design, rather than leaving the architecture to organically drift toward whatever the existing, possibly accidental team structure happens to produce.

---

## 16. What's the operational cost of microservices that a team needs to weigh against their scalability benefits?

### 📖 Introduction

This closes the loop on the honest accounting the first question of this chapter opened with.

### 💸 The Costs

**Deployment complexity** — the API gateway, service discovery, and genuinely many more independent deployable units to coordinate and monitor, versus a single monolith deployment. **Network overhead** — every inter-service call pays real latency and reliability cost that a local function call in a monolith simply doesn't. **Debugging difficulty** — the observability challenge covered earlier in this chapter, tracing an issue across multiple services and their separate logs is genuinely harder than debugging one process. **Data-consistency and saga complexity**, covered earlier in this chapter.

### 💎 Good to Know: These Costs Have to Be Weighed Honestly, Not Assumed Away

Microservices' scalability and independence benefits, covered in the second question of this chapter, are genuinely real, but they're not free. A team weighing this decision needs to honestly compare these costs against those actual, concrete benefits for their specific situation, rather than treating microservices as an obviously, unconditionally superior default.

---

## 17. How would you decide whether a new feature belongs in an existing service or warrants its own new service?

### 📖 Introduction

This is the practical, per-feature version of the service-boundary decision covered earlier in this chapter.

### 🧭 A Framework

Does the new feature genuinely belong to an existing service's business capability — it's really just an extension of what that service already owns — or does it represent a genuinely distinct capability with its own data, scaling, or deployment needs that are meaningfully different from any existing service? Does it need to scale independently from everything it would otherwise be bundled with? Would putting it in an existing service create the kind of tight coupling covered earlier in this chapter, forcing that service's team to coordinate releases with an unrelated concern?

### 💎 Good to Know: The Default, Safer Instinct Should Lean Toward an Existing Service

Directly the premature-adoption warning from earlier in this chapter, now applied at the per-feature granularity. Creating a new service is a genuinely bigger, harder-to-reverse commitment than adding a well-scoped feature to an existing service — the bar for justifying a brand-new service should be genuinely high, not the default reflex.

---

## 18. In production, a single user-facing request now triggers calls across six different microservices, and latency has gotten noticeably worse since the migration — walk through how you'd diagnose and address this.

### 📖 Introduction

This closes not just this chapter, but the entire guide — pulling together the architectural themes that have run through all nine chapters.

### 🔍 What This Reveals

A request now pays network overhead, covered earlier in this chapter, for every one of those six inter-service hops, where a monolith would have paid zero network cost for the equivalent internal function calls, covered in the first question of this chapter. This is a genuine, expected cost of the microservices tradeoff — but six hops specifically suggests the service boundaries may be drawn too finely, the overly fine-grained warning from earlier in this chapter about chatty, excessive inter-service communication.

### 🧭 Diagnostic Approach

Use distributed tracing, covered earlier in this chapter, to see exactly which of the six hops is actually contributing the most latency. Is it genuinely spread evenly across all six, pointing toward the sheer number of hops being the root issue? Or is one specific service disproportionately slow, pointing toward a more localized problem within that one service, using this guide's earlier chapters' diagnostic techniques — a database issue from the Database Scalability chapter, a missing cache from the Caching Strategies chapter — rather than a service-boundary problem at all?

### 🛠️ Consider

Could any of these six synchronous calls be converted to asynchronous, covered earlier in this chapter, where the caller doesn't genuinely need to wait for an immediate answer? Could some of these services be genuinely merged back together, if they were split along a boundary that's proving too fine-grained in practice, rather than accepting the ongoing network-overhead cost indefinitely?

### 💎 Good to Know: This Closes the Guide on Its Opening Lesson

Identify the actual bottleneck, using tracing as this chapter's specific tool for a microservices context, before proposing a fix — and recognize that microservices adoption is a genuine tradeoff, not a strictly superior architecture. A system can genuinely become slower, not faster, after a microservices migration if the service boundaries and communication patterns weren't designed carefully — exactly the honest, complete picture this entire chapter, and this entire nine-chapter guide, has been building toward from its very first page.
