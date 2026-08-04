---
title: Scalability Scenarios
description: Reasoning through a system that needs to handle 10x the load.
sidebar_position: 9
---

# Scalability Scenarios

## 1. Your application currently handles your normal traffic fine, but you're told to prepare it for a marketing campaign expected to bring 10x the usual traffic next week — walk through how you'd approach this with limited time.

### 📖 Introduction

With limited time, the goal is finding the system's actual weakest point, not attempting to improve everything at once.

### 🔍 How to Approach It

Identify the most likely bottleneck first, rather than treating every part of the system as equally at risk — in most typical applications, the database is the hardest part to scale quickly, covered generally in the Scalability guide's database chapter, while application servers are usually the easiest to add more of on short notice. Load test specifically at the expected 10x level, not just a modest increase, to find where the system actually starts to struggle rather than guessing.

### 🎯 Prioritizing With Limited Time

Focus effort on whatever the load test actually reveals as the genuine bottleneck, and have a mitigation ready even if it's not a complete fix — a cache in front of the most expensive database queries, from the Caching & Redis Scenarios chapter of this guide, can meaningfully reduce load with far less effort than a deeper architectural change in the time available.

### 💎 Good to Know: A Short Timeline Means Prioritizing the Biggest Realistic Risk, Not Full Coverage

With genuinely limited time, attempting to harden every part of the system equally usually means nothing gets hardened enough — the practical approach is finding and addressing the single most likely failure point first, and accepting some remaining risk elsewhere rather than spreading effort too thin to fix anything properly.

---

## 2. During a traffic spike, your database becomes the bottleneck while your application servers still have headroom — what are your options, from quickest to most involved?

### 📖 Introduction

This scenario is directly related to the "too many connections" and CPU-spike questions from the Database Scenarios chapter of this guide, but framed specifically around the range of available responses.

### 🔧 Quickest Options

Add caching in front of the most frequently run, expensive queries, reducing how often the database is actually hit for the same data, covered generally in the Caching & Redis Scenarios chapter of this guide. Identify and fix any specific slow or inefficient query that's disproportionately contributing to the load, from the Database Scenarios chapter's CPU-spike question.

### 🔧 More Involved Options

Add a read replica to offload read traffic from the primary database, covered generally in the Scalability guide's database chapter. For a more fundamental fix, consider whether the data or workload genuinely needs to be partitioned or sharded across multiple databases, a significantly larger architectural change reserved for when the simpler options are already exhausted.

### 💎 Good to Know: Application Server Headroom Doesn't Help a Database Bottleneck at All

More application servers simply means more requests can be generated concurrently — if the database is already the limiting factor, adding application server capacity can actually make the database bottleneck worse, not better, by increasing the rate at which it's asked to do work.

---

## 3. You're adding more application server instances to handle load, but overall throughput isn't improving proportionally — what would you investigate?

### 📖 Introduction

Horizontal scaling, from the Scalability guide, is supposed to add capacity roughly proportionally — when it doesn't, something else is capping the actual gain.

### 🔍 What to Investigate

Whether a shared resource behind all the application instances, the database, from the previous question, or a cache, is the real bottleneck, meaning more application servers just means more instances competing for the same limited, unchanged shared resource rather than genuinely more total capacity. Whether the load balancer in front of the instances is actually distributing traffic evenly across all of them, since an uneven distribution would mean some instances are still overloaded even while others sit comparatively idle.

### 💎 Good to Know: Scaling One Layer Only Helps if That Layer Was Actually the Bottleneck

This is a direct, practical instance of the general principle that scaling the wrong layer doesn't help — adding application servers only meaningfully increases throughput if the application layer itself was genuinely the limiting factor, which is exactly what needs to be confirmed rather than assumed.

---

## 4. A specific feature works fine at normal scale but falls over completely once usage crosses a certain threshold — how would you find the actual breaking point and the reason for it?

### 📖 Introduction

A hard, specific threshold, rather than a gradual degradation, often points toward a genuine limit being hit rather than something merely getting incrementally slower.

### 🔍 Finding the Breaking Point

Load test the specific feature at gradually increasing levels, rather than the whole application broadly, to find the exact point where it actually starts failing, and observe what specifically happens at that point — an error message, a resource exhaustion, a timeout — since the nature of the failure itself is often the biggest clue toward the actual cause.

### 🔍 Finding the Reason

A sharp, specific threshold commonly points toward a fixed limit somewhere — a configured maximum on a connection pool, a memory limit, a rate limit, or an algorithmic approach that works fine on a small amount of data but degrades sharply, rather than gracefully, once it crosses a certain size.

### 💎 Good to Know: A Sharp Threshold Is a More Useful Clue Than a Gradual Slowdown

A feature that gradually gets worse points toward a resource being incrementally more contended as load rises; a feature that works fine and then suddenly, sharply breaks at a specific point points much more strongly toward an actual fixed limit being hit — worth using that distinction to focus the investigation.

---

## 5. Your system handles steady traffic well but consistently struggles with sudden, unpredictable bursts — how would you design for burst tolerance without permanently over-provisioning for it?

### 📖 Introduction

The explicit constraint — burst tolerance without permanent over-provisioning — is what makes this a genuinely interesting design question rather than a simple "add more capacity" answer.

### 🔧 How to Design for This

Use autoscaling, adding capacity automatically in response to actual, rising load rather than keeping that extra capacity running permanently, covered generally in the Scalability guide. Use a queue to absorb a sudden burst of work, letting it be processed at a sustainable rate rather than requiring the system to instantly handle the full peak the moment it arrives — smoothing out a burst over a slightly longer window instead of needing capacity to match the burst's true instantaneous peak.

### 🎯 The Underlying Tradeoff

