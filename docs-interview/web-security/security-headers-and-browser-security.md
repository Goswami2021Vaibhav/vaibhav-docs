---
title: Security Headers & Browser Security
description: CSP, HSTS, CORS, and the headers that quietly do a lot of the work.
sidebar_position: 10
---

# Security Headers & Browser Security

## 1. What is the role of HTTP security headers as a category, and why are they considered a low-effort, high-value defense layer?

### 📖 Introduction

Several earlier chapters introduced security headers conceptually — CSP as an XSS defense in the Common Web Vulnerabilities chapter, cookie attributes in Session & Token Security, CORS in API Security. This chapter is where the actual header mechanics behind each of them get covered directly, alongside a few more.

### 🎯 Why They're High-Value for Low Effort

Most security headers require a single line of server configuration, or one call to a middleware library like Helmet, to instruct the *browser itself* to enforce a protection. No application logic changes are needed, they apply uniformly across every page and route once set, and they directly leverage enforcement mechanisms already built into every modern browser, rather than requiring you to build and maintain that enforcement yourself.

### 💎 Good to Know: These Headers Only Protect Browser Traffic

Security headers are enforced by the browser, not the server — meaning they protect a specific user's browser session from certain attacks, but do nothing at all for non-browser clients, like a mobile app or a server-to-server API call, hitting the same endpoints. Still genuinely valuable, given how much of a typical web application's traffic is browser traffic, but worth knowing the actual boundary of what this category of defense covers.

---

## 2. What is Content Security Policy, and what do its main directives control?

### 📖 Introduction

CSP was introduced in the Common Web Vulnerabilities chapter as a defense-in-depth layer against XSS — this question covers the actual header syntax behind it.

### 📜 What CSP Is

A `Content-Security-Policy` response header that declares, directive by directive, which sources are allowed for different types of content the page loads.

- **`default-src`** — the fallback source list applied to any content type that isn't explicitly covered by a more specific directive.
- **`script-src`** — specifically which sources JavaScript may be loaded or executed from, the single most important directive for XSS defense.
- **`style-src`** — which sources CSS may be loaded from.
- **`frame-ancestors`** — which *other* origins are allowed to embed this page in an iframe. This is the reverse direction from `script-src`/`style-src`, which control what the page loads; `frame-ancestors` controls who's allowed to frame the page, covered in more depth in a later question.

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self'; frame-ancestors 'none'
```

### 💎 Good to Know: A Missing Directive Doesn't Mean "Blocked" — It Falls Back to `default-src`

An unspecified directive falls back to whatever `default-src` allows. But `default-src` itself has no further fallback — a policy with no `default-src` set, and no explicit directive for a given resource type, effectively allows that type from anywhere. This is an easy, easy-to-miss gap when writing a policy by hand rather than starting from a sensible, restrictive baseline.

---

## 3. What is a CSP nonce, and how does a nonce-based or hash-based policy allow a specific inline script to run?

### 📖 Introduction

A strict CSP that only allows scripts from `'self'` blocks every inline `<script>` tag by default — but some legitimate applications genuinely need at least one specific inline script, an analytics bootstrapping snippet, for instance.

### 🎲 Nonce-Based Policies

The server generates a fresh, cryptographically random value on every single response, includes it in the CSP header, and adds it as an attribute on the specific inline script tag meant to be allowed.

```html
<script nonce="rAnd0mVaLu3-changes-every-request">
  // this specific script is allowed to run
