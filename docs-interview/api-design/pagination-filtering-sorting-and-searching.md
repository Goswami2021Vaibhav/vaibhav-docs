---
title: Pagination, Filtering, Sorting & Searching
description: Handling large collections without dumping everything in one response.
sidebar_position: 6
---

# Pagination, Filtering, Sorting & Searching

## 1. Why can't an API endpoint returning a collection simply return every matching record in one response?

### 📖 Introduction

This chapter is where the previous chapter's response-design principles meet a collection that could genuinely be any size — from three items today to three million next year.

### ⚠️ Why Not Just Return Everything

Even for a currently small collection, an endpoint's design needs to hold up as that collection grows — directly the Performance Optimization guide's "fast locally with small data, slow in production" theme. An API contract that works fine at 20 items but becomes unusable at 20,000 is a design that didn't account for growth from the start.

### 💎 Good to Know: The Contract Needs to Be Sound Regardless of Today's Data Size

This is a specific application of the "API is a contract" framing from the first chapter of this guide — the contract needs to hold up regardless of how much data happens to exist behind it today, not just be correct for the current, convenient state of the data.

---

## 2. What's the difference between offset-based and cursor-based pagination, from a pure API design perspective?

### 📖 Introduction

Both the Performance Optimization and Scalability guides cover this from the performance angle — this is specifically about the design contract each one offers a client.

### 🔢 Offset-Based, Design Characteristics

The client can jump to any arbitrary page directly, `?page=47`, without having seen previous pages first — genuinely useful for a UI showing numbered page links a user can click directly.

### 🎯 Cursor-Based, Design Characteristics

The client can only move forward or backward relative to a position it's already seen, using an opaque cursor token returned in the previous response. It can't jump directly to an arbitrary page number, but naturally fits "infinite scroll" or "load more" style interfaces where the client is always moving sequentially.

### 💎 Good to Know: The Choice Is Fundamentally About Interaction Pattern, Not Just Performance

A client that genuinely needs numbered page jumping requires offset-based pagination regardless of cursor's performance advantages, covered in the other guides — the right design choice depends on the consumer's actual use case, not purely on which technique is "objectively better."

---

## 3. What pagination metadata should a paginated response include to be genuinely usable?

### 📖 Introduction

This is the previous chapter's response-envelope discipline, applied specifically to pagination.

### 📋 What to Include

The current page's items themselves. A way to get the next page — a `nextCursor` token, or a direct `next` link URL the client can follow without reconstructing it manually. A way to get the previous page similarly. And, for offset-based pagination, the current page number and total page count if available.

```json
{
  "data": [ /* ...items... */ ],
  "pagination": {
    "nextCursor": "eyJpZCI6NDJ9",
    "hasMore": true
  }
}
```

### 💎 Good to Know: A Direct `next` Link Reduces Coupling to Your Implementation Details

Providing a ready-to-use URL, rather than just the raw cursor value, means the client doesn't need to know how to construct the next request's URL from the cursor itself — reducing coupling between the client's code and the API's specific pagination implementation.

---

## 4. Why can including a total count in a paginated response be more expensive than it looks?

### 📖 Introduction

This is a genuinely good example of not adding something to a response just because it seems obviously useful.

### 💸 Why It's Expensive

Computing an exact total count often requires the database to actually count every matching row, covered in the Performance Optimization and Scalability guides' database chapters — for a large, frequently filtered collection, this can be a genuinely expensive query to run on *every* single paginated request, even though the client only asked for one small page of data.

### 🤔 Is It Always Worth Including?

Not necessarily. Many real APIs skip an exact total count by default, or make it a separate, opt-in, more expensive query only when explicitly requested, since most clients genuinely only need "is there a next page" — a simple, cheap boolean or cursor check — rather than the precise total number.

### 💎 Good to Know: The Question Is Need, Not Convenience

Not "would this be nice to have," but "does the actual, common client need justify this ongoing performance cost on every request" — directly echoing the field-selection and payload-size discipline covered in the previous chapter.

---

