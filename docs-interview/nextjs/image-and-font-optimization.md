---
title: Image & Font Optimization
description: next/image and next/font, and the performance problems they solve.
sidebar_position: 13
---

# Image & Font Optimization

## 1. Why is asset optimization important in Next.js, and what problems does `next/image` solve compared to a plain `<img>` tag?

### 📖 Introduction
This chapter covers images, fonts, and scripts — three asset types that typically make up the largest portion of a page's total weight, often far more than the JavaScript bundle itself.

### 💾 Why Asset Optimization Matters
Poorly optimized assets directly hurt load time, Core Web Vitals (a later question in this chapter goes deeper), and overall user experience. A single large, unoptimized image can dwarf the rest of a page's entire download size.

### 🖼️ The Problems With a Plain `<img>` Tag
A plain `<img>` tag serves whatever image file and size you point it at, exactly as-is. No automatic resizing for different screen sizes — a mobile user downloads the same huge desktop-sized image. No automatic modern-format conversion (a later question goes deeper on WebP/AVIF). No built-in lazy loading (a later question goes deeper) — off-screen images download immediately, wasting bandwidth and delaying what's actually visible. And no built-in prevention of layout shift — an image without explicit dimensions causes the page to jump as it loads, hurting Cumulative Layout Shift specifically.

### ✅ What `next/image` Solves
A drop-in replacement component that automatically handles all of the above: resizes and serves the right image size for the requesting device, converts to modern formats automatically, lazy-loads off-screen images by default, and requires width/height (or `fill`) props that let the browser reserve the correct space before the image even loads, preventing layout shift.

### 💎 Good to Know: Not Just a Nicer Syntax — Solving a Genuine Performance Category
`next/image` isn't just a nicer way to write `<img>` — it's solving a genuine category of performance problems that would otherwise require manually building, or reaching for third-party libraries for, responsive image generation, format conversion, and lazy-loading infrastructure yourself.

### ❓ Follow-up Interview Questions

1. Why can images alone dwarf a page's JavaScript bundle in total weight?
2. What specifically happens to a mobile user downloading an image via a plain `<img>` tag sized for desktop?
3. Why does a missing width/height on an image cause layout shift?
4. Is `next/image` primarily a syntax improvement, or something more substantial? Why?
5. Name three concrete problems `next/image` solves that a plain `<img>` tag doesn't.

---

## 2. How do you display local versus remote images with `next/image`, and why must remote image domains be configured?

### 📖 Introduction
These two cases behave differently — one gets automatic dimension detection, the other requires explicit configuration for a genuinely important security reason.

### 🖼️ Local Images: Automatic Dimension Detection
Importing an image file directly — from the project's own filesystem, `public/` or colocated with a component — lets `next/image` automatically determine the image's intrinsic width and height from the imported file itself, so you don't need to manually specify them:
```jsx
import profilePic from "./me.png";
<Image src={profilePic} alt="Me" />
```

### 🌐 Remote Images: Manual Width/Height Required
Images fetched from an external URL — a CMS, an external image host, a CDN — require explicitly specifying `width`/`height` props yourself, since Next.js can't inspect a remote file's dimensions at build time the way it can for a local, imported file:
```jsx
<Image src="https://example.com/photo.jpg" width={500} height={300} alt="Photo" />
```

### 🔒 Why Remote Domains Must Be Configured: A Real Security Consideration
`next.config.js`'s `images.remotePatterns` needs to explicitly allowlist trusted domains. Next.js's image optimization (resizing, format conversion — the next question goes deeper) happens on your own server or a serverless function, meaning your server fetches the remote image on behalf of the requesting browser. Without an allowlist, anyone could potentially abuse your image-optimization endpoint to proxy, fetch, or resize arbitrary remote URLs through your server — a genuine SSRF-adjacent concern, and a way to rack up bandwidth and compute costs on your infrastructure by abusing it as a free image-proxy service. Explicitly allowlisting trusted domains prevents this.
```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "example.com" }],
  },
};
```

