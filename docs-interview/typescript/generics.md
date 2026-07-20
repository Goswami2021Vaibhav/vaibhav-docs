---
title: Generics
description: Writing reusable, type-safe functions and components with generics.
sidebar_position: 6
---

# Generics

## 1. What are generics in TypeScript, why are they needed, and how do they help create reusable and type-safe code?

### 📖 Introduction

Imagine writing a function that simply returns whatever value it's given. It should work for a `string`, a `number`, an object — any type at all. Without generics, you're stuck picking between two flawed options: duplicate the function for every type, or use `any` and quietly give up type safety. Generics exist to solve exactly this tension.

---

### 🚧 Option 1: Duplicate the Function Per Type

```typescript
function identityString(value: string): string {
    return value;
}

function identityNumber(value: number): number {
    return value;
}
```

This works, but it doesn't scale — a real "identity" function should work for *any* type, and writing a new copy for each one isn't reuse at all.

---

### 🚧 Option 2: Use `any`

```typescript
function identity(value: any): any {
    return value;
}

const result = identity(5);
result.toUpperCase(); // ✅ Compiles fine — but crashes at runtime: "result.toUpperCase is not a function"
```

As covered in the Type System chapter, `any` turns off type checking entirely. The function is now reusable, but it's no longer safe — TypeScript can't stop you from misusing the result, because it no longer knows or checks what type it actually is.

---

### 🚧 Option 3: Use a Union

```typescript
function identity(value: string | number): string | number {
    return value;
}

const result = identity(5); // result: string | number — not number!
result.toFixed(2); // ❌ Error — TypeScript only knows it's "string or number", not definitely a number
```

This is safer than `any`, but it loses something important: the **relationship** between what you passed in and what you got back. You gave it a `number`, but TypeScript hands back "could be a string, could be a number" — forcing you to manually narrow the result even though logically it's obviously still a number.

---

### 💡 Generics: A Placeholder for "Whatever Type You Give Me"

A generic solves all three problems at once, using a **type variable** — conventionally named `T` — that gets filled in with a real, specific type at each call site:

```typescript
function identity<T>(value: T): T {
    return value;
}

const a = identity(5);          // T is filled in as number → a: number
const b = identity("Vaibhav");  // T is filled in as string → b: string

a.toFixed(2);      // ✅ safe — TypeScript knows a is a number
b.toUpperCase();   // ✅ safe — TypeScript knows b is a string
```

One function definition, reused for every type, with the exact type preserved on the way out — no duplication, and no loss of safety. (This is the same `identity<T>` function briefly previewed in the Functions chapter — this is the full picture behind that `<T>` syntax.)

---

### 🔍 TypeScript Usually Infers `T` for You

You rarely need to write `identity<number>(5)` explicitly. TypeScript looks at the argument you actually passed and infers `T` automatically — the same inference principle from the Type System chapter, just applied to a type variable instead of a plain variable declaration. Explicit type arguments are only needed on the rare occasion TypeScript has nothing to infer from.

---

### 📦 A More Realistic Example: A Generic Array Function

```typescript
function firstElement<T>(arr: T[]): T {
    return arr[0];
}

const num = firstElement([1, 2, 3]);         // T = number → num: number
const str = firstElement(["a", "b", "c"]);   // T = string → str: string
```

`firstElement` works correctly and safely on an array of numbers, strings, objects, or anything else — all from one implementation, without a single `any` in sight.

---

### 🎯 What Problem Generics Actually Solve

Generics let you write **one implementation** that works across many types, while **preserving** — rather than discarding — the specific type at each call site. That combination is exactly what neither `any` nor a union can offer on its own: reusability *without* losing the connection between a function's input and its output.

---

### 💎 Good to Know: There's More Ahead in This Chapter

This question covered a single type variable on a function — just the foundation. Generics can also take multiple type parameters, be constrained to only accept certain shapes (`extends`), have default types, and apply to interfaces and classes, not just functions. Each of these gets its own dedicated question later in this chapter.

---

### ❓ Follow-up Interview Questions

