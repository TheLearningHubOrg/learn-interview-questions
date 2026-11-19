# Kubernetes (K8s) & Cloud-Native Architecture Master Interview Bank (1 - 25)

> Kubernetes control plane (API server, etcd, scheduler, controller manager), kubelet, kube-proxy, Pod lifecycle, Deployments, Services, Ingress, CNI, CSI, HPA, and Custom Resource Definitions (CRDs).

---

### 1. Kubernetes Control Plane Architecture: How do Control Plane components and Worker Node agents interact?
### High-Level Architecture
Kubernetes follows a master-worker distributed architecture. The **Control Plane** maintains cluster state, evaluates scheduling decisions, and orchestrates reconciliation loops, while **Worker Nodes** execute the containeri

### 2. The etcd Distributed Datastore: Raft consensus, quorum calculation, snapshot backups, and write latency.
### Architecture & Mechanics
**etcd** is a strongly consistent (CP under CAP theorem), distributed key-value store using the **Raft consensus algorithm**. Every Kubernetes object (Pods, Deployments, Secrets, CRDs) is stored in etcd under keys prefixed with `/registry/`.

```
       +-------------------------------------------------------------+
       |                  etcd 3-Node Quorum Cluster                 |
       |                                                             |
       |       +------------+                +------------+          |
       |       |  etcd 01   |<--- Heartbeat->|  etcd 02   |          |
       |       |  (LEADER)  |                | (FOLLOWER) |          |
       |       +------------+                +------------+          |
       |             ^                             ^                 |
       |             |                             |                 |
       |             +------------+   +------------+                 |
       |                          v   v                              |
       |                      +------------+                         |
       |                      |  etcd 03   |                         |
       |                      | (FOLLOWER) |                         |
       |                      +------------+                         |
       +-------------------------------------------------------------+
```

#### 1. Quorum Calculation & Node Si

### 3. Kube-API Server Request Lifecycle: Authentication, Authorization, Mutating and Validating Admission Controllers.
### Deep Dive: Inside the Kube-API Server
Every incoming request to the API server (from `kubectl`, Kubelet, or internal controllers) must pass through a strict 3-phase pipeline before the object is committed to `etcd`.

```
[ Incoming HTTP Request ]
           |
           v
+------------------------+
| 1. Authentication      | -> X.509 Client Certs, OIDC Bearer Tokens, Webhook Tokens
+------------------------+
           | (Authenticated User & Groups)
           v
+------------------------+
| 2. Authori

### 4. Kube-Scheduler Deep-Dive: How Filtering, Scoring, Node Affinity, Taints, and Tolerations place Pods.
### Scheduling Pipeline & Algorithms
When a Pod is submitted with `spec.nodeName == ""`, the **kube-scheduler** selects the best node in two primary phases: **Filtering (Predicates)** and **Scoring (Priorities)**.

```
[ Unschedulable Pod ]
         |
         v
+---------------------------------------------------+
| 1. Filtering Phase (Predicates)                   |
| - NodeResourcesFit (CPU, RAM available)           |
| - NodeName matches (if specified)                 |
| - PodFitsHostPorts                                |
| - NodeAffinity & NodeSelector                     |
| - Taints & Tolerations matching                   |
| - PodTopologySpreadConstraints                    |
+---------------------------------------------------+
         | (List of Feasible Candidate Nodes)
         v
+---------------------------------------------------+
| 2. Scoring Phase (Priorities)                     |
| - LeastAllocated (Balance load)                   |
| - MostAllocated (Bin-packing for cost saving)     |
| - ImageLocalityPriority (Image already cached)    |
| - InterPodAffinityPriority                        |
+---------------------------------------------------+
         | (Highest Scoring Node)
         v
[ Bind Pod to Node via API Server ]
```

#### Taints vs. Tolerations vs. Node Affinity
| Mechanism | Where it is set | Purpose | Rule Syntax |
| :--- | :--- | :--- | :--- |
| **Taint** | On the **Node** | Repels Pods from being scheduled unless the Pod tolerates the taint. | `kubectl taint nodes node-1 dedicated=gpu:NoSchedule` |
| **Toleration**| In the **Pod spec**| Allows (but does not force) a Pod to schedule onto a tainted node. | `tolerations: [{key: "dedicated", value: "gpu", effect: "NoSchedule"}]` |
| **Node Affinity**| In the **Pod spec**| Attracts a Pod to specific nodes based on node labels. | `requiredDuringSchedulingIgnoredDuringExecution` (hard) vs `preferredDuringScheduling...` (soft) |

#### Production Topology Spread Example
Ensures Pod replicas are distributed evenly across Availability Zones:
```yaml
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/

