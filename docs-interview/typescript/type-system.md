---
title: Type System
description: How TypeScript infers, checks, and narrows types — the core mental model.
sidebar_position: 2
---

# Type System

## 1. What is a type in TypeScript, why is the type system important, and how does TypeScript infer and assign types?

### 📖 Introduction

Every value in your program — a number, a string, an object — has a "kind" of data it is and a set of operations that make sense on it. You can add two numbers, but multiplying two strings makes no sense.

A **type** is simply TypeScript's name for that kind of data. The **type system** is the set of rules TypeScript uses to check whether your code is using each value the way its type allows.

---

### 🧩 What Is a Type?

A type describes:

- What shape or kind of value a variable holds.
- What you're allowed to do with it.

```typescript
let age: number = 22;

age + 5;          // ✅ valid — numbers support addition
age.toUpperCase(); // ❌ error — numbers don't have this method
```

TypeScript already knows `age` is a `number`, so it can tell you `toUpperCase()` doesn't exist on it — without ever running the code.

---

### 🤔 Why Does the Type System Matter?

Without a type system, that same mistake in plain JavaScript would only be discovered when this exact line executed — potentially deep inside production. The type system moves that discovery to the moment you write the code, which is the whole reason TypeScript exists (as we saw in the Introduction chapter).

---

### ⚙️ How TypeScript Assigns Types

There are two ways a variable gets its type:

**1. Explicit annotation** — you write the type yourself:

```typescript
let age: number = 22;
```

**2. Inference** — you don't write a type, so TypeScript looks at the assigned value and figures out the narrowest type that fits:

```typescript
let age = 22; // TypeScript infers: number
```

Hovering over `age` in an editor like VS Code will show `number`, even though you never typed it. TypeScript is reading the value on the right-hand side and assigning a type automatically.

If a variable is declared without a value and without an annotation, TypeScript has nothing to infer from:

```typescript
let age; // implicitly "any" — TypeScript can't guess what this will hold
```

This is exactly what `noImplicitAny` (from the `tsconfig.json` chapter) protects against — it turns this silent guess into a compile error instead.

---

### 💡 When to Rely on Inference vs. When to Annotate

- **Let inference handle it** for local variables initialized right away — it's already correct and less to type.
- **Annotate explicitly** at function boundaries — parameters and exported function return types — since those are the "public contract" of your code, and TypeScript has no value to infer a parameter's type from until it's called.

```typescript
function calculateTotal(price: number, tax: number): number {
    return price + tax;
}
```

Here, `price` and `tax` **must** be annotated — there's no assigned value for TypeScript to infer from until someone calls the function.

---

### ❓ Follow-up Interview Questions

1. What is the difference between a type annotation and type inference?
2. Why can't TypeScript infer the type of a function parameter on its own?
3. What type does a variable get if it's declared with no value and no annotation, under non-strict settings?
4. Why do function parameters usually need explicit type annotations while local variables often don't?
5. What is the practical benefit of having a type system at all, compared to plain JavaScript?

---

## 2. What are the primitive and special types in TypeScript, and when should you use each of them?

### 📖 Introduction

TypeScript doesn't invent new kinds of data — it simply adds type-checking on top of the same primitive values JavaScript has always had, and then adds a few extra types of its own that exist only to help the compiler.

---

### 🔹 The Primitive Types (Inherited from JavaScript)

| Type | Example | Description |
|---|---|---|
| `string` | `"Vaibhav"` | Textual data |
| `number` | `22`, `3.14` | All numbers — integers and decimals alike |
| `boolean` | `true`, `false` | Logical true/false |
| `bigint` | `900n` | Whole numbers beyond what `number` can safely represent |
| `symbol` | `Symbol("id")` | A guaranteed-unique value, often used as an object key |
| `undefined` | `undefined` | A variable that has been declared but not assigned |
| `null` | `null` | An explicit "no value" |