1. What are the two flawed alternatives to generics, and what does each one give up?
2. Why does a union return type lose the relationship between a function's input and output?
3. What does the type variable `T` actually represent?
4. Do you always have to explicitly specify a generic's type argument when calling a function?
5. What does `firstElement<T>` gain by using a generic instead of typing its parameter as `any[]`?

---

## 2. How do generic functions, interfaces, classes, and type aliases work in TypeScript?

### 📖 Introduction

Question 1 introduced the `<T>` type variable on a function. That same idea — a placeholder type filled in at the point of use — applies just as naturally to interfaces, classes, and type aliases. Wherever you can name a type, you can make it generic.

---

### 📦 Generic Interfaces

An interface can take a type parameter, describing a shape whose properties depend on whatever type it's given:

```typescript
interface Box<T> {
    value: T;
}

const stringBox: Box<string> = { value: "Vaibhav" };
const numberBox: Box<number> = { value: 22 };

stringBox.value.toUpperCase(); // ✅ safe — value is known to be a string here
```

`Box<T>` is a single, reusable shape — `Box<string>` and `Box<number>` are two different, specific versions of it, generated on demand.

---

### 🏗️ Generic Classes

A class can take a type parameter too, and that type flows through every property and method that uses it — enforcing consistency across the whole class, not just one function call:

```typescript
class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }
}

const numberStack = new Stack<number>();
numberStack.push(10);
numberStack.push("20"); // ❌ Error: Argument of type "string" is not assignable to parameter of type "number"
```

Once `numberStack` is created as a `Stack<number>`, **every** method on it — `push`, `pop`, and any others — is locked to `number`. Just like with generic functions, TypeScript can often infer the type parameter from how you use it, so `new Stack<number>()` could also just be written as `new Stack()` if you push a number immediately after.

---

### 🧬 Generic Type Aliases

A type alias can also take a type parameter, and behaves like the interface version for a plain object shape:

```typescript
type ApiResponse<T> = {
    data: T;
    error: string | null;
};

const response: ApiResponse<{ name: string }> = {
    data: { name: "Vaibhav" },
    error: null,
};
```

But because type aliases (from the Objects & Interfaces chapter) aren't limited to object shapes, a generic type alias can do something a generic interface never can — wrap a **union**:

```typescript
type Nullable<T> = T | null;

let age: Nullable<number> = 22;
age = null; // ✅ allowed — Nullable<number> is just number | null
```

`Nullable<T>` has no equivalent as an interface, because an interface can only ever describe an object's properties — it has no way to express "this type, or `null`."

---

### 🔗 Bringing Them Together

These four constructs aren't isolated — a generic class commonly implements a generic interface, sharing the same type parameter across both:

```typescript
interface Container<T> {
    getValue(): T;
}

class Box<T> implements Container<T> {
    constructor(private value: T) {}

    getValue(): T {
        return this.value;
    }
}

const box = new Box<string>("Vaibhav");
box.getValue(); // string
```

Here, `Container<T>` defines the contract, and `Box<T>` fulfills it while staying generic itself — the specific type isn't decided until someone actually writes `new Box<string>(...)`.

---

### 💎 Good to Know: There's More Ahead in This Chapter

Every example here used a single, unconstrained type parameter for simplicity. Multiple type parameters, constraining `T` to only certain shapes with `extends`, and giving a type parameter a default all get their own dedicated questions coming up next in this chapter.

---

### ❓ Follow-up Interview Questions

1. What does adding `<T>` to an interface actually let you describe?
2. Once a `Stack<number>` is created, does every method on it become locked to `number`, or just the one you called?
3. Can TypeScript infer a class's type parameter from how it's used, similar to a generic function?
4. Why can a generic type alias express something like `Nullable<T>`, while a generic interface cannot?
5. What does it mean for a generic class to `implement` a generic interface with the same type parameter?

---

## 3. How do generic constraints work, and how can you restrict generic types using `extends` and other techniques?

### 📖 Introduction

An unconstrained type parameter `T` could be *anything* — which also means TypeScript can't assume it has any properties or methods at all. Most of the time, you don't need a generic to accept literally anything; you need it to accept anything that has **at least** a certain shape. That's exactly what a generic constraint expresses.

