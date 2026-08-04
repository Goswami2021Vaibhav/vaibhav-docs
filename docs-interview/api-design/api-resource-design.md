---
title: API Resource Design
description: Naming resources, nesting, and modeling real-world entities as endpoints.
sidebar_position: 3
---

# API Resource Design

## 1. Why should REST resource URLs use nouns rather than verbs?

### 📖 Introduction

This chapter turns the previous chapter's "resource-based thinking" into concrete, practical naming rules — the most immediately visible signal of whether an API actually followed those principles.

### 📦 Why Nouns

A URL identifies a resource, a thing, not an action taken on it. The HTTP method is what expresses the action — GET, POST, PUT, DELETE. Putting a verb in the URL duplicates, and often conflicts with, that job.

### ⚠️ The Problem With `/createUser`

It bakes the action into the URL, meaning the endpoint can only ever mean "create." You can't apply REST's uniform interface, from the previous chapter, to it — GETting the same URL to read doesn't make sense. It's really just an RPC-style function call wearing a URL costume.

### 💎 Good to Know: A Quick Litmus Test

If removing the HTTP method from your mental model of an endpoint still leaves you knowing exactly what it does *just from the URL*, because the URL contains a verb, that's a strong signal it's RPC-style rather than resource-oriented.

---

## 2. What's the naming convention for a collection versus a single resource within it?

### 📖 Introduction

This is where predictability, from the first chapter of this guide, becomes visible at the URL level specifically.

### 📋 The Convention

A plural noun for a collection, `/users`, and the same plural noun plus an identifier for a single item within it, `/users/:id` — not `/user/:id` singular alongside `/users` plural inconsistently.

### 🎯 Why Consistency Matters

A consumer who's learned `/users` maps to `/users/:id` should be able to apply that same pattern to `/products` mapping to `/products/:id`, without checking whether this particular resource happens to use singular or plural. Directly predictability and uniform interface, made concrete at the URL-naming level.

### 💎 Good to Know: The Specific Choice Matters Less Than Applying It Uniformly

Some APIs use singular resource names throughout, `/user/:id`, as a different but internally consistent convention. Picking one and applying it everywhere matters far more than which one you pick — echoing the style-guide discussion from the first chapter of this guide.

---

## 3. How deep should resource nesting go?

### 📖 Introduction

Deep nesting looks natural at first, since it mirrors how the data relates — but it introduces real, practical problems fast.

### ⚠️ The Problem With Deep Nesting

`/users/:id/orders/:id/items/:id/reviews` requires a client to know and carry four separate IDs just to reach one item's reviews, most of which are redundant — an item ID is already globally unique, so you don't actually need the user ID and order ID to find it. It also makes the URL fragile, breaking if an item could ever be reassigned to a different order, and awkward to work with directly — bookmarking or sharing a deeply nested URL, or writing client code that navigates it.

### 📏 A Practical Guideline

Most real APIs cap nesting at one level deep, `/parent/:id/children`, and use the child resource's own ID directly for anything beyond that — `/items/:id/reviews` rather than continuing to nest under the full ancestor chain.

### 💎 Good to Know: This Connects to the Identifier Discussion Later in This Chapter

Nesting becomes less necessary the more a resource's own ID is globally unique and sufficient to find it on its own, rather than only meaningful within the context of its parent.

---

## 4. When would you nest a resource under its parent versus keeping it flat with a query parameter?

### 📖 Introduction

This turns the previous question's guideline into an actual decision framework.

### 🪆 Nest When

The child resource genuinely doesn't make sense outside the context of its parent — an order's line items don't exist independently of that specific order. Nesting communicates ownership and containment clearly.

### 🏳️ Flatten (Query Parameter) When

The resource has its own independent identity and is commonly accessed both through its relationship to a parent and on its own — `/orders/:id` directly, in addition to `/orders?userId=:id` to filter by user. Orders are genuinely their own first-class resource, not merely a sub-part of a user.

### 💎 Good to Know: A Useful Test

Can this child resource be meaningfully fetched or referenced without its parent's context at all — does `GET /orders/456` on its own make complete sense? If yes, it's probably better as its own top-level resource, filterable by parent via a query parameter, rather than permanently nested under that parent's URL.

---

