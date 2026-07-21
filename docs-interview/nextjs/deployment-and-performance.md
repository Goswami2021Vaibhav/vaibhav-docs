---
title: Deployment & Performance
description: Build output, code splitting, Edge vs Node runtime, and production performance.
sidebar_position: 15
---

# Deployment & Performance

## 1. What happens when you run `next build`, and what does the production build output actually contain?

### 📖 Introduction

Everything covered so far in this guide — static vs. dynamic rendering, Server Components, caching, image and font optimization — is source-level behavior. `next build` is the step where all of that gets compiled down into a concrete, deployable artifact. Understanding what actually happens during this step, and what ends up in the output, turns deployment from a black box into something you can reason about and debug.

### 🏗️ The Build Process at a High Level

Running `next build` triggers a full production compilation of the application. This includes type-checking (unless disabled), compiling and bundling all JavaScript and TypeScript, pre-rendering every route that can be statically generated, and producing optimized assets for anything the Image and Font Optimization chapter covered. It also runs any code that needs to execute at build time, like `generateStaticParams` for dynamic static routes.

### 📦 What the Build Output Actually Contains

The output lands in the `.next/` directory, and it contains several distinct pieces:

- **Pre-rendered pages** — HTML and the corresponding RSC payload for every route that qualifies for static rendering, exactly as discussed in the Rendering Strategies chapter.
- **Compiled JavaScript bundles** — minified, tree-shaken (the next question goes deeper on this), and split per route rather than shipped as one giant file.
- **A build manifest** — a mapping that tells the production server which bundles and assets belong to which route, so the right JavaScript is served for the right page.
- **Server-side code for dynamic routes and Route Handlers** — the parts of the app that can't be pre-rendered ahead of time, packaged and ready to execute when a request actually arrives at `next start`.

None of this is meant to be inspected or edited by hand — `.next/` is a generated artifact, similar in spirit to a `dist/` folder in other frameworks, and it gets regenerated fresh on every build.

### 📊 The Build-Time Summary Output: A Genuinely Useful Diagnostic

After a successful build, Next.js prints a table listing every route, its rendering type (static, dynamic, and a few other markers depending on the version), and its bundle size. This is one of the most practically useful things in this entire workflow — it's an immediate, no-extra-tooling way to catch a route that accidentally became dynamic when it should have stayed static (the "accidental dynamic" trap covered in the Rendering Strategies chapter), or a route whose bundle size has quietly ballooned. Catching this at build time, before a deploy even happens, is far cheaper than catching it in production monitoring later.

### 💎 Good to Know: This Is Where Earlier Concepts Actually Get Realized

A lot of what this guide has covered — static rendering, streaming, Server Components not shipping to the client, image and font optimization — are decisions made in source code. `next build` is the point where those decisions get compiled into their actual, physical form: specific HTML files, specific JavaScript chunks, specific asset files. If a mental model of "static vs. dynamic" or "server vs. client" ever feels abstract, the build output table is the most concrete way to see it made real.

### ❓ Follow-up Interview Questions

1. What's the difference between `next build` output and `next dev`'s behavior — why can't you just deploy straight from dev mode?
2. If a route you expected to be static shows up as dynamic in the build output, what would you check first?
3. What is `generateStaticParams`, and how does it relate to what gets pre-rendered during the build?
4. Why does `.next/` get regenerated on every build rather than being incrementally updated?
5. How does the build output differ between a route using the Node.js runtime and one using the Edge Runtime?

---

## 2. What is automatic code splitting in Next.js, and how does it reduce the JavaScript sent to the browser?

### 📖 Introduction

Without any splitting, an application's entire JavaScript would need to be downloaded by every visitor, regardless of which single page they came to view. Code splitting is the technique that avoids this, and Next.js applies it automatically without requiring any configuration.

### ✂️ What Code Splitting Actually Is

Instead of bundling an entire application into one large JavaScript file, the application is broken into smaller chunks, generally one per route. A user visiting `/dashboard` only downloads the JavaScript needed to render the dashboard route, not the code for every other route in the app they may never visit. This directly shrinks the amount of JavaScript a browser has to download, parse, and execute before a page becomes interactive.

### ⚙️ How Next.js Does This Automatically, Per Route

Because Next.js uses file-based routing (covered in the App Router & Routing chapter), the framework already knows, at build time, exactly which code belongs to which route. It uses that information to automatically split each route's page component, along with its Client Component dependencies, into its own bundle — no manual `import()` calls or bundler configuration required, unlike in some older bundling setups.

