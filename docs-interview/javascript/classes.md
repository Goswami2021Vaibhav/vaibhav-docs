---
title: Classes
description: ES6 classes, inheritance, static members, and private fields.
sidebar_position: 12
---

# Classes

## 1. What are Classes, and why were they introduced?

### 📖 Overview

Before ES6 (ECMAScript 2015), JavaScript developers primarily used **Constructor Functions** and **Prototypes** to create objects and implement inheritance.

Although this approach was powerful, many developers—especially those coming from languages like Java or C#—found it difficult to understand.

To make object-oriented programming more familiar and readable, ES6 introduced the **`class`** keyword.

However, it's important to understand that **JavaScript Classes did not introduce a new inheritance model**.

They are simply a cleaner syntax built on top of JavaScript's existing **Prototype-based Inheritance**.

---

### ⚙️ Main Explanation

#### What is a Class?

A **Class** is a blueprint for creating objects.

It defines:

- Properties (data)
- Methods (behavior)

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

Now create an object.

```js
const user =
  new User("Vaibhav");

user.greet();
```

Output:

```text
Hello, Vaibhav
```

Each object created from the class is called an **instance**.

---

#### Why Were Classes Introduced?

Before ES6, the same example looked like this.

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

Although this works perfectly, many developers considered it harder to read.

ES6 classes provide cleaner syntax while keeping the same underlying behavior.

Compare:

**Constructor Function**

```js
function User(name) {
  this.name = name;
}
```

**Class**

```js
class User {
  constructor(name) {
    this.name = name;
  }
}
```

The class version is more concise and resembles class syntax from other object-oriented languages.

---

#### Are Classes a New Inheritance Model?

**No.**

This is one of the most common JavaScript interview questions.

Classes **do not replace prototypes**.

Instead:

```text
Class

↓

Constructor Function

↓

Prototype

↓

Objects
```

When you write:

```js
class User {}
```

JavaScript internally creates a constructor function and stores methods on its prototype.

The prototype system remains unchanged.

---

#### Classes and Prototypes

Consider this class.

```js
class User {
  greet() {
    console.log("Hello");
  }
}
```

Internally, JavaScript behaves similarly to:

```js
function User() {}

User.prototype.greet =
  function () {
    console.log("Hello");
  };
```

The two approaches create nearly the same prototype relationship.

```text
user

↓

User.prototype

↓

Object.prototype

↓

null
```

This is why classes are called **syntactic sugar**.

---

#### Why Are Classes Called "Syntactic Sugar"?

"Syntactic sugar" means a language feature that makes code easier to read without changing how it fundamentally works.

Example:

```js
class User {}
```

is essentially a more readable way to write:

```js
function User() {}
```

along with prototype methods.

The JavaScript engine still relies on prototypes behind the scenes.

---

#### Advantages of Classes

Classes offer several benefits.

- Cleaner syntax.
- Easier to read.
- Familiar to developers from Java, C#, and C++.
- Better organization of related properties and methods.
- Built-in support for features like `extends`, `super`, `static`, and private fields.

These improvements make object-oriented code easier to write and maintain.

---

#### Classes vs Constructor Functions

| Class | Constructor Function |
|--------|----------------------|
| Modern syntax | Older syntax |
| Easier to read | More verbose |
| Supports `extends` | Manual prototype setup |
| Supports private fields | No native private fields |
| Uses prototypes internally | Uses prototypes directly |

Both ultimately rely on the same prototype mechanism.

---

#### JavaScript Classes vs Java Classes

Although the syntax looks similar, the implementation is different.

**Java**

```text
Class

↓

Object
```

Objects are created from classes.

---

**JavaScript**

```text
Class

↓

Constructor Function

↓

Prototype

↓

Object
```

JavaScript classes are a layer on top of prototypes rather than a completely new object model.

---

#### Best Practices

When using classes:

- Prefer classes for object-oriented code in modern JavaScript.
- Remember that classes are built on prototypes.
- Don't think of JavaScript classes as identical to Java or C# classes.
- Use classes when they improve readability and organization.

---

> 💡 **Coming Next**
>
> In the next topic, we'll explore how classes are instantiated, what the `constructor()` method does, how the `new` keyword works with classes, and what happens internally when an instance is created.

---

### 💻 Example

We'll use the following example throughout this chapter.

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

const user =
  new User("Vaibhav");

user.greet();
```

Output:

```text
Hello, Vaibhav
```

The `User` class acts as a blueprint, and `user` is an instance created from it.

---

### 📊 Diagram / Flow

#### ES6 Class

```text
Class

↓

Blueprint

↓

Objects
```

---

#### Internal Relationship

```text
Class

↓

Constructor Function

↓

Prototype

↓

Object
```

---

#### Instance Creation

```text
Class

↓

new

↓

Instance
```

---

#### Prototype Chain

```text
Instance

↓

Class.prototype

↓

Object.prototype

↓

null
```

---

### 🌍 Real-World Example

Imagine a company that hires employees.

Instead of writing separate instructions for every new employee, the company creates a **standard employee template**.

```text
Employee Template

↓

Employee A

Employee B

Employee C
```

Each employee follows the same structure but has different personal information.

Similarly, a JavaScript class acts as a blueprint for creating multiple objects with the same structure while allowing each object to have its own data.

Behind the scenes, all employees also follow a shared company handbook.

That handbook is similar to the **prototype**, where common behavior is stored and shared.

---

### 🎤 Interview Answer

A **Class** in JavaScript is a blueprint for creating objects and organizing related properties and methods. Classes were introduced in ES6 to provide a cleaner and more familiar syntax for object-oriented programming, especially for developers coming from languages like Java and C#. However, classes do **not** introduce a new inheritance model. They are simply **syntactic sugar** over JavaScript's existing prototype-based inheritance. Internally, a class is converted into a constructor function, and its methods are stored on the constructor's prototype, allowing all instances to share the same methods efficiently.

---

### ❓ Follow-up Questions

1. Why were Classes introduced in ES6?
2. Are JavaScript Classes a new inheritance model?
3. Why are Classes called syntactic sugar?
4. How are Classes related to Prototypes?
5. What are the advantages of Classes over Constructor Functions?
6. How are JavaScript Classes different from Java Classes?

---

## 2. Creating Classes and Instantiation

### 📖 Overview

A class by itself is only a **blueprint**.

To use it, we must create an **instance** of the class.

JavaScript does this using the **`new`** keyword.

During instantiation, JavaScript:

- Creates a new object.
- Links it to the class's prototype.
- Executes the `constructor()`.
- Initializes instance properties.
- Returns the newly created object.

Understanding this lifecycle explains how classes actually work internally.

---

### ⚙️ Main Explanation

#### How Do You Create a Class?

A class is created using the `class` keyword.

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

This class defines:

- A **constructor** for initialization.
- A **greet()** instance method.

---

#### What is the `constructor()` Method?

The `constructor()` is a special method that runs automatically whenever a new instance is created.

Example:

```js
class User {
  constructor(name) {
    this.name = name;
  }
}
```

Now:

```js
const user =
  new User("Vaibhav");
