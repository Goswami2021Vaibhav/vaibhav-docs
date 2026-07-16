---
title: this Keyword
description: Binding rules, call/apply/bind, and why arrow functions behave differently.
sidebar_position: 9
---

# this Keyword

## 1. What is the `this` keyword, and how does it work in JavaScript?

### 📖 Overview

The **`this`** keyword is one of the most misunderstood concepts in JavaScript because its value is **not fixed**.

Unlike ordinary variables, the value of `this` depends on **how a function is called**, not where it is written.

A common misconception is:

> "`this` refers to the function itself."

This is incorrect.

A better way to think about `this` is:

> **`this` refers to the object that is currently executing the function.**

However, the exact value of `this` depends on the **calling context**.

Understanding this concept is essential because `this` is used extensively in:

- Objects
- Classes
- Event handlers
- Constructors
- React (especially older class components)
- Many JavaScript libraries

---

### ⚙️ Main Explanation

### What is `this`?

`this` is a special keyword automatically provided by JavaScript.

It allows a function to access the object associated with the current function call.

Unlike variables, you never assign a value to `this` directly.

JavaScript determines its value when the function is invoked.

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

Here:

```text
this

↓

company
```

because `company` is calling the function.

---

### When is the Value of `this` Determined?

One of the most important interview concepts is:

> **`this` is determined at runtime, not when the function is defined.**

Example:

```js
function printName() {
  console.log(this);
}
```

Simply defining the function doesn't decide the value of `this`.

Only when the function is called does JavaScript determine what `this` should refer to.

---

### `this` in Different Contexts

The value of `this` changes depending on where and how a function is executed.

Let's look at the most common situations.

---

### 1. Global Scope

In a browser script:

```js
console.log(this);
```

Output:

```text
window
```

The global `this` refers to the global object (`window` in browsers).

> 💡 **Coming Next**
>
> We'll compare Browser, Node.js, ES Modules, and Strict Mode behavior later in this chapter.

---

### 2. Regular Function

```js
function greet() {
  console.log(this);
}

greet();
```

In **non-strict mode**, `this` refers to the global object.

In **strict mode**, `this` becomes:

```text
undefined
```

We'll explore this behavior in detail later.

---

### 3. Object Method

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

Here:

```text
this

↓

company
```

because the object invokes the method.

---

### 4. Arrow Function

Arrow Functions behave differently.

They **do not create their own `this`**.

Instead, they inherit `this` from the surrounding lexical scope.

Example:

```js
const company = {
  name: "Vaibhav Docs",

  printName: () => {
    console.log(this);
  },
};

company.printName();
```

The Arrow Function does **not** use `company` as its `this`.

Instead, it inherits `this` from where it was created.

This behavior is called **lexical `this`**.

---

### Why Don't Arrow Functions Have Their Own `this`?

Arrow Functions were introduced to solve a common problem.

Consider a callback inside a regular function.

Without Arrow Functions, developers often had to write:

```js
const self = this;
```

or

```js
.bind(this);
```

Arrow Functions automatically inherit `this` from the surrounding scope, eliminating the need for these workarounds.

---

### 5. Constructor Function

When a function is called using the `new` keyword:

```js
function User(name) {
  this.name = name;
}

const user =
  new User("Vaibhav");
```

JavaScript creates a new object.

Here:

```text
this

↓

New Object
```

The properties are added to that new object.

---

### 6. Class

Classes behave similarly to constructor functions.

Example:

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

const user =
  new User("Vaibhav");
```

Again:

```text
this

↓

New Instance
```

The class instance becomes the value of `this`.

---

### Dynamic `this` vs Lexical `this`

JavaScript has two different behaviors.

#### Dynamic `this`

Regular Functions determine `this` when they are called.

```text
Function Call

↓

Determine `this`
```

---

#### Lexical `this`

Arrow Functions inherit `this` from their surrounding scope.

```text
Surrounding Scope

↓

Inherited `this`
```

This distinction is one of the most important interview concepts.

---

### Why Does JavaScript Use `this`?

Imagine every object had to pass itself into every method.

Instead of:

```js
company.printName(company);
```

we simply write:

```js
company.printName();
```

JavaScript automatically provides access to the current object through `this`.

This makes object-oriented code cleaner and easier to read.

---

> 💡 **Coming Next**
>
> In the next topic, we'll learn **how JavaScript internally determines the value of `this`** using the **four binding rules** and the **Execution Context**.

---

### 💻 Example

We'll use the following example throughout this chapter.

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    console.log(this.name);
  },
};

company.printName();

function User(name) {
  this.name = name;
}

const user =
  new User("Vaibhav");

console.log(user.name);
```

Output:

```text
Vaibhav Docs

Vaibhav
```

This example demonstrates:

- `this` inside an object method.
- `this` inside a constructor function.

---

### 📊 Diagram / Flow

#### Runtime Resolution

```text
Function Called

↓

JavaScript Determines

↓

Value of `this`
```

---

#### Regular Function

```text
Function Call

↓

Dynamic `this`
```

---

#### Arrow Function

```text
Outer Scope

↓

Inherited `this`
```

---

#### Constructor

```text
new

↓

Create Object

↓

`this`

↓

New Object
```

---

#### Object Method

```text
company

↓

printName()

↓

this

↓

company
```

---

### 🌍 Real-World Example

Imagine a company where employees wear ID badges.

Whenever someone enters a meeting room, their badge identifies **who is currently speaking**.

```text
Meeting

↓

Employee Speaks

↓

ID Badge Identifies Speaker
```

The badge doesn't permanently belong to the meeting—it represents whoever is currently using it.

The `this` keyword works similarly.

It doesn't permanently belong to a function.

Instead, JavaScript determines its value when the function is called, based on **who is invoking it**.

---

### 🎤 Interview Answer

The **`this`** keyword is a special JavaScript keyword that refers to the object associated with the current function call. Unlike ordinary variables, its value is determined **at runtime**, not when the function is defined. In Regular Functions, `this` is determined by how the function is invoked, while Arrow Functions don't create their own `this` and instead inherit it from their surrounding lexical scope. In object methods, `this` refers to the object calling the method, and when a function or class is invoked with the `new` keyword, `this` refers to the newly created object. Understanding `this` requires understanding how JavaScript resolves function calls at runtime.

---

### ❓ Follow-up Questions

1. Why is the value of `this` determined at runtime?
2. What is the difference between dynamic `this` and lexical `this`?
3. Why don't Arrow Functions have their own `this`?
4. What does `this` refer to inside a constructor function?
5. How does `this` behave inside an object method?
6. Why is `this` considered one of the most confusing JavaScript concepts?

---

## 2. How does JavaScript determine the value of `this`?

### 📖 Overview

In the previous topic, we learned that the value of **`this`** is determined **when a function is called**, not when it is defined.

But how does JavaScript actually decide what `this` should be?

Instead of guessing, the JavaScript engine follows a well-defined set of rules known as the **four binding rules**.

Whenever a regular function is invoked, JavaScript checks these rules in order to determine the value of `this`.

Understanding these rules is the key to solving almost every `this`-related interview question.

---

### ⚙️ Main Explanation

### How JavaScript Resolves `this`

When a function is called, JavaScript asks a simple question:

> **How was this function invoked?**

Based on the answer, it applies one of the four binding rules.

```text
Function Call

↓

Check Call Site

↓

Apply Binding Rule

↓

Assign `this`
```

The call site—not the function definition—determines the value of `this`.

---

### The Four Binding Rules

JavaScript resolves `this` using the following priority:

1. **`new` Binding**
2. **Explicit Binding (`call`, `apply`, `bind`)**
3. **Implicit Binding**
4. **Default Binding**

If a higher-priority rule applies, the lower ones are ignored.

---

### Rule 1: `new` Binding (Highest Priority)

If a function is called with the `new` keyword, JavaScript creates a new object and assigns it to `this`.

Example:

```js
function User(name) {
  this.name = name;
}

const user =
  new User("Vaibhav");
```

Internally, JavaScript performs something similar to:

```text
Create Empty Object

↓

Assign to `this`

↓

Execute Function

↓

Return Object
```

Here:

```text
this

↓

New Object
```

---

### Rule 2: Explicit Binding

JavaScript allows you to manually specify the value of `this` using:

- `call()`
- `apply()`
- `bind()`

Example:

```js
function greet() {
  console.log(this.name);
}

const company = {
  name: "Vaibhav Docs",
};

greet.call(company);
```

Output:

```text
Vaibhav Docs
```

Here, JavaScript doesn't determine `this` automatically—you explicitly provide it.

We'll explore these methods in detail later in this chapter.

---

### Rule 3: Implicit Binding

If a function is called as an object method, `this` refers to the object before the dot.

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

The call site is:

```text
company.printName()
```

So:

```text
this

↓

company
```

---

### Rule 4: Default Binding

If none of the previous rules apply, JavaScript uses the default binding.

Example:

```js
function greet() {
  console.log(this);
}

greet();
```

In **non-strict mode**:

```text
this

↓

Global Object
```

In **strict mode**:

```text
this

↓

undefined
```

We'll discuss strict mode in detail later.

---

### Priority of the Binding Rules

JavaScript always checks the rules in this order:

```text
Function Called

↓

Called with `new`?

│

├── Yes → `new` Binding

│
└── No

      ↓

Explicit Binding?

│

├── Yes → call/apply/bind

│
└── No

      ↓

Object Method?

│

├── Yes → Implicit Binding

│
└── No

      ↓

Default Binding
```

This priority explains nearly every `this` behavior in JavaScript.

---

### Relationship Between `this` and Execution Context

Every time a function is called, JavaScript creates a new **Execution Context**.

One of the responsibilities of the Execution Context is storing the value of `this`.

Conceptually:

```text
Function Call

↓

Execution Context Created

↓

Determine `this`

↓

Store `this`

↓

Execute Function
```

Each function call gets its own `this` value.

---

### Why is `this` Determined at Runtime?

Consider this function:

```js
function printName() {
  console.log(this.name);
}
```

The same function can be used by different objects.

```js
const user = {
  name: "Vaibhav",
  printName,
};

const company = {
  name: "Vaibhav Docs",
  printName,
};

user.printName();

company.printName();
```

Output:

```text
Vaibhav

Vaibhav Docs
```

If `this` were determined when the function was defined, this flexibility wouldn't be possible.

By determining `this` at runtime, JavaScript allows the same function to work with different objects.

---

### Internal Mental Model

When JavaScript encounters a function call, it doesn't inspect the function body first.

Instead, it inspects **how the function is being called**.

```text
Function Definition

↓

Ignored

-------------------

Function Call

↓

Inspect Call Site

↓

Determine `this`
```

This explains why changing the call site changes the value of `this`.

---

> 💡 **Coming Next**
>
> In the next topic, we'll compare **Regular Functions** and **Arrow Functions** to understand why Arrow Functions don't follow these four binding rules.

---

### 💻 Example

We'll continue using our running example.

```js
function printName() {
  console.log(this.name);
}

const company = {
  name: "Vaibhav Docs",
  printName,
};

const user = {
  name: "Vaibhav",
  printName,
};

company.printName();

user.printName();
```

Output:

```text
Vaibhav Docs

Vaibhav
```

The same function behaves differently because JavaScript determines `this` from the call site.

---

### 📊 Diagram / Flow

#### `this` Resolution

```text
Function Called

↓

Inspect Call Site

↓

Apply Binding Rule

↓

Assign `this`
```

---

#### Priority

```text
new

↓

call/apply/bind

↓

Object Method

↓

Default
```

---

#### Execution Context

```text
Function Call

↓

Execution Context

↓

Store `this`

↓

Execute
```

---

#### Runtime

```text
Function Definition

↓

(No `this` Yet)

↓

Function Call

↓

Determine `this`
```

---

### 🌍 Real-World Example

Imagine a company trainer who conducts sessions for different teams.

```text
Monday

↓

Sales Team

↓

Trainer Represents Sales

-------------------

Tuesday

↓

Engineering Team

↓

Trainer Represents Engineering
```

The trainer doesn't permanently belong to one team.

Instead, their role depends on **which team invited them**.

The `this` keyword works in the same way.

A function doesn't permanently own a `this` value.

JavaScript determines it each time the function is called by looking at **who invoked the function**.

---

### 🎤 Interview Answer

JavaScript determines the value of **`this`** at runtime by examining the function's **call site**. It follows four binding rules in priority order: **`new` binding**, **explicit binding** using `call()`, `apply()`, or `bind()`, **implicit binding** when a function is called as an object method, and finally **default binding** when none of the others apply. During every function call, JavaScript creates a new Execution Context and stores the resolved value of `this` inside it. This runtime resolution allows the same function to work with different objects depending on how it is invoked.

---

### ❓ Follow-up Questions

1. What are the four binding rules of `this`?
2. Why does JavaScript determine `this` at runtime instead of definition time?
3. What is the relationship between `this` and the Execution Context?
4. Which binding rule has the highest priority?
5. Why does the same function produce different `this` values when called from different objects?
6. What happens if none of the binding rules except the default binding apply?

---

## 3. `this` in Regular Functions vs Arrow Functions

### 📖 Overview

One of the biggest differences between **Regular Functions** and **Arrow Functions** is how they handle the `this` keyword.

A **Regular Function** gets its own `this` value every time it is called.

An **Arrow Function** does **not** create its own `this`. Instead, it inherits `this` from the surrounding lexical scope.

This difference explains why Arrow Functions behave differently in callbacks, event handlers, classes, and React components.

---

### ⚙️ Main Explanation

### `this` in Regular Functions

A Regular Function uses **dynamic `this`**.

This means JavaScript determines the value of `this` **when the function is invoked**, based on the call site.

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

Here:

```text
this

↓

company
```

because `company` is calling the function.

---

Now consider the same function assigned to another object.

```js
function printName() {
  console.log(this.name);
}

const user = {
  name: "Vaibhav",
  printName,
};

const company = {
  name: "Vaibhav Docs",
  printName,
};

user.printName();

company.printName();
```

Output:

```text
Vaibhav

Vaibhav Docs
```

The function doesn't change.

Only the **call site** changes.

---

### `this` in Arrow Functions

Arrow Functions behave differently.

They do **not** determine `this` when called.

Instead, they inherit `this` from the surrounding lexical scope.

Example:

```js
const company = {
  name: "Vaibhav Docs",

  printName: () => {
    console.log(this);
  },
};

company.printName();
```

The Arrow Function does **not** use `company` as its `this`.

Instead, it inherits `this` from where the Arrow Function was created.

This behavior is called **lexical `this`**.

---

### Why Don't Arrow Functions Have Their Own `this`?

Arrow Functions were introduced to solve a common JavaScript problem.

Before ES6, developers often wrote:

```js
const self = this;
```

or

```js
function () {}.bind(this);
```

inside callbacks to preserve the surrounding `this`.

Arrow Functions eliminate this problem by automatically inheriting `this`.

Instead of creating a new `this`, they simply reuse the surrounding one.

---

### Dynamic `this` vs Lexical `this`

#### Dynamic `this`

Regular Functions:

```text
Function Called

↓

Determine `this`

↓

Execute
```

The value depends on **how the function is called**.

---

#### Lexical `this`

Arrow Functions:

```text
Outer Scope

↓

Inherit `this`

↓

Execute
```

The value depends on **where the Arrow Function was created**.

---

### Arrow Functions Inside Class Methods

Arrow Functions are commonly used inside class methods.

Example:

```js
class Counter {
  count = 0;

  increment = () => {
    this.count++;

    console.log(this.count);
  };
}

const counter = new Counter();

counter.increment();
```

Output:

```text
1
```

The Arrow Function inherits `this` from the class instance.

Even if the method is passed as a callback, it continues using the correct `this`.

---

### Why Are Arrow Functions Good for Callbacks?

Consider:

```js
class Counter {
  count = 0;

  start() {
    setTimeout(() => {
      console.log(this.count);
    }, 1000);
  }
}
```

