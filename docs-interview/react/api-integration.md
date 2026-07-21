---
title: API Integration
description: Fetch vs Axios, request cancellation, race conditions, and TanStack Query.
sidebar_position: 17
---

# API Integration

## 1. What are the common ways to make API requests in React, and what's the difference between the Fetch API and Axios?

### 📖 Introduction
This chapter covers everything involved in talking to a server from a React app — the two main tools for actually making the request, then request lifecycle concerns, and finally where TanStack Query fits into all of it.

### 🌐 The Fetch API: Built-in, But With a Sharp Edge
`fetch` is built into every modern browser — no install needed, Promise-based, low-level. Its sharpest edge, and a genuinely common beginner mistake: `fetch`'s promise does *not* reject on an HTTP error status like a 404 or 500 — it only rejects on an actual network failure (no connectivity, a CORS block, DNS failure). A 404 is still a "successful" fetch from the browser's point of view; the request completed, it just came back with an error status.
```js
fetch("/api/users")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`); // manual check required
    return res.json();
  })
  .catch(err => console.error(err));
```

### 📦 Axios: A Library That Smooths Over Fetch's Rough Edges
Axios is a third-party library that fixes several of `fetch`'s rough edges out of the box: it automatically rejects on non-2xx status codes, automatically parses/stringifies JSON (giving you `response.data` directly instead of a manual `.json()` call), and provides built-in request/response interceptors — exactly the mechanism used for the centralized error-handling pattern shown in the State Management chapter's Question 10.

### ⚖️ When Each Matters Less Than It Used To
Fetch is fine for a simple app with a handful of requests, where the small extra boilerplate (checking `response.ok`, calling `.json()`) isn't a real cost. Axios becomes more valuable as an app grows and needs consistent error handling and interceptors across many requests. That said, this choice matters less than it once did — once a proper data-fetching layer like TanStack Query (Question 5) sits on top, either one can serve as its underlying request mechanism, and the library absorbs most of the difference. Question 12 covers the full three-way trade-off.

### ❓ Follow-up Interview Questions

1. Why doesn't `fetch`'s promise reject on a 404 response, and what does it take to handle that correctly?
2. What specific conveniences does Axios provide that `fetch` doesn't have built in?
3. Why does the Fetch-vs-Axios choice matter less once a library like TanStack Query is introduced?
4. What kind of failure does `fetch`'s promise actually reject on, if not HTTP error statuses?
5. In what situation would plain `fetch` still be a perfectly reasonable choice today?

---

## 2. Where should API calls live in a component, and how do you manage loading and error states around them?

### 📖 Introduction
The Error Handling chapter's Question 5 already covered how to represent loading, error, and empty states. This question is about something different: where the fetch call itself should actually live in a component's architecture.

### 🙅 The Naive Default: Fetching Directly Inside the Component
Calling `fetch` directly inside a component's `useEffect` is fine for a one-off case, but it mixes data-fetching concerns with rendering concerns in the same place, making the component harder to test and reuse — and it duplicates the same fetch/loading/error boilerplate in every component that needs similar data.

### 🪝 Better: Extract Into a Custom Hook
Pulling the fetch and its state into a custom hook (Hooks chapter; Advanced React Patterns chapter, Question 4) separates "how do I get this data" from "how do I display it":
```jsx
function useUsers() {
  // fetch + loading/error state lives here
}