## 5. What's a sensible default and maximum page size, and what happens without an enforced maximum?

### 📖 Introduction

An unbounded page size is a genuine, exploitable design gap, not just a theoretical concern.

### 📏 Sensible Values

A modest default, often 20–50 items, balancing a reasonable amount of data per request against not overwhelming a typical client's rendering or processing. And an enforced maximum, even if a client requests more, to prevent abuse or accidental overload.

### ⚠️ What Happens Without an Enforced Maximum

Directly the "unbounded work" theme from the Performance Optimization guide's API-payload-size discussion — a client, accidentally or maliciously, requesting an enormous page size, `?limit=1000000`, can force the server to fetch, serialize, and transmit a massive amount of data in one request, a genuine resource-exhaustion risk covered in the Web Security guide's API Security chapter, not just a slow response.

### 💎 Good to Know: Always Enforce the Maximum Server-Side

Silently cap an over-limit request to the maximum, rather than trusting the client's `limit` parameter unconditionally — directly the Web Security guide's "never trust client input" principle, applied here specifically to a pagination parameter.

---

## 6. How would you design query parameters for filtering, including a filter that needs an operator?

### 📖 Introduction

Plain equality filters are simple; anything beyond that needs a deliberate convention.

### 🔍 Basic Filtering

Exact-match query parameters, `?status=active&category=books`, map intuitively and simply to "WHERE status = 'active' AND category = 'books'."

### ⚙️ Handling an Operator (Like "Greater Than")

Since a plain `?price=100` can only express equality, a common convention is bracket or suffix notation to express a range or comparison rather than an exact match.

```
?price[gte]=50&price[lte]=200
// or, equivalently
?minPrice=50&maxPrice=200
```

### 💎 Good to Know: There's No Single Universal Standard — Consistency Within Your Own API Is What Matters

Different APIs use different bracket, suffix, or separate-parameter conventions across the industry. Echoing the theme throughout this guide, what matters most is picking one convention and applying it consistently across every filterable field in your own API, not which specific syntax gets chosen.

---

## 7. How would you design a sorting parameter that supports multiple fields and both directions?

### 📖 Introduction

Multi-field sorting has a subtlety worth getting right, beyond just "ascending or descending."

### 📐 The Design

A `sort` parameter accepting a comma-separated list of fields, with a prefix or suffix convention indicating direction — a common pattern is a leading `-` for descending: `?sort=-createdAt,name` meaning "sort by createdAt descending, then by name ascending as a tiebreaker."

```js
function parseSort(sortParam) {
  return sortParam.split(",").map((field) =>
    field.startsWith("-") ? { field: field.slice(1), dir: "desc" } : { field, dir: "asc" }
  );
}
```

### 💎 Good to Know: Field Order in the Parameter Determines Sort Priority, Not Just Direction

`sort=-createdAt,name` and `sort=name,-createdAt` produce genuinely different results — which field is the primary sort key versus the tiebreaker. Worth documenting clearly, since this is easy to get backwards.

---

## 8. What's the difference between basic filtering and a genuine search feature?

### 📖 Introduction

These look similar on the surface but require fundamentally different underlying capabilities.

### 🔍 Basic Filtering

Exact, or simple range/comparison, matches against specific, structured fields — fast, indexable, predictable, covered from the performance angle in the Performance Optimization and Scalability guides' database chapters.

### 🔎 Genuine Search

Full-text matching, fuzzy or typo-tolerant matching, relevance ranking — which result is "most relevant," not just which ones technically match. A fundamentally different, more complex capability a standard database query often can't efficiently provide on its own.

### 🛠️ Why Search Often Needs Its Own Endpoint or Service

Full-text search typically requires a specialized index or engine, like Elasticsearch, fundamentally different from the primary database's standard indexes — directly the polyglot-persistence discussion in the Scalability guide. Trying to force genuine search functionality through the same simple filter-parameter mechanism from the previous question usually produces a poor, limited search experience compared to a purpose-built search endpoint.

### 💎 Good to Know: A Separate `/search` Endpoint Is Honest About the Difference

