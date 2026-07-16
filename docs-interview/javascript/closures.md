---
title: Closures
description: How closures work, the classic loop bug, and where they show up in real code and React.
sidebar_position: 8
---

# Closures

## 1. What are Closures in JavaScript, and how do they work?

### 📖 Overview

A **Closure** is one of the most powerful and frequently asked concepts in JavaScript interviews.

At first glance, a Closure may seem mysterious, but the idea is actually simple:

> A **Closure** is created when an inner function remembers and can access variables from its outer (lexical) scope, even after the outer function has finished executing.

Closures exist because JavaScript uses **Lexical Scope**, meaning a function remembers **where it was created**, not where it is called.

This ability allows functions to preserve data, create private variables, build reusable APIs, and power many advanced JavaScript features.

---

### ⚙️ Main Explanation

### What is a Closure?

A Closure is the combination of:

- A function.
- The lexical environment in which that function was created.

This means the function remembers the variables that were available when it was defined.

Example:

```js
function createGreeting() {
  const company = "Vaibhav Docs";

  function greet() {
    console.log(company);
  }

  return greet;
}

const welcome = createGreeting();

welcome();
```

Output:

```text
Vaibhav Docs
```

Even though `createGreeting()` has already finished executing, `greet()` can still access `company`.

This behavior is called a **Closure**.

---

### Why Do Closures Exist?

Closures exist because JavaScript uses **Lexical Scope**.

A function remembers the environment where it was **defined**, not where it is later executed.

When JavaScript creates a function, it also stores a reference to its surrounding lexical environment.

Later, if the function is executed somewhere else, it still has access to those variables.

Without Closures, functions would lose access to variables from their outer scope as soon as that scope finished executing.

---

### How is a Closure Created?

A Closure is created automatically by JavaScript.

Whenever:

- A function is defined inside another function, **and**
- The inner function accesses variables from the outer function,

JavaScript creates a Closure.

Example:

```js
function outer() {
  const message = "Hello";

  function inner() {
    console.log(message);
  }

  return inner;
}
```

Here:

- `inner()` accesses `message`.
- JavaScript automatically creates a Closure.

No special syntax is required.

---

### Relationship Between Closures and Lexical Scope

Closures are built on top of **Lexical Scope**.

Lexical Scope determines **which variables a function is allowed to access**.

Closures make sure those variables remain available even after the outer function has completed.

Think of it like this:

```text
Lexical Scope

↓

Determines Visibility

↓

Closure

↓

Preserves Access
```

Without Lexical Scope, Closures couldn't exist.

---

### Can Every Inner Function Become a Closure?

Yes—but only if it **needs** to remember variables from its outer scope.

Example:

```js
function outer() {
  const company = "Vaibhav Docs";

  function inner() {
    console.log(company);
  }

  return inner;
}
```

`inner()` becomes a Closure because it uses `company`.

Now consider:

```js
function outer() {
  function inner() {
    console.log("Hello");
  }

  return inner;
}
```

Although JavaScript still creates the function, it doesn't need to preserve any outer variables because none are used.

A Closure is only meaningful when a function captures variables from its surrounding scope.

---

### Can a Closure Access Variables Declared Later?

Yes.

Because JavaScript first creates the function's lexical environment before execution begins.

Example:

```js
function outer() {
  function inner() {
    console.log(company);
  }

  const company = "Vaibhav Docs";

  return inner;
}

const greet = outer();

greet();
```

Output:

```text
Vaibhav Docs
```

The variable was declared after the function definition, but before the function was executed.

When `inner()` runs, `company` has already been initialized.

---

### Normal Function vs Closure

Consider a normal function.

```js
function greet() {
  console.log("Welcome");
}

greet();
```

The function executes and finishes.

It doesn't depend on any outer variables.

---

Now consider:

```js
function createGreeting() {
  const company = "Vaibhav Docs";

  return function () {
    console.log(company);
  };
}
```

The returned function still remembers `company`.

This ability to preserve variables after the outer function has finished is what makes it a Closure.

---

### Why Are Closures Considered Powerful?

Closures enable many important JavaScript features.

Examples include:

- Data privacy.
- Function factories.
- Event handlers.
- Callbacks.
- Memoization.
- Currying.
- React Hooks.

Many advanced JavaScript patterns depend on Closures.

This is why they are considered one of the language's most powerful features.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **how JavaScript internally creates and maintains Closures** using **Execution Contexts**, **Lexical Environments**, and the **Scope Chain**.

---

### 💻 Example

We'll use the following example throughout this chapter.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    console.log(count);
  };
}

const counter = createCounter();

counter();

counter();

counter();
```

Output:

```text
1

2

3
```

Although `createCounter()` has already finished, the returned function continues to remember the `count` variable.

This is a Closure in action.

---

### 📊 Diagram / Flow

#### Closure Creation

```text
Outer Function

↓

Create Inner Function

↓

Inner Function Uses Outer Variable

↓

Closure Created
```

---

#### Lexical Scope

```text
Global Scope

│

└── createCounter()

      │

      └── count

            │

            ▼

       Inner Function
```

---

#### After Outer Function Returns

```text
createCounter()

↓

Returns Inner Function

↓

Outer Execution Ends

↓

Closure Preserves count

↓

counter()
```

---

#### Closure Relationship

```text
Function

+

Lexical Environment

↓

Closure
```

---

### 🌍 Real-World Example

Imagine a bank locker.

A customer stores valuable documents inside the locker.

```text
Customer

↓

Bank Locker

↓

Documents Stored
```

Even after the customer leaves the bank, the documents remain safely stored inside the locker.

Whenever the customer returns with the correct key, the documents are still available.

Closures work in a similar way.

The outer function finishes executing, but the inner function keeps a reference to the variables it needs.

Whenever the inner function is called again, those variables are still available.

---

### 🎤 Interview Answer

A **Closure** is created when an inner function remembers and can access variables from its outer lexical scope, even after the outer function has finished executing. Closures exist because JavaScript uses lexical scoping, meaning a function remembers the environment where it was defined. Whenever an inner function accesses variables from its outer function, JavaScript automatically creates a Closure by preserving the required lexical environment. Closures are widely used for data privacy, function factories, callbacks, memoization, currying, event handlers, and many other advanced JavaScript patterns.

---

### ❓ Follow-up Questions

1. How is a Closure created in JavaScript?
2. What is the relationship between Closures and Lexical Scope?
3. Why can a Closure access variables after the outer function has returned?
4. Can every inner function become a Closure?
5. What is the difference between a normal function and a Closure?
6. Why are Closures considered one of JavaScript's most powerful features?

---

## 2. How do Closures work internally in JavaScript?

### 📖 Overview

In the previous topic, we learned **what a Closure is**.

Now let's look behind the scenes and understand **how JavaScript actually creates and maintains a Closure**.

From the JavaScript engine's perspective, a Closure is **not just an inner function**.

It is a combination of:

- A function.
- Its **Lexical Environment**.
- The **Scope Chain**.
- References created during the **Execution Context**.

Understanding these internal concepts explains why Closures continue to work even after the outer function has finished executing.

---

### ⚙️ Main Explanation

### The Lifecycle of a Closure

Let's use the following example throughout this topic.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    console.log(count);
  };
}

const counter = createCounter();

counter();
```

JavaScript performs several steps internally.

---

### Step 1: Global Execution Context is Created

When the program starts, JavaScript creates the **Global Execution Context (GEC)**.

```text
Global Execution Context

↓

Memory Creation

↓

Code Execution
```

During the Memory Creation Phase:

```text
createCounter

↓

Function Object
```

The entire Function Declaration is stored in memory.

---

### Step 2: `createCounter()` is Invoked

When:

```js
createCounter();
```

is executed,

JavaScript creates a **new Function Execution Context**.

It contains:

- Parameters
- Local variables
- A Lexical Environment
- A reference to the outer scope

Memory:

```text
count

↓

0
```

---

### Step 3: Inner Function is Created

