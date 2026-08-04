---
title: DNS
description: How a domain name turns into an IP address.
sidebar_position: 5
---

# DNS

## 1. What problem does DNS solve?

### 📖 Introduction

This chapter directly resolves the "why do humans and machines prefer different identifiers" question raised in the first chapter of this guide — DNS is the entire mechanism that bridges that gap.

### 🎯 The Problem

IP addresses are numeric, arbitrary, and can change over time — a server migrates, a service scales to different infrastructure. Humans need memorable, meaningful names. DNS provides the translation layer letting people use stable, human-friendly hostnames while the underlying infrastructure's actual IP addresses can change freely without users needing to know or care.

### 💎 Good to Know: This Is the Full Answer to a Question Raised Earlier in This Guide

The first chapter asked why humans and machines prefer different kinds of identifiers. This chapter is the complete mechanism that answers it.

---

## 2. What is the DNS hierarchy?

### 📖 Introduction

DNS is a genuinely distributed lookup system, and it scales precisely because no single server needs complete knowledge.

### 🏗️ The Structure

**Root servers** — the top of the hierarchy, knowing where to find servers for each top-level domain, like `.com` or `.org`. **TLD (Top-Level Domain) servers** — knowing where to find the authoritative servers for every specific domain within that TLD. **Authoritative name servers** — the specific servers that actually hold the real DNS records for one specific domain, `example.com`'s own nameservers.

### 💎 Good to Know: No Single Server Holds All of DNS

Each level only needs to know where to point next, not the final answer itself — a good illustration of a distributed lookup system that scales precisely because no one component needs complete knowledge.

---

## 3. What is a recursive resolver?

### 📖 Introduction

This is what makes a multi-step lookup feel like one simple request from the client's perspective.

### 🔍 What It Is

A server, often run by your ISP or a public service like Google's `8.8.8.8`, that does the actual work of walking through the DNS hierarchy on behalf of a client, so the client itself doesn't need to know how to query root, TLD, and authoritative servers itself.

### 🤝 How It Acts on the Client's Behalf

The client sends one simple query — "what's the IP for example.com?" — to the resolver, and the resolver handles the entire multi-step process of asking root, then TLD, then authoritative servers in sequence, ultimately returning just the final answer back to the client.

### 💎 Good to Know: This Is Why DNS Feels Like One Simple Request

Even though the full resolution process, covered later in this chapter, genuinely involves multiple separate queries happening behind the scenes, the resolver is what abstracts that complexity away from the client entirely.

---

## 4. What is an A record, and how does it differ from an AAAA record?

### 📖 Introduction

Both do the same fundamental job, just for the two IP address generations covered in the first chapter of this guide.

### 📋 The Difference

An **A record** maps a domain name to an IPv4 address. An **AAAA record** maps a domain name to an IPv6 address.

### 💎 Good to Know: A Domain Can Have Both at Once

A client that supports IPv6 might prefer using the AAAA-provided address, while a client that only supports IPv4 falls back to the A record — part of how the internet has been able to gradually transition toward IPv6 without breaking compatibility for devices or networks that still only support IPv4.

---

## 5. What is a CNAME record, and why can't it coexist with other record types at the same name?

### 📖 Introduction

This restriction is a genuinely common, real-world gotcha worth knowing in advance.

### 🔗 What It Is

An alias record, pointing one domain name to another domain name, rather than directly to an IP address — `www.example.com` CNAME-pointing to `example.com` means any lookup for `www.example.com` gets redirected, at the DNS resolution level, to whatever `example.com` itself resolves to.

### ⚠️ Why It Can't Coexist With Other Record Types

A CNAME says "everything about this name should be looked up via this other name instead." Having another record type, like an A record, at that same name would create a genuine ambiguity — should a resolver follow the CNAME, or use the direct A record — that DNS's design simply doesn't allow. This is a hard rule, not just a best practice.

### 💎 Good to Know: This Is a Common, Real Gotcha at a Domain's Root

Teams sometimes want to put a CNAME at their domain's root or apex, `example.com` itself rather than `www.example.com`, but discover this isn't technically allowed, since the root domain typically needs other record types too, like MX for email, covered next — requiring workarounds like a provider-specific "ALIAS" or "ANAME" record type instead.

---

## 6. What is an MX record?

### 📖 Introduction

A domain's website and its email are genuinely independent concerns that just happen to share a name.

### 📧 What It Is

Specifies which mail server or servers are responsible for receiving email sent to addresses at that domain, `@example.com`.

### 🔀 Why It's Unrelated to Website-Serving

A domain's website, its A or CNAME records, and its email infrastructure, its MX records, are genuinely separate concerns. `example.com` might be hosted by one company for its website while using a completely different provider, like Google Workspace, for its email — MX records are how that separation actually works at the DNS level.

### 💎 Good to Know: MX Records Support Basic Failover

MX records genuinely include a priority value, letting a domain specify multiple mail servers with a preferred order — a primary mail server, with one or more backup servers used only if the primary is unreachable. A concrete example of DNS itself supporting a basic form of failover, covered more broadly in the Scalability guide's High Availability chapter, at the email-routing level specifically.

