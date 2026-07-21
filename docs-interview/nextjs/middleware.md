---
title: Middleware
description: Intercepting requests before they hit a route — auth checks, redirects, rewrites.
sidebar_position: 8
---

# Middleware

## 1. What is Middleware in Next.js, and when does it execute in the request lifecycle?

### 📖 Introduction
An earlier chapter mentioned Middleware briefly as the earliest, most efficient point to gate a request. This is the full, dedicated treatment.

### 📄 What Middleware Actually Is
A single `middleware.js` (or `.ts`) file placed at the root of the project (or inside `src/`) that runs code before a request is completed. It intercepts every matching request (a later question goes deeper on scoping which ones) before Next.js does anything else — before route matching, before rendering, before a Route Handler even runs.

### ⏰ When It Executes: The Earliest Possible Point, at the Edge
Middleware runs at the edge — a globally-distributed runtime, closer to the user than a traditional single-region server (the Deployment & Performance chapter goes deeper on the Edge runtime) — before the route is even resolved. It's the earliest possible point in the request lifecycle where your code can run, earlier than a layout, a Server Component, or a Route Handler.

### 🎛️ What It Can (and Can't) Do, at a High Level
It can inspect the incoming request — URL, headers, cookies — and decide to let it continue unchanged, redirect it elsewhere, rewrite it to a different internal path, or modify response headers. It can't render UI or return arbitrary HTML content the way a Route Handler can — its job is to intercept, redirect, or modify, not to be the final response-producing logic itself.

### 💎 Good to Know: Conceptually, a Reverse-Proxy-Like Layer in Front of the Whole App
Middleware is Next.js's equivalent of a reverse-proxy layer, or traditional server middleware like Express's — sitting in front of the entire application, running for every matching request before anything else happens.

### ❓ Follow-up Interview Questions

1. At what point in the request lifecycle does Middleware run, relative to routing and rendering?
2. Why does Middleware run at the edge rather than in the same runtime as a Route Handler?
3. What can Middleware do to a request that a Route Handler running later couldn't undo as efficiently?
4. Why can't Middleware render a full HTML page the way a page route can?
5. What's a close analogy to Middleware from a traditional Node.js backend framework?

---

## 2. What is the purpose of Middleware, and what types of tasks is it best suited for?

### 📖 Introduction
Middleware exists to make a decision before the rest of the app runs — worth being precise about what kinds of decisions actually belong there.

### 🎯 The Core Purpose: A Decision Point Before Everything Else Runs
Intercepting requests to make a decision consistently, for every matching request, without duplicating that logic into every individual page, layout, or handler.

### ✅ Tasks It's Best Suited For
- **Authentication gating** (a later question goes deeper) — checking if a user is logged in before they even reach a protected route.
- **Redirects/rewrites based on some condition** (the next question goes deeper) — geographic location, device type, A/B test assignment.
- **i18n/locale detection and routing** — detecting a preferred language and redirecting or rewriting to the correct locale-specific route.
- **Header/cookie manipulation** (a later question goes deeper) — adding security headers or setting a tracking cookie consistently across every response.
- **Bot detection or basic rate limiting** (a later question goes deeper).

### 🚫 What It's Not Well-Suited For
Heavy computation, database queries with complex joins, or anything requiring a full Node.js runtime's APIs — Middleware runs on a restricted, Edge-compatible runtime (a later question goes deeper on the performance implications). Middleware should stay lightweight, fast, and decision-focused, delegating heavy lifting to Route Handlers or Server Components further down the pipeline.

### ❓ Follow-up Interview Questions

1. Why does auth gating fit naturally as a Middleware responsibility?
2. Give an example of a redirect decision that makes sense to handle in Middleware rather than a page component.
3. Why shouldn't Middleware perform a complex, multi-table database query?
4. What runtime constraint limits what Middleware can realistically do?
5. Why does header/cookie manipulation benefit from being centralized in Middleware rather than repeated per route?

---

## 3. What is the difference between a redirect and a rewrite, and how do you implement each in Middleware?

### 📖 Introduction
Both change what the user ends up seeing, but only one of them changes what the user's address bar shows — a distinction worth being precise about.

