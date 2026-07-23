---
title: Child Processes
description: spawn, exec, and fork — running other programs from Node.
sidebar_position: 10
---

# Child Processes

## 1. What are Child Processes in Node.js, and why do we use them?

### 📖 Introduction

Node.js's single-threaded JavaScript execution model, covered throughout the Event Loop and Node.js Architecture chapters, has a real limitation for CPU-heavy work — Child Processes are one of the two mechanisms Node.js provides for stepping outside that model entirely.

### 🧩 What Child Processes Are

Node.js's `child_process` module lets an application spawn and launch other processes — another Node.js script, or a completely unrelated program like a shell command, a Python script, or an image-processing tool — and communicate with them through standard I/O streams, or through a dedicated message-passing channel for Node-to-Node children.

### 🎯 Why We Use Them

Since a single Node.js process can't parallelize heavy computation entirely on its own, spawning a child process offloads work to a genuinely separate OS process, with its own memory space and its own thread, running in true parallel alongside the main Node.js process — unlike the main thread's single-threaded JavaScript execution model. Child processes are also commonly used simply to run existing, battle-tested external tools that Node.js has no reason to reimplement — running `ffmpeg` for video processing, or invoking a shell command like `git`, rather than rebuilding that functionality in JavaScript.

### 📡 How They Communicate

Any child process communicates through standard streams — `stdin`, `stdout`, `stderr` — tying directly back to the Streams & Buffers chapter earlier in this guide. Node-to-Node children spawned specifically through `fork()`, covered in the next question, additionally get a dedicated IPC channel for structured message exchange, rather than being limited to raw stdout and stderr text.

### 💎 Good to Know: A Child Process Is a Genuinely Separate OS Process

A child process has its own memory space, completely isolated from the parent — fundamentally different from Worker Threads, covered in the next chapter, which share memory space differently. This isolation carries real trade-offs: more overhead to spawn, but stronger fault isolation, since a crashing child process doesn't directly threaten the parent process's own memory or state.

### ❓ Follow-up Interview Questions

1. Why would a Node.js application spawn a child process instead of trying to do everything within its own single thread?
2. What's a concrete example of a task better suited to an external program via a child process than to a JavaScript reimplementation?
3. Why does a child process's memory isolation from its parent matter for fault tolerance?
4. What are the two ways a Node.js application can communicate with a child process it spawned?
5. What's the overhead cost of spawning a child process compared to just running more code on the main thread?

---

## 2. What is the difference between `spawn`, `exec`, and `fork`?

### 📖 Introduction

`child_process` offers three distinct ways to create a child process, and each is suited to a genuinely different situation.

### 🚀 `spawn(command, args, options)`

`spawn` launches a new process to run a given command with an array of arguments, returning a `ChildProcess` object whose `stdout`, `stdin`, and `stderr` are streams — tying directly to the Streams & Buffers chapter. It's best suited to large amounts of output, since data streams incrementally rather than being buffered all at once, or to long-running processes. It doesn't spawn a shell by default, though it can be configured to.

### 🐚 `exec(command, options, callback)`

`exec` runs a command as a string, potentially including shell operators like pipes or redirects, through an actual shell, and buffers the entire stdout and stderr output in memory before delivering it all at once through a callback once the process completes. This is simpler for short-lived commands with small output, but risky for large output, since buffering unbounded output can exhaust memory — the same underlying concern the File System chapter raised about `readFile()` versus streaming. It also carries an injection risk if a command string is built from unsanitized user input, since it invokes a real shell that interprets special characters.

### 🔀 `fork(modulePath, args, options)`

`fork` is a specialized case specifically for spawning another Node.js process to run a separate `.js` file. It automatically sets up a dedicated IPC channel between parent and child, allowing structured `.send()`/`.on('message', ...)` message passing between the two Node.js processes, in addition to the standard stdout and stderr streams. It's commonly used to offload CPU-heavy JavaScript work to a separate Node.js process while keeping a clean, message-based communication interface — an alternative to Worker Threads, covered in the next chapter, for achieving genuine parallelism.

### 💎 Good to Know: A Practical Decision Guide

