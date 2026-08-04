---
title: API Versioning
description: Strategies for evolving an API without breaking existing clients.
sidebar_position: 5
---

# API Versioning

## 1. Why does an API need a versioning strategy at all, given that most changes should ideally be backward compatible?

### 📖 Introduction

This chapter turns every "we need a version bump" reference from the previous four chapters into an actual, concrete discipline.

### ⚠️ Why It's Still Needed

Not every change can be additive. Sometimes a genuine mistake needs fixing, like the timestamp-format closing scenario from the previous chapter. A field needs renaming for clarity. Or the underlying business model itself fundamentally changes in a way the old shape simply can't represent. When a breaking change is genuinely unavoidable, you need an actual mechanism, a version, to let old and new behavior coexist, rather than forcing an instant, all-consumers-at-once cutover.

### 💎 Good to Know: Versioning Is a Fallback, Not a Substitute for Backward-Compatibility Discipline

The backward-compatibility discipline from the first chapter of this guide is the primary defense. Versioning is the escape hatch for the relatively rare cases where that discipline genuinely can't be maintained. A team that reaches for a new version constantly, covered later in this chapter, is usually a sign backward-compatible design isn't being pursued hard enough first.

---

## 2. What are the main approaches to API versioning, and what's the tradeoff of each?

### 📖 Introduction

None of these is objectively "correct" — picking one and being consistent matters more than which one gets picked.

### 🛣️ URL Path (`/v1/users`)

Simple, highly visible, and cacheable — each version is a genuinely different URL, so CDN and browser caching works naturally without special configuration. Arguably violates REST's idea that a URL should identify a resource, not a version of an interface to it.

### 📋 Custom Header (`X-API-Version: 2`)

Keeps the URL clean and stable, but is less discoverable — a developer can't just look at the URL to know which version they're hitting — and requires every client request to remember to set an extra header.

### ❓ Query Parameter (`?version=2`)

Similar visibility to URL path versioning, but mixes version info in with genuinely functional query parameters, like the filtering and sorting covered in this guide's Pagination, Filtering, Sorting & Searching chapter, which can be confusing.

### 🤝 Accept-Header Content Negotiation (`Accept: application/vnd.myapi.v2+json`)

The most "purist" REST-aligned approach, repurposing the content-negotiation mechanism from the previous chapter for versioning — but genuinely obscure to most developers, and harder to test quickly in a browser or manually.

### 💎 Good to Know: This Is a Case Where Consistency Matters More Than Which Option Wins

The next question covers why URL path specifically tends to win in practice, despite the others' theoretical advantages.

---

## 3. Why is URL path versioning the most common approach in practice, despite being arguably less "RESTful"?

### 📖 Introduction

This is a great, concrete example of practical developer experience winning out over theoretical architectural purity.

### ✅ Why It Wins in Practice

It's immediately visible and understandable to any developer just by looking at a URL, with no need to inspect headers. It's trivial to test manually — just change the URL in a browser or a `curl` command. It works naturally with existing HTTP caching and CDN infrastructure without special configuration, since it's a genuinely different URL. And it's simple to route at the infrastructure level — the load balancer and gateway routing covered in the Scalability guide can trivially route `/v1/*` and `/v2/*` to entirely different backend deployments.

### 💎 Good to Know: "Most RESTful" and "Most Widely Adopted" Aren't Always the Same Answer

This is directly the REST-versus-REST-ish spectrum from the previous chapter, applied here — the practical answer often wins for good, concrete reasons, not because purity doesn't matter, but because operational simplicity matters more in this specific case.

---

## 4. What's the difference between a breaking change and a non-breaking, additive change?

### 📖 Introduction

The first chapter of this guide introduced the underlying distinction and the individual-judgment framework for it — this is the concrete checklist of common breaking-change patterns worth having written down.

### ❌ Common Breaking Changes

Removing a field. Renaming a field. Changing a field's type, a string becoming a number. Making a previously optional field required. Removing a previously valid enum value. Changing the meaning of an existing field without changing its name or type. Changing default behavior that consumers may have implicitly relied on.

### ✅ Common Non-Breaking (Additive) Changes

Adding a new optional field. Adding a new endpoint entirely. Adding a new accepted value to an enum, as long as old code doesn't need to exhaustively handle every possible value. Relaxing a previously required field to optional.

### 💎 Good to Know: Keep This Checklist Written Down, Not Re-Derived Every Time

Connecting to the API style guide from the first chapter of this guide — most real breaking-change surprises come from one of these well-known patterns, not from some genuinely novel kind of change nobody's seen before.

---

## 5. How would you decide, as a team rather than an individual, whether a proposed change is safe to ship without a version bump?

### 📖 Introduction

The first chapter of this guide gave the individual judgment framework — this is about making that decision reliably at team scale.

### ⚠️ Why Individual Judgment Isn't Enough at Team Scale

The "would an existing client still work" framework requires genuinely knowing how existing clients actually use the API. A single developer proposing a change often doesn't have complete visibility into every consumer's actual usage pattern, meaning their own judgment, however careful, can still miss a real breaking impact.

