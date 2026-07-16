---
title: Arrays
description: Core array methods, mutability, and the ones that come up constantly in interviews.
sidebar_position: 13
---

# Arrays


## 1. What are Arrays, and how do they work?

### 📖 Overview

An **Array** is one of the most commonly used data structures in JavaScript.

It allows us to store **multiple values in a single variable** while maintaining their order.

Arrays are used everywhere in JavaScript, from storing lists of users and products to rendering UI elements in React and processing API responses.

Although arrays look different from objects, they are actually a **special type of object** optimized for storing ordered collections of values.

Understanding how arrays work internally—including memory, indexing, array-like objects, and creation methods—is essential for writing efficient JavaScript code and performing well in interviews.

---

### ⚙️ Main Explanation

#### What is an Array?

An **Array** is an ordered collection of values.

Each value is stored at a numeric position called an **index**, starting from **0**.

Example:

```js
const fruits = [
  "Apple",
  "Banana",
  "Mango",
];
```

Accessing elements:

```js
console.log(fruits[0]);
console.log(fruits[2]);
```

Output:

```text
Apple

Mango
```

---

#### Why Do We Use Arrays?

Without arrays:

```js
const user1 = "John";
const user2 = "Alice";
const user3 = "Bob";
```

Managing many related variables quickly becomes difficult.

Instead:

```js
const users = [
  "John",
  "Alice",
  "Bob",
];
```

Arrays make data easier to:

- Store
- Access
- Iterate
- Search
- Sort
- Transform

---

#### How Do You Create an Array?

There are several ways to create arrays.

##### Array Literal (Recommended)

```js
const numbers = [
  1,
  2,
  3,
];
```

This is the most common and recommended approach.

---

##### `Array()` Constructor

```js
const arr =
  new Array(
    1,
    2,
    3
  );
```

Or:

```js
const arr =
  Array(
    1,
    2,
    3
  );
```

Be careful:

```js
Array(5);
```

creates:

```text
[ <5 empty items> ]
```

instead of:

```text
[5]
```

---

##### `Array.of()`

`Array.of()` always creates an array from the provided arguments.

```js
Array.of(5);
```

Output:

```text
[5]
```

Unlike:

```js
Array(5);
```

which creates an empty array with a length of `5`.

---

##### `Array.from()`

Creates an array from:

- Iterables
- Array-like objects

Example:

```js
Array.from("Hello");
```

Output:

```text
["H", "e", "l", "l", "o"]
```

---

#### Are Arrays Objects?

Yes.

Arrays are **special objects** in JavaScript.

```js
typeof [];
```

Output:

```text
object
```

This is because arrays are implemented internally as objects with:

- Numeric property keys.
- A special `length` property.
- Built-in array methods.

Conceptually:

```text
Array

↓

Special Object

↓

Indexed Properties
```

---

#### Array vs Object

Although arrays are objects internally, they are designed for different purposes.

| Array | Object |
|--------|---------|
| Ordered collection | Key-value collection |
| Numeric indexes | Named keys |
| Optimized for sequential data | Optimized for structured data |
| Has array methods | Has object methods |

Example:

Array:

```js
["A", "B", "C"]
```

Object:

```js
{
  first: "A",
  second: "B"
}
```

---

#### Array Indexing

Every element has a numeric index.

```text
Index

0

1

2
```

Example:

```js
const colors = [
  "Red",
  "Blue",
  "Green",
];
```

```text
0 → Red

1 → Blue

2 → Green
```

Indexes always start from **0**.

---

#### Can Arrays Store Different Data Types?

Yes.

JavaScript arrays are **heterogeneous**, meaning they can store values of different types.

Example:

```js
const data = [
  10,
  "Hello",
  true,
  null,
  {
    name: "John",
  },
  [1, 2],
];
```

---

#### Are JavaScript Arrays Dynamic?

Yes.

Arrays automatically grow or shrink as elements are added or removed.

Example:

```js
const arr = [1];

arr.push(2);
arr.push(3);
```

Output:

```text
[1, 2, 3]
```

Unlike some languages, JavaScript arrays do not have a fixed size.

---

#### The `length` Property

Every array has a `length` property.

```js
const arr = [
  10,
  20,
  30,
];

console.log(
  arr.length
);
```

Output:

```text
3
```

The `length` property updates automatically whenever the array changes.

---

#### Basic Array Operations

##### Access

```js
arr[0];
```

##### Update

```js
arr[1] = 50;
```

##### Add

```js
arr.push(100);
```

##### Remove

```js
arr.pop();
```

##### Iterate

```js
for (const value of arr) {
  console.log(value);
}
```

We'll study these operations in detail later in this chapter.

---

#### What is an Array-like Object?

An **Array-like object** behaves similarly to an array but **is not actually an Array**.

Characteristics:

- Has numeric indexes.
- Has a `length` property.
- Does not have array methods.

Example:

```js
const arrayLike = {
  0: "A",
  1: "B",
  length: 2,
};
```

---

#### Common Examples of Array-like Objects

Some common array-like objects are:

- `arguments`
- `NodeList`
- `HTMLCollection`

Example:

```js
document.querySelectorAll("div");
```

returns a **NodeList**, not an Array.

---

#### Converting an Array-like Object into an Array

##### Using `Array.from()`

```js
const divs =
  Array.from(
    document.querySelectorAll(
      "div"
    )
  );
```

##### Using the Spread Operator

```js
const divs = [
  ...document.querySelectorAll(
    "div"
  ),
];
```

Both produce a real array.

---

#### `Array.from()` vs Spread Operator

Both can convert iterables into arrays.

However, `Array.from()` also:

- Works with array-like objects.
- Accepts a mapping function.

Example:

```js
Array.from(
  [1, 2, 3],
  x => x * 2
);
```

Output:

```text
[2, 4, 6]
```

---

#### `Array.isArray()`

Since:

```js
typeof [];
```

returns:

```text
object
```

the proper way to check for an array is:

```js
Array.isArray([]);
```

Output:

```text
true
```

Example:

```js
Array.isArray({});
```

Output:

```text
false
```

---

#### How Are Arrays Stored in Memory?

Arrays are **reference types**.

The actual array is stored in the **Heap**, while the variable stores a reference to it.

Conceptually:

```text
Stack

↓

Reference

↓

Heap

↓

Array Elements
```

Example:

```js
const a = [1, 2];

const b = a;
```

Both variables point to the same array in memory.

---

#### Best Practices

When working with arrays:

- Prefer array literals (`[]`) over the `Array()` constructor.
- Use `Array.of()` when creating an array from a single value.
- Use `Array.from()` to convert array-like objects.
- Use `Array.isArray()` instead of `typeof` for type checking.
- Use arrays for ordered collections and objects for named properties.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Mutable and Immutable Array Methods**, understand how they differ, and learn why immutable operations are preferred in React applications.

---

### 💻 Example

We'll use the following example throughout this chapter.

```js
const fruits = [
  "Apple",
  "Banana",
  "Mango",
];

console.log(fruits[1]);

console.log(fruits.length);

console.log(
  Array.isArray(fruits)
);
```

Output:

```text
Banana

3

true
```

---

### 📊 Diagram / Flow

#### Array Structure

```text
Index

0

1

2

↓

Apple

Banana

Mango
```

---

#### Memory Representation

```text
Stack

↓

Reference

↓

Heap

↓

Array
```

---

#### Array Creation

```text
[]

↓

Array.of()

↓

Array.from()

↓

Array()
```

---

#### Array-like Object Conversion

```text
NodeList

↓

Array.from()

↓

Array
```

---

### 🌍 Real-World Example

Imagine a classroom attendance register.

Each student occupies a fixed position.

```text
0 → Alice

1 → Bob

2 → Charlie

3 → David
```

The teacher can immediately access the student at position **2** without searching the entire register.

Similarly, an array stores values at numbered indexes, allowing quick access.

Now imagine receiving a printed attendance sheet from another school. It looks similar to your register but isn't part of your school's system.

Before using your school's tools, you copy it into your own register.

Likewise, a **NodeList** or **arguments** object looks like an array but isn't a real array. Using `Array.from()` or the spread operator converts it into a proper array so all array methods become available.

---

### 🎤 Interview Answer

An **Array** is an ordered collection of values stored using zero-based numeric indexes. JavaScript arrays are dynamic, meaning they can grow or shrink automatically, and they can store values of different data types. Although arrays are a special type of object—so `typeof []` returns `"object"`—they are optimized for ordered collections and provide many built-in methods for adding, removing, searching, transforming, and iterating over data. Arrays are reference types stored in heap memory, while variables hold references to them. JavaScript also provides helper methods like `Array.isArray()`, `Array.of()`, and `Array.from()` for checking, creating, and converting arrays, especially when working with array-like objects such as `NodeList` or `arguments`.

---

### ❓ Follow-up Questions

1. Why does `typeof []` return `"object"`?
2. How are arrays different from objects?
3. What is an array-like object?
4. What is the difference between `Array.of()`, `Array()`, and `Array.from()`?
5. How do you convert a `NodeList` into an array?
6. Why should `Array.isArray()` be used instead of `typeof`?

---

## 2. Mutable and Immutable Array Methods

### 📖 Overview

Array methods in JavaScript can be divided into two categories:

- **Mutable Methods**
- **Immutable Methods**

The difference is simple but extremely important:

- **Mutable methods modify the original array.**
- **Immutable methods return a new array without changing the original one.**

