# Apache Spark & Big Data Pipelines Master Interview Bank (1 - 9)

> Apache Spark Catalyst Optimizer, Tungsten execution engine, RDDs vs DataFrames, narrow vs wide transformations, shuffling bottlenecks, partition tuning, and Delta Lake ACID transactions.

---

### 1. Explain the Apache Spark Distributed Architecture: Driver, Cluster Manager, Executors, Tasks, and Slots.
**In Simple Words:**
Apache Spark is a distributed computing framework for large-scale data processing:
1. **Driver**: The master process. Contains the `SparkSession`, converts user code into a Directed Acyclic Graph (DAG) of stages and tasks, and coordinates execution via the Cluster Manager.
2. **Cluster Manager**: Allocates physical resources (YARN, Kubernetes, Standalone).
3. **Executors**: Worker processes running on cluster nodes. Each executor runs multiple concurrent **Tasks** in dedicated CPU **Slots** and manages memory for execution and caching.
4. **Task**: The smallest atomic unit of work, sent to an executor slot to process a single data partition.

### 2. Transformations vs. Actions: Narrow Transformations vs. Wide Transformations and the Shuffle Operation.
**In Simple Words:**
- **La

### 3. How does the Spark Catalyst Optimizer work (Analysis, Logical Plan, and Physical Plan)?
**In Simple Words:**
Catalyst optimi

### 4. Broadcast Hash Join vs. Sort-Merge Join in Apache Spark.
**In Simple Words:**
- **Sort-Merge Join (Default for large tables)**: Shuffles both tables across the network using the join key as the partitioner, sorts each partition on disk, and merges them. High network and disk overhead.
- **Broadcast Hash Join (BHJ)**: Used when one table is small (default $< 10$MB, configurable via `spark.sql.autoBroadcastJoinThreshold`).
  - The Driver downloads the small table, seriali

### 5. What is Data Skew in Spark, and how do you resolve it (Salting Technique)?
**In Simple Words:**
Data Skew happens when one partition contains vastly more data than others (e.g. 90% of user activity belongs to `user_id = 'guest'`). One executor takes 2 hours while all others finish in 30 seconds.

**The Salting Fix**:
Append a random integer (salt: `0..N`) to the skewed join key in the large table, and replicate the corresponding rows in the lookup table with all salt values. This distributes the hotspot key evenly across $N$ partitions, restoring balanced parallel execution.

---

## Part 2: Cloud Data Warehouses & Lakehouses (16 - 32)

### 6. Apache Spark Tungsten Engine: Off-Heap Memory and Whole-Stage Code Generation.
**In Simple Words:**
Tungsten is Spark's high-performance hardware execution engine:
1. **Off-Heap Memory Management**: Manages raw binary memory using `sun.misc.Unsafe` instead of Java objects, eliminating JVM Garbage Collection overhead and object header bloat.
2. **Cache-Aware Computation**: Organizes data structures in memory to match CPU L1/L2/L3 cache line boundaries.
3. **Whole-Stage Code Generation**: Collapses multi-operator pipelines (filter -> map -> project) into a single tight bytecode loop generated at runtime via Janino, eliminating virtual function call overhead.

### 7. Spark Narrow vs. Wide Dependencies (Transformations).
**In Simple Words:**
- **Narrow Transformations (`map`, `flatMap`, `filter`)**: Each partition of the parent RDD is used by at most one partition of the child RDD. Data does not move across machines; executes in-memory concurrently.
- **Wide Transformations (`groupByKey`, `reduceByKey`, `join`, `distinct`)**: Multiple child partitions depend on data from multiple parent partitions. Requires a **Shuffle** across the network to group matching keys onto the same executor nodes.

### 8. Spark Data Skew: Symptoms and Mitigation Strategies (Salting, Broadcast Joins).
**In Simple Words:**
**The Symptom**: 199 tasks finish in 5 seconds; 1 single task hangs for 20 minutes because 80% of data has the same key (e.g. `null` or high-volume customer).
**Mitigation Tactics**:
1. **Broadcast Hash Join**: If one DataFrame is small ($<10\text{MB}$ by default, or with `broadcast(smallDF)`), Spark copies the small dataset to every executor, completely eliminating the shuffle stage.
2. **Salting**: Append random integer suffixes (`key_1`, `key_2`, ..., `key_N`) to the skewed key before grouping to distribute rows across multiple shuffle partitions, then aggregate again without the salt.

### 9. Delta Lake: ACID Transactions, Time Travel, and Schema Enforcement.
**In Simple Words:**
Delta Lake adds an open-source storage layer on top of Parquet files in object storage (S3/GCS):
- **ACID Transaction Log (`_delta_log/`)**: Single source of truth. Mutations write new Parquet files and record atomic commit JSON logs.
- **Time Travel**: Query data at a specific historical timestamp or commit version:
  `spark.read.format("delta").option("versionAsOf", 12).load(path)`.
- **Schema Enforcement & Evolution**: Rejects writes that don't match the table schema, preventing data lake corruption.

