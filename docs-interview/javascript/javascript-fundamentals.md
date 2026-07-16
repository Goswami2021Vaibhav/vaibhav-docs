---
title: JavaScript Fundamentals
description: Engines, runtimes, the event loop, JIT compilation, and the core execution model — the 15 fundamentals questions that come up most.
sidebar_position: 1
---

# JavaScript Fundamentals

---
## 1. What is JavaScript, why was it created, and what type of language is it?

### 📖 Overview

**JavaScript** is a **high-level, dynamically typed, prototype-based, multi-paradigm programming language** primarily used to add **logic**, **behavior**, and **interactivity** to web applications.

Along with **HTML** (structure) and **CSS** (styling), JavaScript is one of the **three core technologies of the Web**.

Initially, JavaScript was created to make web pages interactive inside browsers. Today, it has evolved into a **general-purpose programming language** that powers frontend applications, backend servers, mobile apps, desktop applications, and much more.

Some common use cases of JavaScript include:

- Form validation
- Interactive user interfaces
- API communication
- Real-time applications
- Backend development
- Mobile and desktop applications

 
### 🕰️ Why Was JavaScript Created?

In the early days of the web, websites were **completely static**. Every user interaction required sending a request to the server, which then returned a new HTML page.

For example, if a user submitted a registration form with missing information, the browser had to send the request to the server, wait for validation, and reload the entire page with an error message.

This process was slow and resulted in a poor user experience.

To solve this problem, **Brendan Eich** created JavaScript in **1995** at **Netscape**. Remarkably, the first version was developed in just **10 days**.

The primary goal was simple:

> Allow browsers to execute code locally so web pages could respond instantly to user interactions without communicating with the server for every action.

This transformed websites from **static documents** into **interactive web applications**.

 
### 🏗️ Language Characteristics

JavaScript is commonly described using the following characteristics:

| Characteristic | Meaning |
|---------------|---------|
| **High-level** | Developers don't need to manage memory manually. |
| **Dynamically Typed** | Variable types are determined at runtime rather than being declared explicitly. |
| **Prototype-based** | Objects inherit properties and methods through prototypes instead of classical inheritance. |
| **Multi-paradigm** | Supports procedural, object-oriented, and functional programming. |
| **Single-threaded** | Executes one task at a time using a single Call Stack. |
| **Just-In-Time (JIT) Compiled** | Modern JavaScript engines compile code during execution to improve performance. |

> 💡 **Note**
>
> Don't worry if terms like **prototype-based**, **single-threaded**, or **JIT compilation** seem unfamiliar. Each of these concepts is covered in detail later in this documentation.

 
### ⚖️ Programming Language vs Scripting Language

A very common interview question is:

> **Is JavaScript a programming language or a scripting language?**

The answer is:

> **JavaScript is both.**

Originally, JavaScript was designed as a **scripting language** because it executed small scripts inside web browsers to add interactivity to web pages.

Over time, JavaScript evolved into a **general-purpose programming language** capable of building complete applications.

Today, JavaScript can be used for:

| Platform | Popular Technologies |
|----------|----------------------|
| 🌐 Frontend | React, Angular, Vue |
| ⚙️ Backend | Node.js |
| 📱 Mobile Apps | React Native |
| 🖥️ Desktop Apps | Electron |
| ☁️ Serverless Functions | AWS Lambda, Vercel Functions, Netlify Functions |

Because of its broad capabilities, referring to JavaScript as **only a scripting language** is no longer accurate.

 
### 🌍 Real-World Example

Consider an **e-commerce application**.

JavaScript can be used to:

- Validate the checkout form before submission.
- Update the shopping cart without reloading the page.
- Fetch products from a backend API.
- Display real-time notifications.
- Build the backend using **Node.js**.
- Build a mobile shopping app using **React Native**.
- Build a desktop admin panel using **Electron**.

In modern development, it's possible to build an entire application ecosystem using JavaScript.
 
### 🎤 Interview Answer

JavaScript is a high-level, dynamically typed, prototype-based, multi-paradigm programming language used to add logic and interactivity to web applications. It was created by **Brendan Eich** in **1995** at **Netscape** to make static web pages interactive by allowing browsers to execute code locally. Although it started as a browser scripting language, JavaScript has evolved into a general-purpose programming language that can be used for frontend development, backend development with **Node.js**, mobile applications with **React Native**, and desktop applications with **Electron**.

 
### ❓ Follow-up Questions

An interviewer may continue with questions like:

- Can JavaScript run outside the browser? If yes, how?
- What is ECMAScript, and how is it different from JavaScript?
- What is a JavaScript Engine?
- What is the difference between a JavaScript Engine and a Runtime Environment?
- Why is JavaScript called a dynamically typed language?
- What does it mean that JavaScript is single-threaded?
- Is JavaScript interpreted or compiled?

---

## 2. Where can JavaScript run, and how does it run outside the browser?

### 📖 Overview

When JavaScript was first introduced in **1995**, it could only run inside web browsers. Its primary purpose was to make web pages interactive by executing code directly in the browser.

Today, JavaScript is no longer limited to browsers. Thanks to **JavaScript Runtime Environments**, it can run on servers, desktop applications, mobile applications, IoT devices, and many other platforms.

In simple terms:

> **JavaScript can run anywhere there is a JavaScript Runtime Environment.**

### 🌐 Running JavaScript in the Browser

Every modern browser includes a **JavaScript Engine** and a **Runtime Environment** that work together to execute JavaScript code.

Some popular browsers and their JavaScript engines are:

| Browser | JavaScript Engine |
|----------|-------------------|
| Google Chrome | V8 |
| Microsoft Edge | V8 |
| Mozilla Firefox | SpiderMonkey |
| Safari | JavaScriptCore |

When you open a website, the browser:

1. Downloads the HTML, CSS, and JavaScript files.
2. Parses the JavaScript code.
3. Executes the code using its JavaScript Engine.
4. Provides browser-specific features such as:
   - DOM
   - `fetch()`
   - `setTimeout()`
   - Local Storage
   - Geolocation
   - WebSocket

These features are **not part of JavaScript itself**; they are provided by the browser's Runtime Environment.

> 💡 **Note**
>
> We'll discuss **JavaScript Engines** and **Runtime Environments** in detail in the upcoming topics.

### 🚀 Running JavaScript Outside the Browser

For many years, JavaScript was considered a browser-only language.

This changed in **2009** when **Node.js** was introduced.

Node.js uses Google's **V8 JavaScript Engine** but replaces browser APIs with server-side APIs, allowing JavaScript to run outside the browser.

With Node.js, JavaScript can:

- Build REST APIs
- Create web servers
- Access the file system
- Connect to databases
- Build CLI tools
- Automate tasks

Today, several Runtime Environments can execute JavaScript outside the browser.

| Runtime | Common Use Cases |
|---------|------------------|
| **Node.js** | Backend development, APIs, CLI tools |
| **Deno** | Secure server-side applications |
| **Bun** | Fast JavaScript runtime, package manager, bundler |

Although these runtimes execute the same JavaScript language, each provides its own APIs and capabilities.

### ⚖️ Browser vs Node.js

| Feature | Browser | Node.js |
|---------|----------|----------|
| Purpose | Web applications | Server-side applications |
| Has DOM | ✅ Yes | ❌ No |
| Can access File System | ❌ No | ✅ Yes |
| Supports `document` | ✅ Yes | ❌ No |
| Supports `window` | ✅ Yes | ❌ No |
| Supports `process` | ❌ No | ✅ Yes |
| Uses JavaScript Engine | ✅ Yes | ✅ Yes |

