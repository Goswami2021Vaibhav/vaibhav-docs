---
title: Operators
description: Comparison, logical, spread/rest, optional chaining, and nullish coalescing operators.
sidebar_position: 6
---

# Operators

## 1. What are Operators in JavaScript, and what are their different types?

### 📖 Overview

Operators are one of the fundamental building blocks of JavaScript. They allow us to **perform operations on values and variables**.

For example:

- Add two numbers
- Compare two values
- Assign a value to a variable
- Combine multiple conditions
- Access object properties safely

Without operators, variables would simply store data, but we wouldn't be able to perform any meaningful computation with them.

JavaScript provides many operators, each designed for a specific purpose. Understanding when and how to use them is essential for writing effective programs.

---

### ⚙️ Main Explanation

#### What is an Operator?

An **operator** is a special symbol or keyword that performs an operation on one or more operands.

Example:

```js
const total = 10 + 20;
```

Here:

- `10` and `20` are **operands**.
- `+` is the **operator**.
- `30` is the result of the operation.

Operators always work on operands to produce a result.

---

#### What are Operands?

Operands are the values on which an operator performs its operation.

```js
const price = 100;

const tax = 18;

const total = price + tax;
```

Here:

```text
price

+

tax
```

- `price` → Operand
- `tax` → Operand
- `+` → Operator

---

#### Types of Operators in JavaScript

JavaScript provides many operators, but the most commonly used categories are:

| Operator Type | Purpose |
|--------------|---------|
| Arithmetic | Mathematical calculations |
| Assignment | Assign values |
| Comparison | Compare values |
| Logical | Combine conditions |
| Ternary | Conditional expressions |
| Bitwise | Binary operations |
| Special | `typeof`, `delete`, `in`, `instanceof`, etc. |

We'll explore each category throughout this chapter.

---

#### Arithmetic Operators

Arithmetic operators perform mathematical calculations.

| Operator | Description |
|----------|-------------|
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Remainder |
| `**` | Exponentiation |

Example:

```js
const total = 100 + 50;

const discount = 100 - 20;

const area = 10 * 5;
```

---

#### Assignment Operators

Assignment operators assign values to variables.

The most common assignment operator is:

```js
=
```

Example:

```js
let total = 100;
```

JavaScript also provides compound assignment operators.

```js
let count = 10;

count += 5;

count *= 2;
```

Common assignment operators include:

```text
=

+=

-=

*=

/=

%=

**=
```

---

#### Comparison Operators

Comparison operators compare two values and return a Boolean result.

Example:

```js
10 > 5;
```

Output:

```text
true
```

Some common comparison operators are:

```text
>

<

>=

<=

==

===

!=

!==
```

We'll explore these in detail later in this chapter.

---

#### Logical Operators

Logical operators combine or negate conditions.

The three logical operators are:

```text
&&

||

!
```

Example:

```js
const age = 22;

const hasLicense = true;

const canDrive = age >= 18 && hasLicense;
```

Output:

```text
true
```

We'll also learn how logical operators perform **short-circuit evaluation**.

---

#### Ternary Operator

The ternary operator is JavaScript's only operator that works with **three operands**.

Syntax:

```js
condition ? valueIfTrue : valueIfFalse
```

Example:

```js
const age = 20;

const status = age >= 18 ? "Adult" : "Minor";
```

Output:

```text
Adult
```

It provides a concise alternative to simple `if...else` statements.

---

#### Bitwise Operators

Bitwise operators work directly with the binary representation of numbers.

Examples include:

```text
&

|

^

~

<<

>>

>>>
```

These operators are less common in everyday web development but are useful in areas such as systems programming, graphics, networking, and performance optimization.

> 💡 **Coming Next**
>
> We'll explore Bitwise Operators in more detail later in this chapter.

---

#### Special Operators

JavaScript also provides several special-purpose operators.

Examples include:

```text
typeof

delete

in

instanceof

...

??

?.
```

Each solves a specific problem and will be covered individually in later topics.

---

#### Unary, Binary, and Ternary Operators

Operators can also be classified by the number of operands they require.

##### Unary Operators

Operate on **one operand**.

Examples:

```js
typeof company;

!isActive;

++count;
```

---

##### Binary Operators

Operate on **two operands**.

Examples:

```js
10 + 20;

age >= 18;

price * quantity;
```

Most JavaScript operators are binary operators.

---

##### Ternary Operator

Operates on **three operands**.

Example:

```js
age >= 18 ? "Adult" : "Minor";
```

This is the only ternary operator in JavaScript.

---

### 💻 Example

We'll use the following example throughout this chapter.

```js
const company = "Vaibhav Docs";

let employees = 20;

employees += 5;

const isHiring = employees > 20;

const status = isHiring ? "Hiring" : "Full";

console.log(company);
console.log(employees);
console.log(status);
```

This example demonstrates:

- Assignment (`=`, `+=`)
- Arithmetic (`+`)
- Comparison (`>`)
- Ternary (`? :`)

---

### 📊 Diagram / Flow

#### Operator

```text
Operand

      │

      ▼

Operator

      │

      ▼

Operand

      │

      ▼

Result
```

---

#### JavaScript Operators

```text
Operators

│

├── Arithmetic

├── Assignment

├── Comparison

├── Logical

├── Ternary

├── Bitwise

└── Special
```

---

#### Classification by Operands

```text
Operators

│

├── Unary

│      1 Operand

│
├── Binary

│      2 Operands

│
└── Ternary

       3 Operands
```

---

#### Example

```text
employees += 5

employees

↓

+

↓

5

↓

25
```

---

### 🌍 Real-World Example

Imagine a calculator.

A calculator by itself doesn't know what you want to do.

You must press an operation button.

```text
10

+

20

=

30
```

The numbers are the **operands**, while the `+` button is the **operator** that tells the calculator which action to perform.

JavaScript works the same way.

Variables hold data, and operators tell JavaScript **what operation should be performed on that data**.

Without operators, programs wouldn't be able to calculate, compare, assign, or make decisions.

---

### 🎤 Interview Answer

Operators are special symbols or keywords that perform operations on one or more operands. They allow JavaScript to perform tasks such as arithmetic calculations, value assignment, comparisons, logical operations, and conditional expressions. JavaScript provides several categories of operators, including Arithmetic, Assignment, Comparison, Logical, Ternary, Bitwise, and Special operators. Operators can also be classified as unary, binary, or ternary based on the number of operands they work with. Understanding operators is fundamental because they are used in almost every JavaScript program.

---

### ❓ Follow-up Questions

1. What is the difference between unary, binary, and ternary operators?
2. What are the most commonly used operator categories in JavaScript?
3. What is the difference between arithmetic and assignment operators?
4. Why is the ternary operator called a ternary operator?
5. What are special operators like `typeof`, `delete`, and `instanceof` used for?
6. How do operator precedence and associativity affect expression evaluation?

---

## 2. How do Comparison Operators work in JavaScript?

### 📖 Overview

Comparison operators are used to compare two values. The result of every comparison is a **Boolean** value:

- `true`
- `false`

They are commonly used in:

- `if` statements
- Loops
- Conditional expressions
- Filtering data
- Sorting
- Access control

Some comparison operators compare only the values, while others compare both the **value and the data type**.

---

### ⚙️ Main Explanation

#### What are Comparison Operators?

Comparison operators evaluate the relationship between two operands.

Example:

```js
10 > 5;
```

Output:

```text
true
```

Because `10` is greater than `5`.

---

#### Types of Comparison Operators

| Operator | Description |
|----------|-------------|
| `==` | Equal to (Loose Equality) |
| `===` | Strict Equal to |
| `!=` | Not Equal to (Loose Inequality) |
| `!==` | Strict Not Equal to |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater than or equal to |
| `<=` | Less than or equal to |

Every comparison returns either `true` or `false`.

---

#### Greater Than and Less Than

These operators compare numeric values.

```js
20 > 10;
```

Output:

```text
true
```

---

```js
20 < 10;
```

Output:

```text
false
```

---

They also work with strings using **lexicographical (dictionary) order**.

```js
"apple" < "banana";
```

Output:

```text
true
```

---

#### Loose Equality (`==`)

The `==` operator compares values **after performing type coercion when necessary**.

```js
10 == "10";
```

JavaScript converts:

```text
"10"

↓

10
```

Comparison:

```text
10 == 10

↓

true
```

Output:

```text
true
```

---

Another example:

```js
true == 1;
```

Output:

```text
true
```

Because JavaScript converts:

```text
true

↓

1
```

---

