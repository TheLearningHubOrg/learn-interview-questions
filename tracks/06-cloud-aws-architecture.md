# Full-Stack & Cloud Architecture AWS Master Interview Question Bank: Well-Architected, Serverless, Containers & Security (1 - 65)

> Simple, intuitive, and easy-to-explain technical interview questions and deep-dive answers covering AWS Cloud Architecture, VPC Networking, Multi-Tier Subnets, Route 53, EC2/Fargate/Lambda, S3 storage tiers, Aurora, DynamoDB single-table design, IAM evaluation logic, KMS envelope encryption, SQS/SNS/EventBridge, and FinOps cost optimization.

---

## Part 1: Intro, Architecture & Well-Architected Framework (1 - 5)

### 1. Give a candid walkthrough of your hands-on experience designing, provisioning, and deploying production workloads on AWS.
**In Simple Words:**
"I am a Senior Cloud & Full-Stack Architect with deep hands-on experience designing resilient, multi-region architectures on AWS. I provision immutable infrastructure using Terraform and AWS CDK, designing secure VPC topologies across multiple Availability Zones. My workloads span containerized microservices running on **ECS Fargate** and **EKS**, event-driven serverless pipelines built with **AWS Lambda**, **SQS**, and **EventBridge**, and relational databases on **Amazon Aurora PostgreSQL** paired with DynamoDB and ElastiCache Redis. I focus heavily on security, least-privilege IAM roles, envelope encryption via KMS, and continuous FinOps cost governance."

### 2. What are the 6 Pillars of the AWS Well-Architected Framework, and how do you evaluate architectural trade-offs against them?
**In Simple Words:**
1. **Operational Excellence**: Automating deployments (IaC), monitoring health, and continuously improving.
2. **Security**: Protecting data and identity via Defense-in-Depth, least-privilege IAM, and encryption at rest/transit.
3. **Reliability**: Self-healing systems, Multi-AZ high availability, and automated failover.
4. **Performance Efficiency**: Sizing compute right, using serverless where appropriate, and adopting ARM Graviton processors.
5. **Cost Optimization**: Eliminating idle waste, using Savings Plans/Spot, and setting budget alarms.
6. **Sustainability**: Minimizing idle compute and reducing carbon footprint.
- *Trade-off Example*: Balancing Cost vs Reliability by choosing Multi-AZ synchronous replication for core transactional databases while keeping ephemeral test environments Single-AZ.

### 3. Describe a severe production outage or bottleneck you resolved on AWS.
**How to Explain in an Interview:**
- **Problem**: During a high-traffic flash sale, our serverless API Gateway + Lambda service spiked to 500 errors and p99 response times surged to 8+ seconds.
- **Root Cause**:
  1. Lambda concurrency hit our regional account quota (1,000 concurrent executions), causing incoming invocations to be throttled.
  2. Lambdas inside a VPC lacked VPC Endpoints and routed all S3 and DynamoDB calls through a saturated single NAT Gateway, causing connection timeouts.
- **Fix**:
  1. Requested a quota increase and configured **Provisioned Concurrency** on checkout Lambdas to eliminate cold starts.
  2. Added **S3 and DynamoDB Gateway VPC Endpoints** directly to the subnet route tables, bypassing the NAT Gateway and routing AWS traffic through AWS's free private internal backbone.

### 4. How do you decide between deploying an application on EC2, ECS (Fargate), EKS, or serverless Lambda?
**In Simple Words:**
- **AWS Lambda**: Best for event-driven, bursty, or unpredictable traffic (webhooks, cron jobs, file processing) where scaling down to zero saves money.
- **ECS (Fargate)**: Best for standard long-running containerized web APIs where you want Docker without managing EC2 servers or Kubernetes clusters.
- **Amazon EKS**: Best for large enterprise microservice fleets requiring Istio service mesh, cross-cloud portability, or complex Kubernetes tooling (Helm, ArgoCD).
- **Amazon EC2**: Used when legacy OS access, custom kernel drivers, high-performance computing (HPC), or specialized GPU architectures are mandatory.

