# Redis & Distributed In-Memory Caching Master Interview Bank (1 - 11)

> Redis single-threaded event loop, RESP protocol, in-memory data structures (Strings, Hashes, Sorted Sets, HyperLogLog), cache eviction algorithms (LRU/LFU), Redis Cluster, and Sentinel HA.

---

### 1. Wide-Column (Cassandra) vs Graph (Neo4j):
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

### 2. Why single-threaded Redis handles 100k+ ops/sec:
**In Simple Words:**
1. **In-Memory**: Operations run in RAM, bypassing slow disk I/O.
2. **Single-Threaded**: Zero lock contention,

### 3. Core Redis Data Structures:
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

### 4. Caching Strategies:
**In Simple Words:**
- **Cache-Aside (La

### 5. Cache Stampede vs Penetration vs Avalanche:
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

### 6. Redis Eviction Policies:
**In Simple Words:**
`allkeys-lru` (evicts least-recently-used), `volatile-lru` (evicts LRU among keys with TTL), `allkeys-lfu` (evicts least-frequently-used).

```ini
# redis.conf memory limit & eviction policy:
maxmemory 4gb
maxmemory-policy allkeys-lru
```

### 7. Redis Persistence: RDB vs AOF:
**In Simple Words:**
- **RDB**: Point-in-time binary snapshots. Fast restarts, but risks losing recent minutes of data.
- **AOF**: Append-only log of every write command. High durability, but larger file si

### 8. Redis Sliding Window Rate Limiter:
**In Simple Words:**
Uses a Sorted Set (ZSET) where score is the current timestamp: `ZREMRANGEBYSCORE` clears expired timestamps; `ZCARD` counts active requests in the window.

```javascript
async function rateLimit(userId, limit = 100, windowSec = 60) {
  const now = Date.now();
  const clearBefore = now - (windowSec * 1000);
  const key = `rate:${userId}`;

  const multi = redis.multi();
  multi.

### 9. Distributed Locks in Redis (Redlock):
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

### 10. Redis Pub/Sub vs Redis Streams:
**In Simple Words:**
- **Pub/Sub**: Fire-and-forget; messages are not saved.
- **Streams**: Persistent message log with Consumer Groups and acknowledgments (`XACK`).

```bash
# Redis Streams example:
XADD mystream * sensor_id 101 temperature 24.5
XREADGROUP GROUP mygroup consumer1 COUNT 10 STREAMS mystream >
XACK mystream mygroup "1730000000000-0"
```

### 11. When Redis caching is architectural overkill:
**In Simple Words:**
When an app has low traffic (< 50 req/sec), queries are already sub-10ms with proper indexing, or data changes so fast that cache invalidation overhead outweighs gains.

```sql
-- Often a fast PostgreSQL index is faster & simpler than caching in Redis:
-- Average query time: 0.8ms without maintaining Redis cache invalidation logic!
SELECT * FROM products WHERE sku = 'SKU-8821';
```

---

## Part 5: Real-Time Architecture, Replication & Scale (51 - 60)

