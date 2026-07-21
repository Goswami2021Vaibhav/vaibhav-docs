---
title: Route Handlers (API Routes)
description: Building API endpoints inside the App Router.
sidebar_position: 7
---

# Route Handlers (API Routes)

## 1. What are Route Handlers, and how do they differ from page routes and from Server Actions?

### 📖 Introduction
Route Handlers have come up as a reference point several times already in the Server Actions chapter — here's the full, dedicated treatment.

### 📄 What Route Handlers Actually Are
Files named `route.js` (or `route.ts`) inside the `app/` directory that define actual HTTP endpoints — GET, POST, and so on — rather than a rendered page. This is Next.js's way of building a traditional API endpoint within the App Router's file-based routing conventions, applied to API endpoints instead of pages.

### 🆚 How They Differ From Page Routes
A folder can contain either a `page.js` (renders UI) or a `route.js` (returns data/a response, no UI) — not both at the same exact segment level, since they'd conflict over what that URL should do. `app/api/posts/route.js` responds to `/api/posts` requests with data, while `app/posts/page.js` renders the `/posts` page's UI.

### 🆚 How They Differ From Server Actions
Route Handlers are named, discoverable HTTP endpoints at a known URL that any client — your own frontend, a mobile app, a third-party webhook — can call directly. Server Actions are called as functions from within your own React components, with no stable, public URL in the same sense. Route Handlers are the right choice when external consumers or non-mutation HTTP semantics are needed.

### ❓ Follow-up Interview Questions

1. Why can't a folder have both a `page.js` and a `route.js` at the same segment?
2. What's the key difference in "discoverability" between a Route Handler and a Server Action?
3. Give an example of a consumer that could only reasonably call a Route Handler, not a Server Action.
4. What does a Route Handler return, compared to what a page route renders?
5. Why does Next.js's file-based routing extend naturally from pages to API endpoints?

---

## 2. What HTTP methods are supported in a Route Handler, and how do you create GET/POST handlers?

### 📖 Introduction
Route Handlers map HTTP methods directly onto named function exports — a genuinely clean convention worth knowing precisely.

### 🔤 Supported HTTP Methods, Defined as Named Exports
GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS are all supported, each defined as a named, exported async function matching the HTTP verb inside the `route.js` file:
```js
// app/api/posts/route.js
export async function GET(request) {
  const posts = await db.posts.findMany();
  return Response.json(posts);
}

export async function POST(request) {
  const data = await request.json();
  const post = await db.posts.create(data);
  return Response.json(post, { status: 201 });
}
```

### 🚫 Unsupported Methods Are Handled Automatically
If a request arrives with a method that isn't exported from that route file, Next.js automatically returns a 405 (Method Not Allowed) response — no manual handling needed for unsupported methods.

### 📤 The Return Value: A Response Object
A Route Handler must return a `Response` (or `NextResponse`, the next question goes deeper) object. `Response.json(data)` is a convenient shorthand for returning JSON with the correct content-type header automatically set.

### ❓ Follow-up Interview Questions

1. What happens if a client sends a DELETE request to a route file that only exports GET and POST?
2. What must every Route Handler function ultimately return?
3. What does `Response.json(data)` do that manually constructing a `Response` wouldn't handle automatically?
4. Could a single `route.js` file export both a GET and a POST handler? What would each respond to?
5. Why does Next.js not require you to manually check the request method inside a single handler function?

---

## 3. What is the difference between `Request`/`Response` and Next.js's `NextRequest`/`NextResponse`?

### 📖 Introduction
Route Handlers can use either the standard Web APIs or Next.js's extended versions — worth knowing exactly what the extensions add and when they're worth reaching for.

### 🌐 `Request`/`Response`: The Standard Web APIs
These are the standard Web APIs — the same ones available in browsers, and now in Node.js/Edge runtimes too. A Route Handler can use these directly, with no Next.js-specific import, and it works fine for basic cases.

