---
title: Rendering Strategies
description: SSR, SSG, ISR, and CSR — what each one actually does and when to use it.
sidebar_position: 3
---

# Rendering Strategies

## 1. What are the main rendering strategies in Next.js (SSR, SSG, ISR, CSR), and why does a framework need to support multiple ones?

### 📖 Introduction
This chapter covers each rendering strategy in depth individually — this opening question is a map of all of them together, and the reasoning for why a single framework needs to support so many different approaches at once.

### 🗺️ The Four Main Strategies, Briefly
- **SSR (Server-Side Rendering)** — HTML generated on the server, fresh, for each individual request.
- **SSG (Static Site Generation)** — HTML generated once, at build time, and reused for every request.
- **ISR (Incremental Static Regeneration)** — a hybrid: static generation with the ability to regenerate periodically or on demand, without a full rebuild.
- **CSR (Client-Side Rendering)** — HTML generated in the browser, after JavaScript downloads and executes.

(A newer hybrid, Partial Prerendering, gets its own full treatment later in this chapter.)

### 🎯 Why a Framework Needs to Support Multiple Ones
Different pages within the same app genuinely have different requirements. A marketing homepage rarely changes and benefits from being pre-built once (SSG). A user's personalized dashboard needs fresh, per-request data (SSR). A product catalog with thousands of pages that change occasionally benefits from ISR — built once, refreshed periodically without a full rebuild. A highly interactive widget, like a drag-and-drop editor, might be best as CSR since it doesn't need server rendering at all. No single strategy fits every page, which is exactly why Next.js supports all of them per route, rather than forcing one choice for the whole app.

### 💎 Good to Know: The Underlying Trade-off — Freshness vs. Cost to Serve
Rendering strategy is fundamentally a trade-off between how fresh the data needs to be and how fast/cheap it is to serve. Static strategies (SSG/ISR) are cheaper and faster to serve — pre-built, served from a CDN — but less fresh. Dynamic strategies (SSR) are fresher but costlier, since they require server work on every request. CSR shifts the work entirely to the client, trading initial load speed for offloading server cost.

### ❓ Follow-up Interview Questions

1. Why might a single application legitimately use more than one rendering strategy across different pages?
2. What's the core trade-off every rendering strategy decision comes down to?
3. Give an example of a page that's a poor fit for SSG specifically.
4. Why does a static page cost less to serve at scale than a server-rendered one?
5. Where does CSR fit into the freshness-vs-cost trade-off compared to SSR and SSG?

---

## 2. What is Server-Side Rendering (SSR), and how does it work?

### 📖 Introduction
SSR is the rendering strategy for content that genuinely needs to be fresh on every single request — here's exactly what triggers it and what it costs.

### 🖥️ What SSR Actually Is
HTML is generated on the server for each individual request, using whatever data is current at that exact moment. Unlike SSG, which builds once ahead of time, SSR happens every single time a user requests the page.

### ⚙️ How It Works Mechanically in Next.js
A route becomes dynamically rendered (SSR) when it uses something that can only be known at request time — reading cookies or headers, using `searchParams`, or explicitly opting in via a `fetch()` call with `{ cache: 'no-store' }`, or a route segment config like `export const dynamic = 'force-dynamic'`. Next.js detects these signals automatically (a later question in this chapter goes deeper into exactly how).

### 🔄 The Request-Response Flow
A user requests the page, the Next.js server runs the Server Component(s) for that route, fetches any needed data, renders to HTML, and sends the complete HTML to the browser, which paints it immediately.

### 🎯 When SSR Is the Right Choice
Pages that need per-user, personalized, or highly time-sensitive data — a user's account dashboard showing their own current data, a page that must reflect real-time inventory or stock levels, or content gated behind authentication that differs for every logged-in user.

### 💎 Good to Know: The Cost — Server Work on Every Request
Every request requires server work — rendering plus data fetching — slower than serving a pre-built static file, and heavier server load under high traffic, since nothing can be cached or served from a CDN the way a static page can.