```typescript
let username: string = "Vaibhav";
let age: number = 22;
let isActive: boolean = true;
```

These behave exactly as they do in JavaScript — TypeScript just makes sure you don't accidentally mix them.

---

### 🔸 The Special Types (TypeScript-Only)

TypeScript also introduces a few types that don't represent "a kind of value" the way `string` or `number` do — they represent special situations the type checker needs to describe:

| Type | What it represents |
|---|---|
| `any` | "Stop checking this value" |
| `unknown` | "This could be anything — prove what it is before using it" |
| `void` | "This function doesn't return a meaningful value" |
| `never` | "This can never actually happen" |

These four are easy to confuse, so they get a full side-by-side comparison in question 5 of this chapter.

---

### 🎯 When to Use Each

- Reach for a **primitive type** for almost everything — most of the time, you won't even write it explicitly, since TypeScript infers it (see question 1).
- Reach for a **special type** only when you deliberately need to describe one of those unusual situations — they're the exception, not the default.

---

### ❓ Follow-up Interview Questions

1. Does TypeScript add any new primitive types that don't exist in JavaScript?
2. What is the practical difference between `undefined` and `null`?
3. Why are `any`, `unknown`, `void`, and `never` called "special" types instead of primitive types?
4. Should most variables use a special type or a primitive type? Why?
5. What does `bigint` solve that `number` cannot?

---

## 3. How do arrays, tuples, and enums work in TypeScript, and when should you use each of them?

### 📖 Introduction

Arrays, tuples, and enums all group multiple values together — but each one makes a different promise about what that group looks like.

---

### 📚 Arrays — A List of the Same Kind of Thing

An array holds any number of values, all of the same type:

```typescript
let scores: number[] = [90, 85, 76];
// or, equivalently:
let names: Array<string> = ["Vaibhav", "Rahul"];
```

Adding a value of the wrong type is caught immediately:

```typescript
scores.push("100"); // ❌ Error: string is not assignable to number
```

Use an array when you have a **variable-length list of the same kind of thing**.

---

### 📦 Tuples — A Fixed-Length, Ordered Group

A tuple is an array with a fixed number of elements, where each position has its own specific type:

```typescript
let user: [string, number] = ["Vaibhav", 22];
```

Position 0 must always be a `string`, and position 1 must always be a `number`:

```typescript
let user: [string, number] = [22, "Vaibhav"]; // ❌ Error: wrong order
```

Use a tuple when you have a **small, fixed group of related values where order and position carry meaning** — for example, a function that returns a `[value, error]` pair.

---

### 🔢 Enums — A Named Set of Related Constants

An enum gives a readable name to a fixed set of related values:

```typescript
enum Status {
    Success,
    Error,
    Loading,
}

let current: Status = Status.Success;
```

By default, enum members are numbered `0`, `1`, `2`... You can also create a string enum for more readable output:

```typescript
enum Status {
    Success = "SUCCESS",
    Error = "ERROR",
    Loading = "LOADING",
}
```

Use an enum when you want a **named set of constants grouped under one type**.

That said, many modern TypeScript codebases prefer a **union of string literals** over enums for this exact use case — we'll see why in the next question.

---

### ❓ Follow-up Interview Questions

1. What's the key difference between an array and a tuple?
2. Why does the order of values matter in a tuple but not in an array?
3. What value does a numeric enum member get if you don't assign one explicitly?
4. What is the difference between a numeric enum and a string enum?
5. Give one real example where a tuple would be more appropriate than an array.

---

## 4. What are literal types, union types, and type narrowing, and how do they help create flexible yet type-safe applications?

### 📖 Introduction

Sometimes a plain `string` or `number` type is too loose — it allows *any* string or number, when in reality you only want to allow a handful of specific values. This is exactly what literal types and union types solve.

---

### 🔖 Literal Types

A literal type is a type that allows exactly **one specific value**, instead of an entire category of values:

```typescript
let direction: "up"; // the only value this variable can ever hold is "up"
```

