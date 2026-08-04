---
title: Common Web Vulnerabilities
description: XSS, CSRF, SQL injection, and the OWASP Top 10 staples.
sidebar_position: 5
---

# Common Web Vulnerabilities

## 1. What is Cross-Site Scripting (XSS), and what are the three main types?

### 📖 Introduction

XSS is one of the oldest and still most common web vulnerabilities, and it comes in three distinct flavors that differ in *where the malicious script comes from* and *how it reaches the victim*.

### 💉 What XSS Is

Cross-Site Scripting happens when an attacker manages to get their own JavaScript to run inside a victim's browser, in the context of a trusted site the victim is logged into. Once that script runs, it has full access to whatever the page's own JavaScript would have — reading the DOM, making requests as the logged-in user, and reading any cookie not marked `HttpOnly` (from the Session & Token Security chapter).

### 💾 Stored XSS

The malicious script is permanently saved on the server — in a comment, a profile bio, a product review — and served to *every* visitor who views that content. This is the most dangerous variant, because it requires no trickery to deliver: anyone who simply browses to the affected page is automatically affected.

### 🪃 Reflected XSS

The malicious script comes from the current request itself, usually a URL query parameter, and gets immediately reflected back into the response's HTML without ever being stored. This requires tricking a specific victim into clicking a crafted link — the attack only fires for whoever follows that particular link.

### 🌐 DOM-Based XSS

This variant never touches the server at all. Vulnerable client-side JavaScript reads something attacker-controlled directly from the page — `location.hash`, `document.URL` — and writes it unsafely into the DOM:

```js
// Vulnerable: whatever's in the URL fragment gets injected as raw HTML
document.getElementById("welcome").innerHTML = location.hash.substring(1);
// A link like yoursite.com/#<img src=x onerror=alert(document.cookie)>
// executes entirely in the browser — the server never even sees the payload.
```

### 💎 Good to Know: The Type Changes the Delivery, Not the Impact

Whether it's stored, reflected, or DOM-based, a successful XSS gives an attacker the same thing in the end: arbitrary JavaScript running inside a real, authenticated user's session. The type matters for figuring out *how* it happened and *how many people it can reach* — not for how serious it is once it does.

---

## 2. What is output encoding/escaping, and why is it the primary defense against XSS?

### 📖 Introduction

Preventing XSS comes down to one core idea, and it's worth being precise about it, since "sanitize the input" is a common but incomplete way to describe it.

### 🔤 What Output Encoding Is

Output encoding converts characters that have special meaning *in the context data is being rendered into* into their safe, literal equivalent — `<` becomes `&lt;`, so a browser displays the text "less than" instead of interpreting it as the start of a tag. Crucially, this happens at the point the data is actually *output*, not when it's first received.

### ⚖️ Why Encoding Beats Sanitizing Input Alone

Stripping "dangerous" characters at the point input is received is fragile, because what counts as dangerous depends entirely on *where that data ends up being used later* — the same string might be safe inside an HTML text node, dangerous inside an HTML attribute, dangerous inside a `<script>` block, and dangerous again inside a URL, each for different reasons and requiring different escaping rules. Data also frequently flows through multiple contexts, or gets reused somewhere the original input-time sanitization never anticipated. Encoding at the point of output sidesteps all of that — it's applied exactly where the data lands, matched precisely to that context.

```jsx
// React escapes this automatically — safe regardless of what userBio contains
<p>{userBio}</p>

// Bypasses that protection entirely — exactly as dangerous as manual innerHTML
<p dangerouslySetInnerHTML={{ __html: userBio }} />
```

### 💎 Good to Know: Sanitization Still Has a Real Job — Just a Narrower One

Sanitization earns its place specifically when you *want* to allow a restricted subset of rich content — a comment system that permits basic formatting, for instance. The right tool there is a library like DOMPurify, which works by *allowlisting* known-safe tags and attributes rather than trying to blocklist dangerous ones, since blocklists are notoriously easy to bypass with an unanticipated encoding trick.

---

## 3. What is a Content Security Policy, and how does it act as a defense-in-depth layer against XSS?

### 📖 Introduction

Output encoding is the primary defense against XSS — but "primary" implies it can fail, and CSP is what catches that failure when it happens.

### 🛡️ What CSP Does, Briefly

