---
title: Environment Variables & Configuration
description: Managing secrets, public vs private env vars, and next.config.js across environments.
sidebar_position: 14
---

# Environment Variables & Configuration

## 1. What are environment variables, and why does Next.js support multiple `.env` files (`.env`, `.env.local`, `.env.production`, etc.)?

### 📖 Introduction
This chapter covers how a Next.js application configures itself differently across environments — starting with the basic building block underneath all of it.

### 🔑 What Environment Variables Actually Are
Key-value pairs that configure an application's behavior without hardcoding those values directly into the source code, letting the same codebase behave differently across different environments — a database connection string pointing to a local dev database versus a production one — without needing separate code branches per environment.

### 📁 Why Next.js Supports Multiple `.env` Files
Different environments genuinely need different values for the same variable name. Rather than manually swapping values or maintaining separate config files with custom logic, Next.js provides a convention-based system where the correct file is automatically loaded based on the current environment or command being run.

### 📋 The Different Files and Their Purposes
- `.env` — defaults shared across all environments, committed to version control, since it shouldn't contain secrets.
- `.env.local` — local overrides specific to a developer's own machine, never committed (gitignored by default) — where actual secrets and personal config typically live during development.
- `.env.development`/`.env.production` — environment-specific defaults, loaded only when running in that specific mode.
- `.env.development.local`/`.env.production.local` — the most specific, local-only overrides per environment.

### 💎 Good to Know: The Underlying Philosophy
Separating "what's the same everywhere" (`.env`), "what's different per environment" (`.env.production`, etc.), and "what's specific to my own machine or secrets" (the `.local` variants) lets teams share non-sensitive defaults via version control, while keeping genuinely sensitive or personal values out of the repository entirely.

### ❓ Follow-up Interview Questions

1. Why would a team commit `.env` to version control but never `.env.local`?
2. Give an example of a variable that should differ between `.env.development` and `.env.production`.
3. What problem does this file convention solve compared to manually swapping values?
4. Which file would a developer's personal API key for local testing typically live in?
5. Why does separating "shared defaults" from "personal/sensitive overrides" matter for a team?

---

## 2. What is the difference between public and private environment variables, and what does the `NEXT_PUBLIC_` prefix actually do?

### 📖 Introduction
This distinction determines whether a value stays safely on the server or ends up visible to anyone viewing the page — worth understanding the exact mechanism, not just the naming convention.

### 🔒 Private Environment Variables: Server-Only by Default
Only accessible on the server — never bundled into the client-side JavaScript sent to the browser. Safe for secrets, like database credentials or API keys used for server-to-server calls, since they never leave the server environment.

### 🌐 Public Environment Variables: The `NEXT_PUBLIC_` Prefix
Explicitly marked to be included in the client-side JavaScript bundle, accessible from browser code in Client Components — used for values that genuinely need to be known client-side, like a public API endpoint URL or an analytics tracking ID that's already publicly visible anyway once the page loads.

### ⚙️ Mechanically, What the Prefix Actually Does: Build-Time Text Substitution
At build time, Next.js's bundler scans for `process.env.NEXT_PUBLIC_*` references in the code and literally inlines them, replacing them with their actual string values directly into the compiled client-side JavaScript bundle — a build-time text substitution, not a runtime lookup. This is why `NEXT_PUBLIC_` variables must be known at build time (a later question goes deeper on this build-time vs. runtime distinction). Any environment variable without this prefix is simply never included in that bundling process at all, making it inaccessible from client code by default.

### 💎 Good to Know: The Mental Model — Opt-In to Public, Not Opt-Out of Private
Think of `NEXT_PUBLIC_` not as marking something as special or protected, but the opposite — it's explicitly opting a value into being publicly visible. The default, safer behavior is private; you must deliberately opt in to expose something, rather than accidentally exposing something by forgetting to mark it private.

### ❓ Follow-up Interview Questions

1. What determines whether a variable ends up in the client-side JavaScript bundle?
2. Is `NEXT_PUBLIC_` a runtime lookup or a build-time substitution? Why does that distinction matter?
3. What happens to an environment variable that has no `NEXT_PUBLIC_` prefix if a Client Component tries to read it?
4. Why is the mental model "opt-in to public" safer than "opt-out of private"?
5. Give an example of a variable that's a reasonable candidate for the `NEXT_PUBLIC_` prefix.

---

## 3. Why should sensitive information never be exposed via a `NEXT_PUBLIC_` variable?

