---
title: API Security
description: Rate limiting, API keys, and securing endpoints against abuse.
sidebar_position: 4
---

# API Security

## 1. What makes API security distinct from general web application security?

### 📖 Introduction

Everything covered in the previous three chapters still applies to APIs — but APIs have no browser sitting in front of them, and that single difference changes which risks matter most.

### 🖥️ No Browser Means No Browser Protections

A regular web page benefits from a whole set of browser-enforced safety nets: the Same-Origin Policy, automatic HTML escaping when rendering text, CORS controlling what other sites' scripts can read. An API consumed directly by a mobile app, another server, or a script has none of that — the caller is a program, not a sandboxed page, and nothing stops it from sending exactly the request it wants, exactly as fast as it wants.

### 🤖 No Human in the Loop

A phishing page tricks a *person* into clicking something. An API has no person to trick — an attacker interacts with it directly, at machine speed, using tools like `curl` or a script, with no visual cues to notice something's wrong and no friction slowing them down. This is a big part of why rate limiting and strong authentication, covered throughout this chapter, matter so much more here than on a typical rendered web page.

### 💎 Good to Know: OWASP Publishes a Separate API Security Top 10

This distinction is significant enough that OWASP maintains a dedicated **API Security Top 10**, separate from the general Top 10 covered in earlier chapters — several of this chapter's questions (Broken Object Level Authorization, mass assignment, excessive data exposure) come directly from it.

---

## 2. What is rate limiting, why is it necessary, and what are common algorithms used to implement it?

### 📖 Introduction

Since nothing stops a programmatic caller from sending requests as fast as it can, something on your side has to.

### 🚦 What Rate Limiting Is

Rate limiting caps how many requests a client can make within a given time window, rejecting or delaying anything beyond that limit. It's the primary defense against brute-force login attempts (from the Authentication chapter), scraping, and simple denial-of-service abuse.

### 🧮 Common Algorithms

- **Fixed window** — count requests within a fixed time bucket (e.g., 100 requests between :00 and :59 of each minute). Simple, but has a boundary problem: a client could send 100 requests at 11:59:59 and another 100 at 12:00:00, getting 200 requests in two real seconds while technically staying within the rule.
- **Sliding window** — tracks requests over a continuously moving window rather than fixed buckets, avoiding the boundary-burst problem at the cost of slightly more computation to track.
- **Token bucket** — a bucket holds a fixed number of tokens, refilled at a steady rate; each request consumes one token. This naturally allows brief legitimate bursts (as long as tokens are available) while still enforcing a steady average rate over time, which is why it's a popular default.

```js
const rateLimit = require("express-rate-limit");

app.use("/api/", rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,             // 100 requests per window per client
}));
```

### 💎 Good to Know: Having Any Rate Limit Matters More Than Picking the "Best" One

Most real incidents trace back to an endpoint having **no** rate limiting at all, not to a team having chosen a suboptimal algorithm. Getting some reasonable limit in place everywhere beats spending a long time picking the theoretically perfect one for a single endpoint.

---

## 3. How would you implement rate limiting in a distributed system with multiple API server instances?

### 📖 Introduction

The rate limiter shown in the previous question has a hidden assumption worth calling out directly: it only works correctly on a single server instance.

### ⚠️ Why an In-Memory Counter Breaks Down

If the API runs behind a load balancer across multiple instances, each instance keeps its own separate, independent count in memory. A client whose requests get spread across five instances effectively gets five times the intended limit, since none of the instances know anything about what the others have counted — each one only ever sees a fraction of the client's real traffic.

### 🗄️ The Fix: A Centralized Store

All instances need to read and write the **same** counter, typically kept in a shared store like Redis, using an atomic increment-with-expiry operation so concurrent requests from multiple instances can't race each other into an inaccurate count.

```js
async function isRateLimited(redisClient, key, limit, windowSeconds) {
  const count = await redisClient.incr(key);
  if (count === 1) {
    await redisClient.expire(key, windowSeconds); // set TTL only on first hit
  }
  return count > limit;
}
```