#### Strict Equality (`===`)

The `===` operator compares both the **value and the data type**.

No type conversion takes place.

```js
10 === "10";
```

Output:

```text
false
```

The values are similar, but their data types differ.

---

#### Loose Inequality (`!=`)

The `!=` operator is the opposite of `==`.

It performs type coercion before comparing.

```js
10 != "10";
```

Output:

```text
false
```

Because:

```text
10 == "10"

↓

true
```

Therefore:

```text
10 != "10"

↓

false
```

---

#### Strict Inequality (`!==`)

The `!==` operator is the opposite of `===`.

It compares both value and type.

```js
10 !== "10";
```

Output:

```text
true
```

Because:

```text
Number

≠

String
```

---

#### Comparing Different Data Types

JavaScript sometimes converts values automatically during comparison.

```js
5 > "3";
```

Output:

```text
true
```

JavaScript converts:

```text
"3"

↓

3
```

Then performs:

```text
5 > 3
```

---

Another example:

```js
"20" >= 10;
```

Output:

```text
true
```

---

This automatic conversion is known as **type coercion**.

> 💡 **Coming Next**
>
> We explored type coercion in the **Data Types** chapter. In this chapter, we'll focus on how comparison operators make use of it.

---

#### How Does JavaScript Perform Loose Equality?

When JavaScript encounters:

```js
10 == "10";
```

it follows the **Abstract Equality Comparison** algorithm.

Conceptually:

```text
Same Type?

│

├── Yes

│     Compare Values

│
└── No

      Convert Types

↓

Compare Again
```

This explains why `==` can produce surprising results.

---

#### Why is `===` Recommended?

Most modern JavaScript code uses `===` because:

- No hidden type conversion
- Easier to understand
- More predictable
- Fewer unexpected bugs

Example:

```js
const age = "18";

if (age === 18) {
  console.log("Adult");
}
```

The condition correctly evaluates to `false`, making the type mismatch obvious.

If `==` had been used, JavaScript would have silently converted the value.

---

#### Object Comparison

Objects are compared by **reference**, not by their contents.

```js
const company1 = {
  name: "Vaibhav Docs",
};

const company2 = {
  name: "Vaibhav Docs",
};

console.log(company1 === company2);
```

Output:

```text
false
```

Although both objects contain the same data, they occupy different memory locations.

Now consider:

```js
const company1 = {
  name: "Vaibhav Docs",
};

const company2 = company1;

console.log(company1 === company2);
```

Output:

```text
true
```

Both variables reference the same object.

---

#### Best Practices

When comparing values:

- Prefer `===` over `==`.
- Prefer `!==` over `!=`.
- Avoid relying on implicit type coercion.
- Compare values of the same data type whenever possible.
- Be careful when comparing objects, since comparison is based on references.

These practices make your code more readable and less error-prone.

---

### 💻 Example

Using our running example:

```js
const company = "Vaibhav Docs";

const foundedYear = "2024";

console.log(foundedYear == 2024);

console.log(foundedYear === 2024);

const company1 = {
  name: company,
};

const company2 = company1;

console.log(company1 === company2);
```

Output:

```text
true

false

true
```

This example demonstrates:

- Loose equality (`==`)
- Strict equality (`===`)
- Object reference comparison

---

### 📊 Diagram / Flow

#### Comparison Operators

```text
Value A

↓

Comparison Operator

↓

Value B

↓

true / false
```

---

#### Loose Equality (`==`)

```text
Different Types

↓

Type Coercion

↓

Compare Values

↓

Result
```

---

#### Strict Equality (`===`)

```text
Different Types

↓

No Conversion

↓

false
```

---

#### Object Comparison

```text
company1

│

└──────────┐
           ▼

      Object

           ▲
┌──────────┘

company2

↓

true
```

---

### 🌍 Real-World Example

Imagine two airport security checkpoints.

The first checkpoint (`==`) is flexible.

If two passengers present different document formats but represent the same information, the officer first standardizes the documents before comparing them.

```text
Passport

↓

Convert Format

↓

Compare
```

---

The second checkpoint (`===`) is much stricter.

It compares both:

- The information
- The document type

If either differs, the passenger doesn't pass the check.

Similarly:

- `==` performs type conversion before comparison.
- `===` compares values exactly as they are.

---

### 🎤 Interview Answer

Comparison operators compare two values and always return a Boolean result. JavaScript provides operators such as `>`, `<`, `>=`, `<=`, `==`, `===`, `!=`, and `!==`. The `==` operator performs loose equality comparison by applying type coercion when the operand types differ, whereas `===` performs strict equality comparison without any type conversion. Similarly, `!=` performs loose inequality, while `!==` performs strict inequality. In modern JavaScript, `===` and `!==` are generally recommended because they avoid unexpected behavior caused by implicit type coercion.

---

### ❓ Follow-up Questions

1. What is the difference between `==` and `===`?
2. What is the difference between `!=` and `!==`?
3. How does JavaScript compare values of different data types?
4. Why is `===` generally preferred over `==`?
5. How are objects compared in JavaScript?
6. What role does type coercion play in loose equality?

---

## 3. How do Logical Operators and Short-Circuit Evaluation work?

### 📖 Overview

Logical operators allow us to combine, negate, and evaluate multiple conditions.

They are commonly used in:

- `if` statements
- Loops
- Conditional rendering
- Form validation
- Authentication and authorization
- Providing default values

JavaScript provides three logical operators:

- `&&` (AND)
- `||` (OR)
- `!` (NOT)

Unlike many programming languages, these operators **do not always return a Boolean value**. Instead, they return one of their operands, which makes them extremely powerful in everyday JavaScript code.

---

### ⚙️ Main Explanation

#### What are Logical Operators?

Logical operators evaluate one or more expressions.

Example:

```js
const age = 22;

const hasLicense = true;

const canDrive = age >= 18 && hasLicense;
```

Output:

```text
true
```

Here, both conditions are `true`, so the final result is also `true`.

---

#### The AND Operator (`&&`)

The `&&` operator returns:

- The **first Falsy value** it encounters.
- If all operands are Truthy, it returns the **last operand**.

Syntax:

```js
value1 && value2;
```

Example:

```js
true && true;
```

Output:

```text
true
```

---

```js
true && false;
```

Output:

```text
false
```

---

With non-Boolean values:

```js
"Vaibhav Docs" && 2024;
```

Output:

```text
2024
```

Both values are Truthy, so JavaScript returns the last operand.

---

Another example:

```js
0 && "JavaScript";
```

Output:

```text
0
```

Since `0` is Falsy, JavaScript stops immediately and returns it.

---

#### The OR Operator (`||`)

The `||` operator returns:

- The **first Truthy value** it encounters.
- If every operand is Falsy, it returns the **last operand**.

Syntax:

```js
value1 || value2;
```

Example:

```js
false || true;
```

Output:

```text
true
```

---

```js
"" || "Vaibhav Docs";
```

Output:

```text
Vaibhav Docs
```

The empty string is Falsy, so JavaScript evaluates the second operand.

---

Another example:

```js
100 || 200;
```

Output:

```text
100
```

The first value is already Truthy, so JavaScript returns it immediately.

---

#### The NOT Operator (`!`)

The `!` operator reverses a Boolean value.

Example:

```js
!true;
```

Output:

```text
false
```

---

```js
!false;
```

Output:

```text
true
```

It also converts non-Boolean values into Booleans before negating them.

```js
!"Vaibhav Docs";
```

Output:

```text
false
```

Because:

```text
Boolean("Vaibhav Docs")

↓

true

↓

!

↓

false
```

---

#### What is Short-Circuit Evaluation?

Short-circuit evaluation means JavaScript **stops evaluating an expression as soon as the final result is known**.

This improves efficiency because unnecessary expressions are never executed.

---

#### Short-Circuit with `&&`

Example:

```js
false && console.log("Executed");
```

Output:

```text
false
```

`console.log()` is **never executed**.

Why?

Because:

```text
false && anything

↓

false
```

The result is already determined by the first operand.

---

Another example:

```js
true && console.log("Hello");
```

Output:

```text
Hello
```

Since the first operand is Truthy, JavaScript evaluates the second one.

---

#### Short-Circuit with `||`

Example:

```js
true || console.log("Executed");
```

Output:

```text
true
```

The second expression is skipped.

Because:

```text
true || anything

↓

true
```

The result is already known.

---

Another example:

```js
false || console.log("Hello");
```

Output:

```text
Hello
```

Since the first operand is Falsy, JavaScript must evaluate the second one.

---