While executing:

```js
return function () {
  count++;

  console.log(count);
};
```

JavaScript creates the inner function.

At this moment, the engine notices:

```text
Inner Function

↓

Uses count
```

Since `count` belongs to the outer function, JavaScript creates a reference to the surrounding **Lexical Environment**.

This preserved relationship is what forms the Closure.

---

### Step 4: Outer Function Returns

Normally, once a function finishes, its Execution Context is removed from the Call Stack.

```text
Call Stack

↓

Remove createCounter()
```

However, something special happens.

Although the Execution Context disappears, the **Lexical Environment** containing `count` is **not immediately destroyed**.

Why?

Because the returned function still references it.

---

### Step 5: Closure Preserves the Lexical Environment

The returned function is stored in:

```js
const counter = createCounter();
```

Internally:

```text
counter

↓

Function

↓

Reference

↓

Lexical Environment

↓

count
```

The function carries a hidden reference to the variables it needs.

This preserved environment is the Closure.

---

### Step 6: The Closure Executes Later

Now:

```js
counter();
```

JavaScript creates a **new Function Execution Context** for the inner function.

When it looks for:

```text
count
```

the variable isn't inside the current Execution Context.

So JavaScript searches through the **Scope Chain**.

```text
Current Scope

↓

Outer Lexical Environment

↓

count
```

It finds:

```text
count = 0
```

Then updates it.

```text
count

↓

1
```

The next time:

```js
counter();
```

runs,

the value is still:

```text
1
```

because the Closure preserved it.

---

### Relationship Between Closures and Execution Context

Execution Context and Closure are related but different.

An **Execution Context** is a temporary environment used while a function is executing.

A **Closure** is a persistent reference to the Lexical Environment that survives after the Execution Context has been destroyed.

Think of it like this:

```text
Execution Context

↓

Runs Function

↓

Destroyed

-------------------

Closure

↓

Preserves Variables

↓

Lives Until No Longer Needed
```

---

### Relationship Between Closures and the Scope Chain

Whenever a function accesses a variable, JavaScript follows the **Scope Chain**.

Example:

```text
Inner Function

↓

Current Scope

↓

Outer Scope

↓

Global Scope
```

If the variable is found in an outer scope, the Closure preserves access to it.

Closures don't create the Scope Chain—they simply keep part of it alive.

---

### Relationship Between Closures and the Lexical Environment

Every Execution Context contains a **Lexical Environment**.

A Lexical Environment stores:

- Local variables.
- Function declarations.
- References to the outer environment.

When JavaScript creates a Closure, it doesn't copy variables.

Instead, it stores a **reference** to the Lexical Environment where those variables exist.

This is why changes to captured variables are reflected every time the Closure runs.

---

### Complete Closure Lifecycle

Putting everything together:

```text
Program Starts

↓

Global Execution Context

↓

Outer Function Called

↓

Function Execution Context

↓

Lexical Environment Created

↓

Inner Function Created

↓

Closure Formed

↓

Outer Function Returns

↓

Execution Context Destroyed

↓

Lexical Environment Preserved

↓

Inner Function Executes

↓

Variables Accessed Through Closure
```

This entire process happens automatically.

---

### Why Doesn't JavaScript Copy Variables?

JavaScript doesn't duplicate captured variables.

Instead, it keeps a reference to the original Lexical Environment.

This is why:

```js
let count = 0;

count++;

count++;
```

works correctly inside a Closure.

Every invocation accesses the same preserved variable.

---

> 💡 **Coming Next**
>
> In the next topic, we'll focus specifically on **why these preserved variables are not garbage collected immediately** and how JavaScript decides when they can finally be removed from memory.

---

### 💻 Example

We'll continue using our running example.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    return count;
  };
}

const counter = createCounter();

console.log(counter());

console.log(counter());

console.log(counter());
```

Output:

```text
1

2

3
```

Each function call accesses the same preserved `count` variable through the Closure.

---

### 📊 Diagram / Flow

#### Closure Creation

```text
Outer Function

↓

Lexical Environment Created

↓

Inner Function Uses Outer Variable

↓

Closure Created
```

---

#### Execution Context

```text
Call Function

↓

Execution Context

↓

Execute

↓

Destroyed
```

---

#### Closure

```text
Function

↓

Reference

↓

Lexical Environment

↓

Captured Variables
```

---

#### Scope Chain

```text
Current Scope

↓

Outer Scope

↓

Global Scope
```

---

#### Complete Lifecycle

```text
Create Function

↓

Execution Context

↓

Lexical Environment

↓

Closure

↓

Outer Function Ends

↓

Variables Preserved
```

---

### 🌍 Real-World Example

Imagine a company project.

A project manager creates a project folder containing important documents.

```text
Project Folder

↓

Requirements

↓

Design

↓

Budget
```

Once the manager finishes their work, they leave the project.

However, the development team continues using the same project folder.

The folder isn't deleted because the team still depends on it.

Similarly:

- The **Execution Context** is like the project manager—it finishes and goes away.
- The **Lexical Environment** is like the project folder.
- The **Closure** is the development team that still holds a reference to that folder.

As long as someone still needs the folder, it remains available.

---

### 🎤 Interview Answer

Internally, a Closure is created when an inner function references variables from its outer lexical scope. During function execution, JavaScript creates an **Execution Context** containing a **Lexical Environment**. If an inner function captures variables from that environment, JavaScript stores a reference to the Lexical Environment instead of copying the variables. When the outer function finishes, its Execution Context is removed from the Call Stack, but the Lexical Environment remains alive because the Closure still references it. Whenever the Closure executes later, it accesses the preserved variables through the Scope Chain. This is why Closures continue to work even after the outer function has returned.

---

### ❓ Follow-up Questions

1. What is the relationship between Closures and the Execution Context?
2. What is the relationship between Closures and the Lexical Environment?
3. How does the JavaScript engine preserve variables for a Closure?
4. Why doesn't JavaScript copy captured variables into the Closure?
5. How does the Scope Chain help a Closure access variables?
6. What is the complete lifecycle of a Closure?

---

## 3. Why do Closures remember variables after the outer function returns?

### 📖 Overview

One of the most confusing aspects of Closures is this:

> If the outer function has already finished executing, why can the inner function still access its variables?

Normally, when a function finishes:

- Its **Execution Context** is removed from the Call Stack.
- Local variables become unreachable.
- JavaScript eventually frees the memory through **Garbage Collection**.

However, Closures are an important exception.

When an inner function still needs variables from its outer function, JavaScript keeps those variables alive until they are no longer referenced.

---

### ⚙️ Main Explanation

### A Normal Function's Lifecycle

Consider this function:

```js
function greet() {
  const message = "Welcome";

  console.log(message);
}

greet();
```

Execution Flow:

```text
Call greet()

↓

Execution Context Created

↓

message = "Welcome"

↓

console.log()

↓

Execution Context Destroyed

↓

Garbage Collection
```

Since nothing needs `message` after the function finishes, JavaScript is free to remove it from memory.

---

### What Changes with a Closure?

Now consider:

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    console.log(count);
  };
}

const counter = createCounter();
```

Here, the inner function uses:

```text
count
```

Although `createCounter()` finishes executing, the returned function still needs access to `count`.

Instead of deleting the variable, JavaScript preserves it.

---

### Why Doesn't JavaScript Delete the Variable?

JavaScript's **Garbage Collector** only removes memory that is **no longer reachable**.

In this example:

```js
const counter = createCounter();
```

`counter` still references the inner function.

The inner function references the Lexical Environment.

The Lexical Environment contains:

```text
count
```

Therefore:

```text
counter

↓

Inner Function

↓

Lexical Environment

↓

count
```

Since a reference still exists, `count` is considered **reachable**.

The Garbage Collector cannot remove it.

---

### What Happens After the Outer Function Returns?

Let's examine the sequence step by step.

```js
const counter = createCounter();
```

Step 1:

```text
createCounter()

↓

Execution Context Created
```

