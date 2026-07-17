---
title: Event Loop
description: Call Stack, Web APIs, the Callback Queue, and the Microtask Queue — how JS handles async without threads.
sidebar_position: 18
---

# Event Loop

## 1. What is the Event Loop, why does JavaScript need it, and what is its relationship with JavaScript's single-threaded nature?

### 📖 Overview

The **Event Loop** is a mechanism provided by the **JavaScript Runtime Environment** (such as a browser or Node.js) that enables JavaScript to perform **non-blocking asynchronous operations** while remaining **single-threaded**.

JavaScript can execute only **one piece of code at a time** because it has a **single Call Stack**. If JavaScript had to wait for every slow operation—such as an API request, timer, or file read—to finish, the entire application would freeze.

The Event Loop solves this problem by allowing these operations to run outside the Call Stack and executing their callbacks only when JavaScript is ready.

In simple words:

> The Event Loop acts like a coordinator. It continuously checks whether JavaScript has finished its current work, and if it has, it schedules the next asynchronous callback for execution.

---

### 🎯 Why Is It Needed?

JavaScript applications constantly perform operations that take time to complete, for example:

- Fetching data from an API
- Waiting for a timer (`setTimeout`)
- Reading files (Node.js)
- Responding to user clicks
- Loading images or videos

If JavaScript waited for each of these operations synchronously, users would experience:

- Frozen user interfaces
- Slow applications
- Unresponsive buttons
- Poor user experience

Instead, JavaScript delegates these operations to the **Runtime Environment**. While those operations are running, JavaScript continues executing the remaining code.

When an operation completes, the Event Loop ensures its callback is executed at the appropriate time.

---

### 🏗️ Relationship with JavaScript's Single-Threaded Nature

JavaScript is called **single-threaded** because it has only **one Call Stack**, meaning it can execute only one JavaScript task at a time.

However, being single-threaded does **not** mean JavaScript cannot handle multiple operations simultaneously.

The Runtime Environment provides additional components that work alongside JavaScript, including:

- Call Stack
- Web APIs (Browser) or Node.js APIs
- Callback Queue (Task Queue)
- Microtask Queue
- Event Loop

These components allow JavaScript to start multiple asynchronous operations without executing multiple JavaScript functions at the same time.

For example, while JavaScript is waiting for an API response, it can continue:

- Rendering the UI
- Executing other functions
- Handling user interactions

Once the API response is ready, the Event Loop schedules its callback for execution.

> 💡 **Note**
>
> JavaScript is single-threaded, but the **Runtime Environment** is not limited to a single thread. Browsers and Node.js use background threads and system APIs to perform asynchronous operations.

---

### ⚙️ How Does the Event Loop Work?

The Event Loop continuously follows these steps:

1. JavaScript executes synchronous code using the **Call Stack**.
2. Time-consuming operations are handed over to the Runtime Environment.
3. JavaScript continues executing the remaining synchronous code.
4. When an asynchronous operation completes, its callback is placed into an appropriate queue.
5. The Event Loop waits until the Call Stack becomes empty.
6. It moves the next callback to the Call Stack.
7. JavaScript executes the callback.
8. The process repeats for the entire lifetime of the application.

This continuous cycle is why it is called the **Event Loop**.

---

### ❓ Is the Event Loop Part of JavaScript?

**No.**

The Event Loop is **not part of the JavaScript language (ECMAScript specification)**.

The JavaScript language defines features such as:

- Variables
- Functions
- Objects
- Promises
- `async` / `await`

The **Runtime Environment** (Browser or Node.js) provides:

- Event Loop
- Call Stack
- Web APIs or Node.js APIs
- Callback Queue
- Microtask Queue

Together, they make asynchronous programming possible.

---

### 🌍 Real-World Example

Imagine you're ordering food at a restaurant.

- You place your order with the waiter.
- The waiter sends your order to the kitchen.
- Instead of standing at your table waiting for the food, the waiter continues serving other customers.
- When your food is ready, the kitchen notifies the waiter.
- The waiter then brings your food to your table.

In this analogy:

| Restaurant | JavaScript |
|------------|------------|
| Customer | JavaScript Code |
| Waiter | Event Loop |
| Kitchen | Runtime Environment (Web APIs / Node.js APIs) |
| Food Preparation | Asynchronous Operation |
| Serving Food | Executing the Callback |

The waiter doesn't cook the food; they simply coordinate when it should be delivered. Similarly, the Event Loop doesn't perform asynchronous operations—it only schedules their callbacks.

---

### 🎤 Interview Answer

The Event Loop is a mechanism provided by the JavaScript Runtime Environment that enables asynchronous programming while JavaScript remains single-threaded. JavaScript executes code using a single Call Stack, so it cannot wait for slow operations like API requests or timers. Instead, these operations are handled by the Runtime Environment. Once they complete, the Event Loop waits for the Call Stack to become empty and then schedules their callbacks for execution. This keeps applications responsive and allows JavaScript to perform non-blocking operations efficiently.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What are the main components of the Event Loop architecture?
- What is the Call Stack, and how does it work?
- What are Web APIs?
- What is the Callback Queue?
- What is the Microtask Queue?
- What is the difference between Microtasks and Macrotasks?
- Why are Promise callbacks executed before `setTimeout()` callbacks?

---

## 2. What are the main components of the Event Loop architecture, and what role does each component play?

### 📖 Overview

The Event Loop is not a single component. It is an architecture made up of several components that work together to execute synchronous and asynchronous JavaScript code efficiently.

The main components are:

1. Call Stack
2. Web APIs (Browser) / Node.js APIs
3. Callback Queue (Task Queue)
4. Microtask Queue
5. Event Loop

Each component has a specific responsibility. Together, they ensure JavaScript remains responsive while handling asynchronous operations.

---

### 🏗️ Event Loop Architecture

```
                JavaScript Runtime Environment

                     ┌───────────────┐
                     │   Call Stack  │
                     └───────▲───────┘
                             │
                     Event Loop Checks
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
   Microtask Queue                    Callback Queue
 (Highest Priority)                 (Task / Macrotask Queue)
          │                                     │
          └──────────────────▲──────────────────┘
                             │
                  Web APIs / Node.js APIs
```

Whenever the Call Stack becomes empty, the Event Loop first checks the **Microtask Queue**. If it is empty, it then checks the **Callback Queue**.

---

### ⚙️ 1. Call Stack

The **Call Stack** is where JavaScript executes code.

Whenever a function is called, it is pushed onto the Call Stack. Once the function finishes execution, it is removed from the stack.

Since JavaScript has only **one Call Stack**, it can execute only one function at a time.

#### Responsibilities

- Executes synchronous JavaScript code.
- Maintains the execution order of functions.
- Keeps track of the currently executing function.

> 💡 The Call Stack only executes JavaScript code. It does not perform asynchronous operations.

---

### ⚙️ 2. Web APIs (Browser) / Node.js APIs

Some operations take time to complete, such as:

- API requests
- Timers
- File operations
- User events

Instead of blocking the Call Stack, JavaScript delegates these tasks to the Runtime Environment.

In browsers, these features are provided by **Web APIs**.

Examples include:

- `setTimeout()`
- `fetch()`
- DOM Events
- `requestAnimationFrame()`

In Node.js, similar functionality is provided by **Node.js APIs** and the **libuv** library.

These APIs perform the asynchronous work in the background and notify JavaScript once the operation has completed.

---

### ⚙️ 3. Callback Queue (Task Queue)

The **Callback Queue**, also called the **Task Queue** or **Macrotask Queue**, stores callbacks whose asynchronous operations have completed.

Examples include callbacks from:

- `setTimeout()`
- `setInterval()`
- DOM Events
- Message events

These callbacks do **not** execute immediately.

They wait until:

- The Call Stack is empty.
- The Microtask Queue has been completely processed.

Only then does the Event Loop move the next callback to the Call Stack.

---

### ⚙️ 4. Microtask Queue

The **Microtask Queue** stores high-priority asynchronous callbacks.

Common examples include:

- Promise callbacks (`.then()`, `.catch()`, `.finally()`)
- `queueMicrotask()`
- Continuation of `async/await`

Unlike the Callback Queue, the Microtask Queue has **higher priority**.

Whenever the Call Stack becomes empty, the Event Loop processes **all Microtasks** before executing even a single Callback Queue task.

This behavior makes Promises execute before timers.

---

### ⚙️ 5. Event Loop

The **Event Loop** acts as the coordinator of the entire architecture.

It continuously performs three main tasks:

1. Checks whether the Call Stack is empty.
2. Processes all pending Microtasks.
3. Processes the next Callback Queue task.

This cycle repeats continuously while the JavaScript application is running.

The Event Loop itself does **not** execute code.

Instead, it decides **when** callbacks should be moved to the Call Stack.

---

### 🌍 Real-World Example

Imagine a customer support office.

| Office Component | Event Loop Component |
|------------------|----------------------|
| Employee working on tasks | Call Stack |
| Other departments | Web APIs / Node.js APIs |
| Urgent task tray | Microtask Queue |
| Normal task tray | Callback Queue |
| Office Manager | Event Loop |

