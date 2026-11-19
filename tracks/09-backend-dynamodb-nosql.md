# Amazon DynamoDB & Key-Value NoSQL Master Interview Bank (1 - 35)

> AWS DynamoDB partition keys, sort keys, Global Secondary Indexes (GSI), Local Secondary Indexes (LSI), Single-Table Design patterns, DynamoDB Streams, Global Tables, DAX, and high-scale consistency models.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is Amazon DynamoDB and how does its data model work?
**In Simple Words:**
Amazon DynamoDB is a fully managed, serverless NoSQL key-value and document database designed for single-digit millisecond latency at any scale:
- **Tables**: Similar to a relational table, but schema-less except for the primary key.
- **Items**: Similar to a row in SQL; an item is a collection of attributes. Items can have differing attributes (up to 400KB per item).
- **Attributes**: Similar to columns/fields; can be scalar (String, Number, Binary, Boolean, Null) or complex (List, Map, StringSet, NumberSet).

```typescript
// AWS SDK v3: PutItem Example
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
await client.send(new PutItemCommand({
  TableName: "Users",
  Item: {
    userId: { S: "usr_101" },
    email: { S: "alex@example.com" },
    age: { N: "28" },
    roles: { SS: ["admin", "editor"] }
  }
}));
```

### 2. What are Partition Keys (HASH) and Sort Keys (RANGE) in DynamoDB?
**In Simple Words:**
Every DynamoDB item must have a primary key. It can be simple or composite:
- **Simple Primary Key (Partition Key only)**: DynamoDB hashes the partition key value to determine the exact internal storage partition where the item lives.
- **Composite Primary Key (Partition Key + Sort Key)**: All items sharing the same partition key are stored together on the same physical partition, sorted ascending by the sort key (B-tree ordering).

```typescript
// Query items sharing the same partition key within a sort key range:
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const command = new QueryCommand({
  TableName: "SensorReadings",
  KeyConditionExpression: "deviceId = :id AND timestamp BETWEEN :start AND :end",
  ExpressionAttributeValues: {
    ":id": { S: "sensor_042" },
    ":start": { S: "2026-01-01T00:00:00Z" },
    ":end": { S: "2026-01-02T00:00:00Z" }
  }
});
```

### 3. What is the difference between Query and Scan operations in DynamoDB?
**In Simple Words:**
- **Query**: Highly efficient and targeted. Directly accesses a partition using the exact Partition Key and optional Sort Key conditions. Operates in O(1) partition lookup + O(log K) scan within the partition.
- **Scan**: Reads **every single item** in the entire table or index sequentially. Extremely expensive, slow, consumes massive read capacity, and should be avoided in production OLTP request paths.

```text
Operation Comparison:
┌───────────┬──────────────────────────────────┬─────────────────────────────┐
│ Feature   │ Query                            │ Scan                        │
├───────────┼──────────────────────────────────┼─────────────────────────────┤
│ Target    │ Single Partition Key             │ Entire Table (All items)    │
│ Speed     │ Single-digit milliseconds        │ Linear O(N) with table size │
│ Capacity  │ Reads only matched items         │ Consumes RCU for whole table│
│ Use Case  │ OLTP lookups, order histories    │ Batch migrations, exports   │
└───────────┴──────────────────────────────────┴─────────────────────────────┘
```

### 4. What is the difference between Strongly Consistent Reads and Eventually Consistent Reads?
**In Simple Words:**
When data is written to DynamoDB, it is replicated across three Availability Zones (AZs):
- **Eventually Consistent Read (Default)**: Reads from one of the replicas. May return slightly stale data if a write just occurred (typically under 1 second). Consumes **half** the read capacity (0.5 RCU per 4KB).
- **Strongly Consistent Read**: Returns a response with the most up-to-date data by reflecting all successful writes prior to the read. Consumes **1 full RCU** per 4KB.
- Note: Global Secondary Indexes (GSIs) **only** support eventual consistency.

### 5. What are Read Capacity Units (RCU) and Write Capacity Units (WCU)?
**In Simple Words:**
- **1 WCU**: Represents one write per second for an item up to 1 KB in size.
- **1 RCU**: Represents one strongly consistent read per second (or two eventually consistent reads) for an item up to 4 KB in size.
- If an item is 8 KB:
  - Strongly consistent read = 2 RCUs.
  - Eventually consistent read = 1 RCU.
  - Write = 8 WCUs.

