---
title: Props & State
description: Passing data down, managing local state, and the difference between the two.
sidebar_position: 4
---

# Props & State

## 1. What are props and state, and what is the fundamental difference between them?

### 📖 Introduction

Every component needs to work with some kind of data. React gives you two different tools for that — props and state — and they're suited to two genuinely different situations.

---

### 📥 What Are Props?

**Props** are data passed *into* a component from its parent — much like arguments passed into a function. A component receives props and uses them to decide what to render, but it doesn't own them and can't change them itself.

```jsx
function Greeting({ name }) {
    return <h1>Hello, {name}</h1>;
}

<Greeting name="Vaibhav" />
```

`Greeting` has no say in what `name` actually is — it just uses whatever value it was handed.

---

### 🔒 What Is State?

**State** is data a component manages itself, internally. It can change over time — usually in response to something the user does — and the component that owns it is fully in control of when and how it changes.

```jsx
function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

`Counter` owns `count` completely — nothing outside `Counter` can reach in and change it directly.

---

### ⚖️ The Fundamental Difference

| | Props | State |
|---|---|---|
| Where it comes from | The parent component | The component itself |
| Who can change it | Only the parent, by passing new props | The component itself, through its own setter |
| A useful analogy | A function's parameters | A function's own persistent, internal variables |
| From this component's view | Read-only | Fully owned |

---

### 💎 Good to Know: The Same Data Can Play Both Roles

Props and state aren't really two separate *kinds* of data — they're two different *roles* the same piece of data can play, depending on which component you're looking from. In the `Greeting` example, `name` is a prop from `Greeting`'s point of view — but wherever it actually came from, it might well be a piece of *state* living in `Greeting`'s parent. Data becomes "state" the moment some component takes ownership of it and can change it; it becomes a "prop" the moment that same data gets handed down to a component that can only read it.

---

### ❓ Follow-up Interview Questions

1. Where does a prop's value actually come from?
2. Who is allowed to change a component's own state?
3. What's a useful analogy for props, borrowed from plain JavaScript functions?
4. Can a component change a prop it receives? Why or why not?
5. How can the exact same piece of data be considered "state" in one component and a "prop" in another?

---

## 2. Are props mutable or immutable, and why does that matter?

### 📖 Introduction

Question 1 mentioned that props are read-only from the receiving component's perspective. This question digs into *why* that rule exists, and what actually goes wrong when it's broken — beyond the obvious "the parent's data changes too" issue.

---

### 🔒 Props Are Meant to Be Treated as Read-Only

JavaScript itself doesn't stop you from reaching into a prop and changing it — objects and arrays are always technically mutable unless deliberately frozen. But React's entire programming model *assumes* you never will. Props are meant to be treated as **immutable**, even though nothing at the language level physically enforces it.

---

### 💥 What Happens When You Mutate a Prop Anyway

```jsx
function ProductList({ products }) {
    function markAllOnSale(percentage) {
        products.forEach((p) => {
            p.price = p.price * (1 - percentage); // ❌ mutating in place
        });
    }
    // ...
}
```

This doesn't just risk affecting other components sharing that same object (as shown in the Components chapter). It also breaks something more fundamental: `React.memo`'s shallow comparison (from the Components chapter) checks whether `products` is a *different reference* to decide whether to re-render. Since this code mutates the same array in place rather than creating a new one, `products` is still the exact same reference before and after — so any component memoized based on it will conclude "nothing changed" and skip re-rendering, even though the actual prices displayed should now be different.

---

### 🎯 Why This Rule Actually Matters

- **Predictability.** If any component could freely reach in and change data it doesn't own, you could no longer trust a piece of data just by knowing which component defined it — you'd have to search the whole codebase for anywhere it might secretly be mutated. This is the same reasoning behind React's one-way data flow, from the Introduction & Fundamentals chapter.
- **React's own optimizations depend on it.** As shown above, `React.memo`, `useMemo`, and reconciliation itself all rely on comparing an old value to a new one to detect change. Mutating data in place makes "old" and "new" the exact same reference, hiding the change from every one of these mechanisms.
- **Debugging tools depend on it too.** Tools like React DevTools rely on being able to inspect a meaningful snapshot of past props and state. Mutating data in place quietly overwrites what "the previous version" even looked like, making that kind of inspection unreliable.

---

### 💎 Good to Know: The Fix Is to Create Something New, Not Change What Exists

Instead of mutating `products` directly, the correct approach is to build a *new* array with the updated values (for example, using `.map()` to return new objects rather than changing existing ones). The full set of patterns for doing this safely — especially for nested data — is covered in questions 5 and 6 of this chapter.

---

### ❓ Follow-up Interview Questions

1. Does JavaScript itself prevent you from mutating a prop? What actually enforces the "don't mutate props" rule?
2. In the `ProductList` example, why does `React.memo` fail to notice that the prices actually changed?
3. Why does mutating shared data make a codebase harder to reason about?
4. Which React optimizations specifically rely on being able to compare old and new references?
5. What's the general fix for updating prop-derived data without mutating it directly?

---

## 3. What is prop drilling, why is it a problem, and what are the common ways to avoid it?

### 📖 Introduction

Sometimes a piece of data needs to reach a component several levels deep in the tree — but every component along the way has no actual use for it, and only exists to pass it further down. This is prop drilling.

---

### 🕳️ What Is Prop Drilling?

```jsx
function App() {
    const [user, setUser] = useState({ name: "Vaibhav" });
    return <Layout user={user} />;
}