### 5. Kubelet & Container Runtime Interface (CRI): syncLoop mechanics, Static Pods, and cgroup drivers.
### Architecture & Runtime Interface
The **kubelet** is the primary node agent running as a systemd service on every worker node. It does not manage containers directly; instead, it communicates with the container runtime (e.g. `containerd`) over a local UNIX domain socket using gRPC via the **Container Runtime Interface (CRI)**.

```
+-------------------------------------------------------+
| Kubelet                                               |
|   +-----------------------------------------------+   |
|   | syncLoop (Listens to API Server, File, HTTP)  |   |
|   +-----------------------------------------------+   |
|                         |                             |
|                         v gRPC (/run/containerd.sock) |
|   +-----------------------------------------------+   |
|   | CRI: RuntimeService & ImageService            |   |
|   +-----------------------------------------------+   |
+-------------------------|-----------------------------+
                          |
                          v
+-------------------------------------------------------+
| Container Runtime (containerd)                        |
|   -> Pulls images via containerd ImageService         |
|   -> Calls OCI Runtime (runc / crun) to launch Pod    |
+-------------------------------------------------------+
```

#### 1. The `syncLoop` Mechanics
The heart of Kubelet is an event loop (`syncLoop`) that monitors three configuration sources:
1. **API Server**: Pods assigned to this node.
2. **File (Static Pods)**: Manifests in `/etc/kubernetes/manifests/` (used to bootstrap self-hosted control plane components: etcd, api-server, scheduler).
3. **HTTP endpoint**: Legacy remote manifest polling.
When a change occurs, `syncLoop` computes the difference between the desired state and the observed state and calls CRI methods (`RunPodSandbox`, `CreateContainer`, `StartContainer`).

#### 2. The cgroup Driver Mismatch Bug
A frequent production issue occurs when the host operating system uses `systemd` as its init system, but Docker/containerd is configured with the `cgroupfs` driver. Having two cgroup managers leads to split resource accounting and node instability.
**Standard Fix**: Always configure containerd to use the `systemd` cgroup driver:
```toml
# /etc/containerd/config.toml
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
  SystemdCgroup = true
```

---

### 6. Pod Lifecycle & State Machine: Pending, Running, Succeeded, Failed, and graceful shutdown sequencing.
### Pod State Machine & Graceful Shutdown
A Pod passes through a well-defined sequence of phases in its lifecycle. Understanding the exact termination order is essential for building

### 7. Liveness, Readiness, and Startup Probes: Differences, failure thresholds, and avoiding probe death spirals.
### Probe Architecture & Purpose
Kubernetes provides three distinct health probes executed periodically by the Kubelet. Using the wrong probe type or misconfiguring thresholds is the #1 cause of cascading cluster outages.

```
[ Container Starts ]
        |
        v
+-------------------------+
|     Startup Probe       | --> Protects slow-starting legacy apps from premature kills.
+-------------------------+
        | (Succeeds)
        +-----------------------------------+
        |                                   |
        v                                   v
+-------------------------+       +-------------------------+
|     Liveness Probe      |       |     Readiness Probe     |
| (Is application alive?) |       | (Can app take traffic?) |
| Failed -> Restart Pod   |       | Failed -> Remove from   |
|                         |       | Service Endpoints       |
+-------------------------+       +-------------------------+
```

#### Comparison Matrix
| Probe Type | Purpose | Action on Failure | Ideal Target Check |
| :--- | :--- | :--- | :--- |
| **Startup** | Disables liveness/readiness probes until the app has finished booting. | Kills container and restarts per `restartPolicy`. | Checks local process initiali

### 8. Deployments vs. ReplicaSets vs. StatefulSets: When to use StatefulSets and how headless services work.
### Workload Controllers Architecture
Kubernetes encapsulates container management into higher-level declarative controllers tailored for stateless versus stateful systems.

