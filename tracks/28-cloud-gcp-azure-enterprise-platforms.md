# Multi-Cloud Architecture: Google Cloud Platform (GCP) & Microsoft Azure Master Interview Question Bank (1 - 50)

> Comprehensive, production-grade interview questions covering Google Cloud Platform (BigQuery, GKE, Cloud Run, Cloud Pub/Sub, Cloud Spanner, GCP IAM), Microsoft Azure (AKS, Azure Functions, Cosmos DB, Azure DevOps, Microsoft Entra ID), and Enterprise Multi-Cloud Governance.

---

## Part 1: Google Cloud Platform (GCP) Enterprise Architecture (1 - 25)

### 1. GCP Resource Hierarchy: Organization, Folders, Projects, and IAM Inheritance.
**In Simple Words:**
GCP organizes resources in a strict tree hierarchy:
`Organization -> Folders -> Projects -> Resources`
- **Project**: The fundamental unit of isolation; billing, APIs, and permissions are attached at the Project level.
- **IAM Inheritance**: Permissions flow downwards. An IAM policy assigned at the Organization or Folder level is automatically inherited by all child projects and cannot be overridden to restrict access at lower levels.

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
- Uses Google's proprietary **TrueTime API**, synchronized by atomic clocks and GPS receivers across Google datacenters.
- Guarantees bounded clock uncertainty ($epsilon approx 1–7$ms), allowing Spanner to order distributed transactions globally without distributed locks!

---

## Part 2: Microsoft Azure Enterprise Architecture (26 - 50)

### 5. Microsoft Entra ID (formerly Azure Active Directory) vs. Traditional On-Premise Active Directory.
**In Simple Words:**
- **On-Prem Active Directory (AD)**: Built on Kerberos, NTLM, and LDAP protocols. Flat hierarchy designed for corporate LAN domains.
- **Microsoft Entra ID**: Cloud identity and access management solution built on modern internet web protocols (**OAuth 2.0, OpenID Connect, SAML 2.0, and SCIM**). Provides Single Sign-On (SSO), Multi-Factor Authentication (MFA), and Conditional Access Policies across thousands of cloud SaaS apps.

### 6. Azure Cosmos DB: Multi-Model Architecture and the 5 Consistency Levels.
**In Simple Words:**
Cosmos DB is Microsoft's globally distributed, multi-model NoSQL database. Rather than forcing a binary choice between Strong and Eventual consistency, Cosmos DB offers **5 distinct consistency levels**:
1. **Strong**: Linearizable reads (reads guaranteed to see the latest write).
2. **Bounded Staleness**: Reads lag behind writes by at most $K$ versions or $T$ time.
3. **Session (Default, used by 95% of apps)**: Monotonic reads/writes within a single user session ("read your own writes").
4. **Consistent Prefix**: Updates never seen out of order.
5. **Eventual**: Lowest latency, highest availability.

### 7. Multi-Cloud Architecture: When is Multi-Cloud an Anti-Pattern vs. a Business Necessity?
**In Simple Words:**
- **When it's an Anti-Pattern**: Trying to make code 100% portable across AWS, GCP, and Azure forces using the "lowest common denominator" (running raw VMs instead of managed BigQuery or DynamoDB), drastically multiplying operational complexity and hiring costs.
- **When it's Justified**:
  1. Regulatory compliance / data sovereignty (e.g. EU banking mandates requiring multi-cloud disaster recovery).
  2. Best-of-breed specialization: Hosting core apps on AWS, but routing analytics to Google BigQuery and enterprise auth to Microsoft Entra ID.
