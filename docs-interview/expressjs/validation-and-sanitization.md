---
title: Validation & Sanitization
description: Validating request input before it touches business logic.
sidebar_position: 8
---

# Validation & Sanitization

## 1. What is request validation, and why does it matter?

### 📖 Introduction

Every piece of data on `req` originates from the client, covered in the Request & Response chapter's discussion of security considerations — validation is the deliberate practice of never trusting that data until it's been checked.

### ✅ What Request Validation Is

Request validation checks that incoming data — `req.body`, `req.params`, `req.query`, all covered in the Request & Response chapter — actually matches what a route handler expects, before any business logic runs on it: required fields are present, types are correct, values fall within expected ranges or formats.

### 🎯 Why It Matters

Without validation, a route handler ends up either crashing on unexpectedly shaped input, tying back to the `TypeError` scenarios covered in the Node.js guide's Error Handling chapter, or silently producing incorrect behavior from malformed data it never checked. Validation catches these problems at the door, before they can propagate into business logic or a database query.

### 🖼️ A Concrete Illustration

A route expecting `req.body.email` and `req.body.age` shouldn't simply assume both are present and correctly typed — without validation, a request missing `email` entirely, or sending `age` as the string `"twenty"` instead of a number, could crash the handler or silently corrupt downstream data.

### 💎 Good to Know: Validation Is a Gate, Not an Afterthought

The right mental model is that validation sits as an early gate a request has to pass through, covered in more depth throughout the rest of this chapter, rather than something checked ad hoc, inconsistently, partway through a handler's own business logic.

### ❓ Follow-up Interview Questions

1. Why can't a route handler safely assume `req.body` is always shaped exactly as expected?
2. What kind of bug results from skipping validation on a numeric field that arrives as the wrong type?
3. Why is validation better thought of as a gate a request passes through, rather than a check performed ad hoc inside business logic?
4. How does this question connect to the security considerations already covered in the Request & Response chapter?
5. What's the practical cost of skipping validation for what seems like a "trusted" internal endpoint?

---

## 2. What's the difference between validation and sanitization?

### 📖 Introduction

These two terms often get used together, almost as a single phrase, but they actually describe two genuinely different operations on the same incoming data.

### ✅ Validation: Checking

Validation checks whether data meets a set of rules — is this a valid email format, is this age a positive number — and either accepts the data as-is or rejects the request outright when it doesn't. Validation itself never changes the data.

### 🧹 Sanitization: Cleaning

Sanitization actually modifies the data — trimming leading and trailing whitespace, converting a string to lowercase, removing potentially dangerous characters ahead of an operation like a database query or rendering the data back into HTML, covered in more depth in the Security chapter later in this guide's coverage of Cross-Site Scripting.

### 🔀 Why Both Are Usually Used Together

A request's email field might first be sanitized — trimmed and lowercased — and then validated against a proper email format, in that order, since sanitizing first can turn otherwise-borderline input, like `" User@Example.com "`, into something that then cleanly passes validation.

### 🖼️ A Concrete Comparison

Validating `req.body.username` confirms it's a non-empty string of a reasonable length, rejecting the request if it isn't. Sanitizing that same field might strip out any HTML tags it contains before it's ever stored or displayed, regardless of whether validation would have accepted it as-is.

### 💎 Good to Know: Validation Rejects, Sanitization Transforms

The cleanest way to keep these straight: validation is a yes/no gate that never changes the data itself, while sanitization actively transforms the data into a cleaner, safer form — two genuinely different, complementary operations, not two names for the same thing.

### ❓ Follow-up Interview Questions

1. Why doesn't validation itself ever modify the data it's checking?
2. What's a concrete example of sanitization changing data in a way that validation alone never would?
3. Why does sanitizing a field before validating it sometimes help borderline input pass validation cleanly?
4. Why are validation and sanitization typically used together rather than just one or the other?
5. How does sanitization specifically relate to preventing Cross-Site Scripting, covered in more depth in the Security chapter?

---

## 3. What is `express-validator`, and how does it work internally?

### 📖 Introduction

`express-validator` is the most widely used validation library built specifically for Express, and it's worth understanding both what it does and how it's actually wired into the middleware system covered throughout this guide.

### 📦 What `express-validator` Is

