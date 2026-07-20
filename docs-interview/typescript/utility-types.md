---
title: Utility Types
description: Partial, Pick, Omit, Record, and the rest of TypeScript's built-in type helpers.
sidebar_position: 8
---

# Utility Types

## 1. What are utility types in TypeScript, why were they introduced, and how do they simplify type transformations?

### 📖 Introduction

The Advanced Types chapter built several custom mapped and conditional types by hand — an optional version of an interface, a deeply readonly version, a way to extract a function's return type. TypeScript ships built-in versions of exactly these common patterns, so nobody has to keep reinventing them. Those built-in versions are called **utility types**.

---

### 🚧 Life Without Utility Types

Recall the mapped type from the Advanced Types chapter that made every property of `User` optional:

```typescript
interface User {
    id: number;
    name: string;
}

type PartialUser = {
    [K in keyof User]?: User[K];
};
```

This works, but it's boilerplate you'd have to rewrite — correctly — every single time you needed an "optional version" of some other type, anywhere in your codebase.

---

### 📦 TypeScript Ships a Standard Library of These Patterns

Instead, TypeScript provides a built-in generic type, `Partial<T>`, that does exactly this:

```typescript
type PartialUser = Partial<User>;
// { id?: number; name?: string }
```

Same result, zero boilerplate, and it works for *any* type you hand it — not just `User`.

---

### 🗺️ A Quick Map of What's Ahead

TypeScript's utility types roughly fall into three groups, each covered in dedicated questions later in this chapter:

- **Object-shape transformations** — `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`.
- **Function-related extraction** — `ReturnType`, `Parameters`.
- **Union filtering** — `Exclude`, `Extract`, `NonNullable`.

---

### 🎯 Why They Matter Beyond Just "Less Typing"

Saving keystrokes is a small part of the story. The bigger reason: `Partial<T>` means the exact same thing in every TypeScript codebase in the world. When another developer sees `Partial<User>` in your code, they instantly know what it does without reading any implementation — but a hand-rolled mapped type has to be read and mentally traced through every single time someone encounters it. Utility types function as a **shared vocabulary** across the entire TypeScript ecosystem, not just a personal shortcut.

---

### 💎 Good to Know: Utility Types Aren't Magic

Every utility type is just an ordinary generic type, defined in TypeScript's own bundled type declaration files, built from the exact mechanics already covered in the Advanced Types and Generics chapters — mapped types, conditional types, `keyof`, indexed access, and `infer`. Nothing about them is special beyond the fact that TypeScript ships them for you. Understanding the previous two chapters means you already understand how nearly all of them work internally — this chapter is about knowing when and how to reach for them.

---

### ❓ Follow-up Interview Questions

1. What problem do utility types solve that a hand-written mapped type doesn't?
2. Are utility types a special language feature, or are they built from mechanics covered elsewhere?
3. Why does recognizing `Partial<User>` require less mental effort than reading a custom mapped type?
4. What are the three rough categories of built-in utility types?
5. Where are utility types actually defined?

---

## 2. How do `Partial`, `Required`, `Readonly`, `Pick`, and `Omit` work, and when should you use each of them?

### 📖 Introduction

These five are the most commonly used object-shape utility types, and each one answers a different practical question: does a value need every property, none of them, an unchangeable version, or just a slice of the whole thing?

---

### ➕ `Partial<T>` — Making Every Property Optional

Already introduced in question 1 — every property becomes optional:

```typescript
type Partial<T> = {
    [K in keyof T]?: T[K];
};
```

The most common real use is a "patch" or "update" function, where the caller only supplies whichever fields are actually changing:

```typescript
function updateUser(id: number, updates: Partial<User>) {
    // ...
}

updateUser(1, { name: "New Name" }); // ✅ every other field can be safely omitted
```

---

### 🔒 `Required<T>` — Making Every Property Mandatory

The opposite of `Partial` — it strips away every optional modifier:

```typescript
type Required<T> = {
    [K in keyof T]-?: T[K];
};

interface Config {
    host?: string;
    port?: number;
}

function startServer(config: Required<Config>) {
    // guaranteed to have both host and port
}

startServer({ host: "localhost", port: 3000 }); // ✅
startServer({ host: "localhost" });               // ❌ Error: missing "port"
```

This is useful for a type that's naturally optional at the edges of your app (like partially-filled user input) but must be fully filled in by the time it reaches somewhere like `startServer`, after defaults have been applied.

---

### 🧊 `Readonly<T>` — Preventing Reassignment

```typescript
type Readonly<T> = {
    readonly [K in keyof T]: T[K];
};

function printConfig(config: Readonly<Config>) {
    config.host = "changed"; // ❌ Error: cannot assign to "host" because it is a read-only property
}
```