```

automatically executes:

```js
constructor("Vaibhav");
```

Its primary purpose is to initialize the object's state.

---

#### Is the `constructor()` Mandatory?

**No.**

If you don't define one:

```js
class User {}
```

JavaScript automatically creates an empty constructor.

Conceptually:

```js
class User {
  constructor() {}
}
```

Both behave the same way.

---

#### Can a Class Have Multiple Constructors?

**No.**

JavaScript allows only **one** `constructor()` per class.

The following is invalid.

```js
class User {
  constructor() {}

  constructor(name) {}
}
```

This results in a syntax error.

If multiple initialization behaviors are needed, use:

- Default parameters.
- Optional parameters.
- Factory methods.
- Static helper methods.

---

#### What is an Instance of a Class?

When you create an object using:

```js
const user =
  new User("Vaibhav");
```

the resulting object is called an **instance** of the class.

Conceptually:

```text
Class

↓

Instance
```

Every instance has:

- Its own properties.
- Access to shared methods through the prototype.

---

#### What Does the `new` Keyword Do?

The `new` keyword performs several steps automatically.

Suppose:

```js
const user =
  new User("Vaibhav");
```

Internally, JavaScript performs something conceptually similar to the following.

---

##### Step 1 — Create a New Empty Object

```text
{}
```

---

##### Step 2 — Link the Object to the Class Prototype

```text
New Object

↓

User.prototype
```

This allows the instance to inherit shared methods.

---

##### Step 3 — Set `this`

Inside the constructor:

```js
this
```

now refers to the newly created object.

Example:

```js
constructor(name) {
  this.name = name;
}
```

becomes conceptually similar to:

```js
newObject.name = name;
```

---

##### Step 4 — Execute the Constructor

The constructor initializes the object's properties.

```text
name

↓

"Vaibhav"
```

---

##### Step 5 — Return the Object

Unless the constructor explicitly returns another object, JavaScript automatically returns the newly created instance.

---

#### Complete Instantiation Flow

Whenever you write:

```js
new User("Vaibhav");
```

JavaScript performs:

```text
Create Object

↓

Link Prototype

↓

Set `this`

↓

Run Constructor

↓

Return Instance
```

This is exactly the same process used by constructor functions.

---

#### Why is `new` Required?

Calling a class without `new` is not allowed.

Example:

```js
User();
```

Output:

```text
TypeError:
Class constructor User
cannot be invoked
without 'new'
```

Unlike constructor functions, classes **must** be instantiated using `new`.

---

#### Best Practices

When creating classes:

- Use one constructor per class.
- Initialize instance-specific properties inside the constructor.
- Keep constructors focused on initialization only.
- Place shared behavior in instance methods rather than inside the constructor.
- Always create class instances using the `new` keyword.

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

const user =
  new User("Vaibhav");

console.log(user.name);

user.greet();
```

Output:

```text
Vaibhav

Hello, Vaibhav
```

The constructor initializes the `name` property, and the instance can access the shared `greet()` method.

---

### 📊 Diagram / Flow

#### Class Instantiation

```text
Class

↓

new

↓

Instance
```

---

#### Internal `new` Process

```text
Create Object

↓

Link Prototype

↓

Set `this`

↓

Run Constructor

↓

Return Object
```

---

#### Class Relationship

```text
User

↓

User.prototype

↓

Instance

↓

Object.prototype
```

---

#### Constructor

```text
new User()

↓

constructor()

↓

Initialize Properties
```

---

### 🌍 Real-World Example

Imagine a company hiring a new employee.

The company follows the same onboarding process for every new hire.

```text
New Employee

↓

Create Employee Record

↓

Assign Department

↓

Store Personal Details

↓

Ready to Work
```

The onboarding process is similar to the `constructor()`.

Every employee (instance) follows the same initialization process but receives different personal information.

The **employee template** is the class, while each hired employee is an **instance** created from that template.

---

### 🎤 Interview Answer

A JavaScript class is created using the `class` keyword, and new objects are created from it using the **`new`** keyword. The special `constructor()` method runs automatically whenever an instance is created and is used to initialize instance properties. The constructor is optional—if it isn't defined, JavaScript provides an empty one automatically—but a class can have only **one** constructor. Internally, the `new` keyword creates a new object, links it to the class's prototype, sets `this` to the new object, executes the constructor, and returns the initialized instance. Unlike constructor functions, classes cannot be called without `new`.

---

### ❓ Follow-up Questions

1. What is the purpose of the `constructor()` method?
2. Is the `constructor()` method mandatory?
3. Can a JavaScript class have multiple constructors?
4. What happens internally when `new` is used with a class?
5. What is an instance of a class?
6. Why can't a class be called without the `new` keyword?

---

## 3. Instance Members, Static Members, and Private Members

### 📖 Overview

A JavaScript class can contain different types of members, each serving a different purpose.

The most common categories are:

- **Instance Properties**
- **Instance Methods**
- **Static Properties**
- **Static Methods**
- **Private Fields (`#`)**
- **Private Methods**

Understanding the difference between these members is important because they determine:

- What belongs to an individual object.
- What belongs to the class itself.
- What data should be hidden from outside code.

---

### ⚙️ Main Explanation

#### Instance Properties

Instance properties belong to **individual objects**.

They are usually created inside the constructor.

Example:

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

const user1 =
  new User("Vaibhav");

const user2 =
  new User("Aman");
```

Memory:

```text
user1

↓

name = "Vaibhav"

-------------------

user2

↓

name = "Aman"
```

Each instance has its own copy of the property.

---

#### Instance Methods

Instance methods define behavior that every instance can perform.

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

Although every object can call `greet()`, the method exists only **once** on:

```text
User.prototype
```

All instances share it.

---

#### Static Methods

A **static method** belongs to the class itself rather than individual instances.

Example:

```js
class MathUtils {
  static add(a, b) {
    return a + b;
  }
}

console.log(
  MathUtils.add(2, 3)
);
```

Output:

```text
5
```

Calling:

```js
const math =
  new MathUtils();

math.add();
```

produces:

```text
TypeError
```

because static methods are not available on instances.

---

#### When Should You Use Static Methods?

Use static methods when functionality:

- Doesn't depend on instance data.
- Acts as a utility.
- Creates or validates objects.
- Performs calculations.

Common examples include:

- `Math.max()`
- `Array.isArray()`
- Factory methods
- Validation helpers

---

#### Can Static Methods Access Instance Properties?

**No.**

Example:

```js
class User {
  constructor(name) {
    this.name = name;
  }

  static print() {
    console.log(
      this.name
    );
  }
}
```

Here:

```text
this

↓

User Class
```

not an individual instance.

Therefore, static methods cannot directly access instance properties.

---

#### Can Instance Methods Access Static Methods?

Yes, but not directly through `this`.

Example:

```js
class User {
  static info() {
    return "User";
  }

  print() {
    console.log(
      User.info()
    );
  }
}
```

The instance method calls the static method through the class name.

---

#### Static Properties vs Instance Properties

Instance property:

```js
class User {
  constructor(name) {
    this.name = name;
  }
}
```

Every object gets its own value.

Static property:

```js
class User {
  static company =
    "OpenAI";
}
```

The property belongs to the class itself.

Access:

```js
User.company;
```

not:

```js
user.company;
```

---

#### Private Fields (`#`)

