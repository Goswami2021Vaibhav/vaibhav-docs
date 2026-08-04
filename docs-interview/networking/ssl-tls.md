---
title: SSL/TLS
description: The handshake, certificates, and what's actually being secured.
sidebar_position: 6
---

# SSL/TLS

## 1. What does TLS actually protect against?

### 📖 Introduction

This chapter is the full mechanics behind "what does HTTPS add," raised in the HTTP & HTTPS chapter of this guide.

### 🛡️ The Three Properties

**Confidentiality** — data is encrypted, so anyone intercepting it can't read the actual content. **Integrity** — any tampering with the data in transit would be detectable, since it would break a cryptographic check. **Authentication** — the client can verify it's genuinely talking to the real, intended server, not an impostor.

### 💎 Good to Know: This Guide Covers the Mechanics, the Web Security Guide Covers Why It Matters

The Web Security guide's Data Security chapter covers why encryption in transit matters from a security-priorities perspective. This chapter covers the actual protocol mechanics — the handshake, covered next — that deliver on these three promises specifically for web traffic.

---

## 2. Why do people still say "SSL" when the actual protocol in use today is TLS?

### 📖 Introduction

The name outlived the technology it originally referred to.

### 📜 What Happened to SSL

SSL, Secure Sockets Layer, was the original protocol, but it had serious security flaws discovered over time. It was formally deprecated and replaced by TLS, Transport Layer Security, which is essentially SSL's successor, not a completely separate thing.

### 🗣️ Why the Name Persists

"SSL" became such a widely used, familiar term in casual and marketing language — "SSL certificate," "SSL encryption" — that the name stuck around in common usage long after the actual underlying protocol had been entirely replaced by TLS.

### 💎 Good to Know: "SSL Certificate" Today Genuinely Means a TLS Certificate

No modern, properly configured system actually uses the real, original SSL protocol at all anymore, despite the name's continued popular use — worth being precise about this distinction even while using the common terminology.

---

## 3. Walk through the TLS handshake step by step.

### 📖 Introduction

This is the centerpiece question of the entire chapter.

### 🔄 The Steps

**Client Hello** — the client sends the TLS versions and cipher suites it supports, plus a random value. **Server Hello** — the server picks a cipher suite from what the client offered, sends its own random value, and sends its certificate, covered next. **Certificate verification** — the client verifies the certificate, covered in the next two questions. **Key exchange** — both sides use asymmetric cryptography, covered later in this chapter, to securely agree on a shared symmetric key without ever transmitting that key directly over the connection. **Switch to symmetric encryption** — both sides use the newly agreed symmetric key for all subsequent communication. **Finished** — a confirmation message that the handshake completed successfully, and encrypted application data, the actual HTTP request from the previous chapter, can now flow.

```
Client --- Client Hello ------>  Server
Client <-- Server Hello + Cert - Server
Client --- Key Exchange ------>  Server
Client <-- Finished -----------  Server
Client --- Finished ----------->  Server
        [ encrypted application data flows from here ]
```

### 💎 Good to Know: This Is the Mechanism Behind "TLS Handshake Overhead"

The Performance Optimization guide's network chapter covers why this costs real latency — multiple round trips before any actual application data can flow. This question is the actual, literal content of what happens during those round trips.

---

## 4. What is a digital certificate, and what does it actually contain?

### 📖 Introduction

A certificate is fundamentally a statement, and everything else in this chapter is about verifying that statement is trustworthy.

### 📋 What It Contains

The domain name or names it's valid for, the server's public key, covered later in this chapter, the issuing Certificate Authority's identity, covered next, an expiration date, covered later in this chapter, and a digital signature from the issuing CA cryptographically vouching for all of this information's authenticity.

### 💎 Good to Know: A Certificate Is a Statement, and This Chapter Is About Verifying It

"I, a trusted Certificate Authority, verify that this specific public key genuinely belongs to this specific domain" — the chain of trust and certificate validation during the handshake, both covered later in this chapter, are really about how a client can verify that statement is genuinely trustworthy.

---

## 5. What is a Certificate Authority, and why does a browser trust a certificate it issued?

### 📖 Introduction

This is fundamentally a "trust transitively" model — you don't personally verify every website yourself.

### 🏢 What It Is

An organization that issues digital certificates, performing some level of verification — that the requester genuinely controls the domain in question — before issuing one.