Understanding this distinction is essential because modern frameworks like **React** rely heavily on immutability for efficient state updates and rendering.

---

### ⚙️ Main Explanation

#### What are Mutable Array Methods?

A **mutable method** changes the original array.

Example:

```js
const numbers = [
  1,
  2,
  3,
];

numbers.push(4);

console.log(numbers);
```

Output:

```text
[1, 2, 3, 4]
```

The original array itself has been modified.

---

#### Common Mutable Methods

Some frequently used mutable methods are:

| Method | Purpose |
|---------|----------|
| `push()` | Add element at the end |
| `pop()` | Remove last element |
| `shift()` | Remove first element |
| `unshift()` | Add element at the beginning |
| `splice()` | Add, remove, or replace elements |
| `sort()` | Sort the original array |
| `reverse()` | Reverse the original array |
| `fill()` | Replace elements with a value |
| `copyWithin()` | Copy part of the array within itself |

These methods directly modify the existing array.

---

#### What are Immutable Array Methods?

Immutable methods **never modify the original array**.

Instead, they return a **new array**.

Example:

```js
const numbers = [
  1,
  2,
  3,
];

const newNumbers =
  numbers.concat(4);

console.log(numbers);

console.log(newNumbers);
```

Output:

```text
[1, 2, 3]

[1, 2, 3, 4]
```

The original array remains unchanged.

---

#### Common Immutable Methods

Some commonly used immutable methods are:

| Method | Purpose |
|---------|----------|
| `slice()` | Copy part of an array |
| `concat()` | Merge arrays |
| `map()` | Transform elements |
| `filter()` | Select elements |
| `reduce()` | Produce a single value |
| `flat()` | Flatten nested arrays |
| `flatMap()` | Map and flatten |
| `toSorted()` | Return a sorted copy |
| `toReversed()` | Return a reversed copy |
| `toSpliced()` | Immutable version of `splice()` |

These methods always preserve the original array.

---

#### Mutable vs Immutable Methods

The main difference is whether the original array changes.

Example:

**Mutable:**

```js
const arr = [
  1,
  2,
  3,
];

arr.reverse();
```

Result:

```text
Original array changed.
```

---

**Immutable:**

```js
const arr = [
  1,
  2,
  3,
];

const reversed =
  arr.toReversed();
```

Result:

```text
Original unchanged.

New array returned.
```

---

#### Why Are Immutable Methods Preferred in React?

React determines whether state has changed by comparing **references**, not by deeply comparing every value.

Suppose:

```js
const users = [
  "John",
  "Alice",
];
```

Incorrect:

```js
users.push("Bob");
```

The array reference stays the same.

```text
Same Array

↓

React may not detect the update.
```

Correct:

```js
const newUsers = [
  ...users,
  "Bob",
];
```

or

```js
const newUsers =
  users.concat("Bob");
```

Now:

```text
New Array

↓

New Reference

↓

React detects the update.
```

---

#### Why Does React Care About References?

Consider:

```js
const oldArray = [
  1,
  2,
  3,
];

const newArray =
  oldArray;
```

Memory:

```text
oldArray

↓

Array

↑

newArray
```

Both variables point to the same array.

Now:

```js
oldArray.push(4);
```

The reference is still the same.

Instead:

```js
const newArray = [
  ...oldArray,
  4,
];
```

creates:

```text
oldArray

↓

Array A

-------------------

newArray

↓

Array B
```

React immediately recognizes that the state has changed because the reference is different.

---

#### When Should You Use Mutable Methods?

Mutable methods are perfectly acceptable when:

- Working with local variables.
- Mutation is intentional.
- No shared state exists.
- Performance is important.

Example:

```js
const stack = [];

stack.push(10);

stack.push(20);

stack.pop();
```

Since the array isn't shared as application state, mutation is completely fine.

---

#### Why Should You Avoid Mutating React State?

Mutating React state can lead to:

- Missed re-renders.
- Difficult debugging.
- Unexpected side effects.
- Broken memoization.
- Less predictable code.

Creating a new array avoids these issues and aligns with React's rendering model.

---

#### Best Practices

When working with arrays:

- Prefer immutable methods for state updates.
- Avoid mutating React state directly.
- Use mutable methods only when mutation is intentional.
- Favor methods like `map()`, `filter()`, `slice()`, `concat()`, `toSorted()`, and `toReversed()` in modern applications.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore methods for **adding, removing, and modifying array elements**, including `push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `fill()`, `copyWithin()`, and how the `length` property affects an array.

---

### 💻 Example

We'll continue using our running example.

```js
const numbers = [
  1,
  2,
  3,
];

const doubled =
  numbers.map(
    num => num * 2
);

numbers.push(4);

console.log(numbers);

console.log(doubled);
```

Output:

```text
[1, 2, 3, 4]

[2, 4, 6]
```

Here:

- `push()` mutates the original array.
- `map()` returns a new array without modifying the original.

---

### 📊 Diagram / Flow

#### Mutable Method

```text
Original Array

↓

Method

↓

Same Array Modified
```

---

#### Immutable Method

```text
Original Array

↓

Method

↓

New Array Returned
```

---

#### React State Update

```text
Old Reference

↓

New Reference

↓

React Re-renders
```

---

#### Memory Representation

```text
Old Array

↓

Reference A

-------------------

New Array

↓

Reference B
```

---

### 🌍 Real-World Example

Imagine a company maintains an employee list.

With a **mutable update**, someone writes directly on the original paper.

```text
Original List

↓

Edited
```

Everyone using that list immediately sees the changes.

With an **immutable update**, a photocopy is made first.

```text
Original List

↓

Copy

↓

Edit Copy
```

The original remains unchanged.

React follows the second approach.

Instead of modifying existing state, it prefers creating a **new copy**, making updates predictable and enabling efficient rendering.

---

### 🎤 Interview Answer

Array methods in JavaScript are classified as **mutable** or **immutable**. Mutable methods modify the original array, while immutable methods return a new array without changing the original. Examples of mutable methods include `push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `sort()`, and `reverse()`. Immutable methods include `slice()`, `concat()`, `map()`, `filter()`, `reduce()`, `flat()`, `toSorted()`, and `toReversed()`. Immutable methods are preferred in React because React detects state changes by comparing object references. Creating a new array produces a new reference, allowing React to detect updates efficiently and avoiding bugs caused by direct mutation.

---

### ❓ Follow-up Questions

1. What is the difference between mutable and immutable array methods?
2. Why are immutable methods preferred in React?
3. Which commonly used array methods are mutable?
4. Which commonly used array methods are immutable?
5. Why should you avoid mutating React state?
6. When is it acceptable to use mutable array methods?

---


## 3. Adding, Removing, and Modifying Elements

### 📖 Overview

One of the most common tasks when working with arrays is adding, removing, or modifying elements.

JavaScript provides several built-in methods for these operations, each designed for a specific purpose.

Understanding how these methods work, whether they mutate the original array, and their performance characteristics is essential for writing efficient code and answering interview questions.

In this topic, we'll cover:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `fill()`
- `copyWithin()`
- `length`
- `delete`
- Common comparisons and best practices

---

### ⚙️ Main Explanation

#### `push()`

`push()` adds one or more elements to the **end** of an array.

It **mutates** the original array.

Example:

```js
const arr = [
  1,
  2,
  3,
];

arr.push(4);
```

Output:

```text
[1, 2, 3, 4]
```

**Time Complexity:** `O(1)` (amortized)

Appending to the end is generally very fast because existing elements don't need to be moved.

---

#### `pop()`

`pop()` removes the **last element** from an array.

It mutates the original array and returns the removed element.

Example:

```js
const arr = [
  1,
  2,
  3,
];

const value =
  arr.pop();
```

Output:

```text
value → 3

arr → [1, 2]
```

**Time Complexity:** `O(1)`

---

#### `shift()`

`shift()` removes the **first element** from an array.

Example:

```js
const arr = [
  1,
  2,
  3,
];

arr.shift();
```

Output:

```text
[2, 3]
```

**Time Complexity:** `O(n)`

Every remaining element must shift one position to the left.

---

#### `unshift()`

`unshift()` adds one or more elements to the **beginning** of an array.

Example:

```js
const arr = [
  2,
  3,
];

arr.unshift(1);
```

Output:

```text
[1, 2, 3]
```

**Time Complexity:** `O(n)`

All existing elements must move one position to the right.

---

#### `push()` vs `unshift()`

| `push()` | `unshift()` |
|-----------|-------------|
| Adds at the end | Adds at the beginning |
| Usually `O(1)` | `O(n)` |
| Faster | Slower |

Choose `push()` whenever the insertion position doesn't matter.

---

#### `pop()` vs `shift()`

| `pop()` | `shift()` |
|----------|-----------|
| Removes last element | Removes first element |
| Usually `O(1)` | `O(n)` |
| Faster | Slower |

`pop()` is generally more efficient because it doesn't require reindexing.

---

#### `splice()`

`splice()` is a versatile method that can:

- Add elements.
- Remove elements.
- Replace elements.

It **mutates** the original array.

Syntax:

```js
array.splice(
  start,
  deleteCount,
  ...items
);
```

Example:

```js
const arr = [
  1,
  2,
  3,
];

arr.splice(
  1,
  1,
  100
);
```

Output:

```text
[1, 100, 3]
```

The original array is modified directly.

---

#### `fill()`

`fill()` replaces one or more elements with the same value.

