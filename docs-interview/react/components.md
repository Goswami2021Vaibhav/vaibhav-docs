---
title: Components
description: Function vs class components, composition, and component design.
sidebar_position: 3
---

# Components

## 1. What is a component in React, and why are components central to how React applications are built?

### 📖 Introduction

Think of building with LEGO. You don't build a castle as one giant, solid piece — you build it out of small, individual bricks, and snap them together. Components are React's version of those bricks.

---

### 🧱 What Is a Component?

A component is a small, self-contained piece of UI. In practice, it's just a JavaScript function that returns JSX (from the Introduction & Fundamentals chapter) describing what that piece of the screen should look like.

```jsx
function Greeting({ name }) {
    return <h1>Hello, {name}</h1>;
}
```

`Greeting` takes an input (`name`, passed in as a prop) and returns a description of some UI. That's really all a component is — a function that takes some data in, and gives some UI back out.

---

### 🌳 Why Components Are Central to React

A React application isn't one big page — it's a **tree of components**, nested inside each other:

```jsx
function App() {
    return (
        <div>
            <Header />
            <Sidebar />
            <MainContent />
        </div>
    );
}
```

`MainContent` might itself render a `PostList`, which renders many individual `Post` components — and so on, all the way down. No matter how large a real React application gets, it's still just components rendering other components. This is the core idea React is built around, not just a coding style choice.

---

### 🎯 Why This Approach Actually Helps

- **Reusability** — write a `Button` component once, and use it in fifty different places, instead of repeating the same markup everywhere.
- **Separation of concerns** — each component only needs to worry about its own small piece of the UI and its own logic, not the entire page at once.
- **Easier to reason about** — since a component is self-contained, you can look at it, understand it, and test it on its own, without needing to hold the whole application in your head.
- **Composability** — complex UIs get built by combining simple components together, a pattern called component composition, covered in full in question 4.

---

### 💎 Good to Know: Component Names Must Start With a Capital Letter

This isn't just a style rule — it's how React tells your component apart from a regular HTML tag inside JSX. `<greeting />` (lowercase) would be treated as a literal HTML tag called `greeting`, not your component, while `<Greeting />` (capitalized) is recognized as the component you wrote. Naming a component starting with a lowercase letter is a real, easy-to-make mistake that silently breaks in a confusing way.

---

### ❓ Follow-up Interview Questions

1. In simple terms, what is a React component actually made of?
2. What does a component take as input, and what does it give back?
3. Why is a React application described as a "tree" of components?
4. Name two real benefits of building an app out of small components instead of one large page.
5. What happens if you name a component starting with a lowercase letter?

---

## 2. What are Functional Components and Class Components, and why are Functional Components preferred today?

### 📖 Introduction

React has had two different ways to write a component over the years. Today, almost everyone writes new code one way — but the other way still shows up in older codebases, so it's worth recognizing both.

---

### 🔧 Functional Components

A **Functional Component** is exactly what question 1 already showed — a plain JavaScript function that returns JSX, using Hooks to manage state and other behavior:

```jsx
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
    );
}
```

---

### 🏛️ Class Components

A **Class Component** is a JavaScript class that extends `React.Component`. It must have a `render()` method that returns JSX, and it manages its own state through `this.state` and `this.setState()`:

```jsx
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }

    render() {
        return (
            <button onClick={() => this.setState({ count: this.state.count + 1 })}>
                {this.state.count}
            </button>
        );
    }
}
```

Both versions of `Counter` behave identically to a user. The difference is entirely in how they're written.

---

### 🤔 Why Functional Components Are Preferred Today

- **Less boilerplate.** No `constructor`, no `super(props)`, no repeatedly typing `this.state` and `this.setState`.
- **No `this` confusion.** In class components, `this` can behave in ways that trip people up — for example, a method passed as an event handler can lose its connection to the right `this` unless you're careful. Functional components don't have this problem at all, since there's no `this` to manage.
- **Reusing logic is much easier.** With Hooks, shared stateful logic can be pulled into a Custom Hook and reused across components. Classes didn't have an equivalent built-in tool — they relied on more awkward patterns like Higher-Order Components and Render Props, both covered later in this chapter.
- **Related logic stays together.** A function component can group everything about one concern (say, subscribing to and cleaning up a data source) into a single `useEffect`, instead of splitting it across several separate lifecycle methods like `componentDidMount` and `componentWillUnmount` (covered in the Lifecycle chapter).

---

### ⚖️ Side by Side

| | Functional Component | Class Component |
|---|---|---|
| Written as | A function | A class extending `React.Component` |
| State | `useState` Hook | `this.state` / `this.setState()` |
| Side effects | `useEffect` Hook | Lifecycle methods |
| `this` keyword | Not needed | Needed, and a common source of bugs |
| Reusing logic | Custom Hooks | HOCs / Render Props |

---

### 💎 Good to Know: One Job Class Components Still Do

There's one thing class components can still do that a plain function component can't do on its own: **Error Boundaries**, which catch rendering errors in child components. This relies on two class-only features, `static getDerivedStateFromError` and `componentDidCatch`, which don't have a direct Hook equivalent. This is exactly why you might still spot a small class component in an otherwise fully hook-based, modern codebase — usually just for this one purpose. It's covered fully in the Error Handling chapter.