Use `exec` for a quick shell command with small, predictable output where only the final result matters. Use `spawn` for long-running processes, large output, or when output needs to be processed incrementally as it streams in. Use `fork` specifically when the child is another Node.js script and structured message-based communication is needed. A related function, `execFile()`, runs an executable directly without a shell — safer against injection than `exec`, while still buffering output the same way.

### ❓ Follow-up Interview Questions

1. Why does `exec` carry an injection risk that `spawn` and `execFile` generally don't?
2. Why is `spawn` a better fit than `exec` for a command producing gigabytes of output?
3. What specifically does `fork` set up that a plain `spawn` call to run a Node.js script wouldn't?
4. Why would a developer choose `execFile` over `exec` when running a known, trusted executable?
5. What would happen to memory usage if `exec` were used to run a long-lived process that continuously produces output?

---

## 3. What is the difference between Worker Threads and Child Processes?

### 📖 Introduction

Worker Threads and Child Processes solve an overlapping problem — getting work done outside the single main JavaScript thread — through genuinely different mechanisms, each with distinct trade-offs.

### 🧵 Child Processes

A child process is a separate OS-level process, with its own completely isolated memory space, its own V8 instance, and its own Event Loop. Communication happens only through message-passing — IPC or stdio streams — with no shared memory by default. This carries higher overhead to spawn, since it's an entirely new OS process, but stronger isolation: a crash in a child process is fully contained and doesn't directly affect the parent's memory or state.

### 🧶 Worker Threads

Worker Threads, covered in full in the next chapter, are separate threads within the same OS process — lighter-weight to spawn than a full child process, and able to share memory directly through a `SharedArrayBuffer` for certain use cases. Each Worker Thread does get its own V8 isolate and Event Loop, providing some isolation, but a crash or unhandled exception in a Worker Thread is more likely to have implications for shared state than a crash in a fully separate OS process would.

### 🧭 When to Choose Which

Child processes fit well when running an external, non-Node.js program, when strong fault isolation between pieces of work is needed, or when gluing together multiple separate Node.js processes that don't need to share much data. Worker Threads fit well specifically for CPU-bound JavaScript computation that needs lower overhead than spawning full processes, or that benefits from directly sharing memory, without needing to run any non-JavaScript program.

### 💎 Good to Know: This Sets Up the Next Chapter's Full Comparison

Child Processes and Worker Threads solve an overlapping problem through genuinely different underlying mechanisms with different trade-offs, and choosing between them — or the Cluster module, also covered in the next chapter and itself built on child processes — is a real, common architectural decision the next chapter covers in much more depth.

### ❓ Follow-up Interview Questions

1. Why does a Worker Thread crash carry more risk to shared state than a child process crash does?
2. Why is spawning a Worker Thread generally cheaper than spawning a full child process?
3. When would sharing memory directly, via `SharedArrayBuffer`, matter enough to prefer Worker Threads over child processes?
4. Why wouldn't Worker Threads be a suitable choice for running an external, non-Node.js program?
5. How would you decide between `fork()` and a Worker Thread for offloading CPU-heavy JavaScript work?

---

## 4. What are common real-world use cases and mistakes when working with Child Processes?

### 📖 Introduction

Child processes show up constantly in real Node.js applications, and a handful of recurring mistakes tend to follow them just as consistently.

### 🌍 Common Use Cases

- **Running external CLI tools** — image or video processing with something like `ffmpeg`, invoking `git` commands, running a compiler or build tool, or calling out to a script written in a different language entirely.
- **Offloading CPU-heavy JavaScript computation via `fork()`** — keeping the main process responsive while heavy computation happens in a separate Node.js process.
- **Scaling across multiple instances on one machine** — a pattern the Cluster module, built on `child_process` and covered in the next chapter, formalizes.
- **Sandboxing or isolating risky code** — since a child process crash doesn't take down the parent, running less-trusted code in a child process limits the blast radius of a failure.

### ⚠️ Common Mistakes

