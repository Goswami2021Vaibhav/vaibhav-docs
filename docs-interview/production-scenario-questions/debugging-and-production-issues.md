---
title: Debugging & Production Issues
description: Approaching an unfamiliar production bug methodically.
sidebar_position: 11
---

# Debugging & Production Issues

## 1. You're paged for an issue in a part of the codebase you've never worked on before, and the original author is unavailable — walk through how you'd approach it methodically.

### 📖 Introduction

This chapter closes out the practical diagnostic reasoning that's run implicitly through every prior chapter of this subject, starting with the most basic situation of all — unfamiliar code, no one to ask.

### 🧭 Methodical Approach

Start from the actual symptom, not the code — what's actually failing, for whom, and since when, gathering that concrete evidence before diving into unfamiliar code with no map. Use the evidence to narrow down roughly where in the system the problem likely lives, then read only that relevant area closely enough to understand what it's supposed to do, rather than trying to understand the entire unfamiliar codebase before doing anything else. Use version history on the specific relevant files to understand the reasoning and context behind the existing code, even without the original author available to ask directly.

### 💎 Good to Know: Unfamiliarity Is a Normal Starting Condition, Not a Blocker

Nearly every production incident in a real system of any size involves at least some code the responder didn't personally write — treating this as the normal case to have a methodical approach for, rather than an unusual, blocking obstacle, is what actually makes it tractable.

---

## 2. A bug is reported as "sometimes happens" with no clear reproduction steps — how would you approach turning this into something you can actually investigate?

### 📖 Introduction

"Sometimes" is rarely truly random — the goal here is finding the actual condition hiding behind that vague word.

### 🧭 How to Approach It

Gather every specific instance you can find, exact timestamps, affected users, and any available context, rather than treating the report as one single, vague event. Look for what those specific instances actually have in common — a shared browser, a shared type of input, a shared time of day, or a shared upstream condition — the same pattern-finding approach used throughout this whole subject whenever a problem seems to affect some but not all cases.

### 🎯 What This Turns Into

Once a shared factor is found, it becomes a genuine, specific hypothesis you can actually test — "this happens specifically when X" — rather than an unfalsifiable, vague "sometimes," which is difficult to investigate not because it lacks a cause, but because nobody has yet found the actual pattern behind it.

### 💎 Good to Know: "No Clear Reproduction Steps" Usually Means "Not Enough Data Points Gathered Yet," Not "Unreproducible"

A bug that genuinely can't be pinned to any condition at all is rare — most "sometimes" bugs become reproducible once enough actual instances are collected and compared side by side for what they share in common.

---

## 3. Your logs show an error, but the error message alone doesn't explain why it happened — what would you do next to get more context?

### 📖 Introduction

An error message tells you what failed, not necessarily why — this question is about closing that gap.

### 🔍 What to Do Next

Look at what happened immediately before the error in the logs, the sequence of events leading up to it, rather than only the single line where it actually surfaced — the actual cause is often visible a few steps earlier, even if the error itself doesn't mention it directly. Check whether the error includes, or can be correlated with, enough context, a request ID, a user ID, specific input values, to reconstruct the exact situation that triggered it, rather than just the generic fact that it occurred.

### 🎯 If the Existing Logs Genuinely Aren't Enough

Add more targeted logging around the suspected area, and wait for the issue to occur again, or attempt a deliberate reproduction, from the previous question in this chapter, now armed with a specific hypothesis about the actual condition.

### 💎 Good to Know: This Is Exactly Why the Logs Available During an Incident Determine How Fast It Can Actually Be Resolved

An error message with no surrounding context turns "why did this happen" into a much slower investigation than it needs to be — this is the practical reason logging quality, covered generally in the Web Security guide's Logging, Monitoring & Incident Response chapter, matters well before any specific incident actually happens.

---

## 4. You fix a bug, but a similar issue shows up again in a slightly different part of the system a few weeks later — how would you approach finding whether there's a shared root cause?

### 📖 Introduction

A recurring, similar-but-not-identical issue is often a sign the original fix addressed a symptom rather than the deeper, shared cause behind both.

### 🔍 How to Investigate the Shared Cause

Compare the two issues closely, not just at the surface level of "similar symptom," but at the level of the actual underlying mechanism — do they both stem from the same kind of mistake, a missing validation, a shared assumption that turned out to be wrong, a similar race condition, just manifesting in two different specific locations. If a shared underlying pattern is found, search the rest of the codebase for other places that same pattern might also exist, even if they haven't caused a visible issue yet.

### 🎯 Fixing the Actual Root Cause

If the original fix addressed only the one specific instance rather than the shared underlying cause, consider whether a more structural fix, one that prevents the entire category of mistake rather than just this one occurrence of it, is now worth the investment, given that it's already recurred once.

### 💎 Good to Know: A Recurring "Similar" Bug Is a Strong Signal to Look One Level Deeper Than the Original Fix Did

Fixing the same symptom twice in two different places, without ever addressing why that mistake keeps happening in the first place, tends to guarantee a third occurrence somewhere else eventually — recognizing this pattern is what justifies spending the extra effort on a genuinely structural fix instead of another one-off patch.

---

## 5. Production is broken right now, and users are actively affected — how would you prioritize getting the system stable again versus fully understanding the root cause?

### 📖 Introduction

This question makes explicit the priority ordering that's been implicit throughout nearly every scenario in this entire subject.

### 🎯 The Priority Order

Restoring stability comes first — a rollback, a feature flag disable, or any other fast mitigation that stops user impact, even without yet fully understanding why the problem happened. Fully understanding the root cause comes after, once users are no longer actively affected, since a rushed diagnosis under the pressure of an ongoing, live incident is both slower and more error-prone than a calm investigation conducted afterward.