---

### 🚧 The Problem: An Unconstrained `T` Has No Guarantees

```typescript
function getLength<T>(value: T): number {
    return value.length; // ❌ Error: Property "length" does not exist on type "T"
}
```

TypeScript has no idea what `T` will be at this point — it could be a `number`, a `boolean`, anything — so it refuses to assume `.length` exists on it.

---

### 🔒 Constraining with `extends`

Adding `extends` after a type parameter restricts what it's allowed to be, while still keeping it generic:

```typescript
interface HasLength {
    length: number;
}

function getLength<T extends HasLength>(value: T): number {
    return value.length; // ✅ safe — every valid T is guaranteed to have "length"
}

getLength("hello");     // ✅ strings have a "length" property
getLength([1, 2, 3]);    // ✅ arrays have a "length" property
getLength(123);           // ❌ Error: number doesn't satisfy the HasLength constraint
```

`T extends HasLength` doesn't mean "T is a subclass of HasLength" — it means "T must be *at least* shaped like HasLength," which, thanks to structural typing (from the Type System chapter), any type with a compatible `length` property automatically satisfies.

---

### 🔑 A Constraint Can Reference Another Type Parameter

One of the most useful and commonly-asked generic patterns constrains one type parameter using another, via the `keyof` operator (covered fully in the Advanced Types chapter — briefly, `keyof T` produces a union of all of `T`'s property names as string literal types):

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: "Vaibhav", age: 22 };

getProperty(user, "name");  // ✅ inferred as string
getProperty(user, "age");   // ✅ inferred as number
getProperty(user, "email"); // ❌ Error: "email" is not assignable to "name" | "age"
```

`K extends keyof T` means "K must be one of T's actual property names" — so `key` can never be a typo'd or nonexistent property, and the return type `T[K]` is precisely the type of whichever property was actually requested.

---

### 💎 Good to Know: Constraining to Multiple Shapes at Once

It's easy to assume `<T extends A, B>` constrains a single `T` to satisfy both `A` and `B` — but that's not what it does. That syntax actually declares **two separate type parameters**, `T` (unconstrained) and `B` (which, confusingly, looks like a constraint but is just a second parameter name).

To constrain a single type parameter to satisfy multiple shapes at once, combine them with an intersection (`&`, from the Objects & Interfaces chapter):

```typescript
interface Named {
    name: string;
}
interface Aged {
    age: number;
}

function describe<T extends Named & Aged>(entity: T): string {
    return `${entity.name} is ${entity.age} years old`;
}

describe({ name: "Vaibhav", age: 22 }); // ✅ satisfies both shapes
describe({ name: "Vaibhav" });           // ❌ Error: missing "age"
```

---

### 🎯 Default Type Parameters — Another Way to Guide a Generic

A type parameter can also be given a default, used whenever the caller doesn't specify one explicitly:

```typescript
interface ApiResponse<T = unknown> {
    data: T;
    error: string | null;
}

const response: ApiResponse = { data: "anything", error: null };       // T defaults to unknown
const typedResponse: ApiResponse<string> = { data: "Vaibhav", error: null }; // T explicitly set to string
```

Defaulting to `unknown` rather than `any` is a deliberate, safer choice — it means code using the default still has to narrow the value (as covered in the Type System chapter) before doing anything with it.

---

### 🧩 Constraints Don't Need a Named Interface

A constraint can also be an inline object shape, or even a union of specific literal values (from the Type System chapter):

```typescript
function printId<T extends { id: number }>(item: T) {
    console.log(item.id);
}

