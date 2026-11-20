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


---

### 36. BigQuery Architecture: Dremel Execution Engine, Colossus Storage, Borg, and Jupiter Network.

**In Simple Words:**
BigQuery is a completely serverless multi-tenant data warehouse powered by Google's internal infrastructure:
1. **Dremel (Compute)**: A dynamic, tree-structured multi-stage execution engine that allocates thousands of transient worker slots to evaluate SQL in parallel.
2. **Colossus (Storage)**: Google's global distributed filesystem. Data is stored in **Capacitor** (an advanced columnar format with RLE and dictionary encoding), completely decoupled from compute.
3. **Jupiter Network**: Petabit-scale bisection bandwidth network mesh allowing compute slots to read from Colossus disks at up to **10 Terabits/sec**, eliminating traditional storage locality bottlenecks.
4. **Borg**: Google's precursor to Kubernetes that schedules thousands of worker containers across data centers in milliseconds.

---

### 37. Partitioning vs Clustering in BigQuery: Architectural differences and best practices.

**In Simple Words:**
- **Partitioning**: Divides a table into physical date/timestamp, ingestion-time, or integer range segments (up to 4,000 partitions):
  ```sql
  CREATE TABLE orders (id INT64, order_date DATE, amount NUMERIC)
  PARTITION BY order_date
  OPTIONS (require_partition_filter = true);
  ```
  - Queries filtering by `order_date` skip unneeded partition files entirely, reducing billed scan bytes to near zero.
- **Clustering**: Sorts and colocates rows within each partition by up to 4 columns (`CLUSTER BY customer_id, status`):
  - Capacitor groups identical cluster keys into adjacent data blocks.
  - Unlike partitioning, clustering has **no physical segment limit** and handles high-cardinality keys effortlessly.

---

### 38. BigQuery Slots and Capacity Planning: On-Demand pricing vs BigQuery Editions with Autoscaling.

**In Simple Words:**
- **On-Demand Billing**: You pay strictly for the **number of bytes scanned by queries** (typically $6.25 per TB). Ideal for ad-hoc exploration and unpredictable workloads.
- **BigQuery Editions (Standard, Enterprise, Enterprise Plus)**:
  - Billed for **Slot-Hours** (compute capacity).
  - **Dynamic Slot Autoscaling**: BigQuery scales slots up during heavy query spikes and down to baseline when idle.
  - Predictable monthly costs for enterprise production environments; unmetered query byte scanning.

---

### 39. BigQuery Storage Write API: Stream ingestion with gRPC, write offsets, and committed vs pending streams.

**In Simple Words:**
The modern high-throughput streaming ingestion API replacing legacy `tabledata.insertAll`:
- Uses binary **gRPC and Protocol Buffers**, delivering 10x higher ingestion speeds at 50% lower cost.
- **Committed Stream**: Records become immediately queryable in the table as soon as flushed.
- **Pending Stream (Transactional Batch Ingestion)**:
  - Workers stream millions of records into a temporary pending stream buffer.
  - When the ETL batch finishes successfully, you execute an atomic `Commit`.
  - If a worker crashes, the pending stream is discarded with zero partial write corruption.
- Supports **Exactly-Once Semantics** using client-provided stream write offsets.

---

### 40. BigQuery Omni: Multi-cloud analytics querying data directly in AWS S3 and Azure Blob Storage.

**In Simple Words:**
Analyzing data spread across multiple clouds without costly egress fees or cross-cloud ETL pipelines:
- **How it works**: Google deploys BigQuery's Dremel execution engine inside AWS and Microsoft Azure using Google Anthos.
- You write standard BigQuery SQL inside the GCP console:
  ```sql
  SELECT customer_id, SUM(price)
  FROM `aws-us-east-1.analytics.s3_external_sales`
  GROUP BY customer_id;
  ```
- The query executes **locally inside AWS / Azure**; only the tiny aggregated final result set transfers back to GCP.

---

### 41. BigQuery BI Engine: In-memory acceleration service and sub-second dashboard performance.

**In Simple Words:**
Dashboards (Looker, Tableau, PowerBI) often require sub-second response times, but standard BigQuery queries take 2-4 seconds due to slot allocation overhead:
- **BI Engine**: A fully managed in-memory execution service that caches hot table partitions in fast RAM.
- Features a **vectorized execution engine** that evaluates SQL directly on compressed in-memory columnar data.
- Yields sub-second dashboard refreshes and zero per-query byte scanning costs for cached data.

---

### 42. BigQuery ML (BQML): Training ML models directly with SQL.

**In Simple Words:**
Train and deploy machine learning models directly inside BigQuery without exporting data to Python or Pandas:
```sql
-- Train a customer churn model using XGBoost
CREATE OR REPLACE MODEL `analytics.churn_model`
OPTIONS(model_type='BOOSTED_TREE_CLASSIFIER', input_label_cols=['churned']) AS
SELECT tenure, monthly_spend, support_calls, churned
FROM `analytics.customer_features`;

-- Run predictions in real-time SQL
SELECT customer_id, predicted_churned
FROM ML.PREDICT(MODEL `analytics.churn_model`, TABLE `analytics.active_customers`);
```
- Supports Linear Regression, Logistic Regression, K-Means clustering, Matrix Factorization, and remote Vertex AI Gemini models.

---

### 43. Query Plan Execution and Optimization: Diagnosing "Resources exceeded during query execution".