The callback executes later, but the Arrow Function still remembers the surrounding `this`.

With a Regular Function:

```js
setTimeout(function () {
  console.log(this.count);
}, 1000);
```

`this` would no longer refer to the class instance.

This is one of the main reasons Arrow Functions are commonly used in callbacks.

---

### Limitations of Arrow Functions

Because Arrow Functions don't have their own `this`, they should **not** be used in every situation.

For example, they cannot be used as constructors.

```js
const User = (name) => {
  this.name = name;
};

new User("Vaibhav");
```

Output:

```text
TypeError
```

Arrow Functions also don't work well as object methods when you expect `this` to refer to the object.

```js
const company = {
  name: "Vaibhav Docs",

  printName: () => {
    console.log(this.name);
  },
};

company.printName();
```

The Arrow Function inherits `this` from the surrounding scope instead of using `company`.

---

### Regular Function vs Arrow Function

| Regular Function | Arrow Function |
|------------------|----------------|
| Has its own `this` | Doesn't have its own `this` |
| `this` determined at call time | `this` inherited from surrounding scope |
| Can be used as a constructor | Cannot be used as a constructor |
| Supports dynamic binding | Uses lexical binding |
| Suitable for object methods | Suitable for callbacks |

---

### When Should You Use Each?

Use a **Regular Function** when:

- Writing object methods.
- Creating constructors.
- You need dynamic `this`.

Use an **Arrow Function** when:

- Writing callbacks.
- Preserving the surrounding `this`.
- Working inside class methods or React components.

Choosing the right function type avoids many common `this`-related bugs.

---

> 💡 **Coming Next**
>
> In the next topic, we'll learn how to manually control `this` using **`call()`**, **`apply()`**, and **`bind()`**.

---

### 💻 Example

We'll continue using our running example.

```js
const company = {
  name: "Vaibhav Docs",

  regularFunction() {
    console.log(this.name);
  },

  arrowFunction: () => {
    console.log(this);
  },
};

company.regularFunction();

company.arrowFunction();
```

Output:

```text
Vaibhav Docs

Global Object (or inherited outer `this`)
```

This example demonstrates the fundamental difference between dynamic and lexical `this`.

---

### 📊 Diagram / Flow

#### Regular Function

```text
Function Called

↓

Determine `this`

↓

Execute
```

---

#### Arrow Function

```text
Outer Scope

↓

Inherit `this`

↓

Execute
```

---

#### Callback

```text
Outer Function

↓

Arrow Function

↓

Same `this`
```

---

#### Comparison

```text
Regular Function

↓

Dynamic `this`

-------------------

Arrow Function

↓

Lexical `this`
```

---

### 🌍 Real-World Example

Imagine two delivery drivers.

The first driver asks for directions **every time** they receive a delivery.

```text
New Delivery

↓

Ask for Address

↓

Deliver Package
```

This is like a **Regular Function**, where `this` is determined each time the function is called.

The second driver permanently follows the address assigned by their team leader.

```text
Team Leader

↓

Assigned Route

↓

Deliver Package
```

Even if someone else gives them a package, they continue following the original route.

This is like an **Arrow Function**, which doesn't determine its own `this` but always follows the surrounding lexical `this`.

---

### 🎤 Interview Answer

The biggest difference between Regular Functions and Arrow Functions is how they handle **`this`**. A Regular Function has its own dynamic `this`, which JavaScript determines at runtime based on the call site. An Arrow Function does not create its own `this`; instead, it inherits `this` from its surrounding lexical scope. This makes Arrow Functions ideal for callbacks and class methods where preserving the surrounding `this` is important. However, Arrow Functions should not be used as constructors or object methods that rely on dynamic `this`, because they cannot change their `this` value.

---

### ❓ Follow-up Questions

1. Why don't Arrow Functions have their own `this`?
2. What is the difference between dynamic `this` and lexical `this`?
3. Why are Arrow Functions commonly used in callbacks?
4. Can an Arrow Function be used as a constructor? Why not?
5. Why are Arrow Functions generally not recommended as object methods?
6. How do Arrow Functions behave inside class methods?

---

## 4. Understanding `call()`, `apply()`, and `bind()`

### 📖 Overview

Sometimes, JavaScript's default rules for determining `this` are not enough.

You may want to:

- Call a function using a different object.
- Borrow a method from another object.
- Permanently fix the value of `this`.
- Preserve `this` when passing a function as a callback.

JavaScript provides three built-in methods for this purpose:

- **`call()`**
- **`apply()`**
- **`bind()`**

These methods implement **explicit binding**, allowing you to manually specify what `this` should refer to.

---

### ⚙️ Main Explanation

#### What is Explicit Binding?

Normally, JavaScript determines `this` automatically.

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

Here, `this` refers to `company` because of **implicit binding**.

Sometimes, however, we want to decide the value of `this` ourselves.

This is called **explicit binding**.

---

#### `call()`

##### What is `call()`?

The `call()` method immediately invokes a function and allows you to specify the value of `this`.

Syntax:

```js
function.call(thisArg, arg1, arg2, ...);
```

Example:

```js
function greet(city) {
  console.log(
    `${this.name} from ${city}`
  );
}

const user = {
  name: "Vaibhav",
};

greet.call(user, "Lucknow");
```

Output:

```text
Vaibhav from Lucknow
```

Here:

```text
this

↓

user
```

because it was explicitly provided.

---

##### When Should You Use `call()`?

Use `call()` when:

- You want to invoke a function immediately.
- Arguments are available individually.
- You need to borrow methods from another object.

---

#### `apply()`

##### What is `apply()`?

`apply()` works almost exactly like `call()`.

The only difference is how arguments are passed.

Syntax:

```js
function.apply(thisArg, [args]);
```

Example:

```js
function greet(city, country) {
  console.log(
    `${this.name} from ${city}, ${country}`
  );
}

const user = {
  name: "Vaibhav",
};

greet.apply(user, [
  "Lucknow",
  "India",
]);
```

Output:

```text
Vaibhav from Lucknow, India
```

Instead of passing arguments individually, they are passed as an array.

---

##### When Should You Use `apply()`?

Use `apply()` when:

- Arguments already exist in an array.
- You want immediate function execution.

Today, the spread operator often makes `call()` a more common choice.

---

#### `bind()`

##### What is `bind()`?

Unlike `call()` and `apply()`, `bind()` **does not execute the function immediately**.

Instead, it returns a **new function** with `this` permanently bound.

Example:

```js
function greet() {
  console.log(this.name);
}

const user = {
  name: "Vaibhav",
};

const boundFunction =
  greet.bind(user);

boundFunction();
```

Output:

```text
Vaibhav
```

The function executes only when `boundFunction()` is called.

---

##### When Should You Use `bind()`?

Use `bind()` when:

- Passing object methods as callbacks.
- Preserving `this` for future execution.
- Creating reusable functions with a fixed `this`.

---

#### Method Borrowing Using `call()`

One powerful use of `call()` is **method borrowing**.

Example:

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    console.log(this.name);
  },
};

const user = {
  name: "Vaibhav",
};

company.printName.call(user);
```

Output:

```text
Vaibhav
```

The `user` object borrows the `printName()` method without defining its own.

---

#### Why is `bind()` Commonly Used in Event Handlers?

Consider:

```js
class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++;
  }
}

const counter =
  new Counter();

button.addEventListener(
  "click",
  counter.increment
);
```

Here, the method is passed as a callback.

When the event occurs, the original object is no longer the caller, so `this` is lost.

Using `bind()` fixes the problem.

```js
button.addEventListener(
  "click",
  counter.increment.bind(counter)
);
```

Now, `this` always refers to the `counter` instance.

---

#### Can `bind()` Be Changed Later?

No.

Once a function has been bound using `bind()`, its `this` value cannot be changed by another `bind()`, `call()`, or `apply()`.

Example:

```js
const first =
  greet.bind(user);

const second =
  first.bind(company);

