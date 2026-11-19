# Site Reliability Engineering (SRE) & Observability Master Interview Bank (1 - 35)

> SRE core philosophy, Service Level Indicators (SLI), Service Level Objectives (SLO), Service Level Agreements (SLA), Error Budgets and multi-window burn rate alerting, Toil elimination, Incident Management and Blameless Post-Mortems, The 4 Golden Signals, USE vs RED methods, OpenTelemetry distributed tracing, Prometheus PromQL, and Chaos Engineering.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is Site Reliability Engineering (SRE) and how does it relate to DevOps?
**In Simple Words:**
SRE is a discipline pioneered by Google:
> "SRE is what happens when you ask a software engineer to design an operations team."
- **DevOps**: A philosophical cultural movement bridging development and operations to accelerate delivery.
- **SRE**: A concrete, programmatic **implementation of DevOps principles**:
  - Treats operations as a software problem.
  - Enforces Service Level Objectives (SLOs) and Error Budgets to balance feature velocity with system reliability.
  - Caps operational repetitive work (Toil) at 50%, dedicating the rest to engineering automation.

### 2. What are SLIs, SLOs, and SLAs?
**In Simple Words:**
The 3 foundational reliability targets:
1. **SLI (Service Level Indicator)**: A carefully defined quantitative measure of some aspect of the level of service delivered (e.g. "Ratio of HTTP successful requests (status < 500) over total requests").
2. **SLO (Service Level Objective)**: The target reliability percentage agreed upon internally by engineering and product teams (e.g. "99.9% of HTTP requests must succeed over a rolling 30-day window").
3. **SLA (Service Level Agreement)**: A formal, legally binding contract with external customers that defines financial penalties, credits, or refunds if the service drops below a minimum threshold (e.g. "If monthly uptime drops below 99.5%, customer receives 10% credit").

```text
SLI vs SLO vs SLA:
┌─────┬──────────────────────────┬────────────────────────────────────┐
│ SLI │ The actual measurement   │ "99.94% of requests were < 200ms"   │
│ SLO │ The internal team target │ "Target: 99.9% of requests < 200ms"│
│ SLA │ The legal contract       │ "If < 99.5%, we pay you a penalty" │
└─────┴──────────────────────────┴────────────────────────────────────┘
```

### 3. What is an Error Budget and how does it balance Speed vs Reliability?
**In Simple Words:**
$$\text{Error Budget} = 100\% - \text{SLO}$$
- If your SLO is **99.9%**, your Error Budget is **0.1%** allowed downtime or failure.
- **The Balance**: An Error Budget treats 100% reliability as an anti-pattern (100% is too expensive and halts innovation):
  - **Budget Remaining (> 0%)**: Developers are encouraged to push new features, run experiments, and deploy rapidly.
  - **Budget Exhausted (0%)**: Feature deployments are **frozen**; all engineering effort shifts to reliability fixes, test automation, and infrastructure hardening.

### 4. What is Toil in SRE and how is it managed?
**In Simple Words:**
Toil is operational work that has 4 characteristics:
1. Manual, repetitive, and administrative (e.g. manually restarting servers, resetting passwords, manual data patches).
2. Automatable (could be replaced by software scripts).
3. Tactically driven with **zero enduring value** (running it leaves the service in the exact same state).
4. Scales linearly with service growth.
- **SRE Rule**: SREs must spend **at most 50% of their time on toil**; the remaining $\ge 50\%$ must be spent on pure software engineering to automate toil out of existence!

### 5. What are The 4 Golden Signals of Monitoring (Google SRE)?
**In Simple Words:**
The essential metrics every production service must monitor:
1. **Latency**: The time it takes to service a request (differentiating between successful request latency vs failed request latency).
2. **Traffic**: The demand placed on the system (e.g. HTTP requests per second, network I/O bits/sec).
3. **Errors**: The rate of requests that fail (explicit 5xx errors, implicit incorrect payloads, policy drops).
4. **Saturation**: How full the service is; measures the most constrained resource (CPU%, RAM%, Disk IOPS, Connection pool usage).

