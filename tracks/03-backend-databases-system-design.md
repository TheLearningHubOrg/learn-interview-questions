# Full-Stack & Backend Database Master Interview Question Bank: SQL, NoSQL, Redis & System Design (1 - 60)

> Simple, intuitive, and easy-to-explain technical interview questions and deep-dive answers covering Relational Databases (PostgreSQL, MySQL, ACID, Indexing, B-Trees, Joins, MVCC), NoSQL Stores (MongoDB, DynamoDB), In-Memory Caching (Redis), and Real-Time Scalability Architecture.

---

## Part 1: Candid Database Experience & Intro Scenarios (1 - 5)

### 1. Walk me through your database experience.
**In Simple Words:**
"In production, I have worked with **PostgreSQL**, **MySQL**, **MongoDB**, **Redis**, and **DynamoDB**.
My decision framework is simple:
- **PostgreSQL**: My default for transactional data, ACID guarantees, relational queries, and JSONB flexibility.
- **MongoDB**: For flexible document schemas and nested polymorphic entities.
- **Redis**: For fast in-memory caching, distributed rate limiting, and session stores.
- **DynamoDB**: For serverless architectures requiring predictable single-digit millisecond latency at scale."

### 2. How do you handle schema migrations without downtime?
**In Simple Words:**
Use the **Expand/Contract Pattern**:
1. **Expand**: Add new columns as nullable, and create new indexes concurrently (`CREATE INDEX CONCURRENTLY` in Postgres to avoid table locks).
2. **Dual-Writing**: Update backend code to write to both old and new schema fields.
3. **Backfill**: Run background scripts to backfill legacy rows.
4. **Contract**: Switch reads to new columns, remove writes to old columns, and safely drop deprecated columns.

### 3. Describe a severe database performance issue you resolved.
**How to Explain in an Interview:**
- **Problem**: Primary PostgreSQL CPU hit 100% and connection pool exhaustion caused 504 errors.
- **Root Cause**: Running `EXPLAIN ANALYZE` revealed a sequential scan across 15M rows due to a missing composite index on a foreign key join.
- **Fix**: Created the composite index concurrently on `(user_id, created_at DESC)`, added **PgBouncer** in transaction pooling mode to reuse connections, and cached hot catalog reads in Redis.

### 4. Relational normalized schema vs flexible document collections:
**In Simple Words:**
- Choose **Relational (3NF)** when data has complex many-to-many relationships and transactions need atomicity across multiple tables.
- Choose **Document (MongoDB)** when data is accessed together as a single aggregate (e.g. an Order containing its Items and Shipping Address).

### 5. Strategy for database security and connection pooling:
**In Simple Words:**
- **Networking**: Databases live in private VPC subnets with zero public internet access; SSL enforced.
- **Pooling**: Use proxy poolers like PgBouncer to prevent thousands of client connections from exhausting database memory.
- **Credentials**: Passwords hashed with `bcrypt`/`argon2`; sensitive PII encrypted at rest.

---

## Part 2: Relational Databases (RDBMS / PostgreSQL / MySQL) (6 - 25)

### 6. What are the ACID properties in relational databases?
**In Simple Words:**
ACID guarantees that database transactions are executed reliably:
- **A - Atomicity ("All or Nothing")**: If one step of a transfer fails, the entire transaction rolls back.
- **C - Consistency**: Data must always obey schema constraints (Foreign Keys, Unique checks).
- **I - Isolation**: Concurrent transactions don't interfere with each other.
- **D - Durability**: Once committed, data is written to disk (WAL) and won't be lost even on power failure.

### 7. Normalization (1NF to BCNF) vs Denormalization:
**In Simple Words:**
- **Normalization**: Eliminates duplicate data and update anomalies by splitting data into related tables (1NF = atomic values, 2NF = full key dependency, 3NF = no transitive dependencies).
- **Denormalization**: Intentionally duplicating data to avoid expensive SQL `JOIN` operations on high-throughput read systems.

### 8. Primary Key vs Unique Key vs Foreign Key:
- **Primary Key**: Uniquely identifies each row; strictly unique and cannot be `NULL` (one per table).
- **Unique Key**: Enforces unique values; allows `NULL` values.
- **Foreign Key**: Links a column to the Primary Key of another table to maintain referential integrity.

### 9. SQL Transaction Isolation Levels:
1. **Read Uncommitted**: Lowest isolation; allows dirty reads.
2. **Read Committed** (Default in Postgres): Reads only committed rows.
3. **Repeatable Read** (Default in MySQL InnoDB): Guarantees the same row read twice inside a transaction returns identical data.
4. **Serializable**: Highest isolation; transactions execute as if run strictly one after another.