</script>
```

The browser only executes an inline script whose `nonce` attribute matches the *current* response's CSP header value. Since the nonce changes on every single request, an attacker injecting their own `<script>` tag has no way to know or guess the correct, current value — their injected script gets blocked, while the legitimate one runs.

### #️⃣ Hash-Based Policies

Instead of a per-request random value, the CSP header contains a cryptographic hash of the *exact* expected inline script's content. The browser computes the hash of any inline script it encounters and only executes it if that hash matches one explicitly listed in the policy. This works well for static inline scripts whose content never changes, since the hash stays valid indefinitely — less practical for dynamically generated inline content, where the hash would need recalculating on every response anyway, making nonces the more natural fit for that case.

### 💎 Good to Know: This Is How You Avoid `'unsafe-inline'` Entirely

`'unsafe-inline'`, allowing *every* inline script unconditionally, defeats the entire purpose of using CSP against XSS in the first place. Nonces and hashes exist specifically so a small set of known-good inline scripts can still run, achieving the same practical outcome without the blanket, dangerous exception — a theme this chapter returns to when covering CSP misconfiguration later on.

---

## 4. What is `Content-Security-Policy-Report-Only`, and how is it used before enforcing a new policy?

### 📖 Introduction

Deploying a brand-new or stricter CSP directly as an enforcing header on a live application is a genuine risk — this header exists specifically to avoid that risk.

### 📋 What It Does

`Content-Security-Policy-Report-Only` uses the exact same directive syntax as the enforcing `Content-Security-Policy` header, but the browser only *evaluates* the policy and *reports* any violations it would have caused — without actually blocking anything. The page behaves exactly as if no CSP were present at all, while the browser silently records what would have been blocked.

### 🔁 How It's Used in Practice

Paired with a `report-uri` or `report-to` directive specifying an endpoint your own server exposes to receive violation reports:

```
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-violations
```

Deploying a new or stricter policy in Report-Only mode first lets a team observe, from real production traffic across every real user's browser, everything the policy would break — without breaking anything for anyone yet, before ever switching to the enforcing header.

### 💎 Good to Know: This Is the Standard Rollout Mechanism, Not an Edge-Case Tool

This header is directly the mechanism behind the rollout and debugging questions closing this chapter. Report-Only mode isn't a lesser, optional feature — it's the recommended way any non-trivial CSP rollout should actually happen in practice.

---

## 5. What is HTTP Strict Transport Security, and what does the `preload` directive add on top of it?

### 📖 Introduction

HSTS closes a specific gap that HTTPS alone doesn't fully cover: what happens on a user's very *first* request to a site, before any redirect to HTTPS has occurred.

### 🔒 What HSTS Is

A `Strict-Transport-Security` header instructing the browser to remember, for a specified duration, that a domain should only ever be accessed over HTTPS. After receiving it once, the browser automatically upgrades any future attempt to visit that domain over plain HTTP into HTTPS internally — without even making the initial insecure request over the network at all.

### 🛡️ How It Prevents SSL-Stripping Downgrade Attacks

A classic attack: someone on the same network — a malicious Wi-Fi hotspot, for instance — intercepts a victim's first, plain-HTTP request to a site, before any redirect to HTTPS happens, and simply never allows the upgrade to occur, silently keeping the victim on unencrypted HTTP for the entire session while reading and modifying traffic freely. HSTS defeats this because, once a browser has previously seen the header for a domain, it refuses to ever make that initial plain-HTTP request again — closing the exact window the downgrade attack depends on.

### 🌱 The First-Visit Gap, and What `preload` Adds

The very first time a user ever visits a domain, their browser hasn't seen the HSTS header yet, so that single first request is still vulnerable to the exact downgrade attack HSTS otherwise prevents. The `preload` directive addresses this by letting a domain submit itself to a list hardcoded directly into browsers themselves — so even a user's first-ever visit already enforces HTTPS-only, with no vulnerable first-request window at all.

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

### 💎 Good to Know: Preload Submission Is a Serious, Semi-Permanent Commitment

Removal from the preload list, once submitted and baked into browser releases, can take a long time to fully propagate as users update their browsers. A domain should be confident it'll support HTTPS-only indefinitely before opting in.

---

## 6. What is the `X-Content-Type-Options: nosniff` header, and what does it prevent?

### 📖 Introduction

This header closes a gap created by a browser behavior that was originally meant to be helpful.

### 🔍 What MIME-Sniffing Is

Historically, browsers would sometimes try to intelligently guess a response's actual content type by inspecting the response *body* itself, rather than strictly trusting the server's declared `Content-Type` header — a compatibility feature meant to work around poorly configured servers sending the wrong header. This created a real vulnerability: a file served with a declared type of `image/jpeg`, but containing HTML or script content inside it — recall the polyglot files covered in the File Upload Security chapter — could, on a browser doing content-sniffing, get reinterpreted and rendered as HTML despite the server explicitly declaring it as an image.

### 🛡️ What the Header Does

`X-Content-Type-Options: nosniff` tells the browser to strictly respect the server's declared `Content-Type` and never attempt to guess or override it based on content inspection, directly closing the sniffing-based bypass.

### 💎 Good to Know: A Direct Companion to the File Upload Chapter's Defenses

This header is another layer specifically relevant to serving user-uploaded content safely, alongside `Content-Disposition` and origin separation from the File Upload Security chapter — a good example of a single header closing a gap that several other, feature-specific defenses were also independently working to close.

---

## 7. What is the `X-Frame-Options` header, and how does CSP's `frame-ancestors` supersede it?

### 📖 Introduction

The clickjacking question in the Common Web Vulnerabilities chapter deliberately deferred the actual header mechanics to this chapter — here they are.

### 🖼️ What `X-Frame-Options` Does

An older header with two possible values: `DENY` — the page can never be framed by anyone at all, including itself — or `SAMEORIGIN` — the page can only be framed by pages on the same origin. This was the original, classic defense against clickjacking.

### 🆙 Why `frame-ancestors` Supersedes It

`frame-ancestors`, one of the CSP directives from earlier in this chapter, achieves the same goal far more flexibly. Rather than just `DENY` or `SAMEORIGIN`, it accepts an actual list of specific origins allowed to frame the page — useful for a legitimate case like an embeddable widget meant to be framed only by a specific set of trusted partner sites, something `X-Frame-Options`'s two fixed values simply can't express.

### 🤝 How They Relate

Where both headers are present, modern browsers respect `frame-ancestors` and ignore the older `X-Frame-Options`. That makes `frame-ancestors` technically sufficient on its own in a modern-browser-only context — but `X-Frame-Options` is still commonly included alongside it as a fallback for any older browser that doesn't understand `frame-ancestors` at all, a legitimate case of deliberate redundancy rather than pointless duplication.

### 💎 Good to Know: CSP Has Gradually Absorbed Several Older, Single-Purpose Headers

`frame-ancestors` replacing `X-Frame-Options` is one instance of a broader pattern — worth keeping in mind when reading older security guidance that predates CSP's current, broader directive set.

---

## 8. What is the `Referrer-Policy` header, and what risk does it address?

### 📖 Introduction

This is a genuinely easy-to-overlook leak vector, precisely because it happens passively, as a side effect of completely normal browsing behavior rather than through anything that looks like an obvious vulnerability.

### 🔗 What the `Referer` Header Normally Does

When a browser navigates to another page, or loads a resource from a third party, it can automatically include a `Referer` header telling the destination which page the user came from — including, by historical default, the *full URL* of the originating page. That can include sensitive query string parameters: a password-reset token in a URL, a session identifier, or search terms someone never intended to share with whatever third-party resource the browser just followed a link or loaded an image from.

### ⚠️ The Risk

A page containing sensitive data in its own URL, that also loads any third-party resource — an image, an analytics script, an ad — or has an outbound link a user clicks, by default leaks that full URL, sensitive query string included, to that third party. This happens entirely invisibly to the user, and often invisibly to the developer too, unless they specifically think about it.

### 🎛️ What `Referrer-Policy` Controls

This header lets a site explicitly control how much referrer information gets sent on outbound navigation and requests. Values range from `no-referrer` (send nothing at all) to `same-origin` (send full information only to your own origin, nothing to third parties) to `strict-origin-when-cross-origin` (send only the origin, not the full path or query string, to cross-origin destinations) — a common, reasonable modern default balancing some useful referrer information against not leaking sensitive URL details.

### 💎 Good to Know: The Real Fix Is Avoiding Sensitive Data in URLs at All

`Referrer-Policy` is a genuinely useful complementary layer, but avoiding sensitive data in URL query strings in the first place — a theme also touched on around token handling in the Session & Token Security chapter — closes the risk more completely than relying on this header alone.

---

## 9. What is the `Permissions-Policy` header, and how does it restrict browser feature access?

### 📖 Introduction

This header addresses a specific concern about embedded content that most of the headers covered so far don't touch: powerful browser capabilities, not just script or style sources.

### 🎛️ What It Is

A header letting a site explicitly declare which powerful browser features — camera, microphone, geolocation, USB device access, autoplay, and others — the page itself, and any iframes it embeds, are allowed to use at all, regardless of whether the browser would otherwise prompt the user for permission.

### 🖼️ Why This Matters Specifically for Embedded Content

Without an explicit policy, an embedded third-party iframe — an ad, a widget — might, by default, be able to request access to the user's camera or geolocation, triggering a permission prompt the host page never intended to allow that specific embedded content to even ask for. `Permissions-Policy` lets the host page explicitly restrict which of these an iframe can access, independent of what the iframe's own content tries to request.

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), fullscreen=(self)
```