## 5. How would you represent a relationship between two resources, like a user having many orders?

### 📖 Introduction

Relationships in REST are represented differently than you might expect coming from a database mindset.

### 🔗 The Options

Nesting, from the previous question, to list a user's orders. A foreign-key-style field in the resource's own representation — an order response including a `userId` field pointing back to its owner. Or a query parameter filter, `/orders?userId=:id`. These are often used together, not chosen exclusively.

```json
// GET /orders/456
{ "id": 456, "userId": 42, "total": 89.99 }

// GET /users/42/orders — the nested listing view
[{ "id": 456, "total": 89.99 }, { "id": 457, "total": 12.50 }]
```

### 💎 Good to Know: Relationships Are References, Not Embedded Data, by Default

A REST API's default, uniform representation should be a reference the client can follow if it needs more detail — embedding the full related resource inline can be offered as a deliberate optimization, covered in the aggregation question later in this chapter, when genuinely needed, but it isn't the default.

---

## 6. What's a good approach for actions that don't naturally fit CRUD, like "publish this post" or "cancel this order"?

### 📖 Introduction

The previous chapter introduced this problem briefly — this is the dedicated, practical coverage of how to actually solve it.

### ⚠️ The Problem

"Publish this post" or "cancel this order" aren't simple field updates — they're actions with their own validation rules and side effects, like an order only being cancelable if it hasn't shipped yet, that don't map cleanly onto "PATCH the status field."

### 🛠️ The Standard Approach

Model the action as a sub-resource created via POST — `POST /orders/:id/cancel` or `POST /posts/:id/publish`. The "verb" becomes a noun, a nested resource representing the act of canceling or publishing, that you POST to — keeping the overall API resource-oriented while still cleanly representing a genuine action.

### 💎 Good to Know: This Is the Practical Follow-Up to the Previous Chapter's REST-vs-RPC Discussion

Recognizing when to reach for this pattern — genuine actions, not just simple field changes — is the real skill being tested here.

---

## 7. What's the tradeoff between a numeric ID, a UUID, and a slug as a resource identifier?

### 📖 Introduction

The choice of identifier has real consequences beyond just "what does the URL look like."

### 🔢 Numeric, Auto-Incrementing

Simple, small, naturally sortable by creation order — but predictable and guessable, covered from the security angle in the next question, and it reveals internal volume information, since a competitor can roughly estimate order counts from a recent order's ID.

### 🆔 UUID

Globally unique and unguessable, and can be generated client-side or in a distributed system without needing to check with a central database for the next available number — directly useful for the sharding and distributed-ID-generation concerns covered in the Scalability guide. Downsides: longer, less human-friendly, and not naturally sortable by creation time unless using a time-ordered variant.

### 🏷️ Slug

Human-readable, SEO-friendly, and meaningful in a URL, `/posts/how-to-design-apis` — but requires handling uniqueness conflicts, like two posts with the same title, and typically needs careful handling if the underlying content it's derived from, like a title, changes later.

### 💎 Good to Know: Many Real APIs Combine These

A UUID or numeric ID as the canonical identifier used internally and in relationships, with a slug used additionally for user-facing, readable URLs — a blog might route both `/posts/42` and `/posts/how-to-design-apis` to the same resource.

---

## 8. Why can exposing sequential, numeric IDs create an information-disclosure risk?

### 📖 Introduction

This is a distinct risk from IDOR, worth telling apart clearly.

### ⚠️ The Risk

A sequential ID doesn't just make a specific resource guessable, which is really an authorization concern, directly the IDOR discussion from the Web Security guide's Authentication & Authorization chapter. It also leaks business intelligence: the rate at which IDs increase reveals how many new resources are being created over time — order volume, signup rate — information a competitor could use even without ever successfully accessing another user's specific resource.

### 💎 Good to Know: This Is a Different Risk From IDOR, Not a Duplicate of It

IDOR is about accessing data you shouldn't be able to. This is about the ID's mere existence and pattern leaking aggregate business information, even if every individual access attempt is properly authorization-checked and blocked. UUIDs address both concerns at once, part of why they're a common default choice for public-facing resource IDs specifically.

---

## 9. How would you design an endpoint that needs to return data aggregated from multiple resources?

