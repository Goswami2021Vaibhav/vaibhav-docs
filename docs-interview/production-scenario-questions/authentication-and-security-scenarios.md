---
title: Authentication & Security Scenarios
description: Incident-style questions about auth and security failures.
sidebar_position: 4
---

# Authentication & Security Scenarios

## 1. Users report being randomly logged out throughout the day for no apparent reason — how would you investigate whether this is a token, session, or infrastructure issue?

### 📖 Introduction

"Randomly logged out" has a small, well-defined set of actual causes — the investigation is really about elimination.

### 🔍 Token or Session Cause

Check the actual expiration time being set on tokens or sessions — a shorter-than-intended expiration would produce exactly this symptom, logging users out well before they'd expect. Check whether a token refresh mechanism, if one exists, is actually working correctly, since a silently failing refresh would cause a user to be logged out the moment their original token expires instead of being transparently renewed.

### 🔍 Infrastructure Cause

If sessions are stored server-side, check whether all application instances are reading from the same, shared session store — an instance that's accidentally using its own local, separate store would make a user look logged out the moment a request happens to land on a different instance than the one that created their session, covered generally in the Scalability guide's discussion of stateful versus stateless architecture.

### 💎 Good to Know: The Symptom Alone Doesn't Tell You Which Cause It Is

"Randomly" logged out, without any other detail, is consistent with several genuinely different root causes — the actual investigation depends on gathering more specifics, like whether it correlates with a particular server instance, a particular time since login, or a particular type of request, before the real cause narrows down.

---

## 2. You discover that a specific API endpoint meant to be authenticated has been publicly accessible for an unknown period of time — walk through your immediate response.

### 📖 Introduction

The priority order here matters — stopping the exposure comes before fully understanding its scope.

### 🚨 Immediate Response

Fix the missing authentication check immediately, closing the exposure before doing anything else. In parallel, or immediately after, determine how long the endpoint was actually exposed, using deploy history to find when the missing check was introduced, and check access logs for that entire window to see whether the endpoint was actually accessed by anyone during it, and if so, by whom and how many times.

### 🔍 Assessing the Damage

If the endpoint exposed sensitive data, treat any access during the exposure window as a potential data exposure incident, covered generally in the Web Security guide's Logging, Monitoring & Incident Response chapter, requiring you to determine what data was actually reachable and whether any specific access pattern looks like deliberate exploitation versus incidental, harmless traffic.

### 💎 Good to Know: "It's Fixed Now" Isn't the End of the Response

Closing the hole stops new exposure, but doesn't undo whatever already happened during the exposure window — the investigation into what was actually accessed while it was open is a necessary, separate step, not an optional afterthought.

---

## 3. A user reports someone else accessed their account — how would you investigate whether this was a credential compromise, a session hijack, or something else?

### 📖 Introduction

These three causes point toward genuinely different fixes, so distinguishing between them is the actual point of the investigation.

### 🔍 Credential Compromise

The attacker obtained the user's actual username and password, typically through phishing, a data breach at another service where the user reused the same password, or malware on their device. Look for a successful login from an unfamiliar location or device, using what appear to be the correct, valid credentials.

### 🔍 Session Hijack

The attacker obtained a valid, already-authenticated session token, without ever needing the user's actual password — through a stolen cookie, a network-level interception, or a cross-site scripting vulnerability, covered generally in the Web Security guide's Client-Side Security chapter. Look for account activity that continues from an existing session without a corresponding new login event at all.

### 🔍 Something Else

A shared device the user forgot they were logged in on, or a account genuinely shared between multiple people, both of which look identical to "unauthorized access" from the account owner's perspective but aren't actually a security compromise at all.

### 💎 Good to Know: The Presence or Absence of a New Login Event Is a Genuinely Useful Signal

A new, successful login from an unfamiliar source points toward credential compromise; unexplained activity with no matching new login points more toward session hijacking — this distinction alone meaningfully narrows down which of the two more serious causes you're actually dealing with.

---

## 4. Your team discovers an API key was accidentally committed to a public repository — walk through the full incident response, not just rotating the key.

### 📖 Introduction

Rotating the key is necessary but is only the first of several genuinely separate steps.

### 🔧 The Full Response

Rotate the exposed key immediately, invalidating the old one, since it must now be treated as fully compromised the moment it became public, regardless of whether it's actually been misused yet. Check whatever usage logs the key's associated service provides for any activity during the exposure window that doesn't match your own application's expected usage pattern. Remove the key from the repository's history, not just the latest commit, since the exposed value remains recoverable from git history even after the current file is fixed. Investigate how it was committed in the first place, and address that root cause — commonly, a missing entry in a file meant to exclude sensitive files from version control, or a secret that should have lived in an environment variable instead of the codebase.