### 💎 Good to Know: This Header Was Formerly Called `Feature-Policy`

An earlier, now-deprecated version of largely the same underlying concept was called `Feature-Policy`, later renamed as the spec matured. Worth recognizing both names, since older documentation and tutorials may still reference the earlier one.

---

## 10. What are the actual CORS headers involved, and what triggers a preflight request?

### 📖 Introduction

CORS was covered from an API-security angle in an earlier chapter, which deferred the exact header mechanics to here.

### 📋 The Headers

- **`Access-Control-Allow-Origin`** — which origin, or origins, may read the response.
- **`Access-Control-Allow-Methods`** — which HTTP methods are permitted for cross-origin requests.
- **`Access-Control-Allow-Headers`** — which custom request headers a cross-origin request is allowed to include.
- **`Access-Control-Allow-Credentials`** — whether cookies or other credentials may be included in, and read from, a cross-origin request at all.

### ✈️ What Triggers a Preflight

For "simple" requests — a subset of `GET`/`POST`/`HEAD` using only a small set of common, standard headers — the browser sends the actual request directly, and CORS purely governs whether the browser lets the calling script *read* the response afterward. For anything outside that definition — a custom header, a method like `PUT` or `DELETE`, a `Content-Type` of `application/json` — the browser first sends a separate `OPTIONS` request, the "preflight," asking the server in advance whether the actual request would be permitted, before ever sending the real one. The server responds to this preflight with the same `Access-Control-*` headers, and only if the response permits it does the browser proceed to send the actual request.