### ➡️ Redirect: The URL Actually Changes
```js
import { NextResponse } from "next/server";

export function middleware(request) {
  if (!isAuthenticated(request)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```
Tells the browser to go to a different URL instead — the address bar actually changes, and the user sees a new URL. A visible navigation.

### 🔄 Rewrite: Different Content, Same Visible URL
```js
export function middleware(request) {
  if (request.nextUrl.pathname === "/old-dashboard") {
    return NextResponse.rewrite(new URL("/new-dashboard", request.url));
  }
}
```
Serves different content for the same URL, without the browser knowing or the address bar changing — the user still sees the original URL they requested, but Next.js internally serves content from a different path. Invisible to the user.

### 🎯 Concrete Use Cases Illustrating the Difference
A redirect is right for "this page has moved permanently, send the user to the new location" — they should see the new URL. A rewrite is right for "serve different content based on some condition, but keep the URL the same" — A/B testing two different versions of a page at the same public URL, or serving a localized version of a page without the URL showing a locale prefix.

### 💎 Good to Know: The Distinguishing Question
Should the user's URL bar actually change? Yes → redirect. No, but they should see different content → rewrite.

### ❓ Follow-up Interview Questions

1. What's the observable difference to a user between a redirect and a rewrite?
2. Why would A/B testing two page versions favor a rewrite over a redirect?
3. Why would moving a page permanently favor a redirect over a rewrite?
4. What does `NextResponse.rewrite()` actually change from the browser's perspective?
5. If you wanted to serve a locale-specific page without the URL showing `/en/` or `/fr/`, which would you use?

---

## 4. How do you read/modify cookies and headers in Middleware?

### 📖 Introduction
The APIs are similar to the Route Handlers chapter's coverage, but Middleware has one genuinely distinctive capability worth calling out.

### 🍪 Reading Cookies and Headers
```js
export function middleware(request) {
  const token = request.cookies.get("session")?.value;
}
```
Reading headers works the same way, via `request.headers.get('header-name')`.

### 📨 Modifying the Outgoing Request's Headers — Passing Context Downstream
A genuinely important, Middleware-specific capability: it can modify headers on the *request* before it continues to the route, using `NextResponse.next({ request: { headers: newHeaders } })` — different from modifying the response's own headers. This lets Middleware inject additional context (a decoded user ID, a feature flag value) to downstream Server Components or Route Handlers, without them needing to re-derive it themselves:
```js
export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", decodedUserId);
  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

### 🔒 Setting Cookies/Headers on the Response
Via `response.cookies.set(...)` or response headers, the same as Route Handlers. `NextResponse.next()` lets the request continue while still attaching cookies or headers to the eventual response, while `NextResponse.redirect()`/`.rewrite()` can also carry cookie or header modifications alongside the redirect or rewrite itself.

### ❓ Follow-up Interview Questions

1. What's the difference between modifying the outgoing request's headers versus the response's headers?
2. Give a concrete use case for passing a decoded user ID downstream via a request header.
3. How does `NextResponse.next()` still allow attaching cookies to the eventual response?
4. Why would a downstream Route Handler benefit from Middleware having already decoded something for it?
5. Can a redirect response from Middleware also set a cookie? How?

---

## 5. How do you scope Middleware to specific routes using a matcher configuration?

### 📖 Introduction
Without scoping, Middleware runs on every request — worth avoiding, since it adds latency to anything it touches.

### ⚠️ The Default: Runs on Every Request Unless Scoped
Without any configuration, Middleware runs on every single request — including static assets, images, and so on, unless explicitly excluded. Since Middleware adds latency to every matched request (a later question goes deeper), running it unnecessarily on requests it doesn't need to affect is wasteful.

### 🎯 The `matcher` Config
Exporting a `config` object from the same `middleware.js` file specifies which paths it should run on:
```js
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```
This scopes Middleware to only run for requests matching these path patterns (similar syntax to dynamic route segments) — requests to other paths skip Middleware entirely.

### 🚫 Excluding Static Assets: A Common Pattern
A common, recommended pattern uses negative lookahead in the matcher to exclude `_next/static`, image files, favicon, and similar:
```js
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### 💎 Good to Know: Matcher Config vs. In-Function Conditionals
Middleware can also use conditional logic inside the function body itself, checking `request.nextUrl.pathname`, as an alternative or complement to the matcher config. The matcher config is more efficient, though, since it prevents the middleware function from being invoked at all for non-matching paths, rather than being invoked and then deciding to no-op.