#### Why is Short-Circuit Evaluation Useful?

It helps avoid unnecessary work.

Example:

```js
const user = null;

user && console.log(user.name);
```

Output:

```text
null
```

JavaScript never attempts to access `user.name`.

Without short-circuit evaluation:

```js
console.log(user.name);
```

would throw:

```text
TypeError
```

---

Another common example:

```js
const username = input || "Guest";
```

If `input` is Truthy, JavaScript returns it.

Otherwise, it uses `"Guest"`.

> 💡 **Coming Next**
>
> The `||` operator has limitations when dealing with values like `0` and `""`. We'll see how the **Nullish Coalescing Operator (`??`)** solves this problem in the next topic.

---

#### Performance Benefits

Short-circuit evaluation can improve performance because JavaScript skips unnecessary computations.

Example:

```js
isLoggedIn && loadDashboard();
```

If `isLoggedIn` is `false`, JavaScript never calls `loadDashboard()`.

Similarly:

```js
cachedData || fetchFromDatabase();
```

If cached data already exists, JavaScript skips the expensive database call.

While the performance gain is usually small, this behavior is very useful when the skipped operation is expensive.

---

### 💻 Example

Using our running example:

```js
const company = "Vaibhav Docs";

const employees = 25;

const isHiring = employees > 20;

console.log(isHiring && company);

console.log("" || company);

console.log(!isHiring);
```

Output:

```text
Vaibhav Docs

Vaibhav Docs

false
```

This example demonstrates:

- `&&` returning the last Truthy operand.
- `||` returning the first Truthy operand.
- `!` reversing a Boolean value.

---

### 📊 Diagram / Flow

#### Logical Operators

```text
Logical Operators

│

├── &&

├── ||

└── !
```

---

#### `&&`

```text
Value 1

↓

Falsy?

│

├── Yes

│     Return Value 1

│
└── No

      Evaluate Value 2
```

---

#### `||`

```text
Value 1

↓

Truthy?

│

├── Yes

│     Return Value 1

│
└── No

      Evaluate Value 2
```

---

#### Short-Circuit Evaluation

```text
Expression

↓

Enough Information?

│

├── Yes

│     Stop Evaluation

│
└── No

      Continue
```

---

### 🌍 Real-World Example

Imagine entering a secure office building.

To enter the server room, two conditions must be satisfied.

```text
Employee ID

AND

Fingerprint Scan
```

If the employee doesn't have an ID card, security doesn't even ask for the fingerprint.

```text
No ID

↓

Access Denied
```

The second check is skipped.

This is exactly how the `&&` operator performs short-circuit evaluation.

Now imagine the reception desk.

A visitor can enter if they have **either**:

- An employee ID
- A visitor pass

```text
Employee ID

OR

Visitor Pass
```

If the employee ID is already valid, security never checks the visitor pass.

This is how the `||` operator short-circuits.

---

### 🎤 Interview Answer

JavaScript provides three logical operators: `&&` (AND), `||` (OR), and `!` (NOT). The `&&` operator returns the first Falsy operand or the last operand if all values are Truthy. The `||` operator returns the first Truthy operand or the last operand if all values are Falsy. The `!` operator converts a value to a Boolean and then negates it. These operators use **short-circuit evaluation**, meaning JavaScript stops evaluating an expression as soon as the final result is known. This behavior improves efficiency and is commonly used for conditional execution, default values, and safe property access.

---

### ❓ Follow-up Questions

1. What is short-circuit evaluation in JavaScript?
2. Why do `&&` and `||` return operands instead of always returning Booleans?
3. How does short-circuit evaluation improve performance?
4. What is the difference between `||` and `??`?
5. How can `&&` be used to safely execute code conditionally?
6. What are common real-world uses of logical operators?

---

## 4. What are the Nullish Coalescing (`??`) and Optional Chaining (`?.`) Operators?

### 📖 Overview

Modern JavaScript introduced two powerful operators to make code safer and easier to read:

- **Nullish Coalescing (`??`)**
- **Optional Chaining (`?.`)**

These operators solve two common problems:

1. Providing **default values** without accidentally replacing valid data.
2. Safely accessing deeply nested object properties without causing runtime errors.

They are widely used in React, Next.js, Node.js, and other modern JavaScript applications.

---

### ⚙️ Main Explanation

### What is `??`?

The **Nullish Coalescing Operator** returns the **right-hand value only when the left-hand value is `null` or `undefined`**.

Syntax:

```js
value ?? defaultValue
```

If the left-hand value exists, JavaScript returns it.

Otherwise, it returns the default value.

Example:

```js
const company = null;

console.log(company ?? "Vaibhav Docs");
```

Output:

```text
Vaibhav Docs
```

---

Another example:

```js
const company = "OpenAI";

console.log(company ?? "Vaibhav Docs");
```

Output:

```text
OpenAI
```

Since the value is neither `null` nor `undefined`, JavaScript keeps it.

---

### Why Was `??` Introduced?

Before `??`, developers commonly used the logical OR operator (`||`) to provide default values.

Example:

```js
const quantity = 0;

console.log(quantity || 100);
```

Output:

```text
100
```

This is often **incorrect** because `0` is a valid value.

The `||` operator treats **all Falsy values** as missing.

Falsy values include:

- `0`
- `""`
- `false`
- `NaN`
- `null`
- `undefined`

---

Using `??`:

```js
const quantity = 0;

console.log(quantity ?? 100);
```

Output:

```text
0
```

Because `0` is **not** `null` or `undefined`.

This is why `??` is generally safer when providing default values.

---

### `||` vs `??`

Example:

```js
const username = "";

console.log(username || "Guest");
```

Output:

```text
Guest
```

Because an empty string is Falsy.

Now using `??`:

```js
const username = "";

console.log(username ?? "Guest");
```

Output:

```text

```

The empty string is preserved because it is not `null` or `undefined`.

---

### What is Optional Chaining?

The **Optional Chaining Operator** safely accesses object properties.

If any part of the chain is `null` or `undefined`, JavaScript immediately returns `undefined` instead of throwing an error.

Syntax:

```js
object?.property
```

---

Example:

```js
const company = null;

console.log(company?.name);
```

Output:

```text
undefined
```

Without Optional Chaining:

```js
console.log(company.name);
```

Output:

```text
TypeError
```

---

### Why is Optional Chaining Useful?

Imagine receiving API data.

Sometimes nested objects may not exist.

```js
const user = {
  profile: {
    name: "Vaibhav",
  },
};
```

Accessing:

```js
user.profile.name;
```

works correctly.

But:

```js
const user = {};

console.log(user.profile.name);
```

throws:

```text
TypeError
```

Using Optional Chaining:

```js
console.log(user.profile?.name);
```

Output:

```text
undefined
```

The program continues running safely.

---

### Optional Method Chaining

Optional Chaining also works with methods.

Example:

```js
const user = {};

user.greet?.();
```

Output:

```text
undefined
```

If the method exists, JavaScript calls it.

Otherwise, nothing happens.

---

### Optional Element Access

Optional Chaining can also be used with arrays or dynamic property names.

Syntax:

```js
object?.[key]
```

Example:

```js
const company = {
  name: "Vaibhav Docs",
};

console.log(company?.["name"]);
```

Output:

```text
Vaibhav Docs
```

---

Array example:

```js
const technologies = ["JavaScript", "React"];

console.log(technologies?.[0]);
```

Output:

```text
JavaScript
```

---

### How Does Optional Chaining Work?

Conceptually:

```text
Is Current Value

null or undefined?

│

├── Yes

│     Return undefined

│
└── No

      Continue Access
```

This process repeats for every `?.` in the chain.

---

### Combining `?.` and `??`

These operators are often used together.

Example:

```js
const user = {};

const name = user.profile?.name ?? "Guest";

console.log(name);
```

Output:

```text
Guest
```

Flow:

- `user.profile` → `undefined`
- Optional Chaining returns `undefined`
- Nullish Coalescing provides `"Guest"`

This is a common pattern in modern JavaScript.

---

### Best Practices

Use `??` when:

- You want a default value only for `null` or `undefined`.

Use `?.` when:

- Accessing nested object properties.
- Calling optional methods.
- Working with API responses.
- Accessing arrays that may not exist.

Avoid replacing every property access with `?.`.

If you're certain a value exists, normal property access is simpler and more readable.

---

### 💻 Example

Using our running example:

```js
const company = {
  name: "Vaibhav Docs",
  address: {
    city: "Lucknow",
  },
};

console.log(company.address?.city);

console.log(company.contact?.email ?? "Not Available");

const employeeCount = 0;

console.log(employeeCount ?? 100);
```

