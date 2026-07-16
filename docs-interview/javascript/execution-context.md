---
title: Execution Context
description: How the JS engine builds and manages execution contexts — the Call Stack, hoisting, and the memory creation phase.
sidebar_position: 2
---

# Execution Context

---

## 1. What is an Execution Context, why does JavaScript need one, and what are its types?

### 📖 Overview

An **Execution Context** is the **environment in which JavaScript executes code**. It contains everything the JavaScript engine needs to run a piece of code, such as:

- Variables
- Functions
- Scope information
- The `this` binding

You can think of an Execution Context as a **workspace** or **container** that JavaScript creates before executing code.

Every JavaScript program and every function runs inside its own Execution Context.

Without an Execution Context, the JavaScript engine wouldn't know:

- Where variables are stored.
- Which functions are available.
- What the value of `this` should be.
- Which variables are accessible from the current scope.

In simple terms:

> **Execution Context provides all the information required to execute JavaScript code correctly.**

### ❓ Why Does JavaScript Need an Execution Context?

Before JavaScript starts executing code, it must prepare everything required during execution.

Consider the following example:

```js
const company = "Vaibhav Docs";

function greet(name) {
  console.log(`Hello ${name}, welcome to ${company}`);
}

greet("Vaibhav");
```

Before calling `greet()`, JavaScript needs to know:

- Where is the `company` variable stored?
- Where is the `greet()` function stored?
- How can `greet()` access the `company` variable?
- What should `this` refer to?
- Where should the `name` parameter be stored?

Instead of figuring this out every time while executing each line, JavaScript first creates an **Execution Context** that stores all this information.

This makes code execution organized, predictable, and efficient.

### 🏗️ Types of Execution Context

JavaScript primarily creates **two types** of Execution Contexts.

| Type | Description |
|------|-------------|
| **Global Execution Context (GEC)** | Created once when the JavaScript program starts executing. |
| **Function Execution Context (FEC)** | Created every time a function is invoked. |

#### 🌍 Global Execution Context (GEC)

The **Global Execution Context** is the **first Execution Context** created by the JavaScript engine.

There is **only one Global Execution Context** for a JavaScript program.

It is responsible for executing all code written outside of functions.

Using our example:

```js
const company = "Vaibhav Docs";

function greet(name) {
  console.log(`Hello ${name}`);
}
```

The Global Execution Context stores:

- The `company` variable.
- The `greet()` function.
- Other global variables and functions.

The Global Execution Context remains active until the entire JavaScript program finishes executing.

#### ⚡ Function Execution Context (FEC)

Whenever a function is called, JavaScript creates a **new Function Execution Context** specifically for that function.

Each function call gets its **own separate Execution Context**, even if the same function is called multiple times.

Example:

```js
function greet(name) {
  console.log(`Hello ${name}`);
}

greet("Vaibhav");
greet("Rahul");
```

Here:

- Calling `greet("Vaibhav")` creates one Function Execution Context.
- Calling `greet("Rahul")` creates another Function Execution Context.

Each Function Execution Context has its own:

- Parameters
- Local variables
- Scope information
- `this` binding

Once the function finishes executing, its Execution Context is destroyed.

### 📊 Visual Diagram

```text
                JavaScript Program
                       │
                       ▼
      +-------------------------------+
      | Global Execution Context      |
      +-------------------------------+
                     │
         greet("Vaibhav")
                     │
                     ▼
      +-------------------------------+
      | Function Execution Context    |
      +-------------------------------+
                     │
              Function Returns
                     │
                     ▼
      Function Execution Context Removed
                     │
                     ▼
      Global Execution Context Continues
```

### 🌍 Real-World Example

Imagine you're working in an office.

The **head office** represents the **Global Execution Context**. It contains company-wide information such as policies, employee records, and departments.

Whenever a meeting is scheduled, a **meeting room** is prepared specifically for that meeting. It contains only the information needed for that discussion.

After the meeting ends, the room is cleaned and becomes available for future meetings.

Similarly:

- The **Global Execution Context** exists for the entire program.
- Every function call creates its own **Function Execution Context**.
- Once the function finishes, its Execution Context is removed.

### 🎤 Interview Answer

An **Execution Context** is the environment in which JavaScript executes code. It contains everything required during execution, including variables, functions, scope information, and the `this` binding. JavaScript creates one **Global Execution Context** when the program starts and creates a new **Function Execution Context** every time a function is called. The Global Execution Context manages global code, while each Function Execution Context manages the execution of a specific function. Together, they allow the JavaScript engine to execute code in an organized and predictable manner.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- When is an Execution Context created?
- What are the two phases of an Execution Context?
- What happens during the Memory Creation Phase?
- What information is stored inside an Execution Context?
- How does the Call Stack manage multiple Execution Contexts?
- Why does every function call create a new Execution Context?

---

## 2. When is an Execution Context created, and what are its two phases?

### 📖 Overview

An **Execution Context** is **not created while the code is executing**. Instead, JavaScript creates it **before execution begins**.

Every Execution Context goes through **two phases**:

1. **Memory Creation Phase** (also called the Creation Phase)
2. **Execution Phase**

These two phases ensure that JavaScript knows where variables and functions are stored before it starts executing any code.

> 💡 **Note**
>
> Every Execution Context—whether it's the **Global Execution Context (GEC)** or a **Function Execution Context (FEC)**—goes through these same two phases.

### ⏰ When is an Execution Context Created?

JavaScript creates an Execution Context in two situations:

| Execution Context | Created When |
|-------------------|--------------|
| **Global Execution Context (GEC)** | When the JavaScript program starts. |
| **Function Execution Context (FEC)** | Every time a function is invoked. |