### ⚡ `NextRequest`/`NextResponse`: Next.js-Specific Conveniences
- `NextRequest` adds a convenient `.nextUrl` property — a parsed URL object with easy access to the pathname and search params, without manually constructing a `new URL()` — plus built-in cookie-reading helpers (`request.cookies.get(...)`, a later question goes deeper).
- `NextResponse` adds convenient static methods like `NextResponse.json(data)`, `NextResponse.redirect(url)`, and `NextResponse.rewrite(url)` — the rewrite capability is genuinely Next.js-specific, tying into the Middleware chapter's coverage, since plain `Response` has no concept of a rewrite at all — plus easier cookie-setting helpers.

### 🎯 When to Use Which
For simple Route Handlers, plain `Request`/`Response` work fine and keep the code more portable and standard-compliant — useful if handler logic ever needs to be reused outside Next.js. Reach for `NextRequest`/`NextResponse` when you need their specific conveniences. Most real-world Route Handlers end up using `NextRequest`/`NextResponse` simply because the conveniences are genuinely useful, but it's worth knowing they're not strictly required.

### ❓ Follow-up Interview Questions

1. What does `.nextUrl` give you that you'd otherwise have to construct manually?
2. What capability does `NextResponse` have that plain `Response` doesn't?
3. Why might keeping a handler on plain `Request`/`Response` matter for portability?
4. Where does `NextResponse.rewrite()` connect to a concept covered in a later chapter?
5. Is using `NextRequest`/`NextResponse` mandatory for a Route Handler to function?

---

## 4. How do you access route parameters, query parameters, and the request body inside a Route Handler?

### 📖 Introduction
The same dynamic-segment conventions from the App Router & Routing chapter apply here, but they're accessed differently in a Route Handler than in a `page.js`.

### 🔤 Route Parameters: The Second Argument's `params` Object
```js
// app/api/posts/[id]/route.js
export async function GET(request, { params }) {
  const { id } = await params; // a Promise, as of Next.js 15 — same as page.js
  const post = await db.posts.findUnique({ where: { id } });
  return Response.json(post);
}
```

### 🔍 Query Parameters: Via the Request's URL
Accessed through the request's URL itself, not a separate prop — using `request.nextUrl.searchParams` with `NextRequest`, or manually parsing `new URL(request.url).searchParams` with plain `Request`:
```js
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
}
```

### 📦 Request Body: Parsed Explicitly, Asynchronously
Parsed by calling `.json()` (JSON bodies), `.formData()` (form submissions), or `.text()` on the request object itself — the same standard Web API methods available on any `Request` object, awaited since reading the body is asynchronous:
```js
export async function POST(request) {
  const body = await request.json();
}
```

### 💎 Good to Know: Unlike Server Actions, the Body Isn't Auto-Parsed
A Server Action automatically receives a `FormData` object when triggered from a form. A Route Handler must explicitly parse the body itself, since it's a more general-purpose HTTP endpoint that could receive any content type, not just a form submission.

### ❓ Follow-up Interview Questions

1. Why is `params` a Promise as of Next.js 15, and where else does this same pattern show up?
2. Where do query parameters come from in a Route Handler, if not a dedicated prop?
3. Why must reading the request body be awaited?
4. Why doesn't a Route Handler get an automatically-parsed `FormData` object the way a Server Action does?
5. What would `request.json()` do if the request body wasn't actually JSON?

---

## 5. How do you work with cookies and headers in a Route Handler?

### 📖 Introduction
This builds on `NextRequest`'s convenience mentioned earlier, and the cookie coverage from the Server Actions chapter — the same underlying APIs, applied here.

### 🍪 Reading Cookies
```js
export async function GET(request) {
  const token = request.cookies.get("session")?.value;
}
```
Alternatively, the standalone `cookies()` function from `next/headers` — the same API used in Server Components and Server Actions — also works inside Route Handlers.

### 📋 Reading Headers
Via `request.headers.get('header-name')` — the standard `Headers` API, available on any `Request` object — or the standalone `headers()` function from `next/headers`.