The employee can only work on one task at a time.

While another department processes requests, the employee continues working.

When the employee finishes the current task:

- The manager first checks the **urgent tray** (Microtasks).
- After all urgent tasks are completed, the manager assigns tasks from the **normal tray** (Callback Queue).

This ensures high-priority work is completed before regular tasks.

---

### 🎤 Interview Answer

The Event Loop architecture consists of five main components: the Call Stack, Web APIs (or Node.js APIs), the Callback Queue, the Microtask Queue, and the Event Loop itself. The Call Stack executes JavaScript code, while the Runtime Environment handles asynchronous operations. Once those operations complete, their callbacks are placed into either the Microtask Queue or the Callback Queue. The Event Loop continuously checks whether the Call Stack is empty, processes all Microtasks first, and then executes Callback Queue tasks. This architecture enables JavaScript to perform asynchronous operations while remaining single-threaded.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- How does the Event Loop decide which queue to process first?
- What is the difference between the Callback Queue and the Microtask Queue?
- Why are Promise callbacks executed before `setTimeout()` callbacks?
- What is a Macrotask?
- What happens if the Microtask Queue never becomes empty?

---

## 3. What is the execution order of synchronous and asynchronous code, and how does the Event Loop process tasks?

### 📖 Overview

JavaScript follows a **specific execution order** to ensure code runs predictably. It always executes **synchronous code first**, while asynchronous operations are delegated to the Runtime Environment.

Once the synchronous code has finished executing and the **Call Stack becomes empty**, the Event Loop begins processing asynchronous callbacks.

However, not all asynchronous callbacks are treated equally. The Event Loop always gives **higher priority to the Microtask Queue** before processing the Callback Queue (Macrotask Queue).

Understanding this execution order is essential for predicting how JavaScript programs behave.

---

### 🎯 Execution Order

The Event Loop follows this order during execution:

1. Execute all synchronous code.
2. Delegate asynchronous operations to the Runtime Environment.
3. Continue executing remaining synchronous code.
4. Wait until the Call Stack becomes empty.
5. Execute **all Microtasks**.
6. Execute **one Callback Queue (Macrotask)** task.
7. Repeat the process.

A simplified flow looks like this:

```
Synchronous Code
        ↓
Call Stack Becomes Empty
        ↓
Execute All Microtasks
        ↓
Execute One Macrotask
        ↓
Check Microtasks Again
        ↓
Repeat
```

---

### ⚙️ How Does the Event Loop Process Tasks?

The Event Loop continuously monitors the Call Stack.

#### Step 1: Execute Synchronous Code

All synchronous statements execute immediately.

Example:

```js
console.log("A");
console.log("B");
console.log("C");
```

Execution order:

```
A
B
C
```

Since these are synchronous statements, they execute one after another without interruption.

---

#### Step 2: Handle Asynchronous Operations

When JavaScript encounters an asynchronous operation, it does **not** wait for it to complete.

Instead, it hands the operation to the Runtime Environment.

For example:

- `setTimeout()`
- `fetch()`
- DOM Events
- File operations (Node.js)

The Runtime Environment performs these operations independently while JavaScript continues executing the remaining code.

---

#### Step 3: Wait for the Call Stack to Become Empty

Even if an asynchronous operation finishes quickly, its callback cannot execute immediately.

The Event Loop waits until:

- The current function finishes.
- All synchronous code completes.
- The Call Stack becomes empty.

Only then can asynchronous callbacks be scheduled.

---

#### Step 4: Execute Microtasks

Once the Call Stack is empty, the Event Loop first checks the **Microtask Queue**.

If there are pending Microtasks, it executes **every Microtask** before moving to the Callback Queue.

Examples of Microtasks include:

- Promise callbacks (`.then()`, `.catch()`, `.finally()`)
- `queueMicrotask()`
- Continuation of `async/await`

---

#### Step 5: Execute Callback Queue Tasks

After the Microtask Queue is completely empty, the Event Loop processes the next task from the Callback Queue.

Common Callback Queue tasks include:

- `setTimeout()`
- `setInterval()`
- DOM Events
- Message events

Only **one Callback Queue task** is executed during each Event Loop iteration. After that task completes, the Event Loop checks the Microtask Queue again before processing the next Callback Queue task.

---

### 💡 Why Are Microtasks Executed First?

Microtasks usually represent work that should happen **immediately after the current JavaScript execution finishes**.

For example:

- Updating Promise results.
- Continuing an `async` function after an `await`.
- Running small follow-up tasks.

Giving Microtasks higher priority ensures that related asynchronous work completes before moving on to less urgent tasks like timers or user events.

We'll explore this behavior in detail later in the chapter.

---

### 🌍 Real-World Example

Imagine you're working at your office.

You first finish your **current task** before accepting new work.

Once you're free:

1. You complete all **urgent tasks** waiting on your desk.
2. After all urgent tasks are finished, you start working on the **regular task queue**.

In this analogy:

| Office | JavaScript |
|---------|------------|
| Current work | Synchronous Code |
| Urgent tasks | Microtask Queue |
| Regular tasks | Callback Queue |
| You deciding what to do next | Event Loop |

This priority system ensures important follow-up work is completed before less urgent tasks.

---

### 🎤 Interview Answer

JavaScript always executes synchronous code first using the Call Stack. Asynchronous operations are delegated to the Runtime Environment, allowing JavaScript to continue executing other code. Once the Call Stack becomes empty, the Event Loop first executes all pending Microtasks, such as Promise callbacks and `async/await` continuations. After the Microtask Queue is empty, it executes one Callback Queue (Macrotask) task, such as a `setTimeout()` callback. This cycle repeats continuously, ensuring predictable execution while keeping applications responsive.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- Why are Promise callbacks executed before `setTimeout()` callbacks?
- What is the difference between the Microtask Queue and the Callback Queue?
- What happens if the Microtask Queue never becomes empty?
- Why doesn't `setTimeout(fn, 0)` execute immediately?
- How does the Event Loop know when the Call Stack is empty?

---

## 4. Explain the complete flow of asynchronous JavaScript execution.

### 📖 Overview

Asynchronous JavaScript execution is a process that allows JavaScript to perform time-consuming operations **without blocking the execution of other code**.

Although JavaScript is **single-threaded**, it can handle multiple asynchronous operations efficiently because it works together with the **Runtime Environment** (Browser or Node.js).

The complete execution flow involves several components working together:

1. Call Stack
2. Runtime Environment (Web APIs / Node.js APIs)
3. Microtask Queue
4. Callback Queue (Macrotask Queue)
5. Event Loop

Understanding this complete flow is one of the most important concepts in JavaScript because almost every asynchronous feature—including **Promises**, **async/await**, **fetch()**, and **setTimeout()**—follows this architecture.

---

### ⚙️ Complete Execution Flow

The asynchronous execution flow can be divided into seven steps.

#### Step 1: JavaScript Starts Executing Synchronous Code

When a JavaScript program starts, all synchronous code is pushed onto the **Call Stack** and executed one statement at a time.

Example:

```js
console.log("Start");
```

Since this is synchronous code, it executes immediately.

---

#### Step 2: Asynchronous Operations Are Delegated

When JavaScript encounters an asynchronous operation, it does **not** execute it itself.

Instead, it delegates the operation to the **Runtime Environment**.

Some examples include:

- `setTimeout()`
- `fetch()`
- DOM Events
- File System operations (Node.js)
- Network requests

The Runtime Environment performs these operations independently while JavaScript continues executing the remaining code.

> 💡 **Note**
>
> JavaScript never pauses the Call Stack to wait for these operations to complete.

---

#### Step 3: JavaScript Continues Executing Remaining Code

After delegating the asynchronous operation, JavaScript immediately moves to the next statement.

For example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 1000);

console.log("End");
```

Execution order at this stage is:

```
Start
End
```

The timer is still running in the Runtime Environment.

---

#### Step 4: The Runtime Environment Completes the Operation

Once the asynchronous operation finishes:

- A timer expires.
- An API response arrives.
- A user clicks a button.
- A file has been read.

The Runtime Environment prepares the callback for execution.

However, the callback still **does not execute immediately**.

Instead, it is placed into an appropriate queue.

Depending on the operation, it may enter:

- **Microtask Queue**
- **Callback Queue (Macrotask Queue)**

---

#### Step 5: The Event Loop Waits for the Call Stack

The Event Loop continuously checks the Call Stack.

As long as JavaScript is still executing synchronous code, the Event Loop does nothing.

Only when the Call Stack becomes completely empty can asynchronous callbacks begin executing.

This prevents asynchronous callbacks from interrupting synchronous execution.

---

#### Step 6: The Event Loop Processes the Queues

Once the Call Stack is empty, the Event Loop follows a fixed priority:

1. Execute **all Microtasks**.
2. Execute **one Callback Queue (Macrotask)** task.
3. Check the Microtask Queue again.
4. Repeat the cycle.

This priority ensures that Promise-related work is completed before regular asynchronous callbacks like timers.

---

#### Step 7: The Callback Executes

Finally, the Event Loop moves the callback from the appropriate queue to the Call Stack.

JavaScript executes the callback just like any other function.

Once it finishes, it is removed from the Call Stack, and the Event Loop continues monitoring for the next task.

---

### 🏗️ Complete Architecture Flow

```
JavaScript Code
       │
       ▼