### ❓ Follow-up Interview Questions

1. What specific signals cause Next.js to render a route dynamically instead of statically?
2. Why can't an SSR page be served directly from a CDN the way a static page can?
3. Give an example of a page that genuinely needs SSR rather than SSG.
4. What happens on the server for every single request to an SSR page?
5. What's the main cost trade-off of choosing SSR over a static strategy?

---

## 3. What is Static Site Generation (SSG), and how does it differ from SSR?

### 📖 Introduction
SSG sits at the opposite end of the freshness-vs-cost trade-off from SSR — here's what makes it so much cheaper to serve, and where that comes at a real cost.

### 📄 What SSG Actually Is: Built Once, Served Forever
HTML is generated once, at build time (`next build`), and the same pre-built HTML is reused and served for every subsequent request — no per-request server work happens at all, aside from serving the already-built file.

### 🆚 The Key Distinguishing Axis: When Rendering Happens
SSR renders at request time, every single time, fresh. SSG renders once, at build time, and never again until the next build or deploy. This means SSG pages can be served directly from a CDN or edge cache, with no server compute needed per request at all — genuinely faster and cheaper to serve at scale than SSR. A route is statically rendered by default if it doesn't use any request-time-only APIs and doesn't explicitly opt into dynamic rendering.

### 🎯 When SSG Is the Right Choice
Content that's the same for every visitor and doesn't change often — marketing pages, blog posts once published, documentation pages, a product catalog that updates infrequently.

### 💎 Good to Know: The Staleness Problem, Setting Up ISR
SSG is incredibly fast to serve, but the content is frozen at build time — if the underlying data changes after the build (a blog post gets edited), the static page won't reflect that change until the next build. For content that changes frequently, this staleness is a real problem — exactly the gap Incremental Static Regeneration (the next question) fills.

### ❓ Follow-up Interview Questions

1. What's the key difference in *when* rendering happens between SSR and SSG?
2. Why can an SSG page be served from a CDN with zero server compute per request?
3. What happens to an already-built SSG page when the underlying data changes after deployment?
4. Give an example of content that's a good fit for SSG.
5. What real limitation of SSG motivates Incremental Static Regeneration?

---

## 4. What is Incremental Static Regeneration (ISR), and what problem does it solve that pure SSG cannot?

### 📖 Introduction
The previous question ended by flagging pure SSG's staleness problem — ISR is the direct answer to it.

### 🔄 What ISR Actually Is: Static, But Not Frozen Forever
ISR is a hybrid strategy: pages are still statically generated like SSG, but Next.js can regenerate them periodically or on demand, without requiring a full site rebuild. The site stays mostly static and fast to serve, but the content doesn't stay frozen forever the way pure SSG's would.

### ⏱️ How It Works: Time-Based Revalidation and Stale-While-Revalidate
Specifying a `revalidate` value (`export const revalidate = 60`, or a `fetch()` call with `{ next: { revalidate: 60 } }`) tells Next.js "this page's static output is considered fresh for 60 seconds." After that window, the next request triggers a background regeneration — crucially, the user making that triggering request still gets the old, stale cached page immediately, with nobody waiting for a rebuild. The regeneration happens in the background, and subsequent requests get the fresh version once it's ready. This pattern is called stale-while-revalidate.

### 🎯 On-Demand Revalidation, Briefly
Calling `revalidatePath()`/`revalidateTag()` — typically from a Server Action or Route Handler after a mutation (the Caching & Revalidation chapter goes much deeper) — can trigger regeneration immediately, rather than waiting for the time-based window to expire. Useful for "an admin just published a new blog post, regenerate that page right now rather than waiting up to 60 seconds."

### 💎 Good to Know: The Problem It Solves — Rebuilding Thousands of Pages for One Change
Pure SSG requires a full rebuild and redeploy to reflect any content change. For a site with thousands of pages — a large e-commerce catalog, for example — rebuilding the entire site just because one product's price changed is wasteful and slow. ISR lets individual pages regenerate independently, without rebuilding or redeploying the whole application.

