---
title: Networking
description: Building TCP/HTTP servers with Node's built-in networking modules.
sidebar_position: 12
---

# Networking

## 1. What is the HTTP module, and how do you create a basic HTTP server with it?

### 📖 Introduction

Every Node.js web framework — Express, Fastify, Koa — is built on top of one foundational, built-in module, and understanding it directly demystifies what those frameworks are actually doing underneath.

### 🌐 What the HTTP Module Is

`http`, available through `require('http')` with zero external dependencies, is Node.js's built-in module for creating HTTP servers and clients. It's the low-level foundation frameworks are built on top of, not something separate from or competing with them.

### 🛠️ Creating a Basic Server

`http.createServer((req, res) => { ... }).listen(port)` creates a server whose callback function runs once for every incoming request, receiving a Request object (`req`) and a Response object (`res`) as arguments — covered in depth in the next question. `.listen(port)` binds the server to a specific port and begins accepting connections.

### 📝 A Simple Concrete Example

```js
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
}).listen(3000);
```

`writeHead` sets the status code and headers, and `end()` sends the response body and signals that the response is complete.

### 🔗 How This Connects to Earlier Chapters

The `http` module is built entirely on patterns covered earlier in this guide: the server itself is an `EventEmitter`, emitting `'request'`, `'connection'`, and `'close'` events, tying back to the EventEmitter chapter, and both `req` and `res` are streams, tying back to the Streams & Buffers chapter. Understanding those two chapters is exactly what makes the `http` module's design feel coherent rather than arbitrary.

### 💎 Good to Know: `http.createServer()` Alone Is a Complete Server

A framework isn't required to build a working Node.js web server — `http.createServer()` on its own is fully functional. Frameworks add convenience and structure, like routing, middleware, and body-parsing helpers, on top of this exact same foundation, a comparison this chapter returns to later.

### ❓ Follow-up Interview Questions

1. Why is the `http` module described as a foundation rather than an alternative to a framework like Express?
2. What does the callback passed to `http.createServer()` actually receive, and when does it get invoked?
3. Why does understanding `EventEmitter` and Streams make the `http` module's design feel more coherent?
4. What would a client actually see if a server called `res.writeHead()` but never called `res.end()`?
5. What's the minimum code needed to create a working HTTP server in Node.js, with no external dependencies at all?

---

## 2. What are the Request and Response objects, and how do they interact during a request?

### 📖 Introduction

Every request handler in Node.js works with the same two objects, and both of them are direct, concrete applications of the Streams chapter covered earlier in this guide.

### 📥 The Request Object

`req`, an instance of `http.IncomingMessage`, represents the incoming request from a client. It's a Readable stream, since a request body — POST data, for instance — arrives progressively over the network rather than all at once. It exposes properties like `req.url`, `req.method`, and `req.headers`.

### 📤 The Response Object

`res`, an instance of `http.ServerResponse`, represents the outgoing response being built to send back to the client. It's a Writable stream, with methods like `res.writeHead(statusCode, headers)` to set the status and headers, `res.write(chunk)` to send a piece of the response body — callable multiple times for streaming output — and `res.end([data])` to finish the response.

### 🔗 How They Interact During a Single Request

Both objects are created fresh for each incoming request, since the server's `'request'` event fires once per request. `req` is read from to get input data, and `res` is written to in order to produce output. They're conceptually a pair representing the two halves of a single HTTP transaction, but they're technically independent stream objects, connected only by both being passed to the same request handler callback.

### 🧩 A Concrete Detail Worth Knowing

Reading a POST request's body requires listening to `req`'s `'data'` events, or piping it, as chunks arrive, and accumulating them manually — the `http` module doesn't automatically parse or buffer the body. This is exactly why body parsing feels considerably more manual without a framework, a point this chapter returns to later.

### 💎 Good to Know: Everything From the Streams Chapter Applies Directly Here

Because both `req` and `res` are genuine streams, everything covered in the Streams & Buffers chapter — backpressure, `highWaterMark`, piping — applies directly to them. `res` respecting backpressure while writing a large response body matters just as much here as it did for streaming a large file to disk.