Step 2:

```text
count = 0
```

Step 3:

```text
Inner Function Created

↓

Closure Formed
```

Step 4:

```text
Execution Context Removed
```

Step 5:

```text
Lexical Environment Preserved
```

Now the function stored in `counter` still has access to `count`.

---

### How Does the Closure Keep the Variable Alive?

A Closure doesn't copy variables.

Instead, it stores a **reference** to the Lexical Environment.

Think of it like this:

```text
Closure

↓

Reference

↓

Lexical Environment

↓

count
```

Because the Closure points to the original variable, every update is preserved.

Example:

```js
counter();

counter();

counter();
```

Output:

```text
1

2

3
```

The same `count` variable is updated every time.

---

### Can a Closure Access Global Variables?

Yes.

Closures can access:

- Local variables.
- Outer function variables.
- Global variables.

Example:

```js
const company = "Vaibhav Docs";

function createGreeting() {
  const message = "Welcome";

  return function () {
    console.log(message);
    console.log(company);
  };
}

const greet = createGreeting();

greet();
```

Output:

```text
Welcome

Vaibhav Docs
```

The Closure follows the **Scope Chain** to find each variable.

---

### Can a Closure Modify Outer Variables?

Yes.

Closures don't just read variables—they can also modify them.

Example:

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    return count;
  };
}

const counter = createCounter();

console.log(counter());

console.log(counter());
```

Output:

```text
1

2
```

The Closure keeps updating the same preserved variable.

---

### When Are Captured Variables Finally Removed?

Captured variables remain in memory **only while they are still reachable**.

Example:

```js
let counter = createCounter();
```

Later:

```js
counter = null;
```

Now:

- No variable references the Closure.
- The Closure no longer references the Lexical Environment.
- The captured variables become unreachable.

At this point, JavaScript's Garbage Collector can safely reclaim the memory.

---

### Complete Memory Lifecycle

```text
Outer Function Called

↓

Variables Created

↓

Closure References Variables

↓

Outer Function Returns

↓

Execution Context Destroyed

↓

Variables Preserved

↓

Closure Removed

↓

Garbage Collection
```

This ensures memory is retained only as long as it's actually needed.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore the famous **`setTimeout()` inside a `for` loop** interview question and see how Closures behave differently with `var` and `let`.

---

### 💻 Example

We'll continue using our running example.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    return count;
  };
}

const counter = createCounter();

console.log(counter());

console.log(counter());

console.log(counter());
```

Output:

```text
1

2

3
```

Although `createCounter()` has finished executing, the `count` variable remains available because the Closure still references its Lexical Environment.

---

### 📊 Diagram / Flow

#### Normal Function

```text
Function Called

↓

Execution Context

↓

Execute

↓

Execution Context Destroyed

↓

Variables Removed
```

---

#### Closure

```text
Outer Function

↓

Variables Created

↓

Closure References Variables

↓

Outer Function Returns

↓

Variables Preserved
```

---

#### Memory Reference

```text
counter

↓

Inner Function

↓

Lexical Environment

↓

count
```

---

#### Garbage Collection

```text
No References

↓

Unreachable Memory

↓

Garbage Collector

↓

Memory Released
```

---

### 🌍 Real-World Example

Imagine borrowing a book from a library.

Normally, after reading the book, you return it.

```text
Borrow Book

↓

Read

↓

Return Book
```

Now imagine you renew the book because you're still using it.

```text
Borrow Book

↓

Renew

↓

Continue Reading

↓

Return Later
```

The library doesn't take the book back while you still have a valid borrowing record.

Closures work the same way.

Normally, local variables are removed after a function finishes.

However, if a Closure still "holds the borrowing record" (a reference), JavaScript keeps those variables alive.

Only when the Closure is no longer reachable can the Garbage Collector remove them.

---

### 🎤 Interview Answer

Closures remember variables after the outer function returns because JavaScript preserves the outer function's **Lexical Environment** whenever an inner function still references it. Although the outer function's **Execution Context** is removed from the Call Stack, the captured variables remain reachable through the Closure. JavaScript's Garbage Collector only removes memory that is no longer reachable, so these variables stay in memory until every reference to the Closure is removed. Closures can both access and modify variables from their outer and global scopes, making them useful for state preservation, data privacy, and many advanced programming patterns.

---

### ❓ Follow-up Questions

1. Why aren't variables captured by a Closure garbage collected immediately?
2. Can a Closure modify variables from its outer scope?
3. Can a Closure access global variables?
4. How does JavaScript decide when captured variables can be removed from memory?
5. Does a Closure copy variables or keep references to them?
6. What happens to the captured variables when the Closure itself becomes unreachable?

---

## 4. Closures with `var`, `let`, and the Famous `for` Loop Problem

### 📖 Overview

One of the most common JavaScript interview questions is:

> **Why does `setTimeout()` inside a `for` loop behave differently with `var` and `let`?**

Many developers expect the following code to print:

```text
0
1
2
```

Instead, it prints:

```text
3
3
3
```

This isn't caused by `setTimeout()` itself. It's the result of how **Closures**, **Scope**, and **`var`** work together.

Understanding this topic gives you a much deeper understanding of Closures.

---

### ⚙️ Main Explanation

### The Famous `var` Example

Consider the following code:

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

Output:

```text
3

3

3
```

Many beginners expect:

```text
0

1

2
```

Why doesn't that happen?

---

### What Actually Happens?

The loop finishes almost instantly.

Execution:

```text
i = 0

↓

Schedule Callback

↓

i = 1

↓

Schedule Callback

↓

i = 2

↓

Schedule Callback

↓

Loop Ends

↓

i = 3
```

Only after the loop has completed does `setTimeout()` begin executing its callbacks.

Each callback forms a Closure over the **same** variable:

```text
i
```

By the time the callbacks execute:

```text
i = 3
```

Therefore every callback prints:

```text
3
```

---

### Why Does This Happen with `var`?

`var` is **function-scoped**, not block-scoped.

The entire loop shares a single variable.

```text
Function Scope

│

└── i

     │

     ├── Iteration 1

     ├── Iteration 2

     └── Iteration 3
```

Every Closure references this one shared variable.

---

### How Does `let` Solve the Problem?

Now consider:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

Output:

```text
0

1

2
```

Why?

Unlike `var`, `let` is **block-scoped**.

For every loop iteration, JavaScript creates a **new binding** of `i`.

Conceptually, it's similar to:

```text
Iteration 1

↓

i = 0

-------------------

Iteration 2

↓

i = 1

-------------------

Iteration 3

↓

i = 2
```

Each callback closes over a **different** variable.

Therefore each Closure remembers its own value.

---

### Visualizing `var`

```text
Loop

↓

One Variable

↓

i

↓

Callbacks

│

├── Closure

├── Closure

└── Closure

↓

All Read

↓

3
```

---

### Visualizing `let`

```text
Iteration 1

↓

i = 0

↓

Closure 1

-------------------

Iteration 2

↓

i = 1

↓

Closure 2

-------------------

Iteration 3

↓

i = 2

↓

Closure 3
```

Each Closure captures its own lexical environment.

---

### How Did Developers Solve This Before `let`?

Before ES6 introduced `let`, developers often used an **IIFE (Immediately Invoked Function Expression)**.

Example:

```js
for (var i = 0; i < 3; i++) {
  (function (currentValue) {
    setTimeout(() => {
      console.log(currentValue);
    }, 1000);
  })(i);
}
```

Output:

```text
0

1

2
```

Each IIFE creates a new function scope and preserves its own copy of the current value.

---

### `var` vs `let` in Closures

| `var` | `let` |
|--------|--------|
| Function-scoped | Block-scoped |
| One shared variable | New variable per iteration |
| All Closures share the same variable | Each Closure gets its own variable |
| Often causes loop-related bugs | Avoids the classic loop problem |

---

### Why Isn't `setTimeout()` the Problem?

A common misconception is that `setTimeout()` causes the issue.

