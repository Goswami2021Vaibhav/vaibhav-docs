---
title: High Availability & Fault Tolerance
description: Designing systems that survive failure instead of falling over.
sidebar_position: 8
---

# High Availability & Fault Tolerance

## 1. What does "high availability" mean in concrete terms, and what do the "nines" actually represent in downtime?

### 📖 Introduction

This chapter is the dedicated toolkit for the reliability side of the scaling-versus-reliability distinction raised in the first chapter of this guide.

### 📊 What It Means Concretely

The percentage of time a system is actually available and functioning correctly over a given period, usually expressed as a percentage — "99.9% uptime" — rather than a vague qualitative claim.

### 9️⃣ The "Nines"

99% = roughly 3.65 days of downtime per year. 99.9%, "three nines," = roughly 8.76 hours per year. 99.99%, "four nines," = roughly 52.6 minutes per year. 99.999%, "five nines," = roughly 5.26 minutes per year. Each additional nine represents a roughly 10x reduction in acceptable downtime, and typically a roughly proportional, or worse, increase in cost and complexity to actually achieve.

### 💎 Good to Know: Chasing More Nines Than You Need Is a Real, Common Mistake

Excessive redundancy and complexity chasing an unnecessarily high availability target can itself become a risk, covered later in this chapter. The right number of nines is a business decision — what does downtime actually cost, echoing the stakeholder-communication theme from the first chapter of this guide — not a technical target to maximize blindly.

---

## 2. What is redundancy, and why does eliminating single points of failure usually mean adding it at multiple layers?

### 📖 Introduction

This generalizes a pattern that's already come up repeatedly across this guide into its formal name.

### 🔁 What Redundancy Is

Having more than one of something critical, so the failure of any single instance doesn't take down the whole system.

### 🧱 Why Multiple Layers Are Needed

A system has many components that could each individually be a single point of failure. Redundant application instances don't help if the load balancer routing to them is itself a single instance. Redundant load balancers don't help if the database they all point to is a single instance. Multiple database replicas don't help if they're all in the same physical data center that loses power, covered in the multi-AZ question later in this chapter. Each layer needs its own redundancy strategy, since a single point of failure at any layer undermines the careful redundancy built everywhere else.

### 💎 Good to Know: This Is a Recurring Pattern From Earlier in This Guide, Now Made Explicit

The first chapter's single-point-of-failure discussion, and the load balancer's own need for redundancy covered in the Load Balancing chapter, are both instances of this same principle — it has to be applied systematically, layer by layer, not just wherever happens to be most visible.

---

## 3. What is the circuit breaker pattern, and how does it prevent cascading failure?

### 📖 Introduction

A circuit breaker is one of the most direct, practical implementations of "fail fast rather than hang" available to a distributed system.

### 🔌 What It Is

A protective mechanism that wraps calls to a downstream dependency, monitoring for failures. Once failures exceed a configured threshold, the circuit "opens," and subsequent calls fail immediately, without even attempting to reach the struggling downstream service at all.

### 🌊 How It Prevents Cascading Failure

Without a circuit breaker, every request that tries to call a failing or slow downstream service ties up its own calling resources — a connection, a thread, echoing the event-loop-blocking concern from the Performance Optimization guide — waiting for a response or timeout that's unlikely to come. Under enough concurrent load, this can exhaust the calling service's own resources entirely, meaning the struggling downstream dependency takes down the calling service too, which can then take down whatever calls it, cascading outward. A circuit breaker stops this by failing fast once it's detected the downstream is struggling, protecting the calling service's own resources.

### 💎 Good to Know: This Is the Same Goal as Queue-Based Resilience, via a Different Mechanism

This connects directly to the resilience benefit of queue-based architectures covered in the Asynchronous Processing chapter — both patterns exist specifically to stop one component's failure from propagating into others, just via different mechanisms: async decoupling through a queue, versus fast-failing a synchronous call through a circuit breaker.