function UserList() {
  const { data, isLoading, error } = useUsers(); // stays focused on rendering
}
```

### ✨ Even Better: A Thin Wrapper Around TanStack Query
Once TanStack Query is in the picture (Question 5), the custom hook becomes a thin wrapper around `useQuery` rather than hand-rolled `useState`/`useEffect`:
```jsx
function useUsers() {
  return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
}
```
The placement principle stays the same — still a custom hook, still colocated above the component that needs it — only the internals change.

### 🗂️ Where the Hook Itself Should Live
Colocate the hook with the feature that uses it (State Management chapter, Question 10's feature-based organization) — `features/users/hooks/useUsers.js`, not one giant shared `hooks/` folder mixing unrelated features together. If multiple components across different features end up needing the same data, that's the signal to promote the hook to a more shared location, the same "earn its place" principle from the State Management chapter's Question 9, applied here to hook placement instead of state scope.

### 💎 Good to Know: State Representation Is a Separate Question
This question is about *where* the fetch lives, not how to represent its loading/error/empty states — that's covered in full in the Error Handling chapter's Question 5.

### ❓ Follow-up Interview Questions

1. What specifically gets harder to test when a fetch call lives directly inside a rendering component?
2. What stays the same about a data-fetching custom hook's placement once it's rewritten to use TanStack Query internally?
3. Why should a data-fetching hook be colocated with its feature rather than placed in a shared global folder by default?
4. What signal would tell you it's time to promote a feature-scoped hook to a shared location?
5. Why is "where does the fetch live" a different question from "how do you represent loading and error state"?

---

## 3. What is request cancellation, why does it matter (especially on unmount), and how do you implement it?

### 📖 Introduction
The Error Handling chapter's Question 5 showed a `cancelled` boolean flag as a guard against race conditions. This question goes a level deeper — the actual browser mechanism for cancellation, and why it's a more robust fix than that flag.

### 🗑️ Why It Matters
If a component unmounts before its fetch resolves, and the `.then()` callback still calls `setState` regardless, that's wasted work at best and a warning-worthy pattern at worst. More broadly, if a user navigates away or changes a query before a slow request finishes, letting that request run to completion anyway wastes bandwidth and server resources on a response nobody will ever use — a resource-efficiency concern, not just a correctness one. It's also a more robust fix for the out-of-order-response race condition (State Management chapter, Question 4) than the `cancelled` flag, since it actually stops the network request instead of just ignoring its result after it arrives.

### 🛑 How: `AbortController`
```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/users", { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name === "AbortError") return; // expected — not a real failure
      setError(err);
    });

  return () => controller.abort(); // cancels the in-flight request on cleanup
}, []);
```
`controller.signal` is passed into `fetch`, and calling `controller.abort()` — in the effect's cleanup function (Component Lifecycle chapter) — causes the in-flight request to reject with an `AbortError`, which needs to be specifically checked for and ignored, since it's an expected, intentional cancellation rather than a real failure.

### ⚖️ Upgrading From the "Cancelled Flag" Trick
The flag-based approach still lets the request run to completion in the background — it just ignores the result once it arrives. `AbortController` actually terminates the request at the transport level, a genuinely more efficient and more correct solution than the flag, not just a stylistic alternative to it.

### 💎 Good to Know: TanStack Query Does This Automatically
`queryFn` receives an automatically-wired-up `signal` argument from the library itself, cancelling stale or superseded requests without any manual `AbortController` code needed — one more piece of boilerplate TanStack Query (Questions 5 and 6) removes.

### ❓ Follow-up Interview Questions

1. Why is letting an unmounted component's fetch run to completion wasteful, even if nothing visibly breaks?
2. What's the mechanical difference between the `cancelled` flag approach and `AbortController`?
3. Why must `AbortError` be specifically checked for and ignored rather than treated like any other fetch error?
4. Where does `controller.abort()` need to be called, and why there specifically?
5. How does TanStack Query eliminate the need for manual `AbortController` wiring?

---

## 4. What are race conditions in API requests, how do they happen, and how do you prevent them?

### 📖 Introduction
This has come up a few times already in this guide — here's the full, dedicated treatment, with a concrete timeline showing exactly how it happens, and three distinct ways to prevent it.

### 🏁 A Concrete Timeline: How the Race Actually Happens
A user typing into a search box: at t=0ms, typing "r" fires Request A. At t=50ms, typing "re" fires Request B, while A is still in flight. At t=200ms, B resolves first (maybe a faster query) and the UI correctly shows results for "re". At t=350ms, A finally resolves — slower for whatever reason — and naive code overwrites the UI with results for "r", silently showing the user stale, wrong results for a query they're no longer even looking at. It's called a race because it's a race to arrive *last*, and the slower "loser" of that race can still incorrectly win by overwriting genuinely correct, newer state.

### 🛑 Prevention 1: Cancel the Stale Request
`AbortController` (Question 3) — cancel the previous request the moment a new one starts, so the old request's response never even arrives to cause a problem. This prevents the race at the source rather than reacting to it after the fact.

### 🚩 Prevention 2: Ignore the Stale Result
The `cancelled` boolean flag (Error Handling chapter, Question 5) — let both requests run, but ignore the result of the stale one using a closure-captured flag checked before applying the response.

### 🔢 Prevention 3: Request ID / Sequence Tracking
A more explicit variant of the flag idea, useful when tracking multiple distinct concurrent queries rather than just "is this the most recent":
```js
let latestRequestId = 0;
async function search(query) {
  const requestId = ++latestRequestId;
  const results = await fetchResults(query);
  if (requestId !== latestRequestId) return; // a newer request has since started; discard
  setResults(results);
}
```

### 💎 Good to Know: TanStack Query Solves This Automatically
Since query keys uniquely identify which response belongs to which query, TanStack Query tracks in-flight requests per key and discards stale ones automatically (State Management chapter, Questions 4 and 5) — none of the three techniques above need to be hand-written once it's in place.

### ❓ Follow-up Interview Questions

1. Walk through the timeline example and explain exactly why the slower request can still "win" incorrectly.
2. What's the difference between preventing a race with cancellation versus ignoring a stale result after it arrives?
3. When would request ID tracking be preferable to a simple `cancelled` boolean flag?
4. Why is this called a "race condition" specifically, rather than just a "stale data bug"?
5. How does TanStack Query's use of query keys structurally prevent this problem?

---

## 5. What is TanStack Query, what problems does it solve, and how does it differ from manually fetching with `useEffect`?

### 📖 Introduction
The State Management chapter's Questions 4 and 5 already covered TanStack Query's mechanics in full — query keys, `staleTime`/`gcTime`, automatic refetch triggers. Rather than re-deriving that, this ties it together as a direct checklist against everything Questions 1 through 4 of this chapter just covered individually.

### ✅ The Checklist: What `useEffect`-Based Fetching Requires You to Hand-Write
- **Loading/error state** (Question 2; Error Handling chapter, Question 5) — a hand-rolled `{data, loading, error}` reducer versus `useQuery`'s built-in `{data, isLoading, isError}`.
- **Cancellation** (Question 3) — manual `AbortController` wiring versus an automatically provided `signal`.
- **Race conditions** (Question 4) — manual request-ID tracking versus automatic per-query-key tracking.
- **Caching/deduplication** (State Management chapter, Question 5) — manual "did I already fetch this" checks versus automatic query-key-based caching.
- **Refetch triggers** (State Management chapter, Question 5) — manual event listeners for focus/reconnect/polling versus configuration flags.

### 📏 The Code-Volume Delta, Concretely
A hand-rolled fetch done properly — with cancellation, race-condition safety, and loading/error state, the direction Question 2's example was heading — typically runs 15–20+ lines every time a new piece of data needs fetching. The same correctness bar with `useQuery` is usually 3–5 lines. That delta compounds across a real app with dozens of distinct data-fetching needs — this is less about a feature list and more about the cumulative engineering time it saves.

### 💎 Good to Know: Full Mechanics Live in the State Management Chapter
For the actual internals — query key structure, `staleTime` vs `gcTime`, exactly how refetch triggers work — see the State Management chapter's Questions 4 and 5, which cover them in complete depth.

### ❓ Follow-up Interview Questions

1. Which specific problem from Questions 1–4 of this chapter does TanStack Query NOT need any manual code for?
2. Why does the code-volume delta matter more at the scale of a whole app than for one single fetch?
3. What would a hand-rolled fetch need to include to match `useQuery`'s correctness bar?
4. Why is it more useful to compare TanStack Query against `useEffect`-based fetching item-by-item than to just list its features?
5. Which of TanStack Query's benefits would matter least for a page that fetches data exactly once and never again?

---

## 6. How does TanStack Query handle caching, background refetching, and query invalidation?

### 📖 Introduction
Caching and background refetching were already covered in the State Management chapter's Question 5. Query invalidation is genuinely new territory — the mechanism for telling TanStack Query that a cached query is now known to be stale, typically after a mutation.

### 💾 Caching and Background Refetching (Brief Recap)
Query-key-based caching, `staleTime` vs. `gcTime`, and automatic refetch triggers (window focus, reconnect, polling) are all covered in full in the State Management chapter's Question 5.

### 🔄 Query Invalidation
After a mutation — say, creating a new user via a POST request — the existing cached "list of users" query is now out of date, but TanStack Query has no way of automatically knowing that an unrelated mutation should affect this specific cached query's freshness. Invalidation is how you tell it explicitly:
```js
const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] }); // this list is now stale
  },
});
```
This marks matching queries as stale, triggering an automatic refetch for any currently active ones.

### 🌳 Partial Matching: Query Keys as a Hierarchical Namespace
`invalidateQueries({ queryKey: ["users"] })` invalidates every query whose key *starts with* `["users"]` — including `["users", { page: 2 }]` or `["users", "detail", 42]`. Query keys act like a hierarchical namespace, and invalidation can target a whole branch of it at once, not just one exact key — a detail that's easy to miss until you need it.

### ⚡ Invalidation vs. Direct Cache Writes
Invalidation triggers a refetch — asking the server again, eventually consistent, but with some latency before the UI reflects the change. `queryClient.setQueryData(["users"], updater)` instead writes directly to the cache, updating what's shown immediately with no server round-trip — the mechanism behind optimistic updates, covered next in Question 7.

### ❓ Follow-up Interview Questions

1. Why can't TanStack Query automatically know that a mutation should invalidate an unrelated cached query?
2. What does `invalidateQueries({ queryKey: ["users"] })` actually invalidate, precisely?
3. What's the practical difference between invalidating a query and writing to it directly with `setQueryData`?
4. Why are query keys described as a hierarchical namespace rather than flat, unique strings?
5. If a mutation affects both a list query and a detail query, how would you invalidate both at once?

---

## 7. What is optimistic UI/updating, and how is it implemented (e.g., with TanStack Query)?

### 📖 Introduction
Optimistic updates apply the Performance Optimization chapter's "perceived performance" idea (Question 11 there) to user-initiated mutations rather than page load — making an action feel instant even while the network round-trip is still happening in the background.

### ⚡ What Optimistic Updating Is
Updating the UI immediately to reflect what a user's action is expected to result in, before the server has actually confirmed it succeeded — a "like" button filling in and the count incrementing the instant it's clicked, rather than waiting for the API response before showing any change at all.

### 🛠️ Implementing It With TanStack Query
```jsx
const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: likePost,
  onMutate: async (postId) => {
    await queryClient.cancelQueries({ queryKey: ["posts"] }); // avoid racing an in-flight refetch
    const previousPosts = queryClient.getQueryData(["posts"]); // snapshot for rollback

    queryClient.setQueryData(["posts"], (old) =>
      old.map(post => post.id === postId ? { ...post, likes: post.likes + 1, liked: true } : post)
    ); // Question 6's setQueryData — update the cache immediately

    return { previousPosts }; // passed to onError for rollback
  },
  onError: (err, postId, context) => {
    queryClient.setQueryData(["posts"], context.previousPosts); // roll back on failure
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] }); // resync with server truth either way
  },
});
```
`onMutate` fires before the request is even sent — snapshotting the current state, then writing the optimistic guess into the cache immediately. `onError` fires only if the mutation fails, rolling back to that snapshot. `onSettled` fires regardless of outcome, invalidating (Question 6) to reconcile with whatever the server actually decided.

### ⚠️ The Key Risk: Rollback Needs the Same Care as the Happy Path
If a mutation fails and the rollback isn't handled correctly, the user sees a confusing flicker — a like count going up, then reverting later with no clear explanation. Optimistic updates trade "always accurate" for "usually accurate, immediately," and that trade only pays off if the failure path is handled as deliberately as the success path.

### 🎯 When It's a Good Fit, and When It Isn't
Good fit: high-confidence, low-stakes actions — a like button, a toggle, adding an item to a cart — where failure is rare and a rare rollback is a minor inconvenience. Poor fit: actions with a meaningful chance of failure or high-stakes consequences, like a payment submission, where a confusing rollback would be worse than just showing a brief loading state.

### ❓ Follow-up Interview Questions

1. What role does `onMutate`'s snapshot play, and why is it captured before the optimistic update is applied?
2. Why does `onSettled` invalidate the query regardless of whether the mutation succeeded or failed?
3. What goes wrong for the user if the rollback path isn't implemented carefully?
4. Why is a payment submission a poor candidate for optimistic updating?
5. Why does `onMutate` call `cancelQueries` before writing the optimistic value into the cache?

---

## 8. How would you design a reusable, centralized API layer for a large application?

### 📖 Introduction
The Error Handling chapter's Question 10 covered centralizing API *error* handling specifically. This is the broader picture — how the whole API layer should be structured, beyond just error handling.

### 🗂️ Centralize Endpoint Definitions by Resource
Rather than scattering raw `fetch`/`axios` calls with hardcoded URL strings throughout the codebase — the same mistake as the Routing chapter's Question 11, but for API endpoints instead of routes — group endpoint functions by resource:
```js
// api/users.js
export const usersApi = {
  list: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
};
```
A typo in a URL, or a URL that needs to change, now has one place to fix instead of being scattered across dozens of call sites.

### 🏷️ Shared Response Types Between the API Layer and Components
Defining a shared type for each resource (`User`, `Post`) that both the API functions and the components consuming them agree on means a backend response-shape change surfaces as a build-time type error, rather than a runtime surprise a user discovers first.

### 🧱 Layering: Framework-Agnostic Functions, React-Specific Hooks on Top
The endpoint functions (`usersApi.list`) stay thin and entirely unaware of React — plain async functions, reusable outside React too, in a script or a test. The React-specific layer (`useUsers()`, Question 2) wraps them with `useQuery`/`useMutation`. This separation — "how do I call this endpoint" versus "how does a React component consume this data" — keeps the two concerns independently testable and reusable.

### 🌍 One Place for Base URL, Environment, and Versioning
A single configured client instance (`axios.create({ baseURL: import.meta.env.VITE_API_URL })`) means switching between dev, staging, and production environments — or between API versions (`/v1/` vs `/v2/`) — is a one-line config change, not a find-and-replace across the codebase.

### ❓ Follow-up Interview Questions

1. Why does centralizing endpoint definitions matter, similar to the route-builder pattern from the Routing chapter?
2. What does keeping endpoint functions framework-agnostic buy you, concretely?
3. How does a shared response type turn a backend change into a build-time error instead of a runtime surprise?
4. Why should the React-specific hook layer stay separate from the plain endpoint functions?
5. What would switching API versions require in a codebase without a centralized base URL configuration?

---

## 9. How would you handle authentication tokens in API requests, including automatic refresh of expired tokens?

### 📖 Introduction
The Routing chapter's Question 10 covered persisting auth state across a page refresh. This is a related but distinct concern: attaching a token to every outgoing request, and transparently refreshing it when it expires mid-session.

### 🔐 Attaching the Token Automatically
A request interceptor attaches the current token to every outgoing request, so individual call sites never need to remember to do it themselves:
```js
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 🔄 Handling Expiry: Refresh, Then Retry Transparently
When a request comes back with a 401, rather than immediately failing, a response interceptor can refresh the token first and retry the original request with the new one — the user never notices anything happened:
```js
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true; // avoid an infinite retry loop
      const newToken = await refreshAccessToken();
      setAccessToken(newToken);
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return api(error.config); // retry the original request with the new token
    }
    return Promise.reject(error);
  }
);
```