On its own, a single literal type isn't very useful — it becomes powerful when combined with union types.

---

### 🔗 Union Types

A union type allows a value to be **one of several specific types**, joined with `|`:

```typescript
type Status = "success" | "error" | "loading";

let current: Status = "success"; // ✅
let invalid: Status = "done";    // ❌ Error: "done" is not one of the allowed values
```

This gives you the same safety as the `Status` enum from the previous question, but `current` is just a plain string at runtime — no extra object needed.

---

### 🔍 Type Narrowing

When a value's type is a union, TypeScript won't let you use features that don't exist on *every* member of that union — until you **narrow** it down inside a check:

```typescript
function handle(status: Status) {
    if (status === "success") {
        console.log("Done!"); // TypeScript now knows status is exactly "success" here
    } else if (status === "error") {
        console.log("Something went wrong");
    }
}
```

Common ways to narrow a type:

- `typeof value === "string"` — for primitive types.
- `value instanceof SomeClass` — for class instances.
- `"propertyName" in value` — checking whether a property exists.
- Equality checks, as shown above, for literal types.

---

### 🏷️ Discriminated Unions

This pattern becomes especially powerful with objects that share a common "tag" field:

```typescript
type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Shape = Circle | Square;

function area(shape: Shape) {
    if (shape.kind === "circle") {
        return Math.PI * shape.radius ** 2; // TypeScript knows shape is Circle here
    }
    return shape.side ** 2; // and Square here
}
```

Checking `shape.kind` narrows `shape` to the exact matching type, giving you safe access to properties that only exist on that variant.

---

### ❓ Follow-up Interview Questions

1. What is the difference between a literal type and a union type?
2. Why is a union of string literals often preferred over an enum?
3. What does it mean to "narrow" a type, and why is it necessary?
4. Name two different techniques TypeScript supports for narrowing a type.
5. What is a discriminated union, and what problem does the "tag" field solve?

---

## 5. What are the `any`, `unknown`, `never`, and `void` types, how are they different, and when should each be used?

### 📖 Introduction

These four types are some of the most confused in all of TypeScript, because none of them describe an everyday value the way `string` or `number` do. Each one describes a special situation instead.

---

### ⚠️ `any` — "Stop Checking This"

`any` turns off type checking completely for that value:

```typescript
let data: any = fetchSomeData();

data.whatever.might.exist(); // ✅ No error — TypeScript trusts you completely, even here
```

This is powerful, but dangerous — `any` is a hole in the type system. Mistakes involving `any` are only caught at runtime, exactly like plain JavaScript.

---

### 🔒 `unknown` — "Prove It First"

`unknown` can also hold anything, but unlike `any`, TypeScript **won't let you use it** until you've checked what it actually is:

```typescript
let data: unknown = fetchSomeData();

data.toUpperCase();          // ❌ Error: data is unknown, not confirmed to be a string

if (typeof data === "string") {
    data.toUpperCase();      // ✅ Safe — narrowed to string
}
```

`unknown` is the safe version of `any` — use it for values whose type you genuinely don't know yet (like an API response), and narrow it before use.

---

### 🕳️ `void` — "Nothing Meaningful Is Returned"

`void` describes a function that doesn't return a usable value:

```typescript
function logMessage(message: string): void {
    console.log(message);
}
```

Calling `logMessage(...)` and trying to use its result doesn't make sense, and TypeScript will flag it if you try.

---

### 🚫 `never` — "This Can Never Actually Happen"

`never` describes something that will never occur — a function that always throws, or a code path that's provably unreachable:

```typescript
function throwError(message: string): never {
    throw new Error(message);
}
```

`never` also shows up when narrowing a union down to nothing left:

```typescript
function handle(status: "success" | "error") {
    if (status === "success") {
        // ...
    } else if (status === "error") {
        // ...
    } else {
        const exhaustiveCheck: never = status; // if a new status is ever added, this line errors
    }
}
```

