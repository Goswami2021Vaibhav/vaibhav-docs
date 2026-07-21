---
title: Error Handling
description: Error boundaries, catching render errors, and handling async failures in components.
sidebar_position: 15
---

# Error Handling

## 1. What are Error Boundaries, why were they introduced, and what kinds of errors can and can't they catch?

### 📖 Introduction
This chapter covers how React apps handle failure gracefully — from a single component throwing, to a failed API call, to a full production error-monitoring strategy. Error Boundaries are the foundational piece: a mechanism for containing a JavaScript error to the part of the UI it actually broke, instead of taking down the whole page.

### 🛡️ What Error Boundaries Actually Are
An Error Boundary is a component that catches JavaScript errors thrown anywhere in its child tree — during rendering, in lifecycle methods, and in constructors — and, instead of letting the error propagate and corrupt the whole app, renders a fallback UI in place of the broken subtree.

### 🕰️ Why They Were Introduced
Before React 16, an uncaught error thrown anywhere during rendering could corrupt React's internal tree entirely, often requiring a full page reload to recover. Error Boundaries formalized a different philosophy: a broken UI is worse than a missing one. If one subtree has a genuine bug, it's safer to unmount just that broken part and show a fallback than to leave a partially-corrupted tree rendered, which could display inconsistent or incorrect data to the user. They arrived in React 16 alongside Fiber, whose architecture made this kind of contained recovery cleaner to implement.

### ✅ What They CAN Catch
Errors thrown during rendering, in class component lifecycle methods (`componentDidMount`, `componentDidUpdate`, and others), and in constructors of any component below the boundary in the tree — essentially, synchronous errors that occur as part of React's own render-and-commit process.

### ❌ What They CANNOT Catch
- Errors inside event handlers (a click handler that throws) — not part of the render phase, covered in full in Question 2.
- Errors inside asynchronous code — `setTimeout` callbacks, promises, `async`/`await` — since by the time these run, React is no longer actively rendering; also covered in Question 2.
- Errors during server-side rendering.
- Errors thrown inside the Error Boundary's own code — a boundary can't catch its own errors; those propagate up to whichever boundary is *above* it.

### 💎 Good to Know: The Same "Throw, Nearest Ancestor Catches" Shape as Suspense
This is the same structural pattern as `Suspense` catching a thrown promise from `React.lazy` (Performance Optimization chapter, Question 5) — one catches thrown errors, the other catches thrown promises, but both work by having the nearest special ancestor in the tree catch something thrown from below and render something else in its place.

### ❓ Follow-up Interview Questions

1. What specifically changed in React's behavior around uncaught render errors before and after React 16?
2. Why can't an Error Boundary catch an error thrown inside its own render method?
3. Why does "a broken UI is worse than a missing one" justify unmounting a subtree rather than trying to keep it rendered?
4. What do Error Boundaries and Suspense have in common structurally?
5. Why do lifecycle-method errors get caught, but event handler errors don't?

---

## 2. Why can't Error Boundaries catch errors in event handlers or asynchronous code, and how do you handle those instead?

### 📖 Introduction
Question 1 stated this as a fact; here's the actual mechanical reason, plus the practical alternatives for the cases Error Boundaries structurally can't cover.

### 🖱️ Why Event Handler Errors Aren't Caught
Error Boundaries work by wrapping React's own render-and-commit call stack — they catch errors as they propagate up through the component tree *during that specific synchronous phase*. An event handler like `onClick` runs on a completely different call stack, invoked later by the browser's event system in response to a DOM event. When that handler executes, there's no active React render call stack for the error to propagate through — it's just an ordinary uncaught JavaScript exception, exactly as it would be outside of React entirely.

### ⏳ Why Asynchronous Errors Aren't Caught
The same reasoning applies to a `.then()` callback, code after an `await`, or a `setTimeout` callback: it runs on a later turn of the event loop, disconnected from whatever render call stack originally triggered the request. By the time that async code runs and potentially throws, the render phase that kicked it off has already finished and returned — there's nothing left for an Error Boundary to catch onto.

### 🧠 The Underlying Principle
Error Boundaries rely on ordinary JavaScript `try`/`catch` semantics operating on a single synchronous call stack. Anything that executes on a *different* call stack — a later event handler invocation, a microtask, a macrotask — is invisible to that `try`/`catch`, the same way a normal `try`/`catch` block can't catch an error thrown from a callback that runs after it has already exited.

### 🩹 Handling Event Handler Errors: Manual `try`/`catch`
Since Error Boundaries can't help here, ordinary JavaScript error handling is the only tool:
```jsx
function handleClick() {
  try {
    riskyOperation();
  } catch (error) {
    logErrorToService(error); // Question 8
    setError("Something went wrong. Please try again.");
  }
}
```

