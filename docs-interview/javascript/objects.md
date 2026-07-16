---
title: Objects
description: Creation, destructuring, copying, freezing, and how objects are stored in memory.
sidebar_position: 10
---

# Objects

## 1. What are Objects in JavaScript, and how do they work?

### 📖 Overview

In JavaScript, an **Object** is a collection of related data and behavior.

Instead of storing a single value like a string or number, an object groups multiple values together using **key-value pairs**.

For example, if you want to represent a user, storing each piece of information in separate variables quickly becomes difficult.

```js
const name = "Vaibhav";
const age = 22;
const city = "Lucknow";
```

A better approach is to group everything into a single object.

```js
const user = {
  name: "Vaibhav",
  age: 22,
  city: "Lucknow",
};
```

Objects help us organize data, model real-world entities, and write more maintainable code.

Almost everything you work with in JavaScript—including arrays, functions, dates, and DOM elements—is built around objects.

---

### ⚙️ Main Explanation

#### What is an Object?

An object is a collection of **properties** and **methods**.

A property stores data.

A method stores a function that performs an action.

Example:

```js
const user = {
  name: "Vaibhav",
  age: 22,

  greet() {
    console.log("Hello!");
  },
};
```

Here:

- `name` → Property
- `age` → Property
- `greet()` → Method

---

#### Why Do We Use Objects?

Objects solve the problem of managing related data.

Instead of:

```js
const name = "Vaibhav";
const age = 22;
const city = "Lucknow";
```

we write:

```js
const user = {
  name: "Vaibhav",
  age: 22,
  city: "Lucknow",
};
```

Now everything related to the user exists in one place.

This makes code:

- Easier to read.
- Easier to maintain.
- Easier to pass between functions.

---

#### Object Literals

The most common way to create an object is using an **Object Literal**.

Example:

```js
const company = {
  name: "Vaibhav Docs",
  founder: "Vaibhav",
};
```

This is concise, readable, and the preferred approach in modern JavaScript.

---

#### Using the `Object` Constructor

Objects can also be created using the `Object` constructor.

```js
const company = new Object();

company.name = "Vaibhav Docs";
company.founder = "Vaibhav";
```

This produces the same result.

However, it is more verbose and is rarely used in modern code.

---

#### Object Literal vs `Object` Constructor

Both create objects.

However:

| Object Literal | `Object` Constructor |
|----------------|----------------------|
| Short and readable | More verbose |
| Most commonly used | Rarely used |
| Preferred in modern JavaScript | Mostly for learning or special cases |

For almost all applications, object literals are the recommended choice.

---

#### Properties

Properties represent an object's data.

Example:

```js
const company = {
  name: "Vaibhav Docs",
  employees: 10,
};
```

Here:

```text
name
↓

"Vaibhav Docs"

-------------------

employees

↓

10
```

Each property consists of:

```text
Key

↓

Value
```

---

#### Methods

A method is simply a function stored inside an object.

Example:

```js
const company = {
  name: "Vaibhav Docs",

  introduce() {
    console.log(
      `Welcome to ${this.name}`
    );
  },
};
```

Calling:

```js
company.introduce();
```

Output:

```text
Welcome to Vaibhav Docs
```

Methods allow objects to perform actions, not just store data.

---

#### Objects Can Store Different Data Types

An object's values don't have to be the same type.

Example:

```js
const company = {
  name: "Vaibhav Docs",
  founded: 2025,
  active: true,
  technologies: [
    "React",
    "Node.js",
  ],

  greet() {
    console.log("Hello");
  },
};
```

Objects can contain:

- Strings
- Numbers
- Booleans
- Arrays
- Functions
- Other Objects

This flexibility makes objects extremely powerful.

---

#### Objects Can Contain Other Objects

Objects can be nested.

Example:

```js
const company = {
  name: "Vaibhav Docs",

  address: {
    city: "Lucknow",
    country: "India",
  },
};
```

Nested objects help model complex real-world data.

---

#### Why Are Objects So Important?

Objects are the foundation of JavaScript.

Many JavaScript features are actually objects behind the scenes.

Examples include:

- Arrays
- Functions
- Dates
- Errors
- DOM Elements

Learning objects thoroughly makes learning advanced JavaScript much easier.

---

> 💡 **Coming Next**
>
> In the next topic, we'll learn how to access, update, delete, and check object properties using **Dot Notation**, **Bracket Notation**, and other useful techniques.

---

### 💻 Example

We'll use the following object throughout this chapter.

```js
const company = {
  name: "Vaibhav Docs",
  founder: "Vaibhav",
  employees: 10,

  greet() {
    console.log(
      `Welcome to ${this.name}`
    );
  },
};

console.log(company.name);

company.greet();
```

Output:

```text
Vaibhav Docs

Welcome to Vaibhav Docs
```

This example demonstrates:

- Object creation.
- Properties.
- Methods.

---

### 📊 Diagram / Flow

#### Object Structure

```text
company

│

├── name

│     ↓

│  "Vaibhav Docs"

│

├── founder

│     ↓

│  "Vaibhav"

│

├── employees

│     ↓

│  10

│

└── greet()

      ↓

   Function
```

---

#### Property

```text
Key

↓

Value
```

---

#### Method

```text
Object

↓

Method

↓

Function Executes
```

---

#### Nested Object

```text
company

│

└── address

      │

      ├── city

      └── country
```

---

### 🌍 Real-World Example

Imagine a company's employee record.

Instead of storing each detail separately:

```text
Name

Age

Department

Salary
```

the HR department keeps everything together in one employee file.

```text
Employee File

│

├── Name

├── Age

├── Department

└── Salary
```

Whenever information about that employee is needed, the company simply opens one file instead of searching through multiple documents.

JavaScript objects work in the same way.

They group related information and behavior into a single structure, making programs easier to organize and maintain.

---

### 🎤 Interview Answer

An **Object** in JavaScript is a collection of key-value pairs used to group related data and behavior. The values stored in an object are called **properties**, while functions stored inside an object are called **methods**. The most common way to create an object is using an **Object Literal**, although the `Object` constructor can also be used. Objects are essential because they allow us to model real-world entities, organize related information, and build complex applications. In JavaScript, many built-in features such as arrays, functions, and DOM elements are also based on objects.

---

### ❓ Follow-up Questions

1. What is the difference between a property and a method?
2. Why are object literals preferred over the `Object` constructor?
3. Can an object contain another object?
4. Can objects store different data types?
5. Why are objects considered the foundation of JavaScript?
6. How do objects help model real-world entities?

---

## 2. Working with Object Properties

### 📖 Overview

An object becomes useful only when we can interact with its properties.

In JavaScript, we can:

- Access properties.
- Add new properties.
- Update existing properties.
- Delete properties.
- Check whether a property exists.

JavaScript provides two ways to access properties:

- **Dot Notation (`.`)**
- **Bracket Notation (`[]`)**

Understanding when to use each approach is an essential JavaScript skill and a common interview topic.

---

### ⚙️ Main Explanation

#### Accessing Properties Using Dot Notation

Dot Notation is the simplest and most commonly used way to access object properties.

Example:

```js
const company = {
  name: "Vaibhav Docs",
  founder: "Vaibhav",
};

console.log(company.name);
```

Output:

```text
Vaibhav Docs
```

Here:

```text
company

↓

name

↓

"Vaibhav Docs"
```

Dot Notation is preferred when the property name is known in advance and is a valid JavaScript identifier.

---

#### Accessing Properties Using Bracket Notation

Bracket Notation accesses properties using a string or an expression.

Example:

```js
const company = {
  name: "Vaibhav Docs",
};

console.log(
  company["name"]
);
```

Output:

```text
Vaibhav Docs
```

This produces the same result as Dot Notation.

---

#### When Should You Use Bracket Notation?

Bracket Notation is required when the property name:

- Is stored in a variable.
- Contains spaces.
- Contains special characters.
- Is computed dynamically.

Example:

```js
const property = "name";

console.log(
  company[property]
);
```

Output:

```text
Vaibhav Docs
```

Dot Notation would incorrectly look for a property literally named `property`.

---

Example with spaces:

```js
const company = {
  "company name":
    "Vaibhav Docs",
};

console.log(
  company["company name"]
);
```

Dot Notation cannot be used here because the property name contains a space.