function setSize<T extends "small" | "medium" | "large">(size: T) {
    // T can only ever be one of these three exact strings
}
```

---

### ❓ Follow-up Interview Questions

1. Why does an unconstrained `T` prevent you from accessing even common properties like `.length`?
2. Does `T extends HasLength` mean `T` must be a subclass of `HasLength`? If not, what does it mean?
3. What does `K extends keyof T` guarantee about the `key` parameter in `getProperty`?
4. Does `<T extends A, B>` constrain `T` to satisfy both `A` and `B`? If not, how would you actually express that?
5. Why might a default type parameter fall back to `unknown` instead of `any`?

---

## 4. How do `keyof`, indexed access types, and generics work together to build flexible and type-safe APIs?

### 📖 Introduction

Question 3 introduced `keyof` briefly, as part of constraining one type parameter with another. This question unpacks `keyof` fully, introduces **indexed access types** — looking up a property's type the same way you'd look up a value — and shows how the two combine with generics to build small, genuinely reusable, fully type-safe utilities.

---

### 🔑 `keyof` — Turning Property Names Into a Type

`keyof T` produces a union of every property name on `T`, as literal string types:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

type UserKeys = keyof User; // "id" | "name" | "email"
```

If `T` has a string index signature (from the Objects & Interfaces chapter) instead of named properties, `keyof` produces `string | number` — because JavaScript object keys accessed through a string index also accept numeric keys under the hood:

```typescript
interface Dictionary {
    [key: string]: number;
}

type Keys = keyof Dictionary; // string | number
```

---

### 🎯 Indexed Access Types — Looking Up a Property's Type

Just as `user["name"]` looks up a **value** at runtime, `User["name"]` looks up a **type** — the type of that specific property:

```typescript
type UserName = User["name"]; // string
type UserId = User["id"];     // number
```

You can index with a union of keys too, which gives back a union of each matching property's type:

```typescript
type IdOrName = User["id" | "name"]; // number | string
```

---

### 🧮 Combining Them: Every Possible Property Value

Indexing a type with `keyof` itself — `T[keyof T]` — produces a union of **every** property's value type at once:

```typescript
type AnyUserValue = User[keyof User]; // number | string
```

This reads as "the type of any value you could get back by looking up any of `User`'s own keys."

---

### 📚 Indexing Into Arrays with `T[number]`

The same indexed-access idea applies to arrays and tuples, using `number` as the index — this gives you the type of "whatever element this array holds":

```typescript
const roles = ["admin", "editor", "viewer"] as const;

type Role = (typeof roles)[number]; // "admin" | "editor" | "viewer"
```

The `as const` here is important: without it, `roles` would widen to the more general `string[]`, and `Role` would just be `string`. `as const` tells TypeScript to infer the narrowest possible type for each element and treat the array as `readonly` — which is exactly what makes `Role` a precise union of the three literal values instead of a generic `string`. This is a very common real-world pattern for deriving a type directly from a runtime array, so the two never drift out of sync.

---

### 🔐 Generics + `keyof` + Indexed Access: Type-Safe Getters and Setters

Question 3's `getProperty` function is the classic *read* example. The same combination works just as well for writing:

```typescript
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
    obj[key] = value;
}

const user = { name: "Vaibhav", age: 22 };

setProperty(user, "age", 23);     // ✅
setProperty(user, "age", "23");   // ❌ Error: "23" is not assignable to type "number"
setProperty(user, "email", "x");  // ❌ Error: "email" is not assignable to "name" | "age"
```

Notice `value: T[K]` — the indexed access type ties the `value` parameter directly to whichever key was passed, so `age` must be paired with a `number`, and `name` must be paired with a `string`.

The same building blocks scale to more elaborate utilities, like safely plucking several properties at once:

```typescript
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
    return keys.map((key) => obj[key]);
}

pluck(user, ["name", "age"]); // (string | number)[]
pluck(user, ["email"]);        // ❌ Error: "email" is not assignable to "name" | "age"
```

---

### 💎 Good to Know: This Is How TypeScript's Own Utility Types Are Built

`keyof`, indexed access, and generics aren't just for hand-written helpers — they're exactly the mechanics behind built-in utility types like `Pick<T, K>` and `Record<K, V>`, covered fully in the Utility Types chapter. Understanding this question means you already understand most of how those utilities work internally, not just how to use them.

---

### ❓ Follow-up Interview Questions

