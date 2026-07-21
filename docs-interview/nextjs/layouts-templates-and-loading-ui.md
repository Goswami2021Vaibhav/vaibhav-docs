---
title: Layouts, Templates & Loading UI
description: Shared layouts, templates, and built-in loading/suspense states.
sidebar_position: 10
---

# Layouts, Templates & Loading UI

## 1. What is a Layout in Next.js, and how do nested layouts work with nested routes?

### 📖 Introduction
An earlier chapter introduced `layout.js` alongside routing basics — this dedicated chapter goes deeper into the actual mechanics of how layouts compose and pass content down.

### 🖼️ What a Layout Actually Is
A special component that wraps a page — and any nested child routes or layouts — with shared UI, defined via a `layout.js` file. It receives a `children` prop representing whatever should render inside it: either a page, or a nested layout with its own children.

### 🪆 How Nested Layouts Receive and Pass Down `children`
Each layout in the chain receives `children` representing the next layer down — the root layout's `children` is the dashboard layout; the dashboard layout's `children` is the actual page (or a further nested layout). This is ordinary React composition — a layout is just a component rendering `{children}` somewhere in its own JSX. The only "magic" is that Next.js automatically determines which layouts apply and passes the right `children` based on the URL's folder structure.

### 🏠 The Root Layout Requirement, Briefly
Every app must have `app/layout.js`, since it's where the `<html>` and `<body>` tags live.

### 🏗️ A Concrete Example Showing the Prop-Passing Mechanics
```jsx
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlobalNav />
        {children}
      </body>
    </html>
  );
}

// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      {children}
    </div>
  );
}
```
Visiting `/dashboard/settings` results in `RootLayout` rendering with `children = <DashboardLayout>`, and `DashboardLayout` rendering with `children = <SettingsPage>` — a chain of ordinary React composition, assembled automatically by Next.js based on the folder nesting.

### ❓ Follow-up Interview Questions

1. What prop does every layout receive, and what does it represent?
2. Why is nested layout composition described as "ordinary React composition" rather than something Next.js invents?
3. What's the one file every App Router application is required to have, and why?
4. In the example above, what does `RootLayout`'s `children` actually resolve to when visiting `/dashboard/settings`?
5. What determines which layouts apply to a given URL?

---

## 2. Why don't Layouts re-render on every route change, and how do they preserve state during navigation?

### 📖 Introduction
This is a genuinely important, easy-to-take-for-granted behavior — worth understanding mechanically rather than just observing it.

### 🔍 The Observed Behavior: A Shared Layout Persists Across Navigation
Navigating between `/dashboard/settings` and `/dashboard/profile` — both sharing `DashboardLayout` — doesn't remount or re-render `DashboardLayout` itself. Its internal state (a sidebar's collapsed/expanded toggle, a scroll position) persists across the navigation.

### ⚙️ Why: Ordinary React Reconciliation, Not Special Next.js Magic
React's reconciliation algorithm — same type, same position in the tree means the same instance is preserved — applies here naturally. Since `DashboardLayout` occupies the same position in the component tree across both routes, React treats it as the same instance and doesn't unmount or remount it. Only the `children` prop changes (from `<SettingsPage>` to `<ProfilePage>`), and React only re-renders whatever actually changed in the tree. This is ordinary React reconciliation behavior, not a special Next.js-only mechanism.

### 💾 How State Actually Gets Preserved
Since the layout component instance isn't destroyed, any `useState`/`useReducer` inside it (in a Client Component part of the layout) keeps its value across the navigation — a sidebar's collapsed state, a scroll position held in a ref, all survive because the underlying Fiber and DOM node were never torn down.

### 💎 Good to Know: Contrast With a Full Page Reload
A hard navigation — typing the URL directly, a full page reload — would remount everything from scratch, losing all in-memory state. This is exactly why client-side navigation is valuable: not just avoiding a network round trip, but also preserving UI state that a user would find jarring to lose, like a sidebar collapsing or a form's draft values resetting, on every navigation.