It doesn't.

Even if another asynchronous API were used, the result would be the same.

The real cause is:

- Closures.
- Shared `var` variable.
- Asynchronous execution.

`setTimeout()` simply delays when the Closure executes.

---

### How Would You Explain This to a Junior Developer?

A simple explanation is:

> With `var`, every callback shares **one notebook**.

As the loop runs, everyone keeps writing in the same notebook.

By the time the callbacks read it, the final value is:

```text
3
```

With `let`, every iteration receives **its own notebook**.

Each callback reads the notebook created specifically for that iteration.

That's why the outputs are:

```text
0

1

2
```

---

### Best Practices

- Prefer `let` over `var` inside loops.
- Avoid `var` unless there's a specific reason to use it.
- Understand that Closures capture **variables**, not copies of values.
- Remember that asynchronous callbacks execute **after** the loop has finished.

---

### 💻 Example

Using `var`:

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

Output:

```text
3

3

3
```

Using `let`:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

Output:

```text
0

1

2
```

This demonstrates how Closures behave differently depending on whether each iteration has its own variable or shares a single one.

---

### 📊 Diagram / Flow

#### `var`

```text
Loop

↓

One Variable

↓

i

↓

All Closures

↓

3
```

---

#### `let`

```text
Iteration 1

↓

i = 0

↓

Closure

-------------------

Iteration 2

↓

i = 1

↓

Closure

-------------------

Iteration 3

↓

i = 2

↓

Closure
```

---

#### Execution Order

```text
Loop Runs

↓

Callbacks Scheduled

↓

Loop Finishes

↓

Callbacks Execute
```

---

#### Closure

```text
Callback

↓

Reference

↓

Captured Variable
```

---

### 🌍 Real-World Example

Imagine three students writing exam answers.

With **`var`**, they all share the **same answer sheet**.

```text
Student 1

↓

Shared Sheet

↓

Student 2

↓

Shared Sheet

↓

Student 3

↓

Shared Sheet
```

By the time the teacher collects it, only the **final answer** remains.

Now imagine each student receives their own answer sheet.

```text
Student 1 → Sheet 1

Student 2 → Sheet 2

Student 3 → Sheet 3
```

Each student's work is preserved independently.

That's exactly how `let` works inside a loop—every iteration gets its own variable, so each Closure remembers a different value.

---

### 🎤 Interview Answer

The famous `setTimeout()` inside a `for` loop issue occurs because Closures capture **variables**, not copies of their values. When `var` is used, the loop creates a single function-scoped variable that every callback shares. Since the callbacks execute after the loop finishes, they all see the final value of `i`, which is `3`. When `let` is used, JavaScript creates a new block-scoped variable for each iteration, so every Closure captures a different variable. As a result, the callbacks correctly print `0`, `1`, and `2`. Before ES6, developers commonly solved this problem using an IIFE to create a new scope for each iteration.

---

### ❓ Follow-up Questions

1. Why does `var` print `3 3 3` in the `setTimeout()` loop?
2. Why does `let` print `0 1 2` instead?
3. How did developers solve this problem before ES6 introduced `let`?
4. Does the problem come from `setTimeout()` or from Closures?
5. Do Closures capture variables or copies of values?
6. Why does JavaScript create a new binding for `let` in each loop iteration?

---

## 5. What are the Real-World Use Cases of Closures?

### 📖 Overview

Closures are much more than an interview topic—they are used extensively in real-world JavaScript applications.

Many popular JavaScript features rely on Closures, including:

- Event listeners
- Callbacks
- Asynchronous programming
- React Hooks
- Timers
- State management

Even if you don't create Closures intentionally, you're probably using them every day.

Understanding these use cases helps you recognize why Closures are considered one of JavaScript's most powerful features.

---

### ⚙️ Main Explanation

### 1. Closures in Event Handlers

Event handlers often need access to variables that were available when they were created.

Example:

```js
const company = "Vaibhav Docs";

button.addEventListener("click", function () {
  console.log(company);
});
```

Even if this callback executes much later, it still remembers the `company` variable.

The event handler forms a Closure over its surrounding scope.

---

### 2. Closures in Callbacks

Callbacks frequently execute after the surrounding function has finished.

Example:

```js
function process(callback) {
  callback();
}

const message = "Completed";

process(function () {
  console.log(message);
});
```

Output:

```text
Completed
```

The callback remembers `message` through a Closure.

---

### 3. Closures in Asynchronous JavaScript

Closures are especially important in asynchronous code.

Example:

```js
function fetchData() {
  const requestId = 101;

  setTimeout(() => {
    console.log(requestId);
  }, 1000);
}

fetchData();
```

Output:

```text
101
```

Although `fetchData()` has already returned, the callback still accesses `requestId`.

This is possible because of the Closure.

---

### 4. Closures in Timers

Functions like `setTimeout()` and `setInterval()` depend heavily on Closures.

Example:

```js
let count = 0;

setInterval(() => {
  count++;

  console.log(count);
}, 1000);
```

Each execution of the callback remembers and updates the same `count` variable.

---

### 5. Closures in React Hooks

React relies heavily on Closures.

Example:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log(count);
  }

  return (
    <button onClick={handleClick}>
      Click
    </button>
  );
}
```

`handleClick()` forms a Closure over the `count` variable.

Every render creates a new function that remembers the values from that particular render.

> 💡 **Coming Next**
>
> React Hooks use Closures extensively. We'll explore React rendering and Hooks in detail in the **React** documentation.

---

### 6. Closures in Function Factories

Closures allow functions to create customized versions of other functions.

Example:

```js
function createGreeting(message) {
  return function (name) {
    console.log(
      `${message}, ${name}`
    );
  };
}

const welcome =
  createGreeting("Welcome");

welcome("Vaibhav");
```

Output:

```text
Welcome, Vaibhav
```

The returned function remembers the `message` variable.

This is called a **Function Factory**.

We'll study Function Factories in more detail in the next topic.

---

### 7. Closures in Data Privacy

Closures can hide variables from the outside world.

Example:

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    return count;
  };
}

const counter = createCounter();

console.log(counter());

console.log(counter());
```

Output:

```text
1

2
```

No external code can access `count` directly.

Only the returned function can.

This provides simple data privacy.

---

### Why Are Closures So Common?

Closures allow functions to preserve state.

Without Closures:

```text
Function Executes

↓

Variables Lost
```

With Closures:

```text
Function Executes

↓

Variables Preserved

↓

Future Function Calls
```

This ability makes many JavaScript APIs possible.

---

### Callback vs Closure

These concepts are related but different.

A callback is simply a function passed to another function.

A callback becomes a Closure **only if it captures variables from its outer scope**.

Example:

```js
const company = "Vaibhav Docs";

setTimeout(function () {
  console.log(company);
}, 1000);
```

Here:

- Callback → `function () {}`
- Closure → Because it remembers `company`

Not every callback is necessarily a Closure.

---

### Best Practices

When using Closures:

- Keep captured variables to a minimum.
- Avoid holding unnecessary large objects.
- Prefer small, focused callback functions.
- Remember that asynchronous code often relies on Closures.

---

### 💻 Example

We'll continue using our running example.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    console.log(count);
  };
}

const counter = createCounter();

setTimeout(counter, 1000);

setTimeout(counter, 2000);

setTimeout(counter, 3000);
```

Output:

```text
1

2

3
```

Even though the callbacks execute at different times, each one remembers the same `count` variable.

---

### 📊 Diagram / Flow

#### Event Handler

```text
Event

↓

Callback

↓

Closure

↓

Captured Variables
```

---

#### Async JavaScript

```text
Function

↓

Returns

↓

Callback Executes Later

↓

Closure Accesses Variables
```

---

#### Function Factory

```text
Outer Function

↓

Return Function

↓

Closure

↓

Customized Function
```

---

#### React

```text
Render

↓

Create Functions

↓

Closure

↓

