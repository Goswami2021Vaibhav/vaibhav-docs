---
title: Client-Side Security
description: What the browser can and can't protect against, and CSP.
sidebar_position: 6
---

# Client-Side Security

## 1. What is the Same-Origin Policy, and how does it form the foundation of browser security?

### 📖 Introduction

A surprising number of things covered in earlier chapters — CORS, cookie `SameSite` attributes, CSRF — all exist *because of* one single browser rule. It's worth understanding that rule directly before looking at anything built on top of it.

### 🔒 What the Same-Origin Policy Is

The Same-Origin Policy (SOP) is a browser rule stating that a script running on one origin can only access data belonging to that *same* origin — its own DOM, its own cookies, its own storage, the content of responses it fetches — not another origin's, by default.

### 🧩 What Counts as an "Origin"

An origin is the combination of **scheme, host, and port**, and all three must match exactly:

- `https://example.com` and `http://example.com` are different origins (scheme differs).
- `https://example.com` and `https://api.example.com` are different origins (host differs, even though they're both "example.com" conceptually).
- `https://example.com` and `https://example.com:3000` are different origins (port differs).

### 🏛️ Why This Is Foundational

Without SOP, any website you visited could freely read your email inbox's DOM in another tab, steal cookies belonging to your bank, or read whatever page you happened to have open elsewhere. SOP is what makes it safe to have a dozen unrelated sites open in different tabs at once, trusting that none of them can reach into any of the others. CORS, covered in the API Security and Security Headers chapters, is literally the mechanism a server uses to deliberately *relax* this default in a controlled, explicit way.

### 💎 Good to Know: Nearly Everything Else in This Chapter Builds on SOP

Every remaining question in this chapter — third-party scripts, `postMessage`, iframe sandboxing — is really about what happens at the edges of SOP: where it protects you automatically, where it doesn't apply at all, and where an application deliberately has to punch a small, controlled hole through it.

---

## 2. What is the browser sandbox model, and how does it limit what a webpage's JavaScript can access?

### 📖 Introduction

SOP limits what a script can access *across origins*. The sandbox model is the broader rule limiting what any script — even one running on your own trusted origin — can access on the user's actual machine.

### 📦 What the Sandbox Restricts

JavaScript running in a browser tab has no direct filesystem access, no access to other running programs or processes on the operating system, and no arbitrary network access beyond what `fetch`/`XHR`/`WebSocket` provide — all of which are further constrained by SOP and CORS on top of the sandbox itself.

### 🆚 Why This Matters

This is fundamentally different from a desktop application, or a Node.js script running server-side, both of which typically *do* have full filesystem and OS access. It's precisely why simply visiting a malicious webpage is nowhere near as dangerous, ordinarily, as running an untrusted executable downloaded from the internet — the sandbox is what makes "just browsing" a reasonably safe default activity in the first place.

### ⚠️ What's Still Possible Within the Sandbox

The sandbox doesn't mean nothing bad can happen — a script can still read and modify the current page's DOM, read cookies and storage for its own origin, and make requests subject to SOP and CORS. That's still enough to do real damage, as the entire XSS section of the previous chapter demonstrates — it's just fundamentally bounded compared to a full operating-system-level compromise.

### 💎 Good to Know: Sandbox Escapes Are a Browser-Vendor Concern, Not an App Developer's

Occasionally, a genuine vulnerability in a browser engine itself allows code to escape this sandbox entirely — a serious class of bug, but one that browser vendors are responsible for patching, not something a web application developer defends against directly. As an app developer, you build on top of the assumption that the sandbox holds; your job is defending what's still reachable *within* it.

---

## 3. What are the security risks of loading third-party scripts into your application?

### 📖 Introduction

The sandbox model just covered applies equally to every script on a page, regardless of who wrote it — and that's exactly what makes third-party scripts worth thinking about carefully.

### ⚠️ The Core Risk

A `<script>` tag loaded from a third party runs with the exact same privileges as your own first-party code — full access to the page's DOM, any cookie not marked `HttpOnly`, `localStorage`, the ability to make network requests, and the ability to intercept form submissions. There's no automatic sandboxing between "your code" and "their code" once both are loaded into the same page.

### 🎯 Realistic Failure Scenarios

A compromised analytics or advertising script could begin silently exfiltrating form data or session tokens — a client-side version of the supply-chain risk covered for server-side dependencies in a later chapter. A legitimate, well-intentioned vendor could simply get breached themselves, with their script replaced by malicious code that now runs on *your* site, for *all* your users, without you having changed a single line of your own code.

### 🛡️ Mitigations

Load only third-party scripts you genuinely need, from vendors with a real trust track record. Pin to specific versions rather than always pulling "latest." Use Subresource Integrity, covered next, to guarantee a script hasn't been silently tampered with. Use a Content Security Policy, covered in depth in the Security Headers chapter, to restrict which script sources are even allowed to load on the page at all, as a backstop.

### 💎 Good to Know: This Is Supply-Chain Risk, Just in the Browser Instead of `npm`

"Code you didn't write, running with full trust" is the exact same underlying problem whether it's a dependency pulled in by `npm install` or a third-party `<script>` tag loaded directly into the page — the Dependency & Supply Chain Security chapter covers the server-side version of this same lesson in more depth.

---

## 4. What is Subresource Integrity, and how does it protect against a compromised CDN?

### 📖 Introduction

This is the concrete technical answer to the trust problem raised in the previous question — a way to verify a third-party file wasn't tampered with, rather than just hoping it wasn't.

### 🔐 What SRI Is

The `integrity` attribute on a `<script>` or `<link>` tag contains a cryptographic hash of the exact file content the page expects to receive.

```html
<script
  src="https://cdn.example.com/library@2.1.0.min.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>
```

### ✅ How It Defends Against a Compromised CDN

When the browser downloads the file, it computes the hash of what it actually received and compares it against the declared `integrity` value *before* executing anything. If a CDN serving that library gets compromised and the file is silently swapped for a malicious version, every browser loading the page will detect the mismatch and simply refuse to execute the tampered file — rather than unknowingly running whatever the CDN happens to be serving on any given day.

### 💎 Good to Know: SRI Only Works for Predictable, Static Content

SRI requires knowing the exact expected file content in advance, which makes it a poor fit for scripts that are dynamically generated or personalized per visitor — a real limitation for some analytics or advertising scripts, since their content legitimately changes between requests. It's most useful, and most commonly used, for versioned, static library files served from a public CDN — a genuine gap worth noting when a vendor's script can't support it at all.

---

## 5. What is the security difference between `localStorage`, `sessionStorage`, and cookies?

### 📖 Introduction

The Session & Token Security chapter covered this specifically for JWTs — this question is the broader, general version of the same comparison, since it applies to any sensitive client-side data, not only tokens.

### 💾 `localStorage`

Persists indefinitely until explicitly cleared. Accessible from any JavaScript running on the page — meaning any XSS bug anywhere, including one introduced by a compromised third-party script from earlier in this chapter, can read it directly, with no additional exploit needed beyond the XSS itself. Scoped per-origin, and not automatically attached to outgoing requests.

### ⏳ `sessionStorage`

The same JavaScript accessibility, and the same XSS exposure, as `localStorage` — but scoped to a single tab and cleared the moment that tab closes. This shrinks the *window* of exposure compared to `localStorage`, though it doesn't change the fundamental fact that any XSS can still read it while that tab is open.

### 🍪 Cookies

Can be marked `HttpOnly`, meaning JavaScript genuinely cannot read it at all — a real, structural difference from either storage option above. Automatically attached to every matching request by the browser, which is exactly what creates the CSRF surface covered in the Session & Token Security and Common Web Vulnerabilities chapters. Comes with built-in expiration, domain, and path scoping.

### ⚠️ Why `localStorage` Is Discouraged for Tokens and PII

Any XSS anywhere on the page can exfiltrate everything in `localStorage` with a single line: `localStorage.getItem("token")`. An `HttpOnly` cookie is immune to that specific read, even in the presence of that exact same XSS bug — the vulnerability still exists, but it can no longer reach the token through this particular path.

### 💎 Good to Know: None of These Three Are Actually "Safe" in an Absolute Sense

Nothing here is encrypted by the browser. Data stored client-side, in any of these three forms, should be treated as potentially visible to a sufficiently motivated attacker under *some* circumstance — physical device access, a malicious browser extension, or an XSS bug. The real question is which specific attack vectors each option is exposed to, not whether any single option is fully immune to all of them.

---

## 6. What is the `postMessage` API, and what security mistakes commonly occur when using it?

### 📖 Introduction

`postMessage` is a deliberate, narrow exception to the Same-Origin Policy from the start of this chapter — which means the safety SOP would otherwise provide automatically has to be re-implemented by hand wherever it's used.

### 📬 What It Is

`postMessage` lets two different windows, frames, or tabs — including ones from *different* origins — send messages directly to each other, for cases where cross-origin communication is genuinely needed on purpose. A common legitimate example: an embedded third-party payment iframe needs to tell the parent page "payment succeeded."

```js
// Sending a message to an embedded iframe
iframeRef.contentWindow.postMessage({ type: "PAYMENT_SUCCESS" }, "https://payments.example.com");

// Receiving a message
window.addEventListener("message", (event) => {
  if (event.origin !== "https://payments.example.com") return; // reject anything else
  handlePaymentEvent(event.data);
});
```

### ⚠️ Common Mistakes

- **On send** — using `"*"` as the target origin, meaning "deliver this to whatever origin happens to be there, I don't care which." If the embedding context ever changes unexpectedly — the iframe gets navigated somewhere else, or gets embedded on a page it wasn't meant to appear on — sensitive data in the message gets sent straight to whatever origin is actually there, malicious or not.
- **On receive** — forgetting to check `event.origin` before acting on a received message at all. Since any page that obtains a reference to your window (through `window.open`, or by embedding your page in an iframe) can send it a `postMessage`, skipping the origin check means literally any page on the internet can send fake messages that your code will blindly trust and act on.

### 💎 Good to Know: Opting Out of SOP Means Opting Into Manual Responsibility

Because `postMessage` deliberately steps outside what SOP would otherwise enforce automatically, both the sending and receiving code have to do, by hand, exactly the kind of origin-checking SOP would normally provide for free. Skipping either side isn't a small oversight — it's removing the entire safety mechanism this API was designed around.

---

## 7. What is iframe sandboxing, and what capabilities does the `sandbox` attribute let you selectively control?

### 📖 Introduction

Embedding content you don't fully trust — user-generated HTML, an uploaded file preview, a third-party widget — is a common, legitimate need. The `sandbox` attribute is the browser's purpose-built tool for containing that content safely.

### 🏖️ What It Does by Default

Adding a bare `sandbox` attribute to an `<iframe>`, with no values at all, applies a broad set of restrictions at once: it disables script execution, form submission, popups, and top-level navigation, and treats the framed content as coming from a unique, opaque origin — unable to access the parent page's DOM regardless of whether it's technically the same origin or not.

```html
<iframe src="/user-generated-preview.html" sandbox></iframe>
```

### 🔓 Selectively Re-Enabling Capabilities

Specific capabilities can be added back individually, as space-separated values: `allow-scripts` lets JavaScript run again, `allow-same-origin` treats the frame as its real origin instead of an opaque one, `allow-forms`, `allow-popups`, and others exist for their respective capabilities — each opted back in only when genuinely needed.

### 🧪 A Realistic Use Case

Embedding untrusted, user-submitted content — a code playground rendering a user's submitted HTML/JS, or a preview of an uploaded HTML file — inside a heavily restricted sandboxed iframe means that even fully malicious content stays contained, unable to affect the rest of the page.

### 💎 Good to Know: `allow-scripts` and `allow-same-origin` Together Can Defeat the Whole Point

Enabling both flags on the same iframe is a well-known way to accidentally undo the sandbox's own protection: with script execution re-enabled *and* the origin no longer treated as opaque, the framed content can use its regained ability to run code to reach back into a now-genuinely-same-origin context — effectively reconstructing full access. These two flags should rarely, if ever, be combined for content that's actually untrusted.

---

## 8. What is the risk of hardcoding secrets into frontend JavaScript bundles?

### 📖 Introduction

This mirrors the secret-leaking question from the API Security chapter, but it's worth stating directly for the frontend specifically, since it's an easy trap to fall into without realizing it.

### 👁️ Anything in the Bundle Is Public

Any value bundled into frontend JavaScript ships to every single visitor's browser and is fully readable — through view-source, the browser's devtools Network or Sources tab, or simply downloading the deployed bundle file directly. This is true no matter how deeply the value is buried in the code, or how unlikely it seems that someone would go looking.

### 🚫 Why Obfuscation Doesn't Help

Minifying or obfuscating a JavaScript bundle — renaming variables, stripping whitespace and comments — makes the code harder for a *human* to casually read. It does nothing to stop a determined attacker, or even a simple automated script, from executing the code as-is, inspecting the network requests it makes, or searching the deployed bundle text for anything shaped like an API key. Obfuscation is a readability speed bump, not a security boundary, and it can be reversed with often surprisingly little effort.

### 💎 Good to Know: A Frontend Bundle Deserves the Same Caution as a Git Commit

The moment a bundle is deployed, it's functionally just as public as a file committed to a public git repository. The question "will this end up in the JS bundle?" deserves exactly the same level of caution as "will this end up in git history?" from the API Security chapter — both are, in practice, permanent and public the instant they happen.

---

## 9. Why should sensitive computations, feature flags, or hidden business logic never be trusted to live only on the client side?

### 📖 Introduction

This is the general principle underneath several of this chapter's more specific examples — worth stating on its own, since it comes up constantly in real applications.

### 🖥️ The Browser Is a Machine the User Fully Controls

Anything running in the browser is, by definition, running on a device the person using it has complete control over. They can open devtools and modify running JavaScript in real time, intercept and edit any outgoing network request before it's sent, or simply skip your frontend entirely and call your API directly with a tool of their own choosing.

### ⚠️ Realistic Failure Patterns

A "premium feature" gated only by a client-side check like `if (user.isPremium)`, with no matching enforcement on the server, is trivially bypassed by editing that value in devtools. A price calculated entirely in JavaScript and simply submitted as a final total is trivially manipulated to submit whatever total the "customer" wants. A feature hidden only by CSS (`display: none`), while the underlying functionality and API remain fully reachable, isn't actually restricted at all — just visually hidden from people who never bothered to look.

### 💎 Good to Know: Client-Side Logic Isn't the Problem — Treating It as a Security Boundary Is

Client-side checks are genuinely good for user experience: instant feedback, hiding a button a typical user shouldn't normally need to see. The mistake isn't having that logic at all — it's mistaking it for the actual security boundary, instead of what it really is: a convenience layer sitting in front of a server that has to independently enforce the real rule regardless of what the client claims.

---

## 10. What is the risk profile of client-side routing and authorization in a Single Page Application?

### 📖 Introduction

This is the previous question's principle, applied to one of the most common places it actually shows up in a real MERN application: the frontend router.

### 🚧 The Risk

A router deciding "don't render the `/admin` route unless `user.role === 'admin'`" is a UI decision, not a security control. It stops an unauthorized user from *seeing* the admin page rendered in their browser — but it does nothing at all to stop that same user from calling the underlying `/api/admin/...` endpoints directly, through devtools, `curl`, or a script, completely bypassing the router's check, since the router's code never runs anywhere the server can enforce it.

### 📦 Why Hiding a Route Doesn't Hide Anything Real

The same bundled JavaScript ships to *every* user regardless of role. The admin route's component code, and the logic that decides whether to render it, are both fully present and inspectable in every single visitor's downloaded bundle — whether or not that particular visitor is actually an admin. Hiding a route from the router removes it from the UI; it doesn't remove the underlying capability from the API that route calls.

### 💎 Good to Know: This Is "Security by Design" From Chapter 1, in Its Most Common Real Form

This is exactly why broken access control, from the Authentication & Authorization chapter, has to be enforced independently at *every single API endpoint*, regardless of what any frontend router claims to protect. The frontend router is a convenience for legitimate users navigating the app normally — the API's own server-side authorization checks are the actual, only real security boundary.

---

## 11. What is the risk of using `eval()`, `Function()`, or `innerHTML`/`dangerouslySetInnerHTML` with untrusted input?

### 📖 Introduction

These are among the most direct, deliberate ways to accidentally hand an attacker exactly what they want — a way to run their own code inside your page.

### ⚠️ What Each One Does

`eval()` executes a string as arbitrary JavaScript with full access to the surrounding scope. `new Function(...)` compiles and executes a string as code in a similar way, with slightly different scoping but the same fundamental risk. `innerHTML` (and React's `dangerouslySetInnerHTML`) parses a string as raw HTML and inserts it directly into the DOM — including any embedded event handlers or script-equivalent content it contains.

### 💥 The Risk With Untrusted Input

If any part of the string passed to these ever includes attacker-controlled data, the result is a direct, self-inflicted code-execution or DOM-injection pathway — this is, quite literally, DOM-based XSS from the previous chapter, in its most direct possible form. `eval(userInput)` is about as close as a single line of code can get to "please run whatever the attacker wants."

```jsx
// Vulnerable: renders whatever HTML the comment contains, unescaped
<div dangerouslySetInnerHTML={{ __html: comment }} />

// Safe: JSX text interpolation escapes automatically
<div>{comment}</div>

// If raw HTML genuinely needs to be rendered, sanitize it first
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment) }} />
```

### 💎 Good to Know: The Alarming Name Is a Deliberate Design Choice

React's team named the prop `dangerouslySetInnerHTML`, rather than something neutral like `rawHTML`, specifically to make a developer pause and think twice before reaching for it. It's a good example of an API being deliberately designed to discourage its own misuse, rather than assuming developers will simply remember the risk on their own.

---

## 12. How should a Single Page Application handle logout so sensitive data doesn't linger?

### 📖 Introduction

"Logout" often just means "delete the token" in a developer's mental model — but a SPA accumulates several other places sensitive data can quietly survive that single step.

### 🕳️ Where Data Can Linger

In-memory application state (Redux, Zustand, plain React state) can keep previously fetched user data around until a full page reload happens, regardless of whether the token itself was cleared. The browser's back/forward cache can restore a fully rendered, still-populated page exactly as it looked before logout, without ever re-running the app's JavaScript. A Service Worker's cache may still be serving previously cached API responses containing the last user's data. The browser's ordinary back button can show a cached rendering of what looked like an authenticated page.

### ✅ A Proper Logout Checklist

Clear the authentication token or session, including server-side revocation as covered in the Session & Token Security chapter's device-management question. Clear *all* in-memory application state, not just the token — often via a full state reset or hard reload rather than trying to selectively clear individual pieces. Clear any Service Worker caches holding user-specific data. Consider `Cache-Control: no-store` on sensitive API responses, so the browser's own HTTP cache doesn't retain them either. Redirect to a neutral page after logout, rather than relying on the current page's existing state to simply "look" logged out.

### 💎 Good to Know: This Is a Real, Common Bug — Not a Theoretical Edge Case

A genuinely common real-world scenario: on a shared or public computer, User A logs out, and User B — using the back button moments later — briefly sees a flash of User A's still-cached dashboard before the app's own JavaScript re-checks authentication state and redirects. This exact gap has shown up in real applications, not just as a hypothetical concern in a security checklist.

---

## 13. In production, a marketing team wants to add a new third-party script to every page — what security review would you want before approving it?

### 📖 Introduction

This closes the chapter by turning the third-party script risk from earlier back into a concrete, realistic approval decision — the kind of request that arrives constantly in a real product team.

### 🔍 What the Script Actually Does

What permissions or access does it actually need — does it read the DOM, set its own cookies, make outbound network requests to its own servers? Is the vendor reputable, with an established track record, or a newer, less-scrutinized service? Has the vendor had security incidents before — this isn't hypothetical: real, documented incidents exist of exactly this pattern, where a chat widget or analytics vendor's script got hijacked and silently infected every site that had embedded it.

### 🛠️ Technical Review

Can the script be loaded with Subresource Integrity, from earlier in this chapter, if it's a static, versioned file? Many marketing and analytics scripts unfortunately can't support this at all, since they're often dynamically generated per visitor — worth flagging explicitly as a real gap, not just accepting it silently. Does it genuinely need to load on every single page, or only specific ones — a narrower footprint means a smaller blast radius if something does go wrong later. Will it require a Content Security Policy update, covered in the Security Headers chapter, to explicitly allow its source — and does that change meaningfully weaken the policy's protection elsewhere on the site?

### 📋 Process, Not Just a One-Time Technical Check

This shouldn't be a purely technical, one-time decision. A documented approval process — who signs off, and whether approved scripts get periodically re-reviewed rather than just approved once and forgotten — prevents "let's just add this one quickly" from quietly becoming an unmonitored, ever-growing pile of third-party code with full page access, accumulated one seemingly small addition at a time.

### 💎 Good to Know: This Deserves the Same Scrutiny as Adding a New Server Dependency

Every third-party script added to a page effectively extends the same level of trust given to your own code to that vendor — and to anyone who ever compromises them. That's exactly the same category of decision as adding a new `npm` dependency to a server, covered in depth in the Dependency & Supply Chain Security chapter, and it deserves the same level of scrutiny, not less just because the request arrived from a marketing team instead of an engineer.
