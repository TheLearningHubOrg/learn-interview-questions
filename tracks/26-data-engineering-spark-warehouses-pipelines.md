# Data Engineering, Apache Spark, Cloud Warehouses & Modern Data Stack Master Interview Question Bank (1 - 50)

> Comprehensive, production-grade interview questions covering Apache Spark (Core, PySpark, Catalyst Optimizer, Shuffling, Broadcast Joins), Real-Time Streaming (Flink), Cloud Warehouses (Snowflake, Databricks Delta Lake, BigQuery), Data Modeling (Kimball Star/Snowflake, SCD), and Orchestration (Airflow, dbt).

---

## Part 1: Apache Spark Architecture & PySpark Internals (1 - 15)

### 1. Explain the Apache Spark Distributed Architecture: Driver, Cluster Manager, Executors, Tasks, and Slots.
**In Simple Words:**
Apache Spark is a distributed computing framework for large-scale data processing:
1. **Driver**: The master process. Contains the `SparkSession`, converts user code into a Directed Acyclic Graph (DAG) of stages and tasks, and coordinates execution via the Cluster Manager.
2. **Cluster Manager**: Allocates physical resources (YARN, Kubernetes, Standalone).
3. **Executors**: Worker processes running on cluster nodes. Each executor runs multiple concurrent **Tasks** in dedicated CPU **Slots** and manages memory for execution and caching.
4. **Task**: The smallest atomic unit of work, sent to an executor slot to process a single data partition.

### 2. Transformations vs. Actions: Narrow Transformations vs. Wide Transformations and the Shuffle Operation.
**In Simple Words:**
- **Lazy Evaluation**: Spark does not compute transformations immediately; it builds an execution plan. Computation is only triggered when an **Action** (`count()`, `collect()`, `write()`) is called.
- **Narrow Transformations**: Each input partition contributes to at most one output partition (e.g. `map()`, `filter()`). **No network transfer needed; executed in-memory pipelined**.
- **Wide Transformations (Shuffle)**: Multiple input partitions contribute to multiple output partitions (e.g. `groupBy()`, `reduceByKey()`, `join()`).
  - **The Shuffle**: Requires serializing data, writing to executor local disk, transferring across the cluster network, and sorting at the receiver. **Shuffles are the #1 performance bottleneck in Spark jobs!**

### 3. How does the Spark Catalyst Optimizer work (Analysis, Logical Plan, and Physical Plan)?
**In Simple Words:**
Catalyst optimizes DataFrame and SQL queries through four stages:
1. **Analysis**: Resolves table and column names against the Catalog.
2. **Logical Optimization**: Applies rule-based optimizations:
   - **Predicate Pushdown**: Pushes filters (`WHERE age > 21`) down to the data source (Parquet/database) to skip reading irrelevant bytes off disk.
   - **Projection Pruning**: Reads only the columns used in the query.
3. **Physical Planning**: Generates multiple physical execution plans and uses a Cost-Based Optimizer (CBO) to select the fastest algorithm (e.g. choosing Broadcast Hash Join over Sort-Merge Join).
4. **Code Generation (Tungsten)**: Generates optimized Java bytecode on the fly (Whole-Stage Code Generation), eliminating virtual function dispatches.

### 4. Broadcast Hash Join vs. Sort-Merge Join in Apache Spark.
**In Simple Words:**
- **Sort-Merge Join (Default for large tables)**: Shuffles both tables across the network using the join key as the partitioner, sorts each partition on disk, and merges them. High network and disk overhead.
- **Broadcast Hash Join (BHJ)**: Used when one table is small (default $< 10$MB, configurable via `spark.sql.autoBroadcastJoinThreshold`).
  - The Driver downloads the small table, serializes it into an in-memory hash table, and broadcasts it to ALL executors.
  - **Zero Shuffle on the large table!** Massive speedup ($10	imes$).

```python
from pyspark.sql.functions import broadcast

# Explicitly force a Broadcast Join in PySpark
joined_df = large_orders_df.join(broadcast(small_dim_users_df), "user_id")
```

