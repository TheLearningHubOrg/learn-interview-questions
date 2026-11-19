# Google Cloud Platform (GCP) Architecture Master Interview Bank (1 - 35)

> GCP core services, resource hierarchy, IAM roles, Service Accounts, Workload Identity, Compute Engine, GKE Autopilot, Cloud Run, Cloud Spanner (TrueTime), BigQuery, VPC Service Controls, and hybrid enterprise networking.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is the Google Cloud Platform (GCP) Resource Hierarchy?
**In Simple Words:**
GCP organizes resources in a strict four-level hierarchy that determines access control and billing inheritance:
1. **Organization (Root node)**: Represents the entire enterprise domain (e.g. `example.com`).
2. **Folders**: Departmental or environment groups (e.g. `Engineering`, `Finance`, `Prod`, `Staging`).
3. **Projects (Core administrative boundary)**: All cloud resources (VMs, buckets, databases) must belong to exactly one project.
4. **Resources**: The actual running services (Compute instances, Cloud Storage buckets, BigQuery datasets).
- **Inheritance Rule**: Policies flow downwards; permissions granted at the Organization or Folder level cannot be revoked at the Project level.

```text
GCP Hierarchy:
          [Organization: acme.com]
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
  [Folder: Production]   [Folder: Staging]
          │
  [Project: ecom-prod-101]
          │
  ┌───────┴───────┬───────────────┐
  ▼               ▼               ▼
[GKE Cluster]  [Cloud Spanner]  [GCS Bucket]
```

### 2. What are the types of IAM Roles in GCP (Primitive, Predefined, Custom)?
**In Simple Words:**
- **Primitive (Basic) Roles (Legacy)**: `Viewer`, `Editor`, and `Owner`. Too broad and dangerous for production (grant access to almost all services in a project).
- **Predefined Roles (Best Practice)**: Granular, service-specific roles created and maintained by Google (e.g. `roles/storage.objectViewer`, `roles/spanner.databaseUser`).
- **Custom Roles**: Tailored roles created by defining exact permission sets (e.g. `resourcemanager.projects.get`, `compute.instances.start`) to satisfy strict Least Privilege requirements.

### 3. What is a GCP Service Account and how does it authenticate?
**In Simple Words:**
A Service Account is a special Google identity used by applications and automated workloads (not human users) to call Google APIs:
- Identified by an email address: `backend-app@my-project.iam.gserviceaccount.com`.
- **Authentication**:
  - Locally: Downloaded JSON service account keys (high security risk).
  - In Cloud: Attached directly to Compute instances, GKE Pods, or Cloud Run services, which fetch temporary OAuth2 access tokens automatically from the internal metadata server (`http://metadata.google.internal`).

### 4. What are the differences between Compute Engine, Cloud Run, GKE, and Cloud Functions?
**In Simple Words:**
- **Compute Engine (IaaS)**: Raw virtual machines. Full OS control (Linux/Windows), custom kernel modules, highest management overhead.
- **Google Kubernetes Engine - GKE (CaaS)**: Managed Kubernetes. Ideal for complex microservices with intricate networking, service meshes, and stateful workloads.
- **Cloud Run (PaaS / Serverless Containers)**: Serverless container platform. Deploys any OCI container, scales from 0 to thousands of instances in seconds, charges strictly per 100ms of CPU/RAM during requests.
- **Cloud Functions (FaaS)**: Event-driven serverless functions (Node.js, Python, Go) triggered by Cloud Storage uploads, Pub/Sub events, or HTTP webhooks.

```text
Compute Trade-off Continuum:
IaaS (Max Control) ◄──────────────────────────────► FaaS (Max Velocity)
Compute Engine ──► GKE Standard ──► GKE Autopilot ──► Cloud Run ──► Cloud Functions
```