### 💎 Good to Know: This Is the Same Root Problem as the Session Chapter's Production Scenario

Anything relying on a single process's in-memory state — session storage in the previous chapter, or a request counter here — breaks the exact same way the moment there's more than one server instance in the picture. It's worth recognizing this as one general pattern ("per-instance memory doesn't survive horizontal scaling") rather than a separate lesson for every feature it happens to affect.

---

## 4. What is an API key, how does it differ from an OAuth access token, and what are the risks of using API keys as the sole authentication mechanism?

### 📖 Introduction

Both are strings sent with a request to prove the caller is allowed to be there, but they represent meaningfully different levels of trust and control.

### 🔑 API Keys

A static, typically long-lived, opaque string identifying a calling application or service. Simple to generate and simple for a client to use — often just a single header on every request — but usually coarse-grained and rarely expires on its own.

### 🎫 OAuth Access Tokens

Short-lived, scoped to specific permissions, obtained through a proper authorization flow (covered in the Authentication chapter), and can represent a specific *user's* delegated permission rather than just "this application is calling."

### ⚠️ The Risk of API Keys as the Only Mechanism

If a static API key leaks — in client-side code, in a public git repository, or in a log file, all covered later in this chapter — an attacker has full access with everything that key can do, indefinitely, until someone notices and manually rotates it. There's typically no per-user identity behind an API key either, meaning no way to tell *which* user of an integration performed a specific action, and no way to revoke access for one misbehaving user without breaking the shared key for everyone else using it.

### 💎 Good to Know: API Keys Are Still a Reasonable Choice for Low-Stakes Cases

For simple, low-privilege, service-to-service scenarios — a public read-only weather API, for instance — a static key is a perfectly reasonable trade of simplicity for a small amount of risk. The real question is always whether the risk of that key leaking is proportionate to what it actually grants access to.

---

## 5. What is Broken Object Level Authorization (BOLA), and how does it differ from broken function-level authorization?

### 📖 Introduction

This is the previous chapter's IDOR, viewed through the API-specific lens OWASP uses to rank it — and it's worth also distinguishing it from a closely related, but different, failure.

### 🔓 BOLA

BOLA is the API-specific name for exactly the IDOR pattern covered in the Authentication & Authorization chapter: an endpoint accepts an object ID from the client and returns or modifies it without verifying the requester actually owns or is permitted to access that specific object. It tops the OWASP API Security Top 10 for the same reason broken access control topped the general one — it's a logic gap specific to your application's business rules, not something a generic scanner reliably catches, and APIs expose raw IDs in URLs and request bodies constantly by their very nature.

### 🚪 Broken Function-Level Authorization

This is a different axis of the same underlying problem. BOLA asks *"am I allowed to touch this specific resource?"* Broken function-level authorization asks a coarser question: *"am I allowed to call this endpoint or action at all, regardless of which resource it targets?"* A concrete example: a `DELETE /api/admin/users/:id` route with no role check at all — any authenticated user can call it, on any user ID, not because they found someone else's data, but because the *entire endpoint* was never restricted to admins in the first place.

### 💎 Good to Know: Many Real Endpoints Have Both Problems at Once

An admin-only endpoint with no role check, that also fetches its target object without an ownership check, has failed at both levels simultaneously. Reviewing an endpoint's security means checking both questions separately — "who can call this at all" and "which specific objects can they touch through it" — since fixing one doesn't automatically fix the other.

---

## 6. What is mass assignment, and how can it let an attacker escalate their own privileges?

### 📖 Introduction

This is the general mechanism behind the vertical privilege escalation example from the Authentication & Authorization chapter — worth understanding on its own as a broader API vulnerability class.

### 📦 What It Is

Mass assignment happens when an endpoint takes the entire request body and passes it directly into an update operation, without an explicit list of which fields the client is actually allowed to set.