### ❓ Follow-up Interview Questions

1. Why is `req` a Readable stream rather than an object that already contains the full request body?
2. What would happen if a request handler tried to read `req.body` directly without a framework or manual parsing?
3. Why can `res.write()` be called multiple times before `res.end()` finishes the response?
4. How does backpressure, covered in the Streams & Buffers chapter, apply specifically to a large response being sent through `res`?
5. Are `req` and `res` genuinely linked to each other internally, or just conventionally paired by being passed to the same callback?

---

## 3. What is the lifecycle of an HTTP request in Node.js?

### 📖 Introduction

This question ties together the TCP connection, the streaming Request and Response objects, and the Event Loop into one continuous sequence, from a client opening a connection to a response being sent back.

### 🔌 Connection

A client opens a TCP connection to the server's listening port, and the OS-level TCP handshake happens, tying back to the networking mechanisms covered in the Node.js Architecture chapter. Node.js's `http` module, built on top of the lower-level `net` module's TCP server, accepts this connection.

### 📜 Parsing

As data arrives over the socket, Node.js's internal HTTP parser incrementally parses the raw bytes into a structured request — the request line first, containing the method, URL, and HTTP version, then headers, then eventually the body if one is present. This happens progressively as bytes stream in over the network, the same "data arrives over time" idea covered in the Streams & Buffers chapter.

### 📣 The `'request'` Event

Once Node.js has parsed enough of the incoming data to construct the request line and headers — not necessarily the full body yet, which may still be arriving — the `http.Server` object emits a `'request'` event, invoking the callback passed to `createServer()` with the `req` object and a fresh `res` object, as covered in the previous question.

### ⚙️ Handling

Application code inside that callback reads from `req`, potentially continuing to receive body data as more arrives, and writes to `res` to build the response. This might happen synchronously, or it might involve awaiting further async work, like a database call covered in the Database Integration chapter later in this guide, before actually calling `res.end()`.

### 📤 Response and Connection Handling

Once `res.end()` is called, the response is flushed back to the client over the same TCP connection. Depending on HTTP keep-alive settings, covered later in this chapter, the underlying TCP connection may then be reused for a subsequent request from the same client, or closed.

### 💎 Good to Know: This Lifecycle Is Built Entirely on Earlier Chapters

This entire sequence — the TCP connection, incremental HTTP parsing, the `'request'` event firing once headers are ready, streaming body consumption, and the eventual response flush — is built directly on Streams for progressive data, `EventEmitter` for the `'request'` event, and the Event Loop and libuv for the underlying non-blocking socket I/O, all covered earlier in this guide. A genuinely senior answer names these connections explicitly, rather than describing `http` as some isolated, self-contained black box.

### ❓ Follow-up Interview Questions

1. Why can the `'request'` event fire before the entire request body has finished arriving?
2. How does the underlying TCP connection relate to Node.js's non-blocking socket I/O covered in the Node.js Architecture chapter?
3. What would happen to a request handler that tried to read the full request body synchronously before the body had finished streaming in?
4. Why does keep-alive allow a TCP connection to be reused across multiple requests rather than opening a new one each time?
5. How would you explain this entire lifecycle to someone who's only ever used a framework and never touched the raw `http` module?

---

## 4. How do you implement routing and parse query parameters/request bodies without a framework like Express?

### 📖 Introduction

Everything a framework does automatically has to be handled by hand when working directly with the `http` module — this question walks through exactly what that manual work looks like.

### 🧭 Routing Without a Framework

Since `http.createServer()`'s callback receives every request regardless of path or method, routing has to be implemented manually — inspecting `req.url` and `req.method` and writing conditional logic, or a manually built lookup table mapping path-and-method combinations to handler functions, to dispatch each request to the correct handler.

### 🔍 Parsing Query Parameters

Constructing `new URL(req.url, base)`, using the request's host header as the base URL, and reading its `.searchParams` property gives a `URLSearchParams` object, and calling `.get('paramName')` retrieves individual query string values. Node.js's built-in `url` module implements the same WHATWG URL API also available in browsers, so a project doesn't need to reimplement query string parsing from scratch even without a framework.