- **Using `exec()` for large output** — buffering unbounded output into memory rather than using `spawn()`'s streaming interface, covered earlier in this chapter, is a common performance and memory mistake.
- **Shell injection through `exec()`** — building a command string by concatenating unsanitized user input is a genuine, serious security vulnerability, since `exec()` invokes a real shell that interprets special characters.
- **Not handling both `'error'` and `'exit'`/`'close'` events** — an executable that doesn't exist at all fires an `'error'` event on the `ChildProcess` object itself, distinct from a non-zero exit code, which is reported through `'exit'`/`'close'`. Checking only one of these is a common way to miss a real failure mode.
- **Spawning too many child processes at once** — each one carries real OS-level overhead, unlike a lightweight async operation, and spawning one per incoming request under load can exhaust memory, file descriptors, or OS process limits far faster than expected.
- **Forgetting to clean up lingering child processes** — if a parent process exits or crashes without explicitly terminating children it spawned, orphaned processes can be left running indefinitely, consuming resources with nothing left managing them.

### 💎 Good to Know: Checking Only One Failure Signal Is an Easy Trap

Because a missing executable and a non-zero exit code report failure through two different events, code that only listens for one of them will silently miss the other — worth double-checking explicitly whenever a child process's success genuinely matters to the surrounding logic.

### ❓ Follow-up Interview Questions

1. Why does a missing executable fire an `'error'` event rather than simply producing a non-zero exit code?
2. What's a realistic scenario where spawning one child process per incoming request would exhaust system resources?
3. Why is shell injection a risk specifically with `exec()` and not with `execFile()`?
4. What would you do to ensure a parent process cleans up child processes it spawned before it exits?
5. Why might running untrusted code in a child process be a reasonable isolation strategy, even without a full sandboxing solution?

---

## 5. How would you offload CPU-intensive work using a Child Process versus a Worker Thread?

### 📖 Introduction

This is a genuinely practical decision that comes up whenever an application needs to run heavy computation without blocking the Event Loop for every other concurrent request — the exact concern the Event Loop chapter raised repeatedly.

### 🔀 Offloading via a Child Process

Using `fork()`, a separate Node.js process runs the heavy computation. Input data is sent to it through `.send()`, serialized as JSON over the IPC channel — an important limitation, since only JSON-serializable data can be passed this way, making large binary buffers less efficient to transfer compared to the alternative below. The child computes the result and sends it back the same way, and it can either stay alive for future work as a persistent pool, or be spawned fresh per task, which is simpler but carries more overhead per task from process startup cost.

### 🧵 Offloading via a Worker Thread

A Worker Thread, covered fully in the next chapter, runs the same kind of heavy computation, communicating through `postMessage()` — similar in shape to a child process's IPC, but with the added option of using a `SharedArrayBuffer` or transferable objects for zero-copy or near-zero-copy transfer of large binary data, avoiding the JSON-serialization overhead a child process's IPC channel requires. Worker Threads generally carry lower overhead to spawn than a full child process, since they're threads within the same process rather than an entirely separate OS process.

### 🧭 Deciding Between Them

If the computation involves large binary data, like image buffers, that would be expensive to repeatedly JSON-serialize over IPC, a Worker Thread's shared-memory options make it the more efficient choice. If the work needs to call out to a non-Node.js program, or needs strong process-level isolation from the main application, a child process is the more natural fit. For a large number of short CPU-bound tasks, a persistent pool of workers — whether Worker Threads or forked child processes, kept alive and reused across many tasks — avoids repeatedly paying startup overhead per individual task, a useful pattern regardless of which underlying mechanism is chosen.

### 💎 Good to Know: Worker Threads Are the More Common Modern Default

For purely offloading CPU-heavy JavaScript computation, without needing to run an external program, Worker Threads are generally the more commonly recommended default in modern Node.js, specifically because of their lower overhead and more efficient data-sharing options. `fork()` remains a completely valid, simpler-to-reason-about alternative, especially when stronger process-level isolation is genuinely needed. The next chapter covers Worker Threads in full depth.

### ❓ Follow-up Interview Questions

1. Why is JSON serialization over IPC a meaningful cost when passing large binary data to a forked child process?
2. What's the practical benefit of keeping a persistent pool of workers alive rather than spawning a fresh one per task?
3. Why might a team choose `fork()` over Worker Threads even knowing Worker Threads have lower overhead?
4. How would `SharedArrayBuffer` specifically help avoid the serialization cost associated with a child process's IPC channel?
5. What would change about this decision if the CPU-heavy work needed to call an external, non-Node.js program as part of its processing?

---