---
title: Frontend & React Scenarios
description: Debugging real frontend issues under production conditions.
sidebar_position: 6
---

# Frontend & React Scenarios

## 1. A specific page in your React app is reported as "frozen" or unresponsive by some users but works fine for you locally — how would you begin narrowing down the cause?

### 📖 Introduction

"Works fine for you locally" is the key detail — it means whatever's causing this depends on something your local environment doesn't share.

### 🔍 What Could Be Different

The actual data — a page that renders a list, for example, might work fine with the small amount of test data you have locally but genuinely freeze rendering a much larger real dataset a specific production user happens to have. The device or browser — a lower-powered device can turn an inefficient render that's merely a bit slow on your development machine into something that looks fully frozen on theirs.

### 🧭 How to Narrow It Down

Ask the affected users, or check analytics, for specifics — device type, browser, and roughly how much data is involved for their account. Try to reproduce the freeze locally using a similarly large dataset or a throttled, lower-powered environment, rather than your own typically fast development setup, before assuming the code itself is definitely fine just because it seemed fine at a glance.

### 💎 Good to Know: "Can't Reproduce Locally" Usually Means Your Local Conditions Don't Match, Not That There's No Bug

This is the frontend-specific version of a pattern that recurs throughout this guide — a bug that only shows up under conditions your own environment doesn't naturally have, larger data, a slower device, a specific network, still has a genuine, findable root cause; it just requires deliberately recreating those conditions rather than trusting a clean local test.

---

## 2. Users report seeing stale data on a page after navigating away and back, even though the underlying data has genuinely changed — how would you investigate whether this is a caching, state-management, or rendering issue?

### 📖 Introduction

Three different layers can all produce "the screen shows old data" — the investigation is about figuring out which one is actually holding onto it.

### 🔍 How to Distinguish the Three

Check whether a fresh network request for the data is even being made at all when the user navigates back — if not, look at whatever client-side data-fetching or caching layer is in play, and whether it's deliberately, but incorrectly, reusing a previous result instead of refetching. If a fresh request is being made and does return the correct, current data, but the screen still shows the old value, the problem is in how that fresh data is actually being applied to the component's state or how the component is rendering it.

### 🎯 Common Root Causes

A data-fetching library configured to treat previously fetched data as still valid for longer than actually appropriate for this specific page. Component state that was set once and never properly updated or reset when the component is revisited, especially in a single-page application where navigating "back" might not actually remount the component fresh at all.

### 💎 Good to Know: "Navigate Away and Back" Often Means "Reused, Not Remounted"

In a typical single-page app, from the Networking guide's Web Communication chapter's context, navigating back to a previously visited page frequently reuses an already-existing component instance rather than creating a genuinely fresh one — worth explicitly confirming whether that's happening here, since it changes where stale state could actually be hiding.

---

## 3. A component re-renders far more often than it should, and the page becomes noticeably janky under real usage — walk through how you'd identify and fix the actual cause.

### 📖 Introduction

Excess re-rendering is one of the most common, well-known React performance issues, with a fairly standard diagnostic path.

### 🔍 How to Identify It

Use React's own developer tooling to actually observe which components are re-rendering and how often, rather than guessing — confirming the problem is genuinely excessive re-rendering, not something else entirely, like an actually expensive computation happening inside a normal, reasonable number of renders.

### 🔎 Common Causes

A parent component re-rendering and passing down a new object, array, or function reference on every single render, even when its actual contents haven't meaningfully changed, causing children that compare props by reference to treat it as new every time. State that's placed higher up the component tree than it actually needs to be, meaning far more components re-render on a change than are genuinely affected by it.

### 🔧 Fixing It

Memoize values and callbacks that are recreated unnecessarily on every render, move state down closer to only the components that genuinely need it, and use built-in tools to prevent a component from re-rendering when its actual, meaningful props haven't changed.

### 💎 Good to Know: This Is Directly Related to the Performance Optimization Guide's Frontend Chapter

The general rendering-performance concepts, and the reasoning about when memoization genuinely helps versus adds unnecessary overhead, are covered in more depth in the Performance Optimization guide's frontend chapter — this question is that same underlying knowledge applied to one specific, concrete production symptom.

---

## 4. Your app's initial load time has crept up significantly over several months of feature additions, with no single obvious cause — how would you approach diagnosing this?

### 📖 Introduction

