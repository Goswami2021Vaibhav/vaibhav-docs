---
title: Prototypes & Inheritance
description: The prototype chain, constructor functions, and how classes are just sugar over prototypes.
sidebar_position: 11
---

# Prototypes & Inheritance

## 1. What are Prototypes, and why does JavaScript use them?

### 📖 Overview

One of the most unique features of JavaScript is that it uses **Prototype-based Inheritance** instead of traditional class-based inheritance.

In Java or C++, objects are created from classes.

In JavaScript, every object is linked to another object called its **Prototype**.

This prototype acts as a shared object from which other objects can inherit properties and methods.

Understanding prototypes is essential because many core JavaScript features—including arrays, functions, classes, and objects—are built on top of the prototype system.

---

### ⚙️ Main Explanation

#### What is a Prototype?

A **Prototype** is another object that JavaScript uses as a fallback when a property or method is not found on the current object.

Suppose we have:

```js
const person = {
  greet() {
    console.log("Hello!");
  },
};

const user = Object.create(person);

console.log(user.greet);
```

The `user` object doesn't have its own `greet()` method.

Instead, JavaScript looks at `user`'s prototype and finds the method there.

Conceptually:

```text
user

↓

Prototype

↓

person

↓

greet()
```

This ability to inherit behavior is the foundation of prototype-based inheritance.

---

#### Why Does JavaScript Use Prototypes?

Imagine creating one thousand employee objects.

```js
const employee1 = {
  name: "A",
};

const employee2 = {
  name: "B",
};
```

If every object contained its own copy of methods:

```text
Employee 1

↓

work()

-------------------

Employee 2

↓

work()

-------------------

Employee 3

↓

work()
```

JavaScript would store thousands of identical functions in memory.

Instead, JavaScript stores one shared method on the prototype.

```text
Employee 1

      │

Employee 2

      │

Employee 3

      ▼

Shared Prototype

↓

work()
```

All objects reuse the same method, reducing memory usage and improving efficiency.

---

#### What is Prototype-Based Inheritance?

Prototype-based inheritance means an object can inherit properties and methods directly from another object through its prototype.

Example:

```js
const animal = {
  eat() {
    console.log("Eating...");
  },
};

const dog =
  Object.create(animal);

dog.eat();
```

Output:

```text
Eating...
```

Although `dog` doesn't define `eat()`, it inherits it from `animal`.

---

#### Constructor Functions

Before ES6 classes, JavaScript commonly used **Constructor Functions** to create multiple similar objects.

Example:

```js
function User(name) {
  this.name = name;
}

const user1 =
  new User("Vaibhav");
```

A Constructor Function is simply a regular function intended to create objects.

By convention, constructor names begin with a capital letter.

---

#### Why Do We Use Constructor Functions?

Without constructors:

```js
const user1 = {
  name: "Vaibhav",
};

const user2 = {
  name: "Aman",
};
```

We repeatedly write similar object definitions.

Constructor Functions allow us to reuse object creation logic.

```js
function User(name) {
  this.name = name;
}

const user1 =
  new User("Vaibhav");

const user2 =
  new User("Aman");
```

Now multiple objects can be created using the same blueprint.

---

#### What Does the `new` Keyword Do?

The `new` keyword performs several steps automatically.

When JavaScript executes:

```js
const user =
  new User("Vaibhav");
```

it internally performs roughly the following steps.

---

##### Step 1 — Create a New Empty Object

```text
{}
```

---

##### Step 2 — Link the Object to the Constructor's Prototype

```text
New Object

↓

Prototype

↓

User.prototype
```

This enables prototype inheritance.

---

##### Step 3 — Set `this`

Inside the constructor:

```js
this
```

now refers to the newly created object.

```js
function User(name) {
  this.name = name;
}
```

becomes similar to:

```js
newObject.name = name;
```

---

##### Step 4 — Execute the Constructor

The constructor initializes the object.

```text
this.name

↓

"Vaibhav"
```

---

##### Step 5 — Return the New Object

Finally:

```text
newObject

↓

Returned
```

Unless the constructor explicitly returns another object, JavaScript automatically returns the newly created object.

---

#### Why is Prototype-Based Inheritance Different from Class-Based Inheritance?

In languages like Java:

```text
Class

↓

Object
```

Objects are created from classes.

In JavaScript:

```text
Object

↓

Prototype

↓

Another Object
```

Objects inherit directly from other objects.

Even though ES6 introduced the `class` keyword, JavaScript still uses prototypes internally.

We'll explore this in detail later in this chapter.

---

#### Advantages of Prototype-Based Inheritance

Prototype-based inheritance offers several benefits:

- Methods are shared instead of duplicated.
- Memory usage is reduced.
- Objects can inherit behavior dynamically.
- Inheritance is flexible because prototypes are objects.

These characteristics make JavaScript's object model lightweight and efficient.

---

### 💻 Example

We'll use the following example throughout this chapter.

```js
function User(name) {
  this.name = name;
}

User.prototype.greet =
  function () {
    console.log(
      `Hello, ${this.name}`
    );
  };

const user =
  new User("Vaibhav");

user.greet();
```

Output:

```text
Hello, Vaibhav
```

The `greet()` method exists only once on `User.prototype`, yet every `User` object can use it.

---

### 📊 Diagram / Flow

#### Prototype Relationship

```text
user

↓

Prototype

↓

User.prototype

↓

Object.prototype

↓

null
```

---

#### Constructor with `new`

```text
new User()

↓

Create Object

↓

Link Prototype

↓

Set `this`

↓

Execute Constructor

↓

Return Object
```

---

#### Shared Methods

```text
User 1

      │

User 2

      │

User 3

      ▼

User.prototype

↓

greet()
```

---

#### Prototype-Based Inheritance

```text
Child Object

↓

Prototype

↓

Parent Object
```

---

### 🌍 Real-World Example

Imagine a company where every employee receives the same employee handbook.

Instead of printing a separate handbook for each employee, the company keeps **one shared handbook** that every employee can refer to.

```text
Employee A

      │

Employee B

      │

Employee C

      ▼

Employee Handbook
```

Whenever an employee needs information, they first check their own knowledge. If they don't know the answer, they consult the shared handbook.

JavaScript objects work similarly.

Each object first looks for a property on itself. If it isn't found, JavaScript follows the object's **prototype** to find the shared property or method.

This approach saves memory because common behavior is stored only once.

---

### 🎤 Interview Answer

