---
title: Event Handling
description: Synthetic events, handler patterns, and passing arguments to handlers.
sidebar_position: 5
---

# Event Handling

## 1. How does event handling in React differ from handling events in plain HTML/DOM?

### 📖 Introduction

Attaching a click handler in plain HTML looks a little different from doing it in React — and a few of those differences trip up almost everyone the first time they see them.

---

### 🔤 Syntax: camelCase and Passing a Function Reference

```html
<!-- Plain HTML -->
<button onclick="handleClick()">Click me</button>
```

```jsx
// React
<button onClick={handleClick}>Click me</button>
```

Two things changed: the event name is camelCase (`onClick`, not `onclick`) — consistent with the general JSX attribute convention from the JSX chapter — and instead of a *string* of code to evaluate, React expects an actual JavaScript function reference.

---

### ⚠️ The Common Mistake: Calling the Function Instead of Passing It

```jsx
<button onClick={handleClick}>Click</button>   {/* ✅ passes the function itself */}
<button onClick={handleClick()}>Click</button> {/* ❌ calls it immediately, during render */}
```

The second version doesn't wait for a click at all — `handleClick()` runs the moment this line is evaluated, while the component is rendering, and whatever it *returns* gets assigned to `onClick` instead of the function itself. This is one of the most common early mistakes with React event handlers.

---

### 🎯 Event Delegation — One Listener, Not Many

Plain DOM code with `addEventListener` typically attaches a separate listener to each individual element. React doesn't do this — it uses **event delegation**, attaching a single listener at a higher level and figuring out which component's handler should run based on where the event actually happened. This gets its own full explanation in question 3.

---

### 📦 Events Get Wrapped in a SyntheticEvent

The event object your handler receives isn't the raw native browser event — React wraps it in something called a **SyntheticEvent**, a consistent, cross-browser wrapper. This is covered in full in question 2.

---

### 💎 Good to Know: Mixing React Events With Native `addEventListener`

Sometimes you still need `addEventListener` directly — for browser APIs React doesn't expose a prop for. It's worth knowing that a listener attached this way (say, inside a `useEffect` on a ref) receives the real, native browser event, not React's SyntheticEvent wrapper — a subtle but real difference if you ever mix the two styles in the same component.

---

### ❓ Follow-up Interview Questions

1. What are the two syntax differences between an HTML `onclick` attribute and a React `onClick` prop?
2. What actually happens if you write `onClick={handleClick()}` instead of `onClick={handleClick}`?
3. Does React attach a separate event listener to every single element with an `onClick`?
4. What is a SyntheticEvent, in one sentence?
5. If you use `addEventListener` directly inside a `useEffect`, does the handler receive a SyntheticEvent or a native event?

---

## 2. What are Synthetic Events, why does React use them, and how do they differ from native DOM events?

### 📖 Introduction

Question 1 mentioned that React wraps the browser's native event before handing it to your handler. Here's the full picture of what that wrapper actually is, and why React bothers with it at all.

---

### 📦 What Is a SyntheticEvent?

A **SyntheticEvent** is an object React creates around the browser's native event, with a consistent, standardized API. Whatever `event` your handler receives — `event.target`, `event.preventDefault()` — is a SyntheticEvent instance, not the raw native `Event` object the browser itself produced.

---

### 🌍 Why Does React Use Them?

- **Cross-browser consistency.** When React was first created, different browsers genuinely disagreed on parts of their event APIs. Wrapping every event in a standardized object meant your code behaved the same way everywhere, without needing browser-specific workarounds.
- **It enables event delegation.** Since React attaches one central listener rather than one per element (question 3), it needs its own event object it fully controls, rather than being tied directly to exactly how the browser's native event system behaves.

---

### 🔍 Accessing the Real Native Event

A SyntheticEvent mirrors the interface you'd expect — `.target`, `.preventDefault()`, `.stopPropagation()` — so it feels familiar. If you genuinely need the actual underlying browser event for some reason, it's available through `event.nativeEvent`:

```jsx
function handleClick(event) {
    console.log(event);            // SyntheticEvent
    console.log(event.nativeEvent); // the real, underlying browser Event
}
```

---

### 💎 Good to Know: This Wasn't Always a Simple Wrapper