A third-party middleware library, covered as a category in the Middleware chapter, providing a chainable API for declaring validation and sanitization rules directly against `req.body`, `req.params`, and `req.query`, covered in the Request & Response chapter.

### 🔧 How It Works Internally

Each validation rule, like `body('email').isEmail()`, is itself just a piece of middleware, added into the same route-specific middleware chain covered in the Routing chapter. As the request flows through that chain, each rule inspects its target field and records whether it passed or failed, without immediately rejecting the request itself.

### ✅ Checking the Accumulated Results

A separate step, typically using `validationResult(req)`, is called explicitly inside the actual route handler, or in a small piece of following middleware, to collect every validation rule's accumulated results and decide whether to reject the request with a `400 Bad Request` or let it proceed.

### 🖼️ A Concrete Illustration

```js
const { body, validationResult } = require('express-validator');

app.post('/users',
  body('email').isEmail(),
  body('age').isInt({ min: 0 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // proceed with valid, trusted req.body
  }
);
```

### 💎 Good to Know: Each Validation Rule Is Just Another Middleware Function in the Chain

Recognizing that `body('email').isEmail()` isn't some special, separate mechanism — it's an ordinary piece of middleware, following the exact same `(req, res, next)` pattern covered in the Middleware chapter, just one specifically designed to record a validation result rather than complete the request itself.

### ❓ Follow-up Interview Questions

1. Why doesn't an individual validation rule like `body('email').isEmail()` immediately reject the request on failure?
2. What does `validationResult(req)` actually do, and why is it called separately from the individual validation rules?
3. Why is each `express-validator` rule considered "just another middleware function" rather than a distinct mechanism?
4. What would happen if a route defined validation rules but never actually called `validationResult(req)`?
5. How does `express-validator`'s chainable API connect to the route-specific middleware chaining covered in the Routing chapter?

---

## 4. How do Joi and Zod differ from `express-validator`, and what are the trade-offs between them?

### 📖 Introduction

Joi and Zod take a genuinely different approach to validation than `express-validator`'s chained, per-field middleware style, covered in the previous question — both define an entire object's shape upfront as a single schema.

### 📐 Schema-Based Validation

Rather than chaining individual field-level rules directly into the middleware stack, Joi and Zod each let you define one complete schema describing an entire expected object shape — `{ email: string, age: number }` — and then validate an entire object, like `req.body`, against that schema in one single call, returning either a validated (and, for Zod, precisely typed) result or a structured list of every validation error at once.

### 🆚 Joi vs. Zod

Joi is a mature, long-established, JavaScript-focused schema validation library, predating widespread TypeScript adoption. Zod is a newer library built specifically around TypeScript, automatically inferring a static TypeScript type directly from its schema definition, tying back to the type-safety theme covered in the Node.js guide's Database Integration chapter's discussion of Prisma.

### ⚖️ The Trade-off Against `express-validator`

Joi and Zod validate an entire request body as one coherent object, which often reads more clearly for deeply nested or complex data shapes, while `express-validator`'s field-by-field chaining, covered in the previous question, integrates a little more directly and idiomatically into Express's own existing middleware chain. Zod's automatic type inference specifically becomes a genuine advantage in a TypeScript-based codebase, giving compile-time confidence that validated data actually matches the types used elsewhere in the code.

### 🖼️ A Concrete Illustration

```js
const { z } = require('zod');
const userSchema = z.object({ email: z.string().email(), age: z.number().min(0) });

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.issues });
    req.body = result.data;
    next();
  };
}

app.post('/users', validate(userSchema), createUserHandler);
```

### 💎 Good to Know: This Is a Style and Type-Safety Trade-off, Not a Right-or-Wrong Choice

None of these three libraries is objectively superior — the decision comes down to whether a team prefers field-by-field middleware chaining or whole-object schema validation, and how much a project's codebase specifically benefits from Zod's automatic TypeScript type inference.

### ❓ Follow-up Interview Questions

1. Why does schema-based validation, like Joi or Zod, validate an entire object at once rather than field by field?
2. What genuine advantage does Zod's automatic type inference provide in a TypeScript codebase?
3. Why might `express-validator`'s approach feel more idiomatic within Express's own middleware system?
4. How does wrapping a Zod schema in a small custom middleware function, as shown above, bring it into the same chain-based pattern used elsewhere in this guide?
5. How would you decide, for a new Express project, between these two validation approaches?

