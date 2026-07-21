---
title: Advanced React Patterns
description: Render props, compound components, HOCs, and custom hooks.
sidebar_position: 16
---

# Advanced React Patterns

## 1. What are React design patterns, and why do they matter for building maintainable applications?

### 📖 Introduction
This chapter covers a set of recurring, reusable approaches to structuring components and sharing logic between them — not React APIs themselves, but conventions the community converged on for solving the same handful of problems repeatedly.

### 🧩 What a "Pattern" Actually Is
A React design pattern is a reusable solution to a common structural problem — sharing stateful logic between unrelated components, separating what a component *does* from how it *looks*, building a component API flexible enough for consumers to customize. Patterns operate one level above individual hooks or APIs: they're about how pieces get composed and organized, not which specific function gets called.

### 🗣️ Why Patterns Matter for Maintainability
- **Shared vocabulary** — saying "let's use a compound component here" communicates an entire design approach instantly to a teammate who knows the pattern, without re-explaining it from scratch each time.
- **Not reinventing solved problems** — "how do I share stateful logic between two unrelated components" has already been answered multiple ways (HOCs, Render Props, Custom Hooks — Questions 2 through 4), each with known trade-offs, rather than every developer solving it fresh.
- **Predictability** — a codebase that uses patterns consistently is easier to onboard onto; recognizing "this is a compound component" immediately tells a new developer how to use and extend it, based on prior exposure to the pattern elsewhere, not just this one codebase.

### 🗺️ What This Chapter Covers
The chapter follows the actual historical progression: Higher-Order Components and Render Props emerged first as early solutions to logic-sharing (Questions 2 and 3), largely superseded by Custom Hooks once Hooks were introduced (Question 4). Alongside those, the Provider Pattern (Question 5, related to but distinct from the Context API itself), Compound Components (Question 6, for flexible component APIs), and Headless Components (Question 7, separating logic from presentation) solve different, specific problems. Knowing which problem each pattern actually solves matters more than memorizing its syntax — Question 9 covers the decision framework directly.

### 💎 Good to Know: This Mirrors Design Patterns in Other Ecosystems
This is conceptually the same idea as classic object-oriented design patterns (the Gang of Four patterns, for instance) — named, reusable solutions to recurring structural problems, just specific to how React components compose rather than to class-based OOP design.

### ❓ Follow-up Interview Questions

1. Why are React design patterns described as operating "above" individual hooks or APIs?
2. What recurring problem do HOCs, Render Props, and Custom Hooks all attempt to solve?
3. Why does shared vocabulary around patterns matter for team communication specifically?
4. How does recognizing a familiar pattern help a new developer onboard onto an unfamiliar codebase?
5. Is knowing pattern syntax more or less important than knowing which problem a pattern solves? Why?

---

## 2. What is the Higher-Order Component (HOC) pattern, what problems did it solve, and what are its limitations?

### 📖 Introduction
HOCs were one of the earliest widely-adopted patterns for sharing logic between components, predating Hooks entirely. Understanding what problem they solved — and where they broke down — explains why the ecosystem eventually moved away from them.

### 🏗️ What a HOC Actually Is
A Higher-Order Component is a function that takes a component and returns a new, enhanced component — not a React feature, just ordinary function composition applied to components, since components are just functions:
```jsx
function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    if (props.isLoading) return <Spinner />;
    return <WrappedComponent {...props} />;
  };
}

const UserProfileWithLoading = withLoading(UserProfile);
```

### 🎯 The Problem It Solved
Before Hooks, class components had no clean way to reuse stateful logic across unrelated components other than inheritance (which React's own guidance explicitly steered away from) or copy-pasting the same logic repeatedly. HOCs let cross-cutting behavior — a loading spinner, injecting a theme, redirecting unauthenticated users (an early precursor to the Routing chapter's `RequireAuth` pattern, Question 7) — be applied by wrapping a component, achieving reuse through composition rather than inheritance.

### 🧅 Limitation 1: Wrapper Hell
Composing several HOCs around one component — `withAuth(withTheme(withLoading(Component)))` — produces a deeply nested tree of wrapper components. React DevTools' component tree fills with layers like `WithAuth(WithTheme(WithLoading(Component)))`, making the actual structure harder to read and debug.

### 💥 Limitation 2: Prop Name Collisions
If two different HOCs both inject a prop with the same name (both calling it `data`, for instance), one silently overwrites the other with no warning — a genuinely difficult class of bug to trace back to its source.

### 📎 Limitation 3: Static Methods and Refs Don't Carry Over Automatically
Since a HOC returns a brand-new component, any static methods defined on the original component don't automatically exist on the wrapped version unless manually copied over (commonly via the `hoistNonReactStatics` library). Forwarding a `ref` through to the wrapped component also isn't automatic — it requires explicit `React.forwardRef` handling (Components chapter).