function Layout({ user }) {
    return <Sidebar user={user} />; // Layout never actually uses `user`
}

function Sidebar({ user }) {
    return <UserProfile user={user} />; // neither does Sidebar
}

function UserProfile({ user }) {
    return <p>{user.name}</p>; // finally, the component that actually needs it
}
```

`user` has to pass through `Layout` and `Sidebar`, even though neither one uses it — they're just drilling it through to reach `UserProfile`.

---

### ⚠️ Why It's a Problem

- **Tedious.** Every intermediate component has to accept and forward the prop, even if it never touches it.
- **Fragile to change.** Renaming the prop, or adding a new piece of data that also needs to reach deep, means touching every component in the chain — not just the two that actually care about the data.
- **Hurts readability.** Looking at `Sidebar` in isolation, it's not obvious *why* it receives a `user` prop it never uses — understanding that requires tracing all the way down the tree.
- **Creates unnecessary coupling.** `Sidebar` becomes tied to something completely irrelevant to its own job, purely because of where it happens to sit in the tree.

---

### 🛠️ Common Ways to Avoid It

**The Context API** lets a deeply nested component read a value directly, without every component in between needing to know about it at all (full depth in the Context API chapter):

```jsx
const UserContext = createContext();

function App() {
    const [user, setUser] = useState({ name: "Vaibhav" });
    return (
        <UserContext.Provider value={user}>
            <Layout />
        </UserContext.Provider>
    );
}

function UserProfile() {
    const user = useContext(UserContext);
    return <p>{user.name}</p>;
}
```

Now `Layout` and `Sidebar` don't need to mention `user` anywhere.

**Component composition** (from the Components chapter) is another option — pass the already-rendered component down through `children`, so the components in between just render whatever they're given, without needing to know what it is:

```jsx
function App() {
    const [user, setUser] = useState({ name: "Vaibhav" });
    return (
        <Layout>
            <UserProfile user={user} />
        </Layout>
    );
}