### ❓ Follow-up Interview Questions

1. Why does React treat `DashboardLayout` as the same instance across two sibling routes?
2. What specifically changes between navigating from `/dashboard/settings` to `/dashboard/profile`, if the layout itself doesn't?
3. Where would a sidebar's collapsed/expanded state actually live for it to survive navigation?
4. What would happen to that same state during a hard, full-page navigation?
5. Is layout persistence a Next.js-specific feature, or a consequence of how React itself reconciles?

---

## 3. What is a Template, and how does it differ from a Layout — specifically, why does a Template re-render on every navigation while a Layout doesn't?

### 📖 Introduction
This is a direct contrast to the previous question's behavior — a Template intentionally gives up layout persistence for a specific reason.

### 📄 What a Template Actually Is
A `template.js` file, similar in structure to `layout.js` — it also receives `children` and wraps nested content — but with one key behavioral difference: it creates a new instance on every navigation, rather than persisting like a layout.

### ⚙️ Why It Re-Renders: A Deliberate, Opt-In Behavior Difference
Next.js gives a Template a new, unique key on each navigation internally — similar in spirit to how changing a React element's `key` prop forces React to treat it as a different instance, unmounting the old one and mounting a fresh one. This is a deliberate, opt-in behavior difference from `layout.js`, not an accident.

