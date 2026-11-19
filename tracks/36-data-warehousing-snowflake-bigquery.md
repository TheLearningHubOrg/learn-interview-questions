# Modern Data Warehousing: Snowflake & BigQuery Master Interview Bank (1 - 35)

> OLAP vs OLTP, Star & Snowflake schemas, SCD Types 1-6, Snowflake 3-tier architecture, micro-partitioning, zero-copy cloning, BigQuery slots & Capacitor storage, query tuning, and cloud FinOps.

---

## Part 1: Data Warehousing Core & Dimensional Modeling (Junior / Entry-Level)

### 1. What is a Data Warehouse and how does OLAP differ from OLTP?
**In Simple Words:**
- **OLTP (Online Transaction Processing)**: Databases (PostgreSQL, MySQL) designed for rapid, real-time read/write transactions (e.g., e-commerce checkouts, banking). Optimized for concurrency, row-by-row lookups, and normalized tables (3NF) to eliminate redundancy.
- **OLAP (Online Analytical Processing)**: Data Warehouses (Snowflake, BigQuery, Redshift) designed for complex analytical queries scanning millions or billions of rows (e.g., aggregate sales by region over 5 years). Optimized for columnar storage, massive parallel processing (MPP), and denormalized dimensional models.

| Metric | OLTP (e.g. PostgreSQL) | OLAP (e.g. Snowflake / BigQuery) |
| :--- | :--- | :--- |
| **Primary Goal** | Real-time transaction processing | Historical reporting and business intelligence |
| **Query Pattern** | Simple reads/updates of specific single rows | Massive aggregation across millions of records |
| **Data Structure** | Highly normalized (3NF) | Denormalized (Star / Snowflake schemas) |
| **Storage Layout** | Row-oriented storage (heap files) | Columnar storage (compressed chunks) |
| **Read vs Write** | Balanced reads and writes | Read-heavy (batch or streaming inserts, rare updates) |

---

### 2. What are Fact Tables and Dimension Tables in Dimensional Modeling?
**In Simple Words:**
Dimensional modeling (pioneered by Ralph Kimball) structures analytical data into two fundamental types of tables:
- **Fact Table**: Contains quantitative numerical measurements, metrics, or facts of a business process (e.g., `revenue`, `quantity_sold`, `discount_amount`, `duration_seconds`). Almost all columns are either numeric measures or foreign keys pointing to dimension tables.
- **Dimension Table**: Contains descriptive context surrounding the business event (the "Who, What, Where, When, and Why"). For example, `Customer` (name, age, city), `Product` (category, brand), `Store` (address, manager).

```
          ┌───────────────────────────┐
          │     dim_customer          │
          ├───────────────────────────┤
          │ customer_key (PK)         │
          │ customer_name, email      │
          └─────────────┬─────────────┘
                        │
                        ▼
┌──────────────────┐  ┌─────────────────────────┐  ┌──────────────────┐
│    dim_store     │  │      fact_sales         │  │   dim_product    │
├──────────────────┤  ├─────────────────────────┤  ├──────────────────┤
│ store_key (PK)   ├─►│ sales_id (PK)           │◄─┤ product_key (PK) │
│ city, region     │  │ customer_key (FK)       │  │ product_name     │
└──────────────────┘  │ store_key (FK)          │  │ category, brand  │
                      │ product_key (FK)        │  └──────────────────┘
                      │ date_key (FK)           │
                      │ revenue, quantity, tax  │
                      └─────────────────────────┘
```

---

### 3. Compare Star Schema vs Snowflake Schema.
**In Simple Words:**
- **Star Schema**: Dimension tables are completely **denormalized**. A single `dim_product` contains product, category, and department info in one flat table. Highly preferred in modern data warehouses because flat tables minimize expensive table `JOIN` operations.
- **Snowflake Schema**: Dimension tables are **normalized** into sub-dimensions (e.g., `dim_product` joins to `dim_subcategory`, which joins to `dim_category`). Saves slight disk storage, but increases query execution time due to multi-table joins.

---

### 4. What are Slowly Changing Dimensions (SCD) Types 1, 2, 3, and 6?
**In Simple Words:**
Customer attributes change over time (e.g. John Doe moves from New York to California). SCD patterns handle attribute evolution:
- **SCD Type 1 (Overwrite)**: Overwrites the old value with the new value. No historical tracking.
  - *Example*: Update John's address to California. Historical revenue in NY is now attributed to CA.
