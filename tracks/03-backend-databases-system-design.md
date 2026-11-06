# Full-Stack & Backend Database Master Interview Question Bank: SQL, NoSQL, Redis & System Design (1 - 60)

> Simple, intuitive, and easy-to-explain technical interview questions and deep-dive answers covering Relational Databases (PostgreSQL, MySQL, ACID, Indexing, B-Trees, Joins, MVCC), NoSQL Stores (MongoDB, DynamoDB), In-Memory Caching (Redis), and Real-Time Scalability Architecture with clear SQL, Redis, and schema code examples.

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

```sql
-- Example production setup in PostgreSQL:
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2. How do you handle schema migrations without downtime?
**In Simple Words:**
Use the **Expand/Contract Pattern**:
1. **Expand**: Add new columns as nullable, and create new indexes concurrently (`CREATE INDEX CONCURRENTLY` in Postgres to avoid table locks).
2. **Dual-Writing**: Update backend code to write to both old and new schema fields.
3. **Backfill**: Run background scripts to backfill legacy rows.
4. **Contract**: Switch reads to new columns, remove writes to old columns, and safely drop deprecated columns.

```sql
-- Step 1 (Zero-downtime column addition & concurrent index):
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) DEFAULT NULL;
CREATE INDEX CONCURRENTLY idx_users_phone ON users(phone_number);

-- Step 2: Code writes to both 'phone' and 'phone_number'
-- Step 3: Backfill legacy rows in small batches:
UPDATE users SET phone_number = phone WHERE phone_number IS NULL AND id IN (SELECT id FROM users LIMIT 1000);

-- Step 4: Drop old column safely:
ALTER TABLE users DROP COLUMN phone;
```

### 3. Describe a severe database performance issue you resolved.
**How to Explain in an Interview:**
- **Problem**: Primary PostgreSQL CPU hit 100% and connection pool exhaustion caused 504 errors.
- **Root Cause**: Running `EXPLAIN ANALYZE` revealed a sequential scan across 15M rows due to a missing composite index on a foreign key join.
- **Fix**: Created the composite index concurrently on `(user_id, created_at DESC)`, added **PgBouncer** in transaction pooling mode to reuse connections, and cached hot catalog reads in Redis.

```sql
-- Root Cause Diagnosis:
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM orders WHERE user_id = 'c8b21...' ORDER BY created_at DESC LIMIT 10;
-- Output showed: Seq Scan on orders (cost=0.00..385200.12 rows=15200000)

-- Resolution:
CREATE INDEX CONCURRENTLY idx_orders_user_created ON orders (user_id, created_at DESC);
-- New plan: Index Scan using idx_orders_user_created (cost=0.43..8.45 rows=10)
```

### 4. Relational normalized schema vs flexible document collections:
**In Simple Words:**
- Choose **Relational (3NF)** when data has complex many-to-many relationships and transactions need atomicity across multiple tables.
- Choose **Document (MongoDB)** when data is accessed together as a single aggregate (e.g. an Order containing its Items and Shipping Address).

```json
// Document Model (MongoDB - single read aggregate):
{
  "_id": "order_123",
  "userId": "user_456",
  "items": [
    { "productId": "prod_1", "qty": 2, "price": 29.99 },
    { "productId": "prod_2", "qty": 1, "price": 49.99 }
  ],
  "shippingAddress": { "city": "Seattle", "zip": "98101" }
}
```

### 5. Strategy for database security and connection pooling:
**In Simple Words:**
- **Networking**: Databases live in private VPC subnets with zero public internet access; SSL enforced.
- **Pooling**: Use proxy poolers like PgBouncer to prevent thousands of client connections from exhausting database memory.
- **Credentials**: Passwords hashed with `bcrypt`/`argon2`; sensitive PII encrypted at rest.

```ini
; PgBouncer pool configuration snippet (pgbouncer.ini):
[databases]
mydb = host=127.0.0.1 port=5432 dbname=production

[pgbouncer]
listen_port = 6432
pool_mode = transaction
max_client_conn = 5000
default_pool_size = 50
reserve_pool_size = 10
```

---

## Part 2: Relational Databases (RDBMS / PostgreSQL / MySQL) (6 - 25)

### 6. What are the ACID properties in relational databases?
**In Simple Words:**
ACID guarantees that database transactions are executed reliably:
- **A - Atomicity ("All or Nothing")**: If one step of a transfer fails, the entire transaction rolls back.
- **C - Consistency**: Data must always obey schema constraints (Foreign Keys, Unique checks).
- **I - Isolation**: Concurrent transactions don't interfere with each other.
- **D - Durability**: Once committed, data is written to disk (WAL) and won't be lost even on power failure.

```sql
-- Atomicity demonstration: If balance check fails, ROLLBACK occurs
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1 AND balance >= 100;
-- If 0 rows updated, abort transaction:
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

