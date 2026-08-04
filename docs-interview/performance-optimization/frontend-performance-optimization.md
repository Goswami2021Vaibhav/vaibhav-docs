---
title: Frontend Performance Optimization
description: Bundle size, rendering performance, and Core Web Vitals.
sidebar_position: 2
---

# Frontend Performance Optimization

## 1. What are Core Web Vitals, and what do LCP, INP, and CLS each measure?

### 📖 Introduction

Before getting into specific fixes, it helps to have a shared vocabulary for what "fast" actually means on the frontend — Core Web Vitals is Google's standardized answer, and it's what most of this chapter's other questions ultimately optimize for.

### 🖼️ LCP — Largest Contentful Paint

Measures loading: how long until the largest visible content element — usually a hero image or a main heading block — finishes rendering. Answers the question "does this feel like it loaded?"

### 👆 INP — Interaction to Next Paint

Measures responsiveness: how long the page takes to visibly respond to a user's interaction — a click, a tap, a key press — across the *entire* lifetime of the page visit, not just the first interaction. Answers "does this feel like it responds to me?"

### 📐 CLS — Cumulative Layout Shift

Measures visual stability: how much visible content unexpectedly shifts position while the page loads. Answers "does this feel stable enough to trust interacting with?"

### 💎 Good to Know: A Page Can Ace One and Fail Another Completely

These three were chosen specifically because they capture genuinely independent aspects of "feels good to use." A page that renders its main content instantly (great LCP) but then jitters as ads load in around it (poor CLS) is a completely realistic, common combination — no single metric tells the whole story on its own.

---

## 2. What is Largest Contentful Paint, and what are the most common causes of a poor score?

### 📖 Introduction

Since LCP is often the first metric a team investigates, it's worth knowing the handful of causes that account for most real-world LCP problems.

### 🐌 Common Causes

**Slow server response time**, covered in the Backend Performance Optimization chapter, delaying everything downstream before the browser even has HTML to work with. **Render-blocking CSS or JavaScript**, delaying when the browser can start painting anything at all, covered in this chapter's critical rendering path question. **A large, unoptimized image** as the LCP element itself, taking a long time to download. **Client-side rendering that requires JavaScript to execute and fetch data** before the main content can appear, versus content already present in the initial server-rendered HTML.

### 💎 Good to Know: Image Optimization Is Often the Single Highest-Leverage LCP Fix

Because the LCP element is very frequently an image — a hero banner, a product photo — the image-specific techniques covered later in this chapter are frequently the highest-impact change available for improving LCP, more so than most JavaScript-focused tweaks.

---

## 3. What is Cumulative Layout Shift, and what causes it?

### 📖 Introduction

CLS is unusual among the Core Web Vitals in that it's almost entirely fixable through layout discipline, without needing the page to actually become faster at all.

### 📐 Common Causes

Images, videos, ads, or embeds rendered without an explicit width and height reserved in advance — the browser doesn't know how much space to allocate, so it shifts surrounding content once the asset finishes loading and its real dimensions become known. Content dynamically injected above existing content, like a banner that pushes everything down after the page already appeared settled. Web fonts swapping in and changing text size or layout after an initial fallback font was already displayed, covered in more depth later in this chapter.

```html
<!-- Causes a shift: browser doesn't know the image's size until it loads -->
<img src="/hero.jpg" alt="Hero" />

<!-- Reserves the space upfront, no shift when the image arrives -->
<img src="/hero.jpg" alt="Hero" width="1200" height="600" />
```

### 💎 Good to Know: CLS Is About Reserving Space, Not About Being Faster

Unlike LCP or INP, fixing CLS rarely requires making anything load quicker — it requires telling the browser, in advance, how much space content will eventually occupy, so nothing has to move once it actually arrives.

---

## 4. What replaced First Input Delay with Interaction to Next Paint, and why is INP a better measure?

### 📖 Introduction

This is a genuinely recent change worth knowing about explicitly, since older articles and tutorials may still reference the metric INP replaced.

### ⏱️ What FID Measured

Only the delay before the *first* interaction on a page started being processed — a narrow snapshot that captured nothing about anything that happened afterward.

### 👆 What INP Measures Instead

