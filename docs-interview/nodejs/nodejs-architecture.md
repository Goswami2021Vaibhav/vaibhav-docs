---
title: Node.js Architecture
description: V8, libuv, and the pieces that make Node's non-blocking model work.
sidebar_position: 2
---

# Node.js Architecture

## 1. What is the V8 JavaScript engine, and how does it relate to Node.js?

### 📖 Introduction

The Introduction & Fundamentals chapter established that Node.js is built on V8, but treated it mostly as a fact to accept. This chapter starts by actually unpacking what V8 is and where its responsibilities end and Node.js's begin.

### ⚙️ What V8 Actually Is

V8 is Google's open-source JavaScript and WebAssembly engine, written in C++, originally built to power Chrome. It's the piece of software that actually takes JavaScript source code and does something with it — parsing it, compiling it to optimized machine code through just-in-time compilation, executing it, and managing the memory used by JavaScript objects through garbage collection.

### 🔌 How It Relates to Node.js

Node.js embeds V8 as its JavaScript execution engine. V8 handles running the actual language — variables, functions, objects, Promises — while Node.js wraps around it, adding the APIs V8 has no knowledge of at all, like `fs`, `http`, and `process`, and integrating it with libuv to enable non-blocking I/O.

### 🚫 What V8 Doesn't Provide

Vanilla V8, on its own, has no concept of a filesystem, a network, or even timers — it can only execute pure ECMAScript. Every capability that feels like "part of JavaScript" but isn't actually defined by the language specification — `setTimeout`, `require`, `fs.readFile` — is something the surrounding runtime bolts on around V8, whether that runtime is Node.js or a browser.

### 💎 Good to Know: Why V8 Was the Obvious Choice

V8 was fast, open source, actively maintained by Google, and already battle-tested from running inside Chrome — a strong foundation for Ryan Dahl to build on rather than writing a new JavaScript engine from scratch. Because V8 keeps evolving independently, driven partly by Chrome's own needs, new JavaScript language features typically become available in Node.js as soon as the specific V8 version bundled with a given Node.js release supports them.

### ❓ Follow-up Interview Questions

1. Why can't V8 alone execute something like `fs.readFile()` without Node.js wrapping around it?
2. What does it mean for V8 to "just-in-time compile" JavaScript, and why does that matter for performance?
3. Why does Node.js's support for new JavaScript syntax often lag slightly behind a new ECMAScript proposal being finalized?
4. If Node.js used a different JavaScript engine instead of V8, what would actually need to change?
5. What responsibilities does V8 handle that have nothing to do with Node.js's non-blocking I/O model at all?

---

## 2. What is the Node.js runtime environment, and how does it extend V8 beyond the browser?

### 📖 Introduction

"Runtime environment" gets used loosely, but it has a specific meaning here — it's the whole package that lets JavaScript actually do something useful outside of just evaluating expressions.

### 🧱 What "Runtime Environment" Actually Means

The Node.js runtime is V8 plus a standard library of built-in modules and APIs — `fs`, `http`, `path`, `process`, `Buffer` — plus its integration with libuv, which is what makes asynchronous I/O possible in the first place. V8 executes the language; the runtime is everything wrapped around it that makes that execution useful for real work.

### 🔧 How It Extends V8

V8 alone has no idea what "reading a file" or "starting a server" means. Node.js's runtime layer sits around V8 and exposes a set of bindings down to OS-level capabilities, surfacing them to JavaScript code as ordinary-looking functions and modules — so calling `fs.readFile()` from JavaScript ultimately triggers real system calls underneath, coordinated through libuv.

### 🆚 Contrast With the Browser

A browser is doing the exact same layering, just with a completely different set of APIs wrapped around the same kind of engine: `window`, `document`, `fetch`, `localStorage` — capabilities suited to rendering a page and interacting with a user's browsing session, not system-level work. Node.js and a browser are two different runtimes, each built around a JavaScript engine but exposing a specialized set of APIs suited to what that environment actually needs to do — the same "host environment" framing introduced in the Introduction & Fundamentals chapter.

### 💎 Good to Know: One Language, Many Possible Runtimes

This layered structure — a shared engine at the core, with runtime-specific APIs wrapped around it — is exactly why the same JavaScript language can power such different kinds of applications. The language itself never changes; only the capabilities exposed around it do.

### ❓ Follow-up Interview Questions