A **Prototype** is another object that JavaScript uses as a fallback when a property or method is not found on the current object. JavaScript uses prototypes to implement **prototype-based inheritance**, allowing objects to inherit behavior directly from other objects. This approach reduces memory usage because shared methods are stored only once on the prototype instead of being duplicated in every object. Constructor Functions are used to create multiple similar objects, and the **`new`** keyword automatically creates a new object, links it to the constructor's prototype, sets `this` to the new object, executes the constructor, and returns the newly created object. Although ES6 introduced classes, they are implemented internally using prototypes.

---

### ❓ Follow-up Questions

1. What is a Prototype in JavaScript?
2. Why does JavaScript use prototypes instead of copying methods into every object?
3. What is Prototype-based Inheritance?
4. What is a Constructor Function?
5. What happens internally when the `new` keyword is used?
6. How is prototype-based inheritance different from class-based inheritance?

---

## 2. Prototype Chain and Property Lookup

### 📖 Overview

A **Prototype** is a single object from which another object can inherit.

A **Prototype Chain** is the sequence of prototype links that JavaScript follows when searching for a property or method.

Whenever you access a property:

```js
user.name
```

JavaScript doesn't immediately know where `name` exists.

Instead, it performs a **property lookup** by searching the object and then walking up its prototype chain until the property is found or the chain ends.

Understanding this lookup process is one of the most important JavaScript interview topics because it explains how inheritance works internally.

---

### ⚙️ Main Explanation

#### Prototype vs Prototype Chain

These two terms are closely related but different.

A **Prototype** is a single object.

```text
user

↓

User.prototype
```

A **Prototype Chain** is the complete sequence of linked prototypes.

```text
user

↓

User.prototype

↓

Object.prototype

↓

null
```

Think of the prototype chain as a linked path that JavaScript follows during property lookup.

---

#### How Does Property Lookup Work?

Whenever you access:

```js
user.greet();
```

JavaScript performs the following steps.

##### Step 1 — Check the Object Itself

```text
user

↓

greet ?
```

If the property exists, JavaScript stops searching.

---

##### Step 2 — Check the Prototype

If the property isn't found:

```text
user

↓

User.prototype
```

JavaScript looks inside the object's prototype.

---

##### Step 3 — Continue Up the Chain

If the property still isn't found:

```text
User.prototype

↓

Object.prototype
```

JavaScript continues searching.

---

##### Step 4 — End of the Chain

Eventually:

```text
Object.prototype

↓

null
```

Once JavaScript reaches `null`, the search stops.

If the property was never found, the result is:

```text
undefined
```

---

#### Complete Property Lookup Flow

Suppose:

```js
function User(name) {
  this.name = name;
}

User.prototype.greet =
  function () {
    console.log("Hello");
  };

const user =
  new User("Vaibhav");
```

Now execute:

```js
user.greet();
```

Internally, JavaScript searches like this:

```text
user

↓

Has greet?

↓

No

↓

User.prototype

↓

Has greet?

↓

Yes

↓

Execute Method
```

The method is found on the prototype, so JavaScript stops searching.

---

#### What Happens When a Property Isn't Found?

Suppose:

```js
console.log(
  user.salary
);
```

Lookup process:

```text
user

↓

salary ?

↓

No

↓

User.prototype

↓

salary ?

↓

No

↓

Object.prototype

↓

salary ?

↓

No

↓

null

↓

undefined
```

No error occurs because JavaScript simply returns `undefined`.

---

#### What Happens if a Property Exists on Both the Object and Its Prototype?

Consider:

```js
function User(name) {
  this.name = name;
}

User.prototype.name =
  "Prototype Name";

const user =
  new User("Vaibhav");

console.log(user.name);
```

Output:

```text
Vaibhav
```

JavaScript always prefers the **own property** over an inherited one.

This is called **property shadowing**.

Conceptually:

```text
Object

↓

Found Property

↓

Stop Searching
```

The prototype is never checked because the property already exists on the object.

---

#### Relationship Between Objects, Prototypes, and the Prototype Chain

Every object has an internal prototype reference.

That prototype is itself another object.

That object also has a prototype.

This continues until JavaScript reaches:

```text
Object.prototype

↓

null
```

This entire sequence is known as the **Prototype Chain**.

---

#### Why Does Property Lookup Work This Way?

Instead of copying every method into every object, JavaScript shares methods through prototypes.

When a property isn't available directly on an object, JavaScript automatically checks shared objects.

This provides:

- Memory efficiency.
- Code reuse.
- Dynamic inheritance.

---

#### Internal View of Property Resolution

Conceptually, the JavaScript engine performs something similar to:

```text
Current Object

↓

Property Found?

│

├── Yes

│     ↓

│ Return Value

│

└── No

      ↓

Prototype Exists?

│

├── Yes

│     ↓

│ Repeat Search

│

└── No

      ↓

Return undefined
```

This recursive lookup continues until the property is found or the prototype chain ends.

---

#### Best Practices

When working with prototypes:

- Remember that JavaScript always checks the object before its prototype.
- Avoid creating unnecessarily long prototype chains.
- Prefer shared prototype methods instead of duplicating methods in every object.
- Understand that inherited properties are resolved automatically through property lookup.

---

### 💻 Example

We'll continue using our running example.

```js
function User(name) {
  this.name = name;
}

User.prototype.greet =
  function () {
    console.log("Hello");
  };

const user =
  new User("Vaibhav");

console.log(user.name);

user.greet();

console.log(user.age);
```

Output:

```text
Vaibhav

Hello

undefined
```

Here:

- `name` is found directly on the object.
- `greet()` is found on the prototype.
- `age` isn't found anywhere in the prototype chain, so JavaScript returns `undefined`.

---

### 📊 Diagram / Flow

#### Prototype Chain

```text
user

↓

User.prototype

↓

Object.prototype

↓

null
```

---

#### Property Lookup

```text
Object

↓

Property Found?

│

├── Yes

│     ↓

│ Return Value

│

└── No

      ↓

Check Prototype
```

---

#### Complete Search

```text
Object

↓

Prototype

↓

Object.prototype

↓

null
```

---

#### Property Shadowing

```text
Object

↓

Property Exists

↓

Prototype Ignored
```

---

### 🌍 Real-World Example

Imagine you're searching for an employee policy inside a company.

First, you check your own team's handbook.

```text
Team Handbook

↓

Policy Found?

│

├── Yes

│     ↓

│ Stop

│

└── No

      ↓

Company Handbook
```

If the policy isn't there, you check the company-wide handbook.

If it's still missing, you ask the corporate headquarters.

```text
Corporate Handbook

↓

Policy Found?

│

├── Yes

│     ↓

│ Use Policy

│

└── No

      ↓

No Such Policy
```

The **Prototype Chain** works exactly the same way.

JavaScript searches the object first, then each prototype in order, until it either finds the property or reaches the end of the chain.

---

### 🎤 Interview Answer