This is the exact same `readonly` covered in the Objects & Interfaces chapter — still compile-time only, still shallow — just applied to every property at once instead of writing `readonly` in front of each one by hand.

---

### 🎯 `Pick<T, K>` — Selecting a Subset of Properties

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

type PublicUser = Pick<User, "id" | "name">;
// { id: number; name: string }
```

A common real use: exposing only a safe, minimal subset of a larger internal type — like leaving `password` out of whatever gets sent back in an API response.

---

### ✂️ `Omit<T, K>` — Excluding Specific Properties

`Omit` does the opposite of `Pick` — keep everything *except* the listed keys:

```typescript
type PublicUser = Omit<User, "password">;
// { id: number; name: string; email: string }
```

Interestingly, `Omit` isn't built from a mapped type directly — it's actually defined in terms of `Pick` and another utility type, `Exclude`, covered in the next question:

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

In plain English: "figure out every key of `T` *except* the ones in `K`, then `Pick` just those."

---

### 💎 Good to Know: These Compose Together

Because each of these is just a generic type, they nest naturally — for example, a patch operation that's only allowed to touch a specific subset of fields:

```typescript
type UserContactUpdate = Partial<Pick<User, "name" | "email">>;
// { name?: string; email?: string }
```

---

### ⚖️ When to Use Each

| Utility | Use it when... |
|---|---|
| `Partial<T>` | A caller may supply only some fields — updates, patches, partial construction |
| `Required<T>` | Every field must be present at this point, even if it's optional elsewhere |
| `Readonly<T>` | A value shouldn't be reassigned within a specific function or scope |
| `Pick<T, K>` | You only need a small, safe subset of a larger type |
| `Omit<T, K>` | You want everything except a couple of specific (often sensitive) fields |

---

### ❓ Follow-up Interview Questions

1. What's a realistic scenario where `Partial<T>` is the right parameter type for a function?
2. Why might a type be optional earlier in an application but require `Required<T>` at a later stage?
3. Does `Readonly<T>` behave any differently than manually adding `readonly` to every property yourself?
4. What is `Omit<T, K>` actually built from internally?
5. What does `Partial<Pick<User, "name" | "email">>` produce, and why might that combination be useful?

---

## 3. How do `Record`, `Exclude`, `Extract`, and `NonNullable` work, and what real-world problems do they solve?

### 📖 Introduction

`Record` rounds out the object-shape utilities from the previous question, while `Exclude`, `Extract`, and `NonNullable` are the union-filtering group previewed in question 1 — and they double as a perfect, concrete illustration of the distributive conditional types from the Advanced Types chapter.

---

### 🗂️ `Record<K, V>` — Building a Consistent Lookup Object

```typescript
type Record<K extends keyof any, V> = {
    [P in K]: V;
};
```

With a plain `string` key, `Record` is just a cleaner way to write the index signatures from the Objects & Interfaces chapter:

```typescript
type Scores = Record<string, number>;
// equivalent to: { [key: string]: number }
```

The more powerful use is with a union of literal keys, which — unlike an index signature — requires **every** named key to actually be present:

```typescript
type RoleLabels = Record<"admin" | "editor" | "viewer", string>;

const labels: RoleLabels = {
    admin: "Administrator",
    editor: "Editor",
    // ❌ Error: property "viewer" is missing
};
```

This makes `Record` a great fit for lookup tables that must stay exhaustive as a union grows — if a new role is added to the union later, every `Record` keyed by it immediately demands a value for it too.

---

### ➖ `Exclude<T, U>` — Removing Specific Members From a Union

```typescript
type Exclude<T, U> = T extends U ? never : T;

type Status = "idle" | "loading" | "success" | "error";

type NonIdleStatus = Exclude<Status, "idle">;
// "loading" | "success" | "error"
```

This is a direct, practical use of the **distributive conditional types** from the Advanced Types chapter: because `T` is a naked type parameter, `Exclude` checks each member of `Status` individually, keeping only the ones that *don't* match `U`, and discarding the rest as `never` (which simply disappears from the resulting union).

---

### ✅ `Extract<T, U>` — Keeping Only Matching Members

`Extract` is `Exclude`'s mirror image — keep a member only if it *does* match:

```typescript
type Extract<T, U> = T extends U ? T : never;

type TerminalStatus = Extract<Status, "success" | "error">;
// "success" | "error"
```

A common real use: pulling out just the subset of a broader union that's relevant to one specific piece of code, without redeclaring those values by hand.

---

### 🚫 `NonNullable<T>` — Stripping Out `null` and `undefined`

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;

type DefinitelyString = NonNullable<MaybeString>; // string
```

This is especially useful for cleaning up a type that came from somewhere permissive — an optional prop, a nullable database column, an API response using `strictNullChecks` (from the Type System chapter) — right before passing it somewhere that requires a guaranteed, real value.