The JavaScript language remains the same, but the available APIs depend on the Runtime Environment.

### 🌍 Real-World Example

Imagine you're building an e-commerce application.

JavaScript can be used in multiple places:

- **Browser:** Display products, validate forms, update the shopping cart, and communicate with the server.
- **Node.js:** Handle authentication, process payments, connect to databases, and expose REST APIs.
- **React Native:** Build the mobile application.
- **Electron:** Build the desktop admin panel.

Even though all of these use JavaScript, each runs in a different Runtime Environment.

### 🎤 Interview Answer

JavaScript originally ran only inside web browsers, where it was used to make web pages interactive. Today, JavaScript can also run outside the browser using Runtime Environments such as **Node.js**, **Deno**, and **Bun**. In browsers, JavaScript executes using a JavaScript Engine along with browser APIs like the DOM and `fetch()`. Outside the browser, runtimes like Node.js provide server-side APIs such as the File System and networking, allowing JavaScript to build backend applications, CLI tools, and more.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is a JavaScript Runtime Environment?
- What is a JavaScript Engine?
- What is the difference between a JavaScript Engine and a Runtime Environment?
- Why can Node.js run JavaScript outside the browser?
- Does Node.js use the same JavaScript language as browsers?
- Why can't we use `document` or `window` inside Node.js?

---

## 3. What is ECMAScript, and what is its relationship with JavaScript?

### 📖 Overview

One of the most common interview questions is:

> **Is JavaScript the same as ECMAScript?**

The answer is **No**.

**ECMAScript (ES)** is the **official specification (standard)** that defines how the JavaScript language should work, while **JavaScript** is an implementation of that specification.

Think of ECMAScript as a **rulebook** and JavaScript as a language that follows those rules.

### 🏛️ Why Was ECMAScript Introduced?

When JavaScript was created in **1995**, it quickly became popular across different web browsers.

However, each browser vendor started implementing JavaScript differently, leading to compatibility issues. A feature that worked in one browser might behave differently in another.

To solve this problem, **ECMA International** (a standards organization) standardized the language in **1997** under the name **ECMAScript**.

This ensured that every JavaScript engine followed the same language specification, making JavaScript more consistent across browsers.

### ⚙️ ECMAScript vs JavaScript

| ECMAScript | JavaScript |
|------------|------------|
| A language specification (standard). | An implementation of the ECMAScript specification. |
| Defines how the language should behave. | Executes code according to the specification. |
| Managed by **ECMA International**. | Developed by browser vendors and runtime developers. |
| Doesn't execute code. | Executes JavaScript code using a JavaScript Engine. |

In simple words:

> **ECMAScript defines the rules, while JavaScript follows those rules.**

### 📅 ECMAScript Versions

Over the years, ECMAScript has introduced many new language features.

Some important versions include:

| Version | Notable Features |
|----------|------------------|
| **ES5 (2009)** | Strict Mode, JSON support, Array methods (`map`, `filter`, `reduce`) |
| **ES6 / ES2015** | `let`, `const`, Arrow Functions, Classes, Template Literals, Promises, Modules |
| **ES2016+** | Async/Await, Optional Chaining, Nullish Coalescing, BigInt, and many other modern features |

Today, ECMAScript is updated **every year**, introducing new features while maintaining backward compatibility.

### 💻 Example

The following features were introduced in **ES6 (ECMAScript 2015)**.

```js
const name = "Vaibhav";

const greet = () => {
  console.log(`Hello, ${name}!`);
};

greet();
```

This example uses:

- `const`
- Arrow Functions (`=>`)
- Template Literals

All of these are ECMAScript features implemented by modern JavaScript engines.

### 🌍 Real-World Example

Imagine the government publishes a rulebook for traffic laws.

Different companies manufacture cars—Toyota, Honda, BMW—but all of them follow the same traffic rules.

Similarly:

- **ECMAScript** is the rulebook.
- **Chrome (V8)**, **Firefox (SpiderMonkey)**, and **Safari (JavaScriptCore)** are different implementations that follow the ECMAScript specification.

This standardization allows JavaScript code to behave consistently across different environments.

### 🎤 Interview Answer

ECMAScript is the official specification or standard for the JavaScript language, maintained by **ECMA International**. It defines the syntax, features, and behavior that JavaScript engines should implement. JavaScript itself is an implementation of the ECMAScript specification. In simple terms, ECMAScript defines the rules, while JavaScript follows those rules. Modern features like `let`, `const`, Arrow Functions, Classes, and Async/Await were all introduced through newer ECMAScript versions.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is a JavaScript Engine?
- How does a JavaScript Engine implement the ECMAScript specification?
- Why are modern JavaScript features sometimes unsupported in older browsers?
- What is Babel, and why is it used?
- What is the difference between ES5 and ES6?
- How often are new ECMAScript versions released?

---

## 4. What is a JavaScript Engine, what is a Runtime Environment, and how are they different?

### 📖 Overview

When people start learning JavaScript, they often hear terms like **JavaScript Engine**, **Runtime Environment**, **V8**, and **Node.js**. These terms are related but refer to different things.

A simple way to understand them is:

- **JavaScript Engine** → Executes JavaScript code.
- **Runtime Environment** → Provides everything needed to run JavaScript applications.

Think of it this way:

> The **JavaScript Engine** is the **brain** that understands and executes JavaScript, while the **Runtime Environment** is the **workspace** that provides additional tools and APIs the program needs.

### ⚙️ What is a JavaScript Engine?

A **JavaScript Engine** is a software program responsible for **parsing**, **compiling**, and **executing** JavaScript code.

Its primary responsibilities include:

- Reading JavaScript source code.
- Parsing the code.
- Compiling it into machine code (using modern JIT compilation).
- Executing the compiled code.
- Managing memory.
- Performing optimizations for better performance.

Every modern browser includes its own JavaScript Engine.

Some popular engines are:

| Browser / Platform | JavaScript Engine |
|--------------------|-------------------|
| Google Chrome | **V8** |
| Microsoft Edge | **V8** |
| Mozilla Firefox | **SpiderMonkey** |
| Safari | **JavaScriptCore** |

> 💡 **Note**
>
> Although different browsers use different JavaScript Engines, they all follow the **ECMAScript specification**, so JavaScript behaves consistently across browsers.

### 🌐 What is a Runtime Environment?

A **Runtime Environment** is the complete environment in which JavaScript runs.

It includes:

- A **JavaScript Engine**
- Platform-specific APIs
- Memory management
- Event Loop
- Task queues
- Other components required to execute applications

Different Runtime Environments provide different APIs.

For example:

| Browser Runtime | Node.js Runtime |
|-----------------|-----------------|
| DOM | File System (`fs`) |
| `window` | `process` |
| `document` | Buffer |
| Local Storage | Streams |
| Geolocation | File System |
| `fetch()` | Networking APIs |

These APIs are **not part of JavaScript itself**.

They are provided by the Runtime Environment.

### ⚖️ JavaScript Engine vs Runtime Environment