Output:

```text
Lucknow

Not Available

0
```

This example demonstrates:

- Safe nested property access.
- Providing default values.
- Preserving valid values like `0`.

---

### 📊 Diagram / Flow

#### Nullish Coalescing (`??`)

```text
Left Value

↓

null or undefined?

│

├── Yes

│     Return Right Value

│
└── No

      Return Left Value
```

---

#### `||` vs `??`

```text
||

Falsy?

↓

Default Value

-------------------------

??

null / undefined?

↓

Default Value
```

---

#### Optional Chaining

```text
Object

↓

Property Exists?

│

├── Yes

│     Continue

│
└── No

      Return undefined
```

---

#### Combining `?.` and `??`

```text
user.profile?.name

↓

undefined

↓

??

↓

"Guest"
```

---

### 🌍 Real-World Example

Imagine you're filling out an online registration form.

Some fields are optional.

```text
Name

Email

Phone

Address
```

If the **Phone** field is empty, the website shouldn't crash.

Instead, it simply displays:

```text
Not Provided
```

This is similar to **Optional Chaining**, which safely handles missing data.

Now imagine displaying a user's score.

```text
Score

0
```

A score of `0` is still a valid score.

Using `||` might incorrectly replace it with a default value.

Using `??` preserves the valid score because it only replaces `null` or `undefined`.

Together, `?.` and `??` make applications more reliable when working with incomplete or optional data.

---

### 🎤 Interview Answer

The **Nullish Coalescing Operator (`??`)** returns the right-hand value only when the left-hand value is `null` or `undefined`, making it safer than `||` for default values because it preserves valid Falsy values like `0`, `false`, and empty strings. The **Optional Chaining Operator (`?.`)** safely accesses object properties, methods, or array elements. If any part of the chain is `null` or `undefined`, JavaScript returns `undefined` instead of throwing a `TypeError`. These operators are commonly used together when working with optional or nested data, especially in API responses.

---

### ❓ Follow-up Questions

1. What is the difference between `||` and `??`?
2. Why is `??` safer than `||` for default values?
3. How does Optional Chaining prevent runtime errors?
4. What is optional method chaining?
5. What is optional element access (`?.[]`)?
6. When should you combine `?.` and `??`?

---

## 5. What are the Spread and Rest Operators (`...`)?

### 📖 Overview

The **Spread** and **Rest** operators both use the same syntax:

```js
...
```

Although they look identical, they perform **completely opposite tasks** depending on where they are used.

- **Spread** expands a collection into individual values.
- **Rest** collects multiple values into a single collection.

A simple way to remember them is:

> **Spread expands, Rest collects.**

These operators are widely used in modern JavaScript for copying arrays, merging objects, passing function arguments, and handling variable numbers of parameters.

---

### ⚙️ Main Explanation

### What is the Spread Operator?

The **Spread Operator** expands an iterable (such as an array or string) or an object's properties into individual elements.

Example:

```js
const technologies = ["JavaScript", "React"];

console.log(...technologies);
```

Output:

```text
JavaScript React
```

Instead of passing one array, JavaScript passes each element separately.

---

### Spread with Arrays

One of the most common uses of Spread is copying arrays.

```js
const frontend = ["HTML", "CSS"];

const copied = [...frontend];
```

Instead of sharing the same array reference, JavaScript creates a new array containing the same elements.

---

Another example:

```js
const frontend = ["HTML", "CSS"];

const backend = ["Node.js", "Express"];

const fullStack = [...frontend, ...backend];
```

Output:

```text
[
  "HTML",
  "CSS",
  "Node.js",
  "Express"
]
```

Spread makes array merging simple and readable.

---

### Spread with Objects

Spread can also copy and merge objects.

```js
const company = {
  name: "Vaibhav Docs",
};

const details = {
  ...company,
  founded: 2024,
};
```

Output:

```text
{
  name: "Vaibhav Docs",
  founded: 2024
}
```

If multiple objects contain the same property, the last value wins.

```js
const first = {
  company: "A",
};

const second = {
  company: "B",
};

const merged = {
  ...first,
  ...second,
};
```

Output:

```text
{
  company: "B"
}
```

---

### Spread with Function Calls

Spread is also useful when passing array elements as function arguments.

```js
const numbers = [10, 20];

console.log(Math.max(...numbers));
```

Output:

```text
20
```

Instead of passing an array, JavaScript expands it into separate arguments.

---

### What is the Rest Operator?

The **Rest Operator** does the opposite of Spread.

Instead of expanding values, it **collects multiple values into a single array or object**.

---

### Rest Parameters in Functions

Suppose a function should accept any number of arguments.

```js
function sum(...numbers) {
  console.log(numbers);
}

sum(10, 20, 30);
```

Output:

```text
[10, 20, 30]
```

The Rest Operator collects all remaining arguments into an array.

---

### Rest Must Be the Last Parameter

A Rest parameter must always appear at the end of the parameter list.

Correct:

```js
function greet(name, ...messages) {}
```

Incorrect:

```js
function greet(...messages, name) {}
```

Output:

```text
SyntaxError
```

JavaScript wouldn't know where the remaining arguments should stop.

---

### Rest with Array Destructuring

Rest can collect the remaining elements during destructuring.

```js
const technologies = [
  "JavaScript",
  "React",
  "Node.js",
];

const [first, ...others] = technologies;

console.log(first);

console.log(others);
```

Output:

```text
JavaScript

["React", "Node.js"]
```

---

### Rest with Object Destructuring

It also works with objects.

```js
const company = {
  name: "Vaibhav Docs",
  founded: 2024,
  city: "Lucknow",
};

const { name, ...details } = company;
```

Output:

```text
details

↓

{
  founded: 2024,
  city: "Lucknow"
}
```

---

### Spread vs Rest

Although both use `...`, JavaScript distinguishes them based on **where the syntax appears**.

Example:

```js
const copy = [...array];
```

Since it appears on the right side while creating a new array, JavaScript interprets it as **Spread**.

---

Example:

```js
function greet(...args) {}
```

Since it appears in the function parameter list, JavaScript interprets it as **Rest**.

The syntax is the same, but the surrounding context determines its meaning.

---

### Performance Considerations

Spread creates a **new array or object**.

For small and medium-sized collections, this is usually not a problem.

However, repeatedly spreading very large arrays or objects can:

- Allocate additional memory.
- Create unnecessary copies.
- Reduce performance.

For everyday applications, Spread is perfectly acceptable, but for performance-critical code involving very large collections, it's worth being mindful of the extra copying.

---

### 💻 Example

Using our running example:

```js
const company = {
  name: "Vaibhav Docs",
};

const technologies = ["JavaScript", "React"];

const updatedCompany = {
  ...company,
  founded: 2024,
};

const fullStack = [
  ...technologies,
  "Node.js",
];

function printSkills(...skills) {
  console.log(skills);
}

printSkills(...fullStack);
```

Output:

```text
[
  "JavaScript",
  "React",
  "Node.js"
]
```

This example demonstrates:

- Spread with objects.
- Spread with arrays.
- Spread during function calls.
- Rest parameters inside functions.

---

### 📊 Diagram / Flow

#### Spread

```text
Array

↓

Expand

↓

Individual Values
```

---

#### Rest

```text
Multiple Values

↓

Collect

↓

Array
```

---

#### Spread vs Rest

```text
...

│

├── Right Side

│      Spread

│
└── Function Parameters

       Rest
```

---

#### Array Example

```text
["JS", "React"]

↓

...

↓

"JS"

"React"
```

---

#### Rest Example

```text
10

20

30

↓

...

↓

[10, 20, 30]
```

---

### 🌍 Real-World Example

Imagine unpacking and packing luggage.

With **Spread**, you open a suitcase and lay out every item individually.

```text
Suitcase

↓

Laptop

Book

Headphones

Notebook
```

The contents are **expanded**.

---

With **Rest**, you do the opposite.

You gather several individual items and pack them into a single suitcase.

```text
Laptop

Book

Headphones

↓

Suitcase
```

The items are **collected**.

This is exactly how JavaScript treats the `...` operator.

- **Spread** unpacks.
- **Rest** packs.

The syntax is identical, but the context determines which behavior JavaScript uses.

---

### 🎤 Interview Answer