second();
```

The second `bind()` has no effect on `this`.

The original binding remains.

---

#### What Happens if `null` or `undefined` is Passed?

Example:

```js
greet.call(null);
```

Behavior depends on the execution mode.

- In **non-strict mode**, `null` and `undefined` are replaced with the global object.
- In **strict mode**, they remain `null` or `undefined`.

> 💡 **Coming Next**
>
> We'll explore the difference between strict mode and non-strict mode later in this chapter.

---

#### Performance Considerations

Every call to `bind()` creates a **new function**.

Creating many bound functions inside loops or frequently executed code can introduce unnecessary overhead.

Instead of repeatedly calling:

```js
button.addEventListener(
  "click",
  this.handleClick.bind(this)
);
```

bind the function once and reuse it whenever possible.

---

#### `call()` vs `apply()` vs `bind()`

| Feature | `call()` | `apply()` | `bind()` |
|---------|----------|-----------|-----------|
| Executes immediately | ✅ | ✅ | ❌ |
| Returns new function | ❌ | ❌ | ✅ |
| Arguments | Individual | Array | Individual (partial arguments supported) |
| Changes `this` | ✅ | ✅ | ✅ |

---

#### Which One Should You Use?

- Use **`call()`** when arguments are separate and you want immediate execution.
- Use **`apply()`** when arguments are already in an array.
- Use **`bind()`** when you need a reusable function with a permanently fixed `this`.

---

> 💡 **Coming Next**
>
> In the next topic, we'll see how `this` behaves in **asynchronous JavaScript**, including `setTimeout()`, callbacks, and Promises.

---

### 💻 Example

We'll continue using our running example.

```js
function printName(city) {
  console.log(
    `${this.name} - ${city}`
  );
}

const company = {
  name: "Vaibhav Docs",
};

printName.call(
  company,
  "Lucknow"
);

printName.apply(
  company,
  ["Delhi"]
);

const bound =
  printName.bind(
    company,
    "Mumbai"
  );

bound();
```

Output:

```text
Vaibhav Docs - Lucknow

Vaibhav Docs - Delhi

Vaibhav Docs - Mumbai
```

---

### 📊 Diagram / Flow

#### Explicit Binding

```text
Function

↓

call/apply/bind

↓

Choose `this`

↓

Execute (or Return Function)
```

---

#### `call()`

```text
Function

↓

this

↓

Arguments

↓

Execute
```

---

#### `apply()`

```text
Function

↓

this

↓

Arguments Array

↓

Execute
```

---

#### `bind()`

```text
Function

↓

Bind `this`

↓

New Function

↓

Execute Later
```

---

### 🌍 Real-World Example

Imagine hiring a professional photographer.

With **`call()`**, you ask the photographer to take a photo **right now** for a specific customer.

With **`apply()`**, you do the same thing, but you hand over a **list of instructions** all at once.

With **`bind()`**, you sign a contract so the photographer is permanently assigned to that customer for future events.

```text
call()

↓

Immediate Job

-------------------

apply()

↓

Immediate Job

↓

Instructions in One List

-------------------

bind()

↓

Permanent Assignment

↓

Future Jobs
```

This is similar to how these methods control the value of `this`.

---

### 🎤 Interview Answer

`call()`, `apply()`, and `bind()` are methods used for **explicitly binding** the value of `this`. `call()` invokes a function immediately and accepts arguments individually, while `apply()` also invokes the function immediately but expects the arguments as an array. `bind()` is different because it doesn't execute the function immediately; instead, it returns a new function with `this` permanently bound. These methods are commonly used for method borrowing, preserving `this` in callbacks and event handlers, and controlling function execution. Once a function is bound using `bind()`, its `this` value cannot be changed.

---

### ❓ Follow-up Questions

1. What is the difference between `call()`, `apply()`, and `bind()`?
2. When should you use `call()` instead of `apply()`?
3. Why is `bind()` commonly used in event handlers?
4. What is method borrowing, and how does `call()` implement it?
5. Can the value of `this` be changed after using `bind()`?
6. What happens if `null` or `undefined` is passed as the first argument to `call()` or `apply()`?

---

## 5. `this` in Asynchronous JavaScript

### 📖 Overview

One of the most common sources of confusion with the **`this`** keyword is asynchronous code.

Many developers expect `this` to remain the same when a callback executes later, but that's not always true.

Asynchronous APIs such as:

- `setTimeout()`
- `setInterval()`
- Promises
- Event callbacks

execute their callback functions **later**, often in a different execution context.

As a result, the value of `this` can change unexpectedly if you're not careful.

---

### ⚙️ Main Explanation

#### Why Does `this` Change in Asynchronous Code?

Remember from the previous topics:

> **`this` is determined when a function is called, not when it is defined.**

When you pass a function as a callback:

```js
setTimeout(callback, 1000);
```

you're no longer calling it yourself.

Instead, another piece of code (such as the browser or JavaScript runtime) invokes it later.

Because the **call site changes**, the value of `this` may also change.

---

#### `this` Inside `setTimeout()`

Consider the following example.

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    setTimeout(function () {
      console.log(this.name);
    }, 1000);
  },
};

company.printName();
```

Output:

```text
undefined
```

(Or the global object's `name` in non-strict environments.)

Why?

The callback is **not** invoked as:

```js
company.callback();
```

Instead, it is invoked independently by `setTimeout()`.

Therefore, the callback follows the **default binding rule**, not the implicit binding rule.

---

#### How Can Arrow Functions Solve This?

Arrow Functions don't create their own `this`.

Instead, they inherit `this` from the surrounding lexical scope.

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  },
};

company.printName();
```

Output:

```text
Vaibhav Docs
```

The Arrow Function inherits `this` from `printName()`, where `this` already refers to `company`.

---

#### Preserving `this` with `bind()`

Another common solution is using `bind()`.

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    setTimeout(
      function () {
        console.log(this.name);
      }.bind(this),
      1000
    );
  },
};

company.printName();
```

Output:

```text
Vaibhav Docs
```

`bind()` permanently fixes the value of `this` before the callback executes.

---

#### Preserving `this` Using a Variable

Before Arrow Functions were introduced, developers often stored `this` in another variable.

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    const self = this;

    setTimeout(function () {
      console.log(self.name);
    }, 1000);
  },
};

company.printName();
```

This works because `self` is a normal variable captured by the Closure, not a dynamically resolved `this`.

Although this pattern still works, Arrow Functions are generally preferred today.

---

#### `this` Inside Promise Callbacks

Promise callbacks behave similarly.

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    Promise.resolve().then(() => {
      console.log(this.name);
    });
  },
};

company.printName();
```

Output:

```text
Vaibhav Docs
```

Again, the Arrow Function inherits `this` from the surrounding method.

If a Regular Function were used instead, `this` would not refer to `company`.

---

#### Why Is `this` Lost When Passing an Object Method?

Consider:

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    console.log(this.name);
  },
};

setTimeout(
  company.printName,
  1000
);
```

Many developers expect:

```text
Vaibhav Docs
```

Instead, the output is:

```text
undefined
```

Why?

Because you're passing **only the function**, not the object.

Internally, this is similar to:

```js
const callback =
  company.printName;

callback();
```

The call site is now simply:

```js
callback();
```

Since there's no object before the function call, JavaScript applies the **default binding rule**.

---

#### Best Practices for Asynchronous `this`

When working with asynchronous callbacks:

- Prefer **Arrow Functions** when you want to inherit the surrounding `this`.
- Use **`bind()`** if you need a Regular Function with a fixed `this`.
- Avoid passing object methods directly as callbacks unless their `this` has been preserved.
- Remember that callbacks execute later, often with a different call site.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore how `this` behaves in **event handlers, classes, and React**, where preserving the correct `this` is equally important.

---

### 💻 Example

We'll continue using our running example.

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  },
};

company.printName();
```

Output:

```text
Vaibhav Docs
```

The callback inherits `this` from the surrounding method, so it continues to refer to the `company` object.

---

### 📊 Diagram / Flow

#### Regular Function Callback

```text
Object Method

↓

setTimeout()

↓

Regular Function

↓

Default Binding

↓

`this` Lost
```

