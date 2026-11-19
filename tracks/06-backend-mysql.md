# MySQL & InnoDB Engine Architecture Master Interview Bank (1 - 10)

> MySQL InnoDB storage engine architecture, Buffer Pool management, Redo/Undo logs, Clustered vs Secondary indexes, Doublewrite buffer, and asynchronous vs semi-synchronous replication.

---

### 1. RPO vs RTO Disaster Recovery:
**In Simple Words:**
- **RPO (Recovery Point Objective)**: Maximum acceptable data loss duration (e.g. at most 5 mins of data).
- **RTO (Recovery Time Objective)**: Maximum acceptable downtime duration to restore service (e.g. restore within 15 mins).

```sql
-- Verifying replication lag for RPO in PostgreSQL:
SELECT client_addr, application_name,
  pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS replication_lag_bytes
FROM pg_stat_replication;
```

---

## Part 6: MySQL Architecture, InnoDB & Production Optimi

### 2. Explain the MySQL InnoDB Storage Engine Architecture: Buffer Pool, Redo Log, Undo Log, and Doublewrite Buffer.
**In Simple Words:**
**InnoDB** is MySQL's default ACID-compliant transactional storage engine. Rather than writing every modified row directly to disk synchronously, InnoDB buffers modifications in memory and uses a write-ahead log for durability.

Key architectural components:
1. **InnoDB Buffer Pool**:
   - The primary in-memory cache holding data and index pages (typically si

### 3. How does MySQL Replication work: Statement-Based vs. Row-Based vs. Mixed, and what is GTID?
**In Simple Words:**
MySQL replication allows data from a primary (writer) instance to replicate to one or more read replicas asynchronously or semi-synchronously via the **Binary Log (Binlog)**.

Replication Binlog Formats:
1. **Statement-Based Replication (SBR)** (`binlog_format = STATEMENT`):
   - Logs the exact SQL statements executed (`UPDATE orders SET status = 'shipped' WHERE id = 12`).
   - *Pros*: Very compact log si

### 4. What are the different types of locks in MySQL InnoDB: Record Locks, Gap Locks, and Next-Key Locks?
**In Simple Words:**
To guarantee Seriali

### 5. How do you analyze and optimize slow MySQL queries using `EXPLAIN FORMAT=JSON` and the MySQL Slow Query Log?
**In Simple Words:**
Optimi

### 6. MySQL InnoDB Clustered Index vs. Secondary Index Architecture.
**In Simple Words:**
- **Clustered Index**: InnoDB always stores the physical table rows directly in the B-Tree leaf pages of the **Primary Key**.
- **Secondary Index**: Leaf pages do **not** store row data; they store the Primary Key value!
- **Double Lookup (Bookmark Lookup)**: When querying via secondary index (`SELECT * FROM users WHERE email = ?`), MySQL traverses the email index to get the Primary Key, then traverses the Clustered Index to retrieve full row columns.
- **Covering Index**: If the secondary index contains all requested columns (`SELECT id, email ...`), the second lookup is completely skipped.

### 7. InnoDB Redo Log vs. Undo Log vs. Binlog in MySQL.
**In Simple Words:**
1. **Redo Log (InnoDB Engine level)**: Circular disk buffer ensuring crash durability. Writes dirty buffer modifications sequentially.
2. **Undo Log (InnoDB Engine level)**: Stores pre-image of rows before modification. Enables transaction rollback and MVCC non-locking consistent reads.
3. **Binlog (Binary Log - MySQL Server level)**: Statement or row-based log used for master-slave replication and point-in-time disaster recovery.

### 8. MySQL Master-Slave Replication: Asynchronous vs. Semi-Synchronous vs. Group Replication.
**In Simple Words:**
- **Async Replication**: Master commits transaction immediately without waiting for replicas. Replicas pull binlog via I/O thread. Zero latency penalty on master, but risk of data loss if master dies before log replication.
- **Semi-Sync Replication**: Master waits for at least one replica to acknowledge receiving and persisting the binlog event to its relay log before returning success to client.
- **Group Replication (MGR / InnoDB Cluster)**: Paxos-based distributed consensus ensuring synchronous multi-master or single-master high availability with automatic failover.

### 9. InnoDB Buffer Pool Sizing, LRU Eviction & Dirty Page Flushing.
**In Simple Words:**
The **InnoDB Buffer Pool** caches table data and index pages in RAM. Recommended size is **$60\% - 80\%$** of total server RAM on dedicated database nodes.
- Uses a modified **midpoint insertion LRU algorithm**: new pages are placed at the 5/8th midpoint of the LRU list to prevent table scans from evicting hot cached pages.
- Background threads continuously flush dirty pages to disk based on checkpoint age.

### 10. MySQL Metadata Locking (MDL) and Schema Migration Best Practices (gh-ost / pt-online-schema-change).
**In Simple Words:**
Running `ALTER TABLE` on a high-throughput MySQL table acquires an exclusive Metadata Lock (MDL), queueing all subsequent SELECTs and updates, leading to thread pool exhaustion and downtime.
- **Online Schema Migration Tools (gh-ost, pt-osc)**:
  1. Create ghost table with new schema.
  2. Stream binlog delta changes to ghost table.
  3. Copy historical rows in small throttled batches.
  4. Perform atomic table rename swap in $<10\text{ms}$.

