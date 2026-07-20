---
title: Modules & Declaration Files
description: Typing modules, ambient declarations, and .d.ts files.
sidebar_position: 9
---

# Modules & Declaration Files

## 1. What are modules in TypeScript, how do they work, and why are they essential for building scalable applications?

### 📖 Introduction

Every non-trivial application is split across many files. Modules are what let those files share code with each other safely and explicitly — without every variable and function in the entire project fighting over the same global namespace.

---

### 📦 What Actually Makes a File a "Module"?

The rule is simple, and easy to miss: **a file becomes a module the moment it has at least one top-level `import` or `export`.** A file with neither is treated as a plain script, and anything it declares leaks into the global scope, visible to every other script in the project.

```typescript
// user.ts — this file has an export, so it's a module
export interface User {
    id: number;
    name: string;
}
```

```typescript
// script.ts — no import or export at all, so this is a global script
const config = { debug: true }; // visible everywhere, potentially colliding with another file's "config"
```

Once a file has any `import` or `export`, it gets its **own scope** — its top-level declarations are private to that file by default, and only become visible elsewhere through an explicit `export`.

---

### 🌍 The Problem Modules Solve

Before module systems were standard, browser JavaScript commonly loaded several files as separate `<script>` tags, all sharing one single global scope. Two files declaring the same variable name would silently clash, and there was no way to tell, just by reading a file, what it actually depended on. Modules fix both problems: they isolate each file's scope by default, and they make every dependency explicit and visible at the top of the file, as an `import`.

---

### 🔀 Two Module Systems: ES Modules and CommonJS

TypeScript's `import`/`export` syntax is the modern, standardized **ES Modules** format. Node.js historically used a different system, **CommonJS**, based on `require()` and `module.exports`. The `module` option in `tsconfig.json` (from the Introduction chapter) tells TypeScript which format to actually emit:

```typescript
// Your source code — always written the same way
export function greet(name: string) {
    return `Hello, ${name}`;
}
```

```javascript
// Compiled with "module": "commonjs"
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.greet = greet;
function greet(name) {
    return `Hello, ${name}`;
}
```

You write the same `import`/`export` syntax regardless of target environment — TypeScript's compiler (from the Introduction chapter's compilation pipeline) handles translating it into whatever module format your runtime actually needs.

---

### 🏷️ Type-Only Imports: A TypeScript-Only Addition

TypeScript adds a variant import specifically for types, which is guaranteed to disappear completely during compilation — it won't even attempt to load the module at runtime:

```typescript
import type { User } from "./user";

function greet(user: User) {
    console.log(user.name);
}
```

Since `User` is only ever used as a type, and types are erased entirely (from the Introduction chapter), `import type` makes that intention explicit and lets the compiler skip generating any runtime import for it at all — useful for keeping compiled output lean when a file only needs another module's types, not its actual code.

---

### 💎 Good to Know: What's Ahead in This Chapter