function Layout({ children }) {
    return <Sidebar>{children}</Sidebar>;
}
```

**A state management library** (Redux, Zustand — covered in the State Management chapter) is the usual choice for data needed widely across an app — any component can read what it needs directly from a shared store, without threading it through props at all.

---

### 💎 Good to Know: Not All Prop Drilling Needs to Be "Fixed"

Drilling through just one or two levels is usually completely fine, and reaching for Context prematurely can introduce its own complexity — every component that reads from a Context re-renders whenever that Context's value changes, which is a real trade-off covered in the Context API chapter. The problem worth solving is drilling through *many* levels, or drilling something that changes frequently.

---

### ❓ Follow-up Interview Questions

1. In the `Layout`/`Sidebar`/`UserProfile` example, which components are "drilling" a prop they never actually use?
2. Why does prop drilling make a codebase more fragile to refactor?
3. How does the Context API let you skip the components in between?
4. How does component composition solve the same problem without using Context at all?
5. Is prop drilling always something that needs to be fixed? Why or why not?

---

## 4. What is "lifting state up," and when should you do it versus keeping state colocated?

### 📖 Introduction

The Introduction & Fundamentals chapter briefly mentioned this idea when a child needed to affect data owned by a parent. Here's the full picture — including its natural counterpart, keeping state as local as possible.

---

### ⬆️ What Is "Lifting State Up"?

When two or more sibling components need to share, or stay in sync with, the same piece of data, the fix is to move that state up to their closest common parent — which then passes the data (and a way to update it) down to both as props.

```jsx
function TemperatureConverter() {
    const [celsius, setCelsius] = useState(0);

    return (
        <>
            <CelsiusInput value={celsius} onChange={setCelsius} />
            <FahrenheitInput
                value={celsius * 9 / 5 + 32}
                onChange={(f) => setCelsius((f - 32) * 5 / 9)}
            />
        </>
    );
}
```

Neither `CelsiusInput` nor `FahrenheitInput` holds its own independent number — the actual value lives in their shared parent, `TemperatureConverter`, so both stay automatically in sync no matter which one the user types into.

---

### 🤔 Why This Is Necessary for Shared Data

If `CelsiusInput` and `FahrenheitInput` each held their own separate local state instead, there would be no reliable way to keep them synchronized — you'd need some extra mechanism for one to notify the other of a change, which is really just lifting the state up anyway, done manually and awkwardly. Moving the state to the shared parent is the direct, natural solution.

---

### 📍 What Is State Colocation?

**State colocation** is the opposite instinct: keeping a piece of state as close as possible to where it's actually used — in the component that needs it — rather than pushed further up the tree "just in case" something else might need it eventually.

---

### 🎯 The Deciding Question

Ask: *does more than one component actually need this data right now?*

- If only **one** component uses it, and nothing else needs to know about it, keep it colocated there. Lifting it up unnecessarily means the new parent (and everything below it) re-renders more often than it needs to, by default (from the Introduction & Fundamentals chapter) — for no real benefit.
- If **two or more siblings** genuinely need to share or stay synchronized on the same data, lift it to their closest common parent — that's the only way they can actually share it directly, short of Context or a shared store (question 3).

---

### 💎 Good to Know: Don't Lift State Higher Than Necessary

Lifting everything up to the very top of the app "just in case" is itself a common mistake — it makes the top-level component re-render constantly, and makes it much harder to trace which piece of state actually belongs to which part of the UI, since everything ends up dumped in one place. The right amount of lifting is: as high as necessary, but no higher — stop at the closest common ancestor of the components that actually need to share the data.

---

### ❓ Follow-up Interview Questions

1. In the `TemperatureConverter` example, why don't `CelsiusInput` and `FahrenheitInput` each hold their own separate state?
2. What question should you ask to decide whether a piece of state needs to be lifted up?
3. What's the downside of lifting state higher up the tree than necessary?
4. What is state colocation, and how is it the opposite instinct to lifting state up?
5. If only one component actually uses a piece of state, where should it live?

---

## 5. Why should state be treated as immutable, and what happens if you mutate it directly?

### 📖 Introduction

Question 2 covered why mutating props is dangerous. The same idea applies to state — but here, the consequence is even more immediate and confusing: mutating state directly can mean React never even finds out anything changed.

---

### 🔍 How React Decides Whether State Actually Changed

When you call a state setter, React compares the new value you gave it to the previous one, using reference equality (`===`) for objects and arrays — the same comparison mechanism covered in the Components chapter.

---

### 💥 What Happens When You Mutate State Directly

```jsx
function TodoApp() {
    const [todos, setTodos] = useState([{ text: "Buy milk", done: false }]);

    function toggleTodo(index) {
        todos[index].done = !todos[index].done; // ❌ mutating state directly
        setTodos(todos); // the exact same array reference, just handed back
    }

    return (
        <ul>
            {todos.map((todo, i) => (
                <li key={i} onClick={() => toggleTodo(i)}>
                    {todo.done ? "✅" : "⬜"} {todo.text}
                </li>
            ))}
        </ul>
    );
}
```

Clicking a todo *does* change the data in memory — `todos[index].done` really does flip. But `setTodos(todos)` hands React back the exact same array reference it started with. React checks `todos === todos`, sees they're identical, concludes nothing changed, and may skip re-rendering entirely. The result: the underlying data changed, but the screen doesn't update — a genuinely confusing bug, since a `console.log` of `todos` would show the "updated" value even though nothing visibly changed on screen.

---

### ✅ The Fix: Create a New Value Instead

```jsx
function toggleTodo(index) {
    setTodos(
        todos.map((todo, i) =>
            i === index ? { ...todo, done: !todo.done } : todo
        )
    );
}
```

This builds a brand-new array (and a new object for the one item that changed), so `===` correctly reports "this is different" — and React re-renders as expected.

---

### 💎 Good to Know: This Is Even More Fundamental Than the Props Problem

Question 2's mutated-props example broke `React.memo` — an *opt-in* optimization silently skipping a re-render it should have done. Mutating state directly is more fundamental than that: it can stop the *core* re-render mechanism from firing at all, with no memoization involved anywhere. That's why this particular mistake tends to be even more common — and more confusing to debug — than the props version.

---

### ❓ Follow-up Interview Questions

1. What comparison does React use to decide whether a new state value is actually different?
2. In the `TodoApp` example, why does clicking a todo fail to update the screen?
3. Why would `console.log(todos)` show the "updated" value even though the UI hasn't changed?
4. What does the fixed version of `toggleTodo` do differently to make the update work?
5. Why is mutating state directly considered a more fundamental problem than mutating props?

---

## 6. What are the best practices and common pitfalls when updating nested state?

### 📖 Introduction

Question 5 showed the fix for mutating state directly: create a new value instead. But that fix gets trickier the moment state is nested — an object containing another object, or a list of objects with their own nested fields.

---

### 🪤 The Shallow Copy Trap

```jsx
const [user, setUser] = useState({
    name: "Vaibhav",
    address: { city: "Delhi", pincode: "110001" },
});