CSP is a response header that tells the browser which sources of scripts, styles, and other resources are allowed to load and execute on the page. The full mechanics — directives, nonces, reporting — are covered in depth in the Security Headers chapter; what matters here is the role it plays specifically against XSS.

### 🚧 The Second Layer

If an attacker somehow does manage to inject a `<script>` tag or an inline event handler — a gap the encoding discussed in the previous question missed — a well-configured CSP without `unsafe-inline` will simply refuse to *execute* it. The injected script didn't come from an allowed source and doesn't carry a valid nonce, so the browser blocks it at the execution stage, entirely independent of whether the encoding upstream succeeded or failed.

### 💎 Good to Know: This Is Defense in Depth, Made Concrete

This is a direct, working example of the defense-in-depth principle from the first chapter: output encoding is the primary layer, and CSP is the independent second layer that still catches the problem even when the first one has a gap somewhere a developer missed.

---

## 4. What is Cross-Site Request Forgery (CSRF), and what defenses mitigate it?

### 📖 Introduction

CSRF exploits a browser behavior that's completely reasonable on its own — automatically attaching cookies to requests — turned against a user by a page they never meant to trust.

### 🎣 The Mechanism

An attacker's page contains a hidden, auto-submitting form (or even just an `<img>` tag) pointing at a state-changing endpoint on a trusted site — `your-bank.com/transfer?to=attacker&amount=1000`. When a victim who's already logged into `your-bank.com`, with a valid session cookie, visits the attacker's page, the browser automatically attaches that cookie to the resulting cross-origin request — cookies are attached based on the request's *destination*, not which page initiated it. The server receives what looks like a fully valid, authenticated request, and executes it.

### 🛡️ Defenses

- **CSRF tokens** — the server issues an unpredictable, per-session token that must be echoed back on state-changing requests. The attacker's page can trigger the request, but it can't read or guess the correct token value, since the same-origin policy blocks it from reading anything from the trusted site.
- **`SameSite` cookies** — `Strict` or `Lax`, covered in the Session & Token Security chapter, stops the browser from attaching the cookie to many cross-site request types in the first place, closing the hole before it ever reaches the server.
- **Checking `Origin`/`Referer`** — a supplementary check confirming the request actually originated from your own site.

### 💎 Good to Know: Layer More Than One of These

`SameSite=Lax` alone blocks the overwhelming majority of real-world CSRF in modern browsers, but older browsers and certain edge cases (a `GET`-based state change, for instance) can slip past it. Keeping CSRF tokens as well, even though `SameSite` handles most cases, is the same defense-in-depth principle showing up yet again.

---

## 5. What is SQL injection, and why do parameterized queries prevent it while string concatenation doesn't?

### 📖 Introduction

SQL injection is a textbook example of trusted structure getting mixed with untrusted data — and the fix is really about keeping those two things strictly separate.

### 💉 The Mechanism

Unsanitized user input concatenated directly into a SQL query string lets an attacker inject their own SQL syntax, changing what the query actually does. A classic example: a login query built by inserting a `username` value directly into `SELECT * FROM users WHERE username = '...'` — if that value is `' OR '1'='1`, the resulting query's `WHERE` clause becomes always-true, potentially returning every row and bypassing authentication entirely.

```js
// Vulnerable: user input becomes part of the SQL syntax itself
const query = `SELECT * FROM users WHERE username = '${username}'`;
connection.query(query);

// Safe: username is sent as a separate value, never as SQL text
connection.query("SELECT * FROM users WHERE username = ?", [username]);
```

### 🔒 Why Parameterization Actually Works

With a parameterized query, the database driver sends the query's *structure* and the user-supplied *values* to the database engine as two entirely separate things. The database never interprets a parameter's contents as SQL syntax, no matter what characters it contains — there's no string being built and re-parsed at all, so there's nothing for an injected quote or semicolon to break out of.

### 💎 Good to Know: An ORM Doesn't Automatically Save You

ORMs like Sequelize use parameterized queries under the hood by default when you use their normal query-building methods. But calling `sequelize.query()` with a raw, hand-built string instead of its safe placeholder syntax reintroduces the exact same vulnerability — the ORM's safety only applies to the parts of it you actually use as intended.

---

## 6. What is NoSQL injection, and how does it manifest differently in MongoDB compared to classic SQL injection?

### 📖 Introduction

The underlying idea — untrusted input changing a query's intended logic — carries over from SQL injection, but the actual mechanism in a document database like MongoDB looks quite different.

