# CI/CD Pipelines & GitHub Actions Master Interview Bank (1 - 35)

> Continuous Integration & Continuous Delivery (CI/CD) pipelines, GitHub Actions workflow syntax, runners, OIDC keyless authentication, SLSA supply chain security, matrix builds, DORA metrics, and enterprise pipeline hardening.

---

## Part 1: CI/CD Fundamentals & GitHub Actions Core (Junior / Entry-Level)

### 1. What is CI/CD and what are the differences between Continuous Integration, Continuous Delivery, and Continuous Deployment?
**In Simple Words:**
- **Continuous Integration (CI)**: The engineering practice of frequently committing code to a shared repository (multiple times a day), where automated pipelines build, lint, and run automated tests. The goal is to detect integration bugs immediately.
- **Continuous Delivery (CD)**: An extension of CI where code changes are automatically built, tested, and packaged into production-ready deployable artifacts (e.g. Docker images, binaries). Releasing to production requires a **manual approval/trigger**.
- **Continuous Deployment (CD)**: Fully automated end-to-end pipeline where every change that passes all stages is deployed straight into **live production without manual human intervention**.

```
[ Developer Commit ]
        │
        ▼
┌──────────────────┐
│ Continuous       │ ──► Lint, Unit Tests, Static Analysis, Build
│ Integration (CI) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Continuous       │ ──► Integration Tests, Security Scan, Staging Deploy
│ Delivery (CD)    │
└────────┬─────────┘
         │
         ├───► Manual Approval Button ──► Production Release (Delivery)
         │
         └───► Automated Deployment  ──► Live Production (Continuous Deployment)
```

---

### 2. Explain the fundamental components of a GitHub Actions workflow.
**In Simple Words:**
GitHub Actions automation is defined in YAML files located inside `.github/workflows/`.

#### Core Building Blocks:
1. **Workflows**: Configured automated processes made of one or more jobs (e.g., `ci.yml`).
2. **Events / Triggers (`on`)**: Specific activities that trigger the workflow (e.g., `push`, `pull_request`, `schedule`).
3. **Jobs**: A set of steps executed on the same runner. Jobs run in **parallel by default**, unless sequenced with `needs: [job_id]`.
4. **Runners**: Virtual machines or containers executing the jobs (e.g., `runs-on: ubuntu-latest`).
5. **Steps**: Individual tasks within a job. Can run shell commands (`run:`) or actions (`uses:`).
6. **Actions**: Standalone reusable commands packaged as open-source or custom scripts (e.g., `actions/checkout@v4`).

```yaml
# .github/workflows/ci.yml
name: Continuous Integration
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Run Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install & Test
        run: |
          npm ci
          npm test
```

---

### 3. What workflow triggers (`on:`) are supported by GitHub Actions?
**In Simple Words:**
GitHub Actions can trigger workflows on repository webhooks, manual triggers, and time-based schedules:
- `push`: Triggered on code pushes to specific branches or tags.
- `pull_request`: Triggered when PRs are opened, synchronized, or reopened.
- `workflow_dispatch`: Adds a manual "Run workflow" button in the GitHub UI with customizable input fields.
- `schedule`: Runs at specified cron intervals (e.g. `cron: '0 2 * * *'` for 2 AM daily).
- `repository_dispatch`: Triggered via external REST API webhooks from external systems (e.g. Jira, Slack, PagerDuty).
- `release`: Triggered when a new GitHub release or tag is published.

---

### 4. What is the difference between GitHub-Hosted Runners and Self-Hosted Runners?
**In Simple Words:**
| Dimension | GitHub-Hosted Runners | Self-Hosted Runners |
| :--- | :--- | :--- |
| **Management** | Completely managed by GitHub (Azure VMs) | Managed and patched by your internal DevOps team |
| **Clean Environment** | Fresh, ephemeral VM for every single job run | Persistent VM or auto-scaled container pods |
| **Network Access** | Public IP addresses (restricted access to private VPCs) | Resides inside your private VPC/Data Center with internal access |
| **Hardware** | Standard 2-core / 4-core (custom large runners paid) | Custom CPU, GPU, Apple Silicon, large RAM |
| **Cost** | Metered per-minute consumption | Infrastructure hosting cost |