### 🎯 When This Is Actually Useful
Cases where fresh state or effects are wanted on every navigation, even between routes that share the same visual wrapper — an enter/exit CSS animation that should replay on every page change (a mount-triggered animation wouldn't replay if the component persists, since mount only happens once), or a `useEffect` that should re-run on every navigation, like logging a page view.

### 💎 Good to Know: Use Layout by Default, Template Only When Justified
Use `layout.js` by default, for persistent state and better performance. Reach for `template.js` only when the reset-on-navigation behavior is specifically needed — a genuinely narrow use case, not a general-purpose alternative to layouts.

### ❓ Follow-up Interview Questions

1. What's the key structural similarity between a Template and a Layout?
2. Mechanically, how does Next.js force a Template to behave like a new instance on every navigation?
3. Give an example of an effect that should genuinely re-run on every navigation, even between routes sharing the same template.
4. Why is a mount-triggered animation a good example of when a Template is actually useful?
5. Why should Layout be the default choice, with Template reserved for a specific, justified need?

---

## 4. What is the purpose of `loading.js`, and how does it integrate with React Suspense?

### 📖 Introduction
This file was mentioned briefly alongside data fetching in an earlier chapter — here's its dedicated, full treatment.

### 📄 What `loading.js` Actually Is
A special file that automatically provides a loading UI for a route segment while its Server Components are still resolving — fetching data, for instance. Placing a `loading.js` file in a folder automatically wraps that segment's `page.js` (and anything nested beneath it) in a React Suspense boundary, with the `loading.js` component as the fallback.

### ⚙️ How It Integrates With Suspense Mechanically
`loading.js` isn't a manual Suspense boundary you write yourself — Next.js automatically wraps the route segment for you. Conceptually equivalent to writing:
```jsx
<Suspense fallback={<Loading />}>
  <Page />
</Suspense>
```
But you don't write this wrapping code yourself — just create a `loading.js` file alongside `page.js`, and Next.js handles the rest.

### ⚡ What Triggers the Fallback to Show
Whenever the route segment's Server Components are awaiting data — an async component that hasn't resolved yet — the loading UI shows immediately, giving instant navigation feedback, while the slower content streams in.

### 🗂️ Scoping: Nested `loading.js` Files Take Precedence
`loading.js` applies to its own segment and everything nested beneath it — the same scoping behavior as layouts and error boundaries. A more deeply nested `loading.js` takes precedence for its own, more specific subtree, letting different parts of a large app show different loading indicators rather than one generic, app-wide spinner.

### 💎 Good to Know: Why It Matters for Navigation UX
Without `loading.js`, navigating to a route with a slow data fetch would show nothing — or the old page, frozen — until the entire new route finishes rendering. With `loading.js`, the user gets immediate visual feedback that navigation is happening, even before the destination's content is ready.

### ❓ Follow-up Interview Questions

1. What does creating a `loading.js` file automatically do to its sibling `page.js`?
2. What React mechanism is `loading.js` built directly on top of?
3. What specifically triggers a `loading.js` fallback to appear during navigation?
4. If both a parent and a child segment have their own `loading.js`, which one applies to the child's content?
5. What would navigating to a slow route look like without a `loading.js` file present?

---

## 5. What is the purpose of `error.js`, what types of errors does it handle, and how does it differ from `global-error.js`?

### 📖 Introduction
`error.js` is Next.js's file-based convention for wrapping a route segment in a React Error Boundary — worth knowing precisely what it catches, and the rare case where an even more drastic fallback is needed.

### 🚨 What `error.js` Actually Is
A special file that automatically wraps a route segment in a React Error Boundary — catching errors thrown during rendering or data fetching within that segment (and anything nested beneath it), showing the `error.js` component's output as a fallback instead of crashing the whole app.

### 🎯 What Types of Errors It Handles (and Doesn't)
Errors thrown by Server/Client Components during render, and errors thrown inside a `fetch()` or data-fetching call within that segment. It does not catch errors in event handlers or asynchronous code outside the render path — the same fundamental limitation React Error Boundaries generally have, since they only catch errors during the render/commit lifecycle, not inside a click handler or a `setTimeout` callback.

### 💻 Why `error.js` Must Be a Client Component
A genuinely important, often-tested detail: `error.js` must be marked `"use client"`, since Error Boundaries are implemented via class component lifecycle methods (`getDerivedStateFromError`/`componentDidCatch`) under the hood, and those only exist in the client-rendering model. `error.js` receives an `error` prop and a `reset` function, letting it attempt re-rendering the segment again — for instance, after a "try again" button click.

### 🌐 `global-error.js`: Catching Failures in the Root Layout Itself
A special, root-level variant that catches errors in the root layout itself — something a regular `error.js` can't do, since `error.js` files catch errors in their own segment and below, but not in an ancestor layout above them. `global-error.js` must render its own complete `<html>`/`<body>` tags, since it replaces the entire root layout when triggered — a genuinely rare, last-resort fallback for catastrophic failures in the app's own root shell.

### ❓ Follow-up Interview Questions

1. What kinds of errors can `error.js` catch, and what kinds can it not?
2. Why must `error.js` be a Client Component specifically?
3. What do the `error` and `reset` props let an `error.js` component actually do?
4. Why can't a regular `error.js` catch an error thrown by the root layout itself?
5. Why does `global-error.js` need to render its own `<html>` and `<body>` tags?

---

## 6. How does `not-found.js` work alongside dynamic routes and layouts?

### 📖 Introduction
An earlier chapter covered `not-found.js`'s two triggers — automatic route mismatches versus explicitly calling `notFound()` — in full depth. This focuses specifically on how it interacts with the surrounding layout hierarchy, a genuinely different angle.

### 🖼️ It Still Renders Inside Whatever Layouts Wrap That Segment
When `notFound()` is called — or a route genuinely doesn't match — the nearest `not-found.js` renders, but crucially, it still renders inside whatever layouts wrap that segment, the same way `error.js`/`loading.js` do. A `not-found.js` inside `/dashboard/` still renders within the dashboard layout — sidebar, nav, and all — rather than showing a completely bare, unstyled 404 page. A genuinely valuable, concrete UX point: the user still sees the app's surrounding chrome even when a specific resource wasn't found, rather than being dropped into a jarring, context-less error page.

### 🗂️ The Root-Level Fallback When No Segment-Specific `not-found.js` Exists
If no more specific `not-found.js` exists for a segment, the nearest ancestor's `not-found.js` — potentially the root one — handles it instead, the same scoping behavior as `error.js`/`loading.js`.

### 🏗️ A Concrete Example
```
app/
  layout.js
  not-found.js       → generic 404, shown outside any nested layout
  dashboard/
    layout.js        → dashboard shell (sidebar, nav)
    not-found.js     → dashboard-specific 404, shown inside the dashboard layout
    posts/
      [id]/
        page.js      → calls notFound() if the post doesn't exist
```
Visiting a non-existent post at `/dashboard/posts/999` renders the dashboard-specific `not-found.js`, still wrapped in `DashboardLayout` — sidebar still visible. Visiting a completely unmatched URL like `/random-nonsense` falls back to the root `not-found.js` instead, since it's outside the dashboard segment entirely.

### ❓ Follow-up Interview Questions

1. Why does a dashboard-specific `not-found.js` still show the sidebar and nav?
2. What happens if a segment has no `not-found.js` of its own at all?
3. In the example above, which `not-found.js` handles a request to `/random-nonsense`?
4. Why is showing surrounding app chrome around a 404 usually better UX than a bare error page?
5. Does calling `notFound()` explicitly inside `page.js` behave differently from an unmatched URL, in terms of which layouts wrap the result?

---

## 7. How does the App Router decide which layouts should be reused versus re-rendered during a navigation?

### 📖 Introduction
An earlier question in this chapter observed that shared layouts persist across sibling navigations — this goes deeper into the actual algorithm behind that behavior.

### 🌳 The Core Mechanism: Comparing Route Segment Trees
When navigating from one route to another, Next.js compares the two routes' segment trees — the chain of folders and layouts from the root down to the actual page — and determines which segments are shared (the same layout applies to both the old and new route) versus which segments differ.

### 🔍 The Comparison Happens Segment by Segment, From the Root Down
For each level of the route tree, if the same layout file applies to both the current and target route at that level, it's reused, not re-rendered. Once a level is reached where the routes diverge — a different page or layout applies — everything from that point downward gets replaced.

### 🏗️ A Concrete Example: Two Different Navigations Compared
Navigating from `/dashboard/settings` to `/dashboard/profile` — both share the root layout and `DashboardLayout` (the same segments up to `/dashboard`), diverging only at the final segment (`settings` vs. `profile`). So the root layout and `DashboardLayout` are reused, and only the final page component swaps. By contrast, navigating from `/dashboard/settings` to `/marketing/about` — assuming these live under separate route groups with their own layouts — diverges right at the root, so everything remounts.

### 💎 Good to Know: A Tree-Diff on Route Structure, Not Arbitrary JSX
This is precisely the mechanism behind the earlier-observed layout-persistence behavior, restated here as the general algorithm rather than one specific example — the App Router essentially performs a tree-diff on the route structure itself, analogous to React's own reconciliation, but operating at the level of route segments rather than arbitrary JSX elements.

### ❓ Follow-up Interview Questions

1. What two things does Next.js compare when deciding what to reuse during a navigation?
2. In the dashboard example, at which segment do the two routes diverge?
3. What happens to everything below the point where two routes' segment trees diverge?
4. Why is this described as a tree-diff on route structure rather than plain component reconciliation?
5. Would navigating between two routes in entirely separate route groups reuse the root layout? Why or why not?

---

## 8. How do Layouts and Templates interact with Server and Client Components?

### 📖 Introduction
This is a genuinely different angle from the rest of this chapter — not about layout/template behavior itself, but about their Server/Client nature specifically.

### 🖥️ Layouts and Templates Are Server Components by Default
Just like any other component in the App Router, layouts and templates default to Server Components. They can fetch their own data directly — a dashboard layout fetching the current user's profile once, shared across all nested pages without each page needing to re-fetch it. Since a layout persists across navigation, this data only needs to be fetched again when the layout itself actually re-renders, not on every navigation within its scope.

### 💻 Can They Be Client Components? Yes, But Push the Boundary Down
Marking a `layout.js`/`template.js` file `"use client"` works the same way as any other component, but the same "push the boundary down" guidance from the Server & Client Components chapter applies: marking an entire layout as client unnecessarily drags everything it imports into the client bundle, including structural code that didn't need to be there. Better to keep the layout itself as a Server Component, and extract just the interactive piece — a collapsible sidebar toggle, say — into its own small Client Component imported into the layout.

### 🏷️ The Metadata Export Nuance
Layouts can export metadata (the Metadata & SEO chapter goes deeper) — this only works if the layout is a Server Component, since `export const metadata` is a build/server-time construct, not something a Client Component can provide. Another concrete reason to keep layouts as Server Components by default.

### 🎬 Templates Specifically: Client-Side Effects Are Often the Whole Point
Since templates re-render on every navigation, if a template is a Client Component with its own state or effects, those effects re-run every time — often the whole reason for using a template in the first place. The motivating examples from earlier in this chapter — animations, page-view logging — typically require the template itself (or a Client Component it renders) to be a Client Component, since effects and animations are inherently client-side concerns.

### ❓ Follow-up Interview Questions

1. Why does a layout being a Server Component matter for exporting metadata?
2. What's the risk of marking an entire layout `"use client"` just to make one small piece interactive?
3. Why does a persistent layout only need to fetch its own data once, rather than on every navigation?
4. Why do a template's motivating use cases (animations, logging) typically require it to be a Client Component?
5. What's the recommended fix if only a small part of a layout needs interactivity?

---

## 9. What are the performance trade-offs between using a Layout and using a Template?

### 📖 Introduction
This ties together everything covered so far in this chapter into a concrete performance comparison.

### ⚡ Layout's Performance Advantage: Nothing Re-Runs Unnecessarily
Since a layout persists across navigation, it avoids re-running its own render logic, re-fetching its own data, and re-mounting or re-initializing any state on every navigation within its scope. This is genuinely cheaper, particularly for a layout with expensive data fetches or complex child component trees, like a sidebar with many nested items.

### 🐢 Template's Performance Cost: Everything Re-Runs on Every Navigation
Since a template remounts on every navigation, any data fetching it does gets re-run every time, any state resets, and any expensive initial render work happens repeatedly. For a template wrapping a large amount of content or logic, this remount cost could be genuinely noticeable, especially if navigation happens frequently between routes sharing that template.

### 🎯 The Guidance: Default to Layout, Scope Templates Narrowly
Default to Layout for anything wrapping substantial content or data, and only use Template for the specific, narrow cases where remounting is genuinely desired. Even then, consider scoping the template as narrowly as possible — wrapping only the specific piece that needs the remount behavior, rather than an entire route segment's content — to minimize the remount cost.

### 💎 Good to Know: A Middle-Ground Pattern
If some behavior needs to reset on every navigation, but the rest of a segment's content is expensive and should persist, these can be combined — a persistent `layout.js` wrapping most of the content, with a small, targeted template (or even just a key-based reset trick on a specific child component) used only for the narrow piece that genuinely needs to reset, avoiding the "everything remounts" cost of a blanket template.

### ❓ Follow-up Interview Questions

1. Why is a layout with an expensive data fetch a particularly strong case for using Layout over Template?
2. What specifically gets re-run every time for a Template that wouldn't for a Layout?
3. Why should a Template be scoped as narrowly as possible, even when one is genuinely needed?
4. Describe the middle-ground pattern for combining persistent and reset-on-navigation behavior in the same segment.
5. What real-world symptom would tip you off that a Template is causing a performance problem?

---

## 10. How would you design nested layouts for a large enterprise dashboard with multiple user roles?

### 📖 Introduction
This applies role-based authorization concepts to a concrete layout architecture question.

### 🎭 Role-Based Layout Structure: Shared Shell, Conditional or Separate Nested Layouts
A shared, common dashboard shell (top-level nav, global styling) at the root, with role-specific nested layouts beneath it — an admin layout with extra nav items, a regular-user layout without them — decided at the layout level by checking the authenticated user's role before rendering. A genuinely practical trade-off worth stating: separate layout files per role avoid one large conditional component, but multiply the number of files to maintain — a shared layout with role-conditional sections is often simpler for a moderate number of role variations.

### 🗂️ Route Groups for Substantially Different Role-Based Sections
Using route groups to organize role-specific sections — `(admin)` versus `(user)` route groups, each with their own layout — makes sense if the role-based UI differences are substantial enough to warrant genuinely separate folder trees rather than one shared layout with conditionals.

### 🧱 Loading/Error Boundaries Per Major Section
A large enterprise dashboard typically has multiple independent widgets or sections — analytics, notifications, an activity feed. Giving each major section its own `loading.js`/`error.js` — scoped via nested folders, or parallel routes — means one slow or failing section doesn't block or crash the whole dashboard.

### 📡 Shared Data Fetched Once at the Layout Level
The current user's profile and permissions, fetched once in the root dashboard layout, rather than each nested page re-fetching the same user info.

### ❓ Follow-up Interview Questions

1. What's the trade-off between a shared layout with role-conditionals and separate layouts per role?
2. When would separate route groups for admin vs. regular users be worth the extra folders?
3. Why should each major dashboard section have its own loading/error boundary rather than one for the whole page?
4. Why does fetching user data at the layout level, rather than per page, make sense given how layouts persist?
5. How would you decide between conditional rendering inside one layout versus fully separate layout files?

---

## 11. What challenges arise when building deeply nested layout hierarchies, and how would you organize layouts in a large application?

### 📖 Introduction
Deep nesting brings real, practical costs worth naming explicitly, along with organizational guidance for keeping it manageable.

### 🧩 Challenge 1: Hard to Trace Which Layouts Apply to a Given Page
As nesting grows deeper — root, section, sub-section, feature, page — understanding the full chain of wrapping layouts for a specific page requires mentally traversing the entire folder tree, a genuinely real cognitive cost at scale.

### 🔁 Challenge 2: Awkward Data Sharing Between Layout Levels
If multiple nested layouts each need similar or overlapping data — both a section layout and a sub-section layout needing the current user — without careful organization this can lead to redundant fetches or awkward coordination, since layouts don't directly pass arbitrary props to each other the way regular components can; each layout in the chain only receives `children`.

### 💥 Challenge 3: Unintended Remounts From Structural Refactors
Reorganizing folders — moving a page between route groups — can accidentally change which layouts apply, causing unexpected remounts and state loss for users if not carefully considered during refactors.

### 📝 Organizational Guidance: Nest Only for Genuine Shared-UI Boundaries
Keep the nesting as shallow as genuinely necessary — don't nest layouts just to match an internal folder-organization scheme that doesn't actually need its own shared UI. Reserve a new layout level for genuine shared-UI boundaries — a sidebar, a nav bar that's actually different at that level — not for every logical grouping. Documenting the layout hierarchy for a large team helps too, since the folder structure alone becomes harder to mentally trace as nesting deepens.

### ❓ Follow-up Interview Questions

1. Why does tracing which layouts apply to a page get harder as nesting grows deeper?
2. Why can't a parent layout pass arbitrary data down to a child layout the way a normal component would?
3. How could reorganizing folders accidentally cause unexpected layout remounts?
4. What's the guiding principle for deciding whether a new nesting level deserves its own layout?
5. Why might documenting the layout hierarchy separately be worth doing for a large team?

---

## 12. Explain the complete navigation lifecycle involving Layouts, Templates, Loading UI, and Error boundaries together.

### 📖 Introduction
This closing trace ties together everything covered in this chapter into one end-to-end sequence.

### 🚀 Steps 1–2: Navigation Triggers, Segment Trees Compared
Navigation is triggered — a link click, programmatic navigation. Next.js compares the old and new route's segment trees, determining which layouts are reused versus replaced.

### 💾 Step 3: Reused Layouts Persist, Unchanged
For segments that are reused — the same layout applies to both the old and new route — those layout instances persist unchanged, and their state survives.

### 🪆 Step 4: Diverging Segments Render — Templates Always Get a Fresh Instance
For segments that diverge, the new segment's content begins rendering. If the segment has a `template.js`, a fresh instance is created regardless of whether the underlying content is conceptually "the same."

### ⏳ Step 5: `loading.js` Shows Immediately While Data Resolves
While the new segment's Server Components are still resolving, the nearest `loading.js` boundary's fallback shows immediately, giving the user instant feedback that navigation is happening.

### 🚨 Step 6: Errors Are Caught by the Nearest Boundary
If an error occurs during this rendering, the nearest `error.js` boundary catches it, showing its fallback instead of the intended content. If the error happens in the root layout itself, `global-error.js` takes over instead.

### 🔍 Step 7: A Genuinely Unmatched Route Falls Back to `not-found.js`
If the route genuinely doesn't match, or code calls `notFound()`, the nearest `not-found.js` renders instead, still wrapped in whatever layouts apply to that segment.

### ✅ Step 8: The New Content Resolves, Replacing the Fallback
Once the new segment's content resolves successfully, it replaces the loading fallback, and the page is fully rendered — the reused layouts never re-rendered throughout this entire process, only the diverging segment's content changed.

### ❓ Follow-up Interview Questions

1. At which step does Next.js decide which layouts persist versus which get replaced?
2. Why does a `template.js` always get a fresh instance, even for content that "looks the same"?
3. What happens if an error occurs specifically inside the root layout, rather than a nested page?
4. Why does a `not-found.js` result still render inside its segment's surrounding layouts?
5. Throughout this entire lifecycle, what never re-renders if the layout was reused?

---

## 13. How would you explain the Layouts/Templates architecture to someone coming from traditional React Router?

### 📖 Introduction
This closing question maps every mechanic in this chapter onto a mental model a React Router-experienced developer already has.

### 🔄 The Familiar React Router Model, Recapped
A single `<Routes>` tree where nested layouts are achieved manually via nested `<Route>` elements, with a shared parent component rendering an `<Outlet />` for its children. The developer explicitly writes the nesting structure in code, and all of it lives in one place — a routes configuration file or component tree.

### 🎭 Mapping the App Router's Files Onto That Model
`layout.js` is roughly a parent route component rendering an `<Outlet />`, where `{children}` is Next.js's equivalent of `<Outlet />` — but instead of writing the nesting explicitly in a routes config, the folder structure itself defines the nesting. `template.js` is roughly a parent route component that intentionally remounts its `<Outlet />`'s content on every navigation — something you'd have to manually implement with a changing `key` prop in React Router, but is a built-in file convention here.

### 🗺️ `loading.js` and `error.js`: Automating What You'd Build Manually
These are roughly what you'd typically build yourself with `<Suspense>` and Error Boundaries wrapping each `<Route>` manually in React Router. Next.js automates this wrapping via file convention, rather than requiring you to write the wrapping JSX yourself around every route.

### 💎 Good to Know: The Key Conceptual Shift — Explicit Composition vs. Implicit Folder Structure
React Router requires thinking in terms of "a routes tree I explicitly compose in code." The App Router lets you think in terms of "a folder structure that implicitly defines the same tree," with Next.js automatically inferring the nesting and wrapping behavior — layout persistence, Suspense/error boundary wrapping — that you'd otherwise have to write by hand. A genuinely valuable mental model for someone who already understands nested routes and `<Outlet />` conceptually, just expressed through a different, file-based, convention-driven mechanism.

### ❓ Follow-up Interview Questions

1. What does `{children}` in a Next.js layout correspond to in React Router's model?
2. What would you have to build manually in React Router to replicate `template.js`'s remount-on-navigation behavior?
3. What would you have to build manually in React Router to replicate `loading.js` and `error.js`?
4. What's the key conceptual shift between React Router's model and the App Router's model?
5. Why might this analogy be a genuinely useful bridge for someone experienced only with React Router?

---