This pattern is called an **exhaustiveness check** — it forces you to update this function if `Status` ever gains a new value.

---

### ⚖️ Side-by-Side Comparison

| Type | Can hold any value? | Can you use it immediately? | Typical use |
|---|---|---|---|
| `any` | Yes | Yes, no checks at all | Escape hatch — avoid where possible |
| `unknown` | Yes | No — must narrow first | Safely handling data of an unknown shape |
| `void` | N/A (describes a return, not a value) | N/A | Functions that don't return anything useful |
| `never` | No values at all | N/A | Functions that never return, or exhaustiveness checks |

---

### ❓ Follow-up Interview Questions

1. Why is `unknown` considered the "safe version" of `any`?
2. What has to happen before you're allowed to use a value typed as `unknown`?
3. What is the difference between a function that returns `void` and one that returns `never`?
4. What is an exhaustiveness check, and what does `never` have to do with it?
5. Why is overusing `any` considered risky in a large codebase?

---

## 6. How does TypeScript handle null and undefined, and what is the role of strict null checking in preventing runtime errors?

### 📖 Introduction

Accessing a property on something that turns out to be `null` or `undefined` is one of the most common crashes in JavaScript — famously nicknamed programming's "billion-dollar mistake." TypeScript's `strictNullChecks` setting exists specifically to catch this before it happens.

---

### 🚨 The Problem Without Strict Null Checks

Without `strictNullChecks`, `null` and `undefined` are treated as valid values for almost any type, so TypeScript won't stop you from using something that might not exist:

```typescript
function getLength(text: string) {
    return text.length;
}

getLength(null); // Allowed without strictNullChecks — crashes at runtime
```

---

### ✅ With `strictNullChecks` Enabled

With this option on (included automatically by `strict: true`, from the `tsconfig.json` chapter), `null` and `undefined` are only allowed where a type explicitly says so:

```typescript
function getLength(text: string | null) {
    return text.length; // ❌ Error: text might be null here
}
```

TypeScript forces you to handle the possibility before accessing anything:

```typescript
function getLength(text: string | null) {
    if (text === null) {
        return 0;
    }
    return text.length; // ✅ Safe — narrowed to string
}
```

---

### 🛠️ Everyday Tools for Handling Null/Undefined

- **Optional chaining (`?.`)** — safely accesses a property only if the value isn't `null`/`undefined`:

```typescript
console.log(user?.profile?.email);
```

- **Nullish coalescing (`??`)** — provides a fallback only when the value is `null` or `undefined`:

```typescript
const displayName = user.name ?? "Guest";
```

- **Optional properties (`?:`)** — marks an object property as allowed to be missing:

```typescript
type User = {
    name: string;
    nickname?: string;
};
```

---

### ❓ Follow-up Interview Questions

1. Why is handling `null` and `undefined` considered such a common source of bugs?
2. What changes about a type like `string` once `strictNullChecks` is enabled?
3. What is the difference between optional chaining (`?.`) and nullish coalescing (`??`)?
4. What does marking a property with `?:` actually mean for its type?
5. Why is `strictNullChecks` included as part of the broader `strict` flag?

---

## 7. What are type assertions, non-null assertions, and type casting in TypeScript, and when should you use or avoid them?

### 📖 Introduction

Sometimes you know more about a value than TypeScript can figure out on its own. Type assertions and non-null assertions let you tell the compiler "trust me" — but that trust comes with real risk if you're wrong.

---

### 🎭 Type Assertions

A type assertion tells TypeScript to treat a value as a more specific type than it inferred, using `as`:

```typescript
const input = document.getElementById("username") as HTMLInputElement;

input.value; // ✅ TypeScript now allows .value, since HTMLInputElement has it
```

Without the assertion, TypeScript only knows `document.getElementById(...)` returns a generic `HTMLElement | null`, which doesn't have a `.value` property.