---

## 7. What is a TXT record?

### 📖 Introduction

Unlike A, CNAME, or MX records, this one has no single dedicated purpose.

### 📝 What It Is

A generic record type holding arbitrary text data associated with a domain, not tied to any one specific purpose.

### 🎯 Common Practical Reasons

Domain ownership verification — a third-party service, like Google Search Console, asks you to add a specific, unique TXT record proving you actually control the domain, since only the actual domain owner could add it. And email authentication — SPF records, specifying which mail servers are authorized to send email on behalf of the domain, helping prevent email spoofing.

### 💎 Good to Know: A Single Domain Can Accumulate Many TXT Records for Unrelated Purposes

Because TXT records are so generic, a domain can genuinely accumulate many of them over time — ownership verification for several different third-party services, multiple email-authentication mechanisms. Worth recognizing TXT as DNS's general-purpose record type, rather than a single-purpose one like the others covered in this chapter.

---

## 8. What is a nameserver (NS) record?

### 📖 Introduction

This is the record that actually connects a domain into the hierarchy from earlier in this chapter.

### 📋 What It Is

Specifies which nameservers are authoritative for a given domain — literally telling the rest of the DNS hierarchy "if you want the real, authoritative answer for this domain, ask these specific servers."

### 🏗️ How It Fits Into the Hierarchy

When a TLD server is asked about a specific domain, it responds with that domain's NS records, pointing the resolver toward the authoritative servers that actually hold the real, detailed DNS records — A, CNAME, MX, TXT — for that specific domain.

### 💎 Good to Know: This Is What You're Changing When You "Point" a Domain at a New DNS Provider

Migrating from one registrar or host's DNS service to another is a genuinely common, real operational task, and it's literally just updating which nameservers are listed as authoritative for your domain.

---

## 9. Walk through, step by step, what happens when a browser requests a domain and receives back an IP address.

### 📖 Introduction

This is a closing synthesis question before the caching and propagation questions later in this chapter.

### 🔄 The Step-by-Step Process

The browser checks its own cache, covered next — if not found, checks the OS's cache — if still not found, sends a query to the configured recursive resolver, covered earlier in this chapter. The resolver checks its own cache first. If not cached there either, the resolver queries a root server for the TLD's servers, then queries the appropriate TLD server for the domain's authoritative nameservers, then queries the authoritative server directly for the actual A or AAAA record. The resolver returns this final answer back to the browser, also caching it for future queries.

### 💎 Good to Know: The Full, Uncached Walk Is the Exception, Not the Norm

This entire multi-step process typically completes in mere milliseconds in practice, specifically because of aggressive caching, covered next, at multiple levels — the full walk described here is genuinely the worst case, usually short-circuited at a cached answer well before reaching the root servers at all.

---

## 10. At how many different levels can a DNS answer be cached at once?

### 📖 Introduction

This is exactly why a DNS problem can be genuinely tricky to diagnose.

### 🗂️ The Levels

**The browser itself** — a short-lived, in-memory cache specific to that browser session. **The operating system** — a system-wide cache shared by every application on the device, not just the browser. **The recursive resolver**, from earlier in this chapter — typically the most significant, longest-lived cache layer, shared across every user or device that happens to use the same resolver, every customer of a particular ISP, for instance.

### 💎 Good to Know: A Fix Can Be Correct at the Source and Still Look Broken to Some Users

A DNS change might be correctly updated at the authoritative server level, but a specific user could still see stale results because of a cache sitting at any one of these three separate, independent levels, each with its own, potentially different remaining cache duration, covered next.

---

## 11. What is TTL in the context of a DNS record?

### 📖 Introduction

This is the specific mechanism creating the real, practical delay hinted at in the previous question.

### ⏱️ What It Is

Time To Live — a value, set by the domain's own DNS configuration, specifying how long, in seconds, a resolved answer is allowed to be cached at any of the levels covered in the previous question, before it's considered stale and needs to be re-queried from the authoritative source.

### ⏳ Why It Creates a Real Delay

If you change a domain's A record to point at a new server, anyone or any resolver that already cached the old answer will continue using that stale, cached value until its TTL genuinely expires. The change doesn't take effect instantly and universally the moment you make it — it takes effect gradually, as existing caches across the internet individually expire and re-query.

### 💎 Good to Know: Lower the TTL Before a Planned Migration, Not After

A team planning a genuinely significant DNS change, like a server migration, will deliberately lower the TTL well in advance. By the time the real change happens, most caches have already expired and will pick up the new value quickly, rather than being stuck on a long-cached old answer for hours or days afterward.

---

## 12. Why can changing a domain's DNS records take time to "propagate"?

### 📖 Introduction

"Propagation" is a slightly misleading word for what's actually happening.

### ⏳ What's Actually Happening

"Propagation" isn't the change itself actively spreading out to every server on the internet — the authoritative server's record updates essentially instantly. What's actually happening during the "propagation window" is simply the gradual, natural expiration of every individual cache, covered in the previous two questions, that happened to have the old value cached, each according to its own specific remaining TTL at the moment the change was made.

