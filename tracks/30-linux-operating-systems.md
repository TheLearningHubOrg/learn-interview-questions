# Linux Operating Systems & Kernel Architecture Master Interview Bank (1 - 35)

> Linux kernel architecture, Process vs Thread lifecycles, PID 1 (systemd), Zombie and Orphan processes, IPC (Pipes, Unix Domain Sockets, Shared Memory), Signals, Virtual Memory and Page Faults, CFS scheduler, Inodes and VFS, epoll vs io_uring, troubleshooting (strace, lsof, vmstat, iostat), and Namespaces & Cgroups (container primitives).

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is the difference between User Space and Kernel Space in Linux?
**In Simple Words:**
The CPU runs in different privilege rings to protect the system:
- **Kernel Space (Ring 0)**: Unrestricted, privileged execution mode. Has direct access to physical hardware (CPU, RAM, disk, network controllers). Runs the Linux kernel, core device drivers, and memory managers.
- **User Space (Ring 3)**: Restricted, unprivileged mode where standard user applications (Node.js, Nginx, Python) run. Applications cannot touch hardware directly; they must execute **System Calls (syscalls)** to request the kernel to perform I/O or allocate memory.

```text
Linux CPU Rings:
[User Space (Ring 3): Web Apps, Databases, Shells]
                        │ System Call (syscall)
┌───────────────────────▼───────────────────────┐
│               KERNEL SPACE (Ring 0)           │
│ Process Scheduler | Virtual Memory | Drivers  │
└───────────────────────┬───────────────────────┘
                        ▼
                [Physical Hardware]
```

### 2. What is the difference between a Process and a Thread in Linux?
**In Simple Words:**
- **Process**: An independent instance of an executing program with its **own isolated virtual address space**, file descriptors, and environment variables. Created via `fork()`.
- **Thread**: An execution unit *inside* a process. Multiple threads share the same address space, heap memory, and open file descriptors of their parent process.
- **Linux Kernel Perspective (`task_struct`)**: To the Linux kernel, both processes and threads are represented identically as tasks (`task_struct`). A thread is simply a task created with `clone()` sharing memory flags (`CLONE_VM`, `CLONE_FILES`).

### 3. What is PID 1 (`init` / `systemd`) and what is its role?
**In Simple Words:**
PID 1 is the very first process launched by the Linux kernel during boot:
- The ancestor/parent of all other processes in the operating system.
- **Responsibilities**:
  1. Bootstraps system services, mounts filesystems, and configures networking.
  2. **Adopts Orphaned Processes**: When a parent process dies before its child, PID 1 adopts the child and reaps its exit status to prevent zombie leaks.
  3. Manages system shutdown and service lifecycles.

### 4. What are Zombie Processes and Orphan Processes?
**In Simple Words:**
- **Orphan Process**: A child process whose parent died while the child was still running.
  - *Outcome*: Automatically adopted by PID 1 (`init`/`systemd`), which monitors it until termination. Harmless.
- **Zombie Process (`<defunct>`)**: A child process that has finished execution (`exit()`), but its parent has not yet read its exit status via `wait()` / `waitpid()`:
  - The process holds no RAM or CPU, but occupies a slot in the operating system **Process Table**.
  - **Danger**: If thousands of zombies accumulate, the system runs out of Process IDs (`/proc/sys/kernel/pid_max`), preventing any new processes from spawning!

### 5. What are the common Linux Process States in `ps` and `top`?
**In Simple Words:**
- **`R` (Running / Runnable)**: Actively executing on a CPU core or sitting in the run queue ready to execute.
- **`S` (Interruptible Sleep)**: Waiting for an event (I/O, timer, socket). Can be awakened by signals.
- **`D` (Uninterruptible Sleep - Disk Sleep)**: Waiting for hardware/disk I/O. **Cannot be killed by `kill -9`**! Indicates disk bottlenecks or dead NFS mounts.
- **`T` (Stopped / Traced)**: Paused by a signal (`SIGSTOP`, `Ctrl+Z`) or debugger.
- **`Z` (Zombie)**: Terminated, waiting for parent process to reap its exit status.