| JavaScript Engine | Runtime Environment |
|-------------------|---------------------|
| Executes JavaScript code. | Provides everything needed to run JavaScript applications. |
| Responsible for parsing, compiling, and executing code. | Includes the engine along with additional APIs and runtime features. |
| Doesn't provide browser or server APIs. | Provides browser APIs or server-side APIs depending on the platform. |
| Example: **V8**, SpiderMonkey, JavaScriptCore | Example: Browser Runtime, Node.js Runtime, Deno, Bun |

In simple terms:

> **A Runtime Environment contains a JavaScript Engine, but a JavaScript Engine is only one part of the Runtime Environment.**

### 📊 Relationship

```text
                Runtime Environment
        +--------------------------------+
        |                                |
        |   JavaScript Engine            |
        |   (Executes JS Code)           |
        |                                |
        |   Event Loop                   |
        |   Task Queues                  |
        |   Platform APIs                |
        |   Memory Management            |
        |                                |
        +--------------------------------+
```

### 🌍 Real-World Example

Suppose you're building an online banking application.

When a user clicks the **Transfer Money** button:

The **JavaScript Engine** executes your JavaScript code.

If your code calls:

```js
fetch("/api/transfer");
```

the **Runtime Environment** provides the `fetch()` API and handles the network request.

Similarly, in Node.js:

```js
fs.readFile("users.json");
```

The **JavaScript Engine** executes the JavaScript statement, while the **Node.js Runtime** provides the `fs` module that actually reads the file.

This demonstrates that the Engine executes JavaScript, while the Runtime provides additional capabilities.

### 🎤 Interview Answer

A **JavaScript Engine** is responsible for parsing, compiling, and executing JavaScript code. Examples include **V8**, **SpiderMonkey**, and **JavaScriptCore**. A **Runtime Environment** is the complete environment in which JavaScript runs. It includes the JavaScript Engine along with additional components such as platform APIs, the Event Loop, and task queues. In simple terms, the Engine executes JavaScript code, while the Runtime Environment provides the APIs and infrastructure needed to build real-world applications.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is the V8 Engine?
- How does a JavaScript Engine execute code internally?
- What is Just-In-Time (JIT) Compilation?
- What is the Event Loop?
- Why can browsers provide `document` while Node.js cannot?
- Why is `fetch()` available in browsers but not originally in older versions of Node.js?

---

## 5. What is the V8 Engine, and how does it execute JavaScript code?

### 📖 Overview

**V8** is Google's open-source **JavaScript Engine** developed by Google. It was first released in **2008** as part of the Google Chrome browser and later became the JavaScript engine used by **Node.js**.

The primary responsibility of V8 is to **parse**, **compile**, and **execute** JavaScript code as efficiently as possible.

Modern JavaScript engines, including V8, don't simply interpret JavaScript line by line. Instead, they use **Just-In-Time (JIT) Compilation** to convert JavaScript into optimized machine code while the program is running.

Today, V8 powers applications ranging from web browsers to backend servers, making it one of the most widely used JavaScript engines in the world.

### ⚙️ How Does V8 Execute JavaScript Code?

Whenever JavaScript code is executed, V8 follows a series of steps.

```text
JavaScript Source Code
          │
          ▼
      Parsing
          │
          ▼
 AST (Abstract Syntax Tree)
          │
          ▼
     Ignition Interpreter
          │
          ▼
 Bytecode Generation
          │
          ▼
     TurboFan Compiler
          │
          ▼
 Optimized Machine Code
          │
          ▼
      Code Execution
```

Let's briefly understand each step.

#### 📝 1. Parsing

The parser checks whether the JavaScript code follows the correct syntax.

If any syntax errors are found, execution stops immediately.

Example:

```js
const name = ;
```

This code produces a syntax error because the declaration is incomplete.

If the code is valid, V8 converts it into an **Abstract Syntax Tree (AST)**.

---

#### 🌳 2. Abstract Syntax Tree (AST)

An **AST** is a tree-like representation of your JavaScript program.

Instead of reading raw text, the JavaScript engine works with this structured representation, making it easier to analyze and optimize the code.

> 💡 **Note**
>
> You don't need to memorize the structure of an AST for interviews. Just remember that it is an internal representation of your JavaScript code.

---

#### 🚀 3. Ignition Interpreter

V8's **Ignition** interpreter converts the AST into **Bytecode**.

Bytecode is a low-level representation that is much faster to execute than the original JavaScript source code.

Initially, JavaScript executes using this bytecode.

---

#### ⚡ 4. TurboFan Compiler

While the program is running, V8 monitors which parts of the code execute frequently.

These frequently executed sections are called **Hot Code**.

Instead of interpreting them repeatedly, V8 sends them to the **TurboFan Optimizing Compiler**, which converts them into highly optimized machine code.

This significantly improves performance.

---

#### ▶️ 5. Code Execution

Once optimized machine code is generated, the CPU executes it directly.

As a result, repeatedly executed code becomes much faster than the initial execution.

This optimization happens automatically and is one of the reasons modern JavaScript applications perform so well.

### 🌍 Real-World Example

Imagine an e-commerce application where thousands of users repeatedly search for products.

The search function may execute millions of times every day.

Initially, V8 executes it using bytecode.

After detecting that it's frequently used, TurboFan compiles it into optimized machine code, reducing execution time and improving application performance.

This optimization happens behind the scenes without requiring any changes from the developer.

### 🎤 Interview Answer

V8 is Google's open-source JavaScript Engine used by Chrome and Node.js. It is responsible for parsing, compiling, and executing JavaScript code. Internally, V8 parses JavaScript into an Abstract Syntax Tree (AST), converts it into bytecode using the Ignition interpreter, and then optimizes frequently executed code using the TurboFan compiler. This process, known as Just-In-Time (JIT) Compilation, enables JavaScript to achieve high performance while still remaining a dynamic language.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is an Abstract Syntax Tree (AST)?
- What is Bytecode?
- What is Just-In-Time (JIT) Compilation?
- Is JavaScript interpreted or compiled?
- Why is JIT Compilation faster than pure interpretation?
- How does TurboFan optimize JavaScript code?

---

## 6. How does JavaScript execute code internally?

### 📖 Overview

Whenever you run a JavaScript program, a lot happens behind the scenes before the first line of code is actually executed.

At a high level, JavaScript execution can be divided into **six major stages**:

1. Loading the source code
2. Parsing the code
3. Compiling the code
4. Creating the Execution Context
5. Executing the code
6. Cleaning up memory

Understanding this lifecycle helps explain many important JavaScript concepts such as **Hoisting**, **Execution Context**, **Call Stack**, **Scope**, and the **Event Loop**.

### ⚙️ JavaScript Execution Lifecycle

The complete execution flow looks like this:

```text
JavaScript Source Code
          │
          ▼
      Parsing
          │
          ▼
      Compilation
          │
          ▼
Create Global Execution Context
          │
          ▼
Execute Global Code
          │
          ▼
Function Call
          │
          ▼
Create Function Execution Context
          │
          ▼
Execute Function
          │
          ▼
Destroy Function Context
          │
          ▼
Program Ends
```

Let's understand each stage.

### 📝 1. Loading the Source Code

The JavaScript engine first receives your source code.

For example:

```js
const name = "Vaibhav";

function greet() {
  console.log(name);
}

greet();
```

At this stage, the engine has only received the code—it hasn't started executing anything yet.

### 🌳 2. Parsing

The parser checks whether the code is syntactically valid.

If a syntax error is found, execution stops immediately.

If the code is valid, the parser converts it into an **Abstract Syntax Tree (AST)**.