---

#### Dot Notation vs Bracket Notation

| Dot Notation | Bracket Notation |
|---------------|------------------|
| `obj.name` | `obj["name"]` |
| Easier to read | More flexible |
| Property name must be known | Property name can be dynamic |
| Cannot access keys with spaces | Can access any valid property name |

Use Dot Notation by default and Bracket Notation whenever dynamic property access is required.

---

#### Adding New Properties

New properties can be added simply by assigning a value.

```js
const company = {
  name: "Vaibhav Docs",
};

company.employees = 10;
```

The object becomes:

```js
{
  name: "Vaibhav Docs",
  employees: 10
}
```

The property is created automatically if it doesn't already exist.

---

#### Updating Existing Properties

Updating a property works exactly like assignment.

```js
company.employees = 25;
```

Now:

```text
employees

↓

25
```

The old value is replaced.

---

#### Deleting Properties

Properties can be removed using the `delete` operator.

```js
delete company.employees;
```

After deletion:

```js
{
  name: "Vaibhav Docs"
}
```

The property no longer exists.

---

#### Checking Whether a Property Exists

JavaScript provides multiple ways to check for properties.

##### Using `Object.hasOwn()`

```js
Object.hasOwn(
  company,
  "name"
);
```

Output:

```text
true
```

`Object.hasOwn()` checks only the object's **own properties**.

---

##### Using the `in` Operator

```js
"name" in company;
```

Output:

```text
true
```

Unlike `Object.hasOwn()`, the `in` operator also checks inherited properties.

We'll understand inherited properties shortly.

---

#### Own Properties vs Inherited Properties

Every object has its own properties.

```js
const company = {
  name: "Vaibhav Docs",
};
```

Here:

```text
name
```

is an **own property**.

JavaScript objects can also inherit properties through the prototype chain.

Conceptually:

```text
company

│

├── Own Properties

│     ↓

│   name

│

└── Prototype

      ↓

Inherited Properties
```

Because of this difference:

```js
Object.hasOwn(
  company,
  "name"
);
```

checks only the first level.

While:

```js
"name" in company;
```

checks both the object and its prototype chain.

> 💡 **Coming Next**
>
> We'll explore prototypes and inheritance in detail in the **Prototypes & Inheritance** chapter.

---

#### Computed Property Names

Sometimes the property name is generated dynamically.

Example:

```js
const key = "employees";

const company = {
  [key]: 10,
};

console.log(
  company.employees
);
```

Output:

```text
10
```

The expression inside `[]` is evaluated first, and its result becomes the property name.

Computed property names are useful when object keys depend on variables or expressions.

---

#### `Object.hasOwn()` vs `hasOwnProperty()`

Older JavaScript code commonly uses:

```js
company.hasOwnProperty(
  "name"
);
```

Modern JavaScript introduced:

```js
Object.hasOwn(
  company,
  "name"
);
```

`Object.hasOwn()` is generally preferred because it works reliably even if an object defines its own `hasOwnProperty` property.

---

#### Best Practices

When working with object properties:

- Prefer Dot Notation for known property names.
- Use Bracket Notation for dynamic or special property names.
- Use `Object.hasOwn()` to check an object's own properties.
- Use the `in` operator when inherited properties should also be considered.
- Use computed property names when keys are determined dynamically.

---

### 💻 Example

We'll continue using our running example.

```js
const company = {
  name: "Vaibhav Docs",
};

company.founder = "Vaibhav";

console.log(company.name);

console.log(
  company["founder"]
);

console.log(
  Object.hasOwn(
    company,
    "name"
  )
);

delete company.founder;
```

Output:

```text
Vaibhav Docs

Vaibhav

true
```

This example demonstrates:

- Dot Notation.
- Bracket Notation.
- Adding properties.
- Checking properties.
- Deleting properties.

---

### 📊 Diagram / Flow

#### Object Properties

```text
company

│

├── name

├── founder

└── employees
```

---

#### Property Access

```text
Object

↓

Dot Notation

or

Bracket Notation
```

---

#### Property Lookup

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

Check Prototype
```

---

#### Computed Property

```text
Variable

↓

Evaluate

↓

Property Name
```

---

### 🌍 Real-World Example

Imagine a company employee directory.

If you know an employee's ID, you can directly open their file.

```text
Employee ID

↓

Employee File
```

This is similar to **Dot Notation**.

Now imagine you're searching using different criteria, such as department, city, or employee number entered by a user.

```text
Search Input

↓

Determine Field

↓

Find Employee
```

This is similar to **Bracket Notation**, where the property name is determined dynamically.

Dot Notation is ideal when you already know the field, while Bracket Notation is useful when the field depends on user input or runtime values.

---

### 🎤 Interview Answer

JavaScript provides two ways to access object properties: **Dot Notation** and **Bracket Notation**. Dot Notation is the preferred approach when the property name is known and is a valid identifier, while Bracket Notation is required for dynamic property names, keys with spaces, or computed expressions. Properties can be added or updated using assignment, deleted using the `delete` operator, and checked using either `Object.hasOwn()` or the `in` operator. `Object.hasOwn()` checks only an object's own properties, whereas the `in` operator also considers inherited properties from the prototype chain.

---

### ❓ Follow-up Questions

1. What is the difference between Dot Notation and Bracket Notation?
2. When should you use Bracket Notation instead of Dot Notation?
3. What is the difference between `Object.hasOwn()` and the `in` operator?
4. What are own properties and inherited properties?
5. What are computed property names, and when are they useful?
6. Why is `Object.hasOwn()` preferred over `hasOwnProperty()` in modern JavaScript?

---

## 3. Object Destructuring

### 📖 Overview

When working with objects, we often need only a few properties instead of the entire object.

Without destructuring, we have to access each property individually.

```js
const company = {
  name: "Vaibhav Docs",
  founder: "Vaibhav",
};

const name = company.name;
const founder = company.founder;
```

Object **Destructuring** provides a shorter and more readable way to extract properties from an object.

```js
const { name, founder } = company;
```

Destructuring is one of the most commonly used ES6 features and is widely used in modern JavaScript, React, and Node.js applications.

---

### ⚙️ Main Explanation

#### What is Object Destructuring?

Object Destructuring is a syntax that extracts properties from an object and stores them in variables.

Example:

```js
const company = {
  name: "Vaibhav Docs",
  founder: "Vaibhav",
};

const { name, founder } =
  company;

console.log(name);

console.log(founder);
```

Output:

```text
Vaibhav Docs

Vaibhav
```

Instead of writing multiple property accesses, JavaScript creates the variables directly.

---

#### How Does Object Destructuring Work?

Conceptually:

```text
Object

↓

Read Property

↓

Create Variable

↓

Assign Value
```

When JavaScript sees:

```js
const { name } = company;
```

it behaves similarly to:

```js
const name = company.name;
```

The destructuring syntax is simply a shorter and cleaner way to achieve the same result.

---

#### Renaming Variables

Sometimes you want the variable name to be different from the property name.

Example:

```js
const company = {
  name: "Vaibhav Docs",
};

const {
  name: companyName,
} = company;

console.log(companyName);
```

Output:

```text
Vaibhav Docs
```

Here:

```text
Property

↓

name

↓

Variable

↓

companyName
```

The original property name remains unchanged.

---

#### Providing Default Values

A property may not always exist.

Instead of getting `undefined`, you can provide a default value.

Example:

```js
const company = {
  name: "Vaibhav Docs",
};

const {
  employees = 0,
} = company;

console.log(employees);
```

Output:

```text
0
```

Since the property doesn't exist, JavaScript uses the default value.

If the property exists, the actual value is used instead.

---

#### Nested Object Destructuring

Objects often contain other objects.

Example:

```js
const company = {
  name: "Vaibhav Docs",

  address: {
    city: "Lucknow",
    country: "India",
  },
};

const {
  address: { city },
} = company;

console.log(city);
```

Output:

```text
Lucknow
```

JavaScript can extract properties from nested objects using the same destructuring syntax.

---

#### Combining Renaming and Default Values

You can combine multiple destructuring features.

Example:

```js
const company = {
  name: "Vaibhav Docs",
};

const {
  name: companyName,
  employees = 0,
} = company;

console.log(companyName);

console.log(employees);
```

Output:

```text
Vaibhav Docs

