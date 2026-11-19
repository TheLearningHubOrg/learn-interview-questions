# CI/CD Pipelines, GitHub Actions & GitOps Master Interview Bank (1 - 15)

> Continuous Integration & Continuous Deployment pipelines, GitHub Actions workflows, matrix builds, artifact caching, security scanning, ArgoCD, Flux, and progressive canary rollouts.

---

### 1. CI vs. CD vs. Continuous Deployment: Core principles, Trunk-Based Development, and deployment gates.
### Delivery Pipeline Paradigms
The journey from code commit to running production software consists of three distinct stages of automation maturity.

```
+------------------+     +-----------------------+     +-----------------------------+
|    Continuous    |     |      Continuous       |     |         Continuous          |
|   Integration    |     |       Delivery        |     |         Deployment          |
|                  |     |                       |     |                             |
| Commit -> Build  | --> | Artifact Staged &     | --> | Fully automated rollout     |
| Lint   -> Test   |     | Deployed to Staging;  |     | to Production with

### 2. Building Secure CI/CD Pipelines: GitHub Actions layer caching, ephemeral runners, and OIDC keyless authentication.
### Cloud Authentication Without Static Secrets
Traditional CI/CD pipelines stored static, long-lived AWS Access Keys (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) as repository secrets. If compromised, attackers obtain permanent access to cloud infrastructure. Modern pipelines use **OpenID Connect (OIDC)** for temporary, keyless authentication.

```
[ GitHub Actions Workflow ]
            | 1. Requests OIDC JWT token
            v
[ GitHub OIDC Identity Provider ]
            | 2. Returns short-lived cryptographically signed JWT
            v
[ GitHub Runner ] === 3. Presents JWT via AssumeRoleWithWebIdentity ===> [ AWS STS ]
                                                                             |
[ GitHub Runner ] <=== 4. Returns temporary 1-hour IAM credentials <=========+
```

#### Production GitHub Actions Workflow Blueprint
```yaml
name: Production Build & Deploy
on:
  push:
    branches: [main]

permissions:
  id-token: write # Required for requesting the OIDC JWT token
  contents: read

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Authenticate to AWS via OIDC (No Static Keys!)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-actions-production-deployer
          aws-region: us-east-1

      - name: Set up Docker Buildx & Cache
        uses: docker/setup-buildx-action@v3

      - name: Build & Push Container Image with GitHub Cache
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: 123456789012.dkr.ecr.us-east-1.ama

### 3. GitOps Philosophy & ArgoCD / Flux: Declarative state, pull-based reconciliation, and automated drift remediation.
### Push-Based CI vs. Pull-Based GitOps
In traditional CI/CD (Push model), the external CI server holds cluster-admin credentials and runs `kubectl apply` against the cluster. In **GitOps (Pull model)**, an agent running *inside* the cluster continuously synchroni

### 4. Progressive Delivery & Release Strategies: Blue/Green vs. Canary vs. Shadow / Mirroring with Argo Rollouts.
### Progressive Delivery Patterns
Deploying directly to 100% of user traffic introduces severe blast-radius risk. Progressive delivery mitigates this by validating software against live traffic before full promotion.

```
1. Blue/Green Deployment:
   [ Load Balancer ] ---> [ Blue Environment (v1 - Active) ]
   (Switches 100% to) ---> [ Green Environment (v2 - Idle -> Active) ]

2. Canary Deployment (Percentage-Based):
   [ Load Balancer ] --- 95% Traffic ---> [ Stable Deployment (v1) ]
                     ---  5% Traffic ---> [ Canary Deployment (v2) ] (Monitors Prometheus metrics)

3. Traffic Shadowing / Mirroring:
   [ Envoy Proxy ] --- 100% Production Traffic ---> [ Production App (v1) ]
                   --- Shadow Copy (Async)     ---> [ Test App (v2 - Discards responses) ]
```

