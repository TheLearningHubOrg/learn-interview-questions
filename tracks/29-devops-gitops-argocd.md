# GitOps, ArgoCD & Progressive Delivery Master Interview Bank (1 - 35)

> GitOps core principles, ArgoCD architecture, Application & ApplicationSet CRDs, drift detection, self-healing, External Secrets Operator, Argo Rollouts (Canary & Blue-Green), and multi-cluster Kubernetes operations.

---

## Part 1: GitOps Fundamentals & Core Principles (Junior / Entry-Level)

### 1. What is GitOps and what are the four OpenGitOps core principles?
**In Simple Words:**
**GitOps** is an operational framework that takes DevOps best practices (version control, collaboration, compliance, and CI/CD) and applies them to infrastructure and application deployment on Kubernetes. In GitOps, **Git is the single source of truth** for the desired state of your systems.

#### The 4 OpenGitOps Core Principles:
1. **Declarative**: The desired state of the system must be described declaratively (e.g., Kubernetes YAML, Helm, Kustomize), not procedurally.
2. **Versioned and Immutable**: Desired state is stored in a version control system (Git), providing an immutable commit history, auditing, and rollback capabilities.
3. **Pulled Automatically**: Software agents (like ArgoCD) running inside the target environment automatically pull the desired state from Git.
4. **Continuously Reconciled**: Agents continuously monitor the live state and apply corrective action if live state drifts from the desired Git state.

---

### 2. Compare Pull-Based (GitOps) vs Push-Based (Traditional CI/CD).
**In Simple Words:**
| Dimension | Traditional Push-Based (e.g. Jenkins / GitHub Actions) | GitOps Pull-Based (e.g. ArgoCD) |
| :--- | :--- | :--- |
| **Execution Vector** | CI pipeline runs `kubectl apply` from outside the cluster | An agent *inside* the cluster polls Git and reconciles |
| **Cluster Credentials** | Sensitive cluster admin credentials must be given to external CI | Cluster credentials **never leave the cluster** |
| **Firewall Ports** | Inbound network port (Kubernetes API 6443) must be open to CI | Only **outbound HTTPS** access to GitHub is required |
| **Drift Correction** | If an engineer modifies a pod with `kubectl`, CI doesn't know | ArgoCD detects drift instantly and automatically overwrites it |
| **Security Risk** | High (compromised CI pipeline compromises the entire cluster) | Minimal (external systems cannot push code to the cluster) |

```
── Push Model (Legacy) ──
[ GitHub Actions ] ──(Needs Cluster Admin Kubeconfig)──► [ Kubernetes API ]

── Pull Model (GitOps) ──
[ Git Repo (Source of Truth) ]
         ▲
         │ (Outbound Poll via HTTPS / SSH)
[ ArgoCD inside Kubernetes ] ──(Local Internal Apply)──► [ Cluster Resources ]
```

---

### 3. Explain the internal architecture of ArgoCD.
**In Simple Words:**
ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes implemented as a set of Kubernetes controllers and services:

#### Core Components:
1. **API Server**: gRPC/REST server that exposes the Web UI, CLI, and handles user authentication, RBAC, and credentials.
2. **Repository Server (`argocd-repo-server`)**: Internal service that clones Git repositories, parses Helm charts or Kustomize overlays, and generates raw Kubernetes manifests in memory.
3. **Application Controller (`argocd-application-controller`)**: The heart of ArgoCD. It continuously compares the live cluster state (from Kubernetes API) with the target state (from Repo Server) and executes reconciliation loops.
4. **Redis**: In-memory cache for repository manifests, cluster state, and tokens to reduce load on Kubernetes API and Git servers.
5. **Dex**: Bundled identity service for OIDC/OAuth authentication (Okta, GitHub, Google, Keycloak).

---