### 5. How do you approach AWS cost monitoring and FinOps optimization?
**In Simple Words:**
- **Cost Allocation Tags**: Enforce mandatory tags (`Environment`, `Team`, `CostCenter`) via AWS Organizations SCPs.
- **Compute Savings Plans**: Commit to consistent hourly compute across Lambda, Fargate, and EC2 for up to 66% discounts.
- **Graviton Migration**: Switch EC2, RDS, and Lambda to AWS Graviton (ARM64) for ~20-40% better price-performance.
- **S3 Lifecycle Policies**: Transition objects automatically to Intelligent-Tiering or Glacier Deep Archive after 30-90 days.

---

## Part 2: Networking, VPC & Traffic Routing (6 - 20)

### 6. Design a secure VPC for a 3-tier web application (Web, App, Database).
**In Simple Words:**
Span across at least 2 Availability Zones (AZs) for high availability:
- **Public Subnet**: Connected to an Internet Gateway (IGW). Hosts Public Application Load Balancers (ALB) and NAT Gateways.
- **Private Subnet (App Tier)**: Hosts backend containers/EC2. Outbound internet access goes through the NAT Gateway. No inbound access from the public internet.
- **Isolated Private Subnet (Database Tier)**: Hosts Aurora/RDS databases. Route table has **no route to the internet** (neither IGW nor NAT). Accessible only by the App Tier on port 5432.

### 7. How many IP addresses does AWS reserve in each subnet CIDR block?
**In Simple Words:**
AWS reserves **5 IP addresses** in every subnet (e.g. in `10.0.0.0/24`):
1. `.0`: Network address.
2. `.1`: Reserved by AWS for VPC router.
3. `.2`: Reserved by AWS for DNS (AmazonProvidedDNS).
4. `.3`: Reserved by AWS for future use.
5. `.255`: Network broadcast address (VPCs do not support broadcast).

### 8. Security Groups (stateful) vs Network ACLs (stateless).
**In Simple Words:**
- **Security Group (Stateful)**: Works at the instance/ENI level. If inbound traffic is allowed, outbound return traffic is automatically permitted regardless of outbound rules.
- **NACL (Stateless)**: Works at the subnet boundary. Evaluates numbered rules in order. Outbound ephemeral return ports (1024-65535) must be explicitly allowed.

### 9. Internet Gateway vs NAT Gateway vs NAT Instance.
**In Simple Words:**
- **Internet Gateway (IGW)**: Scalable, highly available gateway attached to your VPC allowing public subnets bidirectional internet access.
- **NAT Gateway**: AWS-managed service in a **public subnet** that allows private subnet instances to make outbound internet calls (e.g., download security updates) while preventing external entities from initiating inbound connections.
- **NAT Instance**: Legacy self-managed EC2 instance running NAT software; requires manual scaling and patching.

### 10. VPC Peering vs AWS Transit Gateway vs PrivateLink.
**In Simple Words:**
- **VPC Peering**: Direct 1-to-1 connection between two VPCs. Non-transitive (A to B and B to C does not connect A to C).
- **Transit Gateway**: Centralized hub-and-spoke router connecting hundreds of VPCs and on-premises datacenters with transitive routing.
- **PrivateLink**: Privately exposes specific microservices or AWS APIs between VPCs via private ENIs without peering the entire networks.

### 11. ALB vs NLB vs GWLB.
**In Simple Words:**
- **ALB (Application Load Balancer)**: Layer 7 (HTTP/HTTPS/gRPC). Path-based routing, host-based routing, SSL termination, and WebSockets.
- **NLB (Network Load Balancer)**: Layer 4 (TCP/UDP/TLS). Ultra-high throughput, millions of requests/sec with ultra-low latency, and provides static Elastic IPs.
- **GWLB (Gateway Load Balancer)**: Deploys and scales third-party virtual network appliances (firewalls, deep packet inspection).