0
```

This is commonly used in real-world applications.

---

#### Why is Destructuring Useful?

Destructuring makes code:

- Shorter.
- More readable.
- Easier to maintain.

It is especially useful when working with:

- Function parameters.
- API responses.
- React props.
- Configuration objects.

Example:

```js
function printCompany({
  name,
  founder,
}) {
  console.log(name);

  console.log(founder);
}
```

Instead of accessing properties one by one inside the function, destructuring extracts them immediately.

---

#### Common Pattern in React

React components frequently use object destructuring.

Example:

```jsx
function Card({
  title,
  price,
}) {
  return (
    <h2>{title}</h2>
  );
}
```

This makes component code much cleaner.

> 💡 **Coming Next**
>
> We'll explore React-specific patterns, including props destructuring, in the **React** documentation.

---

#### Best Practices

When using object destructuring:

- Use it when you need only a few properties.
- Rename variables when property names are unclear or conflict with existing variables.
- Provide default values for optional properties.
- Avoid deeply nested destructuring if it reduces readability.

---

### 💻 Example

We'll continue using our running example.

```js
const company = {
  name: "Vaibhav Docs",
  founder: "Vaibhav",

  address: {
    city: "Lucknow",
  },
};

const {
  name,
  founder,
  address: { city },
  employees = 10,
} = company;

console.log(name);

console.log(founder);

console.log(city);

console.log(employees);
```

Output:

```text
Vaibhav Docs

Vaibhav

Lucknow

10
```

This example demonstrates:

- Basic destructuring.
- Nested destructuring.
- Default values.

---

### 📊 Diagram / Flow

#### Basic Destructuring

```text
Object

↓

Property

↓

Variable
```

---

#### Renaming

```text
Property

↓

name

↓

companyName
```

---

#### Default Value

```text
Property Exists?

│

├── Yes

│     ↓

│ Use Value

│

└── No

      ↓

Use Default
```

---

#### Nested Destructuring

```text
company

│

└── address

      │

      └── city

            ↓

         Variable
```

---

### 🌍 Real-World Example

Imagine receiving a company registration form.

The form contains many details.

```text
Company Form

│

├── Name

├── Founder

├── Address

├── Phone

├── Email

└── Website
```

If you only need the company name and founder, you don't copy the entire form—you extract only the required fields.

```text
Company Form

↓

Name

Founder
```

Object Destructuring works in the same way.

It allows you to extract only the properties you need while leaving the original object unchanged.

---

### 🎤 Interview Answer

Object Destructuring is an ES6 feature that extracts properties from an object into variables using a concise syntax. It simplifies code by avoiding repeated property access. JavaScript also supports renaming variables, providing default values, and extracting properties from nested objects during destructuring. This feature is widely used in modern JavaScript, especially when working with function parameters, API responses, configuration objects, and React props, because it improves readability and reduces boilerplate code.

---

### ❓ Follow-up Questions

1. What is Object Destructuring?
2. How does Object Destructuring work internally?
3. How do you rename variables during destructuring?
4. How do default values work in destructuring?
5. What is nested Object Destructuring?
6. Why is Object Destructuring commonly used in React?

---

## 4. Object Copying and Immutability

### 📖 Overview

One of the most important concepts when working with objects is understanding **how copying works**.

Many developers assume that assigning one object to another creates a new object.

```js
const user1 = {
  name: "Vaibhav",
};

const user2 = user1;
```

However, this **does not create a copy**.

Both variables now point to the **same object in memory**.

Because of this, changing one variable also changes the other.

Understanding the difference between **assignment**, **shallow copy**, **deep copy**, and **immutability** is essential for writing bug-free JavaScript, especially in React applications.

---

### ⚙️ Main Explanation

#### Assignment vs Copying

When an object is assigned to another variable, JavaScript copies **the reference**, not the object itself.

Example:

```js
const company1 = {
  name: "Vaibhav Docs",
};

const company2 =
  company1;

company2.name =
  "OpenAI";

console.log(company1.name);
```

Output:

```text
OpenAI
```

Why?

Because both variables point to the same object.

```text
company1

      │

      ▼

    Object

      ▲

      │

company2
```

This is called **reference assignment**.

---

#### What is a Shallow Copy?

A **shallow copy** creates a **new top-level object**, but nested objects are still shared.

Example:

```js
const company1 = {
  name: "Vaibhav Docs",

  address: {
    city: "Lucknow",
  },
};

const company2 = {
  ...company1,
};

company2.name =
  "OpenAI";

console.log(company1.name);
```

Output:

```text
Vaibhav Docs
```

The top-level object is copied.

However:

```js
company2.address.city =
  "Delhi";
```

also changes:

```js
company1.address.city;
```

because the nested object is still shared.

---

#### What is a Deep Copy?

A **deep copy** creates an entirely independent object, including all nested objects.

Example:

```js
const company2 =
  structuredClone(
    company1
  );
```

Now:

```js
company2.address.city =
  "Delhi";
```

does **not** affect:

```js
company1.address.city;
```

Every nested object is copied separately.

---

#### Using the Spread Operator

The Spread Operator is the most common way to create a shallow copy.

```js
const company2 = {
  ...company1,
};
```

This copies:

- Properties
- Primitive values

but **does not deep copy nested objects**.

---

#### Using `Object.assign()`

Another way to create a shallow copy is:

```js
const company2 =
  Object.assign(
    {},
    company1
  );
```

This produces the same behavior as the Spread Operator.

Like spread, it copies only the first level.

---

#### Spread Operator vs `Object.assign()`

| Spread Operator | `Object.assign()` |
|----------------|-------------------|
| Modern syntax | Older syntax |
| Returns a new object | Copies into a target object |
| Shallow copy | Shallow copy |
| Easier to read | Useful when merging into an existing object |

Both create **shallow copies**.

---

#### Limitations of `Object.assign()`

Since it performs a shallow copy:

```js
const company2 =
  Object.assign(
    {},
    company1
  );

company2.address.city =
  "Delhi";
```

also changes:

```js
company1.address.city;
```

Nested objects remain shared.

---

#### `structuredClone()`

Modern JavaScript provides:

```js
structuredClone();
```

Example:

```js
const company2 =
  structuredClone(
    company1
  );
```

It performs a true **deep copy** of supported data types.

This is the recommended built-in solution for deep cloning.

---

#### Why Isn't `JSON.parse(JSON.stringify())` a Perfect Solution?

A common technique is:

```js
const copy =
  JSON.parse(
    JSON.stringify(
      company1
    )
  );
```

Although it creates a deep copy for simple objects, it has several limitations.

It **does not preserve**:

- Functions
- `Date`
- `Map`
- `Set`
- `undefined`
- `Symbol`
- Circular references

Because of these limitations, `structuredClone()` is generally a better choice.

---

#### What is Immutability?

Immutability means **not modifying an existing object**.

Instead of:

```js
user.name = "OpenAI";
```

create a new object.

```js
const updatedUser = {
  ...user,
  name: "OpenAI",
};
```

This keeps the original object unchanged.

---

#### Why is Immutability Important?

Immutability makes applications:

- Easier to debug.
- Easier to test.
- More predictable.

It is especially important in libraries such as **React**, where change detection often relies on object references.

Instead of modifying existing objects, React applications usually create new ones.

---

#### Merging Multiple Objects

Objects can be merged while preserving immutability.

Example:

```js
const merged = {
  ...user,
  ...address,
};
```

or

```js
Object.assign(
  {},
  user,
  address
);
```

Both create a new object without modifying the originals.

---

#### Best Practices

When copying objects:

- Remember that assignment copies references, not objects.
- Use the Spread Operator for shallow copies.
- Use `structuredClone()` for deep copies when supported.
- Avoid `JSON.parse(JSON.stringify())` unless working with simple JSON-compatible data.
- Prefer immutable updates instead of modifying existing objects.

---

### 💻 Example

We'll continue using our running example.

```js
const company = {
  name: "Vaibhav Docs",

  address: {
    city: "Lucknow",
  },
};

const copy = {
  ...company,
};

copy.name =
  "OpenAI";

copy.address.city =
  "Delhi";

console.log(company.name);

console.log(
  company.address.city
);
```

Output:

```text
Vaibhav Docs

