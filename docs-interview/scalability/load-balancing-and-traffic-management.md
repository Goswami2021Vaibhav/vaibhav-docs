---
title: Load Balancing & Traffic Management
description: Distributing traffic across instances, and handling failover.
sidebar_position: 5
---

# Load Balancing & Traffic Management

## 1. What is a load balancer, and what problem does it solve beyond simply "splitting traffic between servers"?

### 📖 Introduction

This chapter is the infrastructure piece that makes the horizontally scaled application instances from Chapter 2 actually usable as a single, coherent service from the outside.

### ⚖️ What It Is

A component sitting in front of multiple backend instances, receiving all incoming traffic and distributing it across those instances according to some strategy, covered in the next question.

### 🎯 The Problem Beyond Splitting Traffic

Without a load balancer, clients would need to know about every individual instance's address directly, decide which one to talk to, detect failures themselves, and handle instances being added or removed as the application elastically scales. A load balancer provides a single, stable entry point that abstracts all of this away — from the client's perspective, it's talking to "the service," not to any specific instance.

### 💎 Good to Know: This Is What Actually Makes Statelessness Usable

Without a load balancer, the stateless, scale-out architecture from Chapter 2 would require every client to somehow be aware of the current, changing set of instances — which simply doesn't scale as a real solution, ironically defeating the whole point.

---

## 2. What are the common load balancing algorithms, and when would you choose one over another?

### 📖 Introduction

The algorithm determines exactly how traffic gets split, and the right choice depends on how uniform your requests and instances actually are.

### 🔄 Round Robin

Cycles through instances in order, sending each successive request to the next one. Simple, and works well when instances are roughly equal in capacity and requests are roughly equal in cost.

### 📊 Least Connections

Routes to whichever instance currently has the fewest active connections. Better when request processing time varies significantly — a slow request on one instance means round robin would keep sending it more work regardless, while least connections naturally favors the less-busy instance.

### ⚖️ Weighted (Round Robin or Least Connections)

Assigns more traffic to instances with more capacity — a bigger server gets a higher weight. Useful in a mixed-capacity environment, connecting directly to the vertical-plus-horizontal combination point from the first chapter of this guide.

### 💎 Good to Know: Least Connections Is Generally the More Robust Default

For a typical web application with variable request costs, least connections handles imbalance more gracefully. Round robin's simplicity, no need to track connection state, makes it a reasonable choice specifically when requests genuinely are roughly uniform in cost.

---

## 3. What's the difference between Layer 4 and Layer 7 load balancing?

### 📖 Introduction

This determines what kind of routing decisions a load balancer can even make in the first place.

### 🔌 Layer 4 (Transport Layer)

Makes routing decisions based on IP address and port alone, without looking at the actual content of the request. Faster, since there's less to inspect, but can't make decisions based on anything about the actual HTTP request — URL path, headers, cookies.

### 📄 Layer 7 (Application Layer)

Inspects the actual HTTP request content. Can route based on URL path — `/api/*` to one set of instances, `/admin/*` to another — headers, or cookies, covered from the session-affinity angle later in this chapter. More flexible, but requires more processing per request.

### 💎 Good to Know: L7 Enables Most of the Sophisticated Techniques Later in This Chapter

Canary deployments routing based on a header or cookie, and path-based routing to different microservices covered in this guide's final chapter, both require L7. L4 is faster and simpler, but structurally can't support these, since it never actually looks at the request content making the decision.

---

## 4. How does a load balancer use health checks to avoid routing traffic to an unhealthy instance?

### 📖 Introduction

The Application Scalability chapter covered the health check endpoint itself in depth — this is how the load balancer actually consumes it.

### 🩺 How It Works

The load balancer periodically pings each registered instance's health endpoint. If an instance fails enough consecutive checks, a configured threshold that avoids a single flaky check causing an unnecessary removal, the load balancer removes it from the rotation of instances eligible to receive new traffic, without any manual intervention needed.

### 💎 Good to Know: This Is One Coordinated System, Not Two Separate Topics

The application exposes accurate health status; the load balancer acts on it. Worth thinking of these as two halves of the same mechanism rather than unrelated concerns.

---

## 5. What is failover, and how does a load balancer detect and react to an entire instance or region going down?

### 📖 Introduction