---

### ❓ Follow-up Interview Questions

1. What are the two different ways state is managed in a function component versus a class component?
2. Why can the `this` keyword cause bugs in class components that simply don't exist in function components?
3. How did class components share reusable logic before Hooks existed?
4. What is one specific React feature that still typically requires a class component?
5. If both versions of `Counter` behave identically to the user, why does the preferred style still matter?

---

## 3. What is the difference between Presentational (Dumb) and Container (Smart) components, and is this pattern still relevant?

### 📖 Introduction

This is an older React pattern, from before Hooks existed, about splitting components based on one question: does this component care about *how things look*, or *how things work*?

---

### 🎨 Presentational (Dumb) Components — Just Display, Nothing Else

A **Presentational Component** only cares about the UI. It receives data and functions through props, and has no idea where that data came from or how those functions actually work.

```jsx
function UserCard({ name, email, onDelete }) {
    return (
        <div>
            <h3>{name}</h3>
            <p>{email}</p>
            <button onClick={onDelete}>Delete</button>
        </div>
    );
}
```

`UserCard` doesn't know or care whether `name` came from an API, a database, or was just typed in by hand — it just displays whatever it's given.

---

### 🧠 Container (Smart) Components — Handle the Logic and Data

A **Container Component** does the opposite: it manages data, state, and logic, and hands the results down to a presentational component to actually display.

```jsx
function UserCardContainer({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);

    function handleDelete() {
        deleteUser(userId);
    }

    if (!user) return <p>Loading...</p>;

    return <UserCard name={user.name} email={user.email} onDelete={handleDelete} />;
}
```

`UserCardContainer` doesn't render any real visual markup of its own — it fetches the data, defines what "delete" should actually do, and then leaves the actual display work entirely to `UserCard`.

---

### 🤔 Is This Pattern Still Relevant Today?

Partially. The underlying **idea** — separating "what drives this component" from "how it's displayed" — is still genuinely useful and widely practiced. But the specific old-school solution — splitting logic into a *separate wrapper component* just to hold it — is much less common today, because Custom Hooks solve the same problem more directly:

```jsx
function useUser(userId) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);

    return user;
}

function UserCard({ userId }) {
    const user = useUser(userId);

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
        </div>
    );
}
```

Now `UserCard` handles both the data and the display — but the data-fetching logic is still cleanly separated, inside `useUser`, and just as reusable as it was before. There's no need for a whole extra "container" component wrapping it. So the *goal* of this pattern lives on, just achieved through Custom Hooks instead of a second component.

---

### 💎 Good to Know: Even Its Creator Moved On From It

This pattern was popularized around 2015 by Dan Abramov, a member of the React core team. Years later, after Hooks were introduced, he himself wrote that he no longer considered this strict split necessary — a good reminder that even influential patterns are tools for a specific moment, not permanent rules.

---

### ❓ Follow-up Interview Questions

1. What is a Presentational Component responsible for, and what is it deliberately *not* responsible for?
2. What is a Container Component responsible for?
3. In the `UserCardContainer`/`UserCard` example, which one actually renders visible markup?
4. How do Custom Hooks let a single component achieve the same separation this pattern was designed for?
5. Is splitting components into separate "Container" and "Presentational" files still the standard approach in modern React? Why or why not?

---

## 4. What is component composition, and why is it preferred over inheritance in React?

### 📖 Introduction

Many programming languages let you build a new class by extending an existing one — inheriting its behavior. React deliberately steers away from this for components, and reaches for a different approach instead: composition.

---

### 🧩 What Is Component Composition?

**Composition** means building complex UI by combining simple components together — nesting them inside one another — rather than by having one component extend another.

```jsx
function Card({ children }) {
    return <div className="card">{children}</div>;
}

function App() {
    return (
        <Card>
            <h2>Profile</h2>
            <p>Vaibhav Goswami</p>
        </Card>
    );
}
```

`Card` doesn't know or care what's actually inside it — it just wraps whatever content it's handed, using the special `children` prop. This is composition: `App` builds its UI by combining `Card` with other elements, not by creating some new component that extends `Card`.

---

### 🚫 Why Not Inheritance?

Imagine trying to build a `SpecialCard` by extending `Card` the way you'd extend a class in traditional object-oriented programming. `SpecialCard` would need to know about `Card`'s internal structure to override the right pieces, and `Card` would need to be written in a way that anticipates being extended. The two components would become tightly tied to each other's implementation — a change inside `Card` could quietly break every component that extends it.

Composition avoids this entirely. `Card` doesn't need to anticipate anything about what goes inside it — it just renders whatever `children` it's given. The React team has stated directly, in their own documentation, that they haven't found a case where component inheritance would actually be a better choice than composition.

---

### 🎛️ Composition Beyond `children` — Multiple Slots

Composition isn't limited to a single `children` prop — you can pass entire components as regular props too, giving a component several distinct "slots" to fill:

```jsx
function SplitPane({ left, right }) {
    return (
        <div style={{ display: "flex" }}>
            <div>{left}</div>
            <div>{right}</div>
        </div>
    );
}

function App() {
    return <SplitPane left={<Sidebar />} right={<MainContent />} />;
}
```