### 🔍 Limitation 4: Where Did This Prop Come From?
Because HOCs inject props invisibly from outside the component's own JSX, reading a component's usage in isolation doesn't reveal which props are passed directly versus injected by some wrapping HOC defined elsewhere — reducing traceability, especially once several HOCs are layered together in a large codebase.

### ❓ Follow-up Interview Questions

1. Why couldn't class components reuse stateful logic through inheritance the way HOCs allow through composition?
2. What specifically causes "wrapper hell" to make debugging harder in React DevTools?
3. Walk through how two HOCs injecting a prop with the same name could silently break a component.
4. Why don't static methods on the original component automatically appear on a HOC-wrapped version?
5. Why does prop injection via HOCs reduce a component's traceability compared to props passed directly in JSX?

---

## 3. What is the Render Props pattern, why was it introduced, and what are its limitations?

### 📖 Introduction
Render Props solved the same underlying problem as HOCs — sharing stateful logic across components — while directly addressing some of HOC's specific weaknesses. It has its own trade-offs, though, which is part of why both patterns were eventually superseded (Question 4).

### 🎁 What Render Props Actually Is
A component that accepts a function as a prop and calls it to determine what to render, passing its own internal state as arguments — letting the consumer decide exactly what to render with that data:
```jsx
class MouseTracker extends React.Component {
  state = { x: 0, y: 0 };
  handleMouseMove = (e) => this.setState({ x: e.clientX, y: e.clientY });

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

<MouseTracker render={({ x, y }) => <p>Mouse at {x}, {y}</p>} />
```

### ✅ Why It Was Introduced
This directly addresses two of HOC's weaknesses from Question 2: there's no prop-collision risk, since the consumer receives the shared state as explicit function arguments and decides how to name and use them in its own output — and it's far more explicit about where data comes from, since it's a plain argument visible right at the call site, not an invisibly injected prop.

### 🔺 Limitation 1: Callback Hell — a Different Shape of Nesting Mess
Combining multiple render-props components creates a pyramid of nested function calls, arguably worse to read than HOC's wrapper hell, since it's nested directly inline in the JSX rather than just showing up as a name in DevTools:
```jsx
<MouseTracker render={mouse => (
  <ThemeConsumer render={theme => (
    <AuthConsumer render={auth => (
      // actual content buried three levels deep
    )} />
  )} />
)} />
```

### ⚡ Limitation 2: Inline Functions Can Hurt Performance
Defining the render prop function inline creates a new function on every render, capable of breaking memoization the same way the Performance Optimization chapter's Question 2 `config` prop example did — a concept already covered in depth, now showing up in a different pattern.

### 🧠 Limitation 3: Logic and Output Get Intertwined
Compared to straightforward JSX composition, render props can be harder to read and reason about, since the shared logic and the actual rendered output are woven together in the same expression rather than kept visually separate.

### 💎 Good to Know: Both Patterns Were Largely Superseded
HOCs and Render Props both solved logic-sharing well enough to become standard for years, but both were largely replaced once Hooks arrived — Question 4 covers that transition and exactly what Custom Hooks solve that neither of these fully did.

### ❓ Follow-up Interview Questions

1. How does Render Props avoid the prop-collision problem that HOCs are prone to?
2. Why is Render Props' nesting sometimes considered visually worse than HOC's wrapper hell, despite solving other HOC problems?
3. How can an inline render prop function hurt performance, concretely?
4. Why is data explicitness cited as an advantage of Render Props over HOCs?
5. What do Render Props and HOCs have in common in terms of the underlying problem they solve?

---

## 4. Why are Custom Hooks generally preferred over HOCs and Render Props today, and what do they solve that those patterns couldn't?

### 📖 Introduction
Both prior questions previewed this transition — here's the full answer to why Custom Hooks became the default way to share logic, and, just as importantly, what they honestly don't replace.

### 🪝 What a Custom Hook Actually Is
A function starting with `use` that can call other hooks internally, giving any component that calls it the same stateful logic — with no wrapping, no nesting, no injected props at all:
```jsx
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return position;
}

function MyComponent() {
  const { x, y } = useMousePosition(); // just a function call
  return <p>Mouse at {x}, {y}</p>;
}
```

### 🚫 No Wrapper Components: Wrapper Hell and Callback Hell Both Disappear
A custom hook doesn't add any component to the tree at all — it's just a function call inside whichever component uses it. This eliminates Question 2's wrapper-hell problem and Question 3's nested-callback problem simultaneously, since there's no extra component layer or nested render-function structure required for either.

