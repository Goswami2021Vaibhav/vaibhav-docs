---
title: Event Loop
description: Node's event loop phases, and how they differ from the browser's.
sidebar_position: 4
---

# Event Loop

## 1. What is the Event Loop, and why is it important in Node.js?

### 📖 Introduction

The Event Loop has come up repeatedly already in this guide as the thing that ties V8's execution together with libuv's non-blocking I/O. This chapter gives it the focused, detailed treatment it deserves as a topic in its own right.

### 🔁 What the Event Loop Actually Is

The Event Loop is the mechanism, implemented by libuv, that continuously checks whether there's any pending work — a completed I/O callback, an expired timer, a queued microtask — and, when there is, executes the corresponding JavaScript callback. When there's genuinely nothing to do, it waits efficiently rather than busy-spinning, and this entire cycle repeats for the lifetime of the process.

### 🎯 Why It's Important

The Event Loop is the actual reason Node.js can behave in a non-blocking way despite executing JavaScript on a single thread. Without it, a script's synchronous code would run once, and there would be no mechanism left to pick up results from I/O operations completing in the background — nothing would ever happen after that first pass. The Event Loop is what turns V8 executing JavaScript and libuv handling I/O into one continuously running system, capable of responding to new events indefinitely.

### 💎 Good to Know: It's a Precisely Defined Sequence, Not a Vague Concept

It's easy to think of "the Event Loop" as some abstract background process, but it's actually a concretely defined, ordered sequence of phases that runs the same way every single time, deterministically. Understanding those phases precisely — covered later in this chapter — is what separates a surface-level answer from a genuinely deep one, and this exact distinction comes up constantly in interviews on this topic.

### ❓ Follow-up Interview Questions

1. Why can't Node.js achieve non-blocking behavior with V8 and libuv alone, without something coordinating between them?
2. What does it mean for the Event Loop to "wait efficiently" instead of busy-spinning when there's no work to do?
3. Is the Event Loop part of V8, part of libuv, or something separate from both?
4. Why does the Event Loop's behavior need to be deterministic rather than just "roughly" predictable?
5. What would you expect to observe in a Node.js process that has no pending work left for the Event Loop to process?

---

## 2. What is the Call Stack, and how does it relate to the Event Loop?

### 📖 Introduction

The Event Loop doesn't run JavaScript callbacks directly out of thin air — it hands them to the same mechanism every JavaScript engine uses to execute any function at all: the Call Stack.

### 📚 What the Call Stack Is

The Call Stack is how JavaScript engines, V8 included, track function calls. Each time a function is invoked, a new frame is pushed onto the stack; when that function returns, its frame is popped back off. It's a last-in, first-out structure, and this behavior has nothing specific to do with Node.js — it's how function calls work in any language built this way.

### 🔗 How It Relates to the Event Loop

Every phase of the Event Loop's job comes down to the same basic action: looking at various queues, and for anything ready to run, pushing the corresponding callback function onto the Call Stack so it actually executes. Critically, the Event Loop can only push a new callback onto the stack once the stack is completely empty — meaning all currently running synchronous code has fully finished. A long-running synchronous function keeps the Call Stack occupied, which means the Event Loop cannot push any new callback onto it, effectively blocking everything else — this is precisely the mechanism behind "blocking the Event Loop," a phrase used throughout this guide.

### 🧪 A Concrete Example

```js
console.log('a');
setTimeout(() => console.log('b'), 0);
console.log('c');
```

This logs `a`, then `c`, then `b` — even with a `0`ms delay, the timer's callback can only run once the Call Stack is empty. Since the synchronous code logging `'a'` and `'c'` is still running when the timer is scheduled, `'c'` logs before the Call Stack ever becomes free enough for the timer's callback to run.

### 💎 Good to Know: Two Ways of Describing the Same Phenomenon

"Blocking the Event Loop" and "the Call Stack never becoming empty" are describing the exact same underlying mechanism from two different angles. Being able to articulate that connection precisely is a genuinely useful signal in an interview — it shows an understanding of the actual mechanism rather than just a memorized phrase.

### ❓ Follow-up Interview Questions

1. Why does a `setTimeout` with a delay of `0` not run its callback immediately, ahead of remaining synchronous code?
2. What would the Call Stack look like at the exact moment a deeply nested function call is executing?
3. Why is "the Call Stack is empty" a precondition the Event Loop must wait for, rather than something it can override?
4. How would you use this concept to explain why a large synchronous loop freezes an entire Node.js server?
5. Is the Call Stack something unique to Node.js, or does it exist in every JavaScript environment?