+----------------+
|   Call Stack   |
+----------------+
       │
       │ Asynchronous Operation
       ▼
+------------------------------+
| Runtime Environment          |
| (Web APIs / Node.js APIs)    |
+------------------------------+
       │
       ▼
+------------------------------+
| Microtask Queue              |
| Callback Queue               |
+------------------------------+
       │
       ▼
+----------------+
|   Event Loop   |
+----------------+
       │
       ▼
+----------------+
|   Call Stack   |
+----------------+
```

This cycle continues throughout the lifetime of the application.

---

### 🌍 Real-World Example

Imagine you're preparing dinner.

1. You start chopping vegetables.
2. You put rice in a rice cooker.
3. While the rice is cooking, you continue preparing the curry.
4. Once the rice is ready, the rice cooker notifies you.
5. After finishing your current work, you serve the rice.

In this analogy:

| Cooking Process | JavaScript |
|-----------------|------------|
| You | JavaScript Engine |
| Rice Cooker | Runtime Environment |
| Rice Cooking | Asynchronous Operation |
| Notification | Queue |
| Deciding when to serve | Event Loop |

You don't stand beside the rice cooker waiting. Similarly, JavaScript doesn't wait for asynchronous operations to finish.

---

### 🎤 Interview Answer

Asynchronous JavaScript execution begins when JavaScript encounters an asynchronous operation such as `setTimeout()` or `fetch()`. Instead of executing it on the Call Stack, JavaScript delegates it to the Runtime Environment. While that operation runs, JavaScript continues executing synchronous code. Once the operation completes, its callback is placed into either the Microtask Queue or the Callback Queue. The Event Loop waits until the Call Stack becomes empty, processes all Microtasks first, then executes one Callback Queue task. This cycle repeats continuously, allowing JavaScript to perform asynchronous operations without blocking the main thread.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What happens internally when `setTimeout()` is executed?
- What happens internally when `fetch()` is executed?
- Why are Promise callbacks placed in the Microtask Queue?
- Why are Microtasks processed before Macrotasks?
- How does `async/await` fit into this execution flow?

---

## 5. How does `setTimeout()` work internally, and why doesn't it execute exactly when its timer expires?

### 📖 Overview

`setTimeout()` is a **Web API** (in browsers) or a **Timer API** (in Node.js) that schedules a function to execute **after a minimum delay**.

A common misconception is that `setTimeout(fn, 1000)` guarantees the callback will execute **exactly after one second**.

This is **not true**.

The timer only specifies the **minimum amount of time** before the callback becomes eligible to execute. The actual execution depends on the state of the **Call Stack**, **Event Loop**, and **Callback Queue**.

---

### 🎯 Why Is It Needed?

Many applications need to execute code after a delay.

Common use cases include:

- Showing notifications after a few seconds.
- Debouncing user input.
- Retrying failed API requests.
- Delaying animations.
- Auto-closing alerts or modals.

Instead of blocking JavaScript with a waiting loop, `setTimeout()` allows the application to continue executing other code while waiting.

---

### ⚙️ How Does `setTimeout()` Work?

When JavaScript encounters a `setTimeout()` call, the following steps occur:

#### Step 1: JavaScript Executes `setTimeout()`

Example:

```js
setTimeout(() => {
  console.log("Hello");
}, 2000);
```

The `setTimeout()` function itself executes immediately on the Call Stack.

---

#### Step 2: The Timer Is Registered

JavaScript asks the Runtime Environment to start a timer for **2000 milliseconds**.

The callback function is **not** placed into the Callback Queue yet.

Instead, the Runtime Environment keeps track of the timer.

---

#### Step 3: JavaScript Continues Executing

While the timer is running, JavaScript continues executing the remaining synchronous code.

It does **not** wait for the timer to finish.

For example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 2000);

console.log("End");
```

Current output:

```text
Start
End
```

The timer is still counting in the background.

---

#### Step 4: The Timer Expires

Once the specified delay has passed, the timer finishes.

However, the callback still **does not execute immediately**.

Instead, it is placed into the **Callback Queue (Macrotask Queue)**.

---

#### Step 5: The Event Loop Waits

The Event Loop continuously checks whether the Call Stack is empty.

If JavaScript is still executing other code, the callback must wait inside the Callback Queue.

---

#### Step 6: The Callback Executes

Once:

- The Call Stack becomes empty, and
- All pending Microtasks have been processed,

the Event Loop moves the callback from the Callback Queue to the Call Stack.

Only then is the callback executed.

---

### 🏗️ Internal Working

The complete lifecycle of a `setTimeout()` callback looks like this:

```
setTimeout()
      │
      ▼
Runtime Environment Starts Timer
      │
      ▼
Timer Expires
      │
      ▼
Callback Queue
      │
      ▼
Event Loop Waits
      │
      ▼
Call Stack Becomes Empty
      │
      ▼
Execute Callback
```

This is why the callback is **scheduled**, not executed immediately after the timer expires.

---

### ❓ Why Doesn't `setTimeout(fn, 0)` Execute Immediately?

Many developers assume:

```js
setTimeout(fn, 0);
```

means "execute immediately."

It actually means:

> Execute the callback **after at least 0 milliseconds**, once JavaScript has finished its current work.

Even with a delay of `0`, the callback still has to:

1. Wait for synchronous code to finish.
2. Wait for the Call Stack to become empty.
3. Wait for all pending Microtasks to execute.

Only then can the callback run.

---

### ❓ Does `setTimeout()` Guarantee Exact Timing?

**No.**

The delay passed to `setTimeout()` is the **minimum delay**, not the exact execution time.

For example:

```js
setTimeout(() => {
  console.log("Hello");
}, 1000);
```

This means:

> "Execute this callback **no earlier than** 1000 milliseconds."

The callback may execute later depending on the application's current workload.

---

### ⏳ What Can Delay a `setTimeout()` Callback?

Several factors can delay execution:

- The Call Stack is busy executing synchronous code.
- There are many pending Microtasks.
- Other Callback Queue tasks are waiting.
- The browser throttles timers (for example, inactive tabs).
- Heavy CPU-intensive operations block the main thread.

Because of these factors, timers should be viewed as **scheduled callbacks**, not precise timers.

---

### 🌍 Real-World Example

Imagine you're baking a cake.

You set a kitchen timer for **30 minutes**.

When the timer rings, you don't instantly remove the cake from the oven if you're already busy serving guests.

Instead, you finish your current task first and then remove the cake.

Similarly:

- The timer finishing only means the callback is **ready**.
- The Event Loop decides **when it can actually execute**.

---

### 🎤 Interview Answer

`setTimeout()` schedules a callback to execute after a minimum delay. When JavaScript encounters `setTimeout()`, it registers a timer with the Runtime Environment and immediately continues executing other code. Once the timer expires, the callback is placed into the Callback Queue. It does not execute immediately because the Event Loop must first wait for the Call Stack to become empty and process all pending Microtasks. Only then is the callback moved to the Call Stack and executed. Therefore, `setTimeout()` guarantees a minimum delay, not an exact execution time.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- How does `fetch()` work internally?
- Why are Promise callbacks executed before `setTimeout()` callbacks?
- What is the difference between the Callback Queue and the Microtask Queue?
- What happens if the Call Stack is blocked for a long time?
- How does `setInterval()` differ from `setTimeout()`?

---

## 6. How does `fetch()` work internally in the Event Loop?

### 📖 Overview

`fetch()` is a modern JavaScript API used to make **HTTP requests** to a server. Unlike `setTimeout()`, which is based on timers, `fetch()` performs **network operations**.

A common misconception is that `fetch()` itself sends the network request.

In reality, JavaScript only **initiates** the request. The actual network communication is handled by the **Runtime Environment** (Browser or Node.js).

Another important point is that `fetch()` **immediately returns a Promise**, allowing JavaScript to continue executing other code without waiting for the server's response.

---

### 🎯 Why Is It Needed?

Modern web applications constantly communicate with servers.

Some common examples include:

- Fetching products from an e-commerce API.
- Logging in a user.
- Loading comments on a social media post.
- Retrieving weather information.
- Uploading files.

Since network requests may take milliseconds or even several seconds, JavaScript cannot afford to wait synchronously.

`fetch()` enables these operations to happen **asynchronously**, keeping the application responsive.

---

### ⚙️ How Does `fetch()` Work?

Let's understand the complete lifecycle.

#### Step 1: JavaScript Encounters `fetch()`

```js
fetch("/api/products");
```

When JavaScript executes this line:

- It calls the `fetch()` function.
- The Runtime Environment is asked to start a network request.
- A **Promise** is immediately returned.

At this point, JavaScript **does not wait** for the server's response.

---

#### Step 2: The Network Request Begins

The Runtime Environment handles:

- DNS lookup
- Establishing the connection
- Sending the HTTP request
- Waiting for the server's response
- Receiving the response

All of this happens **outside the Call Stack**.