---

### 🔗 Good to Know: Closing the Loop on `Omit`

The previous question showed `Omit`'s real definition without fully explaining it. Now it should read clearly:

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

"Take every key of `T`, `Exclude` the ones listed in `K`, then `Pick` whatever keys remain." Three utility types, composed into one — which is exactly how most of TypeScript's own built-in helpers are actually built.

---

### ❓ Follow-up Interview Questions

1. Why does `Record<"admin" | "editor" | "viewer", string>` require every key to be present, unlike a plain index signature?
2. What makes `Exclude<T, U>` a distributive conditional type, and why does that matter for how it processes a union?
3. What is the practical difference between `Exclude` and `Extract`?
4. Where might `NonNullable<T>` realistically be needed in an application dealing with API data?
5. How does `Omit<T, K>`'s real definition combine `Pick` and `Exclude` together?

---

## 4. How do `Parameters`, `ReturnType`, `ConstructorParameters`, `InstanceType`, and `Awaited` work, and how can they improve type safety?

### 📖 Introduction

The Advanced Types chapter built a simplified `MyReturnType` and `Unwrap` by hand using `infer`, to show how extraction works. This question covers the real, built-in versions — for functions *and* classes — and shows why deriving these types instead of writing them out separately is such a common, valuable pattern.

---

### 🔙 `ReturnType<T>` — Extracting What a Function Returns

This is exactly the `MyReturnType` from the Advanced Types chapter, just under its real, built-in name:

```typescript
function getUser() {
    return { id: 1, name: "Vaibhav" };
}

type User = ReturnType<typeof getUser>; // { id: number; name: string }
```

If `getUser`'s implementation ever changes what it returns, `User` updates automatically — no separate type to keep in sync by hand.

---

### 📥 `Parameters<T>` — Extracting a Function's Parameter Types

`Parameters<T>` does the same thing for a function's parameter list, producing a tuple:

```typescript
function createUser(name: string, age: number) {
    // ...
}

type CreateUserArgs = Parameters<typeof createUser>; // [name: string, age: number]
```

---

### 🔧 Combining Both: A Type-Safe Higher-Order Wrapper

`Parameters` and `ReturnType` are especially useful together, for writing a higher-order function (from the Functions chapter) that wraps *any* function while preserving its exact signature:

```typescript
function withLogging<T extends (...args: any[]) => any>(fn: T) {
    return (...args: Parameters<T>): ReturnType<T> => {
        console.log("Calling with", args);
        return fn(...args);
    };
}

const loggedCreateUser = withLogging(createUser);
loggedCreateUser("Vaibhav", 22); // ✅ fully type-checked, matching createUser's real signature
```

Without these utility types, `withLogging` would either need `any` (losing all safety) or a hand-written, easily-outdated copy of `createUser`'s exact parameter and return types.

---

### 🏗️ `ConstructorParameters<T>` and `InstanceType<T>` — The Same Idea for Classes

These mirror `Parameters` and `ReturnType`, but for a class's constructor instead of a regular function:

```typescript
class User {
    constructor(public name: string, public age: number) {}
}

type UserConstructorArgs = ConstructorParameters<typeof User>; // [name: string, age: number]
type UserInstance = InstanceType<typeof User>;                  // User
```

Combined, they let you write a generic factory function that works with *any* class, forwarding whatever arguments its constructor actually needs:

```typescript
function createInstance<T extends new (...args: any[]) => any>(
    ctor: T,
    ...args: ConstructorParameters<T>
): InstanceType<T> {
    return new ctor(...args);
}

const user = createInstance(User, "Vaibhav", 22); // ✅ fully typed as User
```

---

### ⏳ `Awaited<T>` — Recursively Unwrapping Promises

The Advanced Types chapter's `Unwrap<T>` handled a single layer of `Promise`. The real `Awaited<T>` goes further — it unwraps **recursively**, since a `Promise` can technically resolve to another `Promise`:

```typescript
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
```

Combined with `ReturnType`, this is the standard way to get the actual resolved data type out of an `async` function (from the Functions chapter), rather than the `Promise<...>` wrapper around it:

```typescript
async function fetchUser(): Promise<User> {
    return { id: 1, name: "Vaibhav" };
}

type FetchedUser = Awaited<ReturnType<typeof fetchUser>>; // User — not Promise<User>
```

---

### 🎯 How These Improve Type Safety

Every one of these follows the same principle as the utility types before them: instead of manually re-declaring a function's parameters, return type, or a class's constructor shape — and risking that copy silently drifting out of sync — these utilities derive the type directly from the real implementation, guaranteeing it can never disagree with the actual code.

---

### ❓ Follow-up Interview Questions

