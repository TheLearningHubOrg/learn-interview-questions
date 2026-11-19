# Docker & Container Architecture Master Interview Bank (1 - 10)

> Linux namespaces, cgroups, UnionFS, multi-stage Docker builds, layer caching, container security, and minimal base images (Distroless/Alpine).

---

### 1. Give a candid introduction of your DevOps, Cloud Infrastructure, and Kubernetes experience.
### High-Yield Candid Answer
> "I am a DevOps and Infrastructure Engineer with hands-on experience designing, provisioning, automating, and maintaining resilient cloud platforms. My core focus spans containeri

### 2. Containers vs. Virtual Machines: How do Linux Namespaces and Control Groups (cgroups) isolate processes?
### Direct Architecture Explanation
A Virtual Machine (VM) virtuali

### 3. Container Storage & UnionFS / Overlay2: How does the Copy-on-Write (CoW) mechanism work in Docker?
### Architecture & Mechanics
Docker images are built as a stack of immutable, read-only layers. When a container runs, Docker attaches a single, thin, read-write layer on top known as the **Container Layer**. Docker implements this filesystem stack using the **Overlay2** storage driver (Linux OverlayFS).

```
+-------------------------------------------------------+
| Container Read-Write Layer (Modified files, temp data)| <- "upperdir"
+-------------------------------------------------------+
| Layer 3: Application Code (Read-Only)                 | \
+-------------------------------------------------------+  |
| Layer 2: Installed Runtime / Node / Python (Read-Only)|  | <- "lowerdir" (Immutable image layers)
+-------------------------------------------------------+  |
| Layer 1: Base OS Debian/Alpine (Read-Only)            | /
+-------------------------------------------------------+
                          |
                          v
         [ Merged View (What the container sees) ]
```

#### OverlayFS Directory Structure
1. **`lowerdir`**: The read-only base image layers joined together with colon-separated paths.
2. **`upperdir`**: The writable container layer where file modifications, new files, and deletes are recorded.
3. **`workdir`**: Internal scratch directory used by the Linux kernel to prepare atomic copy-on-write operations.
4. **`merged`**: The unified mount point presented to the container process.

#### Copy-on-Write (CoW) Lifecycle
- **Reading a file**: The driver checks `upperdir`. If the file is not there, it reads down into `lowerdir` with

### 4. How do you optimize Dockerfiles for minimum image size, security, and build layer caching in production?
### Production Best Practices & Dockerfile Blueprint
To achieve sub-50MB production images with fast CI build times and minimal vulnerabilities, follow four core rules:
1. **Order layers from least frequent to most frequent change** to maximi

### 5. Why is running containers as root a major security vulnerability, and how do you secure container runtime privileges?
### Security Threat Model
By default, UID 0 inside a container is UID 0 on the host kernel unless Linux User Namespaces are enabled. If an attacker achieves Remote Code Execution (RCE) inside a container running as root:
1. They can exploit kernel vulnerabilities (e.g., Dirty COW, CVE-2024-21626 runc breakout) to break out directly onto the host as host root.
2. They can access mounted host sockets (e.g., `/var/run/docker.sock`), granting them uninhibited control over the entire cluster.
3. They can modify host device nodes and alter sensitive host filesystems.

```
+-----------------------------------------------------------+
| Host Kernel (UID 0: Root)                                 |
|                                                           |
|   +-----------------------+     +-----------------------+ |
|   | Container A (UNSAFE)  |     | Container B (SECURE)  | |
|   | USER root (UID 0)     |     | USER nonroot (UID 10001)|
|   | ALL Capabilities      |     | Drops ALL Caps        | |
|   | Read-Write Root FS    |     | Read-Only Root FS     | |
|   +-----------------------+     +-----------------------+ |
+-----------------------------------------------------------+
```

#### Defensive Hardening Blueprint (Kubernetes SecurityContext)
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hardened-app
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    runAsGroup: 10001
    fsGroup: 10001
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: api
      image: registry.example.com/api:v1.2.0
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
      volumeMounts:
        - name: tmp-volume
          mountPath: /tmp
  volumes:
    - name: tmp-volume
      emptyDir: {}
```

#### Key Defense In Depth Layers
- **`allowPrivilegeEscalation: false`**: Prevents `setuid` binaries (e.g., `sudo`) from elevating privileges.
- **`readOnlyRootFilesystem: true`**: Blocks attackers from downloading or writing rootkits/malware to the disk; only explicit `tmpfs` or emptyDir mounts are writable.
- **`capabilities.drop: ["ALL"]`**: Strips all 40+ Linux capabilities (`CAP_NET_ADMIN`, `CAP_SYS_ADMIN`, `CAP_SYS_PTRACE`), preventing low-level kernel and network tampering.

---

### 6. Docker Networking: Bridge vs. Host vs. Overlay networks and how port mapping works under the hood.
### Direct Architecture Explanation
Docker provides several network drivers, each altering how the container interacts with the Linux network stack and host interfaces.

```
1. Bridge Network (Default)
   [ Host Interface eth0: 192.168.1.50 ]
                  |
             [ iptables NAT ]
                  |
             [ docker0 (veth pair): 172.17.0.1 ]
                  |
             +----+----+
             |         |
          [Cont A]  [Cont B] (172.17.0.2, 172.17.0.3)

2. Host Network
   [ Host eth0: 192.168.1.50 ] <--> [ Container shares host port directly ]

3. Overlay Network (Multi-Host)
   [ Host 1 (Docker) ] <======= VXLAN Tunnel (UDP 4789) =======> [ Host 2 (Docker) ]
