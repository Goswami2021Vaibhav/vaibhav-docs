---
title: Numbers & Math
description: Floating-point precision, BigInt, and the Math object.
sidebar_position: 15
---

# Numbers & Math

## 1. What are Numbers, BigInt, and how do numbers work in JavaScript?

### 📖 Overview

Numbers are one of the most commonly used data types in JavaScript. Whether you're calculating prices, processing user input, generating random values, or working with dates, you'll constantly interact with numbers.

Unlike many programming languages that have separate data types for integers and floating-point values, JavaScript uses a single **`Number`** type for almost all numeric values.

However, `Number` has limitations. It cannot accurately represent extremely large integers. To solve this problem, **`BigInt`** was introduced in ES2020.

In this topic, we'll cover:

- The `Number` data type
- `BigInt`
- Safe integer range
- `NaN`
- `Infinity`
- Internal representation
- IEEE 754
- Number vs BigInt

---

### ⚙️ Main Explanation

#### What is the `Number` Data Type?

`Number` is JavaScript's numeric primitive type.

It represents:

- Integers
- Floating-point numbers
- Positive values
- Negative values
- Decimal values

Example:

```js
const age = 25;

const price = 99.99;

const temperature = -5;
```

All of these are of type:

```text
number
```

Example:

```js
typeof 42;
```

Output:

```text
number
```

---

#### What is `BigInt`?

`BigInt` is another numeric primitive introduced to represent **very large integers** that exceed the limits of the `Number` type.

Example:

```js
const large =
  12345678901234567890n;
```

Notice the `n` suffix.

Example:

```js
typeof large;
```

Output:

```text
bigint
```

You can also create a `BigInt` using:

```js
BigInt(
  "12345678901234567890"
);
```

---

#### Why Was `BigInt` Introduced?

JavaScript's `Number` type can safely represent integers only within a specific range.

Beyond that range, precision is lost.

Example:

```js
console.log(
  Number.MAX_SAFE_INTEGER
);
```

Output:

```text
9007199254740991
```

If we go beyond this value:

```js
console.log(
  Number.MAX_SAFE_INTEGER + 1
);

console.log(
  Number.MAX_SAFE_INTEGER + 2
);
```

Output:

```text
9007199254740992

9007199254740992
```

Both results become identical because precision has been lost.

`BigInt` solves this limitation.

---

#### Safe Integer Range

JavaScript provides two constants:

```text
Number.MAX_SAFE_INTEGER

↓

9007199254740991
```

and

```text
Number.MIN_SAFE_INTEGER

↓

-9007199254740991
```

Integers within this range can be represented exactly.

Outside this range, calculations may become unreliable.

---

#### What is `NaN`?

`NaN` stands for:

```text
Not a Number
```

It represents the result of an invalid numeric operation.

Example:

```js
Number(
  "Hello"
);
```

Output:

```text
NaN
```

Another example:

```js
0 / 0;
```

Output:

```text
NaN
```

Although its name suggests otherwise:

```js
typeof NaN;
```

Output:

```text
number
```

This is a common interview question.

---

#### `NaN` vs `undefined`

| `NaN` | `undefined` |
|--------|-------------|
| Invalid numeric result | Missing value |
| Type is `"number"` | Type is `"undefined"` |
| Produced during numeric operations | Produced when a value doesn't exist |

---

#### What is `Infinity`?

`Infinity` represents a value larger than every finite number.

Example:

```js
1 / 0;
```

Output:

```text
Infinity
```

Negative infinity:

```js
-1 / 0;
```

Output:

```text
-Infinity
```

---

#### When Does Infinity Occur?

Examples include:

```js
Math.pow(
  10,
  1000
);
```

or division by zero.

`Infinity` is still considered a valid numeric value.

Example:

```js
typeof Infinity;
```

Output:

```text
number
```

---

#### `Infinity` vs `NaN`

| `Infinity` | `NaN` |
|-------------|-------|
| Represents an infinitely large value | Represents an invalid numeric result |
| Valid numeric value | Invalid numeric value |
| Produced by overflow or division by zero | Produced by invalid calculations |

---

#### How Does JavaScript Represent Numbers Internally?

JavaScript stores all `Number` values using the **IEEE 754 double-precision floating-point format**.

This format uses:

```text
64 Bits

↓

Sign Bit

Exponent

Fraction (Mantissa)
```

Because every number uses this representation, integers and decimal values share the same underlying format.

---

#### What is IEEE 754?

IEEE 754 is an international standard for representing floating-point numbers.

It defines how computers store and perform calculations on decimal values.

Most modern programming languages use this standard.

One consequence is that some decimal values cannot be represented exactly, which leads to floating-point precision issues such as:

```js
0.1 + 0.2;
```

We'll explore this in detail in the next topic.

---

#### How Does JavaScript Distinguish Between `Number` and `BigInt`?

Although both represent numeric values, they are stored and handled differently.

| `Number` | `BigInt` |
|-----------|-----------|
| IEEE 754 floating-point | Arbitrary-size integer |
| Supports decimals | Integers only |
| Faster for most calculations | Slower but precise for huge integers |

The JavaScript engine internally tracks which numeric type is being used and applies the appropriate arithmetic rules.

---

#### `Number` vs `BigInt`

| `Number` | `BigInt` |
|-----------|-----------|
| Supports decimals | No decimal values |
| Limited safe integer range | Practically unlimited integer size |
| Faster | Slightly slower |
| Most common choice | Used for extremely large integers |

---

#### Best Practices

When working with numbers:

- Use `Number` for most calculations.
- Use `BigInt` only when integers may exceed the safe range.
- Be aware of `NaN` and `Infinity`.
- Remember that JavaScript stores all `Number` values using IEEE 754.
- Avoid relying on values outside the safe integer range.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Number Conversion and Validation**, covering `Number()`, `parseInt()`, `parseFloat()`, `Number.isNaN()`, `Number.isInteger()`, `Number.isFinite()`, and common validation techniques.

---

### 💻 Example

We'll use the following example throughout this chapter.

```js
console.log(
  Number.MAX_SAFE_INTEGER
);

console.log(
  1 / 0
);

console.log(
  Number("Hello")
);

const big =
  12345678901234567890n;

console.log(
  typeof big
);
```

Output:

```text
9007199254740991

Infinity

NaN

bigint
```

---

### 📊 Diagram / Flow