### 📦 Parsing the Request Body

As covered in the previous question, `req` doesn't parse its body automatically. Reading it requires listening to `req`'s `'data'` events, accumulating chunks into an array as they arrive, and once the `'end'` event fires — signaling the full body has arrived — joining those chunks together and parsing the result, using `JSON.parse()` for a JSON body, or manual parsing for `application/x-www-form-urlencoded` data. An `req.on('error', ...)` handler is worth adding too, the same error-handling discipline covered in the File System chapter applied here.

### 🧩 A Concrete Sketch

In prose: accumulate chunks with `req.on('data', chunk => chunks.push(chunk))`, then inside `req.on('end', ...)`, join the chunks with `Buffer.concat(chunks).toString()` and parse the result.

### 💎 Good to Know: This Manual Process Is Exactly What Middleware Replaces

Understanding how to do this by hand is valuable precisely because it demystifies what a framework's body-parsing middleware is actually doing underneath — rather than treating something like `req.body` in Express as magic that simply works.

### ❓ Follow-up Interview Questions

1. Why does `req.url` need to be parsed with the `url` module rather than just split on `?` manually?
2. What would happen if a handler tried to `JSON.parse()` the request body before the `'end'` event had fired?
3. Why is a lookup table mapping paths and methods to handlers a cleaner approach than a long chain of `if`/`else` statements?
4. What's the risk of not handling `req.on('error', ...)` when manually accumulating a request body?
5. How does understanding this manual process change how you'd think about a framework's body-parsing middleware?

---

## 5. How does the HTTP module support persistent (keep-alive) connections?

### 📖 Introduction

Keep-alive is one of those features that quietly works in the background most of the time, until a specific configuration mismatch turns it into a genuinely confusing production bug.

### 🔗 What Keep-Alive Is

Keep-alive, the default behavior in HTTP/1.1, allows a single underlying TCP connection to be reused for multiple sequential requests and responses between the same client and server, rather than opening a brand-new TCP connection for every single request.

### ⚡ Why This Matters

Establishing a new TCP connection carries real overhead — the TCP handshake, and for HTTPS, an additional TLS handshake on top of it. Reusing an existing connection for subsequent requests avoids paying that setup cost repeatedly, meaningfully improving latency for a client making multiple requests to the same server.

### ⚙️ How Node.js Supports This

Node's `http.Server` has a `keepAliveTimeout` setting, controlling how long the server holds a connection open, waiting for a potential next request from the same client, before closing it if nothing more arrives. On the client side, Node's `http.Agent` manages a pool of reusable keep-alive connections for making multiple outbound requests to the same server efficiently.

### 💎 Good to Know: A Real Production Gotcha Behind a Reverse Proxy

When Node.js sits behind a load balancer or reverse proxy, a mismatch between the proxy's keep-alive timeout and Node's own can cause subtle, intermittent connection-reset errors. If the proxy's timeout is longer than Node's, the proxy might try reusing a connection that Node has already closed. This is typically fixed by setting Node's `keepAliveTimeout` slightly higher than whatever the reverse proxy in front of it uses — a well-known, genuinely real debugging trap for Node.js applications deployed this way.

### ❓ Follow-up Interview Questions

1. Why does reusing a TCP connection save more overhead for HTTPS traffic than for plain HTTP?
2. What symptom would you actually observe in production if a reverse proxy's keep-alive timeout were longer than Node's own?
3. Why does setting `keepAliveTimeout` higher than the proxy's timeout fix the connection-reset issue described above?
4. What's the practical difference between `http.Server`'s keep-alive behavior and `http.Agent`'s connection pooling?
5. Why might disabling keep-alive entirely hurt performance for a client making many sequential requests to the same server?

---

## 6. What are the limitations of the native HTTP module that led to the creation of Express.js?

### 📖 Introduction

Nearly every gap covered earlier in this chapter is exactly what Express, and frameworks like it, exist to fill.

### 🚧 The Core Limitations