### ❓ Follow-up Interview Questions

1. What does a user see if they request a page in the moment it triggers a background regeneration?
2. What's the difference between time-based revalidation and on-demand revalidation?
3. Why would rebuilding an entire e-commerce site for one price change be wasteful?
4. What does "stale-while-revalidate" actually mean in the context of ISR?
5. When would you reach for `revalidatePath()` instead of waiting for a time-based `revalidate` window?

---

## 5. What is Client-Side Rendering (CSR), and when is it still the right choice inside a Next.js app?

### 📖 Introduction
The other three strategies covered so far all involve the server. This one is about when rendering entirely in the browser is still the right call, even within a framework built server-first.

### 💻 What CSR Actually Is, in a Next.js Context
Rendering that happens entirely in the browser via JavaScript, after the initial page load — the server sends minimal or no meaningful HTML for that piece of content, and JavaScript builds it up client-side. In a Next.js app specifically, this happens when a Client Component (the Server & Client Components chapter goes deeper) fetches its own data — via `useEffect` and `fetch`, or a library like TanStack Query — rather than receiving data from a Server Component above it. That piece of the page renders and fetches entirely on the client, even if the rest of the page is server-rendered.

### 🎯 When CSR Is Still the Right Choice
- **Highly interactive, state-heavy UI** that doesn't need to be SEO-visible or fast on first paint — a drag-and-drop editor, a complex data grid with heavy client-side filtering and sorting, a real-time collaborative whiteboard.
- **Genuinely client-specific data** with no server-rendering benefit — a widget reading from the browser's local storage, or embedding a third-party client-side SDK.
- **Content behind a user-triggered interaction**, like "load more" or pagination, that doesn't need to be part of the initial server-rendered HTML.
- **Frequently-polling or rapidly-updating data**, like a live stock ticker updating every second, where the value of server-rendering the initial state is low compared to the complexity of coordinating server and client updates.

### 💎 Good to Know: A Deliberate Choice, Not the Default-by-Necessity
Next.js being a server-first framework doesn't mean CSR is discouraged entirely — it means CSR becomes a deliberate, scoped choice for specific pieces of UI, rather than the default for the whole app the way a plain React SPA is forced into by necessity. Next.js gives you the choice; plain React forces CSR everywhere.

### ❓ Follow-up Interview Questions

1. What specifically triggers CSR behavior within an otherwise server-rendered Next.js page?
2. Give an example of a UI element where CSR is clearly the better fit than SSR.
3. Why doesn't a live-updating stock ticker benefit much from being server-rendered on first load?
4. What's the difference between CSR being "forced" in plain React versus "chosen" in Next.js?
5. Why might a third-party embedded widget be a natural candidate for a Client Component?

---

## 6. What is Partial Prerendering (PPR), and how does it combine static and dynamic rendering in a single route?

### 📖 Introduction
Every strategy covered so far applies to a whole route at once. PPR is Next.js's newer answer to a real limitation that creates: what happens when one route genuinely needs both a static part and a dynamic part simultaneously?

### 🧩 What PPR Actually Is: One Route, Two Rendering Modes at Once
PPR lets a single route contain both statically prerendered parts and dynamically rendered parts, served together in one response — rather than choosing one strategy for the entire route, which earlier Next.js versions required (a route was either fully static or fully dynamic).

