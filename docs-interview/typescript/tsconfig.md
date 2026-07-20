---
title: TypeScript Configuration (tsconfig)
description: The tsconfig.json options that actually matter, and what strict mode really does.
sidebar_position: 10
---

# TypeScript Configuration (tsconfig)

## 1. What is `tsconfig.json`, how is it structured, and how does TypeScript use it to configure a project?

### 📖 Introduction

The Introduction chapter covered `tsconfig.json` at a high level — what it's for, and a handful of options that matter early on. This chapter goes through the file properly: its real structure, and every option worth understanding deeply.

---

### 🗂️ The Real Structure of `tsconfig.json`

A `tsconfig.json` has a small number of meaningful top-level fields:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "ESNext",
        "strict": true,
        "outDir": "./dist",
        "rootDir": "./src"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"],
    "extends": "./tsconfig.base.json"
}
```

- **`compilerOptions`** — the bulk of the file, controlling everything from type-checking strictness to what JavaScript gets emitted. Nearly every option in this chapter lives here.
- **`include`** / **`exclude`** — glob patterns deciding which files count as part of the project (covered fully in question 5).
- **`files`** — an explicit, exact list of files to include, useful for very small or unusual projects instead of glob patterns.
- **`extends`** — lets one config inherit every setting from another, then override just a few. Common in monorepos, where every package shares a `tsconfig.base.json` for common rules like `strict: true`, and each package's own `tsconfig.json` only adds its specific `outDir` or `rootDir`.

---

### 🧩 Project References: Splitting a Large Codebase

For larger, multi-package repositories, TypeScript also supports **project references** — letting one `tsconfig.json` point at other projects it depends on, so each part of the codebase is type-checked and built independently, then composed together:

```json
{
    "references": [{ "path": "../shared" }],
    "compilerOptions": {
        "composite": true
    }
}
```

This is a more advanced setup than most projects need immediately, but it's why large monorepos can avoid re-checking the entire codebase every time only one small package changes.

---

### 🔍 How TypeScript Finds and Uses the File

Running `tsc` with no arguments searches the current directory, then each parent directory upward, for the nearest `tsconfig.json` — that's what makes a folder a "TypeScript project" in the first place. A specific config can also be pointed at directly with `tsc --project path/to/tsconfig.json`. Editors like VS Code use this exact same file to power live, in-editor type-checking, which is why adding or changing an option here immediately changes what the editor reports as an error.

---

### ❓ Follow-up Interview Questions

1. What are the main top-level fields a `tsconfig.json` can have, besides `compilerOptions`?
2. What problem does `extends` solve in a monorepo with multiple packages?
3. What is the difference between listing files with `include` and listing them with `files`?
4. What benefit do project references provide for a large, multi-package codebase?
5. How does `tsc` decide which `tsconfig.json` to use if you don't pass one explicitly?

---

## 2. How does the TypeScript compiler process a project, and how do compiler options influence compilation and emitted JavaScript?

### 📖 Introduction

The Introduction chapter's internal compiler phases — Scanner, Parser, Binder, Type Checker, Emitter — described what happens to a *single file*. This question fills in the step that happens first: how `tsconfig.json` determines the exact set of files that get run through those phases in the first place, and which phases each kind of option actually affects.

---

### 🗃️ Step Zero: Building "The Program"

Before any file is scanned or checked, `tsc` reads `tsconfig.json` and resolves `include`, `exclude`, and `files` into a concrete list of source files. It then follows every `import` inside those files to pull in whatever else they depend on — even files outside the original `include` pattern, if something actually imports them. This complete, resolved set of files is called the **Program**, and it's what actually gets passed through the Scanner → Parser → Binder → Checker → Emitter pipeline from the Introduction chapter.

---

### ⚙️ Which Options Affect Which Phase

Compiler options don't all act at the same point in that pipeline:

- **`strict` and its sub-flags** (covered fully in question 3) influence the **Type Checker** phase — they change what counts as an error, not what code gets produced.
- **`target`, `module`, and `lib`** (covered in questions 4 and 5) influence the **Emitter** phase — they change what the final JavaScript actually looks like, and which global APIs the checker assumes exist.
- **`sourceMap` and `declaration`** (question 5) also affect the Emitter, but by producing **extra output files** alongside the compiled JavaScript, rather than changing the JavaScript itself.

This is why enabling `strict` never changes your compiled `.js` output at all, while changing `target` can change it completely — they're influencing two entirely different phases of the same pipeline.

---

### ⚡ Incremental Builds

For larger projects, the `incremental: true` option has `tsc` save information about the previous compilation to a `.tsbuildinfo` file. On the next run, TypeScript uses it to figure out which files actually need to be re-checked, rather than reprocessing the entire Program from scratch — a meaningful speed-up as a project grows, without changing what's emitted at all.

---

### ❓ Follow-up Interview Questions

1. What is "the Program," and what determines which files end up in it?
2. If a file isn't listed in `include` but is imported by a file that is, does it still get compiled?
3. Why doesn't enabling `strict: true` change anything in the emitted JavaScript?
4. Which phase of compilation do `target` and `module` actually influence?
5. What problem does `incremental: true` and its `.tsbuildinfo` file solve?

---

## 3. What is Strict Mode in TypeScript, which compiler options does it include, and why is it recommended for modern applications?

### 📖 Introduction

`strict: true` isn't one setting — it's a single switch that turns on a whole group of separate checks at once. Several of those checks have already shown up individually throughout this guide; this question names each one explicitly and shows exactly where its effect was already demonstrated.

---

### 🔐 The Flags Bundled Inside `strict: true`

| Flag | What it does | Where you've already seen it |
|---|---|---|
| `noImplicitAny` | Errors when a type can't be inferred and silently becomes `any` | The Type System chapter's inference question |
| `strictNullChecks` | Requires `null`/`undefined` to be explicitly part of a type before they're allowed | The Type System chapter's null-handling question |
| `strictFunctionTypes` | Checks function *type* parameters contravariantly (stricter) — notably, this does **not** apply to method shorthand syntax | The Classes chapter's method bivariance nugget |
| `strictPropertyInitialization` | Requires every class property to be definitely assigned | The Classes chapter's constructor question |
| `noImplicitThis` | Errors when `this` inside a function can't be determined | The Functions chapter's `this` question |
| `useUnknownInCatchVariables` | Types a caught error as `unknown` instead of `any` | The Functions chapter's async/`Promise` question |
| `strictBindCallApply` | Checks that arguments passed to `.bind()`, `.call()`, and `.apply()` match the function's real signature |  |
| `alwaysStrict` | Parses your code in JavaScript's own strict mode, and emits `"use strict"` in the output |  |

The last two haven't come up elsewhere in this guide, so a quick look at each:

```typescript
function add(a: number, b: number) {
    return a + b;
}