### ❓ Follow-up Interview Questions

1. What happens to a request for a static image file if no matcher is configured at all?
2. Why is the negative-lookahead exclusion pattern for static assets a common recommendation?
3. What's the efficiency difference between a matcher config and an in-function pathname check?
4. How does matcher syntax relate to dynamic route segment syntax?
5. Could you combine a matcher config with an in-function conditional? Why might you?

---

## 6. What is the difference between Middleware and Route Handlers, and when should you use one over the other?

### 📖 Introduction
An earlier chapter mentioned this briefly — here's the full comparison.

### 🔄 The Core Distinction
Middleware runs before routing or rendering even happens, for every matching request regardless of what that request is for — a page, an API call, anything. A Route Handler is itself a specific, named endpoint handling one particular URL's logic.

### ✅ When to Use Middleware
Cross-cutting concerns that apply broadly across many or all routes — auth gating before reaching any protected page, global redirects/rewrites, i18n routing — things that need to happen consistently and early, regardless of which specific route is being hit.

### 🌐 When to Use Route Handlers Instead
Building an actual API endpoint that returns data or performs a specific operation. Route Handlers answer "this specific URL does this specific thing"; Middleware answers "every (or many) matching requests should go through this check first."

### 💎 Good to Know: Complementary, Not Interchangeable
Middleware can't replace a Route Handler — it doesn't typically produce the final response content itself. A Route Handler can't replace Middleware — it only runs for its own specific route, not broadly or early enough to gate other routes. They're complementary, operating at different layers of the request pipeline: Middleware first and broadly, Route Handlers specific and later.

### ❓ Follow-up Interview Questions

1. Why can't a Route Handler gate access to other, unrelated routes the way Middleware can?
2. Why can't Middleware typically serve as the final source of an API's actual data?
3. Give an example of a task that should be Middleware's job, not a Route Handler's.
4. Why are these two described as operating at "different layers" of the request pipeline?
5. Could an auth check reasonably live in both Middleware and a Route Handler at once? Why might that be justified?

---

## 7. How is authentication and authorization implemented using Middleware, and how would you protect routes with it?

### 📖 Introduction
An earlier chapter previewed this briefly — here's the full mechanics, with the Authentication & Authorization chapter going deeper still on session and token strategy.

### 🔑 The Pattern: Check the Session, Redirect if Invalid
```js
export function middleware(request) {
  const token = request.cookies.get("session")?.value;
  if (!token || !isValidSession(token)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```
Scoped to protected routes via the matcher config.

### 🎭 Role-Based Authorization
Middleware can also make role-based decisions — decoding a JWT's claims (without necessarily hitting a database, since a JWT often carries role info directly) to check whether the user has the required role for a specific route segment, rewriting or redirecting if not.

### ⚡ Why Middleware Is Often the Preferred Gating Mechanism
It happens before any rendering work starts — more efficient than a layout-level check, which still requires the layout to at least begin rendering before it can redirect.

### 💎 Good to Know: A Lightweight First Gate, Not Necessarily the Only One
Middleware runs on a restricted Edge runtime and may not be able to do a full database lookup for every request efficiently. The common pattern is a lightweight check in Middleware — is there a valid-looking token at all? — combined with a more thorough, database-backed check further down the pipeline (a Server Component or Route Handler) for truly sensitive operations. Middleware is the first, fast gate, not necessarily the only one.

### ❓ Follow-up Interview Questions

1. Why does gating auth in Middleware avoid the inefficiency of a layout-level check?
2. How can Middleware make a role-based decision without querying a database on every request?
3. Why might Middleware's check alone not be sufficient for a truly sensitive operation?
4. What does the matcher config in the example above actually scope this Middleware to?
5. What's the relationship between Middleware's auth check and a Route Handler's own auth check for the same protected resource?

---

## 8. How can Middleware be used for internationalization (i18n), A/B testing, or feature flags?

