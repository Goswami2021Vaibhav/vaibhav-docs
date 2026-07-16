---
title: Asynchronous JavaScript
description: Callbacks, Promises, async/await, and how they actually resolve under the hood.
sidebar_position: 17
---

# Asynchronous JavaScript

## 1. What are Synchronous and Asynchronous Programming, and why do we need Asynchronous Programming?

### 📖 Overview

JavaScript is **single-threaded**, meaning it executes one task at a time using a single call stack.

If every operation had to complete before the next one started, applications would become slow and unresponsive when performing tasks such as:

- Fetching data from an API.
- Reading files.
- Waiting for database queries.
- Uploading images.
- Waiting for timers.

To solve this problem, JavaScript supports **asynchronous programming**, allowing long-running operations to execute without blocking the main thread.

This is one of the most fundamental concepts in JavaScript and forms the basis for **Callbacks, Promises, Async/Await, and the Event Loop**.

---

### ⚙️ Main Explanation

#### What is Synchronous Programming?

In synchronous programming, tasks execute **one after another**.

The next task starts **only after** the current task has finished.

Example:

```js
console.log("A");

console.log("B");

console.log("C");
```

Output:

```text
A

B

C
```

Execution happens sequentially.

```text
A

↓

B

↓

C
```

---

#### What is Asynchronous Programming?

In asynchronous programming, JavaScript can start a long-running task and continue executing other code instead of waiting for that task to finish.

Once the asynchronous task completes, its callback or Promise is executed later.

Example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 2000);

console.log("End");
```

Output:

```text
Start

End

Timer
```

JavaScript does **not** wait for the timer.

---

#### Why Do We Need Asynchronous Programming?

Imagine making an API request.

Without asynchronous programming:

```text
Request API

↓

Wait...

↓

Wait...

↓

Wait...

↓

Continue Program
```

The entire application would freeze while waiting.

With asynchronous programming:

```text
Request API

↓

Continue Other Work

↓

API Completes

↓

Process Result
```

The application remains responsive.

---

#### Blocking vs Non-Blocking

##### Blocking

A blocking operation prevents the next task from executing until it finishes.

Example:

```text
Task 1

↓

Wait 5 Seconds

↓

Task 2
```

Everything waits.

---

##### Non-Blocking

A non-blocking operation allows other tasks to continue while waiting.

Example:

```text
Task 1

↓

Start API Request

↓

Task 2

↓

Task 3

↓

API Response
```

This improves responsiveness.

---

#### Common Asynchronous Operations

Some operations that are typically asynchronous include:

- API requests (`fetch`)
- Timers (`setTimeout`, `setInterval`)
- Reading files (Node.js)
- Database queries
- User events (clicks, keyboard input)
- WebSocket communication

---

#### How JavaScript Achieves Asynchronous Behavior

Although JavaScript is single-threaded, it works with the browser or Node.js runtime to handle asynchronous operations.

Conceptually:

```text
JavaScript

↓

Start Async Task

↓

Continue Executing Code

↓

Async Task Completes

↓

Execute Result
```

> **Note:** We'll learn exactly **how** this works internally when we study the **Event Loop** chapter.

---

#### Synchronous vs Asynchronous

| Synchronous | Asynchronous |
|--------------|--------------|
| Executes one task at a time | Doesn't wait for long-running tasks |
| Blocking | Non-blocking |
| Simpler execution flow | Better responsiveness |
| Can freeze the application | Keeps the application responsive |

---

#### Common Mistakes

**Thinking asynchronous means multiple JavaScript threads**

JavaScript itself still executes your code on a **single thread**.

Asynchronous behavior is made possible by the runtime environment (browser or Node.js), not by running your JavaScript code on multiple threads.

---

**Thinking `setTimeout()` blocks execution**

Example:

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");
```

Output:

```text
A

C

B
```

The timer does not pause JavaScript execution.

---

#### Best Practices

When working with asynchronous code:

- Keep long-running tasks asynchronous.
- Never block the main thread unnecessarily.
- Use Promises or `async/await` instead of deeply nested callbacks.
- Understand that asynchronous code improves responsiveness, not parallel execution of JavaScript itself.

---

> 💡 **Coming Next**
>
> In the next topic, we'll learn about **Callback Functions**, why they were introduced, their advantages and disadvantages, and how they eventually led to **Promise-based programming**.

---

### 💻 Example

We'll use the following example throughout this chapter.

```js
console.log("Start");

setTimeout(() => {
  console.log("API Finished");
}, 2000);

console.log("End");
```

Output:

```text
Start

End

API Finished
```

---

### 📊 Diagram / Flow

#### Synchronous Execution

```text
Task A

↓

Task B

↓

Task C
```

---

#### Asynchronous Execution

```text
Start Async Task

↓

Continue Other Code

↓

Async Task Finishes

↓

Handle Result
```

---

#### Blocking vs Non-Blocking

```text
Blocking

↓

Wait

↓

Continue

--------------------

Non-Blocking

↓

Continue Immediately

↓

Handle Result Later
```

---

### 🌍 Real-World Example

Imagine an e-commerce website.

When a customer opens the product page:

- The page starts loading product details from an API.
- Instead of freezing the entire website until the response arrives, JavaScript continues rendering the page, handling user interactions, and displaying loading indicators.
- Once the API responds, the product information is displayed.

Without asynchronous programming, users would have to wait for every network request before interacting with the application, resulting in a poor user experience.

---

### 🎤 Interview Answer

Synchronous programming executes tasks one after another, where each task must finish before the next one begins. This makes execution simple but can block the application during long-running operations. Asynchronous programming allows JavaScript to start operations such as API requests, timers, or file reads without waiting for them to complete, enabling the application to continue executing other code and remain responsive. Although JavaScript is single-threaded, asynchronous behavior is provided by the runtime environment, while JavaScript continues executing on a single call stack. The internal mechanism that makes this possible is the Event Loop, which is covered separately.

---

### ❓ Follow-up Questions

1. What is the difference between synchronous and asynchronous programming?
2. Why do we need asynchronous programming?
3. What is the difference between blocking and non-blocking operations?
4. Is JavaScript multi-threaded?
5. Does `setTimeout()` block JavaScript execution?
6. What are some common asynchronous operations in JavaScript?

---

## 2. What are Callback Functions, and what is Callback Hell?

### 📖 Overview

Before Promises and `async/await` were introduced, **Callbacks** were the primary way to handle asynchronous operations in JavaScript.

Callbacks allow a function to be executed **after another function or asynchronous task completes**.

Although callbacks are simple and powerful, deeply nested callbacks can make code difficult to read and maintain. This problem is known as **Callback Hell** or the **Pyramid of Doom**.

In this topic, we'll cover:

- Callback Functions
- Why callbacks are used
- Advantages and disadvantages
- Callback Hell
- Pyramid of Doom
- Inversion of Control
- Callback vs Promise
- Callback Hell vs Promise Chaining

---

### ⚙️ Main Explanation

#### What is a Callback Function?

A **Callback Function** is a function that is **passed as an argument to another function** and is executed later.

Example:

```js
function greet(callback) {
  console.log("Hello");

  callback();
}

greet(() => {
  console.log("Welcome!");
});
```

Output:

```text
Hello

Welcome!
```

The callback executes after `greet()` finishes its work.

---

#### Why Are Callbacks Used?

Callbacks allow JavaScript to execute code **after a task has completed**.

They are commonly used for:

- API requests
- Timers
- Event listeners
- File operations (Node.js)

Example:

```js
setTimeout(() => {
  console.log("Done");
}, 1000);
```

The callback runs after the timer completes.

---

#### Advantages of Callbacks

- Simple to understand.
- Built into JavaScript.
- Useful for event handling.
- Allow asynchronous operations to notify when they finish.

---

#### Disadvantages of Callbacks

- Difficult to read when deeply nested.
- Harder to debug.
- Error handling becomes complicated.
- Can lead to Callback Hell.
- Introduces **Inversion of Control**.

These limitations led to the introduction of **Promises**.

---

#### What is Callback Hell?

