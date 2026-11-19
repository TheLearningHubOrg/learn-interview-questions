# Redis & High-Performance Caching Master Interview Bank (1 - 35)

> Redis single-threaded event loop (epoll), data structures (Strings, Hashes, Lists, Sets, Sorted Sets, Streams), caching strategies (Cache-Aside, Write-Through), eviction policies (LRU, LFU), persistence (RDB, AOF), Transactions vs Lua scripting, Sentinel high availability, Cluster hash slots, and distributed locking (Redlock).

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is Redis and why is it so fast?
**In Simple Words:**
Redis (Remote Dictionary Server) is an open-source, in-memory key-value data structure store used as a database, cache, message broker, and streaming engine:
- **In-Memory Storage**: All primary data resides in RAM. Reading and writing memory is hundreds of times faster than disk I/O (sub-millisecond latency, typically < 1ms).
- **Single-Threaded Event Loop**: Uses non-blocking I/O multiplexing (`epoll`/`kqueue`). Eliminates CPU context switching and lock contention overhead.
- **Custom Optimized C Data Structures**: Highly tuned memory representations (e.g. SDS strings, ziplists, skiplists).

### 2. What are the core Redis Data Structures and their primary use cases?
**In Simple Words:**
1. **String**: Basic text or binary blob up to 512 MB (caching JSON, session tokens, atomic integer counters with `INCR`).
2. **Hash**: Key-value map representing an object (e.g. user profile attributes: `name`, `email`, `age`).
3. **List**: Linked list of strings ordered by insertion (job queues, activity feeds with `LPUSH`/`RPOP`).
4. **Set**: Unordered collection of unique strings (tagging, unique visitor tracking with `SADD`, `SINTER`).
5. **Sorted Set (ZSET)**: Unique elements ordered by a floating-point score (real-time leaderboards, rate limiters with `ZADD`, `ZRANGEBYSCORE`).
6. **Bitmap & HyperLogLog**: Bit-level operations (daily active users) and probabilistic cardinality estimation with < 1% error using 12 KB of memory.
7. **Streams**: Append-only log with consumer groups (event-driven messaging).

```text
Redis Data Types Overview:
┌───────────────┬────────────────────────────┬─────────────────────────────┐
│ Type          │ Operations                 │ Typical Use Case            │
├───────────────┼────────────────────────────┼─────────────────────────────┤
│ String        │ SET, GET, INCR, DECR       │ Page Cache, Token Store     │
│ Hash          │ HSET, HGET, HGETALL        │ User Profiles, Session Data │
│ List          │ LPUSH, RPOP, BRPOP         │ Task Queues, Feeds          │
│ Set           │ SADD, SMEMBERS, SINTER     │ Unique Visitors, Follows    │
│ Sorted Set    │ ZADD, ZRANGE, ZREVRANK     │ Gaming Leaderboards, Sliders│
│ Stream        │ XADD, XREAD, XREADGROUP    │ Kafka-like Event Streams    │
└───────────────┴────────────────────────────┴─────────────────────────────┘
```

### 3. How does TTL (Time to Live) and Key Expiration work in Redis?
**In Simple Words:**
You can set an expiration timeout on any key using `EXPIRE key seconds` or `SET key value EX seconds`:
- When the timer expires, the key becomes inaccessible to clients.
- **Eviction Mechanisms**:
  1. **Passive (Lazy) Expiration**: When a client tries to read a key, Redis checks if it has expired. If expired, it deletes it and returns `nil`.
  2. **Active Expiration**: Every 100ms, Redis randomly samples 20 keys with expiration set, deletes expired keys, and repeats if more than 25% of keys sampled were expired.

### 4. What are the common Caching Patterns: Cache-Aside vs Write-Through vs Write-Behind?
**In Simple Words:**
- **Cache-Aside (Lazy Loading - Most Common)**:
  1. Application checks Redis. If hit -> return data.
  2. If miss -> read from PostgreSQL/MySQL, store in Redis with TTL, return data.