Delhi
```

The top-level property is copied, but the nested object is shared because the Spread Operator performs a shallow copy.

---

### 📊 Diagram / Flow

#### Assignment

```text
company1

      │

      ▼

    Object

      ▲

      │

company2
```

---

#### Shallow Copy

```text
New Object

│

├── Primitive

│     ✓ Copied

│

└── Nested Object

      ↓

Shared Reference
```

---

#### Deep Copy

```text
New Object

│

├── Primitive

│     ✓ Copied

│

└── Nested Object

      ↓

New Copy
```

---

#### Immutable Update

```text
Old Object

↓

Create New Object

↓

Update Property

↓

Original Unchanged
```

---

### 🌍 Real-World Example

Imagine you have an important document.

If two employees share **the same original document**, any changes made by one employee immediately affect the other.

```text
Employee A

      │

      ▼

Original Document

      ▲

      │

Employee B
```

This is like **object assignment**, where both variables reference the same object.

Now imagine each employee receives **their own photocopy**.

```text
Original

↓

Photocopy A

↓

Photocopy B
```

Each person can edit their copy without affecting the others.

A **shallow copy** is like copying only the first page while sharing all attached documents.

A **deep copy** is like photocopying the entire folder, including every attached document.

---

### 🎤 Interview Answer

Assigning one object variable to another copies only the **reference**, not the object itself, so both variables point to the same object in memory. To create a new object, JavaScript provides shallow copy techniques such as the **Spread Operator** and **`Object.assign()`**, but these copy only the first level, leaving nested objects shared. A **deep copy** duplicates the entire object hierarchy, and the recommended built-in approach is **`structuredClone()`**. Immutability means creating new objects instead of modifying existing ones, which makes applications more predictable and is especially important in React state management.

---

### ❓ Follow-up Questions

1. What is the difference between assigning an object and copying an object?
2. What is a shallow copy?
3. What is a deep copy?
4. What is the difference between the Spread Operator and `Object.assign()`?
5. Why isn't `JSON.parse(JSON.stringify())` a perfect deep copy solution?
6. Why is immutability important in React applications?

---

## 5. Object Mutability and Memory

### 📖 Overview

To truly understand JavaScript objects, it's important to know **how they are stored in memory**.

Many interview questions such as:

- Why do changes in one object affect another?
- Why are objects stored by reference?
- What is object identity?
- Why are objects mutable?
- How does React detect object changes?

all depend on understanding JavaScript's memory model.

Unlike primitive values, objects are stored in **Heap Memory**, and variables hold only a **reference (memory address)** to those objects.

This is one of the most fundamental concepts in JavaScript.

---

### ⚙️ Main Explanation

#### How Are Objects Stored in Memory?

Objects are stored in the **Heap Memory**.

When an object is created:

```js
const company = {
  name: "Vaibhav Docs",
};
```

JavaScript allocates memory for the object in the Heap.

The variable itself doesn't store the object.

Instead, it stores a **reference (memory address)** pointing to that object.

Conceptually:

```text
Stack

company

↓

Reference

↓

Heap

{

name: "Vaibhav Docs"

}
```

---

#### Why Are Objects Stored by Reference?

Objects can be:

- Large
- Nested
- Complex

Copying the entire object every time it is assigned would be inefficient.

Instead, JavaScript copies only the reference.

Example:

```js
const company1 = {
  name: "Vaibhav Docs",
};

const company2 =
  company1;
```

Memory:

```text
company1

      │

      ▼

     Heap Object

      ▲

      │

company2
```

Both variables point to the same object.

This makes assignments fast and memory-efficient.

---

#### What Happens When Two Variables Reference the Same Object?

Consider:

```js
const company1 = {
  employees: 10,
};

const company2 =
  company1;

company2.employees =
  25;

console.log(
  company1.employees
);
```

Output:

```text
25
```

Why?

There is only **one object** in memory.

Both variables reference the same object, so modifying it through one variable affects the other.

---

#### What is Object Identity?

Every object has a unique identity.

Even if two objects contain exactly the same data, they are still different objects.

Example:

```js
const user1 = {
  name: "Vaibhav",
};

const user2 = {
  name: "Vaibhav",
};
```

Although both objects have identical values:

```js
user1 === user2;
```

Output:

```text
false
```

because they occupy different locations in memory.

Object identity depends on the **reference**, not the content.

---

#### Reference Equality vs Value Equality

For objects:

```js
const obj1 = {
  name: "A",
};

const obj2 = {
  name: "A",
};

console.log(
  obj1 === obj2
);
```

Output:

```text
false
```

JavaScript compares references.

Now consider:

```js
const obj3 = obj1;

console.log(
  obj1 === obj3
);
```

Output:

```text
true
```

because both variables reference the same object.

---

#### What is Object Mutability?

Objects are **mutable**.

This means their properties can be changed after creation.

Example:

```js
const company = {
  name: "Vaibhav Docs",
};

company.name =
  "OpenAI";
```

The object itself remains the same object.

Only one of its properties changes.

---

#### Why Are Objects Mutable but Primitives Immutable?

Primitive values represent the actual value.

Example:

```js
let age = 20;

age = 21;
```

The old value isn't modified.

Instead, a new value replaces it.

Objects behave differently.

```js
const company = {
  employees: 10,
};

company.employees =
  20;
```

The existing object is modified directly.

This is possible because variables hold references to mutable objects.

---

#### How Does React Use Object References?

React often detects changes using **reference equality**.

Suppose we modify an object directly.

```js
user.name =
  "OpenAI";
```

The reference remains the same.

React may assume nothing changed.

Instead:

```js
const updatedUser = {
  ...user,
  name: "OpenAI",
};
```

creates a **new object**.

Now:

```text
Old Reference

↓

New Reference
```

React can easily detect the update.

---

#### Comparing Two Objects

Using:

```js
obj1 === obj2;
```

compares **references**, not values.

If you need to compare contents:

- Compare individual properties.
- Use a deep comparison utility.
- Use specialized libraries when necessary.

JavaScript does not provide built-in deep equality for objects.

---

#### Common Shared Reference Bug

Example:

```js
const settings = {
  theme: "dark",
};

const backup =
  settings;

backup.theme =
  "light";
```

Many developers expect:

```text
settings.theme

↓

dark
```

Actual result:

```text
light
```

because both variables reference the same object.

This is one of the most common JavaScript bugs.

---

#### Best Practices

When working with objects:

- Remember that variables store references, not objects.
- Avoid modifying shared objects unintentionally.
- Prefer immutable updates in React applications.
- Don't compare objects using `===` unless reference equality is intended.
- Use deep cloning or immutable patterns when independent copies are required.

---

### 💻 Example

We'll continue using our running example.

```js
const company1 = {
  name: "Vaibhav Docs",
};

const company2 =
  company1;

company2.name =
  "OpenAI";

console.log(
  company1.name
);

console.log(
  company1 === company2
);
```

Output:

```text
OpenAI

true
```

Both variables reference the same object in memory.

---

### 📊 Diagram / Flow

#### Memory Layout

```text
Stack

company

↓

Reference

↓

Heap

Object
```

---

#### Shared Reference

```text
company1

      │

      ▼

     Object

      ▲

      │

company2
```

---

#### Object Identity

```text
Object A

↓

Reference A

-------------------

Object B

↓

Reference B
```

---

#### React Update

```text
Old Object

↓

Create New Object

↓

New Reference

↓

React Detects Change
```

---

### 🌍 Real-World Example

Imagine a company stores its employee database on a central server.

Each department has a shortcut pointing to the same database.

```text
HR

      │

Finance

      │

Sales

      ▼

