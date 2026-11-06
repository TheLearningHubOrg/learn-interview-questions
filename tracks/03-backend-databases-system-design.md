# Full-Stack & Backend Database Master Interview Question Bank: SQL, NoSQL, Redis & System Design (1 - 60)

> Comprehensive, production-level technical interview questions and deep-dive answers covering Relational Databases (PostgreSQL, MySQL, ACID, Indexing, B-Trees, Joins, MVCC), NoSQL Stores (MongoDB, DynamoDB), In-Memory Caching (Redis), and Real-Time Scalability Architecture.

---

## Table of Contents
- [Part 1: Candid Database Experience & Intro Scenarios (1 - 5)](#part-1-candid-database-experience--intro-scenarios-1---5)
- [Part 2: Relational Databases (RDBMS / PostgreSQL / MySQL) (6 - 25)](#part-2-relational-databases-rdbms--postgresql--mysql-6---25)
- [Part 3: NoSQL & Document Databases (MongoDB, DynamoDB) (26 - 40)](#part-3-nosql--document-databases-mongodb-dynamodb-26---40)
- [Part 4: In-Memory Caching & Fast Data Stores (Redis) (41 - 50)](#part-4-in-memory-caching--fast-data-stores-redis-41---50)
- [Part 5: Real-Time Architecture, Replication & Scale (51 - 60)](#part-5-real-time-architecture-replication--scale-51---60)

---

## Part 1: Candid Database Experience & Intro Scenarios (1 - 5)

### 1. Walk me through your database experience: which databases have you used in production, and how did you decide between them?
**Answer:**
"In production environments, I have worked extensively with **PostgreSQL**, **MySQL**, **MongoDB**, **Redis**, and **DynamoDB**.
My decision framework centers on access patterns and consistency guarantees:
- **PostgreSQL**: My default choice for transactional workloads requiring strict ACID guarantees, rich relational data modeling, complex analytical joins, and JSONB flexibility.
- **MongoDB**: Used when rapid prototyping or document-oriented schemas with deeply nested polymorphic entities (e.g., product catalogs, content management) outshine relational tables.
- **Redis**: Used as an in-memory caching tier, session store, distributed rate limiter, and Pub/Sub message broker.
- **DynamoDB**: Used in serverless event-driven architectures requiring predictable single-digit millisecond latency at arbitrary scale using single-table design."

### 2. How do you handle schema migrations in an active production environment without incurring downtime or table locks?
**Answer:**
"I follow the **Expand/Contract (Parallel Run) Pattern**:
1. **Expand**: Add new columns as nullable or with defaults, and create new indexes concurrently (`CREATE INDEX CONCURRENTLY` in Postgres to avoid exclusive table locks).
2. **Dual-Writing**: Update backend application code to write to both old and new schema shapes while continuing to read from the old schema.
3. **Backfill**: Run asynchronous batch migration scripts to backfill legacy rows.
4. **Contract**: Switch application reads to the new schema. Once verified, deploy code removing writes to the old schema, and finally drop deprecated columns."

### 3. Describe a severe database performance issue you encountered. How did you debug and optimize it?
**Answer:**
"During a high-traffic flash sale, our primary PostgreSQL database CPU spiked to 100%, and connection pool exhaustion caused 504 gateway timeouts.
**Debugging**: I queried `pg_stat_activity` to inspect active connections and identified long-running queries in `pg_stat_statements`. Running `EXPLAIN (ANALYZE, BUFFERS)` revealed a sequential scan across 15 million order rows due to an unindexed foreign key in a `JOIN`.
**Resolution**:
1. Added a composite index concurrently on `(user_id, created_at DESC)`.
2. Introduced **PgBouncer** in transaction pooling mode to reuse connection slots and prevent thread starvation.
3. Added a Redis Cache-Aside layer for hot catalog reads, reducing database query volume by 72%."

### 4. How do you approach data modeling for a new service: relational normalized schemas vs flexible document collections?
**Answer:**
"I start by mapping out **Query Access Patterns**:
- If data has intricate many-to-many relationships, financial transactions requiring atomicity across multiple entities, and unpredictable future query criteria, I choose a **normalized Relational Model (3NF)**.
- If data is accessed together as a bounded aggregate (e.g., an Order containing its OrderItems and ShippingAddress) with clear single-entity ownership and high read throughput, I choose a **Document Model**."

### 5. What is your strategy for managing database security, connection pooling, and protecting sensitive user credentials or PII?
**Answer:**
- **Credentials & PII**: Enforce column-level encryption (or application-layer AES-GCM encryption) for sensitive PII. Passwords hashed using `argon2id` or `bcrypt` with unique salts.
- **Networking**: Databases hosted in isolated private VPC subnets with zero public internet ingress. Connections enforced via SSL/TLS certificates.
- **Pooling**: Use proxy connection poolers (PgBouncer for Postgres, ProxySQL for MySQL) with strict max client connection thresholds to protect the database engine from memory exhaustion.
- **Least Privilege**: Application database users granted only minimum necessary DML privileges (`SELECT`, `INSERT`, `UPDATE`), disallowing DDL operations at runtime.

---

## Part 2: Relational Databases (RDBMS / PostgreSQL / MySQL) (6 - 25)

### 6. What are the ACID properties in relational databases, and how does a database engine enforce each?
**Answer:**
- **Atomicity (All or Nothing)**: Enforced via Write-Ahead Logging (WAL) and undo logs. If a transaction crashes mid-way, uncommitted mutations are rolled back.
- **Consistency**: Enforced via schema constraints (Foreign Keys, Unique constraints, Check constraints, Data types).
- **Isolation**: Prevents concurrent transactions from interfering. Enforced via Multi-Version Concurrency Control (MVCC) and row/table locks.
- **Durability**: Guarantees committed transactions persist even through hardware power failures. Enforced via syncing transaction logs to disk before acknowledging commit (`fsync`).

### 7. Explain Database Normalization (1NF, 2NF, 3NF, BCNF) versus Denormalization.
**Answer:**
- **1NF**: Atomic column values (no arrays or repeating groups); unique primary key.
- **2NF**: In 1NF and all non-key attributes are fully functionally dependent on the entire primary key (eliminates partial dependencies).
- **3NF**: In 2NF and no transitive dependencies (non-key attributes depend *only* on the primary key).
- **BCNF**: Stronger 3NF; every determinant is a candidate key.
- **Denormalization**: Intentionally duplicating data across tables to eliminate expensive `JOIN` operations and accelerate high-throughput read queries.

### 8. Primary Key vs Unique Key vs Composite Key vs Foreign Key.
**Answer:**
- **Primary Key**: Uniquely identifies each row; strictly unique and cannot contain `NULL` (automatically clustered index in MySQL InnoDB).
- **Unique Key**: Enforces uniqueness; allows one or more `NULL` values.
- **Composite Key**: A primary or unique key composed of two or more columns together.
- **Foreign Key**: Enforces referential integrity by linking a column to the primary key of another table.

### 9. SQL Transaction Isolation Levels.
**Answer:**
1. **Read Uncommitted**: Lowest isolation; allows dirty reads.
2. **Read Committed** (Default in Postgres): Reads only committed rows. Avoids dirty reads.
3. **Repeatable Read** (Default in MySQL InnoDB): Guarantees that any row read during a transaction will read the same snapshot throughout.
4. **Serializable**: Highest isolation; transactions execute as if strictly serial. Employs snapshot isolation or range locks to eliminate phantom reads.

### 10. Dirty Reads, Non-Repeatable Reads, and Phantom Reads.
**Answer:**
- **Dirty Read**: Reading uncommitted data written by another in-flight transaction that subsequently rolls back.
- **Non-Repeatable Read**: Reading a row twice within a transaction and getting different data because another transaction updated and committed that row in between.
- **Phantom Read**: Re-running a query with a range condition (`WHERE age > 30`) and finding new 'phantom' rows inserted and committed by another transaction.

### 11. How do B-Tree indexes work internally?
**Answer:**
B-Trees (and B+Trees) are self-balancing multi-way search trees with shallow depth and high branching factor (fanout). Keys are kept sorted, allowing $O(\log N)$ search, insert, and delete operations.
In B+Trees (used by Postgres and InnoDB), all actual data pointers reside exclusively in the leaf nodes, which are linked as a doubly linked list, making range scans (`BETWEEN`, `>`, `<`) exceptionally fast.

### 12. Clustered Index vs Non-Clustered (Secondary) Index.
**Answer:**
- **Clustered Index**: Dictates the physical storage order of rows on disk. There can be only **one** clustered index per table (typically the Primary Key). Leaf nodes contain the full table row data.
- **Non-Clustered Index**: A separate auxiliary index structure. Leaf nodes contain the index key and a pointer (or Primary Key reference) back to the actual row data (requiring a secondary lookup).

### 13. Composite Index and the "Leftmost Prefix Rule".
**Answer:**
A composite index on `(A, B, C)` can only be used by the query optimizer if the query filters on the leftmost column `A`:
- `WHERE A = 1` -> Uses index.
- `WHERE A = 1 AND B = 2` -> Uses index.
- `WHERE B = 2 AND C = 3` -> **Cannot** use the composite index because the leading column `A` is missing.

### 14. EXPLAIN and EXPLAIN ANALYZE: Scans comparison.
**Answer:**
- `EXPLAIN`: Shows the optimizer's estimated execution plan without running the query.
- `EXPLAIN ANALYZE`: Actually executes the query and reports real runtime, memory, and buffer hits.
- **Sequential Scan**: Reads every page of the table from start to finish ($O(N)$).
- **Index Scan**: Traverses B-tree to find keys and fetches rows from disk.
- **Bitmap Index Scan**: Collects matching row pointers into a bitmap in memory, sorts them by physical disk location, and reads heap pages sequentially.

### 15. Performance differences across SQL Joins.
**Answer:**
- **INNER JOIN**: Returns rows only when keys match in both tables. Most efficient.
- **LEFT JOIN**: Returns all left rows plus matched right rows (unmatched right columns return `NULL`). Requires evaluating the entire left set.
- **CROSS JOIN**: Cartesian product ($M \times N$ rows). Extremely dangerous on large datasets.

### 16. Join Execution Algorithms: Nested Loop, Hash Join, Merge Join.
**Answer:**
- **Nested Loop Join**: For each row in outer table, scans inner table. Efficient when the outer table is small and the inner table has an index.
- **Hash Join**: Builds an in-memory hash table of the smaller table, then scans the larger table probing the hash table. Best for large, unindexed equality joins.
- **Merge Join**: Both datasets must be sorted on join keys. Scans both lists concurrently in lockstep. Best for large sorted datasets.

### 17. PostgreSQL JSONB columns and GIN Indexes.
**Answer:**
`JSONB` stores JSON in a decomposed binary format rather than plain text:
- Supports fast querying and indexing.
- **GIN (Generalized Inverted Index)**: Indexes individual keys and values within JSONB documents, allowing $O(1)$ containment queries (`WHERE data @> '{"role": "admin"}'`).

### 18. Database Connection Pooling (PgBouncer, HikariCP).
**Answer:**
Creating a database TCP connection is expensive (forking backend processes, allocating memory buffers, TLS handshakes). Connection poolers maintain a warm pool of reusable connections. PgBouncer in **Transaction Pooling** mode allows 5,000 application clients to share 50 backend database connections safely.

### 19. Deadlocks in SQL Transactions.
**Answer:**
Occurs when Transaction A holds Lock 1 and waits for Lock 2, while Transaction B holds Lock 2 and waits for Lock 1.
- **Detection**: Database engine runs a background cycle-detection graph; on timeout, it terminates and rolls back one transaction with a `DeadlockDetected` error.
- **Prevention**: Enforce consistent lock acquisition order across all application code.

### 20. Database Partitioning vs Sharding.
**Answer:**
- **Table Partitioning**: Splitting a large table into smaller physical child tables (by Range, List, or Hash) on the **same single database instance**. Query engine automatically prunes unneeded partitions.
- **Database Sharding**: Distributing data horizontally across **multiple independent physical database servers**.

### 21. Stored Procedures, Triggers, and Views.
**Answer:**
- **Stored Procedures**: Compiled business logic executing inside the database engine.
- **Triggers**: Automated procedures executing before/after `INSERT`, `UPDATE`, or `DELETE`. Can introduce hidden side-effects.
- **Views**: Virtual tables defined by a query. **Materialized Views** persist query results to disk for fast analytical reporting, refreshed periodically.

### 22. Soft Deletes and Partial Indexes.
**Answer:**
Setting `deleted_at = NOW()` instead of deleting rows causes table bloat and slows down queries.
**Solution**: Create a **Partial Index**:
```sql
CREATE INDEX idx_active_users ON users (email) WHERE deleted_at IS NULL;
```
Indexes only active rows, keeping index size small and queries blazing fast.

### 23. Write-Ahead Logging (WAL) and PITR.
**Answer:**
Before any data page mutation is written to table disk files, the change is appended sequentially to the WAL.
**Point-In-Time Recovery (PITR)**: By replaying base filesystem backups combined with archived WAL logs, an engineer can restore the database to the exact second prior to an accidental `DROP TABLE`.

### 24. MVCC (Multi-Version Concurrency Control) and VACUUM in PostgreSQL.
**Answer:**
In Postgres, updating a row does not overwrite disk bytes; it writes a new version (tuple) with updated `xmin`/`xmax` transaction markers. Old tuples become "dead tuples".
`VACUUM` reclaims storage occupied by dead tuples and updates table visibility maps and statistics. `autovacuum` runs continuously in the background.

### 25. N+1 Query Problem in ORMs.
**Answer:**
Fetching 100 users, and then executing 100 individual queries inside a loop to fetch each user's profile:
$1 + 100 = 101$ queries.
**Resolution**: Use Eager Loading (`include`, `preload`, or `joinedload`) which fetches all related profiles in a single query using `IN (...)` or `JOIN`.

---

## Part 3: NoSQL & Document Databases (MongoDB, DynamoDB) (26 - 40)

### 26. CAP Theorem: SQL vs NoSQL.
**Answer:**
A distributed system can guarantee at most two of three properties:
- **Consistency**: Every read receives the most recent write.
- **Availability**: Every non-failing node returns a response.
- **Partition Tolerance**: System continues operating despite dropped network messages.
- Traditional RDBMS: Focuses on **CA** (single-node) or CP.
- NoSQL (MongoDB, DynamoDB): Configured as **CP** (strict consistency) or **AP** (high availability with eventual consistency).

### 27. Choosing Document Store (MongoDB) over Relational (PostgreSQL).
**Answer:**
Choose MongoDB when:
- Data structure is naturally hierarchical and self-contained (e.g., product catalog with dynamic custom attributes).
- Document schemas evolve rapidly and vary significantly between records.
- High-write volume requires built-in sharding and horizontal clustering out of the box.

### 28. MongoDB Modeling: Embedding vs Referencing.
**Answer:**
- **Embed** when: 1-to-1 or 1-to-Few relationships; child data is always retrieved together with the parent and has no standalone lifecycle (e.g., Order Items within an Order).
- **Reference** when: 1-to-Many or Many-to-Many relationships; data changes frequently or document sizes approach the 16MB BSON limit.

### 29. MongoDB Aggregation Framework.
**Answer:**
A data processing pipeline where documents pass through multi-stage transformations:
- `$match`: Filters documents (like `WHERE`).
- `$group`: Groups by key and calculates aggregates (like `GROUP BY`).
- `$project`: Reshapes document fields.
- `$lookup`: Performs left outer joins with other collections.
- `$unwind`: Deconstructs an array field to output a document per array element.

### 30. Compound Indexes and Multikey Indexes in MongoDB.
**Answer:**
- **Compound Index**: Indexes multiple fields `db.col.createIndex({ status: 1, createdAt: -1 })`. Follows leftmost prefix rule.
- **Multikey Index**: Created automatically when indexing a field holding an array; MongoDB creates an index entry for every element in the array.

### 31. MongoDB Replica Sets vs Sharded Clusters.
**Answer:**
- **Replica Sets (High Availability)**: 1 Primary node and multiple Secondary nodes replicating via the Oplog. Provides automatic failover.
- **Sharded Clusters (Horizontal Scalability)**: Distributes data across multiple shards using a shard key via `mongos` query routers and config servers.

### 32. MongoDB Oplog and Change Streams.
**Answer:**
The Oplog (Operations Log) is a capped collection recording all write operations. **Change Streams** allow applications to listen to real-time database mutations via WebSockets or event brokers without polling.

### 33. MongoDB Transactions and ACID compliance.
**Answer:**
Single-document writes are always atomic. Starting in MongoDB 4.0+, multi-document ACID transactions are supported across replica sets and sharded clusters using two-phase commit.

### 34. MongoDB Write Concerns and Read Concerns.
**Answer:**
- **Write Concern**: Controls write acknowledgment level (`w: 1` acknowledges primary only; `w: "majority"` waits for a majority of replica nodes to commit; `j: true` waits for on-disk journal sync).
- **Read Concern**: Controls read isolation (`local`, `majority`, `linearizable`).

### 35. TTL (Time-To-Live) indexes in MongoDB.
**Answer:**
Special single-field indexes that automatically delete documents after a specified elapsed time:
```javascript
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
```
Ideal for session stores, temporary OTP codes, and ephemeral log retention.

### 36. DynamoDB Partition Keys, Sort Keys, and Hot Partitions.
**Answer:**
- **Partition Key (HASH)**: Determines which physical storage partition data is placed into using internal hash functions.
- **Sort Key (RANGE)**: Orders items within the same partition.
- **Hot Partition**: Occurs when access patterns disproportionately hit a single partition key (e.g., celebrity user ID), exceeding the 1,000 WCU / 3,000 RCU per-partition limit.

### 37. Global Secondary Indexes (GSI) vs Local Secondary Indexes (LSI) in DynamoDB.
**Answer:**
- **LSI**: Shares the partition key of the base table, with an alternative sort key. Must be created at table creation time; limited to 10GB per partition.
- **GSI**: Can define completely new Partition and Sort keys. Can be created anytime; scales independently with its own provisioned throughput.

### 38. Optimistic Locking vs Pessimistic Locking.
**Answer:**
- **Optimistic Locking**: Assumes conflicts are rare. Each record carries a `version` number. Writes execute conditional checks (`WHERE version = 5`). If version changed, write fails and application retries.
- **Pessimistic Locking**: Explicitly locks records (`SELECT ... FOR UPDATE`), preventing any other reader/writer from touching data until transaction commits.

### 39. Eventual Consistency and Read-After-Write Lag.
**Answer:**
In distributed stores, writes replicate asynchronously to secondary nodes. A read immediately following a write may hit a replica that has not caught up.
**Mitigation**: Use Strongly Consistent Reads where critical, or route user reads to the primary node for 5 seconds after a mutation.

### 40. Wide-Column Stores (Cassandra) and Graph Databases (Neo4j).
**Answer:**
- **Wide-Column (Cassandra, ScyllaDB)**: Built for massive write volumes and high availability across multiple datacenters with masterless peer-to-peer ring architectures.
- **Graph Databases (Neo4j)**: Store data as Nodes and Edges with index-free adjacency, allowing constant-time traversal across deep relationships (social graphs, fraud detection).

---

## Part 4: In-Memory Caching & Fast Data Stores (Redis) (41 - 50)

### 41. Why single-threaded Redis achieves 100k+ ops/sec.
**Answer:**
1. **In-Memory Storage**: Operations execute directly against RAM, bypassing disk I/O bottlenecks.
2. **I/O Multiplexing (epoll/kqueue)**: Non-blocking event loop handles thousands of concurrent socket connections efficiently.
3. **No Thread Synchronization Overhead**: Single execution thread eliminates race conditions, lock contention, context switches, and deadlocks.

### 42. Core Redis Data Structures and use cases.
**Answer:**
- **Strings**: Caching API responses, counters (`INCR`), JWT blacklists.
- **Hashes**: Storing structured objects (e.g., User Profile fields).
- **Lists**: Message queues (`LPUSH`, `RPOP`, `BRPOP`).
- **Sets**: Unique tags, mutual followers, IP blacklists (`SADD`, `SINTER`).
- **Sorted Sets (ZSET)**: Real-time leaderboards, sliding window rate limiters (`ZADD`, `ZRANGEBYSCORE`).

### 43. Caching Strategies: Cache-Aside, Write-Through, Write-Behind.
**Answer:**
- **Cache-Aside (Lazy Loading)**: Application queries Redis first. If miss, queries DB, populates Redis, and returns.
- **Write-Through**: Application writes to Cache; Cache synchronously updates Database before returning.
- **Write-Behind (Write-Back)**: Application writes to Cache; Cache asynchronously flushes batched mutations to Database. High performance; risk of data loss on cache crash.

### 44. Cache Stampede, Cache Penetration, and Cache Avalanche.
**Answer:**
- **Cache Stampede (Thundering Herd)**: Hot key expires, causing thousands of concurrent requests to hit the database simultaneously. Fix: Mutex lock on cache miss, or probabilistic early expiration (XFetch).
- **Cache Penetration**: Requests for non-existent keys bypass cache repeatedly. Fix: Cache null values with short TTL, or use a Bloom Filter.
- **Cache Avalanche**: Hundreds of keys expire at the exact same second, overloading DB. Fix: Add random jitter to TTLs (`TTL = base + rand()`).

### 45. Redis Eviction Policies.
**Answer:**
When `maxmemory` is reached:
- `noeviction`: Returns errors on new write commands.
- `allkeys-lru`: Evicts least-recently-used keys across all keys.
- `volatile-lru`: Evicts least-recently-used keys only among those with an expiration TTL set.
- `allkeys-lfu`: Evicts least-frequently-used keys.

### 46. Redis Persistence: RDB vs AOF.
**Answer:**
- **RDB (Snapshots)**: Point-in-time binary snapshots saved to disk at intervals. Compact, fast restarts, but risks losing minutes of data on sudden crash.
- **AOF (Append-Only File)**: Logs every write command sequentially. Highly durable (`fsync everysec`), but generates larger files and slower restarts. Production standard: Combine RDB + AOF.

### 47. Distributed Rate Limiter in Redis (Sliding Window).
**Answer:**
Implemented using Redis **Sorted Set (ZSET)**:
```lua
-- Key: user_id, Score: timestamp, Value: unique_request_id
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local clearBefore = now - window

redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', clearBefore)
local currentRequests = redis.call('ZCARD', KEYS[1])
if currentRequests < limit then
  redis.call('ZADD', KEYS[1], now, ARGV[4])
  return 1 -- Allowed
else
  return 0 -- Throttled
end
```

### 48. Distributed Locks in Redis (Redlock).
**Answer:**
Acquire lock using atomic `SET resource_name my_random_token NX PX 30000`.
Release lock using Lua script verifying `my_random_token` matches before deleting to ensure a client never deletes a lock acquired by another process after a timeout.

### 49. Redis Pub/Sub vs Redis Streams.
**Answer:**
- **Pub/Sub**: Fire-and-forget; messages are not persisted. If a subscriber is offline, messages are permanently lost.
- **Streams**: Append-only persistent log with Consumer Groups, message offsets, acknowledgments (`XACK`), and pending lists.

### 50. When Redis caching is architectural overkill.
**Answer:**
When an application has low traffic (< 50 requests/sec), when database queries are already sub-10ms with proper indexing, or when data changes so frequently that cache invalidation complexity outweighs performance gains.

---

## Part 5: Real-Time Architecture, Replication & Scale (51 - 60)

### 51. Read-Write Splitting (Primary/Replica).
**Answer:**
Direct all write mutations (`INSERT`, `UPDATE`, `DELETE`) to the Primary database node. Asynchronously replicate WAL to Read Replicas, routing read queries to replicas to scale read throughput horizontally.

### 52. Change Data Capture (CDC) (Debezium, Supabase Realtime).
**Answer:**
Taps directly into database transaction logs (PostgreSQL WAL or MySQL binlog) to capture row-level changes and stream them as events to Kafka/RabbitMQ without impacting application transaction performance.

### 53. Database Sharding Strategies.
**Answer:**
- **Hash-Based Sharding**: `shard_id = hash(user_id) % num_shards`. Uniform distribution; difficult to add new shards without consistent hashing.
- **Range-Based Sharding**: Partition by alphabetical or numerical range (A-M, N-Z). Risk of uneven data distribution.
- **Directory-Based Sharding**: Central lookup service maps partition keys to shard locations. Flexible, but adds a lookup network hop.

### 54. Database Failover and Leader Election (Raft / Paxos).
**Answer:**
When heartbeats to the Primary node fail, consensus algorithms (Raft) run leader election among secondary nodes. The replica with the most up-to-date log offset is promoted to new Primary, and routing proxies update DNS / VIP pointers.

### 55. The Outbox Pattern in Microservices.
**Answer:**
Guarantees reliable message publishing: Instead of writing to database and publishing to Kafka in two separate operations (which risks partial failure), the event is written to an `outbox` table in the **same atomic database transaction**. A background worker or CDC process tails the outbox table and dispatches messages to the broker.

### 56. Full-Text Search: Elasticsearch vs SQL LIKE vs PostgreSQL tsvector.
**Answer:**
- `LIKE '%term%'`: Requires full table scan; cannot leverage B-Trees.
- `tsvector` + `GIN Index`: Excellent built-in PostgreSQL inverted index for text stemming, ranking, and search without separate infrastructure.
- **Elasticsearch**: Dedicated distributed Lucene search cluster; handles tokenization, fuzzy matching, synonyms, and multi-node sharding at terabyte scale.

### 57. Time-Series Databases (TimescaleDB, InfluxDB).
**Answer:**
Standard relational tables suffer index fragmentation and slow writes as table sizes exceed RAM. Time-series databases organize data into time-partitioned chunks ("hypertables"), optimizing sequential write throughput and compressing historical data.

### 58. Connection Starvation & Circuit Breakers.
**Answer:**
During traffic surges, pending queries hold connection pool slots. If downstreams slow down, the pool starves, crashing the service.
**Mitigation**: Implement **Circuit Breakers** (e.g., Resilience4j) that trip to open state when failure rates exceed thresholds, failing fast without hitting the database.

### 59. Vector Databases (pgvector, Pinecone, Milvus) & HNSW.
**Answer:**
Indexes high-dimensional vector embeddings generated by AI models.
- **HNSW (Hierarchical Navigable Small World)**: Multi-layer graph structure providing sub-millisecond Approximate Nearest Neighbor (ANN) search across millions of vectors.

### 60. Disaster Recovery: RPO vs RTO.
**Answer:**
- **RPO (Recovery Point Objective)**: Maximum acceptable data loss duration (e.g., losing at most 5 minutes of data). Satisfied via frequent WAL archiving and continuous replication.
- **RTO (Recovery Time Objective)**: Maximum acceptable downtime duration to restore service (e.g., restoring database within 15 minutes). Satisfied via automated multi-AZ failover.