### 📖 Introduction
All three of these turn out to be applications of the same underlying rewrite/redirect capability covered earlier in this chapter, just decided on different conditions.

### 🌍 Internationalization: Detecting and Routing by Locale
Middleware can inspect the `Accept-Language` header (or a stored locale cookie) and rewrite the request to a locale-specific route segment — `/about` rewritten internally to `/en/about` or `/fr/about`, without the URL necessarily showing the locale prefix — or redirect to a locale-prefixed URL if the app's convention is to show the locale visibly.

### 🧪 A/B Testing: Sticky Variant Assignment via Rewrites
```js
export function middleware(request) {
  const variant = request.cookies.get("ab-variant")?.value ?? (Math.random() < 0.5 ? "a" : "b");
  const response = NextResponse.rewrite(new URL(`/home-${variant}`, request.url));
  response.cookies.set("ab-variant", variant); // sticky assignment
  return response;
}
```
Assigning a user to variant A or B — sticky via a cookie, so the same user consistently sees the same variant — while the public URL stays the same.

### 🚩 Feature Flags: Conditionally Serving an Alternate Route
Middleware can check a feature-flag service or cookie and rewrite requests to an alternate version of a page for users with a specific flag enabled, letting a team roll out a new feature to a subset of users without deploying separate code paths into every individual page component's own logic.

### 💎 Good to Know: The Same Underlying Mechanism, Applied Three Ways
All three are applications of the same rewrite/redirect capability, decided based on some piece of request-time information — a header, a cookie, a random assignment. Middleware's value here is doing this decision consistently and early, for every matching request, without every individual page implementing its own variant-selection logic.

### ❓ Follow-up Interview Questions

1. Why does the A/B testing example set a cookie after assigning a variant?
2. What's the difference between rewriting to a locale route and redirecting to one, in terms of what the user sees?
3. How does a feature flag rollout via Middleware avoid needing separate logic in every page component?
4. What underlying capability do i18n routing, A/B testing, and feature flags all share?
5. What would happen to A/B test consistency if the cookie-based sticky assignment were removed?

---

## 9. What performance considerations and risks come with complex Middleware logic?

### 📖 Introduction
Since Middleware touches every matching request, any inefficiency inside it compounds in a way that's easy to underestimate.

### ⚖️ The Core Risk: Every Matched Request Pays the Cost
Any latency added inside Middleware directly delays every single matching request, even ones that don't ultimately need any special handling — a genuinely important, compounding cost, since it isn't optional or skippable the way some other optimizations are.

### 🌐 The Edge Runtime's Restrictions
Middleware runs on a limited, Edge-compatible JavaScript runtime, not full Node.js. Some Node.js-specific APIs and libraries — certain database drivers, file-system access — simply aren't available inside Middleware. Attempting a heavy, direct database query inside Middleware is both a performance anti-pattern and often technically unsupported.

### 🐢 Concrete Performance Risks
- **CPU-heavy computation** — parsing or decoding a large JWT with expensive cryptographic operations on every request adds real latency at global scale.
- **External network calls** — calling out to a third-party feature-flag service inside Middleware adds that call's latency to every matching request, and introduces a new failure mode if that service is slow or down.
- **An over-broad matcher config** running Middleware on requests that didn't need it — static assets, images — wastes compute unnecessarily.

### 💎 Good to Know: Keep It Lightweight, Scope It Narrowly, Delegate the Heavy Lifting
Keep Middleware to simple cookie/header checks and lightweight token validation without a full database round trip where possible, scope it narrowly with the matcher config, and delegate anything heavy to a Route Handler or Server Component further down the pipeline.

### ❓ Follow-up Interview Questions

1. Why does latency added in Middleware compound differently than latency added in one specific page?
2. Why might a database driver simply not work inside Middleware at all?
3. What new failure mode does an external network call inside Middleware introduce?
4. How does an overly broad matcher config waste compute unnecessarily?
5. What's the general discipline for deciding what belongs in Middleware versus further down the pipeline?

---

## 10. How would you implement rate limiting or request logging using Middleware?

### 📖 Introduction
Both patterns are genuinely useful in Middleware, but both come with the same underlying caveat from the previous question: they typically require an external call, which needs to be scoped deliberately.