### 🧩 Shared Chunks: Avoiding Duplicate Code Across Routes

Splitting isn't simply "one bundle per route." Code that's shared across multiple routes — a common layout, a UI library used everywhere — gets extracted into its own separate shared chunk. That chunk is downloaded once and reused across every route that depends on it, rather than being duplicated inside each route's individual bundle. The build process is effectively doing dependency graph analysis to balance two goals: keeping each route's bundle focused on what that route actually needs, while avoiding shipping the same shared code multiple times.

### 💎 Good to Know: Works Alongside the Server/Client Boundary, Not Instead of It

Code splitting mainly concerns itself with client-side JavaScript. Server Component code, as the Server & Client Components chapter covered, never gets bundled for the client at all — it's a different, even more aggressive form of "don't send code that isn't needed." These two mechanisms aren't competing with each other; they work together. The Server/Client boundary decides what should never reach the browser in the first place, and code splitting decides how the JavaScript that does need to reach the browser gets divided up.

### ❓ Follow-up Interview Questions

1. How would you manually trigger additional code splitting for a component that isn't on the critical path, like a modal or a heavy chart library?
2. What's the difference between a per-route chunk and a shared chunk in terms of caching behavior across navigations?
3. Why doesn't Server Component code need to be split the same way Client Component code does?
4. Can code splitting alone fix a performance problem caused by a single route importing an enormous library? Why or why not?
5. How does the Router Cache, covered in the Caching and Revalidation chapter, interact with per-route JavaScript chunks during client-side navigation?

---

## 3. What is tree shaking, and how does it contribute to bundle optimization?

### 📖 Introduction

Tree shaking answers a different question than code splitting does. Code splitting decides how to divide up code that's actually needed; tree shaking decides what code isn't needed at all, and removes it before it ever reaches a bundle.

### 🌳 What Tree Shaking Actually Is

Tree shaking is a build-time process that analyzes a module's actual import and usage graph, then excludes any exported code that's imported but never used — a form of dead code elimination. Importing a single function from a large utility library, for example `import { debounce } from "lodash-es"`, should ideally result in only that one function's code ending up in the final bundle, not the entire library.

### ⚙️ How It Works Mechanically: Static Analysis of ES Module Imports

Modern JavaScript's ES Module syntax (`import`/`export`) is statically analyzable — meaning a bundler can determine, just by reading the code without running it, exactly which exports from a module are actually referenced elsewhere. Anything not referenced gets safely excluded. This is precisely why tree shaking works well with ES modules but poorly, or not at all, with older CommonJS `require()`-style imports: `require()` calls can be conditional and dynamic in ways that defeat this kind of static analysis.

### ⚠️ A Common Pitfall: Default Imports Can Defeat It

A genuinely practical gotcha worth knowing: importing an entire library's default export (`import _ from "lodash"`) instead of a specific named export (`import { debounce } from "lodash-es"`) can prevent tree shaking from working at all, because the bundler often can't determine which parts of that default export are actually being used. Preferring named imports over default or namespace imports is a small habit that has a direct, measurable effect on final bundle size.

### 💎 Good to Know: How This Relates to Code Splitting

Tree shaking and code splitting are complementary, but they operate at different levels. Tree shaking removes code that isn't used anywhere, shrinking what exists in the first place. Code splitting then takes what remains — the code that genuinely is used — and divides it into separate, per-route chunks so each page only downloads its share. One reduces total code; the other reduces what any single page has to download from that total.

### ❓ Follow-up Interview Questions

1. Why does importing an entire library's default export sometimes defeat tree shaking even if only one function from it is actually used?
2. How would you verify whether tree shaking is actually working for a specific dependency in your production bundle?
3. Why does tree shaking work poorly with CommonJS `require()` compared to ES Module `import`/`export`?
4. Can a library be structured in a way that makes it inherently difficult to tree-shake, regardless of how it's imported?
5. What's the relationship between tree shaking and the "dead code elimination" performed by a minifier — are they the same thing?

---

## 4. What is the Edge Runtime, how does it differ from the Node.js Runtime, and when should you choose one over the other?

### 📖 Introduction

Next.js can execute server-side code in two different runtimes, and the choice affects where in the world that code runs, how fast it starts up, and which APIs it can rely on. The Middleware chapter already touched on the Edge Runtime in passing, since Middleware always runs on it — this question gives the distinction its full treatment.

### ⚡ What the Edge Runtime Actually Is