#### JavaScript Numeric Types

```text
Numbers

↓

Number

↓

Most Calculations

--------------------

BigInt

↓

Very Large Integers
```

---

#### Number Representation

```text
Number

↓

IEEE 754

↓

64-bit Floating Point
```

---

#### Invalid Calculation

```text
Invalid Operation

↓

NaN
```

---

#### Large Numbers

```text
Beyond Safe Integer

↓

Use BigInt
```

---

### 🌍 Real-World Example

Imagine you're building an e-commerce application.

- Product prices such as `499.99` use the **`Number`** type.
- A social media platform storing a massive unique identifier that exceeds the safe integer range could use **`BigInt`**.
- Dividing by zero during a calculation may produce **`Infinity`**, while attempting to convert invalid user input such as `"abc"` into a number results in **`NaN`**.

Understanding these numeric types helps prevent subtle bugs and ensures calculations remain accurate.

---

### 🎤 Interview Answer

JavaScript primarily uses the `Number` primitive type to represent both integers and floating-point values. Internally, all `Number` values are stored using the IEEE 754 double-precision floating-point format, which provides a safe integer range from `Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`. When integers exceed this range, precision is lost, so JavaScript introduced the `BigInt` type to represent arbitrarily large integers accurately. JavaScript also provides special numeric values such as `NaN`, which represents an invalid numeric result, and `Infinity`, which represents values beyond the finite numeric range. In practice, `Number` is suitable for most calculations, while `BigInt` should be used only when extremely large integers are required.

---

### ❓ Follow-up Questions

1. What is the difference between `Number` and `BigInt`?
2. Why was `BigInt` introduced?
3. What is the safe integer range in JavaScript?
4. What is `NaN`, and why is its type `"number"`?
5. What is the difference between `Infinity` and `NaN`?
6. How does JavaScript represent numbers internally?

---

## 2. Number Conversion and Validation

### 📖 Overview

In real-world applications, numbers often come from external sources such as:

- User input
- Form fields
- API responses
- URL query parameters
- JSON data

These values are usually received as **strings**, so they must be converted into numbers before performing calculations.

JavaScript provides several methods for conversion and validation, including:

- `Number()`
- `parseInt()`
- `parseFloat()`
- `Number.isNaN()`
- `Number.isInteger()`
- `Number.isFinite()`

Understanding the differences between these methods is a common interview topic.

---

### ⚙️ Main Explanation

#### `Number()`

`Number()` converts an entire value into a number.

If the entire value cannot be converted, it returns `NaN`.

Example:

```js
Number("123");
```

Output:

```text
123
```

---

Example:

```js
Number("123.45");
```

Output:

```text
123.45
```

---

Example:

```js
Number("123abc");
```

Output:

```text
NaN
```

Because the entire string isn't a valid number.

---

#### `parseInt()`

`parseInt()` converts a string into an **integer**.

It reads the string from left to right and stops when it encounters an invalid character.

Example:

```js
parseInt("123px");
```

Output:

```text
123
```

---

Example:

```js
parseInt("45.67");
```

Output:

```text
45
```

The decimal part is ignored.

---

It's considered a good practice to specify the radix (base).

```js
parseInt(
  "101",
  2
);
```

Output:

```text
5
```

---

#### `parseFloat()`

`parseFloat()` converts a string into a floating-point number.

Like `parseInt()`, it stops reading when it encounters an invalid character.

Example:

```js
parseFloat(
  "45.67px"
);
```

Output:

```text
45.67
```

---

Example:

```js
parseFloat(
  "123abc"
);
```

Output:

```text
123
```

---

#### `Number()` vs `parseInt()`

| `Number()` | `parseInt()` |
|-------------|--------------|
| Converts the entire value | Reads until an invalid character |
| Supports decimals | Returns only integers |
| Returns `NaN` if conversion fails | May still return a valid integer |

Example:

```js
Number("123px");
```

Output:

```text
NaN
```

---

Example:

```js
parseInt("123px");
```

Output:

```text
123
```

---

#### `Number()` vs `parseFloat()`

| `Number()` | `parseFloat()` |
|-------------|----------------|
| Requires the whole string to be numeric | Reads until an invalid character |
| Supports integers and decimals | Supports decimals only while parsing |
| Returns `NaN` for invalid strings | Can return a partial numeric value |

---

#### `parseInt()` vs `parseFloat()`

| `parseInt()` | `parseFloat()` |
|---------------|----------------|
| Returns an integer | Returns a floating-point number |
| Ignores decimal portion | Preserves decimal portion |

Example:

```js
parseInt("12.99");
```

Output:

```text
12
```

Example:

```js
parseFloat("12.99");
```

Output:

```text
12.99
```

---

#### `Number.isNaN()`

`Number.isNaN()` checks whether a value is actually the special numeric value `NaN`.

Example:

```js
Number.isNaN(
  NaN
);
```

Output:

```text
true
```

---

Example:

```js
Number.isNaN(
  "NaN"
);
```

Output:

```text
false
```

Because `"NaN"` is a string, not the numeric value `NaN`.

---

#### Global `isNaN()` vs `Number.isNaN()`

This is a very common interview question.

Global `isNaN()` first converts the value to a number before checking.

Example:

```js
isNaN("Hello");
```

Output:

```text
true
```

Because:

```js
Number("Hello");
```

becomes:

```text
NaN
```

---

Example:

```js
Number.isNaN(
  "Hello"
);
```

Output:

```text
false
```

No conversion occurs.

---

#### Comparison

| `isNaN()` | `Number.isNaN()` |
|------------|------------------|
| Performs type coercion | No type coercion |
| Less predictable | More reliable |
| Older API | Preferred in modern JavaScript |

---

#### `Number.isInteger()`

Checks whether a value is an integer.

Example:

```js
Number.isInteger(
  25
);
```

Output:

```text
true
```

---

Example:

```js
Number.isInteger(
  25.5
);
```

Output:

```text
false
```

---

#### `Number.isFinite()`

Checks whether a value is a finite number.

Example:

```js
Number.isFinite(
  100
);
```

Output:

```text
true
```

---

Example:

```js
Number.isFinite(
  Infinity
);
```

Output:

```text
false
```

---

Example:

```js
Number.isFinite(
  NaN
);
```

Output:

```text
false
```

---

#### Validating User Input

A common production scenario.

Suppose a user enters:

```text
"25"
```