---

## 4. What states does a circuit breaker move through, and what triggers each transition?

### 📖 Introduction

This is the mechanism behind the previous question, in more detail.

### 🟢 Closed

Normal operation — requests pass through to the downstream service as usual, with failures being counted and tracked.

### 🔴 Open

The failure threshold has been exceeded — requests fail immediately without even attempting to reach the downstream service, for a configured cool-down period.

### 🟡 Half-Open

After the cool-down period elapses, the breaker allows a small number of test requests through to check whether the downstream service has recovered. If those succeed, the breaker transitions back to closed. If they still fail, it goes back to open for another cool-down period.

```js
// Simplified state transitions
if (state === "open" && Date.now() > openedAt + cooldownMs) state = "half-open";
if (state === "half-open" && testRequestSucceeded) state = "closed";
if (state === "half-open" && testRequestFailed) { state = "open"; openedAt = Date.now(); }
```

### 💎 Good to Know: Half-Open Is What Makes This Self-Healing

Without it, you'd need a human to notice the downstream is healthy again and manually flip the breaker back — defeating much of the automated-resilience point of having one in the first place.

---

## 5. What is retry with exponential backoff, and why does retrying immediately after a failure often make an outage worse?

### 📖 Introduction

The intuitive response to a failed request, retry right away, is often exactly the wrong one for the system on the other end.

### ⏳ What It Is

When a request fails, wait progressively longer between each subsequent retry attempt — 1 second, then 2, then 4, then 8 — rather than retrying immediately and repeatedly at a fixed, short interval.

### ⚠️ Why Immediate, Repeated Retrying Makes Things Worse

If a downstream service is already struggling, overloaded or genuinely degraded under load, a flood of clients all retrying immediately and repeatedly adds more load to the already-struggling service, making recovery harder and slower — potentially turning a brief blip into a sustained outage. Exponential backoff gives the downstream service progressively more breathing room to actually recover between attempts, rather than being constantly hammered.

### 💎 Good to Know: A Struggling System Needs Less Load, Not More

This directly connects to the backpressure discussion in the Asynchronous Processing chapter and connection pool exhaustion in the Database Scalability chapter — naive immediate retrying is exactly the wrong response, even though it feels like the most "responsive" thing to do from the caller's perspective.

---

## 6. What is jitter, and why does adding randomness to a retry delay help?

### 📖 Introduction

This closes a real gap in the basic exponential backoff described in the previous question.

### 🎲 What It Is

Adding a small amount of randomness to a retry delay, rather than using a purely deterministic backoff schedule.

### ⚠️ Why It Helps

Without jitter, if many clients all experienced the same failure at roughly the same moment, and they're all using the same deterministic backoff schedule, waiting exactly 1 second, then all retrying at exactly the same moment, then all waiting exactly 2 seconds, then all retrying again simultaneously, their retries stay synchronized — creating repeated, coordinated "thundering herd" spikes of load hitting the recovering service at the same predictable moments. Jitter, randomizing each client's actual delay slightly, spreads retries out over time instead, avoiding these synchronized spikes.

```js
const delay = baseDelay * 2 ** attempt * (0.5 + Math.random() * 0.5); // 50%–100% of the backoff value
```

### 💎 Good to Know: This Is the Same "Synchronized Actors" Failure Pattern From the Caching Chapters

Worth recognizing "many independent actors accidentally synchronizing their behavior and overwhelming something together" as a recurring pattern that shows up in multiple, genuinely different contexts — here, and in the cache stampede problem covered in both this guide's and the Performance Optimization guide's caching chapters.

---

## 7. What is the bulkhead pattern, and how does isolating resources prevent one failing dependency from starving others?

### 📖 Introduction

Named after a ship's bulkheads — watertight compartments that prevent a hull breach in one section from flooding the entire ship.

### 🚢 What It Is