The Edge Runtime is a lightweight JavaScript environment built entirely on web-standard APIs — `fetch`, `Request`, `Response`, the Web Crypto API — rather than on Node.js. It runs on V8 isolates, the same lightweight execution model used by browsers and services like Cloudflare Workers, which can be deployed to many geographic locations and started up almost instantly, without spinning up a full server process.

### 🖥️ What the Node.js Runtime Is, By Contrast

The Node.js Runtime is the full, familiar Node.js environment: access to the filesystem, native Node modules, TCP sockets, and the entire npm ecosystem that assumes Node APIs exist. It typically runs as a longer-lived server process in one or a handful of regions, rather than being distributed to edge locations close to every user.

### ⚖️ The Practical Differences

- **Cold start** — Edge isolates start up near-instantly; Node processes generally have a heavier cold start.
- **Geographic distribution** — Edge code can run physically close to the requesting user almost anywhere; Node deployments are usually concentrated in a smaller number of regions.
- **API surface** — Edge is restricted to Web APIs only; there's no `fs`, no native modules, no arbitrary npm package support.
- **Execution limits** — Edge functions typically have stricter constraints on CPU time and memory than a Node process does.
- **Database connectivity** — many database drivers rely on Node's `net` module for raw TCP connections, which simply isn't available on the Edge Runtime; this is one of the most common reasons a route can't run there.

### 🧭 When to Choose One Over the Other

Edge fits light, latency-sensitive logic that benefits from running close to the user globally — the kind of work Middleware does (auth checks, geolocation-based redirects, A/B test bucketing), or simple Route Handlers that don't need heavy compute or Node-specific dependencies. Node.js is the right choice for anything that needs a full database driver, filesystem access, a large or Node-dependent npm package, or execution time beyond what Edge allows.

### 💎 Good to Know: It's Configurable Per Route

Outside of Middleware, which always runs on the Edge Runtime, individual Route Handlers and pages can opt into either runtime with `export const runtime = 'edge'` or `'nodejs'`. This means the decision isn't all-or-nothing at the application level — it can be made route by route, based on what each one actually needs.

### ❓ Follow-up Interview Questions

1. Why can't most traditional database drivers run on the Edge Runtime?
2. Why does Middleware always run on the Edge Runtime rather than letting you choose?
3. If a Route Handler needs both low latency and a Node-only dependency, how would you resolve that conflict?
4. What happens if you try to import a Node-only module into code running on the Edge Runtime?
5. How does the choice of runtime affect the cost model of a deployment, and why?

---

## 5. What are the trade-offs between deploying on Vercel, self-hosting, and using another cloud provider?

### 📖 Introduction

Next.js is open source and can run anywhere Node.js can, but not every hosting option gives you the same features out of the box. This is a decision that's less about "which is technically correct" and more about which trade-offs a given team is willing to accept.

### ▲ Deploying on Vercel

Vercel is built by the same team that builds Next.js, so features like ISR, on-demand revalidation, the Image Optimization API, and Edge Middleware work with zero infrastructure setup — deployment is close to a `git push` away. It also provides automatic preview deployments for every pull request. The trade-off is cost, which scales with usage, and a degree of platform lock-in: some of these conveniences depend on infrastructure that isn't trivial to replicate elsewhere.

### 🏠 Self-Hosting

Running `next start` on your own server or container gives full control over infrastructure and can be considerably cheaper at scale, but the responsibility for everything Vercel provides automatically shifts onto the team: a caching layer for ISR, a CDN in front of static assets, an image optimization pipeline, and there's no built-in preview-deployment workflow. None of this is impossible — the Caching and Revalidation chapter's mechanisms still work — but they have to be wired into your own infrastructure rather than arriving for free.

### ☁️ Other Cloud Providers

Deploying to AWS, Google Cloud, Azure, Netlify, or similar platforms — often via a container or a dedicated adapter — sits between the two. It can integrate better with an organization's existing cloud investment, compliance requirements, or data residency rules, but unless the platform has built specific support for Next.js's features (some platforms provide adapters, like OpenNext for AWS Lambda), you may lose some of the framework-native optimizations that come for granted on Vercel.

### 💎 Good to Know: The Decision Is Rarely Purely Technical

In practice, this choice is usually driven by factors outside the framework itself: whether the organization already has cloud infrastructure and compliance processes built around a specific provider, how predictable the team wants their hosting costs to be, and how much engineering time they're willing to spend rebuilding what Vercel offers by default. There's no universally correct answer — only which trade-offs a given team is better positioned to absorb.

### ❓ Follow-up Interview Questions