> 💡 **Note**
>
> We discussed the parsing process and AST in the previous topic while learning about the V8 Engine.

### ⚡ 3. Compilation

Modern JavaScript engines compile the parsed code into a format that the computer can execute efficiently.

In V8, this involves generating **Bytecode** and later optimizing frequently executed code into **Machine Code**.

The exact implementation varies between JavaScript engines, but the overall goal is the same: execute JavaScript as efficiently as possible.

### 🏗️ 4. Creating the Execution Context

Before any JavaScript code runs, the engine creates a **Global Execution Context**.

This execution environment stores:

- Variables
- Functions
- Scope information
- The `this` binding

Whenever a function is called, JavaScript creates a new **Function Execution Context**.

We'll explore Execution Context in detail in the next chapter.

### ▶️ 5. Executing the Code

Once the Execution Context is ready, JavaScript begins executing the code line by line.

Whenever a function is invoked:

1. A new Function Execution Context is created.
2. The function executes.
3. The Function Execution Context is destroyed after execution completes.

This process continues until all JavaScript code has been executed.

### 🧹 6. Memory Cleanup

After execution finishes, temporary memory that is no longer needed becomes eligible for **Garbage Collection**.

Modern JavaScript engines automatically reclaim unused memory, allowing developers to focus on writing code instead of manually managing memory.

### 🌍 Real-World Example

Suppose a user clicks the **Login** button.

Internally, JavaScript performs the following steps:

```text
Button Click
      │
      ▼
Call login()
      │
      ▼
Create Function Execution Context
      │
      ▼
Execute Validation
      │
      ▼
Send API Request
      │
      ▼
Return Response
      │
      ▼
Destroy Execution Context
```

Although this happens in milliseconds, the JavaScript engine follows the same execution lifecycle every time.

### 🎤 Interview Answer

Whenever JavaScript executes a program, it first parses and compiles the source code. It then creates a Global Execution Context before executing any code. Whenever a function is called, JavaScript creates a new Function Execution Context, executes the function, and destroys the context after the function returns. Once the program finishes, unused memory is reclaimed by the Garbage Collector. This execution lifecycle forms the foundation for concepts such as Hoisting, Scope, Closures, the Call Stack, and the Event Loop.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is an Execution Context?
- What are the phases of an Execution Context?
- What is Hoisting?
- What is the Call Stack?
- How does JavaScript manage memory?
- What is Garbage Collection?

---

## 7. What is Just-In-Time (JIT) Compilation, and is JavaScript interpreted or compiled?

### 📖 Overview

One of the most common JavaScript interview questions is:

> **Is JavaScript an interpreted language or a compiled language?**

The answer is:

> **Modern JavaScript is neither purely interpreted nor purely compiled. It uses Just-In-Time (JIT) Compilation, combining the advantages of both approaches.**

In the past, JavaScript engines interpreted code line by line. Modern engines such as **V8** compile JavaScript while the program is running, making execution significantly faster.

### ⚖️ Interpreter vs Compiler

Before understanding JIT Compilation, let's first understand the difference between an **Interpreter** and a **Compiler**.

| Interpreter | Compiler |
|-------------|----------|
| Executes code line by line. | Translates the entire program before execution. |
| Starts execution quickly. | Compilation takes time before execution begins. |
| Generally slower for repeated execution. | Produces faster executable code. |
| Easier to debug. | Better runtime performance. |

Neither approach is perfect.

JavaScript needs **fast startup** as well as **high performance**, which is why modern engines use **JIT Compilation**.

### 🚀 What is Just-In-Time (JIT) Compilation?

**Just-In-Time (JIT) Compilation** is a technique where JavaScript code is compiled **while the program is running**.

Instead of interpreting the same code repeatedly, the engine monitors which parts of the code execute frequently.

These frequently executed portions are called **Hot Code**.

The engine then compiles this hot code into optimized **Machine Code**, allowing future executions to run much faster.

### ⚙️ How JIT Compilation Works

At a high level, modern JavaScript engines follow this process:

```text
JavaScript Source Code
          │
          ▼
      Parse Code
          │
          ▼
Generate Bytecode
          │
          ▼
Execute Bytecode
          │
          ▼
Identify Hot Code
          │
          ▼
Compile into Machine Code
          │
          ▼
Execute Optimized Code
```

Initially, JavaScript executes normally.

As the engine gathers information about how the application behaves, it continuously optimizes frequently executed code.

This optimization happens automatically and is completely transparent to developers.

### 🌍 Real-World Example

Imagine an e-commerce website where users continuously search for products.

The search function may execute thousands of times every minute.

During the first few executions, the JavaScript engine runs the function normally.

Once it detects that the function is executed frequently, it compiles it into optimized machine code, making every subsequent search much faster.

This is one of the reasons modern JavaScript applications feel highly responsive.

### 🎤 Interview Answer

Modern JavaScript is neither purely interpreted nor purely compiled. Instead, JavaScript engines such as V8 use **Just-In-Time (JIT) Compilation**, which combines the advantages of both approaches. Initially, JavaScript is parsed and executed quickly, and as the engine detects frequently executed code, it compiles that code into optimized machine code. This allows JavaScript applications to start quickly while still achieving excellent runtime performance.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- Why was JIT Compilation introduced?
- What is Bytecode?
- What is Hot Code?
- How does TurboFan optimize JavaScript code?
- Can optimized code become de-optimized?
- Why is JavaScript still considered a dynamic language even with JIT Compilation?

## 8. Why is JavaScript considered a dynamically typed language?

### 📖 Overview

JavaScript is called a **dynamically typed language** because the **type of a variable is determined at runtime**, not when the code is written.

Unlike statically typed languages such as **Java**, **C++**, or **TypeScript**, you don't need to explicitly declare the data type of a variable.

Instead, JavaScript automatically determines the type based on the value assigned to it.

### ⚙️ How Dynamic Typing Works

When a value is assigned to a variable, JavaScript automatically infers its type.

The same variable can even hold values of different types during the program's execution.

For example:

```js
let data = "Vaibhav";

console.log(typeof data); // string

data = 25;

console.log(typeof data); // number

data = true;

console.log(typeof data); // boolean
```

Here, the variable `data` changes from:

- `string`
- `number`
- `boolean`

without producing any errors.

This flexibility is one of the defining characteristics of JavaScript.

### ⚖️ Dynamic Typing vs Static Typing

| Dynamic Typing | Static Typing |
|----------------|---------------|
| Types are determined at runtime. | Types are checked during compilation. |
| Variables can store different data types over time. | Variables usually have a fixed type. |
| Less code to write. | Requires explicit type declarations (or inference). |
| More flexible. | More type-safe and catches errors earlier. |

For example, in JavaScript:

```js
let age = 22;

age = "Twenty Two";
```

This is completely valid.

In TypeScript:

```ts
let age: number = 22;

age = "Twenty Two"; // Error
```

TypeScript reports an error because the variable is declared as a `number`.

### 💡 Advantages of Dynamic Typing

Dynamic typing makes JavaScript easy to write and quick to prototype.

Some advantages include:

- Less boilerplate code.
- Faster development.
- Easier experimentation.
- Flexible variable usage.

This is one of the reasons JavaScript became popular for web development.

### ⚠️ Challenges of Dynamic Typing

The same flexibility can also introduce bugs if developers are not careful.

For example:

```js
let price = "100";

console.log(price + 50);
```

Output:

```text
10050
```