Callback Hell occurs when multiple asynchronous operations depend on each other and callbacks become deeply nested.

Example:

```js
loginUser(() => {
  getProfile(() => {
    getOrders(() => {
      makePayment(() => {
        console.log("Done");
      });
    });
  });
});
```

This code works, but becomes increasingly difficult to read and maintain.

---

#### Pyramid of Doom

Because the code keeps nesting to the right, it forms a pyramid shape.

```text
Task 1

↓

 Task 2

↓

  Task 3

↓

   Task 4

↓

    Task 5
```

Hence the name:

```text
Pyramid of Doom
```

---

#### Why is Callback Hell a Problem?

Deep nesting causes:

- Poor readability.
- Difficult debugging.
- Complicated error handling.
- Tight coupling between asynchronous operations.

As projects grow, maintaining such code becomes challenging.

---

#### What is Inversion of Control?

One of the biggest problems with callbacks is **Inversion of Control**.

When you pass a callback to another function or library:

```js
doSomething(callback);
```

you lose direct control over **when**, **how**, or even **if** that callback will be executed.

You trust the external code to call your callback correctly.

This can lead to issues such as:

- Callback being called multiple times.
- Callback never being called.
- Callback being called with incorrect data.

Promises were introduced to provide more predictable control over asynchronous code.

---

#### Callback vs Promise

| Callback | Promise |
|-----------|----------|
| Uses callback functions | Represents a future result |
| Can lead to nested code | Supports chaining |
| Harder error handling | Centralized error handling with `.catch()` |
| Inversion of Control | Better control over asynchronous flow |

---

#### Callback Hell vs Promise Chaining

Callback Hell:

```text
Task

↓

 Callback

↓

  Callback

↓

   Callback
```

Promise Chaining:

```text
Task

↓

.then()

↓

.then()

↓

.then()
```

Promise chaining keeps the code flatter and easier to read.

---

#### Common Mistakes

**Deeply Nesting Callbacks**

Instead of:

```js
task1(() => {
  task2(() => {
    task3(() => {
      task4();
    });
  });
});
```

Prefer Promise chaining or `async/await` where possible.

---

**Ignoring Error Handling**

Callbacks often require error handling at every level.

Example:

```js
function callback(err, data) {
  if (err) {
    // Handle error
  }

  // Use data
}
```

Missing these checks can cause unexpected failures.

---

#### Best Practices

When working with callbacks:

- Keep callback nesting as shallow as possible.
- Handle errors consistently.
- Prefer Promises or `async/await` for complex asynchronous workflows.
- Use callbacks mainly for simple asynchronous tasks or event-driven APIs.

---

> 💡 **Coming Next**
>
> In the next topic, we'll learn about **Promises**, why they were introduced, their states, lifecycle, and how they solve many of the problems associated with callbacks.

---

### 💻 Example

We'll continue using our running example.

```js
console.log("Start");

setTimeout(() => {
  console.log("Task Complete");
}, 1000);

console.log("End");
```

Output:

```text
Start

End

Task Complete
```

Here, the function passed to `setTimeout()` is a callback.

---

### 📊 Diagram / Flow

#### Callback

```text
Function

↓

Pass Callback

↓

Task Completes

↓

Execute Callback
```

---

#### Callback Hell

```text
Task 1

↓

 Task 2

↓

  Task 3

↓

   Task 4
```

---

#### Promise Chaining

```text
Task

↓

.then()

↓

.then()

↓

.then()
```

---

### 🌍 Real-World Example

Imagine a food delivery application.

To place an order, the application needs to:

1. Verify the user.
2. Fetch the delivery address.
3. Check restaurant availability.
4. Create the order.
5. Process the payment.

Using callbacks, each step might be nested inside the previous one, creating Callback Hell.

With Promises or `async/await`, the same workflow becomes much cleaner, easier to read, and simpler to maintain.

---

### 🎤 Interview Answer

A callback function is a function passed as an argument to another function and executed after a task completes. Callbacks were widely used for handling asynchronous operations such as timers, API requests, and file operations. However, when multiple asynchronous tasks depend on each other, callbacks often become deeply nested, leading to Callback Hell or the Pyramid of Doom. This makes the code difficult to read, maintain, and debug. Another drawback is Inversion of Control, where developers rely on external code to invoke their callbacks correctly. Promises and `async/await` were introduced to provide a cleaner, more maintainable approach to asynchronous programming.

---

### ❓ Follow-up Questions

1. What is a callback function?
2. Why are callbacks used in JavaScript?
3. What are the advantages and disadvantages of callbacks?
4. What is Callback Hell?
5. What is the Pyramid of Doom?
6. What is Inversion of Control?
7. Why are Promises better than callbacks?
8. How does Promise chaining solve Callback Hell?

---

## 3. What is a Promise, and how does it work?

### 📖 Overview

As JavaScript applications became more complex, Callback Hell made asynchronous code difficult to read and maintain.

To solve these problems, **Promises** were introduced in **ES6 (ES2015)**.

A Promise provides a cleaner and more structured way to handle asynchronous operations.

Instead of passing callbacks into functions, a Promise represents the **eventual result of an asynchronous operation**, allowing developers to write readable, chainable, and predictable asynchronous code.

In this topic, we'll cover:

- What is a Promise?
- Why Promises were introduced
- Promise states
- Promise lifecycle
- Creating Promises
- Promise resolution
- Promise rejection

> **Note:** We'll cover `.then()`, `.catch()`, `.finally()`, and Promise Chaining in the next topic.

---

### ⚙️ Main Explanation

#### What is a Promise?

A **Promise** is a JavaScript object that represents the **eventual completion or failure of an asynchronous operation**.

Think of it as a placeholder for a value that isn't available yet.

Instead of returning the final result immediately, an asynchronous function returns a Promise.

Later, that Promise either:

- Produces a value.
- Produces an error.

---

#### Why Were Promises Introduced?

Promises were introduced to solve several problems with callbacks:

- Callback Hell.
- Difficult error handling.
- Inversion of Control.
- Poor readability.

Promises make asynchronous code:

- Easier to read.
- Easier to maintain.
- Easier to chain.
- Easier to handle errors.

---

#### Promise States

Every Promise has **three possible states**.

##### 1. Pending

The asynchronous operation is still running.

```text
Pending
```

---

##### 2. Fulfilled

The operation completed successfully.

```text
Fulfilled

↓

Value Available
```

---

##### 3. Rejected

The operation failed.

```text
Rejected

↓

Reason / Error Available
```

---

#### Can a Promise Change State?

A Promise changes state only once.

```text
Pending

↓

Fulfilled
```

or

```text
Pending

↓

Rejected
```

Once a Promise is **fulfilled** or **rejected**, it is considered **settled**.

A settled Promise **cannot change state again**.

This immutability makes Promises predictable.

---

#### Promise Lifecycle

```text
Create Promise

↓

Pending

↓

Success?

↓

Yes

↓

Fulfilled

--------------------

No

↓

Rejected
```

---

#### Creating a Promise

Promises are created using the `Promise` constructor.

Example:

```js
const promise =
  new Promise(
    (
      resolve,
      reject
    ) => {
      const success =
        true;

      if (success) {
        resolve(
          "Data Loaded"
        );
      } else {
        reject(
          "Something Went Wrong"
        );
      }
    }
  );
```

The constructor receives an **executor function**.

This function is executed immediately and receives two functions:

- `resolve`
- `reject`

---

#### What Does a Promise Return?

An asynchronous function typically returns a Promise.

Example:

```js
const promise =
  Promise.resolve(
    "Hello"
  );

console.log(promise);
```

Output:

```text
Promise { <fulfilled>: "Hello" }
```

The Promise object is returned immediately.

The actual value becomes available later when the Promise settles.

---

#### Promise Resolution

Calling:

```js
resolve(value);
```

marks the Promise as:

```text
Fulfilled
```

and stores the provided value.

Example:

```js
resolve("Success");
```

The Promise now contains:

```text
Success
```

---

#### Promise Rejection

Calling:

```js
reject(error);
```

marks the Promise as:

```text
Rejected
```

and stores the rejection reason.

Example:

```js
reject(
  "Network Error"
);
```

The Promise now represents a failed asynchronous operation.

---

#### Promise Resolution vs Promise Rejection

| Resolution | Rejection |
|------------|-----------|
| Operation succeeds | Operation fails |
| Promise becomes fulfilled | Promise becomes rejected |
| Stores a value | Stores an error or reason |

---

#### Common Mistakes

**Trying to Resolve a Promise Twice**

Example:

```js
resolve("A");

resolve("B");
```

Only the **first** call has any effect.

The Promise is already settled.

---

**Trying to Reject After Resolving**

Example:

```js
resolve("Done");

reject("Error");
```

The rejection is ignored because the Promise has already been fulfilled.

---

#### Best Practices

When working with Promises:

- Resolve or reject a Promise only once.
- Keep Promise executors simple.
- Use rejection for errors.
- Return Promises from asynchronous functions instead of relying on callbacks.

---

> 💡 **Coming Next**
>
> In the next topic, we'll learn how to consume Promises using **`.then()`, `.catch()`, `.finally()`**, and how **Promise Chaining** makes asynchronous code cleaner and easier to maintain.

---

### 💻 Example

We'll continue using our running example.

```js
const promise =
  new Promise(
    (
      resolve,
      reject
    ) => {
      resolve(
        "Order Placed"
      );
    }
  );

console.log(promise);
```

Output:

```text
Promise { <fulfilled>: "Order Placed" }
```

---

### 📊 Diagram / Flow

#### Promise Lifecycle

```text
Promise

↓

Pending

↓

Success

↓

Fulfilled

--------------------

Failure

↓

Rejected
```

---

#### Promise Creation

```text
new Promise()

↓

Executor

↓

resolve()

or

reject()
```

---

#### Promise States

```text
Pending

↓

Settled

↓

Fulfilled

or

Rejected
```

---

### 🌍 Real-World Example

Imagine an online shopping application.

When a customer places an order:

```text
Create Order

↓

Promise Created

↓

Processing...

↓

Payment Success

↓

Fulfilled

--------------------

Payment Failed

↓

Rejected
```

The Promise represents the future result of the payment process. The application can then respond appropriately once the operation succeeds or fails.

---

### 🎤 Interview Answer

A Promise is a JavaScript object that represents the eventual completion or failure of an asynchronous operation. It was introduced in ES6 to overcome problems associated with callbacks, such as Callback Hell and difficult error handling. A Promise has three states: **Pending**, **Fulfilled**, and **Rejected**. It starts in the Pending state and eventually becomes either Fulfilled with a value or Rejected with an error. Once a Promise is settled, its state cannot change. Promises are created using the `Promise` constructor, which receives an executor function containing `resolve` and `reject` functions to determine the outcome of the asynchronous operation.

---

### ❓ Follow-up Questions

1. What is a Promise?
2. Why were Promises introduced?
3. What are the three states of a Promise?
4. Can a Promise change state after being fulfilled or rejected?
5. What do `resolve()` and `reject()` do?
6. What does the `Promise` constructor return?
7. What is the Promise lifecycle?
8. What is the difference between Promise resolution and rejection?

---

## 4. What are `.then()`, `.catch()`, `.finally()`, and Promise Chaining?

### 📖 Overview

Creating a Promise is only the first step. To work with the result of a Promise, JavaScript provides three important methods:

- **`.then()`** → Handles successful completion.
- **`.catch()`** → Handles errors.
- **`.finally()`** → Executes cleanup code regardless of success or failure.

These methods can also be chained together, allowing developers to perform multiple asynchronous operations in a clean and readable way. This is known as **Promise Chaining**.

---

### ⚙️ Main Explanation

#### `.then()`

The `.then()` method is executed when a Promise is **fulfilled**.

It receives the resolved value as its argument.

Example:

```js
const promise =
  Promise.resolve("Success");

promise.then((value) => {
  console.log(value);
});
```

Output:

```text
Success
```

---

#### `.catch()`

The `.catch()` method handles Promise **rejections** or errors thrown in previous `.then()` callbacks.

Example:

```js
const promise =
  Promise.reject("Network Error");

promise.catch((error) => {
  console.log(error);
});
```

Output:

```text
Network Error
```

---

#### `.finally()`

The `.finally()` method runs **regardless of whether the Promise is fulfilled or rejected**.

It is commonly used for cleanup tasks.

Example:

```js
fetchData()
  .finally(() => {
    console.log("Cleanup");
  });
```

Typical use cases:

- Hide loading spinners.
- Close database connections.
- Stop loaders.
- Release resources.

---

### Promise Chaining

One of the biggest advantages of Promises is that every `.then()` returns **another Promise**.

This allows multiple asynchronous operations to be chained together.

Example:

```js
Promise.resolve(2)
  .then((num) => {
    return num * 2;
  })
  .then((num) => {
    return num + 1;
  })
  .then((result) => {
    console.log(result);
  });
```

Output:

```text
5
```

Each `.then()` receives the result from the previous step.

---

#### What Happens if `.then()` Returns a Normal Value?

If a `.then()` callback returns a normal value, that value becomes the resolved value of the next Promise in the chain.

Example:

```js
Promise.resolve(5)
  .then((num) => {
    return num * 2;
  })
  .then((value) => {
    console.log(value);
  });
```

Output:

```text
10
```

---

#### What Happens if `.then()` Returns Another Promise?

If a `.then()` callback returns a Promise, JavaScript automatically waits for it to settle before continuing.

Example:

```js
Promise.resolve(5)
  .then((num) => {
    return Promise.resolve(num * 2);
  })
  .then((value) => {
    console.log(value);
  });
```

Output:

```text
10
```

This behavior is called **Promise Flattening**.

You don't get a Promise inside another Promise—the chain automatically unwraps it.

---

#### What Happens if an Error is Thrown?

If an error is thrown inside any `.then()` callback, the Promise becomes rejected and control moves to the nearest `.catch()`.

Example:

```js
Promise.resolve()
  .then(() => {
    throw new Error("Something went wrong");
  })
  .catch((error) => {
    console.log(error.message);
  });
```

Output:

```text
Something went wrong
```

---

#### Why Should You Return Promises Properly?

Incorrect:

```js
fetchUser()
  .then(() => {
    fetchOrders();
  })
  .then(() => {
    console.log("Done");
  });
```

Since `fetchOrders()` is **not returned**, the next `.then()` executes immediately.

Correct:

```js
fetchUser()
  .then(() => {
    return fetchOrders();
  })
  .then(() => {
    console.log("Done");
  });
```

Now the chain waits for `fetchOrders()` to complete.

---

#### Promise Flattening

Promise Flattening means JavaScript automatically unwraps a returned Promise.

Conceptually:

```text
.then()

↓

Returns Promise

↓

Wait

↓

Continue Chain
```

This prevents nested Promises like:

```text
Promise<Promise<Value>>
```

---

#### Promise Chaining vs Callback Hell

Callback Hell:

```text
Task

↓

 Callback

↓

  Callback

↓

   Callback
```

Promise Chaining:

```text
Task

↓

.then()

↓

.then()

↓

.then()
```

Promise chaining keeps asynchronous code much cleaner and easier to follow.

---

#### Common Mistakes

**Forgetting to Return a Promise**

This breaks the chain and causes later steps to execute too early.

---

**Handling Errors in Every `.then()`**

Instead of adding error handling everywhere:

```js
.then(...)
.catch(...)
```

use one `.catch()` at the end of the chain whenever possible.

---

#### Best Practices

When using Promises:

- Chain `.then()` calls instead of nesting them.
- Always return Promises inside `.then()`.
- Place `.catch()` at the end of the chain for centralized error handling.
- Use `.finally()` for cleanup tasks only.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Promise Utility Methods** such as `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, and `Promise.any()`.

---

### 💻 Example

We'll continue using our running example.

```js
Promise.resolve(10)
  .then((num) => {
    return num * 2;
  })
  .then((num) => {
    console.log(num);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    console.log("Finished");
  });