### 🔒 Setting Cookies on the Response
```js
export async function POST(request) {
  const response = NextResponse.json({ success: true });
  response.cookies.set("session", token, { httpOnly: true, secure: true });
  return response;
}
```

### 📤 Setting Response Headers
Via the second argument to `Response.json()`/`NextResponse.json()`, or by constructing a `Response` directly with a `headers` option:
```js
return Response.json(data, { headers: { "Cache-Control": "max-age=60" } });
```

### ❓ Follow-up Interview Questions

1. What are the two ways to read a cookie inside a Route Handler?
2. Why does setting a cookie require constructing the response object first, rather than setting it before returning?
3. What's the standard Web API used to read headers, independent of any Next.js-specific helper?
4. Why would you set `httpOnly: true` on a session cookie?
5. How would you add a custom caching header to a Route Handler's JSON response?

---

## 6. How do Route Handlers interact with Next.js's caching behavior (static vs dynamic route handlers)?

### 📖 Introduction
This applies the Rendering Strategies chapter's static/dynamic concepts specifically to Route Handlers — the same underlying detection logic, with one important restriction unique to handlers.

### 🎯 The Default: Static GET Handlers, Unless Forced Dynamic
A GET Route Handler is statically evaluated and cached by default if it doesn't use any request-time-only APIs. Its response can be computed once and reused for subsequent requests, just like a statically-rendered page.

### 🔍 What Triggers Dynamic Behavior
Using `request.cookies`/`request.headers`, using `searchParams` from the request, or explicitly opting in via `export const dynamic = 'force-dynamic'`. A Route Handler reading cookies to check auth will always be dynamically evaluated, since cookies are request-specific.

### ✍️ Only GET Handlers Can Be Static — Mutating Methods Are Always Dynamic
A genuinely important, often-tested detail: POST, PUT, DELETE, and PATCH handlers are always treated as dynamic — they're mutations, so caching them would be incorrect or meaningless. Caching only applies to GET requests, since those are the only ones expected to be idempotent and safe to reuse.

### 💎 Good to Know: The Same "Accidental Dynamic" Gotcha Applies Here
A static GET Route Handler serving rarely-changing config or public data can be served extremely efficiently, similar to a static page. But the moment it reads a request-specific value, it automatically becomes dynamic — the same "accidental dynamic" gotcha from the Rendering Strategies chapter applies here too.

### ❓ Follow-up Interview Questions

1. Why would caching a POST handler's response be meaningless or incorrect?
2. What specific signals cause a GET Route Handler to become dynamically evaluated?
3. Why does reading cookies inside a GET handler force it into dynamic rendering?
4. Give an example of a GET Route Handler that would be a good candidate for static caching.
5. How would you notice, in a real app, that a Route Handler had silently become dynamic when it was expected to be static?

---

## 7. How would you implement authentication inside a Route Handler?

### 📖 Introduction
This is scoped specifically to the mechanics of checking auth within a Route Handler. The full depth of session management and token strategies gets covered in the Authentication & Authorization chapter.

### 🎯 The Core Principle: Verify on Every Request, Independently
A Route Handler, being a publicly-reachable HTTP endpoint with a known, discoverable URL, must independently verify the caller's identity and permissions on every request. It cannot assume the caller already went through some client-side auth gate.

### 🔑 A Practical Pattern: Reading the Session and Verifying It
```js
export async function GET(request) {
  const token = request.cookies.get("session")?.value;
  const session = await verifySession(token);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // proceed with the authenticated request
}
```
For external API consumers rather than cookie-based browser sessions, an `Authorization` header carrying a token or API key is the common alternative.

### 🔧 A Shared Helper, Not Reimplemented Per Handler
Extracting a reusable auth-check function that multiple Route Handlers call reduces the risk of a forgotten check in a one-off endpoint.

### 🚦 401 vs 403: A Precise, Often-Confused Distinction
401 (Unauthorized) means not authenticated at all. 403 (Forbidden) means authenticated, but lacking permission for this specific resource. Worth being precise about — they're genuinely different situations that deserve different status codes.

