---
title: Request & Response Design
description: Consistent payloads, status codes, and shaping responses clients can rely on.
sidebar_position: 4
---

# Request & Response Design

## 1. Why does having a consistent response shape across every endpoint matter, even when different endpoints return different data?

### 📖 Introduction

This chapter is where the previous chapters' consistency and uniform-interface principles get applied concretely to the actual JSON payloads clients parse.

### 🧩 Why It Matters Even With Different Data

A client's parsing code — deserialize the response, check for an error, extract the actual payload — can be written once, generically, and reused across every endpoint. If the envelope shape varies per endpoint, that parsing logic has to be rewritten or special-cased for each one.

### 💎 Good to Know: The Same "Learn It Once" Benefit From Earlier Chapters, Now at the Payload Level

This is the same underlying benefit behind predictability from the first chapter of this guide, and consistent URL naming from the previous chapter — worth recognizing consistency as a theme that applies at every level of API design, not just one of them.

---

## 2. What are the broad categories of HTTP status codes, and what does each communicate?

### 📖 Introduction

Status codes are a genuinely useful, standardized signaling mechanism worth understanding at the category level before getting into specific codes.

### 📊 The Categories

**2xx (Success)** — the request was received, understood, and processed successfully: 200 OK, 201 Created, 204 No Content. **3xx (Redirection)** — further action is needed to complete the request; the client should look elsewhere. **4xx (Client Error)** — the request itself was the problem: bad input, missing auth, requesting something that doesn't exist. The client needs to change something before retrying. **5xx (Server Error)** — the server failed to fulfill an otherwise valid request. The client did nothing wrong; something broke server-side.

### 💎 Good to Know: The 4xx/5xx Distinction Is Genuinely Actionable Information

It directly tells a client whether retrying the same request is even worth trying — a 5xx might succeed on retry if it was transient, while a 4xx will fail the same way every time until the client changes something. This connects directly to the retry-and-backoff discussion in the Scalability guide's High Availability chapter.

---

## 3. What's the difference between 401 and 403, and why do developers commonly mix these up?

### 📖 Introduction

This is a genuinely widespread, historical naming confusion, not just a common individual mistake.

### 🔐 The Difference

**401 (Unauthorized)** — despite the confusing name, this actually means "you haven't authenticated," or your credentials are invalid or expired. The server doesn't know who you are. **403 (Forbidden)** — the server knows who you are, you're authenticated, but you don't have permission to do this specific thing.

### 🤔 Why They Get Mixed Up

The name "Unauthorized" sounds like it should mean "not authorized to do this," which is actually 403's job — a genuine, longstanding quirk baked into the HTTP spec itself.

### 💎 Good to Know: This Is the Same Distinction Covered in the Web Security Guide, From a Different Angle

The Web Security guide's Authentication & Authorization chapter covers this same distinction conceptually, as authentication versus authorization. This question is the same distinction, now specifically as an API-response-design decision — which code to actually return — rather than a security concept to understand.

---

## 4. What's the difference between 400 and 422, and when would you use one over the other?

### 📖 Introduction

Both represent something wrong with the client's request, but at genuinely different levels.

### 🚫 400 (Bad Request)

The request is malformed at a structural level — invalid JSON syntax, a required field entirely missing, a value that's the wrong type, a string where a number was expected. The server can't even meaningfully process the request as submitted.

### ⚠️ 422 (Unprocessable Entity)

The request is structurally well-formed and understood, but fails a semantic or business-rule validation — a well-formed email field that isn't actually a valid email format, a date that needs to be in the future but isn't, a username that's syntactically fine but already taken.

### 💎 Good to Know: This Distinction Isn't Universally Agreed Upon, but the Underlying Idea Is Useful Regardless

Some APIs use 400 for both cases. The underlying distinction it's trying to draw — structurally invalid versus semantically invalid — is genuinely useful for a client to tell apart, regardless of which specific status code an API chooses to represent it with, as long as it's applied consistently.