```js
// Vulnerable: applies every field the client sends, no exceptions
app.patch("/api/users/:id", requireAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

// Fixed: only the fields a client should ever be able to change
app.patch("/api/users/:id", requireAuth, async (req, res) => {
  const { name, bio } = req.body; // explicit allowlist
  await User.findOneAndUpdate({ _id: req.params.id, ownerId: req.user.id }, { name, bio });
  res.json({ success: true });
});
```

A schema validation library like Zod or Joi, configured to strip or reject unknown fields, achieves the same protection more systematically across an entire codebase than remembering to destructure fields manually on every route.

### 💎 Good to Know: This Is the Mechanism, Privilege Escalation Was One Consequence

The earlier chapter's `role`-field example was mass assignment applied to a privilege field specifically. The same mechanism can just as easily let a client silently set an `isVerified` flag, an internal `price` field, or any other property never meant to be client-writable — the fix (explicit allowlisting) is identical regardless of which field ends up being the dangerous one.

---

## 7. What is excessive data exposure, and why is returning full internal objects "because the frontend only uses some fields" a real security risk?

### 📖 Introduction

This is a different kind of problem from the last two questions — it's not about *who* can call an endpoint, but about how much an endpoint hands back even to a caller who's fully entitled to be there.

### 📤 What It Is

Excessive data exposure happens when an API returns an entire internal object or database record as-is, relying on the frontend to simply choose not to display certain fields, rather than the API itself deciding what's actually safe to send.

```js
// Vulnerable: returns the full Mongoose document, whatever fields it has
app.get("/api/users/:id", requireAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user); // could include passwordHash, internal flags, etc.
});

// Fixed: an explicit response shape, decided by the server
app.get("/api/users/:id", requireAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ id: user.id, name: user.name, email: user.email });
});
```

### 🕵️ Why "the UI Just Hides It" Doesn't Help

Anyone inspecting network traffic — the browser's own devtools, a proxy tool, or simply calling the API directly with `curl` — sees every field in the raw response, completely independent of what the frontend chooses to render. Password hashes, internal-only flags, another user's partial data pulled in through a relation, or internal cost/pricing figures can all leak this way, even though the UI itself never displays them.

### 💎 Good to Know: This Is Least Privilege, Applied to Response Shape

The earlier BOLA and mass-assignment questions were about controlling *who can access or change what*. This one applies the same least-privilege principle from the first chapter to the *shape of the response itself* — even a fully authorized caller shouldn't receive more data than the specific operation actually requires.

---

## 8. How should input validation be enforced at the API boundary?

### 📖 Introduction

This comes up again in more depth when injection attacks are covered in the Common Web Vulnerabilities chapter, but the basic principle belongs here, at the level of the API itself.

### 🚫 Why Client-Side Validation Provides No Actual Security

Frontend validation is a genuinely good user-experience feature — catching a typo before a form even submits — but it provides zero real protection, because nothing forces a caller to go through your frontend at all. An attacker calling the API directly with `curl`, Postman, or a script skips any client-side JavaScript entirely, submitting whatever they want straight to the server.

### ✅ Enforcing It Server-Side

Validation needs to run on the server, as a dedicated step before the request reaches business logic — checking type, shape, length, and format against an explicit schema.

```js
const { z } = require("zod");

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(10000),
});

app.post("/api/posts", requireAuth, (req, res, next) => {
  const result = createPostSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  req.validatedBody = result.data;
  next();
}, createPost);
```

### 💎 Good to Know: This Is the API Boundary's Version of a Broader Principle

The Common Web Vulnerabilities chapter later distinguishes validation, sanitization, and encoding as separate defenses against injection. This question is specifically about *where* that first line of defense has to live — at the server boundary, before anything touches a database query, a file path, or another system — not merely that it should exist somewhere.

---

## 9. What are common denial-of-service risks specific to APIs, and how do you defend against them?

### 📖 Introduction