Autoscaling and queueing both trade a small amount of response delay, the time it takes to scale up or the time work spends waiting in a queue, for meaningfully lower cost during the far more common, non-burst periods — a deliberate, reasonable tradeoff as long as that added delay is genuinely acceptable for the use case.

### 💎 Good to Know: Burst Tolerance Is About Absorbing and Smoothing, Not Just Being Bigger

The point of this scenario isn't "have enough capacity for the worst possible burst at all times" — it's specifically about designing the system to gracefully absorb and smooth out an unpredictable spike using elasticity and buffering, rather than paying for permanent peak capacity that sits mostly idle the rest of the time.

---

## 6. You're asked whether the system can currently handle a hypothetical 10x traffic increase, and you genuinely don't know — how would you go about answering that question with actual evidence rather than a guess?

### 📖 Introduction

"I don't know" is an honest starting point — this question is about the process that turns it into an actual, evidence-backed answer.

### 🔍 How to Get an Actual Answer

Load test the system at a genuinely simulated 10x traffic level, covered generally in the Performance Optimization guide's load-testing chapter, rather than relying on intuition about how the system "probably" behaves under load it's never actually experienced. Identify, from that test, exactly where the system first starts to fail or degrade, and at what specific point — the same throughput-limit reasoning used throughout the Scalability and Performance Optimization guides.

### 🎯 What a Good Answer Actually Looks Like

Rather than a plain yes or no, a genuinely useful answer names the specific first bottleneck the test reveals, the load level at which it starts to matter, and what it would take to address it — turning a vague hypothetical into a concrete, actionable finding.

### 💎 Good to Know: "Probably Fine" Without a Test Is Not the Same Claim as "Tested and Confirmed"

This closing distinction runs throughout this entire chapter — an untested assumption about scaling behavior is genuinely just a guess, however confident it sounds, and the only way to convert it into a real, defensible answer is to actually go measure it under realistic conditions.

---

## 7. One specific downstream dependency can't scale as fast as the rest of your system, and it's becoming the limiting factor for how much traffic you can handle overall — what are your options?

### 📖 Introduction

A system is only as scalable as its least scalable required dependency — this question is about what to do when you've found that dependency.

### 🔧 Options

Reduce how much load actually reaches that specific dependency — caching its results where appropriate, from the Caching & Redis Scenarios chapter of this guide, or batching multiple individual calls into fewer, larger ones if the dependency supports that. If the dependency simply can't keep up no matter how its usage is optimized, consider whether the system can tolerate calling it asynchronously, queueing the work and processing it at a rate the dependency can actually sustain, rather than requiring it to keep pace with your system's full incoming rate in real time. If it's a third-party dependency entirely outside your control, this becomes a conversation about whether a different provider, or an entirely different approach that doesn't depend on it as heavily, is actually necessary.

### 💎 Good to Know: A Rate-Limiting Dependency Sets a Real Ceiling on the Rest of the System

However well the rest of your system scales, a hard dependency that can't keep pace effectively caps your overall throughput at whatever that dependency can sustain — recognizing this early changes the conversation from "how do we scale everything" to "how do we work around this one specific, real limit."

---

## 8. After scaling out to more instances, you start seeing bugs that never happened when you ran a single instance — what class of problem does this usually point toward?

### 📖 Introduction

This is a specific, well-known category of bug that only exists once more than one instance of something is running at the same time.

### 🎯 The Class of Problem

Race conditions and shared-state assumptions — code that was written assuming it's the only thing ever running, or the only thing ever touching a particular piece of state at a given moment, can behave completely correctly with a single instance and break in subtle, hard-to-reproduce ways once multiple instances are genuinely running concurrently and potentially acting on the same data or resource at the same time.

### 🔍 Common Specific Examples

Two instances processing what should have been a single, unique scheduled job simultaneously because nothing coordinates which instance should actually run it. Two instances both reading, then separately writing back, the same piece of shared data, each unaware of the other's concurrent change — directly related to the two-services-overwriting-updates scenario from the Database Scenarios chapter of this guide.

### 💎 Good to Know: This Is Exactly the Stateless-vs-Stateful Tension Covered Throughout the Scalability Guide

Horizontal scaling assumes each instance can operate largely independently — any code that quietly assumes it has exclusive access to something, without explicit coordination, is exactly the kind of hidden, single-instance assumption that horizontal scaling reliably exposes.

---

## 9. Leadership wants to know the actual cost tradeoff of scaling to support a hypothetical growth target — how would you approach putting together that answer?

### 📖 Introduction

This closes the chapter with a question that's as much about communicating tradeoffs clearly as it is about the technical scaling work itself.

### 🔧 How to Approach It

Start from the same evidence-based approach as the earlier hypothetical-10x question in this chapter — load testing and bottleneck identification — to know concretely what actually needs to change to support the target, rather than estimating costs against a vague, untested plan. Translate each required change into an actual cost, additional infrastructure, engineering time for any needed architectural work, and weigh that against the realistic timeline the growth target actually requires.

### 🎯 Presenting the Tradeoff

Present this as a genuine tradeoff, not just a number — cost scales differently depending on how aggressively and how soon the growth target needs to be supported, and leadership benefits from seeing that relationship explicitly rather than a single, opaque estimate with no visible reasoning behind it.

### 💎 Good to Know: A Credible Cost Estimate Is Downstream of Actually Knowing Where the Bottlenecks Are

An estimate built on genuine, tested findings about where the system actually breaks and what it takes to fix it is meaningfully more credible, and more useful for real decision-making, than one built on a general sense of "scaling is expensive" — the technical rigor from earlier in this chapter is what makes this final, business-facing answer actually trustworthy.