### 10. Dirty Reads vs Non-Repeatable Reads vs Phantom Reads:
- **Dirty Read**: Reading uncommitted data written by another transaction that later rolls back.
- **Non-Repeatable Read**: Re-reading a row and finding its values updated by another committed transaction.
- **Phantom Read**: Re-running a range query (`WHERE age > 30`) and finding new rows inserted by another committed transaction.

### 11. How do B-Tree indexes work internally?
**In Simple Words:**
B-Trees are self-balancing search trees with shallow depth and high branching fanout. Keys are kept sorted, allowing $O(\log N)$ search, insert, and delete operations. In B+Trees, all data pointers live in linked leaf nodes, making range queries (`BETWEEN`, `>`, `<`) exceptionally fast.

### 12. Clustered Index vs Non-Clustered Index:
- **Clustered Index**: Determines the physical on-disk storage order of table rows (only 1 per table, usually Primary Key). Leaf nodes contain the full row data.
- **Non-Clustered Index**: A separate index structure whose leaf nodes contain the index key and a pointer back to the actual table row.

### 13. Composite Index and the "Leftmost Prefix Rule":
**In Simple Words:**
An index on `(A, B, C)` only accelerates queries that filter on the leftmost column `A`:
- `WHERE A = 1 AND B = 2` -> Uses index.
- `WHERE B = 2 AND C = 3` -> **Cannot** use index because leading column `A` is omitted.

### 14. EXPLAIN vs EXPLAIN ANALYZE:
- `EXPLAIN`: Shows the optimizer's estimated execution plan without running the query.
- `EXPLAIN ANALYZE`: Actually executes the query, reporting real execution times, buffer hits, and scan types (Sequential Scan vs Index Scan).

### 15. SQL Joins comparison:
- **INNER JOIN**: Returns rows only when keys match in both tables.
- **LEFT JOIN**: Returns all left rows plus matched right rows (`NULL` if no match).
- **CROSS JOIN**: Cartesian product ($M \times N$ rows; dangerous on large tables).

### 16. Join Execution Algorithms (Nested Loop, Hash Join, Merge Join):
- **Nested Loop**: For each row in outer table, scans inner table (great when inner table has index).
- **Hash Join**: Builds an in-memory hash table of smaller table, then scans larger table probing the hash table (best for large unindexed joins).
- **Merge Join**: Both datasets must be pre-sorted on join keys; scans both in lockstep.

### 17. PostgreSQL JSONB and GIN Indexes:
`JSONB` stores JSON in a decomposed binary format rather than plain text. A **GIN (Generalized Inverted Index)** indexes internal keys and values, allowing fast $O(1)$ search queries inside JSON payloads.

### 18. Database Connection Pooling (PgBouncer):
Opening database TCP connections is expensive. Connection poolers keep a warm pool of reusable connections, allowing 5,000 app clients to safely share 50 database connections.

### 19. Deadlocks in SQL transactions:
Occurs when Transaction A holds Lock 1 and waits for Lock 2, while Transaction B holds Lock 2 and waits for Lock 1.
- **Detection**: The database detects the cycle and terminates one transaction.
- **Prevention**: Enforce consistent lock acquisition order across all application code.

### 20. Table Partitioning vs Sharding:
- **Table Partitioning**: Splitting a huge table into smaller physical child tables on the **same database server**.
- **Database Sharding**: Distributing data horizontally across **multiple independent physical database servers**.

### 21. Stored Procedures, Triggers, and Views:
- **Stored Procedures**: Compiled business logic executing inside the database.
- **Triggers**: Code executing automatically before/after an insert or update.
- **Materialized Views**: Queries whose results are saved on disk for fast analytical reporting.

### 22. Soft Deletes and Partial Indexes:
Setting `deleted_at = NOW()` instead of deleting rows causes index bloat.
**Fix**: Create a **Partial Index**:
`CREATE INDEX idx_users ON users (email) WHERE deleted_at IS NULL;`

### 23. Write-Ahead Logging (WAL) and PITR:
Before any change touches data files on disk, it is written to the append-only WAL.
**Point-In-Time Recovery (PITR)**: Allows replaying base backups plus archived WAL logs to restore a database to the exact second prior to an accidental `DROP TABLE`.

### 24. MVCC and VACUUM in PostgreSQL:
In Postgres, updating a row writes a new row version rather than overwriting old bytes. Old versions become "dead tuples". `VACUUM` reclaims disk space occupied by dead tuples.