---

#### Arrow Function Callback

```text
Object Method

↓

Arrow Function

↓

Lexical `this`

↓

Same Object
```

---

#### Using `bind()`

```text
Regular Function

↓

bind(this)

↓

Fixed `this`

↓

Callback Executes
```

---

#### Passing a Method Directly

```text
company.printName

↓

Function Reference

↓

Callback()

↓

Default Binding
```

---

### 🌍 Real-World Example

Imagine a company manager asking an assistant to deliver a message later in the day.

If the manager simply hands over the message without saying **who it's from**, the assistant may not know which manager it belongs to.

```text
Manager

↓

Assistant

↓

Message Delivered

↓

Sender Unknown
```

Now imagine the manager signs the message before handing it over.

```text
Manager

↓

Signed Message

↓

Assistant

↓

Correct Sender Preserved
```

Using an **Arrow Function** or **`bind()`** is like signing the message before it's delivered.

Even though the callback runs later, it still knows which object `this` should refer to.

---

### 🎤 Interview Answer

The value of **`this`** in asynchronous JavaScript depends on how the callback function is invoked. If a Regular Function is passed to APIs like `setTimeout()` or Promises, it is usually called without the original object, so `this` follows the default binding rule and may become `undefined` in strict mode. Arrow Functions solve this problem because they don't create their own `this`; instead, they inherit the surrounding lexical `this`. Another solution is using `bind()` to permanently bind the desired object before passing the function as a callback.

---

### ❓ Follow-up Questions

1. Why is `this` often lost inside `setTimeout()` callbacks?
2. How do Arrow Functions preserve `this` in asynchronous code?
3. Why does passing an object method directly as a callback lose `this`?
4. When should you use `bind()` instead of an Arrow Function?
5. How does `this` behave inside Promise callbacks?
6. What are the best practices for preserving `this` in asynchronous JavaScript?

---

## 6. `this` in Event Handlers, Classes, and React

### 📖 Overview

The **`this`** keyword behaves differently depending on where a function is executed.

Three places where developers commonly encounter `this` issues are:

- Event Handlers
- Classes
- React Components

Most bugs occur because a method is passed as a callback, causing it to lose its original calling object.

Fortunately, JavaScript provides several ways to preserve the correct value of `this`.

---

### ⚙️ Main Explanation

#### `this` in Event Handlers

Consider a simple object.

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    console.log(this.name);
  },
};
```

If we directly use the method as an event handler:

```js
button.addEventListener(
  "click",
  company.printName
);
```

the output will **not** be:

```text
Vaibhav Docs
```

Why?

Because the event system invokes the callback later, and the original object (`company`) is no longer the caller.

The method loses its original context.

---

#### Preserving `this` with `bind()`

A common solution is using `bind()`.

```js
button.addEventListener(
  "click",
  company.printName.bind(company)
);
```

Now, regardless of how the event handler is invoked, `this` always refers to:

```text
company
```

This is one of the most common uses of `bind()` in JavaScript.

---

#### Using Arrow Functions in Event Handlers

Another approach is wrapping the method inside an Arrow Function.

```js
button.addEventListener(
  "click",
  () => company.printName()
);
```

The Arrow Function doesn't determine its own `this`.

Instead, it simply calls the object method, allowing normal implicit binding to occur.

---

#### `this` Inside Classes

Classes use `this` in the same way as constructor functions.

Example:

```js
class User {
  constructor(name) {
    this.name = name;
  }

  printName() {
    console.log(this.name);
  }
}

const user =
  new User("Vaibhav");

user.printName();
```

Output:

```text
Vaibhav
```

Here:

```text
this

↓

Class Instance
```

because the method is called through the instance.

---

#### Losing `this` in Class Methods

Consider:

```js
const print =
  user.printName;

print();
```

Output:

```text
undefined
```

The method is no longer called as:

```js
user.printName();
```

Instead, it's simply:

```js
print();
```

The implicit binding is lost, so JavaScript falls back to the default binding rule.

---

#### Arrow Functions Inside Classes

A common modern solution is defining methods as Arrow Functions.

```js
class User {
  name = "Vaibhav";

  printName = () => {
    console.log(this.name);
  };
}
```

The Arrow Function inherits `this` from the class instance.

Even if the method is passed as a callback:

```js
const print =
  user.printName;

print();
```

it still prints:

```text
Vaibhav
```

because the lexical `this` is preserved.

---

#### Why Are Arrow Functions Commonly Used in React?

In React, event handlers are frequently passed as callbacks.

Example:

```jsx
<button onClick={handleClick}>
  Click
</button>
```

If `handleClick` loses its `this`, the component may stop working correctly.

Arrow Functions solve this by preserving the surrounding `this`.

This is one reason why Arrow Functions became popular in React, especially before React Hooks.

> 💡 **Coming Next**
>
> Modern React applications primarily use **Function Components** and **Hooks**, which avoid many traditional `this` issues. We'll explore React in a dedicated chapter.

---

#### Constructor Function `this` vs Class `this`

Both behave very similarly.

Constructor Function:

```js
function User(name) {
  this.name = name;
}
```

Class:

```js
class User {
  constructor(name) {
    this.name = name;
  }
}
```

In both cases:

```text
new

↓

Create Object

↓

Assign `this`

↓

Execute Constructor
```

The main difference is that classes provide cleaner syntax and additional language features.

---

#### Event Handlers vs Arrow Functions

When using a Regular Function as an event callback:

```text
Event

↓

Regular Function

↓

New Call Site

↓

Possible `this` Loss
```

When using an Arrow Function:

```text
Event

↓

Arrow Function

↓

Lexical `this`

↓

Preserved Context
```

This makes Arrow Functions especially useful for UI development.

---

#### Best Practices

When working with event handlers and classes:

- Prefer Arrow Functions for callbacks that need the surrounding `this`.
- Use `bind()` when working with Regular Functions that will be passed as callbacks.
- Avoid passing object methods directly unless you've preserved their `this`.
- In modern React, prefer Function Components and Hooks instead of relying on class-based `this`.

---

### 💻 Example

We'll continue using our running example.

```js
class Company {
  constructor() {
    this.name = "Vaibhav Docs";
  }

  printName = () => {
    console.log(this.name);
  };
}

const company =
  new Company();

setTimeout(
  company.printName,
  1000
);
```

Output:

```text
Vaibhav Docs
```

Even though the method is executed later, the Arrow Function preserves the class instance's `this`.

---

### 📊 Diagram / Flow

#### Event Handler

```text
Button Click

↓

Callback

↓

`this`
```

---

#### Class Method

```text
Class Instance

↓

Method

↓

`this`

↓

Instance
```

---

#### Lost Context

```text
Object Method

↓

Function Reference

↓

Callback()

↓

Default Binding
```

---

#### Arrow Function

```text
Class

↓

Arrow Function

↓

Lexical `this`

↓

Instance
```

---

### 🌍 Real-World Example

Imagine a company assigning an employee to represent it at different meetings.

If the employee attends the meeting with an official company ID card, everyone knows which company they represent.

```text
Company

↓

Employee

↓

Company ID

↓

