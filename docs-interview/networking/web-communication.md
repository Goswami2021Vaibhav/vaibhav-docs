---
title: Web Communication
description: WebSockets, long polling, and how real-time communication works over HTTP.
sidebar_position: 7
---

# Web Communication

## 1. Why does a typical HTTP request/response cycle struggle to support genuinely real-time, server-initiated updates to a client?

### 📖 Introduction

Everything in this chapter exists to solve one structural limitation, so it's worth being precise about what that limitation actually is.

### 🔒 The Structural Limit

The HTTP request/response cycle, covered in the HTTP & HTTPS chapter of this guide, is fundamentally client-initiated — a client sends a request, the server sends back a response, and the exchange is done. The server has no built-in way to reach back out to the client later and say "something new happened," because the connection's whole shape assumes the client always speaks first.

### 🤔 Why That's a Real Problem

Plenty of genuinely common features need the opposite — a chat message arriving, a notification, a live price update — none of which are triggered by the client asking a question at that exact moment. Forcing this kind of server-initiated update onto a strictly request/response model means the client has to somehow keep asking, which is exactly the workaround the next two questions cover.

### 💎 Good to Know: Every Technique in This Chapter Is a Different Answer to This Same Question

Polling, long polling, WebSockets, and Server-Sent Events, all covered in this chapter, are four different answers to the exact same underlying problem — how do you let a server tell a client something without waiting for the client to ask first.

---

## 2. What is polling, and what's the fundamental inefficiency in a client repeatedly asking "is there anything new yet?" on a fixed interval?

### 📖 Introduction

Polling is the simplest, most obvious answer to the previous question's problem — and also the least efficient.

### 🔁 What It Is

The client sends a regular HTTP request, every few seconds for example, asking the server whether anything new has happened, gets an immediate response either way, and then waits for the next interval before asking again.

### ⚠️ The Inefficiency

Most of these requests come back with "nothing new" — genuinely wasted round trips and server load, since the server has to process and respond to a request that had no real news to deliver. Worse, there's an unavoidable tradeoff baked into the interval: polling too infrequently means real delay before a client learns about something new, while polling too frequently means an enormous number of mostly-pointless requests hitting the server.

### 💎 Good to Know: Polling Is Still Genuinely Fine for Many Use Cases

Despite the inefficiency, polling is still a completely reasonable choice when updates are infrequent or a small delay is genuinely acceptable — not everything needs the more sophisticated techniques covered later in this chapter, and reaching for a WebSocket when simple polling would do is its own kind of mistake, covered later.

---

## 3. What is long polling, and how does it reduce wasted requests compared to short polling by having the server hold the connection open until there's actually something to report?

### 📖 Introduction

Long polling is a genuinely clever way to squeeze real-time-like behavior out of the plain request/response model, without needing a fundamentally different protocol.

### ⏳ What It Is

The client sends a request as usual, but instead of the server responding immediately with "nothing new," the server holds the request open, deliberately not responding, until either something actually happens or a timeout is reached. Once the server does respond, whether with real data or an empty timeout response, the client immediately sends a new request and the cycle repeats.

### 📉 Why It Reduces Waste

Since the server is holding the connection open rather than responding immediately, there's no wasted round trip spent checking on nothing — a response only comes back once there's genuinely something to report, or the timeout is reached, which is a much longer interval than a naive polling loop's short delay.

### 💎 Good to Know: Long Polling Is Still Built Entirely on Regular HTTP

Nothing about long polling requires a different protocol — it's a deliberate technique using regular HTTP requests held open longer than usual, which is exactly why it works everywhere plain HTTP works, including through infrastructure that doesn't understand WebSockets, covered later in this chapter.

---

## 4. What is a WebSocket, and how does it differ fundamentally from a normal HTTP connection in terms of how data can flow?

### 📖 Introduction

This is the centerpiece technology of the chapter — a genuinely different kind of connection, not just a clever technique layered on top of HTTP.

### 🔌 What It Is

A protocol that establishes a persistent, long-lived connection between a client and server, over which either side can send data to the other at any time, without needing to wait for a request first.

### 🔄 The Fundamental Difference From HTTP

A normal HTTP connection is fundamentally request/response — data only flows in reply to something the client asked for, from the first question of this chapter. A WebSocket connection, once established, from the next question, allows data to flow in either direction at any moment, genuinely breaking out of the request-initiates-everything model entirely.

### 💎 Good to Know: This Guide Covers the Protocol, Not Any Specific Library

