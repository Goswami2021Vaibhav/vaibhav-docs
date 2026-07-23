---
title: Process & OS
description: process.env, argv, exit codes, and reading system info.
sidebar_position: 8
---

# Process & OS

## 1. What is the `process` global object, and what kind of information does it expose about the running Node.js application?

### 📖 Introduction

Every Node.js module has access to a `process` object without ever importing anything — it's the primary way JavaScript code can introspect and interact with the very process it's currently running inside.

### 🌐 What `process` Actually Is

`process` is a global object representing the currently running Node.js process itself — as opposed to a specific file, network connection, or any other individual resource. It's available automatically in every module's scope.

### 📊 What It Exposes

`process` provides access to environment variables through `process.env`, command-line arguments through `process.argv`, the current working directory through `process.cwd()`, version information through `process.version` and `process.versions`, memory usage statistics through `process.memoryUsage()`, platform and architecture details through `process.platform` and `process.arch`, the process ID through `process.pid`, the ability to exit the process through `process.exit()`, and the ability to listen for process-level events through `process.on(...)` — since `process` is itself an `EventEmitter`, tying directly back to the EventEmitter chapter earlier in this guide.

### 🌍 Why It's Global Without an Import

`process` predates Node.js's more modular approach to exposing capabilities, unlike `fs` or `http`, which require an explicit `require()`. It's considered such a fundamental, universally needed piece of context about the runtime environment that Node.js exposes it automatically everywhere — conceptually similar to how `window` is globally available in a browser, even though it represents a very different kind of context.

### 💎 Good to Know: `process` Deserves Extra Scrutiny in Code Review

Because `process` provides access to genuinely sensitive and impactful capabilities — environment variables that may contain secrets, and the ability to terminate the entire process — code that touches `process` directly is worth a bit of extra attention during review. A library that unexpectedly reads `process.env` or calls `process.exit()` internally can have surprising, hard-to-trace effects on an application depending on it.

### ❓ Follow-up Interview Questions

1. Why is `process` available globally in every module, while `fs` and `http` require an explicit `require()`?
2. What would you check first if a third-party library's behavior seemed to depend on an undocumented environment variable?
3. Why does the fact that `process` is an `EventEmitter` matter practically?
4. What kind of information would `process.memoryUsage()` be useful for during a performance investigation?
5. Why might calling `process.exit()` inside a library, rather than an application's own entry point, be considered risky?

---

## 2. What is `process.env`, and how is it commonly used?

### 📖 Introduction

`process.env` is one of the most frequently accessed parts of the `process` object, and it's worth understanding precisely what it contains and its quirks before relying on it.

### 🗂️ What `process.env` Is

`process.env` is an object containing all environment variables available to the running process at startup — a direct reflection of whatever the operating system, parent process, or shell had set, or whatever a tool like `dotenv` loaded into it. The Environment Variables & Configuration chapter later in this guide covers that loading process in far more depth.

### 🎯 How It's Commonly Used

`process.env` is typically read for configuration values like `process.env.PORT` or `process.env.DATABASE_URL`, for a mode indicator like `process.env.NODE_ENV` — an extremely common convention for distinguishing development from production behavior, though it's a community convention rather than something Node.js itself defines — and for secrets like API keys or credentials.

### ⚠️ An Important Characteristic: Everything Is a String

Every value in `process.env` is always a string, even when it looks like a number or boolean. `process.env.PORT` is the string `"3000"`, not the number `3000`, so code reading these values typically needs explicit conversion, like `Number(process.env.PORT)`, rather than assuming the right type automatically.

### 💎 Good to Know: `process.env` Reflects a Snapshot, Not a Live View

`process.env` reflects the environment as it existed when the process started — changes made to the actual OS environment afterward generally aren't reflected in an already-running process. `process.env` can, however, be mutated at runtime from within the JavaScript code itself, which changes what that specific process sees going forward, though it has no effect on the parent shell or any other already-running processes. This chapter's treatment stays at the "what is this API" level — the fuller picture of loading precedence, secrets management, and validation belongs to the Environment Variables & Configuration chapter later in this guide.

### ❓ Follow-up Interview Questions

1. Why does `process.env.PORT` need to be explicitly converted to a number before being used as one?
2. If the OS environment changes after a Node.js process has already started, would `process.env` reflect that change?
3. What happens if code mutates `process.env` directly at runtime — does it affect anything outside that specific process?
4. Why is `NODE_ENV` a widely followed convention rather than something Node.js enforces itself?
5. What risk is introduced by logging the entire `process.env` object for debugging purposes?