- **Write-Through**: Application writes data to the cache, and the cache synchronously writes to the database before acknowledging success. High consistency, higher write latency.
- **Write-Behind (Write-Back)**: Application writes data only to Redis. An asynchronous worker batches writes and commits them to the database later. Blazing fast, but risk of data loss if Redis crashes before flushing.

### 5. What are the differences between `INCR`, `DECR`, and string commands?
**In Simple Words:**
Redis provides atomic operations that execute without race conditions:
- `INCR counter`: Atomically increments an integer string by 1.
- `INCRBY counter 5`: Increments by an arbitrary step.
- `SETNX key value` ("Set if Not eXists"): Only sets the key if it does not already exist. Foundation of distributed locking and deduplication.

### 6. What is the Redis serialization protocol (RESP)?
**In Simple Words:**
RESP (REdis Serialization Protocol) is the human-readable, high-speed binary-safe text protocol Redis uses over TCP:
- Simple Strings start with `+` (e.g. `+OK\r\n`).
- Errors start with `-` (e.g. `-ERR unknown command\r\n`).
- Integers start with `:` (e.g. `:1000\r\n`).
- Bulk Strings start with `$` followed by byte length (e.g. `$4\r\ncode\r\n`).
- Arrays start with `*` followed by element count (e.g. `*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n`).

### 7. What is Pipeline (Pipelining) in Redis?
**In Simple Words:**
Pipelining allows a client to send multiple commands to the Redis server in a single TCP batch **without waiting for the response of each command individually**:
- Eliminates Round-Trip Time (RTT) network latency.
- Increases throughput from ~10,000 ops/sec up to 500,000+ ops/sec on a single core!

```typescript
// Node.js ioredis Pipelining Example:
import Redis from "ioredis";
const redis = new Redis();

const pipeline = redis.pipeline();
for (let i = 0; i < 1000; i++) {
  pipeline.set(`key_${i}`, `value_${i}`);
}
const results = await pipeline.exec(); // Single network round-trip!
```

### 8. Why is `KEYS *` dangerous in production and what should you use instead?
**In Simple Words:**
`KEYS *` runs a linear $O(N)$ scan across all keys in the database:
- Because Redis is single-threaded, a database with 10 million keys will **freeze completely for seconds or minutes**, blocking all other web requests and triggering production outages!
- **Solution**: Always use **`SCAN`** (`SSCAN`, `HSCAN`, `ZSCAN`), which iterates over keys incrementally using a cursor in small, non-blocking batches without stalling the server.

### 9. What is the difference between Redis and Memcached?
**In Simple Words:**
- **Memcached**: Pure multithreaded key-value cache. Strings only, no persistence, no replication, no clustering out of the box. Fast for simple caching.
- **Redis**: Rich data structures, disk persistence (RDB/AOF), master-replica replication, automatic failover (Sentinel), horizontal clustering, Pub/Sub, and Lua scripting.

### 10. How do you implement a simple Rate Limiter using Redis Sorted Sets (Sliding Window)?
**In Simple Words:**
Sliding window rate limiters prevent boundary spikes:
- Use a Sorted Set where both the member and score are the current Unix epoch timestamp in milliseconds:
```typescript
async function isRateLimited(userId: string, limit = 5, windowMs = 60000): Promise<boolean> {
  const now = Date.now();
  const key = `ratelimit:${userId}`;
  const clearBefore = now - windowMs;

  const multi = redis.multi();
  multi.zremrangebyscore(key, 0, clearBefore); // Remove expired requests
  multi.zadd(key, now, `${now}-${Math.random()}`); // Add current request
  multi.zcard(key); // Count active requests in window
  multi.expire(key, Math.ceil(windowMs / 1000));

  const results = await multi.exec();
  const currentCount = results[2][1] as number;
  return currentCount > limit;
}
```

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. How does the single-threaded Event Loop work in Redis?
**In Simple Words:**
Redis's core request-processing loop runs on a single main execution thread:
- Built around I/O multiplexing primitives (`epoll` on Linux, `kqueue` on macOS).
- The operating system notifies the event loop when a socket has incoming data to read or is ready to write.
- Redis processes commands in memory sequentially in nanoseconds without thread synchronization locks.
- **Redis 6.0+ I/O Threading**: Socket network reading and writing (parsing RESP protocol) can be delegated to auxiliary threads, but **command execution remains strictly single-threaded and lock-free**.