`SplitPane` doesn't know or care what `Sidebar` or `MainContent` actually are — it just lays out whatever it's given in each slot.

---

### 💎 Good to Know: Composition Is the Foundation for Later Patterns

Passing components as props — whether through `children` or through named props like `left`/`right` — is the same basic idea that more advanced patterns build on top of. The Compound Component pattern, covered in question 6 of this chapter, is really just a more structured version of this same principle.

---

### ❓ Follow-up Interview Questions

1. What does it mean to build UI through composition, in your own words?
2. In the `Card` example, why doesn't `Card` need to know what's actually inside it?
3. What problem would component inheritance create that composition avoids?
4. Besides `children`, how else can a component receive other components as "slots" to render?
5. What later pattern in this chapter builds directly on the idea of composition?

---

## 5. What is a Higher-Order Component (HOC), what are its common use cases, and what are its drawbacks?

### 📖 Introduction

Sometimes several unrelated components all need the exact same extra behavior — say, "show a loading message while data is loading." A Higher-Order Component is one of the older ways React developers solved this kind of repeated logic.

---

### 🎁 What Is a Higher-Order Component?

A **Higher-Order Component (HOC)** is a function that takes a component as input, and returns a *new* component with some extra behavior added. It's not a special React feature — it's just a plain JavaScript pattern, made possible by the fact that components are just functions, and functions can take other functions in and return new ones out.

```jsx
function withLoading(WrappedComponent) {
    return function WithLoadingComponent({ isLoading, ...props }) {
        if (isLoading) {
            return <p>Loading...</p>;
        }
        return <WrappedComponent {...props} />;
    };
}

function UserList({ users }) {
    return (
        <ul>
            {users.map((user) => <li key={user.id}>{user.name}</li>)}
        </ul>
    );
}

const UserListWithLoading = withLoading(UserList);
```

`withLoading` doesn't care what component it's given — it just wraps it with a check: show a loading message if `isLoading` is true, otherwise render the original component as normal. You could wrap many different components with this same `withLoading` function, and each one would get the same loading behavior, without repeating that check inside every single one.

---

### 🛠️ Common Use Cases

- Adding an authentication check before rendering a component (`withAuth`).
- Adding a loading state, as shown above.
- Subscribing a component to some external data source.
- Injecting shared data or logging/analytics behavior into any component that needs it.

---

### ⚠️ Drawbacks of HOCs

- **"Wrapper hell."** Wrapping a component with several HOCs stacks up quickly — `withAuth(withLoading(withLogging(UserList)))` — making the component tree deep and harder to read.
- **Naming collisions.** If two different HOCs both try to inject a prop with the same name, one silently overwrites the other, and it's not always obvious just from reading `UserList` which HOC actually provided a given prop.
- **Harder to trace in DevTools.** A heavily wrapped component can show up as something like `WithAuth(WithLoading(WithLogging(UserList)))`, making it harder to tell which layer is responsible for what.
- **Refs don't pass through automatically.** If a wrapped component needs to expose a ref to a real DOM node, the HOC's own wrapper function blocks that ref by default — getting it through requires extra work with `forwardRef`.

---

### 💎 Good to Know: Custom Hooks Have Replaced Most HOC Use Cases

In modern React, most of what a HOC used to do can be done more simply by just calling a Custom Hook directly inside a component — no wrapping, no naming collisions, no extra layers in the component tree. This is exactly why question 9 of this chapter directly compares HOCs, Render Props, and Custom Hooks. That said, HOCs haven't disappeared completely — you'll still find them in some existing libraries (like `connect()` from older versions of Redux), so recognizing the pattern is still useful even if you rarely write a new one yourself.

---

### ❓ Follow-up Interview Questions

1. In plain terms, what does a Higher-Order Component actually do?
2. In the `withLoading` example, what decides whether the loading message or the real component gets shown?
3. What is "wrapper hell," and why does it make code harder to work with?
4. Why don't refs pass through a HOC automatically?
5. What has largely replaced HOCs for sharing logic between components in modern React?

---

## 6. What is a Compound Component, and when is this pattern useful?

### 📖 Introduction

Think about the HTML `<select>` and `<option>` tags. You never manually wire them together — you just nest `<option>` tags inside a `<select>`, and somehow the whole thing knows which option is currently selected. A Compound Component brings that same experience to custom React components, and it builds directly on the composition idea from question 4.

---

### 🧩 A Real Example: Building Tabs

```jsx
const TabsContext = createContext();

function Tabs({ children, defaultIndex = 0 }) {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);

    return (
        <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
            {children}
        </TabsContext.Provider>
    );
}

function Tab({ index, children }) {
    const { activeIndex, setActiveIndex } = useContext(TabsContext);

    return (
        <button
            className={index === activeIndex ? "active" : ""}
            onClick={() => setActiveIndex(index)}
        >
            {children}
        </button>
    );
}

function TabPanel({ index, children }) {
    const { activeIndex } = useContext(TabsContext);
    return activeIndex === index ? <div>{children}</div> : null;
}
```

Using it looks like this:

```jsx
<Tabs>
    <Tab index={0}>Profile</Tab>
    <Tab index={1}>Settings</Tab>
    <TabPanel index={0}>Profile content</TabPanel>
    <TabPanel index={1}>Settings content</TabPanel>
</Tabs>
```