You can validate it like this:

```js
const age =
  Number(input);

if (
  Number.isFinite(age)
) {
  console.log(
    "Valid Number"
  );
}
```

This ensures the value is a real, finite number before using it.

---

#### Best Practices

When converting and validating numbers:

- Use `Number()` when the entire value should be numeric.
- Use `parseInt()` for parsing integers from strings.
- Use `parseFloat()` for decimal values.
- Prefer `Number.isNaN()` over the global `isNaN()`.
- Use `Number.isFinite()` when validating numeric input from users or APIs.
- Specify the radix when using `parseInt()`.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Floating-Point Precision and Decimal Calculations**, including why `0.1 + 0.2 !== 0.3`, `Number.EPSILON`, financial calculations, and safely comparing decimal values.

---

### 💻 Example

We'll continue using our running example.

```js
const value =
  "123.45";

console.log(
  Number(value)
);

console.log(
  parseInt(value)
);

console.log(
  parseFloat(value)
);

console.log(
  Number.isInteger(
    42
  )
);

console.log(
  Number.isFinite(
    Infinity
  )
);
```

Output:

```text
123.45

123

123.45

true

false
```

---

### 📊 Diagram / Flow

#### Number Conversion

```text
String

↓

Number()

↓

Number

--------------------

String

↓

parseInt()

↓

Integer

--------------------

String

↓

parseFloat()

↓

Decimal Number
```

---

#### Validation

```text
Value

↓

Number.isFinite()

↓

Valid Number?
```

---

#### NaN Check

```text
Value

↓

Number.isNaN()

↓

true / false
```

---

### 🌍 Real-World Example

Imagine a registration form where a user enters their age.

```text
Input

↓

"25"

↓

Number()

↓

25

↓

Number.isInteger()

↓

Valid Age
```

Similarly, when parsing CSS values such as:

```text
"100px"
```

`parseInt()` extracts the numeric portion:

```text
100
```

Choosing the correct conversion method depends on the type of input you're processing.

---

### 🎤 Interview Answer

JavaScript provides several methods for converting and validating numeric values. `Number()` converts an entire value into a number and returns `NaN` if the conversion fails. `parseInt()` extracts an integer from the beginning of a string, while `parseFloat()` extracts a floating-point number. For validation, `Number.isNaN()` checks specifically for the numeric value `NaN` without type coercion, making it more reliable than the global `isNaN()`. `Number.isInteger()` verifies whether a value is an integer, and `Number.isFinite()` ensures that a value is a finite number rather than `NaN` or `Infinity`. These methods are commonly used when processing user input and API data.

---

### ❓ Follow-up Questions

1. What is the difference between `Number()`, `parseInt()`, and `parseFloat()`?
2. Why is `Number.isNaN()` preferred over the global `isNaN()`?
3. What does `Number.isInteger()` do?
4. What does `Number.isFinite()` check?
5. Why should you specify the radix when using `parseInt()`?
6. How would you validate whether user input is a valid number?

---

## 3. Floating-Point Precision and Decimal Calculations

### 📖 Overview

One of the most famous JavaScript interview questions is:

```js
0.1 + 0.2 === 0.3
```

The surprising result is:

```text
false
```

Many developers initially think this is a bug in JavaScript.

In reality, it happens because JavaScript stores numbers using the **IEEE 754 double-precision floating-point standard**, which cannot represent many decimal values exactly.

This isn't unique to JavaScript—languages like Java, C++, Python, and C# also experience similar floating-point precision issues.

In this topic, we'll cover:

- Floating-point precision
- Why decimal calculations can be inaccurate
- `Number.EPSILON`
- Safely comparing decimal values
- Financial calculations
- Production best practices

---

### ⚙️ Main Explanation

#### The Famous `0.1 + 0.2` Problem

Example:

```js
console.log(
  0.1 + 0.2
);
```

Output:

```text
0.30000000000000004
```

Therefore:

```js
console.log(
  0.1 + 0.2 ===
  0.3
);
```

Output:

```text
false
```

This happens because `0.1`, `0.2`, and `0.3` cannot be represented exactly in binary.

---

#### Why Does This Happen?

Computers store numbers in **binary (base 2)**.

Some decimal fractions that are simple in base 10 become repeating fractions in binary.

For example:

```text
Decimal

0.1
```

becomes an infinitely repeating binary fraction.

Since a computer has limited memory, it stores only an approximation.

The same applies to:

- `0.2`
- `0.3`

As a result:

```text
Stored 0.1

+

Stored 0.2

↓

0.30000000000000004
```

---

#### What is Floating-Point Precision?

Floating-point precision refers to the limited accuracy with which decimal numbers can be represented in binary.

Because only a finite number of bits is available, some decimal values are approximated.

This is known as a **floating-point precision error**.

---

#### Why Are Decimal Calculations Sometimes Inaccurate?

Since numbers are approximated internally, arithmetic operations can accumulate tiny rounding errors.

Example:

```js
console.log(
  0.1 + 0.7
);
```

Output:

```text
0.7999999999999999
```

These errors are usually very small, but they can become significant in financial or scientific applications.

---

#### What is `Number.EPSILON`?

`Number.EPSILON` is the smallest difference between:

```text
1

and

the next representable number greater than 1
```

Example:

```js
console.log(
  Number.EPSILON
);
```

Output:

```text
2.220446049250313e-16
```

It provides a tolerance value for comparing floating-point numbers.

---

#### How to Compare Floating-Point Numbers Correctly

Instead of:

```js
0.1 + 0.2 === 0.3;
```

Use:

```js
Math.abs(
  0.1 +
    0.2 -
    0.3
) < Number.EPSILON;
```

Output:

```text
true
```

This checks whether the difference between the two numbers is extremely small.

---

#### Why Use `Math.abs()`?

Floating-point errors can be positive or negative.

Example:

```text
0.00000000000000004
```

or

```text
-0.00000000000000004
```

`Math.abs()` converts both to a positive value, making the comparison reliable.

---

#### Financial Calculations

Financial applications should **avoid direct floating-point arithmetic** whenever possible.

Example:

```js
const total =
  0.1 + 0.2;
```

This may produce an unexpected result.

A common approach is to work with the smallest currency unit.

Example:

```js
const price1 = 10; // cents

const price2 = 20; // cents

const total =
  price1 + price2;

console.log(
  total / 100
);
```