### 12. What are the Redis Memory Eviction Policies (maxmemory-policy)?
**In Simple Words:**
When memory usage reaches `maxmemory`, Redis evicts keys according to the configured policy:
1. **`noeviction` (Default)**: Returns out-of-memory errors on new writes (`OOM command not allowed`).
2. **`allkeys-lru`**: Evicts least recently used keys across all keys (best for general web caches).
3. **`volatile-lru`**: Evicts LRU keys only among keys with an explicit TTL set.
4. **`allkeys-lfu`**: Evicts least frequently used keys (tracks access count; preserves hot keys).
5. **`volatile-lfu`**: Evicts LFU keys among keys with TTL.
6. **`volatile-ttl`**: Evicts keys with the shortest remaining TTL.
7. **`allkeys-random` / `volatile-random`**: Evicts random keys.

### 13. What is Cache Penetration, Cache Breakdown, and Cache Avalanche?
**In Simple Words:**
The 3 classic high-scale caching failure scenarios:
1. **Cache Penetration**: Queries request keys that **do not exist in both cache and DB** (e.g. malicious requests for `id = -999`). Every request bypasses the cache and hammers the database.
   - *Fix*: Cache null objects with short TTL (`SET id:-999 null EX 60`), or use a **Bloom Filter**.
2. **Cache Breakdown (Thundering Herd)**: A single extremely hot key (e.g. celebrity tweet) expires, causing thousands of concurrent requests to hit the database simultaneously to rebuild the cache.
   - *Fix*: Mutex distributed lock on cache miss, or logical expiration (background refresh).
3. **Cache Avalanche**: Thousands of keys are configured with the exact same TTL and expire at the same second, overwhelming the database.
   - *Fix*: Add random jitter to TTLs (`TTL = 3600 + Math.random() * 300`).

```text
Caching Catastrophes:
1. Penetration: Non-existent key ──► [Miss] ──► [Miss in DB!] ──► (DB Overload)
2. Breakdown:   Hot key expires  ──► 10,000 requests hit DB concurrently!
3. Avalanche:   100,000 keys expire at 00:00:00 ──► Entire DB crashes!
```

### 14. What are Redis Persistence Mechanisms: RDB vs. AOF?
**In Simple Words:**
- **RDB (Redis Database Snapshot)**: Point-in-time snapshot of the entire dataset saved to a binary dump file (`dump.rdb`):
  - Uses `bgsave` which invokes Linux `fork()` (Copy-On-Write). Fast server restarts. Risk: Loses data written between snapshots (e.g. last 5 minutes).
- **AOF (Append Only File)**: Logs every write command sequentially:
  - Higher durability. Configured via `appendfsync`: `always` (fsync on every write), `everysec` (fsync once per second - standard), or `no`.
- **Hybrid Persistence (Redis 4.0+)**: Combines RDB snapshot baseline with incremental AOF delta log for fast restarts and minimal data loss.

### 15. How does AOF Rewrite (BGREWRITEAOF) prevent infinite log file growth?
**In Simple Words:**
If a key is updated 10,000 times (`INCR counter`), the AOF file contains 10,000 lines:
- **AOF Rewrite**: Redis forks a child process to inspect the current state of memory and writes the **minimum necessary commands** to recreate the dataset in a new file (replaces 10,000 `INCR` lines with one single `SET counter 10000`!).
- Swaps the new compact AOF file atomically.