`Tabs`, `Tab`, and `TabPanel` are three separate components, but they secretly share state — which tab is active — behind the scenes, using the Context API (covered fully in its own chapter). Whoever *uses* `<Tabs>` never has to manually track or pass along which tab is selected — they just nest the pieces together, and the components coordinate it themselves.

---

### 🎯 When Is This Pattern Useful?

This pattern shines whenever you have a group of related components that need to share internal state, but you still want the person *using* them to have a clean, flexible, HTML-like way of arranging them — rather than one giant component with a long list of configuration props for every possible layout.

Common real-world examples: tabs, accordions, dropdown menus, and modals with separate header/body/footer sections. In all of these, the person using the component can freely reorder, add, or remove pieces, without the top-level component needing a dedicated prop for every possible arrangement.

---

### 💎 Good to Know: This Avoids Manual Prop Wiring Between Siblings

Without this pattern, getting `Tab` and `TabPanel` to coordinate would normally mean the parent manually tracking state and passing it down through props to every single child — a version of prop drilling, covered in the Props & State chapter. Compound Components let sibling and nested components communicate directly through shared context, without the component using them ever having to wire that up by hand.

---

### ❓ Follow-up Interview Questions

1. What everyday HTML elements behave similarly to a Compound Component?
2. In the `Tabs` example, how do `Tab` and `TabPanel` know which tab is currently active without being told directly through props?
3. What advantage does this pattern give the person *using* `Tabs`, compared to one big component with many configuration props?
4. Name two other real-world UI patterns where Compound Components are commonly used.
5. What manual wiring problem does this pattern help you avoid?

---

## 7. What are Controlled and Uncontrolled Components, and what are the trade-offs between them?

### 📖 Introduction

Here's a simple question to ask about any input on screen: who's actually "in charge" of its value — React, or the browser's own DOM? The answer splits inputs into two categories.

---

### 🎮 Controlled Components — React Is in Charge

In a **Controlled Component**, React state is the single source of truth for the value. The input's displayed value comes directly from state, and every change goes through an `onChange` handler that updates that state.