---

## 5. Where should request validation happen in an Express application, and how do you validate route parameters, query parameters, and request bodies?

### 📖 Introduction

Validation needs to happen early enough that invalid data never reaches business logic at all — this question is about exactly where in the request lifecycle that check belongs, and how it applies across each different source of request data.

### 🚪 Validation Belongs in Middleware, Before the Route Handler

Validation logic belongs in dedicated middleware, registered ahead of the actual route handler in that route's middleware chain, covered in the Routing chapter — never scattered as ad hoc checks written inline inside the handler itself, which tends to produce inconsistent, easy-to-forget validation across different routes.

### 🔗 Validating `req.params`

Route parameters, covered in the Request & Response chapter, are typically validated for correct format or type — confirming an `:id` parameter is genuinely numeric, for instance, before it's ever used in a database lookup.

### 🔍 Validating `req.query`

Query parameters are typically optional, so validation here usually focuses on type-checking and applying sensible defaults for whichever ones are actually present, rather than requiring every possible query parameter outright.

### 📦 Validating `req.body`

Request bodies typically receive the most thorough validation, since they usually carry the bulk of a request's actual data — required fields, correct types, and value constraints, using either `express-validator` or a schema library like Zod, both covered earlier in this chapter.

### 💎 Good to Know: The Principle Is the Same Across All Three, Only the Specific Rules Differ

Whether it's `req.params`, `req.query`, or `req.body`, the same underlying principle applies: validate before the data reaches business logic, using dedicated middleware — only the specific rules and how strict they need to be actually differ based on where the data comes from.

### ❓ Follow-up Interview Questions

1. Why does validation logic belong in dedicated middleware rather than inline inside a route handler?
2. Why does `req.query` validation typically focus more on defaults and type-checking than on requiring fields outright?
3. Why does `req.body` usually receive the most thorough validation among the three sources covered here?
4. What would inconsistent, scattered inline validation across different route handlers look like in a real codebase?
5. Why is it accurate to say the underlying validation principle is the same across `req.params`, `req.query`, and `req.body`, even though the specific rules differ?

---

## 6. How do you sanitize user input?

### 📖 Introduction

Sanitization, covered as a distinct concept from validation earlier in this chapter, is about actively cleaning data rather than merely checking it — this question focuses on the concrete techniques for actually doing that.

### ✂️ Common Sanitization Techniques

- **Trimming whitespace** — removing accidental leading or trailing spaces from a text field, a common source of subtly failed exact-match comparisons.
- **Normalizing case** — lowercasing an email address before storage, so `User@Example.com` and `user@example.com` are correctly recognized as the same value.
- **Escaping or stripping HTML** — removing or encoding HTML tags from user-submitted text before it's ever rendered back into a page, directly preventing stored Cross-Site Scripting, covered in more depth in the Security chapter later in this guide.
- **Type coercion** — converting a numeric string like `"42"` into an actual number, so downstream code doesn't need to handle both possible types inconsistently.

### 🛠️ How This Is Typically Implemented

`express-validator` provides built-in sanitization methods directly chainable alongside its validation methods, covered earlier in this chapter — `body('email').trim().normalizeEmail()`. A schema library like Zod, also covered earlier in this chapter, can apply transformations as part of parsing a field, achieving the same underlying goal through its own schema-based approach instead.

### 🖼️ A Concrete Illustration

```js
body('email').trim().normalizeEmail(),
body('bio').trim().escape(), // Escapes HTML special characters
```

### 💎 Good to Know: Sanitize Before Validating, Where the Two Interact

Since sanitization can turn otherwise-invalid input into something that then cleanly passes validation, covered earlier in this chapter, ordering sanitization steps before the corresponding validation check, where both apply to the same field, is generally the more effective sequence.

### ❓ Follow-up Interview Questions

1. Why does trimming whitespace matter for a field that will later be compared for an exact match?
2. Why does normalizing an email's case before storage prevent a specific class of bug?
3. How does escaping HTML in user-submitted text directly help prevent stored Cross-Site Scripting?
4. Why does converting a numeric string to an actual number simplify downstream code?
5. Why does sanitizing a field generally make sense before validating that same field, rather than after?