### ⚙️ How It Works: A Static Shell With Suspense-Wrapped Holes
At build time, Next.js prerenders a "static shell" of the page — everything that doesn't depend on request-time data. Any part of the page wrapped in a `<Suspense>` boundary that does depend on request-time data is left out of this static shell, marked as a hole to be filled in later. When a request comes in, Next.js immediately serves the pre-built static shell — instantly, since it's already built — and streams in the dynamic, Suspense-wrapped parts as they become ready (the next question's streaming mechanics apply directly here).

### 🛒 A Concrete Example: An E-Commerce Product Page
A product's name, description, images, and reviews are static — the same for everyone, rarely changing. But an "add to cart" button's live price/stock display, or a "recommended for you" section, depends on the specific request. Without PPR, the whole page would need to become dynamic just because of that one personalized widget, losing the speed benefit for the entire page. With PPR, the static parts render instantly from the pre-built shell, while only the personalized widget streams in dynamically.

### 💎 Good to Know: Removing the All-or-Nothing Trade-off
PPR removes the previous all-or-nothing choice — no longer "fully static, missing some personalization" versus "fully dynamic, slower for everyone." It gets the speed of static rendering for the parts that can be static, and the freshness of dynamic rendering only for the parts that genuinely need it, within the same route.

### ❓ Follow-up Interview Questions

1. What determines whether a piece of a page ends up in the static shell or as a dynamic "hole"?
2. Why does the static shell render instantly, while the dynamic parts don't?
3. In the e-commerce example, why would making the whole page dynamic just for one widget be wasteful?
4. What role does `<Suspense>` specifically play in enabling PPR?
5. How does PPR change the traditional trade-off between choosing SSG and choosing SSR for a single route?

---

## 7. What is Streaming Rendering, and how does it improve perceived performance?

### 📖 Introduction
The previous question mentioned that PPR streams in its dynamic parts — here's exactly what streaming means and why it makes a real difference to how fast a page feels.

### 📡 What Streaming Rendering Actually Is
Rather than waiting for an entire page's data and rendering to finish before sending any response, the server sends HTML in chunks as they become ready. The browser can start painting the earlier chunks while the server is still working on later ones.

### ⚙️ How It Works Mechanically With Suspense
Wrapping a slow-loading part of a page in `<Suspense fallback={...}>` tells Next.js not to block the rest of the page waiting on it. The server sends the shell and fast parts of the page immediately, shows the fallback for the slow part, and streams in the real content for that part once its data is ready.

### ⚡ Why It Improves Perceived Performance
Without streaming, one slow data-fetching component anywhere on the page blocks the entire response — the user sees nothing until the slowest piece finishes. With streaming, the fast parts appear immediately, and only the slow parts show a loading state instead of blocking everything. This is a direct application of the perceived-vs-actual-performance distinction: a user who sees something meaningful quickly perceives the page as faster, even if the total time to full completion is identical.

### 🛒 A Concrete Example
A page with a fast-loading header and nav, plus a slow-loading "recommended products" section querying an external recommendation engine. Without streaming, the entire page waits on that engine. With streaming — Suspense wrapped around just that section — the header, nav, and rest of the page appear instantly, and the recommendations section streams in a moment later.

### ❓ Follow-up Interview Questions

1. What does the server send first when a page has one slow-loading section wrapped in Suspense?
2. Why does streaming improve perceived performance even if total load time stays the same?
3. What would happen to this page without any Suspense boundary around the slow section?
4. Is streaming a client-side or server-side mechanism in this context?
5. How does streaming relate to what PPR does with its dynamic "holes"?

---

## 8. How does Next.js decide whether a route should be statically or dynamically rendered?

### 📖 Introduction
Earlier questions in this chapter both referenced this decision without going deep — here's the full mechanical answer.

### 🎯 The Default Assumption: Static Unless Forced Otherwise
Next.js tries to render every route statically by default, at build time, unless something forces it to be dynamic. This is an optimistic default, since static rendering is cheaper and faster to serve.

### 🔍 What Triggers Dynamic Rendering
Next.js scans a route's code at build time for the presence of APIs that can only be resolved at request time:
- Reading cookies or headers (`cookies()`, `headers()` from `next/headers`)
- Using `searchParams` in a page component
- Calling `fetch()` with `{ cache: 'no-store' }`
- Using uncached database calls or any data source explicitly marked as not cacheable

If none of these are present, the route renders statically at build time (SSG). If even one is detected, the entire route becomes dynamically rendered (SSR) — an all-or-nothing decision per route, unless PPR is enabled, which allows a partial, mixed outcome.

### ⚙️ The Route Segment Config: An Explicit Manual Override
`export const dynamic` offers a more explicit override: `'auto'` (the default, letting Next.js decide), `'force-dynamic'` (always render dynamically, even if nothing requires it), and `'force-static'` (always render statically, even if request-time APIs are used — potentially returning empty or default values for those APIs).

### 💎 Good to Know: A Common, Surprising Gotcha
A developer might expect a page to be static, but accidentally includes a single `cookies()` call — say, for an A/B test flag — somewhere deep in a nested component, and the entire route silently becomes dynamic, losing all the static-rendering performance benefits without an obvious error. Worth actively watching for in code review.

### ❓ Follow-up Interview Questions

1. What is Next.js's default assumption about how a route should render?
2. Name three specific signals that force a route into dynamic rendering.
3. What does `force-static` do if the route actually uses `cookies()` somewhere?
4. Why is the static-vs-dynamic decision typically all-or-nothing per route without PPR?
5. How could a single, easily-overlooked API call silently change an entire route's rendering strategy?

---

## 9. How do rendering strategies affect SEO, caching, Time to First Byte, and Core Web Vitals?

### 📖 Introduction
This ties every strategy covered in this chapter to four concrete, measurable concerns — each gets its own deeper chapter later (Metadata & SEO, Caching & Revalidation, Deployment & Performance), but here's how they all compare side by side.

### 🔍 SEO: Crawlable HTML vs. JavaScript-Dependent Content
SSR, SSG, and ISR all produce server-rendered HTML that crawlers can read immediately. CSR is the weakest here, since crawlers may not execute JavaScript reliably or quickly. PPR gets the SEO benefit of its static shell being crawlable immediately, even though its dynamic parts may not be crawled the same way.

### 💾 Caching: How Cacheable Is Each Strategy?
SSG and ISR are highly cacheable — served from a CDN with no per-request work. SSR isn't cacheable by default, since it's fresh on every request, though it can be paired with HTTP-level caching headers in some cases. CSR's initial shell can be cached (it's often minimal), but the client-fetched data itself follows its own separate caching rules.

