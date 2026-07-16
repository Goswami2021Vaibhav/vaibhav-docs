---
title: Functions
description: Declarations, expressions, arrow functions, higher-order functions, currying, and recursion.
sidebar_position: 7
---

# Functions

## 1. What are Functions in JavaScript, and how do you create them?

### 📖 Overview

A function is a **reusable block of code** that performs a specific task.

Instead of writing the same code multiple times, we can write it once inside a function and call it whenever needed.

Functions are one of the most important features of JavaScript because they help us:

- Reuse code
- Organize logic
- Improve readability
- Reduce duplication
- Build modular applications

Almost every JavaScript application—from a simple calculator to a large React application—uses functions extensively.

---

### ⚙️ Main Explanation

### What is a Function?

A function is a block of code that executes **only when it is called (invoked)**.

Syntax:

```js
function functionName() {
  // Code to execute
}
```

Example:

```js
function greet() {
  console.log("Welcome to Vaibhav Docs!");
}

greet();
```

Output:

```text
Welcome to Vaibhav Docs!
```

Here:

- `greet` is the function name.
- The code inside `{}` is the function body.
- `greet()` calls (invokes) the function.

---

### Why Do We Use Functions?

Imagine writing the same greeting in multiple places.

Without a function:

```js
console.log("Welcome to Vaibhav Docs!");
console.log("Welcome to Vaibhav Docs!");
console.log("Welcome to Vaibhav Docs!");
```

This duplicates code.

Using a function:

```js
function greet() {
  console.log("Welcome to Vaibhav Docs!");
}

greet();
greet();
greet();
```

Now the logic is written only once and can be reused anywhere.

---

### Function Declaration

A **Function Declaration** is the most common way to create a function.

Syntax:

```js
function functionName() {
  // Code
}
```

Example:

```js
function calculateTotal(price, tax) {
  return price + tax;
}

console.log(calculateTotal(100, 18));
```

Output:

```text
118
```

Function declarations are **hoisted**, meaning they can be called before their declaration.

Example:

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

We'll understand _why_ this happens later in this chapter.

---

### Function Expression

A **Function Expression** stores a function inside a variable.

Syntax:

```js
const functionName = function () {
  // Code
};
```

Example:

```js
const greet = function () {
  console.log("Welcome!");
};

greet();
```

Output:

```text
Welcome!
```

Unlike function declarations, function expressions are **not fully hoisted**.

Calling them before initialization results in an error.

Example:

```js
greet();

const greet = function () {};
```

Output:

```text
ReferenceError
```

---

### Function Declaration vs Function Expression

| Function Declaration                  | Function Expression                              |
| ------------------------------------- | ------------------------------------------------ |
| Declared using the `function` keyword | Stored in a variable                             |
| Fully hoisted                         | Variable is hoisted, function is not initialized |
| Can be called before declaration      | Cannot be called before initialization           |
| Common for reusable functions         | Useful when functions are treated as values      |

---

### When Should You Use Each?

Use **Function Declarations** when:

- Defining reusable utility functions.
- The function is part of the application's core logic.
- You want hoisting behavior.

Use **Function Expressions** when:

- Passing functions as values.
- Assigning functions to variables or object properties.
- Creating callbacks.
- Working with functional programming patterns.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Anonymous Functions, Named Function Expressions, Arrow Functions, and IIFEs**, which are all different ways of creating and using functions.

---

### 💻 Example

We'll use the following example throughout this chapter.

```js
function calculateTotal(price, tax) {
  return price + tax;
}

const printInvoice = function (amount) {
  console.log(`Total: ₹${amount}`);
};

const total = calculateTotal(1000, 180);

printInvoice(total);
```

Output:

```text
Total: ₹1180
```

This example demonstrates:

- Function Declaration
- Function Expression
- Calling one function from another

---

### 📊 Diagram / Flow

#### Function Lifecycle

```text
Create Function

↓

Store Function

↓

Call Function

↓

Execute Code

↓

Return Result
```

---

#### Function Declaration

```text
function greet() {}

↓

Function Created

↓

Available Throughout Scope
```

---

#### Function Expression

```text
const greet = function () {};

↓

Variable Created

↓

Function Assigned

↓

Ready to Call
```

---

#### Function Reuse

```text
Function

│

├── Call 1

├── Call 2

├── Call 3

└── Call N
```

---

### 🌍 Real-World Example

Imagine a coffee machine in an office.

Instead of teaching every employee how to make coffee, the office provides a single machine.

Whenever someone needs coffee, they simply press a button.

```text
Employee

↓

Coffee Machine

↓

Coffee
```

The coffee-making process is written only once inside the machine.

Functions work the same way.

Instead of rewriting the same code repeatedly, we place it inside a function and call it whenever we need that functionality.

This makes programs more organized, reusable, and easier to maintain.

---

### 🎤 Interview Answer

A function is a reusable block of code that performs a specific task and executes only when it is called. Functions help reduce code duplication, improve readability, and organize application logic. JavaScript provides multiple ways to create functions, with the two most common being **Function Declarations** and **Function Expressions**. Function declarations are fully hoisted, allowing them to be called before their declaration, whereas function expressions are assigned to variables and can only be called after they are initialized. Choosing between them depends on how the function will be used in the application.

---

### ❓ Follow-up Questions

1. What is the difference between a Function Declaration and a Function Expression?
2. Why are Function Declarations hoisted?
3. Can a Function Expression be called before it is defined?
4. When should you use a Function Expression instead of a Function Declaration?
5. How does JavaScript store functions internally?
6. What happens when a function is invoked?

---

## 2. What are Function Expressions, Anonymous Functions, Arrow Functions, and IIFEs?

### 📖 Overview

In the previous topic, we learned about **Function Declarations**. However, JavaScript provides several other ways to create and use functions.

The most common are:

- Function Expressions
- Anonymous Functions
- Named Function Expressions
- Arrow Functions
- IIFEs (Immediately Invoked Function Expressions)

Although all of them create functions, they differ in syntax, behavior, hoisting, and use cases.

Understanding these differences helps you choose the right type of function for different situations and prepares you for common interview questions.

---

### ⚙️ Main Explanation

### Function Expressions

A **Function Expression** is a function stored inside a variable.

Example:

```js
const greet = function () {
  console.log("Welcome to Vaibhav Docs!");
};

greet();
```

Output:

```text
Welcome to Vaibhav Docs!
```

Unlike Function Declarations, Function Expressions are **not fully hoisted**.

The variable is hoisted, but the function is assigned only during execution.

---

### Anonymous Functions

An **Anonymous Function** is simply a function **without a name**.

Example:

```js
const greet = function () {
  console.log("Hello");
};
```

Notice that the function itself has no name.

Anonymous functions are commonly used:

- As callbacks
- Inside event listeners
- In Function Expressions
- With array methods like `map()` and `filter()`

Example:

```js
const numbers = [1, 2, 3];

numbers.forEach(function (number) {
  console.log(number);
});
```

---

### Named Function Expressions

A **Named Function Expression** is a Function Expression where the function itself has a name.

Example:

```js
const greet = function sayHello() {
  console.log("Hello");
};

greet();
```

Output:

```text
Hello
```

Although the variable is named `greet`, the function's internal name is `sayHello`.

The internal name is mainly useful for:

- Debugging stack traces.
- Self-recursion.

Outside the function, only the variable is accessible.

```js
sayHello();
```

Output:

```text
ReferenceError
```

---

### Arrow Functions

Arrow Functions were introduced in **ES6** to provide a shorter syntax for writing functions.

Example:

```js
const greet = () => {
  console.log("Welcome!");
};

greet();
```

Output:

```text
Welcome!
```

A concise version:

```js
const square = number => number * number;
```

Output:

```js
square(5);
```

```text
25
```

Arrow Functions automatically return the expression when curly braces are omitted.

---

### Arrow Functions vs Regular Functions

Arrow Functions differ from Regular Functions in several important ways.

| Regular Function | Arrow Function |
|------------------|----------------|
| Has its own `this` | Uses lexical `this` |
| Has its own `arguments` object | No own `arguments` |
| Can be used as a constructor | Cannot be used with `new` |
| Can access `new.target` | Cannot access `new.target` |

The most important difference is `this`.

Arrow Functions do **not** create their own `this`.

Instead, they inherit it from the surrounding scope.

> 💡 **Coming Next**
>
> We'll explore `this` and lexical `this` in detail later in this chapter.

---

### Can Arrow Functions Be Used as Constructors?

