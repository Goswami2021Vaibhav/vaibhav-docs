---
title: Routing
description: Client-side routing with React Router — routes, params, and navigation.
sidebar_position: 13
---

# Routing

## 1. What is React Router, and what is client-side routing versus traditional server-side routing?

### 📖 Introduction
This chapter covers React Router — the standard library for handling navigation in a React single-page application. React itself has no built-in concept of "pages" or "URLs"; React Router adds that layer on top. Before its specific pieces, it's worth being precise about the core idea it's built on: client-side routing, and how it differs from the traditional model the web ran on for decades.

### 🖥️ Traditional Server-Side Routing
In the traditional model, every URL corresponds to a request sent to a server, which responds with a complete, new HTML document. Clicking a link means the browser discards the current page entirely, requests a new one, and re-parses and re-renders everything from scratch — including re-downloading CSS/JS and losing any in-memory state the page had.

### ⚡ Client-Side Routing
In a single-page application, the browser loads one HTML page and one JavaScript bundle up front. From then on, "navigating" between pages doesn't involve the browser requesting a new document at all — React Router intercepts navigation, updates the URL shown in the address bar, and swaps which components render, entirely within the already-loaded JavaScript. No full page reload happens, and any client-side state that isn't tied to the unmounted components (Context, a global store, a still-playing video) survives the navigation.

### 📦 What React Router Actually Is
React Router is a library, not a part of React core. It provides the components and hooks (covered through this chapter) that let a React app declare "this URL renders this component," handle navigation events, read URL parameters, and keep the browser's URL bar in sync with what's actually rendered — all without page reloads.

### 🆚 The Core Difference, Concretely
Server-side routing: URL change → new server request → new HTML document → full reload. Client-side routing: URL change → React Router intercepts it → the right components render → the browser never requests a new document. The exact mechanism React Router uses to intercept navigation and update the URL without triggering a reload is covered in Question 3.

### 💎 Good to Know: The Trade-offs Come Later
Client-side routing isn't strictly "better" — it comes with real costs (a heavier upfront bundle, SEO and initial-paint considerations) that are covered in full in Question 12, once more of React Router's mechanics have been introduced.

### ❓ Follow-up Interview Questions

1. Why doesn't clicking a React Router `<Link>` trigger a full page reload?
2. What happens to in-memory client state during a traditional server-side navigation, versus a client-side one?
3. Is React Router part of React itself, or a separate library? Why does that distinction matter?
4. What has to be true about how an app is built for client-side routing to work at all?
5. Name one cost of client-side routing that server-side routing doesn't have.

---

## 2. What are the roles of `<BrowserRouter>`, `<Routes>`, `<Route>`, and `<Link>`?

### 📖 Introduction
These four components are the core building blocks of React Router. Each has one specific job, and understanding the division of labor between them makes the rest of the library's API much easier to reason about.

### 🌐 `<BrowserRouter>`: The Context Provider at the Root
`<BrowserRouter>` wraps the whole app and is, under the hood, a Context Provider (Context API chapter) — it supplies the current URL/location and navigation methods to everything below it via React Context. Every hook covered later in this chapter (`useNavigate`, `useParams`, and others) reads from this same Context internally, which is why they only work inside a component tree wrapped by `<BrowserRouter>`.