---

## 7. How should validation errors be returned in REST APIs?

### 📖 Introduction

A validation failure is itself just a specific, well-anticipated category of error — how it's returned to the client should follow the same standardized error-response principles already covered in the Error Handling chapter.

### 📐 A Consistent, Structured Shape

Rather than a single, generic error message, a validation failure response should list every field that failed and why, in a consistent, predictable structure — something like `{ success: false, errors: [{ field: 'email', message: 'Must be a valid email' }] }` — directly mirroring the standardized error shape covered in the Error Handling chapter, applied specifically to validation.

### 🔢 The Right Status Code

A validation failure is a client-side problem — the request itself was malformed — so it correctly belongs to `400 Bad Request`, distinct from a `401` (authentication failure) or `403` (authorization failure), both covered in the Authentication & Authorization chapter.

### 🖼️ A Concrete Illustration

```js
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, errors: err.details });
  }
  next(err);
});
```

Treating validation failures as a custom error type, covered in the Error Handling chapter's discussion of custom error classes, lets them flow through the exact same centralized error-handling pipeline as any other error, rather than needing special-cased handling inside every individual route.

### 🎯 Why Listing Every Failed Field at Once Matters

Returning only the first validation error forces a client into a frustrating loop of fixing one field, resubmitting, and discovering the next error — returning every failure at once, in one single response, lets a client (or its own form UI) surface every problem to the user simultaneously.

### 💎 Good to Know: Validation Errors Are Just Another Case the Centralized Error Pipeline Already Handles

This question is really an application of the centralized error-handling architecture covered in the Error Handling chapter, specifically to the validation-failure case — not a separate error-handling mechanism of its own.

### ❓ Follow-up Interview Questions

1. Why does `400 Bad Request` correctly describe a validation failure, as opposed to `401` or `403`?
2. Why does returning every failed field at once improve the experience for a client compared to returning just the first one?
3. How does treating a validation failure as a custom error type let it flow through the same pipeline as any other error?
4. What would a poorly structured validation error response look like, compared to the structured example shown here?
5. How does this question connect to the centralized error-handling architecture already covered in the Error Handling chapter?

---

## 8. How do you avoid repeating validation logic across routes?

### 📖 Introduction

Without deliberate reuse, nearly identical validation rules tend to get copy-pasted across many different routes that happen to accept similar data shapes — genuinely error-prone once that duplicated logic needs to change.

### 🧩 Extracting Shared Validation Chains Into Reusable Middleware

A validation chain, whether built with `express-validator` or a schema library like Zod, both covered earlier in this chapter, can be defined once in its own dedicated module and imported wherever it's needed, rather than being redefined inline inside every route that happens to need similar rules.

### 📐 Reusing Whole Schemas for Overlapping Shapes

If a "create user" and "update user" route both validate largely the same fields, a shared base schema can be defined once and extended or partially reused for each specific case — Zod's `.partial()` method, for instance, easily derives an "update" schema, where every field becomes optional, directly from an existing "create" schema, without duplicating every individual field rule by hand.

### 🖼️ A Concrete Illustration

```js
// validators/user.validator.js
const userSchema = z.object({ email: z.string().email(), age: z.number().min(0) });
const updateUserSchema = userSchema.partial(); // Same fields, all optional

module.exports = { userSchema, updateUserSchema };
```

### 🔧 A Generic, Reusable Validation Middleware Factory

Writing one single, generic `validate(schema)` middleware factory, covered earlier in this chapter, that accepts any schema and applies it consistently, means adding validation to a brand-new route only ever requires defining that route's own specific schema — never rewriting the validation-checking logic itself again.

### 💎 Good to Know: Reuse Here Follows the Exact Same Principles as Reusable Middleware in General

This is a direct, specific application of the general reusable-middleware and factory-function patterns already covered in the Middleware chapter, applied specifically to the recurring problem of overlapping validation rules across similar routes.

### ❓ Follow-up Interview Questions

1. Why does copy-pasting similar validation rules across multiple routes become a genuine maintenance risk over time?
2. How does deriving an "update" schema from a "create" schema avoid duplicating individual field rules?
3. What does a generic `validate(schema)` middleware factory let a new route reuse, without rewriting anything?
4. Why is this reuse pattern described as an application of general middleware-reuse principles, rather than something validation-specific?
5. How would you refactor a codebase where the same validation rules are currently copy-pasted across five different routes?

