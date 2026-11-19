# Elasticsearch & Search Engine Architecture Master Interview Bank (1 - 35)

> Apache Lucene inverted indexes, mappings, tokenizers, analyzers, Boolean queries, BM25 scoring, metric/bucket aggregations, segment merges, translogs, and cluster lifecycle management.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is Elasticsearch and how does it relate to Apache Lucene?
**In Simple Words:**
Elasticsearch is a distributed, JSON-based, RESTful search and analytics engine built on top of **Apache Lucene**:
- **Apache Lucene**: A low-level Java search library that implements inverted indexing, tokenization, and search algorithms on a single machine.
- **Elasticsearch**: Takes Lucene and wraps it in a distributed, horizontally scalable system with automatic sharding, cross-node replication, high availability, REST APIs, and multi-tenant clustering.

### 2. What are Clusters, Nodes, Indices, and Documents in Elasticsearch?
**In Simple Words:**
- **Cluster**: A collection of one or more connected servers (nodes) that collectively hold your entire data and provide federated search and indexing.
- **Node**: A single running instance of Elasticsearch running within the cluster.
- **Index**: A logical namespace that groups related documents (similar to a table in SQL, but optimized for search).
- **Document**: The basic unit of information represented as a JSON object (similar to a row in SQL).

```json
// Example Document indexed in "orders" index:
{
  "_index": "orders",
  "_id": "ord_101",
  "_source": {
    "orderId": "ORD-2026-99",
    "customer": "Alex Mercer",
    "totalAmount": 149.50,
    "status": "shipped",
    "createdAt": "2026-03-15T10:30:00Z"
  }
}
```

### 3. What is an Inverted Index and why is it so fast for text search?
**In Simple Words:**
Traditional databases index documents to words (Document -> Words). An **Inverted Index** inverts this relationship (Word -> List of Documents):
- It splits document text into individual vocabulary terms, standardizes them, and maintains a sorted list of every document ID where each term appears (called a **Posting List**).
- Searching for words becomes an instantaneous O(1) dictionary lookup, followed by intersecting or unioning document ID lists!

```text
Inverted Index Diagram:
Term           Posting List (Document IDs & Frequencies)
"kubernetes" -> [Doc 1 (tf: 2), Doc 4 (tf: 1)]
"docker"     -> [Doc 1 (tf: 1), Doc 2 (tf: 3), Doc 3 (tf: 1)]
"ingress"    -> [Doc 2 (tf: 1), Doc 4 (tf: 2)]
```

### 4. What is the difference between `text` and `keyword` data types?
**In Simple Words:**
- **`text`**: Analyzed and tokenized into individual terms. Used for full-text search (e.g. blog post bodies, product descriptions). Cannot be used for sorting or exact aggregation.
- **`keyword`**: Not analyzed; stored exactly as an unaltered string. Used for exact value lookups, filtering, sorting, and aggregations (e.g. email addresses, status codes, tags, UUIDs).

```json
// Mapping definition with multi-fields:
{
  "properties": {
    "title": {
      "type": "text",
      "fields": {
        "raw": { "type": "keyword" } // Allows both full-text search AND exact sorting!
      }
    }
  }
}
```

### 5. What is the difference between Primary Shards and Replica Shards?
**In Simple Words:**
- **Primary Shard**: A self-contained instance of a Lucene index holding a fraction of the index's total data. All document write operations route to the primary shard first.
- **Replica Shard**: An exact copy of a primary shard. Provides **high availability** (if the node holding the primary shard fails, the replica is instantly promoted to primary) and **scales read throughput** by serving search queries concurrently.

### 6. What are the basic Elasticsearch CRUD REST API endpoints?
**In Simple Words:**
- **Create / Index**: `PUT /my-index/_doc/1` or `POST /my-index/_doc`
- **Read**: `GET /my-index/_doc/1`
- **Update**: `POST /my-index/_update/1` (partial updates)
- **Delete**: `DELETE /my-index/_doc/1`
- **Search**: `GET /my-index/_search`

