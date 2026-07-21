---
title: Hooks
description: useState, useEffect, and the rules that make hooks actually work.
sidebar_position: 8
---

# Hooks

## 1. What are Hooks, why were they introduced, and what problems do they solve compared to Class Components?

### 📖 Introduction

The Components chapter briefly compared functional and class components — less boilerplate, no `this` confusion, easier logic reuse. This question goes deep specifically on Hooks themselves: what they are, and the exact problems they were built to solve.

---

### 🪝 What Are Hooks?

**Hooks** are special functions — all starting with `use` — that let a function component "hook into" React features that used to be available only inside class components: state, lifecycle-like behavior, context, refs. Before Hooks, a function component could only be a simple, one-shot rendering function; the moment it needed state or anything lifecycle-related, it had to become a class.

---

### 🎯 Problem 1: Reusing Stateful Logic Was Awkward

If two unrelated components needed the same *stateful* behavior — tracking window width, subscribing to a data source — the only tools available were Higher-Order Components or Render Props (Components chapter), both of which caused real problems of their own: wrapper hell, naming collisions, and component trees that got hard to follow. There was no direct, function-like way to share stateful logic before Hooks.

---

### 🧩 Problem 2: Related Logic Got Scattered Across Lifecycle Methods

In a class component, one conceptual piece of logic — setting up a subscription, then tearing it down — had to be split across two entirely separate methods: `componentDidMount` for setup, `componentWillUnmount` for cleanup. Meanwhile, several *unrelated* concerns could end up crammed into the same lifecycle method, purely because they happened to need to run at the same moment. Hooks let you group code by what it's doing, not by when it happens to run.

---

### 😵 Problem 3: `this` Is Confusing — for People and for Tooling

The `this` keyword in classes behaves in genuinely error-prone ways (Components chapter) — methods need manual binding or awkward arrow-function class properties just to behave predictably. Classes are also harder for build tools to minify and optimize compared to plain functions. Hooks avoid all of this — they're just functions, with no `this` to manage at all.

---

### 🔍 A Concrete Before/After: Grouping by Concern, Not by "When"

```jsx
// Class component — one concern (subscription) split across three separate places
class ChatRoom extends React.Component {
    componentDidMount() {
        document.title = `Chat: ${this.props.roomId}`;
        this.connection = createConnection(this.props.roomId);
        this.connection.connect();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.roomId !== this.props.roomId) {
            document.title = `Chat: ${this.props.roomId}`;
            this.connection.disconnect();
            this.connection = createConnection(this.props.roomId);
            this.connection.connect();
        }
    }

    componentWillUnmount() {
        this.connection.disconnect();
    }
}
```

```jsx
// Function component with Hooks — each concern is self-contained
function ChatRoom({ roomId }) {
    useEffect(() => {
        document.title = `Chat: ${roomId}`;
    }, [roomId]);

    useEffect(() => {
        const connection = createConnection(roomId);
        connection.connect();
        return () => connection.disconnect(); // cleanup, right next to its own setup
    }, [roomId]);
}
```

Each `useEffect` handles one concern completely — its setup and its cleanup together, in one place — instead of the same logic being duplicated across three disconnected lifecycle methods.

---

### 💎 Good to Know: Hooks Were Purely Additive, Not a Breaking Change

Hooks were introduced in React 16.8 (2019) as a purely additive feature — class components weren't removed or deprecated, and still work today. This was a deliberate design choice, letting teams adopt Hooks gradually, file by file, without an all-or-nothing rewrite of an existing application.

---

### ❓ Follow-up Interview Questions

1. What could a function component not do at all before Hooks existed?
2. What real problems did Higher-Order Components and Render Props have when sharing stateful logic?
3. Why does splitting one concern across `componentDidMount` and `componentWillUnmount` make code harder to follow?
4. What does it mean to "group code by concern, not by when it runs"?
5. Were class components removed when Hooks were introduced?

---

## 2. What are the Rules of Hooks, and why must Hooks always be called at the top level?

### 📖 Introduction

Hooks come with two strict rules, enforced automatically by ESLint's `react-hooks` plugin in most project setups. Knowing what they are is one thing — knowing *why* they exist is the genuinely useful part.

---

### 📏 The Two Rules of Hooks

1. **Only call Hooks at the top level** — never inside loops, conditions, or nested functions.
2. **Only call Hooks from React function components or from Custom Hooks** — never from a regular JavaScript function.

---

### 🚫 What a Violation Looks Like

```jsx
function BadComponent({ shouldTrack }) {
    if (shouldTrack) {
        const [count, setCount] = useState(0); // ❌ conditional Hook call
    }
}
```

```jsx
function AnotherBadComponent({ items }) {
    for (const item of items) {
        const [selected, setSelected] = useState(false); // ❌ Hook inside a loop
    }
}
```

---

### 🧠 Why the Rule Exists: React Tracks Hooks by Call Order, Not by Name

React doesn't track a component's Hooks by name or by any explicit identifier — it tracks them purely by the **order** they're called in, on every render, matching the Nth Hook call on this render to the Nth Hook "slot" from the previous render (the full mechanism is covered in question 3). If a Hook call is conditionally skipped on some renders but not others, that order shifts, and the slot-matching gets misaligned between renders.

---

### 💥 A Concrete Example of What Breaks

```jsx
function Profile({ showBio }) {
    if (showBio) {
        const [bio, setBio] = useState(""); // sometimes called, sometimes not
    }
    const [name, setName] = useState(""); // this becomes Hook #1 or #2, depending on showBio!
}
```