### 25. The N+1 Query Problem in ORMs:
Fetching 100 users, and then executing 100 individual queries inside a loop to fetch each user's profile ($1 + 100 = 101$ queries).
**Fix**: Use Eager Loading (`include`, `preload`, `joinedload`) to fetch all profiles in a single query using `IN (...)`.

---

## Part 3: NoSQL & Document Databases (MongoDB, DynamoDB) (26 - 40)

### 26. CAP Theorem:
A distributed system can guarantee at most two of three:
- **Consistency**: Every read gets latest write.
- **Availability**: Every request gets a non-error response.
- **Partition Tolerance**: System keeps running despite network splits.
- RDBMS focuses on **CA** or **CP**; NoSQL typically focuses on **CP** or **AP**.

### 27. When to choose MongoDB over PostgreSQL:
When schemas vary wildly between records, when data is deeply nested and accessed together, and when horizontal sharding out of the box is required.

### 28. MongoDB: Embedding vs Referencing:
- **Embed**: For 1-to-few relationships where child data is always retrieved with parent (Order Items in an Order).
- **Reference**: For 1-to-many or many-to-many relationships where data updates frequently or approaches 16MB document size limit.

### 29. MongoDB Aggregation Pipeline:
`$match` (filters) -> `$group` (aggregates) -> `$project` (reshapes) -> `$lookup` (joins) -> `$unwind` (flattens arrays).

### 30. MongoDB Compound & Multikey Indexes:
- **Compound Index**: Indexes multiple fields; follows leftmost prefix rule.
- **Multikey Index**: Indexes an array field by creating an index entry for every element in the array.

### 31. Replica Sets vs Sharded Clusters in MongoDB:
- **Replica Sets**: High availability (1 Primary + multiple Secondaries with automated failover).
- **Sharded Clusters**: Horizontal scaling by distributing data across shards via a shard key.

### 32. MongoDB Oplog & Change Streams:
The Oplog records all write operations. **Change Streams** allow apps to listen to real-time database changes without polling.

### 33. MongoDB Transactions:
Single-document writes are always atomic. Starting in MongoDB 4.0+, multi-document ACID transactions are fully supported.

### 34. Write Concerns & Read Concerns:
- **Write Concern (`w: "majority"`)**: Waits for a majority of replica nodes to commit before acknowledging.
- **Read Concern (`"majority"`)**: Reads only data committed by a majority of nodes.

### 35. TTL (Time-To-Live) Indexes:
Automatically deletes documents after a specified duration: `db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })`. Ideal for sessions and OTPs.

### 36. DynamoDB Partition Keys, Sort Keys & Hot Partitions:
- **Partition Key (HASH)**: Determines which physical storage partition data goes to.
- **Sort Key (RANGE)**: Orders items within the partition.
- **Hot Partition**: Occurs when access heavily hits a single key, exceeding per-partition limits.

### 37. DynamoDB GSI vs LSI:
- **LSI**: Shares table's Partition Key with a different Sort Key; max 10GB per partition.
- **GSI**: Can define completely new Partition and Sort keys; scales throughput independently.

### 38. Optimistic vs Pessimistic Locking:
- **Optimistic Locking**: Records carry a `version` field. Updates check `WHERE version = 5`; if changed, update fails and retries.
- **Pessimistic Locking**: Locks records explicitly (`SELECT ... FOR UPDATE`), preventing anyone else from reading/writing until committed.

### 39. Eventual Consistency:
In distributed stores, writes replicate asynchronously to secondary nodes. A read immediately after a write might briefly return stale data. Fix: Use Strongly Consistent Reads where critical.

### 40. Wide-Column (Cassandra) vs Graph (Neo4j):
- **Cassandra**: High-write distributed storage across multiple datacenters.
- **Neo4j**: Graph database storing nodes and edges; constant-time traversal across deep relationships (social networks, fraud detection).

---

## Part 4: In-Memory Caching & Fast Data Stores (Redis) (41 - 50)

### 41. Why single-threaded Redis handles 100k+ ops/sec:
1. **In-Memory**: Operations run in RAM, bypassing slow disk I/O.
2. **Single-Threaded**: Zero lock contention, zero thread context-switching, and no race conditions.
3. **I/O Multiplexing (`epoll`)**: Non-blocking event loop handles thousands of connections on a single thread.