### 4. What is the ArgoCD `Application` CRD?
**In Simple Words:**
The `Application` Custom Resource Definition (CRD) is the primary resource in ArgoCD. It binds a Git repository source to a target Kubernetes cluster destination.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payment-service
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/enterprise/k8s-manifests.git'
    targetRevision: main
    path: overlays/production
  destination:
    server: 'https://kubernetes.default.svc' # Local in-cluster
    namespace: payments
  syncPolicy:
    automated:
      prune: true     # Deletes resources removed from Git
      selfHeal: true  # Overwrites manual changes made via kubectl
    syncOptions:
      - CreateNamespace=true
```

---

### 5. What are `prune` and `selfHeal` in ArgoCD sync policies?
**In Simple Words:**
- **`prune: true`**: When an engineer deletes a Kubernetes YAML file from the Git repository, ArgoCD will actively delete the corresponding live resource from the Kubernetes cluster. (If `prune: false`, the deleted file remains running in the cluster as an orphaned object).
- **`selfHeal: true`**: If an operator manually runs `kubectl edit deployment` or deletes a service directly in the cluster, ArgoCD detects the discrepancy within seconds and automatically re-applies the Git manifest, overwriting the rogue manual change.

---

### 6. What is Configuration Drift and how does ArgoCD detect it?
**In Simple Words:**
**Configuration Drift** happens when the running state of a Kubernetes cluster diverges from the version-controlled configuration in Git (caused by manual emergency hotfixes, rogue scripts, or malicious actors).
- ArgoCD continuously monitors Kubernetes API watch events.
- It normalizes both the live object and the Git-rendered object (ignoring dynamic runtime fields like `status` or `creationTimestamp`).
- If an unauthorized difference is detected, the application status turns **OutOfSync**, and if `selfHeal` is enabled, ArgoCD restores the Git configuration immediately.

---

### 7. How do Helm and Kustomize fit into GitOps workflows?
**In Simple Words:**
Writing raw, static Kubernetes YAML for multiple environments (dev, staging, prod) leads to thousands of duplicate lines.
- **Kustomize**: Uses a base directory with declarative patches (`overlays/dev`, `overlays/prod`) without templating languages. ArgoCD natively executes Kustomize to render environment-specific manifests.
- **Helm**: Parameterizes Kubernetes manifests using Go templates and `values.yaml`. ArgoCD can pull Helm charts from OCI registries or Git, pass custom values files, and render the output without needing Tiller or Helm server-side state.

---

### 8. What is the difference between Mono-Repo vs Multi-Repo in GitOps?
**In Simple Words:**
- **App Repo vs Config Repo Separation**: Best practice is to keep Application Source Code (`app-service/`) in one repo and Kubernetes GitOps Manifests (`app-k8s-config/`) in a dedicated repository. This prevents CI pipeline loops (building Docker images doesn't dirty the code repo) and separates developer permissions from infrastructure deployment permissions.
- **Mono-Repo for Config**: Storing all microservices manifests in one GitOps repo simplifies visibility, shared Kustomize bases, and cluster-wide migrations.
- **Multi-Repo for Config**: Each service owns its GitOps config repo, offering stricter RBAC boundary isolation at enterprise scale.

---

### 9. What are ArgoCD Application Health States?
**In Simple Words:**
ArgoCD assesses whether the pods and controllers underlying an Application are working properly:
- **Healthy**: All pods are running, probes passing, replicas match desired count.
- **Progressing**: Pods are currently pulling images, initializing, or undergoing a rolling update.
- **Degraded**: Pods are in `CrashLoopBackOff`, failing readiness probes, or resources cannot be scheduled.
- **Suspended**: Deployment is paused (e.g. during an Argo Rollout step).
- **Missing**: The declared resource does not exist in the cluster.
- **Unknown**: ArgoCD cannot communicate with the cluster or API server.

---

### 10. How do Sync Phases and Sync Waves work in ArgoCD?
**In Simple Words:**
By default, Kubernetes creates resources in arbitrary order. In complex architectures, database schemas must migrate *before* backend pods boot up, and CRDs must be created *before* custom resources.
- **Sync Waves (`argocd.argoproj.io/sync-wave: "1"`)**: Orders resource creation. ArgoCD synchronizes wave 0, waits for all resources to become `Healthy`, and only then initiates wave 1. Waves can be negative (`-1`) or positive (`5`).

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
  annotations:
    argocd.argoproj.io/sync-wave: "-1" # Runs BEFORE app deployment
```