### 12. ALB target health checks and Connection Draining (Deregistration Delay).
**In Simple Words:**
When an EC2 or container is de-registered or updated, connection draining keeps active in-flight requests alive for a configured time (e.g., 300 seconds) while stopping new requests from reaching it. This guarantees zero dropped requests during rolling deployments.

### 13. Elastic IP (EIP) vs Standard Public IP.
**In Simple Words:**
- **Standard Public IP**: Assigned automatically by AWS from its pool; released and changed whenever the instance is stopped and started.
- **Elastic IP (EIP)**: Static IPv4 address permanently allocated to your account that stays the same across reboots and can be remapped to another instance instantly on failure.

### 14. VPC Flow Logs analysis.
**In Simple Words:**
Captures IP traffic going to and from network interfaces in your VPC. Streamed to CloudWatch Logs or S3 and queried with Athena to identify port scanning, rejected traffic (REJECT), and routing misconfigurations.

### 15. VPC Endpoints: Gateway vs Interface Endpoints.
**In Simple Words:**
- **Gateway Endpoints**: Targets added to route tables for **Amazon S3** and **DynamoDB**. Free of charge; traffic never leaves AWS's private network.
- **Interface Endpoints (PrivateLink)**: Provisions Elastic Network Interfaces (ENIs) with private IP addresses inside your subnet for other AWS services (SQS, SNS, Secrets Manager). Billed hourly + per GB.

### 16. Amazon Route 53 Routing Policies.
**In Simple Words:**
- **Simple**: Standard 1-to-1 DNS lookup.
- **Weighted**: Splits traffic by percentage (e.g., 90% stable, 10% canary).
- **Latency-based**: Routes users to the AWS region with the lowest ping.
- **Failover**: Active-Passive disaster recovery via health checks.
- **Geolocation**: Routes users based on geographic location (country/continent).
- **Multi-Value Answer**: Returns up to 8 healthy IPs with DNS health checks.

### 17. Route 53 Alias Record vs CNAME Record.
**In Simple Words:**
- **CNAME**: Standard DNS alias pointing one domain name to another. Cannot be created for the root zone apex (e.g., `example.com`).
- **Alias Record**: Route 53-specific record that can point the root zone apex (`example.com`) directly to AWS resources (ALB, CloudFront, S3) with free internal DNS lookups.

### 18. Site-to-Site VPN vs AWS Direct Connect (DX).
**In Simple Words:**
- **Site-to-Site VPN**: Encrypted IPsec tunnel running over the public internet. Fast and inexpensive to set up, but subject to public internet jitter and latency spikes.
- **Direct Connect**: Dedicated physical fiber optic connection from your datacenter directly into AWS. Guarantees consistent high throughput, ultra-low latency, and complete privacy.

### 19. AWS Global Accelerator vs CloudFront.
**In Simple Words:**
- **CloudFront**: CDN that caches static and dynamic HTTP content at 450+ global Edge Locations.
- **Global Accelerator**: Uses AWS's private fiber network and Anycast static IPs to route traffic fast for both HTTP and non-HTTP protocols (TCP, UDP, gaming, VoIP) without content caching.

### 20. Egress-Only Internet Gateway.
**In Simple Words:**
The IPv6 equivalent of a NAT Gateway: it allows IPv6-enabled instances in private subnets to make outbound internet calls while blocking incoming connections initiated from the outside internet.

---

## Part 3: Compute, Containers & Serverless (21 - 35)

### 21. EC2 Instance Families & Graviton.
**In Simple Words:**
- **General Purpose (M, T)**: Balanced CPU and RAM for typical web applications.
- **Compute Optimized (C)**: High CPU for batch jobs, media encoding, and machine learning inference.
- **Memory Optimized (R, X)**: High RAM for in-memory caches (Redis) and large relational databases.
- **Storage Optimized (I, D)**: High NVMe SSD I/O for data warehouses and Cassandra.
- **AWS Graviton**: ARM-based custom chips delivering up to 40% better price-performance than Intel/AMD.