1. If a company has strict data residency requirements, how might that affect the choice between Vercel and self-hosting?
2. What specifically would a team need to build themselves to replicate ISR on a self-hosted Node server?
3. Why might on-demand Image Optimization be harder to replicate on a self-hosted setup than on Vercel?
4. What is OpenNext, and what problem does it solve for teams wanting to deploy Next.js to AWS?
5. How would you evaluate whether the convenience of a managed platform is worth its cost for a given project?

---

## 6. What tools can be used to analyze and reduce bundle size in a production build?

### 📖 Introduction

Once a bundle size problem is suspected — whether flagged by the build output table or noticed through slow page loads — the next step is figuring out exactly what's contributing to it, rather than guessing.

### 🔍 Tools for Analyzing Bundle Size

- **`@next/bundle-analyzer`** — the standard Next.js-specific tool. It wraps `webpack-bundle-analyzer` and, after a build, generates an interactive treemap showing exactly what's inside each bundle and how much space every dependency actually occupies.
- **The build output table itself** — the simplest first check, discussed earlier in this chapter, showing per-route sizes without any extra tooling.
- **Generic bundle visualizers** like `webpack-bundle-analyzer` or `source-map-explorer` — useful for a finer-grained look when a project's bundler configuration is more customized.

### ✂️ Strategies for Reducing Bundle Size Once You've Found the Culprit

- **Dynamic imports** — `next/dynamic` lets a heavy component that isn't needed for the initial render (a modal, a chart library, a rich text editor) be loaded only when it's actually used, keeping it out of the initial bundle entirely.
- **Shifting logic to Server Components** — anything that doesn't need to run in the browser can move to the server, where, as the Server & Client Components chapter covered, it never gets bundled for the client at all.
- **Choosing lighter dependencies** — swapping a large library for a smaller alternative that covers the same need.
- **Making sure tree shaking is actually working** — using named imports rather than default imports, as covered earlier in this chapter, and being wary of barrel files that re-export far more than a given component actually needs.

### 💎 Good to Know: Measure Before Optimizing

The value of a bundle analyzer isn't just confirming that a bundle is large — it's identifying exactly which dependency is responsible, so effort goes toward the actual problem instead of guesswork. It's easy to assume a large framework or UI library is the culprit when in reality a single misimported utility function is pulling in an entire package.

### ❓ Follow-up Interview Questions

1. How does `next/dynamic` differ from a regular `import` statement in terms of when code actually loads?
2. If a bundle analyzer shows a large chunk attributed to a dependency you don't recognize, how would you trace where it's coming from?
3. Why might moving logic to a Server Component reduce bundle size more effectively than optimizing the same logic as a Client Component?
4. What is a barrel file, and how can it silently inflate a bundle even when only one export from it is used?
5. How would you decide whether a large dependency should be lazy-loaded, replaced, or left as-is?

---

## 7. How do Core Web Vitals influence deployment and performance decisions?

### 📖 Introduction

Core Web Vitals — Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP) — have come up already in this guide in the context of images and fonts. Here, the focus shifts to how they shape decisions at the deployment and infrastructure level, not just at the component level.

### 🎯 A Quick Recap

LCP measures how long the largest visible element takes to render, CLS measures unexpected visual shifting as a page loads, and INP measures how responsive the page feels to user interaction. All three are directly measurable and, importantly, are also a Google search ranking signal — which is why they matter beyond pure user experience.

### 🏗️ How They Shape Rendering and Infrastructure Decisions

- **Rendering strategy** — a statically generated or incrementally revalidated page can serve pre-rendered HTML immediately, which directly improves LCP compared to a dynamically rendered page that has to wait on a data fetch at request time.
- **Server response time (TTFB)** — this feeds directly into LCP, since nothing can paint before the HTML arrives. Choosing the Edge Runtime for latency-sensitive routes, or deploying on a platform with strong CDN edge coverage, reduces the network distance between server and user.
- **Image and font handling** — already covered in depth in the Image and Font Optimization chapter, but worth restating here: unoptimized images are a leading cause of poor LCP, and font loading without proper fallback matching is a leading cause of CLS.
- **Third-party scripts** — scripts loaded without a deliberate strategy (see `next/script`, also covered in the Image and Font Optimization chapter) can block the main thread and hurt INP.

### 💎 Good to Know: Deployment Choice Directly Affects Measured Vitals

A CDN with broad geographic edge coverage will produce meaningfully better real-world Core Web Vitals for a globally distributed audience than a single-region deployment, even if the application code is identical in both cases. This is part of why the trade-offs discussed earlier in this chapter between Vercel, self-hosting, and other cloud providers aren't purely about developer convenience — they have a direct, measurable effect on user-facing performance metrics. How these metrics are actually tracked once live is covered later in this chapter.