This question covered what a module actually is. Declaration files (`.d.ts`), typing modules that have no types of their own, ambient declarations, and module augmentation (previewed briefly back in the Objects & Interfaces chapter's declaration merging example) each get their own dedicated question later in this chapter.

---

### ❓ Follow-up Interview Questions

1. What specifically determines whether a file is treated as a module or a plain script?
2. What happens to a variable declared in a file that has no `import` or `export` at all?
3. What real problem do modules solve that plain global `<script>` tags didn't?
4. What does the `module` option in `tsconfig.json` actually control?
5. Why might you use `import type` instead of a regular `import`?

---

## 2. How do `import` and `export` statements work in TypeScript, and what are the different ways to share code between modules?

### 📖 Introduction

Question 1 established what makes a file a module in the first place. This question covers the actual variety of ways a module can share code — there's meaningfully more to it than a single `import`/`export` pair.

---

### 🏷️ Named Exports

A module can export as many named things as it needs, each imported by its exact name inside braces:

```typescript
// math.ts
export const PI = 3.14;
export function circleArea(radius: number) {
    return PI * radius ** 2;
}
```

```typescript
import { PI, circleArea } from "./math";
```

---

### ⭐ Default Exports

A module can also export exactly **one** default value, imported without braces and under any name the importer chooses:

```typescript
// greet.ts
export default function greet(name: string) {
    return `Hello, ${name}`;
}
```

```typescript
import sayHello from "./greet"; // the name here is entirely up to the importer
```

---

### 🔄 Renaming on Import or Export

Either side of an import or export can rename what it's referring to with `as`:

```typescript
import { PI as MathPI } from "./math";
export { circleArea as area };
```

---

### 📚 Namespace Imports

Everything a module exports can be imported at once, as properties on a single object:

```typescript
import * as MathUtils from "./math";

MathUtils.circleArea(5);
MathUtils.PI;
```

---

### 🛢️ Re-exporting: Barrel Files

A module can re-export things it imported from elsewhere, without an intermediate variable — commonly used to create a single, organized entry point (often named `index.ts`) for a whole folder of related modules:

```typescript
// index.ts
export * from "./math";
export { default as greet } from "./greet";
```

```typescript
// consuming code only needs one import path
import { circleArea, greet } from "./utils";
```

This pattern — a **barrel file** — is a common way to keep a large application's import paths short and stable, even as the underlying files get reorganized.

---

### ⚖️ Named vs. Default: Which to Prefer

Named exports are generally the safer default for most code: a module can have as many as it needs, editors can reliably auto-import them by their real name, and renaming one is tracked consistently across every file that imports it. A default export's name is chosen freshly at every import site, which means the same thing can end up called something different in every file that uses it — a common source of confusion in large codebases.

---

### ⏳ Dynamic Imports: Loading a Module on Demand

`import(...)` used as a function (rather than a statement) loads a module lazily, returning a `Promise` (from the Functions chapter) instead of loading it immediately when the file is first parsed:

```typescript
async function loadMathModule() {
    const math = await import("./math");
    math.circleArea(5);
}
```

This is the mechanism behind code-splitting in modern frameworks — only loading a page's or component's code the moment it's actually needed, rather than bundling everything into one upfront download.

---

### ❓ Follow-up Interview Questions

1. What is the practical difference between a named export and a default export?
2. Why can a module only ever have one default export, but many named exports?
3. What does `import * as MathUtils` actually give you access to?
4. What problem does a barrel file (`index.ts` re-exporting from several files) solve?
5. Why does `import(...)` used as a function return a `Promise` instead of the module directly?

---

## 3. What are declaration files (`.d.ts`), why are they needed, and how does TypeScript use them to provide type information?

### 📖 Introduction

TypeScript needs to know the shape of everything a piece of code touches — but that information doesn't always have to live in the same file as the actual implementation. A **declaration file** holds only type information, with zero real code inside it, describing what already exists elsewhere.

---

### 📄 What a Declaration File Actually Contains

A `.d.ts` file describes function signatures, interfaces, and variable types — using `declare` (covered fully in question 5) — but never a real function body or implementation:

```typescript
// math.d.ts
export declare function add(a: number, b: number): number;
export declare const PI: number;
```

There's no `{ return a + b; }` here at all — just the shape. Something else entirely (compiled JavaScript, a native binding, a script tag) is responsible for actually providing the real, working code.

---

### ⚙️ TypeScript Generates These Automatically

When compiling a project with the `declaration: true` option (in `tsconfig.json`, from the Introduction chapter), `tsc` produces a matching `.d.ts` file alongside every compiled `.js` file:

```typescript
// math.ts (source)
export function add(a: number, b: number): number {
    return a + b;
}
```

compiles to two separate output files:

```javascript
// math.js — the real, runnable implementation
export function add(a, b) {
    return a + b;
}
```

```typescript
// math.d.ts — generated automatically, describing math.js's shape
export declare function add(a: number, b: number): number;
```

This is exactly how published TypeScript libraries let consumers get full type-checking and autocomplete, without shipping their original `.ts` source code at all — just the compiled `.js` plus its matching `.d.ts`.

---

### ✍️ Declaration Files Can Also Be Hand-Written

If you have plain JavaScript code with no TypeScript source to generate a `.d.ts` from, you can write one yourself, describing the shape you know the JavaScript actually has:

```typescript
// legacy-math.d.ts
export declare function add(a: number, b: number): number;
```

This lets TypeScript fully type-check any code that imports `legacy-math.js`, even though that file was never written in TypeScript at all.

---

### 🔍 How TypeScript Finds the Right `.d.ts` File

TypeScript locates declaration files a few different ways: automatically, alongside a `.js` file of the same name; through a `"types"` field in a package's `package.json`, pointing at its declaration entry point; or through community-maintained `@types` packages, covered fully in the next question.

---

### ❓ Follow-up Interview Questions

1. What is the key difference between a `.ts` file and a `.d.ts` file?
2. Does a `.d.ts` file ever contain a real function implementation?
3. What `tsconfig.json` option causes `tsc` to generate `.d.ts` files automatically?
4. How can a plain JavaScript library still get full TypeScript type-checking for its consumers?
5. Name two different ways TypeScript can locate the right declaration file for a module.

---

## 4. How do third-party type definitions work, what is DefinitelyTyped, and how can you use JavaScript libraries that don't include TypeScript support?

### 📖 Introduction

The vast majority of packages on npm were never written in TypeScript. The previous question showed how a `.d.ts` file can describe a plain JavaScript library's shape — this question covers where those declaration files actually come from when you didn't write the library yourself.

---

### 📦 Two Ways a Library Provides Types

**Bundled types** — some libraries ship their own `.d.ts` files directly inside the published package, referenced through a `"types"` (or `"typings"`) field in their `package.json`. Nothing extra needs to be installed; TypeScript finds them automatically.

**DefinitelyTyped** — for libraries that don't ship their own types, a massive, community-maintained repository called **DefinitelyTyped** provides `.d.ts` files for thousands of popular JavaScript packages, published to npm under the `@types/` scope:

```bash
npm install --save-dev @types/lodash
```

```typescript
import _ from "lodash"; // fully typed, even though lodash itself is plain JavaScript

_.chunk([1, 2, 3, 4], 2); // ✅ autocompleted and type-checked
```

This is the same `@types/lodash` example briefly mentioned back in the Introduction chapter's migration question — here's the mechanism behind it in full: TypeScript automatically looks inside `node_modules/@types` for any package matching an import, with no special import syntax required to opt in.

---

### 🔍 How TypeScript Automatically Discovers `@types` Packages

You never `import` from `@types/lodash` directly — TypeScript simply notices it exists in `node_modules/@types` and merges its declarations in for you, purely based on the package's name matching. This lookup is controlled by the `types` and `typeRoots` options in `tsconfig.json`, which most projects never need to touch since the defaults already cover the common case.

---

### 🛠️ What If a Library Has No Types at All?

If a library ships no types and has no `@types` package on DefinitelyTyped either, TypeScript refuses to import it with any useful type information — you'd need to write your own minimal declaration file describing just enough of its shape to use it safely:

```typescript
// custom.d.ts
declare module "some-untyped-library" {
    export function doSomething(value: string): void;
}
```

This uses `declare module`, covered fully in the next question. As a quick, temporary escape hatch, you could also silence the error for one specific import — but reaching for `any` or suppressing the error entirely should be a deliberate, short-term choice, not a permanent substitute for real types, for the same reasons overusing `any` is discouraged elsewhere in this guide.

---

### ❓ Follow-up Interview Questions

1. What are the two different ways a library can provide TypeScript types for its consumers?
2. Do you ever write `import` for an `@types` package directly? Why or why not?
3. What determines whether TypeScript automatically picks up a package from `node_modules/@types`?
4. What can you do if a library has no bundled types and no corresponding `@types` package?
5. Why should suppressing type errors for an untyped library be treated as a temporary measure rather than a permanent fix?

---

## 5. What is the `declare` keyword in TypeScript, how does it work, and when should you use ambient declarations?

### 📖 Introduction

Every declaration file in this chapter so far has quietly relied on one keyword: `declare`. It's how TypeScript lets you describe something's shape without providing — or even requiring — any real implementation right there in the same place.

---

### 🔑 What `declare` Actually Does

`declare` tells TypeScript: "trust me, this already exists somewhere at runtime — just check the types, and don't emit any code for this." A declaration made with `declare` produces **zero** JavaScript output; it exists purely to inform the type checker.

A common use is describing a global value injected by something outside your own code — like a script tag that adds a global object before your bundle even runs:

```typescript
declare const analytics: {
    track(event: string, data?: Record<string, unknown>): void;
};

analytics.track("page_view"); // ✅ TypeScript trusts this exists — you're responsible for making sure it actually does
```

This kind of declaration — describing something that exists in the ambient, surrounding environment rather than being defined or imported in your own code — is called an **ambient declaration**.

---

### 📦 `declare module` — Describing an Entire Untyped Module

This delivers on the teaser from the previous question — a full ambient declaration for a library with no types of its own:

```typescript
declare module "some-untyped-library" {
    export function doSomething(value: string): void;
}
```

Once this exists anywhere in your project, importing `"some-untyped-library"` anywhere else is fully typed, exactly as if the library had shipped its own `.d.ts` file.

---

### 🌍 `declare global` — Adding to the Global Scope From Inside a Module

Question 1 established that a file with any `import` or `export` becomes a module, losing the ability to add plain global declarations. `declare global` is the deliberate escape hatch for that rule — augmenting the global scope from inside a module file:

```typescript
export {}; // this line alone makes the file a module, per question 1's rule

declare global {
    interface Window {
        myAppConfig: { version: string };
    }
}
```

This is the same `Window` augmentation from the Objects & Interfaces chapter's declaration merging example — now shown with the mechanism that actually allows it to happen from inside a module file, rather than only from a global script.

---

### 🖼️ Ambient Wildcard Modules — Typing Non-Code Imports

Frontend build tools commonly let you `import` non-JavaScript assets directly, like an image or a stylesheet. TypeScript has no idea what these are unless you tell it, using a wildcard pattern:

```typescript
declare module "*.svg" {
    const content: string;
    export default content;
}
```

```typescript
import logo from "./logo.svg"; // ✅ TypeScript now knows this import is valid, typed as string
```

---

### ⚠️ The Responsibility That Comes With `declare`

`declare` never generates or checks any runtime code — it's a pure, one-sided promise to the compiler. If you `declare` something that doesn't actually exist at runtime, or describe its shape incorrectly, TypeScript has no way to catch the mistake; the failure only shows up later, at runtime, exactly the class of bug this entire guide has been about preventing. Use `declare` deliberately, and only for things you're confident really exist the way you're describing them.

---

### ❓ Follow-up Interview Questions

1. Does a `declare`d value produce any actual JavaScript when compiled?
2. What is an "ambient declaration," in your own words?
3. Why is `export {}` needed before a `declare global` block inside a module file?
4. What real-world problem does a wildcard ambient module like `declare module "*.svg"` solve?
5. What happens if something declared with `declare` doesn't actually exist at runtime?

---