### 🚦 The Tricky Part: Deduplicating Concurrent Refresh Attempts
If several requests are in flight simultaneously and all hit a 401 around the same time (a page firing five parallel calls right as the token expires), naively refreshing separately for each one triggers five redundant refresh calls to the server. The fix is a single, shared in-flight promise that every concurrent 401 waits on:
```js
let refreshPromise = null;

async function getRefreshedToken() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null; });
  }
  return refreshPromise; // concurrent callers share the same in-flight promise
}
```
This is the same "deduplicate concurrent identical work" idea behind TanStack Query's own request deduplication (State Management chapter, Question 5), applied here manually to the token-refresh case specifically.

### 💎 Good to Know: Where the Token Lives Is a Separate Question
The trade-offs between storing the token in `localStorage`, `sessionStorage`, or an `httpOnly` cookie are covered in the Routing chapter's Question 10.

### ❓ Follow-up Interview Questions

1. Why does the response interceptor check `error.config._retry` before attempting a refresh?
2. Walk through what would go wrong if five concurrent 401s each triggered their own separate refresh call.
3. How does the shared `refreshPromise` pattern prevent that problem specifically?
4. Why should the request interceptor read the token dynamically rather than having it hardcoded when the client was created?
5. How does this "deduplicate concurrent work" pattern relate to what TanStack Query does automatically for regular queries?