The Spread and Rest operators both use the `...` syntax but perform opposite operations. The **Spread Operator** expands arrays, objects, or other iterables into individual elements, making it useful for copying arrays, merging objects, and passing function arguments. The **Rest Operator** collects multiple values into a single array or object and is commonly used in function parameters and destructuring. JavaScript determines whether `...` represents Spread or Rest based on its context. A simple way to remember the difference is: **Spread expands, Rest collects.**

---

### ❓ Follow-up Questions

1. What is the difference between the Spread and Rest operators?
2. How does JavaScript know whether `...` is Spread or Rest?
3. Why must the Rest parameter be the last function parameter?
4. How does the Spread operator work with arrays and objects?
5. What are the performance implications of using Spread on large arrays?
6. When should you use Spread instead of methods like `concat()` or `Object.assign()`?

---

## 6. What do the `typeof`, `delete`, `in`, and `instanceof` operators do?

### 📖 Overview

JavaScript provides several **special-purpose operators** that don't fit into categories like arithmetic or comparison.

Four of the most commonly used are:

- `typeof`
- `delete`
- `in`
- `instanceof`

Each serves a different purpose:

- **`typeof`** → Checks the type of a value.
- **`delete`** → Removes a property from an object.
- **`in`** → Checks whether a property exists in an object.
- **`instanceof`** → Checks whether an object was created from a particular constructor or class.

These operators are frequently used in real-world applications for validation, object manipulation, and runtime type checking.

---

### ⚙️ Main Explanation

### The `typeof` Operator

#### What is `typeof`?

The `typeof` operator returns the type of a value as a string.

Syntax:

```js
typeof value;
```

Example:

```js
const company = "Vaibhav Docs";

console.log(typeof company);
```

Output:

```text
string
```

Some common examples:

```js
typeof 2024;
```

Output:

```text
number
```

```js
typeof true;
```

Output:

```text
boolean
```

```js
typeof undefined;
```

Output:

```text
undefined
```

```js
typeof {};
```

Output:

```text
object
```

```js
typeof [];
```

Output:

```text
object
```

Arrays are objects in JavaScript.

```js
typeof function () {};
```

Output:

```text
function
```

Although functions are technically objects, JavaScript returns `"function"` because it is useful for developers.

> 💡 **Coming Next**
>
> We explored `typeof`, `typeof null`, and related edge cases in detail in the **Data Types** chapter.

---

### The `delete` Operator

#### What is `delete`?

The `delete` operator removes a property from an object.

Example:

```js
const company = {
  name: "Vaibhav Docs",
  founded: 2024,
};

delete company.founded;

console.log(company);
```

Output:

```text
{
  name: "Vaibhav Docs"
}
```

The property no longer exists.

#### Does `delete` Remove Variables?

No.

```js
let company = "Vaibhav Docs";

delete company;
```

The variable remains unchanged.

The `delete` operator is designed for **object properties**, not variables declared with `let`, `const`, or `var`.

#### Does `delete` Remove Array Elements?

Yes, but with an important detail.

```js
const technologies = [
  "JavaScript",
  "React",
  "Node.js",
];

delete technologies[1];

console.log(technologies);
```

Output:

```text
["JavaScript", empty, "Node.js"]
```

Notice that the array length does **not** change.

The element is removed, but an empty slot remains.

If you want to remove an element and shift the remaining elements, use methods like `splice()` instead.

---

### The `in` Operator

#### What is `in`?

The `in` operator checks whether a property exists in an object.

Syntax:

```js
propertyName in object;
```

Example:

```js
const company = {
  name: "Vaibhav Docs",
};

console.log("name" in company);
```

Output:

```text
true
```

Another example:

```js
console.log("city" in company);
```

Output:

```text
false
```

The property does not exist.

#### `in` with Arrays

The `in` operator checks **indexes**, not values.

Example:

```js
const technologies = [
  "JavaScript",
  "React",
];

console.log(0 in technologies);
```

Output:

```text
true
```

Because index `0` exists.

However:

```js
console.log("React" in technologies);
```

Output:

```text
false
```

`"React"` is a value, not an index.

---

### The `instanceof` Operator

#### What is `instanceof`?

The `instanceof` operator checks whether an object was created from a particular constructor or class.

Syntax:

```js
object instanceof Constructor;
```

Example:

```js
const today = new Date();

console.log(today instanceof Date);
```

Output:

```text
true
```

Another example:

```js
const technologies = [];

console.log(technologies instanceof Array);
```

Output:

```text
true
```

Objects also satisfy the `Object` constructor.

```js
console.log(technologies instanceof Object);
```

Output:

```text
true
```

Because arrays inherit from objects.

---

### `typeof` vs `instanceof`

These operators answer different questions.

`typeof`

```js
typeof [];
```

Output:

```text
object
```

`instanceof`

```js
[] instanceof Array;
```

Output:

```text
true
```

- `typeof` tells you the general type of a value.
- `instanceof` tells you whether an object was created from a particular constructor or class.

---

### When Should You Use Each Operator?

| Operator | Common Use |
|----------|------------|
| `typeof` | Check primitive types |
| `delete` | Remove object properties |
| `in` | Check whether a property exists |
| `instanceof` | Check object or class relationships |

---

### 💻 Example

Using our running example:

```js
const company = {
  name: "Vaibhav Docs",
  founded: 2024,
};

console.log(typeof company.name);

console.log("founded" in company);

delete company.founded;

console.log("founded" in company);

const technologies = ["JavaScript"];

console.log(technologies instanceof Array);
```

Output:

```text
string

true

false

true
```

This example demonstrates all four operators together.

---

### 📊 Diagram / Flow

#### `typeof`

```text
Value

↓

typeof

↓

Type Name
```

#### `delete`

```text
Object

↓

Delete Property

↓

Updated Object
```

#### `in`

```text
Property Name

↓

Exists?

│

├── Yes

│     true

│
└── No

      false
```

#### `instanceof`

```text
Object

↓

Constructor?

│

├── Yes

│     true

│
└── No

      false
```

---

### 🌍 Real-World Example

Imagine a company's employee management system.

The HR department performs different checks.

**`typeof`**

"What type of information is this?"

```text
Salary

↓

Number
```

**`delete`**

Remove an employee's old phone number from their profile.

```text
Employee Record

↓

Delete Phone Number

↓

Updated Record
```

**`in`**

Check whether an employee record contains an emergency contact.

```text
Emergency Contact

↓

Exists?

↓

Yes / No
```

**`instanceof`**

Verify whether a person belongs to a particular department.

```text
Employee

↓

Engineering Team?

↓

Yes / No
```

Each operator answers a different kind of question, making them useful in different situations.

---

### 🎤 Interview Answer

JavaScript provides several special-purpose operators. The `typeof` operator returns the type of a value and is commonly used for primitive type checking. The `delete` operator removes properties from objects but does not remove variables declared with `let`, `const`, or `var`. The `in` operator checks whether a property exists in an object or whether an index exists in an array. The `instanceof` operator checks whether an object was created from a specific constructor or class by examining its prototype chain. Each operator has a distinct purpose and is commonly used for validation, object manipulation, and runtime type checking.

---

### ❓ Follow-up Questions

1. What is the difference between `typeof` and `instanceof`?
2. Why does `typeof []` return `"object"`?
3. Does the `delete` operator remove variables?
4. How does the `in` operator behave with arrays?
5. How does `instanceof` determine whether an object belongs to a constructor?
6. When should you use `typeof` instead of `instanceof`?

---

## 7. What are Operator Precedence and Associativity?

### 📖 Overview

JavaScript expressions often contain multiple operators.

For example:

```js
10 + 5 * 2
```

Should JavaScript:

- Add first?
- Multiply first?

Similarly:

```js
a = b = c = 10;
```

Should the assignments happen from left to right or right to left?

To answer these questions, JavaScript follows two important rules:

- **Operator Precedence** → Determines **which operator executes first**.
- **Operator Associativity** → Determines **the execution direction when operators have the same precedence**.

Understanding these rules helps you predict how complex expressions are evaluated and write code that is both correct and readable.

---

### ⚙️ Main Explanation

### What is Operator Precedence?

**Operator Precedence** determines **which operator is evaluated first** when an expression contains multiple operators.

Consider:

```js
10 + 5 * 2;
```

Output:

```text
20
```

Why?

Because multiplication (`*`) has **higher precedence** than addition (`+`).

JavaScript evaluates the expression like this:

```text
10 + (5 * 2)

↓

10 + 10

↓

20
```

It does **not** evaluate from left to right.

---

Another example:

```js
100 - 20 / 2;
```

Output:

```text
90
```

Evaluation:

```text
100 - (20 / 2)

↓

100 - 10

↓

90
```

---

### Common Operator Precedence