Example:

```js
const arr =
  new Array(5);

arr.fill(0);
```

Output:

```text
[0, 0, 0, 0, 0]
```

It mutates the original array.

You can also specify a start and end index.

```js
arr.fill(1, 2, 4);
```

Output:

```text
[0, 0, 1, 1, 0]
```

---

#### `copyWithin()`

`copyWithin()` copies a portion of an array to another location **within the same array**.

Example:

```js
const arr = [
  1,
  2,
  3,
  4,
];

arr.copyWithin(
  2,
  0,
  2
);
```

Output:

```text
[1, 2, 1, 2]
```

The array length remains unchanged.

It mutates the original array.

---

#### The `length` Property

Every array has a `length` property.

Example:

```js
const arr = [
  10,
  20,
  30,
];

console.log(
  arr.length
);
```

Output:

```text
3
```

---

#### Increasing the `length`

You can manually increase the array length.

```js
const arr = [
  1,
  2,
];

arr.length = 5;
```

Output:

```text
[1, 2, <3 empty items>]
```

JavaScript creates **empty slots (holes)** to match the new length.

---

#### Decreasing the `length`

```js
const arr = [
  1,
  2,
  3,
  4,
];

arr.length = 2;
```

Output:

```text
[1, 2]
```

Elements beyond the new length are permanently removed.

---

#### Using the `delete` Operator

Example:

```js
const arr = [
  10,
  20,
  30,
];

delete arr[1];
```

Output:

```text
[10, empty, 30]
```

Notice:

- The array length remains unchanged.
- A **hole** is created.

---

#### Why is Using `delete` Discouraged?

The `delete` operator removes the property but **does not reindex the array**.

Example:

Before:

```text
[10, 20, 30]
```

After:

```text
[10, empty, 30]
```

This creates **sparse arrays**, which can lead to unexpected behavior during iteration.

If you want to remove an element and shift the remaining elements, use:

```js
splice();
```

instead.

---

#### Best Practices

When modifying arrays:

- Use `push()` and `pop()` for stack-like behavior.
- Use `shift()` and `unshift()` only when necessary because they are slower.
- Use `splice()` for inserting, deleting, or replacing elements at a specific index.
- Avoid using the `delete` operator on arrays.
- Avoid manually changing `length` unless you intentionally want to truncate or expand an array.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore methods for **copying, merging, and transforming arrays**, including `slice()`, `concat()`, `join()`, `reverse()`, `toReversed()`, `flat()`, `flatMap()`, and immutable alternatives like `toSorted()`.

---

### 💻 Example

We'll continue using our running example.

```js
const numbers = [
  1,
  2,
  3,
];

numbers.push(4);

numbers.splice(
  1,
  1,
  100
);

console.log(numbers);

numbers.pop();

console.log(numbers);
```

Output:

```text
[1, 100, 3, 4]

[1, 100, 3]
```

The example demonstrates adding, replacing, and removing elements using mutable array methods.

---

### 📊 Diagram / Flow

#### Adding Elements

```text
push()

↓

Add at End

-------------------

unshift()

↓

Add at Beginning
```

---

#### Removing Elements

```text
pop()

↓

Remove Last

-------------------

shift()

↓

Remove First
```

---

#### `splice()`

```text
Array

↓

Insert / Remove / Replace

↓

Updated Array
```

---

#### `delete`

```text
Array

↓

Hole Created

↓

Length Unchanged
```

---

### 🌍 Real-World Example

Imagine a queue at a movie theater.

Adding a new person to the **end** of the queue is quick.

```text
Alice

Bob

Charlie

↓

David
```

This is similar to `push()`.

Now imagine inserting someone at the **front** of the queue.

```text
David

Alice

Bob

Charlie
```

Everyone else must move back one position.

This is similar to `unshift()`, which is slower because every existing element needs to be shifted.

Likewise, removing the first person (`shift()`) requires everyone behind them to move forward, while removing the last person (`pop()`) is much more efficient.

---

### 🎤 Interview Answer

JavaScript provides several methods for adding, removing, and modifying array elements. `push()` and `pop()` operate on the end of the array and are generally **O(1)** operations because they don't require shifting existing elements. `shift()` and `unshift()` work at the beginning of the array but are **O(n)** because all remaining elements must be reindexed. `splice()` is a flexible mutable method used to insert, remove, or replace elements at any position. `fill()` replaces a range of elements with a specified value, while `copyWithin()` copies elements within the same array. The `length` property controls the size of the array and can be changed manually, although increasing it creates empty slots and decreasing it removes elements. The `delete` operator should generally be avoided for arrays because it leaves holes instead of removing elements and reindexing the array.

---

### ❓ Follow-up Questions

1. What is the difference between `push()` and `unshift()`?
2. What is the difference between `pop()` and `shift()`?
3. How does `splice()` work?
4. What happens when you manually change the `length` property?
5. Why is using the `delete` operator on arrays discouraged?
6. Which array insertion and removal methods are more efficient, and why?

---

## 4. Copying, Merging, and Transforming Arrays

### 📖 Overview

JavaScript provides several methods for creating copies of arrays, merging multiple arrays, and transforming their contents.

Some of these methods **mutate** the original array, while others return a **new array**, making them especially useful in modern applications like React where immutability is important.

In this topic, we'll cover:

- `slice()`
- `concat()`
- `join()`
- `reverse()`
- `toReversed()`
- `sort()` (brief overview)
- `toSorted()` (brief overview)
- `flat()`
- `flatMap()`

---

### ⚙️ Main Explanation

#### `slice()`

`slice()` returns a **shallow copy** of a portion of an array.

It **does not modify** the original array.

**Syntax:**

```js
array.slice(
  start,
  end
);
```

- `start` → Starting index (inclusive).
- `end` → Ending index (exclusive).

Example:

```js
const arr = [
  10,
  20,
  30,
  40,
];

const result =
  arr.slice(1, 3);

console.log(result);
```

Output:

```text
[20, 30]
```

The original array remains unchanged.

---

#### `concat()`

`concat()` merges two or more arrays and returns a **new array**.

It does **not** modify any of the original arrays.

Example:

```js
const arr1 = [
  1,
  2,
];

const arr2 = [
  3,
  4,
];

const result =
  arr1.concat(arr2);

console.log(result);
```

Output:

```text
[1, 2, 3, 4]
```

---

#### `join()`

`join()` converts all array elements into a single string.

**Syntax:**

```js
array.join(separator);
```

Example:

```js
const fruits = [
  "Apple",
  "Banana",
  "Mango",
];

console.log(
  fruits.join(", ")
);
```

Output:

```text
Apple, Banana, Mango
```

If no separator is provided, JavaScript uses a comma (`","`) by default.

---

#### `reverse()`

`reverse()` reverses the order of elements **in place**.

It **mutates** the original array.

Example:

```js
const arr = [
  1,
  2,
  3,
];

arr.reverse();

console.log(arr);
```

Output:

```text
[3, 2, 1]
```

---

#### `toReversed()`

`toReversed()` is the immutable version of `reverse()`.

Instead of modifying the original array, it returns a **new reversed array**.

Example:

```js
const arr = [
  1,
  2,
  3,
];

const reversed =
  arr.toReversed();

console.log(arr);

console.log(reversed);
```

Output:

```text
[1, 2, 3]

[3, 2, 1]
```

---

#### `reverse()` vs `toReversed()`

| `reverse()` | `toReversed()` |
|--------------|----------------|
| Mutable | Immutable |
| Changes the original array | Returns a new array |
| ES1 | ES2023 |

In React and modern applications, `toReversed()` is usually the safer choice.

---

#### `sort()` (Brief Overview)

`sort()` sorts the elements of an array **in place**.

Example:

```js
const arr = [
  3,
  1,
  2,
];

arr.sort();

console.log(arr);
```

Output:

```text
[1, 2, 3]
```

`sort()` mutates the original array.

> **Note:** We'll cover sorting in detail in the next dedicated topic.

---

#### `toSorted()` (Brief Overview)

`toSorted()` is the immutable version of `sort()`.

Example:

```js
const arr = [
  3,
  1,
  2,
];

const sorted =
  arr.toSorted();

console.log(arr);

console.log(sorted);
```

Output:

```text
[3, 1, 2]

[1, 2, 3]
```

---

#### `flat()`

`flat()` removes nested array levels.

Example:

```js
const arr = [
  1,
  [2, 3],
  [4, 5],
];

console.log(
  arr.flat()
);
```

Output:

```text
[1, 2, 3, 4, 5]
```

By default, it flattens **one level**.

You can specify the depth.

```js
arr.flat(2);
```

---

#### `flatMap()`

`flatMap()` combines two operations:

1. `map()`
2. `flat(1)`

Example:

```js
const numbers = [
  1,
  2,
  3,
];

const result =
  numbers.flatMap(
    num => [num, num * 2]
  );

console.log(result);
```

Output:

```text
[1, 2, 2, 4, 3, 6]
```

It's equivalent to:

```js
numbers
  .map(...)
  .flat();
```

but more concise and slightly more efficient.

---

#### `flat()` vs `flatMap()`

| `flat()` | `flatMap()` |
|-----------|-------------|
| Only flattens arrays | Maps and flattens |
| Doesn't transform values | Transforms values first |
| Can flatten multiple levels | Always flattens one level |

---

#### `slice()` vs `splice()`

These two methods are commonly confused.

