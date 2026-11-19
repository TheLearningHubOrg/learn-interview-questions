# Modern Data Warehousing: Snowflake, BigQuery & dbt Master Interview Bank (1 - 8)

> Snowflake multi-cluster shared data architecture, Google BigQuery slot reservations & columnar storage (Capacitor), dbt ELT data modeling & incremental models, and Apache Airflow DAG orchestration.

---

### 1. What is a Lakehouse Architecture, and how does Delta Lake provide ACID transactions on Object Storage?
**In Simple Words:**
Traditional architectures had two silos: raw Data Lakes (cheap S3 storage, fast ingestion, but no transactions or updates) and Data Warehouses (fast SQL, ACID, but expensive and locked in).

**The Lakehouse (Delta Lake / Apache Iceberg)**:
Brings Data Warehouse reliability directly onto cheap Cloud Object Storage (S3, GCS, A

### 2. Snowflake Architecture: Storage, Virtual Warehouses, and Micro-Partitioning.
**In Simple Words:**
Snowflake completely decouples compute from storage:
1. **Centrali

### 3. Kimball Dimensional Modeling: Fact Tables vs. Dimension Tables and Star Schema vs. Snowflake Schema.
**In Simple Words:**
- **Fact Table**: Contains numerical metrics / measurements of a business process (`order_amount`, `quantity_sold`) with foreign keys linking to dimensions. Fact tables are tall and narrow.
- **Dimension Table**: Contains descriptive context for filtering and grouping (`customer_name`, `store_location`, `product_category`). Dimension tables are wide.
- **Star Schema**: Dimensions are denormali

### 4. Slowly Changing Dimensions: SCD Type 1 vs. SCD Type 2.
**In Simple Words:**
How to handle updates when dimension attributes change (e.g. customer changes address from NY to CA):
- **SCD Type 1 (Overwrite)**: Overwrite old address with new address. Historical purchases in NY are now inaccurately attributed to CA.
- **SCD Type 2 (Add New Row - Standard)**: Retain history by adding a new row with a new surrogate key, and track validity with `valid_from`, `valid_to`, and `is_current = true/false` flags.

### 5. Snowflake Architecture: Database Storage vs. Virtual Warehouses vs. Cloud Services Layer.
**In Simple Words:**
Snowflake completely decouples storage and compute into three independent layers:
1. **Cloud Storage Layer**: Scalable columnar micro-partition files stored in Amazon S3 or Google Cloud Storage.
2. **Virtual Warehouse Layer**: Independent clusters of compute nodes (T-shirt sizes: XS, S, M, L, XL). Multiple warehouses can read/write the same underlying data without resource contention.
3. **Cloud Services Layer**: Manages authentication, metadata, query parsing, optimization, and transaction ACID coordination.

### 6. dbt (Data Build Tool): Ephemeral vs. View vs. Table vs. Incremental Materializations.
**In Simple Words:**
In dbt, models are pure `SELECT` SQL queries. dbt manages how the result is materialized:
1. **View**: Rebuilt as a standard database view on every run (`CREATE VIEW`).
2. **Table**: Fully drops and recreates the physical table (`CREATE TABLE AS SELECT`). Slow for big tables.
3. **Ephemeral**: Never written to the database; interpolated into downstream queries as a Common Table Expression (CTE).
4. **Incremental**: Only processes rows that were inserted or modified since the last dbt execution using a timestamp watermark, reducing query runtimes from hours to minutes.

### 7. Dimensional Data Modeling: Star Schema vs. Snowflake Schema.
**In Simple Words:**
- **Star Schema**: Central **Fact Table** (metrics: sales revenue, quantities) surrounded by de-normalized **Dimension Tables** (customers, products, dates). Fast queries with simple single-hop joins; favored in modern columnar warehouses.
- **Snowflake Schema**: Dimension tables are normalized into sub-dimension tables (e.g. Product -> Category -> Department). Saves storage, but requires complex multi-table joins.

### 8. Apache Airflow: DAG Architecture, Task Dependencies, and Idempotency.
**In Simple Words:**
Airflow orchestrates data workflows via Directed Acyclic Graphs (DAGs) defined in Python:
- **Scheduler**: Evaluates DAG schedules and submits tasks to worker queues (Celery / Kubernetes).
- **Workers**: Execute the task instances.
- **Idempotency Rule**: Running a DAG for the same execution date twice must produce the exact same outcome without creating duplicate rows or corrupted state (e.g. using upserts or partition overwrites).