---

## 3. What is `process.argv`, and how do you parse command-line arguments passed to a Node.js script?

### 📖 Introduction

Any Node.js script intended to be run from the command line with custom options needs a way to read what was actually typed after the script name — that's exactly what `process.argv` provides.

### 📋 What `process.argv` Is

`process.argv` is an array containing the command-line arguments used to launch the process. `process.argv[0]` is the path to the Node.js executable itself, `process.argv[1]` is the path to the script being run, and `process.argv[2]` onward are the actual arguments supplied by whoever ran the command. Running `node app.js --port 4000` produces `process.argv` as `[pathToNode, pathToApp.js, '--port', '4000']`.

### ✂️ Basic Manual Parsing

`process.argv.slice(2)` is the common idiom for getting just the user-supplied arguments, discarding the first two housekeeping entries. From there, a developer can loop through or index into the array to extract flags and values, though this gets tedious and error-prone quickly — handling both `--port 4000` and `--port=4000` styles, boolean flags with no value, and short versus long flag aliases all add real complexity.

### 🛠️ The Real-World Approach

Most non-trivial command-line tools use a dedicated argument-parsing library, such as `yargs` or `commander`, rather than manually parsing `process.argv` themselves. These libraries handle flag and value parsing, validation, help text generation, and various calling conventions consistently, rather than every project reinventing this logic on its own.

### 💎 Good to Know: The Index Layout Is a Common Source of Confusion

A frequent early mistake is forgetting that the first two entries in `process.argv` exist at all, and assuming `process.argv[0]` is the first user-supplied argument — when it's actually the Node.js executable's own path. Slicing incorrectly because of this is one of the most common `process.argv` mistakes.

### ❓ Follow-up Interview Questions

1. Why does `process.argv` include the path to the Node.js executable and the script itself, rather than just the user-supplied arguments?
2. What would `process.argv.slice(2)` return if the script were run with no additional arguments at all?
3. Why might a team reach for `yargs` or `commander` instead of parsing `process.argv` manually for a CLI tool?
4. How would you handle a flag written as `--port=4000` differently from one written as `--port 4000` when parsing manually?
5. What's a realistic bug that could result from assuming `process.argv[0]` is the first real argument?

---

## 4. What are exit codes, and why does a Node.js process exit with a specific code?

### 📖 Introduction

When a Node.js process finishes, it hands back more than just "done" — it hands back a small number that tells whatever launched it exactly how things went.

### 🔢 What Exit Codes Are

An exit code is a small integer, from 0 to 255, that a process returns to its parent — typically a shell, a process manager, or a CI pipeline — when it terminates. Since the parent generally can't otherwise inspect what happened inside the process that just exited, the exit code is how success or a specific kind of failure gets communicated back.

### ✅ The Convention

`0` conventionally means success, and any non-zero code conventionally signals some kind of failure. By convention rather than strict rule, different non-zero values can distinguish different specific failure reasons — exit code `1` for a generic error, a custom code for something like invalid configuration. Node.js itself uses certain reserved codes for specific internal failure types, such as an uncaught exception typically resulting in exit code `1`.

### ⚙️ Why This Matters in Practice

Shell scripts, CI pipelines, and process managers or orchestrators like PM2 and Kubernetes all rely on exit codes to decide what happens next — whether to mark a deployment as failed, whether to automatically restart a crashed process, or whether to alert someone.

### 💎 Good to Know: Two Ways to Set the Exit Code, With Different Risk Levels

A Node.js process's exit code can be set through `process.exitCode = <number>`, which lets the process still exit naturally once its work is done, or forced through `process.exit(<number>)`, covered in more depth in the next question. Setting `process.exitCode` is generally the safer approach when the goal is controlling the final exit code without cutting off any work still in progress.

### ❓ Follow-up Interview Questions

1. Why would a CI pipeline treat a non-zero exit code from a test run as a failed build?
2. What's the difference in risk between setting `process.exitCode` versus calling `process.exit()` directly?
3. Why does Node.js typically use exit code `1` for an uncaught exception rather than `0`?
4. How would a process orchestrator like Kubernetes use a container's exit code to decide whether to restart it?
5. If a script wanted to distinguish between "invalid input" and "network failure," how might it use exit codes to communicate that?

---

## 5. What is the difference between `process.exit()` and letting a Node.js process exit naturally?