### ⏱️ Time to First Byte: Pre-Built vs. Computed on Request
SSG and ISR have excellent TTFB — served immediately from a pre-built file or CDN, with no server compute needed. SSR has worse TTFB, since the server must render before sending anything. Streaming and PPR improve *effective* TTFB for dynamic content by sending the shell immediately while the slower parts are still computing.

### 📊 Core Web Vitals: LCP, CLS, and INP Across Strategies
LCP (Largest Contentful Paint) benefits from fast TTFB plus minimal client-side work — SSG, ISR, and PPR's static shell all help here. CLS (Cumulative Layout Shift) can get worse with CSR if content pops in after load without reserved space. INP (Interaction to Next Paint) benefits from less client-side JavaScript needing to hydrate and execute — Server Components reducing shipped JS helps directly. Overall, static-leaning strategies tend to score better across Core Web Vitals than SSR or CSR, though SSR still generally beats pure CSR.

### ❓ Follow-up Interview Questions

1. Why is CSR the weakest rendering strategy for SEO specifically?
2. Why does SSR have worse TTFB than SSG, mechanically?
3. How does streaming improve effective TTFB even for content that's genuinely dynamic?
4. Which Core Web Vital is most directly affected by shipping less client-side JavaScript?
5. Why can CSR hurt Cumulative Layout Shift specifically?

---

## 10. Can different rendering strategies be used within the same application, and how do Server Components influence this choice?

### 📖 Introduction
Yes — and this per-route granularity was this chapter's opening framing. Server Components add a second, independent axis worth being precise about.

### ✅ Yes — Per-Route Granularity Is the Whole Point
A single Next.js app can have SSG marketing pages, SSR user dashboards, ISR product pages, and CSR-heavy interactive widgets, all coexisting. Rendering strategy is decided per route — and with PPR, even within a single route — not globally for the whole application.