---

## 3. What are the different phases of the Node.js Event Loop?

### 📖 Introduction

The Event Loop isn't one undifferentiated cycle — it's broken into a specific, ordered set of phases, each responsible for a distinct category of callback.

### 🔄 The Phases, in Order

- **timers** — executes callbacks scheduled by `setTimeout()` and `setInterval()` whose threshold has elapsed.
- **pending callbacks** — executes certain system-level I/O callbacks deferred to the next loop iteration.
- **idle, prepare** — used internally by Node.js itself; not something application code interacts with directly.
- **poll** — retrieves new I/O events and executes most I/O-related callbacks, such as filesystem and network callbacks; if nothing else is scheduled, the loop may pause here waiting for new events to arrive.
- **check** — executes `setImmediate()` callbacks specifically, immediately after the poll phase finishes.
- **close callbacks** — executes callbacks for close events, such as a socket's `'close'` event.

### 🔁 How the Cycle Repeats

The Event Loop cycles through these six phases in order, repeatedly, for as long as the process runs, checking after each pass whether it should exit — because there's no more pending work — or continue to the next cycle.

### 💎 Good to Know: Not Everything Async Lives Inside a Phase

`process.nextTick()` and Promise callbacks are, technically, not part of any of these phases at all — they're drained separately, in between phases and even between individual callbacks within a phase. That's exactly why they run with higher priority than anything scheduled inside timers, poll, or check — a nuance covered in full in the next question and again in the Timers chapter later in this guide.

### ❓ Follow-up Interview Questions

1. Why does `setImmediate()` have its own dedicated phase separate from the timers phase?
2. What kind of work would actually run during the "pending callbacks" phase rather than the "poll" phase?
3. Why might the Event Loop pause and wait during the poll phase instead of immediately moving to the next phase?
4. If `process.nextTick()` isn't part of any phase, when exactly does its callback actually run?
5. What would you expect to happen to a socket's `'close'` event callback if the process exited before the close callbacks phase ran?

---

## 4. What is the difference between the Microtask Queue and the Macrotask Queue?

### 📖 Introduction

The previous question mentioned that `process.nextTick()` and Promise callbacks live outside the Event Loop's phases entirely. This question is about exactly what that means, and why it gives them a genuinely different priority than everything else.

### 🐢 The Macrotask Queue

In Node.js, what's often called the macrotask queue is really the set of callback queues tied to the Event Loop's actual phases — timers, poll (most I/O callbacks), and check (`setImmediate()`). Each phase has its own queue of callbacks belonging to that category of work.

### ⚡ The Microtask Queue

The microtask queue sits at a higher priority and isn't tied to any specific Event Loop phase at all. In Node.js, it's really two related queues: the `process.nextTick()` queue and the Promise microtask queue, which holds callbacks scheduled via `.then()`, `.catch()`, `.finally()`, and `await` continuations.

### 🔑 The Key Behavioral Difference

The microtask queue is drained completely — until it's empty — after every single callback finishes executing, not just once per full Event Loop phase, and this happens before the Event Loop is allowed to move on to the next piece of macrotask work, whether that's the next phase or even the next callback within the same phase. Microtasks effectively cut in line ahead of any pending macrotask work.

### 🧪 A Concrete Example

```js
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
```

This logs `'promise'` before `'timeout'`, because the Promise callback is a microtask, drained before the Event Loop even properly reaches the timers phase, while the `setTimeout` callback is a macrotask tied to that phase.

### 💎 Good to Know: Recursive Microtasks Can Starve the Event Loop

If microtasks keep scheduling more microtasks recursively — a `.then()` that queues another `.then()` indefinitely — this can technically starve the Event Loop's macrotask phases entirely, since the microtask queue must be fully drained before the loop is allowed to proceed. This is a subtle but genuinely real production risk: an unbounded microtask chain can quietly prevent I/O callbacks and timers from ever running.

### ❓ Follow-up Interview Questions

1. Why does a Promise callback run before a `setTimeout(fn, 0)` callback, even though both were scheduled around the same time?
2. What would happen to timer callbacks and I/O callbacks if a piece of code kept recursively scheduling new microtasks forever?
3. Why is the microtask queue drained after every callback, rather than once per full Event Loop cycle?
4. How would you distinguish, from a code snippet alone, whether a given callback will run as a microtask or a macrotask?
5. Why might understanding this distinction matter more in a performance-sensitive application than in a simple script?