### ❓ Follow-up Interview Questions

1. Why does TTFB matter for LCP even though LCP is technically about rendering, not network time?
2. How would choosing ISR over full SSR for a given page affect its Core Web Vitals?
3. Why are Core Web Vitals a search ranking factor, and what does that imply for a business relying on organic traffic?
4. Can a page have excellent Lighthouse scores locally but poor real-world Core Web Vitals? Why?
5. How would a global CDN's edge coverage specifically affect LCP for users far from an application's origin server?

---

## 8. What are common performance bottlenecks in production Next.js applications, and how do you diagnose them?

### 📖 Introduction

Most performance problems in a production Next.js app trace back to a handful of recurring causes, and most of this guide's earlier chapters already cover the fix for each one — this question is about recognizing the symptom and knowing where to look.

### 🐢 Common Bottlenecks

- **Oversized client bundles** — often from unnecessary `"use client"` boundaries pulling more code into the client bundle than needed, or from default imports defeating tree shaking, both discussed earlier in this chapter.
- **Data fetching waterfalls** — sequential `await` calls that could have run in parallel, a pattern the Data Fetching chapter covers in detail.
- **Misconfigured caching** — a `fetch` call using `no-store` where cached data would have been fine, or a `revalidate` window that's too short for how often the underlying data actually changes, both covered in the Caching and Revalidation chapter.
- **Unoptimized images and fonts** — a direct contributor to poor LCP and CLS, covered in the Image and Font Optimization chapter.
- **Cold starts on serverless functions** — infrequently hit routes on serverless infrastructure can have a noticeably slower first response after a period of inactivity.
- **Unmanaged third-party scripts** — scripts loaded without a deliberate strategy blocking the main thread and hurting interactivity.

### 🔬 How to Diagnose Them

- **Lighthouse or PageSpeed Insights** for a quick, structured read on Core Web Vitals and specific improvement suggestions.
- **Chrome DevTools' Performance tab** for a detailed timeline of rendering, scripting, and layout work.
- **`@next/bundle-analyzer`**, covered earlier in this chapter, for identifying exactly which dependency is inflating a bundle.
- **Real User Monitoring (RUM)** — lab tools like Lighthouse run in a single, controlled environment, but real users have a huge range of devices and network conditions; RUM tools capture what's actually happening in the field, a distinction this chapter returns to later.
- **The build output table**, from earlier in this chapter, for catching a route that unexpectedly became dynamic.

### 💎 Good to Know: Symptoms Can Overlap

A slow LCP could be caused by an unoptimized image, a missing cache, a cold serverless start, or a data-fetching waterfall — the same symptom can have several different root causes. This is exactly why diagnosis tools that isolate specific stages (network time vs. rendering time vs. script execution time) matter more than looking at a single aggregate score.

### ❓ Follow-up Interview Questions

1. How would you tell the difference between a slow LCP caused by TTFB versus one caused by a large image?
2. What's a data-fetching waterfall, and how would you spot one in a request timeline?
3. Why might a serverless function's cold start be a bigger issue for a low-traffic internal tool than for a high-traffic public page?
4. How would you use Chrome DevTools specifically to isolate a main-thread blocking issue caused by a third-party script?
5. Why isn't a single Lighthouse score enough to fully diagnose a production performance issue?

---

## 9. How would you design a deployment strategy for a high-traffic enterprise application?

### 📖 Introduction

A single-server deployment that works fine for a small app breaks down under enterprise-level traffic. Designing for this scale means thinking about caching, scaling, rollout safety, and observability together, rather than treating deployment as an afterthought.

### 🌍 Global Distribution and Caching

Static and incrementally revalidated pages should be served from a CDN with broad edge coverage, so users anywhere in the world get a response from a nearby location rather than a single origin region. The layered caching model from the Caching and Revalidation chapter — Data Cache, Full Route Cache, and CDN-level caching — should be deliberately tuned so as little traffic as possible reaches the origin server at all.

### 📈 Scaling the Compute Layer

Whether running on serverless functions or containers, the infrastructure needs to autoscale with traffic rather than being sized for peak load at all times, which is both wasteful and risky if actual peak exceeds the fixed provisioning. Rate limiting at the Middleware or edge layer, covered in the Middleware chapter, protects backend services from being overwhelmed during traffic spikes.

### 🚦 Safe Rollouts

