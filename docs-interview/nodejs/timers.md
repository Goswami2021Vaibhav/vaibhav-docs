---
title: Timers
description: setTimeout, setInterval, and setImmediate — and how they fit the event loop.
sidebar_position: 9
---

# Timers

## 1. What is the purpose of `setTimeout()`, `setInterval()`, and `setImmediate()`?

### 📖 Introduction

The Event Loop chapter already covered the deeper mechanics of exactly when each of these callbacks runs relative to the Event Loop's phases. This chapter builds on that foundation with the practical, everyday API details — what each function is actually for, and how to use it correctly.

### ⏰ `setTimeout(callback, delay, ...args)`

Schedules a callback to run once, after at least the specified delay, in milliseconds, has elapsed. That delay is a minimum, not a guarantee — as the Event Loop chapter explained, the callback can only run once the Call Stack is empty and the timers phase is actually reached, so real execution can be pushed later under load. Common uses include debouncing, delaying an action, or racing a Promise against a timeout.

### 🔁 `setInterval(callback, delay, ...args)`

Schedules a callback to run repeatedly, once every `delay` milliseconds, until explicitly stopped with `clearInterval()`. Common uses include polling, periodic health checks, and periodic cleanup tasks. Node.js's `setInterval` waits for the current invocation to finish before scheduling the next one — it doesn't let multiple invocations overlap — though delay can still accumulate if a callback consistently takes longer to run than the interval itself.

### ⚡ `setImmediate(callback, ...args)`

Schedules a callback to run once, specifically during the check phase of the current Event Loop iteration — immediately after the poll phase completes, ahead of timers scheduled for a future loop iteration. It's commonly used to defer execution just enough to let currently pending I/O callbacks run first, without relying on an arbitrary delay value to approximate that timing.

### 💎 Good to Know: All Three Can Be Canceled

`setTimeout`, `setInterval`, and `setImmediate` all return a handle that can be passed to `clearTimeout()`, `clearInterval()`, or `clearImmediate()` respectively. Canceling unneeded timers matters for cleanup — a dangling `setInterval`, in particular, counts as an open handle that can keep a process alive indefinitely, exactly the kind of situation covered in the Node.js Architecture chapter's discussion of what keeps a process running.

### ❓ Follow-up Interview Questions

1. Why is a `setTimeout` delay described as a minimum rather than a guarantee?
2. What would happen if a `setInterval` callback consistently took longer to execute than the interval itself?
3. Why might `setImmediate()` be preferred over `setTimeout(fn, 0)` when the goal is running something right after I/O completes?
4. What could go wrong in a long-running application that never calls `clearInterval()` on a timer it no longer needs?
5. How would you use `setTimeout` to implement a timeout for a Promise that might never resolve?

---

## 2. What is `process.nextTick()`, and how is it different from the other timer functions?

### 📖 Introduction

`process.nextTick()` gets grouped with timers in casual conversation, but it isn't actually a timer at all in the sense that `setTimeout`, `setInterval`, and `setImmediate` are.

### 🔬 What `process.nextTick()` Actually Is

`process.nextTick(callback, ...args)` schedules a callback to run before the Event Loop is allowed to proceed to any further phase. Unlike the other three functions, which are tied to specific Event Loop phases as covered in the Event Loop chapter, `process.nextTick()` is part of the microtask mechanism — alongside Promise callbacks — and it runs even before Promise microtasks specifically.

### 🆚 How It Differs From the Other Three

`setTimeout`, `setInterval`, and `setImmediate` are tied to specific phases — the timers phase and the check phase — and their callbacks can only run once the Event Loop actually reaches that phase. `process.nextTick()` callbacks run at the end of the current operation, before the Event Loop proceeds to its next phase at all, which means a `nextTick` callback always runs sooner than any `setTimeout` or `setImmediate` callback scheduled around the same time, regardless of how small a delay was given to those.

### 🥇 Priority Relative to Promises

`process.nextTick()`'s queue is drained completely before the Promise microtask queue even begins draining — a nuance the Event Loop chapter touched on and worth restating precisely: a `process.nextTick()` callback runs before a `.then()` callback scheduled around the same time, even though both are loosely described as "microtasks."

### 🛠️ A Common Use Case

`process.nextTick()` is often used to guarantee a callback runs asynchronously — deferred to "later," but still before any I/O — even when the underlying operation was actually completed synchronously. This maintains a consistent API contract, so a callback doesn't sometimes run synchronously and sometimes asynchronously depending on an internal implementation detail, which would otherwise surprise API consumers.

### 💎 Good to Know: Recursive `nextTick` Calls Can Starve the Event Loop

Because `nextTick` callbacks are drained so eagerly and completely, recursively scheduling new `process.nextTick()` calls from within a `nextTick` callback can starve the Event Loop entirely, preventing I/O and timers from ever running — exactly the starvation risk the Event Loop chapter warned about for microtasks generally. This is precisely why `process.nextTick()` is a special-purpose tool, not a general-purpose "run this asynchronously" mechanism.

### ❓ Follow-up Interview Questions