### 💎 Good to Know: The Simple-Request Case Still Reaches the Server

A common point of confusion: for a simple request, the server *does* receive and can act on the request even without CORS approval — CORS in that case only blocks the browser from letting the calling JavaScript *read* the response afterward, echoing the point made in the API Security chapter that CORS is a browser-enforced read restriction, not a request-blocking mechanism, in that specific case. Preflight requests are the one case where the browser actually withholds sending the real request at all until explicitly authorized.

---

## 11. Why is combining a wildcard `Access-Control-Allow-Origin` with `Access-Control-Allow-Credentials: true` invalid and dangerous?

### 📖 Introduction

This was mentioned briefly in the API Security chapter — here's the full mechanics of why browsers specifically refuse this combination.

### ⚠️ Why the Combination Is Dangerous

`Access-Control-Allow-Origin: *` allows literally any origin to read the response. Paired with `Access-Control-Allow-Credentials: true`, which also allows cookies to be included, this would together mean any website's JavaScript could make a request with the user's cookies attached *and* read the resulting response — exactly the cross-origin data-theft scenario CORS exists to prevent.

### 🚫 How Browsers Handle It

This specific combination is explicitly disallowed by the CORS specification itself. Browsers reject a response that tries to combine a literal `*` wildcard origin with `Allow-Credentials: true`, refusing to expose the response to the calling script even if the server actually sent both headers.

### 🩹 The Dangerous Workaround

Rather than a literal `*`, some implementations dynamically reflect whatever `Origin` header the incoming request happened to send, back as the specific `Access-Control-Allow-Origin` value:

```js
// Technically not a literal wildcard, so the browser allows it —
// but functionally identical to allowing every origin, with credentials
app.use(cors({
  origin: (origin, callback) => callback(null, origin),
  credentials: true,
}));
```

This technically satisfies the specification's rule, since it's never literally `*`, so the browser permits it — while achieving the exact same "allow every origin, with credentials" outcome the wildcard restriction was specifically designed to prevent.

### 💎 Good to Know: A Rule Satisfied to the Letter, Completely Defeated in Spirit