Employee Database
```

If HR updates an employee's salary, Finance immediately sees the updated value because everyone is using the same database.

This is similar to multiple JavaScript variables referencing the same object.

Creating a new object is like creating an entirely separate copy of the database, allowing changes without affecting the original.

---

### 🎤 Interview Answer

JavaScript stores objects in **Heap Memory**, while variables store only references to those objects. Assigning one object variable to another copies the reference rather than the object itself, allowing multiple variables to point to the same object. Objects are mutable, meaning their properties can be changed after creation, whereas primitive values are immutable because variables store the values directly. Object equality is based on **reference equality**, not value equality, which is why two objects with identical contents are still considered different if they occupy different memory locations. This reference-based model is also why immutable updates are important in frameworks like React.

---

### ❓ Follow-up Questions

1. Why are objects stored by reference?
2. Why are objects stored in Heap Memory?
3. What is object identity?
4. What is the difference between reference equality and value equality?
5. Why are objects mutable while primitive values are immutable?
6. Why are immutable object updates important in React?

---

## 6. Object Property Configuration

### 📖 Overview

Every property in a JavaScript object contains more information than just its value.

For example, consider this object:

```js
const user = {
  name: "Vaibhav",
};
```

At first glance, it looks like the property `name` only stores the string `"Vaibhav"`.

However, internally JavaScript stores additional metadata that controls **how the property behaves**.

This metadata is called a **Property Descriptor**.

Property descriptors determine:

- Whether the property's value can be changed.
- Whether the property appears during enumeration.
- Whether the property can be deleted or reconfigured.

Understanding property descriptors helps explain how methods like `Object.freeze()` and `Object.seal()` work internally.

---

### ⚙️ Main Explanation

#### What is a Property Descriptor?

Every object property has a descriptor associated with it.

A descriptor contains information about the property's behavior.

Example:

```js
const user = {
  name: "Vaibhav",
};

console.log(
  Object.getOwnPropertyDescriptor(
    user,
    "name"
  )
);
```

Output:

```js
{
  value: "Vaibhav",
  writable: true,
  enumerable: true,
  configurable: true
}
```

These attributes control what JavaScript allows you to do with the property.

---

#### Understanding the Descriptor Properties

A typical property descriptor contains four fields.

| Property | Purpose |
|----------|---------|
| `value` | The property's actual value |
| `writable` | Can the value be changed? |
| `enumerable` | Should the property appear in loops and `Object.keys()`? |
| `configurable` | Can the property be deleted or reconfigured? |

These are known as **data property descriptors**.

---

#### `writable`

The `writable` attribute determines whether a property's value can be modified.

Example:

```js
const user = {};

Object.defineProperty(
  user,
  "name",
  {
    value: "Vaibhav",
    writable: false,
  }
);

user.name = "OpenAI";

console.log(user.name);
```

Output:

```text
Vaibhav
```

Since `writable` is `false`, JavaScript doesn't allow the value to change.

---

#### `enumerable`

The `enumerable` attribute controls whether a property appears during property enumeration.

Example:

```js
const user = {};

Object.defineProperty(
  user,
  "name",
  {
    value: "Vaibhav",
    enumerable: false,
  }
);

console.log(
  Object.keys(user)
);
```

Output:

```text
[]
```

The property still exists.

It simply doesn't appear in operations that enumerate properties.

---

#### Property Enumeration

Enumeration means listing an object's properties.

Common enumeration methods include:

```js
Object.keys(obj);
```

```js
Object.values(obj);
```

```js
Object.entries(obj);
```

```js
for (const key in obj) {}
```

Only **enumerable** properties appear in these operations.

---

#### `configurable`

The `configurable` attribute determines whether a property can be:

- Deleted
- Reconfigured
- Modified using `Object.defineProperty()`

Example:

```js
const user = {};

Object.defineProperty(
  user,
  "name",
  {
    value: "Vaibhav",
    configurable: false,
  }
);

delete user.name;

console.log(user.name);
```

Output:

```text
Vaibhav
```

Since the property isn't configurable, it cannot be deleted.

---

#### Enumerable vs Non-Enumerable Properties

Consider:

```js
const user = {
  name: "Vaibhav",
};
```

By default:

```text
name

↓

Enumerable
```

Now create another property.

```js
Object.defineProperty(
  user,
  "id",
  {
    value: 101,
    enumerable: false,
  }
);
```

Running:

```js
Object.keys(user);
```

returns:

```text
["name"]
```

The `id` property exists but is hidden from enumeration.

---

#### Inspecting Property Descriptors

To inspect a property's configuration:

```js
Object.getOwnPropertyDescriptor(
  user,
  "name"
);
```

This is useful for debugging and understanding built-in objects.

---

#### Why Are Property Descriptors Useful?

Property descriptors allow developers to:

- Create read-only properties.
- Hide internal implementation details.
- Prevent accidental deletion.
- Control how objects behave during enumeration.

Many JavaScript libraries and frameworks use property descriptors internally to create safer APIs.

---

#### Relationship with `Object.freeze()` and `Object.seal()`

Methods like:

```js
Object.freeze();
```

and

```js
Object.seal();
```

internally modify property descriptors.

For example, `Object.freeze()` sets:

- `writable` → `false`
- `configurable` → `false`

We'll study these methods in detail in the next topic.

---

#### Best Practices

When working with property descriptors:

- Use default property behavior unless customization is necessary.
- Use `Object.defineProperty()` when creating read-only or hidden properties.
- Use `Object.getOwnPropertyDescriptor()` for debugging property behavior.
- Avoid making properties non-configurable unless you're certain they should never change.

---

### 💻 Example

We'll continue using our running example.

```js
const company = {
  name: "Vaibhav Docs",
};

console.log(
  Object.getOwnPropertyDescriptor(
    company,
    "name"
  )
);
```

Output:

```js
{
  value: "Vaibhav Docs",
  writable: true,
  enumerable: true,
  configurable: true
}
```

This output shows the complete configuration of the `name` property.

---

### 📊 Diagram / Flow

#### Property Descriptor

```text
Property

│

├── value

├── writable

├── enumerable

└── configurable
```

---

#### Enumeration

```text
Object

↓

Enumerable Properties

↓

Object.keys()
```

---

#### Writable

```text
Property

↓

writable?

│

├── true

│     ↓

│ Value Can Change

│

└── false

      ↓

Read-Only
```

---

#### Configurable

```text
Property

↓

configurable?

│

├── true

│     ↓

│ Delete Allowed

│

└── false

      ↓

Delete Blocked
```

---

### 🌍 Real-World Example

Imagine a company's employee records.

Each employee file contains not only employee information but also rules about how that information can be handled.

```text
Employee Record

│

├── Name

├── Salary

├── Editable?

├── Visible?

└── Removable?
```

Some fields, such as Employee ID, may be read-only.

Some internal notes may be hidden from general reports.

Some records cannot be deleted.

Property descriptors work similarly.

They don't store the actual business data—they define **how JavaScript is allowed to interact with that data**.

---

### 🎤 Interview Answer

Every property in a JavaScript object has an associated **Property Descriptor** that defines how the property behaves. A data property descriptor contains four main attributes: `value`, `writable`, `enumerable`, and `configurable`. The `writable` attribute controls whether the value can be changed, `enumerable` determines whether the property appears in operations like `Object.keys()`, and `configurable` specifies whether the property can be deleted or reconfigured. Property descriptors can be inspected using `Object.getOwnPropertyDescriptor()` and are used internally by methods such as `Object.freeze()` and `Object.seal()`.

---

### ❓ Follow-up Questions

1. What is a Property Descriptor?
2. What are `writable`, `enumerable`, and `configurable`?
3. What is property enumeration?
4. What is the difference between enumerable and non-enumerable properties?
5. What does `Object.getOwnPropertyDescriptor()` return?
6. How are property descriptors related to `Object.freeze()` and `Object.seal()`?

---

## 7. Object Protection with `Object.freeze()` and `Object.seal()`

### 📖 Overview

Sometimes we want to prevent an object from being modified.

For example:

- A configuration object should never change after initialization.
- Environment settings should remain constant.
- Application constants should be protected from accidental modification.

JavaScript provides two built-in methods for this purpose:

- **`Object.freeze()`**
- **`Object.seal()`**

Although both restrict object modifications, they behave differently.

Understanding the difference is a common JavaScript interview question.

---

### ⚙️ Main Explanation

#### Why Protect Objects?

Consider a configuration object.

```js
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};
```

If another developer accidentally changes it:

```js
config.timeout = 100;
```

the application may behave unexpectedly.

Protecting the object helps prevent such accidental changes.

---

#### What is `Object.freeze()`?

`Object.freeze()` makes an object **immutable at the first level**.

Example:

```js
const company = {
  name: "Vaibhav Docs",
};

Object.freeze(company);

company.name = "OpenAI";