### 5. What is Data Skew in Spark, and how do you resolve it (Salting Technique)?
**In Simple Words:**
Data Skew happens when one partition contains vastly more data than others (e.g. 90% of user activity belongs to `user_id = 'guest'`). One executor takes 2 hours while all others finish in 30 seconds.

**The Salting Fix**:
Append a random integer (salt: `0..N`) to the skewed join key in the large table, and replicate the corresponding rows in the lookup table with all salt values. This distributes the hotspot key evenly across $N$ partitions, restoring balanced parallel execution.

---

## Part 2: Cloud Data Warehouses & Lakehouses (16 - 32)

### 6. What is a Lakehouse Architecture, and how does Delta Lake provide ACID transactions on Object Storage?
**In Simple Words:**
Traditional architectures had two silos: raw Data Lakes (cheap S3 storage, fast ingestion, but no transactions or updates) and Data Warehouses (fast SQL, ACID, but expensive and locked in).

**The Lakehouse (Delta Lake / Apache Iceberg)**:
Brings Data Warehouse reliability directly onto cheap Cloud Object Storage (S3, GCS, Azure Blob):
- **Parquet Data Files**: Columnar data stored in open Parquet files.
- **ACID Transaction Log (`_delta_log/`)**: Tracks every atomic commit via JSON changelogs.
- **Time Travel**: Read previous versions of the table by querying historic log snapshots (`SELECT * FROM orders VERSION AS OF 12`).
- **Schema Enforcement & Evolution**: Prevents corrupted bad data from polluting production tables.

### 7. Snowflake Architecture: Storage, Virtual Warehouses, and Micro-Partitioning.
**In Simple Words:**
Snowflake completely decouples compute from storage:
1. **Centralized Storage**: Shared immutable columnar data stored in cloud object storage, automatically divided into encrypted 50–500MB **Micro-Partitions**.
2. **Multi-Cluster Compute (Virtual Warehouses)**: Independent MPP compute clusters (T-shirt sizes X-Small to 4X-Large). A reporting warehouse running a heavy query does NOT slow down an ingestion warehouse!
3. **Cloud Services Layer**: Coordinates metadata, query optimization, authentication, and zero-copy cloning.

---

## Part 3: Dimensional Data Modeling & Orchestration (33 - 50)

### 8. Kimball Dimensional Modeling: Fact Tables vs. Dimension Tables and Star Schema vs. Snowflake Schema.
**In Simple Words:**
- **Fact Table**: Contains numerical metrics / measurements of a business process (`order_amount`, `quantity_sold`) with foreign keys linking to dimensions. Fact tables are tall and narrow.
- **Dimension Table**: Contains descriptive context for filtering and grouping (`customer_name`, `store_location`, `product_category`). Dimension tables are wide.
- **Star Schema**: Dimensions are denormalized and link directly to the central Fact table. (Fewer joins, fastest query performance in modern columnar warehouses).
- **Snowflake Schema**: Dimensions are normalized into secondary lookup tables (e.g. `product` links to `category` which links to `department`). Saves storage, but adds costly joins.

### 9. Slowly Changing Dimensions: SCD Type 1 vs. SCD Type 2.
**In Simple Words:**
How to handle updates when dimension attributes change (e.g. customer changes address from NY to CA):
- **SCD Type 1 (Overwrite)**: Overwrite old address with new address. Historical purchases in NY are now inaccurately attributed to CA.
- **SCD Type 2 (Add New Row - Standard)**: Retain history by adding a new row with a new surrogate key, and track validity with `valid_from`, `valid_to`, and `is_current = true/false` flags.

### 10. Modern Orchestration: Apache Airflow (DAGs) vs. dbt (Data Build Tool).
**In Simple Words:**
- **Apache Airflow**: Workflow orchestrator. Schedules and monitors tasks across diverse systems (extracting data from APIs, spinning up Spark clusters, triggering ML training).
- **dbt (data build tool)**: Focuses purely on the **Transformation (T)** layer inside the data warehouse using clean, modular, version-controlled SQL with automatic DAG dependency tracking, testing, and documentation generation.