- **SCD Type 2 (Historical Row Tracking - Industry Standard)**: Inserts a new row with a new surrogate key, marking the old row with `is_current = FALSE` and `valid_to = '2026-01-01'`. Preserves exact historical truth.
- **SCD Type 3 (Previous Value Column)**: Adds a new column `previous_state` to store the immediate prior value. Only tracks one level of history.
- **SCD Type 6 (Hybrid 1 + 2 + 3)**: Combines Types 1, 2, and 3 (1+2+3=6) to track full history while also keeping the current state available on historical rows.

```sql
-- SCD Type 2 Table Structure
SELECT customer_key, customer_id, state, valid_from, valid_to, is_current
FROM dim_customer
WHERE customer_id = 1001;

-- Results:
-- 501 | 1001 | New York   | 2024-01-01 | 2026-02-15 | FALSE
-- 842 | 1001 | California | 2026-02-15 | 9999-12-31 | TRUE
```

---

### 5. Why are Surrogate Keys preferred over Natural Keys in Data Warehouses?
**In Simple Words:**
- A **Natural Key** is a business identifier from source systems (e.g., user email or Social Security Number).
- A **Surrogate Key** is an artificially generated integer or hash (e.g., `customer_key = 10452`) managed strictly inside the data warehouse.

#### Why Surrogate Keys are Essential:
1. **Enables SCD Type 2**: A single customer ID (`CUST_100`) can have 3 historical rows. You need unique surrogate keys (`1`, `2`, `3`) to link fact records to the exact historical dimension state.
2. **System Independence**: Merging data from two acquisitions where both systems used duplicate customer IDs (`ID 1`).
3. **Performance**: Joining on a 4-byte or 8-byte integer surrogate key is significantly faster than joining on variable-length text strings (`UUID` or `email`).

---

### 6. Why does Columnar Storage outperform Row-Oriented Storage for Analytics?
**In Simple Words:**
- **Row-Oriented (Postgres/MySQL)**: Stores entire rows contiguously on disk (`[ID, Name, Age, Address, Phone]`). To calculate `AVG(Age)` across 100 million rows, the database must read all addresses, phones, and names off disk, saturating I/O bandwidth.
- **Columnar Storage (Snowflake, BigQuery, Parquet)**: Stores all values of a single column together (`[Age1, Age2, Age3...]`).
  - **I/O Pruning**: To calculate `AVG(Age)`, the engine reads **only the Age column blocks**, skipping 95% of table data on disk.
  - **Massive Compression**: Similar data types stored sequentially compress dramatically (e.g. dictionary encoding, run-length encoding), shrinking storage by 5x-10x.

---

### 7. What is the "Grain" of a Fact Table?
**In Simple Words:**
The **grain** is the exact definition of what a single row in a fact table represents.
- *Examples*: "One row per scanned barcode item on a cash register receipt", "One row per bank account per day", "One row per monthly aggregated website visit".
- **Rule**: You must define the grain *before* choosing dimensions or measures. Mixing grains (e.g. combining individual transaction items with daily totals in the same table) creates duplicate aggregations and inaccurate reports.

---

### 8. Explain Additive, Semi-Additive, and Non-Additive Facts.
**In Simple Words:**
- **Additive Facts**: Can be summed meaningfully across all dimensions (Time, Store, Customer). E.g., `sales_amount`, `units_sold`.
- **Semi-Additive Facts**: Can be summed across some dimensions, but **not across Time**. E.g., `account_balance`. (Summing checking account balances across 3 branches today is meaningful; summing balances across 30 days of the month is meaningless).
- **Non-Additive Facts**: Cannot be summed across any dimension. E.g., `unit_price`, `profit_margin_percentage`, `temperature`. (Must be aggregated using `AVG`, `MIN`, `MAX`).

---