### 💎 Good to Know: Removing It From the Latest Commit Doesn't Remove It From the Repository

A secret committed to git remains present in the repository's history even after a later commit deletes it from the current files — genuinely removing it requires rewriting history, and even then, if the repository is public, the key should always be treated as permanently compromised, since it may have already been copied or indexed elsewhere before the cleanup happened.

---

## 5. A spike in failed login attempts against a single account suggests a credential-stuffing or brute-force attempt — how would you confirm this and what would you do about it in the moment?

### 📖 Introduction

The two attack patterns named here are related but distinguishable, and the right response depends partly on which one you're actually seeing.

### 🔍 Confirming It

Look at the pattern of the failed attempts — a brute-force attempt against one account typically tries many different password guesses in rapid succession from a small number of sources. Credential stuffing typically involves previously leaked username/password pairs from other, unrelated breaches being tried against your service, often as part of a much larger, automated attempt spanning many different accounts at once, not just the one you happened to notice.

### 🎯 What to Do in the Moment

Rate limit or temporarily lock the specific targeted account after a reasonable number of failed attempts, covered generally in the Web Security guide's Authentication & Authorization chapter, to stop the immediate attempt from succeeding. Check whether other accounts are showing the same pattern simultaneously, since a single flagged account is often just the most visible part of a much broader, automated attempt against many accounts at once.

### 💎 Good to Know: Multi-Factor Authentication Is the Strongest Practical Defense Against Both Patterns

Even a successfully guessed or leaked password stops being sufficient on its own if a second factor is required — this is exactly why MFA, covered in the Web Security guide, is considered such a strong, practical mitigation against both brute-force and credential-stuffing attacks specifically.

---

## 6. After a password reset feature ships, a user reports they can reset another user's password by modifying a request — how would you have caught this before it reached production?

### 📖 Introduction

This is a classic broken-access-control bug, and the question is deliberately about prevention, not just the fix.

### 🐛 What the Bug Actually Is

The password reset endpoint is trusting a client-supplied identifier, a user ID in the request itself, rather than verifying server-side that the request is genuinely authorized to act on that specific account — exactly the class of vulnerability covered generally in the Web Security guide's Authentication & Authorization chapter.

### 🛡️ How This Should Have Been Caught Earlier

A code review specifically looking for any endpoint that accepts a user or resource identifier from the client and checking whether that identifier is actually verified against the authenticated requester's own identity, not merely trusted as-is. A security-focused test case that deliberately tries to act on another user's data using a legitimate, valid session, exactly the kind of test this bug's absence reveals was missing.

### 💎 Good to Know: This Exact Class of Bug Recurs Constantly Because It's an Easy Mistake to Make

Trusting a client-supplied identifier instead of deriving the relevant identity from the authenticated session itself is one of the most common, recurring real-world vulnerability patterns — worth specifically training a team's code-review habits around, rather than treating each individual instance as a one-off surprise.

---

## 7. Your JWT-based auth system has no way to revoke a token before it naturally expires, and you now need to force-logout a specific compromised account immediately — how would you handle this given that constraint?

### 📖 Introduction

This scenario deliberately puts you in a bind created by a well-known tradeoff of a specific auth design.

### ⚠️ Why the Constraint Exists

A JWT is typically self-contained and verified purely by its cryptographic signature, without needing a database lookup on every single request, which is exactly what makes it fast — but that same design means the server has no natural, built-in way to say "this specific still-unexpired token is no longer valid" without adding some additional mechanism.

### 🔧 How to Handle It Given the Constraint

Maintain a denylist, a small, checked list of specifically revoked token identifiers, that gets checked on requests even though it reintroduces the lookup a pure JWT design was trying to avoid — an acceptable, deliberate tradeoff specifically for handling this kind of urgent revocation case. If the system also uses a shorter-lived access token alongside a longer-lived refresh token, revoking the refresh token immediately at least ensures the compromised access stops the moment the short-lived token naturally expires shortly after.

### 💎 Good to Know: This Is a Direct, Real-World Consequence of a Design Tradeoff Made Long Before This Incident

This exact bind is the practical cost of choosing a fully stateless JWT design without planning for revocation upfront — a good answer here recognizes that the "fix" is really a deliberate, partial compromise on the original design's statelessness, not a clean, free solution.

---

## 8. A third-party OAuth provider your app depends on for login has an outage — how should your application degrade, and what should users see?