### 📖 Introduction

The Node.js Architecture chapter covered how a process stays alive as long as the Event Loop has pending work — this question is about the difference between letting that play out versus forcing it to stop immediately.

### 🌿 Natural Exit

A Node.js process exits on its own, without anyone calling `process.exit()`, once the Event Loop has no more pending work — no open handles like a listening server, no pending timers, no pending callbacks, exactly as covered in the Node.js Architecture chapter's lifecycle walkthrough. The process simply runs out of things to do and terminates gracefully, using whatever exit code was set through `process.exitCode`, or `0` by default if it was never set.

### 🛑 `process.exit([code])`

This forces immediate, synchronous termination of the process, regardless of whether there's still pending work in the Event Loop. Any I/O still in progress — a file write not yet finished, a network request still in flight, buffered `console.log` output not yet flushed to stdout — can be abruptly cut off and lost, since the process doesn't wait for any of it to complete.

### ⚠️ Why Forcing an Immediate Exit Is Risky

Calling `process.exit()` immediately after `console.log()` can, on some platforms, result in that log output never actually appearing, if stdout is buffered and hasn't flushed yet. A database write in progress could be left in an inconsistent state, and open network connections get abruptly terminated rather than closed gracefully, potentially leaving clients in an unexpected state.

### 💎 Good to Know: The Safer Pattern Is "Set the Code, Let It Drain"

Setting `process.exitCode` and letting the process exit naturally once its actual pending work finishes preserves the intended final exit code without the abrupt cutoff risk. `process.exit()` does have legitimate uses — a genuinely broken, unrecoverable state where continuing to run risks something worse than an abrupt stop — but it should be a deliberate, carefully considered choice, not a reflexive way to end an ordinary program.

### ❓ Follow-up Interview Questions

1. Why might a `console.log()` call right before `process.exit()` sometimes fail to actually print anything?
2. What's a legitimate, deliberate use case for calling `process.exit()` rather than letting a process exit naturally?
3. How would you verify that a database write actually completed before a process is allowed to exit?
4. Why is setting `process.exitCode` considered safer than calling `process.exit()` in most ordinary situations?
5. What would happen to an in-flight HTTP request if the server process called `process.exit()` while still handling it?

---

## 6. What are process signals like `SIGTERM` and `SIGINT`, and how does a Node.js application listen for and handle them?

### 📖 Introduction

Signals are how an operating system tells a running process something important is happening, and handling them correctly is the foundation of shutting a Node.js server down cleanly rather than abruptly.

### 📡 What Signals Are

Signals are a POSIX-level mechanism for notifying a running process, most commonly to ask it to terminate. They're an operating-system concept, not something Node.js invented — Node.js exposes them through `process.on(signalName, handler)`, since `process` is itself an `EventEmitter`, as covered earlier in this chapter.

### 🔑 The Signals That Matter Most for Node.js Apps

`SIGINT` is sent when a user presses Ctrl+C in an interactive terminal session, conventionally requesting the process stop. `SIGTERM` is the "polite" termination request typically sent by process managers, container orchestrators, or deployment tooling when they want a process to shut down. `SIGKILL`, by contrast, cannot be intercepted or handled in application code at all — the operating system terminates the process unconditionally, bypassing Node.js entirely, with no opportunity to clean up anything.

### 🧹 How to Listen and Handle Them

`process.on('SIGTERM', () => { /* cleanup, then exit */ })` lets an application register a handler that runs custom cleanup logic — closing database connections, finishing in-flight requests, releasing resources — before actually exiting, rather than being killed with no chance to clean up at all.

### 🎯 Why This Matters in Production

This is exactly the mechanism behind graceful shutdown, covered in more depth later in this chapter and again in the Deployment & Production chapter. When a container orchestrator wants to stop or replace an instance during a deployment, it sends `SIGTERM` first and gives the process a grace period to shut down cleanly, only escalating to `SIGKILL` if the process doesn't exit in time. Handling `SIGTERM` properly is what lets an application actually use that grace period productively, instead of being abruptly cut off.

### 💎 Good to Know: Registering a Handler Replaces Node's Default Behavior

If no handler is registered for `SIGINT` or `SIGTERM`, Node.js has its own default behavior, typically just exiting. Registering a custom handler replaces that default entirely, which means the application's own code becomes responsible for actually calling `process.exit()`, or setting `process.exitCode` and letting it exit naturally as covered in the previous question, once cleanup finishes. Forgetting to actually exit inside a custom signal handler is a realistic bug that can leave a process hanging indefinitely, never terminating despite receiving the shutdown signal.