Responsiveness across *every* interaction during the full page visit, not just the first one — and specifically the full time from an interaction until the user sees a visual update, not merely until processing starts. A page that responds instantly to the first click but then stays janky for every interaction after that would have looked fine under FID, while INP correctly shows the real, ongoing problem.

### 💎 Good to Know: This Was a Relatively Recent Change

INP officially replaced FID as a Core Web Vital in 2024, reflecting a broader shift toward measuring the full user session rather than just first impressions — worth double-checking that any older reference material you come across is still describing the current metric.

---

## 5. What is code splitting, and how does it reduce initial JavaScript download size?

### 📖 Introduction

Shipping every line of JavaScript an application could ever need on the very first page load is one of the most common, avoidable sources of a slow initial load.

### ✂️ What It Is

Breaking a single, large JavaScript bundle into multiple smaller chunks that get loaded on demand, rather than delivering everything upfront regardless of what the current page actually needs.

### 📉 How It Reduces the Initial Download

A user visiting the homepage doesn't need the code for the admin dashboard, the checkout flow, or a rarely visited settings page loaded before they can even see the homepage. Code splitting, commonly via dynamic `import()` and route-based splitting in a router or framework, defers those chunks until the user actually navigates somewhere that needs them.

```jsx
// Loaded eagerly with the rest of the bundle
import Settings from "./Settings";

// Loaded only when this route is actually visited
const Settings = React.lazy(() => import("./Settings"));
```

### 💎 Good to Know: This Is the Same Idea as Lazy Loading, Just Applied to JavaScript

Code splitting and the lazy loading covered in the next question are really the same underlying principle — don't make a user pay for what they aren't using yet — just applied to two different kinds of assets.

---

## 6. What is lazy loading, and what are good candidates for it?

### 📖 Introduction

Deferring work until it's actually needed sounds like an obvious win, but applying it to the wrong thing can quietly make performance worse instead of better.

### ⏳ What It Is

Deferring the loading of a resource until it's actually needed, rather than loading everything upfront regardless of whether it'll be used right away.

### ✅ Good Candidates

Images below the fold, not visible until the user scrolls. Routes or pages the user hasn't navigated to yet. Heavy third-party widgets — a chat widget, a video embed — that aren't critical to the initial view.

```html
<img src="/photo.jpg" loading="lazy" alt="Below the fold" />
```

### 💎 Good to Know: Lazy-Loading Something Above the Fold Backfires

Applying `loading="lazy"` to an image that's actually the LCP element adds an extra delay — the loading trigger plus fetch time — to something the user needed immediately, directly hurting the LCP score this chapter opened with. Apply lazy loading selectively to what's genuinely deferred, not as a blanket default across every asset.

---

## 7. What is tree shaking, and why does it only work reliably with ES modules?

### 📖 Introduction

This is a real, practical reason to care about module syntax choices beyond stylistic preference.

### 🌳 What It Is

A build-time optimization that removes code which is imported but never actually used — dead code elimination specifically for unused exports from a module — from the final bundle.

### 🔍 Why ES Modules Specifically

ES module `import`/`export` statements are statically analyzable — a bundler can determine exactly which exports are actually used just by reading the code, without running it, since imports and exports are fixed, top-level declarations. CommonJS's `require()`/`module.exports` are fully dynamic — a `require()` call can be conditional, and `module.exports` can be mutated at runtime — so a bundler generally can't safely prove a given export is unused without risking incorrect behavior, and typically can't remove it.

### 💎 Good to Know: This Is a Real Reason to Prefer ES Modules and Vet CommonJS-Only Libraries Carefully

Beyond style, this is a genuine, measurable bundle-size reason to prefer ES module syntax in your own code, and to be a little more cautious about adding an older, CommonJS-only dependency purely for its bundle-size impact.

---

## 8. How would you actually find out what's making a JavaScript bundle large?

### 📖 Introduction

Guessing which dependency is bloating a bundle is unreliable — this is squarely a "measure, don't guess" problem, the theme the previous chapter opened with.

### 🔍 Tools

Bundle analyzer tools — `webpack-bundle-analyzer`, or a framework's built-in equivalent like Next.js's bundle analyzer — generate a visual, size-proportional treemap of exactly what's inside a built bundle, immediately showing which specific dependencies take up disproportionate space.

### 🎯 What to Look For