1. Why does `ReturnType<typeof getUser>` stay accurate even if `getUser`'s implementation changes later?
2. What problem would `withLogging` have if it used `any` instead of `Parameters<T>` and `ReturnType<T>`?
3. How do `ConstructorParameters<T>` and `InstanceType<T>` relate to `Parameters<T>` and `ReturnType<T>`?
4. Why does `Awaited<T>` need to be recursive, unlike the simpler `Unwrap<T>` from the Advanced Types chapter?
5. What does `Awaited<ReturnType<typeof fetchUser>>` actually produce, and why is that more useful than just `ReturnType<typeof fetchUser>` alone?

---

## 5. How can utility types be combined with generics and advanced types to build reusable and maintainable applications?

### 📖 Introduction

Utility types show their real value once they're combined — with generics, with each other, and with the mapped and conditional types from the Advanced Types chapter. This question walks through one realistic backend-and-frontend scenario where several of these come together naturally.

---

### 🏗️ A Realistic Scenario: A Generic, Type-Safe Repository

The Generics chapter introduced a `Repository<T>` for storage and lookup. Utility types make it possible to model *creating* and *updating* records precisely — without ever letting a caller set fields the system itself is responsible for:

```typescript
interface Entity {
    id: number;
    createdAt: Date;
}

interface User extends Entity {
    name: string;
    email: string;
    password: string;
}

class Repository<T extends Entity> {
    private items: T[] = [];

    create(data: Omit<T, "id" | "createdAt">): T {
        const entity = {
            ...data,
            id: Date.now(),
            createdAt: new Date(),
        } as T;
        this.items.push(entity);
        return entity;
    }

    update(id: number, updates: Partial<Omit<T, "id" | "createdAt">>): T | undefined {
        const entity = this.items.find((item) => item.id === id);
        if (!entity) return undefined;
        return Object.assign(entity, updates);
    }
}

const userRepo = new Repository<User>();

const newUser = userRepo.create({
    name: "Vaibhav",
    email: "vaibhav@example.com",
    password: "secret",
}); // ✅ id and createdAt are correctly excluded from what the caller supplies

userRepo.update(newUser.id, { name: "New Name" }); // ✅ a safe, partial update
userRepo.update(newUser.id, { id: 999 });            // ❌ Error: "id" was already excluded by Omit
```

---

### 🧩 Nesting Utility Types: `Partial<Omit<T, ...>>` in Practice

`update`'s parameter combines two utility types deliberately, in a specific order: `Omit` first removes the fields no caller should ever touch (`id`, `createdAt`), and *then* `Partial` makes whatever remains optional. Reversing the intent — allowing `id` to be optionally updated — would defeat the entire purpose of the method. The nesting isn't just a style choice; it directly encodes the business rule.

---

### 🎨 Feeding a Utility Type Into a Hand-Written Mapped Type

Utility types compose just as naturally with the custom mapped types from the Advanced Types chapter. For example, generating a form's field configuration directly from the same `User` shape used above:

```typescript
type FieldConfig<T> = {
    [K in keyof T]: {
        label: string;
        required: boolean;
    };
};

const userFieldConfig: FieldConfig<Omit<User, "id" | "createdAt">> = {
    name: { label: "Full Name", required: true },
    email: { label: "Email Address", required: true },
    password: { label: "Password", required: true },
};
```

`Omit` first narrows `User` down to only the fields a form should ever ask for, and the hand-written `FieldConfig` mapped type then transforms each of those into a small config object — one interface (`User`) driving both the repository's behavior and the form's structure, with no separate, hand-duplicated list of "editable fields" to keep in sync.

---

### 🔗 Good to Know: This Pairs Naturally With Discriminated Unions Too

The Advanced Types chapter's `Resource<T>` discriminated union is a natural fit alongside everything here — wrapping the result of `userRepo.create(...)` or a fetch call in a `Resource<User>` combines cleanly with the utility types in this question, without any conflict between the two approaches.

---

### 🎯 The Common Thread

Every technique across the Generics, Advanced Types, and Utility Types chapters ultimately serves the same goal introduced all the way back in the Generics chapter: define something **once**, and derive everything else from it. `User` was written by hand exactly once — `Omit`, `Partial`, and `FieldConfig` did the rest, and none of them can silently drift out of sync with it.

---

### ❓ Follow-up Interview Questions

1. Why does `update`'s parameter type apply `Omit` before wrapping the result in `Partial`, rather than the other way around?
2. What real business rule does `Partial<Omit<T, "id" | "createdAt">>` actually enforce?
3. How does `Omit<User, "id" | "createdAt">` help generate `userFieldConfig` without duplicating the list of editable fields?
4. Could a discriminated union like `Resource<T>` be combined with this `Repository<T>` example? What would that look like?
5. What single idea ties together the generics, advanced types, and utility types chapters?

---