### 6. What are the essential Linux Signals (`SIGTERM`, `SIGKILL`, `SIGINT`, `SIGHUP`)?
**In Simple Words:**
Signals are asynchronous notifications sent to a process by the kernel or user:
- **`SIGTERM (15)`**: Graceful termination request. The process can catch it, close database connections, finish ongoing HTTP requests, and cleanly exit.
- **`SIGKILL (9)`**: Forceful kill. Handled directly by the kernel; **the process CANNOT catch, block, or ignore it**! Instant termination.
- **`SIGINT (2)`**: Interrupt sent from terminal via `Ctrl+C`.
- **`SIGHUP (1)`**: Hangup. Sent when terminal closes; conventionally used by daemons (Nginx, Apache) to reload configuration files without restarting.

### 7. What is an Inode in Linux File Systems?
**In Simple Words:**
An inode (Index Node) is a fixed-size data structure storing all metadata about a file **except its filename and actual content**:
- Stores: File size, owner user/group ID, permissions, timestamps (`atime`, `mtime`, `ctime`), and disk block pointers where data lives.
- The filename is stored in a **Directory Entry (dentry)** which maps the human-readable string name to the numerical Inode number (`ls -i`).

```text
File System Inode Structure:
[Directory Entry: "app.log"] ──► [Inode #1042]
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           ▼                          ▼                          ▼
     [Metadata: 4KB]           [Perms: 0644]             [Disk Block Pointers]
                                                                 │
                                                       [Data Block on Disk]
```

### 8. What is the difference between a Hard Link and a Soft (Symbolic) Link?
**In Simple Words:**
- **Hard Link (`ln file link`)**: Creates an additional directory entry pointing to the **exact same Inode number**:
  - Shares the same disk blocks.
  - If you delete the original file, the data is still fully accessible via the hard link!
  - Cannot span across different filesystems/disks, and cannot link directories.
- **Soft Link / Symlink (`ln -s file link`)**: A special small file that contains a **string path** pointing to another file:
  - Has its own unique Inode number.
  - Can cross filesystems and link directories.
  - If the target file is deleted, the symlink breaks ("Dangling Symlink").

### 9. What are Linux File Permissions (`chmod`, `chown`, and Octal Notation)?
**In Simple Words:**
Permissions are evaluated for User (owner), Group, and Others:
- **Read (`r = 4`)**, **Write (`w = 2`)**, **Execute (`x = 1`)**.
- `chmod 755 script.sh`:
  - User: $4+2+1 = 7$ (`rwx` - full access).
  - Group: $4+0+1 = 5$ (`r-x` - read & execute).
  - Others: $4+0+1 = 5$ (`r-x` - read & execute).
- `chown appuser:appgroup file.txt`: Changes ownership to user `appuser` and group `appgroup`.