Enterprise-scale deployments generally can't tolerate a bad release reaching 100% of traffic at once. A staged rollout approach — canary or blue-green deployment — limits exposure to a small percentage of traffic first, with the ability to roll back quickly if something regresses. This chapter goes into that specific mechanism in more depth next.

### 🔭 Observability Built In From the Start

None of the above is verifiable without monitoring — error rates, latency, and Core Web Vitals need to be tracked continuously in production, not just checked once at deploy time. This chapter covers monitoring in more detail shortly.

### 💎 Good to Know: This Is a Systems Design Problem, Not Just a Next.js Configuration Problem

At enterprise scale, the questions being asked are less about Next.js-specific settings and more about general distributed systems design: caching layers, autoscaling, rollout safety, and observability. Next.js provides the primitives — rendering strategies, caching APIs, Middleware, Edge Runtime — but the overall strategy is assembled the same way it would be for any high-traffic web application.

### ❓ Follow-up Interview Questions

1. Why is a fixed-capacity server deployment risky for a high-traffic enterprise application, even if it handles average load fine?
2. How would rate limiting at the Middleware layer help protect a backend database during a traffic spike?
3. Why might a canary rollout be preferred over deploying a new version to all users simultaneously?
4. What role does the CDN play in reducing load on the origin server for a high-traffic application?
5. How would you decide which parts of an enterprise application should stay dynamic versus which should be static or incrementally revalidated?

---

## 10. How would you implement zero-downtime deployments for a Next.js application?

### 📖 Introduction

A zero-downtime deployment means a new version goes live without dropping in-flight requests or serving errors during the cutover — users should never notice a deployment happened at all. This builds directly on the canary and blue-green rollout ideas mentioned earlier in this chapter.

### 🔵🟢 Blue-Green Deployment

Two full environments run side by side: "blue" is the currently live version, "green" is the new one. Traffic is only switched to green once it's fully deployed and passing health checks. Blue is kept running for a short period afterward, so a rollback is just switching traffic back, rather than a rebuild-and-redeploy cycle under pressure.

### 🔄 Rolling Deployment

Instead of an all-at-once switch, instances or containers behind a load balancer are replaced gradually, one at a time. At every point during the rollout, some capacity is still serving the old version while new instances come online — the application is never fully down, even briefly.

### 🐤 Canary Deployment

A small percentage of traffic is routed to the new version first, and only ramped up gradually once it's confirmed healthy — the deeper version of the canary rollout mentioned earlier in this chapter. This limits the blast radius of a bad release to a small fraction of users rather than everyone at once.

### ⚙️ How Platforms Like Vercel Handle This Automatically

On Vercel, each deployment produces its own immutable build with its own URL, and promoting a deployment to production is an atomic traffic cutover rather than an in-place update to a running server. This is effectively blue-green deployment handled by the platform, without needing to configure it manually.

### 💎 Good to Know: Database Migrations Are the Hard Part

The application layer being zero-downtime doesn't help if a database schema migration breaks compatibility with the previous version still running during the rollout window. Migrations need to be backward compatible — for example, adding a new column as nullable rather than immediately requiring it — so that both the old and new application versions can operate against the same schema until the rollout fully completes.

### ❓ Follow-up Interview Questions

1. Why is a rolling deployment considered safer than simply stopping the old version and starting the new one?
2. What specifically makes a database migration "backward compatible," and why does that matter during a rollout?
3. How does Vercel's per-deployment immutable URL model relate to the blue-green deployment pattern?
4. What would a health check need to verify before traffic is allowed to shift to a new version?
5. If a canary deployment shows an elevated error rate, what should happen next in the rollout process?

---

## 11. How would you monitor performance and detect issues in a production application after deployment?

### 📖 Introduction

Diagnosing an issue, covered earlier in this chapter, assumes you already know something is wrong. Monitoring is what tells you that in the first place — often before users start complaining.

### 📊 Real User Monitoring (RUM)

Tools like Vercel Analytics, or similar RUM integrations, capture actual Core Web Vitals from real visitors' browsers in the field, rather than from a single controlled lab environment. This is the only way to see how performance actually varies across the real mix of devices, network conditions, and geographies an application's users have — the distinction between lab and field data raised earlier in this chapter.

### 🐛 Error Tracking

Tools like Sentry capture unhandled exceptions from both the client and the server, along with enough context — stack traces mapped back through source maps, request details — to actually debug the failure rather than just knowing it happened.

### 🖥️ Infrastructure and APM Monitoring