```jsx
function NameInput() {
    const [name, setName] = useState("");

    return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

The input can never show anything except whatever `name` currently is. When you type, `onChange` fires, `name` updates, and *that* updated state is what makes the input display the new character. React is fully in control at every step.

---

### 🕊️ Uncontrolled Components — The DOM Is in Charge

In an **Uncontrolled Component**, the browser's own DOM holds and tracks the value. React doesn't store it in state at all — it only reaches in and reads the value when it's actually needed, usually through a `ref`.

```jsx
function NameInput() {
    const inputRef = useRef(null);

    function handleSubmit() {
        console.log(inputRef.current.value); // read directly from the DOM, only when needed
    }

    return (
        <>
            <input ref={inputRef} defaultValue="" />
            <button onClick={handleSubmit}>Submit</button>
        </>
    );
}
```

Notice `defaultValue` instead of `value` here — that only sets the *starting* value. After that, the DOM manages every keystroke on its own; React only looks at the current value when `handleSubmit` runs.

---

### ⚖️ The Trade-offs

| | Controlled | Uncontrolled |
|---|---|---|
| Who holds the value | React state | The DOM itself |
| How you read the value | Directly from state | Through a ref, when needed |
| Live validation while typing | Easy — state updates on every keystroke | Harder — React doesn't know the value until it looks |
| Re-renders per keystroke | Yes | No |
| Good for | Reacting to every change (validation, conditionally disabling a button) | Simple cases where you only need the value once, like on submit |

---

### 💎 Good to Know: This Distinction Matters Even More for Real Forms

This same controlled-versus-uncontrolled choice becomes especially important once you're building actual forms with many fields, file inputs, or performance concerns — including how libraries like React Hook Form use uncontrolled inputs internally to avoid unnecessary re-renders. That full picture is covered in the Forms chapter.

---

### ❓ Follow-up Interview Questions

1. In a Controlled Component, what determines what the input actually displays?
2. In an Uncontrolled Component, when does React actually find out what the current value is?
3. Why does `defaultValue` behave differently from `value` on an input?
4. Which approach causes a re-render on every keystroke, and why?
5. Why might live input validation be easier to implement with a Controlled Component?

---

## 8. What is a Pure Component, how does `React.memo` relate to it, and what is shallow comparison?

### 📖 Introduction

The Introduction & Fundamentals chapter established that, by default, when a parent re-renders, every one of its children re-renders too — even if a child's props haven't actually changed. Pure Components and `React.memo` exist specifically to change that default.

---

### 🧼 Pure Components — The Class Component Version

A **Pure Component** is a class component that automatically skips re-rendering if its props and state haven't changed, by extending `React.PureComponent` instead of the regular `React.Component`. A regular class component re-renders every time its parent does, no matter what; a Pure Component checks first, and skips the re-render if nothing relevant actually changed.

---

### ⚛️ `React.memo` — The Same Idea for Function Components

`React.memo` is the function component equivalent of `PureComponent`. It's a function that wraps a component and tells React: "before re-rendering this, check whether its props actually changed — if not, reuse the previous result instead."

```jsx
const UserCard = React.memo(function UserCard({ name, email }) {
    console.log("Rendering UserCard");
    return (
        <div>
            <h3>{name}</h3>
            <p>{email}</p>
        </div>
    );
});
```

Without `React.memo`, `UserCard` would re-render every time its parent does, even if `name` and `email` are exactly the same as before. With it, React checks the props first, and skips re-rendering `UserCard` entirely when nothing has changed.

---

### 🔍 What Is Shallow Comparison?

`React.memo` (and `PureComponent`) don't deeply inspect every value inside your props — they do a **shallow comparison**: checking each prop, one level deep, using `===` (reference equality). For primitive values — strings, numbers, booleans — this works perfectly, since two identical primitive values are always `===` equal.

---

### ⚠️ The Gotcha: New Objects and Functions Break Shallow Comparison

Objects, arrays, and functions behave differently under `===`. Two objects with identical-looking content are still considered different unless they're the *exact same* object in memory.

```jsx
function Parent() {
    const [count, setCount] = useState(0);

    const user = { name: "Vaibhav" }; // a brand-new object, created fresh on every render

    return <UserCard user={user} />;
}
```

Even though `user` looks the same every time, `Parent` creates a *new* object on every single render. `React.memo`'s shallow comparison sees this new object as different from the last one — because `{} === {}` is always `false`, even with identical contents — so `UserCard` re-renders anyway, and `React.memo` ends up doing nothing useful here.

---

### 💎 Good to Know: This Is One of React's Most Common Performance Pitfalls

This exact problem — new object, array, or function references being created on every render — is one of the most common real-world reasons `React.memo` silently fails to prevent re-renders. It's also exactly why `useMemo` and `useCallback` exist: to keep the *same* reference across renders when the underlying content hasn't actually changed. The full picture, including how to actually spot and fix this, is covered in the Rendering & Re-rendering and Performance Optimization chapters.

---

### ❓ Follow-up Interview Questions

1. What does a Pure Component do differently from a regular class component?
2. What does `React.memo` do for a function component?
3. What does "shallow comparison" mean, and why does it work fine for strings and numbers?
4. In the `Parent`/`UserCard` example, why does `React.memo` fail to prevent `UserCard` from re-rendering?
5. What two Hooks exist specifically to solve the "new reference on every render" problem?

---

## 9. What are the trade-offs between Higher-Order Components, Render Props, and Custom Hooks?

### 📖 Introduction

Question 5 introduced Higher-Order Components and promised this comparison. React has actually had three major approaches, over time, for sharing reusable logic between components — and seeing all three side by side makes it obvious why the third one won.

---

### 🎁 Quick Recap: Higher-Order Components

As covered in question 5, a HOC wraps a component and returns a new one with extra behavior added — useful, but prone to "wrapper hell" and naming collisions.

---

### 🎭 Render Props — Sharing Logic Through a Function Prop

A **Render Prop** is a component that takes a *function* as a prop, and calls that function with some data, letting the caller decide exactly what to render with it.

```jsx
class MouseTracker extends React.Component {
    state = { x: 0, y: 0 };

    handleMouseMove = (event) => {
        this.setState({ x: event.clientX, y: event.clientY });
    };

    render() {
        return (
            <div onMouseMove={this.handleMouseMove}>
                {this.props.render(this.state)}
            </div>
        );
    }
}

// Usage
<MouseTracker render={({ x, y }) => <p>Mouse at {x}, {y}</p>} />
```

`MouseTracker` handles the logic of tracking the mouse, but doesn't decide what to actually display — it hands its current state to whatever function was passed in through `render`, letting the caller decide the UI.

---

### 🪝 Custom Hooks — The Same Logic, No Wrapping at All

```jsx
function useMousePosition() {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        function handleMouseMove(event) {
            setPosition({ x: event.clientX, y: event.clientY });
        }
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return position;
}