- **No built-in routing** — as covered earlier in this chapter, the raw `http` module hands every request to one callback with no path or method-based dispatch built in, requiring that logic to be written by hand for every project.
- **No built-in body parsing** — reading and parsing a request body requires manually handling stream events and choosing a parsing strategy per content type, every single time, for every route that needs it.
- **No middleware concept** — Express introduced composable middleware functions: reusable pieces of request-handling logic, like auth checks, logging, or CORS handling, that can be chained together across many routes. The raw `http` module has no equivalent structural concept at all.
- **No convenience methods for common responses** — sending JSON requires manually setting the `Content-Type` header and calling `JSON.stringify()` every time, compared to a framework's simple `res.json(data)` — small friction that multiplies across a large codebase with many routes.
- **No static file serving, template engine integration, or modular sub-routing** — things like Express's `Router()` for organizing routes into modules are entirely absent, and any non-trivial web application eventually needs some version of them.

### 💎 Good to Know: This Isn't a Design Flaw, It's Deliberate Minimalism

None of this means the `http` module is incomplete or poorly designed — it's deliberately low-level by design, exactly the "foundation, not a complete solution" framing covered earlier in this chapter. Express and similar frameworks exist specifically to add this missing layer of convenience and structure on top of that foundation, and understanding precisely what gap they fill, rather than treating them as some unrelated separate technology, is exactly what this chapter has been building toward.

### ❓ Follow-up Interview Questions

1. Why is the lack of built-in routing in the `http` module a deliberate design choice rather than an oversight?
2. What specific problem does Express's middleware concept solve that the raw `http` module has no equivalent for?
3. Why does `res.json(data)` matter more as a convenience at scale, across many routes, than for a single small script?
4. How would you explain to someone that Express isn't a replacement for the `http` module, but something built on top of it?
5. What would you have to build yourself if you chose to write a non-trivial web application using only the raw `http` module?

---

## 7. What are the security considerations when building servers using the HTTP module directly?

### 📖 Introduction

Working directly with the raw `http` module means there's genuinely nothing between incoming network traffic and an application's own code catching common issues by default — the Security chapter later in this guide covers these threats in full depth; this chapter stays focused on what's specific to using the raw module.

### 🛡️ No Built-In Protections

Since raw `http` provides none of the framework-level conveniences covered earlier in this chapter, it also provides none of the security-related middleware a framework or a library like Helmet typically adds by default — no automatic security headers, no built-in CSRF protection, no built-in rate limiting. All of it has to be added manually.

### 📏 Input Validation and Body Size Limits

Since the raw module doesn't parse or limit the request body, as covered earlier in this chapter, a malicious or buggy client could send an extremely large body, and naive chunk-accumulation code could exhaust server memory without an explicit size check enforced while accumulating — a genuinely realistic denial-of-service vector specific to hand-rolled body parsing.

### 🔓 Trusting Headers and URLs

Headers and URLs come directly from client input. Using an unsanitized `req.url` or header value to construct a file path, risking the directory traversal vulnerability covered in the File System chapter, or a database query, risking the injection vulnerabilities covered in the Security chapter later in this guide, is a serious, concrete risk specifically because there's no framework-level sanitizing layer doing any of that work automatically.

### 🐌 Timeouts and Slow-Client Attacks

A raw HTTP server, without explicit configuration, can be vulnerable to slowloris-style attacks — a client opening many connections and sending data extremely slowly, holding connections open and exhausting server resources. Settings like `server.headersTimeout` and `server.requestTimeout` mitigate this by forcibly closing connections that take too long, but they need to be explicitly configured rather than assumed.

### 💎 Good to Know: This Is Exactly Why Raw `http` Rarely Faces the Public Internet Directly

None of these risks are unique to Node.js specifically — they're general web security concerns. But working with the raw module means nothing catches them by default, which is precisely why production Node.js applications rarely expose `http.createServer()` directly to the public internet without a reverse proxy or a framework with security middleware in front of it.

### ❓ Follow-up Interview Questions