### ❓ Follow-up Interview Questions

1. Why can't `SIGKILL` be intercepted by application code the way `SIGTERM` can?
2. What would happen to a Node.js process that registers a `SIGTERM` handler but never actually calls `process.exit()` inside it?
3. Why does a container orchestrator send `SIGTERM` before `SIGKILL` instead of just using `SIGKILL` directly?
4. What's the risk of a signal handler's cleanup logic taking longer than the grace period an orchestrator allows?
5. How would you test that a Node.js application's `SIGTERM` handler actually completes its cleanup before the process exits?

---

## 7. What is the `os` module, and what kind of system-level information does it provide?

### 📖 Introduction

Where `process` describes the running Node.js process itself, `os` describes the machine that process happens to be running on — a distinct, complementary source of information.

### 🖥️ What the `os` Module Is

`os`, accessed through `require('os')`, is Node.js's built-in module for querying information about the underlying operating system and hardware, rather than the process running within it.

### 📊 Common Information It Provides

`os.platform()` returns values like `'linux'`, `'darwin'`, or `'win32'`; `os.arch()` returns the CPU architecture, like `'x64'` or `'arm64'`; `os.cpus()` returns details about each logical CPU core, useful for deciding how many Worker Threads or cluster workers to spawn, a decision covered in the Worker Threads & Cluster chapter later in this guide; `os.totalmem()` and `os.freemem()` report total and currently available system memory in bytes; and `os.hostname()`, `os.uptime()` (how long the system itself has been running, not the Node.js process), `os.homedir()`, and `os.tmpdir()` round out common system-level details.

### 🎯 Why This Matters in Practice

`os` informs decisions like how many Worker Threads or cluster workers to spawn based on `os.cpus().length`, building genuinely cross-platform file paths using `os.tmpdir()` instead of hardcoding a path like `/tmp` that doesn't exist on Windows, and adding useful system context to logs or diagnostic reports used in production monitoring.

### 💎 Good to Know: These Values Are Snapshots, Not Live Feeds

Values like `os.freemem()` reflect available memory at the exact instant they're called, not a continuously updated live value. Getting up-to-date system information over time — for a periodic health check, for instance — requires calling these functions repeatedly rather than caching a single stale result.

### ❓ Follow-up Interview Questions

1. Why is `os.cpus().length` a useful input when deciding how many Worker Threads to spawn?
2. Why does `os.tmpdir()` matter more for cross-platform code than hardcoding `/tmp`?
3. What's the difference between `os.uptime()` and `process.uptime()`?
4. Why would repeatedly calling `os.freemem()` be necessary for a monitoring routine, rather than calling it once and caching the result?
5. What kind of production issue might `os.totalmem()` and `os.freemem()` help diagnose?

---

## 8. What is the difference between `process.cwd()` and `__dirname`?

### 📖 Introduction

These two look like they'd return the same thing, and in simple cases they often do — which is exactly what makes the cases where they diverge a genuinely common source of bugs.

### 📍 `process.cwd()`

`process.cwd()` returns the current working directory of the Node.js process — determined by whatever directory the terminal or shell was in when the process was launched. This can even change during the process's lifetime if code explicitly calls `process.chdir()`.

### 📄 `__dirname`

`__dirname` is a variable available inside every CommonJS module — one of the parameters implicitly provided by the wrapper function around each file, as covered in the Modules chapter. It represents the absolute path of the directory containing the current file, fixed by the file's own location on disk, with nothing to do with where the process was launched from, and it doesn't change during execution. Note that `__dirname` isn't available in native ES Modules — the Modules chapter covers `import.meta.url` as its equivalent there.

### 🔀 A Concrete Scenario Showing the Divergence

If a script lives at `/home/user/project/src/app.js`, but it's run from `/home/user/project` using `node src/app.js`, `process.cwd()` returns `/home/user/project` — where the command was invoked from — while `__dirname` returns `/home/user/project/src` — where the file itself actually lives. These can easily diverge, and code that assumes they're always the same can break in subtle, hard-to-reproduce ways depending on where a script happens to be invoked from.

### 💎 Good to Know: Use `__dirname` for Paths Relative to Source Code