No.

Example:

```js
const Person = (name) => {
  this.name = name;
};

new Person("Vaibhav");
```

Output:

```text
TypeError
```

Arrow Functions cannot be used with the `new` keyword because they don't have the internal behavior required for constructor functions.

---

### Why Are Arrow Functions Popular in React?

React applications frequently use Arrow Functions because:

- They are concise.
- They inherit `this` from the surrounding scope.
- They work well with callbacks and event handlers.

Example:

```js
const handleClick = () => {
  console.log("Clicked");
};
```

This avoids many of the `this` binding issues that existed before Arrow Functions.

---

### What is an IIFE?

**IIFE** stands for **Immediately Invoked Function Expression**.

It is a function that executes immediately after being created.

Syntax:

```js
(function () {
  console.log("Executed");
})();
```

Output:

```text
Executed
```

The surrounding parentheses convert the function declaration into a function expression, allowing it to be invoked immediately.

---

### Why Do We Use IIFEs?

Before ES6 introduced block scope with `let` and `const`, IIFEs were commonly used to create private scope.

Example:

```js
(function () {
  const company = "Vaibhav Docs";

  console.log(company);
})();
```

Outside the IIFE:

```js
console.log(company);
```

Output:

```text
ReferenceError
```

The variable remains private inside the function.

Today, IIFEs are less common because block scope solves many of the same problems.

---

### Immediately Invoked Arrow Functions

Arrow Functions can also be invoked immediately.

Example:

```js
(() => {
  console.log("Executed");
})();
```

Output:

```text
Executed
```

This behaves similarly to a traditional IIFE but uses Arrow Function syntax.

---

### Choosing the Right Function Type

| Function Type | Common Use Case |
|--------------|-----------------|
| Function Declaration | Reusable application logic |
| Function Expression | Assigning functions to variables |
| Anonymous Function | Callbacks and event handlers |
| Named Function Expression | Debugging and recursion |
| Arrow Function | Concise callbacks and React code |
| IIFE | Immediate execution and isolated scope |

---

### 💻 Example

We'll continue using our running example.

```js
const company = "Vaibhav Docs";

const printCompany = function () {
  console.log(company);
};

const printWelcome = () => {
  console.log("Welcome!");
};

(function () {
  console.log("Application Started");
})();

printCompany();

printWelcome();
```

Output:

```text
Application Started

Vaibhav Docs

Welcome!
```

This example demonstrates:

- Function Expression
- Arrow Function
- IIFE

---

### 📊 Diagram / Flow

#### Ways to Create Functions

```text
Functions

│

├── Function Declaration

├── Function Expression

├── Arrow Function

└── IIFE
```

---

#### IIFE

```text
Create Function

↓

Invoke Immediately

↓

Execute

↓

Finish
```

---

#### Arrow Function

```text
Arrow Function

↓

Lexical this

↓

Execute
```

---

#### Function Expression

```text
Function

↓

Assign to Variable

↓

Call Variable

↓

Execute
```

---

### 🌍 Real-World Example

Imagine a company hiring employees for different roles.

A **Function Declaration** is like a permanent employee.

```text
Employee

↓

Available Whenever Needed
```

An **Arrow Function** is like a contractor hired for a quick, specific task.

```text
Short Task

↓

Complete Work

↓

Finish
```

An **IIFE** is like calling a technician for a one-time installation.

```text
Technician Arrives

↓

Installs Equipment

↓

Leaves
```

Each approach performs work, but they are designed for different situations.

---

### 🎤 Interview Answer

JavaScript provides multiple ways to create functions. A **Function Expression** stores a function inside a variable and is not fully hoisted. An **Anonymous Function** is simply a function without a name and is commonly used as a callback. A **Named Function Expression** gives the function an internal name that is mainly useful for debugging and recursion. **Arrow Functions**, introduced in ES6, provide a concise syntax and inherit `this` from the surrounding scope instead of creating their own. An **IIFE (Immediately Invoked Function Expression)** executes immediately after it is created and was traditionally used to create private scope before block-scoped variables were introduced.

---

### ❓ Follow-up Questions

1. What is the difference between a Function Expression and an Arrow Function?
2. What is an Anonymous Function?
3. Why would you use a Named Function Expression?
4. Why don't Arrow Functions have their own `this`?
5. Can Arrow Functions be used as constructors? Why not?
6. Why were IIFEs commonly used before ES6?

---

## 3. What are Parameters, Arguments, Return Values, and First-Class Functions?

### 📖 Overview

Functions become truly useful when they can:

- Receive data
- Process data
- Return results
- Be treated like any other value

JavaScript supports all of these capabilities.

A function can:

- Accept **parameters**
- Receive **arguments**
- Return a value using the `return` statement
- Return another function
- Accept another function as an argument
- Be assigned to variables, stored in objects, and passed around like any other value

This is why JavaScript functions are called **First-Class Functions** (or **First-Class Citizens**).

---

### ⚙️ Main Explanation

### Parameters vs Arguments

Although these terms are often used interchangeably, they are different.

#### Parameters

Parameters are the variables defined in a function declaration.

Example:

```js
function calculateTotal(price, tax) {
  return price + tax;
}
```

Here:

```text
price

tax
```

are **parameters**.

They act as placeholders for the values that will be provided later.

---

#### Arguments

Arguments are the actual values passed to a function when it is called.

```js
calculateTotal(1000, 180);
```

Here:

```text
1000

180
```

are **arguments**.

The arguments are assigned to the corresponding parameters.

---

#### Parameters vs Arguments

| Parameters | Arguments |
|------------|-----------|
| Declared in the function definition | Passed during the function call |
| Act as placeholders | Actual values |
| Exist inside the function | Exist at the call site |

---

### Default Parameters

Sometimes a caller may not provide every argument.

Default parameters allow us to specify a fallback value.

Example:

```js
function greet(name = "Guest") {
  console.log(`Welcome ${name}`);
}

greet();
```

Output:

```text
Welcome Guest
```

Calling:

```js
greet("Vaibhav");
```

Output:

```text
Welcome Vaibhav
```

---

### Rest Parameters

Rest parameters collect multiple arguments into a single array.

Example:

```js
function printSkills(...skills) {
  console.log(skills);
}

printSkills(
  "JavaScript",
  "React",
  "Node.js"
);
```

Output:

```text
[
  "JavaScript",
  "React",
  "Node.js"
]
```

Rest parameters must always be the **last parameter**.

---

### Spread Operator in Function Calls

The Spread Operator does the opposite of Rest.

Instead of collecting values, it expands them.

```js
const skills = [
  "JavaScript",
  "React",
];

printSkills(...skills);
```

JavaScript expands the array into individual arguments.

---

### The `return` Statement

The `return` statement sends a value back to the caller.

Example:

```js
function square(number) {
  return number * number;
}

const result = square(5);

console.log(result);
```

Output:

```text
25
```

When JavaScript encounters `return`, the function immediately stops executing.

Example:

```js
function greet() {
  return "Hello";

  console.log("World");
}
```

The `console.log()` statement is never executed.

---

### What Happens if a Function Doesn't Return Anything?

Every JavaScript function returns a value.

If no explicit `return` statement is provided, JavaScript automatically returns:

```text
undefined
```

Example:

```js
function greet() {
  console.log("Welcome");
}

const result = greet();

console.log(result);
```

Output:

```text
Welcome

undefined
```

---

### Can a Function Return Multiple Values?

A function can return **only one value directly**.

However, that value can contain multiple pieces of data.

For example, using an object:

```js
function getCompany() {
  return {
    name: "Vaibhav Docs",
    founded: 2024,
  };
}
```

Or using an array:

```js
function getCoordinates() {
  return [20, 40];
}
```

This is how JavaScript returns multiple related values.

---

### Functions Returning Functions

A function can return another function.

Example:

```js
function greet() {
  return function () {
    console.log("Welcome!");
  };
}

const message = greet();

message();
```

Output:

```text
Welcome!
```

This ability is fundamental to concepts like **Closures** and **Currying**.

> 💡 **Coming Next**
>
> We'll explore Closures and Currying in dedicated topics later in this documentation.

---

### Functions Accepting Functions

Functions can also receive other functions as arguments.

Example:

```js
function execute(action) {
  action();
}

execute(function () {
  console.log("Executed");
});
```

Output:

```text
Executed
```

This pattern is heavily used throughout JavaScript.

Examples include:

- Event listeners
- `setTimeout()`
- Array methods
- Promise APIs

---