1. What specifically would be missing if you tried to use Node.js's `fs` module inside a browser's JavaScript environment?
2. How does the concept of a "runtime environment" differ from just "a JavaScript engine"?
3. Why does Node.js need libuv as part of its runtime, when a browser's runtime handles I/O-like behavior differently?
4. Could a completely different runtime be built around V8 for a different purpose entirely, like an embedded IoT device? What would it need to expose?
5. Why is it more accurate to say Node.js "extends" V8 rather than "replaces" or "modifies" it?

---

## 3. What does event-driven architecture mean in the context of Node.js?

### 📖 Introduction

Node.js's non-blocking behavior, discussed in the previous chapter, is really just one consequence of a broader architectural choice: building the entire runtime around events rather than a rigid, top-down sequence of steps.

### 🎯 What Event-Driven Architecture Means

In an event-driven architecture, the flow of a program is determined by events — a request arriving, a file finishing being read, a timer expiring — rather than by a fixed, sequential execution plan. Code registers callbacks or handlers for specific events, and the runtime invokes them whenever those events actually occur, in whatever order they happen to occur in.

### 🔩 How This Shows Up Throughout Node.js

Nearly every core Node.js API is built around this pattern. An HTTP server emits a `request` event for every incoming request, a stream emits `data` events as chunks of data arrive, a file watcher emits a `change` event when something on disk is modified. The `EventEmitter` class, covered in its own chapter later in this guide, is the underlying mechanism behind most of this.

### 🚦 Contrast With a "Wait and Block" Model

Rather than code explicitly pausing execution while waiting for something to finish — the way a traditional blocking, thread-per-request server might behave — Node.js's model registers what should happen in response to an event, and then immediately moves on to other work until that event actually fires.

### 💎 Good to Know: Event-Driven and Non-Blocking Are Two Sides of the Same Idea

An incoming HTTP request doesn't get a dedicated thread that sits blocked waiting for a database call to finish — it gets an event handler that runs whenever the relevant event, like the database response becoming ready, actually occurs, freeing the single thread to service other clients' events in the meantime. This is deeply tied to the reasoning from the Introduction & Fundamentals chapter about why Node.js suits I/O-heavy work: event-driven architecture is the mechanism that makes non-blocking I/O possible in the first place, not a separate feature alongside it.

### ❓ Follow-up Interview Questions

1. How does an HTTP server's `request` event relate to the underlying non-blocking I/O model discussed in the previous chapter?
2. What would a purely sequential, non-event-driven version of a Node.js HTTP server look like, and why would it not scale the same way?
3. Why is `EventEmitter` described as the mechanism "behind" Node's event-driven APIs rather than a separate, optional feature?
4. What happens if two different events that both have registered handlers occur at almost the same moment?
5. How does thinking in terms of "what happens in response to this event" change how you'd structure a piece of server-side logic compared to writing it imperatively?

---

## 4. What is non-blocking I/O, and how does it differ from blocking I/O?

### 📖 Introduction

Non-blocking I/O has been referenced repeatedly so far in this guide as the core idea behind Node.js's concurrency model. This question is about pinning down exactly what "blocking" and "non-blocking" mean at the level of a single operation.

### 🚫 Blocking I/O

A blocking operation halts further code execution until it completes. `fs.readFileSync()` is a clear example — the thread that calls it sits idle, doing nothing else, until the operating system actually returns the file's contents.

### ✅ Non-Blocking I/O

A non-blocking operation is initiated and immediately returns control to the calling code, without waiting for it to actually finish. The real work happens elsewhere — handled by the OS kernel or by libuv's internal thread pool — and the result is delivered later through a callback or a resolved Promise, at which point the calling code picks it back up. `fs.readFile()`, the asynchronous counterpart to the example above, behaves exactly this way.

### ⚖️ Why the Distinction Matters Specifically in Node.js

Because Node.js runs JavaScript on a single thread, a blocking call ties up that one thread completely — nothing else in the entire application can run while it's waiting, no other request gets serviced, no timer fires. A non-blocking call keeps that single thread free to do other work while the actual I/O happens in the background.

### 💎 Good to Know: "Non-Blocking" and "Asynchronous" Aren't Quite the Same Word

Non-blocking specifically describes a property of an individual operation — it doesn't halt the thread issuing it. Asynchronous describes the broader programming style built around such operations — callbacks, Promises, `async`/`await`. In casual conversation about Node.js the two get used almost interchangeably, but non-blocking is really about the I/O call itself, not the surrounding code style.

