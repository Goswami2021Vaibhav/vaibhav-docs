---
title: File Upload & Storage Scenarios
description: Handling uploads and storage at scale, and what breaks.
sidebar_position: 5
---

# File Upload & Storage Scenarios

## 1. Users report that uploading a large file times out or fails intermittently, while small files work fine — how would you investigate?

### 📖 Introduction

"Large files specifically" is the key detail — it points toward something that scales with file size rather than something broken outright.

### 🔍 What to Investigate

Whether any layer in the request path — the application server, a reverse proxy, a load balancer — has a request timeout or maximum body size configured that a large file's upload duration or size can exceed, even though a small file comfortably stays under both. Whether the upload is happening as one single, all-or-nothing transfer, meaning any brief network hiccup partway through a long transfer fails the entire upload, whereas a small, quick upload rarely spends enough time on the network to hit the same bad luck.

### 🔧 Likely Fixes

Increase the relevant timeout and size limits where it's genuinely appropriate to do so, and consider whether large uploads should use a chunked or resumable upload approach instead of one single transfer, from the later multi-part upload question in this chapter, so a brief interruption doesn't require restarting the entire file from scratch.

### 💎 Good to Know: A Timeout Set for "Typical" Requests Often Doesn't Account for File Uploads

Default timeout values across a request path are usually tuned for typical, fast API calls — file uploads are a genuinely different kind of request, and it's a common oversight for nobody to have deliberately reconsidered those defaults specifically for this use case.

---

## 2. Your storage costs have grown far faster than your user base — how would you figure out what's actually driving the growth?

### 📖 Introduction

"Faster than user growth" rules out simple, expected scaling as the explanation — something disproportionate is happening.

### 🔍 What to Investigate

Break down actual storage usage by type or source of file, rather than looking at only the total — a single feature or file type responsible for a disproportionate share of growth is a common finding. Check whether files are ever actually deleted when they're logically no longer needed — a deletion feature in the application that only removes a database record while leaving the actual underlying file in storage untouched is a frequent, quiet source of unbounded growth. Check whether uploaded files are being stored at a larger size or higher quality than actually necessary for how they're used, an unprocessed original kept alongside every generated size variant, for example.

### 🎯 What to Do About It

Once the actual driver is identified, common fixes include enforcing genuine deletion of orphaned files, generating and storing only the sizes/variants actually needed, and moving rarely accessed older files to a cheaper storage tier if the storage provider offers one.

### 💎 Good to Know: "Delete" in the Application Doesn't Always Mean "Delete" in Storage

A very common, quiet cost driver is a "delete" feature that only ever removes the database reference to a file, while the actual file itself keeps sitting in storage indefinitely, unreferenced but still fully billed — worth explicitly confirming a delete action actually deletes the underlying file, not just the pointer to it.

---

## 3. A user uploads a file with a misleading extension that turns out to be executable content, not the image it claimed to be — what should have prevented this from ever reaching storage?

### 📖 Introduction

This is a specific, well-known file-upload security failure, and the fix is about not trusting what the file claims to be.

### ⚠️ Why This Happened

Validating a file's type purely by its extension, or by a client-supplied content-type value, is trusting something the uploader fully controls and can trivially lie about — neither actually confirms what the file's real content is.

### 🛡️ What Should Have Prevented It

Validating the file's actual content — checking its real, underlying format based on its content, not merely its filename or claimed type, covered generally in the Web Security guide's File Upload Security chapter. Restricting what file types are genuinely accepted at all to a specific, deliberately narrow allowlist appropriate for the feature, rejecting everything else by default. Ensuring uploaded files are stored and served in a way that never allows them to be executed as code by the server, regardless of what they actually contain.

### 💎 Good to Know: This Is the File-Upload-Specific Version of "Never Trust Client Input"

This is the same underlying principle, covered generally throughout the Web Security guide, applied specifically to file uploads — anything the client asserts about its own file, extension, content-type, filename, is a claim to be verified, not a fact to be trusted.

---

## 4. Users report that images they uploaded weeks ago are now returning broken links — how would you investigate whether this is a storage, CDN, or database-reference issue?

### 📖 Introduction