### 🎯 No Prop Collisions: Explicit Destructuring Instead of Invisible Injection
Since a hook's return value is destructured explicitly by the consuming component, with whatever variable names it chooses, there's no possibility of two different sources colliding under the same name the way HOC-injected props could (Question 2's Limitation 2) — and reading a component's body shows exactly which hooks it calls and what each one returns, fully addressing Question 2's "where did this prop come from" problem too.

### 🧩 Composability: Just Function Composition
Custom hooks can call other custom hooks internally, letting reusable logic layer naturally through ordinary function composition — a concept every JavaScript developer already deeply understands, rather than the less-familiar mental models of wrapping components (HOCs) or nesting render functions (Render Props). Since there's no wrapper component created at all, Question 2's Limitation 3 (lost static methods, ref-forwarding complications) simply doesn't apply — there's no wrapper for anything to be lost on.

### ⚖️ What Custom Hooks Don't Replace
Worth being honest about a real limitation: Custom Hooks share stateful *logic*, not flexible *UI structure*. If the goal is a composable component API like `<Menu><Menu.Item /></Menu>`, a hook alone doesn't address that — it returns data and behavior, not JSX structure. This is exactly why Compound Components (Question 6) and Headless Components (Question 7) still matter as patterns in their own right, complementary to Custom Hooks rather than made obsolete by them.

### ❓ Follow-up Interview Questions

1. Why does a custom hook not add anything to the component tree, unlike a HOC?
2. How does explicit destructuring of a hook's return value eliminate the prop-collision problem?
3. Why is "just function composition" considered a simpler mental model than wrapping components or nesting render functions?
4. What problem do Custom Hooks NOT solve that Compound Components still need to address?
5. Why does the "lost static methods" limitation from HOCs simply not apply to Custom Hooks?

---

## 5. What is the Provider Pattern, and how does it relate to (and differ from) the Context API?

### 📖 Introduction
These two get used almost interchangeably in everyday conversation, but they're not quite the same thing — one is a general design goal, the other is a specific React mechanism that happens to be the standard way to achieve it today.

### 🎯 What the Provider Pattern Actually Is, Conceptually
The Provider Pattern is a general architecture idea: a component sits high in the tree and "provides" some shared value or capability to its descendants, without it having to pass through every intermediate level explicitly via props — descendants can consume it directly instead. This is a broader software design concept (related to dependency injection in other ecosystems), not something that originated with, or is exclusive to, React's Context API.

### 🔧 How Context API Implements It
Context API is React's specific, built-in mechanism for implementing this pattern — `<SomeContext.Provider value={...}>` (Context API chapter) is a direct, literal implementation of "provide a value to descendants." In modern React, "Provider Pattern" and "using Context" are usually treated as synonymous in everyday conversation, since Context is the standard way to implement it today.

### 🕰️ The Pattern Existed Before Context, and Can Exist Without It Today
Before Context existed (pre-React 16.3), developers achieved similar results more manually — a single top-level component managing shared state and injecting it into children via `React.cloneElement`, without any Context mechanism at all. And even today, the pattern doesn't strictly require Context: Zustand (State Management chapter, Question 7) doesn't need a wrapping Provider component structurally at all, yet consuming components still get shared data without prop drilling — arguably still an instance of the Provider Pattern's conceptual goal, just achieved through a different mechanism entirely.

### 💡 The Key Distinction: Tool vs. Design Goal
Context API is a tool; the Provider Pattern is the design goal that tool (among others) can be used to achieve. Every use of Context is an instance of the Provider Pattern, but not every instance of the Provider Pattern requires using Context specifically.

### ❓ Follow-up Interview Questions

1. Why is it inaccurate to treat "Provider Pattern" and "Context API" as strictly synonymous?
2. How was provider-like behavior achieved before Context API existed?
3. Why might using Zustand still count as an instance of the Provider Pattern, despite not using a Context Provider?
4. What's the relationship between a design pattern and the specific tool used to implement it, in general?
5. Give an example of the Provider Pattern's goal being achieved without using React's Context API at all.

---

## 6. What is the Compound Component pattern, and what real-world use cases make it valuable?

### 📖 Introduction
Where Custom Hooks (Question 4) solve sharing logic, Compound Components solve a different problem entirely: building a flexible, composable component *API*, without the parent needing a giant prop surface to support every possible arrangement.

### 🧩 What Compound Components Actually Are
A set of components designed to work together, sharing implicit state via Context internally, while letting the consumer control the actual structure and arrangement of the pieces:
```jsx
function Tabs({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  return (
    <button onClick={() => setActiveIndex(index)} aria-selected={activeIndex === index}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ index, children }) {
  const { activeIndex } = useContext(TabsContext);
  return activeIndex === index ? <div>{children}</div> : null;
};

<Tabs defaultIndex={0}>
  <Tabs.List>
    <Tabs.Tab index={0}>Profile</Tabs.Tab>
    <Tabs.Tab index={1}>Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>Profile content</Tabs.Panel>
  <Tabs.Panel index={1}>Settings content</Tabs.Panel>
</Tabs>
```
Neither `Tabs.Tab` nor `Tabs.Panel` needs any prop wiring from the consumer connecting them to each other — the shared `activeIndex` flows between them via Context internally.

### 🆚 The Alternative: A Monolithic, Prop-Heavy API
A single `<Tabs tabs={[{label, content}, ...]} />` component taking a data array is rigid — adding a custom icon next to one tab, inserting a divider between two, or conditionally rendering one tab based on business logic becomes awkward without constantly expanding the prop API with more special-case props (`renderIcon`, `dividerAfterIndex`, and so on). The compound version sidesteps this entirely: the consumer just writes whatever JSX structure they want, in whatever order, with whatever extra elements interspersed, since it's ordinary JSX composition rather than a rigid data prop.

### 🏗️ Real-World Use Cases
Custom dropdowns, tabs, accordions (`<Accordion.Item>`), modal/dialog composition (`<Modal.Header>`, `<Modal.Body>`, `<Modal.Footer>`), and form-building libraries all lean on this pattern heavily. It's especially common in design systems and component libraries — Radix UI and similar headless libraries (Question 7) are built extensively on compound components, since a design system needs to support many different consumer layouts without an ever-growing prop surface.

### ⚙️ Mechanically: Context as a Hidden Implementation Detail
This is Context (Context API chapter) used internally as an implementation detail, entirely hidden from the consumer — nobody using `<Tabs>` ever touches `TabsContext` directly. The shared state flows invisibly underneath the JSX the consumer actually writes, which is a genuinely different role for Context than sharing an app's own top-level global state.

### ❓ Follow-up Interview Questions

1. Why does a monolithic `tabs={[...]}` prop-array API become awkward as customization requirements grow?
2. How does `Tabs.Tab` know which tab is currently active without receiving it as a prop from the consumer?
3. Why are compound components especially common in design system and component library code?
4. What would break if a consumer tried to use `Tabs.Tab` outside of a `<Tabs>` parent?
5. Why is Context described as "hidden" in this pattern, compared to how it's typically used for app-level state?

---

## 7. What are Headless Components, and how do they separate logic from presentation?

### 📖 Introduction
Headless Components push the idea from Question 6 further — instead of just letting the consumer control arrangement, they give the consumer control over literally all of the visual markup, providing only behavior.

### 🎭 What Headless Components Actually Are
A component (more often today, a hook) that provides all the behavior, state, and interaction logic for a UI element but renders no visual markup of its own — it returns props, state, and handlers for the consumer to attach to their own markup entirely:
```jsx
function useDisclosure() {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(o => !o),
  };
}

function MyAccordion() {
  const { isOpen, toggle } = useDisclosure();
  return (
    <div className="my-custom-accordion-style">
      <button onClick={toggle}>{isOpen ? "Hide" : "Show"} Details</button>
      {isOpen && <div className="my-custom-panel-style">Details here</div>}
    </div>
  );
}
```

### 🆚 How This Differs From Compound Components
Compound Components (Question 6) still render some markup themselves — `Tabs.List` renders an actual `div` with `role="tablist"`. The consumer controls arrangement, but the sub-components still produce their own output. Headless Components go further: nothing visual is rendered at all, not even a wrapping element — 100% of the DOM and styling belongs entirely to the consumer. It's a more extreme point on the same spectrum of "how much visual control does the consumer get."

### ♿ Why Valuable: Separating Hard-to-Get-Right Logic From Highly-Variable Presentation
The genuine value is separating two things that vary at completely different rates: complex interaction logic (correct ARIA attributes, keyboard navigation, focus management, click-outside detection) that's genuinely easy to get subtly wrong, from visual styling, which varies wildly between apps, brands, and design systems. A headless library lets every consuming team apply an entirely custom visual design while still getting correct, hard-won accessibility and interaction behavior for free — rather than each team re-deriving "how does a dropdown handle arrow-key navigation and focus trapping correctly" from scratch.

### 💎 Good to Know: This Is Why Libraries Like Radix UI, Headless UI, and `downshift` Exist
Getting keyboard navigation and ARIA behavior fully correct across every edge case is genuinely hard and easy to get wrong. These libraries encode years of accumulated correctness work behind a headless API, letting teams focus entirely on visual design without re-solving accessibility from scratch.

### ❓ Follow-up Interview Questions

1. What's the key difference between a Compound Component and a Headless Component in terms of what each actually renders?
2. Why does separating interaction logic from visual styling matter specifically for accessibility?
3. Give an example of interaction behavior that's genuinely easy to get subtly wrong without a headless library.
4. Why might a design system team choose a headless library over building both logic and styling themselves?
5. Is `useDisclosure` in the example above a Custom Hook (Question 4), a Headless Component, or both? Explain.

---

## 8. What is the Controlled vs. Uncontrolled Component pattern, and where does this distinction matter most?

### 📖 Introduction
The Forms chapter already covered this distinction in depth for form inputs specifically. This question widens the lens: the same controlled/uncontrolled idea applies to any component with internal state, not just form fields.

### 🔁 Beyond Forms: The General Controlled/Uncontrolled Distinction
Any component with some "current value" can be designed to support either mode. **Uncontrolled**: the component manages its own state internally, typically seeded by a `default...` prop (`<Accordion defaultOpen={false}>`). **Controlled**: the parent owns the state entirely and passes it down explicitly, with the component just reflecting whatever it's told (`<Accordion isOpen={isOpen} onToggle={setIsOpen}>`).

### 🗂️ Tying to Compound Components: Tabs, Controlled or Uncontrolled
Question 6's `Tabs` example could be designed to support both: an uncontrolled `<Tabs defaultIndex={0}>` manages `activeIndex` internally, while a controlled `<Tabs activeIndex={activeIndex} onChange={setActiveIndex}>` lets the parent decide and track which tab is active — useful, for instance, to keep the active tab synced with a URL query parameter (Routing chapter, Question 5), something the component itself has no way to know about on its own.

### 🛠️ Supporting Both Modes at Once
A common technique used internally by many real component libraries: check whether a controlling prop was actually provided by the consumer, and fall back to internal state if not.
```jsx
function useControllableState({ value, defaultValue, onChange }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  function setValue(next) {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  return [currentValue, setValue];
}
```

### 🎯 Where This Distinction Matters Most
Components that sometimes need to sync with something external — the URL, a parent form's overall state, a sibling component — benefit from supporting controlled mode. Simple, fully self-contained UI state (a tooltip's hover state, most of the time) is fine staying uncontrolled-only, with a simpler API. This matters most in design system and component library code (Questions 6 and 7's framing) specifically, since a library can't predict every future consumer's needs in advance — supporting both modes maximizes flexibility for uses the library author never anticipated.

### ❓ Follow-up Interview Questions

1. How does the controlled/uncontrolled distinction for a `Tabs` component differ from the same distinction for a form input?
2. Walk through what `useControllableState` does when `value` is `undefined` versus when it's provided.
3. Why would a `Tabs` component need to support controlled mode to sync its active tab with a URL parameter?
4. Why is supporting both modes more valuable for design system components than for simple, one-off internal components?
5. What would break if a controlled component still tried to manage its own internal state alongside the parent's?

---

## 9. How do you decide which pattern — HOC, Render Props, Custom Hook, or Compound Component — fits a given problem?

### 📖 Introduction
Question 1 promised this decision framework. The four patterns split cleanly along one primary fork, once it's clear what problem each was actually built to solve.

### 🔀 The Primary Fork: Sharing Logic, or Building a Composable Structure?
The first question to ask: is the goal to share stateful *logic* across components, or to build a flexible *composition API* for a UI widget? Logic-sharing points toward Custom Hooks (Question 4); UI structure and composition flexibility points toward Compound Components (Question 6). HOCs and Render Props both fall into the logic-sharing camp, but are largely legacy today.

### 🪝 Logic-Sharing: Custom Hook, Almost Always, Today
For sharing stateful logic, a Custom Hook is the default answer in modern React, for all the reasons in Question 4 — no wrapper components, no prop collisions, full explicitness.

### 🏚️ When HOCs/Render Props Still Legitimately Show Up
Two honest, narrow cases: working in an older, class-component-heavy codebase where Hooks genuinely aren't an option yet, or integrating with a third-party library already built around one of these patterns (older versions of `react-redux`'s `connect()` is a HOC, for instance) — here, the library's existing API dictates the pattern, not a fresh choice. Render Props occasionally still show up where a component needs full rendering control over per-item output that a hook alone can't provide (a hook returns data, not JSX) — some virtualized-list libraries still expose a render-prop API for this reason, though many now offer a hook-based alternative alongside it.