### 5. What are the Cloud Storage (GCS) Storage Classes and their lifecycle policies?
**In Simple Words:**
- **Standard**: High-frequency active access (websites, app data, streaming).
- **Nearline**: Accessed less than once a month (30-day minimum retention; monthly backups).
- **Coldline**: Accessed less than once a year (90-day minimum retention; disaster recovery).
- **Archive**: Long-term compliance archiving (365-day minimum retention; lowest storage cost).
- **Lifecycle Management**: Automatically transitions objects between classes based on age, or deletes old versions.

### 6. What is the difference between Cloud SQL, Cloud Spanner, and Cloud Bigtable?
**In Simple Words:**
- **Cloud SQL**: Managed relational database (PostgreSQL, MySQL, SQL Server). Vertical scaling, single-region primary with read replicas.
- **Cloud Spanner**: Globally distributed, horizontally scalable, multi-region database with **full ACID transactions** and 99.999% availability SLA.
- **Cloud Bigtable**: Managed NoSQL wide-column store designed for petabyte-scale streaming telemetry, IoT sensors, and real-time analytical workloads with single-digit millisecond latency.

### 7. What is a VPC Network in GCP and how does its global nature differ from AWS?
**In Simple Words:**
In GCP, a Virtual Private Cloud (VPC) is **Global by default**, whereas in AWS a VPC is confined to a single Region:
- A single GCP VPC spans all Google data centers worldwide.
- **Subnets** are regional (e.g. subnet in `us-central1`, subnet in `europe-west1`), but VMs in different subnets communicate over Google's private fiber backbone without VPNs or public internet transit.

### 8. What is Cloud Load Balancing and what is an Anycast IP?
**In Simple Words:**
Google Cloud External Load Balancer uses **BGP Anycast routing**:
- A single global IPv4 address is announced from over 100 Google Points of Presence (PoPs) worldwide.
- Traffic enters Google's ultra-low-latency private fiber network at the nearest edge router to the user, terminating TLS at the edge and proxying requests to the closest healthy backend region.

### 9. What is Cloud Pub/Sub and how does it compare Push vs Pull subscriptions?
**In Simple Words:**
Cloud Pub/Sub is a fully managed, globally distributed asynchronous messaging service:
- **Topics**: Publishers send JSON/binary messages to a topic.
- **Pull Subscription**: Worker instances poll Pub/Sub for messages, process them, and send an acknowledgment (`ack`). Best for high-throughput batch consumers.
- **Push Subscription**: Pub/Sub automatically sends an HTTP POST webhook request containing the message payload to a target URL (e.g. Cloud Run endpoint).

### 10. What is BigQuery and what is its serverless execution model?
**In Simple Words:**
BigQuery is Google's serverless, multi-cloud enterprise data warehouse:
- Requires zero infrastructure provisioning.
- Separates storage (Colossus columnar storage in Capacitor format) from compute (**Slots** running the Dremel query engine).
- Scales from 0 to thousands of parallel query workers dynamically to analyze terabytes of data in seconds.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. How does Cloud Spanner achieve Globally Distributed ACID Transactions via TrueTime?
**In Simple Words:**
Traditional databases cannot achieve global distributed ACID without locking because clock drift between servers makes ordering transactions impossible.
- **TrueTime API**: Google equips data centers with GPS receivers and atomic rubidium clocks, guaranteeing a bounded clock uncertainty interval $\epsilon \approx \pm 7\text{ms}$.
- **Commit Wait Protocol**: When Spanner writes a transaction, it waits for $2\epsilon$ before releasing locks.
- **Result**: Guarantees strict **External Consistency (Linearizability)** globally at scale with zero distributed locking deadlock!

```text
TrueTime Clock Uncertainty:
Earliest Time  ◄──── [Now] ────► Latest Time
      [-------- 2ε Bounded Interval --------]
Spanner waits 2ε to ensure transaction timestamps never overlap!
```

### 12. What is GKE Autopilot and how does it differ from GKE Standard?
**In Simple Words:**
- **GKE Standard**: You manage the Kubernetes nodes, VM instance types, OS patching, and pay for the underlying Compute Engine VM instances regardless of whether pods fill them.
- **GKE Autopilot**: Google manages and provisions the entire node infrastructure, node pools, OS hardening, and scaling:
  - You only manage Kubernetes manifests (Deployments, Services).
  - Billing is strictly based on the exact CPU, memory, and storage **requested by your running Pods**.

