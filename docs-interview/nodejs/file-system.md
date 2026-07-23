---
title: File System (fs)
description: Reading, writing, and streaming files — sync vs async vs promises API.
sidebar_position: 6
---

# File System (fs)

## 1. What is the `fs` module, and what is the difference between synchronous and asynchronous file operations?

### 📖 Introduction

The `fs` module is one of Node.js's original, most heavily used core modules, and it's also the clearest real-world example of the sync-versus-async trade-off discussed throughout the Event Loop chapter.

### 📁 What the `fs` Module Is

`fs` is Node.js's built-in module for interacting with the file system — reading, writing, updating, and deleting files and directories, checking file permissions and metadata, and watching for changes. It's available through `require('fs')` or `import fs from 'fs'` with zero external dependencies.

### ⏸️ Synchronous vs. Asynchronous Operations

Most `fs` operations are offered in multiple parallel styles: synchronous (`fs.readFileSync`), callback-based asynchronous (`fs.readFile`), and Promise-based asynchronous (covered in more depth later in this chapter). Synchronous methods block the calling thread entirely until the operating system finishes the operation — simple to reason about, but they tie up the Event Loop completely for that duration, exactly the blocking concern covered in the Event Loop chapter. Asynchronous methods delegate the actual work to libuv, as covered in that chapter's walkthrough of `fs.readFile()`, letting the main thread stay free in the meantime.

### 🎯 When Each Style Is Appropriate

Synchronous methods are generally acceptable only at application startup or in one-off scripts — reading a configuration file once before a server starts listening, where nothing else is happening concurrently anyway. They're not appropriate inside a request handler or any code path that runs repeatedly under load, since blocking there directly hurts every concurrently connected user. Asynchronous methods, whether callback-based or Promise-based, are the default choice for anything running as part of ongoing server operation.

### 💎 Good to Know: The Naming Convention Is a Reliable Signal

Any `fs` method ending in `Sync` — `readFileSync`, `writeFileSync`, `existsSync` — is blocking by design. The same method name without that suffix is the asynchronous version. This naming pattern is consistent across the entire module and is a genuinely reliable way to spot a potentially blocking call at a glance.

### ❓ Follow-up Interview Questions

1. Why is it acceptable to use `fs.readFileSync()` when a server first starts up, but not inside a request handler?
2. What would actually happen to concurrent requests if a request handler used a synchronous `fs` method under load?
3. Why does Node.js offer three different calling styles for the same underlying file operations instead of just one?
4. How would you spot a potentially blocking `fs` call just by reading unfamiliar code?
5. Is there ever a legitimate reason to use a synchronous `fs` method inside a long-running server process, beyond startup?

---

## 2. How do you read, write, append, rename, and delete files using the `fs` module?

### 📖 Introduction

These five operations cover the vast majority of everyday file manipulation in a Node.js application, and each one has a specific method with its own small behavioral nuance worth knowing precisely.

### 📖 Reading a File

`fs.readFile(path, encoding, callback)` reads a file's entire contents. Specifying an encoding, such as `'utf8'`, returns a string; omitting it returns a raw `Buffer` instead — a detail that trips up many developers the first time they encounter it.

### ✏️ Writing and Appending

`fs.writeFile(path, data, callback)` overwrites a file's entire contents, creating the file if it doesn't already exist. `fs.appendFile(path, data, callback)` instead adds data to the end of an existing file — also creating it if needed — without touching whatever content was already there.

### 🔀 Renaming

`fs.rename(oldPath, newPath, callback)` renames or moves a file. This generally works smoothly within the same filesystem or volume; renaming across different filesystems or volumes can fail, sometimes requiring a manual copy-then-delete approach instead.

### 🗑️ Deleting

`fs.unlink(path, callback)` deletes a file. The name is a common small point of confusion — it's not called `deleteFile`, because the name comes directly from the underlying POSIX system call it wraps.

### 💎 Good to Know: Every One of These Has Sync and Promise-Based Counterparts

Following the naming convention covered earlier in this chapter, each of these methods has a synchronous counterpart (`fs.readFileSync`, `fs.writeFileSync`, and so on) and a Promise-based counterpart through `fs/promises`, covered next in this chapter.

### ❓ Follow-up Interview Questions

