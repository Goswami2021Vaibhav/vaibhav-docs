---
title: Real-Time & Socket.io Scenarios
description: What goes wrong with real-time systems in production, and why.
sidebar_position: 7
---

# Real-Time & Socket.io Scenarios

## 1. Real-time updates work fine for most users but silently stop working for a subset of users without any visible error — how would you begin diagnosing this?

### 📖 Introduction

"Silently" is the hard part of this scenario — there's no error surfacing to point you anywhere, so the investigation has to start from the connection itself.

### 🔍 Where to Start

Confirm whether the affected users' connections are actually still open at all, or whether they've silently disconnected without the client realizing it — a connection that's technically dead but that the client still believes is alive would produce exactly this symptom, updates simply never arriving, with nothing visibly erroring out. Check whether the affected users share something in common — a specific network, browser, or device — the same investigative approach used throughout this guide whenever a subset of users, rather than everyone, is affected.

### 🔧 What This Often Points Toward

A missing or broken reconnection mechanism, covered generally in the Networking guide's Web Communication chapter — if a connection silently drops and nothing detects that and reconnects, the user is left in a dead, but seemingly normal-looking, state indefinitely.

### 💎 Good to Know: A Silent Failure Needs an Explicit Heartbeat to Even Be Detectable

Without some active mechanism, a periodic heartbeat or ping/pong between client and server, checking that the connection is genuinely still alive, both sides can be left assuming a connection is healthy long after it's actually died — worth confirming such a mechanism actually exists before assuming the connection layer itself is trustworthy.

---

## 2. Your Socket.io server's memory usage grows steadily over time and never comes back down, even as users disconnect — how would you investigate?

### 📖 Introduction

"Never comes back down, even as users disconnect" is the key detail — it means something tied to a connection is outliving the connection itself.

### 🔍 What to Investigate

Whether disconnect event handlers are actually cleaning up everything that was set up when a connection was established — any per-connection data structure, subscription, or reference that was created on connect needs a matching cleanup on disconnect, or it simply keeps accumulating with every new connection that comes and goes. Whether the server is holding onto references to disconnected clients somewhere else in the application, a list or map of "currently connected users" that's updated on connect but never actually pruned on disconnect.

### 💎 Good to Know: This Is the Real-Time-Specific Version of the Backend Memory-Leak Scenario

This is the same underlying pattern as the memory-leak scenario in the API & Backend Scenarios chapter of this guide — something created per unit of work, here a connection instead of a request, that isn't being properly released when that unit of work ends. A long-lived connection just makes the accumulation and its eventual impact more visible over time.

---

## 3. Users occasionally receive the same real-time event twice — walk through how you'd track down where the duplication is actually happening.

### 📖 Introduction

A duplicate event can originate from more than one layer, and confirming which one narrows the fix considerably.

### 🔍 Where to Look

Whether the event is genuinely being emitted twice from the server itself — a bug where the same underlying trigger, a database write, for example, fires the emit logic more than once. Whether the client has somehow ended up with more than one active connection or listener registered for the same event — a component that sets up an event listener but doesn't clean it up on unmount, only for a re-render to set up a second listener alongside the still-active first one, would produce exactly this symptom, a completely correct single server emit landing on two listeners at once.

### 🎯 How to Confirm Which One

Add logging on the server confirming exactly how many times the emit itself is actually called for a given real event — if it's genuinely only called once, the duplication is happening on the client side, most likely a listener cleanup issue.

### 💎 Good to Know: This Is a Real-Time Version of a Very Common Frontend Bug

A listener that's added but never removed on unmount is the same underlying mistake covered in the Frontend & React Scenarios chapter's memory-leak question — here it manifests as a duplicate event instead of purely growing memory, but the root cause and the fix are the same.

---

## 4. Your real-time feature works perfectly in a single-server setup but breaks in unpredictable ways once you scale to multiple server instances — what's actually going wrong, and how would you fix it?

### 📖 Introduction

This is one of the most common, well-known real-time scaling pitfalls, and it's worth understanding precisely why single-server behavior doesn't just naturally continue once you add more instances.

### ⚠️ What's Actually Going Wrong

A real-time connection, from the Networking guide's Web Communication chapter, is pinned to whichever specific server instance the client originally connected to. If your application logic assumes it can simply emit an event to "this user" and have it work, without accounting for the fact that the user's actual open connection might currently be held by a completely different server instance than the one running the code trying to send them something, that emit silently goes nowhere.

### 🔧 How to Fix It

Use a shared mechanism that lets any server instance broadcast an event to a connection that might be held by any other instance, not just itself — commonly implemented using a shared pub/sub layer like Redis that all instances subscribe to, letting an event emitted from any one instance actually reach the specific instance that's genuinely holding the target connection.

### 💎 Good to Know: This Is the Practical Reason Real-Time Servers Need Coordination That Stateless HTTP Servers Don't

This is a direct, concrete instance of the stateful-versus-stateless tension covered generally in the Scalability guide, and specifically flagged for WebSockets in the Networking guide's Web Communication chapter — a stateless HTTP server doesn't care which instance handles which request, but a real-time server absolutely has to know and account for exactly which instance is holding which connection.

---

## 5. A user's connection briefly drops and reconnects, and they miss an event that was sent during that gap — how would you design the system to handle this gracefully?

### 📖 Introduction

Connection drops are a genuinely normal, expected occurrence, from the Networking guide's coverage of exactly this — the real question is whether the application was designed to tolerate them.