---

### 5. How are secrets and environment variables managed securely?
**In Simple Words:**
- **Repository Secrets**: Encrypted values stored at the repository or organization level (e.g., API keys, deployment tokens). GitHub automatically masks secrets in console logs.
- **Environment Secrets**: Scoped to specific environments (e.g. `production`, `staging`). Access can be restricted by deployment branch policies and required approvers.
- **`GITHUB_TOKEN`**: A short-lived token automatically provisioned for each job. Its permissions should follow the principle of least privilege using top-level `permissions:`.

```yaml
permissions:
  contents: read
  packages: write
  id-token: write # Required for AWS OIDC

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production # Uses production secrets & requires approvals
    steps:
      - name: Deploy
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
        run: ./deploy.sh
```

---

### 6. How does caching work in GitHub Actions?
**In Simple Words:**
Downloading dependencies (like `node_modules` or `.m2`) from scratch on every run consumes network bandwidth and slows CI down.
- **`actions/setup-<runtime>` Built-In Cache**: Built-in caching flags (`cache: 'npm'`, `cache: 'pip'`, `cache: 'maven'`) are recommended for standard language setups.
- **`actions/cache@v4`**: Explicit caching for arbitrary directories based on a cache `key` (usually a hash of lockfiles). If the key matches, the directory is restored; otherwise, the job runs and saves the new cache.

```yaml
- name: Cache Gradle Dependencies
  uses: actions/cache@v4
  with:
    path: ~/.gradle/caches
    key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
    restore-keys: |
      ${{ runner.os }}-gradle-
```

---

### 7. What is the difference between Artifacts and Caches?
**In Simple Words:**
- **Cache (`actions/cache`)**: Reusable files intended to speed up future workflow runs (e.g. package managers, intermediate build objects). Caches can be evicted by GitHub if unused for 7 days or if total repository cache exceeds 10 GB.
- **Artifacts (`upload-artifact` / `download-artifact`)**: Permanent or long-lived deliverables produced by a workflow (e.g. compiled binaries, APKs, test reports, code coverage HTML). Artifacts can be passed between jobs in the same run and downloaded by human engineers from the GitHub UI.

---

### 8. How do conditional execution and status checks work?
**In Simple Words:**
The `if:` keyword evaluates boolean expressions to skip or execute specific steps or entire jobs.

#### Status Check Functions:
- `success()`: True if all previous steps succeeded (default).
- `always()`: Forces the step to execute even if prior steps failed or were cancelled (vital for cleanup or sending Slack notifications).
- `failure()`: Executes only if a preceding step in the job failed.
- `cancelled()`: Executes only if the workflow was aborted.

```yaml
- name: Send Slack Notification on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1.26.0
  with:
    payload: '{"text":"❌ Build failed on branch ${{ github.ref_name }}"}'
```

---

### 9. What are GitHub Contexts and Expressions?
**In Simple Words:**
Contexts are structured JSON objects containing information about workflow runs, runner environments, secrets, and repository state. They are accessed using the `${{ <expression> }}` syntax:
- `github`: Metadata about the run (`github.sha`, `github.actor`, `github.ref`, `github.event_name`).
- `env`: Environment variables defined in the workflow.
- `secrets`: Encrypted secrets.
- `matrix`: Current parameters in a matrix build.
- `steps`: Outputs and exit statuses of previous steps (`steps.<id>.outputs.<var>`).
- `runner`: Information about the executing runner (`runner.os`, `runner.arch`).

---