Meanwhile, JavaScript continues executing the remaining code.

---

#### Step 3: JavaScript Continues Running

For example:

```js
console.log("Start");

fetch("/api/products");

console.log("End");
```

Current output:

```text
Start
End
```

Even if the server responds very quickly, JavaScript does not pause while waiting.

---

#### Step 4: The Server Responds

Once the response is received:

- The Runtime Environment completes the network request.
- The Promise returned by `fetch()` is either:
  - **fulfilled** (successful response), or
  - **rejected** (network error).

However, JavaScript still doesn't execute your `.then()` callback immediately.

---

#### Step 5: Promise Callbacks Enter the Microtask Queue

When the Promise settles, callbacks such as:

```js
.then(...)
.catch(...)
.finally(...)
```

are placed into the **Microtask Queue**.

They are **not** placed into the Callback Queue.

This is why Promise callbacks have higher priority than timer callbacks.

---

#### Step 6: The Event Loop Executes the Callback

Once:

- The Call Stack is empty, and
- JavaScript finishes its current synchronous work,

the Event Loop processes the **Microtask Queue**.

Your `.then()` callback is moved to the Call Stack and executed.

---

### 🏗️ Internal Working

The complete lifecycle of `fetch()` looks like this:

```
fetch()
     │
     ▼
Returns Promise Immediately
     │
     ▼
Runtime Environment Starts Network Request
     │
     ▼
Server Sends Response
     │
     ▼
Promise Gets Resolved / Rejected
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
Execute .then() / .catch() Callback
```

Notice that the callback is executed **only after** the Promise settles and the Event Loop processes the Microtask Queue.

---

### 🌍 Real-World Example

Imagine you've ordered a product online.

1. You place the order.
2. The store starts preparing and shipping it.
3. While waiting, you continue with your daily activities.
4. Once the package arrives, the delivery company notifies you.
5. You receive the package when you're available.

Similarly:

| Shopping Process | JavaScript |
|------------------|------------|
| Placing an order | Calling `fetch()` |
| Store processing the order | Runtime Environment handling the network request |
| Delivery notification | Promise is fulfilled |
| Receiving the package | `.then()` callback executes |

You don't stop your entire day waiting for the delivery, just as JavaScript doesn't stop executing while waiting for an API response.

---

### 🎤 Interview Answer

`fetch()` is an asynchronous API used to make HTTP requests. When JavaScript calls `fetch()`, it immediately returns a Promise and delegates the network request to the Runtime Environment. JavaScript continues executing other code while the request is processed in the background. Once the server responds, the Promise is either fulfilled or rejected, and its callbacks are placed into the Microtask Queue. When the Call Stack becomes empty, the Event Loop processes the Microtask Queue and executes the appropriate callback.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- How do Promises work internally?
- Why are Promise callbacks placed in the Microtask Queue?
- Why do Promise callbacks execute before `setTimeout()` callbacks?
- What happens when an `await` statement is encountered?
- What is the difference between `fetch()` and `XMLHttpRequest()`?

---

## 7. How do Promises work internally, and why are Promise callbacks executed before timer callbacks?

### 📖 Overview

A **Promise** is a JavaScript object that represents the **eventual completion or failure of an asynchronous operation**.

Unlike `setTimeout()`, a Promise itself is **part of the JavaScript language (ECMAScript)**. However, the asynchronous operation associated with a Promise (such as a network request) is usually performed by the **Runtime Environment**.

One of the most important behaviors of Promises is that their callbacks (`.then()`, `.catch()`, and `.finally()`) are placed into the **Microtask Queue**, which has a higher priority than the Callback Queue. This is why Promise callbacks execute before timer callbacks.

---

### 🎯 Why Do We Need Promises?

Before Promises were introduced, asynchronous code was mainly written using callbacks.

For example:

```js
login(function () {
  getUser(function () {
    getOrders(function () {
      processPayment(function () {
        // ...
      });
    });
  });
});
```

This style quickly became difficult to read and maintain, often leading to **Callback Hell**.

Promises solve this problem by:

- Making asynchronous code easier to read.
- Supporting method chaining with `.then()`.
- Providing centralized error handling using `.catch()`.
- Serving as the foundation for `async/await`.

---

### ⚙️ How Do Promises Work Internally?

Let's understand the complete lifecycle of a Promise.

#### Step 1: A Promise Is Created

When a Promise is created, it starts in the **Pending** state.

```js
const promise = fetch("/api/products");
```

At this point:

- The asynchronous operation begins.
- JavaScript immediately receives a Promise object.
- The Promise is waiting for the operation to complete.

---

#### Step 2: The Asynchronous Operation Runs

The Runtime Environment performs the asynchronous work.

Examples include:

- Network requests
- File operations (Node.js)
- Database queries
- Other asynchronous APIs

While this happens, JavaScript continues executing the remaining code.

---

#### Step 3: The Promise Settles

Once the asynchronous operation finishes, the Promise changes its state.

A Promise can have only one final state.

| State | Meaning |
|--------|---------|
| **Pending** | Operation is still running. |
| **Fulfilled** | Operation completed successfully. |
| **Rejected** | Operation failed with an error. |

Once fulfilled or rejected, the Promise's state **cannot change again**.

---

#### Step 4: Promise Callbacks Enter the Microtask Queue

Suppose we have:

```js
fetch("/api/products")
  .then((response) => {
    console.log(response);
  });
```

When the Promise is fulfilled:

- The `.then()` callback is **not executed immediately**.
- Instead, it is placed into the **Microtask Queue**.

Similarly:

- `.catch()`
- `.finally()`

also enter the Microtask Queue.

---

#### Step 5: The Event Loop Processes the Microtask Queue

When the Call Stack becomes empty:

1. The Event Loop checks the Microtask Queue.
2. Every pending Microtask is executed.
3. Only after the Microtask Queue becomes empty does the Event Loop process the Callback Queue.

This priority is why Promise callbacks execute before timer callbacks.

---

### ❓ Why Do Promise Callbacks Execute Before `setTimeout()` Callbacks?

Consider the following code:

```js
setTimeout(() => {
  console.log("Timer");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});
```

Although the timer has a delay of `0`, the output is:

```text
Promise
Timer
```

This happens because:

- Promise callbacks are placed into the **Microtask Queue**.
- `setTimeout()` callbacks are placed into the **Callback Queue (Macrotask Queue)**.
- The Event Loop always processes **all Microtasks first**.
- Only after the Microtask Queue is empty does it execute Callback Queue tasks.

---

### 🏗️ Internal Working

The lifecycle of a Promise callback looks like this:

```
Promise Created
      │
      ▼
Asynchronous Operation Starts
      │
      ▼
Promise Gets Fulfilled / Rejected
      │
      ▼
.then() / .catch() / .finally()
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
Execute Callback
```

Notice that Promise callbacks never enter the Callback Queue.

---

### 🌍 Real-World Example

Imagine you've booked a cab using a ride-sharing app.

1. You request a ride.
2. The app searches for a nearby driver.
3. While waiting, you continue doing other things.
4. Once a driver accepts the ride, the app immediately updates your screen.

The update feels almost instantaneous because it is treated as a high-priority task.

Similarly:

| Ride Booking Process | JavaScript |
|----------------------|------------|
| Booking a ride | Creating a Promise |
| Searching for a driver | Asynchronous operation |
| Driver accepts | Promise is fulfilled |
| App updates the UI | `.then()` callback executes |

The Promise callback is processed before lower-priority tasks such as timers.

---

### 🎤 Interview Answer

A Promise represents the eventual result of an asynchronous operation. It starts in the Pending state and eventually becomes either Fulfilled or Rejected. When a Promise settles, its callbacks (`.then()`, `.catch()`, and `.finally()`) are placed into the Microtask Queue rather than the Callback Queue. The Event Loop always processes the Microtask Queue before the Callback Queue, which is why Promise callbacks execute before `setTimeout()` callbacks, even if the timer delay is `0`.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is the difference between the Microtask Queue and the Callback Queue?
- Why does the Event Loop process Microtasks first?
- What happens if the Microtask Queue never becomes empty?
- How does `async/await` work internally?
- What is `queueMicrotask()` and when should it be used?

---

## 8. What is the difference between the Callback Queue and the Microtask Queue, and why are Microtasks executed first?

### 📖 Overview

The **Callback Queue** and the **Microtask Queue** are two separate queues used by the JavaScript Runtime Environment to store asynchronous callbacks that are ready to execute.

Although both queues contain callbacks waiting for execution, they differ in **priority**.

The **Microtask Queue** has a **higher priority** than the Callback Queue. Whenever the **Call Stack becomes empty**, the Event Loop first executes **all pending Microtasks** before processing any Callback Queue (Macrotask) task.

This priority ensures that important follow-up work, such as Promise callbacks, completes before less urgent tasks like timers or user events.

---

### 🎯 Why Are There Two Queues?

Not all asynchronous tasks are equally important.

For example:

- A Promise resolving often represents the continuation of the current operation.
- A `setTimeout()` callback usually represents a separate task that can execute slightly later.

If both were treated the same, Promise chains could be interrupted by unrelated timer callbacks, leading to unpredictable behavior.