A surprisingly large dependency pulled in for a small feature — an entire date library imported for one formatting function, when a lighter alternative would do. Duplicate copies of the same library bundled multiple times, a common symptom of mismatched versions across dependencies. A large dependency where only a tiny fraction of its exports are actually used, like importing an entire icon library instead of the handful of icons actually needed.

```js
// Pulls in the entire library
import _ from "lodash";

// Pulls in only what's actually used
import debounce from "lodash-es/debounce";
```

### 💎 Good to Know: This Connects Directly to Dependency Vetting From the Web Security Guide

Checking a library's bundle-size footprint *before* adding it, covered as part of dependency vetting in the Dependency & Supply Chain Security chapter of the Web Security guide, is far cheaper than discovering the cost after it's already deeply integrated into the codebase.

---

## 9. What causes unnecessary re-renders in React, and how do `React.memo`, `useMemo`, and `useCallback` help?

### 📖 Introduction

This is one of the most commonly asked React performance questions, and it's worth understanding the actual mechanism, not just the three hook names.

### 🔄 Why Unnecessary Re-Renders Happen

A parent component re-rendering causes all of its children to re-render by default too, even if a specific child's own props didn't actually change. React's default behavior re-renders a component tree from wherever a state update occurred, downward, regardless of whether each individual child genuinely needs to update.

### 🧠 `React.memo`

Wraps a component so React skips re-rendering it if its props haven't actually changed, based on a shallow comparison — directly addressing the "my parent re-rendered but my own props are the same" case.

### 🧮 `useMemo`

Memoizes the *result* of an expensive computation, recalculating only when its dependencies actually change, rather than recomputing on every single render regardless.

### 🔗 `useCallback`

Memoizes a *function reference* itself, so a new function isn't created on every render. This matters specifically because passing a freshly created function as a prop to a `React.memo`-wrapped child defeats memo's entire point — the prop looks different every render, even though the function behaves identically, purely because a new reference was created each time.

```jsx
const handleClick = useCallback(() => onSelect(item.id), [item.id, onSelect]);
return <MemoizedChild onClick={handleClick} />; // stable reference, memo actually works
```

### 💎 Good to Know: Memoization Isn't Free — Profile Before Reaching for It Everywhere

Wrapping every component in `memo` and every value in `useMemo` by default isn't free — the comparison work and cached-value memory themselves cost something, and applying this to components that were already cheap to recompute can make things slower, not faster. This is the premature-optimization lesson from the first chapter, applied directly here: profile first, then memoize where the data actually shows it helps.

---

## 10. What is list virtualization, and why does rendering a very long list without it hurt performance?

### 📖 Introduction

This is a concrete, practical example of the Big-O thinking introduced in the first chapter, applied to a genuinely common real-world scenario.

### 🐌 Why Long Lists Hurt Performance

Rendering a list of ten thousand items means creating ten thousand real DOM nodes all at once, even though a user's screen can only physically display a small fraction of them at any given moment — maybe twenty or thirty visible rows. The browser still has to create, lay out, and manage every one of those nodes, which is expensive regardless of how many are actually visible on screen.

### 🪟 What Virtualization Does

Renders only the DOM nodes for items currently visible in the viewport, plus a small buffer, dynamically swapping which underlying data each rendered node displays as the user scrolls — rather than ever having thousands of real DOM nodes present in the document at once.

```jsx
import { FixedSizeList } from "react-window";

<FixedSizeList height={600} itemCount={10000} itemSize={40}>
  {({ index, style }) => <div style={style}>{items[index].name}</div>}
</FixedSizeList>
```

### 💎 Good to Know: This Turns an O(n) Rendering Cost Into a Roughly Constant One

Without virtualization, rendering cost grows linearly with total list size. With virtualization, it stays roughly constant relative to the visible window, since only a fixed number of items are ever rendered no matter how large the underlying dataset grows — Big-O thinking from the first chapter, showing up as a genuinely practical, common fix.

---

## 11. What is the critical rendering path, and how do render-blocking resources delay it?

### 📖 Introduction

Understanding this mechanically is what makes several other questions in this chapter click into place as one coherent system, rather than a list of disconnected tips.

### 🛤️ What It Is