### 6. What is the difference between Provisioned and On-Demand capacity modes?
**In Simple Words:**
- **Provisioned Mode**: You explicitly specify the number of RCUs and WCUs (with optional auto-scaling). Best for predictable traffic profiles to achieve the lowest hourly cost.
- **On-Demand Mode**: Pay strictly per request ($0.25 per million writes, $1.25 per million reads). Automatically accommodates instantaneous traffic spikes of up to double the previous peak with zero throttling.

### 7. What is DynamoDB Time to Live (TTL) and how does it work?
**In Simple Words:**
TTL automatically expires and deletes items from a table at no additional cost (consumes 0 WCU):
- You designate an attribute containing a Unix epoch timestamp in seconds (e.g. `1773993600`).
- A background worker scans the table and deletes expired items typically within 48 hours of expiration.
- Deletions are published to DynamoDB Streams with a system identity indicator (`eventName: REMOVE`).

### 8. What is the maximum item size in DynamoDB and how do you store larger data?
**In Simple Words:**
The hard limit for an item in DynamoDB is **400 KB** (including attribute names and values):
- If your data exceeds 400 KB (e.g. user documents, PDF blobs, large image metadata):
- Store the binary blob or raw JSON payload in **Amazon S3**.
- Store the S3 object URL, bucket name, ETag, and metadata attributes inside DynamoDB.

### 9. What are Condition Expressions in DynamoDB writes?
**In Simple Words:**
Condition expressions prevent race conditions and overwrites by executing writes only if specific item attributes meet criteria:
- `attribute_not_exists(PK)` ensures an item cannot be overwritten if it already exists (idempotent creation).
- `version = :expectedVersion` enables optimistic concurrency control.

```typescript
// Optimistic Locking using ConditionExpression:
await client.send(new UpdateItemCommand({
  TableName: "Accounts",
  Key: { accountId: { S: "acc_99" } },
  UpdateExpression: "SET balance = balance - :amount, version = version + :inc",
  ConditionExpression: "balance >= :amount AND version = :currentVersion",
  ExpressionAttributeValues: {
    ":amount": { N: "50" },
    ":inc": { N: "1" },
    ":currentVersion": { N: "4" }
  }
}));
```

### 10. What are Projection Expressions in DynamoDB?
**In Simple Words:**
Projection expressions specify the subset of attributes to return from an item, reducing network bandwidth between AWS and your application:
- Example: `ProjectionExpression: "userId, email, accountStatus"`
- Note: It does **not** reduce RCU consumption; DynamoDB calculates read capacity based on the full item size before projection.

---

## Part 2: Intermediate Data Modeling & API Operations (Mid-Level)

### 11. What is the difference between Global Secondary Indexes (GSI) and Local Secondary Indexes (LSI)?
**In Simple Words:**
- **LSI (Local Secondary Index)**:
  - Must share the exact same Partition Key as the base table, but provides an alternative Sort Key.
  - Must be declared at table creation time; cannot be added or deleted later.
  - Enforces a 10 GB partition size limit for the collection. Supports strong consistency.
- **GSI (Global Secondary Index)**:
  - Can define an entirely different Partition Key and Sort Key.
  - Can be added, modified, or removed at any time on a live production table.
  - Scales throughput independently; strictly eventually consistent.

```json
// GSI Example in CloudFormation/CDK:
{
  "IndexName": "EmailLookupIndex",
  "KeySchema": [
    { "AttributeName": "email", "KeyType": "HASH" },
    { "AttributeName": "createdAt", "KeyType": "RANGE" }
  ],
  "Projection": { "ProjectionType": "INCLUDE", "NonKeyAttributes": ["userId", "status"] }
}
```

### 12. What are the GSI Projection types and their performance trade-offs?
**In Simple Words:**
When defining a secondary index, you choose which attributes to duplicate from the base table:
1. `KEYS_ONLY`: Only the base table primary keys and index keys are copied. Consumes minimum storage and WCU, but requires extra base table lookups if non-key fields are needed.
2. `INCLUDE`: Copies index keys plus a whitelist of specified attributes. Best balance of speed and cost.
3. `ALL`: Copies every attribute into the index. Maximizes query speed at the expense of higher storage cost and higher index write capacity.