Beyond a straightforward flood of requests, which rate limiting addresses, APIs are vulnerable to a subtler category of DoS: a single, small-looking request that costs the server a disproportionate amount of work.

### 📦 Large Payloads

An endpoint with no request body size limit can be sent an enormous JSON payload or file, consuming memory and bandwidth on a single request. Setting an explicit limit closes this off directly:

```js
app.use(express.json({ limit: "1mb" }));
```

### 📄 Unbounded Pagination

An endpoint like `GET /api/users?limit=1000000` will happily return everything in one query if the `limit` parameter isn't capped server-side, regardless of what a reasonable client would ever actually request:

```js
function getPageSize(req) {
  const requested = parseInt(req.query.limit, 10) || 20;
  return Math.min(requested, 100); // hard cap, ignoring what the client asked for
}
```

### 🐌 Expensive Queries

An endpoint that lets a client trigger an expensive, unindexed, or complex database operation cheaply — an unrestricted free-text search across a large, unindexed field is a common example — can be hit repeatedly to degrade performance for every user of the system, not just the attacker's own requests.

### 💎 Good to Know: The Common Thread Is Asymmetric Cost

All three cases share the same shape: a tiny, cheap request from the caller's side that triggers a disproportionately expensive amount of work on the server's side. The general defense principle is the same across all of them — never let the client fully control how much work a single request is allowed to cause.

---

## 10. What is API versioning, and what security implications come from keeping old versions running indefinitely?

### 📖 Introduction

Versioning is usually framed as a backward-compatibility feature, but it has a security dimension that's easy to overlook once a new version has shipped and attention has moved on.

### 🔢 What API Versioning Is

Exposing multiple versions of an API at once — commonly via a URL prefix like `/v1/` and `/v2/` — so existing clients keep working unmodified while new features or breaking changes roll out under a newer version.

### ⚠️ The Security Implication

An old version often quietly stops receiving security fixes once it's considered "deprecated" in practice, even while it's technically still reachable. A vulnerability discovered and patched in `/v2/` may remain fully exploitable via `/v1/` indefinitely, if nobody ever actually removes it. It's easy to mentally patch "the API" while only actually touching the current version's code — validation improvements, added rate limiting, or a fixed authorization bug can all end up applied to the newest version only, leaving older ones just as vulnerable as they always were.

### 💎 Good to Know: A Deprecation Policy Without an Enforced Shutoff Date Isn't Really a Policy

"Deprecated" needs to come with an actual, enforced end-of-life date after which the old version stops responding entirely. Without one, deprecated in name only effectively means permanently vulnerable to anything discovered in it from this point forward, since nothing forces anyone to go back and fix it.

---

## 11. What is a webhook, and how do signature verification and a timestamp/nonce protect it?

### 📖 Introduction

A webhook flips the usual direction of an API call — instead of your app asking another service for data, the other service pushes data to *you* — and that reversal creates a trust problem worth understanding on its own.

### 📨 What a Webhook Is

A webhook is an HTTP `POST` request that another service sends to a URL you provide, triggered automatically when some event happens on their end — for example, Stripe calling your `/webhooks/stripe` endpoint the moment a payment succeeds.

### ⚠️ The Trust Problem

Your webhook endpoint is a public URL. Literally anyone on the internet can send a `POST` request to it claiming to be Stripe, with a fabricated payload — "payment succeeded," triggering whatever your handler does in response, without any real payment having happened at all.

### ✍️ HMAC Signature Verification

The sender computes an HMAC (a cryptographic signature) over the raw request body using a secret only the two parties share, and includes it in a header. Your endpoint recomputes the same HMAC using its own copy of that secret and compares the two. Only someone who actually has the shared secret could have produced a matching signature, which proves both that the payload really came from the claimed sender and that it wasn't altered in transit.

```js
const crypto = require("crypto");

function verifyWebhookSignature(rawBody, receivedSignature, secret) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSignature));
}
```

### ⏱️ Preventing Replay