### 💎 Good to Know: A Common, Intentional Error
Forgetting to configure a new remote domain results in a genuinely common, easy-to-hit error — Next.js will refuse to optimize or serve an image from an un-allowlisted domain. Worth knowing this is intentional security behavior, not a bug.

### ❓ Follow-up Interview Questions

1. Why can Next.js automatically determine dimensions for a local image but not a remote one?
2. What security risk does the remote domain allowlist specifically protect against?
3. What would happen if any remote URL could be optimized through your server without restriction?
4. What error would you expect if you used a remote image from a domain not in `remotePatterns`?
5. Is this allowlist requirement a limitation to work around, or a deliberate security measure?

---

## 3. How does `next/image` handle lazy loading and automatic responsive image generation internally?

### 📖 Introduction
Two distinct mechanisms work together here — deferring images that aren't visible yet, and serving the right size for the requesting device.

### 👁️ Lazy Loading: Only Downloading Images Near the Viewport
By default, `next/image` only loads an image once it's near or entering the viewport, using intersection-detection similar in spirit to Next.js's own route-prefetching mechanism. Images far below the fold don't download at all until the user scrolls near them, saving bandwidth and speeding up initial page load. This can be overridden with the `priority` prop for images that should load immediately — a hero image above the fold, where lazy-loading would actually hurt perceived performance by delaying the most important visual content.

### 📐 Responsive Image Generation: Automatic `srcset` Creation
`next/image` automatically generates multiple, differently-sized versions of the same source image (a `srcset`) and lets the browser choose the most appropriate one based on the device's actual screen size and pixel density. A mobile device downloads a smaller variant than a large desktop monitor would, without you needing to manually create or manage multiple image files yourself.

### 📏 The `sizes` Prop: Telling the Browser How Large the Image Will Actually Render
A genuinely important, often-misunderstood detail: the `sizes` prop tells the browser how large the image will actually be displayed at different viewport widths — `sizes="(max-width: 768px) 100vw, 50vw"` — so it can choose the correct `srcset` variant before CSS layout is even computed. Without an accurate `sizes` value, the browser might download a larger image than actually needed, since it has to guess or default to a less optimal choice.

### ⚙️ The Optimization Endpoint: Processed On-Demand, Then Cached
All of this — resizing, format conversion — happens via Next.js's built-in image optimization API (`/_next/image`), which processes the source image on demand and caches the result, rather than pre-generating every possible size and format combination at build time.

### ❓ Follow-up Interview Questions

1. Why would using `priority` on a below-the-fold image be counterproductive?
2. What does the `sizes` prop tell the browser that the image's actual `width`/`height` doesn't?
3. Why does an inaccurate `sizes` value risk downloading a larger image than needed?
4. Why does Next.js process image variants on demand rather than pre-generating all of them at build time?
5. What real browser mechanism does `next/image`'s lazy loading conceptually resemble?

---

## 4. How do modern image formats like WebP and AVIF improve performance, and how does Next.js leverage them?

### 📖 Introduction
Format choice alone can meaningfully change how much data a page has to transfer — worth understanding both the formats themselves and how Next.js negotiates them automatically.

### 🗜️ What WebP and AVIF Actually Are
Newer image compression formats, successors to JPEG/PNG, that achieve significantly smaller file sizes for the same visual quality. AVIF, the newer of the two, typically compresses even more efficiently than WebP, though with slightly less universal browser support and slower encoding time.

### ⚡ How Smaller File Sizes Improve Performance
Smaller file size means less data to download, meaning faster page loads — especially meaningful for image-heavy pages like a product catalog or photo gallery, where images dominate total page weight. This is a measurable, direct improvement to Largest Contentful Paint specifically (a later question in this chapter goes deeper), since the LCP element is often an image.

### ⚙️ How Next.js Leverages Them Automatically
`next/image`'s optimization endpoint automatically converts and serves images in the most modern format the requesting browser supports, checking the `Accept` request header the browser sends, which indicates which formats it can decode — falling back to a more widely-supported format (JPEG/PNG) for older browsers that don't support WebP/AVIF. All of this happens transparently, without you needing to manually create or manage multiple format variants of every source image yourself.

