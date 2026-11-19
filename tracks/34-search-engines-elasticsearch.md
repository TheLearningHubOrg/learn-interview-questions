# Search Engines: Elasticsearch, OpenSearch & Lucene Master Interview Bank (1 - 7)

> Apache Lucene inverted index architecture, BM25 scoring algorithm, Elasticsearch sharding, tokenizers, analyzers, aggregations, fuzzy search, and cluster scaling.

---

### 1. How does the Lucene Inverted Index work internally in Elasticsearch?
**In Simple Words:**
A traditional database indexes rows to find columns. An **Inverted Index** inverts the relationship: it maps every unique **Term/Word** to a sorted list of Document IDs (Posting List) where that word appears, along with term frequency and position offsets.

When searching for `"distributed consensus"`, Elasticsearch intersects the Posting List for `distributed` with the Posting List for `consensus` using bitwise operations, returning matching document IDs in microseconds without scanning document texts!

### 2. How does the BM25 (Best Matching 25) Scoring Algorithm rank search results?
**In Simple Words:**
BM25 calculates document relevance scores using three factors:
1. **Term Frequency (TF)**: How often the search term appears in the document (with diminishing returns to prevent keyword stuffing).
2. **Inverse Document Frequency (IDF)**: Rare terms (e.g. `"Zookeeper"`) receive a much higher score than common words (e.g. `"the"`, `"is"`).
3. **Field-Length Normali

### 3. Text Analysis Pipeline in Elasticsearch: Character Filters, Tokenizers, and Token Filters.
**In Simple Words:**
Before indexing or searching, raw text passes through an **Analy

### 4. Elasticsearch Cluster Architecture: Primary vs. Replica Shards, Routing, and Split-Brain Prevention.
**In Simple Words:**
- An Elasticsearch Index is split into multiple **Primary Shards** distributed across cluster nodes for hori

### 5. Elasticsearch Sharding and Replication Architecture: Primary vs. Replica Shards.
**In Simple Words:**
- An Elasticsearch Index is partitioned into **Primary Shards** (fixed at creation) and **Replica Shards** (dynamic).
- **Write Path**: Request routes to the node holding the Primary shard -> Primary writes to Lucene index and translog -> forwards concurrently to Replica shards -> responds to client when quorum confirms.
- **Read Path**: Co-ordinator node load-balances search queries across primary and replica shards via round-robin.

### 6. Lucene Segment Merging and Refresh vs. Flush Operations.
**In Simple Words:**
- **Refresh (Default: every 1s)**: Writes in-memory buffer to new immutable Lucene index segments in OS page cache. Makes newly indexed documents searchable ("Near Real-Time").
- **Flush (Translog sync)**: Flushes memory segments to permanent disk and clears the transaction log.
- **Segment Merging**: Background process merging smaller immutable Lucene segments into larger ones while purging documents marked for deletion.

### 7. Elasticsearch Text Analysis: Character Filters, Tokenizers, and Token Filters.
**In Simple Words:**
Text fields pass through an **Analyzer** pipeline before indexing:
1. **Char Filters**: Cleans raw HTML (`html_strip`) or replaces patterns.
2. **Tokenizer**: Splits string into individual word tokens (e.g. `standard` whitespace/punctuation split, `ngram` for autocomplete).
3. **Token Filters**: Lowercases tokens, removes stop words ("and", "the"), applies stemming algorithms (Porter/Snowball: "running" -> "run"), and generates synonyms.

