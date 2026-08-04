---
title: Error Handling & Validation
description: Consistent error shapes and validating input at the boundary.
sidebar_position: 7
---

# Error Handling & Validation

## 1. Why does a consistent error response shape matter as much as a consistent success shape?

### 📖 Introduction

This final chapter is where the previous chapter's error-envelope discussion, and the Web Security guide's error-handling concerns, converge into a complete, dedicated design discipline.

### ⚖️ Why It Matters Just as Much

A client's error-handling code — a try/catch, displaying a message to the user, deciding whether to retry — is arguably exercised more often in practice than carefully written success-path code, since developers frequently build the happy path first and only later go back to properly handle failures. An inconsistent error shape means that already secondary, easy-to-under-invest-in code has to be rewritten per endpoint, compounding the neglect.

### 💎 Good to Know: The Error Path Deserves Equal Design Investment, Not Just Equal Shape

This revisits the consistent-envelope discussion from the Request & Response Design chapter, specifically through the lens of the error path deserving the same design attention as the success path — a first-class part of the API, not an afterthought bolted on once the happy path already works.

---

## 2. What should a well-designed error response actually include?

### 📖 Introduction

This is the concrete elaboration of the general error envelope introduced in the previous chapter.

### 📋 What Belongs in It

A machine-readable error code, covered next. Field-specific details for validation failures, covered later in this chapter. A request ID, useful for the consumer to reference when reporting an issue, and for your own team to look up the corresponding detailed log entry, covered later in this chapter. And ideally a link to relevant documentation for that specific error.

```json
{
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "An account with this email already exists.",
    "requestId": "req_8f3a2b",
    "docs": "https://api.example.com/docs/errors#EMAIL_ALREADY_EXISTS"
  }
}
```

### 💎 Good to Know: This Fills In the Envelope From the Previous Chapter

The previous chapter established the general shape — `{ data: null, error: {...} }`. This question fills in exactly what belongs inside that `error` object specifically.

---

## 3. Why is a machine-readable error code important, separate from the HTTP status code itself?

### 📖 Introduction

The status code alone is deliberately too coarse to distinguish most real validation failures from each other.

### 🔢 Why It's Needed Separately

An HTTP status code is deliberately coarse-grained — there are only a handful of 4xx codes. Many genuinely different validation failures all map to the same status code. A client trying to programmatically react differently to "email format invalid" versus "password too short" versus "username already taken," all potentially 422s, needs something more specific than the status code alone to distinguish them.

```json
// All three share the same 422 status, but different codes
{ "error": { "code": "INVALID_EMAIL_FORMAT", ... } }
{ "error": { "code": "PASSWORD_TOO_SHORT", ... } }
{ "error": { "code": "USERNAME_TAKEN", ... } }
```

### 💎 Good to Know: The Code Is Part of the Contract; the Message Is Not

The human-readable message is meant for displaying to a person, and may change wording over time or be localized, covered later in this chapter. The machine-readable code is meant for programmatic branching logic and should be stable, treated as part of the API's contract from the first chapter of this guide — client code likely does `if (error.code === "EMAIL_TAKEN")` somewhere, and changing that string later is a genuine breaking change.

---

## 4. How would you design field-level validation errors for a submission with multiple invalid fields at once?

### 📖 Introduction

Reporting only the first problem found forces a genuinely frustrating, slow feedback loop on the client.

### 🎯 Why Report All Invalid Fields at Once