Request latency, error rates, and uptime are tracked either through a platform's native dashboards or a dedicated APM tool. This is what surfaces server-side slowdowns — a database query getting slower over time, a third-party API degrading — that wouldn't necessarily show up in frontend-focused metrics.

### 🤖 Synthetic Monitoring

Scheduled, automated checks — a Lighthouse run on a cron schedule, or uptime pings from multiple external locations — catch regressions proactively, even during periods of low real traffic where RUM data would be too sparse to notice a problem quickly.

### 🚨 Alerting

None of the above is useful without alerting thresholds tied to it — a spike in error rate or a jump in latency should page someone, rather than sit unnoticed in a dashboard until a user reports it.

### 💎 Good to Know: Different Tools Answer Different Questions

RUM answers "what are real users actually experiencing," synthetic monitoring answers "is the application currently working at all," and APM answers "why is something slow on the server side." None of these substitute for each other — a comprehensive monitoring setup layers all of them together.

### ❓ Follow-up Interview Questions

1. Why can't synthetic monitoring alone tell you what real users are actually experiencing?
2. What's the practical difference between an error tracking tool and an APM tool?
3. Why does RUM data need a reasonable sample size before it can be trusted?
4. How would source maps affect how useful an error tracking tool's stack traces actually are?
5. If error rate alerting fires but Core Web Vitals look fine, what does that suggest about where the problem lies?

---

## 12. What strategies would you use to improve Core Web Vitals for an already-deployed production application?

### 📖 Introduction

Improving Core Web Vitals after launch starts with diagnosis, not guessing — RUM and Lighthouse data, both covered earlier in this chapter, should point to which specific metric is actually underperforming before deciding what to change.

### 🖼️ Improving LCP

Converting more pages to static rendering or ISR where the content allows it directly reduces the time to first render, since the Rendering Strategies chapter's static pages skip the request-time data-fetch delay entirely. Ensuring the largest visible image uses `next/image` with the `priority` prop, so it isn't lazy-loaded, and confirming caching is actually configured correctly (from the Caching and Revalidation chapter) both reduce the time before that largest element can paint.

### 📐 Improving CLS

Auditing font loading through `next/font`, covered in the Image and Font Optimization chapter, prevents the layout jump caused by a fallback font being swapped for a custom one after it loads. Explicit width and height on images, and reserved space for anything that loads asynchronously — ads, embeds, dynamically inserted banners — prevents that content from pushing everything else down once it arrives.

### ⚡ Improving INP

Auditing which client-side JavaScript is actually necessary on initial load, deferring heavy interactive components with `next/dynamic`, and reviewing third-party scripts for a more deliberate loading strategy via `next/script` — all covered earlier in this chapter and the Image and Font Optimization chapter — reduces how much work the main thread has to do before it can respond to user input.

### 💎 Good to Know: Improvements Take Time to Show Up in Field Data

Because Core Web Vitals field data is aggregated from real user sessions over a rolling window, a fix deployed today won't immediately show improved metrics — it takes time for enough real user data to accumulate before the new numbers reflect reality. This is why iterating one change at a time, rather than shipping many changes simultaneously, makes it much easier to tell which specific fix actually moved the needle.

### ❓ Follow-up Interview Questions

1. Why might converting a page from dynamic rendering to ISR improve its LCP specifically?
2. How does reserving space for an image before it loads prevent a CLS penalty?
3. Why does deferring third-party scripts help INP rather than LCP or CLS?
4. Why is it risky to ship several Core Web Vitals fixes at once if the goal is to understand what worked?
5. Why does field data take longer to reflect a fix than a local Lighthouse run does?

---

## 13. Explain the complete lifecycle of a Next.js production build and deployment, from `next build` to a served request.

### 📖 Introduction

This question ties together nearly everything covered in this guide so far into a single, continuous flow — from source code, through the build step, through deployment, to an actual request being served in the browser.

### 🏗️ Build Phase

`next build` compiles and type-checks the application, tree-shakes unused code, splits the remaining code into per-route and shared chunks, and pre-renders every route that qualifies for static generation — producing HTML, RSC payloads, a build manifest, and the diagnostic output table, all covered earlier in this chapter.

### 🚀 Deploy Phase

The resulting build artifact is deployed to a hosting platform — Vercel, a self-hosted server, or another cloud provider, each with its own trade-offs as discussed earlier. The rollout itself happens through a zero-downtime mechanism — blue-green, rolling, or canary — so the cutover to the new version doesn't disrupt requests currently in flight.

### 🌐 Serving a Request