```

Output:

```text
20

Finished
```

---

### 📊 Diagram / Flow

#### Promise Chain

```text
Promise

↓

.then()

↓

.then()

↓

.then()

↓

.catch()

↓

.finally()
```

---

#### Returning a Value

```text
.then()

↓

Return Value

↓

Next .then()
```

---

#### Returning a Promise

```text
.then()

↓

Return Promise

↓

Wait

↓

Next .then()
```

---

#### Error Flow

```text
.then()

↓

Error Thrown

↓

.catch()

↓

.finally()
```

---

### 🌍 Real-World Example

Imagine an online shopping application.

To place an order:

1. Verify the user.
2. Fetch the shopping cart.
3. Create the order.
4. Process the payment.
5. Send a confirmation email.

Using Promise chaining:

```text
Login

↓

.then()

↓

Fetch Cart

↓

.then()

↓

Create Order

↓

.then()

↓

Payment

↓

.catch()

↓

.finally()
```

The workflow stays linear, readable, and easier to maintain compared to deeply nested callbacks.

---

### 🎤 Interview Answer

Promises provide three primary methods for handling asynchronous results. `.then()` is used to process a fulfilled Promise, `.catch()` handles rejections or errors, and `.finally()` executes code regardless of whether the Promise succeeds or fails, making it useful for cleanup tasks. Since every `.then()` returns a new Promise, multiple asynchronous operations can be chained together in a readable sequence known as Promise Chaining. If a `.then()` returns a normal value, it becomes the input for the next `.then()`. If it returns another Promise, JavaScript automatically waits for that Promise to settle before continuing, a behavior known as Promise Flattening. This approach eliminates Callback Hell and provides centralized error handling.

---

### ❓ Follow-up Questions

1. What does `.then()` do?
2. What does `.catch()` do?
3. What does `.finally()` do?
4. What is Promise Chaining?
5. What happens if `.then()` returns a normal value?
6. What happens if `.then()` returns another Promise?
7. What happens if an error is thrown inside `.then()`?
8. Why should Promises be returned properly inside `.then()`?
9. What is Promise Flattening?
10. How does Promise Chaining solve Callback Hell?

---



## 5. What are Promise Utility Methods?

### 📖 Overview

JavaScript provides several built-in Promise utility methods that make it easier to work with **multiple asynchronous operations**.

The most commonly used methods are:

- `Promise.resolve()`
- `Promise.reject()`
- `Promise.all()`
- `Promise.allSettled()`
- `Promise.race()`
- `Promise.any()`

Each method is designed for a different use case, such as running multiple API requests, handling partial failures, or returning the fastest result.

---

### ⚙️ Main Explanation

#### `Promise.resolve()`

`Promise.resolve()` creates a Promise that is **immediately fulfilled**.

Example:

```js
const promise =
  Promise.resolve(
    "Success"
  );

promise.then(console.log);
```

Output:

```text
Success
```

It is useful when a function needs to return a Promise, even if the value is already available.

---

#### `Promise.reject()`

`Promise.reject()` creates a Promise that is **immediately rejected**.

Example:

```js
const promise =
  Promise.reject(
    "Something went wrong"
  );

promise.catch(console.log);
```

Output:

```text
Something went wrong
```

It is commonly used to return errors from asynchronous functions.

---

#### `Promise.all()`

`Promise.all()` executes multiple Promises **in parallel** and waits until **all of them are fulfilled**.

If **any Promise rejects**, the entire Promise rejects immediately.

Example:

```js
Promise.all([
  fetchUsers(),
  fetchProducts(),
  fetchOrders(),
]).then(console.log);
```

Behavior:

```text
All Success

↓

Return Array

--------------------

Any Failure

↓

Reject Immediately
```

##### When Should You Use `Promise.all()`?

Use it when:

- Every request is required.
- One failure should fail the entire operation.

Examples:

- Dashboard loading
- Product page
- User profile page
- Checkout process

---

#### `Promise.allSettled()`

`Promise.allSettled()` waits until **every Promise settles**, regardless of whether it succeeds or fails.

Example:

```js
Promise.allSettled([
  fetchUsers(),
  fetchProducts(),
  fetchOrders(),
]).then(console.log);
```

Output:

```text
[
  { status: "fulfilled", value: ... },

  { status: "rejected", reason: ... },

  { status: "fulfilled", value: ... }
]
```

##### When Should You Use `Promise.allSettled()`?

Use it when:

- Partial success is acceptable.
- Every result is important.

Examples:

- Analytics dashboard
- Multiple file uploads
- Notification systems

---

#### `Promise.race()`

`Promise.race()` returns the **first Promise that settles**, whether it is fulfilled or rejected.

Example:

```js
Promise.race([
  apiRequest(),
  timeout(),
]);
```

Behavior:

```text
First Settled

↓

Return Result
```

##### When Should You Use `Promise.race()`?

Common use cases include:

- Request timeout
- Fastest server wins
- Competing asynchronous tasks

---

#### `Promise.any()`

`Promise.any()` returns the **first fulfilled Promise**.

Rejected Promises are ignored unless **all Promises reject**.

Example:

```js
Promise.any([
  server1(),
  server2(),
  server3(),
]).then(console.log);
```

Behavior:

```text
First Success

↓

Return Value
```

If all Promises reject:

```text
AggregateError
```

is thrown.

##### When Should You Use `Promise.any()`?

Common use cases include:

- Multiple CDN servers
- Backup APIs
- Mirror servers

You only need one successful response.

---

#### Comparison

| Method | Success Condition | Failure Condition |
|---------|-------------------|-------------------|
| `Promise.all()` | All Promises fulfill | Any Promise rejects |
| `Promise.allSettled()` | Waits for all Promises | Never rejects because of individual failures |
| `Promise.race()` | First Promise settles | First settled Promise may reject |
| `Promise.any()` | First Promise fulfills | All Promises reject |

---

#### Visual Comparison

##### `Promise.all()`

```text
P1 ✔

P2 ✔

P3 ✔

↓

Success

--------------------

P2 ✖

↓

Reject Immediately
```

---

##### `Promise.allSettled()`

```text
P1 ✔

P2 ✖

P3 ✔

↓

Return All Results
```

---

##### `Promise.race()`

```text
P1 ✔

P2 Pending

P3 Pending

↓

P1 Wins
```

---

##### `Promise.any()`

```text
P1 ✖

P2 ✖

P3 ✔

↓

P3 Wins
```

---

#### Common Mistakes

**Using `Promise.all()` when partial results are acceptable**

If one Promise rejects, every successful result is discarded.

In such cases, prefer:

```js
Promise.allSettled()
```

---

**Confusing `Promise.race()` with `Promise.any()`**

`Promise.race()` returns the **first settled Promise**, whether fulfilled or rejected.

`Promise.any()` returns the **first fulfilled Promise** and ignores rejected Promises unless they all fail.

---

#### Best Practices

When working with multiple Promises:

- Use `Promise.all()` when every task must succeed.
- Use `Promise.allSettled()` when partial failures are acceptable.
- Use `Promise.race()` for timeout or competition scenarios.
- Use `Promise.any()` when any successful result is sufficient.
- Choose the method based on the business requirement, not just convenience.

---

> 💡 **Coming Next**
>
> In the next topic, we'll learn about **`async` and `await`**, which provide an even cleaner syntax for working with Promises.

---

### 💻 Example

```js
Promise.all([
  fetchUsers(),
  fetchProducts(),
])
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
```

If both requests succeed:

```text
[
  users,

  products
]
```

If either request fails:

```text
Promise Rejected
```

---

### 📊 Diagram / Flow

#### `Promise.all()`

```text
P1

P2

P3

↓

All Success

↓

Array
```

---

#### `Promise.allSettled()`

```text
P1 ✔

P2 ✖

P3 ✔

↓

All Results
```

---

#### `Promise.race()`

```text
P1

P2

P3

↓

First Finished
```

---

#### `Promise.any()`

```text
P1 ✖