A client, especially a form, benefits from knowing every problem with its submission at once, rather than fixing one issue, resubmitting, discovering a second issue, resubmitting again.

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "fields": [
      { "field": "email", "code": "INVALID_FORMAT", "message": "Must be a valid email address" },
      { "field": "password", "code": "TOO_SHORT", "message": "Must be at least 8 characters" }
    ]
  }
}
```

### 💎 Good to Know: This Requires Validation Logic That Collects, Rather Than Short-Circuits

This is exactly where a schema validation library, covered later in this chapter, tends to shine — most are built to validate an entire object and report all violations by default, rather than requiring you to hand-roll that collection logic yourself.

---

## 5. Where should input validation happen in an API's request-handling pipeline?

### 📖 Introduction

The Web Security guide covers why server-side validation matters at all — this is the API-design-specific angle on where, in the pipeline, it belongs.

### 📍 Where

As early as possible — a dedicated validation step or middleware that runs before the request ever reaches business logic, rejecting a malformed request immediately with a clear error, covered earlier in this chapter, rather than letting it partway execute business logic first.

### 🎯 Why This Matters for API Design Specifically

It keeps business logic code clean — it can trust its inputs are already well-formed by the time it runs, rather than needing defensive checks scattered throughout. And it means validation failures are handled consistently, from the first question of this chapter, in one place, rather than however each individual business-logic function happens to handle bad input it encounters.

### 💎 Good to Know: Two Independent Reasons for the Same Practice

The Web Security guide's Server-Side Security chapter covers why this matters for security — never trust client input. This question is about the same practice, but for the API-design benefit of clean separation between validation and business logic.

---

## 6. What's the risk of an error response leaking internal implementation details, and how do you design against it?

### 📖 Introduction

The Web Security guide covers this risk in depth from the security angle — this is the concrete response-design mechanics that actually prevents it.

### 🛠️ The Design Fix

A strict separation between what gets logged, full detail, covered later in this chapter, and what gets returned in the actual HTTP response, a generic, safe message plus the machine-readable code from earlier in this chapter. Typically implemented via a centralized error handler, covered later in this chapter, that catches any unhandled or unexpected error and always returns a sanitized, generic shape, regardless of what the underlying exception actually contained.

```js
app.use((err, req, res, next) => {
  logger.error(err); // full detail, internal only
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong." } });
});
```

### 💎 Good to Know: This Is the Practical Implementation of a Risk Already Covered From the Security Angle

Worth recognizing this as the design mechanism that actually prevents the risk covered in the Web Security guide's Server-Side Security chapter, rather than re-explaining why leaking details is dangerous.

---

## 7. How would you design error messages to be genuinely useful for the integrating developer?

### 📖 Introduction

"Something went wrong" and a full stack trace are two unhelpful extremes — a good error message threads the needle between them.

### 🎯 What Makes a Message Useful

Specificity — "the `email` field must be a valid email address" rather than "invalid input." Actionability — tells the developer what to actually change, not just that something's wrong. Context — which specific field or value caused the problem, from the field-level errors covered earlier in this chapter.

### 💎 Good to Know: "Something Went Wrong" Is the Previous Question's Caution Taken Too Far

The goal isn't to reveal zero information — that's actively unhelpful and creates exactly the vague-message problem this question describes. It's to reveal exactly the right amount: enough for a legitimate developer to fix their request, without leaking internal implementation details an attacker could exploit.

---

## 8. What's the difference between a client error and a server error, and why does that distinction matter for how a client should react?

### 📖 Introduction

The previous chapter introduced the broad 4xx/5xx categories — this is specifically about the retry-behavior implication of getting the classification right.

### 🔀 Why the Distinction Matters for Client Reaction

A 4xx tells the client "your request was the problem" — retrying the identical request will fail the same way every time until the client changes something, so blind retrying is pointless, and potentially harmful if it's a non-idempotent operation, covered in the REST API Principles chapter. A 5xx tells the client "the server failed, your request may have been fine" — retrying, ideally with backoff and jitter, covered in the Scalability guide's High Availability chapter, might genuinely succeed if the server-side issue was transient.

### 💎 Good to Know: Misclassification Causes Real, Confusing Downstream Behavior

A server bug incorrectly reported as a 4xx confuses clients into thinking they need to fix something when they don't. A genuinely client-caused problem incorrectly reported as a 5xx might trigger useless automatic retries, echoing the Scalability guide's retry-storm concern, against a request that will never succeed no matter how many times it's retried.

---

## 9. How would you design validation to handle a request with an unexpected extra field?

### 📖 Introduction

Neither option here is obviously correct — this is a genuine, deliberate tradeoff worth making consciously.

### ⚖️ The Options

Reject the request outright — strict validation catches likely client bugs or typos early, but is more brittle, since a client sending one harmless extra field breaks entirely. Or silently ignore and strip unknown fields — more forgiving, won't break over a harmless typo or an older client sending a field that's since been removed, but can mask a genuine client bug where they thought a field would be used but it's silently being dropped instead.

### 💎 Good to Know: Many Real APIs Lean Toward Silently Stripping, for Compatibility Reasons

Directly the additive-change principle from the API Versioning chapter — a client sending an older, now-irrelevant field shouldn't break. But this is a deliberate design tradeoff worth making consciously and documenting, rather than leaving it as whatever the underlying validation library happens to do by default.

---

## 10. What's the tradeoff between a schema validation library and hand-written validation logic?

### 📖 Introduction

For most typical validation needs, one of these options structurally prevents mistakes the other tends to accumulate.

### 📐 Schema Library (Zod, Joi, and Similar)

Declarative, concise, automatically collects all violations rather than stopping at the first, covered earlier in this chapter, and often generates documentation or types directly from the same schema, connecting to the OpenAPI discussion from the first chapter of this guide. Downside: a learning curve, and can feel constraining for a genuinely unusual validation rule the library doesn't naturally express.

### ✍️ Hand-Written

Full flexibility for any custom rule, no dependency or learning curve. But tends to be verbose, easy to accidentally make inconsistent across different endpoints, echoing the style-guide risk from the first chapter of this guide, and easy to accidentally short-circuit on the first failure found rather than collecting all of them without deliberate extra effort.

### 💎 Good to Know: A Schema Library Is Generally the Better Default

For the vast majority of typical validation needs — required fields, type checking, format validation, ranges — a schema library structurally prevents several of the consistency and completeness mistakes that hand-written validation logic tends to accumulate over time across many endpoints built by many developers.

---

## 11. How would you design error responses to support localization?

### 📖 Introduction

This is a concrete, practical payoff of the machine-readable error code discussed earlier in this chapter.

### 🌍 The Design Approach

Separate the stable, machine-readable error code from the human-readable message. Business logic and validation code only ever deal with and throw the code, `EMAIL_TAKEN`, and a separate, dedicated translation layer, a lookup table or i18n library, maps that code to the actual display text, in whatever language the client requested, via an `Accept-Language` header, similar in spirit to the content-negotiation mechanism from the previous chapter.

### 💎 Good to Know: This Is Exactly Why the Error-Code Design Choice Pays Off

If your business logic had hardcoded the English message text directly, adding a second language later would mean finding and replacing that hardcoded string everywhere it appears. Keeping logic code-based from the start means localization becomes a purely additive change — add a new translation table, touch zero business logic.

---

## 12. Why should an error's log entry often contain more detail than the response sent to the client?

### 📖 Introduction

This directly connects to the design fix for leaked internal details, covered earlier in this chapter, and the Web Security guide's logging chapter.

### 📝 Why More Detail Belongs in the Log

Your own team needs the full picture to actually debug and investigate an issue — the exact stack trace, the specific database error, request and user context — none of which is safe or useful to send back to the client, echoing both the security concern and the "don't overwhelm with irrelevant internal detail" usefulness concern covered earlier in this chapter. The client only needs enough to understand and possibly fix their own request; your team needs everything to fix the underlying system issue.

### 💎 Good to Know: This Is Exactly Why a Request ID Is Such a Valuable, Small Addition

It's the link connecting the deliberately sparse client-facing error to the deliberately detailed internal log entry, letting support or engineering quickly find the full context for a specific reported issue without needing to expose that full context directly in the response itself.

---

## 13. How would you design consistent error handling across many endpoints without duplicating logic?

### 📖 Introduction

This is the dedicated answer to a pattern mentioned briefly earlier in this chapter.

### 🛠️ The Approach

A centralized error-handling middleware that every endpoint's errors flow through. Individual endpoint or business-logic code simply throws or passes an error, ideally a structured one carrying a code and relevant details, and lets the central handler be solely responsible for translating that into the consistent, correctly shaped HTTP response, logging it appropriately, and choosing the correct status code.

```js
class ApiError extends Error {
  constructor(code, status, message) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }
  logger.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong." } });
});
```

### 💎 Good to Know: The Same Pattern as an API Gateway, Just One Layer Down

Centralizing a cross-cutting concern in one shared place is the same architectural pattern that showed up as the API gateway in the Scalability guide's Microservices chapter — just applied within a single service's request-handling pipeline instead of across multiple services.

---

## 14. What's the difference between a validation error and a business logic error, and should they be represented differently?

### 📖 Introduction

These two categories of failure are discoverable at genuinely different points in a request's lifecycle.

### 🔍 Validation Error

The request itself is malformed or invalid on its own terms — a missing required field, an invalid email format. This can be determined without even consulting the current state of the system or database.

### 💼 Business Logic Error

The request is structurally well-formed, but violates a rule that depends on current system state — "insufficient inventory" requires actually checking the current stock level. A well-formed request can still fail this kind of check.

### 🔀 Should They Be Represented Differently?

Often yes — at minimum with different status codes. A validation error is typically a 400 or 422. A business-logic failure is sometimes still a 422, but is arguably better represented as a 409 Conflict for state-dependent failures specifically, or even a 200 with a clear "declined" result for something like a payment decline, which is less an "error" than a legitimate business outcome. Different error codes, from earlier in this chapter, also let a client react appropriately differently — "show a field-level fix" versus "this action can't be completed right now."

### 💎 Good to Know: This Determines Where in the Pipeline a Failure Can Even Be Caught

Directly connects to the "validate at the boundary, before business logic" principle from earlier in this chapter — a validation error should be caught and returned before business logic even starts running, while a business-logic error can only be discovered once business logic actually runs and checks real state.

---

## 15. How would you design error responses so a client can distinguish "this request definitely failed" from "the response was lost"?

### 📖 Introduction

This connects directly to the idempotency-key discussion in the previous chapter and the uncertain-remote-outcome problem covered in the Scalability guide.

### ❓ The Design Challenge

From the client's perspective, a request that genuinely failed, the server processed it and rejected it, and a request whose response simply never arrived, but might have succeeded server-side, look identical — both present as "I didn't get a successful response."

### 🛠️ The Design Approach

This is exactly what the idempotency-key pattern, covered in the previous chapter, solves. Rather than trying to make the original response itself somehow more informative about this ambiguity, which is fundamentally not solvable purely through response design, per the Scalability guide's Distributed Systems chapter, the design answer is to make the request safely retryable in the first place, so the client doesn't need to definitively resolve the ambiguity at all — it can just safely retry with the same idempotency key and get a definitive, correct answer either way.

### 💎 Good to Know: This Is the Same Fundamental Problem Showing Up Again, From a Different Angle

Worth recognizing this as the same underlying issue covered in the Request & Response Design chapter and the Scalability guide's Distributed Systems chapter, now specifically framed as an error-handling and response-design question rather than a pure architecture one.

---

## 16. In production, your API returns a generic 500 for a wide range of genuinely different problems — walk through how you'd redesign the error handling to fix this.

### 📖 Introduction

This closes not just this chapter, but the entire guide.

### 🔍 What This Reveals

The API likely has no centralized, deliberate error-handling design at all — errors are probably just bubbling up as unhandled exceptions that some generic top-level catch-all, the security-conscious default from earlier in this chapter, but applied too bluntly here, converts into an undifferentiated 500, losing all the distinguishing information — error codes, the 4xx-versus-5xx distinction, validation-versus-business-logic categorization, all covered earlier in this chapter — that would actually let the client team react appropriately.

### 🛠️ The Redesign

Introduce a centralized error handler, covered earlier in this chapter, that expects structured, coded errors from business logic rather than raw exceptions. Classify the genuinely different underlying problems this "500" currently lumps together — some are probably actually client errors being misclassified as server errors; some are genuinely different server-side failures that deserve different, specific error codes even if they stay 5xx. Add field-level detail wherever the underlying issue is genuinely a validation problem currently being caught too late or too generically.

### 💎 Good to Know: "The API Returns an Error" and "The API's Error Handling Is Well-Designed" Are Different Bars

Directly paralleling the first chapter's opening distinction between "the API works" and "the API is good to integrate with" — a fitting, full-circle close. This entire guide, from its foundational principles through REST design, resource modeling, request and response shape, versioning discipline, and collection handling, all converges here, since a client's actual experience of an API is, in genuinely large part, defined by how well it behaves specifically when something goes wrong, not just when everything goes right.