Event Handler
```

---

### 🌍 Real-World Example

Imagine a customer support system.

A customer submits a support ticket.

```text
Customer

↓

Ticket Created

↓

Support Agent Responds Later
```

When the support agent opens the ticket hours later, all the customer's information is still available.

The information wasn't lost when the customer left.

Similarly, a Closure allows a callback or event handler to access the variables that existed when it was created, even if it executes much later.

The Closure preserves the necessary context until it's needed.

---

### 🎤 Interview Answer

Closures are widely used in real-world JavaScript because they allow functions to preserve state after the outer function has finished executing. Common use cases include event handlers, callbacks, asynchronous programming with `setTimeout()` and Promises, React Hooks, function factories, and data privacy. In React, event handlers and Hooks rely heavily on Closures to access values from a specific render. A callback becomes a Closure when it captures variables from its surrounding lexical scope. This ability to preserve context makes Closures one of the most powerful features of JavaScript.

---

### ❓ Follow-up Questions

1. Why are Closures commonly used in event listeners?
2. How do Closures work with asynchronous JavaScript?
3. Why do React Hooks rely on Closures?
4. What is the difference between a Callback and a Closure?
5. How do Function Factories use Closures?
6. Why are Closures useful for preserving state?

---

## 6. How are Closures used for Data Privacy and Function Factories?

### 📖 Overview

One of the most practical uses of Closures is **encapsulation**—keeping data private while exposing only the functionality that should be accessible.

Before JavaScript introduced **private class fields (`#field`)**, Closures were the primary way to create private variables.

Closures are also widely used to build **Function Factories**, where one function creates and returns customized versions of another function.

These patterns are commonly used in libraries, frameworks, and production applications.

---

### ⚙️ Main Explanation

### Closures for Data Privacy

Normally, variables declared inside a function cannot be accessed from outside.

Closures take advantage of this behavior by returning functions that can still access those private variables.

Example:

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    return count;
  };
}

const counter = createCounter();

console.log(counter());

console.log(counter());
```

Output:

```text
1

2
```

Notice that `count` cannot be accessed directly.

```js
console.log(count);
```

Output:

```text
ReferenceError
```

The only way to modify `count` is through the returned function.

---

### Implementing a Private Counter

A common interview question is:

> **How would you implement a private counter using Closures?**

One approach is to expose only the operations that should be available.

```js
function createCounter() {
  let count = 0;

  return {
    increment() {
      count++;
    },

    decrement() {
      count--;
    },

    getValue() {
      return count;
    },
  };
}

const counter = createCounter();

counter.increment();

counter.increment();

console.log(counter.getValue());
```

Output:

```text
2
```

Here:

- `count` is private.
- External code cannot modify it directly.
- Interaction is controlled through public methods.

---

### Why Does This Provide Privacy?

The variable:

```text
count
```

exists only inside the lexical environment of `createCounter()`.

The returned object's methods form Closures over that environment.

```text
increment()

↓

Closure

↓

count
```

Since nothing outside the Closure has direct access, the variable remains private.

---

### What is a Function Factory?

A **Function Factory** is a function that creates and returns another function.

Each returned function remembers its own captured variables.

Example:

```js
function createGreeting(message) {
  return function (name) {
    console.log(
      `${message}, ${name}`
    );
  };
}

const welcome =
  createGreeting("Welcome");

const hello =
  createGreeting("Hello");

welcome("Vaibhav");

hello("Rahul");
```

Output:

```text
Welcome, Vaibhav

Hello, Rahul
```

Each function remembers a different value of `message`.

---

### Why Are Function Factories Useful?

Without a Function Factory:

```js
function welcome(name) {}

function hello(name) {}

function goodbye(name) {}
```

You would need many similar functions.

With a Function Factory:

```js
const welcome =
  createGreeting("Welcome");

const hello =
  createGreeting("Hello");

const goodbye =
  createGreeting("Goodbye");
```

One reusable function creates many customized versions.

---

### Closures in the Module Pattern

Before ES6 modules became standard, developers commonly used Closures to create modules.

Example:

```js
const counterModule = (function () {
  let count = 0;

  return {
    increment() {
      count++;
    },

    getValue() {
      return count;
    },
  };
})();
```

Output:

```js
counterModule.increment();

console.log(
  counterModule.getValue()
);
```

```text
1
```

The variable `count` remains private inside the module.

---

### Closures vs Private Class Fields (`#field`)

Modern JavaScript also provides private class fields.

Example:

```js
class Counter {
  #count = 0;

  increment() {
    this.#count++;
  }

  getValue() {
    return this.#count;
  }
}
```

Both approaches provide data privacy.

| Closures | Private Class Fields |
|----------|----------------------|
| Work with functions | Work with classes |
| Supported before ES2022 | Introduced in ES2022 |
| Private through lexical scope | Private through language syntax |
| Great for functional programming | Great for object-oriented programming |

Choose the approach that matches your programming style.

---

### Function Factory vs Closure

These terms are related but not identical.

A **Closure** is a language feature.

A **Function Factory** is a design pattern built using Closures.

Every Function Factory relies on Closures, but not every Closure is a Function Factory.

---

### Best Practices

When using Closures for data privacy:

- Expose only the operations users need.
- Keep private data hidden.
- Avoid exposing internal variables directly.
- Prefer clear APIs over direct state manipulation.

---

### 💻 Example

We'll continue using our running example.

```js
function createInvoice(prefix) {
  let invoiceNumber = 1;

  return function () {
    return `${prefix}-${invoiceNumber++}`;
  };
}

const generateInvoice =
  createInvoice("INV");

console.log(generateInvoice());

console.log(generateInvoice());

console.log(generateInvoice());
```

Output:

```text
INV-1

INV-2

INV-3
```

Here:

- `invoiceNumber` remains private.
- The returned function remembers its value through a Closure.

---

### 📊 Diagram / Flow

#### Data Privacy

```text
Outer Function

↓

Private Variable

↓

Closure

↓

Public Methods
```

---

#### Function Factory

```text
Factory Function

↓

Create Function

↓

Closure

↓

Customized Function
```

---

#### Module Pattern

```text
Module

↓

Private Data

↓

Public API
```

---

#### Private Counter

```text
count

↓

Closure

↓

increment()

decrement()

getValue()
```

---

### 🌍 Real-World Example

Imagine a bank vault.

Inside the vault is a customer's balance.

```text
Vault

↓

Balance
```

Customers cannot enter the vault directly.

Instead, they interact through authorized services.

```text
Deposit

Withdraw

Check Balance
```

The balance remains protected because only approved operations can access it.

Closures provide the same kind of protection.

Private variables remain hidden inside the lexical environment, while selected functions act as the only authorized way to interact with them.

---

### 🎤 Interview Answer

Closures are commonly used for **data privacy** by keeping variables inside an outer function while exposing only selected functions that can access them. This allows private state to be maintained without exposing it directly. Closures are also used to build **Function Factories**, where a function returns customized functions that remember values from their creation environment. Before ES6 modules and ES2022 private class fields, Closures were widely used to implement the Module Pattern. Even today, they remain a powerful technique for encapsulation and functional programming.

---

### ❓ Follow-up Questions

1. How do Closures provide data privacy?
2. How would you implement a private counter using Closures?
3. What is a Function Factory, and how does it use Closures?
4. What is the Module Pattern?
5. What is the difference between Closures and private class fields (`#field`)?
6. What is the difference between a Closure and a Function Factory?

---

## 7. How are Closures used in Functional Programming?

### 📖 Overview

Closures are one of the fundamental building blocks of **Functional Programming (FP)** in JavaScript.

Many popular functional programming techniques rely on Closures, including:

- Memoization
- Currying
- Function Composition
- Function Factories

Closures make these patterns possible by allowing functions to **remember values from the environment in which they were created**.

Without Closures, most functional programming techniques in JavaScript would not exist.

---

### ⚙️ Main Explanation

### Closures in Functional Programming

Functional Programming encourages writing:

- Small functions.
- Reusable functions.
- Predictable functions.
- Functions without shared mutable state.

Closures help achieve these goals by preserving state inside functions without relying on global variables.

---

### What is Memoization?

**Memoization** is an optimization technique where a function stores previously calculated results.

If the same input is provided again, the stored result is returned instead of recalculating it.

Example:

```js
function createSquareCalculator() {
  const cache = {};

  return function (number) {
    if (cache[number]) {
      return cache[number];
    }

    const result = number * number;

    cache[number] = result;

    return result;
  };
}

const square =
  createSquareCalculator();

console.log(square(5));

console.log(square(5));
```

Output:

```text
25

25
```

The `cache` object remains available because the returned function forms a Closure over it.

---

### Why Does Memoization Use Closures?

Without a Closure, the cache would disappear after the function finishes.

With a Closure:

```text
Function

↓

Cache

↓

Closure

↓

Future Calls
```

The cached values remain available across multiple function calls.

---

### What is Currying?

Currying transforms a function that accepts multiple arguments into a sequence of functions that each accept **one argument**.

Example:

```js
function multiply(a) {
  return function (b) {
    return a * b;
  };
}

const double = multiply(2);

console.log(double(10));
```

Output:

```text
20
```

The returned function remembers the value of `a` through a Closure.

---

### How Do Closures Make Currying Possible?

Consider:

```js
const double = multiply(2);
```

Internally:

```text
double

↓

Closure

↓

a = 2
```

Whenever:

```js
double(10);
```

is called, the Closure still remembers:

```text
a = 2
```

---

### Closures and Function Composition

Function Composition combines multiple small functions.

Example:

```js
function addTax(price) {
  return price + 180;
}

function applyDiscount(price) {
  return price - 100;
}

const total =
  applyDiscount(
    addTax(1000)
  );

console.log(total);
```

Output:

```text
1080
```

Although Composition itself doesn't require Closures, it commonly works alongside Closure-based techniques such as Currying and Function Factories.

---

### Closures in Function Factories

A Function Factory creates customized functions.

Example:

```js
function createMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const triple =
  createMultiplier(3);

console.log(triple(5));
```

Output:

```text
15
```

The returned function remembers:

```text
multiplier = 3
```

using a Closure.

---

### Why Are Closures Important in Functional Programming?

Closures allow functions to carry state without relying on global variables.

Instead of:

```text
Global Variables

↓

Shared State
```

we get:

```text
Closure

↓

Private State

↓

Reusable Function
```

This makes functions:

- Independent.
- Reusable.
- Easier to test.

---

### Memoization vs Closure

Memoization is a **technique**.

Closure is the **language feature** that makes Memoization possible.

Without Closures, cached values couldn't survive between function calls.

---

### Best Practices

When using Closures in functional programming:

- Prefer Pure Functions whenever possible.
- Keep captured state minimal.
- Avoid storing unnecessary large objects inside Closures.
- Use Memoization only for expensive calculations.
- Use Currying when creating specialized functions improves readability.

---

### 💻 Example

We'll continue using our running example.

```js
function createTaxCalculator(rate) {
  return function (price) {
    return price + price * rate;
  };
}

const calculateGST =
  createTaxCalculator(0.18);

console.log(
  calculateGST(1000)
);

console.log(
  calculateGST(2000)
);
```

Output:

```text
1180

2360
```

The returned function remembers the `rate` variable through a Closure.

---

### 📊 Diagram / Flow

#### Memoization

```text
Function

↓

Cache

↓

Closure

↓

Reuse Cached Value
```

---

#### Currying

```text
Function

↓

Return Function

↓

Closure

↓

Remember Argument
```

---

#### Function Factory

```text
Factory

↓

Create Function

↓

Closure

↓

Customized Function
```

---

#### Functional Programming

```text
Small Functions

↓

Composition

↓

Closures

↓

Reusable Code
```

---

### 🌍 Real-World Example

Imagine a restaurant.

A chef creates a special spice mix for a recipe.

```text
Recipe

↓

Secret Spice Mix

↓

Cook Meal
```

Every time the recipe is prepared, the chef uses the same preserved spice mix.

The recipe doesn't need to recreate it each time.

Closures behave similarly.

They preserve important data—such as a cached result, a tax rate, or a multiplier—so future function calls can continue using it without relying on global variables.

This ability makes Closures a key building block of Functional Programming.

---

### 🎤 Interview Answer

Closures are fundamental to Functional Programming because they allow functions to preserve state without relying on global variables. They make techniques like **Memoization**, **Currying**, and **Function Factories** possible by remembering variables from their lexical environment. Memoization uses Closures to store cached results across function calls, while Currying uses Closures to remember previously supplied arguments. Together with Function Composition, Closures help create modular, reusable, and maintainable code that follows functional programming principles.

---

### ❓ Follow-up Questions

1. How do Closures make Memoization possible?
2. Why does Currying rely on Closures?
3. What is the relationship between Closures and Functional Programming?
4. Does Function Composition require Closures?
5. Why are Closures preferred over global variables in functional programming?
6. What are the advantages of using Memoization?

---

## 8. Memory Management and Performance of Closures

### 📖 Overview

Closures are incredibly useful, but like any powerful feature, they should be used carefully.

A Closure keeps its captured variables alive as long as they are still needed. This is usually beneficial, but it also means that Closures can:

- Keep objects in memory longer than expected.
- Increase memory usage.
- Cause memory leaks if references are not released.
- Affect performance when overused.

Understanding how Closures interact with memory helps you write efficient and maintainable JavaScript applications.

---

### ⚙️ Main Explanation

### How Do Closures Affect Memory?

Normally, when a function finishes executing, its local variables become unreachable and can be removed by the **Garbage Collector**.

Example:

```js
function greet() {
  const message = "Welcome";

  console.log(message);
}

greet();
```

After execution:

```text
Execution Context Removed

↓

Variables Become Unreachable

↓

Garbage Collection
```

---

Now consider a Closure.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    return count;
  };
}

const counter = createCounter();
```

Here:

```text
counter

↓

Closure

↓

Lexical Environment

↓

count
```

The variable `count` remains in memory because the Closure still references it.

---

### Is This a Memory Leak?

No.

Keeping `count` alive is **expected behavior**.

A Closure preserving variables is **not** a memory leak.

It becomes a problem only when the preserved data is **no longer needed but is still referenced**.

---

### What is a Memory Leak?

A memory leak occurs when memory that should be released **remains reachable**, preventing the Garbage Collector from freeing it.

Example:

```js
function createHandler() {
  const largeData = new Array(1000000).fill("Data");

  return function () {
    console.log(largeData.length);
  };
}

const handler = createHandler();
```

The Closure now holds a reference to `largeData`.

As long as `handler` exists, `largeData` cannot be garbage collected.

If the handler is never used again but still referenced somewhere, unnecessary memory is consumed.

---

### How Can Closures Cause Memory Leaks?

Closures themselves do not create memory leaks.

Instead, leaks occur when developers accidentally keep references alive.

Common examples include:

- Event listeners that are never removed.
- Long-lived timers.
- Global arrays storing callbacks.
- Unnecessary references to large objects.
- Detached DOM elements captured by Closures.

The issue is **unreleased references**, not Closures themselves.

---

### How Can You Prevent Memory Leaks?

#### 1. Remove Unused Event Listeners

Instead of leaving listeners attached forever:

```js
button.addEventListener("click", handler);
```

Remove them when they are no longer needed.

```js
button.removeEventListener(
  "click",
  handler
);
```

---

#### 2. Clear Timers

Always clear timers that are no longer required.

```js
clearInterval(timerId);
```

---

#### 3. Avoid Capturing Large Objects

Instead of:

```js
const largeData = hugeObject;
```

Capture only the data you actually need.

Smaller Closures use less memory.

---

#### 4. Release References

When a Closure is no longer needed:

```js
handler = null;
```

Once no references remain, the Garbage Collector can reclaim the memory.

---

### Performance Implications of Closures

Closures introduce a small amount of overhead because JavaScript must preserve the captured lexical environment.

However, in most applications, this overhead is **very small**.

The real performance problems usually come from:

- Capturing large objects.
- Creating excessive unnecessary Closures.
- Preventing Garbage Collection.

For normal applications, readability and maintainability are far more important than avoiding Closures.

---

### When Should You Avoid Closures?

Avoid Closures when:

- They unnecessarily retain very large data structures.
- Simpler code would achieve the same result.
- A Closure exists only because of accidental design.

Do **not** avoid Closures simply because they use memory.

They are a core part of modern JavaScript and are used extensively in frameworks like React.

---

### Optimizing a Closure Holding a Large Object

Instead of:

```js
function createLogger() {
  const user = {
    name: "Vaibhav",
    profile: hugeProfileObject,
  };

  return function () {
    console.log(user.name);
  };
}
```

The Closure unnecessarily retains the entire `user` object.

A better approach is to capture only the required value.

```js
function createLogger() {
  const name = "Vaibhav";

  return function () {
    console.log(name);
  };
}
```

Now the Closure retains only a small string instead of a large object.

---

### Garbage Collection and Closures

The Garbage Collector follows a simple rule:

```text
Reachable?