---

## 5. What happens internally when `fs.readFile()` is called, in terms of the Event Loop and libuv?

### 📖 Introduction

`fs.readFile()` is one of the clearest, most concrete examples of libuv's thread pool actually doing work, and tracing exactly what happens when it's called ties together several ideas from earlier in this guide.

### 📞 The Call Itself

Application code calls `fs.readFile(path, callback)` — a Node.js runtime API, not a raw system call. Node's internal C++ binding layer receives this call and hands the actual file-reading work off to libuv.

### 🧵 Why the Thread Pool Gets Involved

Most operating systems don't provide a good native asynchronous system call specifically for filesystem operations, unlike networking, which typically has one through epoll, kqueue, or IOCP. Because of this, libuv delegates the work to its internal thread pool — four threads by default — and one of those pool threads performs the actual file read, which is blocking from that thread's own perspective, while the main JavaScript thread stays completely free to keep running other code.

### 🔁 How the Result Gets Back to JavaScript

Once the pool thread's file read completes, libuv is notified and queues the corresponding JavaScript callback into the Event Loop's poll phase — the phase most closely associated with I/O completion callbacks. On the Event Loop's next pass through that phase, it takes the queued callback and pushes it onto the Call Stack, where V8 actually executes it, running the original callback function with the file's contents or an error as arguments.

### 💎 Good to Know: This Path Is Specific to Certain APIs

This thread-pool-based mechanism is specific to APIs that lack good native OS async support — many `fs` methods, some DNS lookups, some crypto operations. It's a genuinely different code path than something like an HTTP request's socket I/O, which typically goes straight through the operating system's native async mechanism without ever touching libuv's thread pool at all — the exact nuance introduced when libuv was first covered in the Node.js Architecture chapter, and `fs.readFile()` is the clearest concrete example of it.

### ❓ Follow-up Interview Questions

1. Why does `fs.readFile()` need libuv's thread pool when a typical network request doesn't?
2. What would happen to other pending `fs.readFile()` calls if all four default thread pool threads were currently busy?
3. At what exact point does the file's actual contents become available to JavaScript code in this whole sequence?
4. Why is the pool thread's file read described as "blocking from that thread's own perspective" rather than just "blocking"?
5. How would increasing the thread pool size change the behavior of an application doing many concurrent `fs` operations?

---

## 6. How do Promises and `async`/`await` integrate with the Event Loop?

### 📖 Introduction

Promises and `async`/`await` are built directly on top of the microtask mechanism covered earlier in this chapter — understanding that connection explains a lot of behavior that otherwise looks like magic.

### 🤝 How Promises Use the Microtask Queue

When a Promise settles — resolves or rejects — any `.then()`, `.catch()`, or `.finally()` callback attached to it doesn't run immediately or synchronously. It gets scheduled as a microtask, to run once the currently executing synchronous code finishes, and before the Event Loop proceeds to its next piece of macrotask work.

### ✨ `async`/`await` as Syntactic Sugar

An `async` function always implicitly returns a Promise, and an `await` expression pauses that function's execution — without blocking the actual thread or the Event Loop — until the awaited Promise settles. Under the hood, this "pausing" is implemented using the exact same Promise and microtask machinery: everything after an `await` is effectively wrapped as a `.then()` continuation, scheduled as a microtask once the awaited value resolves.

### 🔄 A Practical Implication

An `async` function that hits an `await` immediately yields control back to the Event Loop — even for a Promise that's already resolved — allowing other pending microtasks or macrotasks to be considered before that function's execution resumes. `await` isn't pausing time in any literal sense; it's queuing a continuation and stepping aside.

### 💎 Good to Know: Even `await 5` Introduces a Real Delay

Because `await` always yields at least one microtask tick, even when awaiting a value that isn't a Promise at all, chaining many sequential `await` expressions still introduces a small but genuinely non-zero delay compared to equivalent plain synchronous code. This is usually irrelevant, but it's a subtle performance detail worth knowing about in a tight loop doing many sequential awaits.

### ❓ Follow-up Interview Questions

1. Why does code after an `await` not run synchronously, even if the awaited Promise is already resolved by the time `await` is reached?
2. How would you demonstrate that `async`/`await` doesn't block the Event Loop the way a synchronous blocking call would?
3. Why might a loop with many sequential `await` statements be measurably slower than the equivalent synchronous code, even with no actual I/O involved?
4. What's actually happening under the hood when an `async` function's `await` is reached partway through execution?
5. How would you explain to someone new to Node.js why `await somePromise` doesn't literally freeze the rest of the application while it waits?

