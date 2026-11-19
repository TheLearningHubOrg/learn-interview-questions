# Site Reliability Engineering (SRE) & Observability Master Interview Bank (1 - 20)

> SRE core principles, SLI/SLO/SLA mathematical definitions, Error Budgets governance, OpenTelemetry collector architecture, Prometheus TSDB & PromQL percentiles, Grafana RED/USE dashboards, and incident command.

---

### 1. SLA vs. SLO vs. SLI: Mathematical Definitions and Error Budgets.
**In Simple Words:**
- **SLI (Service Level Indicator)**: The quantifiable metric measuring real performance.
  $$\text{SLI} = \frac{\text{Successful Requests}}{\text{Total Valid Requests}} \times 100\%$$
- **SLO (Service Level Objective)**: The internal target reliability agreed upon by engineering and product (e.g. $99.9\%$ uptime over a rolling 30-day window).
- **SLA (Service Level Agreement)**: The legal contract with customers specifying financial penalties or refunds if reliability drops below a threshold (e.g. $<99.5\%$).
- **Downtime Calculation**:
  - $99.9\%$ ("three nines"): 43.8 minutes downtime/month.
  - $99.99\%$ ("four nines"): 4.38 minutes downtime/month.

### 2. Error Budgets: How they govern Feature Velocity vs. Reliability.
**In Simple Words:**
$$\text{Error Budget} = 100\% - \text{SLO}$$
For a $99.9\%$ SLO, the service has a $0.1\%$ error budget.
**Governance Policy:**
- If the error budget is $>0\%$: Developers can ship features quickly, deploy canaries, and take calculated risks.
- If the error budget is depleted ($0\%$): Feature deployments are automatically fro

### 3. The Three Pillars of Observability: Metrics vs. Logs vs. Traces.
**In Simple Words:**
1. **Metrics**: Aggregatable numeric data over time (counters, gauges, histograms). Extremely lightweight storage and fast querying. Tells you *that* something is wrong (e.g. "HTTP 500 error rate spiked to 12%").
2. **Logs**: Timestamped text/JSON records of specific events. High cardinality and detail. Tells you *what* happened inside an individual process.
3. **Traces**: Visuali

### 4. OpenTelemetry (OTel): Architecture, Semantic Conventions, and Collector.
**In Simple Words:**
OpenTelemetry is a vendor-neutral CNCF standard for generating and exporting telemetry:
- **OTel API & SDK**: Injected into app code to generate traces, metrics, and logs following standardi

### 5. Prometheus Architecture: Pull Model, TSDB, Exporters, and Alertmanager.
**In Simple Words:**
Prometheus is a time-series monitoring system:
- **Pull Model**: Prometheus actively scrapes HTTP `/metrics` endpoints exposed by applications and exporters at fixed scrape intervals (e.g. every 15s).
- **Service Discovery**: Dynamically discovers scraping targets using Kubernetes API tags.
- **TSDB**: High-performance local time-series database storing metrics as compressed chunks.
- **Pushgateway**: Used strictly for ephemeral batch jobs that terminate before a pull scrape can occur.
- **Alertmanager**: Deduplicates, groups, and routes firing alerts to Slack, PagerDuty, or email.

### 6. Prometheus Metric Types: Counter, Gauge, Histogram, and Summary.
**In Simple Words:**
1. **Counter**: Monotonically increasing cumulative metric that resets only on process restart (e.g. `http_requests_total`). Always used with `rate()` or `increase()`.
2. **Gauge**: Value that can go up or down arbitrarily (e.g. current CPU usage, memory in bytes, active connection count).
3. **Histogram**: Samples observations into configurable buckets and counts occurrences. Enables computing accurate percentiles ($p50$, $p95$, $p99$) across multiple instances using `histogram_quantile()`.
4. **Summary**: Computes configurable quantiles directly on the client side. Cannot be aggregated across multiple server instances.

### 7. PromQL Mastery: rate(), irate(), and histogram_quantile().
**In Simple Words:**
- **`rate(http_requests_total[5m])`**: Computes per-second average rate of increase over a 5-minute sliding window. Handles counter resets gracefully. Ideal for alerting rules.
- **`irate()`**: Instantaneous rate based on the last two scraped data points. Best for volatile, high-resolution graph dashboards.
- **`histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))`**: Calculates the 99th percentile request latency across all backend pods.

### 8. Dashboard Design: The RED Method vs. The USE Method.
**In Simple Words:**
- **The RED Method (for Request-Driven Services / APIs)**:
  - **Rate**: Number of requests per second (`rate(http_requests_total[1m])`).
  - **Errors**: Number of failed requests per second (`rate(http_requests_total{status=~"5.."}[1m])`).
  - **Duration**: Amount of time requests take (p50, p95, p99 latency).
- **The USE Method (for Infrastructure / Resources - CPU, Memory, Disk, Network)**:
  - **Utili

### 9. Centralized Logging: Elasticsearch (ELK) vs. Grafana Loki.
**In Simple Words:**
- **Elasticsearch (ELK / EFK)**:
  - Creates a full inverted text index for every word in every log line.
  - *Pros*: Lightning-fast arbitrary full-text search.
  - *Cons*: Enormous RAM and disk footprint; index si

### 10. Structured Logging Best Practices and Correlation IDs.
**In Simple Words:**
1. **JSON Format**: Avoid raw text strings (`logger.info("User " + id + " paid")`). Emit structured JSON objects (`{ "level": "info", "event": "payment_success", "userId": 123, "amount": 49.99 }`).
2. **Correlation / Request ID**: Generate a UUID at the API Gateway or ingress controller. Propagate it via the `X-Request-Id` HTTP header across all downstream microservices and log statements. Enables querying all logs for a single user journey with one query.