Failover is the automated response to the exact failure health checks are designed to detect.

### 🔄 What It Is

The process of automatically redirecting traffic away from a failed instance or region toward a healthy one, without requiring manual intervention.

### 🔍 How Detection Works

Continuous health checks, covered in the previous question. Once an instance, or for regional failover, an entire data center or availability zone, is detected as unhealthy, the load balancer, or for regional failover, DNS-level or global server load balancing routing covered later in this chapter, stops sending it traffic and redirects to the remaining healthy capacity.

### 💎 Good to Know: Regional Failover Is Meaningfully Harder Than Instance-Level Failover

Instance-level failover within a load balancer's pool is usually fast and seamless. Regional failover is significantly more complex, since it may involve DNS propagation delay, covered later in this chapter, and requires the other region to already have sufficient capacity and data replication, covered in the High Availability & Fault Tolerance chapter, to actually absorb the failed region's traffic.

---

## 6. Why does session affinity at the load balancer level create an uneven load distribution over time?

### 📖 Introduction

The Application Scalability chapter covered the concept of sticky sessions — this is the mechanical reason it actually causes imbalance at the load balancer.

### ⚠️ Why It Happens

Sticky sessions mean the load balancer's normal distribution algorithm, covered earlier in this chapter, gets overridden for any returning user. Instead of the algorithm freely choosing the least-loaded or next instance, it's forced to route to whichever specific instance that user was previously assigned to, regardless of that instance's current load. Over time, as user sessions accumulate unevenly, some instances happen to get more "sticky" users assigned purely by chance or timing, and the effective load distribution drifts away from what the algorithm alone would have produced.

### 💎 Good to Know: The Real Fix Is Statelessness, Not a Better Sticky Configuration

This connects directly back to the Application Scalability chapter's broader point — removing the need for stickiness entirely is the actual fix. This question just makes the mechanical reason for that earlier warning concrete at the load balancer level.

---

## 7. What is global server load balancing, and how does it improve both latency and scalability?

### 📖 Introduction

This is horizontal scaling applied at a geographic, rather than instance-level, granularity.

### 🌍 What It Is

Routing a user's request to the geographically nearest, or otherwise optimal, data center or region, rather than a single, centralized location — typically via DNS-level or Anycast routing that considers the user's location.

### ⚡ How It Improves Latency

Directly the physical-distance point from the Network Performance Optimization chapter — round-trip time is reduced when a user's requests travel to a nearby data center rather than one far away.

### 📈 How It Improves Scalability

Total system capacity is spread across multiple, independent regional deployments rather than concentrated in one. A globally distributed user base can be served by multiple regional capacity pools simultaneously, rather than all competing for the same, single region's capacity.

### 💎 Good to Know: This Is the Same Horizontal-Scaling Principle From the First Chapter, at a Different Granularity

Worth recognizing global server load balancing as one more instance of the "distribute load across multiple independent units" pattern that runs throughout this entire guide — just applied geographically instead of per-instance.

---

## 8. What is a blue-green deployment, and how does it eliminate downtime during a release?

### 📖 Introduction

This is a traffic-routing technique for deployments, not scaling itself — but it depends entirely on the same routing infrastructure this chapter is about.

### 🔵🟢 What It Is

Maintaining two complete, identical production environments — "blue" and "green." One actively serves live traffic; the other sits idle or staging the new version. Once the new version, on the idle environment, is verified ready, traffic is switched over via the load balancer or routing layer, all at once, from the old environment to the new one.

### ✅ How It Eliminates Downtime

Since the new version is fully deployed and verified before any real traffic touches it, the actual cutover is just a routing change — instant. If something's wrong, switching back to the still-intact old environment is equally instant.

### 💎 Good to Know: The Cost Is Running Two Full Environments Simultaneously

At least during the deployment window, this is a genuinely real infrastructure and cost tradeoff for the safety and simplicity of an instant, reversible cutover.

---

## 9. What is a canary deployment, and how does it limit the blast radius of a bad release?

### 📖 Introduction

This solves a related but different problem than blue-green deployments, covered in the previous question.

### 🐤 What It Is

Gradually shifting a small percentage of real traffic to a new version, say 5%, while the vast majority continues hitting the proven, stable version — monitoring the small canary slice for problems before gradually increasing its share of traffic toward 100%.

