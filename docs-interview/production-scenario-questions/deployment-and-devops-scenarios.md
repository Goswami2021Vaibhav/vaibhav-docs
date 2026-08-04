---
title: Deployment & DevOps Scenarios
description: Real deployment failures and how to reason through them.
sidebar_position: 10
---

# Deployment & DevOps Scenarios

## 1. A deploy goes out and immediately causes errors in production — walk through your immediate response, step by step.

### 📖 Introduction

The very first priority here is stopping the bleeding, not diagnosing the exact cause — a theme that runs throughout this entire guide.

### 🚨 Immediate Steps

Roll back the deploy, or disable whatever specific change caused it if a targeted disable is available, restoring the previous working state before investigating anything further — restoring stability comes first, understanding the full root cause comes after, the same priority order covered generally in the Debugging & Production Issues chapter of this guide. Confirm the rollback actually resolved the errors, rather than assuming it did, since a second, unrelated issue could coincidentally be occurring at the same time.

### 🔍 After Stability Is Restored

Investigate what specifically in the deploy caused the errors, using the actual error messages and logs generated during the brief window it was live, so the real fix can be made and re-deployed safely, rather than re-attempting the same deploy and hoping the issue doesn't recur.

### 💎 Good to Know: A Fast, Practiced Rollback Path Is What Makes This Response Actually Fast in the Moment

Being able to execute this response quickly depends entirely on a rollback mechanism that's already fast, reliable, and genuinely tested before the actual emergency — this is the direct, practical reason rollback capability is worth investing in and rehearsing ahead of time, not something to figure out for the first time during a live incident.

---

## 2. You need to roll back a bad deploy, but the deploy included a database migration that isn't easily reversible — how would you handle this?

### 📖 Introduction

This scenario is exactly why a database migration deserves more caution than a typical rollback-friendly code change.

### ⚠️ Why This Is Harder Than a Normal Rollback

Rolling back application code is usually straightforward, deploy the previous version. A database migration that's already run, especially one that's dropped a column or transformed data in a way that loses the original values, can't simply be undone by deploying older code, since the data itself has already changed underneath it.

### 🔧 How to Handle It

If the migration is genuinely reversible, a corresponding down-migration, run it to restore the previous schema before rolling back the code. If it isn't cleanly reversible, you may need to keep the new schema in place while rolling back only the application code, if the code can still function against it, or restore from a backup if the change is destructive and a backup exists from before it ran, from the Database Scenarios chapter of this guide's backup-restore question.

### 💎 Good to Know: This Is Why Migrations Are Best Designed to Be Safely Reversible From the Start

This exact bind is the practical argument for the additive, backward-compatible migration approach covered in the Database Scenarios chapter — adding a new column and backfilling it gradually rather than destructively altering existing data in place means a rollback stays genuinely possible if something goes wrong, instead of being discovered as impossible only during an actual emergency.

---

## 3. A deploy pipeline that used to take a few minutes now takes over half an hour, and nobody's sure why — how would you investigate?

### 📖 Introduction

"Used to be fast, gradually got slow, no single obvious cause" is the same pattern as the frontend bundle-size creep scenario from the Frontend & React Scenarios chapter of this guide, just applied to a deploy pipeline instead.

### 🔍 What to Investigate

Break the pipeline down into its actual individual stages, build, test, deploy, and measure each one separately rather than only looking at the total time — a single stage is often responsible for most of the added time, hiding inside a total that looks uniformly slower. Check whether the test suite or build process has simply grown substantially over time as the codebase itself grew, a natural, gradual accumulation rather than one single change.

### 🎯 Common Causes

A growing test suite running fully, serially, every single time, without any parallelization. A build process that's no longer effectively caching unchanged parts of the codebase, redoing work that hasn't actually changed since the last run.

### 💎 Good to Know: Pipeline Speed Deserves the Same Ongoing Attention as Application Performance

A slow pipeline doesn't just cost the literal waiting time — it slows down how quickly a genuine production fix can actually get deployed during an incident, directly undermining the fast-rollback capability the first question in this chapter depends on.

---

## 4. Your team wants to start deploying multiple times a day instead of once a week, but is worried about the risk of shipping bugs more frequently — how would you address that concern structurally?