Output:

```text
0.3
```

Instead of storing dollars:

```text
10.99
```

store:

```text
1099
```

This avoids floating-point precision issues.

---

#### Why Not Use `BigInt` for Money?

Although `BigInt` avoids precision loss for integers, it **cannot represent decimal values**.

Money often contains fractional units:

```text
₹10.50

$19.99
```

Therefore, financial applications usually store values as integers representing the smallest unit (such as paise or cents) or use specialized decimal libraries.

---

#### Common Mistakes

**Comparing decimals directly**

Incorrect:

```js
if (
  total === 0.3
) {
  // ...
}
```

Prefer:

```js
Math.abs(
  total - 0.3
) < Number.EPSILON;
```

---

**Storing currency as floating-point values**

Avoid:

```js
19.99
```

Prefer:

```text
1999 cents

or

1999 paise
```

---

#### Best Practices

When working with decimal values:

- Never assume decimal calculations are exact.
- Use `Number.EPSILON` when comparing floating-point values.
- Store money as the smallest currency unit whenever possible.
- Be aware that floating-point precision issues exist in many programming languages, not just JavaScript.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Rounding and Number Formatting**, including `Math.round()`, `Math.floor()`, `Math.ceil()`, `Math.trunc()`, `toFixed()`, and `toPrecision()`.

---

### 💻 Example

We'll continue using our running example.

```js
const total =
  0.1 + 0.2;

console.log(total);

const isEqual =
  Math.abs(
    total - 0.3
  ) <
  Number.EPSILON;

console.log(isEqual);
```

Output:

```text
0.30000000000000004

true
```

---

### 📊 Diagram / Flow

#### Decimal Representation

```text
Decimal

↓

Binary Approximation

↓

Stored Number
```

---

#### Floating-Point Addition

```text
0.1

+

0.2

↓

Approximate Result

↓

0.30000000000000004
```

---

#### Safe Comparison

```text
Difference

↓

Math.abs()

↓

Compare with

Number.EPSILON
```

---

#### Financial Calculation

```text
Money

↓

Store as Integer

↓

Calculate

↓

Convert Back
```

---

### 🌍 Real-World Example

Imagine you're building an online payment system.

A customer purchases items costing:

```text
₹0.10

+

₹0.20
```

If the application performs floating-point arithmetic directly, the total may become:

```text
₹0.30000000000000004
```

Instead, the application stores the values in paise:

```text
10

+

20

↓

30
```

Finally, it converts the result back to rupees:

```text
30 / 100

↓

₹0.30
```

This approach avoids precision errors and is commonly used in financial software.

---

### 🎤 Interview Answer

JavaScript stores all `Number` values using the IEEE 754 double-precision floating-point format. Many decimal values, such as `0.1` and `0.2`, cannot be represented exactly in binary, so calculations involving them may produce small precision errors. That's why `0.1 + 0.2` evaluates to `0.30000000000000004` instead of exactly `0.3`. To compare floating-point numbers safely, developers typically check whether the absolute difference between two values is smaller than `Number.EPSILON`. For financial applications, it's generally recommended to store values as the smallest currency unit, such as cents or paise, or use specialized decimal libraries, rather than relying on floating-point arithmetic.

---

### ❓ Follow-up Questions

1. Why does `0.1 + 0.2 !== 0.3` in JavaScript?
2. What is floating-point precision?
3. What is `Number.EPSILON`, and how is it used?
4. How would you compare two floating-point numbers safely?
5. Why should financial applications avoid direct floating-point calculations?
6. Why isn't `BigInt` a complete solution for financial calculations?

---

## 4. Rounding and Number Formatting

### 📖 Overview

After performing calculations, it's often necessary to **round or format numbers** before displaying them.

Common use cases include:

- Displaying prices.
- Showing percentages.
- Formatting statistics.
- Converting decimals to integers.
- Limiting decimal places.

JavaScript provides several built-in methods for these tasks:

- `Math.round()`
- `Math.floor()`
- `Math.ceil()`
- `Math.trunc()`
- `toFixed()`
- `toPrecision()`

Although these methods appear similar, they serve different purposes and are frequently compared in interviews.

---

### ⚙️ Main Explanation

#### `Math.round()`

`Math.round()` rounds a number to the **nearest integer**.

**Rules:**

- Decimal part **< 0.5** → Round down.
- Decimal part **≥ 0.5** → Round up.

Example:

```js
Math.round(4.4);
```

Output:

```text
4
```

---

Example:

```js
Math.round(4.5);
```

Output:

```text
5
```

---

#### `Math.floor()`

`Math.floor()` always rounds **down** toward **negative infinity**.

Example:

```js
Math.floor(4.9);
```

Output:

```text
4
```

---

Negative numbers:

```js
Math.floor(-4.2);
```

Output:

```text
-5
```

Notice that it moves toward negative infinity, not toward zero.

---

#### `Math.ceil()`

`Math.ceil()` always rounds **up** toward **positive infinity**.

Example:

```js
Math.ceil(4.2);
```

Output:

```text
5
```

---

Negative numbers:

```js
Math.ceil(-4.8);
```

Output:

```text
-4
```

It moves toward positive infinity.

---

#### `Math.trunc()`

`Math.trunc()` simply removes the decimal portion.

It **does not round**.

Example:

```js
Math.trunc(4.9);
```

Output:

```text
4
```

---

Negative numbers:

```js
Math.trunc(-4.9);
```

Output:

```text
-4
```

Unlike `Math.floor()`, it always moves toward zero by discarding the fractional part.

---

#### `Math.floor()` vs `Math.trunc()`

| `Math.floor()` | `Math.trunc()` |
|----------------|----------------|
| Rounds toward negative infinity | Removes decimal part |
| `Math.floor(-4.2)` → `-5` | `Math.trunc(-4.2)` → `-4` |
| Affects negative numbers differently | Always truncates toward zero |

This difference is a common interview question.

---

#### `Math.floor()` vs `Math.round()`

| `Math.floor()` | `Math.round()` |
|----------------|----------------|
| Always rounds down | Rounds to the nearest integer |
| Ignores `.5` rule | Uses the `.5` rule |

Example:

```js
Math.floor(4.9);
```

Output:

```text
4
```

Example:

```js
Math.round(4.9);
```

Output:

```text
5
```

---

#### `Math.ceil()` vs `Math.round()`

