# Amazon DynamoDB & Key-Value NoSQL Master Interview Bank (1 - 6)

> AWS DynamoDB partition keys, sort keys, Global Secondary Indexes (GSI), Local Secondary Indexes (LSI), Single-Table Design patterns, DynamoDB Streams, and Global Tables.

---

### 1. DynamoDB Partition Keys, Sort Keys & Hot Partitions:
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

### 2. DynamoDB GSI vs LSI:
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

### 3. DynamoDB Single-Table Design: Partition Key (PK) and Sort Key (SK) Overloading.
**In Simple Words:**
Instead of creating 10 relational tables for Users, Orders, and Products, Single-Table Design stores all entities in **one single table**:
- **PK & SK Overloading**: Use generic string names (`PK`, `SK`) with entity prefixes:
  - User profile: `PK = "USER#123"`, `SK = "PROFILE"`
  - User orders: `PK = "USER#123"`, `SK = "ORDER#2026-001"`
- **Benefits**: Retrieve a user profile AND their last 5 orders in a **single network request** using `KeyConditionExpression: PK = "USER#123" AND SK begins_with("ORDER#")`.

### 4. Global Secondary Indexes (GSI) vs. Local Secondary Indexes (LSI) in DynamoDB.
**In Simple Words:**
- **LSI (Local Secondary Index)**:
  - Must share the same Partition Key as the base table, but has a different Sort Key.
  - Must be created at table creation time (cannot be added later).
  - Strongly consistent reads are supported.
- **GSI (Global Secondary Index)**:
  - Can have a completely different Partition Key and Sort Key.
  - Can be created or deleted anytime on an active production table.
  - Strictly **Eventual Consistency** (replicated asynchronously from the base table).

### 5. DynamoDB Capacity Modes: Provisioned (with Auto Scaling) vs. On-Demand.
**In Simple Words:**
- **Provisioned Mode**: You specify Read Capacity Units (RCUs) and Write Capacity Units (WCUs). 1 WCU = 1 write up to 1KB/sec. 1 RCU = 1 strongly consistent read up to 4KB/sec. Best for predictable steady workloads.
- **On-Demand Mode**: Pay purely per request ($0.25 per million writes). Automatically accommodates instant spikes of up to double the previous traffic peak without throttling.

### 6. DynamoDB Streams and Event-Driven Microservices Architecture.
**In Simple Words:**
**DynamoDB Streams** captures a time-ordered sequence of item-level modifications (insert, update, delete) in a 24-hour log:
- Connects natively to AWS Lambda.
- Ideal for asynchronous read-model cache invalidation, publishing change data capture (CDC) events to Amazon EventBridge, and aggregating cross-table analytics.