Some commonly used operators in order of higher to lower precedence:

| Precedence | Operators |
|------------|-----------|
| Highest | `()` Grouping |
| | Member access (`.` `[]` `?.`) |
| | Function call `()` |
| | Unary (`!`, `typeof`, `++`, `--`) |
| | `*`, `/`, `%` |
| | `+`, `-` |
| | Comparison (`>`, `<`, `>=`, `<=`) |
| | Equality (`==`, `===`, `!=`, `!==`) |
| | Logical AND (`&&`) |
| | Logical OR (`||`) |
| | Nullish Coalescing (`??`) |
| | Ternary (`?:`) |
| Lowest | Assignment (`=` `+=` `-=`) |

You don't need to memorize the entire table, but it's useful to know the most common rules.

---

### What is Associativity?

Associativity determines **the direction in which operators of the same precedence are evaluated**.

There are two types:

- Left-to-Right
- Right-to-Left

---

### Left-to-Right Associativity

Most operators are evaluated from left to right.

Example:

```js
20 - 5 - 3;
```

Evaluation:

```text
(20 - 5)

↓

15 - 3

↓

12
```

Output:

```text
12
```

---

Another example:

```js
100 / 5 / 2;
```

Evaluation:

```text
(100 / 5)

↓

20 / 2

↓

10
```

---

### Right-to-Left Associativity

Assignment operators are evaluated from right to left.

Example:

```js
let a;
let b;
let c;

a = b = c = 10;
```

Evaluation:

```text
c = 10

↓

b = 10

↓

a = 10
```

Output:

```text
a = 10

b = 10

c = 10
```

---

### How Do Parentheses Affect Precedence?

Parentheses always have the highest precedence.

They allow you to override JavaScript's default evaluation order.

Example:

```js
(10 + 5) * 2;
```

Output:

```text
30
```

Without parentheses:

```js
10 + 5 * 2;
```

Output:

```text
20
```

Parentheses make your intent explicit and improve readability.

---

### Evaluation Order of Complex Expressions

Consider:

```js
10 + 5 * 2 > 15 && true;
```

JavaScript evaluates the expression step by step.

```text
Step 1

5 * 2

↓

10

-------------------

Step 2

10 + 10

↓

20

-------------------

Step 3

20 > 15

↓

true

-------------------

Step 4

true && true

↓

true
```

Final Output:

```text
true
```

JavaScript doesn't evaluate expressions randomly—it follows precedence and associativity rules consistently.

---

### Why Should You Use Parentheses?

Even when you know the precedence rules, parentheses make expressions easier to read.

Instead of:

```js
price + tax * discount;
```

Prefer:

```js
price + (tax * discount);
```

The result is the same, but the intention is much clearer for anyone reading the code.

---

### Best Practices

When writing expressions:

- Learn the precedence of common operators.
- Use parentheses to make complex expressions easier to understand.
- Don't rely on readers remembering precedence tables.
- Break overly complex expressions into smaller variables if needed.

Readable code is usually better than clever code.

---

### 💻 Example

Using our running example:

```js
const employees = 20;

const newEmployees = employees + 5 * 2;

const isHiring = newEmployees > 25 && true;

console.log(newEmployees);

console.log(isHiring);

let a;
let b;
let c;

a = b = c = 100;

console.log(a, b, c);
```

Output:

```text
30

true

100 100 100
```

This example demonstrates:

- Operator precedence
- Logical evaluation
- Right-to-left assignment

---

### 📊 Diagram / Flow

#### Operator Precedence

```text
Expression

↓

Highest Precedence

↓

Lowest Precedence

↓

Final Result
```

---

#### Associativity

```text
Same Precedence?

│

├── Left-to-Right

│      +  -  *  /

│
└── Right-to-Left

       =
```

---

#### Parentheses

```text
Without ()

10 + 5 * 2

↓

20

-------------------

With ()

(10 + 5) * 2

↓

30
```

---

#### Complex Evaluation

```text
10 + 5 * 2 > 15 && true

↓

*

↓

+

↓

>

↓

&&

↓

Result
```

---

### 🌍 Real-World Example

Imagine following a recipe.

The instructions say:

```text
Bake the cake

↓

Decorate it

↓

Serve it
```

You wouldn't decorate the cake **before** baking it.

The recipe already defines the correct order.

Operator precedence works the same way.

It tells JavaScript **which operation must happen first**.

Now imagine two tasks that have the same priority.

```text
Pack Box A

Pack Box B

Pack Box C
```

If all tasks have equal priority, you need a direction.

Do you pack from left to right or right to left?

That's exactly what **associativity** determines.

Together:

- **Precedence** decides **what happens first**.
- **Associativity** decides **the direction** when priorities are equal.

---

### 🎤 Interview Answer

Operator precedence determines which operator JavaScript evaluates first when an expression contains multiple operators. For example, multiplication has higher precedence than addition, so `10 + 5 * 2` evaluates to `20`. Associativity determines the evaluation direction when operators have the same precedence. Most operators, such as `+` and `-`, are evaluated from left to right, while assignment operators are evaluated from right to left. Parentheses have the highest precedence and are commonly used to override the default evaluation order and improve code readability.

---

### ❓ Follow-up Questions

1. What is the difference between operator precedence and associativity?
2. Why does `10 + 5 * 2` evaluate to `20` instead of `30`?
3. Why are assignment operators evaluated from right to left?
4. How do parentheses affect operator precedence?
5. How does JavaScript evaluate complex expressions containing multiple operators?
6. Why are parentheses recommended even when precedence rules are known?

---

## 8. What are Assignment, Arithmetic, and Bitwise Operators?

### 📖 Overview

Assignment, Arithmetic, and Bitwise operators are among the most frequently used operators in JavaScript.

They serve different purposes:

- **Assignment Operators** store or update values in variables.
- **Arithmetic Operators** perform mathematical calculations.
- **Bitwise Operators** perform operations directly on the binary representation of numbers.

Assignment and Arithmetic operators are used in almost every JavaScript program, while Bitwise operators are more common in low-level programming, graphics, networking, and performance-critical applications.

---

### ⚙️ Main Explanation

### Assignment Operators

#### What are Assignment Operators?

Assignment operators assign values to variables.

The simplest assignment operator is:

```js
=
```

Example:

```js
let employees = 20;
```

The value `20` is assigned to the variable `employees`.

---

#### Compound Assignment Operators

JavaScript also provides shorthand assignment operators.

Instead of writing:

```js
employees = employees + 5;
```

You can write:

```js
employees += 5;
```

Both produce the same result.

Other compound assignment operators include:

| Operator | Equivalent To |
|----------|---------------|
| `+=` | `a = a + b` |
| `-=` | `a = a - b` |
| `*=` | `a = a * b` |
| `/=` | `a = a / b` |
| `%=` | `a = a % b` |
| `**=` | `a = a ** b` |

Example:

```js
let score = 10;

score *= 3;

console.log(score);
```

Output:

```text
30
```

---

### Arithmetic Operators

#### What are Arithmetic Operators?

Arithmetic operators perform mathematical calculations.

| Operator | Description |
|----------|-------------|
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Remainder |
| `**` | Exponentiation |
| `++` | Increment |
| `--` | Decrement |

---

#### Addition

```js
10 + 5;
```

Output:

```text
15
```

---

#### Subtraction

```js
10 - 5;
```

Output:

```text
5
```

---

#### Multiplication

```js
10 * 5;
```

Output:

```text
50
```

---

#### Division

```js
10 / 2;
```

Output:

```text
5
```

---

#### Remainder (`%`)

The remainder operator returns the remainder after division.

```js
10 % 3;
```

Output:

```text
1
```

It is commonly used to:

- Check even or odd numbers.
- Cycle through indexes.
- Perform modular arithmetic.

Example:

```js
8 % 2;
```

Output:

```text
0
```

The number is even.

---

#### Exponentiation (`**`)

The exponentiation operator raises a number to a power.

```js
2 ** 3;
```

Output:

```text
8
```

Equivalent to:

```text
2 × 2 × 2
```

---

#### Increment (`++`)

The increment operator increases a value by one.

```js
let count = 5;

count++;

console.log(count);
```

Output:

```text
6
```

---

#### Decrement (`--`)

The decrement operator decreases a value by one.

```js
let count = 5;

count--;

console.log(count);
```

Output:

```text
4
```

---

### Bitwise Operators

#### What are Bitwise Operators?

Bitwise operators work on the **binary representation** of numbers.

Instead of operating on decimal values, JavaScript first converts numbers into binary.