A **Prototype Chain** is the sequence of prototype links that JavaScript follows when searching for a property or method. When a property is accessed, JavaScript first checks the object itself. If the property isn't found, it searches the object's prototype, then the prototype's prototype, continuing until it reaches `Object.prototype` and finally `null`. This process is called **property lookup**. If the property exists on both the object and its prototype, JavaScript always uses the object's own property, a behavior known as **property shadowing**. The prototype chain enables efficient inheritance by allowing objects to share methods instead of duplicating them.

---

### ❓ Follow-up Questions

1. What is the difference between a Prototype and a Prototype Chain?
2. How does JavaScript perform property lookup?
3. What happens when a property isn't found anywhere in the prototype chain?
4. Why does JavaScript stop searching when it finds an own property?
5. What is property shadowing?
6. Why is the prototype chain memory-efficient?

---

## 3. `prototype`, `__proto__`, and Object Relationships

### 📖 Overview

One of the most confusing topics in JavaScript is the difference between:

- `prototype`
- `__proto__`
- `Object.getPrototypeOf()`

Many developers assume these are the same thing, but they serve completely different purposes.

Understanding these properties is essential because they explain:

- How objects are connected.
- How inheritance works.
- How `instanceof` determines relationships.
- Why every object can access inherited methods.

---

### ⚙️ Main Explanation

#### `prototype` vs `__proto__`

Although their names are similar, they are **not the same**.

| `prototype` | `__proto__` |
|-------------|-------------|
| Exists on constructor functions | Exists on objects |
| Used when creating new objects | Points to an object's prototype |
| Determines what new objects inherit | Represents an object's prototype link |

A simple way to remember:

> **`prototype` belongs to functions, while `__proto__` belongs to objects.**

---

#### What is `prototype`?

The `prototype` property exists on **constructor functions** (and ES6 classes, since classes are special functions).

Example:

```js
function User(name) {
  this.name = name;
}

console.log(User.prototype);
```

Output (conceptually):

```text
{
  constructor: User
}
```

Anything added to `User.prototype` becomes available to all objects created with `new User()`.

Example:

```js
User.prototype.greet =
  function () {
    console.log("Hello");
  };
```

Every `User` instance can now call:

```js
user.greet();
```

without each object storing its own copy of `greet()`.

---

#### What is `__proto__`?

`__proto__` is a property available on **objects**.

It points to the object's prototype.

Example:

```js
const user =
  new User("Vaibhav");

console.log(
  user.__proto__
);
```

Conceptually:

```text
user

↓

__proto__

↓

User.prototype
```

This link is what JavaScript follows during property lookup.

> **Note:** `__proto__` is widely supported but is considered a legacy accessor. In modern code, prefer `Object.getPrototypeOf()` and `Object.setPrototypeOf()`.

---

#### Which Objects Have `prototype`?

Only **functions that can act as constructors** have a `prototype` property.

Example:

```js
function User() {}

console.log(
  User.prototype
);
```

Output:

```text
{}
```

Regular objects do **not** have a `prototype` property.

Example:

```js
const user = {};

console.log(
  user.prototype
);
```

Output:

```text
undefined
```

---

#### Which Objects Have `__proto__`?

Almost every object has an internal prototype link, exposed through `__proto__`.

Example:

```js
const user = {};

console.log(
  user.__proto__
);
```

Conceptually:

```text
user

↓

Object.prototype
```

Functions are also objects, so they also have a `__proto__`.

---

#### Own Properties vs Inherited Properties

Consider:

```js
function User(name) {
  this.name = name;
}

User.prototype.greet =
  function () {};

const user =
  new User("Vaibhav");
```

Here:

```text
Own Property

↓

name

-------------------

Inherited Property

↓

greet
```

Own properties belong directly to the object.

Inherited properties come from the prototype chain.

---

#### Checking the Prototype of an Object

Instead of using `__proto__`, modern JavaScript provides:

```js
Object.getPrototypeOf(
  user
);
```

Output:

```text
User.prototype
```

This is the recommended way to inspect an object's prototype.

---

#### How Does `instanceof` Work?

The `instanceof` operator checks whether a constructor's `prototype` appears anywhere in an object's prototype chain.

Example:

```js
user instanceof User;
```

Output:

```text
true
```

Internally, JavaScript checks:

```text
user

↓

User.prototype ?

↓

Found

↓

true
```

If the constructor's prototype is found anywhere in the chain, `instanceof` returns `true`.

---

#### `instanceof` vs `typeof`

These operators answer different questions.

| `instanceof` | `typeof` |
|--------------|----------|
| Checks prototype chain | Checks value type |
| Used for objects | Used for primitive types and functions |
| Returns `true`/`false` | Returns a string |

Example:

```js
const user =
  new User("Vaibhav");

console.log(
  user instanceof User
);
```

Output:

```text
true
```

Now compare:

```js
console.log(
  typeof user
);
```

Output:

```text
object
```

`typeof` cannot tell which constructor created an object.

---

#### Visual Relationship

When using:

```js
const user =
  new User();
```

the relationship looks like this:

```text
User

│

└── prototype

      │

      ▼

User.prototype

      ▲

      │

user.__proto__

      ▲

      │

user
```

The constructor's `prototype` becomes the object's `__proto__`.

---

#### Best Practices

When working with prototypes:

- Use `Object.getPrototypeOf()` instead of `__proto__` in production code.
- Remember that only constructor functions have a `prototype` property.
- Use `instanceof` to check object relationships.
- Use `typeof` for primitive values and functions, not for determining constructor relationships.

---

### 💻 Example

We'll continue using our running example.

```js
function User(name) {
  this.name = name;
}

User.prototype.greet =
  function () {
    console.log("Hello");
  };

const user =
  new User("Vaibhav");

console.log(
  Object.getPrototypeOf(user) ===
    User.prototype
);

console.log(
  user instanceof User
);

console.log(
  typeof user
);
```

Output:

```text
true

true

object
```

---

### 📊 Diagram / Flow

#### Constructor and Instance

```text
User

│

└── prototype

      │

      ▼

User.prototype

      ▲

      │

user.__proto__

      ▲

      │

user
```

---

#### `instanceof`

```text
Object

↓

Prototype Chain

↓

Constructor.prototype Found?

│

├── Yes

│     ↓

│ true

│

└── No

      ↓

false
```

---

#### Own vs Inherited

```text
Object

│

├── Own Properties

│

└── Prototype

      ↓

Inherited Properties
```

---

#### `typeof`

```text
Value

↓

Primitive?

│

├── Yes

│     ↓

│ Type String

│

└── Object

      ↓

"object"
```

---

### 🌍 Real-World Example

Imagine a company.

The **HR department** maintains the official employee handbook.