### 7. Normalization (1NF to BCNF) vs Denormalization:
**In Simple Words:**
- **Normalization**: Eliminates duplicate data and update anomalies by splitting data into related tables (1NF = atomic values, 2NF = full key dependency, 3NF = no transitive dependencies).
- **Denormalization**: Intentionally duplicating data (e.g. storing `user_name` in `orders`) to avoid expensive SQL `JOIN` operations on high-throughput read systems.

```sql
-- Normalized: Requires JOIN between orders and users:
SELECT o.id, u.name, o.total FROM orders o JOIN users u ON o.user_id = u.id;

-- Denormalized: Order table already stores user_name for instant O(1) row read:
SELECT id, user_name, total FROM orders WHERE id = 101;
```

### 8. Primary Key vs Unique Key vs Foreign Key:
**In Simple Words:**
- **Primary Key**: Uniquely identifies each row; strictly unique and cannot be `NULL` (one per table).
- **Unique Key**: Enforces unique values; allows `NULL` values.
- **Foreign Key**: Links a column to the Primary Key of another table to maintain referential integrity.

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,                        -- Primary Key (NOT NULL & UNIQUE)
  order_number VARCHAR(50) UNIQUE NOT NULL,      -- Unique Key
  user_id INT REFERENCES users(id) ON DELETE CASCADE -- Foreign Key
);
```

### 9. SQL Transaction Isolation Levels:
**In Simple Words:**
Controls how visible uncommitted changes from other transactions are:
1. **Read Uncommitted**: Lowest isolation; allows dirty reads.
2. **Read Committed** (Default in Postgres): Reads only committed rows.
3. **Repeatable Read** (Default in MySQL InnoDB): Guarantees the same row read twice inside a transaction returns identical data.
4. **Serializable**: Highest isolation; transactions execute as if run strictly one after another.

```sql
-- Setting isolation level for a sensitive financial transaction:
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT balance FROM accounts WHERE id = 42;
UPDATE accounts SET balance = balance - 500 WHERE id = 42;
COMMIT;
```

### 10. Dirty Reads vs Non-Repeatable Reads vs Phantom Reads:
**In Simple Words:**
- **Dirty Read**: Reading uncommitted data written by another transaction that later rolls back.
- **Non-Repeatable Read**: Re-reading a row and finding its values updated by another committed transaction.
- **Phantom Read**: Re-running a range query (`WHERE age > 30`) and finding new rows inserted by another committed transaction.

```sql
-- Non-Repeatable Read Example:
-- Tx 1:
BEGIN;
SELECT salary FROM employees WHERE id = 5; -- Returns 50,000
-- Tx 2 commits: UPDATE employees SET salary = 60,000 WHERE id = 5; COMMIT;
-- Tx 1 re-reads:
SELECT salary FROM employees WHERE id = 5; -- In Read Committed, returns 60,000!
```

### 11. How do B-Tree indexes work internally?
**In Simple Words:**
B-Trees are self-balancing search trees with shallow depth and high branching fanout. Keys are kept sorted, allowing $O(\log N)$ search, insert, and delete operations. In B+Trees, all data pointers live in linked leaf nodes, making range queries (`BETWEEN`, `>`, `<`) exceptionally fast.

```sql
-- Default index type in PostgreSQL is B-Tree:
CREATE INDEX idx_products_price ON products USING btree (price);

-- B-Tree efficiently handles equality and range queries:
SELECT * FROM products WHERE price BETWEEN 20.00 AND 50.00;
```

### 12. Clustered Index vs Non-Clustered Index:
**In Simple Words:**
- **Clustered Index**: Determines the physical on-disk storage order of table rows (only 1 per table, usually Primary Key). Leaf nodes contain the full row data.
- **Non-Clustered Index**: A separate index structure whose leaf nodes contain the index key and a pointer back to the actual table row.

```sql
-- In PostgreSQL, you can physically cluster a table using an existing index:
CLUSTER orders USING idx_orders_user_created;
```

### 13. Composite Index and the "Leftmost Prefix Rule":
**In Simple Words:**
An index on `(A, B, C)` only accelerates queries that filter on the leftmost column `A`:
- `WHERE A = 1 AND B = 2` -> Uses index.
- `WHERE B = 2 AND C = 3` -> **Cannot** use index because leading column `A` is omitted.

```sql
CREATE INDEX idx_users_country_city_status ON users (country, city, status);