### 10. What are GitHub Environments and Deployment Protection Rules?
**In Simple Words:**
**Environments** model deployment targets (e.g., `development`, `staging`, `production`).
They provide enterprise governance controls:
1. **Required Reviewers**: High-risk deployments (like `production`) pause until designated leads or DevOps managers manually approve the release.
2. **Wait Timers**: Delays deployment execution by a specified number of minutes.
3. **Deployment Branches**: Restricts deployments so that only pushes from `main` or `release/*` can touch production secrets.

---

### 11. What is the difference between Composite Actions and Reusable Workflows?
**In Simple Words:**
Both promote DRY (Don't Repeat Yourself) automation across repositories:
- **Composite Action**: Combines multiple shell steps into a single reusable action (`action.yml`). It runs **inside an existing job** on the host runner.
- **Reusable Workflow (`workflow_call`)**: An entire standalone workflow (`.github/workflows/*.yml`) containing multiple jobs, its own runner environments, and secrets that can be invoked by caller workflows.

| Feature | Composite Action | Reusable Workflow |
| :--- | :--- | :--- |
| **File Type** | `action.yml` | `.github/workflows/name.yml` |
| **Trigger** | Executed as a step via `uses:` | Called as a job via `uses:` with `on: workflow_call` |
| **Can Define Multiple Jobs?** | No (steps only) | Yes (full multi-job pipelines) |
| **Secrets Access** | Must pass secrets as inputs | Can inherit via `secrets: inherit` |

---

### 12. How do Merge Queues and Required Status Checks safeguard the `main` branch?
**In Simple Words:**
- **Required Status Checks**: Ensure PRs cannot be merged until designated CI jobs (e.g. `test`, `security-scan`) report green status.
- **Merge Queue**: Solves the race condition where two developers merge branches that passed tests independently, but break when combined on `main`. The Merge Queue creates a speculative merge of queued PRs, tests them together, and only fast-forwards `main` if the unified state is green.

---

## Part 2: Advanced Workflows, Security & Containerization (Mid-Level)

### 13. How do Matrix Builds work and how do you customize them?
**In Simple Words:**
A matrix strategy spawns multiple jobs in parallel across combinations of operating systems, language versions, and environments.

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false # Do not abort other matrix jobs if one fails
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [18, 20, 22]
        exclude:
          - os: windows-latest
            node-version: 18 # Exclude unsupported combo
        include:
          - os: ubuntu-latest
            node-version: 22
            experimental: true # Add custom variable
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

---

### 14. What is Concurrency Control and why is `cancel-in-progress` crucial?
**In Simple Words:**
When a developer pushes 5 rapid commits to a pull request, running 5 full CI pipelines wastes compute minutes and runner slots.
`concurrency` groups workflows by branch or PR ID. Setting `cancel-in-progress: true` automatically aborts obsolete running pipelines the moment a newer commit arrives!

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

---

### 15. How does Keyless Cloud Authentication work with OpenID Connect (OIDC)?
**In Simple Words:**
Traditionally, CI pipelines needed hardcoded, long-lived AWS IAM access keys stored in GitHub Secrets. If leaked, attackers gained persistent cloud access.
With **OIDC**, GitHub acts as an Identity Provider (IdP):
1. The GitHub Runner requests a short-lived JSON Web Token (JWT) from GitHub's OIDC provider.
2. The runner presents this JWT to AWS Security Token Service (STS) or Google Cloud Workload Identity.
3. The cloud provider validates the token signature and repository claims (`repo:org/app:ref:refs/heads/main`).
4. If valid, the cloud provider issues **temporary credentials (valid for 1 hour)** without storing any static secrets in GitHub!

```yaml
permissions:
  id-token: write # Mandatory for requesting OIDC JWT
  contents: read

steps:
  - name: Configure AWS Credentials with OIDC
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsDeployRole
      aws-region: us-east-1
```

---

### 16. How do you run Containerized Jobs and Service Containers?
**In Simple Words:**
- `container:` forces the entire job to execute inside a specified Docker image rather than the host VM.
- `services:` provisions isolated background containers (PostgreSQL, Redis, RabbitMQ) networked to the job container via localhost.

```yaml
jobs:
  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: testdb
          POSTGRES_PASSWORD: secretpassword
        ports:
          - 5432:5432
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - run: npm test
        env:
          DATABASE_URL: postgres://postgres:secretpassword@localhost:5432/testdb
```

---

### 17. How do you create Custom JavaScript / TypeScript Actions?
**In Simple Words:**
Custom actions allow encapsulating complex pipeline automation:
1. Define metadata in `action.yml` (inputs, outputs, entrypoint).
2. Write logic in TypeScript using `@actions/core` and `@actions/github`.
3. Compile using `@vercel/ncc` to bundle all dependencies into a single `dist/index.js` file.

```typescript
// src/index.ts
import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const environment = core.getInput('environment', { required: true });
    core.info(`Deploying to environment: ${environment}`);
    
    // Set output variable for downstream steps
    core.setOutput('deployment_id', Date.now().toString());
  } catch (error: any) {
    core.setFailed(error.message);
  }
}
run();
```

---

### 18. How do you protect CI pipelines against Supply-Chain Attacks?
**In Simple Words:**
Third-party actions can be compromised or hijacked (e.g. tag mutation of `@v1`).

#### Security Hardening Measures:
1. **Commit SHA Pinning**: Reference actions by immutable Git commit SHA instead of mutable tags (`uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1`).
2. **Dependabot for Actions**: Automatically create PRs to update pinned SHAs when upstream releases new versions.
3. **Audit Code with StepSecurity**: Restrict outbound network egress on runners to prevent compromised actions from exfiltrating environment variables.
4. **CodeQL & Static Security Analysis**: Automated SAST scans to catch insecure code patterns before merging.

---

### 19. How do you generate dynamic job matrices programmatically?
**In Simple Words:**
When testing a monorepo, you only want to run jobs for microservices that actually changed.
You can execute a discovery job that outputs a JSON array, and pass it dynamically to the matrix of a downstream job:

```yaml
jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.packages }}
    steps:
      - uses: actions/checkout@v4
      - id: set-matrix
        run: echo "packages=[\"service-auth\", \"service-billing\"]" >> $GITHUB_OUTPUT

  build:
    needs: detect-changes
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: ${{ fromJson(needs.detect-changes.outputs.matrix) }}
    steps:
      - run: echo "Building package ${{ matrix.package }}"
```

---

### 20. What is Actions Runner Controller (ARC) on Kubernetes?
**In Simple Words:**
**Actions Runner Controller (ARC)** is a Kubernetes operator that dynamically orchestrates and autoscales self-hosted GitHub Actions runners inside a Kubernetes cluster.
- When jobs queue up in GitHub, ARC provisions ephemeral runner pods instantly.
- Once the job finishes, the runner pod is **terminated and destroyed**, ensuring 100% clean environments without state pollution or credential residue between builds.

---

### 21. How do you build multi-platform Docker images with Buildx and registry caching?
**In Simple Words:**
Production servers run on both `x86_64` (Intel/AMD) and `arm64` (AWS Graviton, Apple Silicon). Docker Buildx and QEMU build multi-architecture container images concurrently and push them to container registries with GitHub Actions cache backends (`type=gha`):

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build and Push
  uses: docker/build-push-action@v5
  with:
    context: .
    platforms: linux/amd64,linux/arm64
    push: true
    tags: ghcr.io/org/app:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

---

### 22. How do you structure CI/CD for Monorepos?
**In Simple Words:**
In monorepos containing 20+ packages, rebuilding every application on every commit wastes massive amounts of time.
1. **Path Filtering (`paths:`)**: Trigger workflows only when relevant subdirectories change (`paths: ['services/payment/**']`).
2. **Monorepo Build Tools**: Use tools like **Nx** or **Turborepo** (`turbo run build --filter=...[origin/main]`) which calculate dependency graphs and only build affected packages, while utilizing remote cloud build caching.

---

### 23. What is Semantic Release and automated changelog generation?
**In Simple Words:**
**Semantic Release** inspects standardized commit messages (Conventional Commits: `fix:`, `feat:`, `BREAKING CHANGE:`) on the `main` branch to automatically:
1. Determine the next SemVer version (`1.2.3` -> `1.3.0`).
2. Generate `CHANGELOG.md` with categorized release notes.
3. Create git tags and publish packages to npm or GitHub Releases.

---

### 24. What are the DORA Metrics and how does CI/CD optimize them?
**In Simple Words:**
The DevOps Research and Assessment (DORA) framework measures high-performing engineering organizations across four key metrics:
1. **Deployment Frequency**: How often code is shipped to production (CI/CD increases this from monthly to multiple times a day).
2. **Lead Time for Changes**: The time it takes a commit to reach production (automated testing and instant pipelines minimize this).
3. **Change Failure Rate (CFR)**: The percentage of production deployments requiring emergency hotfixes (automated staging tests reduce this).
4. **Failed Deployment Recovery Time (MTTR)**: Time to restore service after a production incident (automated rollbacks and GitOps recovery).

---

## Part 3: Enterprise Scale, Compliance & Production Hardening (Senior / Staff)

### 25. Why is the `pull_request_target` trigger a critical security risk?
**In Simple Words:**
The `pull_request_target` event runs in the context of the **base repository** (not the fork), granting it access to write tokens and repository secrets.
If a workflow with `pull_request_target` checks out the code from the untrusted fork (`ref: ${{ github.event.pull_request.head.sha }}`) and runs build scripts (`npm run build`), a malicious external contributor can submit a PR with modified npm scripts that **steal your production secrets and exfiltrate them**!

#### Golden Rule:
Never check out and execute untrusted pull request code inside a workflow triggered by `pull_request_target`.

---

### 26. What is SLSA and how do you achieve cryptographically signed provenance with Cosign?
**In Simple Words:**
**SLSA (Supply Chain Levels for Software Artifacts)** is a security framework that prevents tampering.
Using **Sigstore Cosign**, your CI pipeline cryptographically signs container images and generates verifiable build attestations:

```yaml
- name: Sign container image
  run: |
    cosign sign --yes \
      -a "repo=${{ github.repository }}" \
      -a "workflow=${{ github.workflow }}" \
      ghcr.io/org/app@${{ steps.build.outputs.digest }}
```
Production Kubernetes clusters running Kyverno or OPA Gatekeeper reject any container image that lacks a valid cryptographic signature from your GitHub Actions workflow!

---

### 27. How do you harden Self-Hosted Runners for enterprise network isolation?
**In Simple Words:**
If self-hosted runners run in your internal corporate network, arbitrary code from developer PRs could scan internal network subnets.

#### Enterprise Hardening:
1. **Egress Firewall Rules**: Block private internal RFC 1918 subnets (`10.0.0.0/8`) except strictly allowed internal artifact repositories.
2. **Dedicated VPC / DMZ**: Isolate runner infrastructure in a dedicated sandbox VPC.
3. **Ephemeral Execution**: Run inside isolated microVMs (e.g. AWS Firecracker or ARC pods) that are completely destroyed after every single job.

---

### 28. How do you enforce Organization-Wide Governance and Rulesets?
**In Simple Words:**
Large enterprises cannot rely on individual repo owners to configure security checks properly.
1. **GitHub Enterprise Repository Rulesets**: Centrally enforce that all repositories require linear Git history, signed commits, and specific status checks before merging.
2. **Required Workflows**: Enforce an enterprise-wide compliance scan (e.g. SonarQube, Snyk) that executes automatically on all 500+ org repositories without individual repo opt-in.

---

### 29. How do you optimize High-Performance Caching at scale?
**In Simple Words:**
When standard 10 GB GitHub Actions cache limits become a bottleneck for large multi-gigabyte C++ or Java enterprise builds:
- Deploy self-hosted cache servers using minIO (S3-compatible) or Google Cloud Storage.
- Utilize Docker BuildKit remote cache (`type=registry,ref=org/app:cache,mode=max`).
- Use persistent SSD volumes on self-hosted runners with ccache or sccache for compiled languages.

---

### 30. How do you automate SOC2 / ISO 27001 Compliance Evidence Gathering?
**In Simple Words:**
Auditors require proof that:
1. Every production release was tested.
2. The pull request was approved by at least two independent engineers.
3. No engineer bypassed branch protection rules.
Pipelines can automatically generate an immutable **Audit Bundle** (JSON metadata containing PR commit SHA, reviewer IDs, timestamp, and test results) and upload it to an immutable AWS S3 Glacier Vault with Object Lock enabled.

---

### 31. What is an SBOM and how do you generate one in CI?
**In Simple Words:**
A **Software Bill of Materials (SBOM)** is a machine-readable inventory of every open-source library, transitive dependency, and compiler version inside your build artifact.
Tools like `syft` or `trivy` generate SBOMs in SPDX or CycloneDX format, which are attached to releases for vulnerability tracking:

```yaml
- name: Generate SBOM
  uses: anchore/sbom-action@v0
  with:
    image: ghcr.io/org/app:latest
    format: cyclonedx-json
    output-file: app-sbom.json
```

---

### 32. How do you orchestrate Blue-Green and Canary Deployments in CI/CD?
**In Simple Words:**
- **Blue-Green**: Deploy the new release to an inactive environment ("Green"). Run health checks. Once validated, swap traffic at the Load Balancer (or DNS) from "Blue" to "Green" with zero downtime.
- **Canary**: Shift 5% of production traffic to the new version. Monitor error rates, latency (p99), and crash logs via Prometheus/Datadog for 15 minutes. If metrics remain healthy, progressively increment to 25%, 50%, and 100%; if errors spike, instantly roll back.

---

### 33. How do you mitigate GitHub Actions Rate Limits and API Outages?
**In Simple Words:**
- Requests to the GitHub API authenticated with `GITHUB_TOKEN` have an hourly limit of 1,000 requests per repository (Enterprise has higher).
- **Mitigation**: Cache Docker images in private container registries (Amazon ECR / Google Artifact Registry) to avoid Docker Hub rate limits. Cache npm packages via private mirrors (Verdaccio / Artifactory). Implement exponential backoff when querying GitHub GraphQL APIs.

---

### 34. How do you implement CI/CD Observability and Pipeline Profiling?
**In Simple Words:**
Slow CI pipelines cost developer productivity.
1. **GitHub Actions OpenTelemetry Exporter**: Streams workflow durations, step latencies, and runner queue delays directly into Datadog, Honeycomb, or Grafana Tempo.
2. **Step Timing Metrics**: Track which steps (linting, tests, docker build) take the most time to detect regressions before they compound.

---

### 35. What is the architecture shift when migrating from Jenkins to GitHub Actions?
**In Simple Words:**
| Jenkins | GitHub Actions |
| :--- | :--- |
| **Server Architecture** | Central Jenkins Controller (SPOF) with agent nodes | Decentralized, serverless workflow engine managed by GitHub |
| **Configuration** | Groovy `Jenkinsfile` (procedural / script-heavy) | Declarative YAML configuration |
| **Plugin Ecosystem** | Massive plugin jar files installed on controller (maintenance nightmare) | Composable marketplace actions (`uses: org/action@v1`) |
| **State & Maintenance** | Requires server backups, OS patches, Jenkins version upgrades | Zero infrastructure maintenance for SaaS; minimal for ARC runners |