### 7. What is the difference between a Match Query and a Term Query?
**In Simple Words:**
- **Match Query**: The query string is passed through the analyzer (lowercased, stemmed, tokenized) before searching the inverted index. Used for **full-text fields** (`text`).
- **Term Query**: The query string is looked up **verbatim without any analysis**. Used strictly for **exact matches on `keyword` fields** (e.g. numbers, booleans, exact tags).

```json
// Term query for exact status match:
{
  "query": {
    "term": { "status": "active" }
  }
}
```

### 8. What is Dynamic Mapping and what are its risks in production?
**In Simple Words:**
Dynamic mapping automatically detects field types from incoming JSON and creates mapping definitions dynamically:
- **Risk (Mapping Explosion)**: If users send arbitrary or unbounded JSON keys (e.g. user-generated tags as key names), thousands of new fields are created in the cluster state.
- **Consequence**: Cluster state balloons in memory across all nodes, causing high JVM heap pressure and cluster instability. In production, always define explicit mappings or set `dynamic: strict`.

### 9. What is the Match Phrase query?
**In Simple Words:**
A Match Phrase query analyzes the input text and matches documents that contain the exact sequence of terms in the **exact specified order**:
- Supports a `slop` parameter (e.g. `slop: 2`), which allows terms to be separated by up to N intervening words while still matching.

### 10. How does the Bulk API work and why is it used for high-volume indexing?
**In Simple Words:**
The `_bulk` API executes multiple index, create, update, or delete operations in a single network request:
- Avoids the massive overhead of establishing individual HTTP request-response cycles.
- Dramatically increases indexing throughput (often 10x-50x faster than individual requests).
- Accepts newline-delimited JSON (NDJSON) format.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. How does the Bool Query work with must, filter, should, and must_not clauses?
**In Simple Words:**
The Bool query is the primary compound query in Elasticsearch:
- **`must`**: Clause must appear in matching documents. Contributes to the relevance `_score`.
- **`filter`**: Clause must appear in matching documents, but **does not compute relevance scores** and results are automatically **cached in memory**. Always use for boolean/range/keyword filters!
- **`should`**: Acts as an `OR` condition. If matching, boosts the document's `_score`.
- **`must_not`**: Acts as a `NOT` condition; documents matching this clause are strictly excluded (cached, no scoring).

```json
{
  "query": {
    "bool": {
      "must": [{ "match": { "description": "distributed database" } }],
      "filter": [
        { "term": { "category": "engineering" } },
        { "range": { "price": { "lte": 100 } } }
      ],
      "should": [{ "match": { "featured": true } }],
      "must_not": [{ "term": { "status": "archived" } }]
    }
  }
}
```

### 12. How does the BM25 relevance ranking algorithm calculate scores?
**In Simple Words:**
Okapi BM25 is the default scoring algorithm in Lucene / Elasticsearch, improving upon classical TF-IDF:
1. **Term Frequency (TF)**: How often the term appears in the document. BM25 uses asymptotic saturation, preventing a document with 100 mentions of a word from dominating one with 5 mentions.
2. **Inverse Document Frequency (IDF)**: Rare terms across the index get much higher weight than common terms like "the" or "is".
3. **Field Length Normalization**: Shorter fields containing the term score higher than massive documents where the term is just an incidental mention.

### 13. What is an Analyzer and what are its three components (Char Filters, Tokenizers, Token Filters)?
**In Simple Words:**
An analyzer converts raw text into a stream of indexed terms:
1. **Character Filters**: Pre-processes raw text before tokenization (e.g. stripping HTML tags `html_strip`, mapping `&` to `and`).
2. **Tokenizer**: Splits text into individual tokens (e.g. `standard` tokenizer splits by whitespace and punctuation).
3. **Token Filters**: Transforms, modifies, or discards tokens (e.g. `lowercase` filter, `stop` filter for common words, `snowball` or `porter_stem` for stemming words like "running" -> "run").