For example:

```js
const company = "Vaibhav Docs";

function greet(name) {
  console.log(`Hello ${name}`);
}

greet("Vaibhav");
```

Here's what happens:

1. JavaScript starts the program.
2. The **Global Execution Context** is created.
3. The Global Execution Context completes its two phases.
4. JavaScript starts executing global code.
5. When `greet("Vaibhav")` is called, JavaScript creates a new **Function Execution Context**.
6. The Function Execution Context also completes its two phases before executing the function body.

Notice that **every function call creates a brand-new Function Execution Context**.

### ⚙️ Phase 1: Memory Creation Phase

The **Memory Creation Phase** is the preparation stage.

During this phase, JavaScript scans the entire code and allocates memory for variables and functions before executing any line of code.

At this point:

- Variables are prepared.
- Function declarations are stored.
- The `this` binding is initialized.
- Scope information is established.

However,

> **No JavaScript statements are actually executed during this phase.**

JavaScript is simply preparing the environment for execution.

We'll explore exactly what happens to `var`, `let`, `const`, function declarations, and function expressions in the next topic.

### ▶️ Phase 2: Execution Phase

Once the Memory Creation Phase is complete, JavaScript enters the **Execution Phase**.

During this phase:

- Code executes line by line.
- Variables receive their actual values.
- Functions are called.
- Expressions are evaluated.
- New Function Execution Contexts are created whenever a function is invoked.

This is the phase where your JavaScript program actually runs.

### 📊 Visual Timeline

```text
                JavaScript Starts
                       │
                       ▼
        Global Execution Context Created
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
 Memory Creation Phase         Execution Phase
        │                             │
        ▼                             ▼
Prepare Variables            Execute Code
Prepare Functions            Call Functions
Initialize this              Evaluate Expressions
```

Whenever a function is called, the exact same process repeats.

```text
Function Called
       │
       ▼
Function Execution Context Created
       │
 ┌─────┴─────┐
 ▼           ▼
Memory     Execution
Phase       Phase
```

### 🌍 Real-World Example

Imagine you're organizing a classroom exam.

Before students start writing, the teacher first:

- Arranges the desks.
- Places answer sheets.
- Distributes question papers.
- Writes instructions on the board.

Only after everything is ready does the teacher say:

> **"You may begin."**

Similarly, JavaScript first completes the **Memory Creation Phase**, preparing everything required for execution.

Only then does it enter the **Execution Phase**, where the actual code starts running.

### 🎤 Interview Answer

Every Execution Context is created **before** JavaScript starts executing code. Both the Global Execution Context and every Function Execution Context go through two phases: the **Memory Creation Phase** and the **Execution Phase**. During the Memory Creation Phase, JavaScript prepares variables, functions, scope information, and the `this` binding. During the Execution Phase, the code is executed line by line, variables receive their actual values, expressions are evaluated, and new Function Execution Contexts are created whenever functions are called.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What exactly happens during the Memory Creation Phase?
- How are `var`, `let`, and `const` initialized?
- Why are function declarations available before they appear in the code?
- What happens to function expressions during the Memory Creation Phase?
- Why are there two separate phases instead of one?
- Does every Function Execution Context also go through these two phases?

---

## 3. What happens during the Memory Creation Phase, and how are variables and functions initialized?

### 📖 Overview

The **Memory Creation Phase** is the first phase of every Execution Context.

Before JavaScript executes a single line of code, it scans the entire code and prepares memory for variables and functions.

During this phase, JavaScript **does not execute your code**. Instead, it allocates memory and initializes variables and functions according to their type.

This preparation is the reason why concepts like **Hoisting** exist.

### ⚙️ How the Memory Creation Phase Works

Consider the following code:

```js
var company = "Vaibhav Docs";

let year = 2026;

const version = "1.0";

function greet() {
  console.log("Hello");
}

const print = function () {
  console.log("Print");
};
```

Before JavaScript starts executing the first line, it scans the entire code and prepares memory.

Different declarations are initialized differently.

### 📊 How JavaScript Initializes Variables and Functions

| Declaration | Memory Creation Phase | Execution Phase |
|-------------|-----------------------|-----------------|
| `var` | Memory allocated and initialized with `undefined` | Assigned its actual value |
| `let` | Memory allocated but remains uninitialized (TDZ) | Assigned its actual value |
| `const` | Memory allocated but remains uninitialized (TDZ) | Must be initialized immediately |
| Function Declaration | Entire function stored in memory | Ready to invoke immediately |
| Function Expression | Behaves like the variable used to store it | Function assigned when execution reaches that line |

This difference explains why different declarations behave differently before initialization.

### 💻 Memory Snapshot

After the Memory Creation Phase, JavaScript's memory roughly looks like this:

```text
Global Execution Context

company  → undefined

year     → <uninitialized>

version  → <uninitialized>

greet    → function greet() { ... }

print    → undefined
```

Notice that:

- `company` already exists with the value `undefined`.
- `year` and `version` exist but are **not initialized**.
- `greet()` already contains the complete function.
- `print` behaves like a `const` variable, so only the variable exists—not the function itself.

### ▶️ What Happens During the Execution Phase?

Now JavaScript starts executing code line by line.

```js
var company = "Vaibhav Docs";
```

Memory changes from:

```text
company → undefined
```

to

```text
company → "Vaibhav Docs"
```

Next,

```js
let year = 2026;
```

changes

```text
year → <uninitialized>
```

to

```text
year → 2026
```

Similarly,

```js
const version = "1.0";
```

changes

```text
version → "1.0"
```

When JavaScript reaches

```js
const print = function () { ... };
```