Older versions of React (before version 17) reused and reset SyntheticEvent objects for performance reasons — a behavior called **event pooling**, which meant a SyntheticEvent's fields could turn into `null` if you accessed them asynchronously. That behavior no longer exists in modern React — question 8 of this chapter covers exactly what changed, and why.

---

### ❓ Follow-up Interview Questions

1. What is a SyntheticEvent, and how does it relate to the browser's actual native event?
2. What real problem did SyntheticEvents originally solve, given the state of browsers when React was created?
3. Why does event delegation require React to have its own event object?
4. How would you access the real, underlying native event from inside a React event handler?
5. What historical behavior of SyntheticEvents no longer exists in modern React?

---

## 3. How does event delegation work in React, and why does React attach listeners this way?

### 📖 Introduction

Both previous questions in this chapter pointed toward this one. Here's the actual mechanism: how React manages to handle every `onClick` in your app without attaching a separate listener for each one.

---

### 🌊 What Is Event Delegation?

**Event delegation** is a general technique: instead of attaching a listener to every individual element that might be interacted with, you attach one listener higher up the tree, and rely on **event bubbling** — the fact that an event fired on a child element travels ("bubbles") up through its ancestors — to catch it there instead. You then figure out which specific element was actually clicked using `event.target`.

---

### ⚛️ How React Implements It: One Listener Per Event Type

React attaches a single native listener for each type of event your app actually uses (one for all clicks, one for all changes, and so on) — at the root DOM container your app is mounted into, not on every individual element with an `onClick`.

```jsx
function App() {
    return (
        <div>
            <button onClick={() => console.log("Button 1")}>Button 1</button>
            <button onClick={() => console.log("Button 2")}>Button 2</button>
        </div>
    );
}
```

Even with two separate `onClick` handlers here, React doesn't attach two native listeners. There's one shared "click" listener at the root. When either button is clicked, the event bubbles up to that one listener, and React uses its own internal knowledge of the component tree to figure out exactly which `onClick` to actually call — wrapping the event in a SyntheticEvent (question 2) along the way.

---

### 🚀 Why React Does This

- **Performance and memory.** Attaching a separate native listener for every interactive element in a large app adds up. One shared listener per event type is far more efficient, especially as the number of interactive elements grows.
- **Simplifies components mounting and unmounting.** Since the real listener lives at the root and never moves, React doesn't need to touch the actual DOM's event registrations every time a component with a handler mounts or unmounts — it only needs to update its own internal bookkeeping of which component currently owns which handler, which is far cheaper than manipulating real listeners constantly.
- **Supports the rest of React's event system.** This shared entry point is what makes consistent SyntheticEvent behavior and batching multiple state updates within a single event (question 10) possible in the first place.

---

### 💎 Good to Know: Where the Root Listener Actually Lives Changed in React 17

Historically, this one shared listener was attached to `document` itself. Since React 17, it moved to the actual DOM container the app is rendered into. Question 9 covers exactly why that change was made.

---

### ❓ Follow-up Interview Questions

1. What is event bubbling, and how does event delegation rely on it?
2. In the two-button example, how many native "click" listeners does React actually attach?
3. How does React figure out which specific `onClick` handler to call when a click bubbles up?
4. Why does this approach make mounting and unmounting components cheaper?
5. Where was React's root event listener historically attached, and where does it live now?

---

## 4. What is the difference between `preventDefault()` and `stopPropagation()`, and when do you use each?

### 📖 Introduction

Two methods available on every event object, with names similar enough to get confused — but they stop two completely different things.

---

### 🛑 `preventDefault()` — Stopping the Browser's Own Default Behavior

Certain elements have a default action the browser performs automatically: clicking a link navigates to a new page; submitting a form triggers a full page reload. `preventDefault()` cancels that automatic behavior.