### 🛠️ A Better Process

A lightweight API-change review step, where someone other than the change's author checks it against the breaking-change checklist from the previous question. And ideally, contract or schema testing — validating the new implementation against the old OpenAPI spec, from the first chapter of this guide, to catch drift automatically rather than relying purely on manual judgment.

### 💎 Good to Know: This Is the Same Discipline as Security Code Review

A breaking-change checklist is exactly the kind of thing a second reviewer should explicitly check a proposed API change against — the same way a security reviewer checks code against known vulnerability patterns, covered throughout the Web Security guide.

---

## 6. What is a deprecation policy, and what should it communicate to API consumers?

### 📖 Introduction

A deprecation that's never actually enforced isn't really a deprecation at all.

### 📜 What It Is

A documented policy, ideally applied consistently across the whole API, describing what happens when something in the API is being phased out.

### 📋 What It Should Communicate

What specifically is being deprecated — a whole version, a specific field, a specific endpoint. When it will actually stop working — a concrete date, not "eventually." And what the consumer should do instead — the replacement endpoint, field, or version, and ideally a migration guide, covered later in this chapter.

### 💎 Good to Know: This Is the Same Discipline Covered From the Security Angle in the Web Security Guide

An old, unpatched API version left running indefinitely without an enforced sunset date is a security liability, covered in the Web Security guide. Here the framing is primarily API-design hygiene and consumer relations, but the underlying principle — an unenforced deprecation is not a real deprecation — is identical.

---

## 7. What is the `Sunset` HTTP header, and how does it signal a planned removal?

### 📖 Introduction

This is the concrete mechanism behind the "when" component of a deprecation policy from the previous question.

### 📅 What It Is

A standard HTTP response header, `Sunset: Sat, 31 Dec 2025 23:59:59 GMT`, that a server includes on responses from a deprecated endpoint or version, formally communicating the exact date it will stop working.

```
Deprecation: true
Sunset: Sat, 31 Dec 2025 23:59:59 GMT
Link: <https://api.example.com/docs/migration-v2>; rel="deprecation"
```

### 🎯 Why It's Useful

Unlike a deprecation notice buried in documentation, which consumers might never actually read, the `Sunset` header is machine-readable and appears directly in the API response itself — meaning automated tooling, a client's own monitoring, or even just logging, can detect and alert on it programmatically, without a human needing to manually check documentation for updates.

### 💎 Good to Know: Often Paired With `Deprecation` and `Link` Headers

Together, these give a consumer everything they need — deprecated now, dies on this date, here's what to do — directly in the response, without needing to go looking for it separately.

---

## 8. How long should a team typically support an old API version, and what factors affect that decision?

### 📖 Introduction

There's no universal correct number here — this is genuinely a business decision, not a purely technical calculation.

### 📊 Factors

How widely used the old version currently is — a version with thousands of active consumers needs more runway than one with a handful. How costly it is to keep running, covered in the operational-cost question next — a genuinely expensive-to-maintain old version pushes toward a shorter window. Whether consumers are internal, coordinatable directly, or external and third-party, needing more lead time since you can't force their schedule. And industry or contractual norms, since some customer agreements may have explicit minimum-support-period requirements.

### 💎 Good to Know: Common Real-World Windows Range Widely

A few months for a fast-moving internal API, to a year or more for a widely used public one. The decision balances consumer disruption against the ongoing cost of maintaining old code — directly the stakeholder-communication theme from the first chapter of this guide.

---

## 9. What's the operational cost of maintaining multiple live API versions simultaneously?

### 📖 Introduction

"Just also run the old code" sounds simple, but the real cost compounds with every subsequent change, not just at the moment of the split.

### ⚠️ Why It's Not Simple

Every subsequent change to shared underlying logic — a bug fix, a security patch, covered throughout the Web Security guide — potentially needs to be applied to both the old and new version's code paths. The team's cognitive load and testing surface roughly doubles, or worse with more than two live versions, for every change going forward, not just at the moment of the version split itself.

### 💸 Additional Costs

Monitoring and observability, covered in the Performance Optimization guide, needs to track both versions' health separately. Infrastructure and deployment pipelines need to support deploying multiple versions independently. Documentation, from the first chapter of this guide, needs to be maintained for both simultaneously.

### 💎 Good to Know: This Is the Same Cost Covered in the Scalability Guide's Microservices Chapter

This is the same underlying operational burden covered there for inter-service versioning generally — worth recognizing it as one recurring cost showing up in both contexts.

---

## 10. How would you communicate a breaking change to third-party consumers you can't directly coordinate with?

### 📖 Introduction

This builds directly on the internal-versus-external distinction from the first chapter of this guide.

### ⚠️ Challenges Unique to Third Parties

You likely don't have a direct communication channel to every consumer, unlike an internal team you can message directly. They operate on their own release schedules you have no influence over. And some may simply never notice a deprecation notice until their integration actually breaks.

### 🛠️ Practical Approaches