| `slice()` | `splice()` |
|------------|------------|
| Immutable | Mutable |
| Returns a copied portion | Inserts, removes, or replaces elements |
| Original array remains unchanged | Original array is modified |

A simple trick to remember:

- **slice → copy**
- **splice → modify**

---

#### How to Merge Arrays While Preserving Immutability

Using `concat()`:

```js
const merged =
  arr1.concat(arr2);
```

Or using the spread operator:

```js
const merged = [
  ...arr1,
  ...arr2,
];
```

Both approaches create a new array without modifying the originals.

---

#### How to Flatten a Nested Array

Example:

```js
const nested = [
  [1, 2],
  [3, 4],
];

const flat =
  nested.flat();

console.log(flat);
```

Output:

```text
[1, 2, 3, 4]
```

This is commonly used when processing nested API responses or hierarchical data.

---

#### Best Practices

When working with arrays:

- Use `slice()` when you need a copy.
- Use `concat()` or the spread operator to merge arrays.
- Prefer `toReversed()` and `toSorted()` over their mutable counterparts in modern applications.
- Use `flat()` only when flattening is actually required.
- Use `flatMap()` when you need to map and flatten in a single operation.
- Avoid mutating shared arrays unless mutation is intentional.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Searching and Checking Arrays**, covering methods like `at()`, `includes()`, `indexOf()`, `find()`, `findIndex()`, `findLast()`, `some()`, and `every()`.

---

### 💻 Example

We'll continue using our running example.

```js
const numbers = [
  1,
  2,
  3,
];

const copy =
  numbers.slice();

const merged =
  numbers.concat([
    4,
    5,
  ]);

const reversed =
  numbers.toReversed();

console.log(copy);

console.log(merged);

console.log(reversed);
```

Output:

```text
[1, 2, 3]

[1, 2, 3, 4, 5]

[3, 2, 1]
```

The original array remains unchanged throughout.

---

### 📊 Diagram / Flow

#### Copy an Array

```text
Original Array

↓

slice()

↓

New Array
```

---

#### Merge Arrays

```text
Array A

+

Array B

↓

concat()

↓

New Array
```

---

#### Reverse an Array

```text
reverse()

↓

Original Array Modified

-----------------------

toReversed()

↓

New Array Returned
```

---

#### Flatten an Array

```text
Nested Array

↓

flat()

↓

Flat Array
```

---

### 🌍 Real-World Example

Imagine you have several folders containing documents.

Using **`concat()`** is like placing documents from multiple folders into a **new folder**, while leaving the original folders untouched.

Using **`slice()`** is like making a photocopy of selected pages from a file.

Using **`reverse()`** is like rearranging the pages inside the original file.

Using **`toReversed()`** is like creating a new copy of the file with the pages reversed, leaving the original exactly as it was.

This distinction between **mutating** and **non-mutating** methods is especially important when working with shared application state.

---

### 🎤 Interview Answer

JavaScript provides several methods for copying, merging, and transforming arrays. `slice()` returns a shallow copy of part or all of an array without modifying the original. `concat()` merges arrays into a new array, while `join()` converts an array into a string. `reverse()` mutates the original array, whereas `toReversed()` returns a reversed copy without changing the original. Similarly, `sort()` mutates the array, while `toSorted()` returns a sorted copy. `flat()` removes nested array levels, and `flatMap()` combines mapping and one-level flattening into a single operation. In modern JavaScript, immutable methods are generally preferred because they preserve the original data and work well with frameworks like React.

---

### ❓ Follow-up Questions

1. What is the difference between `slice()` and `splice()`?
2. What is the difference between `reverse()` and `toReversed()`?
3. What is the difference between `sort()` and `toSorted()`?
4. What is the difference between `flat()` and `flatMap()`?
5. How would you merge multiple arrays while preserving immutability?
6. How would you flatten a nested array?

---

## 5. Searching and Checking Arrays

### 📖 Overview

Searching is one of the most common operations performed on arrays.

JavaScript provides several built-in methods to:

- Access elements.
- Check whether an element exists.
- Find the position of an element.
- Retrieve elements that satisfy a condition.
- Verify whether some or all elements meet a condition.

Each method has a different purpose, and choosing the right one improves both readability and performance.

In this topic, we'll cover:

- `at()`
- `includes()`
- `indexOf()`
- `lastIndexOf()`
- `find()`
- `findIndex()`
- `findLast()`
- `findLastIndex()`
- `some()`
- `every()`

---

### ⚙️ Main Explanation

#### `at()`

The `at()` method returns the element at a specified index.

Unlike bracket notation, it also supports **negative indexes**.

Example:

```js
const fruits = [
  "Apple",
  "Banana",
  "Mango",
];

console.log(
  fruits.at(1)
);
```

Output:

```text
Banana
```

Using a negative index:

```js
console.log(
  fruits.at(-1)
);
```

Output:

```text
Mango
```

This is cleaner than writing:

```js
fruits[
  fruits.length - 1
];
```

---

#### `includes()`

`includes()` checks whether an array contains a specific value.

It returns a boolean.

Example:

```js
const numbers = [
  10,
  20,
  30,
];

console.log(
  numbers.includes(20)
);
```

Output:

```text
true
```

If the value doesn't exist:

```text
false
```

---

#### `indexOf()`

`indexOf()` returns the **first index** of a value.

Example:

```js
const arr = [
  "A",
  "B",
  "C",
];

console.log(
  arr.indexOf("B")
);
```

Output:

```text
1
```

If the value isn't found:

```text
-1
```

is returned.

---

#### `lastIndexOf()`

`lastIndexOf()` searches from the end of the array.

Example:

```js
const arr = [
  "A",
  "B",
  "A",
];

console.log(
  arr.lastIndexOf("A")
);
```

Output:

```text
2
```

---

#### `includes()` vs `indexOf()`

| `includes()` | `indexOf()` |
|---------------|-------------|
| Returns `true` or `false` | Returns the index |
| Best for existence checks | Best when index is needed |
| Easier to read | Older approach |

For checking existence, `includes()` is generally preferred.

---

#### `find()`

`find()` returns the **first element** that satisfies a condition.

Example:

```js
const users = [
  {
    id: 1,
    name: "John",
  },
  {
    id: 2,
    name: "Alice",
  },
];

const user =
  users.find(
    user =>
      user.id === 2
  );

console.log(user);
```

Output:

```text
{
  id: 2,
  name: "Alice"
}
```

If no element matches:

```text
undefined
```

is returned.

---

#### `findIndex()`

`findIndex()` works like `find()`, but returns the **index** instead of the element.

Example:

```js
const index =
  users.findIndex(
    user =>
      user.id === 2
  );

console.log(index);
```

Output:

```text
1
```

---

#### `findLast()`

`findLast()` searches from the **end** of the array.

Example:

```js
const numbers = [
  2,
  4,
  6,
  7,
  8,
];

const result =
  numbers.findLast(
    num => num % 2 === 0
  );

console.log(result);
```

Output:

```text
8
```

---

#### `findLastIndex()`

Returns the index of the last matching element.

Example:

```js
const result =
  numbers.findLastIndex(
    num => num % 2 === 0
  );

console.log(result);
```

Output:

```text
4
```

---

#### `find()` vs `filter()`

These methods are often confused.

| `find()` | `filter()` |
|-----------|------------|
| Returns the first matching element | Returns all matching elements |
| Returns an object/value | Returns an array |
| Stops after first match | Checks every element |

Choose `find()` when only one matching element is needed.

---

#### `some()`

`some()` checks whether **at least one** element satisfies a condition.

Example:

```js
const numbers = [
  1,
  3,
  5,
  8,
];

console.log(
  numbers.some(
    num => num % 2 === 0
  )
);
```

Output:

```text
true
```

It stops as soon as it finds the first matching element.

---

#### `every()`

`every()` checks whether **all** elements satisfy a condition.

Example:

```js
const numbers = [
  2,
  4,
  6,
];

console.log(
  numbers.every(
    num => num % 2 === 0
  )
);
```

Output:

```text
true
```

If even one element fails, it immediately returns `false`.

---

#### `some()` vs `every()`

| `some()` | `every()` |
|-----------|------------|
| At least one match | All elements must match |
| Returns `true` if one passes | Returns `false` if one fails |
| Stops after first success | Stops after first failure |

A useful way to remember:

- **some → any**
- **every → all**

---

#### Efficient Searching in Large Arrays

Most array searching methods perform a **linear search**.

Time Complexity:

```text
O(n)
```

This means JavaScript may check each element until it finds a match.

For very large datasets with frequent lookups, data structures like:

- `Set`
- `Map`

are often more efficient.

---

#### Best Practices

When searching arrays:

- Use `includes()` for checking existence.
- Use `indexOf()` only when you need the index.
- Use `find()` when searching objects.
- Use `filter()` when multiple matches are expected.
- Use `some()` for "any" conditions.
- Use `every()` for "all" conditions.
- Use `at(-1)` instead of manually calculating the last index.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Array Iteration and Functional Programming**, including `map()`, `filter()`, `reduce()`, `reduceRight()`, and `forEach()`.

---

### 💻 Example

We'll continue using our running example.

```js
const users = [
  {
    id: 1,
    name: "John",
  },
  {
    id: 2,
    name: "Alice",
  },
  {
    id: 3,
    name: "Bob",
  },
];

console.log(
  users.find(
    user =>
      user.id === 2
  )
);

console.log(
  users.some(
    user =>
      user.name ===
      "Bob"
  )
);

console.log(
  users.every(
    user => user.id > 0
  )
);
```