Three genuinely different layers could produce the exact same symptom, so isolating which one is actually broken comes first.

### 🔍 How to Isolate the Layer

Try accessing the file directly from the underlying storage provider, bypassing any CDN or application layer in front of it — if it loads correctly there, the file itself is fine, and the problem is somewhere in front of it. If it doesn't load even directly from storage, the file itself is genuinely missing or was deleted, pointing toward either an accidental deletion or a lifecycle policy that removed it earlier than intended. If direct storage access works but the normal application URL doesn't, check whether a CDN, covered generally in the Performance Optimization guide, is serving a broken or stale cached reference, or whether the database record pointing to the file's location is itself simply wrong or outdated.

### 💎 Good to Know: "Broken Link" Is a Symptom Shared by at Least Three Different Root Causes

This scenario is a good example of why isolating which specific layer is actually failing, storage itself, an intermediate CDN, or the database reference pointing to it, has to come before attempting any fix — each of those three causes needs a genuinely different response.

---

## 5. Your file upload feature works fine in every environment except behind one specific corporate network — what would you investigate?

### 📖 Introduction

This scenario directly parallels the WebSocket-behind-a-corporate-network scenario from the Networking guide's Web Communication chapter, just for a different kind of traffic.

### 🔍 What to Investigate

Whether that specific network's firewall or forward proxy, both covered generally in the Networking guide's Firewalls, Proxies, VPNs & NAT chapter, is restricting upload traffic — restrictive corporate networks commonly limit request size, block certain content types, or interfere with longer-lived upload connections in ways a typical home or mobile network wouldn't. Whether the upload request is actually reaching your server at all from that network, versus reaching it but failing partway through, which points toward two genuinely different places to look for the actual block.

### 💎 Good to Know: Corporate Networks Are a Recurring Source of This Exact Symptom Pattern Across This Whole Guide

A feature that works everywhere except one specific corporate network is a pattern that recurs across several chapters in this subject — the underlying cause is almost always the same category of thing, restrictive network infrastructure that a typical consumer network simply doesn't have in place.

---

## 6. A batch process that resizes and processes uploaded images starts falling significantly behind during a traffic spike — how would you diagnose and address the bottleneck?

### 📖 Introduction

This is the file-processing-specific version of the queue-falling-behind scenario from the API & Backend Scenarios chapter of this guide.

### 🔍 Diagnosing It

Use the same throughput-versus-stuck-job distinction from that earlier chapter — confirm whether the process is genuinely still completing jobs, just too slowly to keep up, or has actually stalled entirely on something specific. If it's genuinely a throughput problem, check whether image processing, an inherently CPU-intensive operation, is the actual bottleneck, versus the queue or storage I/O around it.

### 🔧 Addressing It

Scale out the number of workers processing the queue, covered generally in the Scalability guide, if the underlying work is genuinely parallelizable, which image processing typically is, since each file's processing is independent of every other file's. Consider whether every uploaded image genuinely needs every configured size and format generated immediately, versus generating some variants lazily, only when actually first requested, reducing the immediate processing burden during a spike.

### 💎 Good to Know: This Reuses the Exact Diagnostic Framework From Earlier in This Guide

The throughput-versus-stuck-job distinction, and the scaling response, from the API & Backend Scenarios chapter apply directly here — this scenario is largely that same underlying problem showing up in a CPU-bound, file-processing context instead of a general request-processing one.

---

## 7. You discover that publicly accessible URLs for what should be private, user-specific uploaded files can be guessed or enumerated by an outside party — walk through your response.

### 📖 Introduction

This is a genuine data-exposure vulnerability, deserving the same urgency as the earlier authenticated-endpoint exposure scenario in this guide's Authentication & Security Scenarios chapter.

### 🚨 Immediate Response

Restrict access to these files immediately — requiring proper authentication and authorization to actually retrieve them, rather than relying on the URL itself being hard to guess as the only protection, which is never a genuine security control on its own. Assess whether any files were actually accessed by an unauthorized party during the exposure window, using whatever access logs the storage provider offers.

### 🛡️ The Underlying Fix