### 42. Core Redis Data Structures:
- **Strings**: Caching API responses, counters (`INCR`).
- **Hashes**: Storing user objects (`HSET`).
- **Lists**: Queues (`LPUSH`, `RPOP`).
- **Sets**: Unique tags, mutual friends (`SADD`, `SINTER`).
- **Sorted Sets (ZSET)**: Leaderboards, sliding window rate limiters (`ZADD`).

### 43. Caching Strategies:
- **Cache-Aside (Lazy Loading)**: App checks cache; if miss, queries DB, populates cache, and returns.
- **Write-Through**: App writes to cache; cache synchronously writes to DB.
- **Write-Behind**: App writes to cache; cache asynchronously flushes batch writes to DB.

### 44. Cache Stampede vs Penetration vs Avalanche:
- **Stampede (Thundering Herd)**: Hot key expires; thousands hit DB at once. Fix: Mutex lock on miss.
- **Penetration**: Requests for non-existent keys bypass cache. Fix: Cache null values or use Bloom Filter.
- **Avalanche**: Hundreds of keys expire at the same second. Fix: Add random jitter to TTLs.

### 45. Redis Eviction Policies:
`allkeys-lru` (evicts least-recently-used), `volatile-lru` (evicts LRU among keys with TTL), `allkeys-lfu` (evicts least-frequently-used).

### 46. Redis Persistence: RDB vs AOF:
- **RDB**: Point-in-time binary snapshots. Fast restarts, but risks losing recent minutes of data.
- **AOF**: Append-only log of every write command. High durability, but larger file size. Production standard: Combine both.

### 47. Redis Sliding Window Rate Limiter:
Uses a Sorted Set (ZSET) where score is the current timestamp: `ZREMRANGEBYSCORE` clears expired timestamps; `ZCARD` counts active requests in the window.

### 48. Distributed Locks in Redis (Redlock):
Acquire lock with atomic `SET key random_token NX PX 30000`. Release using a Lua script verifying `random_token` matches before deleting.

### 49. Redis Pub/Sub vs Redis Streams:
- **Pub/Sub**: Fire-and-forget; messages are not saved.
- **Streams**: Persistent message log with Consumer Groups and acknowledgments (`XACK`).

### 50. When Redis caching is architectural overkill:
When an app has low traffic (< 50 req/sec), queries are already sub-10ms with proper indexing, or data changes so fast that cache invalidation overhead outweighs gains.

---

## Part 5: Real-Time Architecture, Replication & Scale (51 - 60)

### 51. Read-Write Splitting (Primary/Replica):
All writes (`INSERT`, `UPDATE`) go to Primary. Replicas replicate asynchronously and serve read queries (`SELECT`) to scale read capacity horizontally.

### 52. Change Data Capture (CDC):
Taps into database transaction logs (WAL/binlog) to stream row changes to Kafka/RabbitMQ without impacting application transaction performance.

### 53. Database Sharding:
Distributing data horizontally across multiple database servers by Hashing, Ranges, or Directory lookup.

### 54. Database Failover & Leader Election (Raft):
When Primary fails heartbeats, replicas run Raft leader election. The replica with the latest log offset is promoted to new Primary.

### 55. The Transactional Outbox Pattern:
Instead of writing to the database and sending an event to Kafka in two separate operations (which risks partial failure), write the event into an `outbox` table in the **same atomic database transaction**. A background worker or CDC process tails the table and publishes to Kafka.

### 56. Full-Text Search: Elasticsearch vs SQL LIKE vs tsvector:
`LIKE '%pattern%'` requires slow full-table scans. PostgreSQL `tsvector` with GIN index provides fast text search built-in. Elasticsearch is a dedicated distributed cluster for fuzzy matching and spell checking at scale.

### 57. Time-Series Databases (TimescaleDB, InfluxDB):
Organize data into time-partitioned chunks ("hypertables"), optimizing high-volume sequential writes and compressing historical metrics.

### 58. Connection Starvation & Circuit Breakers:
If the database slows down, waiting requests hold connection pool slots until the pool starves. A **Circuit Breaker** detects failures and trips open, failing fast without overwhelming the database.

### 59. Vector Databases (pgvector, Pinecone) & HNSW:
Indexes high-dimensional AI embeddings. **HNSW (Hierarchical Navigable Small World)** provides sub-millisecond Approximate Nearest Neighbor (ANN) search across millions of vectors.

### 60. RPO vs RTO Disaster Recovery:
- **RPO (Recovery Point Objective)**: Maximum acceptable data loss duration (e.g. at most 5 mins of data).
- **RTO (Recovery Time Objective)**: Maximum acceptable downtime duration to restore service (e.g. restore within 15 mins).