### 💎 Good to Know: What You'd Have to Build Yourself Without `next/image`
Achieving this same format-negotiation behavior without `next/image` would require either a third-party image CDN service, or manually generating multiple format variants and writing your own `<picture>`-element-based fallback logic. Next.js collapses all of this into a single component, handling the negotiation for you.

### ❓ Follow-up Interview Questions

1. Why does AVIF typically compress more efficiently than WebP, at some cost?
2. How does the browser communicate which image formats it supports?
3. Why would an image-heavy product catalog benefit especially from automatic format negotiation?
4. What would you have to build manually to replicate this behavior without `next/image`?
5. What happens for a browser that doesn't support either WebP or AVIF?

---

## 5. What is the `next/font` module, and how does it prevent layout shift compared to manually imported fonts?

### 📖 Introduction
Font loading has a well-known visual glitch associated with it — `next/font` exists specifically to eliminate it, using a genuinely clever metric-matching technique.

### 😩 The Traditional Problem: Flash of Unstyled/Invisible Text
Manually loading a web font — via a `<link>` tag to Google Fonts, or a CSS `@font-face` rule pointing to an external URL — means the browser initially renders text using a fallback or system font while the real font downloads. Once the real font arrives, the text re-renders with it, often causing a visible, jarring "font swap" that shifts layout, since different fonts have different letter widths and line heights. This phenomenon is called a "flash of unstyled text" (FOUT) or "flash of invisible text" (FOIT), and directly hurts Cumulative Layout Shift.

### ⚙️ What `next/font` Does: Metric-Matched Fallback Fonts
`next/font` automatically self-hosts the font file as part of your own build and deployment, and uses the CSS `size-adjust` property, among other techniques, to compute a fallback font whose metrics — width, line height — closely match the real font's metrics. This means even during the brief window before the real font loads, the fallback text occupies essentially the same amount of space, so when the real font swaps in, there's little to no visible layout shift.
```jsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }) {
  return <div className={inter.className}>{children}</div>;
}
```

### 🌐 No External Network Request at Runtime
Since the font is downloaded and self-hosted at build time (the next question goes deeper), the browser never needs to make a separate request to an external font provider like `fonts.googleapis.com` at all — removing an extra DNS lookup and connection-setup round trip that would otherwise delay the font's availability.

### ❓ Follow-up Interview Questions

1. What causes the visible "font swap" glitch with manually loaded web fonts?
2. How does `next/font` make a fallback font occupy the same space as the real font?
3. Why does self-hosting remove an extra network round trip compared to loading from Google Fonts directly?
4. Which Core Web Vital does this layout-shift prevention directly improve?
5. What CSS property does `next/font` use to match fallback font metrics?

---

## 6. What is the difference between self-hosted and externally-hosted fonts in terms of performance?

### 📖 Introduction
This is a direct follow-up to the previous question's mention of self-hosting — worth being precise about exactly what that saves, plus a privacy angle worth knowing.

### 🌍 Externally-Hosted Fonts: An Extra Third-Party Connection
The font file is served from a third-party domain, like `fonts.googleapis.com`. The browser must make a separate network connection — DNS lookup, TLS handshake, all adding latency before the actual font file even starts downloading — to that third-party domain, separate from the connection already established to your own site's server.

### 🏠 Self-Hosted Fonts: Reusing Your Site's Own Connection
The font file is downloaded once, at build time, and served directly from your own domain or CDN alongside your other static assets. The browser reuses the same connection it's already using for your site, avoiding the extra DNS and connection overhead entirely.

### 🔒 Good to Know: A Privacy Consideration, Not Just a Performance One
Externally-hosted fonts mean the user's browser makes a request directly to that third party, potentially exposing the user's IP address and browsing behavior to it — a genuinely real privacy and compliance consideration that's led some jurisdictions to specifically flag externally-loaded Google Fonts as a privacy issue. Self-hosting avoids this entirely, since no third-party request happens at all.

### 🎯 The Practical Takeaway: `next/font` Makes Self-Hosting the Easy Default
`next/font` makes self-hosting the default, easy path — even for fonts traditionally distributed via Google Fonts' own CDN, `next/font/google` downloads them at build time and self-hosts them for you automatically, rather than you needing to manually download and host font files yourself to get this benefit.