Proactive email or notification to registered API-key holders, if consumers are required to register for API access at all, giving you at least one direct channel. A prominent, dated changelog or announcements page. The `Sunset` and `Deprecation` headers, from earlier in this chapter, so even consumers who never read documentation get some automated signal. And a genuinely generous migration window, since you can't force third parties to move on your preferred timeline.

### 💎 Good to Know: There's a Real, Honest Limit to How Much You Can Guarantee for Unknown Consumers

This is exactly why "avoid breaking changes by default," from the first chapter of this guide, matters most for public APIs specifically — the cost of a breaking change is highest precisely where your ability to warn people is weakest.

---

## 11. What's the risk of versioning too granularly versus too coarsely?

### 📖 Introduction

Both extremes create real, distinct problems worth understanding.

### 🔬 Too Granular (a New Version for Every Small Change)

Consumers face constant migration churn, and the team ends up maintaining many simultaneous live versions, multiplying the operational cost covered earlier in this chapter, making the burden genuinely unsustainable.

### 🐘 Too Coarse (Rarely Versioning, Bundling Many Changes Into Rare, Large Bumps)

Each version bump becomes a genuinely massive, high-risk migration effort for consumers all at once, rather than several smaller, more digestible changes spread over time — and accumulating many unrelated changes into one bump makes it harder to reason about and test the full scope of what actually changed.

### 💎 Good to Know: The Real Goal Is Making Breaking Changes Rare in the First Place

Most real APIs land on the practical sweet spot of versioning infrequently at the major level, reserved for genuine, unavoidable breaking changes, while making the vast majority of ongoing improvements as backward-compatible, additive changes that never require a version bump at all. Versioning is the fallback for the genuinely unavoidable remainder, not the primary tool.

---

## 12. How would you design a migration path that makes it easy for consumers to move to a new version?

### 📖 Introduction

Announcing a change is communication — but it isn't the same thing as making the change easy to actually act on.

### 📋 What a Good Migration Path Includes

Clear, side-by-side documentation showing the old way and the new way for every changed piece — not just "here's what changed," but "here's exactly how to update your code." A genuinely long enough overlap window where both old and new versions work simultaneously, covered earlier in this chapter, so consumers can migrate on their own schedule rather than a forced, instant cutover. And ideally, automated tooling — a codemod, a compatibility shim, or at minimum a clear checklist — that reduces the actual effort required to migrate.

### 💎 Good to Know: "Announce It and Let Them Figure It Out" Shifts the Burden Onto Every Consumer Independently

A genuinely good migration guide does the investigative work once, centrally, saving that redundant effort across every consumer at once — rather than every affected team repeating the same investigation independently.

---

## 13. What monitoring would you put in place to know whether it's actually safe to retire an old API version?

### 📖 Introduction

A calendar date alone isn't enough evidence that retiring a version is actually safe.

### 📊 What to Monitor

Actual traffic and usage volume hitting the old version's endpoints over time, directly the Performance Optimization guide's monitoring principles applied here — is usage genuinely trending toward zero, or has it plateaued at some non-trivial, still-active level? Who specifically is still calling it, if identifiable via API keys or authentication — a handful of known, contactable stragglers is a very different situation than a large volume of anonymous traffic.

### 💎 Good to Know: A Sunset Date Is a Commitment, Not a Substitute for Checking Real Data

Retiring a version based purely on a calendar date, without actually checking real usage data first, is genuinely risky. The sunset date is a commitment communicated in advance, but the actual decision to pull the plug should still be informed by real data confirming it's genuinely safe — echoing this entire guide's "measure, don't just assume" theme.

---

## 14. In production, you need to make a genuinely breaking change to a heavily-used endpoint that dozens of internal services depend on — walk through how you'd plan and execute it safely.

### 📖 Introduction

This closes the chapter by pulling together nearly every discipline covered throughout it.

### 📋 Planning

Catalog every known consumer and their specific usage pattern of the affected endpoint — genuinely easier for internal services than the third-party case covered earlier in this chapter. Classify exactly what's breaking against the checklist from earlier in this chapter, confirming it's genuinely unavoidable — have real backward-compatible alternatives, from the first chapter of this guide, actually been exhausted first? Choose a versioning approach consistent with what the rest of the API already uses.

### 🚀 Execution

Introduce the new version alongside the old one — never a hard cutover for something this widely depended on. Communicate directly with each of the dozens of internal teams, an advantage internal coordination has over the external case covered earlier in this chapter, with a concrete migration guide and timeline. Set the `Sunset` header on the old version's responses. Monitor actual migration progress across all dozens of consumers before actually retiring the old version, rather than assuming the announced timeline alone guarantees everyone's actually moved.

### 💎 Good to Know: Even the "Easy" Internal Case Still Needs the Full Discipline

All consumers being internal and genuinely coordinatable doesn't remove the need for cataloging consumers, a real migration path, deprecation signaling, and data-informed retirement — dozens of dependent services is exactly enough scale that informal, ad-hoc coordination, "I'll just message everyone on Slack," genuinely breaks down without this more systematic process.