Signaling "this is fuzzy, relevance-ranked matching" through a distinct endpoint or `q`/`query` parameter lets the API be honest about the genuinely different capability and performance characteristics, rather than pretending it's just another filter.

---

## 9. How would you design an API to let a client combine filtering, sorting, and pagination consistently?

### 📖 Introduction

These three should work together as one coherent design, not three independently bolted-on features.

### 🔗 The Design

All three coexist as independent, combinable query parameters on the same collection endpoint:

```
GET /orders?status=active&sort=-createdAt&page=2&limit=20
```

The server applies filtering first, narrowing the dataset, then sorting, ordering the result, then pagination, slicing out the requested page — in that logical order, regardless of the parameter order in the actual URL.

### 💎 Good to Know: Treat This as One Design Decision, Not Three Separate Features

Directly the consistency theme from the first chapter of this guide — a client should be able to freely combine any filter with any sort with any page, without hitting unexpected, undocumented interactions between the three.

---

## 10. What's the risk of allowing a client to filter or sort by any arbitrary field?

### 📖 Introduction

Unrestricted filtering and sorting is a risk on two genuinely different axes at once.

### ⚡ Performance Risk

Allowing a client to filter or sort by literally any field means the database may need to scan or sort on a field that has no index, covered in the Performance Optimization and Scalability guides' database chapters. A single client request choosing an unindexed sort field can trigger a genuinely expensive, slow query, potentially degrading performance for every other user sharing that database — the same "one endpoint slower than the others" pattern from the Performance Optimization guide, here self-inflicted by client choice.

### 📜 API-Stability Risk

Exposing every internal field as filterable or sortable means every one of those fields also becomes part of the API's contract, from the first chapter of this guide. You can't freely rename or remove an internal field later without it being a breaking change to some client that happened to filter or sort by it.

### 💎 Good to Know: The Fix Is an Explicit Allowlist

Directly the allowlist-versus-denylist validation principle from the Web Security guide, applied here — only specific, deliberately chosen, properly indexed fields are exposed as filterable or sortable, rather than trusting or exposing whatever fields happen to exist on the underlying resource.

---

## 11. How would you design an endpoint for a client that needs to export a very large dataset?

### 📖 Introduction

Normal pagination is a genuinely poor fit for this use case — it's worth recognizing that directly rather than stretching an existing endpoint.

### ⚠️ Why Normal Pagination Doesn't Fit

A client that needs the entire dataset, not just a page a human is currently viewing, would need to make many sequential paginated requests just to assemble the full export — slow, fragile, directly the consistency problem covered in this chapter's closing scenario, and putting repeated load on the API for what's really one logical operation.

### 🛠️ The Design Approach

A dedicated export endpoint that either streams the full dataset directly, the response-streaming concept from the Performance Optimization guide, as one long-running response, or, for a genuinely large export, triggers an asynchronous job, covered in the Scalability guide's Asynchronous Processing chapter, that generates a downloadable file the client polls for or gets notified about via webhook, covered in the previous chapter, once ready.

### 💎 Good to Know: The Same Data, a Different Access Pattern, Genuinely Warrants a Different Endpoint

Directly the lesson from the API Resource Design chapter about not forcing every need into one rigid resource shape.

---

## 12. What's the tradeoff between putting complex filters in the query string versus a request body?

### 📖 Introduction

Both approaches are used in real APIs, and the right choice depends on how complex the filtering genuinely needs to be.

### 🔗 Query String

Standard REST convention for a read/GET operation, bookmarkable and shareable as a single URL, and cacheable, covered in the previous chapter. But has practical length limits — browsers and servers often cap URL length around 2000 characters — and gets awkward for genuinely complex, deeply nested filter logic, like an "AND of ORs" combination.

### 📦 Request Body (Even for a Conceptually "Read" Operation)

No practical length limit, and can express arbitrarily complex, nested filter structures naturally as JSON. But violates the convention that GET requests don't have meaningful bodies — many HTTP clients and proxies don't reliably support a GET with a body — typically requiring a POST to a dedicated search-style endpoint instead, `POST /orders/search`, which somewhat muddies the safe and idempotent GET semantics covered in the REST API Principles chapter.