### 13. What is Workload Identity Federation in GCP and why should you eliminate service account JSON keys?
**In Simple Words:**
Hardcoded JSON keys are the #1 cause of cloud credential leaks on GitHub:
- **Workload Identity Federation**: Allows external workloads (AWS EC2, GitHub Actions, Kubernetes pods) to impersonate a GCP Service Account using short-lived OpenID Connect (OIDC) tokens.
- **Flow**: GitHub Actions generates an OIDC JWT token -> GCP Security Token Service (STS) verifies GitHub's signature -> GCP issues a temporary 1-hour OAuth access token.

```yaml
# GitHub Actions Workload Identity Example:
- name: Authenticate to Google Cloud
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: 'projects/123/locations/global/workloadIdentityPools/github-pool/providers/github-provider'
    service_account: 'deployer@my-project.iam.gserviceaccount.com'
```

### 14. What is VPC Network Peering vs Shared VPC in GCP?
**In Simple Words:**
- **VPC Peering**: Connects two independent VPC networks (even across different organizations) to exchange traffic privately with 0 egress bandwidth cost. Does **not support transitive routing**.
- **Shared VPC**: Connects projects within the same organization. A central **Host Project** owns the VPC and subnets; multiple **Service Projects** attach their VMs to the host subnets. Centralizes networking governance while delegating app development.

### 15. How does Cloud Run achieve Zero-to-One Scale and Concurrency?
**In Simple Words:**
- **Scale to Zero**: If no HTTP requests arrive, Cloud Run deallocates all container instances, dropping hosting costs to $0.
- **Cold Starts**: Optimized to spin up new container instances in under 1 second.
- **Concurrency (Default 80)**: Unlike AWS Lambda (which handles strictly 1 request per concurrent instance), a single Cloud Run container instance can process up to **1,000 concurrent requests** simultaneously, slashing compute costs.

### 16. What is Cloud KMS and how does Customer-Managed Encryption Keys (CMEK) work?
**In Simple Words:**
All GCP data is encrypted at rest by default using Google-managed keys:
- **CMEK (Customer-Managed Encryption Keys)**: Enterprise compliance requires customers to control the encryption keys used to encrypt GCS buckets, BigQuery tables, or Spanner databases.
- Managed inside **Cloud Key Management Service (KMS)** or Cloud HSM (Hardware Security Module with FIPS 140-2 Level 3 certification). Revoking the key renders all data instantly unreadable.

### 17. What are Cloud Armor and Google Cloud's DDoS mitigation capabilities?
**In Simple Words:**
Cloud Armor provides Enterprise Web Application Firewall (WAF) and DDoS defense at Google's network edge:
- Built on top of the same infrastructure protecting Google Search and YouTube.
- Inspects Layer 7 HTTP/HTTPS traffic at the global edge before it reaches your backend VMs or Cloud Run containers.
- Protects against OWASP Top 10 vulnerabilities (SQL injection, XSS), geo-blocks IPs, and limits request rates.

### 18. What is Cloud NAT (Network Address Translation) and Private Google Access?
**In Simple Words:**
- **Private Google Access**: Allows Compute Engine VMs with **only private internal IPs** (no public IP) to access Google APIs and Cloud Storage over internal Google network routing.
- **Cloud NAT**: Allows private VMs without public IPs to initiate outbound connections to the public internet (for OS security updates, package downloads) while blocking inbound connections from the internet.

### 19. How does BigQuery Slot Allocation work (On-demand vs Reservations)?
**In Simple Words:**
- **On-Demand**: Free tier gives access to up to 2,000 shared burstable slots. You pay **$6.25 per TB of data scanned** by queries.
- **Capacity (Editions: Standard, Enterprise, Enterprise Plus)**: You purchase dedicated baseline Slots (virtual CPUs) per hour with auto-scaling slot pools. Queries cost $0 per TB scanned; best for predictable multi-terabyte enterprise BI pipelines.