```

#### Network Driver Comparisons
| Network Mode | Command Flag | Mechanism & Use Case |
| :--- | :--- | :--- |
| **Bridge** | `--network bridge` | Creates a virtual bridge (`docker0`) on host. Each container gets a `veth` pair and private IP. Inter-container traffic routes through bridge; external traffic uses iptables NAT. |
| **Host** | `--network host` | Bypasses network namespace isolation. Container binds directly to host IP and ports. Offers maximum network throughput (

### 7. Why do containers fail to handle SIGTERM/SIGINT when running as PID 1, and what is the Zombie Process Reaping problem?
### The PID 1 Problem in Linux Containers
In a standard Linux system, **PID 1** (typically `systemd` or `init`) has two non-delegable kernel responsibilities:
1. **Handling Signals**: The Linux kernel grants PID 1 special status. If PID 1 does not explicitly install a signal handler for a signal (such as `SIGTERM` or `SIGINT`), the kernel **silently ignores** the signal.
2. **Reaping Zombie Processes**: When a child process terminates, it enters a "Zombie" state until its parent calls `wait()` or `waitpid()`. If the parent dies first, the child is orphaned and reparented to **PID 1**. PID 1 must continuously call `wait()` to clean them up from the process table.

```
Problem: Node/Python as PID 1
[ Host sends SIGTERM ] 
         |
         v
[ Container PID 1 (node) ] --> Has no SIGTERM handler registered!
                               Kernel ignores signal -> 30s timeout expires -> SIGKILL!
                               Result: Abrupt termination, dropped DB connections, data corruption.

Solution: Using an Init Process (tini)
[ Host sends SIGTERM ]
         |
         v
[ Container PID 1 (tini) ] --> Catches SIGTERM, cleanly forwards it to child (node)
         |                     Calls waitpid() to reap orphaned

### 8. Docker Compose in Production & Staging: Service dependencies, healthchecks, and volume management.
### Architecture & Production Blueprint
In modern Docker Compose (Compose v2), orchestrating multi-container stacks requires declarative healthchecks and conditional start sequences to prevent startup race conditions (e.g., an API crashing because PostgreSQL has not finished its initial vacuum and socket binding).

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
      POSTGRES_DB: app_production
    volumes:
      - postgres_data:/var/lib/postgresql/data
    secrets:
      - db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app_user -d app_production"]
      interval: 5s
      timeout: 5s
      retries: 5
      start_period: 10s

  api:
    image: registry.example.com/api:v1.4.0
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgres://app_user:app_password@db:5432/app_production
    depends_on:
      db:
        condition: service_healthy
    networks:
      - internal_net

volumes:
  postgres_data:
    driver: local

secrets:
  db_password:
    file: ./secrets/db_password.txt

networks:
  internal_net:
    driver: bridge
```

#### Critical Compose Best Practices
- **`condition: service_healthy`**: Standard `depends_on` only waits for the container process to be spawned, *not* for the application inside to be ready. Healthcheck conditions guarantee readiness.
- **Named Volumes vs. Bind Mounts**: Use named volumes for production database persistence because they are isolated from host OS permissions and managed natively by the Docker storage engine.
- **Docker Secrets**: Injected into `/run/secrets/` inside temporary ramdisk storage (`tmpfs`), preventing passwords from leaking into environment variables and build logs.

---

### 9. How do OCI Image Manifests, Multi-Architecture builds (Buildx), and Image Signing (Cosign) work?
### Deep Dive: OCI & Multi-Arch Image Supply Chain
An image tag (e.g., `nginx:latest`) in an OCI-compliant registry is not a single file—it is an **OCI Image Index** (Manifest List) pointing to separate image manifests for each CPU architecture (`linux/amd64`, `linux/arm64`, `windows/amd64`).

```
                         [ Image Tag: api:v1.0.0 ]
                                     |
                                     v
                       +---------------------------+
                       | OCI Image Index (Manifest)|
                       +---------------------------+
                               /           \
                              /             \
      [ linux/amd64 Manifest ]               [ linux/arm64 Manifest ]
      - Layer 1 (amd64 SHA)                  - Layer 1 (arm64 SHA)
      - Layer 2 (amd64 SHA)                  - Layer 2 (arm64 SHA)
```

#### 1. Building Multi-Arch Images with Docker Buildx
```bash
# Create buildx instance with QEMU emulation
docker buildx create --name multi-builder --use
docker buildx inspect --bootstrap

# Build and push multi-architecture image directly to registry
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t registry.example.com/org/api:v1.2.0 \
  --push .
```

#### 2. Cryptographic Image Signing with Cosign (Sigstore)
To guarantee image provenance and prevent supply chain attacks (man-in-the-middle tampering), CI/CD pipelines cryptographically sign images before pushing:
```bash
# Generate keypair
cosign generate-key-pair

# Sign the remote OCI container image
cosign sign --key cosign.key registry.example.com/org/api:v1.2.0

# Verify signature in Kubernetes admission controller or CI
cosign verify --key cosign.pub registry.example.com/org/api:v1.2.0
```
Kubernetes admission controllers (such as **Kyverno** or **OPA Gatekeeper**) enforce that any container pod attempting to start without a verified signature is automatically blocked from running.

---

### 10. How do you systematically debug an unhealthy or crashing container in production (Exit Code 137, 139, 1)?
### Systematic Diagnostic Workflow
When a container terminates unexpectedly or fails health checks, analy