### 🧩 Structure-Sharing: Compound Component vs. Headless
Once the goal is a composable UI structure rather than shared logic, the remaining choice is really a spectrum of how much markup the pattern itself provides: Compound Components (Question 6) ship some default markup and behavior alongside the flexible composition; Headless Components (Question 7) provide zero markup, handing back only behavior for the consumer to attach to fully custom markup. Which one fits depends on how much visual control the consumer actually needs.

### 💎 Good to Know: A Simple Flowchart
Need to share stateful logic across components? → Custom Hook by default, HOC/Render Props only under legacy constraints. Need a flexible composition API for a UI widget? → Compound Component if some built-in markup is acceptable, Headless if the consumer needs full control over every pixel.

### ❓ Follow-up Interview Questions

1. What's the first question to ask before choosing among these four patterns?
2. Under what specific circumstance would choosing a HOC today still be reasonable?
3. Why can't a Custom Hook alone fully replace what a Render Props component provides in a virtualized list scenario?
4. What determines whether Compound Components or Headless Components is the better fit for a given UI widget?
5. If a legacy codebase's third-party library dictates a HOC-based API, does that count as "choosing" the HOC pattern? Why or why not?

---

## 10. What are the trade-offs between these different React design patterns?

### 📖 Introduction
Question 9 was about which pattern to pick. This is different: a side-by-side comparison across specific axes, rather than restating each pattern's individual pros and cons already covered in Questions 2 through 8.

