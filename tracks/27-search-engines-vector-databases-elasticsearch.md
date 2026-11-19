# Search Engines, Vector Databases & Semantic Retrieval: Elasticsearch & Pinecone Master Interview Question Bank (1 - 50)

> Comprehensive, production-grade interview questions covering Elasticsearch & OpenSearch (Inverted Index, BM25 Scoring, Analyzers, Cluster Sharding), and Vector Databases (HNSW, IVFFlat, Pinecone, Milvus, Qdrant, ChromaDB, and Hybrid Search).

---

## Part 1: Elasticsearch & Full-Text Search Internals (1 - 25)

### 1. How does the Lucene Inverted Index work internally in Elasticsearch?
**In Simple Words:**
A traditional database indexes rows to find columns. An **Inverted Index** inverts the relationship: it maps every unique **Term/Word** to a sorted list of Document IDs (Posting List) where that word appears, along with term frequency and position offsets.

When searching for `"distributed consensus"`, Elasticsearch intersects the Posting List for `distributed` with the Posting List for `consensus` using bitwise operations, returning matching document IDs in microseconds without scanning document texts!

### 2. How does the BM25 (Best Matching 25) Scoring Algorithm rank search results?
**In Simple Words:**
BM25 calculates document relevance scores using three factors:
1. **Term Frequency (TF)**: How often the search term appears in the document (with diminishing returns to prevent keyword stuffing).
2. **Inverse Document Frequency (IDF)**: Rare terms (e.g. `"Zookeeper"`) receive a much higher score than common words (e.g. `"the"`, `"is"`).
3. **Field-Length Normalization**: Matches in short fields (e.g. a 5-word title) are scored higher than matches in a 1,000-word body paragraph.

### 3. Text Analysis Pipeline in Elasticsearch: Character Filters, Tokenizers, and Token Filters.
**In Simple Words:**
Before indexing or searching, raw text passes through an **Analyzer**:
1. **Character Filter**: Strips HTML tags (`strip_html`) or replaces patterns.
2. **Tokenizer**: Splits character streams into discrete tokens (e.g. `standard` tokenizer splits on whitespace and punctuation).
3. **Token Filter**: Mutates and filters tokens:
   - `lowercase`: Normalizes casing.
   - `stop`: Removes common stop words (`a`, `an`, `the`).
   - `stemmer` (Snowball / Porter): Reduces words to root form (`running` -> `run`).
   - `synonym`: Expands search terms (`quick` -> `fast`).

### 4. Elasticsearch Cluster Architecture: Primary vs. Replica Shards, Routing, and Split-Brain Prevention.
**In Simple Words:**
- An Elasticsearch Index is split into multiple **Primary Shards** distributed across cluster nodes for horizontal scale.
- Each primary shard has zero or more **Replica Shards** for high availability and read scale.
- **Routing**: Documents are routed to shards using: `shard = hash(routing_key) % total_primary_shards`. (This is why primary shard count cannot be changed after creation!).
- **Master Node Election**: In Elasticsearch 7+, a Raft-based consensus protocol prevents Split-Brain by requiring a majority quorum of master-eligible nodes.

---

## Part 2: Vector Databases & Semantic Search (26 - 50)

### 5. Keyword Search (BM25) vs. Semantic Vector Search: When to Use Which.
**In Simple Words:**
- **Keyword Search (BM25)**: Exact lexical matching. Fast and accurate for exact product codes, acronyms, SKUs, and names. Fails when queries use synonyms or natural language intent.
- **Vector Search (Embeddings)**: Neural networks (OpenAI, BERT) convert text into high-dimensional vectors (e.g. 1536 floating-point numbers). Documents with similar conceptual meaning land close together in vector space. Matches `"how to stay healthy"` with `"nutrition and cardio guidelines"` even if they share zero overlapping words.
- **Hybrid Search (Modern Standard)**: Combines BM25 and Vector Search using **Reciprocal Rank Fusion (RRF)** to get the best of both worlds!

### 6. Vector Indexing Algorithms: Flat vs. IVFFlat vs. HNSW (Hierarchical Navigable Small World).
**In Simple Words:**
1. **Flat Index**: Exact k-Nearest Neighbors (kNN). Computes distance to every vector in the database. 100% recall, but $O(N)$ latency is too slow for millions of vectors.
2. **IVFFlat (Inverted File Flat)**: Clusters vectors into Voronoi cells using k-means. At query time, only searches vectors in the closest centroids. Faster, but lower recall.
3. **HNSW (Hierarchical Navigable Small World - Industry Gold Standard)**:
   - Builds a multi-layer geometric graph structure inspired by skip lists.
   - Top layers have long-range sparse connections for fast coarse navigation.
   - Bottom layers have dense local connections for precise nearest-neighbor convergence.
   - Delivers logarithmic $O(log N)$ search latency with $>95%$ recall!

### 7. Distance Metrics in Vector Space: Cosine Similarity vs. Dot Product vs. Euclidean Distance (L2).
**In Simple Words:**
- **Cosine Similarity**: Measures the cosine of the angle between two vectors ($-1$ to $1$). Ignores vector magnitude (length); best when document text lengths vary.
- **Dot Product**: Multiplies corresponding components. If vectors are **normalized** (unit length $= 1$), dot product is mathematically equivalent to cosine similarity but runs significantly faster on CPU SIMD instructions!
- **Euclidean Distance (L2)**: Measures straight-line geometric distance between two vector points. Smaller distance means higher similarity.