Private fields were introduced in ES2022.

Example:

```js
class BankAccount {
  #balance = 0;

  deposit(amount) {
    this.#balance += amount;
  }
}
```

Outside the class:

```js
account.#balance;
```

produces:

```text
SyntaxError
```

Private fields cannot be accessed directly outside the class.

---

#### Why Are Private Fields Useful?

Private fields provide **encapsulation**.

They protect internal state from accidental modification.

Example:

```text
Public

↓

Accessible

-------------------

Private

↓

Only Inside Class
```

This makes large applications safer and easier to maintain.

---

#### Private Methods

Classes can also define private methods.

Example:

```js
class User {
  #validate() {
    return true;
  }

  save() {
    if (this.#validate()) {
      console.log("Saved");
    }
  }
}
```

The private method can only be called from within the class.

---

#### Public Fields vs Private Fields

| Public | Private (`#`) |
|---------|---------------|
| Accessible everywhere | Accessible only inside the class |
| No prefix | Uses `#` |
| Can be modified externally | Protected from outside access |

Private fields enforce encapsulation at the language level.

---

#### Memory Usage

Each instance stores:

- Instance properties.
- Private fields.

Shared by all instances:

- Instance methods (via the prototype).
- Static methods (on the class itself).

Memory:

```text
Class

↓

Static Members

-------------------

Prototype

↓

Shared Methods

-------------------

Instance

↓

Own Properties
```

This design keeps memory usage efficient.

---

#### Best Practices

When designing classes:

- Store object-specific data in instance properties.
- Use instance methods for object behavior.
- Use static methods for utility functions or factory methods.
- Use private fields to protect sensitive internal state.
- Avoid storing unnecessary data in static properties unless it truly belongs to the class.

---

### 💻 Example

We'll continue using our running example.

```js
class User {
  static company =
    "OpenAI";

  #id = 101;

  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(
      `Hello, ${this.name}`
    );
  }

  static info() {
    return User.company;
  }
}

const user =
  new User("Vaibhav");

user.greet();

console.log(
  User.info()
);
```

Output:

```text
Hello, Vaibhav

OpenAI
```

The instance can use `greet()`, while the static method is called through the class.

---

### 📊 Diagram / Flow

#### Class Structure

```text
Class

│

├── Static Members

├── Prototype

│     ↓

│ Instance Methods

│

└── Instances

      ↓

Properties
```

---

#### Static vs Instance

```text
Class

↓

Static Members

-------------------

Object

↓

Instance Members
```

---

#### Private Fields

```text
Class

↓

#field

↓

Accessible Only Inside
```

---

#### Memory Layout

```text
Class

↓

Static

↓

Prototype

↓

Instances
```

---

### 🌍 Real-World Example

Imagine a bank.

Each customer has their own account information.

```text
Customer

↓

Account Balance

↓

Account Number
```

These are like **instance properties** because every customer has different values.

The bank also has general services, such as calculating loan interest.

```text
Bank

↓

Interest Calculator
```

This service doesn't belong to any one customer, so it's similar to a **static method**.

Finally, each customer's PIN is confidential.

```text
Customer

↓

PIN

↓

Private
```

Only the bank's internal system can access it.

This is similar to a **private field**, which cannot be accessed from outside the class.

---

### 🎤 Interview Answer

JavaScript classes support different types of members. **Instance properties** store data unique to each object, while **instance methods** define behavior shared through the class's prototype. **Static properties** and **static methods** belong to the class itself and are accessed using the class name rather than an instance. Static methods are typically used for utility functions, factory methods, or validation logic because they don't depend on instance data. **Private fields (`#`)** and **private methods** provide encapsulation by restricting access to the class itself, helping protect internal state and making applications more maintainable. This design keeps memory usage efficient because methods are shared while each instance stores only its own data.

---

### ❓ Follow-up Questions

1. What is the difference between instance properties and static properties?
2. What is the difference between instance methods and static methods?
3. Can static methods access instance properties?
4. Can instance methods call static methods?
5. What are private fields (`#`)?
6. Why are private fields useful in large applications?

---

## 4. Class Inheritance

### 📖 Overview

Inheritance allows one class to reuse the properties and methods of another class.

Instead of rewriting common functionality, a child class can inherit it from a parent class and extend or customize its behavior.

JavaScript provides two keywords for class inheritance:

- **`extends`**
- **`super`**

Although the syntax is modern, inheritance is still implemented internally using the **prototype chain**.

---

### ⚙️ Main Explanation

#### Can a Class Extend Another Class?

Yes.

A class can inherit from another class using the **`extends`** keyword.

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

`Dog` automatically inherits the `eat()` method from `Animal`.

---

#### What Does `extends` Do?

The `extends` keyword creates an inheritance relationship between two classes.

Conceptually:

```text
Dog

↓

extends

↓

Animal
```

Internally, JavaScript links:

```text
Dog.prototype

↓

Animal.prototype
```

This enables the child class to access the parent's methods through the prototype chain.

---

#### What is `super()`?

`super()` calls the constructor of the parent class.

Example:

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);
  }
}
```

When:

```js
new Dog("Tommy");
```

is executed:

```text
Dog Constructor

↓

super()

↓

Animal Constructor
```

The parent constructor initializes the inherited properties.

---

#### Why Must `super()` Be Called Before `this`?

In a derived class, JavaScript doesn't initialize `this` until the parent constructor has run.

Incorrect:

```js
class Dog extends Animal {
  constructor(name) {
    this.name = name;

    super(name);
  }
}
```

Output:

```text
ReferenceError:
Must call super
constructor before
using 'this'
```

Correct:

```js
class Dog extends Animal {
  constructor(name) {
    super(name);

    this.type = "Dog";
  }
}
```

`super()` creates and initializes the parent portion of the object, making `this` available for use in the child constructor.

---

#### What Happens When `super()` Is Called?

Conceptually:

```text
Child Constructor

↓

Call Parent Constructor

↓

Initialize Parent Properties

↓

Return to Child

↓

Initialize Child Properties
```

This ensures the complete object is properly initialized.

---

#### Method Overriding

A child class can define a method with the same name as its parent.

Example:

```js
class Animal {
  speak() {
    console.log("Animal");
  }
}

class Dog extends Animal {
  speak() {
    console.log("Dog");
  }
}

const dog =
  new Dog();

dog.speak();
```

Output:

```text
Dog
```

The child's version overrides the parent's version.

---

#### Calling the Parent Method

Even after overriding a method, the child can still invoke the parent's implementation.

Example:

```js
class Animal {
  speak() {
    console.log("Animal");
  }
}

class Dog extends Animal {
  speak() {
    super.speak();

    console.log("Dog");
  }
}
```

Output:

```text
Animal

Dog
```

Here, `super.speak()` calls the method defined in the parent class.

---

#### Can Static Methods Be Inherited?

Yes.

Static methods are inherited by child classes.

Example:

```js
class Animal {
  static info() {
    return "Animal";
  }
}

class Dog extends Animal {}