### 🤔 Why This Order, Not the Reverse

Every minute spent fully diagnosing a live issue before taking any mitigating action is a minute of continued, unnecessary user impact — a fast, even if imperfect or temporary, mitigation reduces that impact immediately, while the full, careful investigation can safely happen once the immediate pressure and user-facing harm is no longer accumulating.

### 💎 Good to Know: This Priority Ordering Is Why "Roll Back First, Investigate After" Recurs Throughout This Subject

This exact ordering shows up repeatedly across this subject's chapters, in deploy-related incidents, database incidents, and security incidents alike — it's a genuinely general incident-response principle, not something specific to any one particular type of production problem.

---

## 6. You suspect a specific recent change caused an issue, but you can't reproduce it locally no matter what you try — what would you check that only exists in production?

### 📖 Introduction

This question directly echoes the "can't reproduce locally" reasoning used throughout this entire subject, now made explicit as its own general principle.

### 🔍 What Only Exists in Production

Real, larger-scale, and messier data, unlike a small, clean local or test dataset. Genuine concurrent load and traffic, from real simultaneous users, which a single local developer testing manually can never actually replicate. Production-specific configuration, infrastructure, or environment differences that a local setup, even a carefully maintained one, rarely reproduces with complete fidelity.

### 🧭 How to Use This

Rather than continuing to attempt reproduction locally under conditions that structurally can't match production, deliberately try to recreate one of these specific production-only conditions instead — a larger, more realistic dataset, simulated concurrent load, or the actual production configuration values — since the bug likely depends on one of these differences existing in the first place.

### 💎 Good to Know: This Same Reasoning Recurs Constantly Throughout This Entire Subject

Nearly every "works everywhere except X" scenario across this subject's chapters resolves to some version of this same underlying idea — find what's genuinely different about the condition where it fails, and treat that difference as the leading hypothesis, rather than continuing to test under conditions that were never actually representative of where the bug occurs.

---

## 7. Two symptoms show up around the same time, and you're not sure whether they're related or a coincidence — how would you figure out whether they share a cause?

### 📖 Introduction

Timing alone is suggestive but never conclusive — this question is about going beyond "they happened around the same time" to something more definitive.

### 🔍 How to Investigate

Look for a plausible causal mechanism connecting the two, not just correlated timing — do they touch the same underlying resource, the same recent deploy, or the same upstream dependency, from the shared-dependency reasoning used earlier in this guide's API & Backend Scenarios chapter. If a shared, plausible mechanism is found, that's meaningfully stronger evidence than timing alone. If you can safely and deliberately trigger or resolve one of the two symptoms in isolation, and the other one changes in response, that's a much more direct, conclusive way to confirm an actual causal link between them, rather than relying on their timing having merely lined up.

### 💎 Good to Know: Correlated Timing Is a Reasonable Starting Hypothesis, Not a Conclusion

Treating two symptoms with similar timing as an initial hypothesis worth investigating is reasonable and often correct — but confirming they're genuinely, causally related requires finding an actual connecting mechanism, or directly testing the relationship, rather than stopping at the coincidence of timing alone.

---

## 8. You're debugging an issue and the available logs turn out to be insufficient to actually diagnose it — how would you decide what to add, and how would you get through the current incident without it?

### 📖 Introduction

This scenario has two genuinely separate parts — surviving the current incident with what you actually have, and making sure the next one isn't blocked the same way.

### 🔧 Getting Through the Current Incident

Rely on whatever indirect evidence is actually available — related logs from adjacent parts of the system, timing correlation with other events, or a careful, deliberate attempt at reproduction, from earlier in this chapter, to build up enough understanding without the ideal, missing log data.

### 🔧 Deciding What to Add for Next Time

Add logging specifically at the exact point where this investigation actually got stuck — the precise piece of missing context that would have made this particular investigation meaningfully faster, rather than logging indiscriminately everywhere, which adds noise and cost without necessarily helping the next specific incident.

### 💎 Good to Know: Every Incident With Insufficient Logging Is a Direct, Specific Signal for Where to Add It

Rather than trying to guess in advance everywhere logging might someday be useful, treating each real incident's actual gap as the guide for exactly where to add targeted logging next tends to produce far more genuinely useful logging over time than a broad, undirected effort would.

---

## 9. A bug only happens under a specific, unusual combination of conditions — how would you go about isolating exactly which conditions are actually required to trigger it?

### 📖 Introduction

This closes the chapter by generalizing the "narrow it down" instinct used throughout this whole subject into an explicit, deliberate technique.

### 🧭 How to Isolate the Conditions

Starting from a known combination of conditions under which the bug does occur, change one condition at a time and observe whether the bug still happens — if it does, that specific condition wasn't actually required; if it stops happening, that condition was likely a genuine, necessary part of the trigger. Repeat this one-variable-at-a-time process until you're left with the smallest combination of conditions that still reliably reproduces the bug.

### 🎯 Why This Approach Works

Changing multiple conditions at once makes it genuinely impossible to know which specific change actually mattered — isolating one variable at a time is what turns "it happens under this whole complicated combination of circumstances" into "it specifically requires this one condition, or this pair of conditions, and nothing else."

### 💎 Good to Know: This Same Systematic, One-Variable-at-a-Time Reasoning Is the General Technique Behind Nearly Every Scenario in This Subject

Whether the varying factor across this whole subject's scenarios has been browser, network, data volume, deploy timing, or concurrent load, the actual underlying debugging technique has consistently been the same one made explicit here — hold everything else constant, vary one thing at a time, and observe what actually changes the outcome.