Meeting
```

Now imagine the employee forgets the ID card.

At the meeting, nobody knows which company they're representing.

Passing an object method directly as a callback is similar—the method loses its original context.

Using **`bind()`** or an **Arrow Function** is like ensuring the employee always carries their company ID, so the correct context is preserved wherever they go.

---

### 🎤 Interview Answer

The value of **`this`** can easily be lost when object or class methods are passed as callbacks, such as event handlers or asynchronous functions. This happens because the original call site changes, so the implicit binding is no longer applied. A common solution is using **`bind()`** to permanently bind the desired object or using **Arrow Functions**, which inherit `this` from the surrounding lexical scope. In class-based React components, Arrow Functions became popular because they automatically preserve the component instance's `this`, avoiding many common binding issues.

---

### ❓ Follow-up Questions

1. Why is `bind()` commonly used in event handlers?
2. Why do class methods lose `this` when passed as callbacks?
3. How do Arrow Functions preserve `this` inside class methods?
4. Why were Arrow Functions commonly used in React class components?
5. What is the difference between constructor function `this` and class `this`?
6. How can you fix a `this` binding issue in an event listener?

---

## 7. Strict Mode, Modules, and Global `this`

### 📖 Overview

The value of `this` doesn't only depend on **how a function is called**—it also depends on **where the code is running**.

For example, the value of `this` can differ between:

- Strict Mode and Non-Strict Mode
- Browser and Node.js
- Regular Scripts and ES Modules

These differences often surprise developers, especially during interviews or when moving code between environments.

Understanding these environments helps explain why the same code can produce different outputs.

---

### ⚙️ Main Explanation

#### `this` in Non-Strict Mode

In non-strict mode, when a Regular Function is called without an object, JavaScript uses the **default binding rule**.

Example:

```js
function greet() {
  console.log(this);
}

greet();
```

In a browser script, the output is:

```text
window
```

Since there is no object before the function call, JavaScript falls back to the global object.

---

#### `this` in Strict Mode

Now enable strict mode.

```js
"use strict";

function greet() {
  console.log(this);
}

greet();
```

Output:

```text
undefined
```

Strict mode prevents JavaScript from automatically replacing `this` with the global object.

This helps avoid accidental access to global variables and makes code safer.

---

#### Why Does Strict Mode Return `undefined`?

Consider this function.

```js
"use strict";

function printName() {
  console.log(this.name);
}

printName();
```

Since:

```text
this

↓

undefined
```

attempting to access:

```js
this.name
```

results in:

```text
TypeError
```

This behavior makes bugs easier to detect during development.

---

#### Browser vs Node.js

The global object is different in different JavaScript environments.

| Environment | Global Object |
|-------------|---------------|
| Browser | `window` |
| Node.js | `global` (or `globalThis`) |

Because of this, the value of `this` in the global scope can differ depending on where the code runs.

---

#### Global `this` in Browser Scripts

In a regular browser script:

```js
console.log(this);
```

Output:

```text
window
```

The global scope is associated with the browser's `window` object.

---

#### Global `this` in ES Modules

ES Modules behave differently.

Example:

```js
console.log(this);
```

Inside an ES Module, the output is:

```text
undefined
```

Unlike traditional scripts, ES Modules don't bind the global scope to the global object.

This behavior helps create isolated modules with fewer accidental global references.

---

#### What Happens with `call()`, `apply()`, and `bind()`?

Consider:

```js
function greet() {
  console.log(this);
}

greet.call(null);
```

Behavior depends on the execution mode.

**Non-Strict Mode**

```text
this

↓

Global Object
```

JavaScript automatically replaces `null` and `undefined` with the global object.

---

**Strict Mode**

```text
this

↓

null
```

No automatic conversion occurs.

The value passed to `call()`, `apply()`, or `bind()` is preserved.

---

#### Why Was Strict Mode Introduced?

Before strict mode, many programming mistakes were silently ignored.

Example:

```js
function update() {
  value = 100;
}
```

This accidentally creates a global variable.

Strict mode prevents many such mistakes by enforcing stricter rules, including stricter handling of `this`.

---

#### Comparing Different Environments

| Scenario | Value of `this` |
|----------|-----------------|
| Browser Global Scope | `window` |
| Node.js Global Scope | `global` / `globalThis` |
| Regular Function (Non-Strict) | Global Object |
| Regular Function (Strict) | `undefined` |
| ES Module Top Level | `undefined` |
| Object Method | Calling Object |
| Arrow Function | Lexically inherited |

---

#### Best Practices

When working with `this`:

- Prefer strict mode (or ES Modules, which are strict by default).
- Avoid relying on the global object.
- Write code that behaves consistently across environments.
- Use `globalThis` when you explicitly need the global object in a cross-platform way.

---

> 💡 **Coming Next**
>
> In the next topic, we'll look at the most common mistakes developers make with `this` and learn practical debugging techniques.

---

### 💻 Example

```js
"use strict";

function printName() {
  console.log(this);
}

printName();
```

Output:

```text
undefined
```

Now compare it with:

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

This demonstrates that strict mode affects **default binding**, but object methods continue to use **implicit binding**.

---

### 📊 Diagram / Flow

#### Non-Strict Mode

```text
Function Call

↓

Default Binding

↓

Global Object
```

---

#### Strict Mode

```text
Function Call

↓

Default Binding

↓

undefined
```

---

#### ES Module

```text
Top-Level Code

↓

Module Scope

↓

undefined
```

---

#### Browser vs Node.js

```text
Browser

↓

window

-------------------

Node.js

↓

global / globalThis
```

---

### 🌍 Real-World Example

Imagine two office buildings.

In the first building, if someone forgets to mention which department they're from, the receptionist automatically assumes they belong to the **General Office**.

```text
Unknown Department

↓

General Office
```

This is similar to **non-strict mode**, where JavaScript falls back to the global object.

In the second building, the receptionist refuses entry unless the visitor clearly identifies their department.

```text
Unknown Department

↓

Access Denied
```

This is similar to **strict mode**, where JavaScript refuses to assign the global object automatically and instead sets `this` to `undefined`.

This stricter behavior helps catch mistakes earlier.

---

### 🎤 Interview Answer

The value of `this` depends not only on the call site but also on the execution environment. In **non-strict mode**, a Regular Function called without an object uses the global object as `this`. In **strict mode**, the same function receives `undefined` as `this`, preventing accidental access to global variables. The global object also differs between environments—it's `window` in browsers and `global` (or `globalThis`) in Node.js. ES Modules behave differently as well, with top-level `this` being `undefined`. These differences make strict mode and modules safer and more predictable than traditional scripts.

---

### ❓ Follow-up Questions

1. What is the difference between `this` in strict mode and non-strict mode?
2. Why does strict mode return `undefined` instead of the global object?
3. How does top-level `this` behave in ES Modules?
4. What is the difference between the global object in browsers and Node.js?
5. What happens when `call(null)` is used in strict and non-strict mode?
6. Why is strict mode considered safer when working with `this`?

---

## 8. Common Mistakes with `this`

### 📖 Overview

The **`this`** keyword is one of the most common sources of bugs in JavaScript.

The reason is simple:

> Developers often focus on **where a function is written**, while JavaScript determines `this` based on **how the function is called**.

Most `this`-related bugs happen because of:

- Losing the original call site.
- Misusing Arrow Functions.
- Forgetting the binding rules.
- Passing methods as callbacks.
- Assuming `this` behaves like other programming languages.

Understanding these mistakes will help you debug `this` issues quickly and write more predictable code.

---

### ⚙️ Main Explanation

#### 1. Assuming `this` Refers to the Function Itself

A common misconception is:

> "`this` refers to the current function."

This is incorrect.

Example:

```js
function greet() {
  console.log(this);
}
```

The value of `this` depends on **how `greet()` is called**, not on the function itself.

Always think:

```text
Function Call

↓

Who Called It?

↓

That Determines `this`
```

---

#### 2. Passing Object Methods as Callbacks

Consider:

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    console.log(this.name);
  },
};

setTimeout(
  company.printName,
  1000
);
```

Expected:

```text
Vaibhav Docs
```

Actual:

```text
undefined
```

Why?

The method is passed as a standalone function.

Internally, it becomes similar to:

```js
const callback =
  company.printName;

callback();
```

The original object is no longer the caller.

---

#### 3. Using Arrow Functions as Object Methods

Arrow Functions don't have their own `this`.

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

Many developers expect:

```text
Vaibhav Docs
```

Instead, the Arrow Function inherits `this` from its surrounding scope, not from `company`.

For object methods, Regular Functions are usually the correct choice.

---

#### 4. Forgetting About Strict Mode

Example:

```js
"use strict";

function greet() {
  console.log(this);
}

greet();
```

Output:

```text
undefined
```

Many developers still expect the global object because they're familiar with non-strict mode.

Always remember:

- Non-strict → Global Object
- Strict → `undefined`

---