This repo has a separate, dedicated guide for Socket.IO, a popular library built on top of WebSockets with additional features like automatic reconnection and fallback transports. This chapter deliberately stays at the level of the underlying WebSocket protocol and general real-time patterns, not any one specific library's implementation details.

---

## 5. How does a WebSocket connection actually get established, given that it starts as a normal HTTP request?

### 📖 Introduction

A WebSocket connection doesn't appear out of nowhere — it's born from an ordinary HTTP request that then transforms into something else entirely.

### 🤝 The Upgrade Process

The client sends a regular HTTP request, but with special headers, including `Upgrade: websocket`, explicitly asking the server to switch this connection from plain HTTP to the WebSocket protocol. If the server supports it and agrees, it responds with a `101 Switching Protocols` status, and from that point forward, the exact same underlying TCP connection, covered in the previous chapter, is reused, but now speaks the WebSocket protocol instead of HTTP.

### 💎 Good to Know: This Is Why a WebSocket URL Starts With `ws://` or `wss://`

The `ws://` and `wss://` schemes, the encrypted `wss://` variant using TLS from the previous chapter exactly like `https://` does, exist to signal that this is meant to be a WebSocket connection — but under the hood, the connection genuinely begins its life as a regular HTTP request before this upgrade handshake transforms it.

---

## 6. What does "full-duplex" mean in the context of WebSockets, and why is that a genuinely different capability than what HTTP request/response provides?

### 📖 Introduction

"Full-duplex" is the precise technical term for the capability the previous two questions have been building toward.

### ↔️ What It Means

Both sides of a connection can send data to each other simultaneously and independently, rather than needing to take strict turns.

### 🆚 Why That's Different From HTTP

HTTP request/response is fundamentally half-duplex in behavior at the application level — the client sends a request, then waits, then the server sends a response, in that strict order, one direction of the exchange finishing before the next one meaningfully begins. A full-duplex WebSocket connection has no such strict turn-taking — the server can push a message the very instant something happens, completely independent of whatever the client is doing at that moment, and the client can likewise send something without waiting on the server first.

### 💎 Good to Know: This Is the Actual Capability That Makes Real-Time Features Genuinely Real-Time

Full-duplex communication is the actual, specific capability underlying "real-time" features like chat or live collaborative editing — it's not just that updates arrive faster than polling, from earlier in this chapter, it's that either side can genuinely initiate communication at any moment, which a strict request/response model, no matter how frequently polled, can never fully replicate.

---

## 7. What are Server-Sent Events, and how do they differ from WebSockets in terms of which direction data can actually flow?

### 📖 Introduction

Server-Sent Events, SSE, cover the common case where a WebSocket's full bidirectional power is genuinely more than what's needed.

### 📡 What It Is

A technique where a client opens a single, long-lived HTTP connection, and the server can then push a stream of events, updates, down that connection to the client over time, without the client needing to make repeated requests.

### 🆚 The Key Difference From WebSockets

SSE is one-directional — server to client only. The client can't send arbitrary data back to the server over that same connection the way it can with a full-duplex WebSocket, from the previous question; it would need a separate, regular HTTP request for that.

### 💎 Good to Know: SSE Is Built on Plain HTTP, Not a Separate Protocol

Unlike a WebSocket, which upgrades away from HTTP entirely, from the earlier question in this chapter, SSE is just a regular, long-lived HTTP response that streams data over time — meaning it works with ordinary HTTP infrastructure without needing any special upgrade handshake at all.

---

## 8. When would Server-Sent Events be a better fit than a WebSocket, given that a WebSocket can do everything SSE can and more?

### 📖 Introduction

More capability isn't automatically the better engineering choice — this question is about recognizing when the simpler tool actually fits better.

### 🎯 When SSE Fits Better

When the actual use case is genuinely one-directional — server pushing updates to a client that doesn't need to send anything back over that same channel, like a live news feed, stock ticker, or notification stream. Since SSE runs over plain HTTP, from the previous question, it's simpler to implement, works through more existing infrastructure without special handling, and comes with automatic reconnection built into the browser's native `EventSource` API.

### 🤔 Why Not Just Always Use the More Powerful WebSocket

Reaching for a WebSocket's full bidirectional complexity, and the different server-side connection-handling demands covered later in this chapter, when the actual feature only ever needed one-directional updates is unnecessary complexity for no real benefit — a recurring theme throughout this guide of matching the tool to the actual requirement rather than defaulting to the most powerful option available.

### 💎 Good to Know: This Decision Mirrors a Broader Pattern in This Guide