### 🔄 Handling Async Errors
For promises, a `.catch()` or a `try`/`catch` around an `await` is the standard approach, typically followed by updating some state to reflect an error (Question 5's loading/error/empty pattern — or automatically, via TanStack Query's built-in `isError`/`error`, State Management chapter Question 5).

### 💎 Good to Know: Routing an Async Error Back Into the Render Phase
A genuinely clever, more advanced technique exists for cases where an Error Boundary's fallback UI is actually wanted for an async failure: re-throw the caught error inside a state updater function passed to `setState`.
```jsx
const [, setState] = useState();
async function loadData() {
  try {
    await fetchData();
  } catch (error) {
    setState(() => {
      throw error; // re-thrown during the next render, where an Error Boundary CAN catch it
    });
  }
}
```
This works because React calls that updater function as part of processing the state update during the next render — which *is* inside the synchronous render call stack an Error Boundary watches, effectively routing an async error back into the one context where it becomes catchable.

### ❓ Follow-up Interview Questions

1. Why does an error thrown inside a `setTimeout` callback not propagate through React's render call stack?
2. What's the fundamental difference between where a lifecycle-method error occurs versus where an event handler error occurs?
3. Why does the `setState(() => { throw error })` trick actually make the error catchable by an Error Boundary?
4. If a promise rejection is caught with `.catch()` but never re-thrown anywhere, would any Error Boundary ever see it?
5. Why can't a single `try`/`catch` wrapped around an entire component catch errors from its own async event handlers automatically?

---

## 3. What is a fallback UI, and why does it matter for user experience?

### 📖 Introduction
A fallback UI is what an Error Boundary renders in place of a crashed subtree — but where it's placed and how it's designed matters just as much as the fact that it exists at all.

### 🖼️ What a Fallback UI Actually Is
Whatever is passed to an Error Boundary to render instead of its children once an error has been caught — commonly a `fallback` prop on a reusable `<ErrorBoundary>` component, or returned from a class component's render method once its error state is set.

### 💔 The Alternative: Why This Matters for UX
Without one, the alternative is a blank white screen, or worse, a partially-rendered UI showing incomplete or inconsistent data (Question 1). A good fallback communicates clearly that something went wrong, rather than leaving the user staring at something that looks frozen or broken with no explanation — and ideally offers a path forward (a retry button, a link back home) rather than a dead end.

### 🎯 Granularity: Where You Place Boundaries Determines the Blast Radius
This is the part with real design consequences: where Error Boundaries are placed determines how much of the experience a single failure takes down.
```jsx
<Layout>
  <Header />
  <ErrorBoundary fallback={<WidgetError />}>
    <RecommendationsWidget /> {/* a crash here only affects this widget */}
  </ErrorBoundary>
  <MainContent />
  <Footer />
</Layout>
```
A single boundary wrapping the entire `<Layout>` instead means a crash in an unrelated, minor widget like `RecommendationsWidget` takes down the header, main content, and footer along with it — even though none of them were actually broken. Scoping boundaries around individual features contains each failure to just the part that actually failed.

### 🎨 What Makes a Good Fallback UI
- Match the app's actual styling — a fallback that looks like a raw, unstyled browser error page feels more alarming and more "broken" than one designed to look intentional.
- Be honest without being alarming — avoid showing raw stack traces or technical error messages to end users; that detail belongs in error logs and monitoring (Question 8), not the UI.
- Scale the messaging to the scope of the failure — a small widget failing should feel minor and low-stakes ("Couldn't load recommendations"), while a full-page crash may warrant a more prominent recovery flow.

### 💎 Good to Know: A Fallback Is Also a Design Decision, Not Just a Technical One
The same underlying mechanism (Error Boundaries) can produce either a jarring, "the app broke" experience or a graceful, barely-noticed one — the difference comes entirely from how deliberately fallback boundaries and their UI were designed, not from the mechanism itself.

### ❓ Follow-up Interview Questions

1. What's the practical difference in user experience between one app-wide Error Boundary and several feature-scoped ones?
2. Why shouldn't a fallback UI show a raw stack trace to the end user?
3. How should a fallback's messaging differ between a minor widget failure and a full-page crash?
4. What happens to `Header` and `Footer` in the example above if `RecommendationsWidget` crashes, given the boundary placement shown?
5. Why does matching the fallback's styling to the rest of the app matter for how "broken" the failure feels?

---

## 4. Can Functional Components be Error Boundaries, and if not directly, how do you implement one today?