// Usage
function App() {
    const { x, y } = useMousePosition();
    return <p>Mouse at {x}, {y}</p>;
}
```

Same logic, same result — but no wrapper component, no function-as-prop, no extra nesting in the component tree at all. You just call `useMousePosition()` directly inside whatever component needs it.

---

### ⚖️ All Three, Side by Side

| | HOC | Render Props | Custom Hooks |
|---|---|---|---|
| How it's used | Wraps a component | Wraps children, passing a function as a prop | Called directly inside a component |
| Adds extra nesting? | Yes | Yes | No |
| Naming collision risk | Yes (injected props can clash) | Lower, but still a factor | No — just local variables |
| Can get messy at scale | "Wrapper hell" with multiple HOCs | "Callback hell" with deeply nested render props | Stays readable, top to bottom |
| Modern status | Legacy, still seen in some libraries | Legacy, mostly replaced | The default choice for new code |

---

### 💎 Good to Know: Why Custom Hooks Won

Custom Hooks let you reuse stateful logic without changing your component tree's structure at all — no wrapper components, no extra nesting, no callback boilerplate. You just call a function and get values back, the same way you'd use any other JavaScript function. That said, HOCs and Render Props haven't vanished from existing codebases, so recognizing all three is still worth knowing — even though almost all new code reaches for Custom Hooks by default.

---

### ❓ Follow-up Interview Questions

1. In the `MouseTracker` example, who decides what actually gets rendered with the mouse position?
2. What extra nesting does a Render Prop add to the component tree, compared to a Custom Hook?
3. Why doesn't a Custom Hook have the same naming collision risk that a HOC does?
4. What does "callback hell" look like with deeply nested Render Props?
5. Why is a Custom Hook generally considered the simplest of the three approaches today?

---

## 10. How do you decide when to split a large component into smaller ones?

### 📖 Introduction

There's no magic rule like "split it once it's over 100 lines." Instead, there are a handful of clear warning signs that reliably tell you it's time to break a component apart.

---

### 🧩 Signal 1: The Component Does Too Many Unrelated Things

If a single component fetches data, formats it, *and* renders three unrelated sections of the page, that's usually three (or more) separate jobs stuffed into one place. Splitting it lets each piece focus on one responsibility.

---

### 📋 Signal 2: You're Copy-Pasting Similar JSX

If you find yourself pasting nearly identical markup in more than one place, with only small differences, that's a strong sign it should become its own reusable component (as covered in question 1) instead of being duplicated.

---

### 🌲 Signal 3: Deeply Nested, Hard-to-Read JSX

If a component's `return` statement runs dozens of lines deep, full of nested conditionals and `.map()` calls, pulling pieces out into smaller, clearly-named components makes the code easier to scan — even if those pieces are never reused anywhere else. A well-named component like `<UserAvatar />` communicates intent far better than a wall of raw markup.

---

### 🎛️ Signal 4: A Huge, Unwieldy List of Props

If a component needs fifteen different props just to configure all its different behaviors and sections, that's often a sign it's really several components glued together. Splitting it — using composition, from questions 4 and 6 — usually results in several smaller components, each with a much shorter, more focused list of props.

---

### ⚡ Signal 5: Unrelated Parts Re-render for Different Reasons

This one is about performance, not just readability. Consider:

```jsx
function Dashboard() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <ExpensiveChart />
        </div>
    );
}
```

Every keystroke in the search box re-renders `Dashboard` — and by default (from the Introduction & Fundamentals chapter), that means `ExpensiveChart` re-renders too, even though it has nothing to do with `searchTerm`. Pulling `ExpensiveChart` out into its own component doesn't automatically fix this by itself — but it's a *necessary first step*, because it's what makes it possible to wrap `ExpensiveChart` in `React.memo` (from question 8) and actually skip its re-render. You can't selectively memoize "half of a JSX return" — memoization only works at a component's boundary, so splitting is what makes the optimization possible in the first place.

---

### 💎 Good to Know: Don't Over-Split Either

Splitting too early or too aggressively — breaking every few lines of JSX into its own component "just in case" — has its own cost: too much indirection, and a codebase that's harder to navigate because you have to jump between many tiny files to understand one piece of UI. This specific anti-pattern is covered further in question 12.

---

### ❓ Follow-up Interview Questions

1. What's a warning sign that a component is doing too many unrelated jobs at once?
2. Why does copy-pasted, near-identical JSX suggest a missing reusable component?
3. Why might splitting a component with fifteen props into several smaller ones be an improvement?
4. In the `Dashboard`/`ExpensiveChart` example, why isn't splitting `ExpensiveChart` into its own component enough on its own to prevent unnecessary re-renders?
5. What's the downside of splitting a component into too many small pieces too early?

---

## 11. How should components be organized and structured in a large React application?

### 📖 Introduction

Once an app grows past a handful of components, *where* files live starts to matter just as much as what's inside them. There are two common ways to organize a React project, and they scale very differently.

---

### 📁 Type-Based Structure — Organize by Kind of File

```text
src/
  components/
    Button.jsx
    UserCard.jsx
    ProductCard.jsx
  hooks/
    useUser.js
    useProducts.js
  pages/
    HomePage.jsx
    ProductPage.jsx
```

Everything of the same "type" lives together — all components in one folder, all hooks in another. This feels natural for a small app. But as the app grows, everything related to a single feature — say, "Products" — ends up scattered across three completely separate top-level folders (`components`, `hooks`, `pages`), so even a small change to that one feature means jumping between folders that have nothing else in common.

---

### 🗂️ Feature-Based Structure — Organize by Part of the App

```text
src/
  features/
    products/
      ProductCard.jsx
      useProducts.js
      ProductPage.jsx
    users/
      UserCard.jsx
      useUser.js
  shared/
    components/
      Button.jsx