The sequence of steps a browser must complete before it can paint pixels to the screen: parsing HTML, building the DOM, fetching and parsing CSS to build the CSSOM, combining both into a render tree, then layout and paint.

### 🚧 How Render-Blocking Resources Delay It

By default, a browser must finish downloading and parsing CSS before it will paint anything at all, specifically to avoid a flash of unstyled content. A `<script>` tag without `async` or `defer` pauses HTML parsing entirely at that point in the document until the script downloads and executes. A large, unoptimized stylesheet or a synchronous script sitting early in the page can meaningfully delay the very first paint, regardless of how fast the rest of the page's actual content is.

```html
<!-- Blocks HTML parsing until this script downloads and runs -->
<script src="/analytics.js"></script>

<!-- Downloads in parallel, executes after parsing completes -->
<script src="/analytics.js" defer></script>
```

### 💎 Good to Know: This Is the Mechanical Explanation Behind LCP's Render-Blocking Cause

This is exactly why render-blocking CSS and JavaScript were listed as a common cause of poor LCP earlier in this chapter — the critical rendering path is the actual mechanism underneath that cause, not a separate, unrelated concept.

---

## 12. What are resource hints like `preload`, `prefetch`, and `preconnect`, and when would you use each?

### 📖 Introduction

These three hints look similar but serve genuinely different purposes, and using the wrong one — or overusing all three — can work against the browser's own prioritization.

### ⚡ `preload`

Tells the browser to start fetching a resource the *current* page will definitely need soon, at high priority, before the browser would otherwise discover it — a font referenced only inside a CSS file, for instance, which the browser wouldn't normally know to fetch until after it's already parsed that CSS.

```html
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin />
```

### 🔮 `prefetch`

Tells the browser to fetch a resource, at low priority, that will likely be needed for a *future* navigation, not the current page — prefetching the JavaScript bundle for a page the user will probably click into next, so it's already cached by the time they do.

### 🔗 `preconnect`

Tells the browser to establish a connection — DNS, TCP, and TLS handshake — to a third-party origin early, before an actual request to that origin is made. Useful when you know you'll need to fetch something from a specific third-party domain soon, letting the connection setup overlap with other work instead of happening only once the real request fires.

### 💎 Good to Know: Overusing These Hints Backfires

Each hint consumes real bandwidth and connection resources, competing with what the browser would otherwise prioritize on its own. Reserve them specifically for resources you're confident are genuinely critical or highly likely to be needed soon, not everything the page might conceivably touch.

---

## 13. What image optimization techniques actually move the needle?

### 📖 Introduction

Given how often the LCP element turns out to be an image, this is frequently the single highest-leverage category of frontend performance work.

### 🖼️ Modern Formats

WebP and AVIF offer meaningfully smaller file sizes than JPEG or PNG at equivalent visual quality, through more efficient compression algorithms.

### 📱 Responsive Images

Serving a different, appropriately sized image for different screen sizes and pixel densities, via `srcset`/`sizes` or a framework's built-in image component, rather than shipping one large image to every device — including small mobile screens that don't need that much resolution at all.

```html
<img
  src="/photo-800.jpg"
  srcset="/photo-400.jpg 400w, /photo-800.jpg 800w, /photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, 800px"
  alt="Responsive photo"
/>
```

### 🧩 Rounding Out the Set

Lazy loading for below-the-fold images, from earlier in this chapter, and explicit sizing to avoid the layout shifts covered in the CLS question, together cover most of what matters for image performance in practice.

### 💎 Good to Know: This Is Frequently the Single Highest-Leverage Fix for Core Web Vitals

Because the LCP element is so often an image, getting image optimization right tends to move the needle on Core Web Vitals more, per unit of engineering effort, than most JavaScript-focused work.

---

## 14. How does web font loading commonly hurt performance, and what mitigates it?

### 📖 Introduction

Fonts are an easy thing to overlook as a performance concern, since they seem like a purely visual detail — but they directly affect both LCP and CLS.

### ⚠️ Why It Hurts Performance

A custom web font has to be downloaded before the browser can render text in it. By default, many browsers either hide text entirely until the font loads — Flash of Invisible Text, directly hurting LCP if the LCP element is text — or show a fallback font first and swap to the real one once it loads — Flash of Unstyled Text, which can trigger a CLS-causing layout shift if the fallback and real fonts have different sizing metrics.