A predictable or sequential file identifier in a URL is trivially guessable and enumerable; a private file needs a genuine access control check at request time, not merely an unguessable-looking name, which only provides security through obscurity, covered generally in the Web Security guide as a known-insufficient protection on its own.

### 💎 Good to Know: An Unguessable URL Is Not the Same Thing as an Access-Controlled URL

Even a long, random-looking file identifier only prevents casual guessing — it does nothing to stop the URL from being shared, logged somewhere unexpectedly, or otherwise leaked, which is exactly why genuinely private files need an actual authorization check, not just obscurity, as their real protection.

---

## 8. A large multi-part upload fails partway through, and now there's an incomplete, orphaned file sitting in storage — how would you design the system to handle this cleanly?

### 📖 Introduction

The goal here is designing for the failure case upfront, rather than treating an incomplete upload as an unexpected edge case.

### 🔧 How to Design for This

Track the state of a multi-part upload explicitly — which parts have actually been successfully received — so that a failure partway through leaves clear, queryable information about exactly what's missing, rather than an ambiguous, silently incomplete file. Only treat a file as genuinely complete and reference it from the rest of the application once every part has actually been confirmed received and successfully assembled — never expose or reference a partially uploaded file as if it were done. Run a periodic cleanup process that removes incomplete uploads that have been abandoned past some reasonable time threshold, so orphaned partial files don't just accumulate indefinitely.

### 💎 Good to Know: This Connects Directly to the Idempotent-Batch-Endpoint Design From Earlier in This Guide

Designing an upload so a client can safely resume or retry just the missing parts, rather than needing to restart the entire file from scratch, is the same underlying idea as the idempotent, per-item retry design covered in the API & Backend Scenarios chapter's batch-endpoint question — both are about making partial failure a normal, recoverable case rather than a catastrophic one.

---

## 9. Your team wants to migrate millions of existing files from one storage provider to another with zero downtime and no broken links — walk through your approach.

### 📖 Introduction

This mirrors the large-data-backfill scenario from the Database Scenarios chapter of this guide, applied to files instead of database rows.

### 🔧 Approach

Copy files over gradually, in batches, rather than attempting the entire migration at once, tracking progress so it can be safely paused and resumed. During the transition, have the application check the new storage location first and fall back to the old one if a specific file hasn't been migrated yet, so no link breaks regardless of exactly where in the migration process that specific file currently sits. Update the database references, or the logic that decides where to read a given file from, only once a given batch is confirmed fully and correctly copied. Once every file is confirmed migrated and verified, decommission the old storage location, ideally only after a reasonable grace period.

### 💎 Good to Know: This Uses the Exact Same Gradual, Resumable Pattern as the Database Backfill Scenario

The "copy gradually, track progress, fall back to the old location during the transition" pattern here is the file-storage version of the exact same principle covered in the Database Scenarios chapter's large backfill question — large-scale, zero-downtime migrations of any kind tend to rely on this same underlying shape of solution.

---

## 10. Users on slow mobile connections report uploads failing consistently, while users on fast connections never see the issue — what would you investigate and how might you fix it?

### 📖 Introduction

This closes the chapter by connecting file uploads back to fundamental network behavior covered in the Networking guide.

### 🔍 What to Investigate

Whether the upload has a fixed timeout that a large file transfer on a slow connection can realistically exceed, even though the exact same file comfortably finishes in time on a fast connection — directly related to the first question of this chapter, just from the connection-speed angle instead of the file-size angle. Whether a slow or unstable connection dropping partway through a long, single-shot upload is being treated as an outright failure, requiring the user to restart the entire upload from scratch, rather than being able to resume.

### 🔧 How to Fix It

Set timeouts generously enough to genuinely account for realistic slow-connection upload durations, not just fast-connection ones. Implement chunked or resumable uploads, from earlier in this chapter, so a slow or briefly interrupted connection can continue from where it left off instead of failing the entire transfer outright.

### 💎 Good to Know: Designing for the Slowest Realistic Connection, Not the Average One, Is What Actually Fixes This

A feature that's only ever tested on a fast development connection will naturally miss this entire class of problem — this closing scenario is a reminder that upload reliability specifically needs to be evaluated under genuinely poor network conditions, not just typical ones, since that's precisely where it tends to break.