### 💎 Good to Know: Full Session/Token Strategy in the Authentication Chapter
Session-based vs. JWT-based auth, refresh tokens, and OAuth flows get their full treatment there — this question stays scoped to how a single Route Handler checks whatever auth mechanism is in place.

### ❓ Follow-up Interview Questions

1. Why can't a Route Handler trust that a request came from an already-authenticated user in the UI?
2. What's the practical difference between returning a 401 and a 403?
3. Why extract a shared auth-checking helper rather than writing the check inline in every handler?
4. When would an `Authorization` header be the right mechanism instead of a cookie?
5. What would happen if an unauthenticated request reached business logic before the auth check ran?

---

## 8. How would you connect a Route Handler to a database, and what patterns keep that code maintainable?

### 📖 Introduction
This applies the Data Fetching chapter's data-access organization principle to Route Handlers specifically, plus the connection-pooling concern flagged briefly in that chapter's closing question.

### 🔌 The Basic Connection Pattern: A Singleton Client
```js
// lib/db.ts
export const db = new PrismaClient(); // singleton, reused across requests

// app/api/posts/route.js
import { db } from "@/lib/db";
export async function GET() {
  const posts = await db.post.findMany();
  return Response.json(posts);
}
```
A singleton client instance — created once and reused across requests, rather than creating a new connection per request — is the standard pattern to avoid connection-exhaustion issues.

### 🗂️ Maintainability: A Shared Data-Access Layer, Reused Across Route Handlers and Server Components
Extract data-access functions into a separate `lib/data/` layer (`getPosts()`, `createPost()`), and have the Route Handler call those functions rather than embedding raw database queries directly inside the handler. This shared layer is plain, framework-agnostic code, so it can be reused by both Route Handlers and Server Components/Actions, avoiding duplicate query logic across different parts of the app.

### 🚨 Error Handling Around Database Calls
Wrapping database operations in try/catch and returning appropriate HTTP status codes — 500 for a genuine database failure, 404 if a query returns nothing when a specific resource was expected — rather than letting an uncaught database error crash the handler with an unhelpful, generic error.

### ❓ Follow-up Interview Questions

1. Why is a singleton database client preferred over creating a new connection per request?
2. How does extracting data-access functions let the same query logic be reused by both Route Handlers and Server Components?
3. What status code would you return if a database query for a specific resource returns nothing?
4. What risk does a serverless deployment introduce for database connections specifically?
5. Why shouldn't a raw Prisma/Drizzle query typically appear directly inside a Route Handler's function body?

---

## 9. How would you implement centralized error handling across many Route Handlers?

### 📖 Introduction
Without centralization, error handling tends to drift into inconsistent, ad hoc code scattered across every handler — here's a pattern that keeps it consistent.

### 😩 The Problem Without Centralization
Each Route Handler re-implementing its own try/catch, its own error-response format, and its own status-code decisions gets inconsistent across a large app, and becomes a real pain to update if the error-response shape needs to change globally.

### 🎁 A Shared Error-Handling Wrapper Pattern
```js
// lib/withErrorHandling.ts
export function withErrorHandling(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ValidationError) {
        return Response.json({ error: error.message }, { status: 400 });
      }
      console.error(error); // log for observability
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}

// app/api/posts/route.js
export const GET = withErrorHandling(async (request) => {
  const posts = await getPosts(); // if this throws, the wrapper handles it
  return Response.json(posts);
});
```

### 🏷️ Custom Error Classes That Carry Their Own Status Code
Defining specific error types (`ValidationError`, `NotFoundError`, `UnauthorizedError`) that carry the intended HTTP status code lets the centralized handler map each error type to the correct response, without every individual handler needing to know the mapping itself — business logic just throws a meaningful error, and the shared wrapper translates it into an HTTP response.

### 📊 A Natural Place to Hook In Logging/Monitoring
The centralized wrapper is also the natural place to hook in error-monitoring and logging (Sentry or similar), since every error passes through this one choke point.

### ❓ Follow-up Interview Questions