### 🛠️ Mitigations

`font-display: swap`, or a similar value, explicitly controls this fallback-and-swap behavior rather than leaving it to a possibly jarring browser default.

```css
@font-face {
  font-family: "MainFont";
  src: url("/fonts/main.woff2") format("woff2");
  font-display: swap;
}
```

Preloading the font file, using `preload` from earlier in this chapter, so it starts downloading as early as possible rather than only being discovered once the CSS referencing it has already been parsed. Subsetting a font — including only the specific characters and weights actually used — to reduce its file size significantly.

### 💎 Good to Know: Choosing a Fallback Font With Similar Metrics Minimizes the Visual Jump

Picking a fallback font whose character width and height closely match the real web font specifically minimizes the visual "jump" during a FOUT swap, reducing CLS impact even when a swap does still occur — a small, easy-to-overlook detail with a genuinely measurable effect.

---

## 15. What is hydration, and why can it become a performance bottleneck on a content-heavy page?

### 📖 Introduction

Server-rendered React solves the "blank screen while JS loads" problem, but it introduces a different, subtler gap of its own.

### 💧 What Hydration Is

In a server-rendered React app, the server sends fully rendered HTML so the user sees content immediately — but that HTML starts out as static markup. Hydration is the process of React running on the client, attaching event listeners and internal state to that already-visible markup, making it actually interactive.

### ⚠️ Why It Can Become a Bottleneck

Hydration requires downloading, parsing, and executing a meaningful amount of JavaScript. For a content-heavy page with many components, this can take long enough that the page *looks* ready — content is already visible, since the server rendered it — but *isn't* actually interactive yet. A user tries to click something and nothing happens, because hydration hasn't finished attaching the necessary event handlers — directly the gap the INP metric from earlier in this chapter is designed to capture.

### 💎 Good to Know: Newer Patterns Address This Gap Directly

This specific "looks ready but isn't interactive" problem is exactly what React Server Components and partial or selective hydration — hydrating only the interactive parts of a page rather than the entire tree at once — are designed to address. Worth knowing this is an active, evolving area rather than a fully solved problem.

---

## 16. Why does minimizing main-thread work matter specifically for interactivity, even after the page has visually loaded?

### 📖 Introduction

This is the mechanical explanation for why a page can genuinely look finished while still failing at responsiveness.

### 🧵 Why It Matters

JavaScript execution, layout calculation, and style recalculation all compete for the same single main thread a browser tab has available. If that thread is busy running a long task, it cannot simultaneously respond to a user's click, tap, or keypress — even if the page already looks fully loaded and visually complete.

### ⚠️ A Realistic Scenario

A page finishes rendering visually, with a great LCP score, but then runs a large, synchronous JavaScript operation — processing a big dataset, an expensive third-party analytics script — that blocks the main thread for a second or more. During that window, the page looks done but is completely unresponsive to any interaction, directly hurting INP despite LCP already looking great.

### 💎 Good to Know: This Is Exactly Why Core Web Vitals Measures Loading and Responsiveness Separately

A page can genuinely excel at one while failing badly at the other — "the page loaded" and "the page works" are not the same claim, which is exactly why LCP and INP exist as two independent metrics rather than one combined score.

---

## 17. What is a performance budget for frontend assets specifically, and how would you enforce it in CI?

### 📖 Introduction

This builds directly on the general performance budget concept from the first chapter, applied specifically to what a frontend build actually produces.

### 📐 What It Covers

Explicit limits on asset sizes — total JavaScript, total CSS, a specific bundle's size, an image's maximum file size — and sometimes on measured metrics directly, like requiring LCP to stay under a set threshold on a test run.

### 🤖 Enforcing It in CI

A build step measures the actual output — bundle size from the build itself, or a Lighthouse CI run against a preview deployment — and fails the build or blocks the pull request if it exceeds the agreed budget. Tools like `bundlesize`, a bundler's built-in performance hints, or Lighthouse CI are commonly used for exactly this.

### 💎 Good to Know: This Is the Same "Automate It, Don't Trust Discipline" Principle From the Web Security Guide