### 📖 Introduction
This is a genuine, honest gap worth knowing precisely, since it's an easy assumption to get wrong: no, as of today's React, function components cannot be Error Boundaries directly — there is no hook equivalent to the class lifecycle methods this requires.

### 🚫 No, Not Directly — There's No Hooks Equivalent
Unlike nearly everything else that moved from class lifecycle methods to hooks (Component Lifecycle chapter), Error Boundaries have no hook counterpart. This still has to be written as a class component.

### 🤔 Why No Hooks Equivalent Exists
Error Boundaries need to intercept an error thrown *during* a child's render — effectively wrapping a render call that hasn't successfully completed and catching what throws out of it. That's a fundamentally different shape of problem than typical hook-based state management, which assumes a component's own render completes normally. Exposing this to hooks would require React to expose its own internal try/catch around child rendering in a way the Hooks API currently doesn't provide.

### 🏗️ Implementing One Today: The Two Required Lifecycle Methods
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true }; // render phase — pure, no side effects
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo); // commit phase — side effects belong here
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```
`getDerivedStateFromError` runs during the render phase when a descendant throws, returning the state update used to drive the fallback on the next render — it's static, with no access to `this`, purely a function from the error to new state. `componentDidCatch` runs afterward, during the commit phase, where side effects like logging to a monitoring service (Question 8) belong; its `errorInfo` argument includes a `componentStack` showing exactly where in the tree the error occurred.

### 📦 The Practical Pattern: Write It Once, Use It Everywhere
This doesn't mean an otherwise all-function-component codebase needs more class components scattered around — write this one `ErrorBoundary` class once, and use it declaratively as a wrapper anywhere it's needed, the same way any other reusable component gets used.

### 💎 Good to Know: `react-error-boundary`
Most teams don't hand-write this at all — `react-error-boundary` is the standard library wrapping exactly this class implementation behind a friendlier API: `<ErrorBoundary FallbackComponent={...} onError={...} onReset={...}>`, plus a `resetKeys` prop that automatically resets the boundary when specified values change (for example, resetting when the route changes).

### ❓ Follow-up Interview Questions

1. Why is there no hooks-based equivalent for Error Boundaries, unlike most other class lifecycle behavior?
2. What's the difference in responsibility between `getDerivedStateFromError` and `componentDidCatch`?
3. Why must `getDerivedStateFromError` be a pure, static function with no side effects?
4. If a team wants to avoid writing a class component at all, what's the practical alternative?
5. What does `resetKeys` solve that a plain Error Boundary class doesn't handle on its own?

---

## 5. How do you handle errors from API calls — loading, error, and empty states — and how do libraries like TanStack Query simplify this?

### 📖 Introduction
Every API-driven piece of UI needs to account for three distinct states, and a common mistake is handling only two of them — usually forgetting that "empty" is not the same thing as "error."

### 🚦 The Three States
**Loading** — the request is in flight, nothing to show yet. **Error** — the request failed (network failure, a 4xx/5xx status). **Empty** — the request *succeeded*, but returned no data — a search with zero results is a valid, successful response, not an error, and deserves its own distinct messaging rather than either a blank screen or an error state.

### 🛠️ Hand-Rolled: The `{data, loading, error}` Pattern
```jsx
function Results() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchResults()
      .then(result => { if (!cancelled) { setData(result); setError(null); } })
      .catch(err => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data || data.length === 0) return <EmptyState />;
  return <ResultsList data={data} />;
}
```
The `cancelled` flag here is a manual guard against exactly the out-of-order response race condition described in the State Management chapter's Question 4 — a concrete look at what has to be hand-written to avoid it.

### ✨ How TanStack Query Simplifies This
```jsx
function Results() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["results"],
    queryFn: fetchResults,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage error={error} />;
  if (data.length === 0) return <EmptyState />;
  return <ResultsList data={data} />;
}
```
`useQuery` returns `isLoading`/`isError`/`error` directly, and the race-condition guard from above is handled internally (State Management chapter, Question 5) — no manual `cancelled` flag needed.

### 🤔 What TanStack Query Does NOT Do for You
Worth being precise about: TanStack Query solves loading and error state robustly and automatically, but "empty" is still an application-level judgment call — it has no way of knowing your specific data shape means "nothing here," so checking `data.length === 0` (or whatever the equivalent is for your response shape) remains your responsibility.

### 💎 Good to Know: Not All Errors Deserve the Same Treatment
A generic "something went wrong" message for every error type misses real distinctions — a network failure, a 404 (resource genuinely doesn't exist), a 401/403 (an auth problem, which might warrant a redirect to login via the Routing chapter's Question 7 rather than an inline error at all), and a 500 (server-side failure) often call for different messaging or different actions entirely, not one uniform fallback.

### ❓ Follow-up Interview Questions

1. Why is "empty" a distinct state from "error," and what goes wrong if they're conflated?
2. What does the `cancelled` flag in the hand-rolled example actually protect against?
3. What specifically does TanStack Query handle automatically that the hand-rolled version has to do manually?
4. Why doesn't TanStack Query know whether a response should be treated as "empty"?
5. Why might a 401 response warrant different handling than a 500 response, in terms of what the UI does?

---

## 6. How do you prevent a single component's error from crashing the entire application?

### 📖 Introduction
Question 1 introduced Error Boundaries, and Question 3 covered how boundary placement affects blast radius. This synthesizes both into an actual prevention strategy — plus what to do about the gaps boundaries structurally can't cover (Question 2).

### 🛡️ Defense in Depth: Layered Boundaries, Not Just One
The real-world pattern isn't one boundary somewhere — it's several, nested at different levels:
```jsx
<TopLevelErrorBoundary fallback={<FullPageError />}>
  <Layout>
    <ErrorBoundary fallback={<WidgetError />}>
      <RecommendationsWidget />
    </ErrorBoundary>
    <ErrorBoundary fallback={<WidgetError />}>
      <ActivityFeed />
    </ErrorBoundary>
    <MainContent />
  </Layout>