#### 5. Confusing Arrow Functions and Regular Functions

Regular Function:

```js
function greet() {
  console.log(this);
}
```

Arrow Function:

```js
const greet = () => {
  console.log(this);
};
```

These functions may look similar, but their `this` behavior is completely different.

Choosing the wrong one is one of the most common interview mistakes.

---

#### 6. Forgetting to Use `bind()`

Suppose we pass a class method as a callback.

```js
class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++;
  }
}

const counter =
  new Counter();

button.addEventListener(
  "click",
  counter.increment
);
```

The callback loses its original context.

The correct approach is:

```js
button.addEventListener(
  "click",
  counter.increment.bind(counter)
);
```

or using an Arrow Function when appropriate.

---

#### 7. Trying to Change `this` of an Arrow Function

Some developers try:

```js
const greet = () => {
  console.log(this);
};

greet.call(company);
```

This doesn't work.

Arrow Functions ignore:

- `call()`
- `apply()`
- `bind()`

because they don't have their own `this`.

They always use the surrounding lexical `this`.

---

#### 8. Debugging Unexpected `this`

When you encounter an unexpected value of `this`, ask these questions:

1. Is this a Regular Function or an Arrow Function?
2. How is the function being called?
3. Was the method passed as a callback?
4. Is strict mode enabled?
5. Is `bind()`, `call()`, or `apply()` being used?
6. What is the actual call site?

These questions usually reveal the problem quickly.

---

#### Best Practices

To avoid `this`-related bugs:

- Remember that `this` depends on the **call site**.
- Use Regular Functions for object methods.
- Use Arrow Functions for callbacks that should inherit the surrounding `this`.
- Bind methods before passing them as callbacks when necessary.
- Avoid relying on the global object.
- Prefer strict mode or ES Modules.

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

const callback =
  company.printName;

callback();
```

Output:

```text
undefined
```

The method loses its original context because it's no longer called as `company.printName()`.

---

### 📊 Diagram / Flow

#### Lost Context

```text
Object Method

↓

Store in Variable

↓

Function Call

↓

Default Binding
```

---

#### Correct Context

```text
Object

↓

Method Call

↓

Implicit Binding

↓

Correct `this`
```

---

#### Arrow Function

```text
Outer Scope

↓

Lexical `this`

↓

Ignore call/apply/bind
```

---

#### Debugging

```text
Unexpected `this`

↓

Check Call Site

↓

Check Binding Rule

↓

Find Cause
```

---

### 🌍 Real-World Example

Imagine a delivery company.

A package is labeled with the correct customer's address.

```text
Package

↓

Customer Address

↓

Delivered Correctly
```

Now imagine someone removes the label before handing it to the delivery driver.

```text
Package

↓

No Address

↓

Wrong Destination
```

Passing an object method as a standalone callback is similar.

The function loses the information about **which object it belongs to**, so JavaScript can no longer determine the correct `this`.

Using **`bind()`** or an **Arrow Function** is like attaching the address label permanently before sending the package.

---

### 🎤 Interview Answer

Most `this`-related bugs occur because developers forget that `this` is determined by the **call site**, not by where the function is written. Common mistakes include passing object methods as callbacks, using Arrow Functions as object methods, forgetting strict mode behavior, assuming `this` refers to the function itself, and expecting `call()`, `apply()`, or `bind()` to change the `this` value of an Arrow Function. When debugging, the first step is always to identify how the function is being invoked and which binding rule JavaScript applies.

---

### ❓ Follow-up Questions

1. Why does passing an object method as a callback often lose `this`?
2. Why shouldn't Arrow Functions usually be used as object methods?
3. Why can't `call()` or `bind()` change the `this` value of an Arrow Function?
4. How do you debug an unexpected value of `this`?
5. What are the most common `this`-related mistakes in production code?
6. What are the best ways to preserve the correct value of `this`?

---

## 9. Best Practices for Using `this`

### 📖 Overview

After learning how `this` works, the next step is learning **how to use it effectively**.

Most experienced JavaScript developers don't struggle with `this` because they follow a few simple practices that prevent common bugs.

These best practices improve:

- Readability
- Maintainability
- Predictability
- Debugging
- Performance

Understanding these guidelines will help you write cleaner production code and answer interview questions confidently.

---

### ⚙️ Main Explanation

#### 1. Remember That `this` Depends on the Call Site

The most important rule is:

> **Never determine `this` by looking at where the function is written.**

Always determine it by looking at **how the function is called**.

Instead of asking:

```text
Where is this function defined?
```

ask:

```text
How is this function invoked?
```

This simple habit prevents many `this`-related mistakes.

---

#### 2. Use Regular Functions for Object Methods

If a method needs to work with its own object, use a Regular Function.

```js
const company = {
  name: "Vaibhav Docs",

  printName() {
    console.log(this.name);
  },
};
```

Here, implicit binding correctly sets:

```text
this

↓

company
```

Using an Arrow Function here would prevent `this` from referring to the object.

---

#### 3. Use Arrow Functions for Callbacks

Callbacks often need access to the surrounding `this`.

Example:

```js
class Company {
  name = "Vaibhav Docs";

  start() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}
```

The Arrow Function inherits the surrounding `this`, avoiding the need for `bind()`.

---

#### 4. Use `bind()` When Passing Methods as Callbacks

When passing an object or class method directly:

```js
button.addEventListener(
  "click",
  company.printName
);
```

the method loses its original context.

A better approach is:

```js
button.addEventListener(
  "click",
  company.printName.bind(company)
);
```

This permanently associates the method with the correct object.

---

#### 5. Avoid Relying on the Global Object

Depending on the global object can make code harder to understand and less portable.

Instead of relying on default binding:

```js
function greet() {
  console.log(this);
}
```

write code that explicitly controls the value of `this` whenever possible.

---

#### 6. Prefer Strict Mode or ES Modules

Strict mode and ES Modules prevent JavaScript from silently assigning the global object to `this`.

This helps catch mistakes earlier.

Modern JavaScript projects usually use ES Modules, which are automatically executed in strict mode.

---

#### 7. Don't Use Arrow Functions Everywhere

Arrow Functions are useful, but they are **not** a replacement for Regular Functions.

Avoid using Arrow Functions when:

- Defining object methods.
- Creating constructors.
- You need dynamic `this`.

Choose the function type based on how `this` should behave.

---

#### 8. Minimize Repeated `bind()` Calls

Every call to `bind()` creates a new function.

Instead of repeatedly writing:

```js
button.addEventListener(
  "click",
  this.handleClick.bind(this)
);
```

bind the function once and reuse it.

Example:

```js
this.handleClick =
  this.handleClick.bind(this);
```

This avoids creating unnecessary bound functions.

---

#### 9. Keep `this` Usage Predictable

If readers have to stop and think about what `this` refers to, the code may be difficult to maintain.

Prefer designs where the value of `this` is obvious.

Predictable code is easier to debug and easier for other developers to understand.

---

#### Summary of Best Practices

- Determine `this` from the **call site**, not the function definition.
- Use Regular Functions for object methods.
- Use Arrow Functions for callbacks that should inherit the surrounding `this`.
- Use `bind()` when passing methods as callbacks.
- Avoid relying on the global object.
- Prefer strict mode or ES Modules.
- Don't overuse Arrow Functions.
- Avoid unnecessary `bind()` calls.
- Keep `this` usage simple and predictable.

---

> 💡 **Coming Next**
>
> In the final topic, we'll bring everything together with a simple mental model and an interview-ready explanation of the `this` keyword.

---

### 💻 Example

We'll continue using our running example.

```js
class Company {
  constructor() {
    this.name = "Vaibhav Docs";

    this.printName =
      this.printName.bind(this);
  }

  printName() {
    console.log(this.name);
  }
}

const company =
  new Company();

setTimeout(
  company.printName,
  1000
);
```

Output:

```text
Vaibhav Docs
```

The method retains the correct `this` because it was bound once in the constructor.

---

### 📊 Diagram / Flow

#### Choosing the Right Function

```text
Need Dynamic `this`?

│