### 📖 Readability and Explicitness
Custom Hooks are the most explicit — a destructured return value shows exactly what a component receives (Question 4). Render Props are explicit too, but nested (Question 3). Compound Components are implicit under the hood (Context flows invisibly, Question 6) but conventional and predictable once the pattern is recognized. HOCs are the least explicit — injected props are invisible at the consuming component's call site (Question 2).

### 🔍 Debuggability: What Shows Up in the Component Tree
Custom Hooks and Compound Components both keep the DevTools tree clean — neither adds extra wrapper nodes beyond what's already written in JSX. Render Props at least keep their nesting visible in the tree, even if deeply indented. HOCs fare worst here — wrapper hell (Question 2) clutters the tree with layered wrapper names.

### 🧱 Composability: Can You Stack Multiple Instances Cleanly?
This is where Hooks decisively win for logic-sharing: hooks calling other hooks is ordinary function composition, and combines cleanly no matter how many are layered. Render Props and HOCs both compound poorly — nesting multiple render props or wrapping multiple HOCs both degrade readability fast (Questions 2 and 3), which is a large part of why the ecosystem moved away from both once Hooks existed.

### 🎨 Output Flexibility: Not All Patterns Even Compete on This Axis
This one deserves an honest caveat: Compound Components and Headless Components are explicitly about giving the consumer control over rendered output/structure, with Headless taking that further than Compound (Question 7). Custom Hooks, HOCs, and Render Props aren't primarily about output flexibility at all — a hook returns data, not markup. Comparing them on this specific axis isn't quite apples-to-apples, since they were built to solve a different problem entirely.

