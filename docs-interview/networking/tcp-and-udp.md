---
title: TCP & UDP
description: Connection-oriented vs connectionless — and why each exists.
sidebar_position: 4
---

# TCP & UDP

## 1. What does it mean for TCP to be "connection-oriented," and what happens during the three-way handshake?

### 📖 Introduction

This chapter is where the previous chapter's abstract "transport layer" concept gets its actual mechanics.

### 🤝 What Connection-Oriented Means

Before any actual application data is exchanged, the two endpoints explicitly establish a shared, agreed-upon connection state — both sides know the connection exists and are ready to exchange data, rather than one side just blindly sending data and hoping the other side is listening.

### 🔄 The Three-Way Handshake

`SYN` — the client sends a synchronize message, proposing a starting sequence number. `SYN-ACK` — the server acknowledges the client's SYN and sends its own SYN with its starting sequence number. `ACK` — the client acknowledges the server's SYN.

```
Client  --- SYN ------>  Server
Client  <-- SYN-ACK ---  Server
Client  --- ACK ------>  Server
```

After these three messages, both sides have confirmed they can send and receive, and the connection is considered established.

### 💎 Good to Know: This Is the Mechanism Behind a Performance Cost Covered Elsewhere

The Performance Optimization guide's network chapter covers "TCP/TLS handshake overhead" from a performance angle. This question is the actual, literal mechanics of what those three messages contain and why exactly three are needed, while that chapter covers why this costs real, measurable latency.

---

## 2. Why does TCP need a handshake before any data is sent?

### 📖 Introduction

This resolves the "why" behind the previous question's mechanics.

### 🎯 Why

Without a handshake, a sender would have no way to know whether the receiver is even reachable or listening at all before committing to sending real data. The handshake serves as a cheap, small "are you there and ready" check first, and it also lets both sides agree on starting sequence numbers, covered later in this chapter, needed for reliable delivery, before any actual application data needs to be tracked or sequenced.

### 💎 Good to Know: Establish Shared State Before Relying on It

This is a good illustration of a general engineering principle — confirming readiness before relying on it, rather than assuming it and discovering problems later — the same instinct behind health checks, covered in the Scalability guide, running before real traffic gets routed to an instance.

---

## 3. How does TCP guarantee reliable delivery?

### 📖 Introduction

This is the mechanism that turns IP's "best effort" into an actual guarantee.

### 🔄 How It Works

Every piece of data sent gets an acknowledgment, an ACK, from the receiver confirming it arrived. If the sender doesn't receive an ACK within a certain time, it assumes the data was lost and retransmits it. This ACK-and-retransmit cycle continues until the sender genuinely confirms the data got through.

### 💎 Good to Know: TCP Provides What IP Alone Doesn't

IP alone offers only "best-effort" delivery — it might get lost, with no mechanism to detect or fix that. TCP is what sits on top of that unreliable foundation and builds genuine reliability through this ACK-and-retransmit mechanism.

---

## 4. What is sequencing in TCP, and how does it enable reassembly of out-of-order packets?

### 📖 Introduction

This solves a real structural tension between how packets travel and what an application actually needs.

### 🔢 What It Is

Every byte of data sent over a TCP connection is assigned a sequence number, letting the receiving end know exactly where in the overall stream a given piece of data belongs.

### 🧩 How It Enables Reassembly

Since packets can arrive out of order, covered in the first chapter of this guide, the receiver uses these sequence numbers to put the data back into the correct order before handing it up to the application layer, regardless of the actual order the individual packets happened to physically arrive in.

### 💎 Good to Know: This Reconciles Two Seemingly Conflicting Requirements

Packet switching is efficient precisely because it doesn't guarantee a fixed path or order, but an application genuinely needs its data back in the original order to make sense of it. Sequencing is what lets TCP deliver on both of those requirements at once.

---

## 5. What is TCP flow control?

### 📖 Introduction

This is a receiver-focused mechanism, worth contrasting directly with congestion control, covered next.

### 🚦 What It Is

A mechanism, using a "receive window" the receiver advertises to the sender, that prevents a fast sender from transmitting data faster than the receiver can actually process or buffer it.

### 🛡️ How It Prevents Overwhelming the Receiver

The receiver continuously tells the sender "I have room for this much more data right now." The sender respects that limit, pausing or slowing down if the receiver's advertised window shrinks, meaning its buffer is filling up, rather than blindly sending as fast as it physically can.

### 💎 Good to Know: This Protects One Specific Receiver, Not the Network

Worth contrasting directly with congestion control, covered next — a different, network-wide concern, even though both mechanisms end up slowing down a sender in similar-looking ways.