To solve this, the Runtime Environment separates callbacks into two queues:

- **Microtask Queue** → High priority
- **Callback Queue (Macrotask Queue)** → Normal priority

---

### ⚙️ What is the Callback Queue?

The **Callback Queue**, also known as the **Task Queue** or **Macrotask Queue**, stores callbacks from asynchronous operations that should execute after higher-priority work has finished.

Common examples include:

- `setTimeout()`
- `setInterval()`
- DOM events (click, scroll, etc.)
- `postMessage()`
- `MessageChannel`

Callbacks in this queue execute **one at a time**.

After each Callback Queue task completes, the Event Loop checks the Microtask Queue again before executing the next Callback Queue task.

---

### ⚙️ What is the Microtask Queue?

The **Microtask Queue** stores callbacks that should execute immediately after the current JavaScript execution finishes.

Common examples include:

- Promise `.then()`
- Promise `.catch()`
- Promise `.finally()`
- `queueMicrotask()`
- Continuation of `async/await`

Whenever the Event Loop starts processing the Microtask Queue, it continues until the queue becomes completely empty.

---

### ⚖️ Callback Queue vs Microtask Queue

| Feature | Callback Queue (Macrotask Queue) | Microtask Queue |
|---------|-----------------------------------|-----------------|
| Priority | Lower | Higher |
| Processed When | After Microtasks | Immediately after the Call Stack becomes empty |
| Processing | One task per Event Loop iteration | All pending tasks before moving to the Callback Queue |
| Common Sources | `setTimeout()`, `setInterval()`, DOM Events | Promises, `queueMicrotask()`, `async/await` |

---

### ❓ Why Are Microtasks Executed First?

Imagine the following code:

```js
setTimeout(() => {
  console.log("Timer");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});
```

Even though the timer delay is `0`, the output is:

```text
Promise
Timer
```

This happens because the Event Loop follows this order:

1. Finish synchronous code.
2. Execute **all Microtasks**.
3. Execute one Callback Queue task.
4. Repeat.

Promises represent the continuation of the current asynchronous operation, so JavaScript gives them higher priority to keep the execution flow predictable.

---

### 🏗️ Execution Flow

The Event Loop processes tasks in the following order:

```
Call Stack
     │
     ▼
Is the Call Stack Empty?
     │
     ▼
Process All Microtasks
     │
     ▼
Execute One Callback Queue Task
     │
     ▼
Check Microtasks Again
     │
     ▼
Repeat
```

Notice that after every Callback Queue task, the Event Loop checks the Microtask Queue again before continuing.

---

### 🌍 Real-World Example

Imagine you're working in an office.

Two trays are placed on your desk:

- 🔴 **Urgent Tray**
- 🔵 **Regular Tray**

Whenever you finish your current task:

1. You first complete **every urgent task**.
2. Only after the urgent tray is empty do you pick one task from the regular tray.
3. Before picking the next regular task, you check the urgent tray again.

In this analogy:

| Office | JavaScript |
|---------|------------|
| Urgent Tray | Microtask Queue |
| Regular Tray | Callback Queue |
| Employee | Event Loop |

This ensures urgent follow-up work is never delayed by regular tasks.

---

### 💡 Note

A common misconception is that the Event Loop executes **all Callback Queue tasks** before checking the Microtask Queue again.

This is incorrect.

The Event Loop executes:

- **All pending Microtasks**
- **One Callback Queue task**
- **Checks the Microtask Queue again**

This cycle repeats continuously.

---

### 🎤 Interview Answer

The Callback Queue and the Microtask Queue are two separate queues used to store asynchronous callbacks. The Microtask Queue has higher priority and contains callbacks from Promises, `queueMicrotask()`, and `async/await`, while the Callback Queue contains callbacks from APIs like `setTimeout()`, `setInterval()`, and DOM events. Whenever the Call Stack becomes empty, the Event Loop first executes all pending Microtasks before executing one Callback Queue task. This priority ensures that Promise-related work completes before lower-priority asynchronous tasks.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is Microtask Starvation?
- What happens if the Microtask Queue never becomes empty?
- How does `queueMicrotask()` work?
- Why are Promise callbacks placed in the Microtask Queue?
- How does `async/await` use the Microtask Queue?

---

## 9. What is Microtask Starvation, why does it happen, and how can it affect application performance?

### 📖 Overview

**Microtask Starvation** is a situation where the **Microtask Queue never becomes empty**, preventing the Event Loop from processing other tasks such as timers, user events, rendering, or animations.

Since the Event Loop always processes **all Microtasks before moving to the Callback Queue**, continuously adding new Microtasks can keep the Event Loop busy indefinitely.

As a result, the application may appear frozen or unresponsive even though JavaScript is still actively executing code.

---

### 🎯 Why Does It Happen?

The Event Loop follows a strict rule:

1. Wait for the Call Stack to become empty.
2. Execute **all Microtasks**.
3. Execute **one Callback Queue (Macrotask)** task.

The important point is that while processing Microtasks, **new Microtasks can create more Microtasks**.

If this continues indefinitely, the Microtask Queue never becomes empty, and the Event Loop never gets a chance to process Callback Queue tasks.

This situation is called **Microtask Starvation**.

---

### ⚙️ How Can It Happen?

Consider the following example:

```js
function keepRunning() {
  queueMicrotask(keepRunning);
}

queueMicrotask(keepRunning);

setTimeout(() => {
  console.log("Timer");
}, 0);
```

Here's what happens:

1. `keepRunning` is added to the Microtask Queue.
2. The Event Loop executes it.
3. During execution, it schedules another Microtask.
4. The Event Loop executes the new Microtask.
5. That Microtask schedules another one.
6. This process continues forever.

Since the Microtask Queue never becomes empty, the `setTimeout()` callback never gets a chance to execute.

---

### 🏗️ Internal Working

The execution flow looks like this:

```
Microtask Queue
      │
      ▼
Execute Microtask
      │
      ▼
Creates Another Microtask
      │
      ▼
Execute New Microtask
      │
      ▼
Creates Another Microtask
      │
      ▼
...
```

The Event Loop never reaches the Callback Queue because it must completely empty the Microtask Queue first.

---

### ⚠️ How Does It Affect Application Performance?

Microtask Starvation can cause several problems:

- Timers stop executing.
- Button click events are delayed.
- Animations become choppy.
- Rendering is delayed.
- UI appears frozen.
- Network response handlers may be delayed.
- Overall application responsiveness decreases.

Although the JavaScript thread is busy, the user experiences the application as if it has stopped responding.

---

### 🌍 Real-World Example

Imagine a manager reviewing urgent documents.

Every time they finish one urgent document, another urgent document is immediately placed on top of the pile.

As a result:

- The urgent pile never becomes empty.
- Regular tasks remain untouched.
- Meetings get delayed.
- Customer requests aren't handled.
- Work starts piling up.

In this analogy:

| Office | JavaScript |
|---------|------------|
| Urgent documents | Microtasks |
| Regular documents | Callback Queue tasks |
| Manager | Event Loop |

Because the manager is constantly handling urgent work, there's never time for regular work.

---

### ✅ How Can We Prevent Microtask Starvation?

Some best practices include:

- Avoid recursively scheduling Microtasks without a stopping condition.
- Break large pieces of work into smaller tasks.
- Use `setTimeout()` or other scheduling techniques to give the Event Loop a chance to process other tasks.
- Avoid long-running synchronous operations inside Microtasks.
- Use `requestAnimationFrame()` for animation-related work instead of continuously scheduling Microtasks.

By allowing the Event Loop to process other queues, the application remains responsive.

---

### 💡 Note

Microtask Starvation is relatively uncommon in everyday development, but it can occur accidentally when:

- Recursively calling `queueMicrotask()`
- Creating infinite Promise chains
- Misusing `async/await`
- Writing custom scheduling libraries

Understanding this concept helps explain why some applications become unresponsive even without an infinite loop in synchronous code.

---

### 🎤 Interview Answer

Microtask Starvation occurs when the Microtask Queue never becomes empty because Microtasks continuously create new Microtasks. Since the Event Loop always processes all Microtasks before moving to the Callback Queue, timers, rendering, and user events may never get a chance to execute. This can make an application appear frozen or unresponsive. It can be avoided by preventing infinite Microtask chains and breaking long-running work into smaller tasks that allow the Event Loop to process other queues.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- How does `queueMicrotask()` work?
- How does `requestAnimationFrame()` fit into the Event Loop?
- What happens if the Call Stack is busy for a long time?
- Why does the browser become unresponsive during long-running JavaScript?
- How does rendering fit into the Event Loop?

---

## 10. How do `queueMicrotask()`, `setInterval()`, and `requestAnimationFrame()` work internally, and when should each be used?

### 📖 Overview

`queueMicrotask()`, `setInterval()`, and `requestAnimationFrame()` are three APIs used to schedule code execution, but they serve **different purposes** and execute at **different stages of the Event Loop**.

