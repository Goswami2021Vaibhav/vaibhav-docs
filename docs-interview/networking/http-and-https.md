---
title: HTTP & HTTPS
description: Request/response structure, methods, status codes, and what TLS adds.
sidebar_position: 3
---

# HTTP & HTTPS

## 1. What is the basic structure of an HTTP request?

### 📖 Introduction

This chapter is where the previous chapter's "HTTP lives at the application layer" point becomes concrete — the actual message format.

### 📄 The Structure

A request line — method, path, and HTTP version, like `GET /users/42 HTTP/1.1` — headers, key-value metadata about the request, a blank line separating headers from body, and an optional body, for methods like POST or PUT that send data.

```
GET /users/42 HTTP/1.1
Host: example.com
Accept: application/json

```

### 💎 Good to Know: This Is Literally Just Structured Text

At least for HTTP/1.1 — HTTP/2 and HTTP/3, covered later in this chapter, use binary framing internally but preserve this same conceptual structure. This is exactly why tools like `curl` or browser DevTools can show you the raw request and it's genuinely human-readable, unlike lower-layer protocols like TCP segments or IP packets, covered in the previous chapter, which are purely binary.

---

## 2. What is the basic structure of an HTTP response?

### 📖 Introduction

The response mirrors the request's structure almost exactly.

### 📄 The Structure

A status line — HTTP version, status code, and a short reason phrase, like `HTTP/1.1 200 OK` — headers, a blank line, and an optional body, the actual requested content or error details.

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 42

