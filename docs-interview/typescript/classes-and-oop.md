---
title: Classes & Object-Oriented Programming (OOP)
description: Access modifiers, abstract classes, and how TypeScript extends JS classes.
sidebar_position: 5
---

# Classes & Object-Oriented Programming (OOP)

## 1. How do classes work in TypeScript, and how are they different from JavaScript classes?

### 📖 Introduction

JavaScript already has classes — `class`, `constructor`, `extends`, `super` — all working exactly as they do in TypeScript, because TypeScript doesn't reinvent this syntax at all. What TypeScript adds is everything **around** that syntax: typed properties, compile-time-checked access control, and a few conveniences that don't exist in JavaScript at all.

---

### ✍️ A Quick Recap: The Shared Syntax

```typescript
class Person {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    greet(): string {
        return `Hello, ${this.name}`;
    }
}

const p = new Person("Vaibhav");
```

If you already know JavaScript classes, this looks — and behaves — identically. The differences start showing up in what TypeScript lets you *declare* about this class.

---

### 🔐 Access Modifiers: `public`, `private`, `protected`

TypeScript lets you control where a property or method can be accessed from:

```typescript
class BankAccount {
    public owner: string;       // accessible from anywhere (the default, if omitted)
    private balance: number;     // accessible only inside this class
    protected accountType: string; // accessible in this class and its subclasses

    constructor(owner: string, balance: number) {
        this.owner = owner;
        this.balance = balance;
        this.accountType = "savings";
    }
}

const account = new BankAccount("Vaibhav", 1000);
account.balance; // ❌ Error: "balance" is private and only accessible within class "BankAccount"
```

None of `public`, `private`, or `protected` exist in plain JavaScript — this access control is entirely a TypeScript feature.

---

### 💎 Good to Know: TypeScript's `private` Isn't *Really* Private at Runtime

This is one of the most important differences to understand. TypeScript's access modifiers are a **compile-time-only** check — just like `readonly` from the Objects & Interfaces chapter. Once compiled to JavaScript, the enforcement disappears completely:

```typescript
// Compiled output — "balance" is just a normal property
class BankAccount {
    constructor(owner, balance) {
        this.owner = owner;
        this.balance = balance;
    }
}
```

Nothing stops JavaScript code (or a type assertion) from reaching in and reading `account["balance"]` directly — the `private` keyword only stops *TypeScript-checked* code from doing it by name.

If you need **true**, runtime-enforced privacy, JavaScript itself (not TypeScript) provides native private fields using a `#` prefix:

```typescript
class BankAccount {
    #balance: number;

    constructor(balance: number) {
        this.#balance = balance;
    }
}

const account = new BankAccount(1000);
account.#balance; // ❌ SyntaxError — this fails even in plain compiled JavaScript, at runtime
```

Use `private` for expressing intent and getting compiler support during development; use `#field` when you genuinely need the encapsulation to hold at runtime too.

---

### 🎁 Parameter Properties — A TypeScript-Only Shortcut

Normally, giving a class a typed, assigned property means writing it twice — once as a declaration, once in the constructor:

```typescript
class User {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }
}
```

TypeScript offers a shortcut called a **parameter property**: adding an access modifier directly to a constructor parameter declares *and* assigns the property in one step:

```typescript
class User {
    constructor(private name: string, public age: number) {}
}
```

This is functionally identical to the longer version above — TypeScript generates the property declaration and the `this.name = name` assignment for you. This shorthand has no equivalent in plain JavaScript at all.

---

### 🧾 Class Property Types Must Be Definitely Assigned

Under `strict` mode (specifically `strictPropertyInitialization`, from the `tsconfig.json` chapter), every class property must be assigned a value — either inline, in every constructor path, or explicitly marked as possibly missing:

```typescript
class User {
    name: string; // ❌ Error: Property "name" has no initializer and is not definitely assigned
}
```

This is fixed by initializing it, assigning it in the constructor, marking it optional, or using the definite assignment assertion (`!`) when you know it'll be set some other way TypeScript can't trace:

```typescript
class User {
    name: string = "Guest";     // ✅ initialized inline
    nickname?: string;           // ✅ optional
    id!: number;                  // ✅ "trust me, this gets assigned elsewhere"
}
```

This has no equivalent check in JavaScript, which never verifies a property was assigned before it's used.

---

### 🧩 Implementing Interfaces — Structural Typing Applies Here Too