### 16. What is the difference between Redis Transactions (MULTI/EXEC) and Lua Scripts?
**In Simple Words:**
- **MULTI / EXEC / WATCH**:
  - `MULTI` queues commands; `EXEC` runs them sequentially.
  - `WATCH` provides optimistic locking (aborts if a key was modified before `EXEC`).
  - **Limitation**: Cannot use conditional results from one command inside the next command in the same transaction!
- **Lua Scripting (`EVAL`)**:
  - Executes complex conditional logic atomically inside the Redis engine.
  - Guaranteed atomicity: no other script or command can run until the Lua script completes.

```lua
-- Atomic check-and-decrement Lua script:
local current = redis.call('get', KEYS[1])
if current and tonumber(current) >= tonumber(ARGV[1]) then
    return redis.call('decrby', KEYS[1], ARGV[1])
else
    return -1
end
```

### 17. What is Pub/Sub in Redis and what is its main limitation?
**In Simple Words:**
Redis Pub/Sub provides simple message broadcasting (`PUBLISH`, `SUBSCRIBE`, `PSUBSCRIBE`):
- **Limitation (At-Most-Once / Fire-and-Forget)**: Redis does **not buffer or store messages**. If a subscriber is disconnected or crashes for 2 seconds, all messages published during that window are permanently lost!
- Use **Redis Streams** if message persistence, acknowledgments, and consumer groups are required.

### 18. How do Redis Streams work with Consumer Groups?
**In Simple Words:**
Redis Streams (`XADD`, `XREADGROUP`, `XACK`) provide Kafka-like persistent message streaming:
- **Message IDs**: Millisecond timestamp + sequence number (`1710500000000-0`).
- **Consumer Groups**: Multiple consumers share a stream; messages are distributed among consumers for parallel processing.
- **Pending Entries List (PEL)**: Tracks messages delivered but not yet acknowledged (`XACK`), allowing recovery from worker crashes.

### 19. What is Redis Sentinel and how does it provide High Availability?
**In Simple Words:**
Sentinel is a distributed monitoring and failover management system:
- Runs as independent daemon processes alongside Redis master and replica nodes.
- Continuously pings master and replicas (`PING`).
- **Quorum Consensus**: If a majority of Sentinels agree that Master is unreachable (`sdown` -> `odown`), Sentinel elects a new master via Raft, reconfigures replicas to replicate from the new master, and notifies clients via Pub/Sub.

### 20. How does Master-Replica Replication work in Redis?
**In Simple Words:**
Replication is asynchronous:
1. **Initial Sync (Full Resync)**: Master runs `bgsave` to create an RDB snapshot and sends it over the network to the Replica.
2. The replica loads the RDB file into memory.
3. Master buffers new writes in the **Replication Backlog Buffer** and streams them to the replica continuously.
4. **Partial Resync (PSYNC)**: If a replica briefly disconnects, it reconnects using its offset and fetches only missing delta bytes from the backlog buffer without a full RDB transfer.

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. How does Redis Cluster partition data across 16,384 Hash Slots?
**In Simple Words:**
Redis Cluster provides transparent, distributed horizontal sharding with zero single point of failure:
- The keyspace is divided into **16,384 Hash Slots** (0 to 16,383).
- **Slot Calculation**:
  $$\text{Slot} = \text{CRC16}(key) \pmod{16384}$$
- The 16,384 slots are divided among master nodes (e.g. Node 1 owns 0-5460, Node 2 owns 5461-10922, Node 3 owns 10923-16383).
- Clients connect to any node. If a key belongs to another node, the server responds with a **`-MOVED <slot> <ip:port>`** redirect.

```text
Redis Cluster Hash Slot Distribution:
[Client] ──► Query: "user:101"
                │
         CRC16("user:101") % 16384 = Slot 7200
                │
       ┌────────┴────────┐
       ▼                 ▼
[Node A (0-5460)]  [Node B (5461-10922)] ◄── Key resides here!
```

