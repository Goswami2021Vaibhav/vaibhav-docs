---
title: Objects, Interfaces & Type Aliases
description: Structural typing, interfaces vs type aliases, and when to use each.
sidebar_position: 4
---

# Objects, Interfaces & Type Aliases

## 1. How does TypeScript define object types, and how can you create flexible and type-safe object structures?

### 📖 Introduction

Objects are everywhere in JavaScript — user records, API responses, configuration settings. TypeScript lets you describe exactly what properties an object must have, what type each one is, and then checks every place that object is created or used against that description.

---

### ✍️ Defining an Object Type Inline

The simplest way to type an object is directly, inside curly braces:

```typescript
let user: { name: string; age: number };

user = { name: "Vaibhav", age: 22 };        // ✅
user = { name: "Vaibhav" };                  // ❌ Error: missing property "age"
user = { name: "Vaibhav", age: "22" };       // ❌ Error: age should be a number
```

Object types can also nest, describing objects inside objects:

```typescript
let order: {
    id: number;
    customer: { name: string; email: string };
};
```

---

### 🚨 Excess Property Checks

When you assign an object **literal** directly, TypeScript runs an extra, stricter check — it flags properties that aren't part of the declared type at all:

```typescript
function printUser(user: { name: string; age: number }) {
    console.log(user.name, user.age);
}

printUser({ name: "Vaibhav", age: 22, role: "admin" });
// ❌ Error: Object literal may only specify known properties, and "role" does not exist
```

But the exact same object, passed through a variable instead of written inline, is allowed:

```typescript
const userData = { name: "Vaibhav", age: 22, role: "admin" };
printUser(userData); // ✅ Allowed
```

This isn't inconsistent — it's structural typing (from the Type System chapter) at work. `userData` has *at least* the shape `printUser` requires, so it's structurally compatible. The excess property check is a special, stricter safety net that only applies to fresh object literals, because those are most likely to contain a typo (like `naem` instead of `name`) that would otherwise go unnoticed.

---

### 💎 Good to Know: "Weak Type" Detection

There's a related, lesser-known check worth knowing. If every property in a type is optional, structural typing alone would let *any* object through — even one that shares **none** of the expected properties, which is almost always a mistake:

```typescript
interface Options {
    color?: string;
    fontSize?: number;
}

function configure(options: Options) {
    // ...
}

configure({ colr: "red" });
// ❌ Error: Object literal may only specify known properties,
// and "colr" does not exist in type "Options"
```

Even though `Options` has no required properties, TypeScript still flags this — because `{ colr: "red" }` doesn't overlap with `Options` at all. This special case is called **weak type detection**, and it exists specifically to catch typos in objects made entirely of optional fields, a case the normal structural rules alone wouldn't catch.

---

### 🔁 Why Naming the Shape Matters

Repeating the same inline object type everywhere it's needed quickly becomes unmaintainable — if the shape changes, you'd have to update every copy by hand. This is exactly the problem `interface` and `type` solve, by letting you name a shape once and reuse it everywhere — covered in the next two questions.

---

### ❓ Follow-up Interview Questions

1. What happens if an object is missing a required property from its declared type?
2. Why does TypeScript allow an object with extra properties when passed through a variable, but not as an inline literal?
3. What is the excess property check specifically protecting against?
4. Can object types be nested inside other object types?
5. Why is repeating the same inline object type across a codebase considered a problem?
6. Why does TypeScript flag `{ colr: "red" }` even when every property in the target type is optional?

---

## 2. What are interfaces in TypeScript, how do they work, and when should you use them?

### 📖 Introduction

An `interface` gives a name to an object shape, so you can reuse it anywhere instead of retyping the same structure repeatedly.

---

### ✍️ Defining an Interface

```typescript
interface User {
    name: string;
    age: number;
}

function printUser(user: User) {
    console.log(user.name, user.age);
}

const user: User = { name: "Vaibhav", age: 22 };
```

Every rule from question 1 — required properties, excess property checks on literals, structural compatibility — applies exactly the same way once the shape has a name.

---

### 🧩 Interfaces Aren't Just for Plain Objects

Interfaces can also describe function shapes (call signatures, covered in the Functions chapter) and act as contracts that classes agree to implement (covered in the Classes chapter):

```typescript
interface Greetable {
    (name: string): string; // callable shape
}

interface Shape {
    area(): number; // a contract a class can `implements`
}
```

---

### 🎯 When to Use an Interface

Interfaces are the right choice specifically when:

- You're describing the shape of an **object** (or something object-like, such as a class contract).
- The shape might need to be **extended** later by other interfaces (question 6).
- The shape might need to be **reopened and added to** later, such as augmenting a type from a library (question 7 — declaration merging).