```text
HR

↓

Employee Handbook
```

Every employee has a badge that points to that handbook.

```text
Employee Badge

↓

Employee Handbook
```

The handbook itself doesn't point back to employees—it simply contains shared policies.

Similarly:

- `prototype` is like the shared handbook owned by the constructor.
- `__proto__` is like each employee's badge pointing to that handbook.
- `instanceof` checks whether an employee belongs to a particular company's handbook.

---

### 🎤 Interview Answer

The `prototype` property exists on constructor functions and defines the object that newly created instances inherit from. The `__proto__` property exists on objects and points to their prototype. When an object is created using the `new` keyword, its internal prototype is linked to the constructor's `prototype`. In modern JavaScript, `Object.getPrototypeOf()` is preferred over directly using `__proto__`. The `instanceof` operator checks whether a constructor's `prototype` exists anywhere in an object's prototype chain, while `typeof` simply reports the general type of a value and cannot determine which constructor created an object.

---

### ❓ Follow-up Questions

1. What is the difference between `prototype` and `__proto__`?
2. Which objects have a `prototype` property?
3. Which objects have a `__proto__` property?
4. How does `instanceof` work internally?
5. What is the difference between `instanceof` and `typeof`?
6. Why is `Object.getPrototypeOf()` preferred over `__proto__`?

---

## 4. Constructor Functions and Prototype Methods

### 📖 Overview

Before ES6 introduced classes, JavaScript developers commonly used **Constructor Functions** to create multiple objects with the same structure.

A constructor creates the object's own properties, while shared methods are stored on its **prototype**.

This separation is important because it:

- Reduces memory usage.
- Improves performance.
- Enables prototype-based inheritance.

Even today, ES6 classes work internally using this same mechanism.

---

### ⚙️ Main Explanation

#### Adding Methods to a Constructor Function

Consider a constructor function.

```js
function User(name) {
  this.name = name;
}
```

We can add methods in two different ways.

---

##### Option 1 — Inside the Constructor

```js
function User(name) {
  this.name = name;

  this.greet = function () {
    console.log(
      `Hello, ${this.name}`
    );
  };
}
```

This works correctly.

However, every time we create a new object:

```js
const user1 =
  new User("Vaibhav");

const user2 =
  new User("Aman");
```

JavaScript creates **two separate copies** of the `greet()` function.

Memory:

```text
user1

↓

greet()

-------------------

user2

↓

greet()
```

Although both functions contain identical code, they occupy different memory locations.

---

##### Option 2 — Using the Prototype

Instead, place the method on the prototype.

```js
function User(name) {
  this.name = name;
}

User.prototype.greet =
  function () {
    console.log(
      `Hello, ${this.name}`
    );
  };
```

Now:

```js
const user1 =
  new User("Vaibhav");

const user2 =
  new User("Aman");
```

Both objects share the same method.

Memory:

```text
user1

      │

user2

      │

      ▼

User.prototype

↓

greet()
```

Only one copy of the function exists.

---

#### Why Should Methods Be Added to the Prototype?

Adding methods to the prototype provides several benefits.

##### Memory Efficiency

Instead of storing one copy of a method per object:

```text
1000 Objects

↓

1000 greet() Functions
```

JavaScript stores:

```text
1000 Objects

↓

1 Shared greet() Function
```

This significantly reduces memory usage.

---

##### Better Performance

Creating a new function for every object requires additional memory allocation.

Prototype methods are created once and reused, making object creation more efficient.

---

##### Easier Maintenance

If you update a prototype method:

```js
User.prototype.greet =
  function () {
    console.log("Welcome!");
  };
```

every existing object immediately uses the updated implementation.

There is no need to modify each object individually.

---

#### Constructor Functions Implement Inheritance

Suppose we have:

```js
function Animal() {}

Animal.prototype.eat =
  function () {
    console.log("Eating...");
  };

function Dog() {}

Dog.prototype =
  Object.create(
    Animal.prototype
  );

Dog.prototype.constructor =
  Dog;
```

Now:

```js
const dog =
  new Dog();

dog.eat();
```

Output:

```text
Eating...
```

The `Dog` constructor inherits methods from `Animal.prototype` through the prototype chain.

Conceptually:

```text
dog

↓

Dog.prototype

↓

Animal.prototype

↓

Object.prototype

↓

null
```

This is how constructor functions implement inheritance.

---

#### How Does Prototype Sharing Reduce Memory Usage?

Imagine a company with 10,000 employees.

If every employee receives their own printed copy of the company handbook:

```text
Employee

↓

Handbook Copy
```

the company prints 10,000 identical books.

Instead, the company keeps one shared handbook.

```text
Employees

↓

Shared Handbook
```

Employees refer to the same handbook whenever needed.

Prototype methods work exactly the same way.

---

#### Constructor Functions vs ES6 Classes

ES6 classes provide cleaner syntax.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(
      `Hello, ${this.name}`
    );
  }
}
```

Internally, JavaScript still stores `greet()` on:

```text
User.prototype
```

The underlying prototype system remains the same.

---

#### Best Practices

When using constructor functions:

- Store object-specific data inside the constructor.
- Store shared methods on the prototype.
- Avoid creating methods inside the constructor unless each instance truly needs its own unique function.
- Use prototype inheritance to share behavior across related objects.

---

### 💻 Example

We'll continue using our running example.

```js
function User(name) {
  this.name = name;
}

User.prototype.greet =
  function () {
    console.log(
      `Hello, ${this.name}`
    );
  };

const user1 =
  new User("Vaibhav");

const user2 =
  new User("Aman");

console.log(
  user1.greet ===
    user2.greet
);

user1.greet();

user2.greet();
```

Output:

```text
true

Hello, Vaibhav

Hello, Aman
```

The comparison returns `true` because both objects share the same function from `User.prototype`.

---

### 📊 Diagram / Flow

#### Method Inside Constructor

```text
user1

↓

greet()

-------------------

user2

↓

greet()
```

---

#### Method on Prototype

```text
user1

      │

user2

      │

      ▼

User.prototype

↓

greet()
```

---

#### Constructor Inheritance

```text
Dog

↓

Dog.prototype

↓

Animal.prototype

↓

Object.prototype
```

---

#### Memory Usage

```text
Many Objects

↓

Shared Prototype

↓

One Method
```

---

### 🌍 Real-World Example

Imagine a school.

Each classroom follows the same school rulebook.

If every classroom printed its own copy of the rulebook, it would waste paper and storage.

```text
Classroom A

↓

Rulebook

-------------------

Classroom B

↓

Rulebook
```

Instead, the school keeps **one central rulebook** that every classroom uses.

```text
Classroom A

      │

Classroom B

      │

      ▼