### 6. What are the Three Pillars of Observability (Metrics, Logs, Traces)?
**In Simple Words:**
- **Metrics**: Numeric, aggregated, time-series data measured over intervals (e.g. CPU usage, request rate). Cheap to store, fast to query, ideal for alerting dashboards.
- **Logs**: Timestamped, discrete event records (often structured JSON). Rich in contextual detail, but expensive to store and search at high scale.
- **Distributed Tracing**: Records the end-to-end journey of a single request across multiple microservices via a unique `trace_id`. Identifies the exact microservice causing latency.

```text
The 3 Pillars of Observability:
┌──────────────┬────────────────────────────┬─────────────────────────────┐
│ Pillar       │ Format                     │ Primary Value               │
├──────────────┼────────────────────────────┼─────────────────────────────┤
│ Metrics      │ Numeric Time-Series        │ Alerting & Trend Dashboards │
│ Logs         │ Structured JSON Text       │ Root-Cause Deep Debugging   │
│ Traces       │ Spans with Call Hierarchy  │ Cross-Service Bottlenecks   │
└──────────────┴────────────────────────────┴─────────────────────────────┘
```

### 7. What is the difference between Monitoring and Observability?
**In Simple Words:**
- **Monitoring (Passive)**: Tells you *when* a system is broken: "Is the CPU > 90%? Is HTTP error rate > 1%?" (Answers "Known-Unknowns" via predefined dashboards and alerts).
- **Observability (Active)**: A property of a system that allows you to deduce its internal state based on its external outputs: "Why is User 42 experiencing a 3-second delay only when checkout contains a coupon on the EU cluster?" (Answers "Unknown-Unknowns" via high-cardinality debugging).

### 8. What is the difference between Availability and Reliability?
**In Simple Words:**
- **Availability**: The percentage of time a system is functional and reachable (e.g. "Uptime: 99.9%"). A service can be 100% available while returning empty error screens.
- **Reliability**: The probability that a system will perform its required functions correctly under specified conditions over a given duration. Focuses on **user correctness and SLA fulfillment**.

### 9. What is Mean Time to Detect (MTTD) and Mean Time to Resolve (MTTR)?
**In Simple Words:**
- **MTTD (Mean Time to Detect)**: Average time from when an incident begins until the engineering team is alerted.
- **MTTR (Mean Time to Resolve / Recover)**: Average time from incident detection until the service is fully restored and operating within SLOs.
- SRE focuses heavily on driving down MTTR via automated rollbacks, runbooks, and self-healing systems.

### 10. What is an On-Call Runbook (Playbook)?
**In Simple Words:**
A standardized operational document that provides step-by-step instructions for diagnosing and mitigating a specific alert:
- When an SRE is paged at 3:00 AM, the alert contains a direct link to the runbook.
- Contains: Symptoms, blast radius assessment, escalation path, immediate triage steps (e.g. "failover region", "scale pods", "disable feature flag"), and rollback commands.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. What is Multi-Window Multi-Burn-Rate Alerting?
**In Simple Words:**
Traditional alerting on raw percentages triggers false alarms or alerts too late:
- **Burn Rate**: The rate at which an incident is consuming the 30-day Error Budget:
  - Burn Rate 1 = Consumes 100% of budget in exactly 30 days.
  - Burn Rate 14.4 = Consumes **2% of the entire budget in 1 hour**!
- **Multi-Window Alerting (Google SRE Standard)**:
  - Checks two windows simultaneously (a short window like 5 minutes AND a long window like 1 hour).
  - Triggers a page **only when both windows confirm a high burn rate**, eliminating alert fatigue while catching catastrophic outages in minutes!

```text
Burn Rate Alerting Tiers:
┌───────────┬──────────────┬──────────────────┬──────────────┐
│ Severity  │ Burn Rate    │ Time to Exhaust  │ Notification │
├───────────┼──────────────┼──────────────────┼──────────────┤
│ Page (P1) │ 14.4 (Fast)  │ 2% in 1 hour     │ PagerDuty    │
│ Page (P2) │ 6.0          │ 5% in 6 hours    │ PagerDuty    │
│ Ticket    │ 1.0 (Slow)   │ 10% in 3 days    │ Jira/Email   │
└───────────┴──────────────┴──────────────────┴──────────────┘
```