A correctly signed payload is still valid forever unless something stops it from being reused — an attacker who intercepts one legitimate, correctly-signed webhook could resend it later to trigger the same action again (replaying "payment succeeded" a second time, for instance). Including a timestamp in the signed payload and rejecting anything outside a short tolerance window (a few minutes), combined with tracking already-processed event IDs to reject exact duplicates, closes this off.

### 💎 Good to Know: Always Use a Timing-Safe Comparison for Signatures

Comparing the computed and received signatures with a plain `===` leaks timing information that can, in principle, help an attacker guess the correct signature one byte at a time. `crypto.timingSafeEqual`, used above, takes constant time regardless of where the strings first differ — the same underlying idea shows up again with password and token comparisons in the Server-Side Security chapter.

---

## 12. What security considerations are unique to GraphQL APIs compared to REST?

### 📖 Introduction

GraphQL's core selling point — letting a client precisely shape what data it wants in a single request — is also exactly what introduces its most distinctive security risks.

### 🌊 Query Depth and Complexity Attacks

Because a client controls how deeply nested a query's relationships go, a maliciously deep or wide query — `user → posts → comments → author → posts → comments → ...` — can force the server to do an exponential amount of resolving work from a single, small-looking request. This is a denial-of-service vector specific to GraphQL's flexibility, with no real REST equivalent, since a REST endpoint's response shape is fixed by the server rather than chosen by the client. Defending against it means enforcing a maximum query depth, assigning a "cost" to fields and rejecting queries that exceed a budget, and applying timeouts regardless.

### 🔍 Introspection Exposure

GraphQL supports an introspection query that lets a client ask the API to describe its entire schema back — every type, field, and mutation that exists. Extremely useful for development tooling, but if left enabled in production, it hands anyone a complete map of the API's internal structure, including fields and mutations that were never meant to be publicly discoverable. Disabling introspection in production, or restricting it to authenticated internal callers, is standard practice.

### 🎯 Authorization Has to Move to the Resolver Level

Unlike REST, where each endpoint is a separate, individually securable route, GraphQL typically exposes a single endpoint for everything. That means authentication and authorization checks can't live at the routing layer the way they do in REST — they have to be enforced inside each individual **resolver**, for each field and type. It's easy to properly secure the one endpoint itself while forgetting that individual resolvers underneath it still need their own, separate checks.

### 💎 Good to Know: GraphQL Doesn't Remove Any of This Chapter's Other Concerns

BOLA, mass assignment, and excessive data exposure are all just as possible in a GraphQL resolver as in a REST handler — GraphQL just changes *where* those checks need to be enforced, not whether they're still necessary.

---

## 13. What is the risk of leaking third-party API keys or secrets, and how do you prevent it?

### 📖 Introduction

This chapter has covered several ways a *service's own* credentials can be misused. This question is about a related but distinct risk — leaking the credentials your app uses to call *someone else's* API.

### ⚠️ How Secrets Leak

Hardcoding a key directly into frontend JavaScript ships it to every visitor's browser, fully visible in devtools or a page's source. Committing a secret to git means it lives in that repository's history forever, even after being deleted in a later commit, unless the history itself is rewritten. Accidentally logging a request that includes a secret (a full request object dumped to the console during debugging, for instance) can leave it sitting in application logs indefinitely.

### 🤖 This Is Actively, Continuously Scanned For

It's worth being clear that this isn't a slow, unlikely discovery — automated bots continuously scan public GitHub repositories for patterns that look like API keys (recognizable prefixes for AWS, Stripe, and many other providers), often finding a freshly pushed secret within seconds to minutes.

### 🛡️ Prevention

- Keep secrets in environment variables, loaded from a `.env` file that's explicitly excluded via `.gitignore`, never committed alongside code.
- Use secret-scanning tools — GitHub's built-in scanning, or a pre-commit hook — to block a commit *before* it ever reaches a remote repository.
- In production, use a dedicated secrets manager (AWS Secrets Manager, HashiCorp Vault, or similar) rather than files on disk.
- Have a fast, documented rotation process ready for the moment a secret is confirmed exposed.