1. What problem does the `withErrorHandling` wrapper solve that individual try/catch blocks don't?
2. Why does a custom `ValidationError` class help decouple business logic from HTTP status code decisions?
3. Where would you add logging to catch every error across every Route Handler at once?
4. What would need to change across the app if the error-response shape needed to be updated, with and without this pattern?
5. How does this pattern compare to the shared `requireAuth()` helper idea from the earlier authentication question?

---

## 10. What security considerations should be followed when building APIs with Route Handlers?

### 📖 Introduction
This synthesizes the earlier auth guidance with several other security concerns specific to building a publicly-callable API endpoint.

### 🧹 Input Validation and Sanitization
Never trust client-supplied data — the body, query params, headers. Validate and sanitize everything server-side, ideally with a schema library like Zod — the same principle from the auth question, applied here to a more general-purpose, publicly-callable endpoint.

### 🚦 Rate Limiting
Since Route Handlers are publicly reachable, they're more exposed to abuse — brute-force attempts, scraping, denial-of-service via excessive requests. Implementing rate limiting (via Middleware, or a third-party service) is a genuinely important consideration specific to public-facing endpoints.

### 🌍 CORS Configuration
If the API needs to be called from a different origin — a mobile app, a different domain — CORS headers must be explicitly configured. By default, browsers block cross-origin requests unless the server explicitly allows them via response headers, a common, practical gotcha the first time someone builds a public API.

### 🤐 Avoiding Sensitive Data Leaks in Error Responses
A generic error message to the client, with the detailed stack trace only logged server-side, never sent in the response body — the same production-error-handling principle that applies broadly.

### 💉 SQL/Query Injection Protection
Using parameterized queries or an ORM rather than string-concatenating raw SQL from user input — a classic, foundational web-security concern that's still genuinely relevant.

### ❓ Follow-up Interview Questions

1. Why is input validation still necessary even if the client-side form already validates the data?
2. Why are Route Handlers more exposed to abuse than Server Actions?
3. What would happen if CORS headers weren't configured for an API meant to be called from another domain?
4. Why shouldn't a detailed stack trace ever appear in an API's error response body?
5. Why does string-concatenating user input into a SQL query remain a real risk even with modern tooling?

---

## 11. How would you design RESTful API endpoints using Route Handlers for a large application?

### 📖 Introduction
This ties together the organizational patterns from earlier questions into a complete RESTful API design.

### 🗂️ Resource-Based URL Structure Mapped Onto File-Based Routing
`app/api/posts/route.js` for the collection (GET list, POST create), and `app/api/posts/[id]/route.js` for an individual resource (GET one, PUT/PATCH update, DELETE) — standard REST conventions, mapped naturally onto Next.js's file-based routing conventions.

### 📐 Consistent Response Shapes Across Endpoints
A standard envelope format across all endpoints — `{ data, error, meta }` — so consumers of the API, including your own frontend, can rely on a predictable structure regardless of which endpoint they're calling.

### 🔢 Planning a Versioning Strategy Early
For a large, long-lived API, planning for versioning early — `app/api/v1/posts/route.js` — avoids breaking existing consumers when the API evolves, a genuinely practical, forward-looking concern for public-facing APIs specifically.

### 🧱 Composing Shared Concerns Consistently
Tying together the auth helper, error-handling wrapper, and data-access layer patterns from earlier in this chapter — composing these shared concerns consistently across every endpoint (`withErrorHandling(withAuth(handler))`) so a large team building many endpoints follows the same structural pattern every time, rather than each endpoint reinventing its own conventions.

### ❓ Follow-up Interview Questions

1. How does Next.js's file-based routing map naturally onto REST's collection/individual-resource distinction?
2. Why does a consistent response envelope matter for API consumers?
3. What problem does planning a versioning strategy early prevent later?
4. What would `withErrorHandling(withAuth(handler))` actually compose together, and in what order do they run?
5. Why is consistency across endpoints more valuable as a team building the API grows larger?

---

## 12. How would you optimize Route Handlers for high-traffic production use?