---

## 5. Why is returning 200 with an `"error": true` field in the body a design anti-pattern?

### 📖 Introduction

This is a genuinely common mistake, precisely because it feels simpler at first glance.

### ⚠️ Why It's an Anti-Pattern

It defeats the entire purpose of HTTP status codes existing in the first place. HTTP infrastructure — browsers, monitoring tools, caching layers, the load balancers and circuit breakers covered in the Scalability guide — all make decisions based on the status code, without necessarily parsing the response body. A 200 status universally signals "success" to all of these layers, even if the body says otherwise, meaning a genuine failure gets silently misclassified as success by anything not specifically written to check the body too.

### 💥 A Real Consequence

A circuit breaker, covered in the Scalability guide's High Availability chapter, won't trip on this kind of hidden failure, since it only sees 200s. Monitoring that tracks error rate by status code will under-report real failures.

### 💎 Good to Know: This Throws Away a Signaling Mechanism HTTP Already Provides for Free

Forcing every consumer to reimplement error detection by parsing the body, instead of just checking the status code like normal, is a genuine, unnecessary cost imposed on every single consumer of the API.

---

## 6. What is content negotiation, and how do `Accept` and `Content-Type` let a client and server agree on a format?

### 📖 Introduction

Even a JSON-only API benefits from understanding this mechanism.

### 🤝 What It Is

A mechanism letting a client and server agree on the format of data being exchanged, without the API needing separate endpoints for each possible format.

### 🔄 How It Works

The client sends an `Accept` header indicating what format it can handle — `Accept: application/json`. The server responds in a matching format, or an appropriate error if it can't. The `Content-Type` header on a request body tells the server what format the client is sending — `Content-Type: application/json`.

### 💎 Good to Know: These Headers Matter Even in a JSON-Only API

Most modern APIs just always use JSON and don't genuinely support multiple formats — but `Content-Type` and `Accept` still matter, since they let the server correctly parse the incoming body and reject a request sent with the wrong content type, rather than silently misinterpreting it.

---

## 7. How would you design a consistent envelope for success and error responses?

### 📖 Introduction

This is the concrete design that delivers on the first question's opening principle.

### 📦 The Design Approach

Both success and error responses share a predictable top-level structure a client can check without needing to know in advance whether the request succeeded.

```json
// Success
{ "data": { "id": 42, "name": "Alex" }, "error": null }

// Error
{ "data": null, "error": { "code": "NOT_FOUND", "message": "User not found" } }
```

Client code can check one consistent shape — `if (response.error) { ... } else { ... }` — regardless of which endpoint was called.

### 💎 Good to Know: This Complements the Status Code, It Doesn't Replace It

This is distinct from the anti-pattern covered earlier in this chapter — this envelope pairs with the *correct* HTTP status code. A 4xx or 5xx response also has this error shape in the body, giving both a correct status code and a rich, structured error body, rather than hiding the real status inside a 200.

---

## 8. What's the difference between a field being `null` versus entirely missing from a response?

### 📖 Introduction

This distinction seems minor until it becomes essential for designing PATCH requests, covered later in this chapter.

### 🔀 The Distinction

`null` is an explicit value meaning "this field exists on the resource, and its current value is nothing" — a user's `middleName: null` because they genuinely don't have one. A missing field, not present in the JSON at all, can mean something genuinely different depending on context: "this field doesn't apply to this resource type," "you don't have permission to see this field," or, in a PATCH request specifically, "the client didn't intend to change this field at all."

### 🤔 Why It Matters to a Consuming Client

Code that checks `if (user.middleName)` treats both cases the same way in JavaScript, since both are falsy. A client that needs to genuinely distinguish "explicitly cleared" from "never set" needs to check `"middleName" in user` specifically — something most developers don't think to do unless the API's documentation explicitly calls out that the distinction matters.