-- Uses index (country is leading column):
SELECT * FROM users WHERE country = 'US' AND city = 'Austin';

-- CANNOT use index effectively (leading column missing):
SELECT * FROM users WHERE city = 'Austin';
```

### 14. EXPLAIN vs EXPLAIN ANALYZE:
**In Simple Words:**
- `EXPLAIN`: Shows the optimizer's estimated execution plan without running the query.
- `EXPLAIN ANALYZE`: Actually executes the query, reporting real execution times, buffer hits, and scan types (Sequential Scan vs Index Scan).

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT u.name, count(o.id) 
FROM users u 
JOIN orders o ON u.id = o.user_id 
WHERE u.created_at >= '2025-01-01' 
GROUP BY u.name;
```

### 15. SQL Joins comparison:
**In Simple Words:**
- **INNER JOIN**: Returns rows only when keys match in both tables.
- **LEFT JOIN**: Returns all left rows plus matched right rows (`NULL` if no match).
- **CROSS JOIN**: Cartesian product ($M \times N$ rows; dangerous on large tables).

```sql
-- LEFT JOIN: Find all users, including those who have never placed an order:
SELECT u.id, u.name, o.id AS order_id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL; -- Users with zero orders
```

### 16. Join Execution Algorithms (Nested Loop, Hash Join, Merge Join):
**In Simple Words:**
- **Nested Loop**: For each row in outer table, scans inner table (great when inner table has an index).
- **Hash Join**: Builds an in-memory hash table of smaller table, then scans larger table probing the hash table (best for large unindexed joins).
- **Merge Join**: Both datasets must be pre-sorted on join keys; scans both in lockstep.

```sql
-- Force query planner to use Hash Join for testing:
SET enable_nestloop = off;
SET enable_mergejoin = off;
EXPLAIN SELECT * FROM large_table_a a JOIN large_table_b b ON a.key = b.key;
-- Plan displays: Hash Join (Hash Cond: (a.key = b.key))
```

### 17. PostgreSQL JSONB and GIN Indexes:
**In Simple Words:**
`JSONB` stores JSON in a decomposed binary format rather than plain text. A **GIN (Generalized Inverted Index)** indexes internal keys and values, allowing fast $O(1)$ search queries inside JSON payloads.

```sql
CREATE TABLE events (id SERIAL PRIMARY KEY, payload JSONB);
CREATE INDEX idx_events_payload ON events USING gin (payload);

-- Fast GIN index lookup using the containment operator (@>):
SELECT * FROM events WHERE payload @> '{"status": "completed", "priority": "high"}';
```

### 18. Database Connection Pooling (PgBouncer):
**In Simple Words:**
Opening database TCP connections is expensive. Connection poolers keep a warm pool of reusable connections, allowing 5,000 app clients to safely share 50 database connections.

```sql
-- Monitor active vs idle connections in PostgreSQL:
SELECT state, count(*) 
FROM pg_stat_activity 
GROUP BY state;
```

### 19. Deadlocks in SQL transactions:
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

### 20. Table Partitioning vs Sharding:
**In Simple Words:**
- **Table Partitioning**: Splitting a huge table into smaller physical child tables on the **same database server**.
- **Database Sharding**: Distributing data horizontally across **multiple independent physical database servers**.

```sql
-- Declarative Range Partitioning by Year in PostgreSQL:
CREATE TABLE logs (
  id BIGSERIAL,
  log_time TIMESTAMPTZ NOT NULL,
  message TEXT
) PARTITION BY RANGE (log_time);

CREATE TABLE logs_2025 PARTITION OF logs 
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### 21. Stored Procedures, Triggers, and Views:
**In Simple Words:**
- **Stored Procedures**: Compiled business logic executing inside the database.
- **Triggers**: Code executing automatically before/after an insert or update.
- **Materialized Views**: Queries whose results are saved on disk for fast analytical reporting.

```sql
-- Materialized View for fast analytics:
CREATE MATERIALIZED VIEW mv_daily_sales AS
SELECT date_trunc('day', created_at) AS day, sum(amount) AS total_revenue
FROM orders
GROUP BY 1;