A full side-by-side comparison with type aliases — including where interfaces fall short — is covered in question 4.

---

### ❓ Follow-up Interview Questions

1. What does an interface actually describe?
2. Can an interface describe something other than a plain object's properties?
3. What does it mean for a class to "implement" an interface?
4. Why might you choose an interface if you expect the shape to be extended later?
5. Does an interface enforce anything different from an equivalent inline object type?

---

## 3. What are type aliases in TypeScript, how do they work, and when should you use them?

### 📖 Introduction

A `type` alias also gives a name to a type — but unlike an interface, that type doesn't have to be an object shape at all. It can be a name for almost anything TypeScript can express.

---

### ✍️ Defining a Type Alias

```typescript
type User = {
    name: string;
    age: number;
};

const user: User = { name: "Vaibhav", age: 22 };
```

Used this way, a type alias behaves identically to the interface version from question 2 — same required properties, same excess property checks, same structural compatibility.

---

### 🌐 Type Aliases Can Name Anything

This is where type aliases go further than interfaces. A `type` can also name:

```typescript
type Status = "success" | "error" | "loading";       // a union of literal types
type ID = string | number;                             // a union of primitives
type Point = [number, number];                         // a tuple (Functions/Type System chapters)
type MathOperation = (a: number, b: number) => number; // a function type (Functions chapter)
```

None of these are describable with an `interface`, because they aren't object shapes — an interface can only describe the properties (and call signature) of an object-like thing.

---

### 🌳 Good to Know: Recursive Type Aliases

A type alias can even refer to **itself**, which makes it possible to type genuinely recursive structures — something with no fixed depth, like arbitrary JSON data or a tree:

```typescript
type Json =
    | string
    | number
    | boolean
    | null
    | Json[]
    | { [key: string]: Json };

const data: Json = {
    name: "Vaibhav",
    active: true,
    tags: ["admin", "editor"],
    address: {
        city: "Delhi",
        pincode: 110001,
    },
};
```

Each branch of the union eventually resolves to a primitive, but the `Json[]` and `{ [key: string]: Json }` branches refer back to `Json` itself — allowing arbitrarily deep nesting while still being fully type-checked. This is a genuinely common real-world pattern for typing API payloads whose exact structure isn't fixed.

---

### 🎯 When to Use a Type Alias

Reach for a `type` alias when:

- You're naming a **union**, a **tuple**, a **function type**, or a **primitive** — anything that isn't a plain object shape.
- You want the type to be effectively "closed" — a fixed, exact definition that shouldn't be reopened or added to later.

---

### ❓ Follow-up Interview Questions

1. Can a type alias describe something that isn't an object?
2. Give one example of a type that can only be expressed with `type`, not `interface`.
3. Does a type alias enforce different rules than an interface when used for an object shape?
4. Why might a union of literal types be a natural fit for a type alias?
5. What does it mean for a type alias to be "closed"?
6. How can a type alias refer to itself, and why is that useful for typing something like JSON?

---

## 4. What are the differences between interfaces and type aliases, and when should you choose one over the other?

### 📖 Introduction

Questions 2 and 3 showed that, for a plain object shape, interfaces and type aliases behave almost identically. The real differences show up around **extension**, **flexibility**, and **reopening** — and knowing them is what lets you make a deliberate choice instead of picking one at random.

---

### ⚖️ Side-by-Side Comparison

| | `interface` | `type` |
|---|---|---|
| Can describe a plain object shape | ✅ | ✅ |
| Can describe a union, tuple, or primitive | ❌ | ✅ |
| Extending another shape | `extends` keyword | `&` (intersection) |
| Can be reopened and added to later (declaration merging) | ✅ | ❌ |
| Typical use case | Object shapes, class contracts, library APIs | Unions, tuples, function types, one-off object shapes |

```typescript
// Extending
interface Animal {
    name: string;
}
interface Dog extends Animal {
    breed: string;
}

type Animal = { name: string };
type Dog = Animal & { breed: string };
```

Both `Dog`s end up with the exact same shape — `{ name: string; breed: string }`. The mechanism differs (`extends` vs `&`), but the result is identical for simple cases.

---

### 🎯 A Practical Way to Choose

- **Default to `interface`** for object shapes, especially ones representing entities, API responses, or class contracts — they read clearly and support extension and merging if you need it later.
- **Reach for `type`** whenever you need a union, tuple, function type, or you're combining several existing types together with `&`.

Neither choice is "wrong" for a plain object shape — many teams simply pick one as a house convention and stay consistent, since the practical difference in that specific case is small.

---

### ❓ Follow-up Interview Questions