1. Why does `fs.readFile()` return a `Buffer` instead of a string if no encoding is specified?
2. What's the practical difference between `fs.writeFile()` and `fs.appendFile()` if both are called on a file that already exists?
3. Why might `fs.rename()` fail when moving a file across two different filesystems or volumes?
4. Why is the delete method called `unlink` instead of something like `deleteFile`?
5. What would happen if `fs.writeFile()` were called on a path that doesn't exist yet, versus one that does?

---

## 3. What is the `fs/promises` module, and how does it differ from callback-based and synchronous APIs?

### 📖 Introduction

Modern Node.js code overwhelmingly favors this Promise-based interface over the original callback-based `fs` API, and understanding exactly what's different — and what isn't — clarifies why.

### 🤝 What `fs/promises` Is

`fs/promises` is a dedicated, Promise-based API surface for the `fs` module, accessible through `require('fs/promises')` or `require('fs').promises`. Every method returns a Promise instead of accepting a callback, which enables clean, direct use with `async`/`await`.

### 🆚 How It Differs From the Callback-Based API

Functionally, the operations are equivalent — `fs.readFile(path, callback)` becomes `await fsPromises.readFile(path)`. There's no behavioral difference in what actually happens at the OS or libuv level, as covered in the Event Loop chapter's walkthrough of `fs.readFile()` — the same thread pool delegation happens either way. The only real difference is how the result gets delivered back to the calling code.

### 🆚 How It Differs From the Synchronous API

The synchronous API blocks the calling thread entirely until the operating system returns a result. `fs/promises` methods, like the callback-based API before them, don't block at all — they delegate the work to libuv and resolve or reject once it completes, letting other code run in the meantime.

### 🎯 Why `fs/promises` Is Generally Preferred Today

Using `fs/promises` avoids the callback hell problem covered in the Event Loop chapter for any code that used to require nested `fs.readFile` calls — reading several files in sequence or in parallel becomes clean, linear `async`/`await` code, or a `Promise.all()` call for genuinely parallel reads.

### 💎 Good to Know: This Module Arrived Later Than the Original `fs` API

The callback-based `fs` module dates back to Node.js's very earliest versions, while `fs/promises` was added considerably later. Because of this history, older codebases sometimes manually wrap `fs.readFile` using Node's `util.promisify()` to get Promise-based behavior, rather than using the native `fs/promises` module directly — worth recognizing if it shows up in an older codebase.

### ❓ Follow-up Interview Questions

1. Does using `fs/promises` instead of the callback-based API change anything about how libuv handles the underlying file operation?
2. Why might an older Node.js codebase use `util.promisify(fs.readFile)` instead of importing from `fs/promises` directly?
3. How would you read three unrelated files in parallel using `fs/promises`, and why would that be faster than reading them sequentially?
4. What's the actual difference between `fs/promises` and simply wrapping the synchronous API in a Promise manually?
5. Why does `fs/promises` still ultimately rely on libuv's thread pool the same way the callback-based API does?

---

## 4. What happens internally when `fs.readFile()` is executed?

### 📖 Introduction

The Event Loop chapter already walked through `fs.readFile()`'s journey through libuv's thread pool and the poll phase in detail. This question focuses on the part specific to the file system itself — what actually happens to the file on disk during that call.

### 📂 Opening the File

Node's C++ binding layer requests that libuv open a file descriptor for the given path, using the operating system's underlying `open` system call. This file descriptor is the OS-level handle that all subsequent reading actually happens through.

### 📥 Reading the Contents

Once the file is open, a libuv thread pool worker reads its contents into memory. For a single `readFile()` call, this generally means reading the file's entire contents into one buffer — for a large file, this can involve multiple internal read operations looping until the end of the file is reached, all still happening on that one worker thread, invisible to the calling JavaScript code.

### 🔒 Closing the Descriptor and Returning Data

Once every byte has been read, the file descriptor is closed to release the underlying OS resource. If an encoding option like `'utf8'` was provided, the raw bytes are decoded into a string at this point; otherwise, the raw `Buffer` is what ultimately gets returned. The resulting data, or an error, is then queued as a callback, handed back through the Event Loop exactly as described in the Event Loop chapter's account of this same call.

### 💎 Good to Know: This Whole-File Behavior Is the Root of a Real Limitation

Because `readFile()` loads a file's entire contents into memory before returning anything to the caller, memory usage scales directly with file size, and nothing becomes available until the entire read finishes. This is fine for something like a small configuration file, but it's precisely the limitation that makes `readFile()` a poor choice for very large files — the exact problem Streams, covered next in this chapter, are designed to solve.

### ❓ Follow-up Interview Questions