Instead of performing numeric addition, JavaScript performs **string concatenation** because `price` is a string.

Similarly:

```js
let value = null;

console.log(typeof value);
```

Output:

```text
object
```

Although `null` is a primitive value, `typeof null` returns `"object"` due to a historical bug in JavaScript.

Understanding JavaScript's type system helps avoid these kinds of unexpected behaviors.

### 🌍 Real-World Example

Suppose you're building a user profile page.

When the application first loads:

```js
let user = null;
```

After fetching data from the server:

```js
user = {
  id: 1,
  name: "Vaibhav"
};
```

Initially, the variable stores `null`.

Later, it stores an object.

JavaScript allows this because variables are **not restricted to a single data type**.

### 🎤 Interview Answer

JavaScript is considered a dynamically typed language because variable types are determined at runtime rather than being declared explicitly. A variable can store values of different data types during execution, and JavaScript automatically infers the type based on the assigned value. This provides greater flexibility and faster development, although it can also lead to runtime errors if developers are not careful.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is the difference between primitive and non-primitive data types?
- How does the `typeof` operator work?
- Why does `typeof null` return `"object"`?
- What is type coercion in JavaScript?
- What is the difference between `==` and `===`?
- Why was TypeScript introduced if JavaScript is dynamically typed?

---

## 9. Is JavaScript single-threaded, and what does "single-threaded" mean?

### 📖 Overview

JavaScript is known as a **single-threaded** programming language.

Being **single-threaded** means that JavaScript executes **one task at a time** using a **single Call Stack**. At any given moment, only one piece of JavaScript code can be executed.

This design keeps the language simple and avoids many of the synchronization problems that occur in multi-threaded programming.

> 💡 **Note**
>
> Although JavaScript is single-threaded, modern web applications can still perform multiple operations seemingly at the same time. We'll understand how this is possible in the upcoming topics.

### 🧵 What is a Thread?

A **thread** is the smallest unit of execution within a process.

You can think of a thread as a worker that executes instructions.

- A **single-threaded** program has **one worker**.
- A **multi-threaded** program has **multiple workers** that can execute tasks simultaneously.

JavaScript has **one main thread** responsible for executing JavaScript code.

### ⚙️ What Does Single-Threaded Mean?

Since JavaScript has only one main thread, it executes code sequentially.

For example:

```js
console.log("Start");

console.log("Learning JavaScript");

console.log("End");
```

**Output:**

```text
Start
Learning JavaScript
End
```

JavaScript executes each statement one after another.

It never executes the second statement before completing the first one.

### 📊 How JavaScript Executes Code

Internally, JavaScript uses a **Call Stack** to manage execution.

```text
           Call Stack

+----------------------+
| console.log("End")   |
+----------------------+
| console.log(...)     |
+----------------------+
| console.log("Start") |
+----------------------+
```

The Call Stack follows the **Last In, First Out (LIFO)** principle.

Whenever a function is called:

1. A new stack frame is pushed onto the Call Stack.
2. The function executes.
3. Once it finishes, the stack frame is removed.
4. The next function begins execution.

Because there is only **one Call Stack**, JavaScript can execute only one function at a time.

> 💡 **Note**
>
> We'll study the **Call Stack** in detail in the **Execution Context** chapter.

### ⚖️ Single-Threaded vs Multi-Threaded

| Single-Threaded | Multi-Threaded |
|-----------------|----------------|
| One thread executes code. | Multiple threads execute code simultaneously. |
| One Call Stack. | Multiple execution threads. |
| Simpler execution model. | More complex due to synchronization. |
| Easier to reason about. | Requires thread coordination and locking mechanisms. |

### 🌍 Real-World Example

Imagine a restaurant with only **one chef**.

Customers place multiple orders:

- 🍕 Pizza
- 🍔 Burger
- 🥤 Juice

Since there's only one chef, the orders are prepared **one after another**.

The chef cannot cook the pizza and burger at exactly the same time.

Similarly, JavaScript executes one task before moving to the next.

In upcoming topics, we'll see how JavaScript delegates long-running tasks to the Runtime Environment, making applications appear to perform multiple operations simultaneously.

### 🎤 Interview Answer

JavaScript is called a **single-threaded** language because it executes code using a single main thread and a single Call Stack. This means only one piece of JavaScript code can execute at any given time. Functions are executed sequentially, and each function must finish before the next one begins. Although JavaScript is single-threaded, browsers and Node.js provide asynchronous APIs that allow applications to remain responsive without executing multiple JavaScript functions simultaneously.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- If JavaScript is single-threaded, how can it perform asynchronous operations?
- What is the Call Stack?
- What are synchronous and asynchronous execution?
- Why doesn't `setTimeout()` block the execution of other JavaScript code?
- What is the Event Loop?
- Can JavaScript perform multiple tasks at the same time?

---
## 10. What are synchronous and asynchronous execution, and why does JavaScript need asynchronous programming?

### 📖 Overview

JavaScript executes code in **two different ways**:

- **Synchronous Execution**
- **Asynchronous Execution**

Understanding the difference between these two execution models is essential because almost every modern JavaScript application relies on asynchronous programming for tasks like API requests, timers, database operations, and file handling.

### ⚙️ Synchronous Execution

**Synchronous execution** means JavaScript executes one statement at a time, in the exact order it appears in the code.

The next statement will not execute until the current one has completely finished.

For example:

```js
console.log("Start");

console.log("Learning JavaScript");

console.log("End");
```

**Output:**

```text
Start
Learning JavaScript
End
```

Execution flow:

```text
Start
  │
  ▼
Learning JavaScript
  │
  ▼
End
```

This is called **blocking execution**, because each statement waits for the previous one to finish.

### ⚙️ Asynchronous Execution

**Asynchronous execution** allows JavaScript to start a long-running operation without waiting for it to complete.

Instead of blocking the entire program, JavaScript continues executing the remaining code while the operation runs in the background.

Once the operation finishes, JavaScript processes its result.

For example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Inside Timer");
}, 2000);