---

## 6. What is TCP congestion control, and how does it differ from flow control?

### 📖 Introduction

This protects the shared network, not just the specific receiver on the other end of the connection.

### 🌐 What It Is

A mechanism where the sender itself monitors for signs that the network path, not just the receiver specifically, is becoming congested or overloaded — detecting packet loss or increasing delay as a signal of network-wide congestion, and proactively slowing its own sending rate in response, then gradually speeding back up as conditions improve.

### 🔀 How It Differs From Flow Control

Flow control protects the specific receiver's buffer from being overwhelmed, covered in the previous question. Congestion control protects the shared network infrastructure itself — routers, links, covered in the first chapter of this guide — from being overwhelmed by the total, combined traffic from many different senders simultaneously, not just this one connection.

### 💎 Good to Know: This Is Retry-With-Backoff, Decades Before It Had That Name

This is directly the same "back off when something's struggling, rather than making it worse" principle covered as retry-with-backoff in the Scalability guide's High Availability chapter — congestion control is TCP doing exactly that, automatically, at the protocol level, long before application-level backoff patterns were formalized as a named best practice.

---

## 7. What does it mean for UDP to be "connectionless"?

### 📖 Introduction

UDP isn't a broken version of TCP — it's a deliberately different, minimal protocol.

### 📭 What It Means

UDP has no handshake, no sequencing, no acknowledgments or retransmission, and no flow or congestion control. A sender simply sends a packet, called a datagram, directly, with no setup, no guarantee it arrives, and no mechanism to even find out whether it did.

### 💎 Good to Know: UDP Provides Just the Addressing Part of the Transport Layer

None of TCP's additional guarantees are layered on top. Whichever guarantees an application actually needs have to be built by the application itself, if it needs them at all — covered from the real-world use-case angle in the next question.

---

## 8. Why would anyone deliberately choose UDP, given its lack of guarantees?

### 📖 Introduction

The lack of guarantees is a feature for the right use case, not just a limitation.

### 🎯 Why Choose It Anyway

All of TCP's reliability mechanisms add real overhead and latency — the handshake itself takes an extra round trip before any data can even be sent, and retransmission means waiting for a lost packet to be resent rather than just moving on. For an application where a single lost or late piece of data is genuinely less costly than the delay required to guarantee its delivery, UDP's lack of these guarantees is a feature, not a bug.

### 💎 Good to Know: There's No Universally Correct Transport, Only the Right Tradeoff

UDP genuinely isn't worse than TCP overall — it's optimized for a different set of priorities: speed and low overhead over guaranteed delivery. The same "no universal winner, only the right tradeoff for a specific use case" theme that runs throughout every guide in this repo.

---

## 9. What are realistic use cases where UDP is the better choice than TCP?

### 📖 Introduction

Recognizing the shared pattern across these examples matters more than memorizing the list itself.

### 🎯 Realistic Use Cases

Live video or voice calls — a briefly glitchy, slightly dropped frame is far less disruptive than the call freezing while waiting for a retransmitted, now-stale frame to arrive late, directly this chapter's closing production scenario. Online gaming — a single missed position update is irrelevant once a newer one arrives moments later; retransmitting the stale one would be actively counterproductive. And DNS, covered next, small queries and responses where the overhead of a full TCP handshake would be disproportionately expensive relative to the tiny amount of actual data being exchanged.

### 💎 Good to Know: Recognize the Pattern, Don't Just Memorize the List

These examples are either genuinely time-sensitive, where stale data is worse than missing data, or genuinely small and simple enough that TCP's overhead would dominate the actual useful work being done. Recognizing this pattern is what lets you reason about whether a new, unfamiliar use case is a good fit for UDP.

---

## 10. Why does DNS typically use UDP?

### 📖 Introduction

This is the concrete, everyday example behind the previous question's "small and simple" pattern.

### 🎯 Why UDP Makes Sense for DNS

A typical DNS query and response, covered in this guide's DNS chapter, is tiny — just a domain name and the corresponding IP address, easily fitting within a single UDP datagram. Establishing a full TCP connection purely to exchange this small amount of data would roughly double the actual round trips needed — handshake first, then the real query and response — for something that's already simple enough to just resend if it happens to get lost.

### 💎 Good to Know: DNS Does Fall Back to TCP in Specific Situations

A response too large to fit in a single UDP datagram, or certain security-related DNS operations, do use TCP. Worth knowing UDP isn't the only protocol DNS ever uses, just the overwhelmingly common default for typical, small queries specifically.

---

## 11. What is TCP connection teardown, and why does it involve four steps?