1. What does `keyof User` actually produce — a value, or a type?
2. Why does `keyof` produce `string | number` for a type with a string index signature?
3. What is the difference between `User["name"]` and `User["id" | "name"]`?
4. What does `User[keyof User]` represent in plain English?
5. Why is `as const` necessary to get a precise literal union out of `(typeof roles)[number]`?
6. In `setProperty`, what does typing `value` as `T[K]` actually enforce?

---

## 5. How can you use multiple generic type parameters, default generic types, and generic parameter inference effectively?

### 📖 Introduction

The `getProperty`/`setProperty` examples from the previous question already used two type parameters together, but with one constraining the other (`K extends keyof T`). This question looks at type parameters that are fully **independent** of each other, how TypeScript infers them, and a couple of rules around defaults and inference that surprise a lot of developers the first time they hit them.

---

### 🧩 Multiple, Independent Type Parameters

Type parameters don't have to relate to each other at all — a function can simply accept two completely unrelated types and combine them:

```typescript
function merge<T, U>(a: T, b: U): T & U {
    return { ...a, ...b };
}

const merged = merge({ name: "Vaibhav" }, { age: 22 });
// merged: { name: string } & { age: number }

merged.name; // ✅ string
merged.age;  // ✅ number
```

`T` and `U` are inferred independently, one from each argument, and combined with `&` (from the Objects & Interfaces chapter) into the final return type.

---

### 🔍 Inference When One Type Parameter Is Used More Than Once

When the *same* type parameter appears more than once, TypeScript has to find a single type that satisfies every use of it — including finding a reasonable common type across genuinely different arguments:

```typescript
function combine<T>(a: T, b: T): T[] {
    return [a, b];
}

combine(1, 2);        // T inferred as number
combine(1, "two");    // T inferred as number | string — TypeScript widens to cover both
```

TypeScript doesn't reject the second call — it infers the narrowest union type that covers everything `T` was actually used with. This is worth being deliberate about: if you *wanted* both arguments forced to the same single type, you'd need an explicit type argument (`combine<number>(1, "two")` would then correctly fail).

---

### 🎯 Default Type Parameters Can Reference Earlier Ones

A type parameter's default isn't limited to a fixed type — it can refer to another type parameter declared earlier in the same list:

```typescript
interface Pair<T, U = T> {
    first: T;
    second: U;
}

const samePair: Pair<number> = { first: 1, second: 2 };            // U defaults to whatever T is: number
const mixedPair: Pair<number, string> = { first: 1, second: "two" }; // U explicitly overridden
```

This is genuinely useful for APIs where "both values are usually the same type, but don't have to be" is the common case.

---

### 💎 Good to Know: You Can't Skip Type Arguments — Unless a Default Allows It

A common surprise: if you provide type arguments explicitly, you generally have to provide **all** of them — there's no way to fill in "just the second one":

```typescript
function pair<T, U>(a: T, b: U): [T, U] {
    return [a, b];
}

pair<number>(1, "two");         // ❌ Error: Expected 2 type arguments, but got 1
pair<number, string>(1, "two"); // ✅ both supplied explicitly
pair(1, "two");                  // ✅ both inferred — [number, string]
```

Defaults change this rule — a type parameter with a default (like `U = T` above) may be omitted specifically *because* TypeScript already knows what to fall back to. Without a default, there's no reasonable value to fall back to, so TypeScript requires you to supply everything or nothing.

---

### 🤔 When Inference Needs Help

Inference relies on having something to infer *from*. If a type parameter never appears in any parameter — only in the return type — there's nothing for TypeScript to look at, and it falls back to the safest option it can:

```typescript
function createArray<T>(): T[] {
    return [];
}

const numbers = createArray();          // T inferred as unknown — there was nothing to infer from
const numbers2 = createArray<number>(); // ✅ must be specified explicitly here
```

Whenever a generic's type can't be determined from any argument, an explicit type argument isn't just a nice-to-have — it's the only way to get a useful, specific type out of the call.

---

### ❓ Follow-up Interview Questions

1. Do `T` and `U` in `merge<T, U>` have to be related to each other in any way?
2. What does TypeScript do when the same type parameter is used for two arguments of genuinely different types?
3. Can a type parameter's default value refer to another type parameter declared before it?
4. If you want to explicitly specify only the second of two type arguments, is that possible? Why or why not?
5. Why does `createArray()` infer `T` as `unknown` instead of failing to compile?