Choosing the simplest tool that genuinely fits the requirement, rather than the most powerful one available, is the same underlying judgment call this guide has applied elsewhere — like choosing UDP over TCP in the previous chapter when reliability wasn't actually the priority.

---

## 9. What's the tradeoff between using long polling and using a WebSocket for a feature that needs near-real-time updates but not genuinely instant, bidirectional communication?

### 📖 Introduction

This question sits directly between two techniques already covered in this chapter, and the right answer genuinely depends on the specific feature's actual requirements.

### ⚖️ The Tradeoff

Long polling, from earlier in this chapter, is simple, works over plain HTTP with no special infrastructure needs, but has some inherent latency, however small, since each update still requires a fresh request/response cycle to begin again, and it puts a repeating request/response load on the server, even if lighter than naive short polling. A WebSocket offers genuinely lower latency and true bidirectional communication, but comes with more implementation complexity and different server-side connection-management demands, covered later in this chapter.

### 🎯 How to Decide

If the feature genuinely needs instant, frequent, two-way communication, a chat application for example, a WebSocket's added complexity is justified. If updates are relatively infrequent or a small delay is genuinely fine, long polling's simplicity is often the better engineering tradeoff, avoiding complexity the feature doesn't actually need.

### 💎 Good to Know: There's No Universally Correct Answer Here

This is a genuinely common system-design-style interview question specifically because there's no single correct answer — a good response demonstrates the ability to reason about the actual tradeoffs rather than reflexively reaching for the most sophisticated available technique.

---

## 10. Why does maintaining many open WebSocket connections put different demands on a server than handling many short-lived HTTP requests?

### 📖 Introduction

This is where the real-time chapter connects directly back to the Scalability guide's broader concerns about handling load.

### 📊 The Difference

A typical HTTP request/response cycle is short-lived — the server handles it and immediately frees up the resources involved. An open WebSocket connection, by contrast, stays alive for as long as the client is connected, potentially hours, meaning the server has to hold onto memory and connection state for every single currently-connected client simultaneously, not just for the brief moment it's actively handling a request.

### 🎯 The Practical Consequence

A server that comfortably handles thousands of brief HTTP requests per second might struggle to simultaneously hold open thousands of long-lived WebSocket connections, since each one consumes ongoing resources for its entire lifetime rather than briefly and then releasing them. This directly affects capacity planning and horizontal scaling decisions, covered generally in the Scalability guide.

### 💎 Good to Know: This Is Why Load Balancer Configuration for WebSockets Gets Its Own Question

The next chapter's question on load balancer configuration for WebSockets is a direct, practical consequence of this exact resource-holding difference — routing decisions that work fine for short-lived HTTP requests need real reconsideration for long-lived connections.

---

## 11. What happens to an open WebSocket connection if the underlying network briefly drops, and what does a client typically need to implement to recover gracefully?

### 📖 Introduction

A persistent connection has a genuine downside compared to independent, short-lived requests — it can actually die.

### 💥 What Happens

Since a WebSocket relies on a single, ongoing underlying TCP connection, from the previous chapter, a brief network interruption, a mobile device switching networks for example, can break that connection outright, at which point no further messages can flow in either direction until a new connection is established from scratch.

### 🔄 What a Client Needs to Implement

Reconnection logic — detecting that the connection has dropped, and automatically attempting to re-establish a new one, typically with a backoff strategy, waiting progressively longer between attempts rather than retrying instantly and repeatedly. Depending on the application, it may also need logic to resynchronize any state or messages that were missed during the disconnected period.

### 💎 Good to Know: This Is a Genuine Complexity Cost That Doesn't Exist With Simple Polling

Unlike long polling, from earlier in this chapter, where each request/response cycle is independent, and a single failed request just gets naturally retried on the next cycle, a WebSocket's persistent nature means connection loss and recovery is something an application genuinely has to handle deliberately — a real complexity cost weighed against its lower-latency benefit, from the earlier tradeoff question in this chapter.

---

## 12. How does a load balancer need to be configured differently to support WebSocket connections compared to typical stateless HTTP traffic?

### 📖 Introduction

This question is the direct, practical follow-through of the earlier "why does holding many connections put different demands on a server" question.

### 🔀 The Difference

A typical stateless HTTP request can be freely routed to any available backend server for each individual request, since nothing about one request depends on which server handled the previous one, covered generally in the Scalability guide's Load Balancing chapter. A WebSocket connection, once established, needs to stay pinned to the exact same backend server for its entire lifetime, since that specific server is the one holding the connection's live state — a load balancer can't casually redirect an already-established WebSocket's traffic to a different server mid-connection.