This is a good, concrete example of a security control being technically satisfiable while being functionally undermined — worth watching for as a general pattern, not just in this specific header combination.

---

## 12. What is Helmet, and why is a well-maintained header-setting library preferred over manual configuration?

### 📖 Introduction

Given how many headers this chapter covers, and how many small details each one has, hand-configuring every single one correctly is genuinely error-prone.

### 🪖 What Helmet Is

An Express middleware — with equivalents in other frameworks — that sets a curated collection of security-related response headers automatically with a single line of setup, rather than requiring a developer to manually configure each header covered throughout this chapter individually.

```js
const helmet = require("helmet");
app.use(helmet()); // applies sensible defaults for HSTS, nosniff, a baseline CSP, and more
```

### 🤔 Why a Library Over Manual Configuration

Security headers have subtle, easy-to-get-wrong details — correct syntax, sensible default values, and keeping up with evolving best practices as browser behavior and recommendations genuinely change over time. A well-maintained library centralizes that expertise, kept current by people actively tracking these changes, rather than every individual project needing to independently research and correctly implement each header from scratch, and then remember to revisit it as guidance evolves.

### 💎 Good to Know: Helmet's Defaults Are a Baseline, Not a Complete Policy

CSP specifically almost always needs application-specific customization beyond Helmet's conservative default — covered in the rollout question later in this chapter — since Helmet has no way to know in advance which third-party scripts and domains your specific application actually needs to allow.

---

## 13. How would you audit which security headers a live production site is missing?

### 📖 Introduction

Configuring headers correctly once isn't the same as confirming they're actually being sent on a live, deployed site — this question is about verifying the real, current state.

### 🔍 Manual Verification

Browser DevTools' Network tab directly shows every response header actually being sent for any given request — the most direct, no-additional-tooling way to check what's *actually* being sent on a live deployment, as opposed to what a configuration file suggests should be sent.

### 🛠️ Dedicated Tools

Online scanners exist specifically for this — pointing a tool at a URL and getting back a scored report of which recommended headers are present, absent, or present but weakly configured, often with a summary explaining exactly what's missing and why it matters.

### 💎 Good to Know: This Should Be a Recurring Check, Not a One-Time Pre-Launch Task

A header carefully configured at launch can silently regress later — a config change, a migration to a new reverse proxy or CDN that doesn't carry over the old header setup, a new team member unaware the configuration existed at all. Unlike a missing feature, a missing security header rarely causes an obvious, visible functional break, which makes it easy for a regression like this to go unnoticed for a long time without a recurring, deliberate check.

---

## 14. What is the risk of a security header being present but misconfigured?

### 📖 Introduction

Adding a header and having it actually provide protection are two different things — this is where the gap between them shows up most clearly.

### ✅❌ The "Checkbox" Trap

A team adds Helmet, or manually sets a `Content-Security-Policy` header, and considers the job done. But a header that's technically present while configured too permissively provides little to no real protection — despite satisfying a surface-level checklist, or even scoring reasonably on an automated scanner that primarily checks for a header's *presence* rather than deeply evaluating its actual strength.

### ⚠️ A Concrete Example

A CSP that includes `'unsafe-inline'` and `'unsafe-eval'` in its `script-src` — technically has a `Content-Security-Policy` header present, checkbox checked, but has effectively neutralized the specific protection CSP exists to provide against XSS, since it now permits exactly the kind of inline or dynamically evaluated script execution a real attacker's injected payload would also be permitted to use.

### 🕐 Why This Happens in Practice

`unsafe-inline` and `unsafe-eval` are often added under time pressure specifically to make an existing application's inline scripts or legacy code stop triggering CSP violations — a quick fix that technically resolves the errors while completely undermining the actual point of adding CSP in the first place.

### 💎 Good to Know: This Is Exactly Why the Proper Rollout Process Matters

The nonce-and-hash approach from earlier in this chapter, tested through Report-Only mode first, is the difficult-but-effective path — identifying and fixing each specific inline script individually. The easy path, reaching for a blanket exception, delivers only the appearance of protection, not the protection itself.

---

## 15. How would you roll out a strict CSP on an existing production application without breaking it?