### 💎 Good to Know: A Common, Pragmatic Compromise

Simple, common filters via query string on the standard GET collection endpoint, with a separate, POST-based search endpoint reserved specifically for genuinely complex filter logic that doesn't fit comfortably in a URL — directly paralleling the "genuine search deserves its own endpoint" pattern from earlier in this chapter, now for complex filtering specifically.

---

## 13. How would you evolve a filtering/sorting surface over time without it becoming an unmanageable pile of ad-hoc parameters?

### 📖 Introduction

This surface is just as much part of the API's contract as the resource endpoints themselves, and deserves the same deliberate evolution process.

### ⚠️ The Risk

Every new feature request — "can we also filter by X" — tempts adding one more ad-hoc query parameter. Over time, an API can accumulate dozens of loosely related, inconsistently named filter parameters with no overall coherent structure — directly the style-guide erosion pattern from the first chapter of this guide, now specifically for the filter and sort surface.

### 🛠️ The Approach

Apply the same deliberate, allowlist-based design discipline from earlier in this chapter to every new filter added — is this genuinely needed, is it properly indexed, does it follow the existing operator and naming convention — rather than reflexively adding whatever's requested. Periodically review the existing set of filter parameters for ones that are genuinely unused or redundant and could be deprecated, using the entire process covered in this guide's API Versioning chapter.

### 💎 Good to Know: This Surface Deserves the Same Scrutiny as Resource Endpoints

Not a low-stakes area where anything goes — it's just as much part of the API's overall contract as its resource endpoints.

---

## 14. Why should filtering, sorting, and pagination parameter names be consistent across every collection endpoint?

### 📖 Introduction

This is where predictability, from the first chapter of this guide, pays off at exactly the scale where it matters most.

### 🧩 Why It Matters Here Specifically

A client that's learned `?sort=-createdAt&page=2&limit=20` works on `/orders` should be able to apply the exact same pattern to `/products` or `/users`, without checking whether this particular endpoint happens to call it `?sortBy=` instead of `?sort=`, or `?pageSize=` instead of `?limit=`.

### 💎 Good to Know: This Convention Has an Outsized Payoff, Precisely Because It's So Widely Repeated

Worth codifying explicitly in an API style guide, from the first chapter of this guide — getting this one convention right has a much bigger payoff than a one-off naming choice that only affects a single endpoint, since pagination, filtering, and sorting parameters appear on every collection endpoint across an entire API.

---

## 15. In production, a client complains that paginating through a large, frequently-changing dataset shows duplicate or missing items — walk through why and how you'd fix it.

### 📖 Introduction

This closes the chapter by showing exactly why the offset-versus-cursor distinction from earlier in this chapter isn't purely academic.

### 🔍 Why This Happens

This is a classic symptom of offset-based pagination combined with a dataset that genuinely changes between page requests. If a new item gets inserted, or an existing one deleted, while a client is paginating through offset-based pages, the offset-based "skip N, take M" math shifts underneath the client between requests — causing items to appear twice, if something was deleted and subsequent items shift earlier, re-showing something already seen, or to be skipped entirely, if something was inserted and subsequent items shift later, jumping past an item that was never actually shown.

### 🛠️ The Fix

Switch to cursor-based pagination for this specific endpoint. Since a cursor is typically based on a stable, unique value from the last-seen item, like its ID or creation timestamp, rather than a raw positional count, insertions or deletions elsewhere in the dataset don't shift what the cursor actually points to — avoiding this exact duplicate-or-missing-item class of bug entirely.

### 💎 Good to Know: This Ties the Chapter's Opening Distinction to a Concrete, Diagnosable Symptom

A frequently changing dataset is exactly the practical, real-world scenario where the choice between offset-based and cursor-based pagination genuinely determines whether the API behaves correctly, or produces confusing, hard-to-reproduce bugs for real users.