### 🤝 Why a Browser Trusts It

Browsers and operating systems ship with a pre-installed list of trusted, well-known CAs' public keys. When a server presents a certificate signed by one of these already-trusted CAs, the browser can cryptographically verify that signature is genuine, and therefore extends its existing trust in the CA to trust this new certificate the CA vouched for.

### 💎 Good to Know: The Whole System's Security Depends on Root CAs Being Careful

You trust a small number of well-established, vetted CAs, and transitively trust whatever those CAs vouch for — the entire system depends on those root CAs being genuinely careful and trustworthy in who they issue certificates to.

---

## 6. What is the chain of trust, and how does a browser verify it?

### 📖 Introduction

Root CAs rarely sign a website's certificate directly — this is why.

### ⛓️ What It Is

Rather than a root CA directly signing every single website's certificate itself, root CAs typically sign intermediate certificates, which then sign the actual website's certificate — creating a chain: root, then intermediate, then website certificate.

### 🔍 How a Browser Verifies It

The browser checks that the website's certificate was genuinely signed by the intermediate, and that the intermediate was genuinely signed by a root CA the browser already trusts — walking back up this chain until it reaches an already-trusted root, confirming the entire chain is cryptographically valid at every step.

### 💎 Good to Know: Intermediates Protect the Root's Sensitive Private Key

Using intermediate certificates, rather than root CAs signing everything directly, is a deliberate security practice — it lets a root CA's extremely sensitive, high-value private key stay offline and rarely used, while the more frequently used intermediate certificates handle day-to-day signing, limiting the damage if an intermediate's key is ever compromised, since it can be revoked without needing to replace the root itself.

---

## 7. What's the difference between a self-signed certificate and a CA-issued one?

### 📖 Introduction

A self-signed certificate is missing exactly the piece that makes TLS's authentication property meaningful.

### ✍️ Self-Signed

A certificate where the entity presenting it also signed it itself, rather than a trusted third-party CA, from the previous question, vouching for it.

### ⚠️ Why Browsers Warn About Them

Since there's no trusted third party verifying the claim — "this key belongs to this domain" — a browser has no independent way to confirm the certificate is genuinely legitimate. It's literally the same as the server just claiming "trust me" with nothing backing that claim up, exactly the scenario TLS's authentication property, from the first question of this chapter, is designed to prevent.

### 💎 Good to Know: Self-Signed Certificates Are Still Genuinely Useful Internally

For internal tools or local development environments, where you don't need broad, public trust and can manually tell your own systems to trust that specific certificate directly. The warning exists specifically because a public-facing website presenting one is a genuine red flag for a random visitor with no prior relationship to that server.

---

## 8. During the handshake, both symmetric and asymmetric encryption get used — what's each one doing?

### 📖 Introduction

This is the TLS-specific application of a hybrid pattern covered more generally in the Web Security guide.

### 🔑 What Each Is Doing

Asymmetric encryption is used during the handshake specifically to securely agree on a shared secret without ever transmitting that secret directly over the, not-yet-encrypted, connection. Symmetric encryption is then used for all the actual, bulk application data — the real HTTP traffic — for the rest of the connection.

### 🤔 Why Not Just Use One

Asymmetric encryption is computationally expensive and slow — genuinely impractical for encrypting large amounts of ongoing data. Symmetric encryption is fast, but requires both sides to already share the same secret key, which is exactly the problem asymmetric encryption solves during the initial handshake.

### 💎 Good to Know: TLS Is the Most Common Real-World Example of This Hybrid Pattern

The Web Security guide's Data Security chapter covers this pattern generally — asymmetric for a small, critical exchange, symmetric for the bulk of the work. TLS is genuinely the most common, everyday real-world example of this exact pattern in action.

---

## 9. Why does a browser treat an expired certificate as a hard failure rather than a warning?

### 📖 Introduction

Expiration exists on purpose, and skipping it would defeat the point.

### ⏰ What Happens

A browser treats an expired certificate as a genuine, blocking error — a full-page warning, requiring explicit user override to proceed — not a minor, dismissible notice.

### 🎯 Why a Hard Failure

Certificate expiration exists specifically to limit how long a certificate remains valid and trusted, even if something about it turns out to be compromised later — a shorter-lived certificate limits the damage window. An expired certificate provides no cryptographic guarantee it hasn't been compromised in the meantime, so a browser can't safely treat it as equivalent to a genuinely valid one, even though nothing about the underlying key material itself necessarily changed the moment it expired.

