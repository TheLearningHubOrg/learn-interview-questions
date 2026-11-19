# Google BigQuery Architecture, Analytics & FinOps Master Interview Bank (1 - 35)

> Comprehensive, production-grade technical interview questions covering BigQuery Serverless Architecture (Dremel, Capacitor, Jupiter), Partitioning, Clustering, Slot Reservations & Editions, Storage Write API, BigLake, BQML, and FinOps.

---

## Part 1: Serverless Architecture, Storage & Ingestion (1 - 10)

### 1. Explain Google BigQuery's Serverless Architecture: Dremel, Capacitor, and Jupiter?
**In Simple Words:**
BigQuery is completely serverless—there are no virtual machines, disks, or warehouses to manage. It separates compute, storage, and networking:

1. **Compute Engine (Dremel)**: Massively parallel query execution engine that turns SQL into multi-stage execution trees.
2. **Storage Engine (Capacitor)**: Columnar, compressed storage system designed for high scan throughput.
3. **Jupiter Network**: Google's petabit-scale bisection network that transfers terabytes per second between Dremel compute slots and Capacitor storage with zero bottleneck.

---

### 2. How does Table Partitioning work in BigQuery and what partitioning types are supported?
**In Simple Words:**
Partitioning divides a table into segments based on a key column. Queries filtering by partition key scan **only** relevant partitions, slashing query cost and latency.

#### Partition Types:
- **Ingestion-Time**: Partitioned by data arrival date (`_PARTITIONDATE`).
- **Date/Timestamp Column**: Partitioned by a column (e.g., `event_timestamp`). Supports Hourly, Daily, Monthly, or Yearly.
- **Integer Range**: Partitioned by an integer column (e.g., `customer_id` range).

---

### 3. Compare Table Partitioning vs Table Clustering in BigQuery?
**In Simple Words:**
- **Partitioning**: Coarse-grained division (max 4,000 partitions). Cost is calculated strictly on scanned partitions.
- **Clustering**: Fine-grained sorting of rows within partitions (up to 4 columns). BigQuery sorts data into blocks and skips blocks during query execution via metadata min/max pruning.

#### Best Practice:
Combine both: **Partition by date, Cluster by user_id and country**.

---

### 4. Explain BigQuery Slot Architecture and the difference between On-Demand and Editions Pricing?
**In Simple Words:**
A **Slot** is a virtual CPU and RAM unit used by BigQuery to execute SQL queries.

- **On-Demand Pricing**: Pay strictly for bytes scanned ($6.25 per TB). Ideal for bursty or unpredictable workloads.
- **BigQuery Editions (Standard, Enterprise, Enterprise Plus)**: Reserve slot capacity (e.g., 100 baseline slots + autoscaling). Predictable monthly pricing with zero surprise per-byte scan bills.

---

### 5. How does the BigQuery Storage Write API work and why did it replace the legacy Streaming API?
**In Simple Words:**
The **Storage Write API** uses gRPC streaming and Protocol Buffers to ingest millions of rows per second directly into BigQuery storage.
- **Exactly-Once Semantics**: Supports committed, pending, and default streams.
- **Cost**: 50% cheaper than the legacy `tabledata.insertAll` streaming API.

---

### 6. What is BigQuery BI Engine and how does it achieve sub-second dashboard response times?
**In Simple Words:**
**BI Engine** is an in-memory analysis service. It automatically caches frequently queried data structures in RAM and uses vectorized execution to return dashboard aggregations in milliseconds.

---

### 7. How does BigQuery handle Semi-Structured JSON data using the native JSON type?
**In Simple Words:**
The native `JSON` data type encodes and stores JSON fields using columnar compression. You query attributes with natural syntax (`order_data.customer.id`) without expensive string parsing.

---

### 8. What are External Tables and Federated Queries in BigQuery?
**In Simple Words:**
Allows querying data residing outside BigQuery:
- **Cloud Storage**: Parquet, ORC, CSV, JSON files.
- **Cloud SQL / Spanner**: Federated queries using `EXTERNAL_QUERY()`.

---

### 9. How do Wildcard Table Queries work in BigQuery and how do you limit scanned partitions?
**In Simple Words:**
Wildcard tables query multiple sharded tables using `*` (`FROM `project.dataset.events_*``). Use the pseudo-column `_TABLE_SUFFIX` to prune scans (`WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'`).

---

### 10. What is Query Dry Run in BigQuery and how does it prevent expensive accidental queries?
**In Simple Words:**
A Dry Run validates query syntax and estimates the exact number of bytes that will be scanned **without executing the query or incurring any cost**.

---


---

## Part 2: Query Optimization, Security & Analytics Engineering (11 - 24)

### 11. How do you diagnose Slot Starvation and Shuffle Bottlenecks in BigQuery Query Plans?
**In Simple Words:**
Inspect the **Query Execution Graph**:
- **Slot Time consumed vs Elapsed Time**: High ratio shows successful parallelism.
- **Shuffle Wait Time**: Indicates data skew where one worker is processing an unbalanced key.

---

### 12. How do Materialized Views work in BigQuery and what is Smart Query Rewrite?
**In Simple Words:**
BigQuery automatically maintains materialized view data as base tables change. Under **Smart Query Rewrite**, if an analyst queries the base table directly, BigQuery automatically rewrites the query to use the materialized view instead!

---

### 13. How does BigQuery Column-Level Security work using Policy Tags in Dataplex?
**In Simple Words:**
Define taxonomy policy tags (e.g., `PII_Confidential`). Assign tags to columns. Users without the Fine-Grained Reader IAM role receive an access denied error upon querying those columns.

---