the function expression is finally assigned to the `print` variable.

### ⚖️ Function Declaration vs Function Expression

Consider the following code:

```js
greet();

print();

function greet() {
  console.log("Hello");
}

const print = function () {
  console.log("Print");
};
```

**Result:**

```text
Hello

ReferenceError
```

Why?

During the Memory Creation Phase:

```text
greet  → Complete Function

print  → <uninitialized>
```

Since `greet()` already contains the complete function, JavaScript can invoke it immediately.

However, `print` is just a variable declaration at that point. The function is assigned later during the Execution Phase.

This is why function declarations can be called before they appear in the code, while function expressions cannot.

> 💡 **Note**
>
> Function expressions assigned to `var` are initialized with `undefined` during the Memory Creation Phase. Function expressions assigned to `let` or `const` remain uninitialized until execution reaches their declaration.

### 🌍 Real-World Example

Imagine a new office is opening.

Before employees start working:

- Every employee gets a desk.
- Departments are assigned.
- Meeting rooms are reserved.
- Resources are prepared.

However, nobody starts working yet.

Only after everything is prepared do employees begin their actual work.

Similarly, during the **Memory Creation Phase**, JavaScript prepares variables and functions.

During the **Execution Phase**, those variables receive their actual values and the code starts executing.

### 🎤 Interview Answer

During the Memory Creation Phase, JavaScript scans the entire code and allocates memory for variables and functions before executing any statements. Variables declared with `var` are initialized with `undefined`, while `let` and `const` are allocated memory but remain uninitialized until execution reaches their declaration. Function declarations are stored completely in memory, making them callable before their declaration, whereas function expressions behave according to the variable used to store them. Once the Memory Creation Phase is complete, JavaScript enters the Execution Phase, where variables receive their actual values and code executes line by line.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is Hoisting in JavaScript?
- What is the Temporal Dead Zone (TDZ)?
- Why is `var` initialized with `undefined`?
- Why are function declarations hoisted but function expressions are not?
- What happens if a function expression is declared using `var`?
- Why must `const` be initialized during declaration?


---

## 4. What information is stored inside an Execution Context?

### 📖 Overview

An **Execution Context** is more than just a place where JavaScript executes code.

It is an internal data structure that stores everything the JavaScript engine needs while executing a particular piece of code.

Whenever JavaScript creates an Execution Context, it stores important information such as:

- Variables
- Functions
- Scope information
- The `this` binding

This information allows JavaScript to execute code correctly and efficiently.

### 🧩 Components of an Execution Context

Every Execution Context mainly consists of the following components:

| Component | Purpose |
|-----------|---------|
| **Variable Environment** | Stores variables and function declarations. |
| **Lexical Environment** | Stores scope information and the reference to the outer scope. |
| **`this` Binding** | Stores the value of the `this` keyword for the current execution. |

Together, these components form the Execution Context.

### 📦 Variable Environment

The **Variable Environment** stores all variables and function declarations created within the current Execution Context.

For example:

```js
const company = "Vaibhav Docs";

function greet(name) {
  const message = `Hello ${name}`;

  console.log(message);
}
```

Inside the **Global Execution Context**, the Variable Environment contains:

```text
company → "Vaibhav Docs"

greet → function greet() { ... }
```

When `greet()` is called, JavaScript creates a new Function Execution Context.

Its Variable Environment contains:

```text
name → "Vaibhav"

message → "Hello Vaibhav"
```

Each Execution Context maintains its **own separate Variable Environment**.

### 🌐 Lexical Environment

The **Lexical Environment** stores information about the current scope and remembers where the current Execution Context was created.

This allows JavaScript to search for variables outside the current function whenever they aren't found locally.

For example:

```js
const company = "Vaibhav Docs";

function greet() {
  console.log(company);
}

greet();
```

Although `company` doesn't exist inside `greet()`, JavaScript can still access it because the Function Execution Context remembers its outer scope.

> 💡 **Note**
>
> We'll explore the **Lexical Environment** and **Scope Chain** in detail later in the chapter.

### 🎯 `this` Binding

Every Execution Context also stores the value of the **`this` keyword**.

The value of `this` depends on **how a function is called**, not where it is defined.

Examples:

```js
console.log(this);
```

In a browser's global scope:

```text
Window
```

Inside an object method:

```js
const user = {
  name: "Vaibhav",

  greet() {
    console.log(this.name);
  }
};

user.greet();
```

Here, `this` refers to the `user` object.

> 💡 **Note**
>
> The `this` keyword is a large topic on its own and will be covered in a dedicated chapter.

### 📊 Internal View of an Execution Context

A simplified representation of an Execution Context looks like this:

```text
Execution Context
│
├── Variable Environment
│     ├── Variables
│     └── Functions
│
├── Lexical Environment
│     └── Reference to Outer Scope
│
└── this Binding
      └── Current value of this
```

Every time a function is called, JavaScript creates a new structure like this.

### 🌍 Real-World Example

Imagine an employee joins a meeting.

To participate effectively, they need:

- 📄 Meeting documents.
- 👥 Information about their department.
- 👤 Their identity and role.

Similarly, an Execution Context stores:

- Variables and functions (**Meeting documents**).
- Scope information (**Department hierarchy**).
- The current `this` value (**Identity**).

Without this information, JavaScript wouldn't know how to execute the current code.

### 🎤 Interview Answer