### ❓ Follow-up Interview Questions

1. What extra network overhead does an externally-hosted font introduce compared to a self-hosted one?
2. Why might loading fonts from Google's own servers be a privacy consideration, not just a performance one?
3. Does using `next/font/google` still make a runtime request to Google's servers? Why or why not?
4. Why does reusing an existing connection matter for font-loading performance specifically?
5. What would you have needed to do manually, before `next/font` existed, to get the same self-hosting benefit?

---

## 7. What is the `next/script` component, and why should it be used instead of a plain `<script>` tag?

### 📖 Introduction
Third-party scripts are a common, easy-to-overlook source of render-blocking behavior — `next/script` exists to give you explicit control over that instead of accepting the browser's default.

### 🚧 The Problem: Plain `<script>` Tags Can Block Rendering
By default, a `<script>` tag blocks HTML parsing while it downloads and executes, unless marked `async`/`defer`. A third-party script that's slow to load — a slow analytics provider, a heavy chat widget — can delay the rest of the page from rendering or becoming interactive, even though it's often not even critical to the page's core functionality.

### ⚙️ What `next/script` Provides: Explicit Loading Control
A component wrapping third-party script loading with explicit control over loading strategy and timing (the next question goes deeper on the specific strategies) — letting you declare "this script isn't critical, load it after the page is already interactive," rather than accepting the browser's default, potentially render-blocking behavior.
```jsx
import Script from "next/script";

<Script src="https://analytics.example.com/script.js" strategy="afterInteractive" />
```

### 🔁 Automatic Deduplication
A genuinely practical, often-overlooked benefit: if the same script URL is accidentally included multiple times — both a layout and a specific page including the same analytics script — `next/script` automatically prevents it from being loaded or executed twice. A plain `<script>` tag has no such protection, and duplicate script execution can cause genuinely confusing bugs, like double-counted analytics events.

### 💎 Good to Know: Declarative Control Over an Otherwise Implicit Behavior
`next/script` gives you declarative control over something that's normally an implicit, browser-default behavior — when and how a script loads relative to the rest of the page — letting you make an explicit, informed trade-off per script, rather than accepting whatever the browser's default happens to be.

### ❓ Follow-up Interview Questions

1. Why can a plain `<script>` tag block the rest of a page from rendering?
2. What does `next/script`'s automatic deduplication protect against?
3. Give an example of a bug that duplicate script execution could cause.
4. What does "declarative control over an implicit behavior" mean in this context?
5. Would `next/script` change anything for a script that's already marked `async`? Why or why not?

---

## 8. What are the different loading strategies in `next/script` (`beforeInteractive`, `afterInteractive`, `lazyOnload`, `worker`), and when should each be used?

### 📖 Introduction
Each strategy trades off timing against priority — worth knowing precisely which fits which kind of script.

### 🚨 `beforeInteractive`: Reserved for Genuinely Critical Scripts
Loads and executes the script before any page hydration or interactivity happens. Reserved for genuinely critical scripts that must run before anything else — a bot-detection script, a polyfill other code depends on. Use sparingly, since it can delay interactivity for the entire page.

### ⏱️ `afterInteractive`: The Sensible Default for Most Analytics
Loads the script shortly after the page becomes interactive — a good default for most analytics or tag-manager scripts that need to run reasonably soon but aren't critical to the page's own core functionality.

### 😴 `lazyOnload`: For Genuinely Low-Priority Widgets
Loads the script during browser idle time, or whenever the browser has spare capacity. Best for genuinely low-priority scripts — a chat widget, a social-media embed — that can wait as long as needed, since they're not needed immediately.

### 🧵 `worker`: Running Off the Main Thread Entirely (Experimental)
Runs the script in a web worker, off the main thread entirely — the most aggressive optimization, since it prevents the script from competing with main-thread work at all. Worth noting this is built on Partytown (a third-party library) and is still an experimental Next.js feature, with real limitations — not every third-party script can run correctly in a worker context, since workers don't have direct DOM access.

