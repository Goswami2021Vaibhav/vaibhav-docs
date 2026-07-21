---
title: Component Lifecycle
description: Mount, update, unmount — and how hooks replaced the old lifecycle methods.
sidebar_position: 9
---

# Component Lifecycle

## 1. What is the component lifecycle, and what are its three main phases (mounting, updating, unmounting)?

### 📖 Introduction

Every component instance has a predictable "life": it's born and appears on screen, it may change over time, and eventually it goes away. This chapter covers that full lifecycle in depth, building on the pieces already previewed in the Hooks chapter.

---

### 🐣 Mounting — Born Once

**Mounting** is the component being created and inserted into the DOM for the first time. This happens exactly once per component instance.

---

### 🔄 Updating — Changes Zero or More Times

**Updating** is the component re-rendering due to changed props, state, or context (Introduction & Fundamentals chapter). This can happen zero times, once, or many times over a component's life.

---

### 💀 Unmounting — Removed Once

**Unmounting** is the component being removed from the DOM entirely. This happens exactly once, and marks the end of that specific instance's life.

---

### 🗺️ The Full Picture

```text
Mounting (once) → Updating (zero or more times) → Unmounting (once)
```

In a function component, `useEffect` with an empty dependency array (`[]`) ties code specifically to mounting; the cleanup function it returns ties code to unmounting; and effects with populated dependency arrays tie code to specific updates. Each of these gets its own full explanation later in this chapter.

---

### 💎 Good to Know: This Is Per Instance, Not Per Component Definition

It's worth being precise here: mounting and unmounting describe a specific *instance's* life, not the component function itself. The exact same component can be mounted, unmounted, and mounted again several times over an application's life — navigating away from a page and back to it, for example. Each of those is a genuinely separate "life," with its own fresh mount, its own updates, and its own eventual unmount — and, as covered in the Hooks chapter, a fresh mount means a fresh Fiber node and a completely fresh hooks list, with no memory of the previous instance.

---

### ❓ Follow-up Interview Questions

1. What are the three main phases of a component's lifecycle?
2. How many times can mounting happen for a single component instance? What about updating?
3. What marks the end of a component instance's life?
4. Is "mounting" a property of a component's code, or of a specific instance of it?
5. What happens to a component's Hook state when it unmounts and is later remounted?

---

## 2. How is the lifecycle managed in Functional Components using Hooks, compared to how it was managed in Class Components?

### 📖 Introduction

The Hooks chapter already showed one concrete example — a chat subscription — comparing class lifecycle methods to `useEffect`. This question gives the full, systematic mapping between every major class lifecycle method and its Hooks equivalent.

---

### 🗺️ The Full Mapping, Method by Method

| Class Lifecycle Method | Hooks Equivalent |
|---|---|
| `constructor` (for initial state) | Declaring state with `useState` directly |
| `componentDidMount` | `useEffect(() => {...}, [])` |
| `componentDidUpdate` | `useEffect(() => {...}, [dep1, dep2])` |
| `componentWillUnmount` | The function *returned* from `useEffect` |
| Mount + update + unmount combined, for one concern | A single `useEffect` handling setup and cleanup together |
| `shouldComponentUpdate` | `React.memo()` |
| `getDerivedStateFromProps` | Just calculating the value directly during render |
| `componentDidCatch` / `getDerivedStateFromError` | No Hook equivalent exists |

---

### 🎯 A Few Less Obvious Ones, Explained

**`shouldComponentUpdate` → `React.memo()`.** A class could override this method to return `false` and skip a re-render under custom conditions. `React.memo()` (Components chapter) achieves the same goal — skipping an unnecessary re-render — but through a shallow comparison of props by default, rather than a custom function comparing any combination of props and state you choose.

**`getDerivedStateFromProps` → just deriving the value.** This class method existed to recalculate state whenever props changed, before rendering. With Hooks, this entire lifecycle method usually becomes unnecessary — as covered in the Props & State chapter, you simply calculate the derived value directly in the function body on every render, with no separate "sync state from props" step required at all. This is a case where Hooks don't just provide an equivalent — they make an entire class-era concept disappear.

---

### 🚫 The One Real Gap: Error Boundaries

`componentDidCatch` and `getDerivedStateFromError` have no Hook equivalent at all — catching rendering errors still requires a class component, as flagged in the Components chapter and covered fully in the Error Handling chapter.