- **`queueMicrotask()`** schedules a **Microtask**, which executes immediately after the current synchronous code finishes.
- **`setInterval()`** repeatedly schedules callbacks at a specified interval using the **Callback Queue (Macrotask Queue)**.
- **`requestAnimationFrame()`** schedules a callback just **before the browser's next repaint**, making it ideal for animations.

Choosing the right API is important for writing performant and responsive applications.

---

### ⚙️ 1. How does `queueMicrotask()` work?

`queueMicrotask()` schedules a callback in the **Microtask Queue**.

```js
console.log("Start");

queueMicrotask(() => {
  console.log("Microtask");
});

console.log("End");
```

Execution order:

```text
Start
End
Microtask
```

#### Internal Working

1. JavaScript executes `queueMicrotask()`.
2. The callback is added to the **Microtask Queue**.
3. JavaScript continues executing the remaining synchronous code.
4. Once the Call Stack becomes empty, the Event Loop processes the Microtask Queue.
5. The callback executes.

```
queueMicrotask()
        │
        ▼
Microtask Queue
        │
        ▼
Event Loop
        │
        ▼
Call Stack
```

#### When Should You Use It?

Use `queueMicrotask()` when you want to:

- Schedule small follow-up work.
- Execute code immediately after the current synchronous execution.
- Maintain the correct execution order without waiting for a timer.

> 💡 It should only be used for lightweight operations. Scheduling too many Microtasks can lead to **Microtask Starvation**.

---

### ⚙️ 2. How does `setInterval()` work?

`setInterval()` repeatedly executes a callback after a specified interval.

```js
setInterval(() => {
  console.log("Running...");
}, 1000);
```

Unlike `setTimeout()`, which executes only once, `setInterval()` continues running until it is cleared.

#### Internal Working

1. JavaScript registers the interval with the Runtime Environment.
2. A timer starts.
3. Every time the interval expires, the callback is placed into the **Callback Queue**.
4. The Event Loop executes the callback when:
   - The Call Stack is empty.
   - All pending Microtasks have been processed.
5. The Runtime Environment automatically starts the next interval.

```
setInterval()
      │
      ▼
Runtime Environment
      │
      ▼
Timer Expires
      │
      ▼
Callback Queue
      │
      ▼
Event Loop
      │
      ▼
Call Stack
```

#### Important Note

If the callback takes longer than the specified interval, the next execution is delayed.

This means `setInterval()` **does not guarantee perfectly consistent timing**.

#### When Should You Use It?

Common use cases include:

- Updating a clock.
- Polling a server.
- Refreshing dashboard data.
- Running periodic background tasks.

---

### ⚙️ 3. How does `requestAnimationFrame()` work?

`requestAnimationFrame()` is designed specifically for **animations and visual updates** in the browser.

Instead of executing after a fixed delay, it asks the browser:

> "Run this callback just before the next screen repaint."

```js
requestAnimationFrame(() => {
  // Update animation
});
```

This allows the browser to synchronize JavaScript with its rendering cycle, producing smoother animations.

#### Internal Working

1. JavaScript calls `requestAnimationFrame()`.
2. The browser stores the callback.
3. Before the next repaint, the browser invokes the callback.
4. Inside the callback, the application updates the UI.
5. The browser repaints the screen.

For continuous animations, the callback usually schedules another `requestAnimationFrame()`.

```
requestAnimationFrame()
           │
           ▼
Browser Waits for Next Frame
           │
           ▼
Execute Callback
           │
           ▼
Browser Repaints Screen
```

#### When Should You Use It?

Use `requestAnimationFrame()` for:

- Animations
- Games
- Smooth scrolling
- Canvas rendering
- Visual transitions

It is generally a better choice than `setTimeout()` for animations because it is synchronized with the browser's rendering process.

---

### ⚖️ Comparison

| Feature | `queueMicrotask()` | `setInterval()` | `requestAnimationFrame()` |
|---------|--------------------|-----------------|---------------------------|
| Queue | Microtask Queue | Callback Queue | Browser Rendering Cycle |
| Executes | Immediately after current code | Repeatedly after an interval | Before the next repaint |
| Repeats | ❌ No | ✅ Yes | ❌ No (must schedule again) |
| Primary Use | Small follow-up tasks | Periodic tasks | Animations and UI updates |

---

### 🌍 Real-World Example

Imagine you're organizing an event.

- **`queueMicrotask()`** is like handling an urgent note **immediately after finishing your current conversation**.
- **`setInterval()`** is like ringing a bell **every hour** to remind everyone of the schedule.
- **`requestAnimationFrame()`** is like adjusting the stage lights **just before the audience sees the next scene**, ensuring everything looks smooth.

Each serves a different purpose, even though all three involve scheduling future work.

---

### 🎤 Interview Answer

`queueMicrotask()`, `setInterval()`, and `requestAnimationFrame()` are scheduling APIs with different responsibilities. `queueMicrotask()` places a callback into the Microtask Queue, allowing it to execute immediately after the current synchronous code. `setInterval()` repeatedly schedules callbacks using the Callback Queue at a specified interval, although the actual execution depends on the Event Loop. `requestAnimationFrame()` schedules a callback just before the browser's next repaint, making it the preferred API for animations and visual updates because it synchronizes with the browser's rendering cycle.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What happens if the Call Stack is busy for a long time?
- How does rendering fit into the Event Loop?
- Why is `requestAnimationFrame()` better than `setTimeout()` for animations?
- What is the difference between `setTimeout()` and `setInterval()`?
- Can `queueMicrotask()` cause Microtask Starvation?

---

## 11. What happens when the Call Stack is busy for a long time, and how does it affect asynchronous operations?

### 📖 Overview

The **Call Stack** is where JavaScript executes all synchronous code. Since JavaScript is **single-threaded**, it can execute only one function at a time.

If the Call Stack remains busy for a long time—for example, because of a heavy calculation or an infinite loop—the **Event Loop cannot process any asynchronous callbacks**.

This means that even if asynchronous operations have already completed, their callbacks must wait until the Call Stack becomes empty.

As a result, the application may become slow, unresponsive, or even appear frozen.

---

### 🎯 Why Does This Happen?

The Event Loop follows one important rule:

> It can move a callback to the Call Stack **only when the Call Stack is empty**.

As long as JavaScript is executing synchronous code, the Event Loop cannot interrupt it.

This behavior ensures predictable execution, but it also means that long-running synchronous tasks block everything else.

---

### ⚙️ What Happens Internally?

Let's understand the complete flow.

#### Step 1: JavaScript Starts Executing

Suppose JavaScript encounters a heavy computation.

```js
console.log("Start");

while (true) {
  // Infinite loop
}

console.log("End");
```

The `while` loop occupies the Call Stack indefinitely.

---

#### Step 2: Asynchronous Operations Continue in the Background

While the Call Stack is busy, the Runtime Environment can still complete asynchronous operations such as:

- Timers
- API requests
- User events
- File operations (Node.js)

However, their callbacks **cannot execute yet**.

Instead, they wait in their respective queues.

---

#### Step 3: The Event Loop Waits

Even if a timer expires or an API response arrives, the Event Loop cannot move the callback to the Call Stack because it is still occupied.

For example:

```js
setTimeout(() => {
  console.log("Timer");
}, 1000);

while (true) {
  // Infinite loop
}
```

Although the timer expires after one second, `"Timer"` is never printed because the Call Stack never becomes empty.

---

#### Step 4: Callbacks Remain Waiting

Depending on the type of asynchronous operation:

- Promise callbacks wait in the **Microtask Queue**.
- Timer callbacks wait in the **Callback Queue**.

Neither queue can be processed until JavaScript finishes its current synchronous work.

---

#### Step 5: The Call Stack Becomes Empty

If the synchronous task eventually finishes:

1. The Call Stack becomes empty.
2. The Event Loop processes all pending Microtasks.
3. It then executes Callback Queue tasks.

If the synchronous task **never finishes** (for example, due to an infinite loop), asynchronous callbacks never execute.

---

### 🏗️ Internal Working

```
Heavy Synchronous Task
          │
          ▼
     Call Stack Busy
          │
          ▼
Asynchronous Operations Complete
          │
          ▼
Callbacks Wait in Queues
          │
          ▼
Event Loop Cannot Proceed
          │
          ▼
Call Stack Becomes Empty?
      │             │
     Yes            No
      │             │
      ▼             ▼
Execute Callbacks  Keep Waiting
```

---

### ⚠️ How Does It Affect the Application?

A busy Call Stack can cause several issues:

- Timers are delayed.
- API responses are processed late.
- Button clicks don't respond immediately.
- Animations become choppy.
- Rendering is delayed.
- Scrolling becomes laggy.
- The browser may display a **"Page is unresponsive"** warning.

Even though asynchronous operations may have completed successfully, users cannot see their results until JavaScript finishes its current work.

---

### 🌍 Real-World Example

Imagine a receptionist who handles all visitors.

While the receptionist is helping one customer with a complicated issue, other visitors continue arriving.

The visitors line up at the reception desk, but no one can be served until the receptionist finishes the current customer.

In this analogy:

| Reception Office | JavaScript |
|------------------|------------|
| Receptionist | Call Stack |
| Waiting visitors | Microtask Queue & Callback Queue |
| Office manager | Event Loop |