### 14. What are Metric Aggregations vs Bucket Aggregations?
**In Simple Words:**
Aggregations provide real-time analytics across documents:
- **Metric Aggregations**: Calculate mathematical summaries over a field: `avg`, `sum`, `min`, `max`, `cardinality` (distinct count using HyperLogLog++), `percentiles`.
- **Bucket Aggregations**: Group documents into sets/buckets based on criteria: `terms` (group by value), `date_histogram` (group by time intervals), `range` (group by numeric ranges).
- Buckets can nest sub-aggregations infinitely (e.g. group by country -> group by month -> calculate average order value).

```json
// Group orders by country and calculate total sales:
{
  "size": 0,
  "aggs": {
    "by_country": {
      "terms": { "field": "country.keyword" },
      "aggs": {
        "total_revenue": { "sum": { "field": "amount" } }
      }
    }
  }
}
```

### 15. How does Elasticsearch route a document to a specific shard?
**In Simple Words:**
When indexing a document, Elasticsearch determines the target primary shard using a hash formula:
$$shard = \text{hash}(routing) \pmod{\text{number\_of\_primary\_shards}}$$
- By default, `routing` is the document's `_id`.
- **Custom Routing**: You can pass `?routing=tenant_123` to force all documents belonging to a specific customer to live on the same shard, dramatically speeding up tenant-specific queries.

### 16. What are the pagination methods in Elasticsearch: from/size vs search_after vs scroll?
**In Simple Words:**
1. **`from` + `size`**: Traditional offset pagination. Limited by `index.max_result_window` (default 10,000). Fetching page 1,000 (offset 100,000) forces every shard to build and sort 100,000 documents in memory, causing OOM.
2. **`search_after` (Recommended)**: Cursor-based pagination using the sort values of the last document. Operates with constant memory and time complexity O(1).
3. **`scroll` API**: Creates a point-in-time snapshot for streaming massive datasets (e.g. reindexing millions of records). Not designed for real-time user requests.

### 17. How do Index Templates and Component Templates work?
**In Simple Words:**
Templates automatically apply settings (shard count, replica count) and mappings to newly created indices that match a name pattern (e.g. `logs-*`):
- **Component Templates**: Reusable modular building blocks (e.g. a standard timestamp mapping or common security settings).
- **Index Templates**: Compose multiple component templates into a unified configuration matching specific wildcard index patterns.

### 18. What is the difference between `nested` objects and `flattened` objects?
**In Simple Words:**
- **Standard Object Array**: Elasticsearch flattens arrays of objects, losing individual object boundaries (e.g. `user.first = ["Alice", "Bob"]` and `user.last = ["Smith", "Jones"]` matches "Alice Jones"!).
- **`nested` Data Type**: Indexes each array item as a hidden separate Lucene document, preserving object boundaries for precise multi-field queries (at the cost of slower indexing).
- **`flattened` Data Type**: Treats an entire complex JSON object with arbitrary keys as indexed keyword fields without mapping explosion.

### 19. How does Synonym filtering work in search?
**In Simple Words:**
Synonym token filters map alternative words to the same concept (e.g. `["couch", "sofa"]` or `["laptop", "notebook"]`):
- **Index-time Synonyms**: Expands synonyms when writing to disk. Fast search, but changes require reindexing the entire index!
- **Search-time Synonyms (Best Practice)**: Expands synonyms dynamically only when the query runs. Updating the synonym dictionary takes effect immediately without rebuilding indices.

### 20. How does Elasticsearch achieve High Availability during node failure?
**In Simple Words:**
- Elasticsearch ensures that a primary shard and its corresponding replica are **never placed on the same physical node**.
- If Node A holding Primary Shard 0 crashes:
  1. The Master node detects the heartbeat timeout.
  2. The Master immediately promotes the Replica Shard 0 on Node B to be the new Primary Shard.
  3. The cluster creates a new replacement replica shard on another healthy node to restore target redundancy.

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. How do Lucene Segments, Immutability, and Segment Merges work?
**In Simple Words:**
A Lucene shard consists of multiple immutable files called **Segments**:
- **Immutability**: Once written to disk, a segment is **never modified**. This allows segments to be cached in the OS file system cache without lock contention.
- **Deletes**: When an item is deleted or updated, it is marked as deleted in a `.del` bitset file (soft delete); the old data remains on disk.
- **Segment Merging (TieredMergePolicy)**: A background process continuously merges smaller segments into larger ones, purging deleted documents and reclaiming disk space.