### 📖 Introduction

This question pulls together several ideas from across this chapter — Report-Only mode, nonces, and the misconfiguration trap — into an actual, ordered process.

### 1️⃣ Audit First

Before writing any policy, inventory every actual source of scripts and styles the application currently loads: first-party bundles, every third-party script or widget currently in use (recall the third-party script discussion in the Client-Side Security chapter), and any inline scripts or event handlers already present in the codebase — often more numerous than a team initially expects, especially in an older application.

### 2️⃣ Draft and Deploy in Report-Only Mode

Based on that inventory, draft an initial, reasonably strict policy and deploy it using `Content-Security-Policy-Report-Only` first — never directly as an enforcing policy on a live, existing application. This generates real violation reports from real production traffic without breaking anything for anyone yet.

### 3️⃣ Iterate Based on Real Reports

Fix genuine violations in order of preference: move inline scripts to external files where possible, the cleanest fix that eliminates the need for any exception at all; apply nonces or hashes to inline scripts that genuinely can't be externalized; and only as a last resort, for something that truly can't be properly fixed in a reasonable timeframe, add a narrowly scoped, deliberate, ideally temporary exception — never reaching for a blanket `unsafe-inline` as the default response to a violation report.

### 4️⃣ Switch to Enforcing

Once Report-Only mode shows zero violations, or only a deliberately accepted, narrowly scoped set, across a reasonable observation period covering real traffic patterns, switch to the enforcing `Content-Security-Policy` header.

### 💎 Good to Know: This Can Take Real, Ongoing Time — Budget for It Honestly

For a large, older application with a lot of accumulated inline scripts and third-party integrations, this process is genuinely not a quick task. Treating it as a one-afternoon job is exactly what leads teams to reach for `unsafe-inline` under time pressure instead of doing it properly — budgeting realistic time for the rollout is itself a meaningful part of doing it right.

---

## 16. In production, after deploying a new CSP, legitimate users report broken functionality — how would you diagnose it?

### 📖 Introduction

This closes the chapter with a realistic post-deploy scenario, showing that Report-Only mode isn't just a pre-launch tool — it's a genuine diagnostic tool during an active incident too.

### 🚑 Immediate Mitigation, If Severe

If the breakage is widespread enough, the fastest step is reverting to the previous policy, or switching the new one back to Report-Only mode, while the actual fix is worked out — restoring functionality first, then fixing the policy properly, rather than leaving a broken production site live while debugging under pressure.

### 🔍 Diagnosis

**Browser DevTools console** — CSP violations are logged directly to the console with the specific directive that blocked something and exactly what was blocked, something like "Refused to execute inline script because it violates the following Content Security Policy directive: script-src 'self'." Usually the fastest, most direct way to identify the specific problem for an individual session.

**`Report-Only` mode plus the reporting endpoint** — switching the problematic policy back to Report-Only temporarily lets the team collect violation reports from real affected users at scale, not just whatever a single engineer happens to reproduce locally — especially valuable for issues that only affect certain user segments, browsers, or flows the team didn't personally test.

### 🕵️ Root Cause Categories

A legitimate first-party or third-party script source that simply wasn't included in the new policy's `script-src`, by far the most common cause. An inline script or event handler that wasn't caught during the audit step of the rollout process. Or a genuinely dynamic piece of content — a nonce that wasn't correctly wired through on every response, or a hash that's now mismatched because the underlying script's content changed after the hash was calculated and hardcoded.

### 🛠️ The Fix

Once the specific blocked resource or directive is identified through either diagnostic method above, correct the policy narrowly and specifically for that one actual gap — add the missing source, fix the nonce wiring — rather than reaching for a broad `unsafe-inline` or wildcard fix out of frustration under pressure. This is exactly the misconfiguration trap from earlier in this chapter, now showing up under the added stress of an active production incident, which is precisely when teams are most tempted to take that shortcut.

### 💎 Good to Know: Report-Only Mode Is a Diagnostic Tool, Not Just a Rollout Tool

Switching back to Report-Only mode temporarily, even after a policy is already live and enforcing, is a legitimate and valuable way to gather better data during an active investigation like this one — the same mechanism doing double duty for both careful rollout and post-incident debugging.