### 💎 Good to Know: Deleting a Committed Secret Doesn't Un-Leak It

A secret that was ever committed and pushed must be treated as permanently compromised the moment it's discovered, regardless of whether it was later removed in a subsequent commit — git history retains it, and it must be rotated, not just deleted.

---

## 14. How would you detect API abuse in production beyond simple rate limiting?

### 📖 Introduction

Rate limiting caps volume from a single source, but a more determined attacker doesn't have to stay within a single source at all.

### ⚠️ Why Rate Limiting Alone Isn't Enough

A sophisticated attacker can spread requests across many IP addresses or many accounts specifically to stay under any single rate-limit threshold. Relying purely on "requests per IP per minute" misses this kind of distributed abuse entirely, since no individual source ever crosses the line.

### 🔍 Additional Signals Worth Watching

- **Unusual request sequences** — a client hitting endpoints in an order no real user interface would ever produce, such as rapidly iterating through sequential resource IDs, which is a direct signal of ID enumeration or BOLA probing from earlier in this chapter.
- **Scraping patterns** — requesting far more records per session than a real user realistically would, with no plausible pause or "think time" between requests.
- **Credential-stuffing patterns** — many different account logins attempted from the same IP or device fingerprint, or the same account attempted from geographically implausible locations within a short window, covered from the account side in the Authentication chapter.
- **Traffic anomalies** — a sudden spike from one client, or request timing that's suspiciously regular in a way no human interaction ever is.

### 💎 Good to Know: Detection Is Really About Logging, Not a Separate Technique

Spotting these patterns depends entirely on having the *right* data logged and monitored in the first place — this connects directly to the Logging, Monitoring & Incident Response chapter later in this guide, which covers what to actually capture and alert on rather than treating abuse detection as its own standalone tool.

---

## 15. What is CORS's role specifically in API security, and why is a permissive wildcard combined with credentials dangerous?

### 📖 Introduction

CORS gets covered in full mechanical detail, header by header, in the Security Headers chapter — this question is about the specific, easy-to-get-wrong role it plays for an API.

### 🌐 What CORS Actually Controls

CORS is a browser-enforced rule about which *other* websites' JavaScript is allowed to read your API's responses when a user's browser makes a cross-origin request. It's important to be precise here: CORS does **not** stop a non-browser client — `curl`, Postman, another server — from calling your API at all. It only stops a *browser* from letting a webpage's script read the response it gets back.

### ⚠️ The Dangerous Combination

`Access-Control-Allow-Origin: *` paired with `Access-Control-Allow-Credentials: true` would mean any website's JavaScript could make a request to your API *with the user's cookies attached* and read the response — exactly the cross-origin data-theft scenario CORS exists to prevent. Browsers actually reject this literal combination as invalid outright. The equally dangerous workaround some implementations fall into is dynamically reflecting whatever `Origin` header the incoming request sent back as the allowed origin — which isn't a literal wildcard, but achieves the same "allow absolutely everyone" effect while technically satisfying the credentials constraint.

```js
// Dangerous: silently allows every origin, while still permitting credentials
app.use(cors({
  origin: (origin, callback) => callback(null, true), // reflects any origin back
  credentials: true,
}));

// Safe: an explicit, reviewed allowlist
app.use(cors({
  origin: ["https://app.example.com"],
  credentials: true,
}));
```

### 💎 Good to Know: CORS Was Never a Substitute for Authentication

A properly authenticated and authorized API remains genuinely safe to call from any origin, or from no browser at all — because CORS was never meant to be an access-control mechanism for the API itself. It protects *browsers* from letting a malicious page read data it shouldn't; it was never the thing standing between your data and an unauthenticated request in the first place.

---

## 16. What is "fail securely" as it applies to API error handling?

### 📖 Introduction