### ❓ Follow-up Interview Questions

1. Why does `fs.readFileSync()` freeze an entire Node.js server, not just the specific request that called it?
2. Can an operation be asynchronous but still technically blocking in some sense? Why or why not?
3. What determines whether a given Node.js API offers both a sync and an async version?
4. Why might a developer accidentally introduce a blocking call into an otherwise fully async codebase?
5. How would you detect that a blocking call is silently degrading a production Node.js application's performance?

---

## 5. Why is Node.js considered single-threaded, and how does it still handle multiple client requests simultaneously?

### 📖 Introduction

This is one of the most commonly asked Node.js interview questions precisely because the answer sounds contradictory at first — single-threaded, yet somehow handling thousands of concurrent connections.

### 🧵 What "Single-Threaded" Actually Refers To

JavaScript execution in Node.js happens on one thread — often called the main thread or the Event Loop thread. This is a deliberate simplification: application code never has to worry about race conditions or locks the way it would in a genuinely multi-threaded language, since only one piece of JavaScript ever runs at any given instant.

### 🔀 How Concurrency Still Happens

The single thread doesn't actually do everything itself. I/O work gets delegated elsewhere — to the operating system kernel directly for things like network sockets, or to libuv's own thread pool for operations like certain filesystem calls and DNS lookups. The JavaScript thread's job is to orchestrate: kick off the operation, register a callback, move immediately to the next task, and pick the callback back up once it's notified that the operation has actually completed.

### 🍽️ A Useful Analogy

Picture a single waiter serving many tables. The waiter doesn't stand at one table waiting for the kitchen to finish cooking — they take the order, pass it to the kitchen, and immediately go take another table's order, coming back to serve each table once its food is actually ready. The waiter is the single JavaScript thread; the kitchen is the OS and libuv doing the actual I/O work.

### 💎 Good to Know: This Trick Depends on Where the Waiting Actually Happens

This model works because most of a typical request's waiting time isn't spent doing CPU work on the main thread at all — it's spent waiting on external systems like databases, disks, and networks, and that waiting doesn't require the JavaScript thread's attention. This is exactly why CPU-bound work, discussed in the Introduction & Fundamentals chapter, breaks the illusion: a heavy synchronous computation genuinely does require the main thread's continuous attention, and unlike I/O, there's no "elsewhere" to delegate it to without explicitly using Worker Threads.

### ❓ Follow-up Interview Questions

1. If Node.js delegates I/O work elsewhere, what part of handling a request does the main thread actually still do?
2. Why doesn't the single-threaded model need locks or mutexes the way genuinely multi-threaded code does?
3. What would happen to the waiter analogy if one table's order required the waiter to personally stand and cook it?
4. Is it accurate to say Node.js has "only one thread" in absolute terms, or just for JavaScript execution specifically?
5. How would you explain this model to someone convinced that "single-threaded" must mean "can only do one thing at a time, period"?

---

## 6. What role does libuv play in the Node.js architecture?

### 📖 Introduction

V8 executes JavaScript; it has no idea what non-blocking I/O even means. libuv is the piece that actually makes the non-blocking model described throughout this chapter possible.

### 🧰 What libuv Actually Is

libuv is a C library that gives Node.js its Event Loop implementation and a way to perform non-blocking I/O, abstracting away the very different underlying async mechanisms each operating system provides — Linux's epoll, macOS's kqueue, Windows' IOCP — behind one consistent API that Node.js can build on regardless of platform.

### 🛠️ Its Specific Responsibilities

libuv implements the Event Loop itself, with its distinct phases (covered in full depth in the next chapter), manages a thread pool — four threads by default, configurable — used for operations that don't have a good native async system call, and provides cross-platform abstractions for networking like TCP and UDP sockets.

### 🔗 How It Fits With V8

V8 handles running JavaScript code; libuv handles everything about asynchronous operations and the timing of when JavaScript callbacks actually get invoked. Node.js's own C++ layer binds these two pieces together, exposing libuv's capabilities to JavaScript as ordinary-looking, callable APIs.

### 💎 Good to Know: Not All Async Work Goes Through the Thread Pool

A common misconception is that libuv's thread pool handles all of Node.js's asynchronous work. In reality, network I/O — a plain TCP socket, most HTTP requests — is typically handled directly by the operating system kernel's own async mechanisms, without touching libuv's thread pool at all. The thread pool is specifically reserved for operations that lack a good native async system call, which is a good portion of `fs` methods, along with certain DNS lookups and some crypto operations.

