# Relational SQL & Database Architecture Master Interview Bank (1 - 17)

> Relational SQL design, ACID properties, isolation levels (Read Committed vs Repeatable Read vs Serializable), B-Tree indexes, normalization, joins, and query optimization.

---

### 1. What is a Database Management System (DBMS), and what are the foundational differences between Relational (SQL) and Non-Relational (NoSQL) databases?
**In Simple Words:**
A **Database Management System (DBMS)** is speciali

### 2. Walk me through your production database architecture experience and database selection criteria.
**In Simple Words:**
"In production, I have architected and operated **PostgreSQL**, **MySQL**, **MongoDB**, **Redis**, and **DynamoDB**.
My database selection framework is guided by access patterns and consistency requirements:
- **PostgreSQL**: My default standard for transactional services, relational integrity, ACID compliance, and JSONB flexibility.
- **MongoDB**: For polymorphic documents and aggregates where entities are frequently read and written as complete nested units.
- **Redis**: For ultra-low-latency in-memory caching, distributed locks, session stores, and rate limiters.
- **DynamoDB**: For serverless architectures requiring predictable single-digit millisecond latency at arbitrary scale."

```sql
-- Production PostgreSQL table with UUIDs, indexing, and JSONB document storage:
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_metadata_gin ON users USING GIN (metadata);
```

### 3. How do you handle schema migrations without downtime?
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

### 4. Describe a severe database performance issue you resolved.
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

### 5. Strategy for database security and connection pooling:
**In Simple Words:**
- **Networking**: Databases live in private VPC subnets with

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
- **Normali

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
4. **Seriali

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
- `EXPLAIN`: Shows the optimi

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
WHERE o.id IS NULL; -- Users with

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

### 17. The N+1 Query Problem in ORMs:
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