### 📖 Introduction
This is a direct, security-critical follow-up to the previous question's mechanism — once something is public, there's no taking it back.

### 🎯 The Core Risk: Inlined Into the Bundle Means Publicly Visible
Since `NEXT_PUBLIC_` variables get literally inlined into the client-side JavaScript bundle, anyone who opens their browser's DevTools or views the page source can see the actual value. There's no "hiding" it once it's in the client bundle — it's functionally equivalent to publishing that value on the internet for anyone to read.

### 💥 A Concrete Example of the Mistake
Accidentally naming a database connection string or a private API secret key `NEXT_PUBLIC_DATABASE_URL`/`NEXT_PUBLIC_STRIPE_SECRET_KEY`, rather than the correct, private version, would expose that credential to every visitor of the site — potentially letting an attacker directly access your database or make authenticated API calls using your own credentials.

### 🤔 Why This Mistake Happens in Practice
A developer might add the `NEXT_PUBLIC_` prefix reflexively, out of habit, or copy an existing public variable's naming pattern without realizing the new value they're adding is actually sensitive — or they need a value in a Client Component and reach for the quickest fix (adding the prefix) without considering whether that value should genuinely be public at all.

### 🛠️ The Correct Pattern: Keep the Secret Server-Side, Pass Down Only the Result
If a Client Component genuinely needs data that depends on a secret — making an authenticated API call, for instance — the correct pattern is to keep the secret private and server-side, and have a Server Component, Server Action, or Route Handler perform the sensitive operation on the server, then pass only the necessary, non-sensitive result down to the client — never the secret itself.

### ❓ Follow-up Interview Questions

1. Why can't a `NEXT_PUBLIC_` secret be "hidden" even with minification or obfuscation?
2. What could an attacker do with an accidentally exposed database connection string?
3. Why does copy-pasting an existing `NEXT_PUBLIC_` variable's naming pattern create risk?
4. What's the correct pattern for a Client Component that needs data behind an authenticated API call?
5. Why is this fundamentally a code-review concern, not just a configuration mistake?

---

## 4. What is the loading order of `.env` files in Next.js, and how does this differ between development and production?

### 📖 Introduction
This is a direct follow-up to the file types covered earlier in this chapter — worth knowing the precise precedence, and one genuinely practical reason a specific file gets skipped in one particular case.

### 📊 The Precise Loading Order
From highest to lowest priority — later files in this list override earlier ones for the same variable name:
`.env.${NODE_ENV}.local` → `.env.local` (skipped when `NODE_ENV` is `test`) → `.env.${NODE_ENV}` → `.env`.
The most specific, local-only file always wins if a variable is defined in multiple files.

### 🧪 Why `.env.local` Is Skipped During Tests
A genuinely practical, often-overlooked detail: tests should be deterministic and reproducible across different developers' machines and CI environments. If `.env.local` — a developer's own, personal overrides — were loaded during tests, test behavior could differ between developers' machines based on their personal local config, undermining test reliability.

### 🔄 The Dev vs. Production Difference: Automatic, Based on the Command Run
`NODE_ENV` is automatically set to `development` when running `next dev`, and `production` when running `next build`/`next start` — meaning the same variable name can have a genuinely different value loaded automatically, just based on which command is running, with no manual switching required.

### 🏗️ A Concrete, Worked Example
```
.env:                     API_URL=https://api.example.com
.env.production:          API_URL=https://api.example.com/prod
.env.production.local:    API_URL=https://api.example.com/prod-debug
```
Running in production resolves `API_URL` to the `.env.production.local` value — the most specific file wins, not `.env.production` or `.env`.

### ❓ Follow-up Interview Questions

1. If a variable is defined in both `.env` and `.env.production.local`, which value wins?
2. Why is `.env.local` specifically skipped when `NODE_ENV` is `test`?
3. What automatically sets `NODE_ENV` to `development` versus `production`?
4. In the worked example above, what value would `API_URL` resolve to during local development (assuming no `.env.development` files exist)?
5. Why does this loading order matter for keeping local secrets out of shared config files?

---

## 5. What is the purpose of `next.config.js`, and what kinds of configuration belong there versus in an `.env` file?

### 📖 Introduction
These two serve genuinely different roles — one provides data, the other controls behavior — worth being precise about which belongs where.

### ⚙️ What `next.config.js` Actually Is
A configuration file controlling Next.js's own build and runtime behavior — image optimization settings (`images.remotePatterns`), globally-configured redirects and rewrites, custom webpack/build configuration, and which environment variables should be exposed to the client bundle.