School Rulebook
```

Prototype methods work the same way.

Instead of storing identical methods inside every object, JavaScript stores one shared method on the prototype, and every object uses it through the prototype chain.

---

### 🎤 Interview Answer

Constructor Functions create multiple objects with the same structure by initializing instance-specific properties inside the constructor. Shared behavior should be added to the constructor's `prototype` rather than inside the constructor itself because prototype methods are shared by all instances, reducing memory usage and improving performance. Constructor functions can also implement inheritance by linking one constructor's prototype to another using `Object.create()`. Although ES6 classes provide cleaner syntax, they are implemented internally using constructor functions and prototypes.

---

### ❓ Follow-up Questions

1. Why should methods be added to the prototype instead of inside the constructor?
2. How do prototype methods reduce memory usage?
3. How do Constructor Functions implement inheritance?
4. What is the relationship between Constructor Functions and ES6 classes?
5. Why do two instances share the same prototype method?
6. What happens if methods are defined inside the constructor instead?

---

## 5. Creating and Modifying Prototype Chains

### 📖 Overview

So far, we've seen that objects created with the `new` keyword automatically inherit from a constructor's prototype.

However, JavaScript also allows us to create objects **without using constructors** and even modify an object's prototype after it has been created.

The most common APIs for this are:

- `Object.create()`
- `Object.getPrototypeOf()`
- `Object.setPrototypeOf()`

Understanding these methods helps explain how prototype chains are built and why modifying them at runtime is generally discouraged.

---

### ⚙️ Main Explanation

#### What is `Object.create()`?

`Object.create()` creates a **new object** and directly sets its prototype to the object you provide.

Syntax:

```js
Object.create(prototype);
```

Example:

```js
const animal = {
  eat() {
    console.log("Eating...");
  },
};

const dog =
  Object.create(animal);

dog.eat();
```

Output:

```text
Eating...
```

Here:

```text
dog

↓

Prototype

↓

animal
```

The `dog` object doesn't have its own `eat()` method—it inherits it from `animal`.

---

#### How Does `Object.create()` Work?

Internally, JavaScript performs something conceptually similar to:

```text
Create Empty Object

↓

Set Prototype

↓

Return Object
```

Unlike the `new` keyword, **no constructor function is executed**.

---

#### `Object.create()` vs `new`

Both create objects, but they work differently.

| `Object.create()` | `new` |
|-------------------|-------|
| Creates an empty object | Creates an object using a constructor |
| Prototype is explicitly provided | Prototype comes from `Constructor.prototype` |
| Doesn't execute a constructor | Executes the constructor function |
| Useful for direct prototype inheritance | Useful for creating initialized instances |

Example using `new`:

```js
function User(name) {
  this.name = name;
}

const user =
  new User("Vaibhav");
```

Example using `Object.create()`:

```js
const user =
  Object.create(User.prototype);

user.name = "Vaibhav";
```

Notice that with `Object.create()`, you must initialize properties yourself because no constructor runs.

---

#### `Object.getPrototypeOf()`

`Object.getPrototypeOf()` returns the prototype of an object.

Example:

```js
const user =
  new User("Vaibhav");

console.log(
  Object.getPrototypeOf(user)
);
```

Output (conceptually):

```text
User.prototype
```

This is the recommended way to inspect an object's prototype in modern JavaScript.

---

#### What is `Object.setPrototypeOf()`?

`Object.setPrototypeOf()` changes an object's prototype **after it has been created**.

Example:

```js
const animal = {
  eat() {
    console.log("Eating...");
  },
};

const dog = {};

Object.setPrototypeOf(
  dog,
  animal
);

dog.eat();
```

Output:

```text
Eating...
```

The prototype chain is modified dynamically.

---

#### Can the Prototype Be Changed After Creation?

Yes.

JavaScript allows changing an object's prototype after creation using:

```js
Object.setPrototypeOf();
```

or the legacy:

```js
__proto__
```

However, doing this is generally discouraged.

---

#### Why is Modifying the Prototype at Runtime Discouraged?

Changing an object's prototype after creation has several drawbacks.

##### Performance

JavaScript engines optimize objects based on their original structure.

Changing the prototype forces the engine to discard these optimizations and recalculate internal lookups.

---

##### Predictability

If an object's prototype changes unexpectedly, understanding where methods come from becomes more difficult.

This makes code harder to debug and maintain.

---

##### Readability

Developers usually expect an object's inheritance to remain stable after creation.

Changing prototypes dynamically can introduce surprising behavior.

For these reasons, it's considered a bad practice in production code unless there's a very specific need.

---

#### When Should You Use `Object.create()`?

`Object.create()` is useful when:

- You want direct prototype inheritance.
- You don't need a constructor function.
- You're implementing custom inheritance patterns.
- You're creating lightweight objects with shared behavior.

---

#### Best Practices

When working with prototype chains:

- Use `Object.create()` to create objects with a specific prototype.
- Use `Object.getPrototypeOf()` to inspect prototypes.
- Avoid `Object.setPrototypeOf()` unless absolutely necessary.
- Prefer establishing the prototype relationship when the object is created rather than modifying it later.

---

### 💻 Example

We'll continue using our running example.

```js
const animal = {
  eat() {
    console.log("Eating...");
  },
};

const dog =
  Object.create(animal);

console.log(
  Object.getPrototypeOf(dog) ===
    animal
);

dog.eat();
```

Output:

```text
true

Eating...
```

The `dog` object inherits the `eat()` method through its prototype.

---

### 📊 Diagram / Flow

#### `Object.create()`

```text
Prototype Object

↓

Object.create()

↓

New Object

↓

Prototype Link
```

---

#### `new`

```text
Constructor

↓

Create Object

↓

Constructor.prototype

↓

Return Object
```

---

#### `Object.setPrototypeOf()`

```text
Existing Object

↓

Change Prototype

↓

New Prototype Chain
```

---

#### Prototype Inspection

```text
Object

↓

Object.getPrototypeOf()

↓

Prototype
```

---

### 🌍 Real-World Example

Imagine a new employee joining a company.

Normally, during onboarding, the employee is assigned to a department.

```text
New Employee

↓

Assign Department

↓

Works Normally
```

This is similar to using the `new` keyword or `Object.create()`, where the relationship is established when the object is created.

Now imagine transferring the employee to a completely different department after months of work.

```text
Employee

↓

Change Department

↓