console.log(
  Dog.info()
);
```

Output:

```text
Animal
```

The child class inherits the parent's static method.

---

#### `super()` vs `this`

| `super()` | `this` |
|------------|---------|
| Refers to the parent class | Refers to the current instance |
| Calls parent constructor or methods | Accesses current object's properties and methods |
| Used in derived classes | Used throughout instance methods and constructors |

Remember:

- `super()` → Parent.
- `this` → Current object.

---

#### Method Overriding vs Method Overloading

**Method Overriding**

A child class replaces a method inherited from the parent.

```js
class Dog extends Animal {
  speak() {}
}
```

Supported in JavaScript.

---

**Method Overloading**

Having multiple methods with the same name but different parameter lists.

Example (not supported):

```js
class User {
  login() {}

  login(name) {}
}
```

JavaScript keeps only the last definition.

Instead, developers typically use:

- Default parameters.
- Optional parameters.
- Rest parameters.

---

#### How Does Inheritance Work Internally?

Although the syntax uses `extends`, JavaScript internally links prototypes.

```text
Dog.prototype

↓

Animal.prototype

↓

Object.prototype

↓

null
```

Property lookup still follows the prototype chain exactly as it does with constructor functions.

---

#### Best Practices

When using inheritance:

- Use `extends` to reuse common behavior.
- Always call `super()` before accessing `this` in derived constructors.
- Override methods only when behavior genuinely differs.
- Keep inheritance hierarchies simple and shallow.
- Prefer composition over deep inheritance hierarchies when appropriate (covered later in this chapter).

---

### 💻 Example

We'll continue using our running example.

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(
      `${this.name} makes a sound`
    );
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);
  }

  speak() {
    console.log(
      `${this.name} barks`
    );
  }
}

const dog =
  new Dog("Tommy");

dog.speak();
```

Output:

```text
Tommy barks
```

The `Dog` class inherits from `Animal` and overrides the `speak()` method.

---

### 📊 Diagram / Flow

#### Class Inheritance

```text
Dog

↓

extends

↓

Animal
```

---

#### Internal Prototype Chain

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

#### `super()` Flow

```text
Child Constructor

↓

super()

↓

Parent Constructor

↓

Initialize Parent

↓

Return
```

---

#### Method Overriding

```text
Child Method Exists?

│

├── Yes

│     ↓

│ Use Child Method

│

└── No

      ↓

Use Parent Method
```

---

### 🌍 Real-World Example

Imagine a company.

Every employee follows general company rules.

```text
Company

↓

Employee Rules
```

Now consider the Sales department.

Sales employees follow all company rules but also have department-specific policies.

```text
Sales

↓

Sales Rules

↓

Company Rules
```

If a Sales rule exists, employees follow it first.

Otherwise, they follow the company rule.

This is exactly how class inheritance works.

The child class first uses its own methods. If a method doesn't exist, JavaScript follows the prototype chain to the parent class.

---

### 🎤 Interview Answer

JavaScript classes support inheritance through the **`extends`** keyword, allowing a child class to inherit properties and methods from a parent class. The **`super()`** function calls the parent constructor and must be invoked before using `this` inside a derived class constructor because the parent portion of the object must be initialized first. Child classes can override inherited methods by defining methods with the same name, and they can still access the parent implementation using `super.methodName()`. Static methods are also inherited by child classes. Internally, class inheritance is implemented by linking prototypes, making ES6 inheritance a cleaner syntax over JavaScript's existing prototype-based inheritance.

---

### ❓ Follow-up Questions

1. What does the `extends` keyword do?
2. What is the purpose of `super()`?
3. Why must `super()` be called before `this`?
4. What is method overriding in classes?
5. Can static methods be inherited?
6. How does class inheritance work internally?

---

## 5. How Classes Work Internally

### 📖 Overview

One of the most common advanced JavaScript interview questions is:

> **"Are ES6 Classes really classes?"**

The answer is:

**No.**

Although the syntax looks similar to Java or C#, JavaScript **does not have a new class-based inheritance engine**.

Instead, the JavaScript engine converts classes into the same **constructor functions and prototype relationships** that existed before ES6.

This is why classes are called **syntactic sugar** over prototypes.

Understanding this internal implementation helps explain how inheritance, method sharing, and object creation actually work.

---

### ⚙️ Main Explanation

#### Are Classes Really Classes?

Consider this ES6 class.

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

This looks like a completely new language feature.

However, internally JavaScript creates something conceptually similar to:

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

Both versions create the same prototype relationship.

---

#### How Does the JavaScript Engine Implement Classes?

When JavaScript encounters:

```js
class User {}
```

it conceptually performs the following steps.

##### Step 1 — Create a Constructor Function

```text
Class

↓

Constructor Function
```

Every class internally becomes a constructor function.

---

##### Step 2 — Create a Prototype Object

```text
Constructor

↓

prototype
```

A prototype object is created automatically.

---

##### Step 3 — Store Instance Methods on the Prototype

Example:

```js
greet() {}
```

is conceptually stored as:

```js
User.prototype.greet
```

Only one copy of the method exists.

---

##### Step 4 — Handle Static Members

Static methods are attached directly to the constructor.

Example:

```js
class User {
  static info() {}
}
```

Internally:

```text
User

↓

info()
```

instead of:

```text
User.prototype
```

---

##### Step 5 — Create Objects Using `new`

Whenever:

```js
new User()
```

is executed:

```text
Create Object

↓

Link Prototype

↓

Run Constructor

↓

Return Object
```

Exactly the same process used by constructor functions occurs.

---

#### Where Are Different Members Stored?

Consider:

```js
class User {
  static company =
    "OpenAI";

  constructor(name) {
    this.name = name;
  }

  greet() {}

  static info() {}
}
```

Conceptually:

```text
User

│

├── Static Members

│

└── prototype

      │

      └── greet()

Instance

↓

name
```

Different members are stored in different places.

---

#### How Does Class Inheritance Work?

Suppose:

```js
class Animal {}

class Dog extends Animal {}
```

Internally, JavaScript links:

```text
Dog.prototype

↓

Animal.prototype

↓

Object.prototype
```

This is exactly the same prototype chain used before ES6.

The `extends` keyword simply creates these prototype links automatically.

---

#### Why Are Classes Called Syntactic Sugar?

The phrase **syntactic sugar** means:

> A feature that provides cleaner syntax without changing the underlying behavior.

Compare.

Constructor Function:

```js
function User() {}
```

Class:

```js
class User {}
```

Different syntax.

Same prototype system.

Same inheritance model.

Same object creation process.

---

#### Memory Usage

Suppose we create 10,000 users.

```js
new User();

new User();

new User();
```

JavaScript stores:

```text
Instance 1

↓

name

-------------------

Instance 2

↓

name

-------------------

Prototype

↓

greet()
```

The shared method exists only once.

This is why classes remain memory efficient.

---

#### Why Did ES6 Introduce Classes?

Classes were introduced to:

- Improve readability.
- Provide familiar syntax for developers from object-oriented languages.
- Reduce boilerplate.
- Make inheritance easier to write.

They were **not** introduced to replace prototypes.

---

#### Best Practices

When working with classes:

- Remember that every class is built on prototypes.
- Think of `class` as syntax, not a separate inheritance model.
- Store shared behavior as class methods.
- Understand the prototype chain to debug inheritance issues.

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

const user =
  new User("Vaibhav");

console.log(
  Object.getPrototypeOf(user) ===
    User.prototype
);
```

Output:

```text
true
```

This confirms that even objects created from classes are linked to the class's prototype.

---

### 📊 Diagram / Flow

#### Class Compilation (Conceptually)

```text
Class

↓

Constructor Function

↓

Prototype

↓

Objects
```

---

#### Member Storage

```text
Class

│

├── Static Members

│

└── Prototype

      ↓

Shared Methods

Instance

↓

Own Properties
```

---

#### Object Creation

```text
new

↓

Create Object

↓

Link Prototype

↓

Run Constructor

↓

Return Object
```

---

#### Inheritance

```text
Child.prototype

↓

Parent.prototype

↓

Object.prototype

↓

null
```

---

### 🌍 Real-World Example

Imagine a software company that introduces a new visual design tool.

Previously, developers wrote HTML and CSS manually.

Now they use a drag-and-drop editor.

```text
Visual Editor

↓

HTML & CSS
```

The editor makes development easier, but the browser still receives HTML and CSS.

Similarly, JavaScript classes make object-oriented code easier to write, but the JavaScript engine still works with constructor functions and prototypes internally.

The syntax changes, but the underlying mechanism remains the same.

---

### 🎤 Interview Answer

ES6 classes are **syntactic sugar** over JavaScript's existing prototype system. When a class is declared, the JavaScript engine internally creates a constructor function, generates a prototype object, stores instance methods on the prototype, and attaches static members directly to the constructor. Creating an instance with the `new` keyword follows the same process used by constructor functions: a new object is created, linked to the prototype, initialized by the constructor, and returned. Similarly, the `extends` keyword implements inheritance by linking one prototype to another. Therefore, classes improve readability and developer experience without introducing a new inheritance model.

---

### ❓ Follow-up Questions

1. How are JavaScript classes implemented internally?
2. Why are classes called syntactic sugar?
3. How does the JavaScript engine convert a class into prototype-based code?
4. Where are instance methods stored?
5. Where are static methods stored?
6. How does the `extends` keyword work internally?

---

## 6. Encapsulation and Object-Oriented Design

### 📖 Overview

One of the main goals of Object-Oriented Programming (OOP) is **Encapsulation**.

Encapsulation means **keeping an object's internal data and implementation details hidden while exposing only what is necessary**.

Before ES2022, JavaScript developers simulated encapsulation using:

- Closures
- Naming conventions (e.g., `_balance`)
- Symbols
- WeakMaps

With ES2022, JavaScript introduced **Private Fields (`#`)** and **Private Methods**, making encapsulation a built-in language feature.

Encapsulation helps create safer, more maintainable, and more predictable applications.

---

### ⚙️ Main Explanation

#### What is Encapsulation?

Encapsulation is the practice of combining data and the methods that operate on that data inside a class while restricting direct access to the internal implementation.

Example:

```js
class BankAccount {
  #balance = 0;

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}
```

Here:

- `#balance` is hidden.
- Outside code must use the provided methods to interact with it.

---

#### Why is Encapsulation Important?

Without encapsulation:

```js
account.balance =
  -1000000;
```

Anyone can modify important data, potentially leaving the object in an invalid state.

With encapsulation:

```text
Outside Code

↓

Public Methods

↓

Private Data
```

The class controls how its internal state changes.

This helps enforce rules and validation.

---

#### How Do Private Fields (`#`) Work?

Private fields are declared using the `#` prefix.

Example:

```js
class User {
  #password =
    "123456";

  checkPassword(
    value
  ) {
    return (
      this.#password ===
      value
    );
  }
}
```

Trying to access:

```js
user.#password;
```

results in:

```text
SyntaxError
```

Private fields are only accessible inside the class that declares them.

---

#### Can Private Fields Be Accessed Outside the Class?

No.

Example:

```js
class User {
  #id = 101;
}

const user =
  new User();

console.log(user.#id);
```

Output:

```text
SyntaxError
```

Unlike public properties, private fields are enforced by the language itself.

---

#### How Do Private Fields Work Internally?

Conceptually:

```text
Object

│

├── Public Properties

│

└── Hidden Private Storage
```

The JavaScript engine stores private fields in an internal slot associated with each instance.

They are **not** normal object properties and therefore:

- Cannot be accessed using dot notation.
- Cannot be accessed using bracket notation.
- Do not appear in `Object.keys()`.
- Are not inherited as normal properties.

---

#### Private Methods

Classes can also define private methods.

Example:

```js
class User {
  #validate() {
    return true;
  }

  save() {
    if (
      this.#validate()
    ) {
      console.log("Saved");
    }
  }
}
```

The private method is only callable from within the class.

---

#### Public Fields vs Private Fields

| Public Fields | Private Fields (`#`) |
|---------------|----------------------|
| Accessible everywhere | Accessible only inside the class |
| Can be modified externally | Cannot be accessed externally |
| Part of the object's public API | Internal implementation detail |

Private fields help separate the **public API** from the class's internal state.

---

#### Advantages of Encapsulation

Encapsulation provides several benefits.

- Protects internal state.
- Prevents accidental modification.
- Enforces validation rules.
- Simplifies maintenance.
- Hides implementation details.
- Makes APIs easier to use correctly.

These advantages become increasingly important as applications grow.

---

#### Disadvantages of Classes

Although classes are useful, they also have some limitations.

- Deep inheritance hierarchies can become difficult to maintain.
- Beginners may overuse inheritance instead of composition.
- Some problems are simpler to solve with factory functions or plain objects.
- Excessive abstraction can make code harder to understand.

Choosing the right design pattern is often more important than using classes everywhere.

---

#### Common Mistakes

Developers often make the following mistakes.

##### Exposing Internal State

```js
this.balance
```

instead of:

```js
#balance
```

when the value should be protected.

---

##### Putting Too Much Logic in Constructors

Constructors should primarily initialize the object.

Complex business logic belongs in methods.

---

##### Using Classes for Everything

Not every object needs a class.

Sometimes:

- Object literals
- Factory functions
- Simple modules

are more appropriate.

---

##### Creating Deep Inheritance Trees

Example:

```text
Vehicle

↓

Car

↓

SportsCar

↓

ElectricSportsCar

↓

LuxuryElectricSportsCar
```

Deep hierarchies quickly become difficult to maintain.

---

#### Best Practices

When designing classes:

- Keep private data truly private using `#`.
- Expose only the methods users need.
- Keep constructors focused on initialization.
- Prefer simple, well-defined responsibilities.
- Avoid unnecessary inheritance.
- Design clear public APIs.

---

### 💻 Example

We'll continue using our running example.

```js
class BankAccount {
  #balance = 0;

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account =
  new BankAccount();

account.deposit(500);

console.log(
  account.getBalance()
);
```

Output:

```text
500
```

The balance is modified only through the class's public methods.

---

### 📊 Diagram / Flow

#### Encapsulation

```text
Outside Code

↓

Public Methods

↓

Private Data
```

---

