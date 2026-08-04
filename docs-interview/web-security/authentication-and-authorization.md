---
title: Authentication & Authorization
description: The difference between the two, and common ways each gets implemented.
sidebar_position: 2
---

# Authentication & Authorization

## 1. What is the difference between authentication and authorization, and why do people confuse the two?

### 📖 Introduction

Nearly every access-control bug covered in this chapter, and the next few after it, traces back to these two concepts getting blurred together. It's worth being precise about them before going any further.

### 🪪 Authentication: Proving Who You Are

Authentication is the process of verifying identity — confirming that someone is who they claim to be. Logging in with a username and password, entering a one-time code from an authenticator app, or scanning a fingerprint are all authentication. The question authentication answers is simply: **"Who is this?"**

### 🚦 Authorization: Deciding What You're Allowed to Do

Authorization is the process of deciding what an already-identified person is allowed to do. The question authorization answers is: **"Now that I know who you are, what are you permitted to access or change?"** A logged-in user is authenticated, but that says nothing yet about whether they should be allowed to view someone else's invoice or delete another user's account.

### 🔀 Why They Get Confused

In code, they often sit right next to each other in the same request-handling pipeline, which makes it easy to write one and quietly forget the other:

```js
// Authentication: confirms *who* is making the request
function requireAuth(req, res, next) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: "Not logged in" });
  req.user = user;
  next();
}

// Authorization: confirms *what* that user is allowed to do
function requireOwnership(req, res, next) {
  const invoice = getInvoiceById(req.params.id);
  if (invoice.ownerId !== req.user.id) {
    return res.status(403).json({ error: "Not your invoice" });
  }
  next();
}
```

A route that only applies `requireAuth` and skips `requireOwnership` will happily let any *logged-in* user view *anyone's* invoice, just by changing the ID in the URL. That specific mistake is common enough to have its own name — Insecure Direct Object Reference, covered later in this chapter.

### 💎 Good to Know: 401 vs. 403

The two HTTP status codes map directly onto this distinction: `401 Unauthorized` really means "you haven't authenticated" (despite the confusing name), and `403 Forbidden` means "I know who you are, and you're not allowed to do this." Getting these right in your own APIs is a small thing that signals you understand the difference.

---

## 2. How should passwords be stored, and why is plain hashing insufficient?

### 📖 Introduction

If a database ever leaks, whether from a breach, a misconfigured backup, or an insider, how passwords were stored determines whether that leak is a minor incident or a catastrophe for every user.

### 🚫 Never Store Plaintext

A password should never be stored as plain, readable text. If it is, anyone with database access — an attacker, a rogue employee, or a leaked backup — instantly has every user's real password, which most people reuse across other sites too.

### 🔒 Store a Hash, Not the Password

Instead, you store the output of a one-way hash function run on the password. "One-way" means there's no way to reverse a hash back into the original password — to check a login attempt, you hash the *submitted* password the same way and compare the two hashes, never decrypting anything.

```js
const bcrypt = require("bcrypt");

// Signup: store the hash, never the raw password
const passwordHash = await bcrypt.hash(plainPassword, 12);
await User.create({ email, passwordHash });

// Login: re-hash the attempt and compare
const user = await User.findOne({ email });
const isValid = await bcrypt.compare(plainPassword, user.passwordHash);
```

### ⚡ Why a Fast Hash Like Plain SHA-256 Isn't Enough

The problem isn't that SHA-256 is "broken" — it isn't. The problem is that it's *fast*, and fast is exactly the wrong property for a password hash. General-purpose hash functions are designed to hash gigabytes of data quickly for things like file integrity checks. That same speed lets an attacker who steals a database of SHA-256 hashes try billions of password guesses per second on a GPU, making even a reasonably complex password crackable in a short amount of time. Password hashing needs to be deliberately, tunably *slow* — which is exactly what purpose-built algorithms like bcrypt, scrypt, and Argon2, covered in the next questions, are designed for.

### 💎 Good to Know: Unsalted Hashing Has a Second Problem

Beyond speed, hashing without a per-user salt means two users with the same password produce the identical hash — instantly visible to anyone who leaks the database, and exactly what the next question's rainbow table attack exploits.

---

## 3. What is salting, and what specific attack does it defend against?

### 📖 Introduction