```jsx
function LoginForm() {
    function handleSubmit(event) {
        event.preventDefault(); // stop the browser's default full-page reload
        // ...handle the login with JavaScript instead
    }

    return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

This is exactly why almost every React form calls `preventDefault()` — without it, submitting the form would trigger a full page reload, wiping out the entire React app in the process.

---

### 🚧 `stopPropagation()` — Stopping the Event From Reaching Other Handlers

`stopPropagation()` does something entirely different: it stops the event from continuing to bubble up (or capture down) to other elements' handlers. It has nothing to do with the browser's default behavior.

```jsx
function Modal({ onClose }) {
    function handleModalClick(event) {
        event.stopPropagation(); // don't let this click reach the overlay's handler
    }

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal-content" onClick={handleModalClick}>
                {/* clicking inside the modal shouldn't close it */}
            </div>
        </div>
    );
}
```

Without `stopPropagation()`, clicking anywhere inside `modal-content` would bubble up to the surrounding `overlay`'s `onClick`, incorrectly closing the modal even for clicks that were never meant to close it.

---

### ⚖️ Side by Side

| | `preventDefault()` | `stopPropagation()` |
|---|---|---|
| What it stops | The browser's built-in default action | The event reaching other handlers via bubbling/capturing |
| Typical use case | Stopping a form's page reload, or a link's navigation | Stopping a click inside a modal from also triggering an outer overlay's handler |
| Does it affect the other one? | No | No |

---

### 💎 Good to Know: They're Completely Independent

This is a common point of confusion worth stating plainly: calling `preventDefault()` does **not** also stop propagation, and calling `stopPropagation()` does **not** also prevent the default action. You can call one, the other, both, or neither — depending on exactly what you need to stop.

---

### ❓ Follow-up Interview Questions

1. Why does a React form's submit handler almost always call `preventDefault()`?
2. In the `Modal` example, what would happen if `stopPropagation()` were removed?
3. Does calling `preventDefault()` also stop an event from bubbling up to a parent's handler?
4. Does calling `stopPropagation()` also cancel the browser's default action for that element?
5. Give one real example each of when you'd reach for `preventDefault()` versus `stopPropagation()`.

---

## 5. What is the difference between event bubbling and event capturing, and how do you handle the capture phase in React?

### 📖 Introduction

Question 3 mentioned bubbling briefly. Here's the fuller picture — bubbling has a lesser-known counterpart, capturing, and React gives you a specific way to hook into it.

---

### 🌊 The Three Phases of a DOM Event

Every event actually travels through three phases:

```text
document
  └── outer div
        └── inner div
              └── button (clicked!)