1. Why is an unbounded request body accumulation loop a realistic denial-of-service vector for a hand-rolled server?
2. How could an unsanitized `req.url` lead to a directory traversal vulnerability if used to construct a file path?
3. What is a slowloris attack, and why does it specifically target connection handling rather than application logic?
4. Why does a reverse proxy in front of a raw Node.js server help mitigate several of these risks at once?
5. What would you add first if you had to expose a raw `http.createServer()` server to real traffic safely?

---

## 8. How does the HTTP module interact with the Event Loop and libuv to manage concurrent requests?

### 📖 Introduction

This question asks for the Event Loop and libuv model, covered throughout this guide, applied to one specific and concrete case: an HTTP server handling many clients at once.

### 🖧 The Underlying Model

Each incoming TCP connection is handled through the OS's native async socket-monitoring mechanism — epoll, kqueue, or IOCP, depending on the platform — covered in the Node.js Architecture chapter, not through libuv's separate thread pool used for filesystem and DNS work. The `http` module's ability to handle many simultaneous connections comes from this same OS-level socket-monitoring efficiency, not from spinning up a separate thread per connection.

### 🔄 How a Single Request Flows Through This Model

A new connection's readiness is detected by the OS's socket-monitoring mechanism, libuv surfaces this to the Event Loop, and the `http` module's internal parser incrementally processes bytes as they arrive, exactly as covered earlier in this chapter. Once enough data is parsed, the `'request'` event fires, invoking the developer's callback, which runs on the main thread's Call Stack exactly like any other Event Loop callback.

### 🔀 Why Concurrent Requests Don't Each Need Their Own Thread

Each individual request-handling callback typically does a small amount of synchronous work — parse input, kick off an async database call, return — before yielding back to the Event Loop. Many requests' callbacks get interleaved in rapid succession this way, each one's actual synchronous CPU time being brief — exactly the concurrency model covered throughout the Event Loop chapter, now applied specifically to HTTP request handling.

### 💎 Good to Know: This Is Exactly Where the Model Breaks Down

A request handler doing genuinely CPU-heavy synchronous work blocks the Event Loop, delaying every other concurrent request's callback from running — the same blocking concern covered in the Event Loop chapter, now given a concrete, HTTP-specific illustration: one slow request degrading response times for every other simultaneous client, not just its own.

### ❓ Follow-up Interview Questions

1. Why doesn't the `http` module need a dedicated thread per open connection to handle many clients concurrently?
2. How does the `'request'` event's timing relate to the OS's socket-monitoring mechanism detecting a new connection?
3. Why would one request handler performing heavy synchronous computation degrade response times for unrelated concurrent requests?
4. What's the relationship between this chapter's HTTP-specific concurrency model and the general Event Loop model covered earlier in this guide?
5. How would moving a CPU-heavy piece of request-handling logic to a Worker Thread change this picture?

---

## 9. How would you optimize a high-traffic HTTP server built using the native HTTP module?

### 📖 Introduction

Most of the specific techniques here are direct applications of concepts already covered across this guide — a strong answer assembles them into one coherent checklist for the HTTP-server use case specifically.

### ⚙️ Application-Level Optimizations

Avoid blocking the Event Loop inside request handlers, moving genuinely CPU-heavy work to Worker Threads, covered in their own chapter earlier in this guide. Stream large request and response bodies rather than buffering them entirely in memory, taking advantage of `req` and `res` being genuine streams, as covered earlier in this chapter. Use Cluster to utilize every available CPU core on the machine, rather than running a single Node.js process pinned to one core.

### 🔌 Connection-Level Optimizations

Properly configure keep-alive timeouts, covered earlier in this chapter, set explicit request and header timeouts to guard against slow-client attacks, covered in the previous question, and tune settings like `maxConnections` if genuinely necessary for extreme traffic levels.

### 🧹 Reducing Per-Request Overhead

Avoid unnecessary synchronous work in the hot request path, and minimize expensive per-request allocations — recompiling a regular expression or reparsing a configuration object on every single request, when it could be computed once and reused, adds up quickly at high request volume.

### 🏗️ Infrastructure-Level Optimizations