│

├── Yes

│     Keep Memory

│
└── No

      Release Memory
```

A Closure simply keeps some variables **reachable**.

Once every reference to the Closure disappears, those variables also become unreachable and are eventually garbage collected.

---

### Best Practices

- Capture only the variables you need.
- Remove unused event listeners.
- Clear timers when finished.
- Release references to unused Closures.
- Don't fear Closures—use them intentionally.

---

### 💻 Example

We'll continue using our running example.

```js
function createInvoiceGenerator(prefix) {
  return function (number) {
    return `${prefix}-${number}`;
  };
}

let generateInvoice =
  createInvoiceGenerator("INV");

console.log(
  generateInvoice(1)
);

generateInvoice = null;
```

Output:

```text
INV-1
```

After assigning:

```js
generateInvoice = null;
```

the Closure becomes unreachable.

Its captured variables can now be garbage collected.

---

### 📊 Diagram / Flow

#### Normal Function

```text
Function Ends

↓

Variables Unreachable

↓

Garbage Collection
```

---

#### Closure

```text
Closure Exists

↓

Variables Reachable

↓

Memory Preserved
```

---

#### Memory Leak

```text
Large Object

↓

Closure

↓

Unused Reference

↓

Memory Not Released
```

---

#### Garbage Collection

```text
No References

↓

Unreachable

↓

Garbage Collector

↓

Memory Released
```

---

### 🌍 Real-World Example

Imagine renting a storage unit.

If you're actively using it, the company keeps it reserved for you.

```text
Storage Unit

↓

Items Stored

↓

Still Needed
```

Now imagine you move out but forget to cancel the rental.

```text
Storage Unit

↓

Empty

↓

Still Paying Rent
```

The unit remains reserved even though you no longer need it.

Closures behave similarly.

As long as something still references a Closure, JavaScript keeps its captured variables in memory.

Once those references are removed, the Garbage Collector can safely clean everything up.

---

### 🎤 Interview Answer

Closures preserve captured variables by keeping their lexical environment reachable. This is normal behavior and is not a memory leak by itself. Memory leaks occur only when Closures unnecessarily retain references to objects that are no longer needed, such as large data structures, event listeners, or timers. JavaScript's Garbage Collector removes captured variables only after the Closure itself becomes unreachable. To avoid memory issues, capture only the required data, remove unused event listeners, clear timers, and release references when Closures are no longer needed.

---

### ❓ Follow-up Questions

1. Do Closures themselves cause memory leaks?
2. Why aren't captured variables garbage collected immediately?
3. How can you prevent memory leaks caused by Closures?
4. How do Closures affect memory usage?
5. When should you avoid using Closures?
6. How would you optimize a Closure that captures a large object?

---

## 9. What are Common Mistakes When Using Closures?

### 📖 Overview

Closures are extremely useful, but they can also lead to confusing bugs when misunderstood.

Most Closure-related problems are not caused by the Closure itself—they happen because developers misunderstand:

- How variables are captured.
- How scope works.
- How asynchronous code executes.
- How memory is managed.

Learning these common mistakes helps you avoid subtle bugs and write more reliable JavaScript code.

---

### ⚙️ Main Explanation

### 1. Assuming Closures Capture Values Instead of Variables

A common misconception is that Closures store a **copy** of a variable.

In reality, Closures keep a **reference** to the variable.

Example:

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    console.log(count);
  };
}

const counter = createCounter();

counter();

counter();
```

Output:

```text
1

2
```

If Closures copied values, every call would print `1`.

Instead, they access the same preserved variable.

---

### 2. Using `var` Inside Loops

One of the most famous Closure bugs is:

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

Output:

```text
3

3

3
```

Every callback closes over the same variable.

Using `let` creates a new binding for each iteration.

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

Output:

```text
0

1

2
```

---

### 3. Holding Large Objects Unnecessarily

Sometimes a Closure captures more data than it actually needs.

Example:

```js
function createLogger() {
  const user = {
    name: "Vaibhav",
    profile: hugeProfileObject,
  };

  return function () {
    console.log(user.name);
  };
}
```

Although only `user.name` is required, the entire `user` object remains in memory.

A better approach is to capture only the required value.

```js
function createLogger() {
  const name = "Vaibhav";

  return function () {
    console.log(name);
  };
}
```

---

### 4. Forgetting to Remove Event Listeners

Closures are commonly used in event handlers.

Example:

```js
button.addEventListener(
  "click",
  handler
);
```

If the listener is never removed, the Closure may continue to keep variables in memory longer than necessary.

Always remove listeners that are no longer needed.

```js
button.removeEventListener(
  "click",
  handler
);
```

---

### 5. Creating Closures Unnecessarily

Not every function needs to be a Closure.

Sometimes developers wrap simple logic inside nested functions even though no state needs to be preserved.

Instead of:

```js
function createPrinter() {
  return function () {
    console.log("Hello");
  };
}
```

A regular function is often simpler.

```js
function print() {
  console.log("Hello");
}
```

Choose Closures only when they solve a real problem.

---

### 6. Depending Too Much on Outer Variables

Example:

```js
let tax = 180;

function calculateTotal(price) {
  return price + tax;
}
```

This function depends on external state.

A better design is:

```js
function calculateTotal(price, tax) {
  return price + tax;
}
```

The function becomes easier to test, reuse, and understand.

---

### 7. Confusing Callbacks with Closures

Many developers think every callback is automatically a Closure.

This isn't true.

Example:

```js
setTimeout(function () {
  console.log("Hello");
}, 1000);
```

This callback doesn't capture any outer variables.

It's simply a callback.

A callback becomes a Closure only when it accesses variables from its surrounding lexical scope.

---

### 8. Forgetting That Closures Preserve State

Closures keep variables alive between function calls.

Example:

```js
const counter =
  createCounter();
```

Calling:

```js
counter();

counter();
```

does not restart the state.

The Closure continues using the same preserved variable.

Developers sometimes expect a fresh state every time.

---

### How to Avoid These Mistakes

Follow these simple guidelines:

- Prefer `let` instead of `var` inside loops.
- Capture only the variables you actually need.
- Remove unused event listeners.
- Avoid unnecessary nested functions.
- Don't confuse callbacks with Closures.
- Remember that Closures preserve references, not copies.

---

### 💻 Example

We'll continue using our running example.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;

    return count;
  };
}

const counter = createCounter();

console.log(counter());

console.log(counter());

console.log(counter());
```

Output:

```text
1

2

3
```

This demonstrates that the Closure preserves the same `count` variable across multiple calls.

---

### 📊 Diagram / Flow

#### Closure

```text
Closure

↓

Reference

↓

Variable

↓

Updated Value
```

---

#### `var` Loop

```text
One Variable

