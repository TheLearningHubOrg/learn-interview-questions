# Google Cloud Platform (GCP) Master Interview Bank (1 - 9)

> Google Kubernetes Engine (GKE), Cloud Run, BigQuery, Pub/Sub, Cloud Spanner, Cloud SQL, VPC Service Controls, and Google Cloud IAM.

---

### 1. GCP Resource Hierarchy: Organization, Folders, Projects, and IAM Inheritance.
**In Simple Words:**
GCP organi

### 2. Google Kubernetes Engine (GKE) Standard vs. GKE Autopilot.
**In Simple Words:**
- **GKE Standard**: You manage worker node pools, machine types, OS patching, and scaling. Full control over node configurations, daemonsets, and privileged containers.
- **GKE Autopilot**: Google manages and provisions the entire infrastructure (both control plane and worker nodes). You pay per Pod resource request (vCPU, memory) rather than idle node capacity. Enforces Kubernetes security best practices out of the box.

### 3. Serverless on GCP: Cloud Run vs. Cloud Functions.
**In Simple Words:**
- **Cloud Run**: Fully managed compute platform running any arbitrary **Docker container** listening on an HTTP port. Scales from 0 to thousands of instances in seconds, supports any programming language, and handles up to 250 concurrent requests per container instance.
- **Cloud Functions (2nd Gen)**: Event-driven serverless functions built on top of Cloud Run, best for simple webhooks and reactive event triggers (Cloud Storage uploads, Pub/Sub messages).

### 4. Cloud Spanner: How does TrueTime enable Globally Distributed ACID Transactions?
**In Simple Words:**
Traditional relational databases struggle to scale globally without sacrificing consistency.
**Google Cloud Spanner**:
- The world's first globally distributed database providing both **External Consistency** and **High Availability**.
- Uses Google's proprietary **TrueTime API**, synchroni

### 5. Google Kubernetes Engine (GKE) Autopilot vs. Standard Mode.
**In Simple Words:**
- **GKE Standard**: You manage worker node pools, OS patching, machine types, and autoscaling. You pay for underlying Compute Engine VMs regardless of pod resource utilization.
- **GKE Autopilot**: Google manages the entire cluster infrastructure, worker nodes, and security hardening. You pay only for CPU, memory, and storage requested by running Pods. Includes automatic horizontal pod autoscaling and node optimization.

### 6. Google Cloud Run vs. AWS Lambda / ECS Fargate.
**In Simple Words:**
Cloud Run is a fully managed serverless container runtime:
- Packages any language, runtime, or binary into a standard OCI container listening on `$PORT`.
- Scales from **0 to 1,000+ instances** in seconds based on incoming HTTP request concurrency.
- Unlike AWS Lambda (1 request per execution environment), Cloud Run supports **concurrency (up to 250 requests per container instance)**, drastically reducing cold starts and operational costs.

### 7. Google Cloud Spanner: TrueTime API and Externally Consistent Transactions.
**In Simple Words:**
Cloud Spanner is a globally distributed NewSQL relational database combining ACID consistency with horizontal scalability:
- **TrueTime API**: Uses synchronized GPS receivers and atomic clocks across Google data centers to bound clock drift uncertainty ($\epsilon \le 7\text{ms}$).
- Enables global serializable transactions and lock-free read transactions without cross-region consensus bottlenecks.

### 8. Google Cloud BigQuery Architecture: Capacitor, Dremel, and Jupiter Network.
**In Simple Words:**
BigQuery separates storage and compute:
1. **Dremel Compute Engine**: Multi-tenant execution clusters using dynamic Slot allocations to execute parallel SQL tree aggregations.
2. **Capacitor Columnar Storage**: Highly compressed columnar format stored in Colossus (Google distributed file system).
3. **Jupiter Petabit Network**: 1 Petabit/sec bisection bandwidth connecting storage to compute, allowing queries to scan Terabytes of data in seconds.

### 9. GCP VPC Service Controls (VPC-SC) and Identity-Aware Proxy (IAP).
**In Simple Words:**
- **VPC-SC**: Creates security perimeters around Google Cloud managed services (Storage buckets, BigQuery, Pub/Sub) preventing data exfiltration, even by compromised admin IAM credentials.
- **Identity-Aware Proxy (IAP)**: Zero-trust network access (ZTNA) model. Controls access to web applications and VMs based on user identity and context (device health, location) without needing a legacy VPN.