Example:

```text
5

↓

00000101
```

Bitwise operators then manipulate these binary bits.

---

#### Common Bitwise Operators

| Operator | Description |
|----------|-------------|
| `&` | AND |
| `|` | OR |
| `^` | XOR |
| `~` | NOT |
| `<<` | Left Shift |
| `>>` | Signed Right Shift |
| `>>>` | Unsigned Right Shift |

---

#### Bitwise AND (`&`)

The AND operator returns `1` only when both corresponding bits are `1`.

Example:

```js
5 & 3;
```

Binary:

```text
5

101

3

011

---------

001
```

Output:

```text
1
```

---

#### Bitwise OR (`|`)

The OR operator returns `1` if either bit is `1`.

Example:

```js
5 | 3;
```

Binary:

```text
101

011

---------

111
```

Output:

```text
7
```

---

#### Left Shift (`<<`)

The left shift operator moves bits to the left.

```js
5 << 1;
```

Binary:

```text
00000101

↓

00001010
```

Output:

```text
10
```

Each left shift approximately doubles the value.

---

#### Right Shift (`>>`)

The right shift operator moves bits to the right.

```js
8 >> 1;
```

Binary:

```text
00001000

↓

00000100
```

Output:

```text
4
```

Each right shift approximately halves the value.

---

### When Are Bitwise Operators Used?

Bitwise operators are less common in typical web development.

They are mainly used for:

- Graphics programming.
- File permissions.
- Network protocols.
- Compression algorithms.
- Performance optimization.
- Embedded systems.

For most frontend and backend JavaScript applications, you'll rarely need them.

---

### 💻 Example

Using our running example:

```js
let employees = 20;

employees += 5;

const totalProjects = employees * 2;

const isEven = totalProjects % 2 === 0;

const doubled = 5 << 1;

console.log(employees);

console.log(totalProjects);

console.log(isEven);

console.log(doubled);
```

Output:

```text
25

50

true

10
```

This example demonstrates:

- Assignment operators.
- Arithmetic operators.
- A simple bitwise operation.

---

### 📊 Diagram / Flow

#### Assignment Operators

```text
Variable

↓

Assignment Operator

↓

Updated Value
```

---

#### Arithmetic Operators

```text
Operand

↓

Arithmetic Operator

↓

Operand

↓

Result
```

---

#### Bitwise Operators

```text
Decimal Number

↓

Binary

↓

Bitwise Operation

↓

Binary Result

↓

Decimal Result
```

---

#### Left Shift

```text
5

↓

101

↓

<< 1

↓

1010

↓

10
```

---

### 🌍 Real-World Example

Imagine managing a company's employee records.

**Assignment Operators**

Updating employee count.

```text
20 Employees

↓

+ 5 New Employees

↓

25 Employees
```

---

**Arithmetic Operators**

Calculating salaries or project budgets.

```text
₹50,000

×

12 Months

↓

Annual Salary
```

---

**Bitwise Operators**

Imagine every employee has an access card.

Each permission is represented by a binary bit.

```text
Read

Write

Delete

↓

101
```

Bitwise operations can quickly combine or check these permissions.

This is why bitwise operators are commonly used in systems programming and permission management.

---

### 🎤 Interview Answer

Assignment operators are used to assign or update values in variables, with operators like `=`, `+=`, and `*=` providing concise ways to modify values. Arithmetic operators perform mathematical operations such as addition, subtraction, multiplication, division, remainder, exponentiation, increment, and decrement. Bitwise operators work directly on the binary representation of numbers using operators like `&`, `|`, `^`, `<<`, and `>>`. While Assignment and Arithmetic operators are used daily in JavaScript development, Bitwise operators are mainly used in specialized areas such as graphics, networking, compression, and permission management.

---

### ❓ Follow-up Questions

1. What is the difference between `=` and `+=`?
2. When would you use the remainder (`%`) operator?
3. What is the difference between `++count` and `count++`?
4. How do bitwise operators work internally?
5. What is the difference between `>>` and `>>>`?
6. In which real-world scenarios are bitwise operators commonly used?

---

## 9. What are Common Operator Pitfalls in JavaScript?

### 📖 Overview

JavaScript operators are simple to use, but some of them can produce **unexpected results** if you're not familiar with their behavior.

Most operator-related bugs happen because of:

- Implicit type coercion
- Misunderstanding operator behavior
- Incorrect assumptions about precedence
- Using the wrong operator for the situation

Knowing these common pitfalls helps you write safer, more predictable code and prepares you for many interview questions.

---

### ⚙️ Main Explanation

### Pitfall 1: Using `==` Instead of `===`

One of the most common mistakes is using loose equality (`==`) when strict equality (`===`) is intended.

Example:

```js
console.log(10 == "10");
```

Output:

```text
true
```

Because JavaScript automatically converts the string to a number.

Using strict equality:

```js
console.log(10 === "10");
```

Output:

```text
false
```

**Recommendation:**

Prefer `===` unless you intentionally want type coercion.

---

### Pitfall 2: Using `||` for Default Values

Before the Nullish Coalescing Operator (`??`) was introduced, developers often wrote:

```js
const quantity = 0;

const value = quantity || 100;

console.log(value);
```

Output:

```text
100
```

This is incorrect because `0` is a valid value.

Using `??`:

```js
const value = quantity ?? 100;
```

Output:

```text
0
```

**Recommendation:**

Use `??` when only `null` and `undefined` should trigger a default value.

---

### Pitfall 3: Forgetting that `&&` and `||` Return Operands

Many beginners assume these operators always return `true` or `false`.

Example:

```js
console.log("JavaScript" && "React");
```

Output:

```text
React
```

Another example:

```js
console.log("" || "Default");
```

Output:

```text
Default
```

These operators return one of their operands, not necessarily a Boolean value.

---

### Pitfall 4: Forgetting Operator Precedence

Consider:

```js
console.log(10 + 5 * 2);
```

Output:

```text
20
```

Some developers mistakenly expect:

```text
30
```

because they assume evaluation happens from left to right.

Using parentheses removes any ambiguity.

```js
console.log((10 + 5) * 2);
```

Output:

```text
30
```

---

### Pitfall 5: Misusing the Spread Operator

The Spread Operator creates a **shallow copy**, not a deep copy.

Example:

```js
const company = {
  name: "Vaibhav Docs",
  address: {
    city: "Lucknow",
  },
};

const copied = {
  ...company,
};

copied.address.city = "Delhi";

console.log(company.address.city);
```

Output:

```text
Delhi
```

The nested object is still shared between both objects.

**Recommendation:**

Remember that Spread only copies the first level.

---

### Pitfall 6: Using `delete` on Arrays

Some developers expect `delete` to remove an array element completely.

Example:

```js
const technologies = [
  "JavaScript",
  "React",
  "Node.js",
];

delete technologies[1];

console.log(technologies);
```

Output:

```text
["JavaScript", empty, "Node.js"]
```

The array length remains unchanged.

To remove an element properly, use:

```js
technologies.splice(1, 1);
```

---

### Pitfall 7: Confusing `typeof` with `instanceof`

Example:

```js
const technologies = [];

console.log(typeof technologies);
```

Output:

```text
object
```

Some developers expect:

```text
array
```

To check whether a value is an array:

```js
console.log(technologies instanceof Array);
```

or preferably:

```js
console.log(Array.isArray(technologies));
```

Output:

```text
true
```

---

### Pitfall 8: Misunderstanding Increment Operators

Developers often assume these behave the same.

```js
let count = 5;

console.log(count++);
```

Output:

```text
5
```

Now:

```js
console.log(count);
```

Output:

```text
6
```

Compare that with:

```js
let count = 5;

console.log(++count);
```

Output:

```text
6
```

`count++`

- Returns the current value.
- Then increments.

`++count`

- Increments first.
- Then returns the updated value.

---

### Pitfall 9: Comparing Objects Instead of References

Example:

```js
const company1 = {
  name: "Vaibhav Docs",
};

const company2 = {
  name: "Vaibhav Docs",
};

console.log(company1 === company2);
```

Output:

```text
false
```

Objects are compared by **reference**, not by their contents.

---

### Why Do These Pitfalls Occur?

Most of these issues happen because JavaScript tries to be flexible.

Features like:

- Type coercion
- Short-circuit evaluation
- Shallow copying

make the language convenient but can also surprise developers who don't understand the underlying behavior.

---

### 💻 Example

Using our running example:

```js
const company = {
  name: "Vaibhav Docs",
  address: {
    city: "Lucknow",
  },
};

const copied = {
  ...company,
};

copied.address.city = "Delhi";

console.log(company.address.city);

console.log(0 || 100);

console.log(0 ?? 100);

console.log(10 == "10");

console.log(10 === "10");
```

Output:

```text
Delhi

100

0

true

false
```

This example demonstrates several common operator pitfalls in a single program.

---

### 📊 Diagram / Flow

#### `==`

```text
Different Types

↓

Type Coercion

↓

Comparison
```

---

#### `||` vs `??`

```text
||

Falsy?

↓

Default Value

-------------------

??

null / undefined?

↓

Default Value
```

---

#### Spread

```text
Original Object

↓

Spread

↓

New Object

↓

Nested Objects Shared
```

---

#### Post vs Pre Increment

```text
count++

↓

Return

↓

Increment

-------------------

++count

↓

Increment

↓

Return
```

---

### 🌍 Real-World Example

Imagine photocopying a company's employee file.

The main document is copied.

However, any attached documents are **shared** between both copies.

If someone edits an attached document, both files appear to change.

This is similar to the Spread Operator creating a **shallow copy**.

Now imagine two employees with the same name.

Comparing only their names doesn't prove they are the same person.

You must compare their employee IDs.

Likewise, JavaScript compares **object references**, not their contents.

Many operator pitfalls arise because JavaScript follows precise rules that may differ from our initial expectations.

---

### 🎤 Interview Answer

Common operator pitfalls in JavaScript include using `==` instead of `===`, relying on `||` for default values instead of `??`, forgetting that `&&` and `||` return operands rather than Booleans, misunderstanding operator precedence, assuming the Spread operator performs a deep copy, using `delete` to remove array elements, confusing `typeof` with `instanceof`, misunderstanding pre- and post-increment operators, and comparing objects by value instead of by reference. Understanding these behaviors helps avoid subtle bugs and leads to more predictable JavaScript code.

---

### ❓ Follow-up Questions

1. Why is `===` generally preferred over `==`?
2. Why is `??` safer than `||` for default values?
3. Why does the Spread operator perform only a shallow copy?
4. What is the difference between `count++` and `++count`?
5. Why does `delete` leave empty slots in arrays?
6. Why are objects compared by reference instead of by value?

---

## 10. What are the Best Practices for Using Operators in Modern JavaScript?

### 📖 Overview

JavaScript offers a rich set of operators that make the language expressive and flexible. However, using operators effectively isn't just about knowing what they do—it's about choosing the right operator for the right situation.

Following a few best practices can help you:

- Write cleaner and more readable code.
- Avoid unexpected bugs.
- Make your code easier for others to understand.
- Follow modern JavaScript conventions used in professional projects.

These practices are widely adopted in production code and are often discussed during technical interviews.

---

### ⚙️ Main Explanation

### 1. Prefer `===` and `!==` over `==` and `!=`

Strict equality compares both the **value** and the **data type**, making comparisons more predictable.

Prefer:

```js
if (age === 18) {
  console.log("Adult");
}
```

Instead of:

```js
if (age == 18) {
  console.log("Adult");
}
```

Using `===` avoids unexpected behavior caused by implicit type coercion.

---

### 2. Use `??` Instead of `||` for Default Values

The logical OR operator treats every Falsy value as missing.

```js
const quantity = 0;

const value = quantity || 100;
```

Output:

```text
100
```

If `0` is a valid value, this is incorrect.

Using `??`:

```js
const value = quantity ?? 100;
```

Output:

```text
0
```

Use `??` when only `null` or `undefined` should trigger a default value.

---

### 3. Use Optional Chaining for Optional Data

Instead of writing multiple nested checks:

```js
if (user && user.profile && user.profile.name) {
  console.log(user.profile.name);
}
```

Use:

```js
console.log(user.profile?.name);
```

The code is shorter, cleaner, and prevents runtime errors.

---

### 4. Use Parentheses to Improve Readability

Even if you know operator precedence, don't assume everyone reading your code does.

Instead of:

```js
const total = price + tax * quantity;
```

Prefer:

```js
const total = price + (tax * quantity);
```

The result is the same, but the intention is much clearer.

---

### 5. Avoid Overly Complex Expressions

Long expressions are difficult to read and debug.

Instead of:

```js
const result =
  price > 100 &&
  quantity > 5 &&
  user?.isPremium &&
  isAvailable;
```

Consider breaking the logic into smaller variables.

```js
const isEligible =
  price > 100 &&
  quantity > 5;

const canPurchase =
  isEligible &&
  user?.isPremium &&
  isAvailable;
```

This improves readability and makes debugging easier.

---

### 6. Be Careful with the Spread Operator

Remember that Spread creates a **shallow copy**.

```js
const copied = {
  ...company,
};
```

Nested objects remain shared.

If you need a completely independent copy of nested data, you'll need a deep copy strategy.

---

### 7. Don't Use `delete` to Remove Array Elements

Instead of:

```js
delete technologies[1];
```

Use:

```js
technologies.splice(1, 1);
```

or, when you don't want to mutate the original array:

```js
const updated = technologies.filter(
  (_, index) => index !== 1
);
```

These approaches keep the array continuous without leaving empty slots.

---

### 8. Use Descriptive Variables Instead of Clever Expressions

Instead of writing:

```js
return age >= 18 && hasLicense && !isSuspended;
```

Consider:

```js
const canDrive =
  age >= 18 &&
  hasLicense &&
  !isSuspended;

return canDrive;
```

Named variables make your code easier to understand and maintain.

---

### 9. Know When Short-Circuit Evaluation is Appropriate

Short-circuit evaluation is powerful, but it should be used intentionally.

Good example:

```js
isLoggedIn && loadDashboard();
```

Less readable example:

```js
condition &&
doSomething() &&
doAnotherThing() &&
doFinalThing();
```

If multiple actions are involved, an `if` statement is usually easier to understand.

---

### 10. Write Code for Humans First

Modern JavaScript provides many concise operators.

However, shorter code is not always better.

Choose the version that is easiest to read.

Readable code is usually easier to test, debug, and maintain.

---

### 💻 Example

Using our running example:

```js
const company = {
  name: "Vaibhav Docs",
};

const employeeCount = 0;

const displayCount =
  employeeCount ?? 100;

const city =
  company.address?.city ?? "Unknown";

const isGrowing =
  displayCount > 20;

console.log(displayCount);

console.log(city);

console.log(isGrowing);
```

Output:

```text
0

Unknown

false
```

This example demonstrates several modern JavaScript best practices:

- Using `??` for default values.
- Using `?.` for safe property access.
- Breaking logic into descriptive variables.

---

### 📊 Diagram / Flow

#### Modern Operator Choices

```text
Comparison

↓

===

-------------------

Default Value

↓

??

-------------------

Safe Property Access

↓

?.
```

---

#### Readable Expressions

```text
Complex Expression

↓

Break into Variables

↓

Clear Logic
```

---

#### Choosing Operators

```text
Need Comparison?

↓

===

-------------------

Need Default Value?

↓

??

-------------------

Need Safe Property Access?

↓

?.
```

---

#### Code Readability

```text
Readable Code

↓

Easy to Understand

↓

Easy to Debug

↓

Easy to Maintain
```

---

### 🌍 Real-World Example

Imagine writing directions for someone visiting your office.

You could write:

```text
Turn left after the second signal,
then right after the bridge,
unless the road is closed,
otherwise continue straight...
```

While technically correct, it's difficult to follow.

A better approach is to break the directions into clear, simple steps.

Programming works the same way.

Using the right operators, adding parentheses when necessary, and avoiding overly clever expressions makes your code much easier for other developers to understand.

The goal isn't to write the shortest code—it's to write code that is clear, predictable, and maintainable.

---

### 🎤 Interview Answer

Modern JavaScript best practices include using `===` and `!==` instead of `==` and `!=`, using `??` instead of `||` for default values, using Optional Chaining (`?.`) to safely access nested properties, adding parentheses to improve readability, avoiding overly complex expressions, remembering that the Spread operator performs a shallow copy, avoiding `delete` on arrays, using descriptive variables, and using short-circuit evaluation appropriately. The overall goal is to write code that is predictable, readable, and easy to maintain.

---

### ❓ Follow-up Questions

1. Why is `===` preferred over `==` in production code?
2. When should you use `??` instead of `||`?
3. Why is Optional Chaining considered a best practice?
4. Why should complex expressions be broken into smaller variables?
5. What problems can arise from using the Spread operator incorrectly?
6. Why is readability often more important than writing shorter code?

---