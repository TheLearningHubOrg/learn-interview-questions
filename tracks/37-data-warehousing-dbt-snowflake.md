# Data Warehousing, Snowflake & dbt Master Interview Bank (1 - 35)

> Cloud data warehouses, dimensional modeling (Star vs Snowflake schema), SCD Types 1-3, Snowflake micro-partitioning, Virtual Warehouses, Zero-Copy Cloning, dbt models, refs, incremental materializations, snapshots, and BigQuery analytics.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is the difference between OLTP and OLAP systems?
**In Simple Words:**
- **OLTP (Online Transaction Processing)**: Row-oriented databases (PostgreSQL, MySQL). Optimized for fast, concurrent, transactional CRUD operations touching a few rows at a time (e.g. order processing, user logins). Normalized to 3NF.
- **OLAP (Online Analytical Processing)**: Columnar databases (Snowflake, BigQuery, ClickHouse). Optimized for aggregating millions of rows across a few columns (e.g. calculating yearly revenue, customer churn trends).

```text
Row Store vs Column Store:
Row Store (OLTP):    [User 1: ID, Name, Age, Country] -> [User 2: ID, Name, Age, Country]
Column Store (OLAP): [Age: 25, 31, 42, ...] -> [Country: US, UK, DE, ...]
                     (Only reads the columns requested by the SELECT query!)
```

### 2. What is a Data Warehouse vs Data Lake vs Lakehouse?
**In Simple Words:**
- **Data Warehouse**: Centralized repository of highly structured, cleansed, curated data modeled for BI and reporting (e.g. Snowflake, BigQuery, Amazon Redshift).
- **Data Lake**: Repository storing raw, unprocessed data in native formats (JSON, CSV, Parquet, audio, video) on cheap object storage (e.g. Amazon S3, Azure ADLS).
- **Lakehouse**: Combines the best of both: ACID transactions, indexing, and governance directly on top of cheap open-format data lake files (e.g. Delta Lake, Apache Iceberg, Apache Hudi).

### 3. What is Dimensional Modeling: Star Schema vs. Snowflake Schema?
**In Simple Words:**
- **Star Schema**: A central **Fact Table** surrounded by denormalized **Dimension Tables**. Simple to query, minimizes JOINs, and delivers the highest query speed for analytical BI engines.
- **Snowflake Schema**: Dimension tables are further normalized into sub-dimensions (e.g. Product -> Category -> Department). Saves storage and eliminates redundancy, but requires more JOINs during queries.

```text
Star Schema Layout:
       [Dim_Date]
            │
[Dim_Customer] ── [Fact_Sales] ── [Dim_Store]
            │
       [Dim_Product]
```

### 4. What are Fact Tables vs Dimension Tables?
**In Simple Words:**
- **Fact Table**: Contains quantitative numeric measurements, metrics, and foreign keys to dimension tables (e.g. `sales_amount`, `quantity_sold`, `discount_rate`, `timestamp`). Rows represent business events.
- **Dimension Table**: Contains descriptive, qualitative contextual attributes used to filter and group facts (e.g. customer name, address, store region, product category).

### 5. What are Slowly Changing Dimensions (SCD Types 1, 2, and 3)?
**In Simple Words:**
Handles how dimension attributes that change over time are tracked:
- **SCD Type 1 (Overwrite)**: Overwrites the old value with the new value. No historical tracking (e.g. correcting a misspelled customer name).
- **SCD Type 2 (Add New Row - Industry Standard)**: Inserts a new row with a new surrogate key, setting `valid_from`, `valid_to`, and an `is_current` flag. Preserves full historical auditability.
- **SCD Type 3 (Add New Column)**: Keeps the previous value in a dedicated column (e.g. `current_city` and `previous_city`). Only tracks the single most recent change.

### 6. What is dbt (data build tool) and what is the ELT paradigm?
**In Simple Words:**
dbt is an open-source command-line tool that enables data analysts and engineers to transform data in their warehouse by writing simple SQL `SELECT` statements:
- **ETL (Legacy)**: Extract -> Transform (on a dedicated server) -> Load into Warehouse.
- **ELT (Modern)**: Extract -> Load (raw data directly into warehouse) -> **Transform** (using the massive compute power of Snowflake/BigQuery via dbt).
- dbt handles dependencies, data testing, version control, and auto-generated documentation.

### 7. What is a dbt Model and how does the `ref()` function work?
**In Simple Words:**
A dbt model is a single `.sql` file containing a `SELECT` query:
- **The `ref()` Macro**: Dynamically resolves dependencies between models. Instead of hardcoding `FROM raw_schema.stg_orders`, you write `FROM {{ ref('stg_orders') }}`.
- dbt automatically infers the Directed Acyclic Graph (DAG) execution order and resolves environment-specific database schemas (dev vs prod).