### What are First-Class Functions?

JavaScript treats functions like any other value.

This means functions can be:

- Stored in variables.
- Stored inside objects.
- Passed as arguments.
- Returned from other functions.

Example:

```js
const greet = function () {
  console.log("Hello");
};

const company = {
  welcome: greet,
};

company.welcome();
```

Output:

```text
Hello
```

Because functions have these capabilities, JavaScript refers to them as **First-Class Functions** or **First-Class Citizens**.

---

### Why are Functions Called First-Class Citizens?

A programming language is said to support **First-Class Functions** if functions can:

- Be assigned to variables.
- Be passed as arguments.
- Be returned from functions.
- Be stored in data structures.

JavaScript supports all of these features, making functions extremely flexible and enabling powerful programming patterns.

---

### 💻 Example

We'll continue using our running example.

```js
function calculateTotal(price, tax = 0) {
  return price + tax;
}

function execute(action) {
  action();
}

const skills = [
  "JavaScript",
  "React",
];

const total = calculateTotal(1000, 180);

console.log(total);

execute(() => {
  console.log(...skills);
});
```

Output:

```text
1180

JavaScript React
```

This example demonstrates:

- Parameters
- Arguments
- Default Parameters
- Spread Operator
- Returning values
- Passing functions as arguments

---

### 📊 Diagram / Flow

#### Parameters and Arguments

```text
Function

↓

Parameters

↓

Call Function

↓

Arguments
```

---

#### Function Return

```text
Call Function

↓

Execute

↓

return

↓

Result
```

---

#### First-Class Functions

```text
Function

│

├── Store in Variable

├── Pass as Argument

├── Return from Function

└── Store in Object
```

---

#### Rest vs Spread

```text
Rest

Many Values

↓

One Array

-------------------

Spread

One Array

↓

Many Values
```

---

### 🌍 Real-World Example

Imagine ordering food at a restaurant.

The waiter asks for your order.

```text
Menu

↓

Customer Places Order

↓

Kitchen Prepares Food

↓

Food Returned
```

- The **parameters** are like the blank order form.
- The **arguments** are the actual dishes you order.
- The **return value** is the prepared food delivered back to you.

Now imagine the restaurant manager can also hire another chef or ask another chef to cook a meal.

Similarly, JavaScript functions can:

- Return other functions.
- Accept functions as input.

This flexibility is why functions are considered **First-Class Citizens**.

---

### 🎤 Interview Answer

Parameters are the variables defined in a function declaration, while arguments are the actual values passed during a function call. Functions can use default parameters, collect multiple arguments with Rest Parameters, and expand arrays into arguments using the Spread Operator. Every function returns a value using the `return` statement, and if no value is explicitly returned, JavaScript automatically returns `undefined`. JavaScript functions are called **First-Class Functions** because they can be assigned to variables, passed as arguments, returned from other functions, and stored inside objects, making them extremely flexible and powerful.

---

### ❓ Follow-up Questions

1. What is the difference between parameters and arguments?
2. What is the difference between Rest Parameters and the Spread Operator?
3. What happens if a function doesn't have a `return` statement?
4. Can a function return another function? Why is this useful?
5. What does it mean for functions to be First-Class Citizens?
6. Why are First-Class Functions important in JavaScript?

---

## 4. What are Callback Functions and Higher-Order Functions?

### 📖 Overview

One of JavaScript's greatest strengths is that **functions are first-class citizens**. This means functions can be passed around just like numbers, strings, or objects.

Because of this, JavaScript allows:

- Passing functions as arguments.
- Returning functions from other functions.

These capabilities introduce two important concepts:

- **Callback Functions**
- **Higher-Order Functions (HOFs)**

These concepts are used extensively throughout JavaScript, including:

- Array methods (`map()`, `filter()`, `reduce()`)
- Event listeners
- Timers (`setTimeout`, `setInterval`)
- Promises
- Async programming
- React applications

Understanding them is essential for writing modern JavaScript.

---

### ⚙️ Main Explanation

### What is a Callback Function?

A **Callback Function** is a function that is **passed as an argument to another function**, so that it can be executed later.

Example:

```js
function greet() {
  console.log("Welcome to Vaibhav Docs!");
}

function execute(action) {
  action();
}

execute(greet);
```

Output:

```text
Welcome to Vaibhav Docs!
```

Here:

- `greet` is the **Callback Function**.
- `execute` decides **when** to execute it.

Notice that we pass the function itself:

```js
execute(greet);
```

Not:

```js
execute(greet());
```

Using `greet()` would execute the function immediately instead of passing it as a callback.

---

### Why Do We Use Callback Functions?

Callbacks allow one function to customize the behavior of another function.

Example:

```js
function calculate(a, b, operation) {
  return operation(a, b);
}

function add(x, y) {
  return x + y;
}

console.log(calculate(10, 20, add));
```

Output:

```text
30
```

The `calculate` function doesn't know which operation to perform.

Instead, it receives the operation as a callback.

---

### What is a Higher-Order Function?

A **Higher-Order Function (HOF)** is a function that:

- Accepts one or more functions as arguments, **or**
- Returns another function.

Example:

```js
function execute(action) {
  action();
}
```

Since `execute` accepts another function as an argument, it is a **Higher-Order Function**.

---

Another example:

```js
function createGreeting() {
  return function () {
    console.log("Welcome!");
  };
}
```

Since it returns a function, it is also a Higher-Order Function.

---

### Callback Function vs Higher-Order Function

These two concepts are closely related but describe different things.

```js
function greet() {
  console.log("Hello");
}

function execute(action) {
  action();
}

execute(greet);
```

Here:

- `greet` → Callback Function
- `execute` → Higher-Order Function

The callback is **passed in**, while the Higher-Order Function **receives or returns** functions.

---

### Higher-Order Functions with Arrays

Many built-in JavaScript array methods are Higher-Order Functions.

Example:

```js
const numbers = [1, 2, 3];

const doubled = numbers.map(function (number) {
  return number * 2;
});

console.log(doubled);
```

Output:

```text
[2, 4, 6]
```

Here:

- `map()` is the Higher-Order Function.
- The anonymous function is the Callback Function.

---

Another example:

```js
const even = numbers.filter(function (number) {
  return number % 2 === 0;
});
```

Again:

- `filter()` is the Higher-Order Function.
- The anonymous function is the Callback Function.

---

### Why Are Higher-Order Functions Powerful?

Without Higher-Order Functions, we would need separate functions for every variation of behavior.

Example:

Instead of creating:

```text
calculateAddition()

calculateSubtraction()

calculateMultiplication()
```

We can write one reusable function.

```js
function calculate(a, b, operation) {
  return operation(a, b);
}
```

Then provide different callbacks whenever needed.

This makes code:

- More reusable.
- Easier to maintain.
- More flexible.

---

### Real-World Higher-Order Functions

JavaScript provides many built-in Higher-Order Functions.

Examples include:

- `map()`
- `filter()`
- `reduce()`
- `forEach()`
- `find()`
- `some()`
- `every()`
- `setTimeout()`
- `setInterval()`

Each of these expects a callback function.

---

### Why Are Higher-Order Functions Used So Frequently?

Higher-Order Functions allow developers to separate **what should happen** from **when or how it should happen**.

For example:

```js
setTimeout(() => {
  console.log("Executed");
}, 1000);
```

The callback describes **what** to do.

`setTimeout()` decides **when** to do it.

This separation makes APIs much more flexible.

---

### Best Practices

When using callbacks and Higher-Order Functions:

- Keep callback functions small and focused.
- Use descriptive function names whenever possible.
- Prefer Arrow Functions for short callbacks.
- Avoid deeply nested callbacks, as they can reduce readability.

---

> 💡 **Coming Next**
>
> We'll explore **Pure Functions**, **Impure Functions**, and **Side Effects**, which build upon these functional programming concepts.

---

### 💻 Example

We'll continue using our running example.

```js
function calculate(price, tax, operation) {
  return operation(price, tax);
}

const add = (price, tax) => price + tax;

const total = calculate(
  1000,
  180,
  add
);

console.log(total);

const technologies = [
  "JavaScript",
  "React",
];

technologies.forEach(skill => {
  console.log(skill);
});
```

Output:

```text
1180

JavaScript

React
```

This example demonstrates:

- Callback Functions.
- Higher-Order Functions.
- Arrow Function callbacks.
- Built-in Higher-Order Functions.

---

### 📊 Diagram / Flow

#### Callback Function