If `showBio` is `true` on one render (`bio` is Hook #1, `name` is Hook #2), then `false` on the next (`name` becomes Hook #1 instead), React's internal slot-matching gets confused — it might hand back `bio`'s stored value for what's now meant to be `name`, or throw an error like "Rendered fewer hooks than expected."

---

### 🔍 Why Rule 2 Matters Too

Calling a Hook only from a component or Custom Hook ensures React can tie that Hook's state to a specific component instance's slot list. A `useState` call from a random utility function has no component instance to attach its state to — React would have no consistent place to store or retrieve it across renders at all.

---

### 💎 Good to Know: This Is Why the ESLint Plugin Matters So Much

`eslint-plugin-react-hooks`'s `rules-of-hooks` rule isn't just a style preference — it's catching an entire category of bug that would otherwise be genuinely hard to notice until it produces a confusing, hard-to-reproduce runtime failure.

---

### ❓ Follow-up Interview Questions

1. What are the two Rules of Hooks?
2. Why does calling a Hook conditionally risk breaking a component?
3. How does React actually track which Hook call corresponds to which stored state?
4. In the `Profile` example, what specifically goes wrong when `showBio` changes between renders?
5. Why can't a Hook be called from a plain, non-component JavaScript function?

---

## 3. How does React internally keep track of multiple Hooks and associate them with the correct component instance?

### 📖 Introduction

Question 2 promised this mechanism in full. Here's what's actually happening behind the scenes.

---

### 🗂️ The Core Idea: A Persistent List of "Hook Objects" Per Component

For each component instance, React maintains a list of hook objects — attached to that component's Fiber node, its internal React-managed representation (covered further in the Rendering & Reconciliation chapter). Each hook object stores whatever that specific hook call needs to remember between renders: a `useState`'s current value, a `useEffect`'s function and dependency array, and so on.

---

### 🏗️ On the First Render (Mount): Building the List

As the component function runs top to bottom on its first render, each Hook call creates a new hook object and appends it to that component's list, in the exact order the Hooks were called.

---

### 🔁 On Later Renders (Updates): Walking the Same List in Order

On every subsequent render, React doesn't create new hook objects — it walks the *same* list again, in order, handing back the already-existing object at each position to the matching `useState`/`useEffect` call. This is exactly why order must stay identical across renders (question 2): the Nth Hook call on this render is assumed, unconditionally, to correspond to the Nth object created on the first render.

---

### 💻 A Simplified Mental Model

```javascript
// A radically simplified version of how useState works internally
let hooks = [];
let currentHookIndex = 0;

function useState(initialValue) {
    const index = currentHookIndex;
    hooks[index] = hooks[index] || initialValue; // create on first render, reuse afterward

    function setState(newValue) {
        hooks[index] = newValue;
        rerender();
    }

    currentHookIndex++; // move to the next slot for the next Hook call in this render
    return [hooks[index], setState];
}
```

`hooks` persists across renders — unlike a regular local variable inside the component function, which gets recreated fresh every call. `currentHookIndex` resets to `0` at the start of each render, then increments once per Hook call. This index-based lookup into a persistent list is precisely the "slot" mechanism behind question 2's rule.

---

### 🎯 Tying Hooks to the Correct Component Instance

This hooks list lives on the component's own Fiber node — so rendering the same component type twice (two separate `<Counter />` elements side by side) gives each one its own, completely separate Fiber node, and therefore its own separate hooks list. That's exactly why two instances of the same component can hold entirely independent state, despite running the exact same function code.

---

### 💎 Good to Know: This Is Why Unmounting and Remounting Resets Hook State

A new mount means a brand-new Fiber node, which means a brand-new, empty hooks list — with no memory of whatever the previous instance's Hooks had stored. This connects directly to the Lists & Keys chapter's key-change-causes-remount discussion: changing a key forces exactly this — a fresh Fiber node, and a fresh, empty hooks list.

---

### ❓ Follow-up Interview Questions

1. Where does React actually store a component's list of Hook objects?
2. What happens to that list on a component's very first render, versus every render after?
3. In the simplified `useState` mental model, what does `currentHookIndex` reset to, and when?
4. Why can two separate instances of the same component hold completely independent state?
5. Why does remounting a component (for example, after a key change) reset all of its Hook state?

---

## 4. What happens if the order of Hook calls changes between renders?

### 📖 Introduction

Questions 2 and 3 covered the rule and the mechanism behind it. This question looks specifically at what actually happens, concretely, when that order breaks — and it turns out there are two genuinely different outcomes, depending on exactly how it breaks.

---

### 🔢 Failure Mode 1: The Total Hook Count Changes — A Loud, Clear Error

If a Hook call is conditionally added or skipped (question 2's scenario), the *total number* of Hook calls differs from one render to the next. React explicitly checks for this, and throws a clear, hard-to-miss error: something like *"React has detected a change in the order of Hooks called by [ComponentName]. This will lead to bugs and errors if not fixed,"* or *"Rendered fewer hooks than expected."* In this failure mode, React actively protects you with a loud signal.

---

### 🎭 Failure Mode 2: Same Count, Different Hook Type at the Same Slot — Silent Corruption

This one is sneakier:

```jsx
function Weird({ mode }) {
    if (mode === "a") {
        useEffect(() => console.log("effect A"), []);
        useState(0);
    } else {
        useState(0);
        useEffect(() => console.log("effect B"), []);
    }
}
```

The total Hook count stays at exactly 2 regardless of `mode` — but *which* Hook occupies slot 1 versus slot 2 flips depending on it. Since React's slot-matching (question 3) only checks position, not the actual type of Hook, this doesn't trigger the clean error from Failure Mode 1. Instead, React can end up treating a `useEffect`'s stored data as if it were a `useState`'s value, or vice versa — producing confusing, silent runtime bugs rather than a clear crash.

---

### ⚖️ Why One Is Loud and the Other Is Silent

React checks the total *count* of Hooks called, which is a cheap, reliable thing to verify — hence the loud error in Failure Mode 1. It doesn't verify that the Hook *type* at each position matches what was there before, since that would be a more expensive check to perform on every single render — which is exactly why Failure Mode 2 can slip through silently.

---

### 💎 Good to Know: This Is Exactly What the ESLint Rule Catches Before Runtime

This is precisely why the `rules-of-hooks` ESLint rule from question 2 matters so much — it statically analyzes your code's structure and catches both failure modes at lint time, before either a runtime crash or, worse, a silent, hard-to-trace bug ever has the chance to occur when a user happens to hit the right conditional path.

---

### ❓ Follow-up Interview Questions

1. What specific error does React throw when the total number of Hook calls changes between renders?
2. In the `Weird` example, why doesn't React throw a clear error even though something is genuinely wrong?
3. What does React actually check between renders, and what does it *not* check?
4. Why is Failure Mode 2 considered more dangerous than Failure Mode 1, despite both stemming from the same underlying rule violation?
5. How does the ESLint rule catch both of these failure modes before the code even runs?

---

## 5. What is the difference between `useState` and `useReducer`, and when should you prefer one over the other?

### 📖 Introduction

Both manage state, but they're suited to genuinely different situations — a single simple value versus state with many possible transitions.

---

### 🔘 `useState` — A Simple Value, With the "How" Handled Inline

```jsx
const [count, setCount] = useState(0);
```

You get a value and a setter, and you write the logic for *what changes* wherever you call that setter — usually right inside an event handler.

---

### 🧭 `useReducer` — Centralized Transition Logic

```jsx
function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return { count: state.count + 1 };
        case "decrement":
            return { count: state.count - 1 };
        case "reset":
            return { count: 0 };
        default:
            throw new Error("Unknown action");
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });

    return (
        <div>
            {state.count}
            <button onClick={() => dispatch({ type: "increment" })}>+</button>
            <button onClick={() => dispatch({ type: "decrement" })}>-</button>
            <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
        </div>
    );
}
```

Every possible way this state can change lives in one function — the reducer — rather than scattered across separate event handlers.

---

### 🎯 When to Prefer `useReducer`

- **Multiple related pieces of data need to change together, consistently** — rather than several independent `useState` calls that could drift out of sync with each other.
- **There are many possible transitions**, and keeping that logic in scattered event handlers becomes hard to follow — centralizing them in one reducer makes the full set of "things that can happen to this state" visible in one place.
- **The next state depends on the previous state in a non-trivial way** — a reducer keeps each transformation named and organized (a clear `case "increment":`), rather than spread across various inline updater callbacks.

---

### 🧪 A Concrete Benefit: Reducers Are Easy to Test in Isolation

A reducer is just a plain function — given the same state and action, it always returns the same result. That means it can be tested directly, with plain function calls, without rendering any component at all.

---

### 🔙 When `useState` Remains the Better Choice

For a single, simple, independent value — a text input, a boolean toggle — `useReducer` is unnecessary ceremony. `useState` stays the simpler, more direct choice.

---

### ❓ Follow-up Interview Questions

1. Where does the "how state changes" logic live with `useState`, compared to `useReducer`?
2. What's a sign that a component's state might be better managed with `useReducer`?
3. Why is a reducer function easy to test without rendering a component?
4. Why would `useReducer` be unnecessary overhead for a single boolean toggle?
5. In the `Counter` example, what determines which `case` in the reducer actually runs?

---

## 6. What is the difference between `useEffect` and `useLayoutEffect`?

### 📖 Introduction

Both run after the Commit Phase (Introduction & Fundamentals chapter) — after the DOM has actually been updated. The real difference is whether the browser has already painted that update to the screen before or after your effect runs, and that timing difference matters for a specific class of visual bug.

---

### ⏱️ `useEffect` — Runs After the Browser Paints

`useEffect` runs asynchronously, after the browser has already painted the updated screen. There's a brief window — often imperceptible, but not always — where the user could see the DOM in its just-committed state before the effect has a chance to run and change anything further.

---

### ⏸️ `useLayoutEffect` — Runs Before the Browser Paints, Blocking It

`useLayoutEffect` runs synchronously, immediately after the DOM updates but *before* the browser paints anything. React actually waits for it to finish before letting the paint happen — so if the effect changes something, that change is included in the very first paint the user sees.

---

### 💥 A Concrete Example: The Flicker Bug and Its Fix

```jsx
function Tooltip({ text }) {
    const [width, setWidth] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        setWidth(ref.current.offsetWidth); // ❌ measured after paint — can cause a visible flicker
    }, []);

    return <div ref={ref} style={{ marginLeft: -width / 2 }}>{text}</div>;
}
```

On the first render, `width` is `0`, so the tooltip paints in the wrong position. Only *after* that paint does `useEffect` run, measure the real width, and trigger a second render that repositions it — the user can catch a visible jump as it snaps into place.

```jsx
function Tooltip({ text }) {
    const [width, setWidth] = useState(0);
    const ref = useRef(null);

    useLayoutEffect(() => {
        setWidth(ref.current.offsetWidth); // ✅ measured and adjusted before the browser paints
    }, []);

    return <div ref={ref} style={{ marginLeft: -width / 2 }}>{text}</div>;
}
```

Since `useLayoutEffect` finishes before the browser paints, the correct position is what shows up in the very first paint the user ever sees — no flicker.

---

### 🎯 When to Use Which

Default to `useEffect` for most side effects — data fetching, subscriptions, logging — since it doesn't block the browser from painting, keeping the app feeling responsive. Reach for `useLayoutEffect` specifically when you need to read something from the DOM and synchronously adjust the visual layout based on it, before the user sees anything.

---

### 💎 Good to Know: `useLayoutEffect` Can Hurt Performance If Overused

Because it blocks the browser from painting until it finishes, using `useLayoutEffect` for something slow or unnecessary makes the app feel less responsive — exactly the cost `useEffect` avoids by default. It should be reserved for genuinely layout-related, visually-blocking concerns, not used as a general-purpose replacement for `useEffect`.

---

### ❓ Follow-up Interview Questions

1. Do both `useEffect` and `useLayoutEffect` run before or after the DOM is actually updated?
2. What's the key timing difference between them, relative to the browser's paint?
3. In the `Tooltip` example, why does `useEffect` cause a visible flicker that `useLayoutEffect` doesn't?
4. Why should `useEffect` be the default choice for most side effects?
5. What's the performance risk of overusing `useLayoutEffect`?

---

## 7. What is the difference between `useMemo` and `useCallback`, and when should each actually be used?

### 📖 Introduction

The Components, Event Handling, and Props & State chapters all flagged the "new reference on every render" problem and promised these two Hooks as the fix. Here's exactly how each one works, and how they relate to each other.

---

### 🧮 `useMemo` — Memoizing a Computed Value

`useMemo` takes a function that calculates something, plus a dependency array. React only re-runs that calculation when a dependency actually changes; on every other render, it just returns the previously computed value.

```jsx
const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0); // an expensive calculation
}, [items]);
```

This delivers on the Props & State chapter's mention of caching a genuinely expensive derived value.

---

### 🔧 `useCallback` — Memoizing a Function

`useCallback` returns the *same* function reference across renders, as long as its dependencies haven't changed, instead of creating a brand-new function every time.

```jsx
const handleDelete = useCallback((id) => {
    onDelete(id);
}, [onDelete]);
```

This delivers on the Event Handling and Components chapters' mentions of keeping a stable function reference for a memoized child component.

---

### 🔗 The Precise Relationship: `useCallback` Is Just `useMemo` for Functions

Worth knowing precisely: `useCallback(fn, deps)` is exactly equivalent to `useMemo(() => fn, deps)`. `useCallback` is really just a convenience wrapper around `useMemo`, specialized for the extremely common case of memoizing a function specifically, rather than some other computed value.

---

### 🎯 When Each Should Actually Be Used

- **`useMemo`**: when a calculation is genuinely expensive — processing a large list, complex math — *and* the component re-renders often enough that recalculating every time would actually be wasteful.
- **`useCallback`**: when a function is passed to a child wrapped in `React.memo` (Components chapter) — since a fresh reference every render would otherwise defeat that memoization. If a function isn't passed to a memoized child, or used in some other hook's dependency array, wrapping it in `useCallback` usually provides no real benefit at all.

---

### 💎 Good to Know: These Aren't Free

Both Hooks have their own overhead — comparing dependencies on every render, storing the memoized value. Using either on a cheap calculation or a function that isn't passed to a memoized child can make things slightly slower, not faster, since you're paying for the memoization machinery with no real benefit. Question 13 covers the performance implications of overusing them in more depth.

---

### ❓ Follow-up Interview Questions

1. What does `useMemo` actually memoize — a value, or a function?
2. What does `useCallback` memoize instead?
3. How is `useCallback(fn, deps)` precisely related to `useMemo`?
4. When does wrapping a function in `useCallback` actually provide a real benefit?
5. Why aren't `useMemo` and `useCallback` free to use everywhere, "just in case"?

---

## 8. How does `useRef` work, how does it differ from `useState`, and how does it persist values across renders?

### 📖 Introduction

The Forms chapter already showed `useRef` for accessing a DOM node directly. This question covers the full picture — including a second, very different use case that has nothing to do with the DOM at all.

---

### 🔧 How `useRef` Works: A Persistent, Mutable Object

`useRef(initialValue)` returns a plain object shaped like `{ current: initialValue }`. That object is created exactly once, on the first render, and persists in the component's hooks list (question 3) across every render after that — React hands back the *same* object every time, never recreating it, for as long as the component stays mounted.

---

### 🎯 Two Distinct Use Cases

**1. Accessing a DOM node directly** — attach `ref={myRef}` to a JSX element, and `myRef.current` becomes that element's real DOM node once mounted (Forms chapter).

**2. Storing a plain, mutable value that needs to persist across renders without ever triggering one** — a timer ID, a previous value for comparison, anything a class component might have stored on `this`:

```jsx
function Timer() {
    const intervalRef = useRef(null);

    function startTimer() {
        intervalRef.current = setInterval(() => console.log("tick"), 1000);
    }

    function stopTimer() {
        clearInterval(intervalRef.current);
    }

    return (
        <div>
            <button onClick={startTimer}>Start</button>
            <button onClick={stopTimer}>Stop</button>
        </div>
    );
}
```

`intervalRef.current` holds the actual timer ID between renders — this isn't state, because starting or stopping a timer shouldn't force `Timer` to re-render; it just needs somewhere reliable to store that value between one function call and the next.

---

### ⚖️ `useRef` vs. `useState`, Side by Side

| | `useState` | `useRef` |
|---|---|---|
| Triggers a re-render when changed? | Yes | No |
| How you read the value | Directly, as the state variable | Through `.current` |
| How you update it | Through the setter function | Direct mutation: `ref.current = newValue` |
| Value available immediately after updating? | No — only on the next render | Yes — instantly |

---

### ⚡ The "Immediately Available" Distinction

Since a `useState` setter *schedules* an update rather than applying it synchronously (the batching from the Event Handling chapter), reading the state variable right after calling its setter, on the very next line, still gives you the old value. Mutating `ref.current` directly takes effect immediately — there's no scheduling involved at all, since a ref is just a plain, synchronous, mutable box.

---

### 🗂️ How It Persists Across Renders

A `useRef`'s object is just another hook object stored in the component's persistent hooks list (question 3). On the first render, React creates `{ current: initialValue }` and stores it in that render's slot; on every render after, it hands back that exact same object from the exact same slot — never creating a new one, never resetting `.current`. That's the same underlying mechanism that makes `useState`'s value persist, minus the re-render-triggering part.

---

### 💎 Good to Know: Changing a Ref Never Updates What's on Screen

Since mutating `ref.current` never triggers a re-render, anything that needs to visually update on screen must use state — refs are for values the *component* needs to remember, not values the *user* needs to see change live.

---

### ❓ Follow-up Interview Questions

1. What does `useRef(initialValue)` actually return?
2. What are the two genuinely different use cases for `useRef`?
3. Why doesn't updating `ref.current` cause the component to re-render?
4. Why is a ref's new value available immediately after updating it, while state isn't?
5. Why can't a ref be used for a value that needs to visually update on screen?

---

## 9. What is `useContext`, and how does it compare to prop drilling?

### 📖 Introduction

The Props & State chapter already covered prop drilling and showed `useContext` as one way to avoid it, and the Context API gets its own full dedicated chapter later for the deeper mechanics. This question focuses specifically on `useContext` *as a Hook* — how it behaves within the same Hook mechanics this chapter has been building up.

---

### 🔁 Quick Recap: What `useContext` Does, and the Prop Drilling It Replaces

As covered before: prop drilling means passing data through components that don't use it themselves, purely to reach one that does. `useContext(SomeContext)` lets a deeply nested component read a value directly, without every component in between needing to know about it at all.

---

### 📡 `useContext` Subscribes the Component — Every Change Re-renders Every Consumer

Calling `useContext` doesn't just read a value once — it **subscribes** the calling component to that context. Whenever the Provider's value changes, every component that called `useContext` for that same context re-renders, regardless of whether the specific piece of the value it actually cares about changed. This was flagged as a real performance trade-off in the Props & State chapter, and it gets a full treatment in the Context API chapter.

---

### 🔄 No Dependency Array, No Staleness — Always Reads the Current Value

Unlike `useEffect`, `useMemo`, or `useCallback`, `useContext` doesn't take a dependency array at all. There's no memoization and no staleness concern here — on every single render of the calling component, `useContext` looks up the tree fresh and returns whatever the nearest matching Provider is currently providing, every time.

---

### 📏 `useContext` Still Follows the Rules of Hooks

Like every Hook in this chapter, `useContext` is still bound by the Rules of Hooks from question 2 — it can't be called conditionally, and must be called at the top level of the component, for exactly the same reasons covered there.

---

### 💎 Good to Know: The Full Mechanics Live in Their Own Chapter

Creating a context, structuring Providers, and strategies for avoiding the re-render cost mentioned above (like splitting one large context into several smaller ones) are all covered in full in the Context API chapter.

---

### ❓ Follow-up Interview Questions

1. What does calling `useContext` actually do, beyond just reading a value?
2. If a Provider's value changes, which components re-render as a result?
3. Does `useContext` take a dependency array like `useEffect` does?
4. Is `useContext` exempt from the Rules of Hooks in any way?
5. Which chapter covers the deeper mechanics of Providers and avoiding unnecessary Context re-renders?

---

## 10. What are `useId` and `useImperativeHandle` used for?

### 📖 Introduction

Two more specialized Hooks, each solving a narrow but genuinely real problem — far less commonly needed than the "big five," but worth recognizing.

---

### 🆔 `useId` — Stable, SSR-Safe Unique Identifiers

`useId` generates a stable, unique identifier string, mainly for connecting form elements to their labels through `id`/`htmlFor`.

```jsx
function LabeledInput({ label }) {
    const id = useId();

    return (
        <>
            <label htmlFor={id}>{label}</label>
            <input id={id} />
        </>
    );
}
```

The problem this solves: something naive like `Math.random()` for an id breaks under server-side rendering. When a component renders once on the server (producing the initial HTML) and again on the client (a process called hydration), an id generated differently in each environment causes a "hydration mismatch." `useId` is specifically engineered to produce the exact same id on both the server and the client for the same component instance, avoiding that mismatch entirely.

---

### 🚫 `useId` Is Not for List Keys

`useId` generates one stable id per *component instance*, not a fresh one per list item in a loop. Using it as a `key` when rendering a list (Lists & Keys chapter) would be a mistake — it's built specifically for accessibility attribute connections, not for identifying list items.

---

### 🎛️ `useImperativeHandle` — Customizing What a Ref Exposes

Normally, a ref attached to a custom component exposes nothing by default — refs only work automatically on plain DOM elements, unless the component uses `forwardRef`. `useImperativeHandle`, used alongside `forwardRef`, lets a component control exactly what a parent's ref actually receives, instead of exposing its entire underlying DOM node.

```jsx
const CustomInput = forwardRef(function CustomInput(props, ref) {
    const inputRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus() {
            inputRef.current.focus();
        },
        clear() {
            inputRef.current.value = "";
        },
    }));

    return <input ref={inputRef} {...props} />;
});

function Parent() {
    const customInputRef = useRef(null);

    return (
        <>
            <CustomInput ref={customInputRef} />
            <button onClick={() => customInputRef.current.focus()}>Focus</button>
            <button onClick={() => customInputRef.current.clear()}>Clear</button>
        </>
    );
}
```

Without `useImperativeHandle`, a `forwardRef`-only version would expose the raw `<input>` DOM node itself — every native method and property. With it, `CustomInput` presents a deliberate, limited API (just `focus()` and `clear()`) to whoever holds a ref to it, hiding its actual internal structure.

---

### 🏗️ When You'd Actually Reach for This

Building a reusable component — a `Modal` exposing `.open()`/`.close()` methods, for instance — where you want to offer a controlled, intentional imperative API without letting consumers reach in and manipulate your internal DOM directly.

---

### 💎 Good to Know: Both Are Specialized, Not Everyday Hooks

Most day-to-day React code won't reach for either of these often. But recognizing exactly what problem each solves is genuinely useful — both for interviews, and for understanding library code that does use them.

---

### ❓ Follow-up Interview Questions

1. What specific problem does `useId` solve that `Math.random()` doesn't?
2. Why is `useId` the wrong tool for generating keys in a rendered list?
3. What does a ref attached to a custom component expose by default, without `forwardRef`?
4. What does `useImperativeHandle` let a component control?
5. Give a realistic example of when you'd actually want to use `useImperativeHandle`.

---

## 11. What are Custom Hooks, why do we create them, and what makes a good one?

### 📖 Introduction

The Components chapter already showed a Custom Hook as the modern replacement for HOCs and Render Props. This question focuses on what a Custom Hook actually is, mechanically, and what separates a well-designed one from a poorly designed one.

---

### 🪝 What Is a Custom Hook, Precisely?

A Custom Hook is just a regular JavaScript function whose name starts with `use`, that calls one or more other Hooks inside it. That's the entire definition — there's no special React API for "creating" one. It's purely a naming convention that tells React, and the ESLint plugin (question 2), to treat this function like a Hook, subject to the Rules of Hooks.

---

### 🏷️ Why the `use` Prefix Actually Matters, Mechanically

This isn't just a style preference. The `rules-of-hooks` ESLint plugin (question 2) uses the `use` prefix to recognize which functions it should actually check for Hook rule violations. A function that calls Hooks internally but *doesn't* start with `use` won't be recognized as a Hook by that plugin — meaning it could violate the Rules of Hooks with no warning at all, since an ordinary helper function is allowed to call other functions conditionally.

---

### 🎯 Why We Create Them

To extract and reuse stateful logic between components (question 1's original motivation) — as a plain function call, with no wrapper component and no render-prop indirection required.

---

### 🔍 A Fresh Example: `useLocalStorage`

```jsx
function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

function Settings() {
    const [theme, setTheme] = useLocalStorage("theme", "light");
    return <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme}</button>;
}
```

`Settings` uses `useLocalStorage` exactly the way it would use `useState` — the same `[value, setValue]` shape — but gets automatic persistence for free, without needing to know how that persistence actually works underneath.

---

### ✅ What Makes a Good Custom Hook

- **Does one thing, clearly.** `useLocalStorage` has exactly one job — sync a piece of state with `localStorage` — mirroring the single-responsibility principle from the Components chapter.
- **Returns a consistent, predictable shape** — often mirroring a built-in Hook's own convention (like `[value, setter]`) when conceptually similar, making it feel immediately familiar.
- **Hides the messy parts behind a simple interface.** The caller never needs to know about `JSON.parse`, `JSON.stringify`, or `localStorage.getItem`/`setItem` directly.
- **Composable.** A good Custom Hook is often built by combining several other Hooks — built-in or custom — and can itself be used inside yet another Custom Hook, with no special ceremony. It's all just functions calling functions.

---

### 💎 Good to Know: Name It by What It Does, Not How It Works

A good Custom Hook name describes what it provides — `useLocalStorage`, `useDebounce` — rather than how it's implemented internally. That keeps its public API stable and meaningful even if the internal implementation changes later.

---

### ❓ Follow-up Interview Questions

1. What are the two things that actually make a function a "Custom Hook"?
2. Why does the `use` prefix matter beyond just being a naming convention?
3. What problem does extracting logic into a Custom Hook solve, compared to a Higher-Order Component?
4. In the `useLocalStorage` example, what does `Settings` not need to know or care about?
5. Why should a Custom Hook's name describe what it does rather than how it's implemented?

---

## 12. What are common mistakes developers make when using Hooks, and how can misuse lead to unnecessary re-renders?

### 📖 Introduction

Beyond the Rules of Hooks violations already covered (questions 2 and 4), a few other mistakes show up constantly in real Hook usage — and dependency arrays are the source of most of them.

---

### 🕰️ Mistake 1: Missing a Dependency — Stale Closures

```jsx
function SearchResults({ query }) {
    useEffect(() => {
        fetchResults(query).then(setResults);
    }, []); // ❌ missing `query` — always searches using the very first query, forever
}
```

Since `[]` tells React this effect never needs to re-run, it keeps using whatever `query` was at the time the component first rendered — even after `query` changes on later renders. This is called a **stale closure**, and it's one of the most common real Hook bugs.

---

### 🔁 Mistake 2: An Unstable Object or Function in the Dependency Array

```jsx
function Chat({ roomId }) {
    const options = { roomId }; // ❌ a brand-new object on every render

    useEffect(() => {
        const connection = createConnection(options);
        connection.connect();
        return () => connection.disconnect();
    }, [options]); // "options" looks different every render, so this effect reruns constantly
}
```

Since `options` is a new object reference every render (Components chapter's shallow comparison problem, applied to a dependency array this time), React sees it as "changed" on every single render — causing the effect to disconnect and reconnect constantly, even though `roomId` itself might not have actually changed.

---

### ♾️ Mistake 3: Calling a Setter Directly During Render

```jsx
function Broken() {
    const [count, setCount] = useState(0);
    setCount(count + 1); // ❌ called directly in the component body — infinite loop!
    return <div>{count}</div>;
}
```

Calling a setter directly in the component body, rather than inside an event handler or an effect, triggers a re-render immediately — which runs the component body again, which calls the setter again, forever. State setters belong inside event handlers or effects, never in the unconditional body of the component itself.

---

### 💎 Good to Know: Overusing `useMemo`/`useCallback` Is Its Own Mistake

As mentioned in question 7, wrapping cheap calculations or functions that never reach a memoized child in `useMemo`/`useCallback` doesn't help — it can even hurt slightly, due to the overhead of the memoization machinery itself. Question 13 covers this in more depth.

---

### ❓ Follow-up Interview Questions

1. What is a "stale closure," and how does a missing dependency cause one?
2. In the `Chat` example, why does the effect reconnect on every single render?
3. What's the fix for an object being recreated fresh on every render inside a dependency array?
4. Why does calling a state setter directly in a component's body cause an infinite loop?
5. Where do state setters actually belong, if not directly in the component body?

---

## 13. What are the performance implications of using `useMemo`/`useCallback` incorrectly?

### 📖 Introduction

Questions 7 and 12 both flagged this as worth its own deeper look. Here's exactly how misusing these two Hooks costs performance, rather than saving it.

---

### 💸 They're Not Free: Comparison Cost and Memory Cost, Every Render

Every single render, React still has to compare each dependency (question 7's comparison mechanism) and continue storing the memoized value or function in memory for as long as the component stays mounted. Both of these carry a real, if usually small, cost — which matters once you look at when that cost buys you nothing in return.

---

### 🐜 Scenario 1: Memoizing Something Trivially Cheap

```jsx
// Overkill — the calculation itself is cheaper than memoizing it
const isEven = useMemo(() => count % 2 === 0, [count]);
```

For a calculation this trivial, the cost of comparing the dependency array and storing the result can end up *more* expensive than simply recalculating `count % 2 === 0` fresh every time. Here, `useMemo` makes things marginally slower, not faster — pure overhead, no benefit.

---

### 🚫 Scenario 2: A Stable Reference Nobody Actually Needs

If a function wrapped in `useCallback` is never passed to a memoized child and never used in another Hook's dependency array, nothing in the app actually benefits from its reference staying stable. The comparison and storage cost is still paid every render, for zero upside.

---

### 📏 Scenario 3: Comparison Cost Scaling With Dependency Count

Reference comparisons themselves are cheap regardless of an object's size — but the cost scales with *how many* dependencies there are to check. A `useMemo` or `useCallback` with a long dependency list, used in a component that re-renders frequently, can accumulate real, measurable overhead simply from repeatedly checking many entries.

---

### 💥 Scenario 4: The Worst Case — Memoized, But Recalculates Every Time Anyway

This is question 12's unstable-dependency mistake, viewed from the performance angle: if a dependency is a fresh object or function on every render, the comparison always reports "changed," so the calculation reruns every single time regardless. You end up paying for the full cost of memoization's bookkeeping *plus* the full cost of recalculating anyway — the worst of both worlds, with none of the intended benefit.

---

### 🎯 The Correct Mental Model: Only With a Specific Reason

Reach for `useMemo`/`useCallback` only when there's a concrete reason: either the calculation is genuinely expensive (measured, not assumed) and re-renders happen often enough for it to matter, or the value/function needs a stable reference because something specific depends on it — a `React.memo`-wrapped child, or another Hook's dependency array. Not as a reflexive, "just in case" habit applied to every value in a component.

---

### 💎 Good to Know: Profile First, Don't Optimize Blindly

Wrapping everything in `useMemo`/`useCallback` "to be safe" adds real code complexity — more dependency arrays to keep correct (question 12's mistakes) — often for a net-negative performance result. Profiling first, with tools covered in the Performance Optimization chapter, is the better approach than optimizing blindly upfront.

---

### ❓ Follow-up Interview Questions

1. What two costs does `useMemo`/`useCallback` carry on every render, regardless of whether they help?
2. Why can memoizing a trivially cheap calculation actually make things slightly slower?
3. What determines whether wrapping a function in `useCallback` provides any real benefit at all?
4. Why is a `useMemo` with an unstable dependency considered the "worst case" for performance?
5. What's the recommended approach instead of wrapping everything in these Hooks by default?

---

## 14. How would you decide whether a piece of logic should be extracted into a Custom Hook?

### 📖 Introduction

Question 11 covered what makes a Custom Hook well-designed once you've built one. This question is about the decision that comes before that — whether to extract it at all.

---

### 🔁 Signal 1: The Same Logic Is Genuinely Needed in Multiple Components

The clearest signal. If the same `useState`/`useEffect` combination keeps getting copy-pasted across components, that's exactly the "reusing stateful logic" problem Hooks were created to solve in the first place (question 1).

---

### 📖 Signal 2: Extracting Improves Readability, Even With Only One User

```jsx
function ProfilePage({ userId }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        function handleResize() { setWindowWidth(window.innerWidth); }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ...render logic using both `user` and `windowWidth`
}
```

```jsx
function ProfilePage({ userId }) {
    const user = useUser(userId);
    const windowWidth = useWindowWidth();
    // ...render logic
}
```

Even if `useWindowWidth` is used nowhere else right now, `ProfilePage`'s own code becomes dramatically easier to scan — each concern reduces to one clearly-named line, with the messy implementation details tucked away where they don't distract from the component's actual job. This mirrors the Components chapter's guidance on splitting large components, applied here to logic instead of markup.

---

### 🧩 Signal 3: Several Hooks Always Need to Travel Together

If a `useEffect`, a `useRef`, and a `useState` always need to work in concert for one conceptual task, bundling them into a single Custom Hook prevents someone from accidentally using one piece without the others it silently depends on.

---

### 🚫 When Not to Extract

If the logic is genuinely simple — one `useState` call, used in exactly one place, with no real complexity — extracting it adds a layer of indirection with no real payoff. Jumping to a separate function just to see a single `useState(initialValue)` line is arguably harder to follow than having it inline. This echoes the Components chapter's "don't over-split" caution, applied here to logic instead of components.

---

### 💎 Good to Know: A Simple Test

Read just a component's first few lines, before its `return` statement. Can you immediately tell what concerns it deals with, without tracing through every individual `useState`/`useEffect` call? If not, that's a sign some of that logic — reused elsewhere or not — would benefit from being extracted into a clearly-named Custom Hook.

---

### ❓ Follow-up Interview Questions

1. What's the most obvious signal that logic should become a shared Custom Hook?
2. How can extracting logic improve readability even if no other component uses it yet?
3. Why might bundling several related Hooks together prevent a subtle bug?
4. Why might extracting a single, simple `useState` call actually hurt readability instead of helping it?
5. What's a quick test for deciding whether a component's logic needs to be extracted?

---

## 15. What are the trade-offs between Hooks and Class Components, and how would you explain the Hooks architecture to someone familiar only with Class Components?

### 📖 Introduction

Question 1 covered three problems Hooks solved. A genuinely balanced, senior-level answer should also name what Hooks made harder — not just what they made easier — and offer a practical way to explain the whole architecture to someone coming from classes.

---

### ✅ What Hooks Genuinely Improved

Briefly, from question 1: reusable stateful logic without HOCs or Render Props, grouping code by concern instead of by lifecycle timing, and no more `this`-binding footguns.

---

### ⚖️ An Honest Trade-off: Dependency Arrays vs. Explicit Lifecycle Comparisons

Class components compared `prevProps` and `prevState` directly inside `componentDidUpdate` — verbose, but fully explicit; nothing hidden. Hooks trade that verbosity for dependency arrays (questions 12 and 13), which are more concise but introduce their own, genuinely new category of bugs — missing dependencies, stale closures, unstable references — that simply didn't exist in the class model. This isn't Hooks being strictly better; it's trading one kind of complexity for a different one.

---

### 📚 Another Honest Trade-off: A New, Non-Obvious Mental Model to Learn

Understanding *why* the Rules of Hooks exist (questions 2 through 4) requires understanding a genuinely non-obvious internal mechanism — a persistent, order-dependent list of Hook calls (question 3). A newcomer to React doesn't need to understand anything like that to use `this.state`/`this.setState()` in a class, even though classes come with their own `this`-related pitfalls. Hooks don't eliminate complexity so much as relocate it.

---

### 🗺️ Explaining Hooks to a Class-Component Developer

A genuinely useful framing: a class bundles several different jobs into one object, `this` — state, lifecycle timing, instance variables, context access. Hooks split that single, do-everything mechanism into several smaller, individually composable functions, each replacing one specific piece:

- `useState` replaces `this.state` / `this.setState()`.
- `useEffect` replaces `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` *combined* — letting you group by concern instead of by timing.
- `useRef` replaces instance variables you'd have stored directly on `this` (like a timer ID).
- `useContext` replaces `static contextType` or `<Context.Consumer>`.

Each Hook does one job a class used to bundle into a single object — Hooks are that same functionality, unbundled into separate, composable pieces.

---

### ❓ Follow-up Interview Questions

1. What did class components have to do explicitly that dependency arrays replaced with something more concise, but riskier?
2. What non-obvious internal mechanism does a Hooks developer need to understand that a class developer never had to?
3. Is it accurate to say Hooks eliminated complexity, or is it more accurate to say they relocated it? Why?
4. What class feature does `useRef` most directly replace?
5. Using the "unbundling `this`" framing, what does `useEffect` replace, and why is that actually an improvement?

---