Every check covered in this chapter — rate limits, authorization, signature verification — has to make a decision about what happens when the check itself breaks, not just when it runs normally.

### 🔒 The Principle

When a security check throws an unexpected error or can't complete for some reason, the system should default to **denying** access, not granting it. This sounds obvious stated directly, but it's a surprisingly easy mistake to make by accident.

### ⚠️ Failing Open, in Practice

```js
// Vulnerable: any unexpected error here accidentally grants access
async function requireAuth(req, res, next) {
  try {
    const user = await verifyToken(req.headers.authorization);
    req.user = user;
    next();
  } catch (err) {
    next(); // BUG: falls through instead of rejecting
  }
}

// Fixed: an error in the auth check itself still denies access
async function requireAuth(req, res, next) {
  try {
    const user = await verifyToken(req.headers.authorization);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Authentication failed" });
  }
}
```

The vulnerable version means a bug in the auth code, or the auth provider being temporarily unreachable, silently grants access to *everyone* — precisely at the moment something is already going wrong, which is the worst possible time for a security control to fail quietly.

### 💎 Good to Know: This Principle Applies Well Beyond Auth Middleware

The same question — "what should happen if this check itself fails?" — applies anywhere a security decision gets made: a rate-limiter's backing store being unreachable, a permissions service timing out, a feature flag check erroring out. The default answer should almost always be the more restrictive one, chosen deliberately rather than left to whatever a generic `catch` block happens to do.

---

## 17. In production, an API's `/export` endpoint is being hit thousands of times a minute from a single IP — walk through how you'd diagnose and mitigate it in real time.

### 📖 Introduction

This closes the chapter with a realistic, time-pressured incident, pulling together rate limiting, DoS risk, and fail-securely thinking from across this chapter.

### 🔎 Immediate Diagnosis

Check logs and monitoring for the source IP, user-agent, and whether the requests are authenticated — the same account repeatedly, or hitting the endpoint unauthenticated if it's public at all. Just as important: understand what `/export` actually *does*. If it generates a full CSV or report on every call, this isn't just a volume problem — it's the "expensive query" DoS risk from earlier in this chapter, meaning the database or CPU is very likely under real strain already, not just the network.

### 🛠️ Immediate Mitigation

Tighten or apply rate limiting specifically on this endpoint, both per-IP and per-account, since a general site-wide limit may not be aggressive enough for something this expensive. As a fast stopgap while a proper fix is prepared, temporarily block or throttle the specific offending IP at the edge — a WAF, CDN, or load balancer, covered further in the Logging, Monitoring & Incident Response chapter. If the export operation itself is expensive, add a hard concurrency limit or queue so even a burst of legitimate concurrent requests can't overwhelm the database.

### 🕵️ Root Cause, Once the Fire Is Out

Figure out what this actually is: a scraper or competitor harvesting data, a legitimate integration with a bug causing it to retry in a tight loop, or a deliberate denial-of-service attempt — each points to a different long-term response. Either way, the underlying gap is the same one that's come up repeatedly in this chapter: this endpoint apparently had no meaningful rate limit in the first place, which is itself the security misconfiguration from the very first chapter of this guide.

### 🔧 The Longer-Term Fix

Apply rate limiting by default to every endpoint, with noticeably stricter limits on expensive ones like exports, reports, and bulk operations specifically. Add alerting so a traffic pattern like this gets flagged automatically the next time, rather than being discovered manually after the fact. For genuinely expensive operations, consider requiring authentication plus a per-user quota, rather than leaving them reachable at the same trust level as an ordinary read endpoint.

### 💎 Good to Know: Expensive Endpoints Deserve Disproportionately Aggressive Limits

A single, uniform rate limit applied identically across an entire API tends to under-protect exactly the endpoints that can least afford it — a `/export` or `/search` endpoint doing real, costly work per request needs a noticeably tighter limit than a cheap `/ping` or simple `GET`-by-ID route sitting right next to it.