### 22. EC2 Pricing Models comparison.
**In Simple Words:**
- **On-Demand**: Pay by the second with zero commitment. Most expensive.
- **Savings Plans / Reserved Instances**: 1- or 3-year commitment for steady workloads; up to 72% discount.
- **Spot Instances**: Spare AWS capacity with up to 90% discount. AWS can reclaim instances with a 2-minute warning. Great for fault-tolerant batch workers and CI/CD runners.

### 23. EC2 Placement Groups: Cluster vs Spread vs Partition.
**In Simple Words:**
- **Cluster**: Packs instances together in a single AZ for ultra-low latency and 100 Gbps network throughput.
- **Spread**: Places each instance on distinct physical hardware racks to prevent correlated hardware failures.
- **Partition**: Spreads instances across logical partitions that don't share racks (ideal for HDFS, Kafka, Cassandra).

### 24. EBS-backed vs Instance Store-backed instances.
**In Simple Words:**
- **EBS (Elastic Block Store)**: Network-attached virtual hard drive. Data persists when the instance is stopped; supports point-in-time snapshots.
- **Instance Store (Ephemeral)**: Physical NVMe SSD directly attached to the host server. Blazingly fast I/O, but data is permanently lost when the instance is stopped.

### 25. EC2 Auto Scaling Policies.
**In Simple Words:**
- **Target Tracking**: Automatically adjusts capacity to maintain a specific target metric (e.g. keep average CPU at 60%).
- **Step Scaling**: Increases or decreases instances in steps based on CloudWatch alarm thresholds.
- **Scheduled Scaling**: Scales up or down based on predictable calendar events (e.g. scale up every weekday morning at 8 AM).

### 26. AWS Lambda Execution Model & Firecracker.
**In Simple Words:**
Lambda runs code in lightweight microVMs powered by **Firecracker** (open-source Rust virtualization).
**Lifecycle Phases:**
1. **Init**: Downloads code, starts runtime, runs code outside the handler function.
2. **Invoke**: Executes the handler function with the incoming event payload.
3. **Shutdown**: Reaps the execution environment when idle.

### 27. Lambda Cold Starts & Mitigation Strategies.
**In Simple Words:**
A cold start happens during the **Init phase** when AWS provisions a new microVM container for your function.
**How to Mitigate:**
1. **Provisioned Concurrency**: Keeps pre-warmed execution environments ready 24/7 for zero cold-start latency.
2. Keep deployment packages small (bundle with `esbuild`, tree-shake unused dependencies).
3. Initialize database connection pools and SDK clients **outside** the handler function so they are reused across invocations.

### 28. Lambda Hard Resource Limits.
**In Simple Words:**
- Maximum Memory: 10,240 MB (10 GB).
- Maximum Timeout: 900 seconds (15 minutes).
- Ephemeral `/tmp` storage: Up to 10 GB.
- Synchronous invocation payload limit: 6 MB; Asynchronous: 256 KB.

### 29. Lambda Event Source Mapping (ESM).
**In Simple Words:**
An AWS-managed internal poller that reads records in batches from queues or streams (SQS, Kinesis, DynamoDB Streams) and synchronously invokes your Lambda function with the batch.

### 30. Lambda in VPC without cold start penalty (Hyperplane ENIs).
**In Simple Words:**
AWS uses **Hyperplane** (shared network virtualization technology). Rather than creating a new Elastic Network Interface (ENI) for every single Lambda instance, Lambdas attach to pre-provisioned shared Hyperplane ENIs, eliminating the multi-second VPC cold start penalty.

### 31. ECS vs EKS: Operational trade-offs.
**In Simple Words:**
- **Amazon ECS**: AWS-native, simple, zero control-plane cost, deeply integrated with IAM and ALB.
- **Amazon EKS**: Managed Kubernetes. Higher learning curve and costs (\$0.10/hour control plane), but provides cross-cloud portability and the huge Kubernetes ecosystem (Helm, ArgoCD).

### 32. AWS Fargate trade-offs.
**In Simple Words:**
- **Pros**: Serverless containers; no EC2 instances to provision, scale, patch, or secure.
- **Cons**: Slightly higher per-hour compute cost than reserved EC2 instances; does not support privileged Docker containers.