### 13. What is Single-Table Design in DynamoDB and why is it recommended?
**In Simple Words:**
Instead of modeling relational tables (Users, Orders, Items, Payments) into separate DynamoDB tables, Single-Table Design stores all application entities inside **one consolidated table**:
- **Mechanism**: Overloads generic primary key attributes named `PK` and `SK`.
- **Query Efficiency**: Allows fetching a parent entity and all its child relationships (e.g. User Profile + 5 Recent Orders) in a **single round-trip query** using `PK = "USER#101" AND SK begins_with("ORDER#")`.
- Reduces connection overhead, eliminates multi-table joins, and minimizes AWS costs.

### 14. How do you implement PK and SK Overloading in Single-Table Design?
**In Simple Words:**
Entities share standard `PK` and `SK` string names using colon or hashtag delimiters:
- User Profile: `PK = "USER#42"`, `SK = "PROFILE#42"`
- User Order: `PK = "USER#42"`, `SK = "ORDER#2026-03-15#991"`
- Order Item: `PK = "ORDER#991"`, `SK = "ITEM#SKU-772"`
- Global Index GSI1: `GSI1_PK = "STATUS#PENDING"`, `GSI1_SK = "DATE#2026-03-15"`

```typescript
// Fetching User Profile AND Recent Orders in 1 Query:
const query = new QueryCommand({
  TableName: "ECommerceApp",
  KeyConditionExpression: "PK = :userPk AND SK begins_with(:prefix)",
  ExpressionAttributeValues: {
    ":userPk": { S: "USER#42" },
    ":prefix": { S: "ORDER#" }
  }
});
```