### 🔀 Why It's Different

SQL injection exploits *syntax* — breaking out of a string literal within a text-based query language. MongoDB queries, by contrast, are built from plain JavaScript objects, not query strings. NoSQL injection typically exploits the fact that if user input is passed directly as an object rather than a expected primitive value, an attacker can inject MongoDB's own **query operators** in place of a plain value.

```js
// Vulnerable: assumes req.body.password is always a plain string
const user = await User.findOne({
  username: req.body.username,
  password: req.body.password,
});
```

If the request body is sent as JSON with `"password": { "$ne": null }` instead of a normal string, the query effectively becomes "find a user where the password is not equal to null" — true for any user with a password set at all, bypassing authentication without knowing any actual password.

### 🛠️ The Fix

Explicitly validate the *type* of expected fields before they ever reach a query — a password field must be a string, and anything else (an object, an array) should be rejected outright. A schema validation library like Zod or Joi, from the API Security chapter, does this naturally as a side effect of validating shape. A library like `express-mongo-sanitize` offers a more targeted fix, stripping any `$`-prefixed keys from user-supplied input before it's used in a query.

### 💎 Good to Know: This Is Exactly Why API-Boundary Validation Matters So Much in a MERN Stack

Express parses incoming JSON bodies into real JavaScript objects by default — which is precisely what makes this attack possible if types aren't validated. This is a very concrete, MongoDB-specific reason the input-validation question from the previous chapter matters as much as it does.

---

## 7. What is command injection, and how does it lead to full server compromise?

### 📖 Introduction

This is the same underlying pattern as SQL injection — trusted structure mixed with untrusted data — applied to a different interpreter: the operating system's shell.

### 💻 The Mechanism

Passing unsanitized user input into a function that spawns a shell command lets an attacker inject additional shell syntax alongside the intended command. A feature that converts an uploaded file using `exec("convert " + filename + " output.png")` is vulnerable: an attacker who controls `filename` can supply something like `"; rm -rf / ;"` or `"$(cat /etc/passwd)"`, and the shell interprets those extra characters as additional commands to execute, not as part of a filename at all.

```js
const { exec, execFile } = require("child_process");

// Vulnerable: filename becomes part of a string the shell interprets
exec(`convert ${filename} output.png`);

// Safe: arguments are passed as an array, no shell ever parses the string
execFile("convert", [filename, "output.png"]);
```

### 🔒 Why `execFile`/`spawn` Fix It

`execFile` (or `spawn`) passes arguments as an array directly to the target program, with no shell involved to interpret the string at all. Shell metacharacters in the input are just literal characters as far as the target program is concerned — there's no shell syntax layer left for an attacker to inject into.

### 💎 Good to Know: Same Principle as SQL Injection, Different Interpreter

Keep the fixed command structure and the user-supplied data strictly separate, rather than building one interpretable string out of both — this is the exact same lesson as parameterized SQL queries, just applied to the shell instead of a database. Whenever a shell isn't strictly necessary, avoiding it entirely removes the risk category altogether.

---

## 8. What is Server-Side Request Forgery (SSRF), and why is it especially dangerous in cloud environments?

### 📖 Introduction

SSRF turns a server's own network access — something it needs to function — into a weapon an attacker can point wherever they want.

### 🌐 The Mechanism

A feature that fetches a URL supplied by a user — "import an image from this URL," a configurable webhook target, a service that renders a given page to PDF — is vulnerable if the server doesn't restrict *which* URLs it's willing to fetch. An attacker supplies an internal address instead of a legitimate external one, and the server, which typically has network access the public internet doesn't (reaching internal services, internal admin panels, or the server's own infrastructure), makes that request on the attacker's behalf — often returning the response straight back to them.

```js
// Vulnerable: fetches whatever URL the client provides, no restriction at all
app.post("/api/fetch-preview", async (req, res) => {
  const response = await axios.get(req.body.url);
  res.json({ preview: response.data });
});
```

### ☁️ Why This Is Especially Severe in the Cloud

Cloud providers expose an internal-only **instance metadata service** at a fixed, well-known address — `http://169.254.169.254` on AWS — reachable only from within the running instance itself, with no authentication required by design. It can return sensitive information, including temporary IAM credentials for whatever role the server is running as. An SSRF-vulnerable server pointed at that address by an attacker can be tricked into fetching and returning those credentials — effectively handing the attacker working access keys to the cloud account itself.

