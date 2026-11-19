# MongoDB & Document NoSQL Master Interview Bank (1 - 12)

> MongoDB WiredTiger storage engine, document data modeling, Aggregation Pipeline stages, compound indexes, replica sets, Raft consensus, and horizontal sharding.

---

### 1. CAP Theorem:
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

### 2. When to choose MongoDB over PostgreSQL:
**In Simple Words:**
When schemas vary wildly between records, when data is deeply nested and accessed together, and when hori

### 3. MongoDB: Embedding vs Referencing:
**In Simple Words:**
- **Embed**: For 1-to-few relationships where child data is always retrieved with parent (Order Items in an Order).
- **Reference**: For 1-to-many or many-to-many relationships where data updates frequently or approaches 16MB document si

### 4. MongoDB Aggregation Pipeline:
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

### 5. MongoDB Compound & Multikey Indexes:
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

### 6. Replica Sets vs Sharded Clusters in MongoDB:
**In Simple Words:**
- **Replica Sets**: High availability (1 Primary + multiple Secondaries with automated failover).
- **Sharded Clusters**: Hori

### 7. MongoDB Oplog & Change Streams:
**In Simple Words:**
The Oplog records all write operations. **Change Streams** allow apps to listen to real-time database changes without polling.

```javascript
const changeStream = db.collection('orders').watch();
changeStream.on('change', next => {
  console.log('Realtime DB mutation:', next.operationType, next.fullDocument);
});
```

### 8. MongoDB Transactions:
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

### 9. Write Concerns & Read Concerns:
**In Simple Words:**
- **Write Concern (`w: "majority"`)**: Waits for a majority of replica nodes to commit before acknowledging.
- **Read Concern (`"majority"`)**: Reads only data committed by a majority of nodes to avoid dirty reads.

```javascript
await db.collection('payments').insertOne(
  { transactionId: "txn_789", amount: 1000 },
  { writeConcern: { w: "majority", wtimeout: 5000 } }
);
```

### 10. TTL (Time-To-Live) Indexes:
**In Simple Words:**
Automatically deletes documents after a specified duration. Ideal for sessions, caching, and OTP verification codes.

```javascript
// Automatically delete session documents 1 hour (3600s) after createdAt:
db.sessions.createIndex(
  { "createdAt": 1 }, 
  { expireAfterSeconds: 3600 }
);
```

### 11. Optimistic vs Pessimistic Locking:
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

### 12. Eventual Consistency:
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