### 12. What is OpenTelemetry (OTel) and how does its architecture operate?
**In Simple Words:**
OpenTelemetry is the CNCF vendor-neutral standard for collecting and exporting telemetry data:
- **OTel API**: Standardized interfaces used in application code to instrument metrics and traces.
- **OTel SDK**: Concrete implementation that batches, buffers, and exports data.
- **OTel Collector**: A vendor-agnostic proxy daemon that receives, processes (filters, redacts PII), and exports telemetry to any backend (Prometheus, Jaeger, Datadog, Grafana Tempo) via OTLP protocol.

### 13. What is Distributed Tracing and the W3C `traceparent` header?
**In Simple Words:**
Tracks a request as it traverses 10 independent microservices:
- **Trace**: The complete end-to-end journey, identified by a unique 16-byte `trace_id`.
- **Span**: A single unit of work within a service (e.g. an HTTP handler, a SQL query). Spans have a start time, duration, and parent span ID.
- **W3C `traceparent` Header**: Passed over HTTP to propagate context:
  `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`
  (`version - trace_id - parent_span_id - trace_flags`).

### 14. How does Prometheus work (The Pull Model vs Push Model)?
**In Simple Words:**
Prometheus is an open-source metrics monitoring and time-series database:
- **The Pull Model (Default)**: Prometheus server periodically scrapes HTTP endpoints (`/metrics`) exposed by target services:
  - Discovers targets automatically via Kubernetes API or Consul.
  - Server controls the scrape frequency; preventing overloaded services from being hammered by metrics.
- **Pushgateway**: For short-lived batch jobs that terminate before a pull scrape occurs; jobs push metrics to Pushgateway, which Prometheus scrapes.

### 15. What are PromQL Fundamentals (Counters, Gauges, Histograms, Summaries)?
**In Simple Words:**
- **Counter**: Monotonically increasing value (resets to 0 on restart). Used with `rate()`:
  `rate(http_requests_total[5m])` (calculates per-second request rate over 5 min).
- **Gauge**: Value that can go up or down (e.g. CPU temperature, memory usage, concurrent connections).
- **Histogram**: Samples observations into configurable buckets:
  `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))` (calculates 99th percentile p99 latency!).

### 16. What is the difference between the USE Method and the RED Method?
**In Simple Words:**
- **USE Method (Brendan Gregg - Resource Centric)**: For physical hardware and infrastructure (CPUs, Disks, Memory):
  - **U**tilization (percent of time resource was busy).
  - **S**aturation (degree to which work is queued).
  - **E**rrors (hardware/driver error events).
- **RED Method (Tom Wilkie - Service Centric)**: For software request-driven microservices:
  - **R**ate (requests per second).
  - **E**rrors (failed requests per second).
  - **D**uration (time requests take).

### 17. How does Incident Management work and what is the Incident Commander (IC) role?
**In Simple Words:**
During a production P1 outage, clear roles prevent chaotic panic:
- **Incident Commander (IC)**: The leader of the incident response:
  - Does **NOT** debug code or run fixes!
  - Coordinates communication, assigns investigation tasks, and has final authority on failovers or rollbacks.
- **Operations Lead**: Executes technical mitigation commands.
- **Communications Lead**: Updates external status pages and business stakeholders.

### 18. What is a Blameless Post-Mortem?
**In Simple Words:**
An incident retrospective conducted under the core cultural assumption that:
> "Engineers are skilled, intelligent, and do the best they can with the information they have at the time. System failures are organizational and architectural flaws, not human incompetence."
- Avoids naming or shaming individuals.
- Focuses on: Root cause, timeline, contributing technical factors, detection gaps, and actionable **Jira tickets with assigned owners to prevent recurrence**.

### 19. What are RTO (Recovery Time Objective) and RPO (Recovery Point Objective)?
**In Simple Words:**
Key disaster recovery metrics:
- **RTO (Recovery Time Objective)**: The maximum acceptable duration of time the system can remain down following a disaster before operations must be restored (e.g. "Service must be back online within 15 minutes").
- **RPO (Recovery Point Objective)**: The maximum acceptable age of data that can be permanently lost due to a disaster (e.g. "We can tolerate losing at most 5 minutes of transactional data").