### 📖 Introduction

Closing a connection turns out to need the same two-sided agreement as opening one.

### 🔚 What It Is

Closing a TCP connection properly requires a four-step exchange — `FIN` from one side, `ACK` from the other, then `FIN` from that other side, `ACK` back — rather than a single "close" message.

### 🔀 Why Four Steps, Not One

TCP connections are genuinely bidirectional — each side needs to independently signal "I'm done sending," its own `FIN`, and the other side needs to acknowledge that and separately signal its own "I'm also done sending." Since one side might still have more data to send even after the other side has finished, teardown has to handle each direction of the connection closing somewhat independently.

### 💎 Good to Know: This Mirrors the Handshake's Two-Sided Agreement

Both establishing and tearing down a connection require an explicit, two-sided agreement — TCP never lets either side unilaterally declare the connection done on its own.

---

## 12. What tradeoff does TCP make, and why isn't it simply the objectively better choice in every situation?

### 📖 Introduction

This closes the loop on everything covered so far in this chapter, before the analogy and production questions.

### ⚖️ The Tradeoff

All of TCP's reliability mechanisms cost real time and overhead — more round trips for the handshake, potential delays waiting for retransmission, or for out-of-order packets to be reassembled via sequencing before the application can use any of them, even the ones that arrived on time.

### 🤔 Why Not Universally Better

For an application that genuinely needs every byte, in order, guaranteed — loading a webpage, downloading a file — this cost is clearly worth paying. But for an application where timeliness matters more than guaranteed completeness, that same overhead is pure cost with no corresponding benefit, making UDP the genuinely better engineering choice for that specific need.

### 💎 Good to Know: "Which Is Better" Is the Wrong Question

TCP versus UDP isn't a "which is better" question at all — it's a "which tradeoff does this specific application actually need" question, the same framing that shows up repeatedly across every guide in this repo: SQL versus NoSQL, synchronous versus asynchronous service communication, and many more.

---

## 13. How would you explain TCP versus UDP using an analogy that captures the actual tradeoff?

### 📖 Introduction

A weak analogy just restates "reliable versus unreliable" — a good one captures why that tradeoff is worth making.

### 📬 A Useful Analogy

TCP is like sending a certified letter — you get a signature confirming delivery, and if it doesn't arrive, the postal service resends it, but this adds real time and cost to every letter. UDP is like shouting a message across a room — instant, no overhead, but if someone wasn't listening or missed part of it, there's no built-in mechanism to know that happened or to automatically repeat yourself.

### 💎 Good to Know: A Good Analogy Highlights the Tradeoff, Not Just the Surface Difference

"TCP is reliable, UDP isn't" misses the actual tradeoff — a good analogy specifically captures that the "unreliable" one is deliberately, usefully faster because it skips overhead, not just worse.

---

## 14. What happens at the TCP level when a packet is lost in transit?

### 📖 Introduction

This process happens entirely automatically, invisible to everything above the transport layer.

### 🔄 What Happens

The sender doesn't receive an expected acknowledgment within a certain timeout period. It assumes the corresponding data was lost somewhere along the way, and retransmits that specific data. Modern TCP implementations also use faster detection mechanisms, like noticing duplicate ACKs for later data suggesting an earlier piece was skipped, to detect and react to loss more quickly than waiting for a full timeout in many cases.

### 💎 Good to Know: This Is Why Application Developers Rarely Think About Packet-Level Reliability

This entire process happens automatically, at the transport layer, completely invisible to the application above it. An HTTP request, covered in the previous chapter, genuinely doesn't know or care whether some underlying packets were lost and retransmitted along the way — TCP handles all of that transparently.

---

## 15. In production, a video call app experiences glitches and frozen frames rather than a clean pause-and-resume — what does that behavior suggest?

### 📖 Introduction

This closes the chapter by applying the real-time-video use case from earlier in this chapter to an actual, observable production symptom.

### 🔍 What This Behavior Suggests

Glitchy, occasionally dropped frames, rather than a clean pause-and-resume while waiting for missing data to be retransmitted, is exactly the behavior pattern you'd expect from a UDP-based protocol. A lost video frame is simply skipped, with the stream continuing forward using whatever arrives next, rather than pausing to wait for retransmission the way a TCP-based connection would.

### 💎 Good to Know: You Can Infer the Transport Protocol Just by Observing the Failure Mode

Recognizing this specific glitch-versus-freeze behavior pattern is a genuinely practical diagnostic skill, letting you infer which transport protocol underlies an unfamiliar system's real-time feature just by observing how it fails under imperfect network conditions, without needing to read its source code at all.