Every Execution Context stores the information required to execute JavaScript code. Its main components are the **Variable Environment**, which stores variables and function declarations, the **Lexical Environment**, which stores scope information and references to outer scopes, and the **`this` binding**, which stores the value of the `this` keyword for the current execution. Together, these components allow JavaScript to manage variables, resolve scope, and execute code correctly.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is the difference between the Variable Environment and the Lexical Environment?
- How does JavaScript resolve variables using the Scope Chain?
- How is the value of `this` determined?
- Why does every function have its own Execution Context?
- Can two Execution Contexts share the same Variable Environment?
- What is the difference between Global and Function Execution Contexts?


---

## 5. What is the Call Stack, and how does it manage Execution Contexts?

### 📖 Overview

The **Call Stack** is a data structure used by the JavaScript engine to manage **Execution Contexts**.

Whenever JavaScript starts executing code, the **Global Execution Context** is pushed onto the Call Stack.

Whenever a function is called, JavaScript creates a new **Function Execution Context** and pushes it onto the top of the stack.

When the function finishes executing, its Execution Context is removed (popped) from the Call Stack.

This process ensures that JavaScript always knows **which function should execute next**.

### 📦 Why is it Called a "Stack"?

The Call Stack follows the **Last In, First Out (LIFO)** principle.

This means:

- The most recently added Execution Context executes first.
- The oldest Execution Context executes last.

Think of a stack of books.

If you place books one on top of another:

```text
Book C
Book B
Book A
```

You must remove **Book C** before removing **Book B**.

The Call Stack works exactly the same way.

### ⚙️ How the Call Stack Works

Consider the following example:

```js
function print(text) {
  console.log(text);
}

function greet(name) {
  print(`Hello ${name}`);
}

greet("Vaibhav");
```

Initially, only the **Global Execution Context** exists.

```text
Call Stack

┌──────────────────────────┐
│ Global Execution Context │
└──────────────────────────┘
```

---

When JavaScript executes:

```js
greet("Vaibhav");
```

a new Function Execution Context is created.

```text
Call Stack

┌──────────────────────────┐
│ Function EC (greet)      │
├──────────────────────────┤
│ Global Execution Context │
└──────────────────────────┘
```

---

Inside `greet()`, another function is called:

```js
print(`Hello ${name}`);
```

JavaScript creates another Function Execution Context.

```text
Call Stack

┌──────────────────────────┐
│ Function EC (print)      │
├──────────────────────────┤
│ Function EC (greet)      │
├──────────────────────────┤
│ Global Execution Context │
└──────────────────────────┘
```

---

After `print()` finishes, its Execution Context is removed.

```text
Call Stack

┌──────────────────────────┐
│ Function EC (greet)      │
├──────────────────────────┤
│ Global Execution Context │
└──────────────────────────┘
```

---

Finally, after `greet()` returns, its Execution Context is also removed.

```text
Call Stack

┌──────────────────────────┐
│ Global Execution Context │
└──────────────────────────┘
```

The Global Execution Context remains until the entire JavaScript program finishes.

### 📊 Complete Execution Flow

```text
Program Starts
        │
        ▼
Push Global Execution Context
        │
        ▼
Call greet()
        │
        ▼
Push Function EC (greet)
        │
        ▼
Call print()
        │
        ▼
Push Function EC (print)
        │
        ▼
print() Finishes
        │
        ▼
Pop Function EC (print)
        │
        ▼
greet() Finishes
        │
        ▼
Pop Function EC (greet)
        │
        ▼
Program Ends
        │
        ▼
Pop Global Execution Context
```

### 💡 Why is the Call Stack Important?

The Call Stack helps JavaScript:

- Keep track of which function is currently executing.
- Manage nested function calls.
- Return control to the correct function after execution.
- Maintain the correct execution order.
- Automatically remove finished Execution Contexts from memory.

Without the Call Stack, JavaScript wouldn't know:

- Which function should execute next.
- Where to return after a function completes.
- Which Execution Context is currently active.

### 🌍 Real-World Example

Imagine calling customer support.

The first representative answers your call.

If they need help, they transfer you to a specialist.

The specialist may then transfer you to another expert.

Once the final expert resolves the issue:

- You return to the previous specialist.
- Then back to the first representative.
- Finally, the call ends.

The conversation always returns in the **reverse order** of the transfers.

Similarly, the Call Stack always returns to the previous Execution Context after the current one finishes.

### 🎤 Interview Answer

The **Call Stack** is a **Last In, First Out (LIFO)** data structure used by the JavaScript engine to manage Execution Contexts. When a program starts, the Global Execution Context is pushed onto the stack. Every function call creates a new Function Execution Context, which is pushed onto the top of the stack. Once the function finishes executing, its Execution Context is popped from the stack, and execution resumes in the previous context. This mechanism allows JavaScript to execute functions in the correct order and efficiently manage nested function calls.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What happens when one function calls another function?
- Why does JavaScript remove Function Execution Contexts from the Call Stack?
- What happens if recursive function calls never stop?
- What is a Stack Overflow error?
- Can multiple Execution Contexts exist on the Call Stack at the same time?
- Why does the Call Stack follow the LIFO principle?

---

## 6. What happens when one function calls another function?

### 📖 Overview

When a function calls another function, JavaScript **does not pause or replace** the current Execution Context.

Instead, it:

1. Creates a **new Function Execution Context** for the called function.
2. Pushes it onto the **Call Stack**.
3. Executes the called function.
4. Removes its Execution Context after it finishes.
5. Returns control to the previous Execution Context.

This process allows JavaScript to execute nested function calls in the correct order.

### ⚙️ Step-by-Step Execution

Consider the following example:

```js
function print(text) {
  console.log(text);
}

function greet(name) {
  const message = `Hello ${name}`;

  print(message);

  console.log("Greeting Completed");
}

greet("Vaibhav");

console.log("Program Finished");
```

Let's see what happens internally.

### 📊 Step 1: Global Execution Context