```sql
-- models/marts/fct_customer_orders.sql
WITH orders AS (
  SELECT * FROM {{ ref('stg_orders') }}
),
customers AS (
  SELECT * FROM {{ ref('stg_customers') }}
)
SELECT
  o.order_id,
  c.customer_id,
  c.customer_name,
  o.total_amount,
  o.order_date
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id;
```

### 8. What is Snowflake and what is its Multi-Cluster Shared Data architecture?
**In Simple Words:**
Snowflake is a cloud-native analytical data platform built with complete separation of **Compute** and **Storage**:
- Compute clusters (Virtual Warehouses) can be spun up, resized, and stopped in seconds with zero impact on underlying storage.
- All warehouses share access to the same centralized storage layer without copying data.

### 9. What are dbt Sources and Seeds?
**In Simple Words:**
- **Sources (`sources.yml`)**: Declare external raw tables loaded by EL tools (Fivetran, Airbyte) into the warehouse, enabling data freshness tracking (`dbt source freshness`).
- **Seeds (`seeds/`)**: Static CSV files version-controlled in the dbt git repository (e.g. country codes, tax tables) loaded into the warehouse with `dbt seed`.

### 10. What are dbt Tests (Generic vs. Singular)?
**In Simple Words:**
- **Generic Tests (Out-of-the-box)**: Assertions defined in YAML files: `unique`, `not_null`, `accepted_values`, and `relationships` (foreign key checks).
- **Singular Tests**: Custom `.sql` queries in `tests/` that assert business rules. If the query returns **0 rows**, the test passes; if any row returns, the test fails.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. How does Snowflake's Three-Layer Architecture operate?
**In Simple Words:**
1. **Database Storage Layer**: Stores data in proprietary, compressed, encrypted columnar files called **Micro-partitions** on cloud object storage (S3/Azure Blob/GCS).
2. **Compute Layer (Virtual Warehouses)**: Independent MPP (Massively Parallel Processing) compute clusters that process queries. Different teams can run isolated warehouses without resource contention!
3. **Cloud Services Layer**: Manages authentication, metadata, transactions, access control, and query optimization (the "brain" of Snowflake).

```text
Snowflake Architecture:
       [Cloud Services Layer: Security, Metadata, Optimizer]
                               │
       [Compute Layer: Virtual Warehouses (Independent MPP Clusters)]
           [Warehouse A (BI)]    [Warehouse B (ELT)]    [Warehouse C (Data Science)]
                               │
       [Storage Layer: Centralized Micro-Partitions (S3/GCS/Azure Blob)]
```

### 12. What are Snowflake Micro-partitions and Clustering Keys?
**In Simple Words:**
- **Micro-partitions**: Snowflake automatically partitions all data into contiguous chunks between **50 MB and 500 MB** of uncompressed data:
  - Columns are stored separately and compressed.
  - Metadata (min/max values, distinct count, null count) is stored in the Cloud Services layer for every column per partition.
- **Clustering Keys**: You can designate specific columns as clustering keys to co-locate similar data into the same micro-partitions, maximizing partition pruning during queries.

### 13. What is Partition Pruning in Snowflake and why does it accelerate queries?
**In Simple Words:**
When a query runs with a `WHERE order_date BETWEEN '2026-01-01' AND '2026-01-07'`:
- Snowflake checks the Cloud Services metadata layer **before reading any data from disk**.
- It instantly eliminates ("prunes") micro-partitions whose `min_date > '2026-01-07'` or `max_date < '2026-01-01'`.
- The warehouse only reads the tiny fraction of micro-partitions that actually contain matching data!

### 14. What are the 4 primary dbt Materializations (view, table, incremental, ephemeral)?
**In Simple Words:**
1. **`view` (Default)**: Creates a database view (`CREATE VIEW AS SELECT...`). Fast to build, but re-computes on every query.
2. **`table`**: Creates a physical table (`CREATE TABLE AS SELECT...`). Fast query reads, but rebuilds from scratch every run.
3. **`incremental`**: Appends or updates only new/modified rows since the last dbt execution, cutting compute costs by 90%+.
4. **`ephemeral`**: Interpolated directly into dependent models as a Common Table Expression (CTE); never written to the warehouse.

### 15. How do you implement a dbt Incremental Model?
**In Simple Words:**
An incremental model uses the `is_incremental()` Jinja macro to query only new records on subsequent runs:

```sql
{{
  config(
    materialized='incremental',
    unique_key='order_id',
    incremental_strategy='merge'
  )
}}

SELECT
  order_id,
  customer_id,
  total_amount,
  status,
  updated_at
FROM {{ ref('stg_orders') }}

{% if is_incremental() %}
  -- Runs only when the table already exists in the warehouse:
  WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
{% endif %}
```