---

## 7. What is callback hell, and how do Promises/`async`-`await` help avoid it?

### 📖 Introduction

Callback hell was Node.js's original reputation problem, and it's worth understanding exactly what it looked like and why Promises and `async`/`await` became the standard fix rather than just a stylistic preference.

### 🏔️ What Callback Hell Actually Is

Callback hell is what happens when many asynchronous operations are chained together by nesting callbacks inside callbacks, each one waiting for the previous operation to finish before starting the next. Visually, this forms a growing pyramid of indentation, roughly like `readFile(a, (err, data) => { process(data, (err, result) => { writeFile(result, (err) => { ... }) }) })` — a pattern extremely common in early Node.js code before Promises saw wide adoption.

### 🐛 Why It's a Real Problem, Not Just an Aesthetic One

Error handling has to be duplicated at every single nesting level, since each callback needs its own `if (err)` check. Running operations in parallel cleanly becomes awkward, and reasoning about or reusing the overall control flow gets genuinely difficult as more steps get added to the chain.

### ✅ How Promises Help

`.then()` chaining flattens the pyramid into a linear sequence of calls at the same indentation level, and a single `.catch()` at the end of the chain can handle an error from any step along the way, rather than requiring error handling duplicated at every individual level.

### ✅ How `async`/`await` Helps Further

`async`/`await` takes Promise-based code and makes it look like ordinary, top-to-bottom synchronous code, with a single `try`/`catch` wrapping the whole sequence for error handling. This tends to be even more readable than a `.then()` chain, especially once there are several sequential steps or some conditional branching involved.

### 💎 Good to Know: The Problem Was Structural, Not Callbacks Themselves

Callback hell isn't inherent to callbacks as a concept — it's specifically a readability and maintainability problem that emerges from nesting many sequential async operations through callbacks. Well-organized callback code, using named functions instead of deeply nested anonymous ones, can mitigate the problem too, but Promises and `async`/`await` became the standard, language-level solution rather than relying on discipline alone.

### ❓ Follow-up Interview Questions

1. Why does duplicated error handling at every nesting level make callback-based code more error-prone, not just harder to read?
2. How does a single `.catch()` at the end of a Promise chain manage to handle errors from any step earlier in that chain?
3. What specifically makes `async`/`await` code easier to read than an equivalent `.then()` chain?
4. Could well-disciplined callback code avoid the callback hell problem without adopting Promises at all? What would that discipline look like?
5. What happens to error handling in an `async` function if a `try`/`catch` block is missing entirely?

---

## 8. How can blocking the Event Loop affect application performance, and how would you diagnose it in production?

### 📖 Introduction

Event Loop blocking has been referenced as a risk throughout this guide; this question is about its actual production-level consequences and, more practically, how you'd actually catch it happening on a live system.

### 📉 The Performance Consequences

Because a blocking operation occupies the Call Stack completely, the Event Loop can't process any other pending callback — from any phase, or the microtask queue — until it finishes. This means every other in-flight request, timer, and I/O completion is stalled, not just the one that triggered the blocking call. In practice, this shows up as increased latency across the entire application, timers firing late, and in severe cases, health checks or heartbeat mechanisms failing to respond in time, which can cause a load balancer to mark a healthy instance as unhealthy and pull it out of rotation.

### 🔬 How to Diagnose It in Production

- **Event Loop lag monitoring** — measuring the gap between when a callback was scheduled to run and when it actually ran is a direct, quantifiable signal of blocking; a growing lag value is one of the clearest indicators available.
- **Node's built-in profiler or the `perf_hooks` module** — capturing a CPU profile identifies exactly which function calls are consuming the most time on the Call Stack.
- **Dedicated diagnostic tooling**, such as Clinic.js, which visualizes Event Loop delay directly and helps pinpoint the specific blocking code.
- **Attaching Chrome DevTools via the `--inspect` flag** to take CPU snapshots during a period of observed slowness.
- **Correlating request duration outliers with deploy timestamps** in logging or APM tooling, to identify whether a specific code change introduced a new blocking pattern.

### 💎 Good to Know: A Distinctive Symptom Pattern

Because Event Loop blocking affects the entire process rather than a single request, a telltale sign is seeing occasional, very slow responses across many unrelated endpoints, correlated in time rather than by which endpoint was hit. That pattern — slowness clustered by *when* it happens rather than *what* was requested — is a strong signal that the root cause is Event Loop blocking rather than a problem localized to one endpoint's own logic.