### 22. What are Hash Tags in Redis Cluster and why are they necessary for multi-key commands?
**In Simple Words:**
In Redis Cluster, multi-key commands (`MGET`, `MSET`, transactions) **fail if the keys live on different cluster nodes**:
- **Hash Tags `{...}`**: Force Redis to hash only the text inside curly braces:
  - `user:{101}:profile` and `user:{101}:orders` will hash strictly on `{101}`.
- Guarantees both keys map to the exact same hash slot and physical node, allowing atomic transactions and multi-key queries!

### 23. What is the Redlock Algorithm and how does Distributed Locking work?
**In Simple Words:**
Single-instance Redis locks (`SET key uuid NX PX 30000`) fail if the master crashes before replicating the lock to the replica (split-brain lock acquisition):
- **Redlock (Martin Kleppmann / Salvatore Sanfilippo)**:
  1. Acquire lock across $N$ independent Redis master nodes (e.g. 5 nodes).
  2. Use the same key and random UUID value with a short timeout.
  3. Lock is considered acquired if the client obtains locks from a majority ($\lfloor N/2 \rfloor + 1 = 3$) nodes within the validity time.
  4. Release lock across all nodes using a Lua script verifying the UUID token.

```lua
-- Safe Lock Release Lua Script:
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
```

### 24. What is a Bloom Filter in Redis (RedisBloom) and how does it eliminate Cache Penetration?
**In Simple Words:**
A Bloom Filter is a space-efficient probabilistic data structure used to test set membership:
- Returns: "Definitely NOT in the set" or "Might be in the set" (never false negatives, small configurable false positive rate).
- **Architecture**: When a user queries `id = 999`, the app queries the Bloom Filter in memory first:
  - If Bloom filter returns `false`: Return 404 immediately; **never query cache or database**!
  - If Bloom filter returns `true`: Check cache and fallback to DB.

### 25. How do Redis Skiplists work in Sorted Sets (ZSET)?
**In Simple Words:**
A Sorted Set is implemented internally using a **Hash Table** ($O(1)$ score lookup by member) paired with a **Skip List**:
- **Skip List**: A probabilistic hierarchy of linked lists where higher levels act as "express lanes" skipping multiple nodes.
- Provides $O(\log N)$ average time complexity for insertions, deletions, and range queries (`ZRANGEBYSCORE`).
- Much simpler and more memory-friendly than balanced trees (AVL/Red-Black trees) for concurrent memory operations.

### 26. What causes Fork Latency and Copy-On-Write (COW) Memory Spikes during RDB/AOF saves?
**In Simple Words:**
When executing `BGSAVE` or `BGREWRITEAOF`, Redis calls `fork()` to spawn a child process:
- Linux duplicates page tables. If the instance uses 32 GB of RAM with thousands of memory pages, `fork()` can stall the main thread for 50-200ms!
- **Copy-On-Write (COW)**: Memory pages are shared between parent and child until written to. If the application has heavy write traffic during the save, the OS copies entire modified memory pages, **potentially doubling the server's RAM consumption**!
- Ensure servers have at least 2x memory allocated or disable Transparent Huge Pages (THP).

### 27. Why must Transparent Huge Pages (THP) be disabled for Redis?
**In Simple Words:**
Linux Transparent Huge Pages (THP) allocates memory in 2 MB chunks instead of standard 4 KB pages:
- During Copy-On-Write, writing a single 10-byte string forces the OS to duplicate an entire **2 MB memory page**!
- Causes severe memory bloat, high allocation latency, and random connection timeouts.
- Always run: `echo never > /sys/kernel/mm/transparent_hugepage/enabled`.