Placing a reverse proxy like Nginx in front of the application handles TLS termination, static asset serving, and additional connection-handling efficiency, covered in more depth in the Deployment & Production chapter later in this guide. A CDN can handle static content, and horizontal scaling across multiple machines, covered in the Worker Threads & Cluster chapter's layered scaling discussion, becomes relevant once a single machine's Cluster-based scaling alone isn't enough.

### 💎 Good to Know: This Is a Synthesis Question, Not a New-Information Question

A genuinely strong answer to this question is less about introducing new information and more about correctly assembling everything covered so far in this guide — Event Loop blocking avoidance, Worker Threads, Cluster, Streams, keep-alive — into one coherent optimization checklist specific to the HTTP-server use case.

### ❓ Follow-up Interview Questions

1. Why does avoiding Event Loop blocking matter more under high traffic than under light traffic?
2. How would recompiling a regular expression on every request specifically hurt a high-traffic server's throughput?
3. Why does Cluster address a different scaling bottleneck than moving heavy computation to a Worker Thread?
4. What role does a reverse proxy play in a high-traffic deployment that the Node.js server itself doesn't handle as efficiently?
5. If a single machine's Cluster-based scaling is genuinely insufficient, what's the next layer of scaling to reach for?

---

## 10. What are the architectural limitations of using only the HTTP module for large applications?

### 📖 Introduction

Every gap covered earlier in this chapter — routing, body parsing, security, optimization — is individually solvable by hand, as the previous questions demonstrated. This question is about what happens when those same gaps are multiplied across a large, long-lived, multi-developer codebase.

### 🧱 Lack of Shared Structure at Scale

At small scale, manually handling routing and parsing is just repetitive. At large scale — many routes, many developers, many features — the absence of a shared, enforced structure becomes a genuine architectural risk. Without a framework's conventions, different developers on the same team are likely to invent different ad hoc patterns for routing, error handling, and validation, and that inconsistency gets progressively harder to maintain as the application grows.

### 🔌 No Standardized Middleware Ecosystem

A large application typically needs many cross-cutting concerns — auth, logging, rate limiting, CORS, compression, request validation. Framework-style middleware provides a standard, composable way to add, order, and reuse these across many routes. Without it, each concern has to be reimplemented or wired manually into every relevant handler, using a project-specific convention that every new team member has to learn from scratch, rather than a widely documented, industry-standard pattern.

### 🧪 Testing and Ecosystem Friction

Frameworks typically come with well-established patterns and tools for testing routes and handlers in isolation. Testing raw `http`-module-based handlers requires more custom test infrastructure, since there's no standard handler abstraction for testing tools to target. The same is true for things like API documentation generation, input validation libraries with framework bindings, and session or auth middleware — the broader tooling ecosystem built around popular frameworks doesn't have direct equivalents for raw `http`-based applications, meaning considerably more has to be built and wired together by hand.

### 💎 Good to Know: The Individual Gaps Aren't Fatal, but They Compound

None of the raw `http` module's gaps are individually fatal — every earlier question in this chapter showed they're solvable manually. But at the scale of a large application with many routes and many contributors over time, the cumulative cost of reinventing routing, middleware, validation, and testing conventions from scratch, and the inconsistency that results without shared conventions, becomes a genuine architectural liability. This is exactly why virtually no large, real-world Node.js application is built directly on the raw `http` module without at least some framework, or a well-established set of internal conventions, layered on top. The raw module remains an excellent teaching tool and a perfectly valid choice for small, simple services — it's specifically at scale that a framework's shared conventions and tooling ecosystem earn their keep.

### ❓ Follow-up Interview Questions

1. Why does inconsistent ad hoc routing become a bigger problem as more developers contribute to the same codebase over time?
2. What's a concrete example of a cross-cutting concern that becomes harder to maintain without a standard middleware pattern?
3. Why is testing infrastructure typically more custom-built for a raw `http`-module application than for a framework-based one?
4. Would you recommend using only the raw `http` module for a small, single-purpose internal service? Why or why not?
5. How would you introduce shared conventions into an existing raw `http`-based codebase that's grown large without them?

---