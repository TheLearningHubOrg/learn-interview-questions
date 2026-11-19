# PostgreSQL Advanced & Internals Master Interview Bank (1 - 15)

> PostgreSQL MVCC, WAL (Write-Ahead Logging), VACUUM and Autovacuum, GIN/GiST/BRIN indexes, CTEs, table partitioning, JSONB querying, and connection pooling with PgBouncer.

---

### 1. PostgreSQL JSONB and GIN Indexes:
**In Simple Words:**
`JSONB` stores JSON in a decomposed binary format rather than plain text. A **GIN (Generali

### 2. Database Connection Pooling (PgBouncer):
**In Simple Words:**
Opening database TCP connections is expensive. Connection poolers keep a warm pool of reusable connections, allowing 5,000 app clients to safely share 50 database connections.

```sql
-- Monitor active vs idle connections in PostgreSQL:
SELECT state, count(*) 
FROM pg_stat_activity 
GROUP BY state;
```

### 3. Deadlocks in SQL transactions:
**In Simple Words:**
Occurs when Transaction A holds Lock 1 and waits for Lock 2, while Transaction B holds Lock 2 and waits for Lock 1.
- **Detection**: The database detects the cycle and terminates one transaction.
- **Prevention**: Always acquire locks in the exact same alphabetical or numerical order across all code!

```sql
-- Transaction A (locks user 1, then user 2):
BEGIN;
SELECT * FROM users WHERE id = 1 FOR UPDATE;
SELECT * FROM users WHERE id = 2 FOR UPDATE;
COMMIT;

-- Prevention: Sort IDs before locking in application code:
-- const ids = [idA, idB].sort();
```

### 4. Table Partitioning vs Sharding:
**In Simple Words:**
- **Table Partitioning**: Splitting a huge table into smaller physical child tables on the **same database server**.
- **Database Sharding**: Distributing data hori

### 5. Stored Procedures, Triggers, and Views:
**In Simple Words:**
- **Stored Procedures**: Compiled business logic executing inside the database.
- **Triggers**: Code executing automatically before/after an insert or update.
- **Materiali

### 6. Soft Deletes and Partial Indexes:
**In Simple Words:**
Setting `deleted_at = NOW()` instead of deleting rows causes index bloat.
**Fix**: Create a **Partial Index** that indexes only active non-deleted rows!

```sql
-- Partial index: only indexes active records (small, fast, ignores deleted rows):
CREATE UNIQUE INDEX uq_active_user_email ON users (email) 
WHERE deleted_at IS NULL;
```

### 7. Write-Ahead Logging (WAL) and PITR:
**In Simple Words:**
Before any change touches data files on disk, it is written to the append-only WAL.
**Point-In-Time Recovery (PITR)**: Allows replaying base backups plus archived WAL logs to restore a database to the exact second prior to an accidental `DROP TABLE`.

```bash
# PostgreSQL PITR recovery configuration (postgresql.conf / recovery.signal):
restore_command = 'cp /mnt/wal_archive/%f %p'
recovery_target_time = '2026-11-06 14:32:00 UTC'
```

### 8. MVCC and VACUUM in PostgreSQL:
**In Simple Words:**
In Postgres, updating a row writes a new row version rather than overwriting old bytes. Old versions become "dead tuples". `VACUUM` reclaims disk space occupied by dead tuples.

```sql
-- Check dead tuple count on a table:
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum 
FROM pg_stat_user_tables 
WHERE relname = 'orders';

-- Manually vacuum and analy

### 9. Vector Databases (pgvector, Pinecone) & HNSW:
**In Simple Words:**
Indexes high-dimensional AI embeddings. **HNSW (Hierarchical Navigable Small World)** provides sub-millisecond Approximate Nearest Neighbor (ANN) search across millions of vectors.

```sql
-- PostgreSQL pgvector setup:
CREATE EXTENSION vector;
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding vector(1536) -- OpenAI embedding si

### 10. PostgreSQL MVCC (Multi-Version Concurrency Control): How xmin, xmax, and tuple freezing work.
**In Simple Words:**
In PostgreSQL, when a row is updated or deleted, the old tuple is not overwritten. Instead:
- Every row header has `xmin` (the transaction ID that inserted the row) and `xmax` (the transaction ID that updated/deleted the row).
- A transaction only sees rows where `xmin` is committed before the current transaction snapshot and `xmax` is either empty or uncommitted.
- **Tuple Freezing**: Transaction IDs are 32-bit integers that wrap around at $\approx 2$ billion transactions. `VACUUM` freezes older tuples (marking them `FrozenXID`) to prevent transaction ID wraparound failure.

### 11. PostgreSQL Index Types: B-Tree vs. GIN vs. GiST vs. BRIN.
**In Simple Words:**
1. **B-Tree**: Default. Best for scalar comparisons (`=`, `<`, `>`, `BETWEEN`, `ORDER BY`).
2. **GIN (Generalized Inverted Index)**: Indexes composite items containing multiple elements (JSONB, full-text search `tsvector`, arrays). Fast lookups for contains operators (`@>`).
3. **GiST (Generalized Search Tree)**: Balanced tree structure for multi-dimensional data, geometric coordinates (PostGIS `ST_DWithin`), and range types (`tsrange`).
4. **BRIN (Block Range Index)**: Compact index for massive append-only timeseries tables physically sorted by timestamp. Stores only min/max values per disk block range; occupies $<1\%$ the RAM of a B-Tree.

### 12. Write-Ahead Logging (WAL) and Checkpointing in PostgreSQL.
**In Simple Words:**
PostgreSQL guarantees durability (the 'D' in ACID) using WAL:
- Before any dirty database buffer page is written to disk tablespaces, the delta changes are sequentially appended to the WAL buffer on disk.
- **Checkpointing**: At configured intervals (`checkpoint_timeout` or `max_wal_size`), PostgreSQL flushes all dirty memory pages to permanent data files and writes a checkpoint record to WAL. Crash recovery only needs to replay WAL logs from the last checkpoint forward.

### 13. PostgreSQL Connection Pooling: Why PgBouncer is necessary in production.
**In Simple Words:**
PostgreSQL uses a process-per-connection architecture (each connected client spawns an OS process consuming ~5MB–10MB of RAM). At $>500$ concurrent direct connections, process context switching degrades CPU cache locality.
- **PgBouncer** is a lightweight proxy supporting **Transaction Pooling**: 10,000 client connections can share a pool of just 50 genuine PostgreSQL server processes. The backend connection is allocated only for the duration of a transaction and returned immediately upon `COMMIT`.

### 14. PostgreSQL Table Partitioning: Declarative Range vs. List vs. Hash Partitioning.
**In Simple Words:**
Declarative partitioning splits a massive table into smaller physical partition tables:
1. **Range Partitioning**: Segment by date ranges (e.g. `orders_2026_01`, `orders_2026_02`).
2. **List Partitioning**: Segment by explicit values (e.g. `region = 'EU'`, `region = 'US'`).
3. **Hash Partitioning**: Distributes rows evenly using modulus hashing on a tenant ID.
- **Partition Pruning**: The query planner analyzes `WHERE` clauses and skips scanning unneeded partition tables completely.

### 15. EXPLAIN and EXPLAIN ANALYZE: Sequential Scan vs. Index Scan vs. Bitmap Heap Scan.
**In Simple Words:**
- **Seq Scan**: Reads every page of the table from disk. Used when table is tiny or query selects $>20\%$ of rows.
- **Index Scan**: Traverses B-Tree to find row pointer (TID) and immediately reads corresponding table heap page.
- **Bitmap Index Scan + Bitmap Heap Scan**: Used when index matches hundreds of rows. Creates an in-memory bitmap of matched table pages and sorts disk block visits in physical order to turn random I/O into sequential disk reads.