P2 ✔

P3 Pending

↓

P2 Returned
```

---

### 🌍 Real-World Example

Imagine an admin dashboard that loads:

- User statistics
- Sales data
- Notifications

If **all three are required** before rendering the page, `Promise.all()` is the right choice.

If the dashboard can still work even if one widget fails, `Promise.allSettled()` is a better option because it returns the result of every request.

If you're requesting data from multiple mirror servers and only need the **fastest successful response**, `Promise.any()` is ideal.

To implement an API timeout, you can race the API request against a timeout Promise using `Promise.race()`.

---

### 🎤 Interview Answer

JavaScript provides several Promise utility methods for handling multiple asynchronous operations. `Promise.resolve()` creates an immediately fulfilled Promise, while `Promise.reject()` creates an immediately rejected Promise. `Promise.all()` runs multiple Promises in parallel and resolves only when all of them succeed, rejecting immediately if any Promise fails. `Promise.allSettled()` waits for every Promise to complete and returns the outcome of each one, regardless of success or failure. `Promise.race()` returns the first Promise that settles, whether fulfilled or rejected, making it useful for implementing timeouts. `Promise.any()` returns the first fulfilled Promise and ignores rejected Promises unless all of them fail. Choosing the appropriate method depends on how your application should behave when one or more asynchronous operations fail.

---

### ❓ Follow-up Questions

1. What does `Promise.resolve()` do?
2. What does `Promise.reject()` do?
3. What is `Promise.all()`?
4. When should you use `Promise.all()`?
5. What is `Promise.allSettled()`?
6. What is the difference between `Promise.all()` and `Promise.allSettled()`?
7. What is `Promise.race()`?
8. What is `Promise.any()`?
9. What is the difference between `Promise.race()` and `Promise.any()`?
10. Which Promise utility method is best for loading dashboard data?

---

## 6. What are `async` and `await`?

### 📖 Overview

While Promises solved many problems of callbacks, long Promise chains could still become difficult to read.

To make asynchronous code look more like synchronous code, **ES2017 (ES8)** introduced:

- `async`
- `await`

These keywords provide a cleaner and more readable syntax for working with Promises.

> **Important:** `async/await` does **not** replace Promises. It is built **on top of Promises** and is simply syntactic sugar for writing Promise-based code.

---

### ⚙️ Main Explanation

#### What is the `async` Keyword?

The `async` keyword is used before a function declaration.

It tells JavaScript that the function is asynchronous and **always returns a Promise**.

Example:

```js
async function greet() {
  return "Hello";
}
```

Although the function returns a string, JavaScript automatically wraps it in a Promise.

Conceptually:

```js
async function greet() {
  return "Hello";
}

// behaves like

function greet() {
  return Promise.resolve("Hello");
}
```

---

#### Does an `async` Function Always Return a Promise?

**Yes.**

Regardless of what you return:

```js
async function getNumber() {
  return 10;
}
```

The actual returned value is:

```text
Promise<10>
```

Example:

```js
const result =
  getNumber();

console.log(result);
```

Output:

```text
Promise { 10 }
```

---

#### What is the `await` Keyword?

The `await` keyword pauses the execution of the **current async function** until a Promise settles.

Example:

```js
async function fetchData() {
  const data =
    await fetchUser();

  console.log(data);
}
```

Here:

```text
await

↓

Wait for Promise

↓

Continue Execution
```

---

#### Can `await` Be Used Outside an `async` Function?

Normally, **No**.

Example:

```js
const data =
  await fetchUser();
```

This results in a syntax error because `await` can only be used inside an `async` function.

> **Note:** Modern JavaScript environments support **Top-Level `await`** inside ES Modules, but in general interview discussions, it's safe to say that `await` is used inside `async` functions.

---

#### Why Was `async/await` Introduced?

Promises improved asynchronous programming, but long Promise chains could still become difficult to read.

Example:

```js
fetchUser()
  .then(getOrders)
  .then(makePayment)
  .then(sendEmail)
  .catch(handleError);
```

Using `async/await`:

```js
async function processOrder() {
  const user =
    await fetchUser();

  const orders =
    await getOrders(user);

  await makePayment(orders);

  await sendEmail();
}
```

The second version is much easier to read because it resembles synchronous code.

---

#### Is `async/await` Blocking?

No.

`await` pauses **only the current async function**.

It **does not block** the JavaScript thread.

Example:

```js
console.log("Start");

async function demo() {
  await fetchUser();

  console.log("Done");
}

demo();

console.log("End");
```

Output:

```text
Start

End

Done
```

The program continues executing other code while waiting for the Promise.

> **How this works internally with the Event Loop will be covered in the next chapter.**

---

#### `async/await` vs Promises

| Promise | `async/await` |
|----------|---------------|
| Uses `.then()` and `.catch()` | Uses `await` and `try...catch` |
| Chain-based syntax | Sequential-looking syntax |
| Can become lengthy | Easier to read |
| Same underlying mechanism | Built on top of Promises |

---

#### Common Mistakes

**Using `await` Outside an `async` Function**

Incorrect:

```js
const user =
  await fetchUser();
```

Correct:

```js
async function load() {
  const user =
    await fetchUser();
}
```

---

**Thinking `async/await` Is Different from Promises**

It isn't.

`async/await` is simply a cleaner way of writing Promise-based code.

---

**Thinking `await` Blocks JavaScript**

`await` pauses only the current async function.

Other JavaScript code continues executing normally.

---

#### Best Practices

When using `async/await`:

- Prefer it over long Promise chains for better readability.
- Remember that every `async` function returns a Promise.
- Use `await` only with asynchronous operations.
- Handle errors using `try...catch` (covered in the next topic).

---

> 💡 **Coming Next**
>
> In the next topic, we'll learn **how to handle errors with `async/await`**, including `try...catch`, Promise rejections, and best practices.

---

### 💻 Example

We'll continue using our running example.

```js
async function getUser() {
  return "Vaibhav";
}

async function main() {
  const user =
    await getUser();

  console.log(user);
}

main();
```

Output:

```text
Vaibhav
```

---

### 📊 Diagram / Flow

#### `async`

```text
Function

↓

async

↓

Always Returns

↓

Promise
```

---

#### `await`

```text
Promise

↓

await

↓

Promise Settles

↓

Continue Execution
```

---

#### `async/await`

```text
async Function

↓

await Promise

↓

Receive Value

↓

Continue
```

---

### 🌍 Real-World Example

Imagine an e-commerce application.

To place an order, the application needs to:

1. Fetch the logged-in user.
2. Fetch the shopping cart.
3. Process the payment.
4. Send a confirmation email.

Using `async/await`, these dependent operations can be written in a top-to-bottom sequence that closely resembles synchronous code, making the workflow easier to understand and maintain while still remaining asynchronous.

---

### 🎤 Interview Answer

`async` and `await` were introduced in ES2017 to simplify working with Promises. The `async` keyword marks a function as asynchronous and ensures that it always returns a Promise, even if a normal value is returned. The `await` keyword pauses the execution of the current async function until the awaited Promise settles, then returns its resolved value. However, `await` does not block the JavaScript thread; it only pauses that specific async function while other code continues to execute. Internally, `async/await` is built on top of Promises and provides a cleaner, more readable syntax for asynchronous programming.

---

### ❓ Follow-up Questions

1. What is the purpose of the `async` keyword?
2. Does an `async` function always return a Promise?
3. What does the `await` keyword do?
4. Can `await` be used outside an `async` function?
5. Why was `async/await` introduced?
6. Does `await` block JavaScript execution?
7. What is the difference between Promises and `async/await`?
8. Is `async/await` a replacement for Promises?

---

## 7. How do you handle errors in Asynchronous JavaScript?

### 📖 Overview

Errors are inevitable in asynchronous operations.

Examples include:

- API requests failing.
- Network connectivity issues.
- Database errors.
- Invalid user input.
- Server failures.

JavaScript provides different ways to handle these errors depending on whether you're using **Promises** or **`async/await`**.

In this topic, we'll cover:

- `.catch()`
- `try...catch`
- Promise rejection
- Await rejection
- Unhandled Promise Rejections
- `.catch()` vs `try...catch`

---

### ⚙️ Main Explanation

#### Error Handling with Promises

Promises use the `.catch()` method to handle errors.

Example:

```js
fetchUser()
  .then((user) => {
    console.log(user);
  })
  .catch((error) => {
    console.log(error);
  });
