# Bash & Shell Scripting Mastery Master Interview Bank (1 - 10)

> Bash script robustness (set -euo pipefail), conditionals, loops, subshells, process substitution, standard file descriptors (stdin, stdout, stderr), grep, sed, awk, and regex text processing.

---

### 1. What is an Inode, and what is the difference between Hard Links and Soft (Symbolic) Links?
**In Simple Words:**
An **Inode (Index Node)** stores metadata about a file: file si

### 2. How does the Linux Page Cache work, and what are Dirty Pages?
**In Simple Words:**
Linux uses all unused physical RAM as a **Page Cache** to cache disk reads and writes:
- Reading a file loads its blocks into the page cache; subsequent reads are served from RAM at gigabytes/sec.
- When an application writes, bytes are written to page cache memory immediately, marked as **Dirty Pages**, and the write syscall returns.
- Background kernel flusher threads (`kswapd`, `flush`) asynchronously sync dirty pages to physical disk.
- To inspect page cache: `free -h` (look at `buff/cache`).
- To force an immediate flush: run `sync` or write `3` to `/proc/sys/vm/drop_caches`.

---

## Part 3: Systemd, Namespaces & Production Administration (31 - 50)

### 3. What is Systemd, and how do Unit Files, Cgroups, and Journald work?
**In Simple Words:**
**Systemd** is the modern init system and service manager (`PID 1`) on Linux:
- **Unit Files (`.service`)**: Declarative configuration specifying how to start, monitor, restart, and sandbox background services.
- **Control Groups (cgroups)**: Caps and tracks resource utili

### 4. Linux Namespaces: How do they form the foundation of Docker Containers?
**In Simple Words:**
Containers are NOT virtual machines; they are ordinary Linux processes isolated by kernel **Namespaces**:
1. **PID Namespace**: Isolates process IDs (the container sees itself as `PID 1`).
2. **NET Namespace**: Isolates network interfaces, IP addresses, and routing tables.
3. **MNT (Mount) Namespace**: Isolates filesystem mount points (rootfs).
4. **IPC Namespace**: Isolates shared memory, semaphores, and message queues.
5. **UTS Namespace**: Isolates hostname and domain name.
6. **USER Namespace**: Maps container root (`UID 0`) to an unprivileged user on the host.

### 5. Essential Troubleshooting CLI Toolkit: `lsof`, `netstat / ss`, `strace`, and `tcpdump`.
**In Simple Words:**
- **`ss -tulpn`**: Fast socket statistics showing all listening ports and the exact PID owning each port.
- **`lsof -p <PID>`**: Lists all open files, sockets, and libraries held by a process.
- **`strace -p <PID>`**: Intercepts and logs every system call made by a running process in real-time. Crucial for debugging hung processes.
- **`tcpdump -i eth0 port 80 -w capture.pcap`**: Captures raw network packets for deep inspection in Wireshark.

### 6. Essential Shell Scripting: Error Handling with `set -euo pipefail`.
**In Simple Words:**
In standard bash, scripts continue executing even if a command fails, leading to catastrophic data loss.
The golden header for production bash scripts:
```bash
#!/usr/bin/env bash
set -euo pipefail

# -e : Exit immediately if any command exits with a non-

### 7. Bash Robustness: Explaining 'set -euo pipefail' in production scripts.
**In Simple Words:**
Placing this at the top of every bash script prevents silent disastrous failures:
- **`set -e`**: Exits immediately if any command returns a non-zero exit status.
- **`set -u`**: Treats unset variables as an error and exits immediately (prevents `rm -rf /tmp/$DIR` from wiping `/tmp/` if `$DIR` is unset).
- **`set -o pipefail`**: In a pipeline (`cmd1 | cmd2 | cmd3`), the exit code is the exit code of the last failing command, rather than always returning `cmd3`'s status.

### 8. Process Substitution vs. Command Substitution in Bash.
**In Simple Words:**
- **Command Substitution (`$(command)`)**: Executes the command, captures its standard output string, and interpolates it: `TODAY=$(date +%F)`.
- **Process Substitution (`< (command)` or `>(command)`)**: Runs command asynchronously and connects its output to a named file descriptor in `/dev/fd/N`. Enables passing outputs of two commands as file arguments to tools like `diff`:
  `diff <(sort file1.txt) <(sort file2.txt)`.

### 9. Bash Loops, While Read Loops, and IFS (Internal Field Separator).
**In Simple Words:**
**Best Practice for File Processing:**
```bash
while IFS=',' read -r col1 col2 col3; do
  echo "Processing $col1"
done < data.csv
```
- `IFS=','`: Sets comma as the field delimiter.
- `-r`: Prevents backslash escapes from being interpreted.
- Avoids `for line in $(cat file.txt)` which breaks on spaces and creates memory overhead on large files.

### 10. Grep, Sed, and Awk: Stream Editing and Text Processing.
**In Simple Words:**
- **grep**: Searches text for regular expressions (`grep -rn "ERROR" /var/log/`).
- **sed (Stream Editor)**: Performs search-and-replace text transformations on a stream (`sed -i 's/foo/bar/g' file.txt`).
- **awk**: Full pattern scanning and column processing programming language:
  `awk '{print $1, $4}' access.log | sort | uniq -c | sort -nr`.