### 22. What is the difference between a Refresh and a Flush in Elasticsearch?
**In Simple Words:**
- **Refresh (`refresh_interval`, default 1s)**: Writes in-memory indexing buffers to a new Lucene segment in the OS file system cache. The document becomes **searchable** ("Near Real-Time" search), but is not yet fsynced to disk.
- **Flush**: Executes a Lucene commit point. Fsyncs all OS cached segments to physical persistent disk and clears the **Translog** (Transaction Log). Happens every 30 minutes or when translog hits 512 MB.

```text
Write Lifecycle:
Document -> In-Memory Buffer & Translog (WAL)
                 │
           (Refresh: 1s)
                 ▼
          New Lucene Segment (Searchable in OS Cache)
                 │
           (Flush: 30m / 512MB)
                 ▼
          Fsync to Persistent Disk & Truncate Translog
```

### 23. What are the Node Roles in modern Elasticsearch clusters?
**In Simple Words:**
Separating node roles prevents resource contention at scale:
1. **`master` (Master-Eligible)**: Manages cluster state, shard allocation, index creation. Uses low CPU/RAM, zero user queries.
2. **`data`**: Stores shard data and executes query/aggregation workloads. Needs fast SSDs and high RAM.
3. **`ingest`**: Runs ingestion pipelines (grok parsing, enrich, date transforms) before indexing.
4. **`coordinating`**: Acts as a smart load balancer; receives user requests, scatters them to data nodes, and merges responses.

### 24. What is Index Lifecycle Management (ILM) and how do its 5 phases work?
**In Simple Words:**
ILM automates the aging of indices across hardware tiers to minimize infrastructure cost:
1. **Hot**: Active write and read traffic on high-performance NVMe SSDs.
2. **Warm**: No new writes; query traffic continues on cheaper SSDs. Merges segments to 1 segment (`_forcemerge`).
3. **Cold**: Infrequent queries; stored on cheap magnetic disks or backed by searchable snapshots in S3.
4. **Frozen**: Archival data searched rarely using searchable object storage.
5. **Delete**: Automatically deletes indices older than N days/months.

### 25. How do you prevent OutOfMemory (OOM) and manage JVM Heap in Elasticsearch?
**In Simple Words:**
- **The 50% Rule**: Never allocate more than **50% of physical system RAM** to Elasticsearch JVM Heap (max 31 GB to keep Compressed Ordinary Object Pointers - Compressed OOPs enabled).
- The remaining 50% RAM must be left free for the **OS File System Cache** so Lucene can cache index segments in memory.
- **Circuit Breakers**: Elasticsearch uses parent and fielddata circuit breakers (`indices.breaker.total.use_real_memory`) that automatically abort expensive queries before heap exhaustion causes a crash.

### 26. What is the difference between `doc_values` and `fielddata`?
**In Simple Words:**
Both are columnar data representations used for sorting and aggregations:
- **`doc_values`**: On-disk columnar store created at index time for all non-analyzed fields. Read directly by the OS page cache; never causes JVM heap OOM.
- **`fielddata`**: In-memory columnar data structure loaded dynamically into JVM heap when aggregating on analyzed `text` fields. High risk of memory exhaustion; disabled by default.

### 27. How does Elasticsearch achieve Master Node Consensus and prevent Split-Brain?
**In Simple Words:**
In Elasticsearch 7.x+, split-brain is prevented using a Raft-inspired master election algorithm:
- Requires a strict quorum: floor(N / 2) + 1 master-eligible nodes must agree.
- Master nodes maintain voting configurations that automatically adapt during node scale-up or maintenance.
- Eliminates the legacy `discovery.zen.minimum_master_nodes` configuration error.