```

If the Promise is rejected, `.catch()` is executed.

---

#### Error Handling with `async/await`

With `async/await`, errors are typically handled using `try...catch`.

Example:

```js
async function loadUser() {
  try {
    const user =
      await fetchUser();

    console.log(user);
  } catch (error) {
    console.log(error);
  }
}
```

This resembles synchronous error handling and is easier to read for multiple awaited operations.

---

#### What Happens if an Awaited Promise Rejects?

Suppose:

```js
await fetchUser();
```

If `fetchUser()` returns a rejected Promise:

```text
Promise Rejects

↓

Exception Thrown

↓

Control Moves to

↓

catch Block
```

Example:

```js
async function demo() {
  try {
    await Promise.reject(
      "Network Error"
    );
  } catch (error) {
    console.log(error);
  }
}
```

Output:

```text
Network Error
```

---

#### What is Promise Rejection?

A Promise is **rejected** when something goes wrong during an asynchronous operation.

Example:

```js
Promise.reject(
  "Server Error"
);
```

or

```js
reject(
  "Server Error"
);
```

Rejected Promises should always be handled.

---

#### Unhandled Promise Rejections

If a rejected Promise is never handled:

```js
Promise.reject(
  "Error"
);
```

JavaScript reports an **Unhandled Promise Rejection**.

Depending on the environment:

- The browser logs an error.
- Node.js may terminate the process (depending on configuration and version).

Unhandled rejections can make applications unstable.

---

#### `.catch()` vs `try...catch`

| `.catch()` | `try...catch` |
|------------|---------------|
| Used with Promise chains | Used with `async/await` |
| Handles rejected Promises | Handles exceptions thrown by awaited Promises |
| Chain-based syntax | Sequential syntax |
| Common in Promise-based code | Preferred with `async/await` |

---

#### Which One Should You Use?

If using:

```js
fetch()
  .then(...)
```

Use:

```js
.catch(...)
```

If using:

```js
async

await
```

Use:

```js
try...

catch
```

---

#### Error Propagation

Errors automatically move to the nearest handler.

Example:

```js
fetchUser()
  .then(() => {
    throw new Error(
      "Oops"
    );
  })
  .then(() => {
    console.log("Next");
  })
  .catch((error) => {
    console.log(
      error.message
    );
  });
```

The error skips the remaining `.then()` callbacks and is handled by `.catch()`.

Similarly:

```js
async function demo() {
  try {
    await fetchUser();

    throw new Error(
      "Oops"
    );
  } catch (error) {
    console.log(
      error.message
    );
  }
}
```

The thrown error is caught by `catch`.

---

#### Common Mistakes

**Forgetting to Handle Promise Rejections**

Incorrect:

```js
fetchUser();
```

Always handle errors:

```js
fetchUser()
  .catch(handleError);
```

or

```js
try {
  await fetchUser();
} catch (error) {
  handleError(error);
}
```

---

**Using Both `.catch()` and `try...catch` Unnecessarily**

Choose the style that matches your code:

- Promise chains → `.catch()`
- `async/await` → `try...catch`

---

#### Best Practices

When handling asynchronous errors:

- Always handle rejected Promises.
- Prefer `try...catch` when using `async/await`.
- Prefer a single `.catch()` at the end of a Promise chain.
- Log errors appropriately and provide meaningful feedback to users.
- Avoid swallowing errors silently.

---

> 💡 **Coming Next**
>
> In the next topic, we'll learn how to execute multiple asynchronous operations efficiently using **Sequential and Parallel Execution**.

---

### 💻 Example

**Promise**

```js
fetchUser()
  .then(console.log)
  .catch(console.error);
```

---

**Async/Await**

```js
async function load() {
  try {
    const user =
      await fetchUser();

    console.log(user);
  } catch (error) {
    console.error(error);
  }
}
```

Both approaches handle errors correctly.

---

### 📊 Diagram / Flow

#### Promise Error Flow

```text
Promise

↓

.then()

↓

Error

↓

.catch()
```

---

#### Async/Await Error Flow

```text
try

↓

await

↓

Promise Rejects

↓

catch
```

---

#### Unhandled Rejection

```text
Promise Rejects

↓

No Handler

↓

Unhandled Promise Rejection
```

---

### 🌍 Real-World Example

Imagine an online banking application.

When a customer requests their account balance:

1. The application sends an API request.
2. If the request succeeds, the balance is displayed.
3. If the server is unavailable or the network fails, the Promise is rejected.
4. Using `try...catch` (or `.catch()`), the application displays an error message such as **"Unable to fetch account details. Please try again later."** instead of crashing.

Proper error handling ensures the application remains stable and provides a better user experience.

---

### 🎤 Interview Answer

Errors in asynchronous JavaScript are handled differently depending on the programming style. When using Promises, errors are handled with the `.catch()` method, while `async/await` typically uses `try...catch`. If an awaited Promise rejects, it throws an exception that can be caught by the surrounding `try...catch` block. Similarly, errors thrown inside Promise chains automatically propagate to the nearest `.catch()`. Developers should always handle Promise rejections to avoid unhandled Promise rejection errors, which can cause unexpected application behavior or even terminate a Node.js process in some environments.

---

### ❓ Follow-up Questions

1. How do you handle errors in Promises?
2. How do you handle errors with `async/await`?
3. What happens if an awaited Promise rejects?
4. What is an Unhandled Promise Rejection?
5. What is the difference between `.catch()` and `try...catch`?
6. Why should every Promise rejection be handled?
7. What happens when an error is thrown inside a Promise chain?

---

## 8. What is the difference between Sequential and Parallel Execution?

### 📖 Overview

When working with multiple asynchronous operations, you can execute them in two ways:

- **Sequential Execution** → One task starts only after the previous one finishes.
- **Parallel Execution** → Multiple tasks start at the same time.

Choosing the right approach can significantly impact your application's performance.

A common interview question is:

> **Why can sequential `await` be slower than parallel execution?**

---

### ⚙️ Main Explanation

#### Sequential Execution

In sequential execution, each asynchronous operation waits for the previous one to complete.

Example:

```js
async function loadData() {
  const users =
    await fetchUsers();

  const products =
    await fetchProducts();

  const orders =
    await fetchOrders();
}
```

Execution Flow:

```text
Fetch Users

↓

Wait

↓

Fetch Products

↓

Wait

↓

Fetch Orders
```

Each request begins **only after** the previous request finishes.

---

#### When Should You Use Sequential Execution?

Sequential execution is required when:

- One request depends on another.
- The result of one operation is needed before starting the next.

Example:

```text
Login User

↓

Get Token

↓

Fetch Profile

↓

Place Order
```

Here, every step depends on the previous one.

---

#### Parallel Execution

In parallel execution, multiple asynchronous operations start **at the same time**.

The most common way is using:

```js
Promise.all()
```

Example:

```js
async function loadData() {
  const [
    users,
    products,
    orders,
  ] =
    await Promise.all([
      fetchUsers(),
      fetchProducts(),
      fetchOrders(),
    ]);
}
```

Execution Flow:

```text
Fetch Users

─────────────┐

Fetch Products

─────────────┤

Fetch Orders

─────────────┘

↓

Wait for All

↓

Continue
```

All requests start immediately, reducing the total waiting time.

---

#### Why is Sequential `await` Slower?

Suppose each API takes **2 seconds**.

Sequential:

```text
2 sec

+

2 sec

+

2 sec

=

6 seconds
```

Parallel:

```text
2 sec

↓

All Together

↓