### 11. Alert Fatigue and Designing High-Signal Alerting Rules.
**In Simple Words:**
Alert fatigue happens when engineers are woken up by non-actionable or self-healing alerts, leading to genuine outages being ignored.
**Golden Rules for High-Signal Alerts:**
1. **Alert on Symptoms, not Causes**: Alert when *"User login success rate is $<95\%"*, not when *"Server 3 CPU is at 90%"*. If the CPU is high but the user experience is fine, no one needs to be paged at 3 AM.
2. **Every Pager Alert Must Be Actionable**: If an on-call engineer can only reply "acknowledged" and do nothing, downgrade the alert to an email or Slack notification.
3. **Attach Runbooks**: Every alert must include a direct link to a playbook explaining remediation steps.

### 12. Distributed Tracing: Context Propagation and Head vs. Tail Sampling.
**In Simple Words:**
- **Context Propagation**: Passing trace context (Trace ID, Parent Span ID, Trace Flags) across network boundaries using the W3C `traceparent` HTTP header (`00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`).
- **Head Sampling**: Decision to sample or drop a trace is made at the very start of the request (e.g. randomly keep $5\%$ of traces). Inexpensive, but often drops rare errors or slow outlier traces.
- **Tail Sampling**: The OTel Collector buffers all spans until the request completes. If the request had an HTTP 500 error or duration exceeded 2 seconds, the entire trace is preserved; boring fast traces are dropped.

### 13. The Four Golden Signals of Monitoring (Google SRE Book).
**In Simple Words:**
1. **Latency**: Time taken to service a request. Distinguish latency of successful requests from failed requests.
2. **Traffic**: Demand placed on the system (requests per second, concurrent sessions, network I/O).
3. **Errors**: Rate of requests that fail (explicit 500s, protocol errors, or implicit wrong content).
4. **Saturation**: How full the service is (memory consumption, thread pool utili

### 14. High Availability & Disaster Recovery: RPO vs. RTO.
**In Simple Words:**
- **RPO (Recovery Point Objective)**: The maximum acceptable data loss measured in time (e.g. *"Our RPO is 5 minutes"* means we can tolerate losing at most 5 minutes of transactional data).
- **RTO (Recovery Time Objective)**: The maximum acceptable downtime duration to restore service (e.g. *"Our RTO is 15 minutes"* means the service must be operational within 15 minutes of an outage).
- **Architectures**:
  - *Backup & Restore*: Cheap, High RPO/RTO (hours).
  - *Active-Passive (Warm Standby)*: Medium RPO/RTO.
  - *Active-Active Multi-Region*: Zero RPO, near-

### 15. Circuit Breaker Pattern: States and Transition Logic.
**In Simple Words:**
Prevents cascading failures when a downstream dependency (e.g. payment gateway) is down:
1. **Closed**: Normal state. Requests pass through. If failure rate exceeds threshold (e.g. $50\%$ over 10s), breaker transitions to **Open**.
2. **Open**: Requests fail immediately without calling the dependency! Returns cached fallback or error, giving the downstream service time to recover.
3. **Half-Open**: After a sleep timeout (e.g. 30s), breaker allows a trial batch of requests through:
   - If trial succeeds: Transitions back to **Closed**.
   - If trial fails: Reverts to **Open**.

### 16. Load Shedding, Rate Limiting, and Graceful Degradation under extreme load.
**In Simple Words:**
When incoming traffic exceeds system capacity ($>100\%$ CPU):
- **Rate Limiting**: Rejects requests per client IP or API key using Token Bucket or Sliding Window algorithms (HTTP 429).
- **Load Shedding**: The server actively rejects low-priority background requests (search indexers, recommendation feeds, non-critical webhooks) to prioriti

### 17. Incident Response Roles and War Room Management.
**In Simple Words:**
During a Major P1 Outage, chaotic communication exacerbates downtime. SRE establishes strict incident roles:
1. **Incident Commander (IC)**: Holds single-source decision authority. Directs investigation, delegates tasks, and prevents duplicate work. Does NOT write code or run commands directly.
2. **Operations Lead**: The engineer investigating logs, running diagnostics, and applying fixes.
3. **Communications Lead**: Posts regular status updates to customers and internal stakeholders (every 15–30 minutes) on the Status Page.

### 18. Blameless Post-Mortems and Root Cause Analysis (5 Whys).
**In Simple Words:**
**Blameless Culture:**
Failures are caused by systemic design flaws, poor tooling, and missing safety nets—never by "bad engineers". Punishing individuals encourages engineers to hide mistakes.
**5 Whys Technique:**
Iteratively asking "Why" to trace the root failure:
1. *Why did the checkout fail?* Database connection pool exhausted.
2. *Why was it exhausted?* Slow query held connections open for 15s.
3. *Why was the query slow?* Full table scan due to missing index on `orders.created_at`.
4. *Why was the index missing?* Migration failed to run on read-replica.
5. *Why wasn't replica migration verified?* No automated health check in deploy pipeline.
**Action Items**: Specific, assigned engineering tickets with due dates to prevent recurrence.

### 19. Kubernetes Autoscaling: Horizontal Pod Autoscaler (HPA) and Vertical Pod Autoscaler (VPA).
**In Simple Words:**
- **HPA (Hori

### 20. On-Call Best Practices, MTTA, MTTR, and Preventing SRE Burnout.
**In Simple Words:**
- **MTTA (Mean Time to Acknowledge)**: Time elapsed from alert firing until an engineer acknowledges receipt.
- **MTTR (Mean Time to Resolve)**: Time elapsed from incident start until service recovery.
**Preventing On-Call Burnout:**
1. Split rotations across secondary on-call and primary on-call.
2. Follow-the-sun rotation across global time