### 📖 Introduction

This is a deliberate, pragmatic exception to pure resource modeling.

### ⚠️ The Problem

A client that needs data from several related resources at once — a dashboard showing a user's profile, their recent orders, and their account balance — would otherwise need to make three separate requests, adding round-trip latency, covered in the Network Performance Optimization chapter, for each one.

### 🛠️ The Design Approach

A dedicated, purpose-built endpoint, `GET /dashboard` or `GET /users/:id/summary`, that internally fetches and combines data from multiple underlying resources server-side, returning it in one response — trading some REST "purity," since this endpoint doesn't map to a single, clean resource, for a genuinely better client experience.

### 💎 Good to Know: A Few of These Purpose-Built Endpoints Is a Reasonable Tradeoff

Similar in spirit to the RPC-style compromise from the previous chapter — a well-designed API accepts a few aggregating endpoints for genuinely common client needs, rather than either forcing multiple round trips or abandoning resource-orientation entirely everywhere else.

---

## 10. What's the difference between a "singleton" resource and a standard collection resource?

### 📖 Introduction

Not every resource needs an ID in its URL — this is when that's actually the right call.

### 1️⃣ What It Is

A resource that doesn't need an ID in its URL because there's only ever exactly one of it in a given context — `/cart` for "the current user's shopping cart," identified implicitly by the authenticated user, rather than `/carts/:id`.

### ✅ When It's the Right Model

When a resource is inherently scoped to exactly one instance per relevant context — the current user, the current organization. `/me`, the current user's own profile, is another common example.

### 💎 Good to Know: A Singleton Is Still Fully Resource-Oriented

GET, PUT, and PATCH still apply normally. The difference is that the resource's identity is implicit, derived from who's asking via authentication, rather than explicit in the URL path — genuinely different from a collection, where you need an explicit ID to pick one specific item out of many.

---

## 11. How would you design resource naming for a genuinely complex, real-world entity?

### 📖 Introduction

Complex entities are exactly where the temptation to just expose the underlying storage structure directly is strongest.

### 🎯 The Approach

Work backward from how consumers and the business actually talk about and use the entity, rather than forward from how it happens to be stored. If a "subscription" genuinely spans multiple database tables — billing info, plan details, usage limits — but consumers think of it and interact with it as one coherent concept, the API should expose one `/subscriptions/:id` resource that internally assembles data from those multiple tables, rather than exposing three separate, disjointed resources that force the consumer to understand your internal storage structure just to use them together.

### 💎 Good to Know: This Theme Runs Through the Entire Chapter

Modeling resources around business concepts rather than storage structure connects directly to the first chapter of this guide and to the schema-mirroring risk covered next — a genuinely complex entity is exactly where this discipline matters most.

---

## 12. What's the risk of designing your API's resource structure to mirror your database schema exactly?

### 📖 Introduction

The first chapter of this guide covered the field-level version of this risk — exposing internal fields that shouldn't be public. This is the structural version, a different, equally real failure mode.

### ⚠️ The Risk Here Specifically

Beyond individual fields, mirroring the schema at the structural level means your resource boundaries end up matching table boundaries. A many-to-many join table becomes its own awkward, meaningless-to-consumers "resource," or a single business concept normalized across five tables gets exposed as five separate, disconnected endpoints the consumer has to manually stitch together themselves — directly the problem the aggregation approach from earlier in this chapter is meant to solve.

### 🎯 A Realistic Example

Exposing a raw `user_roles` join table as `/userRoles`, rather than simply representing a user's roles as a `roles` array within the `/users/:id` response — how a consumer actually thinks about "what roles does this user have."

### 💎 Good to Know: This Is the Same Underlying Principle as the First Chapter, a Different Failure Mode

"Don't mirror the schema" is one broad design discipline with at least two distinct, practical failure modes — field-level exposure, and structural resource boundaries — not two unrelated rules to separately remember.

---

## 13. How would you handle a resource that can be created in multiple different ways?

### 📖 Introduction

A user signing up by email versus by social login is a genuinely common version of this design challenge.

### ⚠️ The Challenge

Email signup and social login have genuinely different required input fields and validation, but should still result in the same kind of resource — a "user" — with a consistent representation afterward.

### 🛠️ Design Approaches