---

## 9. How would you design a centralized, reusable validation strategy/middleware for a large Express application?

### 📖 Introduction

This extends the reuse patterns covered in the previous question into a full, deliberate strategy for an entire application, rather than just avoiding duplication between a couple of similar routes.

### 🏗️ One Schema Per Resource, Colocated With That Resource

Each resource — users, orders, products — gets its own dedicated schema file, defining every variant it needs: create, update, and any resource-specific query parameter shapes, covered in this chapter's discussion of validating `req.query`, kept alongside that resource's other code, mirroring the feature-based organization covered in the Express Application chapter.

### 🔧 One Generic Validation Middleware Factory, Shared Application-Wide

A single `validate(schema, source)` middleware factory, covered in the previous question, shared across the entire application, accepts any schema and validates whichever part of the request — `body`, `params`, or `query` — that specific route needs checked, so every route's validation wiring looks identical regardless of which resource it belongs to.

### 📐 One Standardized Error Format, Application-Wide

Every validation failure, regardless of which route or schema produced it, flows through the same centralized error-handling pipeline, covered in an earlier question in this chapter, producing the exact same standardized error shape covered in the Error Handling chapter.

### 🖼️ A Concrete Illustration

```js
// validators/order.validator.js
const createOrderSchema = z.object({ productId: z.string(), quantity: z.number().min(1) });

// routes/orders.routes.js
router.post('/', validate(createOrderSchema, 'body'), createOrderHandler);
```

### 💎 Good to Know: A Centralized Strategy Is Really Three Small, Consistent Decisions Applied Everywhere

The genuine architectural insight is that "centralized validation" isn't one big, complex system — it's three small, consistent decisions (schema-per-resource, one shared middleware factory, one standardized error shape) applied uniformly across every route in the application.

### ❓ Follow-up Interview Questions

1. Why does colocating each resource's validation schemas with that resource's other code make sense at scale?
2. Why should the exact same validation middleware factory be reused across every resource, rather than each having its own?
3. How does this strategy ensure every validation failure across the entire application produces the exact same error shape?
4. Why is this description of "centralized validation" as three small, consistent decisions more useful than treating it as one large system?
5. How would you retrofit this centralized strategy onto an existing large application that currently validates inconsistently across different routes?

---

## 10. How should validation be organized in a large Express application?

### 📖 Introduction

This is a slightly broader framing of the previous question, asking about the overall file and folder organization rather than the middleware mechanics specifically.

### 🗂️ Colocated With Feature-Based Routing

Validation schemas belong alongside the routes and controllers they validate, following the exact same feature-based organization covered in the Express Application and Routing chapters — a `users/` feature folder containing its own `users.validator.js` next to `users.routes.js` and `users.controller.js`.

### 🧰 Shared, Cross-Cutting Validation Utilities in Their Own Location

Genuinely shared validation logic — a common email-format check, a shared pagination-query schema reused across many different list endpoints — belongs in its own dedicated shared location, separate from any one specific feature, avoiding the temptation to duplicate that same shared logic once per feature.

### 📐 A Clear, Consistent Naming Convention

Consistently naming schema files and exports — `createUserSchema`, `updateUserSchema` — makes it immediately obvious, across an entire codebase, what a given schema validates and which specific operation it belongs to.

### 💎 Good to Know: Validation Organization Is a Direct Extension of the Same Feature-Based Structure Covered Elsewhere

There's no separate, validation-specific organizational scheme being introduced here — it's the exact same feature-based-versus-shared-utilities structure covered in the Express Application chapter, applied specifically to where validation schemas live.

### ❓ Follow-up Interview Questions

1. Why does colocating a feature's validation schema with that same feature's routes and controllers make sense?
2. What kind of validation logic genuinely belongs in a shared location rather than within one specific feature?
3. Why does a consistent naming convention for schemas matter more as a codebase grows?
4. How does this organizational approach relate to the feature-based structure already covered in the Express Application chapter?
5. What would validation organization look like in a codebase that mixed feature-based and purely technical-layer organization inconsistently?

---