### 💎 Good to Know: This Is the Conceptual Foundation for PATCH Body Design, Covered Later in This Chapter

Worth flagging here since the PATCH question builds directly on this distinction.

---

## 9. What date/time format should an API standardize on?

### 📖 Introduction

This is a simple, low-effort standardization that avoids a real, recurring class of bugs.

### 🌍 Why Standardize

Different date formats are genuinely ambiguous across regional conventions — `03/04/2025` means March 4th under the US convention but April 3rd under most of the rest of the world's. An API returning dates in an ambiguous format forces every consumer to somehow already know, or guess, which convention was intended.

### 📐 ISO 8601

An international standard format — `2025-03-04T14:30:00Z` — that's unambiguous regardless of the reader's regional convention, includes timezone information explicitly, critical for anything time-sensitive, and is directly parseable by virtually every programming language's standard library without custom parsing logic.

### 💎 Good to Know: Treat This as a Non-Negotiable, Universal Default

Off-by-one-day errors from timezone or format misinterpretation are a real, recurring bug class — worth treating this as a universal default across an entire API rather than a per-endpoint decision, directly the subject of this chapter's closing scenario.

---

## 10. How would you design a response to let a client request only the fields it actually needs?

### 📖 Introduction

This is a way to get one of GraphQL's core benefits without leaving REST.

### 🎯 The Design Approach

A query parameter, commonly `?fields=name,email` or `?select=name,email`, letting the client specify exactly which fields it wants back, with the server returning only those fields rather than the full resource representation.

### 📉 Why It's Useful

Reduces payload size, covered in the Performance Optimization guide's network chapter, for clients that only need a small subset of a large resource — avoiding the "over-fetching" problem that's one of GraphQL's core selling points, achieved here within a plain REST API instead.

### 💎 Good to Know: This Is an Optional, Additive Feature — Add It When There's a Real Need

Adding support for a `fields` parameter doesn't break existing clients who don't use it, since the default behavior without the parameter stays the same, full response — directly the additive-change framework from the first chapter of this guide. Worth reaching for specifically when there's a real, demonstrated payload-size problem, rather than adding it preemptively to every endpoint.

---

## 11. What response metadata is commonly included alongside the actual data, and why does it belong in a separate section?

### 📖 Introduction

Metadata and the resource itself serve different purposes, and keeping them structurally separate matters.

### 📋 What It Includes

Pagination info, covered in this guide's Pagination, Filtering, Sorting & Searching chapter. A request ID, useful for a client to reference when reporting an issue, connecting directly to distributed tracing from the Scalability guide's Microservices chapter. Rate-limit status, how many requests remain before hitting a limit, covered in the Web Security guide's API Security chapter.

### 🗂️ Why It Belongs Separately

Mixing metadata into the actual resource data means a client can't tell which fields are genuinely part of the resource, and thus safe to, say, PUT back unchanged, versus which are just contextual information about the response itself. Keeping them separate — `{ data: {...}, meta: {...} }` — keeps the resource's own shape clean and consistent regardless of what metadata happens to be relevant for a given request.

### 💎 Good to Know: This Belongs in the Same Envelope Structure Covered Earlier in This Chapter

Response metadata is exactly the kind of thing that fits alongside, not mixed into, the actual `data` payload in the consistent envelope design covered earlier in this chapter.

---

## 12. Why should an API avoid using HTTP status codes creatively or non-standardly?

### 📖 Introduction

An unusual status code is a fun trivia fact, but a real liability in production.

### ⚠️ Why Avoid It

An uncommon or non-standard status code, like 418 "I'm a Teapot," a genuine but joke status code from an April Fools' RFC, is likely to be mishandled by client libraries, monitoring tools, and infrastructure that only recognize the common, widely used codes. An unrecognized status code might get treated generically as an error, losing any nuance you meant to communicate, or worse, mishandled unpredictably by some specific piece of middleware.