```

Here, everything related to one feature — component, hook, and page alike — lives together in one folder. Only genuinely reusable, cross-feature pieces (like a generic `Button`) live separately, in a `shared` folder.

---

### 🎯 Which Scales Better for Large Apps?

Feature-based structure tends to hold up much better as an app grows. Most day-to-day work happens inside one feature at a time, and keeping everything that feature needs physically close together means far less jumping around the codebase. Type-based structure tends to become genuinely painful once an app has more than a handful of features, exactly because related files end up scattered.

---

### 🛠️ A Few Extra Practical Habits

- Keep a `shared` (or `common`) folder for pieces genuinely reused across many features — a `Button`, `Input`, or `Modal` — so every feature isn't reinventing its own.
- Co-locate closely related files: a component's own test file or small local hook can live right next to it, instead of in a separate, mirrored folder structure elsewhere.
- Avoid deeply nested folders "just in case." A flatter structure inside each feature folder is usually easier to navigate than an unnecessarily deep one.

---

### 💎 Good to Know: There's No Single "Correct" Structure

The right structure genuinely depends on the size of the app and the team. A small app with a dozen components doesn't need a `features/` folder at all — adding that structure too early is its own kind of premature complexity, echoing the "don't over-split" caution from question 10.

---

### ❓ Follow-up Interview Questions

1. What's the main downside of type-based structure as an app grows?
2. In a feature-based structure, where would a `Products` feature's component, hook, and page all live?
3. What kind of component belongs in a `shared` folder rather than inside a specific feature folder?
4. Why is co-locating a component with its test file often better than keeping tests in a completely separate folder structure?
5. Is there one universally correct way to structure a React project? Why or why not?

---

## 12. What are common mistakes and anti-patterns in React component design?

### 📖 Introduction

Some component mistakes are subtle enough that they don't cause an error — the app still works, it's just harder to maintain, slower than it should be, or quietly buggy. Here are the ones that come up again and again.

---

### 🐘 Mistake 1: The "God Component" That Does Everything

A single component that fetches data, transforms it, and renders several unrelated sections of the page is a common early-warning sign — this is Signal 1 from question 10. The fix is usually to split it by responsibility.

---

### 🔬 Mistake 2: Splitting Too Early, Into Too Many Tiny Pieces

The opposite mistake also happens — breaking every small piece of JSX into its own component "just in case," which was flagged as its own caution at the end of question 10. Both extremes make a codebase harder to work with, just in different ways.

---

### ✋ Mistake 3: Mutating Props Directly

Props should always be treated as read-only. Changing them directly inside a component is a genuine, easy-to-miss mistake:

```jsx
function UserCard({ user }) {
    user.name = user.name.toUpperCase(); // ❌ mutating the prop directly

    return <h3>{user.name}</h3>;
}
```

Since `user` is an object, this doesn't just change the value locally — it mutates the *same* object the parent component is holding onto, potentially affecting other components that also received that same object, in ways that are very hard to trace back. The fix is to create a new value instead of changing the existing one:

```jsx
function UserCard({ user }) {
    const displayName = user.name.toUpperCase(); // ✅ a new value, original untouched

    return <h3>{displayName}</h3>;
}
```

---

### 🧮 Mistake 4: Cramming Complex Logic Directly Into JSX

```jsx
// Messy — hard to read at a glance
return (
    <div>
        {user && user.roles && user.roles.includes("admin") && user.isActive ? (
            <AdminPanel />
        ) : null}
    </div>
);
```

Pulling the condition out into a clearly-named variable before the `return` statement makes the intent immediately obvious:

```jsx
// Cleaner — the JSX reads like a sentence
const canSeeAdminPanel = user?.roles?.includes("admin") && user?.isActive;

return <div>{canSeeAdminPanel && <AdminPanel />}</div>;
```

---

### 🔑 Mistake 5: Using the Array Index as a Key

```jsx
{items.map((item, index) => <li key={index}>{item.text}</li>)}
```

This looks harmless, but it can cause real bugs when the list is reordered, filtered, or added to — this gets a full explanation, with examples of exactly what breaks, in the Lists & Keys chapter.

---

### 🏷️ Mistake 6: Vague, Unhelpful Component Names

Names like `Wrapper`, `Comp1`, or `Container2` tell you nothing about what a component actually does, and they make debugging in React DevTools noticeably harder — you'll see these exact names in the component tree while trying to track down an issue. A clear, specific name like `UserProfileCard` pays for itself the very first time you have to debug it.

---

### 💎 Good to Know: Several of These Get Even Deeper Treatment Later

Prop drilling, the specific dangers of unstable keys, and the performance cost of mutating state or creating new references on every render are all real enough topics to deserve their own full chapters — Props & State, Lists & Keys, and Performance Optimization, respectively.

---

### ❓ Follow-up Interview Questions

1. Why is directly mutating a prop object more dangerous than it might first appear?
2. What's a simple fix for JSX that's cluttered with complex inline conditions?
3. Why is using the array index as a key considered risky?
4. Why do vague component names like `Wrapper` or `Comp1` make debugging harder?
5. Name one mistake from this chapter that gets a full, dedicated explanation in a later chapter.

---

## 13. How would you design a reusable, shared component library for multiple applications?

### 📖 Introduction

Imagine several different teams, each building their own separate app, all needing the same basic building blocks — buttons, inputs, modals. A shared component library solves that. But building one that actually works well for everyone takes real planning, not just copying components into a new folder.

---

### 🧱 1. Keep Components Generic — No Business Logic Inside

A shared `Button` shouldn't know anything about "checkout" or "login" — it should just be a well-designed, flexible UI primitive. Anything tied to a specific app's business logic belongs in that app, not in the shared library.

---

### 🧩 2. Design Around Composition, Not Endless Props

Instead of adding a new prop for every possible variation, lean on the composition patterns from questions 4 and 6:

```jsx
// Fragile — needs a new prop for every possible icon position, every layout
<Button iconLeft="check" iconPosition="left" text="Save" />