</TopLevelErrorBoundary>
```
A top-level boundary acts as a last-resort safety net for anything unexpected — including an error occurring somewhere not covered by a more granular boundary — while the inner, feature-scoped boundaries (Question 3) contain the common case to just the part that actually broke.

### 🎯 Where to Place Them: Independent, Self-Contained Units
A useful rule of thumb: if a piece of UI failing shouldn't take down its neighbors, it needs its own boundary. Route-level components are a particularly natural placement — wrapping each route's element means navigating to a broken page doesn't take down the shared app shell or navigation around it.

### 🩹 Boundaries Aren't the Whole Story
Since Error Boundaries structurally can't catch event handler or async errors (Question 2), "preventing a crash" is really a combination of three things: catching what boundaries can catch, manually handling what they can't (Question 2's `try`/`catch` and error-state patterns), and reducing the chance of a render-time error happening at all through defensive coding — optional chaining, sensible default values, validating data shape before rendering it.

### 🔁 Let Users Recover
A caught error shouldn't permanently disable that part of the UI for the rest of the session. Pairing a boundary with a reset mechanism — `react-error-boundary`'s `resetKeys` (Question 4), or a manual "try again" button that clears the boundary's error state — lets the user recover without a full page reload, especially useful when the underlying cause (a flaky network request) may have already resolved itself.

### 💎 Good to Know: This Is a Strategy, Not a Single Fix
No single technique here "prevents crashes" on its own — it's the combination of layered boundaries, manual handling for what boundaries can't reach, defensive code reducing error likelihood, and a recovery path once an error does occur.

### ❓ Follow-up Interview Questions

1. Why is a single top-level Error Boundary alone not sufficient, even though it technically catches everything?
2. What's the benefit of wrapping route-level components in their own Error Boundary specifically?
3. Why does "preventing a crash" require more than just Error Boundaries?
4. What problem does pairing a boundary with a reset mechanism solve that the boundary alone doesn't?
5. Give an example of defensive coding that reduces the chance of a render-time error occurring in the first place.

---

## 7. How do you retry failed requests and handle network failures gracefully?

### 📖 Introduction
Retrying isn't just "call it again" — done carelessly, it can make a struggling server worse, or waste effort retrying something that will fail identically every time. Here's the reasoning behind doing it properly.

### 🔁 A Manual Retry Implementation: Exponential Backoff
```js
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 2); // delay doubles each retry
  }
}
```
Doubling the delay between attempts — exponential backoff — avoids hammering an already-struggling server with rapid repeated requests, which could make a temporary problem worse rather than better.

### 🎲 Why Jitter Matters Too
Backoff alone has a subtler problem: if many clients all failed at the same moment (a shared brief outage), they'd all retry at the same synchronized delays, creating a "thundering herd" of simultaneous requests hitting the server the instant it recovers. Adding a small random variation (jitter) to each delay spreads those retries out instead of leaving them synchronized.

### 🚦 Not All Errors Should Be Retried
Retrying makes sense for transient failures — a network blip, a `503` (server temporarily overloaded), a timeout. It's pointless or actively wasteful for others: a `400` (the request itself is malformed — retrying the identical request fails identically every time), a `401`/`403` (an auth problem that retrying won't fix), or a `404` (the resource genuinely doesn't exist). Deciding what to retry should be based on the error type, not applied blindly to every failure.

### ✨ TanStack Query's Built-in Retry Configuration
`useQuery` retries automatically (three attempts with exponential backoff by default), and both the retry count/logic and the backoff delay are configurable — encoding the retryable-vs-not judgment from above as configuration instead of hand-written logic:
```js
useQuery({
  queryKey: ["data"],
  queryFn: fetchData,
  retry: (failureCount, error) => {
    if (error.status === 404) return false; // pointless to retry
    return failureCount < 3;
  },
});
```

### 📡 Detecting Connectivity Loss Proactively
Beyond reacting to a failed request, the browser's `online`/`offline` events (and `navigator.onLine`) let an app detect a lost connection proactively and show a persistent "you're offline" indicator, rather than waiting for the next request to fail. TanStack Query's `refetchOnReconnect` (State Management chapter, Question 5) then automatically refetches once connectivity returns, closing the loop without any user action.

### ❓ Follow-up Interview Questions

1. Why does exponential backoff matter more than just "retry a few times" with a fixed delay?
2. What problem does jitter solve that plain exponential backoff doesn't?
3. Why would retrying a `400` response be pointless, while retrying a `503` might succeed?
4. How would you configure `useQuery`'s `retry` option to avoid retrying on client errors but still retry on server errors?
5. What's the benefit of detecting an offline state proactively via browser events, rather than only reacting to a failed request?

---

## 8. How would you log and monitor errors in production (e.g., integrating with Sentry or a similar tool)?

### 📖 Introduction
Logging has come up as an aside throughout this chapter — Error Boundaries' `componentDidCatch` (Question 4), manual `catch` blocks (Question 2), the general idea of "log to a service" (Question 5). Here's the full picture of what production error monitoring actually involves.

### 👁️ Why Production Monitoring Matters
In development, an error shows up right in front of you, in the console or an overlay. In production, the same error happens on a real user's device — and without monitoring, the team has zero visibility into it. The user just experiences a fallback UI (or worse) and quietly moves on, unless they happen to report it themselves. Production monitoring is the only way to actually know your error-handling code is being exercised in the wild at all.

### 🪝 Where to Hook In Logging
Pulling together every catch point covered so far in this chapter:
- Error Boundaries' `componentDidCatch` (Question 4) — render-phase errors.
- Manual `try`/`catch` in event handlers (Question 2).
- Manual `catch` blocks around async code, or a global error handler on the query client (Question 5; State Management chapter).
- A last-resort global catch-all: `window.addEventListener('error', ...)` and `window.addEventListener('unhandledrejection', ...)` — catching anything that slipped past every other mechanism, including truly uncaught synchronous errors and unhandled promise rejections anywhere in the app.

### 🛠️ What a Tool Like Sentry Actually Provides
Beyond just "send the error to a server," a dedicated monitoring tool provides several things genuinely hard to build yourself:
- **Source map support** — production JS is minified, so a raw stack trace is largely meaningless; uploaded source maps let the tool translate it back into the original file, line, and variable names.
- **Breadcrumbs** — a trail of recent user actions (clicks, navigation, console logs, network requests) leading up to the error, giving context for what the user was actually doing, not just the error in isolation.
- **Grouping and deduplication** — automatically clustering many occurrences of the same underlying error together, so the team sees "this one bug affected 500 users" instead of 500 undifferentiated entries.
- **Release tracking** — tagging errors with the specific deployed version they occurred in, making it possible to correlate a new error with a specific deploy.
- **Alerting** — notifying the team automatically when a new error type appears or an existing one's rate spikes, rather than requiring someone to check a dashboard manually.

### 🔒 Good to Know: Watch What You Log
Error context and breadcrumbs can easily end up capturing sensitive data — passwords, tokens, personal information — if not actively filtered. Most tools support scrubbing rules, but they have to be deliberately configured; nothing prevents sensitive data from being logged by default.

### ❓ Follow-up Interview Questions

1. Why is a global `window.addEventListener('error', ...)` handler still useful even with Error Boundaries and manual `try`/`catch` in place?
2. What problem do source maps solve for production error reports specifically?
3. Why does grouping matter when a single bug can generate thousands of individual error events?
4. How does release tracking help correlate a new error with a specific deploy?
5. What precaution is needed to avoid logging sensitive user data as part of error monitoring?

---

## 9. What is the difference between recoverable and unrecoverable errors, and how should each be handled differently?

### 📖 Introduction
Not every error deserves the same response. Whether an error can be handled inline, with a retry, or needs to tear down and reset a whole subtree comes down to one real question, not just a severity label.

### ✅ Recoverable Errors: The App Keeps Going
A failed API request that can be retried (Question 7), one widget failing to load while the rest of the page works fine (Questions 3 and 6), a form validation error the user just needs to correct — these are routine, expected parts of a working app's operation, not exceptional events. They're handled inline: an error message, a retry button, graceful degradation scoped to just the affected piece. They often don't even need to be logged as errors for monitoring purposes (Question 8), though tracking their frequency can still be operationally useful.

### 🚫 Unrecoverable Errors: The Safest Response Is to Stop, Not Guess
Some errors indicate the app, or a significant part of it, is in a genuinely broken or inconsistent state — a fundamental bug (a `TypeError` suggesting a real code assumption was violated, not a transient network issue), or corrupted critical state. Here, the safest response, per Question 1's core philosophy, is to unmount the broken subtree via an Error Boundary's fallback rather than attempt to keep going — continuing with corrupted state risks showing the user confidently wrong information, which is worse than an honest "something broke" message. These must be logged and monitored (Question 8), since they represent genuine bugs needing developer attention, and often warrant a full reload or reset rather than a soft retry, since the underlying state itself may not be trustworthy anymore.

### ❓ The Distinguishing Question
The practical test: "do I confidently know what state the app is in after this error, well enough to keep running safely?" If yes — "this one API call failed, but everything else's state is known and fine" — it's recoverable, handle it locally. If no — "this threw during render because some assumption was violated, and I don't know what else might also be affected as a result" — treat it as unrecoverable and let a boundary contain it rather than guessing.

### 📊 It's a Spectrum, and Boundary Granularity Reflects It
Few errors are purely one or the other — a small, well-isolated widget failure is easy to treat as recoverable precisely because its own boundary naturally limits its blast radius (Question 3), while a failure in something deeply shared, like the auth context itself, is much closer to unrecoverable, since too much of the app depends on it being valid to safely continue.

### ❓ Follow-up Interview Questions

1. What's the practical test for deciding whether an error is recoverable or not?
2. Why is continuing to run with corrupted state considered worse than showing an honest failure message?
3. Why don't recoverable errors always need to be logged to a monitoring service?
4. Why is a failure in shared, deeply-depended-upon state closer to "unrecoverable" than a failure in an isolated widget?
5. How does the choice of Error Boundary granularity reflect a judgment about recoverability?

---

## 10. How would you design centralized, reusable error handling for API calls across an application?

### 📖 Introduction
Without centralization, every component making an API call ends up re-implementing its own version of "check the response, parse the error, decide what to show" — duplicated, inconsistent logic that becomes painful to change once a new cross-cutting rule needs to apply everywhere at once.

### 😩 The Problem Without Centralization
If handling a `401` by redirecting to login is written separately inside every component that calls the API, changing that behavior later means hunting down and updating every one of those copies — and it's easy to miss one.

### 🌐 Centralize at the HTTP Client Level: Interceptors
A single, shared HTTP client configured once, with interceptors, is the natural place for this:
```js
const api = axios.create({ baseURL: "/api" });

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = "/login"; // handled once, for every request
    }
    return Promise.reject(normalizeApiError(error));
  }
);
```
Every request made through `api` gets this behavior automatically — no individual call site needs to remember to check for a 401 itself.

### 🔄 Normalize Error Shapes Before They Reach Components
Different backend endpoints often return inconsistent error formats — `{message: "..."}`, `{errors: [...]}`, plain text. A `normalizeApiError` function converts all of these into one consistent shape (say, `{message, code, status}`) before the error ever reaches component code, so the rest of the app only ever needs to know about one shape, not every backend quirk.

### ✨ Centralize at the TanStack Query Level Too
A global error handler on the query client catches every query and mutation's failures in one place:
```js
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      logErrorToService(error); // Question 8 — automatic for every query in the app
    },
  }),
});
```
This doesn't prevent an individual `useQuery` call from adding its own more specific handling on top — the global handler covers the cross-cutting concern (logging, in this case), while local handling covers what's specific to that one query.

### 🪝 A Reusable Hook for Turning Errors Into Messages
A custom hook like `useApiErrorMessage(error)` (Hooks chapter pattern) can encapsulate "map this normalized error into a human-readable message" in one reusable place, rather than every component writing its own version of that same mapping logic.

### ❓ Follow-up Interview Questions

1. Why does handling a 401 redirect at the HTTP client level scale better than handling it in every component?
2. What problem does normalizing error shapes solve when different endpoints return different error formats?
3. How does a global `QueryCache` error handler coexist with a query's own local `onError` handling?
4. What would go wrong if auth-redirect logic were duplicated across dozens of components instead of centralized?
5. Why is a reusable `useApiErrorMessage` hook better than each component writing its own error-to-message mapping?

---

## 11. What are the trade-offs between local (component-level) and global error handling strategies?

### 📖 Introduction
Question 10 was specifically about centralizing API-call error handling. This is the broader version: local, per-component Error Boundaries versus a single, app-wide strategy — and the trade-off shape turns out to mirror something already seen in this guide.

### 🎯 Local: Advantages
Granular blast-radius containment (Questions 3 and 6) — a failure in one widget doesn't take down unrelated parts of the page. Fallback messaging can be tailored to that specific component's context, rather than a generic one-size-fits-all message. The handling logic also lives right next to the code it protects, making it easy to find and reason about during development.

### ⚠️ Local: Disadvantages
This requires real discipline across a team — if some components get wrapped in boundaries and others are simply forgotten, coverage becomes inconsistent, and the gaps only surface once something eventually crashes uncaught. It also makes getting one unified view of all errors across the app harder, if every component logs independently in its own ad-hoc way. `react-error-boundary` (Question 4) mitigates the boilerplate cost specifically, but not the consistency-of-coverage problem.

### 🌐 Global: Advantages
A single top-level boundary or `window.onerror` handler can't be "forgotten" the way a per-component one can — it's declared once, at the root, guaranteeing consistent coverage. It also naturally centralizes logging and monitoring (Questions 8 and 10) into one place, making aggregation and alerting straightforward.

### ⚠️ Global: Disadvantages
Used alone, it has poor blast-radius containment — one component's failure can take down the entire app if there's only a top-level boundary and no granular ones underneath it (Questions 3 and 6's whole argument). Its fallback messaging is also inherently generic — a global handler has no context about what specifically failed, so "something went wrong" is close to the best it can offer.

### 💎 Good to Know: The Same Trade-off Shape, Again — and Why the Answer Is "Both"
This is structurally the same trade-off as the State Management chapter's Question 13 comparison of centralized versus decentralized state: unified visibility and guaranteed consistency on one side, granularity and contained blast radius on the other. And the resolution is the same too — Question 6's layered-boundaries pattern isn't a compromise between local and global, it's using both together deliberately: global as the last-resort safety net, local for granular, common-case containment.

### ❓ Follow-up Interview Questions

1. Why can a global error handler guarantee coverage in a way that per-component boundaries can't?
2. What's lost by relying on a global handler alone, without any granular boundaries?
3. In what way is this trade-off structurally similar to the centralized-vs-decentralized state management comparison?
4. Why doesn't `react-error-boundary` fully solve the "inconsistent coverage" problem of a local-only strategy?
5. Why is "use both, layered" a better answer than picking one strategy exclusively?

---

## 12. How would you design a global error-handling strategy for a large, production React application?

### 📖 Introduction
This pulls together nearly everything covered so far in this chapter into one blueprint, plus two pieces that only really matter at production scale: a documented retry policy that treats mutations differently from reads, and team-level conventions that keep the strategy actually followed.

### 1️⃣ Layered Error Boundaries
A top-level safety-net boundary, plus route-level and feature/widget-level granular boundaries underneath it (Questions 6 and 11) — global guarantees coverage, local contains blast radius, used together rather than choosing one.

### 2️⃣ Centralized, Normalized API Error Handling
HTTP client interceptors handling cross-cutting concerns like auth redirects, normalized error shapes so components never deal with a backend's raw inconsistent formats, and a global `QueryCache` error handler for automatic logging on every query (Question 10).

### 3️⃣ Apply the Recoverable/Unrecoverable Judgment Consistently
Question 9's distinction needs to be applied as a designed convention, not an ad hoc, per-developer decision each time — recoverable failures get inline retry/messaging, unrecoverable ones get boundary-triggered resets, decided the same way everywhere in the app.

### 4️⃣ Standardize the UI Primitives, Not Just the Logic
Beyond sharing logic (Question 10's `useApiErrorMessage`), share the actual UI components too — one `Spinner`, one `ErrorMessage`, one `EmptyState`, used by every feature team, rather than each team inventing its own visual treatment. This keeps the app feeling consistent even when built by multiple teams.

### 5️⃣ A Documented Retry Policy — Including Why Mutations Are Different
Question 7 covered retrying reads. A genuinely important addition at this scale: mutations (POST/PUT/DELETE) generally should *not* auto-retry the way GET requests can, unless the specific mutation is known to be idempotent. Retrying a payment or order-creation request that actually succeeded the first time — but whose response was lost to a network blip — risks double-charging a customer or creating a duplicate record. A real strategy documents this distinction explicitly rather than leaving it to whichever engineer configures the client.

### 6️⃣ Monitoring Wired In From Day One, Reviewed Continuously
Production monitoring (Question 8) should be integrated at every layer — Error Boundary `componentDidCatch`, global `window` handlers, the `QueryCache`'s `onError` — from the start, not bolted on later. And like the Performance Optimization chapter's Question 14 argued for performance, error dashboards and alert thresholds need periodic review, not a one-time setup that's never revisited as the app changes.

### 7️⃣ Team Conventions and Enforcement
At the scale of multiple teams, technical mechanisms alone aren't enough — a lint rule or code-review checklist requiring every new route to be wrapped in a boundary, and a shared, expected-to-be-reused `ErrorBoundary`/error-utility library, keeps the strategy actually followed rather than slowly eroding as new features get added by people who weren't there when it was designed.

### 💎 Good to Know: None of This Is New — It's Assembly
Every individual piece here was already covered earlier in this chapter. Designing a strategy is really the act of deciding how they compose together consistently, and documenting that decision so it survives beyond whoever made it.

### ❓ Follow-up Interview Questions

1. Why shouldn't mutations be retried automatically the same way GET requests are?
2. What's the risk of leaving the recoverable/unrecoverable judgment to individual developer discretion rather than a documented convention?
3. Why does standardizing shared UI components (not just logic) matter in a multi-team codebase?
4. What would make an error-handling strategy erode over time in a large app, and how does enforcement address that?
5. Why should monitoring dashboards be reviewed continuously rather than set up once?

---

## 13. Explain the complete lifecycle of an error, from the moment a component throws to the fallback UI being shown.

### 📖 Introduction
This closing trace ties together how Error Boundaries actually catch (Question 1), the two lifecycle methods involved (Question 4), where fallback UI comes from (Question 3), layered boundary matching (Question 6), and where logging fits (Question 8) — in the order it all actually happens.

### 💥 Step 1: A Component Throws During Render
Something in a component's render output throws — accessing a property on `undefined`, a failed assumption in the code. This happens synchronously, as part of React's render-phase call stack (Question 1's "can catch" criteria).

### 📤 Step 2: The Error Propagates, and the In-Progress Render Is Discarded
Ordinary JavaScript exception semantics take over — the error propagates up the call stack. React's internal try/catch around subtree rendering (Question 1) means the whole in-progress work-in-progress render for that subtree gets discarded as untrustworthy; the already-committed, currently-on-screen tree remains untouched until React finishes handling the error.

### 🔍 Step 3: React Walks Up to the Nearest Boundary — or Unmounts Everything
React looks for the nearest ancestor Error Boundary above where the error occurred (the same "nearest ancestor catches" shape as Suspense, Performance Optimization chapter Question 5). If no boundary exists anywhere above it in the tree, React's deliberate, severe fallback is to unmount the entire app — treating an uncaught error as reason to distrust the whole tree, not just the subtree that broke. This is exactly why having at least one top-level boundary (Questions 6, 11, and 12) is considered essential, not optional.

### 🧮 Step 4: `getDerivedStateFromError` Runs, and the Boundary Re-renders
Once the nearest boundary is found, React calls its `getDerivedStateFromError(error)` (Question 4) — still within the render phase, as a pure function returning the state update that will drive the fallback. React then re-renders that boundary component with this new state, so its `render()` method runs again and now returns `this.props.fallback`.

### 📋 Step 5: `componentDidCatch` Runs During Commit
Once this new (fallback) render output is ready and React moves into the commit phase, `componentDidCatch(error, errorInfo)` runs (Question 4) — this is where logging to a monitoring service (Question 8) belongs, since the render itself is now stable and past the point of being discarded.

### 🖌️ Steps 6–7: Commit and Paint
React applies the actual DOM changes, swapping out whatever the broken subtree previously rendered for the fallback UI's output — an ordinary commit, following the same mechanics as any other (Rendering & Reconciliation chapter). The browser paints, and the fallback (Question 3) is now visible to the user.

### 🛡️ Good to Know: Why Everything Outside the Boundary Is Untouched
Because the discard-and-reset in Step 2 only ever applies to the specific subtree under the nearest matched boundary, everything else in the app — unrelated siblings, the parent layout — never enters this process at all. This is the mechanical reason Questions 3 and 6's "contained blast radius" claim is actually true, not just a design intention.

### ❓ Follow-up Interview Questions

1. At which step does React decide whether to discard the in-progress render, and why does the already-committed tree stay untouched until then?
2. What happens if an error propagates all the way up without finding any Error Boundary in the tree?
3. Why does `getDerivedStateFromError` run during the render phase while `componentDidCatch` runs during commit?
4. Mechanically, why does a sibling component outside the matched boundary never get affected by this whole sequence?
5. If a component several levels deep throws, and there are boundaries at both an outer and inner level, which one catches it, and why?

---