1. For a plain object shape, is there a meaningful behavioral difference between `interface` and `type`?
2. What syntax does each one use to combine with another shape?
3. Which of the two supports declaration merging, and which doesn't?
4. Why can't a union type be expressed using `interface`?
5. What convention might a team adopt to avoid mixing both styles inconsistently?

---

## 5. How do optional properties, readonly properties, and index signatures work in TypeScript, and when should you use them?

### 📖 Introduction

Not every property on an object is required, not every property should be changeable after creation, and sometimes you don't even know a property's exact name in advance. TypeScript has a dedicated syntax for each of these situations.

---

### ❔ Optional Properties

Adding `?` after a property name marks it as optional — its type becomes `T | undefined`:

```typescript
interface User {
    name: string;
    nickname?: string;
}

const user1: User = { name: "Vaibhav" };                  // ✅ nickname omitted
const user2: User = { name: "Vaibhav", nickname: "Vaibs" }; // ✅
```

Because `nickname` might be `undefined`, accessing it safely usually means combining it with optional chaining or nullish coalescing — the same tools from the Type System chapter's null-handling question.

---

### 🔒 Readonly Properties

Adding `readonly` prevents a property from being reassigned **after the object is created**:

```typescript
interface User {
    readonly id: number;
    name: string;
}

const user: User = { id: 1, name: "Vaibhav" };
user.name = "Rahul"; // ✅ allowed
user.id = 2;          // ❌ Error: Cannot assign to "id" because it is a read-only property
```

**Important nuance:** `readonly` is a **compile-time-only** protection. It doesn't freeze the object at runtime the way `Object.freeze()` does — if this same object is handed to plain JavaScript code (or accessed via a type assertion), nothing stops it from being mutated there. `readonly` only stops *TypeScript-checked* code from reassigning the property.

---

### 💎 Good to Know: `readonly` Is Shallow

`readonly` only protects the **property itself** from being reassigned — it does nothing to protect whatever is stored *inside* that property:

```typescript
interface User {
    readonly profile: { age: number };
}

const user: User = { profile: { age: 22 } };

user.profile = { age: 30 };   // ❌ blocked — reassigning the property itself
user.profile.age = 30;         // ✅ allowed! readonly doesn't reach inside the object
```

This trips a lot of developers up — `readonly` guards one level deep only. If you genuinely need protection all the way down, you'd have to mark every nested property `readonly` yourself, or use a mapped utility type designed for it (covered in the Utility Types chapter).

`readonly` also applies to arrays, using either syntax below — both block mutating methods like `.push()` and `.pop()`, while still allowing you to read from the array:

```typescript
const tags: readonly string[] = ["admin", "editor"];
// or: ReadonlyArray<string>

tags.push("viewer"); // ❌ Error: push does not exist on type 'readonly string[]'
```

---

### 🔑 Index Signatures

An index signature describes an object whose exact property names aren't known in advance, but whose value types are consistent — a dictionary-like object:

```typescript
interface Scores {
    [studentName: string]: number;
}

const scores: Scores = {
    Vaibhav: 90,
    Rahul: 85,
};

scores.Anyone = 100; // ✅ any string key is allowed, as long as the value is a number
scores.Anyone = "A"; // ❌ Error: value must be a number
```

If an interface mixes an index signature with specific named properties, every named property's type must be compatible with the index signature's value type:

```typescript
interface Scores {
    [studentName: string]: number;
    average: number; // ✅ fine — number matches the index signature
}
```

---

### ❓ Follow-up Interview Questions

1. What type does an optional property have internally?
2. Does `readonly` prevent an object from being mutated at runtime?
3. What's the practical difference between `readonly` and `Object.freeze()`?
4. What kind of object is an index signature designed to describe?
5. Why must named properties be compatible with an index signature's value type?
6. If a property is marked `readonly`, can the object stored inside it still be mutated? Why?

---

## 6. How can interfaces and type aliases be extended and reused to build scalable applications?

### 📖 Introduction

As an application grows, many different objects often share common fields — an `id`, a `createdAt` timestamp, an `updatedAt` timestamp. Repeating those fields in every single type is not just tedious, it's a maintenance risk. Both interfaces and type aliases support composing smaller shapes into larger ones, so shared structure only has to be defined once.

---

### 🧬 Extending Interfaces

An interface can extend one or more other interfaces using `extends`, inheriting all of their properties:

```typescript
interface BaseEntity {
    id: number;
    createdAt: Date;
}

interface User extends BaseEntity {
    name: string;
    email: string;
}

const user: User = {
    id: 1,
    createdAt: new Date(),
    name: "Vaibhav",
    email: "vaibhav@example.com",
};
```

An interface can even extend multiple interfaces at once:

```typescript
interface Timestamped {
    createdAt: Date;
}
interface Identifiable {
    id: number;
}

interface User extends Timestamped, Identifiable {
    name: string;
}
```