A budget checked only manually tends to erode the same way performance itself does by default. This mirrors automated secret scanning and automated dependency scanning from the Web Security guide almost exactly — a policy that only lives in a wiki page erodes over time; one enforced by CI doesn't.

---

## 18. What's the difference between lab data and field data for Core Web Vitals, and why can they disagree?

### 📖 Introduction

Both are legitimate ways of measuring performance, but they answer genuinely different questions — worth knowing which one to reach for and when.

### 🧪 Lab Data

Measured in a controlled, consistent environment — a specific simulated network speed, a specific simulated device, a specific page state — through tools like Lighthouse. Highly reproducible and great for catching regressions or comparing before-and-after, but doesn't reflect the actual diversity of real users' devices, networks, and conditions.

### 🌍 Field Data (Real User Monitoring)

Measured from actual real users' actual browsers, on their actual devices and networks, as they genuinely use the application. Reflects real-world experience, but is noisier, harder to reproduce on demand, and only available after something is already live and being used.

### ⚖️ Why They Can Disagree

A page might score well in Lighthouse's controlled, idealized conditions while genuinely underperforming for a meaningful share of real users on slower devices or networks that the lab test's specific simulated conditions simply don't represent — directly the average-versus-worst-case-user point from the first chapter.

### 💎 Good to Know: Neither Is "More Correct" — They Answer Different Questions

Lab data is what you use during development to catch regressions before shipping, with fast, reproducible feedback. Field data is what tells you whether it actually mattered for real users after shipping. A mature setup uses both together, not one instead of the other.

---

## 19. How would you diagnose why a page has a poor Lighthouse score despite the app "feeling fine" during development?

### 📖 Introduction

This gap is common enough to be worth understanding directly, rather than dismissing the Lighthouse score as somehow wrong.

### 🤔 Why Dev Can Feel Fine While Lighthouse Disagrees

Local development typically runs on a fast machine, over `localhost` with effectively zero real network latency, often without production-level minification, bundling, or compression, and often without the exact same third-party scripts or ads running in production. None of this reflects the conditions Lighthouse actually simulates — a throttled network, a mid-tier mobile CPU profile, and the real production build.

### 🔍 Diagnostic Approach

Run Lighthouse against an actual production or production-like build and deployment, not the dev server. Read the specific metric breakdown Lighthouse provides — which of LCP, CLS, or INP is actually failing, and its own listed diagnostics pointing at specific culprits — rather than just looking at the overall score. Check for production-only factors development doesn't have at all: real third-party scripts, real image sizes, and unminified development-mode React itself.

### 💎 Good to Know: React's Development Build Is Measurably Slower Than Its Production Build

Extra warnings, checks, and debugging affordances are baked into React's dev build by design. "It feels fine in dev" is, in part, comparing against an already-handicapped baseline — one more reason dev-mode impressions are specifically unreliable for judging real performance.

---

## 20. In production, a marketing page has a great Lighthouse score but real users still report it feels slow — what would you investigate?

### 📖 Introduction

This closes the chapter by tying together lab-versus-field data and the average-versus-worst-case-user point from the first chapter into one realistic scenario.

### 🔍 What This Pattern Usually Means

This is close to a textbook case of lab-data and field-data divergence, covered earlier in this chapter. Lighthouse's specific simulated conditions — a particular network throttle profile, a particular device CPU simulation, run from a specific location — don't necessarily match the actual diversity of conditions real users are experiencing.

### 🕵️ Investigation Steps

Check real user monitoring data, if it exists — and if it doesn't, that absence is itself the first gap worth closing, covered in this guide's final chapter — segmented by actual device type, network condition, and geographic region. Is the "slow" complaint concentrated in a specific segment, like older devices or a region with generally slower average connections, echoing the worst-case-user point from the first chapter, rather than being universal? Also check whether Lighthouse is being run against a scenario that doesn't match real usage — a mostly empty demo version of the page rather than one loaded with real, typically messier production content, or missing real third-party scripts that get added dynamically after the tested page state.

### 💎 Good to Know: A Single Score Is a Snapshot Under Specific Assumed Conditions, Not a Guarantee

This closes the chapter on the same theme the first chapter opened with — measurement has to be trusted over assumption — but adds an important refinement: not all measurements answer the same question, and choosing the *right* kind of measurement for what you're actually trying to learn is itself part of the skill.