add.call(null, "5", 10); // ❌ Error under strictBindCallApply: "5" is not assignable to number
```

`alwaysStrict` simply guarantees your compiled output always runs under JavaScript's own strict mode — disallowing things like accidental global variable creation — regardless of how it's eventually loaded.

---

### 🎯 Why Strict Mode Is Recommended

As covered back in the Introduction chapter, enabling `strict` from the very start of a project is far less painful than turning it on later, once hundreds of files already exist without it — at that point, you're fixing every gap at once instead of never having created them in the first place. This is also why most modern TypeScript starter templates and frameworks default to `strict: true` out of the box.

---

### ❓ Follow-up Interview Questions

1. Is `strict` a single check, or a bundle of several independent ones?
2. Which strict-mode flag is responsible for a caught error being typed `unknown` instead of `any`?
3. Does `strictFunctionTypes` affect method shorthand syntax the same way it affects a function-typed property?
4. What does `strictBindCallApply` check that wouldn't otherwise be caught?
5. Why is enabling `strict` from a project's very first day easier than enabling it later?

---

## 4. How do module-related compiler options such as `module`, `moduleResolution`, `baseUrl`, and `paths` work, and when should you use them?

### 📖 Introduction

The Modules chapter showed that `module` picks which module format TypeScript emits. This question covers the rest of the module-related settings — how TypeScript actually finds a file on disk for a given `import`, and how to use shorter, cleaner import paths instead of long relative ones.

---

### 📦 `module` — A Quick Recap, and the Common Values

As shown in the Modules chapter, `module` controls the emitted format:

- `"commonjs"` — Node's traditional `require()`/`module.exports` format.
- `"ESNext"` — keeps modern `import`/`export` syntax as-is, typically used when a bundler (Vite, webpack) will handle it further.
- `"NodeNext"` — a newer option that mirrors how modern Node.js actually interprets modules, respecting a package's own `"type": "module"` setting.

---

### 🔍 `moduleResolution` — How TypeScript Finds a File on Disk

Writing `import { add } from "./math"` doesn't say whether that means `math.ts`, `math/index.ts`, or something else entirely — `moduleResolution` decides the algorithm used to figure that out:

- **`"node"`** (or `"node10"`) — mimics Node.js's traditional resolution: check for an exact file, then with common extensions, then for an `index` file inside a folder, then inside `node_modules`.
- **`"bundler"`** — designed for projects using a modern bundler, aligning TypeScript's resolution behavior with how tools like Vite actually resolve imports, including newer package.json fields.

For most projects, this is set once by whatever framework or starter template generated the config, and rarely needs manual tuning.

---

### 🛣️ `baseUrl` and `paths` — Shorter, Cleaner Import Paths

By default, importing across distant folders means a chain of relative paths:

```typescript
import Button from "../../../components/Button";
```

`baseUrl` and `paths` let you define an alias instead:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
    }
}
```

```typescript
import Button from "@/components/Button"; // resolves to src/components/Button
```

---

### 💎 Good to Know: `paths` Only Affects TypeScript, Not the Real Output