### 💎 Good to Know: This Is a Genuinely Common, Entirely Avoidable Outage Cause

A team that forgets to renew a certificate before its expiration date experiences a sudden, hard failure for every visitor simultaneously — directly setting up this chapter's closing production scenario.

---

## 10. What is a mixed content warning, and why does one plain-HTTP resource undermine an HTTPS page's security?

### 📖 Introduction

"Mostly encrypted" genuinely isn't the same as "encrypted."

### ⚠️ What It Is

A warning, sometimes an outright block, triggered when an otherwise HTTPS page attempts to load even a single resource, an image, a script, over plain, unencrypted HTTP.

### 💥 Why One Resource Undermines the Whole Page

That one unencrypted resource load is a genuine opportunity for a network attacker to intercept or modify it, directly breaking the confidentiality and integrity properties from the first question of this chapter for that one resource specifically. Worse, if that resource is something like a JavaScript file, a compromised, intercepted version of it could genuinely compromise the entire, otherwise-secure page — a malicious script has full access to the page's DOM regardless of how it was loaded, covered in the Web Security guide's Client-Side Security chapter.

### 💎 Good to Know: A Single Weak Link Compromises the Whole Page's Guarantee

This is exactly why browsers treat mixed content so seriously — a single weak link can compromise the security guarantee for the entire page, not just that one specific resource itself.

---

## 11. What's the practical difference between TLS 1.2 and TLS 1.3?

### 📖 Introduction

TLS 1.3 is both faster and more secure by default, not a tradeoff between the two.

### ⚡ The Practical Difference

TLS 1.3 genuinely simplified and shortened the handshake compared to 1.2, reducing the number of round trips needed before encrypted application data can start flowing — in some cases supporting "0-RTT," letting a returning client to a previously visited server start sending encrypted data almost immediately, reusing information from a prior connection.

### 🎯 Why a Faster Handshake Matters Practically

This directly connects to the Performance Optimization guide's handshake-overhead discussion, and the connection-reuse discussion from the previous chapter covering when a fresh connection is even needed. Every new HTTPS connection pays this handshake cost, so a genuinely shorter handshake directly reduces real, measurable latency for every new connection established across the entire web.

### 💎 Good to Know: TLS 1.3 Also Removed Weaker Algorithms

TLS 1.3 removed support for several older, cryptographically weaker algorithms that 1.2 still allowed for backward compatibility — meaning 1.3 is genuinely more secure by default, since it structurally prevents a connection from ever negotiating down to a known-weaker cryptographic option.

---

## 12. What is certificate pinning, and what attack does it defend against?

### 📖 Introduction

Normal chain-of-trust verification has one specific gap, and pinning is the deliberate, risky fix for it.

### 📌 What It Is

An application, typically a mobile app, though technically possible on the web too, hard-codes or expects one specific certificate, or public key, for a given server, rejecting a connection even if the presented certificate is technically valid and chains up to a trusted root, if it doesn't match the specifically expected one.

### 🎯 What It Defends Against

A genuinely compromised or maliciously coerced Certificate Authority could, in theory, issue a valid, properly chained certificate for a domain it doesn't actually legitimately control. Normal chain-of-trust verification would accept this fraudulent-but-technically-valid certificate, since it genuinely does trace back to a trusted root. Pinning defends specifically against this scenario by refusing to trust any certificate other than the one specific one that was explicitly expected, regardless of whether it's otherwise technically valid.

### 💎 Good to Know: Pinning Is Powerful but Genuinely Risky to Operate

If the expected, pinned certificate itself needs to be legitimately rotated and the application wasn't updated with the new expected value first, the application will incorrectly reject the legitimate new certificate too, causing a genuine, self-inflicted outage — a real operational cost that has to be carefully managed alongside the security benefit.

---

## 13. What is Server Name Indication (SNI)?

### 📖 Introduction

The previous chapter's `Host` header question foreshadowed this connection — here's the full coverage.

### 🏷️ What It Is

A piece of information the client includes early in the TLS handshake, specifically in the Client Hello, before the connection is even encrypted yet, explicitly stating which domain it's trying to reach.

### 🌐 How It Lets One Server Host Multiple HTTPS Domains on One IP