#### Production Canary Automation with Argo Rollouts
Argo Rollouts replaces the standard Kubernetes `Deployment` controller, evaluating real-time Prometheus SLIs to automatically promote or roll back releases:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: payment-service
spec:
  replicas: 10
  strategy:
    canary:
      analysis:
        templates:
          - templateName: error-rate-analysis
        args:
          - name: service-name
            value: payment-service
      steps:
        - setWeight: 10 # Route 10% traffic to canary
        - pause: { duration: 5m } # Wait 5 minutes for metrics
        - setWeight: 50 # If error rate < 0.5%, promote to 50%
        - pause: { duration: 10m }
```

---

### 5. Helm Packaging vs. Kustomize: Template rendering vs. overlay patching and secret handling.
### Configuration Management Tooling
Managing Kubernetes manifests across environments (dev, staging, prod) requires avoiding copy-paste manifest duplication. The two dominant industry standards take diametrically opposing philosophical approaches.

```
1. Helm (Parameteri

### 6. Software Supply Chain Security & SLSA Framework: SBOM generation, container scanning (Trivy), and SAST.
### Securing the Software Supply Chain
Modern attackers frequently target developer tooling and third-party dependencies rather than attacking production firewalls directly. The **SLSA (Supply-chain Levels for Software Artifacts)** framework provides end-to-end security verification.

```
[ Source Code ] ---> [ Dependencies ] ---> [ Build Runner ] ---> [ Artifact / Image ] ---> [ Deploy ]
      |                     |                     |                      |                     |
  Git Signing         SBOM (Syft)          Ephemeral Runner        Cosign Signature       Admission Webhook
  & Branch Rules      Trivy Scanner        Isolated Network        Attestation Checks     (Kyverno blocks)
```

#### Core Security Layers in CI/CD
1. **SAST (Static Application Security Testing)**: Scans source code for hardcoded secrets, SQL injection, and buffer overflows using tools like **Semgrep** or **SonarQube**.
2. **SCA (Software Composition Analysis)**: Checks open-source packages in `package.json` or `requirements.txt` against known CVE vulnerability databases (Dependabot, Snyk).
3. **SBOM (Software Bill of Materials)**: A machine-readable inventory of all components, libraries, and licenses embedded in your software. Generated using **Syft**:
```bash
# Generate CycloneDX SBOM
syft registry.example.com/api:v1.0.0 -o cyclonedx-json > sbom.json
```
4. **Container Image Scanning**: Scans OS packages and application dependencies for critical CVEs using **Trivy**:
```bash
# Fail CI build if any CRITICAL vulnerability exists
trivy image --exit-code 1 --severity CRITICAL registry.example.com/api:v1.0.0
```

---

### 7. Zero-Downtime Database Migrations in CI/CD: The Expand-and-Contract (Parallel Run) migration pattern.
### Decoupling Schema Migrations from Code Deployments
The fatal flaw in traditional CI/CD is running database migrations (e.g., `alembic upgrade head` or `prisma migrate deploy`) that drop or rename a column while old application code is still running, immediately causing widespread production crashes.

```
Phase 1: EXPAND (Additive Schema Change)
[ Old DB: { phone } ] ---> Add nullable column `phone_number`
Old App v1 still reads/writes `phone`. Database is backwards-compatible!

Phase 2: DUAL-WRITE / READ TRANSITION (Deploy New Code)
Deploy App v2: Writes to both `phone` and `phone_number`. Reads from `phone_number`.
Execute background asynchronous backfill script to migrate historical records.

Phase 3: CONTRACT (Subtractive Schema Change)
Deploy App v3: Drops all references to old column `phone`.
Execute migration: `ALTER TABLE users DROP COLUMN phone;`
```

#### Golden Rules for Zero-Downtime Database Pipelines
1. **Every migration must be backwards-compatible**: Never rename a column, never drop a column, and never add a `NOT NULL` column without a default value in a single step.
2. **Migrations run in a separate pipeline stage**: Run migrations before deploying the new pods, verified with pre-deployment sanity checks.
3. **Locks must have strict timeouts**: Always set `SET lock_timeout = '2s';` in PostgreSQL migrations to prevent long-running table locks from stalling incoming user queries.

---

## Part 5: Infrastructure as Code, SRE Observability & Production Troubleshooting (43 - 50)

### 8. Infrastructure as Code (IaC): Terraform state architecture, remote backends, and state locking mechanisms.
### Declarative State Management
Terraform is a declarative Infrastructure as Code tool. It records the mapping between your HCL code definitions and real-world cloud resources in a **state file (`terraform.tfstate`)**.

```
+-----------------------+               +-------------------------------------+
| Developer / CI Runner |               | Remote Backend (AWS S3 Bucket)      |
| terraform apply       |               | - Encrypted terraform.tfstate       |
+-----------------------+               +-------------------------------------+
           |                                               ^
           | Acquire State Lock (atomic)                   | Read/Write State
           v                                               v
+-----------------------+               +-------------------------------------+
| AWS DynamoDB Table    |               | Real Cloud Infrastructure (AWS)     |
| LockID = "state-hash" |               | - VPC, EKS Cluster, RDS Database    |
+-----------------------+               +-------------------------------------+
```

#### Remote Backend Blueprint (S3 + DynamoDB State Locking)
In a production team environment, never keep state on a local laptop. Use S3 with versioning and DynamoDB for atomic locking to prevent concurrent runs from corrupting the state file:
```hcl
terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "production-terraform-state-12345"
    key            = "core-infra/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"
  }
}
```

#### Core Terraform Lifecycle Phases
1. **`terraform init`**: Downloads provider plugins (AWS, Kubernetes, Helm) and connects to remote backend.
2. **`terraform plan`**: Performs a 3-way merge between your desired code, current state file, and real-world infrastructure (via API calls) to calculate a deterministic execution plan.
3. **`terraform apply`**: Executes only the required CRUD operations in parallel order based on dependency graphs (`Directed Acyclic Graph - DAG`).

---

### 9. Terraform Modules, Multi-Environment Architecture, and Automated Configuration Drift Detection.
### Scaling Terraform in Enterprise Organi

### 10. Site Reliability Engineering (SRE): SLI vs. SLO vs. SLA, Error Budgets, and Burn Rate alerting.
### Reliability Engineering Foundations
Google's Site Reliability Engineering (SRE) framework replaces arbitrary uptime goals with mathematical error budgets.

```
+-------------------------------------------------------------------------------+
|                      The SRE Service Level Hierarchy                          |
|                                                                               |
|   1. SLI (Indicator):    Actual measured real-time performance.               |
|                          Example: 99.94% of HTTP requests returned < 200ms.   |
|                                                                               |
|   2. SLO (Objective):    Internal target set by engineering & product.        |
|                          Example: 99.9% success rate over rolling 30 days.    |
|                                                                               |
|   3. SLA (Agreement):    External legal contract with customers.              |
|                          Example: 99.0% uptime; violation triggers credits.   |
|                                                                               |
|   4. Error Budget:       Acceptable unreliability (100% - SLO).               |
|                          99.9% SLO = 0.1% Error Budget (43.2 mins/month).     |
+-------------------------------------------------------------------------------+
```

#### Error Budget Burn Rate Alerting
Alerting on raw threshold spikes (e.g. "error rate > 1%") creates massive false positives during brief hiccups. SRE standardi

### 11. The Three Pillars of Observability: Metrics, Structured Logs, and Distributed Tracing (OpenTelemetry).
### Architecture of Modern Observability
Observability is the ability to infer the internal state of a complex distributed system based on its external outputs.

```
+-----------------------+     +-----------------------+     +-----------------------+
|        METRICS        |     |         LOGS          |     |        TRACES         |
| (Prometheus / StatsD) |     | (FluentBit / Loki)    |     | (OpenTelemetry/Jaeger)|
|                       |     |                       |     |                       |
| Aggregated numeric    |     | Structured JSON event |     | End-to-end request    |
| time-series counters, |     | records with context: |     | spans showing latency |
| gauges, & histograms. |     | timestamp, msg, trace |     | across microservices. |
| Tells you: "SOMETHING |     | Tells you: "WHY IT IS |     | Tells you: "WHERE THE |
| IS WRONG & WHERE"     |     | HAPPENING"            |     | LATENCY/ERROR OCCURS" |
+-----------------------+     +-----------------------+     +-----------------------+
```

#### Distributed Trace Context Propagation (W3C TraceContext)
When an HTTP request enters an API Gateway and traverses downstream microservices, OpenTelemetry automatically injects and extracts the `traceparent` header:
```http
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
              |  |                                |                |
        Version  Trace ID (Unique per user call)  Parent Span ID   Sampled Flag
```
This unifies logs, metrics, and trace graphs across do

### 12. Prometheus Architecture & PromQL Fundamentals: Pull-based scraping, TSDB storage, and essential PromQL queries.
### Prometheus Core Mechanics
Prometheus uses a **pull-based scraping model** over HTTP, collecting metrics from targets registered via Kubernetes Service Discovery.

```
[ K8s API Server Service Discovery ]
                 |
                 v
+------------------------------------+         +------------------------+
|       Prometheus Server            | ------> |      Alertmanager      |
|  - Retrieval (Pulls /metrics HTTP) | (Alert) | - Deduplication        |
|  - Storage (Local TSDB Chunking)   |         | - Routing to Slack/PD  |
|  - PromQL Engine                   |         +------------------------+
+------------------------------------+
                 ^
                 | PromQL Queries
       [ Grafana Dashboards ]
```

#### Production PromQL Query Cheat Sheet
1. **HTTP Request Rate per second (QPS)** over the last 5 minutes:
```promql
sum(rate(http_requests_total{status=~"2.."}[5m])) by (service)
```

2. **HTTP Error Rate Percentage (4xx / 5xx)**:
```promql
(sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))) * 100
```

3. **95th Percentile Latency (p95)** across API endpoints:
```promql
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, endpoint))
```

4. **Pods Near Memory Limits (Identify OOM Risks)**:
```promql
(container_memory_working_set_bytes{container!=""} / container_spec_memory_limit_bytes{container!=""}) > 0.85
```

---

### 13. Grafana Dashboard Engineering & Alert Fatigue Prevention: The Four Golden Signals and Alertmanager tuning.
### Human-Centered Monitoring
The #1 failure of monitoring systems is **Alert Fatigue**: on-call engineers getting paged at 3:00 AM for non-actionable, self-resolving threshold blips, leading to missed real outages.

```
The Four Golden Signals (Google SRE):
1. LATENCY:     Time taken to service a request (p50, p95, p99).
2. TRAFFIC:     Demand placed on the system (QPS, concurrent connections).
3. ERRORS:      Rate of requests that fail explicitly (HTTP 500s) or implicitly.
4. SATURATION:  How "full" the service is (Memory %, CPU CFS throttle %, DB connection pool).
```

#### Alertmanager Anti-Fatigue Architecture
1. **Grouping**: Collapses 50 separate container crash alerts during a network partition into a single Slack/PagerDuty notification.
```yaml
route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
```
2. **Inhibition**: If a root-cause alert fires (e.g. `NodeNetworkDown`), automatically mute all downstream alerts (`PodCrashing`, `EndpointUnreachable`) caused by that node outage.
3. **Actionability Rule**: If an alert does not have a documented Runbook URL and does not require an immediate human action, **it must not page someone**. Demote it to a daily dashboard or ticket.

---

### 14. Production Incident Management & Blameless Post-Mortems: Roles, war rooms, 5-Whys, and corrective actions.
### High-Stakes Incident Response
During an active SEV1 production outage, chaotic debugging prolongs downtime. Resilient organi

### 15. How do you summarize your engineering philosophy and conclude a DevOps / Platform / SRE Interview?
### High-Signal Interview Conclusion
> "To conclude, my philosophy as a DevOps and Infrastructure Engineer centers on one core premise: **Production reliability is not an afterthought—it is a continuous software engineering discipline.**
>
> True platform engineering is not about manually clicking in cloud consoles or firefighting outages; it is about building self-service, automated guardrails so development teams can deploy code rapidly, securely, and with