// Flexible — the caller composes exactly what they need
<Button>
    <Icon name="check" />
    Save
</Button>
```

The second version lets every consuming app build the exact layout it needs, without the library having to anticipate every combination in advance.

---

### 🎨 3. Support Theming From the Start

Different apps usually need different branding — colors, fonts, spacing. A shared library should support this through something like CSS variables or a theme provider, rather than hardcoding one visual style that only works for the app it was originally built for.

---

### 📦 4. Version It Like a Real Package

Publish the library properly — to an internal or public package registry — and follow semantic versioning. This lets each consuming app choose *when* to pick up a new version, instead of every app being instantly affected the moment something in the library changes, including breaking changes.

---

### 📖 5. Document It Well

A library used by multiple teams needs clear documentation and interactive examples — a tool like Storybook is the common choice. Without this, other teams won't reliably know what's available or how to use it correctly, and they'll end up quietly rebuilding their own versions of components that already exist.

---

### ♿ 6. Bake In Accessibility Once, Benefit Everywhere

Getting things like keyboard navigation and proper ARIA attributes right takes real effort. Doing that work once, inside the shared library, means every app that uses it benefits automatically — instead of every team separately getting it right (or wrong) on their own.

---

### 🔌 7. Keep the Library's Own Dependencies Minimal

The library itself shouldn't assume a specific app's state management library or routing setup. This is the same underlying idea from question 2 — React itself doesn't dictate those choices, and a shared library sitting on top of React should follow that same discipline, depending on as little as possible beyond React itself.

---

### 💎 Good to Know: This Overhead Isn't Always Worth It Yet

A shared component library isn't free — it needs its own release process, its own tests, and someone responsible for maintaining it. For a company with just one or two apps, that overhead may not be worth paying yet. It becomes genuinely worthwhile once enough teams exist that duplicated, inconsistent UI code has become a bigger problem than the cost of maintaining something shared.

---

### ❓ Follow-up Interview Questions

1. Why shouldn't a shared `Button` component contain any business-specific logic?
2. How does composition help a shared component avoid needing a huge number of configuration props?
3. Why does proper versioning matter more for a shared library than for a single app's own components?
4. What real problem does documentation (like Storybook) solve for a component library used by multiple teams?
5. Is a shared component library always worth building? What determines whether it's actually worth the overhead?

---

## 14. How do controlled vs. uncontrolled component choices impact performance and maintainability at scale?

### 📖 Introduction

Question 7 covered the basic difference between controlled and uncontrolled components. This question looks at what happens when you scale that choice up — to a form with dozens of fields, or a component used throughout a large application.

---

### 🐢 Performance: Why Controlled Components Can Slow Down Large Forms

```jsx
function BigForm() {
    const [formData, setFormData] = useState({
        field1: "",
        field2: "",
        // ...28 more fields
    });

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    // every keystroke, in any single field, re-renders this whole component
}
```

Since all 30 fields live in one piece of state, typing a single character in *any* field triggers a state update, which re-renders `BigForm` — meaning React redoes the Render Phase work (from the Introduction & Fundamentals chapter) for the entire form, on every keystroke, even though only one field's value actually changed.

---

### ⚡ Performance: Why Uncontrolled Components Scale Better

With uncontrolled inputs, the DOM manages each field's value independently, and there's no state update happening on every keystroke at all — so there's nothing triggering a re-render of the whole form as you type. This is exactly why libraries built for large forms, like React Hook Form, use uncontrolled inputs internally — covered in full in the Forms chapter.

---

### 🧠 Maintainability: The Trade-off in the Other Direction

Controlled components make certain things easier: since React always knows the current value of every field, live validation, conditionally disabling a submit button, or showing/hiding fields based on what's currently typed are all straightforward — the data driving those decisions is already sitting right there in state.

With uncontrolled components, React doesn't know a field's value until it explicitly goes and reads it — usually only at submit time. Reacting to a value *as it changes* means manually wiring up extra listeners or refs outside of React's normal data flow, which can get messy fast if you need it in more than one or two places.

---

### ⚖️ The Real Trade-off at Scale

Neither approach is simply "better" — it's a genuine trade-off. Uncontrolled components tend to win on raw performance for large forms with simple, infrequent validation needs. Controlled components tend to win on maintainability whenever the UI needs to actively react to what's currently being typed.

---

### 💎 Good to Know: Modern Form Libraries Try to Get Both

This is exactly the problem libraries like React Hook Form are built to solve — using uncontrolled inputs internally for performance, while still offering a way to subscribe to a specific field's live value only when you actually need to react to it (rather than the entire form re-rendering on every change). This hybrid approach is why most large, real-world forms reach for a library like this rather than hand-rolling either a purely controlled or purely uncontrolled version. The full picture is covered in the Forms chapter.

---

### ❓ Follow-up Interview Questions

1. In the `BigForm` example, why does typing in one field cause the entire form to re-render?
2. Why don't uncontrolled inputs cause the same re-render-on-every-keystroke behavior?
3. What becomes harder to implement once you switch from controlled to uncontrolled inputs?
4. Is it accurate to say uncontrolled components are always the better choice for performance? Why or why not?
5. How do libraries like React Hook Form try to get the benefits of both approaches at once?

---