When the program starts, JavaScript creates the **Global Execution Context**.

The Call Stack looks like this:

```text
Call Stack

┌──────────────────────────┐
│ Global Execution Context │
└──────────────────────────┘
```

JavaScript starts executing global code.

---

### 📊 Step 2: `greet()` is Called

When JavaScript reaches:

```js
greet("Vaibhav");
```

it creates a new **Function Execution Context** for `greet()`.

```text
Call Stack

┌──────────────────────────┐
│ Function EC (greet)      │
├──────────────────────────┤
│ Global Execution Context │
└──────────────────────────┘
```

Execution now moves inside the `greet()` function.

---

### 📊 Step 3: `print()` is Called

Inside `greet()`:

```js
print(message);
```

JavaScript creates another Function Execution Context.

```text
Call Stack

┌──────────────────────────┐
│ Function EC (print)      │
├──────────────────────────┤
│ Function EC (greet)      │
├──────────────────────────┤
│ Global Execution Context │
└──────────────────────────┘
```

The `print()` function executes first.

---

### 📊 Step 4: `print()` Finishes

After executing:

```js
console.log(text);
```

the `print()` function returns.

Its Execution Context is removed from the Call Stack.

```text
Call Stack

┌──────────────────────────┐
│ Function EC (greet)      │
├──────────────────────────┤
│ Global Execution Context │
└──────────────────────────┘
```

Execution resumes exactly where it stopped inside `greet()`.

The next statement executes:

```js
console.log("Greeting Completed");
```

---

### 📊 Step 5: `greet()` Finishes

Once `greet()` completes, its Execution Context is also removed.

```text
Call Stack

┌──────────────────────────┐
│ Global Execution Context │
└──────────────────────────┘
```

JavaScript returns to the Global Execution Context and continues executing:

```js
console.log("Program Finished");
```

Finally, after the program finishes, the Global Execution Context is also removed.

### 📊 Complete Execution Timeline

```text
Program Starts
        │
        ▼
Global Execution Context Created
        │
        ▼
Call greet()
        │
        ▼
Push Function EC (greet)
        │
        ▼
Call print()
        │
        ▼
Push Function EC (print)
        │
        ▼
Execute print()
        │
        ▼
Pop Function EC (print)
        │
        ▼
Continue greet()
        │
        ▼
Pop Function EC (greet)
        │
        ▼
Continue Global Code
        │
        ▼
Program Ends
```

### 💡 Why Doesn't JavaScript Execute Both Functions Together?

JavaScript uses a **single Call Stack**, so it can execute **only one Execution Context at a time**.

Even though multiple Execution Contexts can exist on the Call Stack, **only the one at the top of the stack is active**.

This is why:

- `greet()` waits while `print()` executes.
- After `print()` finishes, execution returns to `greet()`.
- Only then does JavaScript continue executing the remaining code.

### 🌍 Real-World Example

Imagine a manager working on a task.

While working, the manager asks an employee to complete a subtask.

The manager doesn't continue working on the original task until the employee returns with the result.

Once the employee finishes:

- The manager resumes the original task.
- After completing it, the manager returns to the next assignment.

Similarly, JavaScript temporarily pauses the current function while executing the called function, then resumes execution exactly where it left off.

### 🎤 Interview Answer

When one function calls another, JavaScript creates a new Function Execution Context for the called function and pushes it onto the Call Stack. The called function executes completely before JavaScript returns to the previous function. Once the called function finishes, its Execution Context is removed from the Call Stack, and execution resumes from the point where it was paused. This process allows JavaScript to correctly manage nested function calls while maintaining the proper execution order.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- Can multiple Function Execution Contexts exist at the same time?
- Which Execution Context is active when multiple contexts exist?
- Why does JavaScript use the Last In, First Out (LIFO) principle?
- What happens if a function keeps calling itself?
- What is a Stack Overflow error?
- How does recursion affect the Call Stack?


---

## 7. What happens during recursive function calls, and what is a Stack Overflow error?

### 📖 Overview

**Recursion** is a programming technique where a function calls **itself** either directly or indirectly.

Each recursive function call creates a **new Function Execution Context**, which is pushed onto the **Call Stack**.

If the recursion has a **base condition**, the function eventually stops calling itself, and the Call Stack begins to unwind.

However, if there is **no base condition** (or it is never reached), JavaScript continues creating new Execution Contexts until the Call Stack becomes full.

When this happens, JavaScript throws a **Stack Overflow** error.

### 🔄 What Happens During Recursion?

Consider the following example:

```js
function countdown(n) {
  if (n === 0) {
    console.log("Done!");
    return;
  }

  console.log(n);

  countdown(n - 1);
}

countdown(3);
```

**Output:**

```text
3
2
1
Done!
```

Although the function appears simple, JavaScript creates a **new Function Execution Context** for every recursive call.

### 📊 Call Stack During Recursion

When `countdown(3)` is executed:

```text
Call Stack

┌────────────────────────────┐
│ countdown(3)               │
├────────────────────────────┤
│ Global Execution Context   │
└────────────────────────────┘
```

---

`countdown(3)` calls `countdown(2)`.

```text
Call Stack

┌────────────────────────────┐
│ countdown(2)               │
├────────────────────────────┤
│ countdown(3)               │
├────────────────────────────┤
│ Global Execution Context   │
└────────────────────────────┘
```

---

`countdown(2)` calls `countdown(1)`.

```text
Call Stack

┌────────────────────────────┐
│ countdown(1)               │
├────────────────────────────┤
│ countdown(2)               │
├────────────────────────────┤
│ countdown(3)               │
├────────────────────────────┤
│ Global Execution Context   │
└────────────────────────────┘
```