-- Refresh periodically in background:
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;
```

### 22. Soft Deletes and Partial Indexes:
**In Simple Words:**
Setting `deleted_at = NOW()` instead of deleting rows causes index bloat.
**Fix**: Create a **Partial Index** that indexes only active non-deleted rows!

```sql
-- Partial index: only indexes active records (small, fast, ignores deleted rows):
CREATE UNIQUE INDEX uq_active_user_email ON users (email) 
WHERE deleted_at IS NULL;
```

### 23. Write-Ahead Logging (WAL) and PITR:
**In Simple Words:**
Before any change touches data files on disk, it is written to the append-only WAL.
**Point-In-Time Recovery (PITR)**: Allows replaying base backups plus archived WAL logs to restore a database to the exact second prior to an accidental `DROP TABLE`.

```bash
# PostgreSQL PITR recovery configuration (postgresql.conf / recovery.signal):
restore_command = 'cp /mnt/wal_archive/%f %p'
recovery_target_time = '2026-11-06 14:32:00 UTC'
```

### 24. MVCC and VACUUM in PostgreSQL:
**In Simple Words:**
In Postgres, updating a row writes a new row version rather than overwriting old bytes. Old versions become "dead tuples". `VACUUM` reclaims disk space occupied by dead tuples.

```sql
-- Check dead tuple count on a table:
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum 
FROM pg_stat_user_tables 
WHERE relname = 'orders';

-- Manually vacuum and analyze table:
VACUUM ANALYZE orders;
```

### 25. The N+1 Query Problem in ORMs:
**In Simple Words:**
Fetching 100 users, and then executing 100 individual queries inside a loop to fetch each user's profile ($1 + 100 = 101$ queries).
**Fix**: Use Eager Loading to fetch all profiles in a single query using `IN (...)`.

```sql
-- The BAD N+1 pattern:
-- Query 1: SELECT * FROM users LIMIT 100;
-- Followed by 100 queries: SELECT * FROM profiles WHERE user_id = ?;

-- The EAGER LOADING fix (2 queries total):
-- Query 1: SELECT * FROM users LIMIT 100;
-- Query 2: SELECT * FROM profiles WHERE user_id IN (1, 2, 3, ... 100);
```

---

## Part 3: NoSQL & Document Databases (MongoDB, DynamoDB) (26 - 40)

### 26. CAP Theorem:
**In Simple Words:**
A distributed system can guarantee at most two of three:
- **Consistency**: Every read gets latest write.
- **Availability**: Every request gets a non-error response.
- **Partition Tolerance**: System keeps running despite network splits.
- RDBMS focuses on **CA** or **CP**; NoSQL typically focuses on **CP** (MongoDB) or **AP** (Cassandra, DynamoDB).

```typescript
// Demonstrating Eventual Consistency (AP) handling in client code:
// Retry read with backoff if recent write is not yet visible on replica:
async function getWithRetry(id: string, attempts = 3): Promise<Document | null> {
  for (let i = 0; i < attempts; i++) {
    const doc = await db.collection('orders').findOne({ _id: id });
    if (doc) return doc;
    await new Promise(r => setTimeout(r, 100 * (i + 1))); // Backoff
  }
  return null;
}
```

### 27. When to choose MongoDB over PostgreSQL:
**In Simple Words:**
When schemas vary wildly between records, when data is deeply nested and accessed together, and when horizontal sharding out of the box is required.

```javascript
// MongoDB polymorphic schema example (different attributes per item):
db.products.insertMany([
  { name: "Laptop", type: "electronics", cpu: "M3", ram: "16GB" },
  { name: "T-Shirt", type: "clothing", size: "L", material: "Cotton" }
]);
```

### 28. MongoDB: Embedding vs Referencing:
**In Simple Words:**
- **Embed**: For 1-to-few relationships where child data is always retrieved with parent (Order Items in an Order).
- **Reference**: For 1-to-many or many-to-many relationships where data updates frequently or approaches 16MB document size limit.

```javascript
// 1. Embedding (Atomic single document update):
db.orders.updateOne(
  { _id: "ord_1" },
  { $push: { items: { name: "Keyboard", price: 79 } } }
);