### 🔀 How Server Components Influence This: Two Independent Axes
Server Components are what actually gets rendered according to whichever strategy applies — the "when does this HTML get generated" question is answered by looking at what the Server Components in that route do. Client Components, by contrast, always render and hydrate on the client regardless of the route's overall strategy. So a route can be statically rendered overall (SSG) while still containing a Client Component doing its own CSR-style data fetching within that static page. Rendering strategy per route and the Server/Client boundary per component are independent axes that combine.

### 🛒 A Concrete Illustration
A product page (SSG or ISR overall) can contain a "recently viewed" widget that's a Client Component reading from `localStorage` or fetching its own data client-side. The page's rendering strategy (ISR) and that widget's client-side behavior (CSR) coexist without conflict, since they answer different questions — how is the page's main content generated, versus how does this specific widget get its data.

### ❓ Follow-up Interview Questions

1. Why is rendering strategy a per-route decision rather than an app-wide one?
2. What's the difference between "rendering strategy" and "Server/Client boundary" as two separate axes?
3. Can a statically-rendered page contain a component that fetches its own data client-side? Why?
4. In the product page example, why don't the page's ISR strategy and the widget's CSR behavior conflict?
5. What determines whether a specific component's code runs at build time, request time, or in the browser?

---

## 11. What are the trade-offs between SSR, SSG, ISR, CSR, and PPR, and how would you choose between them for an e-commerce app versus a content-heavy website?

### 📖 Introduction
This ties together everything covered individually earlier in this chapter into a concrete decision framework, worked through two genuinely different kinds of applications.

### ⚖️ Quick Trade-off Recap
SSG: cheapest to serve, but frozen at build time. ISR: static speed with periodic freshness. SSR: always fresh, but costs server work every request. CSR: offloads work to the client, at the cost of initial content visibility. PPR: static speed plus per-request freshness, but only for routes that genuinely mix both needs.

### 🛒 Worked Example: An E-Commerce Application
- **Product listing/category pages** — ISR: products change occasionally (price, stock), not every second, so periodic or on-demand regeneration fits.
- **Product detail pages** — PPR or ISR: a static shell (name, images, description) plus dynamic price/stock if real-time accuracy matters, or ISR if a short staleness window is acceptable.
- **Shopping cart/checkout** — SSR: genuinely per-user, real-time, security-sensitive data that must be fresh on every request.
- **"Recently viewed"/recommendation widgets** — CSR: user-specific, no need to be part of the initial SSR/SSG HTML.

### 📰 Worked Example: A Content-Heavy Website
- **Most article/blog pages** — SSG: content rarely changes once published, maximizing caching benefit.
- **Frequently-updated sections** (a news homepage with breaking stories) — ISR with a short revalidate window, or SSR if truly real-time.
- **Comment sections/interactive widgets** (counts, reactions) — CSR: doesn't need to be part of the static shell.
- **Search functionality** — often a CSR/SSR hybrid (the Data Fetching chapter goes deeper).

### 💎 Good to Know: The Guiding Principle
Match the strategy to the specific content's own freshness and personalization requirements, page by page — even widget by widget with PPR — rather than picking one strategy for the whole app. Both worked examples above apply the same underlying freshness-vs-cost framework, just arriving at different, internally consistent choices for their own domain.

### ❓ Follow-up Interview Questions

1. Why does a shopping cart need SSR while a product description doesn't?
2. Why might a news homepage use ISR with a short window rather than pure SSR?
3. What's the common decision principle underlying both worked examples, despite their different conclusions?
4. Why is CSR a reasonable choice for a comment count widget on an otherwise static blog page?
5. If a product detail page's price needs to be guaranteed accurate to the second, would you still choose PPR? Why or why not?

---

## 12. Explain the complete rendering lifecycle for SSR, SSG, ISR, and CSR, from request to painted page.