### 💎 Good to Know: This Vulnerability Is Invisible in a Local Dev Environment

There's no metadata service to exploit on a developer's laptop, so testing locally alone gives no indication of how severe this bug actually becomes in production cloud infrastructure. Fixing it means validating the *resolved* URL or IP against an allowlist of expected external hosts, and explicitly blocking private and link-local IP ranges — not just checking that the input "looks like a normal URL."

---

## 9. What is XML External Entity (XXE) injection?

### 📖 Introduction

XXE exploits a legitimate, if now widely considered dangerous-by-default, feature of the XML specification itself.

### 📄 The Mechanism

XML supports **external entities** — a way for a document to define a custom reference pointing at an external resource (a local file, or a URL) and then use that reference elsewhere in the document. If an application parses attacker-supplied XML with this feature enabled — which many XML parsers historically did by default — the parser will dutifully fetch or read whatever the entity points to and substitute it directly into the parsed output.

An entity defined as pointing to `file:///etc/passwd`, then referenced somewhere the application later displays back to the attacker, leaks the contents of a file the attacker should never have had access to. Pointing the same entity at an internal URL instead achieves SSRF, from the previous question, through this exact same mechanism.

### 🛠️ The Fix

Disable external entity and DTD processing entirely in the XML parser's configuration. Nearly every modern XML parsing library supports this as a simple config flag, and it's genuinely unnecessary for the vast majority of applications that only use XML for plain, structured data exchange.

### 💎 Good to Know: XXE Shows Up in Unexpected Places

XXE has become less common as JSON has largely replaced XML for typical APIs, but it's still very real anywhere XML processing still happens — and that's more places than it might seem. SVG files are XML. Microsoft Office documents (`.docx`, `.xlsx`) are ZIP archives full of XML internally. A file upload feature that "just" accepts images or documents can be an XXE vector without the word "XML" appearing anywhere in that feature's description.

---

## 10. What is insecure deserialization?

### 📖 Introduction

This vulnerability class is less central to a typical Node.js codebase than the others in this chapter, but it's worth recognizing by name, since it shows up constantly in real-world security news and the underlying idea is worth understanding.

### 🔄 What Deserialization Is

Deserialization is converting a serialized representation — a string or byte stream — back into a live, in-memory object. `JSON.parse` is a form of deserialization, but a notably safe one: it only ever produces plain data (objects, arrays, strings, numbers), never live class instances with methods or behavior attached.

### ⚠️ Why Untrusted Deserialization Is Dangerous

In languages and frameworks with richer serialization formats than JSON — Java, PHP, or Python's `pickle` module, most notably — the deserialization process itself can be manipulated by a crafted payload to instantiate arbitrary objects, or to trigger a chain of method calls as an unintended side effect of reconstructing the object graph (sometimes called a "gadget chain"), ultimately leading to arbitrary code execution on the server.

### 🟨 The Node.js Angle

Plain `JSON.parse` doesn't have this specific vulnerability class, which is why it's a lower-frequency risk in a typical MERN stack. But the risk reappears the moment a Node application reaches for something beyond plain JSON — a library like `node-serialize`, or code that uses `eval()` or Node's `vm` module to parse data — which reintroduces exactly this danger in a JavaScript context.

### 💎 Good to Know: Prefer Plain JSON for Untrusted Data, Always

If there's ever a genuine need for a richer serialization format for untrusted input, use a well-vetted library specifically designed to be safe against this, and validate the resulting structure afterward rather than trusting it implicitly — but for the overwhelming majority of applications, sticking to plain JSON for anything touching untrusted input sidesteps this entire vulnerability class.

---

## 11. What is path traversal, and how does it exploit poorly validated file-path input?

### 📖 Introduction

Path traversal is another instance of the same broad lesson running through this chapter: never trust that user input means what it superficially looks like.

### 📁 The Mechanism

A feature that builds a file path using user-supplied input — `"/files/" + req.query.filename` — is vulnerable if that filename isn't validated. An attacker supplies `../../etc/passwd` instead of a real filename, and the resulting concatenated path walks *up and out* of the intended directory, reading a completely different, sensitive file elsewhere on the filesystem.