### 14. How do you enforce Row-Level Security (RLS) in BigQuery using Row Access Policies?
**In Simple Words:**
Attach a Row Access Policy with filter predicates (`WHERE region = SESSION_USER()`). Users only see rows authorized for their identity without changing query SQL.

---

### 15. What are Authorized Views and Authorized Datasets in BigQuery?
**In Simple Words:**
Allows sharing aggregated view results with external users without granting them any access to the underlying sensitive base tables.

---

### 16. How does the Information Schema assist in auditing query performance and costs?
**In Simple Words:**
Query `INFORMATION_SCHEMA.JOBS_BY_PROJECT` to analyze total bytes billed, longest running queries, and slot consumption trends.

---

### 17. What is BigLake and how does it unify Data Lakes with BigQuery governance?
**In Simple Words:**
**BigLake** extends BigQuery's storage engine and governance (row-level and column-level security) to open table formats (Apache Iceberg, Delta Lake, Parquet) stored on Google Cloud Storage, AWS S3, and Azure Blob.

---

### 18. What is BigQuery ML (BQML) and how do you train models directly in SQL?
**In Simple Words:**
BQML allows data analysts to train machine learning models (Linear Regression, XGBoost, k-means) and generate predictions using pure SQL without exporting data to Python.

---

### 19. How do you integrate Large Language Models (Gemini) inside BigQuery using ML.GENERATE_TEXT?
**In Simple Words:**
Use remote models pointing to Vertex AI to run batch LLM prompts directly over millions of customer reviews or support tickets in BigQuery.

---

### 20. How do Broadcast Joins vs Hash Joins work in BigQuery?
**In Simple Words:**
- **Broadcast Join**: When joining a massive table with a small dimension table, BigQuery sends the entire small table to all worker slots, avoiding costly shuffle network transfers.
- **Hash Join**: When joining two large tables, BigQuery partitions both tables by the join key across the shuffle tier.

---

### 21. What is BigQuery Omni and how does it execute cross-cloud analytics?
**In Simple Words:**
BigQuery Omni runs Dremel query clusters natively inside AWS and Azure regions, allowing analytics over S3 and Azure Blob without paying cross-cloud data egress fees.

---

### 22. What are Session and Temporary Tables in BigQuery?
**In Simple Words:**
Temporary tables are scoped to a multi-statement transaction or script session. They are automatically deleted when the session finishes and incur zero persistent storage costs.

---

### 23. What is Table Snapshot and Table Clone in BigQuery?
**In Simple Words:**
- **Snapshot**: Read-only point-in-time reference.
- **Clone**: Read-write copy that only charges for delta changes (zero storage cost at creation).

---

### 24. How do you set Maximum Bytes Billed to guard against runaway query costs in BigQuery?
**In Simple Words:**
Configure the `maximum_bytes_billed` setting on queries or service accounts. If a query scans more data than the threshold, BigQuery aborts it before execution begins.

---


---

## Part 3: Enterprise FinOps, Disaster Recovery & Scale (25 - 35)

### 25. How do you tune queries to prevent "Resources Exceeded During Query Execution" in BigQuery?
**In Simple Words:**
Caused by heavy `ORDER BY` without limits, massive Cartesian joins (`CROSS JOIN`), or unbounded window functions. Fix by partitioning, filtering before joins, and using `APPROX_COUNT_DISTINCT()`.

---

### 26. What are Continuous Queries in BigQuery for real-time streaming pipelines?
**In Simple Words:**
SQL queries that run continuously over incoming Pub/Sub or Storage Write API streams and output events to Pub/Sub or Bigtable in real time.

---

### 27. How does Cross-Region Dataset Replication work in BigQuery for High Availability?
**In Simple Words:**
Replicates datasets asynchronously to a secondary region (e.g., `us-central1` to `us-east4`). In the event of regional failure, promote the replica to primary.

---

### 28. How do Data Clean Rooms work in BigQuery for privacy-safe data sharing?
**In Simple Words:**
Allows two organizations to join and analyze datasets without exposing raw user records, enforcing privacy and differential privacy aggregation.

---

### 29. How do you handle Schema Evolution with BigQuery and the Storage Write API?
**In Simple Words:**
BigQuery supports non-destructive schema evolution (adding nullable columns or relaxing `REQUIRED` to `NULLABLE`) dynamically without table locks.

---

### 30. What are Object Tables in BigQuery and how do you analyze unstructured data (audio, images)?
**In Simple Words:**
Object tables provide a SQL interface over unstructured files stored in Cloud Storage, enabling AI model inference over PDFs, images, and audio.

---

### 31. What is the difference between Physical Storage vs Logical Storage billing in BigQuery?
**In Simple Words:**
- **Logical**: Billed on uncompressed data.
- **Physical**: Billed on compressed bytes (higher rate per TB, but 3x to 5x less storage due to Capacitor compression).

---

### 32. How do you optimize Dataform pipelines inside BigQuery?
**In Simple Words:**
**Dataform** is Google's built-in SQL workflow orchestrator (similar to dbt) that compiles SQLX into optimized DAG execution pipelines.

---

### 33. How do you prevent Data Skew from degrading BigQuery analytical queries?
**In Simple Words:**
Salt join keys or split high-frequency NULL or default keys to prevent single slots from being overwhelmed during hash shuffle.

---

### 34. What are User-Defined Aggregate Functions (UDAFs) and JavaScript UDFs in BigQuery?
**In Simple Words:**
Allows implementing custom aggregation algorithms in SQL or writing JavaScript code directly inside queries for complex parsing.

---

### 35. When should you choose Google BigQuery over Snowflake or Amazon Redshift?
**In Simple Words:**
Choose BigQuery for a completely hands-off serverless environment, native integration with Google Cloud AI / Vertex AI, and predictable slot reservation pricing.