#### Class Structure

```text
Class

│

├── Public API

│

└── Private Members
```

---

#### Private Field

```text
Object

↓

#field

↓

Accessible Only Inside Class
```

---

#### Protected State

```text
Direct Access?

│

├── Public

│     ↓

│ Allowed

│

└── Private

      ↓

Blocked
```

---

### 🌍 Real-World Example

Imagine a bank vault.

Customers can:

- Deposit money.
- Withdraw money.
- Check their balance.

```text
Customer

↓

Bank Counter

↓

Vault
```

Customers never access the vault directly.

Instead, they interact with the bank through controlled operations.

The vault represents **private fields**, while the bank counter represents the class's **public methods**.

This protects valuable information and ensures every transaction follows the bank's rules.

Encapsulation in JavaScript works the same way.

---

### 🎤 Interview Answer

Encapsulation is an object-oriented programming principle that hides an object's internal state while exposing only the operations needed to interact with it. JavaScript supports encapsulation through **Private Fields (`#`)** and **Private Methods**, which can only be accessed from within the class that declares them. Unlike public properties, private fields are enforced by the language and cannot be accessed using dot notation, bracket notation, or object enumeration. Encapsulation improves security, maintainability, and reliability by preventing accidental modification of internal data and ensuring that state changes occur only through controlled methods.

---

### ❓ Follow-up Questions

1. What is encapsulation?
2. Why are Private Fields (`#`) useful?
3. Can private fields be accessed outside the class?
4. How do private fields work internally?
5. What are common mistakes developers make while using classes?
6. What are the advantages of encapsulation in large applications?

---

## 7. Inheritance vs Composition

### 📖 Overview

When designing applications, one of the biggest architectural decisions is:

> **Should I use inheritance or composition?**

Many beginners overuse inheritance because it feels natural when learning object-oriented programming.

However, in modern JavaScript—and especially in React, Node.js, and large-scale applications—**composition is often preferred over inheritance** because it provides greater flexibility and reduces tight coupling.

Understanding when to use each approach is an important interview topic and a key software design skill.

---

### ⚙️ Main Explanation

#### What is Inheritance?

Inheritance allows one class to reuse the properties and methods of another class.

Example:

```js
class Animal {
  eat() {
    console.log("Eating...");
  }
}

class Dog extends Animal {
  bark() {
    console.log("Bark");
  }
}
```

Relationship:

```text
Dog

↓

Animal
```

The child class automatically inherits the parent's behavior.

---

#### What is Composition?

Composition builds complex objects by **combining smaller, independent objects** instead of inheriting from them.

Example:

```js
class Engine {
  start() {
    console.log("Engine started");
  }
}

class Car {
  constructor() {
    this.engine =
      new Engine();
  }

  start() {
    this.engine.start();
  }
}
```

Relationship:

```text
Car

↓

Has an

↓

Engine
```

Instead of saying:

> **Car is an Engine**

Composition says:

> **Car has an Engine**

---

#### Inheritance vs Composition

Inheritance represents an **"is-a"** relationship.

Example:

```text
Dog

↓

is an

↓

Animal
```

Composition represents a **"has-a"** relationship.

Example:

```text
Car

↓

has an

↓

Engine
```

This simple distinction helps determine which design is more appropriate.

---

#### Advantages of Inheritance

Inheritance offers several benefits.

- Reuses common behavior.
- Reduces duplicate code.
- Represents natural hierarchical relationships.
- Easy to understand for simple object models.

Example:

```text
Employee

↓

Manager
```

A manager is an employee, making inheritance a good fit.

---

#### Disadvantages of Inheritance

Inheritance also introduces challenges.

- Tight coupling between parent and child.
- Changes in the parent can affect all child classes.
- Deep hierarchies become difficult to maintain.
- Can lead to rigid designs.

Example:

```text
Vehicle

↓

Car

↓

SportsCar

↓

ElectricSportsCar

↓

LuxuryElectricSportsCar
```

As the hierarchy grows, maintenance becomes increasingly difficult.

---

#### Advantages of Composition

Composition provides greater flexibility.

- Loosely coupled components.
- Easier to replace individual parts.
- Encourages reusable modules.
- Simpler testing.
- Easier maintenance.

Instead of inheriting behavior, objects collaborate with one another.

---

#### When Should You Prefer Composition?

Composition is usually preferred when:

- Objects share functionality but don't have a true **"is-a"** relationship.
- Features may change independently.
- Behavior should be reusable across unrelated classes.
- Large applications require flexible architecture.

Modern frameworks often favor composition.

---

#### Real-World Example

Suppose we're designing an application for notifications.

Instead of:

```text
EmailNotification

↓

SMSNotification

↓

PushNotification
```

we can compose different services.

```text
NotificationService

│

├── EmailSender

├── SmsSender

└── PushSender
```

Each component has one responsibility and can be replaced independently.

---

#### Designing a Reusable Class Hierarchy

When inheritance is appropriate:

```text
Person

│

├── Employee

│     ├── Manager

│     └── Developer

└── Customer
```

The hierarchy represents genuine **"is-a"** relationships.

When relationships don't naturally fit this pattern, composition is usually a better choice.

---

#### When Should You Avoid Inheritance?

Avoid inheritance when:

- Classes are unrelated.
- The hierarchy becomes too deep.
- Behavior changes frequently.
- One class only needs a small part of another class's functionality.
- Composition provides a simpler solution.

---

#### Inheritance vs Composition

| Inheritance | Composition |
|--------------|-------------|
| "Is-a" relationship | "Has-a" relationship |
| Uses `extends` | Combines objects |
| Tightly coupled | Loosely coupled |
| Fixed hierarchy | Flexible design |
| Good for natural hierarchies | Good for reusable components |

Modern JavaScript applications often lean toward composition because it is easier to evolve over time.

---

#### Best Practices

When designing applications:

- Use inheritance only for true **"is-a"** relationships.
- Prefer composition for reusable behavior.
- Keep inheritance hierarchies shallow.
- Design small, focused classes.
- Favor loose coupling over tight coupling.

A common design guideline is:

> **Favor Composition over Inheritance.**

---

### 💻 Example

We'll continue using our running example.

```js
class Engine {
  start() {
    console.log(
      "Engine started"
    );
  }
}

class Car {
  constructor() {
    this.engine =
      new Engine();
  }

  start() {
    this.engine.start();
  }
}

const car =
  new Car();

car.start();
```

Output:

```text
Engine started
```

The `Car` class doesn't inherit from `Engine`; instead, it uses composition by containing an `Engine` object.

---

### 📊 Diagram / Flow

#### Inheritance

```text
Child

↓

extends

↓

Parent
```

---

#### Composition

```text
Object

↓

Contains

↓

Another Object
```

---

#### "Is-a"

```text
Dog

↓

Animal
```

---

#### "Has-a"

```text
Car

↓

Engine
```

---

### 🌍 Real-World Example

Imagine building a computer.

You don't inherit a computer from a keyboard.

Instead, you assemble it using independent components.

```text
Computer

│

├── CPU

├── RAM

├── SSD

└── Keyboard
```

If the keyboard breaks, you replace only the keyboard.