---

`countdown(1)` calls `countdown(0)`.

```text
Call Stack

┌────────────────────────────┐
│ countdown(0)               │
├────────────────────────────┤
│ countdown(1)               │
├────────────────────────────┤
│ countdown(2)               │
├────────────────────────────┤
│ countdown(3)               │
├────────────────────────────┤
│ Global Execution Context   │
└────────────────────────────┘
```

Now the base condition becomes true:

```js
if (n === 0) return;
```

The recursive calls stop, and JavaScript starts removing Execution Contexts one by one.

### 📊 Call Stack Unwinding

After reaching the base condition:

```text
Pop countdown(0)
        │
        ▼
Pop countdown(1)
        │
        ▼
Pop countdown(2)
        │
        ▼
Pop countdown(3)
        │
        ▼
Back to Global Execution Context
```

This process is called **stack unwinding**.

### ❌ What Happens Without a Base Condition?

Now consider this function:

```js
function greet() {
  greet();
}

greet();
```

There is **no base condition**.

Every function call creates another Function Execution Context.

The Call Stack keeps growing:

```text
Call Stack

┌────────────────────────────┐
│ greet()                    │
├────────────────────────────┤
│ greet()                    │
├────────────────────────────┤
│ greet()                    │
├────────────────────────────┤
│ greet()                    │
├────────────────────────────┤
│ greet()                    │
├────────────────────────────┤
│ ...                        │
└────────────────────────────┘
```

Eventually, the Call Stack reaches its maximum size.

At that point, JavaScript throws:

```text
RangeError: Maximum call stack size exceeded
```

This error is commonly known as a **Stack Overflow**.

### ⚠️ What is a Stack Overflow Error?

A **Stack Overflow** occurs when the Call Stack runs out of space because JavaScript keeps creating new Execution Contexts without removing old ones.

The most common causes are:

- Infinite recursion.
- Missing base condition.
- Accidentally calling the same function repeatedly.

Since the Call Stack has limited memory, it cannot grow indefinitely.

### 🌍 Real-World Example

Imagine a person standing in front of a mirror.

Every reflection creates another reflection.

If this process continued forever, you'd get an infinite chain of reflections.

Similarly, a recursive function without a stopping condition keeps creating new Execution Contexts until the Call Stack can no longer hold them.

The result is a **Stack Overflow**.

### 🎤 Interview Answer

Recursion is a technique where a function calls itself. Every recursive call creates a new Function Execution Context and pushes it onto the Call Stack. If the function has a valid base condition, recursion eventually stops, and the Call Stack unwinds as each Execution Context is removed. If there is no base condition, JavaScript continues creating new Execution Contexts until the Call Stack reaches its maximum size, resulting in a **Stack Overflow** error, typically shown as **"RangeError: Maximum call stack size exceeded."**

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- Why does every recursive call create a new Execution Context?
- What is stack unwinding?
- How does recursion differ from iteration?
- What is tail recursion?
- Can recursion cause memory issues?
- How can you avoid a Stack Overflow error?


--- 

## 8. How is Execution Context related to Hoisting and Scope?

### 📖 Overview

Two of the most fundamental JavaScript concepts are **Hoisting** and **Scope**.

Although they are often taught as separate topics, both are direct consequences of how the **Execution Context** works.

- **Hoisting** happens because of the **Memory Creation Phase**.
- **Scope** exists because every Execution Context maintains its own variables and remembers its surrounding environment.

In other words:

> **Without the Execution Context, there would be no Hoisting or Scope.**

### 🚀 How is Hoisting Related to the Execution Context?

As we learned earlier, every Execution Context goes through two phases:

1. Memory Creation Phase
2. Execution Phase

During the **Memory Creation Phase**, JavaScript scans the entire code and prepares memory for variables and functions **before executing any line of code**.

Consider the following example:

```js
console.log(company);

var company = "Vaibhav Docs";
```

During the Memory Creation Phase:

```text
Global Execution Context

company → undefined
```

During the Execution Phase:

```js
console.log(company);
```

prints:

```text
undefined
```

Then,

```js
company = "Vaibhav Docs";
```

updates memory to:

```text
company → "Vaibhav Docs"
```

This behavior is known as **Hoisting**.

The variable wasn't moved to the top of the file.

Instead,

> **Memory for the variable was created before code execution began.**

### 💻 Function Declaration Example

Function declarations are also prepared during the Memory Creation Phase.

```js
greet();

function greet() {
  console.log("Hello");
}
```

Output:

```text
Hello
```

This works because the entire function is already stored inside the Execution Context before the Execution Phase begins.

### 🌐 How is Scope Related to the Execution Context?

Every Execution Context has its **own local memory**.

Consider the following example:

```js
const company = "Vaibhav Docs";

function greet() {
  const message = "Welcome";

  console.log(company);
  console.log(message);
}

greet();
```

When `greet()` executes:

The **Function Execution Context** contains:

```text
message → "Welcome"
```

The **Global Execution Context** contains:

```text
company → "Vaibhav Docs"
```

When JavaScript looks for `company`, it follows this process:

```text
Function Execution Context
        │
        ▼
Is company available here?

        No
        │
        ▼
Global Execution Context
        │
        ▼
Found company
```

This variable lookup process is possible because the Function Execution Context remembers its surrounding scope.

This behavior forms the basis of **Scope** and the **Scope Chain**.

> 💡 **Note**
>
> We'll study the **Scope Chain** in detail in the next topic.

### 📊 Execution Context, Hoisting, and Scope