### 📚 Learning Curve for a New Team Member
Custom Hooks have the lowest learning curve — "just a function" is immediately familiar to any JavaScript developer. Compound Components are simple to *use* but require understanding the implicit Context wiring underneath to debug or extend. HOCs and Render Props both require understanding a less common structural convention, with HOCs additionally requiring an understanding of the invisible prop-injection mechanism to debug effectively.

### 💎 Good to Know: This Is Why Hooks Won for Logic-Sharing
Looking across these axes together explains Question 4's outcome directly: Custom Hooks score well on readability, debuggability, and composability simultaneously — HOCs and Render Props each have at least one of these as a genuine weak point, which is exactly why Hooks displaced them for sharing logic specifically, while Compound/Headless Components remain relevant for a genuinely different problem neither Hooks nor the older patterns were built to solve.

### ❓ Follow-up Interview Questions

1. Why do Custom Hooks score well on composability while HOCs and Render Props both score poorly?
2. Why isn't "output flexibility" a fair axis to compare Custom Hooks against Compound Components on?
3. What specifically makes a Compound Component harder to debug than a Custom Hook, despite both keeping the DevTools tree clean?
4. Which single axis best explains why the ecosystem moved away from HOCs and Render Props for logic-sharing?
5. Why might a pattern with excellent output flexibility (like Headless Components) score differently on "learning curve" than one might expect?

---

## 11. How would you design a reusable component library or design system using these patterns together?

### 📖 Introduction
Questions 9 and 10 treated these patterns as alternatives to choose between. In real design system code, several of them typically get layered together in a single component. Here's a concrete `<Select>` component showing how.

### 🏗️ Layer 1: A Headless Hook as the Foundation
All the genuinely hard-to-get-right behavior — open/close state, arrow-key navigation, Enter to select, Escape to close, click-outside detection, correct ARIA attributes — lives in a headless hook, `useSelect()` (Question 7). This is the foundation: zero opinion about markup, all the interaction logic.