{"id": 42, "name": "Alex"}
```

### 💎 Good to Know: Requests and Responses Are Genuinely Symmetric

Just a status line instead of a request line otherwise — worth recognizing how symmetric request and response genuinely are at the protocol level, which is part of why HTTP is considered such a simple, learnable protocol compared to many others.

---

## 3. What does it mean for HTTP to be stateless at the wire level, versus an application's architectural choice?

### 📖 Introduction

The API Design guide covers statelessness as a REST architectural constraint — this is the protocol-level distinction specifically.

### 🔌 What It Means at the Wire Level

Each individual HTTP request is completely independent — the protocol itself has no built-in concept of a "session" or "conversation" connecting multiple requests together. The server, at the protocol level, has no inherent memory of any previous request from the same client.

### 🏗️ How It Differs From an Application's Architectural Choice

An application can choose to build statefulness on top of stateless HTTP — using cookies to carry a session identifier, covered in the Web Security guide's Session & Token Security chapter — but that's the application layer choosing to simulate continuity, not a property of HTTP itself. HTTP the protocol never stops being stateless at its own level, regardless of what the application built on top of it chooses to do.

### 💎 Good to Know: This Clarifies What REST's Statelessness Requirement Is Actually Asking For

It's asking the application to not build additional, server-side session state on top of HTTP, since HTTP itself is already, inherently stateless at the wire level regardless.

---

## 4. What are HTTP headers, and what's the difference between a request, response, and general header?

### 📖 Introduction

Headers are one flexible mechanism reused for many completely different purposes across every guide in this repo.

### 📋 What Headers Are

Key-value metadata about the request or response, separate from the actual body content.

### 🔀 The Three Categories

**Request headers** — metadata only meaningful in a request context, like `Authorization`, telling the server who's asking. **Response headers** — metadata only meaningful in a response context, like `Set-Cookie`, telling the client to store something. **General headers** — can appear in either, like `Content-Type`, describing the format of whatever body is present, request or response.

### 💎 Good to Know: This Is One Mechanism, Reused Everywhere

`Cache-Control`, covered in the Performance Optimization guide, and `Content-Security-Policy`, covered in the Web Security guide, are all just specific instances of this general header mechanism — worth recognizing headers as one flexible, extensible tool rather than a separate concept per use case.

---

## 5. What are the practical differences between HTTP/1.0, HTTP/1.1, HTTP/2, and HTTP/3?

### 📖 Introduction

The Performance Optimization guide's network chapter covers this in genuine performance depth — this is the protocol-level progression as foundational vocabulary.

### 📈 The Progression

**HTTP/1.0** — one request per connection, connection closed after each response. **HTTP/1.1** — introduced persistent connections by default, covered later in this chapter, allowing multiple requests over one connection. **HTTP/2** — introduced binary framing and multiplexing, multiple requests genuinely interleaved over a single connection simultaneously. **HTTP/3** — built on QUIC, UDP-based, instead of TCP, addressing TCP-level head-of-line blocking.

### 💎 Good to Know: This Chapter Covers the Vocabulary, the Performance Guide Covers the Impact

This question is about knowing the protocol-level progression exists and roughly what changed at each step. The Performance Optimization guide's Network chapter covers the practical performance implications in much more depth.

---

## 6. What does HTTPS actually add on top of plain HTTP, and at which layer?

### 📖 Introduction

HTTPS isn't a different protocol from HTTP — it's the same protocol, running somewhere different.

### 🔒 What It Adds

Encryption, integrity, and authentication — the entire subject of this guide's SSL/TLS chapter. HTTPS is literally just HTTP, unchanged, running on top of a TLS-encrypted connection rather than a plain TCP connection.

### 📍 Where the Addition Happens

TLS operates between the transport layer, TCP from the previous chapter, and the application layer, HTTP — sometimes described as its own layer, sometimes considered part of the application layer, depending on which specific version of the layered model you're using, per the previous chapter's note that real protocols don't always map cleanly.

### 💎 Good to Know: The HTTP Messages Themselves Are Identical Either Way

This is exactly why HTTPS doesn't require a completely different, separate protocol from HTTP — the HTTP messages themselves are literally identical whether sent over plain HTTP or HTTPS. The only difference is whether that underlying connection is encrypted, covered in the SSL/TLS chapter, before the HTTP messages ever get sent through it.

---

## 7. What are the default ports for HTTP and HTTPS, and why does a browser assume one?

### 📖 Introduction

This is the port-number concept from the first chapter of this guide, made concrete.

### 🔌 The Defaults

HTTP defaults to port 80. HTTPS defaults to port 443.

### 🤔 Why the Browser Assumes One

These specific port numbers are well-known, standardized conventions. When a URL doesn't explicitly specify a port, the browser assumes the standard default for whichever scheme, `http://` or `https://`, was used, sparing users from needing to type `:80` or `:443` manually every time.

### 💎 Good to Know: A Non-Standard Port Must Be Specified Explicitly

A server can be configured to listen on a completely different, non-standard port — a development server often runs on something like 3000 or 8080. In that case, the port must be explicitly specified in the URL, since the browser has no way to know to look anywhere other than the standard default otherwise.

---

## 8. What is a persistent connection, and how did HTTP/1.1 change the default?

### 📖 Introduction

The Performance Optimization guide covers the performance benefit of this in depth — this is the protocol-level behavior change itself.

### 🔄 What It Is

Reusing the same underlying TCP connection for multiple HTTP requests and responses, rather than opening a brand-new connection for every single request.

### 📈 How HTTP/1.1 Changed the Default

HTTP/1.0 closed the connection after every single request and response by default, requiring a fresh TCP handshake, covered in the TCP & UDP chapter, for the very next request. HTTP/1.1 made persistent connections, `Connection: keep-alive`, the default behavior, letting multiple requests share one already-established connection.

### 💎 Good to Know: This Is the Protocol Change, the Performance Guide Covers the "Why It Matters"

This question is specifically about the protocol-level behavior change itself, between versions, while the Performance Optimization guide's network chapter covers why avoiding repeated handshake overhead matters for real-world speed.

---

## 9. What is an HTTP request/response cycle, and why is understanding it foundational to everything else in this guide?

### 📖 Introduction

This is a good "anchor" question to return to whenever a more complex HTTP concept feels confusing.