### 33. Amazon ECR container security.
**In Simple Words:**
Amazon Elastic Container Registry supports:
1. **Tag Immutability**: Prevents existing image tags (like `latest` or `v1.0`) from being overwritten.
2. **Vulnerability Scanning**: Automated scanning with AWS Inspector on push to find CVE vulnerabilities in container packages.

### 34. AWS App Runner.
**In Simple Words:**
A fully managed container runner: give it a GitHub repository or container image, and App Runner automatically builds, deploys, provisions load balancers, manages SSL, and scales your web service without configuring VPCs or clusters.

### 35. AWS Step Functions: Standard vs Express Workflows.
**In Simple Words:**
- **Standard Workflows**: For long-running orchestration (up to 1 year). Exactly-once execution and complete audit history persisted.
- **Express Workflows**: For high-volume, short event processing (up to 5 minutes). At-least-once execution; handles 100,000+ events/second at lower cost.

---

## Part 4: Storage, Content Delivery & Databases (36 - 50)

### 36. S3 vs EBS vs EFS.
**In Simple Words:**
- **S3 (Object Storage)**: Unlimited storage accessible globally via REST API. Ideal for files, media, backups, and data lakes.
- **EBS (Block Storage)**: Virtual hard drive attached to a single EC2 instance in one AZ.
- **EFS (File Storage)**: Shared POSIX file system concurrently mountable by thousands of EC2 instances and Lambdas across multiple AZs.

### 37. S3 Storage Classes and Lifecycle Rules.
**In Simple Words:**
- **Standard**: Frequently accessed data, millisecond retrieval.
- **Intelligent-Tiering**: Automatically shifts objects between hot and cold tiers based on access patterns with no retrieval fees.
- **Standard-IA**: Infrequently accessed; lower storage cost, small per-GB retrieval fee.
- **Glacier Flexible / Deep Archive**: Deep archival storage; lowest cost, retrieval times from minutes to 12 hours.

### 38. How S3 achieves 99.999999999% (11 9s) durability.
**In Simple Words:**
S3 redundantly stores your data across multiple physically separated Availability Zones (minimum 3 AZs) within an AWS Region. It continuously verifies data checksums and automatically self-heals damaged data blocks in the background.

### 39. S3 Security Mechanisms.
**In Simple Words:**
1. **S3 Block Public Access**: Account-wide or bucket-level master switch to prevent public exposure.
2. **Bucket Policies**: Resource-based JSON policies controlling actions by specific principals or IP ranges.
3. **IAM Policies**: Identity-based permissions attached to users and roles.
4. **SSE Encryption**: Encryption at rest via SSE-S3 (AES-256) or SSE-KMS.

### 40. S3 Multipart Upload.
**In Simple Words:**
Uploads large files in parallel chunks (parts). Mandatory for files > 5 GB (recommended for > 100 MB). If one part fails due to network interruption, only that part needs to be retried rather than re-uploading the entire file.

### 41. S3 Versioning, Object Lock, and MFA Delete.
**In Simple Words:**
- **Versioning**: Preserves every version of an object; deleting an item creates a reversible delete marker.
- **Object Lock**: Implements WORM (Write Once, Read Many). Compliance Mode prevents deletion by anyone, including the AWS root account.
- **MFA Delete**: Requires a hardware MFA code to permanently delete object versions.

### 42. CloudFront Edge Locations & Regional Edge Caches.
**In Simple Words:**
- **Edge Locations**: 450+ points of presence worldwide that cache content close to end users for ultra-fast load times.
- **Regional Edge Caches**: A larger caching layer sitting between Edge Locations and your origin server to prevent cache misses from overwhelming backend origins.

### 43. CloudFront Signed URLs vs Signed Cookies.
**In Simple Words:**
- **Signed URLs**: Grants temporary access to a single specific file (e.g., a one-time video download link).
- **Signed Cookies**: Grants access to multiple protected files or an entire folder without altering URLs (e.g., streaming HLS video segments to an authorized subscriber).