### 20. What is Google Cloud Operations Suite (formerly Stackdriver)?
**In Simple Words:**
Google's native observability platform comprising:
- **Cloud Logging**: Collects, filters, and analyzes log entries with structured JSON querying and automated log routing sinks to BigQuery or Pub/Sub.
- **Cloud Monitoring**: Collects system and custom metrics, renders dashboards, and triggers alerts to PagerDuty/Slack.
- **Cloud Trace & Profiler**: Distributed tracing (compatible with OpenTelemetry) and continuous CPU/memory production code profiling.

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. What is VPC Service Controls (VPC-SC) and how does it prevent Data Exfiltration?
**In Simple Words:**
Traditional IAM protects *identities*, but does not stop an insider with valid credentials from copying sensitive data to an unauthorized personal cloud bucket:
- **VPC Service Controls**: Establishes a cryptographic security perimeter around GCP resources (BigQuery, GCS, Spanner).
- Data **cannot cross the perimeter boundary**, even with valid administrative IAM permissions!
- Inbound and outbound perimeter bridges require explicit ingress/egress authorization rules.

### 22. What is Google Cloud Interconnect (Dedicated vs Partner) vs Cloud VPN?
**In Simple Words:**
Options for connecting on-premises enterprise data centers to GCP:
1. **Cloud VPN**: IPsec tunnels over the public internet (up to 3 Gbps per tunnel). Cost-effective, but vulnerable to internet latency fluctuations.
2. **Dedicated Interconnect**: Direct physical 10 Gbps or 100 Gbps fiber circuit connected to a Google Colocation facility. 99.99% availability SLA.
3. **Partner Interconnect**: Physical connection routed through an authorized enterprise telecom provider (e.g. Equinix, AT&T).

### 23. How do you design multi-region Disaster Recovery (Active-Active vs Active-Passive) on GCP?
**In Simple Words:**
- **Global Anycast Load Balancer**: Serves as the single frontend entry point routing users to the nearest healthy region.
- **Active-Active with Cloud Spanner**: Spanner replicates writes across multi-region configurations (e.g. `nam-eur-asia1`) with zero downtime if an entire continent goes offline.
- **Active-Passive with Cloud SQL**: Primary instance in Region A with cross-region read replica in Region B; automated health probe triggers regional promotion during disaster events.

### 24. How does GKE multi-tenancy work (Namespace isolation, NetworkPolicies, and GKE Workload Identity)?
**In Simple Words:**
1. **Namespaces**: Logical separation of resources per tenant.
2. **NetworkPolicies (Calico / Datapath v2 - eBPF)**: Restricts east-west pod traffic so pods in `tenant-a` cannot communicate with pods in `tenant-b`.
3. **GKE Workload Identity**: Maps a Kubernetes ServiceAccount (KSA) directly to a Google Cloud IAM ServiceAccount (GSA), ensuring Pod A cannot access resources owned by Pod B.
4. **ResourceQuotas & LimitRanges**: Caps CPU/RAM consumption per tenant.

### 25. What is the Jupiter Data Center Fabric and how does it enable Bps-scale BigQuery shuffles?
**In Simple Words:**
Jupiter is Google's custom software-defined data center network topology:
- Delivers over **1 Petabit per second** of bisection bandwidth using Clos topologies.
- Allows any server in a Google data center to communicate with any other server at full line rate with zero oversubscription.
- This underlying physical network enables BigQuery to sort and shuffle petabytes of data across thousands of worker nodes in seconds.

### 26. How do you implement Zero-Trust BeyondCorp Enterprise access on GCP?
**In Simple Words:**
BeyondCorp eliminates the traditional VPN perimeter by shifting access controls to the application layer:
- **Identity-Aware Proxy (IAP)**: Verifies user identity (via Google Workspace / Okta) and device posture (disk encryption, OS version, location) before allowing access to internal web apps or SSH/RDP sessions without public IPs.