Constructing a path to a file relative to the source code's own location — loading a configuration file that lives alongside a script, for instance — should use `__dirname`, or its ES Module equivalent, not `process.cwd()`. The correct behavior shouldn't depend on the user's current shell directory when they happen to run the command. This is a genuinely common real bug, especially when a script gets invoked from different directories locally, in a CI pipeline, or as a globally installed CLI tool.

### ❓ Follow-up Interview Questions

1. Why might a script that works fine locally break when run from a CI pipeline, if it uses `process.cwd()` for loading a config file?
2. What would `__dirname` return for a file inside a deeply nested `src/utils/` folder?
3. Why doesn't `__dirname` exist in native ES Modules, and what's used in its place?
4. What would happen to `process.cwd()`'s return value if code called `process.chdir()` partway through execution?
5. How would you construct a path to a file that should always be relative to the project's root directory, regardless of where the script is invoked from?

---

## 9. What are `process.on('exit', ...)`, `process.on('uncaughtException', ...)`, and `process.on('unhandledRejection', ...)` used for?

### 📖 Introduction

These three process-level events represent the last layers of defense for observing and handling otherwise-fatal problems in a Node.js application, each catching a distinct kind of situation.

### 🏁 `process.on('exit', callback)`

This fires right before the process actually finishes exiting — the very last opportunity to run synchronous cleanup code. Crucially, this handler cannot perform any further asynchronous work at all; no new async operation can be started here, since the Event Loop is already in the process of shutting down at this exact point. Only synchronous code runs reliably inside it.

### 💥 `process.on('uncaughtException', callback)`

This fires when a synchronous error is thrown somewhere in the application and isn't caught by any `try`/`catch` anywhere up the call stack. It's a last-resort safety net, not a substitute for proper error handling throughout the application — a topic the Error Handling chapter later in this guide covers in depth. Node.js's official guidance is that after an `uncaughtException` fires, the application is generally in an unknown, potentially corrupted state, and the safest response is to log the error and exit the process, ideally letting a process manager restart it fresh, rather than trying to keep running as if nothing happened.

### 🚫 `process.on('unhandledRejection', callback)`

This fires when a Promise is rejected and no `.catch()` was ever attached to it anywhere. Historically, Node.js just logged a warning here and kept running. Modern Node.js versions, by default, treat an unhandled rejection similarly to an uncaught exception, crashing the process unless explicitly configured otherwise — a meaningful behavior change worth knowing precisely, since older tutorials or code may still assume the older, more lenient warning-only behavior.

### 💎 Good to Know: These Are a Safety Net, Not a Strategy

Relying on `uncaughtException` and `unhandledRejection` as a primary error-handling strategy, instead of proper `try`/`catch` and Promise rejection handling throughout the actual application code, is a common anti-pattern. These global handlers exist to let a genuinely unexpected or missed error fail loudly and observably — with a logged stack trace and context — rather than silently, not to replace handling errors correctly at the point where they actually occur.

### ❓ Follow-up Interview Questions

1. Why can't asynchronous cleanup work run reliably inside a `process.on('exit', ...)` handler?
2. Why does Node.js's official guidance recommend exiting the process after an `uncaughtException`, rather than trying to continue running?
3. How has the default behavior for unhandled Promise rejections changed between older and newer Node.js versions?
4. Why is treating `uncaughtException` as a primary error-handling strategy considered an anti-pattern?
5. What information would you want a `process.on('uncaughtException', ...)` handler to log before the process exits?

---

## 10. How would you implement a graceful shutdown handler using process signals?

### 📖 Introduction

This question is a direct, practical synthesis of signal handling and the `process.exit()`-versus-`process.exitCode` distinction, both covered earlier in this chapter — a correct graceful shutdown implementation is exactly where those two ideas meet.

### 🎯 The Core Goal

When a shutdown signal arrives — `SIGTERM` in production, `SIGINT` during local development via Ctrl+C — the goal is to stop accepting new work, let any in-flight work finish, clean up held resources, and only then exit, rather than dying immediately in the middle of a request.

### 🛠️ A Concrete Implementation Pattern

Register a single shared handler for both signals: `process.on('SIGTERM', shutdown)` and `process.on('SIGINT', shutdown)`, since the desired behavior is generally identical for both. Inside `shutdown`, first stop accepting new connections — calling `server.close()` on an HTTP server tells it to reject new incoming connections while letting already-in-flight requests finish naturally, and it accepts a callback that fires once every existing connection has actually finished. From there, close other held resources — database connection pools, message queue connections, open file handles — each typically through its own async `.close()` or `.disconnect()` method, awaited in turn. Once everything is cleaned up, either let the process exit naturally with `process.exitCode` set appropriately, or call `process.exit(0)` explicitly — now genuinely safe, since nothing is left pending that could be cut off.