### 🆚 The Key Distinction: Data vs. Behavior
`.env` files provide values — data. `next.config.js` controls behavior and structure — how Next.js itself operates. A useful mental model: is this a piece of data that varies per environment, like a database URL or an API key? That's `.env`. Is this a structural or behavioral decision about how the framework itself should build or run, like which image domains are allowed? That's `next.config.js`.

### 🌉 The Bridge: `next.config.js` Can Read Environment Variables
Since `next.config.js` is itself a JavaScript/Node.js file, executed at build or start time, it can reference environment variables within it — conditionally setting a config option based on `process.env.NODE_ENV`, for instance. This is a genuinely important, practical bridge between the two systems: `next.config.js` can dynamically adjust its own behavior using environment variable values, but it itself isn't the place to store the raw secret or data values.

### 🏗️ A Concrete Illustration Tying Both Together
```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: process.env.IMAGE_HOST },
    ],
  },
};
```
Here, `process.env.IMAGE_HOST` — the raw value, varying per environment — comes from an `.env` file, while `next.config.js` uses that value to configure the framework's own behavior: which remote image hosts are allowed.

### ❓ Follow-up Interview Questions

1. What's the core distinction between what belongs in `.env` and what belongs in `next.config.js`?
2. Can `next.config.js` read environment variables? How?
3. Why shouldn't a raw secret value be hardcoded directly inside `next.config.js`?
4. In the illustration above, which file actually supplies the value of `IMAGE_HOST`?
5. Give an example of a configuration decision that belongs in `next.config.js` rather than `.env`.

---

## 6. What is the difference between build-time and runtime configuration, and what are the trade-offs between them?

### 📖 Introduction
This distinction was previewed briefly earlier in this chapter — it's genuinely foundational, and has a real, sometimes-surprising practical consequence worth stating honestly.

### 🏗️ Build-Time Configuration: Baked Into the Compiled Code
Values resolved when `next build` runs. `NEXT_PUBLIC_*` variables are the classic example — their values get literally inlined into the compiled JavaScript at build time, meaning the same build artifact can't be reused across different environments without rebuilding, since the values are frozen into the code itself.

### ⚙️ Runtime Configuration: Read When the Application Actually Runs
Values read when the application actually starts or runs (`next start`), not baked in during the build step. Private, non-`NEXT_PUBLIC_` environment variables, read inside Server Components or Route Handlers via `process.env`, are resolved at runtime, each time the server process starts — meaning the same build artifact can be deployed across multiple environments with different runtime env vars, without needing a separate build per environment.

### ⚖️ The Trade-off: Simplicity vs. "Build Once, Deploy Many Times" Flexibility
Build-time config is simpler and more predictable — the value is literally part of the code, no runtime lookup cost — but less flexible, since changing it requires a full rebuild and redeploy. Runtime config is more flexible — the same build can be promoted through staging to production with different config each time, a genuinely valuable CI/CD pattern — but requires the application to actually read `process.env` at request or startup time, rather than having values baked in.

### 💎 Good to Know: The Practical Implication for `NEXT_PUBLIC_` Specifically
Since `NEXT_PUBLIC_` variables are build-time, they generally can't be changed without rebuilding. This is why the widely-used "build once, deploy many times" CI/CD pattern becomes genuinely complicated for apps that rely heavily on `NEXT_PUBLIC_` variables that differ per environment — a real, practical limitation worth stating honestly, and one that comes up again when handling containerized deployments.

### ❓ Follow-up Interview Questions

1. Why can't a `NEXT_PUBLIC_` variable's value be changed without rebuilding the application?
2. What does "build once, deploy many times" mean as a CI/CD pattern, and why does it favor runtime config?
3. Why is build-time config described as simpler despite being less flexible?
4. Give an example of a value that should be runtime config rather than build-time.
5. What practical problem does relying heavily on `NEXT_PUBLIC_` variables create for a multi-environment deployment pipeline?

---

## 7. How do environment variables interact with Server Components versus Client Components?

### 📖 Introduction
This is a direct synthesis of the public/private distinction and the build-time/runtime distinction covered earlier in this chapter, applied specifically to the Server/Client Components boundary.

### 🖥️ Server Components: Access to Any Variable
Server Components can access any environment variable — both private and `NEXT_PUBLIC_` — via `process.env.VARIABLE_NAME`, since their code runs exclusively on the server. Private secrets are safe to use here, since they never get bundled for the client.