| `Math.ceil()` | `Math.round()` |
|---------------|----------------|
| Always rounds up | Rounds to the nearest integer |
| Doesn't depend on decimal value | Uses the `.5` rule |

---

#### `toFixed()`

`toFixed()` formats a number using a fixed number of decimal places.

It returns a **string**, not a number.

Example:

```js
const price =
  12.3456;

console.log(
  price.toFixed(2)
);
```

Output:

```text
"12.35"
```

---

Example:

```js
(5).toFixed(2);
```

Output:

```text
"5.00"
```

---

#### `toPrecision()`

`toPrecision()` formats a number based on the **total number of significant digits**.

Example:

```js
const value =
  123.456;

console.log(
  value.toPrecision(4)
);
```

Output:

```text
"123.5"
```

---

Example:

```js
const value =
  0.00123456;

console.log(
  value.toPrecision(3)
);
```

Output:

```text
"0.00123"
```

---

#### `toFixed()` vs `toPrecision()`

| `toFixed()` | `toPrecision()` |
|--------------|-----------------|
| Fixed decimal places | Fixed significant digits |
| Useful for prices | Useful for scientific or general numeric formatting |
| Returns a string | Returns a string |

---

#### Rounding to Two Decimal Places

A common interview question.

Example:

```js
const value =
  12.3456;

const rounded =
  Number(
    value.toFixed(2)
  );

console.log(rounded);
```

Output:

```text
12.35
```

Using `Number()` converts the returned string back into a number.

---

#### Common Mistakes

**Assuming `toFixed()` returns a number**

Example:

```js
const value =
  12.34;

console.log(
  typeof value.toFixed(
    2
  )
);
```

Output:

```text
string
```

If you need a numeric result, convert it explicitly.

---

**Confusing `Math.floor()` with `Math.trunc()`**

They produce the same result for positive numbers but differ for negative numbers.

Example:

```js
Math.floor(-3.8);
```

Output:

```text
-4
```

Example:

```js
Math.trunc(-3.8);
```

Output:

```text
-3
```

---

#### Best Practices

When formatting numbers:

- Use `Math.round()` for normal rounding.
- Use `Math.floor()` when values must always round down.
- Use `Math.ceil()` when values must always round up.
- Use `Math.trunc()` when you simply want to remove the decimal portion.
- Use `toFixed()` for displaying prices or currency.
- Remember that `toFixed()` and `toPrecision()` return strings.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Random Numbers and Common Math Methods**, including `Math.random()`, `Math.min()`, `Math.max()`, `Math.abs()`, `Math.pow()`, `Math.sqrt()`, `Math.sign()`, and generating random values such as OTPs.

---

### 💻 Example

We'll continue using our running example.

```js
const value =
  12.789;

console.log(
  Math.round(value)
);

console.log(
  Math.floor(value)
);

console.log(
  Math.ceil(value)
);

console.log(
  value.toFixed(2)
);
```

Output:

```text
13

12

13

"12.79"
```

---

### 📊 Diagram / Flow

#### `Math.round()`

```text
4.4

↓

4

--------------------

4.5

↓

5
```

---

#### `Math.floor()`

```text
Always

↓

Round Down
```

---

#### `Math.ceil()`

```text
Always

↓

Round Up
```

---

#### `Math.trunc()`

```text
Remove Decimal

↓

Integer
```

---

#### Formatting

```text
Number

↓

toFixed()

↓

Formatted String
```

---

### 🌍 Real-World Example

Imagine you're building an online shopping application.

- Product prices are displayed with exactly two decimal places using `toFixed(2)`.
- The total number of pages in pagination is calculated using `Math.ceil()` so that partially filled pages are still counted.
- A discount percentage may be rounded using `Math.round()`.
- When displaying only the integer portion of a measurement, `Math.trunc()` can be used.

Choosing the appropriate rounding method ensures calculations and displayed values match business requirements.

---

### 🎤 Interview Answer

JavaScript provides several methods for rounding and formatting numbers. `Math.round()` rounds to the nearest integer, `Math.floor()` always rounds down toward negative infinity, `Math.ceil()` always rounds up toward positive infinity, and `Math.trunc()` removes the decimal portion without rounding. For formatting, `toFixed()` returns a string with a fixed number of decimal places, making it useful for displaying prices, while `toPrecision()` formats a number using a specified number of significant digits. Choosing the correct method depends on whether the requirement is rounding, truncation, or display formatting.

---

### ❓ Follow-up Questions

1. What is the difference between `Math.round()`, `Math.floor()`, `Math.ceil()`, and `Math.trunc()`?
2. What is the difference between `Math.floor()` and `Math.trunc()` for negative numbers?
3. What is the difference between `toFixed()` and `toPrecision()`?
4. Why does `toFixed()` return a string?
5. How would you round a number to two decimal places?
6. Which rounding method would you use for pagination or page counts?

---

## 5. Random Numbers and Common Math Methods

### 📖 Overview

JavaScript provides the built-in **`Math` object**, which contains useful methods and constants for performing mathematical operations.

Unlike `Number`, `Math` is **not a constructor** and cannot be instantiated. It is simply a static object that provides mathematical utilities.

Common use cases include:

- Generating random numbers.
- Finding minimum and maximum values.
- Calculating absolute values.
- Finding powers and square roots.
- Determining the sign of a number.

In this topic, we'll cover:

- The `Math` object
- `Math.random()`
- Random numbers within a range
- OTP generation
- `Math.min()`
- `Math.max()`
- `Math.abs()`
- `Math.pow()`
- `Math.sqrt()`
- `Math.sign()`

---

### ⚙️ Main Explanation

#### What is the `Math` Object?

The `Math` object is a built-in JavaScript object that provides mathematical methods and constants.

Example:

```js
console.log(
  Math.PI
);
```

Output:

```text
3.141592653589793
```

Unlike objects created with `new`, you use `Math` directly:

```js
Math.sqrt(25);
```

There is no need to create an instance.

---

#### `Math.random()`

`Math.random()` generates a **pseudo-random** decimal number.

The returned value is always:

```text
0 <= value < 1
```

Example:

```js
console.log(
  Math.random()
);
```

Possible Output:

```text
0.483729182
```

Every execution produces a different value.

> **Note:** `Math.random()` is **not cryptographically secure**. For security-sensitive use cases (such as generating passwords, tokens, or secure OTPs), use the **Web Crypto API** (`crypto.getRandomValues()`) in browsers or the appropriate cryptographic APIs available in your runtime.