### ⏱️ Guarding Against Cleanup That Hangs

A safety-net timeout is worth adding: something like `setTimeout(() => process.exit(1), gracePeriodMs).unref()`, forcing an exit if cleanup hasn't finished within a reasonable window matching whatever grace period the orchestrator allows before escalating to `SIGKILL`, covered earlier in this chapter. The `.unref()` call ensures this safety-net timer doesn't itself keep the process alive if shutdown completes normally before the timeout fires.

### 💎 Good to Know: Guard Against the Handler Running Twice

A second `SIGTERM` arriving while cleanup from the first is still in progress can re-trigger the same shutdown logic. A simple flag checked at the top of the handler, skipping re-entry if shutdown is already running, avoids double-cleanup issues and confusing, duplicated log output during an already-stressful shutdown event.

### ❓ Follow-up Interview Questions

1. Why does calling `server.close()` first, before closing database connections, matter for handling in-flight requests correctly?
2. What would happen if the safety-net timeout in a shutdown handler didn't call `.unref()`?
3. Why might a second `SIGTERM` arriving mid-shutdown cause problems if the handler isn't guarded against re-entry?
4. How would you decide what grace period to use for the safety-net timeout in a real production system?
5. Why does this pattern make `process.exit(0)` safe to call at the very end, when it wasn't safe to call earlier in the chapter's examples?

---

## 11. What are common mistakes or risks when working with `process.exit()` and global process event handlers?

### 📖 Introduction

Most of the individual risks in this chapter show up repeatedly as real-world mistakes — this question rounds them up as a single, practical checklist.

### ⚠️ Calling `process.exit()` Reflexively

Using `process.exit()` as a default way to end a program, rather than setting `process.exitCode` and letting the process exit naturally, risks cutting off pending async work — unflushed logs, in-flight database writes, network responses still being sent — exactly the risk covered earlier in this chapter.

### ⚠️ Using Global Error Handlers to Swallow Errors

Using `uncaughtException` or `unhandledRejection` handlers to suppress an error and keep the process running as if nothing happened directly contradicts Node.js's own guidance that post-exception application state is unreliable. Continuing to run risks operating on corrupted in-memory state, silently producing wrong results instead of failing cleanly and visibly.

### ⚠️ Not Guarding Against Duplicate Signal Handling

A second `SIGTERM` arriving mid-shutdown, re-triggering the same cleanup logic, can cause errors like trying to close an already-closing database connection, or duplicate log entries that make debugging an actual shutdown issue harder rather than easier — the idempotency guard covered in the previous question is the direct fix.

### ⚠️ Forgetting a Grace-Period Safety Net

If shutdown cleanup logic hangs — waiting on a connection that will never actually close due to a bug — the process never exits at all, which either delays an orchestrator's escalation to `SIGKILL` unnecessarily or results in a stuck deployment. The timeout-plus-`unref()` pattern covered in the previous question is the direct mitigation.

### ⚠️ Registering Global Hooks Inside Library Code

A reusable library that registers its own `process.on('SIGTERM', ...)` or `process.on('exit', ...)` handler can silently interfere with the consuming application's own shutdown logic — competing cleanup order, or swallowing a signal the application also needed to react to. As a general principle, these particular global hooks are usually the responsibility of the top-level application, not something a library should register on its own without a very good, explicit reason.

### 💎 Good to Know: A Script Needing `process.exit()` to Terminate Is a Symptom Worth Investigating

Overusing `process.exit()` inside scripts or test suites as a shortcut to "just stop everything now" can mask an underlying issue — an open handle or leaked connection that should have let the Event Loop drain naturally but didn't. If a script genuinely needs `process.exit()` to terminate, that's often itself worth investigating rather than simply working around.

### ❓ Follow-up Interview Questions

1. Why might a library registering its own `SIGTERM` handler cause problems for an application that also has its own shutdown logic?
2. What's a realistic scenario where a script needing `process.exit()` to terminate reveals a genuine underlying bug?
3. Why does swallowing an `uncaughtException` and continuing to run risk worse outcomes than exiting cleanly?
4. How would you audit an existing codebase for library code that shouldn't be registering global process event handlers?
5. What would you look for first if a graceful shutdown handler seemed to run its cleanup logic twice during a single deployment?

---