### 🛡️ How It Limits Blast Radius

If the new version has a genuine bug, only the small canary percentage of users or requests are affected, rather than the entire user base all at once, the way blue-green's all-or-nothing cutover would expose everyone. The issue can be caught and the canary rolled back with minimal actual impact.

### 💎 Good to Know: These Two Techniques Solve Different Problems and Are Often Combined

Blue-green is primarily about eliminating downtime during a switch. Canary is primarily about limiting risk from a bad release. Many real deployment pipelines combine both ideas — a canary phase, followed by a full blue-green-style cutover once the canary looks healthy.

---

## 10. How would you use a load balancer to implement traffic shaping or rate limiting at the infrastructure level?

### 📖 Introduction

Rate limiting was covered at the application-code level in the Web Security and Performance Optimization guides — this is the infrastructure-layer alternative.

### 🚦 How It Works

Many load balancers and API gateways support configuring rate limits directly at the routing layer — "no more than X requests per second from a single IP" — rejecting or throttling excess requests before they ever reach an application instance at all.

### 🎯 Why Do It Here Instead of in Application Code

Offloads the work, and the CPU cost of enforcing it, from every individual application instance to a single, centralized layer. Also protects every instance uniformly without needing each one to independently implement or coordinate the same logic — recall the distributed rate-limiting problem from the Web Security guide's API Security chapter, where a shared Redis-backed counter was one way to solve it at the application layer. Doing it at the load balancer avoids needing that coordination in the first place, since the load balancer itself already sees all the traffic.

### 💎 Good to Know: Choosing the Right Layer for a Concern

Rate limiting can be implemented at multiple layers — application code, or the load balancer, here — and the best choice depends on whether you want it uniform and centralized, favoring the load balancer, or need application-specific logic and context the load balancer simply doesn't have visibility into, favoring application code.

---

## 11. What is a reverse proxy, and how does its role overlap with, and differ from, a load balancer's?

### 📖 Introduction

These two terms get used almost interchangeably in casual conversation, but one is really a specific case of the other.

### 🔀 What a Reverse Proxy Is

Sits in front of one or more backend servers, forwarding client requests to them and returning the response back to the client. The client only ever talks to the proxy, never directly to the backend.

### 🤝 The Overlap

A load balancer is technically a specific kind of reverse proxy — one whose primary job is distributing traffic across multiple backend instances.

### 🆚 The Difference

A reverse proxy's role can extend well beyond load distribution — TLS termination, caching, covered in the Performance Optimization guide, compression, request or response modification, and acting as a single point for multiple *distinct* backend services, not necessarily multiple copies of the same service. A load balancer specifically implies multiple, typically identical, instances of the same service behind it.

### 💎 Good to Know: Real Tools Often Serve Both Roles at Once

In practice, tools like Nginx serve both roles simultaneously, depending on configuration. The distinction is more conceptual, about what problem is being solved, than about two genuinely separate categories of software.

---

## 12. What happens to in-flight requests when a load balancer removes an unhealthy instance mid-request?

### 📖 Introduction

This is a harder, less controlled version of the graceful scale-down covered in the Application Scalability chapter.

### ⚠️ The Problem

Unlike a planned scale-down, which allows for a graceful drain, an instance failing a health check might be removed from rotation immediately, since it's already unhealthy or potentially unresponsive. Any request currently in flight to that instance at the moment of removal is at risk of never completing or getting a response at all.

### 🛠️ How It's Handled

Well-designed clients and load balancers implement retry logic — and this is exactly where the idempotency concern from the Application Scalability chapter resurfaces directly, since a retry is only safe if the operation is idempotent. The load balancer itself may also detect the failed connection and automatically retry the request against a different, healthy instance transparently, depending on the specific tool and configuration.

### 💎 Good to Know: This Is a Genuinely Harder Scenario Than a Planned Shutdown

A planned removal can coordinate, finishing in-flight work first. An unhealthy instance might already be unable to finish anything cleanly — exactly why idempotency matters so much for the overall system's resilience to this specific, less-controlled failure scenario.

---

## 13. How does DNS-based load balancing differ from a dedicated load balancer, and what are its limitations?

### 📖 Introduction