## 11. What are common validation mistakes developers make, and what best practices address them?

### 📖 Introduction

Beyond the mechanics already covered in this chapter, it's worth naming the specific, recurring mistakes that actually show up in real Express codebases around validation.

### ⚠️ Common Mistakes

- **Validating only on the client side** — client-side validation is genuinely useful for user experience, but it can always be bypassed entirely by a request sent directly to the API, making server-side validation, covered throughout this chapter, non-negotiable regardless of what the client already checks.
- **Trusting `req.params` because "it's just an ID"** — even a route parameter needs validating, since a client can send any arbitrary string in that position, not necessarily a well-formed ID at all.
- **Validating but forgetting to sanitize** — confirming a field is well-formed doesn't automatically make it safe to render back into HTML or use inside certain kinds of queries, covered in the distinction between validation and sanitization earlier in this chapter.
- **Inconsistent validation across similar routes** — a "create" and an "update" route for the same resource enforcing subtly different rules, usually from duplicated, independently maintained validation logic rather than a shared, reused schema, covered earlier in this chapter.
- **Returning only the first validation error** — forcing a client through a frustrating fix-one-error-at-a-time loop, covered in this chapter's discussion of how validation errors should be returned.

### 💎 Good to Know: Nearly Every Mistake Here Traces Back to a Principle Already Covered Earlier in This Chapter

Recognizing the specific real-world symptom and mapping it back to the underlying principle it violates — trust nothing from the client, sanitize as well as validate, centralize and reuse — is exactly the practical skill this question is testing for.

### ❓ Follow-up Interview Questions

1. Why can client-side validation never be relied on as an application's only line of defense?
2. Why does even a simple route parameter like an ID need validation, rather than being trusted implicitly?
3. Why doesn't passing validation automatically mean a piece of data is safe to render back into HTML?
4. What usually causes a "create" and "update" route for the same resource to enforce subtly different, inconsistent rules?
5. How would you audit an existing codebase for each of these common validation mistakes?

---

## 12. Explain the complete lifecycle of request validation in an Express application, from receipt to either proceeding or returning a validation error.

### 📖 Introduction

This capstone question pulls together every mechanism covered across this chapter into one single, continuous story, from a request's arrival to either a validated, trusted `req` or a returned validation error.

### 📥 Step 1: A Request Arrives at a Validated Route

The request reaches a route with validation middleware attached ahead of its main handler, covered throughout this chapter, following the route-specific middleware chaining covered in the Routing chapter.

### 🧹 Step 2: Sanitization Runs First, Where Applicable

Any sanitization steps, covered earlier in this chapter, transform the relevant fields — trimming, normalizing case, escaping HTML — before the corresponding validation check runs against that same field.

### ✅ Step 3: Validation Rules Run Against the (Now-Sanitized) Data

Whether using `express-validator`'s chained rules or a schema library like Zod, covered earlier in this chapter, each field or the entire object is checked against its expected shape, type, and constraints.

### 🔀 Step 4: The Result Determines What Happens Next

If validation passes, `next()` is called and the now-trusted, validated (and possibly sanitized) data proceeds to the actual route handler. If it fails, a validation error, covered earlier in this chapter, is either returned directly or passed to `next(error)` to flow through the centralized error-handling pipeline covered in the Error Handling chapter.

### 📤 Step 5: A Standardized Response, Either Way

A successful request proceeds to its normal business logic and response; a failed one receives the standardized validation error shape covered earlier in this chapter, listing every failed field at once.

### 💎 Good to Know: Every Earlier Question in This Chapter Is a Piece of This One Story

This capstone question is deliberately not introducing anything new — it's the connective narrative tying together validation-versus-sanitization, schema libraries, reusable middleware, and standardized error responses, all covered individually earlier in this chapter, into one coherent sequence.

### ❓ Follow-up Interview Questions

1. Why does sanitization typically run before validation, rather than after, when both apply to the same field?
2. At what exact point in this lifecycle does a request either proceed to business logic or get rejected?
3. How does a failed validation check connect to the centralized error-handling pipeline covered in the Error Handling chapter?
4. Why does the route handler only ever see data that's already been validated and sanitized, by the time it runs?
5. If asked to whiteboard this entire validation lifecycle from memory, what's the correct order of these steps?

---