A class can declare that it implements an interface using `implements`, which asks TypeScript to check the class satisfies that shape:

```typescript
interface Greetable {
    greet(): string;
}

class Person implements Greetable {
    greet() {
        return "Hello!";
    }
}
```

But here's the deeper point, tying back to structural typing from the Type System chapter: the `implements` keyword is really just an extra, explicit check — it isn't *required* for compatibility. Because TypeScript compares classes by shape, a class with the right methods is already compatible, with or without declaring `implements`:

```typescript
class AnotherPerson {
    greet() {
        return "Hi there!";
    }
}

const g: Greetable = new AnotherPerson(); // ✅ Works — no "implements" needed at all
```

`AnotherPerson` never mentioned `Greetable`, yet it satisfies it completely, purely because its shape matches. This is a direct contrast to nominal-typing languages like Java, where a class **must** explicitly declare `implements SomeInterface` to be considered compatible — shape alone isn't enough there.

---

### ⚙️ What Actually Gets Compiled

All of the TypeScript-only features above — access modifiers, parameter properties, the definite-assignment check — exist purely at compile time and disappear from the emitted JavaScript, following the same type erasure rule from the Introduction chapter.

The class syntax itself may also change shape depending on your `tsconfig.json`'s `target`. Compiling to a modern target (`ES2015`+) keeps the `class` syntax as-is; compiling to an older target like `ES5` down-levels it into constructor functions and prototype methods, since `class` didn't exist in JavaScript before ES2015.

---

### ⚖️ JavaScript Classes vs. TypeScript Classes

| | JavaScript Classes | TypeScript Classes |
|---|---|---|
| `constructor`, `extends`, `super` | ✅ | ✅ (identical) |
| Typed properties and methods | ❌ | ✅ |
| `public` / `private` / `protected` | ❌ (only native `#` fields) | ✅ (compile-time only) |
| Parameter properties shorthand | ❌ | ✅ |
| Checked property initialization | ❌ | ✅ (under `strict`) |
| `implements` keyword | ❌ | ✅ (though structural compatibility works even without it) |

---

### ❓ Follow-up Interview Questions

1. Does TypeScript introduce new class syntax, or does it build entirely on JavaScript's existing class syntax?
2. Why is TypeScript's `private` keyword not a true runtime privacy guarantee?
3. What is the actual difference between `private` and a native `#field`?
4. What do parameter properties save you from writing manually?
5. Is the `implements` keyword required for a class to be compatible with an interface? Why or why not?
6. What does `strictPropertyInitialization` protect against, and how can you satisfy it?

---

## 2. How do constructors, parameter properties, and object initialization work in TypeScript?

### 📖 Introduction

The previous question introduced parameter properties as a shorthand. This question goes a level deeper: how constructors actually behave — including a form of overloading most developers never realize exists — the precise order objects get initialized in, and a genuinely useful pattern for controlling how instances get created in the first place.

---

### 🔀 Constructors Can Have Overload Signatures Too

Just like the function overloads from the Functions chapter, a constructor can have multiple **overload signatures** describing different valid ways to call it, followed by a single implementation that handles all of them:

```typescript
class Point {
    x: number;
    y: number;

    constructor(x: number, y: number);
    constructor(coords: [number, number]);
    constructor(xOrCoords: number | [number, number], y?: number) {
        if (Array.isArray(xOrCoords)) {
            [this.x, this.y] = xOrCoords;
        } else {
            this.x = xOrCoords;
            this.y = y!;
        }
    }
}

new Point(10, 20);      // ✅ matches the first overload
new Point([10, 20]);    // ✅ matches the second overload
```

Exactly as with function overloads, callers only ever see the two clean overload signatures — the messy implementation signature that handles both cases is invisible from the outside.

---

### 🎁 Parameter Properties: Combining Modifiers

Building on the shorthand from question 1, parameter properties can combine an access modifier with `readonly`, and can also have default values, exactly like a normal parameter:

```typescript
class User {
    constructor(
        private readonly id: number,        // private AND readonly, in one declaration
        public name: string = "Guest"        // parameter property with a default value
    ) {}
}
```

`readonly` alone (without `public`/`private`/`protected`) is also enough to trigger parameter property behavior — TypeScript only needs *one* modifier to know you want the parameter turned into a property:

```typescript
class User {
    constructor(readonly id: number) {} // still becomes a property, just with default (public) visibility
}
```