When a request actually arrives, it first hits the CDN edge. If a cached static asset or a previously generated static or ISR page exists there, it's served immediately without ever reaching the origin server. If not, the request proceeds inward: Middleware runs first, on the Edge Runtime, handling redirects, rewrites, or auth checks as covered in the Middleware chapter. From there, the request is routed to the appropriate handler — either pulling pre-rendered output from the Full Route Cache, or executing a dynamic render or Route Handler on whichever runtime, Node.js or Edge, that route is configured to use.

### 🗄️ Where Caching Fits In

Before any actual data-fetching work happens, the layered caching model from the Caching and Revalidation chapter — Request Memoization, the Data Cache, and the Full Route Cache — is checked, and revalidation only happens according to that route's configured strategy, whether time-based or triggered on demand.

### 💻 What Happens in the Browser

The response — HTML plus the RSC payload — reaches the browser, which hydrates any Client Components using the per-route JavaScript chunk from the code-splitting step, discussed earlier in this chapter. The Router Cache then takes over for subsequent client-side navigations, avoiding a full server round-trip for pages already visited.

### 💎 Good to Know: This Whole Flow Is Being Watched

While all of this runs, the monitoring layers discussed earlier in this chapter — RUM, error tracking, APM, synthetic checks — observe it in real time, and infrastructure scales to meet demand as traffic changes. The build-to-request lifecycle isn't a one-time event; it's a loop that repeats on every deploy, continuously informed by what monitoring reveals about the previous version's real-world behavior.

### ❓ Follow-up Interview Questions

1. At what point in this lifecycle would a cache miss cause a request to actually reach the origin server?
2. Why does Middleware run before routing decides which handler serves the request?
3. How does the Router Cache change what happens on a client-side navigation compared to this full lifecycle?
4. If a route is misconfigured to be dynamic when it should be static, at which stage of this lifecycle would that show up first?
5. How would this lifecycle differ for a page using SSG versus one using full SSR?

---

## 14. How would you decide whether a given route or function should run on the Edge Runtime or the Node.js Runtime?

### 📖 Introduction

Earlier in this chapter, the Edge and Node.js runtimes were compared side by side. This question is about turning that comparison into an actual decision process for a specific route.

### 🚫 Step One: Is There a Hard Dependency on Node?

If a route needs a database driver that opens raw TCP connections, the filesystem, a native Node module, or any npm package that assumes Node's built-in APIs exist, the Node.js Runtime isn't a preference — it's a requirement. The Edge Runtime's Web-standard-only API surface simply can't run that code, so this question is settled before any performance trade-off even enters the conversation.

### ⚖️ Step Two: If There's No Hard Dependency, Is It a Genuine Trade-off?

Assuming a route could technically run on either runtime, the question becomes whether it benefits meaningfully from the Edge Runtime's low-latency global distribution and near-instant cold starts. Lightweight, latency-sensitive logic — an auth check, a redirect, geolocation-based personalization, a feature flag lookup — is exactly the kind of work Middleware already does on the Edge Runtime, and the same reasoning extends to Route Handlers doing similar work.

### ⏱️ Step Three: Consider Resource and Duration Constraints

The Edge Runtime typically enforces stricter limits on CPU time and memory than the Node.js Runtime does. A route doing heavier computation, or one that legitimately needs more execution time, is better suited to Node even without a hard API dependency, simply to avoid running into those constraints.

### 💰 Step Four: Consider the Cost Model

Different hosting platforms often price Edge and Node execution differently. Once the technical requirements are satisfied, cost can be a legitimate tiebreaker between two runtimes that would both technically work.

### 💎 Good to Know: A Simple Mental Checklist

In practice, the decision collapses to: a hard Node dependency means Node, no exceptions. No dependency plus latency-sensitive and lightweight means Edge is usually the better default. No dependency but heavier compute or longer execution means Node, even without a strict requirement forcing it. This mirrors why Middleware, covered in its own chapter, has no runtime choice at all — its use case sits squarely in the "lightweight and latency-sensitive" category the Edge Runtime was built for.

### ❓ Follow-up Interview Questions

1. If a Route Handler needs to call an external API but do no heavy computation, which runtime would generally fit better, and why?
2. Why doesn't the Edge Runtime simply support the full Node.js API surface to avoid this decision entirely?
3. How would you migrate a route from the Node.js Runtime to the Edge Runtime if a dependency turned out to be the only blocker?
4. Why is Middleware's runtime not configurable, while a Route Handler's is?
5. Could a single application reasonably use both runtimes across different routes? What would guide that split?

---