// 2. Referencing (Separate collections):
db.orders.aggregate([
  { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } }
]);
```

### 29. MongoDB Aggregation Pipeline:
**In Simple Words:**
A series of data transformation stages: `$match` (filters) -> `$group` (aggregates) -> `$project` (reshapes) -> `$sort`.

```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$userId", totalSpent: { $sum: "$amount" }, orderCount: { $sum: 1 } } },
  { $match: { totalSpent: { $gte: 500 } } },
  { $sort: { totalSpent: -1 } }
]);
```

### 30. MongoDB Compound & Multikey Indexes:
**In Simple Words:**
- **Compound Index**: Indexes multiple fields; follows leftmost prefix rule.
- **Multikey Index**: Indexes an array field by creating an index entry for every element in the array.

```javascript
// Compound index on status and createdAt:
db.orders.createIndex({ status: 1, createdAt: -1 });

// Multikey index on array field 'tags':
db.articles.createIndex({ tags: 1 });
db.articles.find({ tags: "tech" }); // Fast indexed array search!
```

### 31. Replica Sets vs Sharded Clusters in MongoDB:
**In Simple Words:**
- **Replica Sets**: High availability (1 Primary + multiple Secondaries with automated failover).
- **Sharded Clusters**: Horizontal scaling by distributing data across shards via a shard key.

```javascript
// Enable sharding on collection using a hashed shard key:
sh.enableSharding("production");
sh.shardCollection("production.users", { "_id": "hashed" });
```

### 32. MongoDB Oplog & Change Streams:
**In Simple Words:**
The Oplog records all write operations. **Change Streams** allow apps to listen to real-time database changes without polling.

```javascript
const changeStream = db.collection('orders').watch();
changeStream.on('change', next => {
  console.log('Realtime DB mutation:', next.operationType, next.fullDocument);
});
```

### 33. MongoDB Transactions:
**In Simple Words:**
Single-document writes are always atomic. Starting in MongoDB 4.0+, multi-document ACID transactions are fully supported across replica sets and shards.

```javascript
const session = client.startSession();
session.startTransaction();
try {
  await orders.insertOne({ orderId: 101, amount: 250 }, { session });
  await accounts.updateOne({ id: 1 }, { $inc: { balance: -250 } }, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
} finally {
  session.endSession();
}
```

### 34. Write Concerns & Read Concerns:
**In Simple Words:**
- **Write Concern (`w: "majority"`)**: Waits for a majority of replica nodes to commit before acknowledging.
- **Read Concern (`"majority"`)**: Reads only data committed by a majority of nodes to avoid dirty reads.

```javascript
await db.collection('payments').insertOne(
  { transactionId: "txn_789", amount: 1000 },
  { writeConcern: { w: "majority", wtimeout: 5000 } }
);
```

### 35. TTL (Time-To-Live) Indexes:
**In Simple Words:**
Automatically deletes documents after a specified duration. Ideal for sessions, caching, and OTP verification codes.

```javascript
// Automatically delete session documents 1 hour (3600s) after createdAt:
db.sessions.createIndex(
  { "createdAt": 1 }, 
  { expireAfterSeconds: 3600 }
);
```

### 36. DynamoDB Partition Keys, Sort Keys & Hot Partitions:
**In Simple Words:**
- **Partition Key (HASH)**: Determines which physical storage partition data goes to.
- **Sort Key (RANGE)**: Orders items within the partition.
- **Hot Partition**: Occurs when access heavily hits a single key, exceeding per-partition limits (1,000 WCU or 3,000 RCU).

```typescript
// AWS SDK v3 DynamoDB Query using Partition Key (PK) and Sort Key (SK):
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const command = new QueryCommand({
  TableName: "AppTable",
  KeyConditionExpression: "PK = :pk AND SK begins_with(:skPrefix)",
  ExpressionAttributeValues: {
    ":pk": { S: "USER#101" },
    ":skPrefix": { S: "ORDER#" }
  }
});
```

### 37. DynamoDB GSI vs LSI:
**In Simple Words:**
- **LSI**: Shares table's Partition Key with a different Sort Key; max 10GB per partition; must be created at table creation.
- **GSI**: Can define completely new Partition and Sort keys; scales throughput independently; can be created anytime.

```json
// Global Secondary Index (GSI) schema definition:
{
  "IndexName": "StatusIndex",
  "KeySchema": [
    { "AttributeName": "status", "KeyType": "HASH" },
    { "AttributeName": "created_at", "KeyType": "RANGE" }
  ],
  "Projection": { "ProjectionType": "ALL" }
}
```

### 38. Optimistic vs Pessimistic Locking:
**In Simple Words:**
- **Optimistic Locking**: Records carry a `version` field. Updates check `WHERE version = 5`; if changed, update fails and retries.
- **Pessimistic Locking**: Locks records explicitly (`SELECT ... FOR UPDATE`), preventing anyone else from reading/writing until committed.

```sql
-- Optimistic Locking:
UPDATE products 
SET stock = stock - 1, version = version + 1 
WHERE id = 42 AND version = 5;
-- If 0 rows updated, another user modified the stock; retry!

-- Pessimistic Locking:
BEGIN;
SELECT * FROM products WHERE id = 42 FOR UPDATE;
UPDATE products SET stock = stock - 1 WHERE id = 42;
COMMIT;
```

### 39. Eventual Consistency:
**In Simple Words:**
In distributed stores, writes replicate asynchronously to secondary nodes. A read immediately after a write might briefly return stale data. Fix: Use Strongly Consistent Reads where critical.

```typescript
// DynamoDB: Requesting strongly consistent read (costs 2x standard read):
const command = new GetItemCommand({
  TableName: "Balances",
  Key: { userId: { S: "user_99" } },
  ConsistentRead: true // Forces read from primary storage node
});
```

### 40. Wide-Column (Cassandra) vs Graph (Neo4j):
**In Simple Words:**
- **Cassandra**: High-write distributed storage across multiple datacenters.
- **Neo4j**: Graph database storing nodes and edges; constant-time traversal across deep relationships (social networks, fraud detection).

```cypher
// Neo4j Cypher query: Find friends of friends who like 'Node.js':
MATCH (u:User {name: 'Alice'})-[:FRIEND]->(f:User)-[:FRIEND]->(fof:User)
WHERE (fof)-[:LIKES]->(:Skill {name: 'Node.js'})
RETURN DISTINCT fof.name;
```

---

## Part 4: In-Memory Caching & Fast Data Stores (Redis) (41 - 50)

### 41. Why single-threaded Redis handles 100k+ ops/sec:
**In Simple Words:**
1. **In-Memory**: Operations run in RAM, bypassing slow disk I/O.
2. **Single-Threaded**: Zero lock contention, zero thread context-switching, and no race conditions.
3. **I/O Multiplexing (`epoll`)**: Non-blocking event loop handles thousands of connections on a single thread.

```bash
# Benchmark Redis throughput locally:
redis-benchmark -q -n 100000 -c 50 -P 16
# Output: PING_INLINE: 220,000 requests per second
#         SET: 185,000 requests per second
```

### 42. Core Redis Data Structures:
**In Simple Words:**
- **Strings**: Caching API responses, counters (`INCR`).
- **Hashes**: Storing user objects (`HSET`).
- **Lists**: Queues (`LPUSH`, `RPOP`).
- **Sets**: Unique tags, mutual friends (`SADD`, `SINTER`).
- **Sorted Sets (ZSET)**: Leaderboards, sliding window rate limiters (`ZADD`).

```bash
# Examples in redis-cli:
SET user:token:123 "session_payload" EX 3600
HSET user:profile:101 name "Alice" role "Admin"
LPUSH task_queue "job_id_55"
SADD active_users "user_1" "user_2"
ZADD leaderboard 1500 "PlayerA" 2300 "PlayerB"
```

### 43. Caching Strategies:
**In Simple Words:**
- **Cache-Aside (Lazy Loading)**: App checks cache; if miss, queries DB, populates cache, and returns.
- **Write-Through**: App writes to cache; cache synchronously writes to DB.
- **Write-Behind**: App writes to cache; cache asynchronously flushes batch writes to DB.

```typescript
// Cache-Aside implementation:
async function getUser(id: string): Promise<User> {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(id);
  if (user) await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 3600);
  return user;
}
```

### 44. Cache Stampede vs Penetration vs Avalanche:
**In Simple Words:**
- **Stampede (Thundering Herd)**: Hot key expires; thousands hit DB at once. Fix: Mutex lock on miss.
- **Penetration**: Requests for non-existent keys bypass cache. Fix: Cache null values or use Bloom Filter.
- **Avalanche**: Hundreds of keys expire at the same second. Fix: Add random jitter to TTLs.

```typescript
// Preventing Cache Avalanche with TTL Jitter:
const baseTTL = 3600; // 1 hour
const jitter = Math.floor(Math.random() * 300); // 0-5 mins
await redis.set(key, value, 'EX', baseTTL + jitter);
```

### 45. Redis Eviction Policies:
**In Simple Words:**
`allkeys-lru` (evicts least-recently-used), `volatile-lru` (evicts LRU among keys with TTL), `allkeys-lfu` (evicts least-frequently-used).

```ini
# redis.conf memory limit & eviction policy:
maxmemory 4gb
maxmemory-policy allkeys-lru
```

### 46. Redis Persistence: RDB vs AOF:
**In Simple Words:**
- **RDB**: Point-in-time binary snapshots. Fast restarts, but risks losing recent minutes of data.
- **AOF**: Append-only log of every write command. High durability, but larger file size. Production standard: Combine both.

```ini
# Production persistence settings in redis.conf:
save 900 1            ; Snapshot if 1 key changed in 15 mins
appendonly yes        ; Enable AOF
appendfsync everysec  ; Flush WAL log to disk every 1 second
```

### 47. Redis Sliding Window Rate Limiter:
**In Simple Words:**
Uses a Sorted Set (ZSET) where score is the current timestamp: `ZREMRANGEBYSCORE` clears expired timestamps; `ZCARD` counts active requests in the window.

```javascript
async function rateLimit(userId, limit = 100, windowSec = 60) {
  const now = Date.now();
  const clearBefore = now - (windowSec * 1000);
  const key = `rate:${userId}`;

  const multi = redis.multi();
  multi.zremrangebyscore(key, 0, clearBefore); // Remove old requests
  multi.zadd(key, now, `${now}-${Math.random()}`); // Add current request
  multi.zcard(key); // Count requests in window
  multi.expire(key, windowSec);

  const results = await multi.exec();
  const currentCount = results[2][1];
  return currentCount <= limit;
}
```

### 48. Distributed Locks in Redis (Redlock):
**In Simple Words:**
Acquire lock with atomic `SET key random_token NX PX 30000`. Release using a Lua script verifying `random_token` matches before deleting to avoid unlocking someone else's expired lock.

```lua
-- Safe Lua unlock script:
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
```

### 49. Redis Pub/Sub vs Redis Streams:
**In Simple Words:**
- **Pub/Sub**: Fire-and-forget; messages are not saved.
- **Streams**: Persistent message log with Consumer Groups and acknowledgments (`XACK`).

```bash
# Redis Streams example:
XADD mystream * sensor_id 101 temperature 24.5
XREADGROUP GROUP mygroup consumer1 COUNT 10 STREAMS mystream >
XACK mystream mygroup "1730000000000-0"
```

### 50. When Redis caching is architectural overkill:
**In Simple Words:**
When an app has low traffic (< 50 req/sec), queries are already sub-10ms with proper indexing, or data changes so fast that cache invalidation overhead outweighs gains.

```sql
-- Often a fast PostgreSQL index is faster & simpler than caching in Redis:
-- Average query time: 0.8ms without maintaining Redis cache invalidation logic!
SELECT * FROM products WHERE sku = 'SKU-8821';
```

---

## Part 5: Real-Time Architecture, Replication & Scale (51 - 60)

### 51. Read-Write Splitting (Primary/Replica):
**In Simple Words:**
All writes (`INSERT`, `UPDATE`) go to Primary. Replicas replicate asynchronously and serve read queries (`SELECT`) to scale read capacity horizontally.

```typescript
// Prisma / TypeORM datasource routing configuration:
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_PRIMARY_URL, // Writes
    },
  },
});
// Queries wrapped with read replica client:
const readClient = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_REPLICA_URL } }
});
```

### 52. Change Data Capture (CDC):
**In Simple Words:**
Taps into database transaction logs (WAL/binlog) using tools like **Debezium** to stream row changes to Kafka without impacting application transaction performance.

```json
// Debezium CDC event payload streamed to Kafka:
{
  "before": { "id": 1, "status": "pending" },
  "after":  { "id": 1, "status": "completed" },
  "op": "u", // Update operation
  "source": { "table": "orders", "ts_ms": 1730900000 }
}
```

### 53. Database Sharding:
**In Simple Words:**
Distributing data horizontally across multiple database servers by Hashing, Ranges, or Directory lookup.

```typescript
// Hash-based shard routing function:
function getDatabaseShard(userId: string, totalShards = 4): string {
  const hash = crypto.createHash('md5').update(userId).digest('hex');
  const shardIndex = parseInt(hash.slice(0, 4), 16) % totalShards;
  return `postgres://shard-${shardIndex}.internal:5432/app_db`;
}
```

### 54. Database Failover & Leader Election (Raft):
**In Simple Words:**
When Primary fails heartbeats, replicas run Raft leader election. The replica with the latest log offset is promoted to new Primary.

```bash
# PostgreSQL failover trigger using pg_ctl or patroni:
patroni topology cluster_name
# Output:
# + Cluster: app-db +---------+
# | Member   | Host    | Role   | State   | TL | Lag in MB |
# +----------+---------+--------+---------+----+-----------+
# | pg-node1 | 10.0.1  | Leader | running |  2 |           |
# | pg-node2 | 10.0.2  | Sync   | running |  2 |         0 |
```

### 55. The Transactional Outbox Pattern:
**In Simple Words:**
Instead of writing to the database and sending an event to Kafka in two separate operations (which risks partial failure), write the event into an `outbox` table in the **same atomic database transaction**. A background worker or CDC process tails the table and publishes to Kafka.

```sql
BEGIN;
-- 1. Mutate business state:
INSERT INTO orders (id, user_id, amount) VALUES ('ord_55', 'user_1', 199.99);