The rest of the computer remains unchanged.

This is the essence of **composition**.

Inheritance would be more like saying:

```text
Gaming Laptop

↓

Laptop

↓

Computer
```

which represents a natural **"is-a"** relationship.

Choosing the correct relationship leads to simpler and more maintainable software.

---

### 🎤 Interview Answer

Inheritance allows a class to reuse the properties and methods of another class through an **"is-a"** relationship using the `extends` keyword. Composition, on the other hand, builds complex objects by combining smaller objects through a **"has-a"** relationship. While inheritance is useful for representing natural hierarchies, it can create tight coupling and rigid designs if overused. Composition provides greater flexibility, encourages reusable components, simplifies testing, and is generally preferred in modern JavaScript applications. A common design principle is to **favor composition over inheritance** unless inheritance clearly models the domain.

---

### ❓ Follow-up Questions

1. What is the difference between inheritance and composition?
2. What is meant by an "is-a" relationship?
3. What is meant by a "has-a" relationship?
4. When should you prefer composition over inheritance?
5. Why can deep inheritance hierarchies become difficult to maintain?
6. How would you design a reusable class hierarchy for a large application?

---

## 8. Real-World Usage of Classes

### 📖 Overview

While JavaScript allows you to build applications without classes, they are widely used in modern development because they provide a structured way to organize code.

You'll frequently encounter classes in:

- TypeScript
- NestJS
- Angular
- Object-Oriented libraries
- Design Patterns
- Backend applications

However, not every problem should be solved using a class.

Understanding **when to use classes** and **when to use alternatives like factory functions or composition** is an important interview topic.

---

### ⚙️ Main Explanation

#### Why are Classes Commonly Used in TypeScript?

TypeScript is built around **Object-Oriented Programming (OOP)** concepts.

Classes work especially well because they support:

- Strong typing
- Access modifiers (`public`, `private`, `protected`)
- Interfaces
- Inheritance
- Dependency Injection

Example:

```ts
class UserService {
  getUsers() {
    return [];
  }
}
```

Classes make large TypeScript projects easier to organize and maintain.

---

#### Why Does NestJS Use Classes?

NestJS is heavily inspired by Angular and follows an object-oriented architecture.

Almost everything in NestJS is implemented as a class.

Example:

```ts
@Injectable()
class UserService {}
```

Controllers:

```ts
@Controller()
class UserController {}
```

Modules:

```ts
@Module({})
class UserModule {}
```

Using classes enables:

- Dependency Injection (DI)
- Reusability
- Better organization
- Scalable architecture

This is one of the main reasons classes are preferred in NestJS.

---

#### When Should You Choose a Class Over a Factory Function?

A **Class** is usually a better choice when:

- Objects share behavior.
- Inheritance is useful.
- Encapsulation is required.
- The object has a clear lifecycle.
- Multiple related methods operate on the same state.

Example:

```js
class BankAccount {}
```

A **Factory Function** is often better when:

- You don't need inheritance.
- Simplicity is preferred.
- You want flexible object creation.
- You're using composition.

Example:

```js
function createUser(name) {
  return {
    name,
  };
}
```

There is no universal winner—the choice depends on the application's needs.

---

#### Why Should Utility Methods Be Static?

Utility methods don't depend on instance-specific data.

Example:

```js
class MathUtils {
  static add(a, b) {
    return a + b;
  }
}
```

Usage:

```js
MathUtils.add(2, 3);
```

No object needs to be created.

Benefits:

- Saves memory.
- Makes intent clear.
- Groups related utility functions.
- Avoids unnecessary instances.

Many built-in JavaScript APIs follow this pattern.

Examples:

```js
Math.max();

Array.isArray();

Object.keys();
```

---

#### Real-World Use Cases of Static Methods

Common scenarios include:

- Validation helpers.
- Parsing utilities.
- Factory methods.
- Mathematical calculations.
- Configuration loaders.

Example:

```js
class User {
  static fromJSON(data) {
    return new User(
      data.name
    );
  }
}
```

This is called a **Factory Method**.

---

#### Implementing the Singleton Pattern

A Singleton ensures only **one instance** of a class exists.

Example:

```js
class Database {
  static instance;

  constructor() {
    if (
      Database.instance
    ) {
      return Database.instance;
    }

    Database.instance =
      this;
  }
}

const db1 =
  new Database();

const db2 =
  new Database();

console.log(
  db1 === db2
);
```

Output:

```text
true
```

Both variables reference the same object.

Singletons are commonly used for:

- Database connections.
- Logger services.
- Configuration managers.
- Caching systems.

---

#### Real-World Design Example

Consider an e-commerce application.

```text
UserService

OrderService

PaymentService

InventoryService
```

Each service is implemented as a class.

Each class:

- Owns its own responsibility.
- Encapsulates its own logic.
- Can be injected into other services.

This organization keeps large applications modular and maintainable.

---

#### When Should You Avoid Classes?

Avoid classes when:

- Objects are simple.
- No shared behavior exists.
- State is minimal.
- Functional programming fits better.
- A factory function is sufficient.

Example:

```js
function createPoint(
  x,
  y
) {
  return { x, y };
}
```

Using a class here adds unnecessary complexity.

---

#### Best Practices

When designing applications:

- Use classes for objects with behavior and lifecycle.
- Use static methods for utilities.
- Keep each class focused on a single responsibility.
- Prefer composition when inheritance becomes deep.
- Don't introduce classes unless they improve clarity.

---

### 💻 Example

We'll continue using our running example.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  static fromJSON(data) {
    return new User(
      data.name
    );
  }
}

const user =
  User.fromJSON({
    name: "Vaibhav",
  });

console.log(user);
```

Output:

```text
User {
  name: "Vaibhav"
}
```

The static factory method creates an instance without exposing construction logic.

---

### 📊 Diagram / Flow

#### NestJS

```text
Application

↓

Module

↓

Controller

↓

Service
```

---

#### Static Utility

```text
Class

↓

Static Method

↓

No Instance Needed
```

---

#### Factory Method

```text
JSON

↓

Static Method

↓

Object
```

---

#### Singleton

```text
First Call

↓

Create Instance

↓

Store

↓

Reuse Same Instance
```

---

### 🌍 Real-World Example

Imagine a hospital.

There are different departments.

```text
Hospital

│

├── Patient Service

├── Billing Service

├── Pharmacy Service

