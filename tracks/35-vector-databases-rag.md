# Vector Databases & Vector Search Master Interview Bank (1 - 6)

> Vector embeddings, Approximate Nearest Neighbor (ANN) search, HNSW (Hierarchical Navigable Small World), IVFFlat, Cosine similarity vs Dot product, Pinecone, Milvus, and Hybrid Search (RRF).

---

### 1. Keyword Search (BM25) vs. Semantic Vector Search: When to Use Which.
**In Simple Words:**
- **Keyword Search (BM25)**: Exact lexical matching. Fast and accurate for exact product codes, acronyms, SKUs, and names. Fails when queries use synonyms or natural language intent.
- **Vector Search (Embeddings)**: Neural networks (OpenAI, BERT) convert text into high-dimensional vectors (e.g. 1536 floating-point numbers). Documents with similar conceptual meaning land close together in vector space. Matches `"how to stay healthy"` with `"nutrition and cardio guidelines"` even if they share

### 2. Vector Indexing Algorithms: Flat vs. IVFFlat vs. HNSW (Hierarchical Navigable Small World).
**In Simple Words:**
1. **Flat Index**: Exact k-Nearest Neighbors (kNN). Computes distance to every vector in the database. 100% recall, but $O(N)$ latency is too slow for millions of vectors.
2. **IVFFlat (Inverted File Flat)**: Clusters vectors into Voronoi cells using k-means. At query time, only searches vectors in the closest centroids. Faster, but lower recall.
3. **HNSW (Hierarchical Navigable Small World - Industry Gold Standard)**:
   - Builds a multi-layer geometric graph structure inspired by skip lists.
   - Top layers have long-range sparse connections for fast coarse navigation.
   - Bottom layers have dense local connections for precise nearest-neighbor convergence.
   - Delivers logarithmic $O(log N)$ search latency with $>95%$ recall!

### 3. Distance Metrics in Vector Space: Cosine Similarity vs. Dot Product vs. Euclidean Distance (L2).
**In Simple Words:**
- **Cosine Similarity**: Measures the cosine of the angle between two vectors ($-1$ to $1$). Ignores vector magnitude (length); best when document text lengths vary.
- **Dot Product**: Multiplies corresponding components. If vectors are **normali

### 4. HNSW (Hierarchical Navigable Small World) Graph Algorithm Explained.
**In Simple Words:**
HNSW is the state-of-the-art vector index algorithm:
- Constructs a multi-layer geometric graph where upper layers have sparse, long-range connections (like highway express lanes) and bottom layers have dense, local connections (local city streets).
- **Search Process**: Starts at top layer, greedily traverses to the closest node to query embedding, drops down a layer, and repeats. Achieves logarithmic $O(\log N)$ search latency with high recall.

### 5. Vector Distance Metrics: Cosine Similarity vs. Euclidean (L2) vs. Dot Product.
**In Simple Words:**
1. **Cosine Similarity**: Measures the angle between two vectors (range: $[-1, 1]$), ignoring magnitude. Ideal for text embeddings where document length varies.
2. **Dot Product (Inner Product)**: Measures both angle and magnitude. Computationally fastest when vectors are pre-normalized to unit length ($\|v\| = 1$), in which case Dot Product equals Cosine Similarity.
3. **Euclidean Distance (L2)**: Measures straight-line geometric distance between points in $N$-dimensional space.

### 6. Hybrid Search and Reciprocal Rank Fusion (RRF).
**In Simple Words:**
Pure vector search excels at conceptual semantic similarity but often misses exact keyword lookups (e.g. product SKU codes, part numbers).
- **Hybrid Search**: Runs BM25 keyword search and vector ANN search concurrently.
- **RRF (Reciprocal Rank Fusion)**: Combines the rank positions of results from both lists:
  $$\text{RRF Score} = \sum_{m \in \text{models}} \frac{1}{k + r_m(d)}$$
  Yields superior ranking quality without requiring score normalization across different metric scales.