```text
             Execution Context
                    │
      ┌─────────────┴─────────────┐
      ▼                           ▼
Memory Creation Phase      Lexical Environment
      │                           │
      ▼                           ▼
   Hoisting                    Scope
```

This diagram shows that:

- **Hoisting** originates from the Memory Creation Phase.
- **Scope** originates from the Lexical Environment stored inside the Execution Context.

### 🌍 Real-World Example

Imagine you're attending a meeting.

Before the meeting starts:

- Everyone receives an ID card.
- Seats are assigned.
- Documents are prepared.

This is similar to the **Memory Creation Phase**.

During the meeting:

- Everyone can access documents available in their own department.
- If something isn't available locally, they request it from the head office.

This is similar to **Scope** and how JavaScript searches for variables through surrounding Execution Contexts.

### 🎤 Interview Answer

Hoisting and Scope are both consequences of the Execution Context. During the **Memory Creation Phase**, JavaScript allocates memory for variables and functions before executing any code, which results in Hoisting. Every Execution Context also stores scope information through its Lexical Environment, allowing JavaScript to resolve variables by searching the current scope first and then moving outward if necessary. In simple terms, Hoisting comes from the Memory Creation Phase, while Scope comes from the Lexical Environment of the Execution Context.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is the Scope Chain?
- What is the Lexical Environment?
- Why are `let` and `const` hoisted but inaccessible before initialization?
- Why are function declarations hoisted but function expressions are not?
- How does JavaScript resolve variables across nested functions?
- How do Closures use the Lexical Environment?

---

## 9. How does JavaScript resolve variables across different Execution Contexts?

### 📖 Overview

Every Execution Context has its **own local variables**.

When JavaScript executes code, it first searches for variables in the **current Execution Context**.

If the variable isn't found, JavaScript doesn't immediately throw an error.

Instead, it continues searching in the **outer (parent) Execution Context**.

This process continues until:

- The variable is found, or
- JavaScript reaches the Global Execution Context.

This variable lookup mechanism is called the **Scope Chain**.

### 🌐 Variable Lookup Process

Consider the following example:

```js
const company = "Vaibhav Docs";

function greet() {
  const message = "Welcome";

  print();
}

function print() {
  console.log(company);
}

greet();
```

When `print()` executes, JavaScript creates a new **Function Execution Context**.

Its local memory contains:

```text
print()

(No local variables)
```

Now JavaScript tries to execute:

```js
console.log(company);
```

The lookup process begins.

### 📊 Step 1: Search in the Current Execution Context

```text
Function Execution Context (print)

company ?

❌ Not Found
```

Since `company` doesn't exist locally, JavaScript continues searching.

### 📊 Step 2: Search in the Outer Execution Context

The `print()` function was created in the **Global Scope**, so JavaScript moves to the **Global Execution Context**.

```text
Global Execution Context

company → "Vaibhav Docs"
```

The variable is found.

Therefore,

```js
console.log(company);
```

prints:

```text
Vaibhav Docs
```

### 📊 Variable Lookup Flow

```text
print()

Search company
      │
      ▼
Current Execution Context

Not Found
      │
      ▼
Outer Execution Context

Found
      │
      ▼
Use the Value
```

This search process happens automatically whenever JavaScript cannot find a variable in the current Execution Context.

### ❌ Can One Function Access Another Function's Local Variables?

No.

Each Function Execution Context has **its own local memory**.

Consider the following example:

```js
function first() {
  const language = "JavaScript";
}

function second() {
  console.log(language);
}

first();
second();
```

Output:

```text
ReferenceError: language is not defined
```

Why?

When `second()` executes, JavaScript searches for `language`.

```text
second()

language ?

❌ Not Found
```

JavaScript then moves to the outer scope.

```text
Global Execution Context

language ?

❌ Not Found
```

The variable still doesn't exist.

Notice that JavaScript **never searches inside the Execution Context of `first()`**.

That's because `first()` is **not the outer lexical scope** of `second()`.

Its Execution Context existed only while `first()` was executing and was removed after the function returned.

### ⚙️ Why Doesn't JavaScript Search Every Execution Context?

Imagine if JavaScript searched every Function Execution Context in memory.

For example:

```text
first()

second()

calculate()

login()

fetchUsers()

...
```

Every variable lookup would become extremely slow.

Instead, JavaScript follows a simple rule:

> **Only search the current scope and its lexical parent scopes.**

This makes variable resolution predictable and efficient.

### 📊 Scope Chain

A Scope Chain can be visualized like this:

```text
Current Execution Context
            │
            ▼
Outer Execution Context
            │
            ▼
Global Execution Context
            │
            ▼
Variable Found
```

If JavaScript reaches the Global Execution Context and still cannot find the variable, it throws:

```text
ReferenceError
```

### 🌍 Real-World Example

Imagine you're looking for an important document in an office.

First, you check:

- Your own desk.

If it's not there:

- You ask your department.

If it's still not found:

- You ask the head office.

If nobody has it, you're told:

> "The document doesn't exist."

Similarly, JavaScript searches:

1. Current Execution Context.
2. Outer Execution Context.
3. Global Execution Context.

If the variable isn't found anywhere, JavaScript throws a **ReferenceError**.

### 🎤 Interview Answer

Every Execution Context has its own local variables. When JavaScript encounters a variable, it first searches the current Execution Context. If the variable isn't found, JavaScript follows the **Scope Chain** by searching the outer lexical scopes until it reaches the Global Execution Context. If the variable still isn't found, JavaScript throws a **ReferenceError**. One Function Execution Context cannot directly access another function's local variables because each Execution Context maintains its own local memory and JavaScript only searches through the lexical parent scopes.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is the Scope Chain?
- What is Lexical Scope?
- What is the Lexical Environment?
- How do Closures preserve access to outer variables?
- Why does JavaScript throw a `ReferenceError`?
- How does variable shadowing affect the Scope Chain?