### 💎 Good to Know: This Is Predictability From the First Chapter of This Guide, Applied to Status Codes

Sticking to the well-established, widely recognized subset of status codes, roughly 15–20 codes cover the vast majority of real API needs, is worth more than a technically more precise but obscure code that nothing in the ecosystem actually handles correctly.

---

## 13. How would you design a request body for creating a resource with several optional fields?

### 📖 Introduction

Clarity about what's actually required is what separates an easy integration from a frustrating trial-and-error one.

### 🛠️ The Approach

Clearly document, ideally via OpenAPI, from the first chapter of this guide, which fields are required versus optional. Provide sensible defaults for optional fields wherever a reasonable default exists. Validate that required fields are actually present before proceeding, returning a clear, field-specific error, covered in this guide's Error Handling & Validation chapter, if they're missing.

```js
const createUserSchema = z.object({
  email: z.string().email(),          // required
  name: z.string(),                    // required
  bio: z.string().optional(),          // optional, no default needed
  role: z.enum(["member", "admin"]).default("member"), // optional, with a default
});
```

### 💎 Good to Know: Request Body Design and Validation Error Design Are Two Halves of the Same Decision

Which fields are required, and how validation errors get returned when that's violated, covered in this guide's Error Handling & Validation chapter, aren't separate concerns to think about independently.

---

## 14. How does request body design differ between PUT and PATCH, specifically around the null-vs-missing distinction?

### 📖 Introduction

The previous chapter covered the conceptual difference between PUT and PATCH — this is the practical mechanics of actually designing each request body.

### 🔄 PUT Body Design

Since PUT represents the complete new state, the request body should include every field of the resource, or the API should clearly define which fields are optional to omit versus which are required even in a PUT, since "complete replacement" doesn't necessarily mean every field must be explicitly restated if some have sensible defaults.

### ✏️ PATCH Body Design — the Harder Problem

How does a PATCH body express "set this field to null," clearing it, versus "don't touch this field at all," leaving it as-is? Directly the null-versus-missing distinction from earlier in this chapter, now concretely applied. The standard convention: an explicitly included field with value `null` means "clear it," while an omitted field means "leave it unchanged" — requiring the API's parsing logic to check for field *presence*, not just a truthy or falsy value, when processing a PATCH body.

```json
// PATCH /users/42 — explicitly clears the phone field
{ "phone": null }

// PATCH /users/42 — leaves phone untouched entirely, since it's omitted
{ "name": "Alex" }
```

### 💎 Good to Know: Formal Standards Exist for This Exact Ambiguity

JSON Merge Patch (RFC 7396) and JSON Patch (RFC 6902, a more explicit list of add/remove/replace operations) exist specifically to remove ambiguity about this null-versus-missing distinction. Worth knowing they exist, even though most real APIs just use the simpler, informal "null clears, omitted leaves it" convention described above without formally adopting one of these RFCs.

---

## 15. What is an idempotency key, and how would you design a POST endpoint to safely handle a retried request?

### 📖 Introduction

The previous chapter introduced why this pattern exists — this is the concrete, practical implementation.

### 🔑 What It Is

A unique, client-generated value, often a UUID, sent in a request header, `Idempotency-Key: abc-123`, alongside a POST request.

### 🛠️ How the Server Uses It

On receiving a POST with an idempotency key, the server first checks whether it's already processed a request with that exact key. If yes, it returns the same response it returned the first time, without re-executing the underlying operation again. If no, it processes the request normally and stores the result keyed by that idempotency key, typically with an expiration so old keys eventually get cleaned up, for future duplicate checks.

```js
app.post("/charges", async (req, res) => {
  const key = req.headers["idempotency-key"];
  const existing = await IdempotencyRecord.findOne({ key });
  if (existing) return res.json(existing.response); // don't reprocess

  const result = await chargeCustomer(req.body);
  await IdempotencyRecord.create({ key, response: result });
  res.json(result);
});
```