### ❓ Follow-up Interview Questions

1. Why would a load balancer potentially remove a healthy Node.js instance from rotation during a period of Event Loop blocking?
2. What's the difference between diagnosing a slow endpoint caused by a slow database query versus one caused by Event Loop blocking?
3. Why is "Event Loop lag" specifically measurable, and what would a monitoring tool actually be timing to calculate it?
4. If slowness is correlated with a specific deploy timestamp, what would that suggest about the root cause?
5. How would you distinguish, in production symptoms alone, between a memory leak and Event Loop blocking?

---

## 9. Explain the complete lifecycle of an asynchronous operation in Node.js.

### 📖 Introduction

Every concept covered separately in this chapter — the Call Stack, the phases, the microtask and macrotask distinction, libuv's role — comes together in this one question, walked through as a single, concrete example.

### ▶️ Starting Synchronously

Picture a request handler for an HTTP server that needs to query a database. When the request arrives, the handler begins executing on the Call Stack — some initial synchronous work runs first, like validating the incoming input.

### 📤 Kicking Off the Async Operation

The handler then calls the database query, an asynchronous operation. This hands the actual work off to libuv — through the OS's native async mechanism for network I/O, as covered earlier in this chapter — and returns a pending Promise immediately. If the handler is an `async` function using `await`, its execution suspends right at that point: its frame comes off the Call Stack, with its continuation registered rather than sitting there waiting.

### 🕰️ The Thread Is Free in the Meantime

With the Call Stack now empty of this handler's work, the Event Loop continues cycling through its phases — servicing other requests' synchronous code, draining the microtask queue after every callback, exactly as covered earlier in this chapter.

### 📥 The Operation Completes

Eventually, the database responds. libuv is notified, and the corresponding callback is queued — for an awaited Promise resolution, this becomes a microtask, scheduled to run at the next available drain point rather than waiting for a specific phase.

### ▶️ Resuming Execution

At that microtask drain point, the Event Loop pushes the callback onto the now-empty Call Stack, and V8 executes it. For the `await`-based handler, this resumes exactly where it left off — continuing its remaining synchronous logic, like formatting the query result and calling something like `res.end()` to send the HTTP response back to the client.

### 🔁 The Cycle Continues

Once that resumed logic finishes, the Call Stack empties again, and the Event Loop carries on to whatever piece of pending work comes next — another request, another operation — repeating this exact cycle indefinitely for the life of the process.

### 💎 Good to Know: This Is Every Concept in This Chapter, Applied at Once

A genuinely senior-level answer to a "walk me through the lifecycle" question isn't a list of separate facts about the Call Stack, phases, and queues — it's precisely this: naming each concept and showing exactly where in the sequence it applies, the way this walkthrough just did.

### ❓ Follow-up Interview Questions

1. At what exact point does the request handler's function frame leave the Call Stack in this example?
2. Why does the database response's callback get treated as a microtask rather than something tied to a specific Event Loop phase?
3. What would change in this walkthrough if the handler used `fs.readFile()` instead of a network-based database query?
4. How would this lifecycle differ if the handler used a plain callback instead of `async`/`await`?
5. If two requests arrive close together, how does the Event Loop decide which one's resumed logic runs first?

---

## 10. How does Node.js achieve concurrency using a single thread?

### 📖 Introduction

The Node.js Architecture chapter already answered this from the OS and libuv angle — epoll, kqueue, and IOCP letting a single thread monitor thousands of sockets at once. This question asks for the same answer from this chapter's angle: how the Call Stack, phases, and queues covered throughout this chapter actually implement that concurrency at the JavaScript level.

### 📎 One Thing on the Call Stack at a Time

The Call Stack only ever holds one thing at a time, and Node.js callbacks are typically short-lived — a request handler quickly delegates any I/O work and returns, popping its frame off the stack almost immediately, and yielding control back to the Event Loop. Because each unit of JavaScript work tends to be brief, the Call Stack rarely stays occupied for long, letting the Event Loop cycle through many different in-flight operations' callbacks in quick succession.

### 🔀 The Illusion of "At Once"

This creates the appearance of many things happening simultaneously, but what's actually happening is rapid, structured interleaving: handle one request's ready callback briefly, hand off any new async work it triggers, immediately move to another request's ready callback, and so on. None of this requires more than one thread, because each individual piece of work done on the JavaScript thread is small and quick — the actual waiting happens off-thread, delegated to libuv and the OS, as covered in the Node.js Architecture chapter and earlier in this one.