### 🎯 What This Requires

The load balancer needs to support the WebSocket upgrade handshake, from earlier in this chapter, correctly passing through the necessary headers, and typically needs some form of session affinity, or "sticky sessions," ensuring all traffic for a given established connection consistently reaches the same backend server.

### 💎 Good to Know: This Is a Practical Instance of a Broader Stateful-vs-Stateless Tension

This is a concrete, practical example of the general stateless-versus-stateful tension covered in the Scalability guide — WebSocket connections are inherently stateful in a way that complicates the simple, freely-redistributable routing that makes stateless HTTP so easy to scale horizontally.

---

## 13. What is the practical difference between choosing raw WebSockets versus a library built on top of them, conceptually, without going deep into any one specific library's API?

### 📖 Introduction

The raw WebSocket protocol, from earlier in this chapter, is deliberately minimal — libraries exist to fill in the gaps most real applications actually need.

### 🔧 What Raw WebSockets Provide

Just the core protocol itself — establishing the connection, and sending and receiving messages. Nothing about automatic reconnection, from the earlier question in this chapter, message acknowledgment, fallback behavior for environments where WebSockets aren't supported, or higher-level concepts like rooms or broadcasting to groups of connected clients, is handled for you.

### 📦 What a Library on Top Typically Adds

Automatic reconnection with backoff, fallback to techniques like long polling when a WebSocket connection genuinely can't be established, and higher-level abstractions for common real-time patterns, like broadcasting a message to a defined group of connected clients rather than manually tracking them yourself.

### 💎 Good to Know: This Repo's Socket.IO Guide Covers One Such Library in Depth

Socket.IO, covered in this repo's separate, dedicated guide, is exactly this kind of library — built on top of the raw WebSocket concepts covered in this chapter, adding the reconnection, fallback, and room/broadcasting conveniences described here.

---

## 14. How would you decide, for a genuinely new feature, whether it needs full WebSocket bidirectional communication or whether simple polling is actually good enough?

### 📖 Introduction

This question pulls together every technique covered in this chapter into one practical decision framework.

### 🎯 The Key Questions to Ask

How frequently does the underlying data actually change — a feature updating every few seconds needs a genuinely different approach than one updating a few times a day. Does the client genuinely need to send data back over the same real-time channel, or is server-to-client the only direction that actually matters, pointing toward Server-Sent Events instead, from earlier in this chapter. How much latency is actually acceptable before a delay meaningfully hurts the feature's purpose. How many concurrent users need this simultaneously, given the different resource demands of persistent connections, from earlier in this chapter.

### 📋 Matching the Answer to a Technique

Infrequent updates, delay genuinely fine: simple polling, from earlier in this chapter. Frequent, server-to-client only: Server-Sent Events. Frequent, genuinely bidirectional, low latency required: WebSockets.

### 💎 Good to Know: Defaulting to the Simplest Sufficient Tool Is the Actual Skill Being Tested

An interviewer asking this question isn't looking for "always use WebSockets" — they're looking for evidence that you'd actually reason through the real requirements first, matching the tool to the genuine need rather than defaulting to whichever technique sounds most sophisticated.

---

## 15. In production, a chat feature built on WebSockets works fine for most users but consistently fails for users on a specific corporate network — what would you investigate?

### 📖 Introduction

This closes the chapter with a genuinely realistic, commonly reported production issue tying together several earlier questions.

### 🔍 Diagnostic Approach

Consider that corporate networks commonly sit behind restrictive firewalls and proxies, both covered in the next chapter of this guide, which are frequently configured to block or restrict traffic that doesn't look like normal, familiar HTTP — and a WebSocket connection, despite starting as a regular HTTP request during its upgrade handshake, from earlier in this chapter, ultimately behaves in a way some older or overly strict network equipment doesn't recognize or permit. Check whether the WebSocket upgrade handshake itself is even completing for these affected users, or whether it's failing at that very first step. If the application has a fallback mechanism, to long polling for example, verify whether that fallback is actually working correctly for these specific users, since a well-built real-time feature should degrade gracefully rather than failing outright.

### 💎 Good to Know: This Scenario Is Exactly Why Fallback Behavior Matters in Practice

This is precisely why the library-provided fallback behavior mentioned earlier in this chapter is genuinely valuable in real-world production — not every user's network environment reliably supports a raw WebSocket connection, and a real-time feature that hard-fails without a graceful fallback will predictably run into exactly this kind of restrictive-network production issue.