### 27. What is Anthos / Google Distributed Cloud (GDC)?
**In Simple Words:**
Anthos is Google's hybrid and multi-cloud application management platform:
- Runs unified GKE clusters across on-premises bare-metal servers, AWS, and Azure.
- Enables central management of configuration, security policies, and service meshes across hybrid clouds from a single Google Cloud console pane.

### 28. How does Cloud Spanner handle schema migrations online with zero downtime?
**In Simple Words:**
Spanner executes DDL schema updates as long-running, asynchronous background transactions:
- When adding a column or secondary index, Spanner introduces multiple intermediate phases: `ABSENT` -> `WRITE_ONLY` -> `READ_ONLY`.
- Existing live OLTP transactions continue processing without table locks or read degradation while the index builds across petabytes of historical splits.

### 29. What are Organization Policies and Hierarchical Firewall Rules?
**In Simple Words:**
- **Organization Policies**: Centralized constraints enforced enterprise-wide (e.g. `constraints/compute.vmExternalIpAccess` disables public IPs on all VMs across all projects; `constraints/gcp.resourceLocations` forces data storage strictly inside the European Union for GDPR compliance).
- **Hierarchical Firewalls**: Firewall rules defined at the Org or Folder level that apply to all VPCs beneath them, preventing project administrators from disabling corporate security rules.

### 30. How do you optimize BigQuery Costs for multi-petabyte datasets?
**In Simple Words:**
1. Avoid `SELECT *`; only query explicit columns (BigQuery charges strictly per byte of columns scanned).
2. Enforce `require_partition_filter = true` on partitioned tables to prevent accidental full-table scans.
3. Use **Clustered Tables** to reduce the volume of data scanned by filter predicates.
4. Inspect query cost estimates with `--dry_run` before executing expensive exploratory SQL.
5. Set maximum bytes billed per query limit (`maximum_bytes_billed`).

### 31. What is Dataproc and how does it compare to managing Apache Spark on GKE?
**In Simple Words:**
- **Cloud Dataproc**: Managed Apache Hadoop and Apache Spark service. Spins up clusters in ~90 seconds and supports preemptible/spot VMs to cut processing costs by 80%.
- **Spark on GKE**: Uses the open-source Spark-on-K8s Operator. Best when organizations standardize all compute workloads on Kubernetes and share node pools between web apps and data jobs.

### 32. How does Cloud Run with Direct VPC Egress work?
**In Simple Words:**
Traditionally, serverless containers required a Serverless VPC Access connector VM to communicate with private resources:
- **Direct VPC Egress**: Routes traffic from Cloud Run container instances directly into your VPC network subnets without intermediary connector VMs.
- Lowers network latency, increases maximum throughput, and eliminates the hourly cost of connector VM instances.

### 33. What is Cloud Deploy and how does it orchestrate GKE / Cloud Run release pipelines?
**In Simple Words:**
Cloud Deploy is Google's opinionated, serverless delivery service:
- Defines multi-target promotion pipelines (e.g. `dev` -> `staging` -> `prod`).
- Uses Skaffold for declarative render and deploy steps.
- Features one-click rollbacks, deployment approval gates, and audit logging.

### 34. How does GCP Cloud Armor ML-based Adaptive Protection work?
**In Simple Words:**
Adaptive Protection uses machine learning models trained on baseline application traffic patterns:
- Automatically detects Layer 7 anomalous traffic surges and application-layer DDoS attacks.
- Generates tailored, real-time WAF mitigation rules with one-click deployment to block attack signatures without disrupting legitimate user traffic.

### 35. When should you choose Google Cloud Platform over AWS or Azure?
**In Simple Words:**
1. **Big Data & Real-Time Analytics**: BigQuery and Cloud Pub/Sub provide an unmatched serverless analytics ecosystem.
2. **Global Network Performance**: GCP's Anycast IP global network provides lower latency and simpler multi-region networking than AWS.
3. **Advanced AI & ML**: Native access to Google Tensor Processing Units (TPUs), Vertex AI, and Gemini models.
4. **Container Innovation**: The creators of Kubernetes offer the most mature managed Kubernetes experience with GKE Autopilot.
`;