### 🎯 The Decision Heuristic
Ask: how critical is this script to the page's core functionality, and how soon does it genuinely need to run? Genuinely critical, blocking-dependency scripts get `beforeInteractive`; most analytics and tracking get `afterInteractive`; truly non-essential widgets get `lazyOnload`; performance-critical pages willing to experiment get `worker`.

### ❓ Follow-up Interview Questions

1. Why should `beforeInteractive` be used sparingly rather than as a safe default?
2. What kind of script is `afterInteractive` well-suited for, and why?
3. Why can't every third-party script run correctly under the `worker` strategy?
4. What question would you ask yourself to choose between these four strategies for a new script?
5. What's the risk of choosing `beforeInteractive` for a script that's actually non-critical?

---

## 9. How do unoptimized images, fonts, and third-party scripts collectively hurt Core Web Vitals?

### 📖 Introduction
This ties together everything covered so far in this chapter across the three specific Core Web Vitals metrics they each affect.

### 🖼️ LCP: Often Directly Tied to an Image (or a Font-Blocked Text Element)
Largest Contentful Paint is often directly tied to an image — a large, unoptimized hero image takes longer to download and decode, directly delaying when the LCP element becomes visible. Fonts also factor in if text is the LCP element and it's blocked behind a slow-loading, non-self-hosted font.

### 📐 CLS: Images Without Dimensions, Fonts Without Metric Matching
Images without explicit dimensions cause the page to jump as they load. Fonts without metric-matched fallbacks cause a visible reflow when the real font swaps in. Both are direct, well-known Cumulative Layout Shift contributors.

### 🧵 INP/TBT: Third-Party Scripts Monopolizing the Main Thread
Third-party scripts loaded without a deliberate strategy can monopolize the main thread during their execution, delaying the browser's ability to respond to user input. A heavy, render-blocking script — `beforeInteractive` used inappropriately, or a plain `<script>` tag with no strategy at all — directly hurts this metric.

### 💎 Good to Know: These Compound Together, Not Just Independently
These three asset types don't just hurt Core Web Vitals independently — they often compound together on a real page: a hero image, a custom font, and several third-party scripts all competing for bandwidth and main-thread time simultaneously during initial load. Optimizing all three together has a multiplicative, not just additive, benefit to overall page performance.

### ❓ Follow-up Interview Questions

1. Why is LCP often tied directly to an image rather than to JavaScript execution?
2. What specifically about a missing image dimension causes a CLS penalty?
3. Why does an unoptimized third-party script hurt INP/TBT rather than LCP or CLS?
4. What does it mean for these three problems to "compound" rather than just add up?
5. If you could only optimize one of these three asset types on a given page, how would you decide which matters most?

---

## 10. How would you optimize an image-heavy e-commerce application using `next/image`?

### 📖 Introduction
This applies everything covered so far in this chapter to a concrete, image-heavy application, with different tactics for different page types.

### 🖼️ Product Listing Pages: Lazy Load the Grid, Prioritize Only What's Above the Fold
For a grid of product thumbnails, rely on `next/image`'s default lazy loading for most of the grid, reserving `priority` only for the first few, above-the-fold products.

### 🎯 Product Detail Pages: Mark the Hero Image as `priority`
A single, hero product image is likely the LCP element for this page — mark it `priority` explicitly so it skips lazy loading and loads immediately, rather than being treated as a "below the fold, defer it" image by default.

### 📐 Tuning `sizes` Per Layout Context
Product images displayed at different sizes across grid views, detail views, and mobile layouts need accurate `sizes` values per context, so the browser downloads an appropriately-sized variant for each specific layout, rather than one-size-fits-all.

### 🔒 Careful Remote Pattern Configuration at Scale
If product images come from a CMS or external asset host, carefully configure `remotePatterns` to allowlist exactly the needed CDN or host domains — not overly broad wildcard patterns that could reintroduce the security risk covered earlier in this chapter.

### 💾 Good to Know: Caching the Optimization Endpoint's Output
Since product images are typically requested heavily and repeatedly — the same product viewed by many customers — ensuring the image optimization endpoint's output is properly cached, via a CDN in front of it, avoids re-processing the same image resize or format conversion repeatedly for every single request.