-- 2. Insert event in the SAME transaction:
INSERT INTO outbox_events (aggregate_type, aggregate_id, event_type, payload)
VALUES ('ORDER', 'ord_55', 'ORDER_CREATED', '{"amount": 199.99}');
COMMIT;
```

### 56. Full-Text Search: Elasticsearch vs SQL LIKE vs tsvector:
**In Simple Words:**
`LIKE '%pattern%'` requires slow full-table scans. PostgreSQL `tsvector` with GIN index provides fast text search built-in. Elasticsearch is a dedicated distributed cluster for fuzzy matching and spell checking at scale.

```sql
-- PostgreSQL built-in full-text search:
ALTER TABLE articles ADD COLUMN tsv tsvector 
  GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;

CREATE INDEX idx_articles_tsv ON articles USING gin (tsv);

-- Sub-millisecond search:
SELECT title FROM articles WHERE tsv @@ to_tsquery('english', 'distributed & database');
```

### 57. Time-Series Databases (TimescaleDB, InfluxDB):
**In Simple Words:**
Organize data into time-partitioned chunks ("hypertables"), optimizing high-volume sequential writes and compressing historical metrics.

```sql
-- TimescaleDB Hypertable creation:
CREATE TABLE sensor_data (
  time TIMESTAMPTZ NOT NULL,
  sensor_id INT,
  temperature DOUBLE PRECISION
);
SELECT create_hypertable('sensor_data', 'time');
```

### 58. Connection Starvation & Circuit Breakers:
**In Simple Words:**
If the database slows down, waiting requests hold connection pool slots until the pool starves. A **Circuit Breaker** detects failures and trips open, failing fast without overwhelming the database.

```typescript
// Circuit breaker state check before DB query:
async function executeWithCircuitBreaker(queryFn: () => Promise<any>) {
  if (circuitBreaker.isOpen()) {
    throw new Error('503 Service Unavailable: Database Circuit Breaker Open');
  }
  try {
    return await queryFn();
  } catch (err) {
    circuitBreaker.recordFailure();
    throw err;
  }
}
```

### 59. Vector Databases (pgvector, Pinecone) & HNSW:
**In Simple Words:**
Indexes high-dimensional AI embeddings. **HNSW (Hierarchical Navigable Small World)** provides sub-millisecond Approximate Nearest Neighbor (ANN) search across millions of vectors.

```sql
-- PostgreSQL pgvector setup:
CREATE EXTENSION vector;
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding vector(1536) -- OpenAI embedding size
);

CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

-- Similarity query using cosine distance (<=>):
SELECT content, 1 - (embedding <=> '[0.012, -0.045, ...]') AS similarity
FROM documents
ORDER BY embedding <=> '[0.012, -0.045, ...]'
LIMIT 5;
```

### 60. RPO vs RTO Disaster Recovery:
**In Simple Words:**
- **RPO (Recovery Point Objective)**: Maximum acceptable data loss duration (e.g. at most 5 mins of data).
- **RTO (Recovery Time Objective)**: Maximum acceptable downtime duration to restore service (e.g. restore within 15 mins).

```sql
-- Verifying replication lag for RPO in PostgreSQL:
SELECT client_addr, application_name,
  pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS replication_lag_bytes
FROM pg_stat_replication;
```