console.log("End");
```

**Output:**

```text
Start
End
Inside Timer
```

Although `setTimeout()` appears before `"End"` in the code, its callback executes later because it is an asynchronous operation.

> 💡 **Note**
>
> We'll learn exactly how `setTimeout()` works internally in the upcoming topics.

### ⚖️ Synchronous vs Asynchronous

| Synchronous | Asynchronous |
|--------------|--------------|
| Executes one statement after another. | Long-running tasks execute without blocking the main thread. |
| Blocking in nature. | Non-blocking in nature. |
| Each statement waits for the previous one. | Other code continues executing while waiting. |
| Simpler execution flow. | Requires callbacks, promises, or async/await to handle results. |

### ❓ Why Does JavaScript Need Asynchronous Programming?

Imagine a user clicks the **Login** button.

The application needs to:

1. Send a request to the server.
2. Wait for the response.
3. Display the user's dashboard.

If JavaScript waited synchronously for the server response, the entire webpage would freeze.

The user wouldn't be able to:

- Scroll the page.
- Click buttons.
- Type into input fields.
- Interact with the application.

Instead, JavaScript sends the request and immediately continues executing other code.

When the server responds, JavaScript processes the result.

This is why modern web applications remain responsive even while communicating with servers.

### 🌍 Common Asynchronous Operations

Some common operations that are asynchronous include:

- API requests (`fetch()`)
- Timers (`setTimeout()`, `setInterval()`)
- Database queries
- Reading files (Node.js)
- WebSockets
- User location (Geolocation API)

These operations may take time to complete, so executing them asynchronously prevents the application from becoming unresponsive.

### 🌍 Real-World Example

Imagine you're using an online shopping website.

After clicking **Place Order**:

- The order request is sent to the server.
- While waiting for the response, you can still:
  - Scroll the page.
  - Open the navigation menu.
  - Read product details.
  - View recommendations.

The website doesn't freeze while waiting for the server.

This is possible because JavaScript performs the network request asynchronously.

### 🎤 Interview Answer

Synchronous execution means JavaScript executes code one statement at a time, waiting for each statement to finish before moving to the next. Asynchronous execution allows long-running operations, such as API requests or timers, to run without blocking the main thread. While those operations are in progress, JavaScript continues executing other code, making applications responsive and improving the user experience.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- If JavaScript is single-threaded, how can it perform asynchronous operations?
- What happens internally when JavaScript encounters `setTimeout()`?
- What happens internally when JavaScript encounters `fetch()`?
- What are Web APIs?
- What is the Event Loop?
- What are the Callback Queue and Microtask Queue?
- Why doesn't `setTimeout()` block the execution of other JavaScript code?

---
## 11. If JavaScript is single-threaded, how does it perform asynchronous operations?

### 📖 Overview

At first glance, JavaScript seems contradictory.

On one hand, JavaScript is **single-threaded**, meaning it can execute only one piece of JavaScript code at a time.

On the other hand, JavaScript applications can:

- Fetch data from APIs
- Run timers
- Download images
- Play videos
- Handle user interactions

...all without freezing the application.

So how is this possible?

The answer is:

> **JavaScript itself remains single-threaded, but it works together with the Runtime Environment, which performs long-running operations on its behalf.**

### ⚙️ How Does It Work?

JavaScript only executes your code.

Whenever it encounters an operation that may take time, it **delegates** that task to the **Runtime Environment** instead of waiting for it to finish.

For example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer Finished");
}, 2000);

console.log("End");
```

JavaScript does **not** wait for the timer.

Instead, it asks the Runtime Environment to handle it and immediately continues executing the next line.

### 📊 Execution Flow

```text
                JavaScript
              (Call Stack)
                     │
                     │
         setTimeout(...)
                     │
                     ▼
        Runtime Environment
        (Timer starts here)
                     │
                     │
         JavaScript continues
                     │
                     ▼
           console.log("End")
                     │
                     ▼
          Timer Completes
                     │
                     ▼
      Callback becomes ready
                     │
                     ▼
      JavaScript executes it
```

Notice that **JavaScript never executes two functions simultaneously.**

It simply delegates waiting tasks to the Runtime Environment.

### 🧩 What Does the Runtime Environment Do?

The Runtime Environment provides APIs for operations that JavaScript cannot perform by itself.

Examples include:

- Timers (`setTimeout`, `setInterval`)
- Network Requests (`fetch`)
- DOM Events
- File System (Node.js)
- WebSockets
- Geolocation

These operations execute **outside the JavaScript Engine**.

When they complete, JavaScript is notified so it can continue execution.

> 💡 **Note**
>
> We'll see exactly **how JavaScript gets notified** when we learn about the **Event Loop**.

### ⚠️ Does JavaScript Execute Multiple Tasks at the Same Time?

No.

This is one of the biggest misconceptions.

JavaScript **never executes multiple JavaScript functions simultaneously** on the main thread.

Instead:

- Long-running operations are handled by the Runtime Environment.
- JavaScript continues executing other code.
- Once the operation completes, JavaScript executes its callback **later**.

This creates the illusion that JavaScript is performing multiple tasks simultaneously.

### 🌍 Real-World Example

Suppose you're watching YouTube.

While a video is playing, you can simultaneously:

- Scroll through comments.
- Like the video.
- Search for another video.
- Receive notifications.

It may look like JavaScript is doing everything at once.

In reality:

- Video streaming is handled by the browser.
- Network requests are handled by the browser.
- User events are handled by the browser.
- JavaScript only executes the necessary callbacks when those operations complete.

This collaboration between JavaScript and the Runtime Environment keeps applications responsive.

### 🎤 Interview Answer

Although JavaScript is single-threaded, it can perform asynchronous operations by delegating long-running tasks to the Runtime Environment. Operations like timers, network requests, and user events are handled outside the JavaScript Engine. While those tasks are running, JavaScript continues executing other code. Once the operation completes, JavaScript executes the associated callback. This allows applications to remain responsive without JavaScript executing multiple functions simultaneously.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is the Runtime Environment?
- What are Web APIs?
- What is the Event Loop?
- What happens internally when JavaScript encounters `setTimeout()`?
- What happens internally when JavaScript encounters `fetch()`?
- What are the Callback Queue and Microtask Queue?
- What is the difference between concurrency and parallelism?

---
## 12. What happens internally when JavaScript encounters `setTimeout()`?

### 📖 Overview

One of the most common misconceptions is that **`setTimeout()` is part of JavaScript**.

It is **not**.

`setTimeout()` is provided by the **Browser Runtime** (or the **Node.js Runtime**), not by the JavaScript language itself.

When JavaScript encounters `setTimeout()`, it **doesn't pause execution**. Instead, it asks the Runtime Environment to handle the timer and immediately continues executing the remaining code.

### ⚙️ Step-by-Step Execution

Consider the following example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Inside Timer");
}, 2000);

console.log("End");
```

**Output:**

```text
Start
End
Inside Timer
```

Let's understand why.

### 📊 Execution Flow

#### Step 1: Execute the first statement

```js
console.log("Start");
```

Output:

```text
Start
```

The statement executes immediately.

---

#### Step 2: JavaScript encounters `setTimeout()`

```js
setTimeout(() => {
  console.log("Inside Timer");
}, 2000);
```

Instead of waiting for **2 seconds**, JavaScript delegates this task to the **Browser Runtime**.

The Browser starts a **2-second timer**, while JavaScript immediately moves to the next line.

At this point:

```text
JavaScript
     │
     ▼
Browser Runtime
(Timer Starts)
```

---

#### Step 3: Continue executing JavaScript

```js
console.log("End");
```

Output:

```text
End
```

Notice that JavaScript never waited for the timer.

---

#### Step 4: Timer Completes

After approximately **2 seconds**, the Browser Runtime marks the callback as ready for execution.

However, **the callback is NOT executed immediately**.

Instead, it is placed into the **Callback Queue**.

```text
Browser Runtime
        │
        ▼
 Callback Queue
```

---

#### Step 5: Event Loop

The **Event Loop** continuously checks two things:

- Is the **Call Stack** empty?
- Is there any callback waiting in the Callback Queue?

If the Call Stack is empty, the Event Loop moves the callback from the Callback Queue to the Call Stack.

```text
Callback Queue
       │
       ▼
   Event Loop
       │
       ▼
   Call Stack
```

---

#### Step 6: Callback Executes

Finally,

```js
console.log("Inside Timer");
```

executes.

Final Output:

```text
Start
End
Inside Timer
```

### 📊 Complete Internal Flow

```text
            JavaScript
                │
                ▼
      setTimeout(callback, 2000)
                │
                ▼
        Browser Runtime
        (Starts Timer)
                │
                ▼
      JavaScript Continues
                │
                ▼
      console.log("End")
                │
                ▼
        Timer Completes
                │
                ▼
        Callback Queue
                │
                ▼
          Event Loop
                │
                ▼
          Call Stack
                │
                ▼
      console.log("Inside Timer")