### 🔧 How to Design for This

Give the client a way to know it may have missed something, and a way to actually catch up — commonly, tracking the last event the client successfully received, and on reconnect, having the server send anything the client missed since that point, rather than the client simply resuming forward from whatever arrives next with a silent gap behind it. For state that can be fully re-fetched, having the client re-sync its full current state on reconnect, rather than only relying on the individual events it may have missed, is often a simpler, more robust fallback.

### 💎 Good to Know: A Real-Time System Should Be Designed Assuming Disconnection Will Happen, Not Treating It as Exceptional

Since connection drops are a normal, expected occurrence rather than a rare edge case, a robust real-time feature is designed from the start around the assumption that a client will disconnect and reconnect at some point during a session — not patched afterward once a user first reports a missed update.

---

## 6. Under a sudden spike in concurrent users, your real-time server starts refusing new connections entirely — how would you diagnose whether this is a resource limit, a code issue, or an infrastructure limit?

### 📖 Introduction

Each of these three causes has a distinct signature worth checking for separately.

### 🔍 Resource Limit

Check whether the server process itself is hitting a limit on how many simultaneous connections or open file handles it's actually allowed, a limit that's often configured lower than what the underlying hardware could otherwise support — connections being refused right at a suspiciously round number is a common tell.

### 🔍 Code Issue

Check whether the connection-handling code itself has a bug or an inefficiency that makes accepting each new connection disproportionately expensive, meaning the server falls behind and starts refusing connections well before it's actually anywhere near its true resource limits.

### 🔍 Infrastructure Limit

Check whether something in front of the server, a load balancer or a firewall, both covered in the Networking guide's Firewalls, Proxies, VPNs & NAT chapter, has its own concurrent connection limit that's actually being hit before the application server itself is under any real pressure at all.

### 💎 Good to Know: Load Testing Specifically for Concurrent Connections, Not Just Request Throughput, Is What Catches This Ahead of Time

A typical load test focused on requests-per-second doesn't necessarily exercise a system's behavior under a large number of simultaneously open, long-lived connections — genuinely testing for this scenario requires deliberately simulating that specific kind of load ahead of an actual spike, covered generally in the Performance Optimization guide's load-testing chapter.

---

## 7. You need to send a real-time notification to a specific user, but they're connected from two different devices simultaneously — how would you reason through this design?

### 📖 Introduction

"One user" and "one connection" are not the same thing, and this question is about designing around that distinction deliberately.

### 🎯 The Core Design Question

Decide explicitly whether a notification is meant to reach every one of a user's currently active connections, all their open devices, or only one specific one — the correct answer genuinely depends on the type of notification, a chat message probably belongs on every device, while an action taken on one specific device might only be relevant to that one.

### 🔧 How to Implement It

Track connections by user identity, not just by an anonymous connection identifier, allowing a lookup of every currently active connection belonging to a given user, so an emit can deliberately reach all of them, or be filtered down to a specific one, based on the decision made above.

### 💎 Good to Know: Assuming "One User Equals One Connection" Is a Common, Easy-to-Miss Design Gap

A real-time system built and tested with only one device connected per user at a time can hide this design gap indefinitely, until a real user with multiple simultaneous devices, common in practice, exposes a scenario the design never actually accounted for.

---

## 8. A load balancer change causes real-time connections to fail intermittently right after deploy, even though nothing about the real-time code itself changed — what would you investigate?

### 📖 Introduction

This scenario directly connects real-time behavior to the load balancer configuration question from the Networking guide's Web Communication chapter.

### 🔍 What to Investigate

Whether the load balancer is still correctly configured to support the connection upgrade handshake and long-lived nature of a real-time connection, from the Networking guide, or whether the change inadvertently reset or removed that configuration. Whether session affinity, "sticky sessions," ensuring a client's traffic consistently reaches the same backend instance for the duration of its connection, is still properly in place — a load balancer change that alters routing behavior can easily break this without anyone intending to touch it at all.

### 💎 Good to Know: A Load Balancer Change Can Break Real-Time Behavior Without Touching Any Application Code

This is a direct, practical instance of why load balancer configuration for real-time traffic needs to be treated as a first-class part of the system, not an incidental detail — an infrastructure-only change, with zero application code involved, is fully capable of breaking real-time behavior on its own if it touches this configuration.

---

## 9. Users report a noticeable delay between an event happening and it actually appearing on their screen, even though your server logs show it was emitted instantly — where would you look for the actual source of that delay?

### 📖 Introduction

This closes the chapter by tracing a real-time event's full journey rather than trusting the server's own account of "instantly."

### 🔍 Where to Look

Between the server emitting the event and it actually leaving the server's own network boundary — queuing or buffering somewhere in the emit path itself. Across the actual network between server and client, general network latency, from the Networking guide's Introduction chapter, that a server-side "emitted instantly" timestamp says nothing about at all. On the client, between the event arriving and it actually being reflected on screen — if updating the UI in response to the event requires an expensive re-render, from the Frontend & React Scenarios chapter of this guide, the event could genuinely have arrived quickly while still taking a noticeably long time to actually become visible.

### 💎 Good to Know: "Emitted Instantly" on the Server Only Covers the First Leg of the Journey

The server's own timestamp only confirms when it handed the event off — it says nothing about network transit time or client-side rendering time, both of which are entirely outside what a server-side log alone can ever show you, which is exactly why this closing scenario requires tracing the full path rather than stopping at the first, most convenient piece of evidence.