### 🔀 `<Routes>`: Picks the One Best-Matching Route
`<Routes>` looks at the current URL and renders exactly one of its `<Route>` children — the single best match, not every route that happens to match. In React Router v6 (the current standard, replacing v5's `<Switch>`), matching is done by automatically ranking routes by specificity, rather than v5's "first one that matches wins" behavior — so route order in JSX generally doesn't matter the way it used to.

### 🛣️ `<Route>`: Maps One URL Pattern to One Component
A single `<Route>` declares one URL pattern and the component to render for it:
```jsx
<Route path="/users/:id" element={<UserProfile />} />
```
Routes can be nested inside one another — covered fully in Question 6.

### 🔗 `<Link>`: An `<a>` Tag That Doesn't Actually Navigate
`<Link>` renders a real `<a>` element (so it stays accessible and keyboard-navigable) but intercepts the click event, calls `preventDefault()` on it, and hands the navigation off to React Router instead — updating the URL and swapping components client-side (Question 1). Using a raw `<a href="...">` instead would let the browser handle the click natively, triggering a full page reload and defeating the entire point of client-side routing.

### 🧩 Putting Them Together
```jsx
<BrowserRouter>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
  </nav>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>
```

### 💎 Good to Know: Why `<Route>` Order Stopped Mattering in v6
In v5, two `<Route>`s that both matched a URL meant whichever was declared first inside `<Switch>` won — leading to a common bug where a more general route accidentally shadowed a more specific one declared after it. v6's ranking-based matching in `<Routes>` removed that entire class of ordering bug.

### ❓ Follow-up Interview Questions

1. Why do `useNavigate()` and `useParams()` only work inside a `<BrowserRouter>`-wrapped tree?
2. What would happen if `<Routes>` rendered every matching `<Route>` instead of just the best match?
3. Why does using a raw `<a href="...">` break client-side routing, even though `<Link>` also renders an `<a>` tag?
4. What changed between React Router v5's `<Switch>` and v6's `<Routes>` in terms of matching behavior?
5. What problem did v5's "first match wins" ordering cause that v6's ranking system solved?

---

## 3. How does client-side routing avoid full page reloads, and how does React Router integrate with the browser's History API?

### 📖 Introduction
Questions 1 and 2 both promised this mechanical depth — here's exactly how a `<Link>` click updates the URL without the browser ever requesting a new document, and how it plays with the browser's own back/forward buttons.

### 🕰️ The Browser's History API: `pushState` and `replaceState`
The whole thing rests on a browser API that predates React Router: `history.pushState(state, title, url)` and `history.replaceState(state, title, url)`. Both let JavaScript change the URL shown in the address bar and modify the browser's session history stack — without triggering any network request or page reload. `pushState` adds a *new* entry to the history stack (so the back button correctly returns to the previous route); `replaceState` overwrites the *current* entry in place, adding no new back-navigable step — used for redirects, like `<Navigate replace>` or a post-login redirect that shouldn't leave the login page in the back-button history.

### ⬅️➡️ The `popstate` Event: Handling Back/Forward
`pushState`/`replaceState` only cover forward navigation triggered from inside the app. When a user clicks the browser's own back or forward button, no `pushState` call happens — instead, the browser fires a `popstate` event. React Router listens for this event and re-syncs its rendered UI to whatever URL the user navigated to, closing the other half of the loop.

### 🔍 A Complete Trace: What Happens When You Click a `<Link>`
1. The user clicks `<Link to="/about">`.
2. `<Link>`'s click handler intercepts the event and calls `event.preventDefault()`, stopping the browser's native anchor navigation (Question 2).
3. Internally, it calls `history.pushState()` with the new URL — the address bar updates, a new history entry is added, and no network request fires.
4. React Router's internal "current location" state, held in the `<BrowserRouter>` Context (Question 2), updates to reflect the new URL.
5. That Context update triggers a re-render of `<Routes>` (Context propagation mechanics — Context API chapter, Question 14), which re-evaluates its children and picks the new best-matching `<Route>` (Question 2).
6. The previous route's component unmounts (running any cleanup functions — Component Lifecycle chapter) and the new route's component mounts.

### 💎 Good to Know: Why `replaceState` Matters for Redirects
Using `pushState` for something like a post-login redirect would leave the login page reachable via the back button after the user is already authenticated — often the wrong UX. `replaceState` avoids that by overwriting the login page's history entry entirely, so pressing back skips straight past it.

### ❓ Follow-up Interview Questions

1. What's the key difference between `history.pushState` and `history.replaceState`?
2. Why does the browser fire a `popstate` event instead of React Router simply calling `pushState` for back/forward navigation?
3. At what exact step in the `<Link>` click trace does React actually re-render anything?
4. Why would `<Navigate replace>` be preferred over a normal navigation for a post-login redirect?
5. Does `history.pushState` ever cause a network request? Why or why not?

---

## 4. What is programmatic navigation, and what's the difference between `useNavigate()` and the `<Navigate>` component?

### 📖 Introduction
Not all navigation starts with a user clicking a `<Link>` — sometimes code needs to trigger navigation itself, for example redirecting after a form submits successfully. This is programmatic navigation, and React Router offers two distinct ways to do it: one imperative, one declarative.

### 🎮 `useNavigate()`: Imperative, Call It When Something Happens
`useNavigate()` returns a function you call directly, inside an event handler or an effect, whenever some other logic decides navigation should happen:
```jsx
const navigate = useNavigate();

async function handleSubmit(formData) {
  await login(formData);
  navigate("/dashboard");
}
```
This fits navigation that's a *side effect* of something else completing — a successful API call, a timer, a condition checked inside a `useEffect`.

### 🔀 `<Navigate>`: Declarative, Part of What Renders
`<Navigate>` is a component — navigation happens as a result of it being *rendered*, not called:
```jsx
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```
This fits purely conditional-rendering logic — describing "if this render condition is true, redirect" as JSX itself, consistent with React's declarative style elsewhere. This is the foundation of the protected-route pattern, covered in full in Question 7.

### ⚙️ Under the Hood: `<Navigate>` Is Built on `useNavigate()`
These aren't two independent mechanisms — `<Navigate>` is essentially a small wrapper component that calls `useNavigate()` internally inside its own effect when it mounts. Knowing this makes the "which one do I use" question easier: they're the same underlying capability, exposed as either an imperative function or a declarative component depending on where in the component's logic the decision to navigate naturally lives.

### ⚠️ The Pitfall: Don't Call `navigate()` Directly in the Render Body
Calling `navigate()` directly in a component's render body (rather than inside an effect or event handler) is a side effect during render — the same category of mistake covered in the Hooks and Component Lifecycle chapters. For a render-time redirect, use `<Navigate>` instead, which handles the effect timing correctly internally.

### ❓ Follow-up Interview Questions

1. When would you reach for `useNavigate()` instead of `<Navigate>`, concretely?
2. Why is `<Navigate>` described as "built on top of" `useNavigate()` rather than a separate mechanism?
3. What's wrong with calling `navigate()` directly inside a component's render body?
4. Why does a protected-route check typically use `<Navigate>` rather than `useNavigate()` in an effect?
5. If a form submission needs to redirect only after an async API call resolves, which approach fits, and why?

---

## 5. What are route parameters vs. query parameters, and how do you access each?

### 📖 Introduction
Both live in the URL, but they serve genuinely different purposes and are accessed with different hooks. Confusing the two — or where each belongs — is a common source of routing bugs, so the distinction is worth being precise about.

### 🆔 Route Parameters: Identifying a Specific Resource
Route parameters are part of the URL's *path*, declared in the route pattern with a `:` prefix — `path="/users/:userId"` matches `/users/42`, and the route considers `userId` to be `"42"`. They're conceptually part of "which page is this" — identifying a specific resource, like a particular user or product — which is why `<Routes>`'s matching (Question 2) depends on them. Access them with `useParams()`:
```jsx
const { userId } = useParams();
```

### 🔍 Query Parameters: Modifying or Filtering a View
Query parameters appear after a `?` — `/search?q=react&sort=recent` — as key/value pairs. They're orthogonal to route matching entirely: `<Route path="/search">` matches regardless of what query string follows, so `<Routes>` ignores them completely when deciding which route to render. They exist to modify or filter the *view* of whatever the route already identifies — sort order, pagination, active tab — not to identify the resource itself. Access them with `useSearchParams()`, which returns a `[searchParams, setSearchParams]` tuple shaped like `useState`:
```jsx
const [searchParams, setSearchParams] = useSearchParams();
const tab = searchParams.get("tab") ?? "overview";
```

### 🧩 Both Together, Concretely
```jsx
<Route path="/users/:userId" element={<UserProfile />} />

function UserProfile() {
  const { userId } = useParams();                    // identifies which user
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "overview";  // /users/42?tab=settings

  return <div>User {userId}, viewing the {tab} tab</div>;
}
```

### 💎 Good to Know: `setSearchParams` Follows the Same Push/Replace Rules
Calling `setSearchParams(...)` updates the URL the same way any other navigation does — by default it adds a new history entry (Question 3's `pushState`), meaning the back button steps through each previous query-string value. Passing `{ replace: true }` makes it overwrite the current entry instead (`replaceState`), useful when query changes like live-typing a search filter shouldn't each become their own back-button step.

### ❓ Follow-up Interview Questions

1. Why doesn't `<Routes>` consider the query string at all when matching a route?
2. Why are route parameters described as identifying a resource, while query parameters describe a view of it?
3. What would happen to the back button if every keystroke in a live search box called `setSearchParams` without `{ replace: true }`?
4. If a URL is `/products/7?sort=price`, what would `useParams()` and `useSearchParams()` each return?
5. Why might putting a "which product is this" identifier in a query parameter instead of a route parameter be the wrong design choice?

---

## 6. What are nested routes, and what role does the `<Outlet>` component play?

### 📖 Introduction
Nested routes let a shared layout — a sidebar, a header, common navigation — persist across multiple related pages, without duplicating that layout markup in every page component.

### 🪆 Nested Routes: Sharing a Layout Across Multiple Child Pages
A `<Route>` can be declared inside another `<Route>`, so the child route's element renders *within* the parent's output rather than replacing it entirely:
```jsx
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```
Both `/dashboard/profile` and `/dashboard/settings` share the same `DashboardLayout` shell, with only the inner content differing.

### 🕳️ `<Outlet>`: The Slot Where the Matched Child Renders
`<Outlet>` is placed inside the parent's own component, marking exactly where the matched child route's element should render:
```jsx
function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet /> {/* the matched child route renders here */}
      </main>
    </div>
  );
}
```

### ⚡ Why This Matters: The Shared Layout Doesn't Remount
Without nesting, every page component would need to re-render its own copy of `Sidebar` and the surrounding layout — and because they'd be separate elements each time, React would treat them as distinct instances across navigations (Rendering & Reconciliation chapter's "same position, same type" reconciliation rule). With nesting, `DashboardLayout` renders once and stays mounted across navigations between `/dashboard/profile` and `/dashboard/settings` — only whatever's inside `<Outlet>` unmounts and remounts. This means `Sidebar`'s own local state (an expanded submenu, scroll position) survives navigation between sibling routes, instead of resetting on every click.

### 💎 Good to Know: Passing Data Through `<Outlet>`
A lesser-known feature: `<Outlet context={someValue} />` lets the parent layout pass data down to whichever child route currently renders, retrieved in the child with `useOutletContext()` — useful when a layout already fetched something (like the current user) that its child routes also need, without re-fetching it.

### ❓ Follow-up Interview Questions

1. What would break if a shared layout's markup were duplicated into every page component instead of using nested routes?
2. Why does `Sidebar`'s local state survive navigation between `/dashboard/profile` and `/dashboard/settings`, but not necessarily between `/dashboard` and an entirely unrelated route?
3. What does `<Outlet>` actually mark, mechanically, inside a parent route's component?
4. When would `useOutletContext()` be useful, and what problem does it solve?
5. If `DashboardLayout` itself changed type (e.g., during a hot-reload or conditional render), what would happen to its children rendered via `<Outlet>`?

---

## 7. How do you implement protected/authentication-based routes, including role-based access?

### 📖 Introduction
Protected routes combine two mechanisms already covered: nested routes with `<Outlet>` (Question 6) and declarative redirects with `<Navigate>` (Question 4). Put together, they form the standard "gate" pattern used in almost every real app.

### 🚪 The `RequireAuth` Pattern: Combining `<Outlet>` and `<Navigate>`
```jsx
function RequireAuth() {
  const { user } = useAuth(); // the Context API chapter's custom hook facade pattern
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // renders whichever protected child route matched
}
```
```jsx
<Routes>
  <Route element={<RequireAuth />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
  <Route path="/login" element={<Login />} />
</Routes>
```
`RequireAuth` acts as a layout route with no visual output of its own — just a gate. If authenticated, it renders `<Outlet />` to let whichever protected child route matched (Question 6); if not, it redirects declaratively via `<Navigate>` (Question 4), using `replace` so the protected page doesn't linger in back-button history.

### 📍 Redirecting Back After Login
Notice `state={{ from: location }}` — `useLocation()` captures where the user was trying to go before being redirected. After a successful login, `Login` can read `location.state.from.pathname` and call `navigate()` back to that original destination, instead of always dropping the user on a generic home page.

### 🎭 Extending to Role-Based Access
The same pattern extends naturally to authorization, not just authentication:
```jsx
function RequireRole({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!user.roles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
```
```jsx
<Route element={<RequireRole role="admin" />}>
  <Route path="/admin" element={<AdminPanel />} />
</Route>
```

### ⚠️ Critical Caveat: This Is a UX Gate, Not a Security Boundary
This is worth stating explicitly, because it's easy to miss: client-side route protection only controls what the UI *shows*. All client-side JavaScript is inspectable and modifiable by the user running it, so hiding a route or component client-side does nothing to stop a determined user from calling the underlying API directly. Real access control has to be enforced on the server — every API endpoint must independently verify authentication and role on each request, regardless of what the client-side routing layer decided to render.

### ❓ Follow-up Interview Questions

1. Why does `RequireAuth` use `<Outlet />` instead of directly rendering its children as a prop?
2. What UX problem does capturing `location.state.from` before redirecting to login solve?
3. How would you extend `RequireAuth` to support checking multiple required roles instead of one?
4. Why is client-side route protection insufficient as the only line of defense for sensitive data?
5. What would happen to the back button if `<Navigate>` here didn't use the `replace` prop?

---

## 8. How do you implement lazy loading and code splitting for routes?

### 📖 Introduction
Question 1 mentioned that client-side routing comes with a real cost: a heavier upfront JavaScript bundle. Route-level code splitting is the standard fix — loading each route's code only when the user actually navigates to it, rather than bundling every possible page into one file downloaded on the first visit. (Code splitting more broadly, beyond just routes, is covered again in the Performance Optimization chapter — this scopes it specifically to routes, the most common and highest-value place to apply it.)

### 📦 Why Split by Route
Without splitting, every route's component — and everything it imports — ends up in one giant bundle, downloaded before the user has even chosen which page to visit. Splitting per route means the initial download only includes the code for whichever route the user actually lands on first.

### ⚡ `React.lazy()`: Deferring the Import Until First Render
```jsx
const Dashboard = React.lazy(() => import("./Dashboard"));
```
`React.lazy` wraps a dynamic `import()` call. The bundler (webpack, Vite, etc.) turns `./Dashboard` into a separate chunk file at build time, and that chunk is only fetched over the network the first time `<Dashboard />` is actually about to render — not upfront with everything else.

### ⏳ `<Suspense>`: Showing Something While the Chunk Loads
Since a lazy component's code isn't available synchronously the first time it's needed, React needs to render *something* while the chunk downloads. `<Suspense fallback={<Spinner />}>` shows its fallback until the import resolves:
```jsx
<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>
```

### 🗺️ Where to Place the Suspense Boundary
A single `<Suspense>` wrapping the entire `<Routes>` tree is usually simplest and sufficient — any navigation to a route whose chunk hasn't loaded yet shows the fallback briefly. Wrapping individual lazy routes in their own `<Suspense>` boundaries is also possible, for more granular per-route loading states, at the cost of more boilerplate.

### 💎 Good to Know: The Fallback Only Shows Once Per Route
Once a chunk has been downloaded, the browser's module cache keeps it available for the rest of the session — navigating away and back to the same route doesn't refetch it or show the fallback again. The loading state is typically seen only on each route's first visit in a session, until a hard page refresh clears the cache.

### ❓ Follow-up Interview Questions

1. Why does splitting by route specifically address the bundle-size cost mentioned in Question 1?
2. What does `React.lazy()` actually defer, and until when?
3. What would happen if a lazy component rendered without being wrapped in any `<Suspense>` boundary?
4. Why might a developer choose per-route `<Suspense>` boundaries instead of one wrapping all routes?
5. Why doesn't navigating back to an already-visited lazy route show the loading fallback again?

---

## 9. How do you handle 404 (not found) routes and pass data between routes?

### 📖 Introduction
Two related but distinct practical needs: showing something sensible when a URL matches nothing, and moving data from one route to another. Both build directly on mechanisms already covered in this chapter.

### 🚫 Handling 404s: The Wildcard Route
A `<Route path="*">` placed last in `<Routes>` matches any URL that didn't match anything declared above it:
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```
This connects directly to Question 2's ranking system — `*` is the least specific possible pattern, so v6's specificity-based matching only picks it when every other route has already failed to match.

### 🎯 Scoped 404s Within Nested Routes
The same wildcard can be scoped inside a nested route group (Question 6) to show a section-specific "not found" page rather than a global one — a `<Route path="*" element={<DashboardNotFound />} />` nested under `/dashboard` catches unmatched sub-paths there, while still rendering inside the shared `DashboardLayout`.

### 📨 Passing Data Between Routes: Four Mechanisms
- **Route params** (Question 5) — identifying which resource, e.g. `/users/:id`.
- **Query params** (Question 5) — describing a view of that resource, e.g. `?sort=recent`.
- **Navigation state** — `navigate("/profile", { state: { fromCheckout: true } })`, read on the other end with `useLocation().state`. Good for passing data that shouldn't clutter the URL, including data that isn't easily serialized into it.
- **`<Outlet context={...}>`** (Question 6) — for passing data from a parent layout down specifically to its matched child route.

### ⚠️ The Navigation-State Caveat: It Doesn't Survive a Refresh
Navigation state only exists in memory for that browser session — if the user refreshes the page or navigates to the URL directly (a shared link, a bookmark), the state is gone. Anything that must survive a refresh needs to live somewhere durable instead: the URL itself (route or query params), or re-fetched from the server using the route param as a key (TanStack Query, State Management chapter, Question 5) — never navigation state.

### 💎 Good to Know: `navigate()`'s `state` Is Literally `pushState`'s `state` Argument
This isn't a React Router invention layered on top — Question 3 covered `history.pushState(state, title, url)`, and `navigate(to, { state })` is exposing that exact same browser-native `state` argument through a hook. It behaves the way it does — in-memory only, tied to that specific history entry — precisely because it *is* that mechanism, not a separate one.

### ❓ Follow-up Interview Questions

1. Why does a wildcard route need to be declared last (or does order even matter given Question 2's ranking)?
2. How would you show a section-specific 404 page for unmatched routes under `/dashboard` without losing the shared layout?
3. Why does navigation state disappear on a page refresh, while route and query params don't?
4. If a component needs data that must be available even from a directly-shared URL, which of the four mechanisms should NOT be used, and why?
5. What is the actual browser API underlying React Router's navigation `state`?

---

## 10. How would you persist authentication state across page refreshes in a client-routed app?

### 📖 Introduction
Auth state normally lives in memory — Context or a store (Context API and State Management chapters). A full page refresh wipes all in-memory JavaScript state, so without a persistence strategy, a genuinely logged-in user would appear logged out the instant they refresh the page.

### 🧊 The Problem: In-Memory State Doesn't Survive a Refresh
On refresh, the entire JS bundle re-executes from scratch — every `useState`, every Context value, every store starts fresh. The app has no memory of who was logged in a moment ago unless something durable was saved outside of React entirely.

### 🔐 Where to Store the Persisted Token
- **`localStorage`** — persists across tabs and browser restarts until explicitly cleared; simple to use, but readable by any injected script, making it vulnerable to XSS token theft (Forms chapter's XSS coverage).
- **`sessionStorage`** — same accessibility and vulnerability profile, but scoped to a single tab and cleared when it closes.
- **`httpOnly` cookies** — not readable by JavaScript at all, which meaningfully mitigates XSS-based token theft, and sent automatically by the browser on matching requests. This is the more secure option, but requires server cooperation to set and read the cookie, plus CSRF protections.

### 🚀 The Rehydration Flow on App Startup
Since in-memory state starts empty, the app needs a bootstrapping step before it can confidently render anything auth-gated:
1. On initial mount, check for a persisted token (a `localStorage` read, or simply rely on an `httpOnly` cookie being sent automatically with the next request).
2. If one exists, validate it against the server — call a `/me`-style endpoint to confirm it's still valid and fetch the current user — rather than trusting the stored token blindly.
3. While that validation request is in flight, the app is in a genuinely unknown auth state, not yet either "logged in" or "logged out."

### ⏳ The Missing Third State: "loading," Not Just True/False
This is where Question 7's `RequireAuth` needs a fix: modeling auth status as a boolean `isAuthenticated` misses this in-between state entirely. It should be a three-way status instead:
```jsx
function RequireAuth() {
  const { status } = useAuth(); // "loading" | "authenticated" | "unauthenticated"
  const location = useLocation();

  if (status === "loading") return <Spinner />;
  if (status === "unauthenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
```
Without this, a common real bug appears: redirecting to login before the validation check has even finished, causing a visible flash of the login page on every refresh for users who are, in fact, still authenticated.

### 💎 Good to Know: Token Refresh
Access tokens are often short-lived by design, paired with a longer-lived refresh token used to silently re-authenticate without forcing a full login — more of a backend/auth-architecture concern than a routing one, but worth knowing it's the usual reason a "validate on startup" call exists at all.

### ❓ Follow-up Interview Questions

1. Why does a full page refresh wipe React state, and what does that mean for auth specifically?
2. What's the security trade-off between storing a token in `localStorage` versus an `httpOnly` cookie?
3. Why is modeling auth status as a boolean insufficient for handling refreshes correctly?
4. Walk through the exact bug that occurs if `RequireAuth` redirects before the startup validation call resolves.
5. Why does the app need to re-validate a stored token against the server rather than just trusting its presence?

---

## 11. What are common mistakes in structuring routes, and how should routing be organized in a large app?

### 📖 Introduction
Most routing problems in large apps aren't about React Router's API itself — they're organizational mistakes that compound as the number of routes grows. Here are the recurring ones, and the fix for each.

### 🪞 Mistake 1: Skipping Nested Layouts, Duplicating Markup
Not using nested routes (Question 6) and instead copy-pasting `Header`/`Sidebar` markup into every page component. Beyond the duplication itself, it means the shared layout remounts on every navigation instead of persisting, losing whatever local state it held (Question 6).

### 🧵 Mistake 2: Encoding View State in the URL Path Instead of Query Params
Overly deep, stateful path patterns like `/users/:userId/posts/:postId/edit/:mode` push UI/view concerns (like an edit mode toggle) into the route path, where they don't belong per Question 5's distinction — that kind of state belongs in a query param, or sometimes just local component state, not in the resource-identifying part of the URL.

### 🔤 Mistake 3: Hardcoded Path Strings Scattered Across the Codebase
Writing literal strings like `"/dashboard/settings"` directly into dozens of `<Link to="...">` and `navigate("...")` calls means a single path change requires a find-and-replace across the whole codebase, and a typo fails silently — no compile-time error, just a broken link discovered by a user. The fix is a centralized route-builder module:
```js
// routes.js
export const routes = {
  home: () => "/",
  userProfile: (userId) => `/users/${userId}`,
  dashboardSettings: () => "/dashboard/settings",
};

// usage — one source of truth, and it's just a function call, not a bare string
<Link to={routes.userProfile(user.id)}>Profile</Link>
navigate(routes.dashboardSettings());
```

### 🗂️ Mistake 4: One Giant Route File Instead of Feature-Owned Definitions
A single `App.jsx` declaring every `<Route>` for every feature becomes an unwieldy, merge-conflict-prone bottleneck as the app grows — this is the same feature-based organization principle from the State Management chapter's Question 10, applied to routes. The fix is having each feature folder export its own route definitions, composed together in one top-level router file rather than authored there directly.

### 🐌 Mistake 5: Skipping Lazy Loading Until It's Already a Problem
Not applying route-level code splitting (Question 8) from early on, and only reaching for it once the bundle size has already become noticeably slow — retrofitting it later is more work than building routes lazily from the start.

### 💎 Good to Know: These Compound
None of these mistakes are fatal individually in a small app, but in a large one they compound — a giant route file full of hardcoded strings and duplicated layouts becomes actively painful to change safely, which is exactly why these conventions matter more as an app scales, not less.

### ❓ Follow-up Interview Questions

1. Why does a centralized route-builder function catch mistakes that hardcoded path strings don't?
2. What specifically goes wrong with putting `/edit/:mode` in the URL path instead of a query param?
3. How would you compose feature-owned route definitions into one top-level router without one giant file?
4. Why does skipping nested layouts cost more than just code duplication?
5. Why is retrofitting lazy loading later more work than building it in from the start?

---

## 12. What are the trade-offs between client-side and server-side routing?

### 📖 Introduction
Question 1 deferred the full trade-off discussion until more of React Router's mechanics were covered — here it is in full.

### ⚡ Client-Side Routing: Advantages
No full page reload between navigations, so transitions feel instant. Client-side state survives navigation entirely — a video keeps playing, a WebSocket connection stays open, a form draft in an unrelated part of the UI isn't lost (Question 1). Each navigation typically only needs to fetch data via an API call, rather than a full new HTML document and all its associated assets.

### ⚡ Client-Side Routing: Disadvantages
The app must download enough JavaScript upfront to handle client-side routing at all — mitigated by lazy loading (Question 8), but the router and core app shell still load before anything else can. More significantly, a bare single-page app's initial HTML is often just a near-empty `<div id="root">`, meaning nothing meaningful is visible until JavaScript has downloaded and executed — a real cost to first contentful paint and time-to-interactive, especially on slow networks or low-power devices where JS execution itself is the bottleneck, not the network.

### 🖥️ Server-Side Routing: Advantages
Every page arrives with fully-formed HTML immediately — strong default SEO (content is visible to crawlers without executing any JavaScript) and fast time-to-first-meaningful-content, even on constrained devices. The mental model is also simpler: no client-side router state, no History API subtleties (Question 3) to reason about — the browser's native navigation just works.

### 🖥️ Server-Side Routing: Disadvantages
Every navigation is a full reload — all client-side state is lost, shared assets get re-downloaded and re-parsed unless aggressively cached, and building rich, app-like interactions that need to persist across what look like separate "pages" (a persistent audio player, a multi-step wizard) becomes far more difficult.

### 🌉 Good to Know: The Modern Hybrid — SSR/SSG Frameworks
This isn't strictly an either/or choice anymore in practice. Frameworks like Next.js and Remix render the initial HTML on the server (or at build time) — giving server-side routing's fast first paint and SEO — and then "hydrate" that HTML with client-side JavaScript, enabling client-side routing for every subsequent navigation. The full mechanics of SSR/hydration are a separate topic, but it's worth knowing this hybrid model exists precisely to capture both sets of advantages.

### ❓ Follow-up Interview Questions

1. Why can a bare client-side-routed app have a slower first meaningful paint than a server-routed one, even with a fast network?
2. What specific kind of UI interaction is much harder to build with pure server-side routing?
3. How does an SSR framework like Next.js get the benefits of both approaches?
4. Why does server-side routing have a simpler mental model, concretely?
5. If SEO were the single most important constraint for a new project, which approach (or hybrid) would you lean toward, and why?

---

## 13. How would you architect routing for a large application with hundreds of pages?

### 📖 Introduction
This pulls together nested layouts (Question 6), protected routes (Question 7), lazy loading (Question 8), and route organization (Question 11) into one blueprint — plus a few techniques that only really start to matter once an app has hundreds, not dozens, of routes.

### 🗂️ Route Configuration as Data, Not Hand-Written JSX
At this scale, hundreds of hand-authored `<Route>` elements in JSX becomes unwieldy to generate, filter, or merge. React Router's `useRoutes()` hook takes a plain JavaScript object/array describing the same route tree and returns the matched element — functionally equivalent to `<Routes>`/`<Route>`, but as data:
```js
const routes = useRoutes([
  { path: "/", element: <Home /> },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);
```
Because it's plain data, it can be generated programmatically, filtered by permission, or merged from many feature modules without deeply nested JSX composition.

### 🧩 Auto-Composed Feature Route Modules
Building on Question 11's feature-owned route definitions: at hundreds-of-pages scale, even a manually-maintained "list of all feature route files" in one composition point becomes a bottleneck. A build-time glob import (auto-discovering each feature's route module by file convention) removes that manual step entirely, so adding a new feature never requires editing a shared file at all.

### 🔐 Gate at the Layout Level, Not Per-Page
Extending Question 7's `RequireAuth`/`RequireRole` pattern: with hundreds of pages, auth and role checks should be applied to entire nested route groups via a handful of gate layouts, not duplicated per page. One `RequireRole role="admin"` wrapping an entire admin section protects every page inside it at once.

### ⚡ Lazy-Load Everything by Default, and Prefetch on Hover
At this scale, every route should be lazy (Question 8) as a blanket convention, not a case-by-case decision. To offset the loading-fallback cost this introduces, a common technique is prefetching a route's chunk when the user hovers or focuses its `<Link>` — starting the download before the click happens, so by the time navigation actually occurs, the chunk is often already cached. React Router doesn't do this automatically; it's typically layered on with a small wrapper around `<Link>`.

### 🔤 A Centralized Route Builder Becomes Non-Negotiable
Question 11's route-builder module (mapping route names to path-building functions) stops being a nice-to-have and becomes essential at hundreds of routes — it's the only thing standing between a large codebase and hundreds of independently hardcoded, silently-breakable path strings.

### 💎 Good to Know: None of This Is New — It's the Same Principles, Scaled Up
Every technique here is really the same idea already covered in this chapter, applied more strictly because the cost of skipping it grows with scale: data-driven config instead of JSX for maintainability, feature ownership instead of a shared bottleneck file, layout-level gating instead of per-page checks, and a route builder instead of scattered strings.

### ❓ Follow-up Interview Questions

1. Why does `useRoutes()` scale better than hand-written JSX once an app has hundreds of routes?
2. What problem does auto-composing feature route modules solve that manual composition doesn't?
3. Why should auth/role gating happen at the layout level rather than per individual page?
4. What does prefetching a route's chunk on link hover actually buy you, given that routes are lazy-loaded?
5. Is any single technique here specific to "hundreds of pages," or are they all just stricter applications of principles that apply at any scale?

---

## 14. Explain the complete navigation lifecycle in React Router, from a link click to the new component rendering.

### 📖 Introduction
Question 3 traced what happens on a `<Link>` click, but stopped once the new component mounted. This is the fuller version — incorporating nested route resolution, protection gates, and lazy-loaded chunks, tying together nearly everything covered in this chapter into one sequence.

### 🚀 Steps 1–3: Click, Intercept, and URL Update
`<Link>` intercepts the click and calls `preventDefault()` (Question 2), triggers `navigate()` (Question 4), which calls `history.pushState()` (Question 3) — the URL updates, a new history entry is added, and no network request fires. The `<BrowserRouter>` Context's location value updates and propagates to its subscribers (Context API chapter, Question 14's propagation mechanism).

### 🌳 Step 4: Resolving the Nested Route Match
`<Routes>` (or `useRoutes()` at scale, Question 13) re-evaluates the route tree against the new URL using v6's specificity ranking (Question 2). For a nested path like `/dashboard/settings`, this resolution happens hierarchically: the `/dashboard` segment first matches the parent route's layout component, and `/settings` then matches the nested child route within it (Question 6).

### 🚪 Step 5: Passing Through Any Protection Gates
If the matched hierarchy includes a gate component (`RequireAuth`/`RequireRole`, Question 7), it renders first, as the outermost element in the matched chain, and decides whether to render `<Outlet />` — continuing toward the real destination — or `<Navigate>`, redirecting elsewhere and restarting this entire matching process for the new target URL.

### ⏳ Step 6: Suspense and Lazy-Loaded Chunks
If the matched leaf component was lazy-loaded (Question 8) and its chunk hasn't been fetched yet, React encounters the unresolved component during render and shows the nearest `<Suspense>` fallback instead, while the chunk downloads in the background. Once the import resolves, React re-renders that part of the tree with the real component in place of the fallback.

### 🪆 Step 7: Only the Changed Part of the Tree Unmounts/Mounts
Because of the nested-route/`<Outlet>` mechanism (Question 6), if the parent layout was already mounted from a previous sibling route, it does not remount — only whatever renders inside `<Outlet>` unmounts and mounts.

### 🔄 Step 8: Effects and Data Fetching
Once the new leaf component mounts, its effects run (Component Lifecycle chapter) — commonly firing a data fetch for that specific page, often via a query hook keyed by the new route param (State Management chapter, Question 5).

### 🖌️ Step 9: Paint — No Native Navigation Ever Happened
The browser paints the final result. Across this entire sequence, from the initial click to this final paint, the browser never once performed a native navigation or full reload — the whole premise this chapter opened with in Question 1.

### 💎 Good to Know: Every Step Is a Question Already Answered in This Chapter
This trace isn't introducing new mechanisms — it's the order in which Questions 2 through 8 actually execute together on a single navigation.

### ❓ Follow-up Interview Questions

1. At which step does a protected route's redirect restart the matching process, and why does it need to restart rather than just continue?
2. Why does resolving `/dashboard/settings` happen hierarchically rather than as one flat match?
3. What determines whether a parent layout remounts or persists across a navigation to a sibling nested route?
4. Where in this sequence does a lazy-loaded route's `<Suspense>` fallback appear, and when does it get replaced?
5. At what point in this lifecycle would a page-specific data fetch typically be triggered, and why not earlier?

---