### 📖 Introduction

The intuitive worry, more deploys means more risk, is actually backwards once you look at what a smaller deploy genuinely changes about risk.

### 🎯 Why More Frequent Deploys Can Actually Reduce Risk

A weekly deploy bundles an entire week's worth of changes together, meaning if something breaks, there's a much larger set of changes to search through to find the actual cause. A deploy containing just one or two changes, if something breaks, makes the cause almost immediately obvious, and the actual blast radius of any single bad deploy is naturally much smaller.

### 🔧 What Structurally Supports This

Strong automated testing that can be trusted to catch obvious problems before a deploy ever goes out, since deploying more often only works if you're not relying purely on manual testing for each one. A genuinely fast, reliable rollback path, from the first question in this chapter, so a bad deploy can be undone quickly regardless of how often deploys happen. Feature flags, from a later question in this chapter, letting code be deployed without necessarily being immediately, fully active for every user.

### 💎 Good to Know: Deploy Frequency and Deploy Risk Are Not the Same Axis

This is a genuinely common, understandable misconception worth directly addressing — deploy frequency and deploy safety are largely independent, and the structural practices that make frequent deploys safe are the same ones that also make infrequent deploys safer, just applied more often.

---

## 5. A configuration value was correct in every environment except production, and it caused a real incident — how would you prevent this class of mistake going forward?

### 📖 Introduction

This is a configuration-management problem, and the fix is structural, not "be more careful next time."

### 🔍 Why This Happens

Configuration values are often set manually, or independently, per environment, which leaves real room for a value to simply be forgotten, mistyped, or never updated in one specific environment while every other environment was handled correctly.

### 🔧 Structural Prevention

Manage configuration through a single, version-controlled source that's applied consistently across environments, rather than manual, independent, per-environment entry, which removes the specific human step where this kind of mistake happens. Add validation that checks required configuration values are actually present and correctly formed before a deploy is allowed to proceed, catching a missing or wrong value automatically rather than relying on it being manually noticed.

### 💎 Good to Know: A Missing Config Value Is a Structural Gap, Not a One-Off Human Error

Treating this incident as "someone should have double-checked" rather than "the system should have caught this automatically" tends to produce a repeat of the exact same incident later — the more durable fix is removing the manual step where the mistake happens in the first place, not just adding a reminder to be more careful.

---

## 6. You're introducing a risky change and want to limit its blast radius if something goes wrong — walk through how you'd use a feature flag or gradual rollout to do this safely.

### 📖 Introduction

This is about deliberately decoupling "the code is deployed" from "the code is fully active for everyone," which is the core idea both feature flags and gradual rollouts rely on.

### 🔧 How to Use a Feature Flag

Deploy the new code behind a flag that's initially off, or only on for a small, internal group, meaning the risky code is present in production but not yet actually affecting real users broadly — if something's wrong, it can be turned back off instantly, without needing a full code rollback and redeploy at all.

### 🔧 How to Use a Gradual Rollout

Enable the change for a small percentage of real users first, closely monitoring for errors or unexpected behavior, and only gradually increase that percentage as confidence grows, rather than exposing the entire user base to a brand-new, risky change all at once.

### 💎 Good to Know: This Turns a Binary, All-or-Nothing Risk Into a Controlled, Reversible One

Without this kind of gradual exposure, a risky change is effectively all-or-nothing the moment it deploys — a feature flag or gradual rollout converts that into something that can be tested against real, limited traffic first, and instantly pulled back with far less disruption if it turns out to be a problem.

---

## 7. A deploy succeeds and all health checks pass, but users start reporting issues twenty minutes later — what does this delay suggest, and how would you investigate?

### 📖 Introduction

A delayed problem, rather than an immediate one, means the health checks themselves likely aren't actually checking the thing that eventually breaks.

### 🔍 What the Delay Suggests

A health check typically verifies that the service starts up and responds to a basic request — it usually doesn't exercise every feature or every code path, and it certainly doesn't run for very long. A problem that only appears after twenty minutes suggests something that accumulates or triggers under conditions a quick, immediate health check would never actually encounter — a slow resource leak, from the memory-leak scenarios covered earlier in this guide, or a scheduled task that only runs a while after startup.

