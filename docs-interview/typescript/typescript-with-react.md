---
title: TypeScript with React
description: Typing props, hooks, events, and components in a React + TypeScript codebase.
sidebar_position: 11
---

# TypeScript with React

## 1. Why should you use TypeScript with React, and what are the benefits and challenges of building React applications with TypeScript?

### 📖 Introduction

React itself doesn't care what language you write components in — but the moment an application grows past a handful of components, knowing exactly what props a component expects, what a hook returns, and what shape your data has becomes exactly the kind of problem TypeScript was built to solve, as covered all the way back in the Introduction chapter.

---

### ✅ The Benefits, Applied Specifically to React

**Compile-time prop checking.** Before TypeScript was common in React codebases, the standard tool was `PropTypes` — but `PropTypes` only validates props at **runtime**, only in development mode, and only logs a console warning rather than stopping anything:

```typescript
// PropTypes: still lets the app run, just logs a warning during development
Greeting.propTypes = {
    name: PropTypes.string.isRequired,
};
```

```typescript
// TypeScript: the mistake never reaches runtime at all
interface GreetingProps {
    name: string;
}

function Greeting({ name }: GreetingProps) {
    return <p>Hello, {name}</p>;
}

<Greeting name={42} />; // ❌ Compile error — caught before the app ever runs
```

**Autocomplete and refactoring safety.** An editor can autocomplete a component's exact props, a hook's exact return values, and immediately flag every call site if a prop is renamed — the same refactoring confidence from the Introduction chapter, now applied across an entire component tree.

**Type-safe event handlers.** As covered in question 2, an event handler's parameter is checked against the exact DOM event type it will actually receive, catching a wrong assumption about an event's shape immediately.

---

### ⚠️ The Real Challenges

- **Generic components can get verbose.** A reusable component that works with any data type (question 4) requires more type ceremony than the equivalent plain JavaScript version.
- **Third-party component libraries sometimes have incomplete or outdated types**, requiring the same `@types` or manual declaration workarounds from the Modules & Declaration Files chapter.
- **Hooks, refs, and context have real typing nuances** (question 3) that take genuine time to learn — a `useRef` for a DOM node and a `useRef` for a mutable value, for example, behave differently enough to trip up newcomers.
- **`.tsx` is required, not `.ts`**, for any file containing JSX syntax — a small but easy-to-forget practical detail when creating a new component file.

---

### ❓ Follow-up Interview Questions

1. How did `PropTypes` validate props differently from how TypeScript does?
2. Does a `PropTypes` mismatch stop the application from running?
3. What specifically makes generic components more verbose than typical React code?
4. Why might a third-party component library still cause type errors even if it's popular and well-maintained?
5. What file extension does a component containing JSX need, and why does it matter?

---

## 2. How do you type React components, props, state, and events in TypeScript?

### 📖 Introduction

Props, basic state, and events are the three things nearly every component touches. Hooks get their own full treatment in the next question — this one covers the component's own shape and the events it responds to.

---

### 🧩 Typing Props

The standard approach is a plain `interface` (from the Objects & Interfaces chapter) describing exactly what the component accepts, with the component written as an ordinary function:

```typescript
interface GreetingProps {
    name: string;
    age?: number; // optional prop
}

function Greeting({ name, age }: GreetingProps) {
    return <p>Hello, {name}{age && ` (${age})`}</p>;
}
```

---

### 💎 Good to Know: `React.FC` Is Usually Best Avoided

You'll often see components typed with `React.FC<Props>` instead:

```typescript
const Greeting: React.FC<GreetingProps> = ({ name }) => <p>Hello, {name}</p>;
```

This works, but has a couple of real downsides that make plain function typing (as shown above) the more commonly recommended approach today: `React.FC` used to implicitly add a `children` prop to every component whether it accepted one or not, and it interacts awkwardly with generic components (question 4), since arrow function type annotations don't have a clean way to declare a type parameter.

---

### 👶 Typing `children` Explicitly

When a component genuinely does accept children, `React.ReactNode` is the right type — it covers everything React can actually render (elements, strings, numbers, arrays of these, `null`):