Update Responsibilities
```

While this is possible, it requires updating workflows, permissions, and responsibilities.

Similarly, changing an object's prototype after creation is possible but can make the program harder to optimize and understand.

---

### 🎤 Interview Answer

`Object.create()` creates a new object and explicitly sets its prototype to the object provided, allowing direct prototype-based inheritance without executing a constructor function. In contrast, the `new` keyword creates an object, links it to a constructor's `prototype`, executes the constructor, and returns the initialized object. `Object.getPrototypeOf()` is used to retrieve an object's prototype, while `Object.setPrototypeOf()` changes it after creation. Although modifying an object's prototype at runtime is possible, it is generally discouraged because it can reduce JavaScript engine optimizations and make code more difficult to understand and maintain.

---

### ❓ Follow-up Questions

1. What is `Object.create()`?
2. How does `Object.create()` differ from the `new` keyword?
3. What does `Object.getPrototypeOf()` return?
4. What is `Object.setPrototypeOf()` used for?
5. Why is changing an object's prototype after creation discouraged?
6. When should you use `Object.create()` instead of a constructor function?

---

## 6. Prototype-Based Inheritance

### 📖 Overview

Inheritance is one of the core principles of object-oriented programming.

It allows one object to reuse the properties and methods of another object instead of redefining them.

Unlike languages such as Java or C++, JavaScript does **not** use class-based inheritance internally.

Instead, it uses **Prototype-based Inheritance**, where objects inherit directly from other objects through the **Prototype Chain**.

Understanding this concept explains how JavaScript achieves code reuse, method overriding, and shared behavior.

---

### ⚙️ Main Explanation

#### What is Prototype-Based Inheritance?

Prototype-based inheritance means that an object can inherit properties and methods from another object through its prototype.

Example:

```js
const animal = {
  eat() {
    console.log("Eating...");
  },
};

const dog =
  Object.create(animal);

dog.eat();
```

Output:

```text
Eating...
```

Although `dog` doesn't define `eat()`, JavaScript finds it through the prototype chain.

---

#### How Does Inheritance Work Internally?

Consider the following example.

```js
const animal = {
  eat() {
    console.log("Eating...");
  },
};

const dog =
  Object.create(animal);
```

The relationship is:

```text
dog

↓

animal

↓

Object.prototype

↓

null
```

When:

```js
dog.eat();
```

is executed, JavaScript performs property lookup.

```text
dog

↓

eat ?

↓

No

↓

animal

↓

eat ?

↓

Yes

↓

Execute
```

The inherited method is executed even though it isn't stored directly on `dog`.

---

#### Constructor Function Inheritance

Inheritance can also be created using constructor functions.

```js
function Animal() {}

Animal.prototype.eat =
  function () {
    console.log("Eating...");
  };

function Dog() {}

Dog.prototype =
  Object.create(
    Animal.prototype
  );

Dog.prototype.constructor =
  Dog;
```

Now:

```js
const dog =
  new Dog();

dog.eat();
```

Output:

```text
Eating...
```

The prototype chain becomes:

```text
dog

↓

Dog.prototype

↓

Animal.prototype

↓

Object.prototype

↓

null
```

---

#### Method Overriding

A child object can define a method with the same name as its prototype.

Example:

```js
const animal = {
  speak() {
    console.log("Animal");
  },
};

const dog =
  Object.create(animal);

dog.speak = function () {
  console.log("Dog");
};

dog.speak();
```

Output:

```text
Dog
```

JavaScript finds the method directly on `dog`, so it never looks at the prototype.

This behavior is called **Method Overriding**.

---

#### Property Shadowing

Method overriding is a specific case of a more general concept called **Property Shadowing**.

Example:

```js
const animal = {
  legs: 4,
};

const dog =
  Object.create(animal);

dog.legs = 3;

console.log(dog.legs);
```

Output:

```text
3
```

Although the prototype contains:

```text
legs

↓

4
```

the object's own property hides the inherited one.

Property lookup stops as soon as JavaScript finds the object's own property.

---

#### Prototype-Based Inheritance vs Class-Based Inheritance

Traditional class-based inheritance:

```text
Class

↓

Subclass

↓

Object
```

Prototype-based inheritance:

```text
Object

↓

Prototype

↓

Another Object
```

JavaScript objects inherit directly from other objects rather than from classes.

Even ES6 classes ultimately use prototypes internally.

---

#### Advantages of Prototype-Based Inheritance

Prototype-based inheritance provides several benefits.

- Methods are shared across objects.
- Memory usage is reduced.
- Code reuse is simplified.
- Objects can inherit behavior dynamically.
- No duplication of common methods.

This makes JavaScript's inheritance model lightweight and flexible.

---

#### Disadvantages of Prototype-Based Inheritance

Despite its flexibility, prototype-based inheritance also has some drawbacks.

- It can be harder to understand than traditional class-based inheritance.
- Long prototype chains can make property lookup slightly slower.
- Dynamic prototype changes can introduce unexpected behavior.
- Beginners often confuse `prototype`, `__proto__`, and the prototype chain.

Understanding the underlying mechanism helps avoid these issues.

---

#### Best Practices

When working with inheritance:

- Share common methods through prototypes.
- Avoid modifying prototypes dynamically unless necessary.
- Keep prototype chains reasonably short.
- Use ES6 classes for cleaner syntax when appropriate, while remembering they still use prototypes internally.

---

### 💻 Example

We'll continue using our running example.

```js
function Animal() {}

Animal.prototype.eat =
  function () {
    console.log("Eating...");
  };

function Dog() {}

Dog.prototype =
  Object.create(
    Animal.prototype
  );

Dog.prototype.constructor =
  Dog;

Dog.prototype.eat =
  function () {
    console.log("Dog is eating...");
  };

const dog =
  new Dog();

dog.eat();
```

Output:

```text
Dog is eating...
```

The `Dog` prototype overrides the inherited `eat()` method from `Animal.prototype`.

---

### 📊 Diagram / Flow

#### Prototype Inheritance

```text
Child Object

↓

Prototype

↓

Parent Object
```

---

#### Constructor Inheritance

```text
dog

↓

Dog.prototype

↓

Animal.prototype

↓

Object.prototype

↓

null
```

---

#### Method Overriding

```text
Object

↓

Method Exists?

│

├── Yes

│     ↓

│ Use Own Method

│

└── No

      ↓

Check Prototype
```

---

#### Property Lookup

```text
Object

↓

Prototype

↓

Object.prototype

↓

null
```

---

### 🌍 Real-World Example

Imagine a company with a general employee handbook.

Every employee follows the common company policies.

```text
Employee

↓

Company Handbook
```

Now suppose the Sales department has its own handbook that overrides one of the general policies.

```text
Sales Handbook

↓