### 🔄 What It Is

The full sequence — client sends a request, server processes it and sends back a response, cycle complete — the single, foundational interaction pattern HTTP is built around.

### 🏗️ Why It's Foundational

Literally every other concept covered in this chapter — methods, status codes, headers, HTTPS — is a refinement or addition to this one basic cycle. REST, covered in the API Design guide, web APIs, and even the more exotic communication patterns covered in this guide's Web Communication chapter either build directly on this cycle or exist specifically because this cycle has limitations that need working around.

### 💎 Good to Know: Return to This Baseline When a Complex Case Feels Confusing

Whenever a more complex HTTP-related concept feels confusing, it's often useful to mentally return to this simplest possible version — one request, one response — and ask "what's different or added compared to that baseline," rather than trying to understand the complex case from scratch.

---

## 10. What's the difference between a HEAD request and a GET request?

### 📖 Introduction

HEAD is genuinely just GET, minus one thing.

### 🔀 The Difference

A HEAD request returns the same response headers a GET would return for the same resource, but explicitly without the response body.

### 🎯 A Practical Use Case

Checking whether a resource exists, or getting its metadata — like `Content-Length`, to know a file's size before deciding to download it — without the cost or bandwidth of actually transferring the full body. Genuinely useful for a client that wants to make a decision based on metadata before committing to a full download.

### 💎 Good to Know: HEAD Inherits All of GET's Safety Properties

HEAD is both safe and idempotent, the same definitions covered in the API Design guide's REST API Principles chapter — which makes sense, since it's literally defined as "GET, but without the body," inheriting all of GET's properties minus the actual content transfer.

---

## 11. What is chunked transfer encoding, and how does it let a server start sending before knowing the full length?

### 📖 Introduction

This is the protocol-level feature that makes response streaming, covered in the Performance Optimization guide, technically possible in the first place.

### 📦 What It Is

A way of sending an HTTP response body in a series of separate chunks, each with its own size indicator, rather than requiring the entire body's total size to be known and declared upfront, via a `Content-Length` header, before sending anything.

### ⏱️ How It Lets a Server Start Sending Early

For a response generated dynamically — streaming data from a database query still in progress, covered in the Performance Optimization guide's streaming discussion — the server genuinely doesn't know the final total size until it's completely done generating the content. Chunked encoding lets it start transmitting what it already has, chunk by chunk, as soon as each piece becomes available, rather than waiting to buffer the entire response first just to calculate a `Content-Length` value.

### 💎 Good to Know: This Is the Wire-Level Feature Behind a Performance Technique Covered Elsewhere

The Performance Optimization guide covers why streaming improves perceived performance. This question covers the actual wire-level feature that lets a chunked, incomplete-length response even be a valid, well-formed HTTP response in the first place.

---

## 12. What is the `Host` header, and why is it required even though the destination IP was already used?

### 📖 Introduction

A single IP address doesn't always mean a single website.

### 🏠 Why It's Required

A single physical server, at one specific IP address, can host multiple, completely different websites and domains simultaneously — a common hosting and cloud-infrastructure setup. The TCP connection, covered in the previous chapter, only tells the server "someone connected to this IP on port 443" — it doesn't tell the server which of the multiple domains it's hosting the client actually intended to reach. The `Host` header explicitly carries that information within the actual HTTP request itself, letting the server route the request to the correct website or application.

### 💎 Good to Know: SNI Solves a Similar Problem, Earlier in the Connection

This connects directly to Server Name Indication, covered in this guide's SSL/TLS chapter — SNI solves a genuinely similar "which domain do you mean" problem, but for TLS certificate selection specifically, and has to happen even earlier, during the TLS handshake itself, before the encrypted HTTP request carrying the `Host` header is even sent.

---

## 13. How does a browser decide whether to reuse an existing connection or open a new one?

### 📖 Introduction

This directly builds on persistent connections, covered earlier in this chapter.

### 🔄 How the Browser Decides