Isolating resources, like connection pools or thread pools, used for different downstream dependencies, so each dependency has its own dedicated, limited pool rather than all dependencies sharing one common pool.

### 🛡️ How It Prevents One Failure From Exhausting Shared Resources

Without bulkheads, if one downstream dependency starts responding slowly, requests to it can consume an increasing share of a shared connection or thread pool waiting for responses, eventually starving out requests to completely unrelated, perfectly healthy dependencies that happen to share that same pool. With separate, isolated pools per dependency, a struggling dependency can only exhaust its own dedicated allocation, leaving capacity for calls to other, healthy dependencies completely unaffected.

```js
const dbPool = new Pool({ max: 20 });
const thirdPartyApiPool = new Pool({ max: 10 }); // isolated — can't starve the DB pool
```

### 💎 Good to Know: Bulkheads and Circuit Breakers Are Complementary, Not Competing

A bulkhead limits the blast radius of resource exhaustion from one dependency, while a circuit breaker stops wasting resources on a known-failing dependency entirely. A mature resilience setup typically uses both together.

---

## 8. What is graceful degradation, and how does it differ from an all-or-nothing failure?

### 📖 Introduction

Whether a failure feels like a minor inconvenience or a full outage often comes down to a design decision made well before the failure ever happened.

### 📉 What It Is

When a non-critical dependency or feature fails, the system deliberately serves a reduced but still functional experience — the core feature keeps working, just without the failed, non-essential part — rather than the entire request or page failing outright.

### 🎯 A Realistic Example

An e-commerce product page whose "customers also bought" recommendations widget depends on a separate recommendation service. If that service is down, a gracefully degraded page simply hides the recommendations section and still shows the core product information and purchase flow, rather than the entire page failing to load just because one non-essential dependency was unavailable.

### 💎 Good to Know: This Requires Deliberately Classifying What's Actually Critical

This requires deliberately deciding which parts of a system are genuinely critical, meaning nothing works without them, versus genuinely optional, meaning the core experience survives without them. The closing scenario of this chapter is exactly a case where this distinction was never actually made.

---

## 9. What are RTO and RPO, and how do they define what's acceptable during disaster recovery?

### 📖 Introduction

These two terms give a team a concrete, measurable way to define "how bad can it get" before anyone actually has to answer that question during a real crisis.

### ⏱️ RTO — Recovery Time Objective

The maximum acceptable amount of time the system can be down or unavailable during a disaster before it's considered an unacceptable, ongoing problem — "we can be down for at most 4 hours."

### 💾 RPO — Recovery Point Objective

The maximum acceptable amount of data, measured in time, that could be lost during a disaster — "we can afford to lose at most 15 minutes of the most recent data," meaning backups or replication need to happen frequently enough that no more than 15 minutes of data is ever at risk.

### 💎 Good to Know: Different Parts of a System Can Legitimately Have Different RTO/RPO Requirements

A smaller RTO or RPO generally requires more investment in redundancy or replication frequency. A payment system typically needs a much smaller RPO than an analytics logging pipeline — treating every piece of data or every system as if it needs the same, strictest RTO/RPO is often wasteful, over-engineered effort.

---

## 10. What is a multi-AZ deployment, and what failure scenario does it protect against?

### 📖 Introduction

This makes the layered-redundancy principle from earlier in this chapter concrete at the physical-infrastructure level.

### 🏢 What It Is

Deploying infrastructure across multiple, physically separate data centers, "availability zones," within the same broader region, rather than all within a single data center or building.

### 🛡️ What It Protects Against

A failure affecting an entire data center — a power outage, a cooling failure, a local network issue affecting that specific facility. With instances spread across multiple AZs, this kind of failure only takes out the portion of capacity in the affected AZ, while other AZs, and the system overall, continue operating.

### 💎 Good to Know: This Extends the Same Redundancy Principle One Layer Further Out