### 💻 Client Components: Only `NEXT_PUBLIC_` Variables — Everything Else Is Silently Undefined
Client Components can only access `NEXT_PUBLIC_`-prefixed variables, and only because those specific values got inlined into the client bundle at build time. Attempting to read a private, non-prefixed variable inside a Client Component returns `undefined`, since that variable was never included in the client bundle at all. This isn't an error or exception, which can make it a subtle, silent bug if not caught during development or testing.

### 🏗️ The Practical Pattern This Enforces
Since Client Components structurally can't access private env vars, the only way for client-side code to use secret-dependent functionality is to go through a Server Component, Server Action, or Route Handler that holds the secret and performs the sensitive operation on its behalf. This is a genuinely satisfying architectural consequence: the Server/Client boundary naturally enforces good secret-handling hygiene, since there's structurally no way for a Client Component to accidentally leak a private variable it never had access to in the first place.

### 🎯 A Concrete Illustration of the Silent-Undefined Gotcha
```jsx
"use client";
function Widget() {
  console.log(process.env.DATABASE_URL); // undefined — silently, no error
  console.log(process.env.NEXT_PUBLIC_API_URL); // works — inlined at build time
}
```

### ❓ Follow-up Interview Questions

1. What happens when a Client Component tries to read a private environment variable?
2. Why doesn't this failure throw an error, and why does that make it more dangerous?
3. How does the Server/Client boundary naturally enforce good secret-handling practices?
4. If a Client Component needs data derived from a secret, what's the correct architectural pattern?
5. Why can a Server Component safely read a private variable that a Client Component structurally can't?

---

## 8. How would you validate that required environment variables are present at application startup?

### 📖 Introduction
Missing environment variables tend to fail silently and late — worth catching them immediately instead.

### 😩 The Problem Without Validation
A missing or misspelled environment variable typically doesn't cause an immediate, obvious error — the app just starts normally, and the missing value surfaces later as a confusing runtime bug, like a database connection failing mysteriously, potentially deep into production usage rather than being caught immediately at deploy or startup time.

### 🛠️ The Solution: A Schema-Based Validation Module
Using a schema library like Zod to explicitly define the required shape of all expected environment variables, and throwing a clear, immediate error if any are missing or malformed:
```js
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export const env = envSchema.parse(process.env); // throws immediately if invalid
```

### ⏰ Where This Validation Should Run: As Early as Possible
Importing and running this validation module as early as possible in the app's startup path — imported at the top of the root layout, or a dedicated startup hook — so a misconfigured deployment fails immediately and loudly (a "fail fast" principle), rather than deploying successfully and then failing mysteriously later when a specific code path finally tries to use the missing variable.

### 💎 Good to Know: The Additional Benefit — Type Safety
Using a schema library also gives you a typed `env` object, rather than the raw, all-string `process.env`, catching typos or incorrect usage at build/type-check time too, not just runtime — a genuinely valuable, compounding benefit beyond just presence-checking.

### ❓ Follow-up Interview Questions

1. Why does a missing environment variable often fail silently rather than immediately?
2. What does the "fail fast" principle mean in the context of environment variable validation?
3. Where should this validation module be imported to catch misconfiguration as early as possible?
4. What extra benefit does a schema library provide beyond checking that a variable is present?
5. What would `envSchema.parse(process.env)` do if `DATABASE_URL` were missing entirely?

---

## 9. What are common security risks associated with mismanaged environment variables, and why should secrets never be committed to version control?

### 📖 Introduction
Earlier in this chapter covered the `NEXT_PUBLIC_` exposure risk specifically — this widens the lens to broader security risks, with a particular focus on the permanence of committing a secret to version control.

### 🔍 Recap: The `NEXT_PUBLIC_` Exposure Risk
Covered in depth earlier in this chapter — a secret accidentally marked `NEXT_PUBLIC_` gets inlined into the client bundle, visible to anyone.

### 📜 Why Committing a Secret to Version Control Is Permanent, Even After "Removing" It
A genuinely important, often-misunderstood point: a secret committed to Git history remains recoverable forever, even after it's later "removed" in a subsequent commit. Git's own history preserves every prior version of every file, so simply deleting a line containing a secret in a new commit does not actually remove it from the repository's history — anyone with repo access, or anyone on the internet for a public repo, can still find it by browsing history or using `git log`/`git blame`. "I deleted it in the next commit" does not undo the exposure.