### 📖 Introduction
This traces all four strategies side by side, tying together the individual mechanics from earlier in this chapter.

### 🖥️ SSR Lifecycle
Request arrives → server runs Server Components, fetching fresh data → HTML is generated → sent to the browser → browser paints it → JS downloads → Client Components hydrate.

### 📄 SSG Lifecycle
At build time, before any request: Server Components run once, HTML is generated and stored. Later, a request arrives → the pre-built HTML is served immediately, with no server compute → browser paints it → JS downloads → Client Components hydrate.

### 🔄 ISR Lifecycle
Same as SSG initially — built once. A request arrives: if within the revalidate window, served immediately just like SSG. If the window has expired, the stale version is still served immediately, while a background regeneration triggers — the next request after that regeneration completes gets the fresh version.

### 💻 CSR Lifecycle
Request arrives → the server sends a minimal HTML shell (or a server-rendered shell around a Client Component boundary) → browser paints the shell → JS downloads → JS executes, and the Client Component's own data fetching (`useEffect`/`fetch`) begins → data arrives → the component re-renders with the real content.

### 💎 Good to Know: The Common Thread — Hydration Happens in All Four
Regardless of strategy, any Client Components on the page still need to hydrate once JS is available — the difference between the four strategies is entirely about *when and where the initial HTML gets produced*, not whether hydration happens at all.

### ❓ Follow-up Interview Questions

1. At which step does SSG's lifecycle diverge from SSR's?
2. Why does a user requesting an ISR page during its stale window not have to wait for regeneration?
3. What does the browser paint first in the CSR lifecycle, before any real content appears?
4. Which of these four lifecycles involves the least server compute per request, and why?
5. Why does hydration remain a shared step across all four strategies?

---

## 13. How would you architect rendering strategy choices for a large enterprise application with mixed content types?

### 📖 Introduction
The previous question was a per-page decision framework. This is the broader, organizational question: how do you keep rendering-strategy choices consistent and maintainable across a large, multi-team codebase over time?

### 📝 Establish Per-Route-Type Defaults as a Team Convention
Documenting defaults — "all marketing/public content defaults to SSG/ISR unless specifically justified otherwise," "all authenticated dashboard routes default to SSR" — keeps different teams from making inconsistent, ad hoc choices for similar kinds of pages.

### 🗂️ Use Route Groups to Communicate Expected Rendering Behavior
Organizing with route groups by rendering-relevant section — a `(public)` group where most pages are SSG/ISR, versus an `(app)` group where most are SSR — lets the folder structure itself communicate the expected rendering behavior for a whole section.

### 🧩 Adopt PPR Deliberately for Genuinely Mixed Content
Product or listing pages with both static and personalized elements are exactly the use case PPR was built for. An enterprise app with this characteristic should adopt PPR deliberately, rather than defaulting the whole page to SSR just because one widget needs fresh data.

### 📊 Monitor Core Web Vitals Per Route, Continuously
Core Web Vitals should be tracked per route or route type in production, since a wrong rendering-strategy choice — the "accidental dynamic" gotcha covered earlier — can silently regress performance without an obvious error. This benefits from ongoing monitoring (the Deployment & Performance chapter goes deeper), not a one-time decision made at launch.

### 🔄 Design for Revisiting Decisions as Requirements Evolve
A page that started as SSG might need to become ISR or SSR later as requirements change — adding personalization, for instance. Architecting rendering choices as a per-route decision, not a global one, keeps this kind of change localized and easy rather than requiring a large refactor.

### ❓ Follow-up Interview Questions

1. Why do documented per-route-type defaults matter more as a team and codebase grow?
2. How can route groups communicate rendering expectations without needing a separate documentation file?
3. Why is PPR specifically well-suited to enterprise pages with mixed static and personalized content?
4. Why is one-time performance testing insufficient for catching rendering-strategy regressions?
5. Why does keeping rendering strategy a per-route decision make it easier to change later?

---