### 9. What is the shift from ETL to ELT in modern cloud architectures?
**In Simple Words:**
- **Legacy ETL (Extract, Transform, Load)**: Data was extracted from databases, transformed on an expensive dedicated server (Informatica / SSIS) because on-premise databases couldn't handle transform compute, and loaded into the warehouse.
- **Modern ELT (Extract, Load, Transform)**: Raw, untransformed data is extracted and loaded directly into Snowflake or BigQuery storage (using Fivetran, Airbyte, or Kafka). The massive parallel processing (MPP) compute of the cloud data warehouse is then used to transform the data in-place using SQL / dbt.

---

### 10. What are Conformed Dimensions?
**In Simple Words:**
A **Conformed Dimension** is a standardized, consistent dimension table shared across multiple fact tables in an enterprise data warehouse.
For example, a single `dim_date` or `dim_customer` connects to both `fact_sales` and `fact_support_tickets`. This enables cross-functional analytics (e.g. analyzing how many support tickets a customer logged before making a purchase).

---

### 11. Compare Data Lakes, Data Warehouses, and Data Lakehouses.
**In Simple Words:**
- **Data Warehouse**: Curated, structured data optimized for fast SQL analytics and BI. High governance, ACID transactions, but historically expensive and closed formats.
- **Data Lake (S3, GCS)**: Inexpensive repository for raw, unstructured/semi-structured data (images, CSVs, logs). Highly scalable, but prone to becoming an unorganized "data swamp" without ACID guarantees.
- **Data Lakehouse (Delta Lake, Apache Iceberg)**: Modern hybrid architecture. Combines the inexpensive open object storage of data lakes with the ACID transactions, schema enforcement, time travel, and high performance of data warehouses.

---

### 12. What are the key pillars of Data Quality in Data Warehouses?
**In Simple Words:**
1. **Freshness / Timeliness**: Is data arriving within acceptable SLA windows?
2. **Completeness**: Are there unexpected null values in mandatory fields?
3. **Uniqueness**: Are primary keys duplicated due to pipeline retries?
4. **Validity**: Do values match expected schemas and enum ranges?
5. **Consistency**: Do numbers in the financial warehouse match source ERP logs?

---

## Part 2: Snowflake & BigQuery Engine Architectures (Mid-Level)

### 13. Explain Snowflake's 3-Tier Multi-Cluster Shared Data Architecture.
**In Simple Words:**
Snowflake completely decoupled compute from storage, solving the scalability bottlenecks of legacy databases.

#### The Three Layers:
1. **Cloud Services Layer**: The brain of Snowflake. Manages authentication, RBAC security, query parsing, metadata optimization, and transaction ACID management.
2. **Virtual Warehouses (Compute Layer)**: Stateless MPP compute clusters (EC2/GCP instances) that execute queries. Multiple warehouses can query the same underlying storage simultaneously without competing for CPU/RAM!
3. **Centralized Storage Layer**: Inexpensive cloud object storage (Amazon S3, Google Cloud Storage, Azure Blob). Data is stored in compressed, proprietary columnar micro-partitions.

```
       ┌────────────────────────────────────────────────────────┐
       │             Cloud Services Layer                       │
       │   (Security, Metadata, Query Optimizer, Transaction)   │
       └──────────────────────────┬─────────────────────────────┘
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      ▼                           ▼                           ▼
┌──────────────┐            ┌──────────────┐            ┌──────────────┐
│  Warehouse 1 │            │  Warehouse 2 │            │  Warehouse 3 │
│  (Marketing) │            │  (Analytics) │            │  (Data Eng)  │
└──────┬───────┘            └──────┬───────┘            └──────┬───────┘
       │                           │                           │
       └───────────────────────────┼───────────────────────────┘
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │            Centralized Storage Layer                   │
       │  (Micro-Partitions in Amazon S3 / GCS / Azure Blob)    │
       └────────────────────────────────────────────────────────┘
```

---

### 14. How does Micro-Partitioning work in Snowflake?
**In Simple Words:**
In traditional databases, administrators must manually partition tables by date and build B-Tree indexes.
In Snowflake, all data is automatically divided into contiguous, immutable **micro-partitions** (50 to 500 MB of uncompressed data).
- For every micro-partition, Snowflake automatically records metadata: minimum value, maximum value, distinct count, and NULL counts for every single column.
- During query execution, Snowflake's optimizer uses this metadata to perform **Partition Pruning**, skipping hundreds of thousands of micro-partitions without reading them from S3!

---