---

## 10. How would you prevent duplicate or redundant API requests across a React application?

### 📖 Introduction
This is a distinct problem from Question 4's race conditions — a race is about response *order* corrupting state; a duplicate request is about the same request firing more times than necessary, wasting bandwidth and server load even when no race results from it.

### 🔁 The Classic Case: Multiple Components Wanting the Same Data
Already covered in depth — TanStack Query's query-key-based caching deduplicates this automatically (State Management chapter, Question 5; this chapter, Question 5).

### 🎭 A Common False Alarm: React Strict Mode
Seeing two identical requests fire in the Network tab during development often leads to the wrong conclusion — that there's a duplicate-request bug — when it's actually Strict Mode's intentional double-invocation of effects (Component Lifecycle chapter), which does not happen in production. Worth knowing explicitly so it isn't mistaken for a real problem.

### 🐛 A Real Bug: Missing or Incorrect Dependency Arrays
A `useEffect` with a missing or wrong dependency causes a fetch to re-run on every render rather than only when its actual inputs change — a genuine bug (Hooks and Component Lifecycle chapters), fixed either by correcting the dependency array or migrating to TanStack Query, which manages this comparison for you via query keys.

### 🖱️ Preventing Double-Submit on Mutations
A user double-clicking "Submit" — or clicking again because a slow network made the first click seem unresponsive — can fire the same mutation twice. The fix is disabling the trigger immediately while the request is pending:
```jsx
const { mutate, isPending } = useMutation({ mutationFn: submitOrder });

<button onClick={() => mutate(data)} disabled={isPending}>Submit</button>
```
This matters more for mutations than reads specifically because of the Error Handling chapter's Question 12 point — a duplicate "place order" mutation isn't just wasteful, it can create an actual duplicate order, since mutations often aren't safely idempotent.