1. Why does a `process.nextTick()` callback run before a `.then()` callback scheduled at the same moment?
2. Why is `process.nextTick()` not considered one of the Event Loop's phase-based timers?
3. What real problem does using `process.nextTick()` solve when an API sometimes resolves synchronously and sometimes asynchronously?
4. What would happen to a Node.js application if a piece of code recursively scheduled `process.nextTick()` calls forever?
5. Why might a developer mistakenly assume `process.nextTick()` behaves like `setImmediate()`?

---

## 3. What is the difference between `setTimeout()` and `setImmediate()`?

### 📖 Introduction

This specific comparison is one of the most commonly asked Node.js interview questions, precisely because the correct answer depends on where in the code these two functions are actually called from.

### 🔄 Different Phases

`setTimeout`'s callback runs during the timers phase, once its delay has elapsed and that phase is reached. `setImmediate`'s callback runs during the check phase, which comes right after the poll phase in the same loop iteration. These are simply different points in the same repeating cycle covered in the Event Loop chapter.

### 🎲 At the Top Level: Non-Deterministic Ordering

Calling `setTimeout(fn, 0)` and `setImmediate(fn)` from a script's top level, outside any I/O callback, produces non-deterministic ordering between the two — which one actually runs first can vary from run to run, depending on subtle timing details like how quickly the process reaches the timers phase in that particular run.

### ✅ Inside an I/O Callback: Deterministic Ordering

Called from inside an I/O callback, such as an `fs.readFile()` callback, `setImmediate()` is always guaranteed to run before a `setTimeout(fn, 0)` scheduled at that same point. This is because once an I/O callback finishes during the poll phase, the Event Loop moves directly to the check phase next — where `setImmediate`'s callback is waiting — before looping back around to the timers phase on the following iteration.

### 💎 Good to Know: The Practical Guidance

If the goal is to guarantee "run this right after I/O has been processed, but before any further timers," using `setImmediate()` specifically from within an I/O callback gives a far more reliable guarantee than `setTimeout(fn, 0)` does. This ordering nuance — deterministic only inside I/O callbacks, non-deterministic at the top level — is a favorite interview question precisely because it requires understanding the actual phase-based model rather than just memorizing "setImmediate runs immediately."

### ❓ Follow-up Interview Questions

1. Why is the ordering between `setTimeout(fn, 0)` and `setImmediate(fn)` non-deterministic at a script's top level?
2. Why does that same ordering become deterministic when both are called from inside an I/O callback?
3. What's actually happening in the Event Loop between the poll phase finishing and the check phase beginning?
4. Why might a test that relies on `setTimeout` vs. `setImmediate` ordering at the top level be flaky?
5. How would you rewrite code relying on `setTimeout(fn, 0)` inside an I/O callback to get a more deterministic guarantee?

---

## 4. What is the difference between `process.nextTick()` and `setImmediate()`?

### 📖 Introduction

Unlike the `setTimeout`-versus-`setImmediate` comparison covered earlier in this chapter, this one has a fully deterministic answer regardless of where either function is called from.

### 🥇 The Core Distinction

`process.nextTick()` is a microtask, drained immediately after the current operation finishes, before the Event Loop proceeds to any phase at all. `setImmediate()` is tied specifically to the check phase, as covered earlier in this chapter. This means a `process.nextTick()` callback always runs before a `setImmediate()` callback, regardless of whether either is called at the top level or inside an I/O callback — unlike the ordering ambiguity between `setTimeout` and `setImmediate` covered earlier.

### 🧪 A Concrete Comparison

```js
process.nextTick(() => console.log('a'));
setImmediate(() => console.log('b'));
```

This always logs `'a'` before `'b'`, with no ambiguity, regardless of where in the code it runs — a meaningfully stronger guarantee than the `setTimeout`/`setImmediate` comparison discussed earlier in this chapter.

### 🏷️ Why the Names Are Mildly Misleading

"`process.nextTick`" sounds like it should run on the next full iteration of the Event Loop, which would suggest behavior similar to `setImmediate()` — but it actually runs before the current iteration even finishes. "`setImmediate`" sounds like it should run synchronously, right away — but it's actually deferred to the next check phase. Both names are, in a sense, a little misleading relative to their precise actual behavior, which is exactly why developers who go purely off the names tend to get the ordering wrong.

### 💎 Good to Know: `setImmediate` Doesn't Carry the Same Starvation Risk

Because `setImmediate()` is tied to an actual Event Loop phase, it naturally lets the loop progress through poll and check each iteration, rather than draining an unbounded queue before any phase transition can happen at all. `process.nextTick()`, drained so eagerly, carries a real starvation risk if overused recursively, as covered earlier in this chapter — `setImmediate()` doesn't have that same failure mode.

### ❓ Follow-up Interview Questions