└── Appointment Service
```

Each department has its own responsibilities and operates independently.

Similarly, in frameworks like NestJS, each service is implemented as a separate class.

Some hospital functions, like calculating insurance percentages, don't belong to any specific patient.

These are similar to **static methods**, which belong to the class itself rather than individual instances.

---

### 🎤 Interview Answer

JavaScript classes are widely used in modern frameworks like **TypeScript** and **NestJS** because they provide a structured way to organize related data and behavior. NestJS relies heavily on classes for modules, controllers, services, and dependency injection. Classes are ideal when objects have a clear lifecycle, shared behavior, or require encapsulation. Static methods are commonly used for utility functions, validation, parsing, and factory methods because they don't depend on instance data. However, for simple objects or highly flexible designs, factory functions and composition are often better choices. Choosing the appropriate pattern leads to cleaner and more maintainable applications.

---

### ❓ Follow-up Questions

1. Why are classes commonly used in TypeScript?
2. Why does NestJS use classes extensively?
3. When should you choose a class over a factory function?
4. Why should utility methods be declared as static?
5. What are some real-world use cases of static methods?
6. How would you implement a Singleton pattern using a class?

---

## 9. Interview Perspective and Mental Model of Classes

### 📖 Overview

After learning about constructors, instance members, static members, inheritance, private fields, and prototypes, the most important thing is to connect all of these concepts into one **mental model**.

In interviews, you are rarely asked to write a complete class from memory.

Instead, interviewers usually want to know whether you understand:

- How classes work internally.
- When to use classes.
- When not to use classes.
- How classes relate to prototypes.
- Why modern JavaScript introduced them.

If you understand the complete lifecycle of a class, most class-related interview questions become easy to answer.

---

### ⚙️ Main Explanation

#### The Complete Mental Model

Whenever you see a JavaScript class:

```js
class User {}
```

Think of the following sequence.

```text
Class

↓

Constructor Function

↓

Prototype

↓

Objects
```

This is the single most important idea in this chapter.

A class is simply a **clean syntax** over JavaScript's prototype system.

---

#### The Lifecycle of a Class

Whenever a class is used, JavaScript conceptually performs these steps.

```text
Define Class

↓

Create Constructor

↓

Create Prototype

↓

Store Instance Methods

↓

Store Static Members

↓

Wait for new
```

Nothing is created until an object is instantiated.

---

#### The Lifecycle of an Object

When JavaScript executes:

```js
new User("Vaibhav");
```

it performs:

```text
Create Object

↓

Link Prototype

↓

Set `this`

↓

Run Constructor

↓

Return Instance
```

Every object created from the class follows the same process.

---

#### Where Everything Lives

One of the easiest ways to remember classes is to know where different members are stored.

```text
Class

│

├── Static Properties

├── Static Methods

│

└── Prototype

      │

      └── Instance Methods

Instance

↓

Instance Properties

↓

Private Fields
```

Knowing this diagram helps answer many interview questions.

---

#### How Inheritance Works

When using:

```js
class Dog extends Animal {}
```

JavaScript creates the following relationship.

```text
Dog.prototype

↓

Animal.prototype

↓

Object.prototype

↓

null
```

Property lookup still follows the prototype chain.

Nothing about the inheritance engine changes.

---

#### The Golden Rules

When thinking about JavaScript classes, remember these rules.

##### Rule 1

Classes are **syntactic sugar**.

---

##### Rule 2

Objects inherit through **prototypes**, not classes.

---

##### Rule 3

Instance methods are shared through the prototype.

---

##### Rule 4

Static members belong to the class itself.

---

##### Rule 5

Private fields provide encapsulation.

---

##### Rule 6

Use inheritance only for genuine **"is-a"** relationships.

---

##### Rule 7

Prefer composition when behavior should be reused without creating deep inheritance hierarchies.

---

#### Explaining Classes to a Java or C# Developer

A Java developer usually thinks:

```text
Class

↓

Object
```

In JavaScript, the mental model is different.

```text
Class

↓

Constructor Function

↓

Prototype

↓

Object
```

Although the syntax looks similar, JavaScript's inheritance is still prototype-based.

This distinction is a favorite interview topic.

---

#### Common Interview Mistakes

Candidates often make these mistakes.

- Saying classes replaced prototypes.
- Believing JavaScript has true class-based inheritance.
- Forgetting that instance methods live on the prototype.
- Calling static methods from instances.
- Using inheritance where composition is a better fit.
- Thinking private fields are normal object properties.

Avoiding these misconceptions demonstrates a deeper understanding of JavaScript.

---

#### Interview Tips

If you're asked:

> **"Explain JavaScript Classes."**

A strong answer should include these points:

- A class is a blueprint for creating objects.
- Classes were introduced in ES6 for cleaner syntax.
- They are syntactic sugar over constructor functions and prototypes.
- Instance methods are stored on the prototype.
- Static methods belong to the class.
- Private fields support encapsulation.
- Inheritance is implemented through the prototype chain.
- Classes improve readability but do not introduce a new inheritance model.

Covering these points usually answers most follow-up questions as well.

---

### 💻 Example

We'll conclude the chapter with a complete example.

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(
      `${this.name} makes a sound`
    );
  }

  static kingdom() {
    return "Animalia";
  }
}

class Dog extends Animal {
  #breed;

  constructor(
    name,
    breed
  ) {
    super(name);
    this.#breed = breed;
  }

  speak() {
    console.log(
      `${this.name} barks`
    );
  }
}

const dog =
  new Dog(
    "Tommy",
    "Labrador"
  );

dog.speak();

console.log(
  Animal.kingdom()
);
```

Output:

```text
Tommy barks

Animalia
```

This example demonstrates:

- Class declaration.
- Constructor.
- Inheritance.
- `extends`.
- `super`.
- Method overriding.
- Static methods.
- Private fields.

---

### 📊 Diagram / Flow

#### Complete Class Lifecycle

```text
Class

↓

Constructor

↓

Prototype

↓

new

↓

Object
```

---

#### Member Storage

```text
Class

│

├── Static Members

│

└── Prototype

      ↓

Instance Methods

Instance

↓

Properties

↓

Private Fields
```

---

#### Inheritance

```text
Child.prototype

↓

Parent.prototype

↓

Object.prototype

↓

null
```

---

#### Object Creation

```text
new

↓

Create Object

↓

Link Prototype

↓

Run Constructor

↓

Return Object
```

---

### 🌍 Real-World Example

Imagine a car manufacturing company.

The company has a **vehicle blueprint**.

```text
Vehicle Blueprint

↓

Sedan

SUV

Truck
```

Every vehicle is built using the same manufacturing process.

Each vehicle receives:

- Its own engine number.
- Its own color.
- Its own owner.

These are like **instance properties**.

The manufacturing manual shared by every vehicle is similar to the **prototype**, where common behavior is stored.

The company headquarters also has global utility functions, such as calculating warranty periods.

These are like **static methods** because they belong to the company, not to an individual vehicle.

This analogy ties together classes, instances, prototypes, static members, and inheritance into one complete mental model.

---

### 🎤 Interview Answer

A JavaScript class is a modern syntax for creating objects and organizing related properties and methods. Although classes resemble those in Java or C#, they are **not** a new inheritance model. Internally, every class is implemented using a constructor function and a prototype. Instance methods are stored on the prototype and shared across all objects, while static methods belong to the class itself. The `new` keyword creates an object, links it to the class's prototype, executes the constructor, and returns the initialized instance. Inheritance uses the `extends` keyword but is still implemented through the prototype chain. Private fields provide encapsulation, and composition is generally preferred over deep inheritance hierarchies for building flexible applications.

---

### ❓ Follow-up Questions

1. Are JavaScript classes true classes like Java or C#?
2. Why are classes called syntactic sugar?
3. Where are instance methods stored?
4. How does inheritance work internally in classes?
5. When should you use composition instead of inheritance?
6. How would you explain JavaScript classes to someone coming from Java or C#?

---