```text
RTO vs RPO Timeline:
[Last Data Backup] ◄─── RPO (Max Data Loss) ───► [Disaster Occurs!]
                                                         │
                                             RTO (Max Downtime)
                                                         ▼
                                               [System Restored!]
```

### 20. What is Chaos Engineering and the Principles of Chaos?
**In Simple Words:**
The discipline of experimenting on a distributed system to build confidence in the system's capability to withstand turbulent production conditions:
- **Principles**:
  1. Define normal steady-state behavior (e.g. steady 99.9% success rate).
  2. Hypothesize that steady state will continue during a simulated fault.
  3. Introduce realistic real-world chaos variables (kill pod, drop 10% network packets, sever database replica connection).
  4. Measure if automated failovers, retries, and circuit breakers preserve the steady state.

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. How do you implement Canary Deployments with Automated Rollbacks?
**In Simple Words:**
Replaces risky all-at-once releases:
1. Deploy new version to a small subset of instances (e.g. 5% of traffic).
2. The Canary analyzer (e.g. Argo Rollouts or Flagger) continuously queries Prometheus SLIs:
   - If HTTP 5xx error rate > 0.5% or p99 latency > 300ms:
   - **Immediately triggers automated rollback to previous version**, limiting blast radius to only 5% of users for under 60 seconds!
3. If SLIs remain green, traffic automatically scales up: 20% -> 50% -> 100%.

### 22. What is Alert Fatigue and how do you design Actionable Alerts?
**In Simple Words:**
When on-call engineers receive hundreds of non-urgent, informational notifications, they become desensitized and ignore real catastrophic alerts:
- **Rules for Actionable Alerts**:
  1. Every alert that pages an engineer must be **urgent, important, actionable, and real**.
  2. If the alert does not require immediate human intervention within 15 minutes, send it as a ticket or email, **never page an on-call engineer**!
  3. Alert on **symptoms (SLO violations)**, not causes (e.g. alert on "User checkout error rate high", not "Server 3 CPU at 91%").

### 23. What is High-Cardinality and High-Dimensionality in Observability?
**In Simple Words:**
- **Cardinality**: The number of unique values in a set.
- **The Problem in Time-Series DBs (Prometheus)**: Putting high-cardinality labels (like `user_id`, `order_id`, or `uuid`) on a Prometheus metric creates millions of independent time-series streams in memory, causing Prometheus to crash with OOM!
- **Solution**: High-cardinality values belong in **Distributed Tracing Spans and Structured Logs**, while metrics must be restricted to low-cardinality tags (`http_status`, `method`, `region`).

### 24. What are Load Shedding and Graceful Degradation under extreme traffic spikes?
**In Simple Words:**
When traffic exceeds maximum capacity by 300%, a system without load shedding collapses completely (throughput drops to 0):
- **Load Shedding**: The gateway intentionally drops excess incoming low-priority requests with HTTP 429 / 503 to ensure the system can process its maximum capacity cleanly.
- **Graceful Degradation**: Disables non-critical, heavy features dynamically:
  - Example: Disable personalized AI recommendation engines; serve static cached recommendations instead, preserving core checkout functionality.

### 25. What is the Circuit Breaker Pattern and how does it prevent Cascading Failures?
**In Simple Words:**
When a downstream service (e.g. Payment Gateway) hangs or slows down:
- Upstream services wait on thread timeouts, exhausting their own thread pools until every microservice across the entire company crashes sequentially.
- **Circuit Breaker**: Tracks failure rates. When failures exceed 50%, the circuit flips to **Open**:
  - Immediately rejects calls locally without network calls.
  - Returns a fallback response instantly, protecting upstream caller threads.

### 26. What is Tail Latency Amplification in microservice architectures?
**In Simple Words:**
In a microservice tree where serving one user request requires fanning out to 100 backend services in parallel:
- If each service has a 99th percentile (p99) latency of 1 second (1% chance of slowness):
- The probability that the user experiences a slow request is:
  $$1 - (0.99)^{100} \approx \mathbf{63.4\%}!$$
- Even though every individual microservice is 99% fast, **over 63% of user requests will be painfully slow**!
- **Mitigations**: Hedged requests (send duplicate request to another replica if first takes > p95 time), speculative retries, and strict aggressive timeouts.