Either a single creation endpoint that accepts a discriminated payload shape, a `provider` or `authMethod` field indicating which creation path is being used, with the rest of the body varying accordingly. Or separate, purpose-specific endpoints, `POST /users/signup` versus `POST /auth/google/callback`, that both ultimately create and return the same underlying `/users/:id` resource representation.

### 💎 Good to Know: The Variation Belongs in the Creation Step, Not the Resource's Ongoing Behavior

Regardless of which creation path was used, the resulting resource's ongoing representation, `GET /users/:id`, should look identical and be interacted with the same way afterward — keeping this boundary clean prevents "how was this user created" from leaking into and complicating every other endpoint that touches users.

---

## 14. What naming conventions are typically used where in an API, and why does mixing them confuse consumers?

### 📖 Introduction

The specific casing convention matters far less than applying it consistently — but it's worth knowing the typical defaults.

### 🔤 Typical Conventions by Location

`camelCase` for JSON field names in the request and response body, matching the JavaScript and JSON idioms most consumers, especially JS-based clients, expect. `kebab-case` for URL paths, `/user-profiles` rather than `/userProfiles` or `/user_profiles`, since URLs are conventionally lowercase and hyphen-separated for readability, and case-sensitivity in URLs can cause subtle bugs. `snake_case` is common in APIs built around Python or Ruby conventions, though less common as a default for a JS/Node-centric API.

### 🧩 Why Mixing Confuses Consumers

A consumer writing client code has to remember and handle different casing depending on where in the request or response they're looking — exactly the kind of inconsistency the first chapter of this guide warned costs far more than any individual choice being "wrong."

### 💎 Good to Know: This Is the Same Recurring Theme, at the Case-Convention Level

The specific convention matters far less than picking one per context, body versus URL, and applying it uniformly — the style-guide and uniform-interface themes from earlier in this guide, showing up again here.

---

## 15. How would you design an endpoint for a bulk operation?

### 📖 Introduction

A bulk endpoint is a genuinely different design problem from a single-resource endpoint, not just "the same thing but with an array."

### ❓ Design Questions Unique to Bulk Operations

What happens if some items in the batch succeed and others fail — partial success? Does the whole batch roll back, or do successful items commit while failed ones are reported separately, directly the Scalability guide's distributed-transaction and saga-pattern territory, now at a smaller, single-service scale? How does the response communicate per-item success or failure, rather than one single status code for the entire batch? What's a reasonable maximum batch size, and what happens if a client exceeds it?

```json
// POST /users/bulk — response communicates per-item outcomes
{
  "results": [
    { "index": 0, "status": "created", "id": 101 },
    { "index": 1, "status": "failed", "error": "email already exists" }
  ]
}
```

### 💎 Good to Know: Partial Failure Has No Clean Equivalent in Single-Resource CRUD

A single request either succeeds or fails entirely — exactly why bulk operations deserve their own deliberate design thought, rather than being bolted on as an afterthought to an existing single-item endpoint.

---

## 16. In production, your team keeps disagreeing over whether a new feature's endpoint should be `/users/:id/settings` or `/settings?userId=:id` — how would you resolve this?

### 📖 Introduction

This closes the chapter with a realistic disagreement, and the resolution matters more than which specific option wins.

### 🧭 The Immediate Question

Apply the nest-versus-flatten framework from earlier in this chapter directly: does `settings` make sense accessed on its own, independent of a specific user, or is it inherently, always scoped to and meaningless without its parent user? Settings are usually the latter, making nesting the better fit — but the specific disagreement itself is less important than how it gets resolved going forward.

### 🛠️ Resolving This Scalably

This is exactly where the API style guide from the first chapter of this guide becomes concretely valuable. Rather than re-litigating nesting-versus-flat from scratch for every new feature, document the decision framework once, as part of a team style guide, so future disagreements can be resolved by checking the documented framework rather than a fresh debate every time.

### 💎 Good to Know: Consistent Decision-Making Matters More Than Any Individual Decision

Nesting, naming, and ID choices all matter less in isolation than having a consistent, documented way of making those decisions going forward — the style-guide principle from the first chapter of this guide, now shown solving a genuinely concrete, recurring team friction point rather than remaining an abstract recommendation.