### 28. What is Client-Side Caching (Tracking / Invalidation) in Redis 6?
**In Simple Words:**
Caches hot data directly in application process memory (Node.js/Go RAM) for zero-latency in-process lookups:
- **The Invalidation Challenge**: How does the app know when Redis data changed?
- **Redis 6 Tracking**: The client instructs Redis to track keys it has read. When another client modifies `user:101`, Redis server automatically pushes an **Invalidation Message** to the client socket, telling it to invalidate its local in-memory cache!

### 29. How do you troubleshoot Redis Latency and High CPU?
**In Simple Words:**
1. Check the Slowlog: `SLOWLOG GET 20` (identifies commands exceeding `slowlog-log-slower-than`).
2. Run `redis-cli --latency` and `redis-cli --intrinsic-latency` to differentiate network vs engine latency.
3. Check CPU profile with `INFO commandstats` (detects heavy commands like `KEYS`, `SMEMBERS`, or large `HGETALL`).
4. Inspect `used_memory_rss` vs `used_memory` (ratio > 1.5 indicates severe memory fragmentation; trigger `MEMORY PURGE` or active defragmentation).

### 30. How does Redis handle Big Keys and Hot Keys?
**In Simple Words:**
- **Big Key**: A single key containing millions of items (e.g. a List with 5 million entries). Deleting it with `DEL` blocks the event loop for seconds!
  - *Fix*: Detect with `redis-cli --bigkeys`. Use `UNLINK` (asynchronous background deletion) instead of `DEL`.
- **Hot Key**: A single key receiving 100,000 QPS, exhausting a single node's network interface.
  - *Fix*: Multi-level caching (client-side memory cache), or key sharding (replicate `hot_key` to `hot_key_1`, `hot_key_2` across cluster nodes).

### 31. What is Active Defragmentation in Redis?
**In Simple Words:**
Frequent allocations and deallocations in RAM cause memory fragmentation (high RSS memory while actual data is small):
- Traditional restart reclaims memory but incurs downtime.
- **Active Defragmentation (`activedefrag yes`)**: Runs concurrently inside the event loop, allocating new contiguous memory blocks, copying data over, and freeing fragmented pages on-the-fly without downtime.

### 32. What is Redis Lua Script Timeout and `SCRIPT KILL`?
**In Simple Words:**
Because Lua scripts run atomically, an infinite loop freezes Redis completely:
- Configured by `lua-time-limit` (default 5,000ms).
- When a script exceeds the threshold, Redis accepts administrative commands and responds with `-BUSY`.
- You can execute **`SCRIPT KILL`** to abort a read-only script. If the script already performed writes, `SCRIPT KILL` fails and you must execute `SHUTDOWN NOSAVE`.

### 33. How does Redis achieve Cross-DC Replication (Active-Active)?
**In Simple Words:**
Standard Redis replication is strictly master-replica within a single datacenter:
- For active-active multi-region deployments, enterprise systems use **CRDTs (Conflict-Free Replicated Data Types)** (e.g. Redis Enterprise Active-Active).
- Automatically resolves concurrent write conflicts across multi-region datacenters using mathematical commutativity and Last-Writer-Wins (LWW) without human intervention.

### 34. What is the difference between `EXPIRE` and `PEXPIRE`?
**In Simple Words:**
- `EXPIRE key seconds`: Sets TTL in whole seconds.
- `PEXPIRE key milliseconds`: Sets TTL with millisecond precision.
- Internally, Redis always converts all expiration timestamps to Unix epoch in milliseconds for consistency across replication and restarts.

### 35. When should you NOT use Redis?
**In Simple Words:**
1. **Primary storage for datasets significantly larger than physical RAM**: RAM costs $5-$10/GB vs $0.02/GB on SSDs (use DynamoDB, Cassandra, or PostgreSQL).
2. **Complex relational joins and ad-hoc aggregations**: Redis lacks relational querying capabilities.
3. **Strict ACID durability requirements without any data loss tolerance**: Even with AOF `everysec`, a power loss can lose the last 1 second of transactions.
`;