**In Simple Words:**
When a query fails with `Resources exceeded`:
- **Root Cause**: The query exceeded the memory allocated to worker slots during an in-memory hash shuffle or sort.
- **Troubleshooting Steps**:
  1. Inspect **Query Plan Execution Details** in BigQuery console.
  2. Look for stages with high **Wait Time** (indicates slot starvation) vs high **Compute Time**.
  3. **Data Skew**: If one slot took 10 minutes while all others took 2 seconds, check for skewed join keys (e.g. `ON a.user_id = b.user_id` where `user_id` is frequently `NULL`).
  4. Avoid `ORDER BY` on un-aggregated tables without a `LIMIT` clause.

---

### 44. Materialized Views in BigQuery: Smart tuning, automated query rewrite, and incremental maintenance.

**In Simple Words:**
- **Materialized Views**: Pre-computed query tables refreshed incrementally in the background as new rows land in base tables:
  ```sql
  CREATE MATERIALIZED VIEW `analytics.daily_revenue_mv` AS
  SELECT order_date, region, SUM(amount) AS total_revenue
  FROM `analytics.raw_orders`
  GROUP BY order_date, region;
  ```
- **Smart Query Rewrite**: If a user runs a query against the raw `raw_orders` table, BigQuery's optimizer automatically detects the matching Materialized View and redirects the query to read the pre-computed summary instead, delivering 50x faster results at zero rewrite effort!

---

### 45. Column-Level Security (Policy Tags) and Row-Level Security in BigQuery.

**In Simple Words:**
- **Column-Level Security via Policy Tags (Data Catalog / Dataplex)**:
  - Create taxonomy tags: `PII -> High_Confidentiality`.
  - Attach the tag to the `ssn` column.
  - Users without the **Fine-Grained Reader** IAM role receive an `Access Denied` error if they attempt to query that column.
- **Row-Level Security**:
  ```sql
  CREATE ROW ACCESS POLICY emea_filter ON `sales`
  GRANT TO ("group:emea-sales@corp.com")
  FILTER USING (region = 'EMEA');
  ```

---

### 46. Time Travel and Table Snapshots: Querying past data and zero-copy snapshots.

**In Simple Words:**
- **Time Travel (up to 7 days)**: Query the state of any table at a past timestamp:
  ```sql
  SELECT * FROM `analytics.orders`
  FOR SYSTEM_TIME AS OF TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 3 HOUR);
  ```
- **Table Snapshots**: Create a point-in-time read-only copy of a table for long-term backup:
  ```sql
  CREATE SNAPSHOT TABLE `backup.orders_2024_q1`
  CLONE `analytics.orders`;
  ```
  - Pointer-based zero-copy storage; you only pay storage for rows that are subsequently modified in the base table.

---

### 47. Search Indexes and Vector Search in BigQuery: `SEARCH()` and `VECTOR_SEARCH`.

**In Simple Words:**
- **BigQuery Search Index**: Builds text indexes over `STRING` and `JSON` columns for point lookups:
  ```sql
  CREATE SEARCH INDEX log_search_idx ON server_logs(ALL COLUMNS);
  SELECT * FROM server_logs WHERE SEARCH(message, 'NullPointerException');
  ```
- **`VECTOR_SEARCH`**: Enables approximate nearest neighbor semantic search natively in SQL using cosine similarity or Euclidean distance over text/image embeddings generated via Vertex AI.

---

### 48. BigQuery Continuous Queries (BigQuery Streams): Real-time streaming SQL.

**In Simple Words:**
Traditionally, BigQuery was strictly a batch query engine. **Continuous Queries** turn BigQuery into a real-time stream processing platform:
- Define SQL queries that run continuously over incoming Pub/Sub topics or BigQuery table streams.
- As new events land, SQL transformations execute with low latency and write results directly to external Pub/Sub topics or Bigtable for reverse-ETL, without requiring separate Apache Beam / Dataflow infrastructure.

---

### 49. Cost Control Best Practices in BigQuery: Dry-run, maximum bytes billed, and partition filter enforcement.

**In Simple Words:**
Preventing developer queries from running multi-thousand-dollar scans:
1. **Dry-Run Validation**: Call the API with `dryRun=true` or inspect the query validator in the console to verify exact byte scan volume before running.
2. **Maximum Bytes Billed**: Set `maximum_bytes_billed = 107374182400` (100 GB). If a query's scan estimate exceeds 100 GB, it aborts instantly without incurring billing.
3. **Enforce Partition Filters**:
   ```sql
   ALTER TABLE `analytics.events` SET OPTIONS (require_partition_filter = true);
   ```
   Any query without a `WHERE _PARTITIONDATE = ...` is automatically rejected by the compiler.

---

### 50. BigQuery Data Governance: Dataplex integration, automated data quality, and lineage.

**In Simple Words:**
Managing enterprise compliance across thousands of BigQuery datasets:
- **Dataplex Universal Catalog**: Discovers, organizes, and classifies datasets across BigQuery and Cloud Storage lakes.
- **Automated Data Quality (Auto DQ)**: Runs scheduled declarative quality rules (`NOT_NULL`, `REGEX_MATCH`, `VALUE_RANGE`) without custom scripts, publishing quality scorecards to Google Cloud Monitoring.
- **End-to-End Data Lineage**: Automatically tracks upstream and downstream dependencies from Cloud Data Fusion pipelines, Dataform models, and Looker dashboards.