```js
const path = require("path");

// Vulnerable: the ".." segments are honored, walking outside the intended folder
app.get("/files/:name", (req, res) => {
  res.sendFile(path.join(__dirname, "uploads", req.params.name));
});

// Fixed: resolve the final path and verify it's still inside the allowed folder
app.get("/files/:name", (req, res) => {
  const baseDir = path.resolve(__dirname, "uploads");
  const requestedPath = path.resolve(baseDir, req.params.name);
  if (!requestedPath.startsWith(baseDir)) {
    return res.status(400).json({ error: "Invalid path" });
  }
  res.sendFile(requestedPath);
});
```

### 💎 Good to Know: `path.join` Alone Doesn't Fix This

`path.join` normalizes `..` segments — it doesn't reject them. The fix requires an extra step afterward: resolve the final absolute path and explicitly verify it still starts with the intended base directory, rejecting anything that doesn't. Validating the *final result*, not just the raw input string, is the pattern to remember here — the same principle applies to the SSRF URL-validation question earlier in this chapter.

---

## 12. What is an open redirect vulnerability, and how can it be chained with phishing or OAuth flows?

### 📖 Introduction

An open redirect looks minor in isolation — it doesn't steal data or run code by itself — but its real danger shows up in what it enables when combined with something else.

### 🔀 The Mechanism

A feature that redirects a user based on a URL supplied in a parameter — `/login?redirect=/dashboard`, sending the user wherever `redirect` says after they log in — is vulnerable if that value isn't restricted to the app's own paths. An attacker crafts `yourapp.com/login?redirect=https://evil.com`. The victim clicks a link pointing at the genuine, trusted domain, logs in completely normally, and is then silently sent on to the attacker's site.

### 🎣 Why It's Effective for Phishing

Because the initial link genuinely points at the real, trusted domain, it passes casual inspection — hovering over a link, or even a security-conscious glance at the domain — far better than a link straight to `evil.com` ever would. The trusted domain lends the whole chain credibility that a raw phishing link lacks on its own.

### 🔗 Chaining With OAuth

OAuth flows rely on redirecting back to a registered URI after authorization completes. If an OAuth provider's redirect validation is loose enough to accept a broad pattern rather than an exact match, an open redirect on the *client* application's side can be combined with it to divert an authorization code or token to an attacker-controlled endpoint instead of the legitimate one.

### 🛠️ The Fix

Validate any redirect target against an allowlist of the application's own known paths, or restrict it to relative paths only, explicitly rejecting anything that looks like a full external URL.

### 💎 Good to Know: Not Every Vulnerability Is Dangerous in Isolation

An open redirect's real severity comes almost entirely from what it's chained with. It's a useful reminder that a "low severity in isolation" finding on a pentest report, covered again in this chapter's closing question, still deserves real scrutiny for how it might combine with something else.

---

## 13. What is clickjacking?

### 📖 Introduction

Clickjacking is purely a UI-deception attack — it doesn't bypass authentication or steal data directly, which makes it a different category from most of this chapter.

### 🖼️ The Mechanism

An attacker loads your site inside an invisible iframe (`opacity: 0`) on their own page, and overlays convincing, decoy content on top of it — positioned so that where the visible page suggests a user is clicking ("Play Video") actually lands, in the invisible iframe underneath, on a real, sensitive control on your site ("Delete Account" or "Confirm Transfer"). The click reaches the genuine button, not the decoy the user believes they're interacting with.

### ⚠️ What Makes It Dangerous

The victim has to already be logged into the targeted site for their click to do anything meaningful — clickjacking doesn't break in on its own, it hijacks an *already-authenticated* session's single click. That's exactly why it pairs so effectively with high-stakes, one-click actions: account deletion, a permission grant, a financial confirmation.

### 💎 Good to Know: The Real Defense Lives in the Headers Chapter

Preventing a page from being framed at all — via `X-Frame-Options` or CSP's `frame-ancestors` directive — is the actual fix, and it's covered in full in the Security Headers chapter. What matters here is recognizing the attack itself: a decoy UI tricking an authenticated user's real click into landing somewhere they never intended.

---

## 14. What is Server-Side Template Injection (SSTI), and how does it differ from XSS?

### 📖 Introduction

SSTI is easy to confuse with XSS at a glance — both involve injecting something into a template — but where the injected payload actually runs is completely different.

### 🖥️ The Mechanism

Server-side templating engines (EJS, Pug, and equivalents in other languages like Jinja2) support embedding logic or expressions directly inside a template using special syntax (`<%= %>`, `{{ }}`). SSTI happens when user input is inserted directly into the *template string itself*, before rendering, rather than passed in as *data* to a fixed, pre-written template. An attacker who can influence the template source can inject the engine's own expression syntax, and the engine will evaluate it as template code — on the server.