### 15. What is Snowflake Zero-Copy Cloning?
**In Simple Words:**
Zero-Copy Cloning (`CREATE TABLE clone_db CLONE prod_db;`) creates an instantaneous copy of a table, schema, or entire petabyte database **without copying any physical data files**!
- It simply duplicates the metadata pointers in the Cloud Services layer.
- Both tables point to the exact same immutable micro-partitions.
- Storage costs are zero until you mutate the clone, at which point new micro-partitions are written (Copy-On-Write).

```sql
-- Instantly clone a production table for developer testing
CREATE TABLE customers_dev CLONE customers_prod;
```

---

### 16. How do Snowflake Time Travel and Fail-Safe work?
**In Simple Words:**
- **Time Travel**: Allows querying or restoring data as it existed at any point in the past (up to 90 days on Enterprise edition). If a developer accidentally runs `DROP TABLE users;`, it can be recovered instantly with `UNDROP TABLE users;`.
- **Fail-Safe**: A non-configurable 7-day period immediately following the Time Travel retention window. Accessible **only by Snowflake Support** for catastrophic disaster recovery.

```sql
-- Query data as it existed 30 minutes ago
SELECT * FROM orders AT(OFFSET => -60*30);

-- Query data prior to a specific bad transaction ID
SELECT * FROM orders BEFORE(STATEMENT => '01b2c3d4-0000-1234-0000-56789abcdef0');
```

---

### 17. How do Virtual Warehouses auto-scale in Snowflake?
**In Simple Words:**
- **Vertical Scaling (Scale Up)**: Resizing a warehouse (e.g. from `Small` to `X-Large`). Doubles the compute nodes per step to speed up a single massive, complex query.
- **Horizontal Scaling (Scale Out - Multi-Cluster Warehouses)**: Automatically adds additional warehouse clusters of the same size when many users run queries simultaneously, eliminating query queue times.
  - **Standard Scaling**: Spawns new clusters aggressively as soon as queries queue.
  - **Economy Scaling**: Waits to ensure a cluster will stay busy before spinning it up.

---

### 18. What are Snowflake Streams and Tasks?
**In Simple Words:**
Native primitives for building continuous, serverless ELT pipelines inside Snowflake:
- **Stream**: A Change Data Capture (CDC) object placed on a table that tracks all `INSERT`, `UPDATE`, and `DELETE` events and metadata (`METADATA$ACTION`).
- **Task**: A scheduled or stream-triggered cron runner that executes SQL statements (e.g. merging stream changes into a target fact table).

```sql
CREATE STREAM orders_stream ON TABLE raw_orders;

CREATE TASK process_orders_task
  WAREHOUSE = transform_wh
  SCHEDULE = '5 MINUTE'
  WHEN SYSTEM$STREAM_HAS_DATA('orders_stream')
AS
  MERGE INTO fact_orders f
  USING orders_stream s ON f.order_id = s.order_id
  WHEN MATCHED AND s.metadata$action = 'DELETE' THEN DELETE
  WHEN MATCHED THEN UPDATE SET f.status = s.status
  WHEN NOT MATCHED THEN INSERT (order_id, status) VALUES (s.order_id, s.status);
```

---

### 19. Explain Google BigQuery's Architecture (Dremel, Capacitor & Jupiter).
**In Simple Words:**
BigQuery is Google's fully managed, serverless enterprise data warehouse built on three planetary-scale Google technologies:
1. **Dremel**: The execution engine that decomposes SQL queries into execution trees and distributes them across thousands of workers in parallel.
2. **Capacitor**: The proprietary columnar storage format residing on Google's distributed file system (**Colossus**).
3. **Jupiter**: Google's multi-petabit datacenter network that transfers data between compute slots and storage at 100+ Gbps per node.

---

### 20. Compare BigQuery On-Demand Pricing vs Editions & Slot Reservations.
**In Simple Words:**
- **On-Demand Pricing**: You pay strictly for the number of bytes scanned by your queries ($6.25 per TB scanned). Ideal for unpredictable or ad-hoc workloads. A badly written `SELECT *` on a 50 TB table will cost over $300!
- **Capacity Pricing (Editions: Standard, Enterprise, Enterprise Plus)**: You reserve dedicated or autoscaling compute units called **Slots** (virtual CPUs). Costs are predictable, and queries do not bill per byte scanned.