```text
Function

↓

Passed as Argument

↓

Executed Later
```

---

#### Higher-Order Function

```text
Higher-Order Function

│

├── Accept Function

│
└── Return Function
```

---

#### Relationship

```text
Callback

↓

Passed To

↓

Higher-Order Function

↓

Execution
```

---

#### Array Methods

```text
Array

↓

map()

↓

Callback

↓

New Array
```

---

### 🌍 Real-World Example

Imagine a food delivery service.

A customer places an order.

```text
Customer

↓

Restaurant

↓

Delivery Partner

↓

Customer
```

The restaurant prepares the food but doesn't deliver it itself.

Instead, it receives a **delivery partner** that performs the delivery.

Similarly:

- The **Higher-Order Function** is like the restaurant.
- The **Callback Function** is like the delivery partner.

The Higher-Order Function decides **when** to call the callback, while the callback performs the specific task.

This separation makes the entire system more flexible and reusable.

---

### 🎤 Interview Answer

A **Callback Function** is a function passed as an argument to another function so that it can be executed later. A **Higher-Order Function** is a function that either accepts one or more functions as arguments or returns another function. Callback Functions and Higher-Order Functions work together—for example, array methods like `map()`, `filter()`, and `reduce()` are Higher-Order Functions because they accept callback functions. These concepts are fundamental to modern JavaScript and are widely used in asynchronous programming, event handling, and functional programming.

---

### ❓ Follow-up Questions

1. What is the difference between a Callback Function and a Higher-Order Function?
2. Why are array methods like `map()` and `filter()` considered Higher-Order Functions?
3. Why are Callback Functions so common in asynchronous JavaScript?
4. Can a Higher-Order Function return another function?
5. What are some real-world examples of Higher-Order Functions?
6. What are the advantages of using Higher-Order Functions?

---

## 5. What are Pure Functions, Impure Functions, and Side Effects?

### 📖 Overview

Not all functions behave the same way.

Some functions always produce the same result for the same input and don't affect anything outside themselves.

Others may:

- Modify global variables.
- Update objects.
- Write to a database.
- Display output.
- Make API requests.

These differences introduce three important concepts:

- **Pure Functions**
- **Impure Functions**
- **Side Effects**

Understanding these concepts helps you write code that is easier to test, debug, and maintain.

---

### ⚙️ Main Explanation

### What is a Pure Function?

A **Pure Function** satisfies two rules:

1. It always returns the **same output for the same input**.
2. It **does not produce side effects**.

Example:

```js
function calculateTotal(price, tax) {
  return price + tax;
}

console.log(calculateTotal(1000, 180));
```

Output:

```text
1180
```

Every time the function receives:

```text
1000

180
```

it always returns:

```text
1180
```

It doesn't modify anything outside the function.

This makes it a **Pure Function**.

---

### Characteristics of Pure Functions

A Pure Function:

- Depends only on its input.
- Doesn't read mutable external state.
- Doesn't modify external variables.
- Doesn't change its arguments.
- Doesn't perform side effects.

Because of these properties, Pure Functions are predictable and reliable.

---

### What is an Impure Function?

An **Impure Function** violates one or both rules of a Pure Function.

Example:

```js
let totalSales = 0;

function addSale(amount) {
  totalSales += amount;

  return totalSales;
}
```

Calling:

```js
addSale(100);
```

Output:

```text
100
```

Calling it again:

```js
addSale(100);
```

Output:

```text
200
```

The input is the same.

The output changes because the function depends on external state.

This makes it an **Impure Function**.

---

### What are Side Effects?

A **Side Effect** is any action performed by a function that affects something outside its own scope.

Common side effects include:

- Modifying global variables.
- Updating object properties.
- Writing to a file.
- Saving data to a database.
- Making API requests.
- Changing the DOM.
- Printing to the console.

Example:

```js
function greet() {
  console.log("Welcome!");
}
```

This function has a side effect because it writes to the console.

---

Another example:

```js
const company = {
  employees: 20,
};

function hireEmployee() {
  company.employees++;
}
```

The function modifies an external object.

This is also a side effect.

---

### Pure vs Impure Functions

Consider these two examples.

Pure:

```js
function double(number) {
  return number * 2;
}
```

Always predictable.

---

Impure:

```js
let multiplier = 2;

function double(number) {
  return number * multiplier;
}
```

If `multiplier` changes:

```js
multiplier = 5;
```

The same input now produces a different result.

The function depends on external state.

---

### Why Are Pure Functions Preferred?

Pure Functions provide several advantages.

#### Predictable

The same input always produces the same output.

---

#### Easier to Test

Testing is straightforward because there are no external dependencies.

Example:

```js
expect(calculateTotal(1000, 180))
  .toBe(1180);
```

The result is always the same.

---

#### Easier to Debug

Since Pure Functions don't depend on external state, bugs are usually easier to locate.

---

#### Easier to Reuse

Pure Functions can be reused in different parts of an application without worrying about hidden side effects.

---

#### Better for Functional Programming

Concepts like:

- `map()`
- `filter()`
- `reduce()`
- Composition

work best with Pure Functions.

---

### Are Side Effects Always Bad?

No.

Applications must perform side effects.

For example:

- Displaying data on the screen.
- Fetching data from an API.
- Saving information to a database.
- Sending emails.

Without side effects, applications couldn't interact with users or external systems.

The goal isn't to eliminate side effects entirely.

Instead, we try to **isolate them**, keeping most business logic pure whenever possible.

---

### Pure Function vs Impure Function

| Pure Function | Impure Function |
|---------------|-----------------|
| Same input → Same output | Output may vary |
| No side effects | May produce side effects |
| Doesn't modify external state | Can modify external state |
| Easy to test | Harder to test |
| Predictable | Less predictable |

---

### 💻 Example

We'll continue using our running example.

```js
function calculateTotal(price, tax) {
  return price + tax;
}

let totalRevenue = 0;

function recordSale(amount) {
  totalRevenue += amount;
}

console.log(
  calculateTotal(1000, 180)
);

recordSale(1180);

console.log(totalRevenue);
```

Output:

```text
1180

1180
```

Here:

- `calculateTotal()` is a **Pure Function**.
- `recordSale()` is an **Impure Function** because it changes external state.

---

### 📊 Diagram / Flow

#### Pure Function

```text
Input

↓

Function

↓

Output

(No Side Effects)
```

---

#### Impure Function

```text
Input

↓

Function

↓

Modify External State

↓

Output
```

---

#### Side Effect

```text
Function

↓

Changes Outside World

↓

Database

Console

DOM

File

API
```

---

#### Predictability

```text
Same Input

↓

Pure Function

↓

Same Output

Every Time
```

---

### 🌍 Real-World Example

Imagine a vending machine.

A **Pure Function** is like pressing a button on a demo machine.

```text
₹20

↓

Press Coffee

↓

Coffee
```

Every time you insert ₹20 and press the coffee button, you get the same result.

Nothing else changes.

---

An **Impure Function** is like a real vending machine.

```text
₹20

↓

Coffee

↓

Coffee Dispensed

↓

Inventory Reduced
```

Now something outside the machine's output has changed—the inventory.

That's a **side effect**.

Similarly:

- Pure Functions only compute results.
- Impure Functions interact with the outside world.

---

### 🎤 Interview Answer

A **Pure Function** always returns the same output for the same input and does not produce side effects. An **Impure Function** either depends on external state, modifies external state, or performs side effects such as logging, updating the DOM, making API requests, or writing to a database. Pure Functions are preferred because they are predictable, easier to test, easier to debug, and highly reusable. While side effects are necessary in real applications, it's considered a good practice to isolate them and keep business logic as pure as possible.

---

### ❓ Follow-up Questions

1. What are the two rules that define a Pure Function?
2. What are some examples of side effects in JavaScript?
3. Why are Pure Functions easier to test?
4. Can an application be built using only Pure Functions? Why or why not?
5. Why are Pure Functions commonly used with `map()`, `filter()`, and `reduce()`?
6. What is the difference between a Pure Function and an Impure Function?

---

## 6. How do Functions work internally in JavaScript?

### 📖 Overview

Calling a function may look simple:

```js
calculateTotal(1000, 180);
```

However, behind the scenes, JavaScript performs several steps before the function actually executes.

Every function call involves:

- Memory Creation
- Hoisting
- Creating a new Execution Context
- Pushing the function onto the Call Stack
- Executing the function
- Returning a value
- Removing the function from the Call Stack