Output:

```text
{
  id: 2,
  name: "Alice"
}

true

true
```

---

### 📊 Diagram / Flow

#### Search by Value

```text
Array

↓

includes()

↓

true / false
```

---

#### Search by Condition

```text
Array

↓

find()

↓

First Match
```

---

#### Validate Elements

```text
some()

↓

Any Match?

-------------------

every()

↓

All Match?
```

---

#### Find Position

```text
Array

↓

findIndex()

↓

Index
```

---

### 🌍 Real-World Example

Imagine you're searching for employees in a company database.

- **`includes()`** is like asking, *"Does this employee exist?"*
- **`indexOf()`** is like asking, *"What position is this employee in the list?"*
- **`find()`** is like searching for the first employee with a specific employee ID.
- **`filter()`** is like listing **all** employees from a particular department.
- **`some()`** is like asking, *"Does any employee work remotely?"*
- **`every()`** is like asking, *"Have all employees completed their training?"*

Each method answers a different type of question, making it important to choose the one that best matches your intent.

---

### 🎤 Interview Answer

JavaScript provides several methods for searching and checking arrays. `at()` retrieves an element by index and supports negative indexes. `includes()` checks whether a value exists, while `indexOf()` and `lastIndexOf()` return the position of a value. `find()` returns the first element that satisfies a condition, whereas `findIndex()` returns its index. `findLast()` and `findLastIndex()` perform the same operations starting from the end of the array. `some()` checks whether at least one element matches a condition, while `every()` verifies that all elements satisfy it. Most of these methods perform a linear search with **O(n)** time complexity, so for frequent lookups in large datasets, using a `Set` or `Map` may provide better performance.

---

### ❓ Follow-up Questions

1. What is the difference between `includes()` and `indexOf()`?
2. What is the difference between `find()` and `filter()`?
3. What is the difference between `some()` and `every()`?
4. When should you use `findIndex()` instead of `find()`?
5. What does `at(-1)` do?
6. Why are `Set` and `Map` often preferred for frequent lookups in large datasets?

---

## 6. Array Iteration and Functional Programming

### 📖 Overview

Iteration means processing each element of an array one by one.

JavaScript provides several powerful methods for iterating over arrays, especially those inspired by **Functional Programming (FP)**.

These methods allow us to:

- Transform data.
- Filter data.
- Aggregate values.
- Execute side effects.
- Write cleaner and more declarative code.

The most commonly used methods are:

- `map()`
- `filter()`
- `reduce()`
- `reduceRight()`
- `forEach()`

These methods are heavily used in modern JavaScript frameworks like **React**, **Node.js**, and **Next.js**.

---

### ⚙️ Main Explanation

#### What is Functional Programming?

Functional Programming is a programming style where data is transformed using **functions** instead of manually modifying variables.

Instead of writing:

```js
const doubled = [];

for (const num of numbers) {
  doubled.push(num * 2);
}
```

we can simply write:

```js
const doubled =
  numbers.map(
    num => num * 2
  );
```

This approach is:

- More readable.
- Easier to maintain.
- Less error-prone.

---

#### `forEach()`

`forEach()` executes a callback function for every element in the array.

It **does not return a new array**.

Example:

```js
const numbers = [
  1,
  2,
  3,
];

numbers.forEach(num => {
  console.log(num);
});
```

Output:

```text
1

2

3
```

Use `forEach()` when you want to perform **side effects**, such as:

- Logging.
- Updating the DOM.
- Making API calls.
- Modifying external variables.

---

#### `map()`

`map()` transforms every element and returns a **new array**.

Example:

```js
const numbers = [
  1,
  2,
  3,
];

const doubled =
  numbers.map(
    num => num * 2
  );

console.log(doubled);
```

Output:

```text
[2, 4, 6]
```

The original array remains unchanged.

---

#### `filter()`

`filter()` returns a new array containing only the elements that satisfy a condition.

Example:

```js
const numbers = [
  1,
  2,
  3,
  4,
];

const even =
  numbers.filter(
    num => num % 2 === 0
  );

console.log(even);
```

Output:

```text
[2, 4]
```

---

#### `reduce()`

`reduce()` combines all elements into a **single value**.

Syntax:

```js
array.reduce(
  (
    accumulator,
    current
  ) => {},
  initialValue
);
```

Example:

```js
const numbers = [
  1,
  2,
  3,
  4,
];

const sum =
  numbers.reduce(
    (
      total,
      current
    ) =>
      total +
      current,
    0
  );

console.log(sum);
```

Output:

```text
10
```

`reduce()` is extremely versatile and can be used for:

- Sum.
- Average.
- Grouping.
- Counting.
- Flattening.
- Object creation.

---

#### How Does `reduce()` Work Internally?

Consider:

```js
const sum =
  numbers.reduce(
    (
      total,
      current
    ) =>
      total +
      current,
    0
  );
```

Execution:

```text
Accumulator = 0

↓

0 + 1 = 1

↓

1 + 2 = 3

↓

3 + 3 = 6

↓

6 + 4 = 10
```

Final Result:

```text
10
```

The accumulator stores the intermediate result after each iteration.

---

#### `reduceRight()`

`reduceRight()` works like `reduce()`, but processes elements from **right to left**.

Example:

```js
const words = [
  "A",
  "B",
  "C",
];

const result =
  words.reduceRight(
    (
      acc,
      word
    ) => acc + word,
    ""
  );

console.log(result);
```

Output:

```text
CBA
```

---

#### `map()` vs `forEach()`

These methods are frequently compared.

| `map()` | `forEach()` |
|----------|-------------|
| Returns a new array | Returns `undefined` |
| Used for transformation | Used for side effects |
| Chainable | Not chainable |
| Immutable | Doesn't create a new array |

Use `map()` when creating new data.

Use `forEach()` when performing actions.

---

#### `find()` vs `filter()`

Another common interview question.

| `find()` | `filter()` |
|-----------|------------|
| Returns first match | Returns all matches |
| Returns an element | Returns an array |
| Stops after first match | Checks every element |

---

#### Removing Duplicates Using Functional Methods

Example:

```js
const numbers = [
  1,
  2,
  2,
  3,
];

const unique = [
  ...new Set(
    numbers
  ),
];

console.log(unique);
```

Output:

```text
[1, 2, 3]
```

---

#### Grouping Objects with `reduce()`

Example:

```js
const users = [
  {
    name: "John",
    role: "Admin",
  },
  {
    name: "Alice",
    role: "User",
  },
  {
    name: "Bob",
    role: "Admin",
  },
];

const grouped =
  users.reduce(
    (
      acc,
      user
    ) => {
      if (
        !acc[user.role]
      ) {
        acc[user.role] =
          [];
      }

      acc[
        user.role
      ].push(user);

      return acc;
    },
    {}
  );

console.log(grouped);
```

Output:

```text
{
  Admin: [...],
  User: [...]
}
```

This is a common interview problem.

---

#### Why is `map()` Commonly Used in React?

React expects a **new array of JSX elements**.

Example:

```jsx
users.map(user => (
  <UserCard
    key={user.id}
    user={user}
  />
));
```

Since `map()` returns a new array, it's the perfect method for rendering lists.

`forEach()` cannot be used here because it returns `undefined`.

---

#### Best Practices

When iterating over arrays:

- Use `map()` for transformations.
- Use `filter()` to select elements.
- Use `reduce()` for aggregation.
- Use `forEach()` for side effects only.
- Prefer functional methods over manual loops when they improve readability.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Sorting Arrays**, including `sort()`, `toSorted()`, custom compare functions, numeric sorting, and sorting arrays of objects.

---

### 💻 Example

We'll continue using our running example.

```js
const numbers = [
  1,
  2,
  3,
  4,
];

const doubled =
  numbers.map(
    num => num * 2
);

const even =
  numbers.filter(
    num => num % 2 === 0
);

const sum =
  numbers.reduce(
    (
      total,
      num
    ) =>
      total +
      num,
    0
  );

console.log(doubled);

console.log(even);

console.log(sum);
```

Output:

```text
[2, 4, 6, 8]

[2, 4]

10
```

---

### 📊 Diagram / Flow

#### `map()`

```text
Array

↓

Transform Each Element

↓

New Array
```

---

#### `filter()`

```text
Array

↓

Condition

↓

Matching Elements
```

---

#### `reduce()`

```text
Array

↓

Accumulator

↓

Single Value
```

---

#### `forEach()`

```text
Array

↓

Execute Callback

↓

Side Effects
```

---

### 🌍 Real-World Example

Imagine a company's employee database.

- **`map()`** is like creating a new ID card for every employee.
- **`filter()`** is like selecting only employees from the Engineering department.
- **`reduce()`** is like calculating the total salary paid to all employees.
- **`forEach()`** is like sending an email notification to every employee.

Each method performs a different task, even though they all iterate through the same array.

---

### 🎤 Interview Answer

JavaScript provides several functional array methods for iteration and data processing. `forEach()` executes a callback for every element but doesn't return a value, making it suitable for side effects such as logging or DOM updates. `map()` transforms each element and returns a new array, while `filter()` returns a new array containing only elements that satisfy a condition. `reduce()` combines all elements into a single value using an accumulator and is commonly used for calculations, grouping, and object creation. `reduceRight()` works similarly but processes elements from right to left. These methods promote a functional programming style, improve readability, and are widely used in modern frameworks like React.