Travel Policy
```

When a Sales employee looks up the travel policy, they use the department's version first.

Only if the department handbook doesn't define a policy do they consult the company handbook.

JavaScript inheritance behaves the same way.

An object first checks its own properties. If a property isn't found, JavaScript follows the prototype chain until it finds one or reaches the end.

---

### 🎤 Interview Answer

Prototype-based inheritance allows JavaScript objects to inherit properties and methods directly from other objects through the prototype chain. When a property isn't found on an object, JavaScript automatically searches its prototype, continuing up the chain until the property is found or the chain ends. Child objects can override inherited methods by defining properties with the same name, a behavior known as **method overriding** or **property shadowing**. Compared to class-based inheritance, JavaScript's prototype model is more flexible and memory-efficient because shared methods are stored once on the prototype instead of being duplicated for every object.

---

### ❓ Follow-up Questions

1. What is Prototype-based Inheritance?
2. How does JavaScript implement inheritance internally?
3. What is Method Overriding?
4. What is Property Shadowing?
5. How is prototype-based inheritance different from class-based inheritance?
6. What are the advantages and disadvantages of prototype-based inheritance?

---

## 7. ES6 Classes and Performance

### 📖 Overview

ES6 introduced the **`class`** keyword to provide a cleaner and more familiar syntax for creating objects and implementing inheritance.

Many developers assume that JavaScript classes work like classes in Java or C++.

However, this is **not true**.

An ES6 class is **syntactic sugar** over JavaScript's existing prototype system.

Understanding this relationship is important because it explains:

- How classes work internally.
- Why prototype methods are memory efficient.
- How long prototype chains affect performance.
- Why prototypes are still relevant even when using classes.

---

### ⚙️ Main Explanation

#### What is an ES6 Class?

An ES6 class provides a cleaner way to write constructor functions and prototype methods.

Example:

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(
      `Hello, ${this.name}`
    );
  }
}
```

Creating an object:

```js
const user =
  new User("Vaibhav");

user.greet();
```

Output:

```text
Hello, Vaibhav
```

The syntax looks different, but JavaScript still uses prototypes internally.

---

#### How Are ES6 Classes Implemented Internally?

The previous class is conceptually similar to:

```js
function User(name) {
  this.name = name;
}

User.prototype.greet =
  function () {
    console.log(
      `Hello, ${this.name}`
    );
  };
```

Both approaches create the same prototype relationship.

```text
user

↓

User.prototype

↓

Object.prototype

↓

null
```

The `class` keyword simply hides the prototype syntax.

---

#### Why Are Prototype Methods Memory Efficient?

Consider two approaches.

##### Methods Inside the Constructor

```js
function User(name) {
  this.name = name;

  this.greet = function () {};
}
```

Every object receives its own function.

```text
user1

↓

greet()

-------------------

user2

↓

greet()
```

---

##### Methods on the Prototype

```js
User.prototype.greet =
  function () {};
```

Now all objects share one function.

```text
user1

      │

user2

      │

      ▼

User.prototype

↓

greet()
```

This is exactly how ES6 class methods behave.

---

#### How Do Classes Implement Inheritance?

Example:

```js
class Animal {
  eat() {
    console.log("Eating...");
  }
}

class Dog extends Animal {}

const dog =
  new Dog();

dog.eat();
```

Output:

```text
Eating...
```

Internally, JavaScript links:

```text
Dog.prototype

↓

Animal.prototype
```

through the prototype chain.

The inheritance mechanism remains prototype-based.

---

#### Performance and Prototype Chains

Whenever JavaScript accesses:

```js
user.greet();
```

it performs property lookup.

If the property isn't found:

```text
Object

↓

Prototype

↓

Prototype

↓

Prototype

↓

...
```

JavaScript continues searching until it finds the property or reaches `null`.

Long prototype chains require more lookup steps.

Modern JavaScript engines optimize these lookups aggressively, so the impact is usually small.

However, unnecessarily deep inheritance hierarchies can still reduce readability and may introduce slight lookup overhead.

---

#### Why Is Prototype-Based Sharing Faster?

Suppose 100,000 objects share the same method.

Without prototypes:

```text
100,000 Objects

↓

100,000 Functions
```

With prototypes:

```text
100,000 Objects

↓

1 Shared Function
```

Advantages:

- Lower memory usage.
- Faster object creation.
- Less duplicated code.
- Better cache locality in many JavaScript engines.

---

#### Should You Worry About Prototype Performance?

In most real-world applications:

**No.**

Modern JavaScript engines (such as V8, SpiderMonkey, and JavaScriptCore) optimize prototype lookups very efficiently.

Performance problems are much more likely to come from:

- Unnecessary object creation.
- Expensive algorithms.
- Inefficient rendering.
- Frequent DOM manipulation.

Keeping your prototype chains reasonably short and avoiding runtime prototype modifications is generally sufficient.

---

#### Best Practices

When working with classes and prototypes:

- Prefer ES6 classes for readability.
- Remember that classes are built on prototypes.
- Store shared behavior as prototype methods.
- Avoid creating methods inside constructors unless necessary.
- Keep inheritance hierarchies simple.
- Avoid changing prototypes at runtime.

---

### 💻 Example

We'll continue using our running example.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(
      `Hello, ${this.name}`
    );
  }
}

const user1 =
  new User("Vaibhav");

const user2 =
  new User("Aman");

console.log(
  user1.greet ===
    user2.greet
);
```

Output:

```text
true
```

Both objects share the same method because `greet()` is stored on `User.prototype`.

---

### 📊 Diagram / Flow

#### ES6 Class Internally

```text
class

↓

Constructor Function

↓

Prototype Methods
```

---

#### Inheritance

```text
Dog.prototype

↓

Animal.prototype

↓

Object.prototype

↓

null
```

---

#### Method Lookup

```text
Object

↓

Prototype

↓

Prototype

↓

Found?
```

---

#### Shared Methods

```text
Many Objects

↓

One Prototype

↓

One Shared Method
```

---

### 🌍 Real-World Example

Imagine a company that provides a single online employee handbook.

Every employee accesses the same handbook through the company's internal portal.

```text
Employees

↓

Company Portal

↓