Redundant instances within a single data center, covered in the Application Scalability chapter, don't protect against that entire facility failing. Multi-AZ extends the same redundancy principle further out, to the physical location itself.

---

## 11. What is a multi-region deployment, and why does it address a larger category of failure than multi-AZ?

### 📖 Introduction

This builds directly on the previous question — a further step out, with a further step up in cost and complexity to match.

### 🌍 What It Is

Deploying infrastructure across multiple, geographically distant regions, not just multiple data centers within one region — both a US-based and a Europe-based full deployment, for instance.

### 📈 Why It Addresses a Larger Category of Failure

Multi-AZ protects against a single facility failing, but an entire region can still experience a broader, correlated issue — a major cloud provider region-wide outage, a significant natural disaster affecting a whole geographic area. Multi-region protects against this larger-scale category, at the cost of genuinely significant added complexity: global server load balancing routing, covered in the Load Balancing chapter; cross-region data replication and its own consistency implications, covered in the Database Scalability chapter; and distributed-systems challenges, covered in the previous chapter, now spanning even greater network distances and latency.

### 💎 Good to Know: This Is a Significant Step Up, Typically Reserved for Genuinely Demanding Requirements

Not every system needs this level of redundancy — directly connecting to the warning about over-engineering redundancy beyond what's actually needed, covered next.

---

## 12. What is chaos engineering, and why would a team deliberately inject failures into production?

### 📖 Introduction

You genuinely don't know whether your resilience mechanisms work until you've deliberately, safely watched them handle a real failure.

### 💥 What It Is

Deliberately, intentionally injecting failures — killing a random instance, introducing artificial network latency, simulating a dependency outage — into a production or production-like system, in a controlled, deliberate way, rather than waiting for a real failure to happen unplanned.

### 🎯 Why Teams Do This Deliberately

It verifies that the resilience mechanisms covered throughout this chapter — circuit breakers, graceful degradation, failover covered in the Load Balancing chapter — actually work as intended, under controlled, observed conditions, rather than discovering they don't work, or were never properly tested, during a real, unplanned incident when it's already too late to prepare calmly.

### 💎 Good to Know: This Is the Same "Verify, Don't Assume" Principle as Load Testing

Chaos engineering is the Performance Optimization guide's load-testing philosophy — verify it can handle X, don't just assume it — applied specifically to failure-handling and resilience, rather than performance and capacity.

---

## 13. Why can adding too much redundancy and failover complexity itself become a reliability risk?

### 📖 Introduction

More resilience machinery isn't automatically a pure win — it's its own source of risk if it's rarely exercised and never verified.

### ⚠️ The Risk

Every additional layer of redundancy or failover logic is also additional, genuinely complex code and infrastructure that can itself contain bugs, or introduce new, unexpected failure modes — the "more nodes means more partial-failure possibilities" point from the Distributed Systems chapter, applied here. A complex failover mechanism that's rarely actually exercised, because the primary system rarely actually fails, can itself have accumulated undetected bugs, and might fail or behave unexpectedly at the exact moment it's finally needed — directly why chaos engineering, covered in the previous question, matters, since it's the only way to genuinely verify this rarely-exercised code actually works.

### 💎 Good to Know: The Right Amount of Redundancy Matches Actual Requirements, Not an Unlimited Maximum

A simple system with a modest availability requirement can genuinely be made *less* reliable, not more, by bolting on elaborate, rarely-tested failover machinery it never actually needed in the first place.

---

## 14. What's the difference between a system that's fault-tolerant and one that simply has good monitoring and a fast on-call response?

### 📖 Introduction

Both reduce the impact of a failure, but they intervene at genuinely different points, and only one of them removes the human from the critical path.

### 🛡️ Fault-Tolerant

The system itself automatically continues operating correctly, or degrades gracefully, despite a failure, without requiring a human to intervene at all — the circuit breaker trips, traffic fails over, the system self-heals, all automatically.