Understanding this lifecycle helps explain concepts like **Function Hoisting**, **Execution Context**, and **why Function Declarations behave differently from Function Expressions**.

---

### ⚙️ Main Explanation

### Function Hoisting

Function Hoisting means that **Function Declarations are available before their position in the source code**.

Example:

```js
greet();

function greet() {
  console.log("Welcome!");
}
```

Output:

```text
Welcome!
```

Although `greet()` is called before it appears in the code, JavaScript executes it successfully.

This happens because Function Declarations are processed during the **Memory Creation Phase**.

---

### Are Function Expressions Hoisted?

Function Expressions behave differently.

Consider:

```js
greet();

const greet = function () {
  console.log("Welcome!");
};
```

Output:

```text
ReferenceError
```

The variable `greet` is hoisted, but it remains in the **Temporal Dead Zone (TDZ)** until its declaration is executed.

Only then is the function assigned to the variable.

---

### Are Arrow Functions Hoisted?

Arrow Functions behave the same as Function Expressions because they are also assigned to variables.

Example:

```js
greet();

const greet = () => {
  console.log("Welcome!");
};
```

Output:

```text
ReferenceError
```

Again, the variable exists but isn't initialized yet.

---

### How are Functions Stored During the Memory Creation Phase?

During the **Memory Creation Phase**, JavaScript scans the code before execution begins.

For a Function Declaration:

```js
function greet() {}
```

JavaScript stores the **entire function** in memory.

```text
Memory

↓

greet

↓

Function Object
```

The function is immediately ready to use.

---

For a Function Expression:

```js
const greet = function () {};
```

Only the variable is created.

```text
Memory

↓

greet

↓

Uninitialized (TDZ)
```

The function is assigned later during the execution phase.

---

### What Happens When a Function is Called?

Suppose we have:

```js
function calculateTotal(price, tax) {
  return price + tax;
}

const total = calculateTotal(1000, 180);
```

JavaScript performs these steps:

1. Finds the function in memory.
2. Creates a new Function Execution Context.
3. Places the Execution Context on the Call Stack.
4. Assigns arguments to parameters.
5. Executes the function body.
6. Returns the result.
7. Removes the Function Execution Context from the Call Stack.

---

### Function Lifecycle

The complete lifecycle looks like this:

```text
Memory Creation

↓

Execution Starts

↓

Function Called

↓

Create Function Execution Context

↓

Push to Call Stack

↓

Execute Function

↓

Return Value

↓

Remove from Call Stack
```

---

### Functions and Execution Context

Every time a function is called, JavaScript creates a **new Function Execution Context**.

Each Execution Context has its own:

- Memory
- Variables
- Parameters
- Scope information

Example:

```js
function greet(name) {
  const message = `Hello ${name}`;

  console.log(message);
}

greet("Vaibhav");
```

The variables `name` and `message` exist only inside this Function Execution Context.

Once the function finishes, its Execution Context is destroyed.

---

### Functions and the Call Stack

The Call Stack keeps track of active function calls.

Example:

```js
function print(text) {
  console.log(text);
}

function greet(name) {
  const message = `Hello ${name}`;

  print(message);
}

greet("Vaibhav");
```

Execution flow:

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

When `print()` finishes, its Execution Context is removed.

Then `greet()` continues.

Finally, the Global Execution Context remains.

---

### Why Does JavaScript Create a New Execution Context?

Imagine calling the same function multiple times.

```js
greet("Vaibhav");

greet("Rahul");

greet("Ankit");
```

Each call needs its own independent variables.

Without separate Execution Contexts, one function call could overwrite another.

Creating a new Execution Context for every call keeps each invocation isolated.

---

### Relationship Between Functions and Execution Context

Every function call creates:

```text
Function Call

↓

Execution Context

↓

Memory Allocation

↓

Code Execution

↓

Destroyed
```

This relationship is fundamental to how JavaScript executes code.

> 💡 **Coming Next**
>
> We'll build on this concept in the **Closures** chapter, where functions continue to access variables even after their Execution Context has finished.

---

### 💻 Example

We'll continue using our running example.

```js
function calculateTotal(price, tax) {
  return price + tax;
}

function printInvoice(total) {
  console.log(`Total: ₹${total}`);
}

const total = calculateTotal(1000, 180);

printInvoice(total);
```

Output:

```text
Total: ₹1180
```

Execution Flow:

```text
Global Execution Context

↓

calculateTotal()

↓

Return 1180

↓

printInvoice()

↓

Finished
```

---

### 📊 Diagram / Flow

#### Memory Creation

```text
Source Code

↓

Memory Creation

↓

Functions Stored

↓

Execution Begins
```

---

#### Function Call Lifecycle

```text
Call Function

↓

Create Execution Context

↓

Push to Call Stack

↓

Execute

↓

Return

↓

Pop from Call Stack
```

---

#### Function Declaration

```text
Memory Creation

↓

Entire Function Stored

↓

Callable Anywhere
```

---

#### Function Expression

```text
Memory Creation

↓

Variable Created

↓

Execution

↓

Function Assigned
```

---

#### Call Stack

```text
┌──────────────────────────┐
│ print()                  │
├──────────────────────────┤
│ calculateTotal()         │
├──────────────────────────┤
│ Global Execution Context │
└──────────────────────────┘
```

---

### 🌍 Real-World Example

Imagine a customer support center.

Every time a customer calls, a new support ticket is created.

```text
Customer Call

↓

Support Ticket

↓

Issue Resolved

↓

Ticket Closed
```

Each ticket has its own information and is handled independently.

Similarly, every time a JavaScript function is called:

- A new **Execution Context** is created.
- It stores that function's variables and parameters.
- After the function completes, the Execution Context is removed.

This ensures that multiple function calls don't interfere with one another.

---

### 🎤 Interview Answer

When JavaScript starts executing a program, it first performs the **Memory Creation Phase**, where Function Declarations are fully stored in memory, making them available before their declaration. Function Expressions and Arrow Functions, however, are assigned to variables and are not usable until execution reaches their declaration. Every time a function is called, JavaScript creates a new **Function Execution Context**, pushes it onto the **Call Stack**, assigns arguments to parameters, executes the function body, returns a value, and finally removes the Execution Context from the Call Stack. This process ensures that each function call has its own independent scope and memory.

---

### ❓ Follow-up Questions

1. Why are Function Declarations hoisted but Function Expressions are not?
2. What happens during the Memory Creation Phase for functions?
3. How does a Function Execution Context differ from the Global Execution Context?
4. Why does every function call create a new Execution Context?
5. How does the Call Stack manage function execution?
6. How are Function Expressions and Arrow Functions stored during the Memory Creation Phase?

---

## 7. What are `this`, `arguments`, and Rest Parameters in Functions?

### 📖 Overview

When a function executes, JavaScript automatically provides some additional features that help the function work with its execution context.

Three important concepts are:

- **`this`** – Refers to the object associated with the current function call.
- **`arguments`** – An array-like object containing all arguments passed to a regular function.
- **Rest Parameters (`...`)** – A modern way to collect multiple arguments into an actual array.

Understanding these concepts is important because they affect how functions behave, especially when comparing **Regular Functions** and **Arrow Functions**.

---

### ⚙️ Main Explanation

### The `this` Keyword

#### What is `this`?

The `this` keyword refers to the **object that calls the function**.

Unlike ordinary variables, the value of `this` is determined **when the function is invoked**, not when it is defined.

Example:

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    console.log(this.name);
  },
};

company.printName();
```

Output:

```text
Vaibhav Docs
```

Here, `this` refers to the `company` object because `company` is calling the function.

> 💡 **Coming Next**
>
> The `this` keyword is a large topic on its own. We'll explore global `this`, implicit binding, explicit binding, `call()`, `apply()`, `bind()`, and lexical `this` in a dedicated **`this` chapter**.

---

### Why Don't Arrow Functions Have Their Own `this`?

Regular functions create their own `this`.

Arrow Functions do **not**.

Instead, they inherit `this` from the surrounding (lexical) scope.

Example:

```js
const company = {
  name: "Vaibhav Docs",

  printName: () => {
    console.log(this.name);
  },
};

company.printName();
```

The output is **not** `"Vaibhav Docs"` because the Arrow Function doesn't use `company` as its `this`.

Instead, it inherits `this` from the scope in which it was created.

This behavior makes Arrow Functions especially useful inside callbacks, where preserving the surrounding `this` is often desirable.

---

### Can Arrow Functions Be Used as Constructors?

No.

Example:

```js
const Person = (name) => {
  this.name = name;
};