### 10. What are SUID, SGID, and the Sticky Bit?
**In Simple Words:**
Special permission bits extending standard Unix permissions:
- **SUID (`chmod 4755` / `u+s`)**: Executable runs with the permissions of the **file owner**, not the executing user (e.g. `/usr/bin/passwd` runs as `root` so regular users can modify `/etc/shadow`).
- **SGID (`chmod 2755` / `g+s`)**: Files created inside the directory inherit the **group ownership** of the directory, rather than the primary group of the user.
- **Sticky Bit (`chmod 1777` / `+t`)**: Applied to shared directories (e.g. `/tmp`); users can write files, but **only the file owner or root can delete or rename their own files**!

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. How does Virtual Memory and Page Tables work in Linux?
**In Simple Words:**
Processes never access physical RAM addresses directly; they operate in an isolated **Virtual Address Space**:
- **Memory Management Unit (MMU)**: Hardware chip in the CPU that translates virtual addresses to physical RAM addresses.
- **Page Tables**: Multi-level lookup tables maintained by the kernel mapping 4 KB virtual pages to physical RAM Page Frames.
- **Benefits**: Complete memory isolation (Process A cannot read Process B's memory) and allows systems to run processes requiring more memory than physical RAM via Swapping.

### 12. What are Minor Page Faults vs Major Page Faults?
**In Simple Words:**
When a process accesses a virtual memory address that is not currently mapped in physical RAM:
- **Minor Page Fault (Soft)**: The page is already resident in physical RAM (e.g. shared library page loaded by another process, or allocated memory not yet touched). The kernel simply updates the page table. Extremely fast; zero disk I/O.
- **Major Page Fault (Hard)**: The requested page is **not in physical RAM** and must be read from physical disk (swap space or executable binary). Causes the process to enter Sleep mode until disk I/O completes (thousands of times slower!).

### 13. What is the Linux Out-Of-Memory (OOM) Killer and how does it choose victims?
**In Simple Words:**
Linux employs **Memory Overcommit**: it allows processes to allocate more virtual memory than physical RAM exists, betting that processes will not use all allocated RAM simultaneously:
- When physical RAM and swap are completely exhausted, the kernel invokes the **OOM Killer** to prevent an OS kernel panic.
- **Algorithm**: Inspects `/proc/[pid]/oom_score` (0 to 1000).
- Kills the process with the highest score (typically the rogue process consuming the most RAM that has the lowest system impact).
- **Protecting Critical Services**: Set `echo -1000 > /proc/[pid]/oom_score_adj` to make databases (PostgreSQL/MySQL) immune to OOM killer.

### 14. How does the Completely Fair Scheduler (CFS) allocate CPU time?
**In Simple Words:**
CFS is the default Linux CPU scheduler for standard processes:
- Models an "ideal multi-tasking CPU" where every process gets a fair slice of CPU time.
- Uses a **Red-Black Tree** ordered by **`vruntime` (Virtual Runtime)**: the amount of CPU execution time the process has received.
- The scheduler always picks the task with the **smallest `vruntime`** (leftmost node in the tree).
- **Nice Values (-20 to +19)**: Lower nice values (e.g. -20 = highest priority) slow down the accumulation of `vruntime`, giving the task more CPU time.

### 15. What are the Inter-Process Communication (IPC) mechanisms in Linux?
**In Simple Words:**
Ways independent processes communicate:
1. **Pipes & Named Pipes (FIFOs)**: Unidirectional byte streams between related (`|`) or unrelated processes.
2. **UNIX Domain Sockets (`AF_UNIX`)**: Bidirectional streaming or datagram communication on the same machine. Bypasses the network stack; 2x faster than TCP loopback (`localhost`).
3. **Shared Memory (`shmget` / `mmap`)**: Fastest IPC! Multiple processes map the same physical RAM page into their address space. Requires synchronization via Semaphores or Mutexes.
4. **Message Queues (`POSIX mq`)**: Message-oriented asynchronous queues with priority support.

### 16. What is the Virtual File System (VFS) and what are `/proc` and `/sys`?
**In Simple Words:**
- **VFS**: A kernel abstraction layer that defines standard file interfaces (`open`, `read`, `write`, `close`), allowing Linux to interact uniformly with ext4, XFS, NFS, Btrfs, or FAT.
- **`/proc` (Process Information Pseudo-filesystem)**: Exists strictly in RAM. Exposes live kernel and process data (e.g. `/proc/cpuinfo`, `/proc/meminfo`, `/proc/[pid]/cmdline`).
- **`/sys` (Sysfs)**: Exposes hardware device trees, kernel modules, and driver settings.

### 17. What are File Descriptors and the "Too many open files" error?
**In Simple Words:**
Every open file, network socket, pipe, or device in Linux is represented by a non-negative integer called a **File Descriptor (FD)**:
- Standard FDs: `0` (stdin), `1` (stdout), `2` (stderr).
- **`ulimit -n`**: The maximum number of open file descriptors allowed per process (default often 1024).
- When a web server (Nginx/Node.js) exceeds this limit under high connection load, it throws: `EMFILE: Too many open files`.
- **Fix**: Increase limits in `/etc/security/limits.conf` (e.g. `nofile 65535`).

### 18. What is the difference between Blocking, Non-Blocking, and I/O Multiplexing?
**In Simple Words:**
- **Blocking I/O**: Thread calls `read()` and halts completely until data arrives. Requires 1 thread per connection (unscalable for 100,000 connections).
- **Non-Blocking I/O**: Calls return immediately with `EAGAIN` / `EWOULDBLOCK` if no data is ready. Requires busy polling (wastes CPU).
- **I/O Multiplexing (`epoll`)**: A single thread registers 10,000 sockets with the kernel. The kernel wakes the thread only when one or more sockets are ready to read or write!

### 19. How does `epoll` differ from `select` and `poll`?
**In Simple Words:**
The foundation of high-concurrency web servers (Nginx, Node.js, Redis):
- **`select` / `poll` (Ancient - $O(N)$)**: Every time an event occurs, the kernel returns the entire list of sockets. The application must iterate through all 10,000 sockets sequentially to find which one has data. Slow and limited.
- **`epoll` (Modern Linux - $O(1)$)**:
  - Uses an internal Red-Black tree to monitor file descriptors.
  - When an event occurs on a socket, a hardware interrupt appends it directly to a **Ready List**.
  - `epoll_wait()` returns **only the active sockets that have data**, delivering constant $O(1)$ performance!

### 20. How do Systemd Units and Service Management work?
**In Simple Words:**
Systemd manages system initialization, background daemons, and cgroups:
- **Unit Files (`/etc/systemd/system/myapp.service`)**:
  - `[Unit]`: Metadata, dependencies (`After=network.target`).
  - `[Service]`: Execution command (`ExecStart`), restart policy (`Restart=always`), sandboxing.
  - `[Install]`: Target dependency (`WantedBy=multi-user.target`).
- Core CLI commands: `systemctl start/stop/restart/status/enable myapp`, and `journalctl -u myapp -f` for log streaming.

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. What are Linux Namespaces and what are the 7 core Namespace types?
**In Simple Words:**
Namespaces are the foundational isolation mechanism of **Docker containers**:
- A namespace wraps a global system resource in an abstraction, making processes inside believe they have their own dedicated copy:
1. **PID Namespace**: Process isolation (container process sees itself as PID 1).
2. **NET Namespace**: Dedicated virtual network interfaces, IP addresses, and routing tables.
3. **MNT (Mount) Namespace**: Isolated filesystem mount points.
4. **IPC Namespace**: Isolated shared memory and message queues.
5. **UTS Namespace**: Isolated hostname and domain name.
6. **USER Namespace**: Maps container root user (UID 0) to an unprivileged user on the host OS.
7. **CGROUP Namespace**: Isolates cgroup root directory views.

```text
Container Primitives Architecture:
┌────────────────────────────────────────────────────────┐
│                   DOCKER CONTAINER                     │
│  [Namespaces: Isolated PID, Net, Mount, User, IPC]     │
│  [Cgroups: Resource Limits on CPU, Memory, Disk I/O]   │
└──────────────────────────┬─────────────────────────────┘
                           ▼
                  [Linux Kernel Layer]
```

### 22. What are Control Groups (Cgroups v1 vs v2) and how do they enforce resource limits?
**In Simple Words:**
While Namespaces control *what a process can see*, Cgroups control *how much resources a process can consume*:
- **Limits Enforced**:
  - **Memory (`memory.max`)**: Hard RAM limit; exceeding it triggers the OOM killer on the container.
  - **CPU (`cpu.max`)**: Enforces CFS bandwidth quotas (e.g. 2 cores = `200000 100000`).
  - **I/O (`io.max`)**: Throttle read/write bytes per second and IOPS.
- **Cgroups v2 (Modern Standard)**: Replaces multiple fragmented v1 controller trees with a unified, hierarchical single-tree hierarchy, eliminating memory-pressure deadlocks.

### 23. What is `io_uring` and how does it revolutionize Linux Asynchronous I/O?
**In Simple Words:**
`io_uring` is a modern Linux kernel interface (introduced by Jens Axboe in Linux 5.1):
- **Traditional Syscall Overhead**: Calling `read()` or `epoll_wait()` requires a CPU context switch from user space to kernel space, incurring significant CPU overhead.
- **`io_uring` Design**: Uses **two lockless ring buffers** in shared memory:
  1. **Submission Queue (SQ)**: User space enqueues I/O requests without executing syscalls.
  2. **Completion Queue (CQ)**: Kernel processes requests asynchronously and writes completions directly to the CQ ring buffer.
- Delivers millions of IOPS with zero syscall overhead!

### 24. How do you troubleshoot system performance using `vmstat`, `iostat`, and `sar`?
**In Simple Words:**
- **`vmstat 1`**: High-level overview of processes (`r`, `b`), memory, swap (`si`, `so`), and CPU (`us`, `sy`, `id`, `wa`, `st`):
  - High `b` (blocked processes) + high `wa` (I/O wait) indicates disk bottlenecks!
  - `si`/`so` > 0 indicates active memory swapping (system running out of RAM).
- **`iostat -xz 1`**: Deep disk performance: inspects `%util` (disk saturation), `await` (average I/O latency in ms), and throughput (`rkB/s`, `wkB/s`).
- **`sar`**: Historical system activity reporter (CPU, memory, network interfaces over past days/weeks).

### 25. How do you trace live system calls using `strace`?
**In Simple Words:**
`strace` intercepts and records all system calls executed by a process and the signals received:
```bash
# Attach to running process PID 1042 and track syscalls:
strace -p 1042 -f -e trace=network,file -s 200

# Profile and count system calls by execution time:
strace -c -p 1042
```
- Vital for diagnosing why a process is hanging (e.g. waiting on a blocked `connect()` or missing config file returning `ENOENT`).
- **Production Warning**: Incurs 50-80% performance overhead; avoid on high-throughput production paths without filtering!

### 26. What is `lsof` and how do you find open ports, deleted files, and active connections?
**In Simple Words:**
"List Open Files" (`lsof`) displays all active file descriptors across the OS:
- `lsof -i :8080`: Finds which process is listening on or connected to port 8080.
- `lsof -u appuser`: Lists all files opened by a specific user.
- **Find Deleted Files Holding Disk Space**:
  `lsof +L1` (or `lsof | grep deleted`): Finds files that were deleted (`rm file.log`) but are still held open by a running process, preventing disk space from being freed!

### 27. What is Swappiness (`vm.swappiness`) and how does it balance RAM vs Disk?
**In Simple Words:**
Controls the kernel's aggressiveness in moving anonymous memory pages to swap space vs reclaiming file system cache (0 to 100, default 60):
- **`vm.swappiness = 0`**: Kernel will only swap to prevent Out-Of-Memory conditions.
- **`vm.swappiness = 100`**: Aggressively swaps anonymous memory to disk to maximize file system cache.
- **Production Databases (PostgreSQL / Redis / Kubernetes)**: Set to **`1` or `10`** to prevent swapping active database memory to slow disk, which causes sudden latency spikes.

### 28. What are HugePages and why do databases use them?
**In Simple Words:**
Standard Linux memory pages are **4 KB**:
- A server with 256 GB of RAM requires millions of page table entries, filling the CPU's **Translation Lookaside Buffer (TLB)** cache and causing frequent TLB misses.
- **HugePages**: Allocates memory in **2 MB or 1 GB** chunks:
  - Dramatically reduces the number of page table entries by 500x.
  - HugePages are locked in RAM; they are **never swapped to disk**.
  - Significantly accelerates large in-memory databases (PostgreSQL, Oracle).

### 29. How does Network Packet Processing work in the Linux Kernel (sk_buff, Netfilter, eBPF)?
**In Simple Words:**
1. NIC receives packet, DMA-transfers bytes to host RAM, triggers a hardware interrupt.
2. Kernel processes packet via NAPI polling loop, wraps raw bytes in an **`sk_buff` (Socket Buffer)**.
3. Packet traverses the **Netfilter architecture** (iptables / nftables chains: `PREROUTING`, `INPUT`, `FORWARD`, `OUTPUT`, `POSTROUTING`).
4. **eBPF (Extended Berkeley Packet Filter)**: Allows running sandboxed bytecode directly inside the kernel network driver layer (XDP - eXpress Data Path), dropping malicious DDoS packets or routing packets in nanoseconds before `sk_buff` allocation!

### 30. What is the difference between TCP SYN Flood attacks and SYN Cookies?
**In Simple Words:**
- **TCP SYN Flood**: Attacker sends millions of `SYN` packets with spoofed source IPs, ignoring the `SYN-ACK`. The server's **SYN Backlog Queue** fills up waiting for nonexistent `ACK`s, crashing the server.
- **SYN Cookies (`tcp_syncookies = 1`)**: When the backlog queue fills up, the server **stops storing connection state in memory**.
  - Encodes connection state into the Initial Sequence Number (ISN) of the `SYN-ACK` packet.
  - State is reconstructed only when the legitimate client sends back the final `ACK`!

### 31. What is the Core Dump file and how do you analyze it using GDB?
**In Simple Words:**
A Core Dump is a memory snapshot of a process captured at the exact moment it crashed (e.g. `SIGSEGV` segmentation fault):
- Enabled via `ulimit -c unlimited`.
- **Debugging with GDB**:
  ```bash
  gdb /usr/local/bin/myapp /var/crash/core.1042
  (gdb) bt full # Prints complete stack trace with local variables!
  ```
- Identifies the exact file, function, line number, and null pointer that caused the crash.

### 32. What is `chroot` and what are its security limitations compared to Containers?
**In Simple Words:**
`chroot` changes the apparent root directory (`/`) for the current running process and its children:
- **Limitation (Not a Sandbox)**: `chroot` does **not isolate processes, network interfaces, or user IDs**.
- A root user inside a `chroot` jail can easily escape by creating a nested chroot or using open file descriptors. Modern containers use **Namespaces, Cgroups, and Seccomp** for true multi-layered isolation.

### 33. What is Seccomp (Secure Computing Mode)?
**In Simple Words:**
A Linux kernel security feature that restricts the system calls a process can make:
- **Default Profile (Docker)**: Blocks over 40 dangerous syscalls (e.g. `reboot`, `ptrace`, `clone` without namespaces, `sys_chroot`).
- If a compromised web application attempts to invoke an unauthorized syscall, the kernel immediately terminates the process with `SIGSYS`, containing the exploit.

### 34. What is the difference between Ext4 and XFS filesystems?
**In Simple Words:**
- **Ext4 (Fourth Extended Filesystem)**: Universal general-purpose Linux filesystem. Mature, reliable, excellent performance on smaller and medium-sized workloads. Supports online shrinking and growing.
- **XFS**: High-performance 64-bit journaling filesystem created by SGI:
  - Exceptional parallel I/O throughput and scalability for massive multi-terabyte files and multi-threaded databases.
  - Default filesystem in RHEL / CentOS. Cannot be shrunk; only grown.

### 35. When should you use Linux Performance Profiling with `perf` and Flame Graphs?
**In Simple Words:**
When CPU usage is pinned at 100% and you need to know which exact code functions are responsible:
- **`perf record -F 99 -p <PID> -g -- sleep 30`**: Samples CPU stack traces at 99Hz.
- Generate **Brendan Gregg Flame Graphs**:
  - Horizontal axis: Shows the proportion of CPU time spent in each function.
  - Vertical axis: Shows call stack depth.
  - The widest plateaus highlight the exact code bottleneck consuming CPU!
`;