### 📟 Good Monitoring + Fast On-Call

The system detects and alerts on a problem quickly, and a human responds and fixes it quickly. Genuinely valuable, but fundamentally different — the system still experienced real downtime or degradation during the, however brief, window before a human noticed and responded, whereas true fault tolerance means the system never actually went down, or degraded only briefly and automatically, in the first place.

### 💎 Good to Know: These Are Complementary, Not Interchangeable

Even a genuinely fault-tolerant system still benefits from good monitoring, to catch unexpected failure modes the automated resilience didn't anticipate, echoing the previous question's point. But a team that relies purely on "we'll get paged and fix it fast," instead of building genuine fault tolerance, is accepting real, measurable downtime every time something fails, rather than designing that downtime away for the failure modes that can actually be anticipated.

---

## 15. How would you design a health check that accurately reflects whether an instance can actually serve traffic?

### 📖 Introduction

The Application Scalability and Load Balancing chapters both introduced health checks — this revisits the "naive health check" warning from those chapters in more depth, as its own dedicated question.

### ⚠️ The Naive Mistake

A health check that only confirms the process is running or responding to a basic ping, returning `200 OK` unconditionally, proves the process is alive, but says nothing about whether it can actually successfully serve real traffic.

### ✅ A Good Health Check

Actually verifies the instance's ability to reach its genuinely critical dependencies — can it query the database, can it reach the cache — but with an important nuance: it should verify critical dependencies specifically, not every dependency indiscriminately. A health check that fails whenever *any* non-critical dependency, a graceful-degradation candidate from earlier in this chapter, is unavailable would unnecessarily remove an otherwise perfectly capable instance from rotation over something that doesn't actually prevent it from serving most real traffic successfully.

```js
app.get("/health", async (req, res) => {
  const dbOk = await checkDatabase(); // critical — fail the health check if this is down
  const recsOk = await checkRecommendationService().catch(() => false); // non-critical — ignore
  res.status(dbOk ? 200 : 503).json({ database: dbOk, recommendations: recsOk });
});
```

### 💎 Good to Know: Health Checks and Graceful Degradation Share the Same Underlying Classification

Deciding what counts as "critical" for health-check purposes is really the same underlying analysis as deciding what's critical for graceful-degradation purposes — a well-designed system applies this same critical-versus-optional classification consistently across both decisions.

---

## 16. In production, a single downstream third-party API outage takes down your entire application, not just the feature that depends on it — walk through what that reveals and how you'd fix it.

### 📖 Introduction

This closes the chapter with the practical manifestation of the graceful-degradation gap and health-check nuance covered above, combined into one realistic incident.

### 🔍 What It Reveals

This is a textbook sign that the third-party dependency was never properly classified as non-critical. Either the feature using it was built without any fallback or degraded-experience path at all — a synchronous call that blocks the entire request, rather than being isolated or optional — or a health check was naively checking this non-critical dependency and removing otherwise-healthy instances from rotation over it, or there was no circuit breaker around calls to it, letting a slow or failing third party cascade resource exhaustion into the rest of the application.

### 🛠️ The Fix

Implement graceful degradation for this specific feature — the core app should work without this third party. Add a circuit breaker around calls to it, so a struggling third party fails fast rather than tying up resources. Consider a bulkhead so its resource usage is isolated from calls to other, unrelated dependencies. Audit the health-check logic to confirm it's not incorrectly treating this non-critical dependency as a reason to pull healthy instances out of rotation.

### 💎 Good to Know: This Closes the Chapter by Pulling Together Nearly Every Technique in It

Graceful degradation, circuit breakers, bulkheads, and accurate health checks are all, genuinely, different facets of the same underlying discipline: deliberately deciding what's actually critical versus optional in your system, and making sure that distinction is consistently enforced everywhere it matters — rather than discovering the hard way, during a real incident, that a non-critical dependency was quietly treated as if it were critical all along.