### 16. What is Snowflake Zero-Copy Cloning and how does it work?
**In Simple Words:**
Zero-Copy Cloning creates a new database, schema, or table without physically copying any data:
- `CREATE TABLE dev_orders CLONE prod_orders;` executes in seconds!
- **Under the Hood**: Only duplicates the metadata pointers to existing immutable micro-partitions.
- Uses **Copy-On-Write**: Storage costs are only incurred when rows in the cloned table are modified or added.

### 17. How does Snowflake Time Travel and Fail-Safe work?
**In Simple Words:**
- **Time Travel (0 to 90 days)**: Allows querying, cloning, or restoring historical data as it existed at any point in the past using `AT(TIMESTAMP => ...)` or `BEFORE(STATEMENT => ...)`:
  - `SELECT * FROM orders AT(OFFSET => -60*10);` (view table as of 10 minutes ago).
- **Fail-Safe (Non-configurable 7 days)**: Post-Time Travel safety window accessible strictly through Snowflake Support to recover data from catastrophic events.

### 18. What are dbt Snapshots and how do they automate SCD Type 2 tracking?
**In Simple Words:**
dbt Snapshots capture point-in-time state changes of mutable source tables over time:
- Uses a `check` strategy (detects changes in specific columns) or a `timestamp` strategy (detects changes via `updated_at`).
- dbt automatically manages `dbt_valid_from`, `dbt_valid_to`, and `dbt_scd_id` columns.

```sql
-- snapshots/orders_snapshot.sql
{% snapshot orders_snapshot %}
{{
  config(
    target_schema='snapshots',
    unique_key='id',
    strategy='timestamp',
    updated_at='updated_at'
  )
}}
SELECT * FROM {{ source('ecom', 'raw_orders') }}
{% endsnapshot %}
```

### 19. What is Snowflake Secure Data Sharing?
**In Simple Words:**
Allows sharing live databases, schemas, or views with external accounts (customers, partners) **without copying or transferring files**:
- The consumer queries data live using their own virtual warehouse.
- Zero data egress cost, zero ETL maintenance, and changes by the provider are reflected instantaneously.

### 20. What is a Virtual Warehouse in Snowflake and how does auto-suspend work?
**In Simple Words:**
A Virtual Warehouse is an MPP compute cluster (sizes: X-Small to 6X-Large, where each step doubles CPU/RAM credits):
- **Auto-Suspend**: Automatically turns off the warehouse when idle for N minutes (e.g. 5 minutes), stopping all credit billing.
- **Auto-Resume**: Wakes up automatically in ~1 second when a new query arrives.

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. How does BigQuery's Architecture compare to Snowflake?
**In Simple Words:**
- **Snowflake**: Dedicated Virtual Warehouses allocated per user/team with predictable credit sizing.
- **BigQuery**: Completely serverless. Allocates computational compute dynamically through **Slots** (virtual CPUs) backed by Google's Borg cluster manager, Dremel execution engine, and Colossus distributed file system.
- **Pricing**: Snowflake charges per active warehouse second; BigQuery offers pure on-demand pricing per TB scanned ($6.25/TB) or flat-rate capacity slot reservations.

### 22. What are the best practices for BigQuery Partitioning and Clustering?
**In Simple Words:**
- **Partitioning**: Divides tables based on a date/timestamp column or integer range into physical daily/hourly slices. Queries with date filters scan only matching partitions.
- **Clustering**: Sorts data within each partition by up to 4 columns (e.g. `customer_id`, `country`). Colocates related data for blazing-fast filtering and aggregations.
- **Combine Both**: Partition by Date + Cluster by ID/Category for optimal cost and query speed.

### 23. What are the dbt Incremental Strategies: merge vs delete+insert vs append?
**In Simple Words:**
1. **`merge` (Snowflake/BigQuery default)**: Executes a single SQL `MERGE INTO` statement matching on `unique_key`. Updates existing rows and inserts new rows atomically.
2. **`delete+insert`**: Deletes matching records first, then inserts new rows. Useful for warehouses without performant `MERGE` operations.
3. **`append`**: Strictly inserts new records without checking for duplicates (ideal for immutable event logs and telemetry).

### 24. How do you optimize Snowflake Costs and credit consumption?
**In Simple Words:**
1. Set aggressive **Auto-Suspend** (1-2 minutes) on ELT and reporting warehouses.
2. Size warehouses appropriately (e.g. run ELT on Large, but BI on Small).
3. Use **Resource Monitors** with automated alerts and hard cutoff limits.
4. Avoid clustering on small tables (< 1 TB); let natural micro-partitioning handle pruning.
5. Maximize **Snowflake Result Caching**: Identical queries executed within 24 hours use the cached result set for 0 compute credits.