### 🧩 Layer 2: Compound Components Built on Top, With Sane Defaults
`<Select>`, `<Select.Trigger>`, `<Select.Options>`, and `<Select.Option>` (Question 6) are built on top of `useSelect()`, sharing its state via Context internally (Question 5's Provider Pattern) and providing default, ready-to-use markup that most consumers can use directly with no customization needed.

### 🎛️ Layer 3: Controlled/Uncontrolled Support for External Sync
The top-level `<Select>` supports both an uncontrolled `defaultValue` and a controlled `value`/`onChange`, using the `useControllableState` pattern from Question 8 — so a consumer who needs to sync the selection with a form library or a URL parameter can, while a simpler consumer just uses uncontrolled mode without thinking about it.

### 🪝 Layer 4: Exporting the Headless Hook Directly, for Power Users
The library can also export `useSelect()` itself, letting a rare consumer who needs fully custom markup skip the Compound Component layer entirely and build their own presentation directly on the headless hook. This single piece of underlying logic now serves three distinct levels of need: "just give me a working `Select`" (use the compound components as-is), "I need custom markup but want the built-in interaction logic" (use `useSelect()` directly), and "I need to sync selection with my own external state" (use the compound components in controlled mode).

### 🔁 Consistency Across the Whole Library
The real payoff at design-system scale: every component in the library follows this same internal architecture — headless hook, Context, compound sub-components, controllable state. Once a developer learns one component's internals, they can predict and extend any other component in the library the same way. This is Question 1's "shared vocabulary and predictability" argument, now applied at the scale of an entire library's internal consistency, not just one component's design.

### ❓ Follow-up Interview Questions

1. Why does putting the interaction logic in a headless hook first, before building Compound Components on top, make sense architecturally?
2. What three distinct consumer needs does this layered `<Select>` design serve simultaneously?
3. Why does exporting `useSelect()` directly matter, even though most consumers will just use `<Select>` as-is?
4. How does controllable state (Question 8) fit into this layered design specifically?
5. Why does architectural consistency across every component in a design system matter more as the library grows?

---

## 12. How would you migrate a codebase from Higher-Order Components to Custom Hooks?

### 📖 Introduction
Unlike some migrations covered elsewhere in this guide (Context to Zustand, State Management chapter Question 12, where a facade pattern avoided touching consumers), this one is more invasive by nature — the actual interface changes from prop injection to a hook call, and there's no shortcut around updating every consumer.

### 🔍 Step 1: Separate the Shared Logic From the Wrapping Mechanism
A HOC tangles two things together: the actual stateful logic, and the wrapping mechanism that returns a new component and injects props. Migrating means extracting the logic and discarding the wrapper entirely, since hooks need no wrapping mechanism at all.
```jsx
// Before — HOC
function withWindowSize(WrappedComponent) {
  return function WithWindowSize(props) {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    useEffect(() => {
      function handleResize() {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return <WrappedComponent {...props} windowSize={size} />;
  };
}
```

### ✂️ Step 2: Extract the Logic Into a Hook, Discard the Wrapper
```jsx
// After — Custom Hook, the same logic, no wrapping component needed
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}
```

### 🔄 Step 3: Update Every Consuming Component
```jsx
// Before
const MyComponentWithSize = withWindowSize(MyComponent);
function MyComponent({ windowSize }) { /* uses windowSize */ }

// After
function MyComponent() {
  const windowSize = useWindowSize(); // called directly
  /* uses windowSize */
}
```
Every component that was wrapped with `withWindowSize` needs this change individually — there's no facade shortcut here, since the interface itself is genuinely different (an injected prop versus a called hook), unlike migrations where the consuming interface could stay identical.

### 🐢 Step 4: Migrate Incrementally, Highest-Pain HOC First
Since HOCs and Hooks can coexist during a transition, there's no need for a big-bang rewrite. Convert whichever HOC is most widely used or most painful first (mirroring the Routing chapter's Question 12 "highest-pain domain first" principle), verify it, then move to the next.

### 🧅 Step 5: Stacked HOCs Become Flat Hook Calls
This is the payoff for a component previously wrapped in several HOCs:
```jsx
function MyComponent() {
  const auth = useAuth();
  const theme = useTheme();
  const windowSize = useWindowSize();
  // ...
}
```
Three stacked HOCs — wrapper hell (Question 2) — become three flat, readable hook calls with zero nesting cost, exactly where Question 10's composability axis pays off concretely.

### ❓ Follow-up Interview Questions

1. Why can't this migration reuse a facade-style shortcut the way the Context-to-Zustand migration could?
2. What are the two tangled responsibilities inside a typical HOC, and which one survives the migration?
3. Why is migrating the highest-pain HOC first preferable to migrating alphabetically or by ease?
4. Why can HOCs and Hooks coexist during a transition period without breaking anything?
5. How does migrating away from three stacked HOCs concretely demonstrate Question 10's composability comparison?

---

## 13. What challenges arise when combining multiple patterns in one large application?

### 📖 Introduction
Question 11 showed patterns composing well within a single, deliberately layered component. Across a whole large application, with many teams and features, combining patterns introduces different, more organizational challenges.

### 🧭 Inconsistent Pattern Choices Across Teams
Without a shared convention, different teams end up solving the same kind of problem with different patterns — one team HOC-gating auth, another using a custom hook, another using render props for the same conceptual need. This directly undermines Question 1's predictability argument: there's no longer a reliable "if I've seen this solved once, I know how it's solved everywhere" — each instance has to be understood on its own.