### 📖 Introduction

This is about designing for graceful degradation of a dependency you don't control, the same underlying idea as the circuit-breaker discussion in the API & Backend Scenarios chapter of this guide, applied specifically to authentication.

### 🎯 How It Should Degrade

Users who are already logged in, with an existing valid session, shouldn't be affected at all — the outage only actually matters for new login attempts. New login attempts specifically through the affected provider should fail clearly and quickly, with a message that explains the third party is currently unavailable, rather than hanging indefinitely or showing a confusing, generic error.

### 🔧 What Reduces the Impact

If the application supports more than one login method, an email/password option alongside OAuth for example, users genuinely have a working fallback during the outage. If OAuth is the only supported login method, this scenario is a strong argument for why offering at least one independent alternative is worth the added complexity, precisely to avoid single-provider login being a full outage for every new or logged-out user.

### 💎 Good to Know: This Is the Authentication-Specific Version of "Don't Let One Dependency Take Down Everything"

The underlying lesson here is identical to the third-party API resilience question in the API & Backend Scenarios chapter of this guide — a dependency you don't control failing shouldn't be able to fully block a core function of your application if there's any reasonable way to avoid that.

---

## 9. You're told a former employee's access to internal systems was never revoked after they left — how would you assess the actual exposure and what would you do first?

### 📖 Introduction

The very first action here should be the one that actually stops any ongoing risk, before anything else.

### 🚨 What to Do First

Revoke the access immediately, across every system it actually extends to — this comes before fully investigating anything else, since every moment the access remains valid is ongoing, unnecessary risk.

### 🔍 Assessing the Exposure

Determine exactly what systems and data that access actually covered, and review logs for any activity on those systems during the entire window between the employee's departure and the access finally being revoked, looking specifically for anything that doesn't match legitimate, ongoing business activity by someone else.

### 💎 Good to Know: This Incident Usually Points to a Missing Process, Not Just a Missed Step

A single forgotten revocation is a mistake; the complete absence of any offboarding checklist or automated deprovisioning process that would have caught it is the actual underlying, systemic problem — the fix that actually prevents a repeat is addressing that missing process, not just revoking this one specific former employee's access.

---

## 10. A security researcher emails you reporting a vulnerability they found in production — walk through how you'd handle this responsibly from first contact to resolution.

### 📖 Introduction

How this is handled has real consequences for whether future researchers report to you responsibly at all, not just for this one specific report.

### 🗣️ First Contact

Respond promptly and take the report seriously, treating it as a genuine, good-faith contribution rather than a threat, even before it's been fully verified — a dismissive or hostile initial response is a common, avoidable reason a researcher might instead choose to disclose the issue publicly without giving you a chance to fix it first.

### 🔍 Verification and Resolution

Reproduce and confirm the vulnerability internally, assess its actual severity and whether it's been exploited already, from the logs-review pattern used throughout this chapter, and fix it with appropriate urgency based on that severity. Keep the researcher genuinely informed of progress, rather than going silent after the initial acknowledgment.

### 💎 Good to Know: A Clear Reporting Process Set Up in Advance Makes This Go Much More Smoothly

Having a known, published way for researchers to responsibly report a vulnerability, and clear internal expectations for how such a report gets triaged and handled, turns this scenario from an ad hoc scramble into a well-understood, repeatable process — worth having in place before the first report ever actually arrives.

---

## 11. Your team needs to roll out a mandatory password reset for all users after a suspected breach — walk through how you'd do this without causing mass support tickets and confusion.

### 📖 Introduction

This closes the chapter by tying together the incident-response, communication, and user-experience threads running through it.

### 🗣️ Communication

Explain clearly, in plain language, why the reset is happening and what users actually need to do — a vague or overly technical explanation invites confusion and unnecessary support tickets far more than a clear, honest one does. Communicate proactively, through email or an in-app notice, rather than only surprising users with a forced reset the next time they happen to try logging in.

### 🔧 Execution

Make the reset flow itself as smooth and low-friction as possible, since forcing an already-frustrated user through a clunky process compounds the problem. Have support and documentation genuinely ready in advance, anticipating the predictable wave of questions this kind of mass action reliably generates, rather than being caught flat-footed by it after the rollout begins.

### 💎 Good to Know: The Technical Fix and the Communication Plan Are Equally Important Here

Forcing a password reset is technically simple to implement, but a mishandled rollout can generate a support and trust crisis that rivals the original security incident itself — this closing scenario is a reminder that a security response is rarely purely a technical problem in isolation.