### ❓ Follow-up Interview Questions

1. Why does libuv need to abstract over epoll, kqueue, and IOCP instead of using one of them directly?
2. What kinds of operations specifically rely on libuv's thread pool versus the OS kernel's native async mechanisms?
3. What would happen to Node.js's concurrency model if the thread pool's default size of four were the only path for all I/O?
4. Why is it useful for an interviewer-facing answer to distinguish "network I/O" from "filesystem I/O" when discussing libuv?
5. How would increasing libuv's thread pool size affect an application that's heavily using `fs` operations?

---

## 7. What happens internally when a Node.js application starts up?

### 📖 Introduction

Running `node app.js` looks like a single instant action, but there's a specific sequence of steps happening underneath before the first line of a developer's own code even runs.

### 🚀 The Startup Sequence

The operating system starts a new process and loads the Node.js binary. V8 initializes, creating a JavaScript execution context and setting up the global object. Node.js then runs its own internal bootstrap process — initializing internal modules and C++ bindings, like the machinery behind `process` and the module loader — largely invisible to a developer, before any user code executes. libuv initializes its Event Loop instance and thread pool, ready to be used the moment something asks for them.

### 📜 Running the Entry Script

The actual script passed to `node` is loaded as the entry module and executed synchronously, from top to bottom. Any top-level `require()` calls trigger loading and executing those modules recursively, functions get defined, and something like `server.listen()` registers what should happen later without blocking anything right now.

### 🔁 Handing Off to the Event Loop

Once the synchronous top-level script finishes executing, control passes to the Event Loop, which begins cycling through its phases, waiting for timers, I/O events, or other registered callbacks to fire. The process stays alive as long as there's at least one pending timer, callback, or open handle — like a listening server — still being tracked. Once nothing is left, the process exits naturally on its own.

### 💎 Good to Know: This Is Why Some Scripts Exit Immediately and Others Don't

A script that does nothing but log something and finish has no pending work left for the Event Loop to track, so the process exits right away. A script that calls `server.listen()` keeps running indefinitely, because the listening server counts as an open handle the Event Loop continues watching — there's always something left to potentially respond to.

### ❓ Follow-up Interview Questions

1. Why does a plain `console.log()` script exit immediately, while a script with an HTTP server keeps running?
2. What's the difference between Node.js's own internal bootstrap process and the execution of a developer's entry script?
3. What would happen if `server.listen()` were called but no client ever connected — would the process still stay alive?
4. Why does synchronous top-level code in the entry script run before the Event Loop starts processing anything?
5. How would you determine, from the outside, why a Node.js process isn't exiting when you expect it to?

---

## 8. How do the V8 engine, libuv, the Event Loop, and the Runtime Environment work together?

### 📖 Introduction

Each of these four pieces has been covered individually earlier in this chapter. This question asks for the whole picture — how they cooperate during a single, concrete piece of asynchronous work.

### 🧩 A Quick Recap of Each Role

V8 executes JavaScript — parsing, compiling, running, and garbage-collecting it. libuv provides the Event Loop implementation, the thread pool, and cross-platform async I/O abstractions. The Event Loop is libuv's actual mechanism for continuously checking what work is ready and handing the corresponding JavaScript callbacks back to V8 to run. The Node.js runtime is the layer binding all of this together, exposing it to a developer as ordinary-looking JavaScript APIs like `fs` and `http`.

### 🔄 Tracing One Concrete Flow

When application code calls `fs.readFile()`, that call goes through Node.js's runtime API, down into a C++ binding layer, which hands the actual request off to libuv. libuv either dispatches it to the operating system's native async mechanism or queues it onto its own thread pool, and V8 is immediately free to keep executing other JavaScript in the meantime — nothing blocks. Once the file read completes, libuv places the corresponding callback into the appropriate Event Loop phase. On its next pass through that phase, the Event Loop hands the callback back to V8, which actually executes it as JavaScript.

### 🧠 A Way to Hold This in Your Head

V8 is the executor of the actual logic. libuv is the mechanism that handles waiting and OS-level integration, deciding when a callback becomes ready to run. The Event Loop is libuv's timing mechanism that ties everything together into a continuous cycle. The runtime is the glue and API surface that makes all of this usable by a developer writing plain JavaScript, without ever touching the C++ underneath directly.