---

## 6. How are generics used in real-world TypeScript applications such as React, APIs, utility functions, and reusable libraries?

### 📖 Introduction

Every mechanic in this chapter — type variables, constraints, `keyof`, defaults, inference — exists to solve one recurring, practical problem: writing something once that stays useful, and safe, across many different types. Here's where that actually shows up in day-to-day code.

---

### 🌐 APIs: Typing Fetch Responses

A generic wrapper around `fetch` lets every call site describe exactly what shape of data it expects back, instead of typing every API call's response by hand:

```typescript
async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    return response.json();
}

interface User {
    id: number;
    name: string;
}

const user = await fetchData<User>("/api/users/1"); // user: User
```

This is the same `async`/`Promise<T>` typing from the Functions chapter, made reusable across every endpoint in an application with a single function.

---

### ⚛️ React: Generic Hooks and Components

A custom hook that stores a value can be written once, generically, and reused for any value type — this is exactly how `useState<T>` itself works internally:

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : initialValue;
    });

    const setStoredValue = (newValue: T) => {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
    };

    return [value, setStoredValue] as const; // as const preserves this as a tuple, from question 4
}

const [username, setUsername] = useLocalStorage<string>("username", "Guest");
```

Components can be generic too — a reusable `List` component can render items of any type, while still type-checking how each item is rendered:

```typescript
interface ListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
    return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
}

<List items={users} renderItem={(user) => user.name} />
```

Here, `renderItem` is checked against whatever `items` actually contains — passing a `User[]` means `renderItem` is type-checked as `(user: User) => ReactNode`, with no manual typing needed at the call site. A full treatment of typing props, hooks, and events lives in the dedicated TypeScript with React chapter — this is just a glimpse of generics doing the heavy lifting there.

---

### 🧰 Utility Functions: Generic Data Transformations

Small, reusable helpers benefit enormously from the `keyof` + generics combination from question 4:

```typescript
function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {
    return items.reduce((groups, item) => {
        const groupKey = String(item[key]);
        groups[groupKey] = groups[groupKey] || [];
        groups[groupKey].push(item);
        return groups;
    }, {} as Record<string, T[]>);
}

groupBy(users, "role"); // grouped by any real property of User, fully type-checked
groupBy(users, "email"); // ✅ or any other real key — but a typo'd key is caught immediately
```

One implementation, safely reusable across any array of objects, for any of their actual properties.

---

### 🗄️ Reusable Libraries: Generic Data Structures and Patterns

The `Stack<T>` from question 2 is one example of a generic data structure; a similarly common pattern on the backend is a generic repository, combining generics with the constraint syntax from question 3:

```typescript
class Repository<T extends { id: number }> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    findById(id: number): T | undefined {
        return this.items.find((item) => item.id === id);
    }
}

const userRepo = new Repository<User>();
userRepo.add({ id: 1, name: "Vaibhav" });
```

One `Repository` implementation handles storage and lookup for `User`, `Product`, `Order` — anything with an `id` — instead of writing near-identical repository classes for every entity in the application.

---

### 🎯 The Common Thread

Every example above solves the exact problem question 1 opened this chapter with: one implementation, reused across many types, without ever falling back to `any` or losing the specific type information at each call site. That's the entire point of generics — not the syntax itself, but what the syntax makes possible.

---

### ❓ Follow-up Interview Questions

1. Why does a generic `fetchData<T>` function scale better than writing a separate fetch function per API endpoint?
2. In `useLocalStorage<T>`, what role does the generic play that a plain `any`-typed version wouldn't provide?
3. How does a generic `List<T>` component type-check its `renderItem` prop against whatever `items` it's given?
4. Why is `groupBy<T, K extends keyof T>` safer than a version typed with plain `string` for the key parameter?
5. What does constraining `Repository<T extends { id: number }>` guarantee that an unconstrained `Repository<T>` couldn't?
6. What single idea from question 1 ties together every real-world example in this question?

---