### ❓ Follow-up Interview Questions

1. Why should only the first few products in a listing grid get `priority`, not the whole grid?
2. Why is the product detail page's hero image a strong candidate for `priority`?
3. Why does `sizes` need different values across a grid view and a detail view?
4. What risk does an overly broad `remotePatterns` wildcard reintroduce?
5. Why does caching the optimization endpoint's output matter for a heavily-viewed product?

---

## 11. How would you optimize font loading for a multilingual application?

### 📖 Introduction
Different languages require genuinely different glyph sets, and font weight varies dramatically between scripts — worth handling deliberately rather than shipping one universal font file.

### 🌐 The Challenge: Different Languages Need Different Glyph Sets
Different languages often require different character subsets — Latin, Cyrillic, CJK (Chinese/Japanese/Korean characters add substantially more glyphs than Latin-based alphabets). Loading a full font file with every possible glyph for every language, regardless of which locale a user actually needs, wastes significant bandwidth.

### ✂️ Subsetting via `next/font`'s `subsets` Option
Explicitly specifying only the character subsets actually needed — `subsets: ["latin", "cyrillic"]` — so the downloaded font file only contains the glyphs relevant to the locales your app actually supports, rather than an entire, all-encompassing font file.

### 🔀 Locale-Conditional Font Loading for Genuinely Different Scripts
For apps supporting genuinely different scripts — Latin-based locales plus, say, Japanese — loading a different font entirely per locale, since a single font family rarely covers both Latin and CJK glyphs well. Conditionally applying the correct font's CSS class based on the current locale, tying back to locale detection covered in the Metadata & SEO chapter.

### 💎 Good to Know: CJK Fonts Are Large Even After Subsetting — Consider System Fonts
CJK font files are typically much larger than Latin-script fonts — thousands of unique characters versus a few dozen Latin letters. Even with subsetting, a CJK font might still be significantly heavier than a Latin one. Worth considering whether a system/fallback font — relying on the user's own OS-provided CJK font, already installed locally and requiring no download at all — might be a more practical choice for CJK locales specifically, trading some brand consistency for a significantly faster load.

### ❓ Follow-up Interview Questions

1. Why does a CJK locale's font file tend to be much larger than a Latin one?
2. What does the `subsets` option actually reduce in the downloaded font file?
3. Why might a single font family not work well across both Latin and CJK locales?
4. What trade-off does relying on a system font for CJK locales involve?
5. Where would locale detection typically happen before deciding which font to load?

---

## 12. How would you manage multiple third-party scripts on a page without degrading performance?

### 📖 Introduction
This applies the loading-strategy guidance from earlier in this chapter to the realistic scenario of many scripts accumulating on a page over time.

### 🔍 Audit and Remove Genuinely Unused Scripts First
A genuinely common, real-world problem: pages accumulate third-party scripts over time — analytics, A/B testing tools, chat widgets, ad tags, social embeds — without anyone regularly reviewing whether they're all still needed. Periodically auditing and removing genuinely unused or abandoned scripts is often the single highest-leverage optimization available.

### 🎯 Assign the Correct Loading Strategy Per Script, Not a Blanket Default
Not defaulting everything to the same strategy — genuinely critical scripts get `beforeInteractive`, most get `afterInteractive`, truly non-essential ones get `lazyOnload`. A deliberate, per-script decision rather than a blanket choice.

### 🏷️ Consolidate Via a Tag-Management System
Rather than each team or script owner adding their own `<Script>` tag directly, using a single tag-manager script (Google Tag Manager, or similar) that itself loads and manages multiple third-party tags internally — consolidating to one well-strategized script load point rather than many independent ones, easier to govern and audit centrally.

### 📊 Monitor the Cumulative Impact on Core Web Vitals
Using Lighthouse or real-user monitoring to track how third-party scripts, collectively, affect TBT/INP over time as new scripts get added, rather than evaluating each new script in isolation without considering its cumulative effect alongside everything else already on the page.

### ❓ Follow-up Interview Questions