Employee Handbook
```

Instead of downloading a separate copy for every employee, everyone shares the same resource.

This saves storage and ensures everyone sees the latest version.

Prototype methods work similarly.

Every object shares one method stored on the prototype instead of keeping duplicate copies.

ES6 classes simply provide a cleaner way to define this shared behavior while still relying on the same underlying prototype mechanism.

---

### 🎤 Interview Answer

ES6 classes are **syntactic sugar** over JavaScript's prototype system. When a class is defined, JavaScript internally creates a constructor function and stores instance methods on the constructor's `prototype`, allowing all instances to share the same methods. Class inheritance using the `extends` keyword is also implemented through the prototype chain by linking one prototype to another. Prototype-based sharing reduces memory usage because methods are stored only once, and although long prototype chains require additional property lookup steps, modern JavaScript engines optimize these lookups efficiently. For most applications, using ES6 classes provides cleaner syntax while retaining the performance benefits of prototypes.

---

### ❓ Follow-up Questions

1. Are ES6 classes different from prototypes internally?
2. Why are classes called syntactic sugar?
3. How does the `extends` keyword implement inheritance?
4. Why are prototype methods memory-efficient?
5. Do long prototype chains affect performance?
6. Why are ES6 classes preferred over constructor functions in modern JavaScript?

---

## 8. Interview Perspective and Mental Model of Prototypes

### 📖 Overview

Prototypes are one of the most misunderstood concepts in JavaScript.

Many developers memorize terms like:

- `prototype`
- `__proto__`
- Prototype Chain
- Constructor Functions
- `new`

without understanding how they are connected.

In interviews, the goal isn't to remember definitions—it's to explain **how JavaScript finds properties and shares methods internally**.

Once you understand the mental model, almost every prototype-related interview question becomes straightforward.

---

### ⚙️ Main Explanation

#### The Mental Model

Whenever JavaScript creates an object, think of the following process.

```text
Create Object

↓

Link Prototype

↓

Store Own Properties

↓

Access Property

↓

Search Prototype Chain

↓

Return Value
```

Almost every prototype-related question can be answered using this flow.

---

#### The Most Important Rule

When JavaScript accesses a property:

```js
user.greet();
```

it always follows this order.

```text
Object

↓

Own Property?

│

├── Yes

│     ↓

│ Return Value

│

└── No

      ↓

Prototype

↓

Found?

│

├── Yes

│     ↓

│ Return Value

│

└── No

      ↓

Continue Up Chain

↓

null

↓

undefined
```

This explains:

- Property lookup.
- Inheritance.
- Method sharing.
- Prototype chains.

---

#### Understanding the Relationships

Many interview questions become easy once you understand these relationships.

```text
Constructor Function

↓

prototype

↓

Shared Methods

↑

__proto__

↓

Object Instance
```

Remember:

- **`prototype` belongs to constructor functions (and classes).**
- **`__proto__` (or the internal `[[Prototype]]`) belongs to objects.**
- **`Object.getPrototypeOf()`** is the modern way to read an object's prototype.

---

#### The `new` Keyword Mental Model

Whenever you see:

```js
new User()
```

think:

```text
Create Object

↓

Link to User.prototype

↓

Set `this`

↓

Run Constructor

↓

Return Object
```

If you can explain these five steps, you've answered one of the most common prototype interview questions.

---

#### Constructor Functions vs ES6 Classes

Another common interview topic is the relationship between constructor functions and classes.

Think of it this way.

```text
Constructor Function

↓

Prototype

↓

Objects

-------------------

ES6 Class

↓

Constructor Function

↓

Prototype

↓

Objects
```

Classes don't replace prototypes.

They simply provide cleaner syntax for working with them.

---

#### Common Mistakes Developers Make

Some frequent mistakes include:

##### Confusing `prototype` and `__proto__`

These are different properties serving different purposes.

---

##### Assuming Classes Don't Use Prototypes

Classes still rely on the prototype chain internally.

---

##### Defining Methods Inside Constructors

This creates a new function for every instance.

Shared methods should usually be placed on the prototype.

---

##### Modifying Prototypes at Runtime

Changing prototypes after objects have been created can:

- Reduce performance.
- Make code harder to understand.
- Break assumptions about object behavior.

---

##### Confusing `typeof` and `instanceof`

Remember:

```text
typeof

↓

General Type

-------------------

instanceof

↓

Prototype Relationship
```

Each answers a different question.

---

#### Interview Tips

When answering prototype questions:

- Mention that **objects are linked through prototypes**.
- Explain that **property lookup follows the prototype chain**.
- State that **shared methods live on the prototype**, reducing memory usage.
- Clarify that **ES6 classes are built on prototypes**.
- Use simple diagrams or examples to explain the lookup process.

Interviewers usually value your reasoning more than memorized terminology.

---

### 💻 Example

We'll finish the chapter with a complete example.

```js
function User(name) {
  this.name = name;
}

User.prototype.greet =
  function () {
    console.log(
      `Hello, ${this.name}`
    );
  };

const user =
  new User("Vaibhav");

user.greet();

console.log(
  user instanceof User
);

console.log(
  Object.getPrototypeOf(user) ===
    User.prototype
);
```

Output:

```text
Hello, Vaibhav

true

true
```

This example demonstrates:

- Constructor Functions.
- The `new` keyword.
- Prototype methods.
- `instanceof`.
- Prototype relationships.

---

### 📊 Diagram / Flow

#### Complete Prototype Flow

```text
new User()

↓

Create Object

↓

Link Prototype

↓

Run Constructor

↓

Return Object

↓

Property Lookup

↓

Prototype Chain
```

---

#### Property Lookup

```text
Object

↓

Own Property?

↓

Prototype

↓

Object.prototype

↓

null
```

---

#### Relationships

```text
Constructor

↓

prototype

↓

Object Instance

↓

__proto__
```

---

#### ES6 Classes

```text
class

↓

Constructor Function

↓

Prototype

↓

Objects
```

---

### 🌍 Real-World Example

Imagine a company with a central operations manual.

Every new employee receives access to the same manual.

```text
Employee

↓

Operations Manual
```

When an employee has a question, they first rely on their own knowledge.

If they don't know the answer, they consult the operations manual.

If the manual doesn't contain the information, they escalate it to the company's global policy guide.

```text
Employee

↓

Department Manual

↓

Company Policy

↓

No Answer
```

This is exactly how JavaScript performs property lookup.

Objects first check their own properties, then their prototype, then the next prototype, continuing until the property is found or the chain ends.

---

### 🎤 Interview Answer

JavaScript uses **prototype-based inheritance**, where every object is linked to another object called its prototype. When a property or method is accessed, JavaScript first checks the object itself and, if the property isn't found, continues searching up the prototype chain until it reaches `Object.prototype` or `null`. Constructor functions define shared behavior through their `prototype` property, while object instances reference that prototype through their internal `[[Prototype]]` (commonly accessed via `Object.getPrototypeOf()` or the legacy `__proto__`). The `new` keyword creates an object, links it to the constructor's prototype, executes the constructor, and returns the object. ES6 classes provide cleaner syntax but are implemented internally using this same prototype mechanism.

---

### ❓ Follow-up Questions

1. What is the difference between a prototype and a prototype chain?
2. How does JavaScript perform property lookup?
3. What is the difference between `prototype` and `__proto__`?
4. How does the `new` keyword work internally?
5. Why are ES6 classes called syntactic sugar?
6. How would you explain JavaScript prototypes to someone coming from Java or C++?

---