```typescript
interface CardProps {
    title: string;
    children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
    return (
        <div>
            <h2>{title}</h2>
            {children}
        </div>
    );
}
```

---

### 🔢 Basic State with `useState`

A quick preview before the full hooks question — `useState` infers its type from the initial value you give it:

```typescript
function Counter() {
    const [count, setCount] = useState(0); // inferred as number, per the Type System chapter's inference rules
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

### 🖱️ Typing Events

React re-wraps native DOM events in its own synthetic event types, parameterized by the specific element the handler is attached to:

```typescript
function SearchBox() {
    const [query, setQuery] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value); // ✅ event.target is known to be an HTMLInputElement
    }

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        console.log("Clicked at", event.clientX, event.clientY);
    }

    return (
        <>
            <input value={query} onChange={handleChange} />
            <button onClick={handleClick}>Search</button>
        </>
    );
}
```

The type argument (`HTMLInputElement`, `HTMLButtonElement`) matters — it's what makes `event.target.value` type-check safely on an `<input>` but correctly refuse to compile the same access on a `<button>`, which has no `.value` property at all.

---

### ❓ Follow-up Interview Questions

1. Why is a plain function with a `Props` interface generally preferred over `React.FC<Props>`?
2. What type correctly describes a `children` prop that could be text, elements, or nothing at all?
3. How does `useState(0)` know to infer `count` as `number` without an explicit annotation?
4. Why does `React.ChangeEvent<HTMLInputElement>` need a type argument at all?
5. What would go wrong if `handleClick` were typed with `HTMLInputElement` instead of `HTMLButtonElement`?

---

## 3. How do you use TypeScript with React Hooks such as `useState`, `useEffect`, `useRef`, `useReducer`, and `useContext`?

### 📖 Introduction

Each hook has its own typing quirks — some need an explicit type argument to avoid an overly narrow inference, and a couple (`useRef`, `useContext`) have genuinely different behavior depending on how they're typed.

---

### 🔢 `useState` — When Inference Isn't Enough

`useState(0)` infers `number` correctly on its own, but a state value that starts out empty needs an explicit type argument, or TypeScript infers something far too narrow:

```typescript
const [user, setUser] = useState(null); // inferred as: null — not useful at all

const [user, setUser] = useState<User | null>(null); // ✅ explicit — correctly allows either
```

Without the explicit `<User | null>`, TypeScript has nothing to infer a broader type from — `null` is the only value it ever saw — so `setUser` would refuse to ever accept an actual `User` later.

---

### ⚡ `useEffect` — The Cleanup Function Gotcha

`useEffect`'s callback must return either a cleanup function or `undefined` — nothing else. This is exactly why the callback itself can never be `async`:

```typescript
useEffect(() => {
    async function loadUser() {
        const data = await fetchUser(1);
        setUser(data);
    }
    loadUser(); // ✅ call an async function from inside, don't make the effect callback itself async
}, []);
```

An `async` function always returns a `Promise` (from the Functions chapter), never a valid cleanup function — so `useEffect(async () => { ... }, [])` is a type error, not just a style preference.

---

### 📌 `useRef` — Two Genuinely Different Behaviors

`useRef` behaves differently depending on what you're using it for, and TypeScript reflects that difference directly in the type of `.current`.

**Referencing a DOM element** — initialized with `null`, and read-only in practice (React itself sets `.current` when the element mounts):

```typescript
function TextInput() {
    const inputRef = useRef<HTMLInputElement>(null);

    function focusInput() {
        inputRef.current?.focus(); // optional chaining — .current might still be null
    }

    return <input ref={inputRef} />;
}
```

**Storing a mutable value across renders** — initialized with a real starting value, and freely mutable:

```typescript
function Timer() {
    const intervalId = useRef<number>(0);

    intervalId.current = window.setInterval(() => {}, 1000); // ✅ direct mutation, no null involved
}
```

The difference comes entirely from how `useRef` is called: giving it `null` as the initial value produces a ref meant for a DOM node (where `.current` might briefly be `null` before mounting), while giving it a real initial value produces a plain mutable container.

---

### 🔀 `useReducer` — A Natural Home for Discriminated Unions

The `Action` discriminated union from the Advanced Types chapter fits `useReducer` directly — this is exactly the pattern that hook was designed around:

```typescript
interface State {
    count: number;
}