---

### 11. What are ArgoCD Resource Hooks?
**In Simple Words:**
Resource Hooks run custom scripts or Kubernetes Jobs at designated milestones during the synchronization process:
- **`PreSync`**: Runs before applying manifests (e.g. DB backup, schema migration).
- **`Sync`**: Applied alongside regular manifests.
- **`PostSync`**: Runs after manifests apply and become healthy (e.g. integration smoke tests, cache warmup).
- **`SyncFail`**: Runs if the synchronization process encounters a failure (e.g. triggering an incident alert or rollback notification).

---

### 12. How do you roll back a deployment in GitOps?
**In Simple Words:**
In a true GitOps workflow, you **never click "Rollback" in the ArgoCD UI**!
Because Git is the single source of truth, clicking rollback in the UI causes live state to drift from Git, which `selfHeal` will promptly undo.
To perform a true GitOps rollback:
Run `git revert <bad-commit-hash>` and push to the `main` branch. ArgoCD detects the new commit and rolls the cluster back cleanly, leaving an immutable audit trail of the rollback.

---

## Part 2: ArgoCD at Scale & Progressive Delivery (Mid-Level)

### 13. What is the ArgoCD `ApplicationSet` CRD?
**In Simple Words:**
Managing 500 individual `Application` YAMLs manually is unmaintainable.
**`ApplicationSet`** is a controller that automates the generation of ArgoCD `Application` resources using **Generators**:
1. **List Generator**: Generates applications based on a fixed list of environments.
2. **Git Directory Generator**: Scans a Git repository and creates an application for every subfolder.
3. **Cluster Generator**: Automatically deploys applications to all clusters labeled with `env: production` registered in ArgoCD.
4. **Matrix Generator**: Combines multiple generators (e.g., all clusters × all microservices).

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: microservices
  namespace: argocd