function updateCity(newCity) {
    const updated = { ...user }; // only copies the top level
    updated.address.city = newCity; // ❌ still the same nested "address" object!
    setUser(updated);
}
```

`{ ...user }` creates a new top-level object — but `updated.address` still *points to the exact same address object* as before, since spreading only copies one level deep (a "shallow copy"). So `updated.address.city = newCity` mutates the original nested object too, exactly the mistake from question 5, just one level deeper. Even though `user !== updated`, `user.address === updated.address` is still `true` — so anything checking `address` specifically wouldn't detect the change at all.

---

### ✅ The Fix: Spread Every Level That Changed

```jsx
function updateCity(newCity) {
    setUser({
        ...user,
        address: {
            ...user.address,
            city: newCity,
        },
    });
}
```

Now both `user` and `user.address` are genuinely new objects, so anything checking either level correctly sees a real change.

---

### 🛠️ Best Practices for Nested State

- **Only spread the levels that actually changed.** You don't need to deep-clone the entire state tree — just create new copies along the specific path to the value being updated. The untouched parts keeping the same reference is actually a *good* thing, since it lets unrelated memoized components (Components chapter) correctly skip re-rendering.
- **Consider flattening deeply nested state.** If you regularly need three or four levels of nested spreading, that's often a sign the state shape itself could be simpler — separate `useState` calls instead of one large nested object, for example. This connects to the state-structuring questions later in this chapter.
- **Reach for a helper library once nesting gets unwieldy.** Tools like Immer (often used inside Redux Toolkit, covered in the State Management chapter) let you write code that *looks* like direct mutation, while actually producing a correctly immutable update behind the scenes.

---

### ⚠️ Array Methods: Which Are Safe, Which Mutate

| Safe (returns a new array) | Mutates the original array |
|---|---|
| `.map()`, `.filter()`, `.slice()`, `[...arr]` | `.push()`, `.pop()`, `.splice()`, `.sort()`, `.reverse()` |

---

### 💎 Good to Know: `.sort()` and `.reverse()` Are Sneaky

These two look deceptively safe because they *return* the array, tempting you to write `setItems(items.sort(...))` as if it were a clean, functional-style update. But they mutate the array in place and then return that same reference — `items.sort() === items` is `true`. This is one of the easiest traps to fall into, precisely because the code looks like the "correct," non-mutating style.

---

### ❓ Follow-up Interview Questions

1. Why does spreading `{ ...user }` fail to protect `user.address` from being mutated?
2. What's the fix for updating a deeply nested piece of state correctly?
3. Why is it fine — even good — for the untouched parts of a state object to keep the same reference after an update?
4. Which array methods are safe to use on state, and which mutate the original array?
5. Why is `setItems(items.sort(...))` a trap, even though it looks like a clean, functional update?

---

## 7. How does React detect a state change, and what causes a re-render as a result?

### 📖 Introduction

Question 5 touched on reference comparison when discussing mutated objects. This question looks at the comparison mechanism itself more precisely, including a genuinely useful built-in optimization that only shows up with simple, primitive values.

---

### 🔬 How React Compares Old and New State

When you call a state setter, React compares the value you passed to the current one using `Object.is()` — a slightly more precise version of `===` that also correctly handles a couple of edge cases (like `NaN` and `-0`) that `===` gets subtly wrong. For objects and arrays, this is still a reference comparison, exactly as covered in questions 2 and 5 — which is why mutating one in place defeats this check entirely.

---

### 🛑 The Bail-Out: Setting State to the Same Value Skips Re-rendering

Here's the part that's easy to miss: if the new value is considered identical to the current one, React can skip re-rendering that component entirely — even if you correctly called the setter.

```jsx
function Counter() {
    const [count, setCount] = useState(5);

    function handleClick() {
        setCount(5); // setting it to the exact same value it already holds
    }
    // clicking this doesn't cause Counter to re-render — 5 and 5 compare as equal
}
```

This only applies to primitive values like numbers, strings, and booleans, since a fresh object or array literal (`setUser({ ...user })`) is always a *new* reference, even if every property inside it looks identical — and a new reference is never equal to the old one.

---

### 🔁 What Happens Once a Genuine Change Is Detected

Once React confirms the value has genuinely changed, everything from the Introduction & Fundamentals chapter kicks in: the component re-renders, and by default, so do its children — the full set of re-render triggers (a component's own state changing, its parent re-rendering, or a subscribed context value changing) is covered there in detail.

---

### 💎 Good to Know: Why `Object.is()` Instead of Plain `===`

`===` has two well-known quirks: `NaN === NaN` is `false` (even though they're "the same" value), and `-0 === 0` is `true` (even though they're technically different values in JavaScript). `Object.is()` corrects both of these. It's a small detail, but it's exactly the kind of precise distinction that separates a surface-level answer from a genuinely accurate one in an interview.

---

### ❓ Follow-up Interview Questions

1. What comparison function does React actually use to check if state has changed — `===`, or something else?
2. What happens if you call a state setter with the exact same primitive value it already holds?
3. Why doesn't this bail-out behavior apply to objects or arrays, even if their contents look identical?
4. Once React does detect a genuine change, which chapter covers what happens next in full?
5. Name one specific edge case where `Object.is()` behaves differently from `===`.

---

## 8. When should data live in props vs. state vs. be derived instead of stored at all?

### 📖 Introduction

A very common mistake is reflexively reaching for `useState` for every value a component needs — when often, that value doesn't need to be stored at all. It can just be calculated fresh, every render, from data you already have.

---

### 🔁 Quick Recap: Props vs. State

As covered in question 1: props come from a parent and are read-only; state is owned and controlled by the component itself. The missing third option is what this question is really about.

---

### 🧮 The Third Option: Derived Data

**Derived data** is a value that can be calculated directly from props or state you already have, rather than needing its own separate, stored copy.

```jsx
// ❌ Storing something that could just be calculated
function ShoppingCart({ items }) {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        let sum = 0;
        items.forEach((item) => (sum += item.price));
        setTotal(sum);
    }, [items]);

    return <p>Total: {total}</p>;
}
```

```jsx
// ✅ Derived directly, fresh every render
function ShoppingCart({ items }) {
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return <p>Total: {total}</p>;
}
```

`total` is entirely determined by `items` — there's no reason to store it separately. The first version adds an extra piece of state that has to be manually kept in sync (via that `useEffect`), an extra render (state updates after the initial one, so `total` briefly shows `0` first), and a new way for bugs to creep in if that `useEffect` is ever forgotten or its dependency array is wrong.

---

### 🎯 The Three-Way Decision Framework

1. **Does it come from a parent, and this component won't change it itself?** → Props.
2. **Does this component need to remember something across renders, change it in response to events, and it genuinely can't be calculated from other props/state?** → State.
3. **Can it be calculated right now, from props or state you already have?** → Derived — compute it during render, don't store it at all.

---

### ⚡ What About Expensive Derived Values?

If a derived calculation is genuinely expensive, the worry that it re-runs on every render is valid — but the fix isn't to move it into state. The fix is `useMemo`, which caches the result of an expensive calculation between renders (covered in the Hooks and Performance Optimization chapters). It's still conceptually derived data — just with a caching layer on top, not a separate, independently-owned piece of state.

---

### 💎 Good to Know: A Simple Test

A genuinely useful mental check: *if I deleted this piece of state, could I recreate its value using only the props and state that are left?* If the answer is yes, it should be derived, not stored separately.

---

### ❓ Follow-up Interview Questions

1. What problem does the `ShoppingCart` example's `useEffect`-based `total` actually create?
2. What is "derived data," and how is it different from state?
3. What three questions make up the decision framework for props vs. state vs. derived?
4. If a derived calculation is expensive, should you move it into state? What should you do instead?
5. What's the simple test for deciding whether something should be derived rather than stored?

---

## 9. What is the difference between local state and global state, and how do you decide between them?

### 📖 Introduction

Every state example so far in this chapter has lived inside one component (or been lifted to a shared parent, per question 4). But not all data is only relevant to one place — some of it needs to be available across many, often unrelated, parts of the app.

---

### 📍 What Is Local State?

**Local state** belongs to, and is only relevant to, one specific component or a small, closely related group of components. Whether a dropdown is open, the current value of a single text field, whether a modal is visible — these are all naturally local.

---

### 🌍 What Is Global State?

**Global state** is data that many different, often *unrelated* parts of the app need to read or update — the currently logged-in user, the app's color theme, or items in a shopping cart shown in the header, the cart page, and the checkout page all at once.

---

### 🎯 How to Decide: A Practical Checklist

1. **How many, and how unrelated, are the components that need this data?** One component, or a tight parent/child cluster — local state (lifted up if needed, per question 4) is enough. Many places across totally different branches of the tree — that's a sign it should be global.
2. **Does the data need to survive a component unmounting?** Local state disappears the moment the component that owns it unmounts — that's the whole point of it. If data needs to persist even after the component that first created it is gone (cart contents surviving as the user navigates elsewhere), it needs to live outside any single component.
3. **Would lifting this state up mean passing it through many components that don't actually care about it?** If the answer is yes, that's prop drilling (question 3) creeping in — a sign the data has outgrown "just lift it up" and needs a global solution instead.

---

### 💎 Good to Know: This Is About "When," Not "Which Tool"

Recognizing that data has outgrown local state is one question; deciding *how* to actually implement global state — the Context API, or a dedicated library like Redux or Zustand — is a separate one. That full picture is covered in the Context API and State Management chapters, right after this one.

---

### ❓ Follow-up Interview Questions

1. Give an example of something that's naturally local state, and something that's naturally global state.
2. What happens to local state when the component that owns it unmounts?
3. Why might data needing to survive navigation between pages be a sign it should be global?
4. How does prop drilling (question 3) relate to deciding whether state should become global?
5. Does deciding data should be "global" tell you which specific tool to use for it?

---

## 10. What are the trade-offs between lifting state up and using the Context API?

### 📖 Introduction

Question 4 covered lifting state up, and question 9's checklist covered recognizing when local state isn't enough. This question compares the two options directly: keep lifting state through the tree, or switch to Context.

---

### ⬆️ Lifting State Up: Pros and Cons

**Pros:**
- Simple and explicit — you can see exactly where data comes from just by reading a component's props, with no hidden mechanism involved.
- No extra concepts needed — it's just props, all the way down.

**Cons:**
- As the distance between the data's owner and its consumers grows, this turns into prop drilling (question 3) — tedious, fragile to change, and it couples uninterested components to data they never use.

---

### 🌐 Context API: Pros and Cons

**Pros:**
- Skips the middle layers entirely — a deeply nested component can read shared data directly, without every component in between needing to know about it at all.

**Cons:**
- **Less explicit.** Looking at a component that calls `useContext(SomeContext)`, you can't tell where that data actually comes from just by reading its props — you have to go find the Provider higher up the tree, which can make code harder to trace than an explicit prop chain.
- **A real performance trade-off.** Every component consuming a Context re-renders whenever that Context's value changes, even if it only cares about one small piece of a larger value — a much bigger topic covered fully in the Context API chapter.
- **Slightly harder to test in isolation.** A component reading from Context needs to be wrapped in the right Provider during tests, whereas a component that just takes props can be tested by passing in whatever values you want directly.

---

### 🎯 Practical Guidance: When Each Makes Sense

For shallow drilling — one to three levels — lifting state up (or simply tolerating the drilling) is often the simpler, more explicit choice; Context's own trade-offs aren't worth paying for such a small case. Context earns its keep once data genuinely needs to reach many, deeply nested, unrelated parts of the tree.

---

### 💎 Good to Know: These Aren't Mutually Exclusive

Many real apps use both together: lift state up to a reasonably-scoped parent (not necessarily the very top of the app), and then use Context just within that smaller subtree, to avoid drilling through whatever chain remains inside that specific feature. It doesn't have to be an all-or-nothing choice between the two.

---

### ❓ Follow-up Interview Questions

1. What's the main advantage of lifting state up over using Context?
2. Why is a component reading from Context described as less "explicit" than one reading from props?
3. What real performance cost can come from using Context, and why?
4. Why might testing a Context-consuming component be slightly more involved than testing a props-based one?
5. Do lifting state up and using Context have to be an either/or choice in a real application?

---

## 11. How can excessive or poorly structured state lead to unnecessary re-renders?

### 📖 Introduction

It's not just about *whether* you update state correctly — *how* you organize multiple pieces of state together has a real, direct effect on how often components re-render.

---

### 📦 Problem 1: Grouping Unrelated Data Into One State Object

```jsx
function Dashboard() {
    const [state, setState] = useState({
        searchTerm: "",
        selectedTab: "overview",
        isSidebarOpen: true,
    });
    // updating searchTerm still means creating a whole new state object,
    // even though selectedTab and isSidebarOpen didn't actually change
}
```

Since all three values live in one state variable, updating just `searchTerm` means calling `setState` with an entirely new object. If pieces of this object are passed down to different child components as props, every one of those children sees a *new* object reference on every update — even the ones only interested in `selectedTab`, which never actually changed — defeating `React.memo` for all of them, not just the part that's genuinely changing.

Splitting genuinely unrelated data into separate state variables avoids this:

```jsx
function Dashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
}
```

`Dashboard` itself still re-renders when any one of them changes — but a child component that only receives `selectedTab` as a prop now correctly sees no change at all when `searchTerm` updates, so a memoized version of it can properly skip re-rendering.

---

### 📍 Problem 2: Keeping State Too High Up

This connects directly to the colocation principle from questions 4 and 9 — state kept higher in the tree than necessary means a larger part of the tree re-renders by default on every update, simply because more components sit below the component that owns it.

---

### ⚡ Problem 3: Frequently-Changing State Living Too High Up

This is a sharper version of Problem 2. Something that changes very often — mouse position, scroll position, a live timer — living in a component high up the tree means the *entire* subtree below it re-renders on every single one of those frequent updates, even parts that have nothing to do with that value. The fix is the same principle as colocation: push fast-changing state down into the smallest, most specific component that actually needs it, so only that small piece re-renders frequently, not the whole page.

---

### 💎 Good to Know: The Same Principle Applies to Global Stores

This isn't unique to `useState` — it's exactly why "one giant object for all app state" isn't automatically a good design, even for dedicated state management libraries (covered in the State Management chapter). Well-structured global stores split unrelated data the same way, so components only re-render for the specific slice of data they actually subscribe to.

---

### ❓ Follow-up Interview Questions

1. Why does grouping unrelated values into one state object hurt memoized child components specifically?
2. In the `Dashboard` example, what happens to a memoized child reading only `selectedTab` when `searchTerm` changes?
3. Why does keeping state higher up the tree than necessary cause more re-renders by default?
4. Why is frequently-changing state (like mouse position) especially costly if it lives too high up?
5. Does this same "split unrelated data" principle apply to state management libraries too?

---

## 12. How do props and state together implement React's one-way data flow?

### 📖 Introduction

The Introduction & Fundamentals chapter introduced one-way data flow with a simple parent/child example. Now that this chapter has covered props and state in full depth, here's the complete picture — including what happens across more than just one level.

---

### 🔄 The Full Cycle: Down as Data, Up as Requests

1. **State lives in exactly one component** — its owner (question 1).
2. **That state flows down to children as props.** Since props are read-only from the child's side (questions 1 and 2), a child can only *read* this data — never change it directly.
3. **If a child needs to trigger a change, the owner also passes down a function** as a prop. The child calls that function, but the actual state update still happens back in the owner — never inside the child itself.

Data only ever flows in one direction — down. Nothing flows back up except a function call requesting a change, and even that only takes effect through the owner's own state setter. That's the entire meaning of "one-way."

---

### 🧵 A Multi-Level Example

```jsx
function TodoApp() {
    const [todos, setTodos] = useState([{ id: 1, text: "Buy milk", done: false }]);

    function toggleTodo(id) {
        setTodos(todos.map((todo) =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
        ));
    }

    return <TodoList todos={todos} onToggle={toggleTodo} />;
}