### 💎 Good to Know: Debouncing Input-Driven Requests
Reducing request frequency from a search-as-you-type input is covered in full in the Performance Optimization chapter's Question 7.

### ❓ Follow-up Interview Questions

1. Why might seeing two identical requests in development not actually indicate a bug?
2. How does a missing dependency array cause a fetch to fire more often than intended?
3. Why is double-submit prevention more critical for mutations than for read requests?
4. What's the simplest fix for preventing a double-submitted form mutation?
5. What's the conceptual difference between a "duplicate request" problem and a "race condition" problem?

---

## 11. What are common mistakes in API integration, and how should API logic be organized at scale?

### 📖 Introduction
Several mistakes here have already been covered individually in this chapter — this pulls them together and adds two genuinely new ones, before pointing to Question 8 for how it should all be organized.

### 🩹 Recap: Mistakes Already Covered
Not checking `response.ok` with `fetch` (Question 1); fetching directly inside components instead of extracting a hook (Question 2); skipping cancellation on unmount (Question 3); ignoring race conditions in search or filter UIs (Question 4); treating every error the same way regardless of type (Error Handling chapter, Questions 5 and 7).

### 🌊 A Fresh One: Request Waterfalls Instead of Parallelization
Sequentially awaiting independent requests that don't actually depend on each other wastes time unnecessarily:
```js
// ❌ an unnecessary waterfall — these two don't depend on each other at all
const user = await fetchUser(id);
const settings = await fetchSettings(id);

// ✅ parallelized
const [user, settings] = await Promise.all([fetchUser(id), fetchSettings(id)]);
```
The fix is either a backend change (a combined endpoint) or, at minimum, parallelizing genuinely independent requests instead of sequencing them by habit.