1. Why does reading a very large file with `readFile()` potentially require multiple internal read operations on a single worker thread?
2. At what point during this process does encoding conversion, like decoding bytes to a UTF-8 string, actually happen?
3. Why does the file descriptor need to be explicitly closed, and what would happen if it weren't?
4. How does this file-system-level view of `fs.readFile()` connect back to the Event Loop and libuv account covered in the Event Loop chapter?
5. What would you expect memory usage to look like while reading a 5GB file with `fs.readFile()`?

---

## 5. Why are Streams preferred over `readFile()` for processing large files?

### 📖 Introduction

The previous question ended on `readFile()`'s core limitation for large files — this question is about exactly why Streams solve that problem, ahead of their own dedicated chapter later in this guide.

### 🧱 The Core Problem With `readFile()` for Large Files

`readFile()` loads an entire file into memory before returning anything at all. A 2GB file means at least 2GB of memory used just to hold its contents, and the caller has to wait for the entire read to finish before doing anything with the data whatsoever.

### 🌊 What Streams Do Differently

Streams process data in small chunks as they become available, rather than waiting for the whole file. A Readable stream delivers data piece by piece as bytes arrive from disk, letting code begin processing the first chunk while later chunks are still being read — rather than waiting on the entire file.

### 💾 Why This Is Dramatically More Memory Efficient

Memory usage stays roughly constant, bounded by a small chunk size — often a default around 64KB — regardless of the total file size. Processing a 2GB file through a stream uses roughly the same small amount of memory as processing a 2MB file, since only a small chunk is ever held in memory at any given moment.

### 🔧 A Concrete Example

Copying a large file with `fs.createReadStream(src).pipe(fs.createWriteStream(dest))` streams data through in chunks without ever loading the whole file into memory at once — compared to reading the entire source with `readFile()` and then writing the entire result with `writeFile()`, which would require holding the whole file in memory simultaneously.

### 💎 Good to Know: This Idea Extends Well Beyond Files

The same "process in chunks instead of all-at-once" principle applies anywhere data arrives progressively over time rather than being available all at once — HTTP request and response bodies, TCP sockets, and more. Streams get a full chapter of their own next in this guide, going much deeper into backpressure and the different stream types.

### ❓ Follow-up Interview Questions

1. Why does memory usage stay roughly constant when streaming a file, regardless of the file's total size?
2. What would happen to memory usage if `fs.createReadStream` and `fs.createWriteStream` were replaced with `readFile()` and `writeFile()` for a multi-gigabyte file copy?
3. Why can a stream start processing data before the entire source is available, while `readFile()` cannot?
4. Beyond files, what's another real-world scenario where processing data in chunks matters just as much?
5. Is there a file size below which `readFile()` is genuinely simpler and just as reasonable a choice as streaming?

---

## 6. What is `fs.watch()`, and what are its limitations?

### 📖 Introduction

`fs.watch()` is genuinely useful for reacting to file changes, but it comes with enough platform-specific rough edges that it's worth knowing precisely where it falls short.

### 👀 What `fs.watch()` Is

`fs.watch()` watches a file or directory for changes, emitting a `'change'` event — an `EventEmitter`-based pattern, tying back to the EventEmitter chapter earlier in this guide — whenever something modifies the watched path. It's implemented using OS-native file system notification mechanisms: inotify on Linux, FSEvents on macOS, and ReadDirectoryChangesW on Windows. It returns an `FSWatcher` object that can be closed to stop watching.

### ⚠️ Its Limitations

- **Platform inconsistency** — because it's built on different native mechanisms per operating system, behavior isn't perfectly consistent across platforms; the `filename` argument passed to the callback isn't always reliably provided everywhere, for instance.
- **Inconsistent recursive watching** — the `recursive` option, for watching an entire directory tree, hasn't historically been supported with the same reliability across every platform.
- **Duplicate events for a single logical change** — a single file save can trigger multiple `'change'` events, depending on how a given editor or OS actually performs the write, such as writing to a temporary file and then renaming it.
- **Poor support on network filesystems** — remote or network-mounted filesystems, like NFS mounts, often don't reliably support the underlying OS notification mechanisms at all, meaning changes there may simply go undetected.
- **No built-in debouncing** — rapid, successive changes fire rapid, successive events, requiring custom debounce or throttle logic to react to a "settled" state rather than every individual blip.

### 💎 Good to Know: Most Real Tooling Doesn't Use `fs.watch()` Directly