**Important:** this is not the same as type casting in languages like Java or C#, and it's not the same as JavaScript's own type coercion. An assertion changes nothing about the value at runtime — it only changes what the *compiler* believes about it. If you're wrong, no conversion happens, and the mistake resurfaces as a runtime error.

---

### ❗ Non-Null Assertions

The `!` operator tells TypeScript "I know this isn't `null` or `undefined` here," overriding `strictNullChecks` for that one expression:

```typescript
function getLength(text: string | null) {
    return text!.length; // "trust me, text won't be null at this point"
}
```

If `text` actually is `null` when this runs, the program crashes — exactly the mistake `strictNullChecks` was designed to prevent in the first place.

---

### ⚠️ When to Use Them

Assertions are appropriate when you genuinely know something TypeScript can't infer — most commonly with DOM APIs, or a value you've already validated through logic TypeScript can't see.

### 🚫 When to Avoid Them

Avoid reaching for `as` or `!` just to silence a real error. If TypeScript is complaining, prefer fixing the underlying type or narrowing it properly (see question 4) — an assertion doesn't fix the bug, it just hides it from the compiler.

---

### ❓ Follow-up Interview Questions

1. Does a type assertion change the value at runtime? Why or why not?
2. How is a TypeScript type assertion different from type casting in a language like Java?
3. What exactly does the `!` non-null assertion operator do?
4. What's the risk of using `!` on a value that turns out to actually be `null`?
5. When is it appropriate to use an assertion instead of a proper type guard?

---

## 8. How does TypeScript's structural type system work, and how is it different from nominal typing used in some other programming languages?

### 📖 Introduction

If two objects have the exact same properties, are they the same type? In TypeScript, the answer is yes — even if they were never declared as related. This is called **structural typing**, and it's one of the most distinctive things about how TypeScript checks compatibility.

---

### 🧱 Structural Typing — "If It Has the Shape, It Fits"

TypeScript compares types by their **shape** — the properties they have — not by name or explicit declaration:

```typescript
interface Point {
    x: number;
    y: number;
}

interface Coordinate {
    x: number;
    y: number;
}

function printPoint(point: Point) {
    console.log(point.x, point.y);
}

const location: Coordinate = { x: 10, y: 20 };

printPoint(location); // ✅ Works — Coordinate has everything Point requires
```

`Point` and `Coordinate` were never declared as related to each other in any way. TypeScript allows `location` to be used as a `Point` simply because it has the right shape — often nicknamed **"duck typing"**: if it looks like a duck and quacks like a duck, TypeScript treats it as one.

---

### 🏛️ Nominal Typing — "Names and Declared Relationships Matter"

Languages like Java, C#, and Rust use **nominal typing** instead. Compatibility depends on the type's declared name or explicit inheritance — not just matching fields.

In a nominally typed language, the equivalent of the example above would fail unless `Coordinate` was explicitly declared to implement or extend `Point`, even if both classes have identical fields.

---

### ⚖️ Structural vs. Nominal, Side by Side

| | Structural Typing (TypeScript) | Nominal Typing (Java, C#) |
|---|---|---|
| Compatibility based on | The shape/properties a type has | The declared name or explicit inheritance |
| Two unrelated types with identical fields | Considered compatible | Considered incompatible |
| Relationship must be declared? | No | Yes |

---

### 💡 Why This Matters in Practice

Structural typing is a big part of why TypeScript feels natural to plain JavaScript developers — objects are already compared by shape at runtime in JavaScript, and TypeScript's type system mirrors that same intuition at compile time, rather than forcing an unfamiliar class-hierarchy model on top of it.

---

### ❓ Follow-up Interview Questions

1. What determines whether two types are compatible in a structural type system?
2. Why would two unrelated interfaces with identical properties be interchangeable in TypeScript?
3. What does nominal typing require that structural typing doesn't?
4. Why is structural typing often called "duck typing"?
5. Why does structural typing fit naturally with how JavaScript already behaves at runtime?

---