### 🚦 Rate Limiting: Requires a Shared, External Store
Since Middleware runs on the edge — potentially many distributed, stateless instances — an in-memory counter inside the middleware function itself won't work; each instance would have its own separate counter, giving inconsistent results. Real rate limiting requires an external, shared store (Redis, an edge-compatible KV store like Upstash) that all instances read and write to consistently:
```js
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "10 s") });

export async function middleware(request) {
  const ip = request.ip ?? "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return new Response("Too Many Requests", { status: 429 });
  }
  return NextResponse.next();
}
```

### 📝 Request Logging: Shipping Metadata to an External Service
Middleware can log basic request metadata — path, method, timestamp, user agent — for every matching request, typically sending it to an external logging or analytics service, since Middleware's own execution environment is ephemeral and edge-distributed. This is often done as a non-blocking, fire-and-forget call where possible, rather than awaiting it before continuing.

### 💎 Good to Know: Both Add External Calls — Scope Them Deliberately
Both patterns involve an external network call from within Middleware — exactly the kind of thing that adds real latency and failure risk to every matching request. Be deliberate about which routes actually need rate limiting or logging, via the matcher config, rather than applying it globally by default.

### ❓ Follow-up Interview Questions

1. Why doesn't an in-memory counter work for rate limiting across edge instances?
2. What kind of store is needed to implement rate limiting correctly at the edge?
3. Why is request logging often done as a fire-and-forget call rather than awaited?
4. What risk does adding an external call to Middleware introduce?
5. Why should rate limiting or logging be scoped via the matcher rather than applied to every request globally?

---

## 11. What are the trade-offs between using Middleware and application-level authentication?

### 📖 Introduction
An earlier question covered Middleware-based auth in isolation — this weighs it against application-level checks (layouts, per-component checks) to see where each genuinely wins.

### ✅ Middleware-Based Auth: Advantages
The earliest possible gate — before any rendering starts — and consistent across all matched routes automatically via the matcher, without needing to remember to add a check to every new protected page individually.

### ⚠️ Middleware-Based Auth: Disadvantages
The restricted Edge runtime limits what kind of auth logic can run efficiently there — a full database session lookup may not be practical. The matcher config can also be easy to get wrong or forget to update: a new page added under `/admin/newpage` won't be protected unless the matcher pattern already covers it — a genuinely real, practical risk.

### ✅ Application-Level Auth: Advantages
Can do a full, thorough database-backed session or permission check without the Edge runtime's restrictions, and is more naturally scoped — a layout wrapping a specific route group automatically protects everything nested under it, without a separate matcher config to keep in sync.

### ⚠️ Application-Level Auth: Disadvantages
Happens later in the pipeline — the layout or component still has to at least start rendering before it can redirect — and is easier to accidentally forget on a one-off page if there's no consistent layout-based structure enforcing it.

### 💎 Good to Know: Most Real Apps Layer Both
Middleware as a fast, lightweight first gate, catching the obvious "not logged in at all" case early and cheaply, plus application-level checks (layouts, Route Handlers) for more thorough, role/permission-specific verification where it genuinely matters. Neither should be the only line of defense.

### ❓ Follow-up Interview Questions

1. What's the risk of a matcher config not being updated when a new protected page is added?
2. Why can a layout wrapping a route group avoid needing a separate matcher config?
3. Why does application-level auth happen "later" in the pipeline than Middleware's check?
4. Why would a large app typically use both layers rather than choosing one exclusively?
5. Which layer would you trust for a truly high-stakes permission check, and why?

---

## 12. How would you design Middleware for a multi-tenant SaaS application?

### 📖 Introduction
This applies several patterns from this chapter — rewrites, header injection, and auth — to a concrete, genuinely common real-world architecture problem.