type Action =
    | { type: "increment"; amount: number }
    | { type: "decrement"; amount: number }
    | { type: "reset" };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "increment":
            return { count: state.count + action.amount };
        case "decrement":
            return { count: state.count - action.amount };
        case "reset":
            return { count: 0 };
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });
    return <button onClick={() => dispatch({ type: "increment", amount: 1 })}>{state.count}</button>;
}
```

`dispatch` is automatically typed to only accept a valid `Action` — attempting `dispatch({ type: "invalid" })` is caught immediately.

---

### 🌐 `useContext` — Avoiding an Unwanted `undefined`

`createContext` needs an initial value, but there's often no sensible default before a provider has actually supplied one. Typing the context as possibly `undefined`, then narrowing in a small wrapper hook, is the standard solution:

```typescript
interface AuthContextValue {
    user: User;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context; // ✅ narrowed — no longer possibly undefined
}
```

Every component calls `useAuth()` instead of `useContext(AuthContext)` directly, so the rest of the app never has to deal with the `undefined` case at all — it's handled once, in one place.

---

### ❓ Follow-up Interview Questions

1. Why does `useState(null)` need an explicit type argument to be useful later?
2. Why can't the function passed to `useEffect` be declared `async`?
3. What determines whether a `useRef` call is meant for a DOM node versus a plain mutable value?
4. How does the `Action` discriminated union from the Advanced Types chapter make `dispatch` safer?
5. Why does `useAuth` throw an error instead of just returning `context` directly from `useContext`?

---

## 4. How do generic components, custom hooks, and `forwardRef` work in React with TypeScript?

### 📖 Introduction

The Generics chapter previewed a generic `List<T>` component and a `useLocalStorage<T>` hook as a glimpse of generics doing real work in React. This question fills in the rest: a syntax quirk generic components hit specifically in `.tsx` files, a fresh custom hook example, and `forwardRef` — not covered anywhere yet.

---

### 🧩 Generic Components: A `.tsx`-Specific Syntax Quirk

The `List<T>` component from the Generics chapter worked as a regular function. Writing the same thing as an arrow function hits a real parsing ambiguity in `.tsx` files — `<T>` alone looks like the start of a JSX tag to the parser:

```typescript
const List = <T>({ items, renderItem }: ListProps<T>) => { /* ... */ };
// ❌ Parsing error in a .tsx file — TypeScript can't tell this apart from JSX
```

The fix is a trailing comma after the type parameter, which disambiguates it from JSX:

```typescript
const List = <T,>({ items, renderItem }: ListProps<T>) => {
    return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
};
```

This is purely a `.tsx` parsing quirk — the same code as a `function List<T>(...)` declaration (as shown in the Generics chapter) never runs into it at all, which is one reason many teams prefer the `function` form for generic components specifically.

---

### 🪝 A Fresh Custom Hook: `useFetch<T>`

The Generics chapter's `useLocalStorage<T>` showed a generic hook backed by synchronous storage. Data fetching is the other extremely common case, combining generics with the `async`/`Promise<T>` typing from the Functions chapter:

```typescript
function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(url)
            .then((response) => response.json())
            .then((json: T) => setData(json))
            .finally(() => setLoading(false));
    }, [url]);

    return { data, loading } as const;
}

const { data: users, loading } = useFetch<User[]>("/api/users"); // data: User[] | null
```

One hook, reused for any endpoint and any response shape, with `data` always precisely typed to whatever `T` was requested.

---

### 🔗 `forwardRef`: Passing a Ref Through to a Child Element

A component normally can't receive a `ref` as a regular prop — `forwardRef` is what allows a parent to reach directly into a child component's underlying DOM node. It takes **two** type parameters: the type of the thing being referenced first, then the component's props:

```typescript
interface InputProps {
    label: string;
}

const TextInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return (
        <label>
            {props.label}
            <input ref={ref} />
        </label>
    );
});

function Form() {
    const inputRef = useRef<HTMLInputElement>(null);
    return <TextInput label="Name" ref={inputRef} />;
}
```

The type argument order — ref type, then props type — is easy to get backwards, since it's the reverse of how you'd normally think about the component ("here are its props, and also, here's the ref").

---

### ❓ Follow-up Interview Questions

1. Why does `const List = <T>(...) => {...}` fail to parse in a `.tsx` file, and what fixes it?
2. Why doesn't a `function List<T>(...)` declaration have the same parsing problem?
3. What does `useFetch<T>` gain from being generic instead of hardcoded to one specific data shape?
4. Why can't a component simply accept `ref` as a normal prop without `forwardRef`?
5. What are `forwardRef`'s two type parameters, and in what order do they go?

---

## 5. How do you type API requests, responses, forms, React Query, and Redux Toolkit in TypeScript to build scalable React applications?

### 📖 Introduction

This closing question brings together patterns from across the entire guide — generics, discriminated unions, utility types — applied to the four things almost every real React application eventually needs: talking to an API, handling forms, a data-fetching library, and shared state management.

---

### 🌐 API Requests and Responses

The `fetchData<T>` pattern from the Generics chapter combines naturally with the `Resource<T>` discriminated union from the Advanced Types chapter to model a request's full lifecycle, not just its eventual success:

```typescript
type Resource<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: string };

async function fetchUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
}
```

A component can then handle every state explicitly, rather than assuming the request always succeeds.

---

### 📝 Forms

Typing a form combines `useState` and the event typing from question 2, and often benefits from the `FieldConfig<T>` mapped-type pattern shown in the Utility Types chapter — generating a form's structure directly from the same interface used elsewhere in the app:

```typescript
interface SignupForm {
    name: string;
    email: string;
}

function SignupPage() {
    const [form, setForm] = useState<SignupForm>({ name: "", email: "" });

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    return (
        <>
            <input name="name" value={form.name} onChange={handleChange} />
            <input name="email" value={form.email} onChange={handleChange} />
        </>
    );
}
```

---

### 🔄 React Query

Data-fetching libraries like React Query are generic over both the data they return and the error type they might throw, which is exactly what makes their results fully typed without any manual assertions:

```typescript
const { data, error } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
});
// data: User[] | undefined, error: Error | null
```

`useMutation` follows the same idea, additionally typing the input the mutation expects:

```typescript
const mutation = useMutation<User, Error, CreateUserInput>({
    mutationFn: createUser,
});
```

---

### 🗃️ Redux Toolkit

Redux Toolkit's `createSlice` is really the `useReducer` pattern from question 3, formalized for application-wide state — each action creator is generated automatically from the reducer's own keys, and payloads are typed with `PayloadAction<T>`:

```typescript
interface CounterState {
    count: number;
}

const counterSlice = createSlice({
    name: "counter",
    initialState: { count: 0 } as CounterState,
    reducers: {
        incremented(state, action: PayloadAction<number>) {
            state.count += action.payload;
        },
    },
});

type RootState = ReturnType<typeof store.getState>; // from the Utility Types chapter
type AppDispatch = typeof store.dispatch;
```

`RootState` and `AppDispatch` are themselves derived using `ReturnType` and `typeof` (from the Utility Types and Advanced Types chapters) directly from the actual store — so the types can never drift out of sync with the real, running store configuration.

---

### ❓ Follow-up Interview Questions

1. Why does wrapping an API response in a `Resource<T>` discriminated union help more than a plain `Promise<T>` alone?
2. How does the `FieldConfig<T>` pattern from the Utility Types chapter apply to typing a form?
3. What two type parameters does `useQuery` typically need, and what does each one describe?
4. How does Redux Toolkit's `createSlice` relate to the `useReducer` pattern from an earlier question?
5. Why are `RootState` and `AppDispatch` derived with `ReturnType` and `typeof` instead of being written out by hand?

---