├── Yes

│     ↓

│ Regular Function

│

└── No

      ↓

Arrow Function
```

---

#### Passing a Callback

```text
Method

↓

Callback

↓

bind()

↓

Correct `this`
```

---

#### Arrow Function

```text
Outer Scope

↓

Lexical `this`

↓

Callback
```

---

#### Mental Rule

```text
Call Site

↓

Binding Rule

↓

`this`
```

---

### 🌍 Real-World Example

Imagine a company where employees receive different types of ID cards depending on their role.

Managers receive permanent company IDs because they represent the company in meetings.

```text
Manager

↓

Company ID

↓

Official Meetings
```

Temporary contractors receive visitor passes that are valid only for specific situations.

Choosing between a **Regular Function**, an **Arrow Function**, or **`bind()`** is similar.

Each tool has a specific purpose.

Using the right one ensures the correct identity (`this`) is available whenever the function executes.

---

### 🎤 Interview Answer

The best way to avoid `this`-related bugs is to remember that `this` depends on the **call site**, not where the function is defined. Use Regular Functions for object methods, Arrow Functions for callbacks that should inherit the surrounding `this`, and `bind()` when passing methods as callbacks. Avoid relying on the global object, prefer strict mode or ES Modules, and don't overuse Arrow Functions. Keeping `this` predictable makes code easier to understand, debug, and maintain.

---

### ❓ Follow-up Questions

1. Why should object methods usually be Regular Functions?
2. When should you use Arrow Functions instead of Regular Functions?
3. Why is `bind()` useful when passing methods as callbacks?
4. Why is relying on the global object considered a bad practice?
5. Why should repeated calls to `bind()` be avoided?
6. What is the most important rule for determining the value of `this`?

---

## 10. Interview Perspective and Mental Model of `this`

### 📖 Overview

The **`this`** keyword is one of the most frequently asked JavaScript interview topics because it tests multiple core concepts at once:

- Function calls
- Objects
- Execution Context
- Arrow Functions
- `call()`, `apply()`, and `bind()`
- Asynchronous JavaScript

Many developers memorize examples, but interviewers are usually looking for something deeper:

> **Do you understand the rule that JavaScript follows to determine `this`?**

If you understand the binding rules and know how to identify the **call site**, you can confidently predict the value of `this` in almost any situation.

---

### ⚙️ Main Explanation

#### The Mental Model

Whenever you see `this` in JavaScript, don't immediately look at where the function is written.

Instead, ask one question:

> **How is this function being called?**

This single question solves most `this`-related problems.

Think of the following flow:

```text
Function Call

↓

Identify Call Site

↓

Apply Binding Rule

↓

Determine `this`
```

---

#### The Four Binding Rules

JavaScript always resolves `this` using the same priority order.

```text
1. new Binding

↓

2. Explicit Binding

(call, apply, bind)

↓

3. Implicit Binding

(object.method())

↓

4. Default Binding
```

If a higher-priority rule applies, JavaScript ignores the remaining rules.

---

#### Dynamic `this` vs Lexical `this`

Another key interview concept is understanding the difference between Regular Functions and Arrow Functions.

**Regular Functions**

```text
Function Called

↓

Determine `this`

↓

Execute
```

The value of `this` depends on the **call site**.

---

**Arrow Functions**

```text
Outer Scope

↓

Inherit `this`

↓

Execute
```

Arrow Functions don't participate in the four binding rules because they don't create their own `this`.

---

#### The Most Common Interview Mistake

Many candidates say:

> "`this` refers to the object where the function is defined."

This is incorrect.

Example:

```js
function printName() {
  console.log(this.name);
}

const company = {
  name: "Vaibhav Docs",
  printName,
};

const user = {
  name: "Vaibhav",
  printName,
};

company.printName();

user.printName();
```

Output:

```text
Vaibhav Docs

Vaibhav
```

The function is defined only once, but `this` changes because the **call site** changes.

---

#### A Quick Decision Tree

When you encounter `this`, follow this order:

```text
Is it an Arrow Function?

│

├── Yes

│     ↓

│ Use Lexical `this`

│

└── No

      ↓

Called with `new`?

│

├── Yes

│     ↓

│ New Object

│

└── No

      ↓

Using call/apply/bind?

│

├── Yes

│     ↓

│ Explicit Binding

│

└── No

      ↓

Called as object.method()?

│

├── Yes

│     ↓

│ Object

│

└── No

      ↓

Default Binding
```

This mental checklist works for almost every interview question involving `this`.

---

#### Real-World Summary

Throughout this chapter, we've seen that:

- `this` is determined at runtime.
- The call site determines the value of `this`.
- Regular Functions use dynamic binding.
- Arrow Functions use lexical binding.
- `call()`, `apply()`, and `bind()` provide explicit control over `this`.
- Asynchronous callbacks can lose `this`.
- Arrow Functions and `bind()` help preserve `this`.
- Strict mode changes the default binding behavior.

Understanding these ideas makes `this` much easier to reason about.

---

#### How Would You Explain `this` to a Java or C++ Developer?

In languages like Java or C++, `this` usually refers to the current object instance.

In JavaScript, `this` is more flexible.

Its value depends on **how the function is invoked**, not on where the function belongs.

This flexibility allows the same function to work with different objects but also introduces complexity that developers must understand.

---

#### Interview Tips

During interviews:

- Don't memorize outputs—explain **why** they occur.
- Mention the **call site** before giving the answer.
- Explain which binding rule JavaScript applies.
- Clearly distinguish between Regular Functions and Arrow Functions.
- When unsure, mentally follow the binding rule priority.

Interviewers often care more about your reasoning than simply producing the correct output.

---

### 💻 Example

We'll conclude the chapter with a simple example.

```js
function printName() {
  console.log(this.name);
}

const company = {
  name: "Vaibhav Docs",
  printName,
};

company.printName();
```

Output:

```text
Vaibhav Docs
```

Reasoning:

```text
Call Site

↓

company.printName()

↓

Implicit Binding

↓

this = company
```

This is the thought process interviewers expect you to demonstrate.

---

### 📊 Diagram / Flow

#### Mental Model

```text
See `this`

↓

Find Call Site

↓

Apply Binding Rule

↓

Determine `this`
```

---

#### Binding Priority

```text
new

↓

call/apply/bind

↓

Object Method

↓

Default
```

---

#### Function Types

```text
Regular Function

↓

Dynamic `this`

-------------------

Arrow Function

↓

Lexical `this`
```

---

#### Complete Decision Tree

```text
Arrow Function?

│

├── Yes

│     ↓

│ Lexical `this`

│

└── No

      ↓

new?

↓

call/apply/bind?

↓

Object Method?

↓

Default Binding
```

---

### 🌍 Real-World Example

Imagine a customer support representative who answers calls for different companies.

Every time the phone rings, the representative first checks **which company the call belongs to** before answering.

```text
Incoming Call

↓

Identify Company

↓

Answer on Behalf of That Company
```

The representative doesn't permanently belong to one company—their role depends on the current call.

The `this` keyword behaves the same way.

A function doesn't permanently own a `this` value.

Every time it's called, JavaScript checks the **call site** and decides which object `this` should represent.

---

### 🎤 Interview Answer

The **`this`** keyword refers to the object associated with the current function call, and its value is determined **at runtime** based on the **call site**. JavaScript resolves `this` using four binding rules in priority order: **`new` binding**, **explicit binding** with `call()`, `apply()`, or `bind()`, **implicit binding** through an object method call, and finally **default binding**. Regular Functions have dynamic `this`, while Arrow Functions inherit lexical `this` from their surrounding scope. The easiest way to determine `this` is to identify how the function is invoked and then apply the appropriate binding rule.

---

### ❓ Follow-up Questions

1. What is the most important rule for determining the value of `this`?
2. What are the four binding rules of `this`?
3. What is the difference between dynamic and lexical `this`?
4. Why don't Arrow Functions have their own `this`?
5. How would you debug an unexpected value of `this`?
6. How would you explain the `this` keyword to someone coming from Java or C++?

---