---

### 21. How do Partitioning and Clustering optimize BigQuery queries?
**In Simple Words:**
- **Partitioning**: Segments a table into daily, monthly, or hourly slices based on a date/timestamp column or integer range. Queries filtering on `WHERE transaction_date = '2026-03-01'` only scan that single partition, reducing scanned bytes and cost by 99%!
- **Clustering**: Sorts and colocates data within partitions based on up to 4 columns (e.g., `customer_id`, `status`). Enables BigQuery to prune blocks within a partition.

```sql
CREATE TABLE `project.analytics.orders`
PARTITION BY DATE(order_timestamp)
CLUSTER BY customer_id, store_id
AS SELECT * FROM raw_orders;
```

---

### 22. What is BigQuery BI Engine?
**In Simple Words:**
**BigQuery BI Engine** is a built-in, in-memory analysis service. It automatically caches frequently queried table partitions and columns into high-speed memory, delivering sub-second response times for interactive BI dashboards (Looker, Tableau, Power BI) without pre-aggregating data.

---

### 23. How do Snowflake and BigQuery handle Semi-Structured JSON data?
**In Simple Words:**
Both engines offer native, first-class querying of JSON without requiring schema definitions:
- **Snowflake**: Uses the `VARIANT` data type. Columns are queried using colon notation (`payload:user.address.zipcode::string`) and unnested with `FLATTEN()`.
- **BigQuery**: Uses the native `JSON` type or repeated record arrays (`ARRAY<STRUCT>`), queried using dot notation and flattened using `CROSS JOIN UNNEST()`.

```sql
-- Snowflake JSON Querying
SELECT 
  event_data:user_id::INT AS user_id,
  event_data:device.os::STRING AS os_name
FROM raw_events;

-- BigQuery JSON Querying
SELECT 
  INT64(json_payload.user_id) AS user_id,
  STRING(json_payload.device.os) AS os_name
FROM raw_events;
```

---

### 24. What are Materialized Views in Data Warehouses?
**In Simple Words:**
A regular View is just a saved SQL query executed on every run.
A **Materialized View** precomputes and stores the physical query results on disk. When underlying base tables are updated, the data warehouse engine automatically updates the materialized view in the background. If a query matches the view's definition, the query optimizer automatically routes to the materialized view for instant results.

---

## Part 3: Performance Tuning, Cost Governance & Enterprise Analytics (Senior / Staff)

### 25. How do you diagnose Query Profile issues in Snowflake (Local vs Remote Spilling)?
**In Simple Words:**
In the Snowflake Query Profile, if an operation's memory requirement exceeds the available RAM of the Virtual Warehouse:
1. **Spilling to Local Storage**: Data spills to the warehouse node's local SSD. Query slows down moderately.
2. **Spilling to Remote Storage**: Local SSD is exhausted, so data spills to Amazon S3 / Google Cloud Storage. Query performance plummets dramatically!

#### Remediation:
- Increase Warehouse size (e.g. from `Medium` to `Large`) to provide more RAM.
- Optimize query joins, reduce cardinality before grouping, or avoid `SELECT *`.

---

### 26. How do you implement FinOps and Cost Governance in Snowflake?
**In Simple Words:**
Without guardrails, auto-scaling warehouses can trigger massive cloud bills:
1. **Resource Monitors**: Set credit limits on warehouses with alerts at 80% and automated suspension at 100%.
2. **Auto-Suspend & Auto-Resume**: Set warehouse `AUTO_SUSPEND = 60` (suspend after 60 seconds of inactivity).
3. **Statement Timeout**: Set `STATEMENT_TIMEOUT_IN_SECONDS = 3600` so runaway queries terminate automatically.

```sql
CREATE RESOURCE MONITOR marketing_monitor
  WITH CREDIT_QUOTA = 500
  FREQUENCY = MONTHLY
  START_TIMESTAMP = IMMEDIATELY
  TRIGGERS ON 80 PERCENT DO NOTIFY
           ON 100 PERCENT DO SUSPEND;
```

---