### 🏢 Tenant Identification via Subdomain or Path
Middleware inspects the incoming request's hostname (`request.nextUrl.hostname`, e.g. `acme.myapp.com`) or a path prefix to determine which tenant the request belongs to, then rewrites the request internally to a tenant-aware route structure:
```js
export function middleware(request) {
  const hostname = request.nextUrl.hostname;
  const tenant = hostname.split(".")[0]; // "acme" from acme.myapp.com
  return NextResponse.rewrite(new URL(`/tenants/${tenant}${request.nextUrl.pathname}`, request.url));
}
```
`acme.myapp.com/dashboard` gets rewritten internally to `/tenants/acme/dashboard`, without the tenant needing its own literal folder per tenant in the app's actual route structure.

### 📨 Injecting Tenant Context Downstream
Using the request-header-modification pattern covered earlier, passing the resolved tenant ID as a request header lets downstream Server Components or Route Handlers read `headers().get('x-tenant-id')` without needing to re-parse the hostname themselves.

### 🔒 Per-Tenant Authorization: Not Just "Logged In," But "Belongs to This Tenant"
Verifying that the authenticated user actually belongs to or has access to the resolved tenant — not just "are they logged in at all," but "are they logged in and a member of this specific tenant" — a genuinely important, multi-tenant-specific security consideration, preventing a user from one tenant accessing another tenant's data by manipulating the URL or hostname.

### ⚡ Keeping Tenant Resolution Lightweight
Tenant resolution should stay lightweight — parsing the hostname is cheap — avoiding a database lookup per request just to resolve which tenant a request belongs to where possible, e.g. encoding enough info in the subdomain or JWT itself rather than a database round trip for every single request.

### ❓ Follow-up Interview Questions

1. How does rewriting let one route structure serve many tenants without a literal folder per tenant?
2. Why pass the resolved tenant ID downstream as a header rather than having each component re-derive it?
3. What specific security risk does per-tenant authorization guard against that generic "is logged in" auth doesn't?
4. Why should tenant resolution avoid a database lookup on every request if possible?
5. What would happen if a user's session token were valid but for a different tenant than the one in the URL?

---

## 13. Explain the complete request lifecycle involving Middleware.

### 📖 Introduction
This closing trace ties together matcher scoping, the Edge runtime, the possible outcomes Middleware can produce, and how it hands off to the rest of the App Router.

### 🚪 Step 1: Does the Request Match the Matcher Config?
Before anything else, Next.js checks if the request matches Middleware's matcher config. If it doesn't, Middleware is skipped entirely, and the request proceeds directly to routing and rendering.

### ⚡ Step 2: Middleware Executes on the Edge, Before Routing/Rendering
If it does match, the Middleware function executes on the Edge runtime, before route matching or rendering even begins — it can read cookies and headers, check auth, or determine tenant, locale, or variant.

### 🔀 Step 3: Middleware Decides — Continue, Redirect, Rewrite, or Respond Directly
- `NextResponse.next()` — let the request continue unchanged, or with modified request headers, into the normal routing/rendering pipeline.
- `NextResponse.redirect()` — send the browser to a different URL entirely; the original request stops here, and a new request will eventually come in for the redirect target.
- `NextResponse.rewrite()` — internally serve a different path's content while the user's URL stays unchanged; the request continues, targeting a different internal route.
- A direct `Response` (a 429 for rate limiting) — the request is answered immediately, without ever reaching the normal routing/rendering pipeline at all.

### 🖥️ Step 4: If Continuing, the Request Proceeds Into the Normal App Router Pipeline
For `.next()` or `.rewrite()` outcomes, the request proceeds into the normal App Router lifecycle — routing, Server/Client rendering, or Route Handlers if it's an API request. Any headers or cookies Middleware attached are now available to those downstream layers.

### 📤 Step 5: The Eventual Response Carries Forward Any Middleware Modifications
The eventual response — whether from a rendered page or a Route Handler — is sent back to the browser, with any response-level cookie or header modifications Middleware originally attached still applied.

### ❓ Follow-up Interview Questions

1. What happens to a request that doesn't match Middleware's matcher config at all?
2. Which of Middleware's possible outcomes stops the request from ever reaching the App Router's normal pipeline?
3. How does a header Middleware attached in Step 2 end up available to a Server Component later in the lifecycle?
4. What's the practical difference in what happens next after a `redirect()` versus a `rewrite()`?
5. Why does the eventual response in Step 5 still carry Middleware's modifications, even though Middleware ran much earlier?

---