### 27. How does Distributed Rate Limiting work with Redis and Token Bucket?
**In Simple Words:**
- **Token Bucket Algorithm**: A bucket has a maximum capacity of $B$ tokens and refills at a steady rate of $R$ tokens per second.
- Each request consumes 1 token. If the bucket is empty, requests are rejected (HTTP 429).
- Handled atomically in distributed clusters using an in-memory **Redis Lua script** or Envoy proxy rate-limit service.

### 28. What are Health Checks: Liveness vs Readiness vs Startup Probes?
**In Simple Words:**
In container orchestrators (Kubernetes):
1. **Startup Probe**: Checks if the container has finished initial slow bootstrapping (e.g. JVM warmup). Disables liveness checks until passed.
2. **Liveness Probe**: Checks if the container is healthy. If it fails, Kubernetes **kills and restarts the container**.
3. **Readiness Probe**: Checks if the container is ready to accept user network traffic. If it fails, Kubernetes **removes the pod from the Load Balancer Service endpoints** without restarting it (allows pod to finish warming up or draining buffers).

### 29. What is Backpressure and how does it prevent buffer overflow?
**In Simple Words:**
When a fast data producer sends data faster than a slow consumer can process it:
- Without backpressure: In-memory buffers fill up, resulting in Out-Of-Memory crashes.
- **Backpressure**: The consumer signals the producer to slow down or halt transmission (e.g. TCP sliding window, reactive streams, pausing Kafka consumer partitions).

### 30. How do you design an SRE Capacity Planning model?
**In Simple Words:**
Forecasts infrastructure requirements to accommodate business growth before resource exhaustion occurs:
1. Establish baseline per-user resource consumption (e.g. 10,000 active users consume 4 CPU cores and 8 GB RAM).
2. Project traffic growth trends factoring in upcoming marketing campaigns and seasonal spikes (Black Friday).
3. Factor in $N+1$ redundancy (capacity must withstand the loss of the largest single datacenter or node pool).

### 31. What is GameDay in Chaos Engineering?
**In Simple Words:**
A scheduled live-fire exercise where engineering teams gather to simulate real-world disaster scenarios in staging or production:
- Simulates scenarios: "Region `us-east-1` has completely lost power", "Primary database disk is full", "DNS provider is hijacked".
- Validates alerting fidelity, verifies runbooks, and tests team coordination under realistic pressure.

### 32. What is Distributed Consensus and how does Raft maintain quorum?
**In Simple Words:**
Used by etcd, Kubernetes, and Consul to maintain consistent cluster state:
- Guarantees that a cluster can continue operating correctly as long as a strict majority ($\lfloor N / 2 \rfloor + 1$) of nodes are healthy.
- Elects a single Leader. All writes go to the Leader, which replicates entries to followers and commits only after majority acknowledgment.

### 33. What are Hedged Requests and how do they eliminate tail latency?
**In Simple Words:**
A client sends a request to Replica A:
- If Replica A does not respond within the 95th percentile expected latency (e.g. 50ms):
- The client sends a duplicate **hedged request** to Replica B.
- Whichever replica returns first is accepted; the other request is cancelled.
- Eliminates random server hiccups (GC pauses, disk queue spikes) at the cost of slight (~5%) extra network traffic.

### 34. What is a Dead Man's Snitch (Watchdog Alerting)?
**In Simple Words:**
If your entire monitoring infrastructure (Prometheus / Alertmanager) crashes or loses internet connectivity, it cannot send an alert telling you it is down!
- **Dead Man's Snitch**: Prometheus sends a continuous "Heartbeat" alert every minute to an external third-party service (e.g. PagerDuty / Healthchecks.io).
- If the external service **fails to receive a heartbeat** for 5 minutes, it triggers a catastrophic P1 alert: *"Monitoring system has gone dark!"*

### 35. When should an SRE team say "NO" to a feature launch?
**In Simple Words:**
An SRE engagement is governed by objective data, never subjective opinions:
- SRE halts a launch **only if**:
  1. The service's **Error Budget is completely exhausted** for the current window.
  2. The service lacks basic observability (missing metrics, no actionable alerts).
  3. The service lacks an audited emergency rollback plan and verified runbook.
`;
