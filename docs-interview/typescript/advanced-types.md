---
title: Advanced Types
description: Union, intersection, conditional, and mapped types.
sidebar_position: 7
---

# Advanced Types

## 1. What are advanced types in TypeScript, and how do they help build more expressive, flexible, and type-safe applications?

### 📖 Introduction

Most of the types we've used so far describe something fixed — an interface with a specific set of properties, a union of specific literal values. But real applications often need a type that isn't independent at all — it's a **rule** applied to some other type: "the optional version of this interface," "the return type of this specific function," "this type, but only if it's a string." Advanced types are how TypeScript expresses relationships like that.

---

### 🧱 What Makes a Type "Advanced"?

Every type we've covered up to this chapter was declared **independently** — you wrote out `User`'s properties by hand, or listed `Status`'s literal values directly. An advanced type is different: it's **computed** or **derived** from another type, so that if the original type changes, the derived one updates automatically.

This chapter covers four building blocks for that kind of computation: **union** and **intersection** (combining existing types), **mapped types** (transforming a type's properties), and **conditional types** (branching based on a condition) — plus template literal types, for building new string types out of others.

---

### 🔗 A Quick Recap: Union and Intersection

These two were already covered in depth in earlier chapters, so just a quick reminder of where they fit into this bigger picture:

- A **union** (`A | B`, from the Type System chapter) says "this could be either of these."
- An **intersection** (`A & B`, from the Objects & Interfaces chapter) says "this must be both of these at once."

Both are already a form of building a new type out of existing ones — advanced types simply take that idea much further.

---

### 🗺️ Mapped Types: Deriving a New Shape From an Existing One

A mapped type takes an existing type's properties and transforms every one of them the same way, using the `keyof` and indexed access mechanics from the Generics chapter:

```typescript
interface User {
    id: number;
    name: string;
}

type PartialUser = {
    [K in keyof User]?: User[K];
};
// equivalent to: { id?: number; name?: string }
```

Instead of manually writing a second, "optional" version of `User` and keeping it in sync by hand forever, `PartialUser` is generated directly from `User` — if a property is ever added to `User`, `PartialUser` picks it up automatically. This exact pattern is also how TypeScript's own built-in `Partial<T>` utility type works, covered fully in the Utility Types chapter.

---

### 🔀 Conditional Types: Types That Branch on a Condition

A conditional type picks between two types based on whether one type is assignable to another — the type-level equivalent of an `if`/`else`:

```typescript
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"
```

This lets a type's shape change depending on what it's given — something no fixed interface or plain union could express on its own.

---

### 🔤 Template Literal Types: Building New String Types

Template literal types apply the same syntax as a JavaScript template string, but at the type level, to build new string types out of existing ones:

```typescript
type Greeting = `Hello, ${string}`;

const message: Greeting = "Hello, Vaibhav"; // ✅
const invalid: Greeting = "Hi, Vaibhav";     // ❌ Error: doesn't match the pattern
```

---

### 🎯 The Real Benefit: Types That Stay in Sync Automatically

The throughline across all of these is the same one that motivated generics in the previous chapter: avoiding duplication that can silently drift out of sync. A hand-written "optional version" of an interface can be forgotten and left stale after a refactor; a mapped type derived from that same interface never can be, because it's recomputed from the source every time.

---

### 💎 Good to Know: What's Coming Next in This Chapter

This question only previewed each concept. Mapped types, conditional types, template literal types, and the `infer` keyword (for extracting a type out of another type mid-condition) each get a full, dedicated question later in this chapter.

---

### ❓ Follow-up Interview Questions

1. What's the key difference between a type declared independently and one considered "advanced"?
2. What problem does a mapped type solve that manually duplicating an interface doesn't?
3. What is the type-level equivalent of an `if`/`else` statement in TypeScript?
4. How do template literal types relate to JavaScript's own template strings?
5. Why is a type derived from another type less likely to become outdated than a hand-written duplicate?

---

## 2. How do intersection types, type guards, and control flow analysis work together to safely narrow types?

### 📖 Introduction

The Type System chapter showed narrowing with `typeof`, `instanceof`, and `in`. What makes narrowing actually work behind the scenes is called **control flow analysis** — and once you understand it as its own mechanism, you can also write your own custom narrowing functions, and even narrow a plain type into a full intersection type.

---

### 🔍 Control Flow Analysis: TypeScript Tracks Type Through Your Code

Control flow analysis is TypeScript following the actual, reachable path through your code — the same way a debugger would step through it — and recalculating a variable's type at every single point based on what's already happened before it.

This is why narrowing can survive an early return, even with no `else` in sight:

```typescript
function process(value: string | null) {
    if (value === null) {
        return;
    }

    value.toUpperCase(); // ✅ narrowed to string — TypeScript knows any path reaching here already ruled out null
}
```

TypeScript reasons: "the only way to reach this line is if the `if` block didn't return — and the only way it doesn't return is if `value` isn't `null`." That's control flow analysis, not a special narrowing rule specific to `null`.

The same tracking applies to plain reassignment, not just conditionals:

```typescript
let id: string | number;

id = "abc";
id.toUpperCase(); // ✅ narrowed to string, right after this assignment

id = 5;
id.toFixed(2); // ✅ narrowed to number, right after this one
```

---

### 🛡️ Custom Type Guards: Writing Your Own Narrowing Functions

The built-in narrowing techniques from the Type System chapter (`typeof`, `instanceof`, `in`) cover a lot, but sometimes you need custom logic to decide which type something actually is. A function can declare itself as a **type guard** using the `is` syntax in its return type:

```typescript
interface Cat {
    meow(): void;
}
interface Dog {
    bark(): void;
}

function isCat(animal: Cat | Dog): animal is Cat {
    return (animal as Cat).meow !== undefined;
}

function makeSound(animal: Cat | Dog) {
    if (isCat(animal)) {
        animal.meow(); // ✅ narrowed to Cat
    } else {
        animal.bark(); // ✅ narrowed to Dog — the only thing left in the union
    }
}
```

`animal is Cat` tells TypeScript: "if this function returns `true`, treat `animal` as a `Cat` from that point on." Control flow analysis then applies that promise everywhere the function is called, exactly as if it were a built-in check like `typeof`.

---

### 🧬 Narrowing Into an Intersection Type

Type guards aren't limited to picking between existing union members — they can also narrow a plain type **into an intersection**, effectively confirming that a value has extra capabilities beyond what its declared type promises:

```typescript
interface Playable {
    play(): void;
}
interface Pausable {
    pause(): void;
}

function isPausable(player: Playable): player is Playable & Pausable {
    return typeof (player as Pausable).pause === "function";
}

function controlMedia(player: Playable) {
    if (isPausable(player)) {
        player.pause(); // ✅ narrowed to Playable & Pausable here
    }
    player.play(); // ✅ still just Playable — the guard's effect doesn't apply outside the "if"
}
```

This combines all three pieces from this question's title: **intersection types** (from the Objects & Interfaces and Generics chapters) as the target of the narrowing, a **custom type guard** as the mechanism, and **control flow analysis** as what confines the narrowed type strictly to the block where the check passed.

---

### 💎 Good to Know: Narrowing Resets Once Its Scope Ends

Notice in the example above that `player.pause()` only compiles *inside* the `if` block — outside it, `player` reverts to its original, wider type. Control flow analysis only trusts a narrowed type for as long as the reachable code path guarantees the check actually happened; once you're back outside that path, the guarantee no longer holds, so the type widens back.

---

### ❓ Follow-up Interview Questions

1. What is control flow analysis actually tracking as it moves through a function?
2. Why does `value.toUpperCase()` compile after an early `return`, with no `else` block at all?
3. What does the `is` keyword in a function's return type actually promise to the caller?
4. Can a type guard narrow a value into an intersection type, rather than just picking between union members?
5. Why does a narrowed type revert back to its original, wider type once you leave the block where the check happened?

---

## 3. How do the `typeof`, `instanceof`, and `in` operators work in TypeScript, and when should you use each for type narrowing?

### 📖 Introduction

The Type System chapter mentioned these three briefly as narrowing tools. Each one actually checks something fundamentally different at runtime, which is exactly why each is suited to a different kind of union — mixing them up is one of the more common sources of confusing narrowing bugs.

---

### 🔤 `typeof` — Narrowing Primitives

`typeof` checks a value's primitive JavaScript type: `"string"`, `"number"`, `"boolean"`, `"bigint"`, `"symbol"`, `"undefined"`, or `"function"`.

```typescript
function format(value: string | number) {
    if (typeof value === "string") {
        return value.toUpperCase(); // ✅ narrowed to string
    }
    return value.toFixed(2); // ✅ narrowed to number
}
```

`typeof` is only useful here because both members of the union are primitives with genuinely different `typeof` results. It falls apart the moment you need to distinguish between two **objects**, because every plain object, array, and class instance all report the same thing: `"object"`.

---

### 💎 Good to Know: The `typeof null` Quirk

`typeof null` famously returns `"object"`, not `"null"` — a long-standing JavaScript quirk. This actually makes `typeof value === "object"` a valid (if confusing) way to narrow specifically to `null` in a union of primitives:

```typescript
function process(value: string | null) {
    if (typeof value === "object") {
        // value is narrowed to `null` here — the only "object"-like member of this union
    }
}
```

In practice, an explicit `value === null` check (from the Type System chapter) is much clearer — but recognizing this quirk is important, since it explains why `typeof` alone can never reliably distinguish one object shape from another.

---

### 🏛️ `instanceof` — Narrowing Class Instances

`instanceof` checks whether an object's prototype chain includes a specific class — which means it only works with actual classes, not interfaces or plain object shapes:

```typescript
class ApiError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
    }
}

function handleError(error: Error) {
    if (error instanceof ApiError) {
        console.log(error.statusCode); // ✅ narrowed to ApiError
    } else {
        console.log(error.message); // ✅ still just Error
    }
}
```

---

### 🚫 Why `instanceof` Doesn't Work With Interfaces

```typescript
interface Cat {
    meow(): void;
}

function handle(x: unknown) {
    if (x instanceof Cat) { // ❌ Error: "Cat" only refers to a type, but is being used as a value here
        // ...
    }
}
```

This fails for a fundamental reason from the Introduction chapter: type erasure. `interface Cat` exists only at compile time — there's no actual `Cat` constructor function left at runtime for `instanceof` to check against. `instanceof` can only ever check something that still exists after compilation, which means real classes, never interfaces or type aliases.

---

### 🔑 `in` — Narrowing by Property Existence

`in` checks whether a specific property name exists on an object at runtime — which makes it the right tool for narrowing between plain object shapes that have no shared class or discriminant field:

```typescript
interface Cat {
    meow(): void;
}
interface Dog {
    bark(): void;
}

function makeSound(animal: Cat | Dog) {
    if ("meow" in animal) {
        animal.meow(); // ✅ narrowed to Cat
    } else {
        animal.bark(); // ✅ narrowed to Dog
    }
}
```

---

### 🔄 `in` vs. a Custom Type Guard

This is the exact same `Cat | Dog` scenario from the previous question's `isCat` custom type guard — but `in` solves it directly, with no separate function needed at all. Reach for a custom type guard (`is`) when the check requires real logic beyond a simple property check; reach for `in` when checking that a property merely exists is enough to tell two shapes apart.

---

### ⚖️ Summary: Which Operator for Which Situation

| Operator | Checks | Works well for | Doesn't work for |
|---|---|---|---|
| `typeof` | The value's primitive JS type | Distinguishing primitives in a union | Telling two object shapes apart (all report `"object"`) |
| `instanceof` | Whether the prototype chain includes a class | Distinguishing real class instances | Interfaces and type aliases (erased — no runtime constructor) |
| `in` | Whether a property name exists on the object | Distinguishing plain object shapes at runtime | Primitives (there's nothing to check a property on) |

---

### ❓ Follow-up Interview Questions

1. Why can't `typeof` distinguish between two different object shapes?
2. What does `typeof null` actually return, and why does that matter for narrowing?
3. What is `instanceof` checking at runtime?
4. Why does using `instanceof` with an interface produce a compile error instead of just not narrowing?
5. When would you reach for a custom `is` type guard instead of a simple `in` check, or vice versa?

---

## 4. What are discriminated unions, how do they work, and why are they one of the most powerful patterns in TypeScript?

### 📖 Introduction

The Type System chapter introduced discriminated unions briefly, with a shape example. This question makes the case for *why* this pattern gets singled out as one of the most powerful in the entire language — it's not just a narrowing convenience, it's a design tool that can make incorrect states impossible to construct in the first place.

---

### 🔖 Quick Recap: What Makes a Union "Discriminated"

A discriminated union is a union of object types that all share one common property — the **discriminant** — typed as a unique literal value in each member. Checking that one property (`if (shape.kind === "circle")`) narrows the *entire* object, giving you safe access to whatever other properties belong only to that variant.

---

### 🚫 The Problem It Solves: Making Illegal States Unrepresentable

Without a discriminant, developers often model different "modes" of the same data using a pile of optional properties on one interface:

```typescript
interface FormState {
    status: "idle" | "loading" | "success" | "error";
    data?: string;
    error?: string;
}

// ⚠️ Nothing stops this from compiling — it's nonsensical, but "valid":
const confused: FormState = { status: "success", error: "Something broke" };
```

Nothing here prevents `status: "success"` from existing without `data`, or existing *together* with an `error` message that shouldn't apply. The type technically describes the data, but it doesn't prevent combinations that should never happen.

A discriminated union fixes this by tying each property directly to the state it actually belongs to:

```typescript
type FormState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: string }
    | { status: "error"; error: string };

function render(state: FormState) {
    switch (state.status) {
        case "success":
            return state.data;  // ✅ guaranteed to exist whenever status is "success"
        case "error":
            return state.error; // ✅ guaranteed to exist whenever status is "error"
        default:
            return null;
    }
}
```

Now `data` can't exist without `status: "success"`, and `error` can't exist without `status: "error"` — the invalid combination from before literally cannot be constructed anymore. This is often summarized as **making illegal states unrepresentable**: instead of writing code to check for a bad combination, you design the type so that combination was never possible to create.

---

### 🛡️ Exhaustiveness Checking in Practice

Discriminated unions combine especially well with the `never`-based exhaustiveness check from the Type System chapter — this is the pattern behind typing something like a Redux-style reducer or an event dispatcher:

```typescript
type Action =
    | { type: "increment"; amount: number }
    | { type: "decrement"; amount: number }
    | { type: "reset" };

function reducer(state: number, action: Action): number {
    switch (action.type) {
        case "increment":
            return state + action.amount; // ✅ "amount" only exists on this variant
        case "decrement":
            return state - action.amount;
        case "reset":
            return 0;
        default:
            const exhaustive: never = action; // ❌ compile error if a new Action variant is ever added and not handled here
            return state;
    }
}
```

If a teammate adds a new action type — say, `{ type: "set"; value: number }` — and forgets to add a `case` for it, the `default` branch stops compiling immediately, because `action` is no longer narrowed all the way down to `never`. The missing case is caught the moment it's introduced, not discovered later when the wrong action silently falls through to `default`.

---

### 🎯 What Makes a Valid Discriminant

For this pattern to work, the shared property must be:

- **A literal type** in every member (a specific string, number, or boolean — not a general `string`).
- **Required**, not optional, in every member.
- **Unique** per member, so checking its value can only ever match one variant.

---

### 🔄 When You Don't Control the Shape

Discriminated unions work best when you're designing the types from scratch. If you're working with existing interfaces that were never given a shared tag — like the `Cat | Dog` example from earlier questions — you fall back to the tools from this chapter's earlier questions instead: an `in` check (question 3) if a distinguishing property already exists, or a custom type guard (question 2) if telling them apart needs real logic.

---

### ❓ Follow-up Interview Questions

1. What three requirements must a property satisfy to work as a valid discriminant?
2. What does "making illegal states unrepresentable" mean in practice?
3. How does checking a discriminant property narrow an entire object, not just that one property?
4. In the reducer example, what specifically causes the `default` branch to stop compiling if a new action type is added?
5. If you're working with existing types that have no shared tag property, what alternatives from this chapter can you fall back on?

---

## 5. How do `keyof`, indexed access types, and `typeof` work together to create reusable and expressive type definitions?

### 📖 Introduction

Question 3 covered `typeof` as a **runtime** operator used for narrowing — `typeof value === "string"`. This question is about a completely different `typeof`: a **type-level** operator that extracts a type directly from an existing value. Combined with `keyof` and indexed access (from the Generics chapter), it becomes one of the most practical tools for keeping types and real data permanently in sync.

---

### 🔍 Type-Level `typeof`: Extracting a Type From a Value

Instead of writing out a type by hand and hoping it matches some real object, `typeof` (in a type position) reads the type directly off that object:

```typescript
const user = {
    id: 1,
    name: "Vaibhav",
    isActive: true,
};

type User = typeof user;
// { id: number; name: string; isActive: boolean }
```

If `user`'s shape ever changes, `User` updates automatically — there's no separate declaration to forget to update.

---

### 🔑 `keyof typeof`: A Union of an Object's Keys

A very common real-world idiom combines `typeof` with `keyof` to pull a union of key names directly out of a plain object — often used as a safer, more flexible alternative to `enum` (a preference mentioned back in the Type System chapter):

```typescript
const Colors = {
    Red: "RED",
    Green: "GREEN",
    Blue: "BLUE",
} as const;

type ColorKey = keyof typeof Colors;               // "Red" | "Green" | "Blue"
type ColorValue = (typeof Colors)[keyof typeof Colors]; // "RED" | "GREEN" | "BLUE"
```

The `as const` here matters just as much as it did with the array example in the Generics chapter — without it, `Colors`'s properties would widen to plain `string`, and both derived types would collapse to just `string` instead of the precise literal unions shown above.

---

### 🧭 Combining All Three: A Real-World Example

Here's the pattern applied to something genuinely common — a type-safe routing table, where the valid route names and their paths are both derived from one single object:

```typescript
const routes = {
    home: "/",
    about: "/about",
    contact: "/contact",
} as const;

type RouteName = keyof typeof routes;         // "home" | "about" | "contact"
type RoutePath = (typeof routes)[RouteName];   // "/" | "/about" | "/contact"

function navigate(route: RouteName) {
    window.location.href = routes[route]; // ✅ safe — route is guaranteed to be a real key
}

navigate("home");     // ✅
navigate("pricing");  // ❌ Error: "pricing" is not assignable to type "RouteName"
```

---

### 🎯 The Core Value: One Source of Truth

This is the same principle Advanced Types question 1 opened the chapter with — avoiding duplication that can drift out of sync. `routes` is defined exactly once, as a plain, ordinary JavaScript object. Every type used to work with it (`RouteName`, `RoutePath`) is derived automatically, so adding, renaming, or removing a route only ever requires touching one place, and the types are guaranteed to stay accurate.

---

### 💎 Good to Know: This Pattern Extends Further

`typeof` combined with a function (rather than an object) is also the basis for utility types like `ReturnType<T>` and `Parameters<T>`, which extract a function's return type or parameter types automatically. Those get their own full treatment in the Utility Types chapter — but they're built from exactly the same `typeof` foundation covered here.

---

### ❓ Follow-up Interview Questions

1. How is the type-level `typeof` from this question different from the runtime `typeof` used for narrowing?
2. Why does `type User = typeof user` update automatically if `user`'s shape changes later?
3. What does `keyof typeof Colors` actually produce, compared to just `keyof Colors`?
4. Why is `as const` necessary for `ColorValue` to be a precise union instead of just `string`?
5. In the `routes` example, what specifically prevents `navigate("pricing")` from compiling?

---

## 6. What are conditional types and the `infer` keyword, how do they work, and when should you use them?

### 📖 Introduction

Question 1 previewed conditional types with a simple `IsString<T>` example. This question goes to the depth this topic deserves: a genuinely surprising default behavior called **distribution**, and the `infer` keyword, which lets a conditional type reach inside another type and pull a piece out of it.

---

### 🔀 Conditional Types: A Deeper Example

A conditional type picks between two types based on whether one is assignable to another:

```typescript
type Result<T> = T extends string ? "text" : "other";

type A = Result<string>;  // "text"
type B = Result<number>;  // "other"
```

This becomes genuinely useful once `T` is something more specific than a single primitive — like checking whether a type has a certain shape, or deciding a function's return type based on its input, similar to the overload examples from the Functions chapter, but expressed as a single reusable type instead of several signatures.

---

### 🌊 Distributive Conditional Types — A Non-Obvious Default

Here's the behavior that catches almost everyone off guard the first time: when the checked type is a **naked type parameter** and you feed it a union, the conditional type doesn't run once — it runs **once per union member**, and the results are joined back into a union:

```typescript
type ToArray<T> = T extends any ? T[] : never;

type Result = ToArray<string | number>; // string[] | number[] — NOT (string | number)[]
```

TypeScript effectively computes `ToArray<string> | ToArray<number>` separately, then unions the two results — this automatic behavior is called a **distributive conditional type**.

If you actually want the union treated as one single thing, wrap it in a tuple so `T` is no longer "naked":

```typescript
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type Result2 = ToArrayNonDist<string | number>; // (string | number)[]
```

Wrapping `T` in `[T]` stops the distribution, because the thing being checked is now the tuple `[T]` as a whole, not `T` directly — so TypeScript evaluates it once, against the entire union.

---

### 🔎 The `infer` Keyword: Extracting a Type From Within Another Type

`infer` lets a conditional type declare a new type variable *inside* the condition, capturing a piece of whatever it's matching against:

```typescript
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
    return { id: 1, name: "Vaibhav" };
}

type User = MyReturnType<typeof getUser>; // { id: number; name: string }
```

Here, `infer R` says "whatever this function actually returns, capture it as `R`, and use `R` as the result." This is genuinely how TypeScript's own built-in `ReturnType<T>` utility (previewed at the end of the previous question, and covered fully in the Utility Types chapter) actually works internally.

---

### 📦 More `infer` Patterns

Extracting an array's element type — an alternative way to express the same idea as `T[number]` from the Generics chapter, but usable inside a larger conditional:

```typescript
type ElementType<T> = T extends (infer U)[] ? U : never;

type Item = ElementType<string[]>; // string
```

Unwrapping a `Promise`'s resolved type — directly relevant to the `async`/`Promise<T>` typing from the Functions chapter:

```typescript
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type A = Unwrap<Promise<string>>; // string
type B = Unwrap<number>;           // number — passes through unchanged, since it was never a Promise
```

`Unwrap` shows the fallback branch doing real work too — if `T` isn't a `Promise` at all, the condition simply returns `T` itself, unchanged.

---

### 🎯 When to Use Conditional Types and `infer`

Reach for a conditional type when a type genuinely needs to **branch** based on what it's given — the type-level equivalent of the function overloads from the Functions chapter, but as one reusable type instead of several signatures. Reach for `infer` specifically when you need to pull a piece **out of** a larger type — a function's return type, a `Promise`'s resolved value, an array's element type — rather than requiring it to be supplied separately.

Both are genuinely powerful, but also genuinely easy to make hard to read when nested deeply. In practice, most day-to-day code should reach for an existing, well-tested utility type first (the Utility Types chapter covers these), and reserve hand-written conditional types and `infer` for building genuinely reusable, library-level type helpers.

---

### 💎 Good to Know: This Closes the Loop From the Previous Question

The previous question mentioned that `ReturnType<T>` and `Parameters<T>` are built on `typeof`. The other half of the story is exactly what this question covered: those utilities also rely on a conditional type with `infer` to actually pull the return type or parameter types back out. Between `typeof`, `keyof`, indexed access, conditional types, and `infer`, you now have every mechanic TypeScript's own built-in utility types are made from.

---

### ❓ Follow-up Interview Questions

1. What does it mean for a conditional type to be "distributive"?
2. Why does `ToArray<string | number>` produce `string[] | number[]` instead of `(string | number)[]`?
3. How does wrapping `T` in a tuple (`[T]`) change that default behavior?
4. What does `infer R` actually do inside a conditional type?
5. In the `Unwrap<T>` example, what happens when `T` isn't a `Promise` at all?
6. Why might a team prefer using an existing utility type over writing a custom conditional type with `infer`?

---

## 7. What are mapped types, template literal types, and recursive types, and how do they enable advanced type transformations?

### 📖 Introduction

This closing question goes deep on the two remaining pieces previewed back in question 1 — mapped types and template literal types — and revisits recursive types, first seen with the `Json` type in the Objects & Interfaces chapter. Combined with the conditional types from the previous question, these three are the actual building blocks behind nearly every advanced type transformation you'll encounter.

---

### 🗺️ Mapped Types: Modifiers and Key Remapping

Question 1 previewed a mapped type making every property optional. The same mechanism can also **add or remove** modifiers explicitly, using `+`/`-` in front of `readonly` or `?`:

```typescript
type Required<T> = {
    [K in keyof T]-?: T[K]; // removes the optional modifier from every property
};

type Mutable<T> = {
    -readonly [K in keyof T]: T[K]; // removes readonly from every property
};
```

A newer, more powerful feature lets a mapped type **rename** keys entirely, using `as` inside the mapping — and combining this with the template literal types covered next produces a genuinely useful pattern:

```typescript
interface Person {
    name: string;
    age: number;
}

type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number }
```

Mapping a key `as never` removes it from the result entirely — a common trick for filtering out specific properties:

```typescript
type OmitId<T> = {
    [K in keyof T as K extends "id" ? never : K]: T[K];
};
```

---

### 🔤 Template Literal Types: Combining Unions and Built-in String Manipulation

Question 1 previewed a single template literal type. The real power shows up when a template literal type is built from **unions** — it distributes over every combination, the same distributive behavior conditional types showed in the previous question:

```typescript
type Size = "small" | "medium" | "large";
type Color = "red" | "blue";

type Variant = `${Size}-${Color}`;
// "small-red" | "small-blue" | "medium-red" | "medium-blue" | "large-red" | "large-blue"
```

TypeScript also ships four built-in intrinsic types for transforming string literal types, used in the `Getters` example above: `Uppercase<T>`, `Lowercase<T>`, `Capitalize<T>`, and `Uncapitalize<T>`. A common use is generating consistent event or handler names from a base string:

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
```

---

### 🌳 Recursive Types: Solving the "Readonly Is Shallow" Problem

The Objects & Interfaces chapter's `Json` type showed a recursive type alias. Recursion becomes especially powerful combined with mapped and conditional types — and it directly solves a limitation flagged all the way back in that same chapter: `readonly` only protects one level deep.

```typescript
type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface Config {
    server: {
        host: string;
        port: number;
    };
    debug: boolean;
}

type ReadonlyConfig = DeepReadonly<Config>;

const config: ReadonlyConfig = {
    server: { host: "localhost", port: 3000 },
    debug: false,
};

config.server.host = "elsewhere"; // ❌ Error — this time, readonly really does reach all the way down
```

`DeepReadonly<T>` combines everything this chapter has covered: a **mapped type** iterates over each property, a **conditional type** checks whether that property's value is itself an object, and if so, **recursion** applies `DeepReadonly` to it again — repeating until it reaches a plain, non-object value.

---

### 💎 Good to Know: Recursion Has Its Limits

TypeScript will report `Type instantiation is excessively deep` if a recursive type nests too many levels, or recurses without ever reaching a base case that stops it. Recursive types need a clear "stop" condition — in `DeepReadonly`, that's the `: T[K]` branch, reached the moment a property is no longer an object.

---

### 🎯 Closing: The Building Blocks Behind Almost Everything

Across this entire chapter — union and intersection, control flow analysis and type guards, discriminated unions, `typeof`/`keyof`/indexed access, conditional types with `infer`, and now mapped and template literal types — you've effectively seen every mechanic that TypeScript's own built-in utility types are assembled from. The Utility Types chapter picks up exactly here, showing how `Partial`, `Pick`, `Omit`, `Record`, and the rest are just well-tested combinations of these same building blocks.

---

### ❓ Follow-up Interview Questions

1. What does adding `-?` or `-readonly` to a mapped type actually do?
2. How does mapping a key `as never` remove it from the resulting type?
3. Why does `` `${Size}-${Color}` `` produce every combination of the two unions, rather than just one string type?
4. What problem does `DeepReadonly<T>` solve that a plain `readonly` modifier can't?
5. What three mechanics does `DeepReadonly<T>` combine to work correctly?
6. What causes a "Type instantiation is excessively deep" error, and what does a recursive type need to avoid it?

---

## 8. How can multiple advanced types be combined to model complex real-world data and build scalable TypeScript applications?

### 📖 Introduction

Knowing each technique from this chapter in isolation is one thing — real applications usually need several of them working together on the same piece of data. This question walks through one realistic scenario end-to-end: modeling the state of asynchronously-loaded data in an application, the way you'd see it in a real dashboard or admin panel.

---

### 🧱 The Scenario: Modeling Async Data in a Real App

Most applications need to track the same handful of states for data loaded from an API: it hasn't loaded yet, it's loading, it loaded successfully, or it failed.

---

### 1️⃣ Start With a Discriminated Union

From question 4, this is the natural fit — each state carries exactly the data that makes sense for it, and nothing else:

```typescript
type Resource<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: string };

interface AppState {
    users: Resource<User[]>;
    posts: Resource<Post[]>;
}
```

`Resource<T>` is also generic (from the Generics chapter) — one definition, reused for every kind of data the app loads.

---

### 2️⃣ Generate Derived Types With Mapped and Template Literal Types

Real UIs often need a simple "is this loading?" flag for each resource — from question 7, a mapped type combined with a template literal type can generate all of them automatically from `AppState` itself:

```typescript
type LoadingFlags<T> = {
    [K in keyof T as `is${Capitalize<string & K>}Loading`]: boolean;
};

type AppLoadingFlags = LoadingFlags<AppState>;
// { isUsersLoading: boolean; isPostsLoading: boolean }

function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function getLoadingFlags<T extends Record<string, Resource<unknown>>>(state: T): LoadingFlags<T> {
    const flags = {} as LoadingFlags<T>;
    for (const key in state) {
        (flags as Record<string, boolean>)[`is${capitalize(key)}Loading`] = state[key].status === "loading";
    }
    return flags;
}
```

If a new resource is added to `AppState` later, `AppLoadingFlags` picks up the new flag automatically — no separate type to maintain by hand.

---

### 3️⃣ Extract Nested Types With Conditional Types and `infer`

Sometimes you need just the "successful data" type out of a `Resource<T>`, without repeating what `T` was — from question 6, a conditional type with `infer` pulls it straight out:

```typescript
type ResourceData<T> = T extends Resource<infer U> ? U : never;

type UsersData = ResourceData<AppState["users"]>; // User[] — pulled out using indexed access (question 5) too
```

---

### 4️⃣ Narrow Safely at Runtime With a Custom Type Guard

Finally, from question 2, a custom type guard lets calling code safely access `data` only when the resource actually succeeded:

```typescript
function isSuccess<T>(resource: Resource<T>): resource is { status: "success"; data: T } {
    return resource.status === "success";
}

function renderUsers(state: AppState) {
    if (isSuccess(state.users)) {
        return state.users.data; // ✅ narrowed — data is guaranteed to exist here
    }
    return null;
}
```

---

### 🎯 Why This Matters: One Small Model, Fully Derived

Look at what was actually written by hand here: one generic `Resource<T>` type, and one `AppState` interface. Everything else — the loading flags, the extracted success-data type, the safe narrowing — was **derived** from those two definitions using the tools from this chapter, rather than hand-written and left to drift out of sync. This is the same principle from question 1, scaled up to a realistic piece of application state instead of a single example.

---

### 💎 Good to Know: Real Codebases Rarely Need Everything at Once

Not every project needs mapped types, `infer`, and custom type guards on day one — most of the time, a simple discriminated union alone (question 4) already solves the bulk of real problems. Reach for the deeper tools in this chapter incrementally, as an actual duplication or safety gap shows up, rather than building the most advanced possible type upfront.

---

### ❓ Follow-up Interview Questions

1. Why is `Resource<T>` written as a discriminated union instead of one interface with several optional properties?
2. What does `LoadingFlags<T>` actually generate, and why doesn't it need to be updated if `AppState` grows?
3. What is `ResourceData<T>` extracting, and which two techniques does it rely on?
4. Why is `isSuccess` written as a custom type guard instead of just checking `resource.status === "success"` inline every time?
5. What is the practical benefit of writing only `Resource<T>` and `AppState` by hand, and deriving everything else?
6. Should every project reach for mapped types, `infer`, and custom type guards from the start? Why or why not?

---