### 🔍 How to Investigate

Check what's specifically different about the state of the system twenty minutes after deploy compared to immediately after — resource usage climbing over that window, or a background job that only fires on some delayed schedule, are both worth checking specifically against that timeframe.

### 💎 Good to Know: Health Checks Confirm the Service Started, Not That It Stays Healthy

A passing health check is a genuinely useful, but narrow, signal — it confirms the service came up successfully, not that it will remain correct and healthy as it continues running, which is exactly the gap this delayed-symptom scenario falls into.

---

## 8. Your CI pipeline passes, but the exact same code fails once deployed — what kinds of differences between CI and production would you look for?

### 📖 Introduction

"Exact same code" rules out the code itself — the difference has to be in the environment surrounding it.

### 🔍 What to Look For

Configuration or environment variables that differ between CI and production, the same underlying class of problem as the earlier per-environment configuration question in this chapter, just showing up between CI and production specifically instead of between two production-adjacent environments. Data — CI often runs against a small, synthetic dataset, while production has real, larger, and messier data that can expose an edge case CI's clean test data never actually triggers, related to the staging-versus-production gap from the Performance Optimization Scenarios chapter of this guide. Infrastructure differences — a dependency version, a resource limit, or a piece of infrastructure present in production but not accurately replicated in the CI environment at all.

### 💎 Good to Know: "CI Passed" Only Proves the Code Works Under CI's Specific Conditions

A passing CI run is genuine evidence the code is correct under the conditions CI actually tested — it's not evidence the code is correct under every condition production might present, and the gap between those two claims is exactly where this scenario lives.

---

## 9. Two engineers deploy conflicting changes around the same time, and it's now unclear which deploy caused the issue you're seeing — how would you untangle this?

### 📖 Introduction

The investigation here has to reconstruct a timeline precise enough to actually separate two overlapping changes.

### 🔍 How to Untangle It

Establish the exact time each deploy actually went live, and the exact time the issue first started appearing in monitoring or logs, then compare the two timelines precisely — if the issue's start time clearly lines up more closely with one deploy than the other, that's a strong, if not definitive, signal. If the timing alone isn't conclusive, consider rolling back one of the two changes at a time, rather than both simultaneously, to directly observe whether the issue actually resolves — a more definitive, if slower, way to isolate which one is actually responsible.

### 💎 Good to Know: This Is Exactly Why Frequent, Small, Individually Deployed Changes Help Even When Timing Overlaps

This scenario is a direct, practical argument for the more-frequent, smaller-deploy structure discussed earlier in this chapter — even when two deploys happen close together, each one being small and independently identifiable makes untangling this kind of overlap meaningfully easier than untangling two large, bundled weekly deploys would be.

---

## 10. You're asked to set up zero-downtime deploys for a service that currently has a few seconds of downtime on every release — walk through your approach.

### 📖 Introduction

This closes the chapter with a genuinely common infrastructure goal, built from a straightforward underlying idea.

### 🔧 The Core Approach

Rather than stopping the old version and then starting the new one, run both versions simultaneously for a brief transition period — start the new version, confirm it's genuinely healthy and ready to serve traffic, then shift traffic over to it, and only stop the old version once the new one is confirmed to be handling traffic correctly.

### 🎯 What This Requires

A load balancer or routing layer capable of gradually or instantly shifting traffic between the old and new versions, from the Networking guide's coverage of load balancers and reverse proxies. A health check, from the earlier question in this chapter, that genuinely confirms the new version is ready before any traffic is actually routed to it — routing traffic to a version that looks started but isn't genuinely ready yet just moves the downtime instead of eliminating it. If the service depends on a database, ensuring the schema stays compatible with both the old and new version simultaneously during the transition, directly related to the additive, backward-compatible migration approach covered in the Database Scenarios chapter of this guide.

### 💎 Good to Know: "Zero Downtime" Really Means "Old and New Versions Briefly Coexist Correctly"

The core idea underlying every zero-downtime deployment strategy is the same — having two versions genuinely able to run and serve traffic correctly at the same time, even briefly, rather than there ever being a moment where neither version is available to handle a request.