### 💎 Good to Know: This Reframing Explains Why Propagation Time Is Unpredictable

"Propagation" makes it sound like some active, ongoing broadcast process is happening, when it's actually completely passive — many independent caches simply expiring on their own, individual schedules. Understanding this correctly explains why propagation time is fundamentally unpredictable and variable across different users, each of whose relevant cache happened to have a different amount of TTL remaining at the exact moment the change was made.

---

## 13. What is DNS over HTTPS, and what privacy problem does it address?

### 📖 Introduction

This closes a gap that plain HTTPS on the actual website traffic doesn't cover.

### 🔒 What It Is

Encrypting DNS queries and responses, using HTTPS, covered in this guide's next chapter, between a client and its resolver, rather than sending them as plain, unencrypted text the way traditional DNS historically has.

### 🕵️ The Privacy Problem It Addresses

Traditional, unencrypted DNS means anyone able to observe network traffic between you and your resolver — an ISP, someone on a shared or public Wi-Fi network — can see exactly which domains you're looking up, revealing a surprisingly detailed picture of your browsing activity even without being able to see the actual content of your HTTPS-encrypted traffic itself. DNS over HTTPS closes this specific privacy gap by encrypting the lookup itself too.

### 💎 Good to Know: This Reuses the Same Technology Covered in the Next Chapter

DNS over HTTPS is literally using the same encryption technology, TLS wrapped in HTTPS, that already protects your actual web traffic, now also applied to the DNS lookup step that happens before that web traffic even begins.

---

## 14. What is DNS cache poisoning?

### 📖 Introduction

This attack targets a cache, not the real server, which is exactly what makes it dangerous.

### ☠️ What It Is

An attack where an attacker manages to insert a false, malicious DNS answer into a resolver's cache — causing that resolver to incorrectly answer future queries for a legitimate domain with an attacker-controlled IP address instead of the real one.

### 🎯 How It Redirects Users Without Touching the Real Server

Since the poisoned answer lives in the resolver's cache, not on the real, legitimate authoritative server at all, the actual target server remains completely untouched and secure — but any user relying on that specific poisoned resolver gets silently redirected to the attacker's server instead, believing they're reaching the legitimate site the whole time.

### 💎 Good to Know: DNSSEC and DNS Over HTTPS Are Complementary Defenses

DNSSEC, cryptographically signing DNS records so a resolver can verify an answer genuinely came from the real authoritative source and wasn't tampered with, and DNS over HTTPS, from the previous question, protecting the query in transit specifically, both exist as complementary defenses against different parts of this same broader risk — one protects the data at rest in a cache or at the source, the other protects it while traveling.

---

## 15. How would you use `dig` or `nslookup` to diagnose a domain resolution problem?

### 📖 Introduction

This directly parallels inspecting raw HTTP requests, covered in the previous chapter.

### 🛠️ What They Do

Command-line tools that let you manually perform a DNS query directly, bypassing whatever your browser or OS might already have cached, and see the raw response — which record types exist, what their actual current values are, which nameserver actually answered.

### 🔍 How They Help Diagnose

Running `dig example.com`, or `nslookup`, tells you exactly what the authoritative DNS system currently says, independent of any local caching — letting you definitively confirm whether a problem is genuinely a DNS-configuration issue, the authoritative answer itself is wrong, versus a caching or propagation issue, the authoritative answer is correct, but a specific user's local resolver hasn't caught up yet.

### 💎 Good to Know: A Genuinely Practical, Everyday Diagnostic Skill

Directly paralleling the raw-HTTP-inspection skill from the previous chapter — being able to query DNS directly, bypassing whatever abstraction or caching layer might be masking the real, current state, is often the fastest way to definitively rule DNS in or out as the source of a confusing connectivity problem.

---

## 16. In production, you've updated a DNS record but some users are still routed to the old server hours later — walk through why and what you'd check.

### 📖 Introduction

This closes the chapter with a textbook, direct consequence of everything covered above.

### 🔍 Why This Happens

Caching at multiple independent levels, browser, OS, resolver, each with its own remaining TTL at the moment the change was made, means different users, whose traffic happens to route through different resolvers with different cache states, will genuinely pick up the change at different times — entirely normally and expectedly, the passive, individual cache-expiration process described earlier in this chapter, not a sign anything is actually broken.

### 🛠️ What to Check

Use `dig` or `nslookup`, from the previous question, against the authoritative nameservers directly to confirm the change is genuinely, correctly live at the source, ruling out a configuration mistake. Check whether the TTL on the old record was set reasonably low before the change was made — a team that forgot to lower it in advance will see a genuinely longer, more painful propagation window than one that planned ahead. If the affected users are concentrated behind one specific ISP or resolver, that specific resolver's cache is likely just still holding the old, not-yet-expired answer.

### 💎 Good to Know: "The Record Is Updated" and "Every User Sees the Update" Are Different Claims

Separated by the entire caching and TTL discipline covered throughout this chapter — a team that understands this distinction plans the TTL adjustment before a migration; a team that doesn't ends up genuinely confused by exactly this production symptom, mistaking normal, expected cache-expiration behavior for a genuine, ongoing configuration bug.