---

#### Generating a Random Integer

A common technique is:

```js
Math.floor(
  Math.random() * 10
);
```

Possible Output:

```text
0

5

9
```

This generates integers from:

```text
0

to

9
```

---

#### Generating a Random Number in a Specific Range

Formula:

```js
Math.floor(
  Math.random() *
    (
      max -
      min +
      1
    )
) + min;
```

Example:

Generate numbers between `1` and `100`.

```js
const random =
  Math.floor(
    Math.random() *
      100
  ) + 1;

console.log(random);
```

Possible Output:

```text
73
```

---

#### Generating a Random OTP

A common interview question.

Example:

```js
const otp =
  Math.floor(
    100000 +
      Math.random() *
        900000
  );

console.log(otp);
```

Possible Output:

```text
583921
```

This always generates a **6-digit** number.

> **Production Note:** While this formula is fine for learning or simple applications, production authentication systems should generate OTPs using cryptographically secure random APIs rather than `Math.random()`.

---

#### `Math.min()`

Returns the smallest value.

Example:

```js
Math.min(
  10,
  5,
  20
);
```

Output:

```text
5
```

Works with arrays using the spread operator:

```js
const numbers = [
  5,
  10,
  2,
];

console.log(
  Math.min(
    ...numbers
  )
);
```

Output:

```text
2
```

---

#### `Math.max()`

Returns the largest value.

Example:

```js
Math.max(
  10,
  5,
  20
);
```

Output:

```text
20
```

---

#### `Math.abs()`

Returns the absolute (positive) value of a number.

Example:

```js
Math.abs(-15);
```

Output:

```text
15
```

This method is commonly used when comparing floating-point numbers.

---

#### `Math.pow()`

Raises a number to a given power.

Example:

```js
Math.pow(
  2,
  3
);
```

Output:

```text
8
```

Modern JavaScript usually prefers the exponentiation operator:

```js
2 ** 3;
```

Output:

```text
8
```

---

#### `Math.sqrt()`

Returns the square root.

Example:

```js
Math.sqrt(81);
```

Output:

```text
9
```

---

#### `Math.sign()`

Returns the sign of a number.

Example:

```js
Math.sign(10);
```

Output:

```text
1
```

---

Example:

```js
Math.sign(-10);
```

Output:

```text
-1
```

---

Example:

```js
Math.sign(0);
```

Output:

```text
0
```

---

#### Common Math Methods Summary

| Method | Purpose |
|---------|---------|
| `Math.random()` | Random decimal |
| `Math.min()` | Smallest value |
| `Math.max()` | Largest value |
| `Math.abs()` | Absolute value |
| `Math.pow()` | Exponentiation |
| `Math.sqrt()` | Square root |
| `Math.sign()` | Number sign |

---

#### Best Practices

When working with the `Math` object:

- Use `Math.floor()` with `Math.random()` to generate random integers.
- Use the standard range formula when generating random values between two numbers.
- Prefer the `**` operator over `Math.pow()` in modern JavaScript.
- Use `Math.abs()` when comparing floating-point values.
- Use cryptographically secure random APIs instead of `Math.random()` for security-sensitive tasks.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **BigInt and Large Numbers**, including when to use `BigInt`, why it cannot be mixed with `Number`, and the performance implications of working with extremely large integers.

---

### 💻 Example

We'll continue using our running example.

```js
const numbers = [
  15,
  3,
  28,
  9,
];

console.log(
  Math.min(
    ...numbers
  )
);

console.log(
  Math.max(
    ...numbers
  )
);

console.log(
  Math.sqrt(64)
);

console.log(
  Math.floor(
    Math.random() *
      10
  )
);
```

Possible Output:

```text
3

28

8

7
```

(The last value changes each time the code runs.)

---

### 📊 Diagram / Flow

#### Random Integer

```text
Math.random()

↓

0–1

↓

Multiply by Range

↓

Math.floor()

↓

Integer
```

---

#### Random Number in Range

```text
Math.random()

↓

(max - min + 1)

↓

Math.floor()

↓

+ min

↓

Final Number
```

---

#### Math Utilities

```text
Numbers

↓

Math Object

↓

min()

max()

abs()

sqrt()

sign()
```

---

### 🌍 Real-World Example

Imagine an online quiz application.

- A random question is selected using `Math.random()`.
- The highest score is displayed using `Math.max()`.
- The lowest score is displayed using `Math.min()`.
- A player's score difference is calculated using `Math.abs()`.
- Pagination or level calculations might use square roots or powers for game mechanics.

For authentication systems, however, secure OTPs should be generated using cryptographic APIs instead of `Math.random()`.

---

### 🎤 Interview Answer

The `Math` object is a built-in JavaScript object that provides static methods and constants for mathematical operations. `Math.random()` generates a pseudo-random decimal number between `0` (inclusive) and `1` (exclusive), and is commonly combined with `Math.floor()` to generate random integers within a specific range. Other frequently used methods include `Math.min()` and `Math.max()` for finding minimum and maximum values, `Math.abs()` for absolute values, `Math.sqrt()` for square roots, `Math.sign()` for determining a number's sign, and `Math.pow()` (or the modern `**` operator) for exponentiation. For security-sensitive randomness, such as OTPs or tokens, developers should use cryptographically secure APIs rather than `Math.random()`.

---

### ❓ Follow-up Questions

1. What is the `Math` object?
2. What range of values does `Math.random()` return?
3. How would you generate a random number between two values?
4. How would you generate a 6-digit OTP?
5. Why isn't `Math.random()` suitable for cryptographic purposes?
6. What is the difference between `Math.pow()` and the `**` operator?

---

## 6. BigInt and Large Numbers

### 📖 Overview

For most applications, JavaScript's `Number` type is sufficient.

However, because `Number` uses the **IEEE 754 double-precision floating-point format**, it can safely represent integers only up to:

```text
9,007,199,254,740,991

(Number.MAX_SAFE_INTEGER)
```

Beyond this range, integer precision is lost.

To solve this limitation, JavaScript introduced **`BigInt`** in **ES2020**, allowing developers to work with integers of virtually unlimited size.

In this topic, we'll cover:

- When to use `BigInt`
- Why `BigInt` exists
- Mixing `Number` and `BigInt`
- Performance considerations
- Real-world use cases