```

### 💡 Important Points

- `setTimeout()` is **not part of JavaScript**.
- The timer runs inside the **Browser Runtime**.
- JavaScript **never waits** for the timer.
- The callback executes **only when**:
  - The timer has finished.
  - The Call Stack is empty.

> 💡 **Note**
>
> The delay passed to `setTimeout()` specifies the **minimum delay**, not the exact execution time.
>
> If the Call Stack is busy, the callback will execute later.

### 🌍 Real-World Example

Imagine you're baking a pizza.

You set a **20-minute timer** and continue preparing other dishes.

When the timer rings, you don't instantly remove the pizza from the oven.

You first finish whatever you're currently doing, and only then take the pizza out.

`setTimeout()` works the same way.

The timer finishing **doesn't guarantee immediate execution**.

JavaScript first finishes its current work before executing the callback.

### 🎤 Interview Answer

When JavaScript encounters `setTimeout()`, it delegates the timer to the Browser Runtime instead of waiting. JavaScript immediately continues executing the remaining code. Once the timer expires, the callback is placed into the Callback Queue. The Event Loop waits until the Call Stack becomes empty and then moves the callback onto the Call Stack for execution. This is why `setTimeout()` is asynchronous and does not block the execution of other JavaScript code.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- Why doesn't `setTimeout(fn, 0)` execute immediately?
- What is the Event Loop?
- What is the Callback Queue?
- What is the Call Stack?
- What is the minimum delay in `setTimeout()`?
- Can `setTimeout()` execute before synchronous code finishes?
- What is the difference between `setTimeout()` and `setInterval()`?


---

## 13. What happens internally when JavaScript encounters `fetch()`?

### 📖 Overview

Like `setTimeout()`, **`fetch()` is not part of JavaScript itself**. It is provided by the **Browser Runtime** (or the **Node.js Runtime**).

When JavaScript encounters a `fetch()` call, it **does not wait** for the server to respond. Instead, it delegates the network request to the Runtime Environment and immediately continues executing the remaining code.

Unlike `setTimeout()`, `fetch()` returns a **Promise**, so when the request completes, its callback is placed into the **Microtask Queue**, not the Callback Queue.

### ⚙️ Step-by-Step Execution

Consider the following example:

```js
console.log("Start");

fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(() => {
    console.log("Response Received");
  });

console.log("End");
```

**Output:**

```text
Start
End
Response Received
```

Let's understand what happens internally.

### 📊 Execution Flow

#### Step 1: Execute the first statement

```js
console.log("Start");
```

Output:

```text
Start
```

---

#### Step 2: JavaScript encounters `fetch()`

```js
fetch("https://jsonplaceholder.typicode.com/users/1");
```

Instead of making the network request itself, JavaScript delegates it to the **Browser Runtime**.

The Browser Runtime starts the HTTP request, while JavaScript immediately continues executing the next line.

```text
JavaScript
      │
      ▼
Browser Runtime
(Network Request Starts)
```

---

#### Step 3: Continue executing JavaScript

```js
console.log("End");
```

Output:

```text
End
```

Notice that JavaScript never waits for the server response.

---

#### Step 4: Server Responds

When the server sends the response back, the Browser Runtime resolves the Promise returned by `fetch()`.

The `.then()` callback is **not executed immediately**.

Instead, it is placed into the **Microtask Queue**.

```text
Server Response
       │
       ▼
Promise Resolved
       │
       ▼
Microtask Queue
```

---

#### Step 5: Event Loop

The **Event Loop** waits until the Call Stack becomes empty.

Once it's empty, it moves the callback from the **Microtask Queue** to the **Call Stack**.

```text
Microtask Queue
        │
        ▼
    Event Loop
        │
        ▼
    Call Stack
```

---

#### Step 6: Callback Executes

Finally,

```js
console.log("Response Received");
```

is executed.

Final Output:

```text
Start
End
Response Received
```

### 📊 Complete Internal Flow

```text
               JavaScript
                    │
                    ▼
            fetch("...")
                    │
                    ▼
          Browser Runtime
      (Starts HTTP Request)
                    │
                    ▼
      JavaScript Continues
                    │
                    ▼
         console.log("End")
                    │
                    ▼
        Server Sends Response
                    │
                    ▼
          Promise Resolved
                    │
                    ▼
          Microtask Queue
                    │
                    ▼
             Event Loop
                    │
                    ▼
             Call Stack
                    │
                    ▼
     console.log("Response Received")
```

### 💡 Important Points

- `fetch()` is **not part of JavaScript**.
- The network request is handled by the **Browser Runtime**.
- `fetch()` immediately returns a **Promise**.
- When the Promise resolves, its callback is placed into the **Microtask Queue**.
- The callback executes only after the **Call Stack becomes empty**.

> 💡 **Note**
>
> Promise callbacks (`.then()`, `.catch()`, `.finally()`) always use the **Microtask Queue**, which has a **higher priority** than the Callback Queue.

### ⚖️ `setTimeout()` vs `fetch()`

| `setTimeout()` | `fetch()` |
|----------------|-----------|
| Uses a timer. | Makes a network request. |
| Callback goes to the **Callback Queue**. | Callback goes to the **Microtask Queue**. |
| Uses the Timer API. | Uses the Fetch API. |
| Executes after the timer expires and the Call Stack is empty. | Executes after the Promise resolves and the Call Stack is empty. |

### 🌍 Real-World Example

Suppose a user opens an online shopping website.

The page immediately renders the navigation bar, search box, and loading skeleton.

Meanwhile, JavaScript sends a `fetch()` request to retrieve products.

While waiting for the response, the user can still:

- Scroll the page.
- Open the menu.
- Type into the search box.

Once the server responds, JavaScript updates the UI with the product data.

This is why modern web applications feel fast and responsive.

### 🎤 Interview Answer

When JavaScript encounters `fetch()`, it delegates the network request to the Browser Runtime and immediately continues executing the remaining code. `fetch()` returns a Promise, and once the server responds, the Promise is resolved. The associated `.then()` callback is placed into the **Microtask Queue**. When the Call Stack becomes empty, the Event Loop moves the callback to the Call Stack, where it is finally executed.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is a Promise?
- What is the Microtask Queue?
- What is the Callback Queue?
- What is the Event Loop?
- Why do Promise callbacks execute before `setTimeout()` callbacks?
- What is the difference between the Microtask Queue and the Callback Queue?
- What happens if both queues contain pending tasks?

---

## 14. What is the Event Loop, and how does it coordinate asynchronous operations?

### 📖 Overview

The **Event Loop** is one of the most important components of the JavaScript Runtime.

Its primary responsibility is to coordinate the execution of asynchronous callbacks by monitoring:

- The **Call Stack**
- The **Microtask Queue**
- The **Callback Queue**

Although JavaScript is single-threaded, the Event Loop ensures that asynchronous operations execute at the correct time without blocking the main thread.

In simple terms:

> **The Event Loop continuously checks whether JavaScript is ready to execute the next asynchronous task.**

### 🧩 Components Involved

Before understanding the Event Loop, let's quickly review the components it works with.

| Component | Responsibility |
|-----------|----------------|
| **Call Stack** | Executes JavaScript code. |
| **Browser Runtime** | Handles timers, network requests, DOM events, etc. |
| **Microtask Queue** | Stores Promise callbacks (`then`, `catch`, `finally`) and `queueMicrotask()`. |
| **Callback Queue** | Stores callbacks from APIs like `setTimeout()` and `setInterval()`. |
| **Event Loop** | Moves callbacks from queues to the Call Stack when it's empty. |

### ⚙️ How the Event Loop Works

The Event Loop continuously repeats the following steps:

1. Check whether the **Call Stack** is empty.
2. If the Call Stack is busy, do nothing.
3. If the Call Stack is empty:
   - Execute **all Microtasks**.
   - Then execute **one Callback Queue task**.
4. Repeat forever.

This process happens continuously while the JavaScript application is running.

### 📊 Execution Flow

```text
                 Browser Runtime
            ┌──────────────────────┐
            │ Timers │ Fetch │ DOM │
            └──────────┬───────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
 Microtask Queue             Callback Queue