new Person("Vaibhav");
```

Output:

```text
TypeError
```

Arrow Functions cannot be used with the `new` keyword because they don't have their own `this` or the internal behavior required for constructor functions.

---

### The `arguments` Object

#### What is the `arguments` Object?

Every **regular function** automatically receives an `arguments` object.

It contains all arguments passed during the function call.

Example:

```js
function printArguments() {
  console.log(arguments);
}

printArguments(
  "JavaScript",
  "React",
  "Node.js"
);
```

Output:

```text
Arguments(3)
```

The `arguments` object behaves like an array but is **not** an actual array.

For example:

```js
arguments.length;
```

works.

However:

```js
arguments.map();
```

does not exist because `arguments` isn't a real array.

---

### Do Arrow Functions Have an `arguments` Object?

No.

Arrow Functions do **not** create their own `arguments` object.

Example:

```js
const printArguments = () => {
  console.log(arguments);
};

printArguments();
```

Output:

```text
ReferenceError
```

If an Arrow Function needs access to arguments, it inherits `arguments` from its surrounding regular function, if one exists.

In modern JavaScript, Rest Parameters are the preferred solution.

---

### Rest Parameters

Rest Parameters collect all remaining arguments into an actual array.

Example:

```js
function printSkills(...skills) {
  console.log(skills);
}

printSkills(
  "JavaScript",
  "React",
  "Node.js"
);
```

Output:

```text
[
  "JavaScript",
  "React",
  "Node.js"
]
```

Unlike the `arguments` object:

- Rest Parameters are real arrays.
- Array methods such as `map()` and `filter()` work directly.

---

### `arguments` Object vs Rest Parameters

| `arguments` Object | Rest Parameters |
|--------------------|-----------------|
| Available only in regular functions | Works with both regular and arrow functions |
| Array-like object | Real array |
| Automatically available | Must be declared |
| Supports `.length` | Supports all array methods |
| Legacy approach | Modern approach |

For new code, Rest Parameters are generally recommended.

---

### When Should You Use Rest Parameters?

Use Rest Parameters when:

- A function accepts any number of arguments.
- You need array methods like `map()` or `reduce()`.
- Writing modern JavaScript.

Example:

```js
function sum(...numbers) {
  return numbers.reduce(
    (total, number) => total + number,
    0
  );
}

console.log(sum(10, 20, 30));
```

Output:

```text
60
```

---

### Best Practices

- Use **Regular Functions** when you need your own `this`.
- Use **Arrow Functions** when you want to inherit `this` from the surrounding scope.
- Prefer **Rest Parameters** over the `arguments` object in modern JavaScript.
- Avoid using Arrow Functions as constructors.

---

### 💻 Example

We'll continue using our running example.

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    console.log(this.name);
  },
};

company.printName();

function printSkills(...skills) {
  console.log(skills);
}

printSkills(
  "JavaScript",
  "React",
  "Node.js"
);
```

Output:

```text
Vaibhav Docs

[
  "JavaScript",
  "React",
  "Node.js"
]
```

This example demonstrates:

- `this` in a regular function.
- Rest Parameters.
- Modern function argument handling.

---

### 📊 Diagram / Flow

#### Regular Function

```text
Function Call

↓

Own `this`

↓

Own `arguments`
```

---

#### Arrow Function

```text
Arrow Function

↓

Inherit `this`

↓

No Own `arguments`
```

---

#### Rest Parameters

```text
Many Arguments

↓

...

↓

One Array
```

---

#### `arguments` vs Rest

```text
arguments

↓

Array-like Object

-------------------

Rest

↓

Real Array
```

---

### 🌍 Real-World Example

Imagine a meeting room.

A **Regular Function** is like a meeting where every team has its own manager and attendance sheet.

```text
Meeting

↓

Own Manager (`this`)

↓

Own Attendance (`arguments`)
```

Each meeting manages its own information independently.

An **Arrow Function** is like a temporary consultant joining the meeting.

Instead of bringing a new manager and attendance sheet, the consultant simply follows the manager and records already being used in the surrounding meeting.

Similarly:

- Regular Functions create their own execution context for `this` and `arguments`.
- Arrow Functions reuse the surrounding context.

---

### 🎤 Interview Answer

Regular Functions and Arrow Functions differ in how they handle `this` and `arguments`. A Regular Function creates its own `this` value based on how it is called and automatically receives an `arguments` object containing all passed arguments. Arrow Functions do not create their own `this` or `arguments`; instead, they inherit both from the surrounding lexical scope. Because of this, Arrow Functions cannot be used as constructors. In modern JavaScript, Rest Parameters are preferred over the `arguments` object because they produce a real array and work with both Regular and Arrow Functions.

---

### ❓ Follow-up Questions

1. Why don't Arrow Functions have their own `this`?
2. Why can't Arrow Functions be used with the `new` keyword?
3. What is the difference between the `arguments` object and Rest Parameters?
4. Why are Rest Parameters preferred in modern JavaScript?
5. Can Arrow Functions access `arguments` from an outer function?
6. When should you choose a Regular Function instead of an Arrow Function?

---

## 8. What are Recursion, Function Composition, and Currying?

### 📖 Overview

Functions are not limited to executing code once and returning a result.

They can also:

- Call themselves.
- Be combined together.
- Be transformed into specialized functions.

These capabilities introduce several advanced concepts:

- **Recursion**
- **Function Composition**
- **Currying**
- **Partial Application**

Although these concepts may seem unrelated at first, they all focus on **building reusable and flexible functions**.

They are commonly discussed in technical interviews and are widely used in functional programming.

---

### ⚙️ Main Explanation

### What is Recursion?

Recursion is a technique where **a function calls itself** to solve a problem.

Instead of solving the entire problem at once, the function repeatedly solves smaller versions of the same problem.

Example:

```js
function countdown(number) {
  if (number === 0) {
    return;
  }

  console.log(number);

  countdown(number - 1);
}

countdown(3);
```

Output:

```text
3

2

1
```

Each function call creates a new Execution Context until the base condition is reached.

---

### What is a Base Condition?

A **Base Condition** is the condition that stops recursion.

Example:

```js
if (number === 0) {
  return;
}
```

Without it, the function would continue calling itself forever.

---

### What Happens if the Base Condition is Missing?

Example:

```js
function recurse() {
  recurse();
}

recurse();
```

Output:

```text
RangeError:
Maximum call stack size exceeded
```

JavaScript eventually runs out of Call Stack space because new Function Execution Contexts keep being created.

---

### Advantages of Recursion

Recursion can make certain problems easier to understand.

It is commonly used for:

- Tree traversal.
- Folder traversal.
- Graph algorithms.
- Recursive data structures.
- Divide-and-conquer algorithms.

Many naturally recursive problems become easier to express using recursion.

---

### Disadvantages of Recursion

Recursion also has limitations.

- Creates a new Execution Context for every call.
- Uses additional Call Stack memory.
- Can be slower than iteration.
- Missing a base condition causes a stack overflow.

For simple repetitive tasks, iteration is often more efficient.

---

### Recursion vs Iteration

Iteration uses loops.

Example:

```js
for (let i = 3; i > 0; i--) {
  console.log(i);
}
```

Recursion:

```js
countdown(3);
```

Both solve the same problem.

The choice depends on readability, performance, and the nature of the problem.

---

### What is Tail Recursion?

Tail Recursion is a special form of recursion where the **recursive call is the final operation** performed by the function.

Example:

```js
function countdown(number) {
  if (number === 0) {
    return;
  }

  return countdown(number - 1);
}
```

Because nothing happens after the recursive call, the function is tail-recursive.

Some programming languages optimize Tail Recursion to avoid growing the Call Stack.

---

### Does JavaScript Optimize Tail Recursion?

Although Tail Call Optimization (TCO) exists in the ECMAScript specification, **most modern JavaScript engines do not implement it**.

As a result, Tail Recursion generally provides **no performance benefit** in today's JavaScript environments.

---

### What is Function Composition?

Function Composition combines multiple functions to produce a new function.

Instead of writing one large function, we build small functions and connect them together.

Example:

```js
function double(number) {
  return number * 2;
}

function addTen(number) {
  return number + 10;
}

const result = addTen(double(5));

console.log(result);
```

Output:

```text
20
```

Flow:

```text
5

↓

double()

↓

10

↓

addTen()

↓

20
```

This approach encourages small, reusable functions.

---

### What is Currying?