```js
// Vulnerable: user input becomes part of the template source itself
const rendered = ejs.render(`Hello, ${req.query.name}`); // name could be `<%= process.mainModule.require('child_process').execSync('...') %>`

// Safe: the template is fixed; user input is only ever passed in as data
const rendered = ejs.render("Hello, <%= name %>", { name: req.query.name });
```

### 🆚 The Key Difference From XSS

XSS executes in the *victim's browser* — client-side JavaScript, sandboxed by the browser itself. SSTI executes on the *server*, inside the templating engine's own evaluation context — which, in badly configured cases, can be escalated far enough to reach the underlying language's runtime, resulting in full server-side remote code execution rather than just a browser-side compromise.

### 💎 Good to Know: SSTI Requires a Specific, Uncommon Setup to Even Be Possible

A typical application using a fixed set of `.ejs`/`.pug` files and passing user data in as template *variables* is never exposed to this at all — the vulnerability specifically requires building a template *dynamically from user input*, which is a genuinely uncommon (though real) feature, like a "customize your notification email template" option.

---

## 15. What is prototype pollution, and why is it a JavaScript/Node.js-specific vulnerability?

### 📖 Introduction

This is one of the few vulnerabilities in this chapter that's genuinely specific to how JavaScript's object system works — most other mainstream languages don't have an equivalent.

### 🔗 The Mechanism

Every plain JavaScript object inherits properties through a prototype chain, and every plain object shares the same root: `Object.prototype`. If an attacker can get a merge, clone, or "extend"-style function to write to a path like `__proto__.someProperty`, they're not modifying one specific object — they're modifying the *shared prototype* that every plain object across the entire running process inherits from.

```js
// A naive recursive merge with no guard against dangerous keys
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === "object") {
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

merge({}, JSON.parse('{"__proto__": {"isAdmin": true}}'));
// Every plain object created afterward — anywhere in the app — now
// inherits isAdmin: true, even ones that never touched this request at all.
```

### 💥 The Range of Impact

The consequences depend on what the polluted property happens to influence elsewhere in the application: it might enable XSS if some rendering logic reads that property, cause a denial of service by corrupting something the app depends on internally, or in more specific, complex circumstances, even lead to remote code execution if the polluted property affects something like a command being constructed elsewhere.

### 🛠️ The Fix

Use `Object.create(null)` for objects meant to be simple key-value maps, since that removes the prototype chain entirely — there's nothing to pollute. Prefer `Map` over plain objects for genuinely user-controlled key-value data. Explicitly block `__proto__`, `constructor`, and `prototype` as keys in any custom merge logic. And keep dependencies patched — several real, well-known CVEs in popular npm utility packages, including older versions of lodash, were exactly this bug.

### 💎 Good to Know: This Exploits a Mechanic Unique to How JavaScript Objects Work

The shared, mutable prototype chain that every plain object participates in by default doesn't really have an equivalent in most other mainstream languages' object systems — which is exactly why this vulnerability is called out as JavaScript/Node.js-specific rather than a general web application concern.

---

## 16. What is ReDoS, and how can a poorly written regex hang a server?

### 📖 Introduction

ReDoS is a denial-of-service vulnerability hiding inside something that looks completely harmless: a regular expression pattern.

### 🐌 The Mechanism

Certain regex patterns, matched against a carefully crafted input, cause the regex engine's backtracking algorithm to explore an exponential number of ways to try to match, instead of a linear one. The classic culprit is a **nested quantifier** — a pattern like `(a+)+` — where the engine has many equivalent ways to split the same input across the repeated groups, and has to try all of them before concluding the match fails.

```js
const vulnerable = /^(a+)+$/;
vulnerable.test("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!"); // hangs
```

A string just 30–40 characters long, deliberately crafted to almost-but-not-quite match, can cause the completion time to grow exponentially, taking minutes on a pattern that normally resolves in microseconds.

### ⚠️ Why It's Especially Dangerous in Node.js

Node.js runs JavaScript on a single-threaded event loop. A ReDoS-triggering regex match doesn't just slow down the one request that triggered it — it blocks that entire thread, meaning *every other request the server is trying to handle at the same time* stalls right alongside it. One bad regex match against one malicious input can take down the whole server, not just the single request that caused it.