---

### 🔗 Composing Type Aliases

Type aliases achieve the same composition using an intersection (`&`), which combines every property from each type into one:

```typescript
type BaseEntity = {
    id: number;
    createdAt: Date;
};

type User = BaseEntity & {
    name: string;
    email: string;
};
```

The resulting `User` type requires all of `BaseEntity`'s properties plus its own — functionally the same outcome as the `extends` version above.

---

### 💎 Good to Know: What Happens When Properties Conflict

`extends` and `&` look interchangeable, but they behave very differently when two shapes disagree on a property's type — and this difference is a genuine gotcha.

**Interfaces refuse to compile outright:**

```typescript
interface A {
    prop: string;
}
interface B {
    prop: number;
}

interface C extends A, B {}
// ❌ Error: Interface "C" cannot simultaneously extend types "A" and "B",
// named property "prop" types are not identical
```

TypeScript catches the conflict immediately and won't let you define `C` at all.

**Type alias intersections, on the other hand, compile silently — and quietly collapse the property to `never`:**

```typescript
type A = { prop: string };
type B = { prop: number };

type C = A & B; // ✅ compiles!

const value: C = { prop: /* ??? */ }; // ❌ impossible — no value is both string AND number
```

An intersection (`&`) means "must satisfy **both** at once," so `prop` becomes `string & number` — which has no possible value, and TypeScript represents that as `never`. Nothing warns you at the type's *definition*; the problem only surfaces later, when you actually try to create a value of type `C` and discover it's impossible. This is a real reason some teams prefer `interface` for shapes that might be combined from multiple sources — the failure happens earlier and with a clearer message.

---

### 🏗️ Why This Matters for Scale

Once `BaseEntity` exists, every entity in the application — `User`, `Product`, `Order` — can extend it, so a change to shared fields (like adding a `deletedAt` field for soft deletes) only needs to happen in one place, and every dependent type picks it up automatically.

---

### ❓ Follow-up Interview Questions

1. What keyword lets an interface reuse another interface's properties?
2. How does a type alias achieve the same kind of composition?
3. Can an interface extend more than one interface at once?
4. What's the practical benefit of a shared `BaseEntity` type across many entities?
5. If a shared base type gains a new property, what happens to types that already extend it?
6. If two interfaces being extended together disagree on a property's type, when does the error appear? What about the equivalent type alias intersection?

---

## 7. What is declaration merging in TypeScript, how does it work, and why is it supported only for interfaces?

### 📖 Introduction

Normally, declaring the same name twice is an error — TypeScript won't let you have two conflicting definitions for one identifier. Interfaces are a deliberate exception: declaring the same interface name more than once doesn't cause a conflict, it **merges** them into one combined shape.

---

### 🔀 How Declaration Merging Works

```typescript
interface User {
    name: string;
}

interface User {
    age: number;
}

const user: User = { name: "Vaibhav", age: 22 }; // ✅ both declarations merged into one
```

TypeScript combines both `interface User` declarations into a single interface requiring both `name` and `age` — as if they had been written together from the start.

---

### 🌍 A Real-World Use Case: Augmenting Existing Types

Declaration merging is especially useful for adding properties to types you don't own — most commonly, global objects or third-party library types:

```typescript
// Adding a custom property to the global Window object
interface Window {
    myAppConfig: { version: string };
}

window.myAppConfig.version; // ✅ TypeScript now recognizes this property
```

This exact pattern is how many libraries let you extend their types — for example, adding custom fields to an Express `Request` object in a Node.js backend. We'll see more of this in the Modules & Declaration Files chapter.

---

### 🚫 Why Type Aliases Don't Support This

Declaring the same `type` alias name twice is a compile error:

```typescript
type User = { name: string };
type User = { age: number }; // ❌ Error: Duplicate identifier "User"
```

This isn't an arbitrary limitation — it comes from what each one represents:

- An **interface** is meant to describe an **open, extendable contract** — by design, more can always be added to it later, which is exactly what merging enables.
- A **type alias** is meant to be a **fixed, exact name for one specific type** — including unions, tuples, and other constructs where "merging two declarations" wouldn't even have a sensible meaning. What would it mean to "merge" `type Status = "success" | "error"` with a second, conflicting declaration? There's no reasonable answer — so TypeScript simply doesn't allow it.

---

### ❓ Follow-up Interview Questions

1. What happens when the same interface name is declared more than once?
2. Why is declaration merging useful when working with third-party libraries or global objects?
3. What happens if you declare the same `type` alias name twice?
4. Why does it conceptually make sense for interfaces to merge, but not type aliases?
5. What real-world example shows declaration merging being used to extend a type you don't own?

---