"Crept up gradually across many changes" is a genuinely different kind of problem than a single, sudden regression — no one change is likely to be the whole story.

### 🔍 How to Approach It

Look at what's actually being loaded and executed before the app becomes usable — a bundle analysis showing what's contributing to the total JavaScript size being shipped, which tends to naturally grow as features accumulate unless it's actively watched. Check whether any dependencies added over the months are genuinely large relative to the value they provide, or whether a large library is being loaded upfront for a feature that only a small fraction of users ever actually use.

### 🔧 What This Often Points Toward

Code that could be loaded only when actually needed, rather than as part of the initial load every single user pays for, regardless of whether they ever use that specific feature. This is the same underlying idea as lazy loading and code splitting, covered generally in the Performance Optimization guide.

### 💎 Good to Know: Gradual Regressions Need Ongoing Monitoring, Not Just a One-Time Fix

Since this kind of regression accumulates slowly across many individually small, reasonable-looking changes, catching it early requires actually tracking a metric like bundle size or load time over time, rather than only investigating once it's become bad enough for users to actually notice and complain.

---

## 5. A form submission occasionally fires twice, creating duplicate records on the backend — how would you track down where the duplicate submission is actually coming from?

### 📖 Introduction

This bug can originate from more than one place, and the fix genuinely depends on where it's actually coming from.

### 🔍 Where to Look

Whether the submit action can be triggered more than once from a single user interaction — a slow network response leaving a submit button clickable for long enough that an impatient user double-clicks it before any visual feedback appears. Whether a component is re-rendering or re-mounting in a way that triggers an effect or handler responsible for submission more than once for what was really just one single user action.

### 🔧 How to Fix It

Disable the submit control immediately upon the first click, before the response has even come back, so a second click physically can't fire a second request. Regardless of the frontend fix, also make the actual backend endpoint itself idempotent, covered generally in the API & Backend Scenarios chapter of this guide, so that even if a duplicate request does somehow reach the server, it doesn't produce a duplicate record.

### 💎 Good to Know: The Frontend Fix Alone Is Never a Complete Fix on Its Own

Preventing the double-click is good user experience, but relying on it as the only defense leaves the system exposed to any other way a duplicate request could occur, a retried request after a network blip, for instance — the backend genuinely needs to be safe against duplicates independent of whatever the frontend does or doesn't prevent.

---

## 6. Users on a specific browser report the app is completely broken while it works fine everywhere else you've tested — walk through your investigation.

### 📖 Introduction

"Completely broken on one specific browser" usually points toward something that browser handles genuinely differently, not a random coincidence.

### 🔍 What to Investigate

Whether the app uses a relatively new JavaScript or CSS feature that the affected browser doesn't actually support, or supports differently than the browsers you tested in — this is one of the single most common root causes of a "works everywhere except this one browser" report. Check the browser's own developer console for the specific error being thrown, if any, on that browser specifically, since it often names the exact unsupported feature or API directly.

### 🔧 How to Fix It

Depending on how essential the unsupported feature actually is, either provide a fallback for that specific browser, or use a tool that automatically handles known cross-browser differences during the build process, rather than expecting every feature to behave identically across every browser without any adjustment.

### 💎 Good to Know: Testing Across Browsers Deliberately Is What Catches This Before Users Do

This category of bug is specifically why deliberately testing across the actual range of browsers your real users use, not just whichever one you personally develop in, is worth doing before shipping, rather than only discovering the gap once affected users start reporting it in production.

---

## 7. A memory leak in your frontend causes the tab to slow down and eventually crash after being left open for a long session — how would you go about identifying its source?

### 📖 Introduction

This is the frontend-specific version of the backend memory-leak scenario from the API & Backend Scenarios chapter of this guide, using browser tooling instead of server tooling.

### 🔍 How to Identify the Source

Use the browser's developer tools to take memory snapshots at different points during a long session, comparing them to see what's actually growing over time rather than staying stable — this narrows the search to specific categories of object that keep accumulating instead of being released.

### 🔎 Common Causes

An event listener or subscription that's added but never properly removed when a component unmounts, meaning every time that component is created and destroyed again over a long session, another listener piles up. A timer or interval that keeps running and holding a reference to data even after the part of the app that created it is no longer actually in use.

### 💎 Good to Know: A Leak That Only Shows Up Over a "Long Session" Requires Deliberately Simulating One