---

### ⚙️ Main Explanation

#### Why Do We Need `BigInt`?

Consider this example:

```js
console.log(
  Number.MAX_SAFE_INTEGER
);
```

Output:

```text
9007199254740991
```

Now add `1` and `2`.

```js
console.log(
  Number.MAX_SAFE_INTEGER + 1
);

console.log(
  Number.MAX_SAFE_INTEGER + 2
);
```

Output:

```text
9007199254740992

9007199254740992
```

Both results are identical.

This happens because JavaScript can no longer represent integers accurately beyond the safe integer range.

`BigInt` eliminates this limitation.

---

#### Creating a `BigInt`

Using the `n` suffix:

```js
const value =
  12345678901234567890n;
```

---

Using the constructor:

```js
const value =
  BigInt(
    "12345678901234567890"
  );
```

Both produce a `BigInt`.

---

#### `BigInt` Characteristics

`BigInt`:

- Stores integers only.
- Supports extremely large values.
- Maintains exact integer precision.
- Does **not** support decimal values.

Example:

```js
const value =
  999999999999999999999999999n;
```

This would lose precision if stored as a regular `Number`.

---

#### Why Can't `Number` and `BigInt` Be Mixed?

This is a common interview question.

Example:

```js
const a = 10n;
const b = 5;

console.log(a + b);
```

Output:

```text
TypeError
```

JavaScript throws an error because the two numeric types use different internal representations.

To perform arithmetic, both operands must have the same type.

---

#### Converting Between `Number` and `BigInt`

Convert a `Number` to a `BigInt`:

```js
const num = 10;

const big =
  BigInt(num);
```

---

Convert a `BigInt` to a `Number`:

```js
const big =
  100n;

const num =
  Number(big);
```

Be careful when converting large `BigInt` values to `Number`, as precision may be lost if the value exceeds the safe integer range.

---

#### Arithmetic with `BigInt`

Example:

```js
const a =
  10000000000000000000n;

const b =
  20000000000000000000n;

console.log(a + b);
```

Output:

```text
30000000000000000000n
```

Arithmetic operators work similarly to `Number`, provided both operands are `BigInt`.

---

#### Limitations of `BigInt`

`BigInt` has several limitations:

- Cannot represent decimal values.
- Cannot be mixed directly with `Number`.
- Some built-in APIs expect `Number` values and won't accept `BigInt`.
- `Math` methods (such as `Math.sqrt()` or `Math.random()`) do not work with `BigInt`.

Example:

```js
Math.sqrt(16n);
```

Output:

```text
TypeError
```

---

#### Performance Considerations

`BigInt` calculations are generally slower than `Number` calculations.

Reason:

- `Number` values have a fixed 64-bit representation.
- `BigInt` values can grow to arbitrary sizes, requiring more complex arithmetic internally.

For everyday calculations:

```text
Number

↓

Faster
```

For extremely large integers:

```text
BigInt

↓

Accurate
```

Use `BigInt` only when necessary.

---

#### When Should You Use `BigInt`?

Good use cases include:

- Large database identifiers.
- Cryptographic algorithms.
- Scientific calculations involving very large integers.
- Financial or accounting systems that use very large integer values (when values are stored as the smallest currency unit and exceed the safe integer range).
- Blockchain applications.

For ordinary values like:

```text
25

199.99

5000
```

`Number` is the better choice.

---

#### Common Mistakes

**Mixing `Number` and `BigInt`**

Incorrect:

```js
10n + 5;
```

Correct:

```js
10n + BigInt(5);
```

---

**Using `BigInt` for Decimal Values**

Incorrect:

```text
10.5n
```

`BigInt` supports integers only.

---

**Using `BigInt` Everywhere**

`BigInt` is **not** a replacement for `Number`.

It should be used only when integer precision beyond the safe range is required.

---

#### Best Practices

When working with `BigInt`:

- Use it only for extremely large integers.
- Avoid mixing it with `Number` in arithmetic expressions.
- Convert values explicitly when necessary.
- Don't use `BigInt` for decimal calculations.
- Remember that `Math` methods do not support `BigInt`.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Production Best Practices**, including common mistakes developers make while working with numbers and recommendations for writing reliable numerical code.

---

### 💻 Example

We'll continue using our running example.

```js
const id =
  9007199254740995n;

const nextId =
  id + 1n;

console.log(nextId);

console.log(
  typeof nextId
);
```

Output:

```text
9007199254740996n

bigint
```

---

### 📊 Diagram / Flow

#### Safe Integer Limit

```text
Number

↓

MAX_SAFE_INTEGER

↓

Precision Lost

↓

Use BigInt
```

---

#### BigInt Arithmetic

```text
BigInt

+

BigInt

↓

Accurate Result
```

---

#### Mixing Types

```text
Number

+

BigInt

↓

TypeError
```

---

### 🌍 Real-World Example

Imagine you're building a blockchain explorer.

Transaction IDs and block numbers may become extremely large over time.

Using the `Number` type could eventually lead to precision loss.

Instead:

```text
Large Integer

↓

BigInt

↓

Exact Value
```

Similarly, a distributed database generating massive sequential IDs can use `BigInt` to ensure every identifier remains accurate even beyond JavaScript's safe integer range.

---

### 🎤 Interview Answer

`BigInt` is a primitive numeric type introduced in ES2020 to represent integers larger than `Number.MAX_SAFE_INTEGER` without losing precision. Unlike the `Number` type, which uses the IEEE 754 double-precision floating-point format, `BigInt` stores arbitrarily large integers exactly. It supports integer arithmetic but does not support decimal values, cannot be mixed directly with `Number` in arithmetic operations, and is not compatible with `Math` methods. Because `BigInt` operations are generally slower than `Number` operations, it should only be used when extremely large integer values are required, such as in blockchain systems, cryptography, or large identifier generation.

---

### ❓ Follow-up Questions

1. Why was `BigInt` introduced?
2. When should you use `BigInt` instead of `Number`?
3. Why can't `Number` and `BigInt` be mixed directly?
4. Can `BigInt` represent decimal values?
5. Why is `BigInt` generally slower than `Number`?
6. Can `Math` methods be used with `BigInt`?

---

## 7. Production Best Practices

### 📖 Overview

Working with numbers looks straightforward, but production applications often deal with:

- User input.
- Financial calculations.
- Random number generation.
- Large datasets.
- API responses.
- Scientific calculations.

Choosing the right numeric type and method is essential for writing reliable, maintainable, and bug-free applications.

This section covers the most common mistakes developers make while working with numbers and the best practices followed in production systems.

---

### ⚙️ Main Explanation

#### Common Mistake 1: Comparing Floating-Point Numbers Directly

Example:

```js
const total =
  0.1 + 0.2;

console.log(
  total === 0.3
);
```

Output:

```text
false
```

Because floating-point numbers are approximations.

Correct:

```js
Math.abs(
  total - 0.3
) <
Number.EPSILON;
```

---

#### Common Mistake 2: Using Floating-Point Values for Money

Incorrect:

```js
const price =
  19.99;
```

Repeated arithmetic with floating-point values can introduce precision errors.

A common production approach is to store money as the smallest currency unit.

Example:

```text
₹19.99

↓

1999 paise
```

Calculations remain accurate because they use integers.

---

#### Common Mistake 3: Using `parseInt()` When `Number()` Is Needed

Example:

```js
parseInt(
  "12.99"
);
```

Output:

```text
12
```

The decimal portion is discarded.

If the value should remain a decimal:

```js
Number("12.99");
```

or

```js
parseFloat(
  "12.99"
);
```

is more appropriate.

---

#### Common Mistake 4: Using Global `isNaN()`

Example:

```js
isNaN("Hello");
```

Output:

```text
true
```

This happens because global `isNaN()` performs type coercion.

Prefer:

```js
Number.isNaN(
  value
);
```

It checks only for the actual `NaN` value.

---

#### Common Mistake 5: Forgetting That `toFixed()` Returns a String

Example:

```js
const price =
  10.5;

const result =
  price.toFixed(2);

console.log(
  typeof result
);
```

Output:

```text
string
```

If a numeric value is required:

```js
Number(
  result
);
```

---

#### Common Mistake 6: Using `Math.random()` for Security

Example:

```js
const otp =
  Math.floor(
    Math.random() *
      1000000
  );
```

This works for demonstrations and simple applications, but `Math.random()` is **not cryptographically secure**.

For authentication systems, password reset tokens, or security-sensitive OTPs, use the **Web Crypto API** (`crypto.getRandomValues()`) in browsers or the appropriate cryptographic API provided by your runtime.

---

#### Common Mistake 7: Using `BigInt` Everywhere

`BigInt` is useful only for extremely large integers.

Example:

```js
const age = 25n;
```

Although valid, this provides no benefit over:

```js
const age = 25;
```

`Number` is faster and more widely supported.

---

#### Common Mistake 8: Mixing `Number` and `BigInt`

Incorrect:

```js
10n + 5;
```

Output:

```text
TypeError
```

Convert both operands to the same numeric type before performing arithmetic.

---

#### Common Mistake 9: Ignoring Invalid Numeric Input

Example:

```js
const age =
  Number(input);
```

Before using the value:

```js
Number.isFinite(age);
```

should be checked to ensure the input is a valid finite number.

---

#### Best Practices

##### Use `Number` by Default

Most applications should use:

```text
Number
```

Reserve `BigInt` for extremely large integers.

---

##### Validate User Input

Example:

```js
const value =
  Number(input);

if (
  Number.isFinite(
    value
  )
) {
  // Safe to use
}
```

---

##### Use `Number.EPSILON` for Decimal Comparisons

Instead of:

```js
a === b
```

for floating-point values,

prefer:

```js
Math.abs(
  a - b
) <
Number.EPSILON;
```

---

##### Store Money as Integers

Instead of:

```text
19.99
```

store:

```text
1999 cents

or

1999 paise
```

This avoids floating-point precision issues.

---

##### Use the Correct Parsing Method

Choose based on the requirement:

- `Number()` → entire value must be numeric.
- `parseInt()` → integer parsing.
- `parseFloat()` → decimal parsing.

---

##### Use Modern APIs

Prefer:

- `Number.isNaN()`
- `Number.isFinite()`
- `Number.isInteger()`

over older global alternatives when appropriate.

---

##### Use Secure Randomness for Sensitive Data

Use `Math.random()` for games, UI effects, or simple simulations.

Use cryptographically secure APIs for:

- OTPs
- Tokens
- Password reset links
- Security keys

---

### 💻 Example

We'll continue using our running example.

```js
const input =
  "199.99";

const price =
  Number(input);

if (
  Number.isFinite(
    price
  )
) {
  console.log(
    price.toFixed(2)
  );
}
```

Output:

```text
199.99
```

---

### 📊 Diagram / Flow

#### User Input Validation

```text
Input

↓

Number()

↓

Number.isFinite()

↓

Valid Number?
```

---

#### Financial Calculation

```text
Money

↓

Store as Integer

↓

Calculate

↓

Display
```

---

#### Floating-Point Comparison

```text
Difference

↓

Math.abs()

↓

Compare with

Number.EPSILON
```

---

### 🌍 Real-World Example

Imagine you're building an online banking application.

When a user transfers money:

1. The entered amount is converted to a number.
2. The application validates that it is finite and within allowed limits.
3. Internally, the amount is stored in the smallest currency unit (such as cents or paise) to avoid floating-point precision issues.
4. Before displaying it back to the user, it is formatted with `toFixed(2)`.

For generating authentication tokens or OTPs, the application uses a cryptographically secure random API rather than `Math.random()`.

---

### 🎤 Interview Answer

In production applications, developers should validate all numeric input before using it, prefer `Number` for normal calculations, and reserve `BigInt` for extremely large integers. Floating-point numbers should not be compared directly because of precision limitations, so `Number.EPSILON` is commonly used for safe comparisons. Financial applications typically store monetary values as the smallest currency unit instead of using floating-point decimals. Developers should also use modern validation methods such as `Number.isNaN()` and `Number.isFinite()`, remember that `toFixed()` returns a string, and avoid using `Math.random()` for security-sensitive operations like OTP generation or authentication tokens.

---

### ❓ Follow-up Questions

1. What are the most common mistakes developers make while working with numbers?
2. Why shouldn't floating-point numbers be compared directly?
3. Why do financial applications store money as integers?
4. Why is `Number.isNaN()` preferred over the global `isNaN()`?
5. Why shouldn't `Math.random()` be used for authentication?
6. When should you use `BigInt` in production applications?

---