Because of these inconsistencies, many real-world tools — build watchers, development servers — rely on a well-tested third-party library, commonly `chokidar`, built on top of `fs.watch()` and `fs.watchFile()` that smooths over these platform differences, rather than using the raw API directly in production tooling.

### ❓ Follow-up Interview Questions

1. Why might a single file save trigger more than one `'change'` event from `fs.watch()`?
2. Why does `fs.watch()` behave differently on Linux, macOS, and Windows, given it's the same JavaScript API?
3. What would you use instead of raw `fs.watch()` if you needed reliable file watching across every major platform?
4. Why might changes made on a network-mounted drive fail to trigger any `fs.watch()` event at all?
5. How would you implement debouncing on top of `fs.watch()` to avoid reacting to every intermediate write during a single save?

---

## 7. How do you handle errors while performing file operations?

### 📖 Introduction

Each of the three `fs` calling styles covered in this chapter — callback, Promise-based, and synchronous — surfaces errors in its own distinct way, and mixing up the expected pattern for each is a common source of bugs.

### 📞 Errors in the Callback Style

Node.js's error-first callback convention means the first argument to a callback is always either `null`, on success, or an `Error` object, on failure — `fs.readFile(path, (err, data) => { if (err) { /* handle it */ } })`. This check needs to happen before using `data` at all.

### 🤝 Errors in the Promise-Based Style

With `fs/promises`, errors surface as a rejected Promise, caught either with a `.catch()` or a `try`/`catch` block wrapped around an `await` call.

### 💥 Errors in the Synchronous Style

Synchronous methods like `readFileSync` throw an actual exception synchronously, which needs to be wrapped directly in a `try`/`catch` block around the call itself — a different handling shape than either of the async styles above.

### 🏷️ Recognizing Specific Error Codes

Several `fs` error codes come up often enough to be worth recognizing by name: `ENOENT` for a path that doesn't exist, `EACCES` for a permissions failure, `EISDIR` when a file was expected but a directory was found instead, and `EEXIST` for an operation like exclusive file creation that fails because the target already exists. Checking `err.code` allows handling these specific scenarios differently, rather than treating every failure identically.

### 💎 Good to Know: A Silently Skipped Error Check Can Be Worse Than a Crash

Forgetting to check for an error in callback-style code doesn't always crash the process loudly — sometimes it means the code goes on to use `undefined` data as if the operation had succeeded, silently corrupting whatever happens next rather than failing visibly. A loud crash is at least immediately noticeable; a silent, incorrect continuation often isn't. The Error Handling chapter later in this guide covers this class of problem in much more depth.

### ❓ Follow-up Interview Questions

1. Why does a synchronous `fs` method require a different error-handling pattern than its callback-based counterpart?
2. What's the risk of checking `if (data)` instead of `if (err)` in an error-first callback?
3. Why might checking `err.code` specifically be more useful than just checking whether `err` is truthy?
4. What would happen if a `fs/promises` rejection wasn't caught anywhere in an `async` function?
5. Why can a silently skipped error check sometimes be more dangerous than an unhandled crash?

---

## 8. What are common security considerations when working with the file system, such as directory traversal?

### 📖 Introduction

Any code path that touches the file system based on user-controlled input opens the door to a well-known class of vulnerabilities — directory traversal being the most common of them.

### 🚨 Directory Traversal (Path Traversal)

A directory traversal attack manipulates a file path input — say, a filename passed through a URL parameter — to include sequences like `../../../etc/passwd`, attempting to escape the intended directory and reach arbitrary files elsewhere on the filesystem. If an application blindly concatenates user input into a file path, like `fs.readFile('./uploads/' + userProvidedFilename)`, and serves back whatever it finds, an attacker could read sensitive files — credentials, source code, other users' data — entirely outside the intended folder.

### 🛡️ How to Prevent It

The most reliable technique is resolving the final path with `path.resolve()` and confirming the result still starts with the intended base directory, rather than trying to blocklist specific patterns like `../`, which can be bypassed through encoding tricks or platform-specific path quirks. Where possible, an allowlist approach — mapping a safe identifier to an actual file path through a lookup, rather than accepting a raw filename from user input at all — sidesteps the problem entirely.

### 🔓 Other File System Security Considerations