---

### ❓ Follow-up Questions

1. What is the difference between `map()` and `forEach()`?
2. What is the difference between `find()` and `filter()`?
3. How does `reduce()` work internally?
4. What is the difference between `reduce()` and `reduceRight()`?
5. Why is `map()` commonly used in React for rendering lists?
6. How would you group objects in an array by a specific property?

---

## 7. Sorting Arrays

### 📖 Overview

Sorting is one of the most common operations performed on arrays.

JavaScript provides two primary methods for sorting:

- `sort()` (Mutable)
- `toSorted()` (Immutable)

Although sorting looks simple, it's also one of the most misunderstood topics in JavaScript interviews.

Common interview questions include:

- Why doesn't `sort()` sort numbers correctly?
- How does the compare function work?
- What's the difference between `sort()` and `toSorted()`?
- How do you sort an array of objects?

Understanding these concepts will help you avoid common bugs and write more predictable code.

---

### ⚙️ Main Explanation

#### `sort()`

`sort()` sorts the elements of an array **in place**.

It **mutates** the original array.

Example:

```js
const fruits = [
  "Banana",
  "Apple",
  "Mango",
];

fruits.sort();

console.log(fruits);
```

Output:

```text
[
  "Apple",
  "Banana",
  "Mango"
]
```

---

#### Why Doesn't `sort()` Sort Numbers Correctly?

By default, `sort()` converts elements to **strings** and compares them lexicographically (dictionary order).

Example:

```js
const numbers = [
  1,
  10,
  2,
  5,
];

numbers.sort();

console.log(numbers);
```

Output:

```text
[1, 10, 2, 5]
```

This happens because JavaScript compares:

```text
"1"

↓

"10"

↓

"2"

↓

"5"
```

instead of comparing numeric values.

---

#### Numeric Sorting

To sort numbers correctly, provide a **compare function**.

Ascending order:

```js
const numbers = [
  1,
  10,
  2,
  5,
];

numbers.sort(
  (
    a,
    b
  ) => a - b
);

console.log(numbers);
```

Output:

```text
[1, 2, 5, 10]
```

Descending order:

```js
numbers.sort(
  (
    a,
    b
  ) => b - a
);
```

Output:

```text
[10, 5, 2, 1]
```

---

#### How Does the Compare Function Work?

The compare function receives two values:

```js
(a, b)
```

It should return:

| Return Value | Meaning |
|--------------|---------|
| Negative | `a` comes before `b` |
| Positive | `b` comes before `a` |
| `0` | Keep their relative order |

Example:

```js
numbers.sort(
  (
    a,
    b
  ) => a - b
);
```

If:

```text
a = 2

b = 5
```

Then:

```text
2 - 5 = -3
```

Since the result is negative, `2` is placed before `5`.

---

#### Sorting Strings

Strings work correctly without a compare function.

Example:

```js
const cities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
];

cities.sort();
```

Output:

```text
[
  "Bengaluru",
  "Delhi",
  "Mumbai"
]
```

---

#### Sorting Objects

Objects must be sorted using one of their properties.

Example:

```js
const users = [
  {
    name: "John",
    age: 28,
  },
  {
    name: "Alice",
    age: 22,
  },
  {
    name: "Bob",
    age: 30,
  },
];

users.sort(
  (
    a,
    b
  ) => a.age - b.age
);

console.log(users);
```

Output:

```text
[
  {
    name: "Alice",
    age: 22,
  },
  {
    name: "John",
    age: 28,
  },
  {
    name: "Bob",
    age: 30,
  }
]
```

---

#### `toSorted()`

`toSorted()` is the immutable version of `sort()`.

Instead of modifying the original array, it returns a **new sorted array**.

Example:

```js
const numbers = [
  3,
  1,
  2,
];

const sorted =
  numbers.toSorted(
    (
      a,
      b
    ) => a - b
  );

console.log(numbers);

console.log(sorted);
```

Output:

```text
[3, 1, 2]

[1, 2, 3]
```

---

#### `sort()` vs `toSorted()`

| `sort()` | `toSorted()` |
|-----------|--------------|
| Mutable | Immutable |
| Modifies original array | Returns a new array |
| ES1 | ES2023 |
| Use when mutation is acceptable | Preferred in React and modern apps |

---

#### Time Complexity of Sorting

JavaScript engines typically implement sorting using optimized algorithms such as **Timsort** or similar hybrid algorithms.

Average time complexity:

```text
O(n log n)
```

Worst-case complexity depends on the JavaScript engine but is generally optimized.

---

#### Common Mistakes

Some common mistakes include:

**Sorting numbers without a compare function**

```js
numbers.sort();
```

Incorrect result:

```text
[1, 10, 2]
```

---

**Accidentally mutating the original array**

```js
const sorted =
  users.sort();
```

This changes `users` itself.

If mutation isn't desired:

```js
const sorted =
  users.toSorted();
```

or

```js
const sorted =
  [...users].sort();
```

---

#### Best Practices

When sorting arrays:

- Always provide a compare function for numbers.
- Use `toSorted()` when you need immutability.
- Sort objects using the relevant property.
- Avoid mutating shared arrays, especially in React state.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Sparse Arrays, Holes, and Internal Memory**, including how JavaScript stores sparse arrays, what holes are, and how changing the `length` property affects an array.

---

### 💻 Example

We'll continue using our running example.

```js
const products = [
  {
    name: "Phone",
    price: 300,
  },
  {
    name: "Laptop",
    price: 1000,
  },
  {
    name: "Mouse",
    price: 50,
  },
];

const sorted =
  products.toSorted(
    (
      a,
      b
    ) =>
      a.price -
      b.price
  );

console.log(sorted);
```

Output:

```text
[
  {
    name: "Mouse",
    price: 50,
  },
  {
    name: "Phone",
    price: 300,
  },
  {
    name: "Laptop",
    price: 1000,
  }
]
```

---

### 📊 Diagram / Flow

#### `sort()`

```text
Original Array

↓

sort()

↓

Original Array Modified
```

---

#### `toSorted()`

```text
Original Array

↓

toSorted()

↓

New Sorted Array
```

---

#### Compare Function

```text
Compare a and b

↓

Negative

↓

a before b

--------------------

Positive

↓

b before a

--------------------

Zero

↓

Keep Order
```

---

### 🌍 Real-World Example

Imagine a library arranging books.

Using **`sort()`** is like rearranging the books directly on the existing shelf.

```text
Shelf

↓

Books Rearranged
```

Using **`toSorted()`** is like creating a second shelf with the books in sorted order while leaving the original shelf untouched.

This approach is especially useful in applications where the original data must remain unchanged, such as React state management.

---

### 🎤 Interview Answer

JavaScript provides `sort()` and `toSorted()` for sorting arrays. `sort()` sorts the array in place and mutates the original array, whereas `toSorted()` returns a new sorted array without modifying the original. By default, `sort()` compares elements as strings, so numeric arrays require a compare function such as `(a, b) => a - b` for ascending order or `(a, b) => b - a` for descending order. Arrays of objects are sorted by comparing specific properties inside the compare function. Modern JavaScript applications, especially those using React, often prefer `toSorted()` because it preserves immutability and avoids unintended side effects.

---

### ❓ Follow-up Questions

1. Why doesn't `sort()` sort numbers correctly by default?
2. How does the compare function work?
3. What is the difference between `sort()` and `toSorted()`?
4. How would you sort an array of objects?
5. Why is `toSorted()` preferred in React?
6. What is the average time complexity of JavaScript array sorting?

---

## 8. Sparse Arrays, Holes, and Internal Memory

### 📖 Overview

Most JavaScript arrays are **dense arrays**, where every index contains a value.

However, JavaScript also supports **sparse arrays**, where some indexes are empty.

These empty positions are called **holes**.

Sparse arrays are a unique feature of JavaScript and are frequently discussed in interviews because they behave differently from normal arrays.

In this topic, we'll cover:

- Dense Arrays
- Sparse Arrays
- Holes
- Internal memory representation
- The `length` property
- The `delete` operator
- Performance implications

---

### ⚙️ Main Explanation

#### Dense Arrays

A **dense array** has a value at every index.

Example:

```js
const numbers = [
  10,
  20,
  30,
];
```

Memory:

```text
Index

0 → 10

1 → 20

2 → 30
```

Every index contains a value.

---

#### Sparse Arrays

A **sparse array** has one or more empty indexes (holes).

Example:

```js
const arr = [];

arr[3] = "Hello";

console.log(arr);
```

Output:

```text
[
  <3 empty items>,
  "Hello"
]
```

Memory:

```text
0 → empty

1 → empty

2 → empty

3 → Hello
```

Indexes `0`, `1`, and `2` don't actually contain values.

---

#### What are Holes?

A **hole** is an index that **doesn't exist** in the array.

It is **not** the same as:

```js
undefined
```

Example:

```js
const arr = [];

arr[2] = 100;
```

Output:

```text
[
  <2 empty items>,
  100
]
```

Here:

```text
Index 0 → Hole

Index 1 → Hole

Index 2 → 100
```

No values exist at indexes `0` and `1`.

---

#### Hole vs `undefined`

These two concepts are often confused.

Example:

```js
const arr1 = [
  undefined,
];

const arr2 = [];

arr2.length = 1;
```

Although both appear similar, they are different internally.