### 📋 Secrets Leaking Through Error Messages and Logs
A genuinely practical, often-overlooked risk: an unhandled error that includes environment variable values in its stack trace or error message — a database connection error accidentally including the full connection string, credentials and all, in the logged text — can leak secrets into log aggregation or monitoring services that may have broader access than the secret itself should. This ties back to the general "never log sensitive data" principle covered in the Error Handling chapter, applied here specifically to env-var-derived secrets.

### 🔄 The Only Real Remediation: Rotate the Secret Immediately
If a secret does get committed or exposed, rotating it immediately — generating a brand-new credential and revoking the old one — is the only real fix. Simply removing it from the repo, or even rewriting Git history (itself risky and disruptive for a shared repo), doesn't undo the fact that the old value may already have been seen or copied by someone. Assume it's compromised the moment it's committed.

### ❓ Follow-up Interview Questions

1. Why does deleting a secret in a later commit not actually remove it from the repository?
2. How could an unhandled error accidentally leak a secret into a logging service?
3. Why is rotating a secret the only real fix once it's been exposed?
4. Why is rewriting Git history considered risky, even though it technically removes the file content?
5. What mindset should a team adopt the moment they discover a secret was committed?

---

## 10. How would you manage environment variables and secrets securely across development, staging, and production?

### 📖 Introduction
This pulls together the earlier questions in this chapter into an actual, practical multi-environment strategy.

### 🚫 Never Commit Actual Secrets — Recap Briefly
`.env.local`, gitignored by default, for developer-specific secrets locally, and a dedicated secrets-management service (the next question goes deeper on cloud/containerized specifics) for staging and production.

### 🪞 Environment Parity Where Reasonable
Staging should closely mirror production's configuration structure — same variable names, different values — so configuration-related bugs surface in staging before reaching production, rather than staging using a completely different config shape that doesn't actually test the production configuration path.

### 🔐 Least-Privilege Access Per Environment
Production secrets — a real payment provider key, a production database credential — should be accessible to a smaller, more restricted set of people and systems than development secrets, which are typically lower-stakes sandbox or test credentials. Not every developer needs access to production secrets just to work on the codebase locally.

### 🏛️ A Dedicated Secrets Manager for Staging/Production
Rather than plain `.env` files sitting on a server's filesystem — themselves a security liability if that server is compromised — a secrets manager (Vault, AWS Secrets Manager, Doppler, or similar) provides audit logs of who accessed what secret when, automatic rotation capabilities, and centralized revocation, making the "rotate immediately" remediation from earlier in this chapter much easier than manually updating `.env` files across every server.

### ❓ Follow-up Interview Questions

1. Why should staging closely mirror production's configuration structure rather than using a different shape?
2. Why shouldn't every developer have access to production secrets?
3. What risk does storing secrets in plain `.env` files on a server's filesystem introduce?
4. What capabilities does a dedicated secrets manager provide beyond just storing values?
5. How does a secrets manager make secret rotation easier compared to manually updating files across servers?

---

## 11. How would you handle environment variables in a containerized or cloud-based deployment?

### 📖 Introduction
Containers introduce a genuine tension with the build-time nature of `NEXT_PUBLIC_` variables — worth understanding the workarounds, and how cloud platforms typically sidestep the problem for private variables.

### 🐳 The Core Challenge: "Build Once, Deploy Many" vs. Build-Time `NEXT_PUBLIC_` Variables
A Docker image is typically built once and deployed across multiple environments. But `NEXT_PUBLIC_` variables are baked in at build time, meaning if different environments need different `NEXT_PUBLIC_` values, a single container image can't naively serve all of them without some additional trick.

### 🔧 Workarounds: Separate Images vs. Runtime Substitution
Two approaches: building a separate container image per environment — defeats the "build once" ideal, but simple and reliable — or using runtime substitution, a startup script inside the container that replaces placeholder values in the already-built JavaScript files with actual environment-specific values, read from the container's runtime environment variables, right before the server actually starts. A genuinely clever, if slightly hacky, technique some teams use specifically to preserve "build once, deploy many" even for `NEXT_PUBLIC_` variables.

### 🔒 Injecting Private Secrets at Runtime, Not Baked Into the Image
For private variables, which don't have this build-time problem, secrets should be injected via the orchestration platform's own secrets mechanism — Kubernetes Secrets, AWS ECS task definitions' secrets integration — rather than baked into the container image itself. A container image with secrets baked in is a genuinely risky artifact, since anyone with access to that image, like a container registry, could extract the secrets from its layers.