### 28. How does the Write Path work in a distributed Elasticsearch cluster?
**In Simple Words:**
1. Client sends write request to any node (Coordinating Node).
2. Coordinating node determines the Primary Shard location via `hash(routing)`.
3. Request forwards to node holding the Primary Shard.
4. Primary validates the document, writes locally, and forwards the write in parallel to all in-sync Replica Shards.
5. Once all active replicas acknowledge the write, the Primary sends success to Coordinating Node, which responds to the client.

### 29. How does the Read / Search Path work in Elasticsearch (Scatter-Gather)?
**In Simple Words:**
1. **Query Phase (Scatter)**: Coordinating node broadcasts search query to a primary or replica shard for every shard in the index. Each shard computes local matching scores and returns top K document IDs and scores.
2. **Fetch Phase (Gather)**: Coordinating node merges all shard results, sorts them to determine the global top K, and sends targeted requests only to the specific shards holding those document IDs to retrieve the full `_source` JSON.

### 30. How do you optimize Elasticsearch for Maximum Indexing Throughput?
**In Simple Words:**
1. Use the `_bulk` API with batches of 5-15 MB.
2. Increase `index.refresh_interval` from 1s to 30s or disable it (`-1`) during bulk ingestion.
3. Set `number_of_replicas` to 0 during initial data loads, restoring replicas afterward.
4. Increase indexing buffer size (`indices.memory.index_buffer_size: 20%`).
5. Use auto-generated document IDs (avoids checking if an `_id` already exists in Lucene).

### 31. What is the difference between Dense Vector search in Elasticsearch and traditional search?
**In Simple Words:**
Elasticsearch 8.x supports a native `dense_vector` field type using HNSW indexing:
- Allows running exact lexical queries (BM25) and approximate semantic vector search within the **exact same query**:

```json
{
  "knn": {
    "field": "image_vector",
    "query_vector": [0.15, -0.42, 0.88],
    "k": 10,
    "num_candidates": 100
  },
  "query": {
    "match": { "category": "electronics" }
  }
}
```

### 32. What is Cross-Cluster Search (CCS) and Cross-Cluster Replication (CCR)?
**In Simple Words:**
- **CCS (Cross-Cluster Search)**: Enables a single coordinating node to execute federated queries across multiple independent clusters located in different data centers or cloud regions.
- **CCR (Cross-Cluster Replication)**: Unidirectional active-passive replication of indices from a leader cluster to a follower cluster for disaster recovery and local read latency.

### 33. What are Searchable Snapshots and how do they reduce cold storage costs by 80%?
**In Simple Words:**
Searchable snapshots allow searching read-only index snapshots stored directly in **Amazon S3, Azure Blob, or Google Cloud Storage**:
- Nodes download only small index headers and pull data blocks into local cache on demand.
- Eliminates the need to attach expensive persistent SSDs to cold and frozen data nodes.

### 34. How do you troubleshoot high CPU or long Garbage Collection pauses in Elasticsearch?
**In Simple Words:**
1. Run `GET /_nodes/hot_threads` to inspect which Java threads are consuming CPU (e.g. Lucene merge, query execution, regex).
2. Check thread pool rejections via `GET /_cat/thread_pool?v`.
3. Inspect slow logs (`elasticsearch_index_slowlog.log` and `elasticsearch_search_slowlog.log`).
4. Check garbage collection logs for Young/Old Gen GC pauses exceeding 1 second.

### 35. When should you NOT use Elasticsearch?
**In Simple Words:**
1. **Primary transactional system of record with ACID multi-table updates**: Elasticsearch does not support ACID multi-document transactions or foreign key constraints (use PostgreSQL/MySQL).
2. **Deep relational data modeling**: Joining multiple tables requires denormalization or slow application-side joins.
3. **Pure key-value caching with microsecond SLA**: Redis or Memcached provides 10x lower latency for simple key lookups.