Browsers maintain a pool of open, persistent connections per origin, up to some limit — historically around six parallel connections per host under HTTP/1.1, less relevant under HTTP/2's multiplexing, covered in the Performance Optimization guide. A new request to the same host reuses an existing, idle connection from that pool if one's available, rather than opening a brand-new one, specifically to avoid the repeated handshake cost — the TCP handshake from the previous chapter and the TLS handshake from the SSL/TLS chapter — that a fresh connection would require.

### 💎 Good to Know: This Happens Transparently, Without Any Application Code

This decision happens entirely within the browser's own networking stack, transparent to the webpage's JavaScript code. Understanding that it happens explains why the connection-reuse performance benefits covered in the Performance Optimization guide's network chapter actually materialize automatically in real browser behavior, without needing any special application-level code to trigger it.

---

## 14. What's the difference between a 301 and a 302 redirect?

### 📖 Introduction

Choosing the wrong one is a genuinely common, costly real-world mistake, not just an academic distinction.

### 🔀 The Difference

**301 (Moved Permanently)** — tells the client, and importantly search engine crawlers, that the resource has permanently moved to a new URL. Browsers and crawlers typically cache this redirect and update bookmarks and search-index entries to point directly at the new location going forward. **302 (Found / Temporary Redirect)** — tells the client this is a temporary redirect; the original URL should continue to be used for future requests, since the redirect is expected to stop applying at some point.

### 💎 Good to Know: Choosing Wrong Has Real, Lasting SEO Consequences

A site migration that's genuinely permanent but mistakenly uses a 302 can mean search engines keep indexing and ranking the old URL indefinitely, since they're being told, incorrectly, that the old location is still the "real" one and this is just temporary.

---

## 15. How would you inspect the raw HTTP request and response for a specific page load?

### 📖 Introduction

Reading the raw exchange directly is often the fastest way to diagnose a confusing networking-adjacent bug.

### 🛠️ How

Browser DevTools' Network tab, the same tool referenced in the Performance Optimization guide's waterfall discussion, shows the actual headers, status, and timing for every request a page makes — clicking into a specific request reveals the raw request and response headers, the structure covered earlier in this chapter, made concrete. Command-line tools like `curl -v` or `curl -I`, the HEAD-request-equivalent flag from earlier in this chapter, show the same raw protocol details outside a browser context entirely.

### 🔍 What You'd Be Looking For

The actual status code returned, not just what the application claims happened. The specific headers present or absent — caching directives, CORS headers, the security headers covered in the Web Security guide. And the actual timing breakdown — DNS, connection, time to first byte — the waterfall-reading discussion from the Performance Optimization guide.

### 💎 Good to Know: This Is a Genuinely Practical, Everyday Skill

Being able to read a raw HTTP exchange directly, rather than trusting an abstraction layer's — a frontend framework, an HTTP client library — interpretation of what happened, is often the fastest way to diagnose a confusing networking-adjacent bug.

---

## 16. In production, an API works fine in Postman but fails when called from a browser — what class of problem does that point toward?

### 📖 Introduction

This closes the chapter with a classic, real debugging trap.

### 🔍 What This Points Toward

This is a classic signature of a browser-specific behavior or restriction that a tool like Postman simply doesn't enforce — most commonly CORS, covered in the Web Security guide's API Security chapter. A browser enforces the Same-Origin Policy and CORS headers when JavaScript makes a cross-origin request, while Postman, not being a browser and not running page-embedded JavaScript subject to those restrictions, simply sends the request directly and shows whatever response comes back, with no such enforcement.

### 💎 Good to Know: The Raw Exchange Can Be Identical, but the Enforcement Context Isn't

The underlying HTTP exchange can be technically identical in both cases, but the browser's additional, JavaScript-execution-context-specific security enforcement, something Postman never applies, is exactly the kind of difference that explains "works in one tool, fails in another" despite the raw protocol-level request looking the same.