spec:
  generators:
    - git:
        repoURL: https://github.com/enterprise/gitops.git
        revision: main
        directories:
          - path: services/*
  template:
    metadata:
      name: '{{path.basename}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/enterprise/gitops.git
        targetRevision: main
        path: '{{path}}'
      destination:
        server: https://kubernetes.default.svc
        namespace: '{{path.basename}}'
```

---

### 14. How do you manage Secrets in GitOps without exposing plaintext in Git?
**In Simple Words:**
Checking plaintext passwords, API keys, or private certificates into Git is a severe security violation.

#### Industry Solutions:
1. **External Secrets Operator (ESO) (Recommended)**: Store secrets in AWS Secrets Manager, HashiCorp Vault, or Google Secret Manager. Commit a declarative `ExternalSecret` manifest to Git. ESO pulls the secret from the cloud provider inside the cluster and creates a native Kubernetes `Secret`.
2. **Sealed Secrets (Bitnami)**: Encrypt secrets client-side using a public key. The encrypted `SealedSecret` can safely sit in a public Git repository; only the in-cluster Sealed Secrets controller holds the private key to decrypt it into a Kubernetes `Secret`.
3. **Mozilla SOPS**: Encrypts secret values inside YAML files using KMS keys (AWS KMS, GCP KMS, PGP).

```yaml
# ExternalSecret committed safely to Git
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: database-credentials
spec:
  secretStoreRef:
    name: aws-secrets-manager
    kind: ClusterSecretStore
  target:
    name: db-secret # Native K8s Secret created inside cluster
  data:
    - secretKey: password
      remoteRef:
        key: prod/rds/mysql
        property: db_password
```

---

### 15. How does ArgoCD manage Multi-Cluster Deployments?
**In Simple Words:**
ArgoCD can operate from a single "control plane" Kubernetes cluster and manage hundreds of remote target clusters.
- You register remote clusters via `argocd cluster add <kube-context>`.
- ArgoCD creates a dedicated `ServiceAccount` with RBAC permissions inside the remote cluster.
- When an `Application` specifies `destination.server: https://remote-k8s-api:6443`, the central ArgoCD controller connects over HTTPS and manages resources remotely.

---

### 16. What is the role of ArgoCD `AppProject`?
**In Simple Words:**
`AppProject` provides multi-tenancy and logical isolation within ArgoCD:
- **Restricts Source Repos**: Only allow applications to pull from approved Git repositories.
- **Restricts Target Destinations**: Ensure a developer team cannot deploy into the `kube-system` namespace or production clusters.
- **Resource Whitelist/Blacklist**: Prevent applications from creating cluster-wide resources (ClusterRoles, CustomResourceDefinitions) while allowing Namespaced Deployments.
- **Project-Level Roles & JWT Tokens**: Scoped access for automation pipelines.

---

### 17. What is Argo Rollouts and how does it surpass standard Kubernetes Deployments?
**In Simple Words:**
Standard Kubernetes `Deployment` only supports basic rolling updates (which offer no traffic shaping, no automated metric validation, and no progressive canary analysis).
**Argo Rollouts** is a drop-in replacement controller for Kubernetes `Deployment` that introduces:
- **Canary Deployments** (routing 5%, 20%, 50% traffic via Service Mesh).
- **Blue-Green Deployments** (instant cutover with preview environments).
- **Automated Metric Analysis** (Prometheus, Datadog queries).
- **Automated Rollback** if latency or error rates violate thresholds.

---

### 18. How does Metric-Based Automated Canary Analysis work in Argo Rollouts?
**In Simple Words:**
During a canary release, Argo Rollouts executes `AnalysisTemplate` queries against your monitoring system (Prometheus, Datadog, New Relic) at each step. If the query fails, the rollout immediately aborts and restores 100% traffic to the stable version!

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: order-service
spec:
  replicas: 10
  strategy:
    canary:
      analysis:
        templates:
          - templateName: success-rate-check
      steps:
        - setWeight: 10
        - pause: { duration: 10m }
        - setWeight: 50
        - pause: { duration: 15m }
---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate-check
spec:
  metrics:
  - name: error-rate
    interval: 60s
    successCondition: result[0] <= 0.01 # Error rate must be under 1%
    failureLimit: 3
    provider:
      prometheus:
        address: http://prometheus-server.monitoring:9090
        query: sum(rate(http_requests_total{status=~"5.*"}[1m])) / sum(rate(http_requests_total[1m]))
```

---

### 19. How does Traffic Routing work with Service Meshes in Argo Rollouts?
**In Simple Words:**
Without a service mesh, routing 10% traffic requires running 1 canary pod and 9 stable pods.
Argo Rollouts integrates with **Istio**, **NGINX Ingress**, **Linkerd**, or **AWS ALB** to split HTTP traffic at the network proxy layer based on exact percentages or HTTP headers, regardless of replica counts!

---

### 20. How do you integrate ArgoCD Notifications?
**In Simple Words:**
`argocd-notifications` monitors application events (e.g., `app-sync-failed`, `app-health-degraded`, `app-deployed`) and dispatches formatted webhooks, Slack messages, Microsoft Teams cards, or PagerDuty alerts using trigger annotations:

```yaml
metadata:
  annotations:
    notifications.argoproj.io/subscribe.on-sync-failed.slack: devops-alerts
    notifications.argoproj.io/subscribe.on-deployed.slack: devops-deployments
```

---

### 21. Compare Flux v2 vs ArgoCD.
**In Simple Words:**
| Dimension | ArgoCD | Flux v2 |
| :--- | :--- | :--- |
| **Architecture** | Centralized application controller with Web UI & API server | Decentralized micro-controllers (Source, Kustomize, Helm, Notification) |
| **User Interface** | Powerful built-in Web UI with real-time dependency graphs | Minimalist CLI-first (third-party UI like Weave GitOps required) |
| **Complexity** | Monolithic controller design, easier setup for enterprise UI users | UNIX philosophy, highly modular and composable |
| **Multi-Tenancy** | Excellent native UI RBAC and AppProjects | Kubernetes-native RBAC and namespace isolation |

---

### 22. How do you handle Disaster Recovery (DR) in GitOps?
**In Simple Words:**
If an entire AWS region fails or a Kubernetes cluster is accidentally deleted:
1. Spin up a fresh, empty Kubernetes cluster via Terraform.
2. Install ArgoCD via Helm.
3. Apply a single root `root-app.yaml` pointing to your GitOps repository.
4. ArgoCD connects, pulls the complete declarative state, and automatically recreates all 500 microservices, Ingresses, ConfigMaps, and secrets in minutes!

---

### 23. What are the best practices for managing Helm Values in GitOps?
**In Simple Words:**
- Keep third-party Helm chart repositories external (e.g. Bitnami, Redis, Ingress-NGINX).
- Store only your custom `values-dev.yaml`, `values-staging.yaml`, and `values-prod.yaml` files inside your Git repository.
- Avoid using `helm install --set key=value` which bypasses version control.

---

### 24. How do you handle database migrations safely in GitOps?
**In Simple Words:**
Database migrations are stateful and irreversible, while GitOps is designed for declarative, repeatable states.
- Run database migrations inside an ArgoCD `PreSync` Kubernetes Job.
- Ensure all database schema changes are backward-compatible (expand before contract).
- If the `PreSync` migration Job fails, ArgoCD stops the sync immediately, preventing the new application pods from ever deploying!

---

## Part 3: Enterprise Scale, Security & Edge GitOps (Senior / Staff)

### 25. How do you prevent Infinite Reconciliation Loops in ArgoCD?
**In Simple Words:**
An infinite loop occurs when ArgoCD applies a manifest, an external Kubernetes mutating webhook (e.g. Istio sidecar injector, Kyverno, or HashiCorp Vault agent) mutates the live object, and ArgoCD detects this mutation as "drift" and tries to re-apply, repeating infinitely.

#### Solution:
Use `ignoreDifferences` in the `Application` spec to tell ArgoCD to ignore fields controlled by mutating webhooks:

```yaml
spec:
  ignoreDifferences:
    - group: apps
      kind: Deployment
      jsonPointers:
        - /spec/template/metadata/annotations/vault.hashicorp.com~1agent-inject
        - /spec/template/spec/containers/0/resources
```

---

### 26. How do you scale ArgoCD to 10,000+ Applications?
**In Simple Words:**
1. **Sharding Application Controller**: Run multiple replicas of `argocd-application-controller` using statefulset sharding (`ARGOCD_CONTROLLER_REPLICAS=5`). Each shard processes a partition of clusters.
2. **Tune Repo Server**: Scale `argocd-repo-server` horizontally, increase Git clone timeout, and configure local Git repository disk caches.
3. **Webhook Notifications**: Instead of ArgoCD polling Git every 3 minutes (which triggers thousands of git fetches), configure GitHub Webhooks to notify ArgoCD immediately upon commit.

---

### 27. How do you enforce Policy as Code with Kyverno or Gatekeeper in GitOps?
**In Simple Words:**
GitOps ensures what is in Git gets deployed, but does not prevent a developer from committing an insecure manifest (e.g. running containers as `root` or missing CPU limits).
- **Shift-Left in CI**: Run `conftest` or `kyverno-cli test` inside GitHub Actions to fail PRs that violate security policies before they are merged.
- **In-Cluster Admission Control**: Kyverno or OPA Gatekeeper runs in Kubernetes and blocks non-compliant resources even if ArgoCD attempts to apply them.

---

### 28. How do you implement Dynamic Ephemeral Preview Environments with ArgoCD?
**In Simple Words:**
When a developer opens a pull request, you can automatically spin up a dedicated test environment:
- Use the `ApplicationSet` **Pull Request Generator** targeting your GitHub organization.
- For every open PR, it dynamically instantiates an isolated namespace `pr-1234` running the branch's preview container.
- When the PR is merged or closed, ArgoCD destroys the namespace and all associated cloud resources automatically.

---

### 29. How do you achieve Zero-Trust GitOps with GPG and Cosign?
**In Simple Words:**
1. **GPG Commit Verification**: Configure the ArgoCD Repo Server with the public GPG keys of authorized engineers. ArgoCD will refuse to sync any manifest if the Git commit was not cryptographically signed (`git commit -S`) by a verified engineer.
2. **Container Image Attestation**: Integrate Cosign with in-cluster admission webhooks so that only container images signed by your enterprise CI pipeline can run.

---

### 30. How do you manage Infrastructure with GitOps using Crossplane?
**In Simple Words:**
While ArgoCD natively deploys Kubernetes manifests, **Crossplane** extends Kubernetes with Custom Resource Definitions that represent cloud infrastructure (AWS S3, RDS, DynamoDB, VPC).
By pairing ArgoCD with Crossplane, engineers declare an entire cloud application and its underlying AWS database in a single GitOps repository, reconciled continuously by Kubernetes controllers!

---

### 31. How do you prevent and audit manual `kubectl` backdoor overrides?
**In Simple Words:**
- In strict GitOps environments, remove cluster-admin `write` access for all human developers. Human access should be strictly `read-only` (`kubectl get`, `kubectl logs`).
- All changes must go through a Git Pull Request with peer approvals.
- Enable ArgoCD `selfHeal: true` so that even if a developer with elevated emergency access edits a deployment, it is reverted back to the Git state within seconds.

---

### 32. What is Edge GitOps and how do you handle intermittent connectivity?
**In Simple Words:**
Deploying Kubernetes to 1,000 retail stores or 5G cell towers with erratic internet connections:
- Run a standalone, lightweight ArgoCD or Flux controller locally inside each edge cluster (K3s).
- The edge controller polls Git when internet is available.
- If internet connection drops for 3 days, the edge cluster continues running stably without depending on a central cloud control plane.

---

### 33. How do you configure High Availability (HA) for ArgoCD?
**In Simple Words:**
Deploy ArgoCD using its official HA manifests:
1. **Redis HA with Sentinel**: 3 Redis nodes managed by Sentinel for automatic failover.
2. **Replicated Controllers**: 2+ replicas of `argocd-server`, `argocd-repo-server`, and `argocd-dex-server` behind a Kubernetes Service.
3. **Application Controller**: Active-active sharding partitioned across clusters.

---

### 34. How do you handle Stateful Applications and PVCs in GitOps?
**In Simple Words:**
When an `Application` containing a `PersistentVolumeClaim` is pruned, deleting the PVC can cause catastrophic data loss!
Add the retention annotation to sensitive stateful manifests:
```yaml
metadata:
  annotations:
    helm.sh/resource-policy: keep
    argocd.argoproj.io/sync-options: Delete=false
```
This tells ArgoCD to delete pods and services during tear-down, but **never delete the underlying persistent disk storage**.

---

### 35. What is the role of GitOps in modern Internal Developer Platforms (IDPs)?
**In Simple Words:**
Modern platform engineering teams integrate GitOps with developer portals like **Spotify Backstage**:
1. A developer clicks "Create New Go Microservice" in Backstage.
2. Backstage scaffolds the repository and opens a GitOps PR adding the new service to the cluster's `ApplicationSet`.
3. The PR is merged, ArgoCD provisions the deployment, secrets, and DNS automatically.
4. The developer gets a running production URL in under 2 minutes without writing a single line of Kubernetes YAML.