(Promise callbacks)      (setTimeout, Events)
          │                         │
          └────────────┬────────────┘
                       ▼
                 Event Loop
                       │
                       ▼
                 Call Stack
                       │
                       ▼
             JavaScript Execution
```

### ⚖️ Microtask Queue vs Callback Queue

One important rule is:

> **The Microtask Queue always has higher priority than the Callback Queue.**

This means Promise callbacks execute before `setTimeout()` callbacks.

Example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");
```

**Output:**

```text
Start
End
Promise
Timer
```

Why?

Execution order:

1. Execute synchronous code.
2. Call Stack becomes empty.
3. Event Loop checks the **Microtask Queue**.
4. Execute `"Promise"`.
5. Then check the **Callback Queue**.
6. Execute `"Timer"`.

### 💡 Event Loop Algorithm

A simplified version of the Event Loop looks like this:

```text
LOOP Forever

    Is Call Stack Empty?

        No
          │
          ▼
      Keep Waiting

        Yes
          │
          ▼
Execute All Microtasks

          │
          ▼
Execute One Callback Queue Task

          │
          ▼
Repeat
```

This cycle continues until the application exits.

### 🌍 Real-World Example

Imagine a receptionist at a hospital.

Patients are waiting in two lines:

- 🚑 Emergency Patients (Microtask Queue)
- 👨‍⚕️ Regular Patients (Callback Queue)

Whenever the doctor becomes available:

1. All emergency patients are treated first.
2. Only then are regular patients called.

Similarly, the Event Loop always processes the **Microtask Queue before the Callback Queue**.

### 🎤 Interview Answer

The Event Loop is a component of the JavaScript Runtime that coordinates asynchronous execution. It continuously checks whether the Call Stack is empty. If it is, the Event Loop first executes all callbacks from the Microtask Queue, such as Promise callbacks, and then executes one callback from the Callback Queue, such as `setTimeout()`. This mechanism allows JavaScript to remain single-threaded while still handling asynchronous operations efficiently.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- Why do Promise callbacks execute before `setTimeout()` callbacks?
- What is the difference between the Microtask Queue and the Callback Queue?
- What happens if the Microtask Queue never becomes empty?
- What is `queueMicrotask()`?
- Why doesn't `setTimeout(fn, 0)` execute immediately?
- What is the Call Stack?
- Can the Event Loop execute multiple callbacks simultaneously?

---

## 15. Explain the complete JavaScript execution model from writing code to execution.

### 📖 Overview

When a JavaScript program runs, multiple components work together behind the scenes.

Many beginners think the JavaScript Engine executes everything by itself.

In reality, modern JavaScript execution involves:

- JavaScript Engine
- Runtime Environment
- Call Stack
- Browser APIs (or Node.js APIs)
- Microtask Queue
- Callback Queue
- Event Loop

Understanding how these components interact is one of the most important JavaScript concepts and is frequently asked in frontend interviews.

### ⚙️ Complete Execution Flow

The overall execution model looks like this:

```text
                 JavaScript Source Code
                          │
                          ▼
                 JavaScript Engine
          (Parse → Compile → Execute)
                          │
                          ▼
              Global Execution Context
                          │
                          ▼
                    Call Stack
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
      ▼                   ▼                   ▼
Synchronous Code    Browser APIs        Node.js APIs
                          │
                          ▼
                 Asynchronous Tasks
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
   Microtask Queue                Callback Queue
 (Promises, queueMicrotask)   (setTimeout, Events)
          │                               │
          └───────────────┬───────────────┘
                          ▼
                     Event Loop
                          │
                          ▼
                     Call Stack
                          │
                          ▼
                   JavaScript Executes
```

### 🧩 Step-by-Step Execution

Whenever a JavaScript program runs, the following sequence occurs:

#### 1. JavaScript Engine Receives the Source Code

The JavaScript Engine parses and compiles the source code into an executable form.

---

#### 2. Global Execution Context is Created

Before executing any code, JavaScript creates the **Global Execution Context**, which stores global variables, functions, scope information, and the `this` binding.

---

#### 3. Synchronous Code Executes

JavaScript begins executing synchronous code line by line using the **Call Stack**.

Any function calls create new **Function Execution Contexts**, which are pushed onto the Call Stack and removed when execution finishes.

---

#### 4. Asynchronous Operations are Delegated

When JavaScript encounters asynchronous operations such as:

- `setTimeout()`
- `fetch()`
- DOM Events

it delegates them to the **Runtime Environment** instead of waiting.

This keeps the main thread free to continue executing other JavaScript code.

---

#### 5. Asynchronous Tasks Complete

Once an asynchronous task finishes:

- Promise callbacks are added to the **Microtask Queue**.
- Timer and event callbacks are added to the **Callback Queue**.

They are **not executed immediately**.

---

#### 6. Event Loop Coordinates Execution

The **Event Loop** continuously checks whether the Call Stack is empty.

When it is:

1. Execute all **Microtasks**.
2. Execute one **Callback Queue** task.
3. Repeat.

This ensures asynchronous callbacks execute in the correct order.

---

#### 7. Program Continues Until Completion

This process repeats until the application exits or the page is closed.

Throughout execution, JavaScript remains **single-threaded**, while the Runtime Environment handles asynchronous operations in the background.

### 🌍 Real-World Example

Imagine you're using an online banking application.

While you're filling out the transfer form:

- JavaScript updates the UI.
- The browser handles mouse clicks and keyboard events.
- A `fetch()` request sends data to the server.
- A timer updates the OTP countdown.
- Promise callbacks process server responses.
- The Event Loop ensures each callback executes at the correct time.

Although many things appear to happen simultaneously, JavaScript itself still executes one task at a time.

### 🎤 Interview Answer

JavaScript execution begins when the JavaScript Engine parses and compiles the source code. Before execution starts, the Global Execution Context is created, and synchronous code executes on the Call Stack. Whenever JavaScript encounters asynchronous operations like `setTimeout()` or `fetch()`, it delegates them to the Runtime Environment. Once those operations complete, their callbacks are placed into either the Microtask Queue or Callback Queue. The Event Loop continuously monitors these queues and moves callbacks to the Call Stack when it becomes empty. This collaboration between the JavaScript Engine, Runtime Environment, Call Stack, queues, and Event Loop enables JavaScript to remain single-threaded while efficiently handling asynchronous operations.

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is an Execution Context?
- What is the Call Stack?
- What is Hoisting?
- How are variables stored during execution?
- What is the Memory Creation Phase?
- What is the Execution Phase?
- How does the Scope Chain work?