DNS can technically distribute traffic too, but it does so with meaningfully different, weaker guarantees.

### 🌐 What It Is

Configuring a domain's DNS records to return multiple different IP addresses, or different addresses to different users based on location for global server load balancing, covered earlier in this chapter. Clients resolve the domain and connect to whichever IP they happen to receive.

### ⚠️ Limitations

DNS records are cached by clients and intermediate resolvers for a configured TTL, the same caching concept covered in the Performance Optimization guide's caching chapter. Removing a failed or unhealthy IP from rotation doesn't take effect instantly for every client — some continue trying the old, now-bad IP until their cached DNS entry expires, which can take minutes depending on the configured TTL. A genuinely slower, less precise failover mechanism than a dedicated load balancer's real-time, health-check-driven removal.

### 💎 Good to Know: DNS-Based Load Balancing Is Often Used Alongside a Dedicated Load Balancer, Not Instead of One

DNS handles the coarse, geographic or regional routing, while a dedicated load balancer handles the finer-grained, faster-reacting distribution within each region.

---

## 14. How would you design a load balancing setup that avoids the load balancer itself becoming a single point of failure?

### 📖 Introduction

This is the single-point-of-failure concept from the first chapter of this guide, applied concretely to the very piece of infrastructure meant to eliminate it elsewhere.

### ⚠️ The Risk

If there's only one load balancer instance, it becomes a new single point of failure. All the careful redundancy built into the application layer, multiple instances from Chapter 2, is undermined if the one thing routing traffic to those instances can itself fail and take down the entire system.

### 🛠️ The Fix

Run multiple load balancer instances themselves, typically coordinated via a technique like a floating or virtual IP address that can be reassigned to a standby load balancer if the primary fails, DNS-level routing across multiple load-balancer endpoints, or a managed cloud load-balancing service that already handles this redundancy internally.

### 💎 Good to Know: Every Redundancy Layer Needs to Be Checked for Becoming a New Single Point of Failure

Every layer added specifically to eliminate a single point of failure needs to be examined for whether it has become a new one itself — redundancy needs re-checking at each layer, until you reach one that's genuinely, structurally not a single point, like a managed, provider-operated service with its own internal redundancy.

---

## 15. What's the difference between horizontal scaling behind a load balancer and simply running more threads on a single, larger server?

### 📖 Introduction

This closes the loop between the vertical-versus-horizontal distinction from the first chapter and the actual mechanism this chapter is about.

### 🔀 The Difference

Running more threads or processes on a single, larger server is still fundamentally vertical scaling — bounded by that one machine's total resources, CPU cores and memory, and remaining a single point of failure regardless of how many threads or processes run within it. Horizontal scaling behind a load balancer distributes across multiple, independent machines, with genuinely separate failure domains and a scaling ceiling that isn't bounded by any single machine's capacity.

### 💎 Good to Know: The Load Balancer Is What Makes Genuine Horizontal Scaling Usable

A load balancer is the specific piece of infrastructure that makes scaling across machines actually possible and usable, whereas more threads or processes on one machine, while it can improve throughput somewhat, remains fundamentally constrained by, and dependent on, that single machine's continued health and capacity ceiling.

---

## 16. In production, one specific instance behind the load balancer is consistently receiving far more traffic than the others — how would you diagnose why?

### 📖 Introduction

This closes the chapter with a realistic diagnostic scenario, drawing on nearly everything covered above.

### 🔍 Likely Causes to Investigate

Session affinity, covered earlier in this chapter, causing an uneven accumulation of "sticky" users on that specific instance over time. The load-balancing algorithm itself — round robin combined with uneven request costs could mean that instance happens to be getting a run of expensive requests. A misconfigured weight, in a weighted setup, accidentally favoring that instance more than intended. Or, less commonly, a client-side pattern where a specific set of clients with connection-reuse behavior happens to keep landing on the same instance, particularly under an L4 setup, without the load balancer actively re-balancing already-established connections.

### 💎 Good to Know: An Uneven Distribution Isn't Always a Bug

It's often a genuinely expected consequence of a specific configuration choice — sticky sessions, a particular algorithm, a weight setting — interacting with real, uneven traffic patterns. Diagnosing this requires understanding which of this chapter's mechanisms is actually configured, not just observing the symptom in isolation.