console.log(company.name);
```

Output:

```text
Vaibhav Docs
```

The modification is ignored (or throws an error in strict mode).

---

#### What Does `Object.freeze()` Prevent?

After freezing an object:

- ✅ Reading properties is allowed.
- ❌ Adding new properties is not allowed.
- ❌ Updating existing properties is not allowed.
- ❌ Deleting properties is not allowed.

Conceptually:

```text
Freeze

↓

Read

↓

Allowed

-------------------

Write

↓

Blocked
```

---

#### Is a Frozen Object Completely Immutable?

Not always.

`Object.freeze()` is **shallow**.

Example:

```js
const company = {
  address: {
    city: "Lucknow",
  },
};

Object.freeze(company);

company.address.city =
  "Delhi";

console.log(
  company.address.city
);
```

Output:

```text
Delhi
```

The nested object wasn't frozen.

Only the top-level object was protected.

To deeply freeze an object, every nested object must also be frozen.

---

#### What is `Object.seal()`?

`Object.seal()` is less restrictive than `Object.freeze()`.

Example:

```js
const company = {
  name: "Vaibhav Docs",
};

Object.seal(company);

company.name = "OpenAI";

console.log(company.name);
```

Output:

```text
OpenAI
```

Updating existing properties is allowed.

---

#### What Does `Object.seal()` Prevent?

After sealing an object:

- ✅ Reading properties is allowed.
- ✅ Updating existing properties is allowed.
- ❌ Adding new properties is not allowed.
- ❌ Deleting properties is not allowed.

Conceptually:

```text
Seal

↓

Read

↓

Allowed

↓

Update

↓

Allowed

↓

Add/Delete

↓

Blocked
```

---

#### `Object.freeze()` vs `Object.seal()`

| Feature | `Object.freeze()` | `Object.seal()` |
|----------|-------------------|-----------------|
| Read properties | ✅ | ✅ |
| Update existing properties | ❌ | ✅ |
| Add new properties | ❌ | ❌ |
| Delete properties | ❌ | ❌ |
| Reconfigure properties | ❌ | ❌ |

The main difference is that **frozen objects cannot have existing values changed**, while **sealed objects can**.

---

#### How Do These Methods Work Internally?

These methods modify the property's **descriptors**.

`Object.freeze()` sets:

```text
writable

↓

false

configurable

↓

false
```

`Object.seal()` sets:

```text
configurable

↓

false
```

but leaves:

```text
writable

↓

true
```

This is why frozen objects cannot be updated, while sealed objects can.

---

#### Preventing Accidental Modification

Configuration objects are a common use case.

Example:

```js
const config = {
  apiUrl: "...",
};

Object.freeze(config);
```

Now no developer can accidentally overwrite important configuration values.

---

#### When Should You Use Each?

Use **`Object.freeze()`** when:

- Configuration should never change.
- Constants should remain fixed.
- Objects should become read-only.

Use **`Object.seal()`** when:

- Existing values may change.
- Object structure should remain fixed.
- New properties should not be introduced.

---

#### Best Practices

When protecting objects:

- Use `Object.freeze()` for constants and configuration.
- Use `Object.seal()` when the object's structure should stay fixed but values may change.
- Remember that both methods are shallow.
- Freeze nested objects separately if deep immutability is required.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore commonly used **Object methods** such as `Object.keys()`, `Object.values()`, `Object.entries()`, and `Object.fromEntries()`.

---

### 💻 Example

We'll continue using our running example.

```js
const company = {
  name: "Vaibhav Docs",
};

Object.freeze(company);

company.name = "OpenAI";

company.owner = "Vaibhav";

delete company.name;

console.log(company);
```

Output:

```js
{
  name: "Vaibhav Docs"
}
```

None of the modification attempts succeed.

---

### 📊 Diagram / Flow

#### `Object.freeze()`

```text
Object

↓

Freeze

↓

Read ✓

Update ✗

Add ✗

Delete ✗
```

---

#### `Object.seal()`

```text
Object

↓

Seal

↓

Read ✓

Update ✓

Add ✗

Delete ✗
```

---

#### Shallow Protection

```text
Object

│

├── Top Level

│     ↓

│ Protected

│

└── Nested Object

      ↓

Still Mutable
```

---

#### Internal Descriptor Changes

```text
freeze()

↓

writable = false

configurable = false

-------------------

seal()

↓

configurable = false
```

---

### 🌍 Real-World Example

Imagine an office building.

A **sealed room** can still have its furniture rearranged, but no new furniture can be brought in, and nothing can be removed.

```text
Room

↓

Move Existing Furniture ✓

Add Furniture ✗

Remove Furniture ✗
```

A **frozen room**, however, cannot be changed at all.

```text
Room

↓

Move Furniture ✗

Add Furniture ✗

Remove Furniture ✗
```

`Object.seal()` is like sealing the room's layout, while `Object.freeze()` is like locking everything permanently in place.

---

### 🎤 Interview Answer

`Object.freeze()` and `Object.seal()` are used to protect objects from modification. `Object.freeze()` makes an object read-only by preventing the addition, deletion, or modification of properties, whereas `Object.seal()` prevents adding or deleting properties but still allows updating existing property values. Both methods are **shallow**, meaning they protect only the top-level object and not nested objects. Internally, these methods work by modifying property descriptors such as `writable` and `configurable`.

---

### ❓ Follow-up Questions

1. What is the difference between `Object.freeze()` and `Object.seal()`?
2. Can a frozen object be modified?
3. Can a sealed object be modified?
4. Why are `Object.freeze()` and `Object.seal()` considered shallow?
5. When should you use `Object.freeze()` instead of `Object.seal()`?
6. How do these methods work internally using property descriptors?

---

## 8. Useful Object Methods

### 📖 Overview

JavaScript provides several built-in methods for working with objects.

These methods allow us to:

- Retrieve object keys.
- Retrieve object values.
- Convert objects into arrays.
- Convert arrays back into objects.
- Merge objects.
- Check object properties.

These utility methods are used frequently in modern JavaScript, especially when working with APIs, React, Node.js, and data transformation.

---

### ⚙️ Main Explanation

#### `Object.keys()`

`Object.keys()` returns an array containing an object's **own enumerable property names**.

Example:

```js
const company = {
  name: "Vaibhav Docs",
  employees: 10,
};

console.log(
  Object.keys(company)
);
```

Output:

```js
["name", "employees"]
```

This method is commonly used when you need to iterate over property names.

---

#### `Object.values()`

`Object.values()` returns an array of an object's **own enumerable property values**.

Example:

```js
console.log(
  Object.values(company)
);
```

Output:

```js
["Vaibhav Docs", 10]
```

This is useful when only the values are required.

---

#### `Object.entries()`

`Object.entries()` returns an array of **key-value pairs**.

Example:

```js
console.log(
  Object.entries(company)
);
```

Output:

```js
[
  ["name", "Vaibhav Docs"],
  ["employees", 10],
]
```

Each element is itself an array containing:

```text
[key, value]
```

This format works well with loops and array methods.

---

#### Iterating with `Object.entries()`

Example:

```js
for (const [
  key,
  value,
] of Object.entries(company)) {
  console.log(key, value);
}
```

Output:

```text
name Vaibhav Docs

employees 10
```

This is often cleaner than iterating over keys and then accessing values separately.

---

#### `Object.fromEntries()`

`Object.fromEntries()` performs the reverse operation of `Object.entries()`.

It converts an array of key-value pairs back into an object.

Example:

```js
const entries = [
  ["name", "Vaibhav Docs"],
  ["employees", 10],
];

const company =
  Object.fromEntries(entries);

console.log(company);
```

Output:

```js
{
  name: "Vaibhav Docs",
  employees: 10
}
```

This is useful after transforming data using array methods.

---

#### `Object.assign()`

`Object.assign()` copies properties from one or more source objects into a target object.

Example:

```js
const company = {
  name: "Vaibhav Docs",
};

const details = {
  employees: 10,
};

const result =
  Object.assign(
    {},
    company,
    details
  );