```
Stateless Architecture (Deployment)
[ Deployment ] ---> [ ReplicaSet ] ---> [ Pod-abc1 ] (Interchangeable, random IDs)
                                   ---> [ Pod-xy

### 9. DaemonSets & Job/CronJob Controllers: Concurrency policies, node maintenance, and backoff limits.
### DaemonSets, Jobs & CronJobs
While Deployments and StatefulSets run continuous workloads, DaemonSets guarantee node coverage, and Jobs handle finite run-to-completion tasks.

```
1. DaemonSet Architecture:
   [ Master ]
       |
       +---> [ Node 1 ] -> Runs exactly 1 replica (FluentBit / CNI / NodeExporter)
       +---> [ Node 2 ] -> Runs exactly 1 replica
       +---> [ Node 3 ] -> Runs exactly 1 replica

2. CronJob Lifecycle:
   [ CronJob Schedule: "0 * * * *" ]
                   |
                   v
   [ Spawns Job ] ---> [ Creates Pod ] ---> Runs to completion (Exit Code 0)
```

#### 1. DaemonSets for Node-Level Agents
- Automatically schedules one Pod per node (using Node Affinity and Tolerations for control plane taints).
- When a new worker node joins the cluster, the DaemonSet controller automatically spins up a pod on it.
- **Use Cases**: Log collection (FluentBit, Promtail), host monitoring (Node Exporter, Datadog), storage daemons (Ceph), and network plugins (Cilium, Calico).

#### 2. Jobs & CronJobs Concurrency Policies
When scheduling recurring CronJobs, if a previous run takes longer than the schedule interval, the `concurrencyPolicy` controls execution:
- **`Allow` (Default)**: Spawns new Job concurrently. Risk: Runaway jobs exhausting database connections.
- **`Forbid` (Recommended for batch processing)**: Skips the new run if the previous one is still executing.
- **`Replace`**: Cancels the currently running Job and starts a new one.

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-reconciliation
spec:
  schedule: "0 2 * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 5
  jobTemplate:
    spec:
      backoffLimit: 3 # Retry failed pod at most 3 times before failing Job
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: job
              image: registry.example.com/batch:v1
```

---

### 10. ConfigMaps & Secrets: Volume mounts vs. environment variables, automatic reloading, and KMS encryption.
### Secret Management & Injection Patterns
Storing configuration and sensitive credentials in Kubernetes requires careful consideration of security, immutability, and dynamic updates.

```
                    +------------------------------------+
                    |       HashiCorp Vault / AWS SM     |
                    +------------------------------------+
                                      |
                                      v (External Secrets Operator)
+------------------------------------------------------------------------+
| Kubernetes Cluster                                                     |
|                                                                        |
|    +-------------------+       +----------------------------------+    |
|    |     Secret        |       |            ConfigMap             |    |
|    | (Encrypted via    |       | (Non-sensitive application conf) |    |
|    | AWS KMS envelope) |       +----------------------------------+    |
|    +-------------------+                         |                     |
|              \                                  /                      |
|               v                                v                       |
|         +---------------------------------------------+                |
|         |                 App Pod                     |                |
|         | - Env Var: Static (Requires Pod Restart)    |                |
|         | - Volume Mount: Dynamic (Auto-updates file) |                |
|         +---------------------------------------------+                |
+------------------------------------------------------------------------+
```

#### Volume Mount vs. Environment Variable
| Injection Method | Auto-Updates When Secret Changes? | Security Risk |
| :--- | :--- | :--- |
| **Environment Variable** (`valueFrom`) | **No**. Value is fro

### 11. Persistent Volumes (PV), PVC, StorageClass, and the Container Storage Interface (CSI).
### Kubernetes Storage Subsystem
Kubernetes abstracts physical storage infrastructure through a 3-tier declarative model: **StorageClass**, **PersistentVolumeClaim (PVC)**, and **PersistentVolume (PV)** managed via the **Container Storage Interface (CSI)**.