### 📄 Another: Fetching Everything Instead of Paginating
Fetching an entire, potentially huge dataset in one request when the UI only ever shows a page at a time wastes bandwidth at the network level — related to, but distinct from, the Performance Optimization chapter's Question 6 virtualization concern, which is about DOM cost rather than network cost. TanStack Query's `useInfiniteQuery` is the standard solution for infinite-scroll or paginated data specifically, handling page boundaries and fetching the next page on demand.

### 🗂️ How It Should Be Organized at Scale
Covered in full in Question 8 — endpoint functions grouped by resource, shared response types, a framework-agnostic API layer with React-specific hooks layered on top, and centralized base URL/versioning configuration.

### ❓ Follow-up Interview Questions

1. Why is fetching `user` and `settings` sequentially wasteful if neither depends on the other?
2. What's the difference between the waste caused by over-fetching data and the waste caused by an unvirtualized list?
3. What does `useInfiniteQuery` solve that a regular `useQuery` call doesn't?
4. Of the mistakes recapped from earlier questions, which would you consider the most damaging, and why?
5. Why does parallelizing independent requests with `Promise.all` matter more as an application scales?

---

## 12. What are the trade-offs between Fetch, Axios, and TanStack Query for a real project?

### 📖 Introduction
Question 1 deferred this full comparison here — but it's worth reframing first: these aren't three options to pick one from. It's really a two-axis decision, since TanStack Query isn't a replacement for Fetch or Axios at all.