### 🛠️ The Fix

Avoid nested quantifiers in regex patterns, especially any operating on user-controlled input. Use a regex complexity linter (tools like `safe-regex` exist specifically for this). Where the runtime supports it, apply a timeout to regex execution against untrusted input. For genuinely untrusted regex patterns (rare, but real in some applications), consider a regex engine with linear-time matching guarantees.

### 💎 Good to Know: This Bug Is Invisible Until Someone Sends the Right Input

A vulnerable regex works completely normally against every typical input a developer tests with during development — the exponential blowup only appears with a very specific, deliberately crafted string, which is exactly why it tends to slip past ordinary testing and only surfaces once it's exploited in production.

---

## 17. What is a business logic vulnerability, and why can't automated scanners typically detect it?

### 📖 Introduction

Every vulnerability covered so far in this chapter is, at some level, a technical flaw — a missing check, an unsafe function call. A business logic vulnerability is different: the code does exactly what it was written to do, and that's precisely the problem.

### 🧩 What It Is

A business logic vulnerability is a flaw in the application's *intended workflow or rules* being exploitable, rather than a piece of code being technically broken. Real examples: applying the same one-time-use coupon code repeatedly because the "already used" check is missing or racy (the next question covers exactly this scenario in more depth); adding a negative quantity to a shopping cart so the total goes negative, effectively getting money back at checkout; skipping directly to a later step's URL in a multi-step checkout flow, bypassing an earlier validation step entirely; abusing a referral program by referring accounts the same person also controls.

### 🤖 Why Scanners Miss These

Automated scanners look for known *technical* signatures — a database error message leaking in a response, a missing security header, input reflected unescaped into HTML. They have no concept of what your specific business rules actually are ("a coupon should only be usable once," "quantity can never be negative") and can't reason about whether a sequence of individually valid-looking requests violates an intended workflow that only exists in your product's design, not in any generic pattern a tool could recognize.

### 💎 Good to Know: This Is Where Manual, Product-Aware Review Genuinely Can't Be Replaced

This is one of the few vulnerability classes where a generic security tool fundamentally cannot substitute for a person who actually understands what a specific feature is supposed to guarantee, and can deliberately try to break that guarantee. It's a strong argument for at least one round of manual "how would I abuse this if I were trying to" review on any feature involving money, inventory, or limited-use resources.

---

## 18. What is a race condition / Time-of-Check-to-Time-of-Use (TOCTOU) vulnerability?

### 📖 Introduction

This is the specific, concrete mechanism behind the coupon-abuse example from the previous question — and it's one of the more expensive mistakes on this list, precisely because it tends to touch money, inventory, or other limited resources directly.

### ⏱️ The Mechanism

A TOCTOU vulnerability arises from the gap in time between when a condition is *checked* ("has this coupon been used yet?" / "is there enough balance?") and when the corresponding action is actually *taken* (marking the coupon used, deducting the balance). If an attacker fires multiple requests into that narrow gap simultaneously, more than one of them can pass the check step *before any of them has completed the use step* — because each request's check happens against the state as it was before any of the concurrent requests had finished writing back.

A user with a single valid $50 discount coupon fires ten simultaneous "apply coupon" requests. If each one independently checks "has this been used? No" before any single one gets around to actually marking it used, several of them succeed at once — the discount applies multiple times. The same underlying flaw enables withdrawing more than an account's actual balance, by racing several simultaneous withdrawal requests before any single one's balance deduction is recorded and checked by the others.

### 🛠️ The Fix: Atomic Operations, Not Separate Check-Then-Write Steps

```js
// Vulnerable: check and write are two separate steps, with a gap between them
const coupon = await Coupon.findById(id);
if (!coupon.used) {
  coupon.used = true;
  await coupon.save(); // a second concurrent request could pass the check above first
}

// Safe: the check is embedded in the query itself — check-and-write is one atomic step
const coupon = await Coupon.findOneAndUpdate(
  { _id: id, used: false },   // only matches if still unused, at the instant of the write
  { $set: { used: true } }
);
// A second, concurrent identical request simply won't match — the flag already flipped.
```

The fix isn't better validation logic in JavaScript — it's relying on the database's own atomic guarantee, so the "is it still valid" check and the "mark it used" write happen as a single, indivisible operation rather than two separate round trips that a concurrent request can slip in between.