Salting is what turns "hash the password" into something actually resistant to precomputed cracking attacks, and it's the piece that plain, unsalted hashing is missing.

### 🧂 What a Salt Is

A salt is a random value generated uniquely for each password, combined with the password before hashing, and stored alongside the resulting hash (a salt doesn't need to be kept secret — its job is uniqueness, not secrecy). Two users with the identical password `Password123!` end up with completely different stored hashes, because each got a different random salt mixed in.

### 🌈 The Rainbow Table Attack It Defeats

A rainbow table is a precomputed lookup table mapping the hashes of common passwords back to the plaintext that produced them — an attacker builds it once, then any leaked unsalted hash that matches an entry in the table is instantly cracked, no guessing required. Salting defeats this completely: since every user's hash was computed with a different salt, the attacker would need a separate, complete rainbow table *per possible salt value*, which is computationally infeasible.

### 💎 Good to Know: Modern Libraries Handle This for You

You almost never manage salts manually today. When you call `bcrypt.hash()`, it generates a random salt automatically and embeds it directly inside the returned hash string — the `$2b$12$...` format includes the algorithm version, cost factor, and salt all in one. `bcrypt.compare()` extracts the salt back out of the stored hash automatically. This is a case where knowing *why* something works matters more than manually implementing it — the library already does it correctly.

---

## 4. What is the difference between bcrypt, scrypt, and Argon2, and why are they preferred over general-purpose hash functions for passwords?

### 📖 Introduction

Building on the last two questions, this is about *which* specific algorithm to reach for, since "use a slow, salted hash" still leaves a real choice to make.

### 🐡 bcrypt

Based on the Blowfish cipher, bcrypt has been the industry-standard choice for over two decades. It has a configurable **cost factor** (also called work factor or rounds) that controls how computationally expensive each hash is — raising it makes brute-forcing proportionally slower. It's simple to use, battle-tested, and available in nearly every language.

### 🧠 scrypt

scrypt adds a second dimension beyond just CPU cost: it's **memory-hard**, meaning it deliberately requires a large amount of RAM per hash attempt. This specifically targets GPU and custom-hardware (ASIC) cracking, since those devices are excellent at massive parallel computation but comparatively limited in per-unit memory — making large-scale parallel cracking far less efficient than it is against bcrypt.

### 🏆 Argon2

Argon2 won the Password Hashing Competition in 2015 and is generally considered the current best practice for new projects. It's configurable across three dimensions — time cost, memory cost, and parallelism — and its `Argon2id` variant (the recommended one) combines resistance to both GPU-parallel attacks and certain side-channel attacks.

```js
const argon2 = require("argon2");

const hash = await argon2.hash(plainPassword); // Argon2id by default
const isValid = await argon2.verify(hash, plainPassword);
```

### ✅ The Practical Recommendation

For a new project, Argon2id is the current best default. bcrypt remains a perfectly reasonable, still-secure choice, especially in an existing codebase already using it — there's rarely a strong reason to migrate a working system just to chase the newest algorithm.

### 💎 Good to Know: Cost Factors Need Revisiting Over Time

A bcrypt cost factor tuned to "comfortably slow" on 2015 hardware is meaningfully weaker today, since attacker hardware keeps getting faster while your stored setting stays fixed. Periodically re-evaluating and raising the cost factor (and re-hashing on next login) is a legitimate, ongoing maintenance task, not a one-time setup decision.

---

## 5. What makes a good password policy, and why have NIST's modern guidelines moved away from forced rotation and complex character requirements?

### 📖 Introduction

For a long time, "strong password policy" meant forced 90-day rotation and mandatory uppercase-plus-symbol-plus-number rules. Modern guidance, notably from NIST (the U.S. National Institute of Standards and Technology, in publication SP 800-63B), moved directly against both of those defaults.

### 🔁 Why Forced Rotation Backfired

When people are forced to change a password on a schedule, they overwhelmingly don't pick something new and random — they make a small, predictable tweak to what they already had: `Summer2023!` becomes `Summer2024!`. That pattern is *easier*, not harder, for an attacker who has seen one of your old passwords to guess your new one. Forced rotation should now only happen when there's actual evidence of compromise, not on a fixed calendar.

### 🔤 Why Complexity Rules Backfired

Requiring a mix of uppercase, lowercase, numbers, and symbols nudges people toward predictable substitutions (`P@ssw0rd1`) rather than genuinely higher entropy, and often pushes people to write the resulting hard-to-remember password down somewhere insecure — directly undermining the security-usability tradeoff discussed in the previous chapter.

### ✅ What's Recommended Instead

NIST's current guidance favors **length over complexity** — encouraging long passphrases, allowing very long maximum lengths, and not requiring special characters at all. It also recommends checking new passwords against lists of known-breached passwords (via something like the "Have I Been Pwned" Pwned Passwords API, which uses a k-anonymity model so you never send the actual password over the network) and rejecting anything that shows up.

### 💎 Good to Know: A Long, Simple Passphrase Beats a Short, Complex One

`correct-horse-battery-staple` has far more entropy, and is far easier for a real person to remember, than `P@ssw0rd1`. Length is a more effective and more usable lever than complexity rules.

---

## 6. What is multi-factor authentication (MFA), and why is SMS-based MFA considered weaker than app-based or hardware-key-based MFA?

### 📖 Introduction

Even a perfectly hashed, properly policy-compliant password can still be phished, guessed, or leaked in a breach elsewhere. MFA is the defense that makes a stolen password alone insufficient.

### 🔢 What MFA Is

Multi-factor authentication requires proving identity with two or more independent factors, typically drawn from: something you *know* (a password), something you *have* (a phone or hardware key), or something you *are* (a fingerprint or face scan). Even if an attacker has your password, they're still missing the second factor.

### 📱 SMS-Based MFA: Weakest of the Three

A one-time code sent via text message is better than nothing, but it has real, well-documented weaknesses. **SIM swapping** lets an attacker convince (or bribe, or social-engineer) a mobile carrier to port a victim's phone number to a SIM the attacker controls, after which every SMS code goes straight to them. The underlying telecom signaling protocol (SS7) also has known interception weaknesses unrelated to the app or website at all.

### 🔐 TOTP Apps: A Meaningful Step Up

Time-based One-Time Password apps (Google Authenticator, Authy, and similar) generate a new six-digit code every 30 seconds, computed locally from a shared secret and the current time — no network transmission involved at all, which makes SIM swapping irrelevant to this factor.

### 🔑 Hardware Keys (FIDO2/WebAuthn): Strongest, and Phishing-Resistant

A hardware security key performs a cryptographic challenge-response that's bound to the actual website origin requesting it. This makes it structurally resistant to phishing — even if a user is fully fooled by a convincing fake login page, the key itself checks the domain and simply won't produce a valid response for the wrong one. Neither passwords nor TOTP codes have this property; a fooled user can still type either one into a fake site.

### 💎 Good to Know: Any MFA Beats No MFA

The hierarchy (hardware key > TOTP app > SMS) matters when choosing what to build or recommend, but it shouldn't discourage offering SMS-based MFA as an option — it still blocks the overwhelming majority of automated credential-stuffing and password-reuse attacks, which don't involve real-time SIM swapping at all.

---

## 7. What is OAuth 2.0, what problem does it solve, and what is it explicitly NOT designed to do?

### 📖 Introduction

OAuth 2.0 shows up constantly in real applications — "Sign in with Google," letting a scheduling app read your calendar, letting a third-party tool post to your Slack — but it's also one of the most commonly misunderstood standards in web development.

### 🎯 The Problem It Solves

Before OAuth, if you wanted a third-party app to access your data on another service, you'd have to hand that third-party app your actual password for the other service — a scheduling app would need your real Google password just to read your calendar. That's a serious trust and blast-radius problem: the third-party app now holds a credential that can do *anything* your account can do, forever, until you change your password everywhere.

OAuth solves this by letting a user grant a third-party app **limited, revocable access** to specific resources, without that app ever seeing the user's actual password. The key roles involved: the **resource owner** (the user), the **client** (the third-party app requesting access), the **authorization server** (which issues access), and the **resource server** (which holds the actual data, like the calendar API).

### 🚫 What It's Explicitly Not For

OAuth 2.0 is an **authorization** protocol — it answers "is this app allowed to access this specific resource" — not an **authentication** protocol. It doesn't have a standardized, secure way to tell your app *who the user is*. Using a raw OAuth access token as a stand-in for "the user is logged in" is a well-known anti-pattern, because the token was designed to prove access to an API, not to identify a person. The standard fix for that gap is OpenID Connect, covered next.

### 💎 Good to Know: This Confusion Has a Name

Using OAuth alone to build a "login" system is common enough to have earned its own cautionary label in the identity community — sometimes called "the OAuth confusion." If a system needs to know *who* logged in, reach for OpenID Connect, not raw OAuth.

---

## 8. What is OpenID Connect, and how does it relate to and differ from OAuth 2.0?

### 📖 Introduction

This directly answers the gap left at the end of the previous question — OAuth tells you what an app can access, but not who's using it.

### 🪪 What OpenID Connect (OIDC) Adds

OpenID Connect is a thin identity layer built directly on top of OAuth 2.0. It adds a new, standardized token — the **ID Token**, which is a JWT (covered in detail in the next chapter) — containing signed claims about the user's identity: their unique subject ID (`sub`), email, name, and similar profile fields. Because it's cryptographically signed by the authorization server (now typically called the **Identity Provider**, or IdP, in this context), your app can verify it really came from Google, GitHub, or whichever provider issued it.

### 🆚 The Core Difference

OAuth 2.0 answers: *"Is this app allowed to do X on the user's behalf?"* OpenID Connect answers: *"Who is this user, verifiably?"* Every "Sign in with Google" or "Sign in with GitHub" button you've ever used is OIDC layered on top of OAuth — the OAuth part handles the permission grant, the OIDC part hands your app a verified identity.

### 💎 Good to Know: You Almost Always Want OIDC, Not Raw OAuth

If a project's actual goal is "let a user log into my app using their Google account," the correct tool is OpenID Connect from the start, not building a custom identity workaround on top of plain OAuth access tokens.

---

## 9. What is the OAuth 2.0 Authorization Code flow with PKCE, and why is it recommended over the deprecated Implicit flow?

### 📖 Introduction

Knowing OAuth and OIDC conceptually is one thing — this question is about the actual sequence of requests that happens when a "Sign in with Google" button is clicked, and why the industry standardized on one specific version of it.

### 🔄 The Authorization Code Flow, Step by Step

1. Your app redirects the user's browser to the authorization server's login page (e.g., Google's).
2. The user logs in and approves the requested permissions.
3. The authorization server redirects back to your app with a short-lived, single-use **authorization code** in the URL.
4. Your app's *backend* exchanges that code for tokens (an access token, and with OIDC, an ID token) by calling the authorization server directly, server-to-server — not through the browser.

The critical property here is that the actual tokens never pass through the browser's URL or history — only the short-lived code does, and the code alone is useless without the follow-up exchange.

### ⚠️ Why the Implicit Flow Was Deprecated

The older Implicit flow skipped step 4 entirely and returned the access token *directly* in the URL fragment after redirect. That meant the token ended up exposed in browser history, in referrer headers if the page loaded any third-party resource, and in server logs — with no way to safely refresh it later, either. Current OAuth security guidance formally deprecates it in favor of Authorization Code flow for every client type.

### 🔐 PKCE: Making the Code Flow Safe for Public Clients

A traditional confidential client (a server-rendered app) can hold a secret to authenticate itself during the code exchange in step 4. A **public client** — a single-page app or mobile app — can't safely store a secret, since its code is fully visible to the end user. **PKCE** (Proof Key for Code Exchange) solves this: the client generates a random secret value (the *code verifier*), sends a hashed version of it (the *code challenge*) with the initial authorization request, and must present the original verifier during the final code exchange. Even if an attacker intercepts the authorization code in transit, they can't complete the exchange without the verifier they never saw.

### 💎 Good to Know: PKCE Is Now Recommended for Everyone

While PKCE was originally designed for public clients, current best practice recommends using Authorization Code flow with PKCE for *all* client types, confidential or not — it adds meaningful protection against authorization code interception at essentially no cost.

---

## 10. What are the risks of "Sign in with Google/GitHub/Facebook" social login, and what must you validate on the backend?

### 📖 Introduction

Social login is convenient to build and convenient for users, but it introduces a specific, easy-to-get-wrong trust boundary: your backend has to independently verify a claim about identity, rather than simply trusting whatever the client tells it.

### ⚠️ The Core Risk

If your backend's "login with Google" endpoint simply trusts a plain JSON object sent from client-side JavaScript — `{ email: "someone@company.com" }` — there's nothing stopping anyone from calling that endpoint directly with any email address they want, bypassing Google entirely. The client is not a trusted source of truth about identity; only a properly verified, signed token from the actual provider is.

### ✅ What Must Be Verified Server-Side

- **Signature verification** — the ID Token (a JWT, from the previous question) must be cryptographically verified against the provider's published public keys, confirming it was genuinely issued by them and hasn't been tampered with.
- **Audience (`aud`) claim** — must match your application's own client ID, so a token issued for a *different* app can't be replayed against yours.
- **Issuer (`iss`) claim** — must match the expected provider's URL exactly.
- **Expiration** — the token must not be expired.
- **`email_verified`** — some providers allow sign-up with an unverified email; check this claim explicitly if your app's logic assumes verified emails.

```js
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleLogin(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID, // rejects tokens issued for a different app
  });
  const payload = ticket.getPayload(); // signature + expiry already checked internally
  if (!payload.email_verified) throw new Error("Email not verified by provider");
  return payload;
}
```

### 💎 Good to Know: Never Trust a Raw Profile Object From the Frontend

A common shortcut is passing the provider's profile object (name, email, picture) straight from client JS to your backend "for convenience." Always re-derive identity from the verified token server-side instead — the profile object on its own carries no proof it wasn't fabricated by the client.

---

## 11. What is broken access control, and why has it consistently topped the OWASP Top 10?

### 📖 Introduction

This is the umbrella category that the next several questions — IDOR, RBAC/ABAC, and privilege escalation — all fall under, and it's worth understanding why it's rated the single most common serious risk category in real applications.

### 🚧 What It Is

Broken access control means users can act outside their intended permissions — viewing, modifying, or deleting data or functionality they shouldn't have access to. This can happen in the UI (a hidden admin button that a curious user finds anyway) but the dangerous version happens at the API: an endpoint that performs the action without properly checking whether the requester is actually allowed to.

### 🥇 Why It's Consistently #1

Unlike a classic bug like SQL injection, which has a recognizable syntactic pattern a scanner can search for, broken access control is a *logic* problem — it depends entirely on business rules specific to your application ("should this user be allowed to see this record?"). That makes it extremely hard for automated tools to detect reliably, and easy for a developer to miss, especially under time pressure: authentication (is there a valid login) gets implemented and tested, while the follow-up authorization check (does this specific user own this specific resource) quietly gets skipped, exactly as shown in the first question of this chapter.

### 💎 Good to Know: This Is Where Manual Review Earns Its Keep

Because broken access control is so hard to catch with tooling, a code review question like *"who is allowed to call this endpoint, and where exactly does the code check that?"* on every new route is one of the highest-value habits a team can build — more effective here than almost any automated scanner.

---

## 12. What is an Insecure Direct Object Reference (IDOR), and how would you find and fix one in a REST API?

### 📖 Introduction

IDOR is the single most common concrete example of broken access control, and one of the easiest classes of bug to accidentally ship.

### 🔓 What It Is

An IDOR happens when an application exposes a direct reference to an internal object — usually a database ID in a URL or request body — and performs the requested action without verifying that the authenticated user actually has permission to access *that specific* object.

```js
// Vulnerable: returns whatever invoice ID is requested, for any logged-in user
app.get("/api/invoices/:id", requireAuth, async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  res.json(invoice);
});
```

Any logged-in user can view any invoice just by changing the number in the URL — `/api/invoices/1234`, `/api/invoices/1235`, and so on.

### 🔍 How to Find One

Look at every route that reads, updates, or deletes a resource by ID, and ask: does the query itself restrict results to things the current user owns or is permitted to see, or does it fetch by ID alone and trust that the ID was legitimately obtained?

### 🛠️ How to Fix It

Scope the query itself to the requesting user, rather than fetching first and checking after:

```js
// Fixed: the ownership check is part of the query, not an afterthought
app.get("/api/invoices/:id", requireAuth, async (req, res) => {
  const invoice = await Invoice.findOne({
    _id: req.params.id,
    ownerId: req.user.id,
  });
  if (!invoice) return res.status(404).json({ error: "Not found" });
  res.json(invoice);
});
```

Returning a generic `404` rather than a `403` here is a deliberate, common choice — it avoids confirming to an attacker that the ID *exists* but merely belongs to someone else.

### 💎 Good to Know: Using a UUID Instead of a Sequential ID Doesn't Fix This

Switching from `/invoices/1234` to `/invoices/7e9a1c3f-...` only makes IDs *unguessable* — it doesn't add any actual access control. If an ID is ever exposed through a shared link, a referrer header, or a leaked log, an unauthorized person with that ID can still access it if the ownership check was never actually added. The fix is always the check, not the format of the identifier.

---

## 13. What is the difference between Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC), and when would you choose one over the other?

### 📖 Introduction

Once an application has more than one type of user, you need a systematic way to decide who's allowed to do what — these are the two dominant models for that.

### 🎭 Role-Based Access Control (RBAC)

RBAC attaches permissions to **roles** — `admin`, `editor`, `viewer` — and assigns one or more roles to each user. A check like "can this user delete a post" becomes "does this user have a role that includes the delete-post permission."

```js
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user.roles.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

app.delete("/api/posts/:id", requireAuth, requireRole("admin"), deletePost);
```

### 🧬 Attribute-Based Access Control (ABAC)

ABAC computes access dynamically from **attributes** of the user, the resource, and the current context — for example: "a user can edit a document if the user's department matches the document's department, AND the request happens during business hours, AND the user's clearance level meets or exceeds the document's sensitivity level." It's far more flexible than a fixed set of roles, but also meaningfully more complex to implement, test, and reason about.

### ⚖️ When to Choose Which

RBAC is the right default for the large majority of applications — including nearly all typical MERN-stack projects — because access needs usually map cleanly onto a small, stable set of job functions. Reach for ABAC when access rules are genuinely conditional on context that a fixed role can't express — large multi-tenant enterprise systems, or domains like healthcare with complex, situational consent rules.

### 💎 Good to Know: Most Real Systems Are a Hybrid

In practice, many applications use RBAC for the coarse-grained role ("this user is an `editor`") combined with a resource-ownership check layered on top ("...but only for posts they themselves created") — which is really a lightweight, one-attribute form of ABAC. That combination is exactly what the IDOR fix in the previous question demonstrated.

---

## 14. What is privilege escalation, and what's the difference between vertical and horizontal privilege escalation?

### 📖 Introduction

Privilege escalation is the general term for gaining more access than you're supposed to have — and it comes in two distinct directions worth telling apart.

### ⬆️ Vertical Privilege Escalation

Vertical escalation means gaining a **higher** privilege level than intended — a regular user becoming an admin. A classic real-world cause is **mass assignment**: an update endpoint that blindly saves whatever fields the client sends, including ones it never should have exposed.

```js
// Vulnerable: blindly trusts every field the client sends, including `role`
app.patch("/api/users/me", requireAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, req.body); // req.body could include { role: "admin" }
  res.json({ success: true });
});
```

A user who notices this can simply include `"role": "admin"` in an otherwise-normal profile update and grant themselves admin access. The fix is to explicitly allowlist which fields a client is allowed to modify, and to only ever change privilege-related fields through a separate, properly access-controlled admin action. Mass assignment is covered again, in an API-specific context, in the next chapter.

### ↔️ Horizontal Privilege Escalation

Horizontal escalation means gaining access to **another user's** data or resources at the *same* privilege level — a regular user reading another regular user's private data. This is, in effect, the same underlying failure as IDOR from a few questions ago, just described from the "privilege" angle rather than the "object reference" angle.

### 💎 Good to Know: The Vertical Fix Is Almost Always the Same Pattern

Never trust a client-submitted field that controls privilege or role. Any change to what a user is *allowed to do* should happen through a deliberate, separately-authorized code path — never as a side effect of a generic "update my profile" endpoint.

---

## 15. What is the difference between a brute-force attack and credential stuffing, and what defenses mitigate each?

### 📖 Introduction

Both attacks target the login endpoint, and both look similar from the outside — lots of failed login attempts — but they work on fundamentally different assumptions, which matters for how you defend against them.

### 🔨 Brute-Force Attacks

A brute-force attack systematically tries many password guesses against **one specific account** — either working through a dictionary of common passwords or, less efficiently, random combinations. It's guessing, and it depends on a weak or common password being in use.

### 🧩 Credential Stuffing

Credential stuffing uses username/password pairs that were **already leaked** in a breach on one site, and tries them against other, unrelated sites — betting on the extremely common habit of password reuse. This isn't guessing at all — the attacker already has real, correct credentials for some percentage of a large enough user base; they're just checking which other accounts they also unlock.

### 🛡️ Shared and Specific Defenses

Both benefit from rate limiting login attempts (by IP and by account), CAPTCHA challenges after repeated failures, and MFA, which makes a correct password alone insufficient regardless of how the attacker obtained it. Credential stuffing specifically is also weakened by checking new and existing passwords against known-breach lists (from the earlier password-policy question) and by monitoring for the tell-tale pattern of the *same* account being targeted from many *different* IPs in a short window, which is far more characteristic of stuffing than of a single attacker brute-forcing one account.

### 💎 Good to Know: Credential Stuffing Is the More Common Real-World Threat Today

Precisely because it requires no cleverness or guessing, credential stuffing is heavily automated and run at massive scale against thousands of sites simultaneously using huge, publicly circulating breach dumps — it doesn't need your specific users to have weak passwords, only to have *reused* one that leaked somewhere else entirely outside your control.

---

## 16. What is account lockout, and what denial-of-service risk does a naive lockout policy introduce?

### 📖 Introduction

Account lockout looks like an obvious defense against brute force — until you consider what happens when it's the *attacker* who controls when it triggers, not the account owner.

### 🔒 What It Is

Account lockout temporarily or permanently disables login for an account after some number of consecutive failed attempts, intended to stop an attacker from continuing to guess.

### ⚠️ The Denial-of-Service Risk

If lockout triggers purely based on the *account* being targeted (not the source IP), an attacker doesn't even need to want to break in — they can lock a real user out of their own account just by deliberately submitting a few wrong passwords for that user's known email. Done at scale, this becomes a denial-of-service attack against many users at once, using the security feature itself as the weapon.

### ✅ Better Approaches

- **Exponential backoff** — increasing the delay between allowed attempts, rather than a hard lockout, slows an attacker down without fully denying access to the legitimate owner.
- **Combined IP + account rate limiting** — makes it harder to weaponize lockout against a specific victim from a single source.
- **CAPTCHA after a threshold**, instead of a full lockout.
- **Notify, don't block** — alert the account owner of suspicious repeated attempts rather than locking them out entirely.

### 💎 Good to Know: This Is the Security-Usability Tradeoff, Gone Wrong

A naive lockout policy is a direct real-world case of the tradeoff introduced in the first chapter — a control built to protect users can, implemented carelessly, become a tool to attack them instead.

---

## 17. How should a secure password reset flow be designed, and how can these forms accidentally leak whether an account exists?

### 📖 Introduction

Password reset is one of the most commonly implemented, and most commonly implemented *insecurely*, flows in any application — a lot can go wrong in what looks like a simple feature.

### 🔁 A Secure Flow, Step by Step

1. User submits their email to a "forgot password" form.
2. Server generates a cryptographically random, single-use token with a short expiry (typically 15–60 minutes).
3. Server stores a **hash** of the token (not the raw token itself) alongside the user ID and expiry — the same principle as password storage itself, in case the database ever leaks.
4. Server emails a link containing the raw token.
5. On submission, the server looks up the record by the hash of the submitted token, checks it hasn't expired and hasn't already been used, lets the user set a new password, then immediately invalidates the token and, ideally, all of that user's existing sessions.

### ❌ Common Mistakes

Predictable tokens (sequential numbers, timestamps, or anything guessable), tokens with no expiry, failing to invalidate a token after its first use (allowing replay), and storing the raw token in plaintext rather than a hash of it.

### 🕵️ User Enumeration

If the "forgot password" endpoint responds differently depending on whether the email exists — `"No account found with that email"` versus `"Reset link sent"` — an attacker can use that difference to build a list of every valid registered email address on your platform, useful ammunition for later phishing or credential-stuffing campaigns. The fix is to always return the same generic message regardless of whether the account exists: *"If an account with that email exists, we've sent a reset link."* The same principle applies to login error messages (avoid distinguishing "wrong password" from "no such user") — though it's worth noting signup forms create a genuine tension here, since telling a user "that email is already registered" is itself a form of enumeration that's hard to avoid without hurting the signup experience.

### 💎 Good to Know: Rate Limit the Reset Endpoint Itself

Without rate limiting, the "forgot password" endpoint can be used to spam a victim's inbox with reset emails, independent of any actual attempt to break in — a nuisance attack that costs the attacker nothing.

---

## 18. What is passwordless authentication, and what security properties do passkeys provide that passwords fundamentally can't?

### 📖 Introduction

Passwordless authentication removes the shared secret entirely, in different ways depending on the approach — and the newest approach solves a problem that no amount of password policy ever fully could.

### 🔗 Magic Links

The user enters their email and receives a single-use login link, mechanically very similar to the password reset flow above. It removes the need for a memorized password, but its security ultimately reduces to the security of the user's email account, and the link itself is vulnerable to being forwarded, cached, or intercepted if the inbox isn't well secured.

### 🔑 WebAuthn and Passkeys

A passkey is a public-key credential pair generated on the user's device (or synced across their devices via a platform keychain like iCloud Keychain or Google Password Manager). The private key never leaves the device; the server only ever stores the corresponding public key. Logging in is a cryptographic challenge that the device signs with the private key — nothing secret is ever transmitted or typed anywhere.

### 🛡️ What Passkeys Solve That Passwords Structurally Can't

- **Phishing resistance** — a passkey is cryptographically bound to the exact origin/domain it was created for. Even a user who's completely fooled by a convincing fake login page can't be tricked into "handing over" a passkey the way they can a typed password, because the device itself checks the domain and simply refuses to respond to the wrong one. This is the same structural protection hardware MFA keys have, from earlier in this chapter.
- **Nothing to steal server-side** — a leaked database exposes only public keys, which are useless to an attacker without the matching private key.
- **No reuse risk** — a unique keypair is generated per site, so a passkey compromised on one service can't be tried against another the way a reused password can via credential stuffing.

### 💎 Good to Know: This Is a Structural Fix for Social Engineering

The social engineering question from the first chapter noted that no technical control fully eliminates the risk of a fooled human. Passkeys come the closest of anything covered so far — not by making phishing harder, but by making it cryptographically impossible for the credential itself to be handed over, even by a willing, fooled user.

---

## 19. In production, an internal admin panel was found accessible without authentication — what root causes and process failures would you investigate?

### 📖 Introduction

This closes the chapter with a realistic incident, tying several ideas from this chapter together the way you'd actually have to reason through it on the job.

### 🔎 Root Causes to Investigate

- **Missing middleware** — was the authentication check simply never applied to that specific router or route file, perhaps because it was added after the main auth middleware was already wired up elsewhere?
- **A leftover development shortcut** — was auth intentionally disabled temporarily during local development or an early demo, and never re-enabled before the route shipped?
- **A routing layer bypass** — could a reverse proxy (Nginx, a CDN, or a load balancer) be serving that path directly, in a way that never actually reaches the Node/Express app's own auth middleware at all? This is a real, easy-to-overlook failure mode covered further in the Server-Side Security chapter.

### 🧭 Process Failures Behind the Incident

The specific missing check is rarely the whole story — the real question is what allowed it to reach production undetected: no automated test asserting that protected routes reject unauthenticated requests, no checklist or review step that specifically looks at access control for new routes, and no external monitoring or periodic scan that would have flagged a sensitive path being publicly reachable.

### 🛠️ The Fix, Beyond the Immediate Patch

Adding the missing middleware fixes this one route, but a proper response goes further: auditing every other route for the same class of mistake (not just the one that got noticed), adding an automated test that iterates over every registered route and asserts unauthenticated requests are rejected where expected, and updating code review guidelines to explicitly ask "who is allowed to call this, and where does the code check that" for every new endpoint — directly reusing the review habit recommended earlier in this chapter, for broken access control generally.

### 💎 Good to Know: This Is Chapter 1's "Security Misconfiguration" in Concrete Form

An unauthenticated admin panel is exactly the kind of security misconfiguration described in the very first chapter — not a clever exploit, just something that was never properly closed off. The lasting fix is never just the one line of code; it's the process change that stops the same category of mistake from shipping again.
