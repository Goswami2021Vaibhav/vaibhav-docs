---
title: Error Handling
description: try/catch/finally, custom errors, and handling errors in async code.
sidebar_position: 19
---

# Error Handling

## 1. What is an error in JavaScript, why does it occur, and what are the different types of errors?

### 📖 Overview

An **error** is an unexpected problem that occurs while a JavaScript program is being parsed or executed. When an error occurs, JavaScript cannot continue executing the affected code normally, so it throws an **Error object** describing what went wrong.

Errors can happen for many reasons, such as:

- Writing invalid JavaScript syntax.
- Calling a function incorrectly.
- Accessing a property that doesn't exist.
- Performing an invalid operation.
- Receiving unexpected data from an API.

Understanding errors is important because they help developers identify bugs, prevent application crashes, and build reliable software.

---

### 🎯 Why Do Errors Occur?

Errors occur whenever JavaScript encounters a situation that prevents it from executing code correctly.

Some common causes include:

- Typing mistakes in the code.
- Incorrect program logic.
- Invalid user input.
- Missing or unavailable resources.
- Network failures.
- Incorrect API responses.
- Programming mistakes made by developers.

Not every mistake produces an error. Some mistakes simply produce unexpected results, while others stop the program entirely.

---

### ⚙️ How Does JavaScript Handle Errors?

When JavaScript encounters an error, it follows these general steps:

1. It detects that something has gone wrong.
2. It creates an **Error object** containing information about the problem.
3. If the error is handled using `try...catch`, control is transferred to the `catch` block.
4. If the error is not handled, JavaScript stops executing the current operation and reports the error to the console or runtime.

For example:

```js
console.log(user.name);
```

If `user` has never been declared, JavaScript throws:

```text
ReferenceError: user is not defined
```

Instead of silently continuing, JavaScript reports the problem so developers can fix it.

---

### 🏷️ Different Types of Errors

JavaScript errors can be broadly divided into two categories.

#### 1. Syntax Errors

A **Syntax Error** occurs when JavaScript cannot understand the code because it violates the language's grammar rules.

Example:

```js
if (true {
  console.log("Hello");
}
```

Output:

```text
SyntaxError: Unexpected token '{'
```

Since the code is invalid, JavaScript cannot even begin executing it.

---

#### 2. Runtime Errors

A **Runtime Error** occurs after the program has started executing.

The syntax is correct, but something goes wrong while the program is running.

Example:

```js
const user = null;

console.log(user.name);
```

Output:

```text
TypeError: Cannot read properties of null
```

The code is syntactically valid, but it fails during execution.

---

### 🏗️ Common Built-in Error Types

JavaScript provides several built-in error types.

| Error Type | Description |
|------------|-------------|
| `SyntaxError` | Invalid JavaScript syntax. |
| `ReferenceError` | Accessing a variable that doesn't exist. |
| `TypeError` | Performing an operation on an incompatible value or type. |
| `RangeError` | A value is outside the allowed range. |
| `URIError` | Incorrect use of URI encoding or decoding functions. |
| `EvalError` | Related to the `eval()` function (rare in modern JavaScript). |
| `AggregateError` | Represents multiple errors grouped together, commonly used with `Promise.any()`. |

We'll learn about each of these error types in more detail later in this chapter.

---

### ⚠️ Errors vs Bugs

These terms are often confused, but they are not the same.

| Error | Bug |
|--------|-----|
| Reported by JavaScript or the runtime. | A mistake in the program's logic. |
| Usually stops or interrupts execution. | May produce incorrect results without throwing an error. |
| Often includes an Error object and stack trace. | May not produce any visible error message. |

Example of a bug:

```js
function add(a, b) {
  return a - b;
}

console.log(add(5, 3));
```

Output:

```text
2
```

No error occurs, but the function produces the wrong result because of a logical mistake.

---

### 🌍 Real-World Example

Imagine you're baking a cake.

A **Syntax Error** is like forgetting to add the baking tray before putting the cake in the oven. The recipe cannot even begin properly.

A **Runtime Error** is like the oven suddenly losing power while the cake is baking. Everything started correctly, but something went wrong during the process.

A **Bug** is like accidentally adding salt instead of sugar. The cake is successfully baked, but the result isn't what you intended.

---

### 💡 Note

Not every error crashes the entire application.

If an error is properly handled using mechanisms like `try...catch`, the application can recover and continue running.

Modern JavaScript applications use error handling extensively to provide better user experiences instead of abruptly stopping execution.

---

### 🎤 Interview Answer

An error in JavaScript is an unexpected problem that occurs while the code is being parsed or executed. When JavaScript detects an error, it creates an Error object containing information about the problem. Errors commonly occur because of invalid syntax, incorrect operations, invalid input, or runtime failures. Broadly, errors are classified into Syntax Errors, which prevent code from being parsed, and Runtime Errors, which occur while the program is executing. JavaScript also provides several built-in error types, such as `SyntaxError`, `ReferenceError`, `TypeError`, `RangeError`, `URIError`, `EvalError`, and `AggregateError`.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is exception handling in JavaScript?
- How do `try`, `catch`, `finally`, and `throw` work?
- What is the `Error` object?
- What is the difference between an error and an exception?
- What are the different built-in Error types in JavaScript?

---

## 2. What is exception handling in JavaScript, and how do `try`, `catch`, `finally`, and `throw` work internally?

### 📖 Overview

**Exception handling** is the process of detecting, handling, and recovering from runtime errors so that a JavaScript program can continue executing instead of terminating unexpectedly.

JavaScript provides four keywords for exception handling:

- `try`
- `catch`
- `finally`
- `throw`

Together, they allow developers to:

- Detect runtime errors.
- Handle errors gracefully.
- Execute cleanup code.
- Create and throw custom errors.

Without exception handling, an unhandled runtime error may stop the execution of the current program or operation.

---

### 🎯 Why Do We Need Exception Handling?

Imagine an application that fetches user data from a server.

If the server is unavailable and the error isn't handled, the application may crash or show a blank page.

Instead, we can catch the error and display a user-friendly message.

```js
try {
  const user = getUser();
  console.log(user.name);
} catch (error) {
  console.log("Unable to load user.");
}
```

Instead of stopping execution, the application handles the problem gracefully.

Exception handling helps make applications:

- More reliable
- Easier to debug
- More user-friendly
- More resilient to unexpected failures

---

### ⚙️ How Does Exception Handling Work?

When JavaScript executes a `try` block, it continuously watches for exceptions.

If no exception occurs:

- The `try` block finishes normally.
- The `catch` block is skipped.
- The `finally` block executes (if present).

If an exception occurs:

- JavaScript immediately stops executing the remaining code inside the `try` block.
- It creates or receives an Error object.
- Control jumps to the matching `catch` block.
- After the `catch` block finishes, the `finally` block executes (if present).

---

### 🏗️ The `try` Statement

The `try` block contains code that might throw an exception.

```js
try {
  console.log("Start");

  const user = null;

  console.log(user.name);

  console.log("End");
}
```

Execution stops at:

```js
console.log(user.name);
```

The remaining statements inside the `try` block are skipped.

---

### 🏗️ The `catch` Statement

The `catch` block handles the exception thrown inside the `try` block.

```js
try {
  const user = null;

  console.log(user.name);
} catch (error) {
  console.log("Something went wrong.");
}
```

The variable (`error`) contains the Error object.

Example:

```js
console.log(error.name);
console.log(error.message);
```

Output:

```text
TypeError
Cannot read properties of null
```

This information is useful for debugging and logging.

---

### 🏗️ The `finally` Statement

The `finally` block always executes after the `try` or `catch` block, regardless of whether an exception occurred.

```js
try {
  console.log("Working...");
} finally {
  console.log("Cleanup");
}
```

Output:

```text
Working...
Cleanup
```

Even if an error occurs:

```js
try {
  throw new Error("Failed");
} catch (error) {
  console.log(error.message);
} finally {
  console.log("Always runs");
}
```

Output:

```text
Failed
Always runs
```

The `finally` block is commonly used for cleanup tasks such as:

- Closing database connections
- Releasing resources
- Stopping loaders
- Removing event listeners
- Closing files (Node.js)

---

### 🏗️ The `throw` Statement

The `throw` statement allows developers to generate their own exceptions.

```js
throw new Error("Invalid input");
```

When JavaScript encounters `throw`:

1. It immediately stops executing the current block.
2. It creates (or uses) the provided error.
3. Control transfers to the nearest matching `catch` block.

Example:

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed.");
  }

  return a / b;
}
```

This allows developers to report invalid situations instead of allowing incorrect behavior.

---

### 🏗️ Internal Working

The overall execution flow looks like this:

```
Start try Block
        │
        ▼
Did an Exception Occur?
      │          │
     No         Yes
      │          │
      ▼          ▼
Skip catch   Jump to catch
      │          │
      └──────┬───┘
             ▼
     Execute finally
             │
             ▼
 Continue Execution