↓

Multiple Closures

↓

Same Final Value
```

---

#### `let` Loop

```text
New Variable

↓

Each Iteration

↓

Independent Closure
```

---

#### Memory

```text
Capture Needed Data

↓

Smaller Closure

↓

Less Memory
```

---

### 🌍 Real-World Example

Imagine a warehouse.

An employee needs only one document from a filing cabinet.

Instead of carrying the entire cabinet, they take just the document.

```text
Cabinet

↓

Required Document

↓

Work Continues
```

Carrying the whole cabinet everywhere would waste space and make work harder.

Closures work the same way.

Capture only the variables you actually need instead of keeping large objects alive unnecessarily.

This keeps your applications more efficient and easier to maintain.

---

### 🎤 Interview Answer

Common mistakes with Closures include assuming they capture copies of variables instead of references, using `var` inside loops, unintentionally retaining large objects in memory, forgetting to remove event listeners, creating unnecessary Closures, relying too much on outer variables, confusing callbacks with Closures, and forgetting that Closures preserve state across function calls. Most Closure-related bugs can be avoided by understanding lexical scope, using `let` in loops, minimizing captured data, and releasing unused references.

---

### ❓ Follow-up Questions

1. Do Closures capture values or references?
2. Why does using `var` inside a loop often cause Closure bugs?
3. How can Closures accidentally increase memory usage?
4. Is every callback a Closure? Why or why not?
5. Why is it important to remove unused event listeners?
6. What are some best practices for avoiding Closure-related bugs?

---

## 10. What are the Best Practices and Interview Perspective on Closures?

### 📖 Overview

Closures are one of the most frequently asked JavaScript interview topics because they demonstrate your understanding of:

- Lexical Scope
- Execution Context
- Functions
- Memory Management
- JavaScript Internals

In real-world development, Closures are used naturally in callbacks, event handlers, React Hooks, function factories, and many other patterns.

The key is knowing **when to use Closures**, **when to avoid them**, and **how to explain them clearly** during an interview.

---

### ⚙️ Main Explanation

### Best Practices for Using Closures

### 1. Use Closures Only When They Solve a Problem

Closures are powerful, but they shouldn't be used everywhere.

Use them when you need to:

- Preserve state.
- Hide private data.
- Create reusable functions.
- Customize function behavior.

If a regular function is sufficient, prefer the simpler solution.

---

### 2. Keep Captured Variables Minimal

A Closure keeps every referenced variable alive.

Instead of capturing:

```js
const user = {
  name: "Vaibhav",
  profile: hugeProfileObject,
};
```

Capture only what's needed.

```js
const name = "Vaibhav";
```

Smaller Closures consume less memory and are easier to maintain.

---

### 3. Prefer `let` in Loops

When asynchronous callbacks are involved:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

Using `let` creates a new binding for each iteration and avoids the classic Closure bug associated with `var`.

---

### 4. Release References When They're No Longer Needed

If a Closure is no longer required, remove references to it.

Example:

```js
let counter = createCounter();

/* ... */

counter = null;
```

Once nothing references the Closure, the Garbage Collector can reclaim its memory.

---

### 5. Write Small, Focused Closures

Instead of creating large functions that capture many variables, create smaller functions with a single responsibility.

Small Closures are:

- Easier to understand.
- Easier to test.
- Less likely to retain unnecessary data.

---

### 6. Understand That Closures Preserve References

Remember:

Closures do **not** copy variables.

They preserve references to variables in the Lexical Environment.

This explains why state can change across multiple function calls.

---

### Explaining Closures in an Interview

A good interview explanation should be simple before becoming technical.

A concise explanation is:

> A Closure is created when an inner function remembers and can access variables from its outer lexical scope, even after the outer function has finished executing.

Then explain **why** this happens.

JavaScript preserves the outer function's Lexical Environment because the inner function still references it.

Finally, give a simple example.

```js
function createCounter() {
  let count = 0;

  return function () {
    return ++count;
  };
}
```

This demonstrates both state preservation and lexical scoping.

---

### Explaining Closures to a Java or C++ Developer

Developers coming from Java or C++ often think that once a function returns, its local variables disappear immediately.

In JavaScript, that is generally true—but Closures are an exception.

When an inner function still references variables from its outer scope, JavaScript keeps the required Lexical Environment alive.

A useful comparison is:

- In Java or C++, local variables typically exist only while the function is active.
- In JavaScript, captured variables can outlive the function if a Closure still references them.

This ability enables patterns like callbacks, function factories, and React Hooks.

---

### Mental Model for Closures

Think of a Closure as two connected pieces:

```text
Function

+

Remembered Environment
```

The function contains the logic.

The remembered environment contains the variables it needs.

Whenever the function executes later, it reconnects to that preserved environment.

---

### When Should You Use Closures?

Closures are a good choice when you need:

- Private state.
- Function factories.
- Callbacks.
- Event handlers.
- Asynchronous operations.
- Memoization.
- Currying.

They allow state to be preserved without relying on global variables.

---

### When Should You Avoid Closures?

Avoid Closures when:

- They retain unnecessary large objects.
- Simpler code would achieve the same result.
- They make the code harder to understand.

Use Closures intentionally, not by default.

---

### Summary of the Chapter

Throughout this chapter, we've learned that:

- Closures are built on Lexical Scope.
- They preserve variables after the outer function returns.
- They rely on Lexical Environments and the Scope Chain.
- They are used in callbacks, event handlers, React Hooks, function factories, and memoization.
- They can increase memory usage if unnecessary references are retained.
- They are one of JavaScript's most powerful and practical language features.

---

### 💻 Example

We'll conclude with our running example.

```js
function createCounter() {
  let count = 0;

  return function () {
    return ++count;
  };
}

const counter = createCounter();

console.log(counter());

console.log(counter());

console.log(counter());
```

Output:

```text
1

2

3
```

This single example demonstrates the core idea behind Closures:

- The outer function returns.
- The inner function survives.
- The captured variable continues to exist.

---

### 📊 Diagram / Flow

#### Closure Mental Model

```text
Function

+

Lexical Environment

↓

Closure
```

---

#### Lifecycle

```text
Outer Function

↓

Inner Function

↓

Closure Created

↓

Outer Function Ends

↓

Variables Preserved

↓

Future Calls
```

---

#### Memory

```text
Closure Exists

↓

Variables Reachable

↓

Memory Preserved

↓

No References

↓

Garbage Collection
```

---

#### Real-World Usage

```text
Callbacks

Event Handlers

React Hooks

Memoization

Function Factories

↓

Closures
```

---

### 🌍 Real-World Example

Imagine a company issuing an employee access card.

The employee leaves the office for the day, but the access card still allows them to enter the building the next morning.

```text
Employee

↓

Access Card Issued

↓

Leaves Office

↓

Returns Later

↓

Access Granted
```

The office itself isn't keeping the employee active all night—it simply preserves the information needed to recognize them later.

A Closure works similarly.

The outer function finishes executing, but JavaScript preserves the necessary variables so the inner function can continue using them whenever it's called again.

---

### 🎤 Interview Answer

A Closure is created when an inner function remembers and accesses variables from its outer lexical scope, even after the outer function has finished executing. JavaScript achieves this by preserving the outer function's Lexical Environment as long as the inner function still references it. Closures are commonly used for data privacy, callbacks, event handlers, function factories, memoization, currying, and React Hooks. They are powerful because they preserve state without relying on global variables, but they should be used carefully to avoid retaining unnecessary memory. Understanding Closures also requires understanding Lexical Scope, Execution Contexts, and the Scope Chain.

---

### ❓ Follow-up Questions

1. Why are Closures considered one of JavaScript's most powerful features?
2. What is the relationship between Closures and Lexical Scope?
3. How does JavaScript preserve variables for a Closure?
4. What are some real-world applications of Closures?
5. Can Closures lead to memory issues? How can they be avoided?
6. How would you explain Closures to someone who is new to JavaScript?

---