### 25. What is the dbt Semantic Layer and MetricFlow?
**In Simple Words:**
The Semantic Layer defines business metrics (e.g. "Monthly Recurring Revenue", "Customer Churn") in YAML code once:
- Guarantees that BI dashboards (Tableau, Looker), AI agents, and SQL analysts all calculate metrics using the exact same underlying logic.
- Eliminates the classic corporate discrepancy where Finance and Sales report differing revenue figures.

### 26. How do you orchestrate dbt in production with Apache Airflow or Dagster?
**In Simple Words:**
- **Airflow with Cosmos**: The open-source `astronomer-cosmos` package automatically parses your dbt project and renders every individual dbt model as an independent Airflow task in the DAG!
- Enables per-model retry, granular failure alerts (Slack/PagerDuty), and interleaving dbt models between ingestion jobs (Fivetran/Spark) and downstream BI cache invalidation.

### 27. What are Data Contracts and how do they prevent pipeline breakage?
**In Simple Words:**
Data Contracts are formal agreements between software engineers (data producers) and data engineers (data consumers):
- Enforced at source CI/CD pipelines using JSON Schema or Protobuf.
- Guarantees that backend schema migrations cannot delete or rename columns without a formal deprecation window, preventing catastrophic downstream ETL breaks.

### 28. What is the difference between Snowflake Streams and Tasks?
**In Simple Words:**
- **Streams (Change Data Capture - CDC)**: Tracks all DML changes (inserts, updates, deletes) made to a table, exposing a delta view.
- **Tasks**: Scheduled SQL jobs that run on a cron schedule or trigger automatically when a Stream contains new CDC data.
- Together, Streams and Tasks enable continuous serverless ELT pipelines inside Snowflake without external orchestrators.

### 29. How does dbt handle Blue-Green deployments in CI/CD?
**In Simple Words:**
1. **Slim CI (`dbt build --select state:modified+`)**: Compares PR branch code against production `manifest.json`, building and testing **only modified models and their downstream children**.
2. **Blue-Green Release**:
   - dbt builds transformed tables into a staging schema (`prod_green`).
   - Runs automated tests; if all pass, atomic schema swap / clone swaps `prod_green` into `prod_blue` instantly with 0 downtime for BI users.

### 30. How do you diagnose query performance using the Snowflake Query Profile?
**In Simple Words:**
The Query Profile visualizes execution tree operations:
- **Partitions Scanned vs Total**: If query scans 10,000 partitions out of 10,000, pruning failed (missing clustering or non-sargable query predicates).
- **Spilling to Remote / Local Storage**: Indicates warehouse memory was exhausted; intermediate sort/join buffers spilled to SSD or object storage (requires sizing up the warehouse).
- **Exploding Joins**: Cartesian products where output rows vastly exceed input rows.

### 31. What are Snowflake Dynamic Tables and how do they simplify pipeline modeling?
**In Simple Words:**
Dynamic Tables replace complex Streams & Tasks code with declarative SQL:
- You write: `CREATE DYNAMIC TABLE target_table TARGET_LAG = '10 minutes' AS SELECT ...`
- Snowflake automatically tracks upstream changes and refreshes data continuously to satisfy the 10-minute lag SLA.

### 32. What is Data Mesh and how does it organize data teams?
**In Simple Words:**
Data Mesh decentralizes monolithic data teams into domain-oriented product teams:
- **4 Core Principles**:
  1. Domain-oriented decentralized data ownership (e.g. Checkout team owns checkout facts).
  2. Data as a Product (clean APIs, SLAs, documentation).
  3. Self-serve data infrastructure platform.
  4. Federated computational governance.

### 33. How does BigQuery BI Engine accelerate dashboards?
**In Simple Words:**
BI Engine is a fast, in-memory analysis service built into BigQuery:
- Caches frequently accessed table segments and pre-computes query aggregations in memory.
- Delivers sub-second dashboard load times in Looker/PowerBI with zero query optimization code.

### 34. What is the Surrogate Key pattern in modern data modeling?
**In Simple Words:**
A Surrogate Key is a system-generated unique identifier (hash or auto-increment integer) used as the primary key of a dimension table:
- Generated in dbt using `dbt_utils.generate_surrogate_key(['customer_id', 'updated_at'])` (creates an MD5/SHA256 hash).
- Isolates the data warehouse from changes in natural keys in source transactional systems and enables SCD Type 2 version tracking.

### 35. When should you choose Snowflake vs BigQuery vs Databricks?
**In Simple Words:**
- **Snowflake**: Best-in-class SQL data warehousing, multi-cloud flexibility, effortless sharing, and zero maintenance overhead.
- **BigQuery**: Seamless Google Cloud ecosystem integration, serverless autoscaling, and integrated ML (`BigQuery ML`).
- **Databricks**: Best for unified Lakehouse architectures combining massive unstructured big data processing, Apache Spark, and advanced machine learning (PyTorch/MLflow).