```

Notice that the `finally` block executes in both cases.

---

### ⚠️ Important Rules

#### Rule 1

A `catch` block executes **only if an exception occurs**.

---

#### Rule 2

A `finally` block executes whether an exception occurs or not.

---

#### Rule 3

After an exception is thrown, JavaScript skips the remaining code inside the `try` block.

Example:

```js
try {
  console.log("A");

  throw new Error("Oops");

  console.log("B");
} catch (error) {
  console.log("C");
}
```

Output:

```text
A
C
```

`"B"` is never executed.

---

#### Rule 4

A `throw` statement can throw:

- Error objects (recommended)
- Strings
- Numbers
- Booleans
- Objects

Example:

```js
throw "Something went wrong";
```

Although JavaScript allows this, **throwing Error objects is considered best practice** because they include useful debugging information such as the error name and stack trace.

---

### 🌍 Real-World Example

Imagine you're working in a laboratory.

- The **experiment** is the `try` block.
- If something goes wrong, an **alarm** is triggered (`throw`).
- The **emergency response team** handles the situation (`catch`).
- Afterward, the lab is cleaned and equipment is reset (`finally`), regardless of whether the experiment succeeded or failed.

This ensures the laboratory is always left in a safe state.

---

### 💡 Note

Exception handling is primarily designed for **runtime errors**.

It **cannot** handle syntax errors that prevent JavaScript from parsing the code in the first place.

For example:

```js
try {
  if (true {
    console.log("Hello");
  }
} catch (error) {
  console.log("Won't execute");
}
```

This code fails before execution begins because the syntax itself is invalid.

---

### 🎤 Interview Answer

Exception handling is the mechanism used to detect and recover from runtime errors in JavaScript. It is implemented using the `try`, `catch`, `finally`, and `throw` statements. Code that might throw an exception is placed inside a `try` block. If an exception occurs, JavaScript stops executing the remaining code in the `try` block and transfers control to the `catch` block, where the error can be handled. The `finally` block executes regardless of whether an exception occurs, making it ideal for cleanup tasks. Developers can also use the `throw` statement to create custom exceptions when invalid situations occur.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is the `Error` object in JavaScript?
- What built-in Error types are available?
- How does error propagation work?
- Can `try...catch` handle asynchronous errors?
- When should you use `throw` instead of returning an error?

---

## 3. What are JavaScript Error objects, what built-in error types are available, and how can you create custom errors?

### 📖 Overview

When JavaScript encounters an exceptional situation, it creates an **Error object** that describes what went wrong.

An **Error object** contains useful information such as:

- The type of error.
- A descriptive error message.
- The location where the error occurred.
- The call stack that led to the error.

JavaScript provides several built-in Error types for common situations, and developers can also create their own custom Error objects to represent application-specific problems.

---

### 🎯 Why Do We Need Error Objects?

Imagine an application simply displayed:

```text
Something went wrong.
```

This message doesn't tell the developer:

- What failed?
- Where did it fail?
- Why did it fail?

Instead, JavaScript creates an Error object containing detailed information that helps developers debug the problem.

For example:

```text
TypeError: Cannot read properties of null
```

This immediately tells us:

- The error type is `TypeError`.
- The problem is trying to access a property on `null`.

Error objects make debugging and error handling much easier.

---

### ⚙️ What Is an Error Object?

An Error object is simply a JavaScript object that represents an error.

You can create one manually:

```js
const error = new Error("Something went wrong");
```

This creates an Error object, but it does **not** throw it.

To throw the error:

```js
throw error;
```

or

```js
throw new Error("Something went wrong");
```

---

### 🏗️ Common Properties of an Error Object

An Error object contains several useful properties.

#### `name`

Represents the type of the error.

```js
const error = new Error("Invalid input");

console.log(error.name);
```

Output:

```text
Error
```

For built-in errors, this might be:

```text
TypeError
ReferenceError
RangeError
```

---

#### `message`

Contains the descriptive error message.

```js
const error = new Error("Invalid email");

console.log(error.message);
```

Output:

```text
Invalid email
```

---

#### `stack`

Contains the **stack trace**, showing where the error occurred and the sequence of function calls that led to it.

```js
console.log(error.stack);
```

Example:

```text
Error: Invalid email
    at validateUser (...)
    at registerUser (...)
```

We'll learn more about stack traces later in this chapter.

---

### 🏗️ Built-in Error Types

JavaScript provides several built-in Error classes for different situations.

---

#### 1. `Error`

The generic base error type.

```js
throw new Error("Something went wrong");
```

Use it when no specific built-in error type fits the situation.

---

#### 2. `SyntaxError`

Occurs when JavaScript encounters invalid syntax while parsing the code.

Example:

```js
if (true {
  console.log("Hello");
}
```

Output:

```text
SyntaxError
```

Since the code cannot be parsed, execution never begins.

---

#### 3. `ReferenceError`

Occurs when trying to access a variable that hasn't been declared.

```js
console.log(user);
```

Output:

```text
ReferenceError: user is not defined
```

---

#### 4. `TypeError`

Occurs when an operation is performed on an incompatible value.

```js
const user = null;

console.log(user.name);
```

Output:

```text
TypeError: Cannot read properties of null
```

---

#### 5. `RangeError`

Occurs when a value is outside the allowed range.

Example:

```js
const numbers = new Array(-1);
```

Output:

```text
RangeError: Invalid array length
```

---

#### 6. `URIError`

Occurs when URI encoding or decoding functions receive invalid input.

Example:

```js
decodeURIComponent("%");
```

Output:

```text
URIError
```

---

#### 7. `EvalError`

Historically related to incorrect use of `eval()`.

Modern JavaScript rarely throws this error because `eval()` is discouraged.

---

#### 8. `AggregateError`

Represents multiple errors grouped together.

It is commonly used with `Promise.any()`.

Example:

```js
Promise.any([
  Promise.reject("A"),
  Promise.reject("B")
]);
```

If every Promise is rejected, JavaScript throws an `AggregateError` containing all rejection reasons.

---

### ⚖️ Summary of Built-in Error Types

| Error Type | Occurs When |
|------------|-------------|
| `Error` | Generic error |
| `SyntaxError` | Invalid JavaScript syntax |
| `ReferenceError` | Variable is not defined |
| `TypeError` | Invalid operation on a value |
| `RangeError` | Value is outside the allowed range |
| `URIError` | Invalid URI encoding or decoding |
| `EvalError` | Related to `eval()` (rare) |
| `AggregateError` | Multiple errors grouped together |

---

### ⚙️ How Can You Create Custom Errors?

Sometimes the built-in Error types are not descriptive enough.

Instead of:

```js
throw new Error("Error");
```

You can provide a meaningful message:

```js
throw new Error("Email address is required.");
```

or

```js
throw new Error("User must be at least 18 years old.");
```

This makes debugging much easier because the error clearly explains the problem.

> **Note:** In the next section of this chapter, we'll learn how to create **custom error classes** by extending the `Error` class, allowing us to define our own error types such as `ValidationError` or `AuthenticationError`.

---

### 🌍 Real-World Example

Imagine a hospital.

Whenever a patient arrives with a problem, the doctor prepares a medical report.

The report contains:

- The type of illness.
- A description of the symptoms.
- The patient's history.

Similarly, an Error object contains:

| Hospital Report | Error Object |
|-----------------|--------------|
| Illness | `name` |
| Symptoms | `message` |
| Medical history | `stack` |

The report helps doctors diagnose the issue, just as an Error object helps developers debug their code.

---

### 💡 Note

Although JavaScript allows throwing almost any value, such as:

```js
throw "Something went wrong";
```

or

```js
throw 404;
```

this is **not recommended**.

Throwing an `Error` object is the preferred approach because it provides useful information like the error name, message, and stack trace.

---

### 🎤 Interview Answer

An Error object is a JavaScript object that represents an exceptional condition during program execution. It contains useful information such as the error name, message, and stack trace. JavaScript provides several built-in Error types, including `SyntaxError`, `ReferenceError`, `TypeError`, `RangeError`, `URIError`, `EvalError`, and `AggregateError`, each designed for specific situations. Developers can also create custom Error objects with meaningful messages and, when needed, create custom error classes by extending the `Error` class to represent application-specific errors.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- How does error propagation work in JavaScript?
- How can you create custom error classes?
- What is the difference between `Error` and `TypeError`?
- What is a stack trace, and how is it generated?
- Why should you throw Error objects instead of strings?

---

## 4. How does error propagation (exception bubbling) work in JavaScript?

### 📖 Overview

**Error propagation**, also known as **exception bubbling**, is the process by which a thrown error travels up the **Call Stack** until it is handled.

When an exception occurs, JavaScript first looks for a `catch` block in the current function. If no matching `catch` block is found, the error automatically propagates to the calling function. This process continues until:

- A matching `catch` block handles the error, or
- The error reaches the global scope and becomes an **unhandled exception**.

Understanding error propagation helps developers decide **where an error should be handled** and avoid unnecessary or duplicate error handling.

---

### 🎯 Why Does Error Propagation Exist?

Imagine a function deep inside your application encounters an error.

Should that function always handle the error itself?

Not necessarily.

Sometimes, the calling function has more context and is better suited to decide what to do.

For example:

- A utility function may detect an invalid input.
- A service function may decide whether to retry.
- A controller may return an error response to the user.

Instead of forcing every function to handle its own errors, JavaScript allows errors to **propagate up the Call Stack** until an appropriate handler is found.

---

### ⚙️ How Does Error Propagation Work?

Consider the following functions:

```js
function third() {
  throw new Error("Something went wrong.");
}

function second() {
  third();
}

function first() {
  second();
}

first();
```

Let's understand what happens internally.

---

#### Step 1: Function Calls Are Added to the Call Stack

Execution begins with:

```js
first();
```

The Call Stack becomes:

```
third()
second()
first()
Global
```

---

#### Step 2: An Exception Is Thrown

Inside `third()`:

```js
throw new Error("Something went wrong.");
```

JavaScript immediately stops executing the remaining code in `third()`.

---

#### Step 3: JavaScript Looks for a `catch` Block

JavaScript checks:

- Does `third()` have a matching `catch` block?

No.

So the error propagates to its caller.

---

#### Step 4: The Error Moves Up the Call Stack

JavaScript now checks:

- Does `second()` handle the error?

No.

The error continues to propagate.

Next:

- Does `first()` handle the error?

If yes:

```js
function first() {
  try {
    second();
  } catch (error) {
    console.log(error.message);
  }
}
```

The error is caught here, and propagation stops.

---

#### Step 5: If No Handler Exists

If none of the calling functions handle the exception:

```js
first();
```

JavaScript reports an unhandled error:

```text
Uncaught Error: Something went wrong.
```

The runtime reports the error because it reached the global scope without being handled.

---

### 🏗️ Internal Working

The propagation process looks like this:

```
throw Error
      │
      ▼
Current Function
      │
Has catch?
 ┌────┴────┐
 │         │
Yes        No
 │         │
 ▼         ▼
Handle   Calling Function
              │
         Has catch?
         ┌────┴────┐
         │         │
        Yes        No
         │         │
         ▼         ▼
     Handle     Continue Up
                     │
                     ▼
              Global Scope
                     │
                     ▼
          Unhandled Exception
```

JavaScript continues searching until a handler is found or the Call Stack is exhausted.

---

### ⚠️ What Happens After an Error Is Caught?

Once a `catch` block handles an exception:

- Error propagation stops.
- The program continues executing after the `try...catch` statement.

Example:

```js
try {
  throw new Error("Invalid input");
} catch (error) {
  console.log("Handled");
}

console.log("Program continues");
```

Output:

```text
Handled
Program continues
```

---

### ⚙️ Re-throwing an Error

Sometimes a function performs partial handling, such as logging the error, but wants another function to handle it completely.

In that case, it can **re-throw** the error.

Example:

```js
function processOrder() {
  try {
    throw new Error("Payment failed");
  } catch (error) {
    console.log("Logging error...");

    throw error;
  }
}
```

Here:

1. The error is logged.
2. The same error is thrown again.
3. It continues propagating to the caller.

This allows different layers of an application to perform different responsibilities.

---

### 🌍 Real-World Example

Imagine an office building.

An employee encounters a problem but cannot solve it.

They report it to:

1. Their team leader.
2. If unresolved, the team leader reports it to the manager.
3. If still unresolved, it goes to the department head.
4. Finally, it reaches the CEO.

The issue keeps moving upward until someone has the authority to resolve it.

In this analogy:

| Office | JavaScript |
|---------|------------|
| Employee | Current function |
| Team leader | Calling function |
| Manager | Higher-level function |
| CEO | Global scope |
| Reporting the issue | Error propagation |

---

### 💡 Note

Catching an error isn't always the right place to solve it.

A lower-level function should often:

- Detect the problem.
- Throw an appropriate error.

Higher-level functions can then decide how to respond, such as:

- Showing a user-friendly message.
- Retrying the operation.
- Logging the error.
- Returning an API response.

This separation of responsibilities makes applications easier to maintain.

---

### 🎤 Interview Answer

Error propagation, also called exception bubbling, is the process by which a thrown error moves up the Call Stack until it is caught by a matching `catch` block. When an exception occurs, JavaScript first looks for a `catch` block in the current function. If none exists, the error automatically propagates to the calling function, and this process continues until a handler is found. If no handler exists anywhere in the Call Stack, the error reaches the global scope and becomes an unhandled exception. Developers can also re-throw errors after partial handling, allowing higher-level functions to make application-specific decisions.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- How does error handling work with Promises?
- What is the difference between synchronous and asynchronous error propagation?
- What happens when you re-throw an error?
- What are unhandled Promise rejections?
- When should a function handle an error versus letting it propagate?

---

## 5. How does error handling work with Promises and `async/await`, and what is the difference between `.catch()` and `try...catch`?

### 📖 Overview

Asynchronous operations such as API requests, file operations, and database queries can also fail. Unlike synchronous code, these failures do **not** always throw errors directly on the Call Stack.

Instead, **Promises represent failures by becoming rejected**, and JavaScript provides different ways to handle these rejections.

The two most common approaches are:

- `.catch()` for Promise chains.
- `try...catch` with `async/await`.

Although both can handle asynchronous errors, they are used in different coding styles.

---

### 🎯 Why Is Asynchronous Error Handling Different?

In synchronous code, an exception immediately interrupts execution and propagates up the Call Stack.

Example:

```js
throw new Error("Something went wrong");
```

However, asynchronous operations complete **later**, often after the current function has already finished executing.

For example:

```js
fetch("/api/users");
```

The request starts immediately, but its result arrives sometime in the future.

Because of this delay, JavaScript cannot use normal synchronous exception handling alone. Instead, Promises represent success or failure and notify JavaScript when the operation finishes.

---

### ⚙️ Error Handling with Promises

A Promise has three possible states:

- Pending
- Fulfilled
- Rejected

When a Promise is rejected, the rejection can be handled using `.catch()`.

Example:

```js
fetch("/api/users")
  .then((response) => response.json())
  .catch((error) => {
    console.log(error.message);
  });
```

#### Internal Working

1. The asynchronous operation starts.
2. JavaScript immediately receives a Promise.
3. If the operation succeeds, the Promise becomes **Fulfilled**.
4. If it fails, the Promise becomes **Rejected**.
5. The `.catch()` callback is scheduled to handle the rejection.

---

### ⚙️ Error Handling with `async/await`

When using `async/await`, rejected Promises behave like thrown exceptions.

This allows us to use the familiar `try...catch` syntax.

Example:

```js
async function getUsers() {
  try {
    const response = await fetch("/api/users");

    const users = await response.json();

    console.log(users);
  } catch (error) {
    console.log(error.message);
  }
}
```

Although the code looks synchronous, it still works asynchronously behind the scenes.

---

### 🏗️ Internal Working

Let's understand what happens internally.

```js
async function getData() {
  try {
    const data = await fetch("/api/users");
  } catch (error) {
    console.log(error.message);
  }
}
```

Execution flow:

1. The `async` function starts.
2. `fetch()` returns a Promise.
3. `await` pauses the current `async` function.
4. The Event Loop continues processing other tasks.
5. If the Promise is fulfilled, execution resumes after `await`.
6. If the Promise is rejected, JavaScript treats the rejection as a thrown exception.
7. Control immediately transfers to the `catch` block.

This makes asynchronous error handling look very similar to synchronous error handling.

---

### ⚖️ `.catch()` vs `try...catch`

Both approaches handle rejected Promises, but they differ in syntax and usage.

| Feature | `.catch()` | `try...catch` |
|---------|------------|---------------|
| Used With | Promise chaining | `async/await` |
| Readability | Good for short chains | Better for sequential asynchronous code |
| Handles Promise Rejections | ✅ Yes | ✅ Yes |
| Works with Synchronous Exceptions | ❌ No (unless inside the Promise chain) | ✅ Yes |
| Coding Style | Functional | Similar to synchronous code |

---

### 📝 Example Comparison

#### Using `.catch()`

```js
fetch("/api/users")
  .then((response) => response.json())
  .then((users) => {
    console.log(users);
  })
  .catch((error) => {
    console.log(error.message);
  });
```

---

#### Using `async/await`

```js
async function loadUsers() {
  try {
    const response = await fetch("/api/users");

    const users = await response.json();

    console.log(users);
  } catch (error) {
    console.log(error.message);
  }
}
```

Both examples achieve the same result.

The choice depends on which coding style you prefer.

---

### ⚠️ Common Mistakes

#### Mistake 1

Using `try...catch` without `await`.

```js
try {
  fetch("/api/users");
} catch (error) {
  console.log(error.message);
}
```

This **does not** catch a rejected Promise because `fetch()` immediately returns a Promise. No exception is thrown synchronously.

Correct:

```js
try {
  await fetch("/api/users");
} catch (error) {
  console.log(error.message);
}
```

---

#### Mistake 2

Forgetting to handle Promise rejections.

```js
fetch("/api/users");
```

If the Promise rejects and no handler exists, JavaScript reports an **Unhandled Promise Rejection**.

We'll discuss this in the next section.

---

### 🌍 Real-World Example

Imagine ordering food online.

You place an order and receive an order number immediately.

Later:

- If everything goes well, your food is delivered.
- If the restaurant cancels the order, you're notified about the failure.

There are two ways to receive that notification:

- Stay on the order tracking page (`.catch()` in the Promise chain).
- Wait for a phone call from customer support (`try...catch` with `await`).

Both inform you about the same failure, but they present it differently.

---

### 💡 Note

Neither `.catch()` nor `try...catch` is universally better.

- Use `.catch()` when working directly with Promise chains.
- Use `try...catch` when using `async/await`, especially if multiple asynchronous operations need to be handled sequentially.

The important point is that **both ultimately handle Promise rejections**.

---

### 🎤 Interview Answer

Promises handle asynchronous failures by becoming **Rejected** instead of throwing synchronous exceptions. Rejections can be handled using `.catch()` in Promise chains or `try...catch` when using `async/await`. With `async/await`, a rejected Promise behaves like a thrown exception, allowing the `catch` block to handle it. While `.catch()` is commonly used with Promise chaining, `try...catch` provides cleaner and more readable code for sequential asynchronous operations. Internally, both approaches handle the same Promise rejection mechanism.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is an unhandled Promise rejection?
- What happens if an error is thrown inside a `.then()` callback?
- Can `try...catch` catch every asynchronous error?
- What is the difference between `throw` and `Promise.reject()`?
- How does the Event Loop handle rejected Promises?

---

## 6. How do unhandled errors and unhandled Promise rejections occur, and how can they be handled?

### 📖 Overview

An application cannot always recover from every error. Sometimes an error occurs, but no code is available to handle it.

In such cases, JavaScript reports an **unhandled error**.

There are two common situations:

1. **Unhandled Exceptions** – Errors thrown in synchronous code that are never caught.
2. **Unhandled Promise Rejections** – Promises that are rejected without a rejection handler.

Both indicate that something went wrong, but they occur in different execution contexts.

---

### 🎯 Why Do Unhandled Errors Occur?

Errors become "unhandled" when JavaScript cannot find any code responsible for dealing with them.

This usually happens because developers:

- Forget to use `try...catch`.
- Forget to attach `.catch()` to a Promise.
- Throw an error but never handle it.
- Assume an asynchronous operation cannot fail.

Unhandled errors are dangerous because they can:

- Stop program execution.
- Leave the application in an inconsistent state.
- Produce confusing behavior for users.
- Make debugging more difficult.

---

### ⚙️ What Is an Unhandled Exception?

An **Unhandled Exception** is a synchronous error that propagates through the entire Call Stack without being caught.

Example:

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }

  return a / b;
}

divide(10, 0);
```

Output:

```text
Uncaught Error: Division by zero
```

What happened?

1. `throw` created an Error object.
2. JavaScript searched the Call Stack for a matching `catch`.
3. No handler was found.
4. The error reached the global scope.
5. The runtime reported an unhandled exception.

---

### ⚙️ What Is an Unhandled Promise Rejection?

A Promise can also fail.

If a Promise becomes **Rejected** and no rejection handler exists, JavaScript reports an **Unhandled Promise Rejection**.

Example:

```js
fetch("/invalid-url");
```

If the returned Promise rejects and nothing handles it, the runtime reports the rejection.

Another example:

```js
Promise.reject(new Error("Network failed"));
```

Without a `.catch()` or an awaited `try...catch`, the rejection remains unhandled.

---

### 🏗️ Internal Working

#### Unhandled Exception

```
throw Error
      │
      ▼
Current Function
      │
      ▼
Calling Function
      │
      ▼
Global Scope
      │
      ▼
Uncaught Exception
```

---

#### Unhandled Promise Rejection

```
Promise Rejected
        │
        ▼
Has .catch() ?
    │        │
   Yes      No
    │        │
    ▼        ▼
Handle   Runtime Reports
          Unhandled Rejection
```

Unlike synchronous exceptions, Promise rejections are handled through Promise rejection handlers.

---

### ⚙️ How Can Unhandled Exceptions Be Handled?

The most common solution is using `try...catch`.

```js
try {
  divide(10, 0);
} catch (error) {
  console.log(error.message);
}
```

Output:

```text
Division by zero
```

Now the error is handled, so it no longer reaches the global scope.

---

### ⚙️ How Can Unhandled Promise Rejections Be Handled?

#### Method 1: Using `.catch()`

```js
fetch("/invalid-url")
  .catch((error) => {
    console.log(error.message);
  });
```

---

#### Method 2: Using `async/await`

```js
async function loadData() {
  try {
    await fetch("/invalid-url");
  } catch (error) {
    console.log(error.message);
  }
}
```

Both approaches prevent the Promise rejection from becoming unhandled.

---

### 🌐 Global Error Handlers

Sometimes developers want to log errors that were not handled elsewhere.

Both browsers and Node.js provide global error events for this purpose.

#### Browser

The browser provides events such as:

- `error`
- `unhandledrejection`

These can be used to log unexpected failures or send error reports to monitoring services.

#### Node.js

Node.js provides process events such as:

- `uncaughtException`
- `unhandledRejection`

These are useful for logging unexpected failures before the application exits or restarts.

> **Note:** Global handlers are intended as a **last line of defense**. They should not replace proper error handling throughout your application.

---

### ⚠️ Common Mistakes

#### Mistake 1

Throwing an error without handling it.

```js
throw new Error("Failed");
```

If no `catch` block exists, the exception becomes unhandled.

---

#### Mistake 2

Ignoring rejected Promises.

```js
fetch("/invalid-url");
```

Since no rejection handler exists, the Promise rejection becomes unhandled.

---

#### Mistake 3

Assuming every asynchronous error is caught automatically.

```js
async function load() {
  await fetch("/invalid-url");
}
```

If `load()` is called without handling its returned Promise, the rejection can still become unhandled.

For example:

```js
load();
```

If `load()` rejects and the caller doesn't handle it, the rejection remains unhandled.

---

### 🌍 Real-World Example

Imagine a customer submits a complaint.

If an employee receives the complaint and resolves it, everything is fine.

If every employee forwards the complaint without taking responsibility, it eventually reaches the company's headquarters.

If nobody there handles it either, the complaint becomes a public issue.

In this analogy:

| Office | JavaScript |
|---------|------------|
| Complaint | Error |
| Employee | `catch()` / `try...catch` |
| Headquarters | Global scope |
| Public issue | Unhandled error |

The earlier an issue is handled, the easier it is to manage.

---

### 💡 Note

Unhandled errors should generally be considered **programming mistakes**, not normal application behavior.

In production applications:

- Handle errors as close as possible to where they can be meaningfully resolved.
- Use global handlers primarily for logging, monitoring, or graceful shutdown—not as a replacement for proper error handling.

This approach leads to more reliable and maintainable applications.

---

### 🎤 Interview Answer

An unhandled exception occurs when a synchronous error propagates through the entire Call Stack without being caught by a `try...catch` block. An unhandled Promise rejection occurs when a Promise is rejected without a rejection handler such as `.catch()` or `try...catch` with `await`. In both cases, JavaScript reports the error because no code handled it. Unhandled exceptions can be prevented with `try...catch`, while Promise rejections should be handled using `.catch()` or `async/await`. Browsers and Node.js also provide global error handlers for logging unexpected failures, but they should be used only as a last line of defense.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- How can you create custom error classes?
- What is the difference between `throw` and `Promise.reject()`?
- What happens if an error is thrown inside a `.then()` callback?
- What is a stack trace, and how does it help with debugging?
- Should every error be caught immediately, or should some errors be allowed to propagate?

---

## 7. How can you create custom error classes by extending the `Error` class, and when should you use them?

### 📖 Overview

JavaScript provides several built-in error types such as `TypeError`, `ReferenceError`, and `RangeError`. While these are useful for common programming errors, they often don't describe **application-specific problems**.

For example:

- Invalid email address
- Authentication failure
- Payment declined
- User not found
- Validation failed

Using a generic `Error` for all these situations makes it difficult to understand what actually went wrong.

To solve this, JavaScript allows developers to create **custom error classes** by extending the built-in `Error` class.

Custom error classes make applications easier to debug, maintain, and handle different error scenarios appropriately.

---

### 🎯 Why Do We Need Custom Error Classes?

Imagine an e-commerce application.

Different operations can fail for different reasons:

- A user enters an invalid email.
- A product is out of stock.
- A payment is declined.
- A user tries to access a protected route without logging in.

If every failure throws:

```js
throw new Error("Something went wrong");
```

the application has no easy way to distinguish between these problems.

Instead, we can create meaningful error types like:

- `ValidationError`
- `AuthenticationError`
- `AuthorizationError`
- `PaymentError`

Now the application can respond differently depending on the type of error.

---

### ⚙️ How Do Custom Error Classes Work?

A custom error class is created using the `class` keyword and the `extends` keyword.

Example:

```js
class ValidationError extends Error {
  constructor(message) {
    super(message);

    this.name = "ValidationError";
  }
}
```

Let's understand each part.

---

#### `extends Error`

```js
class ValidationError extends Error {}
```

This means:

- `ValidationError` inherits all the features of the built-in `Error` class.
- It behaves like a normal Error object.
- It also allows us to add custom behavior if needed.

---

#### `super(message)`

```js
super(message);
```

This calls the constructor of the parent `Error` class.

It initializes built-in properties such as:

- `message`
- `stack`

Without calling `super()`, the Error object would not be initialized correctly.

---

#### Setting the Error Name

```js
this.name = "ValidationError";
```

By default:

```js
new Error().name
```

returns:

```text
Error
```

Setting the `name` property makes the error type more descriptive.

---

### ⚙️ Throwing a Custom Error

Once the class is created, it can be used like any built-in Error.

```js
throw new ValidationError("Email is required.");
```

This creates an Error object with:

```text
name: ValidationError
message: Email is required.
```

---

### ⚙️ Handling Custom Errors

Custom errors can be handled using `try...catch`.

Example:

```js
try {
  throw new ValidationError("Email is required.");
} catch (error) {
  console.log(error.name);
  console.log(error.message);
}
```

Output:

```text
ValidationError
Email is required.
```

---

### ⚙️ Checking Error Types

Since custom errors extend the `Error` class, the `instanceof` operator can be used to determine the exact error type.

Example:

```js
try {
  throw new ValidationError("Invalid email.");
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Handle validation error.");
  } else {
    console.log("Handle other errors.");
  }
}
```

This allows different types of errors to be handled differently.

---

### 🏗️ Internal Working

The inheritance relationship looks like this:

```
Error
  │
  ▼
ValidationError
  │
  ▼
new ValidationError()
  │
  ▼
Error Object
```

When a custom error is created:

1. JavaScript creates a new object.
2. It inherits from the `Error` class.
3. The parent constructor initializes the error.
4. Custom properties are added.
5. The object behaves like any other Error.

---

### 🌍 Real-World Example

Imagine a hospital.

Instead of labeling every patient as simply **"Sick"**, doctors use more specific diagnoses such as:

- Flu
- Diabetes
- Fracture
- Allergy

Although every patient is still a patient, each diagnosis helps doctors decide the appropriate treatment.

Similarly:

| Hospital | JavaScript |
|----------|------------|
| Patient | `Error` |
| Diagnosis | `ValidationError`, `AuthenticationError`, etc. |
| Treatment | Specific error handling |

Using specific error types makes handling problems much more effective.

---

### 💡 Note

Custom error classes are most useful in medium and large applications where different errors require different handling.

For example:

- A validation error might display a message to the user.
- An authentication error might redirect the user to the login page.
- A payment error might ask the user to try another payment method.

By creating meaningful error classes, the application can make better decisions based on the type of error.

---

### 🎤 Interview Answer

Custom error classes are created by extending JavaScript's built-in `Error` class using the `class` and `extends` keywords. The custom class calls `super(message)` to initialize the parent Error object and typically sets a custom `name` property to identify the error type. Custom errors allow developers to represent application-specific problems, such as validation failures or authentication errors, instead of using a generic Error for every situation. Since they inherit from `Error`, they can be thrown, caught with `try...catch`, and identified using the `instanceof` operator.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is a stack trace, and how is it generated?
- Why should custom errors extend the `Error` class instead of using plain objects?
- What is the purpose of `super(message)`?
- What is the difference between `instanceof` and checking `error.name`?
- How are custom errors used in real-world applications?

---

## 8. What is a stack trace, how does JavaScript generate it, and how can it be used for debugging?

### 📖 Overview

A **stack trace** is a report that shows the **sequence of function calls** that were active when an error occurred.

When JavaScript throws an error, it doesn't just tell you **what** went wrong—it also tells you **where** it happened and **how the program reached that point**.

This information is extremely valuable for debugging because it helps developers trace the source of a problem through the Call Stack.

A stack trace is usually available through the **`stack`** property of an `Error` object.

---

### 🎯 Why Do We Need a Stack Trace?

Imagine receiving this error message:

```text
TypeError
```

Although you know the type of error, you still don't know:

- Which file caused it?
- Which function failed?
- Which line number contains the bug?
- Which function called that function?

Without this information, debugging large applications would be extremely difficult.

A stack trace answers all these questions by showing the execution path that led to the error.

---

### ⚙️ How Does JavaScript Generate a Stack Trace?

To understand stack traces, we first need to understand the **Call Stack**.

Consider the following code:

```js
function third() {
  throw new Error("Something went wrong");
}

function second() {
  third();
}

function first() {
  second();
}

first();
```

Let's see what happens internally.

---

#### Step 1: Functions Are Added to the Call Stack

Execution begins with:

```js
first();
```

The Call Stack becomes:

```
third()
second()
first()
Global
```

---

#### Step 2: An Error Is Thrown

Inside `third()`:

```js
throw new Error("Something went wrong");
```

JavaScript creates an Error object.

---

#### Step 3: JavaScript Captures the Call Stack

Before removing functions from the Call Stack, JavaScript records the current execution path.

That recorded information becomes the **stack trace**.

A simplified stack trace looks like this:

```text
Error: Something went wrong
    at third()
    at second()
    at first()
    at Global
```

This tells us:

1. The error occurred inside `third()`.
2. `third()` was called by `second()`.
3. `second()` was called by `first()`.
4. `first()` was called from the global scope.

---

#### Step 4: Error Propagation Begins

After recording the stack trace, JavaScript starts searching for a matching `catch` block.

Whether the error is caught or not, the stack trace remains part of the Error object.

---

### 🏗️ Internal Working

The process looks like this:

```
Function Calls
      │
      ▼
Call Stack
      │
      ▼
Error Thrown
      │
      ▼
Capture Current Call Stack
      │
      ▼
Create Stack Trace
      │
      ▼
Attach to Error Object
      │
      ▼
Error Propagation
```

The stack trace is essentially a snapshot of the Call Stack at the moment the error occurred.

---

### ⚙️ Accessing the Stack Trace

Every Error object contains a `stack` property.

Example:

```js
try {
  throw new Error("Invalid input");
} catch (error) {
  console.log(error.stack);
}
```

Example output (simplified):

```text
Error: Invalid input
    at validateUser()
    at registerUser()
    at main()
```

The exact format may differ between JavaScript engines and environments, but the purpose remains the same.

---

### 🌍 How Does a Stack Trace Help in Debugging?

A stack trace helps developers answer important questions such as:

- Which function caused the error?
- Which file contains the problem?
- Which line number should be investigated?
- What sequence of function calls led to the failure?

Instead of searching through thousands of lines of code, developers can begin debugging from the location shown in the stack trace.

---

### ⚠️ Common Misconceptions

#### Misconception 1

**A stack trace only contains the function where the error occurred.**

Incorrect.

It contains the **entire chain of function calls** that led to the error.

---

#### Misconception 2

**A stack trace is generated only for uncaught errors.**

Incorrect.

Even if an error is caught with `try...catch`, the Error object still contains a stack trace.

---

#### Misconception 3

**The stack trace format is identical everywhere.**

Incorrect.

Different JavaScript engines (such as V8, SpiderMonkey, and JavaScriptCore) may display the stack trace differently, although they all provide similar debugging information.

---

### 🌍 Real-World Example

Imagine a detective investigating an accident.

Instead of only seeing the accident itself, the detective examines:

- Where it happened.
- Who was involved.
- Which road each vehicle traveled.
- The sequence of events leading to the accident.

Similarly, a stack trace doesn't just show the error—it shows the path the program followed before the error occurred.

In this analogy:

| Investigation | JavaScript |
|---------------|------------|
| Accident | Error |
| Route taken | Stack trace |
| Detective | Developer |

The route helps identify the root cause instead of only the final problem.

---

### 💡 Note

Stack traces are one of the most valuable debugging tools in JavaScript.

When an unexpected error occurs, developers should usually inspect:

1. The **error type** (`error.name`).
2. The **error message** (`error.message`).
3. The **stack trace** (`error.stack`).

Together, these provide enough information to understand and fix most problems efficiently.

---

### 🎤 Interview Answer

A stack trace is a record of the sequence of function calls that were active when an error occurred. When JavaScript throws an error, it captures the current Call Stack and stores it in the Error object's `stack` property. The stack trace shows where the error occurred and the chain of function calls that led to it, making it an essential tool for debugging. Although the exact format may vary between JavaScript engines, stack traces help developers quickly locate and understand the source of an error.

---

### ❓ Follow-up Questions

An interviewer may continue with questions like:

- What is the Call Stack, and how does it work?
- How does error propagation relate to the stack trace?
- What information does the `Error` object contain?
- Why do different JavaScript engines display stack traces differently?
- How can stack traces help debug asynchronous code?

---