### 44. CloudFront Functions vs Lambda@Edge.
**In Simple Words:**
- **CloudFront Functions**: Lightweight JavaScript running at 450+ Edge Locations in sub-milliseconds. No network access. Ideal for URL rewrites, redirecting, and header manipulation.
- **Lambda@Edge**: Full Node.js/Python running at Regional Edge Caches. Allows network calls, third-party API lookups, and server-side rendering at the edge.

### 45. Amazon RDS: Multi-AZ vs Read Replicas.
**In Simple Words:**
- **Multi-AZ**: Synchronous standby replica in a second AZ. Dedicated to **High Availability & Disaster Recovery**; standby cannot accept read queries; automatic failover in < 60 seconds.
- **Read Replica**: Asynchronous replica dedicated to **Read Scaling**. Can be queried directly to offload read traffic; can be promoted to a standalone primary database.

### 46. Amazon Aurora Architecture.
**In Simple Words:**
Aurora separates compute from storage:
- Storage is distributed across 3 AZs with **6-way replication**.
- Writes are acknowledged when 4 of 6 storage nodes commit.
- Delivers up to 5x the throughput of standard MySQL and 3x of standard PostgreSQL.

### 47. Aurora Serverless v2.
**In Simple Words:**
Scales database compute capacity up and down instantly in fractions of an Aurora Capacity Unit (ACU) within milliseconds in response to real-time traffic spikes, without dropping database connections.

### 48. DynamoDB Single-Table Design.
**In Simple Words:**
Consolidates multiple entities (Users, Orders, Items) into a single DynamoDB table using generic Partition Keys (`PK`) and Sort Keys (`SK`) (e.g., `PK=USER#123`, `SK=ORDER#999`). Fetches a user and all their recent orders in a single sub-10ms query!

### 49. DynamoDB GSI vs LSI.
**In Simple Words:**
- **LSI (Local Secondary Index)**: Uses the same Partition Key as the table with a different Sort Key. Max 10GB per partition; must be created when the table is created.
- **GSI (Global Secondary Index)**: Can choose completely new Partition and Sort keys. No storage limits; scales throughput independently; can be created anytime.

### 50. DynamoDB Streams.
**In Simple Words:**
A 24-hour time-ordered changelog of item modifications (INSERT, MODIFY, REMOVE). Automatically triggers AWS Lambda functions for event-driven workflows (e.g., sending notification emails or updating search indices).

---

## Part 5: Security, IAM, Messaging & Enterprise Deployments (51 - 65)

### 51. AWS Shared Responsibility Model.
**In Simple Words:**
- **AWS is responsible for "Security OF the Cloud"**: Physical data centers, host hardware, hypervisor, and managed software infrastructure.
- **Customer is responsible for "Security IN the Cloud"**: Customer data, IAM credentials, OS patching (EC2), security groups, and encryption.

### 52. IAM User vs Group vs Role vs Policy.
**In Simple Words:**
- **User**: Permanent identity with credentials for a specific person or service.
- **Group**: Collection of users that share the same permissions.
- **Role**: Temporary identity assumed by trusted services (EC2, Lambda) or users via temporary STS tokens.
- **Policy**: JSON document defining allowed (`Allow`) or denied (`Deny`) permissions.

### 53. IAM Policy Evaluation Logic.
**In Simple Words:**
1. Starts with default **Implicit Deny**.
2. Evaluates all applicable policies.
3. If an **Explicit Deny** exists anywhere, the final decision is immediately **DENIED** (Explicit Deny overrides everything!).
4. If an **Explicit Allow** exists and no Deny, decision is **ALLOWED**.
5. Otherwise, remains Denied.

### 54. IAM Instance Profiles.
**In Simple Words:**
A container that attaches an IAM Role directly to an EC2 instance. The application retrieves temporary short-lived credentials via the Instance Metadata Service (IMDSv2), eliminating the security risk of hardcoding static access keys in code or config files.