This is a genuinely common source of confusion: `paths` only helps **TypeScript's own type-checking and your editor's autocomplete** — it does not rewrite anything in the emitted JavaScript. If you compile with plain `tsc`, the output file still literally contains `require("@/components/Button")` or `import "@/components/Button"`, which Node or a browser has no idea how to resolve at runtime. Making the alias actually work at runtime requires a matching configuration in whatever actually runs or bundles the code — a bundler's own alias setting, or a separate tool that rewrites these paths during the build.

---

### ❓ Follow-up Interview Questions

1. What's the practical difference between `"commonjs"` and `"NodeNext"` for the `module` option?
2. What problem does `moduleResolution` solve that `module` alone doesn't?
3. What do `baseUrl` and `paths` let you do that plain relative imports don't?
4. Why might `import Button from "@/components/Button"` fail at runtime even though it compiles without errors?
5. What has to happen, beyond setting `paths`, for a path alias to actually work once the code is running?

---

## 5. How do configuration options such as `target`, `lib`, `sourceMap`, `declaration`, `outDir`, `rootDir`, `include`, and `exclude` work, and how should you configure them for different project types?

### 📖 Introduction

These options control what actually gets emitted, where it ends up, and which parts of a project are even considered. Several have come up briefly in earlier chapters — this question gives each one its proper depth.

---

### 🎯 `target` — Which JavaScript Version Gets Emitted

Covered briefly in the Introduction and Classes chapters — `target` controls both the JavaScript *syntax* that gets emitted (down-leveling `class` into constructor functions for `ES5`, as seen in the Classes chapter) and which built-in APIs TypeScript assumes exist without needing a polyfill. Modern projects targeting current browsers or Node.js versions typically set this to a recent value like `"ES2020"` or later, avoiding unnecessary down-leveling entirely.

---

### 📚 `lib` — Which Built-in Type Declarations Are Available

`lib` is independent of `target`, and controls which built-in APIs TypeScript *knows about* for type-checking — not which syntax gets emitted. This matters most for the difference between browser and server code:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "lib": ["ES2020"] // deliberately no "DOM"
    }
}
```

Without `"DOM"` in `lib`, referencing `window` or `document` becomes a compile error — exactly the right behavior for a Node.js backend project, which should never touch browser-only globals in the first place.

---

### 🗺️ `sourceMap` — Mapping Compiled Output Back to Your Source

```json
{ "compilerOptions": { "sourceMap": true } }
```

This generates a `.js.map` file alongside each compiled `.js` file, letting a debugger (in the browser or in Node) show and step through your original `.ts` source, with correct line numbers, instead of the compiled JavaScript. Without it, debugging compiled output means stepping through unfamiliar, transformed code.

---

### 📄 `declaration` — Emitting `.d.ts` Files

Covered in the Modules & Declaration Files chapter — `declaration: true` has `tsc` emit a `.d.ts` file alongside each compiled `.js` file. A companion option, `declarationMap`, generates a mapping so "go to definition" in an editor jumps straight to the original `.ts` source, rather than the generated declaration file.

---

### 📁 `outDir` and `rootDir` — Where Files Come From, and Where They Go

`rootDir` marks where your source files live; `outDir` marks where compiled output should go. TypeScript mirrors your source folder structure inside `outDir`:

```text
rootDir: src/          outDir: dist/
src/index.ts       →   dist/index.js
src/utils/math.ts  →   dist/utils/math.js
```

---

### 📋 `include` and `exclude` — Which Files Are Part of the Project

`include` accepts glob patterns describing which files belong to the project:

```json
{ "include": ["src/**/*"] }
```

`exclude` removes specific paths from that set — most commonly a build output folder, to avoid TypeScript trying to recompile its own previous output:

```json
{ "exclude": ["node_modules", "dist"] }
```

`node_modules` is excluded by default even without listing it explicitly, but explicitly excluding your own `outDir` avoids a project accidentally growing to include its own compiled JavaScript on the next build.

---

### 🖥️ Putting It Together: Two Typical Project Shapes

| Option | Frontend (browser) project | Backend (Node.js) project |
|---|---|---|
| `target` | Recent (e.g. `ES2020`), matched to supported browsers | Matched to the deployed Node.js version |
| `lib` | Includes `"DOM"` | Excludes `"DOM"` entirely |
| `module` | Often `"ESNext"`, handled by a bundler | `"NodeNext"` or `"CommonJS"` |
| `sourceMap` | Usually `true`, for browser devtools debugging | Usually `true`, for Node inspector debugging |
| `declaration` | Only if publishing a library | Only if publishing a library |

---

### ❓ Follow-up Interview Questions

1. What are the two different things `target` actually controls?
2. Why is `lib` independent of `target`, and why would a Node project deliberately exclude `"DOM"` from it?
3. What problem does `sourceMap` solve when debugging compiled JavaScript?
4. What does `declarationMap` add on top of plain `declaration: true`?
5. Why is it good practice to explicitly `exclude` your own `outDir`, even though `node_modules` is already excluded by default?

---