console.log(result);
```

Output:

```js
{
  name: "Vaibhav Docs",
  employees: 10
}
```

It is commonly used for merging objects.

Remember that it performs a **shallow copy**.

---

#### `Object.hasOwn()`

`Object.hasOwn()` checks whether an object directly owns a property.

Example:

```js
console.log(
  Object.hasOwn(
    company,
    "name"
  )
);
```

Output:

```text
true
```

Unlike the `in` operator, it ignores inherited properties.

---

#### `Object.keys()` vs `Object.entries()`

Consider:

```js
const company = {
  name: "Vaibhav Docs",
  employees: 10,
};
```

Using:

```js
Object.keys(company);
```

returns:

```js
[
  "name",
  "employees",
]
```

Using:

```js
Object.entries(company);
```

returns:

```js
[
  ["name", "Vaibhav Docs"],
  ["employees", 10],
]
```

Choose:

- **`Object.keys()`** when only property names are needed.
- **`Object.entries()`** when both keys and values are required.

---

#### When Should You Use These Methods?

| Method | Use Case |
|---------|----------|
| `Object.keys()` | Iterate over property names |
| `Object.values()` | Retrieve all values |
| `Object.entries()` | Work with key-value pairs |
| `Object.fromEntries()` | Convert entries back into an object |
| `Object.assign()` | Merge objects or perform shallow copies |
| `Object.hasOwn()` | Check whether an object directly owns a property |

---

#### Best Practices

When working with object utility methods:

- Use `Object.keys()` when only keys are needed.
- Use `Object.values()` when only values are needed.
- Use `Object.entries()` for iteration and transformations.
- Use `Object.fromEntries()` after filtering or mapping entries.
- Prefer the Spread Operator for simple object merging, but use `Object.assign()` when copying into an existing target object.
- Use `Object.hasOwn()` instead of `hasOwnProperty()` in modern JavaScript.

---

### 💻 Example

We'll continue using our running example.

```js
const company = {
  name: "Vaibhav Docs",
  employees: 10,
};

console.log(
  Object.keys(company)
);

console.log(
  Object.values(company)
);

console.log(
  Object.entries(company)
);

const rebuilt =
  Object.fromEntries(
    Object.entries(company)
  );

console.log(rebuilt);
```

Output:

```js
["name", "employees"]

["Vaibhav Docs", 10]

[
  ["name", "Vaibhav Docs"],
  ["employees", 10],
]

{
  name: "Vaibhav Docs",
  employees: 10
}
```

---

### 📊 Diagram / Flow

#### `Object.keys()`

```text
Object

↓

Keys Array
```

---

#### `Object.values()`

```text
Object

↓

Values Array
```

---

#### `Object.entries()`

```text
Object

↓

[Key, Value] Pairs
```

---

#### `Object.fromEntries()`

```text
[Key, Value] Pairs

↓

Object
```

---

#### `Object.assign()`

```text
Object A

+

Object B

↓

Merged Object
```

---

### 🌍 Real-World Example

Imagine a company's employee database.

Sometimes you need only the employee IDs.

```text
Employee Records

↓

IDs
```

Sometimes you need only the employee names.

```text
Employee Records

↓

Names
```

Other times, you need both the employee ID and name together.

```text
Employee Records

↓

(ID, Name)
```

And after processing the data, you may want to rebuild the employee database.

```text
Processed Records

↓

Employee Database
```

JavaScript's object utility methods work in the same way:

- `Object.keys()` returns the IDs (keys).
- `Object.values()` returns the data (values).
- `Object.entries()` returns complete records (key-value pairs).
- `Object.fromEntries()` rebuilds the object after processing.

---

### 🎤 Interview Answer

JavaScript provides several built-in methods for working with objects. `Object.keys()` returns an array of an object's own enumerable property names, `Object.values()` returns the corresponding values, and `Object.entries()` returns key-value pairs. `Object.fromEntries()` performs the reverse operation by converting key-value pairs back into an object. `Object.assign()` is used to merge objects or create shallow copies, while `Object.hasOwn()` checks whether an object directly owns a property. These methods are widely used for iteration, transformation, and object manipulation in modern JavaScript.

---

### ❓ Follow-up Questions

1. What does `Object.keys()` return?
2. What is the difference between `Object.keys()` and `Object.entries()`?
3. What does `Object.fromEntries()` do?
4. When should you use `Object.assign()`?
5. Why is `Object.hasOwn()` preferred over `hasOwnProperty()`?
6. Which object method is most useful for transforming object data?

---

## 9. Best Practices for Working with Objects

### 📖 Overview

Objects are the foundation of JavaScript applications.

Almost every real-world application—whether it's built with React, Node.js, Express, or Next.js—relies heavily on objects.

Writing objects correctly isn't just about syntax; it's about designing data structures that are:

- Easy to understand.
- Easy to maintain.
- Easy to update.
- Safe from unintended changes.
- Efficient for large applications.

Following good practices helps reduce bugs and makes your code more scalable.

---

### ⚙️ Main Explanation

#### 1. Keep Objects Focused

An object should represent **one logical entity**.

Good example:

```js
const user = {
  id: 1,
  name: "Vaibhav",
  email: "vaibhav@example.com",
};
```

Avoid mixing unrelated information.

```js
const user = {
  name: "Vaibhav",
  productPrice: 500,
  companyRevenue: 100000,
};
```

Each object should have a clear responsibility.

---

#### 2. Prefer Object Literals

For most applications, create objects using object literals.

```js
const company = {
  name: "Vaibhav Docs",
};
```

Instead of:

```js
const company =
  new Object();
```

Object literals are shorter, cleaner, and the standard approach in modern JavaScript.

---

#### 3. Avoid Unnecessary Mutation

Instead of modifying existing objects:

```js
user.name = "OpenAI";
```

prefer creating a new object.

```js
const updatedUser = {
  ...user,
  name: "OpenAI",
};
```

Immutable updates make code easier to debug and work especially well with React.

---

#### 4. Use Destructuring for Readability

Instead of repeatedly accessing properties:

```js
console.log(user.name);

console.log(user.email);
```

use destructuring.

```js
const {
  name,
  email,
} = user;
```

This makes code shorter and easier to read.

---

#### 5. Choose Meaningful Property Names

Poor naming:

```js
const user = {
  n: "Vaibhav",
  a: 22,
};
```

Better naming:

```js
const user = {
  name: "Vaibhav",
  age: 22,
};
```

Descriptive property names improve maintainability.

---

#### 6. Use Computed Property Names Only When Needed

Computed property names are powerful.

```js
const key = "name";

const user = {
  [key]: "Vaibhav",
};
```

However, if the property name is already known, a normal property is simpler and easier to understand.

---

#### 7. Avoid Deeply Nested Objects

Deep nesting makes objects difficult to read and update.

Instead of:

```js
company.office.department.team.member.name
```

consider flattening the structure when appropriate.

Large applications often normalize data to reduce complexity.

---

#### 8. Protect Configuration Objects

Configuration objects usually shouldn't change after initialization.

```js
const config = {
  apiUrl: "...",
};

Object.freeze(config);
```

This prevents accidental modifications.

---

#### 9. Use the Right Copying Technique

Different situations require different approaches.

- Assignment → Shared reference.
- Spread Operator → Shallow copy.
- `Object.assign()` → Shallow copy.
- `structuredClone()` → Deep copy.

Choose the method based on whether nested objects should remain shared.

---

#### 10. Design Objects for Scalability

Large applications should organize objects logically.

Example:

```js
const employee = {
  personal: {
    name: "Vaibhav",
  },

  contact: {
    email: "...",
  },

  salary: {
    amount: 50000,
  },
};
```

Grouping related properties improves maintainability.

---

#### Why is Immutability Important in React?

React often detects updates using object references.

Bad:

```js
user.name = "OpenAI";
```

Good:

```js
setUser({
  ...user,
  name: "OpenAI",
});
```

Creating a new object allows React to detect changes efficiently and trigger the necessary re-render.

---

#### Common Mistakes

Some common mistakes developers make while working with objects include:

- Assuming assignment creates a copy.
- Accidentally mutating shared objects.
- Comparing objects using `===` for value equality.
- Overusing deeply nested structures.
- Forgetting that object copies created with the Spread Operator are shallow.
- Modifying React state directly instead of creating new objects.

Avoiding these mistakes leads to more reliable applications.

---

### 💻 Example

We'll continue using our running example.

```js
const user = {
  name: "Vaibhav",
  city: "Lucknow",
};

const updatedUser = {
  ...user,
  city: "Delhi",
};

console.log(user);