### 🌗 Old and New Patterns Coexisting Mid-Migration
A codebase partway through a HOC-to-Hook migration (Question 12) genuinely confuses a new developer who doesn't know the migration's history — "why does this component use a HOC but that one uses a hook for the same kind of thing?" Without clear documentation of what's mid-migration versus deliberately chosen, it's ambiguous whether the HOC-based code is legacy being phased out or an intentional exception.

### 🎈 Over-Engineering: Flexibility Where None Is Needed
Compound Components and Headless Components (Questions 6 and 7) earn their complexity in design-system-grade components consumed in many unknown ways. Applying that same level of abstraction to a one-off, single-use internal component adds real complexity for no actual benefit — the same "doesn't need to earn its place" lesson from the State Management chapter's Question 9, applied here to pattern choice instead of state scope.

### ⚡ Performance Interactions Between Stacked Patterns
Layering patterns (Question 11's headless hook + Compound Component + controllable state) means each layer needs its own correct memoization discipline (Performance Optimization chapter) — a Context used internally by a Compound Component, read carelessly by a Custom Hook without proper memoization, reintroduces the same unnecessary-re-render problems covered in the Context API and Performance chapters. Patterns don't automatically solve performance; stacking several without care can make it worse than a simpler, single-layer implementation would have been.

### 🧪 More Moving Parts, More Test Surface Area
A component built from several layered patterns has genuinely more to test in isolation — the headless hook alone, the compound component's default rendering, both controlled and uncontrolled modes separately. This is a real cost of the flexibility Question 11's architecture provides, worth weighing deliberately rather than assumed to be free.

### ❓ Follow-up Interview Questions

1. Why does inconsistent pattern choice across teams undermine the predictability benefit from Question 1?
2. What problem specifically arises from a codebase being mid-migration between two patterns for the same kind of problem?
3. Give an example of applying Compound Components where a simple, single-use component would have been the better choice.
4. Why doesn't layering multiple patterns together automatically guarantee good performance?
5. How does test surface area change when a component is built from several layered patterns instead of one simple implementation?

---

## 14. How have React's idiomatic patterns evolved from HOCs and Render Props to Hooks, and why?

### 📖 Introduction
This closing question ties Questions 2 through 4 into one historical narrative — not just what each pattern did, but why each one gave way to the next, and one predecessor even older than HOCs worth knowing about.

### 🧬 The Forgotten Ancestor: Mixins
Before HOCs, React's earliest logic-sharing mechanism (in the `React.createClass` era, predating ES6 classes) was mixins — merging shared methods and lifecycle hooks directly into a component's own prototype. They were abandoned because two mixins could define the same lifecycle method with no clear merge order, and there was no way to trace where a given piece of behavior actually came from just by reading the component. This is genuinely the first appearance of a problem that would resurface in new forms at every subsequent stage: implicit behavior with unclear origin.

### 🔄 HOCs: Composition Instead of Mixing, New Problems in New Clothing
HOCs (Question 2) fixed mixins' core issue by using composition — wrapping, rather than merging into the prototype. But the same underlying tension resurfaced in a different shape: prop collisions instead of method collisions, wrapper hell instead of prototype pollution. Sharing logic without corrupting the consuming component's own identity kept being the actual problem, just wearing different clothes.

### 🔍 Render Props: Solving Opacity, at the Cost of Nesting
Render Props (Question 3) fixed HOC's opacity — data flow became explicit, visible as function arguments right at the call site. But this traded one cost for another: nesting and callback hell. Each generation solved one axis of the problem while introducing a new cost on a different axis.

### 🪝 Hooks: Not Just a Nicer API — an Architectural Shift
Hooks (Question 4) finally resolved the underlying tension by changing the shape of the solution entirely, rather than finding a better way to wrap or nest components — the shape both HOCs and Render Props shared. This wasn't purely a better idea arriving sooner; it required a genuine architectural change first. Hooks depend on the order of hook calls within a function component staying stable across renders, tied to that component's underlying Fiber node (Rendering & Reconciliation chapter) — a capability that simply didn't exist in earlier versions of React's architecture.

### 💎 Good to Know: Pattern Evolution Is Gated by Runtime Architecture, Not Just Ideas
The satisfying takeaway: Hooks weren't invented the moment someone had a nicer idea — they became possible once Fiber's architecture existed to support them. Pattern evolution in React has been shaped as much by what the underlying runtime could support at each point in time as by which idea was cleverest.

### ❓ Follow-up Interview Questions

1. What specific problem did mixins have that HOCs also inherited in a different form?
2. Why is "prop collisions vs. method collisions" described as the same underlying tension recurring, not a new problem?
3. What did Render Props solve that HOCs didn't, and what did it cost in exchange?
4. Why couldn't Hooks have existed as just an API change without Fiber's architecture?
5. What does this history suggest about how to evaluate a "new" React pattern that emerges in the future?

---