### 💎 Good to Know: None of These Four Work in Isolation

V8 without libuv could only run synchronous JavaScript with no I/O capability at all. libuv without V8 has no JavaScript to actually execute the callbacks it's tracking. The runtime is what makes the combination coherent and usable as "Node.js," rather than four disconnected low-level pieces that happen to be bundled together.

### ❓ Follow-up Interview Questions

1. At what specific point in the `fs.readFile()` flow does control pass from JavaScript into C++, and back again?
2. Why can V8 keep executing other code while a file read is still in progress?
3. What would be missing if you had V8 and the Event Loop but no runtime layer connecting them to something like `fs`?
4. How would you describe the difference between "the Event Loop" and "libuv" to someone who assumes they're the same thing?
5. Why does the callback for an I/O operation not run the instant the operation completes, but rather on the Event Loop's next pass through a specific phase?

---

## 9. How does Node.js achieve high concurrency while remaining single-threaded?

### 📖 Introduction

Earlier in this chapter, the waiter analogy explained the basic mechanism behind Node.js's concurrency. This question goes a level deeper — into why that model actually scales to thousands of simultaneous connections, and what "concurrency" precisely means here.

### 🔀 Concurrency Is Not Parallelism

Concurrency means many operations are in progress at once — some waiting, some ready to run. Parallelism means multiple operations are literally executing at the exact same instant, typically across different CPU cores. Node.js's single JavaScript thread achieves high concurrency without true parallelism for JavaScript execution itself: only one JavaScript callback ever runs at any given instant, but potentially thousands of I/O operations can be in flight simultaneously at the OS and libuv level, waiting to be picked up.

### 🖧 The OS-Level Mechanism Behind This

For network sockets specifically, operating systems provide highly efficient primitives — epoll on Linux, kqueue on macOS, IOCP on Windows — that let a single thread monitor thousands of open sockets at once and get notified only when one of them actually has data ready, rather than requiring a dedicated thread to individually poll or block on each socket. libuv wraps these OS-level primitives, and the Event Loop uses them to know exactly which callbacks are ready to run next.

### ⚖️ Why This Scales Better Than Thread-Per-Connection

A traditional threaded server scales concurrency by spinning up more OS threads, and each additional thread carries real memory overhead for its stack and real CPU cost from context switching between threads. Node.js's model scales concurrency largely through the OS's efficient socket-monitoring primitives combined with a lightweight callback queue, which carries a much smaller resource footprint per additional connection.

### 💎 Good to Know: High Concurrency Is About Waiting Efficiently, Not Computing Faster

Thousands of concurrent connections can be held open with comparatively little memory, as long as the actual JavaScript work done per request stays small and non-blocking. This is precisely why Node.js's concurrency story shines for workloads with many mostly-idle connections — chat applications, APIs waiting on databases — and does nothing to make a single expensive computation faster. Concurrency and raw compute throughput are different axes entirely, and conflating them is exactly the confusion behind the CPU-bound limitation discussed in the Introduction & Fundamentals chapter.

### ❓ Follow-up Interview Questions

1. Why can a single thread monitor thousands of open sockets efficiently, when a naive implementation would need one thread per socket?
2. What's the practical difference between "concurrency" and "parallelism" in the context of a Node.js server handling requests?
3. Why does Node.js's concurrency model provide no benefit for a single, computationally expensive request?
4. How does the memory overhead of Node.js's model compare to a thread-per-connection server as connection count grows into the thousands?
5. What would you look for to confirm that a Node.js application's "concurrency" isn't secretly masking a CPU bottleneck?

---

## 10. What are the trade-offs of Node.js's event-driven architecture?

### 📖 Introduction

Every question so far in this chapter has built up the benefits of Node.js's event-driven model — high concurrency, low memory overhead, no locks needed in application code. None of that comes for free; this question is about what's actually being traded away in exchange.

### ⚠️ One Blocking Callback Affects Everyone

Because every request is handled by the same single JavaScript thread, a slow or blocking callback doesn't just delay the request that triggered it — it freezes the entire application for every other connected client. In a thread-per-request model, a slow thread is at least somewhat isolated from other threads; in Node.js's model, there's only one thread to share, so the blast radius of one badly written piece of code is the whole server.

### 🧵 Harder-to-Follow Control Flow

Execution jumps around based on whichever event happens to fire next, rather than proceeding top-down the way synchronous code does. This can make stack traces for asynchronous errors less linear, and subtle bugs involving the relative ordering of different async operations can be genuinely tricky to reason about, even though there's no true parallelism happening underneath.