- **Excessive file permissions** — running a Node.js process with overly broad filesystem access, such as running as root, increases the blast radius of any file-related vulnerability that does occur.
- **Symlink attacks** — an attacker-controlled symbolic link can redirect a seemingly safe file operation toward an unintended target, particularly relevant for systems processing untrusted uploaded files.
- **Uncontrolled resource consumption** — accepting file uploads or writes without size or rate limits can exhaust disk space, a form of denial of service.
- **Unvalidated file types** — allowing uploads without validating type or content can lead to serving malicious executable content back to other users later.

### 💎 Good to Know: An Incomplete Fix Is a Common Real Mistake

Blocklisting the literal string `../` without properly resolving and normalizing the path first is a common, incomplete fix that can still be bypassed. Directory traversal remains a genuinely common real-world vulnerability precisely because file-serving and file-upload features are so common in web applications, while the reliable fix — validating the resolved path stays within bounds — is simple but easy to implement only halfway.

### ❓ Follow-up Interview Questions

1. Why is resolving and checking the final absolute path more reliable than blocklisting `../` in the input string?
2. How could an attacker bypass a naive filter that only blocks the literal string `../`?
3. Why does running a Node.js process with root-level permissions increase the severity of a directory traversal vulnerability?
4. What's a concrete example of a symlink attack against a file-processing system?
5. Why is an allowlist-based approach, mapping IDs to files, considered more robust than sanitizing raw filenames?

---

## 9. How would you design a file upload system for handling large files, and how would you secure it against directory traversal attacks?

### 📖 Introduction

This question combines the two previous ones — large file handling and file system security — into one of the most common, genuinely security-and-performance-sensitive features in real-world Node.js applications.

### 🌊 Handling Large Files: Stream, Don't Buffer

The core principle is never buffering an entire upload into memory before writing it anywhere, for the same reason `readFile()` is a poor fit for large files, covered earlier in this chapter. Since an incoming HTTP request body is itself a readable stream, it can be piped directly to a write stream — on disk or to cloud storage — as data arrives, keeping memory usage bounded regardless of upload size. In practice, this means using a well-tested, stream-based multipart parsing library, such as `busboy` or `multer`, rather than manually accumulating request chunks into one large buffer, which would defeat the entire purpose of streaming.

### 🔒 Securing the Upload Path

- **Never use the client-provided filename to construct the destination path** — generate a new, safe identifier server-side, such as a UUID, and store the original filename separately as metadata if it's needed for display. This sidesteps directory traversal entirely by never trusting client input for the actual file path in the first place.
- **Validate file type and size limits during the stream**, not only after the full upload completes, rejecting early to avoid wasting bandwidth and disk space on an oversized or disallowed file.
- **Store uploaded files outside the web server's publicly servable root**, or behind an access-controlled endpoint, so a successfully uploaded malicious file can't simply be requested and executed by visiting its URL directly.
- **Set correct `Content-Type` and `Content-Disposition` headers when serving uploaded files back**, preventing a browser from executing an uploaded file as a script — a concern covered in more depth in the Security chapter later in this guide.

### 💎 Good to Know: This Is Two Chapter Concepts Applied Together

The two guiding principles here — stream instead of buffering, for handling scale, and never trust a client-provided path, for security — are exactly the ideas covered separately earlier in this chapter, applied together to one of the most common real-world features a Node.js backend implements.

### ❓ Follow-up Interview Questions

1. Why would manually buffering an entire upload into memory before writing it to disk defeat the purpose of using streams at all?
2. Why is generating a server-side identifier for the stored filename a stronger defense than sanitizing the client-provided filename?
3. What's the benefit of validating file size and type during the upload stream rather than only after it completes?
4. Why does storing uploaded files outside the public web root matter, even if the filename itself is already safe?
5. How would this design change if uploads needed to go directly to cloud object storage instead of local disk?

---

## 10. Explain the complete lifecycle of a file read operation in Node.js, including how libuv handles it.

### 📖 Introduction

This question pulls together everything covered separately throughout this chapter — the OS-level mechanics of reading a file, and libuv's thread pool delegation — into one continuous walkthrough.

### 📞 The Call

Application code calls `fs.readFile(path, callback)`, or `await fsPromises.readFile(path)` in the Promise-based style covered earlier in this chapter. Node's internal C++ binding layer hands this request off to libuv.

### 🧵 Delegating to the Thread Pool

Since most operating systems lack a good native asynchronous system call specifically for filesystem operations, as covered in the Node.js Architecture chapter, libuv queues the work onto its internal thread pool. A pool thread then opens a file descriptor, reads the file's bytes — potentially in a loop until reaching the end of the file for larger files — and closes the descriptor once finished, exactly as detailed earlier in this chapter.