Without SNI, a server receiving a new TLS connection would have no way to know which of potentially many different domains and certificates it hosts, the same multi-domain-per-IP scenario from the previous chapter's `Host` header question, the client is actually trying to reach, until after the encrypted connection was already established — meaning it could only ever present one, fixed certificate per IP address. SNI solves this by having the client explicitly state the intended domain upfront, letting the server select and present the correct, matching certificate for that specific domain during the very same handshake.

### 💎 Good to Know: SNI and the `Host` Header Solve the Same Problem at Different Points

Both solve a genuinely similar "which domain do you actually mean" problem, just at different points in the connection — SNI happens first, during the still-unencrypted TLS handshake itself, so the server can pick the right certificate; the `Host` header comes later, inside the now-encrypted HTTP request, so the server can route to the right application.

---

## 14. How would you verify that a website's TLS certificate is actually valid and correctly configured?

### 📖 Introduction

This is a genuinely practical, everyday diagnostic skill, directly paralleling similar questions from earlier chapters of this guide.

### 🖥️ From a Browser

Clicking the padlock icon in the address bar typically shows certificate details — issuer, validity dates, the domain or domains it covers.

### 💻 From the Command Line

A tool like `openssl s_client -connect example.com:443` connects directly and displays the full certificate chain and details, letting you inspect the raw certificate information from earlier in this chapter without relying on a browser's summarized UI presentation of it.

### 💎 Good to Know: This Guide Keeps Returning to the Same Underlying Theme

Directly paralleling inspecting raw HTTP from the previous chapter, and using `dig`/`nslookup` from the DNS chapter — being able to inspect the raw, underlying protocol details yourself, rather than trusting a higher-level tool's summarized interpretation, is consistently one of the most practical diagnostic skills covered throughout this guide.

---

## 15. What's the difference between domain-validated, organization-validated, and extended-validation certificates?

### 📖 Introduction

These three categories exist, but their practical relevance has genuinely shifted over time.

### 📋 The Three Categories

**Domain Validated (DV)** — the CA only verifies the requester controls the domain, via a DNS TXT record or an email to a domain-associated address, from the DNS chapter of this guide. The fastest, cheapest, most common type today. **Organization Validated (OV)** — the CA additionally verifies the requesting organization's actual legal identity and existence. **Extended Validation (EV)** — the most rigorous verification process, historically displayed with special, prominent visual treatment in the browser, the organization's name shown directly in the address bar.

### 🤔 Does the Distinction Still Matter?

Less than it used to. Most modern browsers have largely removed the special visual distinction EV certificates used to get, since research showed most users never actually noticed or understood the difference anyway. For most practical purposes today, a DV certificate provides the exact same underlying encryption and technical security as an EV one — the difference is really about the level of real-world identity verification behind it, not the cryptographic protection itself.

### 💎 Good to Know: Worth Knowing for Interviews, Even With Diminished Practical Relevance

Worth knowing these three categories exist and what they historically represented, while also being honest that the practical, day-to-day relevance of the distinction has genuinely diminished over time as browser UX has evolved.

---

## 16. In production, your HTTPS site suddenly starts showing a certificate warning to all visitors — walk through how you'd diagnose it.

### 📖 Introduction

This closes the chapter with the practical payoff of the expiration discussion earlier in this chapter.

### 🔍 Diagnostic Approach

Check the certificate's expiration date first — by far the single most common, simple cause of a sudden, affects-everyone warning — using either the browser's certificate details view or a command-line tool, both covered earlier in this chapter. If not expiration, check whether the certificate genuinely matches the domain being served — a misconfiguration serving the wrong certificate for this specific domain, perhaps an SNI misconfiguration on a multi-domain server, covered earlier in this chapter. If neither of those, consider something more serious — has the certificate been revoked, the issuing CA invalidating it before its natural expiration, typically because of a suspected private-key compromise?

### 💎 Good to Know: "Sudden and Universal" Is Itself a Useful Diagnostic Signal

This pattern points strongly toward something central and shared — the certificate itself, expiration being the most common cause by far — rather than something client-specific or gradual, like the DNS-propagation scenario from the previous chapter, where different users would be affected at different times. Recognizing this "sudden and universal" versus "gradual and partial" symptom pattern is itself a genuinely useful diagnostic heuristic that applies across many different kinds of production incidents, not just this specific TLS scenario.