### 💎 Good to Know: This Bug Only Shows Up Under Real Concurrent Load

A race condition like this passes completely normal, one-request-at-a-time manual testing and most straightforward automated test suites without ever surfacing — it only manifests when genuinely concurrent requests hit the same check-then-write gap at the same time, which is exactly why it's both easy to ship unnoticed and has caused real, well-documented financial losses at real companies once it's found and exploited.

---

## 19. What is the difference between input validation, sanitization, and encoding?

### 📖 Introduction

These three terms get used loosely and interchangeably, but they defend against different failure modes, and understanding them precisely ties together most of the defenses covered across this chapter and the previous one.

### ✅ Validation

Validation checks that input conforms to an expected shape, type, or format, and **rejects** it entirely if it doesn't — "this must be a valid email address," "this must be a number between 1 and 100." Validation doesn't modify anything; it's a gatekeeper that only ever decides pass or reject. This is what prevents the NoSQL type-confusion attack from earlier in this chapter, among other things.

### 🧹 Sanitization

Sanitization **modifies** input to remove or neutralize potentially dangerous content, while still accepting it — stripping disallowed HTML tags from a rich-text comment field, for instance. This is the right tool specifically when you genuinely want to accept a broader, messier category of input, but need to remove the specifically dangerous parts of it.

### 🔤 Encoding

Encoding transforms data *at the point it's output*, into whatever specific context it's landing in — HTML, a URL, a JavaScript string, a SQL parameter — so it's treated as literal data rather than executable syntax in that particular context. Encoding doesn't reject or change the underlying meaning of the data; it changes its representation for safe use in one specific place. This is what actually defeats XSS, SQL injection, command injection, and nearly everything else in this chapter that follows the "trusted structure plus untrusted data" pattern.

### 💎 Good to Know: None of the Three Substitutes for the Others

Validating that an email "looks like a valid email" does nothing to prevent XSS if that same, perfectly valid-looking email is later rendered unescaped into an HTML page somewhere. A genuinely secure pipeline typically uses all three, each doing its own specific job at the specific point where it actually matters — validation at the boundary, sanitization where rich input is deliberately allowed, encoding at every point of output.

---

## 20. How would you triage and prioritize a list of vulnerabilities found in a penetration test report?

### 📖 Introduction

This closes the chapter by pulling several ideas — CVSS scoring from the first chapter, exploitability, business impact — into the kind of practical decision a real report actually forces you to make.

### 📊 First Pass: Severity

Group findings by severity, using something like the CVSS score from the first chapter or the testing firm's own rating. This is a reasonable starting sort, but stopping here is a mistake — raw severity is calculated somewhat generically and ignores how exploitable a given finding actually is in *your* specific system.

### 🎯 Second Pass: Real-World Exploitability

For each finding, ask whether the vulnerable path is actually reachable by an untrusted, unauthenticated attacker in production, or whether it requires an internal-only, already-authenticated, or otherwise rare precondition that meaningfully limits real risk. A "critical" finding on an internal admin tool sitting behind a VPN and MFA is genuinely a lower real-world priority than a "high" finding on a fully public, unauthenticated endpoint — even though the raw severity number might suggest the opposite ranking.

### 💥 Third Pass: Actual Business Impact

Weigh the worst realistic outcome: full database compromise or remote code execution and mass account takeover sit at one end; low-impact disclosure of something not especially sensitive sits at the other, even if both were technically labeled the same severity tier.

### 🚨 Practical Prioritization

Anything that's simultaneously high severity, reachable by an untrusted attacker, and meaningfully impactful gets fixed immediately — potentially the same day, following the same triage logic as the CVE/CVSS discussion in the first chapter. In genuinely severe, actively exploitable cases, that can mean pulling a feature or endpoint offline entirely rather than waiting for a normal release cycle.

It's also worth looking across the *whole* report for patterns rather than treating every finding as fully independent — five separate "missing input validation" findings scattered across different endpoints often point to one systemic gap (no validation middleware applied consistently), which is far more efficient to fix once, centrally, than five separate times in five separate places.

### 💎 Good to Know: A Clean Pentest Report Is a Snapshot, Not a Finish Line

This brings the chapter back to where the whole guide started: fixing every finding in a report doesn't mean the application is now "secure" — it means the specific things this particular tester happened to look for, in the time they had, are now addressed. Treat the report as valuable input into an ongoing process, not a certificate to file away.