All the usual parameter ordering rules from the Functions chapter still apply — required parameters before optional or defaulted ones.

---

### 🧵 The Order Objects Actually Get Initialized In

When `new SomeClass()` runs, TypeScript (following the same rules as JavaScript) initializes things in a specific, predictable order:

1. **If the class extends another class, `super(...)` runs first.** You cannot access `this` in a derived class's constructor before calling `super()` — TypeScript enforces this at compile time.
2. **Class field initializers run next**, in the order they're declared in the class body.
3. **The rest of the constructor body executes last**, in the order it's written — and this is where parameter property assignments effectively happen, before any of your own explicit statements.

```typescript
class Base {
    constructor() {
        console.log("Base constructor");
    }
}

class Derived extends Base {
    label = "default label"; // field initializer

    constructor() {
        super();              // must come first
        console.log("Derived constructor", this.label);
    }
}

new Derived();
// Logs: "Base constructor", then "Derived constructor default label"
```

Getting this order wrong — like trying to reference `this` before `super()`, or expecting a subclass field to be ready inside the base class's constructor — is a common source of confusing bugs in class hierarchies.

---

### 🔒 Private Constructors and Static Factories

A constructor itself can be marked `private`, which prevents any code outside the class from calling `new` directly. This is most useful combined with a `static` method that controls how instances get created — for example, to run validation before an object exists, or to enforce a single shared instance:

```typescript
class User {
    private constructor(public name: string) {}

    static create(name: string): User {
        if (!name.trim()) {
            throw new Error("Name is required");
        }
        return new User(name);
    }
}

const user = User.create("Vaibhav"); // ✅ the only way to get a User
new User("Vaibhav");                  // ❌ Error: constructor is private
```

This pattern — private constructor plus a `static` factory method — is a common, genuinely useful way to guarantee every instance of a class was created through validated, controlled logic, rather than trusting every call site to remember to validate manually.

---

### 💎 Good to Know: Classes Without an Explicit Constructor

If you don't write a constructor at all, TypeScript (like JavaScript) generates an implicit default one:

- A base class with no constructor gets an empty one: `constructor() {}`.
- A derived class with no constructor gets one that simply forwards every argument to `super(...)`.

This is why you can write `class Admin extends User {}` with no constructor of its own, and still call `new Admin("Vaibhav")` successfully — the implicit constructor passes `"Vaibhav"` straight through to `User`'s constructor.

---

### ❓ Follow-up Interview Questions

1. How is a constructor with overload signatures different from a normal overloaded function?
2. Can `readonly` alone (without `public`/`private`/`protected`) turn a constructor parameter into a property?
3. What must happen before `this` can be used inside a derived class's constructor?
4. In what order do class field initializers and the constructor body's own statements run?
5. Why would a class use a private constructor together with a static factory method?
6. What constructor does a derived class get automatically if it doesn't declare one?

---

## 3. What are access modifiers in TypeScript, how do `public`, `private`, and `protected` work, and when should you use each of them?

### 📖 Introduction

Question 1 already introduced the three access modifiers and the important fact that they're compile-time-only. This question goes deeper on `protected` specifically — the one that got the least attention so far — and on a genuinely surprising exception to structural typing that only shows up once private or protected members get involved.

---

### 🛡️ `protected` — Visible to the Class and Its Subclasses, Nowhere Else

`public` is visible everywhere, `private` is visible only inside the declaring class, and `protected` sits in between — visible inside the declaring class **and any class that extends it**, but not from outside either one:

```typescript
class Animal {
    protected makeSound(): string {
        return "...generic animal sound...";
    }
}

class Dog extends Animal {
    bark(): string {
        return this.makeSound(); // ✅ allowed — Dog is a subclass of Animal
    }
}

const dog = new Dog();
dog.bark();        // ✅ "...generic animal sound..."
dog.makeSound();    // ❌ Error: "makeSound" is protected and only accessible within class "Animal" and its subclasses
```

`Dog` can call `makeSound()` from inside its own methods, but code outside the class hierarchy entirely — like the `dog.makeSound()` call at the bottom — is blocked, exactly like `private` would block it.

---

### 🎯 Where `protected` Actually Shines: Customizable Base Classes

`protected` is most useful when you're designing a base class that expects subclasses to override or call specific internal pieces, while keeping those pieces off-limits to unrelated code:

```typescript
class Report {
    generate(): string {
        return `Report: ${this.getContent()}`; // the public entry point
    }

    protected getContent(): string {
        return "Default content"; // subclasses are expected to override this
    }
}

class SalesReport extends Report {
    protected getContent(): string {
        return "Q1 sales figures...";
    }
}

new SalesReport().generate(); // "Report: Q1 sales figures..."
```

`generate()` is the public API anyone can call; `getContent()` is an internal extension point meant only for subclasses — `protected` expresses that boundary directly in the type system, instead of just as a comment.

---

### 💎 Good to Know: `private`/`protected` Members Break Pure Structural Typing

The Type System chapter established that TypeScript compares types by shape, not by name — but this rule has one notable exception. Once a `private` or `protected` member is involved, two otherwise identical-looking classes are **not** considered compatible:

```typescript
class Animal {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }
}

class Person {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }
}

let a: Animal = new Person("Vaibhav");
// ❌ Error: Property "name" is private in type "Person" but not in type "Animal"
```

Even though `Animal` and `Person` look structurally identical, TypeScript treats a `private` (or `protected`) member as only compatible with another member that came from the **exact same declaration** — not just one that happens to share the same name and type. This is the one place TypeScript quietly borrows a bit of nominal typing (from the Type System chapter's structural-vs-nominal comparison) inside an otherwise fully structural type system.

---

### ✍️ Good to Know: Getters and Setters Can Have Different Visibility

Since TypeScript 4.3, a property's getter and setter are allowed to declare different access modifiers — commonly used to allow public *reading* of a value while restricting *writing* it:

```typescript
class Person {
    private _age = 0;

    get age(): number {
        return this._age; // public read access
    }

    protected set age(value: number) {
        this._age = value; // only this class and subclasses can write
    }
}
```

External code can freely read `person.age`, but only `Person` itself or a subclass can assign to it.

---

### 🎯 When to Use Each

- **`public`** (the default) — for the class's real API surface: the methods and properties anyone using the class is meant to call.
- **`private`** — for internal implementation details and helper state that could change freely without breaking any code outside the class. Reach for this by default for anything that isn't part of the intended API.
- **`protected`** — specifically when designing a base class meant to be extended, and subclasses need access to certain internals that unrelated code still shouldn't touch.

---

### ❓ Follow-up Interview Questions

1. What's the difference in visibility between `private` and `protected`?
2. Why can a subclass call a `protected` method on itself, but not on an unrelated instance from outside?
3. Why does TypeScript reject assigning a `Person` instance to an `Animal`-typed variable, even when both classes look structurally identical?
4. What does that exception reveal about TypeScript's type system beyond pure structural typing?
5. Why might a class want a getter to be public while its matching setter is `protected` or `private`?
6. Give a practical scenario where `protected` is a better fit than `private`.

---

## 4. How do `readonly`, getters, setters, and static members work in TypeScript, and what problems do they solve?

### 📖 Introduction

Each of these features solves a different, specific problem: `readonly` locks a value in place after construction, getters/setters let a property secretly run code, and `static` members belong to the class itself rather than to any one instance. Together, they cover most of the encapsulation and shared-state patterns you'll actually reach for in real class design.

---

### 🔒 `readonly` in Classes — Assign Once, Never Again

A `readonly` class property can be assigned when it's declared, or anywhere inside the constructor — but nowhere else:

```typescript
class User {
    readonly id: number;

    constructor(id: number) {
        this.id = id; // ✅ allowed — this is the constructor
    }

    changeId(newId: number) {
        this.id = newId; // ❌ Error: Cannot assign to "id" because it is a read-only property
    }
}
```

This is a slightly stricter rule than `readonly` on a plain object type (from the Objects & Interfaces chapter) — a class's `readonly` property specifically protects against reassignment *outside the constructor*, which is exactly the right shape for values like an `id` that should be fixed for the lifetime of the object. The same caveats from that chapter still apply here too: it's a compile-time-only check, and it only protects the property itself, not anything nested inside it.

---

### 🎛️ Getters and Setters — Property Syntax, Method Behavior

A getter or setter lets you access something with plain property syntax (`circle.area`, no parentheses) while actually running a method behind the scenes:

```typescript
class Circle {
    constructor(private radius: number) {}

    get area(): number {
        return Math.PI * this.radius ** 2; // computed fresh every time, never stored
    }

    get diameter(): number {
        return this.radius * 2;
    }

    set diameter(value: number) {
        if (value <= 0) {
            throw new Error("Diameter must be positive");
        }
        this.radius = value / 2;
    }
}

const circle = new Circle(5);
circle.area;           // 78.53... — looks like a property, runs a method
circle.diameter = 20;   // runs the validation logic, updates radius
circle.diameter = -4;   // ❌ throws at runtime — caught by the setter's own check
```

This is the problem getters/setters solve: they give you the clean, simple *syntax* of a property, while keeping the *control* of a method — validating input, computing a derived value on demand instead of storing (and potentially desyncing) it, or logging/reacting to reads and writes.

---

### 💎 Good to Know: A Getter Without a Setter Is Automatically Read-Only

If you define a `get` but no matching `set`, TypeScript treats the property as effectively `readonly` from the outside — assigning to it is a compile error:

```typescript
circle.area = 100;
// ❌ Error: Cannot assign to "area" because it is a read-only property
```

This makes sense once you think about it: there's no setter for TypeScript to call, so there's nothing an assignment could actually do.

---

### 🏛️ Static Members — Belonging to the Class, Not the Instance

A `static` member exists once, on the class itself, and is shared across every instance — rather than being duplicated onto each new object:

```typescript
class User {
    static count = 0; // one shared value, not per-instance

    id: number;

    constructor() {
        User.count++;
        this.id = User.count;
    }
}

new User();
new User();
console.log(User.count); // 2 — shared across both instances
```

Static members are accessed through the **class name**, not through an instance — `User.count`, never `someUser.count`. This is exactly the mechanism behind the static factory pattern from question 2 (`User.create(...)`) — a factory method is simply a static method that happens to return a new instance.

Inside a `static` method, `this` refers to the class itself, not an instance:

```typescript
class Counter {
    static count = 0;

    static increment() {
        this.count++; // `this` here means the Counter class
    }
}

Counter.increment();
console.log(Counter.count); // 1
```

Static members can combine with the access modifiers and `readonly` from earlier questions too — a common pattern is a shared, private, read-only constant:

```typescript
class Config {
    private static readonly MAX_USERS = 100;

    static isFull(currentCount: number): boolean {
        return currentCount >= Config.MAX_USERS;
    }
}
```

---

### 💎 Good to Know: Static Initialization Blocks

For static state that needs more than a single expression to set up, a `static { ... }` block runs once, when the class itself is loaded — before any instance is ever created:

```typescript
class Config {
    static settings: Record<string, string>;

    static {
        // any setup logic can go here, not just a single value
        Config.settings = loadSettingsFromSomewhere();
    }
}
```

This is useful when static initialization needs a loop, a condition, or a try/catch — things a single inline value can't express.

---

### 🎯 What Problem Each One Solves

| Feature | Problem it solves |
|---|---|
| `readonly` | Prevents a value from changing after the object is constructed |
| Getter | Exposes a computed or derived value without storing (and risking desyncing) it |
| Setter | Runs validation or side effects the moment a value is assigned |
| `static` | Shares one value or utility across every instance, instead of duplicating it per object |

---

### ❓ Follow-up Interview Questions

1. Where is a class's `readonly` property allowed to be assigned?
2. What does a getter let you do that a plain stored property can't?
3. Why does defining only a `get` (with no matching `set`) make a property effectively read-only?
4. How do you access a `static` member — through the class or through an instance?
5. What does `this` refer to inside a `static` method?
6. Why might a static member also be marked `private` and `readonly` at the same time?

---

## 5. How does inheritance work in TypeScript, and how can you extend and override class members?

### 📖 Introduction

Inheritance lets one class build on another, reusing its members while adding or changing behavior. We've already seen pieces of this — `super()` ordering in question 2, `protected` members in question 3 — this question pulls it together and covers what actually happens when a subclass **overrides** a member.

---

### 🧬 Extending a Class

A class extends another with `extends`, gaining all of its non-private members:

```typescript
class Animal {
    constructor(public name: string) {}

    makeSound(): string {
        return "...";
    }
}

class Dog extends Animal {
    makeSound(): string {
        return "Woof"; // overrides the base implementation
    }
}

const dog = new Dog("Rex");
dog.makeSound(); // "Woof"
```

`Dog` automatically has `name` (inherited from `Animal`) and its own overridden `makeSound()`. As covered in question 2, if `Dog` declares its own constructor, it must call `super(...)` before using `this`.

---

### 📣 Calling the Base Version with `super`

Overriding a method doesn't have to mean replacing it entirely — `super.methodName()` calls the base class's version from inside the override, letting you extend behavior instead of throwing it away:

```typescript
class Dog extends Animal {
    makeSound(): string {
        return `${super.makeSound()} Woof!`; // extends, rather than replaces
    }
}

new Dog("Rex").makeSound(); // "... Woof!"
```

---

### 🛡️ The `override` Keyword — Catching Typos at Compile Time

It's a surprisingly common mistake to think you're overriding a base class method, when really you've misspelled its name and accidentally created a brand-new, unrelated method. The `override` keyword protects against exactly this:

```typescript
class Dog extends Animal {
    override makeSound(): string { // ✅ TypeScript confirms Animal really has this method
        return "Woof";
    }

    override mkaeSound(): string { // ❌ Error: this method does not override any base class method
        return "Meow";
    }
}
```

By itself, `override` only checks methods you've explicitly marked. To catch the *opposite* mistake — overriding a base method without marking it `override` — enable `noImplicitOverride` in `tsconfig.json` (from the tsconfig chapter), which requires every genuine override to be explicitly labeled.

---

### 🔓 Access Modifiers When Overriding: Widen Freely, Never Narrow

TypeScript allows an override to make a member **more** accessible than the base version, but never **less**:

```typescript
class Animal {
    protected makeSound(): string {
        return "...";
    }
}

class Dog extends Animal {
    public makeSound(): string { // ✅ widening protected → public is allowed
        return "Woof";
    }
}

class Cat extends Animal {
    private makeSound(): string { // ❌ Error: cannot narrow accessibility from "protected" to "private"
        return "Meow";
    }
}
```

This protects the base class's contract — any code that could call `makeSound()` on an `Animal` must still be able to call it on anything that extends `Animal`, so accessibility can only ever open up, never close off.

---

### 💎 Good to Know: Return Types Can Narrow, But Method Parameters Are Special

An override is allowed to return a more specific type than the base method promised — this is safe, because any caller expecting the base return type can still handle the narrower one:

```typescript
class Animal {
    reproduce(): Animal {
        return new Animal();
    }
}

class Dog extends Animal {
    override reproduce(): Dog { // ✅ narrowing the return type is sound
        return new Dog("Puppy");
    }
}
```

Parameters are a different story. In a strict, fully sound type system, narrowing a method's parameter type in an override should be rejected — a caller holding an `Animal`-typed reference might pass any `Animal` to it, not specifically a `Dog`. But TypeScript, for practical compatibility reasons, checks **method syntax** parameters bivariantly (allowed in both directions) rather than strictly contravariantly:

```typescript
class Handler {
    speak(animal: Animal): void {}
}

class DogHandler extends Handler {
    speak(animal: Dog): void {} // ⚠️ Allowed by TypeScript, but not actually type-safe
}
```

This is a well-known, intentional trade-off — enforcing full strictness here would have broken too many existing, mostly-safe real-world patterns. It's worth knowing this exception exists, precisely because it's one of the few places TypeScript accepts a small amount of unsoundness for practicality.

---

### 💎 Good to Know: Extending Built-in Classes Like `Error`

Extending a native class such as `Error` is a classic TypeScript/JavaScript gotcha:

```typescript
class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CustomError";
        Object.setPrototypeOf(this, CustomError.prototype); // fixes the prototype chain
    }
}
```

On modern compilation targets (`ES2015`+, from the `tsconfig.json` chapter's `target` option), this extra line usually isn't needed. But when compiling down to older targets like `ES5`, classes are down-leveled into plain constructor functions (as covered in question 1), and native built-ins like `Error` don't subclass correctly through that mechanism — `instanceof CustomError` can silently return `false` without the manual `Object.setPrototypeOf` fix.

---

### 🧩 Single Inheritance, Multiple Interfaces

A class can only `extends` **one** other class — TypeScript (like JavaScript) doesn't support inheriting from multiple classes at once. If a class needs to satisfy multiple contracts, it can `implements` more than one interface instead (from question 1), since interfaces are just shape descriptions, not implementations to inherit from:

```typescript
class Duck implements Swimmable, Flyable {
    swim() { /* ... */ }
    fly() { /* ... */ }
}
```

---

### ❓ Follow-up Interview Questions

1. What does a subclass automatically gain from the class it extends?
2. What does `super.methodName()` let you do that simply redefining the method doesn't?
3. What mistake does the `override` keyword protect against, and what does `noImplicitOverride` add on top of it?
4. Can an override widen a member's access modifier? Can it narrow it? Why the asymmetry?
5. Why is narrowing a method's return type considered safe, while narrowing a parameter type is not — yet TypeScript allows both?
6. Why might extending `Error` require an extra `Object.setPrototypeOf` call on older compilation targets?

---

## 6. What are abstract classes in TypeScript, how do they work, and how are they different from regular classes and interfaces?

### 📖 Introduction

Sometimes a base class represents a concept that should never be instantiated directly — only extended. An `Animal` might make sense as a shared foundation for `Dog` and `Cat`, but creating a plain, generic `new Animal()` might not make sense on its own. **Abstract classes** exist specifically to express that.

---

### 🚫 Abstract Classes Cannot Be Instantiated Directly

Marking a class `abstract` prevents it from ever being constructed on its own — only its subclasses can be:

```typescript
abstract class Animal {
    constructor(public name: string) {}

    move(): string {
        return `${this.name} is moving`;
    }
}

new Animal("Generic"); // ❌ Error: Cannot create an instance of an abstract class

class Dog extends Animal {}
new Dog("Rex"); // ✅ Allowed — Dog is not abstract
```

---

### 🧩 Abstract Methods — A Contract Subclasses Must Fulfill

An abstract class can also declare **abstract methods** — methods with no implementation at all, just a signature that every subclass is required to provide:

```typescript
abstract class Animal {
    constructor(public name: string) {}

    abstract makeSound(): string; // no body — subclasses must implement this

    describe(): string {
        return `${this.name} says ${this.makeSound()}`; // uses the method it doesn't define itself
    }
}

class Dog extends Animal {
    makeSound(): string {
        return "Woof"; // required — TypeScript won't compile without it
    }
}

class Cat extends Animal {
    // ❌ Error: non-abstract class "Cat" does not implement inherited abstract member "makeSound"
}
```

This is the same **template method** pattern from question 3's `protected` example, taken one step further: instead of providing a default implementation subclasses *may* override, `abstract` makes the override **mandatory**.

---

### ⚖️ Abstract Class vs. Regular Class vs. Interface

| | Regular Class | Abstract Class | Interface |
|---|---|---|---|
| Can be instantiated directly | ✅ | ❌ | ❌ (interfaces never produce values at all) |
| Can provide real implementation | ✅ | ✅ (mix of implemented and abstract members) | ❌ (signatures only) |
| Can declare members with no body | ❌ | ✅ (`abstract` methods) | ✅ (everything is signature-only) |
| Can hold state (properties with values) | ✅ | ✅ | ❌ |
| A class can have more than one | ❌ (single inheritance) | ❌ (single inheritance) | ✅ (`implements` multiple) |
| Exists at runtime after compilation | ✅ | ✅ (compiles to a real class) | ❌ (fully erased — a pure compile-time construct, from the Introduction chapter) |

---

### 🎯 When to Use Which

- **Regular class** — when every instance should be usable on its own, with no missing pieces.
- **Abstract class** — when you want to share **real, working code** across subclasses (like `describe()` above) *and* enforce that certain pieces must be filled in — something a plain interface can't do, since it can't hold any implementation at all.
- **Interface** — when you only need to describe a **shape** or contract, with no shared implementation to distribute, and you might need a class to satisfy more than one of them at once.

---

### 💎 Good to Know: An Abstract Class Can Also `implement` an Interface

Abstract classes aren't limited to just declaring their own abstract members — they can also take on an interface's contract, fulfilling some of it directly and leaving the rest abstract for subclasses:

```typescript
interface Movable {
    move(): string;
}

abstract class Animal implements Movable {
    move(): string {
        return "moving..."; // fulfills the interface directly
    }

    abstract makeSound(): string; // still left for subclasses
}
```

This combination is common in larger applications: the interface defines the public contract other code depends on, while the abstract class provides a shared, partial implementation of it.

---

### ❓ Follow-up Interview Questions

1. What happens if you try to directly instantiate an abstract class?
2. What is an abstract method, and what is a subclass required to do about it?
3. How does an abstract method relate to the `protected` template-method pattern from an earlier question?
4. Can an interface hold any actual implementation code? Can an abstract class?
5. Why would you choose an abstract class over an interface when you need to share real logic across subclasses?
6. Does an abstract class exist in the compiled JavaScript output, unlike an interface?

---

## 7. How can interfaces be implemented by classes, and when should you use interfaces instead of inheritance?

### 📖 Introduction

Question 1 introduced `implements` and the fact that structural typing means it's not even strictly required. This question goes further: a class can satisfy several interfaces at once, an interface can only ever describe *public* shape, and — perhaps most importantly — when reaching for an interface is a better call than reaching for inheritance in the first place.

---

### 🧩 A Class Can Implement Multiple Interfaces

Unlike `extends`, which is limited to a single class, `implements` can list as many interfaces as a class actually satisfies:

```typescript
interface Swimmable {
    swim(): string;
}

interface Flyable {
    fly(): string;
}

class Duck implements Swimmable, Flyable {
    swim(): string {
        return "Duck is swimming";
    }

    fly(): string {
        return "Duck is flying";
    }
}
```

If `Duck` forgot to implement `fly()`, TypeScript would reject it immediately: `Class "Duck" incorrectly implements interface "Flyable". Property "fly" is missing.` Each interface is checked independently, and all of them must be satisfied.

---

### 🔍 Interfaces Only Ever Describe the Public Shape

An interface has no concept of `private` or `protected` at all — trying to add one is simply invalid:

```typescript
interface HasName {
    private name: string; // ❌ Error: A property cannot have modifiers in an interface
}
```

This means `implements SomeInterface` can only ever obligate a class to expose certain **public** members — it has no way to require, check, or even describe private internal state. Whatever an interface asks for, every class satisfying it must expose to the outside world.

---

### 💎 Good to Know: An Interface Can Extend a Class

Perhaps the most surprising interaction in this chapter: an interface is allowed to `extends` a **class**, inheriting its shape — private members included:

```typescript
class Control {
    private state: unknown;

    select() {
        this.state = "selected";
    }
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() {
        // ✅ fine — Button inherited Control's private "state" through extends
    }
}

class TextField implements SelectableControl {
    select() {
        // ❌ Error: Property "state" is missing in type "TextField"
    }
}
```

Because `SelectableControl` extends a class that has a `private` member, only `Control` itself — or something that extends `Control` — can ever satisfy `SelectableControl`. This is question 3's "private members break structural typing" rule showing up again: `TextField` could add its own `select()` method, but it can never have the *exact same* private `state` that `Control` declared, so it's permanently excluded from implementing `SelectableControl`, no matter what it does.

---

### ⚖️ Interfaces vs. Inheritance: "Can Do" vs. "Is A"

Inheritance (`extends`) and interfaces (`implements`) answer two different design questions:

- **Inheritance** models an **"is-a"** relationship, and shares real, working implementation and state along with it — a `Dog` *is an* `Animal`, and reuses `Animal`'s actual code.
- **Interfaces** model a **"can-do"** capability, with zero shared implementation — a `Duck` *can swim*, and so can a `Fish` or a `Submarine`, even though none of them share a sensible common ancestor.

This is also exactly why `implements` accepts a list, but `extends` (for classes) doesn't: an object can plausibly have many independent capabilities, but in TypeScript and JavaScript, it can only ever be "a kind of" one specific thing.

---

### 🎯 When to Use Each

- **Reach for inheritance** when there's a genuine "is-a" relationship *and* you want to share actual behavior or state across the hierarchy (as with the abstract `Animal` base class from question 6).
- **Reach for an interface** when you just need to guarantee a class exposes a certain shape, especially when that shape might apply to several otherwise-unrelated classes, or when a class already needs to extend something else and simply needs to promise additional capabilities on top.
- Remember that interfaces provide **zero** code reuse by themselves (unlike abstract classes) — if multiple classes need the exact same implementation, not just the same shape, an interface alone won't save you from writing that logic more than once.

---

### ❓ Follow-up Interview Questions

1. Can a class implement more than one interface at the same time? Can it extend more than one class?
2. Why can't an interface declare a `private` or `protected` member?
3. What does it mean for an interface to `extends` a class instead of another interface?
4. Why can `TextField` never satisfy `SelectableControl` in the example above, even if it adds a `select()` method?
5. What's the practical difference between an "is-a" relationship and a "can-do" capability?
6. Does implementing an interface give a class any shared implementation code? Why or why not?

---