2 seconds
```

The total execution time is determined by the **slowest request**, not the sum of all request times.

---

#### Sequential vs Parallel

| Sequential | Parallel |
|------------|----------|
| Tasks run one after another | Tasks start together |
| Slower for independent tasks | Faster for independent tasks |
| Used for dependent operations | Used for independent operations |

---

#### How to Execute Multiple Operations Concurrently

The most common approach is:

```js
await Promise.all([
  task1(),
  task2(),
  task3(),
]);
```

This starts all three tasks simultaneously and waits until they all complete.

---

#### Choosing the Right Approach

Use **Sequential Execution** when:

- Requests depend on previous results.
- Operations must happen in a specific order.

Use **Parallel Execution** when:

- Requests are independent.
- Faster execution is desired.
- Multiple API calls can be made simultaneously.

---

#### Common Mistakes

**Using Sequential `await` for Independent Requests**

Incorrect:

```js
const users =
  await fetchUsers();

const products =
  await fetchProducts();

const orders =
  await fetchOrders();
```

These requests are independent and unnecessarily slow.

Better:

```js
const [
  users,
  products,
  orders,
] =
  await Promise.all([
    fetchUsers(),
    fetchProducts(),
    fetchOrders(),
  ]);
```

---

**Using `Promise.all()` for Dependent Tasks**

If one request requires the result of another, `Promise.all()` cannot be used.

Example:

```text
Login

↓

Token

↓

Profile
```

These operations must remain sequential.

---

#### Best Practices

When working with asynchronous operations:

- Use sequential execution only when tasks depend on one another.
- Use `Promise.all()` for independent API requests.
- Optimize dashboards and data-loading pages by fetching resources concurrently.
- Balance performance with business logic requirements.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Common Mistakes with Promises and `async/await`**, along with production best practices for writing reliable asynchronous JavaScript.

---

### 💻 Example

**Sequential**

```js
const users =
  await fetchUsers();

const products =
  await fetchProducts();
```

---

**Parallel**

```js
const [
  users,
  products,
] =
  await Promise.all([
    fetchUsers(),
    fetchProducts(),
  ]);
```

Both approaches produce the same result, but the second is usually faster when the requests are independent.

---

### 📊 Diagram / Flow

#### Sequential Execution

```text
Task 1

↓

Wait

↓

Task 2

↓

Wait

↓

Task 3
```

---

#### Parallel Execution

```text
Task 1

─────────────┐

Task 2

─────────────┤

Task 3

─────────────┘

↓

Wait for All

↓

Continue
```

---

#### Time Comparison

```text
Sequential

2 + 2 + 2

=

6 sec

--------------------

Parallel

2 sec

(All Together)

=

2 sec
```

---

### 🌍 Real-World Example

Imagine an admin dashboard that needs to display:

- User statistics
- Product inventory
- Recent orders

These three API requests are independent.

Instead of fetching them one by one, the application starts all three requests simultaneously using `Promise.all()`. This significantly reduces the page's loading time because all data is fetched concurrently.

On the other hand, during user authentication, the application must first log the user in, receive an authentication token, and then use that token to fetch the user's profile. Since each step depends on the previous one, sequential execution is the correct approach.

---

### 🎤 Interview Answer

Sequential execution runs asynchronous operations one after another, where each `await` waits for the previous operation to finish. This is necessary when tasks depend on one another but can be slower because the waiting times accumulate. Parallel execution starts multiple independent asynchronous operations simultaneously, typically using `Promise.all()`, and waits for all of them to complete. This improves performance because the total execution time is determined by the slowest operation rather than the sum of all operations. In production, dependent tasks should use sequential execution, while independent tasks should be executed in parallel whenever possible.

---

### ❓ Follow-up Questions

1. What is sequential execution?
2. What is parallel execution?
3. Why can sequential `await` be slower?
4. How do you execute multiple asynchronous operations concurrently?
5. When should you use `Promise.all()`?
6. When should you avoid `Promise.all()`?
7. What is the difference between sequential and parallel execution?
8. How would you optimize multiple API requests in a dashboard?

---

## 9. What are common mistakes developers make while using Promises and `async/await`?

### 📖 Overview

Promises and `async/await` make asynchronous programming much easier, but developers still make common mistakes that can lead to:

- Poor performance.
- Unexpected bugs.
- Unhandled errors.
- Difficult-to-maintain code.

Understanding these mistakes helps you write cleaner, safer, and more efficient asynchronous code.

---

### ⚙️ Main Explanation

#### Mistake 1: Forgetting to Handle Errors

One of the most common mistakes is creating a Promise without handling possible rejections.

Incorrect:

```js
fetchUser();
```

If the Promise rejects, it becomes an **Unhandled Promise Rejection**.

Correct:

```js
fetchUser()
  .catch(console.error);
```

or

```js
try {
  await fetchUser();
} catch (error) {
  console.error(error);
}
```

---

#### Mistake 2: Forgetting to Return a Promise

Incorrect:

```js
fetchUser()
  .then(() => {
    fetchOrders();
  })
  .then(() => {
    console.log("Done");
  });
```

The second `.then()` executes immediately because `fetchOrders()` wasn't returned.

Correct:

```js
fetchUser()
  .then(() => {
    return fetchOrders();
  })
  .then(() => {
    console.log("Done");
  });
```

---

#### Mistake 3: Using Sequential `await` for Independent Tasks

Incorrect:

```js
const users =
  await fetchUsers();

const products =
  await fetchProducts();

const orders =
  await fetchOrders();
```

These requests run one after another.

Better:

```js
const [
  users,
  products,
  orders,
] =
  await Promise.all([
    fetchUsers(),
    fetchProducts(),
    fetchOrders(),
  ]);
```

---

#### Mistake 4: Forgetting `await`

Incorrect:

```js
const user =
  fetchUser();

console.log(user);
```

Output:

```text
Promise { ... }
```

Instead of the actual data.

Correct:

```js
const user =
  await fetchUser();
```

---

#### Mistake 5: Mixing Promise Chains and `async/await` Unnecessarily

Incorrect:

```js
async function load() {
  await fetchUser()
    .then(console.log);
}
```

This works but mixes two different styles.

Better:

```js
async function load() {
  const user =
    await fetchUser();

  console.log(user);
}
```

Choose one style for better readability.

---

#### Mistake 6: Using `Promise.all()` When Tasks Depend on Each Other

Incorrect:

```text
Login

↓

Token

↓

Profile
```

These operations are dependent.

They should execute sequentially.

---

#### Mistake 7: Ignoring Promise Rejections

Unhandled Promise rejections can:

- Display browser errors.
- Cause unexpected application behavior.
- Terminate a Node.js process in some environments.

Always handle rejected Promises.

---

#### Mistake 8: Thinking `await` Blocks JavaScript

`await` pauses only the current async function.

Other JavaScript code continues executing normally.

Example:

```js
console.log("A");

async function demo() {
  await fetchUser();

  console.log("B");
}

demo();

console.log("C");
```

Output:

```text
A

C

B
```

---

#### Summary of Common Mistakes

| Mistake | Better Approach |
|----------|-----------------|
| Ignoring errors | Use `.catch()` or `try...catch` |
| Forgetting `return` | Return Promises inside `.then()` |
| Sequential independent requests | Use `Promise.all()` |
| Forgetting `await` | Await asynchronous functions |
| Mixing styles | Choose Promise chaining or `async/await` |
| Using `Promise.all()` for dependent tasks | Use sequential execution |
| Ignoring Promise rejections | Always handle errors |

---

#### Best Practices

When writing asynchronous code:

- Always handle Promise rejections.
- Prefer `async/await` for readability.
- Use `Promise.all()` for independent operations.
- Keep one consistent asynchronous style within a function.
- Return Promises properly inside `.then()` chains.
- Avoid unnecessary nesting.

---

> 💡 **Coming Next**
>
> In the next topic, we'll learn the **production best practices** for designing reliable and scalable asynchronous JavaScript applications.

---

### 💻 Example

Incorrect:

```js
async function load() {
  fetchUser();
}
```

The Promise is ignored.

Correct:

```js
async function load() {
  try {
    const user =
      await fetchUser();

    console.log(user);
  } catch (error) {
    console.error(error);
  }
}
```

---

### 📊 Diagram / Flow

#### Correct Error Handling

```text
Promise