---

### 💎 Good to Know: The Mapping Isn't Always One-to-One — That's the Point

Notice that one `useEffect` often replaces three separate class methods (mount, update, and unmount) for a single concern. This isn't a coincidence or a gap in the mapping — it's precisely the Hooks chapter's original motivation: grouping code by *what* it does, not by *when* it happens to run.

---

### ❓ Follow-up Interview Questions

1. Which single Hook typically replaces `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined for one concern?
2. What Hooks-era pattern replaces `shouldComponentUpdate`, and how does its comparison mechanism differ?
3. Why does `getDerivedStateFromProps` often have no direct Hook equivalent needed at all?
4. Which class lifecycle methods have no Hook equivalent whatsoever?
5. Why isn't the class-to-Hooks mapping strictly one-to-one, and why is that actually a good thing?

---

## 3. What is a cleanup function in `useEffect`, why is it important, and when does it run?

### 📖 Introduction

Cleanup functions already showed up in the Hooks chapter's example. Here's a proper, dedicated look at what they are and why they matter — the exact ordering across multiple renders gets its own full treatment in question 5.

---

### 🧹 What Is a Cleanup Function?

A cleanup function is the function *optionally returned* from the function you pass to `useEffect`. React calls it to "undo" whatever the effect set up.

```jsx
useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
        connection.disconnect(); // this is the cleanup function
    };
}, [roomId]);
```

---

### 🎯 Why It's Important

Many side effects create something that needs to be explicitly undone eventually — a subscription that needs unsubscribing, an event listener that needs removing, a timer that needs clearing. Without cleanup, these keep running even after they're no longer needed, leading directly to memory leaks and bugs — covered in more depth in question 8.

---

### ⏰ When Does It Run?

At a basic level, cleanup runs in two situations:

1. **Right before the component unmounts** — the intuitive case, matching `componentWillUnmount` (question 2).
2. **Right before the effect runs again**, whenever a dependency changes — React cleans up the *old* effect before setting up the *new* one, every time the effect is about to re-run, not just when the component goes away entirely.

In the example above, if `roomId` changes, the old connection's cleanup runs — disconnecting from the old room — before the new effect connects to the new one. If the component unmounts entirely instead, that same cleanup function runs one final time.

---

### 💎 Good to Know: Not Every Effect Needs One

If an effect doesn't set up anything that needs undoing — setting `document.title`, or a one-off `fetch` whose result isn't being tracked for cancellation — it simply doesn't return anything. The cleanup function is optional, needed only when there's genuinely something to undo.

---

### ❓ Follow-up Interview Questions

1. Where does a cleanup function come from, syntactically?
2. What kind of side effects genuinely need a cleanup function?
3. Besides unmounting, when else does a cleanup function run?
4. In the connection example, what happens to the old connection when `roomId` changes?
5. Does every `useEffect` need to return a cleanup function? Why or why not?

---

## 4. What is the dependency array in `useEffect`, and how does its presence, absence, or contents change behavior?

### 📖 Introduction

The second argument to `useEffect` controls exactly when it runs, and there are three genuinely different configurations, each with very different behavior.

---

### 🔄 No Array At All — Runs After Every Render

```jsx
useEffect(() => {
    console.log("Runs after every render");
});
```

Leaving the array off entirely means the effect runs after every single render, with no exceptions. This is uncommon in practice — most effects care about a specific trigger — but it's occasionally used for things like debugging instrumentation.

---

### 1️⃣ An Empty Array — Runs Once, on Mount Only

```jsx
useEffect(() => {
    console.log("Runs once, on mount only");
}, []);
```

An empty array means the effect runs only once, right after the initial mount (questions 1 and 2), and never again — unless the component unmounts and remounts as a whole new instance. This is the closest Hooks equivalent to `componentDidMount` alone.

---

### 🎯 A Populated Array — Runs on Mount, and Again When a Value Changes

```jsx
useEffect(() => {
    console.log("Runs on mount, and again whenever roomId changes");
}, [roomId]);
```

With one or more dependencies listed, the effect runs after the initial mount, and again every time any listed value has changed since the last time the effect ran — compared using the same reference-equality mechanism from the Props & State chapter.

---

### 🧠 The General Principle: "Here's Everything I Depend On"

The dependency array is really telling React: "here are all the reactive values this effect actually uses from the component's scope — only re-run me when one of these specifically changes." No array at all effectively says "I haven't told you what I depend on, so assume everything." An empty array says "I depend on nothing that changes, so only run me once."

---

### ⚠️ Getting It Wrong

As covered in the Hooks chapter: missing a value the effect actually uses causes a stale closure (covered fully in question 6 of this chapter); including something unstable — a fresh object or function every render — makes the effect behave like the no-array case even though it looks like it should only run on real changes.

---

### 💎 Good to Know: The `exhaustive-deps` ESLint Rule

`eslint-plugin-react-hooks` includes a second rule beyond the Rules of Hooks (Hooks chapter) — `exhaustive-deps`, which automatically warns when a dependency array is missing something the effect body actually references. Where `rules-of-hooks` checks call order and position, `exhaustive-deps` checks the array's *contents* for completeness. Together, these two rules catch most common Hook mistakes automatically, which is exactly why nearly every real React project includes this plugin.

---

### ❓ Follow-up Interview Questions

1. What happens if you omit the dependency array from `useEffect` entirely?
2. What does an empty dependency array specifically tell React to do?
3. What comparison mechanism does React use to decide whether a dependency has "changed"?
4. What does the dependency array conceptually represent, in plain terms?
5. What's the difference between what `rules-of-hooks` checks and what `exhaustive-deps` checks?

---

## 5. What is the execution order between an effect and its cleanup function across renders?

### 📖 Introduction

Question 3 covered the basics of when cleanup runs. Here's the precise, step-by-step order across a full sequence of renders.

---

### 🧭 The Precise Order, Across Multiple Renders

```text
Render 1 (mount):
  → Commit Phase: DOM updated
  → Effect runs (setup #1)

Render 2 (update, dependency changed):
  → Commit Phase: DOM updated
  → Cleanup from Render 1's effect runs FIRST (cleanup #1)
  → THEN the new effect runs (setup #2)

Render 3 (update, dependency changed again):
  → Commit Phase: DOM updated
  → Cleanup from Render 2's effect runs FIRST (cleanup #2)
  → THEN the new effect runs (setup #3)

Component unmounts:
  → Cleanup from Render 3's effect runs (cleanup #3)
  → No new effect runs — the component is gone
```

---

### 🔑 The Key Insight: Cleanup Always Comes Before the Next Setup

The cleanup from the *previous* render's effect always runs before the *new* render's effect runs — never the reverse. This ordering matters concretely: you want to disconnect from an old connection before establishing a new one, not the other way around, which could briefly leave you connected to both at once, or open the door to a race condition.

---

### 🔍 Tracing a Real Example

```jsx
useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
}, [roomId]);
```

If `roomId` goes from `"general"` to `"random"`, and the component then unmounts:

1. Mount with `roomId="general"` → connects to "general".
2. `roomId` changes to `"random"` → disconnects from "general" first, *then* connects to "random".
3. Component unmounts → disconnects from "random", the final cleanup.

---

### 💎 Good to Know: This Ordering Guarantee Is What Makes Effects Safe for Setup/Teardown Pairs

This strict, guaranteed ordering — always cleanup, then setup, never the reverse — is exactly what makes effects a reliable place to handle things that need symmetric setup and teardown: subscribe/unsubscribe, connect/disconnect, `addEventListener`/`removeEventListener`. Without this guarantee, you'd need to manually coordinate that ordering yourself, every time.

---

### ❓ Follow-up Interview Questions

1. When a dependency changes, does the old cleanup run before or after the new effect's setup?
2. In the chat example, what happens to the "general" connection the moment `roomId` changes to "random"?
3. What could go wrong if setup ran before the previous cleanup, rather than after?
4. What happens on the very last render before a component unmounts?
5. Why does this strict ordering make effects a safe place for symmetric setup/teardown logic?

---

## 6. What are stale closures in `useEffect`, and how do they happen?

### 📖 Introduction

The Hooks chapter briefly showed a stale closure bug. Here's the mechanism behind exactly why it happens, not just how to recognize it.

---

### 🔒 What Is a Closure?

A function "closes over" — remembers — the variables from the scope it was defined in, even after that scope has finished executing. This is completely normal, useful JavaScript behavior on its own, not a bug.

---

### 🕰️ Why This Becomes "Stale" Specifically With `useEffect`

Every time a component re-renders, the entire function runs again, creating a brand-new closure for the effect function too. If the dependency array doesn't include everything that should trigger a fresh closure, React keeps using the *old* closure — which still remembers whatever a variable's value was back when that closure was actually created, even though a newer value exists in the component's current render.

---

### 💥 A Concrete Example

```jsx
function DelayedLogger() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            console.log("Count is:", count); // ❌ frozen at whatever count was when this effect was created
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, []); // ❌ missing `count`

    return <button onClick={() => setCount(count + 1)}>Increment</button>;
}
```

Because the dependency array is `[]`, this effect — and its closure over `count` — is created exactly once, when `count` was `0`. Even if the user clicks the button several times before the 3-second timeout fires, the callback still logs `0`, since it's using the original closure, never recreated with a fresher one.

---

### ✅ The Fix: Include the Value in the Dependency Array

```jsx
useEffect(() => {
    const timeoutId = setTimeout(() => {
        console.log("Count is:", count); // ✅ always the count from this effect's own render
    }, 3000);

    return () => clearTimeout(timeoutId);
}, [count]); // ✅ a fresh effect, with a fresh closure, whenever count changes
```

Now, per question 5's cleanup ordering, the previous timeout gets cleared every time `count` changes, and a new one is scheduled — so only the latest timeout ever actually fires, always with the correct value at the time it was scheduled.

---

### 🔧 An Alternative Fix: Reading the Latest Value via a Ref

If you genuinely want to peek at whatever the *latest* value is when a callback eventually fires, without re-triggering the effect at all, storing the value in a ref (Hooks chapter) sidesteps the closure issue entirely — a ref is a mutable box that's always current when read, rather than a captured value frozen at creation time.

---

### 💎 Good to Know: Stale Closures Aren't Unique to `useEffect`

This can happen with any callback that captures a value and is invoked later — event handlers, `setTimeout`, promises. `useEffect`'s dependency array is just the most common place it shows up in practice, since effects are specifically built around "re-run me when these things change," making a missing dependency an especially easy mistake to make.

---

### ❓ Follow-up Interview Questions

1. What is a closure, in plain terms, independent of any bug?
2. In the `DelayedLogger` example, why does the timeout always log `0`, no matter how many times the button is clicked?
3. What does adding `count` to the dependency array actually fix?
4. How does storing a value in a ref sidestep the stale closure problem entirely?
5. Are stale closures a `useEffect`-specific problem, or a more general JavaScript one?

---

## 7. How do you correctly handle API calls, event listeners, and timers within the component lifecycle?

### 📖 Introduction

These are the three most common categories of side effects in real applications, and each has its own correct, well-established pattern.

---

### 🌐 API Calls: Guarding Against Race Conditions With a Cancellation Flag

```jsx
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let ignore = false;

        fetchUser(userId).then((data) => {
            if (!ignore) {
                setUser(data);
            }
        });

        return () => {
            ignore = true;
        };
    }, [userId]);
}
```

If `userId` changes again before the first request finishes, or the component unmounts, the cleanup function sets `ignore = true`. When the original, now-outdated request eventually resolves, its callback checks `ignore` and correctly skips calling `setUser` with stale data — avoiding a race condition where an older, slower request's result could overwrite a newer one's. This relies directly on question 5's cleanup-ordering guarantee, and question 6's closures — each effect instance captures its own independent `ignore` variable.

---

### 🖱️ Event Listeners: Matching References for Add and Remove

```jsx
useEffect(() => {
    function handleResize() {
        console.log(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // the same reference
}, []);
```

A common, subtle mistake is passing different function references to `addEventListener` and `removeEventListener` — since removal only works if it's given the *identical* reference used to add the listener, a mismatch means the removal silently fails, leaving the old listener attached.

---

### ⏱️ Timers: Clearing What You Set

The same pattern from question 6's fix — store the timer ID from `setTimeout`/`setInterval`, and clear it in the cleanup function, so a stale timer never fires after it's no longer relevant.

---

### 💎 Good to Know: All Three Share the Same Underlying Shape

API calls, event listeners, and timers all follow the exact same shape: set something up in the effect body, and undo, cancel, or remove it in the cleanup function. Once you recognize this shared pattern, there's no need to memorize three separate "correct ways" — it's the same principle from question 3, applied consistently regardless of which specific kind of side effect is involved.

---

### ❓ Follow-up Interview Questions

1. What problem does the `ignore` flag in the `UserProfile` example actually prevent?
2. Why must `removeEventListener` be given the exact same function reference used with `addEventListener`?
3. What happens if a timer isn't cleared in a cleanup function before the component unmounts?
4. What single underlying pattern do API calls, event listeners, and timers all share?
5. Why is a race condition possible with API calls but not with a properly cleaned-up event listener?

---

## 8. How can incorrect dependency arrays or missing cleanup functions lead to bugs or memory leaks?

### 📖 Introduction

Questions 3, 4, and 6 covered the individual pieces. Here's a focused look at the actual consequences — split into two genuinely different categories of harm.

---

### 🐛 Bugs: Stale Closures

As covered in question 6, a missing dependency causes an effect to keep using outdated values from whenever its closure was actually created — the classic incorrect-behavior consequence of a bad dependency array.

---

### 🩸 Memory Leaks: When Cleanup Is Missing Entirely

A missing cleanup function for a subscription or listener means it stays active even after a component unmounts — holding onto references (like a state setter tied to a now-gone component instance) that would otherwise be free for the JavaScript engine to garbage collect. Since something is still "alive" and referencing them, that memory can't be reclaimed.

---

### 🔍 A Concrete Example: The Never-Ending Interval

```jsx
function LiveClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        setInterval(() => {
            setTime(new Date()); // ❌ no cleanup — this interval never stops
        }, 1000);
    }, []);

    return <div>{time.toLocaleTimeString()}</div>;
}
```

Every time `LiveClock` mounts — a user navigating to a page containing it, away, and back again, several times — a brand-new interval is created, but the *previous* mount's interval is never cleared. After five mount/unmount cycles, there are five separate intervals still running in the background, all still trying to call `setTime` on component instances that no longer exist. This is a genuine memory leak: the intervals, and everything they reference, can never be garbage collected as long as they keep running.

The fix is exactly the pattern from question 7:

```jsx
useEffect(() => {
    const intervalId = setInterval(() => {
        setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // ✅ stops the interval on unmount
}, []);
```

---

### 💎 Good to Know: Duplicate, Stacked Subscriptions Are Another Variant

A related but distinct symptom: if an effect that subscribes to something is missing a dependency and never correctly re-subscribes when it should, a still-mounted component can end up with multiple duplicate, stacked subscriptions to the same source — each one firing independently, potentially triggering the same state update or API call several times for a single event. Different root cause from the interval example, but the same underlying category of mistake: something set up in an effect that was never properly cleaned up before setting up again.

---

### ❓ Follow-up Interview Questions

1. What's the difference between a "bug" and a "memory leak" in the context of this question?
2. In the `LiveClock` example, what specifically can never be garbage collected, and why?
3. What single line fixes the `LiveClock` memory leak?
4. How could a missing dependency lead to duplicate, stacked subscriptions rather than a stale closure?
5. What do the interval leak and the duplicate-subscription problem have in common at their root?

---

## 9. What is the difference between `useEffect` and `useLayoutEffect` from a lifecycle perspective?

### 📖 Introduction

The Hooks chapter already gave the full comparison between these two, focused on paint timing and the classic flicker bug. This question is narrower — how they fit specifically into the mount/update/unmount phases and the Commit sequence.

---

### 🔁 Same Lifecycle Triggers, Different Execution Timing

Both Hooks are triggered by the exact same lifecycle events — mount, dependency changes on update, and unmount. The difference isn't *which* events trigger them; it's *when*, relative to the browser's paint, they actually run once triggered (the Hooks chapter's core distinction).

---

### 🧭 Where Each Fits in the Commit Sequence

```text
1. React commits DOM mutations
2. useLayoutEffect runs — synchronously, before the browser paints
3. Browser paints
4. useEffect runs — asynchronously, after the paint
```

---

### 🔍 A Concrete Ordering Example

```jsx
function Example() {
    useLayoutEffect(() => {
        console.log("1. Layout effect (before paint)");
    }, []);

    useEffect(() => {
        console.log("2. Effect (after paint)");
    }, []);

    return <div>Hello</div>;
}
```

On mount, "1. Layout effect" always logs before "2. Effect" — regardless of the order they're written in the source code. The order is determined entirely by timing relative to the paint, not by where each Hook appears in the function.

---

### 💀 On Unmount: The Same Timing Difference Applies to Cleanup

`useLayoutEffect`'s cleanup runs synchronously, as part of the Commit Phase's teardown; `useEffect`'s cleanup runs asynchronously, afterward. If something genuinely needs to be torn down immediately and synchronously — certain focus-management logic, for instance — `useLayoutEffect`'s cleanup provides that guarantee, while `useEffect`'s might run slightly later.

---

### 💎 Good to Know: This Is Part of a Bigger Pipeline

`useLayoutEffect` is part of the same synchronous Commit Phase work; `useEffect` is scheduled as separate, lower-priority work after the browser has already had a chance to paint. Question 11 covers this full pipeline — the Render Phase versus the Effect Phase — in complete depth.

---

### ❓ Follow-up Interview Questions

1. Do `useEffect` and `useLayoutEffect` respond to different lifecycle events, or the same ones?
2. In the `Example` component, why does the layout effect always log first, regardless of source order?
3. What happens to `useLayoutEffect`'s cleanup during unmount, compared to `useEffect`'s?
4. Why might synchronous cleanup timing matter for something like focus management?
5. Which phase of React's pipeline does `useLayoutEffect` belong to?

---

## 10. How does React Strict Mode affect lifecycle behavior during development, and why?

### 📖 Introduction

Many developers are alarmed the first time they notice a component's effects — or even the component function itself — running twice in development. This is Strict Mode, working exactly as designed.

---

### 🩺 What Strict Mode Actually Is

`<React.StrictMode>` is a development-only tool that helps surface potential problems early, by deliberately exercising certain code paths in ways that expose bugs that might otherwise stay hidden until they cause real trouble.

---

### 🔁 The Specific Lifecycle Behavior: Mount, Unmount, Mount Again — In Development Only

Since React 18, Strict Mode deliberately mounts every component twice in a row in development: mount, immediately unmount, then mount again. This simulates what would happen if a component were quickly remounted — say, from a fast navigation, or a key change (Lists & Keys chapter). A properly cleaned-up effect behaves correctly even through this rapid cycle; a buggy one, missing cleanup (questions 3 and 8), shows visible signs of trouble immediately.

---

### 🔍 Tracing This With Question 8's Interval Bug

```jsx
useEffect(() => {
    setInterval(() => setTime(new Date()), 1000); // ❌ no cleanup
}, []);
```

In Strict Mode's development double-mount, this component mounts, immediately unmounts, then mounts again — and since there's no cleanup, two separate intervals get created almost immediately, visibly noticeable right away. Strict Mode is deliberately exposing, in development, a bug that would otherwise have quietly accumulated leaked intervals over a much longer period of real production usage, with no obvious immediate symptom.

---

### 🚫 This Never Happens in a Production Build

This double-mounting behavior is exclusively a development-time diagnostic. In a production build, it's completely disabled — components mount exactly once, normally. Strict Mode has zero effect on your app's actual behavior once deployed.

---

### 🧪 It Also Double-Invokes Pure Functions to Catch Impurity

Strict Mode also double-invokes certain functions that are supposed to be pure — the component function itself, and reducer functions passed to `useReducer` — to help catch code that accidentally has side effects where it shouldn't. If calling one of these twice produces inconsistent results or visible side effects, that's a sign the code is impurely relying on something it shouldn't.

---

### 💎 Good to Know: The Fix Is Never to Disable Strict Mode

The correct response to a confusing "double effect" in development is never to remove `<React.StrictMode>` to make the symptom disappear — it's to add the missing cleanup function (questions 3, 7, and 8). Strict Mode isn't causing the bug; it's making an already-existing bug visible early, in a safe development environment, specifically so it gets caught before shipping.

---

### ❓ Follow-up Interview Questions

1. What specific lifecycle behavior does Strict Mode introduce in development, since React 18?
2. Why does Strict Mode's double-mount cycle expose the `LiveClock` interval bug so quickly?
3. Does this double-mounting behavior happen in a production build?
4. Besides effects, what else does Strict Mode double-invoke, and why?
5. What's the correct response when Strict Mode reveals a confusing double-effect — fixing the code, or removing Strict Mode?

---

## 11. What is the difference between the Render Phase and the Effect Phase?

### 📖 Introduction

The Introduction & Fundamentals chapter covered the Render Phase and the Commit Phase. Question 9 promised a deeper look at exactly where effects fit into this pipeline — which turns out to be a third, genuinely separate stage.

---

### 🔁 Quick Recap: Render Phase and Commit Phase

Briefly: the Render Phase figures out what changed; the Commit Phase applies it to the Real DOM.

---

### ⏳ The Effect Phase: A Third, Separate Stage After the Paint

This is when regular `useEffect` callbacks actually run — as opposed to `useLayoutEffect`, which (question 9) runs synchronously as part of the Commit Phase itself, before the paint. The Effect Phase happens asynchronously, scheduled to run only after the browser has already painted.

---

### 🗺️ The Full Three-Phase Pipeline

```text
1. Render Phase — component functions run, Virtual DOM built and diffed
2. Commit Phase — Real DOM updated; useLayoutEffect runs here too, before paint
   → Browser paints
3. Effect Phase — useEffect callbacks run, asynchronously, after the paint
```

---

### 🤔 Why Keep the Effect Phase Separate and Asynchronous?

If `useEffect` callbacks ran synchronously as part of the Commit Phase, every side effect — data fetching, subscriptions, logging — would block the browser from painting until it finished. For most side effects, which don't need to affect what's visually on screen immediately, this would make the app feel sluggish for no good reason. Deferring `useEffect` to its own lower-priority phase after the paint lets the user see the updated UI as fast as possible, while the less urgent side-effect work happens separately.

---

### 🔍 Tracing All Three in One Component

```jsx
function Example() {
    console.log("A: Render Phase");

    useLayoutEffect(() => {
        console.log("B: Commit Phase (before paint)");
    }, []);

    useEffect(() => {
        console.log("C: Effect Phase (after paint)");
    }, []);

    return <div>Hello</div>;
}
```

Order: "A" runs as part of the Render Phase, on every render → the DOM is committed → "B" runs, still synchronously within the Commit Phase → the browser paints → "C" runs, in its own separate, later Effect Phase.

---

### 💎 Good to Know: Why Calling a Setter in an Effect Isn't Dangerous

This three-phase breakdown is exactly why calling a state setter inside the Effect Phase — a perfectly normal thing to do, like `setUser(data)` after a fetch resolves — doesn't cause any kind of special infinite loop by itself. Since the Effect Phase happens strictly after a completed Render-and-Commit cycle, calling a setter there simply schedules a brand-new, separate Render Phase to begin — a controlled continuation of the same ordinary update cycle from the Introduction & Fundamentals chapter, not some dangerous exception to it.

---

### ❓ Follow-up Interview Questions

1. What are the three phases in the full pipeline, in order?
2. Which phase does `useLayoutEffect` belong to, and which does `useEffect` belong to?
3. Why would the app feel sluggish if `useEffect` ran synchronously as part of the Commit Phase?
4. In the `Example` component, what determines the order of "A," "B," and "C" — source order, or something else?
5. Why doesn't calling a state setter inside a `useEffect` cause a special kind of infinite loop?

---

## 12. How would you design lifecycle logic for a component with multiple, interdependent side effects?

### 📖 Introduction

Real components often need several side effects working together, and a poor structure here is a common source of the bugs covered earlier in this chapter. Here are the actual design principles for getting it right.

---

### 🧩 Principle 1: Split Unrelated Effects, Keep Related Ones Together

As covered in the Hooks chapter, don't cram multiple unrelated concerns into one giant effect just because they happen to run at similar times — one effect per concern.

---

### 🔗 Principle 2: Let Dependent Effects React to State, Not to Each Other Directly

```jsx
function VideoPlayer({ videoId }) {
    const [videoData, setVideoData] = useState(null);

    // Effect A: fetch video metadata
    useEffect(() => {
        let ignore = false;
        fetchVideoData(videoId).then((data) => {
            if (!ignore) setVideoData(data);
        });
        return () => { ignore = true; };
    }, [videoId]);

    // Effect B: depends on videoData being available
    useEffect(() => {
        if (!videoData) return; // guard — do nothing until A has produced data
        const player = initializePlayer(videoData.streamUrl);
        return () => player.destroy();
    }, [videoData]);
}
```

Effect B never reaches directly into Effect A or tries to manually sequence them — it simply declares its own dependency on `videoData`, with an early-return guard for when that data isn't ready yet. React naturally handles the "run B again once A produces new data" sequencing, since `videoData` changing is exactly what triggers Effect B to re-run (question 4).

---

### 🤝 Principle 3: Consolidate Effects That Must Start and Stop Together

If two pieces of logic always need to start together and always need to stop together — opening a connection and starting a keep-alive ping for that same connection — keep them in one effect, with one combined cleanup. Splitting them into two independently-triggered effects risks them getting out of sync, like a ping timer that keeps trying to ping a connection that already closed.

---

### 🪝 Principle 4: Extract the Whole Coordinated Concern Into a Custom Hook

If the interdependent effects together represent one cohesive concern — "manage a live video player's full lifecycle" — wrapping the whole thing (both effects, plus the state they share) into one Custom Hook, like `useVideoPlayer(videoId)`, makes the consuming component simple again, applying the Hooks chapter's extraction guidance directly.

---

### 💎 Good to Know: A Warning Sign Worth Naming

If you find yourself reaching for a `useRef` purely so one effect can directly call into another, bypassing the dependency-based coordination from Principle 2 entirely, that's usually a sign the design needs rethinking. Letting state act as the signal between effects, or consolidating them into one, is almost always cleaner than manually wiring effects together through imperative escape hatches.

---

### ❓ Follow-up Interview Questions

1. Why shouldn't unrelated side effects be combined into one large `useEffect`?
2. In the `VideoPlayer` example, how does Effect B know when to actually run?
3. Why is it risky to split two effects that must always start and stop together?
4. When does it make sense to extract a whole group of coordinated effects into a Custom Hook?
5. Why is reaching for a ref to let one effect call into another usually a design smell?

---

## 13. How has React's approach to lifecycle evolved from Class Components to Hooks?

### 📖 Introduction

The Hooks chapter's closing question already covered the general trade-offs between Hooks and classes. This closing question is narrower and more conceptual: how the actual *mental model* of "lifecycle" itself has changed, tying together everything covered in this chapter.

---

### 🕰️ The Old Model: Organized Around Discrete, Named Moments

Class lifecycle methods organized everything around specific, named moments in a component's life — `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`. The natural question to ask was "*when* does this happen?", and code got organized around those moments. This is a fundamentally timeline-centric way of thinking.

---

### 🔄 The New Model: Organized Around Staying Synchronized

`useEffect` reframes the question entirely. Instead of "at what moment should this run?", the question becomes "what does this effect depend on, and what does it need to clean up?" (question 4). This is a concept-centric model, not a timeline-centric one — you're not describing *when* something happens, you're describing what a piece of code needs to stay *synchronized with*.

---

### 📜 Tracing the Specific Shifts, Piece by Piece

- Discrete named methods → one unified `useEffect` API, differentiated by its own dependency array (questions 1, 2, and 4).
- Manually comparing `prevProps`/`prevState` inside `componentDidUpdate` → automatic, declarative dependency comparison (question 4).
- Remembering to mirror setup logic in a separate `componentWillUnmount`, elsewhere in the file → a cleanup function living immediately next to its own setup code, in the same function (question 3).
- No real development-time safety net for classes around this → Strict Mode's double-invoke behavior (question 10), which exists specifically because "does this properly resync and clean up" is now a more central concern than it used to be.

---

### 💎 The Big Idea Capping Off This Chapter

Hooks didn't just give function components a new way to do what classes already did — they reframed what "lifecycle" actually means: from a sequence of named moments a component passes through, to an ongoing responsibility to keep a component synchronized with whatever it depends on, for as long as it stays mounted.

---

### ❓ Follow-up Interview Questions

1. What question does the old, class-based lifecycle model naturally encourage you to ask?
2. What question does `useEffect`'s dependency array encourage you to ask instead?
3. Why does keeping cleanup logic next to its own setup code reduce a whole category of bugs?
4. Why does Strict Mode's double-invoke behavior make more sense under the Hooks model than it would have under the class model?
5. In one sentence, how would you describe the shift in what "lifecycle" actually means?

---