1. Capturing: document → outer div → inner div → button (travels down)
2. Target: the event reaches the button itself
3. Bubbling: button → inner div → outer div → document (travels back up)
```

1. **Capturing** — the event starts at the root and travels *down* toward the target, passing through each ancestor.
2. **Target** — the event reaches the actual element that was interacted with.
3. **Bubbling** — the event travels back *up*, through the same ancestors, in reverse.

---

### ⬆️ React's Default: Handlers Fire on the Bubbling Phase

A regular `onClick` in React attaches to the bubbling phase — your handler runs as the event travels back up, after it's already reached its target.

---

### ⬇️ Handling the Capture Phase: The "Capture" Suffix

React provides capture-phase versions of its event props, with "Capture" appended to the name — `onClickCapture`, `onChangeCapture`, and so on:

```jsx
function Outer() {
    return (
        <div
            onClickCapture={() => console.log("Outer capture")}
            onClick={() => console.log("Outer bubble")}
        >
            <button onClick={() => console.log("Button clicked")}>Click</button>
        </div>
    );
}
```

Clicking the button logs, in this exact order:

1. `"Outer capture"` — during the downward capturing phase, before the event even reaches the button.
2. `"Button clicked"` — the target phase.
3. `"Outer bubble"` — during the upward bubbling phase, after the target.

---

### 🎯 When Would You Actually Use a Capture Handler?

This is rare in everyday code, but it's useful when you need to intercept an event *before* any child gets a chance to handle it — or before a child can stop it from bubbling. A common case is global logging or analytics that must always fire, regardless of whether some deeply nested component later calls `stopPropagation()` during the bubble phase.

---

### 💎 Good to Know: `stopPropagation()` During Capture Blocks Everything After It

Since `stopPropagation()` (question 4) stops an event at whatever phase it's currently in, calling it inside a capture handler prevents the event from ever reaching the target *or* the bubbling phase — not just from bubbling further, but from continuing downward at all.

---

### ❓ Follow-up Interview Questions

1. What are the three phases every DOM event travels through?
2. Which phase does a regular React `onClick` attach to by default?
3. What suffix does React use for capture-phase event props?
4. In the `Outer` example, why does "Outer capture" log before "Button clicked"?
5. What happens if `stopPropagation()` is called during the capture phase, rather than during bubbling?

---

## 6. What is the difference between `event.target` and `event.currentTarget`?

### 📖 Introduction

These two often point to the exact same element — which is precisely why the difference is easy to miss, until you hit a case where they genuinely diverge.

---

### 🎯 `event.target` — What Was Actually Interacted With

`event.target` is the specific element the user actually clicked (or otherwise interacted with) — the original source of the event.

---

### 📌 `event.currentTarget` — Whose Handler Is Running Right Now

`event.currentTarget` is the element that the *currently executing* handler is attached to — whichever element "owns" the handler that's running at this moment.

---

### 🌊 Where They Diverge: Bubbling From a Nested Child

```jsx
function ButtonGroup() {
    function handleClick(event) {
        console.log("target:", event.target);               // whatever was actually clicked
        console.log("currentTarget:", event.currentTarget);   // always the <div> below
    }

    return (
        <div onClick={handleClick}>
            <button>
                <span>Click me</span>
            </button>
        </div>
    );
}
```

If the user clicks directly on the `<span>` text, `event.target` is that specific `<span>`. But since `onClick` is attached to the outer `<div>`, and the click bubbles (question 5) up to it, `event.currentTarget` is always the `<div>` — regardless of which nested element was actually clicked.

---

### 🛠️ A Practical Use Case for `currentTarget`

This matters most with the event delegation pattern from question 3 — when one handler sits on a parent and needs a reliable reference to that parent itself, no matter which specific child triggered the click. Reading a `data-*` attribute set on the parent container, rather than on whatever nested element happened to be clicked, is a common example.

---

### 💎 Good to Know: `currentTarget` Becomes Unreliable in Async Code

This is a subtle, still-current gotcha, separate from the old event-pooling behavior (questions 2 and 8). `event.currentTarget` is only meaningful while the handler is synchronously running — access it after an `await` or inside a `setTimeout`, and it will already be `null`, since "whichever element's handler is currently running" stops making sense once the handler has already finished. `event.target`, by contrast, remains valid even in that same async callback.

---

### ❓ Follow-up Interview Questions

1. What does `event.target` represent?
2. What does `event.currentTarget` represent?
3. In the `ButtonGroup` example, why can `event.target` be the `<span>` while `event.currentTarget` is the `<div>`?
4. Why is `event.currentTarget` a good fit for reading data attached to a parent in an event delegation pattern?
5. What happens if you try to read `event.currentTarget` inside a `setTimeout` callback?

---

## 7. How do you pass extra arguments to an event handler without invoking it prematurely during render?

### 📖 Introduction

Question 1 showed the mistake of writing `onClick={handleClick()}` — calling the function immediately, during render. This question covers the related, very common need: passing *extra* data into a handler, like which specific item in a list was clicked, without falling into that same trap.

---

### ❌ The Problem: You Can't Just Call the Function With Arguments

```jsx
<button onClick={handleDelete(todo.id)}>Delete</button> {/* ❌ */}
```

This calls `handleDelete(todo.id)` immediately, during render — exactly the mistake from question 1 — and whatever it *returns* (usually `undefined`) gets assigned to `onClick` instead of a real function. Clicking the button does nothing at all.

---

### ✅ Solution: Wrap It in an Arrow Function

```jsx
function TodoList({ todos, onDelete }) {
    return (
        <ul>
            {todos.map((todo) => (
                <li key={todo.id}>
                    {todo.text}
                    <button onClick={() => onDelete(todo.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}
```

`() => onDelete(todo.id)` is itself a brand-new function — *that* is what gets passed to `onClick`, not the result of calling `onDelete`. React holds onto this new function and only calls it when the button is actually clicked, and only then does `onDelete(todo.id)` actually run, with the correct `id` for that specific item.

---

### 🕰️ An Older Alternative: `.bind()`

```jsx
<button onClick={onDelete.bind(null, todo.id)}>Delete</button>
```

`.bind()` returns a new function with `todo.id` already "pre-filled" as its first argument — functionally similar to the arrow function version. This style shows up more often in older, class-component-era code than in current React.

---

### 💎 Good to Know: This Creates a New Function on Every Render

Both approaches above create a brand-new function every single time the component renders. Per the Components chapter's discussion of shallow comparison, this means if this button (or a component wrapping it) were memoized with `React.memo`, that new function reference would still register as "changed" on every render, defeating the memoization. When that actually matters — typically in a large list with genuinely expensive child components — `useCallback` (covered in the Hooks and Performance Optimization chapters) is the tool that solves it.

---

### ❓ Follow-up Interview Questions

1. What goes wrong if you write `onClick={handleDelete(todo.id)}` directly?
2. Why does wrapping the call in an arrow function fix the problem?
3. What is `.bind()` doing differently from an arrow function, and where does this pattern more commonly show up?
4. What performance downside do both of these approaches share?
5. What tool exists specifically to address that downside, when it actually matters?

---

## 8. What is event pooling, and is it still relevant in modern versions of React?

### 📖 Introduction

Questions 2 and 6 both referenced this briefly. Here's the full history — and why it no longer matters today, plus how it differs from a similar-looking but unrelated gotcha from question 6.

---

### ♻️ What Was Event Pooling?

In versions of React before 17, SyntheticEvent objects were **pooled** — reused across many different events rather than freshly created every time, as a performance optimization. Right after your handler finished running synchronously, React reset every field on that event object to `null`, so the same object could be recycled for whatever event happened next.

---

### 💥 The Problem It Caused

If you tried to access the event asynchronously — inside a `setTimeout`, after an `await`, in a Promise's `.then()` — the object might already have been reset and reused for a completely different event by the time your async code ran:

```jsx
// Old React (before version 17)
function handleChange(event) {
    setTimeout(() => {
        console.log(event.target.value); // ❌ null — the event object was already recycled
    }, 1000);
}
```

The workaround at the time was calling `event.persist()`, which told React not to recycle that specific event object.

---

### ✅ Removed in React 17: No More Pooling

Event pooling was removed entirely starting in React 17. SyntheticEvents now behave like ordinary JavaScript objects — no resetting, no recycling:

```jsx
// Modern React
function handleChange(event) {
    setTimeout(() => {
        console.log(event.target.value); // ✅ works fine — no pooling anymore
    }, 1000);
}
```

`event.persist()` still exists for backward compatibility, but it's now a no-op — there's no pooling left to opt out of.

---

### 💎 Good to Know: Don't Confuse This With Question 6's `currentTarget` Gotcha

These look similar but are genuinely different issues. Event pooling was about the *entire* event object being reset and reused — a historical problem, fully gone since React 17. The `event.currentTarget` becoming `null` in async code (question 6) is a separate, still-current behavior that has nothing to do with pooling — `currentTarget` is deliberately cleared once synchronous handling ends, by design, because "whichever element's handler is currently running" stops being a meaningful concept the moment the handler finishes. So: `event.target` used to be unreliable in async code before React 17, but is fine today; `event.currentTarget` was never reliably accessible asynchronously, and still isn't, for an entirely unrelated reason.

---

### ❓ Follow-up Interview Questions

1. What did event pooling actually do to SyntheticEvent objects?
2. Why did accessing an event inside a `setTimeout` sometimes fail in older React?
3. What did calling `event.persist()` used to do, and what does it do today?
4. In which React version was event pooling removed?
5. Why is the `currentTarget` gotcha from question 6 a completely different issue from event pooling, even though both involve async code?

---

## 9. What changed in React 17's event system, and why?

### 📖 Introduction

Both question 3 and question 8 promised this would be covered fully here. React 17 was explicitly described by the React team as a release with almost no new features — its real focus was making upgrades and gradual adoption safer, and its event system changes are a clear example of that goal.

---

### 📍 Change 1: The Root Listener Moved From `document` to Your App's Container

Before React 17, the single delegated listener from question 3 was attached to the global `document` object, for the entire page. Since React 17, it's attached to the actual root DOM container your app is rendered into instead.

This change was specifically about safely embedding React within a larger page — for example, a legacy server-rendered page migrating to React gradually, where different sections might run different versions of React at once. If every version attached its listener to the same shared `document`, their event handling could interfere with each other. By having each React root attach its own listener to its own container, multiple React roots — even different versions — can coexist on the same page without stepping on each other's events.

---

### 🧹 Change 2: Event Pooling Was Removed

Covered fully in question 8 — SyntheticEvents stopped being reset and recycled after each handler ran, so they behave like ordinary objects, safe to access even asynchronously.

---

### 🔧 Change 3: A Few Native Event Behaviors Became More Accurate

React 17 also adjusted a handful of specific event behaviors to match what browsers actually do natively, rather than React's own historically simulated behavior — for example, `onScroll` no longer bubbles in React, matching the fact that scroll events never bubbled natively in the browser to begin with.

---

### 🎯 Why These Changes Matter: Easier Incremental Adoption

The two big changes here — moving off the shared `document`, and removing pooling — both point toward the same underlying goal: making React safer to adopt gradually inside a larger, mixed, or multi-version application, rather than adding new capabilities to React itself.

---

### ❓ Follow-up Interview Questions

1. Where was React's delegated event listener attached before React 17, and where is it attached now?
2. Why does moving the listener off the shared `document` matter for pages running multiple versions of React at once?
3. What was React 17's stated overall focus, compared to typical major releases?
4. Besides the listener location and event pooling, name one smaller event behavior change in React 17.
5. What underlying goal connects all of React 17's event system changes?

---

## 10. How do event handlers interact with batching and trigger re-renders?

### 📖 Introduction

If you call two different state setters inside the same click handler, does React re-render twice, or once? This is what batching is about, and event handlers are the clearest place to see it in action.

---

### 📦 What Is Batching?

**Batching** is React's optimization of grouping multiple state updates that happen within the same event into a single re-render, instead of re-rendering separately after each individual `setState` call.

```jsx
function Counter() {
    const [count, setCount] = useState(0);
    const [flag, setFlag] = useState(false);

    function handleClick() {
        setCount(count + 1); // schedules an update
        setFlag(!flag);       // schedules another update
        // React batches both — Counter re-renders once, not twice
    }

    console.log("Rendered"); // logs once per click, not twice

    return <button onClick={handleClick}>{count} {flag ? "yes" : "no"}</button>;
}
```

Even though `setCount` and `setFlag` are two separate calls, React doesn't re-render after each one individually — it waits until `handleClick` finishes running, then applies both updates together and re-renders exactly once.

---

### 🎯 Why This Matters

Without batching, two setter calls would mean two separate rounds of rendering and committing for what's conceptually one user action — wasteful, and it could even risk the user briefly seeing an incomplete, in-between state. Batching guarantees the screen updates once, reflecting the full, final result of everything that happened during that one event.

---

### 🕰️ React 18: Batching Became "Automatic" Everywhere

Before React 18, this batching only reliably happened inside React's own event handlers. State updates inside a `setTimeout`, a native Promise `.then()`, or a plain native (non-React) event listener were *not* batched — each setter call in those contexts triggered its own separate re-render:

```jsx
function handleClick() {
    setTimeout(() => {
        setCount((c) => c + 1); // before React 18: not batched
        setFlag((f) => !f);      // before React 18: a separate re-render
    }, 0);
}
```

Since React 18, batching applies almost everywhere automatically — including inside `setTimeout` callbacks and Promise handlers — not just inside React's own synthetic event handlers.

---

### 💎 Good to Know: Opting Out With `flushSync`

In rare cases, you genuinely need an update applied immediately rather than batched — for example, needing to read a layout measurement right after a specific state change. `flushSync`, from `react-dom`, forces React to apply an update synchronously instead of batching it. It's an escape hatch worth knowing exists, even though it's rarely needed.

---

### ❓ Follow-up Interview Questions

1. In the `Counter` example, how many times does `Counter` actually re-render after one click?
2. Why is batching multiple updates into one re-render better than re-rendering after each one?
3. Before React 18, were state updates inside a `setTimeout` batched? What about now?
4. What changed about batching specifically in React 18?
5. What tool lets you deliberately opt out of batching when you need an update applied immediately?

---

## 11. What are common mistakes in writing event handlers, and how can they affect performance?

### 📖 Introduction

Beyond the specific mistakes already covered earlier in this chapter, a few other habits show up repeatedly in real codebases — some hurting readability, others genuinely hurting performance.

---

### 🎯 Quick Recap of Mistakes Already Covered

- Calling a handler directly in JSX instead of passing a reference to it (question 1).
- Creating a brand-new function on every render just to pass extra arguments, which can undermine memoization at scale (question 7).

---

### 🧶 Complex Logic Crammed Directly Into JSX

```jsx
// Harder to read
<button onClick={() => {
    const confirmed = window.confirm("Are you sure?");
    if (confirmed) {
        deleteItem(id);
        showToast("Deleted!");
        refreshList();
    }
}}>
    Delete
</button>
```

```jsx
// Cleaner — extracted into a named function
function handleDelete() {
    const confirmed = window.confirm("Are you sure?");
    if (confirmed) {
        deleteItem(id);
        showToast("Deleted!");
        refreshList();
    }
}

<button onClick={handleDelete}>Delete</button>
```

This is the same "avoid complex logic in JSX" principle from the JSX chapter, applied specifically to event handlers — a named function is easier to read, easier to test, and easier to reuse elsewhere.

---

### 🌊 No Debouncing or Throttling for High-Frequency Events

Some events — `onScroll`, `onMouseMove`, or every keystroke in a live search box — fire far more often than a person would expect. Running something expensive, like an API request, on every single one of these can flood the network or the browser with far more work than necessary. The fix is debouncing or throttling the handler, covered fully in the Performance Optimization chapter.

---

### 🏭 One Closure Per Row Instead of One Shared Handler

In a large list, writing a separate inline arrow function for every single row — one per item, to capture that item's specific ID — creates a new function closure for every row, on every render. Even though React's own internal event delegation (question 3) still uses just one native listener regardless, having a single shared handler that reads which row was clicked from `event.currentTarget` (question 6) — rather than a thousand separate inline closures — is noticeably lighter for a very large list.

---

### 💎 Good to Know: Don't Forget Cleanup for Manually Added Listeners

If you ever attach a native event listener yourself with `addEventListener` (rather than a React prop), forgetting to remove it when the component unmounts causes a memory leak, and can even trigger the handler against stale, unmounted state. This is really a lifecycle concern more than an event-handling one — covered fully in the Lifecycle chapter's discussion of cleanup functions.

---

### ❓ Follow-up Interview Questions

1. Why is extracting complex handler logic into a named function better than writing it all inline in JSX?
2. Why can attaching an expensive operation directly to `onScroll` or `onMouseMove` cause real performance problems?
3. What's the difference between writing one inline arrow function per list row versus one shared handler using `event.currentTarget`?
4. Does React's internal event delegation (question 3) eliminate the cost of writing many separate inline handlers yourself?
5. What real problem can occur if a manually-attached native event listener is never cleaned up?

---

## 12. What are the trade-offs between React's Synthetic Events and native DOM events, especially with third-party libraries?

### 📖 Introduction

Question 2 covered why SyntheticEvents exist. This question looks at the real, practical friction that shows up specifically when React has to coexist with code that doesn't know anything about React's event system at all.

---

### ⚖️ The Core Trade-off, Restated Briefly

SyntheticEvents give consistency and enable delegation (question 2) — but they're a layer React controls, and plenty of real-world code (older libraries, imperative widgets, third-party plugins) works directly with native DOM events instead, completely bypassing that layer.

---

### 🤝 Where Real Friction Shows Up: Third-Party Libraries

Libraries that attach their own listeners directly to DOM elements — bypassing React entirely — create a few genuine points of friction:

- **Surprising event order.** React's delegated listener (question 3) fires as part of the bubbling process at the root, while a native listener attached directly to an element fires based on where it actually sits in the real DOM's capture/bubble order. Mixing the two can produce an order that isn't obvious just from reading the React code.
- **Mismatched event objects.** If third-party code expects a genuine native `Event` and is accidentally handed a SyntheticEvent instead, some native-specific behavior might not line up. `event.nativeEvent` (question 2) is the way to hand off the real thing when needed.

---

### 🕳️ The Sneaky Bug: Native `stopPropagation()` Blocking React Entirely

This is the most confusing case in practice: if a third-party library calls the *native* `event.stopPropagation()` directly on the DOM event, it can prevent the event from ever reaching React's delegated root listener (question 3) at all — since React relies on the event actually bubbling all the way up to where it's listening. The result: a React `onClick` on that same element, or one of its ancestors, mysteriously stops firing — and nothing in the React code itself looks wrong, because the interference is happening entirely outside React's own system.

---

### 🛠️ Practical Guidance: Let Third-Party Code Own Its Own DOM Subtree

The common, pragmatic approach is to use a `ref` (covered in the Hooks chapter) to hand a specific DOM node over to the third-party library, and let it manage that subtree and its own native listeners directly — rather than fighting to force it through React's props and SyntheticEvent system. This creates a small, deliberate boundary where the two systems coexist without stepping on each other.

---

### 💎 Good to Know: A Handler That "Mysteriously Stops Working" Is a Common Symptom

If a click handler suddenly stops firing right after integrating some third-party widget, and nothing about the React code changed, checking whether that widget calls native `stopPropagation()` directly on the DOM is a good first thing to investigate.

---

### ❓ Follow-up Interview Questions

1. Why can mixing native event listeners with React's own event system produce a surprising firing order?
2. How can a third-party library's native `stopPropagation()` call cause a React `onClick` to stop working entirely?
3. Why is this kind of bug particularly hard to track down by reading React code alone?
4. What's the common practical approach for integrating a third-party library that manages its own DOM directly?
5. What's a good first thing to check if a handler mysteriously stops firing after adding a third-party widget?

---

## 13. Explain the complete lifecycle of a React event, from user interaction to UI update.

### 📖 Introduction

This closing question strings together everything from this chapter into one continuous story — from the moment a user clicks something, to the moment they see the result.

---

### 🧭 The Complete Event Pipeline

```text
User interacts (click, keystroke, etc.) — the browser fires a native event
        ↓
The event travels through capture and bubble phases in the real DOM (question 5)
        ↓
It reaches React's single delegated listener at the root (question 3)
        ↓
React wraps the native event in a SyntheticEvent (question 2)
        ↓
React determines which component's handler(s) should run, respecting phase order,
and calls them with the correct event.target / event.currentTarget (question 6)
        ↓
The handler runs synchronously — may call preventDefault() / stopPropagation() (question 4),
and may call one or more state setters
        ↓
React batches every state update that happened during this one event (question 10)
        ↓
Once the handler finishes, React schedules a re-render
        ↓
Render Phase: affected components re-render, and reconciliation diffs the result
(Introduction & Fundamentals chapter)
        ↓
Commit Phase: only the necessary changes are applied to the Real DOM
        ↓
The browser paints — the user sees the updated UI
```

---

### 🔍 Tracing a Real Example

```jsx
function LikeButton() {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(10);

    function handleClick() {
        setLiked(!liked);
        setCount(count + (liked ? -1 : 1));
    }

    return <button onClick={handleClick}>{count} {liked ? "❤️" : "🤍"}</button>;
}
```

1. The user clicks the button — a native click event fires and bubbles up.
2. It reaches React's delegated root listener, which wraps it in a SyntheticEvent.
3. React calls `handleClick`, passing that SyntheticEvent in.
4. `handleClick` calls `setLiked` and `setCount` — both scheduled updates, batched together into one (question 10).
5. React re-renders `LikeButton` exactly once, with both new values applied.
6. Reconciliation compares the new output to the old, finding that only the count text and the emoji actually changed.
7. The Commit Phase updates just those two things in the Real DOM.
8. The browser paints the change — the user sees the updated like count and heart.

---

### ❓ Follow-up Interview Questions

1. What are the main stages between a user's click and React calling the right component's handler?
2. In the `LikeButton` example, why does clicking it only cause one re-render instead of two?
3. What determines exactly what gets changed in the Real DOM after `handleClick` runs?
4. At what point in this pipeline does the user actually see anything change on screen?
5. Which earlier questions in this chapter does each stage of this pipeline draw from?

---