### 🎯 A Precise Way to State It

Concurrency in Node.js isn't "doing many things at the exact same instant" — that would be parallelism, requiring multiple threads or cores. It's "efficiently switching between many pending pieces of work, doing a little of each in turn," and the Event Loop's phase-cycling and queue-draining mechanism, covered throughout this chapter, is the literal implementation of that switching.

### 💎 Good to Know: This Is Exactly Why One Slow Callback Breaks the Illusion

If any single callback takes a genuinely long time to run on the Call Stack, the Event Loop can't interleave anything else during that time. The "many things happening at once" illusion collapses immediately into visibly serialized, delayed processing for every other pending piece of work — the same Event Loop blocking problem covered earlier in this chapter.

### ❓ Follow-up Interview Questions

1. Why does describing Node.js's concurrency as "interleaving" rather than "simultaneous execution" matter for understanding its limits?
2. What specifically has to be true about a callback for the Event Loop to interleave it smoothly with other pending work?
3. How does this chapter's Call Stack and phase-based explanation relate to the OS-level epoll/kqueue explanation from the Node.js Architecture chapter?
4. Why does a single long-running callback break the concurrency illusion for every other pending operation, not just delay its own?
5. If concurrency isn't parallelism, what would actually be required to get true parallel execution in a Node.js application?

---

## 11. What are the trade-offs between callbacks, Promises, and `async`/`await`?

### 📖 Introduction

All three of these represent the same underlying idea — reacting to something that finishes later — but each comes with genuinely different trade-offs, and none of them is a strict, always-better replacement for the others.

### 📞 Callbacks

Callbacks require no additional language feature or runtime overhead, work in any JavaScript environment, and offer the simplest possible mental model for a single async operation. They're still the underlying mechanism many low-level and event-based APIs are built on, including `EventEmitter`, covered in its own chapter later in this guide. Their downside is exactly the callback hell problem covered earlier in this chapter for sequential operations, inconsistent error-handling conventions across different APIs, and genuine difficulty composing multiple operations — running things in parallel or racing several operations requires manual bookkeeping.

### 🔗 Promises

Promises flatten sequential chains through `.then()`, unify error handling through a single `.catch()` that can catch a failure from anywhere earlier in the chain, and compose cleanly through `Promise.all()`, `Promise.race()`, and `Promise.allSettled()` for parallel or combined operations. Their downsides are more subtle: the chaining syntax can still feel less natural once branching or loops are involved, and an unhandled rejection was historically a real footgun, though modern Node.js versions now warn loudly — or crash — by default when one occurs.

### ✨ `async`/`await`

`async`/`await` reads like ordinary synchronous code, making sequential async logic — including branches, loops, and error handling through a plain `try`/`catch` — considerably easier to follow. Its downside is that it's easy to accidentally introduce an unnecessary waterfall by sequentially awaiting several genuinely independent operations one at a time, instead of using `Promise.all()` to run them concurrently, since the syntax doesn't visually distinguish "this must happen after that" from "this just happens to be written after that." It's also worth remembering that `async`/`await` is built entirely on top of Promises — it doesn't avoid any Promise-level considerations, it just hides the chaining syntax.

### 💎 Good to Know: The Right Choice Depends on the Shape of the Work

These three aren't strictly progressive replacements where the newest option is always objectively better. Callbacks remain the right primitive for genuinely event-based, potentially-repeating notifications — an `EventEmitter`'s `on('data', ...)` firing many times over doesn't map cleanly onto a single Promise that resolves once. The real question is whether the underlying operation produces a one-time result, where Promises and `async`/`await` fit naturally, or a repeating stream of events over time, where callbacks and `EventEmitter` fit naturally — a distinction the next chapter picks up directly.

### ❓ Follow-up Interview Questions

1. Why doesn't a repeating event, like data arriving continuously from a stream, map cleanly onto a single Promise?
2. What's a concrete example of accidentally creating a waterfall with `async`/`await` that `Promise.all()` would have avoided?
3. Why did unhandled Promise rejections used to be a "silent" problem, and how has that changed in modern Node.js?
4. If `async`/`await` is just syntax over Promises, why does it still matter which one a codebase primarily uses?
5. How would you decide, for a new piece of code, whether callbacks, Promises, or `async`/`await` is the right fit?

---