# Full-Stack & Cloud Architecture AWS Master Interview Question Bank: Well-Architected, Serverless, Containers & Security (1 - 65)

> Comprehensive, production-level technical interview questions and deep-dive answers covering AWS Cloud Architecture, VPC Networking, Multi-Tier Subnets, Route 53, EC2/Fargate/Lambda, S3 storage tiers, Aurora, DynamoDB single-table design, IAM evaluation logic, KMS envelope encryption, SQS/SNS/EventBridge, and FinOps cost optimization.

---

## Table of Contents
- [Part 1: Intro, Architecture & Well-Architected Framework (1 - 5)](#part-1-intro-architecture--well-architected-framework-1---5)
- [Part 2: Networking, VPC & Traffic Routing (6 - 20)](#part-2-networking-vpc--traffic-routing-6---20)
- [Part 3: Compute, Containers & Serverless (21 - 35)](#part-3-compute-containers--serverless-21---35)
- [Part 4: Storage, Content Delivery & Databases (36 - 50)](#part-4-storage-content-delivery--databases-36---50)
- [Part 5: Security, IAM, Messaging & Enterprise Deployments (51 - 65)](#part-5-security-iam-messaging--enterprise-deployments-51---65)

---

## Part 1: Intro, Architecture & Well-Architected Framework (1 - 5)

### 1. Give a candid walkthrough of your hands-on experience designing, provisioning, and deploying production workloads on AWS.
**Answer:**
"I am a Senior Cloud & Full-Stack Architect with deep hands-on experience designing resilient, multi-region architectures on AWS. I provision immutable infrastructure using Terraform and AWS CDK, designing secure VPC topologies across multiple Availability Zones. My workloads span containerized microservices running on **ECS Fargate** and **EKS**, event-driven serverless pipelines built with **AWS Lambda**, **SQS**, and **EventBridge**, and relational databases on **Amazon Aurora PostgreSQL** paired with DynamoDB and ElastiCache Redis. I focus heavily on security, least-privilege IAM roles, envelope encryption via KMS, and continuous FinOps cost governance."

### 2. What are the 6 Pillars of the AWS Well-Architected Framework, and how do you evaluate architectural trade-offs against them?
**Answer:**
1. **Operational Excellence**: Running and monitoring systems via automation, Infrastructure as Code, and continuous improvement.
2. **Security**: Protecting data, systems, and assets via Defense-in-Depth, least privilege IAM, and encryption at rest/in transit.
3. **Reliability**: Recovering dynamically from failures, multi-AZ high availability, and automated failover.
4. **Performance Efficiency**: Using the right compute, storage, and database resources for the workload; adopting serverless and modern Graviton processors.
5. **Cost Optimization**: Eliminating unneeded resources, leveraging Spot and Savings Plans, and monitoring FinOps metrics.
6. **Sustainability**: Minimizing the environmental and carbon footprint of cloud workloads.
*Trade-off Example*: Balancing Cost vs Reliability by choosing Multi-AZ synchronous replication for core transactional databases while keeping ephemeral test environments Single-AZ.

### 3. Describe a severe production outage or bottleneck you resolved on AWS.
**Answer:**
"During a high-concurrency product launch, our serverless API Gateway + Lambda service encountered massive 500 error spikes.
**Root Cause**:
1. Lambda concurrency hit our regional account quota (1,000 concurrent executions), causing incoming invocations to be throttled.
2. Lambda instances placed inside a legacy VPC without VPC Endpoints were attempting to connect to DynamoDB and S3 through a saturated single NAT Gateway, causing connection timeouts and cold start latency spikes up to 8 seconds.
**Resolution**:
1. Requested an immediate Lambda concurrency quota increase and allocated **Provisioned Concurrency** for critical checkout functions.
2. Configured **S3 and DynamoDB Gateway Endpoints** inside the VPC, bypassing the NAT Gateway and routing AWS service traffic directly through the AWS private network backbone at zero data transfer cost."

### 4. How do you decide between deploying an application on EC2, ECS (Fargate), EKS, or serverless Lambda?
**Answer:**
- **AWS Lambda**: Best for unpredictable, bursty, or event-driven workloads (file uploads, webhooks, scheduled cron jobs, lightweight APIs) where scaling to zero saves cost.
- **ECS (Fargate)**: Best for standard containerized web apps and APIs that run continuously. Serverless containers without EC2 server management overhead.
- **Amazon EKS**: Best for large-scale enterprise microservices requiring complex service meshes (Istio), multi-cloud portability, or integration with open-source Kubernetes tooling.
- **Amazon EC2**: Used when legacy OS access, custom kernel extensions, high-performance computing (HPC), or specialized GPU architectures are mandatory.

### 5. How do you approach AWS cost monitoring and FinOps optimization?
**Answer:**
- **Cost Allocation Tags**: Enforce mandatory tags (`Environment`, `Team`, `Project`, `CostCenter`) across all resources via AWS Organizations SCPs.
- **Compute Savings Plans**: Commit to consistent compute usage across Lambda, Fargate, and EC2 for up to 66% discounts.
- **Graviton Migration**: Migrate EC2 instances, RDS databases, and Lambda functions from x86 to AWS Graviton (ARM64) for ~20-40% price-performance gain.
- **S3 Lifecycle Policies**: Transition objects automatically to Intelligent-Tiering or Glacier Deep Archive.

---

## Part 2: Networking, VPC & Traffic Routing (6 - 20)

### 6. Design a secure VPC for a 3-tier web application (Web, App, Database).
**Answer:**
Spans at least 2 Availability Zones for high availability:
- **Public Subnet**: Internet Gateway (IGW) attached. Hosts Public Application Load Balancers (ALB) and NAT Gateways.
- **Private Subnet (Application Tier)**: Hosts backend microservices (ECS tasks / EC2). Outbound internet access routed through NAT Gateway in public subnet. No inbound public internet ingress.
- **Isolated Private Subnet (Database Tier)**: Hosts RDS/Aurora databases. Route table has **no internet route** (neither IGW nor NAT Gateway). Accessible only from Application Tier security group on database port (5432).

### 7. How many IP addresses does AWS reserve in each subnet CIDR block?
**Answer:**
AWS reserves **5 IP addresses** in every subnet:
1. `x.x.x.0`: Network address.
2. `x.x.x.1`: Reserved by AWS for VPC router.
3. `x.x.x.2`: Reserved by AWS for DNS server (AmazonProvidedDNS).
4. `x.x.x.3`: Reserved by AWS for future use.
5. `x.x.x.255`: Network broadcast address (VPC does not support broadcast).

### 8. Security Groups (stateful) vs Network ACLs (stateless).
**Answer:**
- **Security Group (Stateful)**: Acts at instance/ENI level. If inbound traffic is allowed, outbound return traffic is automatically permitted regardless of outbound rules. Supports referencing other Security Groups.
- **Network ACL (Stateless)**: Acts at subnet boundary level. Evaluates inbound and outbound rules independently in numbered order. Return traffic must be explicitly allowed via ephemeral ports (1024-65535).

### 9. Internet Gateway vs NAT Gateway vs NAT Instance.
**Answer:**
- **Internet Gateway (IGW)**: Horizontally scaled, redundant VPC component enabling two-way public internet communication for public subnets.
- **NAT Gateway**: Managed AWS service placed in a **public subnet** allowing private subnet instances to initiate outbound internet traffic (e.g., software updates) while preventing external internet entities from initiating inbound connections.
- **NAT Instance**: Legacy self-managed EC2 instance running NAT software; requires manual patching and scaling.

### 10. VPC Peering vs AWS Transit Gateway vs PrivateLink.
**Answer:**
- **VPC Peering**: Direct 1-to-1 connection between two VPCs. No transitive routing (A <-> B and B <-> C does not mean A <-> C).
- **AWS Transit Gateway**: Centralized hub-and-spoke router connecting hundreds of VPCs and on-premises networks with transitive routing.
- **AWS PrivateLink**: Exposes specific services privately to other VPCs using Interface VPC Endpoints without opening network routes between VPCs.

### 11. ALB vs NLB vs GWLB.
**Answer:**
- **Application Load Balancer (ALB)**: Layer 7 (HTTP/HTTPS/gRPC). Path-based routing, host-based routing, SSL termination, WebSockets.
- **Network Load Balancer (NLB)**: Layer 4 (TCP/UDP/TLS). Ultra-high throughput, handles millions of requests/sec with ultra-low latency, provides static Elastic IPs.
- **Gateway Load Balancer (GWLB)**: Deploys and scales third-party virtual network appliances (firewalls, IDS/IPS).

### 12. ALB target health checks and Connection Draining (Deregistration Delay).
**Answer:**
During scaling in or rolling deployments, connection draining keeps active in-flight requests alive for a configured duration (e.g., 300 seconds) while stopping new requests from routing to the de-registering instance, guaranteeing zero dropped HTTP requests.

### 13. Elastic IP (EIP) vs Standard Public IP.
**Answer:**
A standard public IP allocated by AWS is released back to the AWS pool when an EC2 instance is stopped and restarted, assigning a new IP. An **Elastic IP** is a static IPv4 address permanently allocated to an account that remains unchanged across reboots.

### 14. VPC Flow Logs analysis.
**Answer:**
Captures IP traffic going to and from network interfaces in a VPC. Streamed to CloudWatch Logs or S3 and queried with Athena to identify port scanning, unauthorized connection attempts (REJECT), and asymmetric routing bottlenecks.

### 15. VPC Endpoints: Gateway vs Interface Endpoints.
**Answer:**
- **Gateway Endpoints**: Targets in route tables for **Amazon S3** and **DynamoDB**. Free of charge; route private subnet traffic directly to AWS services.
- **Interface Endpoints (PrivateLink)**: Provisions Elastic Network Interfaces (ENIs) with private IPs inside subnets for other AWS services (SQS, SNS, Secrets Manager). Incurs hourly and data processing charges.

### 16. Amazon Route 53 Routing Policies.
**Answer:**
- **Simple**: Standard DNS mapping to single/multiple resources.
- **Weighted**: Distributes traffic by percentages (e.g., 90% prod, 10% canary).
- **Latency-based**: Routes users to the AWS region offering lowest latency.
- **Failover**: Active-Passive disaster recovery via health checks.
- **Geolocation**: Routes based on user geographic location (continent, country).
- **Multi-Value Answer**: Returns up to 8 healthy IP records with DNS health checks.

### 17. Route 53 Alias Record vs CNAME Record.
**Answer:**
- **CNAME**: Standard DNS alias pointing one hostname to another. **Cannot** be created at the zone apex (`example.com`).
- **Alias Record**: Route 53-specific extension that can point the zone apex (`example.com`) directly to AWS resources (ALBs, CloudFront distributions, S3 buckets) with free internal DNS lookups.

### 18. Site-to-Site VPN vs AWS Direct Connect (DX).
**Answer:**
- **Site-to-Site VPN**: Encrypted IPsec tunnel over the public internet. Fast to establish, cost-effective, but subject to internet variability.
- **Direct Connect**: Dedicated private physical fiber optic connection from corporate datacenter to AWS. Consistent throughput, ultra-low latency, and high security.

### 19. AWS Global Accelerator vs CloudFront.
**Answer:**
- **CloudFront**: Content Delivery Network (CDN) caching static and dynamic HTTP content at 450+ Edge Locations.
- **Global Accelerator**: Anycast IP routing over AWS private fiber backbone for both HTTP and non-HTTP protocols (TCP/UDP, gaming, VoIP), bypassing public internet hops without content caching.

### 20. Egress-Only Internet Gateway.
**Answer:**
Provides IPv6 instances in private subnets with outbound internet access while blocking all inbound IPv6 connections initiated from the outside internet (IPv6 equivalent of a NAT Gateway).

---

## Part 3: Compute, Containers & Serverless (21 - 35)

### 21. EC2 Instance Families & Graviton.
**Answer:**
- **General Purpose (M, T)**: Balanced compute, memory, and networking.
- **Compute Optimized (C)**: High compute-to-memory ratio (batch processing, video encoding).
- **Memory Optimized (R, X)**: In-memory caches, large relational databases.
- **Storage Optimized (I, D)**: High sequential read/write NVMe storage (data warehouses).
- **AWS Graviton**: ARM-based custom silicon offering up to 40% better price-performance than x86.

### 22. EC2 Pricing Models comparison.
**Answer:**
- **On-Demand**: Pay by the second with zero commitment. Highest cost.
- **Savings Plans / Reserved Instances**: 1- or 3-year commitment for predictable workloads; discounts up to 72%.
- **Spot Instances**: Spare AWS capacity with up to 90% discount. AWS can reclaim instances with a 2-minute warning. Ideal for stateless, fault-tolerant batch workloads.

### 23. EC2 Placement Groups: Cluster vs Spread vs Partition.
**Answer:**
- **Cluster**: Packs instances close together inside a single AZ for ultra-low latency, high-throughput network performance.
- **Spread**: Places each instance on distinct physical hardware racks to minimize correlated hardware failures (critical small clusters).
- **Partition**: Divides instances across logical partitions that do not share underlying hardware (ideal for Hadoop, Kafka, Cassandra).

### 24. EBS-backed vs Instance Store-backed instances.
**Answer:**
- **EBS (Elastic Block Store)**: Network-attached persistent block storage. Survives instance stopping and rebooting; supports snapshots.
- **Instance Store (Ephemeral)**: Physically attached NVMe drives on the host server. Highest I/O performance, but data is permanently lost when the instance is stopped or hardware fails.

### 25. EC2 Auto Scaling Policies.
**Answer:**
- **Target Tracking**: Maintains a specific metric (e.g., keep average CPU at 60%).
- **Step Scaling**: Scales in steps based on alarm breach magnitude (e.g., +20% if CPU > 70%, +40% if CPU > 85%).
- **Scheduled Scaling**: Scales based on predictable predictable calendar surges (e.g., scale up at 9 AM Monday).

### 26. AWS Lambda Execution Model & Firecracker.
**Answer:**
Lambda runs code in isolated microVMs powered by **Firecracker** (open-source Rust virtualization).
**Lifecycle Phases**:
1. **Init**: Downloads code/layer, starts runtime, runs initialization code outside the handler function.
2. **Invoke**: Executes the handler function with the event payload.
3. **Shutdown**: Reaps the execution environment if inactive.

### 27. Lambda Cold Starts & Mitigation Strategies.
**Answer:**
Occurs during the Init phase when AWS provisions a new microVM.
**Mitigations**:
1. **Provisioned Concurrency**: Keeps initialized execution environments warm and ready for instant invocation.
2. Minimize package and dependency size using tree-shaking and esbuild.
3. Keep initialization logic lean; reuse database connection pools across invokes by defining clients outside the handler.

### 28. Lambda Hard Resource Limits.
**Answer:**
- Max Memory: 10,240 MB (10 GB).
- Max Execution Timeout: 900 seconds (15 minutes).
- Ephemeral `/tmp` Storage: 512 MB to 10,240 MB.
- Synchronous Request Payload: 6 MB; Asynchronous: 256 KB.

### 29. Lambda Event Source Mapping (ESM).
**Answer:**
An internal AWS polling mechanism that reads records from streaming or queue services (SQS, Kinesis, DynamoDB Streams), batches them, and invokes the Lambda function with the batch payload.

### 30. Lambda in VPC without cold start penalty (Hyperplane ENIs).
**Answer:**
AWS utilizes **AWS Hyperplane** (shared network virtualization technology). Lambda environments connect to shared Hyperplane ENIs pre-provisioned at VPC creation time, eliminating the multi-second ENI attachment latency of legacy Lambda setups.

### 31. ECS vs EKS: Operational trade-offs.
**Answer:**
- **Amazon ECS**: AWS-native, deeply integrated with IAM, CloudWatch, ALB. Minimal operational complexity, zero control-plane cost.
- **Amazon EKS**: Kubernetes standard. Higher operational overhead and control-plane management, but provides portability across hybrid clouds and access to the rich Kubernetes ecosystem (Helm, ArgoCD).

### 32. AWS Fargate trade-offs.
**Answer:**
- **Pros**: Serverless container execution; eliminates OS patching, EC2 instance sizing, and cluster capacity management.
- **Cons**: Slightly higher compute cost per vCPU/RAM hour compared to reserved EC2 instances; does not support privileged Docker containers.

### 33. Amazon ECR container security.
**Answer:**
Provides image immutability (preventing image tag overwriting), automated vulnerability scanning (Basic via Clair, Enhanced via AWS Inspector), and cross-region replication for global deployments.

### 34. AWS App Runner.
**Answer:**
A fully managed service that takes source code or a container image and automatically builds, deploys, load balances, and auto-scales containerized web applications without requiring VPC or ECS configuration.

### 35. AWS Step Functions: Standard vs Express Workflows.
**Answer:**
- **Standard Workflows**: For long-running orchestration (up to 1 year); exactly-once execution; full execution history persisted.
- **Express Workflows**: High-volume, short-duration event processing (up to 5 minutes); at-least-once execution; handles 100,000+ executions/sec at lower cost.

---

## Part 4: Storage, Content Delivery & Databases (36 - 50)

### 36. S3 vs EBS vs EFS.
**Answer:**
- **Amazon S3 (Object)**: Accessible via REST API globally. Unlimited scaling, ideal for images, videos, backups, big data lakes.
- **Amazon EBS (Block)**: Network block storage attached to a single EC2 instance within an AZ (virtual hard drive).
- **Amazon EFS (File)**: Shared POSIX file system concurrently mountable across thousands of EC2 instances and Lambda functions across multiple AZs.

### 37. S3 Storage Classes and Lifecycle Rules.
**Answer:**
- **Standard**: Frequently accessed data, millisecond retrieval.
- **Intelligent-Tiering**: Automatically shifts objects between access tiers based on usage patterns with zero retrieval fees.
- **Standard-IA**: Infrequently accessed; lower storage cost, retrieval fee applies.
- **Glacier Flexible / Deep Archive**: Archival storage; retrieval times from minutes to 12 hours; lowest cost.

### 38. How S3 achieves 99.999999999% (11 9s) durability.
**Answer:**
S3 redundantly stores data across multiple physically separated Availability Zones (minimum 3 AZs) within an AWS Region, continuously checking checksums and self-healing damaged data blocks automatically.

### 39. S3 Security Mechanisms.
**Answer:**
1. **S3 Block Public Access**: Account-level and bucket-level centralized kill-switch.
2. **Bucket Policies**: Resource-based JSON policies controlling actions by principal.
3. **IAM Policies**: Identity-based permissions attached to users and roles.
4. **Access Control Lists (ACLs)**: Legacy mechanism (recommended to be disabled via Object Ownership).

### 40. S3 Multipart Upload.
**Answer:**
Uploads large files in parallel chunks (parts). Mandatory for single objects > 5 GB (recommended for > 100 MB). If a network failure occurs, only failed parts need to be retried rather than restarting the entire multi-gigabyte upload.

### 41. S3 Versioning, Object Lock, and MFA Delete.
**Answer:**
- **Versioning**: Preserves every version of an object; deletions insert a delete marker.
- **Object Lock**: Implements WORM (Write Once, Read Many). Compliance Mode prevents deletion by any user, including the root account.
- **MFA Delete**: Enforces multi-factor authentication token for permanent version deletions.

### 42. CloudFront Edge Locations & Regional Edge Caches.
**Answer:**
- **Edge Locations**: 450+ global points of presence that cache static content close to end users.
- **Regional Edge Caches**: Mid-tier caching layer positioned between Edge Locations and origin servers to prevent cache misses from overwhelming backend origins.

### 43. CloudFront Signed URLs vs Signed Cookies.
**Answer:**
- **Signed URLs**: Grants temporary access to a single specific file (e.g., video download link).
- **Signed Cookies**: Grants access to multiple files or a complete directory without altering URLs (e.g., streaming HLS video chunks to authenticated users).

### 44. CloudFront Functions vs Lambda@Edge.
**Answer:**
- **CloudFront Functions**: Lightweight JavaScript executed at Edge Locations; sub-millisecond execution; no network access; ideal for URL rewrites, header manipulation, and redirect logic.
- **Lambda@Edge**: Full Node.js/Python runtime running at Regional Edge Caches; network access allowed; ideal for heavy auth verification and server-side rendering at the edge.

### 45. Amazon RDS: Multi-AZ vs Read Replicas.
**Answer:**
- **Multi-AZ Deployment**: Synchronous replication to a standby instance in a second AZ. Dedicated to **High Availability & Disaster Recovery**; standby cannot accept read queries; automatic failover in < 60s.
- **Read Replica**: Asynchronous replication dedicated to **Read Scaling**. Can be queried directly; can be promoted to standalone master.

### 46. Amazon Aurora Architecture.
**Answer:**
Aurora separates compute from storage:
- Storage engine is distributed across 3 AZs with **6-way replication**.
- Writes are acknowledged when 4 of 6 nodes commit.
- Delivers up to 5x throughput of standard MySQL and 3x of standard PostgreSQL.

### 47. Aurora Serverless v2.
**Answer:**
Scales compute capacity dynamically in fractions of an Aurora Capacity Unit (ACU) within milliseconds in response to real-time workload fluctuations, without database restarts or connection drops.

### 48. DynamoDB Single-Table Design.
**Answer:**
Consolidates multiple entity types into a single table using generic `PK` (Partition Key) and `SK` (Sort Key) attributes (e.g., `PK=USER#101`, `SK=ORDER#2024`). Satisfies multiple distinct access patterns in a single query via partition overloading.

### 49. DynamoDB GSI vs LSI.
**Answer:**
- **LSI**: Shares table's Partition Key, different Sort Key. Max 10GB per partition; must be defined at creation.
- **GSI**: Can define completely new Partition and Sort keys. No storage limits; scales throughput independently; created anytime.

### 50. DynamoDB Streams.
**Answer:**
A time-ordered sequence of item-level changes (INSERT, MODIFY, REMOVE) stored for 24 hours. Triggers AWS Lambda functions automatically for event-driven workflows (e.g., updating search indexes, sending welcome emails).

---

## Part 5: Security, IAM, Messaging & Enterprise Deployments (51 - 65)

### 51. AWS Shared Responsibility Model.
**Answer:**
- **AWS is responsible for "Security OF the Cloud"**: Physical data center security, hardware, virtualization layer, underlying managed service infrastructure.
- **Customer is responsible for "Security IN the Cloud"**: IAM credentials, guest OS patching (on EC2), network security groups, encryption of data in transit and at rest.

### 52. IAM User vs Group vs Role vs Policy.
**Answer:**
- **User**: Permanent identity representing a person or service with long-term credentials.
- **Group**: Collection of users inheriting attached policies.
- **Role**: Temporary identity assumed by trusted entities (EC2, Lambda, federated users) via AWS STS temporary credentials.
- **Policy**: JSON document defining allowed/denied permissions.

### 53. IAM Policy Evaluation Logic.
**Answer:**
1. Starts with default **Implicit Deny**.
2. Evaluates all applicable policies.
3. If an **Explicit Deny** exists anywhere, the final decision is immediately **DENIED** (Explicit Deny overrides everything).
4. If an **Explicit Allow** exists and no Deny, decision is **ALLOWED**.
5. Otherwise, remains Denied.

### 54. IAM Instance Profiles.
**Answer:**
A container that passes an IAM Role to an EC2 instance. The instance retrieves temporary short-lived credentials automatically via the Instance Metadata Service (IMDSv2), eliminating the security hazard of hardcoding static access keys in application config files.

### 55. AWS Organizations & Service Control Policies (SCPs).
**Answer:**
SCPs define the maximum permission boundaries for member accounts in an organization. An SCP cannot grant permissions; it sets the guardrails (e.g., disallowing the deletion of CloudTrail or restricting operations to specific AWS regions).

### 56. AWS KMS Envelope Encryption.
**Answer:**
- A **Customer Master Key (CMK)** managed by KMS encrypts a generated plaintext **Data Key**.
- The plaintext Data Key is used by the application to encrypt the actual data payload.
- The plaintext Data Key is immediately erased from memory, and the **Encrypted Data Key** is stored alongside the encrypted data. Protects data without sending massive payloads to KMS.

### 57. Secrets Manager vs SSM Parameter Store.
**Answer:**
- **SSM Parameter Store**: Lightweight hierarchical storage for configuration parameters and encrypted strings. Cost-effective (free standard tier).
- **Secrets Manager**: Built specifically for sensitive credentials. Features native **automatic password rotation** for RDS and database credentials.

### 58. Amazon SQS vs Amazon SNS.
**Answer:**
- **SQS (Queue / Pull Model)**: Messages decoupled and stored in a queue until polled by consumer workers.
- **SNS (Pub-Sub / Push Model)**: Fan-out publisher that pushes a single message simultaneously to thousands of subscribers (Lambda, SQS, Email, SMS).

### 59. SQS Standard vs FIFO Queues.
**Answer:**
- **Standard**: Nearly unlimited throughput; at-least-once delivery; best-effort message ordering.
- **FIFO (First-In-First-Out)**: Strict message ordering; exactly-once processing via Message Deduplication IDs; limited to 3,000 msgs/sec with batching.

### 60. SQS Dead-Letter Queue (DLQ).
**Answer:**
A secondary queue where messages are automatically moved after consumer processing fails more than a configured `maxReceiveCount`. Prevents poisoned messages from blocking the queue and enables debugging and manual replay.

### 61. Amazon EventBridge.
**Answer:**
Serverless event bus that ingests and routes events using JSON schema pattern matching. Connects microservices, AWS services, and SaaS partners (Auth0, Datadog) without custom integration code.

### 62. CloudWatch vs CloudTrail.
**Answer:**
- **CloudWatch**: Operational metrics, log aggregation, alarms, and dashboards (e.g., CPU utilization, HTTP 5xx count).
- **CloudTrail**: Audit trail recording all API calls made to your AWS account (who made the call, when, from which IP, and what parameters).

### 63. Zero-Downtime Deployments on AWS.
**Answer:**
- **Rolling**: CodeDeploy replaces instances incrementally behind the ALB.
- **Canary**: Directs 10% of traffic to new deployment for 10 minutes; rolls back automatically if CloudWatch alarms trigger.
- **Blue-Green**: Provisions duplicate green environment; switches 100% of ALB traffic instantly once verification checks pass.

### 64. CloudFormation vs AWS CDK vs Terraform.
**Answer:**
- **CloudFormation**: Declarative JSON/YAML managed directly by AWS.
- **AWS CDK**: Imperative Infrastructure as Code using TypeScript/Python to generate CloudFormation templates with reusable object-oriented constructs.
- **Terraform**: Declarative HCL2 syntax; cloud-agnostic; manages state externally with broad third-party provider ecosystem.

### 65. Disaster Recovery Strategies: Cost vs RTO/RPO.
**Answer:**
1. **Backup & Restore**: Lowest cost, highest RTO/RPO (hours). Data backed up to S3 and restored on failure.
2. **Pilot Light**: Core data replicated continuously; minimal compute infrastructure kept off until disaster occurs.
3. **Warm Standby**: Scaled-down version of full environment running continuously in secondary region.
4. **Multi-Region Active-Active**: Highest cost, lowest RTO/RPO (near zero). Workloads served simultaneously from multiple regions.