### ☁️ Cloud-Provider-Native Secrets Integration
Modern cloud platforms — Vercel, AWS, and others — typically provide a native way to set environment variables per deployment or environment directly through their own dashboard or CLI, without needing `.env` files to exist in the deployed artifact at all. The platform injects them directly into the running process's environment, keeping secrets out of the build artifact or container image entirely for runtime (non-`NEXT_PUBLIC_`) variables.

### ❓ Follow-up Interview Questions

1. Why does "build once, deploy many times" become complicated specifically for `NEXT_PUBLIC_` variables?
2. What does runtime substitution actually do to an already-built JavaScript file?
3. Why is baking secrets directly into a container image a security risk?
4. How does a cloud platform's native secrets integration avoid needing `.env` files in the deployed artifact?
5. Between building separate images per environment and runtime substitution, what's the trade-off?

---

## 12. How would you design centralized configuration management for multiple Next.js applications sharing infrastructure?

### 📖 Introduction
This is a genuinely different scope from the rest of this chapter — not one app's environments, but multiple applications sharing infrastructure across an organization.

### 🏢 The Scenario: Multiple Apps, Shared Infrastructure
A large organization running multiple Next.js applications — a marketing site, a dashboard app, an admin panel — that share some infrastructure and config: a shared database, a shared auth provider, a shared analytics key. Without centralization, each app's team maintains its own, potentially inconsistent copy of these shared values.

### 📦 A Centralized, Shared Configuration Package
Extracting truly shared configuration values and validation schemas into a shared, internal package — or a centralized config service each app fetches from at startup — that all apps import and consume, rather than each app defining its own copy of the same shared values independently.

### 🪜 Per-App Overrides on Top of Shared Defaults
Mirroring the same "shared defaults plus specific overrides" philosophy from this chapter's `.env` file hierarchy, but applied at the organization level: a shared base configuration common to all apps, plus each app's own, app-specific environment variables layered on top.

### 🏛️ A Centralized Secrets Manager as the Single Source of Truth
A centralized secrets manager serving as the single source of truth for shared credentials — the shared database, the shared auth provider's API key — across all apps, so rotating a shared credential happens in one place and propagates to every app that consumes it, rather than needing to update the same secret independently across multiple, separate app repositories or deployments.

### ❓ Follow-up Interview Questions

1. What problem does a shared configuration package solve across multiple applications?
2. How does the "shared defaults plus overrides" philosophy scale from one app's environments to an organization's multiple apps?
3. Why does a centralized secrets manager make rotating a shared credential easier?
4. What risk does each app maintaining its own copy of shared config values introduce?
5. Would a per-app override ever need to take precedence over a shared default? Give an example.

---

## 13. How would you audit a Next.js application for configuration and secret-management issues?

### 📖 Introduction
This closing question pulls together everything covered in this chapter into a practical, actionable audit checklist.

### 🔍 Scan Version Control History for Accidentally Committed Secrets
Using tools like `git-secrets`, TruffleHog, or GitHub's own secret-scanning feature to search the entire Git history, not just the current state, for patterns resembling API keys or credentials that may have been committed at some point and never properly rotated.

### 🌐 Review Every `NEXT_PUBLIC_` Variable for Accidental Sensitivity
A manual or scripted review of every `NEXT_PUBLIC_` variable in the codebase, confirming each one is genuinely safe to expose publicly, and not a database URL or secret key that got mis-prefixed.

### ✅ Verify Startup Validation Actually Exists
Confirming the application actually fails fast and loudly if a required environment variable is missing, rather than silently proceeding with `undefined` values that surface as confusing bugs later.

### 📋 Check for Secrets Leaking Into Logs or Error Messages
Reviewing error-handling code and logging configuration for any place where a raw error object, potentially containing a connection string or credential, might get logged or sent to a monitoring service without sanitization.

### 🔐 Confirm Least-Privilege Access to Production Secrets
Auditing who actually has access to production secrets, via the secrets manager's own access logs and permissions, and confirming it's genuinely limited to those who need it, not the entire engineering organization by default.

### ❓ Follow-up Interview Questions

1. Why does scanning Git history matter more than just checking the current state of the repository?
2. What would a review of `NEXT_PUBLIC_` variables specifically be looking for?
3. How would you verify that startup validation is actually working, rather than just assuming it exists?
4. What kind of code change would you look for that might leak a secret into logs?
5. Why does auditing access permissions matter as much as auditing the secrets themselves?

---