### 💎 Good to Know: The Client Must Reuse the Same Key on Retry, Not Generate a New One

A client generates a new idempotency key for each genuinely new logical operation, but reuses the same key when retrying a request that might not have completed. Generating a new key on every retry defeats the entire mechanism — directly connecting back to the POST-retry-safety motivation covered in the previous chapter.

---

## 16. How would you design a webhook payload so a receiver can reliably verify and process an event, even if it arrives more than once?

### 📖 Introduction

The Web Security guide covers HMAC signing for webhook *security* — this is the design angle, the payload's actual structure.

### 📦 Design Elements

An event type field, `"type": "order.created"`, telling the receiver what kind of event this is, so it can route to the correct handler. The relevant resource data, or for larger resources, just enough identifying information plus a link the receiver can follow to fetch full details if needed, trading payload size against an extra round trip. A timestamp indicating when the event actually occurred.

### 🔁 Handling Duplicate Delivery

Include a unique event ID, covered further in the next question, so a receiver that's already processed a specific event ID can safely recognize and ignore a re-delivered duplicate — the same idempotency principle from earlier in this chapter, now applied on the receiving side of an inbound webhook rather than the sending side of an outbound POST.

### 💎 Good to Know: Most Webhook Systems Guarantee At-Least-Once Delivery, Not Exactly-Once

This connects directly to the at-least-once delivery discussion in the Scalability guide's Asynchronous Processing chapter — the receiver genuinely must be built to handle duplicate deliveries gracefully, not merely as an edge case.

---

## 17. Why should a webhook sender include an event ID and type, rather than just sending raw resource data?

### 📖 Introduction

This resolves the design gap raised in the previous question directly.

### ⚠️ Why Not Just Send Raw Resource Data

If a webhook simply sends "here's the current state of order 123," with no event context, the receiver has no way to know what actually changed — was it just created, updated, or did its status change specifically — or whether it's seeing this exact notification for the first time or a repeat. An event ID lets the receiver deduplicate, and an event type lets it react appropriately differently depending on what specifically happened, rather than independently re-deriving that information by comparing against whatever state it happened to have stored previously, which is fragile and can easily fall out of sync.

### 💎 Good to Know: An Event Tells You What Happened; a Resource Only Tells You What Currently Is

A raw resource representation tells you what something currently is. An event additionally tells you what happened and when — exactly the information a receiver needs to react correctly and safely, rather than just knowing the latest state.

---

## 18. In production, two different endpoints in the same API return timestamps in two different formats — walk through why this happened and how you'd fix it.

### 📖 Introduction

This closes the chapter with a small-looking inconsistency that turns out to require real discipline to fix properly.

### 🔍 Why This Happened

Almost certainly the same root cause as the closing scenarios of the previous two chapters: no enforced style guide, from the first chapter of this guide, different engineers building different endpoints at different times, each making a reasonable, individually defensible choice — one used a library's default `Date.toString()` format, another explicitly formatted as ISO 8601, covered earlier in this chapter — without a documented standard to check against.

### 🛠️ Fixing It Without Breaking Clients

This is genuinely a breaking change for whichever endpoint gets "fixed" — any client already parsing the old, non-standard format will break if it silently changes. Applying the safe-change framework from the first chapter of this guide: would an existing, correctly written client still work after this change? No. That means this requires the actual deprecation process covered in this guide's API Versioning chapter — introduce the standardized format alongside the old one, perhaps a new field, or gated behind a version bump, give consumers a migration window, and only remove the old format once usage has genuinely dropped off.

### 💎 Good to Know: Even a Small "Just Fix the Bug" Inconsistency Becomes a Real Versioning Exercise

Once real clients already depend on the admittedly wrong existing behavior, fixing it properly requires the same discipline as any other breaking change — directly setting up the next chapter's entire subject matter as the necessary next step for handling exactly this kind of situation.