1. Why is auditing and removing unused scripts often the highest-leverage optimization available?
2. Why shouldn't every script default to the same loading strategy?
3. What does consolidating scripts through a tag-management system make easier to govern?
4. Why should a new script's performance impact be evaluated cumulatively, not in isolation?
5. What tool would you use to measure the collective impact of third-party scripts on TBT/INP?

---

## 13. Explain the complete lifecycle of image optimization in Next.js, from a source image to what's actually sent to the browser.

### 📖 Introduction
This closing trace ties together everything covered in this chapter about images into one end-to-end sequence.

### 🖼️ Steps 1–2: The Image Renders, Dimensions Are Determined
A `<Image>` component renders with a source — a local import or a remote URL. Next.js determines the image's intrinsic dimensions, automatic for local imports, manually specified for remote ones.

### 👁️ Step 3: The Browser Requests (or Prefetches) the Image
The browser requests the image, or prefetches it if it's near or entering the viewport under the default lazy-loading behavior — unless marked `priority`, in which case it loads immediately.

### ⚙️ Step 4: The Request Hits the Optimization Endpoint, Format Is Negotiated
The request hits Next.js's built-in image optimization endpoint, which checks the requesting browser's `Accept` header to determine the best-supported modern format — AVIF, then WebP, then a fallback format.

### 📐 Step 5: The Correct Size Variant Is Determined
The endpoint determines the correct size variant to serve, based on the device's viewport and pixel density plus the `sizes` prop.

### 🆕 Step 6: Processing On-Demand, Then Cached
If this exact size-and-format combination hasn't been generated before, Next.js processes the source image on demand — resizing, re-encoding to the target format — and this result is then cached for subsequent, identical requests.

### ✅ Step 7: The Optimized Image Arrives, With Reserved Layout Space
The optimized image is sent to the browser, alongside the reserved layout space from the width/height props, which prevents layout shift as it renders.

### ❓ Follow-up Interview Questions

1. At which step does Next.js decide between AVIF, WebP, and a fallback format?
2. Why does a `priority` image skip the viewport-detection step that other images go through?
3. What happens the second time a browser requests the same size-and-format combination of an image?
4. Where does the `sizes` prop's information actually get used in this lifecycle?
5. What prevents layout shift during Step 7, and why is that information available before the image even arrives?

---

## 14. How would you design a complete asset optimization strategy for a large enterprise application?

### 📖 Introduction
This closing question pulls together everything covered in this chapter into an actual governance strategy for a large, multi-team application.

### 🧩 Shared, Wrapped Components for Consistency
A shared, wrapped image component and a consistent font-loading setup used across every team, rather than each team configuring `next/image`/`next/font` independently with inconsistent defaults — different teams forgetting `priority` or `sizes` differently.

### 🔒 Centralized Remote-Image Domain Governance
A single, reviewed `remotePatterns` configuration, with a documented process for teams requesting new domains be added, rather than an ever-growing, unreviewed allowlist that reintroduces the security risk covered earlier in this chapter.

### 🏷️ Script Governance: A Reviewed Registry, Not Ad Hoc Additions
A centralized tag-management system or registry of approved third-party scripts with their assigned loading strategies, rather than individual teams adding scripts ad hoc without review.

### 📊 Continuous Core Web Vitals Monitoring
Real-user monitoring tracking LCP/CLS/INP over time, per page type, catching regressions as new images, fonts, or scripts get added by different teams, rather than a one-time launch audit.

### 🌍 An i18n-Aware Font Strategy, Documented Once
A documented, shared decision for which fonts and subsets apply to which locales, rather than each localization effort making its own, potentially inconsistent font choices.

### ❓ Follow-up Interview Questions

1. Why does a shared, wrapped image component matter more as more teams contribute to the same app?
2. What risk does an unreviewed, ever-growing `remotePatterns` allowlist introduce?
3. What does a centralized script registry make easier to enforce compared to ad hoc additions?
4. Why is continuous Core Web Vitals monitoring preferable to a one-time launch audit?
5. Why might different localization efforts end up with inconsistent font choices without a shared, documented strategy?

---