function TodoList({ todos, onToggle }) {
    return (
        <ul>
            {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
            ))}
        </ul>
    );
}

function TodoItem({ todo, onToggle }) {
    return (
        <li onClick={() => onToggle(todo.id)}>
            {todo.done ? "✅" : "⬜"} {todo.text}
        </li>
    );
}
```

`TodoApp` owns `todos`. It passes both the data (`todos`) and a way to change it (`toggleTodo`) down through `TodoList` to `TodoItem`, purely as props. `TodoItem` can read `todo`, but never changes it directly — clicking it just *calls* `onToggle(todo.id)`. The actual state update, `setTodos(...)`, only ever runs inside `TodoApp`, no matter how many layers of components sit in between. If this chain grew much longer, you'd start running into prop drilling (question 3) — the same one-way principle, just stretched further than is comfortable.

---

### 💎 Good to Know: Why This Makes Debugging Predictable

Because data only ever flows down, and changes only ever happen in the one place that owns the state, debugging a React app usually comes down to one reliable question: find the component that owns the state, and look at what actually calls its setter. No matter how deep the component tree gets, the answer is never "somewhere, anywhere, might have changed it directly."

---

### ❓ Follow-up Interview Questions

1. In the `TodoApp` example, does `TodoItem` ever directly change `todos`? What does it do instead?
2. What are the two things that flow down from `TodoApp` to `TodoList` to `TodoItem`?
3. What is the only thing that ever flows back "up" in this pattern?
4. Where does the actual `setTodos()` call happen, no matter how many components are in between?
5. Why does one-way data flow make debugging a large component tree more predictable?

---

## 13. What strategies exist for managing complex state in large-scale applications?

### 📖 Introduction

Good instincts for individual state decisions — everything covered so far in this chapter — aren't quite enough on their own once an app grows large. You also need broader strategies for keeping state manageable at scale.

---

### 🗂️ Strategy 1: Categorize State by Its Nature

It helps to explicitly distinguish a few different kinds of state, since each behaves differently:

- **UI state** — is a modal open, which tab is selected. Almost always local.
- **Client state** — the logged-in user, the current theme, cart contents. Often global, but owned entirely by the client.
- **Server state** — data fetched from an API, like a user profile or a product list. This is genuinely different from client state — it needs caching, refetching, and its own loading/error handling, which is exactly why dedicated tools like TanStack Query exist (covered in the API Integration chapter) rather than treating it like ordinary state.
- **Derived state** — calculated from the categories above (question 8). Never stored separately.

---

### 📍 Strategy 2: Keep Applying Colocation Consistently

The same instincts from questions 4, 9, and 11 still apply at scale: keep state as local as possible by default, and only lift it up or make it global once multiple, genuinely unrelated parts of the app actually need it.

---

### ✂️ Strategy 3: Split State by Feature, Not Into One Giant Store

Question 11 showed why grouping unrelated data into one state object causes unnecessary re-renders. The same principle applies architecturally — even "global" state should usually be organized into separate, focused pieces per feature, rather than one giant object for the whole app. This also pairs naturally with the feature-based project structure from the Components chapter — state organized by feature tends to sit right alongside the code for that same feature.

---

### 🛠️ Strategy 4: Use the Right Tool for the Right Kind of State

Not every kind of state belongs in the same tool: server state fits a library built for it (TanStack Query), client state fits Context or a store like Zustand or Redux, and self-contained component logic often just needs local state. The full comparison of these tools is covered in the State Management chapter.

---

### 🔀 Strategy 5: Reach for `useReducer` for Complex, Self-Contained Logic

When a single component has many related state values and several possible transitions between them, several separate `useState` calls can scatter the actual update logic across many different event handlers. `useReducer` centralizes that logic into one function, making complex local state easier to follow — covered fully in the Hooks chapter.

---

### 💎 Good to Know: The Best Strategy Is Restraint

The single most valuable strategy is resisting the urge to reach for a heavy, global solution before you actually need one. Start with local state and `useState`/`useReducer`, and only introduce Context or a dedicated library once a genuine, real cross-cutting need shows up. Premature architecture is just as real a mistake at scale as no architecture at all.

---

### ❓ Follow-up Interview Questions

1. Why is server state treated as a genuinely different category from client state?
2. How does colocation still apply even in a large-scale application?
3. Why should even "global" state usually be split by feature rather than kept in one giant store?
4. When does `useReducer` become a better fit than several separate `useState` calls?
5. What's the risk of introducing a heavy state management tool before it's actually needed?

---

## 14. How would you design a scalable state structure for a large React application?

### 📖 Introduction

This closing question is a chance to apply everything from this chapter to one realistic scenario, the way a system-design-style interview question would ask.

---

### 🛒 A Realistic Scenario: An E-Commerce App

Imagine a mid-size app with: user authentication, a product catalog fetched from an API, a shopping cart, and assorted UI details like modals and search inputs.

---

### 🧩 Placing Each Piece of State

- **Is a dropdown open? A modal visible? The current search input value?** Local state, colocated in the specific component that owns it (questions 1, 4, 9, 11).
- **The product catalog, fetched from the backend.** This is server state, not a plain `useState` or a global store — it belongs in a dedicated data-fetching tool with its own caching and refetching behavior (question 13's categorization, full depth in the API Integration chapter).
- **The logged-in user and auth token.** Needed in many unrelated places — the header, checkout, protected routes — so this is global, via Context or a dedicated store depending on the app's scale (question 9's checklist, question 10's trade-offs).
- **Shopping cart contents.** Also needed in several distant places (a header icon, the cart page, checkout) *and* needs to survive the user navigating between pages — both signals from question 9 point toward global state here.
- **The cart's total price.** Derived entirely from the cart's contents — never stored separately (question 8).
- **A multi-step checkout form** with many related fields and validation rules. A strong candidate for `useReducer`, kept local to the checkout feature (question 13's Strategy 5) — not scattered across several `useState` calls, and not pushed into the global store either, since it's genuinely self-contained until the order is actually submitted.

---

### 🗂️ Structural Decisions: Organizing by Feature, Not by Type

Global state should be split by feature — auth, cart — rather than kept in one giant object (questions 11 and 13), so an update to one feature's data doesn't cause unrelated features to re-render. This pairs naturally with the feature-based file structure from the Components chapter: the logic for cart state lives inside the `cart` feature's own folder, not scattered across the codebase. And per question 13's closing point, the simplest tool that satisfies the actual need — Context for a medium-sized app's auth state, for example — should come before reaching for a full library, unless a real, measured need justifies it.

---

### 💎 Good to Know: There's No Fixed Template

The exact placement above isn't a memorizable recipe — it comes from consistently asking the same handful of questions from this chapter, feature by feature: Does this change often? Who genuinely needs it? Does it need to survive a component unmounting? Could it be derived instead of stored at all? Applying those same questions consistently is what a genuinely scalable state structure actually comes from — not any one specific tool choice.

---

### ❓ Follow-up Interview Questions

1. Why does the product catalog belong in a different category of state than the shopping cart?
2. What two signals from question 9 point toward making cart contents global state?
3. Why is a multi-step checkout form a good candidate for `useReducer` rather than the global store?
4. Why should global state be split by feature instead of kept in one shared object?
5. What handful of questions would you consistently ask to decide where any given piece of state belongs?

---