### 📖 Introduction
This pulls together caching, runtime choice, database efficiency, and payload size into one performance checklist for high-traffic endpoints.

### 💾 Leverage Caching Where Possible
For GET endpoints that can be static or cached, ensure they aren't accidentally forced dynamic — the single biggest lever for reducing server load under high traffic.

### ⚡ Edge Runtime for Low-Latency, Distributed Endpoints
A Route Handler can opt into running on the Edge runtime (`export const runtime = 'edge'`) for faster, geographically-distributed response times, though with some Node.js API limitations (the Deployment & Performance chapter goes deeper on Edge vs. Node runtime trade-offs).

### 🔌 Connection Pooling and Database Efficiency
Especially important under high traffic, since many concurrent requests could otherwise exhaust database connections.

### 📄 Paginate List Endpoints
For list endpoints, always paginate rather than returning an unbounded result set — an unpaginated endpoint that works fine with 100 rows can become a serious performance and memory problem at 100,000 rows.

### 📊 Monitor Before Optimizing Further
Track response times and error rates per endpoint in production to identify which specific endpoints are actually under strain, rather than optimizing speculatively.

### ❓ Follow-up Interview Questions

1. Why is ensuring a GET handler stays static often the single biggest performance lever available?
2. What trade-off comes with choosing the Edge runtime over the Node.js runtime for a handler?
3. Why does an unpaginated list endpoint become a real problem only once data grows large?
4. Why should production metrics guide further optimization rather than intuition?
5. What connection-related risk specifically increases under high traffic in a serverless deployment?

---

## 13. Explain the complete lifecycle of a request handled by a Route Handler, and how it integrates with the App Router architecture.

### 📖 Introduction
This closing trace ties together everything in this chapter — routing, method matching, caching, auth, error handling, and the response — into one end-to-end sequence, and closes with how Route Handlers fit into the App Router as a whole.

### 🌐 Steps 1–2: Request Arrives, Method Matched to a Named Export
A request arrives at a URL matching a `route.js` file's path. Next.js's routing layer determines this is a Route Handler request, not a page render, checks which HTTP method was used, and looks up the corresponding named export from the route file. If no matching export exists, a 405 response returns immediately.

### 💾 Step 3: A Cacheable Response May Be Served Without Re-Invoking the Handler
If the handler is cacheable — a static GET handler — Next.js may serve a cached response without even invoking the handler function again. Otherwise, the handler function executes.

### 🔒 Step 4: Auth, Parsing, and Business Logic Execute
Inside the handler, any needed auth checks run first, possibly via a shared helper or wrapper, then request data is parsed — route params, query params, body — then the actual business logic executes, often through a shared data-access layer.

### 🚨 Step 5: Errors Are Caught by the Centralized Wrapper
If an error occurs at any point, a centralized error-handling wrapper catches it and returns an appropriately, consistently-shaped error response.

### 📤 Steps 6–7: The Response Returns, to Whatever Called It
The handler returns a `Response`/`NextResponse` object, potentially setting cookies or headers along the way. Next.js sends this response back to whatever called it — your own frontend, an external mobile app, or a third-party webhook caller.

### 🏗️ Good to Know: How This Integrates With the App Router Architecture Overall
Route Handlers live alongside `page.js`/`layout.js` files within the same `app/` directory structure, sharing the same file-based routing conventions — but they represent a completely separate branch of what a given URL segment can do: return data, versus render a page. This is what lets an app have both its own UI routes and its own API surface, organized consistently within one unified routing system, rather than needing a separate backend framework entirely.

### ❓ Follow-up Interview Questions

1. At which step might Next.js avoid invoking the handler function altogether?
2. Why does auth verification need to happen before request data parsing and business logic, not after?
3. What determines whether an error gets a specific status code versus a generic 500?
4. Who could be "whatever called it" in Step 7, and why does that list differ from a Server Action's callers?
5. Why can Route Handlers and page routes coexist in the same `app/` directory without conflicting, as long as they're not at the exact same segment?

---