### 27. How do you diagnose Slot Starvation in BigQuery?
**In Simple Words:**
In BigQuery Capacity reservations, if too many heavy queries run concurrently, available compute slots are exhausted.
- **Symptom**: Query latency spikes and the Query Execution Graph shows high **Slot Contention / Wait Time**.
- **Remediation**: Configure **Dynamic Slot Autoscaling** (e.g., scale from 500 to 2,000 slots during peak hours) or assign critical executive dashboards to dedicated reservation pools.

---

### 28. What is Secure Data Sharing in Snowflake?
**In Simple Words:**
Traditional data sharing requires dumping CSVs to SFTP or S3, resulting in stale data and security leaks.
Snowflake **Secure Data Sharing** shares live database tables directly with external Snowflake accounts (or non-Snowflake users via Reader Accounts) without moving or copying physical files.
The consumer queries the producer's data in real-time, paying for their own compute while reading the producer's encrypted S3 micro-partitions.

---

### 29. How do you enforce Row-Level Security (RLS) and Dynamic Column Masking?
**In Simple Words:**
- **Dynamic Data Masking**: Anonymizes sensitive columns (SSN, credit card, email) at query time based on user role:

```sql
CREATE MASKING POLICY email_mask AS (val STRING) RETURNS STRING ->
  CASE 
    WHEN CURRENT_ROLE() IN ('COMPLIANCE_OFFICER') THEN val
    ELSE '***MASKED***'
  END;

ALTER TABLE customers MODIFY COLUMN email SET MASKING POLICY email_mask;
```

- **Row Access Policy**: Restricts which rows a user can see (e.g., regional sales managers see only their assigned territory).

---

### 30. What is Apache Iceberg and how is it transforming Snowflake and BigQuery?
**In Simple Words:**
Historically, loading data into Snowflake locked it into proprietary storage formats.
**Apache Iceberg** is an open-source high-performance table format for huge analytic tables. Both Snowflake and BigQuery (via **BigLake**) natively support querying and writing Iceberg tables located on external S3 or GCS buckets, providing ACID transactions, time travel, and schema evolution while preventing vendor lock-in.

---

### 31. What is the difference between Broadcast Joins and Hash Shuffle Joins?
**In Simple Words:**
- **Broadcast Join**: When joining a massive fact table (10 billion rows) with a tiny dimension table (50 rows), the engine copies the entire tiny dimension table to all compute nodes. Zero network shuffling of the large table is required!
- **Hash Shuffle Join**: When joining two massive tables, rows from both tables with matching join keys are hashed and transmitted across the network to the same compute node. Network bandwidth can become a major bottleneck if join keys are skewed.

---

### 32. What is Snowpipe vs Snowpipe Streaming?
**In Simple Words:**
- **Snowpipe (Batch Micro-Partitioning)**: Monitors cloud storage (S3 bucket notifications) and loads files into Snowflake tables within 1 to 2 minutes of file arrival.
- **Snowpipe Streaming**: Bypasses cloud storage files entirely! Uses an SDK/Kafka connector to stream row-level data directly into Snowflake's compute memory, making records queryable in **sub-second latency**.

---

### 33. What is BigQuery Storage Write API?
**In Simple Words:**
The **Storage Write API** is BigQuery's high-performance streaming ingestion API. It combines streaming ingestion with batch processing guarantees:
- Provides **Exactly-Once Semantics** using stream offsets.
- Streams row data encoded in binary Protocol Buffers (`Protobuf`) directly into BigQuery storage at lower cost than the legacy `tabledata.insertAll` API.

---

### 34. What are Snowflake Hybrid Tables (Unistore)?
**In Simple Words:**
Historically, Snowflake was strictly an OLAP data warehouse.
**Hybrid Tables** introduce transactional OLTP capabilities inside Snowflake, providing row-level locking, primary key constraints, foreign key enforcement, and single-digit millisecond point lookups alongside analytical queries in a unified platform.

---

### 35. How do you design Cross-Region & Cross-Cloud Disaster Recovery in Data Warehouses?
**In Simple Words:**
1. **Metadata & Storage Replication**: Continuously replicate database micro-partitions and Iceberg metadata from the primary cloud region (e.g. AWS us-east-1) to a secondary region or cloud provider (e.g. GCP us-central1).
2. **Failover Groups**: Configure automated failover groups that redirect client connection strings to the secondary region if the primary region encounters a total cloud outage, achieving near-zero RTO (Recovery Time Objective) and RPO (Recovery Point Objective).