Currying transforms a function that accepts multiple arguments into a sequence of functions, each accepting **one argument**.

Instead of:

```js
function multiply(a, b) {
  return a * b;
}
```

We write:

```js
function multiply(a) {
  return function (b) {
    return a * b;
  };
}
```

Usage:

```js
const double = multiply(2);

console.log(double(5));
```

Output:

```text
10
```

Currying allows functions to be specialized and reused.

---

### What is Partial Application?

Partial Application is similar to Currying but not identical.

It creates a new function by fixing **some** arguments of an existing function.

Example:

```js
function multiply(a, b) {
  return a * b;
}

const double = number =>
  multiply(2, number);

console.log(double(5));
```

Output:

```text
10
```

Here:

- The original function still accepts multiple arguments.
- We simply create a new function with one argument already fixed.

---

### Currying vs Partial Application

| Currying | Partial Application |
|----------|----------------------|
| Converts a function into multiple single-argument functions | Fixes some arguments of an existing function |
| Changes the function's structure | Keeps the original structure |
| Common in functional programming | Common for creating specialized functions |

---

### Why Are These Concepts Useful?

Together, these techniques help create:

- Smaller functions.
- Reusable code.
- Better composition.
- Cleaner business logic.

They are especially valuable in functional programming and large applications.

---

> 💡 **Coming Next**
>
> The next topic introduces **Generator Functions**, another advanced feature that allows functions to pause and resume execution.

---

### 💻 Example

We'll continue using our running example.

```js
function calculateTax(price) {
  return price + 180;
}

function applyDiscount(price) {
  return price - 100;
}

const finalPrice =
  applyDiscount(
    calculateTax(1000)
  );

console.log(finalPrice);

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
1080

20
```

This example demonstrates:

- Function Composition.
- Currying.
- Reusing specialized functions.

---

### 📊 Diagram / Flow

#### Recursion

```text
Function

↓

Calls Itself

↓

Base Condition?

│

├── Yes

│     Stop

│
└── No

      Call Again
```

---

#### Recursion vs Iteration

```text
Recursion

↓

Function Calls

-------------------

Iteration

↓

Loop
```

---

#### Function Composition

```text
Input

↓

Function A

↓

Function B

↓

Result
```

---

#### Currying

```text
f(a, b)

↓

f(a)

↓

Function

↓

(b)

↓

Result
```

---

### 🌍 Real-World Example

Imagine building a product in a factory.

One worker performs every task alone.

```text
Raw Material

↓

Worker

↓

Finished Product
```

Now imagine an assembly line.

```text
Raw Material

↓

Cutting

↓

Painting

↓

Packaging

↓

Finished Product
```

This is similar to **Function Composition**, where several small functions work together.

Now imagine one machine is permanently configured to cut only wooden boards.

```text
Wood

↓

Specialized Machine
```

This resembles **Currying** or **Partial Application**, where a function is customized for a specific purpose.

Finally, imagine a staircase.

To reach the top, you climb one step at a time.

```text
Step 1

↓

Step 2

↓

Step 3

↓

Destination
```

This is similar to **Recursion**, where each function call solves a smaller part of the same problem until the destination (base condition) is reached.

---

### 🎤 Interview Answer

Recursion is a technique where a function calls itself until a base condition is reached. It is useful for problems like tree traversal but consumes Call Stack memory and can cause stack overflow if the base condition is missing. Function Composition combines small functions so the output of one becomes the input of another, improving reusability. Currying transforms a function with multiple arguments into a sequence of single-argument functions, while Partial Application creates a new function by fixing some arguments of an existing function. Together, these techniques are fundamental concepts in functional programming and help build modular, reusable code.

---

### ❓ Follow-up Questions

1. What is a base condition in recursion, and why is it important?
2. What happens if a recursive function has no base condition?
3. What is the difference between recursion and iteration?
4. What is the difference between Currying and Partial Application?
5. Why doesn't Tail Recursion improve performance in most JavaScript engines?
6. When should you use Function Composition?

---

## 9. What are Generator Functions?

### 📖 Overview

Normally, when a JavaScript function is called, it executes from **start to finish** without stopping.

Once it reaches a `return` statement (or the end of the function), execution is complete.

However, some situations require a function to:

- Pause execution.
- Return a value.
- Resume later from the exact same point.

This is where **Generator Functions** come in.

Generator Functions are special functions that can **pause and resume their execution**, making them useful for handling sequences of values and implementing custom iterators.

---

### ⚙️ Main Explanation

### What is a Generator Function?

A **Generator Function** is a special type of function that can pause its execution and continue later.

It is declared using the `function*` syntax.

Example:

```js
function* generateNumbers() {
  yield 1;
  yield 2;
  yield 3;
}
```

Notice the `*` after the `function` keyword.

This tells JavaScript that the function is a Generator.

---

### Why Do Generator Functions Use `function*`?

The `*` distinguishes Generator Functions from regular functions.

Regular Function:

```js
function greet() {}
```

Generator Function:

```js
function* greet() {}
```

The `*` indicates that the function can:

- Pause execution.
- Produce multiple values over time.
- Resume from where it previously stopped.

---

### What Happens When a Generator Function is Called?

Calling a Generator Function **does not execute its body immediately**.

Instead, it returns a **Generator Object**.

Example:

```js
function* generateNumbers() {
  yield 1;
  yield 2;
}

const generator = generateNumbers();

console.log(generator);
```

Output:

```text
Generator {}
```

The function body hasn't executed yet.

Execution begins only when `next()` is called.

---

### The `next()` Method

The `next()` method resumes execution until the next `yield` statement.

Example:

```js
function* generateNumbers() {
  yield 1;
  yield 2;
}

const generator = generateNumbers();

console.log(generator.next());
```

Output:

```text
{
  value: 1,
  done: false
}
```

Calling `next()` again:

```js
console.log(generator.next());
```

Output:

```text
{
  value: 2,
  done: false
}
```

Calling it once more:

```js
console.log(generator.next());
```

Output:

```text
{
  value: undefined,
  done: true
}
```

The generator has finished executing.

---

### What Does `yield` Do?

The `yield` keyword temporarily pauses the Generator Function and returns a value.

Example:

```js
function* generateNumbers() {
  yield 1;

  console.log("Paused");

  yield 2;
}
```

Execution Flow:

```text
next()

↓

yield 1

↓

Pause

↓

next()

↓

Resume

↓

yield 2
```

Unlike `return`, execution is **not** finished after `yield`.

---

### `yield` vs `return`

Both send values back to the caller, but they behave differently.

Example:

```js
function* demo() {
  yield 1;

  yield 2;

  return 3;
}
```

Execution:

```text
next()

↓

1

-------------------

next()

↓

2

-------------------

next()

↓

3

done: true
```

After `return`, the Generator is permanently finished.

---

### Generator Execution Flow

Consider:

```js
function* greet() {
  console.log("Start");

  yield "Hello";

  console.log("Continue");

  yield "World";

  console.log("Finish");
}
```

Execution:

```text
next()

↓

Start

↓

yield "Hello"

↓

Pause

-------------------

next()

↓

Continue

↓

yield "World"

↓

Pause

-------------------

next()

↓

Finish

↓

Complete
```

The Generator remembers exactly where execution stopped.

---

### When Should You Use Generator Functions?

Generators are useful when values should be produced **one at a time** instead of all at once.

Common use cases include:

- Custom iterators.
- Processing large datasets.
- Lazy evaluation.
- Infinite sequences.
- Tree traversal.
- Pagination.
- Streaming data.

Instead of generating everything immediately, values can be generated only when needed.

---

### Real-World Use Cases

Imagine reading a very large file.

Without Generators:

```text
Load Entire File

↓

Process
```

This may consume a lot of memory.

With Generators:

```text
Read One Line

↓

Process

↓

Read Next Line

↓

Process
```

Only a small portion is processed at a time.

This approach is known as **lazy evaluation**.

---

### Best Practices

Use Generator Functions when:

- Producing values incrementally.
- Building custom iterators.
- Processing very large collections.
- Memory efficiency is important.

For ordinary functions that simply compute a result once, a Regular Function is usually a better choice.

---

### 💻 Example

We'll continue using our running example.

```js
function* projectStages() {
  yield "Planning";

  yield "Development";

  yield "Testing";

  yield "Deployment";
}

const stages = projectStages();

console.log(stages.next());

console.log(stages.next());

console.log(stages.next());

console.log(stages.next());
```

Output:

```text
{ value: "Planning", done: false }

{ value: "Development", done: false }

{ value: "Testing", done: false }

{ value: "Deployment", done: false }
```

Each call resumes execution from the previous `yield`.

---

### 📊 Diagram / Flow

#### Generator Lifecycle

```text
Call Generator

↓

Generator Object

↓

next()

↓

yield

↓

Pause

↓

next()

↓

Resume
```

---

#### Generator Flow

```text
Start

↓

yield

↓

Pause

↓

yield

↓

Pause

↓

return

↓

Finished
```

---

#### `yield` vs `return`

```text
yield

↓

Return Value

↓

Pause

-------------------

return

↓

Return Value

↓

Finish
```

---

#### Generator Object

```text
Generator Function

↓

Generator Object

↓

next()

↓

Value
```

---

### 🌍 Real-World Example

Imagine an online course.

Instead of giving students the entire course on the first day, lessons are released one at a time.

```text
Lesson 1

↓

Complete

↓

Lesson 2

↓

Complete

↓

Lesson 3
```

Students progress only when they're ready for the next lesson.

A Generator Function works the same way.

Instead of returning everything at once, it produces one value, pauses, and waits until the next value is requested.

This makes Generators efficient for handling large or continuous sequences of data.

---

### 🎤 Interview Answer

A **Generator Function** is a special type of function declared with the `function*` syntax. Unlike regular functions, Generator Functions can pause their execution using the `yield` keyword and resume later from the same point. Calling a Generator Function returns a Generator Object instead of executing the function immediately. Execution begins when the `next()` method is called, which returns an object containing `value` and `done` properties. Generators are commonly used for custom iterators, lazy evaluation, processing large datasets, and generating sequences of values efficiently.

---

### ❓ Follow-up Questions

1. Why do Generator Functions use the `function*` syntax?
2. What is the difference between `yield` and `return`?
3. Why doesn't a Generator Function execute immediately when called?
4. What does the `next()` method return?
5. What are some real-world use cases for Generator Functions?
6. How do Generator Functions support lazy evaluation?

---

## 10. What are the Best Practices for Writing Reusable Functions?

### 📖 Overview

Writing a function that works is only the first step.

In professional software development, functions should also be:

- Easy to read.
- Easy to reuse.
- Easy to test.
- Easy to maintain.

Well-designed functions reduce bugs, improve collaboration, and make large codebases easier to understand.

The goal is not to write clever functions, but to write functions that clearly express their purpose.

---

### ⚙️ Main Explanation

### 1. Keep Functions Small

A function should focus on solving **one specific problem**.

Instead of writing one large function that performs multiple tasks, split it into smaller functions.

Less readable:

```js
function processOrder(order) {
  // Validate

  // Calculate total

  // Save order

  // Send email

  // Generate invoice
}
```

Better:

```js
validateOrder(order);

calculateTotal(order);

saveOrder(order);

sendEmail(order);

generateInvoice(order);
```

Each function has a single responsibility.

---

### 2. Give Functions Meaningful Names

A function name should clearly describe **what it does**.

Good examples:

```js
calculateTotal();

sendInvoice();

validateUser();
```

Avoid vague names such as:

```js
process();

run();

handle();

temp();
```

A good function name often removes the need for additional comments.

---

### 3. Prefer Pure Functions When Possible

Pure Functions are predictable because they:

- Always return the same output for the same input.
- Do not modify external state.

Example:

```js
function calculateTax(price) {
  return price * 0.18;
}
```

This function is easy to test and reuse.

Keep side effects separate whenever possible.

---

### 4. Avoid Duplicate Logic

If you find yourself copying the same code multiple times, consider moving it into a function.

Instead of:

```js
const total1 = price1 + tax1;

const total2 = price2 + tax2;
```

Create a reusable function:

```js
function calculateTotal(price, tax) {
  return price + tax;
}
```

Now the logic exists in only one place.

---

### 5. Keep Parameters Simple

Functions should receive only the data they actually need.

Instead of:

```js
calculateInvoice(user);
```

when only the price is required,

prefer:

```js
calculateInvoice(price);
```

Passing unnecessary data increases coupling and makes functions harder to reuse.

---

### 6. Return Values Instead of Printing Them

Whenever possible, return results instead of directly logging them.

Instead of:

```js
function calculateTotal(price, tax) {
  console.log(price + tax);
}
```

Prefer:

```js
function calculateTotal(price, tax) {
  return price + tax;
}
```

The caller can then decide what to do with the result.

```js
const total =
  calculateTotal(1000, 180);

console.log(total);
```

This makes the function much more flexible.

---

### 7. Avoid Global Variables

Functions should rely on their parameters rather than external variables.

Avoid:

```js
let tax = 180;

function calculateTotal(price) {
  return price + tax;
}
```

Better:

```js
function calculateTotal(price, tax) {
  return price + tax;
}
```

The function is now independent and easier to reuse.

---

### 8. Use Default Parameters When Appropriate

Default parameters simplify function calls.

Example:

```js
function greet(name = "Guest") {
  return `Welcome ${name}`;
}
```

Now both calls work naturally.

```js
greet();

greet("Vaibhav");
```

---

### 9. Compose Small Functions

Instead of creating one large function, combine smaller ones.

Example:

```js
function calculateTax(price) {
  return price + 180;
}

function applyDiscount(price) {
  return price - 100;
}

const finalPrice =
  applyDiscount(
    calculateTax(1000)
  );
```

Small reusable functions are easier to understand and test.

---

### 10. Write Functions for Humans

A function may execute correctly, but that doesn't automatically make it good code.

Ask yourself:

- Is the name clear?
- Is the logic easy to follow?
- Could another developer understand it quickly?

Readable code usually leads to fewer bugs and easier maintenance.

---

### Explaining JavaScript Functions to a Java or C++ Developer

Developers coming from Java or C++ often notice one major difference.

In JavaScript:

- Functions are values.
- Functions can be stored in variables.
- Functions can be passed as arguments.
- Functions can be returned from other functions.

Example:

```js
function greet() {
  console.log("Hello");
}

function execute(action) {
  action();
}

execute(greet);
```

This level of flexibility enables features such as:

- Callbacks
- Higher-Order Functions
- Closures
- Currying
- Functional Programming

Although Java and modern C++ now support similar concepts through lambdas and functional interfaces, JavaScript was designed with first-class functions from the beginning, making these patterns very natural.

---

### 💻 Example

We'll continue using our running example.

```js
function calculateTax(price) {
  return price * 0.18;
}

function calculateTotal(price) {
  return price + calculateTax(price);
}

function printInvoice(total) {
  console.log(`Total: ₹${total}`);
}

const total =
  calculateTotal(1000);

printInvoice(total);
```

Output:

```text
Total: ₹1180
```

This example demonstrates:

- Small reusable functions.
- Function composition.
- Returning values instead of printing intermediate results.

---

### 📊 Diagram / Flow

#### Small Functions

```text
Large Function

↓

Small Functions

↓

Reusable Code
```

---

#### Function Composition

```text
Input

↓

Function A

↓

Function B

↓

Output
```

---

#### Pure Function

```text
Input

↓

Function

↓

Output

(No Side Effects)
```

---

#### Reusable Function

```text
Write Once

↓

Reuse Everywhere
```

---

### 🌍 Real-World Example

Imagine building a house.

Instead of asking one worker to do everything—

- Design
- Plumbing
- Electrical work
- Painting
- Roofing

—you hire specialists.

```text
Architect

↓

Electrician

↓

Plumber

↓

Painter

↓

Finished House
```

Each worker focuses on a single responsibility.

Functions should be designed the same way.

A small function with one clear responsibility is easier to understand, reuse, test, and maintain than one large function that tries to do everything.

---

### 🎤 Interview Answer

Reusable functions should be small, focused, and designed to perform a single responsibility. They should have meaningful names, avoid unnecessary dependencies on global variables, return values instead of directly producing output, and accept only the required parameters. Whenever possible, functions should be pure to improve predictability and testability. Combining small functions through composition creates modular, maintainable code. In JavaScript, functions are first-class citizens, allowing them to be passed, returned, and stored like any other value, making them highly reusable across applications.

---

### ❓ Follow-up Questions

1. Why is the Single Responsibility Principle important for functions?
2. Why are Pure Functions easier to maintain?
3. Why should functions return values instead of printing them directly?
4. How does Function Composition improve code reusability?
5. Why should functions avoid depending on global variables?
6. How would you explain JavaScript's first-class functions to a Java or C++ developer?

---