1. Why is the ordering between `process.nextTick()` and `setImmediate()` always deterministic, unlike `setTimeout` versus `setImmediate`?
2. Why do the names "nextTick" and "setImmediate" arguably describe the opposite of what each function actually does?
3. When would `setImmediate()` be the more appropriate choice over `process.nextTick()`?
4. Why doesn't recursively scheduling `setImmediate()` calls starve the Event Loop the way recursive `process.nextTick()` calls can?
5. How would you explain the difference between these two to someone who's only ever used `setTimeout`?

---

## 5. Why does `process.nextTick()` execute before Promise callbacks and other timers?

### 📖 Introduction

This ordering — `process.nextTick()`, then Promise microtasks, then phase-based timers — is one of the most precisely tested pieces of Node.js trivia in interviews, and it has a genuine historical reason behind it.

### 🕰️ The Historical Reason

`process.nextTick()` actually predates Promises being part of the JavaScript language at all — it was Node.js's original mechanism for deferring a callback to run asynchronously, but as soon as possible, before Promises existed as a language feature. When Promises and their microtask queue were later added to the language, Node.js had to decide how its already-existing `nextTick` mechanism should relate to this new queue, and the choice made was to keep `nextTick`'s priority higher, preserving its original "runs before anything else" guarantee for existing code and APIs that already depended on it.

### 🔢 Why It Also Runs Before Phase-Based Timers

`setTimeout` and `setImmediate` are tied to specific Event Loop phases that only get processed once the Event Loop actually moves into that phase — which only happens after both the `nextTick` queue and the Promise microtask queue have been fully drained following the current operation. By definition, anything in either microtask queue runs strictly before the Event Loop can even reach a phase-based timer callback.

### 🧪 A Concrete Example Combining All Three

```js
setTimeout(() => console.log('timeout'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
```

This logs, in order: `'nextTick'`, `'promise'`, `'timeout'` — demonstrating the full priority ordering in a single example.

### 💎 Good to Know: This Question Tests Whether Several Pieces Are Assembled Correctly

Getting this exact ordering right requires correctly combining the Event Loop chapter's phase model, `process.nextTick()`'s microtask behavior, and Promise microtask behavior — not just knowing any one of these pieces in isolation. That's exactly why it's such a popular precise-ordering interview question.

### ❓ Follow-up Interview Questions

1. Why does `process.nextTick()`'s priority over Promise microtasks trace back to historical rather than purely technical reasons?
2. What would the output order be if the `process.nextTick()` call in the example above were removed entirely?
3. Why can't a `setTimeout` callback run before the Promise microtask queue has been fully drained?
4. How would you explain this whole ordering to someone who's only ever heard "microtasks run before macrotasks"?
5. Why is `process.nextTick()` sometimes described as "not really a microtask" despite behaving similarly to one?

---

## 6. How do timers fit into the Event Loop's phases?

### 📖 Introduction

This question is the capstone for this chapter — placing every timer function covered so far precisely within the same six-phase model the Event Loop chapter established.

### 🗺️ Where Each Timer Function Actually Lives

`setTimeout` and `setInterval` callbacks are processed during the timers phase — the very first phase in each Event Loop iteration — which checks all scheduled timers to see whether their delay has elapsed, running any that are due, in ascending order of when they became due. `setImmediate` callbacks are processed during the check phase, which comes after the poll phase in that same iteration, as covered earlier in this chapter. `process.nextTick()` and Promise callbacks aren't tied to any phase at all — they're drained between every phase transition, and even between individual callbacks within a phase, as covered in the previous question and in the Event Loop chapter.

### ⏱️ Why Timers Get Their Own Dedicated First Phase

Time-based scheduling is a fundamentally different kind of "readiness" check than I/O completion, checked during poll, or "run right after this iteration's I/O," checked during check. The Event Loop needs a dedicated point where it specifically asks "which timers are due right now," independent of whatever I/O may or may not currently be ready.

### 🔗 The Interaction With the Poll Phase

If there's no I/O ready to process and nothing scheduled via `setImmediate`, the poll phase can pause briefly, waiting for new I/O events to arrive. It won't pause indefinitely, though, if a timer is due soon — the poll phase's waiting is bounded by how much time remains until the next scheduled timer, ensuring timers still fire reasonably close to on time even during an otherwise quiet period.

### 💎 Good to Know: This Bounded Wait Is What Keeps Timers Reliable During Idle Periods

This specific detail — the poll phase's blocking bounded by the next timer's due time — is a genuinely subtle, senior-level point. It explains why a timer doesn't get arbitrarily delayed during a quiet stretch with little I/O happening: the Event Loop is specifically designed to still respect an approaching timer deadline rather than waiting indefinitely for I/O that may never arrive.

### ❓ Follow-up Interview Questions

1. Why does the timers phase run first in each Event Loop iteration, rather than last?
2. What would happen to a `setTimeout` callback's timing if the poll phase were allowed to block indefinitely regardless of upcoming timers?
3. Why is `process.nextTick()` described as not belonging to any phase, when `setTimeout` and `setImmediate` clearly do?
4. How would you explain to someone why `setImmediate()` runs before `setTimeout(fn, 0)` when both are called inside an I/O callback?
5. Why does understanding this phase model matter more for debugging timing bugs than just memorizing which function does what?

---