### 55. AWS Organizations & Service Control Policies (SCPs).
**In Simple Words:**
SCPs define the maximum permission boundaries across all AWS accounts in your organization. An SCP never grants permissions; it acts as an immutable guardrail (e.g., forbidding member accounts from disabling CloudTrail or deleting S3 backups).

### 56. AWS KMS Envelope Encryption.
**In Simple Words:**
KMS uses a two-tier key model:
1. A **Customer Managed Key (KMS CMK)** encrypts a small plaintext **Data Key**.
2. The application uses the plaintext Data Key to encrypt large data payloads locally.
3. The plaintext key is wiped from memory, and the **Encrypted Data Key** is stored alongside the encrypted data. Protects data without sending gigabytes across KMS network APIs.

### 57. Secrets Manager vs SSM Parameter Store.
**In Simple Words:**
- **SSM Parameter Store**: Lightweight hierarchical storage for app configuration and simple encrypted secrets. Cost-effective (free standard tier).
- **Secrets Manager**: Built specifically for critical credentials; features native **automatic password rotation** for RDS and database credentials.

### 58. Amazon SQS vs Amazon SNS.
**In Simple Words:**
- **SQS (Queue / Pull Model)**: Messages sit in a queue until consumer workers pull and process them. Great for decoupling asynchronous background tasks.
- **SNS (Pub-Sub / Push Model)**: Fan-out publisher that pushes a single notification simultaneously to thousands of subscribers (Lambdas, SQS queues, webhooks).

### 59. SQS Standard vs FIFO Queues.
**In Simple Words:**
- **Standard Queue**: Unlimited throughput, at-least-once delivery, best-effort message ordering (rare duplicates possible).
- **FIFO Queue**: Strict First-In-First-Out ordering, exactly-once processing (deduplication ID), limited to 3,000 msgs/sec with batching.

### 60. SQS Dead-Letter Queue (DLQ).
**In Simple Words:**
A secondary queue where failed messages are automatically moved after a consumer fails to process them after `maxReceiveCount` attempts. Prevents "poison pill" messages from clogging the main queue and allows engineers to inspect and replay errors.

### 61. Amazon EventBridge.
**In Simple Words:**
A serverless event bus that routes JSON events between microservices, AWS services, and SaaS applications (Auth0, Stripe, Datadog) using JSON schema filtering rules without custom glue code.

### 62. CloudWatch vs CloudTrail.
**In Simple Words:**
- **CloudWatch**: Operational monitoring, metrics (CPU, memory, latency), log aggregation, and alarm dashboards.
- **CloudTrail**: Audit trail recording **who did what, when, and from where** across all AWS API calls and console actions.

### 63. Zero-Downtime Deployments on AWS.
**In Simple Words:**
- **Rolling**: CodeDeploy replaces instances incrementally behind the ALB.
- **Canary**: Directs 10% of traffic to the new version for 10 minutes; automatically rolls back if CloudWatch alarms trigger.
- **Blue-Green**: Provisions a complete duplicate environment (Green); switches 100% of ALB traffic instantly once health checks pass.

### 64. CloudFormation vs AWS CDK vs Terraform.
**In Simple Words:**
- **CloudFormation**: Declarative JSON/YAML managed natively by AWS.
- **AWS CDK**: Uses real programming languages (TypeScript, Python) to generate CloudFormation templates with object-oriented abstractions.
- **Terraform**: Declarative HCL syntax, cloud-agnostic, manages state externally, and supports vast multi-cloud ecosystems.

### 65. Disaster Recovery Strategies: Cost vs RTO/RPO.
**In Simple Words:**
From lowest cost to highest resiliency:
1. **Backup & Restore**: Data backed up to S3; restored on failure (RTO/RPO in hours).
2. **Pilot Light**: Core data replicated continuously; minimal core compute kept off until disaster strikes.
3. **Warm Standby**: Scaled-down version of full environment running continuously in a secondary region.
4. **Multi-Region Active-Active**: Workloads served simultaneously from multiple regions (RTO/RPO near zero; highest cost).