```
[ Developer Request ]
        |
        v
+-------------------------------+
|  PersistentVolumeClaim (PVC)  | -> Demands 100Gi, ReadWriteOnce
+-------------------------------+
        |
        v
+-------------------------------+
|       StorageClass (CSI)      | -> aws-ebs-csi-driver, gp3, dynamic provisioner
+-------------------------------+
        |
        v (Calls Cloud Provider Storage API)
+-------------------------------+
|     PersistentVolume (PV)     | -> Provisions actual EBS Volume / SAN LUN
+-------------------------------+
        |
        v (Attached to EC2 & Mounted into Pod filesystem)
[ Pod /var/lib/data Mount ]
```

#### Access Modes Breakdown
| Access Mode | CLI Notation | Architecture & Support |
| :--- | :--- | :--- |
| **ReadWriteOnce** | `RWO` | Can be mounted as read-write by a **single node**. Typical for block storage (AWS EBS, GCP Persistent Disk, A

### 12. Kubernetes Networking Model & CNI: IP-per-Pod, Calico vs. Cilium (eBPF) vs. Cloud VPC CNI.
### The Kubernetes Networking Invariants
Every Kubernetes CNI (Container Network Interface) plugin must adhere to three fundamental rules:
1. All Pods can communicate with all other Pods on any node **without NAT**.
2. All agents on a node (e.g. Kubelet) can communicate with all Pods on that same node.
3. The IP that a Pod sees itself as is the same IP that all other Pods see it as.

```
       Node 1 (192.168.1.10)                       Node 2 (192.168.1.20)
+---------------------------------+         +---------------------------------+
| [Pod A: 10.244.1.5]             |         | [Pod B: 10.244.2.8]             |
|        | (veth)                 |         |        | (veth)                 |
|   [ CNI Network Plugin ]        |         |   [ CNI Network Plugin ]        |
|        |                        |         |        |                        |
|   [ eth0: 192.168.1.10 ]        |         |   [ eth0: 192.168.1.20 ]        |
+---------------------------------+         +---------------------------------+
                 \                                   /
                  \==== Direct Routing / VXLAN =====/
```

#### CNI Plugin Comparison
| CNI Plugin | Mechanism | Strengths | Limitations |
| :--- | :--- | :--- | :--- |
| **Cilium** | **eBPF** (Extended Berkeley Packet Filter) | Replaces iptables directly inside the Linux kernel. Unmatched throughput, sub-millisecond latency, built-in L7 NetworkPolicy, Hubble network observability. | Requires modern Linux kernel (5.4+). |
| **Calico** | BGP (Border Gateway Protocol) or VXLAN/IP-in-IP | Industry benchmark for granular NetworkPolicies, highly mature, supports hybrid on-prem / cloud. | Uses iptables or IPVS (higher CPU overhead at 10k+ services). |
| **AWS VPC CNI** | Secondary ENI IP Allocation | Assigns real AWS VPC private IPs directly to Pods. Zero overlay encapsulation overhead; native integration with AWS security groups. | Risk of VPC subnet IP exhaustion; limits pod density per EC2 instance type. |

---

### 13. Kubernetes Services Architecture: ClusterIP, NodePort, LoadBalancer, and Kube-proxy iptables vs. IPVS.
### Service Abstraction & Packet Flow
Pods are ephemeral—their IP addresses change whenever they restart. A **Service** provides a stable virtual IP (VIP) and DNS record that load-balances traffic across dynamic Pod endpoints.

```
1. ClusterIP (Internal only):
   [ Client Pod ] ---> [ Virtual VIP: 10.96.0.10:80 ]
                                 | (Kube-proxy iptables/IPVS rule)
                                 +---> [ Pod 1: 10.244.1.4:8080 ]
                                 +---> [ Pod 2: 10.244.2.9:8080 ]

2. NodePort:
   [ External Client ] ---> [ Any Worker Node IP : 30080 ] ---> [ ClusterIP ] ---> [ Pod ]

3. LoadBalancer:
   [ Cloud Provider NLB/ALB ] ---> [ NodePort ] ---> [ ClusterIP ] ---> [ Pod ]
```

#### Service Types Comparison
| Service Type | Scope | How It Operates |
| :--- | :--- | :--- |
| **ClusterIP** | Internal | Default. Assigns an immutable cluster-internal virtual IP. Only reachable from within the cluster. |
| **NodePort** | External | Allocates a static port (default range `30000-32767`) across **every worker node**. |
| **LoadBalancer**| External | Integrates with cloud APIs (AWS NLB, GCP Cloud LB) to provision an external hardware/cloud load balancer routing into NodePorts. |
| **Headless** | Internal | `clusterIP: None`. Bypasses load balancing; DNS queries return the direct Pod IPs (used for stateful databases). |

#### Kube-proxy: iptables vs. IPVS Mode
- **iptables mode**: Evaluates rules sequentially ($O(N)$ complexity). At thousands of services, iptables rule updates become a CPU bottleneck.
- **IPVS mode (IP Virtual Server)**: Implemented via Netfilter hash tables ($O(1)$ complexity). Drastically faster packet routing and supports true load balancing algorithms (Round Robin, Least Connections, Source Hashing).

---

### 14. Ingress Controllers vs. Kubernetes Gateway API: Architecture, TLS termination, and traffic routing.
### Evolution: Ingress vs. Gateway API
While standard Ingress provided basic Layer 7 HTTP routing, its monolithic specification forced cloud vendors to rely on brittle, non-standard annotations. The **Gateway API** is the next-generation standard designed with role-oriented separation of concerns.

```
Ingress (Monolithic):
[ Ingress Resource ] -> Combines routing rules, TLS, annotations, and controller bindings into one file.

Gateway API (Role-Oriented Separation):
+------------------------------------+
| GatewayClass (Infra Provider)      | -> Defines controller implementation (e.g., Envoy, Cilium)
+------------------------------------+
                  |
                  v
+------------------------------------+
| Gateway (Cluster Operator / DevOps)| -> Defines IP, TLS certificates, and listener ports (443, 80)
+------------------------------------+
                  |
                  v
+------------------------------------+
| HTTPRoute (Application Developer)  | -> Defines path matching, canary weights, headers, rewrites
+------------------------------------+
```

#### Canary Deployment with Gateway API (Traffic Weight Splitting)
Unlike standard Ingress which required complex NGINX annotations, Gateway API natively supports percentage-based traffic splitting:
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api-canary
spec:
  parentRefs:
    - name: production-gateway
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api/v1
      backendRefs:
        - name: api-stable
          port: 8080
          weight: 90 # 90% traffic to stable version
        - name: api-canary
          port: 8080
          weight: 10 # 10% canary traffic
```

---

### 15. Kubernetes Network Policies & Microsegmentation: Default deny-all security postures and multi-tier isolation.
### Network Security & Zero Trust Microsegmentation
By default, the Kubernetes network is completely open: any Pod can establish a TCP connection with any other Pod in any namespace. **NetworkPolicies** enforce Layer 3/4 firewall rules using label selectors, evaluated by the CNI plugin (e.g., Calico or Cilium).

```
[ Frontend Pod ] -------- Allowed (Port 5432) ---------> [ Backend Pod ]
       |                                                        |
       X Blocked                                                | Allowed (Port 5432)
       v                                                        v
[ Rogue / Comp. Pod ]                                    [ Database Pod ]
```

#### 1. The Production "Default Deny All" Baseline
Always apply a default deny-all ingress policy in every production namespace to establish a

### 16. Horizontal Pod Autoscaler (HPA) vs. Vertical Pod Autoscaler (VPA): Algorithms, KEDA custom metrics, and avoiding scaling conflicts.
### Autoscaling Architecture & Algorithms
Kubernetes provides two mechanisms for workload autoscaling: hori

### 17. Cluster Autoscaling & Karpenter: Kubernetes Cluster Autoscaler vs. Karpenter just-in-time node provisioning.
### Node Autoscaling: The Paradigm Shift
When Pods cannot schedule due to insufficient CPU/Memory (`PodStatus: Pending`), a cluster autoscaler must launch new virtual machines.

```
1. Legacy Kubernetes Cluster Autoscaler:
   [ Pending Pod ] ---> [ K8s Autoscaler ] ---> [ AWS Auto Scaling Group (ASG) ] ---> [ EC2 Launch ]
   Bottleneck: Bound to static ASG node groups; takes 3-7 minutes to initiali

### 18. Resource Requests, Limits, and Quality of Service (QoS) Classes: Guaranteed vs. Burstable vs. BestEffort.
### Scheduling vs. Runtime Enforcement
Kubernetes manages CPU and Memory using two parameters: **Requests** (guaranteed reservation used by Scheduler) and **Limits** (enforced ceiling at runtime).

```
                   +-----------------------------------------------+
                   |                  MEMORY                      |
                   | Request = 512Mi           Limit = 1024Mi      |
                   +-----------------------------------------------+
                   [ Guaranteed Memory ]       [ Burstable Room ]  | Exceed Limit -> OOMKilled!

                   +-----------------------------------------------+
                   |                   CPU                         |
                   | Request = 500m (0.5 core) Limit = 1000m (1 core)
                   +-----------------------------------------------+
                   [ Guaranteed Cycles ]       [ Burstable Cycles] | Exceed Limit -> CFS Throttled!
```

#### QoS Classes Comparison
Kubernetes assigns a Quality of Service (QoS) class based on how requests and limits are defined:
| QoS Class | Condition | Eviction Priority Under Node Memory Pressure |
| :--- | :--- | :--- |
| **Guaranteed** | Every container has `requests == limits` for both CPU and Memory. | **Lowest eviction priority** (last to be killed). Reserved for critical databases and core services. |
| **Burstable** | `requests < limits`, or only requests are specified. | **Medium eviction priority**. Most common for web APIs and microservices. |
| **BestEffort** | No requests or limits specified at all. | **Highest eviction priority** (first to be killed instantly when node memory tightens). |

#### CPU Throttling vs. Memory OOM
- **CPU is a compressible resource**: If a container exceeds its CPU limit, Linux does not kill it. Instead, the kernel Completely Fair Scheduler (CFS) restricts CPU cycles (*CPU throttling*), resulting in increased latency.
- **Memory is an incompressible resource**: If a container exceeds its memory limit, the Linux kernel terminates the process immediately with an out-of-memory error (`OOMKilled` / exit code 137).

---

### 19. Pod Disruption Budgets (PDB): Protecting high availability during voluntary disruptions and node drains.
### High Availability Under Maintenance
Cluster maintenance operations (node draining, Kubernetes version upgrades, spot instance terminations) are **voluntary disruptions**. Without a **PodDisruptionBudget (PDB)**, an engineer or automated script running `kubectl drain node-1` could terminate all replicas simultaneously, taking down production.

```
[ Cluster Admin / Script: kubectl drain node ]
                     |
                     v
+-------------------------------------------------------+
|              API Server Eviction Subresource          |
|                                                       |
|   Evaluates PodDisruptionBudget (PDB):                |
|   "At least 80% of payment-api pods MUST stay alive"  |
+-------------------------------------------------------+
          /                                   \
 [ Replicas Healthy: 5/5 ]           [ Replicas Healthy: 4/5 ]
 Eviction ALLOWED (4/5 = 80%)        Eviction BLOCKED / QUEUED!
 (Node drains safely)                (Waits for new Pod to be ready)
```

#### Production PDB Blueprint
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: payment-api-pdb
  namespace: production
spec:
  minAvailable: 80% # Or fixed number: minAvailable: 2
  selector:
    matchLabels:
      app: payment-api
```

#### Key PDB Rules
- **`minAvailable` vs `maxUnavailable`**: Define either a percentage (`80%`) or an absolute integer (`1`).
- If a drain request would violate the budget, the eviction request fails with HTTP 429 (Too Many Requests), and the drain controller retries until new replicas become ready on another node.

---

### 20. Zero-Downtime Rolling Updates: maxSurge, maxUnavailable, readiness gates, and preStop socket draining.
### Architecture of a True Zero-Downtime Deployment
A rolling update replaces old Pods (v1) with new Pods (v2) incrementally. To ensure

### 21. Service Mesh Architecture: When to adopt Istio vs. Linkerd, sidecar injection vs. Ambient Mesh, and mTLS.
### Architecture & Trade-Offs
A **Service Mesh** is a dedicated infrastructure layer that provides traffic management, security (mutual TLS), and observability across microservices without modifying application code.

```
1. Sidecar Pattern (Traditional):
   +------------------------------------+    +------------------------------------+
   |               Pod A                |    |               Pod B                |
   | [ App Code ] <-> [ Envoy Sidecar ] | == | [ Envoy Sidecar ] <-> [ App Code ] |
   +------------------------------------+    +------------------------------------+
   Overhead: High memory consumption (1 Envoy per Pod); complex init-container routing.

2. Ambient Mesh (Sidecar-less):
   [ Pod A ] --------------------------- mTLS ---------------------------> [ Pod B ]
       |                                                                        |
   [

### 22. Kubernetes RBAC: Roles, ClusterRoles, ServiceAccounts, and least-privilege token protection.
### Access Control Architecture
Kubernetes Role-Based Access Control (RBAC) maps **Subjects** (Users, Groups, ServiceAccounts) to **Roles** (rules of API actions) via **RoleBindings**.

```
+-----------------------+               +-----------------------+
|  Subject: User/App    |               |  API Permissions      |
|  - ServiceAccount: api|               |  - Resources: pods    |
+-----------------------+               |  - Verbs: get, list   |
            |                           +-----------------------+
            |                                       |
            v                                       v
+---------------------------------------------------------------+
|                       RoleBinding                             |
|           Binds Subject to Role within "production"           |
+---------------------------------------------------------------+
```

#### Scope Comparison
| Object | Scope | Description |
| :--- | :--- | :--- |
| **`Role`** | Single Namespace | Grants permissions within a specific namespace (e.g. read configmaps in `production`). |
| **`ClusterRole`** | Cluster-Wide | Grants permissions across all namespaces or for cluster-scoped resources (e.g. Nodes, PVs, Namespaces). |
| **`RoleBinding`** | Single Namespace | Grants Role or ClusterRole permissions **within that namespace only**. |
| **`ClusterRoleBinding`** | Cluster-Wide | Grants ClusterRole permissions **across all namespaces cluster-wide**. |

#### Production Hardening: Securing ServiceAccount Tokens
By default, Kubernetes mounts a long-lived JWT ServiceAccount token into every container at `/var/run/secrets/kubernetes.io/serviceaccount/token`. If an attacker breaches the container, they can steal this token to query the API server.
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secured-web-app
spec:
  # Disable automatic token mounting if the app does not interact with K8s API
  automountServiceAccountToken: false
  serviceAccountName: limited-sa
```

---

### 23. Custom Resource Definitions (CRDs) & The Operator Pattern: The Reconcile Loop in Go/controller-runtime.
### Extending the Kubernetes API
A **Custom Resource Definition (CRD)** teaches the Kubernetes API Server a new object schema (e.g. `DatabaseCluster`). The **Operator Pattern** combines a CRD with a custom Controller that runs an ongoing **Reconcile Loop** to automate human operational domain knowledge (backups, failover, upgrades).

```
User applies CRD:
[ kubectl apply -f postgres-cluster.yaml ]
                 |
                 v
[ kube-apiserver ] ---> Writes CRD to etcd
                 |
                 v (Informer watches event)
+-------------------------------------------------------+
| Custom Operator Controller Loop                       |
|                                                       |
|   1. Observe: Read desired state from CRD             |
|   2. Compare: Query actual state (Running Pods/PVCs)  |
|   3. Reconcile: If mismatch:                          |
|      - Provision new Replica Pod                      |
|      - Execute WAL replication command                |
|      - Update CRD status: "Healthy"                   |
+-------------------------------------------------------+
```

#### The Reconcile Function in Go (`controller-runtime`)
```go
func (r *DatabaseReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    // 1. Fetch the Database instance
    var db customv1.Database
    if err := r.Get(ctx, req.NamespacedName, &db); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }

    // 2. Check if underlying StatefulSet exists
    var sts appsv1.StatefulSet
    err := r.Get(ctx, req.NamespacedName, &sts)
    if errors.IsNotFound(err) {
        // 3. Desired state does not exist: Create it
        newSts := r.buildStatefulSet(&db)
        if err := r.Create(ctx, newSts); err != nil {
            return ctrl.Result{}, err
        }
        return ctrl.Result{Requeue: true}, nil
    }

    // 4. Update status subresource
    db.Status.ReadyReplicas = sts.Status.ReadyReplicas
    _ = r.Status().Update(ctx, &db)

    return ctrl.Result{RequeueAfter: time.Minute * 5}, nil
}
```

---

### 24. How do you systematically troubleshoot CrashLoopBackOff, ImagePullBackOff, and Pending Pods?
### Step-by-Step Production Troubleshooting Guide
When a Pod fails to reach `Running` state, execute this diagnostic flow before making code or configuration changes.

```
[ Pod Status Abnormal ]
          |
          +---> [ Pending ] --------> 1. kubectl describe pod (Check Scheduler Events, CPU/Mem, Affinity)
          |
          +---> [ ImagePullBackOff ] -> 2. Check Image Name, Tag, and imagePullSecrets
          |
          +---> [ CrashLoopBackOff ] -> 3. kubectl logs --previous (Inspect crash stack trace)
```

#### Diagnostic Checklist Matrix
| Error State | Root Cause | Immediate Diagnostic Command | Fix Action |
| :--- | :--- | :--- | :--- |
| **`Pending`** | Node resources exhausted, node selector mismatch, or unfulfilled PVC. | `kubectl describe pod <pod> | grep -A 10 Events:` | Add worker nodes via Karpenter, lower CPU/memory requests, or check PVC binding. |
| **`ImagePullBackOff`** | Tag typo, non-existent repository, or registry authentication failure. | `kubectl describe pod <pod>` | Verify image tag; check `imagePullSecrets` for private registries (ECR/DockerHub). |
| **`CrashLoopBackOff`** | Container starts, encounters fatal error (exit code 1 or 137), and exits. | `kubectl logs <pod> --previous` | Inspect application logs just before crash; verify DB connection strings and config files. |
| **`CreateContainerConfigError`**| Missing ConfigMap or Secret referenced in Pod spec. | `kubectl describe pod <pod>` | Create the missing ConfigMap/Secret or fix key names. |

#### Pro-Tip: Ephemeral Debug Containers
For distroless or hardened containers without a shell, attach an interactive debug container directly into the pod’s network and process namespace:
```bash
kubectl debug -it <crashing-pod> --image=nicolaka/netshoot --target=app-container
```

---

### 25. Multi-Tenant Cluster Isolation: ResourceQuotas, LimitRanges, NetworkPolicies, and Virtual Clusters (vcluster).
### Hard vs. Soft Multi-Tenancy
When multiple teams share a single physical Kubernetes cluster, the platform team must implement boundaries to prevent noisy neighbors and security breaches.

```
+-------------------------------------------------------------------------------+
|                         Shared Physical EKS / GKE Cluster                     |
|                                                                               |
|   +-------------------------------+       +-------------------------------+   |
|   | Namespace: team-alpha         |       | Namespace: team-beta          |   |
|   | - ResourceQuota: max 16 Cores |       | - ResourceQuota: max 32 Cores |   |
|   | - LimitRange: default 500m    |       | - LimitRange: default 1 Core  |   |
|   | - NetworkPolicy: Deny Ingress | <---X | - NetworkPolicy: Deny Ingress |   |
|   +-------------------------------+       +-------------------------------+   |
|                                                                               |
|   [ Advanced Isolation: vcluster (Virtual API Server & etcd inside a Pod) ]   |
+-------------------------------------------------------------------------------+
```

#### Multi-Tenancy Guardrail Stack
1. **ResourceQuota**: Limits the aggregate compute consumption of a namespace (e.g. max 32 cores, 64Gi RAM, max 20 LoadBalancer services).
2. **LimitRange**: Sets default and minimum/maximum resource constraints on individual containers in a namespace if developers omit them.
3. **NetworkPolicy**: Isolates inter-namespace communication (blocks Team Beta from accessing Team Alpha’s Redis instance).
4. **Virtual Clusters (vcluster)**: Runs a lightweight virtual control plane (API Server and SQLite/etcd) inside a single namespace on the host cluster. Tenants get full `cluster-admin` rights to create CRDs and namespaces without risk of compromising the underlying physical cluster.

---

## Part 4: CI/CD Pipelines, GitOps & Progressive Delivery (36 - 42)