↓

Success

↓

Continue

--------------------

Failure

↓

.catch()

or

try...catch
```

---

#### Parallel Execution

```text
Task 1

────────────┐

Task 2

────────────┤

Task 3

────────────┘

↓

Promise.all()
```

---

#### Sequential Execution

```text
Task 1

↓

Task 2

↓

Task 3
```

---

### 🌍 Real-World Example

Imagine you're building an e-commerce dashboard.

The page needs to load:

- Products
- Orders
- Customers

Fetching them one by one increases the page's loading time.

Instead, using `Promise.all()` allows all requests to run concurrently.

At the same time, every API request is wrapped in `try...catch` so that failures are handled gracefully instead of crashing the application.

Following these practices results in a faster, more reliable, and easier-to-maintain application.

---

### 🎤 Interview Answer

Some common mistakes developers make while using Promises and `async/await` include forgetting to handle Promise rejections, not returning Promises inside `.then()` chains, using sequential `await` for independent operations, forgetting to use `await`, mixing Promise chaining with `async/await`, and ignoring unhandled Promise rejections. Developers should also avoid using `Promise.all()` for dependent operations and remember that `await` pauses only the current async function rather than blocking JavaScript execution. Following these best practices leads to cleaner, more reliable asynchronous code.

---

### ❓ Follow-up Questions

1. What are common mistakes with Promises?
2. What are common mistakes with `async/await`?
3. Why should every Promise rejection be handled?
4. Why is forgetting to return a Promise inside `.then()` a problem?
5. Why is sequential `await` slower for independent tasks?
6. Why shouldn't you mix Promise chains and `async/await` unnecessarily?
7. Does `await` block JavaScript execution?

---

## 10. What are the Production Best Practices for Asynchronous JavaScript?

### 📖 Overview

Writing asynchronous code is not just about making API calls—it is about making them **efficient, reliable, maintainable, and resilient**.

In production applications, developers should consider:

- Performance
- Error handling
- Scalability
- User experience
- Network failures
- Request cancellation

Following best practices helps build applications that remain responsive even when asynchronous operations fail.

---

### ⚙️ Main Explanation

#### 1. Prefer `async/await` for Readability

For complex asynchronous workflows, `async/await` is generally easier to read than long Promise chains.

Example:

```js
async function loadUser() {
  const user =
    await fetchUser();

  const orders =
    await fetchOrders(user.id);
}
```

The code reads from top to bottom, making it easier to understand and maintain.

---

#### 2. Always Handle Errors

Never assume an asynchronous operation will always succeed.

Use:

```js
try {
  const data =
    await fetchData();
} catch (error) {
  console.error(error);
}
```

or:

```js
fetchData()
  .catch(console.error);
```

Unhandled Promise rejections can lead to unstable applications.

---

#### 3. Execute Independent Tasks in Parallel

Incorrect:

```js
await fetchUsers();

await fetchProducts();

await fetchOrders();
```

Better:

```js
await Promise.all([
  fetchUsers(),
  fetchProducts(),
  fetchOrders(),
]);
```

Running independent requests concurrently improves performance.

---

#### 4. Retry Temporary Failures

Some failures are temporary, such as:

- Network interruptions
- Server overload
- Rate limiting

Instead of failing immediately, applications often retry the request after a short delay.

Conceptually:

```text
Request

↓

Fails

↓

Wait

↓

Retry
```

Many HTTP libraries provide retry mechanisms, or you can implement your own retry logic.

---

#### 5. Cancel Unnecessary Requests

Sometimes users navigate away from a page before a request completes.

Instead of allowing unnecessary requests to continue, they should be cancelled.

Modern browsers provide:

```text
AbortController
```

to cancel pending `fetch()` requests.

Benefits include:

- Reduced network usage.
- Better performance.
- Avoiding updates to unmounted components (especially in React).

---

#### 6. Handle Partial Failures

Not every request should fail the entire application.

Example:

An admin dashboard loads:

- Users
- Products
- Notifications

If notifications fail, the rest of the dashboard can still be displayed.

In such cases:

```js
Promise.allSettled()
```

is a better choice than `Promise.all()`.

---

#### 7. Create a Dedicated API Layer

Instead of calling `fetch()` throughout the application:

```text
Component

↓

fetch()
```

use:

```text
Component

↓

API Service

↓

fetch()
```

Benefits:

- Reusable code.
- Centralized error handling.
- Easier testing.
- Easier maintenance.

---

#### 8. Avoid Blocking the User Interface

Long-running operations should:

- Display loading indicators.
- Disable buttons when appropriate.
- Keep the interface responsive.

A good user experience is just as important as correct functionality.

---

#### Production Workflow

A typical asynchronous workflow looks like this:

```text
User Action

↓

API Layer

↓

Async Request

↓

Success?

↓

Yes

↓

Update UI

--------------------

No

↓

Retry / Error Message
```

---

#### Common Mistakes

- Ignoring rejected Promises.
- Using sequential `await` unnecessarily.
- Forgetting to cancel obsolete requests.
- Scattering API logic throughout the application.
- Failing the entire page because one request failed.

---

#### Best Practices Summary

- Prefer `async/await` for readability.
- Always handle errors.
- Use `Promise.all()` for independent operations.
- Use `Promise.allSettled()` when partial failures are acceptable.
- Retry temporary failures when appropriate.
- Cancel unnecessary requests using `AbortController`.
- Centralize API logic.
- Keep the UI responsive with loading and error states.

---

> 💡 **Coming Next**
>
> In the next topic, we'll see how **React, Next.js, and Node.js** rely heavily on Promises and `async/await` in real-world applications.

---

### 💻 Example

```js
async function loadDashboard() {
  try {
    const [
      users,
      products,
      orders,
    ] =
      await Promise.all([
        fetchUsers(),
        fetchProducts(),
        fetchOrders(),
      ]);

    console.log({
      users,
      products,
      orders,
    });
  } catch (error) {
    console.error(error);
  }
}
```

This example:

- Executes requests in parallel.
- Handles errors.
- Keeps the code clean and readable.

---

### 📊 Diagram / Flow

#### Recommended Architecture

```text
UI

↓

API Layer

↓

Async Request

↓

Response

↓

Update UI
```

---

#### Parallel Requests

```text
Request 1

────────────┐

Request 2

────────────┤

Request 3

────────────┘

↓

Promise.all()
```

---

#### Error Handling

```text
Request

↓

Success

↓

Update UI

--------------------

Failure

↓

Error Handling
```

---

### 🌍 Real-World Example

Imagine an e-commerce homepage.

When the page loads, it needs to fetch:

- Featured products
- Categories
- User recommendations
- Shopping cart

Since these requests are independent, they are executed in parallel using `Promise.all()`.

If the user leaves the page before the requests finish, `AbortController` is used to cancel them.

If a temporary network issue occurs, the application retries the request before showing an error message.

By organizing API calls in a dedicated service layer and handling errors consistently, the application remains fast, reliable, and easy to maintain.

---

### 🎤 Interview Answer

In production applications, asynchronous code should be written with readability, performance, and reliability in mind. Developers generally prefer `async/await` for complex workflows, always handle Promise rejections using `try...catch` or `.catch()`, and execute independent asynchronous operations in parallel using `Promise.all()`. Temporary failures can be handled with retry mechanisms, while unnecessary requests should be cancelled using `AbortController`. Applications should also use `Promise.allSettled()` when partial failures are acceptable and organize network requests in a dedicated API layer. These practices improve performance, maintainability, and the overall user experience.

---

### ❓ Follow-up Questions

1. What are the best practices for asynchronous JavaScript?
2. Why should independent API requests use `Promise.all()`?
3. When should `Promise.allSettled()` be used?
4. Why is `AbortController` useful?
5. Why should applications have a dedicated API layer?
6. How would you handle temporary API failures?
7. How do you keep the UI responsive during asynchronous operations?

---