console.log(updatedUser);
```

Output:

```js
{
  name: "Vaibhav",
  city: "Lucknow"
}

{
  name: "Vaibhav",
  city: "Delhi"
}
```

The original object remains unchanged because a new object was created.

---

### 📊 Diagram / Flow

#### Immutable Update

```text
Original Object

↓

Create New Object

↓

Update Property

↓

Original Preserved
```

---

#### Assignment

```text
Variable A

      │

      ▼

     Object

      ▲

      │

Variable B
```

---

#### Scalable Object Design

```text
Employee

│

├── Personal

├── Contact

├── Salary

└── Address
```

---

#### React Update

```text
Old Object

↓

New Object

↓

Reference Changes

↓

React Re-renders
```

---

### 🌍 Real-World Example

Imagine a company's filing system.

Instead of storing every document in one huge folder, the company organizes documents into separate sections.

```text
Employee Folder

│

├── Personal Details

├── Contact Information

├── Payroll

└── Performance Reviews
```

Each section has a clear purpose, making the records easier to maintain and update.

Similarly, well-designed JavaScript objects group related data together, use meaningful property names, avoid unnecessary modifications, and keep the structure organized as the application grows.

---

### 🎤 Interview Answer

When designing JavaScript objects, it's best to keep each object focused on a single responsibility, use object literals, choose meaningful property names, and avoid unnecessary mutation. Immutable updates using the Spread Operator are preferred, especially in React, because they create new object references that make change detection easier. Developers should also avoid deep nesting when possible, protect configuration objects using `Object.freeze()`, and choose the appropriate copying technique based on whether a shallow or deep copy is needed. Following these practices results in cleaner, safer, and more maintainable code.

---

### ❓ Follow-up Questions

1. Why should objects represent a single logical entity?
2. Why is immutability important in React?
3. Why is the Spread Operator commonly used for object updates?
4. Why should deeply nested objects be avoided?
5. How can configuration objects be protected?
6. What are the most common mistakes developers make while working with objects?

---

## 10. Interview Perspective and Mental Model of Objects

### 📖 Overview

Objects are one of the most fundamental concepts in JavaScript.

Almost every application revolves around objects, including:

- User data
- API responses
- React props and state
- Express request/response objects
- Database documents
- DOM elements

Because of this, object-related questions are among the most common in JavaScript interviews.

Interviewers are usually testing whether you understand:

- How objects are created.
- How they are stored in memory.
- How copying works.
- How references behave.
- How immutability affects applications.

Instead of memorizing answers, it's better to build a clear mental model.

---

### ⚙️ Main Explanation

#### The Mental Model

Whenever you work with an object, think of the following process.

```text
Create Object

↓

Store in Heap Memory

↓

Variable Stores Reference

↓

Read / Update Properties

↓

Copy or Share Reference

↓

Protect or Clone if Needed
```

This simple flow explains almost every object-related interview question.

---

#### Objects are Reference Types

One of the most important concepts is:

> **Variables don't store objects—they store references to objects.**

Example:

```js
const user1 = {
  name: "Vaibhav",
};

const user2 = user1;
```

Memory:

```text
user1

      │

      ▼

    Object

      ▲

      │

user2
```

Understanding this explains why changing one variable can affect another.

---

#### Assignment vs Copy

Whenever you see:

```js
const b = a;
```

ask yourself:

```text
Primitive?

↓

Copy Value

-------------------

Object?

↓

Copy Reference
```

This single rule prevents many common bugs.

---

#### Shallow Copy vs Deep Copy

When copying objects, always identify which type of copy is needed.

```text
Need Independent Nested Objects?

│

├── Yes

│     ↓

│ Deep Copy

│

└── No

      ↓

Shallow Copy
```

Remember:

- Spread Operator → Shallow Copy.
- `Object.assign()` → Shallow Copy.
- `structuredClone()` → Deep Copy.

---

#### Mutable vs Immutable

Objects are mutable.

```js
user.name = "OpenAI";
```

This changes the existing object.

An immutable update creates a new object instead.

```js
const updatedUser = {
  ...user,
  name: "OpenAI",
};
```

This pattern is widely used in React and Redux because it produces a new reference that is easy to detect.

---

#### Equality

When comparing objects:

```js
obj1 === obj2;
```

JavaScript compares **references**, not values.

```text
Same Reference

↓

true

-------------------

Same Data

↓

false (if different objects)
```

If you need value equality, compare the properties or use a deep comparison utility.

---

#### Protecting Objects

Choose the appropriate protection level.

```text
Need Read-Only Object?

↓

Object.freeze()

-------------------

Need Fixed Structure?

↓

Object.seal()
```

Remember that both methods are shallow.

---

#### Choosing the Right Tool

| Situation | Recommended Approach |
|-----------|----------------------|
| Create an object | Object Literal |
| Read property | Dot Notation |
| Dynamic property | Bracket Notation |
| Extract properties | Destructuring |
| Shallow copy | Spread Operator |
| Deep copy | `structuredClone()` |
| Merge objects | Spread Operator / `Object.assign()` |
| Prevent modification | `Object.freeze()` |
| Prevent adding/removing properties | `Object.seal()` |
| Check own property | `Object.hasOwn()` |

This table covers most day-to-day object operations.

---

#### Interview Tips

During interviews:

- Mention that objects are stored in **Heap Memory**.
- Explain that variables store **references**, not objects.
- Clearly distinguish between **assignment**, **shallow copy**, and **deep copy**.
- Explain why immutable updates are important in React.
- Mention that `Object.freeze()` and `Object.seal()` are shallow operations.
- When comparing objects, remember that `===` checks references, not values.

Interviewers often care more about your reasoning than your final answer.

---

### 💻 Example

We'll conclude the chapter with a simple example.

```js
const user1 = {
  name: "Vaibhav",
};

const user2 = {
  ...user1,
};

user2.name = "OpenAI";

console.log(user1.name);

console.log(user2.name);
```

Output:

```text
Vaibhav

OpenAI
```

The Spread Operator creates a new top-level object, so updating `user2` doesn't affect `user1`.

---

### 📊 Diagram / Flow

#### Object Lifecycle

```text
Create Object

↓

Heap Memory

↓

Reference Stored

↓

Read / Update

↓

Copy / Protect
```

---

#### Assignment

```text
Variable A

↓

Reference

↓

Object

↑

Reference

↑

Variable B
```

---

#### Immutable Update

```text
Old Object

↓

Spread Operator

↓

New Object

↓

Update Property
```

---

#### Decision Tree

```text
Need a Copy?

│

├── Nested Objects?

│     │

│     ├── Yes

│     │     ↓

│     │ structuredClone()

│     │

│     └── No

│           ↓

│      Spread Operator

│

└── No

      ↓

Assignment
```

---

### 🌍 Real-World Example

Imagine a company maintains an important project document.

If every employee edits the **same document**, one person's changes immediately affect everyone else.

```text
Employees

↓

Shared Document
```

This is similar to multiple variables referencing the same object.

Instead, before making changes, an employee creates a copy.

```text
Original Document

↓

Personal Copy

↓

Edit Safely
```

This is like creating a new object before updating it.

If the original document is marked as **read-only**, nobody can accidentally change it.

That's similar to using `Object.freeze()`.

The key idea is knowing **when to share**, **when to copy**, and **when to protect** an object.

---

### 🎤 Interview Answer

Objects in JavaScript are **reference types** stored in **Heap Memory**, while variables store references to those objects. Assigning one object to another copies the reference rather than the object itself, which is why changes made through one variable can affect another. The Spread Operator and `Object.assign()` create shallow copies, whereas `structuredClone()` creates a deep copy of supported data. Objects are mutable, so immutable updates are commonly used in React to create new references and simplify change detection. When protecting objects, `Object.freeze()` makes properties read-only, while `Object.seal()` prevents adding or removing properties but still allows updating existing ones. Understanding references, copying, mutability, and object methods provides a strong mental model for solving most object-related interview questions.

---

### ❓ Follow-up Questions

1. Why are objects stored by reference instead of by value?
2. What is the difference between assignment, shallow copy, and deep copy?
3. Why is immutability important in React?
4. Why does `===` compare object references instead of object values?
5. When should you use `Object.freeze()` or `Object.seal()`?
6. How would you explain JavaScript objects to someone coming from Java or C++?

---