### 🪤 Discipline Is Required to Avoid Blocking

Any accidental synchronous or CPU-heavy operation — even something that looks innocuous, like an expensive `JSON.parse()` call or a poorly optimized regular expression — has an outsized negative effect on a Node.js application compared to the same operation running in a threaded model, since there's no automatic fallback to another thread for JavaScript execution itself.

### 🔧 Parallelism Isn't Free

Genuine CPU parallelism doesn't come automatically with Node.js's model the way it might in a naturally multi-threaded runtime — it has to be deliberately opted into using Worker Threads or the Cluster module, both covered later in this guide.

### 💎 Good to Know: Event Loop Lag Becomes a Uniquely Important Metric

Because everything funnels through a single Event Loop, monitoring how much delay exists between when a callback should run and when it actually runs — commonly called Event Loop lag — becomes a distinctly important, Node.js-specific health signal in production, without a direct equivalent in thread-per-request architectures.

### ❓ Follow-up Interview Questions

1. Why does a slow callback in Node.js affect unrelated requests, when a slow thread in a threaded server might not?
2. What's an example of code that looks harmless but could quietly block the Event Loop in production?
3. Why is "Event Loop lag" a metric that doesn't have a clean equivalent in a thread-per-request architecture?
4. What would you tell a team that assumes Node.js gives them CPU parallelism automatically, the way some other runtimes do?
5. How would you weigh the trade-off between Node.js's low per-connection overhead and its single point of failure for blocking code?

---

## 11. Explain the complete lifecycle of a Node.js application from startup to execution.

### 📖 Introduction

This question pulls together everything covered in this chapter — V8, libuv, the Event Loop, the runtime, and non-blocking I/O — into one continuous story, following an application from the moment it starts to the moment it's actively serving requests.

### 🚀 Startup

The process starts, V8 initializes, and Node.js runs its own internal bootstrap before any user code executes — all covered in more detail earlier in this chapter. libuv initializes its Event Loop and thread pool, ready to be used. The entry script then runs synchronously from top to bottom; for a typical server, this is where `http.createServer()` and `.listen()` get called, registering what should happen later without blocking anything in the meantime.

### 🔁 Handing Off to the Event Loop

Once the synchronous top-level code finishes, control passes to the Event Loop, which begins cycling through its phases, watching for work.

### 📥 A Request Arrives

When a client connects, the operating system's socket-monitoring mechanism — epoll, kqueue, or IOCP, depending on the platform, as covered earlier in this chapter — notifies libuv. libuv surfaces this as a connection event, and the Event Loop picks it up during its next pass through the appropriate phase, handing the corresponding request handler callback to V8 to actually execute.

### ⏳ Handling the Request Without Blocking

If that handler performs I/O — querying a database, for instance — the operation is delegated to libuv or the OS, and the handler function returns without the response being finished yet. This frees the single thread to process other events in the meantime. Once the I/O completes, its callback is queued back onto the Event Loop, picked up on a future pass, and executed by V8 — eventually calling something like `res.end()` to send the response back out through the socket to the client.

### 🔄 This Repeats Continuously

Every connection follows this same cycle, and the process stays alive as long as the server keeps listening — an open handle the Event Loop continues tracking, exactly as covered earlier in this chapter. If the server is closed and no handles remain, the Event Loop finds nothing left to do, and the process exits naturally on its own.

### 💎 Good to Know: This Loop Is Every Concept in This Chapter, Running Continuously

This entire cycle — V8 executing callbacks, libuv and the Event Loop deciding when those callbacks run, non-blocking I/O keeping the single thread free in between — is the concrete, repeating realization of everything discussed throughout this chapter. The "high concurrency, single-threaded" story isn't a separate idea from this lifecycle; it's simply this same loop happening for every connection, continuously, for as long as the process runs.

### ❓ Follow-up Interview Questions

1. At what point in this lifecycle does the process become capable of exiting on its own, and what triggers that?
2. Why doesn't the request handler function need to "wait" for a database query to finish before returning?
3. How would this lifecycle look different for a request that does no I/O at all versus one that does?
4. What's the relationship between an "open handle" and why a listening server keeps a Node.js process alive indefinitely?
5. If you were debugging a Node.js process that wouldn't exit after all requests finished, which part of this lifecycle would you investigate first?

---