A short, typical manual test of a feature often won't reveal a slow leak at all — genuinely tracking this down usually requires deliberately leaving the app open, repeating the suspected action many times in a row, or using tooling that can simulate an extended session, rather than expecting it to show up in a normal, brief test pass.

---

## 8. After a deploy, some users report seeing a broken, half-updated version of the app until they hard-refresh — what's actually happening, and how would you prevent it going forward?

### 📖 Introduction

This is a specific, well-known deployment-and-caching interaction that's easy to overlook until it actually bites a real user.

### 🔍 What's Actually Happening

A user already had the app's older JavaScript loaded in their browser when the new deploy went out. Depending on how the app is structured, that already-loaded older code might then try to fetch an additional resource, like a separate chunk of code, that the deploy has since replaced or removed entirely, since the new deploy's file structure no longer matches what the old, already-loaded code expects to find.

### 🔧 How to Prevent It

Ensure old, previously deployed assets remain available for some time after a new deploy, rather than being immediately removed, so a user who still has old code loaded can keep functioning correctly until they naturally get the new version instead of hitting an unexpected removed file. Detect on the client side when a new version has been deployed while a user's tab has an older version still loaded, and prompt them to refresh, rather than letting them continue silently using a version that's now out of sync with the current deployed backend and assets.

### 💎 Good to Know: This Is a Genuinely Common Gap Between "It Works in a Fresh Tab" and "It Works Mid-Session Across a Deploy"

Testing a deploy by opening a fresh tab afterward never actually reveals this class of bug, since a fresh tab always loads the current, correct version — it specifically requires having a tab open with the old version already loaded before and during the deploy to actually observe it.

---

## 9. Your app's error tracking shows a spike in JavaScript errors after a deploy, but they don't reproduce in your own testing — how would you dig deeper using only what production is telling you?

### 📖 Introduction

The gap between "errors are happening" and "I can't reproduce them" means the error tracking data itself has to do the work your own manual testing can't.

### 🔍 What to Look at in the Error Data

The actual stack trace and error message for the specific errors, which frequently point directly at the exact line and cause even without a manual reproduction. Whether the errors cluster around a specific browser, device, or user action, from the earlier browser-specific and data-dependent bug questions in this chapter — a pattern in who's affected is often the missing piece that makes an otherwise unreproducible bug suddenly reproducible once you match your test conditions to theirs.

### 🔧 Filling In the Gaps

If the stack trace and clustering pattern together aren't quite enough, consider whether additional context, like breadcrumbs showing what a user actually did leading up to the error, or session replay if available, would give enough detail to finally reconstruct the actual triggering sequence.

### 💎 Good to Know: A Good Error-Tracking Setup Is What Makes This Investigation Possible at All

Without genuinely useful stack traces, user and environment context, and the ability to see patterns across many occurrences, an unreproducible production error is close to undebuggable — this scenario is a strong practical argument for investing in solid error tracking well before you actually need it during an incident like this one.

---

## 10. A third-party script your app loads for analytics starts failing to load, and it's silently breaking an unrelated part of your page — how would you diagnose this, and how would you prevent a third-party failure from having this kind of blast radius again?

### 📖 Introduction

This closes the chapter with a scenario about a dependency you don't control having far more influence over your app than it reasonably should.

### 🔍 Diagnosing It

Confirm the actual failure — the third-party script failing to load or throwing an error of its own — and then trace how that failure is actually reaching and affecting the unrelated part of the page, which is the genuinely surprising part of this scenario worth fully understanding, not just working around.

### 🛡️ Preventing This Blast Radius Going Forward

Load third-party scripts in a way that a failure in them can't directly break your own application's code — isolating third-party failures is the same underlying principle as the circuit-breaker and dependency-isolation discussion from the API & Backend Scenarios chapter of this guide, just applied to the frontend instead of the backend. Ensure your own critical code doesn't have an unnecessary, direct dependency on a third-party script successfully loading at all, so your core page functionality degrades gracefully, unaffected, rather than breaking outright if that third party has an issue.

### 💎 Good to Know: A Third-Party Script Runs With the Same Privileges as Your Own Code by Default

Unless specifically isolated, a third-party script loaded onto your page generally runs with the same access to the page as your own first-party code — this is exactly why an unrelated third party can have this much unexpected blast radius, and it's the same underlying concern the Web Security guide's Client-Side Security chapter covers from a security angle rather than a reliability one.