### 🧩 These Aren't Purely Alternatives
TanStack Query needs a `queryFn` that actually makes the request, and that function typically uses either `fetch` or Axios internally. TanStack Query is a layer on top of whichever transport is chosen, not a competing transport itself. The real decision has two independent axes: Fetch vs. Axios for the transport (Question 1), and raw `useEffect` vs. TanStack Query for the data-management layer (Question 5).

### ⚖️ Axis 1: Fetch vs. Axios
Covered in Question 1 — Axios smooths over `fetch`'s rough edges (automatic error rejection, JSON parsing, interceptors) at the cost of an extra dependency.

### ⚖️ Axis 2: Raw `useEffect` vs. TanStack Query
Covered in Question 5's checklist — but the honest counter-case deserves stating here: TanStack Query adds a real dependency and a learning curve for a team not already familiar with it. For a genuinely tiny app with one or two fetch calls total, ever, the overhead of adopting the library might not be worth it — the same "don't apply a technique the simple case doesn't need" principle from the Performance Optimization chapter's Questions 3 and 12, applied here to library adoption rather than memoization.

### 🎯 The Decisive Answer for a Real Project
For any project with more than a trivial amount of server-state need — which describes the vast majority of real projects — TanStack Query is worth adopting close to by default (echoing the State Management chapter's Question 14). And once it's in place, plain `fetch` is often sufficient as the underlying transport, since TanStack Query itself absorbs most of what Axios used to be needed for — error handling via the `queryFn`, and global interceptor-like behavior via TanStack Query's own cache-level handlers (State Management chapter, Question 10; Error Handling chapter, Question 10). The common modern stack for a real project ends up being "`fetch` + TanStack Query," rather than Axios alone or bare `fetch` alone.

### ❓ Follow-up Interview Questions

1. Why is it inaccurate to describe Fetch, Axios, and TanStack Query as three competing alternatives?
2. What does TanStack Query absorb that would otherwise be Axios's main selling point?
3. Under what circumstance would adopting TanStack Query genuinely not be worth it?
4. Why does "fetch + TanStack Query" end up being a common modern stack rather than "Axios alone"?
5. What are the two independent axes this decision actually breaks down into?

---

## 13. How would you decide whether to manage API/server state manually versus with a library like TanStack Query?

### 📖 Introduction
This pulls together concrete signals scattered across this chapter into one decision checklist, rather than a vague "it depends."

### 🔢 Signal 1: How Many Distinct Server-State Needs Does the App Have?
One or two simple fetches, ever, and manual handling might genuinely be fine (Question 12's honest counter-case). Dozens of different resources means repeating Questions 2 through 4's boilerplate — cancellation, race-condition safety, loading/error state — for every single one. Sheer volume is the single biggest practical signal.

### 🔗 Signal 2: Does Data Need to Be Shared Across Unrelated Components?
If multiple, unrelated components need the same data (Question 10's classic scenario), manual handling means building your own sharing/caching layer from scratch — something TanStack Query provides automatically via query keys.

### 🎛️ Signal 3: Do You Need Background Refetching, Retries, Invalidation, or Optimistic Updates?
Each of these (Questions 6, 7; Error Handling chapter, Question 7) is substantial, easy-to-get-wrong code to hand-roll correctly. Needing even one of them often justifies the library on its own.

### ⚖️ Signal 4: How Much Does Correctness Actually Matter Here?
A rarely-used internal admin tool might tolerate an occasional stale-data bug (Question 4); a customer-facing, constantly-used search feature probably shouldn't.

### 👥 Signal 5: Team Familiarity and Project Lifespan
If a team has never used TanStack Query and the project is small and short-lived, the learning-curve cost (Question 12) might genuinely outweigh the benefit for that specific project — worth being honest about rather than dogmatic.

### 💎 Good to Know: The Threshold Is Crossed Quickly
In practice, "worth adopting" is reached fast — even a moderate app with a handful of different resources benefits, since Question 5's code-volume savings compound quickly. The framework is better understood as "manual is the exception for genuinely trivial cases, TanStack Query is the default for anything beyond that," not a even toss-up.

### ❓ Follow-up Interview Questions

1. Which single signal most strongly indicates it's time to adopt a library rather than manage requests manually?
2. Why does needing even one of retries, invalidation, or optimistic updates often tip the decision on its own?
3. When would team unfamiliarity genuinely be a good reason to stay manual, and when would it not be?
4. Why is "manual is the exception, the library is the default" a more accurate framing than a 50/50 choice?
5. How does the number of distinct server-state needs in an app change this decision as it grows?

---

## 14. Explain the complete lifecycle of an API request in a React component, from trigger to UI update, including error and cancellation paths.

### 📖 Introduction
This closing trace ties together nearly everything in this chapter — the centralized API layer (Question 8), token attachment and refresh (Question 9), cancellation (Question 3), race conditions (Question 4), and optimistic updates (Question 7) — into one sequence, with explicit branches for the error and cancellation paths.

### 🚀 Steps 1–2: Trigger and Request Construction
Something initiates the request — a component mounts and a `useQuery` call runs (Question 5), or a user action fires a mutation (Question 7). The call goes through the centralized API layer (Question 8); a request interceptor attaches the current auth token automatically before it's sent (Question 9).

### 🔍 Step 3: Cache Check and Deduplication
If using TanStack Query, the library checks whether an identical query (same query key) is already in flight or cached and still fresh (State Management chapter, Question 5). If fresh cached data exists, the network call may be skipped entirely, returning cached data immediately. Otherwise, the request proceeds.

### 📡 Steps 4–5: Request Sent, UI Shows Loading (or Optimistic State)
The underlying transport (Question 1) sends the request with an `AbortController` signal attached (Question 3). While in flight, the UI shows a loading state (Question 2; Error Handling chapter, Question 5) — or, for a mutation using optimistic updating (Question 7), the UI already shows the expected result immediately, before any response arrives.

### 🛑 Branch A: Cancellation
If the component unmounts, or a newer request supersedes this one (Question 4's race scenario), `controller.abort()` fires. The in-flight request is terminated and its promise rejects with an `AbortError`, which is specifically checked for and ignored (Question 3) — nothing further happens for this particular request.

### 💥 Branch B: Error, Token Refresh, and Rollback
The request completes with an error — a network failure, or an HTTP error status normalized by the response interceptor (Question 1; Error Handling chapter, Question 10). If it's specifically a 401, the interceptor attempts a token refresh (deduplicated via the shared promise, Question 9) and retries the original request transparently. If that retry also fails, or the error isn't a 401, it propagates further. For an optimistic mutation, `onError` (Question 7) rolls back the cache to its pre-optimistic snapshot. The UI updates to an error state, potentially with retry logic if the error type warrants it (Error Handling chapter, Question 7).

### ✅ Branch C: Success, Cache Write, and Invalidation
The request resolves successfully. For a query, the response is written into the cache under its query key. For a mutation, `onSettled` (Questions 6 and 7) may invalidate related queries, marking them stale and triggering a background refetch for any currently active ones.

### 🔄 Steps 9–10: State Update, Commit, and Paint
Whichever branch occurred, the relevant state updates — inside TanStack Query's own subscription model (State Management chapter, Question 8) or a hand-rolled `useState`/`useReducer` — triggering a re-render of subscribed components. React reconciles the new output (Rendering & Reconciliation chapter) and commits the DOM changes; the browser paints, and the user sees the final result — real data, an error message, or the optimistic result now confirmed or rolled back.

### ❓ Follow-up Interview Questions

1. At which step does TanStack Query decide whether to skip the network call entirely?
2. Walk through what happens if a component unmounts while its request is still in flight.
3. Why does the error branch check specifically for a 401 before deciding how to handle the failure?
4. What's different about how the UI behaves during the "in flight" period for a regular query versus an optimistic mutation?
5. Why does a successful mutation's `onSettled` still invalidate queries, even though the optimistic update already updated the UI?

---