```js
0 in arr1;
```

Output:

```text
true
```

Because index `0` exists.

---

```js
0 in arr2;
```

Output:

```text
false
```

Because index `0` is a **hole**.

---

#### How are Sparse Arrays Created?

There are several ways to create sparse arrays.

##### Increasing the `length`

```js
const arr = [
  1,
  2,
];

arr.length = 5;
```

Output:

```text
[
  1,
  2,
  <3 empty items>
]
```

---

##### Assigning to a Large Index

```js
const arr = [];

arr[10] = "Hello";
```

Output:

```text
[
  <10 empty items>,
  "Hello"
]
```

---

##### Using `delete`

```js
const arr = [
  1,
  2,
  3,
];

delete arr[1];
```

Output:

```text
[
  1,
  <1 empty item>,
  3
]
```

The array length remains unchanged.

---

#### How Does JavaScript Handle Sparse Arrays Internally?

Dense arrays are optimized for fast sequential access.

```text
0 → Value

1 → Value

2 → Value
```

Sparse arrays cannot use this optimization efficiently because many indexes are missing.

Conceptually:

```text
0 → Hole

1 → Hole

2 → Hole

1000 → Value
```

JavaScript engines use different internal storage strategies for sparse arrays, which are generally slower than dense arrays.

---

#### What Happens When You Change `length`?

##### Increasing `length`

```js
const arr = [
  1,
  2,
];

arr.length = 5;
```

Output:

```text
[
  1,
  2,
  <3 empty items>
]
```

JavaScript creates holes.

---

##### Decreasing `length`

```js
const arr = [
  1,
  2,
  3,
  4,
];

arr.length = 2;
```

Output:

```text
[
  1,
  2
]
```

Elements beyond the new length are permanently removed.

---

#### Why is Using `delete` Discouraged?

The `delete` operator removes the property at an index but **does not shift** the remaining elements.

Example:

```js
const arr = [
  "A",
  "B",
  "C",
];

delete arr[1];
```

Output:

```text
[
  "A",
  <1 empty item>,
  "C"
]
```

This creates a sparse array.

If you want to remove an element properly and reindex the remaining elements, use:

```js
arr.splice(1, 1);
```

instead.

---

#### Performance Implications

Dense arrays are generally faster because elements are stored in contiguous indexes.

Sparse arrays:

- Consume memory less efficiently.
- Require additional internal bookkeeping.
- Can reduce performance during iteration.
- May disable engine optimizations.

For this reason, sparse arrays should generally be avoided unless there is a specific use case.

---

#### Best Practices

When working with arrays:

- Prefer dense arrays over sparse arrays.
- Avoid using the `delete` operator on arrays.
- Use `splice()` when removing elements.
- Avoid manually increasing `length` unless necessary.
- Don't rely on holes to represent missing data; use `null` or `undefined` instead.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore **Performance and Time Complexity**, including why `push()` is faster than `shift()`, Big-O complexity of common array operations, and performance best practices.

---

### 💻 Example

We'll continue using our running example.

```js
const arr = [
  10,
  20,
  30,
];

delete arr[1];

console.log(arr);

console.log(arr.length);

console.log(1 in arr);
```

Output:

```text
[
  10,
  <1 empty item>,
  30
]

3

false
```

Notice that the length remains `3`, even though index `1` no longer exists.

---

### 📊 Diagram / Flow

#### Dense Array

```text
0 → 10

1 → 20

2 → 30
```

---

#### Sparse Array

```text
0 → Hole

1 → Hole

2 → Hole

3 → 40
```

---

#### Increasing `length`

```text
Array

↓

length = 5

↓

Holes Created
```

---

#### Using `delete`

```text
Array

↓

delete arr[1]

↓

Hole Created

↓

Length Unchanged
```

---

### 🌍 Real-World Example

Imagine a row of lockers.

In a **dense row**, every locker has an assigned student.

```text
Locker 1 → Alice

Locker 2 → Bob

Locker 3 → Charlie
```

In a **sparse row**, several lockers are empty.

```text
Locker 1 → Empty

Locker 2 → Empty

Locker 3 → David
```

The numbering still exists, but some lockers have no owner.

Similarly, a sparse array still has indexes, but some of those indexes don't contain values—they contain **holes**.

Using `delete` is like removing a student's name from a locker without renumbering the remaining lockers.

---

### 🎤 Interview Answer

A sparse array is an array with one or more missing indexes, called **holes**. Unlike a value of `undefined`, a hole means the property doesn't exist at all. Sparse arrays can be created by assigning values to large indexes, increasing the `length` property, or using the `delete` operator. JavaScript engines optimize dense arrays more efficiently than sparse arrays, so sparse arrays can reduce performance and disable certain internal optimizations. The `delete` operator should generally be avoided because it creates holes without changing the array's length. Instead, `splice()` should be used when elements need to be removed and the remaining elements should be reindexed.

---

### ❓ Follow-up Questions

1. What is a sparse array?
2. What is the difference between a hole and `undefined`?
3. How are sparse arrays created?
4. What happens when you increase or decrease the `length` property?
5. Why is using `delete` on arrays discouraged?
6. Why are dense arrays generally more efficient than sparse arrays?

---

## 9. Performance and Time Complexity

### 📖 Overview

When working with arrays, choosing the right operation isn't just about correctness—it's also about **performance**.

Some array operations are extremely fast, while others become slower as the array grows.

In interviews, you're often asked questions like:

- Why is `push()` faster than `shift()`?
- What is the time complexity of common array operations?
- Which operations should be avoided on large arrays?

Understanding **Big-O Time Complexity** helps you choose efficient operations and write scalable applications.

---

### ⚙️ Main Explanation

#### What is Time Complexity?

**Time Complexity** describes how the execution time of an operation grows as the input size (`n`) increases.

For arrays, we mainly encounter:

| Complexity | Meaning |
|------------|---------|
| **O(1)** | Constant time |
| **O(n)** | Linear time |
| **O(n log n)** | Log-linear time |

The lower the complexity, the more efficient the operation generally is.

---

#### Why is `push()` Faster than `shift()`?

Consider this array:

```text
Index

0 → A

1 → B

2 → C
```

Using:

```js
arr.push("D");
```

Result:

```text
0 → A

1 → B

2 → C

3 → D
```

JavaScript simply appends the new element to the end.

No existing elements need to move.

**Time Complexity:**

```text
O(1)
```

---

Now consider:

```js
arr.shift();
```

Result:

```text
Before

0 → A

1 → B

2 → C

-------------------

After

0 → B

1 → C
```

After removing the first element:

- `B` moves from index `1` to `0`.
- `C` moves from index `2` to `1`.

Every remaining element must be reindexed.

**Time Complexity:**

```text
O(n)
```

---

#### Why is `unshift()` Also O(n)?

`unshift()` inserts elements at the beginning.

Example:

```js
const arr = [
  "B",
  "C",
];

arr.unshift("A");
```

Result:

```text
Before

0 → B

1 → C

-------------------

After

0 → A

1 → B

2 → C
```

Every existing element shifts one position to the right.

Therefore:

```text
O(n)
```

---

#### Time Complexity of Common Array Operations

| Operation | Time Complexity |
|-----------|-----------------|
| Access by index (`arr[i]`) | **O(1)** |
| Update by index | **O(1)** |
| `push()` | **O(1)** (amortized) |
| `pop()` | **O(1)** |
| `shift()` | **O(n)** |
| `unshift()` | **O(n)** |
| `splice()` | **O(n)** |
| `slice()` | **O(n)** |
| `concat()` | **O(n)** |
| `includes()` | **O(n)** |
| `indexOf()` | **O(n)** |
| `find()` | **O(n)** |
| `filter()` | **O(n)** |
| `map()` | **O(n)** |
| `reduce()` | **O(n)** |
| `sort()` | **O(n log n)** |

These are the complexities most commonly discussed in interviews.

---

#### Why is Access by Index O(1)?

Arrays store elements using numeric indexes.

Example:

```js
const arr = [
  10,
  20,
  30,
];

console.log(
  arr[2]
);
```

JavaScript can directly calculate where index `2` is located.

It doesn't need to search through previous elements.

Therefore:

```text
O(1)
```

---

#### Why are Searching Methods O(n)?

Methods like:

- `includes()`
- `find()`
- `indexOf()`

may need to examine every element until they find a match.

Example:

```js
const arr = [
  10,
  20,
  30,
  40,
];

arr.includes(40);
```

If `40` is the last element, JavaScript checks:

```text
10

↓

20

↓

30

↓

40
```

This is a **linear search**.

---

#### Why is `sort()` O(n log n)?

Sorting requires comparing and rearranging many elements.

Modern JavaScript engines use highly optimized algorithms such as **Timsort** (or similar implementations), giving an average complexity of:

```text
O(n log n)
```

This is significantly more efficient than a simple quadratic sorting algorithm like Bubble Sort (`O(n²)`).

---

#### Choosing the Right Data Structure

Arrays are excellent when:

- Maintaining order is important.
- Accessing elements by index.
- Iterating through data.

However, for frequent lookups:

```text
Array

↓

O(n)
```

Whereas:

```text
Set

↓

O(1)

(Map average case as well)
```

For applications with frequent searches, `Set` or `Map` can be a better choice.

---

#### Performance Best Practices

To write efficient array code:

- Prefer `push()` and `pop()` over `shift()` and `unshift()` whenever possible.
- Avoid repeatedly inserting or removing elements from the beginning of large arrays.
- Use `Set` or `Map` for frequent lookups.
- Avoid unnecessary array copies in performance-critical code.
- Choose immutable methods when working with shared state, but be mindful that they create new arrays.

---

### 💻 Example

We'll continue using our running example.

```js
const numbers = [
  10,
  20,
  30,
];

numbers.push(40);

numbers.pop();

numbers.shift();

console.log(numbers);
```

Output:

```text
[20, 30]
```

In this example:

- `push()` and `pop()` execute in constant time.
- `shift()` is slower because the remaining elements must be reindexed.

---

### 📊 Diagram / Flow

#### `push()`

```text
Array

↓

Add at End

↓

No Elements Move

↓

O(1)
```

---

#### `shift()`

```text
Array

↓

Remove First

↓

All Remaining Elements Shift

↓

O(n)
```

---

#### Search Operations

```text
Array

↓

Check Each Element

↓

Match Found

↓

O(n)
```

---

#### Sorting

```text
Unsorted Array

↓

Compare Elements

↓

Rearrange

↓

Sorted Array

↓

O(n log n)
```

---

### 🌍 Real-World Example

Imagine a line of people waiting to enter a concert.

Adding a new person to the **end** of the line is easy.

```text
Alice

Bob

Charlie

↓

David
```

No one else has to move.

This is similar to `push()`.

Now imagine removing the **first** person.

```text
Alice leaves.

↓

Bob moves forward.

↓

Charlie moves forward.
```

Everyone behind must change position.

This is exactly how `shift()` works, which is why it's slower than `push()`.

---

### 🎤 Interview Answer

The performance of array operations depends on how many elements need to be processed. Accessing or updating an element by index is **O(1)** because JavaScript can directly calculate its position. `push()` and `pop()` are generally **O(1)** because they operate at the end of the array without shifting existing elements. In contrast, `shift()` and `unshift()` are **O(n)** because all remaining elements must be reindexed. Methods such as `find()`, `includes()`, `map()`, `filter()`, and `reduce()` are also **O(n)** since they iterate through the array. Sorting is typically **O(n log n)** due to the underlying sorting algorithms used by JavaScript engines. Choosing the appropriate operation and data structure is essential for building efficient applications.

---

### ❓ Follow-up Questions

1. Why is `push()` generally faster than `shift()`?
2. Why are `shift()` and `unshift()` **O(n)**?
3. What is the time complexity of common array operations?
4. Why is accessing an element by index **O(1)**?
5. Why are searching methods like `find()` and `includes()` **O(n)**?
6. When should you use a `Set` or `Map` instead of an array?

---

## 10. Production Best Practices

### 📖 Overview

Knowing how array methods work is important, but writing **production-quality code** requires following best practices.

In real-world applications, developers work with:

- Large datasets.
- Shared application state.
- API responses.
- React state management.
- Performance-sensitive code.

This section focuses on common mistakes developers make while working with arrays and the best practices that experienced JavaScript developers follow.

---

### ⚙️ Main Explanation

#### Common Mistake 1: Mutating Arrays Unintentionally

One of the biggest mistakes is modifying an array when a copy should have been created.

Example:

```js
const users = [
  "John",
  "Alice",
];

const sorted =
  users.sort();
```

`sort()` mutates the original array.

After execution:

```text
users === sorted
```

Both variables reference the same modified array.

Instead:

```js
const sorted =
  users.toSorted();
```

or

```js
const sorted = [
  ...users,
].sort();
```

---

#### Common Mistake 2: Using `delete` on Arrays

Example:

```js
const arr = [
  1,
  2,
  3,
];

delete arr[1];
```

Result:

```text
[
  1,
  <1 empty item>,
  3
]
```

This creates a **hole**.

Instead:

```js
arr.splice(1, 1);
```

---

#### Common Mistake 3: Using `forEach()` When `map()` Is Needed

Incorrect:

```js
const doubled = [];

numbers.forEach(num => {
  doubled.push(
    num * 2
  );
});
```

Better:

```js
const doubled =
  numbers.map(
    num => num * 2
  );
```

`map()` is shorter, more expressive, and returns a new array directly.

---

#### Common Mistake 4: Forgetting That Objects Are Shared

Consider:

```js
const users = [
  {
    name: "John",
  },
];

const copy = [
  ...users,
];

copy[0].name =
  "Alice";
```

Result:

```text
users[0].name

↓

Alice
```

Although the array was copied, the object inside it was **not**.

The spread operator performs a **shallow copy**.

For nested objects, use:

```js
structuredClone();
```

or another appropriate deep-copy solution when needed.

---

#### Common Mistake 5: Using the Wrong Method

Many methods seem similar but have different purposes.

| Goal | Recommended Method |
|------|--------------------|
| Transform data | `map()` |
| Select data | `filter()` |
| Find one element | `find()` |
| Check existence | `includes()` |
| Aggregate values | `reduce()` |
| Execute side effects | `forEach()` |

Choosing the correct method improves readability.

---

#### Common Mistake 6: Ignoring Time Complexity

Example:

```js
for (...) {
  arr.shift();
}
```

Since `shift()` is **O(n)**, repeatedly calling it on large arrays can significantly reduce performance.

Whenever possible:

- Prefer `push()` and `pop()`.
- Avoid repeated operations at the beginning of large arrays.

---

#### Common Mistake 7: Manually Managing Indexes

Instead of:

```js
for (
  let i = 0;
  i < arr.length;
  i++
) {
  // ...
}
```

Use higher-level methods when appropriate.

Example:

```js
arr.map(...);

arr.filter(...);

arr.forEach(...);
```

They are often easier to read and less error-prone.

---

#### Common Mistake 8: Not Using Immutability in React

Incorrect:

```js
state.users.push(
  newUser
);
```

Correct:

```js
setUsers(
  prev => [
    ...prev,
    newUser,
  ]
);
```

Creating a new array ensures React detects the state update.

---

#### Best Practices

##### Prefer Immutable Updates

Instead of:

```js
arr.reverse();
```

Use:

```js
arr.toReversed();
```

---

##### Choose the Right Method

Instead of forcing one method to do everything, select the method that best matches the intent.

For example:

- `map()` → transform
- `filter()` → filter
- `find()` → search
- `reduce()` → aggregate

---

##### Avoid Sparse Arrays

Don't create holes intentionally.

Instead of:

```js
delete arr[2];
```

Use:

```js
splice();
```

---

##### Write Declarative Code

Prefer:

```js
const adults =
  users.filter(
    user =>
      user.age >= 18
  );
```

over manual loops when it improves readability.

---

##### Keep Arrays Focused

An array should usually contain elements of the same type.

Good:

```js
[
  "Apple",
  "Banana",
]
```

Avoid mixing unrelated values unless there is a valid reason.

---

##### Optimize Lookups

If frequent existence checks are required:

Instead of:

```js
arr.includes(value);
```

many times,

consider using:

```js
Set
```

for average-case constant-time lookups.

---

### 💻 Example

We'll continue using our running example.

```js
const users = [
  {
    id: 1,
    name: "John",
  },
  {
    id: 2,
    name: "Alice",
  },
];

const updatedUsers =
  users.map(user =>
    user.id === 2
      ? {
          ...user,
          name: "Bob",
        }
      : user
  );

console.log(updatedUsers);

console.log(users);
```

Output:

```text
[
  {
    id: 1,
    name: "John",
  },
  {
    id: 2,
    name: "Bob",
  }
]

[
  {
    id: 1,
    name: "John",
  },
  {
    id: 2,
    name: "Alice",
  }
]
```

The original array remains unchanged.

---

### 📊 Diagram / Flow

#### Mutable Update

```text
Original Array

↓

Modified Directly

↓

Side Effects Possible
```

---

#### Immutable Update

```text
Original Array

↓

Create Copy

↓

Modify Copy

↓

Original Preserved
```

---

#### Choosing the Right Method

```text
Transform

↓

map()

--------------------

Filter

↓

filter()

--------------------

Find One

↓

find()

--------------------

Aggregate

↓

reduce()
```

---

### 🌍 Real-World Example

Imagine a company maintains an employee database.

Instead of editing the original master file directly, the company creates a new version whenever updates are made.

```text
Master File

↓

Copy

↓

Apply Changes

↓

Save New Version
```

This preserves the original data and makes it easier to track changes.

Similarly, modern JavaScript applications—especially React applications—prefer immutable array updates because they improve predictability, simplify debugging, and enable efficient rendering.

---

### 🎤 Interview Answer

In production applications, it's important to use array methods appropriately and avoid common pitfalls. Developers should avoid mutating shared arrays unintentionally, especially in React state, where immutable updates are preferred. Methods like `map()`, `filter()`, `find()`, and `reduce()` should be chosen based on their intended purpose, while `delete` should be avoided because it creates sparse arrays. Developers should also be aware of shallow copying when using the spread operator and choose `structuredClone()` or another deep-copy approach when necessary. Considering time complexity, selecting appropriate data structures, and writing declarative code all contribute to cleaner, more maintainable, and more performant applications.

---

### ❓ Follow-up Questions

1. What are the most common mistakes developers make while working with arrays?
2. Why should you avoid mutating arrays in React?
3. Why is using `delete` on arrays discouraged?
4. Why is the spread operator only a shallow copy?
5. How do you choose the right array method for a particular task?
6. What are some best practices for writing production-quality array code?

---