### 🕰️ The Main Thread Stays Free

While that pool thread does this work, the main JavaScript thread remains completely free. The Call Stack has nothing to do with this operation during this time, and the Event Loop continues cycling through its other phases, servicing whatever other work is pending.

### 📥 Returning the Result

Once the pool thread finishes, libuv queues the result — the file's data, decoded if an encoding was specified, along with any error — as a callback in the Event Loop's poll phase. On its next pass through that phase, the Event Loop pushes the callback onto the now-empty Call Stack, and V8 executes it, running the original callback or resuming an awaited `async` function with the resulting data or error.

### 💎 Good to Know: The Lifecycle Is Identical Regardless of Calling Style

This entire lifecycle — file descriptor handling, thread pool delegation, the poll phase, Call Stack execution — is the same underlying mechanism whether the call was made through the callback style or through `fs/promises`. The only difference, as covered earlier in this chapter, is how the result gets delivered back to application code, not anything about the lifecycle itself.

### ❓ Follow-up Interview Questions

1. At what point in this lifecycle does the main JavaScript thread become involved again after initiating the read?
2. Why does this lifecycle look the same regardless of whether `fs.readFile()` or `fsPromises.readFile()` was called?
3. What specifically happens on the pool thread that never touches the main JavaScript thread at all?
4. Why does the callback land in the poll phase specifically, rather than the timers or check phase?
5. How would this lifecycle change if the file being read were on a slow network-mounted drive rather than local disk?

---

## 11. What are the performance considerations when performing thousands of file operations simultaneously?

### 📖 Introduction

The non-blocking `fs` API can create a misleading impression of unlimited concurrency — this question is about the very real, fixed-size bottleneck sitting underneath it.

### 🧵 The Thread Pool Bottleneck

libuv's default thread pool size is just four threads, configurable through the `UV_THREADPOOL_SIZE` environment variable. If thousands of `fs` operations are queued at once, they all compete for those same threads — meaning only a handful can actually be doing OS-level work at any given instant, with the rest queued and waiting, even though every JavaScript-level call appeared to "return immediately."

### ⚠️ The Practical Implication

Naively firing off thousands of concurrent `fs.readFile()` calls, say through `Promise.all()` over a large array of file paths, doesn't mean thousands of simultaneous reads are happening. It means thousands of queued requests slowly draining through a handful of threads — often much slower in aggregate than expected — and it can starve other, unrelated operations that share the same thread pool, like certain DNS lookups or crypto operations.

### 🛠️ Mitigation Strategies

- **Increase `UV_THREADPOOL_SIZE`** — a legitimate lever, set before the process starts, though it has real limits: a machine only has so many CPU cores, and adding far more threads than cores can start hurting performance through added context-switching overhead rather than helping.
- **Explicitly limit concurrency** — processing files in controlled batches, rather than firing every request at once, often performs better in practice than unbounded concurrency, since it avoids excessive queueing and thread contention.
- **Prefer streaming over buffering whole files**, as covered earlier in this chapter, when processing many large files, reducing the memory and time each individual operation holds onto a thread pool worker.
- **Reconsider the architecture for very high-throughput needs** — a dedicated service, a database instead of raw files, or object storage accessed over HTTP, which relies on the OS's native async networking rather than the `fs` thread pool, may be a better fit than pushing raw filesystem I/O through Node.js at scale.

### 💎 Good to Know: The API's Feel and the Underlying Architecture Diverge Here

This is a genuinely common, subtle performance trap precisely because the JavaScript-facing API feels infinitely concurrent — non-blocking calls that return immediately — while the underlying OS-level work is actually bottlenecked by a small, fixed-size thread pool. Reasoning correctly about real-world throughput requires understanding the actual architecture underneath, not just the async syntax on the surface.

### ❓ Follow-up Interview Questions

1. Why doesn't firing off a thousand `fs.readFile()` calls at once mean a thousand simultaneous OS-level reads are happening?
2. What's the risk of setting `UV_THREADPOOL_SIZE` far higher than the number of available CPU cores?
3. Why might explicitly limiting concurrency to a smaller batch size actually be faster than unbounded concurrency?
4. How could a flood of `fs` operations end up slowing down unrelated DNS lookups happening in the same application?
5. At what point would you consider moving file-heavy work out of Node.js's thread pool entirely, into a different architecture?

---