### 15. What are Hot Partitions in DynamoDB and how do you prevent them?
**In Simple Words:**
A hot partition occurs when read or write traffic is disproportionately concentrated on a single partition key value. Each partition has a physical limit of **1,000 WCU** and **3,000 RCU**:
- **Causes**: Keys with high skew (e.g. `status = "ACTIVE"`, or today's date `2026-03-15`).
- **Remedies**:
  1. **Write Sharding (Salting)**: Append a random suffix (e.g. `EVENT#2026-03-15#` + random integer 1..10) to distribute writes evenly across 10 partitions.
  2. **DynamoDB Accelerator (DAX)**: Cache read-heavy hot keys in-memory.

### 16. What is DynamoDB Accelerator (DAX) and when should it be used?
**In Simple Words:**
DAX is a fully managed, highly available, in-memory cache specifically built for DynamoDB:
- Provides microsecond response times for read-heavy workloads (from ~5ms down to ~200μs).
- **Drop-in SDK Replacement**: No need to rewrite caching logic; point the DynamoDB client at the DAX cluster endpoint.
- Uses write-through caching to keep in-memory cache synchronized with the underlying table.

### 17. How do DynamoDB Transactions (TransactWriteItems / TransactGetItems) work?
**In Simple Words:**
DynamoDB provides all-or-nothing ACID transactions across multiple items within or across tables in the same AWS account and region:
- **TransactWriteItems**: Up to 100 items or 4 MB of data in a single transactional batch. If any item fails its condition expression, the entire transaction rolls back.
- **Cost**: Consumes **2x** the capacity units (two-phase commit protocol under the hood).

```typescript
import { DynamoDBClient, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";

await client.send(new TransactWriteItemsCommand({
  TransactItems: [
    {
      Update: {
        TableName: "Accounts",
        Key: { id: { S: "acc_A" } },
        UpdateExpression: "SET balance = balance - :amt",
        ConditionExpression: "balance >= :amt",
        ExpressionAttributeValues: { ":amt": { N: "100" } }
      }
    },
    {
      Update: {
        TableName: "Accounts",
        Key: { id: { S: "acc_B" } },
        UpdateExpression: "SET balance = balance + :amt",
        ExpressionAttributeValues: { ":amt": { N: "100" } }
      }
    }
  ]
}));
```

### 18. What is BatchGetItem and BatchWriteItem and what are their limitations?
**In Simple Words:**
- **BatchGetItem**: Retrieves up to 100 items (max 16 MB) across one or more tables in parallel.
- **BatchWriteItem**: Puts or deletes up to 25 items (max 16 MB) in a single request.
- **Crucial Caveat**: Batches do **not** support condition expressions and are **not atomic** (some items can succeed while others fail).
- Always inspect `UnprocessedKeys` or `UnprocessedItems` and implement exponential backoff retry.

### 19. What is DynamoDB Streams and what are the four stream view types?
**In Simple Words:**
DynamoDB Streams captures an ordered log of item-level modifications for 24 hours:
1. `KEYS_ONLY`: Only the modified item's primary key attributes.
2. `NEW_IMAGE`: The complete item as it appears after the modification.
3. `OLD_IMAGE`: The complete item as it was before the modification.
4. `NEW_AND_OLD_IMAGES`: Both before and after representations.
- Connects directly to AWS Lambda for asynchronous event sourcing, search indexing, and replication.

### 20. How do you implement Pagination in DynamoDB queries?
**In Simple Words:**
DynamoDB returns at most **1 MB of data** or the configured `Limit` in a single query:
- If more items remain, the response includes `LastEvaluatedKey`.
- Pass `ExclusiveStartKey: LastEvaluatedKey` in the subsequent query to fetch the next page.
- Once `LastEvaluatedKey` is undefined/null, the last page has been reached.

---

## Part 3: Advanced Architecture, Scale & Internals (Senior / Lead)

### 21. How does DynamoDB partition data physically under the hood?
**In Simple Words:**
- Physical partitions are SSD-backed storage nodes managed by a storage fleet running Paxos consensus.
- Each partition holds up to **10 GB of data** and supports up to **1,000 WCU** and **3,000 RCU**.
- An MD5 hash of the partition key produces a 128-bit integer determining which partition owns the key range.
- When a partition exceeds 10 GB or throughput thresholds, DynamoDB automatically performs an internal partition split without downtime.

### 22. What is Burst Capacity and Adaptive Capacity in DynamoDB?
**In Simple Words:**
- **Burst Capacity**: Unused read and write capacity is banked up to 300 seconds (5 minutes) to absorb sudden momentary traffic surges.
- **Adaptive Capacity**: Automatically redistributes allocated capacity from cold partitions to hot partitions, preventing throttling if the overall table throughput limit is not breached.

### 23. How do DynamoDB Global Tables work and how do they resolve conflict?
**In Simple Words:**
Global Tables provide multi-region, multi-master replication with 99.999% availability:
- Writes to any replica region are replicated asynchronously within ~1 second to all other regions.
- **Conflict Resolution**: Uses **Last Writer Wins (LWW)** based on an internal system timestamp. If two concurrent writes touch the same item in different regions, the write with the higher timestamp prevails.

### 24. How do you model Many-to-Many relationships in DynamoDB?
**In Simple Words:**
Modeled using an Adjacency List pattern via Global Secondary Indexes:
- Example: Students and Classes:
  - Base Table: `PK = "STUDENT#1"`, `SK = "CLASS#Math"`
  - GSI1: Invert keys: `GSI1_PK = SK ("CLASS#Math")`, `GSI1_SK = PK ("STUDENT#1")`
- To list all classes for a student: Query base table where `PK = "STUDENT#1"`.
- To list all students in a class: Query GSI1 where `GSI1_PK = "CLASS#Math"`.

### 25. How do you implement Hierarchical 1-to-N relationships using Sort Key prefixes?
**In Simple Words:**
Use structured composite string patterns in sort keys:
- Location Hierarchy:
  - `PK = "COUNTRY#US"`, `SK = "STATE#CA#COUNTY#Orange#CITY#Irvine"`
- Queries can fetch broad or specific child trees using `begins_with`:
  - Fetch entire state: `SK begins_with("STATE#CA#")`
  - Fetch specific county: `SK begins_with("STATE#CA#COUNTY#Orange#")`

### 26. What are the best practices for Primary Key design to prevent write throttling?
**In Simple Words:**
1. Use high-cardinality values for Partition Keys (UUIDs, User IDs, Device IDs).
2. Avoid low-cardinality keys like status flags, boolean values, or day/month dates.
3. If temporal data is required, prefix date with entity ID: `USER#101#2026-03`.
4. Add random or calculated suffixes (sharding salt: `0..N`) to hot write partitions.

### 27. What is the difference between DynamoDB Standard and Standard-IA (Infrequent Access) table classes?
**In Simple Words:**
- **Standard**: Optimized for active OLTP workloads; lower read/write capacity costs, normal storage costs ($0.25/GB/month).
- **Standard-IA**: Cuts storage costs by **60%** ($0.10/GB/month), but increases read and write request costs by 25%.
- Ideal for long-term audit logs, historical order data, and archival records that are infrequently accessed.

### 28. How do you implement distributed locking in DynamoDB?
**In Simple Words:**
Use conditional writes with TTL:
- Acquire lock: `PutItem` with `ConditionExpression: attribute_not_exists(lockName) OR lockExpiresAt < :now` and set `lockExpiresAt` to `now + leaseSeconds`.
- Heartbeat: Extend `lockExpiresAt` conditionally matching lease owner ID.
- Release lock: Delete item conditionally matching lease owner ID.

### 29. How does DynamoDB handle Point-In-Time Recovery (PITR)?
**In Simple Words:**
PITR provides continuous automated backups of DynamoDB tables:
- Retains incremental delta logs for the preceding 35 days.
- Allows restoring the table to any specific second (`YYYY-MM-DDTHH:MM:SSZ`) within the 35-day window into a new table.
- Zero performance impact on the active production table.

### 30. How do you migrate data into DynamoDB with zero downtime?
**In Simple Words:**
1. Dual-write new writes to both legacy database and DynamoDB.
2. Backfill historical data using AWS Glue or AWS DMS (Database Migration Service).
3. Reconcile data differences using verification jobs.
4. Switch read traffic to DynamoDB.
5. Deprecate legacy database writes.

### 31. What is the GSI Write Amplification problem and how do you minimize it?
**In Simple Words:**
Every time an item is updated, DynamoDB must write to every GSI whose index attributes are present on the item:
- If a table has 5 GSIs, a single item update may consume 1 base table WCU + 5 GSI WCUs!
- **Sparse Indexes**: Only populate the GSI partition key attribute when the item needs to be indexed (e.g. only set `isFlagged: true` for flagged items). Null or omitted attributes are not indexed, saving capacity.

### 32. How do you handle leaderboard / rank queries efficiently in DynamoDB?
**In Simple Words:**
- DynamoDB cannot compute dynamic ranking (like SQL `RANK() OVER`) across millions of items efficiently.
- Best approach: Store top scores in high-tier buckets (e.g. `PK = "SCORE_BUCKET#900_1000"`), or offload live real-time leaderboards to Redis Sorted Sets (`ZADD`, `ZREVRANK`), using DynamoDB as the persistent backing store.

### 33. What security and encryption controls are available in DynamoDB?
**In Simple Words:**
- **Encryption at Rest**: Enabled by default using AWS KMS (AWS owned key, AWS managed key, or Customer Managed Key - CMK).
- **Encryption in Transit**: Enforced via HTTPS / TLS 1.3 endpoints.
- **Access Control**: Fine-grained IAM policies using `LeadingKeys` condition to restrict users to accessing only their own partition keys (`aws:userid`).
- **Network Isolation**: Accessible privately through VPC Endpoints (Gateway endpoints) with 0 internet routing.

### 34. How does DynamoDB prevent Split-Brain during internal node failures?
**In Simple Words:**
DynamoDB uses the **Paxos consensus protocol** within each three-replica storage group:
- A write must achieve a quorum acknowledgment (at least 2 out of 3 replicas) to be confirmed.
- If one replica goes offline, the remaining two maintain quorum.
- A leader lease timeout ensures only one active leader processes writes, eliminating split-brain anomalies.

### 35. When should you NOT use DynamoDB?
**In Simple Words:**
1. **Ad-hoc exploratory reporting**: Workloads requiring arbitrary multi-column filtering and complex dynamic aggregation (use Snowflake, BigQuery, or PostgreSQL).
2. **Heavy relational graph traversals**: Highly interconnected data requiring deep multi-hop joins (use Neo4j or Amazon Neptune).
3. **Blob storage**: Storing large files (> 400 KB) directly in database records (use Amazon S3).
4. **Unpredictable query patterns**: Where access patterns cannot be determined upfront before designing primary keys and indexes.