---

## 10. Explain the complete lifecycle of an Execution Context.

### 📖 Overview

Every **Execution Context** has a lifecycle.

It is **created**, **prepared**, **executed**, and finally **destroyed**.

This lifecycle repeats for **every function call** in JavaScript.

Understanding this lifecycle helps explain many JavaScript concepts, including:

- Hoisting
- Memory Allocation
- Function Calls
- Call Stack
- Scope
- Garbage Collection

In simple terms:

> **Every Execution Context goes through four stages: Create → Prepare → Execute → Destroy.**

### 💻 Example

We'll use the following program to understand the complete lifecycle.

```js
const company = "Vaibhav Docs";

function greet(name) {
  const message = `Hello ${name}`;

  print(message);
}

function print(text) {
  console.log(text);
}

greet("Vaibhav");
```

Let's follow what happens internally.

### 🏗️ Stage 1: Create the Global Execution Context

As soon as the JavaScript program starts, the engine creates the **Global Execution Context (GEC)**.

At this moment, the Call Stack looks like this:

```text
Call Stack

┌──────────────────────────┐
│ Global Execution Context │
└──────────────────────────┘
```

No code has executed yet.

JavaScript has only created the Global Execution Context.

### 🚀 Stage 2: Memory Creation Phase

Next, JavaScript prepares memory for all global declarations.

```text
Global Execution Context

company → undefined

greet → function greet(){...}

print → function print(){...}
```

At this stage:

- Memory is allocated.
- Function declarations are stored.
- Variables are initialized according to their declaration type.
- No statements have executed yet.

### ▶️ Stage 3: Execution Phase

Now JavaScript begins executing the program line by line.

First,

```js
const company = "Vaibhav Docs";
```

updates memory:

```text
company → "Vaibhav Docs"
```

Next,

JavaScript reaches:

```js
greet("Vaibhav");
```

A new Function Execution Context must now be created.

### ⚡ Stage 4: Create the Function Execution Context

JavaScript creates a new Execution Context for `greet()`.

Before executing the function body, it also completes its own Memory Creation Phase.

```text
greet()

name → "Vaibhav"

message → <uninitialized>
```

The Call Stack becomes:

```text
Call Stack

┌──────────────────────────┐
│ Function EC (greet)      │
├──────────────────────────┤
│ Global Execution Context │
└──────────────────────────┘
```

### ▶️ Stage 5: Execute the Function

Now JavaScript executes the function body.

```js
const message = `Hello ${name}`;
```

Memory updates to:

```text
message → "Hello Vaibhav"
```

Next,

```js
print(message);
```

creates another Function Execution Context.

### ⚡ Stage 6: Create Another Function Execution Context

The Call Stack now becomes:

```text
Call Stack

┌──────────────────────────┐
│ Function EC (print)      │
├──────────────────────────┤
│ Function EC (greet)      │
├──────────────────────────┤
│ Global Execution Context │
└──────────────────────────┘
```

The `print()` function executes:

```js
console.log(text);
```

After execution completes, JavaScript removes the `print()` Execution Context.

```text
Call Stack

┌──────────────────────────┐
│ Function EC (greet)      │
├──────────────────────────┤
│ Global Execution Context │
└──────────────────────────┘
```

Execution returns to `greet()`.

### 🗑️ Stage 7: Destroy the Function Execution Context

After `greet()` finishes executing, JavaScript removes its Execution Context.

```text
Call Stack

┌──────────────────────────┐
│ Global Execution Context │
└──────────────────────────┘
```

Only the Global Execution Context remains.

### 🏁 Stage 8: Program Ends

Once all global code has finished executing, the JavaScript program ends.

The Global Execution Context is removed from the Call Stack.

```text
Call Stack

Empty
```

The lifecycle is now complete.

### 📊 Complete Lifecycle

```text
Program Starts
        │
        ▼
Create Global Execution Context
        │
        ▼
Memory Creation Phase
        │
        ▼
Execution Phase
        │
        ▼
Function Call
        │
        ▼
Create Function Execution Context
        │
        ▼
Memory Creation Phase
        │
        ▼
Execution Phase
        │
        ▼
Function Returns
        │
        ▼
Destroy Function Execution Context
        │
        ▼
Continue Previous Execution Context
        │
        ▼
Program Ends
        │
        ▼
Destroy Global Execution Context
```

### 🌍 Real-World Example

Imagine a company hiring an employee for a project.

The process looks like this:

1. Create an employee profile.
2. Provide the required resources.
3. Assign work.
4. Complete the work.
5. Close the project.
6. Archive the employee's temporary project data.

Similarly, every Function Execution Context is:

- Created.
- Prepared.
- Executed.
- Destroyed.

Only the Global Execution Context lives for the entire duration of the program.

### 🎤 Interview Answer

Every Execution Context follows a lifecycle consisting of four stages: **Creation**, **Memory Creation**, **Execution**, and **Destruction**. When a JavaScript program starts, the Global Execution Context is created and prepared before executing global code. Every function call creates a new Function Execution Context, which also goes through the same lifecycle. After the function finishes, its Execution Context is removed from the Call Stack, and execution resumes in the previous context. This process continues until the entire program finishes, after which the Global Execution Context is also destroyed.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is the relationship between the Execution Context and the Call Stack?
- Why does every function call create a new Execution Context?
- Why is the Memory Creation Phase separated from the Execution Phase?
- What happens to local variables after a function returns?
- How does Garbage Collection reclaim memory after an Execution Context is destroyed?


---