The manager cannot assign the next visitor until the receptionist is free.

Similarly, the Event Loop cannot schedule the next callback until the Call Stack becomes empty.

---

### 💡 Note

A common misconception is that asynchronous operations make JavaScript "multi-threaded."

This is incorrect.

The Runtime Environment may perform asynchronous work in the background, but **JavaScript still executes callbacks on a single Call Stack**.

No asynchronous callback can interrupt synchronous JavaScript execution.

---

### 🎤 Interview Answer

When the Call Stack is busy for a long time, the Event Loop cannot schedule any asynchronous callbacks because it can only move callbacks to the Call Stack when it becomes empty. Although the Runtime Environment may complete timers, API requests, or other asynchronous operations, their callbacks remain waiting in the Microtask Queue or Callback Queue. This can delay timers, API responses, rendering, and user interactions, making the application appear slow or unresponsive. If the Call Stack never becomes empty, such as with an infinite loop, asynchronous callbacks never execute.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- How does the Event Loop schedule tasks internally?
- How does `async/await` work internally?
- Why does the browser become unresponsive during heavy JavaScript execution?
- How can long-running JavaScript tasks be optimized?
- What is the difference between blocking and non-blocking code?

---

## 12. How does the Event Loop schedule tasks internally, and how does it interact with the Call Stack?

### 📖 Overview

The **Event Loop** is a mechanism in the JavaScript Runtime Environment that continuously checks whether the **Call Stack** is free and decides **which task should execute next**.

It does **not execute code itself**. Instead, it acts as a scheduler that moves ready callbacks from different queues to the Call Stack.

Its primary responsibility is to ensure that:

- Synchronous code executes first.
- Microtasks are executed before Macrotasks.
- Asynchronous callbacks run only when the Call Stack is available.
- JavaScript remains responsive while handling asynchronous operations.

---

### 🎯 Why Is Task Scheduling Needed?

JavaScript is **single-threaded**, meaning it has only one Call Stack.

However, modern applications handle many asynchronous operations simultaneously, such as:

- API requests
- Timers
- User interactions
- File operations (Node.js)
- Promise callbacks

Without a scheduler, JavaScript would not know:

- Which callback should execute first.
- When it is safe to execute a callback.
- How to maintain a predictable execution order.

The Event Loop solves this problem by coordinating the execution of all these tasks.

---

### ⚙️ How Does the Event Loop Schedule Tasks?

The Event Loop continuously repeats a cycle. During each cycle, it follows a specific order.

#### Step 1: Execute Synchronous Code

JavaScript first executes all synchronous code on the Call Stack.

```js
console.log("A");
console.log("B");
```

Until this code finishes, the Event Loop does nothing.

---

#### Step 2: Wait for the Call Stack to Become Empty

The Event Loop constantly checks whether the Call Stack is empty.

```
Call Stack
──────────────
main()
console.log()
```

As long as the Call Stack contains functions, no asynchronous callback can be executed.

---

#### Step 3: Process the Microtask Queue

Once the Call Stack becomes empty, the Event Loop checks the **Microtask Queue** first.

It executes **every pending Microtask**, including:

- Promise `.then()`
- Promise `.catch()`
- Promise `.finally()`
- `queueMicrotask()`
- Continuation of `async/await`

If a Microtask creates another Microtask, the Event Loop continues processing until the queue becomes completely empty.

---

#### Step 4: Execute One Callback Queue (Macrotask) Task

After the Microtask Queue is empty, the Event Loop picks **one** callback from the Callback Queue.

Examples include:

- `setTimeout()`
- `setInterval()`
- DOM events
- Message events

The selected callback is moved to the Call Stack and executed.

---

#### Step 5: Repeat the Process

After the Callback Queue task finishes:

1. The Call Stack becomes empty again.
2. The Event Loop checks the Microtask Queue.
3. It processes all Microtasks.
4. It executes the next Callback Queue task.
5. The cycle repeats continuously.

---

### 🏗️ Internal Scheduling Flow

The Event Loop repeatedly performs the following cycle:

```
                 Start
                   │
                   ▼
        Is Call Stack Empty?
              │        │
             No       Yes
              │        │
              ▼        ▼
         Keep Waiting  Process All Microtasks
                           │
                           ▼
               Execute One Callback Queue Task
                           │
                           ▼
                     Repeat Forever
```

This scheduling strategy ensures a predictable execution order.

---

### 🌍 Example

Consider the following code:

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

Execution flow:

1. `"Start"` is printed.
2. `setTimeout()` registers a timer.
3. Promise callback is registered.
4. `"End"` is printed.
5. The Call Stack becomes empty.
6. The Event Loop processes the Microtask Queue.
7. `"Promise"` is printed.
8. The Event Loop processes one Callback Queue task.
9. `"Timer"` is printed.

Output:

```text
Start
End
Promise
Timer
```

---

### ⚠️ Important Rules Followed by the Event Loop

The Event Loop always follows these rules:

- It never interrupts synchronous JavaScript execution.
- It only schedules callbacks when the Call Stack is empty.
- It always processes the entire Microtask Queue before the Callback Queue.
- It executes only one Callback Queue task per iteration.
- After every Callback Queue task, it checks the Microtask Queue again.

These rules ensure consistent and predictable behavior across JavaScript applications.

---

### 🌍 Real-World Example

Imagine an airport with a single runway.

- The **runway** represents the **Call Stack**.
- The **air traffic controller** represents the **Event Loop**.
- **Priority aircraft** represent **Microtasks**.
- **Regular aircraft** represent **Callback Queue tasks**.

The controller follows these rules:

1. Wait until the runway is clear.
2. Allow all priority aircraft to land first.
3. Allow one regular aircraft to land.
4. Check if any new priority aircraft have arrived.
5. Repeat.

This keeps airport operations organized and predictable.

---

### 🎤 Interview Answer

The Event Loop is a scheduler in the JavaScript Runtime Environment that coordinates the execution of asynchronous callbacks. It continuously checks whether the Call Stack is empty. Once it is, the Event Loop first processes all pending Microtasks, such as Promise callbacks and `queueMicrotask()`. After the Microtask Queue is empty, it executes one Callback Queue (Macrotask) task, such as a `setTimeout()` callback or a DOM event. This cycle repeats continuously, ensuring that synchronous code finishes first and asynchronous tasks execute in a consistent order.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- How does `async/await` work internally?
- What is the difference between the Browser Event Loop and the Node.js Event Loop?
- Why are Microtasks processed before Macrotasks?
- What happens if the Microtask Queue never becomes empty?
- How does rendering fit into the Event Loop?

---

## 13. How does `async/await` work internally, and how does `await` pause execution without blocking the thread?

### 📖 Overview

`async/await` is syntactic sugar built on top of **Promises**. It provides a cleaner and more readable way to write asynchronous code without changing how JavaScript works internally.

Although `await` appears to pause execution like synchronous code, it **does not block the JavaScript thread**. Instead, it pauses only the execution of the current `async` function, allowing the Event Loop to continue processing other tasks.

Behind the scenes, `async/await` uses **Promises**, the **Microtask Queue**, and the **Event Loop**.

---

### 🎯 Why Do We Need `async/await`?

Before `async/await`, asynchronous code was commonly written using Promise chains.

Example:

```js
fetchUser()
  .then(user => fetchOrders(user.id))
  .then(orders => processOrders(orders))
  .catch(error => console.error(error));
```

While this works well, long Promise chains can become difficult to read and maintain.

Using `async/await`, the same logic looks more like synchronous code:

```js
async function getOrders() {
  try {
    const user = await fetchUser();
    const orders = await fetchOrders(user.id);

    console.log(orders);
  } catch (error) {
    console.error(error);
  }
}
```

This improves readability while preserving the asynchronous behavior.

---

### ⚙️ How Does `async` Work?

When a function is declared with the `async` keyword:

```js
async function greet() {
  return "Hello";
}
```

JavaScript automatically wraps the returned value inside a Promise.

The above code is internally similar to:

```js
function greet() {
  return Promise.resolve("Hello");
}
```

Therefore, every `async` function **always returns a Promise**.

---

### ⚙️ How Does `await` Work Internally?

The `await` keyword can only be used inside an `async` function.

Consider the following example:

```js
async function getData() {
  console.log("1");

  const data = await fetch("/api/users");

  console.log("2");
}
```

Let's understand what happens internally.

---

#### Step 1: The `async` Function Starts

The function begins executing like a normal function.

```js
console.log("1");
```

The Call Stack executes this synchronously.

---

#### Step 2: JavaScript Encounters `await`

```js
await fetch("/api/users");
```

At this point:

- `fetch()` starts the asynchronous request.
- A Promise is returned immediately.
- JavaScript checks whether the Promise has settled.

Since the request is still running, JavaScript cannot continue executing the remaining statements.

---

#### Step 3: The `async` Function Is Suspended

Instead of blocking the thread:

- JavaScript **pauses only the current `async` function**.
- The rest of the Call Stack is cleared.
- Control returns to the Event Loop.

Other code can now continue executing.

For example:

```js
async function example() {
  console.log("A");

  await fetch("/api");

  console.log("B");
}

example();

console.log("C");
```

Output:

```text
A
C
B
```

Notice that `"C"` executes while the asynchronous request is still running.

---

#### Step 4: The Promise Is Fulfilled

When the asynchronous operation completes:

- The Promise changes to the Fulfilled state.
- The remaining part of the `async` function is scheduled as a **Microtask**.

---

#### Step 5: The Event Loop Resumes the Function

Once the Call Stack becomes empty:

1. The Event Loop checks the Microtask Queue.
2. It resumes the paused `async` function.
3. Execution continues immediately after the `await` statement.

```
await
   │
   ▼
Promise Pending
   │
   ▼
Pause async Function
   │
   ▼
Promise Fulfilled
   │
   ▼
Microtask Queue
   │
   ▼
Event Loop
   │
   ▼
Resume Function
```

---

### ❓ Why Doesn't `await` Block the Thread?

A common misunderstanding is that `await` blocks JavaScript.

It does **not**.

It only pauses the execution of the current `async` function.

While waiting:

- Other synchronous code can run.
- Other asynchronous callbacks can execute.
- User interactions remain responsive.
- The Event Loop continues working normally.

Only the paused function waits for the Promise to settle.

---

### ⚠️ Common Misconceptions

#### ❌ Misconception 1: `await` blocks JavaScript.

Incorrect.

It pauses only the current `async` function.

---

#### ❌ Misconception 2: `await` creates a new thread.

Incorrect.

JavaScript still executes on a single thread.

The Runtime Environment performs asynchronous work in the background, while JavaScript resumes execution later through the Event Loop.

---

#### ❌ Misconception 3: `await` makes code synchronous.

Incorrect.

The code only **looks** synchronous.

Internally, it still relies on Promises, the Event Loop, and the Microtask Queue.

---

### 🌍 Real-World Example

Imagine you're cooking dinner.

You place rice in a rice cooker.

Instead of standing beside it doing nothing, you start chopping vegetables and preparing the curry.

When the rice is ready, you continue with the next step of the recipe.

In this analogy:

| Cooking | JavaScript |
|----------|------------|
| Start cooking rice | Start asynchronous operation |
| Prepare other ingredients | Event Loop processes other tasks |
| Rice finishes cooking | Promise is fulfilled |
| Continue cooking | Resume after `await` |

You didn't stop working—you simply paused one part of the task while continuing with others.

---

### 🎤 Interview Answer

`async/await` is built on top of Promises and provides a cleaner syntax for asynchronous programming. An `async` function always returns a Promise, while `await` pauses only the execution of the current `async` function until the awaited Promise settles. It does not block the JavaScript thread. When the Promise is fulfilled or rejected, the remaining part of the `async` function is placed into the Microtask Queue. The Event Loop later resumes the function when the Call Stack becomes empty, allowing JavaScript to remain responsive while asynchronous operations are in progress.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is the difference between `async/await` and Promises?
- Can `await` be used outside an `async` function?
- What happens if the awaited Promise is rejected?
- How does `try...catch` work with `async/await`?
- What is the difference between sequential and parallel `await` calls?

---

## 14. What are the differences between the Browser Event Loop and the Node.js Event Loop?

### 📖 Overview

Both the **Browser Event Loop** and the **Node.js Event Loop** have the same primary goal:

> **To execute synchronous code first and efficiently schedule asynchronous operations without blocking the JavaScript thread.**

However, their implementations are different because they run in different environments.

- **Browsers** are designed to create interactive user interfaces, so their Event Loop works closely with rendering, user interactions, and Web APIs.
- **Node.js** is designed for server-side applications, so its Event Loop is optimized for networking, file systems, databases, and other I/O operations.

Although both environments follow the same core principles, the Node.js Event Loop has a more complex internal architecture.

---

### 🎯 Why Are They Different?

JavaScript itself does **not** define how the Event Loop should be implemented.

The ECMAScript specification defines the JavaScript language, but the **Runtime Environment** is responsible for implementing:

- The Event Loop
- Asynchronous APIs
- Task scheduling

Since browsers and Node.js solve different problems, each runtime implements its own Event Loop.

---

## 🌐 Browser Event Loop

The Browser Event Loop is relatively straightforward.

It repeatedly performs these steps:

1. Execute synchronous code.
2. Process all Microtasks.
3. Update rendering (if needed).
4. Execute one Callback Queue (Macrotask) task.
5. Repeat.

### Browser Architecture

```
JavaScript Engine
        │
        ▼
    Call Stack
        │
        ▼
   Event Loop
   ┌───────────────┐
   │ Microtask     │
   │ Queue         │
   └───────────────┘
        │
        ▼
   Callback Queue
        │
        ▼
Browser Rendering
```

The browser must also handle:

- UI rendering
- Mouse events
- Keyboard events
- Network requests
- Animations

This makes rendering an important part of the browser's Event Loop.

---

## 🖥️ Node.js Event Loop

Unlike browsers, Node.js has no DOM or rendering engine.

Instead, it focuses on:

- File system operations
- Network requests
- Database communication
- TCP/UDP sockets
- Server-side timers

Node.js uses **libuv**, a cross-platform library that implements the Event Loop and manages asynchronous I/O.

Instead of a single task-processing stage, the Node.js Event Loop is divided into several **phases**, each responsible for different types of callbacks.

The main phases are:

1. **Timers** – Executes callbacks from `setTimeout()` and `setInterval()`.
2. **Pending Callbacks** – Executes certain system-level callbacks.
3. **Idle, Prepare** – Internal use by Node.js.
4. **Poll** – Retrieves and processes I/O events.
5. **Check** – Executes `setImmediate()` callbacks.
6. **Close Callbacks** – Handles callbacks related to closing resources, such as sockets.

After each phase, Node.js also processes pending Microtasks before moving forward.

### Node.js Architecture

```
JavaScript Engine
        │
        ▼
    Call Stack
        │
        ▼
Node.js Event Loop
        │
        ▼
 ┌───────────────┐
 │ Timers Phase  │
 └───────────────┘
        │
        ▼
 Pending Callbacks
        │
        ▼
   Poll Phase
        │
        ▼
   Check Phase
        │
        ▼
 Close Callbacks
```

You don't need to memorize every phase for most interviews, but understanding that Node.js uses multiple phases is important.

---

### ⚖️ Browser Event Loop vs Node.js Event Loop

| Feature | Browser | Node.js |
|---------|----------|----------|
| Primary Purpose | Interactive web applications | Server-side applications |
| Rendering | ✅ Yes | ❌ No |
| DOM Events | ✅ Yes | ❌ No |
| Web APIs | ✅ Yes | ❌ No |
| File System APIs | ❌ No | ✅ Yes |
| Based On | Browser Runtime | `libuv` |
| Event Loop Structure | Simpler | Multiple phases |
| `setImmediate()` | ❌ Not available | ✅ Available |
| Rendering Cycle | Included | Not applicable |

---

### ⚙️ What Is Common Between Both?

Despite their differences, both environments follow the same core principles:

- JavaScript remains single-threaded.
- Synchronous code executes first.
- The Event Loop schedules asynchronous callbacks.
- Promise callbacks execute as Microtasks.
- The Call Stack must be empty before callbacks are executed.

This means that concepts such as Promises, `async/await`, Microtasks, and the Call Stack work similarly in both environments.

---

### 🌍 Real-World Example

Imagine two different workplaces.

#### Browser

A shopping mall manager is responsible for:

- Assisting customers
- Managing escalators
- Coordinating cleaning staff
- Handling announcements
- Ensuring the mall looks presentable

This is similar to the browser, which manages JavaScript alongside rendering and user interactions.

#### Node.js

A warehouse manager is responsible for:

- Processing orders
- Managing inventory
- Coordinating deliveries
- Handling incoming shipments
- Tracking logistics

This is similar to Node.js, which focuses on networking, file systems, and server-side tasks instead of rendering.

Both managers organize work efficiently, but their responsibilities are different.

---

### 💡 Note

A common misconception is that the Browser Event Loop and Node.js Event Loop are identical.

While they share the same fundamental concepts, Node.js has additional scheduling phases and APIs, such as `setImmediate()`, to efficiently handle server-side operations.

As a developer, you should understand the common principles and be aware that the implementation differs depending on the runtime environment.

---

### 🎤 Interview Answer

Both the Browser Event Loop and the Node.js Event Loop execute synchronous code first and use the Event Loop to schedule asynchronous callbacks. However, the browser's Event Loop is designed for rendering, user interactions, and Web APIs, while the Node.js Event Loop is optimized for server-side I/O operations using the `libuv` library. The browser follows a relatively simple scheduling model, whereas Node.js divides its Event Loop into multiple phases such as Timers, Poll, and Check. Despite these implementation differences, both environments use the Call Stack, Microtask Queue, and asynchronous callback scheduling based on the same core JavaScript principles.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is `setImmediate()` in Node.js?
- What is the `process.nextTick()` queue, and how is it different from the Microtask Queue?
- How does libuv work internally?
- Why is Node.js considered non-blocking?
- How does Node.js handle thousands of concurrent connections?

---